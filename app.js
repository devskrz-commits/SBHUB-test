<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sportsbook Operations Hub</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
</head>
<body id="pageBody">
  <!-- BACKGROUND ANIMATION CANVAS -->
  <canvas id="bgCanvas"></canvas>

  <!-- TRADING TERMINAL AUTHENTICATION & SECURITY GATEWAY -->
  <div id="authOverlay">
    <div class="gateway-trend-header">
      <div class="trend-header-left">
        <div class="trend-icon"><i class="fa-solid fa-chart-line"></i></div>
        <div>
          <span class="trend-title">GLOBAL TRADING GATEWAY</span>
          <span class="trend-sub">Real-Time Risk Operations & Index Analytics</span>
        </div>
      </div>
      <div class="trend-stats-pill">
        <span class="stat-dot"></span>
        <span>LATENCY: 14MS &bull; FEED: SECURE</span>
      </div>
    </div>

    <div class="login-container">
      <div class="login-card" id="loginCard">
        <div class="sitting-robot-stage" id="sittingRobotStage">
          <div class="robot-body-wrapper" id="robotBodyWrapper">
            <div class="robot-head" id="robotHead">
              <div class="robot-antenna"></div>
              <div class="robot-visor">
                <div class="robot-eye left" id="leftEye"></div>
                <div class="robot-eye right" id="rightEye"></div>
              </div>
            </div>
            <div class="robot-torso">
              <div class="robot-leg left"></div>
              <div class="robot-leg right"></div>
            </div>
          </div>
        </div>

        <h1 class="login-title">Security Gateway</h1>
        <p class="login-subtitle">SPORTSBOOK TRADING PORTAL</p>

        <form class="login-input-group" onsubmit="handleLogin(event)">
          <div class="field-wrapper">
            <label class="login-label">Username or Email</label>
            <input type="text" id="usernameInput" class="login-input" value="sportsbook2026" placeholder="Operator ID" required>
          </div>

          <div class="field-wrapper">
            <div class="field-label-row">
              <label class="login-label">Security Key</label>
              <a href="#" class="forgot-link">Forgot key?</a>
            </div>
            <div class="password-field-wrap">
              <input type="password" id="passwordInput" class="login-input" placeholder="Enter password" value="sb2026" required>
              <button class="password-toggle-btn" type="button" onclick="togglePasswordVisibility()"><i class="fa-solid fa-eye" id="togglePassIcon"></i></button>
            </div>
          </div>

          <div class="remember-row">
            <input type="checkbox" id="rememberMe" checked>
            <label for="rememberMe">Maintain active session</label>
          </div>

          <button class="login-btn" type="submit">
            <i class="fa-solid fa-key"></i> ACCESS DASHBOARD
          </button>

          <div class="login-error" id="loginErrorMsg"></div>
        </form>
      </div>
    </div>
  </div>

  <!-- MAIN DASHBOARD FROSTED CONTAINER -->
  <div id="dashboardApp">
    <!-- EXECUTIVE TOP NAVIGATION BAR -->
    <header class="top-nav-bar">
      <div class="nav-brand-group">
        <button class="mobile-menu-toggle" onclick="toggleMobileTopMenu()"><i class="fa-solid fa-bars"></i></button>
        <div class="top-brand-title">
          <i class="fa-solid fa-chart-pie"></i>
          <span>Hi, Operator!</span>
        </div>
      </div>

      <div class="top-search-box">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" placeholder="Search markets, tools..." oninput="filterTopNav(this.value)">
      </div>

      <nav class="top-nav-items" id="topNavMenu">
        <!-- 1. INTERNAL -->
        <div class="top-nav-dropdown-group">
          <button class="top-nav-btn" onclick="toggleTopDropdown(event, this)">
            <span class="nav-icon-wrapper"><i class="fa-solid fa-house"></i></span>
            INTERNAL
            <i class="fa-solid fa-chevron-down nav-arrow"></i>
          </button>
          <div class="top-dropdown-menu">
            <a href="#" class="top-dropdown-link"><span>DAILY DUTY</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>ROTA</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>DAILY BIG WINNERS</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>HANDOVER</span> <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>

        <!-- 2. DAILY TASKS -->
        <div class="top-nav-dropdown-group">
          <button class="top-nav-btn" onclick="toggleTopDropdown(event, this)">
            <span class="nav-icon-wrapper"><i class="fa-solid fa-calendar-check"></i></span>
            DAILY TASKS
            <i class="fa-solid fa-chevron-down nav-arrow"></i>
          </button>
          <div class="top-dropdown-menu">
            <a href="#" class="top-dropdown-link"><span>TOP PICKS</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>EDGE BOOST (MIG)</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>IBET BOOST (MIG)</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>KT SPORTS CHECK</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>PREDICTION OFFER CHECK</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>EDGE BOOST SYS</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>IBET BOOST SYS</span> <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>

        <!-- 3. DAILY MONITORING -->
        <div class="top-nav-dropdown-group">
          <button class="top-nav-btn" onclick="toggleTopDropdown(event, this)">
            <span class="nav-icon-wrapper"><i class="fa-solid fa-chart-line"></i></span>
            DAILY MONITORING
            <i class="fa-solid fa-chevron-down nav-arrow"></i>
          </button>
          <div class="top-dropdown-menu">
            <a href="#" class="top-dropdown-link"><span>GREEN TRACKER</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>RED TRACKER</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>ORANGE TRACKER</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>7A TRACKER</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>GREEN CRM</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>RED CRM</span> <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>

        <!-- 4. BACK OFFICE -->
        <div class="top-nav-dropdown-group">
          <button class="top-nav-btn" onclick="toggleTopDropdown(event, this)">
            <span class="nav-icon-wrapper"><i class="fa-solid fa-briefcase"></i></span>
            BACK OFFICE
            <i class="fa-solid fa-chevron-down nav-arrow"></i>
          </button>
          <div class="top-dropdown-menu">
            <a href="#" class="top-dropdown-link"><span>QBET/55/30</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>IBET</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>PUBS</span> <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>

        <!-- 5. MULTI-MONITOR -->
        <div class="top-nav-dropdown-group">
          <button class="top-nav-btn" onclick="toggleTopDropdown(event, this)">
            <span class="nav-icon-wrapper"><i class="fa-solid fa-desktop"></i></span>
            MULTI-MONITOR
            <i class="fa-solid fa-chevron-down nav-arrow"></i>
          </button>
          <div class="top-dropdown-menu">
            <a href="#" class="top-dropdown-link"><span>EDGE PREDICTION TICKER</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>PUBS PREDICTION TICKER</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>QBET/55/30 REJECTED</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>PUBS REJECTED</span> <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>

        <!-- 6. BETRADAR -->
        <div class="top-nav-dropdown-group">
          <button class="top-nav-btn" onclick="toggleTopDropdown(event, this)">
            <span class="nav-icon-wrapper"><i class="fa-solid fa-bullseye"></i></span>
            BETRADAR
            <i class="fa-solid fa-chevron-down nav-arrow"></i>
          </button>
          <div class="top-dropdown-menu">
            <a href="#" class="top-dropdown-link"><span>MTS</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>CTRL PORTAL</span> <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>

        <!-- 7. OWN BRANDS -->
        <div class="top-nav-dropdown-group">
          <button class="top-nav-btn" onclick="toggleTopDropdown(event, this)">
            <span class="nav-icon-wrapper"><i class="fa-solid fa-layer-group"></i></span>
            OWN BRANDS
            <i class="fa-solid fa-chevron-down nav-arrow"></i>
          </button>
          <div class="top-dropdown-menu">
            <a href="#" class="top-dropdown-link"><span>7A</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>QBET</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>55BET</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>30BET</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>GQBET</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>BVBET</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>IBET</span> <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>

        <!-- 8. PRICE REFERENCES -->
        <div class="top-nav-dropdown-group">
          <button class="top-nav-btn" onclick="toggleTopDropdown(event, this)">
            <span class="nav-icon-wrapper"><i class="fa-solid fa-coins"></i></span>
            PRICE REFERENCES
            <i class="fa-solid fa-chevron-down nav-arrow"></i>
          </button>
          <div class="top-dropdown-menu">
            <a href="#" class="top-dropdown-link"><span>FLASHSCORE</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>BETSAPI</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>ODDSPORTAL</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>ODDSCHECKER</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>BETFAIR</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>BET365</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>PINNACLE</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>GGBET</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>UNIBET</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>SOFASCORE</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>MARATHONBET</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>FONBET</span> <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>

        <!-- 9. PROCEDURES -->
        <div class="top-nav-dropdown-group">
          <button class="top-nav-btn" onclick="toggleTopDropdown(event, this)">
            <span class="nav-icon-wrapper"><i class="fa-solid fa-file-lines"></i></span>
            PROCEDURES
            <i class="fa-solid fa-chevron-down nav-arrow"></i>
          </button>
          <div class="top-dropdown-menu">
            <a href="#" class="top-dropdown-link"><span>CONFLUENCE</span> <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#" class="top-dropdown-link"><span>WORKSPACE</span> <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>

        <!-- 10. QUICK LAUNCH -->
        <div class="top-nav-dropdown-group">
          <button class="top-nav-btn" onclick="toggleTopDropdown(event, this)">
            <span class="nav-icon-wrapper"><i class="fa-solid fa-rocket"></i></span>
            QUICK LAUNCH
            <i class="fa-solid fa-chevron-down nav-arrow"></i>
          </button>
          <div class="top-dropdown-menu">
            <a href="https://claude.ai" target="_blank" class="top-dropdown-link"><span>Claude AI</span> <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
            <a href="#" class="top-dropdown-link"><span>Risk Seg. Tool</span> <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
          </div>
        </div>
      </nav>

      <div class="top-admin-container">
        <div class="admin-top-pill">
          <div class="avatar-circle">AD</div>
          <span class="user-title">Operator</span>
        </div>
        <button class="logout-action-btn" onclick="handleLogout()"><i class="fa-solid fa-power-off"></i> Exit</button>
      </div>
    </header>

    <!-- MAIN WORKSPACE -->
    <main class="main-workspace">
      <section class="glass-card top-banner-card">
        <div class="banner-top-row">
          <div class="banner-top-left-group">
            <div class="weather-banner-widget">
              <div class="weather-banner-header">
                <span class="weather-banner-title">METRICS / WEATHER</span>
                <div class="weather-banner-actions"><i class="fa-solid fa-sun" id="weatherIcon"></i></div>
              </div>
              <div class="weather-banner-body">
                <div class="weather-banner-main">
                  <span class="weather-banner-temp" id="weatherTemp">32°C</span>
                  <div class="weather-banner-cond">
                    <div class="weather-location-tag">Manila, PH</div>
                    <div id="weatherCond">PARTLY CLOUDY</div>
                  </div>
                </div>
                <div class="weather-banner-details">
                  <span id="weatherHumidity">Humidity: 56%</span>
                  <span id="weatherWind">Wind: 7 km/h</span>
                </div>
              </div>
            </div>

            <div class="urgent-handover-banner">
              <div class="handover-header-row">
                <div class="handover-alert-badge">
                  <i class="fa-solid fa-triangle-exclamation"></i> Shift Alerts
                  <span class="handover-count-pill">1</span>
                </div>
              </div>
              <div class="handover-pills-container">
                <div class="handover-pill-item">
                  <span class="handover-pill-brand">Green Client</span>
                  <span class="priority-tag urgent">Urgent</span>
                  <span class="handover-pill-msg">Tracking Limit Adjustment Required</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="banner-bottom-row">
          <div class="world-clocks">
            <div class="clock-badge">
              <span class="clock-label">MANILA (GMT+8)</span>
              <span class="clock-time" id="clock-gmt8">00:00:00</span>
            </div>
            <div class="clock-badge">
              <span class="clock-label">CET</span>
              <span class="clock-time" id="clock-cet">00:00:00</span>
            </div>
            <div class="clock-badge">
              <span class="clock-label">GMT+2</span>
              <span class="clock-time" id="clock-gmt2">00:00:00</span>
            </div>
          </div>

          <div class="banner-controls-group">
            <div class="metric-pill">
              <i class="fa-solid fa-users-viewfinder"></i>
              <div>
                <div style="font-size:8px; opacity:0.7;">ACTIVE TRADERS</div>
                <div style="font-size:11px;" id="activeTraderCount">4 Working</div>
              </div>
            </div>

            <div class="dropdown-container">
              <button class="dropdown-btn" onclick="toggleDropdown('themeMenu')">
                <i class="fa-solid fa-palette"></i> Display Mode <i class="fa-solid fa-chevron-down" style="font-size:9px;"></i>
              </button>
              <div class="dropdown-menu" id="themeMenu">
                <div class="dropdown-section-title">THEMES</div>
                <div class="menu-option" onclick="setGradient('plain-daylight')">Frosted White <span class="color-dot" style="background:#ffffff;"></span></div>
                <div class="menu-option" onclick="setGradient('plain-slate')">Dark Slate <span class="color-dot" style="background:#000000;"></span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="dashboard-grid">
        <div class="glass-card widget-column-card">
          <div class="card-header">
            <span>🔥 TOP PICKS / BOOSTS</span>
            <span class="actions"><i class="fa-solid fa-bolt"></i> Live</span>
          </div>
          <div class="top-picks-filter-bar" id="topPicksFilterBar">
            <button class="boost-filter-btn active" id="btn-boost-eng.1" onclick="filterTopPicks('eng.1', this)">EPL</button>
            <button class="boost-filter-btn" id="btn-boost-esp.1" onclick="filterTopPicks('esp.1', this)">La Liga</button>
            <button class="boost-filter-btn" id="btn-boost-ger.1" onclick="filterTopPicks('ger.1', this)">Bundesliga</button>
            <button class="boost-filter-btn" id="btn-boost-ita.1" onclick="filterTopPicks('ita.1', this)">Serie A</button>
            <button class="boost-filter-btn" id="btn-boost-uefa.champions" onclick="filterTopPicks('uefa.champions', this)">UCL</button>
          </div>
          <div class="widget-scrollable-content top-picks-list" id="topPicksContainer"></div>
        </div>

        <div class="widget-dual-column">
          <div class="glass-card widget-half-card">
            <div class="card-header">
              <span>OPERATIONAL BRANDS</span>
              <div class="tab-pills">
                <span class="tab-pill active" id="tab-ibet" onclick="switchBrandTab('ibet')">iBet</span>
                <span class="tab-pill" id="tab-edge" onclick="switchBrandTab('edge')">Edge</span>
                <span class="tab-pill" id="tab-pubs" onclick="switchBrandTab('pubs')">PuBs</span>
              </div>
            </div>
            <div class="widget-scrollable-content" style="display:flex; flex-direction:column; gap:7px;" id="brandLinksContainer"></div>
          </div>

          <div class="glass-card widget-half-card">
            <div class="card-header">
              <span>LIVE SHIFT ROSTER</span>
              <span class="actions"><i class="fa-solid fa-list-check"></i> GMT+8</span>
            </div>
            <div class="widget-scrollable-content" style="display:flex; flex-direction:column; gap:8px;" id="liveDutyContent"></div>
          </div>
        </div>

        <div class="glass-card widget-column-card">
          <div class="card-header">
            <span>⚽ TOP MATCHES</span>
            <span class="actions" id="matchDayDisplay">TODAY</span>
          </div>
          <div class="matchday-selector">
            <span style="cursor:pointer;" onclick="navigateMatchDay(-1)"><i class="fa-solid fa-chevron-left"></i> Prev Day</span>
            <span style="cursor:pointer;" onclick="navigateMatchDay(1)">Next Day <i class="fa-solid fa-chevron-right"></i></span>
          </div>
          <div class="widget-scrollable-content" style="display:flex; flex-direction:column; gap:9px;" id="gamesContainer"></div>
        </div>

        <div class="glass-card widget-column-card dark-theme-card">
          <div class="card-header">
            <span>⚙️ SYSTEM METRICS</span>
            <span class="actions" style="color:#ffffff;"><i class="fa-solid fa-server"></i> Stable</span>
          </div>
          <div class="widget-scrollable-content" style="display:flex; flex-direction:column; gap:9px;">
            <div class="duty-card" style="background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.15);">
              <div class="duty-top" style="color:#ffffff;"><span>API Gateway</span> <span style="color:#4ade80;">99.9%</span></div>
              <div class="duty-desc" style="color:#a1a1aa;">Latency: 14ms (Trading Feed Active)</div>
            </div>
            <div class="duty-card" style="background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.15);">
              <div class="duty-top" style="color:#ffffff;"><span>Tracking Engine</span> <span style="color:#4ade80;">Active</span></div>
              <div class="duty-desc" style="color:#a1a1aa;">Monitoring Green & Red CRM client limits.</div>
            </div>
            <div class="duty-card" style="background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.15);">
              <div class="duty-top" style="color:#ffffff;"><span>Currency Rate</span> <span style="color:#38bdf8;">PHP / EUR</span></div>
              <div class="duty-desc" style="color:#a1a1aa;">1 EUR = 62.45 PHP (Live Sync)</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <script src="app.js"></script>
</body>
</html>
