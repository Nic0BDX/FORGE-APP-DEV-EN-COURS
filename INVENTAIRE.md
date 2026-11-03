# Forge — Inventaire du projet et état des fonctions

**Audit du Jour 1 · 26 octobre 2026 · Responsable : Chef de projet**

## Provenance et structure

Le fichier fourni `Forge-fitness-main (1).zip` contient un README et une seconde archive `forge-project.zip`. Cette archive contient `forge-dashboard/`, soit **48 fichiers de projet**. Les deux README principaux ont été lus intégralement ; leur ancienne direction noir/rouge est traitée comme un constat historique, pas comme une consigne de design. Le projet existant a été importé dans le dépôt fourni, sans réécriture de l’architecture.

Architecture : HTML/CSS/JavaScript sans framework, scripts classiques globaux chargés dans un ordre explicite. Aucune compilation ni installation de dépendances n’est nécessaire pour utiliser le site. Les comptes et carnets sont locaux à un navigateur. Les vues définies dans `router.js` sont parfois remplacées par `screens.js` et `ai.js` ; cet ordre explique plusieurs fonctions masquées dans le ZIP.

```text
index.html                 Application
css/                       Styles historiques + nouvelle direction du Jour 1
js/core/                   Données, compte, navigation, rendu
js/data/                   Avatars et catalogue local
js/features/               Fonctions métier conservées
assets/                    Icône et illustrations
preview/                   Aperçu interactif distinct
docs/                      Contenu et source du suivi
tests/                     Vérifications automatisées
AVANCEMENT.html            Tableau de bord du propriétaire
```

## Tous les fichiers du ZIP, un par un

Les états ci-dessous décrivent **la version reçue**, pas des défauts encore forcément présents. La colonne « Livraison » distingue les fichiers modifiés de ceux conservés au moment de ce relevé. « Présent » ne signifie pas « testé exhaustivement ». Les résultats après refonte figurent dans `TESTS_JOUR_1.md`.

| Fichier | Rôle | État initial observé | Livraison |
|---|---|---|---|
| `.gitignore` | Exclusions Git des fichiers locaux et système. | Configuration, aucun exécutable. | Conservé |
| `CHANGELOG.md` | Historique des versions et des refontes. | Documentation initiale du thème noir/rouge, conservée comme historique. | Modifié J1 |
| `README.md` | Présentation, lancement, fonctions et limites du projet. | Lu intégralement ; décrit une app locale et des services non raccordés. | Modifié J1 |
| `assets/icons/favicon.svg` | Icône de l’onglet du navigateur. | Icône d’origine rouge. | Modifié J1 |
| `assets/images/.gitkeep` | Conserve le dossier images dans Git. | Fichier vide intentionnel. | Conservé |
| `assets/images/README.md` | Convention de nommage des visuels. | Décrit trois photos absentes de l’archive. | Modifié J1 |
| `assets/images/athlete-fallback.svg` | Illustration de remplacement quand une photo manque. | Seul visuel sportif local livré dans le ZIP. | Modifié J1 |
| `css/base.css` | Fondations, grilles, formulaires, modales et responsive historique. | Styles actifs puis surchargés par les couches suivantes. | Conservé |
| `css/forge-elite.css` | Dernière direction artistique du ZIP : auth, accueil, séances, photos, animations. | Sombre imposé : clair et sombre ont le même fond au test initial ; débordements à 320 px. | Modifié J1 |
| `css/home.css` | Styles historiques du tableau de bord personnel. | Styles superposés aux nouvelles classes d’accueil. | Conservé |
| `css/library.css` | Bibliothèque d’exercices, repas et programmes recommandés. | Composants conservés. | Conservé |
| `css/monochrome.css` | Ancienne couche monochrome et ajustements de navigation. | Couche historique toujours chargée. | Conservé |
| `css/reference.css` | Présentation des écrans de référence et listes spécialisées. | Couche historique toujours chargée. | Conservé |
| `index.html` | Point d’entrée ; conteneurs app/toast/modale et ordre des scripts globaux. | App chargeable ; police Google externe indisponible dans le test initial. | Modifié J1 |
| `js/app.js` | Démarre le rendu et l’introduction animée. | Animation initiale présente ; reste un script classique. | Modifié J1 |
| `js/core/auth.js` | Inscription locale, connexion, mot de passe, avatars et récupération par code. | Parcours de base et récupération passent ; changement d’avatar efface les champs ; texte de pseudo-vérification d’identité trompeur. | Modifié J1 |
| `js/core/default-db.js` | Modèle initial du carnet, profil, aliments, habitudes et réglages. | Thème sombre par défaut ; deux déclarations goals identiques sans impact apparent. | Modifié J1 |
| `js/core/gamification.js` | XP, niveaux et série de séances. | Logique locale conservée ; distincte des jours de connexion. | Conservé |
| `js/core/layout.js` | Icônes SVG, photos, coque, navigation ordinateur/mobile et thème. | Mobile limité aux raccourcis ; fonction de thème présente mais effet masqué par le CSS. | Modifié J1 |
| `js/core/router.js` | Table des vues et rendu principal authentifié ou public. | Les écrans supplémentaires redéfinissent ensuite certaines entrées. | Modifié J1 |
| `js/core/state.js` | État global du carnet, écran courant, séance et mode de connexion. | État en mémoire ; rechargement d’une séance en cours à fiabiliser. | Modifié J1 |
| `js/core/storage.js` | Chargement et sauvegarde du carnet local. | Fusion initiale superficielle ; pas de validation complète des imports ou du schéma. | Modifié J1 |
| `js/core/streak.js` | Jours de présence, paliers, badges, calendrier d’activité et notifications locales. | Fonctions locales ; ne représente pas une mesure de forme physique. | Conservé |
| `js/core/ui.js` | Toasts et ouvertures/fermetures de modales. | Affichage utilisé par les parcours ; gestion complète du focus non auditée au départ. | Conservé |
| `js/core/utils.js` | Clés de stockage, identifiants, échappement HTML et dates. | Dates du jour calculées en UTC ; comportement aux changements de jour à approfondir. | Conservé |
| `js/data/avatars.js` | Liste des avatars proposés à l’inscription. | URLs Unsplash indisponibles dans les essais réseau initiaux. | Modifié J1 |
| `js/data/catalog.js` | Catalogue d’exercices, modèles de séances et exemples de repas. | Données embarquées ; ne contient pas la base complète externe annoncée. | Conservé |
| `js/features/ai.js` | Coach/Analyse IA de démonstration, calendrier navigable, photo hebdo, avant/après. | IA non connectée, conseils arbitraires et bloc nutrition dupliqué ; calendrier et comparaison deux photos passent ; hooks async non gérés. | Modifié J1 |
| `js/features/calendar.js` | Premier calendrier et grille du mois. | Vue historique remplacée au routage par calendarPage dans ai.js. | Conservé |
| `js/features/community.js` | Vitrine communauté et rappel du profil. | Pas de partage ou de réseau social connecté. | Conservé |
| `js/features/exercises.js` | Recherche et filtres d’exercices, détail, ajout à une séance, modèles. | Actions locales présentes ; démonstrations vidéo dépendent de YouTube et ne sont pas validées. | Conservé |
| `js/features/goals.js` | Création, suivi et suppression d’objectifs. | Présent dans le code et le routage ; essais approfondis reportés. | Conservé |
| `js/features/habits.js` | Habitudes, suivi quotidien, sommeil et eau. | Fonctions locales présentes ; saisies limites à auditer. | Conservé |
| `js/features/history.js` | Liste des séances enregistrées et détail de séries. | Alimenté après validation d’une séance. | Conservé |
| `js/features/home.js` | Accueil personnel : prochaine séance, semaine, graphiques, macros, habitudes, records. | Alimente les vues depuis le carnet ; couleurs rouges codées dans certains graphiques. | Modifié J1 |
| `js/features/nutrition.js` | Journal, aliments, macros, ajout/suppression de repas et hydratation. | Ajout de repas et calcul passent ; fonctions conservées derrière écran spécialisé. | Modifié J1 |
| `js/features/photos.js` | Import/redimensionnement/suppression des photos et rappels hebdomadaires. | Import de deux photos passe via Souvenirs ; extension de progression remplacée au routage. | Conservé |
| `js/features/profile.js` | Profil, statistiques, badges et accès aux paramètres. | Profil présent ; aucune offre Premium dans le ZIP. | Modifié J1 |
| `js/features/progress.js` | Poids, records, XP et fonctions de tracé canvas. | Vue remplacée par progressPage ; fonctions de poids et de dessin toujours utilisées. | Modifié J1 |
| `js/features/reminders.js` | Vérification périodique des rappels whey et photo. | Nécessite permission, navigateur compatible et app ouverte ; pas de notification push serveur. | Conservé |
| `js/features/screens.js` | Vues spécialisées : aperçu de séance, programmes, progression, nutrition, souvenirs et cartes accueil. | Vues globalement accessibles ; redéfinitions masquent whey, débordement nutrition ; légende accueil non échappée dans le code initial. | Modifié J1 |
| `js/features/settings.js` | Modification profil/objectifs, export/import JSON, déconnexion et effacement. | Export et rechargement passent ; import sans validation de schéma, effacement du compte incomplet dans le code initial. | Modifié J1 |
| `js/features/setup.js` | Configuration initiale : nom, objectif, niveau, fréquence. | Fonctionne, mais le prénom d’inscription n’est pas prérempli initialement. | Modifié J1 |
| `js/features/whey.js` | Réglage des rappels whey et journalisation d’une portion. | Extension de nutrition() masquée par le remplacement de pages.nutrition ; fonctions toujours présentes. | Modifié J1 |
| `js/features/workouts.js` | Programmes, éditeur, séries/charges/RPE, minuteur, résumé et historique enregistré. | Parcours programme→série→repos→fin passe ; barre de repos déborde à 320 px ; brouillon non persistant. | Conservé |
| `preview/phone.css` | Habillage du cadre téléphone historique. | Style décoratif ancien. | Modifié J1 |
| `preview/phone.html` | Page de présentation mobile du site dans une iframe. | Ancien cadre téléphone ; pas une galerie de plusieurs écrans. | Modifié J1 |
| `preview/phone.js` | Mise à l’échelle, horloge, rechargement et fond du cadre. | Commandes du cadre ; aucune isolation de données de démonstration. | Modifié J1 |

## Ce qui fonctionnait déjà et a été conservé

Le test initial Chromium a exécuté **26 assertions : 22 réussies, 4 échouées**, avec **264 états de rendu** (22 routes × 6 largeurs × 2 thèmes). Il a constaté **11 états avec débordement horizontal**. Aucune exception JavaScript non interceptée n’a été observée dans cette campagne.

- Inscription locale, code de récupération, refus d’un mauvais mot de passe, réinitialisation et connexion.
- Configuration du profil ; installation d’une séance recommandée et aperçu.
- Saisie et validation d’une série, repos, pause, ajout de 15 secondes, fin de séance et calcul du volume.
- Ajout d’un repas et calcul des macronutriments.
- Import de deux photos, filtre des souvenirs et comparaison avant/après.
- Navigation du calendrier et présence de la séance enregistrée.
- Export JSON, rechargement des données et déconnexion.

Ces essais de parcours sont représentatifs ; ils ne certifient pas toutes les valeurs limites, tous les navigateurs ni les services externes.

## Défauts de départ et traitement Jour 1

| Constat confirmé | Traitement prévu / livré | Suivi |
|---|---|---|
| Changer d’avatar efface le formulaire ; prénom non repris à la configuration | Correction JavaScript et tests de régression | D01, D02, T03 |
| Clair et sombre ont le même fond noir ; débordements à petite largeur | Nouveau thème clair, vrai sombre et corrections responsive | U02, D02, T02 |
| Whey et rappels photo masqués par des remplacements de vues | Rendre les contrôles accessibles dans les pages actives | D01, T03 |
| Photos décoratives absentes ; avatars et police dépendent du réseau | Illustrations/avatars locaux et police système | U02, D02 |
| Aucune entrée Premium dans le ZIP | Présentation explicite « en préparation », sans faux achat | D03 |
| Exemples IA présentés comme une analyse ; bloc nutrition dupliqué | Textes neutres, état non connecté visible, suppression du doublon | C02, D01 |
| Légende photo non échappée ; données du compte et effacement fragiles | Échappement, restauration du compte et effacement local corrigés ; import avancé à poursuivre | D01, D06 |

## Incomplet ou non validé à la fin du Jour 1

- **Comptes** : authentification locale seulement ; pas de synchronisation, serveur, Apple ou Google OAuth. Le hachage SHA-256 avec sel n’équivaut pas à un service de compte sécurisé pour la production.
- **Coach IA** : écrans conservés comme aperçu ; pas de conversation réelle ni d’analyse personnalisée. Le hook pouvant renvoyer une promesse nécessite encore une gestion explicite.
- **Premium** : pas de tarification, facturation ou abonnement effectif. La présentation n’active aucun droit payant.
- **Communauté** : vitrine locale, sans partage entre utilisateurs.
- **Séance en cours** : pas encore de brouillon robuste restauré après interruption/rechargement (D05).
- **Import/export** : export présent ; validation complète du schéma, fichiers invalides et migrations restent à traiter (D06, T05).
- **Photos et mesures** : comparaison des premières/dernières photos ; choix de deux images et cohérence des périodes restent à améliorer (D07).
- **Calendrier** : historique navigable des séances enregistrées ; pas un agenda de réservation. Mélange de dates UTC/locales à vérifier aux changements de jour (D07).
- **Caméra, notifications et vidéos externes** : nécessitent des essais réels sur les appareils ciblés ; une ouverture de sélecteur de fichier ou de permission ne prouve pas une capture/notification mobile réussie (T04).

Aucune de ces limites n’est masquée par un écran simulant un service opérationnel. Les capacités de départ restent dans le projet ; les extensions non raccordées sont indiquées comme telles.

## Tous les fichiers ajoutés au Jour 1

La livraison contient **74 fichiers** : les **48 fichiers d’origine conservés** et **26 fichiers ajoutés**. Cette liste exclut seulement les métadonnées Git et l’archive ZIP de livraison, située en dehors du projet. Aucun fichier applicatif initial n’a été supprimé.

| Nouveau fichier | Rôle |
|---|---|
| `APERCU.html` | Aperçu autonome généré : galerie de trois écrans, styles/scripts/visuels intégrés ; données de démonstration isolées. |
| `AVANCEMENT.html` | Tableau de bord autonome du propriétaire : progression globale, cinq agents, tâches, filtres et prochaines étapes. |
| `FEUILLE_DE_ROUTE.md` | Feuille attribuée : 28 tâches, priorités, statuts et jours de fin ; générée depuis roadmap.json. |
| `INVENTAIRE.md` | Ce document : provenance, rôle de chaque fichier, défauts initiaux et limites restantes. |
| `JOURNAL_JOUR_1.md` | Bilan de la journée, réalisations par agent, preuves, progression et idées du lendemain. |
| `TESTS_JOUR_1.md` | Rapport du testeur : méthode, contrôles exécutés, matrice des écrans, limites et relance. |
| `assets/images/hero-auth.svg` | Illustration originale locale pour l’accueil public et les formulaires. |
| `assets/images/hero-summary.svg` | Illustration originale locale pour le résumé de séance. |
| `assets/images/hero-today.svg` | Illustration originale locale pour la séance à venir et son aperçu. |
| `docs/CONTENU_ET_IDEES.md` | Charte de ton, microtextes, audit éditorial et trois propositions pour le Jour 2. |
| `docs/DESIGN.md` | Direction artistique, palette, composants, accessibilité visuelle et périmètre du design. |
| `docs/build_progress.py` | Générateur Python standard de FEUILLE_DE_ROUTE.md et AVANCEMENT.html ; vérifie les identifiants/statuts. |
| `docs/roadmap.json` | Source unique des tâches, responsables, statuts, jours de fin et calculs d’avancement. |
| `preview/build-standalone.py` | Génère APERCU.html à partir de la galerie source et des ressources applicatives intégrées. |
| `preview/demo-data.js` | Jeu de démonstration étiqueté et commandes d’aperçu réutilisant les vraies vues applicatives. |
| `preview/demo-store.js` | Stockage uniquement en mémoire dans chaque écran de démonstration ; protège les comptes réels. |
| `preview/demo.html` | Point d’entrée des écrans démontrés, avec les scripts et styles existants de l’application. |
| `tests/captures/accueil-personnalise.png` | Capture réelle Chromium de l’accueil personnel final à 390 px. |
| `tests/captures/accueil-public.png` | Capture réelle Chromium de l’accueil public final à 390 px. |
| `tests/captures/nutrition.png` | Capture réelle Chromium du journal alimentaire final à 390 px. |
| `tests/captures/seance.png` | Capture réelle Chromium de la séance active finale à 390 px. |
| `tests/mobile-smoke.cjs` | Scénario Playwright reproductible : compte, séance, nutrition, photos, données et matrice mobile. |
| `tests/preview-smoke.cjs` | Scénario Playwright : galerie, interactions, thèmes, isolation et aperçu autonome. |
| `tests/resultats-apercu.json` | Preuve brute des 22 contrôles d’aperçu réussis et de l’essai file:// non exécuté. |
| `tests/resultats-dashboard-jour1.json` | Preuve des 12 contrôles du suivi : calculs, filtres, rendu mobile et erreurs JavaScript. |
| `tests/resultats-jour1.json` | Preuve brute de la campagne applicative finale : 33 assertions réussies, 318 états, aucun débordement. |

## Bilan vérifié après refonte

- Application : **33/33 assertions réussies**, **318 états**, aucun débordement, aucune exception JavaScript dans la campagne finale.
- Aperçus : **22 vérifications réussies**, dont le rendu autonome sans réseau et l’isolation du stockage ; **1 essai non exécuté** (ouverture directe file:// interdite par le navigateur géré).
- Tableau de bord : **12/12 vérifications réussies**, calculs et filtres cohérents, aucun débordement aux largeurs contrôlées de 320 à 1440 px.
- Les comptes serveur, OAuth, l’IA réelle, la communauté connectée et le paiement Premium restent non intégrés ; les appareils physiques et permissions système restent à tester.

Les chiffres d’avancement sont distincts des chiffres de tests. À la clôture du Jour 1 : **15/28 = 54 %**. L’état courant, dont le dénominateur évolue avec les nouvelles tâches, vient de `docs/roadmap.json` et du tableau de bord.

## Ajouts du mode continu — Jour 2

Les éléments ci-dessous prolongent l’inventaire historique du Jour 1. Un fichier de test préparé ne constitue pas une validation exécutée ; seuls les rapports explicitement datés et réussis font preuve.

| Fichier ajouté | Rôle et état au checkpoint P05 |
|---|---|
| `POINT_DE_REPRISE.md` | Point de reprise lisible : jour, tâches terminées, état exact, prochaine action et archives. |
| `docs/checkpoint.py` | Automatisation testée sur copie : preuves, documents synchronisés, ZIP vérifié et reprise de publication interrompue. |
| `docs/checkpoint.json` | État structuré et historique des checkpoints ; les tâches restent définies dans roadmap.json. |
| `JOURNAL_JOUR_2.md` | Journal append-only des tâches vérifiées et points de progression de la deuxième journée. |
| `tests/checkpoint-smoke.py` | 20 contrôles d’intégration du mécanisme sur dossiers temporaires, sans modifier les vrais comptes ou archives. |
| `tests/resultats-checkpoint.json` | Résultat P05 : 20 réussis, aucun échec. |
| `docs/AUDIT_CONTENU.md` | Relecture préparatoire C03 : observations éditoriales, propositions exactes et limites à intégrer puis vérifier. |
| `tests/PLAN_RESILIENCE.md` | Plan de couverture D05, D06 et T05 ; chaque essai attend son exécution réelle. |
| `tests/resilience-smoke.cjs` | Tests navigateur de reprise et sauvegardes, préparés avant l’implémentation ; ne pas les considérer réussis sans rapport. |

Le manifeste `ARCHIVE_MANIFEST.json` est ajouté uniquement à l’intérieur des ZIP du mode continu. Il énumère les fichiers et leurs empreintes SHA-256. Les verrous, marqueurs temporaires, caches Python et métadonnées Git ne sont pas des fichiers applicatifs livrés.

## Mise à jour D05 — reprise de séance livrée

Le défaut de brouillon non persistant décrit dans l’inventaire **d’origine/Jour 1** est résolu par D05. Les six fichiers suivants ont été modifiés au Jour 2 ; leurs fonctions existantes restent présentes :

| Fichier | Évolution D05 |
|---|---|
| `js/features/workouts.js` | Écriture/lecture du brouillon par compte, reprise explicite, validations de séries, repos persistant, prévention des doublons et gestion d’erreur de sauvegarde. |
| `js/core/storage.js` | Enregistrement cohérent du carnet utilisé par la finalisation ; échec traité sans fausse confirmation. |
| `js/core/layout.js` | Carte de reprise dans la coque, accessible depuis le carnet. |
| `js/core/auth.js` | Traitement du brouillon lors de la déconnexion, sans confondre les comptes. |
| `js/features/settings.js` | Nettoyage du brouillon du compte lors de l’effacement de son carnet. |
| `js/app.js` | Initialisation du mécanisme de reprise au lancement. |

Fichiers de preuve ajoutés depuis le checkpoint P05 :

| Fichier | Rôle |
|---|---|
| `TESTS_JOUR_2.md` | Rapport vivant du Jour 2 : D05 vérifiée, D06 distinguée comme non exécutée tant que sa campagne n’est pas livrée. |
| `tests/resultats-d05.json` | 49 contrôles ciblés de reprise, isolation des comptes, valeurs et erreurs de stockage. |
| `tests/resultats-regression-d05.json` | 33 contrôles applicatifs sur 318 états après D05. |
| `tests/resultats-apercu-d05.json` | 22 contrôles d’aperçu après D05 et ouverture file:// non exécutée. |
| `tests/captures-jour2/d05-carte-reprise.png` | Capture navigateur de la carte de reprise. |
| `tests/captures-jour2/d05-choix-brouillon.png` | Capture du choix empêchant l’écrasement d’une séance. |
| `tests/captures-jour2/d05-seance-reprise.png` | Capture de la séance restaurée. |
| `docs/PROCHAINE_FEUILLE_BROUILLON.md` | 17 propositions préparatoires, non activées et non comptées dans les pourcentages ; aucun blocage actuel déclaré terminé. |

Les brouillons actifs sont stockés dans une clé distincte par compte et restent hors de l’export JSON du carnet. Les essais physiques, les cas supplémentaires T05 et l’import D06 gardent leur état distinct dans la feuille de route et le rapport de tests.

## Mise à jour D06 — sauvegardes et récupération validées

Le diagnostic d’import incomplet au **Jour 1** reste conservé comme historique ci-dessus. D06 apporte la validation et les parcours de récupération ; T05 conserve sa campagne complémentaire, sans compter deux fois les essais déjà exécutés.

| Fichier modifié depuis le checkpoint D05 | Rôle de l’évolution D06 |
|---|---|
| `js/core/storage.js` | Schéma profond versionné, contrôle des dates/nombres/images et limites de taille, migration des champs absents, préservation des champs supplémentaires sûrs, lecture protégée et écriture canonique du compte. |
| `js/core/auth.js` | Connexion vers la récupération si le carnet est illisible, protection à la déconnexion et limite de longueur du prénom enregistré. |
| `js/core/router.js` | Présentation de la récupération avant les écritures automatiques de présence ou les vues du carnet. |
| `js/features/settings.js` | Export versionné, récupération brute, aperçu/confirmation d’import, annulation sans perte, effacement limité au compte et réglages validés avant écriture. |
| `js/features/workouts.js` | Alignement des valeurs de programme/séries avec le format ; protection des brouillons lors d’import/effacement et possibilité d’en créer un nouveau ensuite. |
| `js/features/setup.js` | Première configuration validée avant écriture, sans enregistrer un carnet incompatible. |
| `js/features/nutrition.js` | Refus des quantités de repas non finies ou non positives avant enregistrement. |
| `js/features/progress.js` | Refus d’un poids non fini ou non positif. |
| `js/features/habits.js` | Bornes minimales sur le sommeil et ses notes, XP d’habitude entiers non négatifs. |
| `js/features/goals.js` | Valeurs finies non négatives et cible strictement positive. Le calcul des objectifs décroissants reste à améliorer séparément. |
| `js/features/ai.js` | Avatar affiché via le traitement partagé ; aucune connexion IA ajoutée. |

Ces contrôles d’entrée évitent de créer des données que le lecteur ne pourrait pas rouvrir. Ils ne déclarent pas terminée la proposition future de validation exhaustive B02. Aucune fonctionnalité d’origine n’est retirée.

| Fichier de preuve ou de suivi ajouté | Rôle |
|---|---|
| `tests/resultats-d06.json` | 70 contrôles ciblés réussis : refus de fichiers, migration, aperçu/annulation, erreurs de stockage, changement de compte, récupération brute et reprise après remplacement. |
| `tests/resultats-regression-d06.json` | 33 contrôles réussis, 318 états de rendu ; aucun débordement horizontal ni erreur JavaScript mesuré. |
| `tests/resultats-apercu-d06.json` | 22 contrôles réussis ; un contrôle d’ouverture directe non exécuté du fait du navigateur géré. |
| `tests/captures-jour2/d06-confirmation-import.png` | Capture réelle de l’aperçu et de la confirmation d’import. |
| `tests/captures-jour2/d06-recuperation-json.png` | Capture du panneau de récupération d’un JSON local illisible. |
| `tests/captures-jour2/d06-recuperation-schema.png` | Capture de récupération d’un carnet dont le JSON est lisible mais les données invalides. |
| `docs/PROCHAINE_FEUILLE_BROUILLON.md` | Dix-sept propositions pour un prochain cycle ; elles restent hors de la feuille active et de ses pourcentages. |

`tests/resilience-smoke.cjs`, `tests/mobile-smoke.cjs` et `TESTS_JOUR_2.md` ont été actualisés pour ces parcours. `APERCU.html` a été régénéré à partir des sources et vérifié. Les essais restent des essais Chromium avec comptes fictifs ; les appareils physiques et services distants conservent leurs blocages explicites.

## Ajouts du Jour 3 — T05 vérifiée

Aucun fichier applicatif n’a changé pour T05. Les ajouts rendent reproductibles des contrôles de continuité non exécutés au Jour 2.

| Fichier ajouté | Rôle |
|---|---|
| `JOURNAL_JOUR_3.md` | Plan T05 → D07 → U03, résultats et checkpoints de la journée ; prévisions du Jour 4. |
| `TESTS_JOUR_3.md` | Rapport : T05 30/30, portée exacte et limites ; D07/U03 encore non exécutées à cette étape. |
| `tests/continuity-smoke.cjs` | Deux processus Chromium successifs avec profil temporaire conservé, repos expiré, brouillons invalides et compatibilité historique. |
| `tests/resultats-t05.json` | Preuve des 30 contrôles réussis, aucune exception JavaScript ni ressource en échec. |
| `tests/fixtures/legacy-carnet-zip.json` | Carnet synthétique au schéma historique ; aucune donnée d’utilisateur réel. |
| `tests/fixtures/README.md` | Provenance, empreinte du schéma original et limites de la fixture. |
| `tests/captures-jour3/t05-reprise-redemarrage.png` | Capture du parcours de reprise après la relance réelle du navigateur. |

La fermeture du navigateur est propre : cette campagne ne prouve pas la résistance à une panne matérielle ou à une extinction forcée du système. Les appareils physiques restent un blocage distinct.

## Mise à jour D07 — comparaison et calendrier vérifiés

| Fichier modifié | Évolution |
|---|---|
| `js/features/ai.js` | Vues actives Avant / Après et Calendrier : sélection distincte/ordonnée des photos, choix isolé en mémoire par compte, dates de poids et mesures, volume de période, sélection mois/jour et liste filtrée. Aucun fournisseur IA ajouté ni nouvelle écriture de carnet. |
| `preview/phone.html` | Entrée Avant / Après ajoutée au choix du troisième écran de la galerie. |
| `preview/demo-data.js` | Route Avant / Après autorisée dans la démonstration, sans données photo ajoutées. |
| `preview/build-standalone.py` | Route autorisée pour la version autonome générée. |
| `APERCU.html` | Version autonome régénérée à partir des sources D07 et vérifiée. |

| Fichier ajouté | Rôle |
|---|---|
| `tests/d07-smoke.cjs` | Scénarios de choix des photos, mesures datées, filtres calendaires, isolation et rendu mobile. |
| `tests/d07-captions.cjs` | Mesures supplémentaires des légendes claires/sombres à 320 px. |
| `tests/resultats-d07.json` | 42 contrôles réussis, dont 12 états de rendu ; aucune erreur JavaScript dans la campagne. |
| `tests/resultats-d07-legendes.json` | 7 contrôles de légendes réussis ; texte non rogné. |
| `tests/resultats-apercu-d07.json` | 22 contrôles d’aperçu réussis et un essai `file://` non exécuté. |
| `tests/captures-jour3/d07-comparaison.png` | Capture réelle du choix et des données de comparaison. |
| `tests/captures-jour3/d07-calendrier.png` | Capture de la période et de la liste de séances. |
| `tests/captures-jour3/d07-legendes-light-320.png` | Légendes à 320 px en clair. |
| `tests/captures-jour3/d07-legendes-dark-320.png` | Légendes à 320 px en sombre. |

La sélection des photos n’est pas persistée après rechargement. Les dates de photo sont les dates enregistrées, sans lecture EXIF revendiquée. Les utilitaires globaux de dates restent un sujet distinct (brouillon B01). À 320 px, les légendes restent lisibles mais recouvrent encore une part importante de la photo : U03 doit affiner cette présentation. Les 318 états de non-régression seront rejoués après U03, pas comptés comme un test D07 déjà exécuté.

## Mise à jour U03 — lisibilité des écrans spécialisés validée

Les légendes superposées signalées au checkpoint D07 sont désormais sous les images, entièrement affichées. Les catégories et boutons de suppression des souvenirs ne se chevauchent plus. Les données et actions existantes sont conservées.

| Fichier modifié | Évolution |
|---|---|
| `css/forge-elite.css` | Grilles de souvenirs et de nutrition, images entières et légendes en flux, sélecteurs, états vides et ligne tactile whey de 44 px. |
| `js/features/whey.js` | Label englobant de la case de rappel et associations des champs de portion/horaires ; aucune logique de rappel modifiée. |
| `docs/DESIGN.md` | Décisions U03, comportement sur petit écran et portée du contrôle whey. |
| `APERCU.html` | Aperçu autonome régénéré et vérifié après le dernier correctif. |
| `docs/build_progress.py` | Affiche les étapes ordonnées U04 issues de la feuille de route sans les compter comme tâches supplémentaires. |

| Fichier ajouté | Rôle |
|---|---|
| `tests/u03-smoke.cjs` | Longues listes, clics mobiles, absence de chevauchement, cinq états vides, légendes sous images et contrôle du rappel whey. |
| `tests/resultats-u03.json` | 47 contrôles ciblés réussis sur la version finale ; aucune exception JavaScript ni ressource en échec. |
| `tests/resultats-regression-u03.json` | 33 contrôles sur 318 états réussis après les styles principaux et avant le dernier correctif du label whey. |
| `tests/resultats-apercu-u03.json` | 22 contrôles réussis après le correctif final ; un essai `file://` non exécuté. |
| `tests/captures-jour3/u03-souvenir-actions-320.png` | Actions des souvenirs séparées à 320 px. |
| `tests/captures-jour3/u03-nutrition-320.png` | Noms longs et macros conservés dans les cartes à 320 px. |
| `tests/captures-jour3/u03-comparaison-320.png` | Photos entières et légendes en dessous à 320 px. |

Les 47 contrôles finaux testent notamment le clic au bord du label whey et l’enregistrement de ce choix. Le calendrier et la comparaison D07 sont couverts par les états spécialisés. Les tests clavier et contrastes avancés relèvent de l’étape suivante U04 ; les essais physiques restent bloqués.

## Préparation du Jour 4 — sans clôture anticipée

| Fichier ajouté | Rôle et état |
|---|---|
| `JOURNAL_JOUR_4.md` | Plan attribué C03 → U04 → P04 et checkpoints du Jour 4. |
| `docs/REVUE_COUVERTURE.md` | Brouillon de P04 : matrice des fonctions demandées et des preuves du Jour 3, 48 fichiers d’origine conservés, limites et cinq blocages. La décision attend C03/U04 ; ce document ne termine aucune tâche. |

## Ajouts et modifications de l’étape vidéo — Jour 4

- `js/features/video-forge.js` : coque et routes adaptées, accents, recherche, graphiques, relevés pas/pouls ; conserve les fonctions précédentes.
- `css/video-forge.css` : noir/verre/citron, sept accents, grilles, responsive et animations.
- `js/core/default-db.js`, `js/core/storage.js` : thème sombre par défaut et validation des nouveaux relevés.
- `js/core/auth.js` : wordmark forge. et icône f.
- `index.html`, `preview/demo.html`, `preview/demo-data.js`, `preview/phone.html`, `preview/phone.css`, `preview/build-standalone.py`, `APERCU.html` : chargement, démo isolée, aperçu complet autonome et galerie conservée.
- `tests/video-smoke.cjs`, `tests/preview-smoke.cjs`, `tests/resultats-*video*.json`, `tests/captures-video/` : nouvelles vérifications et captures.
- `docs/REFERENCE_VIDEO.md`, `docs/COMPARAISON_VIDEO.md`, `TESTS_VIDEO.md` : observation, écarts et preuves.
- `docs/checkpoint.py`, `docs/build_progress.py` : respect de la pause demandée dans les documents générés.

Les corrections éditoriales C03 déjà écrites sont incluses et passent les parcours de régression, mais la relecture finale complète reste à terminer. Voir `docs/AUDIT_CONTENU.md`.

## Mission accueil animé — ajouts validés

- `assets/images/forge-body.png` : corps original en transparence ; `forge-body-overlay.svg` : tracés des pectoraux et contours.
- `js/features/home-video.js` : composition de l’accueil, calque inline, animation/pause, anneaux d’activité et carte des pas ; remplace seulement la présentation ciblée.
- `css/home-video.css` : proportions de la vidéo, cartes, responsive, lumière pectorale et réduction d’animations.
- `js/features/activity.js` : six relevés manuels facultatifs, formulaire, périodes et absence distincte de zéro.
- `js/core/default-db.js` et `storage.js` : migration, bornes de validation et préférence d’animation.
- `preview/demo-data.js` : démonstration isolée d’activité ; `build-standalone.py` : PNG embarqué et ordre déterministe des ressources.
- `tests/activity-data.cjs`, `home-video-smoke.cjs`, rapports `resultats-accueil-*.json`, `resultats-activite-donnees.json` et `tests/captures-accueil/` : preuves de la mission.
- `docs/PLAN_ACCUEIL_VIDEO.md`, `docs/BILAN_ACCUEIL.md`, `TESTS_ACCUEIL.md` : répartition, bilan et validation.
- `LICENSE` : licence ajoutée sur GitHub par le propriétaire, conservée lors de la synchronisation.
