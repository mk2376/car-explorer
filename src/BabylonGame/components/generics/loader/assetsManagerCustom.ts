import { AssetsManager, Engine, Scene } from '@babylonjs/core';

export class AssetsManagerCustom {
  protected _scene: Scene;
  protected _assetsManager: AssetsManager;

  constructor(scene: Scene) {
    this._scene = scene;
    const engine = this._scene.getEngine();
    this._assetsManager = new AssetsManager(this._scene);

    this._assetsManager.onProgress = function (
      remainingCount,
      totalCount,
      lastFinishedTask
    ) {
      engine.loadingUIText = `We are loading the scene. Loading ${lastFinishedTask.name} container.`;
    };

    this._assetsManager.onTaskError = function (task) {
      engine.loadingUIText = `There was an error when loading assets.\n${String(
        task.errorObject.message
      )}`;
      console.log(task.errorObject.message, task.errorObject.exception);
    };
  }

  get assetsManager(): AssetsManager {
    return this._assetsManager;
  }
}
