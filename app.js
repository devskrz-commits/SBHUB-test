const DEFAULT_USER = "sportsbook2026";
const DEFAULT_PASS = "sb2026";

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

/* --- REAL-TIME LIVE DUTY ROSTER (FIREBASE) --- */
function getCurrentSlotInfo() {
  const now = new Date();
  const hours = now.getHours();
  if (hours >= 6 && hours < 9)   return { slotId: "slot_6_9", label: "7:00 - 9:00" };
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

  const todayIso = new Date().toISOString().split('T')[0];
  const { slotId, label: slotLabel } = getCurrentSlotInfo();

  let activeDayKey = Object.keys(rosterData).find(key => key !== 'archives' && rosterData[key]?.isoDate === todayIso);
  if (!activeDayKey) {
    const activeKeys = Object.keys(rosterData).filter(k => k !== 'archives');
    activeKeys.sort((a, b) => (rosterData[b]?.isoDate || '').localeCompare(rosterData[a]?.isoDate || ''));
    activeDayKey = activeKeys[0];
  }

  if (!activeDayKey || !rosterData[activeDayKey]) {
    container.innerHTML = `<div style="text-align:center; padding:15px; font-size:10px; color:rgba(255,255,255,0.7);">No active schedule found.</div>`;
    return;
  }

  const dayData = rosterData[activeDayKey];
  const teamMembers = [
    { id: 'ann', name: 'ANN' }, { id: 'dave', name: 'DAVE' },
    { id: 'ken', name: 'KEN' }, { id: 'kriztel', name: 'KRIZTEL' }
  ];

  let html = `
    <div style="font-size:11px; font-weight:700; opacity:0.9; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
      <span>📅 ${dayData.isoDate || todayIso}</span>
      <span class="badge-time">⏰ ${slotLabel}</span>
    </div>
  `;

  teamMembers.forEach(m => {
    const mGrid = dayData.grid ? dayData.grid[m.id] : null;
    const shiftId = mGrid?.shift || 'shift-7-16';
    const isRest = (shiftId === 'shift-rd' || shiftId === 'shift-vl' || shiftId === 'shift-sl');
    const restLabel = shiftId === 'shift-vl' ? 'VACATION LEAVE' : (shiftId === 'shift-sl' ? 'SICK LEAVE' : 'REST DAY');

    let rawTasks = (mGrid && mGrid.slots) ? mGrid.slots[slotId] || [] : [];
    if (!Array.isArray(rawTasks)) rawTasks = [];
    const tasks = rawTasks.map(item => (typeof item === 'string' ? { text: item, done: false } : { text: item.text || '', done: !!item.done }));

    html += `
      <div class="duty-card">
        <div class="duty-top">
          <span>${m.name}</span>
          <span class="badge-time">${isRest ? restLabel : shiftId.replace('shift-', '')}</span>
        </div>
    `;

    if (isRest) {
      html += `<div class="duty-desc">Rest day.</div>`;
    } else if (tasks.length === 0) {
      html += `<div class="duty-desc">No assigned tasks in this slot.</div>`;
    } else {
      tasks.forEach(t => {
        html += `<div class="duty-desc" style="display:flex; gap:4px; align-items:center;">
          <i class='bx ${t.done ? 'bx-check-circle' : 'bx-time-five'}' style="color:${t.done ? '#34d399' : '#38bdf8'}"></i>
          <span style="${t.done ? 'text-decoration:line-through; opacity:0.6;' : ''}">${t.text}</span>
        </div>`;
      });
    }
    html += `</div>`;
  });

  container.innerHTML = html;
}

/* --- 7-DAY TOP GAMES SCOREBOARD ENGINE --- */
function getFormattedDateQuery(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

async function fetchLiveGames() {
  const container = document.getElementById("gamesContainer");
  if (!container) return;
  container.innerHTML = `<div style="text-align:center; padding:15px;"><i class='bx bx-loader-alt bx-spin' style="font-size:20px; color:#38bdf8;"></i></div>`;
  
  try {
    const targetDateQuery = getFormattedDateQuery(selectedGameDayOffset);
    const targetDateObj = new Date();
    targetDateObj.setDate(targetDateObj.getDate() + selectedGameDayOffset);
    const dateLabelStr = targetDateObj.toLocaleDateString("en-US", { month: 'short', day: 'numeric' }).toUpperCase();
    
    let dayTag = `DAY ${selectedGameDayOffset + 1}`;
    if (selectedGameDayOffset === 0) dayTag = `TODAY`;

    const labelEl = document.getElementById("matchDayDisplay");
    if (labelEl) labelEl.textContent = `${dayTag} (${dateLabelStr})`;

    const primaryLeagues = [
      { name: "EU UEFA CHAMPIONS LEAGUE", code: "uefa.champions", link: "https://www.flashscore.com/football/europe/champions-league/", priority: "P1" },
      { name: "GB ENGLAND PREMIER LEAGUE", code: "eng.1", link: "https://www.flashscore.ph/football/england/premier-league/", priority: "P1" },
      { name: "ES SPAIN LA LIGA", code: "esp.1", link: "https://www.flashscore.ph/football/spain/laliga/", priority: "P1" },
      { name: "DE GERMANY BUNDESLIGA", code: "ger.1", link: "https://www.flashscore.ph/football/germany/bundesliga/", priority: "P1" },
      { name: "IT ITALY SERIE A", code: "ita.1", link: "https://www.flashscore.ph/football/italy/serie-a/", priority: "P1" },
      { name: "FR FRANCE LIGUE 1", code: "fra.1", link: "https://www.flashscore.ph/football/france/ligue-1/", priority: "P1" },
      { name: "PT PORTUGAL LIGA", code: "por.1", link: "https://www.flashscore.ph/football/portugal/liga-portugal/", priority: "P1" },
      { name: "NL NETHERLANDS EREDIVISIE", code: "ned.1", link: "https://www.flashscore.ph/football/netherlands/eredivisie/", priority: "P1" }
    ];

    const backupLeagues = [
      { name: "US USA MLS", code: "usa.1", link: "https://www.flashscore.ph/football/usa/mls/", priority: "P2" },
      { name: "FI FINLAND VEIKKAUSLIIGA", code: "fin.1", link: "https://www.flashscore.ph/football/finland/veikkausliiga/", priority: "P2" },
      { name: "NO NORWAY ELITESERIEN", code: "nor.1", link: "https://www.flashscore.ph/football/norway/eliteserien/", priority: "P2" },
      { name: "EU UEFA NATIONS LEAGUE", code: "uefa.nations.a", link: "https://www.flashscore.ph/football/europe/uefa-nations-league/", priority: "P2" }
    ];

    const fetchLeagueData = async (leagues) => {
      const promises = leagues.map(league =>
        fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league.code}/scoreboard?dates=${targetDateQuery}`)
          .then(res => res.json())
          .then(data => ({ league, events: data.events || [] }))
          .catch(() => ({ league, events: [] }))
      );
      const results = await Promise.all(promises);
      let matches = [];
      results.forEach(result => {
        if (result.events && result.events.length > 0) {
          result.events.forEach(e => {
            matches.push({ event: e, league: result.league });
          });
        }
      });
      return matches;
    };

    let allMatches = await fetchLeagueData(primaryLeagues);
    let isBackupUsed = false;

    if (allMatches.length === 0) {
      isBackupUsed = true;
      allMatches = await fetchLeagueData(backupLeagues);
    }

    let gamesHtml = "";
    if (isBackupUsed && allMatches.length > 0) {
      gamesHtml += `<div style="font-size: 8.5px; font-weight: 800; color: #38bdf8; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25); padding: 3px 6px; border-radius: 4px; margin-bottom: 8px; text-align: center;">🌐 ALTERNATIVE LEAGUES (Top Tier Inactive)</div>`;
    }

    allMatches.slice(0, 5).forEach(item => {
      const match = item.event.competitions[0];
      const home = match.competitors?.find(c => c.homeAway === 'home')?.team?.shortDisplayName || "Home";
      const away = match.competitors?.find(c => c.homeAway === 'away')?.team?.shortDisplayName || "Away";
      const dateObj = new Date(item.event.date);
      const timeStr = dateObj.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false });
      
      let status = "UPCOMING";
      if (item.event.status?.type?.state === 'in') status = "LIVE";
      else if (item.event.status?.type?.completed === true) status = "FINAL";

      gamesHtml += `
        <div class="game-card">
          <div style="font-size: 10px; opacity: 0.75; font-weight: 700; display:flex; justify-content:space-between;">
            <span>${item.league.name}</span>
            <span style="color:${item.league.priority==='P1'?'#fbbf24':'#38bdf8'}; font-size:9px;">${item.league.priority==='P1'?'TOP TIER':'SECONDARY'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 13px; margin: 4px 0;">
            <span>${home}</span><span style="opacity: 0.5;">VS</span><span>${away}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 10px; opacity: 0.75;">
            <span>${timeStr} (Local)</span><span style="color: #34d399; font-weight: 700;">${status}</span>
          </div>
        </div>
      `;
    });

    if (!gamesHtml) {
      gamesHtml = `<div style="text-align:center; padding:20px; font-size:11px; opacity:0.7;">No live matches scheduled for this date.</div>`;
    }

    container.innerHTML = gamesHtml;

  } catch (e) {
    container.innerHTML = `<div style="text-align:center; padding:10px; font-size:11px; color:#f87171;">Failed to fetch live fixture data.</div>`;
  }
}

function navigateMatchDay(dir) {
  selectedGameDayOffset += dir;
  if (selectedGameDayOffset < 0) selectedGameDayOffset = 6;
  if (selectedGameDayOffset > 6) selectedGameDayOffset = 0;
  fetchLiveGames();
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
  const el = document.getElementById('activeTraderCount');
  if (el) el.textContent = activeCount + ' Working';
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
  listenToLiveDutyRoster();
  fetchLiveGames();
  calculateActiveTraders();
});

window.addEventListener('click', function(e) {
  if (!e.target.closest('.dropdown-container')) {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
  }
});
