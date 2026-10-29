import { describe, it, expect } from "vitest";
import { parseRoute } from "../src/router.js";
import { escapeHtml, messageView, chatView } from "../src/views.js";
import { findCharacter } from "../src/characters.js";

describe("router", () => {
  it("reconoce las rutas", () => {
    expect(parseRoute("/")).toEqual({ name: "home" });
    expect(parseRoute("/about/")).toEqual({ name: "about" });
    expect(parseRoute("/home")).toEqual({ name: "home" });
    expect(parseRoute("/chat")).toEqual({
      name: "chat",
      params: { characterId: "holmes" },
    });
    expect(parseRoute("/chat/holmes")).toEqual({
      name: "chat",
      params: { characterId: "holmes" },
    });
    expect(parseRoute("/cualquiera")).toEqual({ name: "notFound" });
  });
});

describe("views", () => {
  it("escapa el HTML de los mensajes", () => {
    expect(escapeHtml('<script>"x"</script>')).not.toContain("<");
    expect(messageView({ role: "user", content: "<b>hi</b>" })).toContain(
      "&lt;b&gt;",
    );
  });

  it("distingue el estado de carga", () => {
    const holmes = findCharacter("holmes");
    const html = chatView(
      holmes,
      [{ role: "user", content: "Hola" }],
      "loading",
    );
    expect(html).toContain("msg--loading");
    expect(html).toContain("is-loading");
    expect(chatView(holmes, [], "idle")).not.toContain("msg--loading");
  });

  it("muestra la imagen del personaje en la cabecera del chat", () => {
    const watson = findCharacter("watson");
    const html = chatView(watson, [], "idle");
    expect(html).toContain(`class="avatar" src="${watson.image}"`);
  });
});

describe("página de inicio", () => {
  it("muestra la imagen de cada personaje", async () => {
    const { homeView } = await import("../src/views.js");
    const { CHARACTERS } = await import("../src/characters.js");
    const html = homeView(CHARACTERS);
    for (const c of CHARACTERS) {
      expect(c.image).toMatch(/^\/assets\/characters\/.+\.webp$/);
      expect(html).toContain(`src="${c.image}"`);
      expect(html).toContain(`<span class="avatar" aria-hidden="true">${c.emoji}</span>`);
    }
  });
});
