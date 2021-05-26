export enum ProcessState {
  COMPLETED = "completed",
  RUNNING = "running",
  WAITING = "waiting",
  BLOCKED = "blocked",
}

export interface Process {
  totalWork: number;
  remainingWork: number;
  processName: string;
  state: ProcessState;
  timeElapsed: number;
  timeStamp: number;
}

export function getShortestRemainingWorkProcessOfTheProcessList (processList: Process[]): number {
  let indexOfShortest = 0;
  for (let i = 1; i < processList.length; i++) {
    if (processList[i].remainingWork < processList[indexOfShortest].remainingWork) {
      indexOfShortest = i;
    }
  }
  return indexOfShortest;
}