import { Engine, Scene } from '@babylonjs/core';
import { AdvancedDynamicTexture } from '@babylonjs/gui';
import { SceneAssetManagerContainer } from '../components/generics/environmentLoader/sceneAssetManagerContainer';
import { Lights } from '../components/generics/Lights/Lights';
import { originCamera } from '../components/generics/ui/Helper';
import { StateManagement } from '../components/sceneManagement';
import { Sounds } from '../interfaces';

export class SimpleSceneEngine {
  protected _loaded = false;
  protected _engine: Engine;
  protected _scene: Scene;
  protected _ui: AdvancedDynamicTexture;
  protected _sounds: Sounds = {};
  protected _state: StateManagement;
  protected _assetContainers?: SceneAssetManagerContainer;
  protected _lights?: Lights;

  constructor(scene: Scene, state: StateManagement, assetContainers?: SceneAssetManagerContainer) {
    this._engine = scene.getEngine();
    this._scene = scene;
    this._state = state;
    this._assetContainers = assetContainers;

    this._scene.detachControl();

    originCamera(this._scene);

    this._ui = AdvancedDynamicTexture.CreateFullscreenUI('UI', true, this._scene);
  }

  public async onEnter() {
    // throw new Error('method not implemented in extended classes');
  }

  public async onExit() {
    // throw new Error('method not implemented in extended classes');
  }
}
