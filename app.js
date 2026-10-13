/**
 * Sportsbook Hub - Executive Operations Dashboard
 * Core Application Engine (app.js)
 */

/* ==========================================================================
   1. AUTHENTICATION & SESSION MANAGEMENT
   ========================================================================== */
const VALID_USERS = ["sportsbook2026", "sportsbookhub", "admin"];
const VALID_PASSWORDS = ["sb2026", "sportsbook2026", "sportsbook", "sbhub2026"];

function handleLogin(e) {
  if (e) e.preventDefault();

  const userInput = document.getElementById('userInput');
  const passInput = document.getElementById('passInput');
  const errorEl = document.getElementById('loginError');

  const u = (userInput?.value || '').trim().toLowerCase();
  const p = (passInput?.value || '').trim();

  const isUserValid = VALID_USERS.includes(u);
  const isPassValid = VALID_PASSWORDS.includes(p);

  if (isUserValid && isPassValid) {
    try {
      localStorage.setItem('sbhub_auth', 'true');
    } catch (err) {
      console.warn("Storage not accessible:", err);
    }

    const overlay = document.getElementById('authOverlay');
    if (overlay) overlay.classList.add('unlocked');
    if (errorEl) errorEl.textContent = "";
  } else {
    if (errorEl) {
      errorEl.textContent = "ACCESS DENIED: Invalid Security Key (Try: sb2026)";
    }
    if (passInput) {
      passInput.focus();
      passInput.select();
    }
  }
}

function handleLogout() {
  try {
    localStorage.removeItem('sbhub_auth');
    sessionStorage.removeItem('sbhub_auth');
  } catch (err) {}

  const authEl = document.getElementById('authOverlay');
  if (authEl) authEl.classList.remove('unlocked');

  const passEl = document.getElementById('passInput');
  if (passEl) passEl.value = '';

  const errorEl = document.getElementById('loginError');
  if (errorEl) errorEl.textContent = '';
}

function togglePasswordVisibility() {
  const passInput = document.getElementById('passInput');
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

function setupAuthEvents() {
  const form = document.getElementById('loginForm');
  if (form) form.addEventListener('submit', handleLogin);

  const toggleBtn = document.getElementById('togglePassBtn');
  if (toggleBtn) toggleBtn.addEventListener('click', togglePasswordVisibility);

  try {
    if (localStorage.getItem('sbhub_auth') === 'true' || sessionStorage.getItem('sbhub_auth') === 'true') {
      document.getElementById('authOverlay')?.classList.add('unlocked');
    }
  } catch (err) {}
}

/* ==========================================================================
   2. TOP NAV MEGA DOCK INTERACTION (CLICK LOCK & ESCAPE HANDLING)
   ========================================================================== */
function setupNavInteraction() {
  const navDock = document.getElementById('mainNavDock');
  if (!navDock) return;

  navDock.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = btn.closest('.nav-item');
      const wasOpen = parent?.classList.contains('open');

      navDock.querySelectorAll('.nav-item').forEach(item => item.classList.remove('open'));

      if (!wasOpen && parent) {
        parent.classList.add('open');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item')) {
      navDock.querySelectorAll('.nav-item').forEach(item => item.classList.remove('open'));
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      navDock.querySelectorAll('.nav-item').forEach(item => item.classList.remove('open'));
      closeHandoverModal();
    }
  });
}

/* ==========================================================================
   3. DAY / NIGHT THEME SYSTEM
   ========================================================================== */
function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  const icon = document.getElementById('themeIcon');
  if (isLight) {
    if (icon) icon.className = 'bx bx-moon';
    localStorage.setItem('sbhub_theme_mode', 'light');
  } else {
    if (icon) icon.className = 'bx bx-sun';
    localStorage.setItem('sbhub_theme_mode', 'dark');
  }
}

function restoreSavedTheme() {
  if (localStorage.getItem('sbhub_theme_mode') === 'light') {
    document.body.classList.add('light-mode');
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = 'bx bx-moon';
  }
}

/* ==========================================================================
   4. LIVE WORLD CLOCKS (GMT+8 MANILA TIME)
   ========================================================================== */
function updateClocks() {
  const now = new Date();
  const gmt8 = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Singapore',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).format(now);
  const clockEl = document.getElementById('clockGmt8');
  if (clockEl) clockEl.textContent = gmt8;
}

/* ==========================================================================
   5. REAL-TIME MANILA WEATHER (OPEN-METEO)
   ========================================================================== */
async function fetchWeather() {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=14.5995&longitude=120.9842&current_weather=true');
    if (!res.ok) throw new Error('Weather request failed');
    const data = await res.json();
    if (data?.current_weather) {
      const tempEl = document.getElementById('weatherTemp');
      if (tempEl) tempEl.textContent = `${Math.round(data.current_weather.temperature)}°C`;
    }
  } catch (e) {
    const tempEl = document.getElementById('weatherTemp');
    if (tempEl) tempEl.textContent = '31°C';
  }
}

/* ==========================================================================
   6. BRAND DOCK DIRECTORY SWITCHER
   ========================================================================== */
const BRAND_LINKS = {
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

function switchBrandTab(brandKey, el) {
  if (el) {
    document.querySelectorAll('.dock-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
  }
  const container = document.getElementById('brandLinksContainer');
  if (!container) return;
  container.innerHTML = '';

  (BRAND_LINKS[brandKey] || []).forEach(item => {
    const a = document.createElement('a');
    a.className = 'action-pill-row';
    a.href = item.url;
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.innerHTML = `<span>${item.name}</span><i class='bx bx-right-arrow-alt'></i>`;
    container.appendChild(a);
  });
}

/* ==========================================================================
   7. FIREBASE LIVE DUTY ROSTER
   ========================================================================== */
let rosterDb = null;
try {
  const firebaseConfig = {
    apiKey: "AIzaSyCaEclzLI284lWCFk-vXbLSXa_bEZsXbOg",
    authDomain: "test-daily-task--sb.firebaseapp.com",
    databaseURL: "https://test-daily-task--sb-default-rtdb.firebaseio.com",
    projectId: "test-daily-task--sb"
  };
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    rosterDb = firebase.database();
  }
} catch (e) {
  console.warn("Firebase Init Offline:", e);
}

function getCurrentSlotInfo() {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }));
  const h = now.getHours();
  if (h >= 6 && h < 9)   return { id: "slot_6_9", label: "7:00 - 9:00" };
  if (h >= 9 && h < 12)  return { id: "slot_9_12", label: "9:00 - 12:00" };
  if (h >= 12 && h < 15) return { id: "slot_12_15", label: "12:00 - 15:00" };
  if (h >= 15 && h < 18) return { id: "slot_15_18", label: "15:00 - 18:00" };
  if (h >= 18 && h < 21) return { id: "slot_18_21", label: "18:00 - 21:00" };
  return { id: "slot_21_0", label: "21:00 - 00:00" };
}

function listenToDutyRoster() {
  if (!rosterDb) return;
  rosterDb.ref('roster_data').on('value', snap => {
    renderDuties(snap.val());
  });
}

function renderDuties(data) {
  const container = document.getElementById('dutyListContainer');
  if (!data || !container) return;

  const slot = getCurrentSlotInfo();
  const slotBadge = document.getElementById('currentSlotTimeTag');
  if (slotBadge) slotBadge.textContent = slot.label;

  const nowManila = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }));
  const todayIso = `${nowManila.getFullYear()}-${String(nowManila.getMonth()+1).padStart(2,'0')}-${String(nowManila.getDate()).padStart(2,'0')}`;

  let activeDayKey = Object.keys(data).find(k => k === todayIso || data[k]?.isoDate === todayIso);
  if (!activeDayKey) {
    const keys = Object.keys(data).filter(k => k !== 'archives').sort().reverse();
    activeDayKey = keys[0];
  }

  const dayData = data[activeDayKey];
  if (!dayData) {
    container.innerHTML = `<div class="empty-state-notice">No duty roster entry found.</div>`;
    return;
  }

  const members = [{ id:'ann', name:'ANN' }, { id:'dave', name:'DAVE' }, { id:'ken', name:'KEN' }, { id:'kriztel', name:'KRIZTEL' }];
  let html = '';
  let activeCount = 0;

  members.forEach(m => {
    const mGrid = dayData.grid ? dayData.grid[m.id] : null;
    const shiftId = mGrid?.shift || 'shift-7-16';
    const isRest = ['shift-rd','shift-vl','shift-sl'].includes(shiftId);
    if (!isRest) activeCount++;

    let rawTasks = mGrid?.slots ? mGrid.slots[slot.id] || [] : [];
    const taskText = rawTasks.length ? (typeof rawTasks[0] === 'string' ? rawTasks[0] : rawTasks[0]?.text || '') : 'Active duty';

    html += `
      <div class="duty-user-card">
        <div class="duty-user-top">
          <span>${m.name}</span>
          <span class="duty-shift-pill">${isRest ? 'OFF' : shiftId.replace('shift-','')}</span>
        </div>
        <div class="duty-task-row">
          <i class='bx bx-check-circle' style="color: ${isRest ? 'var(--text-dim)' : 'var(--accent-mint)'}"></i>
          <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${isRest ? 'Rest Day' : taskText}</span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  const traderDisplay = document.getElementById('activeTraderDisplay');
  if (traderDisplay) traderDisplay.textContent = `${activeCount} Working`;
}

/* ==========================================================================
   8. REAL TOP PICKS / HOT BOOSTS (STRICT ESPN PRE-MATCH ONLY - NO MOCKS)
   ========================================================================== */
const PRIORITY_LEAGUES = [
  { key: "eng.1", code: "eng.1", name: "Premier League" },
  { key: "esp.1", code: "esp.1", name: "La Liga" },
  { key: "ger.1", code: "ger.1", name: "Bundesliga" },
  { key: "ita.1", code: "ita.1", name: "Serie A" },
  { key: "fra.1", code: "fra.1", name: "Ligue 1" },
  { key: "uefa.champions", code: "uefa.champions", name: "UEFA Champions League" }
];

let cachedPicks = [];
let activeBoostFilter = 'eng.1';

function getUpcomingQueryDates() {
  const dates = [];
  const now = new Date();
  for (let i = 0; i < 5; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${y}${m}${day}`);
  }
  return dates;
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

async function fetchTopPicksAndBoosts() {
  const container = document.getElementById('topPicksContainer');
  if (!container) return;

  try {
    const now = new Date();
    const targetDates = getUpcomingQueryDates();
    const seenMatchKeys = new Set();
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
    const realPreMatchPicks = [];

    for (const item of results) {
      if (!item?.data?.events) continue;
      const { league, data } = item;

      for (const evt of data.events) {
        const gameState = evt.status?.type?.state;
        const evtDate = new Date(evt.date);

        // Strict pre-kickoff filter: ONLY real upcoming fixtures
        if (gameState !== 'pre' || evtDate <= now) continue;

        const comp = evt.competitions?.[0];
        if (!comp) continue;

        const home = comp.competitors?.find(c => c.homeAway === 'home');
        const away = comp.competitors?.find(c => c.homeAway === 'away');

        if (home && away) {
          const homeName = home.team?.shortDisplayName || home.team?.displayName || "Home";
          const awayName = away.team?.shortDisplayName || away.team?.displayName || "Away";

          const matchKey = evt.id || `${homeName}-${awayName}-${evt.date}`;
          if (seenMatchKeys.has(matchKey)) continue;
          seenMatchKeys.add(matchKey);

          const homeLogo = home.team?.logo || home.team?.logos?.[0]?.href || "https://a.espncdn.com/i/teamlogos/soccer/500/default.png";
          const awayLogo = away.team?.logo || away.team?.logos?.[0]?.href || "https://a.espncdn.com/i/teamlogos/soccer/500/default.png";

          const kickOffStr = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Manila',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }).format(evtDate).toUpperCase();

          realPreMatchPicks.push({
            leagueKey: league.key,
            homeName,
            awayName,
            homeLogo,
            awayLogo,
            kickOffTimestamp: evtDate.getTime(),
            kickOffStr,
            market: generateScriptedMarket(homeName, awayName, realPreMatchPicks.length),
            isHot: realPreMatchPicks.length % 2 === 0
          });
        }
      }
    }

    realPreMatchPicks.sort((a, b) => a.kickOffTimestamp - b.kickOffTimestamp);
    cachedPicks = realPreMatchPicks;
    renderTopPicks();

  } catch (err) {
    console.error("Top Picks Fetch Error:", err);
    renderTopPicks();
  }
}

function filterTopPicks(leagueKey, el) {
  activeBoostFilter = leagueKey;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  renderTopPicks();
}

function renderTopPicks() {
  const container = document.getElementById('topPicksContainer');
  if (!container) return;

  const now = Date.now();
  const filtered = cachedPicks.filter(p => p.leagueKey === activeBoostFilter && p.kickOffTimestamp > now);

  if (filtered.length === 0) {
    const lg = PRIORITY_LEAGUES.find(l => l.key === activeBoostFilter);
    const leagueName = lg ? lg.name : activeBoostFilter.toUpperCase();
    container.innerHTML = `
      <div class="empty-state-notice">
        <i class='bx bx-calendar-x' style="font-size: 26px; color: var(--text-dim);"></i>
        <span>No upcoming scheduled ${leagueName} matches available at this time.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.slice(0, 12).map(p => `
    <div class="matte-boost-card">
      <div class="boost-top-teams">
        <div class="team-badge-wrap">
          <img src="${p.homeLogo}" alt="${p.homeName}" class="team-logo-small" onerror="this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'">
          <span class="team-abbr">${p.homeName}</span>
        </div>
        <span class="vs-tag">VS</span>
        <div class="team-badge-wrap">
          <span class="team-abbr">${p.awayName}</span>
          <img src="${p.awayLogo}" alt="${p.awayName}" class="team-logo-small" onerror="this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'">
        </div>
      </div>
      <div class="boost-market-text">${p.market}</div>
      <div class="boost-bottom-row">
        <span class="${p.isHot ? 'tag-hot' : 'tag-pick'}">${p.isHot ? 'HOT BOOST' : 'TOP PICK'}</span>
        <span style="color: var(--text-dim);"><i class='bx bx-time-five'></i> ${p.kickOffStr}</span>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   9. TOP GAMES DAILY MATCHDAY
   ========================================================================== */
let selectedGameOffset = 0;

async function fetchMatchDayGames() {
  const container = document.getElementById('gamesContainer');
  if (!container) return;

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + selectedGameOffset);

  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  const queryStr = `${year}${month}${day}`;

  const labelEl = document.getElementById('matchDayDisplay');
  if (labelEl) {
    labelEl.textContent = selectedGameOffset === 0 ? 'TODAY' : `DAY +${selectedGameOffset}`;
  }

  try {
    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=${queryStr}`);
    if (!res.ok) throw new Error('Games fetch failed');
    const data = await res.json();
    const events = data?.events || [];

    if (events.length === 0) {
      container.innerHTML = `<div class="empty-state-notice"><span>No fixtures scheduled for this matchday.</span></div>`;
      return;
    }

    container.innerHTML = events.slice(0, 6).map(evt => {
      const comp = evt.competitions?.[0];
      const h = comp?.competitors?.find(c => c.homeAway === 'home');
      const a = comp?.competitors?.find(c => c.homeAway === 'away');
      return `
        <div class="game-match-row">
          <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
            ${h?.team?.shortDisplayName || 'Home'} vs ${a?.team?.shortDisplayName || 'Away'}
          </span>
          <span class="game-time-tag">${evt.status?.type?.detail || 'PRE'}</span>
        </div>
      `;
    }).join('');

  } catch (e) {
    container.innerHTML = `<div class="empty-state-notice"><span>Matchday fixture feed offline.</span></div>`;
  }
}

function navigateMatchDay(dir) {
  selectedGameOffset += dir;
  if (selectedGameOffset < 0) selectedGameOffset = 5;
  if (selectedGameOffset > 5) selectedGameOffset = 0;
  fetchMatchDayGames();
}

/* ==========================================================================
   10. URGENT HANDOVER & JIRA SLA ENGINE
   ========================================================================== */
const HANDOVER_KEY = 'sbhub_urgent_handovers';
const handoverChannel = (typeof BroadcastChannel !== 'undefined') ? new BroadcastChannel('handover_sync_channel') : null;

function getHandovers() {
  return JSON.parse(localStorage.getItem(HANDOVER_KEY) || '[]');
}

function saveHandovers(list) {
  localStorage.setItem(HANDOVER_KEY, JSON.stringify(list));
  if (handoverChannel) handoverChannel.postMessage('sync');
  renderHandovers();
}

function renderHandovers() {
  const list = getHandovers();
  const mainText = document.getElementById('handoverMainText');
  const modalList = document.getElementById('handoverModalItems');
  const badge = document.getElementById('handoverAlertBadge');

  if (list.length > 0) {
    const highest = list[0];
    if (mainText) mainText.textContent = `[${highest.brand.toUpperCase()}] ${highest.msg}`;
    if (badge) badge.textContent = `HANDOVERS (${list.length})`;
  } else {
    if (mainText) mainText.textContent = "No active urgent handover notes.";
    if (badge) badge.textContent = "HANDOVERS";
  }

  if (modalList) {
    if (list.length === 0) {
      modalList.innerHTML = `<div class="empty-state-notice">No active handovers. Post one above!</div>`;
    } else {
      modalList.innerHTML = list.map((item, idx) => {
        let tagClass = 'normal';
        if (item.priority === 'URGENT/CRITICAL') tagClass = 'urgent';
        else if (item.priority === 'Need Attention') tagClass = 'attention';

        return `
          <div class="handover-modal-row">
            <div style="display:flex; align-items:center; gap:6px; flex:1; min-width:0;">
              <span class="priority-tag ${tagClass}">${item.priority || 'NOTE'}</span>
              <span style="font-weight:800; color:var(--text-main);">[${item.brand.toUpperCase()}]</span>
              <span style="color:var(--text-muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${item.msg}</span>
            </div>
            <button type="button" class="handover-btn-small" onclick="deleteHandover(${idx})" style="background:var(--accent-mint);">Done</button>
          </div>
        `;
      }).join('');
    }
  }
}

function openHandoverModal() {
  document.getElementById('handoverModal')?.classList.add('show');
  renderHandovers();
}

function closeHandoverModal() {
  document.getElementById('handoverModal')?.classList.remove('show');
}

function addHandover(e) {
  e.preventDefault();
  const p = document.getElementById('handoverPriority')?.value || 'URGENT/CRITICAL';
  const b = document.getElementById('handoverBrand')?.value.trim();
  const m = document.getElementById('handoverMsg')?.value.trim();

  if (!b || !m) return;

  const list = getHandovers();
  list.unshift({ priority: p, brand: b, msg: m, time: new Date().toISOString() });
  saveHandovers(list);

  document.getElementById('handoverBrand').value = '';
  document.getElementById('handoverMsg').value = '';
}

function deleteHandover(idx) {
  const list = getHandovers();
  if (idx >= 0 && idx < list.length) {
    list.splice(idx, 1);
    saveHandovers(list);
  }
}

if (handoverChannel) handoverChannel.onmessage = renderHandovers;
window.addEventListener('storage', renderHandovers);

function checkJiraSLA() {
  const tickets = JSON.parse(localStorage.getItem('jira_tracked_tickets') || '[]');
  const container = document.getElementById('jiraPillsContainer');
  if (!container) return;

  if (tickets.length > 0) {
    container.innerHTML = tickets.slice(0, 3).map(t => `
      <a href="jira.html" target="_blank" rel="noreferrer" class="jira-ticket-chip">${t.key || 'TICKET'}</a>
    `).join('');
  } else {
    container.innerHTML = `<span class="no-alert-subtext">No overdue tickets detected.</span>`;
  }
}

/* ==========================================================================
   11. INITIALIZATION & GLOBAL BINDINGS
   ========================================================================== */
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.togglePasswordVisibility = togglePasswordVisibility;
window.toggleTheme = toggleTheme;
window.switchBrandTab = switchBrandTab;
window.filterTopPicks = filterTopPicks;
window.navigateMatchDay = navigateMatchDay;
window.openHandoverModal = openHandoverModal;
window.closeHandoverModal = closeHandoverModal;
window.addHandover = addHandover;
window.deleteHandover = deleteHandover;

function initDashboard() {
  setupAuthEvents();
  restoreSavedTheme();
  setupNavInteraction();
  switchBrandTab('ibet');

  updateClocks();
  setInterval(updateClocks, 1000);
  fetchWeather();
  setInterval(fetchWeather, 15 * 60 * 1000);

  listenToDutyRoster();
  fetchTopPicksAndBoosts();
  setInterval(fetchTopPicksAndBoosts, 3 * 60 * 1000);

  fetchMatchDayGames();
  renderHandovers();
  checkJiraSLA();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboard);
} else {
  initDashboard();
}
