import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/environments/RoomEnvironment.js';

const $ = (id) => document.getElementById(id);
const canvas = $('scene');
const loading = $('loading');
const loadStatus = $('loadStatus');
const entry = $('entry');
const enterBtn = $('enterBtn');
const focusLaptopBtn = $('focusLaptop');
const homeBtn = $('homeBtn');
const musicBtn = $('musicBtn');
const hero = $('hero');
const hint = $('hint');
const panel = $('languagePanel');
const closePanel = $('closePanel');
const screenTitle = $('screenTitle');

const languages = [
  {name:'Python', icon:'python/python-original.svg', color:'#ffd85b', category:'GENERAL • AI • DATA', desc:'پایتون زبانی خوانا و چندمنظوره است که برای هوش مصنوعی، یادگیری ماشین، علم داده، اتوماسیون، بک‌اند وب و اسکریپت‌نویسی بسیار پرکاربرد است.', tags:['هوش مصنوعی','علم داده','Backend','Automation']},
  {name:'JavaScript', icon:'javascript/javascript-original.svg', color:'#f7df1e', category:'WEB • FULL STACK', desc:'جاوااسکریپت زبان اصلی تعامل در وب است؛ از رابط‌های کاربری مرورگر تا سرور با Node.js، اپلیکیشن‌های موبایل و تجربه‌های سه‌بعدی WebGL استفاده می‌شود.', tags:['Frontend','Node.js','WebGL','Mobile']},
  {name:'TypeScript', icon:'typescript/typescript-original.svg', color:'#4d9dff', category:'WEB • LARGE APPS', desc:'تایپ‌اسکریپت نسخه‌ی type-safe جاوااسکریپت است و برای پروژه‌های بزرگ وب، تیم‌های توسعه، React/Angular و بک‌اندهای مدرن انتخاب محبوبی محسوب می‌شود.', tags:['Frontend','Backend','Type Safety','Enterprise']},
  {name:'C++', icon:'cplusplus/cplusplus-original.svg', color:'#6295cb', category:'SYSTEMS • GAMES', desc:'سی‌پلاس‌پلاس برای نرم‌افزارهای بسیار سریع، موتورهای بازی، گرافیک، شبیه‌سازی، رباتیک، سیستم‌های نهفته و بخش‌های performance-critical کاربرد دارد.', tags:['Game Engine','Robotics','Graphics','Systems']},
  {name:'C#', icon:'csharp/csharp-original.svg', color:'#9b5cff', category:'GAMES • .NET', desc:'سی‌شارپ زبان اصلی اکوسیستم .NET و یکی از مهم‌ترین زبان‌ها برای توسعه بازی با Unity، اپلیکیشن‌های سازمانی، وب‌سرویس‌ها و ابزارهای دسکتاپ است.', tags:['Unity','Game Dev','.NET','Desktop']},
  {name:'Java', icon:'java/java-original.svg', color:'#ff704d', category:'ENTERPRISE • ANDROID', desc:'جاوا در سامانه‌های سازمانی، بک‌اندهای مقیاس‌پذیر، سرویس‌های بانکی، ابزارهای بزرگ و بسیاری از پروژه‌های اندرویدی و سروری استفاده می‌شود.', tags:['Enterprise','Backend','Android','Cloud']},
  {name:'Swift', icon:'swift/swift-original.svg', color:'#ff674d', category:'APPLE • IOS', desc:'سوئیفت زبان مدرن اپل برای ساخت اپلیکیشن‌های iPhone، iPad، Mac، Apple Watch و visionOS است و با SwiftUI تجربه‌ی توسعه‌ی قدرتمندی ارائه می‌دهد.', tags:['iOS','macOS','SwiftUI','visionOS']},
  {name:'Kotlin', icon:'kotlin/kotlin-original.svg', color:'#b06cff', category:'ANDROID • JVM', desc:'کاتلین زبان مدرن و رسمی توسعه اندروید است؛ همچنین برای بک‌اند JVM، اپ‌های چندپلتفرمی و پروژه‌های Kotlin Multiplatform به کار می‌رود.', tags:['Android','KMP','Backend','JVM']},
  {name:'Go', icon:'go/go-original-wordmark.svg', color:'#59d7e8', category:'CLOUD • BACKEND', desc:'Go برای سرویس‌های ابری، APIهای سریع، ابزارهای DevOps، شبکه و سیستم‌های همزمان بسیار مناسب است و در زیرساخت‌های مدرن محبوبیت زیادی دارد.', tags:['Cloud','DevOps','Backend','Networking']},
  {name:'Rust', icon:'rust/rust-original.svg', color:'#f09161', category:'SYSTEMS • SAFE', desc:'راست برای ساخت نرم‌افزارهای سطح سیستم با سرعت بالا و ایمنی حافظه طراحی شده و در ابزارهای خط فرمان، WebAssembly، زیرساخت و سیستم‌های embedded کاربرد دارد.', tags:['Systems','WebAssembly','Embedded','Performance']},
  {name:'PHP', icon:'php/php-original.svg', color:'#8e92d8', category:'WEB • SERVER', desc:'PHP یکی از زبان‌های باسابقه و پرکاربرد بک‌اند وب است و بخش بزرگی از وب، مخصوصاً WordPress، فروشگاه‌ها و سامانه‌های محتوایی را پشتیبانی می‌کند.', tags:['Web','WordPress','Backend','CMS']},
  {name:'Dart', icon:'dart/dart-original.svg', color:'#49c7f0', category:'FLUTTER • CROSS PLATFORM', desc:'دارت زبان اصلی Flutter است و برای ساخت اپلیکیشن‌های موبایل، وب و دسکتاپ از یک کدبیس مشترک استفاده می‌شود.', tags:['Flutter','Mobile','Web','Cross-platform']}
];

let scene, camera, renderer, controls, laptop, screenGroup, screenTarget;
let laptopMode = false;
let activeCard = null;
let hoveredCard = null;
let cameraTween = null;
let audioCtx = null;
let musicTimer = null;
let musicOn = false;
let ambientMaster = null;
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const interactiveCards = [];
const steam = [];
const floaters = [];
const readyTasks = [];

const initialCam = new THREE.Vector3(6.9, 4.4, 8.4);
const initialTarget = new THREE.Vector3(0, 1.55, 0);
const laptopCam = new THREE.Vector3(0, 2.14, 3.35);
const laptopTarget = new THREE.Vector3(0, 2.05, -0.32);

try { init(); } catch (err) {
  console.error(err);
  $('fallback').classList.remove('hidden');
  loading.classList.add('done');
}

function init(){
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#10091d');
  scene.fog = new THREE.FogExp2('#10091d', 0.035);

  camera = new THREE.PerspectiveCamera(42, innerWidth/innerHeight, .05, 80);
  camera.position.copy(initialCam);

  renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false, powerPreference:'high-performance'});
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
  pmrem.dispose();

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(initialTarget);
  controls.enableDamping = true;
  controls.dampingFactor = .055;
  controls.minDistance = 4.5;
  controls.maxDistance = 13;
  controls.minPolarAngle = .72;
  controls.maxPolarAngle = 1.48;
  controls.enablePan = false;

  buildLighting();
  buildCafe();
  buildLaptop();
  buildAtmosphere();
  loadReadyMadeProps();
  bindEvents();

  camera.lookAt(initialTarget);
  animate();

  Promise.allSettled(readyTasks).then(() => {
    loadStatus.textContent = 'کافه آماده است';
    setTimeout(() => {
      loading.classList.add('done');
      entry.classList.add('visible');
    }, 450);
  });
}

function buildLighting(){
  scene.add(new THREE.HemisphereLight('#f6dcff','#2e1735',1.35));
  const key = new THREE.DirectionalLight('#fff1d4', 3.2);
  key.position.set(4.5,7,5); key.castShadow = true;
  key.shadow.mapSize.set(1024,1024); key.shadow.camera.far = 25;
  scene.add(key);

  const pink = new THREE.PointLight('#ff5b9f', 18, 10, 2); pink.position.set(-4,3.2,-2); scene.add(pink);
  const cyan = new THREE.PointLight('#50dfff', 15, 9, 2); cyan.position.set(4,2.5,-3); scene.add(cyan);
  const amber = new THREE.PointLight('#ffbd67', 26, 10, 2); amber.position.set(0,4.6,1.3); scene.add(amber);
}

function mat(color, rough=.55, metal=.08){
  return new THREE.MeshStandardMaterial({color, roughness:rough, metalness:metal});
}
function box(w,h,d, material, x=0,y=0,z=0){
  const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), material); m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true; return m;
}

function buildCafe(){
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(9.2,9.2,.25,64), mat('#21172c',.7,.05));
  floor.position.y=-.15; floor.receiveShadow=true; scene.add(floor);

  // back wall and colorful alcoves
  scene.add(box(12,5.2,.28,mat('#2a1837',.78),0,2.35,-4.5));
  scene.add(box(.25,5.2,9,mat('#1c162c',.78),-6,2.35,0));
  const stripeColors=['#e65c9a','#5fd4dd','#f1b95b','#785ec6'];
  stripeColors.forEach((c,i)=>scene.add(box(2.1,.12,.09,mat(c,.35,.2),-3.5+i*2.35,3.95,-4.31)));

  // large arched 'windows' / luminous art panels
  [-3.8,3.8].forEach((x,i)=>{
    const frame=box(2.1,2.9,.16,mat(i?'#4d2e69':'#5a294f',.42,.18),x,2.15,-4.25); scene.add(frame);
    const inner=box(1.82,2.6,.08,new THREE.MeshBasicMaterial({color:i?'#14354e':'#4c1f42'}),x,2.15,-4.14); scene.add(inner);
    const moon = new THREE.Mesh(new THREE.CircleGeometry(.42,48),new THREE.MeshBasicMaterial({color:i?'#6ff3ff':'#ffd576'})); moon.position.set(x+.25,2.7,-4.08); scene.add(moon);
  });

  // bar counter
  scene.add(box(4.6,1.15,.9,mat('#573454',.48,.08),-3.25,.53,-2.8));
  scene.add(box(4.9,.14,1.05,mat('#bd7a63',.35,.05),-3.25,1.15,-2.8));
  for(let i=0;i<4;i++){
    const bottle=box(.18,.65,.18,mat(['#ff8c82','#64d8c9','#f3c96b','#8d78ef'][i],.35,.12),-4.55+i*.72,1.55,-3.05);scene.add(bottle);
  }

  // art frames
  const arts=[['#ff6ca8','#ffc76c'],['#69e6e8','#7868d8'],['#ffa75f','#ec5f76']];
  arts.forEach((c,i)=>{
    const g=new THREE.Group();
    const frame=box(1.0,1.2,.08,mat('#d5b07a',.45),0,0,0);g.add(frame);
    const art=box(.82,1.02,.05,new THREE.MeshBasicMaterial({color:c[0]}),0,0,.07);g.add(art);
    const shape=new THREE.Mesh(new THREE.TorusKnotGeometry(.19,.06,72,12),new THREE.MeshStandardMaterial({color:c[1],roughness:.35,metalness:.3}));shape.position.z=.13;g.add(shape);
    g.position.set(-1.55+i*1.5,2.85,-4.22);scene.add(g);
  });

  // main table
  const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(2.25,2.25,.18,64), mat('#6b3d35',.32,.08));
  tableTop.position.set(0,.82,.15); tableTop.receiveShadow=true; tableTop.castShadow=true; scene.add(tableTop);
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(.36,.56,.9,32), mat('#2b2637',.28,.5)); pedestal.position.set(0,.34,.15); pedestal.castShadow=true;scene.add(pedestal);

  // coffee cup + saucer
  const saucer = new THREE.Mesh(new THREE.CylinderGeometry(.52,.52,.045,48),mat('#f3e7d9',.3,.03)); saucer.position.set(-1.25,.96,1.02);scene.add(saucer);
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(.35,.29,.56,48,1,true),mat('#f4e9dc',.28,.04)); cup.position.set(-1.25,1.25,1.02);cup.castShadow=true;scene.add(cup);
  const coffee = new THREE.Mesh(new THREE.CircleGeometry(.325,48),new THREE.MeshStandardMaterial({color:'#321c16',roughness:.24})); coffee.rotation.x=-Math.PI/2; coffee.position.set(-1.25,1.535,1.02);scene.add(coffee);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(.25,.055,12,28,Math.PI*1.55),mat('#f4e9dc',.3));handle.rotation.set(Math.PI/2,0,-Math.PI/2);handle.position.set(-.93,1.27,1.02);scene.add(handle);

  // pastries
  [[1.45,1.0], [1.72,.55]].forEach((p,i)=>{
    const donut=new THREE.Mesh(new THREE.TorusGeometry(.22,.09,14,32),mat(i?'#f0aa66':'#d98a6d',.46));donut.rotation.x=Math.PI/2;donut.position.set(p[0],1.04,p[1]);donut.castShadow=true;scene.add(donut);
  });

  // pendant lamps
  [-2.2,0,2.2].forEach((x,i)=>{
    scene.add(box(.025,1.15,.025,mat('#261e2f',.4,.55),x,4.8,-.6));
    const shade=new THREE.Mesh(new THREE.ConeGeometry(.42,.42,32,1,true),mat(['#e65a97','#e7b85c','#59cad7'][i],.33,.12));shade.position.set(x,4.16,-.6);shade.rotation.x=Math.PI;scene.add(shade);
    const bulb=new THREE.Mesh(new THREE.SphereGeometry(.09,20,20),new THREE.MeshBasicMaterial({color:'#ffe9a9'}));bulb.position.set(x,3.98,-.6);scene.add(bulb);
  });

  // plants
  [[4.7,-3.4],[-5.0,2.4]].forEach(([x,z])=>{
    const pot=new THREE.Mesh(new THREE.CylinderGeometry(.45,.34,.65,24),mat('#c26963',.55));pot.position.set(x,.3,z);scene.add(pot);
    for(let i=0;i<8;i++){
      const leaf=new THREE.Mesh(new THREE.SphereGeometry(.12,16,12),mat(i%2?'#56aa78':'#78ca8b',.62));
      leaf.scale.set(.8,2.8,.55); const a=i/8*Math.PI*2; leaf.position.set(x+Math.cos(a)*.34,.95+Math.sin(i)*.12,z+Math.sin(a)*.34);leaf.rotation.z=Math.cos(a)*.45;scene.add(leaf);
    }
  });

  // neon sign
  const signTex = makeTextTexture('CODE  +  COFFEE', '#fff3b0', '#3b174a', 1024, 250);
  const signMat = new THREE.MeshBasicMaterial({map:signTex,transparent:true,toneMapped:false});
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.6,.9),signMat); sign.position.set(0,4.0,-4.10);scene.add(sign);
}

function makeTextTexture(text, fg='#fff', bg='transparent', w=1024, h=512){
  const c=document.createElement('canvas'); c.width=w;c.height=h; const x=c.getContext('2d');
  if(bg!=='transparent'){x.fillStyle=bg;x.fillRect(0,0,w,h)}
  x.textAlign='center';x.textBaseline='middle';x.font=`700 ${Math.round(h*.32)}px Space Grotesk, Arial`;x.fillStyle=fg;
  x.shadowColor=fg;x.shadowBlur=28;x.fillText(text,w/2,h/2);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t;
}

function buildLaptop(){
  laptop = new THREE.Group();
  laptop.position.set(0,1.02,-.15);
  scene.add(laptop);

  const aluminium = new THREE.MeshPhysicalMaterial({color:'#34323d',roughness:.24,metalness:.72,clearcoat:.25});
  const dark = new THREE.MeshStandardMaterial({color:'#15131b',roughness:.33,metalness:.35});

  const base=box(3.45,.16,2.18,aluminium,0,.05,.42);base.geometry.translate(0,0,0);laptop.add(base);
  const inset=box(3.12,.04,1.82,dark,0,.15,.34);laptop.add(inset);
  const trackpad=box(1.35,.025,.66,mat('#4e4b56',.26,.58),0,.18,.92);laptop.add(trackpad);

  // keyboard
  const keyMat = mat('#222029',.42,.2);
  const rows=5, cols=12;
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      if(r===4 && (c<3 || c>8)) continue;
      const k=box(c===5&&r===4?.88:.19,.035,.17,keyMat,(c-(cols-1)/2)*.245,.18,-.22+r*.22);
      laptop.add(k);
    }
  }

  const hinge=box(3.0,.12,.14,mat('#1d1b22',.28,.6),0,.2,-.62);laptop.add(hinge);

  screenGroup = new THREE.Group();
  screenGroup.position.set(0,1.23,-.66);
  screenGroup.rotation.x=-.055;
  laptop.add(screenGroup);
  const frame=box(3.48,2.2,.13,aluminium,0,0,0);screenGroup.add(frame);
  const screenMat=new THREE.MeshPhysicalMaterial({color:'#100e20',roughness:.18,metalness:.05,clearcoat:1,clearcoatRoughness:.08});
  const screen=box(3.20,1.91,.035,screenMat,0,0,.085);screenGroup.add(screen);

  // screen glow
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(3.12,1.83),new THREE.MeshBasicMaterial({color:'#231346',transparent:true,opacity:.66,toneMapped:false}));
  glow.position.z=.108;screenGroup.add(glow);

  screenTarget = new THREE.Mesh(new THREE.PlaneGeometry(3.25,1.95),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));
  screenTarget.position.z=.13;screenTarget.userData.isScreen=true;screenGroup.add(screenTarget);

  createLanguageCards();
}

function createLanguageCards(){
  const texLoader=new THREE.TextureLoader(); texLoader.setCrossOrigin('anonymous');
  const cols=4, rows=3;
  languages.forEach((lang,i)=>{
    const group=new THREE.Group();
    const col=i%cols, row=Math.floor(i/cols);
    group.position.set((col-1.5)*.75,(1-row)*.56,.16);
    group.userData.langIndex=i; group.userData.isCard=true; group.userData.baseY=group.position.y;

    const body=new THREE.Mesh(new THREE.BoxGeometry(.66,.47,.075),new THREE.MeshPhysicalMaterial({color:new THREE.Color(lang.color).multiplyScalar(.34),roughness:.26,metalness:.18,transparent:true,opacity:.94,clearcoat:.55}));
    body.castShadow=true;group.add(body);

    const iconMat=new THREE.MeshBasicMaterial({transparent:true,toneMapped:false,depthTest:true});
    const icon=new THREE.Mesh(new THREE.PlaneGeometry(.23,.23),iconMat); icon.position.set(-.16,.035,.043);group.add(icon);
    texLoader.load(`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${lang.icon}`,t=>{t.colorSpace=THREE.SRGBColorSpace;iconMat.map=t;iconMat.needsUpdate=true;},undefined,()=>{
      iconMat.map=makeTextTexture(lang.name.slice(0,2).toUpperCase(),'#ffffff','transparent',256,256);iconMat.needsUpdate=true;
    });

    const labelTex=makeLabelTexture(lang.name);
    const label=new THREE.Mesh(new THREE.PlaneGeometry(.34,.13),new THREE.MeshBasicMaterial({map:labelTex,transparent:true,toneMapped:false}));
    label.position.set(.13,-.02,.044);group.add(label);

    const rim=new THREE.LineSegments(new THREE.EdgesGeometry(body.geometry),new THREE.LineBasicMaterial({color:lang.color,transparent:true,opacity:.38}));group.add(rim);
    screenGroup.add(group);interactiveCards.push(group);floaters.push(group);
  });
}

function makeLabelTexture(text){
  const c=document.createElement('canvas');c.width=512;c.height=180;const x=c.getContext('2d');
  x.clearRect(0,0,c.width,c.height);x.fillStyle='#ffffff';x.textAlign='center';x.textBaseline='middle';
  x.font=`700 ${text.length>9?54:66}px Space Grotesk, Arial`;x.fillText(text,c.width/2,c.height/2);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}

function buildAtmosphere(){
  // floating dust / colorful bokeh
  const count=180;const pos=new Float32Array(count*3);const colors=new Float32Array(count*3);const palette=['#ff85b9','#7cecff','#ffd37f','#b39aff'];
  for(let i=0;i<count;i++){
    pos[i*3]=(Math.random()-.5)*15;pos[i*3+1]=Math.random()*5.8;pos[i*3+2]=(Math.random()-.5)*11;
    const c=new THREE.Color(palette[i%palette.length]);colors.set([c.r,c.g,c.b],i*3);
  }
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
  const points=new THREE.Points(geo,new THREE.PointsMaterial({size:.035,vertexColors:true,transparent:true,opacity:.62,depthWrite:false,blending:THREE.AdditiveBlending}));points.userData.dust=true;scene.add(points);floaters.push(points);

  // steam particles
  for(let i=0;i<18;i++){
    const p=new THREE.Mesh(new THREE.SphereGeometry(.018,8,8),new THREE.MeshBasicMaterial({color:'#fff3e8',transparent:true,opacity:.0}));
    p.position.set(-1.25+(Math.random()-.5)*.12,1.55+Math.random()*.8,1.02+(Math.random()-.5)*.08);p.userData.offset=Math.random();scene.add(p);steam.push(p);
  }
}

function loadReadyMadeProps(){
  const loader=new GLTFLoader();
  const load=(url, setup, label)=>{
    loadStatus.textContent=label;
    const p=new Promise(resolve=>{
      loader.load(url,g=>{setup(g.scene);resolve();},undefined,e=>{console.warn('Optional prop failed',url,e);resolve();});
    });
    readyTasks.push(p);
  };
  const chairURL='https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Assets@main/Models/SheenChair/glTF-Binary/SheenChair.glb';
  load(chairURL,model=>{
    model.scale.setScalar(1.15);model.position.set(2.1,0,-.25);model.rotation.y=-2.25;prepareModel(model);scene.add(model);
    const second=model.clone();second.position.set(-1.85,0,1.72);second.rotation.y=.7;scene.add(second);
  },'چیدن صندلی‌های سه‌بعدی');

  const lanternURL='https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Assets@main/Models/Lantern/glTF-Binary/Lantern.glb';
  load(lanternURL,model=>{
    model.scale.setScalar(.28);model.position.set(3.8,1.15,-2.85);model.rotation.y=-.4;prepareModel(model);scene.add(model);
  },'افزودن جزئیات کافه');
}
function prepareModel(root){root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}})}

function bindEvents(){
  addEventListener('resize',onResize);
  canvas.addEventListener('pointermove',onPointerMove);
  canvas.addEventListener('pointerup',onPointerUp);
  focusLaptopBtn.addEventListener('click',enterLaptop);
  homeBtn.addEventListener('click',leaveLaptop);
  closePanel.addEventListener('click',()=>panel.classList.remove('open'));
  enterBtn.addEventListener('click',()=>{entry.classList.remove('visible');startMusic();});
  musicBtn.addEventListener('click',toggleMusic);
}

function setPointer(e){const r=canvas.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;}
function findCard(obj){while(obj){if(obj.userData?.isCard)return obj;obj=obj.parent;}return null;}

function onPointerMove(e){
  setPointer(e);raycaster.setFromCamera(pointer,camera);
  const targets=laptopMode?[...interactiveCards,screenTarget]:[screenTarget];
  const hits=raycaster.intersectObjects(targets,true);
  const card=hits.length?findCard(hits[0].object):null;
  if(hoveredCard!==card){
    if(hoveredCard)hoveredCard.userData.hover=false;
    hoveredCard=card;if(hoveredCard)hoveredCard.userData.hover=true;
  }
  canvas.style.cursor=hits.length?'pointer':'grab';
}
function onPointerUp(e){
  setPointer(e);raycaster.setFromCamera(pointer,camera);
  const targets=laptopMode?[...interactiveCards,screenTarget]:[screenTarget];
  const hits=raycaster.intersectObjects(targets,true);
  if(!hits.length)return;
  const card=findCard(hits[0].object);
  if(laptopMode&&card){showLanguage(card.userData.langIndex,card);return;}
  if(hits.some(h=>h.object===screenTarget||h.object.userData?.isScreen))enterLaptop();
}

function enterLaptop(){
  laptopMode=true;panel.classList.remove('open');hero.classList.add('hidden-ui');hint.classList.add('hidden-ui');homeBtn.classList.remove('hidden');screenTitle.classList.add('visible');
  controls.enabled=false;tweenCamera(laptopCam,laptopTarget,1.15,()=>{controls.target.copy(laptopTarget);controls.minDistance=2.4;controls.maxDistance=4.8;controls.minPolarAngle=1.05;controls.maxPolarAngle=1.45;controls.enabled=true;});
}
function leaveLaptop(){
  laptopMode=false;panel.classList.remove('open');hero.classList.remove('hidden-ui');hint.classList.remove('hidden-ui');homeBtn.classList.add('hidden');screenTitle.classList.remove('visible');
  controls.enabled=false;tweenCamera(initialCam,initialTarget,1.05,()=>{controls.target.copy(initialTarget);controls.minDistance=4.5;controls.maxDistance=13;controls.minPolarAngle=.72;controls.maxPolarAngle=1.48;controls.enabled=true;});
}

function tweenCamera(toPos,toTarget,duration,onDone){
  cameraTween={fromPos:camera.position.clone(),toPos:toPos.clone(),fromTarget:controls.target.clone(),toTarget:toTarget.clone(),start:performance.now(),duration:duration*1000,onDone};
}
function updateCameraTween(now){
  if(!cameraTween)return;
  let t=Math.min(1,(now-cameraTween.start)/cameraTween.duration);const e=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  camera.position.lerpVectors(cameraTween.fromPos,cameraTween.toPos,e);controls.target.lerpVectors(cameraTween.fromTarget,cameraTween.toTarget,e);camera.lookAt(controls.target);
  if(t>=1){const done=cameraTween.onDone;cameraTween=null;done?.();}
}

function showLanguage(index,card){
  const l=languages[index];activeCard=card;
  $('panelIcon').src=`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${l.icon}`;
  $('panelTitle').textContent=l.name;$('panelCategory').textContent=l.category;$('panelDescription').textContent=l.desc;
  $('panelTags').innerHTML=l.tags.map(t=>`<span>${t}</span>`).join('');
  $('languageAccent').style.background=`linear-gradient(90deg,${l.color},#ffffff)`;
  panel.classList.add('open');
}

function animate(now=0){
  requestAnimationFrame(animate);
  const t=clock.getElapsedTime();
  updateCameraTween(performance.now());
  controls.update();

  interactiveCards.forEach((g,i)=>{
    const target=g.userData.hover?1.09:(activeCard===g&&panel.classList.contains('open')?1.06:1);
    g.scale.lerp(new THREE.Vector3(target,target,target),.13);
    g.position.y=g.userData.baseY+Math.sin(t*1.25+i*.73)*.012;
  });

  steam.forEach((p,i)=>{
    const u=(t*.17+p.userData.offset)%1;p.position.y=1.57+u*.95;p.position.x=-1.25+Math.sin(t*1.7+i)*(.025+u*.06);
    p.material.opacity=Math.sin(Math.PI*u)*.14;p.scale.setScalar(.8+u*2.1);
  });

  const dust=floaters.find(f=>f.userData?.dust);if(dust)dust.rotation.y=t*.012;
  if(laptop){laptop.rotation.y=Math.sin(t*.42)*.006;}
  renderer.render(scene,camera);
}

function onResize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));}

// Small generative lo-fi soundtrack. It starts after the explicit “enter café” gesture,
// which keeps the experience compatible with modern browser autoplay rules.
function startMusic(){
  if(musicOn)return;
  audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
  audioCtx.resume();
  ambientMaster=audioCtx.createGain();ambientMaster.gain.value=.16;ambientMaster.connect(audioCtx.destination);
  musicOn=true;musicBtn.textContent='♫';
  scheduleChord();
  musicTimer=setInterval(scheduleChord,7600);
}
function scheduleChord(){
  if(!audioCtx||!musicOn)return;
  const progressions=[[130.81,164.81,196,246.94],[110,138.59,164.81,207.65],[146.83,174.61,220,261.63],[98,123.47,146.83,185]];
  const chord=progressions[Math.floor((audioCtx.currentTime/7.6)%progressions.length)];
  const now=audioCtx.currentTime;
  chord.forEach((f,i)=>{
    const osc=audioCtx.createOscillator(),gain=audioCtx.createGain(),filter=audioCtx.createBiquadFilter();
    osc.type=i===0?'sine':'triangle';osc.frequency.value=f;filter.type='lowpass';filter.frequency.value=760;
    gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(i===0?.05:.027,now+.35);gain.gain.exponentialRampToValueAtTime(.0001,now+7.2);
    osc.connect(filter);filter.connect(gain);gain.connect(ambientMaster);osc.start(now);osc.stop(now+7.4);
  });
  // sparse bell notes
  [0.7,2.45,4.2,5.8].forEach((d,i)=>{
    const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type='sine';osc.frequency.value=chord[(i+1)%chord.length]*2;
    gain.gain.setValueAtTime(.0001,now+d);gain.gain.exponentialRampToValueAtTime(.018,now+d+.03);gain.gain.exponentialRampToValueAtTime(.0001,now+d+.9);
    osc.connect(gain);gain.connect(ambientMaster);osc.start(now+d);osc.stop(now+d+1);
  });
}
function toggleMusic(){
  if(!audioCtx){startMusic();return;}
  if(musicOn){musicOn=false;clearInterval(musicTimer);musicTimer=null;ambientMaster?.gain.setTargetAtTime(.0001,audioCtx.currentTime,.08);musicBtn.textContent='♪';}
  else{ambientMaster?.disconnect();startMusic();}
}
