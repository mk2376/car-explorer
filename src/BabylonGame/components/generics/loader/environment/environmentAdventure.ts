import { Color3, Scene } from '@babylonjs/core';
import AmmoModule from 'ammojs-typed';
import { SceneManagement } from 'src/BabylonGame/components/sceneManagement';
import { now, elapsed } from '../../../time';
import { LightsAdventure } from '../../Lights/LightsAdventure';
import { _containerTask } from '../as../assetsManagerTasks/worldTasks/_containerTask
import { Environment } from './environment';

export class EnvironmentAdventure extends Environment {
  protected _adventureWorldTask = _containerTask;

  readonly containerWorld = 'adventureWorld';
  readonly containerPlayer = this.containerWorld + '_player';
  readonly containerLights = this.containerWorld + '_lights';

  constructor(
    scene: Scene,
    sceneManagement: SceneManagement,
    AmmoImport: typeof AmmoModule
  ) {
    super(scene, sceneManagement, AmmoImport);
  }

  public async load() {
    await this._addtasks();

    await this._assetsManager.loadAsync();

    this._applyPolicys();
  }

  private async _addtasks() {
    const begining = now();
    this._adventureWorldTask(this.containerWorld);
    await this._assetsManager.loadAsync();
    console.info(`  ${elapsed(begining)} ${this.containerWorld} loaded`);

    const begining2 = now();
    this._playerTask(this.containerPlayer);
    await this._assetsManager.loadAsync();
    console.info(`  ${elapsed(begining2)} ${this.containerPlayer} loaded`);

    this._createLights(new LightsAdventure(this._scene), this.containerLights);
    this._createFog();
  }

  private _applyPolicys() {
    const containerWorld = this._containers[this.containerWorld];
    const containerPlayer = this._containers[this.containerPlayer];

    this._applyPolicyWorld(containerWorld);
    this._applyPolicyPlayer(containerPlayer);
  }

  private _createFog() {
    this._scene.fogMode = Scene.FOGMODE_EXP2;
    this._scene.fogDensity = 0.04;
    this._scene.fogColor = new Color3(0.9, 0.9, 0.85);
  }

  /*
  private _loadVolumetricFog() {
    const useGPUVersion = false;
    const particleCount = 10000;
    let particleSystem;

    const fountain = Mesh.CreateBox('foutain', 0.01, this._scene);
    fountain.visibility = 0;

    const fogTexture = new Texture(
      'https://raw.githubusercontent.com/aWeirdo/Babylon.js/master/smoke_15.png',
      this._scene
    );

    if (useGPUVersion) {
      particleSystem = new GPUParticleSystem(
        'particles',
        { capacity: particleCount * 3.33 },
        this._scene
      );
      particleSystem.activeParticleCount = particleCount;
      particleSystem.manualEmitCount = particleSystem.activeParticleCount;
    } else {
      particleSystem = new ParticleSystem(
        'particles',
        particleCount,
        this._scene
      );
      particleSystem.manualEmitCount = particleSystem.getCapacity();
    }

    particleSystem.minEmitBox = new Vector3(-50, 2, -50); // Starting all from
    particleSystem.maxEmitBox = new Vector3(50, 2, 50); // To..

    particleSystem.particleTexture = fogTexture.clone();
    particleSystem.emitter = fountain;

    particleSystem.color1 = new Color4(0.8, 0.8, 0.8, 0.1);
    particleSystem.color2 = new Color4(0.95, 0.95, 0.95, 0.15);
    particleSystem.colorDead = new Color4(0.9, 0.9, 0.9, 0.1);
    particleSystem.minSize = 3.5;
    particleSystem.maxSize = 5.0;
    particleSystem.minLifeTime = Number.MAX_SAFE_INTEGER;
    particleSystem.emitRate = 5000;
    particleSystem.blendMode = ParticleSystem.BLENDMODE_STANDARD;
    particleSystem.gravity = new Vector3(0, 0, 0);
    particleSystem.direction1 = new Vector3(0, 0, 0);
    particleSystem.direction2 = new Vector3(0, 0, 0);
    particleSystem.minAngularSpeed = -2;
    particleSystem.maxAngularSpeed = 2;
    particleSystem.minEmitPower = 0.5;
    particleSystem.maxEmitPower = 1;
    particleSystem.updateSpeed = 0.005;

    particleSystem.start();
  }
  */
}
