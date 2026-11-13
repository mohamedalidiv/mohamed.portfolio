/* scene.js — المحرك: Three.js (الكرة + اللوحات + الكاميرا) + حركة الكلام مع السكرول.
   أهم أرقام تلعب فيها:
   - Z: سرعة الطيران
   - FogExp2(...,.05): الضباب (أكبر = اللوحات البعيدة تختفي أكتر)
   - .075 في loop: نعومة السكرول (أصغر = أنعم وأبطأ) */

let INTRO_P=0;   // تقدّم العدّاد من 0 لـ 1 (بيتحط من app.js). الكرة بتكبر بيه
let READY_AT=0;   // الوقت اللي الموقع "فتح" فيه بعد شاشة الدخول (بيتحط من app.js). منه بتبدأ حركة دخول الكرة واللوحات والكاميرا
function engine(){
 const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const mv=[...document.querySelectorAll('.mv')],pj=[...document.querySelectorAll('.pj')];
 let W=innerWidth,H=innerHeight,docH=1,sy=scrollY,mx=0,my=0,mx2=0,my2=0,// layout: بيحسب مكان وحجم كل لوحة حسب مقاس الشاشة (بيتنادى عند فتح الصفحة وتغيير المقاس)
  layout=()=>{};
 // Z = المسافة اللي الكاميرا بتقطعها على طول الصفحة (أكبر = طيران أسرع). CZ = مكان الكاميرا حسب السكرول
  const Z=44,CZ=p=>9-p*Z,sm=(a,b,v)=>{v=Math.min(1,Math.max(0,(v-a)/(b-a)));return v*v*(3-2*v)};
 let skY=-1e9;   // مكان قسم Skills في الصفحة (عشان نقلّل ظهور الكرة وراه)
 const measure=()=>{const sk=document.getElementById('skills');if(sk){const r=sk.getBoundingClientRect();skY=r.top+scrollY+r.height/2}W=innerWidth;H=innerHeight;docH=document.documentElement.scrollHeight;mv.forEach(e=>{const r=e.getBoundingClientRect();e._y=r.top+scrollY+r.height/2});pj.forEach(e=>{const r=e.getBoundingClientRect();e._y=r.top+scrollY+r.height/2});layout()};
 const T=window.THREE;let R,S,C,rig,mat,heroP=[],workP=[];
 try{
  R=new T.WebGLRenderer({canvas:document.getElementById('gl'),antialias:true,alpha:true,powerPreference:'high-performance'});   // antialias شغّال دايمًا عشان حواف الكرة واللوحات ما تتسننش
  R.domElement.addEventListener('webglcontextlost',ev=>{ev.preventDefault();document.body.classList.add('no-gl')});   // لو المتصفح قفل الـWebGL: كرة CSS بديلة
  R.setPixelRatio(Math.min(devicePixelRatio||1,2));   // الموبايل: جودة أقل شوية عشان الأداء
  S=new T.Scene();S.fog=new T.FogExp2(0x050403,.05);C=new T.PerspectiveCamera(50,1,.1,120);
  // الكرة البرتقالي: shader (كود GPU). اللون في fragmentShader عند vec3(1.,.36,.04) = برتقالي، والتموّج في vertexShader
  mat=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{t:{value:0},fade:{value:1}},
   vertexShader:`uniform float t;varying vec3 vN;varying vec3 vV;varying vec3 vP;
   float n(vec3 p){return sin(p.x*1.7+t*.7)*sin(p.y*1.4-t*.5)*sin(p.z*1.6+t*.6);}
   void main(){vec3 p=position;p+=normal*(.22*n(p*1.3)+.09*n(p*3.1+3.));vP=p;vN=normalize(normalMatrix*normal);vec4 m=modelViewMatrix*vec4(p,1.);vV=-m.xyz;gl_Position=projectionMatrix*m;}`,
   fragmentShader:`uniform float t;varying vec3 vN;varying vec3 vV;varying vec3 vP;
   uniform float fade;
   void main(){vec3 N=normalize(vN),V=normalize(vV);float f=pow(1.-abs(dot(N,V)),2.4);
   float sw=sin(vP.x*3.2+sin(vP.y*4.1+t*.8)*1.8+vP.z*2.4-t*.5)*.5+.5;float b=smoothstep(.55,.95,sw);
   vec3 col=vec3(.04,.008,0.)+vec3(1.,.36,.04)*(f*1.35+b*.55)+vec3(1.,.7,.35)*pow(f,5.)*.8;
   float hl=pow(max(dot(N,normalize(vec3(-.5,.6,.65))),0.),40.);col+=vec3(1.,.85,.65)*hl*.9;
   gl_FragColor=vec4(col,(.28+f*.72+b*.2)*fade);}`});
  const ball=new T.Mesh(new T.SphereGeometry(1.6,innerWidth<760?64:72,innerWidth<760?64:72),mat);
  const gc=document.createElement('canvas');gc.width=gc.height=256;const gx=gc.getContext('2d'),gg=gx.createRadialGradient(128,128,0,128,128,128);gg.addColorStop(0,'rgba(255,110,20,.55)');gg.addColorStop(.45,'rgba(255,90,10,.14)');gg.addColorStop(1,'rgba(255,90,10,0)');gx.fillStyle=gg;gx.fillRect(0,0,256,256);
  const glow=new T.Mesh(new T.PlaneGeometry(9,9),new T.MeshBasicMaterial({map:new T.CanvasTexture(gc),transparent:true,blending:T.AdditiveBlending,depthWrite:false,fog:false}));glow.position.z=-1.2;
  rig=new T.Group();rig.add(glow,ball);S.add(rig);rig.userData.g=glow;
  // بنبني صورة (texture) لكل مشروع من panels.js
  PROJECTS.forEach(p=>{p.cv=document.createElement('canvas');p.cv.width=1024;p.cv.height=640;paint(p);p.tex=new T.CanvasTexture(p.cv);p.tex.anisotropy=4});
  const mk=p=>{const g=new T.Group();g.add(new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:p.tex,side:T.DoubleSide,transparent:true})),new T.LineSegments(new T.EdgesGeometry(new T.PlaneGeometry(1,1)),new T.LineBasicMaterial({color:0xff7a1a,transparent:true,opacity:.55})));S.add(g);return g};
  [0,1,2].forEach(i=>heroP.push(mk(PROJECTS[i])));PROJECTS.forEach(p=>workP.push(mk(p)));
  const t25=Math.tan(25*Math.PI/180);
  layout=()=>{const asp=W/H,mob=asp<1;R.setSize(W,H,false);C.aspect=asp;C.updateProjectionMatrix();
   heroP.forEach((g,i)=>{const d=7,hh=t25*d,hw=hh*asp,w=i==1?Math.min(3.8,hw*(mob?1.5:.62)):Math.min(3.2,hw*(mob?1.1:.52));
    g.scale.set(w,w*.625,1);g.position.set([-1,0,1][i]*hw*(mob?.95:.66),-hh*(mob?.7:.64),CZ(0)-d);g.userData.b=g.position.clone();g.rotation.set(-.28,[.5,0,-.5][i],[.1,0,-.08][i])});
   workP.forEach((g,i)=>{const d=6.5,hh=t25*d,hw=hh*asp,w=Math.min(4.4,hw*(mob?1.25:.56)),pi=Math.min(1,Math.max(0,((pj[i]?pj[i]._y:0)-H/2)/Math.max(1,docH-H))),side=i%2?-1:1;
    g.scale.set(w,w*.625,1);g.position.set(mob?0:side*hw*.5,mob?-hh*.32:0,CZ(pi)-d);g.userData.b=g.position.clone();g.rotation.set(-.12,-side*.42,side*.05)})};
 }catch(e){R=null;document.body.classList.add('no-gl')}
 measure();const onResize=()=>{if(Math.abs(innerWidth-W)<2&&Math.abs(innerHeight-H)<90)return;measure()};   // الموبايل: شريط العنوان بيطلع وينزل وقت السكرول، فمنعيدش بناء المشهد عشان ما يرمشش
 addEventListener('resize',onResize);addEventListener('load',measure);
 document.fonts&&document.fonts.ready.then(()=>{if(R)PROJECTS.forEach(p=>{paint(p);p.tex.needsUpdate=true});measure()});
 addEventListener('pointermove',e=>{mx=e.clientX/W-.5;my=e.clientY/H-.5},{passive:true});
 let t=0,q=3,fpsN=0,fpsT=0,last=performance.now();
 const tau=matchMedia('(pointer:coarse)').matches?70:140;   // نعومة السكرول بالميلّي ثانية (أصغر = أسرع). بتعتمد على الزمن مش عدد الفريمات، فالمشهد ما يتأخرش عن السكرول حتى لو الجهاز بطيء
 // مستوى الجودة التلقائي q: 3 = كامل (دقة الشاشة حتى 2، وبنبدأ بيه على كل الأجهزة) | 2 = دقة 1.5 | 1 = دقة 1 | 0 = أخف حاجة (من غير توهج ودقة منخفضة)
 const applyQ=()=>{if(!R)return;R.setPixelRatio(q>=3?Math.min(devicePixelRatio||1,2):q===2?Math.min(devicePixelRatio||1,1.5):q===1?1:.65);R.setSize(W,H,false);if(rig&&rig.userData.g)rig.userData.g.visible=q>=1};
 // loop: بيشتغل كل فريم (60 مرة في الثانية): بيحرّك الكلام والكاميرا والكرة واللوحات حسب السكرول والماوس
 const loop=()=>{
  const ty=scrollY;const now=performance.now(),dt=now-last;last=now;
  if(R&&dt<250){fpsT+=dt;fpsN++;if(fpsN>=45){const avg=fpsT/fpsN;fpsN=0;fpsT=0;if(avg>26&&q>0){q--;applyQ()}}}   // لو الفريمات بطيئة (أقل من ~38 فريم/ث) الجودة بتقل لوحدها
  sy=reduce?ty:sy+(ty-sy)*(1-Math.exp(-Math.min(dt,250)/tau));t+=reduce?0:.016;
  const pr=Math.min(1,Math.max(0,sy/Math.max(1,docH-H)));
  // k: في الموبايل الحركة الجانبية للكلام أقل (40%) عشان ما يطلعش برا الشاشة
  const k=W<760?.4:W<1100?.7:1;mv.forEach(e=>{let p=e.dataset.h?-sy/H:(e._y-sy-H/2)/H;if(!e.dataset.h){const ap=Math.abs(p);p=ap<.22?0:(ap-.22)*Math.sign(p)}   // منطقة الوسط (±22% من ارتفاع الشاشة): الكلام ثابت في مكانه ومقروء، وبيتحرك بس لما يقرّب من فوق أو تحت
  if(e.dataset.end&&p<0)p=0;const tr='translate3d('+(Math.round(p*(+e.dataset.sp)*W*k*10)/10)+'px,0,0)';if(e._t!==tr){e._t=tr;e.style.transform=tr}});   // بنكتب الـstyle بس لو القيمة اتغيّرت (أخف على الموبايل)
  if(R){
   mx2+=(mx-mx2)*.05;my2+=(my-my2)*.05;
   const asp=W/H,mob=asp<1,vel=Math.max(-300,Math.min(300,ty-sy));
   // حركة الدخول: it = الثواني من ساعة ما الموقع فتح، IP = تقدّم العدّاد (الكرة بتكبر في النص)، ib = انتقال الكرة لمكانها (0 → 1)
   const it=READY_AT?(performance.now()-READY_AT)/1000:0,ez=x=>x<=0?0:1-Math.pow(1-Math.min(1,x),3),IP=READY_AT?1:INTRO_P,ib=ez(it/.9);
   C.position.set(mx2*.6,-my2*.35,CZ(pr));C.rotation.set(-my2*.05,-mx2*.07,-vel*.00012);
   mat.uniforms.t.value=t;
   const fd=.3+.7*sm(.35,1,Math.abs(skY-sy-H/2)/H);mat.uniforms.fade.value=fd*ez(IP);rig.userData.g.material.opacity=fd*ez(IP);   // الكرة بتخفت لما قسم Skills في نص الشاشة عشان الكلام يبان
   const e=sm(.84,1,pr),hx=(mob?.5:.4663*9*Math.min(asp,2)*.22)*Math.cos(pr*9)*(1-pr*.4),hy=(mob?1.5:.2)+Math.sin(pr*7)*.9*(mob?.4:1);
   const s0=(mob?.6:1)*1.25*ez(IP),s1=(mob?.6:1)*(1+pr*.35+e*.9);   // s0 = حجم الكرة وقت العدّاد (في النص)، s1 = حجمها العادي
   rig.position.set(hx*(1-e)*ib,hy*(1-e)*ib,CZ(pr)-9);rig.rotation.y=t*.12+mx2;rig.scale.setScalar(Math.max(.001,s0+(s1-s0)*ib));
   heroP.concat(workP).forEach((g,i)=>{const b=g.userData.b;if(!b)return;g.position.set(b.x+mx2*.35,b.y+Math.sin(t*.7+i)*.1-my2*.2,b.z);
    // اللوحة بتختفي تدريجيًا لما الكاميرا تقرّب منها جدًا (عشان ما تظهرش كشريط غريب)
    const f=Math.max(0,Math.min(1,(C.position.z-g.position.z-1.5)/3));g.children[0].material.opacity=f;g.children[1].material.opacity=.55*f;g.visible=f>.01&&it>0});   // اللوحات مخفية لحد ما العدّاد يخلص، وبعدها بتظهر فجأة
   R.render(S,C);
  }
  requestAnimationFrame(loop)};
 loop();
}
