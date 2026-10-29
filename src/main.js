import { CHARACTERS, findCharacter } from "./characters.js";
import { requestReply } from "./api.js";
import { startRouter } from "./router.js";
import { addMessage, startLoading, succeed, fail } from "./state.js";
import {
  navView,
  homeView,
  chatView,
  aboutView,
  notFoundView,
} from "./views.js";
import { loadState, saveConversations } from "./storage.js";

const app = document.getElementById("app");
const nav = document.getElementById("nav");
let state = loadState();
let route = { name: "home" };

const viewFor = ({ name, params }) => {
  if (name === "home") return homeView(CHARACTERS);
  if (name === "about") return aboutView();
  if (name === "chat") {
    const character = findCharacter(params.characterId);
    return character
      ? chatView(
          character,
          state.conversations[character.id] ?? [],
          state.status,
        )
      : notFoundView();
  }
  return notFoundView();
};

const render = () => {
  saveConversations(state.conversations);
  app.innerHTML = viewFor(route);
  nav.innerHTML = navView(route, CHARACTERS[0].id);
  const messages = document.getElementById("messages");
  if (messages) messages.scrollTop = messages.scrollHeight;
  document.querySelector(".chat-form input:not([disabled])")?.focus();
};

const onSubmit = async (event) => {
  if (!event.target.matches(".chat-form")) return;
  event.preventDefault();
  const id = event.target.dataset.character;
  const text = new FormData(event.target).get("message").trim();
  if (!text || state.status === "loading") return;

  state = startLoading(addMessage(state, id, { role: "user", content: text }));
  render();
  try {
    state = succeed(state, id, await requestReply(id, state.conversations[id]));
  } catch (error) {
    state = fail(state, id, error.message);
  }
  render();
};

app.addEventListener("submit", onSubmit);
startRouter((next) => {
  route = next;
  render();
});
