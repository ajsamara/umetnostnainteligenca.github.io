import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("canvas"), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 10, 7.5);
dirLight.castShadow = true;
scene.add(dirLight);


const groundGeometry = new THREE.PlaneGeometry(100, 100);

const texture = new THREE.TextureLoader().load('texture.jpg');
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(20, 20);

const texturedMaterial = new THREE.MeshStandardMaterial({ map: texture });
const plainMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });

let currentMaterial = texturedMaterial;

const ground = new THREE.Mesh(groundGeometry, currentMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);


window.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "m") {
    currentMaterial = currentMaterial === texturedMaterial ? plainMaterial : texturedMaterial;
    ground.material = currentMaterial;
    console.log("Ground material changed");
  }
});

let soldier;
let originalScale = new THREE.Vector3(1, 1, 1);

const loader = new GLTFLoader();
loader.load("Soldier.glb", gltf => {
  soldier = gltf.scene;
  originalScale = new THREE.Vector3(1, 1, 1);
  soldier.scale.copy(originalScale);
  soldier.position.set(0, 0, 0);
  soldier.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(soldier);
}, undefined, error => console.error("Failed to load Soldier.glb", error));


let solved = 0;
const total = 10;
let timer = 20;
let countdown;
let currentAnswer = 0;
let gameActive = false;

const questionEl = document.getElementById("captcha-question");
const inputEl = document.getElementById("captcha-input");
const submitBtn = document.getElementById("submit");
const startBtn = document.getElementById("start-game");
const progressEl = document.getElementById("progress");
const timerEl = document.getElementById("timer");
const gameOverEl = document.getElementById("game-over");

function generateCaptcha() {
  const a = Math.floor(Math.random() * 10 + 1);
  const b = Math.floor(Math.random() * 10 + 1);
  const opIndex = Math.floor(Math.random() * 3);
  const operators = ["+", "-", "*"];
  const op = operators[opIndex];
  questionEl.innerText = `What is ${a} ${op} ${b}?`;
  currentAnswer = eval(`${a} ${op} ${b}`);
}

function startGame() {
  solved = 0;
  timer = 20;
  gameActive = true;
  inputEl.disabled = false;
  submitBtn.disabled = false;
  startBtn.style.display = "none";
  gameOverEl.textContent = "";
  progressEl.textContent = `Solved: ${solved}/${total}`;
  generateCaptcha();

  if (soldier) soldier.scale.copy(originalScale);

  countdown = setInterval(() => {
    timer--;
    timerEl.textContent = `Time left: ${timer}s`;
    if (timer <= 0) endGame(false);
  }, 1000);
}

function endGame(won) {
  clearInterval(countdown);
  inputEl.disabled = true;
  submitBtn.disabled = true;
  gameActive = false;
  gameOverEl.textContent = won ? "🎉 You Won!" : "⏱ Game Over!";
  startBtn.style.display = "block";
}

submitBtn.addEventListener("click", () => {
  const val = parseInt(inputEl.value.trim());
  inputEl.value = "";

  if (val === currentAnswer) {
    solved++;
    progressEl.textContent = `Solved: ${solved}/${total}`;
    if (soldier) soldier.scale.copy(originalScale);
    if (solved >= total) {
      endGame(true);
      return;
    }
    generateCaptcha();
  } else {
    if (soldier) {
      let newScale = Math.max(0.1, soldier.scale.x - 0.1);
      soldier.scale.set(newScale, newScale, newScale);
    }
  }
});

inputEl.addEventListener("keypress", e => {
  if (e.key === "Enter") submitBtn.click();
});

startBtn.addEventListener("click", startGame);

function animate() {
  requestAnimationFrame(animate);
  if (soldier && gameActive) {
    soldier.rotation.y += 0.01;
  }
  controls.update();
  renderer.render(scene, camera);
}
animate();
