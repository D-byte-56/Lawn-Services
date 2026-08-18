/* ============================================================================
   Fuente ÚNICA de los 7 servicios para la sección "More services".
   Cada página de servicio pone <div class="svc-cards" data-current="SLUG"></div>
   y este script inyecta las OTRAS 6 tarjetas (excluye la actual).
   Al agregar / quitar un servicio, editar SOLO este arreglo.
   ============================================================================ */
(function () {
  var SERVICES = [
    { slug: "tree-services",     icon: "ti-tree",      title: "Tree services",      link: "See tree services",     blurb: "Removal, trimming, and storm cleanup — including tight-clearance jobs near roofs and lines." },
    { slug: "stump-grinding",    icon: "ti-stack-2",   title: "Stump grinding",     link: "See stump grinding",    blurb: "Ground below grade so you can sod, plant, or pour right over it." },
    { slug: "retaining-walls",   icon: "ti-wall",      title: "Retaining walls",    link: "See retaining walls",   blurb: "Block and stone walls built with the drainage and base that keep them standing." },
    { slug: "fence-installation",icon: "ti-fence",     title: "Fence installation", link: "See fence installation",blurb: "Privacy, picket, and chain link set on a straight line with posts deep enough for Georgia clay." },
    { slug: "irrigation-systems",icon: "ti-droplet",   title: "Irrigation systems", link: "See irrigation",        blurb: "Zoned installs, repairs, controller setup, and seasonal service." },
    { slug: "landscaping",       icon: "ti-plant",     title: "Landscaping",        link: "See landscaping",       blurb: "Grading, drainage, sod, beds, and mulch — built on ground that's ready for it." },
    { slug: "land-clearing",     icon: "ti-bulldozer", title: "Land clearing",      link: "See land clearing",     blurb: "Lot clearing, brush and small-tree removal, and prep for what's going in next." }
  ];

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function cardHTML(s) {
    return '<a href="' + s.slug + '.html" class="svc-card reveal">' +
      '<div class="svc-card-icon"><i class="ti ' + s.icon + '"></i></div>' +
      '<h3>' + esc(s.title) + '</h3>' +
      '<p>' + esc(s.blurb) + '</p>' +
      '<span class="svc-card-link">' + esc(s.link) + ' <i class="ti ti-arrow-right"></i></span>' +
      '</a>';
  }

  var boxes = document.querySelectorAll(".svc-cards[data-current]");
  if (!boxes.length) return;

  // Observer propio para animar los .reveal recién inyectados (el observer
  // en línea de la página ya corrió antes de que existieran estas tarjetas).
  var io = ("IntersectionObserver" in window)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 })
    : null;

  boxes.forEach(function (box) {
    var current = box.getAttribute("data-current");
    box.innerHTML = SERVICES
      .filter(function (s) { return s.slug !== current; })
      .map(cardHTML)
      .join("");
    if (io) {
      box.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    } else {
      box.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    }
  });
})();
