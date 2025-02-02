import { Scene, Observable } from '@babylonjs/core';
import { adventureObservers } from 'src/BabylonGame/interfaces';
import { StateManagement } from '../../sceneManagement';
import { createCrystalsBlock, createTimeBlock } from './creators/blocks';
import { _createControlsMenu } from './creators/controlsMenu';
import { _createPauseMenu } from './creators/pauseMenu';
import { _loadSounds } from './creators/sounds';
import { Hud } from './ui';

export class AdventureHud extends Hud {
  protected createCrystalsBlock = createCrystalsBlock;
  protected createTimeBlock = createTimeBlock;

  readonly observers!: adventureObservers;

  constructor(scene: Scene, state: StateManagement, gamePaused: boolean) {
    super(scene, state, gamePaused);

    // Observable

    this.observers.crystal = new Observable();
    this.observers.timer = new Observable();

    this.createCrystalsBlock();
    this.createTimeBlock();
  }
}
