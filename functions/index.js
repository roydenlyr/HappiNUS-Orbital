const functions = require("firebase-functions/v1");
const axios = require("axios");

const OPENAI_API_KEY = functions.config().openai.key;

exports.summariseChat = functions
  .region("us-central1")
  .runWith({ memory: "256MB", timeoutSeconds: 10, failurePolicy: false }) // Optional tuning
  .https.onCall(async (data, context) => {
    const messages = data.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      throw new functions.https.HttpsError("invalid-argument", "Messages must be a non-empty array.");
    }

    const prompt = `Summarize the following anonymous support chat:\n\n${messages.map(m => `${m.sender}: ${m.text}`).join('\n')}`;

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
              content: "You are a peer support mentor. Rephrase the message to be empathetic, clear, and supportive. Do not use em dash."
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
