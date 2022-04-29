import { AbstractMesh, AssetContainer, IAction } from '@babylonjs/core';
import { SceneManagement } from '../../sceneManagement';
import { actionHelper } from './Helper';
import { Player } from '../player/player';
import { actionsController } from './actionsController';

export class actionsControllerPortfolio extends actionsController {
  constructor(
    player: Player,
    container: AssetContainer,
    sceneManagement: SceneManagement
  ) {
    super(player, container, sceneManagement);

    this.resetBearier();
    this.warningBearier();
    this.onPortalIndicatorPortfolio();
  }

  private resetBearier() {
    const resetBearier = this._container.meshes.filter((mesh) =>
      mesh.name.includes('ResetBearier_')
    );

    if (!resetBearier)
      throw new Error('ResetBearier_ could not be found/was not provided');

    actionHelper(
      this._chassisMesh,
      resetBearier,
      (mesh: AbstractMesh, action: IAction) => {
        this._player.toInitPosition();
      }
    );
  }

  private warningBearier() {
    const warningBearier = this._container.meshes.filter((mesh) =>
      mesh.name.includes('WarningBearier_')
    );

    if (!warningBearier)
      throw new Error('WarningBearier_ could not be found/was not provided');

    actionHelper(this._chassisMesh, warningBearier, () => {
      // warning
    });
  }

  private onPortalIndicatorPortfolio() {
    const onPortalIndicatorPortfolio = this._container.meshes.filter(
      (mesh) => mesh.name === 'OnPortalIndicatorPortfolio'
    )[0];

    if (!onPortalIndicatorPortfolio)
      throw new Error(
        'OnPortalIndicatorPortfolio could not be found/was not provided'
      );

    actionHelper(
      this._chassisMesh,
      onPortalIndicatorPortfolio,
      (mesh: AbstractMesh, action: IAction) => {
        void this._sceneManagement.state.updateCurState(
          this._sceneManagement._State.CUTSCENE
        );
      }
    );
  }
}
