import { Rectangle, Control, Grid } from '@babylonjs/gui';
import { mobileDeviceHandler } from 'src/BabylonGame/components/mobileDeviceHandler';
import { Hud } from '../ui';

//Check if Mobile, add button controls
export function mobileControls(this: Hud) {
  if (mobileDeviceHandler.isMobile) {
    //--ACTION BUTTONS--
    // container for action buttons (right side of screen)
    const actionContainer = new Rectangle();
    actionContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    actionContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    actionContainer.height = 0.4;
    actionContainer.width = 0.2;
    actionContainer.left = '-2%';
    actionContainer.top = '-2%';
    actionContainer.thickness = 0;
    this.ui._playerUI.addControl(actionContainer);

    //grid for action button placement
    const actionGrid = new Grid();
    actionGrid.addColumnDefinition(0.5);
    actionGrid.addColumnDefinition(0.5);
    actionGrid.addRowDefinition(0.5);
    actionGrid.addRowDefinition(0.5);
    actionContainer.addControl(actionGrid);

    //--MOVEMENT BUTTONS--
    // container for movement buttons (section left side of screen)
    const moveContainer = new Rectangle();
    moveContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    moveContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    moveContainer.height = 0.4;
    moveContainer.width = 0.4;
    moveContainer.left = '2%';
    moveContainer.top = '-2%';
    moveContainer.thickness = 0;
    this.ui._playerUI.addControl(moveContainer);
  }
}
