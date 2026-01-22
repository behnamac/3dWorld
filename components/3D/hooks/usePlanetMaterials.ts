import * as THREE from "three";
import {
  ATMOSPHERE_DAY_COLOR,
  ATMOSPHERE_TWILIGHT_COLOR,
} from "../constants";
import earthVertex from "../shaders/earth/vertex.glsl";
import earthFragment from "../shaders/earth/fragment.glsl";
import atmosphereVertex from "../shaders/atmosphere/vertex.glsl";
import atmosphereFragment from "../shaders/atmosphere/fragment.glsl";

interface PlanetTextures {
  dayTexture: THREE.Texture;
  nightTexture: THREE.Texture;
  specularCloudsTexture: THREE.Texture;
}

interface PlanetMaterials {
  earthMaterial: THREE.ShaderMaterial;
  atmosphereMaterial: THREE.ShaderMaterial;
}

export const usePlanetMaterials = (
  textures: PlanetTextures,
): PlanetMaterials => {
  const earthMaterial = new THREE.ShaderMaterial({
    vertexShader: earthVertex,
    fragmentShader: earthFragment,
    uniforms: {
      uDayTexture: new THREE.Uniform(textures.dayTexture),
      uNightTexture: new THREE.Uniform(textures.nightTexture),
      uSpecularCloudsTexture: new THREE.Uniform(textures.specularCloudsTexture),
      uSunDirection: new THREE.Uniform(new THREE.Vector3(-1, 0, 0)),
      uAtmosphereDayColor: new THREE.Uniform(
        new THREE.Color(ATMOSPHERE_DAY_COLOR),
      ),
      uAtmosphereTwilightColor: new THREE.Uniform(
        new THREE.Color(ATMOSPHERE_TWILIGHT_COLOR),
      ),
    },
    transparent: true,
  });

  const atmosphereMaterial = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.BackSide,
    vertexShader: atmosphereVertex,
    fragmentShader: atmosphereFragment,
    uniforms: {
      uOpacity: { value: 1 },
      uSunDirection: new THREE.Uniform(new THREE.Vector3(-1, 0, 0)),
      uAtmosphereDayColor: new THREE.Uniform(
        new THREE.Color(ATMOSPHERE_DAY_COLOR),
      ),
      uAtmosphereTwilightColor: new THREE.Uniform(
        new THREE.Color(ATMOSPHERE_TWILIGHT_COLOR),
      ),
    },
    depthWrite: false,
  });

  return { earthMaterial, atmosphereMaterial };
};
