import { AssetsLoader } from '../assetsLoader';

export function _containerTask(
  this: AssetsLoader,
  containerName: string,
  path: string,
  file: string
): void {
  const task = this._assetsManager.addContainerTask(
    containerName,
    '',
    path,
    file
  );

  task.onSuccess = (task) => {
    this._containers[containerName] = task.loadedContainer;
  };
}
