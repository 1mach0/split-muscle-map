/* Split Muscle Map: app logic. Exercise database lives in js/data/exercise-db.js */
(function(){
const DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DAYS_LONG=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const MUSCLES=[
 {id:'chest_upper',name:'Upper chest',sci:'Pectoralis major, clavicular head',g:'Chest'},
 {id:'chest',name:'Mid & lower chest',sci:'Pectoralis major, sternal head',g:'Chest'},
 {id:'serratus',name:'Serratus',sci:'Serratus anterior (side of the ribs)',g:'Chest'},
 {id:'delt_front',name:'Front delts',sci:'Anterior deltoid',g:'Shoulders'},
 {id:'delt_side',name:'Side delts',sci:'Lateral deltoid',g:'Shoulders'},
 {id:'delt_rear',name:'Rear delts',sci:'Posterior deltoid',g:'Shoulders'},
 {id:'neck',name:'Neck',sci:'Sternocleidomastoid & neck extensors',g:'Back'},
 {id:'traps_upper',name:'Upper traps',sci:'Trapezius, upper fibres',g:'Back'},
 {id:'traps_mid',name:'Mid & lower traps',sci:'Trapezius, middle & lower fibres',g:'Back'},
 {id:'lats',name:'Lats',sci:'Latissimus dorsi',g:'Back'},
 {id:'upper_back',name:'Upper back',sci:'Rhomboids & teres major',g:'Back'},
 {id:'lower_back',name:'Lower back',sci:'Erector spinae',g:'Back'},
 {id:'biceps',name:'Biceps',sci:'Biceps brachii',g:'Arms'},
 {id:'brachialis',name:'Brachialis',sci:'Brachialis (under the biceps)',g:'Arms'},
 {id:'triceps',name:'Triceps',sci:'Triceps brachii',g:'Arms'},
 {id:'brachioradialis',name:'Brachioradialis',sci:'Top of the forearm',g:'Arms'},
 {id:'forearm_flex',name:'Forearm flexors',sci:'Wrist & finger flexors (grip)',g:'Arms'},
 {id:'forearm_ext',name:'Forearm extensors',sci:'Wrist & finger extensors',g:'Arms'},
 {id:'abs',name:'Abs',sci:'Rectus abdominis',g:'Core'},
 {id:'obliques',name:'Obliques',sci:'External & internal obliques',g:'Core'},
 {id:'hip_flexors',name:'Hip flexors',sci:'Iliopsoas & rectus femoris',g:'Core'},
 {id:'glutes',name:'Glutes',sci:'Gluteus maximus & medius',g:'Legs'},
 {id:'quads',name:'Quads',sci:'Quadriceps femoris',g:'Legs'},
 {id:'hamstrings',name:'Hamstrings',sci:'Biceps femoris & semis',g:'Legs'},
 {id:'adductors',name:'Adductors',sci:'Inner thigh: adductor magnus, longus, brevis',g:'Legs'},
 {id:'calves',name:'Calves',sci:'Gastrocnemius & soleus',g:'Legs'},
 {id:'tibialis',name:'Tibialis',sci:'Tibialis anterior (front of the shin)',g:'Legs'}
];
const MG=['Chest','Shoulders','Back','Arms','Core','Legs'];
const MBY={};MUSCLES.forEach(m=>MBY[m.id]=m);
const CATS=['Chest','Back','Shoulders & traps','Arms','Core','Legs'];
const RAW=[
['Bench press','Chest','chest','chest_upper delt_front triceps','Barbell'],
['Incline bench press','Chest','chest_upper','chest delt_front triceps','Barbell'],
['Incline DB press','Chest','chest_upper','chest delt_front triceps','Dumbbell'],
['Flat DB press','Chest','chest','chest_upper delt_front triceps','Dumbbell'],
['Machine chest press','Chest','chest','chest_upper delt_front triceps','Machine'],
['Cable flye','Chest','chest','chest_upper delt_front','Cable'],
['Machine chest flye (pec deck)','Chest','chest','chest_upper delt_front','Machine'],
['Low-to-high cable flye','Chest','chest_upper','chest delt_front','Cable'],
['Dip','Chest','chest triceps','delt_front','Body only'],
['Push-up','Chest','chest','chest_upper delt_front triceps abs serratus','Body only'],
['Scapular push-up','Chest','serratus','chest','Body only'],
['Lat pulldown (V-grip)','Back','lats','upper_back biceps brachialis','Cable'],
['Lat pulldown (wide grip)','Back','lats upper_back','biceps delt_rear traps_mid','Cable'],
['Single-arm cable pulldown','Back','lats','upper_back biceps','Cable'],
['Pull-up','Back','lats','upper_back biceps brachialis forearm_flex','Body only'],
['Chin-up','Back','lats biceps','upper_back brachialis forearm_flex','Body only'],
['Seated cable row (close grip)','Back','lats upper_back','traps_mid biceps delt_rear','Cable'],
['Seated cable row (wide bar)','Back','upper_back traps_mid','delt_rear lats biceps','Cable'],
['Seated row machine','Back','lats upper_back','traps_mid biceps delt_rear','Machine'],
['Chest-supported row','Back','upper_back traps_mid','lats delt_rear biceps','Dumbbell'],
['Single-arm DB row','Back','lats','upper_back biceps delt_rear','Dumbbell'],
['Barbell row','Back','upper_back lats','traps_mid delt_rear lower_back biceps','Barbell'],
['Yates row','Back','lats upper_back','traps_mid biceps lower_back','Barbell'],
['T-bar row','Back','upper_back lats','traps_mid delt_rear lower_back biceps','Barbell'],
['Straight-arm pulldown','Back','lats','triceps abs','Cable'],
['Dumbbell pullover','Back','lats chest','serratus triceps','Dumbbell'],
['Deadlift','Back','glutes hamstrings lower_back','quads traps_upper traps_mid forearm_flex lats adductors','Barbell'],
['Back extension','Back','lower_back glutes','hamstrings','Body only'],
['Overhead press','Shoulders & traps','delt_front','delt_side triceps traps_upper chest_upper','Barbell'],
['Seated DB shoulder press','Shoulders & traps','delt_front','delt_side triceps','Dumbbell'],
['Lateral raise','Shoulders & traps','delt_side','traps_upper','Dumbbell'],
['Cable lateral raise','Shoulders & traps','delt_side','traps_upper','Cable'],
['Rear delt flye','Shoulders & traps','delt_rear','traps_mid upper_back','Dumbbell'],
['Reverse pec deck','Shoulders & traps','delt_rear','traps_mid upper_back','Machine'],
['Face pull','Shoulders & traps','delt_rear traps_mid','upper_back delt_side','Cable'],
['Upright row','Shoulders & traps','delt_side traps_upper','delt_front biceps','Barbell'],
['Smith shrugs','Shoulders & traps','traps_upper','traps_mid forearm_flex','Machine'],
['DB shrugs','Shoulders & traps','traps_upper','traps_mid forearm_flex','Dumbbell'],
['Neck curl','Shoulders & traps','neck','','Other'],
['Neck extension','Shoulders & traps','neck','traps_upper','Other'],
["Farmer's carry",'Shoulders & traps','forearm_flex traps_upper','traps_mid obliques abs','Dumbbell'],
['Barbell curl','Arms','biceps','brachialis forearm_flex','Barbell'],
['Incline DB curl','Arms','biceps','brachialis','Dumbbell'],
['Preacher curl','Arms','biceps brachialis','','Barbell'],
['Cable curl','Arms','biceps','brachialis','Cable'],
['Hammer curl','Arms','brachialis brachioradialis','biceps','Dumbbell'],
['Reverse curl','Arms','brachioradialis forearm_ext','brachialis biceps','Barbell'],
['Overhead tricep extension','Arms','triceps','','Dumbbell'],
['Tricep rope pushdown','Arms','triceps','','Cable'],
['Skull crusher','Arms','triceps','','Barbell'],
['Close-grip bench','Arms','triceps chest','delt_front chest_upper','Barbell'],
['Wrist curl','Arms','forearm_flex','','Dumbbell'],
['Wrist extension','Arms','forearm_ext','','Dumbbell'],
['Cable crunch','Core','abs','obliques','Cable'],
['Knee raise','Core','abs','obliques hip_flexors','Body only'],
['Hanging leg raise','Core','abs hip_flexors','obliques forearm_flex','Body only'],
['Lying leg raise','Core','abs hip_flexors','obliques','Body only'],
['Dead bug','Core','abs','obliques hip_flexors','Body only'],
['Russian twist','Core','obliques','abs','Body only'],
['Side plank','Core','obliques','abs glutes','Body only'],
['Pallof press','Core','obliques','abs','Cable'],
['Plank','Core','abs','obliques','Body only'],
['Ab wheel rollout','Core','abs','obliques lats serratus','Other'],
['Back squat','Legs','quads glutes','adductors lower_back','Barbell'],
['Front squat','Legs','quads','glutes adductors abs upper_back','Barbell'],
['Hack squat','Legs','quads','glutes adductors','Machine'],
['Leg press','Legs','quads glutes','adductors','Machine'],
['Bulgarian split squat','Legs','quads glutes','adductors hamstrings','Dumbbell'],
['Walking lunge','Legs','quads glutes','adductors hamstrings','Dumbbell'],
['Reverse lunge','Legs','glutes quads','hamstrings adductors','Dumbbell'],
['Barbell RDL','Legs','hamstrings glutes','lower_back adductors forearm_flex','Barbell'],
['Good morning','Legs','hamstrings lower_back','glutes','Barbell'],
['Hip thrust','Legs','glutes','hamstrings','Barbell'],
['Lying leg curl','Legs','hamstrings','calves','Machine'],
['Seated leg curl','Legs','hamstrings','','Machine'],
['Leg extension','Legs','quads','','Machine'],
['Adductor machine','Legs','adductors','','Machine'],
['Abductor machine','Legs','glutes','','Machine'],
['Standing calf raise','Legs','calves','','Machine'],
['Seated DB calf raise','Legs','calves','','Dumbbell'],
['Tibialis raise','Legs','tibialis','','Body only'],
['Cable hip flexion','Legs','hip_flexors','quads','Cable']
];
const DBX=window.EXERCISE_DB||[];
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const sp=s=>s?s.split(' '):[];
const BASE=RAW.map(([n,c,p,s,eq])=>({id:slug(n),name:n,cat:c,p:sp(p),s:sp(s),eq,staple:true}));
const BASEIDS=new Set(BASE.map(e=>e.id));
const LVL={B:'Beginner',I:'Intermediate',E:'Expert'};
const DBEX=[];(function(){const seen=new Set();DBX.forEach(([n,c,p,s,eq,l,how,img,nimg],ix)=>{const id='db-'+slug(n);if(BASEIDS.has(slug(n))||seen.has(id))return;seen.add(id);DBEX.push({id,name:n,cat:c,p:sp(p),s:sp(s),eq,lvl:LVL[l]||'',how,img,nimg:nimg||0,ix})})})();
/* exercise photos: 'files' reads images/exercises/<id>/<n>.jpg; 'chunks' reads packed JSON files (used inside Claude) */
const IMG_MODE=window.SMM_IMAGE_MODE||'files',IMG_DIR='images/exercises/',CHUNK=46,chunkP={};
const photoLabel=(i,n)=>i===0?'Start':i===n-1?'Finish':'Step '+(i+1);
/* full-size originals for the photo viewer (website only; inside Claude the packed photos are used) */
const HI_BASE='https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';
let lbState=null;
function lbShow(){
  const {e,urls,i}=lbState,img=document.getElementById('lbImg');
  img.src=urls[i];img.alt=e.name+', '+photoLabel(i,urls.length).toLowerCase()+' position';
  document.getElementById('lbCap').innerHTML=esc(e.name)+' <span>· '+photoLabel(i,urls.length)+' ('+(i+1)+' of '+urls.length+')</span>';
  const multi=urls.length>1;document.getElementById('lbPrev').hidden=!multi;document.getElementById('lbNext').hidden=!multi;
  if(IMG_MODE==='files'&&e.img){const want=i,hi=new Image();hi.onload=()=>{if(lbState&&lbState.e===e&&lbState.i===want)img.src=hi.src};hi.src=HI_BASE+e.img.split('/').map(encodeURIComponent).join('/')+'/'+i+'.jpg'}
}
function openLB(e,urls,i,from){
  if(!e||!urls||!urls.length)return;
  lbState={e,urls,i,from};document.getElementById('lb').hidden=false;document.body.style.overflow='hidden';lbShow();document.getElementById('lbClose').focus();
}
function closeLB(){
  if(!lbState)return;const from=lbState.from;lbState=null;document.getElementById('lb').hidden=true;document.body.style.overflow='';document.getElementById('lbImg').removeAttribute('src');
  if(from&&from.isConnected)from.focus();
}
function stepLB(d){if(!lbState)return;const n=lbState.urls.length;lbState.i=(lbState.i+d+n)%n;lbShow()}
function exImages(e){
  if(!e||!e.img||!e.nimg)return Promise.resolve([]);
  if(IMG_MODE==='chunks'){const k=Math.floor(e.ix/CHUNK);if(!chunkP[k])chunkP[k]=fetch('img/ex-'+k+'.json').then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).catch(()=>{delete chunkP[k];return{}});return chunkP[k].then(d=>d[e.img]||[])}
  return Promise.resolve(Array.from({length:e.nimg},(_,i)=>IMG_DIR+e.img.split('/').map(encodeURIComponent).join('/')+'/'+i+'.jpg'));
}
/* staples borrow photos and steps from their closest Free Exercise DB match */
const STAPLE_LINK={"Bench press":"Barbell Bench Press - Medium Grip","Incline bench press":"Barbell Incline Bench Press - Medium Grip","Incline DB press":"Incline Dumbbell Press","Flat DB press":"Dumbbell Bench Press","Machine chest press":"Leverage Chest Press","Cable flye":"Cable Crossover","Machine chest flye (pec deck)":"Butterfly","Low-to-high cable flye":"Low Cable Crossover","Dip":"Dips - Chest Version","Push-up":"Pushups","Lat pulldown (V-grip)":"V-Bar Pulldown","Lat pulldown (wide grip)":"Wide-Grip Lat Pulldown","Single-arm cable pulldown":"One Arm Lat Pulldown","Pull-up":"Pullups","Chin-up":"Chin-Up","Seated cable row (close grip)":"Seated Cable Rows","Seated cable row (wide bar)":"Seated Cable Rows","Seated row machine":"Leverage Iso Row","Chest-supported row":"Dumbbell Incline Row","Single-arm DB row":"One-Arm Dumbbell Row","Barbell row":"Bent Over Barbell Row","Yates row":"Reverse Grip Bent-Over Rows","T-bar row":"T-Bar Row with Handle","Straight-arm pulldown":"Straight-Arm Pulldown","Deadlift":"Barbell Deadlift","Back extension":"Hyperextensions (Back Extensions)","Overhead press":"Standing Military Press","Seated DB shoulder press":"Seated Dumbbell Press","Lateral raise":"Side Lateral Raise","Cable lateral raise":"Cable Seated Lateral Raise","Rear delt flye":"Seated Bent-Over Rear Delt Raise","Reverse pec deck":"Reverse Machine Flyes","Face pull":"Face Pull","Upright row":"Upright Barbell Row","Smith shrugs":"Barbell Shrug","DB shrugs":"Dumbbell Shrug","Farmer's carry":"Farmer's Walk","Barbell curl":"Barbell Curl","Incline DB curl":"Incline Dumbbell Curl","Preacher curl":"Preacher Curl","Cable curl":"Standing Biceps Cable Curl","Hammer curl":"Hammer Curls","Reverse curl":"Reverse Barbell Curl","Overhead tricep extension":"Standing Dumbbell Triceps Extension","Tricep rope pushdown":"Triceps Pushdown - Rope Attachment","Skull crusher":"EZ-Bar Skullcrusher","Close-grip bench":"Close-Grip Barbell Bench Press","Wrist curl":"Seated Dumbbell Palms-Up Wrist Curl","Wrist extension":"Seated Dumbbell Palms-Down Wrist Curl","Cable crunch":"Cable Crunch","Knee raise":"Knee/Hip Raise On Parallel Bars","Hanging leg raise":"Hanging Leg Raise","Dead bug":"Dead Bug","Russian twist":"Russian Twist","Side plank":"Side Bridge","Pallof press":"Pallof Press","Plank":"Plank","Ab wheel rollout":"Ab Roller","Back squat":"Barbell Full Squat","Front squat":"Front Barbell Squat","Hack squat":"Hack Squat","Leg press":"Leg Press","Bulgarian split squat":"Split Squat with Dumbbells","Walking lunge":"Dumbbell Lunges","Reverse lunge":"Dumbbell Rear Lunge","Barbell RDL":"Romanian Deadlift","Good morning":"Good Morning","Hip thrust":"Barbell Hip Thrust","Lying leg curl":"Lying Leg Curls","Seated leg curl":"Seated Leg Curl","Leg extension":"Leg Extensions","Adductor machine":"Thigh Adductor","Abductor machine":"Thigh Abductor","Standing calf raise":"Standing Calf Raises","Seated DB calf raise":"Dumbbell Seated One-Leg Calf Raise","Dumbbell pullover":"Straight-Arm Dumbbell Pullover","Lying leg raise":"Flat Bench Lying Leg Raise","Neck curl":"Lying Face Up Plate Neck Resistance","Neck extension":"Lying Face Down Plate Neck Resistance","Cable hip flexion":"Hip Flexion with Band"};
(function(){const byName={};DBX.forEach((r,ix)=>byName[r[0]]=ix);BASE.forEach(e=>{const ix=byName[STAPLE_LINK[e.name]];if(ix===undefined)return;const r=DBX[ix];e.ref=r[0];e.how=r[6];e.img=r[7];e.nimg=r[8]||0;e.ix=ix})})();
const EQS=['Barbell','Dumbbell','Cable','Machine','Body only','Kettlebell','Bands','Other'];
const DEFAULT=[
 ['Upper A',['Bench press','Lat pulldown (V-grip)','Machine chest flye (pec deck)','Seated cable row (wide bar)','Smith shrugs','Overhead tricep extension','Incline DB curl']],
 ['Lower A',['Barbell RDL','Leg press','Lying leg curl','Walking lunge','Seated DB calf raise','Cable crunch']],
 ['Cardio + Core',['Knee raise','Dead bug','Russian twist','Side plank']],
 ['Upper B',['Seated row machine','Incline DB press','Single-arm cable pulldown','Overhead press','Lateral raise','Tricep rope pushdown','Hammer curl']],
 ['Lower B',['Back squat','Bulgarian split squat','Lying leg curl','Leg extension','Standing calf raise']],
 ['Delts, Traps & Arms',['Lateral raise','Rear delt flye','Face pull','Dip','DB shrugs','Reverse curl','Wrist curl','Wrist extension']],
 ['Rest',[]]
];
const KEY='splitmap.v2',OLDKEY='splitmap.v1';
const uid=()=>'s'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const defaultDays=()=>DEFAULT.map(([n,l])=>({name:n,items:l.map(x=>({ex:slug(x),sets:2}))}));
const blankDays=()=>DAYS.map(()=>({name:'',items:[]}));
const DEFAULT_TARGET={min:10,max:20};
function fresh(custom){return{splits:[{id:uid(),name:'Split 1',days:defaultDays()}],active:0,view:'week',custom:custom||[],cmpA:0,cmpB:1,targets:{min:DEFAULT_TARGET.min,max:DEFAULT_TARGET.max,per:{}}}}
function load(){
  try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&Array.isArray(s.splits)&&s.splits.length)return s}catch(e){}
  try{const o=JSON.parse(localStorage.getItem(OLDKEY));if(o&&Array.isArray(o.days)&&o.days.length===7){const f=fresh(o.custom);f.splits[0].days=o.days;return f}}catch(e){}
  return null;
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
let state=load()||fresh();
if(!Array.isArray(state.custom))state.custom=[];
if(!state.targets||typeof state.targets!=='object')state.targets={min:DEFAULT_TARGET.min,max:DEFAULT_TARGET.max,per:{}};
if(!state.targets.per)state.targets.per={};
/* which muscles the spiderweb shows (hidden ids); the maps and tables always count every muscle */
if(!state.web||!Array.isArray(state.web.hide))state.web={hide:[]};
state.web.hide=state.web.hide.filter(id=>MBY[id]);
/* weekly set target for a muscle: its own override, else the global default */
function tgt(m){const o=state.targets.per[m];return{min:o&&o.min!=null?o.min:state.targets.min,max:o&&o.max!==undefined?o.max:state.targets.max,own:!!o}}
function tgtState(sets,t){return sets<t.min?'under':(t.max&&sets>t.max?'over':'in')}
const clampN=(v,lo,hi)=>{v=Math.round(+v);return isFinite(v)?Math.min(hi,Math.max(lo,v)):lo};
state.active=Math.min(Math.max(0,state.active|0),state.splits.length-1);
if(state.view==='compare'&&state.splits.length<2)state.view='week';
let ui={q:'',cat:'All',eq:'All',src:'all',info:null,limit:150,focus:null,preview:null,rax:(window.innerWidth<560)?'groups':'muscles',rmet:'sets'};
let EXM={};
function rebuildEx(){EXM={};BASE.concat(DBEX,state.custom).forEach(e=>EXM[e.id]=e)}
rebuildEx();
const allEx=()=>BASE.concat(DBEX,state.custom);
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>(Math.round(n*2)/2).toString();
const mnames=ids=>ids.map(i=>MBY[i]?MBY[i].name:i).join(', ');
const S=()=>state.splits[state.active];
const isCmp=()=>state.view==='compare';
const isDay=()=>typeof state.view==='number';
const curDay=()=>isDay()?S().days[state.view]:null;
const dayLabel=d=>d.name||(d.items.length?'Untitled':'Rest');
const daySets=d=>d.items.reduce((a,b)=>a+b.sets,0);

/* ---------- body diagrams (left half drawn, mirrored to the right) ---------- */
const SIL='M100 46 L92 46 L91 58 Q80 65 62 68 Q47 72 45 90 Q43 108 45 128 L43 160 Q37 196 34 230 Q31 246 38 258 Q46 262 48 250 Q47 240 48 232 Q56 200 64 166 L67 138 L70 122 Q72 154 74 186 Q66 202 66 224 Q64 266 72 318 Q69 330 74 342 Q68 368 78 400 Q72 414 80 422 L94 422 Q97 412 92 400 Q98 368 94 342 Q97 330 94 318 Q93 280 98 238 L100 238 Z';
const FRONT=[
 ['traps_upper','M92 53 Q86 63 66 68 Q80 72 90 70 Q94 64 94 55 Z'],
 ['brachialis','M51 110 Q45 128 46 152 Q48 158 53 157 Q50 136 56 116 Z'],
 ['biceps','M57 117 Q50 132 52 152 Q57 162 64 157 Q67 138 65 120 Q61 113 57 117 Z'],
 ['delt_side','M62 69 Q48 72 46 90 Q46 104 52 118 Q51 100 55 86 Q58 76 64 70 Z'],
 ['delt_front','M65 70 Q59 77 57 87 Q54 101 54 116 Q62 106 66 96 Q69 82 65 70 Z'],
 ['chest_upper','M99 72 Q84 70 70 73 Q66 84 68 94 Q84 91 99 94 Z'],
 ['chest','M99 96 Q84 93 68 96 Q66 108 71 117 Q86 127 99 124 Z'],
 ['brachioradialis','M45 160 Q53 158 57 164 Q47 194 41 230 L35 230 Q37 192 45 160 Z'],
 ['forearm_flex','M58 165 Q64 168 63 176 Q56 204 47 231 L42 231 Q48 196 58 165 Z'],
 ['obliques','M85 128 Q77 124 71 120 Q72 152 75 186 Q79 200 85 205 Z'],
 ['abs','M99 126 Q91 126 87 130 L87 196 Q92 206 99 211 Z'],
 ['quads','M69 222 Q64 262 72 316 Q82 326 92 318 Q89 290 88 264 Q87 242 91 233 Q81 226 69 222 Z'],
 ['adductors','M98 232 Q93 231 91 235 Q88 262 92 300 Q98 270 99 242 Z'],
 ['calves','M75 344 Q69 368 76 394 L80 394 Q78 368 83 345 Z M93 344 Q97 368 91 394 L88 394 Q90 368 88 346 Z'],
 ['tibialis','M84 345 Q88 346 88 352 Q87 372 86 394 L82 394 Q81 370 84 345 Z'],
 ['neck','M91 47 Q93 47 94 50 Q96 58 99 65 Q96 66 94 64 Q92 56 91 47 Z'],
 ['serratus','M70 112 L77 115 L72 118 L78 121 L72 124 L77 127 L71 129 Q68 120 70 112 Z'],
 ['hip_flexors','M87 208 Q81 212 76 220 Q83 225 90 231 Q90 220 87 208 Z']
];
const FRONT_DECO='M87 148 L113 148 M87 168 L113 168 M88 187 L112 187 M100 127 L100 209 M80 238 Q84 262 82 300';
const BACK=[
 ['triceps','M47 104 Q43 122 46 150 Q52 160 60 158 Q65 134 63 114 Q56 104 47 104 Z'],
 ['upper_back','M70 90 Q79 91 86 104 Q90 114 88 124 Q78 121 71 113 Q66 101 70 90 Z'],
 ['lats','M69 114 Q80 123 91 130 Q98 150 98 168 Q88 180 78 188 Q74 160 71 140 Q67 126 69 114 Z'],
 ['lower_back','M100 148 L100 206 Q93 209 87 205 Q85 182 89 162 Q94 151 100 148 Z'],
 ['traps_upper','M92 50 L100 52 L100 75 Q84 71 64 69 Q82 63 92 50 Z'],
 ['traps_mid','M100 77 Q82 73 66 71 Q76 88 88 110 Q96 130 100 148 Z'],
 ['delt_side','M62 69 Q48 72 46 90 Q46 104 52 118 Q51 100 55 86 Q58 76 64 70 Z'],
 ['delt_rear','M65 70 Q59 77 57 87 Q54 101 54 116 Q62 106 66 96 Q69 82 65 70 Z'],
 ['forearm_ext','M44 162 Q38 192 35 229 L46 231 Q55 198 63 166 Q53 158 44 162 Z'],
 ['glutes','M70 206 Q65 224 70 246 Q84 256 99 249 L99 212 Q86 202 70 206 Z'],
 ['hamstrings','M70 250 Q67 284 75 320 L93 320 Q98 286 98 254 Q84 260 70 250 Z'],
 ['calves','M74 336 Q66 360 76 388 Q82 396 88 388 Q98 360 93 336 Q84 330 74 336 Z'],
 ['neck','M92 44 Q96 45 99 45 L99 52 Q95 52 92 51 Z']
];
const BACK_DECO='M100 52 L100 206 M84 262 Q83 290 84 318 M84 340 L84 384';
const NS='http://www.w3.org/2000/svg';
function el(tag,attrs){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);return e}
function drawFig(svg,side){
  const shapes=side==='front'?FRONT:BACK,deco=side==='front'?FRONT_DECO:BACK_DECO;
  const mir='matrix(-1 0 0 1 200 0)';
  svg.appendChild(el('ellipse',{cx:100,cy:26,rx:15,ry:19,class:'skin'}));
  svg.appendChild(el('path',{d:SIL,class:'skin'}));
  svg.appendChild(el('path',{d:SIL,class:'skin',transform:mir}));
  shapes.forEach(([m,d])=>{[null,mir].forEach(t=>{const p=el('path',{d,class:'mus','data-m':m});if(t)p.setAttribute('transform',t);svg.appendChild(p)})});
  svg.appendChild(el('path',{d:deco,class:'deco'}));
  svg.appendChild(el('path',{d:deco,class:'deco',transform:mir}));
}
function colorFig(svg,lv,focus){
  svg.querySelectorAll('.mus').forEach(p=>{const m=p.getAttribute('data-m');p.setAttribute('class','mus'+(lv[m]?' '+lv[m]:'')+(focus===m?' focus':''))});
}
[['front','front'],['back','back'],['cA-front','front'],['cA-back','back'],['cB-front','front'],['cB-back','back']].forEach(([id,side])=>drawFig($(id),side));

/* ---------- stats ---------- */
function itemsStats(items){
  const r={};MUSCLES.forEach(m=>r[m.id]={p:0,s:0,exP:[],exS:[]});
  items.forEach(it=>{const e=EXM[it.ex];if(!e)return;
    e.p.forEach(m=>{if(r[m]){r[m].p+=it.sets;r[m].exP.push(e.name)}});
    e.s.forEach(m=>{if(r[m]){r[m].s+=it.sets;r[m].exS.push(e.name)}});});
  return r;
}
function weekStats(split){
  const r={};MUSCLES.forEach(m=>r[m.id]={days:0,dayList:[],helperList:[],direct:0,indirect:0,sets:0});
  split.days.forEach((d,i)=>{const s=itemsStats(d.items);
    MUSCLES.forEach(m=>{const x=s[m.id],w=r[m.id];
      if(x.p>0){w.days++;w.dayList.push(DAYS[i])}else if(x.s>0)w.helperList.push(DAYS[i]);
      w.direct+=x.p;w.indirect+=x.s;});});
  MUSCLES.forEach(m=>{const w=r[m.id];w.sets=w.direct+w.indirect/2});
  return r;
}
const wLevel=w=>w.days>=3?'w3':w.days===2?'w2':w.days===1?'w1':(w.indirect>0?'w0':'');
const weekLevels=ws=>{const lv={};MUSCLES.forEach(m=>lv[m.id]=wLevel(ws[m.id]));return lv};
const dayLevels=items=>{const s=itemsStats(items),lv={};MUSCLES.forEach(m=>{const x=s[m.id];lv[m.id]=x.p>0?'p':x.s>0?'s':''});return lv};
function wStatus(w){
  if(w.days>=2)return{cls:'ok',txt:w.days+'×/week'};
  if(w.days===1)return{cls:'warn',txt:'1×/week'};
  if(w.indirect>0)return{cls:'helper',txt:'Helper only'};
  return{cls:'bad',txt:'Missed'};
}
function coverCounts(ws){let ok=0,once=0,help=0,miss=0;MUSCLES.forEach(m=>{const w=ws[m.id];if(w.days>=2)ok++;else if(w.days===1)once++;else if(w.indirect>0)help++;else miss++;});return{ok,once,help,miss}}
const coverHTML=c=>'<span class="pill ok">'+c.ok+' trained 2×+</span><span class="pill warn">'+c.once+' trained 1×</span><span class="pill helper">'+c.help+' helper only</span><span class="pill bad">'+c.miss+' missed</span>';

/* ---------- spiderweb ---------- */
const RORDER=['chest_upper','chest','serratus','delt_front','delt_side','delt_rear','biceps','brachialis','brachioradialis','forearm_flex','forearm_ext','triceps','neck','traps_upper','traps_mid','upper_back','lats','lower_back','abs','obliques','hip_flexors','glutes','hamstrings','quads','adductors','calves','tibialis'];
const SHORT={chest_upper:'Upper chest',chest:'Chest',delt_front:'Front delts',delt_side:'Side delts',delt_rear:'Rear delts',biceps:'Biceps',brachialis:'Brachialis',brachioradialis:'Brachiorad.',forearm_flex:'Forearm flex.',forearm_ext:'Forearm ext.',triceps:'Triceps',traps_upper:'Upper traps',traps_mid:'Mid traps',upper_back:'Upper back',lats:'Lats',lower_back:'Lower back',abs:'Abs',obliques:'Obliques',glutes:'Glutes',hamstrings:'Hamstrings',quads:'Quads',adductors:'Adductors',calves:'Calves',serratus:'Serratus',neck:'Neck',hip_flexors:'Hip flexors',tibialis:'Tibialis'};
const RGROUPS=['Chest','Shoulders','Arms','Back','Core','Legs'];
const webOn=id=>!state.web.hide.includes(id);
const WEB_ICON='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M2 4h7M13 4h1M2 12h1M7 12h7"/><circle cx="11" cy="4" r="2"/><circle cx="5" cy="12" r="2"/></svg>';
const webMuscles=()=>RORDER.filter(webOn);
/* a group stays on the web while any of its muscles does; the Groups view needs 3 spokes, so it falls back to all 6 */
const webGroupsRaw=()=>RGROUPS.filter(g=>MUSCLES.some(m=>m.g===g&&webOn(m.id)));
const webGroups=()=>{const g=webGroupsRaw();return g.length>=3?g:RGROUPS};
const WEB_KEY=['chest_upper','chest','delt_front','delt_side','delt_rear','biceps','triceps','traps_upper','upper_back','lats','lower_back','abs','glutes','quads','hamstrings','calves'];
const WEB_PRESETS=[
  {id:'all',name:'All 27',show:()=>RORDER},
  {id:'key',name:'Key 16',show:()=>WEB_KEY},
  {id:'upper',name:'Upper body',show:()=>MUSCLES.filter(m=>['Chest','Shoulders','Back','Arms'].includes(m.g)).map(m=>m.id)},
  {id:'lower',name:'Lower body & core',show:()=>MUSCLES.filter(m=>['Core','Legs'].includes(m.g)).map(m=>m.id)}];
function webSet(show){const keep=new Set(show);state.web.hide=RORDER.filter(id=>!keep.has(id))}
function webPresetOn(p){const keep=new Set(p.show());return RORDER.every(id=>keep.has(id)===webOn(id))}
const webPdfNote=()=>{const n=state.web.hide.length;return n?' '+n+' muscle'+(n>1?'s are':' is')+' hidden from this web (body maps and tables include them).':''};
function webHiddenNote(){
  const nm=state.web.hide.length;if(!nm)return '';
  const gh=RGROUPS.length-webGroups().length;
  const txt=ui.rax==='groups'?(gh?gh+' group'+(gh>1?'s':'')+' hidden':''):nm+' muscle'+(nm>1?'s':'')+' hidden';
  return txt?'<span class="tgt-note">'+txt+' · <button class="linkbtn" type="button" data-wpre="all">Show all</button></span>':'';
}
function groupDay(items,g){let p=0,s=0;items.forEach(it=>{const e=EXM[it.ex];if(!e)return;
  if(e.p.some(m=>MBY[m]&&MBY[m].g===g))p+=it.sets;else if(e.s.some(m=>MBY[m]&&MBY[m].g===g))s+=it.sets;});return{p,s}}
/* axes for one split: week value by metric, optional day overlay value */
function radarAxes(split,dayItems,rax,rmet){
  const sets=rmet==='sets';
  if(rax==='muscles'){
    const ws=weekStats(split),ds=dayItems?itemsStats(dayItems):null;
    return webMuscles().map(id=>{const w=ws[id];return{key:id,label:SHORT[id],full:MBY[id].name,week:sets?w.sets:w.days,zero:w.days===0,
      day:ds?(ds[id].p+ds[id].s/2):null,info:fmt(w.sets)+' sets/week · main target '+w.days+'×'+(w.dayList.length?' ('+w.dayList.join(', ')+')':'')}});
  }
  return webGroups().map(g=>{let tot=0,days=0,dl=[];
    split.days.forEach((d,i)=>{const x=groupDay(d.items,g);tot+=x.p+x.s/2;if(x.p>0){days++;dl.push(DAYS[i])}});
    const dv=dayItems?groupDay(dayItems,g):null;
    return{key:g,label:g,full:g,week:sets?tot:days,zero:days===0,day:dv?dv.p+dv.s/2:null,info:fmt(tot)+' sets/week · trained '+days+'×'+(dl.length?' ('+dl.join(', ')+')':'')}});
}
/* series: [{vals:[], cls:'a'|'b'}] */
function drawRadar(svg,axes,series,opt){
  opt=opt||{};
  svg.innerHTML='';svg.classList.toggle('grp',opt.rax==='groups');svg.classList.toggle('few',opt.rax!=='groups'&&axes.length<=12);
  const W=600,H=470,cx=W/2,cy=H/2+4,R=opt.rax==='groups'?176:168,n=axes.length,sets=opt.rmet==='sets';
  const tg=opt.target||null;
  const max=Math.max(0,...series.flatMap(s=>s.vals.map(v=>v||0)),...(tg?tg.map(t=>t.min||0):[]));
  let step,top;
  if(sets){step=max<=8?2:max<=16?4:max<=30?5:10;top=Math.max(step,Math.ceil(max/step)*step)}
  else{step=1;top=Math.max(3,Math.ceil(max))}
  const ang=i=>-Math.PI/2+i*2*Math.PI/n;
  const pt=(i,v)=>{const r=R*(v||0)/top;return[cx+r*Math.cos(ang(i)),cy+r*Math.sin(ang(i))]};
  const poly=vals=>vals.map((v,i)=>pt(i,v).map(x=>x.toFixed(1)).join(',')).join(' ');
  for(let v=step;v<=top+1e-9;v+=step){
    svg.appendChild(el('polygon',{points:poly(axes.map(()=>v)),class:'r-ring'}));
    const [tx,ty]=pt(0,v);const t=el('text',{x:(tx+4).toFixed(1),y:(ty-3).toFixed(1),class:'r-tick'});t.textContent=fmt(v)+(v>=top-1e-9?(sets?' sets':' days'):'');svg.appendChild(t);
  }
  axes.forEach((a,i)=>{const [x,y]=pt(i,top);svg.appendChild(el('line',{x1:cx,y1:cy,x2:x.toFixed(1),y2:y.toFixed(1),class:'r-spoke'}))});
  if(tg){
    const hi=tg.map(t=>Math.min(t.max||t.min,top)),lo=tg.map(t=>Math.min(t.min,top));
    const ring=vals=>vals.map((v,i)=>pt(i,v).map(x=>x.toFixed(1)).join(' ')).join(' L');
    if(tg.some(t=>t.max&&t.max>t.min))svg.appendChild(el('path',{d:'M'+ring(hi)+' Z M'+ring(lo)+' Z','fill-rule':'evenodd',class:'r-tgt'}));
    svg.appendChild(el('polygon',{points:poly(lo),class:'r-tgt-line'}));
  }
  if(opt.focus){const i=axes.findIndex(a=>a.key===opt.focus);if(i>=0){const [x,y]=pt(i,top);svg.appendChild(el('line',{x1:cx,y1:cy,x2:x.toFixed(1),y2:y.toFixed(1),class:'r-focus'}))}}
  series.forEach(s=>svg.appendChild(el('polygon',{points:poly(s.vals),class:'r-'+s.cls})));
  series.forEach(s=>s.vals.forEach((v,i)=>{if(s.cls==='b'&&!(v>0)&&!opt.dotsAtZero)return;const [x,y]=pt(i,v);svg.appendChild(el('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:4,class:'r-dot '+s.cls}))}));
  axes.forEach((a,i)=>{
    const c=Math.cos(ang(i)),s=Math.sin(ang(i));const [lx,ly]=pt(i,top);const off=(opt.rax==='groups'?18:16)+(n>20?(Math.abs(c)<0.08?8:(Math.abs(c)<0.2&&i%2?13:0)):0);
    const x=lx+c*off,y=ly+s*off;
    const anchor=Math.abs(c)<0.08?'middle':(c>0?'start':'end');
    const z=opt.marks&&a.zero;
    const t=el('text',{x:x.toFixed(1),y:(y+(s>0.6?6:s<-0.6?-2:4)).toFixed(1),'text-anchor':anchor,class:'r-lab'+(z?' zero':'')});
    t.textContent=a.label+(z?' !':'');svg.appendChild(t);
    if(opt.hit){const a0=ang(i)-Math.PI/n,a1=ang(i)+Math.PI/n,RR=R+10;
      svg.appendChild(el('path',{d:'M'+cx+' '+cy+' L'+(cx+RR*Math.cos(a0)).toFixed(1)+' '+(cy+RR*Math.sin(a0)).toFixed(1)+' A'+RR+' '+RR+' 0 0 1 '+(cx+RR*Math.cos(a1)).toFixed(1)+' '+(cy+RR*Math.sin(a1)).toFixed(1)+' Z',class:'r-hit','data-ri':i}))}
  });
  svg._axes=axes;svg._series=series;
}
function syncRadarCtl(){
  document.querySelectorAll('[data-rax]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.rax===ui.rax));
  document.querySelectorAll('[data-rmet]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.rmet===ui.rmet));
  const grp=ui.rax==='groups',n=grp?webGroups().length:webMuscles().length,tot=grp?RGROUPS.length:RORDER.length;
  document.querySelectorAll('[data-webpick]').forEach(b=>{b.innerHTML=WEB_ICON+'<span>'+n+'/'+tot+'</span>';b.classList.toggle('on',n<tot);
    b.setAttribute('aria-label','Choose which '+(grp?'muscle groups':'muscles')+' the spiderweb shows. Showing '+n+' of '+tot+'.')});
}
function renderRadar(){
  syncRadarCtl();
  const day=curDay(),sets=ui.rmet==='sets',showDay=sets&&!!day;
  const axes=radarAxes(S(),day?day.items:null,ui.rax,ui.rmet);
  const series=[{vals:axes.map(a=>a.week),cls:'a',name:'Whole week'}];
  if(showDay)series.push({vals:axes.map(a=>a.day),cls:'b',name:DAYS[state.view]});
  const target=radarTarget(axes);
  drawRadar($('radar'),axes,series,{rax:ui.rax,rmet:ui.rmet,marks:true,hit:true,focus:ui.rax==='muscles'?ui.focus:null,target});
  $('rsub').textContent=(sets?'Weekly sets for each '+(ui.rax==='muscles'?'muscle':'muscle group')+'. Helpers count as half a set.':'Days per week each '+(ui.rax==='muscles'?'muscle':'group')+' is a main target.')+' A rounder web means a more balanced split. Spokes marked ! are never a main target.';
  $('rlegend').innerHTML=(showDay?'<span><i style="background:var(--s-a)"></i>Whole week</span><span><i style="background:var(--s-b)"></i>'+DAYS[state.view]+(day.name?' · '+esc(day.name):'')+'</span>':'')+targetLegend(target)+webHiddenNote();
  renderTargetCtl();
}
/* target band for the spiderweb: per-muscle sets, 2 days a week for frequency, none for group sets */
function radarTarget(axes){
  if(ui.rmet==='days')return axes.map(()=>({min:2,max:null}));
  if(ui.rax!=='muscles')return null;
  return axes.map(a=>tgt(a.key));
}
function targetLegend(target){
  if(!target)return ui.rmet==='sets'?'<span class="tgt-note">Set targets show in the Muscles view</span>':'';
  if(ui.rmet==='days')return '<span><i class="tgt-sw"></i>Target: main target 2× a week</span>';
  const own=Object.keys(state.targets.per).length;
  return '<span><i class="tgt-sw"></i>Target: '+state.targets.min+(state.targets.max?'–'+state.targets.max:'+')+' sets a week'+(own?' ('+own+' muscle'+(own>1?'s':'')+' custom)':'')+'</span>';
}
function renderTargetCtl(){
  const box=$('tgtCtl');if(!box)return;
  if(!box.childElementCount)box.innerHTML='<label for="tgtMin">Weekly set target</label><input class="num" id="tgtMin" type="number" min="0" max="60" step="1" aria-label="Minimum weekly sets"><span>to</span><input class="num" id="tgtMax" type="number" min="0" max="80" step="1" aria-label="Maximum weekly sets"><span>sets per muscle</span><button class="linkbtn" type="button" id="tgtResetAll" hidden></button>';
  const a=$('tgtMin'),b=$('tgtMax'),r=$('tgtResetAll'),own=Object.keys(state.targets.per).length;
  if(document.activeElement!==a)a.value=state.targets.min;
  if(document.activeElement!==b)b.value=state.targets.max==null?'':state.targets.max;
  r.hidden=!own;if(!r.dataset.armed)r.textContent='Reset '+own+' custom';
}

/* ---------- edit view render ---------- */
function renderTabs(){
  let h='';
  state.splits.forEach((s,i)=>{h+='<button class="tab" type="button" role="tab" data-split="'+i+'" aria-selected="'+(!isCmp()&&state.active===i)+'">'+esc(s.name||'Untitled split')+'</button>'});
  h+='<button class="tab add" type="button" id="newSplit" aria-haspopup="menu" aria-expanded="false">+ New split ▾</button><span class="tabspacer"></span>';
  h+='<button class="tab cmp" type="button" role="tab" id="cmpTab" aria-selected="'+isCmp()+'">Compare splits</button>';
  $('tabs').innerHTML=h;
}
function renderDays(){
  let h='';
  S().days.forEach((d,i)=>{const n=d.items.length;
    h+='<button class="day" type="button" data-view="'+i+'" aria-pressed="'+(state.view===i)+'"><b>'+DAYS[i]+'</b><span>'+esc(dayLabel(d))+'</span><span>'+(n?n+' exercise'+(n>1?'s':''):'No exercises')+'</span></button>';});
  h+='<button class="day week" type="button" data-view="week" aria-pressed="'+(state.view==='week')+'"><b>Week</b><span>All days</span><span>Frequency map</span></button>';
  $('days').innerHTML=h;
}
function renderCats(){
  const cats=CATS.concat(state.custom.length?['Custom']:[]);
  if(ui.cat!=='All'&&!cats.includes(ui.cat))ui.cat='All';
  const fc=$('fCat'),fe=$('fEq'),fs=$('fSrc');
  fc.innerHTML='<option value="All">All groups</option>'+cats.map(c=>'<option value="'+esc(c)+'">'+esc(c)+'</option>').join('');
  if(!fe.options.length)fe.innerHTML='<option value="All">All equipment</option>'+EQS.map(c=>'<option value="'+esc(c)+'">'+esc(c)+'</option>').join('');
  fc.value=ui.cat;fe.value=ui.eq;fs.value=ui.src;
  fc.classList.toggle('on',ui.cat!=='All');fe.classList.toggle('on',ui.eq!=='All');fs.classList.toggle('on',ui.src!=='all');
}
function renderLibrary(){
  const day=curDay();
  const inDay=new Set(day?day.items.map(i=>i.ex):[]);
  $('focusbar').innerHTML=ui.focus?'<div class="focusbar"><span>Exercises for '+esc(MBY[ui.focus].name)+'</span><button type="button" data-unfocus="1" aria-label="Clear muscle filter">✕</button></div>':'';
  const q=ui.q.trim().toLowerCase();
  const CI=c=>{const i=CATS.indexOf(c);return i<0?99:i};
  let list=allEx().filter(e=>{
    if(ui.src==='staple'&&!e.staple&&!e.custom)return false;
    if(ui.src==='db'&&(e.staple||e.custom))return false;
    if(ui.cat!=='All'&&(ui.cat==='Custom'?!e.custom:e.cat!==ui.cat))return false;
    if(ui.eq!=='All'&&(e.eq||'Other')!==ui.eq)return false;
    if(q&&!(e.name.toLowerCase().includes(q)||e.p.concat(e.s).some(m=>MBY[m]&&MBY[m].name.toLowerCase().includes(q))))return false;
    if(ui.focus&&!(e.p.includes(ui.focus)||e.s.includes(ui.focus)))return false;
    return true;});
  list.sort((a,b)=>{
    if(ui.focus){const d=b.p.includes(ui.focus)-a.p.includes(ui.focus);if(d)return d}
    else{const d=(a.custom?100:CI(a.cat))-(b.custom?100:CI(b.cat));if(d)return d}
    const st=(b.staple?1:0)-(a.staple?1:0);if(st)return st;
    return a.name.localeCompare(b.name)});
  const total=list.length,shown=list.slice(0,ui.limit);
  $('libHint').textContent=total+(day?' · adding to '+DAYS[state.view]:' found');
  let h='',last=null;
  shown.forEach(e=>{
    const g=ui.focus?(e.p.includes(ui.focus)?'Main target':'Helps'):(e.custom?'Custom':e.cat);
    if(g!==last){h+='<div class="grp-h">'+esc(g)+'</div>';last=g}
    const on=inDay.has(e.id),open=ui.info===e.id;
    h+='<div class="ex"><button class="ex-add" type="button" data-ex="'+e.id+'" aria-pressed="'+on+'"><span class="tick" aria-hidden="true">✓</span><span class="ex-txt"><span class="ex-name">'+esc(e.name)+'</span><span class="ex-mus"><em>'+esc(mnames(e.p))+'</em>'+(e.s.length?' · '+esc(mnames(e.s)):'')+'</span></span></button>'+
      ((e.how||e.nimg)?'<button class="ex-info" type="button" data-info="'+e.id+'" aria-expanded="'+open+'" aria-label="How to do '+esc(e.name)+'">i</button>':'')+
      (e.custom?'<button class="ex-del" type="button" data-delc="'+e.id+'" aria-label="Delete '+esc(e.name)+'">✕</button>':'')+'</div>';
    if(open)h+='<div class="ex-how">'+(e.nimg?'<div class="ex-imgs" data-img-for="'+e.id+'">'+'<div class="ph-img"></div>'.repeat(Math.min(2,e.nimg))+'</div>':'')+(e.how?'<ol>'+e.how.split('\n').map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol>':'')+'<p>'+esc([e.staple?'Staple':'',e.lvl,e.eq,(e.ref&&e.ref.toLowerCase()!==e.name.toLowerCase())?'Photos and steps: '+e.ref:'',e.nimg?'Tap a photo to enlarge':''].filter(Boolean).join(' · '))+'</p></div>';});
  if(total>shown.length)h+='<button class="btn small more" type="button" id="moreEx">Show '+Math.min(150,total-shown.length)+' more of '+(total-shown.length)+'</button>';
  $('exlist').innerHTML=h||'<p class="empty">No exercises match. Try another search, or add your own below.</p>';
  const box=$('exlist').querySelector('[data-img-for]');
  if(box){const e=EXM[box.dataset.imgFor];exImages(e).then(urls=>{if(!box.isConnected)return;
    if(!urls.length){box.remove();return}
    box._urls=urls;
    box.innerHTML=urls.map((u,i)=>'<figure><button class="ex-img-btn" type="button" data-lb="'+i+'" aria-label="Enlarge '+esc(e.name)+' '+esc(photoLabel(i,urls.length).toLowerCase())+' photo"><img src="'+esc(u)+'" alt="'+esc(e.name)+', '+esc(photoLabel(i,urls.length).toLowerCase())+' position" loading="lazy"></button><figcaption>'+photoLabel(i,urls.length)+'</figcaption></figure>').join('');
    box.querySelectorAll('img').forEach(im=>im.addEventListener('error',()=>{const f=im.closest('figure');if(f)f.remove();if(!box.querySelector('img'))box.remove()}));});}
}
let cur={};
function renderMap(ws){
  let lv,mode,s;
  if(ui.preview&&EXM[ui.preview]){const e=EXM[ui.preview];lv={};e.s.forEach(m=>lv[m]='s');e.p.forEach(m=>lv[m]='p');mode='preview'}
  else if(isDay()){s=itemsStats(curDay().items);lv=dayLevels(curDay().items);mode='day'}
  else{lv=weekLevels(ws);mode='week'}
  cur={lv,mode,ws,s};
  colorFig($('front'),lv,ui.focus);colorFig($('back'),lv,ui.focus);
  let t,leg;
  if(mode==='preview')t='Preview<small>'+esc(EXM[ui.preview].name)+'</small>';
  else if(mode==='day'){const d=curDay();t=DAYS[state.view]+'<small>'+esc(dayLabel(d))+' · '+d.items.length+' exercises · '+daySets(d)+' sets</small>'}
  else t='Whole week<small>How many days each muscle is a main target</small>';
  if(mode==='week')leg='<span><i style="background:var(--w0)"></i>Helper only</span><span><i style="background:var(--w1)"></i>1×</span><span><i style="background:var(--w2)"></i>2×</span><span><i style="background:var(--w3)"></i>3×+</span><span><i style="background:var(--muscle)"></i>Missed</span>';
  else leg='<span><i style="background:var(--hit)"></i>Main target</span><span><i style="background:var(--hit-2)"></i>Helper</span><span><i style="background:var(--muscle)"></i>Not hit</span>';
  $('capT').innerHTML=t;$('legend').innerHTML=leg;
}
function renderDayPanel(){
  const P=$('dayPanel');
  if(isDay()){
    const d=curDay(),i=state.view;
    let h='<div class="dayhead"><input class="dayname" id="dayname-'+state.active+'-'+i+'" value="'+esc(d.name)+'" placeholder="Name this day" aria-label="Name for '+DAYS_LONG[i]+'" maxlength="40"><button class="btn small" type="button" id="clearDay">Clear day</button></div>';
    if(!d.items.length)h+='<p class="empty">No exercises on '+DAYS_LONG[i]+' yet. Tap exercises in the library to add them, or leave it as a rest day.</p>';
    else{h+='<div class="items">';d.items.forEach((it,k)=>{const e=EXM[it.ex];if(!e)return;
      h+='<div class="item"><div style="min-width:0"><div class="nm">'+esc(e.name)+'</div><div class="mm">'+esc(mnames(e.p))+(e.s.length?' · helpers: '+esc(mnames(e.s)):'')+'</div></div>'+
      '<div class="step"><button type="button" data-sets="'+k+'" data-d="-1" aria-label="Fewer sets">−</button><span>'+it.sets+' set'+(it.sets>1?'s':'')+'</span><button type="button" data-sets="'+k+'" data-d="1" aria-label="More sets">+</button></div>'+
      '<button class="rm" type="button" data-rm="'+k+'" aria-label="Remove '+esc(e.name)+'">✕</button></div>';});h+='</div>';}
    P.innerHTML=h;
  }else{
    let h='<div class="dayhead"><h2>The week</h2><p class="hint">Tap a day to edit it</p></div><div class="tblwrap"><table class="wk"><thead><tr><th>Day</th><th>Session</th><th class="n">Sets</th></tr></thead><tbody>';
    S().days.forEach((d,i)=>{
      h+='<tr class="go" data-view="'+i+'" tabindex="0"><td class="d">'+DAYS[i]+'</td><td>'+esc(dayLabel(d))+'<div class="hint">'+(d.items.length?esc(d.items.map(x=>EXM[x.ex]?EXM[x.ex].name:'').filter(Boolean).join(' · ')):'Rest')+'</div></td><td class="n">'+daySets(d)+'</td></tr>';});
    const tot=S().days.reduce((a,d)=>a+daySets(d),0);
    h+='</tbody><tfoot><tr><td></td><td><b>Total</b></td><td class="n"><b>'+tot+'</b></td></tr></tfoot></table></div>';
    P.innerHTML=h;
  }
}
/* expanded detail card for the selected muscle */
function suggestFor(m){
  const pick=allEx().filter(e=>e.p.includes(m));
  pick.sort((a,b)=>(b.staple?1:0)-(a.staple?1:0)||(a.p.length-b.p.length)||a.name.localeCompare(b.name));
  return pick.slice(0,3);
}
function revealCard(){requestAnimationFrame(()=>{const c=document.querySelector('#muslist .mcard'),box=document.getElementById('muslist');if(!c||!box)return;
  const cr=c.getBoundingClientRect(),br=box.getBoundingClientRect();
  const top=Math.max(br.top,0),bottom=Math.min(br.bottom,innerHeight);
  if(cr.top>=top&&cr.bottom<=bottom)return;
  const want=cr.bottom>bottom?Math.min(cr.bottom-bottom+8,cr.top-top-8):cr.top-top-8;
  const room=box.scrollHeight-box.clientHeight-box.scrollTop;
  if(box.scrollHeight>box.clientHeight&&(want<0?box.scrollTop>0:room>0)){const d=want<0?Math.max(want,-box.scrollTop):Math.min(want,room);box.scrollBy({top:d,behavior:'smooth'});if(Math.abs(d)>=Math.abs(want))return}
  c.scrollIntoView({block:'nearest',behavior:'smooth'})})}
function muscleCard(m,mode,ws,s,lv){
  const w=ws[m.id],st=wStatus(w),day=curDay();
  const pillCls=mode==='day'?(s[m.id].p>0?'is-main':s[m.id].s>0?'is-help':'none'):st.cls;
  const pillTxt=mode==='day'?(s[m.id].p>0?'Main':s[m.id].s>0?'Helper':'Not trained'):st.txt;
  const valCls={ok:'ok',warn:'warn',bad:'bad',helper:'muted'}[st.cls];
  const weekVal=w.days?w.days+'× · '+fmt(w.sets)+' sets':(w.indirect>0?'Helper · '+fmt(w.sets)+' sets':'Missed');
  let stats='';
  if(mode==='day'){const x=s[m.id],v=x.p||x.s?fmt(x.p+x.s/2)+' sets':'None';
    stats='<div class="mc-stat"><span class="k">'+DAYS_LONG[state.view]+'</span><span class="v">'+v+'</span></div>';}
  else stats='<div class="mc-stat"><span class="k">Main target on</span><span class="v">'+(w.dayList.length?w.dayList.join(', '):'No days')+'</span></div>';
  stats+='<div class="mc-stat"><span class="k">This week</span><span class="v '+valCls+'">'+weekVal+'</span></div>';
  const t=tgt(m.id),ts=tgtState(w.sets,t),cap=Math.max(t.max||t.min,w.sets,1)*1.1;
  const tmsg=ts==='under'?fmt(t.min-w.sets)+' short of '+t.min:ts==='over'?fmt(w.sets-t.max)+' over '+t.max:'In range';
  const tgtRow='<div class="mc-tgt"><div class="mc-tgt-top"><span class="mc-k">Weekly set target</span><span class="mc-tgt-msg '+ts+'">'+fmt(w.sets)+' sets · '+tmsg+'</span></div>'+
    '<div class="tbar" role="img" aria-label="'+fmt(w.sets)+' of '+t.min+(t.max?' to '+t.max:'')+' sets"><span class="tband" style="left:'+(t.min/cap*100).toFixed(1)+'%;width:'+(((t.max||t.min)-t.min)/cap*100).toFixed(1)+'%"></span><span class="tfill '+ts+'" style="width:'+Math.min(100,w.sets/cap*100).toFixed(1)+'%"></span><span class="tmark" style="left:'+(t.min/cap*100).toFixed(1)+'%"></span></div>'+
    '<div class="mc-tgt-edit"><input class="num" type="number" min="0" max="60" step="1" value="'+t.min+'" data-tmin="'+m.id+'" aria-label="Minimum weekly sets for '+esc(m.name)+'"><span>to</span><input class="num" type="number" min="0" max="80" step="1" value="'+(t.max||'')+'" data-tmax="'+m.id+'" aria-label="Maximum weekly sets for '+esc(m.name)+'"><span>sets</span>'+(t.own?'<button class="linkbtn" type="button" data-treset="'+m.id+'">Use default</button>':'<span class="mc-tgt-def">default</span>')+'</div></div>';
  // who trains it
  let rows=[];
  if(mode==='day'){day.items.forEach(it=>{const e=EXM[it.ex];if(!e)return;const main=e.p.includes(m.id),help=e.s.includes(m.id);if(main||help)rows.push({main,name:e.name,n:it.sets+' set'+(it.sets>1?'s':'')+(main?'':', counts as '+fmt(it.sets/2))})})}
  else{const agg={};S().days.forEach((d,i)=>d.items.forEach(it=>{const e=EXM[it.ex];if(!e)return;const main=e.p.includes(m.id),help=e.s.includes(m.id);if(!main&&!help)return;
      const k=e.id;agg[k]=agg[k]||{main,name:e.name,days:[],sets:0};agg[k].days.push(DAYS[i]);agg[k].sets+=it.sets}));
    rows=Object.values(agg).sort((a,b)=>(b.main-a.main)||b.sets-a.sets).map(r=>({main:r.main,name:r.name,n:r.days.join(', ')+' · '+r.sets+' sets'}))}
  let list='';
  if(rows.length)list='<div class="mc-ex"><span class="mc-k">Trained by</span>'+rows.map(r=>'<div class="mc-row"><span class="tag '+(r.main?'main':'help')+'">'+(r.main?'Main':'Helper')+'</span><span class="nm">'+esc(r.name)+'</span><span class="n">'+esc(r.n)+'</span></div>').join('')+'</div>';
  const needs=mode==='day'?!(s[m.id].p>0):w.days===0;
  if(needs){const sug=suggestFor(m.id);
    if(sug.length){list+='<div class="mc-ex"><span class="mc-k">'+(mode==='day'?'Add one to '+DAYS_LONG[state.view]:'Exercises that train it')+'</span>'+sug.map(e=>'<div class="mc-row"><span class="nm">'+esc(e.name)+'</span>'+(mode==='day'?'<button class="mc-add" type="button" data-ex="'+e.id+'">+ Add</button>':'<span class="n">'+esc(e.eq||'')+'</span>')+'</div>').join('')+(mode==='day'?'':'<p class="mc-note">Pick a day to add one.</p>')+'</div>'}}
  else if(!rows.length)list='<p class="mc-note">Nothing trains it'+(mode==='day'?' on '+DAYS_LONG[state.view]:' this week')+'.</p>';
  const count=allEx().filter(e=>e.p.includes(m.id)||e.s.includes(m.id)).length;
  return '<div class="mcard" role="region" aria-label="'+esc(m.name)+' details">'+
    '<div class="mc-head"><span class="sw '+(lv[m.id]||'')+'"></span><b>'+m.name+'</b><span class="pill '+pillCls+'">'+pillTxt+'</span><button class="mc-x" type="button" data-focus="'+m.id+'" aria-label="Close '+esc(m.name)+' details">✕</button></div>'+
    '<div class="mc-sci">'+esc(m.sci)+'</div><div class="mc-stats">'+stats+'</div>'+tgtRow+list+
    '<div class="mc-foot">Exercise list filtered to <b>'+esc(m.name.toLowerCase())+'</b> · '+count+' exercise'+(count===1?'':'s')+'</div></div>';
}
function renderMuscles(ws){
  const {mode,s,lv}=cur;
  let h='';
  if(mode==='week'){
    const missed=MUSCLES.filter(m=>ws[m.id].days===0);
    $('musHint').textContent='per week';
    const under=MUSCLES.filter(m=>tgtState(ws[m.id].sets,tgt(m.id))==='under').length;
    h+='<p class="summary">'+(missed.length?'<b>'+missed.length+'</b> muscle'+(missed.length>1?'s are':' is')+' never a main target':'Every muscle is a main target at least once a week')+(under?', and <b>'+under+'</b> '+(under>1?'are':'is')+' below '+(under>1?'their':'its')+' weekly set target':'')+'. Tap a muscle for details.</p>';
  }else if(mode==='day'){
    const p=MUSCLES.filter(m=>s[m.id].p>0).length,hs=MUSCLES.filter(m=>s[m.id].p===0&&s[m.id].s>0).length;
    $('musHint').textContent=DAYS[state.view];
    h+='<p class="summary"><b>'+p+'</b> main targets and <b>'+hs+'</b> helpers on '+DAYS_LONG[state.view]+'.</p>';
  }else{$('musHint').textContent='preview';h+='<p class="summary">Showing what '+esc(EXM[ui.preview].name)+' works.</p>'}
  MG.forEach(g=>{
    h+='<div class="mgroup"><h3>'+g+'</h3>';
    MUSCLES.filter(m=>m.g===g).forEach(m=>{
      const open=ui.focus===m.id;let pill='',sets='',det='';
      if(open&&mode!=='preview'){h+=muscleCard(m,mode,ws,s,lv);return}
      let tip=m.name+' ('+m.sci+')';
      if(mode==='week'){const w=ws[m.id],st=wStatus(w);pill='<span class="pill '+st.cls+'">'+(st.cls==='ok'||st.cls==='warn'?w.days+'×':st.cls==='helper'?'Helper':'Missed')+'</span>';sets=fmt(w.sets)+' sets';tip+=': '+st.txt+', '+sets+' a week';
        det=(w.dayList.length?'Main target on <b>'+w.dayList.join(', ')+'</b>. ':'')+(w.helperList.length?'Helper on '+w.helperList.join(', ')+'. ':'')+'Sets count helpers as half. ';}
      else if(mode==='day'){const x=s[m.id];
        pill=x.p>0?'<span class="pill is-main">Main</span>':x.s>0?'<span class="pill is-help">Helper</span>':'<span class="pill none">—</span>';
        sets=(x.p||x.s)?fmt(x.p+x.s/2)+' sets':'';tip+=': '+(x.p>0?'main target':x.s>0?'helper':'not trained')+(sets?', '+sets:'');
        det=(x.exP.length?'Main: <b>'+esc(x.exP.join(', '))+'</b>. ':'')+(x.exS.length?'Helper: '+esc(x.exS.join(', '))+'. ':'')+((x.p||x.s)?'':'Not trained on '+DAYS_LONG[state.view]+'. ');}
      else{const l=lv[m.id];pill=l==='p'?'<span class="pill is-main">Main</span>':l==='s'?'<span class="pill is-help">Helper</span>':'<span class="pill none">—</span>';}
      h+='<button class="mrow" type="button" data-focus="'+m.id+'" aria-expanded="'+open+'" title="'+esc(tip)+'"><span class="sw '+(lv[m.id]||'')+'"></span><span class="mn">'+m.name.replace('Brachioradialis','Brachio\u00ADradialis')+'</span>'+pill+'</button>';
    });
    h+='</div>';});
  $('muslist').innerHTML=h;
}
function renderCustomForm(){
  const box=$('cmus');if(box.childElementCount)return;
  box.innerHTML=MUSCLES.map(m=>'<button type="button" class="mt" data-mt="'+m.id+'" data-state="">'+m.name+'</button>').join('');
}

/* ---------- compare view ---------- */
function clampCmp(){
  const n=state.splits.length;
  state.cmpA=Math.min(Math.max(0,state.cmpA|0),n-1);state.cmpB=Math.min(Math.max(0,state.cmpB|0),n-1);
  if(state.cmpA===state.cmpB&&n>1)state.cmpB=state.cmpA===0?1:0;
}
function renderCompare(){
  clampCmp();
  const A=state.splits[state.cmpA],B=state.splits[state.cmpB];
  const opts=sel=>state.splits.map((s,i)=>'<option value="'+i+'"'+(i===sel?' selected':'')+'>'+esc(s.name||'Untitled split')+'</option>').join('');
  $('cmpA').innerHTML=opts(state.cmpA);$('cmpB').innerHTML=opts(state.cmpB);
  const wa=weekStats(A),wb=weekStats(B);
  $('cANm').textContent=A.name||'Untitled split';$('cBNm').textContent=B.name||'Untitled split';
  $('cACov').innerHTML=coverHTML(coverCounts(wa));$('cBCov').innerHTML=coverHTML(coverCounts(wb));
  const la=weekLevels(wa),lb=weekLevels(wb);
  colorFig($('cA-front'),la);colorFig($('cA-back'),la);colorFig($('cB-front'),lb);colorFig($('cB-back'),lb);
  syncRadarCtl();
  const ax=radarAxes(A,null,ui.rax,ui.rmet),bx=radarAxes(B,null,ui.rax,ui.rmet);
  drawRadar($('cmpRadar'),ax,[{vals:ax.map(a=>a.week),cls:'a',name:A.name,info:ax.map(a=>a.info)},{vals:bx.map(a=>a.week),cls:'b',name:B.name,info:bx.map(a=>a.info),}],{rax:ui.rax,rmet:ui.rmet,hit:true,dotsAtZero:true,target:radarTarget(ax)});
  $('crsub').textContent=(ui.rmet==='sets'?'Weekly sets per '+(ui.rax==='muscles'?'muscle':'muscle group')+', helpers count as half.':'Days per week as main target.')+' Where one web reaches further, that split trains it more.';
  $('crlegend').innerHTML='<span><i style="background:var(--s-a)"></i>'+esc(A.name||'Untitled split')+'</span><span><i style="background:var(--s-b)"></i>'+esc(B.name||'Untitled split')+'</span>'+targetLegend(radarTarget(ax))+webHiddenNote();
  let h='<table class="wk"><thead><tr><th>Muscle</th><th>'+esc(A.name||'A')+'</th><th class="n">Sets</th><th>'+esc(B.name||'B')+'</th><th class="n">Sets</th><th class="n">Change</th></tr></thead><tbody>';
  MG.forEach(g=>{h+='<tr class="gh"><td colspan="6">'+g+'</td></tr>';
    MUSCLES.filter(m=>m.g===g).forEach(m=>{const a=wa[m.id],b=wb[m.id],sa=wStatus(a),sb=wStatus(b),d=b.sets-a.sets;
      const dc=d>0?'up':d<0?'down':'same',dt=d>0?'+'+fmt(d):d<0?'−'+fmt(-d):'same';
      h+='<tr><td>'+m.name+'</td><td><span class="pill '+sa.cls+'">'+sa.txt+'</span></td><td class="n">'+fmt(a.sets)+'</td><td><span class="pill '+sb.cls+'">'+sb.txt+'</span></td><td class="n">'+fmt(b.sets)+'</td><td class="n"><span class="delta '+dc+'">'+dt+'</span></td></tr>';});});
  const ta=A.days.reduce((x,d)=>x+daySets(d),0),tb=B.days.reduce((x,d)=>x+daySets(d),0);
  h+='</tbody><tfoot><tr><td><b>Total working sets</b></td><td></td><td class="n"><b>'+ta+'</b></td><td></td><td class="n"><b>'+tb+'</b></td><td class="n"><span class="delta '+(tb>ta?'up':tb<ta?'down':'same')+'">'+(tb>ta?'+'+(tb-ta):tb<ta?'−'+(ta-tb):'same')+'</span></td></tr></tfoot></table>';
  $('cmpTable').innerHTML=h;
}

/* ---------- top-level render ---------- */
function render(){
  renderTabs();
  const cmp=isCmp();
  $('editView').hidden=cmp;$('cmpView').hidden=!cmp;
  if(cmp){renderCompare();return}
  const ws=weekStats(S());
  const nm=$('splitName');if(document.activeElement!==nm)nm.value=S().name;
  $('delSplit').disabled=state.splits.length<2;
  $('cover').innerHTML='<span class="lbl">Week coverage</span>'+coverHTML(coverCounts(ws));
  renderDays();renderCats();renderLibrary();renderMap(ws);renderRadar();renderDayPanel();renderMuscles(ws);renderCustomForm();
}
function light(){const ws=weekStats(S());renderMap(ws);renderMuscles(ws)}

/* ---------- interactions ---------- */
let toastT;
function toast(msg){const t=$('toast');t.textContent=msg;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>t.hidden=true,2800)}
function setView(v){state.view=v==='week'?'week':+v;ui.preview=null;save();render()}
const TEMPLATES=[{"id":"ul-arms","name":"Upper/Lower + Arms","desc":"5 days · chest, back and legs 2×, plus a delts, traps and arms day","sets":2,"days":"DEFAULT"},{"id":"ppl","name":"Push / Pull / Legs","desc":"6 days · every muscle twice a week","sets":3,"days":[["Push A",["Bench press","Overhead press","Incline DB press","Lateral raise","Tricep rope pushdown","Overhead tricep extension"]],["Pull A",["Pull-up","Barbell row","Seated cable row (close grip)","Face pull","Barbell curl","Hammer curl"]],["Legs A",["Back squat","Barbell RDL","Leg press","Lying leg curl","Standing calf raise","Cable crunch"]],["Push B",["Incline bench press","Seated DB shoulder press","Machine chest flye (pec deck)","Cable lateral raise","Dip","Skull crusher"]],["Pull B",["Lat pulldown (wide grip)","Chest-supported row","Single-arm DB row","Rear delt flye","Incline DB curl","DB shrugs"]],["Legs B",["Front squat","Hip thrust","Bulgarian split squat","Seated leg curl","Leg extension","Seated DB calf raise","Hanging leg raise"]],["Rest",[]]]},{"id":"ul","name":"Upper / Lower","desc":"4 days · upper and lower body twice a week","sets":3,"days":[["Upper A",["Bench press","Barbell row","Overhead press","Lat pulldown (V-grip)","Lateral raise","Barbell curl","Tricep rope pushdown"]],["Lower A",["Back squat","Barbell RDL","Leg press","Lying leg curl","Standing calf raise","Plank"]],["Rest",[]],["Upper B",["Incline DB press","Pull-up","Seated DB shoulder press","Seated cable row (close grip)","Face pull","Hammer curl","Overhead tricep extension"]],["Lower B",["Deadlift","Bulgarian split squat","Hip thrust","Leg extension","Seated leg curl","Seated DB calf raise","Hanging leg raise"]],["Rest",[]],["Rest",[]]]},{"id":"fb","name":"Full body","desc":"3 days · whole body every session","sets":3,"days":[["Full body A",["Back squat","Bench press","Barbell row","Lateral raise","Barbell curl","Plank"]],["Rest",[]],["Full body B",["Deadlift","Overhead press","Pull-up","Walking lunge","Tricep rope pushdown","Cable crunch"]],["Rest",[]],["Full body C",["Front squat","Incline DB press","Seated cable row (close grip)","Lying leg curl","Face pull","Standing calf raise"]],["Rest",[]],["Rest",[]]]},{"id":"arnold","name":"Arnold split","desc":"6 days · chest + back, shoulders + arms, legs, each twice","sets":3,"days":[["Chest & Back",["Bench press","Pull-up","Incline DB press","Barbell row","Cable flye","Lat pulldown (wide grip)"]],["Shoulders & Arms",["Overhead press","Lateral raise","Rear delt flye","Barbell curl","Skull crusher","Hammer curl","Overhead tricep extension"]],["Legs",["Back squat","Barbell RDL","Leg press","Lying leg curl","Standing calf raise","Hanging leg raise"]],["Chest & Back",["Incline bench press","Chin-up","Flat DB press","T-bar row","Machine chest flye (pec deck)","Seated cable row (close grip)"]],["Shoulders & Arms",["Seated DB shoulder press","Cable lateral raise","Face pull","Incline DB curl","Tricep rope pushdown","Preacher curl","Dip"]],["Legs",["Front squat","Hip thrust","Bulgarian split squat","Seated leg curl","Leg extension","Seated DB calf raise","Cable crunch"]],["Rest",[]]]}];
function templateDays(t){const src=t.days==='DEFAULT'?DEFAULT:t.days;return src.map(([n,l])=>({name:n,items:l.filter(x=>EXM[slug(x)]).map(x=>({ex:slug(x),sets:t.days==='DEFAULT'?2:(t.sets||3)}))}))}
function uniqueName(base){const names=new Set(state.splits.map(s=>s.name));if(!names.has(base))return base;let n=2;while(names.has(base+' '+n))n++;return base+' '+n}
function addSplit(name,days,msg){state.splits.push({id:uid(),name:uniqueName(name),days});state.active=state.splits.length-1;state.view=days.some(d=>d.items.length)?'week':0;ui.focus=null;ui.preview=null;save();render();toast(msg)}
let menuOpener=null,menuY=0;
function showMenu(btn,html,label,o){
  o=o||{};const m=$('newMenu');m.innerHTML=html;m.setAttribute('aria-label',label||'Menu');
  m.setAttribute('role',o.role||'menu');m.className='menu'+(o.cls?' '+o.cls:'');
  m.style.maxHeight='';m.hidden=false;const r=btn.getBoundingClientRect(),w=Math.min(o.width||320,innerWidth-24);
  m.style.width=w+'px';m.style.left=Math.max(12,Math.min(o.alignRight?r.right-w:r.left,innerWidth-w-12))+'px';
  const h=m.offsetHeight,below=innerHeight-r.bottom-18,above=r.top-18;
  const bx=o.beside&&o.beside.getBoundingClientRect();
  if(bx&&bx.left-w-16>=12){/* sit beside the chart so changes stay visible */
    m.style.left=(bx.left-w-16)+'px';const top=Math.max(12,Math.min(r.top,innerHeight-12-h));m.style.top=top+'px';
    if(h>innerHeight-24)m.style.maxHeight=(innerHeight-24)+'px';}
  else if(h>below&&below<240&&above>below){m.style.top=Math.max(12,r.top-6-h)+'px';if(h>above)m.style.maxHeight=above+'px'}
  else{m.style.top=(r.bottom+6)+'px';if(h>below)m.style.maxHeight=Math.max(160,below)+'px'}
  menuOpener=btn;menuY=scrollY;btn.setAttribute('aria-expanded','true');const f=m.querySelector(o.focus||'.mi');if(f)f.focus();
}
/* spiderweb spokes picker */
function webPanelHTML(){
  const n=webMuscles().length,g=webGroupsRaw().length;
  let h='<div class="wp-head"><b>Spokes on the spiderweb</b><span>Choose what the web shows. Body maps, cards and tables still count every muscle.</span></div>';
  h+='<div class="wp-pre" role="group" aria-label="Presets">'+WEB_PRESETS.map(p=>'<button type="button" data-wpre="'+p.id+'" aria-pressed="'+webPresetOn(p)+'">'+p.name+'</button>').join('')+'</div>';
  MG.forEach(gr=>{const ms=MUSCLES.filter(m=>m.g===gr),on=ms.filter(m=>webOn(m.id)).length;
    h+='<div class="wp-g"><button type="button" class="wp-gt" role="checkbox" data-wg="'+gr+'" aria-checked="'+(on===ms.length?'true':on?'mixed':'false')+'"><i class="ck"></i>'+gr+'<span class="n">'+on+'/'+ms.length+'</span></button><div class="wp-ms">'+
      ms.map(m=>'<button type="button" class="wp-m" data-wm="'+m.id+'" aria-pressed="'+webOn(m.id)+'">'+esc(SHORT[m.id])+'</button>').join('')+'</div></div>';});
  h+='<div class="wp-foot">'+n+' of '+RORDER.length+' muscles · Groups view: '+(g>=3?g+' of 6 groups':'needs 3 groups, so it shows all 6')+'</div>';
  return h;
}
function openWebPanel(btn){showMenu(btn,webPanelHTML(),'Spiderweb spokes',{role:'dialog',cls:'wp',width:380,alignRight:true,focus:'[data-wpre]',beside:btn.closest('.radar').querySelector('.rbox')})}
function webChanged(focusSel){
  save();isCmp()?renderCompare():renderRadar();
  const m=$('newMenu');if(!m.hidden&&m.classList.contains('wp')){m.innerHTML=webPanelHTML();const f=focusSel&&m.querySelector(focusSel);if(f)f.focus()}
}
function webToggle(ids,on){
  const next=new Set(state.web.hide);ids.forEach(id=>on?next.delete(id):next.add(id));
  if(RORDER.length-next.size<3){toast('Keep at least 3 muscles on the web.');return false}
  state.web.hide=RORDER.filter(id=>next.has(id));return true;
}
function openMenu(btn){
  showMenu(btn,'<button class="mi" type="button" role="menuitem" data-tpl="blank"><b>Blank split</b><span>Start from an empty week</span></button><div class="mh">Templates</div>'+
    TEMPLATES.map(t=>'<button class="mi" type="button" role="menuitem" data-tpl="'+t.id+'"><b>'+esc(t.name)+'</b><span>'+esc(t.desc)+'</span></button>').join(''),'New split');
}
function openShareMenu(btn){
  showMenu(btn,'<button class="mi" type="button" role="menuitem" data-act="link"><b>Copy share link</b><span>Anyone with the link can add this split to their own</span></button>'+
    '<button class="mi" type="button" role="menuitem" data-act="exp1"><b>Export this split</b><span>Save it as a .json file</span></button>'+
    '<button class="mi" type="button" role="menuitem" data-act="expall"><b>Export all splits</b><span>Every split, as one .json file</span></button>'+
    '<div class="mh">Import</div><button class="mi" type="button" role="menuitem" data-act="import"><b>Import from file</b><span>Add splits from a .json file you exported</span></button>','Share');
}
function closeMenu(){const m=$('newMenu');if(m.hidden)return;m.hidden=true;if(menuOpener&&menuOpener.isConnected)menuOpener.setAttribute('aria-expanded','false');menuOpener=null}
function nextSplitName(){let n=state.splits.length+1;const names=new Set(state.splits.map(s=>s.name));while(names.has('Split '+n))n++;return 'Split '+n}
function arm(btn,label,fn){
  if(btn.dataset.armed){delete btn.dataset.armed;btn.classList.remove('armed');fn();return}
  const orig=btn.textContent;btn.dataset.armed='1';btn.classList.add('armed');btn.textContent=label;
  setTimeout(()=>{if(btn.isConnected&&btn.dataset.armed){delete btn.dataset.armed;btn.classList.remove('armed');btn.textContent=orig}},3000);
}
document.addEventListener('pointerdown',ev=>{const m=$('newMenu');if(!m.hidden&&!m.contains(ev.target)&&!(menuOpener&&menuOpener.contains(ev.target)))closeMenu()});
addEventListener('resize',closeMenu);addEventListener('scroll',()=>{if(menuOpener&&Math.abs(scrollY-menuY)>40)closeMenu()},{passive:true});
document.addEventListener('keydown',ev=>{const m=$('newMenu');if(m.hidden)return;
  if(ev.key==='Escape'){const o=menuOpener;closeMenu();if(o)o.focus()}
  else if((ev.key==='ArrowDown'||ev.key==='ArrowUp')&&m.querySelector('.mi')){ev.preventDefault();const it=[...m.querySelectorAll('.mi')];const k=it.indexOf(document.activeElement);it[(k+(ev.key==='ArrowDown'?1:-1)+it.length)%it.length].focus()}});
document.addEventListener('click',ev=>{
  const t=ev.target.closest('button,tr.go,.mus,.r-hit');if(!t)return;
  if(t.classList.contains('r-hit')){
    if(t.closest('#cmpRadar'))return;
    const a=$('radar')._axes[+t.dataset.ri];
    if(ui.rax==='muscles'){ui.focus=ui.focus===a.key?null:a.key;if(ui.focus)ui.cat='All'}
    else{ui.focus=null;ui.cat=a.key==='Shoulders'?'Shoulders & traps':a.key}
    render();return}
  if(t.classList.contains('mus')){
    if(t.closest('svg').dataset.who!=='main')return;
    const m=t.getAttribute('data-m');ui.focus=ui.focus===m?null:m;if(ui.focus)ui.cat='All';render();revealCard();return}
  if(t.dataset.split!==undefined){state.active=+t.dataset.split;if(isCmp())state.view='week';ui.focus=null;ui.preview=null;save();render();return}
  if(t.id==='newSplit'){menuOpener===t&&!$('newMenu').hidden?closeMenu():openMenu(t);return}
  if(t.dataset.webpick!==undefined){menuOpener===t&&!$('newMenu').hidden?closeMenu():openWebPanel(t);return}
  if(t.dataset.wpre){const p=WEB_PRESETS.find(x=>x.id===t.dataset.wpre);if(p){webSet(p.show());webChanged('[data-wpre="'+p.id+'"]')}return}
  if(t.dataset.wg){const ids=MUSCLES.filter(m=>m.g===t.dataset.wg).map(m=>m.id);if(webToggle(ids,!ids.every(webOn)))webChanged('[data-wg="'+t.dataset.wg+'"]');return}
  if(t.dataset.wm){if(webToggle([t.dataset.wm],!webOn(t.dataset.wm)))webChanged('[data-wm="'+t.dataset.wm+'"]');return}
  if(t.id==='shareBtn'){menuOpener===t&&!$('newMenu').hidden?closeMenu():openShareMenu(t);return}
  if(t.dataset.act){closeMenu();const a=t.dataset.act;
    if(a==='link')copyShareLink();else if(a==='exp1')exportJSON([S()]);else if(a==='expall')exportJSON(state.splits);else if(a==='import')$('importFile').click();return}
  if(t.id==='shareAdd'){acceptShared();return}
  if(t.id==='shareDismiss'){pendingShare=null;clearShareHash();renderShareBanner();return}
  if(t.id==='linkCopy'){const i=$('linkInput');try{navigator.clipboard.writeText(i.value).then(()=>toast('Link copied.'),()=>{i.select();toast('Press Ctrl+C or Cmd+C to copy.')})}catch(e){i.select()}return}
  if(t.id==='linkClose'){$('linkDlg').hidden=true;return}
  if(t.dataset.tpl){closeMenu();if(isCmp())state.view='week';
    if(t.dataset.tpl==='blank'){addSplit(nextSplitName(),blankDays(),'New empty split. Pick a day and tick exercises.');state.view=0;save();render();return}
    const tp=TEMPLATES.find(x=>x.id===t.dataset.tpl);if(tp)addSplit(tp.name,templateDays(tp),'Added '+tp.name+'. Change anything you like.');return}
  if(t.id==='cmpTab'){if(state.splits.length<2){toast('Make a second split first, then compare them.');return}
    state.cmpA=state.active===0?1:0;state.cmpB=state.active;if(state.cmpA>state.cmpB){const x=state.cmpA;state.cmpA=state.cmpB;state.cmpB=x}state.view='compare';tip.hidden=true;save();render();return}
  if(t.id==='dupSplit'){const s=S();state.splits.push({id:uid(),name:(s.name||'Split')+' copy',days:JSON.parse(JSON.stringify(s.days))});state.active=state.splits.length-1;save();render();toast('Duplicated. Change this copy and compare it to the original.');return}
  if(t.id==='delSplit'){if(state.splits.length<2)return;arm(t,'Tap again to delete',()=>{state.splits.splice(state.active,1);state.active=Math.max(0,state.active-1);clampCmp();save();render()});return}
  if(t.dataset.view!==undefined){setView(t.dataset.view);return}
  if(t.dataset.rax){ui.rax=t.dataset.rax;isCmp()?renderCompare():renderRadar();return}
  if(t.dataset.rmet){ui.rmet=t.dataset.rmet;isCmp()?renderCompare():renderRadar();return}
  if(t.dataset.cat){ui.cat=t.dataset.cat;ui.limit=150;renderCats();renderLibrary();return}
  if(t.dataset.eq){ui.eq=t.dataset.eq;ui.limit=150;renderCats();renderLibrary();return}
  if(t.dataset.src){ui.src=t.dataset.src;ui.limit=150;renderCats();renderLibrary();return}
  if(t.dataset.info){ui.info=ui.info===t.dataset.info?null:t.dataset.info;renderLibrary();return}
  if(t.id==='moreEx'){ui.limit+=150;renderLibrary();return}
  if(t.dataset.unfocus){ui.focus=null;render();return}
  if(t.dataset.ex){
    const day=curDay();
    if(!day){toast('Pick a day first, then tap exercises to add them.');return}
    const k=day.items.findIndex(i=>i.ex===t.dataset.ex);
    if(k>=0)day.items.splice(k,1);else day.items.push({ex:t.dataset.ex,sets:2});
    ui.preview=null;save();render();return}
  if(t.dataset.delc){const id=t.dataset.delc;state.custom=state.custom.filter(c=>c.id!==id);state.splits.forEach(s=>s.days.forEach(d=>d.items=d.items.filter(i=>i.ex!==id)));rebuildEx();save();render();return}
  if(t.dataset.sets!==undefined){const it=curDay().items[+t.dataset.sets];it.sets=Math.max(1,Math.min(10,it.sets+(+t.dataset.d)));save();render();return}
  if(t.dataset.rm!==undefined){curDay().items.splice(+t.dataset.rm,1);save();render();return}
  if(t.dataset.focus){ui.focus=ui.focus===t.dataset.focus?null:t.dataset.focus;if(ui.focus)ui.cat='All';render();revealCard();return}
  if(t.dataset.mt){const order=['','main','help'];t.dataset.state=order[(order.indexOf(t.dataset.state)+1)%3];return}
  if(t.id==='clearDay'){arm(t,'Tap again to clear',()=>{curDay().items=[];save();render()});return}
  if(t.id==='pdfBtn'){exportPDF();return}
  if(t.id==='tgtResetAll'){arm(t,'Tap again to reset',()=>{state.targets.per={};save();render()});return}
  if(t.dataset.treset){delete state.targets.per[t.dataset.treset];save();render();return}
  if(t.dataset.lb!==undefined){const box=t.closest('[data-img-for]');if(box&&box._urls)openLB(EXM[box.dataset.imgFor],box._urls,+t.dataset.lb,t);return}
});
document.addEventListener('keydown',ev=>{if(ev.key==='Enter'){const r=ev.target.closest&&ev.target.closest('tr.go');if(r)setView(r.dataset.view)}});
document.addEventListener('keydown',ev=>{if(!lbState)return;
  if(ev.key==='Escape'){ev.preventDefault();closeLB()}
  else if(ev.key==='ArrowRight'){ev.preventDefault();stepLB(1)}
  else if(ev.key==='ArrowLeft'){ev.preventDefault();stepLB(-1)}
  else if(ev.key==='Tab'){const f=[...document.querySelectorAll('#lb button:not([hidden])')];const k=f.indexOf(document.activeElement);ev.preventDefault();f[(k+(ev.shiftKey?-1:1)+f.length)%f.length].focus()}});
document.getElementById('lb').addEventListener('click',ev=>{
  const id=ev.target.id;
  if(id==='lbClose'||ev.target===ev.currentTarget)closeLB();
  else if(id==='lbPrev')stepLB(-1);
  else if(id==='lbNext')stepLB(1);
  ev.stopPropagation();});
(function(){let x0=null;const lbEl=document.getElementById('lb');
  lbEl.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});
  lbEl.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>50)stepLB(dx<0?1:-1);x0=null});})();
$('q').addEventListener('input',e=>{ui.q=e.target.value;ui.limit=150;renderLibrary()});
document.addEventListener('focusout',e=>{if(e.target.closest&&e.target.closest('.mc-tgt-edit'))setTimeout(()=>{const f=document.activeElement;if(!(f&&f.closest&&f.closest('.mc-tgt-edit')))renderMuscles(weekStats(S()))},0)});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.id==='tgtMin'||t.id==='tgtMax'){
    let mn=clampN($('tgtMin').value,0,60),mx=$('tgtMax').value===''?null:clampN($('tgtMax').value,0,80);
    if(mx!==null&&mx<mn)mx=mn;state.targets.min=mn;state.targets.max=mx;save();render();return}
  if(t.dataset.tmin||t.dataset.tmax){
    const m=t.dataset.tmin||t.dataset.tmax,card=t.closest('.mcard');
    const a=card.querySelector('[data-tmin]'),b=card.querySelector('[data-tmax]');
    let mn=clampN(a.value,0,60),mx=b.value===''?null:clampN(b.value,0,80);if(mx!==null&&mx<mn)mx=mn;
    if(mn===state.targets.min&&mx===state.targets.max)delete state.targets.per[m];else state.targets.per[m]={min:mn,max:mx};
    save();setTimeout(()=>{const f=document.activeElement;if(f&&f.closest&&f.closest('.mc-tgt-edit')){isCmp()?renderCompare():renderRadar()}else render()},0);return}
});
$('fCat').addEventListener('change',e=>{ui.cat=e.target.value;ui.limit=150;renderCats();renderLibrary()});
$('fEq').addEventListener('change',e=>{ui.eq=e.target.value;ui.limit=150;renderCats();renderLibrary()});
$('fSrc').addEventListener('change',e=>{ui.src=e.target.value;ui.limit=150;renderCats();renderLibrary()});
$('splitName').addEventListener('input',e=>{S().name=e.target.value;save();renderTabs()});
$('splitName').addEventListener('blur',e=>{if(!S().name.trim()){S().name=nextSplitName();e.target.value=S().name;save();renderTabs()}});
document.addEventListener('input',e=>{if(e.target.classList.contains('dayname')&&isDay()){curDay().name=e.target.value;save();renderDays();renderMap(weekStats(S()));renderRadar()}});
$('cmpA').addEventListener('change',e=>{state.cmpA=+e.target.value;if(state.cmpA===state.cmpB)state.cmpB=state.cmpA===0?1:0;save();renderCompare()});
$('cmpB').addEventListener('change',e=>{state.cmpB=+e.target.value;if(state.cmpA===state.cmpB)state.cmpA=state.cmpB===0?1:0;save();renderCompare()});
/* hover preview */
const lib=$('exlist');
lib.addEventListener('pointerover',e=>{const b=e.target.closest('.ex-add');if(!b||e.pointerType==='touch')return;if(ui.preview!==b.dataset.ex){ui.preview=b.dataset.ex;light()}});
lib.addEventListener('pointerleave',()=>{if(ui.preview){ui.preview=null;light()}});
lib.addEventListener('focusin',e=>{const b=e.target.closest('.ex-add');if(b){ui.preview=b.dataset.ex;light()}});
lib.addEventListener('focusout',()=>{if(ui.preview){ui.preview=null;light()}});
/* tooltips */
const tip=$('tip');
function placeTip(e,html){tip.innerHTML=html;tip.hidden=false;const r=tip.getBoundingClientRect();let x=e.clientX+14,y=e.clientY+14;
  if(x+r.width>innerWidth-8)x=e.clientX-r.width-14;if(y+r.height>innerHeight-8)y=e.clientY-r.height-14;tip.style.left=x+'px';tip.style.top=y+'px'}
function figTip(who,m){
  const M=MBY[m];let line='';
  if(who==='a'||who==='b'){const sp=state.splits[who==='a'?state.cmpA:state.cmpB],w=weekStats(sp)[m];line=wStatus(w).txt+' · '+fmt(w.sets)+' sets/week'}
  else if(cur.mode==='week'){const w=cur.ws[m];line=wStatus(w).txt+' · '+fmt(w.sets)+' sets/week'}
  else if(cur.mode==='day'){const x=cur.s[m];line=x.p>0?'Main target · '+fmt(x.p+x.s/2)+' sets':x.s>0?'Helper · '+fmt(x.s/2)+' sets':'Not trained this day'}
  else line=cur.lv[m]==='p'?'Main target':cur.lv[m]==='s'?'Helper':'Not worked';
  return '<b>'+M.name+'</b><span>'+esc(M.sci)+'</span><span>'+line+'</span>';
}
document.querySelectorAll('svg[data-who]').forEach(svg=>{
  svg.addEventListener('pointermove',e=>{const p=e.target.closest('.mus');if(!p){tip.hidden=true;return}placeTip(e,figTip(svg.dataset.who,p.getAttribute('data-m')))});
  svg.addEventListener('pointerleave',()=>tip.hidden=true);
});
[$('radar'),$('cmpRadar')].forEach(rsvg=>{
  rsvg.addEventListener('pointermove',e=>{const h=e.target.closest('.r-hit');if(!h){tip.hidden=true;return}
    const i=+h.dataset.ri,a=rsvg._axes[i];let html='<b>'+esc(a.full)+'</b>';
    if(rsvg.id==='cmpRadar'){rsvg._series.forEach(s=>{html+='<span>'+esc(s.name||'')+': '+esc(s.info[i])+'</span>'})}
    else{const t=ui.rax==='muscles'&&ui.rmet==='sets'?tgt(a.key):null;html+='<span>'+esc(a.info)+'</span>'+(t?'<span>Target '+t.min+(t.max?'–'+t.max:'+')+' sets</span>':'')+((a.day!==null&&isDay())?'<span>'+DAYS[state.view]+': '+fmt(a.day)+' sets</span>':'')+'<span>Tap to find exercises</span>'}
    placeTip(e,html)});
  rsvg.addEventListener('pointerleave',()=>tip.hidden=true);
});
/* custom exercise */
$('cform').addEventListener('submit',e=>{
  e.preventDefault();
  const name=$('cname').value.trim();
  const p=[],s=[];document.querySelectorAll('#cmus .mt').forEach(b=>{if(b.dataset.state==='main')p.push(b.dataset.mt);else if(b.dataset.state==='help')s.push(b.dataset.mt)});
  if(!name){toast('Give the exercise a name.');return}
  if(!p.length){toast('Pick at least one main target muscle.');return}
  let id='c-'+slug(name);while(EXM[id])id+='-2';
  state.custom.push({id,name,cat:'Custom',custom:true,p,s});rebuildEx();
  $('cname').value='';document.querySelectorAll('#cmus .mt').forEach(b=>b.dataset.state='');
  ui.cat='Custom';save();render();toast('Saved '+name+'.');
});

/* ---------- PDF export ---------- */
const PF={p:'#c2263a',s:'#f2a7b0',w0:'#f6d9dd',w1:'#f0a3ad',w2:'#df5d70',w3:'#b0122a'};
function printify(svg){
  const grp=svg.classList.contains('grp'),FONT='Helvetica, Arial, sans-serif';
  const set=(e,o)=>{for(const k in o)e.setAttribute(k,o[k])};
  svg.querySelectorAll('.r-hit,.r-focus').forEach(e=>e.remove());
  svg.querySelectorAll('*').forEach(e=>{
    const cl=(e.getAttribute('class')||'').split(/\s+/),has=c=>cl.includes(c);
    if(has('skin'))set(e,{fill:'#dfe4e9'});
    if(has('mus')){let f='#c3ccd5';for(const k in PF)if(has(k))f=PF[k];set(e,{fill:f,stroke:'#ffffff','stroke-width':1,'stroke-linejoin':'round'})}
    if(has('deco'))set(e,{fill:'none',stroke:'#ffffff','stroke-width':1,opacity:.8});
    if(has('r-ring'))set(e,{fill:'none',stroke:'#d6dce2','stroke-width':1});
    if(has('r-spoke'))set(e,{stroke:'#d6dce2','stroke-width':1});
    if(has('r-tick'))set(e,{fill:'#5b6874','font-size':grp?14:10,'font-family':FONT});
    if(has('r-lab'))set(e,{fill:has('zero')?'#16202a':'#5b6874','font-size':grp?19:svg.classList.contains('few')?15:11.5,'font-weight':has('zero')?800:600,'font-family':FONT});
    if(has('r-a'))set(e,{fill:'#c2263a','fill-opacity':.16,stroke:'#c2263a','stroke-width':2,'stroke-linejoin':'round'});
    if(has('r-b'))set(e,{fill:'#2f63b5','fill-opacity':.12,stroke:'#2f63b5','stroke-width':2,'stroke-linejoin':'round'});
    if(has('r-dot'))set(e,{fill:has('b')?'#2f63b5':'#c2263a',stroke:'#ffffff','stroke-width':2});
    if(has('r-tgt'))set(e,{fill:'#1f7a4d','fill-opacity':.09,stroke:'none'});
    if(has('r-tgt-line'))set(e,{fill:'none',stroke:'#1f7a4d','stroke-width':1.5,'stroke-dasharray':'5 4'});
    e.removeAttribute('class');
  });
  svg.removeAttribute('class');
  return svg;
}
function svgPng(svg,wmm,hmm){
  return new Promise((res,rej)=>{
    const c=svg.cloneNode(true);printify(c);c.setAttribute('xmlns',NS);
    const W=Math.round(wmm*8),H=Math.round(hmm*8);c.setAttribute('width',W);c.setAttribute('height',H);
    const img=new Image();
    img.onload=()=>{const cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d');g.fillStyle='#ffffff';g.fillRect(0,0,W,H);g.drawImage(img,0,0,W,H);try{res(cv.toDataURL('image/jpeg',0.9))}catch(e){rej(e)}};
    img.onerror=()=>rej(new Error('image'));
    img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(c));
  });
}
function figSvg(side,lv){const s=el('svg',{viewBox:'0 0 200 432'});drawFig(s,side);colorFig(s,lv);return s}
function radarSvg(axes,series,rax,rmet,marks){const s=el('svg',{viewBox:'0 0 600 470'});drawRadar(s,axes,series,{rax,rmet,marks,dotsAtZero:series.length>1,target:axes.map(a=>tgt(a.key))});return s}
const INK=[22,32,42],MUTED=[91,104,116],RED=[194,38,58],BLUE=[47,99,181];
const FIG_R=432/200,RAD_R=470/600;
function pdfHeader(doc,sub){
  doc.setFont('helvetica','bold');doc.setFontSize(22);doc.setTextColor(...INK);doc.text('SPLIT MUSCLE MAP',14,19);
  doc.setFont('helvetica','normal');doc.setFontSize(10.5);doc.setTextColor(...MUTED);doc.text(sub,14,25.5);
  doc.setDrawColor(214,220,226);doc.setLineWidth(.3);doc.line(14,29,196,29);
}
function pdfLabel(doc,txt,x,y){doc.setFont('helvetica','bold');doc.setFontSize(8.5);doc.setTextColor(...MUTED);doc.text(txt.toUpperCase(),x,y,{charSpace:.4})}
function coverText(c){return c.ok+' trained 2x+  ·  '+c.once+' trained 1x  ·  '+c.help+' helper only  ·  '+c.miss+' missed'}
function weekLegend(doc,x,y){
  [['3x+ a week',PF.w3],['2x',PF.w2],['1x',PF.w1],['Helper only',PF.w0],['Missed','#c3ccd5']].forEach(([t,c],i)=>{
    doc.setFillColor(c);doc.rect(x,y+i*6-3,4,4,'F');doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(...INK);doc.text(t,x+6,y+i*6)});
}
function statusRGB(cls){return cls==='ok'?[31,122,77]:cls==='warn'?[154,91,0]:cls==='bad'?[163,24,44]:MUTED}
const today=()=>new Date().toLocaleDateString(undefined,{day:'numeric',month:'long',year:'numeric'});
async function pdfSplit(split){
  const {jsPDF}=window.jspdf;const doc=new jsPDF({unit:'mm',format:'a4'});
  const ws=weekStats(split),cc=coverCounts(ws);
  const total=split.days.reduce((a,d)=>a+daySets(d),0);
  pdfHeader(doc,(split.name||'Untitled split')+'  ·  '+total+' working sets a week  ·  '+today());
  pdfLabel(doc,'Week coverage',14,36);doc.setFont('helvetica','normal');doc.setFontSize(10);doc.setTextColor(...INK);doc.text(coverText(cc),14,41.5);
  pdfLabel(doc,'Whole week: days each muscle is a main target',14,51);
  const fw=46,fh=fw*FIG_R,lv=weekLevels(ws);
  const [f1,f2]=await Promise.all([svgPng(figSvg('front',lv),fw,fh),svgPng(figSvg('back',lv),fw,fh)]);
  doc.addImage(f1,'JPEG',22,55,fw,fh);doc.addImage(f2,'JPEG',74,55,fw,fh);
  doc.setFont('helvetica','bold');doc.setFontSize(8);doc.setTextColor(...MUTED);doc.text('FRONT',22+fw/2,55+fh+4,{align:'center'});doc.text('BACK',74+fw/2,55+fh+4,{align:'center'});
  weekLegend(doc,138,70);
  const ry=55+fh+12;pdfLabel(doc,'Spiderweb: weekly sets per muscle (helpers count as half). Dashed line = set target',14,ry);
  const rw=150,rh=rw*RAD_R,ax=radarAxes(split,null,'muscles','sets');
  const r1=await svgPng(radarSvg(ax,[{vals:ax.map(a=>a.week),cls:'a'}],'muscles','sets',true),rw,rh);
  doc.addImage(r1,'JPEG',30,ry+3,rw,rh);
  doc.setFont('helvetica','normal');doc.setFontSize(8.5);doc.setTextColor(...MUTED);doc.text('Spokes marked ! are never a main target.'+webPdfNote(),14,ry+rh+6);
  // day by day
  doc.addPage();pdfHeader(doc,(split.name||'Untitled split')+'  ·  Day by day');
  doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(...MUTED);
  doc.setFillColor(PF.p);doc.rect(14,33,4,4,'F');doc.text('Main target',20,36.2);doc.setFillColor(PF.s);doc.rect(44,33,4,4,'F');doc.text('Helper',50,36.2);
  let y=44;const mw=17,mh=mw*FIG_R;
  for(let i=0;i<7;i++){
    const d=split.days[i];
    if(!d.items.length){
      if(y+10>285){doc.addPage();y=18}
      doc.setFont('helvetica','bold');doc.setFontSize(12);doc.setTextColor(...INK);doc.text(DAYS[i].toUpperCase(),14,y+4);
      doc.setFont('helvetica','normal');doc.setFontSize(10);doc.setTextColor(...MUTED);doc.text(dayLabel(d),30,y+4);
      y+=11;continue}
    const need=Math.max(mh+10,16+d.items.length*8.2);
    if(y+need>287){doc.addPage();y=18}
    const lv=dayLevels(d.items);
    const [a,b]=await Promise.all([svgPng(figSvg('front',lv),mw,mh),svgPng(figSvg('back',lv),mw,mh)]);
    doc.addImage(a,'JPEG',14,y+6,mw,mh);doc.addImage(b,'JPEG',14+mw+1,y+6,mw,mh);
    doc.setFont('helvetica','bold');doc.setFontSize(12);doc.setTextColor(...INK);doc.text(DAYS[i].toUpperCase(),14,y+4);
    doc.setFont('helvetica','normal');doc.setFontSize(10);doc.setTextColor(...MUTED);doc.text(dayLabel(d)+'  ·  '+d.items.length+' exercises  ·  '+daySets(d)+' sets',30,y+4);
    doc.autoTable({startY:y+7,margin:{left:52,right:14},theme:'plain',styles:{fontSize:8.5,cellPadding:{top:1.2,bottom:1.2,left:1.5,right:1.5},textColor:INK,lineColor:[214,220,226],lineWidth:{bottom:.2}},
      headStyles:{fontStyle:'bold',textColor:MUTED,fontSize:7.5},columnStyles:{0:{cellWidth:52,fontStyle:'bold'},1:{cellWidth:10,halign:'center'},3:{textColor:MUTED}},
      head:[['Exercise','Sets','Main target','Helpers']],
      body:d.items.filter(it=>EXM[it.ex]).map(it=>{const e=EXM[it.ex];return[e.name,String(it.sets),mnames(e.p),mnames(e.s)||'-']})});
    y=Math.max(y+6+mh,doc.lastAutoTable.finalY)+7;
  }
  // muscle coverage table
  doc.addPage();pdfHeader(doc,(split.name||'Untitled split')+'  ·  Muscle coverage');
  const rows=[];MG.forEach(g=>MUSCLES.filter(m=>m.g===g).forEach(m=>{const w=ws[m.id],st=wStatus(w),t=tgt(m.id);rows.push([g,m.name,w.dayList.join(', ')||'-',String(w.days),fmt(w.sets),t.min+(t.max?'-'+t.max:'+'),st.txt.replace('×','x'),st.cls,tgtState(w.sets,t)])}));
  doc.autoTable({startY:34,margin:{left:14,right:14},theme:'striped',styles:{fontSize:9,textColor:INK,cellPadding:2},headStyles:{fillColor:INK,textColor:[255,255,255],fontStyle:'bold'},alternateRowStyles:{fillColor:[245,247,249]},
    head:[['Group','Muscle','Main target on','Days/wk','Sets/wk','Target','Status']],body:rows.map(r=>r.slice(0,7)),
    columnStyles:{3:{halign:'right'},4:{halign:'right'},5:{halign:'right'},6:{fontStyle:'bold'}},
    didParseCell:h=>{if(h.section!=='body')return;const r=rows[h.row.index];if(h.column.index===6)h.cell.styles.textColor=statusRGB(r[7]);if(h.column.index===4)h.cell.styles.textColor=r[8]==='under'?[154,91,0]:r[8]==='in'?[31,122,77]:INK}});
  doc.setFont('helvetica','normal');doc.setFontSize(8.5);doc.setTextColor(...MUTED);doc.text('Sets per week count helper sets as half. Days per week count only days where the muscle is a main target. Green sets are inside the target, amber are below it.',14,doc.lastAutoTable.finalY+7,{maxWidth:182});
  return doc;
}
async function pdfCompare(A,B){
  const {jsPDF}=window.jspdf;const doc=new jsPDF({unit:'mm',format:'a4'});
  const wa=weekStats(A),wb=weekStats(B);
  pdfHeader(doc,(A.name||'A')+'  vs  '+(B.name||'B')+'  ·  '+today());
  const fw=38,fh=fw*FIG_R;
  const cols=[[A,wa,RED,14],[B,wb,BLUE,107]];
  for(const [sp,ws,col,x] of cols){
    doc.setFillColor(...col);doc.rect(x,33,4,4,'F');doc.setFont('helvetica','bold');doc.setFontSize(13);doc.setTextColor(...INK);doc.text((sp.name||'Untitled split').toUpperCase(),x+6,36.6);
    const c=coverCounts(ws),tot=sp.days.reduce((a,d)=>a+daySets(d),0);
    doc.setFont('helvetica','normal');doc.setFontSize(8.5);doc.setTextColor(...MUTED);doc.text(tot+' sets a week  ·  '+c.ok+' at 2x+  ·  '+c.once+' at 1x  ·  '+(c.help+c.miss)+' never main',x,42);
    const lv=weekLevels(ws);const [f1,f2]=await Promise.all([svgPng(figSvg('front',lv),fw,fh),svgPng(figSvg('back',lv),fw,fh)]);
    doc.addImage(f1,'JPEG',x+3,46,fw,fh);doc.addImage(f2,'JPEG',x+3+fw+4,46,fw,fh);
  }
  doc.setFont('helvetica','normal');doc.setFontSize(8.5);doc.setTextColor(...MUTED);
  let lx=14;[['Helper only',PF.w0],['1x',PF.w1],['2x',PF.w2],['3x+ a week as main target',PF.w3],['Missed','#c3ccd5']].forEach(([t,c])=>{doc.setFillColor(c);doc.rect(lx,46+fh+3,3.5,3.5,'F');doc.text(t,lx+5,46+fh+6);lx+=doc.getTextWidth(t)+12});
  const ry=46+fh+14;pdfLabel(doc,'Spiderweb: weekly sets per muscle',14,ry);
  doc.setFillColor(...RED);doc.rect(110,ry-3,6,1.4,'F');doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(...INK);doc.text(A.name||'A',118,ry);
  const bx=118+doc.getTextWidth(A.name||'A')+8;doc.setFillColor(...BLUE);doc.rect(bx,ry-3,6,1.4,'F');doc.text(B.name||'B',bx+8,ry);
  const rw=140,rh=rw*RAD_R,ax=radarAxes(A,null,'muscles','sets'),bxs=radarAxes(B,null,'muscles','sets');
  const img=await svgPng(radarSvg(ax,[{vals:ax.map(a=>a.week),cls:'a'},{vals:bxs.map(a=>a.week),cls:'b'}],'muscles','sets',false),rw,rh);
  doc.addImage(img,'JPEG',35,ry+3,rw,rh);
  if(state.web.hide.length){doc.setFont('helvetica','normal');doc.setFontSize(8.5);doc.setTextColor(...MUTED);doc.text(webPdfNote().trim(),14,ry+rh+6)}
  // comparison table
  doc.addPage();pdfHeader(doc,(A.name||'A')+'  vs  '+(B.name||'B')+'  ·  Muscle by muscle');
  const rows=[];MG.forEach(g=>MUSCLES.filter(m=>m.g===g).forEach(m=>{const a=wa[m.id],b=wb[m.id],sa=wStatus(a),sb=wStatus(b),d=b.sets-a.sets;
    rows.push([m.name,sa.txt.replace('×','x'),fmt(a.sets),sb.txt.replace('×','x'),fmt(b.sets),d>0?'+'+fmt(d):d<0?'-'+fmt(-d):'same',sa.cls,sb.cls,d])}));
  doc.autoTable({startY:34,margin:{left:14,right:14},theme:'striped',styles:{fontSize:9,textColor:INK,cellPadding:2},headStyles:{fillColor:INK,textColor:[255,255,255],fontStyle:'bold'},alternateRowStyles:{fillColor:[245,247,249]},
    head:[['Muscle',A.name||'A','Sets',B.name||'B','Sets','Change']],body:rows.map(r=>r.slice(0,6)),
    columnStyles:{2:{halign:'right'},4:{halign:'right'},5:{halign:'right',fontStyle:'bold'}},
    didParseCell:h=>{if(h.section!=='body')return;const r=rows[h.row.index];
      if(h.column.index===1)h.cell.styles.textColor=statusRGB(r[6]);if(h.column.index===3)h.cell.styles.textColor=statusRGB(r[7]);
      if(h.column.index===5)h.cell.styles.textColor=r[8]>0?[31,122,77]:r[8]<0?[163,24,44]:MUTED}});
  // both splits' days
  for(const sp of [A,B]){
    doc.addPage();pdfHeader(doc,(sp.name||'Untitled split')+'  ·  Day by day');
    doc.autoTable({startY:34,margin:{left:14,right:14},theme:'grid',styles:{fontSize:8.5,textColor:INK,cellPadding:2,lineColor:[214,220,226]},headStyles:{fillColor:INK,textColor:[255,255,255]},
      columnStyles:{0:{cellWidth:14,fontStyle:'bold'},1:{cellWidth:34},3:{cellWidth:14,halign:'right'}},
      head:[['Day','Session','Exercises (sets)','Sets']],
      body:sp.days.map((d,i)=>[DAYS[i],dayLabel(d),d.items.length?d.items.filter(it=>EXM[it.ex]).map(it=>EXM[it.ex].name+' ('+it.sets+')').join(', '):'Rest',String(daySets(d))])});
  }
  return doc;
}
/* ---------- sharing: link in the URL hash, JSON import and export ---------- */
const PUBLIC_URL='https://1mach0.github.io/split-muscle-map/';
const b64u={enc:str=>{const bytes=new TextEncoder().encode(str);let bin='';bytes.forEach(b=>bin+=String.fromCharCode(b));return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')},
  dec:t=>{t=t.replace(/-/g,'+').replace(/_/g,'/');while(t.length%4)t+='=';const bin=atob(t),bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);return new TextDecoder().decode(bytes)}};
function usedCustom(splits){const ids=new Set();splits.forEach(sp=>sp.days.forEach(d=>d.items.forEach(it=>{if(String(it.ex).startsWith('c-'))ids.add(it.ex)})));return state.custom.filter(c=>ids.has(c.id))}
function sharePayload(sp){return{v:1,n:sp.name,d:sp.days.map(d=>[d.name,d.items.map(it=>[it.ex,it.sets])]),c:usedCustom([sp]).map(c=>[c.id,c.name,c.p,c.s])}}
function shareLink(sp){
  const base=(window.claude||location.protocol==='file:'||!/^https?:/.test(location.protocol))?PUBLIC_URL:location.origin+location.pathname;
  return base+'#split-'+b64u.enc(JSON.stringify(sharePayload(sp)));
}
function copyShareLink(){
  const link=shareLink(S());
  const show=()=>{const d=$('linkDlg'),i=$('linkInput');i.value=link;d.hidden=false;i.focus();i.select()};
  try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(link).then(()=>toast('Share link copied. Paste it anywhere.'),show);return}}catch(e){}
  show();
}
let pendingShare=null;
function readShareHash(){
  const h=location.hash||'';if(!h.startsWith('#split-'))return null;
  try{const o=JSON.parse(b64u.dec(h.slice(7)));if(!o||!Array.isArray(o.d))return null;return o}catch(e){return null}
}
function clearShareHash(){try{history.replaceState(null,'',location.pathname+location.search)}catch(e){try{location.hash=''}catch(_){}}}
function renderShareBanner(){
  const b=$('shareBanner');
  if(!pendingShare){b.hidden=true;b.innerHTML='';return}
  const days=pendingShare.d.filter(d=>d[1]&&d[1].length).length,sets=pendingShare.d.reduce((a,d)=>a+(d[1]||[]).reduce((x,y)=>x+(+y[1]||0),0),0);
  b.innerHTML='<div><b>Shared split: '+esc(pendingShare.n||'Untitled split')+'</b><span>'+days+' training day'+(days===1?'':'s')+' · '+sets+' sets a week</span></div><div class="banner-act"><button class="btn small primary" type="button" id="shareAdd">Add to my splits</button><button class="btn small" type="button" id="shareDismiss">Dismiss</button></div>';
  b.hidden=false;
}
function addCustomDefs(defs){(defs||[]).forEach(c=>{if(!c||!c.id||EXM[c.id])return;const p=(c.p||[]).filter(m=>MBY[m]),s2=(c.s||[]).filter(m=>MBY[m]);if(!p.length)return;state.custom.push({id:c.id,name:String(c.name||'Custom exercise').slice(0,60),cat:'Custom',custom:true,p,s:s2})});rebuildEx()}
function resolveEx(id,name){if(id&&EXM[id])return id;if(name){const n=String(name).toLowerCase();const e=allEx().find(x=>x.name.toLowerCase()===n);if(e)return e.id}return null}
function normDays(list,skip){
  const out=DAYS.map((_,i)=>{const d=list[i];if(!d)return{name:'',items:[]};
    const items=[];(d.items||[]).forEach(it=>{const id=resolveEx(it.id||it.ex,it.name);if(!id){skip.n++;return}const sets=Math.max(1,Math.min(10,Math.round(+it.sets||2)));if(!items.some(x=>x.ex===id))items.push({ex:id,sets})});
    return{name:String(d.name||'').slice(0,40),items}});
  return out;
}
function acceptShared(){
  const o=pendingShare;if(!o)return;
  addCustomDefs((o.c||[]).map(c=>({id:c[0],name:c[1],p:c[2],s:c[3]})));
  const skip={n:0};const days=normDays(o.d.map(d=>({name:d[0],items:(d[1]||[]).map(x=>({id:x[0],sets:x[1]}))})),skip);
  pendingShare=null;clearShareHash();
  addSplit(o.n||'Shared split',days,'Added '+(o.n||'the shared split')+'.'+(skip.n?' '+skip.n+' unknown exercise'+(skip.n>1?'s were':' was')+' skipped.':''));
  renderShareBanner();
}
function exportJSON(splits){
  const data={app:'split-muscle-map',version:1,exported:new Date().toISOString(),
    splits:splits.map(sp=>({name:sp.name,days:sp.days.map((d,i)=>({day:DAYS[i],name:d.name,items:d.items.filter(it=>EXM[it.ex]).map(it=>({id:it.ex,name:EXM[it.ex].name,sets:it.sets}))}))})),
    custom:usedCustom(splits).map(c=>({id:c.id,name:c.name,p:c.p,s:c.s}))};
  const name=(splits.length===1?'split-'+slug(splits[0].name||'split'):'splits-all')+'.json';
  saveFile(name,JSON.stringify(data,null,2),'application/json',splits.length===1?'Split exported.':'All splits exported.');
}
async function saveFile(name,text,type,okMsg){
  const dl=await downloadsCap();
  if(dl===undefined){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);toast(okMsg)}
  else if(dl===null)toast('Saving files isn\u2019t available in this view.');
  else{try{await dl.save({filename:name,data:new Blob([text],{type})});toast(okMsg)}catch(e){toast(e&&e.code==='declined'?'Save cancelled.':'Couldn\u2019t save the file here.')}}
}
function importJSON(text){
  let o;try{o=JSON.parse(text)}catch(e){toast('That file isn\u2019t valid JSON.');return}
  const list=Array.isArray(o)?o:Array.isArray(o.splits)?o.splits:(o&&Array.isArray(o.days))?[o]:null;
  if(!list||!list.length){toast('No splits found in that file.');return}
  addCustomDefs(o.custom);
  const skip={n:0};let added=0;
  list.forEach(sp=>{if(!sp||!Array.isArray(sp.days))return;state.splits.push({id:uid(),name:uniqueName(String(sp.name||'Imported split').slice(0,40)),days:normDays(sp.days,skip)});added++});
  if(!added){toast('No splits found in that file.');return}
  state.active=state.splits.length-1;state.view='week';ui.focus=null;save();render();
  toast('Imported '+added+' split'+(added>1?'s':'')+'.'+(skip.n?' '+skip.n+' unknown exercise'+(skip.n>1?'s were':' was')+' skipped.':''));
}
$('importFile').addEventListener('change',e=>{const f=e.target.files&&e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>importJSON(String(r.result));r.onerror=()=>toast('Couldn\u2019t read that file.');r.readAsText(f);e.target.value=''});
addEventListener('hashchange',()=>{const o=readShareHash();if(o){pendingShare=o;renderShareBanner()}});
let dlP=null;
function downloadsCap(){if(!dlP)dlP=(window.claude&&typeof window.claude.use==='function')?window.claude.use('downloads').catch(()=>null):Promise.resolve(undefined);return dlP}
async function exportPDF(){
  const btn=$('pdfBtn');
  if(!window.jspdf||!window.jspdf.jsPDF||!window.jspdf.jsPDF.API.autoTable){toast('The PDF maker is still loading. Try again in a moment.');return}
  btn.disabled=true;const orig=btn.textContent;btn.textContent='Making PDF…';
  try{
    let doc,fname;
    if(isCmp()){clampCmp();const A=state.splits[state.cmpA],B=state.splits[state.cmpB];doc=await pdfCompare(A,B);fname='split-muscle-map-'+slug(A.name||'a')+'-vs-'+slug(B.name||'b')+'.pdf'}
    else{doc=await pdfSplit(S());fname='split-muscle-map-'+slug(S().name||'split')+'.pdf'}
    const dl=await downloadsCap();
    if(dl===undefined){doc.save(fname);toast('PDF downloaded.')}
    else if(dl===null){toast('Saving files isn’t available in this view.')}
    else{try{await dl.save({filename:fname,data:doc.output('blob')});toast('PDF saved.')}catch(e){toast(e&&e.code==='declined'?'Save cancelled.':'Couldn’t save the PDF here.')}}
  }catch(e){console.error(e);toast('Something went wrong making the PDF.')}
  finally{btn.disabled=false;btn.textContent=orig}
}
pendingShare=readShareHash();renderShareBanner();
render();
})();
