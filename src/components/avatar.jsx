import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useFBX } from "@react-three/drei";
import * as THREE from "three";

/**
 * Avatar Component
 * Displays a 3D avatar with animations.
 *
 * @param {string} animation - The animation to be played.
 * @param {Object} props - Additional props passed to the component.
 */
export function Avatar({ animation = "Waving", ...props }) {
  const group = useRef();
  const { scene } = useGLTF("/models/Soldier.glb");
  const animations = {
    Waving: useFBX("/animations/Waving.fbx"),
  };

  const mixer = useRef(null);

  useEffect(() => {
    if (!scene) return;

    // Initialize the animation mixer and play the animation
    mixer.current = new THREE.AnimationMixer(scene);
    const action = mixer.current.clipAction(
      animations[animation].animations[0],
      group.current,
    );
    action.play();

    // Clean up the animation mixer on component unmount
    return () => {
      if (mixer.current) {
        mixer.current.stopAllAction();
      }
    };
  }, [scene, animations, animation]);

  // Update the animation frame
  useFrame((state, delta) => {
    mixer.current?.update(delta);
  });

  return (
    <group ref={group} {...props} aria-label="3D Avatar Animation">
      <primitive object={scene} />
    </group>
  );
}

// Preload the GLTF model
useGLTF.preload("/models/Soldier.glb");
