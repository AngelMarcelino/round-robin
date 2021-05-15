import { Process, ProcessState } from "../models/process";

const stateColor = {
  [ProcessState.COMPLETED]: 'tomato',
  [ProcessState.RUNNING]: 'red',
  [ProcessState.WAITING]: 'aqua',
  [ProcessState.BLOCKED]: 'limegreen',
}

function innerContainerStyles(totalWork: number, remainingWork: number, state: ProcessState) {
  return `
  position: absolute;
  top: ${(totalWork - remainingWork)*10}px;
  border: 1px solid #000;
  background-color: ${stateColor[state]};
  transform: rotate(
  180deg
  );
  bottom: 0;
  left: 0;
  right: 0;
  `;
}

function outterContainerStyles(totalWork: number) {
  return `
    width: 100px;
    height: ${totalWork * 10}px;
    border: 1px solid #000;
    position: relative;
  `;
}

export function renderProcess(process: Process) {
  let outterContainer = document.createElement("div");
  outterContainer.className = "process";
  let innerContainer = document.createElement("div");
  innerContainer.className = "inner-process";
  outterContainer.appendChild(innerContainer);
  updateProcess(process, outterContainer);
  return outterContainer;
}

export function updateProcess(
  process: Process,
  outterContainer: HTMLDivElement
) {
  outterContainer.setAttribute("style", outterContainerStyles(process.totalWork));
  let innerContainer = outterContainer.firstChild as HTMLDivElement;
  innerContainer.setAttribute("style", innerContainerStyles(process.totalWork, process.remainingWork, process.state));
}
