import * as THREE from "three";

interface ResizeSetup {
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  size: { width: number; height: number; pixelRatio: number };
}

export const setupPlanetResize = ({
  camera,
  renderer,
  size,
}: ResizeSetup): (() => void) => {
  const handleResize = () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    size.pixelRatio = window.devicePixelRatio;

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(size.pixelRatio);
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
};
