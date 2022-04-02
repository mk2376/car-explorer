import { Sound } from '@babylonjs/core';
import { actionsControllerAdventure } from '../../actionsController/actionsControllerAdventure';
import { coinController } from '../../coinController/coinController';
import { EnvironmentAdventure } from '../../loader/environment/environmentAdventure';
import { Player } from '../../player/player';
import { now, elapsed } from '../helper';
import { GameEngineAdventure } from './GameEngineAdventure';

const gameEngineName = 'adventure';

export async function createEnvironment(this: GameEngineAdventure) {
  const begining = now();

  this._environment = new EnvironmentAdventure(
    this._scene,
    this._sceneManagement,
    this.Ammo
  );
  await this._environment.load();
  await this._scene.whenReadyAsync();

  console.info(`${elapsed(begining)} ${gameEngineName} environment loaded`);
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function createPlayer(this: GameEngineAdventure) {
  const begining = now();

  this._player = new Player(
    this._canvas,
    this._scene,
    this._environment._containers[this._environment.containerPlayer],
    this._ui,
    this.gamePaused,
    this.Ammo
  );
  this._player.load();
  await this._scene.whenReadyAsync();

  console.info(`${elapsed(begining)} ${gameEngineName} player loaded`);
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function createActionsController(this: GameEngineAdventure) {
  const begining = now();

  this._actionsController = new actionsControllerAdventure(
    this._player,
    this._environment._containers[this._environment.containerWorld],
    this._sceneManagement
  );
  await this._scene.whenReadyAsync();

  console.info(
    `${elapsed(begining)} ${gameEngineName} actionsController created`
  );
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function createCoinController(
  this: GameEngineAdventure,
  numOfCoins: number
) {
  const begining = now();

  this._coinController = new coinController(
    this._ui,
    'objectType:coin',
    this._player.chassisMesh,
    numOfCoins
  );

  this._coinController.init(
    this._environment._containers[this._environment.containerWorld]
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
