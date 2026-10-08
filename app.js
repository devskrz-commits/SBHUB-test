const DEFAULT_USER = "sportsbook2026";
const DEFAULT_PASS = "sb2026";

// Live Sportsbook Hub Data Repository
const sportsbookAppStore = {
  player: {
    name: "Marcus Huntington",
    team: "Liberty Deer",
    wins: 84,
    losses: 18,
    winRate: "82.3%",
    height: "2.06 m",
    weight: "113 kg",
    age: "40 years",
    country: "🇺🇸 USA"
  },
  gamesStats: [
    { date: "04 Nov 2025", matchLogo: "https://a.espncdn.com/i/teamlogos/nba/500/bos.png", matchName: "vs Celtics", score: "106-112", result: "Win", pts: 17.7, reb: 5.0, ast: 8.7, fg: 52 },
    { date: "02 Nov 2025", matchLogo: "https://a.espncdn.com/i/teamlogos/nba/500/lal.png", matchName: "vs Lakers", score: "102-97", result: "Win", pts: 15.9, reb: 5.7, ast: 8.0, fg: 60 },
    { date: "01 Nov 2025", matchLogo: "https://a.espncdn.com/i/teamlogos/nba/500/gs.png", matchName: "vs Warriors", score: "82-94", result: "Loss", pts: 14.8, reb: 4.2, ast: 9.1, fg: 51 },
    { date: "27 Oct 2025", matchLogo: "https://a.espncdn.com/i/teamlogos/nba/500/mia.png", matchName: "vs Heat", score: "107-90", result: "Win", pts: 16.5, reb: 3.9, ast: 7.2, fg: 45 }
  ],
  upcomingMatches: [
    {
      time: "July 22, 03:35 PM",
      homeTeam: "Liberty Deer",
      homeLogo: "https://a.espncdn.com/i/teamlogos/nba/500/mil.png",
      awayTeam: "All Stars",
      awayLogo: "https://a.espncdn.com/i/teamlogos/nba/500/atl.png",
      homeScore: 104,
      awayScore: 112,
      result: "W"
    },
    {
      time: "July 22, 04:10 PM",
      homeTeam: "Liberty Deer",
      homeLogo: "https://a.espncdn.com/i/teamlogos/nba/500/mil.png",
      awayTeam: "Unity Titans",
      awayLogo: "https://a.espncdn.com/i/teamlogos/nba/500/bkn.png",
      homeScore: 109,
      awayScore: 98,
      result: "W"
    }
  ]
};

/* --- FIREBASE INITIALIZATION --- */
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

/* --- SECURITY AUTHENTICATION SYSTEM --- */
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
  const userInput = document.getElementById('usernameInput');
  const passInput = document.getElementById('passwordInput');
  const rememberCheckbox = document.getElementById('rememberMe');

  const userVal = userInput ? userInput.value.trim() : '';
  const passVal = passInput ? passInput.value : '';
  const isRemember = rememberCheckbox ? rememberCheckbox.checked : false;

  const errorMsg = document.getElementById('loginErrorMsg');
  const card = document.getElementById('loginCard');

  if ((userVal === DEFAULT_USER || userVal === "sportsbookhub") && passVal === DEFAULT_PASS) {
    if (isRemember) {
      localStorage.setItem('sbhub_auth', 'true');
    } else {
      sessionStorage.setItem('sbhub_auth', 'true');
    }
    unlockDashboard();
  } else {
    if (errorMsg) errorMsg.textContent = "ACCESS DENIED: Invalid Security Key";
    if (card) {
      card.classList.add('shake');
      setTimeout(() => card.classList.remove('shake'), 500);
    }
    if (passInput) {
      passInput.focus();
      passInput.select();
    }
  }
}

function unlockDashboard() {
  const authOverlay = document.getElementById('authOverlay');
  const dashboardApp = document.getElementById('dashboardApp');
  if (authOverlay) authOverlay.classList.add('unlocked');
  if (dashboardApp) dashboardApp.classList.add('unlocked');
}

function handleLogout() {
  localStorage.removeItem('sbhub_auth');
  sessionStorage.removeItem('sbhub_auth');

  const dashboardApp = document.getElementById('dashboardApp');
  const authOverlay = document.getElementById('authOverlay');
  if (dashboardApp) dashboardApp.classList.remove('unlocked');
  if (authOverlay) authOverlay.classList.remove('unlocked');
}

/* --- RENDERING FUNCTIONALITY --- */
function renderDashboardUI(data) {
  if (!data) return;

  const winsEl = document.getElementById("statWins");
  if (winsEl) winsEl.textContent = data.player?.wins ?? 84;

  const lossesEl = document.getElementById("statLosses");
  if (lossesEl) lossesEl.textContent = data.player?.losses ?? 18;

  const winRateEl = document.getElementById("statWinRate");
  if (winRateEl) winRateEl.textContent = data.player?.winRate ?? "82.3%";

  renderGamesTable(data.gamesStats);
  renderUpcomingMatches(data.upcomingMatches);
}

function renderGamesTable(gamesList) {
  const tbody = document.getElementById("gamesTableBody");
  if (!tbody || !Array.isArray(gamesList)) return;

  let html = "";
  gamesList.forEach(g => {
    const isWin = g.result.toLowerCase() === "win";
    html += `
      <tr>
        <td>${g.date}</td>
        <td>
          <div class="match-cell-flex">
            <img src="${g.matchLogo}" alt="Match" class="match-crest-icon">
            <span>${g.matchName}</span>
          </div>
        </td>
        <td>${g.score}</td>
        <td class="${isWin ? 'text-win' : 'text-loss'}">${g.result}</td>
        <td>${g.pts}</td>
        <td>${g.reb}</td>
        <td>${g.ast}</td>
        <td>${g.fg}</td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function renderUpcomingMatches(matchesList) {
  const container = document.getElementById("sidebarMatchCards");
  if (!container || !Array.isArray(matchesList)) return;

  let html = "";
  matchesList.forEach(m => {
    html += `
      <div class="game-card-item">
        <div class="card-time-header">${m.time}</div>
        <div class="card-teams-row">
          <div class="team-unit">
            <img src="${m.homeLogo}" alt="${m.homeTeam}">
            <span>${m.homeTeam}</span>
            <div class="badge-round-res badge-w">W</div>
          </div>

          <div class="score-center-block">
            <span>${m.homeScore}</span>
            <span>-</span>
            <span>${m.awayScore}</span>
          </div>

          <div class="team-unit">
            <img src="${m.awayLogo}" alt="${m.awayTeam}">
            <span>${m.awayTeam}</span>
            <div class="badge-round-res badge-l">L</div>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* --- SEARCH FILTER ENGINE --- */
function initSearch() {
  const input = document.getElementById("globalSearchInput");
  if (!input) return;

  input.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = sportsbookAppStore.gamesStats.filter(g =>
      g.matchName.toLowerCase().includes(query) ||
      g.result.toLowerCase().includes(query) ||
      g.date.toLowerCase().includes(query)
    );
    renderGamesTable(filtered);
  });
}

/* --- HANDOVER MODAL CONTROLS --- */
function openHandoverModal() {
  const modal = document.getElementById('handoverModal');
  if (modal) modal.classList.add('show');
}

function closeHandoverModal() {
  const modal = document.getElementById('handoverModal');
  if (modal) modal.classList.remove('show');
}

/* --- INITIALIZATION --- */
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem('sbhub_auth') === 'true' || sessionStorage.getItem('sbhub_auth') === 'true') {
    unlockDashboard();
  }
  renderDashboardUI(sportsbookAppStore);
  initSearch();
});
