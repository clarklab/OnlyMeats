// ONLYMEATS - Welcome + onboarding multi-step flow.
(function () {
  "use strict";

  const { h, icon, toast, avatar } = window.UI;
  const D = window.OM_DATA;

  // Mutable draft across onboarding steps
  let draft = {
    handle: "",
    displayName: "",
    email: "",
    password: "",
    avatar: "",
    bio: "",
    species: [],
    hardware: [],
    woods: [],
    spices: []
  };
  function resetDraft() {
    draft = { handle: "", displayName: "", email: "", password: "", avatar: "", bio: "", species: [], hardware: [], woods: [], spices: [] };
  }

  function shell(stepIndex, totalSteps, body) {
    const root = document.getElementById("app-root");
    root.innerHTML = "";

    const progress = h("div", { class: "flex gap-1 w-full max-w-md" },
      ...Array.from({ length: totalSteps }, (_, i) =>
        h("div", { class: "h-1 flex-1 " + (i < stepIndex ? "bg-primary" : i === stepIndex ? "bg-primary" : "bg-surface-variant") })
      )
    );

    const main = h("main", { class: "min-h-[100dvh] flex flex-col items-center pt-safe pb-safe px-margin-mobile pt-md pb-md w-full" },
      h("div", { class: "w-full max-w-md flex flex-col gap-md flex-grow view-enter" },
        h("div", { class: "flex items-center justify-between" },
          h("a", { href: "#/welcome", class: "brand-brick font-headline-md text-headline-md" }, "ONLYMEATS"),
          h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, `STEP ${stepIndex + 1} / ${totalSteps}`)
        ),
        progress,
        body
      )
    );
    root.appendChild(main);
  }

  // ----- /welcome -----
  function renderWelcome() {
    const root = document.getElementById("app-root");
    root.innerHTML = "";

    const heroImage = "https://images.unsplash.com/photo-1558030006-450675393462?w=1400&q=80&auto=format&fit=crop";

    const main = h("main", { class: "min-h-[100dvh] flex flex-col relative overflow-hidden" },
      // Hero image
      h("div", { class: "absolute inset-0", style: `background-image: linear-gradient(180deg, rgba(19,19,19,0.55) 0%, rgba(19,19,19,0.95) 80%), url(${heroImage}); background-size: cover; background-position: center;` }),
      // Overlay
      h("div", { class: "relative z-10 flex flex-col flex-grow justify-between p-margin-mobile pt-safe pb-safe" },
        // Top brand
        h("div", { class: "pt-md flex justify-center" },
          h("span", { class: "brand-brick font-headline-md text-headline-md" }, "ONLYMEATS")
        ),
        // Center
        h("div", { class: "flex flex-col gap-md max-w-md mx-auto text-center pt-xl" },
          h("h1", { class: "font-headline-lg-mobile md:font-headline-lg text-display-xl text-on-surface uppercase tracking-tighter leading-[0.9]" }, "Built for the fire."),
          h("p", { class: "font-body-lg text-body-lg text-on-surface-variant" }, "The social network for over-fire cooks. Log your cooks, earn stamps, sizzle the work of other pitmasters."),
          h("div", { class: "flex flex-wrap gap-sm justify-center pt-md" },
            ["LOG COOKS", "EARN STAMPS", "SIZZLE FEED", "CUT MAP"].map((t) =>
              h("span", { class: "font-label-caps text-label-caps border-2 border-outline-variant text-on-surface-variant px-3 py-2 rounded" }, t)
            )
          )
        ),
        // CTAs
        h("div", { class: "flex flex-col gap-sm max-w-md w-full mx-auto pb-md" },
          h("button", {
            class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[20px] py-4 rounded uppercase tracking-wider",
            onclick: () => { resetDraft(); window.Router.navigate("/onboarding/intro"); }
          }, "Light The Fire"),
          h("button", {
            class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[18px] py-3 rounded uppercase tracking-wider",
            onclick: () => window.Router.navigate("/signin")
          }, "I Have An Account"),
          h("p", { class: "font-technical-data text-technical-data text-outline text-center mt-sm" }, "Free to join. Your passport, cooks and stamps follow your handle.")
        )
      )
    );
    root.appendChild(main);
  }

  // ----- /onboarding/intro — explain what ONLYMEATS is and how it works -----
  function renderIntro() {
    const pillars = [
      {
        icon: "outdoor_grill",
        kicker: "Pillar 01",
        title: "Log Every Cook",
        body: "Punch in your cut, wood and target temp. We run the timer, plot pit and internal trends, flag the stall, walk you through wrap → rest → pull."
      },
      {
        icon: "workspace_premium",
        kicker: "Pillar 02",
        title: "Earn Passport Stamps",
        body: "Every cut you nail unlocks a stamp on your Meat Passport. Hit milestones — first cook, 10 cooks, century pound — and climb from Ember to Iron Legend."
      },
      {
        icon: "local_fire_department",
        kicker: "Pillar 03",
        title: "Sizzle The Feed",
        body: "Share your cooks with other pitmasters. Sizzle (like), comment, follow. Browse the Cut Map for target temps and rest times on 20+ cuts across beef, pork, poultry & lamb."
      },
      {
        icon: "shield",
        kicker: "Pillar 04",
        title: "Built For Outside",
        body: "Heavy dark UI to cut glare at the pit. Big tap targets for gloves. Works on phone, tablet or desktop — sign in with your handle and password to pick up where you left off."
      }
    ];

    const body = h("div", { class: "flex flex-col gap-md flex-grow" },
      h("div", { class: "pt-md" },
        h("h1", { class: "font-headline-lg-mobile text-headline-lg-mobile text-primary uppercase tracking-tight" }, "How it works"),
        h("p", { class: "font-body-md text-body-md text-on-surface-variant mt-sm" },
          "ONLYMEATS is a check-in app for cooks who live by the smoke. Here's the deal."
        )
      ),
      h("div", { class: "flex flex-col gap-sm" },
        ...pillars.map((p, idx) => h("div", {
          class: "border-2 border-outline-variant bg-surface-container p-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex gap-md items-start"
        },
          h("div", { class: "w-12 h-12 bg-surface-container-lowest border-2 border-primary flex items-center justify-center shrink-0 rounded" },
            icon(p.icon, { class: "text-primary text-[28px]", fill: true })
          ),
          h("div", { class: "flex flex-col gap-1 min-w-0" },
            h("span", { class: "font-label-caps text-label-caps text-outline" }, p.kicker.toUpperCase()),
            h("h2", { class: "font-headline-md text-headline-md text-on-surface uppercase tracking-tight" }, p.title),
            h("p", { class: "font-body-md text-body-md text-on-surface-variant" }, p.body)
          )
        ))
      ),
      h("div", { class: "border-2 border-dashed border-outline-variant p-sm flex items-center gap-sm" },
        icon("shield", { class: "text-outline shrink-0", fill: true }),
        h("p", { class: "font-technical-data text-technical-data text-on-surface-variant" },
          "Your account is keyed to your handle and a password you set. Everything you log, cook and earn lives under that account."
        )
      ),
      h("div", { class: "flex-grow" }),
      h("div", { class: "grid grid-cols-2 gap-sm" },
        h("button", {
          class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[18px] py-3 rounded",
          onclick: () => window.Router.navigate("/welcome")
        }, "Back"),
        h("button", {
          class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[18px] py-3 rounded",
          onclick: () => window.Router.navigate("/onboarding/handle")
        }, "Got It, Forge Me")
      )
    );

    shell(0, 9, body);
  }

  // ----- /signin -----
  function renderSignin() {
    const root = document.getElementById("app-root");
    root.innerHTML = "";

    const handleInput = h("input", { type: "text", class: "gauge-input", placeholder: "your_handle", autocapitalize: "none", autocomplete: "username", spellcheck: "false" });
    const passwordInput = h("input", { type: "password", class: "gauge-input", placeholder: "••••••••", autocomplete: "current-password" });
    const errorBox = h("div", { class: "hidden border-2 border-error bg-error-container/30 text-on-error-container p-sm font-technical-data text-technical-data" });

    function showError(msg) {
      errorBox.textContent = msg;
      errorBox.classList.remove("hidden");
    }
    function clearError() { errorBox.classList.add("hidden"); errorBox.textContent = ""; }

    const signInBtn = h("button", {
      class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[18px] py-3 rounded mt-md w-full",
      type: "submit"
    }, "Sign In");

    async function submit() {
      clearError();
      const handle = (handleInput.value || "").trim().replace(/^@/, "");
      const pw = passwordInput.value || "";
      if (!handle) return showError("Enter your handle.");
      if (!pw) return showError("Enter your password.");
      await window.UI.withButtonLoading(signInBtn, "Verifying", async () => {
        try {
          await window.Store.signIn(handle, pw);
          toast("Signed in as @" + handle, "success");
          window.Router.navigate("/feed");
        } catch (e) {
          showError(e.message || "Sign in failed.");
        }
      });
    }
    signInBtn.addEventListener("click", (e) => { e.preventDefault(); submit(); });
    passwordInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } });

    const formEl = h("form", { class: "flex flex-col gap-md", onsubmit: (e) => { e.preventDefault(); submit(); } },
      h("label", { class: "flex flex-col gap-2" },
        h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "HANDLE"),
        handleInput
      ),
      h("label", { class: "flex flex-col gap-2" },
        h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "PASSWORD"),
        passwordInput
      ),
      errorBox,
      signInBtn
    );

    const main = h("main", { class: "min-h-[100dvh] flex flex-col px-margin-mobile pt-safe pb-md w-full items-center" },
      h("div", { class: "w-full max-w-md flex flex-col gap-md flex-grow pt-md view-enter" },
        h("div", { class: "flex justify-between items-center" },
          h("a", { href: "#/welcome", class: "text-primary p-2", "aria-label": "Back" }, icon("arrow_back")),
          h("span", { class: "brand-brick font-headline-md text-headline-md" }, "ONLYMEATS"),
          h("span", { class: "w-10" })
        ),
        h("div", { class: "pt-lg flex flex-col gap-md" },
          h("h1", { class: "font-headline-lg-mobile text-headline-lg-mobile text-primary uppercase tracking-tight" }, "Sign In"),
          h("p", { class: "font-body-md text-body-md text-on-surface-variant" }, "Back to the pit. Enter your handle and password to resume."),
          formEl,
          h("p", { class: "font-body-md text-body-md text-on-surface-variant pt-md text-center" },
            "New to ONLYMEATS? ",
            h("a", { href: "#/onboarding/intro", class: "text-primary underline" }, "Create your account.")
          )
        )
      )
    );
    root.appendChild(main);
  }

  // ----- /onboarding/handle -----
  function renderHandle() {
    const handleInput = h("input", { type: "text", class: "gauge-input", placeholder: "txsmoker_88", autocapitalize: "none", autocomplete: "username", value: draft.handle });
    const nameInput = h("input", { type: "text", class: "gauge-input", placeholder: "What folks call you", value: draft.displayName });
    const emailInput = h("input", { type: "email", class: "gauge-input", placeholder: "you@example.com (optional)", autocapitalize: "none", value: draft.email });

    function submit() {
      const handle = (handleInput.value || "").trim().replace(/^@/, "");
      if (!handle || !/^[a-z0-9_]{2,24}$/i.test(handle)) {
        return toast("Handle: 2–24 chars, letters/numbers/_", "danger");
      }
      if (window.Store.findAccount(handle)) {
        return toast("That handle is already taken on this device.", "danger");
      }
      draft.handle = handle;
      draft.displayName = (nameInput.value || "").trim() || handle;
      draft.email = (emailInput.value || "").trim();
      window.Router.navigate("/onboarding/password");
    }

    const body = h("div", { class: "flex flex-col gap-md flex-grow" },
      h("div", { class: "pt-md" },
        h("h1", { class: "font-headline-lg-mobile text-headline-lg-mobile text-primary uppercase tracking-tight" }, "Stamp your name"),
        h("p", { class: "font-body-md text-body-md text-on-surface-variant mt-sm" }, "Every pitmaster needs a brand. Pick a handle — this is how the feed will see you.")
      ),
      h("label", { class: "flex flex-col gap-2 mt-md" },
        h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "HANDLE"),
        handleInput,
        h("span", { class: "font-technical-data text-[12px] text-outline" }, "Lowercase, numbers, underscores")
      ),
      h("label", { class: "flex flex-col gap-2" },
        h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "DISPLAY NAME"),
        nameInput
      ),
      h("label", { class: "flex flex-col gap-2" },
        h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "EMAIL (OPTIONAL)"),
        emailInput
      ),
      h("div", { class: "flex-grow" }),
      h("button", {
        class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[20px] py-4 rounded uppercase tracking-wider",
        onclick: submit
      }, "Continue")
    );

    shell(1, 9, body);
  }

  // ----- /onboarding/password -----
  function renderPassword() {
    const pwInput = h("input", {
      type: "password", class: "gauge-input", placeholder: "At least 6 characters",
      autocomplete: "new-password", value: draft.password
    });
    const pwConfirm = h("input", {
      type: "password", class: "gauge-input", placeholder: "Type it again",
      autocomplete: "new-password", value: draft.password
    });
    const errorBox = h("div", { class: "hidden border-2 border-error bg-error-container/30 text-on-error-container p-sm font-technical-data text-technical-data" });

    function strengthScore(pw) {
      let score = 0;
      if (pw.length >= 6) score++;
      if (pw.length >= 10) score++;
      if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
      if (/\d/.test(pw)) score++;
      if (/[^A-Za-z0-9]/.test(pw)) score++;
      return Math.min(score, 4);
    }
    const strengthBar = h("div", { class: "flex gap-1 w-full mt-1" },
      ...Array.from({ length: 4 }, () => h("div", { class: "h-1 flex-1 bg-surface-variant" }))
    );
    const strengthLabel = h("span", { class: "font-technical-data text-[12px] text-outline" }, "Pick a password");
    function paintStrength() {
      const s = strengthScore(pwInput.value || "");
      const labels = ["Weak", "Okay", "Good", "Strong", "Iron-clad"];
      const colors = ["bg-error", "bg-error", "bg-primary", "bg-primary", "bg-primary"];
      Array.from(strengthBar.children).forEach((bar, i) => {
        bar.className = "h-1 flex-1 " + (i < s ? colors[s] : "bg-surface-variant");
      });
      strengthLabel.textContent = "Strength: " + labels[s];
    }
    pwInput.addEventListener("input", paintStrength);
    paintStrength();

    function submit() {
      errorBox.classList.add("hidden");
      const pw = pwInput.value || "";
      const confirm = pwConfirm.value || "";
      if (pw.length < 6) {
        errorBox.textContent = "Password must be at least 6 characters.";
        errorBox.classList.remove("hidden");
        return;
      }
      if (pw !== confirm) {
        errorBox.textContent = "Passwords don't match.";
        errorBox.classList.remove("hidden");
        return;
      }
      draft.password = pw;
      window.Router.navigate("/onboarding/avatar");
    }

    const body = h("div", { class: "flex flex-col gap-md flex-grow" },
      h("div", { class: "pt-md" },
        h("h1", { class: "font-headline-lg-mobile text-headline-lg-mobile text-primary uppercase tracking-tight" }, "Set a password"),
        h("p", { class: "font-body-md text-body-md text-on-surface-variant mt-sm" },
          "You'll use this with @" + (draft.handle || "your_handle") + " to sign back in."
        )
      ),
      h("label", { class: "flex flex-col gap-2 mt-md" },
        h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "PASSWORD"),
        pwInput,
        strengthBar,
        strengthLabel
      ),
      h("label", { class: "flex flex-col gap-2" },
        h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "CONFIRM PASSWORD"),
        pwConfirm
      ),
      errorBox,
      h("div", { class: "flex-grow" }),
      h("div", { class: "grid grid-cols-2 gap-sm" },
        h("button", {
          class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[18px] py-3 rounded",
          onclick: () => window.Router.navigate("/onboarding/handle")
        }, "Back"),
        h("button", {
          class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[18px] py-3 rounded",
          onclick: submit
        }, "Continue")
      )
    );

    shell(2, 9, body);
  }

  // ----- /onboarding/avatar -----
  function renderAvatar() {
    const fileInput = h("input", { type: "file", accept: "image/*", class: "hidden" });
    let preview = draft.avatar;

    const previewEl = h("div", {
      class: "w-40 h-40 border-4 border-outline-variant overflow-hidden mx-auto shadow-[inset_0px_0px_10px_rgba(0,0,0,0.8)] " + (preview ? "" : "avatar-fallback"),
      style: preview ? `background:url(${preview}) center/cover;` : ""
    }, !preview ? ((draft.handle || "??").slice(0, 2).toUpperCase()) : "");

    function setPreview(url) {
      preview = url;
      draft.avatar = url;
      if (url) {
        previewEl.style.background = `url(${url}) center/cover`;
        previewEl.classList.remove("avatar-fallback");
        previewEl.textContent = "";
      } else {
        previewEl.style.background = "";
        previewEl.classList.add("avatar-fallback");
        previewEl.textContent = (draft.handle || "??").slice(0, 2).toUpperCase();
      }
    }

    fileInput.addEventListener("change", () => {
      const f = fileInput.files && fileInput.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => setPreview(r.result);
      r.readAsDataURL(f);
    });

    const presetUrls = [
      "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=400&q=80&auto=format&fit=crop&crop=faces",
      "https://images.unsplash.com/photo-1614281392021-9d33d2bb7a09?w=400&q=80&auto=format&fit=crop&crop=faces",
      "https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?w=400&q=80&auto=format&fit=crop&crop=faces",
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=80&auto=format&fit=crop&crop=faces"
    ];

    const body = h("div", { class: "flex flex-col gap-md flex-grow" },
      h("div", { class: "pt-md" },
        h("h1", { class: "font-headline-lg-mobile text-headline-lg-mobile text-primary uppercase tracking-tight" }, "Mug shot"),
        h("p", { class: "font-body-md text-body-md text-on-surface-variant mt-sm" }, "Upload a photo or pick a stock face. You can change this later.")
      ),
      h("div", { class: "py-md" }, previewEl),
      h("div", { class: "grid grid-cols-2 gap-sm" },
        h("button", {
          class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[18px] py-3 rounded flex items-center justify-center gap-2",
          onclick: () => fileInput.click()
        }, icon("upload"), "Upload"),
        h("button", {
          class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[18px] py-3 rounded flex items-center justify-center gap-2",
          onclick: () => setPreview("")
        }, icon("delete"), "Clear")
      ),
      h("div", { class: "flex flex-col gap-2 pt-sm" },
        h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "OR PICK A PRESET"),
        h("div", { class: "grid grid-cols-4 gap-sm" },
          ...presetUrls.map((u) => h("button", {
            class: "aspect-square border-2 border-outline-variant overflow-hidden active:scale-95 transition-transform",
            style: `background:url(${u}) center/cover;`,
            onclick: () => setPreview(u),
            "aria-label": "Use preset"
          }))
        )
      ),
      fileInput,
      h("div", { class: "flex-grow" }),
      h("div", { class: "grid grid-cols-2 gap-sm" },
        h("button", {
          class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[18px] py-3 rounded",
          onclick: () => window.Router.navigate("/onboarding/password")
        }, "Back"),
        h("button", {
          class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[18px] py-3 rounded",
          onclick: () => window.Router.navigate("/onboarding/species")
        }, "Continue")
      )
    );

    shell(3, 9, body);
  }

  // ----- Multi-select helper -----
  function multiToggle(target, value) {
    const i = target.indexOf(value);
    if (i >= 0) target.splice(i, 1);
    else target.push(value);
  }

  // ----- /onboarding/species -----
  function renderSpecies() {
    const refreshGrid = () => grid.replaceChildren(...buildOptions());

    function buildOptions() {
      return D.SPECIES.map((s) => {
        const on = draft.species.includes(s.id);
        return h("button", {
          class: "border-2 p-md flex flex-col items-center gap-2 transition-colors " +
            (on
              ? "bg-primary-container border-primary text-on-primary-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              : "bg-surface-container border-outline-variant text-on-surface hover:bg-surface-container-high"),
          onclick: () => { multiToggle(draft.species, s.id); refreshGrid(); }
        },
          icon(s.icon, { class: "text-[40px]", fill: on }),
          h("span", { class: "font-headline-md text-headline-md uppercase tracking-tight" }, s.name)
        );
      });
    }

    const grid = h("div", { class: "grid grid-cols-2 gap-sm" });
    grid.replaceChildren(...buildOptions());

    const body = h("div", { class: "flex flex-col gap-md flex-grow" },
      h("div", { class: "pt-md" },
        h("h1", { class: "font-headline-lg-mobile text-headline-lg-mobile text-primary uppercase tracking-tight" }, "What do you cook?"),
        h("p", { class: "font-body-md text-body-md text-on-surface-variant mt-sm" }, "Pick all the species you smoke. We'll tailor your feed and stamps.")
      ),
      grid,
      h("div", { class: "flex-grow" }),
      h("div", { class: "grid grid-cols-2 gap-sm" },
        h("button", {
          class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[18px] py-3 rounded",
          onclick: () => window.Router.navigate("/onboarding/avatar")
        }, "Back"),
        h("button", {
          class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[18px] py-3 rounded",
          onclick: () => {
            if (!draft.species.length) return toast("Pick at least one species", "danger");
            window.Router.navigate("/onboarding/hardware");
          }
        }, "Continue")
      )
    );

    shell(4, 9, body);
  }

  // ----- /onboarding/hardware -----
  function renderHardware() {
    const refreshGrid = () => grid.replaceChildren(...buildOptions());

    function buildOptions() {
      return D.HARDWARE.map((hw) => {
        const on = draft.hardware.includes(hw.id);
        return h("button", {
          class: "border-2 p-sm flex items-center gap-md text-left transition-colors " +
            (on
              ? "bg-primary-container border-primary text-on-primary-container shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              : "bg-surface-container border-outline-variant text-on-surface hover:bg-surface-container-high"),
          onclick: () => { multiToggle(draft.hardware, hw.id); refreshGrid(); }
        },
          h("div", { class: "w-12 h-12 bg-surface border border-outline flex items-center justify-center shrink-0" }, icon(hw.icon, { class: "text-[28px]" })),
          h("div", { class: "flex flex-col min-w-0" },
            h("span", { class: "font-technical-data text-technical-data uppercase" }, hw.name),
            h("span", { class: "font-body-md text-body-md text-on-surface-variant truncate" }, hw.example)
          )
        );
      });
    }

    const grid = h("div", { class: "flex flex-col gap-sm" });
    grid.replaceChildren(...buildOptions());

    const body = h("div", { class: "flex flex-col gap-md flex-grow" },
      h("div", { class: "pt-md" },
        h("h1", { class: "font-headline-lg-mobile text-headline-lg-mobile text-primary uppercase tracking-tight" }, "Your rig"),
        h("p", { class: "font-body-md text-body-md text-on-surface-variant mt-sm" }, "Tell us what you cook on. Pick all that you run.")
      ),
      grid,
      h("div", { class: "flex-grow" }),
      h("div", { class: "grid grid-cols-2 gap-sm" },
        h("button", {
          class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[18px] py-3 rounded",
          onclick: () => window.Router.navigate("/onboarding/species")
        }, "Back"),
        h("button", {
          class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[18px] py-3 rounded",
          onclick: () => {
            if (!draft.hardware.length) return toast("Pick at least one rig", "danger");
            window.Router.navigate("/onboarding/wood");
          }
        }, "Continue")
      )
    );

    shell(5, 9, body);
  }

  // ----- /onboarding/wood -----
  function renderWood() {
    const refreshGrid = () => grid.replaceChildren(...buildOptions());

    function buildOptions() {
      return D.WOODS.map((w) => {
        const on = draft.woods.includes(w);
        return h("button", {
          class: "border-2 px-sm py-2 flex items-center gap-2 transition-colors riveted-tag rounded " +
            (on
              ? "bg-primary-container border-primary text-on-primary-container"
              : "bg-surface-container border-outline-variant text-on-surface"),
          onclick: () => { multiToggle(draft.woods, w); refreshGrid(); }
        },
          h("span", { class: "font-label-caps text-label-caps uppercase tracking-widest" }, w)
        );
      });
    }

    const grid = h("div", { class: "flex flex-wrap gap-sm" });
    grid.replaceChildren(...buildOptions());

    const body = h("div", { class: "flex flex-col gap-md flex-grow" },
      h("div", { class: "pt-md" },
        h("h1", { class: "font-headline-lg-mobile text-headline-lg-mobile text-primary uppercase tracking-tight" }, "Wood preference"),
        h("p", { class: "font-body-md text-body-md text-on-surface-variant mt-sm" }, "Pick the woods you cook with. (Tap to toggle.)")
      ),
      grid,
      h("div", { class: "flex-grow" }),
      h("div", { class: "grid grid-cols-2 gap-sm" },
        h("button", {
          class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[18px] py-3 rounded",
          onclick: () => window.Router.navigate("/onboarding/hardware")
        }, "Back"),
        h("button", {
          class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[18px] py-3 rounded",
          onclick: () => {
            if (!draft.woods.length) return toast("Pick at least one wood", "danger");
            window.Router.navigate("/onboarding/spice");
          }
        }, "Continue")
      )
    );

    shell(6, 9, body);
  }

  // ----- /onboarding/spice -----
  function renderSpice() {
    const customInput = h("input", { type: "text", class: "gauge-input flex-grow", placeholder: "Add a custom rub..." });

    function buildOptions() {
      const arr = D.SPICES.slice();
      // Include any custom that user added
      draft.spices.forEach((s) => { if (!arr.includes(s)) arr.push(s); });
      return arr.map((sp) => {
        const on = draft.spices.includes(sp);
        return h("button", {
          class: "flex items-center gap-2 border-2 px-sm py-2 transition-colors " +
            (on
              ? "bg-primary-container border-primary text-on-primary-container shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              : "bg-surface border-outline-variant text-on-surface"),
          onclick: () => { multiToggle(draft.spices, sp); refreshGrid(); }
        },
          h("span", { class: "w-1.5 h-1.5 rounded-full bg-outline" }),
          h("span", { class: "font-technical-data text-technical-data uppercase" }, sp),
          h("span", { class: "w-1.5 h-1.5 rounded-full bg-outline" })
        );
      });
    }

    const grid = h("div", { class: "flex flex-wrap gap-sm" });
    function refreshGrid() { grid.replaceChildren(...buildOptions()); }
    refreshGrid();

    const body = h("div", { class: "flex flex-col gap-md flex-grow" },
      h("div", { class: "pt-md" },
        h("h1", { class: "font-headline-lg-mobile text-headline-lg-mobile text-primary uppercase tracking-tight" }, "Spice cabinet"),
        h("p", { class: "font-body-md text-body-md text-on-surface-variant mt-sm" }, "Pick rubs you use, or add your own.")
      ),
      h("div", { class: "flex gap-sm" },
        customInput,
        h("button", {
          class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[16px] px-md rounded",
          onclick: () => {
            const v = (customInput.value || "").trim();
            if (!v) return;
            if (!draft.spices.includes(v)) draft.spices.push(v);
            customInput.value = "";
            refreshGrid();
          }
        }, "Add")
      ),
      grid,
      h("div", { class: "flex-grow" }),
      h("div", { class: "grid grid-cols-2 gap-sm" },
        h("button", {
          class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[18px] py-3 rounded",
          onclick: () => window.Router.navigate("/onboarding/wood")
        }, "Back"),
        h("button", {
          class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[18px] py-3 rounded",
          onclick: () => window.Router.navigate("/onboarding/bio")
        }, "Continue")
      )
    );

    shell(7, 9, body);
  }

  // ----- /onboarding/bio -----
  function renderBio() {
    const bioInput = h("textarea", { class: "gauge-input", placeholder: "Low and slow believer. Post Oak only. Likes brisket.", maxlength: 200 }, draft.bio || "");
    bioInput.value = draft.bio || "";

    const forgeBtn = h("button", {
      class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[18px] py-3 rounded"
    }, "Forge Account");
    forgeBtn.addEventListener("click", () => {
      draft.bio = (bioInput.value || "").trim();
      if (!draft.password || draft.password.length < 6) {
        toast("Set a password first.", "danger");
        return window.Router.navigate("/onboarding/password");
      }
      window.UI.withButtonLoading(forgeBtn, "Forging", async () => {
        await new Promise((r) => setTimeout(r, 700));
        await window.Store.createUser(draft);
        window.Router.navigate("/onboarding/done");
      });
    });

    const body = h("div", { class: "flex flex-col gap-md flex-grow" },
      h("div", { class: "pt-md" },
        h("h1", { class: "font-headline-lg-mobile text-headline-lg-mobile text-primary uppercase tracking-tight" }, "Your pit, in one line"),
        h("p", { class: "font-body-md text-body-md text-on-surface-variant mt-sm" }, "A short bio shown on your profile. Optional.")
      ),
      h("label", { class: "flex flex-col gap-2" },
        h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "BIO"),
        bioInput,
        h("span", { class: "font-technical-data text-[12px] text-outline" }, "Max 200 characters")
      ),
      h("div", { class: "border-2 border-outline-variant bg-surface-container-lowest p-md flex flex-col gap-sm" },
        h("span", { class: "font-label-caps text-label-caps text-on-surface-variant" }, "PROFILE PREVIEW"),
        h("div", { class: "flex items-center gap-md" },
          avatar({ avatar: draft.avatar, handle: draft.handle, displayName: draft.displayName }, { size: 56 }),
          h("div", { class: "min-w-0" },
            h("h3", { class: "font-headline-md text-headline-md text-on-surface truncate" }, draft.displayName || draft.handle),
            h("p", { class: "font-technical-data text-technical-data text-primary uppercase" }, "@" + draft.handle)
          )
        )
      ),
      h("div", { class: "flex-grow" }),
      h("div", { class: "grid grid-cols-2 gap-sm" },
        h("button", {
          class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[18px] py-3 rounded",
          onclick: () => window.Router.navigate("/onboarding/spice")
        }, "Back"),
        forgeBtn
      )
    );

    shell(8, 9, body);
  }

  // ----- /onboarding/done -----
  function renderDone() {
    const user = window.Store.getState().user;
    if (!user) return window.Router.navigate("/welcome", { replace: true });

    const root = document.getElementById("app-root");
    root.innerHTML = "";

    const main = h("main", { class: "min-h-[100dvh] flex flex-col items-center justify-center px-margin-mobile pt-safe pb-md text-center" },
      h("div", { class: "max-w-md flex flex-col gap-md items-center view-enter" },
        h("div", {
          class: "w-32 h-32 rounded-full border-4 border-primary text-primary flex flex-col items-center justify-center rotate-[-12deg] relative"
        },
          icon("workspace_premium", { class: "text-[48px]", fill: true }),
          h("span", { class: "font-headline-md text-[14px] uppercase tracking-widest font-bold" }, "ENROLLED"),
          h("div", { class: "absolute inset-0 rounded-full border-2 border-primary border-dashed opacity-50 scale-[1.06]" })
        ),
        h("h1", { class: "font-headline-lg-mobile text-headline-lg-mobile text-primary uppercase tracking-tight" }, "Welcome, " + (user.displayName || user.handle)),
        h("p", { class: "font-body-lg text-body-lg text-on-surface-variant" }, "Your pit is forged. Time to start cooking. We'll show you around."),
        h("div", { class: "grid grid-cols-1 gap-sm w-full pt-md" },
          h("button", {
            class: "brutal-btn bg-primary-container border-2 border-primary text-on-primary-container font-headline-md text-[20px] py-4 rounded uppercase tracking-wider",
            onclick: () => { window.Store.setOnboardingComplete(); window.Router.navigate("/cook/new?tour=1"); }
          }, "Start First Cook"),
          h("button", {
            class: "brutal-btn bg-surface border-2 border-outline text-on-surface font-headline-md text-[18px] py-3 rounded uppercase tracking-wider",
            onclick: () => { window.Store.setOnboardingComplete(); window.Router.navigate("/feed"); }
          }, "Browse The Feed")
        )
      )
    );
    root.appendChild(main);
  }

  // ----- Routes -----
  window.Router.register("/welcome", renderWelcome);
  window.Router.register("/welcome/restart", () => { window.Store.reset(); resetDraft(); window.Router.navigate("/welcome", { replace: true }); });
  window.Router.register("/signin", renderSignin);
  window.Router.register("/onboarding/intro", renderIntro);
  window.Router.register("/onboarding/handle", renderHandle);
  window.Router.register("/onboarding/password", renderPassword);
  window.Router.register("/onboarding/avatar", renderAvatar);
  window.Router.register("/onboarding/species", renderSpecies);
  window.Router.register("/onboarding/hardware", renderHardware);
  window.Router.register("/onboarding/wood", renderWood);
  window.Router.register("/onboarding/spice", renderSpice);
  window.Router.register("/onboarding/bio", renderBio);
  window.Router.register("/onboarding/done", renderDone);
})();
