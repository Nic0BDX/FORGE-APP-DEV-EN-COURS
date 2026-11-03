/* FORGE PROJECT — écrans « référence v3 » : présentation de séance, progression, programmes, nutrition, souvenirs */
let previewSel=null,progRange='week',memFilter='all';
function previewWorkout(pid,di){previewSel={pid,di};view='preview';window.__fresh=true;render();scrollTo(0,0)}
function setProgRange(r){progRange=r;keepScroll(render)}
function exMeta(name){return exerciseCatalog.find(x=>x.name===name)||{}}
function thumb(emoji,cls=''){return `<div class="r-thumb ${cls}" aria-hidden="true">${emoji||'🏋️'}</div>`}

/* 2. Présentation de séance */
function estDuration(d){const t=d.exercises.reduce((a,e)=>a+(Number(e.sets)||0)*(45+(Number(e.rest)||60)),0),m=Math.round(t/60);return m>=60?`${Math.floor(m/60)}h ${String(m%60).padStart(2,'0')}`:`${m} min`}
function equipOf(d){const q=[...new Set(d.exercises.map(e=>exMeta(e.name).equipment).filter(Boolean))];return q.length?'Matériel : '+q.slice(0,2).join(', '):'Matériel : —'}
function doneToday(n){return DB.sessions.some(s=>s.date===today()&&(s.exercises||[]).some(e=>e.name===n))}
function previewPage(){
 const p=previewSel&&DB.programs.find(x=>x.id===previewSel.pid),d=p?.days[previewSel.di];
 if(!d){view='home';return home()}
 const muscles=[...new Set(d.exercises.map(e=>exMeta(e.name).muscle).filter(Boolean))];
 const sets=d.exercises.reduce((a,e)=>a+(Number(e.sets)||0),0);
 return `<div class="r-prev">
  <div class="r-sub rise" style="--i:0"><button class="es-round" onclick="nav('program')" aria-label="Retour">${ico('back')}</button><h1>Séance</h1></div>
  <section class="r-prev-hero rise" style="--i:0">${photo('hero-today')}

   <div class="r-prev-body"><h1>${esc(d.name).toUpperCase()}</h1><p>${esc(muscles.join(' · ')||p.name)}</p>
    <div class="r-meta"><span>${ico('clock')}Environ ${estDuration(d)}</span><span>${ico('bolt')}${esc(DB.profile.level||'Intermédiaire')}</span><span>${ico('train')}${esc(equipOf(d))}</span></div>
    <button class="eh-go" onclick="startWorkout('${p.id}',${previewSel.di})">${ico('play')} Commencer la séance</button></div></section>
  <h2 class="r-h2 rise" style="--i:1">Exercices</h2>
  <div class="r-list rise" style="--i:2">${d.exercises.map(e=>`<div class="r-row">${thumb(exMeta(e.name).ico)}<div><b>${esc(e.name)}</b><small>${e.sets} × ${e.repsMin}–${e.repsMax}</small></div>${doneToday(e.name)?'<span class="r-ok">'+ico('check')+'</span>':''}${ico('chev')}</div>`).join('')||'<div class="eh-empty">Aucun exercice dans ce jour.</div>'}</div>
 </div>`}

/* 3. Progression */
function volBuckets(range){
 const S=DB.sessions.filter(s=>Number(s.volume)>0),now=new Date();now.setHours(12,0,0,0);
 const sum=(a,b)=>S.filter(s=>{const t=new Date(s.date+'T12:00:00');return t>=a&&t<b}).reduce((x,s)=>x+Number(s.volume),0);
 const add=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
 let labels=[],vals=[],prev=0;
 if(range==='week'){const mon=add(now,-((now.getDay()+6)%7));labels=['L','M','M','J','V','S','D'];vals=labels.map((_,i)=>sum(add(mon,i),add(mon,i+1)));prev=sum(add(mon,-7),mon)}
 else if(range==='month'){const start=add(now,-27);for(let i=0;i<4;i++){labels.push('S'+(i+1));vals.push(sum(add(start,i*7),add(start,i*7+7)))}prev=sum(add(start,-28),start)}
 else{for(let i=11;i>=0;i--){const a=new Date(now.getFullYear(),now.getMonth()-i,1),b=new Date(now.getFullYear(),now.getMonth()-i+1,1);labels.push(a.toLocaleDateString('fr-FR',{month:'narrow'}).toUpperCase());vals.push(sum(a,b))}const a=new Date(now.getFullYear()-1,now.getMonth()+1,1);prev=sum(new Date(now.getFullYear()-2,now.getMonth()+1,1),a)}
 return {labels,vals,prev,total:vals.reduce((a,b)=>a+b,0)};
}
function areaChart(labels,vals){
 const W=320,H=150,pl=30,pb=22,pt=8,max=Math.max(1,...vals),top=Math.ceil(max/1000)*1000||1000,n=vals.length;
 const x=i=>pl+(n>1?i*(W-pl-6)/(n-1):0),y=v=>pt+(H-pt-pb)*(1-v/top);
 const pts=vals.map((v,i)=>[x(i),y(v)]),line=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
 const grid=[0,.25,.5,.75,1].map(f=>{const v=top*f,yy=y(v);return `<line x1="${pl}" x2="${W}" y1="${yy}" y2="${yy}" stroke="var(--line)"/><text x="${pl-5}" y="${yy+3}" text-anchor="end" fill="var(--muted)" font-size="8">${v>=1000?(v/1000)+'k':v}</text>`}).join('');
 return `<svg class="r-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Volume d’entraînement, en kilogrammes multipliés par les répétitions"><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".55"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>${grid}<path d="${line} L${x(n-1)} ${H-pb} L${x(0)} ${H-pb}Z" fill="url(#ag)"/><path class="r-line" d="${line}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" pathLength="1"/>${labels.map((l,i)=>`<text x="${x(i)}" y="${H-6}" text-anchor="middle" fill="var(--muted)" font-size="9">${l}</text>`).join('')}</svg>`}
function progressPage(){
 const b=volBuckets(progRange),delta=b.prev?((b.total-b.prev)/b.prev*100):null;
 const last=DB.weights.at(-1),prevW=DB.weights.at(-2);
 const tabs=[['week','Semaine'],['month','4 semaines'],['year','12 mois']];
 return `<div class="r-page"><h1 class="r-title rise" style="--i:0">Progression</h1>
 <div class="r-seg rise" style="--i:1" role="tablist">${tabs.map(t=>`<button role="tab" aria-selected="${progRange===t[0]}" class="${progRange===t[0]?'on':''}" onclick="setProgRange('${t[0]}')">${t[1]}</button>`).join('')}</div>
 <section class="eh-card rise" style="--i:2"><small class="r-lab">Volume d’entraînement</small><div class="r-big"><b>${Math.round(b.total).toLocaleString('fr-FR')}</b><span>kg × rép.</span>${delta!==null?`<em class="${delta>=0?'up':'down'}">${delta>=0?'+':''}${delta.toFixed(0)}%</em>`:''}</div><p class="sub">Somme des charges × répétitions des séries enregistrées.</p>${b.total?areaChart(b.labels,b.vals):'<div class="eh-empty" style="padding:24px 0">Valide une séance pour voir ta progression.</div>'}</section>
 <section class="eh-card rise" style="--i:3"><div class="eh-card-h"><b>Records personnels</b></div><div class="eh-list">${Object.entries(DB.prs).sort((a,c)=>c[1]-a[1]).map(([n,w])=>`<div class="r-row">${thumb(exMeta(n).ico||'🏆','sm')}<div><b>${esc(n)}</b></div><strong>${w} kg</strong></div>`).join('')||'<div class="eh-empty">Tes records apparaîtront après tes séances.</div>'}</div></section>
 <section class="eh-card rise" style="--i:4"><div class="eh-card-h"><b>Poids</b><button class="eh-link" onclick="openWeightModal()">+ Ajouter</button></div><div class="r-big"><b>${last?last.value:'—'}</b><span>kg</span>${prevW?`<em class="${last.value<=prevW.value?'up':'down'}">${(last.value-prevW.value>0?'+':'')+(last.value-prevW.value).toFixed(1)} kg</em>`:''}</div><canvas id="weightChart"></canvas></section>
 <section class="eh-card rise" style="--i:5"><div class="eh-card-h"><b>Niveau ${xpLevel().level}</b><small>${DB.xp} XP</small></div><canvas id="xpChart"></canvas></section>
 <button class="r-link-card rise" style="--i:6" onclick="nav('coach')"><span>${ico('bolt')} Mon IA Coach</span>${ico('chev')}</button></div>`}

/* 8. Programmes */
function programPage(){
 if(!DB.programs.length)return `<div class="r-page"><h1 class="r-title">Programmes</h1><section class="eh-card"><div class="eh-empty">Crée ton premier programme ou choisis une séance proposée.</div><button class="btn primary wide" style="margin-top:14px" onclick="openProgramModal()">+ Créer un programme</button></section><button class="btn wide" style="margin-top:10px" onclick="nav('workouts')">Voir les séances recommandées</button></div>`;
 return `<div class="r-page"><h1 class="r-title rise" style="--i:0">Programmes</h1>
 <div class="r-chips rise" style="--i:1"><button onclick="nav('workouts')">Recommandés</button><button class="on">Tout</button><button onclick="openProgramModal()">Créer</button></div>
 ${DB.programs.map((p,k)=>{const act=p.id===DB.activeProgram,ex=p.days.reduce((a,d)=>a+d.exercises.length,0);return `<section class="r-prog rise" style="--i:${k+2}">
  <div class="r-row">${thumb(exMeta(p.days[0]?.exercises[0]?.name).ico||'🏋️','lg')}<div><b>${esc(p.name)}</b><small>${p.days.length} séance${p.days.length===1?'':'s'} dans ce programme · ${ex} exercice${ex===1?'':'s'}</small></div>${act?'<span class="r-badge">ACTIF</span>':''}</div>
  <div class="r-days">${p.days.map((d,i)=>`<button class="r-day" onclick="previewWorkout('${p.id}',${i})"><span>${esc(d.name)}</span><small>${d.exercises.length} exo</small>${ico('chev')}</button>`).join('')}</div>
  <div class="r-acts"><button class="btn small" onclick="openProgramModal('${p.id}')">Modifier</button>${act?'':`<button class="btn small" onclick="activateProgram('${p.id}')">Activer</button>`}<button class="btn small" onclick="deleteProgram('${p.id}')">Supprimer</button></div></section>`}).join('')}</div>`}

/* 4. Nutrition */
const mealIco={'Petit-déjeuner':'🍳','Déjeuner':'🍽️','Collation':'🥜','Goûter':'🍎','Dîner':'🥗'};
function nutritionPage(){
 const m=todayMeals(),S=DB.settings,pct=Math.min(100,Math.round(m.kcal/Math.max(1,S.calories)*100));
 const mac=[['Protéines',m.p,S.protein],['Glucides',m.c,S.carbs],['Lipides',m.f,S.fat]];
 const list=DB.meals.filter(x=>x.date===today());
 return `<div class="r-page"><div class="r-top rise" style="--i:0"><h1 class="r-title">Journal alimentaire</h1><span class="r-top-r"><button class="es-round sm" onclick="nav('nutriai')" aria-label="Analyse IA">${ico('bolt')}</button><span class="eh-chip">Aujourd’hui ${ico('chev')}</span></span></div>
 <div class="r-nut rise" style="--i:1"><div class="r-ring" style="--v:${pct}"><div><b>${m.kcal}</b><small>/ ${S.calories} kcal</small></div></div>
  <div class="r-macros">${mac.map(x=>`<div class="r-macro"><div><small>${x[0]}</small><b>${Math.round(x[1])} / ${x[2]} g</b></div><div class="progress"><i style="width:${Math.min(100,x[1]/Math.max(1,x[2])*100)}%"></i></div></div>`).join('')}</div></div>
 <div class="eh-card-h rise" style="--i:2;margin-top:6px"><b>Repas du jour</b><button class="eh-link" onclick="openMealModal()">+ Ajouter</button></div>
 <div class="r-list rise" style="--i:3">${list.map(x=>`<div class="r-row">${thumb(mealIco[x.meal]||'🍴')}<div><b>${esc(x.meal)}</b><small>${esc(x.food)} · ${x.grams} g</small></div><span class="r-kcal"><b>${x.kcal} kcal</b><small>P${x.p} · G${x.c} · L${x.f}</small></span><button class="r-x" onclick="deleteMeal('${x.id}')" aria-label="Supprimer">×</button></div>`).join('')||'<div class="eh-empty">Ton journal est prêt. Ajoute ton premier repas de la journée.</div>'}</div>
 <button class="r-link-card rise" style="--i:4;margin-top:6px" onclick="nav('nutriai')"><span>${ico('bolt')} Analyse nutritionnelle IA</span>${ico('chev')}</button>
 <div class="eh-card-h rise" style="--i:4;margin-top:14px"><b>Ajout rapide</b></div>
 <div class="r-chips rise" style="--i:5;flex-wrap:wrap">${DB.foods.map(f=>`<button onclick="quickFood('${f.id}')">${esc(f.name)}</button>`).join('')}</div>
 ${hydrationCard()}
 ${wheyCard()}
 <button class="r-link-card" onclick="nav('meals')"><span>${ico('food')} Idées de repas</span>${ico('chev')}</button></div>`}

/* 5-7. Souvenirs, avant/après, photo hebdo */
function setMemFilter(f){memFilter=f;keepScroll(render)}
function editPhoto(id){const p=DB.photos.find(x=>x.id===id);if(!p)return;const c=prompt('Légende de la photo',p.caption||'');if(c===null)return;p.caption=c.trim().slice(0,40);save();render()}
function cyclePhotoTag(id){const p=DB.photos.find(x=>x.id===id);if(!p)return;p.tag=p.tag==='train'?'event':p.tag==='event'?'':'train';save();keepScroll(render)}
function memoriesPage(){
 const all=(DB.photos||[]).slice().sort((a,b)=>b.date.localeCompare(a.date)),ph=memFilter==='all'?all:all.filter(p=>p.tag===memFilter);
 const chips=[['all','Tout'],['train','Entraînements'],['event','Événements']];
 return `<div class="r-page"><div class="r-top rise" style="--i:0"><h1 class="r-title">Souvenirs</h1><span class="r-top-r"><button class="r-ia" onclick="nav('coach')" aria-label="IA">IA</button><button class="es-round sm" onclick="document.getElementById('forgePhotoInput').click()" aria-label="Ajouter une photo">${ico('plus')}</button></span></div>
 <input id="forgePhotoInput" type="file" accept="image/*" multiple style="display:none" onchange="saveProgressPhotos(this.files)">
 <div class="r-chips rise" style="--i:1">${chips.map(c=>`<button class="${memFilter===c[0]?'on':''}" onclick="setMemFilter('${c[0]}')">${c[1]}</button>`).join('')}</div>
 <div class="r-grid rise" style="--i:2">${ph.map(p=>`<figure class="r-photo"><img src="${p.data}" alt="Photo ajoutée le ${esc(p.date)}" loading="lazy" onclick="editPhoto('${p.id}')"><figcaption><small>${fmtDate(p.date)}</small>${esc(p.caption||p.pose||'')}</figcaption><button class="r-tag" onclick="cyclePhotoTag('${p.id}')" aria-label="Changer la catégorie">${p.tag==='train'?'Entraînement':p.tag==='event'?'Événement':'+ Catégorie'}</button><button class="r-x" onclick="deleteProgressPhoto('${p.id}')" aria-label="Supprimer la photo">×</button></figure>`).join('')||`<div class="eh-empty" style="grid-column:1/-1">${all.length?'Aucune photo dans cette catégorie.':'Garde une trace de ton parcours. Ajoute ton premier souvenir.'}</div>`}</div>
 <button class="r-link-card" onclick="requestPhotoNotifications()"><span>${ico('bell')} Rappel photo hebdomadaire</span>${ico('chev')}</button><div class="r-two rise" style="--i:3"><button class="r-link-card" onclick="nav('weekly')"><span>${ico('camera')} Photo hebdo</span>${ico('chev')}</button><button class="r-link-card" onclick="nav('beforeafter')"><span>${ico('trend')} Avant / Après</span>${ico('chev')}</button></div></div>`}

/* Accueil : photo de la semaine + état du jour (données réelles) */
function photoWeekCard(){
 const ph=(DB.photos||[]).slice().sort((a,b)=>b.date.localeCompare(a.date))[0];
 return `<section class="eh-card r-pw rise" style="--i:2" onclick="nav('memories')" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();nav('memories')}">${ph?`<img src="${ph.data}" alt="">`:`<div class="r-pw-ph">${ico('plus')}</div>`}<div><b>Photo de la semaine</b><small>${ph?esc(ph.caption||'Progression, pas perfection.'):'Ajoute ta première photo'}</small></div>${ph?`<span class="r-pw-d">${fmtDate(ph.date)}</span>`:''}${ico('chev')}</section>`}
function stateCard(){
 const ms=todayMeals(),S=DB.settings,hab=Math.round(DB.habits.filter(h=>DB.habitLog[`${today()}_${h.id}`]).length/Math.max(1,DB.habits.length)*100);
 const r=(l,v)=>`<div class="r-sr"><div class="eh-ring" style="--value:${Math.min(100,v)}"><b>${Math.round(Math.min(100,v))}%</b></div><small>${l}</small></div>`;
 return `<section class="eh-card rise" style="--i:3"><div class="eh-card-h"><b>Tes repères du jour</b></div><p class="sub">D’après tes habitudes cochées et tes repas enregistrés.</p><div class="r-states">${r('Habitudes',hab)}${r('Calories',ms.kcal/Math.max(1,S.calories)*100)}${r('Protéines',ms.p/Math.max(1,S.protein)*100)}</div></section>`}

Object.assign(pages,{preview:previewPage,progress:progressPage,program:programPage,nutrition:nutritionPage,memories:memoriesPage});
