import { AbstractMesh, AssetContainer, Scene, Vector3 } from '@babylonjs/core';
import { Lights } from '../../../../Lights/Lights';
import { AssetsLoader } from '../../../assetsLoader';
import AmmoModule from 'ammojs-typed';

let Ammo: typeof AmmoModule;

let _scene: Scene;
let _lights: Lights;

const coinMeshName = 'objectType:coin';

export function _applyPolicyCutscene(
  this: AssetsLoader,
  scene: Scene,
  container: AssetContainer,
  lights: Lights,
  AmmoImport: typeof AmmoModule
) {
  _scene = scene;
  _lights = lights;
  Ammo = AmmoImport;

  const playerMesh = container.meshes.filter((mesh) => mesh.name.includes(coinMeshName))[0];

  __meshPolicyCutscene(playerMesh, container);
}

export function __meshPolicyCutscene(mesh: AbstractMesh, container: AssetContainer) {
  mesh.receiveShadows = true;
}
