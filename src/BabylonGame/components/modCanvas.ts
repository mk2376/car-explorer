//set up the canvas
export function modCanvas(
  canvas: HTMLCanvasElement,
  id: string
): HTMLCanvasElement {
  //Commented out for development
  canvas.style.overflow = 'hidden';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.margin = '0';
  canvas.style.padding = '0';

  canvas.id = id;
  canvas.tabIndex = 1;

  return canvas;
}
