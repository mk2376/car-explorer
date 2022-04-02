import {
  Color3,
  CubeTexture,
  HDRCubeTexture,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
} from '@babylonjs/core';
import AmmoModule from 'ammojs-typed';
import { SceneManagement } from 'src/BabylonGame/components/sceneManagement';
import { now, elapsed } from '../../GameEngine/helper';
import { LightsPortfolio } from '../../Lights/LightsPortfolio';
import { _portfolioWorldTask } from '../assetsManagerTasks/worldTasks/_portfolioWorldTask';
import {
  _testWorldTask,
  _testWorldAddons,
  _createBox,
} from '../assetsManagerTasks/worldTasks/_testWorldTask';
import { Environment } from './environment';

export class EnvironmentPortfolio extends Environment {
  protected _portfolioWorldTask = _portfolioWorldTask;

  protected _testWorldTask = _testWorldTask;
  protected _testWorldAddons = _testWorldAddons;
  protected _createBox = _createBox;

  readonly containerWorld = 'portfolioWorld';
  readonly containerPlayer = this.containerWorld + '_player';
  readonly containerLights = this.containerWorld + '_lights';

  constructor(
    scene: Scene,
    sceneManagement: SceneManagement,
    AmmoImport: typeof AmmoModule
  ) {
    super(scene, sceneManagement, AmmoImport);
  }

  public async load(dev: boolean) {
    const begining = now();
    await this._addtasks(dev);
    console.info(`  ${elapsed(begining)} ${'tasks'} loaded`);

    //await this._assetsManager.loadAsync();

    const begining2 = now();
    this._applyPolicys(dev);
    await this._scene.whenReadyAsync();
    console.info(`  ${elapsed(begining2)} ${'applyPolicys'} loaded`);
  }

  private async _addtasks(dev: boolean) {
    const begining = now();
    if (dev) this._testWorldTask(this.containerWorld);
    else this._portfolioWorldTask(this.containerWorld);
    await this._assetsManager.loadAsync();
    await this._scene.whenReadyAsync();
    console.info(`    ${elapsed(begining)} ${this.containerWorld} loaded`);

    const begining2 = now();
    this._playerTask(this.containerPlayer);
    await this._assetsManager.loadAsync();
    await this._scene.whenReadyAsync();
    console.info(`    ${elapsed(begining2)} ${this.containerPlayer} loaded`);

    const begining3 = now();
    this._createLights(new LightsPortfolio(this._scene), this.containerLights);
    this._createSkyBox();
    await this._scene.whenReadyAsync();
    console.info(`    ${elapsed(begining3)} ${'miscelnus'} loaded`);
  }

  private _applyPolicys(dev: boolean) {
    const containerWorld = this._containers[this.containerWorld];
    const containerPlayer = this._containers[this.containerPlayer];

    if (!dev) this._applyPolicyWorld(containerWorld);
    this._applyPolicyPlayer(containerPlayer);
  }

  private _createSkyBox() {
    const skybox = MeshBuilder.CreateBox('skyBox', { size: 3000 }, this._scene);
    const skyboxMaterial = new StandardMaterial('skyBox', this._scene);
    skyboxMaterial.backFaceCulling = false;
    /*
    skyboxMaterial.reflectionTexture = new HDRCubeTexture(
      './CarExplorer/textures/sky/CasualDay4K.hdr',
      this._scene,
      1024,
      true
    );
    */
    skyboxMaterial.reflectionTexture = new CubeTexture(
      './CarExplorer/textures/sky/cubemap/CasualDay4K',
      this._scene
    );
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
  }
}
