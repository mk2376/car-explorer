import { AbstractMesh, ActionManager, AssetContainer, Scene } from '@babylonjs/core';
import { StateManagement } from '../../sceneManagement';
import { Player } from '../player/player';

export class actionsController {
  protected _scene: Scene;
  protected _player: Player;
  protected _chassisMesh: AbstractMesh;
  protected _container: AssetContainer;
  protected _state: StateManagement;

  constructor(player: Player, container: AssetContainer, state: StateManagement) {
    this._scene = player.chassisMesh.getScene();
    this._player = player;
    this._chassisMesh = player.chassisMesh;
    this._container = container;
    this._state = state;

    if (!this._chassisMesh) throw new Error('chassisMesh could not be found/was not provided');

    this._chassisMesh.actionManager = new ActionManager(this._scene);
  }

  get onPlatformAdventure(): boolean {
    throw new Error('method not implemented');
  }
}
