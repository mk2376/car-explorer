import { Scene, Observable } from '@babylonjs/core';
import {
  TextBlock,
  StackPanel,
  AdvancedDynamicTexture,
  Button,
  Rectangle,
} from '@babylonjs/gui';
import { observers, Sounds } from 'src/BabylonGame/interfaces';
import { SceneManagement } from '../../sceneManagement';

import { createSpeedBlock } from './creators/blocks';
import { createPauseBtn } from './creators/buttons';
import { _createControlsMenu } from './creators/controlsMenu';
import { mobileControls } from './creators/mobileControls';
import { _createPauseMenu } from './creators/pauseMenu';
import { _loadSounds } from './creators/sounds';
import { createTopStackPanel } from './creators/stackPanels';

class ui {
  _playerUI!: AdvancedDynamicTexture;
  _stackPanel!: StackPanel;
  _pauseMenu!: Rectangle;
  _controls!: Rectangle;
  pauseBtn!: Button;
  timeBlock!: TextBlock; //GAME TIME
  fadeLevel!: number;
}

class controls {
  accelerateBtn!: Button;
  brakeBtn!: Button;
  leftBtn!: Button;
  rightBtn!: Button;
}

class mobile {
  isMobile!: boolean;
  controls = new controls();
}

export class Hud {
  protected _scene: Scene;
  protected _sceneManagement: SceneManagement;
  protected _gamePaused: boolean;

  // UI Elements
  readonly ui = new ui();

  // Mobile
  readonly mobile = new mobile();

  // Observable
  readonly observers: observers = {
    speedMeter: new Observable(),
  };

  //Sounds
  protected _sounds: Sounds = {};

  protected createTopStackPanel = createTopStackPanel;
  protected createSpeedBlock = createSpeedBlock;

  protected createPauseBtn = createPauseBtn;
  protected _createControlsMenu = _createControlsMenu;
  protected mobileControls = mobileControls;
  protected _createPauseMenu = _createPauseMenu;
  protected _loadSounds = _loadSounds;

  constructor(
    scene: Scene,
    sceneManagement: SceneManagement,
    gamePaused: boolean
  ) {
    this._scene = scene;
    this._sceneManagement = sceneManagement;
    this._gamePaused = gamePaused;

    this.ui._playerUI = AdvancedDynamicTexture.CreateFullscreenUI(
      'UI',
      true,
      this._scene
    );
    this.ui._playerUI.idealHeight = 1000;
    this.ui._playerUI.renderAtIdealSize = true;

    this.createTopStackPanel();
    this.createSpeedBlock();

    // this.createPauseBtn();
    // this._createControlsMenu();
    // this.mobileControls();
    // this._createPauseMenu();

    this._loadSounds();
  }
}
