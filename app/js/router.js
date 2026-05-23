// ONLYMEATS - hash-based router. Routes are registered by view modules.
(function () {
  "use strict";

  const routes = []; // { pattern, handler, opts }
  let currentMatch = null;
  let teardowns = []; // view-scoped cleanup functions

  function register(pattern, handler, opts) {
    routes.push({ pattern, handler, opts: opts || {} });
  }

  // Each view can register cleanup callbacks (subscriptions, timers, listeners)
  function onTeardown(fn) { teardowns.push(fn); }
  function runTeardowns() {
    teardowns.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } });
    teardowns = [];
  }

  function match(path) {
    const pathOnly = path.split("?")[0];
    for (const r of routes) {
      // Convert /foo/:id to regex (escape literal slashes first, then expand params)
      const keys = [];
      const re = new RegExp(
        "^" + r.pattern.replace(/\//g, "\\/").replace(/:([^/\\]+)/g, (_, k) => { keys.push(k); return "([^/]+)"; }) + "$"
      );
      const m = pathOnly.match(re);
      if (m) {
        const params = {};
        keys.forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); });
        return { route: r, params };
      }
    }
    return null;
  }

  function parseHash() {
    let h = location.hash || "#/";
    if (h[0] === "#") h = h.slice(1);
    if (!h.startsWith("/")) h = "/" + h;
    return h;
  }

  function navigate(path, opts) {
    opts = opts || {};
    if (opts.replace) {
      const url = location.pathname + location.search + "#" + path;
      history.replaceState(null, "", url);
      handleRoute();
    } else {
      location.hash = path;
    }
  }

  function handleRoute() {
    const path = parseHash();
    const found = match(path);

    // Gate behind onboarding for protected routes
    const state = window.Store.getState();
    const isOnboarding = path.startsWith("/welcome") || path.startsWith("/onboarding") || path.startsWith("/signin");
    if (!state.onboarded && !isOnboarding) {
      return navigate("/welcome", { replace: true });
    }
    if (state.onboarded && isOnboarding && path !== "/welcome/restart" && path !== "/onboarding/done") {
      // Already onboarded, skip the welcome flow (but still allow the final celebration screen)
      return navigate("/feed", { replace: true });
    }

    if (!found) {
      return navigate("/feed", { replace: true });
    }

    runTeardowns();
    currentMatch = found;
    try {
      found.route.handler(found.params, { path });
    } catch (e) {
      console.error("[router] handler error", e);
      window.UI.toast("Something went wrong loading that view.", "danger");
    }

    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  window.addEventListener("hashchange", handleRoute);

  window.Router = { register, navigate, handleRoute, parseHash, onTeardown, get current() { return currentMatch; } };
})();
