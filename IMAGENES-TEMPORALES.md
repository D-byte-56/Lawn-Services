# ⚠️ IMÁGENES TEMPORALES — NO PUBLICAR EN PRODUCCIÓN

Este archivo lista imágenes que están en el sitio **solo como marcador temporal**.
Son **stock sin licencia** y **NO pueden quedar en el sitio publicado**.

## Qué son y de dónde vienen

En la página de **Irrigation Systems** (`services/irrigation-systems.html`) hay 4 imágenes
de bancos de stock (foto de apertura, dos bloques `feat-photo` y la imagen final de galería),
porque todavía no hay fotos reales de trabajos de irrigation de EV Lawncare. Vinieron dentro
de `IRRIGATION EV.zip` y son claramente material de stock / bancos de imágenes:

| Archivo temporal en el sitio | Origen (stock) | Qué muestra |
|---|---|---|
| `TEMP-irrigation-01` | foto stock "agricultural irrigation" | riego agrícola de cultivos (ni siquiera césped residencial) |
| `TEMP-irrigation-02` | Pixabay ("danielsfotowelt / football-pitch") | aspersores en una cancha de fútbol |
| `TEMP-irrigation-03` | iStock (`istockphoto-1190366720`) | aspersor emergente junto a un seto |
| `TEMP-irrigation-04` | Vecteezy (`vecteezy_automatic-lawn-sprinkler`) | primer plano de aspersor automático |

> Una 5.ª imagen del zip (`vecteezy_grass-irrigation-illustration`) era un **render/ilustración 3D**
> y se **descartó**: no se subió al sitio.

## Por qué NO pueden publicarse

- Son imágenes de **stock sin licencia adquirida** (iStock y Vecteezy incluso traen fuentes
  con marca de agua). Publicarlas es un **riesgo legal / de derechos de autor**.
- **No son trabajos reales de EV Lawncare** — usarlas como si lo fueran es engañoso para el cliente.

## Deben reemplazarse por fotos reales ANTES de migrar a SiteGround

Cuando Eduardo entregue fotos reales de instalaciones/reparaciones de irrigation:

1. Procesarlas con `tools/optimize_images.py` (mismas variantes: full 1600px, `-md` 1100px, `-sm` 700px).
2. Guardarlas en `assets/img/irrigation/` **sin** el prefijo `TEMP-` (p. ej. `irrigation-01.webp`).
3. Actualizar `services/irrigation-systems.html`: cambiar las rutas del carrusel y **borrar** el
   bloque de comentario de advertencia `⚠️ IMÁGENES TEMPORALES` y la nota "Reference images…".
4. Borrar los archivos `TEMP-*` de `assets/img/irrigation/`.
5. Borrar (o vaciar) este archivo `IMAGENES-TEMPORALES.md`.

## Lista exacta de rutas a sustituir

Archivos en `assets/img/irrigation/` (todos con prefijo `TEMP-`):

```
assets/img/irrigation/TEMP-irrigation-01.webp        (full 1600px, lightbox)
assets/img/irrigation/TEMP-irrigation-01-md.webp     (escritorio)
assets/img/irrigation/TEMP-irrigation-01-sm.webp     (móvil)
assets/img/irrigation/TEMP-irrigation-02.webp
assets/img/irrigation/TEMP-irrigation-02-md.webp
assets/img/irrigation/TEMP-irrigation-02-sm.webp
assets/img/irrigation/TEMP-irrigation-03.webp
assets/img/irrigation/TEMP-irrigation-03-md.webp
assets/img/irrigation/TEMP-irrigation-03-sm.webp
assets/img/irrigation/TEMP-irrigation-04.webp
assets/img/irrigation/TEMP-irrigation-04-md.webp
assets/img/irrigation/TEMP-irrigation-04-sm.webp
```

Referencia en HTML: `services/irrigation-systems.html` (bloque marcado con
`⚠️ IMÁGENES TEMPORALES / STOCK — NO PUBLICAR EN PRODUCCIÓN`).
