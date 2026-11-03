# Forge — Point de reprise

**Mode : PAUSE demandée par le propriétaire.** Attendre une nouvelle demande avant de poursuivre.
Jour en cours : **4**. Dernier checkpoint : **2026-11-03T11:14:44+01:00** (Europe/Paris).
État du jour : **en cours**.

## Tâches terminées — ne pas les refaire

**23/32 tâches terminées (72 %).**

- Jour 1 : P01, P02, P03, U01, U02, D01, D02, D03, D04, T01, T02, T03, C01, C02, C04.
- Jour 2 : P05, D05, D06.
- Jour 3 : U03, D07, T05.
- Jour 4 : V01, V02.

## Travail exactement en cours

**Tâche : V03**

ÉTAPE VIDÉO LIVRÉE, PAUSE À LA DEMANDE DU PROPRIÉTAIRE. V01 et V02 terminées : coque noire/verre/citron, sept accents persistants, recherche, menu avatar, périodes réelles, animations et grilles Forge. Programme, nutrition, sommeil, santé et progression adaptés ; pas et pouls manuels avec validation des sauvegardes. APERCU.html est le site complet autonome ; preview/phone.html conserve la galerie. Validation : 33 contrôles sur 342 états, 71 contrôles vidéo, 22 contrôles aperçu ; aucun échec. Ouverture file:// non exécutée car bloquée par le navigateur géré. C03 reste à relire ; V03 reste ouverte pour la comparaison exhaustive et les images. Dernières captures dans tests/captures-video, écarts dans docs/COMPARAISON_VIDEO.md. Les agents secondaires ont atteint leur quota ; intégration finale effectuée par le responsable principal. Livrable conservé : Forge-Jour-4-Etape-video.zip. Attendre une nouvelle demande, ne pas enchaîner.

Les étapes ci-dessus décrivent les fichiers réellement préparés. Une tâche en cours ne donne aucun crédit partiel.

## Prochaine action

**Prochaine tâche : C03**

À la prochaine demande : lire les écarts de docs/COMPARAISON_VIDEO.md et les captures ; finir V03 (comparaison de chaque écran et visuels fournis), puis C03 et U04. Conserver tous les parcours et ne publier que du code testé. Ne pas relancer les tâches V01/V02 déjà validées.

## Preuves du dernier checkpoint

- `tests/resultats-video-regression.json` · SHA-256 `50668c88c9ea05cc98cd0aaf668d30c29799c2b43ec8f927eecdd1860c37d29f`
- `tests/resultats-video-interactions.json` · SHA-256 `e91f41c2d11f09413d9ef6f825c42dd8b69c81a211458c1ac97ef5b2dfb1a93e`
- `tests/resultats-apercu-video.json` · SHA-256 `3b8955573f763243cb9ad0d6836b5f9e9e1ce6e23162d471364bcca10d888704`

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
