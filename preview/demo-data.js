/* Données fictives exclusivement destinées à l’atelier visuel. */
if (!window.__forgeDemoIsolated) throw new Error('Données démo interdites sans stockage isolé.');
(() => {
  const email = 'demo@forge.example';
  const dateAgo = days => { const d = new Date(); d.setDate(d.getDate() - days); return [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-'); };
  DB = defaultDB();
  DB.profile = {...DB.profile,setup:true,name:'Camille',goal:'Gagner en énergie',level:'Intermédiaire',perWeek:3,avatar:AVATARS[0],bio:'Un peu plus forte, un jour à la fois.'};
  DB.settings = {...DB.settings,theme:'dark',calories:2200,protein:120,carbs:260,fat:70};
  DB.programs = [{id:'demo-fullbody',name:'Mon rythme · 3 jours',next:0,days:[{id:'demo-day',name:'Full body · Équilibre',exercises:[
    {id:'demo-squat',name:'Squat',sets:3,repsMin:8,repsMax:10,rest:90},
    {id:'demo-row',name:'Rowing barre',sets:3,repsMin:10,repsMax:12,rest:75},
    {id:'demo-bench',name:'Développé couché',sets:3,repsMin:8,repsMax:10,rest:90},
    {id:'demo-press',name:'Développé militaire',sets:3,repsMin:10,repsMax:12,rest:60}
  ]}]}];
  DB.activeProgram = 'demo-fullbody';
  ['Haut du corps','Jambes & stabilité','Full body · Renforcement'].forEach((name,i)=>DB.programs[0].days.push({id:'demo-day-'+(i+2),name,exercises:DB.programs[0].days[0].exercises.slice(0,i===0?3:4).map((e,j)=>({...e,id:'demo-ex-'+i+'-'+j}))}));
  DB.sessions = [0,2,5,9,12,15,18,22].map((days,i)=>({id:'demo-session-'+i,date:dateAgo(days),iso:dateAgo(days)+'T10:00:00.000Z',program:'Mon rythme · 3 jours',day:i%2?'Haut du corps':'Full body · Équilibre',duration:i===0?3840:2400+i*60,volume:3800-i*150,sets:12,exercises:[{name:'Squat',sets:[{weight:45,reps:10,rpe:7,done:true}]}]}));
  DB.prs = {'Squat':55,'Rowing barre':35,'Développé couché':40};
  DB.weights = [{date:dateAgo(20),value:67.5},{date:dateAgo(10),value:67.2},{date:dateAgo(1),value:67}];
  DB.meals = [
    {id:'demo-breakfast',date:dateAgo(0),meal:'Petit-déjeuner',food:'Porridge, banane & amandes',grams:250,kcal:450,p:25,c:70,f:7.8},
    {id:'demo-lunch',date:dateAgo(0),meal:'Déjeuner',food:'Poulet, riz & légumes',grams:400,kcal:640,p:50,c:60,f:22.2},
    {id:'demo-snack',date:dateAgo(0),meal:'Collation',food:'Yaourt & fruits de saison',grams:180,kcal:251,p:28,c:20,f:6.6},
    {id:'demo-dinner',date:dateAgo(0),meal:'Dîner',food:'Saumon, quinoa & légumes',grams:350,kcal:500,p:40,c:30,f:24.4}
  ];
  DB.water[dateAgo(0)] = 1800;
  [6400,8100,7300,9200,10040,11500,12845].forEach((value,i)=>DB.steps[dateAgo(6-i)]=value);
  [7.8,7.4,7.6,7,7.2,7.1,6.8].forEach((hours,i)=>DB.sleep[dateAgo(6-i)]={hours,quality:4});
  DB.health={pulse:[72,78,69,73,74,86,98].map((value,i)=>({date:dateAgo(6-i),value}))};
  DB.profile.accent='lime';
  DB.habitLog[dateAgo(0)+'_h2'] = true;
  DB.habitLog[dateAgo(0)+'_h3'] = true; DB.habitLog[dateAgo(0)+'_h4'] = true;
  DB.visits = [0,1,2,3,4].map(dateAgo); DB.visitBest = 5; DB.xp = 850;
  DB.xpLog = [{id:'demo-xp',date:new Date().toISOString(),n:100,reason:'Séance terminée'}]; DB.demo = true;
  AUTH = {[email]:{email,name:'Camille',avatar:AVATARS[0],createdAt:new Date().toISOString()}};
  localStorage.setItem('forge_accounts_v1',JSON.stringify(AUTH));
  localStorage.setItem('forge_data_'+email,JSON.stringify(DB));
  localStorage.setItem(KEY,JSON.stringify(DB));
  const requested = new URLSearchParams(location.search).get('screen') || 'home';
  const allowed = ['home','program','nutrition','progress','memories','beforeafter','coach','calendar','profile','sleep','health','premium','settings','exercises','goals','history','habits'];
  if (requested === 'welcome') { localStorage.removeItem('forge_session_v1'); authMode='login'; authStep='welcome'; view='home'; }
  else { localStorage.setItem('forge_session_v1',email); view=allowed.includes(requested)?requested:'home'; }
})();
