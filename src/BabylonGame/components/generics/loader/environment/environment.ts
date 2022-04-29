import { AssetsManager, Engine, Scene } from '@babylonjs/core';
import AmmoModule from 'ammojs-typed';
import { SceneManagement } from 'src/BabylonGame/components/sceneManagement';

import { Containers } from 'src/BabylonGame/interfaces';
import { now, elapsed } from '../../../time';
import { Lights } from '../../Lights/Lights';
import { AssetsManagerCustom } from '../assetsManagerCustom';
import { _playerTask } from '../assetsManagerTasks/playerTasks/_playerTask';
import {
  _applyPolicyPlayer,
  __meshPolicyPlayer,
  __impostorPolicyPlayer,
} from '../assetsManagerTasks/playerTasks/_policyPlayer';

import {
  _applyPolicyWorld,
  __meshPolicyWorld,
  __impostorPolicyWorld,
} from '../assetsManagerTasks/worldTasks/_policyWorld';

let Ammo: typeof AmmoModule;

export class Environment {
  protected _engine: Engine;
  protected _scene: Scene;
  protected _lights!: Lights;
  protected _sceneManagement: SceneManagement;
  protected _assetsManager: AssetsManager;
  readonly _containers: Containers = {};

  protected _showBoundingBox = false;

  readonly containerWorld!: string;
  readonly containerPlayer!: string;
  readonly containerLights!: string;

  // worlds
  protected _applyPolicyWorld = _applyPolicyWorld;
  protected __meshPolicyWorld = __meshPolicyWorld;
  protected __impostorPolicyWorld = __impostorPolicyWorld;

  // player
  protected _playerTask = _playerTask;

  protected _applyPolicyPlayer = _applyPolicyPlayer;
  protected __meshPolicyPlayer = __meshPolicyPlayer;
  protected __impostorPolicyPlayer = __impostorPolicyPlayer;

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

  protected _createLights(lights: Lights, containerName: string) {
    this._lights = lights;
    this._containers[containerName] = this._lights._container;
  }

  public async addAlltoScene() {
    const begining = now();

    this._containers[this.containerWorld].addAllToScene();
    this._containers[this.containerPlayer].addAllToScene();
    this._containers[this.containerLights].addAllToScene();

    await this._scene.whenReadyAsync();
    console.info(`${elapsed(begining)} addAlltoScene`);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async load() {
    throw new Error('Method not implemented.');
  }
}
