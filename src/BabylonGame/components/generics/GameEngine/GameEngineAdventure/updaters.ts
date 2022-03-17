import { GameEngineAdventure } from './GameEngineAdventure';

export function updater(this: GameEngineAdventure): void {
  this._scene.onBeforeRenderObservable.add(() => {
    if (
      this._coinController.collectedAllCoins &&
      this._actionsController.onPlatformAdventure
    ) {
      this._win = true;
    }
  });
}
