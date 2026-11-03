# Illustrations Forge

Le Jour 1 remplace les photos d'athlètes absentes par trois illustrations SVG originales, locales et autonomes :

- `hero-auth.svg` : accueil et connexion, piste dans un paysage sauge.
- `hero-today.svg` : programme et séance du jour.
- `hero-summary.svg` : fin de séance, relief et confirmation.
- `athlete-fallback.svg` : illustration de repli commune.

Ces assets fonctionnent sans connexion Internet. Si des photographies les remplacent plus tard, utiliser des images dont vous avez les droits et conserver une alternative locale. Le design n'exige plus de photos sur fond noir ou rouge.

## Étape vidéo

La nouvelle coque emploie `vfImageSlot()` dans `js/features/video-forge.js` pour réserver l’emplacement de la silhouette et des images à fournir. Aucun portrait ou visuel de la vidéo n’a été extrait pour être réutilisé comme image du site. Les anciens SVG sont conservés pour les vues historiques encore référencées. Cet emplacement de l’accueil a depuis été remplacé par le corps décrit ci-dessous. Après une modification de visuel, la version autonome doit être reconstruite avec `python3 preview/build-standalone.py`.

## Corps animé de l’accueil

`forge-body.png` est une illustration originale générée pour Forge (1024×1536, RGBA), et remplace l’emplacement du dashboard. L’original de génération est conservé hors du dépôt dans l’environnement de travail. Les contours anatomiques de `forge-body-overlay.svg` utilisent `currentColor`, repris dans `FORGE_BODY_OVERLAY` de `js/features/home-video.js` pour permettre les couleurs et animations sans dépendance réseau. Toute modification des tracés doit être reportée dans cette constante, puis l’aperçu reconstruit. Le PNG n’est pas modifié par l’animation. Les photographies de la vidéo ne sont pas redistribuées.
