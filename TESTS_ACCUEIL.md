# Forge — validation de l’accueil animé

Version gelée avant publication. Les tests utilisent des comptes et données synthétiques isolés.

| Suite | Résultat | Preuve |
|---|---:|---|
| Données d’activité, migration, validation et échec de stockage |31/31|`tests/resultats-activite-donnees.json`|
| Accueil : grille, corps, pectoraux, accents, responsive, périodes, pas, sauvegarde, pause, hors ligne |66/66|`tests/resultats-accueil-anime.json`|
| Non-régression générale, 342 états à six largeurs dans les deux thèmes |33/33, 0 débordement|`tests/resultats-accueil-regression.json`|
| Menus, recherche, périodes, couleurs, saisies et animations générales |71/71|`tests/resultats-accueil-interactions.json`|
| Galerie et aperçu autonome, données isolées, document neuf sans réseau |22/22|`tests/resultats-accueil-apercu.json`|

**223 contrôles réussis**, aucun échec ni exception JavaScript détecté. Les342états décrivent la couverture de la suite de non-régression et ne sont pas ajoutés artificiellement au nombre de contrôles.

Contrôle visuel : capture1280 comparée aux images de la vidéo. Premier rang352px, second280,5px, pas ày742,5. Les vignettes de séances ont une hauteur fixe pour éviter d’étirer les cartes. Les chiffres secondaires de la carte des pas retrouvent leur taille lisible. La pulsation change réellement l’opacité (échantillons observés0,3297 puis0,93), reste alignée et s’arrête sur commande.

À reproduire avec un serveur HTTP local sur8080 :

```bash
node tests/activity-data.cjs
node tests/home-video-smoke.cjs
node tests/mobile-smoke.cjs
node tests/video-smoke.cjs
node tests/preview-smoke.cjs
```

L’ouverture directe `file://` reste bloquée par le navigateur géré et n’est pas revendiquée. L’aperçu est testé viaHTTP et sans réseau dans un document neuf. Aucun essai sur Safari ou appareil physique. L’animation est décorative et ne représente pas une mesure de santé.
