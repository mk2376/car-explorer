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
import { GameSceneEngine } from './interfaces';
import { now, elapsed } from './components/generics/GameEngine/helper';

// environment variables
const env = {
  startSceneNumber: 1, // 3
  // tells game, what part of game engines are enabled or run in dev mode (':dev')
  dev: 'portfolio, adventure', // adventure, adventure:dev, portfolio, portfolio:dev
};

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
    events(this._engine, this._sceneManagement);
    const begining = now();
    await this._loadScenes();
    console.info(`${elapsed(begining)} GAME loaded`);

    // Register a render loop to repeatedly render the scene
    this._engine.runRenderLoop(() => {
      this._sceneManagement._scenesByState[
        this._sceneManagement.stateManagement.curState
      ].scene.render();
    });
  }

  private async _loadScenes(): Promise<void> {
    this._engine.displayLoadingUI();

    const portfolioSceneEngine = env.dev.includes('portfolio')
      ? new GameEnginePortfolio(
          this.canvas,
          this._engine,
          this._sceneManagement,
          env.dev
        )
      : new GameEngine(this.canvas, this._engine, this._sceneManagement);

    const adventureSceneEngine = env.dev.includes('adventure')
      ? new GameEngineAdventure(
          this.canvas,
          this._engine,
          this._sceneManagement
        )
      : new GameEngine(this.canvas, this._engine, this._sceneManagement);

    const startSceneUI = new startScene(this._engine, this._sceneManagement);
    const cutSceneUI = new cutScene(this._engine, this._sceneManagement);
    const loseSceneUI = new loseScene(this._engine, this._sceneManagement);
    const winSceneUI = new winScene(this._engine, this._sceneManagement);

    // specific order has to be mentained as specified/defined in sceneManagement in ScenesWithStates
    /*
    const scenes: Promise<GameSceneEngine>[] = [
      startSceneUI.init(),
      portfolioSceneEngine.init(),
      cutSceneUI.init(),
      adventureSceneEngine.init(),
      loseSceneUI.init(),
      winSceneUI.init(),
    ];
    this._sceneManagement.importScenes(
      env.startSceneNumber,
      await Promise.all(scenes)
    );
    */

    const scenes: GameSceneEngine[] = [
      await startSceneUI.init(),
      await portfolioSceneEngine.init(),
      await cutSceneUI.init(),
      await adventureSceneEngine.init(),
      await loseSceneUI.init(),
      await winSceneUI.init(),
    ];
    this._sceneManagement.importScenes(env.startSceneNumber, scenes);

    this._engine.hideLoadingUI();
  }
}
