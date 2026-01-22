import * as THREE from "three";

interface PlanetTextures {
  dayTexture: THREE.Texture;
  nightTexture: THREE.Texture;
  specularCloudsTexture: THREE.Texture;
}

export const usePlanetTextures = (
  renderer: THREE.WebGLRenderer,
): PlanetTextures => {
  const textureLoader = new THREE.TextureLoader();
  const dayTexture = textureLoader.load("./earth/day.jpg");
  const nightTexture = textureLoader.load("./earth/night.jpg");
  const specularCloudsTexture = textureLoader.load("./earth/specularClouds.jpg");

  dayTexture.colorSpace = THREE.SRGBColorSpace;
  nightTexture.colorSpace = THREE.SRGBColorSpace;

  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  dayTexture.anisotropy = maxAnisotropy;
  specularCloudsTexture.anisotropy = maxAnisotropy;
  nightTexture.anisotropy = maxAnisotropy;

  return { dayTexture, nightTexture, specularCloudsTexture };
};
