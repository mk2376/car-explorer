import { AbstractMesh, Scene, VertexBuffer } from '@babylonjs/core';
import AmmoModule from 'ammojs-typed';
import { Metadata } from 'src/BabylonGame/interfaces';

let Ammo: typeof AmmoModule;

export class PhysicsHelper {
  private _scene: Scene;
  private _mesh: AbstractMesh;
  private _shape!:
    | AmmoModule.btConvexHullShape
    | AmmoModule.btBvhTriangleMeshShape;
  private _rigidBody!: AmmoModule.btRigidBody;

  constructor(scene: Scene, mesh: AbstractMesh, AmmoImport: typeof AmmoModule) {
    this._scene = scene;
    this._mesh = mesh;
    Ammo = AmmoImport;
  }

  public TriangleMeshShape(): AmmoModule.btBvhTriangleMeshShape | void {
    if (!this._mesh.isVerticesDataPresent(VertexBuffer.PositionKind)) return;

    const positions = this._mesh.getVerticesData(VertexBuffer.PositionKind)!;
    const indices = this._mesh.getIndices()!;
    const localPositions = this._mesh.getFacetLocalPositions();
    const triangleCount = localPositions.length;

    this._mesh.updateFacetData();
    const mTriMesh = new Ammo.btTriangleMesh();

    for (let i = 0; i < triangleCount; i++) {
      const index0 = indices[i * 3];
      const index1 = indices[i * 3 + 1];
      const index2 = indices[i * 3 + 2];
      const vertex0 = new Ammo.btVector3(
        positions[index0 * 3],
        positions[index0 * 3 + 1],
        positions[index0 * 3 + 2]
      );
      const vertex1 = new Ammo.btVector3(
        positions[index1 * 3],
        positions[index1 * 3 + 1],
        positions[index1 * 3 + 2]
      );
      const vertex2 = new Ammo.btVector3(
        positions[index2 * 3],
        positions[index2 * 3 + 1],
        positions[index2 * 3 + 2]
      );

      mTriMesh.addTriangle(vertex0, vertex1, vertex2);
    }

    this._shape = new Ammo.btBvhTriangleMeshShape(mTriMesh, true, true);

    return this._shape;
  }

  public ConvexHullShape(): AmmoModule.btConvexHullShape | void {
    if (!this._mesh.isVerticesDataPresent(VertexBuffer.PositionKind)) return;

    const positions = this._mesh.getVerticesData(VertexBuffer.PositionKind)!;
    const indices = this._mesh.getIndices()!;
    const localPositions = this._mesh.getFacetLocalPositions();
    const triangleCount = localPositions.length;

    this._mesh.updateFacetData();
    const shape = new Ammo.btConvexHullShape();

    for (let i = 0; i < triangleCount; i++) {
      const index0 = indices[i * 3];
      const index1 = indices[i * 3 + 1];
      const index2 = indices[i * 3 + 2];
      const vertex0 = new Ammo.btVector3(
        positions[index0 * 3],
        positions[index0 * 3 + 1],
        positions[index0 * 3 + 2]
      );
      const vertex1 = new Ammo.btVector3(
        positions[index1 * 3],
        positions[index1 * 3 + 1],
        positions[index1 * 3 + 2]
      );
      const vertex2 = new Ammo.btVector3(
        positions[index2 * 3],
        positions[index2 * 3 + 1],
        positions[index2 * 3 + 2]
      );

      shape.addPoint(vertex0, true);
      shape.addPoint(vertex1, true);
      shape.addPoint(vertex2, true);
    }

    this._shape = shape;

    return shape;
  }

  public rigidBody(metadata: Metadata): AmmoModule.btRigidBody {
    const localInertia = new Ammo.btVector3(0, 0, 0);
    const transform = new Ammo.btTransform();

    transform.setIdentity();
    transform.setOrigin(
      new Ammo.btVector3(
        this._mesh.position.x,
        this._mesh.position.y,
        this._mesh.position.z
      )
    );
    transform.setRotation(
      new Ammo.btQuaternion(
        this._mesh.rotationQuaternion!.x,
        this._mesh.rotationQuaternion!.y,
        this._mesh.rotationQuaternion!.z,
        this._mesh.rotationQuaternion!.w
      )
    );

    const motionState = new Ammo.btDefaultMotionState(transform);
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(
      metadata.mass || 0,
      motionState,
      this._shape,
      localInertia
    );
    this._rigidBody = new Ammo.btRigidBody(rbInfo);
    if (metadata.mass !== 0) this._rigidBody.setActivationState(4);
    this._addRigidBody();

    return this._rigidBody;
  }

  private _addRigidBody() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const physicsWorld = this._scene
      .getPhysicsEngine()!
      .getPhysicsPlugin().world;
    // eslint-disable-next-line
    physicsWorld.addRigidBody(this._rigidBody);
  }
}
