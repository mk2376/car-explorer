import { AmmoJSPlugin, AssetContainer, Scene, Vector3 } from '@babylonjs/core';
import { ContainerDefinitions, Containers, ContainerData } from 'src/BabylonGame/interfaces';
import { Lights } from '../Lights/Lights';
import { AssetsManagerCustom } from './assetsManagerCustom';
import AmmoModule from 'ammojs-typed';

export class SceneAssetManagerContainer {
  protected _scene: Scene;
  protected _assetsManager: AssetsManagerCustom;
  readonly containers: Containers;
  protected Ammo: typeof AmmoModule;
  protected containersLoaded = false;

  constructor(
    scene: Scene,
    containers: Containers,
    gravityVector: Vector3 | undefined,
    AmmoImport: typeof AmmoModule
  ) {
    this._scene = scene;
    this._assetsManager = new AssetsManagerCustom(this._scene);
    this.containers = containers;
    this.Ammo = AmmoImport;

    if (gravityVector instanceof Vector3) this._enablePhysics(gravityVector);
  }

  protected _enablePhysics(gravityVector: Vector3) {
    const physicsPlugin = new AmmoJSPlugin(true, this.Ammo);
    this._scene.enablePhysics(gravityVector, physicsPlugin);
  }

  public async waitContainerTasksToLoad() {
    await this._assetsManager.onLoad();
    this.containersLoaded = true;
  }

  get loaded() {
    return this.containersLoaded;
  }

  public loadAllContainerTasks() {
    Object.keys(this.containers).forEach((_, containersIndex) => {
      const containerData = this.containers[containersIndex as ContainerDefinitions];
      const container = containerData.container as AssetContainer;

      if (instanceOfContainerData(containerData)) {
        this._assetsManager.addContainerTask(
          containerData.name,
          containerData.path,
          containerData.file,
          container
        );

        // TODO: policy has to wait before executing itself
        containerData.policy(
          this._scene,
          container,
          this.containers[ContainerDefinitions.Lights] as Lights,
          this.Ammo
        );
      }
    });

    this._assetsManager.load();
  }
}

function instanceOfContainerData(containerData: unknown): containerData is ContainerData {
  if ((containerData as ContainerData).file) {
    return true;
  }

  return false;
}
