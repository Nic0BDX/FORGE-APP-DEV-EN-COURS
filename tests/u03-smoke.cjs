/* Forge U03 — petites largeurs, actions photo, longues listes et états vides. */
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');const {chromium}=require('playwright');
const base=process.env.FORGE_BASE_URL||'http://127.0.0.1:8080',output=process.env.FORGE_TEST_OUTPUT||path.join(os.tmpdir(),'forge-u03');fs.mkdirSync(output,{recursive:true});
const report={task:'U03',startedAt:new Date().toISOString(),status:'running',checks:[],pageErrors:[],requestFailures:[],states:[]};
function persist(){report.passed=report.checks.filter(x=>x.status==='passed').length;report.failed=report.checks.filter(x=>x.status==='failed').length;fs.writeFileSync(path.join(output,'resultats-u03.json'),JSON.stringify(report,null,2));}
function check(name,ok,detail=''){report.checks.push({name,status:ok?'passed':'failed',detail});persist();if(!ok)throw new Error(name+' '+detail);}
async function nav(page,route){await page.evaluate(route=>nav(route),route);}
async function setAppearance(page,theme,width){await page.setViewportSize({width,height:width===320?568:844});await page.evaluate(theme=>{DB.settings.theme=theme;save();render();},theme);}
async function pageGeometry(page){return page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,small:[...document.querySelectorAll('button,input:not([type=file]),select')].filter(el=>{const target=el.matches('input[type=checkbox]')?[...el.labels].find(label=>label.contains(el))||el:el;const r=target.getBoundingClientRect(),s=getComputedStyle(target);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'&&(r.width<43.5||r.height<43.5);}).map(el=>el.id||el.getAttribute('aria-label')||el.textContent.trim())}));}
async function photoGeometry(page){return page.locator('.r-photo').evaluateAll(photos=>photos.map(photo=>{const tag=photo.querySelector('.r-tag').getBoundingClientRect(),del=photo.querySelector('.r-x').getBoundingClientRect(),image=photo.querySelector('img').getBoundingClientRect(),caption=photo.querySelector('figcaption').getBoundingClientRect();return {overlap:Math.min(tag.right,del.right)-Math.max(tag.left,del.left)>1&&Math.min(tag.bottom,del.bottom)-Math.max(tag.top,del.top)>1,tagWidth:tag.width,tagHeight:tag.height,deleteWidth:del.width,deleteHeight:del.height,captionOverImage:caption.top<image.bottom-1};}));}
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});const context=await browser.newContext({viewport:{width:320,height:568},reducedMotion:'reduce',locale:'fr-FR',timezoneId:'Europe/Paris'}),page=await context.newPage();page.setDefaultTimeout(10000);page.on('pageerror',e=>report.pageErrors.push(String(e)));page.on('requestfailed',r=>report.requestFailures.push({url:r.url(),error:r.failure()?.errorText}));page.on('dialog',d=>d.accept(d.type()==='prompt'?'Séance complète, souvenir conservé':undefined));
 try{
  await page.goto(base+'/preview/demo.html?screen=memories');await page.waitForFunction(()=>window.__forgeDemoIsolated===true&&typeof DB!=='undefined');
  await page.evaluate(()=>{
   const c=document.createElement('canvas');c.width=80;c.height=100;const x=c.getContext('2d');x.fillStyle='#758e72';x.fillRect(0,0,80,100);const data=c.toDataURL('image/png');
   DB.photos=Array.from({length:24},(_,i)=>({id:'photo-'+(i+1),date:'2026-10-'+String(i+1).padStart(2,'0'),data,tag:'train',caption:'Un souvenir sportif avec une légende complète'}));
   DB.meals=Array.from({length:18},(_,i)=>({id:'meal-'+i,date:today(),meal:'Déjeuner',food:'Pâtes complètes aux champignons et aux légumes grillés '+(i+1),grams:300,kcal:365.5,p:18.5,c:57.5,f:6.8}));DB.weights=[];DB.measurements=[];save();nav('memories');
  });
  check('U03 — Une longue galerie conserve les 24 souvenirs',await page.locator('.r-photo').count()===24);
  for(const theme of ['light','dark'])for(const width of [320,390]){
   await setAppearance(page,theme,width);const geometry=await photoGeometry(page),dimensions=await pageGeometry(page);report.states.push({screen:'souvenirs',theme,width,dimensions});
   check(`U03 — Photos ${theme} ${width}px : actions sans collision et légende sous l’image`,geometry.every(g=>!g.overlap&&!g.captionOverImage&&g.tagWidth>=43.5&&g.tagHeight>=43.5&&g.deleteWidth>=43.5&&g.deleteHeight>=43.5),JSON.stringify(geometry[0]));
   check(`U03 — Galerie ${theme} ${width}px : aucun débordement ni petite cible`,dimensions.scrollWidth<=dimensions.width&&dimensions.small.length===0,JSON.stringify(dimensions));
  }
  await setAppearance(page,'light',320);await page.locator('.r-photo').first().scrollIntoViewIfNeeded();
  await page.locator('.r-photo .r-tag').first().click();
  check('U03 — Le bouton catégorie est réellement cliquable à320px',await page.evaluate(()=>DB.photos.find(p=>p.id==='photo-24').tag==='event'));
  await page.locator('.r-chips').getByRole('button',{name:'Événements',exact:true}).click();
  check('U03 — Le filtre affiche uniquement la photo recatégorisée',await page.locator('.r-photo').count()===1);
  await page.locator('.r-photo img').click();
  check('U03 — Cliquer l’image conserve l’édition de légende',await page.evaluate(()=>DB.photos.find(p=>p.id==='photo-24').caption==='Séance complète, souvenir conservé'));
  await page.locator('.r-photo').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,'u03-souvenir-actions-320.png')});
  await page.locator('.r-photo .r-x').click();
  check('U03 — Le bouton suppression retire uniquement la photo visée',await page.evaluate(()=>DB.photos.length===23&&!DB.photos.some(p=>p.id==='photo-24'))&&await page.locator('.r-photo').count()===0);
  check('U03 — Une catégorie vide reste explicite et permet de revenir à Tout',await page.getByText('Aucune photo dans cette catégorie.',{exact:true}).isVisible());
  await page.locator('.r-chips').getByRole('button',{name:'Tout',exact:true}).click();
  check('U03 — Revenir à Tout retrouve les autres souvenirs',await page.locator('.r-photo').count()===23);
  await nav(page,'nutrition');
  check('U03 — Une longue liste conserve les 18 repas',await page.locator('.r-list .r-row').count()===18);
  const toggle=page.locator('label[for="wheyEnabled"]');
  check('U03 — La case whey possède un libellé associé englobant et une cible de44px',await page.getByLabel('Activer les rappels',{exact:true}).count()===1&&await toggle.evaluate(label=>{const r=label.getBoundingClientRect();return label.contains(document.getElementById('wheyEnabled'))&&r.width>=44&&r.height>=44;}));
  const beforeToggle=await page.locator('#wheyEnabled').isChecked(),toggleBox=await toggle.boundingBox();
  await toggle.click({position:{x:toggleBox.width-5,y:toggleBox.height/2}});
  check('U03 — Cliquer près du bord du libellé bascule réellement la case whey',await page.locator('#wheyEnabled').isChecked()!==beforeToggle);
  await page.getByRole('button',{name:'Enregistrer',exact:true}).click();
  check('U03 — Le choix whey basculé par son libellé reste enregistrable',await page.evaluate(expected=>DB.whey.enabled===expected,!beforeToggle));
  for(const theme of ['light','dark'])for(const width of [320,390]){
   await setAppearance(page,theme,width);
   const rows=await page.locator('.r-list .r-row').evaluateAll(rows=>rows.map(row=>{const name=row.querySelector('div:not(.r-thumb)'),macro=row.querySelector('.r-kcal'),r=row.getBoundingClientRect(),n=name.getBoundingClientRect(),m=macro.getBoundingClientRect(),d=row.querySelector('.r-x').getBoundingClientRect();const range=document.createRange();range.selectNodeContents(row);const text=[...range.getClientRects()].filter(rect=>rect.width>0&&rect.height>0);return {nameWidth:n.width,macrosBelow:m.top>=n.bottom-1,textClipped:text.some(t=>t.left<r.left-1||t.right>r.right+1||t.top<r.top-1||t.bottom>r.bottom+1),deleteWidth:d.width,deleteHeight:d.height};}));
   check(`U03 — Nutrition ${theme} ${width}px : nom lisible et macros sur leur propre ligne`,rows.every(r=>r.nameWidth>=120&&r.macrosBelow&&!r.textClipped&&r.deleteWidth>=43.5&&r.deleteHeight>=43.5),JSON.stringify(rows[0]));
   const dimensions=await pageGeometry(page);report.states.push({screen:'nutrition',theme,width,dimensions});check(`U03 — Nutrition ${theme} ${width}px : aucun débordement ni petite cible`,dimensions.scrollWidth<=dimensions.width&&dimensions.small.length===0,JSON.stringify(dimensions));
  }
  await setAppearance(page,'light',320);await page.locator('.r-list .r-row').first().scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,'u03-nutrition-320.png')});
  await page.locator('.r-list .r-row').first().getByRole('button',{name:'Supprimer',exact:true}).click();
  check('U03 — La suppression d’un repas reste accessible à320px',await page.evaluate(()=>DB.meals.length===17&&!DB.meals.some(m=>m.id==='meal-0')));
  await nav(page,'beforeafter');
  for(const theme of ['light','dark'])for(const width of [320,390]){
   await setAppearance(page,theme,width);
   const figures=await page.locator('.r-ba figure').evaluateAll(figures=>figures.map(figure=>{const image=figure.querySelector('img').getBoundingClientRect(),caption=figure.querySelector('figcaption').getBoundingClientRect(),f=figure.getBoundingClientRect();return {under:caption.top>=image.bottom-1,inFigure:caption.bottom<=f.bottom+1,photoHeight:image.height};}));
   check(`U03 — Comparaison ${theme} ${width}px : photo entièrement visible et légende dessous`,figures.length===2&&figures.every(f=>f.under&&f.inFigure&&f.photoHeight>140),JSON.stringify(figures));
   const dimensions=await pageGeometry(page);report.states.push({screen:'comparaison',theme,width,dimensions});check(`U03 — Comparaison ${theme} ${width}px : sélecteurs accessibles sans débordement`,dimensions.scrollWidth<=dimensions.width&&dimensions.small.length===0,JSON.stringify(dimensions));
  }
  await setAppearance(page,'light',320);await page.locator('.r-ba').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,'u03-comparaison-320.png')});
  await nav(page,'calendar');
  for(const theme of ['light','dark'])for(const width of [320,390]){
   await setAppearance(page,theme,width);const dimensions=await pageGeometry(page);report.states.push({screen:'calendrier',theme,width,dimensions});
   check(`U03 — Calendrier ${theme} ${width}px : champs de dates et boutons restent accessibles`,dimensions.scrollWidth<=dimensions.width&&dimensions.small.length===0,JSON.stringify(dimensions));
  }
  await page.evaluate(()=>{DB.photos=[];DB.meals=[];DB.programs=[];DB.activeProgram=null;DB.sessions=[];DB.prs={};DB.weights=[];save();});
  for(const route of ['program','nutrition','memories','beforeafter','progress']){
   await nav(page,route);await setAppearance(page,'light',320);const dimensions=await pageGeometry(page);
   check('U03 — État vide '+route+' lisible à320px',await page.locator('.eh-empty,.empty').count()>0&&dimensions.scrollWidth<=dimensions.width&&dimensions.small.length===0,JSON.stringify(dimensions));
  }
  check('U03 — Aucune exception JavaScript',report.pageErrors.length===0,JSON.stringify(report.pageErrors));check('U03 — Aucune ressource applicative en échec',report.requestFailures.length===0,JSON.stringify(report.requestFailures));report.status='completed';
 }catch(error){if(!report.checks.some(x=>x.status==='failed'))report.checks.push({name:'Exécution complète U03',status:'failed',detail:String(error.stack||error)});report.status='failed';try{await page.screenshot({path:path.join(output,'echec-u03.png'),fullPage:true});}catch{}console.error(error);process.exitCode=1;
 }finally{report.completedAt=new Date().toISOString();persist();console.log(JSON.stringify({status:report.status,passed:report.passed,failed:report.failed,pageErrors:report.pageErrors,resultPath:path.join(output,'resultats-u03.json')}));await browser.close();}
})();
