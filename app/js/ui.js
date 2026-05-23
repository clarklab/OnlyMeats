// ONLYMEATS - Shared UI helpers, chrome (top bar / bottom nav / drawer), modals and toasts.
(function () {
  "use strict";

  // ---------- HTML helpers ----------
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k === "class") el.className = v;
        else if (k === "style") el.style.cssText = v;
        else if (k === "html") el.innerHTML = v;
        else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
        else if (k === "dataset" && typeof v === "object") Object.assign(el.dataset, v);
        else el.setAttribute(k, v === true ? "" : v);
      }
    }
    flat(children).forEach((c) => {
      if (c == null || c === false) return;
      if (typeof c === "string" || typeof c === "number") el.appendChild(document.createTextNode(String(c)));
      else if (c instanceof Node) el.appendChild(c);
    });
    return el;
  }
  function flat(arr) {
    const out = [];
    for (const x of arr) {
      if (Array.isArray(x)) out.push(...flat(x));
      else out.push(x);
    }
    return out;
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function icon(name, opts) {
    opts = opts || {};
    const cls = "material-symbols-outlined " + (opts.class || "");
    const style = opts.fill ? "font-variation-settings: 'FILL' 1;" : "";
    return h("span", { class: cls, style }, name);
  }

  function fmtTime(ts) {
    const d = ts > 1e12 ? new Date(ts) : new Date(ts * 1000);
    const now = new Date();
    const diff = (now - d) / 1000;
    if (diff < 60) return Math.floor(diff) + "s ago";
    if (diff < 3600) return Math.floor(diff / 60) + "m ago";
    if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
    if (diff < 86400 * 7) return Math.floor(diff / 86400) + "d ago";
    return d.toLocaleDateString();
  }

  function fmtDuration(ms) {
    if (ms < 0) ms = 0;
    const total = Math.floor(ms / 1000);
    const h = Math.floor(total / 3600).toString().padStart(2, "0");
    const m = Math.floor((total % 3600) / 60).toString().padStart(2, "0");
    const s = (total % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  function fmtDate(ts) {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "2-digit" }).toUpperCase();
  }

  // ---------- Avatar ----------
  function avatar(user, opts) {
    opts = opts || {};
    const size = opts.size || 40;
    const cls = "rounded-full border-2 border-outline overflow-hidden shrink-0 " + (opts.class || "");
    if (user && user.avatar) {
      return h("img", {
        src: user.avatar,
        alt: user.displayName || user.handle || "avatar",
        class: cls + " object-cover",
        style: `width:${size}px;height:${size}px;`
      });
    }
    const initials = ((user && (user.displayName || user.handle)) || "??").trim().slice(0, 2).toUpperCase();
    return h("div", {
      class: cls + " avatar-fallback",
      style: `width:${size}px;height:${size}px;font-size:${Math.floor(size * 0.4)}px;`
    }, initials);
  }

  // ---------- Toast ----------
  function toast(message, kind) {
    kind = kind || "default";
    const root = document.getElementById("toast-root");
    const t = h("div", { class: "toast " + (kind === "danger" ? "danger" : kind === "success" ? "success" : "") }, message);
    root.appendChild(t);
    setTimeout(() => {
      t.style.transition = "opacity 200ms ease-out, transform 200ms ease-out";
      t.style.opacity = "0";
      t.style.transform = "translateY(-8px)";
      setTimeout(() => t.remove(), 220);
    }, 2400);
  }

  // ---------- Modal ----------
  function openModal(contentNode, opts) {
    opts = opts || {};
    const root = document.getElementById("modal-root");
    root.innerHTML = "";
    const close = () => {
      root.innerHTML = "";
      document.body.style.overflow = "";
    };
    const overlay = h("div", { class: "modal-overlay", onclick: (e) => { if (e.target === overlay) close(); } },
      h("div", { class: "modal-sheet", role: "dialog", "aria-modal": "true" },
        h("div", { class: "border-b-2 border-outline-variant flex justify-between items-center px-md py-sm bg-surface-container" },
          h("h2", { class: "font-headline-md text-headline-md text-primary uppercase tracking-tight" }, opts.title || ""),
          h("button", { class: "p-2 text-on-surface-variant hover:text-on-surface", onclick: close, "aria-label": "Close" }, icon("close"))
        ),
        h("div", { class: "p-md" }, contentNode)
      )
    );
    root.appendChild(overlay);
    document.body.style.overflow = "hidden";
    return close;
  }

  function confirm(message, opts) {
    opts = opts || {};
    return new Promise((resolve) => {
      const yes = () => { closer(); resolve(true); };
      const no = () => { closer(); resolve(false); };
      const body = h("div", { class: "flex flex-col gap-md" },
        h("p", { class: "font-body-md text-body-md text-on-surface" }, message),
        h("div", { class: "grid grid-cols-2 gap-sm pt-sm" },
          h("button", {
            class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[18px] py-3 rounded",
            onclick: no
          }, opts.cancelLabel || "Cancel"),
          h("button", {
            class: "brutal-btn " + (opts.danger
              ? "bg-error-container border-2 border-error text-on-error-container"
              : "bg-primary-container border-2 border-primary text-on-primary-container") + " font-headline-md text-[18px] py-3 rounded",
            onclick: yes
          }, opts.confirmLabel || "Confirm")
        )
      );
      const closer = openModal(body, { title: opts.title || "Confirm" });
    });
  }

  // ---------- Empty state ----------
  function emptyState(opts) {
    return h("div", { class: "flex flex-col items-center justify-center text-center gap-sm p-lg border-2 border-dashed border-outline-variant rounded my-md" },
      icon(opts.icon || "outdoor_grill", { class: "text-[48px] text-outline-variant" }),
      h("h3", { class: "font-headline-md text-headline-md text-on-surface uppercase tracking-tight" }, opts.title || "Nothing here yet"),
      opts.body && h("p", { class: "font-body-md text-body-md text-on-surface-variant max-w-md" }, opts.body),
      opts.actionLabel && h("button", {
        class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[18px] uppercase tracking-wider px-md py-2 rounded mt-sm",
        onclick: () => opts.onAction && opts.onAction()
      }, opts.actionLabel)
    );
  }

  // ---------- Top App Bar ----------
  function topBar(opts) {
    opts = opts || {};
    const unread = window.Store.unreadCount();

    const leftBtn = opts.back
      ? h("button", {
          class: "text-primary hover:bg-surface-container-highest active:translate-y-0.5 active:translate-x-0.5 p-2 rounded",
          "aria-label": "Back",
          onclick: () => history.length > 1 ? history.back() : window.Router.navigate("/feed")
        }, icon("arrow_back"))
      : h("button", {
          class: "text-primary hover:bg-surface-container-highest active:translate-y-0.5 active:translate-x-0.5 p-2 rounded",
          "aria-label": "Menu",
          onclick: openDrawer
        }, icon("menu"));

    const rightBtn = opts.rightBtn
      || h("button", {
        class: "text-primary hover:bg-surface-container-highest active:translate-y-0.5 active:translate-x-0.5 p-2 rounded relative",
        "aria-label": "Notifications",
        onclick: () => window.Router.navigate("/notifications")
      },
        icon("notifications", { fill: unread > 0 }),
        unread > 0 ? h("span", { class: "absolute top-1 right-1 bg-primary text-on-primary rounded-full font-technical-data text-[10px] px-1 leading-[1.2] border border-surface" }, String(unread)) : null
      );

    return h("header", { class: "fixed top-0 left-0 w-full z-50 border-b-2 border-outline-variant bg-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" },
      h("div", { class: "flex justify-between items-center h-16 px-margin-mobile w-full max-w-[1200px] mx-auto" },
        leftBtn,
        h("a", { href: "#/feed", class: "brand-brick font-headline-md text-headline-md" }, "ONLYMEATS"),
        rightBtn
      )
    );
  }

  // ---------- Bottom Nav ----------
  function bottomNav(activeTab) {
    const tabs = [
      { id: "feed", label: "Feed", icon: "local_fire_department", href: "#/feed" },
      { id: "passport", label: "Passport", icon: "workspace_premium", href: "#/passport" },
      { id: "map", label: "Map", icon: "map", href: "#/map" },
      { id: "profile", label: "Profile", icon: "person", href: "#/profile" }
    ];
    return h("nav", { class: "md:hidden fixed bottom-0 left-0 w-full z-50 border-t-2 border-outline-variant bg-surface-container pb-safe" },
      h("div", { class: "flex justify-around items-center h-20 px-2" },
        ...tabs.map((t) => {
          const active = t.id === activeTab;
          if (active) {
            return h("a", {
              href: t.href,
              class: "flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-xl px-4 py-1.5 border-2 border-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-transform duration-100"
            },
              icon(t.icon, { fill: true }),
              h("span", { class: "font-label-caps text-label-caps mt-1" }, t.label)
            );
          }
          return h("a", {
            href: t.href,
            class: "flex flex-col items-center justify-center text-on-surface-variant p-2 hover:text-on-surface active:scale-95 transition-transform duration-100"
          },
            icon(t.icon),
            h("span", { class: "font-label-caps text-label-caps mt-1" }, t.label)
          );
        })
      )
    );
  }

  // ---------- Drawer ----------
  function buildDrawer() {
    const s = window.Store.getState();
    const user = s.user || {};

    const links = [
      { icon: "outdoor_grill", label: "My Pit", href: "#/profile" },
      { icon: "edit_note", label: "New Cook", href: "#/cook/new" },
      { icon: "history", label: "Cook Log", href: "#/cooks" },
      { icon: "post_add", label: "New Post", href: "#/compose" },
      { icon: "map", label: "Cut Map", href: "#/map" },
      { icon: "workspace_premium", label: "Passport", href: "#/passport" },
      { icon: "group", label: "Friends", href: "#/friends" },
      { icon: "notifications", label: "Notifications", href: "#/notifications" },
      { icon: "settings", label: "Settings", href: "#/settings" },
      { icon: "help", label: "Help", href: "#/help" }
    ];

    const drawer = h("aside", { class: "drawer flex flex-col" },
      h("div", { class: "p-4 border-b-2 border-outline-variant bg-surface-container-lowest" },
        h("a", { href: "#/profile", class: "flex items-center gap-4", onclick: closeDrawer },
          avatar(user, { size: 64, class: "border-primary" }),
          h("div", { class: "min-w-0" },
            h("h2", { class: "font-headline-md text-headline-md text-primary truncate" }, user.displayName || user.handle || "Pitmaster"),
            h("p", { class: "font-technical-data text-technical-data text-on-surface-variant" }, "Rank: " + (user.rank || "Ember")),
            h("p", { class: "font-label-caps text-label-caps text-outline mt-1" }, "Est. " + (user.est || new Date().getFullYear()))
          )
        )
      ),
      h("nav", { class: "flex-1 overflow-y-auto py-2 flex flex-col" },
        ...links.map((l) => h("a", {
          href: l.href,
          class: "flex items-center gap-4 px-6 py-4 text-on-surface-variant hover:bg-surface-container-high transition-colors duration-150",
          onclick: closeDrawer
        }, icon(l.icon), h("span", { class: "font-body-md text-body-md" }, l.label)))
      ),
      h("div", { class: "p-4 border-t-2 border-outline-variant bg-surface-container-lowest text-center" },
        h("span", { class: "brand-brick font-headline-md text-headline-md" }, "ONLYMEATS"),
        h("p", { class: "font-label-caps text-label-caps text-outline mt-2" }, "v1.0 // FIRE GRADE")
      )
    );
    return drawer;
  }

  let drawerEl = null;
  let overlayEl = null;
  function openDrawer() {
    if (drawerEl) closeDrawer();
    drawerEl = buildDrawer();
    overlayEl = h("div", { class: "drawer-overlay", onclick: closeDrawer });
    document.body.appendChild(overlayEl);
    document.body.appendChild(drawerEl);
    // Allow paint then add classes for transition
    requestAnimationFrame(() => {
      overlayEl.classList.add("open");
      drawerEl.classList.add("open");
    });
  }
  function closeDrawer() {
    if (!drawerEl) return;
    drawerEl.classList.remove("open");
    overlayEl.classList.remove("open");
    const d = drawerEl, o = overlayEl;
    drawerEl = null; overlayEl = null;
    setTimeout(() => { d && d.remove(); o && o.remove(); }, 240);
  }

  // ---------- Page shell ----------
  function pageShell(opts) {
    opts = opts || {};
    const root = document.getElementById("app-root");
    root.innerHTML = "";

    const main = h("main", {
      class: "flex-grow w-full max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-28 flex flex-col gap-lg view-enter"
    });
    const top = opts.hideTopBar ? null : topBar({ back: opts.back, rightBtn: opts.rightBtn });
    const bot = opts.hideBottomNav ? null : bottomNav(opts.activeTab);
    if (top) root.appendChild(top);
    root.appendChild(main);
    if (bot) root.appendChild(bot);
    return main;
  }

  // ---------- Section header (re-usable) ----------
  function sectionHeader(opts) {
    return h("div", { class: "flex justify-between items-end border-b-4 border-surface-variant pb-2 mb-md" },
      h("h1", { class: "font-headline-lg-mobile md:font-headline-lg text-primary tracking-tight uppercase" }, opts.title),
      opts.right
    );
  }

  // ---------- Riveted tag ----------
  function rivetedTag(text, opts) {
    opts = opts || {};
    const cls = "riveted-tag border-2 px-4 py-1 inline-flex items-center font-label-caps text-label-caps tracking-widest rounded "
      + (opts.active ? "bg-primary-container border-primary text-on-primary-container" : "border-outline-variant bg-surface-container text-on-surface");
    return opts.button
      ? h("button", { class: cls, onclick: opts.onclick, type: "button" }, text)
      : h("span", { class: cls }, text);
  }

  // ---------- Stat plate ----------
  function statPlate(opts) {
    return h("div", { class: "bg-surface border-2 border-outline-variant shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-md flex flex-col justify-between" },
      h("div", { class: "flex justify-between items-start border-b-2 border-surface-variant pb-base mb-base" },
        h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, opts.label),
        icon(opts.icon || "scale", { class: "text-outline" })
      ),
      h("div", { class: "flex items-baseline gap-2" },
        h("span", { class: "font-display-xl text-display-xl text-on-surface tracking-tighter tally" }, String(opts.value)),
        opts.unit && h("span", { class: "font-technical-data text-technical-data text-primary" }, opts.unit)
      )
    );
  }

  // ---------- Sub-nav (segmented) ----------
  function segmented(items, value, onChange) {
    return h("div", { class: "flex border-2 border-outline-variant bg-surface-container-lowest p-0.5 gap-0.5" },
      ...items.map((it) => h("button", {
        class: "flex-1 font-label-caps text-label-caps uppercase py-2 px-3 transition-colors " +
          (it.value === value
            ? "bg-primary-container text-on-primary-container border border-primary"
            : "text-on-surface-variant hover:text-on-surface"),
        onclick: () => onChange(it.value),
        type: "button"
      }, it.label))
    );
  }

  // ---------- BBQ Pit Loader ----------
  // Build a self-contained loader DOM node. Sizes: "sm" (48px), "md" (88px, default), "lg" (160px).
  function bbqLoader(opts) {
    opts = opts || {};
    const size = opts.size || "md";
    const cls = "bbq-loader " + (size === "sm" ? "bbq-loader--sm" : size === "lg" ? "bbq-loader--lg" : size === "inline" ? "bbq-loader--inline" : "");
    const loader = h("div", { class: cls, role: "status", "aria-label": opts.label || "Loading" },
      h("div", { class: "bbq-loader__smoke bbq-loader__smoke--1" }),
      h("div", { class: "bbq-loader__smoke bbq-loader__smoke--2" }),
      h("div", { class: "bbq-loader__smoke bbq-loader__smoke--3" }),
      h("div", { class: "bbq-loader__flame bbq-loader__flame--side bbq-loader__flame--left" }),
      h("div", { class: "bbq-loader__flame bbq-loader__flame--side bbq-loader__flame--right" }),
      h("div", { class: "bbq-loader__flame" }),
      h("div", { class: "bbq-loader__embers" }),
      h("div", { class: "bbq-loader__pit" })
    );
    if (opts.label) {
      return h("div", { class: "bbq-loader-stack" },
        loader,
        h("span", { class: "bbq-loader-stack__label" }, opts.label)
      );
    }
    return loader;
  }

  // Full-screen splash overlay. Resolves the returned promise once `min` ms have passed.
  function bbqSplash(opts) {
    opts = opts || {};
    const min = opts.minMs || 0;
    const label = opts.label || "Lighting the pit";
    const el = h("div", { class: "bbq-splash", role: "status", "aria-live": "polite" },
      h("div", { class: "bbq-splash__brand" }, "ONLYMEATS"),
      bbqLoader({ size: "lg" }),
      h("span", { class: "bbq-loader-stack__label" }, label)
    );
    document.body.appendChild(el);
    const start = Date.now();
    return {
      element: el,
      dismiss() {
        const remaining = Math.max(0, min - (Date.now() - start));
        setTimeout(() => {
          el.classList.add("bbq-splash--leaving");
          setTimeout(() => el.remove(), 280);
        }, remaining);
      }
    };
  }

  // Swap a button's contents into a loading state. Returns a restore() fn.
  function buttonLoading(btn, message) {
    if (!btn) return () => {};
    const prev = btn.innerHTML;
    const prevDisabled = btn.disabled;
    btn.disabled = true;
    btn.classList.add("btn-loader");
    btn.innerHTML = "";
    btn.appendChild(bbqLoader({ size: "inline" }));
    btn.appendChild(document.createTextNode(message || "Working..."));
    return () => {
      btn.disabled = prevDisabled;
      btn.classList.remove("btn-loader");
      btn.innerHTML = prev;
    };
  }

  // Run an async action with a button loader. Always restores, surfaces toast on error.
  async function withButtonLoading(btn, message, action) {
    const restore = buttonLoading(btn, message);
    try {
      const result = await Promise.resolve(action());
      return result;
    } catch (e) {
      console.error("[withButtonLoading]", e);
      toast(e && e.message ? e.message : "Something went wrong", "danger");
    } finally {
      restore();
    }
  }

  window.UI = {
    h, escapeHtml, icon, avatar, toast, openModal, confirm, emptyState,
    topBar, bottomNav, openDrawer, closeDrawer, pageShell, sectionHeader,
    rivetedTag, statPlate, segmented,
    fmtTime, fmtDuration, fmtDate,
    bbqLoader, bbqSplash, buttonLoading, withButtonLoading
  };
})();
