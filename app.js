import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/environments/RoomEnvironment.js';

const $ = (id) => document.getElementById(id);
const canvas = $('scene');
const loading = $('loading');
const loadStatus = $('loadStatus');
const entry = $('entry');
const panel = $('languagePanel');
const screenTitle = $('screenTitle');
const hotspotsLayer = $('screenHotspots');

const languages = [
  {id:'python', name:'Python', icon:'python/python-original.svg', color:'#ffd85b', category:'GENERAL • AI • DATA', desc:'پایتون زبانی خوانا و چندمنظوره است که برای هوش مصنوعی، یادگیری ماشین، علم داده، اتوماسیون، بک‌اند وب و اسکریپت‌نویسی بسیار پرکاربرد است.', tags:['هوش مصنوعی','علم داده','Backend','Automation']},
  {id:'javascript', name:'JavaScript', icon:'javascript/javascript-original.svg', color:'#f7df1e', category:'WEB • FULL STACK', desc:'جاوااسکریپت زبان اصلی تعامل در وب است؛ از رابط‌های کاربری مرورگر تا سرور با Node.js، اپلیکیشن‌های موبایل و تجربه‌های سه‌بعدی WebGL استفاده می‌شود.', tags:['Frontend','Node.js','WebGL','Mobile']},
  {id:'typescript', name:'TypeScript', icon:'typescript/typescript-original.svg', color:'#4d9dff', category:'WEB • LARGE APPS', desc:'تایپ‌اسکریپت نسخه type-safe جاوااسکریپت است و برای پروژه‌های بزرگ وب، React، Angular و بک‌اندهای مدرن بسیار مناسب است.', tags:['Frontend','Backend','Type Safety','Enterprise']},
  {id:'cpp', name:'C++', icon:'cplusplus/cplusplus-original.svg', color:'#6295cb', category:'SYSTEMS • GAMES', desc:'سی‌پلاس‌پلاس برای موتورهای بازی، گرافیک، شبیه‌سازی، رباتیک، سیستم‌های نهفته و نرم‌افزارهای بسیار سریع کاربرد دارد.', tags:['Game Engine','Robotics','Graphics','Systems']},
  {id:'csharp', name:'C#', icon:'csharp/csharp-original.svg', color:'#9b5cff', category:'GAMES • .NET', desc:'سی‌شارپ زبان اصلی اکوسیستم .NET و از مهم‌ترین زبان‌ها برای Unity، وب‌سرویس‌ها و نرم‌افزارهای دسکتاپ است.', tags:['Unity','Game Dev','.NET','Desktop']},
  {id:'java', name:'Java', icon:'java/java-original.svg', color:'#ff704d', category:'ENTERPRISE • ANDROID', desc:'جاوا در سامانه‌های سازمانی، بک‌اندهای مقیاس‌پذیر، سرویس‌های بزرگ و بسیاری از پروژه‌های اندرویدی استفاده می‌شود.', tags:['Enterprise','Backend','Android','Cloud']},
  {id:'swift', name:'Swift', icon:'swift/swift-original.svg', color:'#ff674d', category:'APPLE • IOS', desc:'سوئیفت زبان مدرن اپل برای ساخت اپلیکیشن‌های iPhone، iPad، Mac، Apple Watch و visionOS است.', tags:['iOS','macOS','SwiftUI','visionOS']},
  {id:'kotlin', name:'Kotlin', icon:'kotlin/kotlin-original.svg', color:'#b06cff', category:'ANDROID • JVM', desc:'کاتلین زبان مدرن توسعه اندروید است و برای Kotlin Multiplatform و بک‌اند JVM نیز استفاده می‌شود.', tags:['Android','KMP','Backend','JVM']},
  {id:'go', name:'Go', icon:'go/go-original-wordmark.svg', color:'#59d7e8', category:'CLOUD • BACKEND', desc:'Go برای سرویس‌های ابری، APIهای سریع، DevOps، شبکه و سیستم‌های همزمان بسیار مناسب است.', tags:['Cloud','DevOps','Backend','Networking']},
  {id:'rust', name:'Rust', icon:'rust/rust-original.svg', color:'#f09161', category:'SYSTEMS • SAFE', desc:'Rust برای برنامه‌نویسی سطح سیستم با سرعت بالا و ایمنی حافظه، WebAssembly و Embedded کاربرد دارد.', tags:['Systems','WebAssembly','Embedded','Performance']},
  {id:'php', name:'PHP', icon:'php/php-original.svg', color:'#8e92d8', category:'WEB • SERVER', desc:'PHP برای بک‌اند وب، WordPress، فروشگاه‌ها و سامانه‌های مدیریت محتوا کاربرد گسترده‌ای دارد.', tags:['Web','WordPress','Backend','CMS']},
  {id:'dart', name:'Dart', icon:'dart/dart-original.svg', color:'#49c7f0', category:'FLUTTER • CROSS PLATFORM', desc:'Dart زبان اصلی Flutter است و برای ساخت اپلیکیشن‌های موبایل، وب و دسکتاپ چندسکویی استفاده می‌شود.', tags:['Flutter','Mobile','Web','Cross-platform']}
];

let scene, camera, renderer, controls, laptop, screenGroup, screenTarget;
let laptopMode = false;
let activeCard = null;
let cameraTween = null;
let audioCtx = null;
let musicTimer = null;
let musicOn = false;
let ambientMaster = null;

const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const cards = [];
const steam = [];
const readyTasks = [];
const temporaryVectors = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];

const initialCam = new THREE.Vector3(6.8, 4.15, 8.35);
const initialTarget = new THREE.Vector3(0, 1.52, 0);
const laptopCam = new THREE.Vector3(0, 2.08, 3.28);
const laptopTarget = new THREE.Vector3(0, 2.02, -0.34);

try { init(); } catch (err) {
  console.error(err);
  $('fallback').classList.remove('hidden');
  loading.classList.add('done');
}

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#0c0812');
  scene.fog = new THREE.FogExp2('#0c0812', 0.026);

  camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.05, 80);
  camera.position.copy(initialCam);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  controls = new OrbitControls(camera, canvas);
  controls.target.copy(initialTarget);
  controls.enableDamping = true;
  controls.dampingFactor = 0.055;
  controls.minDistance = 4.5;
  controls.maxDistance = 13;
  controls.minPolarAngle = 0.72;
  controls.maxPolarAngle = 1.48;
  controls.enablePan = false;

  buildLighting();
  buildCafe();
  buildLaptop();
  buildAtmosphere();
  buildHotspots();
  loadReadyMadeProps();
  bindEvents();

  camera.lookAt(initialTarget);
  animate();

  Promise.race([
    Promise.allSettled(readyTasks),
    new Promise((resolve) => setTimeout(resolve, 6500))
  ]).then(() => {
    loadStatus.textContent = 'کافه آماده است';
    setTimeout(() => {
      loading.classList.add('done');
      entry.classList.add('visible');
    }, 350);
  });
}

function mat(color, roughness = 0.55, metalness = 0.08) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function box(w, h, d, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function makeWoodTexture() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 1024;
  const x = c.getContext('2d');
  const grd = x.createLinearGradient(0, 0, 1024, 0);
  grd.addColorStop(0, '#5c3525');
  grd.addColorStop(0.5, '#8a5637');
  grd.addColorStop(1, '#4b2b20');
  x.fillStyle = grd;
  x.fillRect(0, 0, 1024, 1024);
  x.globalAlpha = 0.28;
  for (let i = 0; i < 220; i++) {
    x.strokeStyle = i % 3 === 0 ? '#2c1712' : '#c48555';
    x.lineWidth = Math.random() * 2 + 0.4;
    x.beginPath();
    const y = Math.random() * 1024;
    x.moveTo(0, y);
    for (let p = 0; p <= 1024; p += 64) {
      x.lineTo(p, y + Math.sin(p * 0.018 + i) * (3 + Math.random() * 4));
    }
    x.stroke();
  }
  x.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(c);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3.5, 3.5);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makePlasterTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const x = c.getContext('2d');
  x.fillStyle = '#39282d'; x.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2600; i++) {
    const a = Math.random() * 0.11;
    x.fillStyle = `rgba(255,220,205,${a})`;
    x.fillRect(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 2);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function buildLighting() {
  scene.add(new THREE.HemisphereLight('#ffe9d4', '#140d18', 1.0));

  const key = new THREE.DirectionalLight('#fff0d6', 3.1);
  key.position.set(4.5, 7.2, 5.0);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.far = 25;
  scene.add(key);

  const warm = new THREE.PointLight('#ff9c69', 20, 9, 2);
  warm.position.set(-3.8, 3.1, -1.6); scene.add(warm);
  const cool = new THREE.PointLight('#5ed7df', 8, 8, 2);
  cool.position.set(4.5, 2.7, -2.8); scene.add(cool);
  const tableLight = new THREE.PointLight('#ffd29c', 18, 7, 2);
  tableLight.position.set(0, 3.8, 1.2); scene.add(tableLight);
}

function buildCafe() {
  const woodTexture = makeWoodTexture();
  const floorMat = new THREE.MeshStandardMaterial({ map: woodTexture, roughness: 0.72, metalness: 0.02 });
  const floor = box(13.5, 0.18, 11.5, floorMat, 0, -0.1, 0);
  scene.add(floor);

  const plaster = makePlasterTexture();
  const wallMat = new THREE.MeshStandardMaterial({ map: plaster, roughness: 0.9, metalness: 0 });
  scene.add(box(12.3, 5.4, 0.3, wallMat, 0, 2.4, -4.55));
  scene.add(box(0.3, 5.4, 9.4, wallMat, -6.15, 2.4, -0.1));

  for (let i = 0; i < 18; i++) {
    const slat = box(0.055, 2.0, 0.08, mat(i % 2 ? '#6f4633' : '#563323', 0.68), -5.2 + i * 0.61, 1.05, -4.34);
    scene.add(slat);
  }
  scene.add(box(11.3, 0.12, 0.12, mat('#aa7650', 0.42), 0, 2.05, -4.27));

  buildWindow(-4.35, 2.85, -4.30, '#22445b', '#9deaff');
  buildWindow(4.25, 2.85, -4.30, '#4a263e', '#ffd887');
  buildCoffeeBar();
  buildMainTable();
  buildSecondaryTables();
  buildPendantLights();
  buildPlants();
  buildWallDecor();
  buildPastryStand();
}

function buildWindow(x, y, z, bg, glow) {
  scene.add(box(2.05, 2.65, 0.12, mat('#2a2226', 0.38, 0.25), x, y, z));
  const inner = box(1.8, 2.38, 0.06, new THREE.MeshBasicMaterial({ color: bg }), x, y, z + 0.08);
  scene.add(inner);
  const moon = new THREE.Mesh(new THREE.CircleGeometry(0.38, 48), new THREE.MeshBasicMaterial({ color: glow }));
  moon.position.set(x + 0.35, y + 0.45, z + 0.13); scene.add(moon);
  for (let i = 0; i < 8; i++) {
    const star = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), new THREE.MeshBasicMaterial({ color: '#fff6dd' }));
    star.position.set(x - 0.7 + Math.random() * 1.4, y - 0.9 + Math.random() * 1.8, z + 0.14); scene.add(star);
  }
}

function buildCoffeeBar() {
  scene.add(box(4.9, 1.12, 0.95, mat('#47302a', 0.5), -3.15, 0.54, -2.85));
  scene.add(box(5.1, 0.14, 1.1, new THREE.MeshStandardMaterial({ color:'#8d583a', roughness:0.28, metalness:0.02 }), -3.15, 1.16, -2.85));
  scene.add(box(4.5, 0.12, 0.42, mat('#7e5239', 0.34), -3.15, 2.55, -4.02));
  scene.add(box(4.1, 0.12, 0.38, mat('#70452f', 0.36), -3.15, 3.18, -4.01));

  const machine = new THREE.Group();
  machine.add(box(1.2, 0.72, 0.55, new THREE.MeshPhysicalMaterial({ color:'#b9b7b1', roughness:0.18, metalness:0.72, clearcoat:0.3 }), 0, 0.4, 0));
  machine.add(box(0.9, 0.12, 0.47, mat('#272429', 0.32, 0.45), 0, 0.78, 0));
  for (const x of [-0.32, 0.32]) {
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.11, 24), mat('#1c1a1e', 0.24, 0.7));
    head.rotation.x = Math.PI / 2; head.position.set(x, 0.25, 0.31); machine.add(head);
    machine.add(box(0.035, 0.035, 0.42, mat('#1a171a', 0.3, 0.75), x + 0.13, 0.2, 0.48));
  }
  machine.position.set(-3.4, 1.22, -2.82); scene.add(machine);

  for (let i = 0; i < 8; i++) {
    const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.115, 0.34 + (i % 2) * 0.08, 20), new THREE.MeshPhysicalMaterial({ color:['#8d5847','#c4955f','#6a8a69','#aa6b51'][i%4], roughness:0.28, clearcoat:0.25 }));
    jar.position.set(-5.0 + i * 0.47, 2.78, -3.98); scene.add(jar);
  }
  for (let i = 0; i < 5; i++) {
    const cup = createCup(0.13, 0.21, '#efe7dd');
    cup.position.set(-4.8 + i * 0.33, 3.28, -3.9); scene.add(cup);
  }

  for (let i = 0; i < 4; i++) {
    const stool = new THREE.Group();
    const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.10, 32), mat('#6a342e', 0.42));
    seat.position.y = 0.72; stool.add(seat);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.065, 0.68, 18), mat('#232126', 0.28, 0.65));
    stem.position.y = 0.35; stool.add(stem);
    const foot = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.025, 10, 28), mat('#232126', 0.28, 0.65));
    foot.rotation.x = Math.PI/2; foot.position.y = 0.18; stool.add(foot);
    stool.position.set(-4.55 + i * 0.9, 0, -1.95); scene.add(stool);
  }
}

function buildMainTable() {
  const wood = new THREE.MeshPhysicalMaterial({ color:'#74472f', roughness:0.27, metalness:0.02, clearcoat:0.35, clearcoatRoughness:0.2 });
  const top = new THREE.Mesh(new THREE.CylinderGeometry(2.12, 2.12, 0.17, 72), wood);
  top.position.set(0, 0.83, 0.15); top.castShadow = top.receiveShadow = true; scene.add(top);
  const edge = new THREE.Mesh(new THREE.TorusGeometry(2.03, 0.065, 16, 72), mat('#3e241b', 0.34));
  edge.rotation.x = Math.PI / 2; edge.position.set(0, 0.80, 0.15); scene.add(edge);
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.48, 0.92, 32), mat('#242126', 0.24, 0.72));
  pedestal.position.set(0, 0.35, 0.15); pedestal.castShadow = true; scene.add(pedestal);
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.08, 40), mat('#242126', 0.28, 0.65));
  foot.position.set(0, 0.02, 0.15); scene.add(foot);

  const cupGroup = createCup(0.34, 0.54, '#f2e8dc', true);
  cupGroup.position.set(-1.27, 0.99, 1.02); scene.add(cupGroup);
  const spoon = box(0.035, 0.018, 0.62, mat('#c8c3bc', 0.16, 0.82), -1.71, 1.02, 0.90);
  spoon.rotation.y = -0.34; scene.add(spoon);
  const napkin = box(0.62, 0.018, 0.50, mat('#b77a67', 0.86), 1.45, 0.94, 1.18);
  napkin.rotation.y = 0.25; scene.add(napkin);

  const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.14, 0.36, 24), new THREE.MeshPhysicalMaterial({ color:'#56766e', roughness:0.2, clearcoat:0.55 }));
  vase.position.set(1.55, 1.07, -0.55); scene.add(vase);
  const stem = box(0.018, 0.42, 0.018, mat('#496b48', 0.8), 1.55, 1.44, -0.55); scene.add(stem);
  const flower = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), mat('#d07c92', 0.65));
  flower.scale.set(1.25, 0.65, 1.25); flower.position.set(1.55, 1.66, -0.55); scene.add(flower);
}

function createCup(radius = 0.25, height = 0.42, color = '#f1e7db', mainCoffee = false) {
  const group = new THREE.Group();
  const ceramic = new THREE.MeshPhysicalMaterial({ color, roughness:0.18, clearcoat:0.78, clearcoatRoughness:0.12, side:THREE.DoubleSide });
  const outer = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.84, height, 64, 1, true), ceramic);
  outer.position.y = height / 2; outer.castShadow = true; group.add(outer);
  const bottom = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.84, radius * 0.84, 0.035, 64), ceramic);
  bottom.position.y = 0.02; group.add(bottom);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.98, radius * 0.065, 12, 64), ceramic);
  rim.rotation.x = Math.PI / 2; rim.position.y = height; group.add(rim);
  const coffee = new THREE.Mesh(new THREE.CircleGeometry(radius * 0.88, 64), new THREE.MeshPhysicalMaterial({ color:'#2c130b', roughness:0.16, clearcoat:0.65 }));
  coffee.rotation.x = -Math.PI / 2; coffee.position.y = height - 0.012; group.add(coffee);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.65, radius * 0.14, 14, 42, Math.PI * 1.55), ceramic);
  handle.rotation.set(Math.PI / 2, 0, -Math.PI / 2); handle.position.set(radius * 0.95, height * 0.53, 0); group.add(handle);
  if (mainCoffee) {
    const saucer = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.48, radius * 1.58, 0.045, 64), ceramic);
    saucer.position.y = -0.035; group.add(saucer);
    for (let i = 0; i < 3; i++) {
      const swirl = new THREE.Mesh(new THREE.TorusGeometry(radius * (0.26 + i * 0.17), radius * 0.025, 8, 38, Math.PI * 1.3), new THREE.MeshBasicMaterial({ color:'#e7c39e' }));
      swirl.rotation.x = Math.PI / 2; swirl.rotation.z = i * 0.4; swirl.position.y = height + 0.004; group.add(swirl);
    }
  }
  return group;
}

function buildSecondaryTables() {
  const spots = [[-3.8, 1.55, 0.82], [3.85, 1.25, 0.78], [4.0, -2.15, 0.75]];
  spots.forEach(([x, z, r], n) => {
    const top = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.10, 48), mat(n % 2 ? '#80513a' : '#6d412f', 0.32));
    top.position.set(x, 0.76, z); top.castShadow = true; scene.add(top);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.18, 0.74, 20), mat('#242126', 0.28, 0.62));
    leg.position.set(x, 0.37, z); scene.add(leg);
    const cup = createCup(0.13, 0.22, '#efe6dc'); cup.position.set(x + 0.20, 0.84, z - 0.08); scene.add(cup);
    const book = box(0.38, 0.035, 0.28, mat(n % 2 ? '#3f6172' : '#8d554b', 0.72), x - 0.20, 0.84, z + 0.12);
    book.rotation.y = n * 0.35; scene.add(book);
  });
}

function buildPendantLights() {
  [-2.4, 0, 2.4].forEach((x, i) => {
    scene.add(box(0.025, 1.0, 0.025, mat('#181519', 0.4, 0.7), x, 4.8, -0.35));
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.42, 36, 1, true), mat(['#8d503a','#ad7a43','#486f68'][i], 0.30));
    shade.position.set(x, 4.18, -0.35); shade.rotation.x = Math.PI; scene.add(shade);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 20), new THREE.MeshBasicMaterial({ color:'#ffdca0' }));
    bulb.position.set(x, 3.98, -0.35); scene.add(bulb);
  });
}

function buildPlants() {
  [[4.75,-3.25],[-5.0,2.45]].forEach(([x,z]) => {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.32,0.62,24), mat('#9e604a',0.62));
    pot.position.set(x,0.30,z); scene.add(pot);
    for(let i=0;i<10;i++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.12,16,12), mat(i%2?'#456f4d':'#5e8d58',0.72));
      leaf.scale.set(0.75,3.0,0.5); const a=i/10*Math.PI*2;
      leaf.position.set(x+Math.cos(a)*0.30,0.95+Math.sin(i)*0.12,z+Math.sin(a)*0.30);
      leaf.rotation.z=Math.cos(a)*0.5; scene.add(leaf);
    }
  });
}

function buildWallDecor() {
  const signTex = makeTextTexture('CODE  +  COFFEE', '#ffe4a5', '#2b171c', 1024, 260);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 0.88), new THREE.MeshBasicMaterial({ map:signTex, toneMapped:false }));
  sign.position.set(0.55, 3.92, -4.12); scene.add(sign);

  const menuTex = makeMenuTexture();
  const menu = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 1.65), new THREE.MeshBasicMaterial({ map:menuTex, toneMapped:false }));
  menu.position.set(-4.65, 3.25, -4.11); scene.add(menu);
}

function makeMenuTexture() {
  const c=document.createElement('canvas'); c.width=600; c.height=700; const x=c.getContext('2d');
  x.fillStyle='#171518'; x.fillRect(0,0,600,700); x.strokeStyle='#a87a54'; x.lineWidth=18; x.strokeRect(8,8,584,684);
  x.textAlign='center'; x.fillStyle='#f4e6cf'; x.font='700 54px Space Grotesk, Arial'; x.fillText('CAFÉ MENU',300,95);
  x.font='500 30px Space Grotesk, Arial';
  ['ESPRESSO  •  4','LATTE  •  6','MOCHA  •  7','CROISSANT  •  5','CODE BREAK  •  ∞'].forEach((t,i)=>x.fillText(t,300,190+i*88));
  const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; return t;
}

function buildPastryStand() {
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.55,0.05,48), new THREE.MeshPhysicalMaterial({ color:'#e9ddd1', roughness:0.2, clearcoat:0.55 }));
  plate.position.set(-1.5, 1.28, -2.55); scene.add(plate);
  for(let i=0;i<4;i++) {
    const pastry = new THREE.Mesh(new THREE.TorusGeometry(0.16,0.055,12,28,Math.PI*1.45), mat(i%2?'#c98042':'#d79a58',0.46));
    pastry.rotation.x=Math.PI/2; pastry.rotation.z=i*0.8; pastry.position.set(-1.75+i*0.17,1.36,-2.55+(i%2)*0.15); scene.add(pastry);
  }
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.65,36,24,0,Math.PI*2,0,Math.PI/2), new THREE.MeshPhysicalMaterial({ color:'#ffffff', transparent:true, opacity:0.14, roughness:0.08, transmission:0.65, thickness:0.03, side:THREE.DoubleSide }));
  dome.position.set(-1.5,1.31,-2.55); scene.add(dome);
}

function makeTextTexture(text, fg='#fff', bg='transparent', w=1024, h=512) {
  const c=document.createElement('canvas'); c.width=w; c.height=h; const x=c.getContext('2d');
  if(bg!=='transparent'){x.fillStyle=bg;x.fillRect(0,0,w,h)}
  x.textAlign='center';x.textBaseline='middle';x.font=`700 ${Math.round(h*0.32)}px Space Grotesk,Arial`;x.fillStyle=fg;
  x.shadowColor=fg;x.shadowBlur=20;x.fillText(text,w/2,h/2);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}

function buildLaptop() {
  laptop = new THREE.Group(); laptop.position.set(0,1.02,-0.15); scene.add(laptop);
  const aluminium = new THREE.MeshPhysicalMaterial({color:'#34323d',roughness:0.24,metalness:0.72,clearcoat:0.25});
  const dark = mat('#15131b',0.33,0.35);
  laptop.add(box(3.45,0.16,2.18,aluminium,0,0.05,0.42));
  laptop.add(box(3.12,0.04,1.82,dark,0,0.15,0.34));
  laptop.add(box(1.35,0.025,0.66,mat('#4e4b56',0.26,0.58),0,0.18,0.92));
  for(let r=0;r<5;r++) for(let c=0;c<12;c++) {
    if(r===4&&(c<3||c>8)) continue;
    laptop.add(box(c===5&&r===4?0.88:0.19,0.035,0.17,mat('#222029',0.42,0.2),(c-5.5)*0.245,0.18,-0.22+r*0.22));
  }
  laptop.add(box(3,0.12,0.14,mat('#1d1b22',0.28,0.6),0,0.2,-0.62));

  screenGroup = new THREE.Group(); screenGroup.position.set(0,1.23,-0.66); screenGroup.rotation.x=-0.055; laptop.add(screenGroup);
  screenGroup.add(box(3.48,2.2,0.13,aluminium));
  screenGroup.add(box(3.2,1.91,0.035,new THREE.MeshPhysicalMaterial({color:'#100e20',roughness:0.16,clearcoat:1,clearcoatRoughness:0.08}),0,0,0.085));
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(3.12,1.83),new THREE.MeshBasicMaterial({color:'#231346',transparent:true,opacity:0.66,toneMapped:false}));
  glow.position.z=0.108;screenGroup.add(glow);
  screenTarget = new THREE.Mesh(new THREE.PlaneGeometry(3.25,1.95),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));
  screenTarget.position.z=0.13;screenTarget.userData.isScreen=true;screenGroup.add(screenTarget);
  createLanguageCards();
}

function createLanguageCards() {
  const loader = new THREE.TextureLoader(); loader.setCrossOrigin('anonymous');
  languages.forEach((lang,i)=>{
    const g=new THREE.Group(); const col=i%4,row=Math.floor(i/4);
    g.position.set((col-1.5)*0.75,(1-row)*0.56,0.16);
    g.userData={languageId:lang.id,baseY:g.position.y,hover:false};
    const body=new THREE.Mesh(new THREE.BoxGeometry(0.66,0.47,0.075),new THREE.MeshPhysicalMaterial({color:new THREE.Color(lang.color).multiplyScalar(0.34),roughness:0.24,metalness:0.16,transparent:true,opacity:0.96,clearcoat:0.65,clearcoatRoughness:0.18}));
    body.castShadow=true;g.add(body);
    const iconMat=new THREE.MeshBasicMaterial({transparent:true,toneMapped:false});
    const icon=new THREE.Mesh(new THREE.PlaneGeometry(0.23,0.23),iconMat); icon.position.set(-0.16,0.035,0.054);g.add(icon);
    loader.load(`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${lang.icon}`,(t)=>{t.colorSpace=THREE.SRGBColorSpace;iconMat.map=t;iconMat.needsUpdate=true});
    const label=new THREE.Mesh(new THREE.PlaneGeometry(0.34,0.13),new THREE.MeshBasicMaterial({map:makeLabelTexture(lang.name),transparent:true,toneMapped:false}));
    label.position.set(0.13,-0.02,0.054);g.add(label);
    const rim=new THREE.LineSegments(new THREE.EdgesGeometry(body.geometry),new THREE.LineBasicMaterial({color:lang.color,transparent:true,opacity:0.42}));g.add(rim);
    screenGroup.add(g); cards.push(g);
  });
}

function makeLabelTexture(text) {
  const c=document.createElement('canvas');c.width=512;c.height=180;const x=c.getContext('2d');
  x.fillStyle='#fff';x.textAlign='center';x.textBaseline='middle';x.font=`700 ${text.length>9?54:66}px Space Grotesk,Arial`;x.fillText(text,256,90);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}

function buildHotspots() {
  hotspotsLayer.innerHTML='';
  cards.forEach((card)=>{
    const lang=languages.find((l)=>l.id===card.userData.languageId);
    const b=document.createElement('button');
    b.type='button'; b.className='screen-hotspot'; b.dataset.lang=lang.id; b.setAttribute('aria-label',lang.name);
    b.addEventListener('pointerenter',()=>{card.userData.hover=true});
    b.addEventListener('pointerleave',()=>{card.userData.hover=false});
    b.addEventListener('click',(e)=>{e.preventDefault();e.stopPropagation();showLanguage(lang.id,card)});
    hotspotsLayer.appendChild(b); card.userData.hotspot=b;
  });
}

function updateHotspots() {
  if(!laptopMode){hotspotsLayer.classList.remove('active');return}
  hotspotsLayer.classList.add('active');
  const w=innerWidth,h=innerHeight,halfW=0.33,halfH=0.235,z=0.07;
  cards.forEach((card)=>{
    const button=card.userData.hotspot;if(!button)return;
    card.updateWorldMatrix(true,false);
    const corners=[[-halfW,-halfH],[halfW,-halfH],[halfW,halfH],[-halfW,halfH]];
    let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity,visible=true;
    corners.forEach(([x,y],i)=>{
      const v=temporaryVectors[i].set(x,y,z);card.localToWorld(v);v.project(camera);
      if(v.z < -1 || v.z > 1) visible=false;
      const sx=(v.x*0.5+0.5)*w, sy=(-v.y*0.5+0.5)*h;
      minX=Math.min(minX,sx);maxX=Math.max(maxX,sx);minY=Math.min(minY,sy);maxY=Math.max(maxY,sy);
    });
    if(!visible || maxX<0 || minX>w || maxY<0 || minY>h){button.style.display='none';return}
    button.style.display='block';
    button.style.left=`${minX}px`;button.style.top=`${minY}px`;button.style.width=`${Math.max(12,maxX-minX)}px`;button.style.height=`${Math.max(12,maxY-minY)}px`;
  });
}

function buildAtmosphere() {
  for(let i=0;i<28;i++) {
    const p=new THREE.Mesh(new THREE.SphereGeometry(0.018,8,8),new THREE.MeshBasicMaterial({color:'#fff3e8',transparent:true,opacity:0}));
    p.position.set(-1.27+(Math.random()-0.5)*0.12,1.56+Math.random()*0.8,1.02+(Math.random()-0.5)*0.08);p.userData.offset=Math.random();scene.add(p);steam.push(p);
  }
  const count=130,pos=new Float32Array(count*3);
  for(let i=0;i<count;i++){pos[i*3]=(Math.random()-0.5)*14;pos[i*3+1]=Math.random()*5.5;pos[i*3+2]=(Math.random()-0.5)*10}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const dust=new THREE.Points(geo,new THREE.PointsMaterial({size:0.018,color:'#ffd8aa',transparent:true,opacity:0.28,depthWrite:false}));scene.add(dust);
}

function loadReadyMadeProps() {
  const loader=new GLTFLoader();
  const load=(url,setup,label)=>{
    loadStatus.textContent=label;
    readyTasks.push(new Promise((resolve)=>{
      let done=false;const finish=()=>{if(!done){done=true;resolve()}};
      const timeout=setTimeout(finish,5500);
      loader.load(url,(g)=>{if(done)return;clearTimeout(timeout);try{setup(g.scene)}catch(e){console.warn(e)}finish()},undefined,(e)=>{clearTimeout(timeout);console.warn('Optional model failed',e);finish()});
    }));
  };

  const chair='https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Assets@main/Models/SheenChair/glTF-Binary/SheenChair.glb';
  load(chair,(m)=>{
    prepareModel(m);m.scale.setScalar(1.02);m.position.set(2.25,0,0.05);m.rotation.y=-2.3;scene.add(m);
    [[-2.05,0,1.65,0.65],[4.55,0,1.0,-1.5],[3.4,0,-2.75,2.6]].forEach(([x,y,z,r])=>{const c=m.clone(true);c.position.set(x,y,z);c.rotation.y=r;scene.add(c)});
  },'چیدن صندلی‌های سه‌بعدی');

  const lantern='https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Assets@main/Models/Lantern/glTF-Binary/Lantern.glb';
  load(lantern,(m)=>{prepareModel(m);m.scale.setScalar(0.25);m.position.set(3.75,1.10,-2.75);m.rotation.y=-0.4;scene.add(m)},'افزودن چراغ و دکور');

  const water='https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Assets@main/Models/WaterBottle/glTF-Binary/WaterBottle.glb';
  load(water,(m)=>{prepareModel(m);m.scale.setScalar(0.55);m.position.set(2.95,0.86,1.25);scene.add(m)},'افزودن جزئیات میزها');
}

function prepareModel(root){root.traverse((o)=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}})}

function bindEvents() {
  addEventListener('resize',onResize);
  canvas.addEventListener('pointermove',onCanvasPointerMove);
  canvas.addEventListener('pointerup',onCanvasPointerUp);
  $('focusLaptop').addEventListener('click',enterLaptop);
  $('homeBtn').addEventListener('click',leaveLaptop);
  $('closePanel').addEventListener('click',()=>panel.classList.remove('open'));
  $('enterBtn').addEventListener('click',()=>{entry.classList.remove('visible');startMusic()});
  $('musicBtn').addEventListener('click',toggleMusic);
}

function setPointer(e){const r=canvas.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width*2-1;pointer.y=-(e.clientY-r.top)/r.height*2+1}
function onCanvasPointerMove(e){if(laptopMode){canvas.style.cursor='grab';return}setPointer(e);raycaster.setFromCamera(pointer,camera);canvas.style.cursor=raycaster.intersectObject(screenTarget,false).length?'pointer':'grab'}
function onCanvasPointerUp(e){if(laptopMode)return;setPointer(e);raycaster.setFromCamera(pointer,camera);if(raycaster.intersectObject(screenTarget,false).length)enterLaptop()}

function enterLaptop() {
  laptopMode=true; panel.classList.remove('open'); $('hero').classList.add('hidden-ui'); $('hint').classList.add('hidden-ui'); $('homeBtn').classList.remove('hidden'); screenTitle.classList.add('visible'); hotspotsLayer.classList.add('active');
  controls.enabled=false;
  tweenCamera(laptopCam,laptopTarget,1.15,()=>{controls.target.copy(laptopTarget);controls.minDistance=2.4;controls.maxDistance=4.8;controls.minPolarAngle=1.05;controls.maxPolarAngle=1.45;controls.enabled=true});
}

function leaveLaptop() {
  laptopMode=false; panel.classList.remove('open'); $('hero').classList.remove('hidden-ui'); $('hint').classList.remove('hidden-ui'); $('homeBtn').classList.add('hidden'); screenTitle.classList.remove('visible'); hotspotsLayer.classList.remove('active');
  cards.forEach((c)=>c.userData.hover=false);
  controls.enabled=false;
  tweenCamera(initialCam,initialTarget,1.05,()=>{controls.target.copy(initialTarget);controls.minDistance=4.5;controls.maxDistance=13;controls.minPolarAngle=0.72;controls.maxPolarAngle=1.48;controls.enabled=true});
}

function tweenCamera(toPos,toTarget,duration,onDone){cameraTween={fromPos:camera.position.clone(),toPos:toPos.clone(),fromTarget:controls.target.clone(),toTarget:toTarget.clone(),start:performance.now(),duration:duration*1000,onDone}}
function updateCameraTween(now){if(!cameraTween)return;let t=Math.min(1,(now-cameraTween.start)/cameraTween.duration);const e=t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;camera.position.lerpVectors(cameraTween.fromPos,cameraTween.toPos,e);controls.target.lerpVectors(cameraTween.fromTarget,cameraTween.toTarget,e);camera.lookAt(controls.target);if(t>=1){const done=cameraTween.onDone;cameraTween=null;done?.()}}

function showLanguage(id,card) {
  const l=languages.find((x)=>x.id===id);if(!l)return;
  activeCard=card;
  $('panelIcon').src=`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${l.icon}`;
  $('panelIcon').alt=`${l.name} logo`;
  $('panelTitle').textContent=l.name;
  $('panelCategory').textContent=l.category;
  $('panelDescription').textContent=l.desc;
  $('panelTags').innerHTML=l.tags.map((t)=>`<span>${t}</span>`).join('');
  $('languageAccent').style.background=`linear-gradient(90deg,${l.color},#fff)`;
  panel.classList.add('open');
}

function animate() {
  requestAnimationFrame(animate);
  const t=clock.getElapsedTime();
  updateCameraTween(performance.now());
  controls.update();

  cards.forEach((g,i)=>{
    const s=g.userData.hover?1.07:(activeCard===g&&panel.classList.contains('open')?1.04:1);
    g.scale.lerp(new THREE.Vector3(s,s,s),0.13);
    g.position.y=g.userData.baseY+Math.sin(t*1.15+i*0.7)*0.004;
  });

  steam.forEach((p,i)=>{
    const u=(t*0.18+p.userData.offset)%1;
    p.position.y=1.56+u*0.95;
    p.position.x=-1.27+Math.sin(t*1.6+i)*(0.02+u*0.05);
    p.material.opacity=Math.sin(Math.PI*u)*0.15;
    p.scale.setScalar(0.8+u*2.1);
  });

  if(laptop) laptop.rotation.y=Math.sin(t*0.35)*0.004;
  renderer.render(scene,camera);
  updateHotspots();
}

function onResize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));updateHotspots()}

function startMusic(){if(musicOn)return;audioCtx||=new(window.AudioContext||window.webkitAudioContext)();audioCtx.resume();ambientMaster=audioCtx.createGain();ambientMaster.gain.value=0.11;ambientMaster.connect(audioCtx.destination);musicOn=true;$('musicBtn').textContent='♫';scheduleChord();musicTimer=setInterval(scheduleChord,7600)}
function scheduleChord(){if(!audioCtx||!musicOn)return;const chords=[[130.81,164.81,196,246.94],[110,138.59,164.81,207.65],[146.83,174.61,220,261.63],[98,123.47,146.83,185]],ch=chords[Math.floor((audioCtx.currentTime/7.6)%4)],now=audioCtx.currentTime;ch.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain(),fl=audioCtx.createBiquadFilter();o.type=i?'triangle':'sine';o.frequency.value=f;fl.type='lowpass';fl.frequency.value=700;g.gain.setValueAtTime(0.0001,now);g.gain.exponentialRampToValueAtTime(i?0.022:0.04,now+0.35);g.gain.exponentialRampToValueAtTime(0.0001,now+7.2);o.connect(fl);fl.connect(g);g.connect(ambientMaster);o.start(now);o.stop(now+7.4)})}
function toggleMusic(){if(!audioCtx){startMusic();return}if(musicOn){musicOn=false;clearInterval(musicTimer);musicTimer=null;ambientMaster?.gain.setTargetAtTime(0.0001,audioCtx.currentTime,0.08);$('musicBtn').textContent='♪'}else{ambientMaster?.disconnect();startMusic()}}
