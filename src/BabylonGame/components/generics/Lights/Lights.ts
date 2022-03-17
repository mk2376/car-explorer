import {
  HemisphericLight,
  DirectionalLight,
  ShadowGenerator,
  Scene,
  Color3,
  PointLight,
  Vector3,
  AssetContainer,
  AbstractMesh,
} from '@babylonjs/core';

export class Lights {
  protected _scene: Scene;
  protected _container: AssetContainer;
  protected _hemiLight!: HemisphericLight;
  protected _directionalLight: DirectionalLight[] = [];
  protected _shadowGenerator: ShadowGenerator[] = [];

  constructor(scene: Scene, container: AssetContainer) {
    this._scene = scene;
    this._container = container;
    // this.directionalLight.setEnabled(true);
  }

  public addShadowCaster(mesh: AbstractMesh, subMeshes?: boolean) {
    this._shadowGenerator.forEach((shadowGenerator) => {
      shadowGenerator.addShadowCaster(mesh, subMeshes);
    });
  }

  // point lights for car
  protected createCarLights() {
    const carLight = this.createCarLight();

    const carLightClone = carLight.clone('pointClone') as PointLight;
    // pointLight.parent = this.model.name;
    this._container.lights.push(carLightClone);
  }

  private createCarLight(): PointLight {
    const pointLight = new PointLight(
      'pointLight',
      new Vector3(0, 1, 0),
      this._scene
    );
    this._scene.removeLight(pointLight);

    pointLight.diffuse = new Color3(172 / 255, 246 / 255, 250 / 255);
    pointLight.intensity = 0.25;

    return pointLight;
  }
}
