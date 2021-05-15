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
const startBtn = document.getElementById("startBtnId");
const quantumTimeInput = document.getElementById("quantum-value");
const processContainer = document.getElementById("process-container");
let cpu_total = document.getElementById("cpu-busy").innerHTML;
let cpu_idle = document.getElementById("cpu-busy").innerHTML;
let cpu_busy = document.getElementById("cpu-busy").innerHTML;
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
        totalWork: workAmount,
        processName: name,
        remainingWork: workAmount,
        state: process_1.ProcessState.WAITING,
        timeElapsed: 0,
    };
}
function calculateNextElement(currentElement, processListSize) {
    let aux = currentElement + 1;
    let result = aux % processListSize;
    return result;
}
let processList = [];
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcmFjdGljYTIvLi9zcmMvbW9kZWxzL3Byb2Nlc3MudHMiLCJ3ZWJwYWNrOi8vcHJhY3RpY2EyLy4vc3JjL3VpL3Byb2Nlc3MtcmVuZGVyaXphdGlvbi50cyIsIndlYnBhY2s6Ly9wcmFjdGljYTIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcHJhY3RpY2EyLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFZLFlBS1g7QUFMRCxXQUFZLFlBQVk7SUFDdEIsdUNBQXVCO0lBQ3ZCLG1DQUFtQjtJQUNuQixtQ0FBbUI7SUFDbkIsbUNBQW1CO0FBQ3JCLENBQUMsRUFMVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUt2Qjs7Ozs7Ozs7Ozs7Ozs7QUNMRCwwRkFBMEQ7QUFFMUQsTUFBTSxVQUFVLEdBQUc7SUFDakIsQ0FBQyxzQkFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFFBQVE7SUFDbEMsQ0FBQyxzQkFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUs7SUFDN0IsQ0FBQyxzQkFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU07SUFDOUIsQ0FBQyxzQkFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLFdBQVc7Q0FDcEMsQ0FBQztBQUVGLFNBQVMsb0JBQW9CLENBQzNCLFNBQWlCLEVBQ2pCLGFBQXFCLEVBQ3JCLEtBQW1CO0lBRW5CLE9BQU87O1NBRUEsQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDLEdBQUcsRUFBRTs7c0JBRW5CLFVBQVUsQ0FBQyxLQUFLLENBQUM7Ozs7Ozs7R0FPcEMsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFTLHFCQUFxQixDQUFDLFNBQWlCO0lBQzlDLE9BQU87O2NBRUssU0FBUyxHQUFHLEVBQUU7OztHQUd6QixDQUFDO0FBQ0osQ0FBQztBQUVELFNBQWdCLGFBQWEsQ0FBQyxPQUFnQjtJQUM1QyxJQUFJLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFB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cUIsR0FBRyxZQUFZLEVBQUU7WUFDL0MsSUFBSSxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDMUIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsc0JBQVksQ0FBQyxPQUFPLENBQUM7YUFDOUM7WUFDRCxjQUFjLEdBQUcsb0JBQW9CLENBQUMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxRSxxQkFBcUIsR0FBRyxDQUFDLENBQUM7U0FDM0I7YUFBTTtZQUNMLHFCQUFxQixFQUFFLENBQUM7U0FDekI7UUFDRCxxQ0FBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25ELE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ1YsQ0FBQyIsImZpbGUiOiJtYWluLWJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBlbnVtIFByb2Nlc3NTdGF0ZSB7XHJcbiAgQ09NUExFVEVEID0gXCJjb21wbGV0ZWRcIixcclxuICBSVU5OSU5HID0gXCJydW5uaW5nXCIsXHJcbiAgV0FJVElORyA9IFwid2FpdGluZ1wiLFxyXG4gIEJMT0NLRUQgPSBcImJsb2NrZWRcIixcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQcm9jZXNzIHtcclxuICB0b3RhbFdvcms6IG51bWJlcjtcclxuICByZW1haW5pbmdXb3JrOiBudW1iZXI7XHJcbiAgcHJvY2Vzc05hbWU6IHN0cmluZztcclxuICBzdGF0ZTogUHJvY2Vzc1N0YXRlO1xyXG4gIHRpbWVFbGFwc2VkOiBudW1iZXI7XHJcbn1cclxuIiwiaW1wb3J0IHsgUHJvY2VzcywgUHJvY2Vzc1N0YXRlIH0gZnJvbSBcIi4uL21vZGVscy9wcm9jZXNzXCI7XHJcblxyXG5jb25zdCBzdGF0ZUNvbG9yID0ge1xyXG4gIFtQcm9jZXNzU3RhdGUuQ09NUExFVEVEXTogXCJ0b21hdG9cIixcclxuICBbUHJvY2Vzc1N0YXRlLlJVTk5JTkddOiBcInJlZFwiLFxyXG4gIFtQcm9jZXNzU3RhdGUuV0FJVElOR106IFwiYXF1YVwiLFxyXG4gIFtQcm9jZXNzU3RhdGUuQkxPQ0tFRF06IFwibGltZWdyZWVuXCIsXHJcbn07XHJcblxyXG5mdW5jdGlvbiBpbm5lckNvbnRhaW5lclN0eWxlcyhcclxuICB0b3RhbFdvcms6IG51bWJlcixcclxuICByZW1haW5pbmdXb3JrOiBudW1iZXIsXHJcbiAgc3RhdGU6IFByb2Nlc3NTdGF0ZVxyXG4pIHtcclxuICByZXR1cm4gYFxyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICB0b3A6ICR7KHRvdGFsV29yayAtIHJlbWFpbmluZ1dvcmspICogMjV9cHg7XHJcbiAgYm9yZGVyOiAxcHggc29saWQgIzAwMDtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3N0YXRlQ29sb3Jbc3RhdGVdfTtcclxuICB0cmFuc2Zvcm06IHJvdGF0ZShcclxuICAxODBkZWdcclxuICApO1xyXG4gIGJvdHRvbTogMDtcclxuICBsZWZ0OiAwO1xyXG4gIHJpZ2h0OiAwO1xyXG4gIGA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG91dHRlckNvbnRhaW5lclN0eWxlcyh0b3RhbFdvcms6IG51bWJlcikge1xyXG4gIHJldHVybiBgXHJcbiAgICB3aWR0aDogMTAwcHg7XHJcbiAgICBoZWlnaHQ6ICR7dG90YWxXb3JrICogMjV9cHg7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjMDAwO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIGA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJQcm9jZXNzKHByb2Nlc3M6IFByb2Nlc3MpIHtcclxuICBsZXQgb3V0dGVyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICBvdXR0ZXJDb250YWluZXIuY2xhc3NOYW1lID0gXCJwcm9jZXNzXCI7XHJcbiAgbGV0IGlubmVyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICBpbm5lckNvbnRhaW5lci5jbGFzc05hbWUgPSBcImlubmVyLXByb2Nlc3NcIjtcclxuICBvdXR0ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoaW5uZXJDb250YWluZXIpO1xyXG4gIHVwZGF0ZVByb2Nlc3MocHJvY2Vzcywgb3V0dGVyQ29udGFpbmVyKTtcclxuICByZXR1cm4gb3V0dGVyQ29udGFpbmVyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlUHJvY2VzcyhcclxuICBwcm9jZXNzOiBQcm9jZXNzLFxyXG4gIG91dHRlckNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnRcclxuKSB7XHJcbiAgb3V0dGVyQ29udGFpbmVyLnNldEF0dHJpYnV0ZShcclxuICAgIFwic3R5bGVcIixcclxuICAgIG91dHRlckNvbnRhaW5lclN0eWxlcyhwcm9jZXNzLnRvdGFsV29yaylcclxuICApO1xyXG4gIGxldCBpbm5lckNvbnRhaW5lciA9IG91dHRlckNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gIGlubmVyQ29udGFpbmVyLnNldEF0dHJpYnV0ZShcclxuICAgIFwic3R5bGVcIixcclxuICAgIGlubmVyQ29udGFpbmVyU3R5bGVzKFxyXG4gICAgICBwcm9jZXNzLnRvdGFsV29yayxcclxuICAgICAgcHJvY2Vzcy5yZW1haW5pbmdXb3JrLFxyXG4gICAgICBwcm9jZXNzLnN0YXRlXHJcbiAgICApXHJcbiAgKTtcclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgUHJvY2VzcywgUHJvY2Vzc1N0YXRlIH0gZnJvbSBcIi4vbW9kZWxzL3Byb2Nlc3NcIjtcclxuaW1wb3J0IHsgcmVuZGVyUHJvY2VzcywgdXBkYXRlUHJvY2VzcyB9IGZyb20gXCIuL3VpL3Byb2Nlc3MtcmVuZGVyaXphdGlvblwiO1xyXG5cclxuY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXJ0QnRuSWRcIik7XHJcbmNvbnN0IHF1YW50dW1UaW1lSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInF1YW50dW0tdmFsdWVcIik7XHJcbmNvbnN0IHByb2Nlc3NDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByb2Nlc3MtY29udGFpbmVyXCIpO1xyXG5cclxubGV0IGNwdV90b3RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3B1LWJ1c3lcIikuaW5uZXJIVE1MO1xyXG5sZXQgY3B1X2lkbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNwdS1idXN5XCIpLmlubmVySFRNTDtcclxubGV0IGNwdV9idXN5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcHUtYnVzeVwiKS5pbm5lckhUTUw7XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVIdG1sU3RhdHMoY3B1SWRsZTogbnVtYmVyLCBjcHVCdXN5OiBudW1iZXIpIHtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNwdS10b3RhbFwiKS5pbm5lckhUTUwgPSAoXHJcbiAgICBjcHVCdXN5ICsgY3B1SWRsZVxyXG4gICkudG9TdHJpbmcoKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNwdS1pZGxlXCIpLmlubmVySFRNTCA9IGNwdUlkbGUudG9TdHJpbmcoKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNwdS1idXN5XCIpLmlubmVySFRNTCA9IGNwdUJ1c3kudG9TdHJpbmcoKTtcclxufVxyXG5cclxuc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBsZXQgcXVhbnR1bVRpbWU6IHN0cmluZyA9ICg8SFRNTElucHV0RWxlbWVudD5xdWFudHVtVGltZUlucHV0KS52YWx1ZTtcclxuICBzdGFydCgrcXVhbnR1bVRpbWUpO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZU5ld1Byb2Nlc3Mod29ya0Ftb3VudDogbnVtYmVyLCBuYW1lOiBzdHJpbmcpOiBQcm9jZXNzIHtcclxuICByZXR1cm4ge1xyXG4gICAgdG90YWxXb3JrOiB3b3JrQW1vdW50LFxyXG4gICAgcHJvY2Vzc05hbWU6IG5hbWUsXHJcbiAgICByZW1haW5pbmdXb3JrOiB3b3JrQW1vdW50LFxyXG4gICAgc3RhdGU6IFByb2Nlc3NTdGF0ZS5XQUlUSU5HLFxyXG4gICAgdGltZUVsYXBzZWQ6IDAsXHJcbiAgfTtcclxufVxyXG5pbnRlcmZhY2UgUHJvY2Vzc1F1ZXVlRWxlbWVudCB7XHJcbiAgcHJvY2VzczogUHJvY2VzcztcclxuICBwcm9jZXNzRG9tOiBIVE1MRGl2RWxlbWVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gY2FsY3VsYXRlTmV4dEVsZW1lbnQoY3VycmVudEVsZW1lbnQ6IG51bWJlciwgcHJvY2Vzc0xpc3RTaXplOiBudW1iZXIpIHtcclxuICBsZXQgYXV4ID0gY3VycmVudEVsZW1lbnQgKyAxO1xyXG4gIGxldCByZXN1bHQgPSBhdXggJSBwcm9jZXNzTGlzdFNpemU7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxubGV0IHByb2Nlc3NMaXN0OiBQcm9jZXNzUXVldWVFbGVtZW50W10gPSBbXTtcclxubGV0IGludGVydmFsQWRkUHJvY2VzczogYW55O1xyXG5sZXQgaW50ZXJ2YWxQcm9jZXNzOiBhbnk7XHJcbmNvbnN0IHByb2Nlc3NMaW1pdCA9IDY7XHJcblxyXG5jb25zdCBtaW5Xb3JrQW1vdW50ID0gMztcclxuY29uc3QgbWF4V29ya0Ftb3VudCA9IDEwO1xyXG5cclxuZnVuY3Rpb24gY2xlYXIoKSB7XHJcbiAgcHJvY2Vzc0xpc3QgPSBbXTtcclxuICBjbGVhckludGVydmFsKGludGVydmFsQWRkUHJvY2Vzcyk7XHJcbiAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbFByb2Nlc3MpO1xyXG4gIHByb2Nlc3NDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcclxufVxyXG5cclxuZnVuY3Rpb24gc3RhcnQocXVhbnR1bVRpbWU6IG51bWJlcikge1xyXG4gIGNsZWFyKCk7XHJcbiAgbGV0IHF1YW50dW1MaW1pdCA9IHF1YW50dW1UaW1lO1xyXG4gIGxldCBwcm9jZXNzQ291bnQgPSAwO1xyXG4gIGludGVydmFsQWRkUHJvY2VzcyA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgIGxldCBwcm9jZXNzID0gY3JlYXRlTmV3UHJvY2VzcyhcclxuICAgICAgTWF0aC5mbG9vcihcclxuICAgICAgICBNYXRoLnJhbmRvbSgpICogKG1heFdvcmtBbW91bnQgLSBtaW5Xb3JrQW1vdW50ICsgMSkgKyBtaW5Xb3JrQW1vdW50XHJcbiAgICAgICksXHJcbiAgICAgIFwicHJvY2Vzb1wiXHJcbiAgICApO1xyXG4gICAgbGV0IHByb2Nlc3NEb20gPSByZW5kZXJQcm9jZXNzKHByb2Nlc3MpO1xyXG4gICAgcHJvY2Vzc0xpc3QucHVzaCh7XHJcbiAgICAgIHByb2Nlc3M6IHByb2Nlc3MsXHJcbiAgICAgIHByb2Nlc3NEb206IHByb2Nlc3NEb20sXHJcbiAgICB9KTtcclxuICAgIHByb2Nlc3NDb250YWluZXIuYXBwZW5kQ2hpbGQocHJvY2Vzc0RvbSk7XHJcbiAgICBpZiAocHJvY2Vzc0xpc3QubGVuZ3RoID09IHByb2Nlc3NMaW1pdCkge1xyXG4gICAgICBjbGVhckludGVydmFsKGludGVydmFsQWRkUHJvY2Vzcyk7XHJcbiAgICB9XHJcbiAgfSwgMTAwMCk7XHJcbiAgbGV0IGN1cnJlbnRQcm9jZXNzID0gMDtcclxuICBsZXQgY3VycmVudERlZGljYXRpbmdUaW1lID0gMDtcclxuXHJcbiAgbGV0IGNwdUlkbGUgPSAwO1xyXG4gIGxldCBjcHVCdXN5ID0gMDtcclxuXHJcbiAgaW50ZXJ2YWxQcm9jZXNzID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgbGV0IGN1cnJlbnQgPSBwcm9jZXNzTGlzdFtjdXJyZW50UHJvY2Vzc107XHJcbiAgICBpZiAoY3VycmVudC5wcm9jZXNzLnN0YXRlID09IFByb2Nlc3NTdGF0ZS5DT01QTEVURUQpIHtcclxuICAgICAgY3B1SWRsZSsrO1xyXG4gICAgICB1cGRhdGVIdG1sU3RhdHMoY3B1SWRsZSwgY3B1QnVzeSk7XHJcbiAgICAgIGN1cnJlbnRQcm9jZXNzID0gY2FsY3VsYXRlTmV4dEVsZW1lbnQoY3VycmVudFByb2Nlc3MsIHByb2Nlc3NMaXN0Lmxlbmd0aCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNwdUJ1c3krKztcclxuICAgICAgdXBkYXRlSHRtbFN0YXRzKGNwdUlkbGUsIGNwdUJ1c3kpO1xyXG4gICAgICBjdXJyZW50LnByb2Nlc3Muc3RhdGUgPSBQcm9jZXNzU3RhdGUuUlVOTklORztcclxuICAgIH1cclxuICAgIGN1cnJlbnQucHJvY2Vzcy5yZW1haW5pbmdXb3JrLS07XHJcbiAgICBjdXJyZW50RGVkaWNhdGluZ1RpbWUrKztcclxuICAgIGlmIChjdXJyZW50LnByb2Nlc3MucmVtYWluaW5nV29yayA8PSAwKSB7XHJcbiAgICAgIGN1cnJlbnQucHJvY2Vzcy5zdGF0ZSA9IFByb2Nlc3NTdGF0ZS5DT01QTEVURUQ7XHJcbiAgICAgIGN1cnJlbnRQcm9jZXNzID0gY2FsY3VsYXRlTmV4dEVsZW1lbnQoY3VycmVudFByb2Nlc3MsIHByb2Nlc3NMaXN0Lmxlbmd0aCk7XHJcbiAgICAgIGN1cnJlbnREZWRpY2F0aW5nVGltZSA9IDA7XHJcbiAgICB9IGVsc2UgaWYgKGN1cnJlbnREZWRpY2F0aW5nVGltZSA+IHF1YW50dW1MaW1pdCkge1xyXG4gICAgICBpZiAocHJvY2Vzc0xpc3QubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIGN1cnJlbnQucHJvY2Vzcy5zdGF0ZSA9IFByb2Nlc3NTdGF0ZS5XQUlUSU5HO1xyXG4gICAgICB9XHJcbiAgICAgIGN1cnJlbnRQcm9jZXNzID0gY2FsY3VsYXRlTmV4dEVsZW1lbnQoY3VycmVudFByb2Nlc3MsIHByb2Nlc3NMaXN0Lmxlbmd0aCk7XHJcbiAgICAgIGN1cnJlbnREZWRpY2F0aW5nVGltZSA9IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjdXJyZW50RGVkaWNhdGluZ1RpbWUrKztcclxuICAgIH1cclxuICAgIHVwZGF0ZVByb2Nlc3MoY3VycmVudC5wcm9jZXNzLCBjdXJyZW50LnByb2Nlc3NEb20pO1xyXG4gICAgY29uc29sZS5sb2coWy4uLnByb2Nlc3NMaXN0XSk7XHJcbiAgfSwgNTAwKTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9