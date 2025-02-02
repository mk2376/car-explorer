import {
  AssetContainer,
  Color3,
  CubeTexture,
  MeshBuilder,
  Sound,
  StandardMaterial,
  Texture,
} from '@babylonjs/core';
import { actionsControllerPortfolio } from '../../actionsController/actionsControllerPortfolio';
import { Player } from '../../player/player';
import { now, elapsed } from '../../../time';
import { GameEnginePortfolio } from './GameEnginePortfolio';
import { ContainerDefinitions } from 'src/BabylonGame/interfaces';

const gameEngineName = 'portfolio';

export function _createPlayer(this: GameEnginePortfolio) {
  const begining = now();

  this._player = new Player(
    this._canvas,
    this._scene,
    this._assetContainers.containers[ContainerDefinitions.Player]!.container as AssetContainer,
    this._ui,
    this.gamePaused
  );
  this._player.load();

  console.info(`${elapsed(begining)} ${gameEngineName} player loaded`);
}

export function _createActionsController(this: GameEnginePortfolio) {
  const begining = now();

  this._actionsController = new actionsControllerPortfolio(
    this._player,
    this._assetContainers.containers[ContainerDefinitions.Scene]!.container as AssetContainer,
    this._state
  );

  console.info(`${elapsed(begining)} ${gameEngineName} actionsController created`);
}

//loading sounds for the game scene
export function _loadSounds(this: GameEnginePortfolio) {
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
  */

  console.info(`${elapsed(begining)} ${gameEngineName} sounds loaded`);
}

export function _createSkyBox(this: GameEnginePortfolio) {
  const begining = now();

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

  console.info(`${elapsed(begining)} ${gameEngineName} _createSkyBox loaded`);
}
