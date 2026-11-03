/* FORGE — Calendrier */
function calendar(){
 const now=new Date(),month=now.getMonth(),year=now.getFullYear(),first=new Date(year,month,1),days=new Date(year,month+1,0).getDate(),offset=(first.getDay()+6)%7;
 const cells=Array.from({length:offset+days},(_,i)=>i<offset?null:i-offset+1);
 return `<div class="row wrap"><div><div class="eyebrow">PLANNIFICATION</div><h1>Calendrier</h1><div class="sub">${now.toLocaleDateString('fr-FR',{month:'long',year:'numeric'})}</div></div><button class="btn primary" onclick="nav('program')">+ Entraînement</button></div>
 <div class="card" style="margin-top:16px"><div class="row"><h2>${now.toLocaleDateString('fr-FR',{month:'long',year:'numeric'})}</h2><span class="pill">${DB.sessions.length} séances</span></div>
 <div class="calendar" style="margin-top:12px">${['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map(d=>`<div class="day" style="min-height:28px;padding:5px;font-weight:800;color:#777">${d}</div>`).join('')}${cells.map(d=>d?`<div class="day ${d===now.getDate()?'today':''}">${d}</div>`:'<div></div>').join('')}</div></div>
 <div class="card" style="margin-top:14px"><h2>Prochaines séances</h2><div class="list"><div class="item"><span>Aujourd’hui</span><b>Push · 18:00</b></div><div class="item"><span>17 mai</span><b>Legs · 18:00</b></div><div class="item"><span>19 mai</span><b>Pull · 18:00</b></div></div></div>`;
}
