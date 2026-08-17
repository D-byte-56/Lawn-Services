"""Build a local tabler-icons subset (only glyphs the site uses) + CSS rules."""
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

ICONS = """arrow-right brand-facebook brand-google brand-whatsapp building-bank calendar-stats cash check
chevron-down chevron-left chevron-right clipboard-check clock clock-check clock-hour-7 credit-card
currency-dollar-off device-mobile-dollar droplet fence file-text list-details mail map-2 map-pin
map-pin-check menu-2 mood-check phone photo plant-2 point-filled receipt-off send shield-check
shield-lock sparkles stack-2 tools tree wall
alert-triangle leaf ruler-2 seeding bug home stairs snowflake settings trees shovel truck
adjustments-alt circle-check timeline-event-text
messages x
message backhoe bulldozer flame plant ripple mountain trowel""".split()

css = (ROOT / "tools/fontsrc/tabler-icons.min.css").read_text(encoding="utf-8")
cp = {}
for name in ICONS:
    m = re.search(r'\.ti-' + re.escape(name) + r':before\{content:"\\([0-9a-f]+)"\}', css)
    if not m:
        print("SIN CODEPOINT:", name)
        continue
    cp[name] = m.group(1)
print(f"codepoints: {len(cp)}/{len(ICONS)}")

unicodes = ",".join(f"U+{c}" for c in cp.values())
subprocess.run(
    ["python", "-m", "fontTools.subset", str(ROOT / "tools/fontsrc/tabler-icons.woff2"),
     f"--unicodes={unicodes}", "--flavor=woff2",
     # icon font renders via codepoint (content:"\xxxx"); layout tables aren't needed
     # and this font's GSUB is malformed, so drop them before glyph closure
     "--drop-tables+=GSUB,GPOS,GDEF", "--no-layout-closure",
     f"--output-file={ROOT / 'assets/fonts/tabler-icons.woff2'}"],
    check=True)
size = (ROOT / "assets/fonts/tabler-icons.woff2").stat().st_size
print(f"subset: {size/1024:.1f}KB (original 844KB)")

rules = "\n".join('.ti-%s:before{content:"\\%s"}' % (n, c) for n, c in sorted(cp.items()))
block = f'''
/* TABLER ICONS — subset local con solo los {len(cp)} glifos que usa el sitio */
@font-face{{
  font-family:"tabler-icons";
  font-style:normal;font-weight:400;font-display:block;
  src:url("fonts/tabler-icons.woff2") format("woff2");
}}
.ti{{
  font-family:"tabler-icons"!important;speak:none;font-style:normal;font-weight:normal;
  font-variant:normal;text-transform:none;line-height:1;display:inline-block;
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
}}
{rules}
'''
sty = ROOT / "assets/styles.css"
s = sty.read_text(encoding="utf-8")
s = s.replace("""/* Iconos Tabler inline (svg hereda tamaño de font-size y color de color) */
i.ti{display:inline-flex;line-height:1;font-style:normal}
i.ti svg{width:1em;height:1em;flex-shrink:0}
""", "")
marker = "/* TABLER ICONS"
if marker in s:
    s = s[:s.index(marker)].rstrip() + "\n"
sty.write_text(s + block, encoding="utf-8")
print("styles.css actualizado")
