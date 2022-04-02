import React, { Suspense } from "react";
import { OrbitControls, PerspectiveCamera, Sky } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import Ground from "./components/Ground";
import Character from "./components/Character";
import * as THREE from "three";
import Nature from "./components/Nature";
function App() {
  const hlight = new THREE.HemisphereLight(0x323232, 0x000000, 4);

  camera.position.set(-10, 10, -25);

  return (
    <div className="w-full h-screen bg-fuchsia-100">
      <Canvas
        shadows
        camera={{
          fov: 60,
          aspect: window.innerWidth / window.innerHeight,
          near: 1,
          far: 1000,
          position: [-50, 35, -50],
        }}
      >
        <hemisphereLight {...hlight} />

        <directionalLight
          color="#ffffff"
          intensity={0.3}
          position={[-100, 80, 100]}
          castShadow
        />
        <ambientLight intensity={0.4} />
        {/* <OrbitControls /> */}
        <Suspense fallback={null}>
          <Ground />
          {/* <perspectiveCamera {...camera} /> */}
          <Character />

          <Nature />
          <fog attach="fog" color="#ffffff" near={50} far={300} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
