/* FORGE — Programmes et séance en cours */
function workouts(){return `<div class="row wrap"><div><div class="eyebrow">THÈME · ENTRAÎNEMENT</div><h1>Séances</h1><div class="sub">Des séances prêtes à ajouter à ton programme.</div></div><button class="btn" onclick="nav('program')">Mon programme →</button></div><div class="template-grid" style="margin-top:16px">${workoutTemplates.map(t=>`<div class="template-card"><div class="template-glow">${t.tag}</div><div class="row"><span class="pill orange">Environ ${t.duration}</span><span class="sub">${t.ex.length} exercice${t.ex.length===1?'':'s'}</span></div><h2>${esc(t.name)}</h2><div class="template-list">${t.ex.map(e=>`<div><span>${esc(e[0])}</span><b>${e[1]} × ${e[2]}–${e[3]}</b></div>`).join('')}</div><button class="btn primary wide" onclick="installTemplate('${t.id}')">Ajouter à mon programme</button></div>`).join('')}</div></div>`}

function program(){
 if(!DB.programs.length)return `<div class="row"><div><div class="eyebrow">ENTRAÎNEMENT</div><h1>Programme</h1></div><button class="btn primary" onclick="openProgramModal()">+ Nouveau</button></div><div class="card empty">Crée ton premier programme ou choisis une séance proposée.</div>`;
 return `<div class="row wrap"><div><div class="eyebrow">ENTRAÎNEMENT</div><h1>Programmes</h1></div><button class="btn primary" onclick="openProgramModal()">+ Nouveau</button></div>
 <div class="grid g2" style="margin-top:16px">${DB.programs.map(p=>`<div class="card"><div class="row"><div><h2>${esc(p.name)}</h2><div class="sub">${p.days.length} séance${p.days.length===1?'':'s'} dans ce programme · ${p.id===DB.activeProgram?'Programme actif':'Disponible'}</div></div>${p.id===DB.activeProgram?'<span class="pill green">ACTIF</span>':''}</div>
 ${p.days.map((d,i)=>`<div class="item" style="margin-top:8px"><div><b>${esc(d.name)}</b><div class="sub">${d.exercises.length} exercice${d.exercises.length===1?'':'s'}</div></div><button class="btn small primary" onclick="startWorkout('${p.id}',${i})">▶</button></div>`).join('')}
 <div class="row gap" style="margin-top:12px"><button class="btn small" onclick="openProgramModal('${p.id}')">Modifier</button><button class="btn small" onclick="activateProgram('${p.id}')">Activer</button><button class="btn small" onclick="deleteProgram('${p.id}')">Supprimer</button></div></div>`).join('')}</div>`;
}
function openProgramModal(id){
 const p=id?JSON.parse(JSON.stringify(DB.programs.find(x=>x.id===id))):{id:null,name:'',days:[]};
 document.getElementById('modalbox').innerHTML=`<div class="row"><h2>${id?'Modifier':'Nouveau'} programme</h2><button class="icon" onclick="closeModal()">×</button></div>
 <label>Nom</label><input id="pn" value="${esc(p.name)}" placeholder="Push / Pull / Legs">
 <div id="days"></div><button class="btn small" onclick="addDayEditor()">+ Ajouter un jour</button><div class="row gap" style="margin-top:16px"><button class="btn" onclick="closeModal()">Annuler</button><button class="btn primary" onclick="saveProgramModal('${id||''}')">Enregistrer</button></div>`;
 window.editProg=p;renderDayEditors();document.getElementById('modal').classList.add('show')
}
function renderDayEditors(){document.getElementById('days').innerHTML=(window.editProg.days||[]).map((d,i)=>`<div class="card" style="margin-top:12px;padding:13px"><div class="row"><input style="margin:0" value="${esc(d.name)}" oninput="editProg.days[${i}].name=this.value"><button class="btn small danger" onclick="editProg.days.splice(${i},1);renderDayEditors()">×</button></div>
 ${d.exercises.map((e,j)=>`<div class="item" style="margin-top:7px"><span>${esc(e.name)} · ${e.sets}×${e.repsMin}-${e.repsMax} · ${e.rest}s</span><button class="btn small" onclick="editProg.days[${i}].exercises.splice(${j},1);renderDayEditors()">×</button></div>`).join('')}
 <div class="grid g2" style="margin-top:8px"><input id="en${i}" placeholder="Exercice"><input id="es${i}" type="number" value="3" placeholder="Séries"><input id="er1${i}" type="number" value="8" placeholder="Reps min"><input id="er2${i}" type="number" value="10" placeholder="Reps max"><input id="rt${i}" type="number" value="90" placeholder="Repos sec"></div><button class="btn small" onclick="addExerciseEditor(${i})">+ Exercice</button></div>`).join('')}
function addDayEditor(){window.editProg.days.push({id:uid(),name:'Jour '+(window.editProg.days.length+1),exercises:[]});renderDayEditors()}
function addExerciseEditor(i){
 const name=document.getElementById('en'+i).value.trim(),sets=Number(document.getElementById('es'+i).value),repsMin=Number(document.getElementById('er1'+i).value),repsMax=Number(document.getElementById('er2'+i).value),rest=Number(document.getElementById('rt'+i).value);
 if(!name||name.length>1000||['__proto__','prototype','constructor'].includes(name))return toast('Indique un nom d’exercice valide.');
 if(!Number.isInteger(sets)||sets<1||sets>100||!Number.isFinite(repsMin)||repsMin<=0||!Number.isFinite(repsMax)||repsMax<repsMin||repsMax>100000||!Number.isFinite(rest)||rest<0||rest>86400)return toast('Vérifie les séries, répétitions et secondes de repos.');
 window.editProg.days[i].exercises.push({id:uid(),name,sets,repsMin,repsMax,rest});renderDayEditors();
}
function saveProgramModal(id){
 const edited=JSON.parse(JSON.stringify(window.editProg));edited.name=document.getElementById('pn').value.trim()||'Mon programme';if(!edited.days.length)return toast('Ajoute au moins un jour');
 const next=JSON.parse(JSON.stringify(DB));if(id){const index=next.programs.findIndex(program=>program.id===id);if(index<0)return toast('Ce programme n’existe plus.');next.programs[index]=edited}else{edited.id=uid();next.programs.push(edited);if(!next.activeProgram)next.activeProgram=edited.id}
 try{commitUserDB(validateBackup(next))}catch(error){return toast(error.message.replace('Cette sauvegarde ne correspond pas au format Forge.','Le programme n’a pas été enregistré.'))}
 closeModal();render();toast('Programme enregistré');
}
function activateProgram(id){DB.activeProgram=id;save();render();toast('Programme actif')}
function deleteProgram(id){if(!confirm('Supprimer ce programme ?'))return;DB.programs=DB.programs.filter(p=>p.id!==id);if(DB.activeProgram===id)DB.activeProgram=DB.programs[0]?.id||null;save();render()}

/* Brouillon de séance : petit document distinct du carnet et isolé par compte. */
const WORKOUT_DRAFT_PREFIX='forge_workout_draft_v1:';
let restPaused=false,restOpen=false,restDeadline=0,restRemainingMs=0,workoutDraftSaved=true;
function workoutDraftKey(email=currentEmail()){return WORKOUT_DRAFT_PREFIX+encodeURIComponent(email)}
function workoutSetError(s){
 if(s.weight===''||!Number.isFinite(Number(s.weight))||Number(s.weight)<0)return 'Indique une charge de 0 kg ou plus.';
 if(s.reps===''||!Number.isInteger(Number(s.reps))||Number(s.reps)<=0)return 'Indique un nombre entier de répétitions supérieur à 0.';
 if(s.rpe!==''&&(!Number.isFinite(Number(s.rpe))||Number(s.rpe)<0||Number(s.rpe)>10))return 'Le RPE doit être compris entre 0 et 10, ou laissé vide.';
 return '';
}
function readWorkoutDraft(email=currentEmail()){
 if(!email)return null;
 try{
  const raw=localStorage.getItem(workoutDraftKey(email));if(!raw||raw.length>512000)return null;
  const d=JSON.parse(raw),s=d?.session;
  const text=x=>typeof x==='string'&&x.length<=1000;
  const id=x=>typeof x==='string'&&/^[A-Za-z0-9_.:-]{1,100}$/.test(x);
  const value=x=>(typeof x==='string'&&x.length<=32&&(x===''||Number.isFinite(Number(x))))||(typeof x==='number'&&Number.isFinite(x));
  if(d.version!==1||!Number.isFinite(d.updatedAt)||d.updatedAt<=Number(DB.workoutDraftResetAt||0)||d.owner!==email||!s||s.owner!==email||!id(s.id)||!id(s.pid)||!Number.isInteger(s.di)||s.di<0||!text(s.program)||!text(s.day)||!Number.isFinite(s.started)||s.started<0||s.started>Date.now()+60000)return null;
  if(!Array.isArray(s.exercises)||!s.exercises.length||s.exercises.length>100)return null;
  for(const e of s.exercises){
   if(!e||!text(e.name)||!text(e.target)||!Number.isFinite(e.rest)||e.rest<0||e.rest>86400||!Array.isArray(e.sets)||e.sets.length>100)return null;
   for(const set of e.sets)if(!set||!value(set.weight)||!value(set.reps)||!value(set.rpe)||typeof set.done!=='boolean'||(set.done&&workoutSetError(set)))return null;
  }
  const r=d.rest;
  if(!r||!Number.isFinite(r.remainingMs)||r.remainingMs<0||r.remainingMs>86400000||!Number.isFinite(r.deadline)||r.deadline<0||typeof r.paused!=='boolean'||typeof r.open!=='boolean')return null;
  // L’écriture du carnet peut avoir réussi juste avant une fermeture de l’onglet.
  // Un identifiant déjà enregistré ne doit jamais produire une seconde séance ou des XP.
  if(DB.sessions.some(x=>x.id===s.id)){try{localStorage.removeItem(workoutDraftKey(email))}catch{}return null}
  return d;
 }catch{return null}
}
function remainingRestMs(){return restPaused?restRemainingMs:Math.max(0,restDeadline-Date.now())}
function showWorkoutSaveState(){
 const el=document.getElementById('workoutDraftStatus');
 if(el){el.textContent=workoutDraftSaved?'Saisie conservée dans ce navigateur.':'La sauvegarde locale a échoué. Garde cette page ouverte pour conserver ta saisie.';el.setAttribute('role',workoutDraftSaved?'status':'alert')}
}
function persistWorkoutDraft(){
 if(!session)return true;
 const email=session.owner;
 if(!email||email!==currentEmail()||!isLogged())return false;
 const draft={version:1,owner:email,updatedAt:Math.max(Date.now(),Number(DB.workoutDraftResetAt||0)+1),session,rest:{deadline:restDeadline,remainingMs:remainingRestMs(),paused:restPaused,open:restOpen}};
 try{localStorage.setItem(workoutDraftKey(email),JSON.stringify(draft));workoutDraftSaved=true;showWorkoutSaveState();return true}
 catch{workoutDraftSaved=false;showWorkoutSaveState();return false}
}
function clearWorkoutDraft(email=currentEmail()){
 try{localStorage.removeItem(workoutDraftKey(email));return true}catch{toast('Le brouillon n’a pas pu être supprimé. Réessaie lorsque le stockage est disponible.');return false}
}
function stopWorkoutRuntime(){
 clearInterval(sessionTick);clearInterval(restTick);sessionTick=null;restTick=null;
 session=null;rest=0;restPaused=false;restOpen=false;restDeadline=0;restRemainingMs=0;
}
function suspendWorkout(){if(session&&!persistWorkoutDraft()){toast('La sauvegarde locale a échoué. Garde cette page ouverte pour conserver ta saisie.');return false}stopWorkoutRuntime();return true}
function startWorkoutClock(){
 clearInterval(sessionTick);
 const runningId=session.id,owner=session.owner;
 sessionTick=setInterval(()=>{if(!session||session.id!==runningId||currentEmail()!==owner)return;const el=document.getElementById('workTimer');if(el)el.textContent=fmtSec((Date.now()-session.started)/1000)},1000);
}
function workoutResumeCard(){
 if(view==='session'||view==='summary')return '';
 const d=session?{session}:readWorkoutDraft();if(!d)return '';
 const s=d.session,total=s.exercises.reduce((n,e)=>n+e.sets.length,0),done=s.exercises.reduce((n,e)=>n+e.sets.filter(x=>x.done).length,0);
 return `<section class="eh-card workout-resume-card" aria-labelledby="workout-resume-title" style="margin-bottom:20px"><div class="eyebrow">${session&&!workoutDraftSaved?'SÉANCE EN COURS':'SÉANCE ENREGISTRÉE'}</div><h2 id="workout-resume-title" style="margin:10px 0">Une séance t’attend</h2><p class="sub">${esc(s.day)} · ${done}/${total} séries validées</p><p class="sub">${session&&!workoutDraftSaved?'La sauvegarde locale a échoué. Garde cette page ouverte pour conserver ta saisie.':'Tes séries saisies sont conservées dans ce navigateur. Reprends quand tu es prêt.'}</p><div class="row gap wrap" style="margin-top:14px"><button class="btn primary" onclick="resumeWorkout()">${ico('play')} Reprendre la séance</button><button class="btn ghost" onclick="discardWorkoutDraft()">Abandonner la séance</button></div></section>`;
}
function existingWorkoutChoice(){
 document.getElementById('modalbox').innerHTML=`<h2>Une séance t’attend</h2><p class="sub">Reprends ta séance en cours, ou abandonne-la avant d’en commencer une autre.</p><div class="row gap wrap" style="margin-top:18px"><button class="btn primary" onclick="resumeWorkout()">Reprendre la séance</button><button class="btn" onclick="discardWorkoutDraft()">Abandonner la séance</button><button class="btn ghost" onclick="closeModal()">Fermer</button></div>`;openModal();
}
function startWorkout(pid,di){
 if(session||readWorkoutDraft())return existingWorkoutChoice();
 const p=DB.programs.find(x=>x.id===pid),d=p?.days[di];if(!d)return;
 if(!d.exercises?.length)return toast('Ajoute au moins un exercice à cette séance.');
 session={id:uid(),owner:currentEmail(),pid,di,program:p.name,day:d.name,started:Date.now(),exercises:d.exercises.map(e=>({name:e.name,target:`${e.sets}×${e.repsMin}-${e.repsMax}`,rest:Number(e.rest)||0,sets:Array.from({length:e.sets},(_,j)=>{const last=DB.lastSets[e.name]?.[j]||{};return {weight:last.weight??'',reps:last.reps??'',rpe:last.rpe??'',done:false}})}))};
 rest=0;restDeadline=0;restRemainingMs=0;restPaused=false;restOpen=false;
 view='session';persistWorkoutDraft();startWorkoutClock();render();
}
function resumeWorkout(){
 if(session){closeModal();nav('session');return}
 const draft=readWorkoutDraft();if(!draft){toast('Aucune séance à reprendre pour ce compte.');closeModal();render();return}
 session=draft.session;restPaused=draft.rest.paused;restOpen=draft.rest.open;
 restDeadline=draft.rest.deadline;restRemainingMs=draft.rest.remainingMs;rest=Math.ceil(remainingRestMs()/1000);
 if(rest===0){restDeadline=0;restRemainingMs=0;restPaused=false}
 workoutDraftSaved=true;startWorkoutClock();clearInterval(restTick);
 if(rest>0)restTick=setInterval(restStep,250);
 closeModal();nav('session');persistWorkoutDraft();
}
function discardWorkoutDraft(){
 const email=session?.owner||currentEmail();
 if(!confirm('Abandonner cette séance ? Ses séries ne seront pas ajoutées à l’historique.'))return false;
 if(!clearWorkoutDraft(email))return false;
 stopWorkoutRuntime();closeModal();nav('home');toast('Séance abandonnée.');return true;
}
function updateWorkoutField(i,j,field,value){
 if(!session||session.owner!==currentEmail()||!['weight','reps','rpe'].includes(field))return;
 const set=session.exercises[i]?.sets[j];if(!set)return;
 set[field]=value;
 if(set.done){
  set.done=false;
  const row=document.querySelectorAll('.es-ex')[i]?.querySelectorAll('.es-set')[j];
  row?.classList.remove('done');const button=row?.querySelector('.es-check');button?.classList.remove('on');button?.setAttribute('aria-pressed','false');
  const count=sessionCounts();const total=document.getElementById('workPct');if(total)total.textContent=count.pct;
  document.querySelectorAll('.es-seg i').forEach((el,n)=>{const e=session.exercises[n];el.style.setProperty('--f',e.sets.filter(x=>x.done).length/Math.max(1,e.sets.length))});
  const counter=document.querySelectorAll('.es-count')[i];if(counter)counter.textContent=session.exercises[i].sets.filter(x=>x.done).length+'/'+session.exercises[i].sets.length;
 }
 persistWorkoutDraft();
}
function fmtSec(s){s=Math.max(0,Math.round(s));return `${Math.floor(s/3600)?Math.floor(s/3600)+':':''}${String(Math.floor(s/60)%60).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
function sessionCounts(){const total=session.exercises.reduce((a,e)=>a+e.sets.length,0),done=session.exercises.reduce((a,e)=>a+e.sets.filter(x=>x.done).length,0);return {total,done,pct:total?Math.round(done/total*100):0}}
function sessionPage(){
 if(!session)return home();
 const c=sessionCounts(),cur=session.exercises.findIndex(e=>e.sets.some(x=>!x.done));
 const el=Math.floor((Date.now()-session.started)/1000);
 return `<div class="es">
 <div class="es-top"><div class="es-title">
  <button class="es-round" onclick="cancelWorkout()" aria-label="Annuler la séance">${ico('back')}</button>
  <div><h1>${esc(session.day)}</h1><small><span id="workTimer">${fmtSec(el)}</span> · <span id="workPct">${c.pct}</span>%</small></div>
  <button class="es-round light" onclick="finishWorkout()" aria-label="Terminer la séance">${ico('flag')}</button></div>
  <div class="es-seg" aria-hidden="true">${session.exercises.map(e=>`<i style="--f:${e.sets.length?e.sets.filter(x=>x.done).length/e.sets.length:0}"></i>`).join('')}</div></div>
 <p id="workoutDraftStatus" class="sub" role="status">${workoutDraftSaved?'Saisie conservée dans ce navigateur.':'La sauvegarde locale a échoué. Garde cette page ouverte pour conserver ta saisie.'}</p><p class="sub">RPE : effort ressenti de 0 à 10. Facultatif.</p>
 ${session.exercises.map((e,i)=>{const cat=exerciseCatalog.find(x=>x.name===e.name);const dn=e.sets.filter(x=>x.done).length;return `<section class="es-ex ${i===cur?'cur':''}">
  ${i===cur?`<span class="es-tag">${ico('bolt')} En cours</span>`:''}
  <div class="es-ex-h"><div class="es-thumb" aria-hidden="true">${cat?.ico||'🏋️'}</div><div><b>${esc(e.name)}</b><small>${esc(cat?.muscle||'')}${cat?' · ':''}${esc(e.target)}</small></div><span class="es-count">${dn}/${e.sets.length}</span></div>
  <div class="es-sets"><div class="es-lab"><span>SÉRIE</span><span>KG</span><span>REPS</span><span>RPE</span><span></span></div>
  ${e.sets.map((s,j)=>`<div class="es-set ${s.done?'done':''}"><span class="es-n">${j+1}</span><input type="number" inputmode="decimal" step="any" min="0" value="${esc(s.weight)}" aria-label="Charge série ${j+1}" oninput="updateWorkoutField(${i},${j},'weight',this.value)"><input type="number" inputmode="numeric" min="1" step="1" value="${esc(s.reps)}" aria-label="Répétitions série ${j+1}" oninput="updateWorkoutField(${i},${j},'reps',this.value)"><input type="number" inputmode="decimal" step=".5" min="0" max="10" value="${esc(s.rpe)}" aria-label="RPE série ${j+1}" oninput="updateWorkoutField(${i},${j},'rpe',this.value)"><button class="es-check ${s.done?'on':''}" aria-pressed="${s.done}" aria-label="Valider la série ${j+1}" onclick="toggleSet(${i},${j})">${ico('check')}</button></div>`).join('')}</div>
  <div class="es-ex-f"><button onclick="addSet(${i})">${ico('plus')} Série</button><button onclick="startRest(${e.rest})">${ico('clock')} Repos ${e.rest}s</button></div></section>`}).join('')}
 <div class="es-end"><button class="btn primary wide" onclick="finishWorkout()">Terminer la séance</button><button class="btn ghost wide" onclick="cancelWorkout()">Annuler sans enregistrer</button></div>
 <div class="es-bar ${rest>0?'resting':''} ${restOpen?'open':''}" id="restBar" role="group" aria-label="Minuteur de repos">
  <div class="es-bar-main"><button class="es-skip" onclick="stopRest()">Passer le repos</button><span class="es-time" id="restTimer" aria-live="off">${fmtSec(rest)}</span><button class="es-plus" onclick="addRest(15)">+15 s</button>
   <button class="es-ctl" onclick="toggleRestPause()" aria-label="${restPaused?'Reprendre':'Pause'}">${ico(restPaused?'play':'pause')}</button>
   <button class="es-ctl es-up" onclick="toggleRestPanel()" aria-label="Durées de repos" aria-expanded="${restOpen}">${ico('up')}</button></div>
  <div class="es-panel">${[30,60,90,120,180].map(n=>`<button onclick="startRest(${n})">${n<120?n+'s':(n/60)+' min'}</button>`).join('')}</div></div>
 </div>`;
}
function keepScroll(fn){const y=window.scrollY;fn();window.scrollTo(0,y)}
function toggleSet(i,j){
 const set=session?.exercises[i]?.sets[j];if(!set)return;
 if(!set.done){const message=workoutSetError(set);if(message){toast(message);return}}
 set.done=!set.done;persistWorkoutDraft();keepScroll(render);
 if(set.done&&session.exercises[i].rest)startRest(session.exercises[i].rest);
}
function addSet(i){const e=session?.exercises[i];if(!e)return;if(e.sets.length>=100)return toast('Cette séance contient déjà 100 séries pour cet exercice.');const l=e.sets.at(-1);e.sets.push({weight:l?.weight??'',reps:l?.reps??'',rpe:'',done:false});persistWorkoutDraft();keepScroll(render)}
function startRest(n){
 if(!session)return;
 const seconds=Number(n);if(!Number.isFinite(seconds)||seconds<=0||seconds>86400)return;
 clearInterval(restTick);restRemainingMs=seconds*1000;restDeadline=Date.now()+restRemainingMs;rest=seconds;restPaused=false;
 restTick=setInterval(restStep,250);persistWorkoutDraft();updateRest(true);
}
function restStep(){
 if(!session||session.owner!==currentEmail()||restPaused)return;
 const previous=rest;rest=Math.ceil(remainingRestMs()/1000);
 if(rest<=0){rest=0;restDeadline=0;restRemainingMs=0;clearInterval(restTick);persistWorkoutDraft();if(previous>0){beep();toast('Repos terminé 🔔')}}
 updateRest();
}
function stopRest(){clearInterval(restTick);rest=0;restDeadline=0;restRemainingMs=0;restPaused=false;persistWorkoutDraft();updateRest(true)}
function addRest(n){
 if(!session||!Number.isFinite(n)||n<=0)return;
 const remaining=remainingRestMs();
 if(remaining<=0)return startRest(n);
 restRemainingMs=Math.min(86400000,remaining+n*1000);if(!restPaused)restDeadline=Date.now()+restRemainingMs;
 rest=Math.ceil(restRemainingMs/1000);persistWorkoutDraft();updateRest();
}
function toggleRestPause(){
 const remaining=remainingRestMs();if(remaining<=0)return;
 if(restPaused){restPaused=false;restDeadline=Date.now()+restRemainingMs;clearInterval(restTick);restTick=setInterval(restStep,250)}
 else{restRemainingMs=remaining;restPaused=true;restDeadline=0}
 rest=Math.ceil(restRemainingMs/1000);persistWorkoutDraft();keepScroll(render);
}
function toggleRestPanel(){restOpen=!restOpen;persistWorkoutDraft();document.getElementById('restBar')?.classList.toggle('open',restOpen);document.querySelector('.es-up')?.setAttribute('aria-expanded',restOpen)}
function updateRest(full){const e=document.getElementById('restTimer');if(e)e.textContent=fmtSec(rest);document.getElementById('restBar')?.classList.toggle('resting',rest>0);if(full&&view==='session'&&document.getElementById('restBar'))keepScroll(render)}
function beep(){try{const c=new AudioContext(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=880;g.gain.value=.08;o.start();setTimeout(()=>{o.stop();c.close()},250)}catch{}}
function cancelWorkout(){return discardWorkoutDraft()}
function finishWorkout(){
 if(!session||session.owner!==currentEmail())return;
 const running=session,email=running.owner;
 let latest;try{const raw=localStorage.getItem('forge_data_'+email);if(raw===null)throw new Error('Carnet absent');const saved=JSON.parse(raw);if(!saved||typeof saved!=='object'||Array.isArray(saved)||!Array.isArray(saved.sessions))throw new Error('Carnet incompatible');latest=validateBackup(saved)}catch{return toast('Le carnet enregistré ne peut pas être lu. Garde cette page ouverte et réessaie.')}
 if(latest.sessions.some(x=>x.id===running.id)){DB=latest;clearWorkoutDraft(email);stopWorkoutRuntime();nav('summary');return}
 let sets=0,volume=0,prs=[];
 const completed=running.exercises.map(e=>({name:e.name,sets:e.sets.filter(s=>s.done)}));
 for(const e of completed)for(const s of e.sets){const error=workoutSetError(s);if(error)return toast(error);sets++;volume+=Number(s.weight)*Number(s.reps)}
 if(!sets)return toast('Valide au moins une série pour enregistrer ta séance.');
 if(!Number.isFinite(volume))return toast('Le volume calculé est trop élevé. Vérifie tes charges et répétitions.');
 const next=JSON.parse(JSON.stringify(latest)),dur=Math.max(0,Math.round((Date.now()-running.started)/1000));
 running.exercises.forEach((e,i)=>{const done=completed[i].sets;if(!done.length)return;next.lastSets[e.name]=e.sets.map(s=>({weight:s.weight,reps:s.reps,rpe:s.rpe}));const best=Math.max(...done.map(s=>Number(s.weight)));if(next.prs[e.name]===undefined||best>next.prs[e.name]){next.prs[e.name]=best;prs.push(`${e.name} · ${best} kg`)}});
 const program=next.programs.find(x=>x.id===running.pid);if(program?.days.length)program.next=(running.di+1)%program.days.length;
 next.sessions.unshift({id:running.id,date:today(),iso:new Date().toISOString(),program:running.program,day:running.day,duration:dur,volume,sets,exercises:completed});
 const rewards=[{n:100,reason:'Séance terminée'},...(prs.length?[{n:100,reason:'Nouveau record personnel'}]:[])];
 for(const reward of rewards){next.xp+=reward.n;next.xpLog.unshift({id:uid(),date:new Date().toISOString(),...reward});if(next.xpLog.length>250)next.xpLog.pop();next.notifications.unshift({id:uid(),date:new Date().toISOString(),text:`+${reward.n} XP — ${reward.reason}`})}
 try{commitUserDB(next,email)}catch{toast(workoutDraftSaved?'La séance n’a pas pu être enregistrée. Ton brouillon reste disponible ; libère de l’espace puis réessaie.':'La séance n’a pas pu être enregistrée. Garde cette page ouverte pour conserver ta saisie.');return}
 clearWorkoutDraft(email);stopWorkoutRuntime();
 window.lastSummary={dur,volume,sets,prs,day:running.day,program:running.program,exN:completed.filter(e=>e.sets.length).length};
 view='summary';window.__fresh=true;render();toast('Séance enregistrée. '+rewards.reduce((n,r)=>n+r.n,0)+' XP ajoutés.');
}

function summary(){
 const last=DB.sessions[0],r=window.lastSummary||(last?{dur:last.duration,volume:last.volume,sets:last.sets,prs:[],day:last.day,program:last.program,exN:last.exercises.length,date:last.date}:null);
 if(!r)return `<div class="esum"><div class="eh-card"><div class="eh-empty">Aucune séance terminée pour le moment.</div><button class="btn primary wide" style="margin-top:12px" onclick="nav('home')">Retour à l’accueil</button></div></div>`;
 const prev=DB.sessions.slice(1).find(x=>x.day===r.day&&Number(x.volume)>0);
 const d=prev?((r.volume-prev.volume)/prev.volume*100):null;
 const when=r.date?fmtDate(r.date):new Date().toLocaleDateString('fr-FR',{day:'2-digit',month:'short'});
 return `<div class="esum">
  <section class="esum-hero rise" style="--i:0">${photo('hero-summary')}<button class="es-round esum-back" onclick="nav('home')" aria-label="Retour">${ico('back')}</button>
   <div class="esum-body"><h1>${esc(r.day||'Séance')}</h1><div class="eh-tags"><span>${ico('bolt')}${r.exN||0} exercice${(r.exN||0)>1?'s':''}</span><span>${ico('clock')}${Math.max(1,Math.round(r.dur/60))} min</span>${r.prs?.length?`<span>${ico('trophy')}${r.prs.length} record${r.prs.length>1?'s':''}</span>`:''}${d!==null?`<span>${ico('trend')}${d>=0?'+':''}${d.toFixed(0)} % volume</span>`:''}</div></div></section>
  <div class="esum-done rise" style="--i:1">Terminée · ${when}</div>
  <div class="esum-stats">
   <div class="esum-card rise" style="--i:2"><small>Durée</small><b>${fmtSec(r.dur||0)}</b></div>
   <div class="esum-card rise" style="--i:3"><small>Volume total</small><b>${Math.round(r.volume||0).toLocaleString('fr-FR')}<em>kg × rép.</em></b></div>
   <div class="esum-card rise" style="--i:4"><small>Exercices</small><b>${r.exN||0}</b></div>
   <div class="esum-card rise" style="--i:5"><small>Séries validées</small><b>${r.sets||0}</b></div>
   <div class="esum-card wide rise" style="--i:6"><small>Écart de volume avec la séance précédente</small>${d!==null?`<b class="${d>=0?'up':'down'}">${d>=0?'+':''}${d.toFixed(1)}<em>% de volume</em></b>`:`<div class="eh-empty" style="padding:6px 0 0">Pas encore de séance « ${esc(r.day)} » à comparer.</div>`}</div>
   <div class="esum-card wide rise" style="--i:7"><small>Records personnels</small>${r.prs?.length?`<div class="eh-list" style="margin-top:10px">${r.prs.map(x=>`<div class="eh-row"><div><b>${esc(x)}</b></div>${ico('trophy')}</div>`).join('')}</div>`:`<div class="eh-empty" style="padding:6px 0 0">Aucun nouveau record sur cette séance.</div>`}</div>
  </div>
  <div class="es-end rise" style="--i:8"><button class="btn primary wide" onclick="nav('home')">Retour à l’accueil</button><button class="btn wide" onclick="nav('history')">Voir l’historique</button></div>
 </div>`}
