import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const aspectRatio = sizes.width / sizes.height;

let renderer, scene, camera, material, canvas;
let geometry1, cube;
let geometry2, cone;
let geometry3, sphere;

const clock = new THREE.Clock();


experience();
animate();

function experience() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  camera = new THREE.PerspectiveCamera(60, aspectRatio, 1, 1000);
  camera.position.z = 5;
  scene.add(camera);

  // Ambient Light
  dirLight();


  //Chão
  createFloor();

  //Cubo
  geometry1 = new THREE.BoxGeometry(1, 1, 1);
  texture("textura.jpg");
  cube = new THREE.Mesh(geometry1, material);
  cube.position.z = -5
  cube.position.y = 0.5;
  cube.castShadow = true;

  //Cone
  geometry2 = new THREE.ConeGeometry(0.5, 1, 15);
  texture("textura2.jpg");
  cone = new THREE.Mesh(geometry2, material);
  cone.position.x = 2;
  cone.position.z = 1;
  cone.position.y = 0.5;
  cone.castShadow = true;
  
  //Esfera
  geometry3 = new THREE.SphereGeometry(0.5, 10, 10);
  texture("texture3.jpg");
  sphere = new THREE.Mesh(geometry3, material);
  sphere.position.x = -2;
  sphere.position.z = -1;
  sphere.position.y = 0.5;
  sphere.castShadow = true;
  
  scene.add(cube, cone, sphere);
  

  canvas = document.getElementById("app");
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvas.appendChild(renderer.domElement);
  renderer.render(scene, camera);
}

function animate() {
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  cube.rotation.z += 0.0;

  while (cube.position.x < 1) {
    cube.translateX(0.01);
  }

  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

let controls = new OrbitControls(camera, renderer.domElement);

controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.PAN,
};
controls.update();


//função para importar a textura personalizada
function texture(src) {
    let source = src;
    let loader = new THREE.TextureLoader();
    let texture = loader.load(src);
    texture.colorSpace = THREE.SRGBColorSpace;
    material = new THREE.MeshBasicMaterial({
      map: texture,
    });
}

function createFloor() {
  const floorGeometry = new THREE.PlaneGeometry(50, 50); // Width and height of the plane
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x999999,
    side: THREE.DoubleSide,
  }); // Color it gray for now
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);

  // Rotate the floor to be horizontal (plane geometries are vertical by default)
  floor.rotation.x = Math.PI / 2;

  // Add shadow properties to the floor
  floor.receiveShadow = true;

  scene.add(floor);
};

function dirLight() {
  const light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(2, 5, 2);
  light.castShadow = true;

  // Aumentando o volume de visão da câmera de sombra
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 200; // estende a profundidade da sombra

  light.shadow.camera.left = -50;
  light.shadow.camera.right = 50;
  light.shadow.camera.top = 50;
  light.shadow.camera.bottom = -50;

  // Alta resolução para sombras mais suaves
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;

  scene.add(light);

  // Opcional: helper para ver o volume da sombra
  // const helper = new THREE.CameraHelper(light.shadow.camera);
  // scene.add(helper);
};

