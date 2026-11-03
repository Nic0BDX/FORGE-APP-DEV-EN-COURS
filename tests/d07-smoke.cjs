/* Forge D07 — sélection des photos, données datées et calendrier.
 * Comptes fictifs et fixtures indépendantes des calculs de l'application.
 * FORGE_TEST_OUTPUT=/tmp/forge-d07 node tests/d07-smoke.cjs
 */
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {chromium}=require('playwright');
const baseURL=process.env.FORGE_BASE_URL||'http://127.0.0.1:8080';
const output=process.env.FORGE_TEST_OUTPUT||path.join(os.tmpdir(),'forge-d07');fs.mkdirSync(output,{recursive:true});
const report={task:'D07',startedAt:new Date().toISOString(),baseURL,status:'running',checks:[],pageErrors:[],requestFailures:[],states:[]};
const resultPath=path.join(output,'resultats-d07.json');
function persist(){report.passed=report.checks.filter(x=>x.status==='passed').length;report.failed=report.checks.filter(x=>x.status==='failed').length;fs.writeFileSync(resultPath,JSON.stringify(report,null,2));}
function check(name,pass,detail=''){report.checks.push({name,status:pass?'passed':'failed',detail});persist();if(!pass)throw new Error(name+' '+detail);}
async function nav(page,route){await page.evaluate(route=>nav(route),route);}
async function register(page,email,name){await page.goto(baseURL);if(await page.evaluate(()=>isLogged()))await page.evaluate(()=>logout());await page.locator('.ea-actions button').filter({hasText:'Créer'}).click();await page.locator('#regName').fill(name);await page.locator('#authEmail').fill(email);await page.locator('#authPass').fill('Forge-Test-2026!');await page.locator('#authPass').press('Enter');await page.locator('.rec-code').waitFor();await page.locator('#setupName').waitFor();await page.getByRole('button',{name:'J’ai noté mon code',exact:true}).click();await page.getByRole('button',{name:/Créer mon espace/}).click();await page.locator('.eh').waitFor();}
async function images(page){return page.evaluate(()=>['#245645','#a2b09b','#edc56a','#7a8e9c'].map(color=>{const c=document.createElement('canvas');c.width=80;c.height=100;const x=c.getContext('2d');x.fillStyle=color;x.fillRect(0,0,80,100);return c.toDataURL('image/png');}));}
function fixture(img){
 const s=(id,date,volume,day)=>({id,date,iso:date+'T10:00:00.000Z',program:'Programme de test',day,duration:600,volume,sets:1,exercises:[{name:'Squat',sets:[{weight:String(volume/10),reps:'10',rpe:'7',done:true}]}]});
 return {
  photos:[{id:'p3',date:'2026-03-10',data:img[2],caption:'Mars',tag:'event'},{id:'p1',date:'2026-02-10',data:img[0],caption:'Début février',tag:'train'},{id:'p2',date:'2026-02-20',data:img[1],caption:'Fin février',tag:''}],
  weights:[{date:'2026-02-19',value:70},{date:'2026-01-01',value:90},{date:'2026-02-09',value:71.5},{date:'2026-02-11',value:71},{date:'2026-03-11',value:5}],
  measurements:[{date:'2026-02-19',bodyFat:19},{date:'2026-01-01',bodyFat:50},{date:'2026-02-11',bodyFat:20},{date:'2026-03-11',bodyFat:3}],
  sessions:[s('outside-after','2026-02-21',1000,'Hors période après'),s('boundary-end','2026-02-20',200,'Dernière séance février'),s('leap','2024-02-29',80,'Séance bissextile'),s('inside','2026-02-15',300,'Séance centrale'),s('boundary-start','2026-02-10',100,'Première séance février'),s('outside-before','2026-02-09',900,'Hors période avant'),s('march','2026-03-10',50,'Séance de mars')]
 };
}
async function seed(page,data){await page.evaluate(data=>{DB={...defaultDB(),profile:{...DB.profile,setup:true},...data};save();nav('beforeafter');},data);}
async function choosePair(page,before,after){
 // L'autre photo est désactivée dans chaque sélecteur : déplacer la fin d'abord
 // quand elle occupe encore l'identité demandée pour le début.
 if(await page.locator('#afterPhoto').inputValue()===before)await page.locator('#afterPhoto').selectOption(after);
 await page.locator('#beforePhoto').selectOption(before);await page.locator('#afterPhoto').selectOption(after);
}
async function pair(page){return page.evaluate(()=>({before:document.getElementById('beforePhoto')?.value,after:document.getElementById('afterPhoto')?.value,images:[...document.querySelectorAll('.r-ba img')].map(i=>i.getAttribute('src'))}));}
async function metric(page,label){return (await page.locator('.ba-t').filter({has:page.getByText(label,{exact:true})}).locator('b').innerText()).replace(/\u00a0|\u202f/g,' ').replace(/−/g,'-').trim();}
async function responsive(page,screen){
 for(const theme of ['light','dark']){
  await page.evaluate(theme=>{DB.settings.theme=theme;save();render();},theme);
  for(const width of [320,390,768]){
   await page.setViewportSize({width,height:width===320?568:844});
   const state=await page.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,small:[...document.querySelectorAll('button,input:not([type=file]),select')].filter(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'&&(r.width<43.5||r.height<43.5);}).map(el=>el.id||el.getAttribute('aria-label')||el.textContent.trim())}));
   report.states.push({screen,theme,width,...state});check(`D07 — ${screen} ${theme} ${width}px : pas de débordement ni petite cible`,state.scrollWidth<=state.viewport&&state.small.length===0,JSON.stringify(state));
  }
 }
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>{DB.settings.theme='light';save();render();});
}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',locale:'fr-FR',timezoneId:'Europe/Paris'});const page=await context.newPage();page.setDefaultTimeout(10000);
 page.on('pageerror',e=>report.pageErrors.push(String(e)));page.on('requestfailed',r=>report.requestFailures.push({url:r.url(),error:r.failure()?.errorText}));page.on('dialog',d=>d.accept());report.browser=browser.version();
 try{
  await register(page,'periodes.a@example.test','Camille Périodes');
  const img=await images(page),data=fixture(img);
  await nav(page,'beforeafter');
  check('D07 — Sans photo, le parcours propose de prendre une photo',await page.locator('.r-ba img').count()===0&&await page.getByRole('button',{name:/photo de la semaine/}).isVisible());
  await seed(page,{...data,photos:[data.photos[1]]});
  check('D07 — Une seule photo ne produit pas de fausse comparaison',await page.locator('.r-ba img').count()===0&&await page.locator('#beforePhoto').count()===0);
  await seed(page,data);
  const initial=await pair(page);
  check('D07 — Les photos non triées commencent par la plus ancienne et finissent par la plus récente',initial.before==='p1'&&initial.after==='p3'&&initial.images[0]===img[0]&&initial.images[1]===img[2]);
  await choosePair(page,'p1','p2');
  check('D07 — Choisir les photos met à jour les images affichées',JSON.stringify((await pair(page)).images)===JSON.stringify([img[0],img[1]]));
  check('D07 — Poids non triés : variation calculée avec les relevés antérieurs associés',await metric(page,'Poids')==='-1,5 kg');
  check('D07 — Les dates des photos et des poids associés sont affichées distinctement',await page.locator('.r-ba figure').first().locator('time[datetime="2026-02-10"]').count()===1&&await page.locator('.r-ba figure').first().locator('time[datetime="2026-02-09"]').count()===1&&await page.locator('.r-ba figure').last().locator('time[datetime="2026-02-20"]').count()===1&&await page.locator('.r-ba figure').last().locator('time[datetime="2026-02-19"]').count()===1);
  check('D07 — Masse grasse : seules les deux mesures de la période comptent',/^-1(?:,0)?\s/.test(await metric(page,'Masse grasse')));
  check('D07 — Volume enregistré inclut les deux bornes et exclut les séances hors période',await metric(page,'Volume enregistré')==='600'&&await page.locator('#baVolume').getAttribute('data-value')==='600');
  const comparison=await page.locator('.r-page').innerText();
  check('D07 — Le volume est nommé avec son unité et ne prétend pas mesurer la force',/kg\s*[×x·]\s*r[ée]p/i.test(comparison)&&!/\bForce\b/.test(comparison));
  await responsive(page,'Comparaison');await page.screenshot({path:path.join(output,'d07-comparaison.png'),fullPage:true});
  await page.locator('#beforePhoto').selectOption('p3');
  let chosen=await pair(page);
  check('D07 — Un choix inversé conserve deux photos distinctes dans l’ordre chronologique',chosen.before!==chosen.after&&data.photos.find(x=>x.id===chosen.before).date<=data.photos.find(x=>x.id===chosen.after).date);
  check('D07 — La même photo ne peut pas être choisie dans les deux champs',await page.locator('#afterPhoto option[value="'+chosen.before+'"]').isDisabled()&&await page.locator('#beforePhoto option[value="'+chosen.after+'"]').isDisabled()&&chosen.before!==chosen.after&&(await page.locator('.r-ba img').count())===2);
  // Des valeurs futures ne doivent jamais être présentées comme relevées avant les photos.
  await seed(page,{...data,weights:[{date:'2026-04-01',value:12}],measurements:[{date:'2026-04-01',bodyFat:8}]});await choosePair(page,'p1','p2');
  check('D07 — Un poids uniquement futur ne devient pas une mesure associée',await metric(page,'Poids')==='—'&&!/12\s*kg/.test(await page.locator('.r-ba').innerText()));
  check('D07 — Une mesure de masse grasse hors période ne devient pas une variation',await metric(page,'Masse grasse')==='—');
  await seed(page,{...data,weights:[{date:'2026-02-09',value:71}],measurements:[{date:'2026-02-15',bodyFat:20}]});await choosePair(page,'p1','p2');
  check('D07 — Un seul relevé de poids ne produit pas artificiellement zéro variation',await metric(page,'Poids')==='—');
  check('D07 — Un seul relevé de masse grasse ne produit pas artificiellement zéro variation',await metric(page,'Masse grasse')==='—');
  await seed(page,{...data,photos:[...data.photos,{id:'p4',date:'2026-02-20',data:img[3],caption:'Même jour',tag:''}]});await choosePair(page,'p2','p4');
  check('D07 — Deux photos du même jour restent distinctes sans inventer de variation de poids',(await pair(page)).before!==(await pair(page)).after&&await metric(page,'Poids')==='—');
  await seed(page,data);await choosePair(page,'p1','p2');await nav(page,'memories');
  await page.locator('.r-photo').filter({has:page.locator('img[alt="Photo du 2026-02-20"]')}).getByRole('button',{name:'Supprimer la photo',exact:true}).click();await nav(page,'beforeafter');
  chosen=await pair(page);
  check('D07 — Supprimer une photo sélectionnée réconcilie les choix sans image cassée',chosen.before==='p1'&&chosen.after==='p3'&&await page.locator('.r-ba img').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>0)));
  await nav(page,'calendar');await page.locator('#calendarMonth').fill('2026-02');
  check('D07 — Le mois choisi affiche uniquement ses cinq séances',await page.locator('.r-list .r-row').count()===5&&!(await page.locator('.r-list').innerText()).includes('Séance de mars'));
  await page.locator('#calendarDay').fill('2026-02-15');
  check('D07 — Une date occupée affiche seulement la séance de ce jour',await page.locator('.r-list .r-row').count()===1&&(await page.locator('.r-list').innerText()).includes('Séance centrale'));
  await page.locator('#calendarDay').fill('2026-02-16');
  check('D07 — Une date vide a un état vide explicite',await page.locator('.r-list .r-row').count()===0&&/Aucune séance/.test(await page.locator('.r-list').innerText()));
  await page.locator('#calendarDay').fill('2026-03-10');
  check('D07 — Choisir un jour d’un autre mois synchronise le mois et la liste',await page.locator('#calendarMonth').inputValue()==='2026-03'&&await page.locator('.r-list .r-row').count()===1&&(await page.locator('.r-list').innerText()).includes('Séance de mars'));
  await page.getByRole('button',{name:'Tout le mois',exact:true}).click();
  check('D07 — Tout le mois retire le filtre de jour',await page.locator('#calendarDay').inputValue()===''&&await page.locator('.r-list .r-row').count()===1);
  await page.locator('#calendarMonth').fill('2024-02');
  check('D07 — Février bissextile garde le 29 et sa séance',await page.locator('.cl-d').count()===29&&await page.locator('.cl-d.done').filter({hasText:/^29$/}).count()===1&&(await page.locator('.r-list').innerText()).includes('Séance bissextile'));
  await page.locator('#calendarMonth').fill('2026-12');await page.getByRole('button',{name:'Mois suivant',exact:true}).click();
  check('D07 — La navigation traverse décembre vers janvier de l’année suivante',await page.locator('#calendarMonth').inputValue()==='2027-01');
  await page.getByRole('button',{name:'Mois précédent',exact:true}).click();
  check('D07 — La navigation précédente revient à décembre',await page.locator('#calendarMonth').inputValue()==='2026-12');
  await page.getByRole('button',{name:'Mois actuel',exact:true}).click();
  const currentMonth=await page.evaluate(()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');});
  check('D07 — Mois actuel revient à la période locale courante',await page.locator('#calendarMonth').inputValue()===currentMonth);
  await page.locator('#calendarMonth').fill('2026-02');await responsive(page,'Calendrier');await page.screenshot({path:path.join(output,'d07-calendrier.png'),fullPage:true});
  // Un remplacement du carnet ne doit pas laisser des sélections obsolètes en mémoire.
  const replacement=await page.evaluate(()=>({...DB,photos:[]}));replacement.photos=[{id:'new-before',date:'2025-01-01',data:img[0],caption:'Nouvelle origine',tag:''},{id:'new-after',date:'2025-02-01',data:img[1],caption:'Nouvelle fin',tag:''}];
  await nav(page,'settings');await page.locator('#importFile').setInputFiles({name:'nouvelles-photos.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(replacement))});await page.getByRole('button',{name:'Remplacer mon carnet',exact:true}).click();await nav(page,'beforeafter');chosen=await pair(page);
  check('D07 — Un import remplaçant les photos réinitialise les sélections devenues absentes',chosen.before==='new-before'&&chosen.after==='new-after'&&chosen.images.length===2);
  await seed(page,data);await choosePair(page,'p2','p3');
  await page.evaluate(()=>logout());await register(page,'periodes.b@example.test','Morgan Autre compte');
  await seed(page,{...data,photos:data.photos.map(p=>({...p,date:p.date.replace('2026','2025')}))});chosen=await pair(page);
  check('D07 — Un autre compte n’hérite pas de la sélection de photos précédente',chosen.before==='p1'&&chosen.after==='p3');
  check('D07 — Aucune exception JavaScript',report.pageErrors.length===0,JSON.stringify(report.pageErrors));check('D07 — Aucune ressource applicative en échec',report.requestFailures.length===0,JSON.stringify(report.requestFailures));report.status='completed';
 }catch(error){if(!report.checks.some(x=>x.status==='failed'))report.checks.push({name:'Exécution complète D07',status:'failed',detail:String(error.stack||error)});report.status='failed';try{await page.screenshot({path:path.join(output,'echec-d07.png'),fullPage:true});}catch{}console.error(error);process.exitCode=1;
 }finally{report.completedAt=new Date().toISOString();persist();console.log(JSON.stringify({status:report.status,passed:report.passed,failed:report.failed,pageErrors:report.pageErrors,resultPath}));await browser.close();}
})();
