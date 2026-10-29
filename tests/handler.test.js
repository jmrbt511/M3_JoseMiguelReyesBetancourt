import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import handler from '../api/chat.js';

const mockRes = () => {
  const res = { statusCode: 0, body: null };
  res.status = (code) => ((res.statusCode = code), res);
  res.json = (body) => ((res.body = body), res);
  return res;
};
const validReq = { method: 'POST', body: { characterId: 'moriarty', messages: [{ role: 'user', content: 'Hola' }] } };

describe('api/chat (Gemini simulado)', () => {
  beforeEach(() => vi.stubEnv('GEMINI_API_KEY', 'clave-de-prueba'));
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it('rechaza métodos distintos de POST', async () => {
    const res = mockRes();
    await handler({ method: 'GET' }, res);
    expect(res.statusCode).toBe(405);
  });

  it('rechaza un personaje desconocido', async () => {
    const res = mockRes();
    await handler({ method: 'POST', body: { characterId: 'desconocido', messages: [{ role: 'user', content: 'x' }] } }, res);
    expect(res.statusCode).toBe(400);
  });

  it('devuelve la respuesta transformada de Gemini', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: 'Encantador.' }] } }] }) });
    vi.stubGlobal('fetch', fetchMock);
    const res = mockRes();
    await handler(validReq, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ reply: 'Encantador.' });
    expect(fetchMock.mock.calls[0][1].headers['x-goog-api-key']).toBe('clave-de-prueba');
  });

  it("devuelve 502 si Gemini falla", async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 429 }));
    const res = mockRes();
    await handler(validReq, res);
    expect(res.statusCode).toBe(502);
  });
});
