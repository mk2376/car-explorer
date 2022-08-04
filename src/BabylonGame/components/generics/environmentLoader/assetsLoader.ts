import { Vector3 } from '@babylonjs/core';
import {
  SceneAssetManagerContainers,
  ContainerDefinitions,
  Scenes,
} from 'src/BabylonGame/interfaces';
import { now, elapsed } from '../../time';
import { _applyPolicyPlayer } from './containerDefinitions/shared/player/_policyPlayer';
import { _applyPolicyGeneral } from './containerDefinitions/shared/_policyGeneral';
import { SceneManagement } from '../../sceneManagement';
import { SceneAssetManagerContainer } from './sceneAssetManagerContainer';
import { _containerDefinition, _containerDefinitionLights } from './containerDefinition';
import { LightsCutscene } from '../Lights/LightsCutscene';
import { _containerDefinitionPortfolioWorld } from './containerDefinitions/scene/portfolio/portfolioWorld';
import { _containerDefinitionAdventureWorld } from './containerDefinitions/scene/adventure/adventureWorld';
import { _containerDefinitionPlayer } from './containerDefinitions/shared/player/player';
import { LightsPortfolio } from '../Lights/LightsPortfolio';
import { LightsAdventure } from '../Lights/LightsAdventure';
import { _applyPolicyCutscene, _containerDefinitionCoin } from './containerDefinitions/shared/coin';
import { _containerDefinitionPortal } from './containerDefinitions/shared/portal';

// AssetsLoader loads assets(babylon exports) (enables physics on them), applies policies to them and adds lights.
// (basicaly everything that is possible to be done in Container is done here)
export class AssetsLoader {
  protected _sceneManagement: SceneManagement;
  protected _assetManagerContainers: SceneAssetManagerContainers;

  // imported functions

  // policys to apply
  protected _applyPolicyCutscene = _applyPolicyCutscene;
  protected _applyPolicyGeneral = _applyPolicyGeneral;
  protected _applyPolicyPlayer = _applyPolicyPlayer;

  // generic containerDefinitions
  protected _containerDefinition = _containerDefinition;
  protected _containerDefinitionLights = _containerDefinitionLights;

  // specific containerDefinitions
  protected _containerDefinitionPortfolioWorld = _containerDefinitionPortfolioWorld;
  protected _containerDefinitionAdventureWorld = _containerDefinitionAdventureWorld;
  protected _containerDefinitionPlayer = _containerDefinitionPlayer;
  protected _containerDefinitionCoin = _containerDefinitionCoin;
  protected _containerDefinitionPortal = _containerDefinitionPortal;

  constructor(sceneManagement: SceneManagement) {
    this._sceneManagement = sceneManagement;

    this._assetManagerContainers = {
      [Scenes.CUTSCENE]: new SceneAssetManagerContainer(
        this._sceneManagement.scenes[Scenes.CUTSCENE].scene,
        {
          [ContainerDefinitions.Coin]: this._containerDefinitionCoin(),
          [ContainerDefinitions.Lights]: this._containerDefinitionLights(
            LightsCutscene,
            Scenes.CUTSCENE
          ),
        }
      ),
      [Scenes.PORTFOLIO]: new SceneAssetManagerContainer(
        this._sceneManagement.scenes[Scenes.PORTFOLIO].scene,
        {
          [ContainerDefinitions.Scene]: this._containerDefinitionPortfolioWorld(),
          [ContainerDefinitions.Player]: this._containerDefinitionPlayer(),
          [ContainerDefinitions.Portal]: this._containerDefinitionPortal(),
          [ContainerDefinitions.Lights]: this._containerDefinitionLights(
            LightsPortfolio,
            Scenes.PORTFOLIO
          ),
        },
        new Vector3(
          ...process.env.PORTFOLIO_gravityVector!.split(',').map((item) => parseFloat(item))
        )
      ),
      [Scenes.ADVENTURE]: new SceneAssetManagerContainer(
        this._sceneManagement.scenes[Scenes.ADVENTURE].scene,
        {
          [ContainerDefinitions.Scene]: this._containerDefinitionAdventureWorld(),
          [ContainerDefinitions.Player]: this._containerDefinitionPlayer(),
          [ContainerDefinitions.Coin]: this._containerDefinitionCoin(),
          [ContainerDefinitions.Portal]: this._containerDefinitionPortal(),
          [ContainerDefinitions.Lights]: this._containerDefinitionLights(
            LightsAdventure,
            Scenes.ADVENTURE
          ),
        },
        new Vector3(
          ...process.env.ADVENTURE_gravityVector!.split(',').map((item) => parseFloat(item))
        )
      ),
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
