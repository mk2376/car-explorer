import { AmmoJSPlugin, Scene, Vector3 } from '@babylonjs/core';
import AmmoModule from 'ammojs-typed';

export class Physics {
  private static instance: typeof AmmoModule;

  private constructor() {
    //
  }

  public static async init() {
    if (!Physics.instance) {
      Physics.instance = await AmmoModule();
    } else {
      console.error('"Physics.init()" already called!');
    }
  }

  public static getInstance() {
    if (!Physics.instance) {
      console.error('Call "Physics.init()" first!');
    }

    return Physics.instance;
  }

  /**
   * Finally, any singleton should define some business logic, which can be
   * executed on its instance.
   */

  public static enablePhysics(scene: Scene, gravityVector: Vector3) {
    const physicsPlugin = new AmmoJSPlugin(true, Physics.getInstance());
    scene.enablePhysics(gravityVector, physicsPlugin);
  }
}
