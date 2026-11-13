/* panels.js — بيرسم صورة كل لوحة (الرسمة + الاسم + الوصف) على canvas.
   الصورة دي بتتحول لـ texture وتتحط على اللوحة الـ3D.
   عشان تحط صورة حقيقية بدل الرسم: ده المكان اللي هتغيّره. */

function paint(p){
 const c=p.cv,x=c.getContext('2d'),O='#ff7a1a';
 const g=x.createLinearGradient(0,0,1024,640);g.addColorStop(0,'#1d1c1e');g.addColorStop(1,'#060607');x.fillStyle=g;x.fillRect(0,0,1024,640);
 const ci=(a,b,r,f)=>{x.beginPath();x.arc(a,b,r,0,6.3);f?x.fill():x.stroke()};
 if(p.k==0){x.fillStyle='#030303';ci(690,320,230,1);x.strokeStyle='#2b2b2d';x.lineWidth=2;for(let r=70;r<225;r+=18)ci(690,320,r);x.fillStyle=O;ci(690,320,66,1);x.fillStyle='#050505';ci(690,320,9,1);x.fillStyle='#3a3a3d';for(let i=0;i<14;i++)x.fillRect(70+i*26,90+(i*37%60),14,120-(i*53%80))}
 if(p.k==1){x.fillStyle='#2a2a2d';x.fillRect(560,110,330,380);x.fillStyle='#d8d8d8';x.fillRect(640,150,170,140);x.strokeStyle='#111';x.lineWidth=14;x.beginPath();x.moveTo(690,225);x.lineTo(725,258);x.lineTo(780,190);x.stroke();x.fillStyle='#4a4a4e';for(let i=0;i<4;i++)x.fillRect(590,320+i*40,260-i*30,12)}
 if(p.k==2){const sg=x.createRadialGradient(760,230,10,760,230,130);sg.addColorStop(0,'#ffb35a');sg.addColorStop(1,'#e0560a');x.fillStyle=sg;ci(760,230,110,1);x.fillStyle='#303033';[[560,380,120],[690,340,140],[830,385,130],[930,420,90],[620,440,110]].forEach(a=>ci(a[0],a[1],a[2],1))}
 if(p.k==3){x.strokeStyle=O;x.lineWidth=3;[40,80,120,160,200].forEach((r,i)=>{x.globalAlpha=1-i*.17;ci(720,300,r)});x.globalAlpha=1;x.fillStyle=O;ci(720,300,16,1)}
 x.strokeStyle='rgba(255,140,40,.4)';x.lineWidth=4;x.strokeRect(2,2,1020,636);
 x.fillStyle='#f2ece4';x.font='italic 500 70px "Cormorant Garamond",Georgia,serif';x.fillText(p.n,56,540);
 x.fillStyle='#b9b2a8';x.font='26px Manrope,Arial,sans-serif';x.fillText(p.s,58,588);
}
