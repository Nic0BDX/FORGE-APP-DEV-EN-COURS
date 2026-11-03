# Forge — Tests du Jour 2

Responsable : Testeur mobile. Campagne D05 exécutée le **31 octobre 2026** ; campagne D06 et sa non-régression exécutées le **3 novembre 2026**.

## D05 — Reprise de séance

**49 contrôles ciblés réussis, aucun échec, aucune exception JavaScript ni ressource en échec.** La non-régression applicative existante passe aussi **33/33 contrôles sur 318 états**, sans débordement horizontal détecté.

Preuves : [résultats D05](tests/resultats-d05.json), [non-régression D05](tests/resultats-regression-d05.json). Scénario : [tests/resilience-smoke.cjs](tests/resilience-smoke.cjs), mode `D05`.

Les contrôles utilisent Chromium réel piloté par Playwright, un contexte neuf et des comptes fictifs. Les interactions métier sont des clics et des saisies ; des injections ciblées de panne de stockage et d’un brouillon résiduel reproduisent les interruptions. Aucun carnet utilisateur n’est utilisé.

| Contrôle | Résultat |
|---|---|
| D05 — Terminer sans série validée ne crée ni séance ni XP | ✅ Réussi |
| D05 — Rechargement propose une reprise explicite sans démarrer la séance | ✅ Réussi |
| D05 — Une autre séance ne remplace pas le brouillon sans choix | ✅ Réussi |
| D05 — Modale anti-écrasement utilisable à 320px | ✅ Réussi |
| D05 — Modale anti-écrasement utilisable à 375px | ✅ Réussi |
| D05 — Fermer le choix conserve le brouillon | ✅ Réussi |
| D05 — Reprendre depuis le choix ouvre la séance précédente | ✅ Réussi |
| D05 — Carte de reprise light 320px sans débordement | ✅ Réussi |
| D05 — Boutons de reprise light 320px atteignables (44px) | ✅ Réussi |
| D05 — Carte de reprise light 375px sans débordement | ✅ Réussi |
| D05 — Boutons de reprise light 375px atteignables (44px) | ✅ Réussi |
| D05 — Carte de reprise light 390px sans débordement | ✅ Réussi |
| D05 — Boutons de reprise light 390px atteignables (44px) | ✅ Réussi |
| D05 — Carte de reprise light 768px sans débordement | ✅ Réussi |
| D05 — Carte de reprise dark 320px sans débordement | ✅ Réussi |
| D05 — Boutons de reprise dark 320px atteignables (44px) | ✅ Réussi |
| D05 — Carte de reprise dark 375px sans débordement | ✅ Réussi |
| D05 — Boutons de reprise dark 375px atteignables (44px) | ✅ Réussi |
| D05 — Carte de reprise dark 390px sans débordement | ✅ Réussi |
| D05 — Boutons de reprise dark 390px atteignables (44px) | ✅ Réussi |
| D05 — Carte de reprise dark 768px sans débordement | ✅ Réussi |
| D05 — Charges, répétitions et RPE non validés conservés | ✅ Réussi |
| D05 — Échec de sauvegarde pendant saisie annoncé sans fausse confirmation | ✅ Réussi |
| D05 — Déconnexion bloquée tant que la saisie ne peut pas être sauvegardée | ✅ Réussi |
| D05 — Saisie peut être sauvegardée après résolution du quota | ✅ Réussi |
| D05 — Série cochée restaurée | ✅ Réussi |
| D05 — Repos en pause conservé malgré recharge et attente | ✅ Réussi |
| D05 — Ajout de quinze secondes conservé en pause | ✅ Réussi |
| D05 — Repos actif tient compte du temps passé hors séance | ✅ Réussi |
| D05 — La reprise testée possède bien un brouillon persistant | ✅ Réussi |
| D05 — Échec de sauvegarde finale ne perd ni séance active ni carnet | ✅ Réussi |
| D05 — Fin répétée enregistre une seule séance avec le bon volume | ✅ Réussi |
| D05 — Historique et brouillon utilisent la même identité de séance | ✅ Réussi |
| D05 — Fin efface le brouillon du compte | ✅ Réussi |
| D05 — Recharger après fin ne duplique ni séance ni XP | ✅ Réussi |
| D05 — Un brouillon déjà terminé ne peut pas être rejoué | ✅ Réussi |
| D05 — Un autre compte ne voit pas le brouillon du premier | ✅ Réussi |
| D05 — Le compte A retrouve uniquement ses saisies | ✅ Réussi |
| D05 — Annulation supprime le brouillon sans écrire l’historique | ✅ Réussi |
| D05 — Annuler A ne modifie pas le brouillon B | ✅ Réussi |
| D05 — Refus de charge négative | ✅ Réussi |
| D05 — Refus de zéro répétition | ✅ Réussi |
| D05 — Refus de répétitions fractionnaires | ✅ Réussi |
| D05 — Refus de RPE hors intervalle | ✅ Réussi |
| D05 — Charge nulle et RPE facultatif restent acceptés | ✅ Réussi |
| D05 — Abandon depuis la carte retire définitivement le brouillon | ✅ Réussi |
| D05 — Effacement du carnet nettoie aussi sa séance en cours | ✅ Réussi |
| Aucune exception JavaScript pendant les scénarios | ✅ Réussi |
| Aucune ressource applicative en échec | ✅ Réussi |

## Captures et limites

- [Carte de reprise](tests/captures-jour2/d05-carte-reprise.png)
- [Choix empêchant l’écrasement](tests/captures-jour2/d05-choix-brouillon.png)
- [Séance restaurée](tests/captures-jour2/d05-seance-reprise.png)

La carte a été inspectée en clair et sombre à 320, 375, 390 et 768 px ; ses boutons mobiles respectent 44 px. La modale de conflit a été inspectée à 320 et 375 px, avec fermeture et reprise effectives. Les captures pleine page peuvent montrer les éléments fixes au niveau de la portion visible au moment de la capture.

La campagne D05 ne couvrait pas les sauvegardes corrompues : leur validation D06 est décrite ci-dessous. Restent non exécutés au Jour 2 : appareils physiques, Safari, fermeture puis relance du processus navigateur, expiration complète d’un repos hors de la page et brouillons anciens/malformés. Ces derniers scénarios sont réservés à T05 au Jour 3 ; les appareils réels restent T04.

## Reproduire D05

Depuis un terminal où Playwright et Chromium sont disponibles, avec le serveur statique déjà lancé à la racine :

```bash
FORGE_RESILIENCE_SCOPE=D05 \
FORGE_BASE_URL=http://127.0.0.1:8080 \
FORGE_TEST_OUTPUT=/tmp/forge-resilience-d05 \
node tests/resilience-smoke.cjs
```

Le script écrit un JSON de preuve et sort avec un statut non nul au premier échec. Les résultats du Jour 1 sont conservés séparément.


## D06 — Import, migration et récupération du carnet

**70 contrôles ciblés réussis, aucun échec, aucune exception JavaScript ni ressource en échec.** La non-régression actuelle passe **33/33 contrôles sur 318 états**, sans débordement ni bouton mobile inférieur à 44 px détecté. L’aperçu passe **22 contrôles**, dont son fonctionnement autonome sans réseau ; l’essai `file://` reste non exécuté, interdit par le navigateur géré.

Preuves : [résultats D06](tests/resultats-d06.json), [non-régression D06](tests/resultats-regression-d06.json), [aperçu D06](tests/resultats-apercu-d06.json). Ces campagnes ne sont pas additionnées aux anciens résultats pour prétendre à des scénarios uniques supplémentaires.

La validation passe par les vrais champs d’import de fichiers et les boutons de confirmation/annulation. Les comptes et photos sont fictifs. Les quotas sont des pannes injectées sur l’écriture canonique du seul compte concerné ; ce test ne constitue pas une mesure du quota réel de chaque navigateur.

- Refus de 16 fichiers invalides : JSON, racine, listes, mesure nulle, date inexistante, identifiants doublés, nombre infini, pollution de prototype, identifiant/code, image injectée, version future, profondeur et taille.
- Aperçu avant remplacement, annulation sans perte, programme actif manquant signalé, compatibilité des champs supplémentaires préservée jusqu’à l’export.
- Migration d’anciens champs manquants, export versionné et restauration d’un repas supprimé.
- Quota pendant import/effacement : carnet et séance en cours restent présents ; changement de compte entre aperçu et confirmation : remplacement refusé.
- Après import ou effacement, une nouvelle séance demeure reprenable au rechargement.
- JSON local incomplet ou structure invalide : panneau de récupération, conservation du fichier brut, export caractère pour caractère, compte sain utilisable, retour par vraie connexion au compte atteint puis restauration réussie.

| Contrôle ciblé | Résultat |
|---|---|
| D06 — Refus sans perte : JSON syntaxiquement invalide | ✅ Réussi |
| D06 — Fichier dangereux refusé avant confirmation : JSON syntaxiquement invalide | ✅ Réussi |
| D06 — Refus sans perte : racine tableau | ✅ Réussi |
| D06 — Fichier dangereux refusé avant confirmation : racine tableau | ✅ Réussi |
| D06 — Refus sans perte : racine null | ✅ Réussi |
| D06 — Fichier dangereux refusé avant confirmation : racine null | ✅ Réussi |
| D06 — Refus sans perte : tableau de séances remplacé par chaîne | ✅ Réussi |
| D06 — Fichier dangereux refusé avant confirmation : tableau de séances remplacé par chaîne | ✅ Réussi |
| D06 — Refus sans perte : séance de type null | ✅ Réussi |
| D06 — Fichier dangereux refusé avant confirmation : séance de type null | ✅ Réussi |
| D06 — Refus sans perte : mesure de type null | ✅ Réussi |
| D06 — Fichier dangereux refusé avant confirmation : mesure de type null | ✅ Réussi |
| D06 — Refus sans perte : date de poids inexistante | ✅ Réussi |
| D06 — Fichier dangereux refusé avant confirmation : date de poids inexistante | ✅ Réussi |
| D06 — Refus sans perte : identifiants programmes en double | ✅ Réussi |
| D06 — Fichier dangereux refusé avant confirmation : identifiants programmes en double | ✅ Réussi |
| D06 — Refus sans perte : nombre non fini | ✅ Réussi |
| D06 — Fichier dangereux refusé avant confirmation : nombre non fini | ✅ Réussi |
| D06 — Refus sans perte : prototype racine interdit | ✅ Réussi |
| D06 — Fichier dangereux refusé avant confirmation : prototype racine interdit | ✅ Réussi |
| D06 — Refus sans perte : prototype imbriqué interdit | ✅ Réussi |
| D06 — Fichier dangereux refusé avant confirmation : prototype imbriqué interdit | ✅ Réussi |
| D06 — Refus sans perte : identifiant programme contenant du code | ✅ Réussi |
| D06 — Fichier dangereux refusé avant confirmation : identifiant programme contenant du code | ✅ Réussi |
| D06 — Refus sans perte : photo avec attribut HTML injecté | ✅ Réussi |
| D06 — Fichier dangereux refusé avant confirmation : photo avec attribut HTML injecté | ✅ Réussi |
| D06 — Refus sans perte : version de sauvegarde future | ✅ Réussi |
| D06 — Fichier dangereux refusé avant confirmation : version de sauvegarde future | ✅ Réussi |
| D06 — Refus sans perte : profondeur excessive | ✅ Réussi |
| D06 — Fichier dangereux refusé avant confirmation : profondeur excessive | ✅ Réussi |
| D06 — Refus sans perte : fichier dépassant 16 MiB | ✅ Réussi |
| D06 — Fichier dangereux refusé avant confirmation : fichier dépassant 16 MiB | ✅ Réussi |
| D06 — Imports refusés préservent aussi le brouillon actif | ✅ Réussi |
| D06 — Référence à un ancien programme annoncée avant import | ✅ Réussi |
| D06 — Ancien format valide attend une confirmation sans modifier le carnet | ✅ Réussi |
| D06 — Confirmation import accessible à 320px | ✅ Réussi |
| D06 — Confirmation import accessible à 375px | ✅ Réussi |
| D06 — Confirmation import accessible à 390px | ✅ Réussi |
| D06 — Annuler un import préserve carnet et brouillon | ✅ Réussi |
| D06 — Quota pendant import préserve ancien carnet et brouillon | ✅ Réussi |
| D06 — Ancien carnet migré conserve programmes et repas | ✅ Réussi |
| D06 — Champs supplémentaires compatibles conservés sans perte | ✅ Réussi |
| D06 — Champs absents complétés avec valeurs par défaut | ✅ Réussi |
| D06 — Import confirmé nettoie seulement le brouillon du compte courant | ✅ Réussi |
| D06 — Import confirmé persiste au rechargement | ✅ Réussi |
| D06 — Une nouvelle séance après import reste reprenable | ✅ Réussi |
| D06 — Export versionné garde les champs du carnet | ✅ Réussi |
| D06 — Champs supplémentaires conservés dans l’export | ✅ Réussi |
| D06 — Export ne contient aucun compte ou mot de passe | ✅ Réussi |
| D06 — Modification locale avant restauration réellement effectuée | ✅ Réussi |
| D06 — Aller-retour export/import restaure le repas supprimé | ✅ Réussi |
| D06 — Changement de compte entre préparation et confirmation bloque le remplacement | ✅ Réussi |
| D06 — Annuler un effacement ne modifie aucune donnée | ✅ Réussi |
| D06 — Échec d’effacement conserve carnet et brouillon | ✅ Réussi |
| D06 — Effacement confirmé nettoie le compte courant et garde l’autre | ✅ Réussi |
| D06 — Une nouvelle séance après effacement reste reprenable | ✅ Réussi |
| D06 — JSON local incomplet affiche la récupération sans écraser le brut | ✅ Réussi |
| D06 — Navigation protégée préserve JSON local incomplet | ✅ Réussi |
| D06 — Panneau récupération utilisable à 320px : JSON local incomplet | ✅ Réussi |
| D06 — Export de secours préserve chaque caractère : JSON local incomplet | ✅ Réussi |
| D06 — Autre compte utilisable pendant la récupération : JSON local incomplet | ✅ Réussi |
| D06 — Restauration confirmée lève la protection : JSON local incomplet | ✅ Réussi |
| D06 — structure locale invalide affiche la récupération sans écraser le brut | ✅ Réussi |
| D06 — Navigation protégée préserve structure locale invalide | ✅ Réussi |
| D06 — Panneau récupération utilisable à 320px : structure locale invalide | ✅ Réussi |
| D06 — Export de secours préserve chaque caractère : structure locale invalide | ✅ Réussi |
| D06 — Autre compte utilisable pendant la récupération : structure locale invalide | ✅ Réussi |
| D06 — Restauration confirmée lève la protection : structure locale invalide | ✅ Réussi |
| Aucune exception JavaScript pendant les scénarios | ✅ Réussi |
| Aucune ressource applicative en échec | ✅ Réussi |

### Captures D06

- [Confirmation d’import](tests/captures-jour2/d06-confirmation-import.png)
- [Récupération d’un JSON incomplet](tests/captures-jour2/d06-recuperation-json.png)
- [Récupération d’une structure invalide](tests/captures-jour2/d06-recuperation-schema.png)

La confirmation est mesurée à 320, 375 et 390 px ; les panneaux de récupération à 320 px. Le clavier virtuel et l’ouverture du sélecteur de fichiers sur téléphone physique ne sont pas validés par ces émulations.

### Reproduire D06 et ses régressions

```bash
FORGE_RESILIENCE_SCOPE=D06 FORGE_TEST_OUTPUT=/tmp/forge-resilience-d06 node tests/resilience-smoke.cjs
FORGE_TEST_LABEL=regression-d06 FORGE_TEST_OUTPUT=/tmp/forge-regression-d06 node tests/mobile-smoke.cjs
python3 preview/build-standalone.py
FORGE_ARTIFACTS=/tmp/forge-apercu-d06 node tests/preview-smoke.cjs
```

Le sélecteur de la régression import a été adapté à la nouvelle confirmation explicite. Aucune assertion métier antérieure n’a été retirée. Le sélecteur d’effacement suit désormais le libellé précis **« Effacer le carnet de ce compte »**.
