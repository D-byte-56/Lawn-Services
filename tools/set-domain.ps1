<#
============================================================================
  FUENTE ÚNICA DEL DOMINIO DEL SITIO  (EV Lawncare GA Inc)
============================================================================

  El dominio web NO se escribe a mano en cada archivo. Se pone UNA sola vez
  aquí abajo, en $SITE_DOMAIN, y este script lo propaga a TODOS los archivos
  publicables (canónicos, Open Graph, Twitter, JSON-LD, sitemap.xml y
  robots.txt).

  MIENTRAS NO HAYA DOMINIO, el sitio usa la base real de la vista previa en
  GitHub Pages ($PREVIEW_BASE), que es una URL viva y válida — nada apunta a
  un dominio inventado ni muerto.

  --------------------------------------------------------------------------
  CÓMO USARLO EL DÍA DEL LANZAMIENTO:
    1. Cambiá la línea de abajo:
         $SITE_DOMAIN = "TU-DOMINIO-AQUI"
       por tu dominio real, SIN https:// y SIN barra final, por ejemplo:
         $SITE_DOMAIN = "midominio.com"
    2. Desde la carpeta del proyecto, en PowerShell, ejecutá:
         ./tools/set-domain.ps1
    3. Listo: todos los archivos quedan con tu dominio. Revisá con git diff
       y subí los cambios.

  El script es reversible/reejecutable: siempre parte de la base de preview.
  Si te equivocás de dominio, corregí $SITE_DOMAIN y volvé a ejecutarlo.
  (El correo info@evlawncaregainc.net NO lo toca: es el correo real.)
============================================================================
#>

# >>> PONÉ TU DOMINIO ACÁ (una sola vez) <<<
$SITE_DOMAIN = "evlawncaregainc.net"

# Base de la vista previa en GitHub Pages (no cambiar).
$PREVIEW_BASE = "https://d-byte-56.github.io/Lawn-Services"

# ---------------------------------------------------------------------------
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot   # carpeta del proyecto (padre de tools/)

if ($SITE_DOMAIN -eq "TU-DOMINIO-AQUI" -or [string]::IsNullOrWhiteSpace($SITE_DOMAIN)) {
    Write-Host "No hiciste ningún cambio: `$SITE_DOMAIN sigue en 'TU-DOMINIO-AQUI'." -ForegroundColor Yellow
    Write-Host "Editá la línea `$SITE_DOMAIN de este archivo con tu dominio real y volvé a ejecutarlo." -ForegroundColor Yellow
    exit 0
}

# Normalizar: sin protocolo, sin barra final.
$clean = $SITE_DOMAIN -replace '^https?://','' -replace '/+$',''
$newBase = "https://$clean"

$targets = @()
$targets += Get-ChildItem -Path $root -Filter *.html -File
$targets += Get-ChildItem -Path (Join-Path $root 'services') -Filter *.html -File
$targets += Get-Item (Join-Path $root 'sitemap.xml')
$targets += Get-Item (Join-Path $root 'robots.txt')

$totalFiles = 0
$totalHits  = 0
foreach ($f in $targets) {
    $text = Get-Content -Raw -Encoding UTF8 $f.FullName
    $hits = ([regex]::Matches($text, [regex]::Escape($PREVIEW_BASE))).Count
    if ($hits -gt 0) {
        $text = $text.Replace($PREVIEW_BASE, $newBase)
        # Escribir sin BOM
        [System.IO.File]::WriteAllText($f.FullName, $text, (New-Object System.Text.UTF8Encoding($false)))
        $totalFiles++
        $totalHits += $hits
        Write-Host ("{0,3}  {1}" -f $hits, $f.Name)
    }
}

Write-Host ""
Write-Host "Dominio aplicado: $newBase" -ForegroundColor Green
Write-Host "URLs reemplazadas: $totalHits en $totalFiles archivos." -ForegroundColor Green
Write-Host ""
Write-Host "Ahora revisá 'git diff', subí los cambios, y actualizá también el" -ForegroundColor Cyan
Write-Host "dominio en Google Search Console y en el sitemap si hace falta." -ForegroundColor Cyan
