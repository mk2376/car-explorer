import { AssetContainer, Color3, Scene, Sound } from '@babylonjs/core';
import { actionsControllerAdventure } from '../../actionsController/actionsControllerAdventure';
import { coinController } from '../../coinController/coinController';
import { Player } from '../../player/player';
import { now, elapsed } from '../../../time';
import { GameEngineAdventure } from './GameEngineAdventure';
import { ContainerDefinitions } from 'src/BabylonGame/interfaces';

const gameEngineName = 'adventure';

// eslint-disable-next-line @typescript-eslint/require-await
export async function _createPlayer(this: GameEngineAdventure) {
  const begining = now();

  this._player = new Player(
    this._canvas,
    this._scene,
    this._assetContainers.containers[ContainerDefinitions.Player].container as AssetContainer,
    this._ui,
    this.gamePaused,
    this.Ammo
  );
  this._player.load();
  await this._scene.whenReadyAsync();

  console.info(`${elapsed(begining)} ${gameEngineName} player loaded`);
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function _createActionsController(this: GameEngineAdventure) {
  const begining = now();

  this._actionsController = new actionsControllerAdventure(
    this._player,
    this._assetContainers.containers[ContainerDefinitions.AdventureWorld]
      .container as AssetContainer,
    this._state
  );
  await this._scene.whenReadyAsync();

  console.info(`${elapsed(begining)} ${gameEngineName} actionsController created`);
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function _createCoinController(this: GameEngineAdventure, numOfCoins: number) {
  const begining = now();

  this._coinController = new coinController(
    this._ui,
    'objectType:coin',
    this._player.chassisMesh,
    numOfCoins
  );

  this._coinController.init(
    this._assetContainers.containers[ContainerDefinitions.Coin].container as AssetContainer
  );
  await this._scene.whenReadyAsync();

  console.info(`${elapsed(begining)} ${gameEngineName} coinController created`);
}

//loading sounds for the game scene
export async function _loadSounds(this: GameEngineAdventure) {
  const begining = now();

  /*
  const game = new Sound(
    'gameSong',
    './CarExplorer/sounds/Christmassynths.wav',
    this._scene,
    function () {
      // empty
    },
    {
      loop: true,
      volume: 0.1,
    }
  );
  this._sounds.game = game;

  const end = new Sound(
    'endSong',
    './CarExplorer/sounds/copycat(revised).mp3',
    this._scene,
    function () {
      // empty
    },
    {
      volume: 0.25,
    }
  );
  this._sounds.end = end;
  */

  await this._scene.whenReadyAsync();

  console.info(`${elapsed(begining)} ${gameEngineName} sounds loaded`);
}

export function _createFog(this: GameEngineAdventure) {
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
