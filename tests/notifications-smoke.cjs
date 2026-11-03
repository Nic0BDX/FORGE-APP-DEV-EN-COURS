/* C03 / CE-25 : les trois résultats de demande de permission sont distincts.
 * API Notification simulée dans un navigateur isolé : aucune demande système.
 */
const fs=require('node:fs'),path=require('node:path');const {chromium}=require('playwright');
const out=process.env.FORGE_TEST_OUTPUT||'/tmp/forge-notifications';fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const report={task:'C03-CE25',startedAt:new Date().toISOString(),checks:[],pageErrors:[],method:'API Notification remplacée par une simulation ; aucune permission système ni notification réelle.'};page.on('pageerror',e=>report.pageErrors.push(String(e)));
 try{
  await page.goto((process.env.FORGE_BASE_URL||'http://127.0.0.1:8080')+'/preview/demo.html?screen=memories');await page.waitForFunction(()=>window.__forgeDemoIsolated===true&&typeof DB!=='undefined');
  await page.evaluate(()=>{DB.photos=[];DB.whey.enabled=false;save();});
  for(const [route,action] of [['memories','requestPhotoNotifications'],['nutrition','requestWheyNotifications']])for(const [permission,message] of [['granted','Notifications autorisées'],['denied','Notifications bloquées dans ce navigateur'],['default','Autorisation non accordée pour le moment']]){
   await page.evaluate(({route,permission})=>{
    window.__permissionRequests=0;window.__notificationsConstructed=0;
    class FakeNotification{static permission=permission;static requestPermission(){window.__permissionRequests++;return Promise.resolve(permission);}constructor(){window.__notificationsConstructed++;}}
    Object.defineProperty(window,'Notification',{configurable:true,value:FakeNotification});nav(route);
   },{route,permission});
   await page.locator(`[onclick="${action}()"]`).click();await page.waitForFunction(()=>window.__permissionRequests===1);
   const actual=await page.evaluate(()=>({message:document.getElementById('toast').textContent,requests:window.__permissionRequests,notifications:window.__notificationsConstructed,enabled:DB.whey.enabled}));
   const pass=actual.message.startsWith(message)&&actual.requests===1&&actual.notifications===0&&actual.enabled===false;
   report.checks.push({name:`${route} : permission ${permission}`,status:pass?'passed':'failed',actual});
  }
  report.checks.push({name:'Aucune exception JavaScript',status:report.pageErrors.length?'failed':'passed'});
 }catch(error){report.checks.push({name:'Exécution CE25',status:'failed',detail:String(error.stack||error)});}
 finally{report.completedAt=new Date().toISOString();report.passed=report.checks.filter(x=>x.status==='passed').length;report.failed=report.checks.filter(x=>x.status==='failed').length;fs.writeFileSync(path.join(out,'resultats-notifications-c03.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();if(report.failed)process.exitCode=1;}
})();
