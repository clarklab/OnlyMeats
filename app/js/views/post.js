// ONLYMEATS - Post detail view with comments.
(function () {
  "use strict";
  const { h, icon, avatar, fmtTime, toast } = window.UI;

  function commentRow(c) {
    const author = window.Store.findUser(c.userId);
    return h("div", { class: "flex gap-sm pt-sm border-t border-outline-variant/50 first:border-t-0 first:pt-0" },
      avatar(author, { size: 32 }),
      h("div", { class: "flex-1 min-w-0" },
        h("div", { class: "flex items-baseline gap-2" },
          h("a", { href: "#/profile/" + (author && author.id), class: "font-technical-data text-technical-data text-on-surface" }, "@" + (author ? author.handle : "deleted")),
          h("span", { class: "font-label-caps text-label-caps text-outline-variant" }, fmtTime(c.ts))
        ),
        h("p", { class: "font-body-md text-body-md text-on-surface mt-1" }, c.text)
      )
    );
  }

  function render(params) {
    const post = window.Store.findPost(params.id);
    if (!post) {
      const m = window.UI.pageShell({ back: true, activeTab: "feed" });
      m.appendChild(window.UI.emptyState({ icon: "search_off", title: "Post not found", actionLabel: "Back to feed", onAction: () => window.Router.navigate("/feed") }));
      return;
    }
    const author = window.Store.findUser(post.userId) || window.Store.getState().user;
    const cut = window.OM_DATA.CUTS.find((c) => c.id === post.cut);
    const me = window.Store.getState().user;
    const mine = post.userId === me.id;

    const main = window.UI.pageShell({ back: true, activeTab: "feed" });

    // Author bar
    main.appendChild(h("a", { href: "#/profile/" + author.id, class: "flex items-center gap-sm border-2 border-outline-variant bg-surface-container p-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" },
      avatar(author, { size: 48 }),
      h("div", { class: "min-w-0 flex-1" },
        h("h3", { class: "font-headline-md text-headline-md text-on-surface truncate" }, author.displayName || author.handle),
        h("p", { class: "font-technical-data text-technical-data text-primary uppercase" }, "@" + author.handle + " · " + author.rank)
      ),
      h("span", { class: "font-label-caps text-label-caps text-outline" }, fmtTime(post.ts))
    ));

    // Hero image
    main.appendChild(h("div", { class: "relative border-2 border-outline-variant aspect-video bg-surface-container-lowest overflow-hidden" },
      h("img", { src: post.image, alt: post.title, class: "w-full h-full object-cover grayscale-[10%] contrast-125" }),
      post.verified && h("div", {
        class: "absolute top-4 right-4 border-2 border-primary-container text-primary-container font-headline-md text-headline-md uppercase px-3 py-1 rotate-[15deg] bg-surface/50 stamp"
      }, "Verified Cook")
    ));

    // Title + tags
    main.appendChild(h("section", { class: "flex flex-col gap-sm" },
      h("h1", { class: "font-headline-lg-mobile md:font-headline-lg text-primary uppercase tracking-tight" }, post.title),
      h("div", { class: "flex flex-wrap gap-sm" },
        post.grade && window.UI.rivetedTag("GRADE: " + post.grade),
        post.wood && window.UI.rivetedTag("WOOD: " + post.wood.toUpperCase()),
        cut && window.UI.rivetedTag("CUT: " + cut.name.toUpperCase()),
        post.species && window.UI.rivetedTag(post.species.toUpperCase())
      ),
      post.body && h("p", { class: "font-body-md text-body-md text-on-surface mt-sm whitespace-pre-wrap" }, post.body)
    ));

    // Stats / action bar
    const sizzleBtn = h("button", { class: "" });
    function paintSizzle() {
      const p = window.Store.findPost(post.id);
      sizzleBtn.className = "brutal-btn flex-1 font-headline-md text-[16px] py-3 flex items-center justify-center gap-2 rounded border-2 " +
        (p.sizzledByMe ? "bg-primary-container border-primary text-on-primary-container" : "bg-surface border-outline text-on-surface");
      sizzleBtn.replaceChildren(icon("local_fire_department", { fill: p.sizzledByMe }), document.createTextNode("SIZZLE (" + p.sizzles + ")"));
    }
    sizzleBtn.addEventListener("click", () => {
      window.Store.toggleSizzle(post.id);
      paintSizzle();
    });
    paintSizzle();

    main.appendChild(h("div", { class: "flex gap-sm" },
      sizzleBtn,
      h("button", {
        class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[16px] py-3 px-md flex items-center justify-center gap-2 rounded",
        onclick: () => {
          if (navigator.share) {
            navigator.share({ title: post.title, url: location.href }).catch(() => {});
          } else {
            try { navigator.clipboard.writeText(location.href); toast("Link copied", "success"); } catch (e) { toast("Couldn't copy", "danger"); }
          }
        }
      }, icon("share"), "SHARE"),
      mine && h("button", {
        class: "brutal-btn bg-error-container border-2 border-error text-on-error-container font-headline-md text-[16px] py-3 px-md flex items-center justify-center gap-2 rounded",
        onclick: async () => {
          const ok = await window.UI.confirm("Delete this post? This can't be undone.", { danger: true, confirmLabel: "Delete", title: "Delete Post" });
          if (!ok) return;
          window.Store.deletePost(post.id);
          toast("Post deleted", "success");
          window.Router.navigate("/feed");
        }
      }, icon("delete"))
    ));

    // Comments
    const commentsList = h("div", { class: "flex flex-col gap-sm" });
    function paintComments() {
      const p = window.Store.findPost(post.id);
      commentsList.replaceChildren(...(p.comments.length ? p.comments.slice().sort((a, b) => a.ts - b.ts).map(commentRow) : [
        h("p", { class: "font-body-md text-body-md text-on-surface-variant italic text-center py-md" }, "No comments yet. Be the first.")
      ]));
    }
    paintComments();

    const commentInput = h("input", { class: "gauge-input flex-1", placeholder: "Drop a comment...", maxlength: 280 });
    commentInput.addEventListener("keydown", (e) => { if (e.key === "Enter") submitComment(); });
    function submitComment() {
      const v = (commentInput.value || "").trim();
      if (!v) return;
      window.Store.addComment(post.id, v);
      commentInput.value = "";
      paintComments();
    }

    main.appendChild(h("section", { class: "flex flex-col gap-md border-t-2 border-surface-variant pt-md mt-md" },
      h("h2", { class: "font-headline-md text-headline-md text-primary uppercase tracking-tight" }, "Comments"),
      commentsList,
      h("div", { class: "flex gap-sm pt-sm border-t-2 border-surface-variant" },
        commentInput,
        h("button", {
          class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[16px] px-md rounded flex items-center gap-2",
          onclick: submitComment
        }, icon("send"))
      )
    ));
  }

  window.Router.register("/post/:id", render);
})();
