import { AssetsLoader } from '../../../assetsLoader';

export function _containerDefinitionPlayer(this: AssetsLoader) {
  return this._containerDefinition(
    'player',
    './CarExplorer/models/shared/player/player.babylon',
    this._applyPolicyPlayer
  );
}
