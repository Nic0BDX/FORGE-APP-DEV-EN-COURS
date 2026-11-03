/* Contrôle complémentaire D07 : légendes en entier, y compris sans poids. */
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path');
const output=process.env.FORGE_TEST_OUTPUT||'/tmp/forge-d07-captions';fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:320,height:568},reducedMotion:'reduce'});
 const report={task:'D07-légendes',startedAt:new Date().toISOString(),checks:[],pageErrors:[]};page.on('pageerror',e=>report.pageErrors.push(String(e)));
 try{
  await page.goto((process.env.FORGE_BASE_URL||'http://127.0.0.1:8080')+'/preview/demo.html?screen=beforeafter');
  await page.waitForFunction(()=>window.__forgeDemoIsolated===true&&typeof DB!=='undefined');
  await page.evaluate(()=>{
   const img=color=>{const c=document.createElement('canvas');c.width=80;c.height=100;const x=c.getContext('2d');x.fillStyle=color;x.fillRect(0,0,80,100);return c.toDataURL('image/png');};
   DB.photos=[{id:'caption1',date:'2026-02-10',data:img('#245645'),caption:'Photo avant',tag:''},{id:'caption2',date:'2026-02-20',data:img('#a2b09b'),caption:'Photo après',tag:''}];DB.weights=[];DB.measurements=[];save();nav('beforeafter');
  });
  for(const theme of ['light','dark'])for(const width of [320,390,768]){
   await page.setViewportSize({width,height:width===320?568:844});await page.evaluate(theme=>{DB.settings.theme=theme;save();render();},theme);
   await page.locator('.r-ba').scrollIntoViewIfNeeded();
   const geometry=await page.locator('.r-ba figure').evaluateAll(figures=>figures.map(figure=>{const f=figure.getBoundingClientRect(),caption=figure.querySelector('figcaption'),c=caption.getBoundingClientRect();const range=document.createRange();range.selectNodeContents(caption);const lines=[...range.getClientRects()].filter(r=>r.width>0&&r.height>0);return {figureHeight:f.height,captionHeight:c.height,captionTop:c.top-f.top,captionBottom:c.bottom-f.bottom,text:caption.textContent,clipped:c.top<f.top-1||c.bottom>f.bottom+1||lines.some(r=>r.left<f.left-1||r.right>f.right+1||r.top<f.top-1||r.bottom>f.bottom+1)};}));
   const pass=geometry.length===2&&geometry.every(g=>!g.clipped);report.checks.push({name:`Légendes complètes sans poids : ${theme} ${width}px`,status:pass?'passed':'failed',geometry});
   if(width===320)await page.screenshot({path:path.join(output,`d07-legendes-${theme}-320.png`)});
  }
  report.checks.push({name:'Aucune exception JavaScript',status:report.pageErrors.length?'failed':'passed'});
 }catch(error){report.checks.push({name:'Exécution des légendes',status:'failed',detail:String(error.stack||error)});}
 finally{report.completedAt=new Date().toISOString();report.passed=report.checks.filter(x=>x.status==='passed').length;report.failed=report.checks.filter(x=>x.status==='failed').length;fs.writeFileSync(path.join(output,'resultats-d07-legendes.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();if(report.failed)process.exitCode=1;}
})();
