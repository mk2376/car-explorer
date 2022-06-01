// Returns current time
// (and, if provided, prints the event's name)
export const now = () => {
  return new Date().getTime();
};

// Returns time elapsed since `beginning`
// (and, optionally, prints the duration in seconds)
export const elapsed = (beginning: number) => {
  const duration = new Date().getTime() - beginning;
  const durationString = '  ' + (duration / 1000).toFixed(2).padStart(3);

  return durationString;
};

// Function that waits for function or value to be true
export function until(conditionFunction: () => boolean) {
  const poll = (resolve: (value: unknown) => void) => {
    if (conditionFunction()) resolve(undefined);
    else setTimeout((_) => poll(resolve), 120);
  };

  return new Promise(poll);
}
