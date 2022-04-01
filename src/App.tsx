import React, { Suspense } from "react";
import { OrbitControls, Sky } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import Ground from "./components/Ground";
import Character from "./components/Character";
import * as THREE from "three";
import Nature from "./components/Nature";
function App() {
  const hlight = new THREE.HemisphereLight(0x323232, 0x080820, 4);

  return (
    <div className="w-full h-screen bg-blue-100">
      <Canvas
        shadows
        camera={{
          fov: 60,
          aspect: window.innerWidth / window.innerHeight,
          near: 0.1,
          far: 2000,
          position: [0, 35, -25],
        }}
      >
        <hemisphereLight {...hlight} />

        <directionalLight
          color="#ffffff"
          intensity={0.3}
          position={[-100, 80, 100]}
          castShadow
        />
        <ambientLight intensity={0.7} />
        <OrbitControls />
        <Suspense fallback={null}>
          <Ground />
          <Character />
          <Nature />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
