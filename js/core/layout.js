/* FORGE — Navigation, coque de l’app, thème, rendu */
window.__fresh=true;
const IC={
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 1.4 1.4M5 19l1.4-1.4M17.6 6.4 1.4-1.4"/>',
 moon:'<path d="M20.8 13.2A8.8 8.8 0 0 1 10.8 3.2 8.8 8.8 0 1 0 20.8 13.2Z"/>',
 home:'<path d="M3 11.2 12 4l9 7.2V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 train:'<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',
 food:'<path d="M7 3v8a2 2 0 0 0 4 0V3M9 3v18M17 3c-2.2 1.8-2.8 4.6-2.8 8H17v10"/>',
 habit:'<circle cx="12" cy="12" r="9"/><path d="m8 12.4 2.8 2.8 5.2-5.6"/>',
 stats:'<path d="M4 20V11M10 20V4M16 20v-7M21 20H3"/>',
 goals:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
 calendar:'<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
 community:'<circle cx="9" cy="8.5" r="3.2"/><path d="M3 20c.5-3.6 3-5.5 6-5.5s5.5 1.9 6 5.5M16 5.6a3.2 3.2 0 0 1 0 5.8M18 14.8c1.8.7 2.8 2.4 3 5.2"/>',
 settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.6M12 18.6v2.6M4.6 7.4l2.2 1.3M17.2 15.3l2.2 1.3M4.6 16.6l2.2-1.3M17.2 8.7l2.2-1.3"/>',
 profile:'<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20.5c.6-4 3.5-6 7.5-6s6.9 2 7.5 6"/>',
 flame:'<path d="M12 3c1 3.2 4.8 5 4.8 9.4A4.8 4.8 0 0 1 12 17.2a4.8 4.8 0 0 1-4.8-4.8c0-1.9.9-3 1.8-4 .4 1.2 1 1.8 1.6 2C10.4 8 10.6 5.4 12 3z"/>',
 check:'<path d="m5 12.5 4.6 4.6L19 7.5"/>',plus:'<path d="M12 5v14M5 12h14"/>',
 back:'<path d="M19 12H5M11 6l-6 6 6 6"/>',chev:'<path d="m9 6 6 6-6 6"/>',up:'<path d="m6 15 6-6 6 6"/>',
 play:'<path d="M7 4.8v14.4a.8.8 0 0 0 1.2.7l11.5-7.2a.8.8 0 0 0 0-1.4L8.2 4.1A.8.8 0 0 0 7 4.8z" fill="currentColor"/>',
 pause:'<path d="M8 5v14M16 5v14" stroke-width="3.2"/>',flag:'<path d="M6 21V4M6 5h12l-2.5 4L18 13H6" />',
 dots:'<circle cx="12" cy="5.5" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="18.5" r="1.3" fill="currentColor"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',bolt:'<path d="M13 2.8 5 13.5h6l-1 7.7 8-10.7h-6z"/>',
 trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4.5c0 3 1.3 4.6 3.6 5M16 6h3.5c0 3-1.3 4.6-3.6 5M12 13v4M8.5 20.5h7M10 17h4"/>',
 book:'<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5zM5 19.5A1.5 1.5 0 0 0 6.5 21H19"/>',
 photo:'<rect x="3" y="6.5" width="18" height="13.5" rx="3"/><circle cx="12" cy="13" r="3.5"/><path d="M8.5 6.5 10 4h4l1.5 2.5"/>',
 bell:'<path d="M6 17h12l-1.5-2V11a4.5 4.5 0 0 0-9 0v4zM10 20a2 2 0 0 0 4 0"/>',
 camera:'<path d="M4 8h3l1.6-2.4h6.8L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.4"/>',
 trend:'<path d="m3 17 6-6 4 4 8-8M15 7h6v6"/>'
};
function ico(n,c=''){return `<svg class="ic ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||''}</svg>`}
function photo(name){return `<div class="ph"><span class="ph-fb"></span><img src="assets/images/${name}.svg" alt="" decoding="async" onerror="this.remove()"></div>`}
function nav(v){closeModal();view=v;window.__fresh=true;render();scrollTo(0,0)}
function shell(content){
 const lvl=xpLevel();
 const xpPct=Math.min(100,Math.round(lvl.left/lvl.need*100));
 const st=loginStreak();
 const fresh=window.__fresh;window.__fresh=false;
 const me=DB.profile.name||AUTH[currentEmail()]?.name||'Champion';
 return `<div class="app ${fresh?'fresh':''} ${view==='session'?'is-session':''}">
  <header class="mobile-topbar">
   <button class="mobile-brand" onclick="nav('home')" aria-label="Forge, accueil"><span class="logo-f">F</span> FORGE</button>
   <div class="mobile-topbar-actions"><button class="es-round sm" onclick="toggleTheme()" aria-label="${DB.settings.theme==='light'?'Activer le mode sombre':'Activer le mode clair'}">${ico(DB.settings.theme==='light'?'moon':'sun')}</button><button class="es-round sm" onclick="openAppMenu()" aria-label="Toutes les rubriques">${ico('menu')}</button></div>
  </header>
  <div class="shell">
   <aside class="side">
    <div class="brand-lockup"><div class="brand-word"><span class="logo-f">F</span>FORGE</div><div class="brand-sub">Plus qu’une app, une discipline.</div></div>
    <nav class="nav">
     ${navBtn('home','home','Aperçu')}
     ${navBtn('program','train','Entraînements')}
     ${navBtn('exercises','book','Exercices')}
     ${navBtn('nutrition','food','Nutrition')}
     ${navBtn('habits','habit','Habitudes')}
     ${navBtn('progress','stats','Progression')}
     ${navBtn('goals','goals','Objectifs')}
     ${navBtn('calendar','calendar','Calendrier')}
     ${navBtn('memories','photo','Souvenirs')}
     ${navBtn('coach','bolt','Coach IA')}
     ${navBtn('community','community','Communauté')}
     ${navBtn('profile','profile','Mon profil')}
     ${navBtn('settings','settings','Paramètres')}
    </nav>
    <div class="side-spacer"></div>
    <div class="side-level">
      <div class="side-level-head">
        <div><small>NIVEAU</small><div style="font-size:10px;margin-top:3px">Progression</div></div>
        <div class="side-level-ring" style="--value:${xpPct}"><b>${lvl.level}</b></div>
      </div>
      <div style="margin-top:9px"><b style="font-size:12px">Niveau ${lvl.level}</b><div class="xp-mini">${lvl.left.toLocaleString('fr-FR')} / ${lvl.need.toLocaleString('fr-FR')} XP</div></div>
      <div class="progress green" style="height:5px;margin-top:8px"><i style="width:${xpPct}%"></i></div>
    </div>
    <div class="side-streak"><div class="fire">${flame()}</div><div><small>JOURS DE PRÉSENCE</small><b>${st} jours</b></div></div>
    <button class="side-account" onclick="nav('profile')"><div class="account-avatar" style="${avatarStyle(DB.profile.avatar||AUTH[currentEmail()]?.avatar||AVATARS[0])}"></div><div><b>${esc(me)}</b><small>Voir le profil</small></div></button>
   </aside>
   <main class="main" id="main-content">${workoutResumeCard()}${content}</main>
  </div>
  <nav class="mobile-nav" aria-label="Navigation principale">${mobileBtn('home','home','Accueil')}${mobileBtn('program','train','Séances')}${mobileBtn('nutrition','food','Nutrition')}${mobileBtn('memories','photo','Souvenirs')}${mobileBtn('profile','profile','Profil')}</nav>
 </div>`;
}
const NAV_ALIAS={coach:'profile',nutriai:'nutrition',beforeafter:'memories',weekly:'memories',preview:'program',session:'program',summary:'program',workouts:'program',exercises:'program',progress:'profile',goals:'profile',habits:'profile',routine:'profile',calendar:'profile',community:'profile',settings:'profile',premium:'profile',history:'profile',streak:'profile',meals:'nutrition'};
function navView(){return NAV_ALIAS[view]||view}
function navBtn(v,i,l){return `<button class="${view===v?'active':''}" onclick="nav('${v}')">${ico(i)}<span>${l}</span></button>`}
function mobileBtn(v,i,l){return `<button class="${navView()===v?'active':''}" onclick="nav('${v}')" aria-label="${l}">${ico(i)}<span>${l}</span></button>`}
function toggleTheme(){DB.settings.theme=DB.settings.theme==='light'?'dark':'light';save();applyTheme();render()}
function applyTheme(){const light=DB.settings.theme!=='dark';document.documentElement.classList.toggle('light',light);document.documentElement.style.colorScheme=light?'light':'dark';document.querySelector('meta[name="theme-color"]')?.setAttribute('content',light?'#F5F3EC':'#142B24')}
function render(){applyTheme();if(!isLogged()){document.getElementById('root').innerHTML=authPage();return}document.getElementById('root').innerHTML=view==='setup'?setupPage():shell(pages[view]?pages[view]():home())}

/* Toutes les rubriques restent accessibles sur téléphone. */
function openAppMenu(){
 const links=[['home','home','Accueil'],['program','train','Programmes'],['exercises','book','Exercices'],['nutrition','food','Nutrition'],['memories','photo','Souvenirs'],['progress','stats','Progression'],['calendar','calendar','Calendrier'],['coach','bolt','Coach IA'],['habits','habit','Habitudes'],['routine','check','Ma routine'],['goals','goals','Objectifs'],['community','community','Communauté'],['history','clock','Historique'],['profile','profile','Mon profil'],['premium','trophy','Forge Premium'],['settings','settings','Paramètres']];
 document.getElementById('modalbox').innerHTML=`<div class="row"><div><div class="eyebrow">À TON RYTHME</div><h2>Ton espace Forge</h2></div><button class="es-round" onclick="closeModal()" aria-label="Fermer le menu">×</button></div><nav class="app-menu-grid" aria-label="Toutes les rubriques">${links.map(([v,i,l])=>`<button class="app-menu-item ${view===v?'active':''}" onclick="nav('${v}')">${ico(i)}<span>${l}</span>${ico('chev')}</button>`).join('')}</nav>`;
 openModal();
}
