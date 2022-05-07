import { Engine, FreeCamera, Scene, Vector3 } from '@babylonjs/core';
import { GameSceneEngine, Sounds } from '../../../interfaces';
import { Player } from '../player/player';
import { Hud } from '../ui/ui';
import AmmoModule from 'ammojs-typed';
import { StateManagement } from '../../sceneManagement';
import { actionsController } from '../actionsController/actionsController';
import { SceneAssetManagerContainer } from '../environmentloader/sceneAssetManagerContainer';

export class GameEngine {
  protected _canvas: HTMLCanvasElement;
  protected _engine: Engine;
  protected _scene: Scene;
  protected _sounds: Sounds = {};
  protected _state: StateManagement;
  protected _assetContainers: SceneAssetManagerContainer;
  protected _actionsController!: actionsController;

  protected _player!: Player;
  protected Ammo!: typeof AmmoModule;

  public _ui!: Hud;

  protected _gamePaused!: boolean;
  protected transition = false;

  constructor(
    canvas: HTMLCanvasElement,
    scene: Scene,
    state: StateManagement,
    assetContainers: SceneAssetManagerContainer
  ) {
    this._canvas = canvas;
    this._engine = scene.getEngine();
    this._scene = scene;
    this._state = state;
    this._assetContainers = assetContainers;
    this._ui = new Hud(this._scene, this._state, this._gamePaused);

    this._scene.detachControl();

    // fake camera, to prevent errors -- TODO: Try to remove in the future
    const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), this._scene);

    camera.setTarget(Vector3.Zero());
    camera.attachControl(this._canvas, true);
  }

  get gamePaused(): boolean {
    return this._gamePaused;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async init(): Promise<GameSceneEngine> {
    // method implemented in extended classes
    return this;
  }

  public async onEnter() {
    // method implemented in extended classes
  }

  public async onExit() {
    // method implemented in extended classes
  }
}
