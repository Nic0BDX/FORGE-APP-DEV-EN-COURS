/* Forge — Résilience, Jour 2.
 * Prérequis de test : Node.js, Playwright, Chromium. Aucune dépendance de l’app.
 * FORGE_RESILIENCE_SCOPE=D05|D06|all node tests/resilience-smoke.cjs
 * Tous les comptes sont fictifs dans un contexte navigateur neuf.
 */
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { chromium } = require('playwright');
const baseURL = process.env.FORGE_BASE_URL || 'http://127.0.0.1:8080';
const scope = (process.env.FORGE_RESILIENCE_SCOPE || 'D05').toUpperCase();
if (!['D05', 'D06', 'ALL'].includes(scope)) throw new Error('FORGE_RESILIENCE_SCOPE doit être D05, D06 ou all.');
const output = process.env.FORGE_TEST_OUTPUT || path.join(os.tmpdir(), 'forge-resilience-' + scope.toLowerCase());
fs.mkdirSync(output, { recursive: true });
const password = 'Forge-Test-2026!';
const report = { task: scope, startedAt: new Date().toISOString(), baseURL, browser: null, status: 'running', checks: [], pageErrors: [], requestFailures: [], screenshots: [] };
const resultPath = path.join(output, 'resultats-' + scope.toLowerCase() + '.json');
function persist() {
  report.passed = report.checks.filter(c => c.status === 'passed').length;
  report.failed = report.checks.filter(c => c.status === 'failed').length;
  fs.writeFileSync(resultPath + '.tmp', JSON.stringify(report, null, 2));
  fs.renameSync(resultPath + '.tmp', resultPath);
}
function check(name, actual, detail = '') {
  const passed = Boolean(actual);
  report.checks.push({ name, status: passed ? 'passed' : 'failed', detail });
  persist();
  if (!passed) throw new Error(name + (detail ? ' — ' + detail : ''));
}
async function navigate(page, route) { await page.evaluate(route => nav(route), route); }
async function register(page, email, name) {
  await page.goto(baseURL);
  if (await page.evaluate(() => isLogged())) await page.evaluate(() => logout());
  await page.locator('.ea-actions button').filter({ hasText: 'Créer' }).click();
  await page.locator('#regName').fill(name);
  await page.locator('#authEmail').fill(email);
  await page.locator('#authPass').fill(password);
  await page.locator('#authPass').press('Enter');
  await page.locator('.rec-code').waitFor();
  await page.locator('#setupName').waitFor();
  await page.getByRole('button', { name: 'J’ai noté mon code', exact: true }).click();
  await page.getByRole('button', { name: /Créer mon espace/ }).click();
  await page.locator('.eh').waitFor();
}
async function logout(page) {
  await navigate(page, 'settings');
  await page.getByRole('button', { name: 'Se déconnecter', exact: true }).click();
  await page.locator('.ea-actions').waitFor();
}
async function login(page, email, expectedScreen = '.eh') {
  await page.locator('.ea-actions button').filter({ hasText: /connecter/ }).click();
  await page.locator('#authEmail').fill(email);
  await page.locator('#authPass').fill(password);
  await page.locator('#authPass').press('Enter');
  await page.locator(expectedScreen).waitFor();
}
async function installProgram(page) {
  await navigate(page, 'workouts');
  await page.getByRole('button', { name: 'Ajouter à mon programme', exact: true }).first().click();
  await page.locator('.r-day').first().waitFor();
}
async function start(page) {
  await navigate(page, 'program');
  await page.locator('.r-day').first().click();
  await page.getByRole('button', { name: /Commencer la séance/ }).click();
  await page.locator('.es-set').first().waitFor();
}
async function fillSet(page, {weight = '20.5', reps = '10', rpe = '7.5'} = {}) {
  await page.getByLabel('Charge série 1', { exact: true }).first().fill(weight);
  await page.getByLabel('Répétitions série 1', { exact: true }).first().fill(reps);
  await page.getByLabel('RPE série 1', { exact: true }).first().fill(rpe);
}
async function resume(page) {
  await page.getByRole('button', { name: 'Reprendre la séance', exact: true }).click();
  await page.locator('.es-set').first().waitFor();
}
async function screenshot(page, name) {
  const file = name + '.png';
  await page.screenshot({ path: path.join(output, file), fullPage: true });
  report.screenshots.push(file);
}
async function dimensions(page) {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const visibleButtons = [...document.querySelectorAll('button')].filter(el => {
      const r = el.getBoundingClientRect(), s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';
    });
    return { width, scrollWidth: document.documentElement.scrollWidth, smallButtons: visibleButtons.filter(el => { const r = el.getBoundingClientRect(); return r.width < 43.5 || r.height < 43.5; }).map(el => el.getAttribute('aria-label') || el.textContent.trim()) };
  });
}
async function testD05(page) {
  const emailA = 'reprise.a@example.test', emailB = 'reprise.b@example.test';
  await register(page, emailA, 'Camille Reprise');
  await installProgram(page);
  await start(page);
  const xpBeforeEmpty = await page.evaluate(() => DB.xp);
  await page.getByRole('button', { name: 'Terminer la séance', exact: true }).last().click();
  check('D05 — Terminer sans série validée ne crée ni séance ni XP', await page.evaluate(expected => session !== null && DB.sessions.length === 0 && DB.xp === expected, xpBeforeEmpty));
  await fillSet(page);
  await page.getByLabel('Charge série 2', { exact: true }).first().fill('12.5');
  await page.getByLabel('Répétitions série 2', { exact: true }).first().fill('8');
  await page.getByLabel('RPE série 2', { exact: true }).first().fill('6');
  await page.reload();
  await page.getByRole('button', { name: 'Reprendre la séance', exact: true }).waitFor();
  check('D05 — Rechargement propose une reprise explicite sans démarrer la séance', await page.evaluate(() => session === null && view === 'home' && DB.sessions.length === 0));
  const protectedDraft = await page.evaluate(() => localStorage.getItem('forge_workout_draft_v1:' + encodeURIComponent(currentEmail())));
  await navigate(page, 'workouts');
  await page.getByRole('button', {name:'Ajouter à mon programme',exact:true}).nth(1).click();
  await page.locator('.r-day').last().click();
  await page.getByRole('button', {name:/Commencer la séance/}).click();
  await page.locator('#modal.show').waitFor();
  check('D05 — Une autre séance ne remplace pas le brouillon sans choix', await page.evaluate(expected => session===null && localStorage.getItem('forge_workout_draft_v1:' + encodeURIComponent(currentEmail()))===expected, protectedDraft));
  for(const width of [320,375]){
    await page.setViewportSize({width,height:width===320?568:844});
    const d=await dimensions(page);
    check(`D05 — Modale anti-écrasement utilisable à ${width}px`,d.scrollWidth<=d.width && d.smallButtons.length===0,JSON.stringify(d));
  }
  await screenshot(page, 'd05-choix-brouillon');
  await page.locator('#modalbox').getByRole('button',{name:'Fermer',exact:true}).click();
  check('D05 — Fermer le choix conserve le brouillon', await page.evaluate(expected => localStorage.getItem('forge_workout_draft_v1:' + encodeURIComponent(currentEmail()))===expected,protectedDraft));
  await page.getByRole('button', {name:/Commencer la séance/}).click();
  await page.locator('#modalbox').getByRole('button',{name:'Reprendre la séance',exact:true}).click();
  check('D05 — Reprendre depuis le choix ouvre la séance précédente',await page.evaluate(expected => session.id===expected,JSON.parse(protectedDraft).session.id));
  await page.reload();
  await page.getByRole('button', {name:'Reprendre la séance',exact:true}).waitFor();
  for (const theme of ['light', 'dark']) {
    await page.evaluate(theme => { DB.settings.theme = theme; save(); render(); }, theme);
    for (const width of [320, 375, 390, 768]) {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 844 });
      const d = await dimensions(page);
      check(`D05 — Carte de reprise ${theme} ${width}px sans débordement`, d.scrollWidth <= d.width, JSON.stringify(d));
      if (width <= 390) check(`D05 — Boutons de reprise ${theme} ${width}px atteignables (44px)`, d.smallButtons.length === 0, JSON.stringify(d.smallButtons));
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => { DB.settings.theme = 'light'; save(); render(); });
  await screenshot(page, 'd05-carte-reprise');
  await resume(page);
  check('D05 — Charges, répétitions et RPE non validés conservés',
    await page.getByLabel('Charge série 1', { exact: true }).first().inputValue() === '20.5' &&
    await page.getByLabel('Répétitions série 1', { exact: true }).first().inputValue() === '10' &&
    await page.getByLabel('RPE série 1', { exact: true }).first().inputValue() === '7.5' &&
    await page.getByLabel('Charge série 2', { exact: true }).first().inputValue() === '12.5' &&
    await page.getByLabel('Répétitions série 2', { exact: true }).first().inputValue() === '8' &&
    await page.getByLabel('RPE série 2', { exact: true }).first().inputValue() === '6');
  await page.evaluate(() => {
    window.__forgeNativeSetItem=Storage.prototype.setItem;
    Storage.prototype.setItem=function(key,value){ if(String(key).startsWith('forge_workout_draft_v1:'))throw new DOMException('Quota de test','QuotaExceededError');return window.__forgeNativeSetItem.call(this,key,value); };
  });
  await page.getByLabel('Charge série 1',{exact:true}).first().fill('21.5');
  check('D05 — Échec de sauvegarde pendant saisie annoncé sans fausse confirmation', await page.locator('#workoutDraftStatus').getAttribute('role')==='alert' && /échoué/.test(await page.locator('#workoutDraftStatus').textContent()));
  await page.evaluate(() => logout());
  check('D05 — Déconnexion bloquée tant que la saisie ne peut pas être sauvegardée',await page.evaluate(() => isLogged() && session!==null && session.exercises[0].sets[0].weight==='21.5'));
  await page.evaluate(() => {Storage.prototype.setItem=window.__forgeNativeSetItem;delete window.__forgeNativeSetItem;});
  await page.getByLabel('Charge série 1',{exact:true}).first().fill('20.5');
  check('D05 — Saisie peut être sauvegardée après résolution du quota',await page.locator('#workoutDraftStatus').getAttribute('role')==='status');
  await page.getByRole('button', { name: 'Valider la série 1', exact: true }).first().click();
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const paused = await page.evaluate(() => rest);
  await page.reload();
  await page.getByRole('button', { name: 'Reprendre la séance', exact: true }).waitFor();
  await page.waitForTimeout(1200);
  await resume(page);
  check('D05 — Série cochée restaurée', await page.getByRole('button', { name: 'Valider la série 1', exact: true }).first().getAttribute('aria-pressed') === 'true');
  check('D05 — Repos en pause conservé malgré recharge et attente', await page.evaluate(expected => restPaused && Math.abs(rest - expected) <= 1, paused));
  await page.getByRole('button', { name: '+15 s', exact: true }).click();
  await page.reload(); await resume(page);
  check('D05 — Ajout de quinze secondes conservé en pause', await page.evaluate(expected => restPaused && Math.abs(rest - expected - 15) <= 1, paused));
  await page.getByRole('button', { name: 'Reprendre', exact: true }).click();
  const running = await page.evaluate(() => rest);
  await page.reload();
  await page.getByRole('button', { name: 'Reprendre la séance', exact: true }).waitFor();
  await page.waitForTimeout(2200);
  await resume(page);
  check('D05 — Repos actif tient compte du temps passé hors séance', await page.evaluate(expected => !restPaused && rest <= expected - 2 && rest > 0, running));
  await screenshot(page, 'd05-seance-reprise');
  const beforeFinish = await page.evaluate(() => ({ draft: localStorage.getItem('forge_workout_draft_v1:' + encodeURIComponent(currentEmail())), xp: DB.xp, data:JSON.stringify(DB), account:localStorage.getItem('forge_data_' + currentEmail()) }));
  check('D05 — La reprise testée possède bien un brouillon persistant', Boolean(beforeFinish.draft) && Boolean(JSON.parse(beforeFinish.draft).session.id));
  // Simule un quota/accès refusé uniquement sur la prochaine écriture du carnet du compte.
  await page.evaluate(() => {
    window.__forgeNativeSetItem = Storage.prototype.setItem;
    const blockedKey = 'forge_data_' + currentEmail();
    Storage.prototype.setItem = function(key, value) { if(key===blockedKey) throw new DOMException('Quota de test','QuotaExceededError'); return window.__forgeNativeSetItem.call(this,key,value); };
  });
  await page.getByRole('button', { name: 'Terminer la séance', exact: true }).last().click();
  check('D05 — Échec de sauvegarde finale ne perd ni séance active ni carnet', await page.evaluate(expected => session !== null && JSON.stringify(DB)===expected.data && localStorage.getItem('forge_data_' + currentEmail())===expected.account && localStorage.getItem('forge_workout_draft_v1:' + encodeURIComponent(currentEmail()))!==null, beforeFinish));
  await page.evaluate(() => { Storage.prototype.setItem=window.__forgeNativeSetItem; delete window.__forgeNativeSetItem; });
  await page.getByRole('button', { name: 'Terminer la séance', exact: true }).last().evaluate(button => { button.click(); button.click(); });
  await page.locator('.esum').waitFor();
  check('D05 — Fin répétée enregistre une seule séance avec le bon volume', await page.evaluate(() => DB.sessions.length === 1 && DB.sessions[0].volume === 205 && DB.sessions[0].sets === 1));
  const finished = await page.evaluate(() => ({ xp: DB.xp, id: DB.sessions[0].id }));
  check('D05 — Historique et brouillon utilisent la même identité de séance', finished.id===JSON.parse(beforeFinish.draft).session.id);
  check('D05 — Fin efface le brouillon du compte', await page.evaluate(() => localStorage.getItem('forge_workout_draft_v1:' + encodeURIComponent(currentEmail())) === null));
  await page.reload();
  check('D05 — Recharger après fin ne duplique ni séance ni XP', await page.evaluate(expected => DB.sessions.length === 1 && DB.sessions[0].id === expected.id && DB.xp === expected.xp, finished));
  // Simule une interruption après sauvegarde du carnet et avant suppression du brouillon.
  await page.evaluate(draft => localStorage.setItem('forge_workout_draft_v1:' + encodeURIComponent(currentEmail()), draft), beforeFinish.draft);
  await page.reload();
  check('D05 — Un brouillon déjà terminé ne peut pas être rejoué', await page.getByRole('button', { name: 'Reprendre la séance', exact: true }).count() === 0 && await page.evaluate(expected => DB.sessions.length === 1 && DB.xp === expected, finished.xp));
  await start(page); await fillSet(page, {weight:'13', reps:'9', rpe:'6'});
  await logout(page);
  await register(page, emailB, 'Morgan Reprise');
  check('D05 — Un autre compte ne voit pas le brouillon du premier', await page.getByRole('button', { name: 'Reprendre la séance', exact: true }).count() === 0 && await page.evaluate(() => DB.sessions.length === 0));
  await installProgram(page); await start(page); await fillSet(page, {weight:'77', reps:'5', rpe:'8'});
  await logout(page); await login(page, emailA); await resume(page);
  check('D05 — Le compte A retrouve uniquement ses saisies', await page.getByLabel('Charge série 1', { exact: true }).first().inputValue() === '13' && await page.evaluate(() => DB.sessions.length === 1));
  await page.getByRole('button', { name: 'Annuler sans enregistrer', exact: true }).click();
  await page.reload();
  check('D05 — Annulation supprime le brouillon sans écrire l’historique', await page.getByRole('button', { name: 'Reprendre la séance', exact: true }).count() === 0 && await page.evaluate(() => DB.sessions.length === 1));
  await logout(page); await login(page, emailB); await resume(page);
  check('D05 — Annuler A ne modifie pas le brouillon B', await page.getByLabel('Charge série 1', { exact: true }).first().inputValue() === '77');
  for (const invalid of [
    {label:'charge négative',weight:'-1',reps:'10',rpe:'7'},
    {label:'zéro répétition',weight:'20',reps:'0',rpe:'7'},
    {label:'répétitions fractionnaires',weight:'20',reps:'2.5',rpe:'7'},
    {label:'RPE hors intervalle',weight:'20',reps:'10',rpe:'11'}
  ]) {
    await fillSet(page, invalid);
    await page.getByRole('button', { name: 'Valider la série 1', exact: true }).first().click();
    check('D05 — Refus de ' + invalid.label, await page.evaluate(() => !session.exercises[0].sets[0].done && DB.sessions.length === 0));
  }
  await fillSet(page, {weight:'0',reps:'10',rpe:''});
  await page.getByRole('button', { name: 'Valider la série 1', exact: true }).first().click();
  check('D05 — Charge nulle et RPE facultatif restent acceptés', await page.evaluate(() => session.exercises[0].sets[0].done));
  await page.reload();
  await page.getByRole('button', { name: 'Abandonner la séance', exact: true }).click();
  await page.reload();
  check('D05 — Abandon depuis la carte retire définitivement le brouillon', await page.getByRole('button', { name: 'Reprendre la séance', exact: true }).count() === 0 && await page.evaluate(() => DB.sessions.length === 0));
  await start(page); await fillSet(page);
  await navigate(page, 'settings');
  await page.getByRole('button', { name: 'Effacer le carnet de ce compte', exact: true }).click();
  await page.reload();
  check('D05 — Effacement du carnet nettoie aussi sa séance en cours', await page.evaluate(() => localStorage.getItem('forge_workout_draft_v1:' + encodeURIComponent(currentEmail())) === null && !DB.profile.setup && DB.sessions.length === 0));
}
async function uploadJSON(page, text) {
  await navigate(page, 'settings');
  await page.locator('#importFile').setInputFiles({ name: 'sauvegarde-test.json', mimeType: 'application/json', buffer: Buffer.from(text) });
  await page.waitForTimeout(150);
}
async function snapshot(page) {
  return page.evaluate(() => ({ data: JSON.stringify(DB), account: localStorage.getItem('forge_data_' + currentEmail()) }));
}
async function testD06(page) {
  const emailA='sauvegarde.a@example.test', emailB='sauvegarde.b@example.test';
  await register(page,emailA,'Camille Sauvegarde');
  await installProgram(page);
  await navigate(page,'nutrition');
  await page.getByRole('button',{name:'Banane',exact:true}).click();
  await page.locator('#mealGrams').fill('150');
  await page.locator('#modalbox').getByRole('button',{name:'Ajouter',exact:true}).click();
  await start(page); await fillSet(page,{weight:'18',reps:'8',rpe:'6'});
  await logout(page);
  await register(page,emailB,'Morgan Sauvegarde');
  const otherAccount=await page.evaluate(()=>localStorage.getItem('forge_data_'+currentEmail()));
  await logout(page); await login(page,emailA);
  await navigate(page,'settings');
  const initial=await snapshot(page);
  const initialDraft=await page.evaluate(()=>localStorage.getItem('forge_workout_draft_v1:'+encodeURIComponent(currentEmail())));
  const valid=JSON.parse(initial.data);
  const candidate=updates=>JSON.stringify({...valid,...updates});
  let deep={value:'fin'};for(let i=0;i<60;i++)deep={nested:deep};
  const malformed=[
    ['JSON syntaxiquement invalide','{"profile":'],
    ['racine tableau','[]'],
    ['racine null','null'],
    ['tableau de séances remplacé par chaîne',candidate({sessions:'pas-un-tableau'})],
    ['séance de type null',candidate({sessions:[null]})],
    ['mesure de type null',candidate({measurements:[null]})],
    ['date de poids inexistante',candidate({weights:[{date:'2026-02-30',value:70}]})],
    ['identifiants programmes en double',candidate({programs:[valid.programs[0],valid.programs[0]]})],
    ['nombre non fini',candidate({settings:{...valid.settings,calories:'__INFINITY__'}}).replace('"__INFINITY__"','1e999')],
    ['prototype racine interdit',candidate({}).replace('{','{"__proto__":{"polluted":true},')],
    ['prototype imbriqué interdit',candidate({lastSets:JSON.parse('{"__proto__":{"polluted":true}}')})],
    ['identifiant programme contenant du code',candidate({programs:[{...valid.programs[0],id:"x');window.__forgeInjected=true;//"}],activeProgram:"x');window.__forgeInjected=true;//"})],
    ['photo avec attribut HTML injecté',candidate({photos:[{id:'p1',date:'2026-10-31',data:'x" onerror="window.__forgeInjected=true'}]})],
    ['version de sauvegarde future',candidate({_forgeBackup:{format:'forge-carnet',version:999,exportedAt:new Date().toISOString()}})],
    ['profondeur excessive',candidate({extra:deep})],
    ['fichier dépassant 16 MiB',candidate({extra:'x'.repeat(16*1024*1024)})]
  ];
  for(const [name,input] of malformed){
    await uploadJSON(page,input);
    const after=await snapshot(page);
    check('D06 — Refus sans perte : '+name,after.data===initial.data&&after.account===initial.account);
    check('D06 — Fichier dangereux refusé avant confirmation : '+name,await page.getByRole('button',{name:'Remplacer mon carnet',exact:true}).count()===0 && await page.evaluate(()=>!window.__forgeInjected&&!({}).polluted));
  }
  check('D06 — Imports refusés préservent aussi le brouillon actif',await page.evaluate(expected=>localStorage.getItem('forge_workout_draft_v1:'+encodeURIComponent(currentEmail()))===expected,initialDraft));
  await uploadJSON(page,candidate({activeProgram:'programme-supprime'}));
  await page.getByRole('button',{name:'Remplacer mon carnet',exact:true}).waitFor();
  check('D06 — Référence à un ancien programme annoncée avant import',await page.locator('.backup-preview').textContent().then(text=>text.includes('Le programme actif n’existe plus'))&&JSON.stringify(await snapshot(page))===JSON.stringify(initial));
  await page.locator('#modalbox').getByRole('button',{name:'Annuler',exact:true}).click();
  const legacy=JSON.parse(initial.data);
  legacy.profile.name='Camille migrée';
  legacy.extraChronicle={source:'ancienne-extension',entries:[{note:'Champ conservé',amount:12}]};
  delete legacy.settings.water;
  delete legacy.profile.level;
  delete legacy.whey;
  delete legacy.visitMilestones;
  await uploadJSON(page,JSON.stringify(legacy));
  await page.getByRole('button',{name:'Remplacer mon carnet',exact:true}).waitFor();
  check('D06 — Ancien format valide attend une confirmation sans modifier le carnet',JSON.stringify(await snapshot(page))===JSON.stringify(initial));
  await screenshot(page,'d06-confirmation-import');
  for(const width of [320,375,390]){
    await page.setViewportSize({width,height:width===320?568:844});
    const d=await dimensions(page);
    check(`D06 — Confirmation import accessible à ${width}px`,d.scrollWidth<=d.width&&d.smallButtons.length===0,JSON.stringify(d));
  }
  await page.setViewportSize({width:390,height:844});
  await page.locator('#modalbox').getByRole('button',{name:'Annuler',exact:true}).click();
  check('D06 — Annuler un import préserve carnet et brouillon',JSON.stringify(await snapshot(page))===JSON.stringify(initial)&&await page.evaluate(expected=>localStorage.getItem('forge_workout_draft_v1:'+encodeURIComponent(currentEmail()))===expected,initialDraft));
  await uploadJSON(page,JSON.stringify(legacy));
  await page.getByRole('button',{name:'Remplacer mon carnet',exact:true}).waitFor();
  await page.evaluate(()=>{
    window.__forgeNativeSetItem=Storage.prototype.setItem;
    const blocked='forge_data_'+currentEmail();
    Storage.prototype.setItem=function(key,value){if(key===blocked)throw new DOMException('Quota de test','QuotaExceededError');return window.__forgeNativeSetItem.call(this,key,value);};
  });
  await page.getByRole('button',{name:'Remplacer mon carnet',exact:true}).click();
  check('D06 — Quota pendant import préserve ancien carnet et brouillon',JSON.stringify(await snapshot(page))===JSON.stringify(initial)&&await page.evaluate(expected=>localStorage.getItem('forge_workout_draft_v1:'+encodeURIComponent(currentEmail()))===expected,initialDraft));
  await page.evaluate(()=>{Storage.prototype.setItem=window.__forgeNativeSetItem;delete window.__forgeNativeSetItem;closeModal();});
  await uploadJSON(page,JSON.stringify(legacy));
  await page.getByRole('button',{name:'Remplacer mon carnet',exact:true}).click();
  await page.waitForFunction(()=>DB.profile.name==='Camille migrée');
  check('D06 — Ancien carnet migré conserve programmes et repas',await page.evaluate(()=>DB.programs.length===1&&DB.meals.length===1&&DB.meals[0].grams===150));
  check('D06 — Champs supplémentaires compatibles conservés sans perte',await page.evaluate(expected=>JSON.stringify(DB.extraChronicle)===JSON.stringify(expected),legacy.extraChronicle));
  check('D06 — Champs absents complétés avec valeurs par défaut',await page.evaluate(()=>DB.settings.water===defaultDB().settings.water&&DB.profile.level===defaultDB().profile.level&&DB.whey.enabled===false&&Array.isArray(DB.visitMilestones)));
  check('D06 — Import confirmé nettoie seulement le brouillon du compte courant',await page.evaluate(({expected,email})=>localStorage.getItem('forge_workout_draft_v1:'+encodeURIComponent(currentEmail()))===null&&localStorage.getItem('forge_data_'+email)===expected,{expected:otherAccount,email:emailB}));
  await page.reload();
  check('D06 — Import confirmé persiste au rechargement',await page.evaluate(()=>DB.profile.name==='Camille migrée'&&DB.meals.length===1));
  await start(page);await fillSet(page,{weight:'22',reps:'7',rpe:'6'});
  await page.reload();await resume(page);
  check('D06 — Une nouvelle séance après import reste reprenable',await page.getByLabel('Charge série 1',{exact:true}).first().inputValue()==='22'&&await page.evaluate(()=>session.exercises[0].sets[0].reps==='7'));
  await page.getByRole('button',{name:'Annuler sans enregistrer',exact:true}).click();

  await navigate(page,'settings');
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Exporter JSON',exact:true}).click();
  const download=await downloadPromise;
  const exportPath=path.join(output,'sauvegarde-valide.json');
  await download.saveAs(exportPath);
  const exported=JSON.parse(fs.readFileSync(exportPath,'utf8'));
  check('D06 — Export versionné garde les champs du carnet',exported._forgeBackup?.format==='forge-carnet'&&exported._forgeBackup?.version===1&&exported.profile.name==='Camille migrée'&&exported.programs.length===1&&exported.meals.length===1);
  check('D06 — Champs supplémentaires conservés dans l’export',JSON.stringify(exported.extraChronicle)===JSON.stringify(legacy.extraChronicle));
  check('D06 — Export ne contient aucun compte ou mot de passe',!('AUTH' in exported)&&!('accounts' in exported)&&!('hash' in exported)&&!('salt' in exported));
  await navigate(page,'nutrition');
  await page.getByRole('button',{name:'Supprimer',exact:true}).first().click();
  check('D06 — Modification locale avant restauration réellement effectuée',await page.evaluate(()=>DB.meals.length===0));
  await uploadJSON(page,JSON.stringify(exported));
  await page.getByRole('button',{name:'Remplacer mon carnet',exact:true}).click();
  await page.waitForFunction(()=>DB.meals.length===1);
  check('D06 — Aller-retour export/import restaure le repas supprimé',await page.evaluate(()=>DB.meals[0].food==='Banane'&&DB.meals[0].grams===150));
  // L’import a été préparé par A ; une autre connexion ne doit pas remplacer le carnet B.
  const beforeCrossAccount=await snapshot(page);
  await uploadJSON(page,JSON.stringify({...exported,profile:{...exported.profile,name:'Ne pas appliquer à B'}}));
  await page.getByRole('button',{name:'Remplacer mon carnet',exact:true}).waitFor();
  const second=await page.context().newPage();
  await second.goto(baseURL);await logout(second);await login(second,emailB);
  await page.getByRole('button',{name:'Remplacer mon carnet',exact:true}).click();
  check('D06 — Changement de compte entre préparation et confirmation bloque le remplacement',await page.evaluate(({emailA,emailB,accountA,accountB})=>localStorage.getItem('forge_data_'+emailA)===accountA&&localStorage.getItem('forge_data_'+emailB)===accountB,{emailA,emailB,accountA:beforeCrossAccount.account,accountB:otherAccount}));
  await second.close();
  await page.reload();
  await logout(page);await login(page,emailA);
  await start(page);await fillSet(page,{weight:'9',reps:'8',rpe:'5'});
  await navigate(page,'settings');
  const beforeWipe=await snapshot(page);
  const beforeWipeDraft=await page.evaluate(()=>localStorage.getItem('forge_workout_draft_v1:'+encodeURIComponent(currentEmail())));
  page.removeAllListeners('dialog');
  page.once('dialog',dialog=>dialog.dismiss());
  await page.getByRole('button',{name:'Effacer le carnet de ce compte',exact:true}).click();
  check('D06 — Annuler un effacement ne modifie aucune donnée',JSON.stringify(await snapshot(page))===JSON.stringify(beforeWipe)&&await page.evaluate(expected=>localStorage.getItem('forge_workout_draft_v1:'+encodeURIComponent(currentEmail()))===expected,beforeWipeDraft));
  page.on('dialog',dialog=>dialog.accept());
  await page.evaluate(()=>{
    window.__forgeNativeSetItem=Storage.prototype.setItem;
    const blocked='forge_data_'+currentEmail();
    Storage.prototype.setItem=function(key,value){if(key===blocked)throw new DOMException('Quota de test','QuotaExceededError');return window.__forgeNativeSetItem.call(this,key,value);};
  });
  await page.getByRole('button',{name:'Effacer le carnet de ce compte',exact:true}).click();
  check('D06 — Échec d’effacement conserve carnet et brouillon',JSON.stringify(await snapshot(page))===JSON.stringify(beforeWipe)&&await page.evaluate(expected=>localStorage.getItem('forge_workout_draft_v1:'+encodeURIComponent(currentEmail()))===expected,beforeWipeDraft));
  await page.evaluate(()=>{Storage.prototype.setItem=window.__forgeNativeSetItem;delete window.__forgeNativeSetItem;});
  await page.getByRole('button',{name:'Effacer le carnet de ce compte',exact:true}).click();
  await page.reload();
  check('D06 — Effacement confirmé nettoie le compte courant et garde l’autre',await page.evaluate(({other,emailB})=>!DB.profile.setup&&DB.sessions.length===0&&DB.meals.length===0&&DB.programs.length===0&&localStorage.getItem('forge_workout_draft_v1:'+encodeURIComponent(currentEmail()))===null&&localStorage.getItem('forge_data_'+emailB)===other&&Boolean(AUTH[currentEmail()]),{other:otherAccount,emailB}));
  await page.locator('#setupName').fill('Après remise à zéro');
  await page.getByRole('button',{name:/Créer mon espace/}).click();
  await installProgram(page);await start(page);await fillSet(page,{weight:'23',reps:'6',rpe:'5'});
  await page.reload();await resume(page);
  check('D06 — Une nouvelle séance après effacement reste reprenable',await page.getByLabel('Charge série 1',{exact:true}).first().inputValue()==='23'&&await page.evaluate(()=>session.exercises[0].sets[0].reps==='6'));
  await page.getByRole('button',{name:'Annuler sans enregistrer',exact:true}).click();
  for(const [kind,broken] of [
    ['JSON local incomplet','{"profile":'],
    ['structure locale invalide',JSON.stringify({...exported,sessions:'corrompu'})]
  ]){
    await page.evaluate(text=>localStorage.setItem('forge_data_'+currentEmail(),text),broken);
    await page.reload();
    await page.locator('.storage-recovery').waitFor();
    check('D06 — '+kind+' affiche la récupération sans écraser le brut',await page.evaluate(expected=>localStorage.getItem('forge_data_'+currentEmail())===expected,broken));
    for(const route of ['home','calendar','settings'])await navigate(page,route);
    check('D06 — Navigation protégée préserve '+kind,await page.locator('.storage-recovery').isVisible()&&await page.evaluate(expected=>localStorage.getItem('forge_data_'+currentEmail())===expected,broken));
    await page.setViewportSize({width:320,height:568});
    const recoverySize=await dimensions(page);
    check('D06 — Panneau récupération utilisable à 320px : '+kind,recoverySize.scrollWidth<=recoverySize.width&&recoverySize.smallButtons.length===0,JSON.stringify(recoverySize));
    await page.setViewportSize({width:390,height:844});
    await screenshot(page,'d06-recuperation-'+(kind.startsWith('JSON')?'json':'schema'));
    const rescueDownload=page.waitForEvent('download');
    await page.getByRole('button',{name:'Exporter le fichier de secours',exact:true}).click();
    const rescue=await rescueDownload;
    const rescuePath=path.join(output,kind.startsWith('JSON')?'secours-json.txt':'secours-schema.txt');
    await rescue.saveAs(rescuePath);
    check('D06 — Export de secours préserve chaque caractère : '+kind,fs.readFileSync(rescuePath,'utf8')===broken);
    await page.getByRole('button',{name:'Se déconnecter',exact:true}).click();
    await login(page,emailB);
    check('D06 — Autre compte utilisable pendant la récupération : '+kind,await page.locator('.eh').isVisible()&&await page.evaluate(({raw,email})=>localStorage.getItem('forge_data_'+email)===raw,{raw:broken,email:emailA}));
    await logout(page);await login(page,emailA,'.storage-recovery');
    await uploadJSON(page,JSON.stringify(exported));
    await page.getByRole('button',{name:'Remplacer mon carnet',exact:true}).click();
    await page.waitForFunction(()=>DB.profile.name==='Camille migrée');
    check('D06 — Restauration confirmée lève la protection : '+kind,await page.locator('.storage-recovery').count()===0&&await page.evaluate(()=>DB.meals.length===1&&DB.programs.length===1&&JSON.parse(localStorage.getItem('forge_data_'+currentEmail())).profile.name==='Camille migrée'));
  }

}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless:true, args:['--no-sandbox'] });
  report.browser = await browser.version();
  const context = await browser.newContext({ viewport:{width:390,height:844}, reducedMotion:'reduce', locale:'fr-FR', timezoneId:'Europe/Paris' });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.on('pageerror', error => report.pageErrors.push(String(error)));
  page.on('requestfailed', request => report.requestFailures.push({url:request.url().split('?')[0],error:request.failure()?.errorText}));
  page.on('dialog', dialog => dialog.accept());
  persist();
  try {
    if(scope==='D05'||scope==='ALL') await testD05(page);
    if(scope==='D06'||scope==='ALL') await testD06(page);
    check('Aucune exception JavaScript pendant les scénarios', report.pageErrors.length===0, JSON.stringify(report.pageErrors));
    check('Aucune ressource applicative en échec', report.requestFailures.length===0, JSON.stringify(report.requestFailures));
    report.status='completed';
  } catch(error) {
    if(!report.checks.some(c=>c.status==='failed')) report.checks.push({name:'Exécution du scénario',status:'failed',detail:String(error.stack||error)});
    report.status='failed';
    try{await screenshot(page, 'echec-'+scope.toLowerCase());}catch{}
    console.error(error);
    process.exitCode=1;
  } finally {
    report.completedAt=new Date().toISOString();
    persist();
    console.log(JSON.stringify({task:scope,status:report.status,passed:report.passed,failed:report.failed,pageErrors:report.pageErrors,resultPath}));
    await browser.close();
  }
})();
