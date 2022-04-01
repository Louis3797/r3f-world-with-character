import { useFrame, useLoader } from "@react-three/fiber";
import React, { Suspense, useCallback, useEffect, useRef } from "react";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { useFBX } from "@react-three/drei";
import * as THREE from "three";

import { Mesh } from "three";

interface Animations {
  [name: string]: { action: THREE.AnimationClip; clip: THREE.AnimationAction };
}
const Character: React.FC = () => {
  const character = useRef<Mesh>(null!);

  const activyAnimation: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    dance: boolean;
  } = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    dance: false,
  };

  const animations: Animations = {};

  const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
  const acceleration = new THREE.Vector3(1, 0.25, 50.0);
  const velocity = new THREE.Vector3(0, 0, 0);

  const c = useLoader(FBXLoader, "./character/character.fbx");

  c.scale.setScalar(0.1);
  c.traverse((f) => {
    f.castShadow = true;
    f.receiveShadow = true;
  });

  const mixer = new THREE.AnimationMixer(c);

  const idle = useFBX("./character/idle.fbx");
  animations["idle"] = {
    action: idle.animations[0],
    clip: mixer.clipAction(idle.animations[0]),
  };
  const walk = useFBX("./character/walking.fbx");
  animations["walk"] = {
    action: walk.animations[0],
    clip: mixer.clipAction(walk.animations[0]),
  };
  const dance = useFBX("./character/dance.fbx");
  animations["dance"] = {
    action: dance.animations[0],
    clip: mixer.clipAction(dance.animations[0]),
  };

  let animation = mixer.clipAction(animations["idle"].action);

  // Controll Input
  const handleKeyPress = useCallback((event) => {
    console.log(activyAnimation);
    switch (event.keyCode) {
      case 87: //w
        activyAnimation.forward = true;
        // character.current.position.z += 0.4;

        break;

      case 65: //a
        activyAnimation.left = true;

        break;

      case 83: //s
        activyAnimation.backward = true;

        break;

      case 68: // d
        activyAnimation.right = true;

        break;

      case 69: //e dance
        activyAnimation.dance = true;

        break;
    }
  }, []);

  const handleKeyUp = useCallback((event) => {
    switch (event.keyCode) {
      case 87: //w
        activyAnimation.forward = false;
        break;

      case 65: //a
        activyAnimation.left = false;
        break;

      case 83: //s
        activyAnimation.backward = false;
        break;

      case 68: // d
        activyAnimation.right = false;
        break;

      case 69: //e dance
        activyAnimation.dance = false;
        break;
    }
    console.log("up: ", activyAnimation);
  }, []);

  useFrame((state, delta) => {
    mixer?.update(delta);
    // character.current.position.z += 0.3;
  });
  document.addEventListener("keydown", handleKeyPress);

  document.addEventListener("keyup", handleKeyUp);
  useEffect(() => {
    animation.play();
    return () => {};
  });

  return <primitive object={c} ref={character} />;
};

export default Character;
