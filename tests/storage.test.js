import { describe, it, expect } from "vitest";
import { loadState, saveConversations } from "../src/storage.js";

const fakeStorage = () => {
  const data = {};
  return {
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => {
      data[k] = v;
    },
  };
};

describe("almacenamiento", () => {
  it("guarda y recupera las conversaciones", () => {
    const storage = fakeStorage();
    const conversations = { holmes: [{ role: "user", content: "Hola" }] };
    saveConversations(conversations, storage);
    expect(loadState(storage).conversations).toEqual(conversations);
  });

  it("devuelve el estado inicial si no hay nada guardado", () => {
    expect(loadState(fakeStorage()).conversations).toEqual({});
  });
});
