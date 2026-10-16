/* eslint-disable */
/* jshint ignore:start */
"use strict";

// Initialize Icons safely
if (typeof window.lucide !== "undefined") {
    window.lucide.createIcons();
}

// --- Auth / Secure Login ---
var DEFAULT_USER = "sportsbook2026";
var DEFAULT_PASS = "sb2026";

function handleLogin(e) {
    e.preventDefault();
    var userEl = document.getElementById("usernameInput");
    var passEl = document.getElementById("passwordInput");
    
    if (!userEl || !passEl) return;
    
    var user = userEl.value.trim();
    var pass = passEl.value;
    
    if ((user === DEFAULT_USER || user === "sportsbookhub") && pass === DEFAULT_PASS) {
        localStorage.setItem("sbhub_auth", "true");
        document.getElementById("authOverlay").classList.add("unlocked");
        document.getElementById("dashboardWrapper").classList.add("unlocked");
        document.getElementById("loginErrorMsg").innerText = "";
    } else {
        document.getElementById("loginErrorMsg").innerText = "Invalid credentials";
        var card = document.querySelector(".login-card");
        if (card) {
            card.classList.add("shake");
            setTimeout(function() {
                card.classList.remove("shake");
            }, 400);
        }
    }
}

function handleLogout() {
    localStorage.removeItem("sbhub_auth");
    var authOverlay = document.getElementById("authOverlay");
    var dashboardWrapper = document.getElementById("dashboardWrapper");
    var passwordInput = document.getElementById("passwordInput");
    
    if (authOverlay) { authOverlay.classList.remove("unlocked"); }
    if (dashboardWrapper) { dashboardWrapper.classList.remove("unlocked"); }
    if (passwordInput) { passwordInput.value = ""; }
}

// Check session on load
if (localStorage.getItem("sbhub_auth") === "true") {
    var authOverlay = document.getElementById("authOverlay");
    var dashboardWrapper = document.getElementById("dashboardWrapper");
    if (authOverlay) { authOverlay.classList.add("unlocked"); }
    if (dashboardWrapper) { dashboardWrapper.classList.add("unlocked"); }
}

// --- UI Interactions ---
function toggleMenu(menuId) {
    var menu = document.getElementById(menuId);
    if (menu) {
        if (menu.classList.contains("open")) {
            menu.classList.remove("open");
        } else {
            menu.classList.add("open");
        }
    }
}

function openModal(id) { 
    var modal = document.getElementById(id);
    if (modal) {
        modal.classList.add("active"); 
    }
}

function closeModal(id) { 
    var modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove("active"); 
    }
}

// --- Sidebar Search ---
function filterSidebar() {
    var searchInput = document.getElementById("sidebarSearchInput");
    if (!searchInput) return;
    
    var query = searchInput.value.toLowerCase();
    var links = document.querySelectorAll(".sub-link");
    
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var text = link.innerText.toLowerCase();
        var parentMenu = link.closest(".sub-menu");
        
        if (text.indexOf(query) !== -1) {
            link.style.display = "block";
            if (query.length > 0 && parentMenu) {
                parentMenu.classList.add("open");
                link.classList.add("highlight");
            } else {
                link.classList.remove("highlight");
            }
        } else {
            link.style.display = "none";
            link.classList.remove("highlight");
        }
    }
}

// --- Brand Directory Logic ---
var brandTabData = {
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
    var buttons = document.querySelectorAll("#brand-tabs .filter-btn");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }
    
    var activeTab = document.getElementById("tab-" + tabName);
    if (activeTab) {
        activeTab.classList.add("active");
    }
    
    var container = document.getElementById("brandLinksContainer");
    if (container) {
        var linksHTML = "";
        var items = brandTabData[tabName] || [];
        for (var j = 0; j < items.length; j++) {
            var item = items[j];
            linksHTML += "<a href=\"" + item.url + "\" target=\"_blank\" rel=\"noreferrer\" class=\"dock-link\"><span>" + item.name + "</span> <i data-lucide=\"arrow-right\" size=\"14\"></i></a>";
        }
        container.innerHTML = linksHTML;
        if (typeof window.lucide !== "undefined") {
            window.lucide.createIcons();
        }
    }
}
switchBrandTab("ibet");

// --- Global Search Modal Logic ---
function performGlobalSearch() {
    var searchInput = document.getElementById("globalSearchInput");
    var resultsContainer = document.getElementById("globalSearchResults");
    if (!searchInput || !resultsContainer) return;
    
    var query = searchInput.value.toLowerCase();
    if (query.length === 0) {
        resultsContainer.innerHTML = "<div style=\"font-size:0.8rem; color:var(--text-muted); text-align:center;\">Type to search...</div>";
        return;
    }

    var resultsHTML = "";
    var allSubLinks = document.querySelectorAll("a.sub-link");
    
    for (var k = 0; k < allSubLinks.length; k++) {
        var link = allSubLinks[k];
        if (link.innerText.toLowerCase().indexOf(query) !== -1) {
            resultsHTML += "<a href=\"" + link.href + "\" class=\"dock-link\" target=\"_blank\" rel=\"noreferrer\" onclick=\"closeModal('globalSearchModal')\"><span>" + link.innerText + "</span> <i data-lucide=\"external-link\" size=\"14\"></i></a>";
        }
    }

    var brandKeys = Object.keys(brandTabData);
    for (var b = 0; b < brandKeys.length; b++) {
        var brandArray = brandTabData[brandKeys[b]];
        for (var a = 0; a < brandArray.length; a++) {
            var bItem = brandArray[a];
            if (bItem.name.toLowerCase().indexOf(query) !== -1) {
                resultsHTML += "<a href=\"" + bItem.url + "\" class=\"dock-link\" target=\"_blank\" rel=\"noreferrer\" onclick=\"closeModal('globalSearchModal')\"><span>" + bItem.name + "</span> <i data-lucide=\"external-link\" size=\"14\"></i></a>";
            }
        }
    }

    if (resultsHTML === "") {
        resultsHTML = "<div style=\"font-size:0.8rem; color:var(--text-muted); text-align:center;\">No results found.</div>";
    }

    resultsContainer.innerHTML = resultsHTML;
    if (typeof window.lucide !== "undefined") {
        window.lucide.createIcons();
    }
}

// --- Task Management (LocalStorage) ---
function loadTasks() {
    var tasksString = localStorage.getItem("sbhub_tasks");
    var tasks = tasksString ? JSON.parse(tasksString) : [];
    var container = document.getElementById("taskContainer");
    
    var taskCountEl = document.getElementById("taskCount");
    if (taskCountEl) {
        taskCountEl.innerText = tasks.length;
    }
    
    var html = "";
    for (var i = 0; i < tasks.length; i++) {
        var t = tasks[i];
        html += "<div class=\"task-card\">\n                    <div style=\"display:flex; justify-content:space-between;\">\n                        <div class=\"task-icon\"><i data-lucide=\"clipboard-list\" size=\"16\"></i></div>\n                        <i data-lucide=\"x\" size=\"14\" style=\"color:var(--text-muted); cursor:pointer;\" onclick=\"deleteTask(" + i + ")\"></i>\n                    </div>\n                    <div>\n                        <div class=\"task-name\">" + t.title + "</div>\n                        <div class=\"task-time\">" + t.time + "</div>\n                    </div>\n                    <div class=\"task-corner-icon\"><i data-lucide=\"check\" size=\"12\"></i></div>\n                </div>";
    }
    
    html += "<div class=\"task-card dashed\" onclick=\"openModal('taskModal')\">+ Add a task</div>";
    
    if (container) {
        container.innerHTML = html;
        if (typeof window.lucide !== "undefined") {
            window.lucide.createIcons();
        }
    }
}

function saveTask(e) {
    e.preventDefault();
    var titleEl = document.getElementById("taskTitle");
    var timeEl = document.getElementById("taskTime");
    
    if (titleEl && timeEl) {
        var title = titleEl.value;
        var time = timeEl.value;
        var tasksString = localStorage.getItem("sbhub_tasks");
        var tasks = tasksString ? JSON.parse(tasksString) : [];
        
        tasks.push({ title: title, time: time });
        localStorage.setItem("sbhub_tasks", JSON.stringify(tasks));
        titleEl.value = "";
        timeEl.value = "";
        closeModal("taskModal");
        loadTasks();
    }
}

function deleteTask(index) {
    var tasksString = localStorage.getItem("sbhub_tasks");
    var tasks = tasksString ? JSON.parse(tasksString) : [];
    tasks.splice(index, 1);
    localStorage.setItem("sbhub_tasks", JSON.stringify(tasks));
    loadTasks();
}
loadTasks();

// --- Jira & Handover Management ---
function loadAlerts() {
    var alertsString = localStorage.getItem("sbhub_alerts");
    var alerts = alertsString ? JSON.parse(alertsString) : [];
    var container = document.getElementById("jiraHandoverContent");
    
    if (alerts.length === 0) {
        if (container) {
            container.innerHTML = "<div style=\"text-align:center; padding:2rem; color:var(--text-muted); font-size:0.8rem;\">No pending alerts.</div>";
        }
        return;
    }

    var html = "";
    for (var i = 0; i < alerts.length; i++) {
        var a = alerts[i];
        var isJira = a.type === "JIRA";
        var typeClass = isJira ? "jira" : "";
        var activeColor = isJira ? "#ef4444" : "#facc15";
        
        html += "<div class=\"alert-item " + typeClass + "\">\n                    <i data-lucide=\"x\" class=\"delete-alert\" size=\"12\" onclick=\"deleteAlert(" + i + ")\"></i>\n                    <div style=\"display:flex; justify-content:space-between; margin-bottom:4px; padding-right:12px;\">\n                        <span style=\"font-weight:700;\"><span class=\"alert-brand\">" + a.brand + "</span>" + a.type + "</span>\n                        <span style=\"font-size:0.65rem; color:" + activeColor + ";\">ACTIVE</span>\n                    </div>\n                    <div style=\"color:var(--text-main); font-weight:500;\">" + a.msg + "</div>\n                </div>";
    }
    
    if (container) {
        container.innerHTML = html;
        if (typeof window.lucide !== "undefined") {
            window.lucide.createIcons();
        }
    }
}

function saveAlert(e) {
    e.preventDefault();
    var typeEl = document.getElementById("alertType");
    var brandEl = document.getElementById("alertBrand");
    var msgEl = document.getElementById("alertMsg");
    
    if (typeEl && brandEl && msgEl) {
        var type = typeEl.value;
        var brand = brandEl.value;
        var msg = msgEl.value;
        var alertsString = localStorage.getItem("sbhub_alerts");
        var alerts = alertsString ? JSON.parse(alertsString) : [];
        
        alerts.push({ type: type, brand: brand, msg: msg });
        localStorage.setItem("sbhub_alerts", JSON.stringify(alerts));
        brandEl.value = "";
        msgEl.value = "";
        closeModal("alertModal");
        loadAlerts();
    }
}

function deleteAlert(index) {
    var alertsString = localStorage.getItem("sbhub_alerts");
    var alerts = alertsString ? JSON.parse(alertsString) : [];
    alerts.splice(index, 1);
    localStorage.setItem("sbhub_alerts", JSON.stringify(alerts));
    loadAlerts();
}
loadAlerts();

// --- Live Clocks & Weather ---
function updateClocks() {
    var now = new Date();
    
    var timeGmt8 = document.getElementById("live-time-gmt8");
    var dateGmt8 = document.getElementById("live-date-gmt8");
    if (timeGmt8 && dateGmt8) {
        timeGmt8.innerText = now.toLocaleTimeString("en-US", { timeZone: "Asia/Manila", hour12: false });
        dateGmt8.innerText = now.toLocaleDateString("en-US", { timeZone: "Asia/Manila", weekday: "short", month: "short", day: "numeric" });
    }
    
    var timeGmt2 = document.getElementById("live-time-gmt2");
    var dateGmt2 = document.getElementById("live-date-gmt2");
    if (timeGmt2 && dateGmt2) {
        timeGmt2.innerText = now.toLocaleTimeString("en-US", { timeZone: "Europe/Athens", hour12: false });
        dateGmt2.innerText = now.toLocaleDateString("en-US", { timeZone: "Europe/Athens", weekday: "short", month: "short", day: "numeric" });
    }
}
setInterval(updateClocks, 1000);
updateClocks();

var fbDb = null;
try { 
    if (typeof window.firebase !== "undefined") {
        window.firebase.initializeApp({
            databaseURL: "https://test-daily-task--sb-default-rtdb.firebaseio.com", 
            projectId: "test-daily-task--sb"
        }); 
        fbDb = window.firebase.database(); 
    }
} catch (error) {
    console.warn("Firebase init skipped.", error);
}

function fetchWeather() {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=14.5995&longitude=120.9842&current_weather=true&wind_speed_10m")
        .then(function(res) { return res.json(); })
        .then(function(data) {
            var temp = Math.round(data.current_weather.temperature);
            var wind = Math.round(data.current_weather.windspeed);
            
            var tempEl = document.getElementById("live-temp");
            var descEl = document.getElementById("live-weather-desc");
            
            if (tempEl && descEl) {
                tempEl.innerText = temp + "°C";
                descEl.innerText = "Wind: " + wind + " km/h | Manila Local";
            }

            if (fbDb) {
                fbDb.ref("system_status/weather").set({ 
                    temp: temp, 
                    wind: wind, 
                    lastUpdated: new Date().toISOString() 
                });
            }
        })
        .catch(function(error) {
            var tempEl = document.getElementById("live-temp");
            if (tempEl) {
                tempEl.innerText = "N/A";
            }
        });
}
fetchWeather();
setInterval(fetchWeather, 15 * 60 * 1000);

// --- Theme Switcher ---
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "blue") {
        document.documentElement.style.setProperty("--body-bg", "#bae6fd");
        document.documentElement.style.setProperty("--main-bg", "#e0f2fe");
    } else {
        document.documentElement.style.removeProperty("--body-bg");
        document.documentElement.style.removeProperty("--main-bg");
    }
    localStorage.setItem("sbhub_theme_pref", theme);
    closeModal("themeModal");
}
var savedTheme = localStorage.getItem("sbhub_theme_pref");
if (savedTheme) {
    applyTheme(savedTheme);
}

// --- Top Picks ---
var cachedPicks = [];
var currentLeague = "eng.1";

function fetchTopPicks() {
    var leagues = ["eng.1", "esp.1", "ger.1", "ita.1", "uefa.champions"];
    var dateStr = new Date().toLocaleString("en-CA", { timeZone: "Asia/Manila" }).split(",")[0];
    var dateQ = dateStr.replace(/-/g, "");
    
    var allMatches = [];
    var promises = [];
    
    for (var i = 0; i < leagues.length; i++) {
        (function(l) {
            var p = fetch("https://site.api.espn.com/apis/site/v2/sports/soccer/" + l + "/scoreboard?dates=" + dateQ)
                .then(function(res) { return res.json(); })
                .then(function(data) {
                    if (data && data.events) {
                        for (var j = 0; j < data.events.length; j++) {
                            var e = data.events[j];
                            if (e.status.type.state !== "pre") continue;
                            
                            var comp = e.competitions[0];
                            var home = null;
                            var away = null;
                            
                            for (var c = 0; c < comp.competitors.length; c++) {
                                if (comp.competitors[c].homeAway === "home") home = comp.competitors[c].team;
                                if (comp.competitors[c].homeAway === "away") away = comp.competitors[c].team;
                            }
                            
                            if (home && away) {
                                allMatches.push({
                                    league: l,
                                    homeName: home.shortDisplayName || home.name,
                                    awayName: away.shortDisplayName || away.name,
                                    homeLogo: home.logo, 
                                    awayLogo: away.logo,
                                    time: new Date(e.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
                                    badge: (allMatches.length % 2 === 0) ? "TOP PICK" : "HOT"
                                });
                            }
                        }
                    }
                })
                .catch(function(e) {
                    // Ignore errors silently for missing API data
                });
            promises.push(p);
        })(leagues[i]);
    }
    
    Promise.all(promises).then(function() {
        cachedPicks = allMatches;
        renderPicks();
    }).catch(function(e) {
        renderPicks();
    });
}

function filterPicks(league, btn) {
    currentLeague = league;
    var filterBtns = document.querySelectorAll(".filter-btn");
    for (var i = 0; i < filterBtns.length; i++) {
        filterBtns[i].classList.remove("active");
    }
    if (btn) {
        btn.classList.add("active");
    }
    renderPicks();
}

function renderPicks() {
    var container = document.getElementById("topPicksContainer");
    if (!container) return;
    
    var matches = [];
    for (var i = 0; i < cachedPicks.length; i++) {
        if (cachedPicks[i].league === currentLeague) {
            matches.push(cachedPicks[i]);
        }
        if (matches.length >= 5) break;
    }
    
    if (matches.length === 0) {
        container.innerHTML = "<div style=\"grid-column: 1/-1; display:flex; align-items:center; justify-content:center; height:100%; min-height:100px; color: var(--text-muted); font-size: 0.85rem; font-weight:600;\">No scheduled matches available for this league today.</div>";
        return;
    }

    var html = "";
    for (var j = 0; j < matches.length; j++) {
        var m = matches[j];
        var isTop = m.badge === "TOP PICK";
        var topClass = isTop ? "top-pick" : "";
        var blueClass = isTop ? "blue" : "";
        
        html += "<div class=\"match-card " + topClass + "\">\n                <div class=\"flags-row\">\n                    <img src=\"" + m.homeLogo + "\" onerror=\"this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'\" alt=\"Home Team\" />\n                    <span style=\"font-size:0.7rem; color:var(--text-muted); font-weight:800;\">VS</span>\n                    <img src=\"" + m.awayLogo + "\" onerror=\"this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'\" alt=\"Away Team\" />\n                </div>\n                <div class=\"match-name\">" + m.homeName + " vs " + m.awayName + "</div>\n                <div class=\"match-badge " + blueClass + "\">" + m.badge + "</div>\n                <div style=\"font-size: 0.7rem; color: var(--text-muted); margin-top: 6px;\"><i data-lucide=\"clock\" size=\"10\"></i> " + m.time + "</div>\n            </div>";
    }
    container.innerHTML = html;
    if (typeof window.lucide !== "undefined") {
        window.lucide.createIcons();
    }
}
fetchTopPicks();

// --- Notifications (Top Games Feed) ---
function openNotifications() {
    var list = document.getElementById("notificationsList");
    openModal("notificationsModal");
    
    if (cachedPicks.length === 0) {
        if (list) {
            list.innerHTML = "<div style=\"text-align:center; padding: 2rem; color: var(--text-muted); font-size: 0.85rem; font-weight:600;\">No top games available at the moment.</div>";
        }
        return;
    }

    var html = "";
    for (var i = 0; i < cachedPicks.length; i++) {
        var m = cachedPicks[i];
        var cleanLeague = m.league.toUpperCase().replace(".1", "");
        html += "<div style=\"background: rgba(150,150,150,0.05); border: 1px solid var(--glass-border); border-radius: 12px; padding: 0.8rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;\">\n                <div style=\"display:flex; align-items:center; gap: 10px;\">\n                    <img src=\"" + m.homeLogo + "\" style=\"width:24px;height:24px;border-radius:50%; background:white;\" onerror=\"this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'\" alt=\"Home Team\" />\n                    <span style=\"font-weight:700; font-size:0.8rem; color:var(--text-main);\">" + m.homeName + " vs " + m.awayName + "</span>\n                    <img src=\"" + m.awayLogo + "\" style=\"width:24px;height:24px;border-radius:50%; background:white;\" onerror=\"this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'\" alt=\"Away Team\" />\n                </div>\n                <div style=\"text-align:right;\">\n                    <div style=\"font-size:0.6rem; font-weight:800; background:var(--accent); color:white; padding:2px 6px; border-radius:4px; display:inline-block;\">" + cleanLeague + "</div>\n                    <div style=\"font-size:0.65rem; color:var(--text-muted); margin-top:4px;\"><i data-lucide=\"clock\" size=\"10\"></i> " + m.time + "</div>\n                </div>\n            </div>";
    }
    
    if (list) {
        list.innerHTML = html;
        if (typeof window.lucide !== "undefined") {
            window.lucide.createIcons();
        }
    }
}

// --- Top Games Navigation ---
var dayOffset = 0;
function navMatchDay(dir) {
    dayOffset += dir;
    if (dayOffset < 0) dayOffset = 6; 
    if (dayOffset > 6) dayOffset = 0;
    renderGamesList();
}

function renderGamesList() {
    var container = document.getElementById("gamesContainer");
    var display = document.getElementById("matchDayDisplay");
    
    var target = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }));
    target.setDate(target.getDate() + dayOffset);
    
    if (display) {
        var label = dayOffset === 0 ? "TODAY" : "DAY " + (dayOffset + 1);
        var formattedDate = target.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        display.innerText = label + " (" + formattedDate + ")";
    }

    var games = cachedPicks.slice(0, 5); 
    if (games.length === 0) {
         if (container) {
             container.innerHTML = "<div style=\"text-align:center; padding: 2rem; color: var(--text-muted); font-size: 0.8rem;\">No fixtures available for this date.</div>";
         }
         return;
    }

    var html = "";
    for (var i = 0; i < games.length; i++) {
        var g = games[i];
        html += "<div class=\"game-row\">\n                <img src=\"" + g.homeLogo + "\" style=\"width:24px;height:24px;border-radius:50%; background:white;\" onerror=\"this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'\" alt=\"Home Team\" />\n                <img src=\"" + g.awayLogo + "\" style=\"width:24px;height:24px;border-radius:50%;margin-left:-8px; background:white;\" onerror=\"this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'\" alt=\"Away Team\" />\n                <div style=\"flex-grow:1; margin-left:8px;\">\n                    <div class=\"game-title\">" + g.homeName + " <span style=\"color:var(--text-muted);font-weight:400;font-size:0.7rem;\">vs</span> " + g.awayName + "</div>\n                    <div class=\"game-sub\">" + g.time + "</div>\n                </div>\n            </div>";
    }
    
    if (container) {
        container.innerHTML = html;
    }
}
setTimeout(renderGamesList, 1500);

// --- Firebase Live Duties ---
function loadLiveDuties() {
    var h = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })).getHours();
    var slot = { id: "slot_21_0", label: "21:00 - 00:00" };
    if (h >= 6 && h < 9) { slot = { id: "slot_6_9", label: "06:00 - 09:00" }; }
    else if (h >= 9 && h < 12) { slot = { id: "slot_9_12", label: "09:00 - 12:00" }; }
    else if (h >= 12 && h < 15) { slot = { id: "slot_12_15", label: "12:00 - 15:00" }; }
    else if (h >= 15 && h < 18) { slot = { id: "slot_15_18", label: "15:00 - 18:00" }; }
    else if (h >= 18 && h < 21) { slot = { id: "slot_18_21", label: "18:00 - 21:00" }; }
    
    var badgeEl = document.getElementById("slotBadge");
    if (badgeEl) {
        badgeEl.innerText = slot.label;
    }
    
    var container = document.getElementById("liveDutyContent");

    if (!fbDb) { 
        if (container) {
            container.innerHTML = "<div style=\"font-size:0.8rem; color:var(--text-muted); text-align:center;\">Database offline</div>"; 
        }
        return; 
    }

    fbDb.ref("roster_data").on("value", function(snapshot) {
        var data = snapshot.val();
        if (!data) return;
        
        var todayIso = new Date().toLocaleString("en-CA", { timeZone: "Asia/Manila" }).split(",")[0];
        
        var dayData = data[todayIso];
        if (!dayData) {
            var keys = Object.keys(data);
            dayData = data[keys[keys.length - 1]];
        }
        
        if (!dayData || dayData === "archives") return;

        var html = ""; 
        var activeCount = 0;
        var members = [
            { id: "ann", n: "ANN" }, 
            { id: "dave", n: "DAVE" }, 
            { id: "ken", n: "KEN" }, 
            { id: "kriztel", n: "KRIZTEL" }
        ];
        
        for (var i = 0; i < members.length; i++) {
            var m = members[i];
            var grid = (dayData.grid && dayData.grid[m.id]) ? dayData.grid[m.id] : null;
            var shiftId = "shift-7-16";
            if (grid && grid.shift) {
                shiftId = grid.shift;
            }
            
            var isRest = shiftId.indexOf("rd") !== -1 || shiftId.indexOf("vl") !== -1;
            
            if (!isRest) {
                activeCount++;
            }
            
            var tasks = (grid && grid.slots) ? (grid.slots[slot.id] || []) : [];
            var cleanShift = shiftId.replace("shift-", "");
            var badgeText = isRest ? "OFF" : cleanShift;
            
            html += "<div class=\"duty-card\">\n                    <div class=\"duty-top\">\n                        <span>" + m.n + "</span>\n                        <span class=\"duty-badge\">" + badgeText + "</span>\n                    </div>";
            
            if (isRest) {
                html += "<div class=\"duty-text\">Offline / Rest Day</div>";
            } else if (tasks.length === 0) {
                html += "<div class=\"duty-text\">No specific tasks.</div>";
            } else {
                for (var j = 0; j < tasks.length; j++) {
                    var t = tasks[j];
                    var text = typeof t === "string" ? t : t.text;
                    var done = typeof t === "object" ? t.done : false;
                    var iconColor = done ? "#10b981" : "var(--text-muted)";
                    var iconType = done ? "check-circle" : "clock";
                    var textStyle = done ? "text-decoration:line-through;opacity:0.6" : "";
                    
                    html += "<div class=\"duty-text\"><i data-lucide=\"" + iconType + "\" size=\"12\" style=\"color:" + iconColor + "\"></i> <span style=\"" + textStyle + "\">" + text + "</span></div>";
                }
            }
            html += "</div>";
        }
        
        if (container) {
            container.innerHTML = html;
        }
        
        var countEl = document.getElementById("activeTraderCount");
        if (countEl) {
            countEl.innerText = activeCount;
        }
        
        if (typeof window.lucide !== "undefined") {
            window.lucide.createIcons();
        }
    });
}
loadLiveDuties();
