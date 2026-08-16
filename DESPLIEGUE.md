# Guía de despliegue — EV Lawncare GA Inc

En español sencillo. Dos etapas: **(A)** subir a GitHub Pages para que el cliente lo vea, y
**(B)** después mover el sitio al servidor de verdad (SiteGround). Al final se explica el
formulario, las cabeceras de seguridad, y por qué "no se puede ocultar el código".

---

## A) Subir a GitHub Pages (vista previa para el cliente)

GitHub Pages muestra el sitio gratis, pero **no ejecuta PHP** (o sea, `contact.php` no corre allí).
Para la vista previa eso no importa: el cliente solo necesita ver y navegar el sitio.

1. Crea una cuenta en https://github.com (si no tienes).
2. Crea un repositorio nuevo, por ejemplo `ev-lawncare`.
3. Sube **solo los archivos del sitio** (arrastrar y soltar sirve):
   - `index.html`, `services.html`, `about.html`, `contact.html`
   - la carpeta `services/`
   - la carpeta `assets/`
   - `sitemap.xml`, `robots.txt`
   - **No hace falta subir** (y mejor no subir): `contact.php`, `.htaccess`, los `*.md`,
     la carpeta `tools/`, los `.zip`, ni las carpetas de fotos originales. En GitHub no sirven.
4. En el repo: **Settings → Pages → Source: "Deploy from a branch" → rama `main`, carpeta `/root`** → Save.
5. Espera 1–2 minutos. GitHub te da una dirección tipo `https://tuusuario.github.io/ev-lawncare/`.
   Esa es la que le pasas al cliente.

**Sobre el formulario en la vista previa:** como no hay PHP, si quieres que el formulario
realmente envíe correos durante la demo, sigue la sección "Formulario" de abajo y pega un
endpoint de Formspree. Si no, el formulario se ve y valida igual, pero no manda el correo.

**Sobre Google:** las páginas tienen `canonical` apuntando al dominio final
(`evlawncaregainc.net`), así Google no confunde la copia de GitHub con el sitio real.

---

## B) Mover el sitio a SiteGround (producción)

1. Entra al **Site Tools** de SiteGround → **Site → File Manager** (o por FTP).
2. Sube **todos** los archivos del sitio a la carpeta `public_html`:
   - las 4 páginas + carpeta `services/` + carpeta `assets/`
   - `sitemap.xml`, `robots.txt`
   - **`contact.php`** (esta vez SÍ, porque SiteGround ejecuta PHP)
   - **`.htaccess`** (cabeceras de seguridad, HTTPS, caché)
   - No subas los `*.md`, `tools/`, ni los `.zip`.
3. En SiteGround, activa el **certificado SSL/HTTPS** (Security → SSL Manager → Let's Encrypt) si
   no está activo. El `.htaccess` ya fuerza HTTPS.
4. Apunta el dominio **evlawncaregainc.net** a SiteGround (esto se hace donde compraste el dominio,
   cambiando los "nameservers" a los de SiteGround). SiteGround tiene guía paso a paso.
5. Abre el sitio en el navegador y prueba: que cargue por `https://`, que el mapa aparezca, y
   **envía el formulario de prueba** para confirmar que llega el correo a info@ (ver abajo).

### Optimización opcional para producción (velocidad)
- En las 9 páginas, cambia `assets/styles.css` por `assets/styles.min.css` (versión minificada).
  Deja `styles.css` como está para seguir editando; cuando edites, vuelve a generar el `.min`.
  *(Con la compresión gzip del `.htaccess` ya activa, esto es un extra pequeño, no obligatorio.)*

---

## Formulario: de Formspree (GitHub) a contact.php (SiteGround)

El formulario está preparado para las dos etapas. La diferencia es **una sola línea**.

### En GitHub (con Formspree)
1. Crea cuenta gratis en https://formspree.io y un formulario nuevo apuntando a
   **info@evlawncaregainc.net**. Formspree te da un endpoint tipo `https://formspree.io/f/xxxxxxx`.
2. Abre `contact.html`, busca esta línea (está marcada, cerca del final):
   ```js
   const FORMSPREE_ENDPOINT = ''; /* p.ej. 'https://formspree.io/f/abcdwxyz' */
   ```
3. Pega tu endpoint entre las comillas:
   ```js
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/abcdwxyz';
   ```
4. Guarda y sube. La **primera vez** que alguien envíe, Formspree te manda un correo para
   confirmar la dirección — acéptalo. Ahí confirmas que el correo llega.
   *Nota:* el plan gratis de Formspree permite ~50 mensajes al mes.

### En SiteGround (con contact.php, sin límite mensual)
1. En `contact.html`, deja la constante **vacía** otra vez:
   ```js
   const FORMSPREE_ENDPOINT = '';
   ```
   Así el formulario usa `contact.php` automáticamente (ya está puesto en `action="contact.php"`).
2. Asegúrate de que `contact.php` esté subido a `public_html`.
3. En `contact.php` (arriba del todo) confirma estas dos líneas:
   ```php
   $DEST = 'info@evlawncaregainc.net';        // a dónde llegan los mensajes
   $FROM = 'no-reply@evlawncaregainc.net';    // remitente técnico
   ```
   El remitente `no-reply@evlawncaregainc.net` **debe existir** como cuenta/alias en el dominio
   (créalo en SiteGround → Email) para que el correo no se marque como spam.
4. Envía un formulario de prueba y confirma que llega a info@.

**Ventaja de contact.php:** no depende de Formspree ni de su tope de 50 mensajes/mes, valida y
limpia los datos también en el servidor, y tiene el mismo honeypot anti-spam.

---

## Qué hacen las cabeceras de seguridad (archivo .htaccess)

Están en `.htaccess` y solo aplican en SiteGround (GitHub las ignora). En palabras simples:

- **Content-Security-Policy (CSP):** es una "lista de invitados". El navegador solo carga cosas
  de sitios que autorizamos: las fuentes de Google, el mapa de Google, el widget de reseñas y el
  envío a Formspree. Si un atacante intentara inyectar un script de otro lado, el navegador lo
  bloquea. *(Si algún día el mapa o las reseñas dejan de verse, casi seguro hay que añadir el
  dominio de ese servicio a esta línea.)*
- **X-Content-Type-Options: nosniff:** impide que el navegador "adivine" el tipo de un archivo
  (una vía común de ataques). Trata cada archivo como lo que dice ser.
- **Referrer-Policy:** cuando alguien hace clic hacia otro sitio, solo se comparte tu dominio,
  no la dirección completa de la página. Más privacidad.
- **Strict-Transport-Security (HSTS):** le dice al navegador "este sitio siempre es HTTPS
  durante un año", así nadie puede forzar una conexión insegura. *(Actívalo cuando el HTTPS ya
  funcione bien; si lo pones antes, podrías bloquearte el acceso.)*
- **X-Frame-Options: SAMEORIGIN:** impide que otro sitio meta tu página dentro de un marco para
  engañar a la gente (clickjacking).
- **Permissions-Policy:** apaga funciones que el sitio no usa (cámara, micrófono, ubicación).

El `.htaccess` también **fuerza HTTPS**, **comprime** las páginas (gzip) para que carguen más
rápido, pone **caché** para visitas repetidas, y **bloquea** el acceso web a archivos internos
(.md, .py, .zip).

---

## "¿Se puede ocultar el código para que no lo copien?"

**No, y es normal que no se pueda.** Cuando alguien visita una página web, su navegador
(Chrome, Safari…) **necesita** recibir el HTML, el CSS y el JavaScript para poder dibujar la
página. Es como enviar una carta: para que la lean, tienen que tener el papel. El "código" de
una web pública siempre está, por diseño, del lado del visitante.

Por eso **bloquear el clic derecho o la tecla F12 es mala práctica** y no sirve:
- No protege nada: cualquiera puede ver el código igual (desde el menú del navegador, guardando
  la página, o con herramientas básicas). Solo frena a quien no iba a copiarlo de todas formas.
- **Molesta a usuarios normales** (no poder copiar un teléfono, abrir un enlace en pestaña nueva…)
  y a las personas que usan lectores de pantalla.
- **Perjudica el SEO y la accesibilidad**, y da sensación de sitio "raro".

**Lo que SÍ tiene sentido hacer (y ya está hecho):**
- **Minificar** el CSS (y se puede el JS): el código de producción va comprimido y sin espacios,
  así carga más rápido y de paso queda menos legible para el curioso casual. La versión editable
  (`styles.css`) se queda para seguir trabajando; la de producción es `styles.min.css`.
- Lo verdaderamente sensible (contraseñas, envío de correo, lógica privada) **nunca** va en el
  navegador: vive en el servidor (por eso el correo se manda desde `contact.php`, no desde el
  HTML). Eso es lo que de verdad hay que proteger, y así está.

En resumen: el diseño y los textos de una web pública son, inevitablemente, públicos. Lo que se
protege es el servidor y los datos — y eso ya está cubierto.
