(() => {
  "use strict";
  var __webpack_modules__ = {
    "./src/models/process.ts": (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ProcessState = void 0;
      var ProcessState;
      (function (ProcessState) {
        ProcessState["COMPLETED"] = "completed";
        ProcessState["RUNNING"] = "running";
        ProcessState["WAITING"] = "waiting";
        ProcessState["BLOCKED"] = "blocked";
      })((ProcessState = exports.ProcessState || (exports.ProcessState = {})));
    },
    "./src/ui/process-renderization.ts": (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.updateProcess = exports.renderProcess = void 0;
      const process_1 = __webpack_require__("./src/models/process.ts");
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
        outterContainer.setAttribute(
          "style",
          outterContainerStyles(process.totalWork)
        );
        let innerContainer = outterContainer.firstChild;
        innerContainer.setAttribute(
          "style",
          innerContainerStyles(
            process.totalWork,
            process.remainingWork,
            process.state
          )
        );
      }
      exports.updateProcess = updateProcess;
    },
    "./src/utils/statistics.ts": (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, "__esModule", { value: true });
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
        return Math.sqrt(
          array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / n
        );
      }
      exports.standardDeviation = standardDeviation;
    },
  };
  var __webpack_module_cache__ = {};

  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (__webpack_module_cache__[moduleId] = {
      exports: {},
    });

    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

    return module.exports;
  }
  var __webpack_exports__ = {};
  (() => {
    var exports = __webpack_exports__;

    Object.defineProperty(exports, "__esModule", { value: true });
    const process_1 = __webpack_require__("./src/models/process.ts");
    const process_renderization_1 = __webpack_require__(
      "./src/ui/process-renderization.ts"
    );
    const statistics_1 = __webpack_require__("./src/utils/statistics.ts");
    const startBtn = document.getElementById("startBtnId");
    const quantumTimeInput = document.getElementById("quantum-value");
    const processContainer = document.getElementById("process-container");
    let resMin = document.getElementById("res-min");
    let resMed = document.getElementById("res-med");
    let resMax = document.getElementById("res-max");
    let resSd = document.getElementById("res-sd");
    function updateHtmlStats(cpuIdle, cpuBusy) {
      document.getElementById("cpu-total").innerHTML = (
        cpuBusy + cpuIdle
      ).toString();
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
      waitingTime = [];
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
        let process = createNewProcess(
          Math.floor(
            Math.random() * (maxWorkAmount - minWorkAmount + 1) + minWorkAmount
          ),
          "proceso"
        );
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
          currentProcess = calculateNextElement(
            currentProcess,
            processList.length
          );
          return;
        } else {
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
          currentProcess = calculateNextElement(
            currentProcess,
            processList.length
          );
          currentDedicatingTime = 0;
        } else if (currentDedicatingTime > quantumLimit) {
          if (processList.length > 1) {
            current.process.state = process_1.ProcessState.WAITING;
          }
          currentProcess = calculateNextElement(
            currentProcess,
            processList.length
          );
          currentDedicatingTime = 0;
        } else {
          currentDedicatingTime++;
        }
        process_renderization_1.updateProcess(
          current.process,
          current.processDom
        );
        console.log([...processList]);
      }, 500);
    }
    function updateStatistics() {
      resMin.innerHTML = "" + (Math.min(...waitingTime) || "0");
      resMed.innerHTML =
        "" + (Math.round(statistics_1.average(waitingTime)) || "0");
      resMax.innerHTML = "" + (Math.max(...waitingTime) || "0");
      resSd.innerHTML =
        "" + (Math.round(statistics_1.standardDeviation(waitingTime)) || "0");
    }
  })();
})();
