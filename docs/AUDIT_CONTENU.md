# Forge — Audit du contenu en mode continu

Responsable : **Contenu & idées**. Audit préparé au **Jour 2**, le **31 octobre 2026** ; reprise et intégration du **Jour 4**, le **3 novembre 2026**.

**État de C03 : intégration en cours, vérification finale à faire.** Ce document ne marque aucune tâche terminée et ne contient pas encore de résultat de test de cette intégration. Le développeur intègre les corrections dans les sources ; le testeur vérifie leur rendu et leur cohérence avec le comportement réel. Le chef de projet reste responsable des statuts officiels.

Le slogan reste **« Plus qu'une app, une discipline. »** La voix reste calme, précise et encourageante, en accord avec les couleurs ivoire, pin, sauge et miel du Jour 1.

## Périmètre et méthode

Relecture du README, du point de reprise, de la charte éditoriale et des **31 fichiers JavaScript applicatifs** présents au début du Jour 2. L’audit confronte les textes au calcul et à l’action auxquels ils sont reliés. Les anciennes fonctions encore présentes mais remplacées par le routeur sont signalées séparément : leur existence ne prouve pas qu’un utilisateur les voit.

Les défauts de calcul, de persistance ou d’accessibilité ne deviennent pas corrigés en changeant une phrase. Ils sont distingués des retouches éditoriales et doivent recevoir une tâche technique si leur résolution n’entre pas dans le travail déjà attribué.

Priorités : **P0** = compréhension d’une action qui risque de perdre des données ; **P1** = information trompeuse ou action mal décrite ; **P2** = lisibilité, vocabulaire et cohérence. Les identifiants `CE-xx` ci-dessous sont des observations de cet audit, pas de nouvelles tâches comptées dans les pourcentages.

## Textes prêts pour D05 — Reprendre une séance

Ces propositions ont été transmises au développeur. Elles sont à adapter au comportement finalement testé.

| Situation | Texte proposé | Condition de vérité |
|---|---|---|
| Brouillon retrouvé | **Une séance t’attend** | Un brouillon valide existe pour le compte courant. |
| Explication | Tes séries saisies sont conservées dans ce navigateur. Reprends quand tu es prêt. | La dernière saisie a réellement été écrite dans le stockage. |
| Action principale | **Reprendre la séance** | Restaure les exercices, les séries et le repos de ce brouillon. |
| Action secondaire | **Abandonner la séance** | Efface ce brouillon après confirmation, sans ajouter d’historique. |
| Confirmation | Abandonner cette séance ? Ses séries ne seront pas ajoutées à l’historique. | L’abandon ne supprime aucune séance déjà terminée. |
| Charge invalide | Indique une charge de 0 kg ou plus. | Les séries au poids du corps peuvent utiliser 0 kg. |
| Répétitions invalides | Indique un nombre entier de répétitions supérieur à 0. | À utiliser pour une série mesurée en répétitions, pas pour un exercice chronométré. |
| Effort perçu invalide | Le RPE doit être compris entre 0 et 10, ou laissé vide. | Le champ reste facultatif. |
| Explication du RPE | Effort ressenti de 0 à 10. Facultatif. | Ce n’est pas une mesure automatique. |
| Échec d’enregistrement du brouillon | La sauvegarde locale a échoué. Garde cette page ouverte pour conserver ta saisie. | La saisie existe encore en mémoire ; aucune réussite ne doit être affichée. |
| Séance déjà terminée | Cette séance figure déjà dans ton historique. | Son identifiant a été reconnu, sans créer un doublon. |
| Remplacement d’une séance en cours | Une séance est déjà en cours. Reprends-la ou abandonne-la avant d’en commencer une autre. | Aucun brouillon n’est écrasé automatiquement. |

Éviter **« Ta séance est en pause »** si seul le minuteur de repos peut être suspendu, ou si le temps de séance continue pendant une interruption. « Repos en pause » décrit alors précisément le composant concerné. Ne pas promettre une conservation sur plusieurs appareils.

## Textes prêts pour D06 — Sauvegardes et effacement

| Situation | Texte proposé | Condition de vérité |
|---|---|---|
| Export | **Exporter mon carnet** | Le fichier contient le carnet, pas les identifiants du compte. |
| Explication de l’export | Le fichier sauvegarde ton carnet, pas ton mot de passe ni ton code de récupération. | Le format exporté conserve cette séparation. |
| Import | **Importer une sauvegarde** | Le format est contrôlé avant tout remplacement. |
| Confirmation d’import | Cette sauvegarde remplacera le carnet de ce compte dans ce navigateur. Exporte ton carnet actuel si tu veux le conserver. | L’import remplace le carnet ; il ne fusionne pas les deux historiques. |
| Confirmation, boutons | **Remplacer mon carnet** / **Annuler** | Annuler ne change ni les données ni le brouillon de séance. |
| Fichier illisible | Impossible de lire ce fichier. Choisis à nouveau ta sauvegarde. | Échec de lecture du fichier, distinct d’un format invalide. |
| JSON invalide | Ce fichier n’est pas un fichier JSON lisible. | La syntaxe ne peut pas être analysée. |
| Schéma invalide | Cette sauvegarde ne correspond pas au format Forge. | Le fichier est du JSON, mais sa structure est incompatible. |
| Version plus récente | Cette sauvegarde provient d’une version plus récente de Forge. | Le numéro de version est reconnu comme futur. |
| Données incohérentes | Certaines données de cette sauvegarde sont invalides. Ton carnet n’a pas été remplacé. | Validation avant mutation et absence de modification confirmée. |
| Échec d’écriture | Le carnet n’a pas pu être enregistré. Tes données précédentes sont conservées. | L’ancien état est réellement intact ou restauré ; sinon ne pas afficher cette seconde phrase. |
| Import réussi | Sauvegarde importée dans ce compte. | Écriture effectuée et nouveau carnet affichable. |
| Effacement, titre | **Effacer le carnet de ce compte** | Il ne s’agit ni de supprimer les comptes ni d’effacer les carnets des autres profils. |
| Confirmation d’effacement | Séances, repas, photos et séance en cours seront supprimés de ce navigateur. Le compte et les autres profils seront conservés. | Adapter à la portée exacte du code ; vérifier toutes les données concernées. |
| Confirmation, boutons | **Effacer mon carnet** / **Conserver mon carnet** | Le second choix ne modifie rien. |

Une confirmation destructive doit nommer son objet. « Effacer toutes les données » est trop ambigu si le compte, les mots de passe ou d’autres carnets restent présents. Les messages de réussite ne doivent pas être affichés avant l’écriture effective.

## Corrections éditoriales à intégrer pour C03

| ID | Priorité | Source et emplacement | Constat | Proposition précise | Vérification attendue |
|---|---|---|---|---|---|
| CE-01 | P1 | `features/screens.js` → `progressPage()` | « Force totale (kg) » additionne charge × répétitions. | **Volume d’entraînement** ; aide « Somme des charges × répétitions des séries enregistrées. » | Le libellé et le graphique décrivent le même total. |
| CE-02 | P1 | `features/home.js` → carte du graphique | « Charge cumulée » désigne un cumul de volumes. | **Volume cumulé**. | Même définition que CE-01 ; ne pas changer les données. |
| CE-03 | P1 | `features/home.js` → `macroShares()` et légende ; `features/ai.js` → `nutriAIPage()` | Les pourcentages sont des parts énergétiques, affichées à côté de grammes sans explication. | Ajouter « Parts de l’énergie apportée par les macronutriments. » et une légende « % de l’énergie ». | Un exemple riche en lipides ne doit pas laisser croire que le pourcentage est celui des grammes. |
| CE-04 | P1 | `features/screens.js` → `stateCard()` | « Ton état aujourd’hui » ressemble à une mesure de santé/récupération ; ce sont des ratios de saisie. | **Tes repères du jour** ; aide « D’après tes habitudes cochées et tes repas enregistrés. » | Pas de promesse d’énergie, de stress ou de récupération mesurés. |
| CE-05 | P1 | `features/community.js` → `community()` | « Partager », « rester connecté », « Fil FORGE », défi « ACTIF » et « Ton profil public » alors qu’aucun partage n’existe. | Sous-titre « Cet espace communautaire est en préparation. Rien n’est publié depuis cette version. » ; « Idées pour la communauté » ; badge « Exemple » ; **Ton profil local**. | Les exemples restent visibles, sans faire croire à une publication, un défi actif ou d’autres membres en ligne. |
| CE-06 | P1 | `features/exercises.js` → `exercises()` | « 800+ exercices structurés » décrit une ressource externe, pas le catalogue de 30 mouvements embarqués. Le badge ajoute aussi un « + » au total exact. | Badge « ${exerciseCatalog.length} mouvements disponibles » ; carte **Une ressource pour explorer** ; « Consulter une base externe d’exercices sur GitHub. Ces fiches ne sont pas toutes intégrées dans Forge. » | Le nombre visible correspond au catalogue local ; le lien externe reste disponible. |
| CE-07 | P1 | `features/exercises.js` → introduction, cartes et modale | « Voir la démonstration » promet une vidéo, mais le lien est une recherche intégrée dont le fonctionnement n’est pas vérifié. | « Voir les détails et ajouter ce mouvement à ta séance. » ; accès vidéo décrit comme « Rechercher une démonstration sur YouTube » si le développeur remplace le lecteur par une recherche réelle. | Ne pas annoncer une démonstration certifiée pour chaque exercice sans preuve. La correction du lien est technique et distincte. |
| CE-08 | P1 | `features/ai.js` → `nutriAIPage()` | « Voir le plan alimentaire » ouvre le journal, pas un plan personnalisé. | **Retrouver mon journal alimentaire**. | Le bouton ouvre bien `nutrition`. |
| CE-09 | P1 | `features/settings.js` → objectifs quotidiens ; `features/setup.js` | Les valeurs initiales 2 800 kcal / 180 g de protéines, etc. ne sont pas calculées à partir du profil. | Aide « Ces valeurs de départ sont à adapter à tes besoins. Forge ne les calcule pas à partir de ton profil. » | Présente près des objectifs ; ne pas prétendre que choisir un objectif produit un plan personnalisé. |
| CE-10 | P1 | `features/ai.js` → `calendarPage()` | Bouton « Ajouter un entraînement » ouvre une liste de programmes, sans créer un événement daté. | Libellé accessible **Voir mes programmes** ; titre de liste **Séances enregistrées**. | Conserver l’accès, sans promettre une planification qui n’existe pas. |
| CE-11 | P1 | `core/streak.js`, `core/layout.js`, `features/profile.js` | Présence/connexion et entraînement utilisent deux séries différentes ; « Streak » ou « Série actuelle » ne précise pas laquelle. | Pour `loginStreak()` : **Jours de présence** ; pour `streak()` : **Jours d’entraînement consécutifs**. Décrire le badge associé. | Les deux compteurs gardent leur calcul distinct. |
| CE-12 | P1 | `features/profile.js` → badges | Le badge « Machine » et « Streak 7 » s’écartent de la charte calme et restent peu explicites. | « 50 séances » ou « Dans la durée » ; « 7 jours d’entraînement ». | Noms uniquement, mêmes identifiants et conditions. |
| CE-13 | P1 | `features/settings.js` → données | Le texte utilisateur propose de « brancher une authentification serveur » ; terme d’implémentation peu utile à cet endroit. | « Ton carnet reste dans ce navigateur. Exporte une sauvegarde pour en garder une copie. Le compte ne se synchronise pas avec d’autres appareils. » | La documentation technique conserve les détails serveur, le produit explique la conséquence. |
| CE-14 | P1 | `core/auth.js` → code de récupération | « Code reçu à l’inscription » peut laisser entendre un email ; le code est affiché à l’écran. | **Code affiché lors de l’inscription**. | Aucun email de récupération n’est promis. |
| CE-15 | P2 | `core/auth.js` → bandeau sous le formulaire | « Identifiants protégés par hachage » est une formule technique qui peut surestimer la protection locale. | **Compte local à ce navigateur**. | Conserver dans le README l’explication réelle du hachage et ses limites. |
| CE-16 | P2 | `features/screens.js` → programme vide ; ancienne `program()` | « Crée ton premier split » emploie un terme de spécialiste. | « Crée ton premier programme ou choisis une séance proposée. » | Les deux actions existent et restent visibles. |
| CE-17 | P1 | `features/screens.js` → `programPage()` | `${p.days.length}j/sem` assimile le nombre de séances du programme à une fréquence hebdomadaire imposée. | **${p.days.length} séances dans ce programme**. | La fréquence choisie par le profil reste un autre repère. |
| CE-18 | P2 | `features/screens.js` → `previewPage()` ; `data/catalog.js` | Les durées prévues sont des estimations, affichées comme des durées certaines. | Préfixe **Environ** ou **Durée indicative**. | La durée réelle du résumé reste clairement séparée de l’estimation. |
| CE-19 | P2 | `features/screens.js` → journal vide | Le constat seul ne donne pas de prochaine action. | « Ton journal est prêt. Ajoute ton premier repas de la journée. » | Le bouton Ajouter reste présent et atteignable. |
| CE-20 | P2 | `features/screens.js` → souvenirs vides | « Suivre ta transformation » focalise le souvenir sur le corps. | « Garde une trace de ton parcours. Ajoute ton premier souvenir. » | Aucune obligation de photo corporelle ni promesse de changement physique. |
| CE-21 | P2 | `features/exercises.js` → résultat de recherche vide | « Aucun exercice trouvé » ne suggère pas de sortie. | « Aucun mouvement ne correspond. Essaie un autre mot ou retire un filtre. » | Aucun bouton de réinitialisation n’est annoncé avant son implémentation. |
| CE-22 | P2 | `features/habits.js` → boutons d’eau | « +250 », « +500 », « +750 » n’indiquent pas l’unité. | **+ 250 ml**, **+ 500 ml**, **+ 750 ml**. | Valeurs inchangées. |
| CE-23 | P2 | `features/nutrition.js` → `meals()` | « kcal loggées », « Repas conseillés », « CONSEILLÉ » mélangent jargon et recommandation personnalisée. | **kcal enregistrées aujourd’hui**, **Idées de repas**, badge **Exemple**. | La journée type reste explicitement adaptable ; pas de régime prescrit. |
| CE-24 | P2 | `features/habits.js`, `features/workouts.js`, `features/profile.js`, `features/progress.js` | « DAILY SYSTEM », « TRAINING », « PR », « RÉCUP », « CONFIG » incohérents avec les autres écrans. | « ROUTINE », « ENTRAÎNEMENT », « Records », « Récupération », « Paramètres ». | Les identifiants et API internes peuvent rester inchangés. |
| CE-25 | P1 | `features/photos.js`, `features/whey.js` → permissions | L’état `default` est présenté comme « Autorisation refusée » alors qu’une personne peut fermer la demande. | `granted` → « Notifications autorisées » ; `denied` → « Notifications bloquées dans ce navigateur » ; `default` → « Autorisation non accordée pour le moment ». | Vérifier séparément les trois états, sans prétendre envoyer un rappel réel pendant le test. |
| CE-26 | P1 | `features/photos.js` → import | « Photos enregistrées avec la date » et « Prise le… » utilisent la date d’import, pas les métadonnées de capture du fichier. | **Photos ajoutées au carnet** ; **Ajoutée le…** tant qu’aucune date réelle de prise n’est fournie. | Distinguer date d’import et date choisie/capture dans le futur comparateur. |
| CE-27 | P1 | `features/whey.js` → `logWhey()` | Les macros sont calculées avec une composition générique, sans avertir qu’elle peut différer du produit. | « Les valeurs nutritionnelles utilisent une estimation générique. Vérifie l’étiquette de ton produit. » | Aucun calcul personnalisé n’est promis. Adapter la composition est une évolution séparée. |
| CE-28 | P2 | `features/workouts.js` → repos et résumé | « Passer », « vs » et l’en-tête RPE ne sont pas toujours explicites. | **Passer le repos**, **Écart de volume avec la séance précédente**, aide RPE proposée plus haut. | Vérifier les espaces à 320 px avant intégration ; garder une version courte accessible si nécessaire. |
| CE-29 | P1 | Formulaires `goals`, `habits`, `progress` | Un champ requis vide provoque parfois un retour silencieux ; aucune correction n’est expliquée. | « Donne un nom à cet objectif. », « Donne un nom à cette habitude. », « Indique un poids supérieur à 0 kg. » | À associer à une vraie validation, pas à un message affiché malgré une sauvegarde invalide. |
| CE-30 | P2 | Plusieurs modales et suppressions | Boutons × sans nom accessible, pluriels figés (« 1 séances », « 1 exercices »), décimales avec point. | Noms d’action contextualisés ; accords singulier/pluriel ; affichage français des nombres. | Ne pas changer la valeur stockée. Couvrir 0, 1 et plusieurs éléments. |

## Observations qui nécessitent du code, au-delà d’une retouche de texte

| ID | Source | Problème constaté à la lecture | Suite proposée |
|---|---|---|---|
| CF-01 | `core/utils.js`, `core/streak.js`, `features/home.js` | Les clés de jour utilisent UTC (`toISOString`) alors que les calendriers affichent la date locale. Une saisie autour de minuit peut être classée au jour précédent. | Tâche dédiée de dates locales et tests avec fuseaux/décalages. Conserver les dates historiques sans migration arbitraire. |
| CF-02 | `features/ai.js` → `beforeAfterPage()` | Le poids associé peut provenir d’une mesure ultérieure à la photo ; graisse et volume sont comparés globalement, pas sur la période photographiée. Le volume est nommé « Force ». | D07 : choix explicite des photos et vraies dates ; uniquement des mesures associables à la période. Ne pas colorer automatiquement toute baisse de poids comme un succès. |
| CF-03 | `features/goals.js` | `current / target` n’exprime pas correctement la progression d’un objectif décroissant. L’utilisateur ne peut pas mettre à jour la valeur d’un objectif dans cet écran. | Définir valeur initiale, sens de progression et édition, puis tester les deux directions et les objectifs atteints. |
| CF-04 | `data/catalog.js`, `features/workouts.js` | Le modèle Full Body contient Planche 3 × 30–60 ; l’interface l’interprète comme des répétitions avec charge, alors qu’un maintien est chronométré. | Ajouter une unité de série (répétitions/durée) et les calculs correspondants sans supprimer la planche ni les séances existantes. |
| CF-05 | `features/nutrition.js`, `features/habits.js`, `features/progress.js`, `features/settings.js` | Certaines saisies négatives passent ; 0 ou une saisie vide est parfois remplacé silencieusement par une valeur par défaut. | Validation de formulaire, message au bon champ et conservation de la saisie ; les tests de schéma D06 ne remplacent pas ces validations de saisie. |
| CF-06 | `features/photos.js` | Un fichier image illisible ou ignoré n’a pas de message ; un lot peut attendre indéfiniment un `onload` ; un quota plein ne rétablit pas automatiquement le tableau en mémoire. | Tester les erreurs de fichier, les lots partiels et les limites de stockage. N’annoncer que le nombre de photos réellement enregistrées. |
| CF-07 | `features/screens.js` → `volBuckets()` | « Mois » représente 28 jours glissants et « Année » 12 mois glissants, contrairement à une possible lecture de mois/année civile. | Soit renommer « 4 semaines » / « 12 mois », soit implémenter de vraies périodes calendaires ; expliciter la période comparée. |
| CF-08 | `features/exercises.js` | Le lecteur utilise une recherche YouTube intégrée, sans vidéo identifiée ni résultat de lecture vérifié. | Préserver une sortie externe fonctionnelle et informative ; tester le lien requis avant d’annoncer la disponibilité vidéo. |
| CF-09 | `core/ui.js` et fonctions de modales | Il manque un traitement uniforme du focus, de la fermeture clavier et du nom du dialogue ; plusieurs fenêtres ouvrent directement `.show`. | U04 et tâche technique d’accessibilité partagée. Un simple ajout de `aria-label` ne suffira pas. |

Ces observations ne sont ni déclarées corrigées ni ajoutées automatiquement au calcul officiel. Le chef de projet décide leur découpage et leur attribution, en révisant le dénominateur si de nouvelles tâches sont créées.

## Couverture des fichiers relus

| Fichier | Contenu vérifié / remarque |
|---|---|
| `js/app.js` | Slogan et intro ; aucun nouveau message mensonger constaté. |
| `js/core/auth.js` | Accueil, connexion, inscription, récupération, erreurs et états d’attente ; CE-14/15 et messages de stockage à distinguer. |
| `js/core/default-db.js` | Valeurs initiales non personnalisées ; CE-09. |
| `js/core/gamification.js` | XP et série de séances ; distinguer présence et entraînement (CE-11). |
| `js/core/layout.js` | Navigation mobile/ordinateur, thèmes, menu, compteur de présence ; CE-11 et cohérence des noms. |
| `js/core/router.js` | Identification des vues actives et des vues remplacées ; pas de nouveau texte utilisateur. |
| `js/core/state.js` | État initial ; pas de texte utilisateur. |
| `js/core/storage.js` | Lecture et sauvegarde sans message dédié ; D06 traite la fiabilité. |
| `js/core/streak.js` | Paliers, jours de présence, calendrier et notifications ; CE-11, CF-01. |
| `js/core/ui.js` | Toast et modales ; messages transmis par les fonctions métier, CF-09. |
| `js/core/utils.js` | Échappement, formats et jours ; CF-01. |
| `js/data/avatars.js` | Avatars locaux, aucun texte métier supplémentaire. |
| `js/data/catalog.js` | Exercices, modèles, repas et routine ; CE-18/23/24, CF-04. |
| `js/features/ai.js` | Coach, repères nutrition, calendrier, photo hebdo, avant/après ; CE-03/08/10/26 et CF-02. État IA non connectée déjà visible. |
| `js/features/calendar.js` | Ancienne vue remplacée par `calendarPage()` ; créneaux fictifs toujours présents dans le code ancien, ne pas les réactiver comme de vrais rendez-vous. |
| `js/features/community.js` | Vitrine locale décrite comme connectée ; CE-05. |
| `js/features/exercises.js` | Recherche, bibliothèque et ajout à une séance ; CE-06/07/21, CF-08. |
| `js/features/goals.js` | Création/suppression, ratios et état vide ; CE-29/30, CF-03. |
| `js/features/habits.js` | Routine, eau, sommeil et habitudes ; CE-22/24/29, CF-05. |
| `js/features/history.js` | Historique et détail des séries ; unités à conserver, CE-28/30. |
| `js/features/home.js` | Salutation, séance, semaines, macros, graphiques et raccourcis ; CE-02/03/11, CF-01. |
| `js/features/nutrition.js` | Repas, eau, saisies et exemples ; CE-23/29, CF-05. La vue de base est remplacée, les actions restent actives. |
| `js/features/photos.js` | Import, suppression et rappels ; CE-25/26, CF-06. |
| `js/features/profile.js` | Profil, badges, thèmes et Premium ; CE-11/12/24. Premium reste explicitement en préparation. |
| `js/features/progress.js` | Poids, graphiques et ancienne vue ; CE-29/30, CF-05. `progressPage()` remplace la page, mais modales et graphiques sont actifs. |
| `js/features/reminders.js` | Notifications whey et photos ; pas de prétention à des notifications push autonomes. CF-01 pour les dates. |
| `js/features/screens.js` | Vues réellement actives séance/programmes/progression/nutrition/souvenirs ; CE-01/04/16–20/30, CF-07. |
| `js/features/settings.js` | Profil, objectifs, données, import/export/effacement ; D06, CE-09/13, CF-05. |
| `js/features/setup.js` | Prénom, objectif, niveau, fréquence ; CE-09. La personnalisation du programme n’est pas générée ici. |
| `js/features/whey.js` | Portions, horaires et notifications ; CE-25/27. Le caractère facultatif est déjà explicite. |
| `js/features/workouts.js` | Programmes, séries, repos, résumé ; D05, CE-16/18/28/30, CF-04. |

## Vérification éditoriale avant clôture de C03

- Contrôler les vues réellement routées, puis vérifier que les anciennes fonctions conservées ne réintroduisent pas les termes corrigés.
- Parcourir chaque écran avec un compte vide, avec une seule donnée, avec plusieurs données, puis avec une erreur de saisie lorsque l’action le permet.
- Vérifier que chaque bouton décrit sa destination réelle, notamment calendrier, coach, nutrition et aperçu de séance.
- Vérifier le rendu mobile des textes longs et des confirmations, dans les deux thèmes ; aucun texte utile ne doit être caché pour faire passer la mise en page.
- Confirmer la distinction entre compte local, carnet exporté, brouillon de séance et données d’un autre profil.
- Mettre les textes D05/D06 au statut intégré uniquement après les preuves de leurs tâches respectives ; conserver les autres propositions ouvertes.
- C03 peut être clôturée lorsque la relecture et les corrections éditoriales retenues sont vérifiées. Les défauts fonctionnels explicitement transférés à d’autres tâches restent ouverts et ne sont pas déclarés résolus par cette clôture.

## Idées initiales, conservées pour la suite

1. **Deux photos, deux dates choisies** — D07 : expliquer ce qui est comparé et n’afficher que des mesures rattachables à ces moments. Bénéfice : un avant/après compréhensible et personnel.
2. **Des repères qui portent le bon nom** — C03 : distinguer volume, énergie, présence et entraînement ; rendre la communauté d’exemple explicite. Bénéfice : moins d’interprétations trompeuses, sans supprimer d’écran.
3. **Un premier entraînement guidé** — nouvelle tâche si retenue : rendre le passage d’un compte vide à une première séance évident, en réutilisant les programmes existants. Bénéfice : un démarrage plus simple, avec des actions utiles plutôt que des données fictives.

Ces idées ne sont pas des fonctions livrées. Le mode continu autorise leur sélection et leur réalisation par l’équipe après les tâches prioritaires ; il ne dispense pas des tests et du checkpoint après chaque tâche terminée.

## Reprise du 3 novembre 2026 — Relecture ciblée D06

Le périmètre de cette reprise est limité aux textes réellement ajoutés dans `settings.js` et `storage.js`. L’audit initial des 31 fichiers n’a pas été refait. **D06 reste en attente de validation technique et de tests** ; une relecture de texte ne constitue pas une preuve de conservation des données.

- L’aperçu explique que l’import **remplace** le carnet du compte courant. Il invite à exporter la version actuelle, propose une annulation et distingue la séance en cours, les identifiants et les autres profils.
- Les erreurs distinguent fichier illisible, JSON invalide, format incompatible, version future et échec d’enregistrement. Les messages de conservation devront rester confirmés par les tests de stockage.
- La récupération décrit la conservation du fichier local et propose d’abord un export de secours. Elle ne promet pas de réparer automatiquement un fichier invalide.
- **Correction transmise au développeur** : dans Paramètres, remplacer « Effacer toutes les données » par **« Effacer le carnet de ce compte »**. Le texte doit être identique à celui de l’action de récupération, puisque les comptes et les autres carnets restent conservés. Statut : à vérifier dans la version gelée.

### Ordre d’intégration de C03 au Jour 4

Le responsable reste **Contenu & idées** : il prépare puis vérifie les textes. Le développeur les intègre dans les fichiers dont il a la responsabilité ; le testeur contrôle les parcours concernés. C03 reste une seule tâche de la feuille de route et ne reçoit aucun crédit avant intégration et vérification.

| Ordre | Corrections à traiter | Observations de l’audit | Limite à respecter |
|---|---|---|---|
| 1 | Nommer les données et les fonctions réellement disponibles : volume, parts d’énergie, repères de saisie, communauté d’exemple, taille du catalogue, compte local. | CE-01 à CE-06, CE-08, CE-09, CE-11, CE-13 à CE-15 | Garder les calculs et les accès existants ; ne pas annoncer de service connecté. |
| 2 | Décrire les actions et leurs dates : calendrier, photos ajoutées, permissions de notification, composition estimée de la whey. | CE-10, CE-25 à CE-27 | Relire d’abord D07 terminé ; ne pas remplacer une nouvelle information exacte par l’ancien texte de l’audit. |
| 3 | Clarifier programmes, durées indicatives, états vides, unités et vocabulaire. | CE-12, CE-16 à CE-24, CE-28 | Conserver toutes les actions et tester les textes longs à 320 px. |
| 4 | Traiter les accords et noms accessibles simples, puis vérifier les messages dans les parcours disponibles. | CE-30 et checklist de clôture ci-dessus | Les comportements clavier de dialogue relèvent de U04/du développement. |

**À ne pas déclarer corrigé par le seul texte :** lecteur vidéo (CE-07/CF-08), validations des formulaires (CE-29/CF-05), unités chronométrées (CF-04), dates locales (CF-01), calculs d’objectifs (CF-03), import de lots de photos (CF-06) et périodes de graphiques (CF-07). Leurs suites techniques restent visibles. Les confirmations déjà validées dans D05/D06 ne seront pas réécrites sans nécessité.

### Trois améliorations prévues pour le Jour 3

1. **Reprendre après une interruption plus longue — T05, Testeur mobile.** Compléter les scénarios déjà validés par les cas de résilience encore non couverts ; faire corriger les défauts observés avant publication. Bénéfice : savoir précisément ce que la sauvegarde conserve et dans quelles limites.
2. **Choisir ses photos et la période consultée — D07, Développeur.** Rendre la comparaison avant/après et le calendrier explicites, avec des dates et mesures rattachables à la sélection. Bénéfice : comprendre ce que l’on compare, sans interprétation trompeuse.
3. **Mieux utiliser les petits écrans — U03, Designer UI/UX.** Séparer les actions des souvenirs et redonner de la place aux aliments, macros et listes. Bénéfice : des informations lisibles et des boutons atteignables à 320 px, sans retirer de contenu.

Ce sont les trois tâches proposées pour la clôture du Jour 2 ; leur réalisation suit l’ordre confirmé par le chef de projet. Elles ne sont pas présentées comme déjà terminées.

## Jour 4 — Corrections retenues et rapprochement des livraisons

Le Jour 3 est désormais livré. Cette section remplace les états provisoires des notes de préparation ci-dessus pour le travail en cours. Elle ne refait pas l’audit initial ; elle rapproche ses observations des sources et des livraisons D05, D06, D07 et U03.

### Répartition effective

1. **Contenu & idées** fournit les corrections finales ci-dessous et relit leur intégration.
2. **Développeur** modifie les textes dans ses fichiers, sans changer les calculs, les données ni les destinations des actions.
3. **Testeur mobile** vérifie le rendu, les destinations et la non-régression sur le code gelé.
4. **Chef de projet / intégration** met à jour le statut officiel seulement après les preuves, puis publie le checkpoint.

### Groupes transmis au développeur

| Groupe de fichiers | Correction retenue | Observations couvertes | État au début de l’intégration |
|---|---|---|---|
| `screens.js`, `home.js`, `ai.js` hors fonctions D07 | Volume et unité kg × répétitions ; parts énergétiques des macros ; repères de saisie ; vrais noms des destinations ; durées indicatives, programmes et états vides. Les onglets de progression deviennent « 4 semaines » et « 12 mois » pour décrire les calculs existants. | CE-01 à 04, CE-08, CE-16 à 20, CF-07 pour le libellé seul | Transmis, à relire et tester |
| `community.js`, `exercises.js` | Communauté en préparation et profil local ; nombre exact de mouvements ; ressource externe distincte ; détails et ajout conservés ; lecteur YouTube décrit comme dépendant du service externe et potentiellement indisponible. | CE-05 à 07, CE-21 | Transmis, à relire et tester ; le lecteur lui-même reste à traiter en B08 |
| `settings.js`, `setup.js`, `auth.js` | Objectifs nutritionnels de départ non calculés à partir du profil ; compte local ; code de récupération affiché à l’inscription. Les textes d’import et d’effacement déjà validés ne sont pas réécrits. | CE-09, CE-14, CE-15 | Transmis, à relire et tester |
| `streak.js`, `layout.js`, `profile.js`, `community.js` | Jours de présence distincts des jours d’entraînement ; noms de badges et de records explicites. Paliers, identifiants et conditions conservés. | CE-11, CE-12 | Transmis, à relire et tester |
| `photos.js`, `screens.js`, `whey.js` | Dates d’ajout distinctes de la capture ; succès d’ajout de photos sans promesse de métadonnées ; trois états de permission ; composition de whey présentée comme une estimation générique. | CE-25 à 27 | Transmis, à relire et tester |
| `habits.js`, `nutrition.js`, `workouts.js`, `progress.js`, textes voisins modifiés | Unités d’eau, idées de repas et exemples, vocabulaire français, aide RPE, action de repos explicite et écart de volume ; accords simples des nombres d’éléments. | CE-18, CE-22 à 24, CE-28, partie de CE-30 | Transmis, à relire et tester |

Les textes des groupes ci-dessus restent à vérifier dans le navigateur. La présence d’une proposition dans ce tableau n’atteste pas encore son intégration.

### Déjà livré, sans crédit supplémentaire pour C03

- **D05** : reprise/abandon de séance et erreurs de séries. Les confirmations et messages de sauvegarde sont conservés ; l’aide RPE et les libellés de repos constituent seulement une finition éditoriale.
- **D06** : portée de l’import/effacement, garde de récupération et contrôles minimaux des formulaires. **CE-13** n’est plus un défaut présent : le texte technique sur une authentification serveur a déjà disparu de l’écran des données. **CE-29** ne décrit plus des retours silencieux pour objectif, habitude et poids ; les validations et messages de base ont été ajoutés dans D06. Leur ergonomie et leur comportement au quota restent suivis séparément.
- **D07** : calendrier et avant/après, notamment **CE-10** et **CF-02**. Les photos choisies, dates explicites, mesures distinctes et volume de période ne sont pas comptés une seconde fois. Leurs textes ne sont pas remplacés par les propositions antérieures de cet audit.
- **U03** : espace des listes, contrôle des souvenirs et labels de whey. Les mises en page ou labels déjà livrés ne sont pas attribués à C03.

### Défauts techniques toujours transférés

| Observation | Suite déjà prévue | Ce que C03 ne prétend pas résoudre |
|---|---|---|
| CF-01 | B01, brouillon de prochaine feuille | Uniformité des dates locales autour de minuit et des changements de fuseau |
| CF-03 | B03 | Progression d’objectifs décroissants et édition de la valeur courante |
| CF-04 | B04 | Séries en secondes pour les exercices chronométrés |
| CF-05 / CE-29 | B02 après les bornes déjà livrées dans D06 | Erreurs liées au champ, saisies vides explicites et cohérence mémoire-stockage des écritures quotidiennes |
| CF-06 | B05 | Gestion des fichiers photo illisibles, lots partiels et quota |
| CF-07 | B09 | Dates exactes des périodes de graphiques et équivalent accessible des données ; seuls les noms de périodes sont clarifiés dans C03 |
| CF-08 / CE-07 | B08 | Lecteur vidéo et recherche externe fiables ; décrire sa disponibilité ne le répare pas |
| CF-09 / partie de CE-30 | U04, puis contrôle de doublon avec B06 | Noms et comportement clavier uniformes des dialogues, focus et boutons de fermeture |

Les accords proches des textes modifiés sont retenus. Le formatage français systématique de tous les nombres de l’application n’est pas entrepris dans C03 et n’est pas annoncé comme livré. Les brouillons B01…B09 restent des propositions non activées ; les transférer ici ne change aucun pourcentage.
