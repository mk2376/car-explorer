import { Sound } from '@babylonjs/core';
import { actionsControllerPortfolio } from '../../actionsController/actionsControllerPortfolio';
import { EnvironmentPortfolio } from '../../loader/environment/environmentPortfolio';
import { Player } from '../../player/player';
import { GameEngineAdventure } from '../GameEngineAdventure/GameEngineAdventure';
import { now, elapsed } from '../helper';
import { GameEnginePortfolio } from './GameEnginePortfolio';

const gameEngineName = 'portfolio';

export async function createEnvironment(this: GameEnginePortfolio) {
  const begining = now();

  this._environment = new EnvironmentPortfolio(
    this._scene,
    this._sceneManagement,
    this.Ammo
  );
  // eslint-disable-next-line @typescript-eslint/await-thenable
  await this._environment.load(this._dev);
  // await this._scene.whenReadyAsync();

  console.info(`${elapsed(begining)} ${gameEngineName} environment loaded`);
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function createPlayer(this: GameEnginePortfolio) {
  const begining = now();

  this._player = new Player(
    this._canvas,
    this._scene,
    this._environment._containers[this._environment.containerNamePlayer],
    this._ui,
    this.gamePaused,
    this.Ammo
  );
  this._player.load();
  // await this._scene.whenReadyAsync();

  console.info(`${elapsed(begining)} ${gameEngineName} player loaded`);
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function createActionsController(this: GameEnginePortfolio) {
  const begining = now();

  this._actionsController = new actionsControllerPortfolio(
    this._player,
    this._environment._containers[this._environment.containerName],
    this._sceneManagement
  );
  // await this._scene.whenReadyAsync();

  console.info(
    `${elapsed(begining)} ${gameEngineName} actionsController created`
  );
}

//loading sounds for the game scene
export async function _loadSounds(this: GameEnginePortfolio) {
  const begining = now();

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

  await this._scene.whenReadyAsync();

  console.info(`${elapsed(begining)} ${gameEngineName} sounds loaded`);
}
