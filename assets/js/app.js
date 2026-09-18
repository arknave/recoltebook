/* récolte Auto Cooking Pot — 36 Recipes — app shell */

var CATEGORY_META = {
  "potage": { name: "Potage Recipes", ja: "ポタージュレシピ", tagline: "Silky, spoonable purées", cls: "potage" },
  "soup": { name: "Soup Recipes", ja: "スープレシピ", tagline: "Hearty enough to be the main event", cls: "soup" },
  "hearty-soup": { name: "Hearty Soup Recipes", ja: "たべるスープレシピ", tagline: "Deliciously filling, with plenty to chew on", cls: "hearty" },
  "porridge": { name: "Rice Porridge Recipes", ja: "おかゆレシピ", tagline: "Warm, comforting, straight from raw rice", cls: "porridge" },
  "soy-milk": { name: "Soy Milk & Plant-Based Milk", ja: "豆乳＆植物性ミルク", tagline: "Freshly made at home, no straining needed", cls: "soymilk" },
  "smoothie": { name: "Smoothies", ja: "スムージー", tagline: "Cool, fresh, and needs no cooking at all", cls: "smoothie" }
};

var CATEGORY_ORDER = ["potage", "soup", "hearty-soup", "porridge", "soy-milk", "smoothie"];

var ICONS = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  mode: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
};

var state = { search: "", category: "all" };
var app = document.getElementById("app");

function escapeHtml(str) {
  return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function recipeMatches(r) {
  if (state.category !== "all" && r.category !== state.category) return false;
  if (!state.search) return true;
  var q = state.search.toLowerCase();
  if (r.title_en.toLowerCase().indexOf(q) !== -1) return true;
  if (r.title_ja && r.title_ja.indexOf(q) !== -1) return true;
  if (r.subtitle_en && r.subtitle_en.toLowerCase().indexOf(q) !== -1) return true;
  for (var i = 0; i < r.ingredients.length; i++) {
    if (r.ingredients[i].item.toLowerCase().indexOf(q) !== -1) return true;
  }
  return false;
}

function cardHtml(r) {
  return (
    '<a class="card" href="#/recipe/' + r.id + '" data-id="' + r.id + '">' +
      '<div class="card-img"><img src="' + r.image + '" alt="' + escapeHtml(r.title_en) + '" loading="lazy"></div>' +
      '<div class="card-body">' +
        '<div class="card-title">' + escapeHtml(r.title_en) + "</div>" +
        '<div class="card-title-ja">' + escapeHtml(r.title_ja) + "</div>" +
        '<div class="card-meta">' +
          "<span>" + ICONS.clock + escapeHtml(r.time) + "</span>" +
          "<span>" + ICONS.users + escapeHtml(r.servings) + "</span>" +
        "</div>" +
      "</div>" +
    "</a>"
  );
}

function renderChips() {
  var html = '<button class="chip' + (state.category === "all" ? " active" : "") + '" data-cat="all">All Recipes</button>';
  CATEGORY_ORDER.forEach(function (slug) {
    html += '<button class="chip' + (state.category === slug ? " active" : "") + '" data-cat="' + slug + '">' + CATEGORY_META[slug].name + "</button>";
  });
  var nav = document.getElementById("categoryNav");
  nav.innerHTML = html;
  Array.prototype.forEach.call(nav.querySelectorAll(".chip"), function (chip) {
    chip.addEventListener("click", function () {
      state.category = chip.getAttribute("data-cat");
      renderChips();
      renderHome(false);
    });
  });
}

function renderHome(scrollTop) {
  document.title = "récolte Auto Cooking Pot — 36 Recipes";
  var sections = "";
  var totalShown = 0;

  CATEGORY_ORDER.forEach(function (slug) {
    var meta = CATEGORY_META[slug];
    var items = RECIPES.filter(function (r) { return r.category === slug; }).filter(recipeMatches);
    if (state.category !== "all" && state.category !== slug) return;
    if (!items.length) return;
    totalShown += items.length;
    sections +=
      '<section class="category-section" id="cat-' + slug + '">' +
        '<div class="category-head">' +
          '<span class="category-tag" style="background:var(--c-' + meta.cls + '-bg); color:var(--c-' + meta.cls + ')">' + meta.ja + "</span>" +
          "<h2>" + meta.name + "</h2>" +
          '<div class="category-tagline">' + meta.tagline + "</div>" +
        "</div>" +
        '<div class="grid">' + items.map(cardHtml).join("") + "</div>" +
      "</section>";
  });

  if (!totalShown) {
    sections = '<div class="empty-state"><p>No recipes match your search.</p></div>';
  }

  app.innerHTML =
    '<div class="hero">' +
      '<div class="hero-banner"><img src="images/cover.jpg" alt="Auto Cooking Pot Large recipe book cover"></div>' +
      '<div class="hero-text">' +
        '<div class="eyebrow">récolte · Auto Cooking Pot Large</div>' +
        "<h1>36 Recipes, From Prep to Bowl on One Button</h1>" +
      "</div>" +
    "</div>" +
    '<div class="hero-sub">' +
      "<p>Add the ingredients, and leave the rest to it — cooking can really be this easy.</p>" +
      "<p>An English translation of the récolte Auto Cooking Pot Large recipe booklet: 36 potages, soups, porridges, plant milks and smoothies, each made by simply loading the pot and choosing a mode. <a href=\"#/about\">Read more about the book →</a></p>" +
    "</div>" +
    '<div class="wrap">' + sections + "</div>";

  if (scrollTop !== false) window.scrollTo(0, 0);
}

function detailHtml(r) {
  var meta = CATEGORY_META[r.category];
  var ingredientsHtml = r.ingredients.map(function (ing) {
    return '<li><span class="name">' + escapeHtml(ing.item) + '</span><span class="amt">' + escapeHtml(ing.amount) + "</span></li>";
  }).join("");
  var stepsHtml = r.steps.map(function (s) { return "<li>" + escapeHtml(s) + "</li>"; }).join("");

  return (
    '<div class="wrap detail">' +
      '<span class="back-link" id="backLink">' + ICONS.back + " All recipes</span>" +
      '<div class="detail-hero">' +
        '<div class="detail-img"><img src="' + r.image + '" alt="' + escapeHtml(r.title_en) + '"></div>' +
        '<div class="detail-info">' +
          '<span class="detail-tag" style="background:var(--c-' + meta.cls + '-bg); color:var(--c-' + meta.cls + ')">' + meta.ja + "</span>" +
          "<h1>" + escapeHtml(r.title_en) + "</h1>" +
          '<div class="detail-title-ja">' + escapeHtml(r.title_ja) + "</div>" +
          (r.subtitle_en ? '<div class="detail-subtitle">' + escapeHtml(r.subtitle_en) + "</div>" : "") +
          '<div class="meta-row">' +
            '<span class="meta-pill">' + ICONS.clock + escapeHtml(r.time) + "</span>" +
            '<span class="meta-pill">' + ICONS.users + escapeHtml(r.servings) + "</span>" +
            '<span class="meta-pill">' + ICONS.mode + "<b>" + escapeHtml(r.mode) + "</b></span>" +
          "</div>" +
          '<div class="page-ref">' + ICONS.book + " Book page " + r.page + "</div>" +
        "</div>" +
      "</div>" +
      '<div class="detail-grid">' +
        '<div class="ingredients"><h3>Ingredients</h3><ul>' + ingredientsHtml + "</ul></div>" +
        '<div class="steps"><h3>Method</h3><ol>' + stepsHtml + "</ol>" +
          (r.tip ? '<div class="tip-box"><b>Tip</b>' + escapeHtml(r.tip) + "</div>" : "") +
        "</div>" +
      "</div>" +
    "</div>"
  );
}

function renderDetail(id) {
  var r = RECIPES.find(function (x) { return x.id === id; });
  if (!r) { renderHome(true); return; }
  document.title = r.title_en + " — récolte Auto Cooking Pot";
  app.innerHTML = detailHtml(r);
  window.scrollTo(0, 0);
  document.getElementById("backLink").addEventListener("click", function () {
    window.location.hash = "#/";
  });
}

function renderAbout() {
  document.title = "About This Book — récolte Auto Cooking Pot";
  app.innerHTML =
    '<div class="wrap about-section">' +
      '<span class="back-link" id="backLink">' + ICONS.back + " All recipes</span>" +
      '<h1 style="margin-bottom:16px;">About This Book</h1>' +
      '<p class="lede">"Add the ingredients, and leave the rest to it. Who knew cooking could be this easy?"</p>' +
      "<p>How is it different from cooking in a pot? Because the Auto Cooking Pot Large heats while it chops the ingredients, their umami dissolves out for an exceptionally delicious finish. Heat control and prep timing are all automatic — it's easy to use, and there's a huge range of dishes to enjoy. This site is an English translation of its official Japanese recipe booklet, <em>36 Recipes</em>, built from photographs of the printed book.</p>" +

      '<div class="about-grid">' +
        '<div class="about-card"><h3>Ask the Chef: Little Habits of a Pro</h3><p>"I use it at least three times a day," says Ryoko Maeda, the food researcher who supervised this recipe book. Here are a few of the tricks she relies on.</p></div>' +
        '<div class="about-card"><h3>Prep "veggie sets" you can just drop in</h3><p>Once you\'ve cut the vegetables you plan to use, portion them into freezer bags — one serving each — and store them in the fridge. Keeping them ready to pour straight from the bag is a huge help on busy mornings: with prep taking just 30 seconds, your soup practically makes itself.</p></div>' +
        '<div class="about-card"><h3>No knife needed — use frozen vegetables</h3><p>Pre-cut frozen vegetables are an easy, reliable shortcut. Broccoli is a particular favorite: freezing barely affects its nutrition, so you can make a nutrient-packed potage with no chopping at all (add it half-thawed).</p></div>' +
        '<div class="about-card"><h3>Make a batch ahead of time</h3><p>Cook a big batch and keep it stored in the fridge for about 2–3 days. Whether reheated or enjoyed cold, it\'s ready in a moment whenever the mood strikes — like keeping a few flavors of "drinkable supplement" always on hand.</p></div>' +
      "</div>" +

      '<div class="credit"><strong>Supervised by Ryoko Maeda</strong> — food researcher and registered dietitian. After working at a nursery school and in hospitals, she went independent, later becoming a food researcher following a stint running a café. Known for simple recipes backed by cooking science and nutrition.</div>' +
      '<div class="credit">This is an unofficial, fan-made English translation created for personal reference from a physical copy of the récolte Auto Cooking Pot Large recipe booklet. All recipes and photography rights belong to récolte / their original publisher.</div>' +
    "</div>";
  window.scrollTo(0, 0);
  document.getElementById("backLink").addEventListener("click", function () {
    window.location.hash = "#/";
  });
}

function route() {
  var hash = window.location.hash || "#/";
  var m = hash.match(/^#\/recipe\/(.+)$/);
  if (m) { renderDetail(decodeURIComponent(m[1])); return; }
  if (hash === "#/about") { renderAbout(); return; }
  renderHome(true);
}

document.getElementById("searchInput").addEventListener("input", function (e) {
  state.search = e.target.value.trim();
  renderHome(false);
});

renderChips();
window.addEventListener("hashchange", route);
route();
