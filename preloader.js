// ============================================
// PRELOADER THREE.JS ANIMATION
// ============================================
const preloaderCanvas = document.getElementById('preloader-canvas');
const preloaderRenderer = new THREE.WebGLRenderer({ 
    canvas: preloaderCanvas, 
    alpha: true, 
    antialias: true 
});

preloaderRenderer.setSize(window.innerWidth, window.innerHeight);
preloaderRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const preloaderScene = new THREE.Scene();
const preloaderCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
preloaderCamera.position.z = 15;

// Create multiple geometric shapes
const geometries = [
    new THREE.TorusGeometry(2, 0.5, 16, 100),
    new THREE.IcosahedronGeometry(2, 0),
    new THREE.OctahedronGeometry(2.5, 0),
    new THREE.TetrahedronGeometry(2, 0),
    new THREE.DodecahedronGeometry(2, 0)
];

const preloaderObjects = [];
geometries.forEach((geo, index) => {
    const material = new THREE.MeshBasicMaterial({
        color: index % 2 === 0 ? 0x66fcea : 0xa855f7,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });
    const mesh = new THREE.Mesh(geo, material);
    
    // Position in circle
    const angle = (index / geometries.length) * Math.PI * 2;
    mesh.position.x = Math.cos(angle) * 5;
    mesh.position.y = Math.sin(angle) * 5;
    mesh.position.z = -5;
    
    preloaderScene.add(mesh);
    preloaderObjects.push(mesh);
});

// Add particles to preloader
const preloaderParticleCount = 1000;
const preloaderParticleGeo = new THREE.BufferGeometry();
const preloaderParticlePositions = new Float32Array(preloaderParticleCount * 3);
const preloaderParticleColors = new Float32Array(preloaderParticleCount * 3);

for (let i = 0; i < preloaderParticleCount * 3; i += 3) {
    preloaderParticlePositions[i] = (Math.random() - 0.5) * 30;
    preloaderParticlePositions[i + 1] = (Math.random() - 0.5) * 30;
    preloaderParticlePositions[i + 2] = (Math.random() - 0.5) * 30;
    
    const colorMix = Math.random();
    preloaderParticleColors[i] = 0.4 + (0.66 - 0.4) * colorMix;
    preloaderParticleColors[i + 1] = 0.99 - (0.99 - 0.33) * colorMix;
    preloaderParticleColors[i + 2] = 0.92 + (0.97 - 0.92) * colorMix;
}

preloaderParticleGeo.setAttribute('position', new THREE.BufferAttribute(preloaderParticlePositions, 3));
preloaderParticleGeo.setAttribute('color', new THREE.BufferAttribute(preloaderParticleColors, 3));

const preloaderParticleMat = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const preloaderParticles = new THREE.Points(preloaderParticleGeo, preloaderParticleMat);
preloaderScene.add(preloaderParticles);

let preloaderActive = true;
let preloaderTime = 0;

function animatePreloader() {
    if (!preloaderActive) return;
    
    requestAnimationFrame(animatePreloader);
    preloaderTime += 0.01;

    // Rotate all objects
    preloaderObjects.forEach((obj, index) => {
        obj.rotation.x += 0.01 * (index + 1);
        obj.rotation.y += 0.015 * (index + 1);
        
        // Pulsating effect
        const scale = 1 + Math.sin(preloaderTime * 2 + index) * 0.2;
        obj.scale.set(scale, scale, scale);

        // Orbit animation
        const angle = preloaderTime * 0.5 + (index / preloaderObjects.length) * Math.PI * 2;
        obj.position.x = Math.cos(angle) * 6;
        obj.position.y = Math.sin(angle) * 6;
    });

    // Rotate particles
    preloaderParticles.rotation.y += 0.001;
    preloaderParticles.rotation.x += 0.0005;

    preloaderCamera.position.x = Math.sin(preloaderTime * 0.3) * 2;
    preloaderCamera.position.y = Math.cos(preloaderTime * 0.2) * 2;
    preloaderCamera.lookAt(preloaderScene.position);

    preloaderRenderer.render(preloaderScene, preloaderCamera);
}

animatePreloader();

// Loading progress simulation
let loadingProgress = 0;
const loadingBarFill = document.getElementById('loading-bar-fill');
const progressDots = document.getElementById('progress-dots');
const preloaderDiv = document.querySelector('.preloadingPageDiv');

const loadingInterval = setInterval(() => {
    loadingProgress += Math.random() * 20 + 10;
    
    if (loadingProgress >= 100) {
        loadingProgress = 100;
        loadingBarFill.style.width = '100%';
        clearInterval(loadingInterval);
        
        setTimeout(() => {
            preloaderActive = false;
            preloaderDiv.classList.add('loaded');
            
            // Destroy preloader scene after transition
            setTimeout(() => {
                preloaderRenderer.dispose();
                preloaderScene.clear();
            }, 1000);
        }, 300);
    } else {
        loadingBarFill.style.width = loadingProgress + '%';
    }
    
    // Animate dots
    const dotCount = Math.floor(Date.now() / 300) % 4;
    progressDots.textContent = '.'.repeat(dotCount);
}, 150);