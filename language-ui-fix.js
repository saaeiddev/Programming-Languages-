const languageData = [
  ['Python','python/python-original.svg','#ffd85b','GENERAL • AI • DATA','پایتون زبانی خوانا و چندمنظوره است که برای هوش مصنوعی، یادگیری ماشین، علم داده، اتوماسیون، بک‌اند وب و اسکریپت‌نویسی بسیار پرکاربرد است.',['هوش مصنوعی','علم داده','Backend','Automation']],
  ['JavaScript','javascript/javascript-original.svg','#f7df1e','WEB • FULL STACK','جاوااسکریپت زبان اصلی تعامل در وب است؛ از رابط‌های کاربری مرورگر تا سرور با Node.js، اپلیکیشن‌های موبایل و تجربه‌های سه‌بعدی WebGL استفاده می‌شود.',['Frontend','Node.js','WebGL','Mobile']],
  ['TypeScript','typescript/typescript-original.svg','#4d9dff','WEB • LARGE APPS','تایپ‌اسکریپت نسخه‌ی type-safe جاوااسکریپت است و برای پروژه‌های بزرگ وب، تیم‌های توسعه، React/Angular و بک‌اندهای مدرن انتخاب محبوبی محسوب می‌شود.',['Frontend','Backend','Type Safety','Enterprise']],
  ['C++','cplusplus/cplusplus-original.svg','#6295cb','SYSTEMS • GAMES','سی‌پلاس‌پلاس برای نرم‌افزارهای بسیار سریع، موتورهای بازی، گرافیک، شبیه‌سازی، رباتیک، سیستم‌های نهفته و بخش‌های performance-critical کاربرد دارد.',['Game Engine','Robotics','Graphics','Systems']],
  ['C#','csharp/csharp-original.svg','#9b5cff','GAMES • .NET','سی‌شارپ زبان اصلی اکوسیستم .NET و یکی از مهم‌ترین زبان‌ها برای توسعه بازی با Unity، اپلیکیشن‌های سازمانی، وب‌سرویس‌ها و ابزارهای دسکتاپ است.',['Unity','Game Dev','.NET','Desktop']],
  ['Java','java/java-original.svg','#ff704d','ENTERPRISE • ANDROID','جاوا در سامانه‌های سازمانی، بک‌اندهای مقیاس‌پذیر، سرویس‌های بانکی، ابزارهای بزرگ و بسیاری از پروژه‌های اندرویدی و سروری استفاده می‌شود.',['Enterprise','Backend','Android','Cloud']],
  ['Swift','swift/swift-original.svg','#ff674d','APPLE • IOS','سوئیفت زبان مدرن اپل برای ساخت اپلیکیشن‌های iPhone، iPad، Mac، Apple Watch و visionOS است و با SwiftUI تجربه‌ی توسعه‌ی قدرتمندی ارائه می‌دهد.',['iOS','macOS','SwiftUI','visionOS']],
  ['Kotlin','kotlin/kotlin-original.svg','#b06cff','ANDROID • JVM','کاتلین زبان مدرن و رسمی توسعه اندروید است؛ همچنین برای بک‌اند JVM، اپ‌های چندپلتفرمی و پروژه‌های Kotlin Multiplatform به کار می‌رود.',['Android','KMP','Backend','JVM']],
  ['Go','go/go-original-wordmark.svg','#59d7e8','CLOUD • BACKEND','Go برای سرویس‌های ابری، APIهای سریع، ابزارهای DevOps، شبکه و سیستم‌های همزمان بسیار مناسب است و در زیرساخت‌های مدرن محبوبیت زیادی دارد.',['Cloud','DevOps','Backend','Networking']],
  ['Rust','rust/rust-original.svg','#f09161','SYSTEMS • SAFE','راست برای ساخت نرم‌افزارهای سطح سیستم با سرعت بالا و ایمنی حافظه طراحی شده و در ابزارهای خط فرمان، WebAssembly، زیرساخت و سیستم‌های embedded کاربرد دارد.',['Systems','WebAssembly','Embedded','Performance']],
  ['PHP','php/php-original.svg','#8e92d8','WEB • SERVER','PHP یکی از زبان‌های باسابقه و پرکاربرد بک‌اند وب است و بخش بزرگی از وب، مخصوصاً WordPress، فروشگاه‌ها و سامانه‌های محتوایی را پشتیبانی می‌کند.',['Web','WordPress','Backend','CMS']],
  ['Dart','dart/dart-original.svg','#49c7f0','FLUTTER • CROSS PLATFORM','دارت زبان اصلی Flutter است و برای ساخت اپلیکیشن‌های موبایل، وب و دسکتاپ از یک کدبیس مشترک استفاده می‌شود.',['Flutter','Mobile','Web','Cross-platform']]
];
const iconUrl = p => `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${p}`;
const grid = document.createElement('div');
grid.id='languageHitGrid';
grid.setAttribute('aria-label','Programming languages');
grid.innerHTML=languageData.map((l,i)=>`<button class="language-hit-card" type="button" data-language="${i}" style="--lang:${l[2]}"><img src="${iconUrl(l[1])}" alt="${l[0]} logo"><span>${l[0]}</span></button>`).join('');
document.body.appendChild(grid);

function showExactLanguage(i){
  const l=languageData[i];
  document.getElementById('panelIcon').src=iconUrl(l[1]);
  document.getElementById('panelIcon').alt=`${l[0]} logo`;
  document.getElementById('panelTitle').textContent=l[0];
  document.getElementById('panelCategory').textContent=l[3];
  document.getElementById('panelDescription').textContent=l[4];
  document.getElementById('panelTags').innerHTML=l[5].map(t=>`<span>${t}</span>`).join('');
  document.getElementById('languageAccent').style.background=`linear-gradient(90deg,${l[2]},#fff)`;
  document.getElementById('languagePanel').classList.add('open');
}
grid.addEventListener('pointerup',e=>{
  const card=e.target.closest('.language-hit-card');
  if(!card)return;
  e.preventDefault();e.stopPropagation();
  showExactLanguage(Number(card.dataset.language));
},true);
grid.addEventListener('click',e=>{
  const card=e.target.closest('.language-hit-card');
  if(!card)return;
  e.preventDefault();e.stopPropagation();
  showExactLanguage(Number(card.dataset.language));
},true);

const screenTitle=document.getElementById('screenTitle');
const observer=new MutationObserver(()=>grid.classList.toggle('visible',screenTitle.classList.contains('visible')));
observer.observe(screenTitle,{attributes:true,attributeFilter:['class']});
grid.classList.toggle('visible',screenTitle.classList.contains('visible'));

document.getElementById('homeBtn')?.addEventListener('click',()=>grid.classList.remove('visible'));
