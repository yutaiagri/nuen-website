/* ============================================
   NUEN Electric Vehicles - Site Scripts
   ============================================ */
(function () {
  "use strict";

  var PRODUCTS = window.NUEN_PRODUCTS || [];

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Category display mapping ---------- */
  var CAT_LABEL = {
    "Four-Wheel EV": "Four-Wheel EV",
    "Electric Tricycle": "Electric Tricycle",
    "Bus / Passenger": "Bus & Passenger",
    "Sightseeing Vehicle": "Sightseeing",
    "Motorcycle / Scooter": "Motorcycle & Scooter",
    "Sanitation Vehicle": "Sanitation",
    "Other": "Special & Others"
  };

  /* ---------- Product card factory ---------- */
  function productCard(p) {
    var cat = CAT_LABEL[p.category] || p.category || "EV";
    return (
      '<div class="prod-card">' +
        '<div class="thumb"><img loading="lazy" src="' + p.img + '" alt="' + esc(p.title) + '" onerror="this.src=\'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22480%22 height=%22360%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23eef1f6%22/><text x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 fill=%22%235b6b7f%22 text-anchor=%22middle%22>NUEN</text></svg>\'"></div>' +
        '<div class="body">' +
          '<span class="cat">' + cat + "</span>" +
          '<h3>' + esc(p.title) + "</h3>" +
          '<div class="meta">' +
            '<span class="price">' + esc(p.price || "On Request") + "</span>" +
            '<span class="moq">MOQ: ' + esc(p.moq || "1") + "</span>" +
          "</div>" +
          '<a class="link" href="' + esc(p.href) + '" target="_blank" rel="noopener">View on Alibaba &rarr;</a>' +
        "</div>" +
      "</div>"
    );
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* ---------- Home: featured products (1-2 per category) ---------- */
  var featuredGrid = document.getElementById("featuredGrid");
  if (featuredGrid && PRODUCTS.length) {
    var seen = {}, featured = [];
    PRODUCTS.forEach(function (p) {
      var c = p.category || "Other";
      if (!seen[c]) { seen[c] = 0; }
      if (seen[c] < 2 && featured.length < 8) {
        featured.push(p);
        seen[c] += 1;
      }
    });
    if (featured.length < 8) {
      PRODUCTS.forEach(function (p) {
        if (featured.length >= 8) return;
        var hit = featured.some(function (f) { return f.href === p.href; });
        if (!hit) featured.push(p);
      });
    }
    featuredGrid.innerHTML = featured.map(productCard).join("");
  }

  /* ---------- Products page: filters + grid ---------- */
  var grid = document.getElementById("productGrid");
  if (grid && PRODUCTS.length) {
    var filtersBox = document.getElementById("filters");
    var countBox = document.getElementById("prodCount");
    var cats = ["All"];
    PRODUCTS.forEach(function (p) {
      var c = CAT_LABEL[p.category] || p.category || "Other";
      if (cats.indexOf(c) === -1) cats.push(c);
    });

    filtersBox.innerHTML = cats.map(function (c, i) {
      return '<button data-cat="' + c + '" class="' + (i === 0 ? "active" : "") + '">' + c + "</button>";
    }).join("");

    function render(cat) {
      var list = cat === "All" ? PRODUCTS : PRODUCTS.filter(function (p) {
        return (CAT_LABEL[p.category] || p.category || "Other") === cat;
      });
      grid.innerHTML = list.map(productCard).join("");
      countBox.innerHTML = "Showing <b>" + list.length + "</b> of <b>" + PRODUCTS.length + "</b> models";
    }
    render("All");

    filtersBox.addEventListener("click", function (ev) {
      var btn = ev.target.closest("button");
      if (!btn) return;
      filtersBox.querySelectorAll("button").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      render(btn.getAttribute("data-cat"));
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById("quoteForm");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var name = document.getElementById("name").value.trim();
      var email = document.getElementById("email").value.trim();
      var country = document.getElementById("country").value.trim();
      var cat = document.getElementById("category").value;
      var msg = document.getElementById("message").value.trim();

      var body = "Name: " + name + "\nCompany: " + (document.getElementById("company").value.trim() || "-") +
        "\nEmail: " + email + "\nCountry: " + country +
        "\nProduct Interest: " + cat +
        "\nRequirements: " + (msg || "-");
      var mailto = "mailto:529420947@qq.com?subject=" +
        encodeURIComponent("Inquiry from Website: " + cat) +
        "&body=" + encodeURIComponent(body);
      window.location.href = mailto;

      var ok = document.getElementById("formOk");
      ok.classList.add("show");
    });
  }
})();
