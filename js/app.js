/* app.js — (اللوجو بييجي من logo.js) الصفحة نفسها بـ React: بتبني كل الأقسام (nav, hero, about, work, contact).
   النصوص الشخصية جاية من config.js. الحركة والـ3D في scene.js.
   data-sp على أي عنصر .mv = سرعة حركته الجانبية (موجب/سالب = اتجاه). */

const {useEffect,useState}=React,html=htm.bind(React.createElement);

// Intro: شاشة الدخول. عدّاد 0 → 100 بيستنى الخطوط والصفحة تتحمّل (أقل مدة 2.2 ثانية)،
// الكرة بتكبر مع العدّاد، وعند 100% كل حاجة بتظهر فجأة والعدّاد بيختفي.
function Intro(){
 const [n,setN]=useState(0),[ph,setPh]=useState('load');
 useEffect(()=>{
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  if('scrollRestoration' in history)history.scrollRestoration='manual';
  scrollTo(0,0);
  const open=()=>{document.body.classList.remove('loading');document.body.classList.add('ready');READY_AT=performance.now()+(reduce?-5000:0)};
  if(reduce){open();setPh('gone');return}                          // لو تقليل الحركة شغّال: من غير شاشة دخول
  let fonts=false,loaded=document.readyState==='complete',shown=0,raf,fin=false;const t0=performance.now();
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{fonts=true});else fonts=true;
  const onLoad=()=>{loaded=true};addEventListener('load',onLoad);
  const tick=()=>{
   const el=(performance.now()-t0)/1000;
   if(el>9){fonts=true;loaded=true}                                 // أمان: لو النت بطيء ما نعلّقش الشاشة
   const target=Math.min(15+(fonts?35:0)+(loaded?50:0),el/2.2*100); // 2.2 = أقل مدة للشاشة بالثواني
   shown+=(target-shown)*.1;setN(Math.min(100,Math.round(shown)));INTRO_P=Math.min(1,shown/100);   // الكرة بتكبر مع العدّاد
   if(!fin&&shown>99.3&&fonts&&loaded){fin=true;setN(100);INTRO_P=1;setTimeout(()=>{setPh('out');open();setTimeout(()=>setPh('gone'),700)},300)}
   if(!fin)raf=requestAnimationFrame(tick)};
  raf=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(raf);removeEventListener('load',onLoad)};
 },[]);
 if(ph==='gone')return null;
 return html`<div className=${'intro'+(ph==='out'?' out':'')} aria-hidden="true">
  <p className="it">${SITE.name}</p><p className="ir">${SITE.role}</p>
  <i className="il" style=${{transform:'scaleX('+n/100+')'}}></i>
  <div className="ic">${n}<small>%</small></div>
 </div>`;
}

function App(){
 const [open,setOpen]=useState(false);
 useEffect(engine,[]);
 useEffect(initLogo,[]);
 const close=()=>setOpen(false);
 return html`<div>
  <!-- NAV: اللوجو + الإيميل + زرار Menu -->
  <nav><a className="logo" href="#top" aria-label=${SITE.name} dangerouslySetInnerHTML=${{__html:LOGO_SVG}}></a>
   <div className="right"><a className="mail" href=${'mailto:'+SITE.email}>${SITE.email}</a><button className=${'menu'+(open?' open':'')} onClick=${()=>setOpen(!open)} aria-expanded=${open} aria-label=${open?'Close menu':'Open menu'}><span className="mt">${open?'Close':'Menu'}</span><span className="mi"><b></b><b></b></span></button></div></nav>
  <!-- القايمة اللي بتفتح بزرار Menu (الروابط هنا) -->
  <div className=${'ov'+(open?' on':'')}><a href="#top" onClick=${close}>Home</a><a href="#about" onClick=${close}>About</a><a href="#work" onClick=${close}>Work</a><a href="#skills" onClick=${close}>Skills</a><a href="#contact" onClick=${close}>Contact</a></div>
  <!-- HERO: أول شاشة. الكلمات التلاتة بتتحرك لما تسكرول (data-sp = سرعة واتجاه الحركة) -->
  <header className="hero" id="top">
   <h1 className="ht"><div className="mv" data-h="1" data-sp="-.55"><span className="rise">creative</span></div><div className="mv" data-h="1" data-sp=".6"><span className="rise">web</span></div><div className="mv" data-h="1" data-sp="-.4"><span className="rise">developer</span></div></h1>
   <div className="meta"><i></i><p>${SITE.name} — ${SITE.role}</p><div className="sc">Scroll to explore<b></b></div></div>
  </header>
  <!-- STATEMENT: الجمل الكبيرة + النبذة (النبذة من config.js) -->
  <section className="st" id="about">
   <h2 className="big mv" data-sp="1"><span>I build websites</span></h2>
   <h2 className="big mv" data-sp="-1"><span>that move, glow</span></h2>
   <h2 className="big mv" data-sp="1"><span>and feel like <em>space.</em></span></h2>
   <p className="note">${SITE.about}</p>
  </section>
  <!-- WORK: بيتكرر لكل مشروع في PROJECTS (من config.js) -->
  <div id="work"><p className="lab">Selected work</p>
   ${PROJECTS.map((p,i)=>html`<section key=${p.n} className=${'pj'+(i%2?' r':'')}>
    <h3 className="pn mv" data-sp=${i%2?'-.55':'.55'}><span>${p.n}</span></h3>
    <div className="pm"><b>${p.s}</b><span>${p.t}</span><a className="go" href=${p.link||SITE.github} aria-label=${'Open '+p.n}>↗</a></div></section>`)}
  </div>
  <!-- SKILLS: المهارات (من SKILLS في config.js). كل صف بيتحرك يمين/شمال بالتبادل -->
  <section className="sk" id="skills">
   <h2 className="big mv" data-sp="-.7" data-end="1"><span>Tools I think <em>in.</em></span></h2>
   ${SKILLS.map((g,i)=>html`<div key=${g.g}><p className="sg">${g.g}</p><div className="sr mv" data-sp=${i%2?'-.18':'.18'}>${g.items.map((x,j)=>html`<span key=${x}>${x}${j<g.items.length-1?html`<i></i>`:null}</span>`)}</div></div>`)}
  </section>
  <!-- CONTACT: الإيميل والروابط (من config.js) -->
  <section className="ct" id="contact">
   <h2 className="big mv" data-sp=".7" data-end="1"><span>Let’s make</span></h2>
   <h2 className="big mv" data-sp="-.7" data-end="1"><span>something <em>strange.</em></span></h2>
   <a className="m" href=${'mailto:'+SITE.email}>${SITE.email}</a>
   <div className="ft"><a href=${SITE.github}>GitHub</a><a href=${SITE.portfolio}>Portfolio</a><span>${SITE.location}</span></div>
  </section>
 <!-- INTRO: شاشة الدخول (فوق كل حاجة لحد ما تخلص) -->
  <${Intro}/>
 </div>`;
}
ReactDOM.createRoot(document.getElementById('root')).render(html`<${App}/>`);
