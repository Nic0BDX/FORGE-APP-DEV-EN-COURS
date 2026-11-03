/* FORGE — Constantes et petits utilitaires */
const KEY='forge_fitness_os_v2';
const uid=()=>Math.random().toString(36).slice(2)+Date.now().toString(36);
const today=()=>new Date().toISOString().slice(0,10);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtDate=d=>new Date(d+'T12:00:00').toLocaleDateString('fr-FR',{day:'2-digit',month:'short'});
const kcal=(p,c,f)=>Math.round((p*4)+(c*4)+(f*9));
