import { Process, ProcessState } from "./models/process";
import { renderProcess, updateProcess } from "./ui/process-renderization";

const startBtn = document.getElementById("startBtnId");
const quantumTimeInput = document.getElementById("quantum-value");
const processContainer = document.getElementById("process-container");

let cpu_total = document.getElementById("cpu-busy").innerHTML;
let cpu_idle = document.getElementById("cpu-busy").innerHTML;
let cpu_busy = document.getElementById("cpu-busy").innerHTML;

function updateHtmlStats(cpuIdle: number, cpuBusy: number) {
  document.getElementById("cpu-total").innerHTML = (
    cpuBusy + cpuIdle
  ).toString();
  document.getElementById("cpu-idle").innerHTML = cpuIdle.toString();
  document.getElementById("cpu-busy").innerHTML = cpuBusy.toString();
}

startBtn.addEventListener("click", () => {
  let quantumTime: string = (<HTMLInputElement>quantumTimeInput).value;
  start(+quantumTime);
});

function createNewProcess(workAmount: number, name: string): Process {
  return {
    totalWork: workAmount,
    processName: name,
    remainingWork: workAmount,
    state: ProcessState.WAITING,
    timeElapsed: 0,
  };
}
interface ProcessQueueElement {
  process: Process;
  processDom: HTMLDivElement;
}

function calculateNextElement(currentElement: number, processListSize: number) {
  let aux = currentElement + 1;
  let result = aux % processListSize;
  return result;
}

let processList: ProcessQueueElement[] = [];
let intervalAddProcess: any;
let intervalProcess: any;
const processLimit = 6;

const minWorkAmount = 3;
const maxWorkAmount = 10;

function clear() {
  processList = [];
  clearInterval(intervalAddProcess);
  clearInterval(intervalProcess);
  processContainer.innerHTML = "";
}

function start(quantumTime: number) {
  clear();
  let quantumLimit = quantumTime;
  let processCount = 0;
  intervalAddProcess = setInterval(() => {
    let process = createNewProcess(
      Math.floor(
        Math.random() * (maxWorkAmount - minWorkAmount + 1) + minWorkAmount
      ),
      "proceso"
    );
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

  let cpuIdle = 0;
  let cpuBusy = 0;

  intervalProcess = setInterval(() => {
    let current = processList[currentProcess];
    if (current.process.state == ProcessState.COMPLETED) {
      cpuIdle++;
      updateHtmlStats(cpuIdle, cpuBusy);
      currentProcess = calculateNextElement(currentProcess, processList.length);
      return;
    } else {
      cpuBusy++;
      updateHtmlStats(cpuIdle, cpuBusy);
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
