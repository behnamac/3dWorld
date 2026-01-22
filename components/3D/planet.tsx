"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import { usePlanetScene } from "./hooks/usePlanetScene";
import { usePlanetTextures } from "./hooks/usePlanetTextures";
import { usePlanetMaterials } from "./hooks/usePlanetMaterials";
import { usePlanetMeshes } from "./hooks/usePlanetMeshes";
import { usePlanetAnimations } from "./hooks/usePlanetAnimations";
import { setupPlanetResize } from "./hooks/usePlanetResize";
import { disposeResources } from "./utils/disposeResources";

interface Planet3DProps {
  className?: string;
}

const Planet3D: React.FC<Planet3DProps> = ({ className = "planet-3D" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const isMountedRef = useRef(true);
  const resourcesRef = useRef<{
    renderer?: THREE.WebGLRenderer;
    earthMaterial?: THREE.ShaderMaterial;
    atmosphereMaterial?: THREE.ShaderMaterial;
    earthGeometry?: THREE.BufferGeometry;
    atmosphereGeometry?: THREE.BufferGeometry;
    dayTexture?: THREE.Texture;
    nightTexture?: THREE.Texture;
    specularCloudsTexture?: THREE.Texture;
  }>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    isMountedRef.current = true;

    const { scene, camera, renderer, size } = usePlanetScene(canvas);
    const textures = usePlanetTextures(renderer);
    const materials = usePlanetMaterials(textures);
    const {
      earth,
      earthGroup,
      earthGeometry,
      atmosphereGeometry,
    } = usePlanetMeshes(materials);

    earthRef.current = earth;
    scene.add(earthGroup);

    resourcesRef.current = {
      renderer,
      earthMaterial: materials.earthMaterial,
      atmosphereMaterial: materials.atmosphereMaterial,
      earthGeometry,
      atmosphereGeometry,
      dayTexture: textures.dayTexture,
      nightTexture: textures.nightTexture,
      specularCloudsTexture: textures.specularCloudsTexture,
    };

    const cleanupAnimations = usePlanetAnimations({
      earth,
      camera,
      scene,
      renderer,
      isMounted: isMountedRef,
    });

    const cleanupResize = setupPlanetResize({ camera, renderer, size });

    return () => {
      isMountedRef.current = false;
      cleanupAnimations();
      cleanupResize();
      disposeResources(resourcesRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
};

export default Planet3D;
