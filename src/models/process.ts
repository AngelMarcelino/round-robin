export enum ProcessState {
  COMPLETED = 'completed',
  RUNNING = 'running',
  WAITING = 'waiting',
  BLOCKED = 'blocked',
}

export interface Process {
  totalWork: number;
  remainingWork: number;
  processName: string;
  state: ProcessState;
}
