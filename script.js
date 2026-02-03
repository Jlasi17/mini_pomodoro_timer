const timerEl = document.getElementById("timer");
const playBtn = document.getElementById("play");
const resetBtn = document.getElementById("reset");
const modeEl = document.getElementById("mode");
const sessionsSelect = document.getElementById("sessions");

const TIMES = {
  focus: 25 * 60,
  break: 5 * 60
};

let totalSeconds = TIMES.focus;
let interval = null;
let running = false;
let isFocus = true;
let sessionsLeft = parseInt(sessionsSelect.value);

// UPDATE TIMER DISPLAY
function updateDisplay() {
  totalSeconds = Math.max(totalSeconds, 0);
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  timerEl.textContent = `${m}:${s}`;
}

// ANIMATE TIMER
function animateTimer() {
  timerEl.classList.add("animate");
  setTimeout(() => timerEl.classList.remove("animate"), 300);
}

// PLAY SOUND ALERT
function playBeep() {
  const audio = new Audio("./assets/beep.mp3");
  audio.play();
}

// START TIMER
function startTimer() {
  interval = setInterval(() => {
    totalSeconds--;
    updateDisplay();

    if (totalSeconds <= 0) {
      clearInterval(interval);
      handlePhaseEnd();
    }
  }, 1000);
}

// SWITCH PHASE (FOCUS <-> BREAK)
function switchPhase(focusPhase) {
  isFocus = focusPhase;
  modeEl.textContent = isFocus ? "FOCUS" : "BREAK";
  totalSeconds = isFocus ? TIMES.focus : TIMES.break;
  updateDisplay();
  animateTimer();
  playBeep();
  startTimer();
}

// HANDLE PHASE END
function handlePhaseEnd() {
  if (isFocus) {
    switchPhase(false);
  } else {
    sessionsLeft--;
    sessionsSelect.value = sessionsLeft;

    if (sessionsLeft <= 0) {
      timerEl.textContent = "DONE";
      playBtn.textContent = "▶";
      running = false;
      sessionsSelect.disabled = false;
      alert("All sessions completed!");
      return;
    }

    switchPhase(true);
  }
}

// PLAY/PAUSE BUTTON
playBtn.addEventListener("click", () => {
  if (!running) {
    running = true;
    playBtn.textContent = "⏸";
    sessionsSelect.disabled = true;
    startTimer();
  } else {
    running = false;
    playBtn.textContent = "▶";
    clearInterval(interval);
  }
});

// RESET BUTTON
resetBtn.addEventListener("click", () => {
  clearInterval(interval);
  totalSeconds = TIMES.focus;
  sessionsLeft = parseInt(sessionsSelect.value);
  running = false;
  isFocus = true;
  modeEl.textContent = "FOCUS";
  playBtn.textContent = "▶";
  sessionsSelect.disabled = false;
  updateDisplay();
});

// SESSION DROPDOWN CHANGE
sessionsSelect.addEventListener("change", () => {
  if (running) return;
  sessionsLeft = parseInt(sessionsSelect.value);
  totalSeconds = TIMES.focus;
  isFocus = true;
  modeEl.textContent = "FOCUS";
  updateDisplay();
});

// INITIAL DISPLAY
updateDisplay();