import { Scene } from '@babylonjs/core';
import { GameSceneEngine } from '../../../../interfaces';
import { GameEngine } from '../GameEngine';
import { StateManagement } from '../../../sceneManagement';
import { _createActionsController, _createPlayer, _createSkyBox, _loadSounds } from './loaders';
import { elapsed, now } from '../../../time';
import { SceneAssetManagerContainer } from '../../environmentloader/sceneAssetManagerContainer';

export class GameEnginePortfolio extends GameEngine {
  protected _createPlayer = _createPlayer;
  protected _createActionsController = _createActionsController;
  protected _loadSounds = _loadSounds;
  protected _createSkyBox = _createSkyBox;

  constructor(
    canvas: HTMLCanvasElement,
    scene: Scene,
    state: StateManagement,
    assetContainers: SceneAssetManagerContainer
  ) {
    super(canvas, scene, state, assetContainers);
  }

  public async init(): Promise<GameSceneEngine> {
    const begining = now();
    console.info(`GameEnginePortfolio init started`);

    await this._loadSounds();
    this._createSkyBox();

    console.info(`${elapsed(begining)} GameEnginePortfolio init finished`);

    return this;
  }

  private async _lazyLoading() {
    if (!this._assetContainers.loaded) {
      await this._assetContainers.waitContainerTasksToLoad();
      await this._createPlayer();
      await this._createActionsController();
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async onEnter() {
    await this._lazyLoading();
    this._player.toInitPosition();
    await this._scene.whenReadyAsync();

    //--SOUNDS--
    // this._sounds.game.play(); // play the gamesong
  }
}
