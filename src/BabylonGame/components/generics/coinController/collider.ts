import {
  AbstractMesh,
  MeshBuilder,
  Vector3,
  StandardMaterial,
  Color3,
} from '@babylonjs/core';
import { coinController } from './coinController';

export function addSphereCollider(
  this: coinController,
  mesh: AbstractMesh,
  isVisible: boolean
) {
  const collider = MeshBuilder.CreateCylinder(
    `${mesh.name}_collider`,
    {
      diameter: 3.5,
      height: 6,
      subdivisions: 24,
    },
    mesh.getScene()
  );

  collider.parent = mesh;
  collider.position = new Vector3();

  collider.checkCollisions = true;
  collider.isVisible = isVisible;

  // Set ellipsoid debug shape material
  const debugmat = new StandardMaterial('debugmat', mesh.getScene());
  debugmat.diffuseColor = new Color3(0, 1, 0);
  debugmat.wireframe = true;
  collider.material = debugmat;

  return collider;
}

export function randomLocation(mesh: AbstractMesh, collider: AbstractMesh) {
  const pos = mesh.absolutePosition;

  const x = randomIntFromInterval(-100, 100);
  const z = randomIntFromInterval(-100, 100);

  // TODO: collider._checkCollision()

  mesh.position = new Vector3(x, pos.y, z);
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
