/* logo.js — اللوجو: منارة إسكندرية بشعاع بيلف زي منارة حقيقية + بتتحرك مع الماوس.
   - الشعاعين (lhBeamA و lhBeamB) بيدوّروا: طولهم = cos(الزاوية)، فبيبانوا يمين ثم شمال،
     ولما الشعاع يبقى ناحيتك بيطلع وميض (lhFlare).
   - الماوس: المنارة بتميل وتتحرك شوية ناحيته، والشعاع بيميل لتحت/فوق حسب مكان الماوس.
   - الحروف من SITE.initials في config.js. حجم اللوجو من css/style.css عند .logo svg. */

const LOGO_SVG=`<svg viewBox="0 0 126 56" role="img" aria-hidden="true" focusable="false">
<defs>
 <linearGradient id="beamR" x1="0" x2="1"><stop offset="0" stop-color="#ff7a1a" stop-opacity=".85"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></linearGradient>
 <radialGradient id="flareG"><stop offset="0" stop-color="#ffd7a1"/><stop offset=".35" stop-color="#ff7a1a" stop-opacity=".8"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></radialGradient>
</defs>
<g id="lhLean">
 <!-- الشعاعين (بيدوّروا بالـJS) -->
 <polygon id="lhBeamA" points="43,16 80,6 80,26" fill="url(#beamR)"/>
 <polygon id="lhBeamB" points="43,16 80,6 80,26" fill="url(#beamR)"/>
 <!-- المنارة: 3 طوابق -->
 <g fill="none" stroke="#efe6da" stroke-width="1.6" stroke-linejoin="round">
  <rect x="30" y="40" width="20" height="12"/><rect x="33" y="28" width="14" height="12"/><rect x="36" y="21" width="8" height="7"/>
 </g>
 <!-- النور + الوميض -->
 <circle id="lhFlare" cx="40" cy="16" r="11" fill="url(#flareG)" opacity="0"/>
 <circle cx="40" cy="16" r="3.6" fill="#ff7a1a"/>
</g>
<!-- الحروف -->
<g id="lhText"><text x="90" y="39" font-family="Cormorant Garamond,Times New Roman,serif" font-size="36" font-weight="300" fill="#efe6da">${SITE.initials}</text></g>
</svg>`;

// بيشغّل حركة اللوجو (بيتنادى من app.js بعد ما الصفحة تترسم)
function initLogo(){
  const root=document.querySelector('.logo svg');if(!root)return;
  const $=id=>root.querySelector('#'+id);
  const lean=$('lhLean'),bA=$('lhBeamA'),bB=$('lhBeamB'),flare=$('lhFlare'),txt=$('lhText');
  const still=matchMedia('(prefers-reduced-motion:reduce)').matches;   // لو الجهاز عامل تقليل حركة: اللوجو ثابت
  let mx=0,my=0,sx=0,sy=0,raf,t0=performance.now(),th=.7;
  const onMove=e=>{                                                      // مكان الماوس بالنسبة للوجو (من -1 لـ 1)
    const r=root.getBoundingClientRect(),cx=r.left+r.width*.32,cy=r.top+r.height*.3;
    mx=Math.max(-1,Math.min(1,(e.clientX-cx)/(innerWidth*.5)));
    my=Math.max(-1,Math.min(1,(e.clientY-cy)/(innerHeight*.5)));
  };
  const draw=now=>{
    if(!still)th=(now-t0)/1000*.9;                                       // .9 = سرعة دوران الشعاع (أكبر = أسرع)
    sx+=(mx-sx)*.08;sy+=(my-sy)*.08;                                     // .08 = نعومة تتبّع الماوس
    let c=Math.cos(th);if(Math.abs(c)<.002)c=.002;
    const flash=Math.pow(Math.abs(Math.sin(th)),8),tilt=sy*16;           // 16 = ميل الشعاع لتحت/فوق
    lean.setAttribute('transform','translate('+sx*2.5+' '+sy*1.5+') translate(40 52) skewX('+(-sx*7)+') translate(-40 -52)');  // 2.5 و7 = قوة حركة وميل المنارة
    bA.setAttribute('transform','translate(40 16) rotate('+tilt+') scale('+c+' 1) translate(-40 -16)');
    bB.setAttribute('transform','translate(40 16) rotate('+(-tilt)+') scale('+(-c)+' 1) translate(-40 -16)');
    const o=(.25+.75*Math.abs(c)).toFixed(3);bA.setAttribute('opacity',o);bB.setAttribute('opacity',o);
    flare.setAttribute('opacity',(flash*.95).toFixed(3));
    txt.setAttribute('transform','translate('+(-sx*1.2)+' '+(-sy*.8)+')');
    if(!still)raf=requestAnimationFrame(draw);
  };
  if(!still)addEventListener('pointermove',onMove,{passive:true});
  raf=requestAnimationFrame(draw);
  return()=>{cancelAnimationFrame(raf);removeEventListener('pointermove',onMove)};
}
