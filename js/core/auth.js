/* FORGE — Comptes locaux, connexion et indicateur de préparation (sans biométrie). */
function loadAuth(){try{return JSON.parse(localStorage.getItem('forge_accounts_v1')||'{}')}catch{return {}}}
function saveAuth(){localStorage.setItem('forge_accounts_v1',JSON.stringify(AUTH))}
function currentEmail(){return localStorage.getItem('forge_session_v1')||''}
function isLogged(){return !!currentEmail() && !!AUTH[currentEmail()] }
function hashPassword(password,salt){return crypto.subtle.digest('SHA-256',new TextEncoder().encode(salt+'::'+password)).then(b=>Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join(''))}
function makeSalt(){return Array.from(crypto.getRandomValues(new Uint8Array(16))).map(x=>x.toString(16).padStart(2,'0')).join('')}
function setAuthError(msg){const el=document.getElementById('authError');if(el)el.textContent=msg||''}
function avatarStyle(url){const safe=String(url||'');return /^(data:image\/|https?:\/\/|assets\/)/.test(safe)?`background-image:url('${esc(safe)}')`:''}

function authPage(){
 if(authMode==='forgot')return forgotPage();
 const login=authMode==='login';
 return `<div class="ea" data-step="${authStep}">
 <div class="ea-photo">${photo('hero-auth')}<div class="ea-glow"></div></div>
 <div class="ea-copy"><div class="ea-brand"><span class="vf-auth-f">f</span> forge.<small>LE RYTHME QUI TE RESSEMBLE</small></div><h1 class="ea-title">Trouve ton<br><em>rythme.</em></h1><p class="ea-lead">Plus qu'une app, une discipline.</p><p class="ea-description">Tes séances, tes repères, tes progrès. Un espace pour avancer à ton rythme.</p><div class="ea-pillars"><span>Entraînement</span><span>Nutrition</span><span>Progression</span></div></div>
 <section class="ea-panel">
  <div class="ea-actions"><button class="ea-btn red" onclick="goAuth('register')">Créer mon espace ${ico('chev')}</button><button class="ea-btn dark" onclick="goAuth('login')">Me connecter</button><p class="ea-welcome-note">Un peu chaque jour. Beaucoup pour toi.</p></div>
  <form class="ea-form" onsubmit="event.preventDefault();${login?'loginAccount()':'registerAccount()'}">
   <button class="ea-back" type="button" onclick="authStep='welcome';render()">${ico('back')} Retour</button>
   <div class="ea-form-brand"><span class="vf-auth-f">f</span> forge.</div>
   <div class="ea-tabs"><button class="${login?'active':''}" type="button" onclick="switchAuth('login')">Connexion</button><button class="${!login?'active':''}" type="button" onclick="switchAuth('register')">Créer un compte</button></div>
   <div class="ea-h">${login?'Bon retour.':'Ton prochain chapitre.'}</div><div class="ea-sub">${login?'Retrouve ton programme et reprends à ton rythme.':'Un profil pour retrouver tes séances et tes progrès sur cet appareil.'}</div>
   ${login?`<label for="authEmail">Email</label><input id="authEmail" type="email" required autocomplete="username" placeholder="toi@email.com" value="${esc(currentEmail())}"><label for="authPass">Mot de passe</label><div class="password-wrap"><input id="authPass" type="password" required minlength="8" autocomplete="current-password" placeholder="••••••••"><button class="eye" type="button" onclick="togglePass('authPass',this)" aria-label="Afficher le mot de passe">◉</button></div>`:`<label for="regName">Prénom / pseudo</label><input id="regName" autocomplete="name" placeholder="Ex. Lucas"><label for="authEmail">Email</label><input id="authEmail" type="email" required autocomplete="username" placeholder="toi@email.com"><label for="authPass">Mot de passe</label><div class="password-wrap"><input id="authPass" type="password" required minlength="8" autocomplete="new-password" placeholder="8 caractères minimum"><button class="eye" type="button" onclick="togglePass('authPass',this)" aria-label="Afficher le mot de passe">◉</button></div><label>Choisis ton avatar</label><div class="avatar-picker">${AVATARS.map((u,i)=>`<button type="button" class="avatar-option ${selectedAvatar===i?'selected':''}" style="background-image:url('${u}')" onclick="pickAvatar(${i})" aria-label="Avatar ${i+1}"></button>`).join('')}</div>`}
   ${login?'<div style="text-align:right;margin:-4px 0 4px"><button type="button" class="auth-link" onclick="goForgot()">Mot de passe oublié ?</button></div>':''}<div id="authError" class="auth-error" role="alert"></div><button id="authSubmit" type="submit" class="ea-btn red">${login?'Me connecter':'Créer mon espace'}</button>
   <div class="auth-meta"><span>Compte local à ce navigateur</span>${login?'<button type="button" class="auth-link" onclick="switchAuth(\'register\')">Nouveau ici ?</button>':'<button type="button" class="auth-link" onclick="switchAuth(\'login\')">J’ai déjà un compte</button>'}</div>
   <div class="security-note">Ton profil et tes données restent dans ce navigateur. Pense à les exporter pour les conserver.</div>
  </form>
 </section></div>`;
}
function goAuth(mode){authMode=mode;authStep='form';render()}
function switchAuth(mode){authMode=mode;authStep='form';setAuthError('');render()}
function pickAvatar(i){selectedAvatar=i;document.querySelectorAll('.avatar-option').forEach((button,index)=>{button.classList.toggle('selected',index===i);button.setAttribute('aria-pressed',String(index===i))})}
function togglePass(id,btn){const el=document.getElementById(id);if(!el)return;el.type=el.type==='password'?'text':'password';btn.textContent=el.type==='password'?'◉':'◌'}
async function registerAccount(){
 const email=(document.getElementById('authEmail')?.value||'').trim().toLowerCase(),pass=document.getElementById('authPass')?.value||'',name=(document.getElementById('regName')?.value||'Champion').trim();
 if(!/^\S+@\S+\.\S+$/.test(email))return setAuthError('Entre une adresse email valide.');
 if(pass.length<8)return setAuthError('Le mot de passe doit contenir au moins 8 caractères.');
 if(name.length>150)return setAuthError('Le prénom ou pseudo doit contenir au maximum 150 caractères.');
 if(AUTH[email])return setAuthError('Un compte existe déjà avec cet email. Connecte-toi.');
 const salt=makeSalt(),hash=await hashPassword(pass,salt);
 const rec=makeRecoveryCode(),recSalt=makeSalt(),recHash=await hashPassword(rec,recSalt);
 AUTH[email]={email,name:name||'Champion',salt,hash,recSalt,recHash,avatar:AVATARS[selectedAvatar],createdAt:new Date().toISOString()};saveAuth();localStorage.setItem('forge_session_v1',email);
 DB=defaultDB();DB.profile.setup=false;DB.profile.name=name||'Champion';DB.profile.avatar=AVATARS[selectedAvatar];localStorage.setItem('forge_data_'+email,JSON.stringify(DB));showFaceUnlock('register');showRecoveryCode(rec);
}
async function loginAccount(){
 const email=(document.getElementById('authEmail')?.value||'').trim().toLowerCase(),pass=document.getElementById('authPass')?.value||'';
 const account=AUTH[email];if(!account)return setAuthError('Compte introuvable. Vérifie ton email ou crée un compte.');
 const hash=await hashPassword(pass,account.salt);if(hash!==account.hash)return setAuthError('Mot de passe incorrect.');
 localStorage.setItem('forge_session_v1',email);DB=loadUserDB(email);if(!currentStorageIssue()){if(!DB.profile.avatar)DB.profile.avatar=account.avatar;save()}showFaceUnlock('login');
}
function loadUserDB(email){return readStoredDB('forge_data_'+email,email)}
function saveUserDB(){ensureWritableDB();const e=currentEmail();if(e)return commitUserDB(DB,e)}
function logout(){if(!suspendWorkout())return;if(!currentStorageIssue())saveUserDB();localStorage.removeItem('forge_session_v1');storageReadIssue=null;view='home';authMode='login';authStep='welcome';render();toast('Déconnexion effectuée.')}
function showFaceUnlock(mode){const m=document.getElementById('faceModal');if(!m){document.body.insertAdjacentHTML('beforeend',faceModal());}const el=document.getElementById('faceModal');el.classList.add('show');el.classList.remove('success');document.getElementById('faceTitle').textContent=mode==='register'?'Création de ton espace…':'Connexion à ton espace…';setTimeout(()=>{el.classList.add('success');document.getElementById('faceTitle').textContent='Ton espace est prêt';document.getElementById('faceSub').textContent='Bienvenue dans Forge';},350);setTimeout(()=>{el.classList.remove('show');DB=loadUserDB(currentEmail());view=DB.profile.setup?'home':'setup';render();},700)}
function faceModal(){return `<div id="faceModal" class="face-modal"><div class="face-box"><div class="face-scan"><div class="face-icon"><span class="face-emoji">◉</span><span class="checkmark">✓</span></div></div><div id="faceTitle" class="face-title">Préparation de ton espace…</div><div id="faceSub" class="face-sub">Tes repères, au même endroit</div></div></div>`}

function makeRecoveryCode(){const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',r=crypto.getRandomValues(new Uint8Array(12));const c=Array.from(r,x=>a[x%a.length]).join('');return c.slice(0,4)+'-'+c.slice(4,8)+'-'+c.slice(8,12)}
function showRecoveryCode(code){document.getElementById('modalbox').innerHTML=`<div class="cele"><h2>Ton code de récupération</h2><p class="sub">Note-le maintenant : il ne sera plus affiché. Il te permettra de redéfinir ton mot de passe si tu l’oublies.</p><div class="rec-code">${code}</div><button class="ea-btn red" onclick="closeModal()">J’ai noté mon code</button></div>`;openModal()}
function goForgot(){authMode='forgot';authStep='form';render()}
function forgotPage(){
 return `<div class="ea" data-step="form"><div class="ea-photo">${photo('hero-auth')}<div class="ea-glow"></div></div>
 <div class="ea-copy"><div class="ea-brand"><span class="vf-auth-f">f</span> forge.<small>LE RYTHME QUI TE RESSEMBLE</small></div><h1 class="ea-title">Trouve ton<br><em>rythme.</em></h1></div>
 <section class="ea-panel"><div class="ea-form"><button class="ea-back" type="button" onclick="switchAuth('login')" style="display:flex">${ico('back')} Retour</button>
  <div class="ea-h">Mot de passe oublié</div><div class="ea-sub">Entre ton email, le code de récupération affiché lors de l’inscription et ton nouveau mot de passe.</div>
  <label for="authEmail">Email</label><input id="authEmail" type="email" required autocomplete="username" placeholder="toi@email.com">
  <label>Code de récupération</label><input id="recCode" autocomplete="off" autocapitalize="characters" placeholder="XXXX-XXXX-XXXX">
  <label>Nouveau mot de passe</label><div class="password-wrap"><input id="authPass" type="password" required minlength="8" autocomplete="new-password" placeholder="8 caractères minimum"><button class="eye" type="button" onclick="togglePass('authPass',this)" aria-label="Afficher le mot de passe">◉</button></div>
  <div id="authError" class="auth-error" role="alert"></div><button id="authSubmit" class="ea-btn red" onclick="resetPassword()">Réinitialiser le mot de passe</button>
  <div class="security-note">Les comptes sont stockés dans ce navigateur : sans code de récupération, un mot de passe oublié ne peut pas être réinitialisé pour les comptes créés avant cette version.</div></div></section></div>`}
async function resetPassword(){
 const email=(document.getElementById('authEmail')?.value||'').trim().toLowerCase(),code=(document.getElementById('recCode')?.value||'').trim().toUpperCase(),pass=document.getElementById('authPass')?.value||'';
 const a=AUTH[email];
 if(!/^\S+@\S+\.\S+$/.test(email))return setAuthError('Entre une adresse email valide.');
 if(!a)return setAuthError('Compte introuvable. Vérifie ton email.');
 if(!a.recHash)return setAuthError('Ce compte n’a pas de code de récupération. Connecte-toi avec ton mot de passe actuel.');
 if(pass.length<8)return setAuthError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
 setAuthBusy(true,'Vérification…');
 const h=await hashPassword(code,a.recSalt);
 if(h!==a.recHash){setAuthBusy(false);return setAuthError('Code de récupération incorrect.')}
 a.salt=makeSalt();a.hash=await hashPassword(pass,a.salt);saveAuth();setAuthBusy(false);
 authMode='login';authStep='form';render();toast('Mot de passe mis à jour. Connecte-toi.');
}
function setAuthBusy(on,label){const b=document.getElementById('authSubmit');if(!b)return;if(on){b.dataset.label=b.textContent;b.textContent=label||'Chargement…';b.disabled=true;b.classList.add('busy')}else{b.textContent=b.dataset.label||b.textContent;b.disabled=false;b.classList.remove('busy')}}
const _loginAccount=loginAccount,_registerAccount=registerAccount;
loginAccount=async function(){setAuthBusy(true,'Connexion…');try{await _loginAccount()}catch{setAuthError('Connexion impossible dans ce navigateur. Réessaie depuis une adresse HTTPS ou un serveur local.')}finally{setAuthBusy(false)}};
registerAccount=async function(){setAuthBusy(true,'Création…');try{await _registerAccount()}catch{setAuthError('Création impossible. Vérifie que le stockage est disponible et utilise HTTPS ou un serveur local.')}finally{setAuthBusy(false)}};
