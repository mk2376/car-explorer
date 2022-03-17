import { Engine, Scene } from '@babylonjs/core';
import { AdvancedDynamicTexture } from '@babylonjs/gui';
import { originCamera } from '../components/generics/ui/Helper';
import { SceneManagement } from '../components/sceneManagement';
import { Sounds } from '../interfaces';

export class simpleSceneEngine {
  protected _engine: Engine;
  protected _scene: Scene;
  protected _ui: AdvancedDynamicTexture;
  protected _sounds: Sounds = {};
  protected _sceneManagement: SceneManagement;

  constructor(engine: Engine, sceneManagement: SceneManagement) {
    this._engine = engine;
    this._scene = new Scene(this._engine);
    this._sceneManagement = sceneManagement;

    this._scene.detachControl();

    originCamera(this._scene);

    this._ui = AdvancedDynamicTexture.CreateFullscreenUI(
      'UI',
      true,
      this._scene
    );
  }

  get scene() {
    return this._scene;
  }

  public onEnter() {
    // throw new Error('method not yet implemented');
  }

  public onExit() {
    // throw new Error('method not yet implemented');
  }
}
