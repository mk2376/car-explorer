import { Engine } from '@babylonjs/core';
import { SceneManagement } from './sceneManagement';

export function events(engine: Engine, sceneManagement: SceneManagement): void {
  //** for development: make inspector visible/invisible
  window.addEventListener('keydown', (ev) => {
    //Shift+Ctrl+Alt+I
    if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'I') {
      console.log('Babylon inspector enabled.');
      const curState = sceneManagement.stateManagement.curState;

      if (
        sceneManagement._scenesByState[curState].scene.debugLayer.isVisible()
      ) {
        sceneManagement._scenesByState[curState].scene.debugLayer.hide();
      } else {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        sceneManagement._scenesByState[curState].scene.debugLayer.show();
      }
    }
  });

  //resize if the screen is resized/rotated
  window.addEventListener('resize', () => {
    engine.resize();
  });
}
