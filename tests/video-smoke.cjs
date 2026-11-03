/* Vérifications de la nouvelle coque et de ses interactions, sur contexte isolé. */
const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const base=process.env.FORGE_BASE_URL||'http://127.0.0.1:8080';
const output=process.env.FORGE_TEST_OUTPUT||'/tmp/forge-video-checks';
fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1280,height:805},reducedMotion:'reduce'});
 const page=await context.newPage(),checks=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const check=(name,value)=>{assert.ok(value,name);checks.push({name,status:'passed'})};
 try{
  await page.goto(base+'/APERCU.html');await page.locator('.vf-dashboard').waitFor();
  check('La démo ouvre le dashboard sombre Forge',await page.evaluate(()=>window.__forgeDemoIsolated&&DB.settings.theme==='dark'&&document.querySelector('.vf-brand').textContent.includes('forge.')));
  await page.locator('#vf-avatar-button').click();const colors=[];
  for(const key of ['lime','red','orange','cyan','blue','violet','pink']){
   await page.locator('[data-accent="'+key+'"]').click();
   check('Accent '+key+' appliqué et sélectionné',await page.evaluate(key=>DB.profile.accent===key&&document.querySelector('[data-accent="'+key+'"]').getAttribute('aria-pressed')==='true',key));
   colors.push(await page.locator('.vf-ring-value').first().evaluate(el=>getComputedStyle(el).stroke));
  }
  check('Les sept accents changent réellement les anneaux',new Set(colors).size===7);
  await page.keyboard.press('Escape');check('Échap ferme le menu et restitue le focus',await page.locator('#vf-avatar-menu').count()===0&&await page.locator('#vf-avatar-button').evaluate(el=>el===document.activeElement));
  await page.locator('[aria-label="Rechercher dans Forge"]').click();await page.locator('#vf-search-input').fill('Nutrition');await page.locator('#vf-search-results button').click();check('Recherche ouvre Nutrition',await page.evaluate(()=>view==='nutrition'));
  await page.evaluate(()=>{DB.meals.push({id:'old-meal',date:vfDateAgo(3),meal:'Déjeuner',food:'Test',grams:100,kcal:200,p:10,c:20,f:5});nav('home')});
  await page.locator('#vf-macros').selectOption('week');check('Période nutrition recalcule les données',await page.locator('.vf-macro [data-vf-count]').getAttribute('data-vf-count')==='2041');
  await page.locator('#vf-sommeil').selectOption('month');check('Période sommeil affiche 30 journées',await page.locator('.vf-sleep .vf-bar').count()===30);
  await page.locator('#vf-sommeil').selectOption('week');await page.locator('.vf-sleep .vf-bar').first().hover();check('Infobulle visible au survol',await page.locator('.vf-sleep .vf-bar').first().evaluate(el=>getComputedStyle(el,'::after').opacity==='1'));
  await page.locator('[aria-label="Notifications"]').click();check('Cloche ouvre les rappels',await page.locator('#modalbox').innerText().then(t=>t.includes('Tes rappels Forge')));await page.evaluate(()=>closeModal());
  await page.evaluate(()=>{vfSelectAccent('lime');vfMacroPeriod='today';render()});
  await page.screenshot({path:path.join(output,'dashboard-1280.png')});
  const routes=['home','program','nutrition','sleep','health','progress','memories','beforeafter','coach','calendar','profile','premium'];
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:805});
   for(const route of routes){await page.evaluate(route=>nav(route),route);check(route+' sans débordement à '+width,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
  }
  await page.setViewportSize({width:1280,height:805});await page.evaluate(()=>nav('program'));await page.screenshot({path:path.join(output,'programme-1280.png'),fullPage:true});
  await page.evaluate(()=>nav('nutrition'));await page.screenshot({path:path.join(output,'nutrition-1280.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>nav('home'));await page.screenshot({path:path.join(output,'dashboard-390.png'),fullPage:true});
  await page.goto(base+'/index.html');
  await page.evaluate(()=>{const email='video-test@forge.example';AUTH={[email]:{email,name:'Test Forge'}};localStorage.setItem('forge_accounts_v1',JSON.stringify(AUTH));localStorage.setItem('forge_session_v1',email);DB=defaultDB();DB.profile.setup=true;DB.profile.name='Test Forge';commitUserDB(DB);view='home';render()});
  await page.locator('#vf-avatar-button').click();await page.locator('[data-accent="cyan"]').click();await page.keyboard.press('Escape');
  await page.evaluate(()=>vfOpenSteps());await page.locator('#vf-steps-value').fill('12345');await page.getByRole('button',{name:'Enregistrer les pas',exact:true}).click();
  await page.evaluate(()=>vfOpenPulse());await page.locator('#vf-pulse-value').fill('72');await page.getByRole('button',{name:'Enregistrer le relevé',exact:true}).click();
  await page.reload();await page.locator('.vf-dashboard').waitFor();check('Accent, pas et pouls persistent au rechargement',await page.evaluate(()=>DB.profile.accent==='cyan'&&DB.steps[vfDateAgo(0)]===12345&&DB.health.pulse.at(-1).value===72));
  check('Les nouveaux relevés passent le validateur de sauvegarde',await page.evaluate(()=>{const restored=validateBackup(JSON.parse(JSON.stringify(DB)));return restored.health.pulse[0].value===72&&restored.steps[vfDateAgo(0)]===12345}));
  check('Une sauvegarde avec pouls invalide est refusée',await page.evaluate(()=>{const copy=JSON.parse(JSON.stringify(DB));copy.health.pulse[0].value=-10;try{validateBackup(copy);return false}catch{return true}}));
  check('Une sauvegarde avec pas fractionnaires est refusée',await page.evaluate(()=>{const copy=JSON.parse(JSON.stringify(DB));copy.steps[vfDateAgo(0)]=1.5;try{validateBackup(copy);return false}catch{return true}}));
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(base+'/APERCU.html');await page.locator('.vf-dashboard').waitFor();
  check('Animations de chargement présentes',await page.evaluate(()=>document.getAnimations().some(a=>a.animationName==='vf-ring')&&document.getAnimations().some(a=>a.animationName==='vf-bar')&&document.getAnimations().some(a=>a.animationName==='vf-draw')));
  await page.waitForTimeout(1400);check('Les compteurs terminent sur leurs valeurs',await page.evaluate(()=>[...document.querySelectorAll('[data-vf-count]')].every(el=>el.textContent===vfNumber(Number(el.dataset.vfCount),Number(el.dataset.decimals)||0))));
  await page.emulateMedia({reducedMotion:'reduce'});check('Réduction des animations respectée',await page.locator('.vf-ring-value').first().evaluate(el=>getComputedStyle(el).animationName==='none'));
  check('Aucune exception JavaScript',errors.length===0);
  const report={checkedAt:new Date().toISOString(),passed:checks.length,failed:0,checks,errors};fs.writeFileSync(path.join(output,'video-interactions.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:checks.length,failed:0}));
 }catch(e){fs.writeFileSync(path.join(output,'video-failure.json'),JSON.stringify({checks,errors,error:e.stack},null,2));throw e}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
