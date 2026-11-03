/* Forge — activité déclarée. Aucun capteur, dépense déduite des repas ou score de santé. */
const FORGE_ACTIVITY_FIELDS=[
 {key:'activeCalories',label:'Calories actives (kcal)',max:30000,step:'0.1',example:'812'},
 {key:'standHours',label:'Heures debout (h)',max:24,step:'0.25',example:'10'},
 {key:'distanceKm',label:'Distance parcourue (km)',max:1000,step:'0.1',example:'8.6'},
 {key:'floors',label:'Étages montés',max:10000,step:'1',integer:true,example:'14'},
 {key:'energy',label:'Énergie ressentie (0 à 100)',max:100,step:'1',integer:true,example:'86'},
 {key:'recovery',label:'Récupération ressentie (0 à 100)',max:100,step:'1',integer:true,example:'91'}
];

function forgeActivityDateAgo(days=0){
 const date=new Date();date.setDate(date.getDate()-days);
 return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
}

function forgeActivityDay(date=forgeActivityDateAgo()){
 const record=plainRecord(DB.activity?.[date])?DB.activity[date]:{};
 const day={date};
 for(const field of FORGE_ACTIVITY_FIELDS){
  const value=record[field.key];
  day[field.key]=typeof value==='number'&&Number.isFinite(value)?value:null;
 }
 return day;
}

function forgeActivitySummary(period='today'){
 const days=period==='month'?30:period==='week'?7:1,start=forgeActivityDateAgo(days-1),end=forgeActivityDateAgo();
 const dates=Object.keys(DB.activity||{}).filter(date=>date>=start&&date<=end);
 const result={activeCalories:null,exerciseMinutes:0,standHours:null,distanceKm:null,floors:null,days,reportedDays:{}};
 for(const key of ['activeCalories','standHours','distanceKm','floors']){
  const values=dates.map(date=>forgeActivityDay(date)[key]).filter(value=>value!==null);
  result[key]=values.length?Math.round(values.reduce((sum,value)=>sum+value,0)*100)/100:null;
  result.reportedDays[key]=values.length;
 }
 result.exerciseMinutes=Math.round(DB.sessions.filter(session=>session.date>=start&&session.date<=end).reduce((sum,session)=>sum+session.duration,0)/60);
 return result;
}

function openActivityModal(){
 const date=forgeActivityDateAgo();
 document.getElementById('modalbox').innerHTML=`<h2>Mon activité du jour</h2><p class="sub">Recopie les relevés de ton compteur ou de ta montre. Forge n’est connecté à aucun capteur. Laisse vide ce que tu ne connais pas.</p><label for="forge-activity-date">Date du relevé</label><input id="forge-activity-date" type="date" value="${date}" max="${date}" onchange="forgeLoadActivityFields(this.value)"><div class="grid g2">${FORGE_ACTIVITY_FIELDS.map(field=>`<div><label for="forge-activity-${field.key}">${field.label}</label><input id="forge-activity-${field.key}" type="number" min="0" max="${field.max}" step="${field.step}" inputmode="${field.integer?'numeric':'decimal'}" placeholder="Ex. ${field.example}" aria-describedby="${field.key==='energy'||field.key==='recovery'?'forge-activity-feeling':'forge-activity-optional'}"></div>`).join('')}</div><p id="forge-activity-optional" class="sub">Toutes les mesures sont facultatives. Les calories actives sont distinctes des calories de tes repas ; le temps d’exercice provient de tes séances enregistrées.</p><p id="forge-activity-feeling" class="sub">Énergie et récupération : ton ressenti déclaré de 0 à 100. Ces valeurs ne sont pas un score de santé calculé.</p><div class="row gap wrap"><button class="btn" onclick="closeModal()">Annuler</button><button class="btn primary" onclick="saveActivityRecord()">Enregistrer mon activité</button></div>`;
 forgeLoadActivityFields(date);openModal();document.getElementById('forge-activity-date').focus();
}

function forgeLoadActivityFields(date){
 const record=forgeActivityDay(date);
 for(const field of FORGE_ACTIVITY_FIELDS){
  const input=document.getElementById('forge-activity-'+field.key);
  if(input)input.value=record[field.key]===null?'':String(record[field.key]);
 }
}

function saveActivityRecord(){
 const date=document.getElementById('forge-activity-date').value;
 if(!validCalendarDay(date)||date>forgeActivityDateAgo())return toast('Choisis une date valide, aujourd’hui ou dans le passé.');
 const record={};
 for(const field of FORGE_ACTIVITY_FIELDS){
  const input=document.getElementById('forge-activity-'+field.key),raw=input.value.trim();
  if(input.validity?.badInput)return toast(field.label+' : indique un nombre valide.');
  if(raw==='')continue;
  const value=Number(raw);
  if(!Number.isFinite(value)||value<0||value>field.max||(field.integer&&!Number.isInteger(value)))return toast(field.label+' : indique '+(field.integer?'un nombre entier':'un nombre')+' entre 0 et '+field.max.toLocaleString('fr-FR')+'.');
  record[field.key]=value;
 }
 if(!Object.keys(record).length)return toast('Renseigne au moins une mesure avant d’enregistrer.');
 const next=JSON.parse(JSON.stringify(DB));next.activity={...(next.activity||{}),[date]:record};
 try{commitUserDB(validateBackup(next))}catch(error){return toast('Activité non enregistrée. '+(error.message||'Vérifie les mesures et le stockage disponible.'))}
 closeModal();render();toast('Activité enregistrée pour le '+new Date(date+'T12:00:00').toLocaleDateString('fr-FR')+'.');
}
