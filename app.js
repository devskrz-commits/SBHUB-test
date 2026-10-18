/* eslint-disable */
/* jshint ignore:start */
"use strict";

if (typeof window.lucide !== "undefined") {
    window.lucide.createIcons();
}

var DEFAULT_USER = "@sportsbook";
var DEFAULT_PASS = "sb2026";

function handleLogin(e) {
    e.preventDefault();
    var userEl = document.getElementById("usernameInput");
    var passEl = document.getElementById("passwordInput");
    var rememberEl = document.getElementById("rememberMe");
    
    if (!userEl || !passEl) return;
    
    if (userEl.value.trim() === DEFAULT_USER && passEl.value === DEFAULT_PASS) {
        if (rememberEl && rememberEl.checked) {
            localStorage.setItem("sbhub_auth", "true");
        } else {
            sessionStorage.setItem("sbhub_auth", "true");
        }
        document.getElementById("authOverlay").classList.add("unlocked");
        document.getElementById("dashboardWrapper").classList.add("unlocked");
        document.getElementById("loginErrorMsg").innerText = "";
    } else {
        document.getElementById("loginErrorMsg").innerText = "Invalid credentials";
        var card = document.querySelector(".login-card");
        if (card) {
            card.classList.add("shake");
            setTimeout(function() { card.classList.remove("shake"); }, 400);
        }
    }
}

function handleLogout() {
    localStorage.removeItem("sbhub_auth");
    sessionStorage.removeItem("sbhub_auth");
    var authOverlay = document.getElementById("authOverlay");
    var dashboardWrapper = document.getElementById("dashboardWrapper");
    if (authOverlay) authOverlay.classList.remove("unlocked");
    if (dashboardWrapper) dashboardWrapper.classList.remove("unlocked");
}

if (localStorage.getItem("sbhub_auth") === "true" || sessionStorage.getItem("sbhub_auth") === "true") {
    var authOverlay = document.getElementById("authOverlay");
    var dashboardWrapper = document.getElementById("dashboardWrapper");
    if (authOverlay) authOverlay.classList.add("unlocked");
    if (dashboardWrapper) dashboardWrapper.classList.add("unlocked");
}

function toggleMenu(menuId) {
    var menu = document.getElementById(menuId);
    if (menu) {
        menu.classList.toggle("open");
    }
}

function openModal(id) { 
    var modal = document.getElementById(id);
    if (modal) {
        modal.classList.add("active"); 
        if (id === 'expandPicksModal') renderExpandedPicks();
        if (id === 'expandMatchdayModal') renderExpandedMatchday();
    }
}

function closeModal(id) { 
    var modal = document.getElementById(id);
    if (modal) modal.classList.remove("active"); 
}

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
    for (var i = 0; i < buttons.length; i++) buttons[i].classList.remove("active");
    var activeTab = document.getElementById("tab-" + tabName);
    if (activeTab) activeTab.classList.add("active");
    
    var container = document.getElementById("brandLinksContainer");
    if (container) {
        var linksHTML = "";
        var items = brandTabData[tabName] || [];
        for (var j = 0; j < items.length; j++) {
            var item = items[j];
            linksHTML += "<a href=\"" + item.url + "\" target=\"_blank\" rel=\"noreferrer\" class=\"dock-link\"><span>" + item.name + "</span> <i data-lucide=\"arrow-right\" size=\"14\"></i></a>";
        }
        container.innerHTML = linksHTML;
        if (typeof window.lucide !== "undefined") window.lucide.createIcons();
    }
}
switchBrandTab("ibet");

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
    resultsContainer.innerHTML = resultsHTML || "<div style=\"font-size:0.8rem; color:var(--text-muted); text-align:center;\">No results found.</div>";
    if (typeof window.lucide !== "undefined") window.lucide.createIcons();
}

function loadTasks() {
    var tasksString = localStorage.getItem("sbhub_tasks");
    var tasks = tasksString ? JSON.parse(tasksString) : [];
    var container = document.getElementById("taskContainer");
    var taskCountEl = document.getElementById("taskCount");
    if (taskCountEl) taskCountEl.innerText = tasks.length;
    
    var html = "";
    for (var i = 0; i < tasks.length; i++) {
        var t = tasks[i];
        html += "<div class=\"task-card\">\n<div style=\"display:flex; justify-content:space-between;\">\n<div class=\"task-icon\"><i data-lucide=\"clipboard-list\" size=\"14\"></i></div>\n<i data-lucide=\"x\" size=\"12\" style=\"color:var(--text-muted); cursor:pointer;\" onclick=\"deleteTask(" + i + ")\"></i>\n</div>\n<div>\n<div class=\"task-name\">" + t.title + "</div>\n<div class=\"task-time\">" + t.time + "</div>\n</div>\n<div class=\"task-corner-icon\"><i data-lucide=\"check\" size=\"10\"></i></div>\n</div>";
    }
    html += "<div class=\"task-card dashed\" onclick=\"openModal('taskModal')\">+ Add task</div>";
    if (container) {
        container.innerHTML = html;
        if (typeof window.lucide !== "undefined") window.lucide.createIcons();
    }
}

function saveTask(e) {
    e.preventDefault();
    var titleEl = document.getElementById("taskTitle");
    var timeEl = document.getElementById("taskTime");
    if (titleEl && timeEl) {
        var tasks = JSON.parse(localStorage.getItem("sbhub_tasks") || "[]");
        tasks.push({ title: titleEl.value, time: timeEl.value });
        localStorage.setItem("sbhub_tasks", JSON.stringify(tasks));
        titleEl.value = ""; timeEl.value = "";
        closeModal("taskModal");
        loadTasks();
    }
}

function deleteTask(index) {
    var tasks = JSON.parse(localStorage.getItem("sbhub_tasks") || "[]");
    tasks.splice(index, 1);
    localStorage.setItem("sbhub_tasks", JSON.stringify(tasks));
    loadTasks();
}
loadTasks();

function loadAlerts() {
    var alerts = JSON.parse(localStorage.getItem("sbhub_alerts") || "[]");
    var container = document.getElementById("jiraHandoverContent");
    if (!container) return;
    
    if (alerts.length === 0) {
        container.innerHTML = "<div style=\"text-align:center; padding:2rem; color:var(--text-muted); font-size:0.8rem;\">No pending alerts.</div>";
        return;
    }

    var html = "";
    for (var i = 0; i < alerts.length; i++) {
        var a = alerts[i];
        var isJira = a.type === "JIRA";
        html += "<div class=\"alert-item " + (isJira ? "jira" : "") + "\">\n<i data-lucide=\"x\" class=\"delete-alert\" size=\"12\" onclick=\"deleteAlert(" + i + ")\"></i>\n<div style=\"display:flex; justify-content:space-between; margin-bottom:4px; padding-right:12px;\">\n<span style=\"font-weight:700;\"><span class=\"alert-brand\">" + a.brand + "</span>" + a.type + "</span>\n<span style=\"font-size:0.65rem; color:#a1a1aa;\">ACTIVE</span>\n</div>\n<div style=\"color:var(--text-main); font-weight:500;\">" + a.msg + "</div>\n</div>";
    }
    container.innerHTML = html;
    if (typeof window.lucide !== "undefined") window.lucide.createIcons();
}

function saveAlert(e) {
    e.preventDefault();
    var typeEl = document.getElementById("alertType");
    var brandEl = document.getElementById("alertBrand");
    var msgEl = document.getElementById("alertMsg");
    if (typeEl && brandEl && msgEl) {
        var alerts = JSON.parse(localStorage.getItem("sbhub_alerts") || "[]");
        alerts.push({ type: typeEl.value, brand: brandEl.value, msg: msgEl.value });
        localStorage.setItem("sbhub_alerts", JSON.stringify(alerts));
        brandEl.value = ""; msgEl.value = "";
        closeModal("alertModal");
        loadAlerts();
    }
}

function deleteAlert(index) {
    var alerts = JSON.parse(localStorage.getItem("sbhub_alerts") || "[]");
    alerts.splice(index, 1);
    localStorage.setItem("sbhub_alerts", JSON.stringify(alerts));
    loadAlerts();
}
loadAlerts();

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
} catch (e) {}

function fetchWeather() {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=14.5995&longitude=120.9842&current_weather=true")
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
        }).catch(function() {});
}
fetchWeather();

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sbhub_theme_pref", theme);
    closeModal("themeModal");
}
var savedTheme = localStorage.getItem("sbhub_theme_pref");
if (savedTheme) applyTheme(savedTheme);

var cachedPicks = [];
var currentLeague = "eng.1";
var matchDayOffset = 0;
var selectedTraderFilter = "ALL";

function filterTraderDuty(traderId) {
    selectedTraderFilter = traderId;
    loadLiveDuties();
}

function fetchTopPicks() {
    var leagues = ["eng.1", "esp.1", "ger.1", "ita.1", "uefa.champions"];
    var allMatches = [];
    var promises = [];
    
    for (var day = 0; day < 7; day++) {
        var d = new Date();
        d.setDate(d.getDate() + day);
        var dateQ = d.getFullYear() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2);
        
        for (var i = 0; i < leagues.length; i++) {
            (function(l, dq, formattedDate) {
                var p = fetch("https://site.api.espn.com/apis/site/v2/sports/soccer/" + l + "/scoreboard?dates=" + dq)
                    .then(function(res) { return res.json(); })
                    .then(function(data) {
                        if (data && data.events) {
                            for (var j = 0; j < data.events.length; j++) {
                                var e = data.events[j];
                                var comp = e.competitions[0];
                                var home = null, away = null;
                                for (var c = 0; c < comp.competitors.length; c++) {
                                    if (comp.competitors[c].homeAway === "home") home = comp.competitors[c].team;
                                    if (comp.competitors[c].homeAway === "away") away = comp.competitors[c].team;
                                }
                                if (home && away) {
                                    allMatches.push({
                                        dateQuery: dq,
                                        dateLabel: formattedDate,
                                        league: l,
                                        homeName: home.shortDisplayName || home.name,
                                        awayName: away.shortDisplayName || away.name,
                                        homeLogo: home.logo || 'https://a.espncdn.com/i/teamlogos/soccer/500/default.png', 
                                        awayLogo: away.logo || 'https://a.espncdn.com/i/teamlogos/soccer/500/default.png',
                                        time: new Date(e.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
                                        badge: l.toUpperCase().replace(".1", "")
                                    });
                                }
                            }
                        }
                    }).catch(function() {});
                promises.push(p);
            })(leagues[i], dateQ, d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
        }
    }
    
    Promise.all(promises).then(function() {
        cachedPicks = allMatches;
        renderPicks();
        renderGamesList();
    });
}

function filterPicks(league, btn) {
    currentLeague = league;
    var filterBtns = document.querySelectorAll(".filter-btn");
    for (var i = 0; i < filterBtns.length; i++) filterBtns[i].classList.remove("active");
    if (btn) btn.classList.add("active");
    renderPicks();
}

function renderPicks() {
    var container = document.getElementById("topPicksContainer");
    if (!container) return;
    
    var matches = cachedPicks.filter(function(m) { return m.league === currentLeague; }).slice(0, 6);
    if (matches.length === 0) {
        container.innerHTML = "<div style=\"grid-column: 1/-1; display:flex; align-items:center; justify-content:center; padding:1.5rem; color: var(--text-muted); font-size: 0.8rem;\">No fixtures found for this category.</div>";
        return;
    }

    var html = "";
    for (var j = 0; j < matches.length; j++) {
        var m = matches[j];
        html += "<div class=\"match-card\">\n<div class=\"flags-row\">\n<img src=\"" + m.homeLogo + "\" alt=\"Home\" />\n<span style=\"font-size:0.65rem; color:var(--text-muted); font-weight:800;\">VS</span>\n<img src=\"" + m.awayLogo + "\" alt=\"Away\" />\n</div>\n<div class=\"match-name\">" + m.homeName + " vs " + m.awayName + "</div>\n<div style=\"font-size:0.62rem; font-weight:700; color:var(--text-muted); margin-top:2px;\">" + m.dateLabel + " - " + m.time + "</div>\n</div>";
    }
    container.innerHTML = html;
    if (typeof window.lucide !== "undefined") window.lucide.createIcons();
}

function renderExpandedPicks() {
    var grid = document.getElementById("expandedPicksGrid");
    if (!grid) return;
    
    var matches = cachedPicks.filter(function(m) { return m.league === currentLeague; });
    if (matches.length === 0) {
        grid.innerHTML = "<div style=\"grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-muted);\">No games available.</div>";
        return;
    }

    var html = "";
    for (var i = 0; i < matches.length; i++) {
        var m = matches[i];
        var cleanLeague = m.league.toUpperCase().replace(".1", "");
        html += "<div class=\"match-card\" style=\"padding:1rem;\">\n<div class=\"match-badge\">" + cleanLeague + "</div>\n<div class=\"flags-row\" style=\"margin-top:6px;\">\n<img src=\"" + m.homeLogo + "\" alt=\"Home\" />\n<span style=\"font-size:0.65rem; color:var(--text-muted); font-weight:800;\">VS</span>\n<img src=\"" + m.awayLogo + "\" alt=\"Away\" />\n</div>\n<div class=\"match-name\" style=\"font-size:0.8rem;\">" + m.homeName + " vs " + m.awayName + "</div>\n<div style=\"font-size:0.7rem; font-weight:700; color:var(--text-muted); margin-top:4px;\">" + m.dateLabel + " @ " + m.time + "</div>\n</div>";
    }
    grid.innerHTML = html;
    if (typeof window.lucide !== "undefined") window.lucide.createIcons();
}

function renderExpandedMatchday() {
    var grid = document.getElementById("expandedMatchdayGrid");
    if (!grid) return;
    
    var targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + matchDayOffset);
    var targetQuery = targetDate.getFullYear() + ("0" + (targetDate.getMonth() + 1)).slice(-2) + ("0" + targetDate.getDate()).slice(-2);
    
    var dayGames = cachedPicks.filter(function(g) { return g.dateQuery === targetQuery; });
    if (dayGames.length === 0) {
        grid.innerHTML = "<div style=\"grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-muted);\">No fixtures available for this date.</div>";
        return;
    }

    var html = "";
    for (var i = 0; i < dayGames.length; i++) {
        var g = dayGames[i];
        var cleanLeague = g.league.toUpperCase().replace(".1", "");
        html += "<div class=\"match-card\" style=\"padding:1rem;\">\n<div class=\"match-badge\">" + cleanLeague + "</div>\n<div class=\"flags-row\" style=\"margin-top:6px;\">\n<img src=\"" + g.homeLogo + "\" alt=\"Home\" />\n<span style=\"font-size:0.65rem; color:var(--text-muted); font-weight:800;\">VS</span>\n<img src=\"" + g.awayLogo + "\" alt=\"Away\" />\n</div>\n<div class=\"match-name\" style=\"font-size:0.8rem;\">" + g.homeName + " vs " + g.awayName + "</div>\n<div style=\"font-size:0.7rem; font-weight:700; color:var(--text-muted); margin-top:4px;\">" + g.dateLabel + " @ " + g.time + "</div>\n</div>";
    }
    grid.innerHTML = html;
    if (typeof window.lucide !== "undefined") window.lucide.createIcons();
}

fetchTopPicks();

function openNotifications() {
    var list = document.getElementById("notificationsList");
    openModal("notificationsModal");
    if (!list) return;
    
    var html = "";
    for (var i = 0; i < Math.min(cachedPicks.length, 10); i++) {
        var m = cachedPicks[i];
        html += "<div style=\"background:var(--inner-card-bg); border:1px solid var(--glass-border); border-radius: 12px; padding: 0.8rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;\">\n<div style=\"display:flex; align-items:center; gap: 10px;\">\n<img src=\"" + m.homeLogo + "\" style=\"width:24px;height:24px;border-radius:50%; background:white;\" alt=\"Home\" />\n<span style=\"font-weight:700; font-size:0.8rem; color:var(--text-main);\">" + m.homeName + " vs " + m.awayName + "</span>\n<img src=\"" + m.awayLogo + "\" style=\"width:24px;height:24px;border-radius:50%; background:white;\" alt=\"Away\" />\n</div>\n<div style=\"text-align:right;\">\n<div class=\"match-badge\">" + m.league.toUpperCase().replace(".1", "") + "</div>\n<div style=\"font-size:0.65rem; color:var(--text-muted); margin-top:4px;\">" + m.dateLabel + " - " + m.time + "</div>\n</div>\n</div>";
    }
    list.innerHTML = html;
    if (typeof window.lucide !== "undefined") window.lucide.createIcons();
}

function navMatchDay(dir) {
    matchDayOffset += dir;
    if (matchDayOffset < 0) matchDayOffset = 0;
    if (matchDayOffset > 6) matchDayOffset = 6;
    renderGamesList();
}

function renderGamesList() {
    var container = document.getElementById("gamesContainer");
    var display = document.getElementById("matchDayDisplay");
    
    var targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + matchDayOffset);
    var targetQuery = targetDate.getFullYear() + ("0" + (targetDate.getMonth() + 1)).slice(-2) + ("0" + targetDate.getDate()).slice(-2);
    
    if (display) {
        var label = matchDayOffset === 0 ? "TODAY" : "DAY +" + matchDayOffset;
        display.innerText = label + " (" + targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ")";
    }

    var dayGames = cachedPicks.filter(function(g) { return g.dateQuery === targetQuery; }).slice(0, 5);
    if (dayGames.length === 0) {
        if (container) container.innerHTML = "<div style=\"text-align:center; padding: 1.5rem; color: var(--text-muted); font-size: 0.8rem;\">No fixtures available for this date.</div>";
        return;
    }

    var html = "";
    for (var i = 0; i < dayGames.length; i++) {
        var g = dayGames[i];
        html += "<div class=\"game-row\">\n<img src=\"" + g.homeLogo + "\" style=\"width:20px;height:20px;border-radius:50%; background:white;\" alt=\"Home\" />\n<img src=\"" + g.awayLogo + "\" style=\"width:20px;height:20px;border-radius:50%;margin-left:-6px; background:white;\" alt=\"Away\" />\n<div style=\"flex-grow:1; margin-left:8px;\">\n<div class=\"game-title\">" + g.homeName + " <span style=\"color:var(--text-muted);font-weight:400;font-size:0.65rem;\">vs</span> " + g.awayName + "</div>\n<div class=\"game-sub\">" + g.time + "</div>\n</div>\n</div>";
    }
    if (container) container.innerHTML = html;
}

function loadLiveDuties() {
    var h = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })).getHours();
    var slot = { id: "slot_21_0", label: "21:00 - 00:00" };
    if (h >= 6 && h < 9) slot = { id: "slot_6_9", label: "06:00 - 09:00" };
    else if (h >= 9 && h < 12) slot = { id: "slot_9_12", label: "09:00 - 12:00" };
    else if (h >= 12 && h < 15) slot = { id: "slot_12_15", label: "12:00 - 15:00" };
    else if (h >= 15 && h < 18) slot = { id: "slot_15_18", label: "15:00 - 18:00" };
    else if (h >= 18 && h < 21) slot = { id: "slot_18_21", label: "18:00 - 21:00" };
    
    var badgeEl = document.getElementById("slotBadge");
    if (badgeEl) badgeEl.innerText = "Slot: " + slot.label;
    
    var container = document.getElementById("liveDutyContent");
    if (!container) return;

    if (!fbDb) { 
        container.innerHTML = "<div style=\"font-size:0.8rem; color:var(--text-muted); text-align:center;\">Database offline</div>"; 
        return; 
    }

    fbDb.ref("roster_data").on("value", function(snapshot) {
        var data = snapshot.val();
        if (!data) return;
        
        var todayIso = new Date().toLocaleString("en-CA", { timeZone: "Asia/Manila" }).split(",")[0];
        var dayData = data[todayIso] || data[Object.keys(data)[Object.keys(data).length - 1]];
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
            if (selectedTraderFilter !== "ALL" && selectedTraderFilter !== m.id) continue;

            var grid = (dayData.grid && dayData.grid[m.id]) ? dayData.grid[m.id] : null;
            var shiftId = (grid && grid.shift) ? grid.shift : "shift-7-16";
            var isRest = shiftId.indexOf("rd") !== -1 || shiftId.indexOf("vl") !== -1;
            if (!isRest) activeCount++;
            
            var tasks = (grid && grid.slots) ? (grid.slots[slot.id] || []) : [];
            html += "<div class=\"duty-card\">\n<div class=\"duty-top\">\n<span>" + m.n + "</span>\n<span class=\"duty-badge\">" + (isRest ? "OFF" : shiftId.replace("shift-", "")) + "</span>\n</div>";
            
            if (isRest) {
                html += "<div class=\"duty-text\">Offline / Rest Day</div>";
            } else if (tasks.length === 0) {
                html += "<div class=\"duty-text\">No specific tasks.</div>";
            } else {
                for (var j = 0; j < tasks.length; j++) {
                    var t = tasks[j];
                    var text = typeof t === "string" ? t : t.text;
                    var done = typeof t === "object" ? t.done : false;
                    html += "<div class=\"duty-text\"><i data-lucide=\"" + (done ? "check-circle" : "clock") + "\" size=\"12\" style=\"color:" + (done ? "#71717a" : "var(--text-muted)") + "\"></i> <span>" + text + "</span></div>";
                }
            }
            html += "</div>";
        }
        
        container.innerHTML = html;
        var countEl = document.getElementById("activeTraderCount");
        if (countEl) countEl.innerText = activeCount;
        if (typeof window.lucide !== "undefined") window.lucide.createIcons();
    });
}
loadLiveDuties();
