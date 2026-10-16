lucide.createIcons();

// --- UI Interactions ---
function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    if(menu) menu.classList.toggle('open');
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// --- Sidebar Search ---
function filterSidebar() {
    const query = document.getElementById('sidebarSearchInput').value.toLowerCase();
    const links = document.querySelectorAll('.sub-link');
    
    links.forEach(link => {
        const text = link.innerText.toLowerCase();
        const parentMenu = link.closest('.sub-menu');
        
        if (text.includes(query)) {
            link.style.display = 'block';
            if (query.length > 0) {
                parentMenu.classList.add('open');
                link.classList.add('highlight');
            } else {
                link.classList.remove('highlight');
            }
        } else {
            link.style.display = 'none';
            link.classList.remove('highlight');
        }
    });
}

// --- Brand Directory Logic ---
const brandTabData = {
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
    document.querySelectorAll('#brand-tabs .filter-btn').forEach(b => b.classList.remove('active'));
    const activeTab = document.getElementById('tab-' + tabName);
    if(activeTab) activeTab.classList.add('active');
    
    const container = document.getElementById('brandLinksContainer');
    container.innerHTML = '';
    const items = brandTabData[tabName] || [];
    items.forEach(item => {
        container.innerHTML += `<a href="${item.url}" target="_blank" class="dock-link"><span>${item.name}</span> <i data-lucide="arrow-right" size="14"></i></a>`;
    });
    lucide.createIcons();
}
switchBrandTab('ibet');

// --- Global Search Modal Logic ---
function performGlobalSearch() {
    const query = document.getElementById('globalSearchInput').value.toLowerCase();
    const resultsContainer = document.getElementById('globalSearchResults');
    
    if(query.length === 0) {
        resultsContainer.innerHTML = '<div style="font-size:0.8rem; color:var(--text-muted); text-align:center;">Type to search...</div>';
        return;
    }

    let resultsHTML = '';
    
    document.querySelectorAll('a.sub-link').forEach(link => {
        if(link.innerText.toLowerCase().includes(query)) {
            resultsHTML += `<a href="${link.href}" class="dock-link" target="_blank" onclick="closeModal('globalSearchModal')"><span>${link.innerText}</span> <i data-lucide="external-link" size="14"></i></a>`;
        }
    });

    Object.values(brandTabData).flat().forEach(item => {
        if(item.name.toLowerCase().includes(query)) {
            resultsHTML += `<a href="${item.url}" class="dock-link" target="_blank" onclick="closeModal('globalSearchModal')"><span>${item.name}</span> <i data-lucide="external-link" size="14"></i></a>`;
        }
    });

    if(resultsHTML === '') {
        resultsHTML = '<div style="font-size:0.8rem; color:var(--text-muted); text-align:center;">No results found.</div>';
    }

    resultsContainer.innerHTML = resultsHTML;
    lucide.createIcons();
}

// --- Task Management (LocalStorage) ---
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('sbhub_tasks') || '[]');
    const container = document.getElementById('taskContainer');
    document.getElementById('taskCount').innerText = tasks.length;
    
    let html = '';
    tasks.forEach((t, index) => {
        html += `
            <div class="task-card">
                <div style="display:flex; justify-content:space-between;">
                    <div class="task-icon"><i data-lucide="clipboard-list" size="16"></i></div>
                    <i data-lucide="x" size="14" style="color:var(--text-muted); cursor:pointer;" onclick="deleteTask(${index})"></i>
                </div>
                <div>
                    <div class="task-name">${t.title}</div>
                    <div class="task-time">${t.time}</div>
                </div>
                <div class="task-corner-icon"><i data-lucide="check" size="12"></i></div>
            </div>
        `;
    });
    html += `<div class="task-card dashed" onclick="openModal('taskModal')">+ Add a task</div>`;
    container.innerHTML = html;
    lucide.createIcons();
}

function saveTask(e) {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const time = document.getElementById('taskTime').value;
    const tasks = JSON.parse(localStorage.getItem('sbhub_tasks') || '[]');
    tasks.push({title, time});
    localStorage.setItem('sbhub_tasks', JSON.stringify(tasks));
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskTime').value = '';
    closeModal('taskModal');
    loadTasks();
}

function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem('sbhub_tasks') || '[]');
    tasks.splice(index, 1);
    localStorage.setItem('sbhub_tasks', JSON.stringify(tasks));
    loadTasks();
}
loadTasks();

// --- Jira & Handover Management ---
function loadAlerts() {
    const alerts = JSON.parse(localStorage.getItem('sbhub_alerts') || '[]');
    const container = document.getElementById('jiraHandoverContent');
    
    if(alerts.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:2rem; color:#888; font-size:0.8rem;">No pending alerts.</div>`;
        return;
    }

    let html = '';
    alerts.forEach((a, index) => {
        const isJira = a.type === 'JIRA';
        html += `
            <div class="alert-item ${isJira ? 'jira' : ''}">
                <i data-lucide="x" class="delete-alert" size="12" onclick="deleteAlert(${index})"></i>
                <div style="display:flex; justify-content:space-between; margin-bottom:4px; padding-right:12px;">
                    <span style="font-weight:700;"><span class="alert-brand">${a.brand}</span>${a.type}</span>
                    <span style="font-size:0.65rem; color:${isJira?'#ef4444':'#facc15'};">ACTIVE</span>
                </div>
                <div style="color:#ddd;">${a.msg}</div>
            </div>
        `;
    });
    container.innerHTML = html;
    lucide.createIcons();
}

function saveAlert(e) {
    e.preventDefault();
    const type = document.getElementById('alertType').value;
    const brand = document.getElementById('alertBrand').value;
    const msg = document.getElementById('alertMsg').value;
    const alerts = JSON.parse(localStorage.getItem('sbhub_alerts') || '[]');
    alerts.push({type, brand, msg});
    localStorage.setItem('sbhub_alerts', JSON.stringify(alerts));
    document.getElementById('alertBrand').value = '';
    document.getElementById('alertMsg').value = '';
    closeModal('alertModal');
    loadAlerts();
}

function deleteAlert(index) {
    const alerts = JSON.parse(localStorage.getItem('sbhub_alerts') || '[]');
    alerts.splice(index, 1);
    localStorage.setItem('sbhub_alerts', JSON.stringify(alerts));
    loadAlerts();
}
loadAlerts();

// --- Live Clocks & Weather ---
function updateClocks() {
    const now = new Date();
    document.getElementById('live-time-gmt8').innerText = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Manila', hour12: false });
    document.getElementById('live-date-gmt8').innerText = now.toLocaleDateString('en-US', { timeZone: 'Asia/Manila', weekday: 'short', month: 'short', day: 'numeric' });
    document.getElementById('live-time-gmt2').innerText = now.toLocaleTimeString('en-US', { timeZone: 'Europe/Athens', hour12: false });
    document.getElementById('live-date-gmt2').innerText = now.toLocaleDateString('en-US', { timeZone: 'Europe/Athens', weekday: 'short', month: 'short', day: 'numeric' });
}
setInterval(updateClocks, 1000); updateClocks();

let fbDb = null;
try { firebase.initializeApp({databaseURL: "https://test-daily-task--sb-default-rtdb.firebaseio.com", projectId: "test-daily-task--sb"}); fbDb = firebase.database(); } catch(e){ console.warn(e); }

async function fetchWeather() {
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=14.5995&longitude=120.9842&current_weather=true&wind_speed_10m');
        const data = await res.json();
        const temp = Math.round(data.current_weather.temperature);
        const wind = Math.round(data.current_weather.windspeed);
        
        document.getElementById('live-temp').innerText = `${temp}°C`;
        document.getElementById('live-weather-desc').innerText = `Wind: ${wind} km/h | Manila Local`;

        if(fbDb) fbDb.ref('system_status/weather').set({ temp, wind, lastUpdated: new Date().toISOString() });
    } catch (err) {
        document.getElementById('live-temp').innerText = 'N/A';
        console.warn("Weather error:", err);
    }
}
fetchWeather(); setInterval(fetchWeather, 15 * 60 * 1000);

// --- Theme Switcher ---
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if(theme === 'blue') {
        document.documentElement.style.setProperty('--body-bg', '#bae6fd');
        document.documentElement.style.setProperty('--main-bg', '#e0f2fe');
    } else {
        document.documentElement.style.removeProperty('--body-bg');
        document.documentElement.style.removeProperty('--main-bg');
    }
    localStorage.setItem('sbhub_theme_pref', theme);
    closeModal('themeModal');
}
const savedTheme = localStorage.getItem('sbhub_theme_pref');
if(savedTheme) applyTheme(savedTheme);

// --- Top Picks ---
let cachedPicks = [];
let currentLeague = 'eng.1';

async function fetchTopPicks() {
    const leagues = ['eng.1', 'esp.1', 'ger.1', 'ita.1', 'uefa.champions'];
    const dateQ = new Date().toLocaleString("en-CA", {timeZone: "Asia/Manila"}).split(',')[0].replace(/-/g,'');
    
    let allMatches = [];
    for(let l of leagues) {
        try {
            const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${l}/scoreboard?dates=${dateQ}`);
            const data = await res.json();
            if(data.events) {
                data.events.forEach((e, i) => {
                    if(e.status.type.state !== 'pre') return;
                    const comp = e.competitions[0];
                    const home = comp.competitors.find(c=>c.homeAway==='home').team;
                    const away = comp.competitors.find(c=>c.homeAway==='away').team;
                    allMatches.push({
                        league: l,
                        homeName: home.shortDisplayName || home.name,
                        awayName: away.shortDisplayName || away.name,
                        homeLogo: home.logo, awayLogo: away.logo,
                        time: new Date(e.date).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false}),
                        badge: i%2===0 ? "TOP PICK" : "HOT"
                    });
                });
            }
        } catch(err) { console.warn(err); }
    }
    cachedPicks = allMatches;
    renderPicks();
}

function filterPicks(league, btn) {
    currentLeague = league;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    renderPicks();
}

function renderPicks() {
    const container = document.getElementById('topPicksContainer');
    const matches = cachedPicks.filter(m => m.league === currentLeague).slice(0, 5);
    
    if(matches.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; display:flex; align-items:center; justify-content:center; height:100%; min-height:100px; color: var(--text-muted); font-size: 0.85rem; font-weight:600;">No scheduled matches available for this league today.</div>`;
        return;
    }

    let html = '';
    matches.forEach(m => {
        const isTop = m.badge === "TOP PICK";
        html += `
            <div class="match-card ${isTop ? 'top-pick' : ''}">
                <div class="flags-row">
                    <img src="${m.homeLogo}" onerror="this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'" />
                    <span style="font-size:0.7rem; color:var(--text-muted); font-weight:800;">VS</span>
                    <img src="${m.awayLogo}" onerror="this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'" />
                </div>
                <div class="match-name">${m.homeName} vs ${m.awayName}</div>
                <div class="match-badge ${isTop ? 'blue' : ''}">${m.badge}</div>
                <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 6px;"><i data-lucide="clock" size="10"></i> ${m.time}</div>
            </div>
        `;
    });
    container.innerHTML = html;
    lucide.createIcons();
}
fetchTopPicks();

// --- Notifications ---
function openNotifications() {
    const list = document.getElementById('notificationsList');
    openModal('notificationsModal');
    
    if (cachedPicks.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding: 2rem; color: var(--text-muted); font-size: 0.85rem; font-weight:600;">No top games available at the moment.</div>`;
        return;
    }

    let html = '';
    cachedPicks.forEach(m => {
        html += `
            <div style="background: rgba(150,150,150,0.05); border: 1px solid var(--glass-border); border-radius: 12px; padding: 0.8rem; display: flex; align-items: center; justify-content: space-between;">
                <div style="display:flex; align-items:center; gap: 10px;">
                    <img src="${m.homeLogo}" style="width:24px;height:24px;border-radius:50%; background:white;" onerror="this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'" />
                    <span style="font-weight:700; font-size:0.8rem; color:var(--text-main);">${m.homeName} vs ${m.awayName}</span>
                    <img src="${m.awayLogo}" style="width:24px;height:24px;border-radius:50%; background:white;" onerror="this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'" />
                </div>
                <div style="text-align:right;">
                    <div style="font-size:0.6rem; font-weight:800; background:var(--accent); color:white; padding:2px 6px; border-radius:4px; display:inline-block;">${m.league.toUpperCase().replace('.1','')}</div>
                    <div style="font-size:0.65rem; color:var(--text-muted); margin-top:4px;"><i data-lucide="clock" size="10"></i> ${m.time}</div>
                </div>
            </div>
        `;
    });
    list.innerHTML = html;
    lucide.createIcons();
}

// --- Top Games Navigation ---
let dayOffset = 0;
function navMatchDay(dir) {
    dayOffset += dir;
    if(dayOffset < 0) dayOffset = 6; if(dayOffset > 6) dayOffset = 0;
    renderGamesList();
}

function renderGamesList() {
    const container = document.getElementById('gamesContainer');
    const display = document.getElementById('matchDayDisplay');
    
    const target = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }));
    target.setDate(target.getDate() + dayOffset);
    display.innerText = `${dayOffset === 0 ? 'TODAY' : 'DAY '+ (dayOffset+1)} (${target.toLocaleDateString('en-US',{month:'short',day:'numeric'})})`;

    let games = cachedPicks.slice(0, 5); 
    if(games.length === 0) {
         container.innerHTML = `<div style="text-align:center; padding: 2rem; color: var(--text-muted); font-size: 0.8rem;">No fixtures available for this date.</div>`;
         return;
    }

    let html = '';
    games.forEach(g => {
        html += `
            <div class="game-row">
                <img src="${g.homeLogo}" style="width:24px;height:24px;border-radius:50%; background:white;" onerror="this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'" />
                <img src="${g.awayLogo}" style="width:24px;height:24px;border-radius:50%;margin-left:-8px; background:white;" onerror="this.src='https://a.espncdn.com/i/teamlogos/soccer/500/default.png'" />
                <div style="flex-grow:1; margin-left:8px;">
                    <div class="game-title">${g.homeName} <span style="color:var(--text-muted);font-weight:400;font-size:0.7rem;">vs</span> ${g.awayName}</div>
                    <div class="game-sub">${g.time}</div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}
setTimeout(renderGamesList, 1500);

// --- Firebase Live Duties ---
function loadLiveDuties() {
    const h = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })).getHours();
    let slot = { id: "slot_21_0", label: "21:00 - 00:00" };
    if (h >= 6 && h < 9) slot = { id: "slot_6_9", label: "06:00 - 09:00" };
    else if (h >= 9 && h < 12) slot = { id: "slot_9_12", label: "09:00 - 12:00" };
    else if (h >= 12 && h < 15) slot = { id: "slot_12_15", label: "12:00 - 15:00" };
    else if (h >= 15 && h < 18) slot = { id: "slot_15_18", label: "15:00 - 18:00" };
    else if (h >= 18 && h < 21) slot = { id: "slot_18_21", label: "18:00 - 21:00" };
    
    document.getElementById('slotBadge').innerText = slot.label;
    const container = document.getElementById("liveDutyContent");

    if (!fbDb) { container.innerHTML = `<div style="font-size:0.8rem; color:var(--text-muted); text-align:center;">Database offline</div>`; return; }

    fbDb.ref('roster_data').on('value', (snapshot) => {
        const data = snapshot.val();
        if(!data) return;
        
        const todayIso = new Date().toLocaleString("en-CA", {timeZone: "Asia/Manila"}).split(',')[0];
        let dayData = data[todayIso] || Object.values(data).pop();
        if(!dayData || dayData === 'archives') return;

        let html = ''; let activeCount = 0;
        const members = [{id:'ann', n:'ANN'}, {id:'dave', n:'DAVE'}, {id:'ken', n:'KEN'}, {id:'kriztel', n:'KRIZTEL'}];
        
        members.forEach(m => {
            const grid = dayData.grid ? dayData.grid[m.id] : null;
            const shiftId = grid?.shift || 'shift-7-16';
            const isRest = shiftId.includes('rd') || shiftId.includes('vl');
            if(!isRest) activeCount++;
            
            let tasks = (grid && grid.slots) ? (grid.slots[slot.id] || []) : [];
            
            html += `
                <div class="duty-card">
                    <div class="duty-top"><span>${m.n}</span><span class="duty-badge">${isRest ? 'OFF' : shiftId.replace('shift-','')}</span></div>
            `;
            if(isRest) html += `<div class="duty-text">Offline / Rest Day</div>`;
            else if(tasks.length === 0) html += `<div class="duty-text">No specific tasks.</div>`;
            else {
                tasks.forEach(t => {
                    let text = typeof t === 'string' ? t : t.text;
                    let done = typeof t === 'object' ? t.done : false;
                    html += `<div class="duty-text"><i data-lucide="${done?'check-circle':'clock'}" size="12" style="color:${done?'#10b981':'var(--text-muted)'}"></i> <span style="${done?'text-decoration:line-through;opacity:0.6':''}">${text}</span></div>`;
                });
            }
            html += `</div>`;
        });
        container.innerHTML = html;
        document.getElementById('activeTraderCount').innerText = activeCount;
        lucide.createIcons();
    });
}
loadLiveDuties();
