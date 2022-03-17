import { EnvironmentAdventure } from '../environment/environmentAdventure';

export function _adventureWorldTask(
  this: EnvironmentAdventure,
  containerName: string
): void {
  const temp = this._assetsManager.addContainerTask(
    containerName,
    '',
    './CarExplorer/models/adventureWorld/',
    'adventureWorld.babylon'
  );

  temp.onSuccess = (task) => {
    const container = task.loadedContainer;

    this._containers[containerName] = container;
  };
}
