import { AssetsLoader } from '../../assetsLoader';
import { AbstractMesh, AssetContainer, Scene } from '@babylonjs/core';
import AmmoModule from 'ammojs-typed';
import { Lights } from '../../../Lights/Lights';

export function _containerDefinitionCoin(this: AssetsLoader) {
  return this._containerDefinition(
    'adventure coin',
    './CarExplorer/models/shared/crystal/crystal.babylon',
    this._applyPolicyCutscene
  );
}

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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  _lights.addShadowCaster(mesh, true);
}
