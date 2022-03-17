import {
  Scene,
  ActionManager,
  ExecuteCodeAction,
  ActionEvent,
} from '@babylonjs/core';

import { Hud } from '../ui/ui';

export class PlayerInput {
  readonly actions: {
    [key: string]: boolean;
  } = { accelerate: false, brake: false, right: false, left: false };

  private stagedActions: {
    [key: string]: boolean;
  } = { accelerate: false, brake: false, right: false, left: false };

  private keyboardInputMap: {
    [key: string]: string;
  } = {
    KeyW: 'accelerate',
    ArrowUp: 'accelerate',
    KeyS: 'brake',
    ArrowDown: 'brake',
    KeyA: 'left',
    ArrowLeft: 'left',
    KeyD: 'right',
    ArrowRight: 'right',
  };

  private _scene: Scene;
  private _gamePaused: boolean;

  // Mobile Input trackers
  private _ui: Hud;

  constructor(scene: Scene, ui: Hud, gamePaused: boolean) {
    this._scene = scene;
    this._ui = ui;
    this._gamePaused = gamePaused;

    // scene action manager to detect inputs
    this._scene.actionManager = new ActionManager(this._scene);

    this._scene.actionManager.registerAction(
      new ExecuteCodeAction(
        ActionManager.OnKeyDownTrigger,
        (evt: ActionEvent) => {
          /*eslint-disable */
          // console.log('key pressed:', evt.sourceEvent.code);
          this.stagedActions[this.keyboardInputMap[evt.sourceEvent.code]] =
            evt.sourceEvent.type == 'keydown';
          /*eslint-enable */
        }
      )
    );

    this._scene.actionManager.registerAction(
      new ExecuteCodeAction(
        ActionManager.OnKeyUpTrigger,
        (evt: ActionEvent) => {
          /*eslint-disable */
          // console.log('key released:', evt.sourceEvent.code);
          this.stagedActions[this.keyboardInputMap[evt.sourceEvent.code]] =
            evt.sourceEvent.type == 'keydown';
          /*eslint-enable */
        }
      )
    );

    //add to the scene an observable that calls updateFromKeyboard before rendering
    this._scene.onBeforeRenderObservable.add(() => {
      this._updateFromKeyboard();
    });

    // Set up Mobile Controls if on mobile device
    if (this._ui.mobile.isMobile) {
      this._setUpMobile();
    }
  }

  // Keyboard controls & Mobile controls
  //handles what is done when keys are pressed or if on mobile, when buttons are pressed
  private _updateFromKeyboard(): void {
    // accelerate - brake
    if (this.stagedActions.accelerate && !this._gamePaused) {
      this.actions.accelerate = true;
    } else if (this.stagedActions.brake && !this._gamePaused) {
      this.actions.brake = true;
    } else {
      this.actions.accelerate = false;
      this.actions.brake = false;
    }

    // left - right
    if (this.stagedActions.left && !this._gamePaused) {
      this.actions.left = true;
    } else if (this.stagedActions.right && !this._gamePaused) {
      this.actions.right = true;
    } else {
      this.actions.left = false;
      this.actions.right = false;
    }
  }

  // Mobile controls
  private _setUpMobile(): void {
    //Arrow Keys
    this._ui.mobile.controls.accelerateBtn.onPointerDownObservable.add(() => {
      this.stagedActions.accelerate = true;
    });
    this._ui.mobile.controls.accelerateBtn.onPointerUpObservable.add(() => {
      this.stagedActions.accelerate = false;
    });

    this._ui.mobile.controls.brakeBtn.onPointerDownObservable.add(() => {
      this.stagedActions.brake = true;
    });
    this._ui.mobile.controls.brakeBtn.onPointerUpObservable.add(() => {
      this.stagedActions.brake = false;
    });

    this._ui.mobile.controls.leftBtn.onPointerDownObservable.add(() => {
      this.stagedActions.left = true;
    });
    this._ui.mobile.controls.leftBtn.onPointerUpObservable.add(() => {
      this.stagedActions.left = false;
    });

    this._ui.mobile.controls.rightBtn.onPointerDownObservable.add(() => {
      this.stagedActions.right = true;
    });
    this._ui.mobile.controls.rightBtn.onPointerUpObservable.add(() => {
      this.stagedActions.right = false;
    });
  }
}
