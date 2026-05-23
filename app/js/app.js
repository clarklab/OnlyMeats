// ONLYMEATS - bootstrap.
(function () {
  "use strict";

  // Optional URL "?reset" param to wipe ALL local state and return to welcome.
  try {
    const qs = new URLSearchParams(location.search);
    if (qs.has("reset")) {
      window.Store.reset();
      try { localStorage.removeItem("onlymeats.accounts.v1"); } catch (e) {}
      const url = location.pathname + "#/welcome";
      history.replaceState(null, "", url);
    }
  } catch (e) { /* ignore */ }

  // First boot — if no hash, route to feed (router will redirect to /welcome if not onboarded)
  if (!location.hash) {
    history.replaceState(null, "", location.pathname + location.search + "#/feed");
  }

  // -------- Boot splash --------
  // Show a brief BBQ splash on first load so the app feels alive while fonts/Tailwind settle.
  const bootSplash = window.UI.bbqSplash({ minMs: 700, label: "Lighting the pit" });

  // Once the next paint completes and fonts hopefully landed, route in and dismiss.
  function go() {
    try { window.Router.handleRoute(); }
    finally { bootSplash.dismiss(); }
  }
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 900))]).then(go);
  } else {
    setTimeout(go, 200);
  }

  // -------- Route-change "ember bar" --------
  // A thin animated ember bar wipes across the top on each navigation so the
  // view change feels intentional. Synchronous render means this is purely visual.
  let bar = null;
  function hideBar() {
    if (!bar) return;
    const el = bar; bar = null;
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 200);
  }
  window.addEventListener("hashchange", () => {
    if (bar) hideBar();
    bar = window.UI.h("div", { class: "ember-bar", role: "presentation" });
    document.body.appendChild(bar);
    setTimeout(hideBar, 500);
  });

  // Wire up cross-tab sync
  window.addEventListener("storage", (e) => {
    if (e.key === "onlymeats.state.v1") {
      window.Router.handleRoute();
    }
  });

  // Prevent multi-touch pinch from breaking the scroll lock pattern
  document.addEventListener("touchmove", (e) => {
    if (e.touches.length > 1) e.preventDefault();
  }, { passive: false });

  console.log("[onlymeats] online — light the fire.");
})();
