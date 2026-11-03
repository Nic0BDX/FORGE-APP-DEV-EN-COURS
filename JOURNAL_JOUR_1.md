# Forge — Journal du Jour 1

**26 octobre 2026 · Plus qu'une app, une discipline.**

## Le résultat de la journée

Le projet fourni a été amélioré sur sa propre base HTML/CSS/JavaScript. Les 48 fichiers d’origine ont été conservés, certains corrigés, et les outils de suivi ont été ajoutés. Aucune migration vers un framework ni reconstruction de l’application n’a été nécessaire.

La nouvelle direction évoque un carnet sportif soigné : **ivoire, vert pin, sauge et touches de miel**, surfaces mates, typographie système lisible et illustrations locales. L’intention est de rendre l’entraînement accueillant et régulier. Le thème clair est le défaut ; un vrai thème sombre vert profond reste disponible.

## Travail accompli et responsabilités

| Tâche | Responsable | Réalisation | Fin |
|---|---|---|---|
| ✅ P01 | Chef de projet | Lecture des README, inventaire des 48 fichiers initiaux, audit des fonctions et limites | Jour 1 |
| ✅ P02 | Chef de projet | Feuille de route complète, priorités, attribution et ordre de travail | Jour 1 |
| ✅ P03 | Chef de projet | README, journal, suivi calculé et préparation de la livraison | Jour 1 |
| ✅ U01 | Designer UI/UX | Direction visuelle, palette et illustrations originales locales | Jour 1 |
| ✅ U02 | Designer UI/UX | CSS commun, accueil/compte/coque, composants secondaires et deux thèmes | Jour 1 |
| ✅ D01 | Développeur | Conservation de l’architecture, accès whey/hydratation/rappels et corrections critiques | Jour 1 |
| ✅ D02 | Développeur | Accueil, compte, navigation mobile complète et thème persistant | Jour 1 |
| ✅ D03 | Développeur | Présentation Premium honnête, absente du ZIP initial | Jour 1 |
| ✅ D04 | Développeur | Galerie interactive de trois vrais écrans et aperçu autonome | Jour 1 |
| ✅ T01 | Testeur mobile | Situation de départ, routes et défauts reproductibles | Jour 1 |
| ✅ T02 | Testeur mobile | Tous les écrans parcourus dans la matrice de tailles/thèmes, retouches responsive vérifiées | Jour 1 |
| ✅ T03 | Testeur mobile | Parcours fonctionnels de non-régression exécutés | Jour 1 |
| ✅ C01 | Contenu & idées | Charte de ton calme et slogan conservé | Jour 1 |
| ✅ C02 | Contenu & idées | Microtextes transmis, intégrés par le développeur dans les parcours principaux | Jour 1 |
| ✅ C04 | Contenu & idées | Trois propositions concrètes pour le lendemain | Jour 1 |

**En cours à la clôture : aucune tâche du Jour 1.** Les 13 tâches restantes restent explicitement à faire ; elles ne sont pas comptées comme partiellement terminées.

## Corrections concrètes

- Le choix d’un avatar ne vide plus les informations saisies à l’inscription ; le prénom est repris à la configuration initiale.
- Le mode clair change réellement l’interface et la préférence est conservée au rechargement.
- La navigation mobile permet de retrouver les rubriques et le profil sans dépendre du menu ordinateur.
- Les réglages whey, l’hydratation et les rappels photo sont accessibles dans les vues réellement actives.
- Le carnet du compte courant est restauré ; la remise à zéro sauvegarde également l’état du compte.
- Les légendes de photos sont échappées avant affichage dans l’accueil.
- Les anciens exemples IA à chiffres arbitraires sont remplacés par des repères généraux identifiés comme tels ; le bloc nutrition en double est retiré.
- Les images décoratives et avatars proposés ne dépendent plus d’un téléchargement tiers.
- Les débordements observés sur petits écrans et les deux dernières cibles tactiles trop petites ont été corrigés puis vérifiés.

## Validation et limites des preuves

| Campagne | Résultat |
|---|---|
| Version originale | 22 assertions réussies / 26 ; 4 échecs, dont 11 états avec débordement parmi 264 états de rendu |
| Application Jour 1 | **33 assertions réussies / 33** ; **318 états de rendu**, aucun débordement horizontal détecté |
| Navigateurs / dimensions | Chromium ; 320 × 568, puis largeurs 375, 390, 430, 768 et 1440 ; thèmes clair et sombre |
| Exécution | Aucune exception JavaScript ni requête échouée dans la campagne applicative finale |
| Actions tactiles contrôlées | Boutons mobiles mesurés à au moins 44 px après correction |
| Aperçu interactif | **22 assertions réussies** : trois écrans, interactions, thème, navigation, réinitialisation, isolation des données et rendu autonome sans réseau |
| Tableau de bord | **12 vérifications réussies** : calculs, cinq agents, filtres, rendu 320–1440 px et absence d’exception |
| Ouverture directe HTML | **Non vérifiée** : le navigateur géré interdit `file://`. La validation a été effectuée via HTTP local |
| Appareils physiques | Safari/iPhone et Android réels non exécutés ; caméra et notifications restent à vérifier sur ces appareils |

Le rapport détaillé et ses résultats bruts sont dans `TESTS_JOUR_1.md` et `tests/`. Une page de coach ou de Premium affichée n’est pas une intégration d’IA ou de paiement : ces services restent non raccordés.

## Tableau de bord à la clôture

**Avancement global : `█████████░░░░░░░` 54 % — 15 tâches terminées / 28.**

| Agent | Avancement | Terminées / total |
|---|---|---:|
| Chef de projet | `████████████░░░░` 75 % | 3/4 |
| Designer UI/UX | `████████░░░░░░░░` 50 % | 2/4 |
| Développeur | `██████░░░░░░░░░░` 40 % | 4/10 |
| Testeur mobile | `████████░░░░░░░░` 50 % | 3/6 |
| Contenu & idées | `████████████░░░░` 75 % | 3/4 |

Calcul : tâches terminées ÷ tâches totales × 100, arrondi à l’entier, sans crédit partiel pour les tâches en cours. Le dénominateur inclut les étapes de production futures. **54 % décrit la feuille de route, pas un taux de préparation à une mise en production.** Les mêmes chiffres proviennent de `docs/roadmap.json`, qui génère `FEUILLE_DE_ROUTE.md` et `AVANCEMENT.html`.

## À faire et points bloquants

La liste détaillée des 13 tâches restantes figure dans la feuille de route : P04, U03, U04, D05 à D10, T04 à T06 et C03. Elle couvre finitions, accessibilité approfondie, reprise de séance, sauvegardes, sélection de photos/périodes et vérification sur appareils réels.

L’authentification multi-appareils/OAuth, une vraie IA et le paiement Premium nécessitent des choix de services, un serveur et des accès appropriés. Aucun secret n’est requis pour le carnet local. La communauté reste une vitrine. L’application actuelle conserve les fonctionnalités locales du projet, avec ces limites annoncées.

## Trois idées pour le Jour 2

1. **Un premier entraînement guidé** : relier les actions existantes pour qu’un profil vide atteigne simplement sa première séance. Si l’idée est retenue, une tâche sera ajoutée et le total recalculé.
2. **Une séance facile à reprendre** : conserver un brouillon et restaurer séries/charges après rechargement, sans doublon dans l’historique (D05).
3. **Un avant / après que l’on choisit** : sélectionner les deux photos et afficher leurs dates réelles, sans inventer de mesures (D07).

Ces idées ne sont pas des fonctions déjà livrées. Au début de la prochaine journée, le chef de projet relira le bilan, choisira deux ou trois tâches utiles et les attribuera dans l’ordre.

## Livrables

- Projet complet à jour, README, inventaire et changelog.
- `APERCU.html` : aperçu autonome ; `preview/phone.html` : galerie source de trois écrans interactifs.
- `AVANCEMENT.html` : suivi visuel séparé du site, avec filtres par agent et statut.
- `FEUILLE_DE_ROUTE.md`, ce journal et le rapport de tests.
- Archive finale : `Forge-Jour-1.zip`, préparée à partir du dossier livré.

**Le Jour 1 est terminé. L’équipe attend « jour suivant ».**
