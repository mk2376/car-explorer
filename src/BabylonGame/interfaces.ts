import { AssetContainer, Observable, Scene, Sound } from '@babylonjs/core';
import { GameEngine } from './components/generics/GameEngine/GameEngine';
import { Lights } from './components/generics/Lights/Lights';
import { SimpleSceneEngine } from './simpleScenes/simpleSceneEngine';
import AmmoModule from 'ammojs-typed';
import { SceneAssetManagerContainer } from './components/generics/environmentloader/sceneAssetManagerContainer';

// empty objects realized using:
export type EmptyObject = Record<string, never>;

export interface Sounds {
  [key: string]: Sound;
}

export type GameSceneEngine = SimpleSceneEngine | GameEngine | EmptyObject;

export interface Metadata {
  mass: number;
  objectType: string;
}

export type SceneAssetManagerContainers = {
  [key in Scenes]?: SceneAssetManagerContainer;
};

export type Containers = {
  [key in ContainerDefinitions]?: ContainerData | Lights;
};

export interface ContainerData {
  name: string;
  path: string;
  file: string;
  container?: AssetContainer;
  policy: (
    scene: Scene,
    container: AssetContainer,
    lights: Lights,
    AmmoImport: typeof AmmoModule
  ) => void;
}

export interface observers {
  speedMeter: Observable<unknown>;
}

export interface adventureObservers extends observers {
  crystal?: Observable<unknown>;
  timer?: Observable<unknown>;
}

export enum Scenes {
  START = 0,
  PORTFOLIO,
  CUTSCENE,
  ADVENTURE,
  LOSE,
  WIN,
}

export interface SceneData {
  scene: Scene;
  engine?: GameSceneEngine;
}

export enum ContainerDefinitions {
  Lights = 0,
  PortfolioWorld,
  AdventureWorld,
  Player,
  Coin,
}
