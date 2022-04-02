import { Rectangle, Control, TextBlock, Button, Image } from '@babylonjs/gui';
import { Hud } from '../ui';

//---- Controls Menu Popup ----
export function _createControlsMenu(this: Hud) {
  const controls = new Rectangle();
  controls.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
  controls.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
  controls.height = 0.8;
  controls.width = 0.5;
  controls.thickness = 0;
  controls.color = 'white';
  controls.isVisible = false;
  this.ui._playerUI.addControl(controls);
  this.ui._controls = controls;

  //background image
  const image = new Image('controls', './CarExplorer/sprites/controls.jpeg');
  controls.addControl(image);

  const title = new TextBlock('title', 'CONTROLS');
  title.resizeToFit = true;
  title.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  title.fontFamily = 'Viga';
  title.fontSize = '32px';
  title.top = '14px';
  controls.addControl(title);

  const backBtn = Button.CreateImageOnlyButton(
    'back',
    './CarExplorer/sprites/lanternbutton.jpeg'
  );
  backBtn.width = '40px';
  backBtn.height = '40px';
  backBtn.top = '14px';
  backBtn.thickness = 0;
  backBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
  backBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  controls.addControl(backBtn);

  //when the button is down, make menu invisable and remove control of the menu
  backBtn.onPointerDownObservable.add(() => {
    this.ui._pauseMenu.isVisible = true;
    this.ui._controls.isVisible = false;

    //play transition sound
    // this._sounds._sfx.play();
  });
}
