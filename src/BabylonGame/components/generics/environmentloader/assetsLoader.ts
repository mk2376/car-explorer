import { Vector3 } from '@babylonjs/core';
import AmmoModule from 'ammojs-typed';
import {
  SceneAssetManagerContainers,
  ContainerDefinitions,
  EnvVarsMap,
  Scenes,
} from 'src/BabylonGame/interfaces';
import { now, elapsed } from '../../time';
import { _applyPolicyPlayer } from './policys/_policyPlayer';
import { _applyPolicyWorld } from './policys/_policyWorld';
import { SceneManagement } from '../../sceneManagement';
import {
  _containerDefinitionAdventureWorld,
  _containerDefinitionLightsAdventure,
  _containerDefinitionLightsPortfolio,
  _containerDefinitionPlayer,
  _containerDefinitionPortfolioWorld,
} from './containerDefinitions';
import { SceneAssetManagerContainer } from './sceneAssetManagerContainer';

// AssetsLoader loads assets(babylon exports) (enables physics on them), applies policies to them and adds lights.
// (basicaly everything that is possible to be done in Container is done here)
export class AssetsLoader {
  protected _sceneManagement: SceneManagement;
  protected _assetManagerContainers: SceneAssetManagerContainers;
  protected Ammo: typeof AmmoModule;

  // imported functions

  protected _applyPolicyWorld = _applyPolicyWorld;
  protected _applyPolicyPlayer = _applyPolicyPlayer;

  // containerDefinitions
  protected _containerDefinitionPortfolioWorld = _containerDefinitionPortfolioWorld;
  protected _containerDefinitionLightsPortfolio = _containerDefinitionLightsPortfolio;
  protected _containerDefinitionAdventureWorld = _containerDefinitionAdventureWorld;
  protected _containerDefinitionLightsAdventure = _containerDefinitionLightsAdventure;
  protected _containerDefinitionPlayer = _containerDefinitionPlayer;

  constructor(sceneManagement: SceneManagement, AmmoImport: typeof AmmoModule) {
    this._sceneManagement = sceneManagement;
    this.Ammo = AmmoImport;

    this._assetManagerContainers = {
      [Scenes.PORTFOLIO]: new SceneAssetManagerContainer(
        this._sceneManagement.scenes[Scenes.PORTFOLIO].scene,
        {
          [ContainerDefinitions.PortfolioWorld]: this._containerDefinitionPortfolioWorld(),
          [ContainerDefinitions.Player]: this._containerDefinitionPlayer(),
          [ContainerDefinitions.Lights]: this._containerDefinitionLightsPortfolio(),
        },
        process.env.PORTFOLIO as unknown as EnvVarsMap['gravityVector'] as unknown as Vector3,
        this.Ammo
      ),
      [Scenes.ADVENTURE]: new SceneAssetManagerContainer(
        this._sceneManagement.scenes[Scenes.ADVENTURE].scene,
        {
          [ContainerDefinitions.AdventureWorld]: this._containerDefinitionAdventureWorld(),
          [ContainerDefinitions.Player]: this._containerDefinitionPlayer(),
          [ContainerDefinitions.Lights]: this._containerDefinitionLightsAdventure(),
        },
        process.env.ADVENTURE as unknown as EnvVarsMap['gravityVector'] as unknown as Vector3,
        this.Ammo
      ),
    };
  }

  public init() {
    Object.keys(this._assetManagerContainers).forEach((_, assetContainersIndex) => {
      const assetContainer = this._assetManagerContainers[assetContainersIndex as Scenes];

      if (assetContainer) assetContainer.loadAllContainerTasks();
    });

    return this._assetManagerContainers;
  }
}
