import { AssetsLoader } from '../../../assetsLoader';

export function _containerDefinitionPortfolioWorld(this: AssetsLoader) {
  return this._containerDefinition(
    'portfolioWorld',
    './CarExplorer/models/scene/portfolio/portfolioWorld.babylon',
    this._applyPolicyWorld
  );
}
