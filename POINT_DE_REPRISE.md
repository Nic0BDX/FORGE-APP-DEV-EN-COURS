# Forge — Point de reprise

**Mode : PAUSE demandée par le propriétaire.** Attendre une nouvelle demande avant de poursuivre.
Jour en cours : **4**. Dernier checkpoint : **2026-11-03T14:28:05+01:00** (Europe/Paris).
État du jour : **en cours**.

## Tâches terminées — ne pas les refaire

**26/35 tâches terminées (74 %).**

- Jour 1 : P01, P02, P03, U01, U02, D01, D02, D03, D04, T01, T02, T03, C01, C02, C04.
- Jour 2 : P05, D05, D06.
- Jour 3 : U03, D07, T05.
- Jour 4 : V01, V02, A01, A02, A03.

## Travail exactement en cours

**Tâche : Aucune : choisir la prochaine tâche utile.**

ACCUEIL ANIMÉ TERMINÉ ET VALIDÉ : A01, A02 et A03 livrées. Corps original et lumière pectorale liée aux sept accents, pause mémorisée et réduction des animations ; grille 3+3+2, Bouger / Exercice / Debout, pas avec courbe, distance, calories actives et étages. Valeurs manuelles inconnues distinctes de zéro, minutes calculées depuis les séances. Validation : 31 contrôles de données, 66 ciblés accueil, 33 régression sur 342 états, 71 interactions, 22 aperçu ; 223 contrôles réussis, aucun débordement ni exception JS. APERCU.html autonome testé hors réseau ; file:// et appareils physiques non testés. Desktop1280 : rang1 y86/h352, rang2 y450/h280,5, pas y742,5. Livrable Forge-Accueil-Anime.zip, détails TESTS_ACCUEIL.md et docs/BILAN_ACCUEIL.md. La licence ajoutée sur GitHub a été préservée. Cette demande est terminée ; les finitions générales restent en pause.

Les étapes ci-dessus décrivent les fichiers réellement préparés. Une tâche en cours ne donne aucun crédit partiel.

## Prochaine action

**Prochaine tâche : V03**

Attendre une nouvelle demande. Lire ce point et docs/BILAN_ACCUEIL.md. Ne pas refaire A01/A02/A03. Restent C03 (relecture générale), U04 (accessibilité), V03 (comparaison des autres écrans), P04 et cinq blocages externes. Ne pas prétendre que le corps original est le fichier exact de la vidéo.

## Preuves du dernier checkpoint

- `tests/resultats-activite-donnees.json` · SHA-256 `eaaaa6b9fd1bbdd48f961a005e08a45d3d2038a504e5611a611ff1cefcd4a9f0`
- `tests/resultats-accueil-anime.json` · SHA-256 `1f326d2f26bb428383bd9ea50cb30854f5c6822dc0655cf05baabb028f8b7c9a`
- `tests/resultats-accueil-regression.json` · SHA-256 `1bcff4062baca2855465b4193486562a127c5589e8d338d3e5b3128a5f566b76`
- `tests/resultats-accueil-interactions.json` · SHA-256 `4761472b902fb590cd3cbd7785e289c7eaa3ee8182dcf1f0a062bb03842f4041`
- `tests/resultats-accueil-apercu.json` · SHA-256 `521dd811e71c51f71d80a57a88a0ca05c796ad8cca907a3c1224f8f8fb6e4f36`

## Archives et procédure de reprise

- ZIP courant : `Forge-Actuel.zip` dans le dossier des livrables (`/workspace/artifacts` dans cet environnement).
- Chaque ZIP inclut `Forge/ARCHIVE_MANIFEST.json` avec les empreintes des fichiers. Le fichier `.sha256` voisin vérifie le ZIP entier.
- Les archives `Forge-Jour-N.zip` des journées clôturées sont conservées ; aucune n’est écrasée.
- Avant de commencer la journée suivante, envoyer le message de clôture : lien du ZIP quotidien validé, progression globale et par agent, tâches du jour/en cours/restantes, blocages, journal, AVANCEMENT.html et trois améliorations prévues.
- Si une tâche est encore en cours et non validée, mettre à jour la description de reprise sans publier les sources ; le ZIP courant reste la dernière version testée.
- Si `docs/.checkpoint-pending.json` existe, une publication a été interrompue : inspecter puis exécuter `python3 docs/checkpoint.py --recover` avant toute nouvelle tâche.
- À « reprends » ou « continue », lire ce fichier, `docs/checkpoint.json` et la feuille de route. Ne pas refaire les tâches terminées. Reprendre les étapes indiquées.
- Après chaque tâche testée : appeler `docs/checkpoint.py --complete ID ... --evidence RAPPORT`. Le mode pause reste prioritaire : attendre une nouvelle demande avant de poursuivre.
- Ne pas lancer un checkpoint pendant que d’autres agents modifient les sources ; le script refuse une modification concurrente détectée.
- Quand toutes les tâches sont effectivement terminées, écrire une nouvelle feuille d’au moins 15 tâches utiles. Ne pas déclarer terminés les services indisponibles.

## Blocages externes conservés

- D08 : Choix du service de comptes et accès nécessaires indisponibles.
- D09 : Fournisseur IA, serveur et accès nécessaires indisponibles.
- D10 : Offre, tarifs et compte prestataire de paiement non fournis.
- T04 : Aucun appareil physique iOS ou Android attaché.
- T06 : Dépend des intégrations D08, D09 et D10.

## Environnement

`python3 -m http.server 8080 --bind 127.0.0.1` depuis la racine. Tests Playwright et Chromium (`/usr/bin/chromium`). Le navigateur géré bloque `file://` ; utiliser HTTP sans contourner cette règle.
