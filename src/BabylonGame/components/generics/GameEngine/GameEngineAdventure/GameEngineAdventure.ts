import { Scene } from '@babylonjs/core';
import { GameEngine } from '../GameEngine';
import { coinController } from '../../coinController/coinController';
import {
  _createCoinController,
  _createPlayer,
  _createActionsController,
  _loadSounds,
  _createFog,
} from './loaders';
import { updater } from './updaters';
import { timeController } from '../../timeContoller/timeController';
import { StateManagement } from 'src/BabylonGame/components/sceneManagement';
import { GameSceneEngine, Scenes } from 'src/BabylonGame/interfaces';
import { now, elapsed } from '../../../time';
import { AdventureHud } from '../../ui/adventureUi';
import { SceneAssetManagerContainer } from '../../environmentloader/sceneAssetManagerContainer';

export class GameEngineAdventure extends GameEngine {
  public _ui: AdventureHud;
  protected _coinController!: coinController;
  protected _win = false;
  protected _timeController: timeController;

  protected _createPlayer = _createPlayer;
  protected _createActionsController = _createActionsController;
  protected _createCoinController = _createCoinController;
  protected _loadSounds = _loadSounds;
  protected _createFog = _createFog;

  protected updater = updater;

  constructor(
    canvas: HTMLCanvasElement,
    scene: Scene,
    state: StateManagement,
    assetContainers: SceneAssetManagerContainer
  ) {
    super(canvas, scene, state, assetContainers);

    this._ui = new AdventureHud(this._scene, this._state, this._gamePaused);
    this._timeController = new timeController(this._scene, this._ui, this._state);
  }

  public async init(): Promise<GameSceneEngine> {
    const begining = now();
    console.info(`GameEngineAdventure init started`);

    await this._loadSounds();
    this._createFog();
    this._gameLoop(); //handles scene related updates

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

        void this._state.updateCurState(Scenes.WIN);
      }
    });
  }

  private async _lazyLoading() {
    if (!this._assetContainers.loaded) {
      await this._assetContainers.waitContainerTasksToLoad();
      await this._createPlayer();
      await this._createActionsController();
      await this._createCoinController(4); // has to be initialized after createActionsController as he creates 'new ActionManager'
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async onEnter() {
    await this._lazyLoading();
    this._player.toInitPosition();
    await this._scene.whenReadyAsync();
    this._timeController.start(30 * 1000); //4 * 60 * 1000);

    //--SOUNDS--
    // this._sounds.game.play(); // play the gamesong
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async onExit() {
    this._timeController.reset();
  }
}
