import { AssetContainer, AssetsManager, Engine, Scene } from '@babylonjs/core';

export class AssetsManagerCustom {
  protected _scene: Scene;
  protected _assetsManager: AssetsManager;
  protected _toLoad!: Promise<void>;

  constructor(scene: Scene) {
    this._scene = scene;
    const engine = this._scene.getEngine();
    this._assetsManager = new AssetsManager(this._scene);

    this._assetsManager.useDefaultLoadingScreen = false;
    /*
    this._assetsManager.onProgress = function (remainingCount, totalCount, lastFinishedTask) {
      engine.loadingUIText = `We are loading the scene. Loading ${lastFinishedTask.name} container.`;
    };
    */

    this._assetsManager.onTaskError = function (task) {
      engine.loadingUIText = `There was an error when loading assets.\n${String(
        task.errorObject.message
      )}`;
      console.log(task.errorObject.message, task.errorObject.exception);
    };
  }

  // start loading
  public load() {
    this._toLoad = this._assetsManager.loadAsync();
  }

  // wait till loading finished
  public async onLoad() {
    await this._toLoad;
  }

  public addContainerTask(
    containerName: string,
    path: string,
    file: string,
    container: AssetContainer
  ): void {
    const task = this._assetsManager.addContainerTask(containerName, '', path, file);

    task.onSuccess = (task) => {
      container = task.loadedContainer;
    };
  }
}
