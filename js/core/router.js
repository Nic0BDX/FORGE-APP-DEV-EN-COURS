/* FORGE — Table des pages et rendu final */
const pages={home:home,program:program,nutrition:nutrition,habits:habits,progress:progress,goals:goals,calendar:calendar,community:community,settings:settings,session:sessionPage,history:history,profile:profile,exercises:exercises,workouts:workouts,meals:meals,routine:routine};

pages.summary=summary;
pages.premium=premiumPage;

render=(()=>{return function(){applyTheme();if(!isLogged()){document.getElementById('root').innerHTML=authPage();return}if(currentStorageIssue()){document.getElementById('root').innerHTML=storageRecoveryPage();return}recordVisit();let c;if(view==='setup')c=setupPage();else if(view==='session')c=shell(sessionPage());else if(view==='summary')c=shell(summary());else c=shell((pages[view]||home)());document.getElementById('root').innerHTML=c;if(view==='progress')drawCharts(); if(view==='home')setTimeout(drawHomeChart,50)}})();
