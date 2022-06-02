import { AbstractMesh, AssetContainer, PhysicsImpostor, Scene } from '@babylonjs/core';
import { Lights } from '../../../Lights/Lights';
import { AssetsLoader } from '../../assetsLoader';
import { parseMetadata } from '../../parseMetadata';
import { PhysicsHelper } from '../../PhysicsHelper';
import AmmoModule from 'ammojs-typed';

let Ammo: typeof AmmoModule;

let _scene: Scene;
let _lights: Lights;

export function _applyPolicyWorld(
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    __meshPolicyWorld(mesh, container);
    __impostorPolicyWorld(mesh, container);
  });
}

function __impostorPolicyWorld(mesh: AbstractMesh, container: AssetContainer) {
  if (!mesh.name.includes('objectType')) return; // is not a rigidBody
  if (mesh.physicsImpostor?.type) return; // already has physicsImpostor, if he has not it will return 'undefined'

  const metadata = parseMetadata(mesh.name);

  switch (metadata.objectType) {
    case 'foliage':
      // do nothing
      break;
    case 'prop':
      if (metadata.mass > 0) {
        mesh.physicsImpostor = new PhysicsImpostor(
          mesh,
          PhysicsImpostor.ConvexHullImpostor,
          { mass: metadata.mass, friction: 1 },
          _scene
        );
      } else {
        mesh.physicsImpostor = new PhysicsImpostor(
          mesh,
          PhysicsImpostor.CustomImpostor,
          { mass: metadata.mass, friction: 1 },
          _scene
        );

        const physicsHelper = new PhysicsHelper(_scene, mesh, Ammo);
        physicsHelper.TriangleMeshShape();
        mesh.physicsImpostor.physicsBody = physicsHelper.rigidBody(metadata);
      }
      break;
    case 'box':
    case 'ground':
      mesh.physicsImpostor = new PhysicsImpostor(
        mesh,
        PhysicsImpostor.BoxImpostor,
        { mass: metadata.mass, friction: 1 },
        _scene
      );
      break;
    case 'coin':
      /*
      console.log('coin detected');
      mesh.ellipsoid = new Vector3(5, 7, 5);
      mesh.checkCollisions = true;
      */
      break;
    case 'cloth':
      mesh.physicsImpostor = new PhysicsImpostor(
        mesh,
        PhysicsImpostor.BoxImpostor,
        { mass: 0, friction: 1 },
        _scene
      );
      /*
      mesh.physicsImpostor = new PhysicsImpostor(
        mesh,
        PhysicsImpostor.ClothImpostor,
        {
          mass: metadata.mass,
          // friction: 0,
          restitution: 0,
          // damping: 0.01,
          margin: 0.2,
          fixedPoints: 3,
        },
        this._scene
      );
      mesh.physicsImpostor.velocityIterations = 10;
      mesh.physicsImpostor.positionIterations = 10;
      mesh.physicsImpostor.stiffness = 1;

      mesh.material!.backFaceCulling = false;

      console.log('////////////////////////');

      if (mesh.name.includes('Board 16-9_Board')) {
        const index = Number(
          mesh.name.split('Board 16-9_Board_')[1].split(',')[0]
        );
        // console.log(index);

        const searchedMesh1 = container.meshes.filter((searchedMesh) =>
          searchedMesh.name.includes(`Pillar_${index}1`)
        )[0];

        const searchedMesh2 = container.meshes.filter((searchedMesh) =>
          searchedMesh.name.includes(`Pillar_${index}2`)
        )[0];

        this._impostorPolicyWorld(searchedMesh1, container);
        this._impostorPolicyWorld(searchedMesh2, container);

        mesh.physicsImpostor.addAnchor(
          searchedMesh1.physicsImpostor!,
          1,
          0,
          1,
          false
        );

        mesh.physicsImpostor.addAnchor(
          searchedMesh2.physicsImpostor!,
          0,
          0,
          1,
          false
        );
      }
      */
      break;
  }

  // mesh.showBoundingBox = this._showBoundingBox;
  /*
        mesh.physicsImpostor = new PhysicsImpostor(
          mesh,
          PhysicsImpostor.NoImpostor,
          { mass: metadata.mass, friction: 1 },
          this._scene
        );

        const physicsHelper = new PhysicsHelper(this._scene, mesh, Physics.getInstance());
        physicsHelper.ConvexHullShape();
        mesh.physicsImpostor.physicsBody = physicsHelper.rigidBody(metadata);
        physicsHelper.addRigidBody();
  */
}

/*
    // console.log(childNode.name, childNode.getChildren().length);
    const childMesh = container.meshes.filter(
      (mesh) => mesh.name === childNode.name
    )[0];
*/

function __meshPolicyWorld(mesh: AbstractMesh, container: AssetContainer) {
  // console.log(mesh.name);

  try {
    mesh.receiveShadows = true;
  } catch (e) {
    // AbstractMesh only has a getter for receiveShadows
  }

  // mesh.isVisible = true; // visibility is set in blender
  // mesh.isPickable = false;
  const name = mesh.name;
  if (name.includes('Plane') || name.includes('Ground')) {
    mesh.checkCollisions = true;
  } else if (
    name.includes('OnPortalIndicatorPortfolio') ||
    name.includes('OnPortalIndicatorAdventure') ||
    name.includes('WarningBearier') ||
    name.includes('ResetBearier')
  ) {
    mesh.receiveShadows = false;
    mesh.checkCollisions = true;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    _lights.addShadowCaster(mesh, true);
  }
}
