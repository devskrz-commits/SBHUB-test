const DEFAULT_USER = "sportsbook2026";
const DEFAULT_PASS = "sb2026";

/* --- BRAND DIRECTORY DATA --- */
const brandDirectoryData = {
  ibet: {
    id: "ibet",
    badge: "BET",
    title: "iBet Admin",
    subLinks: [
      { name: "IBET ADMIN", url: "https://mga-betbook.center/ibet/bets" },
      { name: "BETSSON", url: "https://b2b.betssonbusiness.com/" },
      { name: "BET CONSTRUCT", url: "https://backoffice.betconstruct.com/" }
    ]
  },
  edge: {
    id: "edge",
    badge: "EDGE",
    title: "Edge",
    subLinks: [
      { name: "KT SBX", url: "https://p2ibet.sbx.bet/bets" },
      { name: "EDGE ADMIN", url: "https://admin.edgegaming.io/admin/qbet/homepage" },
      { name: "SERVICE DESK", url: "https://kickertech.atlassian.net/servicedesk/customer/user/login?destination=portals" }
    ]
  },
  pubs: {
    id: "pubs",
    badge: "PUBS",
    title: "Pubs",
    subLinks: [
      { name: "GO GAMING", url: "https://gg-backoffice-eu.gogaming.cc/en-US/member/list" }
    ]
  }
};

function renderBrandDirectory() {
  const container = document.getElementById('brandDirectoryContainer');
  if (!container) return;
  container.innerHTML = '';

  Object.keys(brandDirectoryData).forEach(key => {
    const brand = brandDirectoryData[key];
    const brandCard = document.createElement('div');
    brandCard.className = 'brand-accordion-card';
    brandCard.id = `brand-card-${brand.id}`;

    let subLinksHtml = brand.subLinks.map(link => `
      <a href="${link.url}" target="_blank" class="brand-sub-link">
        <span>${link.name}</span>
        <i class='bx bx-right-arrow-alt'></i>
      </a>
    `).join('');

    brandCard.innerHTML = `
      <div class="brand-header-row" onclick="toggleBrandAccordion('${brand.id}')">
        <div class="brand-left">
          <span class="brand-badge-pill">${brand.badge}</span>
          <span class="brand-title-text">${brand.title}</span>
        </div>
        <i class='bx bx-chevron-right brand-chevron-icon' id="chevron-${brand.id}"></i>
      </div>
      <div class="brand-sub-menu collapsed" id="sub-menu-${brand.id}">
        ${subLinksHtml}
      </div>
    `;

    container.appendChild(brandCard);
  });
}

function toggleBrandAccordion(brandId) {
  const subMenu = document.getElementById(`sub-menu-${brandId}`);
  const chevron = document.getElementById(`chevron-${brandId}`);
  const card = document.getElementById(`brand-card-${brandId}`);

  if (!subMenu) return;

  const isCollapsed = subMenu.classList.contains('collapsed');

  document.querySelectorAll('.brand-sub-menu').forEach(menu => menu.classList.add('collapsed'));
  document.querySelectorAll('.brand-chevron-icon').forEach(icon => icon.style.transform = 'rotate(0deg)');
  document.querySelectorAll('.brand-accordion-card').forEach(c => c.classList.remove('active'));

  if (isCollapsed) {
    subMenu.classList.remove('collapsed');
    if (chevron) chevron.style.transform = 'rotate(90deg)';
    if (card) card.classList.add('active');
  }
}

/* --- REAL-TIME TOP PICKS / HOT BOOSTS ENGINE (ESPN API SYNC) --- */
async function fetchTopPicksAndBoosts() {
  const container = document.getElementById('topPicksContainer');
  if (!container) return;

  container.innerHTML = `<div style="text-align:center; padding:15px; width:100%;"><i class='bx bx-loader-alt bx-spin' style="font-size:20px; color:#38bdf8;"></i></div>`;

  try {
    const primaryLeagues = [
      { code: "uefa.euro", name: "UEFA EURO" },
      { code: "eng.1", name: "Premier League" },
      { code: "esp.1", name: "La Liga" },
      { code: "uefa.champions", name: "UEFA Champions League" },
      { code: "uefa.nations", name: "UEFA Nations League" },
      { code: "ger.1", name: "Bundesliga" },
      { code: "ita.1", name: "Serie A" }
    ];

    let allPicks = [];

    for (const league of primaryLeagues) {
      if (allPicks.length >= 6) break;
      try {
        const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league.code}/scoreboard`);
        if (!res.ok) continue;
        const data = await res.json();

        if (data && data.events && data.events.length > 0) {
          data.events.forEach((evt, idx) => {
            if (allPicks.length >= 8) return;
            const comp = evt.competitions?.[0];
            if (!comp) return;

            const homeTeam = comp.competitors?.find(c => c.homeAway === 'home');
            const awayTeam = comp.competitors?.find(c => c.homeAway === 'away');

            if (homeTeam && awayTeam) {
              const homeName = homeTeam.team?.shortDisplayName || homeTeam.team?.displayName || "Home";
              const awayName = awayTeam.team?.shortDisplayName || awayTeam.team?.displayName || "Away";

              const homeLogo = homeTeam.team?.logo || homeTeam.team?.logos?.[0]?.href || "https://a.espncdn.com/i/teamlogos/soccer/500/default.png";
              const awayLogo = awayTeam.team?.logo || awayTeam.team?.logos?.[0]?.href || "https://a.espncdn.com/i/teamlogos/soccer/500/default.png";

              const markets = [
                `${homeName} to Win + Over 2.5 Goals`,
                `${homeName} vs ${awayName} - Both Teams to Score`,
                `${homeName} to Win + Have 2+ Goals`,
                `${awayName} to Win or Draw + Over 1.5 Goals`
              ];

              const selectedMarket = markets[idx % markets.length];
              const baseOdds = (1.85 + (idx * 0.15)).toFixed(2);

              allPicks.push({
                homeName,
                awayName,
                homeLogo,
                awayLogo,
                leagueName: league.name,
                market: selectedMarket,
                badge: (idx % 2 === 0) ? "TOP PICK" : "HOT",
                odds: baseOdds
              });
            }
          });
        }
      } catch (err) {
        console.warn(`Error fetching ${league.code}:`, err);
      }
    }

    if (allPicks.length === 0) {
      allPicks = [
        {
          homeName: "England",
          awayName: "Czechia",
          homeLogo: "https://a.espncdn.com/i/teamlogos/countries/500/eng.png",
          awayLogo: "https://a.espncdn.com/i/teamlogos/countries/500/cze.png",
          leagueName: "UEFA Nations League",
          market: "England to Win + Have 2+ Goals",
          badge: "TOP PICK",
          odds: "2.10"
        },
        {
          homeName: "Real Madrid",
          awayName: "Atletico Madrid",
          homeLogo: "https://a.espncdn.com/i/teamlogos/soccer/500/86.png",
          awayLogo: "https://a.espncdn.com/i/teamlogos/soccer/500/1068.png",
          leagueName: "La Liga",
          market: "Real Madrid to Win + Over 2.5 Goals",
          badge: "HOT",
          odds: "1.95"
        }
      ];
    }

    let cardsHtml = "";
    allPicks.forEach(pick => {
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

          <div>
            <span class="boost-badge ${isTopPick ? 'top-pick' : 'hot'}">${pick.badge}</span>
          </div>

          <div class="boost-market-desc">${pick.market}</div>

          <div class="boost-card-bottom">
            <div class="boost-odds-btn">${pick.odds}</div>
          </div>
        </div>
      `;
    });

    container.innerHTML = cardsHtml;
  } catch (e) {
    container.innerHTML = `<div style="text-align:center; padding:10px; font-size:11px; color:#f87171;">Failed to fetch live boosts.</div>`;
  }
}

/* --- CLOCKS & WEATHER --- */
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

async function fetchManilaWeather() {
  const tempEl = document.getElementById('weatherTemp');
  if (!tempEl) return;
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=14.5995&longitude=120.9842&current_weather=true&timezone=Asia%2FManila');
    const data = await res.json();
    tempEl.textContent = `${Math.round(data.current_weather.temperature)}°C`;
    document.getElementById('weatherCond').textContent = 'CLEAR';
  } catch (e) {
    tempEl.textContent = '31°C';
  }
}

/* --- AUTHENTICATION --- */
function handleLogin(event) {
  event.preventDefault();
  const userVal = document.getElementById('usernameInput').value.trim();
  const passVal = document.getElementById('passwordInput').value;

  if (userVal === DEFAULT_USER && passVal === DEFAULT_PASS) {
    sessionStorage.setItem('sbhub_auth', 'true');
    unlockDashboard();
  }
}

function unlockDashboard() {
  document.getElementById('authOverlay').classList.add('unlocked');
  document.getElementById('dashboardApp').classList.add('unlocked');
}

function handleLogout() {
  sessionStorage.removeItem('sbhub_auth');
  document.getElementById('dashboardApp').classList.remove('unlocked');
  document.getElementById('authOverlay').classList.remove('unlocked');
}

function toggleMenu(menuId, btnElement) {
  const targetMenu = document.getElementById(menuId);
  targetMenu.classList.toggle('collapsed');
}

/* --- INITIALIZATION --- */
function initDashboardApp() {
  if (sessionStorage.getItem('sbhub_auth') === 'true') {
    unlockDashboard();
  }
  renderBrandDirectory();
  toggleBrandAccordion('ibet');
  fetchTopPicksAndBoosts();
  updateWorldClocks();
  fetchManilaWeather();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboardApp);
} else {
  initDashboardApp();
}
