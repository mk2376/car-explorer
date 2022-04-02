import { Engine, Vector3 } from '@babylonjs/core';
import { GameSceneEngine } from '../../../../interfaces';
import { GameEngine } from '../GameEngine';
import { SceneManagement } from '../../../sceneManagement';
import {
  createActionsController,
  createEnvironment,
  createPlayer,
  _loadSounds,
} from './loaders';
import { elapsed, now } from '../helper';

const gravityVector = new Vector3(0, -9.81, 0);

export class GameEnginePortfolio extends GameEngine {
  protected _dev = false;

  protected createEnvironment = createEnvironment;
  protected createPlayer = createPlayer;
  protected createActionsController = createActionsController;
  protected _loadSounds = _loadSounds;

  constructor(
    canvas: HTMLCanvasElement,
    engine: Engine,
    sceneManagement: SceneManagement,
    dev: string
  ) {
    super(canvas, engine, sceneManagement);

    if (dev.includes('portfolio:dev')) this._dev = true;
  }

  public async init(): Promise<GameSceneEngine> {
    const begining = now();
    console.info(`GameEnginePortfolio init started`);

    await this._initPhysics(gravityVector);
    await this.createEnvironment();
    await this.createPlayer();
    await this.createActionsController();

    // eslint-disable-next-line @typescript-eslint/await-thenable
    await this._environment.addAlltoScene();

    await this._loadSounds();

    await this._scene.whenReadyAsync();
    console.info(`${elapsed(begining)} GameEnginePortfolio init finished`);

    return this;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async onEnter() {
    this._player.toInitPosition();

    //--SOUNDS--
    // this._sounds.game.play(); // play the gamesong
  }
}
