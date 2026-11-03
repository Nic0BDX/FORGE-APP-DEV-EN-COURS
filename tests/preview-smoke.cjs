/* Playwright + Chromium, outils de test uniquement ; aucune dépendance de l’app. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const project=path.resolve(__dirname,'..');
const base=process.env.FORGE_BASE_URL||'http://127.0.0.1:8080';
const artifacts=process.env.FORGE_ARTIFACTS||'/tmp/forge-preview-results';
fs.mkdirSync(artifacts,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const page=await context.newPage(),errors=[],checks=[],skipped=[];
 page.on('pageerror',e=>errors.push(e.message));
 const check=(name,fn)=>{assert.ok(fn,name);checks.push({name,status:'passed'});};
 try{
 await page.goto(base+'/index.html');
 await page.evaluate(()=>localStorage.setItem('real-account-sentinel','Do not change this test value'));
 const before=await page.evaluate(()=>JSON.stringify({...localStorage}));
 await page.goto(base+'/preview/phone.html');
 await page.frameLocator('iframe').nth(1).locator('.eh-head').waitFor();
 check('Three real application frames render',page.frames().length===4);
 for(const frame of page.frames().slice(1)) check('Isolated memory in '+new URL(frame.url()).search,await frame.evaluate(()=>window.__forgeDemoIsolated===true));
 const nutrition=page.frameLocator('#explore-frame');
 await page.locator('#explore-frame').scrollIntoViewIfNeeded();
 await nutrition.getByRole('button',{name:'Banane',exact:true}).click();
 await nutrition.locator('#mealGrams').fill('150');
 await nutrition.locator('#modalbox').getByRole('button',{name:'Ajouter',exact:true}).click();
 check('Nutrition interaction adds a meal',await page.frames()[3].evaluate(()=>DB.meals.length===5 && DB.meals.at(-1).grams===150));
 check('Demo actions preserve all persistent storage',await page.evaluate(()=>JSON.stringify({...localStorage}))===before);
 await page.locator('#third-screen').selectOption('profile');
 await nutrition.getByRole('heading',{name:'Profil',exact:true}).waitFor();
 check('Preview selector opens profile',await page.frames()[3].evaluate(()=>view==='profile'));
 await page.locator('#third-screen').selectOption('nutrition');
 await nutrition.getByRole('heading',{name:'Journal alimentaire'}).waitFor();
 check('Reload resets fictitious data',await page.frames()[3].evaluate(()=>DB.meals.length===4));
 const home=page.frameLocator('iframe').nth(1);
 await home.getByRole('button',{name:'Activer le mode clair',exact:true}).click();
 check('Demo theme changes independently',await page.frames()[2].evaluate(()=>DB.settings.theme==='light'));
 check('Another frame stays dark',await page.frames()[3].evaluate(()=>DB.settings.theme==='dark'));
 check('Theme change preserves real storage',await page.evaluate(()=>JSON.stringify({...localStorage}))===before);
 await page.getByRole('button',{name:'Réinitialiser les aperçus'}).click();
 await home.locator('.eh-head').waitFor();
 check('Reset control resets preview theme',await page.frames()[2].evaluate(()=>DB.settings.theme==='dark'));
 for(const width of [320,375,390,768,1440]){
  await page.setViewportSize({width,height:900});
  check('Preview has no horizontal overflow at '+width,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 await page.goto(base+'/APERCU.html');
 await page.locator('.vf-dashboard').waitFor();
 check('Standalone artifact renders the full application',page.frames().length===1);
 check('Standalone artifact has isolated data',await page.evaluate(()=>window.__forgeDemoIsolated && DB.profile.name==='Camille'));
 await page.evaluate(()=>nav('calendar'));
 await page.getByRole('heading',{name:'Calendrier',exact:true}).waitFor();
 check('Standalone navigation opens calendar',await page.evaluate(()=>view==='calendar'));
 await context.setOffline(true);
 const offlinePage=await context.newPage();
 offlinePage.on('pageerror',e=>errors.push(e.message));
 await offlinePage.setContent(fs.readFileSync(path.join(project,'APERCU.html'),'utf8'));
 await offlinePage.locator('.vf-dashboard').waitFor();
 check('Standalone HTML renders with embedded assets while network is disabled',await offlinePage.evaluate(()=>window.__forgeDemoIsolated&&[...document.images].every(i=>i.complete && i.naturalWidth>0)));
 await offlinePage.close();
 await context.setOffline(false);
 try {
  await page.goto(pathToFileURL(path.join(project,'APERCU.html')).href);
  await page.locator('.vf-dashboard').waitFor();
  check('Double-click file preview renders the application',page.frames().length===1);
 } catch(error) {
  if(!String(error).includes('ERR_BLOCKED_BY_ADMINISTRATOR'))throw error;
  skipped.push({name:'Direct file:// opening',reason:'Managed Chromium blocks file URLs: ERR_BLOCKED_BY_ADMINISTRATOR. No bypass attempted; HTTP validated.'});
 }
 check('No JavaScript exceptions',errors.length===0);
 const result={checkedAt:new Date().toISOString(),passed:checks.length,failed:0,skipped,checks,errors};
 fs.writeFileSync(path.join(artifacts,'preview-results.json'),JSON.stringify(result,null,2));
 console.log(JSON.stringify(result,null,2));
 }catch(error){fs.writeFileSync(path.join(artifacts,'preview-failure.json'),JSON.stringify({checks,errors,failure:error.stack},null,2));throw error;}
 finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
