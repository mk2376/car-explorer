import { AssetContainer, Observable, Sound } from '@babylonjs/core';
import { GameEngine } from './components/generics/GameEngine/GameEngine';
import { simpleSceneEngine } from './simpleScenes/simpleSceneEngine';

export interface EnvVars {
  [key: string]: string;
}

export interface Sounds {
  [key: string]: Sound;
}

export interface State {
  [key: string]: number;
}

export type GameSceneEngine = simpleSceneEngine | GameEngine;

//enum for scenes
export interface Engines {
  [key: string]: GameSceneEngine;
}

export interface Metadata {
  mass: number;
  objectType: string;
}

export interface Containers {
  [key: string]: AssetContainer;
}

export interface observers {
  speedMeter: Observable<unknown>;
}

export interface adventureObservers extends observers {
  crystal?: Observable<unknown>;
  timer?: Observable<unknown>;
}
