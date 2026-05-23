// ONLYMEATS - Friends list.
(function () {
  "use strict";
  const { h, icon, avatar, toast } = window.UI;

  function friendRow(user, followed) {
    return h("div", { class: "border-2 border-outline-variant bg-surface-container p-sm flex items-center gap-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" },
      h("a", { href: "#/profile/" + user.id, class: "flex items-center gap-sm flex-1 min-w-0" },
        avatar(user, { size: 48 }),
        h("div", { class: "min-w-0 flex-1" },
          h("div", { class: "font-headline-md text-headline-md text-on-surface uppercase truncate" }, user.displayName || user.handle),
          h("div", { class: "font-technical-data text-technical-data text-primary uppercase truncate" }, "@" + user.handle + " · " + user.rank)
        )
      ),
      h("button", {
        class: "brutal-btn font-headline-md text-[14px] uppercase tracking-wider px-md py-2 rounded border-2 " +
          (followed ? "bg-surface border-outline text-on-surface" : "bg-primary-container border-primary text-on-primary-container"),
        onclick: () => {
          window.Store.toggleFollow(user.id);
          toast(window.Store.getState().follows.includes(user.id) ? "Now following" : "Unfollowed", "success");
          window.Router.handleRoute();
        }
      }, followed ? "FOLLOWING" : "FOLLOW")
    );
  }

  function render() {
    const main = window.UI.pageShell({ back: true, activeTab: "profile" });
    const s = window.Store.getState();
    const others = s.users.filter((u) => u.id !== s.user.id);
    const followed = others.filter((u) => s.follows.includes(u.id));
    const suggested = others.filter((u) => !s.follows.includes(u.id));

    main.appendChild(window.UI.sectionHeader({ title: "Pitmasters" }));

    main.appendChild(h("section", { class: "flex flex-col gap-sm" },
      h("h2", { class: "font-label-caps text-label-caps text-on-surface-variant uppercase" }, "Following · " + followed.length),
      followed.length
        ? h("div", { class: "flex flex-col gap-sm" }, ...followed.map((u) => friendRow(u, true)))
        : h("p", { class: "font-body-md text-body-md text-on-surface-variant italic" }, "Not following anyone yet.")
    ));

    if (suggested.length) {
      main.appendChild(h("section", { class: "flex flex-col gap-sm mt-md" },
        h("h2", { class: "font-label-caps text-label-caps text-on-surface-variant uppercase" }, "Suggested"),
        h("div", { class: "flex flex-col gap-sm" }, ...suggested.map((u) => friendRow(u, false)))
      ));
    }
  }

  window.Router.register("/friends", render);
})();
