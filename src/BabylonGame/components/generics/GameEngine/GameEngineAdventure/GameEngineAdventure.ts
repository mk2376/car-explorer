import { Engine, Vector3 } from '@babylonjs/core';
import { GameEngine } from '../GameEngine';
import { coinController } from '../../coinController/coinController';
import {
  createCoinController,
  createEnvironment,
  createPlayer,
  createActionsController,
  _loadSounds,
} from './loaders';
import { updater } from './updaters';
import { timeController } from '../../timeContoller/timeController';
import { SceneManagement } from 'src/BabylonGame/components/sceneManagement';
import { GameSceneEngine } from 'src/BabylonGame/interfaces';
import { now, elapsed } from '../helper';
const gravityVector = new Vector3(0, -9.81, 0);

export class GameEngineAdventure extends GameEngine {
  protected _coinController!: coinController;
  protected _win = false;
  protected _timeController: timeController;

  protected createEnvironment = createEnvironment;
  protected createPlayer = createPlayer;
  protected createActionsController = createActionsController;
  protected createCoinController = createCoinController;
  protected _loadSounds = _loadSounds;

  protected updater = updater;

  constructor(
    canvas: HTMLCanvasElement,
    engine: Engine,
    sceneManagement: SceneManagement
  ) {
    super(canvas, engine, sceneManagement);

    this._timeController = new timeController(
      this._scene,
      this._ui,
      this._sceneManagement
    );
  }

  public async init(): Promise<GameSceneEngine> {
    const begining = now();
    console.info(`GameEngineAdventure init started`);

    await this._initPhysics(gravityVector);
    await this.createEnvironment();
    await this.createPlayer();
    await this.createActionsController();
    await this.createCoinController(4); // has to be initialized after createActionsController as he creates 'new ActionManager'

    this._environment.addAlltoScene();

    await this._loadSounds();

    this._gameLoop(); //handles scene related updates
    await this._scene.whenReadyAsync();
    console.info(`${elapsed(begining)} GameEngineAdventure init finished`);

    return this;
  }

  private _gameLoop() {
    //--GAME LOOP--
    this._scene.onBeforeRenderObservable.add(() => {
      this.updater();

      if (this._win) {
        this._gamePaused = true;
        //dont allow pause menu interaction
        this._ui.ui.pauseBtn.isHitTestVisible = false;

        void this._sceneManagement.stateManagement.updateCurState(
          this._sceneManagement._State.WIN
        );
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async onEnter() {
    //--SOUNDS--
    this._sounds.game.play(); // play the gamesong
    this._player.toInitPosition();
    this._timeController.start(30 * 1000); //4 * 60 * 1000);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async onExit() {
    this._timeController.reset();
  }
}
