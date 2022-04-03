import { useLoader } from "@react-three/fiber";
import React, { useMemo } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const Nature: React.FC = () => {
  const [
    birch3,
    birch4,
    berry1,
    ctree3,
    ctree5,
    grass2,
    grass,
    rock1,
    rock5,
    willow2,
    willow5,
    log,
  ] = useLoader(FBXLoader, [
    "./textures/nature/BirchTree_3.fbx",
    "./textures/nature/BirchTree_4.fbx",
    "./textures/nature/BushBerries_1.fbx",
    "./textures/nature/CommonTree_3.fbx",
    "./textures/nature/CommonTree_5.fbx",
    "./textures/nature/Grass_2.fbx",
    "./textures/nature/Grass.fbx",
    "./textures/nature/Rock_1.fbx",
    "./textures/nature/Rock_5.fbx",
    "./textures/nature/Willow_2.fbx",
    "./textures/nature/Willow_5.fbx",
    "./textures/nature/WoodLog_Moss.fbx",
  ]);

  birch3.scale.setScalar(0.4);
  birch3.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  birch4.scale.setScalar(0.3);
  birch4.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  berry1.scale.setScalar(0.08);
  berry1.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  grass2.scale.setScalar(0.05);
  grass2.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  grass.scale.setScalar(0.05);
  grass.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  rock1.scale.setScalar(0.2);
  rock1.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  rock5.scale.setScalar(0.2);
  rock5.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  willow2.scale.setScalar(0.4);
  willow2.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  willow5.scale.setScalar(0.5);
  willow5.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  log.scale.setScalar(0.1);
  log.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  ctree3.scale.setScalar(0.4);
  ctree3.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  ctree5.scale.setScalar(0.4);
  ctree5.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });

  const objects: JSX.Element[] = [];

  const createTrees = useMemo(() => {
    for (let i = 0; i < 100; i++) {
      const idx: number = Math.floor(Math.random() * 11) + 1;
      const pos = new THREE.Vector3(
        Math.ceil(Math.random() * 450) * (Math.round(Math.random()) ? 1 : -1),
        0,
        Math.ceil(Math.random() * 450) * (Math.round(Math.random()) ? 1 : -1)
      );

      const obj = (
        <primitive
          key={i}
          position={pos}
          object={
            idx === 1
              ? birch3.clone()
              : idx === 2
              ? birch4.clone()
              : idx === 3
              ? berry1.clone()
              : idx === 4
              ? ctree3.clone()
              : idx === 5
              ? ctree5.clone()
              : idx === 6
              ? grass2.clone()
              : idx === 7
              ? grass.clone()
              : idx === 8
              ? rock1.clone()
              : idx === 9
              ? rock5.clone()
              : idx === 10
              ? willow2.clone()
              : idx === 11
              ? willow5.clone()
              : log.clone()
          }
        />
      );

      objects.push(obj);
    }
  }, []);

  return (
    <group>
      {objects.map((obj: JSX.Element) => {
        return obj;
      })}
    </group>
  );
};

export default Nature;
