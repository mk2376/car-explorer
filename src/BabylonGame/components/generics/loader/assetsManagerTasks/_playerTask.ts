import { AbstractMesh, AssetContainer, PhysicsImpostor } from '@babylonjs/core';
import { Environment } from '../environment/environment';
import { parseMetadata } from '../parseMetadata';

export function _playerTask(this: Environment, containerName: string): void {
  const temp = this._assetsManager.addContainerTask(
    containerName,
    '',
    './CarExplorer/models/player/',
    'player.babylon'
  );

  temp.onSuccess = (task) => {
    const container = task.loadedContainer;

    //Loop through all environment meshes that were imported
    container.meshes.forEach((mesh) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this._meshPolicyPlayer(mesh, container);
      this._impostorPolicyPlayer(mesh, container);
    });

    this._containers[containerName] = container;
  };
}

export function _impostorPolicyPlayer(
  this: Environment,
  mesh: AbstractMesh,
  container: AssetContainer
) {
  if (!mesh.name.includes('objectType')) return;
  if (mesh.physicsImpostor?.type) return; // already has physicsImpostor, if he has not it will return 'undefined'

  const metadata = parseMetadata(mesh.name);

  switch (metadata.objectType) {
    case 'player':
      mesh.physicsImpostor = new PhysicsImpostor(
        mesh,
        // PhysicsImpostor.CustomImpostor,
        PhysicsImpostor.ConvexHullImpostor,
        { mass: metadata.mass, friction: 1 },
        this._scene
      );

      break;
  }

  mesh.showBoundingBox = this._showBoundingBox;
}

export function _meshPolicyPlayer(
  this: Environment,
  mesh: AbstractMesh,
  container: AssetContainer
) {
  // console.log(mesh.name);

  mesh.receiveShadows = true;

  const name = mesh.name;
  if (name.includes('objectType:player')) {
    mesh.checkCollisions = true;
  }

  this._lights.addShadowCaster(mesh, true);
}

/*
  const physicsHelper = new PhysicsHelper(this._scene, mesh, this.Ammo);
  physicsHelper.ConvexHullShape();
  // eslint-disable-next-line
  const body = physicsHelper.rigidBody(metadata);
  physicsHelper.addRigidBody();
  mesh.physicsImpostor.physicsBody = body;
*/

/*
    name.includes('Plane') ||
    name.includes('Ground') ||
    name.includes('OnPortalIndicatorPortfolio') ||
    name.includes('OnPortalIndicatorAdventure') ||
    name.includes('WarningBearier') ||
    name.includes('ResetBearier')
*/
