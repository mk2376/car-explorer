import {
  Color3,
  Mesh,
  MeshBuilder,
  PhysicsImpostor,
  StandardMaterial,
  Vector3,
} from '@babylonjs/core';
import { GridMaterial, WaterMaterial } from '@babylonjs/materials';
import { EnvironmentPortfolio } from '../../environment/environmentPortfolio';

export function _testWorldTask(
  this: EnvironmentPortfolio,
  containerName: string
): void {
  const temp = this._assetsManager.addContainerTask(
    'environment',
    '',
    // './CarExplorer/models/',
    // 'world.babylon'
    'https://raw.githubusercontent.com/RaggarDK/Baby/baby/',
    'ramp.babylon'
  );

  temp.onSuccess = (task) => {
    const container = task.loadedContainer;

    //Loop through all environment meshes that were imported
    container.meshes.forEach((mesh) => {
      mesh.receiveShadows = true;
    });

    this._containers[containerName] = container;
  };

  this._testWorldAddons();
}

export function _testWorldAddons(this: EnvironmentPortfolio) {
  const ground = Mesh.CreateGround('ground', 460, 460, 2);
  const material = new StandardMaterial('red2', this._scene); // new GridMaterial('groundMaterial', this._scene);
  material.diffuseColor = new Color3(0.8, 0.4, 0.5);
  material.emissiveColor = new Color3(0.8, 0.4, 0.5);
  ground.material = material;
  ground.physicsImpostor = new PhysicsImpostor(
    ground,
    PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0.5, restitution: 0.7 },
    this._scene
  );
  ground.receiveShadows = true;

  this._createBox(
    new Vector3(100, 1, 100),
    new Vector3(0, 0, 0),
    new Vector3(),
    0
  );

  this._createBox(
    new Vector3(4, 1, 12),
    new Vector3(0, 0, 25),
    new Vector3(-Math.PI / 8, 0, 0),
    0
  );
  this._createBox(
    new Vector3(4, 1, 12),
    new Vector3(25, 0, 0),
    new Vector3(-Math.PI / 8, Math.PI / 2, 0),
    0
  );
  this._createBox(
    new Vector3(4, 1, 12),
    new Vector3(0, 0, -25),
    new Vector3(Math.PI / 8, 0, 0),
    0
  );
  this._createBox(
    new Vector3(4, 1, 12),
    new Vector3(-25, 0, 0),
    new Vector3(Math.PI / 8, Math.PI / 2, 0),
    0
  );

  const s = new Vector3();
  const p = new Vector3();
  const r = new Vector3();
  for (let i = 0; i < 20; i++) {
    const m = Math.random() * 300 - 150 + 5;
    const m3 = Math.random() * 300 - 150 + 5;
    const m2 = Math.random() * 10;
    s.set(m2, m2, m2);
    p.set(m3, 0, m);
    r.set(m, m, m);
    this._createBox(s, p, r, 0);
  }

  for (let i = 0; i < 30; i++) {
    const m = Math.random() * 300 - 150 + 5;
    const m3 = Math.random() * 300 - 150 + 5;
    const m2 = Math.random() * 3;
    s.set(m2, m2, m2);
    p.set(m3, 0, m);
    r.set(m, m, m);
    this._createBox(s, p, r, 5);
  }
}

export function _createBox(
  this: EnvironmentPortfolio,
  size: Vector3,
  position: Vector3,
  rotation: Vector3,
  mass: number
) {
  const box = MeshBuilder.CreateBox(
    'box',
    { width: size.x, depth: size.z, height: size.y },
    this._scene
  );
  box.position.set(position.x, position.y, position.z);
  box.rotation.set(rotation.x, rotation.y, rotation.z);
  if (!mass) {
    mass = 0;
    const redMaterial = new StandardMaterial('RedMaterial', this._scene);
    redMaterial.diffuseColor = new Color3(0.8, 0.4, 0.5);
    redMaterial.emissiveColor = new Color3(0.8, 0.4, 0.5);
    box.material = redMaterial;
  } else {
    box.position.y += 5;
    const blueMaterial = new StandardMaterial('RedMaterial', this._scene);
    blueMaterial.diffuseColor = new Color3(0.5, 0.4, 0.8);
    blueMaterial.emissiveColor = new Color3(0.5, 0.4, 0.8);
    box.material = blueMaterial;
  }
  box.physicsImpostor = new PhysicsImpostor(
    box,
    PhysicsImpostor.BoxImpostor,
    { mass: mass, friction: 0.5, restitution: 0.7 },
    this._scene
  );

  box.receiveShadows = true;
  // this._lights.addShadowCaster(box, true);
}
