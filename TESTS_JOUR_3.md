# Forge — Tests du Jour 3

Responsable : Testeur mobile. Campagne T05 exécutée le **3 novembre 2026**.

## T05 — Continuité au-delà d’un simple rechargement

**30 contrôles réussis, aucun échec, aucune exception JavaScript ni ressource en échec.** Deux véritables instances Chromium successives ont utilisé le même profil temporaire ; le premier navigateur était déconnecté avant le lancement du second. Aucun fichier applicatif n’a été modifié pour obtenir ces résultats.

Preuves : [résultats T05](tests/resultats-t05.json), [script exécuté](tests/continuity-smoke.cjs), [capture de reprise](tests/captures-jour3/t05-reprise-redemarrage.png).

Les scénarios complètent D05/D06 ; ils ne rejouent pas leur campagne complète. Les comptes et les données sont fictifs. Le profil de navigateur créé par le test est supprimé à la fin.

- **Fermeture et relance réelles** : compte retrouvé, reprise proposée explicitement, séries cochées et non cochées conservées, carnet et XP inchangés.
- **Repos expiré pendant la fermeture** : une durée de 1 seconde est inscrite dans le programme de test pour provoquer une expiration réelle sans attente inutile. Après la relance, repos à zéro, aucune reprise automatique du décompte, état corrigé dans le brouillon.
- **Sept brouillons refusés** : JSON tronqué, version ancienne inconnue, version future, autre propriétaire, série validée incohérente, minuteur négatif et fichier trop grand. Le carnet et le contenu brut du brouillon restent inchangés ; le parcours d’accueil fonctionne. Un brouillon valide remis ensuite reste reprenable.
- **Compatibilité historique** : fixture synthétique fondée sur le schéma du ZIP original, sans marqueur de version. Séance enregistrée avec nombres en chaînes et exercice sans série, repas, poids, mesures, eau, sommeil, notes, habitudes, records et dernières séries sont conservés. Rechargement réussi et séries historiques préremplies dans une nouvelle séance.

La provenance et l’empreinte du fichier de schéma d’origine sont conservées dans [tests/fixtures/README.md](tests/fixtures/README.md). La fixture n’est pas présentée comme une sauvegarde d’utilisateur réel.

| Contrôle | Résultat |
|---|---|
| T05 — Le repos est réellement actif avant fermeture | ✅ Réussi |
| T05 — Le premier navigateur est fermé avant une nouvelle instance | ✅ Réussi |
| T05 — La relance retrouve le compte et propose une reprise explicite | ✅ Réussi |
| T05 — Le carnet historique n’est pas modifié par la fermeture | ✅ Réussi |
| T05 — Les séries cochées et non cochées survivent à la relance | ✅ Réussi |
| T05 — Un repos expiré hors navigateur revient à zéro sans redémarrer | ✅ Réussi |
| T05 — Le repos expiré est aussi corrigé dans le brouillon enregistré | ✅ Réussi |
| T05 — La relance ne crée pas de séance ni de récompense | ✅ Réussi |
| T05 — Brouillon ignoré sans faux parcours de reprise : JSON tronqué | ✅ Réussi |
| T05 — Brouillon refusé sans altérer le carnet ou le fichier brut : JSON tronqué | ✅ Réussi |
| T05 — Brouillon ignoré sans faux parcours de reprise : ancienne version inconnue | ✅ Réussi |
| T05 — Brouillon refusé sans altérer le carnet ou le fichier brut : ancienne version inconnue | ✅ Réussi |
| T05 — Brouillon ignoré sans faux parcours de reprise : version future inconnue | ✅ Réussi |
| T05 — Brouillon refusé sans altérer le carnet ou le fichier brut : version future inconnue | ✅ Réussi |
| T05 — Brouillon ignoré sans faux parcours de reprise : propriétaire différent | ✅ Réussi |
| T05 — Brouillon refusé sans altérer le carnet ou le fichier brut : propriétaire différent | ✅ Réussi |
| T05 — Brouillon ignoré sans faux parcours de reprise : série validée incohérente | ✅ Réussi |
| T05 — Brouillon refusé sans altérer le carnet ou le fichier brut : série validée incohérente | ✅ Réussi |
| T05 — Brouillon ignoré sans faux parcours de reprise : minuteur malformé | ✅ Réussi |
| T05 — Brouillon refusé sans altérer le carnet ou le fichier brut : minuteur malformé | ✅ Réussi |
| T05 — Brouillon ignoré sans faux parcours de reprise : brouillon trop volumineux | ✅ Réussi |
| T05 — Brouillon refusé sans altérer le carnet ou le fichier brut : brouillon trop volumineux | ✅ Réussi |
| T05 — Un brouillon valide reste utilisable après les refus | ✅ Réussi |
| T05 — Le format du ZIP historique est reconnu comme sauvegarde ancienne | ✅ Réussi |
| T05 — Séance historique avec chaînes numériques et exercice vide conservée | ✅ Réussi |
| T05 — Repas, poids, mesures, eau, sommeil et notes historiques conservés | ✅ Réussi |
| T05 — Le carnet historique reste lisible au démarrage et conserve son thème | ✅ Réussi |
| T05 — Les dernières séries historiques préremplissent la nouvelle séance | ✅ Réussi |
| T05 — Aucune exception JavaScript | ✅ Réussi |
| T05 — Aucune ressource applicative en échec | ✅ Réussi |

## Reproduire T05

Depuis la racine, avec le serveur statique sur le port 8080, Playwright et Chromium disponibles :

```bash
FORGE_TEST_OUTPUT=/tmp/forge-t05 node tests/continuity-smoke.cjs
```

Le premier essai a identifié une assertion trop stricte dans le test : elle comparait l’ordre textuel des clés JSON après migration. Le contrôle utilise maintenant une comparaison profonde des mêmes valeurs ; il n’a pas été retiré. Le deuxième essai complet passe les 30 contrôles. Aucun correctif applicatif n’a été nécessaire.

## Limites actuelles du Jour 3

Cette campagne ne simule pas une panne matérielle ni une extinction forcée du système : le navigateur est fermé proprement, puis relancé. Elle ne remplace pas les essais sur iOS/Android physiques. D07 a ensuite été vérifiée dans la campagne ci-dessous. U03 a ensuite été vérifiée dans la campagne ci-dessous.


## D07 — Comparaison photo et calendrier par période

Campagne exécutée le **3 novembre 2026** : **42 contrôles ciblés réussis**, aucune exception JavaScript ni ressource en échec ; **7 contrôles complémentaires** des légendes réussis. Les 42 contrôles incluent 12 états de rendu (deux écrans, deux thèmes, trois largeurs : 320, 390 et 768 px) sans débordement ni cible de formulaire/bouton inférieure à 44 px.

Preuves : [résultats D07](tests/resultats-d07.json), [légendes D07](tests/resultats-d07-legendes.json), [aperçu D07](tests/resultats-apercu-d07.json). L’aperçu a été régénéré et vérifié par le responsable d’intégration : **22 contrôles réussis**, 1 essai `file://` non exécuté pour la restriction du navigateur géré. Les résultats D06 sont conservés séparément ; leur suite complète n’a pas été rejouée puisque cette tâche ne modifie pas stockage/authentification.

Les fixtures utilisent trois photos colorées, volontairement non triées, et des valeurs calculables indépendamment du code : pour les photos du 10 au 20 février, les relevés de poids associés donnent **−1,5 kg**, les deux mesures de masse grasse dans la période **−1 point**, les trois séances aux bornes et à l’intérieur **600 kg × répétitions**. Les séances et mesures hors période sont distinctes et ne doivent pas contribuer aux indicateurs.

Contrôles réalisés :

- États sans photo/une photo ; sélection des deux images ; dates d’ajout et dates de poids réellement affichées ; deux sélections distinctes et ordre chronologique rétabli.
- Séries de poids non triées ; exclusion des poids futurs ; absence de variation inventée si un seul relevé ; masse grasse limitée à la période ; volume total exact incluant les deux bornes.
- Deux photos du même jour ; suppression d’une photo sélectionnée ; import remplaçant les identifiants ; séparation des choix entre deux comptes même lorsque leurs photos ont les mêmes identifiants.
- Mois affiché et jour choisi cohérents avec l’historique, jour sans séance, changement de mois depuis un jour, retour au mois entier/actuel, 29 février 2024 et passage décembre–janvier.
- Les textes longs des légendes sans poids restent entièrement dans leur photo à 320, 390 et 768 px dans les deux thèmes. À 320 px, une légende occupe 128 px dans une photo de 184 px : aucun texte rogné, mais une part importante de l’image est recouverte ; U03 peut améliorer cette présentation.

Le test de sélection a été adapté au comportement réel : la photo déjà choisie dans l’autre champ est volontairement désactivée. Il déplace maintenant la fin d’abord lorsque nécessaire et vérifie explicitement les options désactivées. Aucun contrôle de conservation/ordre n’a été supprimé. Aucun défaut applicatif n’a été détecté par cette campagne.

### Captures D07

- [Comparaison et données datées](tests/captures-jour3/d07-comparaison.png)
- [Calendrier filtré](tests/captures-jour3/d07-calendrier.png)
- [Légendes claires à 320 px](tests/captures-jour3/d07-legendes-light-320.png)
- [Légendes sombres à 320 px](tests/captures-jour3/d07-legendes-dark-320.png)

### Reproduire D07

```bash
FORGE_TEST_OUTPUT=/tmp/forge-d07 node tests/d07-smoke.cjs
FORGE_TEST_OUTPUT=/tmp/forge-d07-legendes node tests/d07-captions.cjs
```

Les dates contrôlées sont les dates enregistrées dans le carnet ; ces essais ne valident pas la lecture des métadonnées EXIF des photos. Les sélecteurs de date natifs restent à vérifier sur de vrais téléphones.


## U03 — Écrans spécialisés et gestes sur petit écran

Campagne exécutée le **3 novembre 2026** : **47 contrôles ciblés réussis**, aucune exception JavaScript ni ressource en échec. Les ciblés couvrent **16 états de rendu** (souvenirs, nutrition, comparaison et calendrier ; clair/sombre ; 320/390 px) et cinq états vides. La régression générale passe **33/33 contrôles sur 318 états**, sans débordement, exception ou bouton inférieur à44 px détecté.

Preuves : [résultats U03](tests/resultats-u03.json), [régression U03](tests/resultats-regression-u03.json), [aperçu U03](tests/resultats-apercu-u03.json). L’aperçu final a été régénéré après le dernier correctif whey/CSS et passe **22 contrôles**, avec 1 essai `file://` non exécuté à cause de la restriction du navigateur géré. Les scénarios ciblés utilisent l’application réelle dans sa démonstration à stockage isolé, avec 24 photos et 18 repas fictifs. La régression générale utilise son contexte navigateur neuf et son compte fictif habituel.

Ce qui a été vérifié :

- Les boutons de catégorie et suppression n’ont aucune intersection géométrique à320/390 px. Des clics normaux à320 px changent réellement la catégorie, filtrent la galerie, ouvrent l’édition de légende puis suppriment uniquement la photo visée. Les autres souvenirs sont conservés.
- Les longues légendes sont placées sous les photos. Dans la comparaison, le texte commence après l’image entière : aucun texte superposé ne masque la photo.
- Les noms de repas longs disposent d’au moins120 px de largeur et ne sont pas rognés ; calories et macros occupent leur propre ligne. Les rectangles de texte restent dans leur carte. La suppression d’un repas fonctionne à320 px.
- Les champs de mois/date et les commandes restent utilisables. Les états vides Programme, Nutrition, Souvenirs, Avant/Après et Progression restent lisibles.
- Le nouveau contrôle des champs a révélé une cible préexistante trop petite : la case de rappel whey mesurait242×24 px, sans label associé. Le correctif crée un label englobant de242×44 px à320 px, avec une case visuelle20×20 px. Le test mesure la zone réellement activable, clique près de son bord, vérifie le basculement et enregistre le choix. Les champs de dose et d’heure possèdent également leurs labels associés.

La régression de318 états a passé avant le petit correctif final du label whey. Les47 contrôles ciblés ont été exécutés après ce correctif et vérifient son comportement ainsi que les écrans modifiés. Cette chronologie évite de présenter les deux campagnes comme simultanées ou de rejouer sans nécessité tous les parcours.

### Captures U03

- [Actions photo distinctes à320 px](tests/captures-jour3/u03-souvenir-actions-320.png)
- [Noms longs et macros à320 px](tests/captures-jour3/u03-nutrition-320.png)
- [Comparaison sans légende superposée à320 px](tests/captures-jour3/u03-comparaison-320.png)

### Reproduire U03

```bash
FORGE_TEST_OUTPUT=/tmp/forge-u03 node tests/u03-smoke.cjs
FORGE_TEST_LABEL=regression-u03 FORGE_TEST_OUTPUT=/tmp/forge-regression-u03 node tests/mobile-smoke.cjs
```

Ces contrôles ne remplacent toujours pas les tests de clavier, photothèque et notifications sur de vrais téléphones. Les limites d’authentification locale et de services externes restent celles du README.
