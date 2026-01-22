import * as THREE from "three";

interface StarfieldSetup {
  stars: THREE.Points;
  starGeometry: THREE.BufferGeometry;
}

const STAR_COUNT = 15000;
const STAR_RADIUS = 1000;
const TWINKLE_SPEED = 0.5;

const createStarGeometry = (): THREE.BufferGeometry => {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(STAR_COUNT * 3);
  const sizes = new Float32Array(STAR_COUNT);
  const phases = new Float32Array(STAR_COUNT);

  for (let i = 0; i < STAR_COUNT; i++) {
    const i3 = i * 3;
    const radius = STAR_RADIUS;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    sizes[i] = Math.random() * 2 + 0.5;
    phases[i] = Math.random() * Math.PI * 2;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("phase", new THREE.BufferAttribute(phases, 1));

  return geometry;
};

const createStarMaterial = (): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      twinkleSpeed: { value: TWINKLE_SPEED },
    },
    vertexShader: `
      attribute float size;
      attribute float phase;
      uniform float time;
      uniform float twinkleSpeed;
      varying float vOpacity;

      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vec4 projected = projectionMatrix * mvPosition;
        
        gl_PointSize = size * (1200.0 / max(-mvPosition.z, 0.1));
        
        float twinkle = sin(time * twinkleSpeed + phase) * 0.4 + 0.6;
        vOpacity = twinkle;
        
        gl_Position = projected;
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying float vOpacity;

      void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        
        if (dist > 0.5) {
          discard;
        }
        
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist * 2.0);
        gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * vOpacity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
    vertexColors: false,
  });
};

export const useStarfield = (scene: THREE.Scene): StarfieldSetup => {
  const geometry = createStarGeometry();
  const material = createStarMaterial();
  const stars = new THREE.Points(geometry, material);

  stars.frustumCulled = false;
  stars.renderOrder = -1000;

  scene.add(stars);

  return {
    stars,
    starGeometry: geometry,
  };
};

export const updateStarfield = (
  stars: THREE.Points,
  time: number,
) => {
  const material = stars.material as THREE.ShaderMaterial;
  if (material && material.uniforms && material.uniforms.time) {
    material.uniforms.time.value = time;
  }
};
