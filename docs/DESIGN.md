# Forge — direction visuelle, Jour 1

« Plus qu'une app, une discipline. »

## Intention

Un studio sportif calme et accueillant : un fond ivoire, du vert pin pour guider l'action, du sauge pour les surfaces de progression et une touche de miel pour la régularité. L'entraînement devient un rendez-vous avec soi, sans injonction agressive. Les illustrations originales de pistes et de reliefs suggèrent le mouvement, la constance et l'air libre.

La typographie utilise la pile système sans dépendance réseau. Les titres sont amples mais de graisse modérée ; les valeurs chiffrées restent très lisibles. Espacements de 8 à 24 pixels sur téléphone, surfaces mates, bordures fines et coins de 12 à 24 pixels remplacent le verre sombre, les lueurs rouges et les animations continues.

## Palette

| Usage | Clair | Sombre |
|---|---|---|
| Fond | `#F5F3EC` | `#142922` |
| Surface | `#FFFEF9` | `#1C342B` |
| Texte | `#243C31` | `#F3F3E9` |
| Texte secondaire | `#647267` | `#B4C5B6` |
| Action principale | `#28513E` | `#BFD6AE` |
| Texte sur action | `#FFFEF5` | `#203C2E` |
| Accent doux | `#E4EBDC` | `#2E4A3A` |
| Bordure | `#DDDFD3` | `#3C5548` |

Le mode sombre est un thème vert profond à part entière. Il ne force pas les valeurs du thème clair. Les illustrations sont communes aux deux thèmes ; les surfaces et textes suivent les variables CSS.

## Système et accessibilité

- `css/forge-elite.css`, déjà chargé en dernier, conserve les classes de l'application et remplace leur direction visuelle. Les styles historiques restent présents afin de conserver la structure de toutes les pages.
- Les actions tactiles principales mesurent au moins 44 pixels. Les champs utilisent une taille de 16 pixels pour éviter le zoom automatique sur iPhone.
- La navigation inférieure tient compte de la zone de sécurité. Les contenus réservent l'espace nécessaire pour que la barre ne les recouvre pas.
- Le clavier dispose d'un focus visible. `prefers-reduced-motion` désactive les mouvements non essentiels.
- Les illustrations `hero-auth.svg`, `hero-today.svg` et `hero-summary.svg` sont locales, originales et sans photographie tierce. `athlete-fallback.svg` fournit un repli cohérent.
- Aucun résultat sportif n'est inventé pour décorer l'interface. Les états vides et les données existantes sont conservés.

## Périmètre du Jour 1

Fondations et cohérence globale, accueil, compte, navigation et deux thèmes. Le détail des contrôles réellement exécutés se trouve dans `TESTS_JOUR_1.md`. L'audit complet des contrastes, les finitions des sous-écrans et les améliorations d'accessibilité avancées restent des tâches de la feuille de route.

## Jour 3 — écrans spécialisés (U03)

Le langage visuel reste identique. Les souvenirs conservent leur grille de deux colonnes ; la légende et les actions sont désormais placées sous l’image, dans le flux de la carte. Les commandes de catégorie et de suppression ne se recouvrent plus. La suppression reste une cible de 44 pixels, et la catégorie garde au moins cette hauteur.

Sur téléphone, les repas présentent le nom de l’aliment avant les calories et les macros, sur une seconde ligne. Cette grille ciblée utilise le sélecteur CSS `:has()` pris en charge par les navigateurs modernes ; un ancien navigateur conserve le rendu flex existant. Les noms et les listes longues peuvent revenir à la ligne sans perte de contenu.

Dans Avant / Après, les photos sont affichées en entier avec `object-fit: contain`. Les dates et les poids associés restent sous chaque photo, sur leur propre surface. Les deux sélecteurs et les champs de calendrier sont empilés sur petit écran, avec des libellés visibles ; les trois indicateurs de comparaison restent présents. Les états vides spécialisés utilisent une surface et une bordure discrètes communes.

Les essais U03 sont consignés dans `TESTS_JOUR_3.md` après exécution par le testeur. L’audit des contrastes et de l’accessibilité des dialogues reste prévu dans U04.

Le contrôle des rappels whey utilise une ligne entière cliquable d’au moins 44 pixels de haut, associée à la case à cocher. La case garde une taille visuelle de 20 pixels ; son libellé élargit la cible tactile sans grossir artificiellement le symbole. Les libellés de portion et d’horaires sont également associés à leurs champs.
