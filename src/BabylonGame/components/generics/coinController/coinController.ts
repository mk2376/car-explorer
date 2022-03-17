import { AbstractMesh, AssetContainer, IAction } from '@babylonjs/core';
import { actionHelper } from '../actionsController/Helper';
import { Hud } from '../ui/ui';
import { addSphereCollider, randomLocation } from './collider';

export class coinController {
  protected _ui: Hud;

  protected _coinMeshName: string;
  protected _playerMesh: AbstractMesh;
  protected _coinsMeshes: AbstractMesh[] = [];

  protected _numOfCoins: number; // max
  protected _coinsCollected = 0;

  protected collectedAll = false;

  protected addSphereCollider = addSphereCollider;
  protected randomLocation = randomLocation;

  constructor(
    ui: Hud,
    coinMeshName: string,
    playerMesh: AbstractMesh,
    numOfCoins: number
  ) {
    this._ui = ui;
    this._coinMeshName = coinMeshName;
    this._playerMesh = playerMesh;
    this._numOfCoins = numOfCoins;

    this._ui.observers.crystal.notifyObservers([
      this._coinsCollected,
      this._numOfCoins,
    ]);
  }

  get collectedAllCoins() {
    return this.collectedAll;
  }

  protected updateStatus() {
    if (this._coinsCollected === this._numOfCoins) this.collectedAll = true;
  }

  public init(container: AssetContainer) {
    const mesh = container.meshes.filter((searchedMesh) =>
      searchedMesh.name.includes(this._coinMeshName)
    )[0];

    if (!mesh)
      return new Error(
        `coinController could not be initialized, mesh with name
          ${this._coinMeshName}
          was not found`
      );

    Array(this._numOfCoins)
      .fill('')
      .forEach((_, i) => {
        const coin = mesh.clone(`${mesh.name}_clone_${i}`, mesh.parent)!;

        // TODO:copy animations to clones

        /*
        console.log(container.animations);
        console.log(container.animationGroups);
        console.log(container.animationGroups[0].targetedAnimations[0]);

        const animGroupClone = new AnimationGroup('lanternAnimGroup');
        animGroupClone.addTargetedAnimation(
          // eslint-disable-next-line
          container.animationGroups[0].targetedAnimations[0].animation,
          coin
        );
        */
        const collider = this.addSphereCollider(coin, true);

        this.randomLocation(coin, collider);
        this._coinsMeshes.push(collider);
        container.meshes.push(coin, collider);
      });

    actionHelper(
      this._playerMesh,
      this._coinsMeshes,
      (mesh: AbstractMesh, action: IAction) => {
        this._playerMesh.actionManager?.unregisterAction(action);
        this._coinsCollected++;
        this.updateStatus();
        this._ui.observers.crystal.notifyObservers([
          this._coinsCollected,
          this._numOfCoins,
        ]);
        mesh.parent?.dispose();
        mesh.dispose();
      }
    );

    mesh.dispose();
  }
}
