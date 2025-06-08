import {getFunctions, httpsCallable } from 'firebase/functions';

export const summariseChat = async (messages, studentId) => {
    const functions = getFunctions();
    const summarise = httpsCallable(functions, 'summariseChat');

    // Converting Firestore messages to a simple sender/text format
    const formatted = messages.map(m => ({
        sender: m.userId === studentId ? 'student' : 'mentor',
        text: m.text
    }))

    try {
        const result = await summarise({ messages: formatted });
        return result.data.summary;
    } catch (err) {
        console.error('Error calling summariseChat:', err.message);
        if (err.details) console.error('details:', err.details);
        throw err;
    }
}