import {
  Vector3,
  HemisphericLight,
  Color3,
  DirectionalLight,
  PointLight,
  ShadowGenerator,
  Scene,
  SpotLight,
  AssetContainer,
} from '@babylonjs/core';
import { Lights } from './Lights';

export class LightsPortfolio extends Lights {
  constructor(scene: Scene, container: AssetContainer) {
    super(scene, container);

    this.createEnvironmentLight();
    this.createSun();
  }

  // environment light
  private createEnvironmentLight() {
    const hemiLight = new HemisphericLight(
      'hemiLight',
      new Vector3(0, -1, 0),
      this._scene
    );
    this._scene.removeLight(hemiLight);

    hemiLight.diffuse = new Color3(1, 1, 1); // white
    hemiLight.groundColor = new Color3(37 / 255, 56 / 255, 60 / 255); // darkslategrey
    // hemiLight.specular = new Color3(0, 1, 0);
    hemiLight.intensity = 0.2;

    this._hemiLight = hemiLight;
    this._container.lights.push(hemiLight);
  }

  private createSun() {
    // directional light
    const directionalLight = new DirectionalLight(
      'directionalLight',
      new Vector3(-0.7, -2, 1),
      this._scene
    );
    this._scene.removeLight(directionalLight);

    directionalLight.diffuse = new Color3(1, 1, 1); // white
    directionalLight.position = new Vector3(10, 10, 10);
    directionalLight.intensity = 9;

    // do not set shadowMinZ and shadowMaxZ manualy, execlude ground meshes as shadow casters instead
    directionalLight.autoUpdateExtends = true;
    directionalLight.autoCalcShadowZBounds = true;

    this._directionalLight.push(directionalLight);
    this._container.lights.push(directionalLight);
    this.createShadowGenerator(directionalLight);
  }

  private createShadowGenerator(
    light: DirectionalLight | SpotLight | PointLight
  ) {
    const shadowGenerator = new ShadowGenerator(1024 * 4, light); // max 8
    /* shadow ranking
          shadowGenerator.usePoissonSampling = true;
          shadowGenerator.useContactHardeningShadow = true; // wrong shadow behavior
          shadowGenerator.useExponentialShadowMap = true;
          shadowGenerator.useKernelBlur = true; // samo po sebi ne dela
          shadowGenerator.useBlurExponentialShadowMap = true;

          shadowGenerator.useCloseExponentialShadowMap = true;

          shadowGenerator.useBlurCloseExponentialShadowMap = true;
          shadowGenerator.usePercentageCloserFiltering = true;
    */

    shadowGenerator.usePercentageCloserFiltering = true;
    shadowGenerator.filteringQuality = ShadowGenerator.QUALITY_HIGH;
    shadowGenerator.bias = 0.0045;
    shadowGenerator.setDarkness(0);

    /*
    shadowGenerator.useContactHardeningShadow = true;
    shadowGenerator.contactHardeningLightSizeUVRatio = 0.04;
    shadowGenerator.setDarkness(0);
    shadowGenerator.bias = 0.0029;
    */

    this._shadowGenerator.push(shadowGenerator);
  }
}
