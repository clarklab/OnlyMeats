// ONLYMEATS - Pit Boss profile view (own profile + other users).
(function () {
  "use strict";
  const { h, icon, avatar, toast } = window.UI;
  const D = window.OM_DATA;

  function chip(text, opts) {
    opts = opts || {};
    return h("div", { class: "flex items-center gap-2 bg-surface border-2 border-outline-variant px-sm py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" },
      h("span", { class: "w-1.5 h-1.5 rounded-full bg-outline" }),
      h("span", { class: "font-technical-data text-technical-data text-on-surface uppercase" }, text),
      opts.removable && h("button", { class: "ml-1 text-outline hover:text-primary", onclick: opts.onRemove, "aria-label": "Remove" }, icon("close", { class: "text-[14px]" }))
    );
  }

  function hardwareCard(hwId, opts) {
    opts = opts || {};
    const def = D.HARDWARE.find((x) => x.id === hwId) || { id: hwId, name: hwId, example: "", icon: "hardware" };
    return h("div", { class: "bg-surface-container-lowest border-2 border-surface-variant p-sm flex items-center gap-md relative overflow-hidden" },
      h("div", { class: "absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-outline-variant" }),
      h("div", { class: "absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-outline-variant" }),
      h("div", { class: "absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-outline-variant" }),
      h("div", { class: "absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-outline-variant" }),
      h("div", { class: "w-14 h-14 bg-surface border border-outline flex items-center justify-center shrink-0" }, icon(def.icon, { class: "text-[28px] text-outline" })),
      h("div", { class: "flex flex-col flex-1 min-w-0" },
        h("span", { class: "font-technical-data text-technical-data text-on-surface uppercase truncate" }, def.name),
        h("span", { class: "font-body-md text-body-md text-on-surface-variant truncate" }, def.example || ""),
        h("span", { class: "font-label-caps text-label-caps text-primary mt-1" }, "STATUS: ACTIVE")
      ),
      opts.removable && h("button", { class: "p-2 text-outline hover:text-error", onclick: opts.onRemove, "aria-label": "Remove" }, icon("close"))
    );
  }

  function profileBody(user, isMe) {
    const earnedCount = isMe ? Object.keys(window.Store.getState().stamps).length : 0;
    const cooksCount = isMe ? window.Store.completedCooks().length : (user.cooksCount || 0);
    const main = window.UI.pageShell({ activeTab: "profile", back: !isMe });

    // Profile plate
    main.appendChild(h("section", { class: "relative bg-surface-container border-2 border-outline-variant shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-md flex flex-col sm:flex-row items-center gap-md" },
      h("div", { class: "relative w-32 h-32 shrink-0 border-4 border-surface-variant shadow-[inset_0px_0px_10px_rgba(0,0,0,0.8)] bg-surface-container-lowest overflow-hidden" },
        user.avatar
          ? h("img", { src: user.avatar, alt: user.displayName, class: "w-full h-full object-cover filter contrast-110" })
          : h("div", { class: "w-full h-full avatar-fallback text-4xl" }, ((user.displayName || user.handle || "??").slice(0, 2).toUpperCase()))
      ),
      h("div", { class: "absolute -top-2 -left-2 transform rotate-[-15deg] border-2 border-error text-error font-label-caps text-label-caps px-2 py-1 bg-surface shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 z-10" },
        icon("verified", { class: "text-[14px]", fill: true }), "CERTIFIED"
      ),
      h("div", { class: "flex flex-col flex-1 text-center sm:text-left" },
        h("h2", { class: "font-headline-lg-mobile md:font-headline-lg text-on-surface uppercase tracking-tight" }, user.displayName || user.handle),
        h("p", { class: "font-technical-data text-technical-data text-primary uppercase mt-1" }, "@" + user.handle),
        h("div", { class: "flex items-center justify-center sm:justify-start gap-2 mt-2" },
          icon("local_fire_department", { class: "text-primary text-[18px]" }),
          h("span", { class: "font-technical-data text-technical-data text-primary" }, "RANK: " + (user.rank || "Ember").toUpperCase())
        ),
        user.bio && h("p", { class: "font-body-md text-body-md text-on-surface-variant mt-sm max-w-lg" }, user.bio),
        !isMe && h("div", { class: "pt-md" },
          h("button", {
            class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[16px] uppercase tracking-wider px-md py-2 rounded",
            onclick: () => {
              window.Store.toggleFollow(user.id);
              toast(window.Store.getState().follows.includes(user.id) ? "Now following" : "Unfollowed", "success");
              window.Router.handleRoute();
            }
          }, window.Store.getState().follows.includes(user.id) ? "FOLLOWING" : "FOLLOW")
        )
      )
    ));

    // Stats grid
    main.appendChild(h("section", { class: "grid grid-cols-2 md:grid-cols-3 gap-gutter" },
      window.UI.statPlate({ label: "LBS SMOKED", value: (user.lbsSmoked || 0).toLocaleString(), unit: "LBS", icon: "scale" }),
      window.UI.statPlate({ label: "COOKS LOGGED", value: cooksCount, unit: "TOTAL", icon: "history" }),
      isMe
        ? h("a", { href: "#/cook/new", class: "bg-surface-container-highest border-2 border-outline shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-md flex flex-col justify-center items-center gap-base text-center cursor-pointer hover:bg-surface-variant transition-colors" },
            icon("add_circle", { class: "text-primary text-[48px]" }),
            h("span", { class: "font-label-caps text-label-caps text-on-surface" }, "LOG NEW COOK")
          )
        : window.UI.statPlate({ label: "PASSPORT", value: String(earnedCount).padStart(2, "0"), unit: "STAMPS", icon: "workspace_premium" })
    ));

    // Hardware
    main.appendChild(h("section", { class: "flex flex-col gap-sm" },
      h("div", { class: "flex items-center gap-sm border-b-2 border-outline-variant pb-xs mb-sm" },
        icon("outdoor_grill", { class: "text-on-surface" }),
        h("h3", { class: "font-headline-md text-headline-md text-on-surface uppercase tracking-tight flex-1" }, "Hardware Inventory"),
        isMe && h("a", { href: "#/settings#hardware", class: "font-label-caps text-label-caps text-primary uppercase" }, "EDIT")
      ),
      (user.hardware || []).length === 0
        ? h("p", { class: "font-body-md text-body-md text-on-surface-variant italic" }, "No rigs registered.")
        : h("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-gutter" }, ...(user.hardware || []).map((id) => hardwareCard(id)))
    ));

    // Spices
    main.appendChild(h("section", { class: "flex flex-col gap-sm" },
      h("div", { class: "flex items-center gap-sm border-b-2 border-outline-variant pb-xs mb-sm" },
        icon("kitchen", { class: "text-on-surface" }),
        h("h3", { class: "font-headline-md text-headline-md text-on-surface uppercase tracking-tight flex-1" }, "Spice Cabinet"),
        isMe && h("a", { href: "#/settings#spices", class: "font-label-caps text-label-caps text-primary uppercase" }, "EDIT")
      ),
      h("div", { class: "flex flex-wrap gap-sm" }, ...(user.spices || []).map((sp) => chip(sp)))
    ));

    // Woods
    if ((user.woods || []).length) {
      main.appendChild(h("section", { class: "flex flex-col gap-sm" },
        h("div", { class: "flex items-center gap-sm border-b-2 border-outline-variant pb-xs mb-sm" },
          icon("forest", { class: "text-on-surface" }),
          h("h3", { class: "font-headline-md text-headline-md text-on-surface uppercase tracking-tight flex-1" }, "Wood Preference")
        ),
        h("div", { class: "flex flex-wrap gap-sm" }, ...(user.woods || []).map((w) => window.UI.rivetedTag(w.toUpperCase())))
      ));
    }

    // Recent activity (only on own profile)
    if (isMe) {
      const myPosts = window.Store.feedPosts().filter((p) => p.userId === user.id);
      if (myPosts.length) {
        main.appendChild(h("section", { class: "flex flex-col gap-sm" },
          h("div", { class: "flex items-center gap-sm border-b-2 border-outline-variant pb-xs mb-sm" },
            icon("local_fire_department", { class: "text-on-surface" }),
            h("h3", { class: "font-headline-md text-headline-md text-on-surface uppercase tracking-tight flex-1" }, "My Posts")
          ),
          h("div", { class: "grid grid-cols-2 md:grid-cols-3 gap-sm" },
            ...myPosts.slice(0, 6).map((p) => h("a", {
              href: "#/post/" + p.id,
              class: "aspect-square border-2 border-outline-variant relative overflow-hidden group",
              style: `background:url(${p.image}) center/cover;`
            },
              h("div", { class: "absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-80" }),
              h("div", { class: "absolute bottom-1 left-1 right-1 font-label-caps text-label-caps text-on-surface line-clamp-2" }, p.title)
            ))
          )
        ));
      }
    }
  }

  function renderMine() {
    const s = window.Store.getState();
    profileBody(s.user, true);
  }
  function renderOther(params) {
    const u = window.Store.findUser(params.id);
    if (!u) {
      const m = window.UI.pageShell({ back: true });
      m.appendChild(window.UI.emptyState({ icon: "person_off", title: "User not found", actionLabel: "Back", onAction: () => history.back() }));
      return;
    }
    const isMe = u.id === window.Store.getState().user.id;
    profileBody(u, isMe);
  }

  window.Router.register("/profile", renderMine);
  window.Router.register("/profile/:id", renderOther);
})();
