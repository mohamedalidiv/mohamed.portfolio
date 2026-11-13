/* config.js — بياناتك الشخصية والمشاريع. ده أسهل ملف تعدّل فيه. */

// بياناتك: الإيميل والروابط والنبذة بتظهر في الصفحة كلها من هنا
const SITE={
  name:'Mohamed Ali',
  initials:'MA',                       // الحروف جنب النقطة البرتقالي فوق
  role:'Creative Developer',
  email:'mohamedali.dev@gmail.com',
  github:'https://github.com/mohamedalidiv',
  portfolio:'https://mohamedalidiv.github.io',
  location:'Alexandria, Egypt',
  about:'Self-taught frontend developer from Alexandria, Egypt. Studying Business Information Systems, graduating in 2028. I turn interfaces into small experiments.'
};

// المشاريع: كل مشروع هيطلع له اسم ضخم + لوحة 3D طايرة في الفضاء
//  n = الاسم | s = الوصف | t = التقنيات | link = رابط المشروع (سيبه '' ياخد رابط GitHub)
//  k = شكل رسمة اللوحة: 0 اسطوانة موسيقى، 1 تشيك لست، 2 شمس وسحاب، 3 دوائر
const PROJECTS=[
  {n:'MixLab',   s:'Spotify Music Mixer',  t:'JavaScript, Web Audio', k:0, link:''},
  {n:'FocusFlow',s:'Todo & Productivity',  t:'JavaScript, UX',        k:1, link:''},
  {n:'NOVA',     s:'Weather App',          t:'API, Motion UI',        k:2, link:''},
  {n:'JARVIS',   s:'Desktop AI Assistant', t:'Electron, Gemini API',  k:3, link:''}
];

// المهارات: كل مجموعة (g) فيها قايمة (items) بتظهر في صف واحد كبير بيتحرك مع السكرول.
// زوّد أو شيل أي مجموعة أو مهارة براحتك.
const SKILLS=[
  {g:'Frontend',    items:['HTML5','CSS3','JavaScript','React','Responsive design']},
  {g:'Motion & 3D', items:['UI animation','Three.js','Scroll effects','UX thinking']},
  {g:'Tools',       items:['Git & GitHub','Electron','REST APIs','Gemini API']}
];
