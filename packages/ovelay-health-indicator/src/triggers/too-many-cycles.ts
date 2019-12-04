const TIME_WINDOW = 2500;
const MAX_NUM_CYCLES_IN_WINDOW_THRESHOLD = 10;

export function tooManyCycles(cyclesOverTime: Map<number, any /* cycle */>) {
  const timestamps = Array.from(cyclesOverTime.keys());
  const latest = timestamps.slice(-1)[0];
  const timestampsInWindow = timestamps.filter(t => latest - t < TIME_WINDOW);

  if (timestampsInWindow.length > MAX_NUM_CYCLES_IN_WINDOW_THRESHOLD) {
    return true;
  } else { return false; }
}
