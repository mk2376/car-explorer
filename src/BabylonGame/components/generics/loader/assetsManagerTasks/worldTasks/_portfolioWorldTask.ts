import { EnvironmentPortfolio } from '../../environment/environmentPortfolio';

export function _portfolioWorldTask(
  this: EnvironmentPortfolio,
  containerName: string
): void {
  const temp = this._assetsManager.addContainerTask(
    containerName,
    '',
    './CarExplorer/models/portfolioWorld/',
    'portfolioWorld.babylon'
  );

  temp.onSuccess = (task) => {
    const container = task.loadedContainer;

    this._containers[containerName] = container;
  };
}
