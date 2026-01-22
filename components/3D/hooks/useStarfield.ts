import * as THREE from "three";

interface StarfieldSetup {
  stars: THREE.Points;
  starGeometry: THREE.BufferGeometry;
}

const STAR_COUNT = 5000;
const STAR_RADIUS = 1000;
const TWINKLE_SPEED = 0.3;

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
      varying float vSize;

      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        
        float twinkle = sin(time * twinkleSpeed + phase * 3.14159) * 0.5 + 0.5;
        vOpacity = 0.3 + twinkle * 0.7;
        vSize = size * (0.5 + twinkle * 0.5);
        
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying float vOpacity;
      varying float vSize;

      void main() {
        float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
        float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
        gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * vOpacity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
};

export const useStarfield = (scene: THREE.Scene): StarfieldSetup => {
  const geometry = createStarGeometry();
  const material = createStarMaterial();
  const stars = new THREE.Points(geometry, material);

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
  material.uniforms.time.value = time;
};
