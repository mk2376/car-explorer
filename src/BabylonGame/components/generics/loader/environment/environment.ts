import { AssetContainer, AssetsManager, Engine, Scene } from '@babylonjs/core';
import AmmoModule from 'ammojs-typed';
import { SceneManagement } from 'src/BabylonGame/components/sceneManagement';

import { Containers } from 'src/BabylonGame/interfaces';
import { Lights } from '../../Lights/Lights';
import { AssetsManagerCustom } from '../assetsManagerCustom';
import {
  _playerTask,
  _meshPolicyPlayer,
  _impostorPolicyPlayer,
} from '../assetsManagerTasks/_playerTask';
import {
  _meshPolicyWorld,
  _impostorPolicyWorld,
} from '../assetsManagerTasks/_policyWorld';

let Ammo: typeof AmmoModule;

export class Environment {
  protected _engine: Engine;
  protected _scene: Scene;
  protected _lights!: Lights;
  protected _sceneManagement: SceneManagement;
  protected _assetsManager: AssetsManager;
  readonly _containers: Containers = {};
  protected _showBoundingBox = false;

  readonly containerName!: string;
  readonly containerNamePlayer!: string;

  private _meshPolicyWorld = _meshPolicyWorld;
  private _impostorPolicyWorld = _impostorPolicyWorld;

  protected _playerTask = _playerTask;
  protected _meshPolicyPlayer = _meshPolicyPlayer;
  protected _impostorPolicyPlayer = _impostorPolicyPlayer;

  protected Ammo: typeof AmmoModule;

  constructor(
    scene: Scene,
    sceneManagement: SceneManagement,
    AmmoImport: typeof AmmoModule
  ) {
    this._engine = scene.getEngine();
    this._scene = scene;
    const assetsManagerCustom = new AssetsManagerCustom(this._scene);
    this._assetsManager = assetsManagerCustom.assetsManager;
    this._sceneManagement = sceneManagement;

    Ammo = AmmoImport;
    this.Ammo = Ammo;
  }

  _applyPolicyWorld(container: AssetContainer) {
    //Loop through all world environment meshes that were imported
    container.meshes.forEach((mesh) => {
      this._meshPolicyWorld(mesh, container);
      this._impostorPolicyWorld(mesh, container);
    });
  }

  async _playerTaskLoad(
    container: AssetContainer,
    containerNamePlayer: string
  ) {
    this._playerTask(containerNamePlayer);
    await this._assetsManager.loadAsync();
  }

  addAlltoScene() {
    this._containers[this.containerName].addAllToScene();
    this._containers[this.containerNamePlayer].addAllToScene();
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async load(dev?: boolean) {
    throw new Error('Method not implemented.');
  }
}
