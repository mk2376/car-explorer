import {
  AmmoJSPlugin,
  Engine,
  FreeCamera,
  Scene,
  Vector3,
} from '@babylonjs/core';
import { GameSceneEngine, Sounds } from '../../../interfaces';
import { Player } from '../player/player';
import { Hud } from '../ui/ui';
import AmmoModule from 'ammojs-typed';
import { SceneManagement } from '../../sceneManagement';
import { Environment } from '../loader/environment/environment';
import { actionsController } from '../actionsController/actionsController';

export class GameEngine {
  protected _canvas: HTMLCanvasElement;
  protected _engine: Engine;
  protected _scene: Scene;
  protected _sounds: Sounds = {};
  protected _sceneManagement: SceneManagement;
  protected _actionsController!: actionsController;

  protected _player!: Player;
  protected Ammo!: typeof AmmoModule;

  public _ui!: Hud;
  public _environment!: Environment;

  protected _gamePaused!: boolean;
  protected transition = false;

  constructor(
    canvas: HTMLCanvasElement,
    engine: Engine,
    sceneManagement: SceneManagement
  ) {
    this._canvas = canvas;
    this._engine = engine;
    this._scene = new Scene(this._engine);
    this._sceneManagement = sceneManagement;
    this._ui = new Hud(this._scene, this._sceneManagement, this._gamePaused);

    this._scene.detachControl();

    // fake camera, to prevent errors
    const camera = new FreeCamera(
      'camera1',
      new Vector3(0, 5, -10),
      this._scene
    );

    camera.setTarget(Vector3.Zero());
    camera.attachControl(this._canvas, true);
  }

  protected async _initPhysics(gravityVector: Vector3) {
    // Enable physics
    this.Ammo = await AmmoModule();
    const physicsPlugin = new AmmoJSPlugin(true, this.Ammo);

    this._scene.enablePhysics(gravityVector, physicsPlugin);
  }

  get gamePaused(): boolean {
    return this._gamePaused;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async init(): Promise<GameSceneEngine> {
    return this;
  }

  get scene() {
    return this._scene;
  }

  public async onEnter() {
    //
  }

  public async onExit() {
    //
  }
}
