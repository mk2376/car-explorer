import {
  Color3,
  HDRCubeTexture,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
} from '@babylonjs/core';
import AmmoModule from 'ammojs-typed';
import { SceneManagement } from 'src/BabylonGame/components/sceneManagement';
import { LightsPortfolio } from '../../Lights/LightsPortfolio';
import { _portfolioWorldTask } from '../assetsManagerTasks/_portfolioWorldTask';
import {
  _testWorldTask,
  _testWorldAddons,
  _createBox,
} from '../assetsManagerTasks/_testWorldTask';
import { Environment } from './environment';

export class EnvironmentPortfolio extends Environment {
  protected _portfolioWorldTask = _portfolioWorldTask;

  protected _testWorldTask = _testWorldTask;
  protected _testWorldAddons = _testWorldAddons;
  protected _createBox = _createBox;

  readonly containerName = 'portfolioWorld';
  readonly containerNamePlayer = this.containerName + '_player';

  constructor(
    scene: Scene,
    sceneManagement: SceneManagement,
    AmmoImport: typeof AmmoModule
  ) {
    super(scene, sceneManagement, AmmoImport);
  }

  public async load(dev: boolean) {
    if (dev) {
      this._testWorldTask(this.containerName);
      await this._assetsManager.loadAsync();
      const container = this._containers[this.containerName];
      this._lights = new LightsPortfolio(this._scene, container);
      await this._playerTaskLoad(container, this.containerNamePlayer);
    } else {
      this._portfolioWorldTask(this.containerName);
      await this._assetsManager.loadAsync();
      const container = this._containers[this.containerName];
      console.log('environmentPortfolio assets loaded');

      this._lights = new LightsPortfolio(this._scene, container);

      this._applyPolicyWorld(container);
      await this._playerTaskLoad(container, this.containerNamePlayer);
      console.log('environmentPortfolio player loaded');

      this._loadSkyBox();
    }
  }

  private _loadSkyBox() {
    const skybox = MeshBuilder.CreateBox('skyBox', { size: 1000 }, this._scene);
    const skyboxMaterial = new StandardMaterial('skyBox', this._scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new HDRCubeTexture(
      './CarExplorer/textures/sky/CasualDay4K.hdr',
      this._scene,
      1024
    );
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
  }
}
