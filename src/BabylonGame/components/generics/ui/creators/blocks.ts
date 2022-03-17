import { TextBlock, Control } from '@babylonjs/gui';
import { Hud } from '../ui';

export function createCrystalsBlock(this: Hud) {
  const block = new TextBlock();
  block.name = 'crystals';
  block.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_CENTER;
  block.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
  block.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  block.fontSize = '22px';
  block.color = 'white';
  block.text = 'Error';
  block.top = '32px';
  block.left = '-64px';
  block.width = '25%';
  block.fontFamily = 'Viga';
  block.resizeToFit = true;
  this.ui._playerUI.addControl(block);

  this.observers.crystal.add((eventData, eventState) => {
    const payload = eventData as Array<unknown>;

    const collected = payload[0] as number;
    const total = payload[1] as number;

    block.text = `Crystals: ${collected} / ${total}`;
  });
}

//Game timer text
export function createTimeBlock(this: Hud) {
  const block = new TextBlock();
  block.name = 'clock';
  block.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
  block.fontSize = '48px';
  block.color = 'white';
  block.text = '11:00';
  block.resizeToFit = true;
  block.height = '96px';
  block.width = '220px';
  block.fontFamily = 'Viga';
  this.ui._stackPanel.addControl(block);

  this.observers.timer.add((eventData, eventState) => {
    const payload = eventData as Array<unknown>;

    const timeLeft = payload[0] as number;

    block.text = `${timeLeft} left`;
  });
}

// Speed Meter
export function createSpeedBlock(this: Hud) {
  const block = new TextBlock();
  block.name = 'speed';
  block.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
  block.fontSize = '48px';
  block.color = 'white';
  block.text = '0 km/h';
  block.resizeToFit = true;
  block.height = '96px';
  block.width = '220px';
  block.fontFamily = 'Viga';
  this.ui._stackPanel.addControl(block);

  this.observers.speedMeter.add((eventData, eventState) => {
    const payload = eventData as Array<unknown>;

    const speed = payload[0] as number;

    let reverseSign = speed < 0 ? '(R) ' : '';
    reverseSign = reverseSign.padStart(4);
    let formattedSpeed = Math.abs(speed).toFixed(1);
    formattedSpeed = formattedSpeed.padStart(6);

    block.text = `${reverseSign} ${formattedSpeed} km/h`;
  });
}
