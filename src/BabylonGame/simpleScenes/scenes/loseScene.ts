import { Engine, Sound } from '@babylonjs/core';
import { StackPanel, TextBlock, Button, Image } from '@babylonjs/gui';
import { SceneManagement } from 'src/BabylonGame/components/sceneManagement';
import { simpleSceneEngine } from '../simpleSceneEngine';

export class loseScene extends simpleSceneEngine {
  constructor(engine: Engine, sceneManagement: SceneManagement) {
    super(engine, sceneManagement);

    this.background();
    this.panel();
    this._loadSounds();
  }

  public async init() {
    await this._scene.whenReadyAsync();

    return this;
  }

  protected background() {
    const image = new Image(
      'lose',
      './CarExplorer/sprites/background/loseScene.jpg'
    );
    image.autoScale = true;
    this._ui.addControl(image);
  }

  protected panel() {
    const panel = new StackPanel();
    this._ui.addControl(panel);

    const text = new TextBlock();
    text.fontSize = 24;
    text.color = 'white';
    text.height = '100px';
    text.width = '100%';
    text.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
    text.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_CENTER;
    text.text = 'You lost.\nMore luck next time.';
    panel.addControl(text);

    const dots = new TextBlock();
    dots.color = 'white';
    dots.fontSize = 24;
    dots.height = '100px';
    dots.width = '100%';
    dots.text = '....';

    const mainBtn = Button.CreateSimpleButton('mainmenu', 'MAIN MENU');
    mainBtn.width = 0.2;
    mainBtn.height = '40px';
    mainBtn.color = 'white';
    panel.addControl(mainBtn);

    mainBtn.onPointerUpObservable.add(() => {
      void this._sceneManagement.state.updateCurState(
        this._sceneManagement._State.START
      );
      // this._sounds.sfx.play();
    });
  }

  protected _loadSounds() {
    /*
    const start = new Sound(
      'loseSong',
      './CarExplorer/sounds/Eye of the Storm.mp3',
      this._scene,
      function () {
        // empty
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
