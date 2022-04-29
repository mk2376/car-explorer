import { AdvancedTimer, Scene } from '@babylonjs/core';
import { SceneManagement } from '../../sceneManagement';
import { AdventureHud } from '../ui/adventureUi';
import { Hud } from '../ui/ui';

export class timeController {
  protected _scene: Scene;
  protected _ui: AdventureHud;
  protected _sceneManagement: SceneManagement;
  protected _mainTimer: AdvancedTimer<Scene>;

  // Game Timer
  protected _timeToEnd!: number;
  protected _fullTimeToEnd!: number;

  constructor(
    scene: Scene,
    ui: AdventureHud,
    sceneManagement: SceneManagement
  ) {
    this._scene = scene;
    this._ui = ui;
    this._sceneManagement = sceneManagement;

    this._mainTimer = this.createTimer();
  }

  protected callOnStart(timeToEnd: number) {
    if (!this._timeToEnd) this._timeToEnd = timeToEnd;
    else
      throw Error(
        "Can't start timer, as no this._timeToEnd was defined or timeToEnd provided."
      );

    if (!this._fullTimeToEnd && this._timeToEnd)
      this._fullTimeToEnd = this._timeToEnd;
  }

  public start(timeToEnd: number) {
    this.callOnStart(timeToEnd);

    if (this._timeToEnd) this._mainTimer.start(this._timeToEnd);
    else throw Error("Can't start timer, as no timeToEnd was provided.");
  }

  public stop() {
    this._mainTimer.stop();
  }

  public reset() {
    this._timeToEnd = 0;
    this._fullTimeToEnd = 0;
  }

  public resume() {
    if (this._timeToEnd) this._mainTimer.start(this._timeToEnd);
    else
      throw Error(
        "Can't resume timer, as you haven't started the timer before."
      );
  }

  protected createTimer(): AdvancedTimer<Scene> {
    const advancedTimer: AdvancedTimer<Scene> = new AdvancedTimer({
      timeout: 0,
      contextObservable: this._scene.onBeforeRenderObservable,
    });
    advancedTimer.onEachCountObservable.add((data) => {
      const time =
        this.normalizeTime(this._fullTimeToEnd) -
        this.normalizeTime(data.deltaTime);

      this._ui.observers.timer!.notifyObservers([time]);
    });
    advancedTimer.onTimerAbortedObservable.add((data) => {
      this._timeToEnd = data.deltaTime;
      console.log('Timer aborted/stopped');
    });
    advancedTimer.onTimerEndedObservable.add(() => {
      void this._sceneManagement.state.updateCurState(
        this._sceneManagement._State.LOSE
      );
    });

    return advancedTimer;
  }

  protected normalizeTime(timeToNormalize: number) {
    return Number((timeToNormalize / 1000).toFixed(0));
  }
}
