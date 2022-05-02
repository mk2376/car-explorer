import { Engine, Sound } from '@babylonjs/core';
import {
  StackPanel,
  Button,
  TextBlock,
  Rectangle,
  Control,
  Image,
} from '@babylonjs/gui';
import { mobileDeviceHandler } from 'src/BabylonGame/components/mobileDeviceHandler';
import { SceneManagement } from 'src/BabylonGame/components/sceneManagement';
import { SimpleSceneEngine } from '../simpleSceneEngine';

export class startScene extends SimpleSceneEngine {
  protected startBtn!: Button;

  constructor(engine: Engine, sceneManagement: SceneManagement) {
    super(engine, sceneManagement);

    this.background();
    this.title();
    this.startButton();
    this.mobileOptimizations();
    this._loadSounds();
  }

  public async init() {
    await this._scene.whenReadyAsync();

    return this;
  }

  protected background() {
    const startbg = new Image(
      'startbg',
      './CarExplorer/sprites/background/startScene.jpg'
    );
    this._ui.addControl(startbg);
  }

  protected title() {
    const title = new TextBlock('title', 'CAR EXPLORER');
    title.resizeToFit = true;
    title.fontFamily = 'Ceviche One';
    title.fontSize = '64px';
    title.color = 'white';
    title.resizeToFit = true;
    title.top = '14px';
    title.width = 0.8;
    title.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this._ui.addControl(title);
  }

  protected startButton() {
    const startBtn = Button.CreateSimpleButton('start', 'PLAY');
    startBtn.fontFamily = 'Viga';
    startBtn.width = 0.2;
    startBtn.height = '40px';
    startBtn.color = 'white';
    startBtn.top = '-14px';
    startBtn.thickness = 0;
    startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    this._ui.addControl(startBtn);

    startBtn.onPointerDownObservable.add(() => {
      //sounds
      // this._sounds.sfx.play();

      void this._sceneManagement.state.updateCurState(
        this._sceneManagement._State.PORTFOLIO
      );
    });

    this.startBtn = startBtn;
  }

  protected mobileOptimizations() {
    if (mobileDeviceHandler.isMobile) {
      //popup for mobile to rotate screen
      const rect1 = new Rectangle();
      rect1.height = 0.2;
      rect1.width = 0.3;
      rect1.verticalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
      rect1.horizontalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
      rect1.background = 'white';
      rect1.alpha = 0.8;
      this._ui.addControl(rect1);

      const rect = new Rectangle();
      rect.height = 0.2;
      rect.width = 0.3;
      rect.verticalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
      rect.horizontalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
      rect.color = 'whites';
      this._ui.addControl(rect);

      const stackPanel = new StackPanel();
      stackPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
      rect.addControl(stackPanel);

      //image
      const image = new Image('rotate', './sprites/rotate.png');
      image.width = 0.4;
      image.height = 0.6;
      image.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      rect.addControl(image);

      //alert message
      const alert = new TextBlock(
        'alert',
        'For the best experience, please rotate your device'
      );
      alert.fontSize = '16px';
      alert.fontFamily = 'Viga';
      alert.color = 'black';
      alert.resizeToFit = true;
      alert.textWrapping = true;
      stackPanel.addControl(alert);

      const closeAlert = Button.CreateSimpleButton('close', 'X');
      closeAlert.height = '24px';
      closeAlert.width = '24px';
      closeAlert.color = 'black';
      stackPanel.addControl(closeAlert);

      //remove control of the play button until the user closes the notification(allowing for fullscreen mode)
      this.startBtn.isHitTestVisible = false;

      closeAlert.onPointerUpObservable.add(() => {
        this._ui.removeControl(rect);
        this._ui.removeControl(rect1);

        this.startBtn.isHitTestVisible = true;
        this._engine.enterFullscreen(true);
      });
    }
  }

  protected _loadSounds() {
    /*
    const start = new Sound(
      'startSong',
      './CarExplorer/sounds/copycat(revised).mp3',
      this._scene,
      function () {
        //empty
      },
      {
        volume: 0.25,
        loop: true,
        autoplay: true,
      }
    );
    this._sounds.start = start;

    const sfx = new Sound(
      'selection',
      './CarExplorer/sounds/vgmenuselect.wav',
      this._scene
    );
    this._sounds.sfx = sfx;
    */
  }
}
