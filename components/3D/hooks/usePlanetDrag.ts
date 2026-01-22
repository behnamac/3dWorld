import * as THREE from "three";
import type React from "react";

interface DragSetup {
  earth: THREE.Mesh;
  canvas: HTMLCanvasElement;
  isDragging: React.MutableRefObject<boolean>;
  manualRotation: React.MutableRefObject<number>;
  baseRotation: React.MutableRefObject<number>;
}

export const setupPlanetDrag = ({
  earth,
  canvas,
  isDragging,
  manualRotation,
  baseRotation,
}: DragSetup): (() => void) => {
  let previousMouseX = 0;
  const rotationSpeed = 0.01;

  const getMouseX = (event: MouseEvent | TouchEvent): number => {
    if (event instanceof MouseEvent) {
      return event.clientX;
    } else {
      return event.touches[0]?.clientX || 0;
    }
  };

  const handleMouseDown = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    isDragging.current = true;
    previousMouseX = getMouseX(event);
    manualRotation.current = earth.rotation.y;
    baseRotation.current = earth.rotation.y;
    canvas.style.cursor = "grabbing";
  };

  const handleMouseMove = (event: MouseEvent | TouchEvent) => {
    if (!isDragging.current) return;

    event.preventDefault();
    const currentMouseX = getMouseX(event);
    const deltaX = currentMouseX - previousMouseX;

    manualRotation.current += deltaX * rotationSpeed;
    earth.rotation.y = manualRotation.current;

    previousMouseX = currentMouseX;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    baseRotation.current = manualRotation.current;
    canvas.style.cursor = "grab";
  };

  canvas.style.cursor = "grab";
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mouseleave", handleMouseUp);

  canvas.addEventListener("touchstart", handleMouseDown, { passive: false });
  canvas.addEventListener("touchmove", handleMouseMove, { passive: false });
  canvas.addEventListener("touchend", handleMouseUp);

  return () => {
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("mouseup", handleMouseUp);
    canvas.removeEventListener("mouseleave", handleMouseUp);
    canvas.removeEventListener("touchstart", handleMouseDown);
    canvas.removeEventListener("touchmove", handleMouseMove);
    canvas.removeEventListener("touchend", handleMouseUp);
    canvas.style.cursor = "";
  };
};
