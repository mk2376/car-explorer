import { AssetsLoader } from '../../../assetsLoader';

export function _containerDefinitionAdventureWorld(this: AssetsLoader) {
  return this._containerDefinition(
    'adventureWorld',
    './CarExplorer/models/scene/adventure/adventureWorld.babylon',
    this._applyPolicyGeneral
  );
}
