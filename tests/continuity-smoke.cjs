/* Forge T05 : vrais redémarrages Chromium, repos expiré, brouillons anciens,
 * et fixture compatible avec le ZIP historique. Aucun carnet utilisateur.
 * FORGE_TEST_OUTPUT=/tmp/forge-t05 node tests/continuity-smoke.cjs
 */
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {isDeepStrictEqual}=require('node:util');
const {chromium}=require('playwright');
const baseURL=process.env.FORGE_BASE_URL||'http://127.0.0.1:8080';
const output=process.env.FORGE_TEST_OUTPUT||path.join(os.tmpdir(),'forge-t05');
fs.mkdirSync(output,{recursive:true});
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'forge-t05-profile-'));
const report={task:'T05',startedAt:new Date().toISOString(),baseURL,status:'running',checks:[],pageErrors:[],requestFailures:[],launches:0};
const resultPath=path.join(output,'resultats-t05.json');
let context;
function persist(){report.passed=report.checks.filter(x=>x.status==='passed').length;report.failed=report.checks.filter(x=>x.status==='failed').length;fs.writeFileSync(resultPath,JSON.stringify(report,null,2));}
function check(name,condition,detail=''){report.checks.push({name,status:condition?'passed':'failed',detail});persist();if(!condition)throw new Error(name+' '+detail);}
async function launch(){
 context=await chromium.launchPersistentContext(profile,{executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox'],viewport:{width:390,height:844},reducedMotion:'reduce',locale:'fr-FR',timezoneId:'Europe/Paris'});
 report.launches++;report.browser=context.browser().version();
 for(const p of context.pages())observe(p);
 context.on('page',observe);
 return context.pages()[0]||await context.newPage();
}
function observe(page){page.setDefaultTimeout(10000);page.on('pageerror',error=>report.pageErrors.push(String(error)));page.on('requestfailed',request=>report.requestFailures.push({url:request.url(),error:request.failure()?.errorText}));page.on('dialog',dialog=>dialog.accept());}
async function nav(page,route){await page.evaluate(route=>nav(route),route);}
async function register(page){
 await page.goto(baseURL);
 await page.locator('.ea-actions button').filter({hasText:'Créer'}).click();
 await page.locator('#regName').fill('Camille Continuité');await page.locator('#authEmail').fill('continuite@example.test');await page.locator('#authPass').fill('Forge-Test-2026!');await page.locator('#authPass').press('Enter');
 await page.locator('.rec-code').waitFor();await page.locator('#setupName').waitFor();
 await page.getByRole('button',{name:'J’ai noté mon code',exact:true}).click();
 await page.getByRole('button',{name:/Créer mon espace/}).click();await page.locator('.eh').waitFor();
}
async function start(page){await nav(page,'program');await page.locator('.r-day').first().click();await page.getByRole('button',{name:/Commencer la séance/}).click();await page.locator('.es-set').first().waitFor();}
async function resume(page){await page.getByRole('button',{name:'Reprendre la séance',exact:true}).click();await page.locator('.es-set').first().waitFor();}
async function rawDraft(page){return page.evaluate(()=>localStorage.getItem(workoutDraftKey()));}
async function carnet(page){return page.evaluate(()=>localStorage.getItem('forge_data_'+currentEmail()));}
async function setDraft(page,text){await page.evaluate(text=>localStorage.setItem(workoutDraftKey(),text),text);await page.reload();}
(async()=>{
 try{
  let page=await launch();await register(page);
  await nav(page,'workouts');await page.getByRole('button',{name:'Ajouter à mon programme',exact:true}).first().click();
  // Une durée courte dans la fixture évite d'attendre un repos complet de 90 s.
  await page.evaluate(()=>{DB.programs[0].days[0].exercises[0].rest=1;save();});
  await start(page);
  await page.getByLabel('Charge série 1',{exact:true}).first().fill('31.5');await page.getByLabel('Répétitions série 1',{exact:true}).first().fill('8');await page.getByLabel('RPE série 1',{exact:true}).first().fill('7');
  await page.getByLabel('Charge série 2',{exact:true}).first().fill('27.5');await page.getByLabel('Répétitions série 2',{exact:true}).first().fill('9');
  await page.getByRole('button',{name:'Valider la série 1',exact:true}).first().click();
  const before=await page.evaluate(()=>({draft:JSON.parse(localStorage.getItem(workoutDraftKey())),account:localStorage.getItem('forge_data_'+currentEmail()),xp:DB.xp,now:Date.now()}));
  check('T05 — Le repos est réellement actif avant fermeture',before.draft.rest.deadline>before.now&&!before.draft.rest.paused&&before.draft.session.exercises[0].sets[0].done);
  const firstBrowser=context.browser();await context.close();context=null;
  check('T05 — Le premier navigateur est fermé avant une nouvelle instance',!firstBrowser.isConnected());
  // Le navigateur fermé ne peut plus modifier le minuteur. Le temps continue réellement.
  await new Promise(resolve=>setTimeout(resolve,Math.max(0,before.draft.rest.deadline-Date.now()+200)));
  page=await launch();await page.goto(baseURL);await page.getByRole('button',{name:'Reprendre la séance',exact:true}).waitFor();
  check('T05 — La relance retrouve le compte et propose une reprise explicite',await page.evaluate(()=>isLogged()&&currentEmail()==='continuite@example.test'&&session===null&&view==='home'));
  check('T05 — Le carnet historique n’est pas modifié par la fermeture',await carnet(page)===before.account);
  await resume(page);
  check('T05 — Les séries cochées et non cochées survivent à la relance',await page.evaluate(expected=>session.id===expected&&session.exercises[0].sets[0].done&&session.exercises[0].sets[0].weight==='31.5'&&!session.exercises[0].sets[1].done&&session.exercises[0].sets[1].weight==='27.5'&&session.exercises[0].sets[1].reps==='9',before.draft.session.id));
  check('T05 — Un repos expiré hors navigateur revient à zéro sans redémarrer',await page.evaluate(()=>rest===0&&restDeadline===0&&restRemainingMs===0&&!restPaused));
  const persisted=JSON.parse(await rawDraft(page));
  check('T05 — Le repos expiré est aussi corrigé dans le brouillon enregistré',persisted.rest.deadline===0&&persisted.rest.remainingMs===0&&!persisted.rest.paused);
  check('T05 — La relance ne crée pas de séance ni de récompense',await page.evaluate(xp=>DB.sessions.length===0&&DB.xp===xp,before.xp));
  await page.screenshot({path:path.join(output,'t05-reprise-redemarrage.png'),fullPage:true});
  await page.getByRole('button',{name:'Annuler sans enregistrer',exact:true}).click();
  await start(page);
  await page.getByLabel('Charge série 1',{exact:true}).first().fill('19');await page.getByLabel('Répétitions série 1',{exact:true}).first().fill('10');
  const validDraft=JSON.parse(await rawDraft(page));
  await page.reload();
  const unchanged=await carnet(page);
  const mutate=fn=>{const d=JSON.parse(JSON.stringify(validDraft));fn(d);return JSON.stringify(d);};
  const invalids=[
   ['JSON tronqué','{"version":'],
   ['ancienne version inconnue',mutate(d=>d.version=0)],
   ['version future inconnue',mutate(d=>d.version=2)],
   ['propriétaire différent',mutate(d=>d.owner='autre@example.test')],
   ['série validée incohérente',mutate(d=>{d.session.exercises[0].sets[0].done=true;d.session.exercises[0].sets[0].reps='0';})],
   ['minuteur malformé',mutate(d=>d.rest.remainingMs=-1)],
   ['brouillon trop volumineux',mutate(d=>d.padding='x'.repeat(513000))]
  ];
  for(const [name,text] of invalids){
   await setDraft(page,text);
   check('T05 — Brouillon ignoré sans faux parcours de reprise : '+name,await page.getByRole('button',{name:'Reprendre la séance',exact:true}).count()===0&&await page.locator('.eh').isVisible());
   check('T05 — Brouillon refusé sans altérer le carnet ou le fichier brut : '+name,await carnet(page)===unchanged&&await rawDraft(page)===text);
  }
  await setDraft(page,JSON.stringify(validDraft));await resume(page);
  check('T05 — Un brouillon valide reste utilisable après les refus',await page.getByLabel('Charge série 1',{exact:true}).first().inputValue()==='19');
  await page.getByRole('button',{name:'Annuler sans enregistrer',exact:true}).click();
  const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/legacy-carnet-zip.json'),'utf8'));
  await nav(page,'settings');await page.locator('#importFile').setInputFiles({name:'archive-originale-fictive.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture))});
  await page.getByRole('button',{name:'Remplacer mon carnet',exact:true}).waitFor();
  check('T05 — Le format du ZIP historique est reconnu comme sauvegarde ancienne',await page.locator('.backup-preview').innerText().then(text=>text.includes('Sauvegarde ancienne reconnue')));
  await page.getByRole('button',{name:'Remplacer mon carnet',exact:true}).click();await page.waitForFunction(()=>DB.profile.name==='Camille archive');
  check('T05 — Séance historique avec chaînes numériques et exercice vide conservée',isDeepStrictEqual(await page.evaluate(()=>DB.sessions),fixture.sessions));
  const historicFields=['meals','weights','measurements','water','sleep','notes','habitLog','lastSets','prs'];
  const historicData=await page.evaluate(keys=>Object.fromEntries(keys.map(key=>[key,DB[key]])),historicFields);
  check('T05 — Repas, poids, mesures, eau, sommeil et notes historiques conservés',historicFields.every(key=>isDeepStrictEqual(historicData[key],fixture[key])));
  await page.reload();
  check('T05 — Le carnet historique reste lisible au démarrage et conserve son thème',await page.evaluate(()=>!currentStorageIssue()&&DB.settings.theme==='dark'&&DB.sessions[0].id==='legacy-session')&&await page.locator('.eh').isVisible());
  await start(page);
  check('T05 — Les dernières séries historiques préremplissent la nouvelle séance',await page.getByLabel('Charge série 1',{exact:true}).first().inputValue()==='40'&&await page.getByLabel('Répétitions série 1',{exact:true}).first().inputValue()==='9'&&await page.getByLabel('RPE série 1',{exact:true}).first().inputValue()==='7');
  await page.getByRole('button',{name:'Annuler sans enregistrer',exact:true}).click();
  check('T05 — Aucune exception JavaScript',report.pageErrors.length===0,JSON.stringify(report.pageErrors));
  check('T05 — Aucune ressource applicative en échec',report.requestFailures.length===0,JSON.stringify(report.requestFailures));
  report.status='completed';
 }catch(error){if(!report.checks.some(x=>x.status==='failed'))report.checks.push({name:'Exécution complète T05',status:'failed',detail:String(error.stack||error)});report.status='failed';console.error(error);process.exitCode=1;
 }finally{if(context)await context.close();fs.rmSync(profile,{recursive:true,force:true});report.completedAt=new Date().toISOString();persist();console.log(JSON.stringify({status:report.status,passed:report.passed,failed:report.failed,launches:report.launches,resultPath,pageErrors:report.pageErrors}));}
})();
