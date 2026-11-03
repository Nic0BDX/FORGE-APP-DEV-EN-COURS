/* FORGE — État global : restaurer le compte connecté avant de choisir sa page. */
let AUTH=loadAuth(), authMode='login', selectedAvatar=0;
let DB=isLogged()?loadUserDB(currentEmail()):load();
let view=DB.profile.setup?'home':'setup', session=null, sessionTick=null, restTick=null, rest=0;
let authStep='welcome';
