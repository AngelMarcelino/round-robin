/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/models/process.ts":
/*!*******************************!*\
  !*** ./src/models/process.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getShortestRemainingWorkProcessOfTheProcessList = exports.ProcessState = void 0;
var ProcessState;
(function (ProcessState) {
    ProcessState["COMPLETED"] = "completed";
    ProcessState["RUNNING"] = "running";
    ProcessState["WAITING"] = "waiting";
    ProcessState["BLOCKED"] = "blocked";
})(ProcessState = exports.ProcessState || (exports.ProcessState = {}));
function getShortestRemainingWorkProcessOfTheProcessList(processList) {
    let indexOfShortest = 0;
    for (let i = 1; i < processList.length; i++) {
        if (processList[i].remainingWork < processList[indexOfShortest].remainingWork) {
            indexOfShortest = i;
        }
    }
    return indexOfShortest;
}
exports.getShortestRemainingWorkProcessOfTheProcessList = getShortestRemainingWorkProcessOfTheProcessList;


/***/ }),

/***/ "./src/ui/process-renderization.ts":
/*!*****************************************!*\
  !*** ./src/ui/process-renderization.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updateProcess = exports.renderProcess = void 0;
const process_1 = __webpack_require__(/*! ../models/process */ "./src/models/process.ts");
const stateColor = {
    [process_1.ProcessState.COMPLETED]: "tomato",
    [process_1.ProcessState.RUNNING]: "red",
    [process_1.ProcessState.WAITING]: "aqua",
    [process_1.ProcessState.BLOCKED]: "limegreen",
};
function innerContainerStyles(totalWork, remainingWork, state) {
    return `
  position: absolute;
  top: ${(totalWork - remainingWork) * 25}px;
  border: 1px solid #000;
  background-color: ${stateColor[state]};
  bottom: 0;
  left: 0;
  right: 0;
  `;
}
function labelStyle() {
    return `
  position: absolute;
  top: -25px;
  left: 0;
  right: 0;
  `;
}
function outterContainerStyles(totalWork) {
    return `
    width: 100px;
    height: ${totalWork * 25}px;
    border: 1px solid #000;
    position: relative;
  `;
}
function renderProcess(process) {
    let outterContainer = document.createElement("div");
    outterContainer.className = "process";
    let innerContainer = document.createElement("div");
    innerContainer.className = "inner-process";
    let label = document.createElement("div");
    label.innerText = process.processName;
    outterContainer.appendChild(innerContainer);
    outterContainer.appendChild(label);
    updateProcess(process, outterContainer);
    return outterContainer;
}
exports.renderProcess = renderProcess;
function updateProcess(process, outterContainer) {
    outterContainer.setAttribute("style", outterContainerStyles(process.totalWork));
    let label = outterContainer.lastChild;
    label.setAttribute("style", labelStyle());
    let innerContainer = outterContainer.firstChild;
    innerContainer.setAttribute("style", innerContainerStyles(process.totalWork, process.remainingWork, process.state));
}
exports.updateProcess = updateProcess;


/***/ }),

/***/ "./src/utils/statistics.ts":
/*!*********************************!*\
  !*** ./src/utils/statistics.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.standardDeviation = exports.average = void 0;
function average(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return sum / array.length;
}
exports.average = average;
function standardDeviation(array) {
    const n = array.length;
    const mean = array.reduce((a, b) => a + b, 0) / n;
    return Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / n);
}
exports.standardDeviation = standardDeviation;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const process_1 = __webpack_require__(/*! ./models/process */ "./src/models/process.ts");
const process_renderization_1 = __webpack_require__(/*! ./ui/process-renderization */ "./src/ui/process-renderization.ts");
const statistics_1 = __webpack_require__(/*! ./utils/statistics */ "./src/utils/statistics.ts");
const startBtn = document.getElementById("startBtnId");
const processContainer = document.getElementById("process-container");
let resMin = document.getElementById("res-min");
let resMed = document.getElementById("res-med");
let resMax = document.getElementById("res-max");
let resSd = document.getElementById("res-sd");
function updateHtmlStats(cpuIdle, cpuBusy) {
    document.getElementById("cpu-total").innerHTML = (cpuBusy + cpuIdle).toString();
    document.getElementById("cpu-idle").innerHTML = cpuIdle.toString();
    document.getElementById("cpu-busy").innerHTML = cpuBusy.toString();
}
startBtn.addEventListener("click", () => {
    start();
});
function createNewProcess(workAmount, name) {
    return {
        processName: name,
        totalWork: workAmount,
        remainingWork: workAmount,
        state: process_1.ProcessState.WAITING,
        timeElapsed: 0,
        timeStamp: new Date().getTime(),
    };
}
function calculateNextElement(currentElement, processListSize) {
    let aux = currentElement + 1;
    let result = aux % processListSize;
    return result;
}
let processList = [];
let waitingTime = [];
let intervalAddProcess;
let intervalProcess;
let processNumber = 0;
const processLimit = 6;
const minWorkAmount = 3;
const maxWorkAmount = 10;
function clear() {
    processList = [];
    waitingTime = [];
    clearInterval(intervalAddProcess);
    clearInterval(intervalProcess);
    processContainer.innerHTML = "";
}
function isFirstTimeSeen(process) {
    return process.totalWork == process.remainingWork;
}
function start() {
    clear();
    intervalAddProcess = setInterval(() => {
        let process = createNewProcess(Math.floor(Math.random() * (maxWorkAmount - minWorkAmount + 1) + minWorkAmount), `P${processNumber++}`);
        let processDom = process_renderization_1.renderProcess(process);
        processList.push({
            process: process,
            processDom: processDom,
        });
        processContainer.appendChild(processDom);
        let indexOfMinProcess = process_1.getShortestRemainingWorkProcessOfTheProcessList(processList.map(e => e.process));
        currentProcess = indexOfMinProcess;
        if (processList.length == 20) {
            clearInterval(intervalAddProcess);
        }
    }, 1000);
    let currentProcess = 0;
    let cpuIdle = 0;
    let cpuBusy = 0;
    intervalProcess = setInterval(() => {
        let current = processList[currentProcess];
        updateStatistics();
        if (current.process.state == process_1.ProcessState.COMPLETED) {
            cpuIdle++;
            updateHtmlStats(cpuIdle, cpuBusy);
            currentProcess = process_1.getShortestRemainingWorkProcessOfTheProcessList(processList.map(e => e.process));
            return;
        }
        else {
            cpuBusy++;
            updateHtmlStats(cpuIdle, cpuBusy);
            current.process.state = process_1.ProcessState.RUNNING;
        }
        if (isFirstTimeSeen(current.process)) {
            waitingTime.push(new Date().getTime() - current.process.timeStamp);
        }
        current.process.remainingWork--;
        if (current.process.remainingWork <= 0) {
            current.process.state = process_1.ProcessState.COMPLETED;
            deleteProcess(processList, currentProcess);
            currentProcess = process_1.getShortestRemainingWorkProcessOfTheProcessList(processList.map(e => e.process));
        }
        process_renderization_1.updateProcess(current.process, current.processDom);
        console.log([...processList]);
    }, 500);
}
function deleteProcess(processes, index) {
    const toDelete = processes[index];
    toDelete.processDom.remove();
    processList.splice(index, 1);
}
function updateStatistics() {
    resMin.innerHTML = "" + (Math.min(...waitingTime) || '0');
    resMed.innerHTML = "" + (Math.round(statistics_1.average(waitingTime)) || '0');
    resMax.innerHTML = "" + (Math.max(...waitingTime) || '0');
    resSd.innerHTML = "" + (Math.round(statistics_1.standardDeviation(waitingTime)) || '0');
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcmFjdGljYTIvLi9zcmMvbW9kZWxzL3Byb2Nlc3MudHMiLCJ3ZWJwYWNrOi8vcHJhY3RpY2EyLy4vc3JjL3VpL3Byb2Nlc3MtcmVuZGVyaXphdGlvbi50cyIsIndlYnBhY2s6Ly9wcmFjdGljYTIvLi9zcmMvdXRpbHMvc3RhdGlzdGljcy50cyIsIndlYnBhY2s6Ly9wcmFjdGljYTIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcHJhY3RpY2EyLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFZLFlBS1g7QUFMRCxXQUFZLFlBQVk7SUFDdEIsdUNBQXVCO0lBQ3ZCLG1DQUFtQjtJQUNuQixtQ0FBbUI7SUFDbkIsbUNBQW1CO0FBQ3JCLENBQUMsRUFMVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUt2QjtBQVdELFNBQWdCLCtDQUErQyxDQUFFLFdBQXNCO0lBQ3JGLElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQztJQUN4QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMzQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLEdBQUcsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDLGFBQWEsRUFBRTtZQUM3RSxlQUFlLEdBQUcsQ0FBQyxDQUFDO1NBQ3JCO0tBQ0Y7SUFDRCxPQUFPLGVBQWUsQ0FBQztBQUN6QixDQUFDO0FBUkQsMEdBUUM7Ozs7Ozs7Ozs7Ozs7O0FDeEJELDBGQUEwRDtBQUUxRCxNQUFNLFVBQVUsR0FBRztJQUNqQixDQUFDLHNCQUFZLENBQUMsU0FBUyxDQUFDLEVBQUUsUUFBUTtJQUNsQyxDQUFDLHNCQUFZLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSztJQUM3QixDQUFDLHNCQUFZLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTTtJQUM5QixD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bkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNoQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDVixDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsU0FBZ0MsRUFBRSxLQUFhO0lBQ3BFLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsQyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzdCLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFFRCxTQUFTLGdCQUFnQjtJQUN2QixNQUFNLENBQUMsU0FBUyxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUMxRCxNQUFNLENBQUMsU0FBUyxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ2xFLE1BQU0sQ0FBQyxTQUFTLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQzFELEtBQUssQ0FBQyxTQUFTLEdBQUcsRUFBRSxHQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyw4QkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQzlFLENBQUMiLCJmaWxlIjoibWFpbi1idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZW51bSBQcm9jZXNzU3RhdGUge1xuICBDT01QTEVURUQgPSBcImNvbXBsZXRlZFwiLFxuICBSVU5OSU5HID0gXCJydW5uaW5nXCIsXG4gIFdBSVRJTkcgPSBcIndhaXRpbmdcIixcbiAgQkxPQ0tFRCA9IFwiYmxvY2tlZFwiLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFByb2Nlc3Mge1xuICB0b3RhbFdvcms6IG51bWJlcjtcbiAgcmVtYWluaW5nV29yazogbnVtYmVyO1xuICBwcm9jZXNzTmFtZTogc3RyaW5nO1xuICBzdGF0ZTogUHJvY2Vzc1N0YXRlO1xuICB0aW1lRWxhcHNlZDogbnVtYmVyO1xuICB0aW1lU3RhbXA6IG51bWJlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNob3J0ZXN0UmVtYWluaW5nV29ya1Byb2Nlc3NPZlRoZVByb2Nlc3NMaXN0IChwcm9jZXNzTGlzdDogUHJvY2Vzc1tdKTogbnVtYmVyIHtcbiAgbGV0IGluZGV4T2ZTaG9ydGVzdCA9IDA7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgcHJvY2Vzc0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAocHJvY2Vzc0xpc3RbaV0ucmVtYWluaW5nV29yayA8IHByb2Nlc3NMaXN0W2luZGV4T2ZTaG9ydGVzdF0ucmVtYWluaW5nV29yaykge1xuICAgICAgaW5kZXhPZlNob3J0ZXN0ID0gaTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGluZGV4T2ZTaG9ydGVzdDtcbn0iLCJpbXBvcnQgeyBQcm9jZXNzLCBQcm9jZXNzU3RhdGUgfSBmcm9tIFwiLi4vbW9kZWxzL3Byb2Nlc3NcIjtcblxuY29uc3Qgc3RhdGVDb2xvciA9IHtcbiAgW1Byb2Nlc3NTdGF0ZS5DT01QTEVURURdOiBcInRvbWF0b1wiLFxuICBbUHJvY2Vzc1N0YXRlLlJVTk5JTkddOiBcInJlZFwiLFxuICBbUHJvY2Vzc1N0YXRlLldBSVRJTkddOiBcImFxdWFcIixcbiAgW1Byb2Nlc3NTdGF0ZS5CTE9DS0VEXTogXCJsaW1lZ3JlZW5cIixcbn07XG5cbmZ1bmN0aW9uIGlubmVyQ29udGFpbmVyU3R5bGVzKFxuICB0b3RhbFdvcms6IG51bWJlcixcbiAgcmVtYWluaW5nV29yazogbnVtYmVyLFxuICBzdGF0ZTogUHJvY2Vzc1N0YXRlXG4pIHtcbiAgcmV0dXJuIGBcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6ICR7KHRvdGFsV29yayAtIHJlbWFpbmluZ1dvcmspICogMjV9cHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkICMwMDA7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7c3RhdGVDb2xvcltzdGF0ZV19O1xuICBib3R0b206IDA7XG4gIGxlZnQ6IDA7XG4gIHJpZ2h0OiAwO1xuICBgO1xufVxuXG5mdW5jdGlvbiBsYWJlbFN0eWxlKFxuKSB7XG4gIHJldHVybiBgXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAtMjVweDtcbiAgbGVmdDogMDtcbiAgcmlnaHQ6IDA7XG4gIGA7XG59XG5cbmZ1bmN0aW9uIG91dHRlckNvbnRhaW5lclN0eWxlcyh0b3RhbFdvcms6IG51bWJlcikge1xuICByZXR1cm4gYFxuICAgIHdpZHRoOiAxMDBweDtcbiAgICBoZWlnaHQ6ICR7dG90YWxXb3JrICogMjV9cHg7XG4gICAgYm9yZGVyOiAxcHggc29saWQgIzAwMDtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJQcm9jZXNzKHByb2Nlc3M6IFByb2Nlc3MpIHtcbiAgbGV0IG91dHRlckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIG91dHRlckNvbnRhaW5lci5jbGFzc05hbWUgPSBcInByb2Nlc3NcIjtcbiAgbGV0IGlubmVyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgaW5uZXJDb250YWluZXIuY2xhc3NOYW1lID0gXCJpbm5lci1wcm9jZXNzXCI7XG4gIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGxhYmVsLmlubmVyVGV4dCA9IHByb2Nlc3MucHJvY2Vzc05hbWU7XG4gIG91dHRlckNvbnRhaW5lci5hcHBlbmRDaGlsZChpbm5lckNvbnRhaW5lcik7XG4gIG91dHRlckNvbnRhaW5lci5hcHBlbmRDaGlsZChsYWJlbCk7XG4gIHVwZGF0ZVByb2Nlc3MocHJvY2Vzcywgb3V0dGVyQ29udGFpbmVyKTtcbiAgcmV0dXJuIG91dHRlckNvbnRhaW5lcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVByb2Nlc3MoXG4gIHByb2Nlc3M6IFByb2Nlc3MsXG4gIG91dHRlckNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnRcbikge1xuICBvdXR0ZXJDb250YWluZXIuc2V0QXR0cmlidXRlKFxuICAgIFwic3R5bGVcIixcbiAgICBvdXR0ZXJDb250YWluZXJTdHlsZXMocHJvY2Vzcy50b3RhbFdvcmspXG4gICk7XG4gIGxldCBsYWJlbCA9IG91dHRlckNvbnRhaW5lci5sYXN0Q2hpbGQgYXMgSFRNTERpdkVsZW1lbnQ7XG4gIGxhYmVsLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIGxhYmVsU3R5bGUoKSk7XG4gIGxldCBpbm5lckNvbnRhaW5lciA9IG91dHRlckNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxEaXZFbGVtZW50O1xuICBpbm5lckNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXG4gICAgXCJzdHlsZVwiLFxuICAgIGlubmVyQ29udGFpbmVyU3R5bGVzKFxuICAgICAgcHJvY2Vzcy50b3RhbFdvcmssXG4gICAgICBwcm9jZXNzLnJlbWFpbmluZ1dvcmssXG4gICAgICBwcm9jZXNzLnN0YXRlXG4gICAgKVxuICApO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGF2ZXJhZ2UoYXJyYXk6IG51bWJlcltdKSB7XG4gIGxldCBzdW0gPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgc3VtICs9IGFycmF5W2ldO1xuICB9XG4gIHJldHVybiBzdW0gLyBhcnJheS5sZW5ndGg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFuZGFyZERldmlhdGlvbihhcnJheTogbnVtYmVyW10pIHtcbiAgY29uc3QgbiA9IGFycmF5Lmxlbmd0aDtcbiAgY29uc3QgbWVhbiA9IGFycmF5LnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApIC8gbjtcbiAgcmV0dXJuIE1hdGguc3FydChcbiAgICBhcnJheS5tYXAoKHgpID0+IE1hdGgucG93KHggLSBtZWFuLCAyKSkucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCkgLyBuXG4gICk7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgZ2V0U2hvcnRlc3RSZW1haW5pbmdXb3JrUHJvY2Vzc09mVGhlUHJvY2Vzc0xpc3QsIFByb2Nlc3MsIFByb2Nlc3NTdGF0ZSB9IGZyb20gXCIuL21vZGVscy9wcm9jZXNzXCI7XG5pbXBvcnQgeyByZW5kZXJQcm9jZXNzLCB1cGRhdGVQcm9jZXNzIH0gZnJvbSBcIi4vdWkvcHJvY2Vzcy1yZW5kZXJpemF0aW9uXCI7XG5pbXBvcnQgeyBhdmVyYWdlLCBzdGFuZGFyZERldmlhdGlvbiB9IGZyb20gXCIuL3V0aWxzL3N0YXRpc3RpY3NcIjtcblxuY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXJ0QnRuSWRcIik7XG5jb25zdCBwcm9jZXNzQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcm9jZXNzLWNvbnRhaW5lclwiKTtcblxubGV0IHJlc01pbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzLW1pblwiKTtcbmxldCByZXNNZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlcy1tZWRcIik7XG5sZXQgcmVzTWF4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXMtbWF4XCIpO1xubGV0IHJlc1NkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXMtc2RcIik7XG5cbmZ1bmN0aW9uIHVwZGF0ZUh0bWxTdGF0cyhjcHVJZGxlOiBudW1iZXIsIGNwdUJ1c3k6IG51bWJlcikge1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNwdS10b3RhbFwiKS5pbm5lckhUTUwgPSAoXG4gICAgY3B1QnVzeSArIGNwdUlkbGVcbiAgKS50b1N0cmluZygpO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNwdS1pZGxlXCIpLmlubmVySFRNTCA9IGNwdUlkbGUudG9TdHJpbmcoKTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcHUtYnVzeVwiKS5pbm5lckhUTUwgPSBjcHVCdXN5LnRvU3RyaW5nKCk7XG59XG5cbnN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIHN0YXJ0KCk7XG59KTtcblxuZnVuY3Rpb24gY3JlYXRlTmV3UHJvY2Vzcyh3b3JrQW1vdW50OiBudW1iZXIsIG5hbWU6IHN0cmluZyk6IFByb2Nlc3Mge1xuICByZXR1cm4ge1xuICAgIHByb2Nlc3NOYW1lOiBuYW1lLFxuICAgIHRvdGFsV29yazogd29ya0Ftb3VudCxcbiAgICByZW1haW5pbmdXb3JrOiB3b3JrQW1vdW50LFxuICAgIHN0YXRlOiBQcm9jZXNzU3RhdGUuV0FJVElORyxcbiAgICB0aW1lRWxhcHNlZDogMCxcbiAgICB0aW1lU3RhbXA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICB9O1xufVxuaW50ZXJmYWNlIFByb2Nlc3NRdWV1ZUVsZW1lbnQge1xuICBwcm9jZXNzOiBQcm9jZXNzO1xuICBwcm9jZXNzRG9tOiBIVE1MRGl2RWxlbWVudDtcbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlTmV4dEVsZW1lbnQoY3VycmVudEVsZW1lbnQ6IG51bWJlciwgcHJvY2Vzc0xpc3RTaXplOiBudW1iZXIpIHtcbiAgbGV0IGF1eCA9IGN1cnJlbnRFbGVtZW50ICsgMTtcbiAgbGV0IHJlc3VsdCA9IGF1eCAlIHByb2Nlc3NMaXN0U2l6ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubGV0IHByb2Nlc3NMaXN0OiBQcm9jZXNzUXVldWVFbGVtZW50W10gPSBbXTtcbmxldCB3YWl0aW5nVGltZTogbnVtYmVyW10gPSBbXTtcbmxldCBpbnRlcnZhbEFkZFByb2Nlc3M6IGFueTtcbmxldCBpbnRlcnZhbFByb2Nlc3M6IGFueTtcbmxldCBwcm9jZXNzTnVtYmVyID0gMDtcbmNvbnN0IHByb2Nlc3NMaW1pdCA9IDY7XG5cbmNvbnN0IG1pbldvcmtBbW91bnQgPSAzO1xuY29uc3QgbWF4V29ya0Ftb3VudCA9IDEwO1xuXG5mdW5jdGlvbiBjbGVhcigpIHtcbiAgcHJvY2Vzc0xpc3QgPSBbXTtcbiAgd2FpdGluZ1RpbWUgPSBbXTtcbiAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbEFkZFByb2Nlc3MpO1xuICBjbGVhckludGVydmFsKGludGVydmFsUHJvY2Vzcyk7XG4gIHByb2Nlc3NDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcbn1cblxuZnVuY3Rpb24gaXNGaXJzdFRpbWVTZWVuKHByb2Nlc3M6IFByb2Nlc3MpIHtcbiAgcmV0dXJuIHByb2Nlc3MudG90YWxXb3JrID09IHByb2Nlc3MucmVtYWluaW5nV29yaztcbn1cblxuZnVuY3Rpb24gc3RhcnQoKSB7XG4gIGNsZWFyKCk7XG4gIGludGVydmFsQWRkUHJvY2VzcyA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICBsZXQgcHJvY2VzcyA9IGNyZWF0ZU5ld1Byb2Nlc3MoXG4gICAgICBNYXRoLmZsb29yKFxuICAgICAgICBNYXRoLnJhbmRvbSgpICogKG1heFdvcmtBbW91bnQgLSBtaW5Xb3JrQW1vdW50ICsgMSkgKyBtaW5Xb3JrQW1vdW50XG4gICAgICApLFxuICAgICAgYFAke3Byb2Nlc3NOdW1iZXIrK31gXG4gICAgKTtcbiAgICBsZXQgcHJvY2Vzc0RvbSA9IHJlbmRlclByb2Nlc3MocHJvY2Vzcyk7XG4gICAgcHJvY2Vzc0xpc3QucHVzaCh7XG4gICAgICBwcm9jZXNzOiBwcm9jZXNzLFxuICAgICAgcHJvY2Vzc0RvbTogcHJvY2Vzc0RvbSxcbiAgICB9KTtcbiAgICBwcm9jZXNzQ29udGFpbmVyLmFwcGVuZENoaWxkKHByb2Nlc3NEb20pO1xuICAgIGxldCBpbmRleE9mTWluUHJvY2VzcyA9IGdldFNob3J0ZXN0UmVtYWluaW5nV29ya1Byb2Nlc3NPZlRoZVByb2Nlc3NMaXN0KHByb2Nlc3NMaXN0Lm1hcChlID0+IGUucHJvY2VzcykpO1xuICAgIGN1cnJlbnRQcm9jZXNzID0gaW5kZXhPZk1pblByb2Nlc3M7XG4gICAgaWYgKHByb2Nlc3NMaXN0Lmxlbmd0aCA9PSAyMCkge1xuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbEFkZFByb2Nlc3MpXG4gICAgfVxuICB9LCAxMDAwKTtcbiAgbGV0IGN1cnJlbnRQcm9jZXNzID0gMDtcblxuICBsZXQgY3B1SWRsZSA9IDA7XG4gIGxldCBjcHVCdXN5ID0gMDtcblxuICBpbnRlcnZhbFByb2Nlc3MgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgbGV0IGN1cnJlbnQgPSBwcm9jZXNzTGlzdFtjdXJyZW50UHJvY2Vzc107XG4gICAgdXBkYXRlU3RhdGlzdGljcygpO1xuICAgIGlmIChjdXJyZW50LnByb2Nlc3Muc3RhdGUgPT0gUHJvY2Vzc1N0YXRlLkNPTVBMRVRFRCkge1xuICAgICAgY3B1SWRsZSsrO1xuICAgICAgdXBkYXRlSHRtbFN0YXRzKGNwdUlkbGUsIGNwdUJ1c3kpO1xuICAgICAgY3VycmVudFByb2Nlc3MgPSBnZXRTaG9ydGVzdFJlbWFpbmluZ1dvcmtQcm9jZXNzT2ZUaGVQcm9jZXNzTGlzdChwcm9jZXNzTGlzdC5tYXAoZSA9PiBlLnByb2Nlc3MpKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgY3B1QnVzeSsrO1xuICAgICAgdXBkYXRlSHRtbFN0YXRzKGNwdUlkbGUsIGNwdUJ1c3kpO1xuICAgICAgY3VycmVudC5wcm9jZXNzLnN0YXRlID0gUHJvY2Vzc1N0YXRlLlJVTk5JTkc7XG4gICAgfVxuICAgIGlmIChpc0ZpcnN0VGltZVNlZW4oY3VycmVudC5wcm9jZXNzKSkge1xuICAgICAgd2FpdGluZ1RpbWUucHVzaChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGN1cnJlbnQucHJvY2Vzcy50aW1lU3RhbXApO1xuICAgIH1cbiAgICBjdXJyZW50LnByb2Nlc3MucmVtYWluaW5nV29yay0tO1xuICAgIGlmIChjdXJyZW50LnByb2Nlc3MucmVtYWluaW5nV29yayA8PSAwKSB7XG4gICAgICBjdXJyZW50LnByb2Nlc3Muc3RhdGUgPSBQcm9jZXNzU3RhdGUuQ09NUExFVEVEO1xuICAgICAgZGVsZXRlUHJvY2Vzcyhwcm9jZXNzTGlzdCwgY3VycmVudFByb2Nlc3MpO1xuICAgICAgY3VycmVudFByb2Nlc3MgPSBnZXRTaG9ydGVzdFJlbWFpbmluZ1dvcmtQcm9jZXNzT2ZUaGVQcm9jZXNzTGlzdChwcm9jZXNzTGlzdC5tYXAoZSA9PiBlLnByb2Nlc3MpKTtcbiAgICB9XG4gICAgdXBkYXRlUHJvY2VzcyhjdXJyZW50LnByb2Nlc3MsIGN1cnJlbnQucHJvY2Vzc0RvbSk7XG4gICAgY29uc29sZS5sb2coWy4uLnByb2Nlc3NMaXN0XSk7XG4gIH0sIDUwMCk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZVByb2Nlc3MocHJvY2Vzc2VzOiBQcm9jZXNzUXVldWVFbGVtZW50W10sIGluZGV4OiBudW1iZXIpIHtcbiAgY29uc3QgdG9EZWxldGUgPSBwcm9jZXNzZXNbaW5kZXhdO1xuICB0b0RlbGV0ZS5wcm9jZXNzRG9tLnJlbW92ZSgpO1xuICBwcm9jZXNzTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVTdGF0aXN0aWNzKCkge1xuICByZXNNaW4uaW5uZXJIVE1MID0gXCJcIiArIChNYXRoLm1pbiguLi53YWl0aW5nVGltZSkgfHwgJzAnKTtcbiAgcmVzTWVkLmlubmVySFRNTCA9IFwiXCIgKyAoTWF0aC5yb3VuZChhdmVyYWdlKHdhaXRpbmdUaW1lKSkgfHwgJzAnKTtcbiAgcmVzTWF4LmlubmVySFRNTCA9IFwiXCIgKyAoTWF0aC5tYXgoLi4ud2FpdGluZ1RpbWUpIHx8ICcwJyk7XG4gIHJlc1NkLmlubmVySFRNTCA9IFwiXCIgKyAgKE1hdGgucm91bmQoc3RhbmRhcmREZXZpYXRpb24od2FpdGluZ1RpbWUpKSB8fCAnMCcpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==