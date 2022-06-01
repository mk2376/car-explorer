import { Scene, Vector3 } from '@babylonjs/core';
import { ContainerDefinitions, Containers, ContainerData } from 'src/BabylonGame/interfaces';
import { Lights } from '../Lights/Lights';
import { AssetsManagerCustom } from './assetsManagerCustom';
import { Physics } from '../../physics';
import { elapsed, now } from '../../time';

export class SceneAssetManagerContainer {
  protected _scene: Scene;
  protected _assetsManager: AssetsManagerCustom;
  readonly containers: Containers;
  protected containersLoaded = false;

  constructor(scene: Scene, containers: Containers, gravityVector?: Vector3) {
    this._scene = scene;
    this.containers = containers;
    this._assetsManager = new AssetsManagerCustom(
      this._scene,
      this.containers[ContainerDefinitions.Lights] as Lights
    );

    if (gravityVector) Physics.enablePhysics(this._scene, gravityVector);
  }

  get loaded() {
    return this.containersLoaded;
  }

  public addAllToScene() {
    const begining = now();

    Object.keys(this.containers).forEach((containersIndex: unknown) => {
      const containerData = this.containers[containersIndex as ContainerDefinitions];

      containerData?.container?.addAllToScene();
    });

    console.info(`${elapsed(begining)} addAllToScene finished`);
  }

  public loadAllContainerTasks() {
    Object.keys(this.containers).forEach((containersIndex: unknown) => {
      const containerData = this.containers[containersIndex as ContainerDefinitions];

      if (isInstanceOfContainerData(containerData)) {
        this._assetsManager.addContainerTask(containerData);
      }
    });

    void this._assetsManager.load().then(() => {
      this.containersLoaded = true;
      console.warn('containersLoaded');
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isInstanceOfContainerData(containerData: any): containerData is ContainerData {
  return 'file' in containerData;
}
