import { Scene } from '@babylonjs/core';
import { GameSceneEngine } from '../../../../interfaces';
import { GameEngine } from '../GameEngine';
import { StateManagement } from '../../../sceneManagement';
import { _createActionsController, _createPlayer, _createSkyBox, _loadSounds } from './loaders';
import { elapsed, now, until } from '../../../time';
import { SceneAssetManagerContainer } from '../../environmentLoader/sceneAssetManagerContainer';

export class GameEnginePortfolio extends GameEngine {
  protected _loaded = false;
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

  // eslint-disable-next-line @typescript-eslint/require-await
  public async init(): Promise<GameSceneEngine> {
    const begining = now();
    console.info(`GameEnginePortfolio init started`);

    this._loadSounds();
    void this._lazyLoading();

    console.info(`${elapsed(begining)} GameEnginePortfolio init finished`);

    return this;
  }

  private async _lazyLoading() {
    const begining = now();

    if (!this._assetContainers.loaded) await until(() => this._assetContainers.loaded);
    if (!this._player) this._createPlayer();
    if (!this._actionsController) this._createActionsController();

    this._createSkyBox();
    this._assetContainers.addAllToScene();

    this._loaded = true;
    console.info(`${elapsed(begining)} _lazyLoading finished`);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async onEnter() {
    await until(() => this._loaded);
    this._player.toInitPosition();
    await this._scene.whenReadyAsync();

    //--SOUNDS--
    // this._sounds.game.play(); // play the gamesong
  }
}
