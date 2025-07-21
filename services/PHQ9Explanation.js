import { httpsCallable } from "firebase/functions"
import { functions } from "../firebaseConfig"

export const PHQ9Explanation = async (totalScore, severity) => {
    const explain = httpsCallable(functions, 'explainPHQ9Result');

    try {
        const result = await explain({totalScore, severity});
        return result.data;
    } catch (error) {
        console.error('Error calling explainPHQ9Result: ', error.message);
        if (error.details) console.error('details: ', error.details);
        throw error;
    }
}