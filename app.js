const playerStore = {
  name: "Marcus Huntington",
  team: "Liberty Deer",
  wins: 84,
  losses: 18,
  winRate: "82.3%",
  height: "2.06 m",
  weight: "113 kg",
  age: "40 years",
  country: "🇺🇸 USA",
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
      awayScore: 112
    },
    {
      time: "July 22, 04:10 PM",
      homeTeam: "Liberty Deer",
      homeLogo: "https://a.espncdn.com/i/teamlogos/nba/500/mil.png",
      awayTeam: "Unity Titans",
      awayLogo: "https://a.espncdn.com/i/teamlogos/nba/500/bkn.png",
      homeScore: 109,
      awayScore: 98
    }
  ]
};

function renderDashboard(data) {
  if (!data) return;

  const nameEl = document.getElementById("playerName");
  if (nameEl) nameEl.innerHTML = (data.name || "Marcus Huntington").replace(" ", "<br>");

  const teamEl = document.getElementById("playerTeam");
  if (teamEl) teamEl.textContent = data.team || "Liberty Deer";

  const winsEl = document.getElementById("statWins");
  if (winsEl) winsEl.textContent = data.wins ?? 84;

  const lossesEl = document.getElementById("statLosses");
  if (lossesEl) lossesEl.textContent = data.losses ?? 18;

  const winRateEl = document.getElementById("statWinRate");
  if (winRateEl) winRateEl.textContent = data.winRate ?? "82.3%";

  renderTable(data.gamesStats);
  renderMatches(data.upcomingMatches);
}

function renderTable(list) {
  const tbody = document.getElementById("gamesTableBody");
  if (!tbody || !Array.isArray(list)) return;

  tbody.innerHTML = list.map(g => {
    const isWin = g.result.toLowerCase() === "win";
    return `
      <tr>
        <td>${g.date}</td>
        <td>
          <div class="match-cell-flex">
            <img src="${g.matchLogo}" class="match-crest-icon" alt="crest">
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
  }).join('');
}

function renderMatches(list) {
  const container = document.getElementById("sidebarMatchCards");
  if (!container || !Array.isArray(list)) return;

  container.innerHTML = list.map(m => `
    <div class="match-card-item">
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
  `).join('');
}

function initSearch() {
  const input = document.getElementById("globalSearchInput");
  if (!input) return;

  input.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = playerStore.gamesStats.filter(g =>
      g.matchName.toLowerCase().includes(query) ||
      g.result.toLowerCase().includes(query) ||
      g.date.toLowerCase().includes(query)
    );
    renderTable(filtered);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderDashboard(playerStore);
  initSearch();
});
