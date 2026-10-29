import { describe, it, expect } from 'vitest';
import { toGeminiContents, extractReply } from '../src/transform.js';

describe('transformación', () => {
  it('convierte los roles e ignora errores y mensajes vacíos', () => {
    const out = toGeminiContents([
      { role: 'user', content: 'Hola' },
      { role: 'assistant', content: 'Elemental.' },
      { role: 'error', content: 'oups' },
      { role: 'user', content: '   ' },
    ]);
    expect(out).toEqual([
      { role: 'user', parts: [{ text: 'Hola' }] },
      { role: 'model', parts: [{ text: 'Elemental.' }] },
    ]);
  });

  it('extrae el texto de la respuesta de Gemini', () => {
    const data = { candidates: [{ content: { parts: [{ text: 'Usted ' }, { text: 'viene de Afganistán.' }] } }] };
    expect(extractReply(data)).toBe('Usted viene de Afganistán.');
  });

  it('lanza un error si la respuesta está vacía', () => {
    expect(() => extractReply({ candidates: [] })).toThrow(/vacía/);
  });
});
