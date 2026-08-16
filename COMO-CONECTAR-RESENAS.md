# Cómo conectar las reseñas de Google al sitio

Guía sencilla, paso a paso, para mostrar en la página las reseñas **reales** de Google
del negocio y que se actualicen solas. No hace falta saber programar.

> **En una frase:** creas una cuenta gratis en un servicio (recomendado: **Featurable**),
> pegas un pedacito de código en un solo lugar del sitio, y listo — las reseñas aparecen
> solas y se refrescan cada par de días.

---

## Antes de empezar: necesitas un perfil de Google Business

Para que haya reseñas que mostrar, el negocio tiene que tener un **perfil de Google
Business** (antes “Google My Business”) con reseñas de clientes.

**¿Ya lo tienes?** Búscalo así: en Google escribe **“EV Lawncare GA Inc Cumming GA”**.
Si aparece a la derecha (o en el mapa) una ficha con el nombre, dirección, teléfono y
estrellas, ya lo tienes. 

**¿No lo tienes todavía?** Créalo — es gratis y es, además, **lo que más ayuda a que el
negocio salga en Google** cuando alguien busca “tree service Cumming GA”:

1. Entra a **https://business.google.com** e inicia sesión con el correo del negocio
   (idealmente `info@evlawncaregainc.net` cuando esté listo, o el Gmail del negocio).
2. Escribe el nombre del negocio: **EV Lawncare GA Inc**.
3. Elige la categoría (por ejemplo “Tree service” / “Landscaper”) y agrega la dirección
   **3788 Canton Hwy, Cumming, GA 30040**, el teléfono **(678) 698-4043** y el horario
   (Lun–Sáb, 7am–5pm).
4. Google pide **verificar** que el negocio es tuyo (te manda un código por tarjeta postal,
   teléfono o video). Sigue las instrucciones — puede tardar unos días.
5. Cuando esté verificado, **pide reseñas a tus clientes contentos**. Sin reseñas, el widget
   se ve vacío. Consejo: mándales por WhatsApp el enlace de “dejar reseña” (más abajo se
   explica cómo sacarlo).

---

## Paso 1 — Consigue el enlace de tu perfil de Google

Lo vas a necesitar para dos cosas: para conectar el widget y para el botón
**“Leave us a review”** del sitio.

1. Busca el negocio en Google (como arriba) o entra a **https://business.google.com**.
2. En la ficha del negocio, haz clic en **“Pedir reseñas”** / **“Get more reviews”**.
   Google te da un **enlace corto** (algo como `https://g.page/r/XXXXXXXX/review`) que abre
   directo la ventana para dejar reseña. **Copia ese enlace** — es el mejor para el botón.
3. Guarda también el enlace normal del perfil (el que sale al buscar el negocio en el mapa).

---

## Paso 2 — Crea la cuenta en el servicio de reseñas (recomendado: Featurable)

Comparé hoy las opciones gratuitas reales. Esta es la situación (agosto 2026):

| Servicio | Vistas/mes gratis | ¿Se actualiza solo? | Marca de agua | Si te pasas del límite |
|---|---|---|---|---|
| **Featurable** ⭐ *(recomendado)* | **Sin límite** (uso razonable) | **Sí, cada 48 h** | “Powered by Featurable” (chiquita) | Te avisan; no se apaga de golpe |
| SociableKIT | 2,000 | **No** — refrescas a mano | Sí (plan gratis) | El widget deja de mostrarse hasta el otro mes |
| EmbedSocial | 500 | Limitado en gratis | Sí | El widget deja de mostrarse |
| Tagembed | 500 | Cada 4 días | Sí (marca Tagembed) | Corta al llegar al tope |
| Jotform | Muy limitado (herramienta de formularios) | No pensado para esto | — | No es lo ideal |

**Por qué Featurable:** es el único gratis que **no tiene tope de vistas** y que **actualiza
las reseñas solo** (cada 48 horas). Eso significa dos cosas importantes para ti:

- Si un mes tienes mucho tráfico, **las reseñas no desaparecen** (los otros con 500–2,000
  vistas se apagan al llegar al tope, justo cuando más gente entra).
- **Nunca tienes que actualizarlas a mano.** Con SociableKIT gratis, por ejemplo, tendrías
  que entrar a refrescar cada vez que llega una reseña nueva.

El único “pero” es una etiqueta chiquita “Powered by Featurable”, que no molesta.
*(Si algún día quieres, cualquiera de los otros de la tabla funciona igual con el sitio —
ver el último apartado.)*

**Cómo crear la cuenta:**

1. Entra a **https://featurable.com** y haz clic en **“Get started”** (es gratis, sin
   tarjeta).
2. Conecta / pega el enlace de tu **perfil de Google Business** (el del Paso 1).
3. Elige un diseño de widget (te dejan varios; escoge el que combine con el sitio — colores
   claros, tipo tarjetas).
4. Cuando termines, Featurable te da un **código para insertar** (“embed code”). Es un
   bloque que se ve más o menos así:
   ```html
   <div id="featurable-XXXXXXXX" data-featurable-async></div>
   <script src="https://featurable.com/assets/js/widget.js" async></script>
   ```
   **Copia ese bloque completo** (el `<div>` y el `<script>`). Ese es el que vas a pegar.

---

## Paso 3 — Pega el código en el sitio (un solo lugar)

Todo el sitio ya está preparado para recibir el widget. Solo tienes que pegar el código
en **un** punto marcado.

1. Abre el archivo **`index.html`**.
2. Busca esta parte (está en la sección de reseñas):
   ```html
   <template id="reviews-embed">
     <!-- ↓↓↓ PEGA AQUÍ EL CÓDIGO DEL WIDGET ↓↓↓ -->

     <!-- ↑↑↑ PEGA AQUÍ EL CÓDIGO DEL WIDGET ↑↑↑ -->
   </template>
   ```
3. **Pega el código del widget entre las dos líneas de flechas**, así:
   ```html
   <template id="reviews-embed">
     <!-- ↓↓↓ PEGA AQUÍ EL CÓDIGO DEL WIDGET ↓↓↓ -->
     <div id="featurable-XXXXXXXX" data-featurable-async></div>
     <script src="https://featurable.com/assets/js/widget.js" async></script>
     <!-- ↑↑↑ PEGA AQUÍ EL CÓDIGO DEL WIDGET ↑↑↑ -->
   </template>
   ```
4. Guarda el archivo y súbelo al hosting. **Eso es todo.**

**¿Qué pasa cuando lo pegas?**
- El sitio **no carga el widget de una vez**: espera a que el visitante baje hasta la
  sección de reseñas (así la página abre rápido). Es a propósito.
- Cuando el widget muestra las reseñas, las **tres tarjetas de respaldo se ocultan solas**.
- Si el widget fallara o no cargara, **las tres tarjetas de respaldo se quedan** para que la
  sección nunca se vea vacía. No tienes que hacer nada.

---

## Paso 4 — El botón “Leave us a review”

En la misma sección hay un botón **“Leave us a review”**. Ahora mismo lleva a una búsqueda
del negocio en Google Maps (funciona apenas exista el perfil). Para que lleve **directo** a
la ventana de dejar reseña:

1. Abre `index.html` y busca `id="leave-review"`.
2. Cambia el `href="..."` por el **enlace corto de reseña** que sacaste en el Paso 1
   (el que se ve como `https://g.page/r/XXXXXXXX/review`).
3. Guarda y sube el archivo.

---

## ¿Cada cuánto se actualizan las reseñas solas?

- Con **Featurable**: automáticamente **cada 48 horas**. Cuando un cliente deja una reseña
  nueva en Google, aparece sola en el sitio en un par de días. **Tú no tocas nada.**
- (Si usaras SociableKIT gratis, tendrías que entrar y darle “sync” a mano cada vez.)

---

## Si en el futuro quieres cambiar de servicio

Es fácil y no rompe nada, porque el sitio está armado para recibir **cualquier** widget:

1. Crea la cuenta en el otro servicio (SociableKIT, EmbedSocial, Tagembed…) y copia **su**
   código para insertar.
2. En `index.html`, borra el código viejo que está dentro de `<template id="reviews-embed">`
   y **pega el nuevo en el mismo lugar** (entre las flechas).
3. Guarda y sube. El sitio se encarga del resto (carga diferida y respaldo).

Si algún día quieres quitar el widget del todo, simplemente **deja el `<template>` vacío**:
volverán a mostrarse las tres tarjetas de respaldo.

---

## Resumen rápido

1. Ten (o crea) tu **perfil de Google Business** con reseñas.
2. Crea cuenta gratis en **featurable.com** y conéctala a tu perfil.
3. Copia el código del widget y pégalo en `index.html`, entre las flechas del
   `<template id="reviews-embed">`.
4. (Opcional) Cambia el `href` del botón **“Leave us a review”** por tu enlace corto de
   reseña.
5. Sube los archivos. Las reseñas se actualizan solas cada 48 horas.

*Cualquier duda, este archivo se puede volver a leer con calma. Nada de esto se puede
“romper”: si algo no queda bien, siempre se puede dejar el `<template>` vacío y el sitio
muestra las tarjetas de respaldo.*
