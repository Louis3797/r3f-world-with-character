import { useFrame, useLoader, useThree } from "@react-three/fiber";
import React, { Suspense, useCallback, useEffect, useRef } from "react";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { useFBX } from "@react-three/drei";
import * as THREE from "three";

import { Mesh } from "three";

interface Animations {
  [name: string]: { action: THREE.AnimationClip; clip: THREE.AnimationAction };
}

interface CharacterProps {
  _camera: THREE.PerspectiveCamera;
}
const Character: React.FC<CharacterProps> = ({ _camera }) => {
  const camera = useThree((state) => state.camera);

  const viewport = useThree((state) => state.viewport);
  const character = useRef<Mesh>(null!);

  const activeAnimation: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    run: boolean;
    dance: boolean;
  } = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    run: false,
    dance: false,
  };

  const animations: Animations = {};

  const vec = new THREE.Vector3();
  const walkDirection = new THREE.Vector3();
  const rotateAngle = new THREE.Vector3(0, 1, 0);
  const rotateQuarternion: THREE.Quaternion = new THREE.Quaternion();
  const cameraTarget = new THREE.Vector3();
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

  const run = useFBX("./character/running.fbx");

  animations["run"] = {
    action: run.animations[0],
    clip: mixer.clipAction(run.animations[0]),
  };
  const dance = useFBX("./character/dance.fbx");
  animations["dance"] = {
    action: dance.animations[0],
    clip: mixer.clipAction(dance.animations[0]),
  };

  let currAction: THREE.AnimationAction = mixer.clipAction(
    animations["idle"].action
  );
  let prevAction: THREE.AnimationAction;
  // Controll Input
  const handleKeyPress = useCallback((event) => {
    console.log(activeAnimation);
    switch (event.keyCode) {
      case 87: //w
        activeAnimation.forward = true;
        // character.current.position.z += 0.4;

        break;

      case 65: //a
        activeAnimation.left = true;

        break;

      case 83: //s
        activeAnimation.backward = true;

        break;

      case 68: // d
        activeAnimation.right = true;

        break;

      case 69: //e dance
        activeAnimation.dance = true;

        break;
      case 16: // shift
        activeAnimation.run = true;
        break;
    }
  }, []);

  const handleKeyUp = useCallback((event) => {
    switch (event.keyCode) {
      case 87: //w
        activeAnimation.forward = false;
        break;

      case 65: //a
        activeAnimation.left = false;
        break;

      case 83: //s
        activeAnimation.backward = false;
        break;

      case 68: // d
        activeAnimation.right = false;
        break;

      case 69: //e dance
        activeAnimation.dance = false;
        break;

      case 16: // shift
        activeAnimation.run = false;
        break;
    }
  }, []);

  const getDirectionOffset = (): number => {
    var directionOffset = 0; // w

    if (activeAnimation.backward) {
      if (activeAnimation.left) {
        directionOffset = -Math.PI / 4; // s+a
      } else if (activeAnimation.right) {
        directionOffset = Math.PI / 4; // s+d
      }
    } else if (activeAnimation.forward) {
      if (activeAnimation.left) {
        directionOffset = -Math.PI / 4 - Math.PI / 2; // w+a
      } else if (activeAnimation.right) {
        directionOffset = Math.PI / 4 + Math.PI / 2; // w+d
      } else {
        directionOffset = Math.PI; // w
      }
    } else if (activeAnimation.left) {
      directionOffset = -Math.PI / 2; // a
    } else if (activeAnimation.right) {
      directionOffset = Math.PI / 2; // d
    }

    return directionOffset;
  };

  function updateCameraTarget(moveX: number, moveZ: number, delta: number) {
    // move camera

    const idealOffset = new THREE.Vector3(-50, 30, -50);
    // idealOffset.applyQuaternion(character.current.quaternion);
    idealOffset.add(character.current.position);

    const t = 1.0 - Math.pow(0.001, delta);

    const currlat = character.current.position;
    const currPos = camera.position;

    currPos.lerp(idealOffset, t);

    character.current.quaternion.rotateTowards(rotateQuarternion, 0.2);
    camera.position.copy(currPos);
    // camera.rotation.z = Math.PI / 2;
    // camera.rotation.x = Math.PI / 2;

    camera.lookAt(currlat);
  }
  const characterState = (delta: number) => {
    if (
      currAction === animations["walk"].clip ||
      currAction === animations["run"].clip
    ) {
      const angleYCameraDirection = Math.atan2(
        camera.position.x - character.current.position.x,
        camera.position.z - character.current.position.z
      );
      // diagonal movement angle offset
      const directionOffset: number = getDirectionOffset();
      // rotate model

      rotateQuarternion.setFromAxisAngle(
        rotateAngle,
        angleYCameraDirection + directionOffset
      );

      character.current.quaternion.rotateTowards(rotateQuarternion, 0.2);
      // calculate direction
      camera.getWorldDirection(walkDirection);
      walkDirection.y = 0;
      walkDirection.normalize();

      walkDirection.applyAxisAngle(rotateAngle, directionOffset);
      // run/walk velocity
      const velocity = activeAnimation.run ? 0.5 : 0.2;
      // move model & cameradelta
      const moveX = walkDirection.x * -velocity;
      const moveZ = walkDirection.z * -velocity;

      character.current.position.x += moveX;
      character.current.position.z += moveZ;
      updateCameraTarget(moveX, moveZ, delta);
    }
  };

  useFrame((state, delta) => {
    prevAction = currAction;

    if (activeAnimation.forward) {
      if (activeAnimation.run) {
        currAction = animations["run"].clip;
      } else {
        currAction = animations["walk"].clip;
      }
    } else if (activeAnimation.left) {
      if (activeAnimation.run) {
        currAction = animations["run"].clip;
      } else {
        currAction = animations["walk"].clip;
      }
    } else if (activeAnimation.right) {
      if (activeAnimation.run) {
        currAction = animations["run"].clip;
      } else {
        currAction = animations["walk"].clip;
      }
    } else if (activeAnimation.backward) {
      if (activeAnimation.run) {
        currAction = animations["run"].clip;
      } else {
        currAction = animations["walk"].clip;
      }
    } else if (activeAnimation.dance) {
      currAction = animations["dance"].clip;
    } else {
      currAction = animations["idle"].clip;
    }

    if (prevAction !== currAction) {
      prevAction.fadeOut(0.2);

      if (prevAction === animations["walk"].clip) {
        const ratio =
          currAction.getClip().duration / prevAction.getClip().duration;
        currAction.time = prevAction.time * ratio;
      }

      currAction.reset().play();
    } else {
      currAction.play();
    }

    setTimeout(() => characterState(delta), 150);

    mixer?.update(delta);
  });

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    document.addEventListener("keyup", handleKeyUp);
    currAction.play();
    return () => {
      document.removeEventListener("keydown", handleKeyPress);

      document.removeEventListener("keyup", handleKeyUp);
    };
  });

  return <primitive object={c} ref={character} />;
};

export default Character;
