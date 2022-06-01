import { Vector3, HemisphericLight, Color3, Scene } from '@babylonjs/core';
import { Lights } from './Lights';

export class LightsCutscene extends Lights {
  constructor(scene: Scene) {
    super(scene);

    this.createEnvironmentLight();
  }

  // do not call addShadowCaster as this Lights class only uses the hemilight, so no shadows

  // environment light
  private createEnvironmentLight() {
    const hemiLight = new HemisphericLight('hemiLight', new Vector3(0, -1, 0), this._scene);
    this._scene.removeLight(hemiLight);

    hemiLight.diffuse = new Color3(1, 1, 1); // white
    hemiLight.groundColor = new Color3(37 / 255, 56 / 255, 60 / 255); // darkslategrey
    // hemiLight.specular = new Color3(0, 1, 0);
    hemiLight.intensity = 0.2;

    this._hemiLight = hemiLight;
    this._container.lights.push(hemiLight);
  }
}
