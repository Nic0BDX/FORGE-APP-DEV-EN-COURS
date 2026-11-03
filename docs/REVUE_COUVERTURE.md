# Forge — Revue de couverture et de préparation à la publication

Responsable : **Chef de projet**. Préparation au **Jour 4, 3 novembre 2026**.

**Brouillon de P04 : aucune clôture ni décision finale à ce stade.** C03 est en cours et U04 reste à réaliser. La matrice ci-dessous décrit les preuves disponibles à la fin du Jour 3 ; elle sera relue après leurs résultats. Les lignes « présent » ne valent pas une validation de tous les cas possibles.

## Conservation du projet fourni

Les **48 fichiers** du dossier d’origine `forge-dashboard` sont toujours présents sous leurs chemins relatifs dans le projet de travail, vérification de présence faite le 3 novembre. Le code a été amélioré dans cette architecture HTML/CSS/JavaScript, sans nouvelle compilation ou dépendance applicative. Ce contrôle de présence complète les parcours fonctionnels ; il ne suffit pas à lui seul à prouver leur conservation.

Les vues actives sont assemblées par `js/core/router.js`, puis complétées ou remplacées par `js/features/screens.js` et `js/features/ai.js`. L’inventaire conserve la distinction entre fonctions historiques présentes et vues réellement affichées. Aucun service distant absent du ZIP n’est présenté comme connecté.

## Matrice des fonctions demandées

Les preuves liées appartiennent aux campagnes déjà exécutées ; C03 et U04 devront compléter cette colonne avant la conclusion de P04.

| Fonction | État local vérifié au Jour 3 | Preuve disponible | Limite conservée / travail distinct |
|---|---|---|---|
| Accueil public et slogan | Présentation, création d’espace et connexion accessibles ; slogan conservé. | [Régression U03](../tests/resultats-regression-u03.json), [aperçu U03](../tests/resultats-apercu-u03.json) | Les textes C03 sont encore en vérification. |
| Inscription, connexion et récupération | Compte local, choix d’avatar, mot de passe, code de récupération, déconnexion et reconnexion exercés. | Régression U03 ; [D06](../tests/resultats-d06.json) pour le carnet illisible à la connexion | Aucun compte distant ni OAuth Apple/Google : D08 bloquée. |
| Accueil personnalisé | Programme, repas, hydratation, indicateurs, photos et présence accessibles selon les données du compte. | Régression U03 et aperçu U03 | Les indicateurs proviennent des saisies ; aucune mesure médicale ou analyse IA. |
| Programme et bibliothèque d’exercices | Installation d’une séance recommandée, aperçu, accès aux exercices et aux programmes conservés. | Régression U03 ; contrôles de routes et rendu | Catalogue local distinct de la ressource externe ; lecteur vidéo tiers non validé. L’unité des maintiens chronométrés reste à traiter. |
| Suivi de séance | Séries, charges, répétitions, RPE, pause, repos, +15 secondes, résumé et reprise explicite exercés. | [D05](../tests/resultats-d05.json), [T05](../tests/resultats-t05.json), régression U03 | Fermeture propre du navigateur testée, pas panne matérielle ; brouillon local exclu de l’export du carnet actif. |
| Nutrition et hydratation | Ajout/suppression de repas, calculs du catalogue, macros, eau et réglages accessibles. | Régression U03 ; [U03](../tests/resultats-u03.json) pour les longues listes et clics mobiles | Objectifs par défaut à adapter, aucune prescription personnalisée ; améliorations d’écriture quotidienne prévues dans le brouillon B02. |
| Rappels whey | Activation et prise enregistrée ; zone du label cliquable de 44 px et champs associés vérifiés. | U03 finale (47 contrôles) | Notifications réelles sur téléphone non vérifiées ; application ouverte/active requise et composition générique. |
| Souvenirs et photo hebdomadaire | Import de photos locales, filtre, catégorie, légende et suppression conservés ; actions distinctes sur téléphone. | Régression U03 ; U03 ciblée | Caméra physique non testée ; import de lots défaillants/quota à améliorer (B05) ; accès clavier à la légende prévu U04. |
| Avant / Après | Deux photos distinctes choisies, dates et poids associés, masse grasse en points, volume de la période ; images entières et légendes séparées. | [D07](../tests/resultats-d07.json), [légendes D07](../tests/resultats-d07-legendes.json), U03 | Choix gardés en mémoire, dates enregistrées sans EXIF revendiqué ; aucune mesure estimée depuis une photo. |
| Coach IA et analyse nutritionnelle | Écrans conservés et exemples explicitement signalés ; données locales consultables. | Régression U03 (routes et rendu) | Aucun modèle ou serveur IA connecté : D09 bloquée. |
| Calendrier | Navigation, choix du mois/jour, filtre de séances, 29 février et changement d’année exercés. | D07 et U03 | Historique de dates enregistrées ; harmonisation globale des jours locaux encore distincte (B01). |
| Profil et mode sombre | Profil, paramètres et thème clair/sombre conservés au rechargement. | Régression U03 et aperçu U03 | Le thème de démonstration reste isolé du carnet réel. |
| Premium | Présentation et accès conservés, offre indiquée en préparation. | Régression U03 | Aucun achat, abonnement ou paiement actif : D10 bloquée. |
| Habitudes, objectifs et progression | Rubriques et données conservées ; poids, habitudes, XP et graphiques présents. | Régression U03 pour les routes ; D06/T05 pour les formes de données | Objectifs décroissants/édition, XP répétables et périodes exactes des graphiques restent des améliorations distinctes (B03/B12/B09). |
| Données, sauvegarde et effacement | Export versionné, import confirmé, récupération brute, annulation et erreurs de stockage exercés ; autres comptes conservés dans ces scénarios. | D06 et T05 | La concurrence entre plusieurs onglets n’est pas couverte ; B13 priorisée, dont le changement de compte inter-onglets reste une hypothèse à reproduire. |
| Communauté | Rubrique et accès au profil conservés. | Régression U03 (rendu des routes) | Vitrine locale ; aucun fil social ou publication réelle. C03 doit expliciter les exemples. |

## Preuves et portée

- D05 : 49 contrôles ciblés ; D06 : 70 ; T05 : 30 ; D07 : 42 et 7 contrôles de légendes ; U03 : 47.
- Régression U03 : 33 contrôles sur 318 états. Elle précède le dernier correctif limité au label whey, ensuite vérifié par les 47 ciblés finaux et les 22 contrôles d’aperçu.
- L’aperçu autonome est vérifié avec ses ressources intégrées et sans réseau ; l’ouverture directe `file://` reste interdite par le navigateur de test et non exécutée.
- Les scénarios utilisent des comptes et données fictifs. Les contrôles de rendu mobile Chromium ne sont pas présentés comme des essais iOS/Android physiques.
- C03/U04 : preuves à ajouter après leur exécution. Une relecture ou une inspection du code n’est pas une preuve d’interaction clavier.

## Dépendances externes inchangées

| Tâche | État | Dépendance réelle |
|---|---|---|
| D08 | Bloquée | Choix et configuration d’un service de comptes/OAuth. |
| D09 | Bloquée | Serveur et fournisseur IA, sans clé embarquée dans le navigateur. |
| D10 | Bloquée | Offre, tarifs et compte de prestataire de paiement. |
| T04 | Bloquée | Appareils physiques iOS et Android indisponibles ici. |
| T06 | Bloquée | Intégrations D08/D09/D10 nécessaires avant tests de bout en bout. |

Ces cinq tâches restent dans le dénominateur. P04 ne les clôturera pas pour déclarer un cycle achevé.

## Préparation de la décision P04 — à compléter

La base est un carnet local, pas un service de comptes ou d’abonnements prêt à déployer. Avant la conclusion de P04 : vérifier C03 et U04 sur leurs versions finales, la cohérence README/inventaire/feuille/point de reprise, les liens de livraison et les manifestes d’archives. Ne pas conclure à l’absence de bugs à partir des seuls compteurs de tests.

Après cette revue seulement, l’extension locale pourra être activée avec au moins quinze nouvelles tâches utiles. Retirer B06 si les dialogues au clavier ont été livrés par U04 ; ne pas recompter les bornes déjà traitées par D06. **B13 passe en première priorité** pour vérifier et traiter les écritures concurrentes et le propriétaire du carnet entre onglets, avant les nouvelles fonctions. Le brouillon reste sans effet sur l’avancement tant qu’il n’est pas activé.
