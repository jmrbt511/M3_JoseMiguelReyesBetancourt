// Transformación pura de datos (compartida entre cliente y serverless).
const ROLE_TO_GEMINI = { user: "user", assistant: "model" };

export const toGeminiContents = (messages) =>
  messages
    .filter(
      (m) =>
        m.role in ROLE_TO_GEMINI &&
        typeof m.content === "string" &&
        m.content.trim(),
    )
    .map((m) => ({
      role: ROLE_TO_GEMINI[m.role],
      parts: [{ text: m.content }],
    }));

export const buildGeminiBody = (character, messages) => ({
  systemInstruction: { parts: [{ text: character.persona }] },
  contents: toGeminiContents(messages),
  generationConfig: { temperature: 0.9, maxOutputTokens: 1024 },
});

export const extractReply = (data) => {
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .map((p) => p.text ?? "")
    .join("")
    .trim();
  if (!text) throw new Error("Respuesta vacía o bloqueada por el modelo.");
  return text;
};
