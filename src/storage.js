import { initialState } from "./state.js";

const KEY = "baker-street-chat:conversations";

export const loadState = (storage = localStorage) => {
  try {
    const raw = storage.getItem(KEY);
    return raw
      ? { ...initialState, conversations: JSON.parse(raw) }
      : initialState;
  } catch {
    return initialState;
  }
};

export const saveConversations = (conversations, storage = localStorage) => {
  try {
    storage.setItem(KEY, JSON.stringify(conversations));
  } catch {}
};
