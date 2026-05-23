// ONLYMEATS - bootstrap.
(function () {
  "use strict";

  // Optional URL "?reset" param to start fresh (handy for demos)
  try {
    const qs = new URLSearchParams(location.search);
    if (qs.has("reset")) {
      window.Store.reset();
      const url = location.pathname + "#/welcome";
      history.replaceState(null, "", url);
    }
  } catch (e) { /* ignore */ }

  // First boot — if no hash, route to welcome (router will redirect if onboarded)
  if (!location.hash) {
    history.replaceState(null, "", location.pathname + location.search + "#/feed");
  }

  // Kick off
  window.Router.handleRoute();

  // Wire up cross-tab sync
  window.addEventListener("storage", (e) => {
    if (e.key === "onlymeats.state.v1") {
      // Soft reload to reflect external change
      window.Router.handleRoute();
    }
  });

  // PWA-style: scroll lock prevention on iOS bottom nav
  document.addEventListener("touchmove", (e) => {
    if (e.touches.length > 1) e.preventDefault();
  }, { passive: false });

  console.log("[onlymeats] online — light the fire.");
})();
