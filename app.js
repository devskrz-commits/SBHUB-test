/* ==========================================================================
   SPORTSBOOK HUB - CORE APPLICATION LOGIC (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAuthentication();
  initClocks();
  initWeather();
  loadHandovers();
  initTopPicks('eng.1');
});

/* --------------------------------------------------------------------------
   1. AUTHENTICATION & SESSION MANAGEMENT
   -------------------------------------------------------------------------- */
function handleLogin(event) {
  if (event) event.preventDefault();
  const user = document.getElementById('usernameInput').value;
  const pass = document.getElementById('passwordInput').value;
  const errorMsg = document.getElementById('loginErrorMsg');

  if (user && pass) {
    document.getElementById('authOverlay').classList.add('unlocked');
    document.getElementById('dashboardApp').classList.add('unlocked');
    localStorage.setItem('sbhub_authenticated', 'true');
  } else {
    errorMsg.innerText = 'Please enter valid security credentials.';
  }
}

function handleLogout() {
  localStorage.removeItem('sbhub_authenticated');
  location.reload();
}

function togglePasswordVisibility() {
  const passInput = document.getElementById('passwordInput');
  const icon = document.getElementById('togglePassIcon');
  if (passInput.type === 'password') {
    passInput.type = 'text';
    icon.className = 'bx bx-hide';
  } else {
    passInput.type = 'password';
    icon.className = 'bx bx-show';
  }
}

function initAuthentication() {
  if (localStorage.getItem('sbhub_authenticated') === 'true') {
    document.getElementById('authOverlay').classList.add('unlocked');
    document.getElementById('dashboardApp').classList.add('unlocked');
  }
}

/* --------------------------------------------------------------------------
   2. SIDEBAR DROPDOWN ACCORDIONS & MOBILE NAV
   -------------------------------------------------------------------------- */
function toggleMenu(menuId, element) {
  const menu = document.getElementById(menuId);
  if (!menu) return;
  
  // Collapse or expand state
  const isCollapsed = menu.classList.contains('collapsed');
  
  // Close all other sub-menus if desired, or keep independent
  document.querySelectorAll('.sub-menu').forEach(m => m.classList.add('collapsed'));

  if (isCollapsed) {
    menu.classList.remove('collapsed');
  } else {
    menu.classList.add('collapsed');
  }
}

function toggleMobileSidebar(forceState) {
  const sidebar = document.getElementById('mainSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const isOpen = sidebar.classList.contains('mobile-open');
  
  const newState = forceState !== undefined ? forceState : !isOpen;
  if (newState) {
    sidebar.classList.add('mobile-open');
    overlay.classList.add('active');
  } else {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
  }
}

/* --------------------------------------------------------------------------
   3. WORLD CLOCKS (GMT+8, CET, GMT+2)
   -------------------------------------------------------------------------- */
function initClocks() {
  updateClocks();
  setInterval(updateClocks, 1000);
}

function updateClocks() {
  const now = new Date();
  
  // GMT+8
  const gmt8Time = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (8 * 3600000));
  document.getElementById('clock-gmt8').innerText = formatTimeUnit(gmt8Time);

  // CET (UTC+1 / UTC+2 during daylight saving)
  const cetTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (1 * 3600000));
  document.getElementById('clock-cet').innerText = formatTimeUnit(cetTime);

  // GMT+2
  const gmt2Time = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (2 * 3600000));
  document.getElementById('clock-gmt2').innerText = formatTimeUnit(gmt2Time);
}

function formatTimeUnit(dateObj) {
  const hh = String(dateObj.getHours()).padStart(2, '0');
  const mm = String(dateObj.getMinutes()).padStart(2, '0');
  const ss = String(dateObj.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

/* --------------------------------------------------------------------------
   4. WEATHER BANNER WIDGET (METRO MANILA)
   -------------------------------------------------------------------------- */
function initWeather() {
  // Simulated live weather fetch for Metro Manila
  setTimeout(() => {
    document.getElementById('weatherTemp').innerText = '31°C';
    document.getElementById('weatherCond').innerText = 'Partly Cloudy';
    document.getElementById('weatherHumidity').innerText = 'Humidity: 72%';
    document.getElementById('weatherIcon').className = 'bx bx-cloud-sun';
  }, 800);
}

/* --------------------------------------------------------------------------
   5. URGENT HANDOVER MODAL & PERSISTENT STORAGE
   -------------------------------------------------------------------------- */
function openHandoverModal() {
  document.getElementById('handoverModal').classList.add('active');
  renderHandoverList();
}

function closeHandoverModal() {
  document.getElementById('handoverModal').classList.remove('active');
}

function addUrgentHandover(event) {
  if (event) event.preventDefault();
  const priority = document.getElementById('handoverPriorityInput').value;
  const brand = document.getElementById('handoverBrandInput').value;
  const msg = document.getElementById('handoverMsgInput').value;

  const newItem = {
    id: Date.now(),
    priority,
    brand,
    msg,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  let handovers = JSON.parse(localStorage.getItem('sbhub_handovers') || '[]');
  handovers.unshift(newItem);
  localStorage.setItem('sbhub_handovers', JSON.stringify(handovers));

  document.getElementById('handoverBrandInput').value = '';
  document.getElementById('handoverMsgInput').value = '';

  renderHandoverList();
  loadHandovers();
}

function deleteHandover(id) {
  let handovers = JSON.parse(localStorage.getItem('sbhub_handovers') || '[]');
  handovers = handovers.filter(item => item.id !== id);
  localStorage.setItem('sbhub_handovers', JSON.stringify(handovers));
  renderHandoverList();
  loadHandovers();
}

function loadHandovers() {
  const container = document.getElementById('handoverPillsContainer');
  if (!container) return;

  const handovers = JSON.parse(localStorage.getItem('sbhub_handovers') || '[]');
  if (handovers.length === 0) {
    container.innerHTML = `<div class="handover-pill-item"><span class="handover-pill-brand">SYSTEM</span> Active shift operations normal. No active critical notes.</div>`;
    return;
  }

  container.innerHTML = handovers.slice(0, 3).map(item => `
    <div class="handover-pill-item">
      <span class="handover-pill-brand">${escapeHtml(item.brand)}</span>
      <span style="flex:1;">${escapeHtml(item.msg)}</span>
      <span style="font-size: 8.5px; opacity: 0.7;">[${item.time}]</span>
    </div>
  `).join('');
}

function renderHandoverList() {
  const list = document.getElementById('handoverModalList');
  if (!list) return;

  const handovers = JSON.parse(localStorage.getItem('sbhub_handovers') || '[]');
  if (handovers.length === 0) {
    list.innerHTML = `<div style="font-size:11px; color:#64748b; text-align:center; padding:12px;">No handover notes logged.</div>`;
    return;
  }

  list.innerHTML = handovers.map(item => `
    <div style="display:flex; align-items:center; justify-content:space-between; background:#f8fafc; border:1px solid #e2e8f0; padding:8px 12px; border-radius:10px; font-size:11px;">
      <div><strong>[${escapeHtml(item.brand)}]</strong> ${escapeHtml(item.msg)} <span style="font-size:9px; color:#64748b;">(${item.time})</span></div>
      <button type="button" onclick="deleteHandover(${item.id})" style="background:#fee2e2; color:#dc2626; border:none; border-radius:6px; padding:2px 8px; font-weight:800; cursor:pointer;">Delete</button>
    </div>
  `).join('');
}

/* --------------------------------------------------------------------------
   6. TOP PICKS / HOT BOOSTS FILTER
   -------------------------------------------------------------------------- */
function filterTopPicks(leagueKey, btn) {
  document.querySelectorAll('.boost-filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  initTopPicks(leagueKey);
}

function initTopPicks(league) {
  const container = document.getElementById('topPicksContainer');
  if (!container) return;

  const mockPicks = league === 'eng.1' ? [
    { match: 'Arsenal vs Chelsea', market: 'Over 2.5 Goals', odds: '1.95', boost: '🔥 Hot Boost' },
    { match: 'Man City vs Liverpool', market: 'Both Teams to Score', odds: '1.80', boost: '⚡ Price Boost' }
  ] : [
    { match: 'Real Madrid vs Barcelona', market: 'Real Madrid Win', odds: '2.10', boost: '🔥 El Clasico Boost' },
    { match: 'Atletico vs Valencia', market: 'Under 2.5 Goals', odds: '1.75', boost: '🛡️ Safe Pick' }
  ];

  container.innerHTML = mockPicks.map(p => `
    <div class="boost-card">
      <div style="display:flex; justify-content:space-between; font-size:9.5px; font-weight:800; color:#dc2626;"><span>${p.boost}</span><span>Odds: ${p.odds}</span></div>
      <div style="font-size:12px; font-weight:800; color:#0f172a;">${p.match}</div>
      <div style="font-size:10px; color:#64748b; font-weight:700;">Market: ${p.market}</div>
    </div>
  `).join('');
}

function toggleDropdown(menuId) {
  const menu = document.getElementById(menuId);
  if (menu) menu.classList.toggle('show');
}

function toggleWidget(widgetId, isVisible) {
  const widget = document.getElementById(widgetId);
  if (widget) widget.style.display = isVisible ? 'flex' : 'none';
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
