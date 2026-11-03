# Forge

**Plus qu'une app, une discipline.**

Le projet complet est disponible dans ce dépôt. Pour récupérer la livraison validée en un fichier : [télécharger le ZIP du Jour 4](livraisons/Forge-Jour-4-Etape-video.zip) ([empreinte SHA-256](livraisons/Forge-Jour-4-Etape-video.zip.sha256)). Décompresser le ZIP pour ouvrir le site et son aperçu autonome.

Un carnet de musculation, nutrition, habitudes et progression, conçu d’abord pour le téléphone. Le projet fourni a été conservé : HTML, CSS et JavaScript natifs, sans framework ni compilation. Les comptes et les données restent dans le navigateur.

**Version du Jour 4 — étape vidéo validée, travail en pause à ta demande.** Le site reprend désormais la direction noire/verre sombre/citron de la vidéo MP4 fournie. L’ancien style ivoire/pin reste seulement dans l’historique des Jours 1 à 3. La fidélité visuelle complète n’est pas encore déclarée terminée : la silhouette et d’autres images sont réservées, et la comparaison de tous les écrans reste à finaliser.

Le ZIP contient le site complet, **APERCU.html** autonome, les sources, les tests, le journal, **AVANCEMENT.html**, la feuille de route et **POINT_DE_REPRISE.md**. Lors de la prochaine demande, repartir de ce dernier fichier sans refaire les journées validées. Les archives antérieures sont conservées.

<!-- FORGE_CURRENT_START -->
**État courant : Jour 4 · en pause · 23/32 tâches terminées (72 %).**

Dernier point enregistré : 2026-11-03T11:14:44+01:00. Travail courant : **V03**.

Lire [POINT_DE_REPRISE.md](POINT_DE_REPRISE.md) pour reprendre sans refaire les tâches livrées. Archive courante : `Forge-Actuel.zip` ; archives quotidiennes conservées.
<!-- FORGE_CURRENT_END -->

## Ouvrir le projet

Après avoir décompressé tout le dossier, ouvre :

- **`index.html`** pour utiliser l’application ;
- **`APERCU.html`** pour un aperçu autonome en un seul fichier, avec styles, scripts et visuels intégrés ;
- **`preview/phone.html`** pour la galerie interactive source de trois écrans : accueil public, accueil personnel et nutrition ;
- **`AVANCEMENT.html`** pour consulter le tableau de bord du développement et le travail des cinq agents. Ce document est distinct de l’application.

L’aperçu utilise des exemples explicitement signalés et un stockage en mémoire séparé pour chaque écran. Il ne lit ni ne remplace le carnet réel. Les interactions de démonstration disparaissent au rechargement.

Aucune installation de dépendances n’est nécessaire pour le site. Pour un comportement de navigateur plus prévisible, lance un petit serveur depuis le dossier contenant `index.html` :

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

Puis ouvre l’adresse locale `http://localhost:8080` dans ton navigateur. Les fichiers sont conçus pour une ouverture directe ; le stockage, les permissions et certaines fonctions dépendent du navigateur. **L’ouverture par double-clic n’a pas pu être vérifiée ici : la politique du navigateur de test interdit `file://`. Les essais ont été réalisés via HTTP local.** Caméra et notifications sur téléphone doivent être vérifiées dans un contexte sécurisé et sur un vrai appareil. Le serveur local ci-dessus n’est pas un serveur de comptes ni un back-end.

## Direction visuelle actuelle — référence vidéo

Fond noir presque pur, cartes en verre sombre avec bord fin et coins arrondis, textes blancs/gris et accent citron. La sidebar, la barre supérieure, les anneaux d’activité, le donut, les barres de sommeil et la courbe du pouls suivent les composants observés. Le menu avatar propose sept accents persistants : vert, rouge, orange, cyan, bleu, violet et rose. Les périodes, la recherche, les menus, les transitions et les animations sont fonctionnels. Le mode clair préexistant reste accessible ; le noir est la valeur par défaut.

Les écrans Programme, Nutrition, Sommeil, Santé et Progression reprennent les grilles sombres. Les fonctionnalités précédentes restent accessibles. Les pas et le pouls sont des relevés manuels, validés dans les sauvegardes ; aucun capteur n’est connecté. Les données de démonstration restent isolées.

Voir [docs/REFERENCE_VIDEO.md](docs/REFERENCE_VIDEO.md) et [docs/COMPARAISON_VIDEO.md](docs/COMPARAISON_VIDEO.md).

### Direction du Jour 1 — historique remplacé

Une base **ivoire**, du **vert pin** pour les actions, de la **sauge** pour les surfaces secondaires et une touche **miel** pour les repères. L’objectif est une sensation de carnet sportif soigné : accueillant, calme et lisible, avec de vrais espaces de respiration. Le thème clair est le point de départ ; un thème sombre vert profond reste disponible et mémorisé.

La typographie utilise les polices système pour rester rapide et disponible sans téléchargement. Les illustrations SVG et les avatars proposés sont locaux. Les boutons, formulaires, navigation et cartes partagent le même langage visuel. Les préférences de réduction d’animations sont prises en compte.

Détails et valeurs de design : [`docs/DESIGN.md`](docs/DESIGN.md). Charte de ton et propositions : [`docs/CONTENU_ET_IDEES.md`](docs/CONTENU_ET_IDEES.md).

## Fonctionnalités conservées

| Domaine | Disponible dans le projet | Limite à connaître |
|---|---|---|
| Accueil public | Présentation, slogan, création de compte et connexion | Pas de connexion Apple ou Google raccordée |
| Compte | Inscription locale, mot de passe haché avec sel, récupération par code, indicateur d’attente | Pas de compte distant ni de synchronisation entre appareils |
| Accueil personnel | Prochaine séance, semaine, photos, habitudes, jours de présence, graphiques, macros et records | Les indicateurs reflètent seulement les données saisies |
| Programmes | Création/édition, programmes recommandés, activation et bibliothèque d’exercices | Les vidéos dépendent d’un service externe ; elles ne sont pas une dépendance du carnet |
| Séance | Aperçu, séries, charges, répétitions, RPE, validation, repos, pause, +15 secondes, brouillon par compte et reprise explicite | Conservation dans ce navigateur ; le brouillon en cours n’est pas inclus dans l’export du carnet |
| Nutrition | Journal alimentaire, macros, repas, ajouts rapides, hydratation et réglages whey accessibles | Les exemples alimentaires ne constituent pas une prescription personnalisée |
| Progression | Volume d’entraînement, poids, records, XP et niveaux | Le volume en kg ne mesure pas à lui seul la force ou la forme physique |
| Souvenirs | Photos locales, légendes, filtres Entraînements/Événements, suppression et photo hebdo | Capacité limitée par le stockage du navigateur |
| Avant / après | Choix de deux photos distinctes, dates et poids associés, écarts disponibles et volume de la période | Les dates sont celles enregistrées dans le carnet ; aucune mesure déduite des images |
| Coach IA et nutrition IA | Écrans conservés et clairement indiqués comme aperçus | **Aucune IA connectée**, pas de vraie conversation ni analyse du profil |
| Calendrier | Choix du mois ou du jour, navigation mensuelle, liste filtrée et retour au mois actuel | Historique des séances enregistrées, pas un agenda de réservation |
| Profil et thème | Profil, objectifs, badges, paramètres, choix clair/sombre persistant | Les comptes existants conservent leur préférence enregistrée |
| Premium | Entrée et présentation de l’offre **en préparation** | Aucun paiement ni abonnement actif ; cette rubrique manquait au ZIP |
| Habitudes et objectifs | Suivi quotidien, eau, sommeil, objectifs, jours de présence et paliers | Les jours de présence sont distincts des jours d’entraînement |
| Communauté | Vitrine et accès au profil | Pas de réseau social connecté |
| Données | Export JSON versionné, aperçu et confirmation d’import, migration des champs absents, récupération et effacement du carnet courant | Données locales ; export sans mot de passe ni brouillon de séance actif |

Les paliers de présence 3 / 7 / 14 / 30 / 60 / 100 jours et les badges ont été conservés. Les rappels whey sont facultatifs et doivent rester adaptés aux indications du produit. Les rappels de photos et de whey nécessitent l’autorisation du navigateur et l’application ouverte ou active ; ce ne sont pas des notifications push autonomes.

## Jour 4 — Livraison intermédiaire vérifiée

La demande vidéo a remplacé l’ordre initial de la journée. **V01** couvre le socle visuel et **V02** les écrans et interactions. La version livrée passe **33 contrôles de non-régression sur 342 états**, **71 contrôles de la nouvelle interface** et **22 contrôles d’aperçu**. Aucun débordement horizontal ni exception JavaScript détecté dans ces tests. L’ouverture directe `file://` reste interdite par le navigateur géré ; le rendu autonome a été vérifié sans réseau dans un document neuf.

**À terminer plus tard :** V03, comparaison exhaustive avec la vidéo, finition des images et derniers écarts ; C03, relecture éditoriale finale ; U04, audit complet d’accessibilité ; P04, revue de publication. Ne pas confondre ce ZIP validé fonctionnellement avec une copie visuelle finale ou un service prêt à publier. Les cinq agents avaient atteint leur quota : la dernière intégration et les tests ont été effectués par le responsable principal.

Détails : [JOURNAL_JOUR_4.md](JOURNAL_JOUR_4.md), [TESTS_VIDEO.md](TESTS_VIDEO.md), [POINT_DE_REPRISE.md](POINT_DE_REPRISE.md). La suite est suspendue à la demande du propriétaire.

## Jour 3 — Travail vérifié

Le Jour 3 suit l’ordre **T05 → D07 → U03**. **T05 est validée : 30 contrôles réussis** avec fermeture puis relance réelles du navigateur, repos totalement expiré, sept brouillons invalides refusés sans altération et sauvegarde synthétique au format du ZIP original. Aucun code applicatif n’a été modifié. La fermeture est propre ; ce test ne simule pas une extinction forcée du système. **D07 est également validée** : deux photos distinctes peuvent être choisies, les mesures affichent leurs dates et le calendrier filtre réellement les séances par mois ou par jour. **U03 est validée** : actions des souvenirs séparées, noms et macros plus lisibles, photos comparées entières avec leurs légendes en dessous, et états vides harmonisés. Le rappel whey dispose aussi d’une ligne entière cliquable de 44 px et de champs correctement associés à leurs labels.

Le journal [JOURNAL_JOUR_3.md](JOURNAL_JOUR_3.md) et le rapport [TESTS_JOUR_3.md](TESTS_JOUR_3.md) conservent les résultats au fil de la journée. D07 passe **42 contrôles ciblés**, **7 contrôles de légendes à 320 px** et **22 contrôles d’aperçu**, avec un essai `file://` non exécuté. U03 passe **47 contrôles ciblés**, **33 contrôles de non-régression sur 318 états** et **22 contrôles d’aperçu**. La régression complète précède le dernier correctif de label whey ; les 47 contrôles ciblés et l’aperçu ont ensuite vérifié la version finale. L’essai `file://` reste non exécuté et aucun contrôle sur appareil physique n’est revendiqué.

### Choisir ses photos et une période

Dans **Avant / Après**, les deux listes choisissent des photos distinctes et les remettent dans l’ordre des dates si nécessaire. La sélection est isolée par compte et conservée en mémoire pendant l’utilisation ; elle n’est pas une préférence enregistrée dans l’export. Si une photo disparaît, le choix est adapté aux photos disponibles. Avec moins de deux photos, l’écran explique comment commencer.

Chaque photo indique le dernier poids enregistré à sa date ou avant, avec la date réelle de ce relevé ; un poids futur n’est pas utilisé. Deux relevés distincts sont nécessaires pour l’écart de poids. La variation de masse grasse exige deux mesures à des dates distinctes dans la période ; elle est exprimée en points de pourcentage. Le volume est la somme des charges × répétitions des séances entre les deux dates incluses : il ne représente pas une mesure de force. Les données manquantes sont signalées sans estimation.

Le **Calendrier** permet de choisir un mois ou un jour précis, de revenir au mois complet ou au mois actuel. La liste et son compteur suivent le filtre choisi. Les dates sont celles enregistrées dans le carnet ; cette amélioration ne corrige pas encore tous les utilitaires de dates locales du projet. L’aperçu autonome propose aussi **Avant / Après** dans son menu, avec un état vide honnête et sans photos personnelles ou fictives ajoutées.

## Jour 2 — Travail déjà vérifié

- **P05 terminée** : point de reprise, documents synchronisés et ZIP vérifié après chaque tâche ; archives quotidiennes conservées. Le mécanisme passe 20 contrôles sur copies isolées.
- **D05 terminée** : les saisies d’une séance sont conservées dans un brouillon propre au compte. Après rechargement, la carte **« Une séance t’attend »** permet de reprendre ou d’abandonner ; aucune reprise n’est imposée.
- Le repos actif tient compte du temps écoulé hors de la page et sa pause est conservée. Une autre séance ne remplace pas le brouillon sans choix explicite. La fin ne crée pas de doublon de séance ou d’XP ; un échec d’écriture est annoncé en conservant la saisie.
- **D06 validée** : le fichier est contrôlé avant tout remplacement, puis un aperçu affiche son contenu et demande confirmation. Une erreur de stockage conserve le carnet et la séance en cours. Si un carnet local est illisible, un écran de récupération préserve le fichier brut et permet de l’exporter avant restauration.

Preuves D05 : **49 contrôles ciblés réussis**, **33 contrôles de non-régression sur 318 états**, **22 contrôles d’aperçu réussis** et un contrôle `file://` non exécuté du fait du navigateur géré. La campagne D06 du **3 novembre 2026** passe **70 contrôles ciblés**, puis **33 contrôles de non-régression sur 318 états** et **22 contrôles d’aperçu**. Aucun débordement horizontal ni exception JavaScript n’a été relevé dans ces campagnes ; l’ouverture `file://` reste non exécutée. Voir [TESTS_JOUR_2.md](TESTS_JOUR_2.md) pour le périmètre réel et les limites.

### Reprendre une séance et comprendre sa sauvegarde

Les séries sont enregistrées au fil de la saisie dans une petite sauvegarde séparée du carnet et des photos, pour le compte connecté. Recharger puis choisir **Reprendre la séance** restaure les champs, les séries cochées et le repos. **Abandonner la séance** demande confirmation et retire ce brouillon sans ajouter de séance à l’historique. Terminer l’enregistre une fois, puis supprime le brouillon.

Le brouillon reste local à ce navigateur. **L’export JSON du carnet n’inclut pas la séance encore en cours** : terminer la séance avant l’export si l’on veut qu’elle figure dans l’historique sauvegardé. Le compte et les brouillons des autres profils ne sont pas modifiés. Si un message indique une sauvegarde impossible, garder la page ouverte ; ne pas considérer la saisie comme durable tant qu’une écriture n’a pas réussi.

### Importer ou récupérer un carnet

Dans **Paramètres → Importer JSON**, Forge vérifie le format, les dates, les valeurs et les images, avec une limite de 16 Mo. Un fichier invalide est refusé avant de toucher au carnet. Un fichier reconnu ouvre un aperçu : nombre de séances, repas et photos, profil et programmes. **Annuler** conserve les données ; **Remplacer mon carnet** confirme leur remplacement pour le compte affiché. Exporte le carnet actuel avant ce choix si tu veux en garder une copie. La séance active n’est abandonnée que si le remplacement réussit ; les autres comptes sont conservés.

L’export indique désormais sa version. Les anciens fichiers Forge compatibles restent importables : les réglages absents sont complétés, les champs supplémentaires sûrs sont conservés et un programme actif absent est signalé. Cela ne garantit pas la réparation de n’importe quel fichier endommagé.

Si les données déjà enregistrées sont illisibles, Forge affiche **« Ton carnet a besoin d’attention »** et suspend les modifications automatiques. **Exporter le fichier de secours** conserve exactement son contenu brut, même invalide. Une sauvegarde valide permet ensuite de restaurer le compte. L’effacement reste possible après confirmation et concerne uniquement le carnet courant. Les saisies courantes ont reçu les contrôles minimaux nécessaires pour ne pas enregistrer des valeurs incompatibles avec cette lecture ; une validation exhaustive de tous les formulaires reste une amélioration distincte.

## Ce qui a changé au Jour 1

- Nouvelle direction visuelle claire et sombre sur la structure existante, sans le noir/rouge d’origine.
- Accès mobile aux rubriques et au profil, contrôle du thème et présentation Premium explicite.
- Formulaire d’inscription conservé lors du choix d’avatar ; prénom repris à la première configuration.
- Restauration du carnet du compte courant et correction de la remise à zéro locale.
- Contrôles d’hydratation/whey et rappels photo rendus accessibles malgré les remplacements historiques des vues.
- Illustrations et avatars locaux, sans dépendance aux anciennes photos distantes.
- Textes de connexion et d’IA plus précis ; aucun faux contrôle biométrique ni conseil faussement personnalisé.
- Aperçu de trois écrans, inventaire complet, feuille de route attribuée et tableau de bord indépendant.

Bilan validé : **33/33 assertions applicatives réussies, 318 états de rendu, aucun débordement horizontal détecté et aucune exception JavaScript dans la campagne**. L’aperçu passe **22 assertions**, dont un rendu autonome sans réseau ; **1 essai non exécuté** concerne l’ouverture directe `file://`. Le tableau de bord passe **12 vérifications de cohérence, filtrage et responsive**. Les résultats réellement exécutés, les défauts initiaux et les limites des essais sont détaillés dans [`TESTS_JOUR_1.md`](TESTS_JOUR_1.md). La présence d’un écran ne vaut pas la validation d’un service externe.

## Structure et responsabilités

```text
index.html                 Point d’entrée ; l’ordre des scripts globaux compte
css/                       Styles historiques et direction active forge-elite.css
js/
  core/                    Données, compte, navigation, thèmes et rendu
  data/                    Avatars et catalogue embarqués
  features/                Séances, nutrition, photos, calendrier, profil, etc.
  app.js                   Démarrage
assets/
  icons/                   Favicon
  images/                  Illustrations SVG locales
preview/                   Galerie, démonstration isolée et générateur autonome
APERCU.html                Aperçu autonome généré, sans assets à charger
tests/                    Scripts de validation (voir le rapport de tests)
docs/
  DESIGN.md                Choix visuels
  CONTENU_ET_IDEES.md       Charte et propositions
  roadmap.json             Source unique des tâches et des pourcentages
  build_progress.py        Génère la feuille de route et le tableau de bord
INVENTAIRE.md               Chaque fichier d’origine, son rôle et son état
FEUILLE_DE_ROUTE.md         Tâches, priorités, responsables, statuts et jours de fin
JOURNAL_JOUR_1.md           Changements et bilan du jour
AVANCEMENT.html            Suivi visuel autonome pour le propriétaire
```

Le chef de projet attribue les tâches et maintient les documents. Le designer possède les styles et les assets ; le développeur les scripts, le point d’entrée et les aperçus ; le testeur ses scripts et son rapport ; l’agent Contenu & idées propose les textes que le développeur intègre. L’ordre de réalisation et les dépendances sont dans la feuille de route.

Les fonctions JavaScript restent globales pour les gestionnaires d’événements existants. `js/core/router.js` déclare les pages ; `screens.js` et `ai.js` ajoutent ou remplacent certaines vues. Conserver leur ordre de chargement lors de modifications.

## Données locales et récupération

Les carnets sont stockés dans le `localStorage`, séparément par compte local. Vider les données du site ou changer de navigateur ne permet pas de retrouver automatiquement le carnet. Utilise **Paramètres → Exporter JSON** pour garder une copie.

Le code de récupération est affiché une seule fois à l’inscription : conserve-le pour réinitialiser un mot de passe local. Les anciens comptes sans code ne bénéficient pas de cette récupération. Le hachage SHA-256 avec sel évite l’enregistrement du mot de passe en clair ; il ne transforme pas cette version en authentification serveur adaptée à une mise en production.

Les photos sont redimensionnées et conservées dans ce même stockage. Une grande photothèque peut atteindre le quota du navigateur. L’export est un fichier de données personnelles à conserver avec soin. Le schéma d’import et la récupération ont été vérifiés en D06. Les contrôles complémentaires T05 portent sur les variantes historiques et interruptions encore non couvertes, notamment le redémarrage réel du navigateur et l’expiration complète d’un repos hors de la page.

## Illustrations et images

Les trois visuels décoratifs actifs sont `hero-auth.svg`, `hero-today.svg` et `hero-summary.svg` dans `assets/images/`. Ils sont fournis localement. `athlete-fallback.svg` reste disponible comme remplacement. Voir le README de ce dossier avant de changer un asset ; `photo()` utilise désormais les fichiers `.svg`.

Aucune photo de l’utilisateur n’est envoyée vers un serveur par le carnet. Les images importées pour Souvenirs restent locales. Les éventuelles URLs d’avatars enregistrées dans d’anciens profils restent sous le contrôle de leur propriétaire.

## Coach IA, comptes distants et Premium

Dans `js/features/ai.js`, `AI_CONNECTED` reste à `false`. Les fonctions de `AI_HOOKS` sont des points d’extension, **pas une intégration prête à activer**. Une vraie connexion doit passer par un serveur, gérer l’attente, les erreurs et les réponses asynchrones. Ne jamais placer de clé d’API dans le JavaScript du navigateur. Le hook `coachMessage` pouvant retourner une promesse n’est pas encore géré de bout en bout.

Les comptes multi-appareils/OAuth, le coach connecté et les abonnements demandent des choix de services et de configuration. Ils sont suivis séparément par D08, D09, D10 et T06. Ils ne bloquent pas l’usage local du carnet, et aucun écran ne prétend qu’ils sont déjà actifs.

## Checkpoint après chaque tâche

Le mode continu utilise `docs/checkpoint.py`. Avant de l’exécuter, geler les écritures des agents et vérifier les preuves de la tâche. Le script prépare les documents et l’archive dans un dossier isolé, contrôle les fichiers puis publie le ZIP courant par remplacement atomique.

```bash
# Exemple : terminer une tâche réellement testée et passer à la suivante.
python3 docs/checkpoint.py --complete D05 --day 2 --current D06 \
  --detail "D05 terminée et vérifiée ; commencer la validation des sauvegardes." \
  --next T05 --evidence tests/resultats-d05.json

# Enregistrer le début d’une tâche AVANT toute modification non validée.
python3 docs/checkpoint.py --checkpoint --day 2 --current D06 \
  --detail "Les sources sont encore validées ; D06 va commencer." --next T05

# À la clôture réelle d’une journée, quand aucune tâche n’est en cours.
python3 docs/checkpoint.py --close-day --day 2 --current '' --next T05 \
  --detail "Bilan de la journée validé ; poursuivre le Jour 3."
```

Ces commandes décrivent le fonctionnement ; ne pas rejouer une tâche déjà terminée. Les preuves doivent correspondre aux sources réellement testées. **Même `--checkpoint` archive tout le dossier** : pendant une modification non validée, actualiser seulement `POINT_DE_REPRISE.md` et `docs/checkpoint.json` sans cette commande, puis attendre les tests pour publier. Le ZIP courant est `/workspace/artifacts/Forge-Actuel.zip` dans cet environnement ; `--output` permet de changer le dossier de livraison hors du projet. Son fichier `.sha256` et le manifeste inclus vérifient l’intégrité. `Forge-Jour-N.zip` est créé à la clôture et n’est jamais écrasé. Le Jour 1 reste récupérable dans son archive d’origine.

En cas de coupure pendant la publication, `docs/.checkpoint-pending.json` conserve les informations nécessaires. Après inspection, `python3 docs/checkpoint.py --recover` termine cette publication sans refaire la tâche. Si les sources ont changé entre-temps, le mécanisme refuse de les écraser et indique le fichier à examiner.

Les 20 contrôles de P05 sont décrits dans `tests/resultats-checkpoint.json`. Pour les rejouer : `python3 tests/checkpoint-smoke.py` ; ils travaillent sur des copies temporaires et n’écrivent pas le vrai ZIP courant.

## Mettre à jour le suivi quotidien

À chaque nouvelle journée : relire la feuille de route, sélectionner deux ou trois tâches utiles, les attribuer, réaliser, tester puis consigner la livraison. Mettre à jour les statuts et les jours de fin dans `docs/roadmap.json`, puis exécuter :

```bash
python3 docs/build_progress.py
```

Pour régénérer l’aperçu autonome après une modification du site : `python3 preview/build-standalone.py`.

La commande de suivi régénère **`FEUILLE_DE_ROUTE.md` et `AVANCEMENT.html`** à partir de la même liste. Le pourcentage est le nombre de tâches terminées divisé par le nombre total, arrondi à l’entier ; les tâches en cours ne donnent aucun crédit partiel. Une nouvelle tâche augmente le dénominateur. Le README, le journal et le rapport de tests doivent rester cohérents avec ces chiffres.

Avant de commencer la journée suivante, livrer son ZIP validé avec le message de clôture : avancement global et par agent, tâches terminées/en cours/restantes, blocages, résumé des changements, liens du journal et d’`AVANCEMENT.html`, puis les trois améliorations prévues. Si le dossier de travail contient une tâche encore non validée, actualiser le point de reprise sans publier ce code : le ZIP courant doit rester la dernière version testée.

Voir aussi [`INVENTAIRE.md`](INVENTAIRE.md), [`JOURNAL_JOUR_1.md`](JOURNAL_JOUR_1.md) et [`CHANGELOG.md`](CHANGELOG.md). Le mode continu remplace l’attente de « jour suivant ». Chaque tâche testée déclenche un checkpoint ; chaque journée clôturée conserve son ZIP indépendant. Les tâches bloquées restent visibles et non terminées.
