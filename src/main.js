import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 20, 50);

// Create canvas and renderer
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000011);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Create Sun
const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffff00,
    emissive: 0xffff00,
    emissiveIntensity: 0.5
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create planets
const planets = [];
const planetData = [
    { radius: 0.5, distance: 8, speed: 0.02, color: 0x8B4513, name: 'Mercury' },
    { radius: 0.8, distance: 12, speed: 0.015, color: 0xFFA500, name: 'Venus' },
    { radius: 1, distance: 16, speed: 0.01, color: 0x0000FF, name: 'Earth' },
    { radius: 0.6, distance: 20, speed: 0.008, color: 0xFF0000, name: 'Mars' },
    { radius: 2.5, distance: 28, speed: 0.005, color: 0xFFD700, name: 'Jupiter' },
    { radius: 2, distance: 36, speed: 0.003, color: 0xFFA500, name: 'Saturn' }
];

planetData.forEach((data, index) => {
    // Create planet
    const planetGeometry = new THREE.SphereGeometry(data.radius, 32, 32);
    const planetMaterial = new THREE.MeshBasicMaterial({ color: data.color });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    
    // Position planet in orbit
    const angle = (index / planetData.length) * Math.PI * 2;
    planet.position.x = Math.cos(angle) * data.distance;
    planet.position.z = Math.sin(angle) * data.distance;
    
    // Create orbit line
    const orbitGeometry = new THREE.RingGeometry(data.distance - 0.1, data.distance + 0.1, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x444444, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = -Math.PI / 2;
    
    // Store planet data
    planets.push({
        mesh: planet,
        orbit: orbit,
        distance: data.distance,
        speed: data.speed,
        angle: angle
    });
    
    scene.add(planet);
    scene.add(orbit);
});

// Add stars (particles)
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 1000;
const starsPositions = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount * 3; i += 3) {
    starsPositions[i] = (Math.random() - 0.5) * 200;
    starsPositions[i + 1] = (Math.random() - 0.5) * 200;
    starsPositions[i + 2] = (Math.random() - 0.5) * 200;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
const starsMaterial = new THREE.PointsMaterial({ 
    color: 0xffffff, 
    size: 0.5,
    transparent: true,
    opacity: 0.8
});
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate sun
    sun.rotation.y += 0.005;
    
    // Animate planets
    planets.forEach(planet => {
        planet.angle += planet.speed;
        planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
        planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
        planet.mesh.rotation.y += 0.02;
    });
    
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
