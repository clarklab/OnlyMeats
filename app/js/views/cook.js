// ONLYMEATS - Cook setup (/cook/new) and live cook timer (/cook/:id).
(function () {
  "use strict";
  const { h, icon, fmtDuration, fmtTime, toast } = window.UI;
  const D = window.OM_DATA;

  // ---------- /cook/new ----------
  function renderNew(params, ctx) {
    const url = new URL(location.origin + "/?" + (ctx.path.split("?")[1] || ""));
    const presetCut = url.searchParams.get("cut") || "";
    const presetSpecies = url.searchParams.get("species") || "";
    const tour = url.searchParams.get("tour") === "1";

    const main = window.UI.pageShell({ back: true, activeTab: "feed" });

    main.appendChild(window.UI.sectionHeader({ title: "New Cook" }));

    if (tour) {
      main.appendChild(h("div", { class: "border-2 border-primary bg-primary-container/20 p-md flex items-start gap-md" },
        icon("auto_awesome", { class: "text-primary text-[28px]" }),
        h("div", null,
          h("h3", { class: "font-headline-md text-headline-md text-primary uppercase" }, "Tour: Log a cook"),
          h("p", { class: "font-body-md text-body-md text-on-surface mt-1" }, "Set the species, cut, wood and target temp. We'll run a live timer and you can share it to the feed when done.")
        )
      ));
    }

    const titleInput = h("input", { class: "gauge-input", placeholder: "e.g. Brisket #042", maxlength: 60 });
    const speciesSelect = h("select", { class: "gauge-input" },
      h("option", { value: "" }, "Pick species..."),
      ...D.SPECIES.map((s) => h("option", { value: s.id, selected: s.id === presetSpecies }, s.name))
    );
    const cutSelect = h("select", { class: "gauge-input" });
    const woodSelect = h("select", { class: "gauge-input" },
      h("option", { value: "" }, "Pick wood..."),
      ...D.WOODS.map((w) => h("option", { value: w }, w))
    );
    const hardwareSelect = h("select", { class: "gauge-input" },
      h("option", { value: "" }, "Pick rig..."),
      ...((window.Store.getState().user.hardware && window.Store.getState().user.hardware.length)
        ? window.Store.getState().user.hardware
        : D.HARDWARE.map((x) => x.id))
        .map((id) => {
          const def = D.HARDWARE.find((x) => x.id === id) || { name: id };
          return h("option", { value: id }, def.name);
        })
    );

    const weightInput = h("input", { class: "gauge-input", type: "number", min: 0, step: 0.5, placeholder: "0.0", inputmode: "decimal" });
    const targetInput = h("input", { class: "gauge-input", type: "number", min: 100, max: 250, placeholder: "203", inputmode: "numeric" });
    const pitInput = h("input", { class: "gauge-input", type: "number", min: 100, max: 400, placeholder: "225", inputmode: "numeric" });

    function refreshCuts() {
      const sp = speciesSelect.value;
      cutSelect.innerHTML = "";
      cutSelect.appendChild(h("option", { value: "" }, "Pick cut..."));
      D.CUTS.filter((c) => !sp || c.species === sp).forEach((c) => {
        cutSelect.appendChild(h("option", { value: c.id, selected: c.id === presetCut }, c.name));
      });
    }
    speciesSelect.addEventListener("change", refreshCuts);
    refreshCuts();

    // When cut changes, auto-fill target temp and wood
    cutSelect.addEventListener("change", () => {
      const c = D.CUTS.find((x) => x.id === cutSelect.value);
      if (c) {
        if (!targetInput.value) targetInput.value = c.targetF;
        if (!woodSelect.value) woodSelect.value = c.wood;
        if (!titleInput.value) titleInput.value = c.name;
      }
    });

    // Apply preset cut now if any
    if (presetCut) {
      const c = D.CUTS.find((x) => x.id === presetCut);
      if (c) {
        if (!speciesSelect.value) speciesSelect.value = c.species;
        refreshCuts();
        cutSelect.value = presetCut;
        targetInput.value = c.targetF;
        woodSelect.value = c.wood;
        titleInput.value = c.name;
      }
    }

    // Pre-fill defaults
    if (!pitInput.value) pitInput.value = 225;

    const startBtn = h("button", {
      class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[22px] py-4 rounded uppercase tracking-wider mt-md flex items-center justify-center gap-2"
    }, icon("local_fire_department", { fill: true }), "Light The Fire");

    startBtn.addEventListener("click", () => {
      const title = (titleInput.value || "").trim();
      const species = speciesSelect.value;
      const cut = cutSelect.value;
      const wood = woodSelect.value;
      const hardware = hardwareSelect.value;
      const weightLbs = Number(weightInput.value) || 0;
      const targetF = Number(targetInput.value) || 0;
      const pitTempF = Number(pitInput.value) || 225;

      if (!species) return toast("Pick a species", "danger");
      if (!cut) return toast("Pick a cut", "danger");
      if (!targetF) return toast("Set a target temp", "danger");

      window.UI.withButtonLoading(startBtn, "Lighting", async () => {
        await new Promise((r) => setTimeout(r, 800));
        const cook = window.Store.startCook({
          title: title || (D.CUTS.find((c) => c.id === cut).name),
          species, cut, wood, hardware,
          weightLbs, targetF, pitTempF, internalF: 0
        });
        toast("Cook started — fire it up", "success");
        window.Router.navigate("/cook/" + cook.id);
      });
    });

    main.appendChild(h("div", { class: "flex flex-col gap-md" },
      h("label", { class: "flex flex-col gap-2" },
        h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "TITLE (OPTIONAL)"),
        titleInput
      ),
      h("div", { class: "grid grid-cols-2 gap-sm" },
        h("label", { class: "flex flex-col gap-2" },
          h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "SPECIES"),
          speciesSelect
        ),
        h("label", { class: "flex flex-col gap-2" },
          h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "CUT"),
          cutSelect
        )
      ),
      h("div", { class: "grid grid-cols-2 gap-sm" },
        h("label", { class: "flex flex-col gap-2" },
          h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "WOOD"),
          woodSelect
        ),
        h("label", { class: "flex flex-col gap-2" },
          h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "RIG"),
          hardwareSelect
        )
      ),
      h("div", { class: "grid grid-cols-3 gap-sm" },
        h("label", { class: "flex flex-col gap-2" },
          h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "WEIGHT (LB)"),
          weightInput
        ),
        h("label", { class: "flex flex-col gap-2" },
          h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "TARGET °F"),
          targetInput
        ),
        h("label", { class: "flex flex-col gap-2" },
          h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "PIT °F"),
          pitInput
        )
      ),
      startBtn
    ));
  }

  // ---------- /cook/:id (Live timer) ----------
  function renderLive(params) {
    const cook = window.Store.findCook(params.id);
    if (!cook) {
      const m = window.UI.pageShell({ back: true });
      m.appendChild(window.UI.emptyState({ icon: "outdoor_grill", title: "Cook not found", actionLabel: "Back", onAction: () => history.back() }));
      return;
    }
    const cutDef = D.CUTS.find((c) => c.id === cook.cut);

    const main = window.UI.pageShell({ back: true, activeTab: "feed" });

    // Status plate
    const headerEl = h("section", { class: "raised-plate bg-surface-container p-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md" });
    main.appendChild(headerEl);

    // Main timer panel
    const timerEl = h("section", { class: "raised-plate bg-surface-container-high p-md sm:p-lg flex flex-col items-center justify-center relative overflow-hidden" });
    main.appendChild(timerEl);

    // Telemetry grid
    const teleEl = h("section", { class: "grid grid-cols-1 sm:grid-cols-3 gap-gutter" });
    main.appendChild(teleEl);

    // Phases
    const phasesEl = h("section", { class: "raised-plate bg-surface-container p-md flex flex-col" });
    main.appendChild(phasesEl);

    // Notes log
    const notesEl = h("section", { class: "raised-plate bg-surface-container p-md flex flex-col gap-sm" });
    main.appendChild(notesEl);

    // Controls
    const controlsEl = h("section", { class: "grid grid-cols-1 sm:grid-cols-3 gap-md mt-sm" });
    main.appendChild(controlsEl);

    function repaint() {
      const c = window.Store.findCook(cook.id);
      if (!c) return;

      // Header
      headerEl.replaceChildren(
        h("div", { class: "min-w-0" },
          h("h1", { class: "font-headline-lg-mobile md:font-headline-lg text-primary uppercase truncate" }, c.title),
          h("p", { class: "font-technical-data text-technical-data text-on-surface-variant mt-xs flex items-center gap-2 flex-wrap" },
            icon("outdoor_grill", { class: "text-sm" }),
            (D.HARDWARE.find((x) => x.id === c.hardware) || { name: "" }).name.toUpperCase() || "—",
            " | ", (c.wood || "—").toUpperCase(), " WOOD"
          )
        ),
        h("div", {
          class: "px-3 py-1 font-label-caps text-label-caps border flex items-center gap-2 " +
            (c.status === "complete"
              ? "bg-primary-container text-on-primary-container border-primary"
              : c.status === "aborted"
                ? "bg-surface-container border-outline text-on-surface-variant"
                : "bg-error-container text-on-error-container border-error animate-pulse")
        },
          icon(c.status === "complete" ? "verified" : c.status === "aborted" ? "stop_circle" : "local_fire_department", { class: "text-sm", fill: c.status !== "aborted" }),
          c.status === "complete" ? "COMPLETED" : c.status === "aborted" ? "STOPPED" : "ACTIVE COOK"
        )
      );

      // Timer panel
      const elapsedMs = (c.endedAt || Date.now()) - c.startedAt;
      const pct = c.targetF > 0 && c.internalF > 0
        ? Math.min(100, Math.round((c.internalF / c.targetF) * 100))
        : 0;
      const estRemainMin = (() => {
        // Rough estimate based on cook progress; if past target, 0
        if (!c.internalF || c.internalF >= c.targetF) return 0;
        const elapsedMin = elapsedMs / 60000;
        if (elapsedMin < 10) return null;
        const ratePerMin = c.internalF / elapsedMin; // very rough
        if (ratePerMin <= 0) return null;
        const remainDeg = c.targetF - c.internalF;
        return Math.max(0, Math.round(remainDeg / ratePerMin));
      })();

      timerEl.replaceChildren(
        h("div", { class: "absolute top-3 left-3 w-2 h-2 rounded-full bg-tertiary-container" }),
        h("div", { class: "absolute top-3 right-3 w-2 h-2 rounded-full bg-tertiary-container" }),
        h("div", { class: "absolute bottom-3 left-3 w-2 h-2 rounded-full bg-tertiary-container" }),
        h("div", { class: "absolute bottom-3 right-3 w-2 h-2 rounded-full bg-tertiary-container" }),
        h("h2", { class: "font-label-caps text-label-caps text-on-surface-variant mb-3 tracking-[0.2em]" }, "ELAPSED TIME"),
        h("div", { class: "debossed-surface bg-surface px-md sm:px-lg py-3 border-2 border-outline-variant flex items-center justify-center min-w-[260px] " + (c.status === "active" ? "timer-active" : "") },
          h("span", { class: "font-display-xl text-[48px] sm:text-display-xl text-primary font-technical-data tracking-widest tabular-nums text-center" }, fmtDuration(elapsedMs))
        ),
        c.status === "active" && h("p", { class: "font-technical-data text-technical-data text-secondary mt-3 flex items-center gap-2" },
          icon("local_fire_department", { class: "text-sm text-error" }),
          estRemainMin == null
            ? "EST. REMAINING: CALIBRATING..."
            : estRemainMin === 0
              ? "TARGET REACHED — REST & PULL"
              : `EST. REMAINING: ~${Math.floor(estRemainMin / 60)}H ${estRemainMin % 60}M`
        )
      );

      // Telemetry
      const pitDelta = c.tempHistory.length > 1 ? c.pitTempF - c.tempHistory[0].pitTempF : 0;
      const stall = c.internalF >= 150 && c.internalF <= 170 && c.targetF >= 195;

      teleEl.replaceChildren(
        h("div", { class: "raised-plate bg-surface-container p-md flex flex-col" },
          h("h3", { class: "font-label-caps text-label-caps text-on-surface-variant mb-2" }, "PIT TEMP"),
          h("div", { class: "flex items-end gap-2" },
            h("span", { class: "font-headline-lg-mobile text-headline-lg-mobile text-on-surface tally" }, c.pitTempF + "°"),
            h("span", { class: "font-technical-data text-technical-data text-on-surface-variant mb-1" }, "F")
          ),
          h("div", { class: "h-12 w-full mt-3 border-b border-outline-variant relative" },
            buildSparkline(c.tempHistory, "pitTempF"),
            icon(pitDelta >= 0 ? "trending_up" : "trending_down", { class: "absolute top-0 right-0 text-primary text-sm" })
          )
        ),
        h("div", { class: "raised-plate bg-surface-container p-md flex flex-col " + (stall ? "border-l-4 border-l-error" : "") },
          h("h3", { class: "font-label-caps text-label-caps text-on-surface-variant mb-2" }, "INTERNAL"),
          h("div", { class: "flex items-end gap-2" },
            h("span", { class: "font-headline-lg-mobile text-headline-lg-mobile tally " + (stall ? "text-error" : "text-on-surface") }, (c.internalF || "—") + (c.internalF ? "°" : "")),
            h("span", { class: "font-technical-data text-technical-data text-on-surface-variant mb-1" }, "F")
          ),
          stall
            ? h("div", { class: "mt-auto pt-3 flex items-center gap-2 text-error" },
                icon("warning", { class: "text-sm" }),
                h("span", { class: "font-label-caps text-label-caps animate-pulse" }, "THE STALL DETECTED")
              )
            : h("div", { class: "h-12 w-full mt-3 border-b border-outline-variant relative" }, buildSparkline(c.tempHistory, "internalF"))
        ),
        h("div", { class: "raised-plate bg-surface-container p-md flex flex-col" },
          h("h3", { class: "font-label-caps text-label-caps text-on-surface-variant mb-2" }, "TARGET INTERNAL"),
          h("div", { class: "flex items-end gap-2" },
            h("span", { class: "font-headline-lg-mobile text-headline-lg-mobile text-on-surface tally" }, c.targetF + "°"),
            h("span", { class: "font-technical-data text-technical-data text-on-surface-variant mb-1" }, "F")
          ),
          h("div", { class: "w-full bg-surface-container-highest h-2 mt-auto relative" },
            h("div", { class: "absolute top-0 left-0 h-full bg-primary", style: `width: ${pct}%;` })
          ),
          h("div", { class: "font-technical-data text-technical-data text-right mt-1 text-on-surface-variant text-xs" }, pct + "% REACHED")
        )
      );

      // Phases
      const phases = [
        { id: "smoking", label: "SMOKING", desc: "Bark formation" },
        { id: "wrapping", label: "WRAPPING", desc: "Butcher paper" },
        { id: "resting", label: "RESTING", desc: "Hold in cambro" }
      ];
      const phaseIdx = Math.max(0, phases.findIndex((p) => p.id === c.phase));

      phasesEl.replaceChildren(
        h("h3", { class: "font-label-caps text-label-caps text-on-surface-variant mb-3" }, "COOK PHASES"),
        h("div", { class: "flex flex-col gap-3 relative" },
          h("div", { class: "absolute left-[11px] top-3 bottom-3 w-0.5 bg-outline-variant z-0" }),
          ...phases.map((p, i) => {
            const done = i < phaseIdx;
            const active = i === phaseIdx;
            return h("div", { class: "flex items-center gap-md relative z-10 " + (done ? "opacity-60" : active ? "" : "opacity-40") },
              h("div", { class: "w-6 h-6 rounded-full flex items-center justify-center border-2 " + (done ? "bg-primary border-primary" : active ? "bg-surface-container border-primary" : "bg-surface-container border-outline-variant") },
                done ? icon("check", { class: "text-[14px] text-on-primary" }) : active ? h("div", { class: "w-2 h-2 rounded-full bg-primary animate-pulse" }) : null
              ),
              h("div", { class: "flex-1 cursor-pointer", onclick: () => c.status === "active" && (window.Store.advancePhase(c.id, p.id), repaint(), toast("Phase: " + p.label, "success")) },
                h("div", { class: "font-headline-md text-headline-md " + (active ? "text-primary" : "text-on-surface") }, p.label),
                h("div", { class: "font-technical-data text-technical-data " + (active ? "text-primary" : "text-on-surface-variant") }, p.desc)
              )
            );
          })
        )
      );

      // Notes
      notesEl.replaceChildren(
        h("div", { class: "flex justify-between items-center" },
          h("h3", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "COOK LOG"),
          h("span", { class: "font-technical-data text-technical-data text-outline" }, c.notes.length + " entries")
        ),
        c.notes.length === 0
          ? h("p", { class: "font-body-md text-body-md text-on-surface-variant italic text-center py-sm" }, "No log entries yet.")
          : h("div", { class: "flex flex-col gap-2 max-h-64 overflow-y-auto" },
              ...c.notes.map((n) => h("div", { class: "border-l-2 border-primary pl-sm py-1" },
                h("p", { class: "font-body-md text-body-md text-on-surface" }, n.text),
                h("p", { class: "font-technical-data text-[11px] text-outline" }, fmtTime(n.ts))
              ))
            )
      );

      // Controls
      if (c.status === "active") {
        controlsEl.replaceChildren(
          h("button", {
            class: "mechanical-btn bg-surface-container border-2 border-outline-variant py-3 px-md font-headline-md text-[16px] text-on-surface flex items-center justify-center gap-2 rounded",
            onclick: openNoteModal
          }, icon("edit_note", { fill: true }), "ADD LOG NOTE"),
          h("button", {
            class: "mechanical-btn bg-surface-container border-2 border-outline-variant py-3 px-md font-headline-md text-[16px] text-on-surface flex items-center justify-center gap-2 rounded",
            onclick: openTempModal
          }, icon("thermostat", { fill: true }), "LOG TEMP"),
          h("button", {
            class: "mechanical-btn bg-primary-container border-2 border-primary py-3 px-md font-headline-md text-[16px] text-on-primary-container flex items-center justify-center gap-2 rounded",
            onclick: openCompleteModal
          }, icon("done_all", { fill: true }), "COMPLETE"),
          h("button", {
            class: "mechanical-btn bg-error-container border-2 border-error py-3 px-md font-headline-md text-[16px] text-on-error-container flex items-center justify-center gap-2 rounded sm:col-span-3",
            onclick: async () => {
              const ok = await window.UI.confirm("Stop this cook? Notes and progress are kept but it won't count toward stamps.", { danger: true, confirmLabel: "Stop Cook", title: "Stop Cook" });
              if (!ok) return;
              window.Store.abortCook(c.id);
              toast("Cook stopped", "danger");
              repaint();
            }
          }, icon("stop_circle", { fill: true }), "STOP COOK")
        );
      } else if (c.status === "complete") {
        controlsEl.replaceChildren(
          h("a", {
            href: "#/compose?from=" + c.id,
            class: "mechanical-btn bg-primary-container border-2 border-primary py-3 px-md font-headline-md text-[16px] text-on-primary-container flex items-center justify-center gap-2 rounded sm:col-span-2"
          }, icon("post_add"), "SHARE TO FEED"),
          h("a", {
            href: "#/cooks",
            class: "mechanical-btn bg-surface-container border-2 border-outline py-3 px-md font-headline-md text-[16px] text-on-surface flex items-center justify-center gap-2 rounded"
          }, icon("history"), "COOK LOG")
        );
      } else {
        controlsEl.replaceChildren(
          h("a", { href: "#/cook/new", class: "mechanical-btn bg-primary-container border-2 border-primary py-3 px-md font-headline-md text-[16px] text-on-primary-container flex items-center justify-center gap-2 rounded sm:col-span-3" },
            icon("add_circle"), "NEW COOK")
        );
      }
    }

    function openNoteModal() {
      const input = h("textarea", { class: "gauge-input", placeholder: "Wrapped at 165°F, bark looks great.", maxlength: 280 });
      const closer = window.UI.openModal(
        h("div", { class: "flex flex-col gap-md" },
          h("p", { class: "font-body-md text-body-md text-on-surface-variant" }, "Drop a quick note in the cook log."),
          input,
          h("div", { class: "grid grid-cols-2 gap-sm" },
            h("button", { class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[18px] py-3 rounded", onclick: () => closer() }, "Cancel"),
            h("button", {
              class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[18px] py-3 rounded",
              onclick: () => {
                const v = (input.value || "").trim();
                if (!v) return toast("Empty", "danger");
                window.Store.logCookNote(cook.id, v);
                closer(); repaint(); toast("Logged", "success");
              }
            }, "Add")
          )
        ),
        { title: "Add Log Note" }
      );
      setTimeout(() => input.focus(), 50);
    }

    function openTempModal() {
      const c = window.Store.findCook(cook.id);
      const pit = h("input", { class: "gauge-input", type: "number", inputmode: "numeric", value: c.pitTempF });
      const internal = h("input", { class: "gauge-input", type: "number", inputmode: "numeric", value: c.internalF || "" });
      const closer = window.UI.openModal(
        h("div", { class: "flex flex-col gap-md" },
          h("p", { class: "font-body-md text-body-md text-on-surface-variant" }, "Punch in current readings. We'll plot the trend."),
          h("div", { class: "grid grid-cols-2 gap-sm" },
            h("label", { class: "flex flex-col gap-2" },
              h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "PIT °F"), pit
            ),
            h("label", { class: "flex flex-col gap-2" },
              h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "INTERNAL °F"), internal
            )
          ),
          h("div", { class: "grid grid-cols-2 gap-sm" },
            h("button", { class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[18px] py-3 rounded", onclick: () => closer() }, "Cancel"),
            h("button", {
              class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[18px] py-3 rounded",
              onclick: () => {
                const p = Number(pit.value);
                const i = Number(internal.value);
                if (!p && !i) return toast("Enter a value", "danger");
                window.Store.logCookTemp(cook.id, { pitTempF: p, internalF: i });
                closer(); repaint(); toast("Temp logged", "success");
              }
            }, "Save")
          )
        ),
        { title: "Log Temperature" }
      );
    }

    function openCompleteModal() {
      const verified = h("input", { type: "checkbox", checked: true, class: "w-5 h-5 accent-primary" });
      const finalInternal = h("input", { class: "gauge-input", type: "number", inputmode: "numeric", value: window.Store.findCook(cook.id).internalF || window.Store.findCook(cook.id).targetF });
      const closer = window.UI.openModal(
        h("div", { class: "flex flex-col gap-md" },
          h("p", { class: "font-body-md text-body-md text-on-surface-variant" }, "Pull it. Lock the final internal temp and complete the cook to earn your stamp."),
          h("label", { class: "flex flex-col gap-2" },
            h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "FINAL INTERNAL °F"), finalInternal
          ),
          h("label", { class: "flex items-center gap-2 cursor-pointer" }, verified,
            h("span", { class: "font-technical-data text-technical-data text-on-surface" }, "Mark as VERIFIED COOK")
          ),
          h("div", { class: "grid grid-cols-2 gap-sm" },
            h("button", { class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[18px] py-3 rounded", onclick: () => closer() }, "Cancel"),
            h("button", {
              class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[18px] py-3 rounded",
              onclick: () => {
                window.Store.logCookTemp(cook.id, { internalF: Number(finalInternal.value) || cook.targetF });
                window.Store.completeCook(cook.id, { verified: verified.checked });
                const updated = window.Store.findCook(cook.id);
                closer();
                if (updated._earnedStamps && updated._earnedStamps.length) {
                  toast("Stamp earned: " + updated._earnedStamps.map((s) => D.STAMPS.find((x) => x.id === s).name).join(", "), "success");
                } else {
                  toast("Cook complete", "success");
                }
                repaint();
              }
            }, "Complete")
          )
        ),
        { title: "Complete Cook" }
      );
    }

    repaint();

    // Live tick: re-render timer-only segment every second while active
    const tick = setInterval(() => {
      const c = window.Store.findCook(cook.id);
      if (!c || c.status !== "active") return;
      const elapsedMs = Date.now() - c.startedAt;
      const timeNode = timerEl.querySelector(".font-display-xl");
      if (timeNode) timeNode.textContent = fmtDuration(elapsedMs);
    }, 1000);
    window.Router.onTeardown(() => clearInterval(tick));

    // Re-render fully on any store change (e.g., another tab)
    window.Router.onTeardown(window.Store.subscribe(repaint));
  }

  function buildSparkline(history, field) {
    if (!history || history.length < 2) return null;
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 100 40");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("class", "absolute bottom-0 w-full h-full");
    const values = history.map((h) => h[field] || 0);
    const min = Math.min(...values, 0);
    const max = Math.max(...values, 1);
    const range = max - min || 1;
    const step = 100 / Math.max(1, values.length - 1);
    const pts = values.map((v, i) => {
      const x = (i * step).toFixed(2);
      const y = (40 - ((v - min) / range) * 35 - 2).toFixed(2);
      return `${x},${y}`;
    }).join(" ");
    const path = document.createElementNS(ns, "polyline");
    path.setAttribute("points", pts);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#ffb4ac");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("vector-effect", "non-scaling-stroke");
    svg.appendChild(path);
    return svg;
  }

  window.Router.register("/cook/new", renderNew);
  window.Router.register("/cook/:id", renderLive);
})();
