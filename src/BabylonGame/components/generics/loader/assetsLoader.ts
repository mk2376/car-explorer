import {
  AssetContainer,
  AssetsManager,
  Scene,
  _forceSceneHelpersToBundle,
} from '@babylonjs/core';
import AmmoModule from 'ammojs-typed';

import {
  AssetsManagerContainers,
  ContainerData,
  Containers,
  Scenes,
} from 'src/BabylonGame/interfaces';
import { now, elapsed } from '../../time';
import { Lights } from '../Lights/Lights';
import { AssetsManagerCustom } from './assetsManagerCustom';
import {
  _applyPolicyPlayer,
  __meshPolicyPlayer,
  __impostorPolicyPlayer,
} from './assetsManagerTasks/_policyPlayer';
import { _containerTask } from './assetsManagerTasks/_containerTask';
import {
  _applyPolicyWorld,
  __impostorPolicyWorld,
  __meshPolicyWorld,
} from './assetsManagerTasks/_policyWorld';
import { SceneManagement } from '../../sceneManagement';

let Ammo: typeof AmmoModule;

// AssetsLoader loads assets(babylon exports), applies policies to them and adds lights.
// (basicaly everything that is possible to be done in Container is done here)
export class AssetsLoader {
  protected _sceneManagement: SceneManagement;
  protected _lights!: Lights;

  protected _showBoundingBox = false;

  // functions that have __ in front are already grouped by another function and are
  // here imported purely to be visible within this class

  // worlds
  protected _containerTask = _containerTask;
  protected _applyPolicyWorld = _applyPolicyWorld;
  protected __meshPolicyWorld = __meshPolicyWorld;
  protected __impostorPolicyWorld = __impostorPolicyWorld;

  // player
  protected _applyPolicyPlayer = _applyPolicyPlayer;
  protected __meshPolicyPlayer = __meshPolicyPlayer;
  protected __impostorPolicyPlayer = __impostorPolicyPlayer;

  readonly _assetContainers: AssetsManagerContainers;

  protected Ammo: typeof AmmoModule;

  constructor(sceneManagement: SceneManagement, AmmoImport: typeof AmmoModule) {
    this._sceneManagement = sceneManagement;

    this._assetContainers = {
      [Scenes.START]: {},
      [Scenes.PORTFOLIO]: {
        assetsManager: new AssetsManagerCustom(
          this._sceneManagement.scenes[Scenes.PORTFOLIO].scene
        ).assetsManager,
        containers: [
          {
            name: 'portfolioWorld',
            path: './CarExplorer/modes/portfolioWorld/',
            file: 'portfolioWorld.babylon',
            container: {},
            policy: (container) => {
              this._applyPolicyWorld(container);
            },
          },
          {
            name: 'player',
            path: './CarExplorer/models/player/',
            file: 'player.babylon',
            container: {},
            policy: (container) => {
              this._applyPolicyPlayer(container);
            },
          },
        ],
      },
      [Scenes.CUTSCENE]: {},
      [Scenes.ADVENTURE]: {
        assetsManager: new AssetsManagerCustom(
          this._sceneManagement.scenes[Scenes.ADVENTURE].scene
        ).assetsManager,
        containers: [
          {
            name: 'adventureWorld',
            path: './CarExplorer/models/adventureWorld/',
            file: 'adventureWorld.babylon',
            container: {},
            policy: (container) => {
              this._applyPolicyWorld(container);
            },
          },
          {
            name: 'player',
            path: './CarExplorer/models/player/',
            file: 'player.babylon',
            container: {},
            policy: (container) => {
              this._applyPolicyPlayer(container);
            },
          },
        ],
      },
      [Scenes.LOSE]: {},
      [Scenes.WIN]: {},
    };

    Ammo = AmmoImport;
    this.Ammo = Ammo;
  }

  public init() {
    Object.keys(this._containers).forEach((containerName) => {
      const containerData = this._containers[containerName as keyof Containers];

      this._containerTask(
        containerName,
        containerData.path,
        containerData.file
      );

      containerData.policy(containerData.container);
    });
  }
}
