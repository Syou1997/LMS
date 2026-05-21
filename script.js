const EVENTS_KEY = "teacherEvents";
const SETTINGS_KEY = "teacherAppSettings";

const DEFAULT_TIMEZONES = [
    { value: "Asia/Taipei", label: "台北（GMT+8）", short: "TPE" },
    { value: "Asia/Tokyo", label: "東京（GMT+9）", short: "TYO" },
    { value: "Asia/Seoul", label: "首爾（GMT+9）", short: "SEL" },
    { value: "Asia/Shanghai", label: "上海（GMT+8）", short: "SHA" },
    { value: "Asia/Hong_Kong", label: "香港（GMT+8）", short: "HKG" },
    { value: "Asia/Singapore", label: "新加坡（GMT+8）", short: "SG" },
    { value: "Asia/Bangkok", label: "曼谷（GMT+7）", short: "BKK" },
    { value: "Asia/Ho_Chi_Minh", label: "胡志明市（GMT+7）", short: "SGN" },
    { value: "Asia/Jakarta", label: "雅加達（GMT+7）", short: "JKT" },
    { value: "Europe/London", label: "倫敦（GMT+0 / GMT+1）", short: "LDN" },
    { value: "Europe/Paris", label: "巴黎（GMT+1 / GMT+2）", short: "PAR" },
    { value: "Europe/Berlin", label: "柏林（GMT+1 / GMT+2）", short: "BER" },
    { value: "Europe/Rome", label: "羅馬（GMT+1 / GMT+2）", short: "ROM" },
    { value: "Europe/Madrid", label: "馬德里（GMT+1 / GMT+2）", short: "MAD" },
    { value: "America/Los_Angeles", label: "洛杉磯（GMT-8 / GMT-7）", short: "LA" },
    { value: "America/Vancouver", label: "溫哥華（GMT-8 / GMT-7）", short: "YVR" },
    { value: "America/New_York", label: "紐約（GMT-5 / GMT-4）", short: "NY" },
    { value: "America/Toronto", label: "多倫多（GMT-5 / GMT-4）", short: "TOR" },
    { value: "America/Chicago", label: "芝加哥（GMT-6 / GMT-5）", short: "CHI" },
    { value: "Pacific/Honolulu", label: "檀香山（GMT-10）", short: "HNL" },
    { value: "Australia/Sydney", label: "雪梨（GMT+10 / GMT+11）", short: "SYD" },
    { value: "Australia/Melbourne", label: "墨爾本（GMT+10 / GMT+11）", short: "MEL" },
    { value: "Pacific/Auckland", label: "奧克蘭（GMT+12 / GMT+13）", short: "AKL" }
];

const CUSTOM_TIMEZONE_OPTIONS = [
    "Asia/Taipei", "Asia/Tokyo", "Asia/Seoul", "Asia/Shanghai", "Asia/Hong_Kong", "Asia/Singapore",
    "Asia/Bangkok", "Asia/Ho_Chi_Minh", "Asia/Jakarta", "Asia/Kuala_Lumpur", "Asia/Manila",
    "Asia/Dubai", "Asia/Kolkata", "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Rome",
    "Europe/Madrid", "Europe/Amsterdam", "Europe/Zurich", "Europe/Vienna", "Europe/Prague",
    "America/Los_Angeles", "America/Vancouver", "America/New_York", "America/Toronto",
    "America/Chicago", "America/Denver", "America/Phoenix", "America/Mexico_City",
    "America/Sao_Paulo", "America/Argentina/Buenos_Aires", "Pacific/Honolulu",
    "Australia/Sydney", "Australia/Melbourne", "Australia/Brisbane", "Australia/Perth",
    "Pacific/Auckland"
];

const PLATFORM_COLORS = [
    "#f1c40f", "#e74c3c", "#8e44ad", "#27ae60", "#2980b9",
    "#00897b", "#d81b60", "#3949ab", "#795548", "#455a64"
];

const DEFAULT_PLATFORMS = [
    { name: "補習班", color: "#f1c40f", textColor: "#222222" },
    { name: "AmazingTalker", color: "#e74c3c", textColor: "#ffffff" },
    { name: "Preply", color: "#8e44ad", textColor: "#ffffff" },
    { name: "學校", color: "#27ae60", textColor: "#ffffff" },
    { name: "私人ZOOM", color: "#2980b9", textColor: "#ffffff" }
];

const defaultSettings = {
    hasCompletedOnboarding: false,
    teacherName: "",
    showTeacherName: true,
    baseTimeZone: "Asia/Taipei",
    displayTimeZone: "Asia/Taipei",
    customTimeZones: [],
    currency: "NT$",
    defaultDuration: 50,
    platforms: DEFAULT_PLATFORMS
};

let settings = normalizeSettings(loadSettings());
let events = JSON.parse(localStorage.getItem(EVENTS_KEY)) || [];
let currentSelectedDate = "";
let currentDisplayTimezone = settings.displayTimeZone;
let delTargetId = null;
let latestPreviewImage = null;
let lastDeletedEvent = null;
let toastTimer = null;
let onboardingStep = 1;
let setupPlatforms = clonePlatforms(settings.platforms);
let settingsPlatforms = clonePlatforms(settings.platforms);

const yearSelect = document.getElementById("yearSelect");
const monthSelect = document.getElementById("monthSelect");
const calendarGrid = document.getElementById("calendarGrid");
const timezoneSelect = document.getElementById("timezoneSelect");
const timezoneFlag = document.getElementById("timezoneFlag");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");

function init() {
    const now = new Date();
    currentSelectedDate = formatDate(now);

    populateCustomTimezoneSelectors();
    populateTimezoneSelects();
    populateYearMonth();
    fillTimeOptions();
    bindEvents();
    applySettingsToUI();
    renderCalendar();

    if (!settings.hasCompletedOnboarding) {
        openOnboarding();
    }
}

function loadSettings() {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null");
    return { ...defaultSettings, ...(saved || {}) };
}

function normalizeSettings(raw) {
    const normalized = { ...defaultSettings, ...raw };
    normalized.customTimeZones = Array.isArray(normalized.customTimeZones) ? normalized.customTimeZones : [];
    normalized.platforms = normalizePlatforms(normalized.platforms);
    return normalized;
}

function normalizePlatforms(platforms) {
    if (!Array.isArray(platforms) || platforms.length === 0) return clonePlatforms(DEFAULT_PLATFORMS);

    return platforms.map((platform, index) => {
        if (typeof platform === "string") {
            return {
                name: platform,
                color: PLATFORM_COLORS[index] || "#7f8c8d",
                textColor: index === 0 ? "#222222" : "#ffffff"
            };
        }

        return {
            name: platform.name || `平台 ${index + 1}`,
            color: platform.color || PLATFORM_COLORS[index] || "#7f8c8d",
            textColor: platform.textColor || getReadableTextColor(platform.color || PLATFORM_COLORS[index] || "#7f8c8d")
        };
    });
}

function clonePlatforms(platforms) {
    return platforms.map(platform => ({ ...platform }));
}

function saveSettingsObject() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function getAllTimeZones() {
    const merged = [...DEFAULT_TIMEZONES];

    settings.customTimeZones.forEach(custom => {
        if (!merged.some(tz => tz.value === custom.value && tz.label === custom.label)) {
            merged.push(custom);
        }
    });

    return merged;
}

function populateTimezoneSelects() {
    const ids = ["timezoneSelect", "setupBaseTimezone", "setupDisplayTimezone", "settingsBaseTimezone", "settingsDisplayTimezone"];
    const timeZones = getAllTimeZones();

    ids.forEach(id => {
        const select = document.getElementById(id);
        if (!select) return;

        const oldValue = select.value;
        select.innerHTML = "";
        timeZones.forEach(tz => select.add(new Option(tz.label, tz.value)));
        if (oldValue) select.value = oldValue;
    });
}

function populateCustomTimezoneSelectors() {
    ["setupCustomTimezoneValue", "settingsCustomTimezoneValue"].forEach(id => {
        const select = document.getElementById(id);
        if (!select) return;

        select.innerHTML = "";
        CUSTOM_TIMEZONE_OPTIONS.forEach(value => select.add(new Option(value, value)));
    });
}

function populateYearMonth() {
    const now = new Date();

    for (let i = now.getFullYear() - 5; i <= now.getFullYear() + 5; i++) {
        yearSelect.add(new Option(`${i}年`, i, false, i === now.getFullYear()));
    }

    for (let i = 0; i < 12; i++) {
        monthSelect.add(new Option(`${i + 1}月`, i, false, i === now.getMonth()));
    }
}

function bindEvents() {
    yearSelect.onchange = renderCalendar;
    monthSelect.onchange = renderCalendar;

    document.getElementById("prevMonthBtn").onclick = () => changeMonth(-1);
    document.getElementById("nextMonthBtn").onclick = () => changeMonth(1);
    document.getElementById("backToToday").onclick = goToday;
    document.getElementById("exportCalendarBtn").onclick = exportToGoogleCalendar;
    document.getElementById("exportImageBtn").onclick = openScheduleImagePreview;
    document.getElementById("downloadPreviewImageBtn").onclick = downloadPreviewImage;
    document.getElementById("backupBtn").onclick = exportBackup;
    document.getElementById("importBackupBtn").onclick = () => document.getElementById("importBackupInput").click();
    document.getElementById("importBackupInput").onchange = importBackup;
    document.getElementById("mobileAddBtn").onclick = () => openAddModal(currentSelectedDate);
    document.getElementById("undoDeleteBtn").onclick = undoDelete;
    document.getElementById("openSettingsBtn").onclick = openSettingsModal;
    document.getElementById("saveSettingsBtn").onclick = saveSettingsFromModal;
    document.getElementById("settingsResetBtn").onclick = openResetConfirmModal;
    document.getElementById("confirmResetBtn").onclick = resetApp;

    document.getElementById("setupPrevBtn").onclick = () => changeOnboardingStep(-1);
    document.getElementById("setupNextBtn").onclick = () => changeOnboardingStep(1);
    document.getElementById("setupFinishBtn").onclick = finishOnboarding;
    document.getElementById("setupAddPlatformBtn").onclick = () => addPlatform("setup");
    document.getElementById("settingsAddPlatformBtn").onclick = () => addPlatform("settings");
    document.getElementById("setupAddTimezoneBtn").onclick = () => addCustomTimezone("setup");
    document.getElementById("settingsAddTimezoneBtn").onclick = () => addCustomTimezone("settings");

    searchInput.addEventListener("input", function () {
        clearSearchBtn.classList.toggle("hidden", this.value.trim() === "");
        renderCalendar();
    });

    clearSearchBtn.onclick = function () {
        searchInput.value = "";
        clearSearchBtn.classList.add("hidden");
        renderCalendar();
    };

    document.addEventListener("keydown", function (e) {
        const tag = document.activeElement.tagName.toLowerCase();
        if (tag === "input" || tag === "textarea" || tag === "select") return;
        if (e.key === "ArrowLeft") changeMonth(-1);
        if (e.key === "ArrowRight") changeMonth(1);
    });

    timezoneSelect.onchange = function () {
        settings.displayTimeZone = this.value;
        currentDisplayTimezone = this.value;
        saveSettingsObject();
        applySettingsToUI();
        renderCalendar();

        if (document.getElementById("detailModal").style.display === "block") {
            updateDetailModal();
        }
    };

    document.getElementById("startTimeSelect").addEventListener("change", function () {
        const endVal = addMinutesToTime(this.value, Number(settings.defaultDuration) || 50);
        ensureTimeOptionExists("endTimeSelect", endVal);
        document.getElementById("endTimeSelect").value = endVal;
    });
}

function addCustomTimezone(type) {
    const nameInput = document.getElementById(type === "setup" ? "setupCustomTimezoneName" : "settingsCustomTimezoneName");
    const valueSelect = document.getElementById(type === "setup" ? "setupCustomTimezoneValue" : "settingsCustomTimezoneValue");
    const placeName = nameInput.value.trim();
    const value = valueSelect.value;

    if (!placeName) {
        alert("請輸入地點名稱。");
        return;
    }

    if (!isValidTimeZone(value)) {
        alert("這個時區無法被瀏覽器支援，請選擇其他時區。");
        return;
    }

    const short = makeShortCode(placeName);
    const label = `${placeName}（${value}）`;

    const exists = getAllTimeZones().some(tz => tz.value === value && tz.label === label);
    if (exists) {
        alert("這個自訂時區已經存在。");
        return;
    }

    settings.customTimeZones.push({ value, label, short });
    saveSettingsObject();
    populateTimezoneSelects();

    if (type === "setup") {
        document.getElementById("setupBaseTimezone").value = value;
        document.getElementById("setupDisplayTimezone").value = value;
    } else {
        document.getElementById("settingsBaseTimezone").value = value;
        document.getElementById("settingsDisplayTimezone").value = value;
    }

    nameInput.value = "";
    showToast("自訂時區已新增。", false);
}

function makeShortCode(text) {
    const english = String(text).replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase();
    return english || "TZ";
}

function isValidTimeZone(timeZone) {
    try {
        new Intl.DateTimeFormat("en-US", { timeZone }).format(new Date());
        return true;
    } catch {
        return false;
    }
}

function openResetConfirmModal() {
    document.getElementById("resetConfirmModal").style.display = "block";
}

function resetApp() {
    exportBackup();

    localStorage.removeItem(EVENTS_KEY);
    localStorage.removeItem(SETTINGS_KEY);

    events = [];
    settings = normalizeSettings({ ...defaultSettings });
    currentDisplayTimezone = settings.displayTimeZone;
    setupPlatforms = clonePlatforms(settings.platforms);
    settingsPlatforms = clonePlatforms(settings.platforms);
    latestPreviewImage = null;
    lastDeletedEvent = null;

    searchInput.value = "";
    clearSearchBtn.classList.add("hidden");

    closeModal("resetConfirmModal");
    closeAllOptionalModals();

    saveData();
    populateTimezoneSelects();
    applySettingsToUI();
    renderCalendar();
    openOnboarding();
    showToast("已初始化，並已自動下載備份。", false);
}

function closeAllOptionalModals() {
    ["settingsModal", "detailModal", "addModal", "deleteModal", "imagePreviewModal"].forEach(id => {
        const modal = document.getElementById(id);
        if (modal) modal.style.display = "none";
    });
}

function applySettingsToUI() {
    currentDisplayTimezone = settings.displayTimeZone;
    populateTimezoneSelects();
    timezoneSelect.value = settings.displayTimeZone;
    timezoneFlag.innerText = getTimezoneShort(settings.displayTimeZone);
    document.getElementById("currencyLabel").innerText = settings.currency || "";
    document.getElementById("brandTitle").innerText = settings.teacherName
        ? `${settings.teacherName} 的上課管理系統`
        : "教師上課管理系統";

    populatePlatformSelect();
}

function populatePlatformSelect() {
    const select = document.getElementById("platformSelect");
    select.innerHTML = "";

    const list = settings.platforms.length ? settings.platforms : [{ name: "其他", color: "#7f8c8d", textColor: "#ffffff" }];
    list.forEach(platform => select.add(new Option(platform.name, platform.name)));
}

function openOnboarding() {
    document.getElementById("setupTeacherName").value = settings.teacherName || "";
    document.getElementById("setupShowTeacherName").checked = settings.showTeacherName;
    document.getElementById("setupBaseTimezone").value = settings.baseTimeZone;
    document.getElementById("setupDisplayTimezone").value = settings.displayTimeZone;
    setupPlatforms = clonePlatforms(settings.platforms);

    renderPlatformList("setup");
    onboardingStep = 1;
    renderOnboardingStep();
    document.getElementById("onboardingModal").style.display = "block";
}

function renderOnboardingStep() {
    document.querySelectorAll(".onboarding-step").forEach(step => {
        step.classList.toggle("active", Number(step.dataset.step) === onboardingStep);
    });

    document.querySelectorAll(".step-dot").forEach((dot, index) => {
        dot.classList.toggle("active", index + 1 === onboardingStep);
    });

    document.getElementById("onboardingStepText").innerText = `${onboardingStep} / 4`;
    document.getElementById("setupPrevBtn").classList.toggle("hidden", onboardingStep === 1);
    document.getElementById("setupNextBtn").classList.toggle("hidden", onboardingStep === 4);
    document.getElementById("setupFinishBtn").classList.toggle("hidden", onboardingStep !== 4);

    if (onboardingStep === 4) renderSetupSummary();
}

function changeOnboardingStep(direction) {
    if (direction > 0 && !validateOnboardingStep()) return;

    onboardingStep += direction;
    onboardingStep = Math.max(1, Math.min(4, onboardingStep));
    renderOnboardingStep();
}

function validateOnboardingStep() {
    if (onboardingStep === 1 && !document.getElementById("setupTeacherName").value.trim()) {
        alert("請先輸入教師顯示名稱。");
        return false;
    }

    if (onboardingStep === 3 && setupPlatforms.length === 0) {
        alert("請至少新增一個上課平台。");
        return false;
    }

    return true;
}

function renderSetupSummary() {
    const name = document.getElementById("setupTeacherName").value.trim();
    const base = getTimezoneLabelByValue(document.getElementById("setupBaseTimezone").value);
    const display = getTimezoneLabelByValue(document.getElementById("setupDisplayTimezone").value);

    document.getElementById("setupSummary").innerHTML = `
        <strong>教師名稱：</strong>${escapeHtml(name)}<br>
        <strong>主要時區：</strong>${escapeHtml(base)}<br>
        <strong>顯示時區：</strong>${escapeHtml(display)}<br>
        <strong>平台：</strong>${setupPlatforms.map(p => escapeHtml(p.name)).join("、")}
    `;
}

function finishOnboarding() {
    if (!validateOnboardingStep()) return;

    settings = {
        ...settings,
        hasCompletedOnboarding: true,
        teacherName: document.getElementById("setupTeacherName").value.trim(),
        showTeacherName: document.getElementById("setupShowTeacherName").checked,
        baseTimeZone: document.getElementById("setupBaseTimezone").value,
        displayTimeZone: document.getElementById("setupDisplayTimezone").value,
        platforms: setupPlatforms.length ? clonePlatforms(setupPlatforms) : clonePlatforms(DEFAULT_PLATFORMS)
    };

    saveSettingsObject();
    closeModal("onboardingModal");
    applySettingsToUI();
    renderCalendar();
    showToast("設定完成，開始使用吧。", false);
}

function openSettingsModal() {
    document.getElementById("settingsTeacherName").value = settings.teacherName;
    document.getElementById("settingsShowTeacherName").checked = settings.showTeacherName;
    document.getElementById("settingsBaseTimezone").value = settings.baseTimeZone;
    document.getElementById("settingsDisplayTimezone").value = settings.displayTimeZone;
    document.getElementById("settingsCurrency").value = settings.currency;
    document.getElementById("settingsDefaultDuration").value = settings.defaultDuration;
    settingsPlatforms = clonePlatforms(settings.platforms);

    renderPlatformList("settings");
    document.getElementById("settingsModal").style.display = "block";
}

function saveSettingsFromModal() {
    const teacherName = document.getElementById("settingsTeacherName").value.trim();

    if (!teacherName) {
        alert("請輸入教師顯示名稱。");
        return;
    }

    const normalizedPlatforms = readSettingsPlatformRows();

    if (normalizedPlatforms.length === 0) {
        alert("請至少保留一個上課平台。");
        return;
    }

    const duplicate = findDuplicatePlatformName(normalizedPlatforms);
    if (duplicate) {
        alert(`平台名稱「${duplicate}」重複，請修正後再儲存。`);
        return;
    }

    settings.platforms.forEach((oldPlatform, index) => {
        const newPlatform = normalizedPlatforms[index];
        if (newPlatform && oldPlatform.name !== newPlatform.name) {
            events.forEach(eventItem => {
                if (eventItem.platform === oldPlatform.name) eventItem.platform = newPlatform.name;
            });
        }
    });

    settings = {
        ...settings,
        hasCompletedOnboarding: true,
        teacherName,
        showTeacherName: document.getElementById("settingsShowTeacherName").checked,
        baseTimeZone: document.getElementById("settingsBaseTimezone").value,
        displayTimeZone: document.getElementById("settingsDisplayTimezone").value,
        currency: document.getElementById("settingsCurrency").value.trim() || "",
        defaultDuration: Number(document.getElementById("settingsDefaultDuration").value) || 50,
        platforms: normalizedPlatforms
    };

    saveSettingsObject();
    saveData();
    closeModal("settingsModal");
    applySettingsToUI();
    renderCalendar();
    showToast("設定已儲存。", false);
}

function readSettingsPlatformRows() {
    return Array.from(document.querySelectorAll(".platform-edit-row")).map((row, index) => {
        const name = row.querySelector(".platform-name-input").value.trim();
        const color = row.querySelector(".platform-color-input").value;
        return {
            name,
            color,
            textColor: getReadableTextColor(color),
            lockedGray: index >= 10
        };
    }).filter(platform => platform.name);
}

function findDuplicatePlatformName(platforms) {
    const seen = new Set();

    for (const platform of platforms) {
        const key = platform.name.toLowerCase();
        if (seen.has(key)) return platform.name;
        seen.add(key);
    }

    return "";
}

function addPlatform(type) {
    const input = document.getElementById(type === "setup" ? "setupPlatformInput" : "settingsPlatformInput");
    const value = input.value.trim();

    if (!value) return;

    const list = type === "setup" ? setupPlatforms : settingsPlatforms;
    if (list.some(platform => platform.name.toLowerCase() === value.toLowerCase())) {
        alert("這個平台已經存在。");
        return;
    }

    const index = list.length;
    list.push({
        name: value,
        color: PLATFORM_COLORS[index] || "#7f8c8d",
        textColor: getReadableTextColor(PLATFORM_COLORS[index] || "#7f8c8d"),
        lockedGray: index >= 10
    });

    input.value = "";
    renderPlatformList(type);
}

function removePlatform(type, index) {
    if (type === "setup") setupPlatforms.splice(index, 1);
    else settingsPlatforms.splice(index, 1);

    renderPlatformList(type);
}

function renderPlatformList(type) {
    const container = document.getElementById(type === "setup" ? "setupPlatformList" : "settingsPlatformList");
    const list = type === "setup" ? setupPlatforms : settingsPlatforms;

    if (type === "setup") {
        container.innerHTML = list.map((item, index) => `
            <span class="platform-chip" style="--chip-color:${getPlatformColorByPlatform(item, index)}">
                ${escapeHtml(item.name)}
                <button type="button" onclick="removePlatform('${type}', ${index})">×</button>
            </span>
        `).join("");
        return;
    }

    container.innerHTML = list.map((item, index) => {
        const color = index >= 10 ? "#7f8c8d" : item.color;
        return `
            <div class="platform-edit-row">
                <input class="platform-name-input" type="text" value="${escapeHtml(item.name)}" placeholder="平台名稱">
                <input class="platform-color-input" type="color" value="${color}" ${index >= 10 ? "disabled" : ""}>
                <button type="button" class="btn btn-cancel" onclick="removePlatform('${type}', ${index})">刪除</button>
            </div>
        `;
    }).join("");
}

function getPlatformColorByPlatform(platform, index) {
    if (index >= 10) return "#7f8c8d";
    return platform.color || PLATFORM_COLORS[index] || "#7f8c8d";
}

function getReadableTextColor(hex) {
    const color = String(hex || "#7f8c8d").replace("#", "");
    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 150 ? "#222222" : "#ffffff";
}

function addMinutesToTime(timeStr, minutes) {
    const total = timeToMinutes(timeStr);
    if (total === null) return timeStr;
    const next = (total + minutes) % 1440;
    return `${String(Math.floor(next / 60)).padStart(2, "0")}:${String(next % 60).padStart(2, "0")}`;
}

function timeToMinutes(timeStr) {
    if (!timeStr || !timeStr.includes(":")) return null;
    const [h, m] = timeStr.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return null;
    return h * 60 + m;
}

function getZonedParts(date, timeZone) {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    }).formatToParts(date);

    const map = {};
    parts.forEach(part => {
        if (part.type !== "literal") map[part.type] = Number(part.value);
    });
    return map;
}

function zonedTimeToUtc(dateStr, timeStr, timeZone) {
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hour, minute] = timeStr.split(":").map(Number);
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
    const p = getZonedParts(date, timeZone);
    return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

function formatTimeInZone(date, timeZone) {
    const p = getZonedParts(date, timeZone);
    return `${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}`;
}

function getEventEndUtc(eventItem) {
    return zonedTimeToUtc(eventItem.date, eventItem.end, settings.baseTimeZone);
}

function isEventCompleted(eventItem) {
    return getEventEndUtc(eventItem) < new Date();
}

function isDayCompleted(dayEvents) {
    return dayEvents.length > 0 && dayEvents.every(isEventCompleted);
}

function getDisplayTimeRange(eventItem) {
    const startUtc = zonedTimeToUtc(eventItem.date, eventItem.start, settings.baseTimeZone);
    const endUtc = zonedTimeToUtc(eventItem.date, eventItem.end, settings.baseTimeZone);

    const startDate = formatDateInZone(startUtc, currentDisplayTimezone);
    const endDate = formatDateInZone(endUtc, currentDisplayTimezone);
    const startTime = formatTimeInZone(startUtc, currentDisplayTimezone);
    const endTime = formatTimeInZone(endUtc, currentDisplayTimezone);

    return `${startTime}${getDateOffsetMark(eventItem.date, startDate)}-${endTime}${getDateOffsetMark(eventItem.date, endDate)}`;
}

function getDateOffsetMark(baseDate, displayDate) {
    const base = new Date(`${baseDate}T00:00:00`);
    const display = new Date(`${displayDate}T00:00:00`);
    const diff = Math.round((display - base) / 86400000);
    if (diff > 0) return `+${diff}日`;
    if (diff < 0) return `${diff}日`;
    return "";
}

function getSearchKeyword() {
    return searchInput.value.trim().toLowerCase();
}

function eventMatchesSearch(eventItem) {
    const keyword = getSearchKeyword();
    if (!keyword) return true;

    return [eventItem.platform, eventItem.student, eventItem.content, eventItem.date, eventItem.start, eventItem.end]
        .some(value => String(value || "").toLowerCase().includes(keyword));
}

function getConflictEvent(dateStr, start, end, editId) {
    const newStart = timeToMinutes(start);
    const newEnd = timeToMinutes(end);

    return events.find(eventItem => {
        if (eventItem.date !== dateStr) return false;
        if (editId && eventItem.id === editId) return false;
        return newStart < timeToMinutes(eventItem.end) && newEnd > timeToMinutes(eventItem.start);
    });
}

function ensureTimeOptionExists(selectId, timeVal) {
    const select = document.getElementById(selectId);
    if (!Array.from(select.options).some(opt => opt.value === timeVal)) {
        select.add(new Option(timeVal, timeVal));
    }
}

function formatDate(date) {
    const d = new Date(date);
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
}

function fillTimeOptions() {
    const starts = document.getElementById("startTimeSelect");
    const ends = document.getElementById("endTimeSelect");
    let html = "";

    for (let h = 0; h < 24; h++) {
        for (const m of ["00", "30"]) {
            const t = `${String(h).padStart(2, "0")}:${m}`;
            html += `<option value="${t}">${t}</option>`;
        }
    }

    starts.innerHTML = html;
    ends.innerHTML = html;
}

function getPlatformConfig(name) {
    const index = settings.platforms.findIndex(platform => platform.name === name);
    if (index >= 0) {
        const platform = settings.platforms[index];
        return {
            color: index >= 10 ? "#7f8c8d" : platform.color,
            textColor: index >= 10 ? "#ffffff" : platform.textColor
        };
    }
    return { color: "#7f8c8d", textColor: "#ffffff" };
}

function renderCalendar() {
    calendarGrid.innerHTML = "";

    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = formatDate(new Date());

    for (let i = 0; i < firstDay; i++) {
        calendarGrid.appendChild(Object.assign(document.createElement("div"), { className: "day-cell empty" }));
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const cell = document.createElement("div");
        const allDayEvents = events.filter(e => e.date === dateStr).sort((a, b) => a.start.localeCompare(b.start));
        const visibleDayEvents = allDayEvents.filter(eventMatchesSearch);

        cell.className = `day-cell ${isDayCompleted(allDayEvents) ? "completed-day" : ""} ${dateStr === todayStr ? "is-today" : ""} ${dateStr === currentSelectedDate ? "selected" : ""}`;

        let cellHTML = `
            <div class="day-num-row">
                <span class="day-num">${d}</span>
                ${dateStr === todayStr ? '<span class="today-badge">今天</span>' : ""}
            </div>
            <div class="event-list-mini">`;

        visibleDayEvents.forEach(e => {
            const style = getPlatformConfig(e.platform);
            cellHTML += `
                <div class="event-tag-item ${isEventCompleted(e) ? "completed-event" : ""}" style="background:${style.color};color:${style.textColor};${style.textColor === "#222222" ? "text-shadow:none;" : ""}">
                    <span>${getDisplayTimeRange(e)}</span>
                    <div class="event-tag-actions">
                        <button class="event-action" onclick="openEditModal('${e.id}', event)" title="編輯">✎</button>
                        <button class="event-action" onclick="openDeleteModal('${e.id}', event)" title="刪除">×</button>
                    </div>
                </div>`;
        });

        if (getSearchKeyword() && allDayEvents.length > 0 && visibleDayEvents.length === 0) {
            cellHTML += `<div class="no-match-text">無符合結果</div>`;
        }

        cellHTML += "</div>";
        cell.innerHTML = cellHTML;

        cell.onclick = () => {
            currentSelectedDate = dateStr;
            renderCalendar();
        };

        cell.ondblclick = () => openAddModal(dateStr);
        calendarGrid.appendChild(cell);
    }

    updateFooterStats();
}

function toggleInput(type) {
    if (type === "platform") {
        document.getElementById("platformSelect").classList.toggle("hidden");
        document.getElementById("platformInput").classList.toggle("hidden");
    } else {
        document.getElementById("timeSelectGroup").classList.toggle("hidden");
        document.getElementById("timeInputGroup").classList.toggle("hidden");
    }
}

function openAddModal(dateStr) {
    currentSelectedDate = dateStr;
    populatePlatformSelect();
    document.getElementById("editEventId").value = "";
    document.getElementById("addModalDateTitle").innerText = `新增排課：${dateStr}`;
    document.getElementById("modalTimezoneHint").innerText = `（目前使用：${getTimezoneLabelByValue(settings.baseTimeZone)}）`;
    document.getElementById("scheduleForm").reset();
    document.getElementById("repeatSelect").disabled = false;
    document.getElementById("addModal").style.display = "block";
}

function openEditModal(id, e) {
    if (e) e.stopPropagation();

    const target = events.find(ev => ev.id === id);
    if (!target) return;

    populatePlatformSelect();

    document.getElementById("editEventId").value = id;
    document.getElementById("addModalDateTitle").innerText = `編輯課程：${target.date}`;
    document.getElementById("modalTimezoneHint").innerText = `（目前使用：${getTimezoneLabelByValue(settings.baseTimeZone)}）`;
    document.getElementById("repeatSelect").value = "none";
    document.getElementById("repeatSelect").disabled = true;

    const pSelect = document.getElementById("platformSelect");
    const options = Array.from(pSelect.options).map(o => o.value);

    if (options.includes(target.platform)) {
        pSelect.value = target.platform;
        pSelect.classList.remove("hidden");
        document.getElementById("platformInput").classList.add("hidden");
    } else {
        document.getElementById("platformInput").value = target.platform;
        document.getElementById("platformInput").classList.remove("hidden");
        pSelect.classList.add("hidden");
    }

    document.getElementById("courseFee").value = target.fee;
    document.getElementById("studentName").value = target.student;
    ensureTimeOptionExists("startTimeSelect", target.start);
    ensureTimeOptionExists("endTimeSelect", target.end);
    document.getElementById("startTimeSelect").value = target.start;
    document.getElementById("endTimeSelect").value = target.end;
    document.getElementById("courseContent").value = target.content || "";
    document.getElementById("addModal").style.display = "block";
}

function closeModal(id) {
    if (id === "onboardingModal" && !settings.hasCompletedOnboarding) return;
    document.getElementById(id).style.display = "none";
}

document.getElementById("scheduleForm").onsubmit = function (e) {
    e.preventDefault();

    const editId = document.getElementById("editEventId").value;
    const platform = !document.getElementById("platformInput").classList.contains("hidden")
        ? document.getElementById("platformInput").value.trim()
        : document.getElementById("platformSelect").value;

    const start = !document.getElementById("timeInputGroup").classList.contains("hidden")
        ? document.getElementById("startTimeInput").value.trim()
        : document.getElementById("startTimeSelect").value;

    const end = !document.getElementById("timeInputGroup").classList.contains("hidden")
        ? document.getElementById("endTimeInput").value.trim()
        : document.getElementById("endTimeSelect").value;

    if (!platform) {
        alert("請選擇或輸入上課平台。");
        return;
    }

    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);

    if (startMinutes === null || endMinutes === null) {
        alert("時間格式不正確，請使用 09:00 這種格式。");
        return;
    }

    if (endMinutes <= startMinutes) {
        alert("結束時間必須晚於開始時間。");
        return;
    }

    const targetDate = editId ? events.find(ev => ev.id === editId)?.date || currentSelectedDate : currentSelectedDate;

    const eventData = {
        platform,
        fee: parseFloat(document.getElementById("courseFee").value) || 0,
        student: document.getElementById("studentName").value || "未填寫",
        start,
        end,
        content: document.getElementById("courseContent").value || ""
    };

    if (editId) {
        const conflict = getConflictEvent(targetDate, start, end, editId);
        if (conflict) {
            alert(`此時段與 ${conflict.date} ${conflict.start}-${conflict.end} ${conflict.platform}（${conflict.student || "未填寫"}）課程重疊。`);
            return;
        }

        const index = events.findIndex(ev => ev.id === editId);
        if (index !== -1) events[index] = { ...events[index], ...eventData };
    } else {
        const repeatDates = getRepeatDates(targetDate, document.getElementById("repeatSelect").value);
        const conflict = repeatDates.map(date => getConflictEvent(date, start, end, null)).find(Boolean);

        if (conflict) {
            alert(`重複排課中有時段衝突：${conflict.date} ${conflict.start}-${conflict.end} ${conflict.platform}（${conflict.student || "未填寫"}）。請調整時間或改成只新增一天。`);
            return;
        }

        repeatDates.forEach(date => {
            events.push({
                id: Date.now().toString() + Math.random().toString(16).slice(2),
                date,
                ...eventData
            });
        });
    }

    saveData();
    closeModal("addModal");
    renderCalendar();
    showToast("課程已儲存。", false);
};

function getRepeatDates(startDate, repeatMode) {
    const dates = [startDate];
    const start = new Date(`${startDate}T00:00:00`);

    if (repeatMode === "4") {
        for (let i = 1; i < 4; i++) {
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

    return dates;
}

function openDeleteModal(id, e) {
    if (e) e.stopPropagation();

    delTargetId = id;
    const target = events.find(ev => ev.id === id);
    const infoBox = document.getElementById("deleteTargetInfo");

    if (target) {
        infoBox.innerHTML = `
            <p><strong>日期：</strong>${target.date}</p>
            <p><strong>平台：</strong>${escapeHtml(target.platform)}</p>
            <p><strong>學生：</strong>${escapeHtml(target.student)}</p>
            <p><strong>時間：</strong>${getDisplayTimeRange(target)}</p>
            <p><strong>費用：</strong>${escapeHtml(settings.currency)} ${target.fee}</p>
        `;
    }

    document.getElementById("deleteModal").style.display = "block";
}

document.getElementById("confirmDelBtn").onclick = () => {
    const target = events.find(e => e.id === delTargetId);
    if (!target) return;

    lastDeletedEvent = { ...target };
    events = events.filter(e => e.id !== delTargetId);

    saveData();
    closeModal("deleteModal");
    renderCalendar();
    showToast("已刪除課程。", true);
};

function undoDelete() {
    if (!lastDeletedEvent) return;

    events.push(lastDeletedEvent);
    events.sort((a, b) => `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`));
    saveData();
    renderCalendar();
    lastDeletedEvent = null;
    hideToast();
}

function showToast(message, canUndo) {
    clearTimeout(toastTimer);
    document.getElementById("toastText").innerText = message;
    document.getElementById("undoDeleteBtn").classList.toggle("hidden", !canUndo);
    document.getElementById("toast").classList.remove("hidden");

    toastTimer = setTimeout(() => {
        lastDeletedEvent = null;
        hideToast();
    }, 7000);
}

function hideToast() {
    document.getElementById("toast").classList.add("hidden");
    document.getElementById("undoDeleteBtn").classList.add("hidden");
}

function updateFooterStats() {
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    const now = new Date();

    const monthEvents = events.filter(e => {
        const [eventYear, eventMonth] = e.date.split("-").map(Number);
        return eventYear === year && eventMonth === month + 1;
    });

    let totalMinutes = 0;
    let completedCount = 0;
    let estimatedInc = 0;

    monthEvents.forEach(e => {
        const duration = timeToMinutes(e.end) - timeToMinutes(e.start);
        if (duration > 0) totalMinutes += duration;
        if (getEventEndUtc(e) < now) completedCount += 1;
        estimatedInc += e.fee || 0;
    });

    const completionRate = monthEvents.length === 0 ? 0 : Math.round((completedCount / monthEvents.length) * 100);

    document.getElementById("monthCount").innerText = monthEvents.length;
    document.getElementById("monthHours").innerText = Math.floor(totalMinutes / 60);
    document.getElementById("monthCompletionRate").innerText = `${completionRate}%`;
    document.getElementById("completionProgress").style.width = `${completionRate}%`;
    document.getElementById("selectedDateLabel").innerText = currentSelectedDate === formatDate(now) ? "今日" : currentSelectedDate.slice(5);
    document.getElementById("selectedDayCount").innerText = events.filter(e => e.date === currentSelectedDate).length;
    document.getElementById("estimatedIncome").innerText = estimatedInc.toLocaleString();
}

document.getElementById("showDayDetailBtn").onclick = () => {
    if (!currentSelectedDate) return;
    updateDetailModal();
    document.getElementById("detailModal").style.display = "block";
};

function updateDetailModal() {
    document.getElementById("detailDateTitle").innerText = `${currentSelectedDate}（${getTimezoneLabelByValue(currentDisplayTimezone)}）`;
    const list = document.getElementById("detailList");
    list.innerHTML = "";

    const dayEvents = events
        .filter(e => e.date === currentSelectedDate)
        .filter(eventMatchesSearch)
        .sort((a, b) => a.start.localeCompare(b.start));

    if (dayEvents.length === 0) {
        list.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">無行程</p>';
        return;
    }

    dayEvents.forEach(e => {
        list.innerHTML += `
            <div class="detail-event ${isEventCompleted(e) ? "completed" : ""}">
                <div class="detail-actions">
                    <button class="detail-action edit" onclick="openEditModal('${e.id}')">編輯</button>
                    <button class="detail-action delete" onclick="openDeleteModal('${e.id}', event)">刪除</button>
                </div>
                <strong>${getDisplayTimeRange(e)} ｜ ${escapeHtml(e.platform)}${isEventCompleted(e) ? "｜已完成" : ""}</strong><br>
                <small>學生：${escapeHtml(e.student)} ｜ 費用：${escapeHtml(settings.currency)} ${e.fee}</small><br>
                <p style="font-size:13px; color:#666; margin-top:5px;">${escapeHtml(e.content || "")}</p>
            </div>`;
    });
}

function saveData() {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

function goToday() {
    const now = new Date();
    yearSelect.value = now.getFullYear();
    monthSelect.value = now.getMonth();
    currentSelectedDate = formatDate(now);
    renderCalendar();
}

function changeMonth(offset) {
    let year = parseInt(yearSelect.value);
    let month = parseInt(monthSelect.value) + offset;

    if (month < 0) {
        month = 11;
        year -= 1;
    }

    if (month > 11) {
        month = 0;
        year += 1;
    }

    ensureYearOption(year);
    yearSelect.value = year;
    monthSelect.value = month;

    const selectedDay = new Date(`${currentSelectedDate}T00:00:00`).getDate();
    const daysInTargetMonth = new Date(year, month + 1, 0).getDate();
    const safeDay = Math.min(selectedDay, daysInTargetMonth);

    currentSelectedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(safeDay).padStart(2, "0")}`;
    renderCalendar();
}

function ensureYearOption(year) {
    const exists = Array.from(yearSelect.options).some(option => Number(option.value) === Number(year));

    if (!exists) {
        yearSelect.add(new Option(`${year}年`, year));
        Array.from(yearSelect.options)
            .sort((a, b) => Number(a.value) - Number(b.value))
            .forEach(option => yearSelect.add(option));
    }
}

function changeDate(offset) {
    const d = new Date(`${currentSelectedDate}T00:00:00`);
    d.setDate(d.getDate() + offset);

    currentSelectedDate = formatDate(d);
    ensureYearOption(d.getFullYear());
    yearSelect.value = d.getFullYear();
    monthSelect.value = d.getMonth();

    renderCalendar();

    if (document.getElementById("detailModal").style.display === "block") updateDetailModal();
}

function exportToGoogleCalendar() {
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    const monthEvents = events.filter(e => {
        const [eventYear, eventMonth] = e.date.split("-").map(Number);
        return eventYear === year && eventMonth === month + 1;
    });

    if (monthEvents.length === 0) {
        alert("本月份沒有任何排課行程可供匯出。");
        return;
    }

    const nowStamp = makeIcsUtcStamp(new Date());
    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Teacher Schedule Management System//ZH",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH"
    ];

    monthEvents.forEach(e => {
        const datePart = e.date.replace(/-/g, "");
        const startPart = e.start.replace(/:/g, "") + "00";
        const endPart = e.end.replace(/:/g, "") + "00";

        icsContent.push("BEGIN:VEVENT");
        icsContent.push(`UID:${e.id}@teacher-schedule.local`);
        icsContent.push(`DTSTAMP:${nowStamp}`);
        icsContent.push(`DTSTART;TZID=${settings.baseTimeZone}:${datePart}T${startPart}`);
        icsContent.push(`DTEND;TZID=${settings.baseTimeZone}:${datePart}T${endPart}`);
        icsContent.push(`SUMMARY:${escapeIcs(`[${e.platform}] ${e.student} 課程`)}`);

        let description = `學生: ${e.student}\\n平台: ${e.platform}\\n費用: ${settings.currency} ${e.fee}`;
        if (e.content) description += `\\n課程內容: ${e.content.replace(/\n/g, "\\n")}`;

        icsContent.push(`DESCRIPTION:${escapeIcs(description)}`);
        icsContent.push("END:VEVENT");
    });

    icsContent.push("END:VCALENDAR");
    downloadBlob(new Blob([icsContent.join("\r\n")], { type: "text/calendar;charset=utf-8" }), `課程行程表_${year}年_${month + 1}月.ics`);
}

function openScheduleImagePreview() {
    latestPreviewImage = createScheduleImageData();
    document.getElementById("schedulePreviewImage").src = latestPreviewImage.dataUrl;
    document.getElementById("imagePreviewModal").style.display = "block";
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

function createScheduleImageData() {
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const weekCount = Math.ceil((firstDay + daysInMonth) / 7);
    const monthEventsByDate = {};

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        monthEventsByDate[dateStr] = events.filter(e => e.date === dateStr).sort((a, b) => a.start.localeCompare(b.start));
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
    const baseCellHeight = 120;
    const itemHeight = 30;
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

    ctx.fillStyle = "#1e3c72";
    ctx.fillRect(0, 0, width, titleHeight + padding);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 40px Microsoft JhengHei, Arial";
    ctx.fillText(`${year} 年 ${month + 1} 月不可預約的時間`, padding, 76);

    ctx.font = "22px Microsoft JhengHei, Arial";
    ctx.fillText(`時區：${getTimezoneLabelByValue(currentDisplayTimezone)}`, padding, 112);
    ctx.fillText(`最後更新：${formatDisplayDateTime(new Date())}`, padding, 146);

    if (settings.showTeacherName && settings.teacherName) {
        ctx.textAlign = "right";
        ctx.fillText(`教師：${settings.teacherName}`, width - padding, 112);
        ctx.textAlign = "left";
    }

    const startY = padding + titleHeight;
    const weekdays = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];

    ctx.fillStyle = "#f4f7fb";
    ctx.fillRect(padding, startY, width - padding * 2, weekdayHeight);

    ctx.strokeStyle = "#d8dee9";
    ctx.lineWidth = 1;

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
                    roundRect(ctx, x + 14, itemY, cellWidth - 28, 24, 8, true, false);
                    ctx.fillStyle = isEventCompleted(eventItem) ? "#697386" : "#1f5f99";
                    ctx.font = "bold 17px Microsoft JhengHei, Arial";
                    ctx.fillText(getDisplayTimeRange(eventItem), x + 26, itemY + 17);
                });
            }
        }
        y += rowHeight;
    }

    ctx.fillStyle = "#667085";
    ctx.font = "18px Microsoft JhengHei, Arial";
    ctx.textAlign = "center";
    ctx.fillText("圖片僅顯示不可預約的時間；其他時段請再與老師確認。", width / 2, height - 20);

    return {
        dataUrl: canvas.toDataURL("image/png"),
        fileName: `${settings.teacherName || "teacher"}_${year}年${month + 1}月不可預約時間.png`
    };
}

function formatDisplayDateTime(date) {
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function exportBackup() {
    const backupData = {
        app: "Teacher Schedule",
        version: 3,
        exportedAt: new Date().toISOString(),
        settings,
        events
    };
    downloadBlob(new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json;charset=utf-8" }), `teacher_schedule_backup_${formatDate(new Date())}.json`);
}

function importBackup(e) {
    const file = e.target.files[0];
    if (!file) return;

    exportBackup();

    const reader = new FileReader();

    reader.onload = function () {
        try {
            const parsed = JSON.parse(reader.result);
            const importedEvents = Array.isArray(parsed) ? parsed : parsed.events;
            const importedSettings = parsed.settings;

            if (!Array.isArray(importedEvents)) {
                alert("備份檔格式不正確，請選擇這個 APP 匯出的 JSON 檔。");
                return;
            }

            const isValid = importedEvents.every(item => item && typeof item.date === "string" && typeof item.start === "string" && typeof item.end === "string");
            if (!isValid) {
                alert("備份檔內容不完整，無法匯入。");
                return;
            }

            if (!confirm("已先自動備份目前資料。匯入備份會取代目前所有排課資料，確定要匯入嗎？")) return;

            events = importedEvents.map(item => ({
                id: item.id || Date.now().toString() + Math.random().toString(16).slice(2),
                date: item.date,
                platform: item.platform || "未分類",
                fee: Number(item.fee) || 0,
                student: item.student || "未填寫",
                start: item.start,
                end: item.end,
                content: item.content || ""
            }));

            if (importedSettings) {
                settings = normalizeSettings({ ...defaultSettings, ...importedSettings, hasCompletedOnboarding: true });
                saveSettingsObject();
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
    return String(text || "")
        .replace(/\\/g, "\\\\")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;")
        .replace(/\n/g, "\\n");
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

function getTimezoneLabelByValue(value) {
    return getAllTimeZones().find(tz => tz.value === value)?.label || value;
}

function getTimezoneShort(value) {
    return getAllTimeZones().find(tz => tz.value === value)?.short || "TZ";
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

init();