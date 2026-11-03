/* FORGE — Paramètres, export / import */
function settings(){
 return `<div class="row"><div><div class="eyebrow">PARAMÈTRES</div><h1>Paramètres</h1></div></div>
 <section class="card theme-switch-card" style="margin-top:16px"><div><h2>Apparence</h2><p class="sub">Thème ${DB.settings.theme==='dark'?'sombre':'clair'}</p></div><button class="btn" onclick="toggleTheme()">${ico(DB.settings.theme==='dark'?'sun':'moon')} Changer de thème</button></section><div class="grid g2" style="margin-top:16px"><div class="card"><h2>Profil</h2><label>Nom</label><input id="sn" value="${esc(DB.profile.name)}"><label>Avatar</label><input id="sa" value="${esc(DB.profile.avatar)}"><label>Bio</label><textarea id="sb">${esc(DB.profile.bio)}</textarea><label>Objectif</label><input id="sg" value="${esc(DB.profile.goal)}"><button class="btn primary wide" onclick="saveSettings()">Enregistrer</button></div>
 <div class="card"><h2>Objectifs quotidiens</h2><p class="sub">Ces valeurs de départ sont à adapter à tes besoins. Forge ne les calcule pas à partir de ton profil.</p><label>Calories</label><input id="scal" type="number" value="${DB.settings.calories}"><label>Protéines (g)</label><input id="spr" type="number" value="${DB.settings.protein}"><label>Glucides (g)</label><input id="scb" type="number" value="${DB.settings.carbs}"><label>Lipides (g)</label><input id="sfa" type="number" value="${DB.settings.fat}"><label>Eau (ml)</label><input id="swa" type="number" value="${DB.settings.water}"><button class="btn primary wide" onclick="saveTargets()">Enregistrer</button></div></div>
 <div class="card" style="margin-top:14px"><h2>Compte</h2><div class="row wrap"><div><b>${esc(currentEmail())}</b><div class="sub">Compte local FORGE</div></div><button class="btn danger" onclick="logout()">Se déconnecter</button></div></div><div class="card" style="margin-top:14px"><h2>Données</h2><div class="row wrap"><button class="btn" onclick="exportData()">Exporter JSON</button><button class="btn" onclick="document.getElementById('importFile').click()">Importer JSON</button><input id="importFile" type="file" accept=".json,application/json" style="display:none" onchange="importData(this.files[0]);this.value=''"><button class="btn danger" onclick="wipe()">Effacer le carnet de ce compte</button></div><p class="sub">Le fichier exporté contient ton carnet, pas ton mot de passe ni ton code de récupération. La séance en cours est conservée séparément dans ce navigateur et n’est pas incluse dans le fichier. Pour la sauvegarder dans ton historique, termine-la avant l’export.</p></div>`;
}
function saveSettings(){
 const next=JSON.parse(JSON.stringify(DB));next.profile.name=document.getElementById('sn').value.trim()||'Champion';next.profile.avatar=document.getElementById('sa').value||'🏋️';next.profile.bio=document.getElementById('sb').value;next.profile.goal=document.getElementById('sg').value;
 try{const validated=validateBackup(next);commitUserDB(validated)}catch(error){return toast('Profil non enregistré. '+error.message.replace('Cette sauvegarde ne correspond pas au format Forge.','Vérifie les valeurs saisies.'))}
 toast('Profil enregistré');render();
}
function saveTargets(){
 const next=JSON.parse(JSON.stringify(DB));
 for(const [field,input] of [['calories','scal'],['protein','spr'],['carbs','scb'],['fat','sfa'],['water','swa']]){
  const value=Number(document.getElementById(input).value);if(!Number.isFinite(value)||value<=0)return toast('Chaque objectif doit être un nombre supérieur à 0.');next.settings[field]=value;
 }
 try{commitUserDB(validateBackup(next))}catch{return toast('Objectifs non enregistrés. Vérifie que le stockage est disponible.')}
 toast('Objectifs enregistrés');render();
}
let pendingBackupImport=null,backupImportSequence=0;
function downloadCarnet(text,name){const blob=new Blob([text],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function exportData(){
 if(currentStorageIssue())return exportRecoveryData();
 const backup={...DB,_forgeBackup:{format:'forge-carnet',version:FORGE_BACKUP_VERSION,exportedAt:new Date().toISOString()}};
 downloadCarnet(JSON.stringify(backup,null,2),`forge-backup-${today()}.json`);toast('Copie de ton carnet exportée.');
}
function exportRecoveryData(){
 const issue=currentStorageIssue();if(!issue)return;
 try{const raw=localStorage.getItem(issue.key);if(raw===null)throw new Error('Carnet absent');downloadCarnet(raw,`forge-recuperation-${today()}.json`)}catch{toast('Le fichier local ne peut pas être lu. Aucun carnet n’a été remplacé.')}
}
function storageRecoveryPage(){
 const issue=currentStorageIssue();
 return `<main class="setup storage-recovery"><section class="setupbox card"><div class="eyebrow">RÉCUPÉRATION DU CARNET</div><h1>Ton carnet a besoin d’attention</h1><p class="sub">Le carnet de ${esc(currentEmail())} n’a pas pu être ouvert. Le fichier enregistré est conservé : aucune nouvelle donnée ne le remplace automatiquement.</p><p role="alert">${esc(issue?.message||'Le format de ce carnet ne peut pas être lu.')}</p><p class="sub">Exporte d’abord le fichier de secours pour en garder une copie. Tu peux ensuite importer une sauvegarde valide, ou choisir d’effacer uniquement le carnet de ce compte.</p><div class="grid" style="gap:12px"><button class="btn primary wide" onclick="exportRecoveryData()">Exporter le fichier de secours</button><button class="btn wide" onclick="document.getElementById('importFile').click()">Importer une sauvegarde</button><input id="importFile" type="file" accept=".json,application/json" style="display:none" onchange="importData(this.files[0]);this.value=''"><button class="btn danger wide" onclick="wipe()">Effacer le carnet de ce compte</button><button class="btn ghost wide" onclick="logout()">Se déconnecter</button></div></section></main>`;
}
function cancelBackupImport(){pendingBackupImport=null;closeModal()}
function importData(file){
 if(!file)return;
 pendingBackupImport=null;
 const sequence=++backupImportSequence,owner=currentEmail();
 if(!owner||!AUTH[owner])return toast('Connecte-toi au compte dont tu veux remplacer le carnet.');
 if(file.size>FORGE_BACKUP_MAX_BYTES)return toast('Ce fichier dépasse la taille maximale de 16 Mo.');
 const reader=new FileReader();
 reader.onerror=()=>toast('Ce fichier n’a pas pu être lu. Ton carnet n’a pas été modifié.');
 reader.onload=()=>{
  if(sequence!==backupImportSequence)return;
  if(owner!==currentEmail())return toast('Le compte a changé. Recommence l’import depuis le compte souhaité.');
  let source,staged;
  try{source=JSON.parse(reader.result)}catch{return toast('Ce fichier n’est pas un fichier JSON lisible.')}
  try{staged=validateBackup(source)}catch(error){return toast(error.message)}
  pendingBackupImport={owner,staged,sequence};
  const unknown=Object.keys(staged).filter(key=>!(key in defaultDB())&&!['photoNotice','workoutDraftResetAt'].includes(key)).length;
  const hasDraft=!!session||!!readWorkoutDraft();
  document.getElementById('modalbox').innerHTML=`<div class="backup-preview"><div class="eyebrow">IMPORTER UNE SAUVEGARDE</div><h2>Vérifie ta sauvegarde</h2><p class="sub">Cette sauvegarde remplacera le carnet de ce compte dans ce navigateur. Exporte ton carnet actuel si tu veux le conserver.</p><p><b>Compte :</b> ${esc(owner)}</p><div class="grid g3" style="margin:18px 0"><div class="stat"><b>${staged.sessions.length}</b><small>Séances</small></div><div class="stat"><b>${staged.meals.length}</b><small>Repas</small></div><div class="stat"><b>${staged.photos.length}</b><small>Photos</small></div></div><p class="sub">${staged.programs.length} programme${staged.programs.length>1?'s':''} · ${staged.habits.length} habitude${staged.habits.length===1?'':'s'} · profil ${esc(staged.profile.name||'sans prénom')}</p>${source._forgeBackup?'':'<p class="sub">Sauvegarde ancienne reconnue : les réglages manquants seront complétés.</p>'}${source.activeProgram&&staged.activeProgram===null?'<p class="sub">Le programme actif n’existe plus dans ce fichier. Les programmes présents sont conservés ; tu pourras en activer un.</p>':''}${unknown?`<p class="sub">${unknown} champ${unknown>1?'s':''} supplémentaire${unknown>1?'s':''} conservé${unknown>1?'s':''} dans le carnet.</p>`:''}${hasDraft?'<p>Ta séance en cours sera abandonnée seulement si le remplacement réussit.</p>':''}<p class="sub">Ton compte, ton mot de passe et les autres profils ne seront pas modifiés.</p><div class="row gap wrap" style="margin-top:18px"><button class="btn primary" onclick="confirmBackupImport()">Remplacer mon carnet</button><button class="btn" onclick="cancelBackupImport()">Annuler</button></div></div>`;
  openModal();
 };
 reader.readAsText(file);
}
function confirmBackupImport(){
 const pending=pendingBackupImport;if(!pending)return;
 if(pending.owner!==currentEmail()||!AUTH[pending.owner]){pendingBackupImport=null;closeModal();return toast('Le compte a changé. Recommence l’import depuis le compte souhaité.')}
 const next={...pending.staged,workoutDraftResetAt:Date.now()};
 try{commitUserDB(next,pending.owner)}catch{return toast('Le carnet n’a pas pu être enregistré. Tes données précédentes sont conservées.')}
 pendingBackupImport=null;clearWorkoutDraft(pending.owner);stopWorkoutRuntime();window.lastSummary=null;
 closeModal();view=DB.profile.setup?'home':'setup';render();toast('Sauvegarde importée. Ton carnet est prêt.');
}
function wipe(){
 const owner=currentEmail();
 if(!confirm('Effacer le carnet de ce compte ? Séances, repas, photos et séance en cours seront supprimés de ce navigateur. Le compte et les autres profils seront conservés.'))return;
 const next={...defaultDB(),workoutDraftResetAt:Date.now()};
 try{commitUserDB(next,owner)}catch{return toast('Le carnet n’a pas pu être effacé. Tes données précédentes sont conservées.')}
 pendingBackupImport=null;clearWorkoutDraft(owner);stopWorkoutRuntime();window.lastSummary=null;closeModal();view='setup';render();toast('Le carnet de ce compte a été effacé.');
}
