// PRINTORA Real Interactive 360-Degree 3D Product Viewer
// Powered by Three.js & OrbitControls with dynamic texture mapping & WebGL fallback
// Supports: Round Neck T-shirt, Oversized T-shirt, Polo T-shirt, Hoodie, Custom Jersey

import { renderIcon } from '../utils/icons.js';

export function renderProductViewer3DSection() {
  return `
    <section id="studio-3d" class="py-16 md:py-24 bg-[#111111] text-white relative overflow-hidden border-t border-[#222222]">
      <!-- Background Ambient Lighting -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Header -->
        <div class="text-center max-w-3xl mx-auto mb-10">
          <div class="inline-flex items-center gap-2 bg-[#202020] border border-[#333333] px-3.5 py-1.5 rounded-full mb-3">
            <span class="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse"></span>
            <span class="text-[11px] font-bold text-white uppercase tracking-widest font-heading">Interactive 360° Studio</span>
          </div>
          <h2 class="text-3xl md:text-5xl font-bold font-heading tracking-tight text-white">
            Real-Time 3D Product Experience
          </h2>
          <p class="text-xs md:text-sm text-[#AAAAAA] mt-3 max-w-xl mx-auto leading-relaxed">
            Drag to rotate 360°, inspect fabric folds, change apparel styles and instantly preview your personalized text & artwork mapped live on the 3D model.
          </p>
        </div>

        <!-- 3D Studio Container -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#181818] border border-[#2A2A2A] rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
          
          <!-- 3D Viewport Column (Cols 1-8) -->
          <div class="lg:col-span-8 relative flex flex-col items-center justify-center bg-[#0C0C0C] rounded-2xl overflow-hidden border border-[#262626] min-h-[460px] md:min-h-[560px]">
            
            <!-- Floating Top Camera Angle Controls -->
            <div class="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div class="pointer-events-auto flex items-center gap-1.5 bg-[#181818]/90 backdrop-blur-md p-1 rounded-xl border border-[#333]">
                <button type="button" class="view3d-cam-btn px-3 py-1.5 text-[11px] font-bold rounded-lg text-white hover:bg-[#FF6B35] transition-all" data-cam="front">Front</button>
                <button type="button" class="view3d-cam-btn px-3 py-1.5 text-[11px] font-bold rounded-lg text-[#AAA] hover:text-white hover:bg-[#FF6B35] transition-all" data-cam="back">Back</button>
                <button type="button" class="view3d-cam-btn px-3 py-1.5 text-[11px] font-bold rounded-lg text-[#AAA] hover:text-white hover:bg-[#FF6B35] transition-all" data-cam="left">Left</button>
                <button type="button" class="view3d-cam-btn px-3 py-1.5 text-[11px] font-bold rounded-lg text-[#AAA] hover:text-white hover:bg-[#FF6B35] transition-all" data-cam="right">Right</button>
                <button type="button" class="view3d-cam-btn px-2.5 py-1.5 text-[11px] font-bold rounded-lg text-[#AAA] hover:text-white hover:bg-[#333] transition-all" data-cam="reset" title="Reset View">
                  ${renderIcon('refresh', 'w-3.5 h-3.5')}
                </button>
              </div>

              <!-- Zoom In/Out Controls -->
              <div class="pointer-events-auto flex items-center gap-1 bg-[#181818]/90 backdrop-blur-md p-1 rounded-xl border border-[#333]">
                <button type="button" id="view3d-zoom-in" class="w-8 h-8 flex items-center justify-center text-sm font-bold text-white hover:bg-[#333] rounded-lg transition-all" title="Zoom In">+</button>
                <button type="button" id="view3d-zoom-out" class="w-8 h-8 flex items-center justify-center text-sm font-bold text-white hover:bg-[#333] rounded-lg transition-all" title="Zoom Out">-</button>
                <button type="button" id="view3d-autorotate-toggle" class="px-2.5 h-8 flex items-center justify-center text-[10px] uppercase font-bold text-[#FF6B35] hover:bg-[#333] rounded-lg transition-all">Auto 360°</button>
              </div>
            </div>

            <!-- Canvas Container -->
            <div id="threejs-canvas-wrapper" class="w-full h-full min-h-[460px] md:min-h-[560px] relative flex items-center justify-center cursor-grab active:cursor-grabbing">
              <!-- Three.js Canvas gets injected here -->
            </div>

            <!-- Hint Bottom Overlay -->
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[11px] text-[#DDD] flex items-center gap-2">
              <span>🔄 Drag to rotate 360° • Scroll / Pinch to zoom</span>
            </div>
          </div>

          <!-- Controls & Personalization Panel (Cols 9-12) -->
          <div class="lg:col-span-4 space-y-6">
            
            <!-- Style Selector -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-[#FF6B35] mb-2 font-heading">
                1. Select 3D Garment Style
              </label>
              <div class="grid grid-cols-2 gap-2" id="view3d-model-selector">
                <button type="button" class="view3d-model-btn p-2.5 rounded-xl border-2 border-[#FF6B35] bg-[#222] text-left text-xs font-bold text-white transition-all" data-model="round-neck">
                  <span>Round Neck Tee</span>
                  <span class="block text-[10px] text-[#888] font-normal">Classic 180 GSM</span>
                </button>
                <button type="button" class="view3d-model-btn p-2.5 rounded-xl border-2 border-[#333] hover:border-[#666] bg-[#181818] text-left text-xs font-bold text-white transition-all" data-model="oversized">
                  <span>Oversized Tee</span>
                  <span class="block text-[10px] text-[#888] font-normal">Boxy Drop Shoulder</span>
                </button>
                <button type="button" class="view3d-model-btn p-2.5 rounded-xl border-2 border-[#333] hover:border-[#666] bg-[#181818] text-left text-xs font-bold text-white transition-all" data-model="polo">
                  <span>Polo T-shirt</span>
                  <span class="block text-[10px] text-[#888] font-normal">Ribbed Collar Placket</span>
                </button>
                <button type="button" class="view3d-model-btn p-2.5 rounded-xl border-2 border-[#333] hover:border-[#666] bg-[#181818] text-left text-xs font-bold text-white transition-all" data-model="hoodie">
                  <span>Hoodie</span>
                  <span class="block text-[10px] text-[#888] font-normal">Kangaroo Pouch Pocket</span>
                </button>
                <button type="button" class="view3d-model-btn col-span-2 p-2.5 rounded-xl border-2 border-[#333] hover:border-[#666] bg-[#181818] text-left text-xs font-bold text-white transition-all" data-model="jersey">
                  <span>Pro Custom Jersey</span>
                  <span class="block text-[10px] text-[#888] font-normal">Sublimation Honeycomb Dry-Fit</span>
                </button>
              </div>
            </div>

            <!-- Fabric Color Palette -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-[#FF6B35] mb-2 font-heading">
                2. Fabric Color
              </label>
              <div class="flex flex-wrap gap-2.5" id="view3d-color-swatches">
                <button type="button" class="w-8 h-8 rounded-full border-2 border-white shadow-md bg-[#111111] view3d-color-btn" data-color="#111111" title="Stealth Black"></button>
                <button type="button" class="w-8 h-8 rounded-full border-2 border-transparent shadow-md bg-[#FFFFFF] view3d-color-btn" data-color="#FFFFFF" title="Crisp White"></button>
                <button type="button" class="w-8 h-8 rounded-full border-2 border-transparent shadow-md bg-[#FF6B35] view3d-color-btn" data-color="#FF6B35" title="Printora Orange"></button>
                <button type="button" class="w-8 h-8 rounded-full border-2 border-transparent shadow-md bg-[#1E2A38] view3d-color-btn" data-color="#1E2A38" title="Royal Navy"></button>
                <button type="button" class="w-8 h-8 rounded-full border-2 border-transparent shadow-md bg-[#4A4A4A] view3d-color-btn" data-color="#4A4A4A" title="Heather Grey"></button>
                <button type="button" class="w-8 h-8 rounded-full border-2 border-transparent shadow-md bg-[#581845] view3d-color-btn" data-color="#581845" title="Burgundy"></button>
                <button type="button" class="w-8 h-8 rounded-full border-2 border-transparent shadow-md bg-[#1B4332] view3d-color-btn" data-color="#1B4332" title="Forest Green"></button>
              </div>
            </div>

            <!-- Live Personalization Input -->
            <div class="bg-[#202020] p-4 rounded-2xl border border-[#333333] space-y-3">
              <label class="block text-xs font-bold uppercase tracking-wider text-[#FF6B35] font-heading">
                3. Live 3D Personalization
              </label>
              
              <div>
                <span class="block text-[11px] text-[#CCC] mb-1 font-medium">Your Name / Custom Headline</span>
                <input type="text" id="view3d-custom-name" maxlength="16" placeholder="PRINTORA" value="PRINTORA"
                       class="w-full bg-[#111] border border-[#444] rounded-lg px-3 py-2 text-xs uppercase font-bold text-white outline-none focus:border-[#FF6B35]">
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <span class="block text-[11px] text-[#CCC] mb-1 font-medium">Back / Front Number</span>
                  <input type="text" id="view3d-custom-number" maxlength="3" placeholder="07" value="07"
                         class="w-full bg-[#111] border border-[#444] rounded-lg px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#FF6B35]">
                </div>
                <div>
                  <span class="block text-[11px] text-[#CCC] mb-1 font-medium">Text Color</span>
                  <div class="flex items-center gap-1.5 pt-1">
                    <button type="button" class="w-6 h-6 rounded-full border border-white bg-white view3d-text-color-btn" data-color="#FFFFFF"></button>
                    <button type="button" class="w-6 h-6 rounded-full border border-[#444] bg-[#FF6B35] view3d-text-color-btn" data-color="#FF6B35"></button>
                    <button type="button" class="w-6 h-6 rounded-full border border-[#444] bg-[#C5A880] view3d-text-color-btn" data-color="#C5A880"></button>
                    <button type="button" class="w-6 h-6 rounded-full border border-[#444] bg-[#111111] view3d-text-color-btn" data-color="#111111"></button>
                  </div>
                </div>
              </div>

              <div>
                <span class="block text-[11px] text-[#CCC] mb-1 font-medium">Upload Logo onto 3D Model</span>
                <label class="flex items-center justify-center gap-2 border border-dashed border-[#444] hover:border-[#FF6B35] rounded-lg p-2.5 bg-[#141414] cursor-pointer transition-colors text-xs text-[#AAA]">
                  <input type="file" id="view3d-logo-upload" accept="image/*" class="hidden">
                  ${renderIcon('upload', 'w-3.5 h-3.5 text-[#FF6B35]')}
                  <span id="view3d-upload-status">Upload PNG / JPEG</span>
                </label>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-2">
              <button type="button" id="view3d-add-to-cart-btn" class="w-full bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-xl flex items-center justify-center gap-2">
                ${renderIcon('shoppingBag', 'w-4 h-4')}
                <span>Add Customized 3D Product to Bag (₹499)</span>
              </button>
              
              <div class="flex items-center justify-center gap-2 text-[11px] text-[#888]">
                <span>✓ 360° Real-time Three.js Rendering</span>
                <span>•</span>
                <span class="text-[#FF6B35] font-bold">Free Delivery Included</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  `;
}

// 3D Engine State
let scene, camera, renderer, controls;
let activeModelMesh = null;
let currentGarmentStyle = 'round-neck';
let currentFabricColor = '#111111';
let currentCustomText = 'PRINTORA';
let currentCustomNumber = '07';
let currentTextColor = '#FFFFFF';
let currentLogoImage = null;
let dynamicTexture = null;
let textureCanvas = null;
let textureCtx = null;
let isAutoRotating = true;
let animationFrameId = null;

// Initialize 3D Engine and Bind Events
export function initProductViewer3D() {
  const container = document.getElementById('threejs-canvas-wrapper');
  if (!container) return;

  // Clean existing renderer if any
  if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
    container.removeChild(renderer.domElement);
  }

  // Check WebGL support
  if (typeof window.THREE === 'undefined') {
    render2DFallback(container);
    return;
  }

  try {
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e0e0e);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 3.6);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    if (window.THREE.OrbitControls) {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 1.8;
      controls.maxDistance = 6.0;
      controls.maxPolarAngle = Math.PI / 2 + 0.15; // Don't flip below floor
      controls.autoRotate = isAutoRotating;
      controls.autoRotateSpeed = 1.5;
    }

    // 5. Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(4, 5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-4, 2, 4);
    scene.add(fillLight);

    const backRimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    backRimLight.position.set(0, 4, -5);
    scene.add(backRimLight);

    // Soft Shadow Floor
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.2;
    floor.receiveShadow = true;
    scene.add(floor);

    // 6. Setup Dynamic Canvas Texture
    setupDynamicTexture();

    // 7. Build Procedural 3D Garment
    rebuildGarmentModel();

    // 8. Animation Loop
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      if (controls) controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Resize Handler
    window.addEventListener('resize', onWindowResize);

    // Bind UI Buttons
    bindViewerEvents();

  } catch (err) {
    console.error("Three.js initialization failed, loading 2D visualizer fallback:", err);
    render2DFallback(container);
  }
}

function onWindowResize() {
  const container = document.getElementById('threejs-canvas-wrapper');
  if (!container || !renderer || !camera) return;
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

// Prepare 1024x1024 offscreen dynamic canvas
function setupDynamicTexture() {
  textureCanvas = document.createElement('canvas');
  textureCanvas.width = 1024;
  textureCanvas.height = 1024;
  textureCtx = textureCanvas.getContext('2d');
  
  updateDynamicCanvas();
  dynamicTexture = new THREE.CanvasTexture(textureCanvas);
  dynamicTexture.anisotropy = 4;
}

// Draw base fabric, weave normals, and personalized text/number/logo
function updateDynamicCanvas() {
  if (!textureCtx) return;

  const w = 1024;
  const h = 1024;

  // 1. Fill base fabric color
  textureCtx.fillStyle = currentFabricColor;
  textureCtx.fillRect(0, 0, w, h);

  // 2. Add subtle high-end woven fabric micro-texture
  textureCtx.fillStyle = "rgba(255,255,255,0.02)";
  for (let y = 0; y < h; y += 4) {
    textureCtx.fillRect(0, y, w, 1);
  }
  textureCtx.fillStyle = "rgba(0,0,0,0.02)";
  for (let x = 0; x < w; x += 4) {
    textureCtx.fillRect(x, 0, 1, h);
  }

  // 3. Render Custom Name (Front Center / Chest)
  if (currentCustomText) {
    textureCtx.save();
    textureCtx.fillStyle = currentTextColor;
    textureCtx.textAlign = 'center';
    textureCtx.textBaseline = 'middle';
    
    // Chest Arch or Straight Headline
    textureCtx.font = `bold 64px 'Space Grotesk', 'Inter', sans-serif`;
    textureCtx.letterSpacing = '6px';
    textureCtx.shadowColor = 'rgba(0,0,0,0.35)';
    textureCtx.shadowBlur = 4;
    textureCtx.shadowOffsetY = 2;
    
    // Draw on front chest (approx Y: 460)
    textureCtx.fillText(currentCustomText.toUpperCase(), w / 2, 450);
    textureCtx.restore();
  }

  // 4. Render Custom Number
  if (currentCustomNumber) {
    textureCtx.save();
    textureCtx.fillStyle = currentTextColor;
    textureCtx.textAlign = 'center';
    textureCtx.textBaseline = 'middle';
    textureCtx.font = `900 130px 'Bebas Neue', 'Anton', sans-serif`;
    textureCtx.shadowColor = 'rgba(0,0,0,0.4)';
    textureCtx.shadowBlur = 6;
    textureCtx.shadowOffsetY = 4;
    
    // Draw on center front/back
    textureCtx.fillText(currentCustomNumber, w / 2, 580);
    textureCtx.restore();
  }

  // 5. Render Uploaded Artwork / Logo
  if (currentLogoImage) {
    try {
      const imgSize = 160;
      textureCtx.drawImage(currentLogoImage, (w / 2) - (imgSize / 2), 310, imgSize, imgSize);
    } catch (e) {
      console.warn("Logo draw error:", e);
    }
  }

  // Flag texture update
  if (dynamicTexture) {
    dynamicTexture.needsUpdate = true;
  }
}

// Build 3D Models for each style
function rebuildGarmentModel() {
  if (!scene) return;

  // Remove existing
  if (activeModelMesh) {
    scene.remove(activeModelMesh);
    if (activeModelMesh.geometry) activeModelMesh.geometry.dispose();
  }

  const group = new THREE.Group();

  // Create High-End Fabric Material
  const fabricMaterial = new THREE.MeshStandardMaterial({
    map: dynamicTexture,
    roughness: 0.85,
    metalness: 0.08,
    bumpScale: 0.02
  });

  const trimMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(currentFabricColor).multiplyScalar(0.8),
    roughness: 0.9,
    metalness: 0.05
  });

  const accentMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#FF6B35'),
    roughness: 0.6,
    metalness: 0.2
  });

  if (currentGarmentStyle === 'round-neck') {
    // 1. Torso
    const torsoGeo = new THREE.CylinderGeometry(0.72, 0.68, 1.5, 32);
    torsoGeo.scale(1, 1, 0.45);
    const torso = new THREE.Mesh(torsoGeo, fabricMaterial);
    torso.castShadow = true;
    torso.receiveShadow = true;
    group.add(torso);

    // 2. Ribbed Crew Collar
    const collarGeo = new THREE.TorusGeometry(0.28, 0.04, 16, 32);
    collarGeo.rotation.x = Math.PI / 2;
    collarGeo.scale(1, 0.75, 1);
    const collar = new THREE.Mesh(collarGeo, trimMaterial);
    collar.position.y = 0.74;
    group.add(collar);

    // 3. Shoulders & Short Sleeves (Left & Right)
    const sleeveL = createSleeve(0.24, 0.21, 0.55, -0.78, 0.5, 0, Math.PI / 6, fabricMaterial);
    const sleeveR = createSleeve(0.24, 0.21, 0.55, 0.78, 0.5, 0, -Math.PI / 6, fabricMaterial);
    group.add(sleeveL);
    group.add(sleeveR);

  } else if (currentGarmentStyle === 'oversized') {
    // Boxier, wider drop-shoulder fit
    const torsoGeo = new THREE.CylinderGeometry(0.85, 0.82, 1.6, 32);
    torsoGeo.scale(1, 1, 0.52);
    const torso = new THREE.Mesh(torsoGeo, fabricMaterial);
    torso.castShadow = true;
    torso.receiveShadow = true;
    group.add(torso);

    // Thick Ribbed Collar
    const collarGeo = new THREE.TorusGeometry(0.32, 0.06, 16, 32);
    collarGeo.rotation.x = Math.PI / 2;
    collarGeo.scale(1, 0.8, 1);
    const collar = new THREE.Mesh(collarGeo, trimMaterial);
    collar.position.y = 0.8;
    group.add(collar);

    // Drop Shoulder Loose Sleeves
    const sleeveL = createSleeve(0.3, 0.26, 0.7, -0.95, 0.42, 0, Math.PI / 5, fabricMaterial);
    const sleeveR = createSleeve(0.3, 0.26, 0.7, 0.95, 0.42, 0, -Math.PI / 5, fabricMaterial);
    group.add(sleeveL);
    group.add(sleeveR);

  } else if (currentGarmentStyle === 'polo') {
    // Torso with collar and button placket
    const torsoGeo = new THREE.CylinderGeometry(0.74, 0.7, 1.5, 32);
    torsoGeo.scale(1, 1, 0.46);
    const torso = new THREE.Mesh(torsoGeo, fabricMaterial);
    torso.castShadow = true;
    torso.receiveShadow = true;
    group.add(torso);

    // Folded Polo Collar
    const poloCollarGeo = new THREE.TorusGeometry(0.3, 0.07, 16, 32, Math.PI * 1.5);
    poloCollarGeo.rotation.x = Math.PI / 2 + 0.1;
    poloCollarGeo.scale(1, 0.7, 1);
    const poloCollar = new THREE.Mesh(poloCollarGeo, trimMaterial);
    poloCollar.position.set(0, 0.74, 0);
    group.add(poloCollar);

    // Button Placket Box
    const placketGeo = new THREE.BoxGeometry(0.12, 0.35, 0.04);
    const placket = new THREE.Mesh(placketGeo, trimMaterial);
    placket.position.set(0, 0.56, 0.24);
    group.add(placket);

    // Sleeves with ribbed cuffs
    const sleeveL = createSleeve(0.24, 0.21, 0.55, -0.8, 0.48, 0, Math.PI / 6, fabricMaterial);
    const sleeveR = createSleeve(0.24, 0.21, 0.55, 0.8, 0.48, 0, -Math.PI / 6, fabricMaterial);
    group.add(sleeveL);
    group.add(sleeveR);

  } else if (currentGarmentStyle === 'hoodie') {
    // Heavyweight Torso
    const torsoGeo = new THREE.CylinderGeometry(0.8, 0.76, 1.55, 32);
    torsoGeo.scale(1, 1, 0.54);
    const torso = new THREE.Mesh(torsoGeo, fabricMaterial);
    torso.castShadow = true;
    torso.receiveShadow = true;
    group.add(torso);

    // 3D Hood Geometry
    const hoodGeo = new THREE.SphereGeometry(0.48, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.7);
    hoodGeo.rotation.x = -Math.PI / 2 - 0.2;
    const hood = new THREE.Mesh(hoodGeo, trimMaterial);
    hood.position.set(0, 0.85, -0.15);
    group.add(hood);

    // Kangaroo Front Pouch Pocket
    const pouchGeo = new THREE.BoxGeometry(0.55, 0.38, 0.1);
    const pouch = new THREE.Mesh(pouchGeo, trimMaterial);
    pouch.position.set(0, -0.28, 0.25);
    group.add(pouch);

    // Full Length Long Sleeves
    const sleeveL = createSleeve(0.26, 0.18, 0.95, -0.9, 0.3, 0, Math.PI / 4.5, fabricMaterial);
    const sleeveR = createSleeve(0.26, 0.18, 0.95, 0.9, 0.3, 0, -Math.PI / 4.5, fabricMaterial);
    group.add(sleeveL);
    group.add(sleeveR);

  } else if (currentGarmentStyle === 'jersey') {
    // Athletic Fit Torso
    const torsoGeo = new THREE.CylinderGeometry(0.72, 0.67, 1.52, 32);
    torsoGeo.scale(1, 1, 0.44);
    const torso = new THREE.Mesh(torsoGeo, fabricMaterial);
    torso.castShadow = true;
    torso.receiveShadow = true;
    group.add(torso);

    // Athletic V-Neck Collar
    const collarGeo = new THREE.TorusGeometry(0.28, 0.04, 16, 32);
    collarGeo.rotation.x = Math.PI / 2 + 0.15;
    collarGeo.scale(0.9, 0.8, 1);
    const collar = new THREE.Mesh(collarGeo, accentMaterial);
    collar.position.y = 0.74;
    group.add(collar);

    // Contrast Athletic Shoulders
    const sleeveL = createSleeve(0.24, 0.2, 0.55, -0.78, 0.5, 0, Math.PI / 6, accentMaterial);
    const sleeveR = createSleeve(0.24, 0.2, 0.55, 0.78, 0.5, 0, -Math.PI / 6, accentMaterial);
    group.add(sleeveL);
    group.add(sleeveR);
  }

  group.position.y = 0.1;
  activeModelMesh = group;
  scene.add(activeModelMesh);
}

// Helper to create sleeve mesh
function createSleeve(topR, botR, len, x, y, z, rotZ, material) {
  const geo = new THREE.CylinderGeometry(topR, botR, len, 24);
  geo.scale(1, 1, 0.65);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x, y, z);
  mesh.rotation.z = rotZ;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// 2D Canvas Fallback if WebGL isn't supported
function render2DFallback(container) {
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center p-8 text-center text-white">
      <div class="w-64 h-80 rounded-2xl border border-[#444] bg-[#181818] p-4 flex flex-col items-center justify-center shadow-xl relative">
        <svg class="w-48 h-48 drop-shadow-lg" viewBox="0 0 200 220" fill="none">
          <path d="M 60 20 C 75 35 125 35 140 20 L 180 45 L 160 85 L 145 75 L 145 190 L 55 190 L 55 75 L 40 85 L 20 45 Z" fill="${currentFabricColor}" stroke="#555" stroke-width="2"/>
          <text x="100" y="110" fill="${currentTextColor}" font-size="14" font-weight="bold" text-anchor="middle" font-family="sans-serif">${currentCustomText}</text>
          <text x="100" y="145" fill="${currentTextColor}" font-size="28" font-weight="900" text-anchor="middle" font-family="sans-serif">${currentCustomNumber}</text>
        </svg>
        <span class="text-[11px] text-[#AAA] mt-3">High-Resolution 2D Visualizer</span>
      </div>
    </div>
  `;
}

// Bind UI controls
function bindViewerEvents() {
  // 1. Camera angle buttons
  document.querySelectorAll('.view3d-cam-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const mode = e.currentTarget.getAttribute('data-cam');
      if (!camera || !controls) return;

      document.querySelectorAll('.view3d-cam-btn').forEach(b => {
        b.classList.remove('bg-[#FF6B35]', 'text-white');
        b.classList.add('text-[#AAA]');
      });
      e.currentTarget.classList.add('bg-[#FF6B35]', 'text-white');
      e.currentTarget.classList.remove('text-[#AAA]');

      if (mode === 'front') {
        camera.position.set(0, 0.2, 3.6);
        controls.target.set(0, 0, 0);
      } else if (mode === 'back') {
        camera.position.set(0, 0.2, -3.6);
        controls.target.set(0, 0, 0);
      } else if (mode === 'left') {
        camera.position.set(-3.6, 0.2, 0);
        controls.target.set(0, 0, 0);
      } else if (mode === 'right') {
        camera.position.set(3.6, 0.2, 0);
        controls.target.set(0, 0, 0);
      } else if (mode === 'reset') {
        camera.position.set(0, 0.2, 3.6);
        controls.target.set(0, 0, 0);
      }
      controls.update();
    });
  });

  // 2. Zoom In / Out
  const zoomIn = document.getElementById('view3d-zoom-in');
  const zoomOut = document.getElementById('view3d-zoom-out');
  if (zoomIn) {
    zoomIn.addEventListener('click', () => {
      if (camera) {
        camera.position.multiplyScalar(0.85);
        controls.update();
      }
    });
  }
  if (zoomOut) {
    zoomOut.addEventListener('click', () => {
      if (camera) {
        camera.position.multiplyScalar(1.15);
        controls.update();
      }
    });
  }

  // 3. Auto-rotate toggle
  const autoRotateBtn = document.getElementById('view3d-autorotate-toggle');
  if (autoRotateBtn) {
    autoRotateBtn.addEventListener('click', () => {
      isAutoRotating = !isAutoRotating;
      if (controls) controls.autoRotate = isAutoRotating;
      autoRotateBtn.textContent = isAutoRotating ? 'Auto 360° ON' : 'Auto 360° OFF';
      autoRotateBtn.classList.toggle('bg-[#FF6B35]', isAutoRotating);
      autoRotateBtn.classList.toggle('text-white', isAutoRotating);
    });
  }

  // 4. Model selector
  document.querySelectorAll('.view3d-model-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const model = e.currentTarget.getAttribute('data-model');
      currentGarmentStyle = model;

      document.querySelectorAll('.view3d-model-btn').forEach(b => {
        b.classList.remove('border-[#FF6B35]', 'bg-[#222]');
        b.classList.add('border-[#333]', 'bg-[#181818]');
      });
      e.currentTarget.classList.add('border-[#FF6B35]', 'bg-[#222]');
      e.currentTarget.classList.remove('border-[#333]', 'bg-[#181818]');

      rebuildGarmentModel();
    });
  });

  // 5. Color swatches
  document.querySelectorAll('.view3d-color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const color = e.currentTarget.getAttribute('data-color');
      currentFabricColor = color;

      document.querySelectorAll('.view3d-color-btn').forEach(b => {
        b.classList.remove('border-white');
        b.classList.add('border-transparent');
      });
      e.currentTarget.classList.add('border-white');
      e.currentTarget.classList.remove('border-transparent');

      updateDynamicCanvas();
      rebuildGarmentModel();
    });
  });

  // 6. Name and Number inputs
  const nameInput = document.getElementById('view3d-custom-name');
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      currentCustomText = e.target.value;
      updateDynamicCanvas();
    });
  }

  const numberInput = document.getElementById('view3d-custom-number');
  if (numberInput) {
    numberInput.addEventListener('input', (e) => {
      currentCustomNumber = e.target.value;
      updateDynamicCanvas();
    });
  }

  // 7. Text color buttons
  document.querySelectorAll('.view3d-text-color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentTextColor = e.currentTarget.getAttribute('data-color');
      updateDynamicCanvas();
    });
  });

  // 8. Logo Upload
  const logoUpload = document.getElementById('view3d-logo-upload');
  const uploadStatus = document.getElementById('view3d-upload-status');
  if (logoUpload) {
    logoUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            currentLogoImage = img;
            if (uploadStatus) uploadStatus.textContent = file.name.slice(0, 14) + '...';
            updateDynamicCanvas();
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 9. Add to cart button
  const addToCartBtn = document.getElementById('view3d-add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      import('../services/store.js').then(({ store }) => {
        // Map 3D style to store product
        let productId = 'prn-app-01'; // Round neck ₹499
        let price = 499;
        let productName = 'Round Neck T-shirt (3D Custom)';

        if (currentGarmentStyle === 'oversized') {
          productId = 'prn-app-03';
          price = 799;
          productName = 'Oversized T-shirt (3D Custom)';
        } else if (currentGarmentStyle === 'polo') {
          productId = 'prn-app-04';
          price = 599;
          productName = 'Polo T-shirt (3D Custom)';
        } else if (currentGarmentStyle === 'hoodie') {
          productId = 'prn-app-05';
          price = 949;
          productName = 'Hoodie (3D Custom)';
        } else if (currentGarmentStyle === 'jersey') {
          productId = 'prn-spt-01';
          price = 499;
          productName = 'Custom Jersey (3D Custom)';
        }

        const product = {
          id: productId,
          name: productName,
          price: price,
          originalPrice: price + 200,
          categoryName: 'Apparel',
          images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'],
          sizes: ['M', 'L', 'XL'],
          colors: [{ name: currentFabricColor, hex: currentFabricColor }]
        };

        store.addToCart(product, {
          size: 'L',
          color: currentFabricColor,
          quantity: 1,
          customName: currentCustomText,
          customNumber: currentCustomNumber,
          customNotes: `3D Studio Design (${currentGarmentStyle.toUpperCase()})`
        });

        // Trigger cart drawer open
        const cartDrawer = document.getElementById('cart-drawer');
        if (cartDrawer) cartDrawer.classList.remove('hidden');
      });
    });
  }
}
