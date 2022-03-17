import { Effect, PostProcess, Scene } from '@babylonjs/core';
import { Engines, GameSceneEngine, State } from '../interfaces';
import { simpleSceneEngine } from '../simpleScenes/simpleSceneEngine';
import { GameEngine } from './generics/GameEngine/GameEngine';

// mapper for scene names and state codes
const ScenesWithStates: { key: number; state: string; scene: string }[] = [
  { key: 0, state: 'START', scene: 'startScene' },
  { key: 1, state: 'PORTFOLIO', scene: 'portfolioScene' },
  { key: 2, state: 'CUTSCENE', scene: 'cutScene' },
  { key: 3, state: 'ADVENTURE', scene: 'adventureScene' },
  { key: 4, state: 'LOSE', scene: 'loseScene' },
  { key: 5, state: 'WIN', scene: 'winScene' },
];

export class SceneManagement {
  readonly _State: State = {};
  readonly _scenes: Engines = {};
  readonly _scenesByState: GameSceneEngine[] = [];
  public stateManagement!: StateManagement;

  constructor() {
    // empty
  }

  public importScenes(
    initState: number,
    loadedSceneObjects: GameSceneEngine[]
  ) {
    ScenesWithStates.forEach(({ key, state, scene }) => {
      this._State[state] = key;
    });

    ScenesWithStates.forEach(({ key, state, scene }) => {
      this._scenes[scene] = loadedSceneObjects[key];
      this._scenesByState.push(loadedSceneObjects[key]);
    });

    this.stateManagement = new StateManagement(initState, this._scenesByState);
  }
}

class StateManagement {
  private _curState!: number;
  private _prevState!: number;

  private _scenesByState: GameSceneEngine[] = [];

  constructor(initState: number, scenesByState: GameSceneEngine[]) {
    this._scenesByState = scenesByState;
    shader();
    void this.updateCurState(initState);
  }

  public async updateCurState(newState: number) {
    const wasPrevState = Boolean(this._curState);

    console.log(`stateManagement: updateCurState(${newState})`);

    if (wasPrevState) {
      this._scenesByState[this._curState].scene.detachControl();
      await this.transition(1, 0.02);
      await this._scenesByState[this._curState].onExit();
      this._prevState = this._curState;
    }

    this._curState = newState;
    await this._scenesByState[this._curState].onEnter();
    await this.transition(0, 0.02);
    this._scenesByState[this._curState].scene.attachControl();
  }

  private transition(fadeLevel: number, fadeSpeed: number) {
    // fadeLevel 0 is black and 1 is transparent
    return new Promise((resolve, reject) => {
      const increasing = fadeLevel === 0;

      const postProcess = new PostProcess(
        'Fade',
        'fade',
        ['fadeLevel'],
        null,
        1.0,
        this._scenesByState[this.curState].scene.activeCamera
      );

      postProcess.onApply = (effect) => {
        effect.setFloat('fadeLevel', fadeLevel);
      };

      const timer = setInterval(() => {
        if (increasing) fadeLevel += fadeSpeed;
        else fadeLevel -= fadeSpeed;

        // console.log('fadeLevel', fadeLevel);
        if (increasing ? fadeLevel >= 1 : fadeLevel <= 0) {
          // console.log('faded /////////////////');

          clearInterval(timer);
          postProcess.dispose();
          resolve('');
        }
      }, 16); // changes every 16ms, that is 60Hz
    });
  }

  get curState(): number {
    return this._curState;
  }

  get prevState(): number {
    return this._prevState;
  }
}

function shader() {
  Effect.RegisterShader(
    'fade',
    'precision highp float;' +
      'varying vec2 vUV;' +
      'uniform sampler2D textureSampler; ' +
      'uniform float fadeLevel; ' +
      'void main(void){' +
      'vec4 baseColor = texture2D(textureSampler, vUV) * fadeLevel;' +
      'baseColor.a = 1.0;' +
      'gl_FragColor = baseColor;' +
      '}'
  );
}
