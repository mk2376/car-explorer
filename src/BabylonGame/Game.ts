import { Engine } from '@babylonjs/core';
import { modCanvas } from './components/modCanvas';
import { events } from './components/events';

import { SceneManagement } from './components/sceneManagement';
import { GameEnginePortfolio } from './components/generics/GameEngine/GameEnginePortfolio/GameEnginePortfolio';
import { GameEngineAdventure } from './components/generics/GameEngine/GameEngineAdventure/GameEngineAdventure';

import { startScene } from './simpleScenes/scenes/startScene';
import { cutScene } from './simpleScenes/scenes/cutScene';
import { loseScene } from './simpleScenes/scenes/loseScene';
import { winScene } from './simpleScenes/scenes/winScene';
import { GameSceneEngine, Scenes } from './interfaces';
import { now, elapsed } from './components/time';
import { AssetsLoader } from './components/generics/environmentloader/assetsLoader';
import AmmoModule from 'ammojs-typed';
import { SceneAssetManagerContainer } from './components/generics/environmentloader/sceneAssetManagerContainer';

// Game class is the entire game application
export class Game {
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  private _sceneManagement: SceneManagement;
  private _physics!: typeof AmmoModule;

  constructor(private canvas: HTMLCanvasElement) {
    this._canvas = modCanvas(canvas, 'gameCanvas');
    this._engine = new Engine(this._canvas, true);
    this._sceneManagement = new SceneManagement(this._engine);

    // MAIN render loop
    void (async () => {
      await this._main();
    })();
  }

  private async _main(): Promise<void> {
    console.info(`Environment: ${process.env.ENV_TYPE as string}`);

    events(this._engine, this._sceneManagement);

    const begining = now();
    console.groupCollapsed('Game loading...');
    await this._initPhysics();
    await this._loadEngines();
    console.groupEnd();
    console.info(`Game loaded: ${elapsed(begining)}s`);

    // Register a render loop to repeatedly render the scene
    this._engine.runRenderLoop(() => {
      this._sceneManagement.scenes[this._sceneManagement.state.cur].scene.render();
    });
  }

  // Enable physics
  protected async _initPhysics() {
    this._physics = await AmmoModule();
  }

  private async _loadEngines(): Promise<void> {
    this._engine.displayLoadingUI();

    // (process.env.PORTFOLIO as unknown as EnvVarsMap['load'])
    const assetsManagerContainers = new AssetsLoader(this._sceneManagement, this._physics).init();

    // specific order has to be mentained as specified/defined in sceneManagement in ScenesWithStates
    const engines: Promise<GameSceneEngine>[] = [
      new startScene(
        this._sceneManagement.scenes[Scenes.START].scene,
        this._sceneManagement.state
      ).init(),
      new GameEnginePortfolio(
        this.canvas,
        this._sceneManagement.scenes[Scenes.PORTFOLIO].scene,
        this._sceneManagement.state,
        assetsManagerContainers[Scenes.PORTFOLIO] as SceneAssetManagerContainer
      ).init(),
      new cutScene(
        this._sceneManagement.scenes[Scenes.CUTSCENE].scene,
        this._sceneManagement.state
      ).init(),
      new GameEngineAdventure(
        this.canvas,
        this._sceneManagement.scenes[Scenes.ADVENTURE].scene,
        this._sceneManagement.state,
        assetsManagerContainers[Scenes.ADVENTURE] as SceneAssetManagerContainer
      ).init(),
      new loseScene(
        this._sceneManagement.scenes[Scenes.LOSE].scene,
        this._sceneManagement.state
      ).init(),
      new winScene(
        this._sceneManagement.scenes[Scenes.WIN].scene,
        this._sceneManagement.state
      ).init(),
    ];

    this._sceneManagement.importEngines(
      process.env.startSceneNumber as unknown as number,
      await Promise.all(engines)
    );

    this._engine.hideLoadingUI();
  }
}
