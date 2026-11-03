# Changelog

## Jour 3 — 3 novembre 2026 — Continuité, comparaison et lisibilité mobile

- **T05 validée : 30 contrôles complémentaires** sur les sources applicatives inchangées du Jour 2. Deux instances Chromium successives retrouvent le compte et les séries après fermeture propre ; le repos expiré reste à zéro.
- Sept variantes de brouillon invalide sont refusées sans altérer le carnet ou le brut. Une fixture synthétique reproduisant le format du ZIP original vérifie la conservation des données historiques et le préremplissage des séries.
- Aucun essai de panne matérielle ni d’appareil physique revendiqué.
- **D07 validée** : sélection de deux photos distinctes, dates de mesures explicites, écarts calculés seulement avec les données nécessaires et volume de la période en kg × répétitions.
- Calendrier : choix direct du mois ou du jour, liste réellement filtrée, retour au mois complet/actuel ; repère du jour basé sur la date locale dans cette vue.
- Avant / Après devient accessible dans le sélecteur de l’aperçu. Preuves D07 : **42 contrôles ciblés**, **7 contrôles de légendes**, **22 contrôles d’aperçu**, un essai `file://` non exécuté. Ces preuves appartiennent au checkpoint D07 ; la régression suivante est celle d’U03.

- **U03 validée** : actions des souvenirs dans le flux de la carte, nutrition sur deux lignes sur téléphone, images de comparaison entières et légendes en dessous, sélecteurs et états vides harmonisés.
- Correction du rappel whey révélée par les tests : ligne cliquable de 44 px, case visuelle de 20 px et labels associés, sans changement de logique des rappels.
- Preuves U03 : **47/47 contrôles ciblés**, **33/33 contrôles de non-régression sur 318 états**, **22 contrôles d’aperçu réussis**, un essai `file://` non exécuté. La régression complète précède le dernier correctif whey, ensuite couvert par les contrôles ciblés et l’aperçu final.

## Jour 2 — 31 octobre, reprise et validation le 3 novembre 2026

- **P05 terminée et testée** : checkpoint après chaque tâche, point de reprise précis, source unique des pourcentages, ZIP courant vérifié et archives quotidiennes immuables.
- Reprise d’une publication interrompue sans refaire une tâche terminée ; 20 contrôles passés sur copie isolée.
- Tâches dépendant de services ou d’appareils externes explicitement bloquées et conservées dans le dénominateur.
- **D05 terminée et testée** : brouillon de séance distinct par compte, saisies persistées, reprise explicite, repos à échéance réelle et pause conservée, protection contre l’écrasement et fin sans doublon.
- Preuves D05 : 49 contrôles ciblés, 33 de non-régression sur 318 états et 22 d’aperçu réussis. Le brouillon actif reste exclu de l’export du carnet ; cette portée est explicitée dans le README.
- **D06 validée** : schéma d’import profond et versionné, compatibilité des champs anciens, aperçu et confirmation avant remplacement, conservation des champs supplémentaires compatibles.
- En cas d’erreur d’écriture, l’import et l’effacement conservent les données précédentes et le brouillon. Un carnet local illisible affiche un panneau de récupération, sans remplacement automatique, avec export exact du fichier brut.
- Effacement limité au carnet du compte affiché ; nouveau brouillon possible après import ou remise à zéro. Quelques saisies ont été alignées sur les limites du format pour éviter d’enregistrer un carnet devenu illisible ; la validation exhaustive reste hors de ce périmètre.
- Preuves D06 : **70/70 contrôles ciblés**, **33/33 contrôles de non-régression sur 318 états**, **22 contrôles d’aperçu réussis** ; un contrôle `file://` non exécuté. Aucun appareil physique iOS/Android testé.

## Jour 1 — 26 octobre 2026 — Une base plus calme et plus lisible

- Conservation du projet HTML/CSS/JavaScript fourni et de ses fonctions locales.
- Direction ivoire, vert pin, sauge et miel ; thème clair par défaut et véritable thème sombre mémorisé.
- Nouvelle présentation de l’accueil public et personnel, navigation mobile complète, profil accessible.
- Illustrations SVG locales, avatars embarqués et typographie système.
- Corrections du choix d’avatar, du prénom initial, de la restauration du compte, des contrôles whey/hydratation et des rappels photo.
- Présentation Premium « en préparation », sans paiement fictif.
- Exemples IA explicitement non connectés et microtextes plus précis.
- Galerie interactive isolée sur trois écrans et suivi du développement dans `AVANCEMENT.html`.
- Inventaire, feuille de route attribuée, rapport de tests et journal du Jour 1.

Les résultats exécutés et les limites restantes figurent dans `TESTS_JOUR_1.md`. Les rubriques ci-dessous décrivent l’historique de la version reçue ; elles ne définissent plus la direction visuelle actuelle.

## FORGE PROJECT — refonte noir & rouge

### Identité
- Nom FORGE PROJECT, slogan « Forge ton corps. Construis ta discipline. »
- Nouvelle feuille de style `css/forge-elite.css` : noir neutre, rouge vif, verre dépoli, animations sobres (désactivées si l'appareil réduit les animations).
- Écran d'intro « DISCIPLINE. PROGRESSION. LIBERTÉ. ».

### Connexion
- Écran immersif plein écran sur mobile, panneau à droite sur ordinateur.
- Mot de passe oublié par code de récupération, indicateur de chargement.

### Accueil et séances
- Accueil recomposé : prochaine séance, semaine, photo de la semaine, état du jour, flammes, graphiques.
- Aperçu de séance, séance immersive, minuteur de repos fixe (+15 s, pause, durées rapides), résumé de fin de séance.

### Série de flammes
- Série de jours de connexion, paliers 3 / 7 / 14 / 30 / 60 / 100, badges, calendrier, célébrations.

### Écrans de la maquette
- Progression, nutrition, souvenirs, photo hebdo, avant / après, programmes, calendrier.
- Mon IA Coach et Analyse nutritionnelle (base visuelle, IA non connectée).

### Navigation
- Barre mobile : Accueil, Séances, Nutrition, Souvenirs, Progrès. Menu ordinateur complet avec Coach IA.

## Jour 4 — Accueil animé

- Corps original, lumière pectorale animée liée aux sept accents, pause mémorisée et réduction de mouvement.
- Anneaux Bouger / Exercice / Debout, séparés de la nutrition ; relevés manuels et migration des carnets.
- Pas du jour : courbe, distance, calories actives, étages, raccourci mobile.
- Grille3+3+2, carte de repères réduite, densité des séances corrigée et vignettes locales.
- Aperçu autonome enrichi, 223 contrôles réussis ; détails dans TESTS_ACCUEIL.md.
