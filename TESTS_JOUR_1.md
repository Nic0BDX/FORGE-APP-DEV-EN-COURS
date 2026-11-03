# Forge — Rapport de vérification, Jour 1

Responsable : **Testeur mobile**. Date : **26 octobre 2026**.

## Résultat constaté

**33 contrôles navigateur réussis sur 33 ; aucun échec.** La matrice contient **318 états d’écran**, avec **0 débordement horizontal**, **0 exception JavaScript**, **0 requête échouée** et **0 bouton mobile mesuré inférieur à 44 × 44 px** dans les états inspectés.

Ces chiffres concernent l’application existante améliorée, servie en HTTP local. Ils ne constituent pas une validation de services distants : aucun serveur d’authentification, aucune IA connectée ni aucun paiement ne sont présents.

Preuve détaillée : [tests/resultats-jour1.json](tests/resultats-jour1.json). Scénario reproductible : [tests/mobile-smoke.cjs](tests/mobile-smoke.cjs).

## Méthode et périmètre

- Navigateur réellement exécuté : **Chromium 154.0.8037.57**, piloté par Playwright, contexte neuf pour chaque passage.
- Dimensions : **320 × 568**, **375 × 844**, **390 × 844**, **430 × 844**, **768 × 844**, **1440 × 844**. Les vues applicatives principales sont contrôlées dans les deux thèmes ; les formulaires publics/configuration sont contrôlés dans le thème de leur parcours.
- Compte fictif créé via l’interface ; aucun compte ni stockage utilisateur existant utilisé.
- Inscription finale envoyée avec la touche **Entrée**. Les parcours métiers utilisent les boutons et champs de la page ; la matrice des écrans appelle le routeur existant pour parcourir systématiquement ses vues.
- Les séries, repas et photos utilisés sont créés pendant le test. Les vérifications lisent les résultats réellement enregistrés, les fichiers exportés et les rendus DOM.
- Images de test générées localement puis importées par le champ fichier ; pas d’accès à une photothèque personnelle.
- Les dimensions des boutons visibles sont mesurées. Ce contrôle ne remplace pas un audit complet d’accessibilité, de lecteur d’écran ou de contraste WCAG.

## Audit du ZIP avant modifications

Le même scénario de base a d’abord été exécuté sur une extraction conservée intacte du ZIP, indépendamment du projet modifié. **22 contrôles passaient ; 4 signalaient des défauts** :

1. Choisir un avatar effaçait les champs de l’inscription.
2. La configuration initiale ne reprenait pas le prénom saisi lors de l’inscription.
3. Le thème restait noir, malgré la modification de la préférence clair/sombre.
4. Des éléments étaient coupés sur 320 px : nutrition, analyse nutritionnelle et commande du minuteur de repos.

Les parcours d’inscription/récupération, création de programme, série/repos, fin de séance, nutrition, import de photos, filtres, comparaison, calendrier et export/rechargement fonctionnaient déjà. Le Jour 1 les conserve et vérifie leur fonctionnement après la refonte.

Le nouveau parcours vérifie en plus les accès rétablis à l’hydratation et au rappel whey, le menu mobile complet, la présentation Premium, la bascule réelle des thèmes et un import JSON après export.

## Contrôles fonctionnels exécutés

| N° | Contrôle | Résultat |
|---|---|---|
| 1 | Accueil public affiché | ✅ Réussi |
| 2 | Choisir un avatar conserve les champs inscription | ✅ Réussi |
| 3 | Inscription locale et code de récupération | ✅ Réussi |
| 4 | Prénom inscrit repris dans configuration | ✅ Réussi |
| 5 | Configuration initiale enregistrée | ✅ Réussi |
| 6 | Installer une séance recommandée | ✅ Réussi |
| 7 | Aperçu du programme accessible | ✅ Réussi |
| 8 | Valider série et démarrer repos | ✅ Réussi |
| 9 | Pause minuteur opérationnelle | ✅ Réussi |
| 10 | Ajouter quinze secondes de repos | ✅ Réussi |
| 11 | Séance terminée et volume calculé | ✅ Réussi |
| 12 | Ajouter un repas et calcul des macros | ✅ Réussi |
| 13 | Hydratation accessible et enregistrée | ✅ Réussi |
| 14 | Rappel whey et prise enregistrés | ✅ Réussi |
| 15 | Menu mobile complet et page Premium accessible | ✅ Réussi |
| 16 | Bascule thème depuis profil | ✅ Réussi |
| 17 | Bascule thème depuis en-tête mobile | ✅ Réussi |
| 18 | Import de deux photos locales | ✅ Réussi |
| 19 | Filtre souvenirs fonctionne | ✅ Réussi |
| 20 | Comparaison avant/après affiche les photos | ✅ Réussi |
| 21 | Clair et sombre ont des arrière-plans distincts | ✅ Réussi |
| 22 | Toutes les routes inscrites produisent du contenu | ✅ Réussi |
| 23 | Calendrier navigation mensuelle | ✅ Réussi |
| 24 | Calendrier contient la séance enregistrée | ✅ Réussi |
| 25 | Export JSON contient séance, repas et photos | ✅ Réussi |
| 26 | Import JSON restaure les données exportées | ✅ Réussi |
| 27 | Données et thème persistants après rechargement | ✅ Réussi |
| 28 | Déconnexion | ✅ Réussi |
| 29 | Mot de passe incorrect refusé | ✅ Réussi |
| 30 | Récupération par code puis connexion | ✅ Réussi |
| 31 | Aucun débordement horizontal toutes tailles/thèmes | ✅ Réussi |
| 32 | Cibles boutons mobiles au moins 44 px | ✅ Réussi |
| 33 | Aucune exception JavaScript | ✅ Réussi |

## Matrice des écrans

Un état désigne un écran à une taille et dans un thème donné. **318 états ne signifient pas 318 fonctionnalités distinctes.** Les chiffres proviennent du fichier de résultat, sans compter deux fois des tâches de développement.

| Écran / route | États inspectés | Résultat |
|---|---:|---|
| `accueil-public` | 6 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `beforeafter` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `calendar` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `coach` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `community` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `configuration-initiale` | 6 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `connexion` | 6 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `exercises` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `goals` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `habits` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `history` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `home` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `inscription` | 6 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `meals` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `memories` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `menu-complet` | 3 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `modale-repas` | 3 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `nutriai` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `nutrition` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `premium` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `preview` | 6 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `profile` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `program` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `progress` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `recuperation-compte` | 6 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `routine` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `session-active` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `settings` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `summary` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `weekly` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |
| `workouts` | 12 | Réussi : rendu, absence de débordement et boutons mobiles ≥ 44 px |

Les routes `session` et `preview` nécessitent un contexte métier : elles sont inspectées après création réelle d’un programme et démarrage d’une séance, plutôt qu’avec leur écran de repli.

## Captures incluses

- [Accueil public — 390 px](tests/captures/accueil-public.png)
- [Accueil personnalisé — 390 px](tests/captures/accueil-personnalise.png)
- [Nutrition — 390 px](tests/captures/nutrition.png)
- [Séance active — 390 px](tests/captures/seance.png)

Les captures pleine page montrent parfois une barre fixe au niveau de la hauteur du viewport : il s’agit de son emplacement normal dans l’écran pendant le défilement.

## Aperçu et tableau de bord

Ces deux suites ont été exécutées séparément, puis leurs fichiers de preuve relus pour ce rapport. Leurs résultats ne sont pas inclus dans les 33 contrôles de l’application ci-dessus.

| Livrable | Responsable de l’exécution | Réussis | Échecs | Non exécuté |
|---|---|---:|---:|---|
| Aperçu interactif et `APERCU.html` autonome | Intégration / développeur | 22 | 0 | 1 contrôle : ouverture directe `file://` |
| `AVANCEMENT.html` | Chef de projet | 12 | 0 | Ouverture directe `file://` |

**Aperçu :** trois vrais écrans applicatifs affichés ; ajout d’un repas par clic ; navigation du troisième écran ; réinitialisation ; thèmes indépendants entre les cadres ; stockage persistant témoin inchangé avant/après interaction ; absence de débordement aux largeurs 320, 375, 390, 768 et 1440 px ; aucune exception JavaScript. Le document autonome complet a aussi été chargé dans Chromium avec le réseau désactivé, et ses illustrations intégrées se sont affichées. Ce contrôle charge le contenu HTML directement dans le navigateur : il ne prétend pas valider un rechargement HTTP hors ligne.

Preuve : [tests/resultats-apercu.json](tests/resultats-apercu.json). Script : [tests/preview-smoke.cjs](tests/preview-smoke.cjs).

**Tableau de bord :** les 28 tâches, les compteurs des cinq agents et le total **15/28 = 54 %** correspondent à `docs/roadmap.json`. Les filtres par statut, agent et leur combinaison fonctionnent ; aucune tâche ne reste artificiellement « en cours » à la clôture du Jour 1. Aucun débordement à 320, 375, 390 et 1440 px ; aucune exception JavaScript.

Preuve : [tests/resultats-dashboard-jour1.json](tests/resultats-dashboard-jour1.json).

**Restriction observée :** l’ouverture directe `file://` renvoie `ERR_BLOCKED_BY_ADMINISTRATOR` dans le navigateur géré. Elle reste donc **non vérifiée**, et n’est pas comptée comme un succès. Aucun contournement de cette règle n’a été tenté. Les validations HTTP et du document autonome avec le réseau désactivé sont distinctes de l’ouverture par double-clic.

## Limites et vérifications restantes

- **Non exécuté :** essais sur véritables iPhone/Safari et appareils Android/Chrome ; les tailles sont simulées sous Chromium.
- **Non exécuté :** permissions réelles de caméra/photothèque et notifications système sur téléphone. L’import de fichiers image est vérifié ; les sélecteurs caméra et demandes de permission restent présents.
- **Non exécuté :** audit de lecteur d’écran, navigation clavier exhaustive et contraste WCAG complet. L’inscription au clavier fonctionne ; cela ne certifie pas toutes les interactions.
- **Non exécuté :** sauvegardes corrompues, anciens schémas incomplets, dépassement du quota `localStorage` et longue séance interrompue par fermeture du navigateur. L’aller-retour d’une sauvegarde complète valide est vérifié.
- **Non intégré, donc non prétendu fonctionnel :** IA connectée, connexion Google/Apple, comptes multi-appareils, communauté connectée et achat Premium. La présentation Premium indique explicitement l’absence d’abonnement et de paiement.
- Les données demeurent locales au navigateur ; les composants serveur doivent être conçus séparément avant un fonctionnement multi-appareils.

## Relancer le scénario

L’application n’a aucune dépendance de build. Le script de test nécessite **Node.js, Playwright et Chromium** disponibles dans l’environnement de test, sans les ajouter au site livré.

Depuis la racine du projet, démarrer le serveur statique :

```bash
python3 -m http.server 8080
```

Dans un autre terminal disposant de Playwright :

```bash
FORGE_BASE_URL=http://127.0.0.1:8080 \
CHROMIUM_PATH=/usr/bin/chromium \
FORGE_TEST_OUTPUT=/tmp/forge-tests \
node tests/mobile-smoke.cjs
```

Adapter le chemin de Chromium selon la machine. Un échec de contrôle donne un code de sortie non nul. Le JSON et les captures sont écrits dans `FORGE_TEST_OUTPUT`.
