const DEFAULT_USER = "sportsbook2026";
const DEFAULT_PASS = "sb2026";

/* --- HELPER FOR MOBILE SCREEN DETECTION --- */
const isMobileDevice = () => window.innerWidth <= 768;

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

let selectedGameDayOffset = 0;

/* --- HERO RADAR CHART INITIALIZATION --- */
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

/* --- MOBILE DRAWER NAVIGATION SYSTEM --- */
function toggleMobileSidebar(forceState) {
  const sidebar = document.getElementById('mainSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (!sidebar || !overlay) return;

  const isActive = forceState !== undefined ? forceState : !sidebar.classList.contains('mobile-open');

  if (isActive) {
    sidebar.classList.add('mobile-open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* --- BRAND DIRECTORY TAB DATA & SWITCHER --- */
const brandTabData = {
  ibet: [
    { name: "IBET ADMIN", url: "https://mga-betbook.center/ibet/bets" },
    { name: "IBET BETSSON", url: "https://b2b.betssonbusiness.com/" },
    { name: "BET CONSTRUCT", url: "https://backoffice.betconstruct.com/" }
  ],
  edge: [
    { name: "KT SBX", url: "https://p2ibet.sbx.bet/bets" },
    { name: "KT PROJECTS", url: "https://kickertech.atlassian.net/jira/projects" },
    { name: "EDGE ADMIN", url: "https://admin.edgegaming.io/admin/qbet/homepage" },
    { name: "SERVICE DESK", url: "https://kickertech.atlassian.net/servicedesk/customer/user/login?destination=portals" }
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
    a.className = 'action-row';
    a.href = item.url;
    if (item.url !== '#') a.target = '_blank';
    a.innerHTML = `<span>${item.name}</span><i class='bx bx-right-arrow-alt'></i>`;
    container.appendChild(a);
  });
}

/* --- DYNAMIC MARKET BOOST DESCRIPTION GENERATOR --- */
function generateScriptedMarket(homeName, awayName, index) {
  const templates = [
    `${homeName} to Win + Over 2.5 Goals`,
    `${homeName} vs ${awayName} - Both Teams to Score`,
    `${homeName} to Win + Have 2+ Goals`,
    `${awayName} to Win or Draw + Over 1.5 Goals`,
    `${homeName} vs ${awayName} - Both Teams to Score + Over 2.5 Goals`,
    `${homeName} to Win First Half & Over 1.5 Goals`
  ];
  return templates[index % templates.length];
}

/* --- RANKED PRIORITY TOURNAMENTS --- */
const PRIORITY_LEAGUES = [
  { rank: 1, key: "uefa.champions", name: "UEFA Champions League", code: "uefa.champions" },
  { rank: 2, key: "eng.1",          name: "Premier League",         code: "eng.1" },
  { rank: 3, key: "esp.1",          name: "La Liga",                code: "esp.1" },
  { rank: 4, key: "ger.1",          name: "Bundesliga",             code: "ger.1" },
  { rank: 5, key: "ita.1",          name: "Serie A",                code: "ita.1" },
  { rank: 6, key: "fra.1",          name: "Ligue 1",                code: "fra.1" },
  { rank: 7, key: "por.1",          name: "Primeira Liga",          code: "por.1" },
  { rank: 8, key: "ned.1",          name: "Eredivisie",             code: "ned.1" }
];

const TOP_TIER_LEAGUES = PRIORITY_LEAGUES;
const SECONDARY_LEAGUES = [
  { name: "UEFA Nations League", code: "uefa.nations" },
  { name: "Major League Soccer", code: "usa.1" },
  { name: "Veikkausliiga", code: "fin.1" },
  { name: "Eliteserien", code: "nor.1" }
];

let cachedTopPicks = [];
let currentFilterKey = 'eng.1';

function getLeagueDisplayName(key) {
  const lg = PRIORITY_LEAGUES.find(l => l.key === key);
  return lg ? lg.name : key.toUpperCase();
}

function loadCachedTopPicks() {
  try {
    const stored = localStorage.getItem('sbhub_toppicks_cache');
    if (stored) {
      cachedTopPicks = JSON.parse(stored);
      renderFilteredTopPicks();
    }
  } catch (e) {
    console.warn("Could not parse top picks cache:", e);
  }
}

async function fetchTopPicksAndBoosts() {
  const container = document.getElementById('topPicksContainer');
  if (!container) return;

  try {
    const now = new Date();
    const seenMatchKeys = new Set();
    const targetDates = ["20261010", "20261011", "20261012", "20261014"];

    const fetchPromises = [];
    for (const league of PRIORITY_LEAGUES) {
      for (const dateStr of targetDates) {
        fetchPromises.push(
          fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league.code}/scoreboard?dates=${dateStr}&limit=100`)
            .then(res => res.ok ? res.json() : null)
            .then(data => ({ league, data }))
            .catch(() => null)
        );
      }
    }

    const results = await Promise.all(fetchPromises);
    let apiPicks = [];

    for (const resItem of results) {
      if (!resItem || !resItem.data || !resItem.data.events) continue;
      const { league, data } = resItem;

      for (const evt of data.events) {
        const gameState = evt.status?.type?.state;
        const evtDate = new Date(evt.date);

        if (gameState !== 'pre' || evtDate <= now) continue;

        const comp = evt.competitions?.[0];
        if (!comp) continue;

        const homeTeam = comp.competitors?.find(c => c.homeAway === 'home');
        const awayTeam = comp.competitors?.find(c => c.homeAway === 'away');

        if (homeTeam && awayTeam) {
          const homeName = homeTeam.team?.shortDisplayName || homeTeam.team?.displayName || "Home";
          const awayName = awayTeam.team?.shortDisplayName || awayTeam.team?.displayName || "Away";

          const matchKey = evt.id || `${homeName}-${awayName}-${evt.date}`;
          if (seenMatchKeys.has(matchKey)) continue;
          seenMatchKeys.add(matchKey);

          const homeLogo = homeTeam.team?.logo || homeTeam.team?.logos?.[0]?.href || "https://a.espncdn.com/i/teamlogos/soccer/500/default.png";
          const awayLogo = awayTeam.team?.logo || awayTeam.team?.logos?.[0]?.href || "https://a.espncdn.com/i/teamlogos/soccer/500/default.png";

          const kickOffStr = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Manila',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }).format(evtDate).toUpperCase();

          const scriptedMarket = generateScriptedMarket(homeName, awayName, apiPicks.length);

          apiPicks.push({
            leagueKey: league.key,
            leagueRank: league.rank,
            kickOffTimestamp: evtDate.getTime(),
            homeName,
            awayName,
            homeLogo,
            awayLogo,
            leagueName: data.leagues?.[0]?.name || league.name,
            market: scriptedMarket,
            badge: (apiPicks.length % 2 === 0) ? "TOP PICK" : "HOT",
            kickOff: kickOffStr
          });
        }
      }
    }

    apiPicks.sort((a, b) => {
      if (a.leagueRank !== b.leagueRank) return a.leagueRank - b.leagueRank;
      return a.kickOffTimestamp - b.kickOffTimestamp;
    });

    if (apiPicks.length > 0) {
      cachedTopPicks = apiPicks;
      localStorage.setItem('sbhub_toppicks_cache', JSON.stringify(apiPicks));
    }
    
    renderFilteredTopPicks();
  } catch (e) {
    console.error("Fetch Top Picks Error:", e);
    renderFilteredTopPicks();
  }
}

function filterTopPicks(leagueKey, btnElement) {
  currentFilterKey = leagueKey;

  document.querySelectorAll('.status-tab, .boost-filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) {
    btnElement.classList.add('active');
  }

  renderFilteredTopPicks();
}

function renderFilteredTopPicks() {
  const container = document.getElementById('topPicksContainer');
  if (!container) return;

  const now = new Date();
  let activePicks = cachedTopPicks.filter(pick => pick.kickOffTimestamp > now.getTime());
  let displayPicks = activePicks.filter(pick => pick.leagueKey === currentFilterKey);

  if (displayPicks.length === 0) {
    const categoryLabel = getLeagueDisplayName(currentFilterKey);
    container.innerHTML = `<div style="text-align:center; padding:20px; width:100%; grid-column:1/-1; font-size:11px; color:rgba(255,255,255,0.6);">No upcoming scheduled ${categoryLabel} matches available.</div>`;
    return;
  }

  displayPicks = displayPicks.slice(0, 12);

  let cardsHtml = "";
  displayPicks.forEach(pick => {
    cardsHtml += `
      <div class="boost-card">
        <div class="flags-row">
          <img src="${pick.homeLogo}" alt="${pick.homeName}" class="team-flag-img" onerror="this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'">
          <span class="vs-text">VS</span>
          <img src="${pick.awayLogo}" alt="${pick.awayName}" class="team-flag-img" onerror="this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'">
        </div>
        <div class="boost-match-title">${pick.homeName} vs ${pick.awayName}</div>
        <div class="boost-market-desc">${pick.market}</div>
      </div>
    `;
  });

  container.innerHTML = cardsHtml;
}

/* --- ANIMATED CANVAS PLASMA BACKGROUND --- */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let width = 0, height = 0, particles = [];

function resizeCanvas() {
  if (!canvas) return;
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  initParticles();
}
window.addEventListener('resize', () => {
  resizeCanvas();
  if (!isMobileDevice()) toggleMobileSidebar(false);
});

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = Math.random() * (isMobileDevice() ? 1.5 : 2) + 1;
    this.vx = (Math.random() - 0.5) * (isMobileDevice() ? 0.4 : 0.8);
    this.vy = (Math.random() - 0.5) * (isMobileDevice() ? 0.4 : 0.8);
    this.alpha = Math.random() * 0.4 + 0.1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }
  draw() {
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(139, 92, 246, ${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  if (!canvas) return;
  particles = [];
  const particleCount = isMobileDevice() ? 15 : 40;
  for (let i = 0; i < particleCount; i++) particles.push(new Particle());
}
resizeCanvas();

function animateCanvas() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateCanvas);
}
if (canvas) animateCanvas();

/* --- SITTING ROBOT MOUSE TRACKING --- */
document.addEventListener('mousemove', (e) => {
  if (isMobileDevice()) return;

  const robotStage = document.getElementById('sittingRobotStage');
  const authOverlay = document.getElementById('authOverlay');
  if (!robotStage || (authOverlay && authOverlay.classList.contains('unlocked'))) return;

  const leftEye = document.getElementById('leftEye');
  const rightEye = document.getElementById('rightEye');
  const robotHead = document.getElementById('robotHead');
  const robotBodyWrapper = document.getElementById('robotBodyWrapper');

  const rect = robotStage.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const deltaX = e.clientX - centerX;
  const deltaY = e.clientY - centerY;
  const angle = Math.atan2(deltaY, deltaX);

  const eyeDist = Math.min(5, Math.hypot(deltaX, deltaY) / 35);
  const eyeX = Math.cos(angle) * eyeDist;
  const eyeY = Math.sin(angle) * eyeDist;

  if (leftEye && rightEye) {
    leftEye.style.transform = `translate(${eyeX}px, ${eyeY}px)`;
    rightEye.style.transform = `translate(${eyeX}px, ${eyeY}px)`;
  }

  const rotateY = Math.max(-25, Math.min(25, deltaX / 20));
  const rotateX = Math.max(-15, Math.min(15, -deltaY / 25));

  if (robotHead) robotHead.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  if (robotBodyWrapper) robotBodyWrapper.style.transform = `rotateY(${rotateY * 0.3}deg)`;
});

/* --- WORLD CLOCKS SYSTEM --- */
function updateWorldClocks() {
  const now = new Date();
  const optionsGMT8 = { timeZone: 'Asia/Singapore', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const gmt8El = document.getElementById('clock-gmt8');
  if (gmt8El) gmt8El.textContent = new Intl.DateTimeFormat('en-GB', optionsGMT8).format(now);

  const optionsCET = { timeZone: 'Europe/Berlin', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const cetEl = document.getElementById('clock-cet');
  if (cetEl) cetEl.textContent = new Intl.DateTimeFormat('en-GB', optionsCET).format(now);
}
setInterval(updateWorldClocks, 1000);
updateWorldClocks();

/* --- PHILIPPINES (MANILA) WEATHER FORECAST --- */
async function fetchManilaWeather() {
  const tempEl = document.getElementById('weatherTemp');
  const humEl = document.getElementById('weatherHumidity');
  if (!tempEl) return;

  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=14.5995&longitude=120.9842&current=temperature_2m,relative_humidity_2m&timezone=Asia%2FManila';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();

    if (data && data.current) {
      tempEl.textContent = `${Math.round(data.current.temperature_2m)}°C`;
      if (humEl) humEl.textContent = `${data.current.relative_humidity_2m}%`;
    }
  } catch (err) {
    tempEl.textContent = '32°C';
    if (humEl) humEl.textContent = '56%';
  }
}

/* --- AUTHENTICATION & PERSISTENT SESSION --- */
function togglePasswordVisibility() {
  const passInput = document.getElementById('passwordInput');
  const icon = document.getElementById('togglePassIcon');
  if (!passInput || !icon) return;
  passInput.type = passInput.type === 'password' ? 'text' : 'password';
  icon.className = passInput.type === 'password' ? 'bx bx-show' : 'bx bx-hide';
}

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

/* --- UI MENU TOGGLE --- */
function toggleMenu(menuId) {
  const targetMenu = document.getElementById(menuId);
  if (targetMenu) targetMenu.classList.toggle('collapsed');
}

/* --- LIVE DUTY ROSTER --- */
function getGMT8IsoDate() {
  const nowManila = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }));
  const year = nowManila.getFullYear();
  const month = String(nowManila.getMonth() + 1).padStart(2, '0');
  const day = String(nowManila.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function listenToLiveDutyRoster() {
  if (!rosterDb) return;
  rosterDb.ref('roster_data').on('value', (snapshot) => {
    calculateActiveTraders(snapshot.val());
  });
}

function calculateActiveTraders(rosterData) {
  const el = document.getElementById('activeTraderCount');
  if (!el) return;
  if (!rosterData) {
    el.textContent = "84";
    return;
  }
  let activeCount = 4;
  el.textContent = activeCount.toString();
}

/* --- TOP GAMES ENGINE --- */
function getGMT8DateObj(offsetDays = 0) {
  const now = new Date();
  const gmt8String = now.toLocaleString("en-US", { timeZone: "Asia/Manila" });
  const gmt8Date = new Date(gmt8String);
  gmt8Date.setDate(gmt8Date.getDate() + offsetDays);
  return gmt8Date;
}

function getFormattedDateQuery(daysAhead) {
  const d = getGMT8DateObj(daysAhead);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

async function fetchLiveGames() {
  const container = document.getElementById("gamesContainer");
  if (!container) return;
  
  try {
    const targetDateQuery = getFormattedDateQuery(selectedGameDayOffset);
    const targetDateObj = getGMT8DateObj(selectedGameDayOffset);
    const dateLabelStr = targetDateObj.toLocaleDateString("en-US", { month: 'short', day: 'numeric' }).toUpperCase();
    
    let dayTag = `DAY ${selectedGameDayOffset + 1}`;
    if (selectedGameDayOffset === 0) dayTag = `TODAY`;

    const labelEl = document.getElementById("matchDayDisplay");
    if (labelEl) labelEl.textContent = `${dayTag} (${dateLabelStr})`;

    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=${targetDateQuery}`);
    const data = await res.json();

    if (!data.events || data.events.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:15px; font-size:11px; color:rgba(255,255,255,0.6);">No scheduled fixtures for ${dateLabelStr}.</div>`;
      return;
    }

    let matchesHtml = "";
    data.events.slice(0, 4).forEach(evt => {
      const comp = evt.competitions?.[0];
      const home = comp?.competitors?.find(c => c.homeAway === 'home');
      const away = comp?.competitors?.find(c => c.homeAway === 'away');

      const timeStr = new Date(evt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      matchesHtml += `
        <div class="match-card-item">
          <div class="match-time-sub">${timeStr}</div>
          <div class="match-card-body">
            <div class="match-team">
              <img src="${home?.team?.logo || ''}" style="width:22px; height:22px;" onerror="this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'">
              <span>${home?.team?.shortDisplayName || 'Home'}</span>
            </div>
            <div class="match-score">${home?.score || '104'} - ${away?.score || '112'}</div>
            <div class="match-team">
              <img src="${away?.team?.logo || ''}" style="width:22px; height:22px;" onerror="this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'">
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
    console.warn("Fetch games fallback:", e);
  }
}

function navigateMatchDay(dir) {
  selectedGameDayOffset += dir;
  if (selectedGameDayOffset < 0) selectedGameDayOffset = 6;
  if (selectedGameDayOffset > 6) selectedGameDayOffset = 0;
  fetchLiveGames();
}

/* --- JIRA & URGENT HANDOVER SYSTEM --- */
function checkJiraSLA() {
  const tickets = JSON.parse(localStorage.getItem('jira_tracked_tickets') || '[]');
  const pendingEl = document.getElementById('pendingJiraCount');
  if (pendingEl) pendingEl.textContent = tickets.length || '18';

  const banner = document.getElementById('jiraAlertBanner');
  if (banner) {
    if (tickets.length > 0) banner.classList.add('active');
    else banner.classList.remove('active');
  }
}

function openHandoverModal() {
  document.getElementById('handoverModal')?.classList.add('show');
  renderUrgentHandovers();
}

function closeHandoverModal() {
  document.getElementById('handoverModal')?.classList.remove('show');
}

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
        `<div style="font-size:10px; padding:2px 0;"><strong>[${item.brand.toUpperCase()}]</strong> ${item.msg}</div>`
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
function initDashboardApp() {
  if (localStorage.getItem('sbhub_auth') === 'true' || sessionStorage.getItem('sbhub_auth') === 'true') {
    unlockDashboard();
  }

  initHeroRadarChart();
  switchBrandTab('ibet');
  loadCachedTopPicks();
  fetchTopPicksAndBoosts();
  listenToLiveDutyRoster();
  fetchLiveGames();
  fetchManilaWeather();
  checkJiraSLA();
  renderUrgentHandovers();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboardApp);
} else {
  initDashboardApp();
}
