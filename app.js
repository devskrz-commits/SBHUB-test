const DEFAULT_USER = "sportsbook2026";
const DEFAULT_PASS = "sb2026";

/* --- HERO RADAR SPIDER CHART --- */
let heroChartInstance = null;
function initHeroRadarChart() {
  const ctx = document.getElementById('heroRadarChart');
  if (!ctx) return;

  if (heroChartInstance) heroChartInstance.destroy();

  heroChartInstance = new Chart(ctx, {
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
        pointBorderColor: '#ff5747',
        pointRadius: 4
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

/* --- FIREBASE ROSTER --- */
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
  const rememberCheckbox = document.getElementById('rememberMe');

  const userVal = userInput ? userInput.value.trim() : '';
  const passVal = passInput ? passInput.value : '';
  const isRemember = rememberCheckbox ? rememberCheckbox.checked : false;

  const errorMsg = document.getElementById('loginErrorMsg');

  if ((userVal === DEFAULT_USER || userVal === "sportsbookhub") && passVal === DEFAULT_PASS) {
    if (isRemember) {
      localStorage.setItem('sbhub_auth', 'true');
    } else {
      sessionStorage.setItem('sbhub_auth', 'true');
    }
    unlockDashboard();
  } else {
    if (errorMsg) errorMsg.textContent = "ACCESS DENIED: Invalid Security Key";
  }
}

function unlockDashboard() {
  const authOverlay = document.getElementById('authOverlay');
  if (authOverlay) authOverlay.classList.add('unlocked');
}

function handleLogout() {
  localStorage.removeItem('sbhub_auth');
  sessionStorage.removeItem('sbhub_auth');
  const authOverlay = document.getElementById('authOverlay');
  if (authOverlay) authOverlay.classList.remove('unlocked');
}

function togglePasswordVisibility() {
  const passInput = document.getElementById('passwordInput');
  const icon = document.getElementById('togglePassIcon');
  if (!passInput || !icon) return;
  passInput.type = passInput.type === 'password' ? 'text' : 'password';
  icon.className = passInput.type === 'password' ? 'bx bx-show' : 'bx bx-hide';
}

function toggleMenu(menuId) {
  const targetMenu = document.getElementById(menuId);
  if (targetMenu) targetMenu.classList.toggle('collapsed');
}

/* --- TOP BAR ICON PILLS CLICK HANDLER & WIDGET TOGGLE --- */
function toggleWidgetDropdown(e) {
  e.stopPropagation();
  const menu = document.getElementById('widgetMenu');
  if (menu) menu.classList.toggle('show');
}

function toggleWidgetSection(widgetId, show) {
  const el = document.getElementById(widgetId);
  if (el) el.style.display = show ? '' : 'none';
}

function setGradient(themeName) {
  const body = document.getElementById('pageBody');
  if (!body) return;
  if (themeName === 'plain-navy') {
    body.style.background = '#0b1329';
  } else {
    body.style.background = 'linear-gradient(135deg, #1c0b38 0%, #320d5c 50%, #120626 100%)';
  }
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

/* --- MANILA WEATHER --- */
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
    tempEl.textContent = '30°C';
    if (humEl) humEl.textContent = '71%';
  }
}

/* --- BRAND DIRECTORY DOCK --- */
const brandTabData = {
  ibet: [
    { name: "IBET ADMIN", url: "https://mga-betbook.center/ibet/bets" },
    { name: "IBET BETSSON", url: "https://b2b.betssonbusiness.com/" },
    { name: "BET CONSTRUCT", url: "https://backoffice.betconstruct.com/" }
  ],
  edge: [
    { name: "KT SBX", url: "https://p2ibet.sbx.bet/bets" },
    { name: "KT PROJECTS", url: "https://kickertech.atlassian.net/jira/projects" },
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
    a.className = 'nav-sub-btn';
    a.style.cssText = "margin-top: 4px; display: flex; justify-content: space-between;";
    a.href = item.url;
    a.target = '_blank';
    a.innerHTML = `<span>${item.name}</span><i class='bx bx-right-arrow-alt'></i>`;
    container.appendChild(a);
  });
}

/* --- HOT BOOSTS / TOP PICKS RENDERER (IN REFERENCE TABLE DESIGN) --- */
let currentFilterLeague = 'eng.1';

async function filterTopPicks(leagueCode, btnEl) {
  currentFilterLeague = leagueCode;
  if (btnEl) {
    document.querySelectorAll('.status-tab').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
  }

  const tbody = document.getElementById('topPicksTableBody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;"><i class="bx bx-loader-alt bx-spin" style="font-size:20px; color:#8b5cf6;"></i></td></tr>`;

  try {
    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueCode}/scoreboard?limit=10`);
    const data = await res.json();
    
    if (!data.events || data.events.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:15px; font-size:11px; color:rgba(255,255,255,0.6);">No fixtures available for this league.</td></tr>`;
      return;
    }

    let rowsHtml = '';
    data.events.forEach((evt, idx) => {
      const comp = evt.competitions?.[0];
      const home = comp?.competitors?.find(c => c.homeAway === 'home');
      const away = comp?.competitors?.find(c => c.homeAway === 'away');

      const homeName = home?.team?.shortDisplayName || 'Home';
      const awayName = away?.team?.shortDisplayName || 'Away';
      const homeLogo = home?.team?.logo || 'https://a.espncdn.com/i/teamlogos/soccer/500/default.png';
      const awayLogo = away?.team?.logo || 'https://a.espncdn.com/i/teamlogos/soccer/500/default.png';

      const kickoffDate = new Date(evt.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const marketSelection = `${homeName} to Win + Over 2.5 Goals`;
      const oddsVal = (2.10 + (idx * 0.35)).toFixed(2);
      const isHot = idx % 2 === 0;

      rowsHtml += `
        <tr>
          <td>${kickoffDate}</td>
          <td>
            <div class="team-match-cell">
              <img src="${homeLogo}" alt="${homeName}" onerror="this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'">
              <span>${homeName} vs ${awayName}</span>
              <img src="${awayLogo}" alt="${awayName}" onerror="this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'">
            </div>
          </td>
          <td>${marketSelection}</td>
          <td><span class="result-badge ${isHot ? 'hot' : 'win'}">${isHot ? 'HOT BOOST' : 'TOP PICK'}</span></td>
          <td><span class="odds-pill">${oddsVal}</span></td>
          <td>
            <a href="boostschedule.html" target="_blank" style="color:#c4b5fd; font-weight:800; text-decoration:none;">View <i class="bx bx-right-arrow-alt"></i></a>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = rowsHtml;
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:15px; font-size:11px; color:#f87171;">Failed to load boost data.</td></tr>`;
  }
}

/* --- TODAY MATCHDAY TICKER --- */
let selectedGameDayOffset = 0;

function navigateMatchDay(dir) {
  selectedGameDayOffset += dir;
  if (selectedGameDayOffset < -3) selectedGameDayOffset = 3;
  if (selectedGameDayOffset > 3) selectedGameDayOffset = -3;
  fetchLiveGames();
}

async function fetchLiveGames() {
  const container = document.getElementById("gamesContainer");
  if (!container) return;

  try {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + selectedGameDayOffset);
    const dateQuery = targetDate.toISOString().slice(0, 10).replace(/-/g, '');
    const dateLabelStr = targetDate.toLocaleDateString("en-US", { month: 'short', day: 'numeric' }).toUpperCase();

    const labelEl = document.getElementById("matchDayDisplay");
    if (labelEl) labelEl.textContent = `MATCHDAY (${dateLabelStr})`;

    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=${dateQuery}`);
    const data = await res.json();

    if (!data.events || data.events.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:15px; font-size:11px; color:rgba(255,255,255,0.6);">No scheduled fixtures for ${dateLabelStr}.</div>`;
      return;
    }

    let matchesHtml = "";
    data.events.slice(0, 3).forEach(evt => {
      const comp = evt.competitions?.[0];
      const home = comp?.competitors?.find(c => c.homeAway === 'home');
      const away = comp?.competitors?.find(c => c.homeAway === 'away');

      const timeStr = new Date(evt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      matchesHtml += `
        <div class="match-card-item">
          <div class="match-time-sub">${timeStr}</div>
          <div class="match-card-body">
            <div class="match-team">
              <img src="${home?.team?.logo || ''}" onerror="this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'">
              <span>${home?.team?.shortDisplayName || 'Home'}</span>
            </div>
            <div class="match-score">${home?.score || '104'} - ${away?.score || '112'}</div>
            <div class="match-team">
              <img src="${away?.team?.logo || ''}" onerror="this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'">
              <span>${away?.team?.shortDisplayName || 'Away'}</span>
            </div>
          </div>
          <div class="match-tags-row">
            <span class="tag-badge win">W</span>
            <span class="tag-badge loss">L</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = matchesHtml;
  } catch (e) {
    container.innerHTML = `<div style="text-align:center; padding:15px; font-size:11px; color:rgba(255,255,255,0.6);">No scheduled fixtures for today.</div>`;
  }
}

/* --- HANDOVER MODAL --- */
function openHandoverModal() { document.getElementById('handoverModal')?.classList.add('show'); renderUrgentHandovers(); }
function closeHandoverModal() { document.getElementById('handoverModal')?.classList.remove('show'); }

function addUrgentHandover(e) {
  e.preventDefault();
  const brand = document.getElementById('handoverBrandInput')?.value;
  const msg = document.getElementById('handoverMsgInput')?.value;
  const priority = document.getElementById('handoverPriorityInput')?.value;
  if (!brand || !msg) return;

  const list = JSON.parse(localStorage.getItem('sbhub_urgent_handovers') || '[]');
  list.unshift({ brand, msg, priority, timestamp: new Date().toISOString() });
  localStorage.setItem('sbhub_urgent_handovers', JSON.stringify(list));

  document.getElementById('handoverBrandInput').value = '';
  document.getElementById('handoverMsgInput').value = '';
  renderUrgentHandovers();
}

function deleteUrgentHandover(index) {
  const list = JSON.parse(localStorage.getItem('sbhub_urgent_handovers') || '[]');
  list.splice(index, 1);
  localStorage.setItem('sbhub_urgent_handovers', JSON.stringify(list));
  renderUrgentHandovers();
}

function renderUrgentHandovers() {
  const list = JSON.parse(localStorage.getItem('sbhub_urgent_handovers') || '[]');
  const container = document.getElementById('handoverPillsContainer');
  const modalList = document.getElementById('handoverModalList');

  if (container) {
    if (list.length === 0) {
      container.innerHTML = '<span style="font-size:10px; opacity:0.7;">No active handover notes.</span>';
    } else {
      container.innerHTML = list.slice(0, 2).map(item => 
        `<div style="font-size:10px;"><strong>[${item.brand.toUpperCase()}]</strong> ${item.msg}</div>`
      ).join('');
    }
  }

  if (modalList) {
    if (list.length === 0) {
      modalList.innerHTML = '<div style="font-size:11px; opacity:0.7; text-align:center;">No active handovers.</div>';
    } else {
      modalList.innerHTML = list.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:8px; margin-top:6px; font-size:11px;">
          <div><strong>[${item.brand.toUpperCase()}]</strong> ${item.msg}</div>
          <button type="button" onclick="deleteUrgentHandover(${idx})" style="background:#34d399; border:none; color:#120626; padding:3px 8px; border-radius:4px; font-weight:800; cursor:pointer;">Done</button>
        </div>
      `).join('');
    }
  }
}

/* --- INITIALIZATION --- */
window.addEventListener('click', () => {
  document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
});

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('sbhub_auth') === 'true' || sessionStorage.getItem('sbhub_auth') === 'true') {
    unlockDashboard();
  }
  initHeroRadarChart();
  updateWorldClocks();
  fetchManilaWeather();
  switchBrandTab('ibet');
  filterTopPicks('eng.1');
  fetchLiveGames();
  renderUrgentHandovers();
});
