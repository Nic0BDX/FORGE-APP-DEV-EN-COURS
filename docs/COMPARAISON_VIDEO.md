# Forge — comparaison intermédiaire avec la vidéo

État : version fonctionnelle vérifiée, finition visuelle suspendue à la demande du propriétaire. Ce document ne déclare pas une correspondance pixel à pixel sur tous les écrans.

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

1. La silhouette est un emplacement propre, comme demandé. Les autres photos de nourriture, sport et communauté ne sont pas les images de la vidéo : emplacements et pictogrammes temporaires.
2. Typographie système et icônes SVG locales : les fichiers typographiques et iconographiques exacts de la vidéo ne sont pas fournis.
3. Les écrans Forge absents du film (inscription, suivi de séance, souvenirs, calendrier, Premium) utilisent les composants communs ; aucune référence complète n’existe pour les comparer à l’identique.
4. Sur téléphone et tablette, les cartes se réorganisent et la navigation inférieure prend le relais. La vidéo fournie ne montre pas ces formats.
5. Les chiffres reflètent les données du carnet ou une démonstration explicitement isolée. Les fonctions distantes IA, comptes synchronisés, paiement et communauté ne sont pas raccordées.
6. La comparaison détaillée des derniers écrans et l’audit clavier/contraste complet restent à terminer (V03, U04).

Captures de cette version : `tests/captures-video/`. La vidéo source n’est pas incluse dans le ZIP.
