/* FORGE — Accueil, stats et raccourcis */
function validatedSessions(){return DB.sessions.filter(s=>Number(s.volume||0)>0).sort((a,b)=>a.date.localeCompare(b.date));}
function periodVolume(days,offsetDays=0){const end=new Date();end.setHours(23,59,59,999);end.setDate(end.getDate()-offsetDays);const start=new Date(end);start.setDate(start.getDate()-days+1);return DB.sessions.filter(s=>{const d=new Date(s.date+'T12:00:00');return d>=start&&d<=end;}).reduce((a,s)=>a+Number(s.volume||0),0);}
function volumeDelta(days=180){const current=periodVolume(days,0),previous=periodVolume(days,days);if(previous===0)return null;return ((current-previous)/previous)*100;}
function macroShares(ms){const total=(ms.p*4)+(ms.c*4)+(ms.f*9);if(!total)return {p:0,c:0,f:0};return {p:Math.round(ms.p*4/total*100),c:Math.round(ms.c*4/total*100),f:Math.max(0,100-Math.round(ms.p*4/total*100)-Math.round(ms.c*4/total*100))};}
function home(){
 const p=DB.profile,st=loginStreak(),lvl=xpLevel();
 const prog=DB.programs.find(x=>x.id===DB.activeProgram),idx=prog?((prog.next||0)%prog.days.length):0,wd=prog?.days[idx];
 const ms=todayMeals();
 const doneHab=DB.habits.filter(h=>DB.habitLog[`${today()}_${h.id}`]).length;
 const habPct=Math.round(doneHab/Math.max(1,DB.habits.length)*100);
 const weekStart=new Date();weekStart.setHours(0,0,0,0);weekStart.setDate(weekStart.getDate()-((weekStart.getDay()+6)%7));
 const weekEnd=new Date(weekStart);weekEnd.setDate(weekEnd.getDate()+7);
 const weekSessions=DB.sessions.filter(s=>{const d=new Date(s.date+'T12:00:00');return d>=weekStart&&d<weekEnd});
 const volume=weekSessions.reduce((a,s)=>a+Number(s.volume||0),0);
 const dayVolumes=Array.from({length:7},(_,i)=>{const d=new Date(weekStart);d.setDate(d.getDate()+i);const k=d.toISOString().slice(0,10);return DB.sessions.filter(s=>s.date===k).reduce((a,s)=>a+Number(s.volume||0),0)});
 const maxDay=Math.max(1,...dayVolumes),dayLabels=['L','M','M','J','V','S','D'];
 const targetSessions=Math.max(1,Number(p.perWeek)||4);
 const shares=macroShares(ms);
 const delta=volumeDelta(180),totalVolume=validatedSessions().reduce((a,s)=>a+Number(s.volume||0),0);
 const h=new Date().getHours(),greet=h<5?'Bonne nuit':h<18?'Bonjour':'Bonsoir';
 const me=esc(p.name||AUTH[currentEmail()]?.name||'Champion');
 const nSets=wd?wd.exercises.reduce((a,e)=>a+(Number(e.sets)||0),0):0;
 const go=wd?`previewWorkout('${prog.id}',${idx})`:`nav('program')`;
 const recent=DB.sessions.slice(0,3);
 const prs=Object.entries(DB.prs||{}).sort((a,b)=>b[1]-a[1]).slice(0,3);
 const tiles=[['program','train','Programmes'],['exercises','book','Exercices'],['nutrition','food','Nutrition'],['habits','habit','Habitudes'],['goals','goals','Objectifs'],['calendar','calendar','Calendrier'],['progress','stats','Progression'],['coach','bolt','Coach IA']];
 return `<div class="eh">
  <header class="eh-head rise" style="--i:0">
   <button class="eh-avatar" style="${avatarStyle(p.avatar||AUTH[currentEmail()]?.avatar||AVATARS[0])}" onclick="nav('profile')" aria-label="Mon profil"></button>
   <div class="eh-hello"><small>${greet},</small><b>${me}<span class="eh-greeting-dot">.</span></b></div>
   <span class="eh-chip" title="Jours de présence consécutifs">${flame()}${st}</span><button class="es-round sm" onclick="showNotifs()" aria-label="Notifications">${ico('bell')}</button><span class="eh-chip eh-elite" title="Niveau">Niv. ${lvl.level}</span>
  </header>

  <section class="eh-hero rise" style="--i:1">${photo('hero-today')}
   <div class="eh-hero-body"><small>${wd?'Prochaine séance':'Ton prochain pas'}</small><h2>${esc(wd?.name||'Un rythme à toi.')}</h2>
    <div class="eh-tags">${wd?`<span>${ico('bolt')}${wd.exercises.length} exercice${wd.exercises.length>1?'s':''}</span><span>${ico('check')}${nSets} série${nSets>1?'s':''}</span>`:`<span>${ico('plus')}Ajoute tes jours et exercices</span>`}</div>
    <button class="eh-go" onclick="${go}">${wd?ico('play')+'Voir ma séance':ico('plus')+'Choisir mon programme'}</button></div>
  </section>

  <section class="eh-card eh-week rise" style="--i:2"><div class="eh-card-h"><b>Cette semaine</b><small>${weekSessions.length} / ${targetSessions} séances</small></div>
   <div class="eh-week-days">${dayVolumes.map((v,i)=>{const d=new Date(weekStart);d.setDate(d.getDate()+i);return `<div class="eh-wd ${v?'on':''} ${d.toISOString().slice(0,10)===today()?'today':''}"><span>${dayLabels[i]}</span><i>${v?ico('check'):''}</i></div>`}).join('')}</div></section>

  ${photoWeekCard()}
  ${stateCard()}
  ${streakCard()}

  <div class="eh-kpis rise" style="--i:2">
   <div class="eh-kpi"><small>Séances</small><b>${weekSessions.length} <em>/ ${targetSessions}</em></b><div class="eh-bars" aria-hidden="true">${dayVolumes.map((v,i)=>`<i style="--k:${i};height:${Math.max(12,Math.round(v/maxDay*100))}%;${v?'':'opacity:.25'}" title="${dayLabels[i]}"></i>`).join('')}</div></div>
   <div class="eh-kpi"><small>Volume semaine</small><b>${Math.round(volume).toLocaleString('fr-FR')} <em>kg</em></b><div class="progress"><i style="width:${Math.min(100,volume/Math.max(1,maxDay*targetSessions)*100)}%"></i></div></div>
   <div class="eh-kpi"><small>Calories</small><b>${ms.kcal.toLocaleString('fr-FR')} <em>/ ${DB.settings.calories}</em></b><div class="progress"><i style="width:${Math.min(100,ms.kcal/Math.max(1,DB.settings.calories)*100)}%"></i></div></div>
   <div class="eh-kpi"><small>Protéines</small><b>${Math.round(ms.p)} <em>/ ${DB.settings.protein} g</em></b><div class="progress"><i style="width:${Math.min(100,ms.p/Math.max(1,DB.settings.protein)*100)}%"></i></div></div>
  </div>

  <section class="eh-card eh-chart rise" style="--i:3">
   <div class="eh-card-h"><div><b>Volume cumulé</b><br><small>6 derniers mois · ${delta===null?'pas encore de comparaison':`${delta>=0?'+':''}${delta.toFixed(0)} % vs période précédente`}</small></div><button class="eh-link" onclick="nav('progress')">Détails ${ico('chev')}</button></div>
   <canvas id="homeProgressChart"></canvas>
  </section>

  <section class="eh-card eh-macrocard rise" style="--i:4">
   <div class="eh-card-h"><b>Macros du jour</b><button class="eh-link" onclick="nav('nutrition')">Nutrition ${ico('chev')}</button></div>
   <p class="sub">Pourcentages : parts de l’énergie apportée par les macronutriments.</p><div class="eh-macros"><div class="eh-donut" style="background:conic-gradient(var(--macro-protein) 0 ${shares.p}%,var(--macro-carbs) ${shares.p}% ${shares.p+shares.c}%,var(--macro-fat) ${shares.p+shares.c}% 100%${ms.p+ms.c+ms.f?'':',var(--line) 0'})"><div>${Math.round(ms.p+ms.c+ms.f)}g<small>total</small></div></div>
   <div class="eh-legend"><div><i style="background:var(--macro-protein)"></i><span>Protéines</span><b>${Math.round(ms.p)}g</b><em>${shares.p}%</em></div><div><i style="background:var(--macro-carbs)"></i><span>Glucides</span><b>${Math.round(ms.c)}g</b><em>${shares.c}%</em></div><div><i style="background:var(--macro-fat)"></i><span>Lipides</span><b>${Math.round(ms.f)}g</b><em>${shares.f}%</em></div></div></div>
  </section>

  <section class="eh-card eh-habitcard rise" style="--i:5">
   <div class="eh-card-h"><div><b>Habitudes</b><br><small>${doneHab} sur ${DB.habits.length} aujourd’hui</small></div><div class="eh-ring" style="--value:${habPct}"><b>${habPct}%</b></div></div>
   <div class="eh-habits">${DB.habits.slice(0,4).map(x=>`<label class="eh-habit"><input class="check" type="checkbox" ${DB.habitLog[`${today()}_${x.id}`]?'checked':''} onchange="toggleHabit('${x.id}',this.checked)"><span>${esc(x.name)}</span></label>`).join('')||'<div class="eh-empty">Aucune habitude pour l’instant.</div>'}</div>
  </section>

  <section class="eh-card eh-recent rise" style="--i:6">
   <div class="eh-card-h"><b>Dernières séances</b><button class="eh-link" onclick="nav('history')">Historique ${ico('chev')}</button></div>
   <div class="eh-list">${recent.map(x=>`<button class="eh-row" onclick="nav('history')"><div><b>${esc(x.day)}</b><small>${fmtDate(x.date)} · ${fmtSec(x.duration)}</small></div><span>${Math.round(x.volume).toLocaleString('fr-FR')} kg</span></button>`).join('')||'<div class="eh-empty">Ta première séance validée apparaîtra ici.</div>'}</div>
  </section>

  <section class="eh-card eh-prs rise" style="--i:7">
   <div class="eh-card-h"><div><b>Records</b><br><small>${Math.round(totalVolume).toLocaleString('fr-FR')} kg soulevés au total</small></div>${ico('trophy')}</div>
   <div class="eh-list">${prs.map(([n,v])=>`<div class="eh-row"><div><b>${esc(n)}</b></div><span>${v} kg</span></div>`).join('')||'<div class="eh-empty">Tes records personnels s’afficheront après ta première séance.</div>'}</div>
  </section>

  <nav class="eh-tiles rise" style="--i:8" aria-label="Raccourcis">${tiles.map(t=>`<button class="eh-tile" onclick="nav('${t[0]}')">${ico(t[1])}<b>${t[2]}</b></button>`).join('')}</nav>
  <div class="eh-actions rise" style="--i:9"><button class="btn" onclick="openShortcut('meal')">${ico('plus')} Repas</button><button class="btn" onclick="openShortcut('habit')">${ico('plus')} Habitude</button></div>
 </div>`;
}

function openShortcut(type){
 if(type==='workout') return nav('program');
 if(type==='meal') return openMealModal();
 if(type==='habit') return openHabitModal();
}
