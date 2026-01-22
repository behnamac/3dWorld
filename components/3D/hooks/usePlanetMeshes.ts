import * as THREE from "three";
import { EARTH_RADIUS, ATMOSPHERE_SCALE, SUN_SPHERICAL_CONFIG } from "../constants";

interface PlanetMaterials {
  earthMaterial: THREE.ShaderMaterial;
  atmosphereMaterial: THREE.ShaderMaterial;
}

interface PlanetMeshes {
  earth: THREE.Mesh;
  atmosphere: THREE.Mesh;
  earthGroup: THREE.Group;
  sunDirection: THREE.Vector3;
  earthGeometry: THREE.BufferGeometry;
  atmosphereGeometry: THREE.BufferGeometry;
}

export const usePlanetMeshes = (
  materials: PlanetMaterials,
): PlanetMeshes => {
  const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64);
  const atmosphereGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64);

  const earth = new THREE.Mesh(earthGeometry, materials.earthMaterial);
  const atmosphere = new THREE.Mesh(
    atmosphereGeometry,
    materials.atmosphereMaterial,
  );
  atmosphere.scale.set(ATMOSPHERE_SCALE, ATMOSPHERE_SCALE, ATMOSPHERE_SCALE);

  const earthGroup = new THREE.Group();
  earthGroup.add(earth, atmosphere);

  const sunSpherical = new THREE.Spherical(
    SUN_SPHERICAL_CONFIG.radius,
    SUN_SPHERICAL_CONFIG.phi,
    SUN_SPHERICAL_CONFIG.theta,
  );
  const sunDirection = new THREE.Vector3();
  sunDirection.setFromSpherical(sunSpherical);

  materials.earthMaterial.uniforms.uSunDirection.value.copy(sunDirection);
  materials.atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection);

  return {
    earth,
    atmosphere,
    earthGroup,
    sunDirection,
    earthGeometry,
    atmosphereGeometry,
  };
};
