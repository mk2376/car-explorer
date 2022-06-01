import { AssetsManager, ContainerAssetTask, Scene } from '@babylonjs/core';
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
      if (!task.loadedContainer) throw new Error('containerData.container is empty');

      containerData.container = task.loadedContainer;

      containerData.policy(
        this._scene,
        containerData.container,
        this._lights,
        Physics.getInstance()
      );
    };

    // better than onTaskError
    task.onError = (task: ContainerAssetTask, message: string | undefined, exception: string) => {
      console.error(
        `Error when trying to load container task ${task.name},\nmessage: ${
          message as string
        },\nexception: ${exception}`
      );
    };
  }
}
