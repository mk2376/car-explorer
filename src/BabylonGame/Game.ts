import { Engine } from '@babylonjs/core';
import { modCanvas } from './components/modCanvas';
import { events } from './components/events';

import { SceneManagement } from './components/sceneManagement';
import { GameEngine } from './components/generics/GameEngine/GameEngine';
import { GameEnginePortfolio } from './components/generics/GameEngine/GameEnginePortfolio/GameEnginePortfolio';
import { GameEngineAdventure } from './components/generics/GameEngine/GameEngineAdventure/GameEngineAdventure';

import { startScene } from './simpleScenes/scenes/startScene';
import { cutScene } from './simpleScenes/scenes/cutScene';
import { loseScene } from './simpleScenes/scenes/loseScene';
import { winScene } from './simpleScenes/scenes/winScene';
import { EnvVars, GameSceneEngine } from './interfaces';
import { now, elapsed } from './components/time';

// Game class is the entire game application
export class Game {
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  private _sceneManagement: SceneManagement = new SceneManagement();

  constructor(private canvas: HTMLCanvasElement) {
    this._canvas = modCanvas(canvas, 'gameCanvas');
    this._engine = new Engine(this._canvas, true);

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
    await this._loadScenes();
    console.groupEnd();
    console.info(`Game loaded: ${elapsed(begining)}s`);

    // Register a render loop to repeatedly render the scene
    this._engine.runRenderLoop(() => {
      this._sceneManagement._scenesByState[
        this._sceneManagement.state.cur
      ].scene.render();
    });
  }

  private async _loadScenes(): Promise<void> {
    this._engine.displayLoadingUI();

    // eslint-disable-next-line
    const portfolioSceneEngine = (process.env
      .PORTFOLIO as unknown as EnvVars['load'])
      ? new GameEnginePortfolio(
          this.canvas,
          this._engine,
          this._sceneManagement
        )
      : new GameEngine(this.canvas, this._engine, this._sceneManagement);

    const adventureSceneEngine = (process.env
      .ADVENTURE as unknown as EnvVars['load'])
      ? new GameEngineAdventure(
          this.canvas,
          this._engine,
          this._sceneManagement
        )
      : new GameEngine(this.canvas, this._engine, this._sceneManagement);

    // specific order has to be mentained as specified/defined in sceneManagement in ScenesWithStates
    const scenes: Promise<GameSceneEngine>[] = [
      new startScene(this._engine, this._sceneManagement).init(),
      portfolioSceneEngine.init(),
      new cutScene(this._engine, this._sceneManagement).init(),
      adventureSceneEngine.init(),
      new loseScene(this._engine, this._sceneManagement).init(),
      new winScene(this._engine, this._sceneManagement).init(),
    ];

    this._sceneManagement.importScenes(
      process.env.startSceneNumber as unknown as number,
      await Promise.all(scenes)
    );

    this._engine.hideLoadingUI();
  }
}
