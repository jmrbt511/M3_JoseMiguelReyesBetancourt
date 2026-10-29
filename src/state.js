// Reductores puros: cada función devuelve un estado nuevo.
export const initialState = { conversations: {}, status: 'idle' };

export const addMessage = (state, id, message) => ({
  ...state,
  conversations: { ...state.conversations, [id]: [...(state.conversations[id] ?? []), message] },
});
export const startLoading = (state) => ({ ...state, status: 'loading' });
export const succeed = (state, id, reply) => ({
  ...addMessage(state, id, { role: 'assistant', content: reply }),
  status: 'idle',
});
export const fail = (state, id, message) => ({
  ...addMessage(state, id, { role: 'error', content: message }),
  status: 'idle',
});
