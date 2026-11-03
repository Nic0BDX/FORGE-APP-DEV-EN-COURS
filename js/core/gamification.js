/* FORGE — XP, niveaux et séries */
function xpLevel(x=DB.xp){let level=1,need=500;let left=x;while(left>=need){left-=need;level++;need=Math.round(need*1.18)}return {level,left,need}}
function award(n,reason){DB.xp+=n;DB.xpLog.unshift({id:uid(),date:new Date().toISOString(),n,reason});if(DB.xpLog.length>250)DB.xpLog.pop();DB.notifications.unshift({id:uid(),date:new Date().toISOString(),text:`+${n} XP — ${reason}`});save();toast(`+${n} XP — ${reason} ⚡`)}
function streak(){const set=new Set(DB.sessions.map(s=>s.date));let d=new Date();let k=today();if(!set.has(k)){d.setDate(d.getDate()-1);k=d.toISOString().slice(0,10);if(!set.has(k))return 0}let n=0;while(set.has(k)){n++;d.setDate(d.getDate()-1);k=d.toISOString().slice(0,10)}return n}
