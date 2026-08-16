"""Convert service photos to web-optimized WebP in three sizes.

-md.webp : long side 1100px, q72 — slider on desktop/tablet
-sm.webp : long side 700px,  q70 — slider on phones
.webp    : long side 1600px, q75 — full size, lightbox only
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "Servicios de Ev lawn"
DST = ROOT / "assets" / "img"

FOLDERS = {
    "Tree Services": "tree",
    "Stump Grinding": "stump",
    "Retaining Walls": "walls",
    "fence": "fence",
}

# Fotos que NO deben publicarse (capturas de pantalla, etc.)
EXCLUDE = {
    "fence": {"IMG-20260806-WA0031.jpg"},   # captura de un sitio web, no es trabajo real
}
# Fotos guardadas en la carpeta equivocada: se procesan bajo otro servicio (al final de la lista)
MOVED_IN = {
    "fence": [SRC / "Retaining Walls" / "IMG-20260806-WA0021.jpg"],  # es una cerca, no un muro
}
MOVED_OUT = {
    "Retaining Walls": {"IMG-20260806-WA0021.jpg"},
}

# (sufijo, lado largo, calidad)
VARIANTS = [
    ("", 1600, 75),
    ("-md", 1100, 72),
    ("-sm", 700, 70),
]

def resize_long_side(im, target):
    w, h = im.size
    long_side = max(w, h)
    if long_side <= target:
        return im.copy()
    scale = target / long_side
    return im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)

rows = []
for src_name, slug in FOLDERS.items():
    src_dir = SRC / src_name
    out_dir = DST / slug
    out_dir.mkdir(parents=True, exist_ok=True)
    for old in out_dir.glob("*.webp"):
        old.unlink()
    jpgs = sorted(p for p in src_dir.iterdir() if p.suffix.lower() in (".jpg", ".jpeg")
                  and p.name not in EXCLUDE.get(slug, set())
                  and p.name not in MOVED_OUT.get(src_name, set()))
    jpgs += MOVED_IN.get(slug, [])
    orig = 0
    sizes = {s: 0 for s, _, _ in VARIANTS}
    for i, p in enumerate(jpgs, 1):
        orig += p.stat().st_size
        im = ImageOps.exif_transpose(Image.open(p))
        if im.mode != "RGB":
            im = im.convert("RGB")
        for suffix, side, q in VARIANTS:
            out = out_dir / f"{slug}-{i:02d}{suffix}.webp"
            resize_long_side(im, side).save(out, "WEBP", quality=q, method=6)
            sizes[suffix] += out.stat().st_size
    rows.append((slug, len(jpgs), orig, sizes))

print(f"{'carpeta':8}{'fotos':>6}{'orig JPG':>11}{'full':>9}{'md':>9}{'sm':>9}{'md vs orig':>12}")
tot = {"o": 0, "": 0, "-md": 0, "-sm": 0}
for slug, n, o, s in rows:
    tot["o"] += o
    for k in ("", "-md", "-sm"):
        tot[k] += s[k]
    print(f"{slug:8}{n:>6}{o/1e6:>9.2f}MB{s['']/1e6:>7.2f}MB{s['-md']/1e6:>7.2f}MB{s['-sm']/1e6:>7.2f}MB{100*(1-s['-md']/o):>10.1f}%")
print(f"{'TOTAL':8}{sum(r[1] for r in rows):>6}{tot['o']/1e6:>9.2f}MB{tot['']/1e6:>7.2f}MB{tot['-md']/1e6:>7.2f}MB{tot['-sm']/1e6:>7.2f}MB{100*(1-tot['-md']/tot['o']):>10.1f}%")
