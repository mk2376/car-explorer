// Returns current time
// (and, if provided, prints the event's name)
export const now = () => {
  return new Date().getTime();
};

// Returns time elapsed since `beginning`
// (and, optionally, prints the duration in seconds)
export const elapsed = (beginning: number) => {
  const duration = new Date().getTime() - beginning;
  const durationString = '  ' + (duration / 1000).toFixed(2).padStart(5);
  return durationString;
};
