/* FORGE — Progression, poids et graphiques */
function progress(){
 const last=DB.weights.at(-1),prev=DB.weights.at(-2),lvl=xpLevel();
 const totalVol=DB.sessions.reduce((a,s)=>a+s.volume,0);
 return `<div class="row wrap"><div><div class="eyebrow">DATA</div><h1>Progression</h1><div class="sub">Transforme tes données en historique lisible.</div></div><button class="btn primary" onclick="openWeightModal()">+ Poids</button></div>
 <div class="grid g4" style="margin-top:16px"><div class="stat"><small>Poids actuel</small><b>${last?.value||'—'} kg</b><small>${prev?((last.value-prev.value>0?'+':'')+(last.value-prev.value).toFixed(1))+' kg vs précédent':''}</small></div><div class="stat"><small>Volume total</small><b>${Math.round(totalVol).toLocaleString('fr-FR')}</b><small>kg</small></div><div class="stat"><small>Records</small><b>${Object.keys(DB.prs).length}</b><small>records</small></div><div class="stat"><small>XP</small><b>${DB.xp}</b><small>niveau ${lvl.level}</small></div></div>
 <div class="grid g2" style="margin-top:14px"><div class="card"><div class="row"><h2>⚖️ Poids</h2><button class="btn small" onclick="openWeightModal()">Ajouter</button></div><canvas id="weightChart"></canvas><div class="list">${DB.weights.slice(-8).reverse().map(w=>`<div class="item"><span>${fmtDate(w.date)}</span><b>${w.value} kg</b></div>`).join('')||'<div class="empty">Enregistre ton premier poids.</div>'}</div></div>
 <div class="card"><h2>🏆 Records personnels</h2><div class="list">${Object.entries(DB.prs).map(([n,w])=>`<div class="item"><span>${esc(n)}</span><b>${w} kg</b></div>`).join('')||'<div class="empty">Tes records apparaîtront après tes séances.</div>'}</div></div></div>
 <div class="card" style="margin-top:14px"><h2>⚡ XP</h2><canvas id="xpChart"></canvas><div class="list">${DB.xpLog.slice(0,8).map(x=>`<div class="item"><span>${esc(x.reason)}</span><b class="xp">+${x.n}</b></div>`).join('')}</div></div>`;
}
function openWeightModal(){document.getElementById('modalbox').innerHTML=`<h2>Nouveau poids</h2><input id="wv" type="number" step=".1" placeholder="80.5"><div class="row gap"><button class="btn" onclick="closeModal()">Annuler</button><button class="btn primary" onclick="saveWeight()">Enregistrer</button></div>`;document.getElementById('modal').classList.add('show')}
function saveWeight(){const v=Number(document.getElementById('wv').value);if(!Number.isFinite(v)||v<=0)return toast('Indique un poids supérieur à 0 kg.');DB.weights.push({date:today(),value:v});DB.weights.sort((a,b)=>a.date.localeCompare(b.date));save();closeModal();award(10,'Poids enregistré');render()}
function drawCharts(){setTimeout(()=>{drawLine('weightChart',DB.weights.map(x=>x.value),getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#315648');drawLine('xpChart',DB.xpLog.slice(0,30).reverse().reduce((a,x)=>{a.push((a.at(-1)||0)+x.n);return a},[]),getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#315648');drawHomeChart()},50)}
function drawHomeChart(){
 const c=document.getElementById('homeProgressChart'); if(!c)return;
 const dpr=window.devicePixelRatio||1,w=c.clientWidth||600,h=220;c.width=w*dpr;c.height=h*dpr;
 const x=c.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,w,h);
 const line=getComputedStyle(document.documentElement).getPropertyValue('--line'),muted=getComputedStyle(document.documentElement).getPropertyValue('--muted');
 const cutoff=new Date();cutoff.setDate(cutoff.getDate()-180);
 const valid=validatedSessions().filter(s=>new Date(s.date+'T12:00:00')>=cutoff);
 const daily=new Map();valid.forEach(s=>daily.set(s.date,(daily.get(s.date)||0)+Number(s.volume||0)));
 const rows=[...daily.entries()].sort((a,b)=>a[0].localeCompare(b[0]));
 const pad=30;x.strokeStyle=line;x.lineWidth=1;
 for(let i=0;i<4;i++){const y=pad+i*(h-pad*2)/3;x.beginPath();x.moveTo(pad,y);x.lineTo(w-pad,y);x.stroke()}
 x.fillStyle=muted;x.font='10px system-ui';
 if(!rows.length){x.textAlign='center';x.fillText('Aucune séance validée pour le moment',w/2,h/2);x.textAlign='left';return}
 let cumulative=0;const vals=rows.map(([date,v])=>(cumulative+=v,cumulative));
 const min=0,max=Math.max(...vals)||1;
 x.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#315648';x.lineWidth=2.5;x.beginPath();
 vals.forEach((v,i)=>{const xx=pad+i*(w-pad*2)/Math.max(1,vals.length-1),yy=h-pad-(v-min)/Math.max(1,max-min)*(h-pad*2);i?x.lineTo(xx,yy):x.moveTo(xx,yy)});x.stroke();
 x.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#315648';vals.forEach((v,i)=>{const xx=pad+i*(w-pad*2)/Math.max(1,vals.length-1),yy=h-pad-(v-min)/Math.max(1,max-min)*(h-pad*2);x.beginPath();x.arc(xx,yy,3,0,Math.PI*2);x.fill()});
 x.fillStyle=muted;x.textAlign='center';
 rows.forEach(([date],i)=>{if(i===0||i===rows.length-1||rows.length<=6){const xx=pad+i*(w-pad*2)/Math.max(1,rows.length-1);const d=new Date(date+'T12:00:00');x.fillText(d.toLocaleDateString('fr-FR',{day:'2-digit',month:'short'}),xx,h-4)}});x.textAlign='left';
}

function drawLine(id,data,color){const c=document.getElementById(id);if(!c)return;const dpr=devicePixelRatio||1,w=c.clientWidth,h=220;c.width=w*dpr;c.height=h*dpr;const x=c.getContext('2d');x.scale(dpr,dpr);x.clearRect(0,0,w,h);if(data.length<2){x.fillStyle=getComputedStyle(document.body).getPropertyValue('--muted');x.fillText('Pas assez de données pour un graphique.',20,110);return}const min=Math.min(...data),max=Math.max(...data),pad=25;x.strokeStyle=getComputedStyle(document.body).getPropertyValue('--line');x.lineWidth=1;for(let i=0;i<4;i++){let y=pad+i*(h-pad*2)/3;x.beginPath();x.moveTo(pad,y);x.lineTo(w-pad,y);x.stroke()}x.strokeStyle=color;x.lineWidth=3;x.beginPath();data.forEach((v,i)=>{const xx=pad+i*(w-pad*2)/(data.length-1),yy=h-pad-(v-min)/(max-min||1)*(h-pad*2);i?x.lineTo(xx,yy):x.moveTo(xx,yy)});x.stroke()}
window.addEventListener('resize',()=>{if(view==='progress')drawCharts(); if(view==='home')setTimeout(drawHomeChart,50)});
