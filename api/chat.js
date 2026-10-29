// Función serverless de Vercel: mantiene la clave de Gemini en el servidor.
import { findCharacter } from "../src/characters.js";
import { buildGeminiBody, extractReply } from "../src/transform.js";

const MAX_MESSAGES = 40;

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método no permitido." });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey)
    return res
      .status(500)
      .json({ error: "Falta GEMINI_API_KEY en el servidor." });

  const { characterId, messages } = req.body ?? {};
  const character = findCharacter(characterId);
  if (!character || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Solicitud no válida." });
  }

  const model = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(
        buildGeminiBody(character, messages.slice(-MAX_MESSAGES)),
      ),
    });
    if (!response.ok)
      return res
        .status(502)
        .json({ error: `Error de la API de Gemini (${response.status}).` });
    return res.status(200).json({ reply: extractReply(await response.json()) });
  } catch (err) {
    console.error(err);
    return res
      .status(502)
      .json({ error: "No se pudo contactar con el servicio de Gemini." });
  }
}
