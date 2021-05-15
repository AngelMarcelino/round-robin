import { Process, ProcessState } from "./models/process";
import { renderProcess, updateProcess } from "./ui/process-renderization";

const startBtn = document.getElementById("startBtnId");
const quantumTimeInput = document.getElementById("quantum-value");
const processContainer = document.getElementById("process-container");

startBtn.addEventListener("click", () => {
  let quantumTime: string = (<HTMLInputElement>quantumTimeInput).value;
  start(+quantumTime);
});

function createNewProcess(time: number, name: string): Process {
  return {
    totalWork: time,
    processName: name,
    remainingWork: time,
    state: ProcessState.WAITING,
  };
}
interface ProcessQueueElement {
  process: Process;
  processDom: HTMLDivElement;
}
function calculateNextElement(
  currentElemenet: number,
  processListSize: number
) {
  let aux = currentElemenet + 1;
  let result = aux % processListSize;
  return result;
}

let processList: ProcessQueueElement[] = [];
let intervalAddProcess: any;
let intervalProcess: any;
const processLimit = 6;
function clear() {
  processList = [];
  clearInterval(intervalAddProcess);
  clearInterval(intervalProcess);
  processContainer.innerHTML = '';
}
function start(quantumTime: number) {
  clear()
  let quantumLimit = quantumTime;
  let processCount = 0;
  intervalAddProcess = setInterval(() => {
    let process = createNewProcess(Math.floor(Math.random() * (25 - 5 + 1) + 5), "hola");
    let processDom = renderProcess(process);
    processList.push({
      process: process,
      processDom: processDom,
    });
    processContainer.appendChild(processDom);
    if (processList.length == processLimit) {
      clearInterval(intervalAddProcess);
    }
  }, 1000);
  let currentProcess = 0;
  let currentDedicatingTime = 0;
  intervalProcess = setInterval(() => {
    let current = processList[currentProcess];
    if (current.process.state == ProcessState.COMPLETED) {
      currentProcess = calculateNextElement(currentProcess, processList.length);
      return;
    } else {
        current.process.state = ProcessState.RUNNING;
    }
    current.process.remainingWork--;
    currentDedicatingTime++;
    if (current.process.remainingWork <= 0) {
      current.process.state = ProcessState.COMPLETED;
      currentProcess = calculateNextElement(currentProcess, processList.length);
      currentDedicatingTime = 0;
    } else if (currentDedicatingTime > quantumLimit) {
      if (processList.length > 1) {
        current.process.state = ProcessState.WAITING;
      }
      currentProcess = calculateNextElement(currentProcess, processList.length);
      currentDedicatingTime = 0;
    } else {
      currentDedicatingTime++;
    }
    updateProcess(current.process, current.processDom);
    console.log([...processList]);
  }, 500);
}
