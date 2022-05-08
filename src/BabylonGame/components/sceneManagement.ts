import { Effect, Engine, PostProcess, Scene } from '@babylonjs/core';
import { GameSceneEngine, SceneData, Scenes } from '../interfaces';

export class SceneManagement {
  private _engine: Engine;
  readonly scenes: SceneData[] = [];
  public state!: StateManagement;

  constructor(engine: Engine) {
    this._engine = engine;

    // automatic scene object generator
    const length = Object.keys(Scenes).length / 2;
    this.scenes = new Array(length).fill(null).map(() => ({ scene: new Scene(this._engine) }));

    this.state = new StateManagement(this.scenes);
  }

  public importEngines(loadedEngines: GameSceneEngine[]) {
    loadedEngines.forEach((engine, key) => {
      this.scenes[key as Scenes].engine = engine;
    });
  }
}

export class StateManagement {
  private _curState!: Scenes;
  private _prevState!: Scenes;

  private _scenes: SceneData[];

  constructor(scenes: SceneData[]) {
    this._scenes = scenes;
    registerShader();
  }

  get cur(): Scenes {
    return this._curState;
  }

  get prev(): Scenes {
    return this._prevState;
  }

  public async updateCurState(newState: number) {
    const wasPrevState = Boolean(this._curState);

    console.log(`stateManagement: updateCurState(${newState})`);

    if (wasPrevState) {
      this._scenes[this._curState].scene.detachControl();
      await this.transition(1, 0.02);
      await this._scenes[this._curState].engine!.onExit();
      this._prevState = this._curState;
    }

    this._curState = newState;
    await this._scenes[this._curState].engine!.onEnter();
    await this.transition(0, 0.02);
    this._scenes[this._curState].scene.attachControl();
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
        this._scenes[this._curState].scene.activeCamera
      );

      postProcess.onApply = (effect) => {
        effect.setFloat('fadeLevel', fadeLevel);
      };

      const timer = setInterval(() => {
        if (increasing) fadeLevel += fadeSpeed;
        else fadeLevel -= fadeSpeed;

        if (increasing ? fadeLevel >= 1 : fadeLevel <= 0) {
          clearInterval(timer);
          postProcess.dispose();
          resolve('');
        }
      }, 16); // changes every 16ms, that is 60Hz
    });
  }
}

function registerShader() {
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
