import { Environment } from '../../environment/environment';

export function _playerTask(this: Environment, containerName: string): void {
  const temp = this._assetsManager.addContainerTask(
    containerName,
    '',
    './CarExplorer/models/player/',
    'player.babylon'
  );

  temp.onSuccess = (task) => {
    const container = task.loadedContainer;

    this._containers[containerName] = container;
  };
}
