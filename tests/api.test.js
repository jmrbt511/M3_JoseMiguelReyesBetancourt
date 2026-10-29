import { describe, it, expect, vi } from 'vitest';
import { requestReply } from '../src/api.js';

const jsonResponse = (body, ok = true, status = 200) => ({
  ok,
  status,
  json: async () => body,
});

describe('requestReply (fetch simulado)', () => {
  it('envía la solicitud y devuelve la respuesta', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ reply: 'Buenas noches.' }));
    const reply = await requestReply(
      'holmes',
      [{ role: 'user', content: 'Hola' }],
      fetchMock,
    );
    expect(reply).toBe('Buenas noches.');
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/chat',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).characterId).toBe(
      'holmes',
    );
  });

  it('propaga el mensaje de error del servidor', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ error: 'Cuota superada' }, false, 502));
    await expect(requestReply('watson', [], fetchMock)).rejects.toThrow(
      'Cuota superada',
    );
  });

  it('muestra un mensaje en español cuando falla la red', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Red no disponible'));
    await expect(requestReply('watson', [], fetchMock)).rejects.toThrow(
      'No hay conexión con el servidor.',
    );
  });
});
