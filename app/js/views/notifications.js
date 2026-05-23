// ONLYMEATS - Notifications inbox.
(function () {
  "use strict";
  const { h, icon, fmtTime } = window.UI;

  function row(n) {
    const map = {
      stamp: { icon: "workspace_premium", tint: "text-primary" },
      social: { icon: "local_fire_department", tint: "text-error" },
      system: { icon: "info", tint: "text-on-surface" },
      cook: { icon: "outdoor_grill", tint: "text-primary" }
    };
    const meta = map[n.type] || map.system;
    return h("a", {
      href: n.href || "#/feed",
      class: "block border-2 border-outline-variant p-sm flex items-start gap-sm " +
        (n.read ? "bg-surface-container-low opacity-80" : "bg-surface-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]")
    },
      h("div", { class: "w-10 h-10 bg-surface border border-outline flex items-center justify-center shrink-0" },
        icon(meta.icon, { class: meta.tint, fill: !n.read })
      ),
      h("div", { class: "flex-1 min-w-0" },
        h("div", { class: "flex items-baseline justify-between gap-2" },
          h("span", { class: "font-headline-md text-headline-md text-on-surface uppercase truncate" }, n.title),
          h("span", { class: "font-label-caps text-label-caps text-outline shrink-0" }, fmtTime(n.ts))
        ),
        h("p", { class: "font-body-md text-body-md text-on-surface-variant" }, n.body)
      )
    );
  }

  function render() {
    const main = window.UI.pageShell({ back: true, activeTab: "feed" });
    const s = window.Store.getState();
    const unread = s.notifications.filter((n) => !n.read).length;

    main.appendChild(window.UI.sectionHeader({
      title: "Notifications",
      right: unread > 0 ? h("button", {
        class: "font-label-caps text-label-caps text-primary uppercase",
        onclick: () => { window.Store.markAllRead(); window.Router.handleRoute(); }
      }, "MARK ALL READ") : h("span", { class: "font-technical-data text-technical-data text-outline" }, "ALL READ")
    }));

    if (!s.notifications.length) {
      main.appendChild(window.UI.emptyState({
        icon: "notifications_off",
        title: "Inbox is empty",
        body: "Sizzles, stamps and system messages will show up here."
      }));
      return;
    }

    main.appendChild(h("div", { class: "flex flex-col gap-sm" }, ...s.notifications.map(row)));
  }

  window.Router.register("/notifications", render);
})();
