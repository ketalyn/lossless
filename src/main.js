import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui';

// Create Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const initialCameraPosition = new THREE.Vector3(0, 0, 2);
camera.position.copy(initialCameraPosition);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth controls

// Define Cube Lines (Each Line is a Separate Object)
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const lineSegments = [];

// Cube Edge Coordinates (Manually Defined)
const edges = [
    [[0.5, 1.2, -1], [1, 1, -1], [3, 1, -1]],
    [[-3, -1.2, -1], [-2.5, -1.4, -1], [-0.5, -1.4, -1]],
    [[-1, 2, -3], [-1.8, 1.1, -1], [-2.1, 0.8, -1],[-3, 0.5, -1]],
    [[0, 1, -2], [1.5, 1, -2]],
    [[1.5, 3, -1], [1.5, 0.32, -1]],
    [[-3.65, -1.35, -3], [-3.65, -0.85, -3]],
];

// Create and Store Each Line
edges.forEach((pointsArray) => {
    const points = pointsArray.map(p => new THREE.Vector3(...p));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, lineMaterial);
    scene.add(line);
    lineSegments.push({ line, points });
});

// Add Line Art Circles with Custom Positions
const circleMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
const circles = [];
const circlePositions = [
    { x: -0.5, y: -1, z: -5 },
    { x: 0.2, y: -0.6, z: -5 },
    { x: 0.8, y: 0, z: -5 },
    { x: 1.2, y: 0.5, z: -5 },
    { x: 1.6, y: 1, z: -5 },
    { x: 1.2, y: 0.2, z: -1 }
];

circlePositions.forEach(pos => {
    const geometry = new THREE.CircleGeometry(0.2, 32);
    geometry.deleteAttribute('normal');
    geometry.deleteAttribute('uv');
    const edges = new THREE.EdgesGeometry(geometry);
    const circle = new THREE.LineSegments(edges, circleMaterial);
    circle.position.set(pos.x, pos.y, pos.z);
    scene.add(circle);
    circles.push(circle);
});

// dat.GUI (Controls for Moving and Rotating Elements)
const gui = new GUI();

// Line Controls
const lineFolder = gui.addFolder('Line Adjustments');
lineSegments.forEach((segment, index) => {
    const subFolder = lineFolder.addFolder(`Line ${index + 1}`);
    subFolder.add(segment.line.position, "x", -2, 2).name("X").onChange(() => updateLine(segment));
    subFolder.add(segment.line.position, "y", -2, 2).name("Y").onChange(() => updateLine(segment));
    subFolder.add(segment.line.position, "z", -5, 2).name("Z").onChange(() => updateLine(segment));
});

// 🔹 Create Reset Camera Button
const resetButton = document.createElement("button");
resetButton.textContent = "Reset Camera";
resetButton.style.position = "absolute";
resetButton.style.top = "20px";
resetButton.style.left = "20px";
resetButton.style.padding = "10px 15px";
resetButton.style.fontSize = "16px";
resetButton.style.cursor = "pointer";
resetButton.style.background = "white";
resetButton.style.border = "1px solid black";
resetButton.style.borderRadius = "5px";
document.body.appendChild(resetButton);

// Reset Camera Function
function resetCamera() {
    camera.position.copy(initialCameraPosition);
    camera.lookAt(scene.position);
    controls.reset();
}

// Attach Reset Button Functionality
resetButton.addEventListener("click", resetCamera);

function updateLine(segment) {
    segment.line.geometry.setFromPoints(segment.points);
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
