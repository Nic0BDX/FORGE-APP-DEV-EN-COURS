/* FORGE — Catalogue d’exercices, programmes, repas, routines */
const exerciseCatalog=[
['Développé couché','Pectoraux','Barre','Intermédiaire','🏋️'],['Développé incliné haltères','Pectoraux','Haltères','Intermédiaire','↗️'],['Écarté poulie vis-à-vis','Pectoraux','Poulie','Débutant','〰️'],['Dips','Pectoraux / Triceps','Poids du corps','Intermédiaire','⬇️'],
['Tirage vertical','Dos','Poulie','Débutant','↘️'],['Rowing barre','Dos','Barre','Intermédiaire','🏋️'],['Rowing assis poulie','Dos','Poulie','Débutant','↔️'],['Tractions pronation','Dos','Poids du corps','Avancé','↑'],
['Développé militaire','Épaules','Barre','Intermédiaire','⬆️'],['Élévations latérales','Épaules','Haltères','Débutant','↔️'],['Oiseau poulie','Épaules','Poulie','Débutant','🪽'],
['Curl incliné','Biceps','Haltères','Intermédiaire','💪'],['Curl pupitre','Biceps','Machine','Débutant','💪'],['Curl marteau','Biceps','Haltères','Débutant','🔨'],
['Extension triceps poulie','Triceps','Poulie','Débutant','⬇️'],['Barre au front','Triceps','Barre EZ','Intermédiaire','〰️'],
['Squat','Quadriceps / Fessiers','Barre','Intermédiaire','🦵'],['Presse à cuisses','Quadriceps','Machine','Débutant','🦿'],['Hack squat','Quadriceps','Machine','Intermédiaire','🦿'],['Fentes bulgares','Jambes','Haltères','Intermédiaire','🦵'],
['Soulevé de terre roumain','Ischios / Fessiers','Barre','Intermédiaire','⬇️'],['Leg curl','Ischios','Machine','Débutant','🦵'],['Hip thrust','Fessiers','Barre / Machine','Intermédiaire','🍑'],['Mollets debout','Mollets','Machine','Débutant','↕️'],
['Crunch poulie','Abdos','Poulie','Débutant','◎'],['Relevés de jambes','Abdos','Poids du corps','Intermédiaire','◎'],['Planche','Gainage','Poids du corps','Débutant','▰'],
['Tapis de course','Cardio','Machine','Débutant','🏃'],['Vélo','Cardio','Machine','Débutant','🚴'],['Rameur','Cardio','Machine','Intermédiaire','🚣']
].map((e,i)=>({id:'ex'+i,name:e[0],muscle:e[1],equipment:e[2],level:e[3],ico:e[4]}));
const workoutTemplates=[
{id:'push',name:'Push · Pectoraux / Épaules / Triceps',tag:'PUSH',duration:'55 min',ex:[['Développé couché',4,6,10,120],['Développé incliné haltères',3,8,12,90],['Élévations latérales',3,12,15,60],['Extension triceps poulie',3,10,15,60]]},
{id:'pull',name:'Pull · Dos / Biceps',tag:'PULL',duration:'55 min',ex:[['Tirage vertical',4,8,12,90],['Rowing barre',4,6,10,120],['Rowing assis poulie',3,10,12,75],['Curl marteau',3,10,14,60]]},
{id:'legs',name:'Legs · Jambes complètes',tag:'LEGS',duration:'60 min',ex:[['Squat',4,6,10,150],['Presse à cuisses',3,10,12,120],['Soulevé de terre roumain',3,8,12,120],['Leg curl',3,10,15,75],['Mollets debout',4,12,18,60]]},
{id:'full',name:'Full Body · Essentiel',tag:'FULL BODY',duration:'50 min',ex:[['Squat',3,6,10,120],['Développé couché',3,6,10,120],['Tirage vertical',3,8,12,90],['Développé militaire',3,8,12,90],['Planche',3,30,60,45]]}
];
const mealPlans=[
{name:'Petit-déj · Énergie',time:'07:30',ico:'🌅',items:['Flocons d’avoine','Banane','Yaourt grec','Whey'],note:'Base riche en glucides + protéines.'},
{name:'Déjeuner · Performance',time:'12:30',ico:'🍚',items:['Poulet grillé','Riz basmati','Légumes verts','Huile d’olive'],note:'Idéal avant une séance l’après-midi.'},
{name:'Pré-workout',time:'16:30',ico:'⚡',items:['Banane','Skyr ou yaourt','Café si tu en consommes'],note:'Simple et digeste, environ 60–120 min avant.'},
{name:'Dîner · Récupération',time:'20:00',ico:'🌙',items:['Saumon ou œufs','Pommes de terre','Légumes','Fruit'],note:'Repas complet, à adapter à tes objectifs.'}
];
const routineBlocks=[
['07:00','Réveil','💧','500 ml d’eau · lumière naturelle · 5 min de mobilité'],
['07:30','Petit-déjeuner','🍳','Repas prévu · protéines + glucides'],
['10:30','Hydratation','💧','250–500 ml selon soif et activité'],
['12:30','Déjeuner','🍚','Repas complet · légumes + source de protéines'],
['16:30','Pré-séance','⚡','Snack si besoin · 60–120 min avant l’entraînement'],
['18:00','Entraînement','🏋️','Échauffement → séries de travail → retour au calme'],
['20:00','Dîner','🌙','Repas de récupération · hydratation'],
['22:30','Déconnexion','😴','Réduire les écrans · viser une durée de sommeil régulière']
];
