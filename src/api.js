// Obtención de datos: llama a la función serverless.
export const requestReply = async (
  characterId,
  messages,
  fetchImpl = (...a) => fetch(...a),
) => {
  const response = await fetchImpl("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ characterId, messages }),
  }).catch(() => {
    throw new Error("No hay conexión con el servidor.");
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(data.error ?? `Error del servidor (${response.status}).`);
  return data.reply;
};
