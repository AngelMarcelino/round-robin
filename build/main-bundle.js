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
    [process_1.ProcessState.COMPLETED]: 'tomato',
    [process_1.ProcessState.RUNNING]: 'red',
    [process_1.ProcessState.WAITING]: 'aqua',
    [process_1.ProcessState.BLOCKED]: 'limegreen',
};
function innerContainerStyles(totalWork, remainingWork, state) {
    return `
  position: absolute;
  top: ${(totalWork - remainingWork) * 10}px;
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
    height: ${totalWork * 10}px;
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
startBtn.addEventListener("click", () => {
    let quantumTime = quantumTimeInput.value;
    start(+quantumTime);
});
function createNewProcess(time, name) {
    return {
        totalWork: time,
        processName: name,
        remainingWork: time,
        state: process_1.ProcessState.WAITING,
    };
}
function calculateNextElement(currentElemenet, processListSize) {
    let aux = currentElemenet + 1;
    let result = aux % processListSize;
    return result;
}
let processList = [];
let intervalAddProcess;
let intervalProcess;
const processLimit = 6;
function clear() {
    processList = [];
    clearInterval(intervalAddProcess);
    clearInterval(intervalProcess);
    processContainer.innerHTML = '';
}
function start(quantumTime) {
    clear();
    let quantumLimit = quantumTime;
    let processCount = 0;
    intervalAddProcess = setInterval(() => {
        let process = createNewProcess(Math.floor(Math.random() * (25 - 5 + 1) + 5), "hola");
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
    intervalProcess = setInterval(() => {
        let current = processList[currentProcess];
        if (current.process.state == process_1.ProcessState.COMPLETED) {
            currentProcess = calculateNextElement(currentProcess, processList.length);
            return;
        }
        else {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcmFjdGljYTIvLi9zcmMvbW9kZWxzL3Byb2Nlc3MudHMiLCJ3ZWJwYWNrOi8vcHJhY3RpY2EyLy4vc3JjL3VpL3Byb2Nlc3MtcmVuZGVyaXphdGlvbi50cyIsIndlYnBhY2s6Ly9wcmFjdGljYTIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcHJhY3RpY2EyLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFZLFlBS1g7QUFMRCxXQUFZLFlBQVk7SUFDdEIsdUNBQXVCO0lBQ3ZCLG1DQUFtQjtJQUNuQixtQ0FBbUI7SUFDbkIsbUNBQW1CO0FBQ3JCLENBQUMsRUFMVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUt2Qjs7Ozs7Ozs7Ozs7Ozs7QUNMRCwwRkFBMEQ7QUFFMUQsTUFBTSxVQUFVLEdBQUc7SUFDakIsQ0FBQyxzQkFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFFBQVE7SUFDbEMsQ0FBQyxzQkFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUs7SUFDN0IsQ0FBQyxzQkFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU07SUFDOUIsQ0FBQyxzQkFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLFdBQVc7Q0FDcEM7QUFFRCxTQUFTLG9CQUFvQixDQUFDLFNBQWlCLEVBQUUsYUFBcUIsRUFBRSxLQUFtQjtJQUN6RixPQUFPOztTQUVBLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQyxHQUFDLEVBQUU7O3NCQUVqQixVQUFVLENBQUMsS0FBSyxDQUFDOzs7Ozs7O0dBT3BDLENBQUM7QUFDSixDQUFDO0FBRUQsU0FBUyxxQkFBcUIsQ0FBQyxTQUFpQjtJQUM5QyxPQUFPOztjQUVLLFNBQVMsR0FBRyxFQUFFOzs7R0FHekIsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFnQixhQUFhLENBQUMsT0FBZ0I7SUFDNUMsSUFBSSxlQUFlLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxL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U0FBUyxDQUFDO1lBQy9DLGNBQWMsR0FBRyxvQkFBb0IsQ0FBQyxjQUFjLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFFLHFCQUFxQixHQUFHLENBQUMsQ0FBQztTQUMzQjthQUFNLElBQUkscUJBQXFCLEdBQUcsWUFBWSxFQUFFO1lBQy9DLElBQUksV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQzFCLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLHNCQUFZLENBQUMsT0FBTyxDQUFDO2FBQzlDO1lBQ0QsY0FBYyxHQUFHLG9CQUFvQixDQUFDLGNBQWMsRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUUscUJBQXFCLEdBQUcsQ0FBQyxDQUFDO1NBQzNCO2FBQU07WUFDTCxxQkFBcUIsRUFBRSxDQUFDO1NBQ3pCO1FBQ0QscUNBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNuRCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNWLENBQUMiLCJmaWxlIjoibWFpbi1idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZW51bSBQcm9jZXNzU3RhdGUge1xyXG4gIENPTVBMRVRFRCA9ICdjb21wbGV0ZWQnLFxyXG4gIFJVTk5JTkcgPSAncnVubmluZycsXHJcbiAgV0FJVElORyA9ICd3YWl0aW5nJyxcclxuICBCTE9DS0VEID0gJ2Jsb2NrZWQnLFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFByb2Nlc3Mge1xyXG4gIHRvdGFsV29yazogbnVtYmVyO1xyXG4gIHJlbWFpbmluZ1dvcms6IG51bWJlcjtcclxuICBwcm9jZXNzTmFtZTogc3RyaW5nO1xyXG4gIHN0YXRlOiBQcm9jZXNzU3RhdGU7XHJcbn1cclxuIiwiaW1wb3J0IHsgUHJvY2VzcywgUHJvY2Vzc1N0YXRlIH0gZnJvbSBcIi4uL21vZGVscy9wcm9jZXNzXCI7XHJcblxyXG5jb25zdCBzdGF0ZUNvbG9yID0ge1xyXG4gIFtQcm9jZXNzU3RhdGUuQ09NUExFVEVEXTogJ3RvbWF0bycsXHJcbiAgW1Byb2Nlc3NTdGF0ZS5SVU5OSU5HXTogJ3JlZCcsXHJcbiAgW1Byb2Nlc3NTdGF0ZS5XQUlUSU5HXTogJ2FxdWEnLFxyXG4gIFtQcm9jZXNzU3RhdGUuQkxPQ0tFRF06ICdsaW1lZ3JlZW4nLFxyXG59XHJcblxyXG5mdW5jdGlvbiBpbm5lckNvbnRhaW5lclN0eWxlcyh0b3RhbFdvcms6IG51bWJlciwgcmVtYWluaW5nV29yazogbnVtYmVyLCBzdGF0ZTogUHJvY2Vzc1N0YXRlKSB7XHJcbiAgcmV0dXJuIGBcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgdG9wOiAkeyh0b3RhbFdvcmsgLSByZW1haW5pbmdXb3JrKSoxMH1weDtcclxuICBib3JkZXI6IDFweCBzb2xpZCAjMDAwO1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICR7c3RhdGVDb2xvcltzdGF0ZV19O1xyXG4gIHRyYW5zZm9ybTogcm90YXRlKFxyXG4gIDE4MGRlZ1xyXG4gICk7XHJcbiAgYm90dG9tOiAwO1xyXG4gIGxlZnQ6IDA7XHJcbiAgcmlnaHQ6IDA7XHJcbiAgYDtcclxufVxyXG5cclxuZnVuY3Rpb24gb3V0dGVyQ29udGFpbmVyU3R5bGVzKHRvdGFsV29yazogbnVtYmVyKSB7XHJcbiAgcmV0dXJuIGBcclxuICAgIHdpZHRoOiAxMDBweDtcclxuICAgIGhlaWdodDogJHt0b3RhbFdvcmsgKiAxMH1weDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkICMwMDA7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgYDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclByb2Nlc3MocHJvY2VzczogUHJvY2Vzcykge1xyXG4gIGxldCBvdXR0ZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gIG91dHRlckNvbnRhaW5lci5jbGFzc05hbWUgPSBcInByb2Nlc3NcIjtcclxuICBsZXQgaW5uZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gIGlubmVyQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwiaW5uZXItcHJvY2Vzc1wiO1xyXG4gIG91dHRlckNvbnRhaW5lci5hcHBlbmRDaGlsZChpbm5lckNvbnRhaW5lcik7XHJcbiAgdXBkYXRlUHJvY2Vzcyhwcm9jZXNzLCBvdXR0ZXJDb250YWluZXIpO1xyXG4gIHJldHVybiBvdXR0ZXJDb250YWluZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVQcm9jZXNzKFxyXG4gIHByb2Nlc3M6IFByb2Nlc3MsXHJcbiAgb3V0dGVyQ29udGFpbmVyOiBIVE1MRGl2RWxlbWVudFxyXG4pIHtcclxuICBvdXR0ZXJDb250YWluZXIuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgb3V0dGVyQ29udGFpbmVyU3R5bGVzKHByb2Nlc3MudG90YWxXb3JrKSk7XHJcbiAgbGV0IGlubmVyQ29udGFpbmVyID0gb3V0dGVyQ29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgaW5uZXJDb250YWluZXIuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgaW5uZXJDb250YWluZXJTdHlsZXMocHJvY2Vzcy50b3RhbFdvcmssIHByb2Nlc3MucmVtYWluaW5nV29yaywgcHJvY2Vzcy5zdGF0ZSkpO1xyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBQcm9jZXNzLCBQcm9jZXNzU3RhdGUgfSBmcm9tIFwiLi9tb2RlbHMvcHJvY2Vzc1wiO1xyXG5pbXBvcnQgeyByZW5kZXJQcm9jZXNzLCB1cGRhdGVQcm9jZXNzIH0gZnJvbSBcIi4vdWkvcHJvY2Vzcy1yZW5kZXJpemF0aW9uXCI7XHJcblxyXG5jb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RhcnRCdG5JZFwiKTtcclxuY29uc3QgcXVhbnR1bVRpbWVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicXVhbnR1bS12YWx1ZVwiKTtcclxuY29uc3QgcHJvY2Vzc0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvY2Vzcy1jb250YWluZXJcIik7XHJcblxyXG5zdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGxldCBxdWFudHVtVGltZTogc3RyaW5nID0gKDxIVE1MSW5wdXRFbGVtZW50PnF1YW50dW1UaW1lSW5wdXQpLnZhbHVlO1xyXG4gIHN0YXJ0KCtxdWFudHVtVGltZSk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlTmV3UHJvY2Vzcyh0aW1lOiBudW1iZXIsIG5hbWU6IHN0cmluZyk6IFByb2Nlc3Mge1xyXG4gIHJldHVybiB7XHJcbiAgICB0b3RhbFdvcms6IHRpbWUsXHJcbiAgICBwcm9jZXNzTmFtZTogbmFtZSxcclxuICAgIHJlbWFpbmluZ1dvcms6IHRpbWUsXHJcbiAgICBzdGF0ZTogUHJvY2Vzc1N0YXRlLldBSVRJTkcsXHJcbiAgfTtcclxufVxyXG5pbnRlcmZhY2UgUHJvY2Vzc1F1ZXVlRWxlbWVudCB7XHJcbiAgcHJvY2VzczogUHJvY2VzcztcclxuICBwcm9jZXNzRG9tOiBIVE1MRGl2RWxlbWVudDtcclxufVxyXG5mdW5jdGlvbiBjYWxjdWxhdGVOZXh0RWxlbWVudChcclxuICBjdXJyZW50RWxlbWVuZXQ6IG51bWJlcixcclxuICBwcm9jZXNzTGlzdFNpemU6IG51bWJlclxyXG4pIHtcclxuICBsZXQgYXV4ID0gY3VycmVudEVsZW1lbmV0ICsgMTtcclxuICBsZXQgcmVzdWx0ID0gYXV4ICUgcHJvY2Vzc0xpc3RTaXplO1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmxldCBwcm9jZXNzTGlzdDogUHJvY2Vzc1F1ZXVlRWxlbWVudFtdID0gW107XHJcbmxldCBpbnRlcnZhbEFkZFByb2Nlc3M6IGFueTtcclxubGV0IGludGVydmFsUHJvY2VzczogYW55O1xyXG5jb25zdCBwcm9jZXNzTGltaXQgPSA2O1xyXG5mdW5jdGlvbiBjbGVhcigpIHtcclxuICBwcm9jZXNzTGlzdCA9IFtdO1xyXG4gIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxBZGRQcm9jZXNzKTtcclxuICBjbGVhckludGVydmFsKGludGVydmFsUHJvY2Vzcyk7XHJcbiAgcHJvY2Vzc0NvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcclxufVxyXG5mdW5jdGlvbiBzdGFydChxdWFudHVtVGltZTogbnVtYmVyKSB7XHJcbiAgY2xlYXIoKVxyXG4gIGxldCBxdWFudHVtTGltaXQgPSBxdWFudHVtVGltZTtcclxuICBsZXQgcHJvY2Vzc0NvdW50ID0gMDtcclxuICBpbnRlcnZhbEFkZFByb2Nlc3MgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICBsZXQgcHJvY2VzcyA9IGNyZWF0ZU5ld1Byb2Nlc3MoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDI1IC0gNSArIDEpICsgNSksIFwiaG9sYVwiKTtcclxuICAgIGxldCBwcm9jZXNzRG9tID0gcmVuZGVyUHJvY2Vzcyhwcm9jZXNzKTtcclxuICAgIHByb2Nlc3NMaXN0LnB1c2goe1xyXG4gICAgICBwcm9jZXNzOiBwcm9jZXNzLFxyXG4gICAgICBwcm9jZXNzRG9tOiBwcm9jZXNzRG9tLFxyXG4gICAgfSk7XHJcbiAgICBwcm9jZXNzQ29udGFpbmVyLmFwcGVuZENoaWxkKHByb2Nlc3NEb20pO1xyXG4gICAgaWYgKHByb2Nlc3NMaXN0Lmxlbmd0aCA9PSBwcm9jZXNzTGltaXQpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbEFkZFByb2Nlc3MpO1xyXG4gICAgfVxyXG4gIH0sIDEwMDApO1xyXG4gIGxldCBjdXJyZW50UHJvY2VzcyA9IDA7XHJcbiAgbGV0IGN1cnJlbnREZWRpY2F0aW5nVGltZSA9IDA7XHJcbiAgaW50ZXJ2YWxQcm9jZXNzID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgbGV0IGN1cnJlbnQgPSBwcm9jZXNzTGlzdFtjdXJyZW50UHJvY2Vzc107XHJcbiAgICBpZiAoY3VycmVudC5wcm9jZXNzLnN0YXRlID09IFByb2Nlc3NTdGF0ZS5DT01QTEVURUQpIHtcclxuICAgICAgY3VycmVudFByb2Nlc3MgPSBjYWxjdWxhdGVOZXh0RWxlbWVudChjdXJyZW50UHJvY2VzcywgcHJvY2Vzc0xpc3QubGVuZ3RoKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjdXJyZW50LnByb2Nlc3Muc3RhdGUgPSBQcm9jZXNzU3RhdGUuUlVOTklORztcclxuICAgIH1cclxuICAgIGN1cnJlbnQucHJvY2Vzcy5yZW1haW5pbmdXb3JrLS07XHJcbiAgICBjdXJyZW50RGVkaWNhdGluZ1RpbWUrKztcclxuICAgIGlmIChjdXJyZW50LnByb2Nlc3MucmVtYWluaW5nV29yayA8PSAwKSB7XHJcbiAgICAgIGN1cnJlbnQucHJvY2Vzcy5zdGF0ZSA9IFByb2Nlc3NTdGF0ZS5DT01QTEVURUQ7XHJcbiAgICAgIGN1cnJlbnRQcm9jZXNzID0gY2FsY3VsYXRlTmV4dEVsZW1lbnQoY3VycmVudFByb2Nlc3MsIHByb2Nlc3NMaXN0Lmxlbmd0aCk7XHJcbiAgICAgIGN1cnJlbnREZWRpY2F0aW5nVGltZSA9IDA7XHJcbiAgICB9IGVsc2UgaWYgKGN1cnJlbnREZWRpY2F0aW5nVGltZSA+IHF1YW50dW1MaW1pdCkge1xyXG4gICAgICBpZiAocHJvY2Vzc0xpc3QubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIGN1cnJlbnQucHJvY2Vzcy5zdGF0ZSA9IFByb2Nlc3NTdGF0ZS5XQUlUSU5HO1xyXG4gICAgICB9XHJcbiAgICAgIGN1cnJlbnRQcm9jZXNzID0gY2FsY3VsYXRlTmV4dEVsZW1lbnQoY3VycmVudFByb2Nlc3MsIHByb2Nlc3NMaXN0Lmxlbmd0aCk7XHJcbiAgICAgIGN1cnJlbnREZWRpY2F0aW5nVGltZSA9IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjdXJyZW50RGVkaWNhdGluZ1RpbWUrKztcclxuICAgIH1cclxuICAgIHVwZGF0ZVByb2Nlc3MoY3VycmVudC5wcm9jZXNzLCBjdXJyZW50LnByb2Nlc3NEb20pO1xyXG4gICAgY29uc29sZS5sb2coWy4uLnByb2Nlc3NMaXN0XSk7XHJcbiAgfSwgNTAwKTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9