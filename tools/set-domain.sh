#!/usr/bin/env bash
# ============================================================================
#   FUENTE ÚNICA DEL DOMINIO DEL SITIO  (EV Lawncare GA Inc)  — versión bash
# ============================================================================
#   Igual que set-domain.ps1 pero para Git Bash / Linux / macOS.
#
#   USO EL DÍA DEL LANZAMIENTO:
#     1. Cambiá abajo   SITE_DOMAIN="TU-DOMINIO-AQUI"   por tu dominio real,
#        sin https:// y sin barra final, por ejemplo  SITE_DOMAIN="midominio.com"
#     2. Ejecutá:   bash tools/set-domain.sh
#     3. Revisá con  git diff  y subí los cambios.
#
#   Reejecutable: siempre parte de la base de preview de GitHub Pages.
#   No toca el correo info@evlawncaregainc.net (es el correo real).
# ============================================================================

# >>> PONÉ TU DOMINIO ACÁ (una sola vez) <<<
SITE_DOMAIN="TU-DOMINIO-AQUI"

# Base de la vista previa en GitHub Pages (no cambiar).
PREVIEW_BASE="https://d-byte-56.github.io/Lawn-Services"

# ---------------------------------------------------------------------------
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [ "$SITE_DOMAIN" = "TU-DOMINIO-AQUI" ] || [ -z "$SITE_DOMAIN" ]; then
  echo "No hiciste ningún cambio: SITE_DOMAIN sigue en 'TU-DOMINIO-AQUI'."
  echo "Editá la línea SITE_DOMAIN de este archivo con tu dominio real y volvé a ejecutarlo."
  exit 0
fi

# Normalizar: sin protocolo, sin barra final.
clean="${SITE_DOMAIN#http://}"; clean="${clean#https://}"; clean="${clean%/}"
NEW_BASE="https://${clean}"

# Lista de archivos publicables.
mapfile -t FILES < <(
  find "$ROOT" -maxdepth 1 -name '*.html'
  find "$ROOT/services" -maxdepth 1 -name '*.html'
  echo "$ROOT/sitemap.xml"
  echo "$ROOT/robots.txt"
)

total_files=0
total_hits=0
for f in "${FILES[@]}"; do
  [ -f "$f" ] || continue
  hits=$(grep -o -F "$PREVIEW_BASE" "$f" | wc -l | tr -d ' ')
  if [ "$hits" -gt 0 ]; then
    # Reemplazo literal seguro con perl. Pasamos los valores por variables de
    # entorno y usamos comillas simples para que bash NO expanda la URL dentro
    # del s///  (las barras de https:// rompían el delimitador si se expandía).
    PREVIEW_BASE="$PREVIEW_BASE" NEW_BASE="$NEW_BASE" \
      perl -pi -e 's/\Q$ENV{PREVIEW_BASE}\E/$ENV{NEW_BASE}/g' "$f"
    total_files=$((total_files+1))
    total_hits=$((total_hits+hits))
    printf '%3d  %s\n' "$hits" "$(basename "$f")"
  fi
done

echo ""
echo "Dominio aplicado: $NEW_BASE"
echo "URLs reemplazadas: $total_hits en $total_files archivos."
echo ""
echo "Ahora revisá 'git diff', subí los cambios y actualizá el dominio en Google Search Console."
