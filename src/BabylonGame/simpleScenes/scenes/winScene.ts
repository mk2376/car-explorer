import { StateManagement } from 'src/BabylonGame/components/sceneManagement';
import { SimpleSceneEngine } from '../simpleSceneEngine';
import { Scene } from '@babylonjs/core';
import { Button, Control, Rectangle, StackPanel, TextBlock } from '@babylonjs/gui';

import readme from 'raw-loader!./../../../../docs/credits.md';
import { Scenes } from 'src/BabylonGame/interfaces';

export class winScene extends SimpleSceneEngine {
  constructor(scene: Scene, state: StateManagement) {
    super(scene, state);

    this.background();
    this.credits();
    this.returnButton();
  }

  public async init() {
    await this._scene.whenReadyAsync();

    return this;
  }

  protected background() {
    const rect = new Rectangle();
    rect.thickness = 0;
    rect.background = 'black';
    rect.alpha = 0.4;
    rect.width = 1;
    this._ui.addControl(rect);
  }

  protected credits() {
    const stackPanel = new StackPanel('credits');
    stackPanel.fontFamily = 'Viga';
    stackPanel.fontSize = '16px';
    stackPanel.color = 'white';
    this._ui.addControl(stackPanel);

    const wincreds = new TextBlock('special');
    wincreds.resizeToFit = true;
    wincreds.color = 'white';
    wincreds.text =
      'Special thanks to everyone that helped to create or contribute to this project!';
    wincreds.textWrapping = true;
    wincreds.height = '24px';
    wincreds.fontFamily = 'Viga';
    stackPanel.addControl(wincreds);

    for (const line of String(readme).split(/[\r\n]+/)) {
      const block = new TextBlock();

      if (line.startsWith('####')) {
        block.text += '\n';
        block.text += line.slice(line.indexOf(' '));
        block.text += '\n';
        block.fontSize = 20;
      } else if (line.startsWith('###')) {
        block.text += '\n';
        block.text += line.slice(line.indexOf(' '));
        block.text += '\n';
        block.fontSize = 22;
      } else if (line.startsWith('##')) {
        block.text += '\n';
        block.text += line.slice(line.indexOf(' '));
        block.text += '\n';
        block.fontSize = 25;
      } else if (line.startsWith('#')) {
        block.text += '\n';
        block.text += line.slice(line.indexOf(' '));
        block.text += '\n';
        block.fontSize = 26;
      } else if (line.startsWith('-')) {
        block.text = line.slice(line.indexOf(' '));
        block.fontSize = 16;
      }

      block.resizeToFit = true;
      block.textWrapping = true;

      stackPanel.addControl(block);
    }
  }

  protected returnButton() {
    const btn = Button.CreateSimpleButton('return', 'RETURN');
    btn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    btn.fontFamily = 'Viga';
    btn.width = 0.2;
    btn.height = '40px';
    btn.color = 'white';
    this._ui.addControl(btn);

    btn.onPointerDownObservable.add(() => {
      void this._state.updateCurState(Scenes.START);
    });
  }
}
