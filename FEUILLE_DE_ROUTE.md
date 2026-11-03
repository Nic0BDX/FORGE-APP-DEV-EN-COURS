# Forge — Feuille de route

**Jour 4 · 2026-11-03 · 23/32 tâches terminées · 72 %**

Avancement global : `████████████░░░░` **72 %**

Calcul : tâches terminées ÷ tâches totales × 100, arrondi au pourcentage entier. Les tâches en cours ne donnent aucun crédit partiel. Chaque tâche pèse une unité, indépendamment de sa durée.

Source des chiffres : `docs/roadmap.json`. Le même fichier génère ce document et `AVANCEMENT.html` via `python3 docs/build_progress.py`. Toute tâche ajoutée augmente le dénominateur. Les dates de fin ne sont renseignées qu’après réalisation vérifiée.

## Répartition et ordre de travail

Le chef de projet attribue et suit chaque tâche. Le designer édite les styles et assets ; le développeur les scripts applicatifs, le point d’entrée et les aperçus ; le testeur les tests et son rapport ; Contenu & idées les propositions éditoriales. Les propositions de textes vont au développeur avant intégration. Les fichiers d’avancement et les README relèvent du chef de projet. Aucune réécriture du projet ni changement de propriétaire de fichier sans coordination.

Ordre Jour 1 : **P01 → P02 → (U01, C01) → (U02, D01, C02) → (D02, D03, D04) → (T02, T03) → P03**. T01 établit la situation de départ en parallèle. C04 prépare les idées du lendemain. Les retouches issues des tests reviennent au propriétaire du fichier.

Priorités : **P0** = base utilisable et conservation des fonctions ; **P1** = fiabilité et finition ; **P2** = évolution de production ou idée à valider. D08–D10 et T06 nécessitent des services externes : ils ne conditionnent pas l’utilisation locale, mais restent ouverts dans cette feuille complète.

**Ordre courant :** P05 → D05 → D06 (Jour 2), puis T05 → D07 → U03 (Jour 3), puis C03 et V01 → V02 → V03 (Jour 4, demande vidéo) ; U04 et P04 restent à venir. Chaque clôture attend ses preuves de test avant le checkpoint.

**U04 : une tâche, trois étapes ordonnées.** Le Designer reste responsable de sa clôture ; ces étapes ne sont pas ajoutées au dénominateur.

| Étape | Responsable | Résultat attendu avant relais |
|---|---|---|
| U04-a | Designer UI/UX | Diagnostiquer les contrastes, focus visibles et animations ; corriger les styles et geler le CSS. |
| U04-b | Développeur | Après diagnostic : dialogues au clavier (focus initial, Tab, Échap, retour au déclencheur), noms accessibles, labels des champs de paramètres et accès clavier nommé à l’édition des légendes de souvenirs actuellement déclenchée par une image. |
| U04-c | Testeur mobile | Après gel JS/CSS : vrais parcours clavier, dont édition d’une légende, contraste, thèmes, petite largeur et non-régression ; les mesures CSS seules ne suffisent pas. |

## Avancement par agent

| Agent | Avancement | Terminées / total |
|---|---|---:|
| Chef de projet | `█████████████░░░` 80 % | 4/5 |
| Designer UI/UX | `█████████████░░░` 80 % | 4/5 |
| Développeur | `████████████░░░░` 73 % | 8/11 |
| Testeur mobile | `█████████░░░░░░░` 57 % | 4/7 |
| Contenu & idées | `████████████░░░░` 75 % | 3/4 |

## Toutes les tâches

| ID | Priorité | Tâche | Responsable | Statut | Fin | Livrable / critère |
|---|---|---|---|---|---|---|
| P01 | P0 | Lire les README et dresser l’inventaire de chaque fichier et fonctionnalité | Chef de projet | ✅ Terminée | Jour 1 | INVENTAIRE.md |
| P02 | P0 | Établir la feuille de route et attribuer les responsabilités sans conflit | Chef de projet | ✅ Terminée | Jour 1 | FEUILLE_DE_ROUTE.md |
| P03 | P0 | Livrer le bilan Jour 1, le README et le tableau de bord calculé | Chef de projet | ✅ Terminée | Jour 1 | AVANCEMENT.html, README.md et JOURNAL_JOUR_1.md |
| P04 | P1 | Faire la revue finale de couverture et de préparation à la publication | Chef de projet | ⬜ À faire | — | Matrice complète et décisions sur les services externes |
| P05 | P0 | Automatiser les points de reprise et les archives après chaque tâche vérifiée | Chef de projet | ✅ Terminée | Jour 2 | tests/resultats-checkpoint.json |
| U01 | P0 | Définir la palette, la typographie et la direction visuelle Forge | Designer UI/UX | ✅ Terminée | Jour 1 | docs/DESIGN.md, palette et illustrations SVG locales |
| U02 | P0 | Refondre le socle visuel et rendre les composants lisibles sur mobile dans les deux thèmes | Designer UI/UX | ✅ Terminée | Jour 1 | CSS commun, accueil, authentification et coque |
| U03 | P1 | Affiner les écrans spécialisés, les états vides et les longues listes | Designer UI/UX | ✅ Terminée | Jour 3 | tests/resultats-u03.json ; tests/resultats-regression-u03.json ; tests/resultats-apercu-u03.json |
| U04 | P1 | Auditer contrastes, focus, animations et cohérence sur les états avancés | Designer UI/UX | ⬜ À faire | — | Audit et corrections visuelles, dialogues au clavier et labels ; validation après les étapes U04-a → U04-b → U04-c |
| D01 | P0 | Conserver l’architecture du ZIP et restaurer les accès fonctionnels masqués | Développeur | ✅ Terminée | Jour 1 | Routage, hydratation, whey et correctifs critiques observés |
| D02 | P0 | Améliorer accueil, compte et navigation mobile avec thème clair/sombre persistant | Développeur | ✅ Terminée | Jour 1 | JS applicatif existant, sans nouvelle dépendance |
| D03 | P1 | Ajouter l’écran Premium avec un état de disponibilité explicite | Développeur | ✅ Terminée | Jour 1 | Présentation sans paiement ni abonnement fictif |
| D04 | P1 | Fournir un aperçu interactif d’au moins trois écrans et isoler les données de démonstration | Développeur | ✅ Terminée | Jour 1 | APERCU.html et galerie : 22 assertions réussies, 1 essai file:// non exécuté ; rendu autonome sans réseau vérifié |
| D05 | P1 | Fiabiliser la reprise de séance et les valeurs de séries après interruption | Développeur | ✅ Terminée | Jour 2 | tests/resultats-d05.json ; tests/resultats-regression-d05.json ; tests/resultats-apercu-d05.json |
| D06 | P1 | Valider le schéma des sauvegardes et sécuriser import, migration et effacement | Développeur | ✅ Terminée | Jour 2 | tests/resultats-d06.json ; tests/resultats-regression-d06.json ; tests/resultats-apercu-d06.json |
| D07 | P1 | Affiner comparaison photo et calendrier avec sélection explicite des périodes | Développeur | ✅ Terminée | Jour 3 | tests/resultats-d07.json ; tests/resultats-d07-legendes.json ; tests/resultats-apercu-d07.json |
| D08 | P2 | Connecter les comptes multi-appareils et fournisseurs de connexion choisis | Développeur | ⏸ Bloquée | — | Nécessite choix d’un service, identifiants et hébergement |
| D09 | P2 | Connecter le coach IA et gérer attente, erreurs et historique des échanges | Développeur | ⏸ Bloquée | — | Nécessite serveur et fournisseur IA ; aucune clé dans le navigateur |
| D10 | P2 | Connecter les abonnements Premium à un service de paiement | Développeur | ⏸ Bloquée | — | Nécessite offre, tarifs et prestataire décidés par le propriétaire |
| T01 | P0 | Établir la matrice des écrans et les défauts de la version importée | Testeur mobile | ✅ Terminée | Jour 1 | Audit initial et routes inventoriées |
| T02 | P0 | Vérifier chaque écran à petite largeur dans les thèmes clair et sombre | Testeur mobile | ✅ Terminée | Jour 1 | 318 états, 6 largeurs, 2 thèmes : aucun débordement ; boutons tactiles ≥44 px |
| T03 | P0 | Exécuter les parcours de non-régression représentatifs du Jour 1 | Testeur mobile | ✅ Terminée | Jour 1 | 33/33 assertions réussies ; compte, séance, nutrition, photos, export/import et recharge |
| T04 | P1 | Compléter les vérifications sur de vrais appareils iOS et Android | Testeur mobile | ⏸ Bloquée | — | Safari, clavier, capture photo et notifications réelles |
| T05 | P1 | Tester les sauvegardes anciennes, les erreurs d’import et les interruptions | Testeur mobile | ✅ Terminée | Jour 3 | tests/resultats-t05.json |
| T06 | P2 | Vérifier les futurs services de compte, IA et paiement de bout en bout | Testeur mobile | ⏸ Bloquée | — | Après D08, D09 et D10 ; services externes requis |
| C01 | P1 | Écrire la charte éditoriale et préserver le slogan exact | Contenu & idées | ✅ Terminée | Jour 1 | docs/CONTENU_ET_IDEES.md |
| C02 | P1 | Livrer les textes d’accueil, compte et exemples IA honnêtes | Contenu & idées | ✅ Terminée | Jour 1 | Microtextes proposés puis intégrés par le développeur |
| C03 | P1 | Relire tous les messages d’erreur, états vides et explications de données | Contenu & idées | 🔄 En cours | — | Relecture exhaustive après stabilisation des parcours |
| C04 | P2 | Proposer trois améliorations utiles pour la prochaine journée | Contenu & idées | ✅ Terminée | Jour 1 | Idées priorisées et bénéfice utilisateur |
| V01 | P0 | Reprendre les composants, couleurs et structure de la vidéo de référence | Designer UI/UX | ✅ Terminée | Jour 4 | docs/COMPARAISON_VIDEO.md ; tests/resultats-video-regression.json ; tests/resultats-video-interactions.json ; tests/resultats-apercu-video.json |
| V02 | P0 | Adapter le dashboard et les écrans Forge avec accents, périodes et interactions | Développeur | ✅ Terminée | Jour 4 | tests/resultats-video-regression.json ; tests/resultats-video-interactions.json ; tests/resultats-apercu-video.json |
| V03 | P0 | Comparer la référence, corriger les écarts et livrer aperçu autonome et ZIP validés | Testeur mobile | 🔄 En cours | — | Rapport de comparaison vidéo et tests à produire |

## Points bloquants et limites

- L’authentification est locale : aucun compte synchronisé ni connexion Apple/Google n’est raccordé.
- Le coach IA reste un aperçu ; aucun fournisseur ni serveur IA n’est connecté.
- Premium présente une future offre : aucun paiement ou abonnement réel n’est actif.
- Caméra et notifications doivent encore être vérifiées sur de vrais appareils.
- L’ouverture directe file:// est interdite par le navigateur de test géré : les aperçus sont validés via HTTP, pas par double-clic dans cet environnement.

## Prochaines étapes

- Pause demandée : ne pas enchaîner une nouvelle journée avant instruction du propriétaire.
- Finir V03 : comparaison détaillée de tous les écrans avec la vidéo et derniers ajustements ; intégrer la silhouette lorsqu’elle sera fournie.
- Finaliser C03, puis U04 et P04. Les services distants restent bloqués.

**En pause à la demande du propriétaire.** Attendre une nouvelle demande. À « reprends », relire POINT_DE_REPRISE.md. Les tâches bloquées restent dans le dénominateur.
