#!/usr/bin/env python3
"""Construit APERCU.html : les vrais écrans Forge, intégrés dans un fichier autonome."""
import base64
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

def read(rel):
    return (ROOT / rel).read_text(encoding='utf-8')

def data_uri(rel):
    mime = 'image/png' if Path(rel).suffix == '.png' else 'image/svg+xml'
    return 'data:' + mime + ';base64,' + base64.b64encode((ROOT / rel).read_bytes()).decode('ascii')

images = {p.stem: data_uri(str(p.relative_to(ROOT))) for p in sorted((ROOT / 'assets/images').iterdir()) if p.suffix in {'.svg', '.png'}}
favicon = data_uri('assets/icons/favicon.svg')

def inline_css(match):
    css = read(match[1])
    css = css.replace('../assets/images/athlete-fallback.svg', images['athlete-fallback'])
    # L’ancien composant auth-visual n’est plus utilisé ; son image distante n’est pas requise.
    css = re.sub(r'https://images\.unsplash\.com/[^\s\)\"\']+', images['athlete-fallback'], css)
    return '<style>' + css + '</style>'

def inline_script(match):
    src = match[1]
    code = read(src)
    if src == 'js/core/layout.js':
        code = code.replace('src="assets/images/${name}.svg"', 'src="${window.__forgePreviewImages[name] || window.__forgePreviewImages[\'athlete-fallback\']}"')
    if src == 'preview/demo-data.js':
        code = code.replace("new URLSearchParams(location.search).get('screen') || 'home'", "window.__forgeDemoScreen || 'home'")
    return '<script>' + code.replace('</script', '<\\/script') + '</script>'

app = read('preview/demo.html').replace('<base href="../">', '')
app = app.replace('href="assets/icons/favicon.svg"', 'href="' + favicon + '"')
app = re.sub(r'<link rel="stylesheet" href="([^"]+)">', inline_css, app)
app = re.sub(r'<script src="([^"]+)"></script>', inline_script, app)
app = app.replace('<body>', '<body><script>window.__forgeDemoScreen="__FORGE_SCREEN__";window.__forgePreviewImages=' + json.dumps(images) + ';</script>', 1)

# L’aperçu livré est désormais le site complet à taille réelle, pas une planche de téléphones.
app = app.replace('__FORGE_SCREEN__', 'home')
app = app.replace('<title>Forge', '<title>Forge · Aperçu autonome')
(ROOT / 'APERCU.html').write_text(app, encoding='utf-8')
print('APERCU.html généré :', len(app.encode('utf-8')), 'octets ; site complet, stockage isolé et ressources intégrées.')
