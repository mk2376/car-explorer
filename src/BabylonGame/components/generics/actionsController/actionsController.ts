import {
  AbstractMesh,
  ActionManager,
  AssetContainer,
  Scene,
} from '@babylonjs/core';
import { SceneManagement } from '../../sceneManagement';
import { Player } from '../player/player';

export class actionsController {
  protected _scene: Scene;
  protected _player: Player;
  protected _chassisMesh: AbstractMesh;
  protected _container: AssetContainer;
  protected _sceneManagement: SceneManagement;

  constructor(
    player: Player,
    container: AssetContainer,
    sceneManagement: SceneManagement
  ) {
    this._scene = player.chassisMesh.getScene();
    this._player = player;
    this._chassisMesh = player.chassisMesh;
    this._container = container;
    this._sceneManagement = sceneManagement;

    if (!this._chassisMesh)
      throw new Error('chassisMesh could not be found/was not provided');

    this._chassisMesh.actionManager = new ActionManager(this._scene);
  }

  get onPlatformAdventure(): boolean {
    throw new Error('method not implemented');
  }
}
