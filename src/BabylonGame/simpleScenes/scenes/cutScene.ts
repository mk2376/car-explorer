import { Engine } from '@babylonjs/core';
import { Button, Control } from '@babylonjs/gui';
import { SceneManagement } from 'src/BabylonGame/components/sceneManagement';
import { simpleSceneEngine } from '../simpleSceneEngine';

export class cutScene extends simpleSceneEngine {
  constructor(engine: Engine, sceneManagement: SceneManagement) {
    super(engine, sceneManagement);

    // this.background();
    this.dialog();
    this.skipButton();
    this.progressButton();
    // this._loadSounds();
  }

  public async init() {
    await this._scene.whenReadyAsync();

    return this;
  }

  protected dialog() {
    const transition = 0; //increment based on dialogue
    const canplay = false;
    const finished_anim = false;
    let anims_loaded = 0;

    //skip cutscene
    const skipBtn = Button.CreateSimpleButton('skip', 'SKIP');
    skipBtn.fontFamily = 'Viga';
    skipBtn.width = '45px';
    skipBtn.left = '-14px';
    skipBtn.height = '40px';
    skipBtn.color = 'white';
    skipBtn.top = '14px';
    skipBtn.thickness = 0;
    skipBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    skipBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this._ui.addControl(skipBtn);

    //--PLAYING ANIMATIONS--
    let animTimer: ReturnType<typeof setInterval>;
    let anim2Timer: ReturnType<typeof setInterval>;
    const anim = 1; //keeps track of which animation we're playing

    //sets up the state machines for animations
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this._scene.onBeforeRenderObservable.add((): void => {
      if (anims_loaded == 8) {
        this._engine.hideLoadingUI();
        anims_loaded = 0;
      }
    });
  }

  //skip cutscene
  protected skipButton() {
    const skipBtn = Button.CreateSimpleButton('skip', 'SKIP');
    skipBtn.fontFamily = 'Viga';
    skipBtn.width = '45px';
    skipBtn.left = '-14px';
    skipBtn.height = '40px';
    skipBtn.color = 'white';
    skipBtn.top = '14px';
    skipBtn.thickness = 0;
    skipBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    skipBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this._ui.addControl(skipBtn);

    skipBtn.onPointerDownObservable.add(() => {
      void this._sceneManagement.stateManagement.updateCurState(
        this._sceneManagement._State.ADVENTURE
      );
    });
  }

  protected progressButton() {
    //--PROGRESS DIALOGUE--
    const next = Button.CreateImageOnlyButton(
      'next',
      './CarExplorer/sprites/arrowBtn.png'
    );
    next.rotation = Math.PI / 2;
    next.thickness = 0;
    next.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    next.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    next.width = '64px';
    next.height = '64px';
    next.top = '-3%';
    next.left = '-12%';
    next.isVisible = false;
    this._ui.addControl(next);

    next.onPointerUpObservable.add(() => {
      //
    });
  }
}
