import { AssetsManager, Scene } from '@babylonjs/core';
import { ContainerData } from 'src/BabylonGame/interfaces';
import { Lights } from '../Lights/Lights';
import { Physics } from '../../physics';

export class AssetsManagerCustom {
  protected _scene: Scene;
  protected _assetsManager: AssetsManager;
  protected _lights: Lights;

  constructor(scene: Scene, lights: Lights) {
    this._scene = scene;
    this._lights = lights;
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

  // load
  public async load() {
    await this._assetsManager.loadAsync();
  }

  public addContainerTask(containerData: ContainerData): void {
    const task = this._assetsManager.addContainerTask(
      containerData.name,
      '',
      containerData.path,
      containerData.file
    );

    task.onSuccess = (task) => {
      console.warn(`${containerData.file} loaded`);

      containerData.container = task.loadedContainer;

      containerData.policy(
        this._scene,
        containerData.container,
        this._lights,
        Physics.getInstance()
      );
    };
  }
}
