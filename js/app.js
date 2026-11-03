/* FORGE — Démarrage de l’application */
render();
/* Écran d’intro « fond live » (une fois par session, ignorable d’un tap, désactivé si animations réduites) */
(function splash(){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 try{if(sessionStorage.getItem('forgeSplash'))return;sessionStorage.setItem('forgeSplash','1')}catch(e){}
 const d=document.createElement('div');d.className='splash';d.setAttribute('aria-hidden','true');
 d.innerHTML='<div class="sp-brand"><span class="logo-f">F</span>FORGE</div><div class="sp-txt"><h2>DISCIPLINE.<br>PROGRESSION.<br>LIBERTÉ.</h2><i></i></div><p>Plus qu’une app,<br>une discipline.</p>';
 document.body.appendChild(d);
 const off=()=>{d.classList.add('out');setTimeout(()=>d.remove(),500)};d.addEventListener('click',off);setTimeout(off,800);
})();

/* Le brouillon est déjà écrit à chaque saisie ; ces événements couvrent les transitions de page. */
window.addEventListener('pagehide',()=>persistWorkoutDraft());
document.addEventListener('visibilitychange',()=>{if(session){if(document.hidden)persistWorkoutDraft();else restStep()}});
