import { Engine, Scene } from '@babylonjs/core';
import { AdvancedDynamicTexture } from '@babylonjs/gui';
import { originCamera } from '../components/generics/ui/Helper';
import { StateManagement } from '../components/sceneManagement';
import { SceneAssetManagerContainer, Sounds } from '../interfaces';

export class SimpleSceneEngine {
  protected _engine: Engine;
  protected _scene: Scene;
  protected _ui: AdvancedDynamicTexture;
  protected _sounds: Sounds = {};
  protected _state: StateManagement;
  protected _assetContainers?: SceneAssetManagerContainer;

  constructor(scene: Scene, state: StateManagement, assetContainers?: SceneAssetManagerContainer) {
    this._engine = scene.getEngine();
    this._scene = scene;
    this._state = state;
    this._assetContainers = assetContainers;

    this._scene.detachControl();

    originCamera(this._scene);

    this._ui = AdvancedDynamicTexture.CreateFullscreenUI('UI', true, this._scene);
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
