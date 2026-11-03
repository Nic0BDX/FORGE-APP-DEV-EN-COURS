# Forge — bilan de l’accueil animé

**Jour 4 · 3 novembre 2026 · mission limitée à l’accueil.** Le corps animé, la progression d’activité et la carte des pas sont intégrés et testés. La mission s’arrête après publication de cette livraison ; elle ne déclenche pas de nouvelles journées ni l’intégration des services distants.

## Ce qui a changé

Le corps réservé a été remplacé par un **torse original généré**, stocké dans `assets/images/forge-body.png`. Un calque SVG suit les pectoraux et produit leur éclairage animé. La luminosité varie réellement : le test observe notamment une opacité passant de **0,3297 à 0,93**. L’effet suit les sept accents, peut être mis en pause avec une préférence persistante et respecte `prefers-reduced-motion`.

Le dashboard retrouve la hiérarchie de la vidéo : héro et corps, progression d’activité et calories/macros au premier rang ; sommeil, pouls et prochaines séances au deuxième ; pas et motivation au troisième. À **1280 × 805**, le premier rang commence à **86 px** et mesure **352 px** de haut ; le deuxième commence à **450 px** et mesure **280,5 px** ; la carte des pas commence à **742,5 px**. Sur téléphone, un accès rapide mène directement aux pas.

Les anneaux distinguent désormais **Bouger** (calories actives déclarées), **Exercice** (minutes calculées à partir des séances enregistrées) et **Debout** (heures déclarées). Les calories alimentaires restent dans leur propre carte. Les pas disposent d’une petite courbe et de repères de distance, calories actives et étages.

Six mesures facultatives sont conservées dans `DB.activity` : calories actives, heures debout, distance, étages, énergie ressentie et récupération ressentie. Une mesure absente reste inconnue ; elle n’est pas transformée en zéro. Énergie et récupération représentent le ressenti saisi, pas un score de santé automatique. Aucun capteur n’est annoncé comme connecté.

Les parcours précédents restent disponibles : reprise de séance, programmes, repas et hydratation, sommeil, souvenirs, comparaison photo, coach, calendrier, profil/Premium, thèmes, recherche, menus et sauvegardes. L’aperçu conserve ses données isolées.

## Répartition et tâches de cette livraison

| Tâche | Responsable | Résultat |
|---|---|---|
| ✅ A01 — Corps et éclairage pectoral | Designer UI/UX | Visuel original, zones lumineuses animées, accents et réduction du mouvement. |
| ✅ A02 — Organisation et données de l’accueil | Développeur | Grille recalée, anneaux d’activité, mesures facultatives et carte des pas enrichie. |
| ✅ A03 — Comparaison et validation | Testeur mobile | Contrôles ciblés, comparaison desktop, mobile, persistance, animations, non-régression et aperçu autonome. |

Le **Chef de projet** coordonne les statuts, le bilan et l’archive. **Contenu & idées** contribue aux libellés et à la distinction entre relevés, ressenti et données calculées. L’enregistrement officiel de A01–A03 et la création du ZIP sont effectués par le responsable principal après ce bilan ; la feuille de route générée fait foi.

## Avancement après enregistrement de A01–A03

**Global : ███████████████░░░░░ 74 % — 26/35 tâches.**

| Agent | Tâches terminées / total | Pourcentage | Barre |
|---|---:|---:|---|
| Chef de projet | 4/5 | 80 % | ████████████████░░░░ |
| Designer UI/UX | 5/6 | 83 % | █████████████████░░░ |
| Développeur | 9/12 | 75 % | ███████████████░░░░░ |
| Testeur mobile | 5/8 | 62 % | ████████████░░░░░░░░ |
| Contenu & idées | 3/4 | 75 % | ███████████████░░░░░ |

Calcul : tâches terminées ÷ tâches totales × 100, avec l’arrondi du générateur de suivi ; aucune progression partielle n’est créditée. Les trois tâches ajoutées font passer le total à 35. Le taux du Testeur suit l’arrondi actuellement utilisé par le générateur pour 62,5 %.

- **🔄 En cours : C03** — Contenu & idées, relecture éditoriale finale ; **V03** — Testeur mobile, comparaison globale des autres écrans et finitions de la mission vidéo.
- **⬜ À faire : U04** — Designer UI/UX, audit complet d’accessibilité, puis intégration et tests selon les étapes attribuées ; **P04** — Chef de projet, revue finale de couverture et préparation à la publication.
- **⏸ Bloquées : D08, D09, D10** — Développeur, comptes distants, IA et paiement ; **T04, T06** — Testeur mobile, appareils physiques et parcours des futurs services connectés.

## Validation

| Campagne | Résultat |
|---|---|
| Données d’activité, contrôles isolés | **31 réussis**, aucun échec annoncé. |
| Accueil animé, contrôles ciblés | **66 réussis**, aucun échec ; animation, accents, pause, données, périodes, mobile et structure. |
| Non-régression du carnet | **33 réussis**, **342 états**, **0 débordement horizontal**, aucune exception JavaScript relevée. |
| Interactions générales de la version vidéo | **71 réussis**, aucun échec. |
| Aperçu et isolation | **22 réussis**, dont le rendu autonome sans réseau. |

L’ouverture directe `file://` n’a pas été exécutée : le navigateur géré la bloque. Aucun essai sur téléphone physique ou Safari n’est revendiqué. Les résultats ne constituent pas une validation complète de l’accessibilité de tout le produit ; U04 reste ouverte.

## Comparaison franche avec la référence

La disposition, la densité des cartes et les composants de l’accueil ont été rapprochés de la vidéo, et l’éclairage pectoral est maintenant animé. **Le corps est une création originale : ce n’est pas l’image exacte du film.** Les données et textes sont ceux de Forge. Les adaptations mobile et tablette ne disposent pas d’un équivalent montré dans la vidéo.

Cette livraison termine le périmètre demandé sur l’accueil. Elle ne prétend pas que tous les écrans sont identiques à la vidéo : les images de nourriture et de communauté, notamment, restent des emplacements réservés hors de ce périmètre. V03 demeure ouverte pour cette comparaison globale.

## Trois améliorations proposées pour une prochaine demande

1. **C03 — Contenu & idées :** terminer la relecture des états vides, erreurs et explications des mesures sur tous les écrans.
2. **U04 — Designer, puis Développeur, puis Testeur :** terminer les parcours clavier, dialogues, contrastes et états avancés, dans cet ordre d’intervention.
3. **V03 — Testeur avec corrections attribuées par le Chef de projet :** comparer les autres écrans à la vidéo et terminer leurs visuels, sans rouvrir les tâches d’accueil déjà validées.

Le README, POINT_DE_REPRISE.md, AVANCEMENT.html et le ZIP de livraison doivent accompagner la publication. Les anciennes archives restent conservées.
