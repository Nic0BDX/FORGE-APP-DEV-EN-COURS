/* FORGE — Communauté */
function community(){
 return `<div class="row"><div><div class="eyebrow">COMMUNAUTÉ</div><h1>Communauté</h1><div class="sub">Cet espace communautaire est en préparation. Rien n’est publié depuis cette version.</div></div></div>
 <div class="grid g2" style="margin-top:16px"><div class="card"><h2>Idées pour la communauté</h2><div class="list"><div class="item"><div><b>Défi de la semaine</b><div class="sub">Un futur espace pour échanger autour des séances et des objectifs.</div></div><span class="pill green">Exemple</span></div><div class="item"><div><b>Progression</b><div class="sub">Célèbre les petites victoires, série après série.</div></div><span>→</span></div></div></div>
 <div class="card"><h2>Ton profil local</h2><div class="row" style="margin-top:14px"><div><b>${esc(DB.profile.name||'Champion')}</b><div class="sub">Niveau ${xpLevel().level} · ${streak()} jours d’entraînement consécutifs</div></div><button class="btn" onclick="nav('settings')">Paramètres</button></div><div class="progress green" style="margin-top:16px"><i style="width:${Math.min(100,xpLevel().left/xpLevel().need*100)}%"></i></div></div></div>`;
}
