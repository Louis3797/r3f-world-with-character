import { useFrame, useLoader } from "@react-three/fiber";
import React, { useLayoutEffect, useMemo, useRef } from "react";
import SimplexNoise from "simplex-noise";
import * as THREE from "three";
import { BufferAttribute, Mesh, MeshLambertMaterial, Plane } from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader";

const Ground: React.FC = () => {
  const simplex = useMemo(() => new SimplexNoise(), []);

  const mesh = useRef<Mesh>(null!);
  const terrain = useRef<THREE.PlaneGeometry>(null!);
  const [colorMap, normalMap, roughnessMap, aoMap] = useLoader(TextureLoader, [
    "./textures/grass.png",
    "./textures/grass_Normal.png",
    "./textures/grass_Roughness.png",
    "./textures/grass_Ambient_Occlusion.png",
  ]);

  colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;

  colorMap.repeat.set(250, 250);
  colorMap.anisotropy = 16;

  useLayoutEffect(() => {
    let pos = terrain.current.getAttribute("position");
    let pa = pos.array;

    const hVerts = terrain.current.parameters.heightSegments + 1;
    const wVerts = terrain.current.parameters.widthSegments + 1;

    for (let j = 0; j < hVerts; j++) {
      for (let i = 0; i < wVerts; i++) {
        const ex = Math.random() * 1.3;
        // @ts-ignore
        pa[3 * (j * wVerts + i) + 2] =
          (simplex.noise2D(i / 100, j / 100) +
            simplex.noise2D((i + 200) / 50, j / 50) * Math.pow(ex, 1) +
            simplex.noise2D((i + 400) / 25, j / 25) * Math.pow(ex, 2) +
            simplex.noise2D((i + 600) / 12.5, j / 12.5) * Math.pow(ex, 3) +
            +(simplex.noise2D((i + 800) / 6.25, j / 6.25) * Math.pow(ex, 4))) /
          2;
      }
    }

    pos.needsUpdate = true;

    terrain.current.computeVertexNormals();
  });

  useFrame(() => {
    // mesh.current.rotation.x = -Math.PI / 2;
  });
  return (
    <mesh
      ref={mesh}
      position={[0, 0, 0]}
      receiveShadow
      castShadow
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeBufferGeometry
        attach="geometry"
        args={[1000, 1000, 250, 250]}
        ref={terrain}
      />
      <meshPhongMaterial attach="material" color="#69b581" flatShading />
      {/* <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        aoMap={aoMap}
        flatShading
      /> */}
    </mesh>
  );
};

export default Ground;
