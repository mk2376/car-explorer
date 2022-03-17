import { StackPanel } from '@babylonjs/gui';
import { Hud } from '../ui';

export function createTopStackPanel(this: Hud) {
  const stackPanel = new StackPanel();
  stackPanel.height = '100%';
  stackPanel.width = '100%';
  stackPanel.top = '14px';
  stackPanel.verticalAlignment = 0;
  this.ui._playerUI.addControl(stackPanel);
  this.ui._stackPanel = stackPanel;
}
