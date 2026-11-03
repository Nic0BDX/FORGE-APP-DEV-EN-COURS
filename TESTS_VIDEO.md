# Forge — validation de l’étape vidéo (Jour 4)

- **33/33 contrôles de non-régression**, **342 états**, aucun débordement horizontal : `tests/resultats-video-regression.json`.
- **71/71 contrôles vidéo** : 7 accents, recoloration, menu/Escape/focus, recherche, périodes réellement recalculées, 30 jours de sommeil, infobulles, notifications, 12 routes à 4 largeurs, persistance des accents et des relevés, validation des sauvegardes, animations et réduction de mouvement. Preuve : `tests/resultats-video-interactions.json`.
- **22/22 contrôles d’aperçu** : galerie source, interactions, isolation du stockage, HTML autonome complet et fonctionnement sans réseau. Un essai `file://` non exécuté, bloqué par la politique du navigateur : `tests/resultats-apercu-video.json`.
- Aucune exception JavaScript détectée par ces trois suites. Chromium piloté par Playwright ; aucune validation sur téléphone physique ou Safari revendiquée.

Commandes depuis la racine, avec un serveur local sur le port 8080 :

```bash
node tests/mobile-smoke.cjs
node tests/video-smoke.cjs
node tests/preview-smoke.cjs
```

Les dépendances Playwright/Chromium servent uniquement aux tests. L’application ne nécessite ni framework ni compilation. La vérification fonctionnelle est distincte de la comparaison visuelle finale, encore ouverte dans V03.
