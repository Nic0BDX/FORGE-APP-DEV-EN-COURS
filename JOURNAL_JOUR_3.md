# Forge — Journal du Jour 3

Mode continu. Ce journal conserve les tâches testées et les points de reprise de la journée.

## Bilan validé du Jour 3

**T05** (Testeur mobile), **D07** (Développeur) et **U03** (Designer UI/UX) ont leurs preuves. Le checkpoint de clôture ci-dessous publie les statuts, les pourcentages et le ZIP quotidien ; les passages intermédiaires plus bas restent l’historique de réalisation.

- **T05** complète la preuve de continuité : compte, séries et repos survivent à une fermeture puis relance réelles ; les brouillons invalides et une sauvegarde au format historique sont traités sans perte. **30 contrôles réussis**, sans modification applicative.
- **D07** rend la comparaison utile : deux photos choisies, mesures datées et volume de période explicite. Le calendrier filtre les séances par mois ou jour. **42 contrôles ciblés, 7 contrôles de légendes et 22 contrôles d’aperçu réussis**.
- **U03** améliore les petits écrans : actions photo distinctes, nutrition plus lisible, images de comparaison entières et légendes en dessous. Les tests ont aussi révélé puis vérifié la correction du label tactile whey. **47 contrôles ciblés finaux et 22 contrôles d’aperçu réussis**. La régression **33/33 sur 318 états** avait passé avant le dernier correctif limité au label, ensuite couvert par les tests ciblés.

Aucun débordement horizontal ni exception JavaScript relevé dans les campagnes réussies. Un essai d’aperçu `file://` reste non exécuté ; ni appareil physique ni extinction forcée du système testés. Les résultats et leur chronologie sont dans [TESTS_JOUR_3.md](TESTS_JOUR_3.md).

Le bilan laisse **C03, U04 et P04** à faire localement, ainsi que les cinq tâches bloquées **D08, D09, D10, T04 et T06**. Les comptes distants, l’IA connectée et les paiements nécessitent des services non configurés ; les appareils physiques restent indisponibles. [AVANCEMENT.html](AVANCEMENT.html) et [FEUILLE_DE_ROUTE.md](FEUILLE_DE_ROUTE.md) affichent le calcul complet, sans retirer ces blocages du dénominateur.


## Plan attribué — 3 novembre 2026

| Ordre | Tâche | Responsable | Résultat attendu | État initial |
|---|---|---|---|---|
| 1 | T05 | Testeur mobile | Vérifier les interruptions et variantes historiques encore non couvertes au Jour 2, avec une preuve réelle par scénario. | 🔄 En cours |
| 2 | D07 | Développeur | Choisir les photos comparées et rendre les dates, mesures associées et périodes du calendrier explicites. | ⬜ À faire après checkpoint T05 |
| 3 | U03 | Designer UI/UX | Séparer les actions souvenirs, améliorer la disposition nutritionnelle et les états vides/listes à petite largeur. | ⬜ À faire après checkpoint D07 |

La journée commence à **18/29 = 62 %**. Le Jour 2 est archivé et son message de clôture a été envoyé. Les sources applicatives restent celles de cette livraison jusqu’au démarrage de D07 ; la préparation de tests n’est pas une tâche terminée.

## Trois améliorations prévues pour le Jour 4

1. **C03 — Contenu & idées** : relire et intégrer les messages d’erreur, états vides et explications de données, avec des libellés fidèles au fonctionnement local.
2. **U04 — Designer UI/UX responsable** : diagnostic et corrections CSS, puis passage au Développeur pour les dialogues au clavier et les labels, puis au Testeur. Ces trois étapes ordonnées forment une seule tâche ; elle ne sera terminée qu’après leurs preuves.
3. **P04 — Chef de projet** : croiser les fonctionnalités conservées, les preuves de test et les limites de publication ; garder les dépendances externes visibles et proposer le prochain cycle utile.

Ces tâches restent à faire. La clôture du Jour 3 précédera leur démarrage.


## Checkpoint 2026-11-03T09:59:37+01:00

🔄 Point de progression enregistré, sans nouvelle tâche déclarée terminée.

Jour 3 commencé après envoi de la clôture et du ZIP validé du Jour 2. T05 démarre : fermeture et relance du navigateur avec profil conservé, expiration complète du repos et anciens brouillons/sauvegarde historique. Aucun nouveau code applicatif modifié. Après T05 testée et archivée : D07 puis U03.

Avancement : **18/29 = 62 %**. Prochaine tâche : **D07**.

## Résultat T05 — avant publication du checkpoint

**30 contrôles complémentaires réussis**, sans modification des fichiers applicatifs. Le compte, les séries cochées et non cochées et le repos expiré survivent à une fermeture puis relance réelles de Chromium avec le même profil temporaire. Sept formes de brouillons invalides sont refusées sans perte, puis une sauvegarde synthétique au format du ZIP original conserve ses données et ses dernières séries. Le test utilise une fermeture propre, pas une panne matérielle.

Preuve : [tests/resultats-t05.json](tests/resultats-t05.json). Le [rapport du Jour 3](TESTS_JOUR_3.md) précise les scénarios et leur provenance. Le checkpoint suivant enregistre T05 terminée et passe le relais au Développeur pour **D07**, avant **U03**. Aucun résultat D07/U03 n’est anticipé.

## Checkpoint 2026-11-03T10:04:09+01:00

✅ **T05 — Tester les sauvegardes anciennes, les erreurs d’import et les interruptions** · Testeur mobile · terminé Jour 3.

T05 terminée : 30 contrôles complémentaires réussis. Deux instances successives de Chromium sur le même profil conservent compte et séries ; le repos expiré ne redémarre pas. Sept variantes de brouillon invalide préservent le carnet ; une fixture synthétique issue du schéma du ZIP original reste compatible. Fermeture propre testée, pas extinction forcée du système. Aucun fichier applicatif modifié pour T05. D07 va commencer sur les sélections de photos et de périodes du calendrier.

Preuves : `tests/resultats-t05.json`.

Avancement : **19/29 = 66 %**. Prochaine tâche : **U03**.

## Résultat D07 — avant publication du checkpoint

Le choix libre de deux souvenirs permet désormais une comparaison à partir de dates explicites. Les poids futurs sont exclus, les mesures absentes restent signalées, la masse grasse est exprimée en points et le volume correspond aux séances de l’intervalle inclus. Le calendrier affiche réellement les séances du mois ou du jour choisi. L’aperçu possède une entrée Avant / Après, sans inventer de photos de démonstration.

**42 contrôles ciblés, 7 contrôles de légendes et 22 contrôles d’aperçu réussis** ; un essai `file://` reste non exécuté. Voir [TESTS_JOUR_3.md](TESTS_JOUR_3.md). Aucun nouveau passage des 318 états n’est revendiqué ici : il suivra les changements CSS U03.

Les sélections de comparaison sont en mémoire, isolées par compte, sans nouvelle écriture de carnet. Le repère Aujourd’hui du calendrier est local ; la correction globale des dates n’est pas incluse. Les légendes à 320 px restent lisibles mais couvrent encore une grande partie des photos : **U03**, confiée au Designer après le checkpoint D07, doit améliorer ce point en même temps que les actions souvenirs et les listes nutritionnelles.

## Checkpoint 2026-11-03T10:11:14+01:00

✅ **D07 — Affiner comparaison photo et calendrier avec sélection explicite des périodes** · Développeur · terminé Jour 3.

D07 terminée et vérifiée : deux photos distinctes choisies, dates d’ajout et relevés de poids explicites, masse grasse en points et volume limité à la période. Calendrier filtrable par mois ou jour. 42 contrôles fonctionnels, 7 contrôles de légendes et 22 contrôles d’aperçu réussis ; ouverture file:// non exécutée. La nouvelle entrée Avant / Après de l’aperçu source et autonome est vérifiée. U03 commence maintenant : séparer les actions des souvenirs, rendre nutrition et comparaisons plus lisibles à petite largeur.

Preuves : `tests/resultats-d07.json`, `tests/resultats-d07-legendes.json`, `tests/resultats-apercu-d07.json`.

Avancement : **20/29 = 69 %**. Prochaine tâche : **C03**.

## Résultat U03 — avant publication du checkpoint de clôture

Les 47 contrôles finaux ont confirmé les gestes réels sur les souvenirs et les repas, les légendes séparées des images, les états vides et la cible tactile whey corrigée. L’aperçu autonome a été régénéré après le dernier correctif puis a passé ses 22 contrôles. Les trois captures U03 sont accessibles dans [le rapport du jour](TESTS_JOUR_3.md).

Le Jour 4 suivra les trois améliorations attribuées plus haut : **C03 → U04 → P04**, après le message de clôture et le lien de téléchargement de l’archive du Jour 3. U04 ne recomptera pas les trois associations de labels whey déjà réalisées ici.

## Checkpoint 2026-11-03T10:21:54+01:00

✅ **U03 — Affiner les écrans spécialisés, les états vides et les longues listes** · Designer UI/UX · terminé Jour 3.

Jour 3 clôturé : T05, D07 et U03 terminées. Souvenirs sans chevauchement des actions, nutrition lisible sur téléphone, photos comparées entières avec légendes séparées, sélecteurs et états vides harmonisés. La ligne de rappel whey possède un libellé associé et une cible tactile de 44 px. 47 contrôles ciblés finaux et 22 contrôles d’aperçu réussis ; la régression de 33 contrôles sur 318 états a précédé ce dernier correctif de formulaire, couvert ensuite par les contrôles ciblés. Sources et documents gelés. Les ZIP des Jours 1 et 2 sont conservés.

Preuves : `tests/resultats-u03.json`, `tests/resultats-regression-u03.json`, `tests/resultats-apercu-u03.json`.

Avancement : **21/29 = 72 %**. Prochaine tâche : **C03**.

Journée clôturée et archive quotidienne conservée. Le mode continu poursuit la prochaine journée.
