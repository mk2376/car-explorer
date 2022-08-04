import { AssetsLoader } from '../../assetsLoader';

export function _containerDefinitionPortal(this: AssetsLoader) {
  return this._containerDefinition(
    'portal',
    './CarExplorer/models/shared/portal/portal.babylon',
    this._applyPolicyGeneral
  );
}
