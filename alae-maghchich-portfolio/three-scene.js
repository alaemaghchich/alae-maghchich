/**
 * three-scene.js
 * Galaxy / Universe 3D background using Three.js
 * Handles: star field, nebula clouds, mouse parallax, scroll camera drift
 */

const ThreeScene = (() => {
  let scene, camera, renderer;
  let starField, nebulaParticles, dustParticles;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let scrollY = 0;
  let animId;
  let clock;
  let trailParticles = [];

  /* ─── INIT ─────────────────────────────────────────────────────── */
  function init() {
    const canvas = document.getElementById('galaxy-canvas');

    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000008, 0.00015);

    // Camera
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    );
    camera.position.set(0, 0, 80);

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000008, 1);

    clock = new THREE.Clock();

    buildStarField();
    buildNebula();
    buildDustLayer();
    buildGalacticCore();

    bindEvents();
    animate();
  }

  /* ─── STAR FIELD ───────────────────────────────────────────────── */
  function buildStarField() {
    const count = 12000;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const palette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xaad4ff),
      new THREE.Color(0xffd4aa),
      new THREE.Color(0xc8aaff),
      new THREE.Color(0xaaffee),
    ];

    for (let i = 0; i < count; i++) {
      const r = Math.random() * 1200 + 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3]     = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = Math.random() * 2.5 + 0.3;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float uTime;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float twinkle = 0.85 + 0.15 * sin(uTime * 2.0 + position.x * 0.05 + position.y * 0.03);
          gl_PointSize = size * twinkle * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          if (d > 0.5) discard;
          float a = 1.0 - smoothstep(0.1, 0.5, d);
          gl_FragColor = vec4(vColor, a);
        }
      `,
      uniforms: { uTime: { value: 0 } }
    });

    starField = new THREE.Points(geo, mat);
    scene.add(starField);
  }

  /* ─── NEBULA CLOUDS ────────────────────────────────────────────── */
  function buildNebula() {
    const count = 2500;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const nebulaColors = [
      new THREE.Color(0x3a0f6e),
      new THREE.Color(0x0d1f5c),
      new THREE.Color(0x0f4a6e),
      new THREE.Color(0x6e0f3a),
      new THREE.Color(0x1a0a3e),
    ];

    for (let i = 0; i < count; i++) {
      const arm = Math.floor(Math.random() * 3);
      const t = Math.random() * Math.PI * 4;
      const spread = (Math.random() - 0.5) * 140;
      const armOffset = arm * ((Math.PI * 2) / 3);
      const radius = 30 + t * 12;

      positions[i * 3]     = Math.cos(t + armOffset) * radius + spread * 0.3;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = Math.sin(t + armOffset) * radius + spread * 0.3;

      const col = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
      const brightness = 0.4 + Math.random() * 0.6;
      colors[i * 3]     = col.r * brightness;
      colors[i * 3 + 1] = col.g * brightness;
      colors[i * 3 + 2] = col.b * brightness;

      sizes[i] = Math.random() * 18 + 6;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float uTime;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float pulse = 0.9 + 0.1 * sin(uTime * 0.5 + position.z * 0.02);
          gl_PointSize = size * pulse * (400.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          if (d > 0.5) discard;
          float a = (1.0 - smoothstep(0.0, 0.5, d)) * 0.35;
          gl_FragColor = vec4(vColor, a);
        }
      `,
      uniforms: { uTime: { value: 0 } }
    });

    nebulaParticles = new THREE.Points(geo, mat);
    scene.add(nebulaParticles);
  }

  /* ─── DUST LAYER ───────────────────────────────────────────────── */
  function buildDustLayer() {
    const count = 3000;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 600;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 600;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.4,
      color: 0x8844cc,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    dustParticles = new THREE.Points(geo, mat);
    scene.add(dustParticles);
  }

  /* ─── GALACTIC CORE ────────────────────────────────────────────── */
  function buildGalacticCore() {
    // Bright central glow
    const coreGeo = new THREE.SphereGeometry(4, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.0,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(0, 0, -200);
    scene.add(core);

    // Glow rings
    for (let r = 1; r <= 4; r++) {
      const ringGeo = new THREE.RingGeometry(r * 12, r * 12 + 2, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.75, 1, 0.6 - r * 0.08),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.12 / r,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0, 0, -200);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
    }
  }

  /* ─── ANIMATION LOOP ───────────────────────────────────────────── */
  function animate() {
    animId = requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    const delta = clock.getDelta ? 0.016 : 0.016;

    // Update shader uniforms
    if (starField?.material?.uniforms) starField.material.uniforms.uTime.value = elapsed;
    if (nebulaParticles?.material?.uniforms) nebulaParticles.material.uniforms.uTime.value = elapsed;

    // Slow galaxy rotation
    if (nebulaParticles) nebulaParticles.rotation.y = elapsed * 0.008;
    if (dustParticles)   dustParticles.rotation.y   = elapsed * 0.004;
    if (starField)       starField.rotation.y       = elapsed * 0.002;

    // Mouse parallax — smooth lerp
    targetX += (mouseX * 0.0004 - targetX) * 0.04;
    targetY += (mouseY * 0.0004 - targetY) * 0.04;

    camera.rotation.x = targetY;
    camera.rotation.y = targetX;

    // Scroll-based camera drift
    const targetZ = 80 + scrollY * 0.04;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.position.y += (-scrollY * 0.015 - camera.position.y) * 0.05;

    renderer.render(scene, camera);
  }

  /* ─── EVENT BINDINGS ───────────────────────────────────────────── */
  function bindEvents() {
    window.addEventListener('mousemove', e => {
      mouseX = e.clientX - window.innerWidth / 2;
      mouseY = e.clientY - window.innerHeight / 2;
    });

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* ─── PUBLIC API ───────────────────────────────────────────────── */
  return { init };
})();
