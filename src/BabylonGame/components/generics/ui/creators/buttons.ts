import { Button } from '@babylonjs/gui';
import { Hud } from '../ui';

export function createPauseBtn(this: Hud) {
  const btn = Button.CreateImageOnlyButton(
    'pauseBtn',
    './CarExplorer/sprites/pauseBtn.png'
  );
  btn.width = '48px';
  btn.height = '86px';
  btn.thickness = 0;
  btn.verticalAlignment = 0;
  btn.horizontalAlignment = 1;
  btn.top = '-16px';
  this.ui._playerUI.addControl(btn);
  btn.zIndex = 10;

  //when the button is down, make pause menu visable and add control to it
  btn.onPointerDownObservable.add(() => {
    this.ui._pauseMenu.isVisible = true;
    this.ui._playerUI.addControl(this.ui._pauseMenu);
    btn.isHitTestVisible = false;

    //when game is paused, make sure that the next start time is the time it was when paused
    this._gamePaused = true;
    // this.timer._prevTime = this.time;

    //--SOUNDS--
    // this._scene.getSoundByName('gameSong')!.pause();
    // this._sounds._pause.play(); //play pause sounds
  });
}
