# Forge — comparaison intermédiaire avec la vidéo

État : accueil complété et vérifié lors de la demande suivante ; comparaison globale des autres écrans encore ouverte. Ce document ne déclare pas une correspondance pixel à pixel sur tous les écrans.

## Observé et repris

- Dashboard : sidebar d’environ 220 px, barre supérieure, héro plus large, activité et macros, trois cartes au second rang, pas et carte de motivation ensuite.
- Assistant IA : orbe central, accueil et champ de message ; connexion IA encore indisponible dans Forge.
- Activité : anneaux, graphiques et périodes ; données Forge réparties dans Accueil, Programmes et Progression.
- Entraînements : héro, prochaine séance, cartes de suivi et bibliothèque conservée.
- Nutrition : héro/donut puis repas, hydratation et historique calorique.
- Sommeil : héro, petites cartes de mesure et historique des nuits.
- Santé : cartes et anneau ; Forge affiche un relevé manuel du pouls, sans score de santé fictif.
- Progression : graphique, photos et cartes de mesures.
- Communauté : héro et grille de ressources ; aucun réseau social distant simulé.

## Écarts déjà corrigés

Les premiers essais avaient des cartes trop hautes, un double espacement entre rangées, un nombre trop petit au centre du donut et une nutrition trop éloignée de la grille de référence. Ces points ont été corrigés. À 1280 × 805, le premier rang du dashboard commence à environ 86 px et se termine à 438 px ; le second va de 450 à 730 px, très proche des positions observées dans la capture de référence. Les barres de sommeil restent contenues sur téléphone. Les sept accents recolorent les composants et les graphiques.

## Écarts et travail restant

1. La silhouette de l’accueil est maintenant un corps original généré, avec éclairage pectoral SVG animé, et non une extraction exacte de la vidéo. Les autres photos de nourriture et de communauté restent des emplacements temporaires. Les vignettes de séances emploient le visuel sportif local.
2. Typographie système et icônes SVG locales : les fichiers typographiques et iconographiques exacts de la vidéo ne sont pas fournis.
3. Les écrans Forge absents du film (inscription, suivi de séance, souvenirs, calendrier, Premium) utilisent les composants communs ; aucune référence complète n’existe pour les comparer à l’identique.
4. Sur téléphone et tablette, les cartes se réorganisent et la navigation inférieure prend le relais. La vidéo fournie ne montre pas ces formats.
5. Les chiffres reflètent les données du carnet ou une démonstration explicitement isolée. Les fonctions distantes IA, comptes synchronisés, paiement et communauté ne sont pas raccordées.
6. La comparaison détaillée des derniers écrans et l’audit clavier/contraste complet restent à terminer (V03, U04).

Captures de cette version : `tests/captures-video/`. La vidéo source n’est pas incluse dans le ZIP.

## Accueil finalisé — correction de l’organisation

Les premières valeurs d’activité (nutrition/habitudes) ont été remplacées par **Bouger / Exercice / Debout**, avec calories actives et heures debout déclarées, et minutes des séances enregistrées. La carte **Pas du jour** contient la mini-courbe, le total, l’objectif, le pourcentage, la distance, les calories actives et les étages. Les données manquantes ne sont pas inventées.

Le corps est ancré à droite, derrière les textes et la petite carte des trois repères. Les pectoraux, épaules et bras possèdent un calque SVG aligné sur l’image ; deux halos pulsent et suivent les sept accents. Une commande de pause et la réduction d’animations sont vérifiées.

Comparaison finale à 1280 × 805 : premier rang y86, hauteur352 ; second rang y450, hauteur280,5 ; pas y742,5. La modification des miniatures avait d’abord agrandi le second rang à381px : ce défaut a été corrigé, puis le test de densité ajouté. Les formats320/390/768/1280 ont été vérifiés, ainsi que la régression générale à six largeurs et dans les deux thèmes.

La photo du corps, les icônes et la typographie ne sont pas les fichiers originaux de la vidéo. Le présent bilan décrit la fidélité des composants et de la composition, pas une identité absolue de chaque pixel.
