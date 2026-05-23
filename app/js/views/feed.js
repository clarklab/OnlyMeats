// ONLYMEATS - Pitmaster Feed view.
(function () {
  "use strict";
  const { h, icon, avatar, fmtTime, fmtDuration } = window.UI;

  function postCard(post) {
    const author = window.Store.findUser(post.userId) || window.Store.getState().user;
    const cut = window.OM_DATA.CUTS.find((c) => c.id === post.cut);
    const sizzleOn = post.sizzledByMe;

    const cookCountdown = post.cookId
      ? (() => {
          const cook = window.Store.findCook(post.cookId);
          if (cook && cook.status === "active") {
            const elapsed = Date.now() - cook.startedAt;
            return "T+" + fmtDuration(elapsed);
          }
          return fmtTime(post.ts);
        })()
      : fmtTime(post.ts);

    return h("article", { class: "bg-surface-container border-2 border-secondary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col relative overflow-hidden group" },
      // Stamped plate header
      h("a", { href: "#/profile/" + author.id, class: "bg-surface-container-high border-b-2 border-secondary px-4 py-3 flex justify-between items-center" },
        h("div", { class: "flex items-center gap-2 min-w-0" },
          avatar(author, { size: 28 }),
          h("span", { class: "font-technical-data text-technical-data text-on-surface truncate" }, "@" + author.handle)
        ),
        h("div", { class: "font-label-caps text-label-caps text-outline-variant shrink-0" }, cookCountdown)
      ),
      // Image
      h("a", { href: "#/post/" + post.id, class: "relative h-64 border-b-2 border-outline-variant overflow-hidden block" },
        h("img", {
          src: post.image,
          alt: post.title,
          class: "w-full h-full object-cover grayscale-[10%] contrast-125 group-hover:scale-105 transition-transform duration-500",
          loading: "lazy"
        }),
        post.verified && h("div", {
          class: "absolute top-4 right-4 border-2 border-primary-container text-primary-container font-headline-md text-headline-md uppercase px-3 py-1 rotate-[15deg] bg-surface/50 stamp"
        }, "Verified Cook")
      ),
      // Content
      h("a", { href: "#/post/" + post.id, class: "p-4 flex-1 flex flex-col gap-3 bg-surface-container-lowest block" },
        h("h2", { class: "font-headline-md text-headline-md text-on-surface" }, post.title),
        h("div", { class: "flex flex-wrap gap-2" },
          post.grade && h("div", { class: "riveted-tag border-2 border-outline-variant bg-surface-container px-4 py-1 flex items-center font-label-caps text-label-caps text-on-surface tracking-widest rounded" }, "GRADE: " + post.grade),
          post.wood && h("div", { class: "riveted-tag border-2 border-outline-variant bg-surface-container px-4 py-1 flex items-center font-label-caps text-label-caps text-on-surface tracking-widest rounded" }, "WOOD: " + post.wood.toUpperCase()),
          cut && h("div", { class: "riveted-tag border-2 border-outline-variant bg-surface-container px-4 py-1 flex items-center font-label-caps text-label-caps text-on-surface tracking-widest rounded" }, "CUT: " + cut.name.toUpperCase())
        ),
        post.body && h("p", { class: "font-body-md text-body-md text-on-surface-variant line-clamp-2 mt-1" }, post.body)
      ),
      // Action bar
      h("div", { class: "p-3 border-t-2 border-surface-variant bg-surface-container grid grid-cols-2 gap-3" },
        h("button", {
          class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[16px] py-2 flex items-center justify-center gap-2 rounded",
          onclick: (e) => {
            e.preventDefault();
            window.Store.toggleSizzle(post.id);
          }
        },
          icon("local_fire_department", { class: sizzleOn ? "text-primary" : "text-outline", fill: sizzleOn }),
          "SIZZLE (" + post.sizzles + ")"
        ),
        h("a", {
          href: "#/post/" + post.id,
          class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[16px] py-2 flex items-center justify-center gap-2 rounded"
        },
          icon("chat_bubble_outline"),
          "DETAILS (" + post.comments.length + ")"
        )
      )
    );
  }

  function activeCookBanner() {
    const active = window.Store.activeCooks();
    if (!active.length) return null;
    const c = active[0];
    const cutDef = window.OM_DATA.CUTS.find((x) => x.id === c.cut);
    return h("a", {
      href: "#/cook/" + c.id,
      class: "block bg-error-container border-2 border-error text-on-error-container p-md mb-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center gap-md"
    },
      h("div", { class: "flex items-center gap-md min-w-0" },
        icon("local_fire_department", { class: "text-[32px] animate-pulse", fill: true }),
        h("div", { class: "min-w-0" },
          h("div", { class: "font-headline-md text-headline-md uppercase tracking-tight truncate" }, c.title || (cutDef ? cutDef.name : "Cook") + " in progress"),
          h("div", { class: "font-technical-data text-technical-data" }, "T+" + fmtDuration(Date.now() - c.startedAt))
        )
      ),
      icon("chevron_right", { class: "text-[32px]" })
    );
  }

  function renderFeed() {
    const main = window.UI.pageShell({
      activeTab: "feed",
      rightBtn: h("button", {
        class: "text-primary hover:bg-surface-container-highest active:translate-y-0.5 active:translate-x-0.5 p-2 rounded relative",
        "aria-label": "Notifications",
        onclick: () => window.Router.navigate("/notifications")
      }, icon("notifications", { fill: window.Store.unreadCount() > 0 }),
        window.Store.unreadCount() > 0 ? h("span", { class: "absolute top-1 right-1 bg-primary text-on-primary rounded-full font-technical-data text-[10px] px-1 leading-[1.2] border border-surface" }, String(window.Store.unreadCount())) : null
      )
    });

    main.appendChild(window.UI.sectionHeader({
      title: "Live from the Pit",
      right: h("span", { class: "font-technical-data text-technical-data text-outline-variant" }, "SYS_UPTIME: 99.9%")
    }));

    main.appendChild(h("div", { id: "feed-active-cook" }, activeCookBanner()));

    // Quick action: New cook + New post
    main.appendChild(h("div", { class: "grid grid-cols-2 gap-sm mb-md" },
      h("a", {
        href: "#/cook/new",
        class: "brutal-btn bg-surface-container border-2 border-outline text-on-surface font-headline-md text-[16px] py-3 flex items-center justify-center gap-2 rounded uppercase tracking-wider"
      }, icon("add_circle", { class: "text-primary" }), "Log Cook"),
      h("a", {
        href: "#/compose",
        class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[16px] py-3 flex items-center justify-center gap-2 rounded uppercase tracking-wider"
      }, icon("post_add"), "New Post")
    ));

    const posts = window.Store.feedPosts();
    const grid = h("div", { id: "feed-grid", class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md md:gap-lg" });
    if (!posts.length) {
      grid.appendChild(window.UI.emptyState({
        icon: "local_fire_department",
        title: "Feed is cold",
        body: "No cooks yet. Be the first to fire up the pit.",
        actionLabel: "Compose Post",
        onAction: () => window.Router.navigate("/compose")
      }));
    } else {
      posts.forEach((p) => grid.appendChild(postCard(p)));
    }
    main.appendChild(grid);

    window.Router.onTeardown(window.Store.subscribe(refresh));

    function refresh() {
      const newPosts = window.Store.feedPosts();
      const newGrid = document.getElementById("feed-grid");
      if (!newGrid) return;
      newGrid.replaceChildren(...(newPosts.length ? newPosts.map(postCard) : [window.UI.emptyState({
        icon: "local_fire_department", title: "Feed is cold",
        body: "No cooks yet. Be the first to fire up the pit.",
        actionLabel: "Compose Post",
        onAction: () => window.Router.navigate("/compose")
      })]));
      const cookSlot = document.getElementById("feed-active-cook");
      if (cookSlot) {
        const banner = activeCookBanner();
        cookSlot.replaceChildren(banner || document.createTextNode(""));
      }
    }
  }

  window.Router.register("/feed", renderFeed);
})();
