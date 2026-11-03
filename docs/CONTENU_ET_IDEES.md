# Forge — Contenu & idées

Responsable : **CONTENU & IDÉES**. Livraison : **Jour 1**.

Ce document accompagne la refonte du projet fourni. Les textes proposés ne changent pas les fonctionnalités. Leur intégration dans l’application appartient au développeur ; les points non intégrés restent des propositions.

## C01 — Une voix calme, précise et encourageante

**Slogan conservé : « Plus qu'une app, une discipline. »**

Forge accompagne une pratique régulière. La discipline se raconte comme un rythme que l’on construit, sans culpabilisation ni promesse de transformation garantie.

- Tutoyer avec simplicité : « tes séances », « ton programme », « à ton rythme ».
- Décrire l’action du bouton avec un verbe : « Ajouter un repas », « Voir ma séance », « Enregistrer ».
- Préférer des phrases courtes, lisibles sur téléphone. Une information par phrase.
- Encourager les gestes réels : une séance enregistrée, une habitude suivie, un souvenir ajouté.
- Respecter les journées de repos. Éviter « dépasse-toi », « pas d’excuse », « machine », les comparaisons et les formulations culpabilisantes.
- Afficher une valeur uniquement si elle vient des données du profil. Une absence de mesure se représente par « Pas encore de données » ou « — », sans inventer un progrès.
- Nommer précisément les mesures : le volume d’entraînement en kg ne mesure pas à lui seul la force ; une série de connexions n’est pas une série de séances.
- Distinguer clairement une fonctionnalité disponible, un aperçu et une fonctionnalité à venir.

Cette voix accompagne le style ivoire, vert pin et sauge : chaleureux, posé, lisible. Aucun slogan agressif n’est nécessaire pour communiquer la pratique sportive.

## C02 — Textes transmis pour la base du Jour 1

Ces textes ont été transmis au développeur avant son intégration. La vérification technique et mobile relève du testeur ; ce document ne constitue pas un résultat de test.

| Emplacement | Texte retenu ou recommandé | Raison |
|---|---|---|
| Accueil public, titre | **Trouve ton rythme.** | Court, accueillant et personnel. |
| Accueil public, signature | **Plus qu'une app, une discipline.** | Identité demandée, sans modification. |
| Accueil public, description | Tes séances, tes repères, tes progrès. Un espace pour avancer à ton rythme. | Explique l’utilité concrète du carnet. |
| Action principale | Créer mon espace | Exprime le bénéfice sans promettre un compte distant. |
| Action secondaire | Me connecter | Formulation directe et familière. |
| Connexion, titre | Bon retour. | Accueil sobre. |
| Connexion, description | Retrouve ton programme et reprends à ton rythme. | Continuité sans pression. |
| Inscription, description | Un profil pour retrouver tes séances et tes progrès sur cet appareil. | Rend explicite la portée locale du compte. |
| Information sur les données | Ton profil et tes données restent dans ce navigateur. Pense à les exporter pour les conserver. | Information utile au moment de choisir. |
| Création terminée | Ton espace est prêt. | Ne prétend pas vérifier l’identité. |
| Connexion terminée | Connexion réussie. | Décrit l’opération réellement réalisée. |
| Accueil personnel, prochaine séance | Ta prochaine séance | Met l’action prioritaire en avant. |
| Bouton menant à l’aperçu de séance | Voir ma séance | Évite de promettre le démarrage immédiat si un aperçu suit. |
| Pas de programme | Tout commence par une première séance. | Invite à commencer, sans faire passer l’absence de données pour une erreur. |
| Action sans programme | Choisir mon programme | À utiliser uniquement si le bouton ouvre bien le choix de programmes. Sinon : « Créer un programme ». |
| Journal alimentaire vide | Ton journal est prêt. Ajoute ton premier repas de la journée. | Associe état vide et prochaine action. |
| Souvenirs vides | Garde une trace de ton parcours. Ajoute ton premier souvenir. | Évite de réduire le progrès à l’apparence physique. |
| Photo de la semaine | Un repère de plus dans ton parcours. | Formulation calme, sans promesse de résultat. |
| Avant / après vide | Ajoute deux photos pour observer ton évolution dans le temps. | Correspond au minimum réellement requis par le code. |
| Historique vide | Ta première séance enregistrée apparaîtra ici. | Explique quand l’écran se remplira. |
| Records vides | Tes records se construiront au fil de tes séances. | Encourage sans afficher de performance fictive. |
| Profil | Mon espace | Intitulé possible pour rassembler profil, thème et paramètres. |
| Série de connexions | Jours de présence | Sens explicite ; les connexions ne sont pas des entraînements. |

### Coach et nutrition : des aperçus honnêtes

Le ZIP contient des écrans de coach et d’analyse nutritionnelle, **sans service d’IA connecté**. Les recommandations d’origine présentaient des chiffres arbitraires, comme une augmentation de charge de 5 %, une baisse des glucides le soir ou des pourcentages de progression fictifs. Ils ne doivent pas être interprétés comme une analyse du profil.

Textes recommandés :

- Badge : **« Aperçu du coach · IA non connectée »**.
- Message du coach : « Cet espace accueillera les conseils de ton coach. Pour le moment, consulte ton programme et note ton ressenti après chaque séance. »
- Titre des exemples nutrition : **« Repères généraux »**, accompagné de **« Exemples · aucune analyse personnalisée »**.
- Exemples généraux : « Observe tes habitudes au fil des jours. », « Note tes repas pour mieux comprendre ton rythme. », « Ajuste tes objectifs à ta pratique et à tes besoins. »
- Action vers le programme existant : **« Voir mon programme »**, plutôt que « Voir mon plan personnalisé » si aucune personnalisation n’a été produite.

L’ajout d’une future conversation IA restera une tâche distincte. Une réponse fixe ne doit pas être présentée comme une réponse générée par une IA.

### Premium : présenter un état, pas un faux achat

La planche fournie montre Premium ; le ZIP ne contient pas de système d’abonnement ni de paiement.

Pour conserver ce domaine dans le parcours, une entrée peut afficher **« Forge Premium »**, un badge **« En préparation »** et le message **« L’offre Premium n’est pas encore disponible. Aucun paiement n’est proposé dans cette version. »**. Un bouton doit conduire à une information réelle, sans simuler une souscription. Prix, avantages et conditions restent à définir avant de pouvoir annoncer une offre.

## Audit de contenu : planche, README et code fourni

Audit documentaire du Jour 1 : il décrit le projet reçu, avant les corrections de l’équipe. Il ne remplace pas les vérifications dans le navigateur.

| Domaine demandé | Constat dans le projet reçu | Conséquence éditoriale |
|---|---|---|
| Accueil public et inscription / connexion | Formulaires locaux présents. L’animation affiche « Identité vérifiée » et « Analyse sécurisée », mais aucune biométrie n’est implémentée. | Remplacer ces affirmations par un état de connexion ou de création. |
| Google / Apple visibles dans la planche | Aucun parcours OAuth opérationnel dans les formulaires du ZIP. Le README cite Google comme non intégré. | Ne pas ajouter de boutons qui prétendent fonctionner. Garder l’intégration comme fonctionnalité à définir séparément. |
| Accueil personnel | Données de séances, nutrition, habitudes, photos et connexions présentes. | Nommer les statistiques d’après leurs données réelles. |
| Programme et suivi de séance | Programme, aperçu, séries, charges, repos et résumé présents dans le code. | Conserver ces étapes ; éviter un libellé qui confond aperçu et début de séance. |
| Nutrition | Journal et macros présents ; des extensions hydratation / whey existent dans d’autres fichiers. | Vérifier leur accessibilité après les redéfinitions de pages, avant de les déclarer disponibles. |
| Souvenirs et avant / après | Photos locales ; comparaison de la première et de la dernière photo. Le texte exige une semaine d’écart alors que le code exige deux photos. | Aligner l’explication sur la condition réelle. Ne pas promettre un choix libre de deux photos tant qu’il n’existe pas. |
| Coach IA | Texte fixe et pourcentages d’exemple ; aucun vrai échange conversationnel. | Afficher clairement l’état d’aperçu et retirer les fausses analyses personnelles. |
| Calendrier | Navigation par mois et séances enregistrées ; pas un agenda complet de réservation. | Parler de calendrier d’activité et de séances enregistrées. |
| Profil et mode sombre | Profil et fonction de bascule présents ; ancien démarrage contraint au sombre. | Présenter le choix clair / sombre seulement après correction et vérification. |
| Premium | Aucun service d’abonnement dans le ZIP. | Présentation « en préparation », jamais une activation fictive. |
| Communauté | Contenu de démonstration, sans échanges réseau entre utilisateurs. | Ne pas présenter les membres d’exemple comme des personnes connectées. |

## C03 — Travail éditorial restant

**À faire après le Jour 1.** Relire exhaustivement tous les messages d’erreur, confirmations, fenêtres de saisie, badges et états vides après stabilisation des parcours. Vérifier notamment :

- cohérence entre « programme », « séance » et « exercice » ;
- unités, pluriels, dates françaises et accents ;
- différence entre volume, charge, force, répétitions et durée ;
- libellés de suppression / import avec conséquence claire ;
- information locale des données accessible depuis le profil ;
- texte visible dans les états sans données, avec données et avec données invalides.

La transmission des textes C02 ne signifie pas que C03 est terminé.

## C04 — Trois améliorations proposées pour le Jour 2

Ces idées sont **des propositions**, pas des fonctionnalités livrées. Le chef de projet choisira deux ou trois tâches utiles dans la feuille de route, selon les résultats des tests du Jour 1.

### 1. Un premier entraînement guidé

Quand le carnet est vide, proposer un parcours très court : choisir un programme, découvrir la première séance, puis la commencer. Les mêmes actions restent disponibles pour les utilisateurs expérimentés.

- **Bénéfice :** éviter l’accueil vide et rendre la première action évidente.
- **Texte :** « Ton premier repère : une séance qui te ressemble. »
- **Réalisation proposée :** le développeur relie les actions existantes ; le designer précise leur hiérarchie ; le testeur vérifie un compte neuf de bout en bout.
- **Critère d’acceptation :** une personne sans données atteint une séance avec un programme enregistré, sans étape bloquante ni données fictives.

### 2. Une séance facile à reprendre

Conserver un brouillon de la séance en cours et proposer de le reprendre après un rechargement de page ou une interruption. Le projet utilise déjà le stockage local : cette amélioration peut rester locale.

- **Bénéfice :** protéger la saisie et éviter de recommencer une séance interrompue.
- **Texte :** « Ta séance est en pause. Tu peux reprendre là où tu en étais. »
- **Réalisation proposée :** le développeur traite la persistance ; le contenu distingue reprendre / terminer / abandonner ; le testeur vérifie séries, charge et minuteur après rechargement.
- **Critère d’acceptation :** aucune série validée n’est perdue et une reprise ne crée pas deux séances dans l’historique.

### 3. Un avant / après que l’on choisit

Choisir les deux photos à comparer, afficher leurs vraies dates et ne montrer des mesures que lorsqu’elles existent. Les souvenirs gardent leurs légendes et leurs catégories.

- **Bénéfice :** rendre la comparaison utile même quand les premières et dernières photos ne sont pas comparables.
- **Texte :** « Deux repères de ton parcours. Choisis les moments à comparer. »
- **Réalisation proposée :** le designer définit les sélecteurs mobiles ; le développeur relie les photos locales ; le testeur couvre zéro, une et plusieurs photos.
- **Critère d’acceptation :** les deux images sélectionnées sont celles affichées, avec leurs dates, sans inventer de variation de poids ou de force.

## État de livraison de l’agent

| Tâche | État au Jour 1 | Preuve |
|---|---|---|
| C01 — Charte de ton et slogan | Terminée | Charte et slogan dans ce document. |
| C02 — Microtextes de la base | Terminée pour le contenu | Textes fournis au développeur ; intégration et tests suivis dans les tâches de développement et de validation. |
| C03 — Audit complet des états et erreurs | À faire | Périmètre restant explicitement décrit ci-dessus. |
| C04 — Trois propositions pour le Jour 2 | Terminée | Trois propositions avec bénéfice, responsabilité et critère d’acceptation. |

Les pourcentages officiels de l’équipe sont calculés dans `AVANCEMENT.html` à partir de la feuille de route. Ce document ne maintient pas de compteur parallèle.
