const EVENTS_KEY = "teacherEvents";
const SETTINGS_KEY = "teacherAppSettings";

const DEFAULT_TIMEZONES = [
    { value: "UTC+08:00", label: "台北（GMT+8）", short: "TPE" },
    { value: "UTC+09:00", label: "東京（GMT+9）", short: "TYO" },
    { value: "UTC+09:00", label: "首爾（GMT+9）", short: "SEL" },
    { value: "UTC+08:00", label: "上海（GMT+8）", short: "SHA" },
    { value: "UTC+08:00", label: "香港（GMT+8）", short: "HKG" },
    { value: "UTC+08:00", label: "新加坡（GMT+8）", short: "SG" },
    { value: "UTC+07:00", label: "曼谷（GMT+7）", short: "BKK" },
    { value: "UTC+07:00", label: "胡志明市（GMT+7）", short: "SGN" },
    { value: "UTC+00:00", label: "倫敦（GMT+0）", short: "LDN" },
    { value: "UTC+01:00", label: "巴黎（GMT+1）", short: "PAR" },
    { value: "UTC-08:00", label: "洛杉磯（GMT-8）", short: "LA" },
    { value: "UTC-05:00", label: "紐約（GMT-5）", short: "NY" },
    { value: "UTC+10:00", label: "雪梨（GMT+10）", short: "SYD" }
];

const GMT_OFFSET_OPTIONS = [
    ["UTC-12:00", "GMT-12"], ["UTC-11:00", "GMT-11"], ["UTC-10:00", "GMT-10"],
    ["UTC-09:00", "GMT-9"], ["UTC-08:00", "GMT-8"], ["UTC-07:00", "GMT-7"],
    ["UTC-06:00", "GMT-6"], ["UTC-05:00", "GMT-5"], ["UTC-04:00", "GMT-4"],
    ["UTC-03:00", "GMT-3"], ["UTC-02:00", "GMT-2"], ["UTC-01:00", "GMT-1"],
    ["UTC+00:00", "GMT+0"], ["UTC+01:00", "GMT+1"], ["UTC+02:00", "GMT+2"],
    ["UTC+03:00", "GMT+3"], ["UTC+04:00", "GMT+4"], ["UTC+05:00", "GMT+5"],
    ["UTC+06:00", "GMT+6"], ["UTC+07:00", "GMT+7"], ["UTC+08:00", "GMT+8"],
    ["UTC+09:00", "GMT+9"], ["UTC+10:00", "GMT+10"], ["UTC+11:00", "GMT+11"],
    ["UTC+12:00", "GMT+12"], ["UTC+13:00", "GMT+13"], ["UTC+14:00", "GMT+14"]
];

const PLATFORM_COLORS = ["#f1c40f", "#e74c3c", "#8e44ad", "#27ae60", "#2980b9", "#00897b", "#d81b60", "#3949ab", "#795548", "#455a64"];
const EXTENDED_TIME_MAX_MINUTES = 29 * 60 + 30;
const DEFAULT_PLATFORMS = [
    { name: "補習班", color: "#f1c40f", textColor: "#222222" },
    { name: "AmazingTalker", color: "#e74c3c", textColor: "#ffffff" },
    { name: "Preply", color: "#8e44ad", textColor: "#ffffff" },
    { name: "學校", color: "#27ae60", textColor: "#ffffff" },
    { name: "私人ZOOM", color: "#2980b9", textColor: "#ffffff" }
];
const DEFAULT_CATEGORIES = [
    { name: "工作", color: "#2563eb", textColor: "#ffffff" },
    { name: "私人", color: "#16a34a", textColor: "#ffffff" },
    { name: "家庭", color: "#f97316", textColor: "#ffffff" },
    { name: "學習", color: "#7c3aed", textColor: "#ffffff" },
    { name: "健康", color: "#0f766e", textColor: "#ffffff" },
    { name: "其他", color: "#64748b", textColor: "#ffffff" }
];

const defaultSettings = {
    hasCompletedOnboarding: false,
    appMode: "teacher",
    teacherName: "",
    showTeacherName: true,
    baseTimeZone: "UTC+08:00",
    displayTimeZone: "UTC+08:00",
    customTimeZones: [],
    currency: "NT$",
    defaultDuration: 50,
    platforms: DEFAULT_PLATFORMS,
    categories: DEFAULT_CATEGORIES
};

let settings = normalizeSettings(loadSettings());
let events = normalizeEvents(JSON.parse(localStorage.getItem(EVENTS_KEY) || "[]"));
let currentSelectedDate = "";
let delTargetId = null;
let lastDeletedEvent = null;
let latestPreviewImage = null;
let toastTimer = null;
let onboardingStep = 1;
let setupItems = cloneItems(getCurrentItems());
let settingsItems = cloneItems(getCurrentItems());

const $ = id => document.getElementById(id);
const yearSelect = $("yearSelect");
const monthSelect = $("monthSelect");
const calendarGrid = $("calendarGrid");
const searchInput = $("searchInput");
const clearSearchBtn = $("clearSearchBtn");

function init() {
    currentSelectedDate = formatDate(new Date());
    populateCustomTimezoneSelectors();
    populateTimezoneSelects();
    populateYearMonth();
    fillTimeOptions();
    bindEvents();
    applySettingsToUI();
    renderCalendar();
    if (!settings.hasCompletedOnboarding) openOnboarding();
}

function loadSettings() {
    return { ...defaultSettings, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null") || {}) };
}

function normalizeSettings(raw) {
    const normalized = { ...defaultSettings, ...raw };
    normalized.appMode = normalized.appMode === "general" ? "general" : "teacher";
    normalized.customTimeZones = Array.isArray(normalized.customTimeZones) ? normalized.customTimeZones : [];
    normalized.platforms = normalizeItems(normalized.platforms, DEFAULT_PLATFORMS);
    normalized.categories = normalizeItems(normalized.categories, DEFAULT_CATEGORIES);
    if (normalized.baseTimeZone === "Asia/Taipei") normalized.baseTimeZone = "UTC+08:00";
    if (normalized.displayTimeZone === "Asia/Taipei") normalized.displayTimeZone = "UTC+08:00";
    return normalized;
}

function normalizeItems(items, fallback) {
    if (!Array.isArray(items) || items.length === 0) return cloneItems(fallback);
    return items.map((item, index) => {
        if (typeof item === "string") {
            const color = PLATFORM_COLORS[index] || "#7f8c8d";
            return { name: item, color, textColor: getReadableTextColor(color) };
        }
        const color = item.color || PLATFORM_COLORS[index] || "#7f8c8d";
        return { name: item.name || `項目 ${index + 1}`, color, textColor: item.textColor || getReadableTextColor(color) };
    });
}

function normalizeEvents(list) {
    if (!Array.isArray(list)) return [];
    return list.map(item => ({
        id: item.id || makeId(),
        mode: item.mode || (item.category || item.location || item.target ? "general" : "teacher"),
        date: item.date,
        platform: item.platform || item.category || "其他",
        category: item.category || item.platform || "其他",
        fee: Number(item.fee) || 0,
        expenses: Array.isArray(item.expenses) ? item.expenses.map(exp => ({ name: exp.name || "花費", amount: Number(exp.amount) || 0 })) : [],
        student: item.student || item.target || "未填寫",
        target: item.target || "",
        location: item.location || "",
        start: item.start || "",
        end: item.end || "",
        content: item.content || "",
        note: item.note || ""
    })).filter(item => item.date);
}

function cloneItems(items) {
    return items.map(item => ({ ...item }));
}

function isTeacherMode() {
    return settings.appMode !== "general";
}

function getCurrentItems() {
    return isTeacherMode() ? settings.platforms : settings.categories;
}

function bindEvents() {
    yearSelect.onchange = renderCalendar;
    monthSelect.onchange = renderCalendar;
    $("prevMonthBtn").onclick = () => changeMonth(-1);
    $("nextMonthBtn").onclick = () => changeMonth(1);
    $("backToToday").onclick = goToday;
    $("exportCalendarBtn").onclick = exportToCalendar;
    $("exportImageBtn").onclick = openScheduleImagePreview;
    $("exportPublicPageBtn").onclick = exportPublicScheduleData;
    $("downloadPreviewImageBtn").onclick = downloadPreviewImage;
    $("backupBtn").onclick = exportBackup;
    $("importBackupBtn").onclick = () => $("importBackupInput").click();
    $("importBackupInput").onchange = importBackup;
    $("mobileAddBtn").onclick = () => openAddModal(currentSelectedDate);
    $("showDayDetailBtn").onclick = openDetailModal;
    $("openSettingsBtn").onclick = openSettingsModal;
    $("saveSettingsBtn").onclick = saveSettingsFromModal;
    $("settingsResetBtn").onclick = () => $("resetConfirmModal").style.display = "block";
    $("confirmResetBtn").onclick = resetApp;
    $("undoDeleteBtn").onclick = undoDelete;
    $("closeToastBtn").onclick = () => {
        lastDeletedEvent = null;
        hideToast();
    };
    $("setupPrevBtn").onclick = () => changeOnboardingStep(-1);
    $("setupNextBtn").onclick = () => changeOnboardingStep(1);
    $("setupFinishBtn").onclick = finishOnboarding;
    $("setupAddPlatformBtn").onclick = () => addModeItem("setup");
    $("settingsAddPlatformBtn").onclick = () => addModeItem("settings");
    $("setupAddTimezoneBtn").onclick = () => addCustomTimezone("setup");
    $("settingsAddTimezoneBtn").onclick = () => addCustomTimezone("settings");
    $("settingsAppMode").onchange = syncSettingsModeUI;
    $("addExpenseBtn").onclick = () => addExpenseRow();
    $("scheduleForm").onsubmit = submitScheduleForm;
    $("confirmDelBtn").onclick = confirmDelete;

    document.querySelectorAll("input[name='setupAppMode']").forEach(radio => radio.onchange = syncOnboardingModeUI);
    searchInput.oninput = () => {
        clearSearchBtn.classList.toggle("hidden", searchInput.value.trim() === "");
        renderCalendar();
    };
    clearSearchBtn.onclick = () => {
        searchInput.value = "";
        clearSearchBtn.classList.add("hidden");
        renderCalendar();
    };
    $("timezoneSelect").onchange = () => {
        settings.displayTimeZone = $("timezoneSelect").value;
        saveSettings();
        applySettingsToUI();
        updateModalTimezoneHint();
        renderCalendar();
    };
    $("startTimeSelect").onchange = () => {
        if (!$("startTimeSelect").value) return;
        const endVal = addMinutesToTime($("startTimeSelect").value, Number(settings.defaultDuration) || 50);
        ensureTimeOptionExists("endTimeSelect", endVal);
        $("endTimeSelect").value = endVal;
    };
}

function applySettingsToUI() {
    document.body.classList.toggle("mode-general", !isTeacherMode());
    document.body.classList.toggle("mode-teacher", isTeacherMode());
    populateTimezoneSelects();
    $("timezoneSelect").value = settings.displayTimeZone;
    $("timezoneFlag").innerText = getTimezoneShort(settings.displayTimeZone);
    $("currencyLabel").innerText = settings.currency || "";
    $("modePill").innerText = isTeacherMode() ? "教師排課模式" : "一般行事曆模式";
    $("brandTitle").innerText = settings.teacherName
        ? `${settings.teacherName} 的${isTeacherMode() ? "上課管理系統" : "行事曆"}`
        : isTeacherMode() ? "教師上課管理系統" : "個人行事曆";
    $("searchInput").placeholder = isTeacherMode() ? "搜尋學生、平台或課程內容" : "搜尋分類、對象、地點、內容或備註";
    $("exportImageBtn").innerText = isTeacherMode() ? "▣ 匯出課表圖片" : "▣ 匯出行程圖片";
    $("exportPublicPageBtn").classList.toggle("hidden", !isTeacherMode());
    $("monthCountLabel").innerText = isTeacherMode() ? "本月課程" : "本月行程";
    $("monthCountUnit").innerText = isTeacherMode() ? "堂" : "筆";
    $("monthHoursLabel").innerText = isTeacherMode() ? "本月時數" : "本月安排時數";
    $("selectedDayLabel").innerText = isTeacherMode() ? "課堂" : "待辦事項";
    $("selectedDayUnit").innerText = isTeacherMode() ? "堂" : "筆";
    $("moneyStatLabel").innerText = isTeacherMode() ? "預計總收入" : "目前本月總花費";
    populateItemSelects();
}

function populateYearMonth() {
    const now = new Date();
    for (let y = now.getFullYear() - 5; y <= now.getFullYear() + 5; y++) yearSelect.add(new Option(`${y}年`, y, false, y === now.getFullYear()));
    for (let m = 0; m < 12; m++) monthSelect.add(new Option(`${m + 1}月`, m, false, m === now.getMonth()));
}

function populateTimezoneSelects() {
    const ids = ["timezoneSelect", "setupBaseTimezone", "setupDisplayTimezone", "settingsBaseTimezone", "settingsDisplayTimezone"];
    const zones = getAllTimeZones();
    ids.forEach(id => {
        const select = $(id);
        if (!select) return;
        const oldValue = select.value;
        select.innerHTML = "";
        zones.forEach(zone => select.add(new Option(zone.label, zone.value)));
        if (oldValue) select.value = oldValue;
    });
}

function populateCustomTimezoneSelectors() {
    ["setupCustomTimezoneValue", "settingsCustomTimezoneValue"].forEach(id => {
        const select = $(id);
        select.innerHTML = "";
        GMT_OFFSET_OPTIONS.forEach(([value, label]) => select.add(new Option(label, value)));
    });
}

function getAllTimeZones() {
    const zones = [...DEFAULT_TIMEZONES];
    settings.customTimeZones.forEach(zone => {
        if (!zones.some(item => item.label === zone.label && item.value === zone.value)) zones.push(zone);
    });
    return zones;
}

function addCustomTimezone(type) {
    const nameInput = $(type === "setup" ? "setupCustomTimezoneName" : "settingsCustomTimezoneName");
    const valueSelect = $(type === "setup" ? "setupCustomTimezoneValue" : "settingsCustomTimezoneValue");
    const name = nameInput.value.trim();
    if (!name) return alert("請輸入國家或地點名稱。");
    const label = `${name}（${getGmtLabelByValue(valueSelect.value)}）`;
    if (getAllTimeZones().some(zone => zone.label === label)) return alert("這個自訂時區已經存在。");
    settings.customTimeZones.push({ value: valueSelect.value, label, short: makeShortCode(name) });
    saveSettings();
    populateTimezoneSelects();
    $(type === "setup" ? "setupBaseTimezone" : "settingsBaseTimezone").value = valueSelect.value;
    $(type === "setup" ? "setupDisplayTimezone" : "settingsDisplayTimezone").value = valueSelect.value;
    nameInput.value = "";
}

function openOnboarding() {
    document.querySelector(`input[name='setupAppMode'][value='${settings.appMode}']`).checked = true;
    $("setupTeacherName").value = settings.teacherName || "";
    $("setupShowTeacherName").checked = settings.showTeacherName;
    $("setupBaseTimezone").value = settings.baseTimeZone;
    $("setupDisplayTimezone").value = settings.displayTimeZone;
    onboardingStep = 1;
    syncOnboardingModeUI();
    renderOnboardingStep();
    $("onboardingModal").style.display = "block";
}

function getSetupMode() {
    return document.querySelector("input[name='setupAppMode']:checked")?.value || "teacher";
}

function syncOnboardingModeUI() {
    const teacher = getSetupMode() === "teacher";
    setupItems = cloneItems(teacher ? settings.platforms : settings.categories);
    $("setupListTitle").innerText = teacher ? "設定上課平台" : "設定行程分類";
    $("setupListHelp").innerText = teacher ? "前 10 個平台可以有不同顏色，第 11 個開始會統一灰色。" : "可以先建立常用分類，之後也能在設定中新增。";
    $("setupPlatformInput").placeholder = teacher ? "輸入平台名稱" : "輸入分類名稱";
    renderItemList("setup");
}

function renderOnboardingStep() {
    document.querySelectorAll(".onboarding-step").forEach(step => step.classList.toggle("active", Number(step.dataset.step) === onboardingStep));
    document.querySelectorAll(".step-dot").forEach((dot, index) => dot.classList.toggle("active", index + 1 === onboardingStep));
    $("onboardingStepText").innerText = `${onboardingStep} / 4`;
    $("setupPrevBtn").classList.toggle("hidden", onboardingStep === 1);
    $("setupNextBtn").classList.toggle("hidden", onboardingStep === 4);
    $("setupFinishBtn").classList.toggle("hidden", onboardingStep !== 4);
    if (onboardingStep === 4) renderSetupSummary();
}

function changeOnboardingStep(direction) {
    if (direction > 0 && !validateOnboardingStep()) return;
    onboardingStep = Math.max(1, Math.min(4, onboardingStep + direction));
    renderOnboardingStep();
}

function validateOnboardingStep() {
    if (onboardingStep === 1 && !$("setupTeacherName").value.trim()) return alert("請先輸入顯示名稱。"), false;
    if (onboardingStep === 3 && setupItems.length === 0) return alert(getSetupMode() === "teacher" ? "請至少新增一個上課平台。" : "請至少新增一個分類。"), false;
    return true;
}

function renderSetupSummary() {
    const mode = getSetupMode() === "teacher" ? "教師排課模式" : "一般行事曆模式";
    $("setupSummary").innerHTML = `
        <strong>使用模式：</strong>${mode}<br>
        <strong>顯示名稱：</strong>${escapeHtml($("setupTeacherName").value.trim())}<br>
        <strong>主要時區：</strong>${escapeHtml(getTimezoneLabelByValue($("setupBaseTimezone").value))}<br>
        <strong>顯示時區：</strong>${escapeHtml(getTimezoneLabelByValue($("setupDisplayTimezone").value))}<br>
        <strong>${getSetupMode() === "teacher" ? "平台" : "分類"}：</strong>${setupItems.map(item => escapeHtml(item.name)).join("、")}
    `;
}

function finishOnboarding() {
    if (!validateOnboardingStep()) return;
    const appMode = getSetupMode();
    settings = {
        ...settings,
        hasCompletedOnboarding: true,
        appMode,
        teacherName: $("setupTeacherName").value.trim(),
        showTeacherName: $("setupShowTeacherName").checked,
        baseTimeZone: $("setupBaseTimezone").value,
        displayTimeZone: $("setupDisplayTimezone").value,
        platforms: appMode === "teacher" ? cloneItems(setupItems) : settings.platforms,
        categories: appMode === "general" ? cloneItems(setupItems) : settings.categories
    };
    saveSettings();
    closeModal("onboardingModal");
    fillTimeOptions();
    applySettingsToUI();
    renderCalendar();
}

function openSettingsModal() {
    $("settingsAppMode").value = settings.appMode;
    $("settingsTeacherName").value = settings.teacherName;
    $("settingsShowTeacherName").checked = settings.showTeacherName;
    $("settingsBaseTimezone").value = settings.baseTimeZone;
    $("settingsDisplayTimezone").value = settings.displayTimeZone;
    $("settingsCurrency").value = settings.currency;
    $("settingsDefaultDuration").value = settings.defaultDuration;
    syncSettingsModeUI();
    $("settingsModal").style.display = "block";
}

function syncSettingsModeUI() {
    const teacher = $("settingsAppMode").value !== "general";
    settingsItems = cloneItems(teacher ? settings.platforms : settings.categories);
    $("settingsListLabel").innerText = teacher ? "上課平台與顏色" : "行程分類與顏色";
    $("settingsPlatformInput").placeholder = teacher ? "新增平台名稱" : "新增分類名稱";
    renderItemList("settings");
}

function saveSettingsFromModal() {
    const appMode = $("settingsAppMode").value === "general" ? "general" : "teacher";
    const teacherName = $("settingsTeacherName").value.trim();
    if (!teacherName) return alert("請輸入顯示名稱。");
    const normalizedItems = readSettingsItemRows();
    if (normalizedItems.length === 0) return alert(appMode === "teacher" ? "請至少保留一個上課平台。" : "請至少保留一個分類。");
    const duplicate = findDuplicateItemName(normalizedItems);
    if (duplicate) return alert(`名稱「${duplicate}」重複，請修正後再儲存。`);

    const oldItems = appMode === "teacher" ? settings.platforms : settings.categories;
    oldItems.forEach((oldItem, index) => {
        const newItem = normalizedItems[index];
        if (!newItem || oldItem.name === newItem.name) return;
        events.forEach(eventItem => {
            if (appMode === "teacher" && eventItem.platform === oldItem.name) eventItem.platform = newItem.name;
            if (appMode === "general" && eventItem.category === oldItem.name) eventItem.category = newItem.name;
        });
    });

    settings = {
        ...settings,
        hasCompletedOnboarding: true,
        appMode,
        teacherName,
        showTeacherName: $("settingsShowTeacherName").checked,
        baseTimeZone: $("settingsBaseTimezone").value,
        displayTimeZone: $("settingsDisplayTimezone").value,
        currency: $("settingsCurrency").value.trim() || "",
        defaultDuration: Number($("settingsDefaultDuration").value) || 50,
        platforms: appMode === "teacher" ? normalizedItems : settings.platforms,
        categories: appMode === "general" ? normalizedItems : settings.categories
    };
    saveSettings();
    saveData();
    closeModal("settingsModal");
    fillTimeOptions();
    applySettingsToUI();
    renderCalendar();
}

function addModeItem(type) {
    const input = $(type === "setup" ? "setupPlatformInput" : "settingsPlatformInput");
    const value = input.value.trim();
    if (!value) return;
    const list = type === "setup" ? setupItems : settingsItems;
    if (list.some(item => item.name.toLowerCase() === value.toLowerCase())) return alert("這個名稱已經存在。");
    const color = PLATFORM_COLORS[list.length] || "#7f8c8d";
    list.push({ name: value, color, textColor: getReadableTextColor(color) });
    input.value = "";
    renderItemList(type);
}

function removePlatform(type, index) {
    if (type === "setup") setupItems.splice(index, 1);
    else settingsItems.splice(index, 1);
    renderItemList(type);
}

function renderItemList(type) {
    const container = $(type === "setup" ? "setupPlatformList" : "settingsPlatformList");
    const list = type === "setup" ? setupItems : settingsItems;
    if (type === "setup") {
        container.innerHTML = list.map((item, index) => `
            <span class="platform-chip" style="--chip-color:${getItemColor(item, index)};--chip-text:${getReadableTextColor(getItemColor(item, index))}">
                ${escapeHtml(item.name)}
                <button type="button" onclick="removePlatform('${type}', ${index})">×</button>
            </span>
        `).join("");
        return;
    }
    container.innerHTML = list.map((item, index) => {
        const color = getItemColor(item, index);
        return `
            <div class="platform-edit-row">
                <input class="platform-name-input" type="text" value="${escapeHtml(item.name)}" placeholder="名稱">
                <input class="platform-color-input" type="color" value="${color}" ${index >= 10 ? "disabled" : ""}>
                <button type="button" class="btn btn-cancel" onclick="removePlatform('${type}', ${index})">刪除</button>
            </div>
        `;
    }).join("");
}

function readSettingsItemRows() {
    return Array.from(document.querySelectorAll(".platform-edit-row")).map((row, index) => {
        const name = row.querySelector(".platform-name-input").value.trim();
        const color = index >= 10 ? "#7f8c8d" : row.querySelector(".platform-color-input").value;
        return { name, color, textColor: getReadableTextColor(color) };
    }).filter(item => item.name);
}

function findDuplicateItemName(items) {
    const seen = new Set();
    for (const item of items) {
        const key = item.name.toLowerCase();
        if (seen.has(key)) return item.name;
        seen.add(key);
    }
    return "";
}

function populateItemSelects() {
    $("platformSelect").innerHTML = "";
    $("categorySelect").innerHTML = "";
    settings.platforms.forEach(item => $("platformSelect").add(new Option(item.name, item.name)));
    settings.categories.forEach(item => $("categorySelect").add(new Option(item.name, item.name)));
}

function fillTimeOptions() {
    let html = isTeacherMode() ? "" : '<option value="">不設定</option>';
    for (let h = 0; h <= 29; h++) {
        for (const m of ["00", "30"]) {
            if (h * 60 + Number(m) > EXTENDED_TIME_MAX_MINUTES) continue;
            const time = `${String(h).padStart(2, "0")}:${m}`;
            html += `<option value="${time}">${time}</option>`;
        }
    }
    $("startTimeSelect").innerHTML = html;
    $("endTimeSelect").innerHTML = html;
}

function renderCalendar() {
    calendarGrid.innerHTML = "";
    const year = Number(yearSelect.value);
    const month = Number(monthSelect.value);
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = formatDate(new Date());

    for (let i = 0; i < firstDay; i++) calendarGrid.appendChild(Object.assign(document.createElement("div"), { className: "day-cell empty" }));
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const allDayEvents = events.filter(eventItem => eventItem.date === dateStr && eventBelongsToCurrentMode(eventItem)).sort(compareEvents);
        const visibleDayEvents = allDayEvents.filter(eventMatchesSearch);
        const cell = document.createElement("div");
        cell.className = `day-cell ${isDayCompleted(allDayEvents) ? "completed-day" : ""} ${dateStr === todayStr ? "is-today" : ""} ${dateStr === currentSelectedDate ? "selected" : ""}`;
        cell.innerHTML = `
            <div class="day-num-row">
                <span class="day-num">${d}</span>
                ${dateStr === todayStr ? '<span class="today-badge">今天</span>' : ""}
            </div>
            <div class="event-list-mini">
                ${visibleDayEvents.map(renderMiniEvent).join("")}
                ${getSearchKeyword() && allDayEvents.length > 0 && visibleDayEvents.length === 0 ? '<div class="no-match-text">無符合結果</div>' : ""}
            </div>
        `;
        cell.onclick = () => {
            currentSelectedDate = dateStr;
            renderCalendar();
        };
        cell.ondblclick = () => openAddModal(dateStr);
        calendarGrid.appendChild(cell);
    }
    updateFooterStats();
}

function renderMiniEvent(eventItem) {
    const style = getEventStyle(eventItem);
    return `
        <div class="event-tag-item ${isEventCompleted(eventItem) ? "completed-event" : ""}" style="background:${style.color};color:${style.textColor};${style.textColor === "#222222" ? "text-shadow:none;" : ""}">
            <span>${escapeHtml(getMiniEventText(eventItem))}</span>
            <div class="event-tag-actions">
                <button class="event-action" onclick="openEditModal('${eventItem.id}', event)" title="編輯">✎</button>
                <button class="event-action" onclick="openDeleteModal('${eventItem.id}', event)" title="刪除">×</button>
            </div>
        </div>
    `;
}

function eventBelongsToCurrentMode(eventItem) {
    return (eventItem.mode || "teacher") === settings.appMode;
}

function compareEvents(a, b) {
    return `${a.start || "99:99"} ${a.content}`.localeCompare(`${b.start || "99:99"} ${b.content}`);
}

function getMiniEventText(eventItem) {
    if (isTeacherMode()) return getDisplayTimeRange(eventItem);
    return `${hasTimeRange(eventItem) ? getDisplayTimeRange(eventItem) : "未設定時間"}｜${eventItem.content || "未命名行程"}`;
}

function getEventStyle(eventItem) {
    const list = isTeacherMode() ? settings.platforms : settings.categories;
    const name = isTeacherMode() ? eventItem.platform : eventItem.category;
    const index = list.findIndex(item => item.name === name);
    if (index < 0) return { color: "#7f8c8d", textColor: "#ffffff" };
    const color = getItemColor(list[index], index);
    return { color, textColor: getReadableTextColor(color) };
}

function eventMatchesSearch(eventItem) {
    const keyword = getSearchKeyword();
    if (!keyword) return true;
    const values = isTeacherMode()
        ? [eventItem.platform, eventItem.student, eventItem.content, eventItem.date, eventItem.start, eventItem.end]
        : [eventItem.category, eventItem.target, eventItem.location, eventItem.content, eventItem.note, eventItem.date, eventItem.start, eventItem.end];
    return values.some(value => String(value || "").toLowerCase().includes(keyword));
}

function openAddModal(dateStr) {
    currentSelectedDate = dateStr;
    populateItemSelects();
    fillTimeOptions();
    $("scheduleForm").reset();
    $("editEventId").value = "";
    $("repeatSelect").disabled = false;
    resetInputToggles();
    clearExpenseRows();
    if (!isTeacherMode()) addExpenseRow();
    setAddModalModeUI();
    $("addModalDateTitle").innerText = `${isTeacherMode() ? "新增排課" : "新增行程"}：${dateStr}`;
    updateModalTimezoneHint();
    $("addModal").style.display = "block";
}

function openEditModal(id, e) {
    if (e) e.stopPropagation();
    const target = events.find(eventItem => eventItem.id === id);
    if (!target) return;
    populateItemSelects();
    fillTimeOptions();
    resetInputToggles();
    clearExpenseRows();
    setAddModalModeUI();
    $("editEventId").value = id;
    $("repeatSelect").value = "none";
    $("repeatSelect").disabled = true;
    $("addModalDateTitle").innerText = `${isTeacherMode() ? "編輯課程" : "編輯行程"}：${target.date}`;
    updateModalTimezoneHint();
    if (isTeacherMode()) {
        setSelectOrCustom("platformSelect", "platformInput", target.platform);
        $("courseFee").value = target.fee || "";
        $("studentName").value = target.student === "未填寫" ? "" : target.student;
    } else {
        setSelectOrCustom("categorySelect", "categoryInput", target.category);
        $("targetPerson").value = target.target || "";
        $("locationInput").value = target.location || "";
        (target.expenses?.length ? target.expenses : [{ name: "", amount: "" }]).forEach(exp => addExpenseRow(exp.name, exp.amount));
        $("noteInput").value = target.note || "";
    }
    ensureTimeOptionExists("startTimeSelect", target.start);
    ensureTimeOptionExists("endTimeSelect", target.end);
    $("startTimeSelect").value = target.start || "";
    $("endTimeSelect").value = target.end || "";
    $("startTimeInput").value = target.start || "";
    $("endTimeInput").value = target.end || "";
    $("courseContent").value = target.content || "";
    $("addModal").style.display = "block";
}

function setAddModalModeUI() {
    $("teacherFields").classList.toggle("hidden", !isTeacherMode());
    $("generalFields").classList.toggle("hidden", isTeacherMode());
    $("generalNoteField").classList.toggle("hidden", isTeacherMode());
    $("generalTimeHint").classList.toggle("hidden", isTeacherMode());
    $("contentLabel").innerText = isTeacherMode() ? "課程內容" : "內容（必填）";
    $("courseContent").placeholder = isTeacherMode() ? "請輸入教材或進度..." : "請輸入行程內容...";
    $("timeFieldLabel").innerText = isTeacherMode() ? "時間範圍" : "時間（選填）";
    $("repeatText").innerText = isTeacherMode() ? "排課" : "行程";
}

function updateModalTimezoneHint() {
    const hint = $("modalTimezoneHint");
    if (!hint) return;
    hint.innerText = `（目前使用：${getTimezoneLabelByValue(settings.displayTimeZone)}）`;
}

function resetInputToggles() {
    $("platformSelect").classList.remove("hidden");
    $("platformInput").classList.add("hidden");
    $("categorySelect").classList.remove("hidden");
    $("categoryInput").classList.add("hidden");
    $("timeSelectGroup").classList.remove("hidden");
    $("timeInputGroup").classList.add("hidden");
}

function setSelectOrCustom(selectId, inputId, value) {
    const select = $(selectId);
    const options = Array.from(select.options).map(option => option.value);
    if (options.includes(value)) {
        select.value = value;
        select.classList.remove("hidden");
        $(inputId).classList.add("hidden");
    } else {
        $(inputId).value = value || "";
        $(inputId).classList.remove("hidden");
        select.classList.add("hidden");
    }
}

function submitScheduleForm(e) {
    e.preventDefault();
    const editId = $("editEventId").value;
    const targetDate = editId ? events.find(item => item.id === editId)?.date || currentSelectedDate : currentSelectedDate;
    const start = !$("timeInputGroup").classList.contains("hidden") ? $("startTimeInput").value.trim() : $("startTimeSelect").value;
    const end = !$("timeInputGroup").classList.contains("hidden") ? $("endTimeInput").value.trim() : $("endTimeSelect").value;
    const validation = validateTimeRange(start, end);
    if (!validation.valid) return alert(validation.message);

    let eventData;
    if (isTeacherMode()) {
        const platform = !$("platformInput").classList.contains("hidden") ? $("platformInput").value.trim() : $("platformSelect").value;
        if (!platform) return alert("請選擇或輸入上課平台。");
        eventData = {
            mode: "teacher",
            platform,
            fee: Number($("courseFee").value) || 0,
            student: $("studentName").value.trim() || "未填寫",
            start,
            end,
            content: $("courseContent").value.trim()
        };
    } else {
        const content = $("courseContent").value.trim();
        if (!content) return alert("請輸入內容。");
        const category = !$("categoryInput").classList.contains("hidden") ? $("categoryInput").value.trim() : $("categorySelect").value;
        const expenses = readExpenseRows();
        eventData = {
            mode: "general",
            category: category || "其他",
            platform: category || "其他",
            target: $("targetPerson").value.trim(),
            student: $("targetPerson").value.trim() || "未填寫",
            location: $("locationInput").value.trim(),
            expenses,
            fee: expenses.reduce((sum, exp) => sum + exp.amount, 0),
            start,
            end,
            content,
            note: $("noteInput").value.trim()
        };
    }

    if (editId) {
        const conflict = getConflictEvent(targetDate, start, end, editId);
        if (conflict) return alert(makeConflictMessage(conflict));
        const index = events.findIndex(item => item.id === editId);
        if (index !== -1) events[index] = { ...events[index], ...eventData };
    } else {
        const repeatDates = getRepeatDates(targetDate, $("repeatSelect").value);
        const conflicts = getRepeatConflicts(repeatDates, start, end);
        if (conflicts.length > 0) return alert(makeRepeatConflictMessage(conflicts));
        repeatDates.forEach(date => events.push({ id: makeId(), date, ...eventData }));
    }

    saveData();
    closeModal("addModal");
    renderCalendar();
    showToast(isTeacherMode() ? "課程已儲存。" : "行程已儲存。", false);
}

function validateTimeRange(start, end) {
    if (!isTeacherMode() && !start && !end) return { valid: true };
    if (!isTeacherMode() && ((start && !end) || (!start && end))) return { valid: false, message: "如果要設定時間，開始與結束時間都需要填寫。" };
    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);
    if (startMinutes === null || endMinutes === null) return { valid: false, message: "時間格式不正確，請使用 09:00 這種格式。" };
    if (endMinutes <= startMinutes) return { valid: false, message: "結束時間必須晚於開始時間。" };
    return { valid: true };
}

function getConflictEvent(dateStr, start, end, editId) {
    if (!start || !end) return null;
    const newStart = timeToMinutes(start);
    const newEnd = timeToMinutes(end);
    return events.find(eventItem => {
        if (!eventBelongsToCurrentMode(eventItem)) return false;
        if (eventItem.date !== dateStr || !eventItem.start || !eventItem.end) return false;
        if (editId && eventItem.id === editId) return false;
        return newStart < timeToMinutes(eventItem.end) && newEnd > timeToMinutes(eventItem.start);
    });
}

function getRepeatConflicts(repeatDates, start, end) {
    if (!start || !end) return [];
    return repeatDates
        .map(date => getConflictEvent(date, start, end, null))
        .filter(Boolean);
}

function makeConflictMessage(conflict) {
    if (isTeacherMode()) return `此時段與 ${conflict.date} ${conflict.start}-${conflict.end} ${conflict.platform}（${conflict.student || "未填寫"}）課程重疊。`;
    return `此時段與 ${conflict.date} ${conflict.start}-${conflict.end}「${conflict.content || conflict.category}」行程重疊，請調整時間。`;
}

function makeRepeatConflictMessage(conflicts) {
    const label = isTeacherMode() ? "重複排課" : "重複行程";
    const rows = conflicts.slice(0, 5).map(conflict => {
        const title = isTeacherMode()
            ? `${conflict.platform}（${conflict.student || "未填寫"}）`
            : `「${conflict.content || conflict.category}」`;
        return `${conflict.date} ${conflict.start}-${conflict.end} ${title}`;
    });
    const extra = conflicts.length > 5 ? `\n另外還有 ${conflicts.length - 5} 筆衝突。` : "";
    return `${label}中有時段衝突，請調整時間或改成不重複：\n${rows.join("\n")}${extra}`;
}

function addExpenseRow(name = "", amount = "") {
    const row = document.createElement("div");
    row.className = "expense-row";
    row.innerHTML = `
        <input class="expense-name" type="text" placeholder="項目，例如：交通費" value="${escapeHtml(name)}">
        <input class="expense-amount" type="number" min="0" step="1" placeholder="金額" value="${amount || ""}">
        <button type="button" class="btn btn-cancel">刪除</button>
    `;
    row.querySelector("button").onclick = () => row.remove();
    $("expenseList").appendChild(row);
}

function clearExpenseRows() {
    $("expenseList").innerHTML = "";
}

function readExpenseRows() {
    return Array.from(document.querySelectorAll(".expense-row")).map(row => ({
        name: row.querySelector(".expense-name").value.trim() || "花費",
        amount: Number(row.querySelector(".expense-amount").value) || 0
    })).filter(exp => exp.amount > 0 || exp.name !== "花費");
}

function toggleInput(type) {
    if (type === "platform") {
        $("platformSelect").classList.toggle("hidden");
        $("platformInput").classList.toggle("hidden");
    } else if (type === "category") {
        $("categorySelect").classList.toggle("hidden");
        $("categoryInput").classList.toggle("hidden");
    } else {
        $("timeSelectGroup").classList.toggle("hidden");
        $("timeInputGroup").classList.toggle("hidden");
    }
}

function openDeleteModal(id, e) {
    if (e) e.stopPropagation();
    delTargetId = id;
    const target = events.find(item => item.id === id);
    if (target) {
        $("deleteTargetInfo").innerHTML = isTeacherMode() ? `
            <p><strong>日期：</strong>${target.date}</p>
            <p><strong>平台：</strong>${escapeHtml(target.platform)}</p>
            <p><strong>學生：</strong>${escapeHtml(target.student)}</p>
            <p><strong>時間：</strong>${hasTimeRange(target) ? getDisplayTimeRange(target) : "未設定"}</p>
            <p><strong>費用：</strong>${escapeHtml(settings.currency)} ${target.fee}</p>
        ` : `
            <p><strong>日期：</strong>${target.date}</p>
            <p><strong>分類：</strong>${escapeHtml(target.category)}</p>
            <p><strong>內容：</strong>${escapeHtml(target.content)}</p>
            <p><strong>時間：</strong>${hasTimeRange(target) ? getDisplayTimeRange(target) : "未設定"}</p>
            <p><strong>花費：</strong>${escapeHtml(settings.currency)} ${getGeneralExpenseTotal(target).toLocaleString()}</p>
        `;
    }
    $("deleteModal").style.display = "block";
}

function confirmDelete() {
    const target = events.find(item => item.id === delTargetId);
    if (!target) return;
    lastDeletedEvent = { ...target };
    events = events.filter(item => item.id !== delTargetId);
    saveData();
    closeModal("deleteModal");
    renderCalendar();
    showToast("已刪除。", true);
}

function undoDelete() {
    if (!lastDeletedEvent) return;
    events.push(lastDeletedEvent);
    events.sort((a, b) => `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`));
    saveData();
    renderCalendar();
    lastDeletedEvent = null;
    hideToast();
}

function openDetailModal() {
    updateDetailModal();
    $("detailModal").style.display = "block";
}

function updateDetailModal() {
    $("detailDateTitle").innerText = `${currentSelectedDate}（${getTimezoneLabelByValue(settings.displayTimeZone)}）`;
    const dayEvents = events.filter(item => item.date === currentSelectedDate && eventBelongsToCurrentMode(item)).filter(eventMatchesSearch).sort(compareEvents);
    $("detailList").innerHTML = dayEvents.length ? dayEvents.map(renderDetailEvent).join("") : '<p style="text-align:center;color:#999;padding:20px;">無行程</p>';
}

function renderDetailEvent(eventItem) {
    const title = isTeacherMode()
        ? `${hasTimeRange(eventItem) ? getDisplayTimeRange(eventItem) : "未設定時間"} ｜ ${escapeHtml(eventItem.platform)}${isEventCompleted(eventItem) ? "｜已完成" : ""}`
        : `${hasTimeRange(eventItem) ? getDisplayTimeRange(eventItem) : "未設定時間"} ｜ ${escapeHtml(eventItem.content)}${isEventCompleted(eventItem) ? "｜已完成" : ""}`;
    const body = isTeacherMode()
        ? `<small>學生：${escapeHtml(eventItem.student)} ｜ 費用：${escapeHtml(settings.currency)} ${eventItem.fee}</small><br><p>${escapeHtml(eventItem.content || "")}</p>`
        : `<small>分類：${escapeHtml(eventItem.category)} ｜ 對象：${escapeHtml(eventItem.target || "未填寫")} ｜ 地點：${escapeHtml(eventItem.location || "未填寫")}</small><br>
           <small>花費：${escapeHtml(settings.currency)} ${getGeneralExpenseTotal(eventItem).toLocaleString()}</small>
           ${renderExpenseDetail(eventItem)}
           <p>${escapeHtml(eventItem.note || "")}</p>`;
    return `
        <div class="detail-event ${isEventCompleted(eventItem) ? "completed" : ""}">
            <div class="detail-actions">
                <button class="detail-action edit" onclick="openEditModal('${eventItem.id}')">編輯</button>
                <button class="detail-action delete" onclick="openDeleteModal('${eventItem.id}', event)">刪除</button>
            </div>
            <strong>${title}</strong><br>${body}
        </div>
    `;
}

function renderExpenseDetail(eventItem) {
    if (!eventItem.expenses || eventItem.expenses.length === 0) return "";
    return `<p style="font-size:13px;color:#666;margin:6px 0 0;">${eventItem.expenses.map(exp => `${escapeHtml(exp.name)}：${escapeHtml(settings.currency)} ${Number(exp.amount).toLocaleString()}`).join("、")}</p>`;
}

function updateFooterStats() {
    const year = Number(yearSelect.value);
    const month = Number(monthSelect.value);
    const now = new Date();
    const monthEvents = events.filter(item => {
        const [eventYear, eventMonth] = item.date.split("-").map(Number);
        return eventBelongsToCurrentMode(item) && eventYear === year && eventMonth === month + 1;
    });
    let totalMinutes = 0;
    let completedCount = 0;
    let moneyTotal = 0;
    monthEvents.forEach(item => {
        if (hasTimeRange(item)) {
            const duration = timeToMinutes(item.end) - timeToMinutes(item.start);
            if (duration > 0) totalMinutes += duration;
        }
        if (isEventCompleted(item)) completedCount += 1;
        moneyTotal += isTeacherMode() ? Number(item.fee || 0) : getGeneralExpenseTotal(item);
    });
    const completionRate = monthEvents.length === 0 ? 0 : Math.round((completedCount / monthEvents.length) * 100);
    $("monthCount").innerText = monthEvents.length;
    $("monthHours").innerText = Math.floor(totalMinutes / 60);
    $("monthCompletionRate").innerText = `${completionRate}%`;
    $("completionProgress").style.width = `${completionRate}%`;
    $("selectedDateLabel").innerText = currentSelectedDate === formatDate(now) ? "今日" : currentSelectedDate.slice(5);
    $("selectedDayCount").innerText = events.filter(item => eventBelongsToCurrentMode(item) && item.date === currentSelectedDate).length;
    $("estimatedIncome").innerText = moneyTotal.toLocaleString();
}

function exportToCalendar() {
    const year = Number(yearSelect.value);
    const month = Number(monthSelect.value);
    const monthEvents = events.filter(item => {
        const [eventYear, eventMonth] = item.date.split("-").map(Number);
        return eventBelongsToCurrentMode(item) && eventYear === year && eventMonth === month + 1;
    });
    if (monthEvents.length === 0) return alert("本月份沒有任何行程可供匯出。");
    const nowStamp = makeIcsUtcStamp(new Date());
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Schedule Management System//ZH", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];
    monthEvents.forEach(item => {
        lines.push("BEGIN:VEVENT");
        lines.push(`UID:${item.id}@schedule.local`);
        lines.push(`DTSTAMP:${nowStamp}`);
        if (hasTimeRange(item)) {
            lines.push(`DTSTART:${makeIcsUtcStamp(zonedTimeToUtc(item.date, item.start, settings.baseTimeZone))}`);
            lines.push(`DTEND:${makeIcsUtcStamp(zonedTimeToUtc(item.date, item.end, settings.baseTimeZone))}`);
        } else {
            const nextDay = new Date(`${item.date}T00:00:00`);
            nextDay.setDate(nextDay.getDate() + 1);
            lines.push(`DTSTART;VALUE=DATE:${item.date.replace(/-/g, "")}`);
            lines.push(`DTEND;VALUE=DATE:${formatDate(nextDay).replace(/-/g, "")}`);
        }
        lines.push(`SUMMARY:${escapeIcs(isTeacherMode() ? `[${item.platform}] ${item.student} 課程` : `[${item.category}] ${item.content}`)}`);
        lines.push(`DESCRIPTION:${escapeIcs(makeIcsDescription(item))}`);
        lines.push("END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    downloadBlob(new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" }), `${isTeacherMode() ? "課程行程表" : "個人行程表"}_${year}年_${month + 1}月.ics`);
}

function makeIcsDescription(item) {
    if (isTeacherMode()) {
        let description = `學生: ${item.student}\\n平台: ${item.platform}\\n費用: ${settings.currency} ${item.fee}`;
        if (item.content) description += `\\n課程內容: ${item.content.replace(/\n/g, "\\n")}`;
        return description;
    }
    const expenses = item.expenses?.map(exp => `${exp.name}: ${settings.currency} ${exp.amount}`).join("\\n") || "";
    return `分類: ${item.category}\\n對象: ${item.target || ""}\\n地點: ${item.location || ""}\\n內容: ${item.content}\\n花費: ${settings.currency} ${getGeneralExpenseTotal(item)}${expenses ? `\\n${expenses}` : ""}${item.note ? `\\n備註: ${item.note}` : ""}`;
}

function openScheduleImagePreview() {
    latestPreviewImage = createScheduleImageData();
    $("imagePreviewTitle").innerText = isTeacherMode() ? "課表圖片預覽" : "行程圖片預覽";
    $("schedulePreviewImage").src = latestPreviewImage.dataUrl;
    $("imagePreviewModal").style.display = "block";
}

function downloadPreviewImage() {
    if (!latestPreviewImage) latestPreviewImage = createScheduleImageData();
    const link = document.createElement("a");
    link.href = latestPreviewImage.dataUrl;
    link.download = latestPreviewImage.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportPublicScheduleData() {
    if (!isTeacherMode()) return alert("公開頁資料只支援教師排課模式。");
    const publicEvents = events
        .filter(item => (item.mode || "teacher") === "teacher" && item.start && item.end)
        .map(item => ({
            id: item.id,
            date: item.date,
            start: item.start,
            end: item.end,
            completed: Boolean(item.completed)
        }));
    const publicData = {
        version: 1,
        updatedAt: new Date().toISOString(),
        settings: {
            teacherName: settings.teacherName || "",
            showTeacherName: Boolean(settings.showTeacherName),
            baseTimeZone: settings.baseTimeZone,
            displayTimeZone: "UTC+08:00",
            customTimeZones: settings.customTimeZones || []
        },
        events: publicEvents
    };
    const js = `window.TEACHER_PUBLIC_SCHEDULE = ${JSON.stringify(publicData, null, 2)};\n`;
    downloadBlob(new Blob([js], { type: "text/javascript;charset=utf-8" }), "public-schedule-data.js");
    showToast(`公開頁資料已匯出 ${publicEvents.length} 筆，請用新下載的 public-schedule-data.js 覆蓋專案同名檔案後推送到 GitHub。`, false);
}

function createScheduleImageData() {
    const year = Number(yearSelect.value);
    const month = Number(monthSelect.value);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const weekCount = Math.ceil((firstDay + daysInMonth) / 7);
    const monthEventsByDate = {};
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        monthEventsByDate[dateStr] = events.filter(item => item.date === dateStr && eventBelongsToCurrentMode(item)).sort(compareEvents);
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const scale = 2;
    const width = 1400;
    const padding = 48;
    const titleHeight = 140;
    const weekdayHeight = 52;
    const footerHeight = 56;
    const cellWidth = (width - padding * 2) / 7;
    const baseCellHeight = isTeacherMode() ? 120 : 132;
    const itemHeight = isTeacherMode() ? 30 : 42;
    const rowHeights = [];
    for (let week = 0; week < weekCount; week++) {
        let maxItems = 0;
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const dayNum = week * 7 + dayIndex - firstDay + 1;
            if (dayNum >= 1 && dayNum <= daysInMonth) {
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                maxItems = Math.max(maxItems, monthEventsByDate[dateStr].length);
            }
        }
        rowHeights.push(Math.max(baseCellHeight, 74 + maxItems * itemHeight));
    }
    const height = padding + titleHeight + weekdayHeight + rowHeights.reduce((sum, h) => sum + h, 0) + footerHeight;
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = isTeacherMode() ? "#254b84" : "#0f766e";
    ctx.fillRect(0, 0, width, titleHeight + padding);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 40px Microsoft JhengHei, Arial";
    ctx.fillText(isTeacherMode() ? `${year} 年 ${month + 1} 月不可預約的時間` : `${year} 年 ${month + 1} 月行程表`, padding, 76);
    ctx.font = "22px Microsoft JhengHei, Arial";
    ctx.fillText(`時區：${getTimezoneLabelByValue(settings.displayTimeZone)}`, padding, 112);
    ctx.fillText(`最後更新：${formatDisplayDateTime(new Date())}`, padding, 146);
    if (settings.showTeacherName && settings.teacherName) {
        ctx.textAlign = "right";
        ctx.fillText(`${isTeacherMode() ? "教師" : "名稱"}：${settings.teacherName}`, width - padding, 112);
        ctx.textAlign = "left";
    }
    const startY = padding + titleHeight;
    const weekdays = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
    ctx.fillStyle = "#f4f7fb";
    ctx.fillRect(padding, startY, width - padding * 2, weekdayHeight);
    ctx.strokeStyle = "#d8dee9";
    weekdays.forEach((day, index) => {
        const x = padding + index * cellWidth;
        ctx.strokeRect(x, startY, cellWidth, weekdayHeight);
        ctx.fillStyle = index === 0 ? "#d64545" : index === 6 ? "#2f80ed" : "#243447";
        ctx.font = "bold 22px Microsoft JhengHei, Arial";
        ctx.textAlign = "center";
        ctx.fillText(day, x + cellWidth / 2, startY + 34);
    });
    ctx.textAlign = "left";
    let y = startY + weekdayHeight;
    for (let week = 0; week < weekCount; week++) {
        const rowHeight = rowHeights[week];
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const dayNum = week * 7 + dayIndex - firstDay + 1;
            const x = padding + dayIndex * cellWidth;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(x, y, cellWidth, rowHeight);
            ctx.strokeStyle = "#d8dee9";
            ctx.strokeRect(x, y, cellWidth, rowHeight);
            if (dayNum < 1 || dayNum > daysInMonth) {
                ctx.fillStyle = "#f8fafc";
                ctx.fillRect(x + 1, y + 1, cellWidth - 2, rowHeight - 2);
                continue;
            }
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
            const dayEvents = monthEventsByDate[dateStr];
            ctx.fillStyle = "#263238";
            ctx.font = "bold 24px Microsoft JhengHei, Arial";
            ctx.fillText(String(dayNum), x + 16, y + 34);
            if (dayEvents.length === 0) {
                ctx.fillStyle = "#a0a7b4";
                ctx.font = "18px Microsoft JhengHei, Arial";
                ctx.fillText("無", x + 16, y + 68);
            } else {
                dayEvents.forEach((eventItem, eventIndex) => {
                    const itemY = y + 52 + eventIndex * itemHeight;
                    ctx.fillStyle = isEventCompleted(eventItem) ? "#eef1f4" : "#e9f3ff";
                    roundRect(ctx, x + 14, itemY, cellWidth - 28, itemHeight - 6, 8, true, false);
                    ctx.fillStyle = isEventCompleted(eventItem) ? "#697386" : "#1f5f99";
                    if (isTeacherMode()) {
                        ctx.font = "bold 17px Microsoft JhengHei, Arial";
                        drawClippedText(ctx, getDisplayTimeRange(eventItem), x + 26, itemY + 17, cellWidth - 52);
                    } else {
                        ctx.font = "bold 15px Microsoft JhengHei, Arial";
                        drawClippedText(ctx, hasTimeRange(eventItem) ? getDisplayTimeRange(eventItem) : "未設定時間", x + 26, itemY + 18, cellWidth - 52);
                        ctx.font = "13px Microsoft JhengHei, Arial";
                        ctx.fillStyle = "#334155";
                        drawClippedText(ctx, eventItem.content || "未填寫內容", x + 26, itemY + 34, cellWidth - 52);
                    }
                });
            }
        }
        y += rowHeight;
    }
    ctx.fillStyle = "#667085";
    ctx.font = "18px Microsoft JhengHei, Arial";
    ctx.textAlign = "center";
    ctx.fillText(isTeacherMode() ? "圖片僅顯示不可預約的時間；其他時段請再與老師確認。" : "圖片顯示本月行程時間與內容。", width / 2, height - 20);
    return {
        dataUrl: canvas.toDataURL("image/png"),
        fileName: `${settings.teacherName || "schedule"}_${year}年${month + 1}月${isTeacherMode() ? "不可預約時間" : "行程表"}.png`
    };
}

function exportBackup() {
    const backupData = { app: "Schedule Manager", version: 4, exportedAt: new Date().toISOString(), settings, events };
    const prefix = isTeacherMode() ? "teacher_schedule_backup" : "general_calendar_backup";
    downloadBlob(new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json;charset=utf-8" }), `${prefix}_${formatDate(new Date())}.json`);
}

function importBackup(e) {
    const file = e.target.files[0];
    if (!file) return;
    exportBackup();
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const parsed = JSON.parse(reader.result);
            const importedEvents = Array.isArray(parsed) ? parsed : parsed.events;
            if (!Array.isArray(importedEvents)) return alert("備份檔格式不正確，請選擇這個 APP 匯出的 JSON 檔。");
            if (!confirm("匯入後會覆蓋目前所有行程與設定。系統已先自動下載目前資料備份，確定要繼續嗎？")) return;
            events = normalizeEvents(importedEvents);
            if (parsed.settings) {
                settings = normalizeSettings({ ...defaultSettings, ...parsed.settings, hasCompletedOnboarding: true });
                saveSettings();
            }
            saveData();
            applySettingsToUI();
            renderCalendar();
            alert("備份匯入完成。");
        } catch (error) {
            alert("無法讀取備份檔，請確認檔案是 JSON 格式。");
        } finally {
            e.target.value = "";
        }
    };
    reader.readAsText(file, "utf-8");
}

function resetApp() {
    exportBackup();
    localStorage.removeItem(EVENTS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    events = [];
    settings = normalizeSettings({ ...defaultSettings });
    closeModal("resetConfirmModal");
    closeAllOptionalModals();
    saveData();
    applySettingsToUI();
    renderCalendar();
    openOnboarding();
}

function getRepeatDates(startDate, repeatMode) {
    const dates = [startDate];
    const start = new Date(`${startDate}T00:00:00`);
    if (repeatMode === "dailyWeek") {
        const daysUntilSunday = (7 - start.getDay()) % 7;
        for (let i = 1; i <= daysUntilSunday; i++) {
            const next = new Date(start);
            next.setDate(start.getDate() + i);
            dates.push(formatDate(next));
        }
    }
    if (repeatMode === "4") {
        for (let i = 1; i < 4; i++) {
            const next = new Date(start);
            next.setDate(start.getDate() + i * 7);
            dates.push(formatDate(next));
        }
    }
    if (repeatMode === "weekly8") {
        for (let i = 1; i < 8; i++) {
            const next = new Date(start);
            next.setDate(start.getDate() + i * 7);
            dates.push(formatDate(next));
        }
    }
    if (repeatMode === "month") {
        const baseMonth = start.getMonth();
        const next = new Date(start);
        next.setDate(next.getDate() + 7);
        while (next.getMonth() === baseMonth) {
            dates.push(formatDate(next));
            next.setDate(next.getDate() + 7);
        }
    }
    if (repeatMode === "nextMonth") {
        const endOfNextMonth = new Date(start.getFullYear(), start.getMonth() + 2, 0);
        const next = new Date(start);
        next.setDate(next.getDate() + 7);
        while (next <= endOfNextMonth) {
            dates.push(formatDate(next));
            next.setDate(next.getDate() + 7);
        }
    }
    return dates;
}

function goToday() {
    const now = new Date();
    yearSelect.value = now.getFullYear();
    monthSelect.value = now.getMonth();
    currentSelectedDate = formatDate(now);
    renderCalendar();
}

function changeMonth(offset) {
    let year = Number(yearSelect.value);
    let month = Number(monthSelect.value) + offset;
    if (month < 0) { month = 11; year -= 1; }
    if (month > 11) { month = 0; year += 1; }
    ensureYearOption(year);
    yearSelect.value = year;
    monthSelect.value = month;
    const selectedDay = new Date(`${currentSelectedDate}T00:00:00`).getDate();
    const safeDay = Math.min(selectedDay, new Date(year, month + 1, 0).getDate());
    currentSelectedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(safeDay).padStart(2, "0")}`;
    renderCalendar();
}

function changeDate(offset) {
    const date = new Date(`${currentSelectedDate}T00:00:00`);
    date.setDate(date.getDate() + offset);
    currentSelectedDate = formatDate(date);
    ensureYearOption(date.getFullYear());
    yearSelect.value = date.getFullYear();
    monthSelect.value = date.getMonth();
    renderCalendar();
    if ($("detailModal").style.display === "block") updateDetailModal();
}

function ensureYearOption(year) {
    if (Array.from(yearSelect.options).some(option => Number(option.value) === year)) return;
    yearSelect.add(new Option(`${year}年`, year));
    Array.from(yearSelect.options).sort((a, b) => Number(a.value) - Number(b.value)).forEach(option => yearSelect.add(option));
}

function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function saveData() {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

function closeModal(id) {
    if (id === "onboardingModal" && !settings.hasCompletedOnboarding) return;
    $(id).style.display = "none";
}

function closeAllOptionalModals() {
    ["settingsModal", "detailModal", "addModal", "deleteModal", "imagePreviewModal"].forEach(id => {
        const modal = $(id);
        if (modal) modal.style.display = "none";
    });
}

function showToast(message, canUndo) {
    clearTimeout(toastTimer);
    $("toastText").innerText = message;
    $("undoDeleteBtn").classList.toggle("hidden", !canUndo);
    $("toast").classList.remove("hidden");
    toastTimer = setTimeout(() => {
        lastDeletedEvent = null;
        hideToast();
    }, 7000);
}

function hideToast() {
    clearTimeout(toastTimer);
    $("toast").classList.add("hidden");
    $("undoDeleteBtn").classList.add("hidden");
}

function hasTimeRange(eventItem) {
    return Boolean(eventItem.start && eventItem.end);
}

function getEventEndUtc(eventItem) {
    if (!hasTimeRange(eventItem)) return new Date(`${eventItem.date}T23:59:59`);
    return zonedTimeToUtc(eventItem.date, eventItem.end, settings.baseTimeZone);
}

function isEventCompleted(eventItem) {
    return getEventEndUtc(eventItem) < new Date();
}

function isDayCompleted(dayEvents) {
    return dayEvents.length > 0 && dayEvents.every(isEventCompleted);
}

function getDisplayTimeRange(eventItem) {
    if (!hasTimeRange(eventItem)) return "未設定時間";
    const startUtc = zonedTimeToUtc(eventItem.date, eventItem.start, settings.baseTimeZone);
    const endUtc = zonedTimeToUtc(eventItem.date, eventItem.end, settings.baseTimeZone);
    const start = getDisplayTimeInfo(eventItem.date, startUtc, settings.displayTimeZone);
    const end = getDisplayTimeInfo(eventItem.date, endUtc, settings.displayTimeZone);

    if (start.useExtended && end.useExtended) {
        return `${start.extendedTime}-${end.extendedTime}`;
    }

    if (start.dateLabel === end.dateLabel) {
        return `${start.dateLabel} ${start.time}-${end.time}`;
    }

    return `${start.fullLabel}-${end.fullLabel}`;
}

function getGeneralExpenseTotal(eventItem) {
    if (Array.isArray(eventItem.expenses) && eventItem.expenses.length) return eventItem.expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
    return Number(eventItem.fee) || 0;
}

function getSearchKeyword() {
    return searchInput.value.trim().toLowerCase();
}

function ensureTimeOptionExists(selectId, timeValue) {
    if (!timeValue) return;
    const select = $(selectId);
    if (!Array.from(select.options).some(option => option.value === timeValue)) select.add(new Option(timeValue, timeValue));
}

function addMinutesToTime(timeStr, minutes) {
    const total = timeToMinutes(timeStr);
    if (total === null) return timeStr;
    const next = Math.min(total + minutes, EXTENDED_TIME_MAX_MINUTES);
    return formatExtendedTime(next);
}

function timeToMinutes(timeStr) {
    if (!timeStr || !timeStr.includes(":")) return null;
    const [hour, minute] = timeStr.split(":").map(Number);
    if (Number.isNaN(hour) || Number.isNaN(minute) || hour < 0 || minute < 0 || minute > 59) return null;
    if (hour * 60 + minute > EXTENDED_TIME_MAX_MINUTES) return null;
    return hour * 60 + minute;
}

function formatDate(date) {
    const d = new Date(date);
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
}

function isFixedOffsetZone(timeZone) {
    return /^UTC[+-]\d{2}:\d{2}$/.test(timeZone);
}

function getOffsetMinutes(timeZone) {
    if (!isFixedOffsetZone(timeZone)) return 0;
    const sign = timeZone[3] === "+" ? 1 : -1;
    const [hour, minute] = timeZone.slice(4).split(":").map(Number);
    return sign * (hour * 60 + minute);
}

function getZonedParts(date, timeZone) {
    if (isFixedOffsetZone(timeZone)) {
        const shifted = new Date(date.getTime() + getOffsetMinutes(timeZone) * 60000);
        return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth() + 1, day: shifted.getUTCDate(), hour: shifted.getUTCHours(), minute: shifted.getUTCMinutes() };
    }
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(date);
    const map = {};
    parts.forEach(part => { if (part.type !== "literal") map[part.type] = Number(part.value); });
    return map;
}

function zonedTimeToUtc(dateStr, timeStr, timeZone) {
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hour, minute] = timeStr.split(":").map(Number);
    if (isFixedOffsetZone(timeZone)) return new Date(Date.UTC(year, month - 1, day, hour, minute) - getOffsetMinutes(timeZone) * 60000);
    const desired = Date.UTC(year, month - 1, day, hour, minute);
    let utc = new Date(desired);
    for (let i = 0; i < 3; i++) {
        const parts = getZonedParts(utc, timeZone);
        const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
        utc = new Date(utc.getTime() + desired - asUtc);
    }
    return utc;
}

function formatDateInZone(date, timeZone) {
    const part = getZonedParts(date, timeZone);
    return `${part.year}-${String(part.month).padStart(2, "0")}-${String(part.day).padStart(2, "0")}`;
}

function formatTimeInZone(date, timeZone) {
    const part = getZonedParts(date, timeZone);
    return `${String(part.hour).padStart(2, "0")}:${String(part.minute).padStart(2, "0")}`;
}

function getDisplayTimeInfo(baseDate, date, timeZone) {
    const part = getZonedParts(date, timeZone);
    const dateLabel = `${part.month}/${part.day}`;
    const time = `${String(part.hour).padStart(2, "0")}:${String(part.minute).padStart(2, "0")}`;
    const diff = getDateDiff(baseDate, `${part.year}-${String(part.month).padStart(2, "0")}-${String(part.day).padStart(2, "0")}`);
    const extendedMinutes = diff * 1440 + part.hour * 60 + part.minute;
    const useExtended = extendedMinutes >= 0 && extendedMinutes <= EXTENDED_TIME_MAX_MINUTES;

    return {
        dateLabel,
        time,
        fullLabel: `${dateLabel} ${time}`,
        useExtended,
        extendedTime: formatExtendedTime(extendedMinutes)
    };
}

function getDateDiff(baseDate, displayDate) {
    const base = new Date(`${baseDate}T00:00:00`);
    const display = new Date(`${displayDate}T00:00:00`);
    return Math.round((display - base) / 86400000);
}

function formatExtendedTime(totalMinutes) {
    return `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
}

function formatDisplayDateTime(date) {
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function getGmtLabelByValue(value) {
    return GMT_OFFSET_OPTIONS.find(option => option[0] === value)?.[1] || value.replace("UTC", "GMT");
}

function makeShortCode(text) {
    const english = String(text).replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase();
    return english || "TZ";
}

function getTimezoneLabelByValue(value) {
    return getAllTimeZones().find(zone => zone.value === value)?.label || value.replace("UTC", "GMT");
}

function getTimezoneShort(value) {
    return getAllTimeZones().find(zone => zone.value === value)?.short || value.replace("UTC", "GMT");
}

function getItemColor(item, index) {
    if (index >= 10) return "#7f8c8d";
    return item.color || PLATFORM_COLORS[index] || "#7f8c8d";
}

function getReadableTextColor(hex) {
    const color = String(hex || "#7f8c8d").replace("#", "");
    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#222222" : "#ffffff";
}

function downloadBlob(blob, fileName) {
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function makeIcsUtcStamp(date) {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcs(text) {
    return String(text || "").replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
}

function drawClippedText(ctx, text, x, y, maxWidth) {
    let output = String(text || "");
    while (output.length > 0 && ctx.measureText(output).width > maxWidth) output = output.slice(0, -1);
    ctx.fillText(output.length < String(text || "").length ? `${output.slice(0, -1)}…` : output, x, y);
}

function escapeHtml(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function makeId() {
    return Date.now().toString() + Math.random().toString(16).slice(2);
}

init();
