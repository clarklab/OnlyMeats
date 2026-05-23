// ONLYMEATS - Settings: edit profile, hardware, spices, woods. Also Help.
(function () {
  "use strict";
  const { h, icon, toast } = window.UI;
  const D = window.OM_DATA;

  function render() {
    const s = window.Store.getState();
    const u = s.user;
    const main = window.UI.pageShell({ back: true, activeTab: "profile" });

    main.appendChild(window.UI.sectionHeader({ title: "Settings" }));

    // Profile edit
    const displayInput = h("input", { class: "gauge-input", value: u.displayName || "", maxlength: 40 });
    const bioInput = h("textarea", { class: "gauge-input", maxlength: 200 }, u.bio || "");
    bioInput.value = u.bio || "";
    const emailInput = h("input", { class: "gauge-input", type: "email", value: u.email || "" });

    main.appendChild(h("section", { id: "profile", class: "border-2 border-outline-variant bg-surface-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-md flex flex-col gap-md" },
      h("h2", { class: "font-headline-md text-headline-md text-on-surface uppercase border-b-2 border-outline-variant pb-2" }, "Profile"),
      h("div", { class: "grid grid-cols-2 gap-sm" },
        h("label", { class: "flex flex-col gap-2" },
          h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "HANDLE"),
          h("input", { class: "gauge-input", value: "@" + u.handle, disabled: true })
        ),
        h("label", { class: "flex flex-col gap-2" },
          h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "DISPLAY NAME"),
          displayInput
        )
      ),
      h("label", { class: "flex flex-col gap-2" },
        h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "EMAIL"),
        emailInput
      ),
      h("label", { class: "flex flex-col gap-2" },
        h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "BIO"),
        bioInput
      ),
      h("button", {
        class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[18px] py-3 rounded",
        onclick: () => {
          window.Store.updateUser({
            displayName: (displayInput.value || "").trim() || u.handle,
            email: (emailInput.value || "").trim(),
            bio: (bioInput.value || "").trim()
          });
          toast("Profile updated", "success");
        }
      }, "Save Profile")
    ));

    // Hardware
    const hardwareList = h("div", { class: "flex flex-wrap gap-sm" });
    function paintHardware() {
      const cur = window.Store.getState().user.hardware || [];
      hardwareList.replaceChildren(...D.HARDWARE.map((hw) => {
        const on = cur.includes(hw.id);
        return h("button", {
          class: "px-sm py-2 border-2 rounded flex items-center gap-2 font-label-caps text-label-caps transition-colors " +
            (on ? "bg-primary-container border-primary text-on-primary-container" : "bg-surface-container border-outline-variant text-on-surface"),
          onclick: () => { if (on) window.Store.removeHardware(hw.id); else window.Store.addHardware(hw.id); paintHardware(); }
        }, icon(hw.icon), hw.name.toUpperCase());
      }));
    }
    paintHardware();
    main.appendChild(h("section", { id: "hardware", class: "border-2 border-outline-variant bg-surface-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-md flex flex-col gap-md" },
      h("h2", { class: "font-headline-md text-headline-md text-on-surface uppercase border-b-2 border-outline-variant pb-2" }, "Hardware"),
      hardwareList
    ));

    // Woods
    const woodsList = h("div", { class: "flex flex-wrap gap-sm" });
    function paintWoods() {
      const cur = window.Store.getState().user.woods || [];
      woodsList.replaceChildren(...D.WOODS.map((w) => {
        const on = cur.includes(w);
        return h("button", {
          class: "riveted-tag px-sm py-2 border-2 rounded font-label-caps text-label-caps transition-colors " +
            (on ? "bg-primary-container border-primary text-on-primary-container" : "bg-surface-container border-outline-variant text-on-surface"),
          onclick: () => { window.Store.toggleWood(w); paintWoods(); }
        }, w.toUpperCase());
      }));
    }
    paintWoods();
    main.appendChild(h("section", { id: "woods", class: "border-2 border-outline-variant bg-surface-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-md flex flex-col gap-md" },
      h("h2", { class: "font-headline-md text-headline-md text-on-surface uppercase border-b-2 border-outline-variant pb-2" }, "Wood Preference"),
      woodsList
    ));

    // Spices
    const spicesList = h("div", { class: "flex flex-wrap gap-sm" });
    const customSpice = h("input", { class: "gauge-input flex-1", placeholder: "Add a custom rub..." });
    function paintSpices() {
      const cur = window.Store.getState().user.spices || [];
      spicesList.replaceChildren(...cur.map((sp) => h("div", {
        class: "flex items-center gap-2 bg-surface border-2 border-outline-variant px-sm py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
      },
        h("span", { class: "w-1.5 h-1.5 rounded-full bg-outline" }),
        h("span", { class: "font-technical-data text-technical-data text-on-surface uppercase" }, sp),
        h("button", {
          class: "ml-1 text-outline hover:text-error",
          onclick: () => { window.Store.removeSpice(sp); paintSpices(); }
        }, icon("close", { class: "text-[14px]" }))
      )));
    }
    paintSpices();
    main.appendChild(h("section", { id: "spices", class: "border-2 border-outline-variant bg-surface-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-md flex flex-col gap-md" },
      h("h2", { class: "font-headline-md text-headline-md text-on-surface uppercase border-b-2 border-outline-variant pb-2" }, "Spice Cabinet"),
      h("div", { class: "flex gap-sm" },
        customSpice,
        h("button", {
          class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[16px] px-md rounded",
          onclick: () => {
            const v = (customSpice.value || "").trim();
            if (!v) return;
            window.Store.addSpice(v);
            customSpice.value = "";
            paintSpices();
          }
        }, "Add"),
        h("button", {
          class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[16px] px-md rounded",
          onclick: () => {
            // Add common ones
            D.SPICES.slice(0, 5).forEach((sp) => window.Store.addSpice(sp));
            paintSpices();
            toast("Added common rubs", "success");
          }
        }, "Quick Add")
      ),
      spicesList
    ));

    // Danger zone
    main.appendChild(h("section", { class: "border-2 border-error bg-error-container/20 p-md flex flex-col gap-md" },
      h("h2", { class: "font-headline-md text-headline-md text-error uppercase border-b-2 border-error/40 pb-2" }, "Danger Zone"),
      h("p", { class: "font-body-md text-body-md text-on-surface-variant" }, "Wipe your account and start fresh. This clears all cooks, posts, and stamps."),
      h("button", {
        class: "brutal-btn bg-error-container border-2 border-error text-on-error-container font-headline-md text-[18px] py-3 rounded uppercase tracking-wider",
        onclick: async () => {
          const ok = await window.UI.confirm("Wipe all local data? This can't be undone.", { danger: true, confirmLabel: "Wipe", title: "Wipe Account" });
          if (!ok) return;
          window.Store.reset();
          toast("All data wiped", "danger");
          window.Router.navigate("/welcome", { replace: true });
        }
      }, "Wipe Account")
    ));

    main.appendChild(h("footer", { class: "text-center pt-md" },
      h("span", { class: "brand-brick font-headline-md text-headline-md" }, "ONLYMEATS"),
      h("p", { class: "font-label-caps text-label-caps text-outline mt-sm" }, "v1.0 // FIRE GRADE")
    ));

    // Scroll to hash section if present
    if (location.hash.includes("#hardware") || location.hash.includes("#spices") || location.hash.includes("#woods")) {
      const id = location.hash.split("#").pop();
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }

  function renderHelp() {
    const main = window.UI.pageShell({ back: true, activeTab: "feed" });
    main.appendChild(window.UI.sectionHeader({ title: "Help" }));

    const faqs = [
      { q: "How do I earn a stamp?", a: "Complete a cook on your live timer for that cut. Mark it VERIFIED on completion and a stamp lands in your Passport." },
      { q: "What's a 'sizzle'?", a: "It's a like. Tap the fire button on any post to sizzle it. Sizzles surface popular cooks at the top of the feed." },
      { q: "Will my data sync between devices?", a: "Not in this demo build — everything is stored locally on this device. Wipe Account from Settings to clear it." },
      { q: "What is 'The Stall'?", a: "When a brisket or pork butt plateaus around 150–170°F as moisture evaporates. The live timer flags it so you can wrap." },
      { q: "Can I share a cook to the feed?", a: "Yes — after completing a cook, tap SHARE TO FEED on the cook page. The form pre-fills from your cook data." }
    ];

    main.appendChild(h("div", { class: "flex flex-col gap-sm" },
      ...faqs.map((f) => h("details", { class: "border-2 border-outline-variant bg-surface-container p-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer" },
        h("summary", { class: "font-headline-md text-headline-md text-on-surface uppercase tracking-tight" }, f.q),
        h("p", { class: "font-body-md text-body-md text-on-surface-variant mt-sm" }, f.a)
      ))
    ));

    main.appendChild(h("div", { class: "border-2 border-outline-variant bg-surface-container-lowest p-md mt-md text-center" },
      h("p", { class: "font-body-md text-body-md text-on-surface" }, "Need more? Hit the pit harder."),
      h("a", { href: "#/feed", class: "brutal-btn inline-flex bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[18px] px-md py-3 rounded mt-sm uppercase tracking-wider" }, "Back To The Feed")
    ));
  }

  window.Router.register("/settings", render);
  window.Router.register("/help", renderHelp);
})();
