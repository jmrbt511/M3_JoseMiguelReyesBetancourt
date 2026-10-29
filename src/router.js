export const parseRoute = (pathname) => {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (clean === "/" || clean === "/home") return { name: "home" };
  if (clean === "/about") return { name: "about" };
  if (clean === "/chat")
    return { name: "chat", params: { characterId: "holmes" } };
  const chat = clean.match(/^\/chat\/([\w-]+)$/);
  if (chat) return { name: "chat", params: { characterId: chat[1] } };
  return { name: "notFound" };
};

// Navegación sin recarga mediante la API History.
export const startRouter = (onRoute) => {
  const handle = () => onRoute(parseRoute(location.pathname));
  window.addEventListener("popstate", handle);
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-link]");
    if (!link || event.metaKey || event.ctrlKey) return;
    event.preventDefault();
    history.pushState(null, "", link.getAttribute("href"));
    handle();
  });
  handle();
};
