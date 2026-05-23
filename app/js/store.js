// ONLYMEATS - localStorage-backed state store and domain actions.
(function () {
  "use strict";

  const KEY = "onlymeats.state.v1";

  const defaultState = () => ({
    onboarded: false,
    user: null,
    cooks: [],          // all cook records (active + completed)
    posts: [],          // user-authored + sample posts
    notifications: [],
    users: [],          // other users (seeded)
    sizzles: {},        // postId -> bool (mine)
    stamps: {},         // stampId -> { earnedAt, cookId }
    follows: [],        // userIds I follow
    lastActiveCookId: null,
    seenWelcomeTour: false
  });

  function loadState() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return Object.assign(defaultState(), parsed);
    } catch (e) {
      console.warn("[store] reset due to parse error", e);
      return defaultState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("[store] save failed", e);
    }
  }

  let state = loadState();
  const subscribers = new Set();

  function notify() {
    subscribers.forEach((fn) => {
      try { fn(state); } catch (e) { console.error(e); }
    });
  }

  function subscribe(fn) {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }

  function getState() { return state; }

  // Mutate helper — apply patch + save + notify
  function update(patch) {
    if (typeof patch === "function") {
      patch(state);
    } else {
      Object.assign(state, patch);
    }
    saveState();
    notify();
  }

  function reset() {
    state = defaultState();
    saveState();
    notify();
  }

  function uid(prefix) {
    return (prefix || "id") + "_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  }

  // ----- USER / AUTH -----

  function createUser(profile) {
    const now = Date.now();
    const user = {
      id: uid("u"),
      handle: profile.handle,
      displayName: profile.displayName || profile.handle,
      email: profile.email || "",
      avatar: profile.avatar || "",
      bio: profile.bio || "",
      rank: "Ember",
      hardware: profile.hardware || [],
      woods: profile.woods || [],
      spices: profile.spices || [],
      species: profile.species || [],
      lbsSmoked: 0,
      cooksCount: 0,
      yearsAtPit: profile.yearsAtPit || 0,
      est: new Date().getFullYear(),
      createdAt: now
    };
    update((s) => {
      s.user = user;
      s.onboarded = true;
      // Seed sample users + posts (other folks in the network) and follow a couple
      if (!s.users.length) s.users = window.OM_DATA.SAMPLE_USERS.slice();
      if (!s.posts.length) s.posts = window.OM_DATA.SAMPLE_POSTS.map((p) => ({ ...p, comments: p.comments.slice() }));
      if (!s.follows.length) s.follows = ["u_txsmoker", "u_ribranger"];
      pushNotification(s, {
        type: "system",
        title: "Welcome to the Pit",
        body: "Log your first cook to earn the First Cook stamp.",
        href: "#/cook/new"
      });
    });
  }

  function updateUser(patch) {
    update((s) => {
      s.user = Object.assign({}, s.user, patch);
    });
  }

  function setRankFromCooks(s) {
    const cooks = s.user.cooksCount;
    const ranks = window.OM_DATA.RANKS;
    let r = ranks[0];
    for (const cand of ranks) if (cooks >= cand.minCooks) r = cand;
    s.user.rank = r.name;
  }

  // ----- COOKS -----

  function startCook(input) {
    const cook = {
      id: uid("cook"),
      userId: state.user.id,
      title: input.title,
      species: input.species,
      cut: input.cut,
      wood: input.wood,
      hardware: input.hardware,
      weightLbs: Number(input.weightLbs) || 0,
      targetF: Number(input.targetF) || 200,
      pitTempF: Number(input.pitTempF) || 225,
      internalF: Number(input.internalF) || 0,
      notes: [],
      tempHistory: [],
      phase: "smoking",
      status: "active",   // active | resting | complete | aborted
      startedAt: Date.now(),
      endedAt: null,
      verified: false
    };
    update((s) => {
      s.cooks.unshift(cook);
      s.lastActiveCookId = cook.id;
    });
    return cook;
  }

  function updateCook(cookId, patch) {
    update((s) => {
      const c = s.cooks.find((x) => x.id === cookId);
      if (!c) return;
      Object.assign(c, patch);
    });
  }

  function logCookNote(cookId, text) {
    update((s) => {
      const c = s.cooks.find((x) => x.id === cookId);
      if (!c) return;
      c.notes.unshift({ id: uid("note"), text, ts: Date.now() });
    });
  }

  function logCookTemp(cookId, payload) {
    update((s) => {
      const c = s.cooks.find((x) => x.id === cookId);
      if (!c) return;
      if (payload.pitTempF != null) c.pitTempF = Number(payload.pitTempF);
      if (payload.internalF != null) c.internalF = Number(payload.internalF);
      c.tempHistory.push({
        ts: Date.now(),
        pitTempF: c.pitTempF,
        internalF: c.internalF
      });
      if (c.tempHistory.length > 200) c.tempHistory.shift();
    });
  }

  function advancePhase(cookId, phase) {
    update((s) => {
      const c = s.cooks.find((x) => x.id === cookId);
      if (!c) return;
      c.phase = phase;
    });
  }

  function completeCook(cookId, opts) {
    opts = opts || {};
    update((s) => {
      const c = s.cooks.find((x) => x.id === cookId);
      if (!c) return;
      c.status = "complete";
      c.endedAt = Date.now();
      c.verified = !!opts.verified;
      // Update user totals
      s.user.cooksCount = (s.user.cooksCount || 0) + 1;
      s.user.lbsSmoked = (s.user.lbsSmoked || 0) + (Number(c.weightLbs) || 0);
      setRankFromCooks(s);

      // Earn stamps
      const cutDef = window.OM_DATA.CUTS.find((cu) => cu.id === c.cut);
      const newStamps = [];
      if (cutDef && !s.stamps[cutDef.stamp]) {
        s.stamps[cutDef.stamp] = { earnedAt: Date.now(), cookId: c.id };
        newStamps.push(cutDef.stamp);
      }
      if (s.user.cooksCount === 1 && !s.stamps.first_cook) {
        s.stamps.first_cook = { earnedAt: Date.now(), cookId: c.id };
        newStamps.push("first_cook");
      }
      if (s.user.cooksCount >= 10 && !s.stamps.ten_cooks) {
        s.stamps.ten_cooks = { earnedAt: Date.now(), cookId: c.id };
        newStamps.push("ten_cooks");
      }
      if (s.user.lbsSmoked >= 100 && !s.stamps.century_lb) {
        s.stamps.century_lb = { earnedAt: Date.now(), cookId: c.id };
        newStamps.push("century_lb");
      }
      const h = new Date().getHours();
      if ((h < 6 || h >= 22) && !s.stamps.dawn_patrol) {
        s.stamps.dawn_patrol = { earnedAt: Date.now(), cookId: c.id };
        newStamps.push("dawn_patrol");
      }

      newStamps.forEach((sid) => {
        const def = window.OM_DATA.STAMPS.find((x) => x.id === sid);
        if (!def) return;
        pushNotification(s, {
          type: "stamp",
          title: "New Passport Stamp",
          body: def.name + " stamp earned.",
          href: "#/passport"
        });
      });

      if (s.lastActiveCookId === c.id) s.lastActiveCookId = null;

      // Auto-publish? No — user chooses to share via post compose
      c._earnedStamps = newStamps;
    });
  }

  function abortCook(cookId) {
    update((s) => {
      const c = s.cooks.find((x) => x.id === cookId);
      if (!c) return;
      c.status = "aborted";
      c.endedAt = Date.now();
      if (s.lastActiveCookId === c.id) s.lastActiveCookId = null;
    });
  }

  // ----- POSTS / SOCIAL -----

  function createPost(input) {
    const post = {
      id: uid("p"),
      userId: state.user.id,
      title: input.title,
      cut: input.cut || null,
      species: input.species || null,
      grade: input.grade || "",
      wood: input.wood || "",
      verified: !!input.verified,
      image: input.image || pickRandom(window.OM_DATA.FALLBACK_MEAT_IMAGES),
      body: input.body || "",
      sizzles: 0,
      sizzledByMe: false,
      comments: [],
      ts: Date.now(),
      cookId: input.cookId || null
    };
    update((s) => { s.posts.unshift(post); });
    return post;
  }

  function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function toggleSizzle(postId) {
    update((s) => {
      const p = s.posts.find((x) => x.id === postId);
      if (!p) return;
      if (p.sizzledByMe) {
        p.sizzledByMe = false;
        p.sizzles = Math.max(0, p.sizzles - 1);
      } else {
        p.sizzledByMe = true;
        p.sizzles = p.sizzles + 1;
        if (p.userId !== s.user.id) {
          pushNotification(s, {
            type: "social",
            title: "Sizzled",
            body: "You sizzled " + (p.title || "a cook") + ".",
            href: "#/post/" + p.id
          });
        }
      }
    });
  }

  function addComment(postId, text) {
    update((s) => {
      const p = s.posts.find((x) => x.id === postId);
      if (!p) return;
      p.comments.push({
        id: uid("c"),
        userId: s.user.id,
        text,
        ts: Date.now()
      });
    });
  }

  function deletePost(postId) {
    update((s) => {
      s.posts = s.posts.filter((p) => p.id !== postId);
    });
  }

  // ----- FOLLOWS -----

  function toggleFollow(userId) {
    update((s) => {
      if (s.follows.includes(userId)) s.follows = s.follows.filter((id) => id !== userId);
      else s.follows.push(userId);
    });
  }

  // ----- HARDWARE / SPICE INVENTORY -----

  function addHardware(item) {
    update((s) => {
      s.user.hardware = s.user.hardware || [];
      if (!s.user.hardware.includes(item)) s.user.hardware.push(item);
    });
  }
  function removeHardware(item) {
    update((s) => { s.user.hardware = (s.user.hardware || []).filter((x) => x !== item); });
  }
  function addSpice(name) {
    update((s) => {
      s.user.spices = s.user.spices || [];
      if (!s.user.spices.includes(name)) s.user.spices.push(name);
    });
  }
  function removeSpice(name) {
    update((s) => { s.user.spices = (s.user.spices || []).filter((x) => x !== name); });
  }
  function toggleWood(name) {
    update((s) => {
      s.user.woods = s.user.woods || [];
      if (s.user.woods.includes(name)) s.user.woods = s.user.woods.filter((x) => x !== name);
      else s.user.woods.push(name);
    });
  }

  // ----- NOTIFICATIONS -----

  function pushNotification(s, n) {
    s.notifications.unshift({
      id: uid("n"),
      read: false,
      ts: Date.now(),
      ...n
    });
    if (s.notifications.length > 60) s.notifications.length = 60;
  }
  function markAllRead() {
    update((s) => { s.notifications.forEach((n) => (n.read = true)); });
  }
  function unreadCount() {
    return state.notifications.filter((n) => !n.read).length;
  }

  // ----- LOOKUPS -----

  function findUser(id) {
    if (!id) return null;
    if (state.user && state.user.id === id) return state.user;
    return state.users.find((u) => u.id === id) || null;
  }
  function findPost(id) { return state.posts.find((p) => p.id === id) || null; }
  function findCook(id) { return state.cooks.find((c) => c.id === id) || null; }
  function activeCooks() { return state.cooks.filter((c) => c.status === "active"); }
  function completedCooks() { return state.cooks.filter((c) => c.status === "complete"); }
  function earnedStampIds() { return Object.keys(state.stamps); }

  function feedPosts() {
    // Simple ordering: most recent first
    return state.posts.slice().sort((a, b) => b.ts - a.ts);
  }

  function setOnboardingComplete() {
    update((s) => { s.seenWelcomeTour = true; });
  }

  window.Store = {
    getState, subscribe, update, reset, uid,
    createUser, updateUser,
    startCook, updateCook, logCookNote, logCookTemp, advancePhase, completeCook, abortCook,
    createPost, toggleSizzle, addComment, deletePost,
    toggleFollow,
    addHardware, removeHardware, addSpice, removeSpice, toggleWood,
    markAllRead, unreadCount,
    findUser, findPost, findCook, activeCooks, completedCooks, earnedStampIds, feedPosts,
    setOnboardingComplete
  };
})();
