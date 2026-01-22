import * as THREE from "three";

interface Resources {
  renderer?: THREE.WebGLRenderer;
  scene?: THREE.Scene;
  earthMaterial?: THREE.ShaderMaterial;
  atmosphereMaterial?: THREE.ShaderMaterial;
  earthGeometry?: THREE.BufferGeometry;
  atmosphereGeometry?: THREE.BufferGeometry;
  dayTexture?: THREE.Texture;
  nightTexture?: THREE.Texture;
  specularCloudsTexture?: THREE.Texture;
  stars?: THREE.Points;
  starGeometry?: THREE.BufferGeometry;
}

export const disposeResources = (resources: Resources) => {
  if (resources.renderer) {
    const gl = resources.renderer.getContext();
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    resources.renderer.dispose();
  }

  if (resources.earthMaterial) {
    resources.earthMaterial.dispose();
  }

  if (resources.atmosphereMaterial) {
    resources.atmosphereMaterial.dispose();
  }

  if (resources.earthGeometry) {
    resources.earthGeometry.dispose();
  }

  if (resources.atmosphereGeometry) {
    resources.atmosphereGeometry.dispose();
  }

  if (resources.dayTexture) {
    resources.dayTexture.dispose();
  }

  if (resources.nightTexture) {
    resources.nightTexture.dispose();
  }

  if (resources.specularCloudsTexture) {
    resources.specularCloudsTexture.dispose();
  }

  if (resources.stars && resources.scene) {
    resources.scene.remove(resources.stars);
    resources.stars.geometry.dispose();
    if (resources.stars.material instanceof THREE.Material) {
      resources.stars.material.dispose();
    }
  }

  if (resources.starGeometry) {
    resources.starGeometry.dispose();
  }
};
