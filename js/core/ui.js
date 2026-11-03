/* FORGE — Toast et modales */
function toast(t){const x=document.getElementById('toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),2200)}

function openModal(){document.getElementById('modal').classList.add('show')}
function closeModal(){document.getElementById('modal').classList.remove('show')}
document.getElementById('modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()})
function renderCurrent(){render()}
