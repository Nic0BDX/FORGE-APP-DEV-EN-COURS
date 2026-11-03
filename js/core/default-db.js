/* FORGE — Schéma de données par défaut */
const defaultDB=()=>({
  profile:{setup:false,name:'',goal:'Recomposition',level:'Intermédiaire',perWeek:4,avatar:'🏋️',bio:'',accent:'lime'},
  xp:0, xpLog:[],sessions:[],programs:[],activeProgram:null,lastSets:{},prs:{},
  meals:[],photos:[],whey:{enabled:false,dose:30,times:['10:00','16:00'],lastTaken:{}},foods:[
    {id:'f1',name:'Poulet',kcal:165,p:31,c:0,f:3.6},{id:'f2',name:'Riz cuit',kcal:130,p:2.7,c:28,f:.3},
    {id:'f3',name:'Flocons d’avoine',kcal:370,p:13,c:60,f:7},{id:'f4',name:'Œuf',kcal:143,p:13,c:1,f:10},
    {id:'f5',name:'Banane',kcal:89,p:1.1,c:23,f:.3},{id:'f6',name:'Whey',kcal:400,p:75,c:8,f:6}
  ],
  steps:{},activity:{},health:{pulse:[]},water:{},sleep:{},weights:[],measurements:[],goals:[],habits:[
    {id:'h1',name:'Séance',xp:40},{id:'h2',name:'Protéines',xp:25},{id:'h3',name:'Eau',xp:20},{id:'h4',name:'Sommeil',xp:20}
  ],habitLog:{},goals:[],notes:[],notifications:[],badges:[],settings:{theme:'dark',bodyMotion:true,calories:2800,protein:180,carbs:320,fat:80,water:2500,steps:8000,activityCalories:1000,exerciseMinutes:90,standHours:12},
  visits:[],visitBest:0,visitMilestones:[],
  demo:false
});
