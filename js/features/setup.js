/* FORGE — Assistant de première configuration */
function setupPage(){return `<div class="setup"><div class="setupbox">
<div class="card hero"><div class="eyebrow">TON ESPACE, TON RYTHME</div><h1 style="font-size:42px;margin-top:8px">FORGE.</h1><p class="sub">Ton entraînement, ta nutrition, tes habitudes et ta progression dans un seul espace.</p>
<label>Prénom / pseudo</label><input id="setupName" placeholder="Ex. Camille" value="${esc(DB.profile.name||AUTH[currentEmail()]?.name||'')}"><label>Objectif</label><select id="setupGoal"><option>Prise de masse</option><option>Perte de poids</option><option selected>Recomposition</option><option>Force</option><option>Maintien</option></select>
<label>Niveau</label><select id="setupLevel"><option>Débutant</option><option selected>Intermédiaire</option><option>Avancé</option></select><label>Séances / semaine</label><input id="setupFreq" type="number" min="1" max="7" value="4">
<button class="btn primary wide" onclick="finishSetup()">Créer mon espace →</button></div>
<p class="sub" style="text-align:center;margin-top:12px">100% local au départ · tes données restent dans ce navigateur.</p></div></div>`}
function finishSetup(){
 const next=JSON.parse(JSON.stringify(DB));next.profile.setup=true;next.profile.name=document.getElementById('setupName').value.trim()||'Champion';next.profile.goal=document.getElementById('setupGoal').value;next.profile.level=document.getElementById('setupLevel').value;next.profile.perWeek=Math.max(1,Math.min(7,Math.round(+document.getElementById('setupFreq').value)||4));
 try{commitUserDB(validateBackup(next))}catch(error){return toast('Configuration non enregistrée. '+error.message.replace('Cette sauvegarde ne correspond pas au format Forge.','Vérifie les valeurs saisies.'))}
 award(100,'Bienvenue dans FORGE');nav('home');
}
