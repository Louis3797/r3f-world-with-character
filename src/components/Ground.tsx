import React, { useLayoutEffect, useMemo, useRef } from "react";
import SimplexNoise from "simplex-noise";
import * as THREE from "three";

const Ground: React.FC = () => {
  const simplex = useMemo(() => new SimplexNoise(), []);

  const terrain = useRef<THREE.PlaneGeometry>(null!);

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

  return (
    <mesh position={[0, 0, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry
        attach="geometry"
        args={[1000, 1000, 250, 250]}
        ref={terrain}
      />

      <meshPhongMaterial attach="material" color="#69b581" />
    </mesh>
  );
};

export default Ground;
