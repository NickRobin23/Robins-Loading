/* ─── VIDEO FADE-IN ─── */
const vid = document.getElementById('bg-video');
vid.addEventListener('canplay',    () => vid.classList.add('loaded'));
vid.addEventListener('loadeddata', () => vid.classList.add('loaded'));

/* ─── MUSIC ─── */
const music     = document.getElementById('bg-music');
const bars      = document.getElementById('music-bars');
const iconPlay  = document.getElementById('icon-play');
const iconPause = document.getElementById('icon-pause');
let musicPlaying = false;

function startMusic() {
  music.play()
    .then(() => {
      musicPlaying = true;
      bars.classList.remove('paused');
      iconPlay.style.display  = 'none';
      iconPause.style.display = '';
    })
    .catch(() => {
      // Autoplay blocked — user interaction will trigger it
    });
}

function toggleMusic() {
  if (musicPlaying) {
    music.pause();
    musicPlaying = false;
    bars.classList.add('paused');
    iconPlay.style.display  = '';
    iconPause.style.display = 'none';
  } else {
    startMusic();
  }
}

// Spacebar toggles music
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    toggleMusic();
  }
});

// First click anywhere also starts music (handles autoplay policy)
document.addEventListener('click', () => {
  if (!musicPlaying) startMusic();
}, { once: true });

// Try autoplay shortly after load
setTimeout(startMusic, 800);

/* ─── VOLUME SLIDER ─── */
const volumeSlider = document.getElementById('volume-slider');

function setVolume(val) {
  const v = Math.max(0, Math.min(100, val));
  music.volume = v / 100;
  volumeSlider.style.background =
    `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${v}%, var(--bar-bg) ${v}%, var(--bar-bg) 100%)`;
}

// Initialize at slider's default value
setVolume(parseInt(volumeSlider.value, 10));

volumeSlider.addEventListener('input', (e) => {
  setVolume(parseInt(e.target.value, 10));
});

/* ─── LIVE CLOCK ─── */
function updateClock() {
  const now = new Date();
  const h   = String(now.getHours()).padStart(2, '0');
  const m   = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('clock').textContent = `${h}:${m}`;
}
updateClock();
setInterval(updateClock, 10000);

/* ─── LOADING PROGRESS ─── */
const fill   = document.getElementById('bar-fill');
const pct    = document.getElementById('loading-percent');
const label  = document.getElementById('loading-label');
const status = document.getElementById('loading-status');

const initiatorLabels = {
  'unknown':             'Initializing...',
  'network':             'Connecting to server...',
  'cdn':                 'Downloading assets...',
  'resource':            'Loading resources...',
  'resource_update':     'Updating resources...',
  'resource_mismatch':   'Verifying files...',
  'map':                 'Loading map data...',
  'starting':            'Starting up...',
  'shutdown':            'Finishing up...',
};

function getStatusLabel(initiatorType, fraction) {
  // Use the initiator type label if we have one
  if (initiatorType && initiatorLabels[initiatorType]) {
    return initiatorLabels[initiatorType];
  }
  // Fallback: derive from progress fraction
  if (fraction < 0.15) return 'Connecting to server...';
  if (fraction < 0.35) return 'Downloading assets...';
  if (fraction < 0.55) return 'Loading resources...';
  if (fraction < 0.70) return 'Loading map data...';
  if (fraction < 0.85) return 'Initializing scripts...';
  if (fraction < 0.95) return 'Spawning player...';
  return 'Almost ready...';
}

function setProgress(fraction, initiatorType) {
  const val = Math.round(Math.max(0, Math.min(1, fraction)) * 100);
  fill.style.width   = val + '%';
  pct.textContent    = val + '%';

  if (val >= 100) {
    label.textContent  = 'Complete';
    status.textContent = 'Welcome.';
  } else {
    label.textContent  = 'Loading';
    status.textContent = getStatusLabel(initiatorType, fraction);
  }
}

/* ─── PLAYER COUNT — fetched from /players.json ─── */
const playerCountEl = document.getElementById('player-count');

function fetchPlayerCount() {
  playerCountEl.classList.add('refreshing');

  fetch('/players.json')
    .then(r => r.json())
    .then(players => {
      const count = Array.isArray(players) ? players.length : 0;
      playerCountEl.textContent = `${count} Online Players`;
    })
    .catch(() => {
      playerCountEl.textContent = '0 Online Players';
    })
    .finally(() => {
      playerCountEl.classList.remove('refreshing');
    });
}

// Fetch immediately, then refresh every 30 seconds
fetchPlayerCount();
setInterval(fetchPlayerCount, 30000);

// Clicking the player count manually refreshes it
playerCountEl.addEventListener('click', fetchPlayerCount);

window.addEventListener('message', (e) => {
  const d = e.data;
  if (!d || !d.eventName) return;

  if (d.eventName === 'loadProgress') {
    gotReal = true;
    setProgress(d.loadFraction || 0, d.initiatorType || '');
  }
});

/* ─── DEMO PROGRESS (preview outside FiveM only) ─── */
let demoVal = 0;
let gotReal = false;

const demoStages = [
  { until: 0.12, label: 'network' },
  { until: 0.35, label: 'cdn' },
  { until: 0.60, label: 'resource' },
  { until: 0.78, label: 'map' },
  { until: 0.92, label: 'starting' },
  { until: 1.00, label: 'shutdown' },
];

function getDemoInitiator(fraction) {
  for (const stage of demoStages) {
    if (fraction <= stage.until) return stage.label;
  }
  return 'shutdown';
}

function demoTick() {
  if (demoVal < 1) {
    demoVal += (Math.random() * 0.018) + 0.004;
    setProgress(Math.min(demoVal, 1), getDemoInitiator(demoVal));
    setTimeout(demoTick, 120 + Math.random() * 200);
  }
}

// Only run demo if FiveM hasn't sent a real event within 1 second
setTimeout(() => {
  if (!gotReal) demoTick();
}, 1000);
