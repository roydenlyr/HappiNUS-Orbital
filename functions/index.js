const functions = require("firebase-functions/v1");
const axios = require("axios");
const admin = require("firebase-admin");
admin.initializeApp();

const OPENAI_API_KEY = functions.config().openai.key;

exports.summariseChat = functions
  .region("us-central1")
  .runWith({ memory: "256MB", timeoutSeconds: 10}) // Optional tuning
  .https.onCall(async (data, context) => {
    const messages = data.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      throw new functions.https.HttpsError("invalid-argument", "Messages must be a non-empty array.");
    }

    const prompt = `Summarize the following anonymous support chat in a plain, readable format (no markdown, no formatting like asterisks or bold text). 
      Focus on:
      - Main concerns/issues
      - Emotional tone/distress signals
      - Key context or themes
      - Support offered by mentor
      - Follow-up actions and unresolved areas

      Here is the conversation:\n\n${messages.map(m => `${m.sender}: ${m.text}`).join('\n')}`;

    try {
        console.log('Sending prompt to OpenAI');
        
      const response = await axios.post(
        
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You summarise peer support chats for mentors." },
            { role: "user", content: prompt }
          ],
          temperature: 0.5
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      return { summary: response.data.choices[0].message.content };
    } catch (err) {
      console.error("OpenAI request failed:", err?.response?.status, err?.response?.data || err.message);

      if (err.response?.status === 429) {
        throw new functions.https.HttpsError("resource-exhausted", "Rate limit hit. Please try again later.");
      }

      throw new functions.https.HttpsError("internal", "Unexpected error during summarisation.");
    }
  });

  exports.rephraseMessage = functions
  .region("us-central1")
  .runWith({ memory: "256MB", timeoutSeconds: 10 })
  .https.onCall(async (data, context) => {
    const original = data.text;

    if (!original || typeof original !== "string") {
      throw new functions.https.HttpsError("invalid-argument", "Text must be a non-empty string.");
    }

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a peer support mentor. Rephrase the following message to be empathetic, supportive, and easy to understand. Use a warm, conversational tone. Avoid using complex punctuation like em dashes or semicolons. Keep the message clear and concise."
            },
            { role: "user", content: original }
          ],
          temperature: 0.7
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      return { rephrased: response.data.choices[0].message.content };
    } catch (err) {
      console.error("Rephrase request failed:", err?.response?.status, err?.response?.data || err.message);

      if (err.response?.status === 429) {
        throw new functions.https.HttpsError("resource-exhausted", "Rate limit hit. Please try again later.");
      }

      throw new functions.https.HttpsError("internal", "Unexpected error during rephrasing.");
    }
  });

  exports.deleteExpiredChatRooms = functions.pubsub
    .schedule("every 1 hours")
    .onRun(async (context) => {
      const db = admin.firestore();
      const now = admin.firestore.Timestamp.now();
      const threeDaysAgo = admin.firestore.Timestamp.fromMillis(now.toMillis() - 3 * 24 * 60 * 60 * 1000);

      const snapshot = await db.collection("rooms").where("active", "==", false)
        .where("inactiveOn", "<=", threeDaysAgo).get();

      const batch = db.batch();
      
      for (const doc of snapshot.docs){
        const data = doc.data();
        if (!data.inactiveOn) {
          console.warn(`Skipping room ${doc.id} - missing inactiveOn field.`);
          continue;
        }

        await deleteCollection(db, doc.ref.collection('messages'));
        batch.delete(doc.ref);
      };

      await batch.commit();
      console.log(`Deleted ${snapshot.size} expired chat rooms.`);
      return null;
    });

  const deleteCollection = async (db, collectionRef, batchSize = 100) => {
    const query = collectionRef.limit(batchSize);
    const snapshot = await query.get();
    if (snapshot.empty) return;

    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    return deleteCollection(collectionRef, batchSize);
  }

  exports.deleteAccount = functions.https.onCall(async (data, context) => {
    const { userId } = data;

    if (!userId) {
      throw new functions.https.HttpsError('invalid-argument', 'User ID is required.');
    }

    const DEFAULT_IMAGE_KEYWORDS = [
      'smile.jpg',
      'smile2.jpg'
    ];

    try {
      await admin.auth().deleteUser(userId);

      // await admin.firestore().collection('users').doc(userId).delete();
      const userDocRef = admin.firestore().collection('users').doc(userId);
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        const profileUrl = userData?.profileUrl

        if (profileUrl && !DEFAULT_IMAGE_KEYWORDS.some(k => profileUrl.includes(k))){
          const match = profileUrl.match(/\/o\/(.*?)\?alt/);
          if (match && match[1]) {
            const filePath = decodeURIComponent(match[1]);
            await admin.storage().bucket().file(filePath).delete().catch(err => {
              console.warn('Profile picture deletion warning: ', err.message);
            });
          }
        }
        await userDocRef.delete();
      }

      return {success: true, message: 'User account deleted successfully.'};
    } catch (error) {
      console.error('Deletion failed: ', error);
      throw new functions.https.HttpsError('internal', 'Failed to delete mentor account.');
    }
  })

  exports.registerMentor = functions.https.onCall(async (data, context) => {
    const { email, password, username, faculty, gender, dob, matricYear } = data;

    // if (!context.auth || context.auth.token.role !== 'admin') {
    //   throw new functions.https.HttpsError('permission-denied', 'Only admins can register mentors.');
    // }

    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: username,
      });

      await admin.firestore().collection('users').doc(userRecord.uid).set({
        userId: userRecord.uid,
        username,
        profileUrl: 'https://firebasestorage.googleapis.com/v0/b/happinus-ba24a.firebasestorage.app/o/profilePictures%2Fsmile.jpg?alt=media&token=54944b3f-caa7-4066-b8e1-784d4c341b23',
        role: 'mentor',
        faculty,
        gender,
        dob,
        matricYear,
        activeAlert: false
      });

      return {success: true, uid: userRecord.uid};
    } catch (error) {
        let msg = error.message;
        if(msg.includes('(auth/invalid-email)')) {
            msg = 'Invalid email';
        }
        if(msg.includes('(auth/email-already-in-use)')) {
            msg = 'This email is already in use';
        }
        return {success: false, msg};
    }
  })