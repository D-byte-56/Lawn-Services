# Auditoría del sitio — EV Lawncare GA Inc

Fecha: **2026-08-20** (actualiza la auditoría del 2026-08-15).
Severidad: 🔴 crítico · 🟠 importante · 🟡 menor.
Estado: ✅ corregido en esta sesión · 🟢 ya estaba bien (verificado) · 📄 archivo entregado ·
⏳ pendiente de vos (Eduardo).

> **Resumen ejecutivo.** El sitio (12 páginas) está listo para producción a nivel SEO,
> accesibilidad, enlaces y rendimiento. En esta sesión: se sacó el dominio inventado del código y
> se centralizó en **un solo lugar**; se acortaron **los 12 títulos** (todos superaban 580px); se
> ajustaron los H1 para incluir la zona; y se re-verificó todo (JSON-LD, canónicos, ALT, enlaces).
> Lo único que falta es información que solo tenés vos (decidir el dominio, fotos reales de
> irrigation, endpoint de Formspree/buzón info@, perfil de Google Business, horario de sábado).

---

## 1. SEO

| Sev | Hallazgo | Estado |
|-----|----------|--------|
| 🔴 | **Dominio inventado escrito en todo el código** (`evlawncaregainc.net` en 138 lugares: canónicos, OG, Twitter, JSON-LD, sitemap, robots), pese a que el dominio final aún no está decidido. | ✅ Reemplazado por la **base real de la vista previa** `https://d-byte-56.github.io/Lawn-Services` (URL viva, nada muerto ni inventado). Centralizado en **`tools/set-domain.ps1`** (variable `SITE_DOMAIN="TU-DOMINIO-AQUI"`): el día del lanzamiento se cambia ahí una sola vez y se propaga a todos los archivos. |
| 🟠 | **Los 12 `<title>` superaban los ~580px** (de 649px la home a 944px land clearing) → Google los cortaba. | ✅ Reescritos, manteniendo **servicio + ciudad**. Ahora todos entre **529 y 578px** (medido con Arial 20px, el criterio de Google). Antes/después abajo. |
| 🟠 | **H1 sin la zona** en 11 de 12 páginas (tenían el servicio pero no la ubicación). | ✅ Ajustados para incluir Cumming & Dawsonville / North Georgia de forma natural, **un solo H1 por página** (verificado: 12/12 = exactamente 1). |
| 🟡 | `about.html`: la meta description no nombraba la ciudad objetivo (decía "Forsyth/Dawson County"). | ✅ Reescrita con "Cumming, Dawsonville, North Georgia" (también en OG/Twitter). |
| 🟢 | **Datos estructurados JSON-LD** — LocalBusiness (12/12), Service (7 servicios), FAQPage (7), BreadcrumbList (interiores). | Verificado: **parsea sin errores** en las 12 y usa la base de dominio centralizada. |
| 🟢 | **Open Graph + Twitter Card** en las 12 páginas, con imagen propia 1200×630. | Verificado presentes y con URLs coherentes. |
| 🟢 | **Canónicos coherentes y auto-referenciales** (cada página apunta a su propia ruta). | Verificado 12/12 OK. |
| 🟢 | **sitemap.xml** (12 URLs) + **robots.txt** con la base de dominio; `lastmod` al día. | Verificado. |
| 🟢 | **Descriptions únicas por página con ciudad**; **sin contenido duplicado** (cada servicio tiene intro, bloques y FAQ propios); **enlaces internos** vía nav, footer y "More services". | Verificado: 0 descriptions duplicadas. |

**Antes / después de los títulos (px con Arial 20px; objetivo < 580):**

| Página | Antes | Después |
|--------|------:|--------:|
| index | 697 | **547** |
| about | 649 | **536** |
| services | 876 | **533** |
| gallery | 663 | **573** |
| contact | 669 | **542** |
| tree-services | 928 | **530** |
| stump-grinding | 918 | **556** |
| retaining-walls | 857 | **554** |
| fence-installation | 889 | **573** |
| irrigation-systems | 890 | **537** |
| landscaping | 876 | **529** |
| land-clearing | 944 | **540** |

---

## 2. Accesibilidad

| Sev | Hallazgo | Estado |
|-----|----------|--------|
| 🟢 | **Texto alternativo (ALT) en imágenes.** 170 `<img>` en total. | Verificado: **0 imágenes sin atributo `alt`**. 117 con ALT descriptivo y **contexto local** (Cumming, Dawsonville, North Georgia). 53 con `alt=""` son **decorativas correctas**: 24 son el logo (con el texto "EV Lawncare / GA Inc" al lado) y 29 son los fondos difuminados duplicados del carrusel. Ponerles ALT sería ruido para lectores de pantalla. |
| 🟢 | **Un solo `<h1>` por página** y jerarquía de encabezados sin saltos. | Verificado 12/12. |
| 🟢 | **Contraste de color** (corregido en la auditoría previa: `--ink-soft` y `--clay` oscurecidos a ≥4.8:1), landmark `<main>`, `prefers-reduced-motion` en carruseles/video/contadores, navegación por teclado, labels y errores anunciados en el formulario. | Sin cambios; sigue vigente. Conviene una pasada final de Lighthouse en el sitio en vivo. |

---

## 3. Rendimiento y móvil

| Sev | Hallazgo | Estado |
|-----|----------|--------|
| 🟢 | Sin scroll horizontal en 375–1440px; áreas táctiles ≥44px en los controles clave; imágenes con `aspect-ratio` (CLS 0). | Verificado en auditoría previa; sin regresiones (esta sesión solo tocó texto de `<title>`/`<h1>`/meta, no layout). |
| 🟡 | **LCP no medido** (no se puede capturar bien en el entorno de automatización). | ⏳ Recomiendo pasar la home y una página de servicio por **PageSpeed Insights** una vez en vivo por HTTPS. |
| 🟡 | Optimización opcional: usar `assets/styles.min.css` en producción. | Documentado en DESPLIEGUE.md (el `.htaccess` ya comprime con gzip; es un extra menor). |

> Nota de contexto: el mayor peso del sitio sigue siendo la fuente de íconos (Tabler) y el video
> del hero; ya hay un subconjunto de íconos y variantes WebP. No es bloqueante para lanzar.

---

## 4. Enlaces rotos

| Sev | Hallazgo | Estado |
|-----|----------|--------|
| 🟢 | Enlaces y recursos locales (`href`/`src`). | Verificado esta sesión: **563 referencias locales revisadas → 0 rotas**. |
| 🟢 | Botones de "More services" (inyectados por JS desde una lista única). | Verificado: la lista tiene los 7 servicios; cada página excluye el actual y muestra los otros 6. Script incluido en las 7 páginas con el `data-current` correcto. |
| 🟡 | Enlaces externos (Facebook, Google Business). | Apuntan a búsquedas del negocio en Google Maps / a la página de Facebook hasta tener las URLs reales (ver pendientes). Llevan `rel="noopener noreferrer"`. |

---

## 5. Botones de contacto (punto pedido)

| Sev | Hallazgo | Estado |
|-----|----------|--------|
| 🟢 | **Header y hero → mensaje de texto (SMS)** con textos distintos. | Verificado: el botón del **header** usa `sms:6786984043` ("Text for a free estimate") en las 12 páginas; el **hero** de la home usa `sms:6786984043` ("Text us today"). Las demás páginas usan `.pagehead` sin botón. Los botones de WhatsApp que quedan (CTA final, dock flotante, footer, tarjetas de contacto) son **canales de contacto intencionales**, no header/hero. |
| 🟢 | **"More services": faltaban landscaping y land clearing.** | Verificado: la fuente única `assets/services-cards.js` ya incluye **los 7** servicios; cada página muestra los otros 6. |

---

## 6. Textos y contenido pendiente

| Sev | Hallazgo | Estado |
|-----|----------|--------|
| 🟠 | **Imágenes TEMP de irrigation** (4 fotos de stock sin licencia en `services/irrigation-systems.html`). | ⏳ Se dejan **a propósito** en la vista previa para mostrar el diseño; **deben reemplazarse por fotos reales antes de producción** (pasos en `IMAGENES-TEMPORALES.md` y en la guía). |
| 🟢 | Sin lorem/placeholders olvidados, sin `href="#"`, sin errores de consola del sitio. | Sin cambios respecto a la auditoría previa. |

---

## Pendientes de vos (Eduardo) — no bloquean la vista previa

1. **Decidir el dominio final.** Cuando lo tengas: ponerlo en `tools/set-domain.ps1` (una línea) y
   ejecutar el script. Paso a paso en **GUIA-SITEGROUND.md**.
2. **Endpoint de Formspree** (para que el formulario envíe en GitHub) + confirmar que el buzón
   **info@evlawncaregainc.net** funciona. *(Confirmado por vos: ese correo es el definitivo.)*
3. **Fotos reales de Irrigation** para reemplazar las 4 imágenes TEMP.
4. **Perfil de Google Business / enlace de reseña** (para el botón "Leave a review", el ícono del
   footer y el widget de reseñas).
5. **Horario de sábado**: el sitio y el JSON-LD dicen "Mon–Sat 07:00–17:00". Si no trabajan
   sábados, avisame y lo ajusto en textos y datos estructurados.

---

## Cómo se verificó (esta sesión)

- **Títulos:** medidos en píxeles con la fuente Arial 20px (criterio de Google) — los 12 < 580px.
- **JSON-LD:** cada bloque `application/ld+json` parseado con un validador JSON — 0 errores.
- **Canónicos / H1:** script que confirma 1 `<h1>` por página y que cada canónico apunta a su
  propia ruta — 12/12 OK.
- **ALT:** escaneo de las 170 `<img>` — 0 sin `alt`; clasificación de las 53 decorativas.
- **Enlaces:** resolución de las 563 referencias locales contra el sistema de archivos — 0 rotas.
- **Dominio:** grep final — 0 apariciones del dominio web salvo el correo `info@…` (correcto).
