const fs=require('node:fs'),vm=require('node:vm');
const root=require('node:path').resolve(__dirname,'..');
const context=vm.createContext({console,Date,atob,URL});
for(const file of ['js/core/utils.js','js/data/avatars.js','js/core/default-db.js','js/core/storage.js','js/features/activity.js'])vm.runInContext(fs.readFileSync(root+'/'+file,'utf8'),context,{filename:file});
vm.runInContext(`
let DB=defaultDB();const checked=[];
const verify=(name,fn)=>{if(!fn())throw new Error(name);checked.push({name,status:'passed'})};
const key=forgeActivityDateAgo(),yesterday=forgeActivityDateAgo(1),old=forgeActivityDateAgo(10),future=forgeActivityDateAgo(-1);
const copy=()=>JSON.parse(JSON.stringify(DB));
verify('Defaults include separate activity targets',()=>DB.settings.activityCalories===1000&&DB.settings.exerciseMinutes===90&&DB.settings.standHours===12);
verify('Unknown activity remains null, while recorded exercise time is zero',()=>{const a=forgeActivitySummary();return a.activeCalories===null&&a.standHours===null&&a.distanceKm===null&&a.floors===null&&a.exerciseMinutes===0});
const legacy=copy();delete legacy.settings.bodyMotion;delete legacy.activity;delete legacy.settings.activityCalories;delete legacy.settings.exerciseMinutes;delete legacy.settings.standHours;
verify('Old backups migrate without losing existing data',()=>{const out=validateBackup(legacy);return Object.keys(out.activity).length===0&&out.settings.activityCalories===1000&&out.settings.exerciseMinutes===90&&out.settings.standHours===12&&out.foods.length===legacy.foods.length});
DB.activity[key]={activeCalories:0,standHours:0,distanceKm:0,floors:0,energy:0,recovery:0};
verify('Explicit zero is preserved as a known reading',()=>{const a=forgeActivityDay();return Object.values(a).filter(v=>v===0).length===6&&forgeActivitySummary().activeCalories===0});
DB.activity[key]={activeCalories:812,standHours:10,distanceKm:8.6,floors:14,energy:86,recovery:91};
DB.activity[yesterday]={activeCalories:100,standHours:4};DB.activity[old]={activeCalories:40,standHours:1};
DB.meals=[{id:'test-meal',date:key,meal:'Déjeuner',food:'Test',grams:100,kcal:9999,p:1,c:1,f:1}];
DB.sessions=[{id:'test-session',date:key,day:'Test',duration:3840,exercises:[],program:'',volume:0,sets:0},{id:'test-yesterday',date:yesterday,day:'Test',duration:120,exercises:[],program:'',volume:0,sets:0}];
verify('Today uses activity calories, independent of food calories',()=>{const a=forgeActivitySummary();return a.activeCalories===812&&a.exerciseMinutes===64&&a.standHours===10&&a.distanceKm===8.6&&a.floors===14&&a.days===1});
verify('Week sums only the seven-day range',()=>{const a=forgeActivitySummary('week');return a.activeCalories===912&&a.exerciseMinutes===66&&a.standHours===14&&a.days===7&&a.reportedDays.activeCalories===2&&a.reportedDays.distanceKm===1});
verify('Month includes older known readings',()=>forgeActivitySummary('month').activeCalories===952&&forgeActivitySummary('month').days===30);
verify('Valid activity round-trips through the backup validator',()=>validateBackup(copy()).activity[key].energy===86);
for(const [field,value] of [['activeCalories',-1],['activeCalories',30001],['activeCalories',null],['standHours',24.1],['standHours','10'],['distanceKm',1001],['floors',1.5],['floors',10001],['energy',100.5],['recovery',101]]){
 verify('Invalid '+field+' '+JSON.stringify(value)+' is rejected',()=>{const next=copy();next.activity[key][field]=value;try{validateBackup(next);return false}catch{return true}});
}
for(const bad of ['2026-02-30',future])verify('Invalid or future date '+bad+' is rejected',()=>{const next=copy();next.activity[bad]={activeCalories:5};try{validateBackup(next);return false}catch{return true}});
verify('Empty activity records are rejected',()=>{const next=copy();next.activity[key]={};try{validateBackup(next);return false}catch{return true}});
for(const [field,value] of [['activityCalories',0],['exerciseMinutes',1441],['standHours',25]])verify('Invalid target '+field+' is rejected',()=>{const next=copy();next.settings[field]=value;try{validateBackup(next);return false}catch{return true}});
verify('Old backups enable body motion by default',()=>validateBackup(legacy).settings.bodyMotion===true);
verify('Explicit body motion pause survives validation',()=>{const next=copy();next.settings.bodyMotion=false;return validateBackup(next).settings.bodyMotion===false});
verify('Body motion rejects nonboolean values',()=>{const next=copy();next.settings.bodyMotion='false';try{validateBackup(next);return false}catch{return true}});
const fields={},events=[];let writes=0;const memory=new Map();
const document={getElementById:id=>fields[id]},localStorage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>{writes++;memory.set(k,v)}};
const AUTH={'activity-test@forge.example':{name:'Test'}},currentEmail=()=> 'activity-test@forge.example';
function validCalendarDay(date){try{backupDay(date,'Date');return true}catch{return false}}
function toast(msg){events.push(msg)}function closeModal(){events.push('closed')}function render(){events.push('rendered')}
fields['forge-activity-date']={value:key};for(const field of FORGE_ACTIVITY_FIELDS)fields['forge-activity-'+field.key]={value:'',validity:{badInput:false}};
fields['forge-activity-activeCalories'].value='100';fields['forge-activity-standHours'].value='25';
const prior=JSON.stringify(DB);saveActivityRecord();verify('Invalid form does not mutate memory or persistence',()=>JSON.stringify(DB)===prior&&writes===0);
fields['forge-activity-standHours'].value='0';fields['forge-activity-energy'].value='90';saveActivityRecord();
verify('Saving optional fields persists exactly the known values',()=>{const r=DB.activity[key];return r.activeCalories===100&&r.standHours===0&&r.energy===90&&!('distanceKm' in r)&&!('recovery' in r)&&JSON.parse(memory.get('forge_data_'+currentEmail())).activity[key].energy===90});
const frozen=JSON.stringify(DB),originalSet=localStorage.setItem;localStorage.setItem=()=>{throw new Error('Quota')};fields['forge-activity-activeCalories'].value='200';saveActivityRecord();
verify('Write failure leaves the previous database intact',()=>JSON.stringify(DB)===frozen);localStorage.setItem=originalSet;
fields['forge-activity-date'].value=future;const savedWrites=writes;saveActivityRecord();verify('Future form date is refused before writing',()=>writes===savedWrites&&JSON.stringify(DB)===frozen);
this.report={checkedAt:new Date().toISOString(),passed:checked.length,failed:0,checks:checked};
`,context);
fs.writeFileSync(process.env.FORGE_ACTIVITY_REPORT||'/tmp/forge-activity-data-report.json',JSON.stringify(context.report,null,2));console.log(JSON.stringify({passed:context.report.passed,failed:0}));
