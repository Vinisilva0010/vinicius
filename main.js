// ============================================
// THREE.JS ADVANCED SCENE SETUP
// ============================================
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('canvas3d'), 
    alpha: true, 
    antialias: true 
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
camera.position.z = 30;

// ============================================
// ADVANCED PARTICLE SYSTEM
// ============================================
const particleCount = 5000;
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
const particleVelocities = new Float32Array(particleCount * 3);
const particleSizes = new Float32Array(particleCount);
const particleColors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 100;
    particlePositions[i + 1] = (Math.random() - 0.5) * 100;
    particlePositions[i + 2] = (Math.random() - 0.5) * 100;
    
    particleVelocities[i] = (Math.random() - 0.5) * 0.03;
    particleVelocities[i + 1] = (Math.random() - 0.5) * 0.03;
    particleVelocities[i + 2] = (Math.random() - 0.5) * 0.03;
    
    particleSizes[i / 3] = Math.random() * 4 + 1;
    
    // Cyan to Purple gradient
    const colorMix = Math.random();
    particleColors[i] = 0.4 + (0.66 - 0.4) * colorMix;
    particleColors[i + 1] = 0.99 - (0.99 - 0.33) * colorMix;
    particleColors[i + 2] = 0.92 + (0.97 - 0.92) * colorMix;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

const particleMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    depthWrite: false
});

const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleSystem);

// ============================================
// ANIMATED TORUS KNOT
// ============================================
const torusGeometry = new THREE.TorusKnotGeometry(3, 1, 150, 20);
const torusMaterial = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    wireframe: true,
    transparent: true,
    opacity: 0.25
});
const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
torusKnot.position.set(-15, 5, -30);
scene.add(torusKnot);

// ============================================
// ICOSAHEDRON WITH GLOW
// ============================================
const icoGeometry = new THREE.IcosahedronGeometry(2.5, 1);
const icoMaterial = new THREE.MeshBasicMaterial({
    color: 0x66fcea,
    wireframe: true,
    transparent: true,
    opacity: 0.35
});
const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
icosahedron.position.set(15, -5, -25);
scene.add(icosahedron);

// ============================================
// OCTAHEDRON
// ============================================
const octaGeometry = new THREE.OctahedronGeometry(2, 0);
const octaMaterial = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
octahedron.position.set(0, 10, -20);
scene.add(octahedron);

// ============================================
// MOUSE INTERACTION
// ============================================
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// ============================================
// SCROLL-BASED ANIMATION
// ============================================
let scrollY = 0;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// ============================================
// MAIN SCENE ANIMATION LOOP (exported for global access if needed, or self-contained)
// ============================================
function animateMainScene() {
    requestAnimationFrame(animateMainScene);

    const time = Date.now() * 0.001;

    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x += (targetX * 3 - camera.position.x) * 0.05;
    camera.position.y += (targetY * 3 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // Animate particles with physics
    const positions = particleGeometry.attributes.position.array;
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] += particleVelocities[i];
        positions[i + 1] += particleVelocities[i + 1];
        positions[i + 2] += particleVelocities[i + 2];

        // Boundary check with bounce
        if (Math.abs(positions[i]) > 50) particleVelocities[i] *= -1;
        if (Math.abs(positions[i + 1]) > 50) particleVelocities[i + 1] *= -1;
        if (Math.abs(positions[i + 2]) > 50) particleVelocities[i + 2] *= -1;
    }
    particleGeometry.attributes.position.needsUpdate = true;

    // Rotate particle system
    particleSystem.rotation.y += 0.0005;
    particleSystem.rotation.x = scrollY * 0.0003;
    
    // Animate torus knot
    torusKnot.rotation.x += 0.008;
    torusKnot.rotation.y += 0.012;
    torusKnot.position.y = 5 + Math.sin(time * 0.5) * 3;
    torusKnot.position.x = -15 + Math.cos(time * 0.3) * 2;

    // Animate icosahedron
    icosahedron.rotation.x += 0.015;
    icosahedron.rotation.z += 0.01;
    icosahedron.position.y = -5 + Math.cos(time * 0.7) * 2;
    icosahedron.position.z = -25 + Math.sin(time * 0.4) * 5;

    // Animate octahedron
    octahedron.rotation.y += 0.02;
    octahedron.rotation.x += 0.01;
    octahedron.position.y = 10 + Math.sin(time * 0.8) * 2.5;

    renderer.render(scene, camera);
}

animateMainScene();

// ============================================
// WINDOW RESIZE HANDLER
// ============================================
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log('%c🚀 Portfólio Vinicius', 'font-size: 20px; color: #66fcea; font-weight: bold;');
console.log('%c✨ Powered by Three.js', 'font-size: 14px; color: #a855f7;');