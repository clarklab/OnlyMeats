// ONLYMEATS - Cook history log.
(function () {
  "use strict";
  const { h, icon, fmtDate, fmtDuration } = window.UI;
  const D = window.OM_DATA;

  function row(cook) {
    const cut = D.CUTS.find((c) => c.id === cook.cut);
    const elapsed = (cook.endedAt || Date.now()) - cook.startedAt;
    const statusColor = cook.status === "complete" ? "text-primary" : cook.status === "aborted" ? "text-outline" : "text-error";

    return h("a", {
      href: "#/cook/" + cook.id,
      class: "border-2 border-outline-variant bg-surface-container p-sm flex items-center gap-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-surface-container-high transition-colors"
    },
      h("div", { class: "w-12 h-12 bg-surface border border-outline flex items-center justify-center shrink-0" },
        icon((cook.status === "active" ? "local_fire_department" : cook.status === "complete" ? "check_circle" : "stop_circle"), { class: statusColor, fill: cook.status !== "aborted" })
      ),
      h("div", { class: "flex-1 min-w-0" },
        h("div", { class: "font-headline-md text-headline-md text-on-surface uppercase truncate" }, cook.title),
        h("div", { class: "font-technical-data text-technical-data text-on-surface-variant truncate" },
          (cut ? cut.name : cook.cut) + " · " + (cook.wood || "—") + " · " + (cook.weightLbs || 0) + " LB"
        )
      ),
      h("div", { class: "flex flex-col items-end shrink-0" },
        h("span", { class: "font-label-caps text-label-caps text-primary" }, fmtDuration(elapsed)),
        h("span", { class: "font-technical-data text-[12px] text-outline" }, fmtDate(cook.startedAt))
      )
    );
  }

  function render() {
    const main = window.UI.pageShell({ back: true, activeTab: "feed" });
    main.appendChild(window.UI.sectionHeader({
      title: "Cook Log",
      right: h("a", { href: "#/cook/new", class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[14px] uppercase tracking-wider px-md py-2 rounded flex items-center gap-2" },
        icon("add"), "NEW"
      )
    }));

    const s = window.Store.getState();
    const cooks = s.cooks.slice().sort((a, b) => b.startedAt - a.startedAt);

    if (!cooks.length) {
      main.appendChild(window.UI.emptyState({
        icon: "outdoor_grill",
        title: "No cooks yet",
        body: "Start your first cook to log temps, phases and earn passport stamps.",
        actionLabel: "Start First Cook",
        onAction: () => window.Router.navigate("/cook/new")
      }));
      return;
    }

    // Tabs by status
    let filter = "all";
    const filters = h("div", { class: "mb-md" }, window.UI.segmented([
      { label: "ALL", value: "all" },
      { label: "ACTIVE", value: "active" },
      { label: "COMPLETE", value: "complete" }
    ], filter, (v) => { filter = v; paint(); }));
    main.appendChild(filters);

    const list = h("div", { class: "flex flex-col gap-sm" });
    main.appendChild(list);

    function paint() {
      filters.replaceChildren(window.UI.segmented([
        { label: "ALL", value: "all" },
        { label: "ACTIVE", value: "active" },
        { label: "COMPLETE", value: "complete" }
      ], filter, (v) => { filter = v; paint(); }));

      const filtered = filter === "all" ? cooks : cooks.filter((c) => c.status === filter);
      list.replaceChildren(...(filtered.length ? filtered.map(row) : [
        h("p", { class: "font-body-md text-body-md text-on-surface-variant italic text-center py-md" }, "Nothing in this filter.")
      ]));
    }
    paint();
  }

  window.Router.register("/cooks", render);
})();
