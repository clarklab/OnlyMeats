// ONLYMEATS - Anatomical Cut Map.
(function () {
  "use strict";
  const { h, icon, fmtDate } = window.UI;
  const D = window.OM_DATA;

  // SVG blueprints for each species — simplified anatomical outlines with clickable regions
  // Coordinates calibrated so x: 0-100, y: 0-100 viewbox.
  const BLUEPRINTS = {
    beef: {
      species: "beef",
      label: "Bos Taurus",
      outline: "M5,55 L8,40 L13,32 L20,28 L28,28 L35,30 L42,28 L48,25 L58,22 L70,22 L80,25 L88,32 L92,40 L95,50 L94,58 L88,62 L85,72 L82,80 L77,82 L74,76 L70,70 L60,68 L52,68 L45,68 L36,70 L28,68 L22,72 L18,80 L15,82 L12,76 L10,68 L5,62 Z",
      hotspots: [
        { id: "chuck", x: 25, y: 45, label: "CHUCK" },
        { id: "ribeye", x: 42, y: 42, label: "RIB" },
        { id: "shortrib", x: 50, y: 60, label: "SHORT" },
        { id: "tritip", x: 64, y: 60, label: "TRI-TIP" },
        { id: "brisket", x: 28, y: 65, label: "BRISKET" },
        { id: "tomahawk", x: 40, y: 35, label: "TOMA." }
      ]
    },
    pork: {
      species: "pork",
      label: "Sus Domesticus",
      outline: "M5,55 L10,42 L18,35 L26,32 L34,32 L42,30 L50,28 L58,28 L66,30 L74,32 L82,38 L88,46 L90,55 L88,62 L82,64 L78,70 L75,75 L72,72 L72,65 L66,68 L58,68 L50,68 L42,68 L34,68 L26,68 L20,70 L17,75 L14,72 L14,65 L10,68 L6,65 Z",
      hotspots: [
        { id: "porkbutt", x: 22, y: 45, label: "BUTT" },
        { id: "porkloin", x: 45, y: 40, label: "LOIN" },
        { id: "babyback", x: 50, y: 50, label: "BABYBACK" },
        { id: "spareribs", x: 50, y: 62, label: "SPARE" },
        { id: "porkbelly", x: 60, y: 60, label: "BELLY" },
        { id: "wholehog", x: 78, y: 50, label: "HAM" }
      ]
    },
    poultry: {
      species: "poultry",
      label: "Gallus Domesticus",
      outline: "M30,30 L36,22 L44,18 L52,18 L60,22 L65,30 L66,40 L75,42 L82,48 L84,55 L78,62 L72,65 L66,68 L60,72 L50,75 L42,75 L35,72 L28,68 L24,60 L22,52 L24,42 Z",
      hotspots: [
        { id: "chickenwhole", x: 50, y: 50, label: "WHOLE" },
        { id: "wings", x: 30, y: 35, label: "WING" },
        { id: "thighs", x: 60, y: 65, label: "THIGH" },
        { id: "duck", x: 75, y: 55, label: "DUCK" },
        { id: "turkey", x: 50, y: 30, label: "TURKEY" }
      ]
    },
    lamb: {
      species: "lamb",
      label: "Ovis Aries",
      outline: "M10,55 L16,42 L24,36 L32,34 L40,34 L48,32 L56,32 L64,34 L72,36 L80,40 L86,46 L88,54 L84,60 L78,62 L74,70 L70,74 L66,70 L62,64 L54,66 L46,66 L38,64 L30,66 L24,70 L20,74 L16,70 L14,62 L10,62 Z",
      hotspots: [
        { id: "lambshoulder", x: 25, y: 45, label: "SHLDR" },
        { id: "lambrack", x: 45, y: 42, label: "RACK" },
        { id: "leg", x: 70, y: 50, label: "LEG" }
      ]
    }
  };

  function buildBlueprint(speciesId, selectedCutId, onSelectCut) {
    const bp = BLUEPRINTS[speciesId];
    if (!bp) return h("div", { class: "p-md text-on-surface-variant" }, "No blueprint for " + speciesId);

    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.style.cssText = "width: 100%; height: 100%; display: block;";

    // Grid background
    const defs = document.createElementNS(ns, "defs");
    defs.innerHTML = `
      <pattern id="grid-${speciesId}" width="5" height="5" patternUnits="userSpaceOnUse">
        <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(198,198,203,0.15)" stroke-width="0.3"/>
      </pattern>`;
    svg.appendChild(defs);
    const gridRect = document.createElementNS(ns, "rect");
    gridRect.setAttribute("x", "0"); gridRect.setAttribute("y", "0");
    gridRect.setAttribute("width", "100"); gridRect.setAttribute("height", "100");
    gridRect.setAttribute("fill", "url(#grid-" + speciesId + ")");
    svg.appendChild(gridRect);

    // Animal outline
    const outline = document.createElementNS(ns, "path");
    outline.setAttribute("d", bp.outline);
    outline.setAttribute("fill", "rgba(198, 198, 203, 0.08)");
    outline.setAttribute("stroke", "#c6c6cb");
    outline.setAttribute("stroke-width", "0.6");
    outline.setAttribute("vector-effect", "non-scaling-stroke");
    svg.appendChild(outline);

    // Hotspots
    bp.hotspots.forEach((hp) => {
      const earned = !!window.Store.getState().stamps[D.CUTS.find((c) => c.id === hp.id)?.stamp];
      const selected = hp.id === selectedCutId;

      const g = document.createElementNS(ns, "g");
      g.style.cursor = "pointer";
      g.addEventListener("click", () => onSelectCut(hp.id));

      const ringR = selected ? 5 : 3.6;
      const ring = document.createElementNS(ns, "circle");
      ring.setAttribute("cx", hp.x); ring.setAttribute("cy", hp.y);
      ring.setAttribute("r", ringR);
      ring.setAttribute("fill", selected ? "#ffb4ac" : earned ? "rgba(255, 180, 172, 0.35)" : "rgba(170, 137, 134, 0.2)");
      ring.setAttribute("stroke", selected ? "#ffb4ac" : "#ffb4ac");
      ring.setAttribute("stroke-width", selected ? "0.8" : "0.4");
      ring.setAttribute("vector-effect", "non-scaling-stroke");
      g.appendChild(ring);

      // Label
      const label = document.createElementNS(ns, "text");
      label.setAttribute("x", hp.x);
      label.setAttribute("y", hp.y + (selected ? 9 : 8));
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("fill", selected ? "#ffb4ac" : "#e5e2e1");
      label.setAttribute("font-family", "JetBrains Mono, monospace");
      label.setAttribute("font-size", "2.8");
      label.setAttribute("font-weight", "600");
      label.textContent = hp.label;
      g.appendChild(label);

      svg.appendChild(g);
    });

    // Frame text
    const figText = document.createElementNS(ns, "text");
    figText.setAttribute("x", 3); figText.setAttribute("y", 6);
    figText.setAttribute("fill", "#c6c6cb");
    figText.setAttribute("font-family", "JetBrains Mono, monospace");
    figText.setAttribute("font-size", "2.4");
    figText.textContent = "FIG. " + speciesId.toUpperCase() + " — " + bp.label.toUpperCase();
    svg.appendChild(figText);

    const scaleText = document.createElementNS(ns, "text");
    scaleText.setAttribute("x", 97); scaleText.setAttribute("y", 97);
    scaleText.setAttribute("text-anchor", "end");
    scaleText.setAttribute("fill", "#c6c6cb");
    scaleText.setAttribute("font-family", "JetBrains Mono, monospace");
    scaleText.setAttribute("font-size", "2.4");
    scaleText.textContent = "SCALE 1:10";
    svg.appendChild(scaleText);

    return svg;
  }

  function cutInfoPanel(cutId) {
    const cut = D.CUTS.find((c) => c.id === cutId);
    if (!cut) {
      return h("div", { class: "border-2 border-outline-variant bg-surface-container p-md text-center font-technical-data text-on-surface-variant" },
        "TAP A CUT ON THE BLUEPRINT TO LOAD SPECS"
      );
    }
    const stampDef = D.STAMPS.find((s) => s.id === cut.stamp);
    const earnedMeta = window.Store.getState().stamps[cut.stamp];

    // Best cook for this cut by user
    const cooks = window.Store.completedCooks().filter((c) => c.cut === cut.id);
    const best = cooks.length ? cooks[0] : null;

    return h("section", { class: "grid grid-cols-1 md:grid-cols-3 gap-md" },
      // Stamp card
      h("div", { class: "md:col-span-1 border-2 border-outline-variant bg-surface-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-md flex flex-col items-center justify-center" },
        h("h3", { class: "font-headline-md text-headline-md text-on-surface mb-sm w-full border-b-2 border-outline-variant pb-2 text-center uppercase" }, "Passport Stamp"),
        h("div", {
          class: "w-32 h-32 rounded-full border-4 text-primary flex flex-col items-center justify-center rotate-[-15deg] my-sm relative " +
            (earnedMeta ? "border-primary" : "border-outline-variant opacity-50")
        },
          icon(earnedMeta ? (stampDef && stampDef.icon || "workspace_premium") : "lock", { class: "text-[48px] mb-1", fill: !!earnedMeta }),
          h("span", { class: "font-headline-md text-[18px] uppercase tracking-widest font-bold" }, earnedMeta ? "EARNED" : "LOCKED"),
          earnedMeta && h("div", { class: "absolute inset-0 rounded-full border-2 border-primary border-dashed opacity-50 scale-[1.06]" })
        ),
        h("p", { class: "font-technical-data text-technical-data text-on-surface-variant text-center mt-sm" },
          stampDef ? stampDef.name : "—"
        ),
        earnedMeta && h("p", { class: "font-technical-data text-[12px] text-on-surface-variant text-center mt-1" },
          "Acquired: " + fmtDate(earnedMeta.earnedAt)
        )
      ),
      // Specs
      h("div", { class: "md:col-span-2 border-2 border-outline-variant bg-surface-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-md flex flex-col gap-sm" },
        h("h3", { class: "font-headline-md text-headline-md text-on-surface mb-sm w-full border-b-2 border-outline-variant pb-2 uppercase flex justify-between items-end" },
          h("span", null, "Target: " + cut.name.toUpperCase()),
          h("span", { class: "font-technical-data text-technical-data text-primary" }, "REC#: " + cut.recId)
        ),
        h("div", { class: "grid grid-cols-2 gap-sm" },
          h("div", { class: "bg-surface debossed-surface p-sm border border-surface-variant flex flex-col justify-between h-24" },
            h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "Internal Temp"),
            h("div", { class: "flex items-baseline justify-end gap-1" },
              h("span", { class: "font-display-xl text-[42px] text-on-surface leading-none tally" }, String(cut.targetF)),
              h("span", { class: "font-technical-data text-technical-data text-primary" }, "°F")
            )
          ),
          h("div", { class: "bg-surface debossed-surface p-sm border border-surface-variant flex flex-col justify-between h-24" },
            h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "Rest Time"),
            h("div", { class: "flex items-baseline justify-end gap-1" },
              h("span", { class: "font-display-xl text-[42px] text-on-surface leading-none tally" }, String(cut.restMin)),
              h("span", { class: "font-technical-data text-technical-data text-primary" }, "MIN")
            )
          )
        ),
        h("div", { class: "flex flex-wrap gap-sm" },
          window.UI.rivetedTag("WOOD: " + cut.wood.toUpperCase()),
          window.UI.rivetedTag("CUTS: " + cooks.length)
        ),
        best && h("a", { href: "#/cook/" + best.id, class: "font-technical-data text-technical-data text-primary hover:underline" },
          "Your personal best ↗"
        ),
        h("div", { class: "mt-auto flex justify-end" },
          h("a", {
            href: "#/cook/new?cut=" + cut.id + "&species=" + cut.species,
            class: "brutal-btn bg-primary-container text-on-primary-container font-headline-md text-[16px] uppercase tracking-wider px-md py-2 border-2 border-primary rounded flex items-center gap-2"
          }, icon("local_fire_department", { fill: true }), "Cook This Cut")
        )
      )
    );
  }

  function render(params, ctx) {
    const url = new URL(location.origin + "/?" + (ctx.path.split("?")[1] || ""));
    let activeSpecies = url.searchParams.get("species") || "beef";
    let activeCut = url.searchParams.get("cut") || null;

    const main = window.UI.pageShell({ activeTab: "map" });

    main.appendChild(h("section", { class: "w-full text-center flex flex-col gap-sm" },
      h("h1", { class: "font-headline-lg-mobile md:font-headline-lg text-primary uppercase tracking-tight" }, "Anatomical Cut Map"),
      h("p", { class: "font-technical-data text-technical-data text-on-surface-variant uppercase" }, "Select a species to view blueprint")
    ));

    const toggles = h("section", { class: "flex gap-sm justify-center w-full flex-wrap" });
    function paintToggles() {
      toggles.replaceChildren(...D.SPECIES.map((s) => {
        const active = s.id === activeSpecies;
        return h("button", {
          class: "relative riveted-tag border-2 px-md py-sm rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all font-label-caps text-label-caps " +
            (active ? "bg-primary-container border-primary text-on-primary-container" : "bg-surface-container border-outline-variant text-on-surface"),
          onclick: () => { activeSpecies = s.id; activeCut = null; paint(); }
        }, s.name.toUpperCase());
      }));
    }
    paintToggles();
    main.appendChild(toggles);

    const blueprintBox = h("section", {
      class: "w-full relative border-2 border-secondary bg-surface-container-lowest shadow-[4px_4px_0px_0px_#c6c6cb] aspect-video flex items-center justify-center overflow-hidden"
    });
    main.appendChild(blueprintBox);

    // Cut list (mobile-friendly tap targets below blueprint)
    const cutsRow = h("div", { class: "flex flex-wrap gap-sm" });
    main.appendChild(cutsRow);

    const infoSlot = h("div", null, cutInfoPanel(activeCut));
    main.appendChild(infoSlot);

    function paint() {
      // Update blueprint
      blueprintBox.replaceChildren(buildBlueprint(activeSpecies, activeCut, (cutId) => { activeCut = cutId; paint(); }));

      // Cut chips
      cutsRow.replaceChildren(...D.CUTS.filter((c) => c.species === activeSpecies).map((c) => {
        const earned = !!window.Store.getState().stamps[c.stamp];
        const active = c.id === activeCut;
        return h("button", {
          class: "px-3 py-2 border-2 rounded font-label-caps text-label-caps flex items-center gap-1 transition-colors " +
            (active
              ? "bg-primary-container border-primary text-on-primary-container"
              : earned
                ? "bg-surface-container border-primary text-primary"
                : "bg-surface border-outline-variant text-on-surface"),
          onclick: () => { activeCut = c.id; paint(); }
        }, earned && icon("workspace_premium", { class: "text-[14px]", fill: true }), c.name.toUpperCase());
      }));

      // Info panel
      infoSlot.replaceChildren(cutInfoPanel(activeCut));

      paintToggles();
    }

    paint();
  }

  window.Router.register("/map", render);
})();
