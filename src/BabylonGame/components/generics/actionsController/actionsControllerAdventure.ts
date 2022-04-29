import { AbstractMesh, AssetContainer, IAction } from '@babylonjs/core';
import { SceneManagement } from '../../sceneManagement';
import { actionHelper } from './Helper';
import { Player } from '../player/player';
import { actionsController } from './actionsController';

export class actionsControllerAdventure extends actionsController {
  private _onPlatformAdventure = false;

  constructor(
    player: Player,
    container: AssetContainer,
    sceneManagement: SceneManagement
  ) {
    super(player, container, sceneManagement);

    this.onPortalIndicatorAdventure();
  }

  get onPlatformAdventure() {
    return this._onPlatformAdventure;
  }

  private onPortalIndicatorAdventure() {
    const onPortalIndicatorAdventure = this._container.meshes.filter(
      (mesh) => mesh.name === 'OnPortalIndicatorAdventure'
    )[0];

    if (!onPortalIndicatorAdventure)
      throw new Error(
        'OnPortalIndicatorAdventure could not be found/was not provided'
      );

    actionHelper(
      this._chassisMesh,
      onPortalIndicatorAdventure,
      (mesh: AbstractMesh, action: IAction) => {
        this._onPlatformAdventure = true;

        this._scene.onAfterStepObservable.addOnce(() => {
          this._onPlatformAdventure = false;
        });
      }
    );
  }
}
