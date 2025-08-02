
  const startStopBtn = document.getElementById('startStopBtn');
  const resetBtn = document.getElementById('resetBtn');
  const lapBtn = document.getElementById('lapBtn');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const centisecondsEl = document.getElementById('centiseconds');
  const lapsList = document.getElementById('lapsList');

  let timerInterval = null;
  let startTime = 0;
  let elapsedTime = 0;
  let running = false;
  let laps = [];

  function updateDisplay(time) {
    const centiseconds = Math.floor((time % 1000) / 10);
    const totalSeconds = Math.floor(time / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);

    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
    centisecondsEl.textContent = String(centiseconds).padStart(2, '0');
  }

  function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      updateDisplay(elapsedTime);
    }, 10);
    running = true;
    startStopBtn.textContent = 'Stop';
    startStopBtn.setAttribute('aria-label', 'Stop stopwatch');
    startStopBtn.setAttribute('aria-pressed', 'true');
    resetBtn.disabled = false;
    lapBtn.disabled = false;
  }

  function stopTimer() {
    clearInterval(timerInterval);
    running = false;
    startStopBtn.textContent = 'Resume';
    startStopBtn.setAttribute('aria-label', 'Resume stopwatch');
    startStopBtn.setAttribute('aria-pressed', 'false');
  }

  function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    laps = [];
    updateDisplay(elapsedTime);
    lapsList.innerHTML = '';
    running = false;
    startStopBtn.textContent = 'Start';
    startStopBtn.setAttribute('aria-label', 'Start stopwatch');
    startStopBtn.setAttribute('aria-pressed', 'false');
    resetBtn.disabled = true;
    lapBtn.disabled = true;
  }

  function recordLap() {
    if (!running) return;
    const lapTime = elapsedTime;
    let lapDisplay = formatTime(lapTime);

    if (laps.length > 0) {
      const lastLapTime = laps[laps.length - 1];
      const lapDiff = lapTime - lastLapTime;
      lapDisplay += ` (+${formatTime(lapDiff)})`;
    } else {
      lapDisplay += " (First Lap)";
    }

    laps.push(lapTime);

    const li = document.createElement('li');
    li.textContent = `Lap ${laps.length}: ${lapDisplay}`;
    lapsList.appendChild(li);

    lapsList.parentElement.scrollTop = lapsList.parentElement.scrollHeight;
  }

  function formatTime(time) {
    const cs = Math.floor((time % 1000) / 10);
    const totalSec = Math.floor(time / 1000);
    const sec = totalSec % 60;
    const min = Math.floor(totalSec / 60);
    return `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}:${String(cs).padStart(2,'0')}`;
  }

  startStopBtn.addEventListener('click', () => {
    if (!running) {
      startTimer();
    } else {
      stopTimer();
    }
  });

  resetBtn.addEventListener('click', () => {
    resetTimer();
  });

  lapBtn.addEventListener('click', () => {
    recordLap();
  });

  updateDisplay(0);
