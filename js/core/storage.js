/* FORGE — Validation des carnets, migration des sauvegardes et stockage par compte. */
const FORGE_BACKUP_VERSION=1;
const FORGE_BACKUP_MAX_BYTES=16*1024*1024;
let storageReadIssue=null;
function backupError(detail){return new Error('Cette sauvegarde ne correspond pas au format Forge.'+(detail?' '+detail:''))}
function plainRecord(value){return !!value&&typeof value==='object'&&!Array.isArray(value)&&(Object.getPrototypeOf(value)===Object.prototype||Object.getPrototypeOf(value)===null)}
function inspectBackupTree(root){
 let count=0;
 function walk(value,depth){
  if(++count>250000||depth>40)throw backupError('Le fichier est trop complexe.');
  if(typeof value==='number'&&!Number.isFinite(value))throw backupError('Un nombre est invalide.');
  if(value===null||typeof value!=='object')return;
  if(!Array.isArray(value)&&!plainRecord(value))throw backupError('Un objet est invalide.');
  for(const key of Object.keys(value)){
   if(['__proto__','prototype','constructor'].includes(key))throw backupError('Une propriété est interdite.');
   walk(value[key],depth+1);
  }
 }
 walk(root,0);
}
function backupText(value,label,max=1000){if(typeof value!=='string'||value.length>max)throw backupError(label+' doit être un texte valide.');return value}
function backupNumber(value,label,min=0,max=Number.MAX_VALUE,integer=false){if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max||(integer&&!Number.isInteger(value)))throw backupError(label+' contient un nombre invalide.');return value}
function backupBool(value,label){if(typeof value!=='boolean')throw backupError(label+' doit être vrai ou faux.');return value}
function backupId(value,label){if(typeof value!=='string'||!/^[A-Za-z0-9_.:-]{1,100}$/.test(value))throw backupError(label+' contient un identifiant invalide.');return value}
function backupDay(value,label){
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))throw backupError(label+' contient une date invalide.');
 const date=new Date(value+'T12:00:00Z');if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==value)throw backupError(label+' contient une date invalide.');return value;
}
function backupTimestamp(value,label){if(typeof value!=='string'||value.length>80||!Number.isFinite(Date.parse(value)))throw backupError(label+' contient une date invalide.');return value}
function backupObject(value,label){if(!plainRecord(value))throw backupError(label+' doit être un objet.');return value}
function backupList(value,label,validate,max=50000){if(!Array.isArray(value)||value.length>max)throw backupError(label+' doit être une liste valide.');return value.map((entry,index)=>validate(entry,label+' '+(index+1),index))}
function backupUnique(items,label){const ids=items.map(x=>x.id).filter(Boolean);if(new Set(ids).size!==ids.length)throw backupError(label+' contient des identifiants en double.');return items}
function backupFields(value,label,defaults,validators){
 backupObject(value,label);const result={...defaults,...value};
 for(const [key,validate] of Object.entries(validators))if(result[key]!==undefined)result[key]=validate(result[key],label+' · '+key);
 return result;
}
function backupImage(value,label){
 backupText(value,label,FORGE_BACKUP_MAX_BYTES);
 const match=/^data:image\/(jpeg|png|webp|gif);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
 if(!match)throw backupError(label+' doit être une image JPEG, PNG, WebP ou GIF intégrée.');
 let bytes;try{bytes=atob(match[2])}catch{throw backupError(label+' contient une image illisible.')}
 const type=match[1],valid=type==='jpeg'?bytes.charCodeAt(0)===255&&bytes.charCodeAt(1)===216:type==='png'?bytes.slice(0,8)==='\x89PNG\r\n\x1a\n':type==='webp'?bytes.slice(0,4)==='RIFF'&&bytes.slice(8,12)==='WEBP':/^GIF8[79]a/.test(bytes);
 if(!valid)throw backupError(label+' ne correspond pas au format d’image annoncé.');return value;
}
function backupAvatar(value,label){
 backupText(value,label,500000);if(!value)return value;
 if(/^https?:\/\//i.test(value)){
  if(/[<>"`\\\r\n\t]/.test(value))throw backupError(label+' contient une adresse d’image invalide.');
  let url;try{url=new URL(value)}catch{throw backupError(label+' contient une adresse d’image invalide.')}
  if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw backupError(label+' contient une adresse d’image invalide.');
  return url.href.replace(/'/g,'%27');
 }
 if(/^assets\/[A-Za-z0-9_./-]+\.(svg|png|jpe?g|webp|gif)$/.test(value)&&!value.split('/').includes('..'))return value;
 if(value.startsWith('data:image/svg+xml,')){
  let svg;try{svg=decodeURIComponent(value.slice('data:image/svg+xml,'.length))}catch{throw backupError(label+' contient un avatar illisible.')}
  if(!/^\s*<svg\b/i.test(svg)||/<(?:script|foreignObject|iframe|image|use|style|animate|set)\b|<!|[\s/](?:on[a-z]+|href|xlink:href)\s*=|url\s*\(/i.test(svg))throw backupError(label+' contient un SVG non pris en charge.');
  return 'data:image/svg+xml,'+encodeURIComponent(svg).replace(/'/g,'%27');
 }
 if(value.startsWith('data:image/'))return backupImage(value,label);
 // Les premiers carnets utilisaient parfois un emoji comme avatar.
 if(value.length<=32&&!/[<>"'`\\/:;]/.test(value))return value;
 throw backupError(label+' doit être un avatar local ou une adresse HTTP(S) valide.');
}
function backupSet(value,label,finished=false){
 const result=backupFields(value,label,{weight:'',reps:'',rpe:''},{done:backupBool});
 for(const key of ['weight','reps','rpe']){
  const entry=result[key];
  if(!(typeof entry==='number'&&Number.isFinite(entry))&&!(typeof entry==='string'&&entry.length<=32&&(entry===''||/^-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(entry)&&Number.isFinite(Number(entry)))))throw backupError(label+' contient une série invalide.');
 }
 if(finished||result.done){if(result.weight===''||Number(result.weight)<0||result.reps===''||!Number.isInteger(Number(result.reps))||Number(result.reps)<=0||(result.rpe!==''&&(Number(result.rpe)<0||Number(result.rpe)>10)))throw backupError(label+' contient une série validée incorrecte.')}
 return result;
}
function validateBackup(data){
 if(!plainRecord(data))throw backupError('La racine doit être un carnet.');inspectBackupTree(data);
 if(!plainRecord(data.profile))throw backupError('Le profil est absent ou invalide.');
 const meta=data._forgeBackup;
 if(meta!==undefined){backupObject(meta,'Version');if(meta.format!=='forge-carnet'||!Number.isInteger(meta.version)||meta.version<1)throw backupError('La version est inconnue.');if(meta.version>FORGE_BACKUP_VERSION)throw new Error('Cette sauvegarde provient d’une version plus récente de Forge.');if(meta.exportedAt!==undefined)backupTimestamp(meta.exportedAt,'Date d’export')}
 const defaults=defaultDB(),result={...defaults,...data};delete result._forgeBackup;
 const text=(value,label)=>backupText(value,label),id=(value,label)=>backupId(value,label),num=(value,label)=>backupNumber(value,label),int=(value,label)=>backupNumber(value,label,0,Number.MAX_SAFE_INTEGER,true);
 result.profile=backupFields(data.profile,'Profil',defaults.profile,{setup:backupBool,name:(v,l)=>backupText(v,l,150),goal:text,level:(v,l)=>backupText(v,l,100),perWeek:(v,l)=>backupNumber(v,l,1,7,true),avatar:backupAvatar,bio:(v,l)=>backupText(v,l,10000),accent:(v,l)=>backupText(v,l,50)});
 result.settings=backupFields(result.settings,'Réglages',defaults.settings,{theme:(v,l)=>{if(!['light','dark'].includes(v))throw backupError(l+' doit être clair ou sombre.');return v},calories:(v,l)=>backupNumber(v,l,1),protein:(v,l)=>backupNumber(v,l,1),carbs:(v,l)=>backupNumber(v,l,1),fat:(v,l)=>backupNumber(v,l,1),water:(v,l)=>backupNumber(v,l,1),steps:int});
 result.steps=backupObject(result.steps,'Pas');
 for(const [date,value] of Object.entries(result.steps)){backupDay(date,'Pas');backupNumber(value,'Pas',0,200000,true)}
 result.health=backupFields(result.health,'Santé',{pulse:[]},{});
 result.health.pulse=backupList(result.health.pulse,'Pouls',(record,label)=>{const item=backupFields(record,label,{}, {date:backupDay,value:(v,l)=>backupNumber(v,l,30,240,true)});if(item.date===undefined||item.value===undefined)throw backupError(label+' est incomplet.');return item});
 result.xp=int(result.xp,'XP');result.visitBest=int(result.visitBest,'Record de présence');result.demo=backupBool(result.demo,'Démonstration');
 result.programs=backupUnique(backupList(result.programs,'Programmes',(p,label,pi)=>{
  const program=backupFields(p,label,{next:0},{id,name:text,next:int});id(program.id,label);text(program.name,label);
  program.days=backupUnique(backupList(program.days,label+' · jours',(d,dl,di)=>{
   const day=backupFields(d,dl,{id:'legacy-day-'+pi+'-'+di},{id,name:text});text(day.name,dl);
   day.exercises=backupUnique(backupList(day.exercises,dl+' · exercices',(e,el,ei)=>{
    const exercise=backupFields(e,el,{id:'legacy-ex-'+pi+'-'+di+'-'+ei,rest:90},{id,name:text,sets:(v,l)=>backupNumber(v,l,1,100,true),repsMin:(v,l)=>backupNumber(v,l,1,100000),repsMax:(v,l)=>backupNumber(v,l,1,100000),rest:(v,l)=>backupNumber(v,l,0,86400)});
    for(const key of ['name','sets','repsMin','repsMax'])if(exercise[key]===undefined)throw backupError(el+' est incomplet.');
    if(exercise.repsMax<exercise.repsMin)throw backupError(el+' contient un intervalle de répétitions invalide.');return exercise;
   },100),dl+' · exercices');return day;
  },366),label+' · jours');
  if(!program.days.length)throw backupError(label+' ne contient aucun jour.');program.next%=program.days.length;return program;
 },1000),'Programmes');
 if(result.activeProgram!==null){id(result.activeProgram,'Programme actif');if(!result.programs.some(p=>p.id===result.activeProgram))result.activeProgram=null}
 result.sessions=backupUnique(backupList(result.sessions,'Séances',(s,label)=>{
  const record=backupFields(s,label,{program:'',day:'Séance',duration:0,volume:0,sets:0},{id,date:backupDay,iso:backupTimestamp,program:text,day:text,duration:num,volume:num,sets:int});
  id(record.id,label);backupDay(record.date,label);
  record.exercises=backupList(record.exercises,label+' · exercices',(e,el)=>{const exercise=backupFields(e,el,{}, {name:text});text(exercise.name,el);exercise.sets=backupList(exercise.sets,el+' · séries',(s,sl)=>backupSet(s,sl,true),100);return exercise},100);return record;
 },50000),'Séances');
 result.meals=backupUnique(backupList(result.meals,'Repas',(m,label)=>{
  const item=backupFields(m,label,{}, {id,date:backupDay,meal:text,food:text,grams:num,kcal:num,p:num,c:num,f:num});
  for(const key of ['id','date','meal','food','grams','kcal','p','c','f'])if(item[key]===undefined)throw backupError(label+' est incomplet.');return item;
 }),'Repas');
 result.foods=backupUnique(backupList(result.foods,'Aliments',(f,label)=>{
  const item=backupFields(f,label,{}, {id,name:text,kcal:num,p:num,c:num,f:num});for(const key of ['id','name','kcal','p','c','f'])if(item[key]===undefined)throw backupError(label+' est incomplet.');return item;
 },10000),'Aliments');
 if(!result.foods.length)result.foods=defaults.foods;
 result.photos=backupUnique(backupList(result.photos,'Photos',(p,label)=>{
  const photo=backupFields(p,label,{caption:'',pose:'',tag:''},{id,date:backupDay,takenAt:backupTimestamp,caption:text,pose:text,tag:(v,l)=>{if(!['','train','event'].includes(v))throw backupError(l+' contient une catégorie inconnue.');return v},data:backupImage});
  for(const key of ['id','date','data'])if(photo[key]===undefined)throw backupError(label+' est incomplète.');return photo;
 },2000),'Photos');
 result.weights=backupList(result.weights,'Poids',(w,label)=>{const weight=backupFields(w,label,{}, {date:backupDay,value:(v,l)=>backupNumber(v,l,Number.MIN_VALUE)});if(weight.date===undefined||weight.value===undefined)throw backupError(label+' est incomplet.');return weight});
 result.habits=backupUnique(backupList(result.habits,'Habitudes',(h,label)=>{const habit=backupFields(h,label,{xp:10},{id,name:text,xp:int});id(habit.id,label);text(habit.name,label);return habit},1000),'Habitudes');
 result.goals=backupUnique(backupList(result.goals,'Objectifs',(g,label)=>{const goal=backupFields(g,label,{type:'Objectif',current:0},{id,name:text,type:text,current:num,target:(v,l)=>backupNumber(v,l,Number.MIN_VALUE)});id(goal.id,label);text(goal.name,label);if(goal.target===undefined)throw backupError(label+' est incomplet.');return goal},10000),'Objectifs');
 result.xpLog=backupList(result.xpLog,'Historique XP',(x,label)=>{const item=backupFields(x,label,{}, {id,date:backupTimestamp,n:(v,l)=>backupNumber(v,l,-Number.MAX_SAFE_INTEGER),reason:text});if(item.n===undefined||item.reason===undefined)throw backupError(label+' est incomplet.');return item});
 result.notifications=backupList(result.notifications,'Notifications',(x,label)=>typeof x==='string'?text(x,label):backupFields(x,label,{}, {id,date:backupTimestamp,text,title:text}));
 result.visits=backupList(result.visits,'Jours de présence',backupDay);
 result.visitMilestones=backupList(result.visitMilestones,'Paliers',int,1000);
 result.measurements=backupList(result.measurements,'Mesures',(measurement,label)=>backupFields(measurement,label,{}, {date:backupDay,bodyFat:(v,l)=>v===null?null:backupNumber(v,l,0,100)}));
 for(const field of ['notes','badges'])result[field]=backupList(result[field],field,x=>x);
 for(const field of ['water','sleep','habitLog','prs','lastSets']){
  const source=backupObject(result[field],field),map=Object.create(null);
  if(Object.keys(source).length>50000)throw backupError(field+' contient trop d’entrées.');
  for(const [key,value] of Object.entries(source)){
   if(field==='water'){backupDay(key,'Eau');map[key]=num(value,'Eau')}
   else if(field==='sleep'){backupDay(key,'Sommeil');map[key]=backupFields(value,'Sommeil',{quality:4},{hours:(v,l)=>backupNumber(v,l,0,24),quality:(v,l)=>backupNumber(v,l,1,5)});if(map[key].hours===undefined)throw backupError('La durée de sommeil est absente.')}
   else if(field==='habitLog'){if(!/^\d{4}-\d{2}-\d{2}_[A-Za-z0-9_.:-]{1,100}$/.test(key)||![0,1,true,false].includes(value))throw backupError('Le suivi d’habitudes est invalide.');backupDay(key.slice(0,10),'Habitude');map[key]=value}
   else if(field==='prs'){text(key,'Record');map[key]=num(value,'Record')}
   else{text(key,'Exercice');map[key]=backupList(value,'Dernières séries',(s,label)=>backupSet(s,label),100)}
  }
  result[field]=map;
 }
 result.whey=backupFields(result.whey,'Rappel whey',defaults.whey,{enabled:backupBool,dose:(v,l)=>backupNumber(v,l,1,100),times:(v,l)=>backupList(v,l,(time,label)=>{if(typeof time!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))throw backupError(label+' est invalide.');return time},24),lastNotice:(v,l)=>backupText(v,l,100)});
 backupObject(result.whey.lastTaken,'Prises whey');for(const [key,value] of Object.entries(result.whey.lastTaken)){if(!/^\d{4}-\d{2}-\d{2}_(?:\d{2}:\d{2}|prise)$/.test(key))throw backupError('Une prise de whey est invalide.');backupDay(key.slice(0,10),'Prise whey');backupTimestamp(value,'Prise whey')}
 if(result.photoNotice!==undefined)backupDay(result.photoNotice,'Rappel photo');
 if(result.workoutDraftResetAt!==undefined)backupNumber(result.workoutDraftResetAt,'Réinitialisation de séance');
 return result;
}
function mergeDB(data){
 const base=defaultDB();if(!plainRecord(data))return base;const merged={...base,...data};
 for(const key of Object.keys(base))if(Array.isArray(base[key]))merged[key]=Array.isArray(data[key])?data[key]:base[key];else if(plainRecord(base[key]))merged[key]={...base[key],...(plainRecord(data[key])?data[key]:{})};
 if(!['light','dark'].includes(merged.settings.theme))merged.settings.theme='light';return merged;
}
function readStoredDB(key,owner){
 storageReadIssue=null;
 try{const raw=localStorage.getItem(key);if(raw===null)return defaultDB();if(raw.length>FORGE_BACKUP_MAX_BYTES)throw backupError('Le fichier est trop volumineux.');return validateBackup(JSON.parse(raw))}
 catch(error){storageReadIssue={key,owner,message:error instanceof SyntaxError?'Le fichier local n’est plus un JSON lisible.':error.message};return defaultDB()}
}
function load(){return readStoredDB(KEY,'')}
function currentStorageIssue(){return storageReadIssue&&storageReadIssue.owner===currentEmail()?storageReadIssue:null}
function ensureWritableDB(){if(currentStorageIssue())throw new Error('Le carnet doit être récupéré avant de pouvoir le modifier.')}
function save(){ensureWritableDB();const email=currentEmail();if(email&&AUTH[email])return commitUserDB(DB,email);localStorage.setItem(KEY,JSON.stringify(DB));return true}
/* Une seule écriture fait foi. Un échec ne remplace ni DB ni le carnet enregistré. */
function commitUserDB(next,email=currentEmail()){
 if(!email||email!==currentEmail()||!AUTH[email])throw new Error('Le compte courant a changé.');
 const serialized=JSON.stringify(next);localStorage.setItem('forge_data_'+email,serialized);
 DB=next;storageReadIssue=null;
 try{localStorage.setItem(KEY,serialized)}catch{}
 return true;
}
