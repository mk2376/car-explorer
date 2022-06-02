import { FreeCamera, Scene, UniversalCamera, Vector3 } from '@babylonjs/core';
import { Button, Control, TextBlock } from '@babylonjs/gui';
import { SceneAssetManagerContainer } from 'src/BabylonGame/components/generics/environmentLoader/sceneAssetManagerContainer';
import { StateManagement } from 'src/BabylonGame/components/sceneManagement';
import { elapsed, now, until } from 'src/BabylonGame/components/time';
import { Scenes } from 'src/BabylonGame/interfaces';
import { SimpleSceneEngine } from '../simpleSceneEngine';

export class cutScene extends SimpleSceneEngine {
  constructor(scene: Scene, state: StateManagement, assetContainers: SceneAssetManagerContainer) {
    super(scene, state, assetContainers);

    this.textBox();
    this.dialog();
    this.progressButton();
    this.skipButton();
    // this._loadSounds();

    // override originCamera from super
    const camera = new FreeCamera('originCamera', new Vector3(0, 0, 0), scene);
    camera.setTarget(Vector3.Forward());
    scene.activeCamera = camera;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async init() {
    void this._lazyLoading();

    return this;
  }

  protected textBox() {
    const text = new TextBlock('description');
    text.text = 'Crystal';
    text.color = 'white';
    text.fontSize = 96;
    // text._automaticSize = true;
    text.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    text.paddingRight = 100;
    // text.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    //text1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this._ui.addControl(text);
  }

  protected dialog() {
    const transition = 0; //increment based on dialogue
    const canplay = false;
    const finished_anim = false;
    let anims_loaded = 0;

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
      void this._state.updateCurState(Scenes.ADVENTURE);
    });
  }

  protected progressButton() {
    //--PROGRESS DIALOGUE--
    const next = Button.CreateImageOnlyButton('next', './CarExplorer/sprites/arrowBtn.png');
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

  private async _lazyLoading() {
    const begining = now();

    if (!this._assetContainers!.loaded) await until(() => this._assetContainers!.loaded);
    this._assetContainers!.addAllToScene();

    this._loaded = true;
    console.info(`${elapsed(begining)} _lazyLoading finished`);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async onEnter() {
    await until(() => this._loaded);
    await this._scene.whenReadyAsync();

    //--SOUNDS--
    // this._sounds.game.play(); // play the gamesong
  }
}
