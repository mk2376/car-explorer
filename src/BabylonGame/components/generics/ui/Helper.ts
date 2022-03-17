import { Scene, FreeCamera, Vector3, Color4 } from '@babylonjs/core';

export function originCamera(scene: Scene) {
  // set clear scene background color
  scene.clearColor = new Color4(0, 0, 0, 1);

  //creates and positions a free camera
  const camera = new FreeCamera('originCamera', new Vector3(0, 0, 0), scene);
  camera.setTarget(Vector3.Zero()); // targets the camera to scene origin
}
