# Guía de puesta en marcha en SiteGround — EV Lawncare GA Inc

Guía paso a paso, en español sencillo, para el día que subas el sitio a producción en
SiteGround y conectes el dominio real. Seguila en orden. Al final hay una **lista de
verificación marcable** con todo.

> **Estado actual (vista previa):** el sitio está publicado gratis en GitHub Pages en
> `https://d-byte-56.github.io/Lawn-Services/`. Ahí el cliente lo puede ver y navegar. Esa
> vista previa es real y funciona; lo único que **no** corre en GitHub es el formulario por PHP
> (`contact.php`), porque GitHub no ejecuta PHP.
>
> **El dominio final todavía no está decidido.** Por eso, mientras tanto, todas las direcciones
> internas del SEO (canónicos, Open Graph, sitemap, datos estructurados) usan la dirección real
> de GitHub Pages. **No hay ningún dominio inventado en el código.** El día que tengas el
> dominio, se cambia en **un solo lugar** (ver Paso 2) y se propaga a todo el sitio.

---

## Paso 1 · Qué subir y qué NO subir

**SÍ subir** a la carpeta `public_html` de SiteGround (son los archivos del sitio):

- Las 5 páginas de la raíz: `index.html`, `services.html`, `about.html`, `gallery.html`,
  `contact.html`
- La carpeta **`services/`** completa (las 7 páginas de servicios)
- La carpeta **`assets/`** completa (CSS, JavaScript, imágenes, fuentes, favicons)
- **`contact.php`** ← esta vez SÍ (SiteGround ejecuta PHP; GitHub no lo hacía)
- **`.htaccess`** (seguridad, HTTPS, compresión y caché)
- **`sitemap.xml`** y **`robots.txt`**

**NO subir** (no son parte del sitio publicado; son material interno o pesado):

- Los archivos de documentación `*.md`: `GUIA-SITEGROUND.md`, `AUDITORIA.md`, `DESPLIEGUE.md`,
  `IMAGENES-TEMPORALES.md`, `COMO-CONECTAR-RESENAS.md`
- La carpeta **`tools/`** (scripts de trabajo: optimizador de imágenes, `set-domain`, etc.)
- La carpeta **`.git/`** (control de versiones) — no subir nunca
- Los `.zip` (`IRRIGATION EV.zip`, `Land Clearing comprimido.zip`, etc.)
- Las carpetas de **fotos originales**: `Fotos Maquinaria`, `IRRIGATION EV`,
  `Land Clearing comprimido`, `Servicios de Ev lawn`, `Videos Ev lawn` (son los originales
  pesados; en el sitio ya están las versiones optimizadas dentro de `assets/`)
- El logo fuente `Logo.jpeg` y el CV `.docx` (documentos personales)

> Regla simple: subí `*.html`, `services/`, `assets/`, `contact.php`, `.htaccess`,
> `sitemap.xml` y `robots.txt`. Nada más.

---

## Paso 2 · Poner el dominio (en UN solo lugar)

El dominio **no** está escrito a mano en cada página. Se pone **una sola vez** y un script lo
copia a todos los archivos (canónicos, Open Graph, Twitter, datos estructurados JSON-LD,
`sitemap.xml` y `robots.txt`).

1. Abrí el archivo **`tools/set-domain.ps1`** (o `tools/set-domain.sh` si usás Git Bash/Mac).
2. Cambiá esta línea, poniendo tu dominio real **sin `https://` y sin barra final**:
   ```
   $SITE_DOMAIN = "TU-DOMINIO-AQUI"
   ```
   por ejemplo:
   ```
   $SITE_DOMAIN = "evlawncaregainc.com"
   ```
3. Guardá y, desde la carpeta del proyecto, ejecutá en PowerShell:
   ```powershell
   ./tools/set-domain.ps1
   ```
   (o en Git Bash / Mac: `bash tools/set-domain.sh`)
4. El script reemplaza la dirección de la vista previa por tu dominio en **todos** los archivos y
   te muestra cuántas direcciones cambió. Revisá con `git diff` que todo se vea bien.
5. Volvé a subir a `public_html` los archivos modificados (o subí todo de nuevo).

> El correo **`info@evlawncaregainc.net` NO cambia**: es el correo real de contacto y el script
> no lo toca, aunque el dominio del sitio web sea otro.
>
> Si te equivocaste de dominio, corregí la misma línea y volvé a ejecutar el script: siempre
> parte de la vista previa, así que es seguro repetirlo.

---

## Paso 3 · Apuntar el dominio a SiteGround y activar HTTPS

1. En **SiteGround → Site Tools**, agregá tu dominio si no está (o usá el principal de la cuenta).
2. Donde compraste el dominio (GoDaddy, Namecheap, etc.), cambiá los **nameservers** por los que
   te indica SiteGround (SiteGround los muestra en su guía "Point your domain"). Este cambio
   puede tardar de minutos hasta 24–48 horas en propagarse.
3. Cuando el dominio ya apunte a SiteGround, activá el **certificado SSL (HTTPS)**:
   **Security → SSL Manager → Let's Encrypt → Install**. Es gratis.
4. El archivo `.htaccess` ya **fuerza HTTPS** automáticamente: una vez instalado el SSL, todas
   las visitas por `http://` se redirigen a `https://` solas.

> Consejo: activá el SSL **antes** de compartir el dominio públicamente, para que nadie entre por
> una conexión sin candado.

---

## Paso 4 · Conectar el formulario (de Formspree a contact.php)

En la vista previa de GitHub el formulario podía usar **Formspree** (porque no hay PHP). En
SiteGround usamos **`contact.php`**, que no tiene tope mensual y valida en el servidor.

1. Abrí `contact.html` y buscá, cerca del final, esta línea (está marcada con un comentario):
   ```js
   const FORMSPREE_ENDPOINT = '';
   ```
   Dejala **vacía** (`''`). Así el formulario usa `contact.php` automáticamente (ya está puesto
   `action="contact.php"`).
2. Confirmá que **`contact.php` esté subido** a `public_html`.
3. En `contact.php`, arriba del todo, revisá estas dos líneas:
   ```php
   $DEST = 'info@evlawncaregainc.net';        // a dónde llegan los mensajes
   $FROM = 'no-reply@evlawncaregainc.net';    // remitente técnico
   ```
   El remitente `no-reply@...` **debe existir** como cuenta o alias en el dominio. Crealo en
   **SiteGround → Email → Accounts** para que los correos no caigan en spam.
4. Entrá al sitio y **enviá un formulario de prueba**. Confirmá que el mensaje llega a
   `info@evlawncaregainc.net`.

> Si querés que el formulario también funcione en la vista previa de GitHub (antes de SiteGround),
> creá un formulario en https://formspree.io apuntando a `info@evlawncaregainc.net` y pegá el
> endpoint (`https://formspree.io/f/xxxx`) entre las comillas de `FORMSPREE_ENDPOINT`. En
> SiteGround dejalo vacío otra vez.

---

## Paso 5 · Reemplazar las imágenes TEMP de irrigation

La página **`services/irrigation-systems.html`** muestra 4 imágenes de **stock sin licencia**
(archivos `assets/img/irrigation/TEMP-*`), como marcador temporal hasta que haya fotos reales.
**No pueden quedar en producción** (riesgo de derechos de autor y no son trabajos reales de EV).

Cuando tengas las fotos reales de irrigation:

1. Procesalas con `tools/optimize_images.py` (variantes: full 1600px, `-md` 1100px, `-sm` 700px).
2. Guardalas en `assets/img/irrigation/` **sin** el prefijo `TEMP-` (ej. `irrigation-01.webp`).
3. En `services/irrigation-systems.html`: cambiá las rutas a los archivos nuevos y **borrá** el
   comentario de advertencia `⚠️ IMÁGENES TEMPORALES` y las notas "reference image".
4. Borrá los archivos `TEMP-*` de `assets/img/irrigation/`.
5. Detalle completo en **`IMAGENES-TEMPORALES.md`**.

> En la vista previa de GitHub, estas 4 imágenes se dejan a propósito para que el cliente vea el
> diseño de la página. El reemplazo es obligatorio **antes** de dar el sitio por lanzado.

---

## Paso 6 · Subir sitemap.xml y robots.txt

Ambos ya se generan con tu dominio al correr el script del Paso 2. Solo asegurate de que estén en
`public_html` (en la raíz, no dentro de una subcarpeta):

- `https://TU-DOMINIO/sitemap.xml` debe abrir y mostrar la lista de páginas.
- `https://TU-DOMINIO/robots.txt` debe abrir y, al final, tener la línea
  `Sitemap: https://TU-DOMINIO/sitemap.xml`.

---

## Paso 7 · Registrar el sitio en Google Search Console y enviar el sitemap

1. Entrá a https://search.google.com/search-console con la cuenta de Google del negocio.
2. **Agregar propiedad** → escribí tu dominio. Google te pide **verificar** que es tuyo; la forma
   más fácil suele ser el método **"Proveedor de nombres de dominio (DNS)"**: Google te da un
   registro TXT que pegás en el DNS del dominio (SiteGround → Domain → DNS Zone Editor).
3. Una vez verificado: menú **Sitemaps** → escribí `sitemap.xml` → **Enviar**.
4. En **Inspección de URLs**, probá tu página principal y pedí **"Solicitar indexación"** para que
   Google la visite antes.

> Recomendado también: crear/reclamar el **Perfil de Empresa de Google** (Google Business Profile)
> del negocio, con la misma dirección y teléfono que el sitio. Ayuda mucho al SEO local.

---

## Paso 8 · Verificación final (con el sitio ya en vivo por HTTPS)

Revisá cada punto en el sitio de producción:

- **HTTPS:** todas las páginas cargan con candado (`https://`) y `http://` redirige solo.
- **Canónicos:** en el código fuente de 2–3 páginas, el `<link rel="canonical">` apunta a tu
  dominio real (no a github.io ni a `TU-DOMINIO-AQUI`).
- **Datos estructurados:** pegá 2–3 URLs en
  https://search.google.com/test/rich-results y confirmá que detecta LocalBusiness, Service,
  FAQ y Breadcrumb **sin errores**.
- **Open Graph:** pegá la portada en https://www.opengraph.xyz (o compartila en WhatsApp) y
  confirmá que se ve la imagen y el título correctos.
- **Formulario de punta a punta:** enviá una prueba real y confirmá que llega a
  `info@evlawncaregainc.net`.
- **Enlaces:** navegá el menú, el pie de página y "More services" en un par de páginas; que no
  haya enlaces rotos ni imágenes que falten.
- **Móvil:** abrí el sitio en un teléfono; que no haya scroll horizontal y que el mapa cargue.
- **Imágenes TEMP:** que ya **no** quede ningún `TEMP-*` en irrigation.
- **Velocidad (opcional):** pasá la home por https://pagespeed.web.dev y revisá que esté en verde.

---

## ✅ Lista de verificación marcable

Copiá esto y andá tildando a medida que avanzás:

- [ ] Subí solo los archivos del sitio (`*.html`, `services/`, `assets/`, `contact.php`,
      `.htaccess`, `sitemap.xml`, `robots.txt`) a `public_html`
- [ ] NO subí: `*.md`, `tools/`, `.git/`, `.zip`, carpetas de fotos originales, `Logo.jpeg`, `.docx`
- [ ] Puse el dominio real en `tools/set-domain.ps1` (`$SITE_DOMAIN`) y ejecuté el script
- [ ] Revisé con `git diff` que las URLs cambiaron a mi dominio y volví a subir los archivos
- [ ] Apunté los nameservers del dominio a SiteGround
- [ ] Instalé el certificado SSL (Let's Encrypt) y el sitio carga por HTTPS
- [ ] `contact.php` está subido y `FORMSPREE_ENDPOINT` quedó vacío (`''`)
- [ ] Creé el correo `no-reply@` y confirmé `$DEST`/`$FROM` en `contact.php`
- [ ] Envié un formulario de prueba y llegó a `info@evlawncaregainc.net`
- [ ] Reemplacé las 4 imágenes `TEMP-*` de irrigation por fotos reales y borré los `TEMP-*`
- [ ] `sitemap.xml` y `robots.txt` abren en el navegador con mi dominio
- [ ] Verifiqué el sitio en Google Search Console y envié el `sitemap.xml`
- [ ] Rich Results Test: LocalBusiness / Service / FAQ / Breadcrumb sin errores
- [ ] Open Graph se ve bien al compartir
- [ ] Canónicos apuntan a mi dominio (no github.io, no `TU-DOMINIO-AQUI`)
- [ ] Probé en móvil: sin scroll horizontal, mapa carga, enlaces OK

---

*Para el detalle de las cabeceras de seguridad del `.htaccess` y por qué "no se puede ocultar el
código", ver `DESPLIEGUE.md`. Para conectar reseñas de Google/Facebook, ver
`COMO-CONECTAR-RESENAS.md`.*
