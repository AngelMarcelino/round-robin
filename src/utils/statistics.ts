export function average(array: number[]) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum / array.length;
}

export function standardDeviation(array: number[]) {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b, 0) / n;
  return Math.sqrt(
    array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / n
  );
}
