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
