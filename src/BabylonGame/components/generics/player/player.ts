import {
  Scene,
  Quaternion,
  Axis,
  FollowCamera,
  Vector3,
  Engine,
  AbstractMesh,
  PhysicsImpostor,
  AssetContainer,
} from '@babylonjs/core';
import AmmoModule from 'ammojs-typed';
import { PlayerInput } from './inputController';
import { Hud } from '../ui/ui';
import { SceneManagement } from '../../sceneManagement';

let Ammo: typeof AmmoModule;

const suspensionOffset = 0.2; // 0.2;

const friction = 5;
const suspensionStiffness = 10; // 10;
const suspensionDamping = 0.3; // 0.3;
const suspensionCompression = 4.4; // 4.4;
const suspensionRestLength = 0.6; // 0.6;
const rollInfluence = 0.0;

const steeringIncrement = 0.02;
const steeringClamp = 0.5;
const maxEngineForce = 2000;
const maxBreakingForce = 30;

// wheels
const wheels = {
  FRONT_LEFT: {
    index: 0,
    meshName: 'Player, wheel:FRONT_LEFT',
  },
  FRONT_RIGHT: {
    index: 1,
    meshName: 'Player, wheel:FRONT_RIGHT',
  },
  BACK_LEFT: {
    index: 2,
    meshName: 'Player, wheel:BACK_LEFT',
  },
  BACK_RIGHT: {
    index: 3,
    meshName: 'Player, wheel:BACK_RIGHT',
  },
};

export class Player {
  private _engine: Engine;
  private _scene: Scene;

  private _vehicle!: AmmoModule.btRaycastVehicle;
  private _chassisMesh!: AbstractMesh;
  private _chassisPhysicsImpostor!: PhysicsImpostor;
  private _chassisRigidBody!: AmmoModule.btRigidBody;
  private _wheelMeshes: AbstractMesh[] = [];

  private _container: AssetContainer;
  private _canvas: HTMLCanvasElement;

  private wheelDirectionCS0!: AmmoModule.btVector3;
  private wheelAxleCS!: AmmoModule.btVector3;

  private _engineForce = 0;
  private _vehicleSteering = 0;
  private _breakingForce = 0;
  private _tuning!: AmmoModule.btVehicleTuning;

  private _ui: Hud;
  private _playerInput: PlayerInput;
  private _gamePaused: boolean;

  constructor(
    canvas: HTMLCanvasElement,
    scene: Scene,
    container: AssetContainer,
    ui: Hud,
    gamePaused: boolean,
    AmmoImport: typeof AmmoModule
  ) {
    this._engine = scene.getEngine();
    this._canvas = canvas;
    this._scene = scene;
    this._container = container;
    this._ui = ui;
    this._gamePaused = gamePaused;
    Ammo = AmmoImport;

    this.wheelDirectionCS0 = new Ammo.btVector3(0, -1, 0);
    this.wheelAxleCS = new Ammo.btVector3(-1, 0, 0);

    this._playerInput = new PlayerInput(
      this._scene,
      this._ui,
      this._gamePaused
    );
  }

  get chassisMesh() {
    return this._chassisMesh;
  }

  public load(): void {
    this.createVehicle();

    this._chassisPhysicsImpostor.registerBeforePhysicsStep(() => {
      const time = Number(this._engine.getDeltaTime().toFixed());
      const dt: number = time / 1000;

      const speed = this._vehicle.getCurrentSpeedKmHour();
      this._ui.observers.speedMeter.notifyObservers([speed]);

      this._breakingForce = 0;
      this._engineForce = 0;

      if (this._playerInput.actions.accelerate) {
        if (speed < -1) {
          this._breakingForce = maxBreakingForce;
        } else {
          // limit max speed
          if (speed > 30) {
            this._engineForce = maxEngineForce / 10;
          } else {
            this._engineForce = maxEngineForce;
          }
        }
      } else {
        // slow down if not accelerating
        if (speed > 0.01 || speed < -0.01) {
          this._breakingForce = Math.abs(speed) / 5;
        }
      }

      if (this._playerInput.actions.brake) {
        if (speed > 1) {
          this._breakingForce = maxBreakingForce;
        } else {
          this._engineForce = -maxEngineForce / 2;
        }
      }

      // right
      if (this._playerInput.actions.right) {
        if (this._vehicleSteering < steeringClamp) {
          this._vehicleSteering += steeringIncrement;
        }
        // left
      } else if (this._playerInput.actions.left) {
        if (this._vehicleSteering > -steeringClamp) {
          this._vehicleSteering -= steeringIncrement;
        }
        // no input, proceduarly return to origin
      } else {
        if (this._vehicleSteering < -steeringIncrement)
          this._vehicleSteering += steeringIncrement * 2;
        else {
          if (this._vehicleSteering > steeringIncrement)
            this._vehicleSteering -= steeringIncrement * 2;
          else {
            this._vehicleSteering = 0;
          }
        }
      }

      this._vehicle.applyEngineForce(
        this._engineForce,
        wheels.FRONT_LEFT.index
      );
      this._vehicle.applyEngineForce(
        this._engineForce,
        wheels.FRONT_RIGHT.index
      );

      this._vehicle.setBrake(this._breakingForce / 2, wheels.FRONT_LEFT.index);
      this._vehicle.setBrake(this._breakingForce / 2, wheels.FRONT_RIGHT.index);
      this._vehicle.setBrake(this._breakingForce, wheels.BACK_LEFT.index);
      this._vehicle.setBrake(this._breakingForce, wheels.BACK_RIGHT.index);

      this._vehicle.setSteeringValue(
        this._vehicleSteering,
        wheels.FRONT_LEFT.index
      );
      this._vehicle.setSteeringValue(
        this._vehicleSteering,
        wheels.FRONT_RIGHT.index
      );

      let tm, p, q, i;
      const n = this._vehicle.getNumWheels();
      for (i = 0; i < n; i++) {
        this._vehicle.updateWheelTransform(i, true);
        tm = this._vehicle.getWheelTransformWS(i);
        p = tm.getOrigin();
        q = tm.getRotation();
        this._wheelMeshes[i].position.set(p.x(), p.y(), p.z());
        this._wheelMeshes[i].rotationQuaternion!.set(
          q.x(),
          q.y(),
          q.z(),
          q.w()
        );
        this._wheelMeshes[i].rotate(Axis.Z, Math.PI);
      }

      tm = this._vehicle.getChassisWorldTransform();
      p = tm.getOrigin();
      q = tm.getRotation();
      this._chassisMesh.position.set(p.x(), p.y(), p.z());
      this._chassisMesh.rotationQuaternion!.set(q.x(), q.y(), q.z(), q.w());
    });
  }

  private createVehicle() {
    const mesh = this._container.meshes.filter((searchedMesh) =>
      searchedMesh.name.includes('Player, objectType:player, mass:700')
    )[0];
    if (!mesh) throw new Error('mesh could not be found');

    this._chassisMesh = mesh!;
    this._chassisPhysicsImpostor = this._chassisMesh.physicsImpostor!;
    this._chassisRigidBody = this._chassisPhysicsImpostor
      .physicsBody as AmmoModule.btRigidBody;
    this._chassisRigidBody.setActivationState(4);
    this._RaycastVehicle(this._chassisRigidBody);

    this._bindFollowCamera(this._chassisMesh, this._canvas);

    Object.entries(wheels).forEach(([key, wheel]) => {
      // console.log('\n', key, '\n');

      const mesh = this._container.meshes.filter((searchedMesh) =>
        searchedMesh.name.includes(wheel.meshName)
      )[0];
      if (!mesh) throw new Error('mesh could not be found');

      const relativePosition = mesh.position.clone();

      mesh.parent = null;

      /*
      mesh.physicsImpostor = new PhysicsImpostor(
        mesh,
        PhysicsImpostor.CylinderImpostor,
        { mass: 20 },
        this._scene
      );
      */

      const wheelHalfTrack = relativePosition.x; // width distance from center
      const wheelAxisHeight = relativePosition.y + suspensionOffset; // height distance from center
      const wheelAxisPosition = relativePosition.z; // length distance from center

      const wheelRadius = mesh.getBoundingInfo().boundingBox.extendSize._y;
      const wheelWidth = mesh.getBoundingInfo().boundingBox.extendSize._x;

      /*
      console.log('wheelHalfTrack', wheelHalfTrack);
      console.log('wheelAxisHeight', wheelAxisHeight);
      console.log('wheelAxisPosition', wheelAxisPosition);

      console.log('wheelRadius', wheelRadius);
      console.log('wheelWidth', wheelWidth);
      */

      this.addWheel(
        true,
        new Ammo.btVector3(wheelHalfTrack, wheelAxisHeight, wheelAxisPosition),
        wheelRadius,
        wheel.index,
        mesh
      );
    });
  }

  private addWheel(
    isFront: boolean,
    pos: AmmoModule.btVector3,
    radius: number,
    index: number,
    mesh: AbstractMesh
  ) {
    const wheelInfo = this._vehicle.addWheel(
      pos,
      this.wheelDirectionCS0,
      this.wheelAxleCS,
      suspensionRestLength,
      radius,
      this._tuning,
      isFront
    );

    wheelInfo.set_m_suspensionStiffness(suspensionStiffness);
    wheelInfo.set_m_wheelsDampingRelaxation(suspensionDamping);
    wheelInfo.set_m_wheelsDampingCompression(suspensionCompression);
    wheelInfo.set_m_maxSuspensionForce(600000);
    wheelInfo.set_m_frictionSlip(40);
    wheelInfo.set_m_rollInfluence(rollInfluence);

    this._wheelMeshes[index] = mesh;
  }

  private _bindFollowCamera(mesh: AbstractMesh, canvas: HTMLCanvasElement) {
    const camera = new FollowCamera(
      'FollowCam',
      new Vector3(0, 10, -10),
      this._scene
    );
    camera.radius = 10;
    camera.heightOffset = 4;
    camera.rotationOffset = 0;
    camera.cameraAcceleration = 0.05;
    camera.maxCameraSpeed = 200;
    camera.attachControl(canvas as unknown as undefined);
    camera.lockedTarget = mesh; //version 2.5 onwards
    this._scene.activeCamera = camera;
  }

  private _RaycastVehicle(body: AmmoModule.btRigidBody) {
    // eslint-disable-next-line
    const physicsWorld = this._scene
      .getPhysicsEngine()!
      .getPhysicsPlugin().world;

    this._tuning = new Ammo.btVehicleTuning();
    this._tuning.set_m_suspensionStiffness(36);
    this._tuning.set_m_suspensionCompression(2.4);
    this._tuning.set_m_suspensionDamping(4);
    this._tuning.set_m_maxSuspensionTravelCm(1500);
    this._tuning.set_m_frictionSlip(3.5);
    this._tuning.set_m_maxSuspensionForce(50000);

    // eslint-disable-next-line
    const rayCaster = new Ammo.btDefaultVehicleRaycaster(physicsWorld);
    this._vehicle = new Ammo.btRaycastVehicle(this._tuning, body, rayCaster);
    this._vehicle.setCoordinateSystem(0, 1, 2);
    // eslint-disable-next-line
    physicsWorld.addAction(this._vehicle);
  }

  public toInitPosition() {
    const player = this._chassisMesh;
    const initPlayer = this._scene.getMeshByName('initPosition');
    if (!initPlayer)
      console.log('mesh could not be found, reverting to manual');

    player.position = initPlayer
      ? initPlayer.position.clone()
      : new Vector3(0, 5, 0);
    player.rotationQuaternion =
      initPlayer && initPlayer.rotationQuaternion
        ? initPlayer.rotationQuaternion.clone()
        : new Quaternion();

    player._physicsImpostor?.setAngularVelocity(new Vector3(0, 0, 0));
    player._physicsImpostor?.setLinearVelocity(new Vector3(0, 0, 0));
  }
}
