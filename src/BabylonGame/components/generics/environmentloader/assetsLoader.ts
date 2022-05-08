import { Vector3 } from '@babylonjs/core';
import {
  SceneAssetManagerContainers,
  ContainerDefinitions,
  Scenes,
} from 'src/BabylonGame/interfaces';
import { now, elapsed } from '../../time';
import { _applyPolicyPlayer } from './policys/_policyPlayer';
import { _applyPolicyWorld } from './policys/_policyWorld';
import { SceneManagement } from '../../sceneManagement';
import {
  _containerDefinitionAdventureWorld,
  _containerDefinitionCoin,
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

  // imported functions

  protected _applyPolicyWorld = _applyPolicyWorld;
  protected _applyPolicyPlayer = _applyPolicyPlayer;

  // containerDefinitions
  protected _containerDefinitionPortfolioWorld = _containerDefinitionPortfolioWorld;
  protected _containerDefinitionLightsPortfolio = _containerDefinitionLightsPortfolio;
  protected _containerDefinitionAdventureWorld = _containerDefinitionAdventureWorld;
  protected _containerDefinitionLightsAdventure = _containerDefinitionLightsAdventure;
  protected _containerDefinitionPlayer = _containerDefinitionPlayer;
  protected _containerDefinitionCoin = _containerDefinitionCoin;

  constructor(sceneManagement: SceneManagement) {
    this._sceneManagement = sceneManagement;

    this._assetManagerContainers = {
      [Scenes.PORTFOLIO]: new SceneAssetManagerContainer(
        this._sceneManagement.scenes[Scenes.PORTFOLIO].scene,
        {
          [ContainerDefinitions.PortfolioWorld]: this._containerDefinitionPortfolioWorld(),
          [ContainerDefinitions.Player]: this._containerDefinitionPlayer(),
          [ContainerDefinitions.Lights]: this._containerDefinitionLightsPortfolio(),
        },
        new Vector3(
          ...process.env.PORTFOLIO_gravityVector!.split(',').map((item) => parseFloat(item))
        )
      ),
      /*
      [Scenes.ADVENTURE]: new SceneAssetManagerContainer(
        this._sceneManagement.scenes[Scenes.ADVENTURE].scene,
        {
          [ContainerDefinitions.AdventureWorld]: this._containerDefinitionAdventureWorld(),
          [ContainerDefinitions.Player]: this._containerDefinitionPlayer(),
          [ContainerDefinitions.Lights]: this._containerDefinitionLightsAdventure(),
          [ContainerDefinitions.Coin]: this._containerDefinitionCoin(),
        },
        new Vector3(
          ...process.env.ADVENTURE_gravityVector!.split(',').map((item) => parseFloat(item))
        )
      ),*/
    };
  }

  public init() {
    Object.keys(this._assetManagerContainers).forEach((assetContainersIndex: unknown) => {
      const assetContainer = this._assetManagerContainers[assetContainersIndex as Scenes]!;

      assetContainer.loadAllContainerTasks();
    });

    return this._assetManagerContainers;
  }
}
