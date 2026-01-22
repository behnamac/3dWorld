import { useRef } from "react";
import * as THREE from "three";
import {
  CAMERA_FOV,
  CAMERA_NEAR,
  CAMERA_FAR,
  INITIAL_CAMERA_POSITION,
} from "../constants";

interface SceneSetup {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  size: { width: number; height: number; pixelRatio: number };
}

export const usePlanetScene = (canvas: HTMLCanvasElement): SceneSetup => {
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: window.devicePixelRatio,
  };

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    CAMERA_FOV,
    size.width / size.height,
    CAMERA_NEAR,
    CAMERA_FAR,
  );
  camera.position.set(
    INITIAL_CAMERA_POSITION.x,
    INITIAL_CAMERA_POSITION.y,
    INITIAL_CAMERA_POSITION.z,
  );
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(size.pixelRatio);
  renderer.setClearColor(0x000000, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  scene.background = new THREE.Color(0x000000);

  return { scene, camera, renderer, size };
};
