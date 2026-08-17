/* Carga diferida de fotos en cuadrícula + lightbox compartido.
   - <img class="lazyimg" data-sm="..." data-md="..."> se carga SOLO al acercarse
     al viewport, con la variante -sm en móvil (<=768px) y -md en escritorio.
   - Los enlaces <a class="lbx" href="foto-1600.webp" data-caption="..."> abren el
     visor a pantalla completa con la versión de 1600px; flechas para navegar,
     Escape o clic afuera para cerrar. Degrada sin JS (el enlace abre la foto). */
(function () {
  var KEY = matchMedia('(max-width: 768px)').matches ? 'sm' : 'md';

  // ---- Carga diferida estricta ----
  var lazy = [].slice.call(document.querySelectorAll('img.lazyimg'));
  if (lazy.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          e.target.src = pick(e.target);
        });
      }, { rootMargin: '250px 0px' });
      lazy.forEach(function (img) { img.src && img.removeAttribute('src'); io.observe(img); });
    } else {
      lazy.forEach(function (img) { img.src = pick(img); });
    }
  }
  // Los tiles pequeños de la galería (.thumb) usan siempre la variante -sm:
  // a ~270px de render (incluso a 2x) 700px sobra, y evita descargar -md de balde.
  function pick(img) {
    if (img.classList.contains('thumb')) return img.getAttribute('data-sm') || img.getAttribute('data-md');
    return img.getAttribute('data-' + KEY) || img.getAttribute('data-md');
  }

  // ---- Lightbox ----
  var items = [].slice.call(document.querySelectorAll('.lbx'));
  if (!items.length) return;

  var ov = document.createElement('div');
  ov.className = 'lightbox';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.setAttribute('aria-label', 'Photo viewer');
  ov.innerHTML =
    '<button class="lb-close" type="button" aria-label="Close viewer">&times;</button>' +
    '<button class="lb-nav lb-prev" type="button" aria-label="Previous photo">&#10094;</button>' +
    '<figure class="lb-fig"><img class="lb-img" alt=""><figcaption class="lb-cap"></figcaption></figure>' +
    '<button class="lb-nav lb-next" type="button" aria-label="Next photo">&#10095;</button>';
  document.body.appendChild(ov);

  var lbImg = ov.querySelector('.lb-img'),
      lbCap = ov.querySelector('.lb-cap'),
      btnClose = ov.querySelector('.lb-close'),
      btnPrev = ov.querySelector('.lb-prev'),
      btnNext = ov.querySelector('.lb-next');
  var idx = -1, lastFocus = null;

  var single = items.length < 2;
  if (single) { btnPrev.style.display = 'none'; btnNext.style.display = 'none'; }

  function show(i) {
    idx = (i + items.length) % items.length;
    var el = items[idx];
    var full = el.getAttribute('href') || el.getAttribute('data-full');
    var inner = el.querySelector('img');
    lbImg.src = full;
    lbImg.alt = el.getAttribute('data-alt') || (inner && inner.alt) || '';
    var cap = el.getAttribute('data-caption') || '';
    lbCap.textContent = cap;
    lbCap.style.display = cap ? 'block' : 'none';
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    ov.classList.add('on');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }
  function close() {
    ov.classList.remove('on');
    document.body.style.overflow = '';
    lbImg.removeAttribute('src');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  items.forEach(function (el, i) {
    el.addEventListener('click', function (e) { e.preventDefault(); open(i); });
  });
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', function () { show(idx - 1); });
  btnNext.addEventListener('click', function () { show(idx + 1); });
  ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
  document.addEventListener('keydown', function (e) {
    if (!ov.classList.contains('on')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft' && !single) show(idx - 1);
    else if (e.key === 'ArrowRight' && !single) show(idx + 1);
  });
})();
