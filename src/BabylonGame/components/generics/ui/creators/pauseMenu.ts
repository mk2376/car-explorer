import { Effect, PostProcess } from '@babylonjs/core';
import { Rectangle, Control, StackPanel, Button, Image } from '@babylonjs/gui';
import { Hud } from '../ui';

//---- Pause Menu Popup ----
export function _createPauseMenu(this: Hud): void {
  this._gamePaused = false;

  const pauseMenu = new Rectangle();
  pauseMenu.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
  pauseMenu.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
  pauseMenu.height = 0.8;
  pauseMenu.width = 0.5;
  pauseMenu.thickness = 0;
  pauseMenu.isVisible = false;

  //background image
  const image = new Image('pause', './CarExplorer/sprites/pause.jpeg');
  pauseMenu.addControl(image);

  //stack panel for the buttons
  const stackPanel = new StackPanel();
  stackPanel.width = 0.83;
  pauseMenu.addControl(stackPanel);

  const resumeBtn = Button.CreateSimpleButton('resume', 'RESUME');
  resumeBtn.width = 0.18;
  resumeBtn.height = '44px';
  resumeBtn.color = 'white';
  resumeBtn.fontFamily = 'Viga';
  resumeBtn.paddingBottom = '14px';
  resumeBtn.cornerRadius = 14;
  resumeBtn.fontSize = '12px';
  resumeBtn.textBlock!.resizeToFit = true;
  resumeBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  resumeBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
  stackPanel.addControl(resumeBtn);

  this.ui._pauseMenu = pauseMenu;

  //when the button is down, make menu invisable and remove control of the menu
  resumeBtn.onPointerDownObservable.add(() => {
    this.ui._pauseMenu.isVisible = false;
    this.ui._playerUI.removeControl(pauseMenu);
    this.ui.pauseBtn.isHitTestVisible = true;

    //game unpaused, our time is now reset
    this._gamePaused = false;

    //--SOUNDS--
    // this._scene.getSoundByName('gameSong')!.play();
    // this._sounds._pause.stop();

    if (this._sounds._sparkWarningSfx.isPaused) {
      // this._sounds._sparkWarningSfx.play();
    }
    // this._sounds._sfx.play(); //play transition sound
  });

  const controlsBtn = Button.CreateSimpleButton('controls', 'CONTROLS');
  controlsBtn.width = 0.18;
  controlsBtn.height = '44px';
  controlsBtn.color = 'white';
  controlsBtn.fontFamily = 'Viga';
  controlsBtn.paddingBottom = '14px';
  controlsBtn.cornerRadius = 14;
  controlsBtn.fontSize = '12px';
  resumeBtn.textBlock!.resizeToFit = true;
  controlsBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
  controlsBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

  stackPanel.addControl(controlsBtn);

  //when the button is down, make menu invisable and remove control of the menu
  controlsBtn.onPointerDownObservable.add(() => {
    //open controls screen
    // this.ui._controls.isVisible = true;
    this.ui._pauseMenu.isVisible = false;

    //play transition sound
    // this._sounds._sfx.play();
  });

  const quitBtn = Button.CreateSimpleButton('quit', 'QUIT');
  quitBtn.width = 0.18;
  quitBtn.height = '44px';
  quitBtn.color = 'white';
  quitBtn.fontFamily = 'Viga';
  quitBtn.paddingBottom = '12px';
  quitBtn.cornerRadius = 14;
  quitBtn.fontSize = '12px';
  resumeBtn.textBlock!.resizeToFit = true;
  quitBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  quitBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
  stackPanel.addControl(quitBtn);

  quitBtn.onPointerDownObservable.add(() => {
    void this._sceneManagement.stateManagement.updateCurState(
      this._sceneManagement._State.START
    );

    //--SOUNDS--
    // this._sounds.quitSfx.play();
    if (this._sounds._pause.isPlaying) {
      this._sounds._pause.stop();
    }
  });
}
