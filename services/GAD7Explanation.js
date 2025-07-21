import { httpsCallable } from "firebase/functions"
import { functions } from "../firebaseConfig"

export const GAD7Explanation = async (totalScore, severity) => {
    const explain = httpsCallable(functions, 'explainGAD7Result');

    try {
        const result = await explain({totalScore, severity});
        return result.data;
    } catch (error) {
        console.error('Error calling explainGAD7Result: ', error.message);
        if (error.details) console.error('details: ', error.details);
        throw error;
    }
}