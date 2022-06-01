import { AssetContainer, Scene } from '@babylonjs/core';
import { Lights } from '../Lights/Lights';
import { AssetsLoader } from './assetsLoader';
import AmmoModule from 'ammojs-typed';
import { LightsPortfolio } from '../Lights/LightsPortfolio';
import { Scenes } from 'src/BabylonGame/interfaces';
import { LightsAdventure } from '../Lights/LightsAdventure';
import { LightsCutscene } from '../Lights/LightsCutscene';

export function _containerDefinitionPortfolioWorld(this: AssetsLoader) {
  return {
    name: 'portfolioWorld',
    path: './CarExplorer/models/portfolioWorld/',
    file: 'portfolioWorld.babylon',
    policy: (
      scene: Scene,
      container: AssetContainer,
      lights: Lights,
      AmmoImport: typeof AmmoModule
    ) => {
      this._applyPolicyWorld(scene, container, lights, AmmoImport);
    },
  };
}

export function _containerDefinitionLightsPortfolio(this: AssetsLoader) {
  return new LightsPortfolio(this._sceneManagement.scenes[Scenes.PORTFOLIO].scene);
}

export function _containerDefinitionAdventureWorld(this: AssetsLoader) {
  return {
    name: 'adventureWorld',
    path: './CarExplorer/models/adventureWorld/',
    file: 'adventureWorld.babylon',
    policy: (
      scene: Scene,
      container: AssetContainer,
      lights: Lights,
      AmmoImport: typeof AmmoModule
    ) => {
      this._applyPolicyWorld(scene, container, lights, AmmoImport);
    },
  };
}

export function _containerDefinitionLightsAdventure(this: AssetsLoader) {
  return new LightsAdventure(this._sceneManagement.scenes[Scenes.ADVENTURE].scene);
}

export function _containerDefinitionPlayer(this: AssetsLoader) {
  return {
    name: 'player',
    path: './CarExplorer/models/player/',
    file: 'player.babylon',
    policy: (
      scene: Scene,
      container: AssetContainer,
      lights: Lights,
      AmmoImport: typeof AmmoModule
    ) => {
      this._applyPolicyPlayer(scene, container, lights, AmmoImport);
    },
  };
}

export function _containerDefinitionCoin(this: AssetsLoader) {
  return {
    name: 'coin',
    path: './CarExplorer/models/crystal/',
    file: 'crystal.babylon',
    policy: (
      scene: Scene,
      container: AssetContainer,
      lights: Lights,
      AmmoImport: typeof AmmoModule
    ) => {
      this._applyPolicyCutscene(scene, container, lights, AmmoImport);
    },
  };
}

export function _containerDefinitionLightsCutscene(this: AssetsLoader) {
  return new LightsCutscene(this._sceneManagement.scenes[Scenes.CUTSCENE].scene);
}
