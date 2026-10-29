// Presentación: funciones puras que devuelven HTML.
export const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const nl2br = (text) => escapeHtml(text).replace(/\n/g, '<br>');

export const navView = (route, firstCharacterId) =>
  [
    ['/', 'Inicio', route.name === 'home'],
    [`/chat/${firstCharacterId}`, 'Conversación', route.name === 'chat'],
    ['/about', 'Acerca de', route.name === 'about'],
  ]
    .map(([href, label, active]) => `<a href="${href}" data-link${active ? ' aria-current="page"' : ''}>${label}</a>`)
    .join('');

export const homeView = (characters) => `
  <section class="home">
    <h1>Tres voces de Baker Street</h1>
    <p class="lead">Elige con quién quieres hablar. Los personajes de Conan Doyle responden gracias a Gemini.</p>
    <ul class="cards">
      ${characters
        .map(
          (c) => `<li class="card" style="--accent:${c.color}">
            <img class="card__img" src="${c.image}" alt="Retrato de ${escapeHtml(c.name)}" loading="lazy">
            <div class="card__head">
              <span class="avatar" aria-hidden="true">${c.emoji}</span>
              <div>
                <h2>${escapeHtml(c.name)}</h2>
                <p class="role">${escapeHtml(c.role)}</p>
              </div>
            </div>
            <p>${escapeHtml(c.description)}</p>
            <a class="btn" href="/chat/${c.id}" data-link>Hablar con ${escapeHtml(c.name.split(' ').pop())}</a>
          </li>`,
        )
        .join('')}
    </ul>
  </section>`;

export const messageView = (message, character) => {
  const author = message.role === 'user' ? 'Tú' : message.role === 'error' ? 'Error' : (character?.name ?? '');
  return `<li class="msg msg--${message.role}"><span class="msg__author">${escapeHtml(author)}</span><p>${nl2br(message.content)}</p></li>`;
};

export const typingView = () =>
  '<li class="msg msg--loading" aria-label="El personaje está escribiendo"><span class="dots"><i></i><i></i><i></i></span></li>';

export const chatView = (character, messages, status) => {
  const loading = status === 'loading';
  const intro = messages.length ? '' : `<li class="msg msg--system">Escribe tu primer mensaje a ${escapeHtml(character.name)}.</li>`;
  return `
  <section class="chat" style="--accent:${character.color}" data-state="${status}">
    <div class="chat__header">
      <a href="/" data-link class="back" aria-label="Volver al inicio">←</a>
      <img class="avatar" src="${character.image}" alt="Retrato de ${escapeHtml(character.name)}">
      <div><h1>${escapeHtml(character.name)}</h1><p>${escapeHtml(character.role)}</p></div>
    </div>
    <ul class="messages" id="messages" aria-live="polite">
      ${intro}${messages.map((m) => messageView(m, character)).join('')}${loading ? typingView() : ''}
    </ul>
    <form class="chat-form${loading ? ' is-loading' : ''}" data-character="${character.id}" autocomplete="off">
      <input name="message" type="text" placeholder="Tu mensaje" maxlength="500" aria-label="Tu mensaje" required${loading ? ' disabled' : ''}>
      <button type="submit"${loading ? ' disabled' : ''}>Enviar</button>
    </form>
  </section>`;
};

export const aboutView = () => `
  <section class="about about--page">
    <h1>Acerca de</h1>
    <p>Baker Street Chat es un proyecto de aprendizaje: una aplicación de una sola página en JavaScript nativo, apoyada en una función serverless de Vercel que consulta la API de Gemini.</p>
    <p>Los personajes provienen de las novelas de Arthur Conan Doyle, hoy de dominio público. Las respuestas las genera una IA y pueden contener errores.</p>
    <p>Demostración realizada para «ComicSansCon», una agencia digital ficticia creada solo para este ejercicio.</p>
  </section>`;

export const notFoundView = () => `
  <section class="about">
    <h1>Página no encontrada</h1>
    <p>Esta dirección no corresponde a ninguna sección.</p>
    <a class="btn" href="/" data-link>Volver al inicio</a>
  </section>`;
