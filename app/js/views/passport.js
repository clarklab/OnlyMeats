// ONLYMEATS - Pitmaster Passport — earned stamps + progression.
(function () {
  "use strict";
  const { h, icon, fmtDate } = window.UI;
  const D = window.OM_DATA;

  const ROTATIONS = [-6, -4, -2, 0, 2, 4, 6, 8, -8];

  function stampNode(def, earned, idx) {
    const rot = ROTATIONS[idx % ROTATIONS.length];
    if (earned) {
      return h("div", {
        class: "aspect-square flex flex-col items-center justify-center p-sm border-2 border-primary text-primary rounded-full shadow-[2px_2px_0px_0px_rgba(255,180,172,0.2)] bg-surface-container-lowest/80 relative stamp-earned",
        style: `transform: rotate(${rot}deg); --rot: ${rot}deg;`
      },
        icon(def.icon, { class: "text-[40px] mb-1", fill: true }),
        h("span", { class: "font-label-caps text-label-caps text-center font-bold" }, def.name),
        h("div", { class: "absolute -bottom-1 -right-1 bg-primary text-on-primary font-technical-data text-[9px] px-1 py-0.5 rounded-sm border border-outline" }, "EARNED")
      );
    }
    return h("div", {
      class: "aspect-square flex flex-col items-center justify-center p-sm border-2 border-dashed border-outline-variant/50 text-outline-variant rounded-full bg-transparent opacity-60"
    },
      icon("lock", { class: "text-[40px] mb-1 opacity-60" }),
      h("span", { class: "font-label-caps text-label-caps text-center opacity-70" }, def.name)
    );
  }

  function categorySection(title, defs, earnedMap) {
    return h("div", { class: "relative z-10 flex flex-col gap-md" },
      h("div", { class: "flex items-center gap-sm" },
        icon("local_fire_department", { class: "text-primary", fill: true }),
        h("h2", { class: "font-headline-md text-headline-md text-on-surface uppercase tracking-wide border-b-2 border-primary/30 flex-grow pb-1" }, title)
      ),
      h("div", { class: "grid grid-cols-3 sm:grid-cols-4 gap-sm" },
        ...defs.map((d, i) => stampNode(d, earnedMap[d.id], i))
      )
    );
  }

  function render() {
    const s = window.Store.getState();
    const earned = s.stamps || {};
    const totalEarned = Object.keys(earned).length;
    const totalAll = D.STAMPS.length;

    const main = window.UI.pageShell({ activeTab: "passport" });

    main.appendChild(h("section", { class: "flex flex-col gap-base" },
      h("div", { class: "flex items-end justify-between border-b-2 border-outline-variant pb-base" },
        h("div", null,
          h("h1", { class: "font-headline-lg-mobile md:font-headline-lg text-on-surface uppercase tracking-tight" }, "Meat Passport"),
          h("p", { class: "font-technical-data text-technical-data text-on-surface-variant uppercase mt-1" },
            "ID: " + (s.user.handle || "?").toUpperCase().slice(0, 12)
          )
        ),
        h("div", { class: "text-right" },
          h("p", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "Stamps"),
          h("p", { class: "font-headline-md text-headline-md text-primary tally" },
            String(totalEarned).padStart(2, "0"),
            h("span", { class: "text-on-surface-variant text-body-md" }, "/" + totalAll)
          )
        )
      )
    ));

    // Progress bar
    main.appendChild(h("div", { class: "border-2 border-outline-variant bg-surface-container-lowest p-sm" },
      h("div", { class: "w-full h-3 bg-surface-container-highest relative debossed-surface" },
        h("div", { class: "absolute top-0 left-0 h-full bg-primary", style: `width: ${Math.round((totalEarned / totalAll) * 100)}%;` })
      ),
      h("p", { class: "font-technical-data text-technical-data text-on-surface-variant text-right mt-2" },
        Math.round((totalEarned / totalAll) * 100) + "% COMPLETE"
      )
    ));

    // Passport booklet
    const beef = D.STAMPS.filter((x) => x.category === "beef");
    const pork = D.STAMPS.filter((x) => x.category === "pork");
    const poultry = D.STAMPS.filter((x) => x.category === "poultry");
    const lamb = D.STAMPS.filter((x) => x.category === "lamb");
    const milestone = D.STAMPS.filter((x) => x.category === "milestone");

    const booklet = h("div", {
      class: "border-2 border-outline-variant rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-md flex flex-col gap-lg relative overflow-hidden bg-surface-container-low",
      style: "background-image: linear-gradient(rgba(19,19,19,0.7), rgba(19,19,19,0.85));"
    },
      h("div", { class: "absolute inset-0 border-8 border-surface-container/50 rounded-xl pointer-events-none shadow-inner" }),
      categorySection("Beef", beef, earned),
      h("hr", { class: "border-t-2 border-outline-variant/30 relative z-10" }),
      categorySection("Pork", pork, earned),
      h("hr", { class: "border-t-2 border-outline-variant/30 relative z-10" }),
      categorySection("Poultry", poultry, earned),
      h("hr", { class: "border-t-2 border-outline-variant/30 relative z-10" }),
      categorySection("Lamb", lamb, earned),
      h("hr", { class: "border-t-2 border-outline-variant/30 relative z-10" }),
      categorySection("Milestones", milestone, earned)
    );
    main.appendChild(booklet);

    // Earned timeline
    if (totalEarned > 0) {
      const earnedList = Object.entries(earned)
        .map(([sid, meta]) => ({ def: D.STAMPS.find((x) => x.id === sid), meta }))
        .filter((x) => x.def)
        .sort((a, b) => b.meta.earnedAt - a.meta.earnedAt);

      main.appendChild(h("section", { class: "flex flex-col gap-sm" },
        h("h2", { class: "font-headline-md text-headline-md text-on-surface uppercase tracking-tight border-b-2 border-outline-variant pb-2" }, "Earned Log"),
        h("div", { class: "flex flex-col" },
          ...earnedList.map((x) => h("div", { class: "flex items-center gap-sm py-2 border-b border-outline-variant/40" },
            icon(x.def.icon, { class: "text-primary", fill: true }),
            h("span", { class: "font-body-md text-body-md text-on-surface flex-1" }, x.def.name),
            h("span", { class: "font-technical-data text-technical-data text-on-surface-variant" }, fmtDate(x.meta.earnedAt))
          ))
        )
      ));
    }
  }

  window.Router.register("/passport", render);
})();
