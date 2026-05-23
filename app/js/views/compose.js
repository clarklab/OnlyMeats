// ONLYMEATS - Compose new post.
(function () {
  "use strict";
  const { h, icon, toast } = window.UI;
  const D = window.OM_DATA;

  function render(params, ctx) {
    const url = new URL(location.origin + "/?" + (ctx.path.split("?")[1] || ""));
    const fromCookId = url.searchParams.get("from");
    const cook = fromCookId ? window.Store.findCook(fromCookId) : null;

    const main = window.UI.pageShell({ back: true, activeTab: "feed" });

    // Pre-fill from cook if present
    const cutDef = cook ? D.CUTS.find((c) => c.id === cook.cut) : null;
    const initialTitle = cook && cutDef ? cutDef.name + " (" + (cook.weightLbs || "?") + " lb)" : "";
    const initialWood = cook ? cook.wood : "";
    const initialSpecies = cook ? cook.species : "";
    const initialCut = cook ? cook.cut : "";

    const titleInput = h("input", { class: "gauge-input", placeholder: "14hr Central Texas Brisket", maxlength: 80, value: initialTitle });
    const speciesSelect = h("select", { class: "gauge-input" },
      h("option", { value: "" }, "Pick species..."),
      ...D.SPECIES.map((s) => h("option", { value: s.id, selected: s.id === initialSpecies }, s.name))
    );
    const cutSelect = h("select", { class: "gauge-input" }, h("option", { value: "" }, "Pick a cut..."));
    function refreshCuts() {
      const sp = speciesSelect.value;
      cutSelect.innerHTML = "";
      cutSelect.appendChild(h("option", { value: "" }, "Pick a cut..."));
      D.CUTS.filter((c) => !sp || c.species === sp).forEach((c) =>
        cutSelect.appendChild(h("option", { value: c.id, selected: c.id === initialCut }, c.name))
      );
    }
    speciesSelect.addEventListener("change", refreshCuts);
    refreshCuts();

    const woodInput = h("input", { class: "gauge-input", placeholder: "Hickory, Post Oak, Cherry...", value: initialWood });
    const gradeInput = h("input", { class: "gauge-input", placeholder: "PRIME, CHOICE, A5..." });
    const bodyInput = h("textarea", { class: "gauge-input", placeholder: "Tell the story — wrap, stall, rest, glaze...", maxlength: 600 });

    let imageData = "";
    const previewBox = h("div", {
      class: "border-2 border-outline-variant aspect-video bg-surface-container-lowest flex items-center justify-center overflow-hidden",
      style: ""
    },
      h("div", { class: "flex flex-col items-center text-on-surface-variant gap-2" },
        icon("add_photo_alternate", { class: "text-[40px]" }),
        h("span", { class: "font-label-caps text-label-caps" }, "ADD AN IMAGE")
      )
    );
    function setImage(url) {
      imageData = url;
      previewBox.innerHTML = "";
      if (url) {
        previewBox.style.cssText = `background:url(${url}) center/cover; min-height:200px;`;
      } else {
        previewBox.style.cssText = "";
        previewBox.appendChild(h("div", { class: "flex flex-col items-center text-on-surface-variant gap-2" },
          icon("add_photo_alternate", { class: "text-[40px]" }),
          h("span", { class: "font-label-caps text-label-caps" }, "ADD AN IMAGE")
        ));
      }
    }

    const fileInput = h("input", { type: "file", accept: "image/*", class: "hidden" });
    fileInput.addEventListener("change", () => {
      const f = fileInput.files && fileInput.files[0];
      if (!f) return;
      if (f.size > 5 * 1024 * 1024) { toast("Image too big (max 5 MB)", "danger"); return; }
      const r = new FileReader();
      r.onload = () => setImage(r.result);
      r.readAsDataURL(f);
    });

    let verified = !!(cook && cook.verified);
    const verifiedToggle = h("button", { class: "" }, "");
    function renderVerifiedToggle() {
      verifiedToggle.className = "brutal-btn flex items-center justify-center gap-2 px-md py-2 font-headline-md text-[16px] uppercase tracking-wider rounded border-2 " +
        (verified ? "bg-primary-container border-primary text-on-primary-container" : "bg-surface border-outline text-on-surface");
      verifiedToggle.replaceChildren(icon(verified ? "verified" : "verified_outline", { fill: verified }), document.createTextNode("VERIFIED COOK"));
    }
    verifiedToggle.addEventListener("click", () => { verified = !verified; renderVerifiedToggle(); });
    renderVerifiedToggle();

    function submit() {
      const title = (titleInput.value || "").trim();
      if (!title) return toast("Add a title", "danger");
      const newPost = window.Store.createPost({
        title,
        species: speciesSelect.value || null,
        cut: cutSelect.value || null,
        wood: woodInput.value || "",
        grade: gradeInput.value || "",
        body: bodyInput.value || "",
        image: imageData || undefined,
        verified,
        cookId: cook ? cook.id : null
      });
      toast("Posted to the feed", "success");
      window.Router.navigate("/post/" + newPost.id);
    }

    main.appendChild(window.UI.sectionHeader({ title: "New Post" }));

    if (cook) {
      main.appendChild(h("div", { class: "bg-surface-container border-2 border-outline-variant p-sm flex items-center gap-sm mb-md" },
        icon("link", { class: "text-primary" }),
        h("span", { class: "font-technical-data text-technical-data text-on-surface" }, "Linked to cook #" + cook.id.slice(-6).toUpperCase())
      ));
    }

    main.appendChild(h("div", { class: "flex flex-col gap-md" },
      h("label", { class: "flex flex-col gap-2" },
        h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "TITLE"),
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
          woodInput
        ),
        h("label", { class: "flex flex-col gap-2" },
          h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "GRADE"),
          gradeInput
        )
      ),
      h("div", { class: "flex flex-col gap-2" },
        h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "IMAGE"),
        previewBox,
        h("div", { class: "grid grid-cols-2 gap-sm" },
          h("button", {
            class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[16px] py-2 rounded flex items-center justify-center gap-2",
            onclick: () => fileInput.click()
          }, icon("upload"), "Upload"),
          h("button", {
            class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[16px] py-2 rounded flex items-center justify-center gap-2",
            onclick: () => setImage("")
          }, icon("delete"), "Clear")
        ),
        fileInput
      ),
      h("label", { class: "flex flex-col gap-2" },
        h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "STORY"),
        bodyInput
      ),
      h("div", { class: "flex items-center justify-between gap-sm pt-sm border-t-2 border-surface-variant" },
        h("span", { class: "font-technical-data text-technical-data text-on-surface-variant" }, "Mark as a verified cook?"),
        verifiedToggle
      ),
      h("button", {
        class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[20px] py-4 rounded uppercase tracking-wider mt-md",
        onclick: submit
      }, "Post To Feed")
    ));
  }

  window.Router.register("/compose", render);
})();
