/* ==========================================
   1. GLOBAL CRASH-PROOF LAMP LOGIN ENGINE
   ========================================== */

let inactivityTimer = null;
const INACTIVITY_LIMIT = 30 * 60 * 1000;

window.playClickSound = function() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine'; 
    osc.frequency.setValueAtTime(520, audioCtx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + 0.08); 
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime); 
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08); 
    osc.connect(gain); 
    gain.connect(audioCtx.destination); 
    osc.start(); 
    osc.stop(audioCtx.currentTime + 0.08);
  } catch(e) {}
};

window.toggleLamp = function(event) {
  if (event && event.stopPropagation) event.stopPropagation();
  window.playClickSound();

  const cordEl = document.getElementById("pullCord");
  if (cordEl) {
    cordEl.classList.remove("bouncing");
    void cordEl.offsetWidth; // Force CSS reflow to re-trigger spring animation
    cordEl.classList.add("bouncing");
  }

  document.body.classList.toggle("lamp-is-on");

  if (document.body.classList.contains("lamp-is-on")) {
    setTimeout(() => {
      const pwdInput = document.getElementById("loginPassword");
      if (pwdInput) pwdInput.focus();
    }, 300);
  }
};

window.verifyLogin = function() {
  const pwdInput = document.getElementById("loginPassword");
  const errEl = document.getElementById("loginError");
  if (!pwdInput) return;

  if (pwdInput.value === "sb2026") {
    if (errEl) errEl.innerText = "";
    const authOverlay = document.getElementById("authOverlay");
    if (authOverlay) authOverlay.classList.add("unlocked");
    document.body.classList.remove("lamp-is-on");
    pwdInput.value = "";
    
    const rememberChk = document.getElementById("rememberMeCheckbox");
    if (rememberChk && rememberChk.checked) {
      localStorage.setItem("sbhub_remember_me", "true");
    } else {
      localStorage.removeItem("sbhub_remember_me");
    }
    window.resetInactivityTimer();
  } else {
    if (errEl) errEl.innerText = "Incorrect password!";
  }
};

window.triggerLogout = function() {
  localStorage.removeItem("sbhub_remember_me");
  const modal = document.getElementById("settingsModal");
  if (modal) modal.style.display = "none";
  const authOverlay = document.getElementById("authOverlay");
  if (authOverlay) authOverlay.classList.remove("unlocked");
  document.body.classList.remove("lamp-is-on");
};

window.resetInactivityTimer = function() {
  clearTimeout(inactivityTimer);
  const authOverlay = document.getElementById("authOverlay");
  if (!authOverlay || !authOverlay.classList.contains("unlocked")) return;
  
  inactivityTimer = setTimeout(() => {
    if (localStorage.getItem("sbhub_remember_me") !== "true") {
      authOverlay.classList.remove("unlocked");
      document.body.classList.remove("lamp-is-on");
    }
  }, INACTIVITY_LIMIT);
};

window.checkRememberedSession = function() {
  const isRemembered = localStorage.getItem("sbhub_remember_me") === "true";
  if (isRemembered) {
    const authOverlay = document.getElementById("authOverlay");
    if (authOverlay) authOverlay.classList.add("unlocked");
    const rememberChk = document.getElementById("rememberMeCheckbox");
    if (rememberChk) rememberChk.checked = true;
    window.resetInactivityTimer();
  }
};


/* ==========================================
   2. DASHBOARD DATA & CONFIGURATION
   ========================================== */

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const wallpaperPresets = [
  { id: "green_default", name: "Merry Christmas Green (Default)", type: "dark", url: "green.jpg" },
  { id: "minimalist_bg", name: "Winter Minimalist", type: "light", url: "minimalist.jpg" },
  { id: "santa_bg", name: "Festive Santa", type: "dark", url: "santa.jpg" },
  { id: "merry_christmas_default", name: "Christmas Tree Scene", type: "dark", url: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=1600&auto=format&fit=crop" },
  { id: "winter_wonderland_default", name: "Winter Wonderland", type: "light", url: "https://images.unsplash.com/photo-1513297887119-d46091b24bfa?q=80&w=1600&auto=format&fit=crop" },
  { id: "festive_default", name: "Sportsbook Hub Festive", type: "dark", url: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=1600&auto=format&fit=crop" }
];

const widgetRegistry = {
  timezonesCard: "World Clock", weatherCard: "Weather PH", topGamesCard: "Next Day Top Games",
  flashscoreCard: "Flashscore Hub", trendCard: "Monitoring Trend", quickDockCard: "Directory Dock",
  dailyTaskCard: "Daily Task Dock", handoverCard: "Handover Tasks", currentDutyCard: "Live Time-Slot Duties"
};

let widgetVisibilityState = {
  timezonesCard: true, weatherCard: true, topGamesCard: true, flashscoreCard: true,
  trendCard: true, quickDockCard: true, dailyTaskCard: true, handoverCard: true, currentDutyCard: true
};

const availableTimezones = [
  { zone: "Asia/Manila", name: "Manila (PST)" }, { zone: "UTC", name: "UTC / GMT" },
  { zone: "America/New_York", name: "US East (EST)" }, { zone: "America/Los_Angeles", name: "US West (PST)" },
  { zone: "Europe/London", name: "London (GMT/BST)" }, { zone: "Europe/Paris", name: "Central Europe" }
];

let selectedTimezones = ["Asia/Manila", "UTC", "America/New_York"];
let trendChartInstance = null;
let handoverItems = [];
let isSidebarLocked = localStorage.getItem('sbhub_sidebar_locked') === 'true';
let selectedGameDayOffset = 1;

let rosterDb = null;
try {
  if (typeof firebase !== 'undefined') {
    const rosterFirebaseConfig = {
      apiKey: "AIzaSyCaEclzLI284lWCFk-vXbLSXa_bEZsXbOg",
      authDomain: "test-daily-task--sb.firebaseapp.com",
      databaseURL: "https://test-daily-task--sb-default-rtdb.firebaseio.com",
      projectId: "test-daily-task--sb",
      storageBucket: "test-daily-task--sb.firebasestorage.app",
      messagingSenderId: "928476661919",
      appId: "1:928476661919:web:c6d531190824c6ed7c7aaa"
    };
    if (!firebase.apps.length) firebase.initializeApp(rosterFirebaseConfig);
    rosterDb = firebase.database();
  }
} catch (e) {
  console.warn("Firebase not active.", e);
}


/* ==========================================
   3. UI HELPER FUNCTIONS
   ========================================== */

window.changeGameDayOffset = function(delta) {
  const newOffset = selectedGameDayOffset + delta;
  if (newOffset >= 0 && newOffset <= 7) {
    selectedGameDayOffset = newOffset;
    fetchLiveGames();
  }
};

window.showToastNotification = function(msg) {
  const toast = document.getElementById('toastNotification');
  const msgEl = document.getElementById('toastMsg');
  if (!toast || !msgEl) return;
  msgEl.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
};

window.toggleAccordion = function(containerId, chevronId) {
  const container = document.getElementById(containerId);
  const chevron = document.getElementById(chevronId);
  if (!container) return;
  const isHidden = container.style.display === 'none' || container.style.display === '';
  container.style.display = isHidden ? 'flex' : 'none';
  if (chevron) chevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
};

function initWallpaperPicker() {
  const container = document.getElementById('wallpaperPickerContainer');
  if (!container) return;
  container.innerHTML = '';
  const activeWpId = localStorage.getItem('sbhub_selected_wallpaper') || 'green_default';

  wallpaperPresets.forEach(wp => {
    const thumb = document.createElement('div');
    thumb.className = `wallpaper-thumb ${wp.id === activeWpId ? 'active' : ''}`;
    thumb.style.backgroundImage = `url('${wp.url}')`;
    thumb.title = wp.name;
    thumb.onclick = () => selectWallpaper(wp.id);
    container.appendChild(thumb);
  });
  applyWallpaper(activeWpId);
}

function selectWallpaper(id) {
  localStorage.setItem('sbhub_selected_wallpaper', id);
  document.querySelectorAll('.wallpaper-thumb').forEach((thumb, idx) => {
    if (wallpaperPresets[idx] && wallpaperPresets[idx].id === id) thumb.classList.add('active');
    else thumb.classList.remove('active');
  });
  applyWallpaper(id);
}

function applyWallpaper(id) {
  const wp = wallpaperPresets.find(w => w.id === id) || wallpaperPresets[0];
  document.body.style.backgroundImage = `linear-gradient(var(--bg-overlay), var(--bg-overlay)), url('${wp.url}')`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center center';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundAttachment = 'fixed';
}

function initWidgetManagerUI() {
  const savedVisibility = localStorage.getItem('sbhub_widget_visibility');
  if (savedVisibility) {
    try {
      const parsed = JSON.parse(savedVisibility);
      widgetVisibilityState = { ...widgetVisibilityState, ...parsed };
    } catch(e){}
  }

  const container = document.getElementById('widgetManagerContainer');
  if (!container) return;
  container.innerHTML = '';

  Object.keys(widgetRegistry).forEach(cardId => {
    const isVisible = widgetVisibilityState[cardId] !== false;
    const name = widgetRegistry[cardId];
    const item = document.createElement('label');
    item.className = 'widget-toggle-item';
    item.innerHTML = `<span>${name}</span><input type="checkbox" ${isVisible ? 'checked' : ''} onchange="setWidgetVisible('${cardId}', this.checked)">`;
    container.appendChild(item);

    const cardEl = document.getElementById(cardId);
    if (cardEl) cardEl.style.display = isVisible ? 'flex' : 'none';
  });
}

window.setWidgetVisible = function(cardId, isVisible) {
  widgetVisibilityState[cardId] = isVisible;
  localStorage.setItem('sbhub_widget_visibility', JSON.stringify(widgetVisibilityState));

  const cardEl = document.getElementById(cardId);
  if (cardEl) cardEl.style.display = isVisible ? 'flex' : 'none';
};

window.updateGlassOpacity = function(val) {
  const alpha = (val / 100).toFixed(2);
  document.documentElement.style.setProperty('--glass-alpha', alpha);
  const lbl = document.getElementById('opacityValLabel');
  if (lbl) lbl.innerText = `${val}%`;
  localStorage.setItem('sbhub_glass_opacity', val);
};

window.setAccentColor = function(colorHex, swatchEl) {
  document.documentElement.style.setProperty('--accent-glow', colorHex);
  document.querySelectorAll('.color-swatch').forEach(sw => sw.classList.remove('active'));
  if (swatchEl) swatchEl.classList.add('active');
  localStorage.setItem('sbhub_accent_color', colorHex);
};

function restoreAppearanceSettings() {
  const savedOpacity = localStorage.getItem('sbhub_glass_opacity') || "30";
  const slider = document.getElementById('opacitySlider');
  if (slider) slider.value = savedOpacity;
  window.updateGlassOpacity(savedOpacity);

  const savedAccent = localStorage.getItem('sbhub_accent_color');
  if (savedAccent) {
    document.documentElement.style.setProperty('--accent-glow', savedAccent);
  }
}

function isMobileOrTablet() {
  return window.innerWidth <= 1024;
}

window.closeMobileSidebar = function() {
  const sidebar = document.getElementById("mainSidebar");
  const backdrop = document.getElementById("mobileBackdropOverlay");
  if (sidebar) sidebar.classList.remove("mobile-open");
  if (backdrop) backdrop.classList.remove("active");
};

window.toggleMobileSidebar = function() {
  const sidebar = document.getElementById("mainSidebar");
  const backdrop = document.getElementById("mobileBackdropOverlay");
  const isOpen = sidebar && sidebar.classList.contains("mobile-open");
  if (isOpen) window.closeMobileSidebar();
  else {
    if (sidebar) sidebar.classList.add("mobile-open");
    if (backdrop) backdrop.classList.add("active");
  }
};

window.handleNavClick = function(targetTab, action) {
  if (targetTab) {
    document.querySelectorAll('.mobile-nav-item').forEach(item => item.classList.remove('active'));
    targetTab.classList.add('active');
  }
  window.closeMobileSidebar();
  if (action) action();
};

async function fetchRealtimeWeather() {
  const tempEl = document.getElementById("phTemp");
  const descEl = document.getElementById("phDesc");
  if (!tempEl || !descEl) return;

  try {
    const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=14.5995&longitude=120.9842&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia%2FManila");
    const data = await response.json();
    if (!data.current) return;

    tempEl.innerText = `${Math.round(data.current.temperature_2m)}°C`;
    descEl.innerText = "Clear Sky";
  } catch (e) {
    descEl.innerText = "Unavailable";
  }
}

window.switchDockTab = function(tabKey, btnEl) {
  const card = btnEl.closest('.bento-card');
  if (!card) return;
  card.querySelectorAll('.dock-pill-btn').forEach(btn => btn.classList.remove('active'));
  card.querySelectorAll('.dock-content-panel').forEach(panel => panel.classList.remove('active'));
  btnEl.classList.add('active');
  const targetPanel = card.querySelector(`#dock-${tabKey}`);
  if (targetPanel) targetPanel.classList.add('active');
};

async function fetchLiveGames() {
  const container = document.getElementById("topGamesList");
  if (!container) return;
  container.innerHTML = `<div style="text-align:center; padding:15px; color:var(--text-sub);">Loading live feeds...</div>`;
}

function renderClocks() {
  const grid = document.getElementById("timezoneGrid");
  if (!grid) return;
  grid.innerHTML = "";
  selectedTimezones.forEach((tzZone, index) => {
    const timeString = new Date().toLocaleTimeString("en-US", { timeZone: tzZone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const item = document.createElement("div"); item.className = "tz-item";
    item.innerHTML = `<div class="tz-clock" id="clock_${index}">${timeString}</div>`;
    grid.appendChild(item);
  });
}

function updateClocksTick() {
  selectedTimezones.forEach((tzZone, index) => {
    const clockEl = document.getElementById(`clock_${index}`);
    if (clockEl) {
      clockEl.innerText = new Date().toLocaleTimeString("en-US", { timeZone: tzZone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    }
  });
}

function restoreBentoLayout() {
  if (isMobileOrTablet()) return;
  const saved = localStorage.getItem("sbhub_bento_layout_clean_v10");
  if (saved) {
    try {
      const layoutToApply = JSON.parse(saved);
      for (const id in layoutToApply) {
        const el = document.getElementById(id);
        if (el && layoutToApply[id].top) { 
          el.style.top = layoutToApply[id].top; 
          el.style.left = layoutToApply[id].left; 
        }
      }
    } catch(e){}
  }
}

window.toggleModal = function() { 
  const modal = document.getElementById("settingsModal"); 
  if (modal) modal.style.display = (modal.style.display === "flex") ? "none" : "flex"; 
};

window.toggleTheme = function() { 
  const isLight = document.getElementById("modeToggle")?.checked; 
  if (isLight) document.body.classList.add("light-mode"); 
  else document.body.classList.remove("light-mode"); 
};

window.toggleMobileView = function() { 
  const mobileToggle = document.getElementById("mobileViewToggle"); 
  if (mobileToggle && mobileToggle.checked) document.body.classList.add("mobile-view-active"); 
  else document.body.classList.remove("mobile-view-active"); 
};


/* ==========================================
   4. 3D PHYSICS SNOW, GIRL & SNOWMAN ENGINE
   ========================================== */

function initSnowEffect() {
  const canvas = document.getElementById('snowCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const colWidth = 4;
  let numCols = Math.ceil(width / colWidth);
  let groundHeights = new Float32Array(numCols).fill(0);

  let snowmanXRatio = 0.35 + Math.random() * 0.3;
  let snowmanVolume = 0;
  const maxSnowmanVolume = 450;
  let isMelting = false;
  let meltTimer = 0;
  let hasDecorations = false;

  function loadSnowState() {
    const saved = localStorage.getItem('sbhub_snow_data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.groundHeights && Array.isArray(data.groundHeights)) {
          for (let i = 0; i < numCols; i++) groundHeights[i] = data.groundHeights[i] || 0;
        }
        if (typeof data.snowmanVolume === 'number') snowmanVolume = data.snowmanVolume;
        if (typeof data.snowmanXRatio === 'number') snowmanXRatio = data.snowmanXRatio;
        if (typeof data.hasDecorations === 'boolean') hasDecorations = data.hasDecorations;
      } catch (e) {}
    }
  }

  function saveSnowState() {
    localStorage.setItem('sbhub_snow_data', JSON.stringify({
      groundHeights: Array.from(groundHeights),
      snowmanVolume: snowmanVolume,
      snowmanXRatio: snowmanXRatio,
      hasDecorations: hasDecorations
    }));
  }

  loadSnowState();

  let isMouseActive = false;
  let mouseTimer = null;
  window.addEventListener('mousemove', () => {
    isMouseActive = true;
    clearTimeout(mouseTimer);
    mouseTimer = setTimeout(() => { isMouseActive = false; }, 2200);
  });

  const numFlakes = 100;
  const flakes = Array.from({ length: numFlakes }, () => ({
    x: Math.random() * width, y: Math.random() * (height * 0.8),
    r: Math.random() * 2.5 + 1.2, z: Math.random() * 0.9 + 0.3,
    d: Math.random() * 0.8 + 0.4, opacity: Math.random() * 0.6 + 0.4,
    sway: Math.random() * Math.PI * 2, swaySpeed: Math.random() * 0.02 + 0.01
  }));

  const girl = { x: 60, targetX: 60, state: 'ROAMING', prevState: 'ROAMING', timer: 0, frame: 0, speed: 1.6, facingRight: true, snowBallRadius: 0 };

  function handleFlakeCollision(f) {
    let col = Math.floor(f.x / colWidth);
    if (col < 0) col = 0; if (col >= numCols) col = numCols - 1;
    let currentGroundY = height - groundHeights[col];

    if (f.y >= currentGroundY) {
      if (!isMelting && groundHeights[col] < 55) {
        groundHeights[col] += 0.4 * f.z;
        if (col > 0) groundHeights[col - 1] += 0.2 * f.z;
        if (col < numCols - 1) groundHeights[col + 1] += 0.2 * f.z;
      }
      f.y = -10; f.x = Math.random() * width;
    }
  }

  function drawSnowman(x, baseY, volume, meltRatio) {
    if (volume <= 0) return;
    ctx.save();
    
    const buildProgress = Math.min(1.0, volume / maxSnowmanVolume);
    const bottomR = Math.min(38, buildProgress * 2.2 * 38);
    const middleR = buildProgress > 0.25 ? Math.min(26, (buildProgress - 0.25) * 2.2 * 26) : 0;
    const headR = buildProgress > 0.55 ? Math.min(17, (buildProgress - 0.55) * 2.2 * 17) : 0;
    const meltYOffset = meltRatio * 25;
    ctx.globalAlpha = Math.max(0, 1 - meltRatio * 0.9);

    function draw3DSphere(cx, cy, radius) {
      const grad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
      grad.addColorStop(0, "#ffffff"); grad.addColorStop(0.65, "#f1f5f9"); grad.addColorStop(1, "#94a3b8");
      ctx.beginPath(); ctx.fillStyle = grad; ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fill();
    }

    if (bottomR > 1) draw3DSphere(x, baseY - bottomR * 0.7 + meltYOffset * 0.3, bottomR);
    if (middleR > 1) {
      const mY = baseY - bottomR * 1.3 - middleR * 0.7 + meltYOffset * 0.6;
      draw3DSphere(x, mY, middleR);
      if (hasDecorations) {
        ctx.strokeStyle = "#582f0e"; ctx.lineWidth = 3.5; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(x - middleR * 0.8, mY); ctx.lineTo(x - middleR - 22, mY - 12); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + middleR * 0.8, mY); ctx.lineTo(x + middleR + 22, mY - 14); ctx.stroke();
      }
    }
    if (headR > 1) {
      const hY = baseY - bottomR * 1.3 - middleR * 1.3 - headR * 0.7 + meltYOffset;
      draw3DSphere(x, hY, headR);
      if (buildProgress > 0.4) {
        ctx.fillStyle = "#0f172a"; ctx.beginPath();
        ctx.arc(x - 5, hY - 3, 2, 0, Math.PI * 2); ctx.arc(x + 5, hY - 3, 2, 0, Math.PI * 2); ctx.fill();
      }
      if (hasDecorations) {
        ctx.fillStyle = "#ea580c"; ctx.beginPath();
        ctx.moveTo(x, hY); ctx.lineTo(x + 18, hY + 3); ctx.lineTo(x, hY + 5); ctx.closePath(); ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawGirl(x, y, state, frame, facingRight = true) {
    ctx.save(); ctx.translate(x, y);
    if (!facingRight) ctx.scale(-1, 1);

    const isWalking = (state === 'ROAMING' || state === 'ROLL_SNOW' || state === 'FETCH_ITEMS');
    const legSwing = isWalking ? Math.sin(frame * 0.25) * 8 : 0;

    // Shadow
    ctx.fillStyle = "rgba(15, 23, 42, 0.28)";
    ctx.beginPath(); ctx.ellipse(0, 0, 14, 4.5, 0, 0, Math.PI * 2); ctx.fill();

    // Body & Dress
    ctx.strokeStyle = "#fed7aa"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-3, -22); ctx.lineTo(-3 - legSwing, -4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(3, -22); ctx.lineTo(3 + legSwing, -4); ctx.stroke();

    ctx.fillStyle = "#a855f7";
    ctx.beginPath(); ctx.moveTo(0, -42); ctx.lineTo(-14, -20); ctx.quadraticCurveTo(0, -16, 14, -20); ctx.closePath(); ctx.fill();

    // Head
    ctx.fillStyle = "#fed7aa"; ctx.fillRect(-2, -46, 4, 6);
    ctx.beginPath(); ctx.arc(0, -54, 12, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#facc15";
    ctx.beginPath(); ctx.arc(-2, -54, 15, Math.PI * 0.5, Math.PI * 1.8); ctx.fill();
    ctx.strokeStyle = "#ec4899"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, -56, 13, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();

    // Arms / Waving
    ctx.strokeStyle = "#fed7aa"; ctx.lineWidth = 3.5;
    if (state === 'WAVING') {
      const waveAngle = Math.sin(frame * 0.35) * 0.5;
      ctx.beginPath(); ctx.moveTo(6, -40); ctx.lineTo(14 + waveAngle * 10, -58); ctx.stroke();
    } else if (state === 'ROLL_SNOW') {
      ctx.beginPath(); ctx.moveTo(2, -38); ctx.lineTo(14, -28); ctx.stroke();
      const sR = Math.min(18, 6 + girl.snowBallRadius);
      ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(18 + sR, -sR + 4, sR, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.beginPath(); ctx.moveTo(-4, -40); ctx.lineTo(-4, -28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(4, -40); ctx.lineTo(4, -28); ctx.stroke();
    }

    ctx.restore();
  }

  function updateGirl(snowmanX) {
    girl.frame++;
    const siteX = snowmanX - 35;

    if (isMouseActive && girl.state !== 'WAVING') {
      girl.prevState = girl.state;
      girl.state = 'WAVING';
      girl.timer = 0;
    }

    if (girl.state === 'WAVING') {
      girl.timer++;
      if (girl.timer > 75 && !isMouseActive) {
        girl.state = girl.prevState || 'ROAMING';
      }
      return;
    }

    if (snowmanVolume < maxSnowmanVolume) {
      if (girl.state === 'ROAMING' || girl.state === 'ADMIRING') {
        girl.state = 'ROLL_SNOW'; girl.x = 40; girl.snowBallRadius = 2;
      }

      if (girl.state === 'ROLL_SNOW') {
        girl.facingRight = true;
        girl.snowBallRadius += 0.05;
        if (girl.x < siteX) {
          girl.x += girl.speed * 1.1;
        } else {
          snowmanVolume = Math.min(maxSnowmanVolume, snowmanVolume + 45);
          saveSnowState();
          girl.x = 40; girl.snowBallRadius = 2;
        }
      }
    } else if (!hasDecorations) {
      if (girl.state !== 'FETCH_ITEMS' && girl.state !== 'DECORATING') {
        girl.state = 'FETCH_ITEMS'; girl.x = 20;
      }

      if (girl.state === 'FETCH_ITEMS') {
        girl.facingRight = true;
        if (girl.x < siteX) girl.x += girl.speed;
        else { girl.state = 'DECORATING'; girl.timer = 0; }
      }

      if (girl.state === 'DECORATING') {
        girl.timer++;
        if (girl.timer > 50) {
          hasDecorations = true; saveSnowState();
          girl.state = 'ADMIRING'; girl.timer = 0;
        }
      }
    } else {
      if (girl.state === 'ADMIRING') {
        girl.timer++;
        if (girl.timer > 90) {
          girl.state = 'ROAMING';
          girl.targetX = Math.random() * (width - 120) + 40;
        }
      }

      if (girl.state === 'ROAMING') {
        if (Math.abs(girl.x - girl.targetX) > 5) {
          girl.facingRight = (girl.targetX > girl.x);
          girl.x += girl.facingRight ? girl.speed * 0.8 : -girl.speed * 0.8;
        } else {
          girl.timer++;
          if (girl.timer > 120) {
            girl.targetX = Math.random() * (width - 120) + 40;
            girl.timer = 0;
          }
        }
      }
    }
  }

  function drawGroundTerrain() {
    ctx.save();
    let maxH = 15;
    for (let c = 0; c < numCols; c++) { if (groundHeights[c] > maxH) maxH = groundHeights[c]; }

    const groundGrad = ctx.createLinearGradient(0, height - maxH - 10, 0, height);
    groundGrad.addColorStop(0, "#ffffff"); groundGrad.addColorStop(1, "rgba(148, 163, 184, 0.95)");

    ctx.fillStyle = groundGrad; ctx.beginPath(); ctx.moveTo(0, height);
    for (let c = 0; c < numCols; c++) { ctx.lineTo(c * colWidth, height - groundHeights[c]); }
    ctx.lineTo(width, height); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    flakes.forEach((f) => {
      ctx.beginPath(); ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
      ctx.arc(f.x, f.y, f.r * f.z, 0, Math.PI * 2); ctx.fill();
      f.sway += f.swaySpeed; f.y += f.d * f.z;
      f.x += Math.sin(f.sway) * 0.4 * f.z;
      handleFlakeCollision(f);
    });

    drawGroundTerrain();
    const snowmanX = width * snowmanXRatio;
    const snowmanCol = Math.floor(snowmanX / colWidth);
    const groundY = height - (groundHeights[snowmanCol] || 0);

    drawSnowman(snowmanX, groundY, snowmanVolume, meltRatio);

    updateGirl(snowmanX);
    const girlCol = Math.floor(Math.max(0, girl.x) / colWidth);
    const girlGroundY = height - (groundHeights[girlCol] || 0);
    drawGirl(girl.x, girlGroundY, girl.state, girl.frame, girl.facingRight);

    requestAnimationFrame(render);
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    numCols = Math.ceil(width / colWidth);
    groundHeights = new Float32Array(numCols).fill(0);
  });

  render();
}


/* ==========================================
   5. FAIL-SAFE APPLICATION BOOTSTRAPPER
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  try { window.checkRememberedSession(); } catch(e) { console.error("Session check error:", e); }
  
  try { restoreBentoLayout(); } catch(e){}
  try { restoreAppearanceSettings(); } catch(e){}
  try { initWallpaperPicker(); } catch(e){}
  try { initWidgetManagerUI(); } catch(e){}
  try { fetchLiveGames(); } catch(e){}
  try { fetchRealtimeWeather(); } catch(e){}
  try { renderClocks(); setInterval(updateClocksTick, 1000); } catch(e){}
  try { initSnowEffect(); } catch(e) { console.error("Snow Canvas Error:", e); }
});
