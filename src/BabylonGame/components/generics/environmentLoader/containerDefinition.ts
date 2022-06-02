import { Scene, AssetContainer } from '@babylonjs/core';
import { Lights } from '../Lights/Lights';
import { AssetsLoader } from './assetsLoader';
import AmmoModule from 'ammojs-typed';
import { applyPolicy, Constructor, ContainerData, Scenes } from 'src/BabylonGame/interfaces';

export function _containerDefinition(
  this: AssetsLoader,
  name: string,
  path: string,
  applyPolicy: applyPolicy
): ContainerData {
  // split into pure path and filename
  const pathCopy = String(path);
  const lastIndex = pathCopy.lastIndexOf('/');

  if (lastIndex !== -1)
    throw new Error("_containerDefinition path improperly defined, no '/' present");

  path = pathCopy.slice(0, lastIndex);
  const file = pathCopy.slice(lastIndex + 1);

  return {
    name: name,
    path: path,
    file: file,
    policy: (
      scene: Scene,
      container: AssetContainer,
      lights: Lights,
      AmmoImport: typeof AmmoModule
    ) => {
      applyPolicy(scene, container, lights, AmmoImport);
    },
  };
}

export function _containerDefinitionLights(
  this: AssetsLoader,
  Lights: Constructor<Lights>,
  scene: Scenes
): Lights {
  return new Lights(this._sceneManagement.scenes[scene].scene) as Lights;
}
