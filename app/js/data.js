// ONLYMEATS - Static catalog data used to seed the app and power the cut map / passport.
(function () {
  "use strict";

  const SPECIES = [
    { id: "beef", name: "Beef", icon: "local_fire_department" },
    { id: "pork", name: "Pork", icon: "set_meal" },
    { id: "poultry", name: "Poultry", icon: "egg" },
    { id: "lamb", name: "Lamb", icon: "kebab_dining" }
  ];

  // Cuts catalog — every cut has target internal, rest, suggested wood and a stamp id
  const CUTS = [
    // BEEF
    { id: "brisket", species: "beef", name: "Brisket", targetF: 203, restMin: 60, wood: "Post Oak", stamp: "brisket_king", recId: 4001 },
    { id: "ribeye", species: "beef", name: "Ribeye", targetF: 130, restMin: 8, wood: "Mesquite", stamp: "ribeye_master", recId: 4002 },
    { id: "tomahawk", species: "beef", name: "Tomahawk", targetF: 130, restMin: 10, wood: "Hickory", stamp: "tomahawk", recId: 4003 },
    { id: "shortrib", species: "beef", name: "Short Rib", targetF: 205, restMin: 30, wood: "Oak", stamp: "shortrib", recId: 4004 },
    { id: "chuck", species: "beef", name: "Chuck Roast", targetF: 200, restMin: 30, wood: "Hickory", stamp: "chuck_boss", recId: 4005 },
    { id: "tritip", species: "beef", name: "Tri-Tip", targetF: 130, restMin: 10, wood: "Red Oak", stamp: "tritip", recId: 4006 },

    // PORK
    { id: "spareribs", species: "pork", name: "Spare Ribs", targetF: 203, restMin: 15, wood: "Hickory", stamp: "rib_master", recId: 4101 },
    { id: "babyback", species: "pork", name: "Baby Back Ribs", targetF: 200, restMin: 10, wood: "Apple", stamp: "babyback", recId: 4102 },
    { id: "porkbutt", species: "pork", name: "Pork Butt", targetF: 203, restMin: 60, wood: "Hickory", stamp: "pulled_pro", recId: 4103 },
    { id: "porkloin", species: "pork", name: "Pork Loin", targetF: 145, restMin: 15, wood: "Apple", stamp: "loin_legend", recId: 4029 },
    { id: "porkbelly", species: "pork", name: "Pork Belly", targetF: 195, restMin: 20, wood: "Cherry", stamp: "belly", recId: 4104 },
    { id: "wholehog", species: "pork", name: "Whole Hog", targetF: 200, restMin: 45, wood: "Oak", stamp: "whole_hog", recId: 4105 },

    // POULTRY
    { id: "chickenwhole", species: "poultry", name: "Whole Chicken", targetF: 165, restMin: 10, wood: "Cherry", stamp: "beer_can", recId: 4201 },
    { id: "wings", species: "poultry", name: "Wings", targetF: 175, restMin: 5, wood: "Pecan", stamp: "wing_man", recId: 4202 },
    { id: "turkey", species: "poultry", name: "Whole Turkey", targetF: 165, restMin: 20, wood: "Cherry", stamp: "turkey_titan", recId: 4203 },
    { id: "thighs", species: "poultry", name: "Thighs", targetF: 175, restMin: 5, wood: "Apple", stamp: "thigh_high", recId: 4204 },
    { id: "duck", species: "poultry", name: "Duck", targetF: 165, restMin: 10, wood: "Cherry", stamp: "duck", recId: 4205 },

    // LAMB
    { id: "lambshoulder", species: "lamb", name: "Lamb Shoulder", targetF: 203, restMin: 30, wood: "Olive", stamp: "lamb_shoulder", recId: 4301 },
    { id: "lambrack", species: "lamb", name: "Rack of Lamb", targetF: 135, restMin: 10, wood: "Cherry", stamp: "lamb_rack", recId: 4302 },
    { id: "leg", species: "lamb", name: "Leg of Lamb", targetF: 140, restMin: 20, wood: "Oak", stamp: "lamb_leg", recId: 4303 }
  ];

  // Stamps catalog — achievements; each cut maps to a stamp earned on first verified cook
  const STAMPS = [
    { id: "brisket_king", category: "beef", name: "Brisket King", icon: "workspace_premium" },
    { id: "ribeye_master", category: "beef", name: "Ribeye Master", icon: "outdoor_grill" },
    { id: "tomahawk", category: "beef", name: "Tomahawk", icon: "restaurant_menu" },
    { id: "shortrib", category: "beef", name: "Short Rib", icon: "kebab_dining" },
    { id: "chuck_boss", category: "beef", name: "Chuck Boss", icon: "local_fire_department" },
    { id: "tritip", category: "beef", name: "Tri-Tip", icon: "outdoor_grill" },

    { id: "pulled_pro", category: "pork", name: "Pulled Pro", icon: "set_meal" },
    { id: "rib_master", category: "pork", name: "Rib Master", icon: "restaurant_menu" },
    { id: "babyback", category: "pork", name: "Baby Back", icon: "kebab_dining" },
    { id: "loin_legend", category: "pork", name: "Loin Legend", icon: "workspace_premium" },
    { id: "belly", category: "pork", name: "Belly Boss", icon: "local_dining" },
    { id: "whole_hog", category: "pork", name: "Whole Hog", icon: "local_fire_department" },

    { id: "wing_man", category: "poultry", name: "Wing Man", icon: "local_dining" },
    { id: "beer_can", category: "poultry", name: "Beer Can", icon: "restaurant_menu" },
    { id: "turkey_titan", category: "poultry", name: "Turkey Titan", icon: "workspace_premium" },
    { id: "thigh_high", category: "poultry", name: "Thigh High", icon: "outdoor_grill" },
    { id: "duck", category: "poultry", name: "Duck Master", icon: "kebab_dining" },

    { id: "lamb_shoulder", category: "lamb", name: "Shoulder", icon: "outdoor_grill" },
    { id: "lamb_rack", category: "lamb", name: "Rack", icon: "restaurant_menu" },
    { id: "lamb_leg", category: "lamb", name: "Leg", icon: "workspace_premium" },

    // Milestone stamps
    { id: "first_cook", category: "milestone", name: "First Cook", icon: "celebration" },
    { id: "ten_cooks", category: "milestone", name: "10 Cooks", icon: "military_tech" },
    { id: "century_lb", category: "milestone", name: "100 LBS", icon: "scale" },
    { id: "dawn_patrol", category: "milestone", name: "Dawn Patrol", icon: "wb_twilight" }
  ];

  const RANKS = [
    { id: "ember", name: "Ember", minCooks: 0 },
    { id: "kindling", name: "Kindling", minCooks: 1 },
    { id: "smokestarter", name: "Smokestarter", minCooks: 3 },
    { id: "pitmaster", name: "Pitmaster", minCooks: 10 },
    { id: "charcoal_king", name: "Charcoal King", minCooks: 25 },
    { id: "iron_legend", name: "Iron Legend", minCooks: 50 }
  ];

  const HARDWARE = [
    { id: "offset", name: "Offset Smoker", icon: "hardware", example: "Custom 250 Gallon" },
    { id: "pellet", name: "Pellet Grill", icon: "propane", example: "Traeger Pro 575" },
    { id: "kettle", name: "Kettle", icon: "outdoor_grill", example: "Weber Performer" },
    { id: "kamado", name: "Kamado", icon: "circle", example: "Big Green Egg XL" },
    { id: "drum", name: "Drum Smoker", icon: "stadia_controller", example: "PBC 18.5" },
    { id: "gravity", name: "Gravity Feed", icon: "stacked_bar_chart", example: "Masterbuilt 800" },
    { id: "santamaria", name: "Santa Maria", icon: "grid_on", example: "Open Fire Grill" },
    { id: "openpit", name: "Open Pit", icon: "local_fire_department", example: "Cinder Block Pit" }
  ];

  const WOODS = [
    "Post Oak", "Hickory", "Mesquite", "Apple", "Cherry", "Pecan", "Maple",
    "Oak", "Red Oak", "Olive", "Almond", "Peach", "Walnut"
  ];

  const SPICES = [
    "Meat Church Holy Cow", "Meat Church Holy Gospel", "Killer Hogs BBQ Rub",
    "Salt & Coarse Pepper (50/50)", "Lawry's Seasoned Salt", "Heath Riles Garlic Jalapeño",
    "Plowboys Yardbird", "Oakridge Black Ops", "SuckleBusters Texas Brisket",
    "Cattleman's Grill 8-Second", "Lane's BBQ Brancho", "Slap Yo Daddy Hot",
    "Cracked Black Pepper", "Kosher Salt", "Granulated Garlic"
  ];

  const SAMPLE_USERS = [
    {
      id: "u_txsmoker",
      handle: "TX_Smoker_88",
      displayName: "Hank Reyes",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaCe6weE-fsxYSbgsVLKDzsIWCsQFC1BSkLjyb5SPLFV484FBNJ-roFC_R4o-0i3WyHLBYXJyHGemqUaFx5glZj2nLPeq_6TfTR2tMsOLNCkD8bemcPlJUnwvEurRy5l2Ny78bfMKmrPn8IExxQsK3UVcOS_R4pI2CcXHYRgiL4Ap8pGQgVonqJo76kf6RfW_MVincvbZYX08GGFVmLoUxCCurkrCF3Cn0YGGchQ_8h-uzGCNKTDlghiZd-G5geu_AmY16Tdx0jWnk",
      rank: "Charcoal King",
      bio: "14hr brisket or bust. Post Oak only.",
      hardware: ["offset"], woods: ["Post Oak"], spices: ["Meat Church Holy Cow", "Salt & Coarse Pepper (50/50)"],
      lbsSmoked: 4250, yearsAtPit: 8, est: 2017
    },
    {
      id: "u_ribranger",
      handle: "RibRanger_01",
      displayName: "Dana Cole",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRX8WwuQ-SHZmBSEfJmAdeo2fnnzE3LPbs5qtv_tfjWEd1w5AmoEUMfUO-25fh8qWdxnM5j5JAGvC6UoGARcM6XKH1wRvjlR6MRjtXOz_IIfTWnFwNdFOxOHYN2A8wU6MRV6JydBY2WKByS4xOg0Fs3p2L1E-5vXy1iDiIeQ-PdVinW6XzgrwkC6naJzpxO7Csg7K7J89OBThxCWlbNRtkA4PPQnMs0ErEgJh3k1uTJ06dlcGoetMa7reja58LlEnXB0EQ3MPgFZsy",
      rank: "Pitmaster",
      bio: "Comp ribs, sticky glaze, no apologies.",
      hardware: ["drum", "pellet"], woods: ["Hickory", "Cherry"], spices: ["Killer Hogs BBQ Rub", "Plowboys Yardbird"],
      lbsSmoked: 1820, yearsAtPit: 4, est: 2021
    },
    {
      id: "u_pelletqueen",
      handle: "PelletQueen",
      displayName: "Sam Iwo",
      avatar: "",
      rank: "Smokestarter",
      bio: "Backyard pellet evangelist. 9-to-5 by day, smokestack by night.",
      hardware: ["pellet"], woods: ["Apple", "Pecan"], spices: ["Heath Riles Garlic Jalapeño"],
      lbsSmoked: 410, yearsAtPit: 2, est: 2023
    },
    {
      id: "u_kamado",
      handle: "Kamado_Carl",
      displayName: "Carl Mendez",
      avatar: "",
      rank: "Pitmaster",
      bio: "Egg head. Believes in lump charcoal.",
      hardware: ["kamado"], woods: ["Oak", "Cherry"], spices: ["Oakridge Black Ops"],
      lbsSmoked: 920, yearsAtPit: 5, est: 2020
    }
  ];

  const SAMPLE_POSTS = [
    {
      id: "p_001",
      userId: "u_txsmoker",
      title: "14hr Central Texas Brisket",
      cut: "brisket", species: "beef",
      grade: "PRIME", wood: "Post Oak",
      verified: true,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCI5SU9dteLt18vC1BO73vaM44PkzddFJCyqnqNzWi5388D58Hd5KJXcnH9tk1CPuQXZSrsVLam9VmibyKJ6mrwqfQeWg3YTSmZZiv7i5jB7c2xIiA0p0OXYm_K9PPtuRvCtlxkG7FqAHoSL8lP5bOFqaAP8TdbxctVsM3lxR-pTG4p_-6EMfXEyAUorSRaHNBUV5SEj3_VIJ5yf9cHXesPqAEJXLaXzC1LE2nCDCXQMKMO52AJc3XsIsLtv3zJm-x_0iqy2hjQN9J8",
      body: "Pushed through the stall at 165°F. Wrapped in tallow-soaked peach paper. Resting in the cambro until sundown.",
      sizzles: 24,
      sizzledByMe: false,
      comments: [
        { id: "c1", userId: "u_kamado", text: "That bark looks unreal.", ts: Date.now() - 3600 * 1000 * 4 }
      ],
      ts: Date.now() - 3600 * 1000 * 6
    },
    {
      id: "p_002",
      userId: "u_ribranger",
      title: "Competition St. Louis Ribs",
      cut: "spareribs", species: "pork",
      grade: "PORK SPARE", wood: "Hickory",
      verified: false,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRX8WwuQ-SHZmBSEfJmAdeo2fnnzE3LPbs5qtv_tfjWEd1w5AmoEUMfUO-25fh8qWdxnM5j5JAGvC6UoGARcM6XKH1wRvjlR6MRjtXOz_IIfTWnFwNdFOxOHYN2A8wU6MRV6JydBY2WKByS4xOg0Fs3p2L1E-5vXy1iDiIeQ-PdVinW6XzgrwkC6naJzpxO7Csg7K7J89OBThxCWlbNRtkA4PPQnMs0ErEgJh3k1uTJ06dlcGoetMa7reja58LlEnXB0EQ3MPgFZsy",
      body: "Running the 3-2-1 method but dialed back the wrap time. Glaze is setting up nice and sticky.",
      sizzles: 89,
      sizzledByMe: false,
      comments: [],
      ts: Date.now() - 3600 * 1000 * 14
    },
    {
      id: "p_003",
      userId: "u_pelletqueen",
      title: "Sunday Pork Butt",
      cut: "porkbutt", species: "pork",
      grade: "BONE-IN", wood: "Apple",
      verified: false,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80&auto=format&fit=crop",
      body: "Set it at 225 last night and went to bed. Probe slid through like butter at sunrise.",
      sizzles: 41,
      sizzledByMe: false,
      comments: [
        { id: "c2", userId: "u_txsmoker", text: "Overnight cook is the right way.", ts: Date.now() - 3600 * 1000 * 22 }
      ],
      ts: Date.now() - 3600 * 1000 * 26
    },
    {
      id: "p_004",
      userId: "u_kamado",
      title: "Lump-fired Wings",
      cut: "wings", species: "poultry",
      grade: "DRUMS+FLATS", wood: "Cherry",
      verified: true,
      image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=1200&q=80&auto=format&fit=crop",
      body: "Two zone setup on the kamado. Crisp skin, dry rub then a quick toss in a hot honey.",
      sizzles: 73,
      sizzledByMe: false,
      comments: [],
      ts: Date.now() - 3600 * 1000 * 48
    }
  ];

  // Suggested feed images for new posts when user doesn't add their own
  const FALLBACK_MEAT_IMAGES = [
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558030006-450675393462?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1612392987338-30aa3ce1f4f8?w=1200&q=80&auto=format&fit=crop"
  ];

  window.OM_DATA = {
    SPECIES, CUTS, STAMPS, RANKS, HARDWARE, WOODS, SPICES,
    SAMPLE_USERS, SAMPLE_POSTS, FALLBACK_MEAT_IMAGES
  };
})();
