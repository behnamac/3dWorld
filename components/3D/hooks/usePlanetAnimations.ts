import { useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import * as THREE from "three";
import { SCROLL_SCRUB, ANIMATION_DURATION, ROTATION_SPEED } from "../constants";

interface AnimationSetup {
  earth: THREE.Mesh;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  stars?: THREE.Points;
  isMounted: React.MutableRefObject<boolean>;
}

export const usePlanetAnimations = ({
  earth,
  camera,
  scene,
  renderer,
  stars,
  isMounted,
}: AnimationSetup) => {
  gsap.registerPlugin(ScrollTrigger);

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero_main",
      start: () => "top top",
      scrub: SCROLL_SCRUB,
      anticipatePin: 1,
      pin: true,
    },
  });

  timeline
    .to(
      ".hero_main .content",
      {
        filter: "blur(40px)",
        autoAlpha: 0,
        scale: 0.5,
        duration: ANIMATION_DURATION,
        ease: "power1.inOut",
      },
      "setting",
    )
    .to(
      camera.position,
      {
        y: 0.1,
        z: window.innerWidth > 768 ? 19 : 30,
        x: window.innerWidth > 768 ? 0 : 0.1,
        duration: ANIMATION_DURATION,
        ease: "power1.inOut",
      },
      "setting",
    );

  gsap.ticker.lagSmoothing(0);

  const animate = (time: number) => {
    if (!isMounted.current) return;
    earth.rotation.y = time * ROTATION_SPEED;
    if (stars) {
      const material = stars.material as THREE.ShaderMaterial;
      material.uniforms.time.value = time;
    }
    renderer.render(scene, camera);
  };

  gsap.ticker.add(animate);

  return () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
};
