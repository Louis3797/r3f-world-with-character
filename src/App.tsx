import React, { Suspense } from "react";
import {
  OrbitControls,
  PerspectiveCamera,
  Sky,
  softShadows,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import Ground from "./components/Ground";
import Character from "./components/Character";
import * as THREE from "three";
import Nature from "./components/Nature";

softShadows();
function App() {
  const hlight = new THREE.HemisphereLight(0x323232, 0x003300, 4);

  const fov = 60;
  const aspect = 1920 / 1080;
  const near = 1.0;
  const far = 1000.0;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(25, 10, 25);

  const light = new THREE.DirectionalLight(0xffffff, 1.0);
  light.position.set(-100, 100, 100);
  light.target.position.set(0, 0, 0);
  light.castShadow = true;
  light.shadow.bias = -0.001;
  light.shadow.mapSize.width = 4096;
  light.shadow.mapSize.height = 4096;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 500.0;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 500.0;
  light.shadow.camera.left = 50;
  light.shadow.camera.right = -50;
  light.shadow.camera.top = 50;
  light.shadow.camera.bottom = -50;

  return (
    <div className="w-full h-screen bg-fuchsia-100">
      <Canvas shadows camera={camera}>
        <hemisphereLight {...hlight} />/
        <directionalLight {...light} />
        <ambientLight intensity={0.4} />
        <OrbitControls />
        <Suspense fallback={null}>
          <Ground />
          <perspectiveCamera {...camera} />
          <Character camera={camera} />
          <Nature />
          <fog attach="fog" color="#ffffff" near={50} far={300} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
