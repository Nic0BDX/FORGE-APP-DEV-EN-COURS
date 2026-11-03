# Forge — Plan de tests supplémentaires

Document préparatoire du Testeur mobile. Une ligne planifiée n’est pas un résultat réussi ; les preuves JSON datées des exécutions font foi.

## Jour 2 — D05

`resilience-smoke.cjs`, mode D05 : reprise explicite après recharge, saisies non cochées, validation de série, pause de repos, +15 secondes, temps réellement écoulé pendant l’interruption, finalisation idempotente, échec d’écriture finale sans perte, brouillon résiduel d’une séance déjà enregistrée, isolation de deux comptes, annulation et effacement, validation des nombres. Les parcours sont réalisés dans un contexte navigateur neuf.

D05 a couvert la tentative de nouveau programme et le quota pendant saisie. T05, exécutée au Jour 3, couvre désormais la fermeture/relance du processus navigateur, l’expiration complète du repos et les brouillons anciens/malformés : voir `tests/resultats-t05.json` et `TESTS_JOUR_3.md`.

## Jour 2 — D06 puis T05

Imports invalides sans perte du carnet, schéma et versions, migration d’un carnet ancien, confirmation explicite avant remplacement, annulation, quota simulé et rollback, contenu importé rendu inerte, export/import complet et isolation des comptes. D06 est exécutée : 70 contrôles ciblés réussis, confirmation explicite vérifiée ; voir `tests/resultats-d06.json`. T05 ajoute la fixture synthétique issue du format historique du ZIP, sans répéter toute cette campagne.

## Jour 3 — D07 / U03

Comparaison photo : choisir deux photos distinctes, vérifier dates et mesures réellement associées, état vide/une seule photo, suppression de la sélection courante, petite largeur. Calendrier : navigation de période et contenus correspondants.

**Régression relevée par le designer pendant l’audit :** sur 320 px, les boutons « catégorie » et « supprimer » d’une photo se chevauchent malgré leurs dimensions >=44 px et l’absence de débordement. Ajouter une assertion d’intersection des rectangles et des clics effectifs sur chaque contrôle. Un test d’overflow seul ne prouve pas leur utilisabilité.

## Limites de la campagne

Les tests sont exécutés sous Chromium à tailles simulées. Ils ne remplacent pas Safari/iPhone, Android physique, photothèque ou notifications système. L’ouverture file:// est interdite dans le navigateur géré et ne doit pas être déclarée validée.
