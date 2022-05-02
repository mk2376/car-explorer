import {
  AssetContainer,
  AssetsManager,
  Observable,
  Scene,
  Sound,
} from '@babylonjs/core';
import { GameEngine } from './components/generics/GameEngine/GameEngine';
import { SimpleSceneEngine } from './simpleScenes/simpleSceneEngine';

// empty objects realizes using:
export type EmptyObject = Record<string, never>;

export interface EnvVarsMap {
  [key: string]: string;
}

export interface Sounds {
  [key: string]: Sound;
}

export type GameSceneEngine = SimpleSceneEngine | GameEngine | EmptyObject;

export interface Metadata {
  mass: number;
  objectType: string;
}

export type AssetsManagerContainers = {
  [key in Scenes]: Containers | EmptyObject;
};

export interface Containers {
  assetsManager: AssetsManager;
  containers: ContainerData[];
}

export interface ContainerData {
  name: string;
  path: string;
  file: string;
  container: AssetContainer | EmptyObject;
  policy: (container: AssetContainer) => void;
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
  engine: GameSceneEngine;
}
