# Illustrations Forge

Le Jour 1 remplace les photos d'athlètes absentes par trois illustrations SVG originales, locales et autonomes :

- `hero-auth.svg` : accueil et connexion, piste dans un paysage sauge.
- `hero-today.svg` : programme et séance du jour.
- `hero-summary.svg` : fin de séance, relief et confirmation.
- `athlete-fallback.svg` : illustration de repli commune.

Ces assets fonctionnent sans connexion Internet. Si des photographies les remplacent plus tard, utiliser des images dont vous avez les droits et conserver une alternative locale. Le design n'exige plus de photos sur fond noir ou rouge.

## Étape vidéo

La nouvelle coque emploie `vfImageSlot()` dans `js/features/video-forge.js` pour réserver l’emplacement de la silhouette et des images à fournir. Aucun portrait ou visuel de la vidéo n’a été extrait pour être réutilisé comme image du site. Les anciens SVG sont conservés pour les vues historiques encore référencées. La silhouette doit être intégrée lors de la reprise, puis la version autonome reconstruite avec `python3 preview/build-standalone.py`.
