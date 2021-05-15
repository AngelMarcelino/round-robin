/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/models/process.ts":
/*!*******************************!*\
  !*** ./src/models/process.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProcessState = void 0;
var ProcessState;
(function (ProcessState) {
    ProcessState["COMPLETED"] = "completed";
    ProcessState["RUNNING"] = "running";
    ProcessState["WAITING"] = "waiting";
    ProcessState["BLOCKED"] = "blocked";
})(ProcessState = exports.ProcessState || (exports.ProcessState = {}));


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
  transform: rotate(
  180deg
  );
  bottom: 0;
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
    outterContainer.appendChild(innerContainer);
    updateProcess(process, outterContainer);
    return outterContainer;
}
exports.renderProcess = renderProcess;
function updateProcess(process, outterContainer) {
    outterContainer.setAttribute("style", outterContainerStyles(process.totalWork));
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
const quantumTimeInput = document.getElementById("quantum-value");
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
    let quantumTime = quantumTimeInput.value;
    start(+quantumTime);
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
const processLimit = 6;
const minWorkAmount = 3;
const maxWorkAmount = 10;
function clear() {
    processList = [];
    clearInterval(intervalAddProcess);
    clearInterval(intervalProcess);
    processContainer.innerHTML = "";
}
function isFirstTimeSeen(process) {
    return process.totalWork == process.remainingWork;
}
function start(quantumTime) {
    clear();
    let quantumLimit = quantumTime;
    let processCount = 0;
    intervalAddProcess = setInterval(() => {
        let process = createNewProcess(Math.floor(Math.random() * (maxWorkAmount - minWorkAmount + 1) + minWorkAmount), "proceso");
        let processDom = process_renderization_1.renderProcess(process);
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
        updateStatistics();
        if (current.process.state == process_1.ProcessState.COMPLETED) {
            cpuIdle++;
            updateHtmlStats(cpuIdle, cpuBusy);
            currentProcess = calculateNextElement(currentProcess, processList.length);
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
        currentDedicatingTime++;
        if (current.process.remainingWork <= 0) {
            current.process.state = process_1.ProcessState.COMPLETED;
            currentProcess = calculateNextElement(currentProcess, processList.length);
            currentDedicatingTime = 0;
        }
        else if (currentDedicatingTime > quantumLimit) {
            if (processList.length > 1) {
                current.process.state = process_1.ProcessState.WAITING;
            }
            currentProcess = calculateNextElement(currentProcess, processList.length);
            currentDedicatingTime = 0;
        }
        else {
            currentDedicatingTime++;
        }
        process_renderization_1.updateProcess(current.process, current.processDom);
        console.log([...processList]);
    }, 500);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcmFjdGljYTIvLi9zcmMvbW9kZWxzL3Byb2Nlc3MudHMiLCJ3ZWJwYWNrOi8vcHJhY3RpY2EyLy4vc3JjL3VpL3Byb2Nlc3MtcmVuZGVyaXphdGlvbi50cyIsIndlYnBhY2s6Ly9wcmFjdGljYTIvLi9zcmMvdXRpbHMvc3RhdGlzdGljcy50cyIsIndlYnBhY2s6Ly9wcmFjdGljYTIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcHJhY3RpY2EyLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFZLFlBS1g7QUFMRCxXQUFZLFlBQVk7SUFDdEIsdUNBQXVCO0lBQ3ZCLG1DQUFtQjtJQUNuQixtQ0FBbUI7SUFDbkIsbUNBQW1CO0FBQ3JCLENBQUMsRUFMVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUt2Qjs7Ozs7Ozs7Ozs7Ozs7QUNMRCwwRkFBMEQ7QUFFMUQsTUFBTSxVQUFVLEdBQUc7SUFDakIsQ0FBQyxzQkFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFFBQVE7SUFDbEMsQ0FBQyxzQkFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUs7SUFDN0IsQ0FBQyxzQkFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU07SUFDOUIsQ0FBQyxzQkFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLFdBQVc7Q0FDcEMsQ0FBQztBQUVGLFNBQVMsb0JBQW9CLENBQzNCLFNBQWlCLEVBQ2pCLGFBQXFCLEVBQ3JCLEtBQW1CO0lBRW5CLE9BQU87O1NBRUEsQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDLEdBQUcsRUFBRTs7c0JBRW5CLFVBQVUsQ0FBQyxLQUFLLENBQUM7Ozs7Ozs7R0FPcEMsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFTLHFCQUFxQixDQUFDLFNBQWlCO0lBQzlDLE9BQU87O2NBRUssU0FBUyxHQUFHLEVBQUU7OztHQUd6QixDQUFDO0FBQ0osQ0FBQztBQUVELFNBQWdCLGFB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Q0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUMxRCxLQUFLLENBQUMsU0FBUyxHQUFHLEVBQUUsR0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsOEJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUM5RSxDQUFDIiwiZmlsZSI6Im1haW4tYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGVudW0gUHJvY2Vzc1N0YXRlIHtcbiAgQ09NUExFVEVEID0gXCJjb21wbGV0ZWRcIixcbiAgUlVOTklORyA9IFwicnVubmluZ1wiLFxuICBXQUlUSU5HID0gXCJ3YWl0aW5nXCIsXG4gIEJMT0NLRUQgPSBcImJsb2NrZWRcIixcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQcm9jZXNzIHtcbiAgdG90YWxXb3JrOiBudW1iZXI7XG4gIHJlbWFpbmluZ1dvcms6IG51bWJlcjtcbiAgcHJvY2Vzc05hbWU6IHN0cmluZztcbiAgc3RhdGU6IFByb2Nlc3NTdGF0ZTtcbiAgdGltZUVsYXBzZWQ6IG51bWJlcjtcbiAgdGltZVN0YW1wOiBudW1iZXI7XG59XG4iLCJpbXBvcnQgeyBQcm9jZXNzLCBQcm9jZXNzU3RhdGUgfSBmcm9tIFwiLi4vbW9kZWxzL3Byb2Nlc3NcIjtcblxuY29uc3Qgc3RhdGVDb2xvciA9IHtcbiAgW1Byb2Nlc3NTdGF0ZS5DT01QTEVURURdOiBcInRvbWF0b1wiLFxuICBbUHJvY2Vzc1N0YXRlLlJVTk5JTkddOiBcInJlZFwiLFxuICBbUHJvY2Vzc1N0YXRlLldBSVRJTkddOiBcImFxdWFcIixcbiAgW1Byb2Nlc3NTdGF0ZS5CTE9DS0VEXTogXCJsaW1lZ3JlZW5cIixcbn07XG5cbmZ1bmN0aW9uIGlubmVyQ29udGFpbmVyU3R5bGVzKFxuICB0b3RhbFdvcms6IG51bWJlcixcbiAgcmVtYWluaW5nV29yazogbnVtYmVyLFxuICBzdGF0ZTogUHJvY2Vzc1N0YXRlXG4pIHtcbiAgcmV0dXJuIGBcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6ICR7KHRvdGFsV29yayAtIHJlbWFpbmluZ1dvcmspICogMjV9cHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkICMwMDA7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7c3RhdGVDb2xvcltzdGF0ZV19O1xuICB0cmFuc2Zvcm06IHJvdGF0ZShcbiAgMTgwZGVnXG4gICk7XG4gIGJvdHRvbTogMDtcbiAgbGVmdDogMDtcbiAgcmlnaHQ6IDA7XG4gIGA7XG59XG5cbmZ1bmN0aW9uIG91dHRlckNvbnRhaW5lclN0eWxlcyh0b3RhbFdvcms6IG51bWJlcikge1xuICByZXR1cm4gYFxuICAgIHdpZHRoOiAxMDBweDtcbiAgICBoZWlnaHQ6ICR7dG90YWxXb3JrICogMjV9cHg7XG4gICAgYm9yZGVyOiAxcHggc29saWQgIzAwMDtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJQcm9jZXNzKHByb2Nlc3M6IFByb2Nlc3MpIHtcbiAgbGV0IG91dHRlckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIG91dHRlckNvbnRhaW5lci5jbGFzc05hbWUgPSBcInByb2Nlc3NcIjtcbiAgbGV0IGlubmVyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgaW5uZXJDb250YWluZXIuY2xhc3NOYW1lID0gXCJpbm5lci1wcm9jZXNzXCI7XG4gIG91dHRlckNvbnRhaW5lci5hcHBlbmRDaGlsZChpbm5lckNvbnRhaW5lcik7XG4gIHVwZGF0ZVByb2Nlc3MocHJvY2Vzcywgb3V0dGVyQ29udGFpbmVyKTtcbiAgcmV0dXJuIG91dHRlckNvbnRhaW5lcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVByb2Nlc3MoXG4gIHByb2Nlc3M6IFByb2Nlc3MsXG4gIG91dHRlckNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnRcbikge1xuICBvdXR0ZXJDb250YWluZXIuc2V0QXR0cmlidXRlKFxuICAgIFwic3R5bGVcIixcbiAgICBvdXR0ZXJDb250YWluZXJTdHlsZXMocHJvY2Vzcy50b3RhbFdvcmspXG4gICk7XG4gIGxldCBpbm5lckNvbnRhaW5lciA9IG91dHRlckNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxEaXZFbGVtZW50O1xuICBpbm5lckNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXG4gICAgXCJzdHlsZVwiLFxuICAgIGlubmVyQ29udGFpbmVyU3R5bGVzKFxuICAgICAgcHJvY2Vzcy50b3RhbFdvcmssXG4gICAgICBwcm9jZXNzLnJlbWFpbmluZ1dvcmssXG4gICAgICBwcm9jZXNzLnN0YXRlXG4gICAgKVxuICApO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGF2ZXJhZ2UoYXJyYXk6IG51bWJlcltdKSB7XHJcbiAgbGV0IHN1bSA9IDA7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgc3VtICs9IGFycmF5W2ldO1xyXG4gIH1cclxuICByZXR1cm4gc3VtIC8gYXJyYXkubGVuZ3RoO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RhbmRhcmREZXZpYXRpb24oYXJyYXk6IG51bWJlcltdKSB7XHJcbiAgY29uc3QgbiA9IGFycmF5Lmxlbmd0aDtcclxuICBjb25zdCBtZWFuID0gYXJyYXkucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCkgLyBuO1xyXG4gIHJldHVybiBNYXRoLnNxcnQoXHJcbiAgICBhcnJheS5tYXAoKHgpID0+IE1hdGgucG93KHggLSBtZWFuLCAyKSkucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCkgLyBuXHJcbiAgKTtcclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgUHJvY2VzcywgUHJvY2Vzc1N0YXRlIH0gZnJvbSBcIi4vbW9kZWxzL3Byb2Nlc3NcIjtcbmltcG9ydCB7IHJlbmRlclByb2Nlc3MsIHVwZGF0ZVByb2Nlc3MgfSBmcm9tIFwiLi91aS9wcm9jZXNzLXJlbmRlcml6YXRpb25cIjtcbmltcG9ydCB7IGF2ZXJhZ2UsIHN0YW5kYXJkRGV2aWF0aW9uIH0gZnJvbSBcIi4vdXRpbHMvc3RhdGlzdGljc1wiO1xuXG5jb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RhcnRCdG5JZFwiKTtcbmNvbnN0IHF1YW50dW1UaW1lSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInF1YW50dW0tdmFsdWVcIik7XG5jb25zdCBwcm9jZXNzQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcm9jZXNzLWNvbnRhaW5lclwiKTtcblxubGV0IHJlc01pbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzLW1pblwiKTtcbmxldCByZXNNZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlcy1tZWRcIik7XG5sZXQgcmVzTWF4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXMtbWF4XCIpO1xubGV0IHJlc1NkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXMtc2RcIik7XG5cbmZ1bmN0aW9uIHVwZGF0ZUh0bWxTdGF0cyhjcHVJZGxlOiBudW1iZXIsIGNwdUJ1c3k6IG51bWJlcikge1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNwdS10b3RhbFwiKS5pbm5lckhUTUwgPSAoXG4gICAgY3B1QnVzeSArIGNwdUlkbGVcbiAgKS50b1N0cmluZygpO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNwdS1pZGxlXCIpLmlubmVySFRNTCA9IGNwdUlkbGUudG9TdHJpbmcoKTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcHUtYnVzeVwiKS5pbm5lckhUTUwgPSBjcHVCdXN5LnRvU3RyaW5nKCk7XG59XG5cbnN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIGxldCBxdWFudHVtVGltZTogc3RyaW5nID0gKDxIVE1MSW5wdXRFbGVtZW50PnF1YW50dW1UaW1lSW5wdXQpLnZhbHVlO1xuICBzdGFydCgrcXVhbnR1bVRpbWUpO1xufSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZU5ld1Byb2Nlc3Mod29ya0Ftb3VudDogbnVtYmVyLCBuYW1lOiBzdHJpbmcpOiBQcm9jZXNzIHtcbiAgcmV0dXJuIHtcbiAgICBwcm9jZXNzTmFtZTogbmFtZSxcbiAgICB0b3RhbFdvcms6IHdvcmtBbW91bnQsXG4gICAgcmVtYWluaW5nV29yazogd29ya0Ftb3VudCxcbiAgICBzdGF0ZTogUHJvY2Vzc1N0YXRlLldBSVRJTkcsXG4gICAgdGltZUVsYXBzZWQ6IDAsXG4gICAgdGltZVN0YW1wOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgfTtcbn1cbmludGVyZmFjZSBQcm9jZXNzUXVldWVFbGVtZW50IHtcbiAgcHJvY2VzczogUHJvY2VzcztcbiAgcHJvY2Vzc0RvbTogSFRNTERpdkVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZU5leHRFbGVtZW50KGN1cnJlbnRFbGVtZW50OiBudW1iZXIsIHByb2Nlc3NMaXN0U2l6ZTogbnVtYmVyKSB7XG4gIGxldCBhdXggPSBjdXJyZW50RWxlbWVudCArIDE7XG4gIGxldCByZXN1bHQgPSBhdXggJSBwcm9jZXNzTGlzdFNpemU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmxldCBwcm9jZXNzTGlzdDogUHJvY2Vzc1F1ZXVlRWxlbWVudFtdID0gW107XG5sZXQgd2FpdGluZ1RpbWU6IG51bWJlcltdID0gW107XG5sZXQgaW50ZXJ2YWxBZGRQcm9jZXNzOiBhbnk7XG5sZXQgaW50ZXJ2YWxQcm9jZXNzOiBhbnk7XG5jb25zdCBwcm9jZXNzTGltaXQgPSA2O1xuXG5jb25zdCBtaW5Xb3JrQW1vdW50ID0gMztcbmNvbnN0IG1heFdvcmtBbW91bnQgPSAxMDtcblxuZnVuY3Rpb24gY2xlYXIoKSB7XG4gIHByb2Nlc3NMaXN0ID0gW107XG4gIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxBZGRQcm9jZXNzKTtcbiAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbFByb2Nlc3MpO1xuICBwcm9jZXNzQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG59XG5cbmZ1bmN0aW9uIGlzRmlyc3RUaW1lU2Vlbihwcm9jZXNzOiBQcm9jZXNzKSB7XG4gIHJldHVybiBwcm9jZXNzLnRvdGFsV29yayA9PSBwcm9jZXNzLnJlbWFpbmluZ1dvcms7XG59XG5cbmZ1bmN0aW9uIHN0YXJ0KHF1YW50dW1UaW1lOiBudW1iZXIpIHtcbiAgY2xlYXIoKTtcbiAgbGV0IHF1YW50dW1MaW1pdCA9IHF1YW50dW1UaW1lO1xuICBsZXQgcHJvY2Vzc0NvdW50ID0gMDtcbiAgaW50ZXJ2YWxBZGRQcm9jZXNzID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgIGxldCBwcm9jZXNzID0gY3JlYXRlTmV3UHJvY2VzcyhcbiAgICAgIE1hdGguZmxvb3IoXG4gICAgICAgIE1hdGgucmFuZG9tKCkgKiAobWF4V29ya0Ftb3VudCAtIG1pbldvcmtBbW91bnQgKyAxKSArIG1pbldvcmtBbW91bnRcbiAgICAgICksXG4gICAgICBcInByb2Nlc29cIlxuICAgICk7XG4gICAgbGV0IHByb2Nlc3NEb20gPSByZW5kZXJQcm9jZXNzKHByb2Nlc3MpO1xuICAgIHByb2Nlc3NMaXN0LnB1c2goe1xuICAgICAgcHJvY2VzczogcHJvY2VzcyxcbiAgICAgIHByb2Nlc3NEb206IHByb2Nlc3NEb20sXG4gICAgfSk7XG4gICAgcHJvY2Vzc0NvbnRhaW5lci5hcHBlbmRDaGlsZChwcm9jZXNzRG9tKTtcbiAgICBpZiAocHJvY2Vzc0xpc3QubGVuZ3RoID09IHByb2Nlc3NMaW1pdCkge1xuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbEFkZFByb2Nlc3MpO1xuICAgIH1cbiAgfSwgMTAwMCk7XG4gIGxldCBjdXJyZW50UHJvY2VzcyA9IDA7XG4gIGxldCBjdXJyZW50RGVkaWNhdGluZ1RpbWUgPSAwO1xuXG4gIGxldCBjcHVJZGxlID0gMDtcbiAgbGV0IGNwdUJ1c3kgPSAwO1xuXG4gIGludGVydmFsUHJvY2VzcyA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICBsZXQgY3VycmVudCA9IHByb2Nlc3NMaXN0W2N1cnJlbnRQcm9jZXNzXTtcbiAgICB1cGRhdGVTdGF0aXN0aWNzKCk7XG4gICAgaWYgKGN1cnJlbnQucHJvY2Vzcy5zdGF0ZSA9PSBQcm9jZXNzU3RhdGUuQ09NUExFVEVEKSB7XG4gICAgICBjcHVJZGxlKys7XG4gICAgICB1cGRhdGVIdG1sU3RhdHMoY3B1SWRsZSwgY3B1QnVzeSk7XG4gICAgICBjdXJyZW50UHJvY2VzcyA9IGNhbGN1bGF0ZU5leHRFbGVtZW50KGN1cnJlbnRQcm9jZXNzLCBwcm9jZXNzTGlzdC5sZW5ndGgpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBjcHVCdXN5Kys7XG4gICAgICB1cGRhdGVIdG1sU3RhdHMoY3B1SWRsZSwgY3B1QnVzeSk7XG4gICAgICBjdXJyZW50LnByb2Nlc3Muc3RhdGUgPSBQcm9jZXNzU3RhdGUuUlVOTklORztcbiAgICB9XG4gICAgaWYgKGlzRmlyc3RUaW1lU2VlbihjdXJyZW50LnByb2Nlc3MpKSB7XG4gICAgICB3YWl0aW5nVGltZS5wdXNoKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gY3VycmVudC5wcm9jZXNzLnRpbWVTdGFtcCk7XG4gICAgfVxuICAgIGN1cnJlbnQucHJvY2Vzcy5yZW1haW5pbmdXb3JrLS07XG4gICAgY3VycmVudERlZGljYXRpbmdUaW1lKys7XG4gICAgaWYgKGN1cnJlbnQucHJvY2Vzcy5yZW1haW5pbmdXb3JrIDw9IDApIHtcbiAgICAgIGN1cnJlbnQucHJvY2Vzcy5zdGF0ZSA9IFByb2Nlc3NTdGF0ZS5DT01QTEVURUQ7XG4gICAgICBjdXJyZW50UHJvY2VzcyA9IGNhbGN1bGF0ZU5leHRFbGVtZW50KGN1cnJlbnRQcm9jZXNzLCBwcm9jZXNzTGlzdC5sZW5ndGgpO1xuICAgICAgY3VycmVudERlZGljYXRpbmdUaW1lID0gMDtcbiAgICB9IGVsc2UgaWYgKGN1cnJlbnREZWRpY2F0aW5nVGltZSA+IHF1YW50dW1MaW1pdCkge1xuICAgICAgaWYgKHByb2Nlc3NMaXN0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgY3VycmVudC5wcm9jZXNzLnN0YXRlID0gUHJvY2Vzc1N0YXRlLldBSVRJTkc7XG4gICAgICB9XG4gICAgICBjdXJyZW50UHJvY2VzcyA9IGNhbGN1bGF0ZU5leHRFbGVtZW50KGN1cnJlbnRQcm9jZXNzLCBwcm9jZXNzTGlzdC5sZW5ndGgpO1xuICAgICAgY3VycmVudERlZGljYXRpbmdUaW1lID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudERlZGljYXRpbmdUaW1lKys7XG4gICAgfVxuICAgIHVwZGF0ZVByb2Nlc3MoY3VycmVudC5wcm9jZXNzLCBjdXJyZW50LnByb2Nlc3NEb20pO1xuICAgIGNvbnNvbGUubG9nKFsuLi5wcm9jZXNzTGlzdF0pO1xuICB9LCA1MDApO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVTdGF0aXN0aWNzKCkge1xuICByZXNNaW4uaW5uZXJIVE1MID0gXCJcIiArIChNYXRoLm1pbiguLi53YWl0aW5nVGltZSkgfHwgJzAnKTtcbiAgcmVzTWVkLmlubmVySFRNTCA9IFwiXCIgKyAoTWF0aC5yb3VuZChhdmVyYWdlKHdhaXRpbmdUaW1lKSkgfHwgJzAnKTtcbiAgcmVzTWF4LmlubmVySFRNTCA9IFwiXCIgKyAoTWF0aC5tYXgoLi4ud2FpdGluZ1RpbWUpIHx8ICcwJyk7XG4gIHJlc1NkLmlubmVySFRNTCA9IFwiXCIgKyAgKE1hdGgucm91bmQoc3RhbmRhcmREZXZpYXRpb24od2FpdGluZ1RpbWUpKSB8fCAnMCcpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==