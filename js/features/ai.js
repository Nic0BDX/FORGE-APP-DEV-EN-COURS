/* FORGE PROJECT — Coach IA, Analyse nutritionnelle IA, calendrier, photo hebdo, avant/après.
   ⚠️ L'IA n'est PAS branchée : les textes ci-dessous sont des exemples.
   Pour la connecter : renseigne AI_HOOKS (fonctions qui renvoient du texte/données) et passe AI_CONNECTED à true. */
const AI_CONNECTED=false;
const AI_HOOKS={
 coachMessage:null,        // () => string | Promise<string>   — message du coach
 coachObjectives:null,     // () => [{label,pct,bar,icon}]      — objectifs et progression
 nutritionTips:null        // () => string[]                    — recommandations nutrition
};
const AI_PLACEHOLDER={
 coach:"Cet espace accueillera les conseils de ton coach. Pour le moment, consulte ton programme et note ton ressenti après chaque séance.",
 objectives:[],
 tips:['Compose tes repas selon tes besoins, tes goûts et ta faim.','Utilise ton journal pour observer tes habitudes, sans viser la perfection.','Pour un accompagnement adapté à ta santé, demande conseil à un professionnel.']
};
function aiNote(){return AI_CONNECTED?'':'<p class="ai-note">Aperçu du coach · IA non connectée</p>'}
function backBtn(to){return `<button class="es-round" onclick="nav('${to}')" aria-label="Retour">${ico('back')}</button>`}
function subHead(title,to,right){return `<div class="r-sub rise" style="--i:0">${backBtn(to)}<h1>${title}</h1>${right||''}</div>`}

/* 9. Mon IA Coach */
function coachPage(){
 const msg=(AI_CONNECTED&&AI_HOOKS.coachMessage&&AI_HOOKS.coachMessage())||AI_PLACEHOLDER.coach;
 const obj=(AI_CONNECTED&&AI_HOOKS.coachObjectives&&AI_HOOKS.coachObjectives())||AI_PLACEHOLDER.objectives;
 const av=`style="${avatarStyle(DB.profile.avatar||AVATARS[0])}"`;
 return `<div class="r-page">${subHead('Mon IA Coach','progress')}
 <section class="eh-card ai-msg rise" style="--i:1"><div class="ai-av" ${av}>${av?'':ico('bolt')}</div><p>${esc(msg).replace(/\n/g,'<br>')}</p></section>${aiNote()}
 <h2 class="r-h2 rise" style="--i:2">Tes repères</h2>
 <section class="eh-card ai-obj rise" style="--i:3">${obj.length?obj.map(o=>`<div class="ai-o"><div class="ai-oh"><span class="ai-ic">${ico(o.icon||'bolt')}</span><b>${esc(o.label)}</b><em>+${o.pct}%</em></div><div class="progress"><i style="width:${o.bar}%"></i></div></div>`).join(''):`<div class="eh-empty">${esc(DB.profile.goal||'Ton objectif')} · ${DB.profile.perWeek||4} séances par semaine<br>Les recommandations personnalisées seront disponibles lorsque le coach sera connecté.</div>`}</section>
 <button class="eh-go rise" style="--i:4" onclick="nav('program')">Retrouver mon programme</button></div>`;
}

/* 11. Nutrition IA */
function nutriAIPage(){
 const ms=todayMeals(),S=DB.settings,pct=Math.min(100,Math.round(ms.kcal/Math.max(1,S.calories)*100)),sh=macroShares(ms);
 const tips=(AI_CONNECTED&&AI_HOOKS.nutritionTips&&AI_HOOKS.nutritionTips())||AI_PLACEHOLDER.tips;
 const icons=['bolt','flame','habit'];
 const card=()=>`<section class="eh-card ai-tips"><div class="ai-th">${ico('bolt')}<b>Repères généraux</b></div>${tips.map((t,i)=>`<div class="ai-tip"><span class="ai-dot">${ico(icons[i%3])}</span><p>${esc(t)}</p></div>`).join('')}</section>`;
 return `<div class="r-page">${subHead('Analyse nutritionnelle','nutrition')}
 <div class="r-nut rise" style="--i:1"><div class="r-ring" style="--v:${pct}"><div><b>${ms.kcal}</b><small>kcal</small></div></div>
  <div class="r-macros">${[['Protéines',sh.p],['Glucides',sh.c],['Lipides',sh.f]].map(x=>`<div class="r-macro"><div><small>${x[0]}</small><b>${x[1]}%</b></div><div class="progress"><i style="width:${x[1]}%"></i></div></div>`).join('')}</div></div>
 <p class="sub">Pourcentages : parts de l’énergie apportée par les macronutriments.</p><div class="rise" style="--i:2;display:grid;gap:12px">${card()}</div>${aiNote()}
 <button class="eh-go rise" style="--i:3" onclick="nav('nutrition')">Retrouver mon journal alimentaire</button></div>`;
}

/* 10. Calendrier : la sélection porte uniquement sur des séances enregistrées. */
let calOff=0,calSelectedDay='';
function validCalendarDay(value){
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||value.slice(0,4)==='0000')return false;
 const date=new Date(value+'T12:00:00Z');return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value;
}
function calendarRef(offset=calOff){const ref=new Date();ref.setHours(12,0,0,0);ref.setDate(1);ref.setMonth(ref.getMonth()+offset);return ref}
function calendarMonthKey(ref){return String(ref.getFullYear()).padStart(4,'0')+'-'+String(ref.getMonth()+1).padStart(2,'0')}
function fullDateLabel(day){return new Date(day+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}
function calMove(n){
 const next=calendarRef(calOff+n);if(!Number.isInteger(n)||next.getFullYear()<1||next.getFullYear()>9999)return;
 calOff+=n;calSelectedDay='';render();
}
function selectCalendarMonth(value){
 if(typeof value!=='string'||!/^\d{4}-\d{2}$/.test(value)||!validCalendarDay(value+'-01')){toast('Choisis un mois valide.');render();return}
 const now=new Date();calOff=(Number(value.slice(0,4))-now.getFullYear())*12+Number(value.slice(5,7))-1-now.getMonth();calSelectedDay='';render();
}
function selectCalendarDay(value){
 if(!value){calSelectedDay='';render();return}
 if(!validCalendarDay(value)){toast('Choisis une date valide.');render();return}
 const now=new Date();calOff=(Number(value.slice(0,4))-now.getFullYear())*12+Number(value.slice(5,7))-1-now.getMonth();calSelectedDay=value;render();
}
function showCalendarMonth(){calSelectedDay='';render()}
function showCurrentCalendarMonth(){calOff=0;calSelectedDay='';render()}
function isoWeek(d){const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));t.setUTCFullYear(d.getFullYear());const n=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-n);const y0=new Date(t);y0.setUTCMonth(0,1);return Math.ceil(((t-y0)/864e5+1)/7)}
function calendarPage(){
 const now=new Date(),ref=calendarRef(),y=ref.getFullYear(),m=ref.getMonth(),month=calendarMonthKey(ref),last=new Date(ref);last.setMonth(m+1,0);
 const days=last.getDate(),lead=(ref.getDay()+6)%7,tk=calendarMonthKey(now)+'-'+String(now.getDate()).padStart(2,'0');
 if(calSelectedDay&&!calSelectedDay.startsWith(month+'-'))calSelectedDay='';
 const key=d=>month+'-'+String(d).padStart(2,'0'),monthSessions=DB.sessions.filter(s=>s.date.startsWith(month+'-')),done=new Set(monthSessions.map(s=>s.date));
 const cells=[];for(let i=0;i<lead;i++)cells.push(null);for(let d=1;d<=days;d++)cells.push(d);while(cells.length%7)cells.push(null);
 let rows='';for(let r=0;r<cells.length/7;r++){
  const week=cells.slice(r*7,r*7+7),first=week.find(Boolean),weekDate=new Date(ref);weekDate.setDate(first||1);
  rows+=`<span class="cl-w" title="Semaine ${isoWeek(weekDate)}">${isoWeek(weekDate)}</span>`+week.map(d=>d?`<span class="cl-d ${key(d)===tk?'today':''} ${done.has(key(d))?'done':''} ${key(d)===calSelectedDay?'selected':''}"${key(d)===tk?' aria-current="date"':''}${key(d)===calSelectedDay?' style="outline:2px solid var(--text);outline-offset:2px"':''} title="${esc(fullDateLabel(key(d)))}${done.has(key(d))?' · séance enregistrée':''}">${d}</span>`:'<span></span>').join('');
 }
 const list=(calSelectedDay?monthSessions.filter(s=>s.date===calSelectedDay):monthSessions).sort((a,b)=>b.date.localeCompare(a.date)||(Date.parse(b.iso)||0)-(Date.parse(a.iso)||0));
 const label=ref.toLocaleDateString('fr-FR',{month:'long',year:'numeric'}),period=calSelectedDay?fullDateLabel(calSelectedDay):label;
 return `<div class="r-page">${subHead('Calendrier','home',`<button class="es-round" onclick="nav('program')" aria-label="Voir mes programmes" style="margin-left:auto">${ico('plus')}</button>`)}
 <section class="eh-card cl-period rise" style="--i:1"><div class="grid g2"><div><label for="calendarMonth">Mois affiché</label><input id="calendarMonth" type="month" min="0001-01" max="9999-12" value="${month}" onchange="selectCalendarMonth(this.value)"></div><div><label for="calendarDay">Jour à consulter</label><input id="calendarDay" type="date" min="0001-01-01" max="9999-12-31" value="${calSelectedDay}" onchange="selectCalendarDay(this.value)"></div></div><div class="row gap wrap"><button class="btn" onclick="showCalendarMonth()">Tout le mois</button><button class="btn" onclick="showCurrentCalendarMonth()">Mois actuel</button></div></section>
 <section class="eh-card rise" style="--i:2"><div class="cl-nav"><button onclick="calMove(-1)" aria-label="Mois précédent">${ico('back')}</button><b style="text-transform:capitalize">${label}</b><button onclick="calMove(1)" aria-label="Mois suivant" style="transform:scaleX(-1)">${ico('back')}</button></div>
  <div class="cl-grid"><span aria-label="Numéro de semaine"></span>${['L','M','M','J','V','S','D'].map(x=>`<span class="cl-h">${x}</span>`).join('')}${rows}</div><p class="sub" style="margin:14px 0 0">Les jours entourés contiennent une séance. Le jour actuel est rempli.${calSelectedDay?' Le jour choisi est encadré.':''}</p></section>
 <div class="eh-card-h rise" style="--i:3;margin-top:6px"><div><b>Séances enregistrées</b><p class="sub" style="margin:4px 0 0">${esc(period)}</p></div><small aria-live="polite">${list.length} séance${list.length===1?'':'s'}</small></div>
 <div class="r-list calendar-sessions rise" style="--i:4">${list.map(s=>`<div class="r-row" data-session-id="${esc(s.id)}"><span class="cl-ic">${ico('bolt')}</span><div><b>${esc(s.day)}</b><small><time datetime="${s.date}">${fullDateLabel(s.date)}</time></small></div><span class="cl-t">${fmtSec(s.duration)}</span></div>`).join('')||`<div class="eh-card eh-empty">${calSelectedDay?'Aucune séance enregistrée le '+fullDateLabel(calSelectedDay)+'.':'Aucune séance enregistrée en '+label+'.'}</div>`}</div></div>`;
}

/* 7. Photo hebdo */
let weeklyPose='Face';
function setPose(p){weeklyPose=p;window.__pose=p;keepScroll(render)}
function weeklyPage(){
 window.__pose=weeklyPose;const last=(DB.photos||[]).slice().sort((a,b)=>b.date.localeCompare(a.date))[0];
 return `<div class="r-page">${subHead('Photo hebdo','memories')}
 <div class="wk-sub rise" style="--i:0">${nextPhotoReminderLabel()}</div>
 <section class="wk-view rise" style="--i:1">${last?`<img src="${last.data}" alt="Dernière photo">`:''}<div class="wk-frame" aria-hidden="true"></div><p class="wk-q">“La discipline, c’est la liberté.”</p></section>
 <div class="r-seg rise" style="--i:2">${['Face','Profil','Dos'].map(p=>`<button class="${weeklyPose===p?'on':''}" onclick="setPose('${p}')">${p}</button>`).join('')}</div>
 <input id="wkCam" type="file" accept="image/*" capture="environment" style="display:none" onchange="saveProgressPhotos(this.files)"><input id="wkGal" type="file" accept="image/*" style="display:none" onchange="saveProgressPhotos(this.files)">
 <div class="wk-ctl rise" style="--i:3"><button class="es-round" onclick="document.getElementById('wkGal').click()" aria-label="Galerie">${ico('book')}</button><button class="wk-shutter" onclick="document.getElementById('wkCam').click()" aria-label="Prendre la photo"></button><button class="es-round" onclick="document.getElementById('wkCam').toggleAttribute('data-front');document.getElementById('wkCam').setAttribute('capture',document.getElementById('wkCam').hasAttribute('data-front')?'user':'environment');toast('Caméra '+(document.getElementById('wkCam').hasAttribute('data-front')?'avant':'arrière'))" aria-label="Changer de caméra">${ico('trend')}</button></div></div>`;
}

/* 6. Avant / Après : sélection isolée par compte, jamais enregistrée dans un autre carnet. */
const beforeAfterChoices=new Map();
function orderedComparisonPhotos(){return (DB.photos||[]).slice().sort((a,b)=>a.date.localeCompare(b.date)||(Date.parse(a.takenAt)||0)-(Date.parse(b.takenAt)||0)||a.id.localeCompare(b.id))}
function comparisonChoice(photos){
 const owner=currentEmail();let choice=beforeAfterChoices.get(owner);
 if(!choice){choice={start:photos[0]?.id,end:photos.at(-1)?.id,notice:''};beforeAfterChoices.set(owner,choice)}
 const originalStart=choice.start,originalEnd=choice.end;
 if(!photos.some(p=>p.id===choice.start))choice.start=photos[0]?.id;
 if(!photos.some(p=>p.id===choice.end))choice.end=photos.at(-1)?.id;
 if(choice.start===choice.end&&photos.length>1)choice.end=photos.find(p=>p.id!==choice.start).id;
 if(photos.findIndex(p=>p.id===choice.start)>photos.findIndex(p=>p.id===choice.end))[choice.start,choice.end]=[choice.end,choice.start];
 if(choice.start!==originalStart||choice.end!==originalEnd)choice.notice='La sélection a été adaptée aux photos disponibles.';
 return choice;
}
function selectComparisonPhoto(side,id){
 const photos=orderedComparisonPhotos();if(!['start','end'].includes(side)||photos.length<2||!photos.some(p=>p.id===id))return;
 const choice=comparisonChoice(photos),other=side==='start'?'end':'start';
 if(choice[other]===id){toast('Choisis deux photos différentes.');render();return}
 choice[side]=id;choice.notice='';
 if(photos.findIndex(p=>p.id===choice.start)>photos.findIndex(p=>p.id===choice.end)){[choice.start,choice.end]=[choice.end,choice.start];choice.notice='Les photos ont été remises dans l’ordre des dates.'}
 keepScroll(render);
}
function sortedDatedRecords(records){return records.filter(record=>record&&validCalendarDay(record.date)).slice().sort((a,b)=>a.date.localeCompare(b.date))}
function beforeAfterPage(){
 const photos=orderedComparisonPhotos();
 if(photos.length<2)return `<div class="r-page">${subHead('Avant / Après','memories')}<section class="eh-card eh-empty">Ajoute deux photos pour observer ton évolution dans le temps.</section><button class="eh-go" onclick="nav('weekly')">Prendre la photo de la semaine</button></div>`;
 const choice=comparisonChoice(photos),a=photos.find(p=>p.id===choice.start),b=photos.find(p=>p.id===choice.end);
 const weights=sortedDatedRecords(DB.weights),w0=weights.filter(w=>w.date<=a.date).at(-1),w1=weights.filter(w=>w.date<=b.date).at(-1);
 const dw=w0&&w1&&w0!==w1?Math.round((w1.value-w0.value)*10)/10:null;
 const bodyFat=sortedDatedRecords(DB.measurements).filter(m=>Number.isFinite(m.bodyFat)&&m.date>=a.date&&m.date<=b.date),f0=bodyFat[0],f1=bodyFat.at(-1);
 const df=f0&&f1&&f0.date!==f1.date?Math.round((f1.bodyFat-f0.bodyFat)*10)/10:null;
 const sessions=DB.sessions.filter(s=>s.date>=a.date&&s.date<=b.date),volume=sessions.length?sessions.reduce((sum,s)=>sum+s.volume,0):null;
 const number=value=>value.toLocaleString('fr-FR',{maximumFractionDigits:1});
 const metric=(id,value,unit,label,signed=false)=>`<div class="ba-t"><b id="${id}" data-value="${value===null?'':value}">${value===null?'—':(signed&&value>0?'+':'')+number(value)+(unit?' '+unit:'')}</b><small>${label}</small></div>`;
 const options=(selected,other)=>photos.map((p,index)=>`<option value="${p.id}"${p.id===selected?' selected':''}${p.id===other?' disabled':''}>Ajoutée le ${esc(fullDateLabel(p.date))} · Photo ${index+1}${p.caption||p.pose?' · '+esc(p.caption||p.pose):''}</option>`).join('');
 const photo=(p,weight,label)=>`<figure data-photo-id="${p.id}"><img src="${p.data}" alt="${label} : photo enregistrée le ${esc(fullDateLabel(p.date))}"><figcaption><div>Ajoutée le <time datetime="${p.date}">${fullDateLabel(p.date)}</time></div><div>${weight?`Dernier poids relevé : ${number(weight.value)} kg · <time datetime="${weight.date}">${fullDateLabel(weight.date)}</time>`:'Aucun poids enregistré à cette date ou avant.'}</div></figcaption></figure>`;
 return `<div class="r-page">${subHead('Avant / Après','memories')}
 <section class="eh-card rise" style="--i:1"><h2>Choisis deux souvenirs à comparer</h2><div class="ba-selectors grid g2"><div><label for="beforePhoto">Photo de début</label><select id="beforePhoto" onchange="selectComparisonPhoto('start',this.value)">${options(a.id,b.id)}</select></div><div><label for="afterPhoto">Photo de fin</label><select id="afterPhoto" onchange="selectComparisonPhoto('end',this.value)">${options(b.id,a.id)}</select></div></div><p class="sub ba-note" style="margin-bottom:0" aria-live="polite">${choice.notice||'Les photos sont présentées dans l’ordre des dates.'} Les dates affichées sont les dates d’ajout enregistrées dans Forge.</p></section>
 <div class="ba-pills rise" style="--i:2"><span>Début · <time datetime="${a.date}">${fullDateLabel(a.date)}</time></span><span>Fin · <time datetime="${b.date}">${fullDateLabel(b.date)}</time></span></div>
 <div class="r-ba rise" style="--i:3">${photo(a,w0,'Début')}${photo(b,w1,'Fin')}</div>
 <div class="ba-tiles rise" style="--i:4">${metric('baWeightDelta',dw,'kg','Poids',true)}${metric('baFatDelta',df,'points','Masse grasse',true)}${metric('baVolume',Number.isFinite(volume)?volume:null,'','Volume enregistré')}</div>
 <section class="eh-card ba-note rise" style="--i:5"><p class="sub">${dw===null?'Poids : deux relevés distincts sont nécessaires pour calculer l’écart.':`Écart de poids entre les relevés du <time datetime="${w0.date}">${fullDateLabel(w0.date)}</time> et du <time datetime="${w1.date}">${fullDateLabel(w1.date)}</time>.`}</p><p class="sub">${df===null?'Masse grasse : deux mesures datées distinctes dans cette période sont nécessaires.':`Écart de masse grasse en points de pourcentage, entre les mesures du <time datetime="${f0.date}">${fullDateLabel(f0.date)}</time> et du <time datetime="${f1.date}">${fullDateLabel(f1.date)}</time>.`}</p><p class="sub">Volume en kg × répétitions : somme des charges × répétitions des ${sessions.length} séance${sessions.length===1?'':'s'} enregistrée${sessions.length===1?'':'s'} du <time datetime="${a.date}">${fullDateLabel(a.date)}</time> au <time datetime="${b.date}">${fullDateLabel(b.date)}</time>, dates incluses. Cet indicateur ne mesure pas à lui seul la force.</p></section>
 <button class="eh-go rise" style="--i:6" onclick="nav('progress')">Voir la progression</button></div>`;
}
Object.assign(pages,{coach:coachPage,nutriai:nutriAIPage,calendar:calendarPage,weekly:weeklyPage,beforeafter:beforeAfterPage});
