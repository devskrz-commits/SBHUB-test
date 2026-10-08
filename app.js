const DEFAULT_USER = "sportsbook2026";
const DEFAULT_PASS = "sb2026";

/* --- RADAR CHART INITIALIZATION (SCREENSHOT GRAPH) --- */
function initHeroRadarChart() {
  const ctx = document.getElementById('heroRadarChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['PPG', 'RPG', 'APG', 'FG%', '3P%'],
      datasets: [{
        label: 'Metrics',
        data: [29.1, 24.6, 10.3, 57.5, 41.0],
        backgroundColor: 'rgba(255, 87, 71, 0.25)',
        borderColor: '#ff5747',
        borderWidth: 2,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#ff5747'
      }]
    },
    options: {
      responsive: false,
      scales: {
        r: {
          angleLines: { color: 'rgba(255, 255, 255, 0.15)' },
          grid: { color: 'rgba(255, 255, 255, 0.15)' },
          pointLabels: { display: false },
          ticks: { display: false }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

/* --- FIREBASE ROSTER INITIALIZATION --- */
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
  console.warn("Firebase offline or blocked.", e);
}

/* --- AUTHENTICATION ENGINE --- */
function handleLogin(event) {
  event.preventDefault();
  const userInput = document.getElementById('usernameInput');
  const passInput = document.getElementById('passwordInput');
  const userVal = userInput ? userInput.value.trim() : '';
  const passVal = passInput ? passInput.value : '';

  if ((userVal === DEFAULT_USER || userVal === "sportsbookhub") && passVal === DEFAULT_PASS) {
    localStorage.setItem('sbhub_auth', 'true');
    unlockDashboard();
  } else {
    document.getElementById('loginErrorMsg').textContent = "ACCESS DENIED: Invalid Security Key";
  }
}

function unlockDashboard() {
  const authOverlay = document.getElementById('authOverlay');
  if (authOverlay) authOverlay.classList.add('unlocked');
}

function handleLogout() {
  localStorage.removeItem('sbhub_auth');
  const authOverlay = document.getElementById('authOverlay');
  if (authOverlay) authOverlay.classList.remove('unlocked');
}

/* --- MENU TOGGLES --- */
function toggleMenu(menuId, btnElement) {
  const targetMenu = document.getElementById(menuId);
  if (!targetMenu) return;
  targetMenu.classList.toggle('collapsed');
}

/* --- WORLD CLOCKS --- */
function updateWorldClocks() {
  const now = new Date();
  const optionsGMT8 = { timeZone: 'Asia/Singapore', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const optionsCET = { timeZone: 'Europe/Berlin', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };

  const gmt8El = document.getElementById('clock-gmt8');
  if (gmt8El) gmt8El.textContent = new Intl.DateTimeFormat('en-GB', optionsGMT8).format(now);

  const cetEl = document.getElementById('clock-cet');
  if (cetEl) cetEl.textContent = new Intl.DateTimeFormat('en-GB', optionsCET).format(now);
}
setInterval(updateWorldClocks, 1000);

/* --- WEATHER ENGINE --- */
async function fetchManilaWeather() {
  const tempEl = document.getElementById('weatherTemp');
  const humEl = document.getElementById('weatherHumidity');
  if (!tempEl) return;

  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=14.5995&longitude=120.9842&current=temperature_2m,relative_humidity_2m&timezone=Asia%2FManila';
    const response = await fetch(url);
    const data = await response.json();
    tempEl.textContent = `${Math.round(data.current.temperature_2m)}°C`;
    if (humEl) humEl.textContent = `${data.current.relative_humidity_2m}%`;
  } catch (err) {
    tempEl.textContent = '32°C';
    if (humEl) humEl.textContent = '56%';
  }
}

/* --- BRAND DIRECTORY DOCK --- */
const brandTabData = {
  ibet: [
    { name: "IBET ADMIN", url: "https://mga-betbook.center/ibet/bets" },
    { name: "BET CONSTRUCT", url: "https://backoffice.betconstruct.com/" }
  ],
  edge: [
    { name: "KT SBX", url: "https://p2ibet.sbx.bet/bets" },
    { name: "EDGE ADMIN", url: "https://admin.edgegaming.io/admin/qbet/homepage" }
  ],
  pubs: [
    { name: "GO GAMING", url: "https://gg-backoffice-eu.gogaming.cc/en-US/member/list" }
  ]
};

function switchBrandTab(tabName) {
  document.querySelectorAll('.tab-pill').forEach(pill => pill.classList.remove('active'));
  const activePill = document.getElementById(`tab-${tabName}`);
  if (activePill) activePill.classList.add('active');

  const container = document.getElementById('brandLinksContainer');
  if (!container) return;
  container.innerHTML = '';

  const items = brandTabData[tabName] || [];
  items.forEach(item => {
    const a = document.createElement('a');
    a.style.cssText = "display:flex; justify-content:space-between; padding:6px 10px; background:rgba(255,255,255,0.05); border-radius:8px; color:#fff; text-decoration:none; font-size:10px; margin-top:4px;";
    a.href = item.url;
    a.target = '_blank';
    a.innerHTML = `<span>${item.name}</span><i class='bx bx-right-arrow-alt'></i>`;
    container.appendChild(a);
  });
}

/* --- INITIALIZATION --- */
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('sbhub_auth') === 'true') {
    unlockDashboard();
  }
  initHeroRadarChart();
  updateWorldClocks();
  fetchManilaWeather();
  switchBrandTab('ibet');
});
