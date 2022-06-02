import { AbstractMesh, AssetContainer, PhysicsImpostor, Scene } from '@babylonjs/core';
import { Lights } from '../../../../Lights/Lights';
import { AssetsLoader } from '../../../assetsLoader';
import { parseMetadata } from '../../../parseMetadata';
import AmmoModule from 'ammojs-typed';

let Ammo: typeof AmmoModule;

let _scene: Scene;
let _lights: Lights;

export function _applyPolicyPlayer(
  this: AssetsLoader,
  scene: Scene,
  container: AssetContainer,
  lights: Lights,
  AmmoImport: typeof AmmoModule
) {
  _scene = scene;
  _lights = lights;
  Ammo = AmmoImport;

  //Loop through all world environment meshes that were imported
  container.meshes.forEach((mesh) => {
    __impostorPolicyPlayer(mesh, container);
  });

  const playerMesh = container.meshes.filter((mesh) => mesh.name.includes('player'))[0];

  __meshPolicyPlayer(playerMesh, container);
}

function __impostorPolicyPlayer(mesh: AbstractMesh, container: AssetContainer) {
  if (!mesh.name.includes('objectType')) return;
  if (mesh.physicsImpostor?.type) return; // already has physicsImpostor, if he has not it will return 'undefined'

  const metadata = parseMetadata(mesh.name);

  switch (metadata.objectType) {
    case 'player':
      // console.log('Player found');

      // load/create physicsImpostor of prop mesh first
      const prop = container.meshes.filter((mesh) => mesh.name.includes('prop'))[0];

      const metadataProp = parseMetadata(prop.name);

      prop.physicsImpostor = new PhysicsImpostor(
        prop,
        PhysicsImpostor.ConvexHullImpostor,
        { mass: 0 },
        _scene
      );

      const wheels = container.meshes.filter((mesh) => mesh.name.includes('wheel'));

      wheels.forEach((mesh) => {
        mesh.physicsImpostor = new PhysicsImpostor(
          mesh,
          PhysicsImpostor.SphereImpostor,
          {
            mass: 0,
            disableBidirectionalTransformation: true,
          },
          _scene
        );
      });

      // create the physicsImpostor of root mesh last
      mesh.physicsImpostor = new PhysicsImpostor(
        mesh,
        // PhysicsImpostor.CustomImpostor,
        PhysicsImpostor.NoImpostor,
        { mass: metadata.mass, friction: 5, restitution: 2 },
        _scene
      );

      break;
  }

  // mesh.showBoundingBox = this._showBoundingBox;
}

export function __meshPolicyPlayer(mesh: AbstractMesh, container: AssetContainer) {
  // console.log(mesh.name);

  mesh.receiveShadows = true;

  const name = mesh.name;
  if (name.includes('objectType:player')) {
    mesh.checkCollisions = true;
  }

  _lights.addShadowCaster(mesh, true);
}

/*
  const physicsHelper = new PhysicsHelper(this._scene, mesh, Physics.getInstance());
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
