import { getFunctions, httpsCallable } from 'firebase/functions';

export const rephraseMessage = async (text) => {
  const rephraseFn = httpsCallable(getFunctions(), 'rephraseMessage');

  try {
    const response = await rephraseFn({ text });
    return response.data.rephrased;
  } catch (err) {
    console.error('Error rephrasing text:', err.message || err);
    throw err;
  }
};
