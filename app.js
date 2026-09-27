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

/* --- REAL-TIME TOP PICKS / HOT BOOSTS ENGINE (PRE-GAME ONLY, AUTO-REFRESH) --- */
async function fetchTopPicksAndBoosts() {
  const container = document.getElementById('topPicksContainer');
  if (!container) return;

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
      if (allPicks.length >= 7) break;
      try {
        const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league.code}/scoreboard`);
        if (!res.ok) continue;
        const data = await res.json();

        if (data && data.events && data.events.length > 0) {
          for (let i = 0; i < data.events.length; i++) {
            if (allPicks.length >= 7) break;
            const evt = data.events[i];

            // PRE-GAME FILTER ONLY: Remove matches automatically once they kick off (state !== 'pre')
            const isPreGame = evt.status?.type?.state === 'pre';
            if (!isPreGame) continue;

            const comp = evt.competitions?.[0];
            if (!comp) continue;

            const homeTeam = comp.competitors?.find(c => c.homeAway === 'home');
            const awayTeam = comp.competitors?.find(c => c.homeAway === 'away');

            if (homeTeam && awayTeam) {
              const homeName = homeTeam.team?.shortDisplayName || homeTeam.team?.displayName || "Home";
              const awayName = awayTeam.team?.shortDisplayName || awayTeam.team?.displayName || "Away";

              const homeLogo = homeTeam.team?.logo || homeTeam.team?.logos?.[0]?.href || "https://a.espncdn.com/i/teamlogos/soccer/500/default.png";
              const awayLogo = awayTeam.team?.logo || awayTeam.team?.logos?.[0]?.href || "https://a.espncdn.com/i/teamlogos/soccer/500/default.png";

              // Extract & Format Kick-off Date & Time
              const dateObj = new Date(evt.date || comp.date);
              const kickOffStr = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Asia/Manila',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }).format(dateObj).toUpperCase();

              const markets = [
                `${homeName} to Win + Over 2.5 Goals`,
                `${homeName} vs ${awayName} - Both Teams to Score`,
                `${homeName} to Win + Have 2+ Goals`,
                `${awayName} to Win or Draw + Over 1.5 Goals`
              ];

              const selectedMarket = markets[allPicks.length % markets.length];

              allPicks.push({
                homeName,
                awayName,
                homeLogo,
                awayLogo,
                leagueName: league.name,
                market: selectedMarket,
                badge: (allPicks.length % 2 === 0) ? "TOP PICK" : "HOT",
                kickOff: kickOffStr
              });
            }
          }
        }
      } catch (err) {
        console.warn(`Error fetching ${league.code}:`, err);
      }
    }

    // Fallback list of popular upcoming pre-game matches
    if (allPicks.length === 0) {
      allPicks = [
        {
          homeName: "Spain",
          awayName: "England",
          homeLogo: "https://a.espncdn.com/i/teamlogos/countries/500/esp.png",
          awayLogo: "https://a.espncdn.com/i/teamlogos/countries/500/eng.png",
          leagueName: "UEFA EURO",
          market: "Spain to Win + Over 2.5 Goals",
          badge: "TOP PICK",
          kickOff: "27 SEP, 21:00"
        },
        {
          homeName: "Bournemouth",
          awayName: "Liverpool",
          homeLogo: "https://a.espncdn.com/i/teamlogos/soccer/500/349.png",
          awayLogo: "https://a.espncdn.com/i/teamlogos/soccer/500/364.png",
          leagueName: "Premier League",
          market: "Bournemouth to Win + Over 2.5 Goals",
          badge: "TOP PICK",
          kickOff: "28 SEP, 00:30"
        },
        {
          homeName: "Leeds",
          awayName: "C Palace",
          homeLogo: "https://a.espncdn.com/i/teamlogos/soccer/500/341.png",
          awayLogo: "https://a.espncdn.com/i/teamlogos/soccer/500/384.png",
          leagueName: "Premier League",
          market: "Leeds vs C Palace - Both Teams to Score",
          badge: "HOT",
          kickOff: "28 SEP, 03:00"
        },
        {
          homeName: "Man City",
          awayName: "Sunderland",
          homeLogo: "https://a.espncdn.com/i/teamlogos/soccer/500/382.png",
          awayLogo: "https://a.espncdn.com/i/teamlogos/soccer/500/383.png",
          leagueName: "Premier League",
          market: "Man City to Win + Have 2+ Goals",
          badge: "TOP PICK",
          kickOff: "28 SEP, 21:00"
        },
        {
          homeName: "Fulham",
          awayName: "Man United",
          homeLogo: "https://a.espncdn.com/i/teamlogos/soccer/500/370.png",
          awayLogo: "https://a.espncdn.com/i/teamlogos/soccer/500/360.png",
          leagueName: "Premier League",
          market: "Man United to Win or Draw + Over 1.5 Goals",
          badge: "HOT",
          kickOff: "29 SEP, 00:00"
        },
        {
          homeName: "Getafe",
          awayName: "Málaga",
          homeLogo: "https://a.espncdn.com/i/teamlogos/soccer/500/2922.png",
          awayLogo: "https://a.espncdn.com/i/teamlogos/soccer/500/1069.png",
          leagueName: "La Liga",
          market: "Getafe to Win + Over 2.5 Goals",
          badge: "TOP PICK",
          kickOff: "29 SEP, 03:00"
        },
        {
          homeName: "Atlético",
          awayName: "Real Madrid",
          homeLogo: "https://a.espncdn.com/i/teamlogos/soccer/500/1068.png",
          awayLogo: "https://a.espncdn.com/i/teamlogos/soccer/500/86.png",
          leagueName: "La Liga",
          market: "Atlético vs Real Madrid - Both Teams to Score",
          badge: "HOT",
          kickOff: "29 SEP, 20:00"
        }
      ];
    }

    allPicks = allPicks.slice(0, 7);

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
            <div class="boost-kickoff-pill"><i class='bx bx-time-five'></i> ${pick.kickOff}</div>
          </div>
        </div>
      `;
    });

    container.innerHTML = cardsHtml;
  } catch (e) {
    container.innerHTML = `<div style="text-align:center; padding:10px; font-size:11px; color:#f87171;">Failed to fetch live boosts.</div>`;
  }
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

/* --- SITTING ROBOT EYE & HEAD TRACKING --- */
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

/* --- REAL-TIME PHILIPPINES (MANILA) WEATHER FORECAST --- */
async function fetchManilaWeather() {
  const tempEl = document.getElementById('weatherTemp');
  const condEl = document.getElementById('weatherCond');
  const humEl = document.getElementById('weatherHumidity');
  const windEl = document.getElementById('weatherWind');
  const iconEl = document.getElementById('weatherIcon');

  if (!tempEl) return;

  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=14.5995&longitude=120.9842&current_weather=true&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia%2FManila';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();

    let temp, humidity, wind, code;

    if (data && data.current) {
      temp = Math.round(data.current.temperature_2m ?? data.current_weather?.temperature);
      humidity = data.current.relative_humidity_2m ?? 56;
      wind = Math.round(data.current.wind_speed_10m ?? data.current_weather?.windspeed ?? 7);
      code = data.current.weather_code ?? data.current_weather?.weathercode ?? 3;
    } else if (data && data.current_weather) {
      temp = Math.round(data.current_weather.temperature);
      humidity = 56;
      wind = Math.round(data.current_weather.windspeed);
      code = data.current_weather.weathercode;
    } else {
      throw new Error('Invalid weather payload');
    }

    const weatherMeta = parseWMOWeatherCode(code);

    tempEl.textContent = `${temp}°C`;
    if (condEl) condEl.textContent = weatherMeta.label;
    if (humEl) humEl.textContent = `Humidity: ${humidity}%`;
    if (windEl) windEl.textContent = `Wind: ${wind} km/h`;

    if (iconEl) {
      iconEl.className = `bx ${weatherMeta.icon}`;
      iconEl.style.color = weatherMeta.color;
    }
  } catch (err) {
    console.warn('Weather fetch fallback triggered:', err);
    tempEl.textContent = '32°C';
    if (condEl) condEl.textContent = 'OVERCAST';
    if (humEl) humEl.textContent = 'Humidity: 56%';
    if (windEl) windEl.textContent = 'Wind: 7 km/h';
  }
}

function parseWMOWeatherCode(code) {
  if (code === 0) return { label: 'CLEAR SKY', icon: 'bx-sun', color: '#f59e0b' };
  if (code === 1 || code === 2) return { label: 'PARTLY CLOUDY', icon: 'bx-cloud-sun', color: '#f59e0b' };
  if (code === 3) return { label: 'OVERCAST', icon: 'bx-cloud', color: '#38bdf8' };
  if (code >= 45 && code <= 48) return { label: 'FOGGY', icon: 'bx-cloud-fog', color: '#94a3b8' };
  if (code >= 51 && code <= 67) return { label: 'LIGHT RAIN', icon: 'bx-cloud-drizzle', color: '#60a5fa' };
  if (code >= 80 && code <= 82) return { label: 'HEAVY RAIN', icon: 'bx-cloud-showers-heavy', color: '#3b82f6' };
  if (code >= 95) return { label: 'THUNDERSTORM', icon: 'bx-cloud-lightning', color: '#eab308' };
  return { label: 'CLOUDY', icon: 'bx-cloud', color: '#38bdf8' };
}

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

/* --- VISUAL TEXTURE & SILK WAVE THEME ENGINE --- */
function setGradient(theme) {
  const body = document.getElementById('pageBody');
  let backgroundStyle = '';

  switch(theme) {
    case 'plain-slate': backgroundStyle = '#0f172a'; break;
    case 'plain-navy': backgroundStyle = '#0b1329'; break;
    case 'plain-onyx': backgroundStyle = '#121212'; break;

    case 'silk-lavender':
      backgroundStyle = 'linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.45)), url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop")';
      break;
    case 'silk-coral':
      backgroundStyle = 'linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.45)), url("https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1920&auto=format&fit=crop")';
      break;
    case 'silk-pastel':
      backgroundStyle = 'linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.4)), url("https://images.unsplash.com/photo-1550684848-bac1c5b4e853?q=80&w=1920&auto=format&fit=crop")';
      break;
    case 'silk-mint':
      backgroundStyle = 'linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.45)), url("https://images.unsplash.com/photo-1604076913837-52ab5629fba9?q=80&w=1920&auto=format&fit=crop")';
      break;
    case 'silk-iridescent':
      backgroundStyle = 'linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.4)), url("https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1920&auto=format&fit=crop")';
      break;

    case 'abstract-bubbles':
      backgroundStyle = 'linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.4)), url("https://images.unsplash.com/photo-1520690214124-2405c50470c6?q=80&w=1920&auto=format&fit=crop")';
      break;
    case 'abstract-lava':
      backgroundStyle = 'linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.45)), url("https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1920&auto=format&fit=crop")';
      break;
  }

  body.style.background = backgroundStyle;
  body.style.backgroundSize = 'cover';
  body.style.backgroundPosition = 'center';
  body.style.backgroundAttachment = 'fixed';
  body.style.backgroundRepeat = 'no-repeat';

  document.getElementById('themeMenu').classList.remove('show');
  localStorage.setItem('sbhub_theme', backgroundStyle);
}

/* --- REAL-TIME LIVE DUTY ROSTER (FIREBASE) --- */
function getCurrentSlotInfo() {
  const now = new Date();
  const hours = now.getHours();
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
  calculateActiveTraders();
}

/* --- 7-DAY TOP GAMES SCOREBOARD ENGINE (FLASHSCORE GMT+8 SYNC) --- */
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
  container.innerHTML = `<div style="text-align:center; padding:15px;"><i class='bx bx-loader-alt bx-spin' style="font-size:20px; color:#38bdf8;"></i></div>`;
  
  try {
    const targetDateQuery = getFormattedDateQuery(selectedGameDayOffset);
    const targetDateObj = getGMT8DateObj(selectedGameDayOffset);
    const dateLabelStr = targetDateObj.toLocaleDateString("en-US", { month: 'short', day: 'numeric' }).toUpperCase();
    
    let dayTag = `DAY ${selectedGameDayOffset + 1}`;
    if (selectedGameDayOffset === 0) dayTag = `TODAY`;

    const labelEl = document.getElementById("matchDayDisplay");
    if (labelEl) labelEl.textContent = `${dayTag} (${dateLabelStr})`;

    const primaryLeagues = [
      { name: "EUROPEAN CHAMPIONSHIPS", code: "uefa.euro", priority: "P1" },
      { name: "GB ENGLAND PREMIER LEAGUE", code: "eng.1", priority: "P1" },
      { name: "ES SPAIN LA LIGA", code: "esp.1", priority: "P1" },
      { name: "DE GERMANY BUNDESLIGA", code: "ger.1", priority: "P1" },
      { name: "IT ITALY SERIE A", code: "ita.1", priority: "P1" },
      { name: "FR FRANCE LIGUE 1", code: "fra.1", priority: "P1" },
      { name: "PT PORTUGAL LIGA", code: "por.1", priority: "P1" },
      { name: "NL NETHERLANDS EREDIVISIE", code: "ned.1", priority: "P1" }
    ];

    const backupLeagues = [
      { name: "ASIA: FIFA ASEAN CUP - DIV 1", code: "aff.championship", priority: "P2" },
      { name: "EUROPE: UEFA NATIONS LEAGUE", code: "uefa.nations", priority: "P2" },
      { name: "USA: MLS", code: "usa.1", priority: "P2" },
      { name: "AFRICA: AFCON QUALIFICATION", code: "caf.nations_qual", priority: "P2" },
      { name: "ASIA: ASIAN GAMES WOMEN", code: "asia.games.w", priority: "P2" }
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
          let leagueEvents = result.events;

          if (result.league.code === 'uefa.nations' && leagueEvents.length > 10) {
            const topNations = ['France', 'Spain', 'Germany', 'England', 'Italy', 'Portugal', 'Netherlands', 'Belgium', 'Croatia', 'Denmark', 'Switzerland', 'Austria', 'Serbia', 'Hungary', 'Poland'];
            
            leagueEvents.sort((a, b) => {
              const getScore = (evt) => {
                const comp = evt.competitions?.[0];
                const home = comp?.competitors?.find(c => c.homeAway === 'home')?.team?.displayName || '';
                const away = comp?.competitors?.find(c => c.homeAway === 'away')?.team?.displayName || '';
                let score = 0;
                topNations.forEach(n => {
                  if (home.toLowerCase().includes(n.toLowerCase())) score += 2;
                  if (away.toLowerCase().includes(n.toLowerCase())) score += 2;
                });
                return score;
              };
              return getScore(b) - getScore(a);
            });

            leagueEvents = leagueEvents.slice(0, 10);
          }

          leagueEvents.forEach(e => {
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

    allMatches.forEach(item => {
      const match = item.event.competitions[0];
      const home = match.competitors?.find(c => c.homeAway === 'home')?.team?.shortDisplayName || "Home";
      const away = match.competitors?.find(c => c.homeAway === 'away')?.team?.shortDisplayName || "Away";
      const dateObj = new Date(item.event.date);
      
      const timeStr = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(dateObj);
      
      let status = "UPCOMING";
      if (item.event.status?.type?.state === 'in') status = "LIVE";
      else if (item.event.status?.type?.completed === true) status = "FINAL";

      gamesHtml += `
        <div class="game-card" style="background: rgba(255,255,255,0.05); padding: 10px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); font-size: 11px; margin-bottom: 8px;">
          <div style="font-size: 10px; opacity: 0.75; font-weight: 700; display:flex; justify-content:space-between;">
            <span>${item.league.name}</span>
            <span style="color:${item.league.priority==='P1'?'#fbbf24':'#38bdf8'}; font-size:9px;">${item.league.priority==='P1'?'TOP TIER':'SECONDARY'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 13px; margin: 4px 0;">
            <span>${home}</span><span style="opacity: 0.5;">VS</span><span>${away}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 10px; opacity: 0.75;">
            <span>${timeStr} (GMT+8)</span><span style="color: #34d399; font-weight: 700;">${status}</span>
          </div>
        </div>
      `;
    });

    if (!gamesHtml || allMatches.length === 0) {
      gamesHtml = `<div style="text-align:center; padding:20px; font-size:11px; opacity:0.7;">No live or secondary matches scheduled for this date.</div>`;
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
function initDashboardApp() {
  const savedTheme = localStorage.getItem('sbhub_theme');
  if (savedTheme) {
    const pageBody = document.getElementById('pageBody');
    if (pageBody) {
      pageBody.style.background = savedTheme;
      pageBody.style.backgroundSize = 'cover';
      pageBody.style.backgroundPosition = 'center';
      pageBody.style.backgroundAttachment = 'fixed';
      pageBody.style.backgroundRepeat = 'no-repeat';
    }
  } else {
    setGradient('silk-lavender');
  }

  if (sessionStorage.getItem('sbhub_auth') === 'true') {
    unlockDashboard();
  }

  switchBrandTab('ibet');
  fetchTopPicksAndBoosts();
  
  // AUTO-REFRESH TOP PICKS / BOOSTS EVERY 2 MINUTES (Auto-removes kicked off matches)
  setInterval(fetchTopPicksAndBoosts, 2 * 60 * 1000);

  listenToLiveDutyRoster();
  fetchLiveGames();
  calculateActiveTraders();
  fetchManilaWeather();
  setInterval(fetchManilaWeather, 15 * 60 * 1000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboardApp);
} else {
  initDashboardApp();
}

window.addEventListener('click', function(e) {
  if (!e.target.closest('.dropdown-container')) {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
  }
});
