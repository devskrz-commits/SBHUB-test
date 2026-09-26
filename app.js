const DEFAULT_USER = "sportsbook2026";
const DEFAULT_PASS = "sb2026";

/* --- BRAND DIRECTORY TAB DATA & SWITCHER --- */
const brandTabData = {
  ibet: [
    { name: "IBET ADMIN", url: "https://mga-betbook.center/ibet/bets" },
    { name: "BETSSON", url: "https://b2b.betssonbusiness.com/" },
    { name: "BET CONSTRUCT", url: "https://backoffice.betconstruct.com/" }
  ],
  edge: [
    { name: "KT SBX", url: "https://p2ibet.sbx.bet/bets" },
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

/* --- ANIMATED PLASMA BACKGROUND CANVAS --- */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let width, height, particles = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = Math.random() * 2 + 1;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.alpha = Math.random() * 0.4 + 0.1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(56, 189, 248, ${this.alpha})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00f2fe';
    ctx.fill();
  }
}

for (let i = 0; i < 45; i++) particles.push(new Particle());

function animateCanvas() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

/* --- SITTING ROBOT EYE & HEAD SKELETON TRACKING --- */
const robotStage = document.getElementById('sittingRobotStage');
const robotBodyWrapper = document.getElementById('robotBodyWrapper');
const robotHead = document.getElementById('robotHead');
const leftEye = document.getElementById('leftEye');
const rightEye = document.getElementById('rightEye');
const passInput = document.getElementById('passwordInput');
let isPeeking = false;

document.addEventListener('mousemove', (e) => {
  if (!robotStage || document.getElementById('authOverlay').classList.contains('unlocked')) return;

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

if (passInput) {
  passInput.addEventListener('focus', () => {
    if (!isPeeking) {
      robotStage.classList.add('covering-eyes');
      robotStage.classList.remove('peeking');
    }
  });

  passInput.addEventListener('blur', () => {
    robotStage.classList.remove('covering-eyes', 'peeking');
    isPeeking = false;
  });
}

function togglePasswordVisibility() {
  const icon = document.getElementById('togglePassIcon');
  if (passInput.type === 'password') {
    passInput.type = 'text';
    if (icon) icon.className = 'bx bx-hide';
    isPeeking = true;
    robotStage.classList.remove('covering-eyes');
    robotStage.classList.add('peeking');
  } else {
    passInput.type = 'password';
    if (icon) icon.className = 'bx bx-show';
    isPeeking = false;
    robotStage.classList.remove('peeking');
    robotStage.classList.add('covering-eyes');
  }
}

/* --- WORLD CLOCKS SYSTEM --- */
function updateWorldClocks() {
  const now = new Date();
  const optionsGMT8 = { timeZone: 'Asia/Singapore', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
  document.getElementById('clock-gmt8').textContent = new Intl.DateTimeFormat('en-GB', optionsGMT8).format(now);

  const optionsCET = { timeZone: 'Europe/Berlin', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
  document.getElementById('clock-cet').textContent = new Intl.DateTimeFormat('en-GB', optionsCET).format(now);

  const optionsGMT2 = { timeZone: 'Europe/Athens', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
  document.getElementById('clock-gmt2').textContent = new Intl.DateTimeFormat('en-GB', optionsGMT2).format(now);
}
setInterval(updateWorldClocks, 1000);
updateWorldClocks();

/* --- AUTHENTICATION --- */
function handleLogin(event) {
  event.preventDefault();
  const userVal = document.getElementById('usernameInput').value.trim();
  const passVal = document.getElementById('passwordInput').value;
  const errorMsg = document.getElementById('loginErrorMsg');
  const card = document.getElementById('loginCard');

  if ((userVal === DEFAULT_USER || userVal === "sportsbookhub") && passVal === DEFAULT_PASS) {
    sessionStorage.setItem('sbhub_auth', 'true');
    unlockDashboard();
  } else {
    errorMsg.textContent = "ACCESS DENIED: Invalid Security Key";
    robotStage.classList.add('error-state');
    card.classList.add('shake');
    setTimeout(() => {
      card.classList.remove('shake');
      robotStage.classList.remove('error-state');
    }, 500);
    document.getElementById('passwordInput').focus();
    document.getElementById('passwordInput').select();
  }
}

function unlockDashboard() {
  document.getElementById('authOverlay').classList.add('unlocked');
  document.getElementById('dashboardApp').classList.add('unlocked');
}

function handleLogout() {
  sessionStorage.removeItem('sbhub_auth');
  document.getElementById('passwordInput').value = '';
  document.getElementById('loginErrorMsg').textContent = '';
  document.getElementById('dashboardApp').classList.remove('unlocked');
  document.getElementById('authOverlay').classList.remove('unlocked');
  if (robotStage) robotStage.classList.remove('covering-eyes', 'peeking');
}

/* --- UI TOGGLES & WIDGET MANAGEMENT --- */
function toggleMenu(menuId, btnElement) {
  const targetMenu = document.getElementById(menuId);
  const isCollapsed = targetMenu.classList.contains('collapsed');
  const icon = btnElement.querySelector('.toggle-icon');
  
  if (isCollapsed) {
    targetMenu.classList.remove('collapsed');
    icon.style.transform = 'rotate(0deg)';
  } else {
    targetMenu.classList.add('collapsed');
    icon.style.transform = 'rotate(-90deg)';
  }
}

function toggleDropdown(menuId) {
  const menu = document.getElementById(menuId);
  menu.classList.toggle('show');
}

function toggleWidget(widgetId, show) {
  const el = document.getElementById(widgetId);
  if (el) el.style.display = show ? 'flex' : 'none';
}

function hideWidgetDirect(widgetId) {
  toggleWidget(widgetId, false);
  const checkbox = document.querySelector(`input[onchange*="${widgetId}"]`);
  if (checkbox) checkbox.checked = false;
}

/* SUBDUED LOW-GLARE DARK PRESETS */
function setGradient(theme) {
  const body = document.getElementById('pageBody');
  let gradientCSS = '';

  switch(theme) {
    case 'cyberpunk':
      gradientCSS = 'linear-gradient(135deg, #090d16 0%, #111827 100%)';
      break;
    case 'maroon':
      gradientCSS = 'linear-gradient(125deg, #2a080c 0%, #4a0e17 50%, #1f0508 100%)';
      break;
    case 'obsidian':
      gradientCSS = 'linear-gradient(125deg, #09090b 0%, #1f1f23 50%, #141417 100%)';
      break;
    case 'ocean':
      gradientCSS = 'linear-gradient(125deg, #06111e 0%, #0f2027 50%, #030811 100%)';
      break;
    case 'royal':
      gradientCSS = 'linear-gradient(125deg, #100a1c 0%, #042f2e 50%, #080311 100%)';
      break;
    case 'sunset':
      gradientCSS = 'linear-gradient(125deg, #1e1b2e 0%, #451a03 50%, #0d0b18 100%)';
      break;
  }

  body.style.background = gradientCSS;
  body.style.backgroundAttachment = 'fixed';
  document.getElementById('themeMenu').classList.remove('show');
  localStorage.setItem('sbhub_theme', gradientCSS);
}

/* --- 7-DAY TOP GAMES SCHEDULE --- */
const matchSchedule7Days = [
  {
    dayLabel: "DAY 1 (SEP 26, 2026)",
    games: [
      { league: "EU UEFA NATIONS LEAGUE", home: "England", away: "Spain", time: "20:45 (Local)", priority: "P1", status: "UPCOMING" },
      { league: "ES SPAIN LA LIGA", home: "Barcelona", away: "Atletico Madrid", time: "21:00 (Local)", priority: "P1", status: "UPCOMING" },
      { league: "US USA MLS", home: "Columbus", away: "Miami", time: "07:30 (Local)", priority: "P2", status: "UPCOMING" }
    ]
  },
  {
    dayLabel: "DAY 2 (SEP 27, 2026)",
    games: [
      { league: "GB ENGLAND PREMIER LEAGUE", home: "Arsenal", away: "Chelsea", time: "16:30 (Local)", priority: "P1", status: "UPCOMING" },
      { league: "DE GERMANY BUNDESLIGA", home: "Bayern Munich", away: "Dortmund", time: "18:30 (Local)", priority: "P1", status: "UPCOMING" },
      { league: "FI FINLAND VEIKKAUSLIIGA", home: "HJK Helsinki", away: "KuPS", time: "17:00 (Local)", priority: "P2", status: "UPCOMING" }
    ]
  },
  {
    dayLabel: "DAY 3 (SEP 28, 2026)",
    games: [
      { league: "IT ITALY SERIE A", home: "Inter Milan", away: "Juventus", time: "20:45 (Local)", priority: "P1", status: "UPCOMING" },
      { league: "FR FRANCE LIGUE 1", home: "PSG", away: "Marseille", time: "21:00 (Local)", priority: "P1", status: "UPCOMING" },
      { league: "NO NORWAY ELITESERIEN", home: "Bodo/Glimt", away: "Molde", time: "18:00 (Local)", priority: "P2", status: "UPCOMING" }
    ]
  },
  {
    dayLabel: "DAY 4 (SEP 29, 2026)",
    games: [
      { league: "EU UEFA CHAMPIONS LEAGUE", home: "Real Madrid", away: "Man City", time: "21:00 (Local)", priority: "P1", status: "UPCOMING" },
      { league: "EU UEFA CHAMPIONS LEAGUE", home: "Liverpool", away: "AC Milan", time: "21:00 (Local)", priority: "P1", status: "UPCOMING" }
    ]
  },
  {
    dayLabel: "DAY 5 (SEP 30, 2026)",
    games: [
      { league: "EU UEFA CHAMPIONS LEAGUE", home: "Leverkusen", away: "Benfica", time: "21:00 (Local)", priority: "P1", status: "UPCOMING" },
      { league: "PT PORTUGAL LIGA", home: "Porto", away: "Sporting CP", time: "20:15 (Local)", priority: "P1", status: "UPCOMING" }
    ]
  },
  {
    dayLabel: "DAY 6 (OCT 01, 2026)",
    games: [
      { league: "NL NETHERLANDS EREDIVISIE", home: "Ajax", away: "Feyenoord", time: "14:30 (Local)", priority: "P1", status: "UPCOMING" },
      { league: "AF AFCON QUALIFIERS", home: "Nigeria", away: "Senegal", time: "18:00 (Local)", priority: "P2", status: "UPCOMING" }
    ]
  },
  {
    dayLabel: "DAY 7 (OCT 02, 2026)",
    games: [
      { league: "GB ENGLAND PREMIER LEAGUE", home: "Man United", away: "Tottenham", time: "20:00 (Local)", priority: "P1", status: "UPCOMING" },
      { league: "US USA MLS", home: "LA FC", away: "LA Galaxy", time: "19:30 (Local)", priority: "P2", status: "UPCOMING" }
    ]
  }
];

let currentDayIndex = 0;

function renderGamesForCurrentDay() {
  const dayData = matchSchedule7Days[currentDayIndex];
  document.getElementById('matchDayDisplay').textContent = dayData.dayLabel;
  const sortedGames = [...dayData.games].sort((a, b) => (a.priority === 'P1' ? -1 : 1));

  const container = document.getElementById('gamesContainer');
  if (!container) return;
  container.innerHTML = '';

  sortedGames.forEach(game => {
    const gameEl = document.createElement('div');
    gameEl.className = 'game-card';
    gameEl.innerHTML = `
      <div style="font-size: 10px; opacity: 0.75; font-weight: 700; display:flex; justify-content:space-between;">
        <span>${game.league}</span>
        <span style="color:${game.priority==='P1'?'#fbbf24':'#38bdf8'}; font-size:9px;">${game.priority==='P1'?'TOP TIER':'SECONDARY'}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 13px; margin: 4px 0;">
        <span>${game.home}</span><span style="opacity: 0.5;">VS</span><span>${game.away}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 10px; opacity: 0.75;">
        <span>${game.time}</span><span style="color: #34d399; font-weight: 700;">${game.status}</span>
      </div>
    `;
    container.appendChild(gameEl);
  });
}

function navigateMatchDay(dir) {
  currentDayIndex += dir;
  if (currentDayIndex < 0) currentDayIndex = matchSchedule7Days.length - 1;
  if (currentDayIndex >= matchSchedule7Days.length) currentDayIndex = 0;
  renderGamesForCurrentDay();
}

function calculateActiveTraders() {
  const dutyCards = document.querySelectorAll('.duty-card');
  let activeCount = 0;
  dutyCards.forEach(card => {
    const timeBadge = card.querySelector('.badge-time');
    if (timeBadge) {
      const text = timeBadge.textContent.trim().toUpperCase();
      if (!text.includes('OFF') && !text.includes('REST') && !text.includes('RD')) {
        activeCount++;
      }
    }
  });
  document.getElementById('activeTraderCount').textContent = activeCount + ' Working';
}

/* --- INITIALIZATION --- */
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('sbhub_theme');
  if (savedTheme) {
    document.getElementById('pageBody').style.background = savedTheme;
    document.getElementById('pageBody').style.backgroundAttachment = 'fixed';
  } else {
    setGradient('maroon');
  }

  if (sessionStorage.getItem('sbhub_auth') === 'true') {
    unlockDashboard();
  }

  switchBrandTab('ibet');
  calculateActiveTraders();
  renderGamesForCurrentDay();
});

window.addEventListener('click', function(e) {
  if (!e.target.closest('.dropdown-container')) {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
  }
});
