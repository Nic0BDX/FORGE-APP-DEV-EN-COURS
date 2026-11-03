# Forge — plan initial des finitions de l’accueil

**Historique du cadrage.** A01, A02 et A03 sont maintenant intégrées et validées ; voir `BILAN_ACCUEIL.md` et la feuille de route générée pour les statuts après livraison.

Demande du 3 novembre 2026 : terminer l’accueil, intégrer un corps avec une animation lumineuse sur les pectoraux et rétablir l’organisation du dashboard, dont la progression d’activité et les pas. Cette demande autorise la reprise ciblée de l’accueil ; elle ne demande pas de reprendre automatiquement les services distants ou toutes les journées du projet.

## Point de départ vérifié

Le point de reprise conserve **23 tâches terminées sur 32 (72 %)**, Jour 4. V01 et V02 sont déjà livrées ; ne pas les recommencer ni effacer leurs preuves. V03 reste ouverte pour la comparaison et les finitions. C03, U04 et P04 restent à terminer ; D08, D09, D10, T04 et T06 gardent leurs blocages.

L’accueil actuel possède déjà les trois rangées de cartes et une carte des pas alimentée par `DB.steps`. Le corps est encore un emplacement réservé. La carte d’activité utilise actuellement les calories alimentaires, les minutes de séance et les habitudes : elle doit être réexaminée, car des calories mangées ne doivent pas être présentées comme des calories dépensées. Les données fictives restent uniquement dans l’aperçu isolé.

## Trois tâches proposées, dans l’ordre

Ces identifiants sont une proposition pour la feuille de route principale. Ils ne sont pas encore comptabilisés : le responsable principal décide de leur ajout avant publication. S’ils deviennent trois nouvelles tâches, le dénominateur passe de 32 à 35 et le point de départ devient **23/35 = 66 %**. Aucun crédit partiel.

| ID | Priorité | Responsable | Travail et critères d’acceptation | État réel au moment de ce plan |
|---|---|---|---|---|
| A01 | P0 | Designer UI/UX | Comparer l’accueil à la même image de référence ; fixer proportions, ordre et place des cartes. Fournir le corps et les zones lumineuses sur les pectoraux, lisibles dans la carte héro ; prévoir la recoloration par les sept accents et une version immobile lorsque les animations sont réduites. | En cours : cadrage de la demande et références disponibles ; aucun nouveau visuel ou rendu final validé par ce plan. |
| A02 | P0 | Développeur | Après A01, intégrer le corps animé et la grille finale de l’accueil. Conserver activité, calories/macros, sommeil, pouls, prochaines séances et pas avec leurs données et actions. Préserver les formats mobile/tablette, les menus et l’aperçu autonome. Les chiffres inexistants restent indiqués comme manquants, sans fausse mesure. | À faire : intégration à valider après le composant A01. |
| A03 | P0 | Testeur mobile | Après gel du code, comparer la capture desktop à la vidéo, contrôler les petits écrans, l’animation des pectoraux, les sept accents, les périodes et la saisie des pas. Vérifier les données réelles, les états vides, la réduction des animations et l’aperçu autonome sans réseau. Produire les preuves ; le Chef de projet actualise ensuite les documents et l’archive validée. | À faire : aucun nouveau test déclaré terminé. |

Le Chef de projet coordonne l’ordre et la publication. Contenu & idées relit les libellés et la signification des indicateurs avant A03. Le Designer transmet le composant au Développeur avant modification de l’intégration ; le Testeur travaille après gel des fichiers. Les mêmes fichiers ne sont pas modifiés simultanément.

## Fonctions de l’accueil à préserver

- **Navigation et compte** : sidebar, navigation mobile, rubrique active, recherche, avatar, sept accents persistants, thème clair/sombre et déconnexion.
- **Reprise de séance** : carte de brouillon et reprise accessible via les notifications ; ne pas remplacer une séance en cours.
- **Activité et nutrition** : périodes réellement filtrantes, anneaux, donut calorique et parts d’énergie des macros ; conserver la distinction entre nutrition et activité.
- **Sommeil** : période de 1, 7 ou 30 jours, données enregistrées, barres, infobulles et action d’ajout d’une nuit.
- **Pouls** : courbe fondée sur les relevés manuels et formulaire d’ajout, sans prétendre mesurer le pouls ni se connecter à un capteur.
- **Programmes** : liste des prochaines séances, aperçu de chaque séance et bouton vers le programme.
- **Pas** : total du jour, objectif, progression, moyenne sur sept jours, saisie manuelle validée et persistance. Cette fonction existe déjà ; l’amélioration concerne aussi sa visibilité et sa présentation.
- **Raccourcis** : ajout d’un repas, habitudes, objectifs, historique et exercices.
- **Données** : comptes locaux, stockage isolé de la démonstration, import/export validé, données manquantes honnêtes et sources précédentes conservées.

## Publication et reprise

Mettre à jour POINT_DE_REPRISE.md, la feuille de route et AVANCEMENT.html après chaque tâche effectivement terminée. Le ZIP courant reste la dernière version validée jusqu’à la réussite des contrôles. Conserver les anciennes archives et le ZIP de l’étape vidéo du Jour 4. Le bilan final doit distinguer ce qui correspond à la vidéo, les adaptations mobiles et les éventuels écarts qui subsistent.

Ce plan ne modifie ni le code, ni les statuts officiels, ni les archives. Il ne constitue pas une preuve de conformité visuelle.
