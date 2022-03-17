import {
  AbstractMesh,
  ExecuteCodeAction,
  ActionManager,
  IAction,
} from '@babylonjs/core';

export function actionHelper(
  actionMesh: AbstractMesh,
  meshes: AbstractMesh[] | AbstractMesh,
  execute: (mesh: AbstractMesh, action: IAction) => void
) {
  if (!actionMesh || !meshes) return;

  if (meshes instanceof AbstractMesh) {
    const mesh = meshes;
    const action = actionMesh.actionManager!.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnIntersectionEnterTrigger,
          parameter: mesh,
        },
        () => {
          execute(mesh, action);
        }
      )
    )!;

    return;
  }

  meshes.forEach((mesh) => {
    const action = actionMesh.actionManager!.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnIntersectionEnterTrigger,
          parameter: mesh,
        },
        () => {
          execute(mesh, action);
        }
      )
    )!;
  });
}
