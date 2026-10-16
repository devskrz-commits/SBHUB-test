const DEFAULT_USER = "sportsbook2026";
const DEFAULT_PASS = "sb2026";

const isMobileDevice = () => window.innerWidth <= 768;

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

function toggleTopDropdown(event, btnElement) {
  if (event) event.stopPropagation();
  const targetBtn = btnElement || (event ? event.currentTarget : null);
  if (!targetBtn) return;

  const group = targetBtn.closest('.top-nav-dropdown-group');
  if (!group) return;

  const isAlreadyActive = group.classList.contains('active');
  document.querySelectorAll('.top-nav-dropdown-group').forEach(g => {
    if (g !== group) g.classList.remove('active');
  });

  if (isAlreadyActive) {
    group.classList.remove('active');
  } else {
    group.classList.add('active');
  }
}

function toggleMobileTopMenu(forceState) {
  const menu = document.getElementById('topNavMenu');
  if (!menu) return;
  const isActive = forceState !== undefined ? forceState : !menu.classList.contains('mobile-show');
  if (isActive) {
    menu.classList.add('mobile-show');
    document.body.style.overflow = 'hidden';
  } else {
    menu.classList.remove('mobile-show');
    document.body.style.overflow = '';
  }
}

function filterTopNav(query) {
  const term = (query || '').toLowerCase().trim();
  const groups = document.querySelectorAll('.top-nav-dropdown-group');

  groups.forEach(group => {
    const btn = group.querySelector('.top-nav-btn');
    const links = group.querySelectorAll('.top-dropdown-link');
    let hasMatch = false;

    if (!term) {
      group.style.display = '';
      links.forEach(l => l.style.display = '');
      group.classList.remove('active');
      return;
    }

    if (btn && btn.textContent.toLowerCase().includes(term)) hasMatch = true;

    links.forEach(link => {
      const match = link.textContent.toLowerCase().includes(term);
      link.style.display = match ? 'flex' : 'none';
      if (match) hasMatch = true;
    });

    group.style.display = hasMatch ? 'inline-block' : 'none';
    if (hasMatch) group.classList.add('active');
    else group.classList.remove('active');
  });
}

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
    a.rel = 'noreferrer';
    a.innerHTML = `<span>${item.name}</span><i class='bx bx-right-arrow-alt'></i>`;
    container.appendChild(a);
  });
}

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

const PRIORITY_LEAGUES = [
  { rank: 1, key: "uefa.champions", name: "UEFA Champions League", code: "uefa.champions" },
  { rank: 2, key: "eng.1",          name: "Premier League",         code: "eng.1" },
  { rank: 3, key: "esp.1",          name: "La Liga",                code: "esp.1" },
  { rank: 4, key: "ger.1",          name: "Bundesliga",             code: "ger.1" },
  { rank: 5, key: "ita.1",          name: "Serie A",                code: "ita.1" }
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
    const targetDates = ["20261010", "20261011", "20261012", "20261014", "20261015", "20261016"];

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
  document.querySelectorAll('.boost-filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
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
    container.innerHTML = `<div style="text-align:center; padding:20px; width:100%; font-size:11px; font-weight:600; color:rgba(255,255,255,0.65);">No upcoming scheduled ${categoryLabel} matches available at this time.</div>`;
    return;
  }

  displayPicks = displayPicks.slice(0, 12);
  let cardsHtml = "";
  displayPicks.forEach(pick => {
    const isTopPick = pick.badge === "TOP PICK";
    cardsHtml += `
      <div class="boost-card ${isTopPick ? 'highlight-border' : ''}">
        <div class="flags-row">
          <img src="${pick.homeLogo}" alt="${pick.homeName}" class="team-flag-img" onerror="this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'">
          <span class="vs-text">VS</span>
          <img src="${pick.awayLogo}" alt="${pick.awayName}" class="team-flag-img" onerror="this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'">
        </div>
        <div class="boost-match-info">
          <div class="boost-match-title">${pick.homeName} <span class="vs-light">vs</span> ${pick.awayName}</div>
          <div class="boost-league-sub">${pick.leagueName}</div>
        </div>
        <div><span class="boost-badge ${isTopPick ? 'top-pick' : 'hot'}">${pick.badge}</span></div>
        <div class="boost-market-desc">${pick.market}</div>
        <div class="boost-card-bottom">
          <div class="boost-kickoff-pill"><i class='bx bx-time-five'></i> ${pick.kickOff}</div>
        </div>
      </div>
    `;
  });
  container.innerHTML = cardsHtml;
}

/* --- CANVAS PARTICLES --- */
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
  if (!isMobileDevice()) toggleMobileTopMenu(false);
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
    ctx.fillStyle = `rgba(56, 189, 248, ${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  if (!canvas) return;
  particles = [];
  const count = isMobileDevice() ? 15 : 45;
  for (let i = 0; i < count; i++) particles.push(new Particle());
}
resizeCanvas();

function animateCanvas() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateCanvas);
}
if (canvas) animateCanvas();

/* --- ROBOT TRACKING --- */
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

/* --- WORLD CLOCKS --- */
function updateWorldClocks() {
  const now = new Date();
  const fmt = (zone) => new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now);
  
  const gmt8 = document.getElementById('clock-gmt8');
  if (gmt8) gmt8.textContent = fmt('Asia/Singapore');
  const cet = document.getElementById('clock-cet');
  if (cet) cet.textContent = fmt('Europe/Berlin');
  const gmt2 = document.getElementById('clock-gmt2');
  if (gmt2) gmt2.textContent = fmt('Europe/Athens');
}
setInterval(updateWorldClocks, 1000);
updateWorldClocks();

/* --- WEATHER --- */
async function fetchManilaWeather() {
  const tempEl = document.getElementById('weatherTemp');
  const condEl = document.getElementById('weatherCond');
  const humEl = document.getElementById('weatherHumidity');
  const windEl = document.getElementById('weatherWind');

  if (!tempEl) return;
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=14.5995&longitude=120.9842&current_weather=true&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia%2FManila');
    if (!res.ok) throw new Error();
    const data = await res.json();
    const temp = Math.round(data.current?.temperature_2m ?? 32);
    const hum = data.current?.relative_humidity_2m ?? 56;
    const wind = Math.round(data.current?.wind_speed_10m ?? 7);

    tempEl.textContent = `${temp}°C`;
    if (condEl) condEl.textContent = 'PARTLY CLOUDY';
    if (humEl) humEl.textContent = `Humidity: ${hum}%`;
    if (windEl) windEl.textContent = `Wind: ${wind} km/h`;
  } catch (e) {
    tempEl.textContent = '32°C';
  }
}

/* --- AUTHENTICATION --- */
function togglePasswordVisibility() {
  const passInput = document.getElementById('passwordInput');
  const icon = document.getElementById('togglePassIcon');
  if (!passInput || !icon) return;
  if (passInput.type === 'password') {
    passInput.type = 'text';
    icon.className = 'bx bx-hide';
  } else {
    passInput.type = 'password';
    icon.className = 'bx bx-show';
  }
}

function handleLogin(event) {
  event.preventDefault();
  const userVal = document.getElementById('usernameInput')?.value.trim() || '';
  const passVal = document.getElementById('passwordInput')?.value || '';
  const isRemember = document.getElementById('rememberMe')?.checked || false;
  const errorMsg = document.getElementById('loginErrorMsg');
  const card = document.getElementById('loginCard');

  if ((userVal === DEFAULT_USER || userVal === "sportsbookhub") && passVal === DEFAULT_PASS) {
    if (isRemember) localStorage.setItem('sbhub_auth', 'true');
    else sessionStorage.setItem('sbhub_auth', 'true');
    unlockDashboard();
  } else {
    if (errorMsg) errorMsg.textContent = "ACCESS DENIED: Invalid Security Key";
    if (card) {
      card.classList.add('shake');
      setTimeout(() => card.classList.remove('shake'), 500);
    }
  }
}

function unlockDashboard() {
  document.getElementById('authOverlay')?.classList.add('unlocked');
  document.getElementById('dashboardApp')?.classList.add('unlocked');
}

function handleLogout() {
  localStorage.removeItem('sbhub_auth');
  sessionStorage.removeItem('sbhub_auth');
  document.getElementById('authOverlay')?.classList.remove('unlocked');
  document.getElementById('dashboardApp')?.classList.remove('unlocked');
}

function toggleDropdown(menuId) {
  document.getElementById(menuId)?.classList.toggle('show');
}

function setGradient(theme) {
  const body = document.getElementById('pageBody');
  if (!body) return;
  if (theme === 'plain-daylight') body.classList.add('light-theme');
  else body.classList.remove('light-theme');

  const wallpapers = {
    '3d-chrome-swirl': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2560&auto=format&fit=crop',
    'cyan-liquid-glass': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2560&auto=format&fit=crop',
    'deep-liquid-chrome': 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2560&auto=format&fit=crop',
    'neon-line-ribbon': 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2560&auto=format&fit=crop',
    'neural-wireframe': 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2560&auto=format&fit=crop'
  };

  if (wallpapers[theme]) {
    body.style.background = `url("${wallpapers[theme]}")`;
  } else if (theme === 'plain-slate') {
    body.style.background = '#0f172a';
  } else if (theme === 'plain-daylight') {
    body.style.background = '#f8fafc';
  }
  body.style.backgroundSize = 'cover';
  body.style.backgroundPosition = 'center';
  body.style.backgroundAttachment = 'fixed';
  document.getElementById('themeMenu')?.classList.remove('show');
  localStorage.setItem('sbhub_theme', theme);
}

function getGMT8IsoDate() {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }));
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getCurrentSlotInfo() {
  const hours = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })).getHours();
  if (hours >= 6 && hours < 9)    return { slotId: "slot_6_9", label: "7:00 - 9:00" };
  if (hours >= 9 && hours < 12)  return { slotId: "slot_9_12", label: "9:00 - 12:00" };
  if (hours >= 12 && hours < 15) return { slotId: "slot_12_15", label: "12:00 - 15:00" };
  if (hours >= 15 && hours < 18) return { slotId: "slot_15_18", label: "15:00 - 18:00" };
  if (hours >= 18 && hours < 21) return { slotId: "slot_18_21", label: "18:00 - 21:00" };
  return { slotId: "slot_21_0", label: "21:00 - 00:00" };
}

function listenToLiveDutyRoster() {
  if (!rosterDb) return;
  rosterDb.ref('roster_data').on('value', (snapshot) => {
    renderLiveDutyWidget(snapshot.val());
  });
}

function renderLiveDutyWidget(rosterData) {
  const container = document.getElementById("liveDutyContent");
  if (!container) return;
  if (!rosterData) {
    container.innerHTML = `<div style="text-align:center; padding:15px; font-size:10px; color:rgba(255,255,255,0.7);">No roster data available.</div>`;
    return;
  }

  const todayIso = getGMT8IsoDate();
  const { label: slotLabel } = getCurrentSlotInfo();
  let activeDayKey = Object.keys(rosterData).find(key => {
    if (key === 'archives') return false;
    const entry = rosterData[key];
    return entry?.isoDate === todayIso || entry?.date === todayIso || key === todayIso;
  }) || Object.keys(rosterData).filter(k => k !== 'archives')[0];

  if (!activeDayKey || !rosterData[activeDayKey]) return;
  const dayData = rosterData[activeDayKey];
  const teamMembers = [{ id: 'ann', name: 'ANN' }, { id: 'dave', name: 'DAVE' }, { id: 'ken', name: 'KEN' }, { id: 'kriztel', name: 'KRIZTEL' }];

  let html = `<div style="font-size:10px; font-weight:700; opacity:0.9; margin-bottom:6px; display:flex; justify-content:space-between;"><span>📅 ${dayData.isoDate || todayIso}</span><span class="badge-time">⏰ ${slotLabel}</span></div>`;

  teamMembers.forEach(m => {
    const mGrid = dayData.grid ? dayData.grid[m.id] : null;
    const shiftId = mGrid?.shift || 'shift-7-16';
    const isRest = (shiftId === 'shift-rd' || shiftId === 'shift-vl' || shiftId === 'shift-sl');
    html += `<div class="duty-card"><div class="duty-top"><span>${m.name}</span><span class="badge-time">${isRest ? 'REST DAY' : shiftId.replace('shift-', '')}</span></div><div class="duty-desc">${isRest ? 'Rest day.' : 'Active shift monitoring.'}</div></div>`;
  });
  container.innerHTML = html;
}

function initDashboardApp() {
  const savedTheme = localStorage.getItem('sbhub_theme');
  setGradient(savedTheme || '3d-chrome-swirl');

  if (localStorage.getItem('sbhub_auth') === 'true' || sessionStorage.getItem('sbhub_auth') === 'true') {
    unlockDashboard();
  }

  switchBrandTab('ibet');
  loadCachedTopPicks();
  fetchTopPicksAndBoosts();
  setInterval(fetchTopPicksAndBoosts, 2 * 60 * 1000);

  listenToLiveDutyRoster();
  fetchManilaWeather();
  setInterval(fetchManilaWeather, 15 * 60 * 1000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboardApp);
} else {
  initDashboardApp();
}

window.addEventListener('click', function(e) {
  if (!e.target.closest('.top-nav-dropdown-group')) {
    document.querySelectorAll('.top-nav-dropdown-group').forEach(g => g.classList.remove('active'));
  }
  if (!e.target.closest('.dropdown-container')) {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
  }
});
