# Auditoría del sitio — EV Lawncare GA Inc

Fecha: 2026-08-15 · Antes de publicar. Severidad: 🔴 crítico · 🟠 importante · 🟡 menor.
Estado: ✅ corregido · 📄 entregado (archivo nuevo) · ⏳ pendiente de Eduardo.

> **Resumen:** el sitio quedó listo para la vista previa en GitHub y preparado para SiteGround.
> Todo lo crítico y lo importante está corregido. Lo único que falta es información que solo
> tú tienes (endpoint de Formspree, link de Google Business) — está marcado y documentado.

---

## 1. Formularios y correo

| Sev | Hallazgo | Estado |
|-----|----------|--------|
| 🔴 | El correo viejo `evlawncarega@gmail.com` aparecía en 12 lugares (footers, tarjeta de contacto, botón "Email us"). | ✅ Reemplazado por **info@evlawncaregainc.net** en las 9 páginas. Verificado: 0 apariciones del Gmail. |
| 🔴 | El "formulario" de contacto **no enviaba nada**: era un enlace de WhatsApp disfrazado de botón, sin `<form>`, sin atributos `name`, sin validación. | ✅ Reconstruido como `<form>` real con `action="contact.php"` (SiteGround) y ruta Formspree (GitHub). |
| 🟠 | No había campo ZIP ni campos obligatorios. | ✅ Campos **obligatorios**: Full name, Phone, Email, **ZIP**, Service. Message opcional. |
| 🟠 | Sin validación de formato. | ✅ ZIP = exactamente 5 dígitos; Phone = formato EE.UU. (mín. 10 dígitos); Email = formato válido. **Probado en navegador:** vacíos bloqueados, ZIP de 4 dígitos o con letras rechazado, teléfono validado. |
| 🟠 | Select Service podía traer landscaping. | ✅ 5 servicios actuales + "Not sure yet", opción vacía deshabilitada por defecto, sin landscaping. |
| 🟠 | Sin protección anti-spam. | ✅ **Honeypot** (campo `company` oculto, `tabindex=-1`, fuera de pantalla) validado en navegador y en PHP. |
| 🟠 | Funcionamiento sin JavaScript. | ✅ Con JS: mensajes propios por campo + foco al primer error + envío por `fetch`. Sin JS: la validación nativa del navegador bloquea el envío igual y el `<form>` postea a `contact.php`. |
| 🟠 | Falta script de servidor para SiteGround. | 📄 **contact.php**: valida del lado del servidor (mismos criterios), escapa entradas (`strip_tags`, quita saltos de línea → evita inyección de cabeceras, `filter_var`, límites de largo), honeypot, y envía a info@. |
| 🟠 | Probar envío de correo de punta a punta. | ⏳ **Necesita el endpoint de Formspree** (constante `FORMSPREE_ENDPOINT` marcada en contact.html) y acceso al buzón info@. No tengo ninguno de los dos, así que la entrega final del correo la confirmas tú (pasos en DESPLIEGUE.md). Todo lo demás quedó probado. |

---

## 2. SEO

| Sev | Hallazgo | Estado |
|-----|----------|--------|
| 🟠 | index.html no tenía meta description. | ✅ Añadida. Las 9 páginas tienen **title + description únicos**, con la ciudad. |
| 🟡 | Jerarquía de encabezados con saltos de nivel (footer `h4`, tarjetas "what's included" `h4` tras `h2`). | ✅ Corregida (footer→`h2`, included→`h3`, un encabezado de contacto→`h2`). **Un solo `<h1>` por página** (verificado). |
| 🟠 | Sin datos estructurados. | 📄 **JSON-LD** en las 9: `LocalBusiness` (todas, con teléfono, correo, dirección, horario, áreas Cumming/Dawsonville y catálogo de 5 servicios), `Service` (5 páginas), `FAQPage` (5 páginas), `BreadcrumbList` (interiores). **Sintaxis validada** (sin errores). |
| 🟠 | Sin Open Graph / Twitter Card. | 📄 Añadidos en las 9, con **imagen propia 1200×630 por página** (generadas en `assets/img/og/`). Se verán bien al compartir en Facebook/WhatsApp. |
| 🟠 | Sin sitemap ni robots. | 📄 **sitemap.xml** (9 URLs) + **robots.txt** (apunta al sitemap). |
| 🟡 | Etiqueta canonical. | 📄 Añadida en las 9 → `https://evlawncaregainc.net/…`. En la vista previa de GitHub, esto además evita que Google indexe la copia `github.io` como contenido duplicado. |
| ✅ | URLs limpias, alt text con contexto local, enlaces internos entre páginas relacionadas, sin contenido duplicado (cada servicio tiene intro, bloques y FAQ propios). | Ya estaban bien. |

---

## 3. Accesibilidad

Medido con **axe-core** (el mismo motor que usan las herramientas de accesibilidad de Chrome / Lighthouse).

| Sev | Hallazgo | Estado |
|-----|----------|--------|
| 🟠 (serio) | **Contraste de color insuficiente**: el gris `--ink-soft` (#6F7A5E) y el terracota `--clay` (#B5602F) daban 3.2–3.75:1 en texto pequeño (mínimo AA = 4.5:1). Afectaba subtítulos, textos secundarios y "eyebrows" en todo el sitio. | ✅ Oscurecidos a `#5C6650` y `#8F4620` (mismo tono, más profundo) → ahora ≥4.8:1. Verificado: **0 fallos de contraste**. |
| 🟠 | Contenido no contenido en landmarks (faltaba `<main>`). | ✅ `<main>` añadido en las 9. Nav/encabezado/footer ya eran landmarks. |
| 🟡 | Carruseles se auto-avanzaban aun con "reducir movimiento" activado. | ✅ Los carruseles, el video del hero y los contadores respetan `prefers-reduced-motion`. |
| ✅ | Navegación por teclado (menú, desplegable móvil, acordeones `<details>`, flechas del carrusel con `aria-label` y foco visible), formulario con `label` asociados + errores anunciados (`aria-describedby`, `role="status"`), foco al primer error, alt text reales, carruseles no son la única vía a la información. | Verificado. |
| 🟡 | Área táctil de controles (ver sección 5). | ✅ Corregido. |

**Resultado axe (con todo el contenido visible y acordeones abiertos):** index, servicios y contacto → **0 violaciones** (críticas, serias y moderadas). No pude ejecutar Lighthouse completo (no está expuesto en la automatización del navegador), pero la sección de accesibilidad de Lighthouse usa axe por debajo: 0 violaciones ≈ **100/100**. Conviene confirmarlo con Lighthouse en el sitio ya publicado.

---

## 4. Seguridad

Es un sitio estático; superficie de ataque pequeña. Enfoque en lo que importa:

| Sev | Hallazgo | Estado |
|-----|----------|--------|
| 🔴 | Claves/tokens/credenciales en el código del navegador. | ✅ **Ninguna.** Revisado todo, incluidos comentarios. El único correo en el código es el público info@ (intencional, no es secreto). El endpoint de Formspree y el link de Google se pegan como texto público, no son credenciales. |
| 🟠 | Enlaces externos sin `rel="noopener noreferrer"`. | ✅ Todos los externos (Facebook, Google, direcciones del mapa, reseñas) llevan `rel="noopener noreferrer"`. Se corrigió el único que faltaba (tarjeta de Facebook en contacto). |
| 🟠 | Cabeceras de seguridad. | 📄 **.htaccess** para SiteGround: `Content-Security-Policy` (acotada a los servicios que se usan), `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security` (HSTS), `X-Frame-Options`, `Permissions-Policy`, HTTPS forzado, compresión, caché, y bloqueo de archivos internos (.md/.py/.zip). Qué hace cada una: en DESPLIEGUE.md. |
| 🟠 | Sanitización de entradas del formulario. | ✅ Navegador (`maxlength`, `pattern`, honeypot) **y** PHP (`strip_tags`, quita saltos de línea, `filter_var`, topes de largo). |
| 🟡 | HTTPS sin recursos mixtos. | ✅ Todo se pide por HTTPS; la CSP incluye `upgrade-insecure-requests`. |

**Dependencias externas y qué dato del visitante recibe cada una:**
- **Google Fonts** (fonts.googleapis / gstatic): IP + navegador del visitante al descargar las fuentes.
- **Google Maps** (iframe en Contacto, *diferido*): IP + navegador, y cookies de Google si la persona tiene sesión abierta. Solo al bajar hasta el mapa.
- **Formspree** (solo al **enviar** el formulario): recibe lo que la persona escribe (nombre, teléfono, email, ZIP, servicio, mensaje). Es su función.
- **Featurable** (widget de reseñas, si se conecta, *diferido*): IP + navegador al cargar; muestra reseñas públicas de Google.
- Ninguna recibe datos sin interacción: el mapa y las reseñas cargan diferidos, y el formulario solo envía al pulsar "Send".

Sobre **"ocultar el código"**: no es posible en la web y bloquear clic derecho/F12 es mala práctica — explicado en DESPLIEGUE.md. Lo que SÍ se hizo: **CSS minificado** (`styles.min.css`) para producción, dejando `styles.css` sin minificar para editar.

---

## 5. Rendimiento y móvil

| Sev | Hallazgo | Estado |
|-----|----------|--------|
| 🟠 | Desbordamiento horizontal / scroll lateral. | ✅ **Ninguno** en 375, 390, 414, 768 y 1440px en las 9 páginas (probado cargando cada página al ancho real). El único elemento que "sobresale" a 768 es el fondo difuminado del carrusel, recortado por `overflow:hidden` — no genera scroll. |
| 🟡 | Áreas táctiles < 44×44px. | ✅ Hamburguesa 26×31 → **44×44**; íconos sociales 40 → **44**; enlaces de footer y breadcrumbs con más alto en móvil. Quedan la marca (42px) y un breadcrumb (38px): aceptables (objetivos grandes / navegación secundaria). |
| ✅ | Textos legibles sin zoom, botón flotante y menú móvil no tapan contenido, fotos verticales del carrusel se ven completas (contain sobre fondo difuminado). | Verificado. |

**Peso (móvil, variantes `-sm`):** inicial (HTML + CSS + fuente de íconos) ≈ 50–90 KB por página — el CSS pesa 29 KB minificado y ~7 KB con la compresión gzip del `.htaccess`. Full-scroll con todas las fotos: tree 478 KB · stump 818 KB · walls 752 KB · fence 786 KB · irrigation 61 KB. Todo **bajo el presupuesto de <1 MB en móvil**; las fotos cargan progresivamente (no de golpe).

**Core Web Vitals (medido en localhost):** **CLS = 0** (cero saltos de layout — las animaciones usan opacidad/transform y las imágenes reservan su espacio con `aspect-ratio`). **FCP ≈ 0.7 s**. **LCP:** no se pudo capturar dentro del entorno de automatización; recomiendo medirlo con **PageSpeed Insights** sobre el dominio publicado. **INP:** se espera excelente (el JavaScript es mínimo y liviano).

---

## 6. Revisión final

| Ítem | Resultado |
|------|-----------|
| Enlaces (clic real + rastreo) | **65 URLs** revisadas (enlaces, CSS, imágenes y OG) en las 9 páginas → **0 rotas**. |
| Errores de consola | **0 del sitio.** Los que aparecen son de una extensión de Chrome ("message channel closed"), no del código. |
| Ortografía/gramática (EN) | Sin errores comunes, sin dobles espacios. |
| Textos de ejemplo / lorem / placeholders | Ninguno olvidado. (Los `placeholder=` de los inputs son correctos; hay un comentario interno en español en el código, no visible.) |
| `href="#"` pendientes | **0.** Antes había 9 (icono de Google Business); ahora apuntan a la búsqueda del negocio en Google Maps hasta tener el perfil real. |

---

## Pendientes de Eduardo (no bloquean la vista previa)

1. **Endpoint de Formspree** (para que el formulario envíe en GitHub) + confirmar que el buzón **info@evlawncaregainc.net** ya funciona. → DESPLIEGUE.md, sección Formulario.
2. **Link del perfil de Google Business / enlace de reseña** (`g.page/…/review`) — para el botón "Leave us a review", el ícono social del footer y el widget de reseñas.
3. **Fotos de Irrigation** — su página quedó lista para recibirlas (ver COMO-CONECTAR-RESENAS.md y el comentario en la página).
4. **Horario de sábado**: el sitio dice "Mon–Sat". Si no trabajan sábados, avísame para ajustar textos y el dato de horario en el JSON-LD.
