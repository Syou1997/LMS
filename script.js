const EVENTS_KEY = "teacherEvents";
const SETTINGS_KEY = "teacherAppSettings";

const DEFAULT_TIMEZONES = [
    { value: "UTC+08:00", label: "台北（GMT+8）", short: "TPE" },
    { value: "UTC+09:00", label: "東京（GMT+9）", short: "TYO" },
    { value: "UTC-12:00", label: "貝克島（GMT-12）", short: "BIT" },
    { value: "UTC-11:00", label: "美屬薩摩亞（GMT-11）", short: "PPG" },
    { value: "UTC-10:00", label: "夏威夷（GMT-10）", short: "HNL" },
    { value: "UTC-09:00", label: "阿拉斯加（GMT-9）", short: "ANC" },
    { value: "UTC-08:00", label: "洛杉磯（GMT-8）", short: "LA" },
    { value: "UTC-07:00", label: "溫哥華（GMT-7）", short: "YVR" },
    { value: "UTC-06:00", label: "芝加哥（GMT-6）", short: "CHI" },
    { value: "UTC-05:00", label: "紐約（GMT-5）", short: "NY" },
    { value: "UTC-04:00", label: "聖地牙哥（GMT-4）", short: "SCL" },
    { value: "UTC-03:00", label: "布宜諾斯艾利斯（GMT-3）", short: "BUE" },
    { value: "UTC-02:00", label: "南喬治亞（GMT-2）", short: "GST" },
    { value: "UTC-01:00", label: "亞速群島（GMT-1）", short: "AZO" },
    { value: "UTC+00:00", label: "倫敦（GMT+0）", short: "LDN" },
    { value: "UTC+01:00", label: "巴黎（GMT+1）", short: "PAR" },
    { value: "UTC+02:00", label: "雅典（GMT+2）", short: "ATH" },
    { value: "UTC+03:00", label: "伊斯坦堡（GMT+3）", short: "IST" },
    { value: "UTC+04:00", label: "杜拜（GMT+4）", short: "DXB" },
    { value: "UTC+05:00", label: "塔什干（GMT+5）", short: "TAS" },
    { value: "UTC+06:00", label: "達卡（GMT+6）", short: "DAC" },
    { value: "UTC+07:00", label: "曼谷（GMT+7）", short: "BKK" },
    { value: "UTC+10:00", label: "雪梨（GMT+10）", short: "SYD" },
    { value: "UTC+11:00", label: "索羅門群島（GMT+11）", short: "SBT" },
    { value: "UTC+12:00", label: "奧克蘭（GMT+12）", short: "AKL" },
    { value: "UTC+13:00", label: "東加（GMT+13）", short: "TBU" },
    { value: "UTC+14:00", label: "基里巴斯（GMT+14）", short: "LINT" }
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
const TIMEZONE_NAME_TRANSLATIONS = {
    "台北": ["台北", "台北", "Taipei"], "東京": ["東京", "東京", "Tokyo"], "貝克島": ["貝克島", "ベーカー島", "Baker Island"],
    "美屬薩摩亞": ["美屬薩摩亞", "米領サモア", "American Samoa"], "夏威夷": ["夏威夷", "ハワイ", "Hawaii"],
    "阿拉斯加": ["阿拉斯加", "アラスカ", "Alaska"], "洛杉磯": ["洛杉磯", "ロサンゼルス", "Los Angeles"],
    "溫哥華": ["溫哥華", "バンクーバー", "Vancouver"], "芝加哥": ["芝加哥", "シカゴ", "Chicago"],
    "紐約": ["紐約", "ニューヨーク", "New York"], "聖地牙哥": ["聖地牙哥", "サンティアゴ", "Santiago"],
    "布宜諾斯艾利斯": ["布宜諾斯艾利斯", "ブエノスアイレス", "Buenos Aires"], "南喬治亞": ["南喬治亞", "サウスジョージア", "South Georgia"],
    "亞速群島": ["亞速群島", "アゾレス諸島", "Azores"], "倫敦": ["倫敦", "ロンドン", "London"],
    "巴黎": ["巴黎", "パリ", "Paris"], "雅典": ["雅典", "アテネ", "Athens"], "伊斯坦堡": ["伊斯坦堡", "イスタンブール", "Istanbul"],
    "杜拜": ["杜拜", "ドバイ", "Dubai"], "塔什干": ["塔什干", "タシケント", "Tashkent"], "達卡": ["達卡", "ダッカ", "Dhaka"],
    "曼谷": ["曼谷", "バンコク", "Bangkok"], "雪梨": ["雪梨", "シドニー", "Sydney"], "索羅門群島": ["索羅門群島", "ソロモン諸島", "Solomon Islands"],
    "奧克蘭": ["奧克蘭", "オークランド", "Auckland"], "東加": ["東加", "トンガ", "Tonga"], "基里巴斯": ["基里巴斯", "キリバス", "Kiribati"]
};

const PLATFORM_COLORS = ["#f1c40f", "#e74c3c", "#8e44ad", "#27ae60", "#2980b9", "#00897b", "#d81b60", "#3949ab", "#795548", "#455a64"];
const TIME_INPUT_MAX_MINUTES = 24 * 60;
const EXTENDED_TIME_MAX_MINUTES = 47 * 60 + 30;
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
    language: "zh-TW",
    appMode: "teacher",
    lastRegularAppMode: "teacher",
    teacherName: "",
    showTeacherName: true,
    baseTimeZone: "UTC+08:00",
    baseTimeZoneLabel: "台北（GMT+8）",
    displayTimeZone: "UTC+08:00",
    displayTimeZoneLabel: "台北（GMT+8）",
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
let customRepeatDates = [];
let pendingCustomRepeatDates = [];
let customRepeatCalendarYear = new Date().getFullYear();
let customRepeatCalendarMonth = new Date().getMonth();
let selectedEventId = "";
let dragState = null;

const $ = id => document.getElementById(id);
const yearSelect = $("yearSelect");
const monthSelect = $("monthSelect");
const calendarGrid = $("calendarGrid");
const searchInput = $("searchInput");
const clearSearchBtn = $("clearSearchBtn");
const t = value => window.trText ? window.trText(value, settings.language) : value;
const l = (zh, ja, en) => settings.language === "ja" ? ja : settings.language === "en" ? en : zh;

function init() {
    initializeI18n(() => settings.language);
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

function applyLanguage() {
    applyI18n();
    populateYearMonth(true);
    fillTimeOptions();
    applySettingsToUI();
    renderCalendar();
}

function loadSettings() {
    return { ...defaultSettings, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null") || {}) };
}

function normalizeSettings(raw) {
    const normalized = { ...defaultSettings, ...raw };
    normalized.language = ["zh-TW", "ja", "en"].includes(normalized.language) ? normalized.language : "zh-TW";
    normalized.appMode = ["teacher", "general", "combined"].includes(normalized.appMode) ? normalized.appMode : "teacher";
    normalized.lastRegularAppMode = ["teacher", "general"].includes(normalized.lastRegularAppMode) ? normalized.lastRegularAppMode : "teacher";
    if (normalized.appMode === "teacher" || normalized.appMode === "general") normalized.lastRegularAppMode = normalized.appMode;
    normalized.customTimeZones = Array.isArray(normalized.customTimeZones) ? normalized.customTimeZones : [];
    normalized.platforms = normalizeItems(normalized.platforms, DEFAULT_PLATFORMS);
    normalized.categories = normalizeItems(normalized.categories, DEFAULT_CATEGORIES);
    if (normalized.baseTimeZone === "Asia/Taipei") normalized.baseTimeZone = "UTC+08:00";
    if (normalized.displayTimeZone === "Asia/Taipei") normalized.displayTimeZone = "UTC+08:00";
    normalized.displayTimeZoneLabel = normalized.displayTimeZoneLabel || [...DEFAULT_TIMEZONES, ...normalized.customTimeZones].find(zone => zone.value === normalized.displayTimeZone)?.label || normalized.displayTimeZone.replace("UTC", "GMT");
    normalized.baseTimeZoneLabel = normalized.baseTimeZoneLabel || [...DEFAULT_TIMEZONES, ...normalized.customTimeZones].find(zone => zone.value === normalized.baseTimeZone)?.label || normalized.baseTimeZone.replace("UTC", "GMT");
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
    return settings.appMode === "teacher";
}

function isCombinedMode() {
    return settings.appMode === "combined";
}

function getRegularAppMode() {
    return ["teacher", "general"].includes(settings.lastRegularAppMode) ? settings.lastRegularAppMode : "teacher";
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
    $("statsFooter").ondblclick = event => {
        event.stopPropagation();
        toggleFooter();
    };
    document.addEventListener("dblclick", restoreFooterFromBottomEdge);
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
    $("setupLanguage").onchange = event => {
        settings.language = event.target.value;
        applyLanguage();
    };
    $("settingsLanguage").onchange = event => {
        settings.language = event.target.value;
        applyLanguage();
    };
    $("combinedViewToggle").onchange = toggleCombinedViewMode;
    $("addExpenseBtn").onclick = () => addExpenseRow();
    $("scheduleForm").onsubmit = submitScheduleForm;
    $("repeatSelect").onchange = handleRepeatModeChange;
    $("closeCustomRepeatBtn").onclick = cancelCustomRepeat;
    $("cancelCustomRepeatBtn").onclick = cancelCustomRepeat;
    $("confirmCustomRepeatBtn").onclick = confirmCustomRepeat;
    $("customRepeatPrevMonthBtn").onclick = () => changeCustomRepeatMonth(-1);
    $("customRepeatNextMonthBtn").onclick = () => changeCustomRepeatMonth(1);
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
        const selectedTimeZone = readTimezoneSelection("timezoneSelect");
        settings.displayTimeZone = selectedTimeZone.value;
        settings.displayTimeZoneLabel = selectedTimeZone.label;
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
    $("copyTargetDate").onchange = () => {
        if (!$("copyTargetDate").value) return;
        currentSelectedDate = $("copyTargetDate").value;
        updateCopyModalTitle();
    };
}

function toggleFooter() {
    const footer = $("statsFooter");
    const collapsed = footer.classList.toggle("collapsed");
    document.body.classList.toggle("footer-collapsed", collapsed);
}

function restoreFooterFromBottomEdge(event) {
    if (!document.body.classList.contains("footer-collapsed")) return;
    if (event.clientY < window.innerHeight - 88) return;
    toggleFooter();
}

function toggleCombinedViewMode() {
    if ($("combinedViewToggle").checked) {
        if (!isCombinedMode()) settings.lastRegularAppMode = settings.appMode;
        settings.appMode = "combined";
    } else {
        settings.appMode = getRegularAppMode();
    }
    saveSettings();
    fillTimeOptions();
    applySettingsToUI();
    renderCalendar();
}

function applySettingsToUI() {
    document.body.classList.toggle("mode-general", settings.appMode === "general");
    document.body.classList.toggle("mode-teacher", isTeacherMode());
    document.body.classList.toggle("mode-combined", isCombinedMode());
    populateTimezoneSelects();
    setTimezoneSelectValue("timezoneSelect", settings.displayTimeZone, settings.displayTimeZoneLabel);
    $("timezoneFlag").innerText = getTimezoneShort(settings.displayTimeZone, settings.displayTimeZoneLabel);
    $("combinedViewToggle").checked = isCombinedMode();
    $("currencyLabel").innerText = settings.currency || "";
    $("modePill").innerText = isCombinedMode() ? t("綜合日曆") : isTeacherMode() ? t("教師排課模式") : t("一般行事曆模式");
    $("brandTitle").innerText = settings.teacherName
        ? `${settings.teacherName} ${settings.language === "en" ? "· " : "的"}${isCombinedMode() ? t("綜合日曆") : isTeacherMode() ? (settings.language === "ja" ? "レッスン管理" : settings.language === "en" ? "Lesson Manager" : "上課管理系統") : (settings.language === "ja" ? "予定表" : settings.language === "en" ? "Calendar" : "行事曆")}`
        : isCombinedMode() ? t("綜合日曆") : isTeacherMode() ? t("教師上課管理系統") : (settings.language === "ja" ? "個人カレンダー" : settings.language === "en" ? "Personal Calendar" : "個人行事曆");
    $("searchInput").placeholder = isCombinedMode()
        ? l("搜尋課程或行程內容", "レッスンや予定を検索", "Search lessons or events")
        : isTeacherMode() ? t("搜尋學生、平台或課程內容") : l("搜尋分類、對象、地點、內容或備註", "カテゴリー・相手・場所・内容・メモを検索", "Search categories, people, locations, details, or notes");
    $("exportImageBtn").innerText = isCombinedMode()
        ? (settings.language === "ja" ? "▣ 総合画像を出力" : settings.language === "en" ? "▣ Export combined image" : "▣ 匯出綜合圖片")
        : isTeacherMode() ? t("▣ 匯出課表圖片") : (settings.language === "ja" ? "▣ 予定画像を出力" : settings.language === "en" ? "▣ Export event image" : "▣ 匯出行程圖片");
    $("exportPublicPageBtn").classList.toggle("hidden", !isTeacherMode());
    ["exportCalendarBtn", "backupBtn", "importBackupBtn"].forEach(id => $(id).classList.toggle("hidden", isCombinedMode()));
    $("exportImageBtn").classList.remove("hidden");
    $("mobileAddBtn").classList.toggle("hidden", isCombinedMode());
    $("statsFooter").querySelector(".footer-container").classList.toggle("hidden", isCombinedMode());
    $("combinedFooterMessage").classList.toggle("hidden", !isCombinedMode());
    $("monthCountLabel").innerText = isTeacherMode() ? t("本月課程") : l("本月行程", "今月の予定", "Events this month");
    $("monthCountUnit").innerText = isTeacherMode() ? l("堂", "件", "lessons") : l("筆", "件", "events");
    $("monthHoursLabel").innerText = isTeacherMode() ? t("本月時數") : l("本月安排時數", "今月の予定時間", "Scheduled hours this month");
    $("selectedDayLabel").innerText = isTeacherMode() ? l("課堂", "レッスン", "lessons") : l("待辦事項", "予定", "events");
    $("selectedDayUnit").innerText = isTeacherMode() ? l("堂", "件", "lessons") : l("筆", "件", "events");
    $("moneyStatLabel").innerText = isTeacherMode() ? t("預計總收入") : l("目前本月總花費", "今月の支出", "Expenses this month");
    populateItemSelects();
}

function populateYearMonth(reset = false) {
    const now = new Date();
    const selectedYear = yearSelect.value || now.getFullYear();
    const selectedMonth = monthSelect.value || now.getMonth();
    if (reset) {
        yearSelect.innerHTML = "";
        monthSelect.innerHTML = "";
    }
    if (yearSelect.options.length || monthSelect.options.length) return;
    for (let y = now.getFullYear() - 5; y <= now.getFullYear() + 5; y++) {
        const label = settings.language === "en" ? String(y) : `${y}${settings.language === "ja" ? "年" : "年"}`;
        yearSelect.add(new Option(label, y, false, String(y) === String(selectedYear)));
    }
    for (let m = 0; m < 12; m++) {
        const label = settings.language === "en" ? new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(2020, m, 1)) : `${m + 1}月`;
        monthSelect.add(new Option(label, m, false, String(m) === String(selectedMonth)));
    }
}

function populateTimezoneSelects() {
    const ids = ["timezoneSelect", "setupBaseTimezone", "setupDisplayTimezone", "settingsBaseTimezone", "settingsDisplayTimezone"];
    const zones = getAllTimeZones();
    ids.forEach(id => {
        const select = $(id);
        if (!select) return;
        const oldValue = select.value;
        const oldLabel = select.selectedOptions[0]?.dataset.label;
        select.innerHTML = "";
        zones.forEach(zone => {
            const option = new Option(id === "timezoneSelect" ? getCompactTimezoneLabel(zone.label) : zone.label, zone.value);
            option.dataset.label = zone.label;
            select.add(option);
        });
        if (oldValue) setTimezoneSelectValue(id, oldValue, oldLabel);
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
    const zones = DEFAULT_TIMEZONES.map(zone => ({ ...zone, label: localizeTimezoneLabel(zone.label) }));
    settings.customTimeZones.forEach(zone => {
        if (!zones.some(item => item.label === zone.label && item.value === zone.value)) zones.push(zone);
    });
    return zones;
}

function localizeTimezoneLabel(label) {
    const match = String(label).match(/^(.*?)（(GMT[^）]+)）$/);
    if (!match) return label;
    const names = TIMEZONE_NAME_TRANSLATIONS[match[1]];
    if (!names) return label;
    const index = settings.language === "ja" ? 1 : settings.language === "en" ? 2 : 0;
    return `${names[index]}（${match[2]}）`;
}

function readTimezoneSelection(selectId) {
    const select = $(selectId);
    const option = select.selectedOptions[0];
    return {
        value: select.value,
        label: option?.dataset.label || option?.text || getTimezoneLabelByValue(select.value)
    };
}

function setTimezoneSelectValue(selectId, value, label) {
    const select = $(selectId);
    if (!select) return;
    const options = Array.from(select.options);
    const index = options.findIndex(option => option.value === value && (!label || option.dataset.label === label));
    select.selectedIndex = index >= 0 ? index : options.findIndex(option => option.value === value);
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
    setTimezoneSelectValue(type === "setup" ? "setupBaseTimezone" : "settingsBaseTimezone", valueSelect.value, label);
    setTimezoneSelectValue(type === "setup" ? "setupDisplayTimezone" : "settingsDisplayTimezone", valueSelect.value, label);
    nameInput.value = "";
}

function openOnboarding() {
    document.querySelector(`input[name='setupAppMode'][value='${settings.appMode}']`).checked = true;
    $("setupTeacherName").value = settings.teacherName || "";
    $("setupShowTeacherName").checked = settings.showTeacherName;
    $("setupLanguage").value = settings.language;
    setTimezoneSelectValue("setupBaseTimezone", settings.baseTimeZone, settings.baseTimeZoneLabel);
    setTimezoneSelectValue("setupDisplayTimezone", settings.displayTimeZone, settings.displayTimeZoneLabel);
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
    $("setupListTitle").innerText = teacher ? t("設定上課平台") : l("設定行程分類", "予定カテゴリーを設定", "Set event categories");
    $("setupListHelp").innerText = teacher ? t("前 10 個平台可以有不同顏色，第 11 個開始會統一灰色。") : l("可以先建立常用分類，之後也能在設定中新增。", "よく使うカテゴリーを作成できます。後から設定で追加できます。", "Create common categories now and add more later in Settings.");
    $("setupPlatformInput").placeholder = teacher ? l("輸入平台名稱", "プラットフォーム名", "Platform name") : l("輸入分類名稱", "カテゴリー名", "Category name");
    renderItemList("setup");
}

function renderOnboardingStep() {
    document.querySelectorAll(".onboarding-step").forEach(step => step.classList.toggle("active", Number(step.dataset.step) === onboardingStep));
    document.querySelectorAll(".step-dot").forEach((dot, index) => dot.classList.toggle("active", index + 1 === onboardingStep));
    $("onboardingStepText").innerText = `${onboardingStep} / 5`;
    $("setupPrevBtn").classList.toggle("hidden", onboardingStep === 1);
    $("setupNextBtn").classList.toggle("hidden", onboardingStep === 5);
    $("setupFinishBtn").classList.toggle("hidden", onboardingStep !== 5);
    if (onboardingStep === 5) renderSetupSummary();
}

function changeOnboardingStep(direction) {
    if (direction > 0 && !validateOnboardingStep()) return;
    onboardingStep = Math.max(1, Math.min(5, onboardingStep + direction));
    renderOnboardingStep();
}

function validateOnboardingStep() {
    if (onboardingStep === 2 && !$("setupTeacherName").value.trim()) return alert(t("enterDisplayName")), false;
    if (onboardingStep === 4 && setupItems.length === 0) return alert(getSetupMode() === "teacher" ? t("keepOnePlatform") : t("keepOneCategory")), false;
    return true;
}

function renderSetupSummary() {
    const mode = getSetupMode() === "teacher" ? "教師排課模式" : "一般行事曆模式";
    $("setupSummary").innerHTML = `
        <strong>使用模式：</strong>${mode}<br>
        <strong>顯示名稱：</strong>${escapeHtml($("setupTeacherName").value.trim())}<br>
        <strong>主要時區：</strong>${escapeHtml(readTimezoneSelection("setupBaseTimezone").label)}<br>
        <strong>顯示時區：</strong>${escapeHtml(readTimezoneSelection("setupDisplayTimezone").label)}<br>
        <strong>${getSetupMode() === "teacher" ? "平台" : "分類"}：</strong>${setupItems.map(item => escapeHtml(item.name)).join("、")}
    `;
}

function finishOnboarding() {
    if (!validateOnboardingStep()) return;
    const appMode = getSetupMode();
    const selectedBaseTimeZone = readTimezoneSelection("setupBaseTimezone");
    const selectedDisplayTimeZone = readTimezoneSelection("setupDisplayTimezone");
    settings = {
        ...settings,
        hasCompletedOnboarding: true,
        language: $("setupLanguage").value,
        appMode,
        teacherName: $("setupTeacherName").value.trim(),
        showTeacherName: $("setupShowTeacherName").checked,
        baseTimeZone: selectedBaseTimeZone.value,
        baseTimeZoneLabel: selectedBaseTimeZone.label,
        displayTimeZone: selectedDisplayTimeZone.value,
        displayTimeZoneLabel: selectedDisplayTimeZone.label,
        platforms: appMode === "teacher" ? cloneItems(setupItems) : settings.platforms,
        categories: appMode === "general" ? cloneItems(setupItems) : settings.categories
    };
    saveSettings();
    closeModal("onboardingModal");
    applyLanguage();
}

function openSettingsModal() {
    $("settingsAppMode").value = isCombinedMode() ? getRegularAppMode() : settings.appMode;
    $("settingsTeacherName").value = settings.teacherName;
    $("settingsShowTeacherName").checked = settings.showTeacherName;
    $("settingsLanguage").value = settings.language;
    setTimezoneSelectValue("settingsBaseTimezone", settings.baseTimeZone, settings.baseTimeZoneLabel);
    setTimezoneSelectValue("settingsDisplayTimezone", settings.displayTimeZone, settings.displayTimeZoneLabel);
    $("settingsCurrency").value = settings.currency;
    $("settingsDefaultDuration").value = settings.defaultDuration;
    syncSettingsModeUI();
    $("settingsModal").style.display = "block";
}

function syncSettingsModeUI() {
    const combined = isCombinedMode();
    const teacher = $("settingsAppMode").value !== "general";
    if (combined) {
        settingsItems = [];
        $("settingsListLabel").innerText = "平台與分類設定";
        $("settingsPlatformList").innerHTML = '<div class="settings-combined-note">綜合檢視模式僅供檢視。請切換至教師排課模式或一般行事曆模式後再修改平台與分類。</div>';
        $("settingsPlatformInput").placeholder = "綜合檢視模式無法修改";
        $("settingsItemHint").classList.add("hidden");
    } else {
        settingsItems = cloneItems(teacher ? settings.platforms : settings.categories);
        $("settingsListLabel").innerText = teacher ? "上課平台與顏色" : "行程分類與顏色";
        $("settingsPlatformInput").placeholder = teacher ? "新增平台名稱" : "新增分類名稱";
        $("settingsItemHint").classList.remove("hidden");
        renderItemList("settings");
    }
    $("settingsEditableFields").classList.toggle("settings-readonly", combined);
    $("settingsEditableFields").setAttribute("aria-disabled", String(combined));
    $("settingsEditableFields").querySelectorAll("input, select, button").forEach(element => {
        element.disabled = combined;
    });
}

function saveSettingsFromModal() {
    const selectedMode = $("settingsAppMode").value;
    const regularMode = ["teacher", "general"].includes(selectedMode) ? selectedMode : "teacher";
    const appMode = isCombinedMode() ? "combined" : regularMode;
    const teacherName = $("settingsTeacherName").value.trim();
    if (!teacherName) return alert("請輸入顯示名稱。");
    const editableMode = regularMode;
    const normalizedItems = appMode === "combined" ? [] : readSettingsItemRows();
    if (appMode === "combined") {
        const selectedBaseTimeZone = readTimezoneSelection("settingsBaseTimezone");
        const selectedDisplayTimeZone = readTimezoneSelection("settingsDisplayTimezone");
        settings = {
            ...settings,
            hasCompletedOnboarding: true,
            language: $("settingsLanguage").value,
            appMode,
            lastRegularAppMode: regularMode,
            teacherName,
            showTeacherName: $("settingsShowTeacherName").checked,
            baseTimeZone: selectedBaseTimeZone.value,
            baseTimeZoneLabel: selectedBaseTimeZone.label,
            displayTimeZone: selectedDisplayTimeZone.value,
            displayTimeZoneLabel: selectedDisplayTimeZone.label,
            currency: $("settingsCurrency").value.trim() || "",
            defaultDuration: Number($("settingsDefaultDuration").value) || 50
        };
        saveSettings();
        closeModal("settingsModal");
        applyLanguage();
        return;
    }
    if (normalizedItems.length === 0) return alert(editableMode === "teacher" ? "請至少保留一個上課平台。" : "請至少保留一個分類。");
    const duplicate = findDuplicateItemName(normalizedItems);
    if (duplicate) return alert(`名稱「${duplicate}」重複，請修正後再儲存。`);

    const oldItems = editableMode === "teacher" ? settings.platforms : settings.categories;
    oldItems.forEach((oldItem, index) => {
        const newItem = normalizedItems[index];
        if (!newItem || oldItem.name === newItem.name) return;
        events.forEach(eventItem => {
            if (editableMode === "teacher" && eventItem.platform === oldItem.name) eventItem.platform = newItem.name;
            if (editableMode === "general" && eventItem.category === oldItem.name) eventItem.category = newItem.name;
        });
    });

    const selectedBaseTimeZone = readTimezoneSelection("settingsBaseTimezone");
    const selectedDisplayTimeZone = readTimezoneSelection("settingsDisplayTimezone");
    settings = {
        ...settings,
        hasCompletedOnboarding: true,
        language: $("settingsLanguage").value,
        appMode,
        lastRegularAppMode: regularMode,
        teacherName,
        showTeacherName: $("settingsShowTeacherName").checked,
        baseTimeZone: selectedBaseTimeZone.value,
        baseTimeZoneLabel: selectedBaseTimeZone.label,
        displayTimeZone: selectedDisplayTimeZone.value,
        displayTimeZoneLabel: selectedDisplayTimeZone.label,
        currency: $("settingsCurrency").value.trim() || "",
        defaultDuration: Number($("settingsDefaultDuration").value) || 50,
        platforms: editableMode === "teacher" ? normalizedItems : settings.platforms,
        categories: editableMode === "general" ? normalizedItems : settings.categories
    };
    saveSettings();
    saveData();
    closeModal("settingsModal");
    applyLanguage();
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
    let startHtml = isTeacherMode() ? "" : '<option value="">不設定</option>';
    let endHtml = isTeacherMode() ? "" : '<option value="">不設定</option>';
    for (let h = 0; h <= 24; h++) {
        for (const m of ["00", "30"]) {
            if (h * 60 + Number(m) > TIME_INPUT_MAX_MINUTES) continue;
            const time = `${String(h).padStart(2, "0")}:${m}`;
            startHtml += `<option value="${time}">${time}</option>`;
            endHtml += `<option value="${time}">${time}</option>`;
        }
    }
    for (let h = 0; h <= 23; h++) {
        for (const m of ["00", "30"]) {
            const minutes = (24 + h) * 60 + Number(m);
            if (minutes <= TIME_INPUT_MAX_MINUTES || minutes > EXTENDED_TIME_MAX_MINUTES) continue;
            const value = formatExtendedTime(minutes);
            const label = `隔日 ${String(h).padStart(2, "0")}:${m}`;
            endHtml += `<option value="${value}">${label}</option>`;
        }
    }
    $("startTimeSelect").innerHTML = startHtml;
    $("endTimeSelect").innerHTML = endHtml;
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
        cell.dataset.date = dateStr;
        cell.innerHTML = `
            <div class="day-num-row">
                <span class="day-num">${d}</span>
                ${dateStr === todayStr ? `<span class="today-badge">${t("今天")}</span>` : ""}
            </div>
            <div class="event-list-mini">
                ${visibleDayEvents.map(renderMiniEvent).join("")}
                ${getSearchKeyword() && allDayEvents.length > 0 && visibleDayEvents.length === 0 ? `<div class="no-match-text">${t("無符合結果")}</div>` : ""}
            </div>
        `;
        cell.onclick = () => {
            if (dragState?.active) return;
            currentSelectedDate = dateStr;
            renderCalendar();
        };
        cell.querySelector(".day-num").onclick = event => {
            event.stopPropagation();
            currentSelectedDate = dateStr;
            renderCalendar();
            openDetailModal();
        };
        cell.querySelector(".day-num").ondblclick = event => event.stopPropagation();
        cell.ondblclick = () => {
            if (!isCombinedMode()) openAddModal(dateStr);
        };
        calendarGrid.appendChild(cell);
    }
    bindDesktopEventMoving();
    updateFooterStats();
}

function renderMiniEvent(eventItem) {
    const style = getEventStyle(eventItem);
    const actions = isCombinedMode() ? "" : `
                <button class="event-action" onclick="openEditModal('${eventItem.id}', event)" title="編輯">✎</button>
                <button class="event-action" onclick="openCopyModal('${eventItem.id}', event)" title="${t("複製")}">⧉</button>
                <button class="event-action" onclick="openDeleteModal('${eventItem.id}', event)" title="刪除">×</button>`;
    return `
        <div class="event-tag-item ${selectedEventId === eventItem.id ? "selected-event" : ""} ${isEventCompleted(eventItem) ? "completed-event" : ""}" data-event-id="${eventItem.id}" style="background:${style.color};color:${style.textColor};${style.textColor === "#222222" ? "text-shadow:none;" : ""}">
            <span>${escapeHtml(getMiniEventText(eventItem))}</span>
            <div class="event-tag-actions">
                ${actions}
            </div>
        </div>
    `;
}

function bindDesktopEventMoving() {
    document.querySelectorAll(".event-tag-item[data-event-id]").forEach(item => {
        item.onpointerdown = pointerEvent => {
            if (isCombinedMode() || pointerEvent.button !== 0 || pointerEvent.target.closest(".event-action")) return;
            pointerEvent.stopPropagation();
            const eventId = item.dataset.eventId;
            const startX = pointerEvent.clientX;
            const startY = pointerEvent.clientY;
            const timer = setTimeout(() => {
                const source = events.find(eventItem => eventItem.id === eventId);
                if (!source) return;
                selectedEventId = eventId;
                item.classList.add("selected-event", "drag-source");
                const ghost = item.cloneNode(true);
                ghost.classList.add("event-drag-ghost");
                ghost.querySelector(".event-tag-actions")?.remove();
                document.body.appendChild(ghost);
                dragState = { active: true, eventId, ghost, targetDate: "", startX, startY };
                positionDesktopDragGhost(pointerEvent.clientX, pointerEvent.clientY);
            }, 500);
            dragState = { active: false, eventId, timer, startX, startY };
        };
        item.onclick = clickEvent => {
            if (clickEvent.target.closest(".event-action") || dragState?.active) return;
            clickEvent.stopPropagation();
            selectedEventId = item.dataset.eventId;
            renderCalendar();
        };
    });

    document.onpointermove = pointerEvent => {
        if (!dragState) return;
        if (!dragState.active) {
            if (Math.hypot(pointerEvent.clientX - dragState.startX, pointerEvent.clientY - dragState.startY) > 8) {
                clearTimeout(dragState.timer);
                dragState = null;
            }
            return;
        }
        pointerEvent.preventDefault();
        positionDesktopDragGhost(pointerEvent.clientX, pointerEvent.clientY);
        document.querySelectorAll(".day-cell.drop-target").forEach(cell => cell.classList.remove("drop-target", "drop-conflict"));
        const targetCell = document.elementFromPoint(pointerEvent.clientX, pointerEvent.clientY)?.closest(".day-cell[data-date]");
        dragState.targetDate = targetCell?.dataset.date || "";
        if (!targetCell) return;
        const candidate = buildMovedDesktopEvent(dragState.eventId, dragState.targetDate);
        const conflict = candidate && getConflictEvent(candidate.date, candidate.start, candidate.end, candidate.id);
        targetCell.classList.add("drop-target");
        targetCell.classList.toggle("drop-conflict", Boolean(conflict));
    };

    document.onpointerup = () => {
        if (!dragState) return;
        clearTimeout(dragState.timer);
        const stateToFinish = dragState;
        dragState = null;
        document.querySelectorAll(".day-cell.drop-target").forEach(cell => cell.classList.remove("drop-target", "drop-conflict"));
        stateToFinish.ghost?.remove();
        if (!stateToFinish.active) return;
        if (!stateToFinish.targetDate) {
            renderCalendar();
            return;
        }
        moveDesktopEvent(stateToFinish.eventId, stateToFinish.targetDate);
    };
}

function positionDesktopDragGhost(x, y) {
    if (!dragState?.ghost) return;
    dragState.ghost.style.left = `${x + 12}px`;
    dragState.ghost.style.top = `${y + 12}px`;
}

function buildMovedDesktopEvent(eventId, targetDisplayDate) {
    const source = events.find(item => item.id === eventId);
    if (!source) return null;
    const sourceDisplayDate = source.start
        ? formatDateInZone(zonedTimeToUtc(source.date, source.start, settings.baseTimeZone), settings.displayTimeZone)
        : source.date;
    const dayOffset = getDateDiff(sourceDisplayDate, targetDisplayDate);
    const storedDate = formatDate(new Date(`${source.date}T00:00:00`).setDate(new Date(`${source.date}T00:00:00`).getDate() + dayOffset));
    return { ...source, date: storedDate };
}

function moveDesktopEvent(eventId, targetDisplayDate) {
    const candidate = buildMovedDesktopEvent(eventId, targetDisplayDate);
    if (!candidate) return;
    const conflict = getConflictEvent(candidate.date, candidate.start, candidate.end, candidate.id);
    if (conflict) {
        alert(makeConflictMessage(conflict));
        renderCalendar();
        return;
    }
    const index = events.findIndex(item => item.id === eventId);
    events[index] = candidate;
    currentSelectedDate = targetDisplayDate;
    selectedEventId = eventId;
    saveData();
    renderCalendar();
}

function eventBelongsToCurrentMode(eventItem) {
    return isCombinedMode() || (eventItem.mode || "teacher") === settings.appMode;
}

function isTeacherEvent(eventItem) {
    return (eventItem.mode || "teacher") === "teacher";
}

function compareEvents(a, b) {
    return `${a.start || "99:99"} ${a.content}`.localeCompare(`${b.start || "99:99"} ${b.content}`);
}

function getMiniEventText(eventItem) {
    if (isTeacherEvent(eventItem)) return getDisplayTimeRange(eventItem);
    return `${hasTimeRange(eventItem) ? getDisplayTimeRange(eventItem) : t("時間未定")}｜${eventItem.content || l("未命名行程", "名称未設定", "Untitled event")}`;
}

function getEventStyle(eventItem) {
    const teacherEvent = isTeacherEvent(eventItem);
    const list = teacherEvent ? settings.platforms : settings.categories;
    const name = teacherEvent ? eventItem.platform : eventItem.category;
    const index = list.findIndex(item => item.name === name);
    if (index < 0) return { color: "#7f8c8d", textColor: "#ffffff" };
    const color = getItemColor(list[index], index);
    return { color, textColor: getReadableTextColor(color) };
}

function eventMatchesSearch(eventItem) {
    const keyword = getSearchKeyword();
    if (!keyword) return true;
    const values = isCombinedMode()
        ? [eventItem.platform, eventItem.student, eventItem.category, eventItem.target, eventItem.location, eventItem.content, eventItem.note, eventItem.date, eventItem.start, eventItem.end]
        : isTeacherMode()
        ? [eventItem.platform, eventItem.student, eventItem.content, eventItem.note, eventItem.date, eventItem.start, eventItem.end]
        : [eventItem.category, eventItem.target, eventItem.location, eventItem.content, eventItem.note, eventItem.date, eventItem.start, eventItem.end];
    return values.some(value => String(value || "").toLowerCase().includes(keyword));
}

function openAddModal(dateStr) {
    if (isCombinedMode()) return;
    currentSelectedDate = dateStr;
    populateItemSelects();
    fillTimeOptions();
    $("scheduleForm").reset();
    $("editEventId").value = "";
    $("repeatSelect").disabled = false;
    resetRepeatState();
    setCopyMode(false);
    resetInputToggles();
    clearExpenseRows();
    if (!isTeacherMode()) addExpenseRow();
    setAddModalModeUI();
    $("addModalDateTitle").innerText = `${isTeacherMode() ? t("新增排課") : t("新增行程")}：${dateStr}`;
    updateModalTimezoneHint();
    $("addModal").style.display = "block";
}

function openEditModal(id, e) {
    if (e) e.stopPropagation();
    if (isCombinedMode()) return;
    const target = events.find(eventItem => eventItem.id === id);
    if (!target) return;
    populateItemSelects();
    fillTimeOptions();
    $("scheduleForm").reset();
    resetInputToggles();
    clearExpenseRows();
    setAddModalModeUI();
    $("editEventId").value = id;
    $("repeatSelect").value = "none";
    $("repeatSelect").disabled = true;
    resetRepeatState();
    setCopyMode(false);
    $("addModalDateTitle").innerText = `${isTeacherMode() ? l("編輯課程", "レッスンを編集", "Edit lesson") : l("編輯行程", "予定を編集", "Edit event")}：${target.date}`;
    updateModalTimezoneHint();
    fillScheduleFormFromEvent(target);
    $("addModal").style.display = "block";
}

function openCopyModal(id, e) {
    if (e) e.stopPropagation();
    if (isCombinedMode()) return;
    const target = events.find(eventItem => eventItem.id === id);
    if (!target) return;
    currentSelectedDate = target.date;
    populateItemSelects();
    fillTimeOptions();
    $("scheduleForm").reset();
    resetInputToggles();
    clearExpenseRows();
    setAddModalModeUI();
    $("editEventId").value = "";
    $("repeatSelect").value = "none";
    $("repeatSelect").disabled = false;
    resetRepeatState();
    setCopyMode(true, target.date);
    updateCopyModalTitle();
    updateModalTimezoneHint();
    fillScheduleFormFromEvent(target);
    closeModal("detailModal");
    $("addModal").style.display = "block";
}

function setAddModalModeUI() {
    $("teacherFields").classList.toggle("hidden", !isTeacherMode());
    $("generalFields").classList.toggle("hidden", isTeacherMode());
    $("generalNoteField").classList.remove("hidden");
    $("generalTimeHint").classList.toggle("hidden", isTeacherMode());
    $("contentLabel").innerText = isTeacherMode() ? t("課程內容") : l("內容（必填）", "内容（必須）", "Details (required)");
    $("courseContent").placeholder = isTeacherMode() ? t("請輸入教材或進度...") : l("請輸入行程內容...", "予定の内容を入力...", "Enter event details...");
    $("timeFieldLabel").innerText = isTeacherMode() ? t("時間範圍") : l("時間（選填）", "時間（任意）", "Time (optional)");
    $("repeatText").innerText = isTeacherMode() ? t("排課") : t("行程");
}

function setCopyMode(enabled, dateStr = currentSelectedDate) {
    $("copyModeBox").classList.toggle("hidden", !enabled);
    if (!enabled) {
        $("copyTargetDate").value = "";
        return;
    }
    $("copyModeLabel").innerText = l("目前是複製模式", "現在はコピーモードです", "Copy mode");
    $("copyModeHelp").innerText = l("請確認要複製到哪一天，再按確認儲存。", "コピー先の日付を確認してから保存してください。", "Choose the target date, then save.");
    $("copyTargetDate").value = dateStr;
}

function updateCopyModalTitle() {
    if ($("copyModeBox").classList.contains("hidden")) return;
    const dateStr = $("copyTargetDate").value || currentSelectedDate;
    $("addModalDateTitle").innerText = `${isTeacherMode() ? l("複製課程", "レッスンをコピー", "Copy lesson") : l("複製行程", "予定をコピー", "Copy event")}：${dateStr}`;
}

function resetRepeatState() {
    customRepeatDates = [];
    pendingCustomRepeatDates = [];
    renderCustomRepeatSummary();
}

function fillScheduleFormFromEvent(target) {
    if (isTeacherMode()) {
        setSelectOrCustom("platformSelect", "platformInput", target.platform);
        $("courseFee").value = target.fee || "";
        $("studentName").value = target.student === "未填寫" ? "" : target.student;
    } else {
        setSelectOrCustom("categorySelect", "categoryInput", target.category);
        $("targetPerson").value = target.target || "";
        $("locationInput").value = target.location || "";
        (target.expenses?.length ? target.expenses : [{ name: "", amount: "" }]).forEach(exp => addExpenseRow(exp.name, exp.amount));
    }
    $("noteInput").value = target.note || "";
    const displayStart = getModalDisplayTime(target, "start");
    const displayEnd = getModalDisplayTime(target, "end");
    ensureTimeOptionExists("startTimeSelect", displayStart);
    ensureTimeOptionExists("endTimeSelect", displayEnd);
    $("startTimeSelect").value = displayStart;
    $("endTimeSelect").value = displayEnd;
    $("startTimeInput").value = displayStart;
    $("endTimeInput").value = displayEnd;
    $("courseContent").value = target.content || "";
}

function updateModalTimezoneHint() {
    const hint = $("modalTimezoneHint");
    if (!hint) return;
    hint.innerText = `${l("（目前使用：", "（現在：", "(current: ")}${getTimezoneLabelByValue(settings.displayTimeZone, settings.displayTimeZoneLabel)}${settings.language === "en" ? ")" : "）"}`;
}

function getModalDisplayTime(eventItem, key) {
    if (!eventItem[key]) return "";
    const utc = zonedTimeToUtc(eventItem.date, eventItem[key], settings.baseTimeZone);
    const display = getDisplayTimeInfo(eventItem.date, utc, settings.displayTimeZone);
    return display.useExtended ? display.extendedTime : display.time;
}

function convertModalTimeToStoredTime(dateStr, timeStr) {
    if (!timeStr) return "";
    const utc = zonedTimeToUtc(dateStr, timeStr, settings.displayTimeZone);
    const stored = getDisplayTimeInfo(dateStr, utc, settings.baseTimeZone);
    return stored.useExtended ? stored.extendedTime : stored.time;
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
    const isCopyMode = !$("copyModeBox").classList.contains("hidden");
    const copyDate = $("copyTargetDate").value;
    if (isCopyMode && !copyDate) return alert("請選擇要複製到哪一天。");
    const targetDate = editId ? events.find(item => item.id === editId)?.date || currentSelectedDate : (isCopyMode ? copyDate : currentSelectedDate);
    const start = !$("timeInputGroup").classList.contains("hidden") ? $("startTimeInput").value.trim() : $("startTimeSelect").value;
    const end = !$("timeInputGroup").classList.contains("hidden") ? $("endTimeInput").value.trim() : $("endTimeSelect").value;
    const validation = validateTimeRange(start, end);
    if (!validation.valid) return alert(validation.message);
    const storedStart = convertModalTimeToStoredTime(targetDate, start);
    const storedEnd = convertModalTimeToStoredTime(targetDate, end);

    let eventData;
    if (isTeacherMode()) {
        const platform = !$("platformInput").classList.contains("hidden") ? $("platformInput").value.trim() : $("platformSelect").value;
        if (!platform) return alert("請選擇或輸入上課平台。");
        eventData = {
            mode: "teacher",
            platform,
            category: platform,
            fee: Number($("courseFee").value) || 0,
            student: $("studentName").value.trim() || "未填寫",
            start: storedStart,
            end: storedEnd,
            content: $("courseContent").value.trim(),
            note: $("noteInput").value.trim()
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
            start: storedStart,
            end: storedEnd,
            content,
            note: $("noteInput").value.trim()
        };
    }

    if (editId) {
        const conflict = getConflictEvent(targetDate, storedStart, storedEnd, editId);
        if (conflict) return alert(makeConflictMessage(conflict));
        const index = events.findIndex(item => item.id === editId);
        if (index !== -1) events[index] = { ...events[index], ...eventData };
    } else {
        const repeatDates = getRepeatDates(targetDate, $("repeatSelect").value);
        const conflicts = getRepeatConflicts(repeatDates, storedStart, storedEnd);
        if (conflicts.length > 0) return alert(makeRepeatConflictMessage(conflicts));
        repeatDates.forEach(date => {
            const repeatedData = eventData.expenses ? { ...eventData, expenses: eventData.expenses.map(exp => ({ ...exp })) } : eventData;
            events.push({ id: makeId(), date, ...repeatedData });
        });
    }

    saveData();
    closeModal("addModal");
    resetRepeatState();
    setCopyMode(false);
    currentSelectedDate = targetDate;
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
    if (isTeacherEvent(conflict)) return `此時段與 ${conflict.date} ${conflict.start}-${conflict.end} ${conflict.platform}（${conflict.student || "未填寫"}）課程重疊。`;
    return `此時段與 ${conflict.date} ${conflict.start}-${conflict.end}「${conflict.content || conflict.category}」行程重疊，請調整時間。`;
}

function makeRepeatConflictMessage(conflicts) {
    const label = isTeacherMode() ? "重複排課" : "重複行程";
    const rows = conflicts.slice(0, 5).map(conflict => {
        const title = isTeacherEvent(conflict)
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
        const switchingToCustom = $("timeInputGroup").classList.contains("hidden");
        if (switchingToCustom) {
            $("startTimeInput").value = $("startTimeSelect").value;
            $("endTimeInput").value = $("endTimeSelect").value;
        }
        $("timeSelectGroup").classList.toggle("hidden");
        $("timeInputGroup").classList.toggle("hidden");
    }
}

function openDeleteModal(id, e) {
    if (e) e.stopPropagation();
    if (isCombinedMode()) return;
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
    $("detailDateTitle").innerText = `${currentSelectedDate}（${getTimezoneLabelByValue(settings.displayTimeZone, settings.displayTimeZoneLabel)}）`;
    const dayEvents = events.filter(item => item.date === currentSelectedDate && eventBelongsToCurrentMode(item)).filter(eventMatchesSearch).sort(compareEvents);
    $("detailList").innerHTML = dayEvents.length ? dayEvents.map(renderDetailEvent).join("") : '<p style="text-align:center;color:#999;padding:20px;">無行程</p>';
}

function renderDetailEvent(eventItem) {
    const teacherEvent = isTeacherEvent(eventItem);
    const title = teacherEvent
        ? `${hasTimeRange(eventItem) ? getDisplayTimeRange(eventItem) : t("時間未定")} ｜ ${escapeHtml(eventItem.platform)}${isEventCompleted(eventItem) ? `｜${t("已完成")}` : ""}`
        : `${hasTimeRange(eventItem) ? getDisplayTimeRange(eventItem) : t("時間未定")} ｜ ${escapeHtml(eventItem.content)}${isEventCompleted(eventItem) ? `｜${t("已完成")}` : ""}`;
    const body = teacherEvent
        ? `<small>學生：${escapeHtml(eventItem.student)} ｜ 費用：${escapeHtml(settings.currency)} ${eventItem.fee}</small><br><p>${escapeHtml(eventItem.content || "")}</p><p>${escapeHtml(eventItem.note || "")}</p>`
        : `<small>分類：${escapeHtml(eventItem.category)} ｜ 對象：${escapeHtml(eventItem.target || "未填寫")} ｜ 地點：${escapeHtml(eventItem.location || "未填寫")}</small><br>
           <small>花費：${escapeHtml(settings.currency)} ${getGeneralExpenseTotal(eventItem).toLocaleString()}</small>
           ${renderExpenseDetail(eventItem)}
           <p>${escapeHtml(eventItem.note || "")}</p>`;
    return `
        <div class="detail-event ${isEventCompleted(eventItem) ? "completed" : ""}">
            <div class="detail-actions ${isCombinedMode() ? "hidden" : ""}">
                <button class="detail-action edit" onclick="openEditModal('${eventItem.id}')">${t("編輯")}</button>
                <button class="detail-action copy" onclick="openCopyModal('${eventItem.id}', event)">${t("複製")}</button>
                <button class="detail-action delete" onclick="openDeleteModal('${eventItem.id}', event)">${t("刪除")}</button>
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
    const searchActive = Boolean(getSearchKeyword());
    const searchPrefix = searchActive ? l("搜尋結果：", "検索結果：", "Search: ") : "";
    const monthEvents = events.filter(item => {
        const [eventYear, eventMonth] = item.date.split("-").map(Number);
        return eventBelongsToCurrentMode(item) && eventYear === year && eventMonth === month + 1;
    }).filter(item => !searchActive || eventMatchesSearch(item));
    const selectedDayEvents = events
        .filter(item => eventBelongsToCurrentMode(item) && item.date === currentSelectedDate)
        .filter(item => !searchActive || eventMatchesSearch(item));
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
    $("statsFooter").classList.toggle("search-results", searchActive);
    $("monthCountLabel").innerText = `${searchPrefix}${isTeacherMode() ? t("本月課程") : l("本月行程", "今月の予定", "Events this month")}`;
    $("monthHoursLabel").innerText = `${searchPrefix}${isTeacherMode() ? t("本月時數") : l("本月安排時數", "今月の予定時間", "Scheduled hours this month")}`;
    $("moneyStatLabel").innerText = `${searchPrefix}${isTeacherMode() ? t("預計總收入") : l("目前本月總花費", "今月の支出", "Expenses this month")}`;
    $("monthCount").innerText = monthEvents.length;
    $("monthHours").innerText = Math.floor(totalMinutes / 60);
    $("monthCompletionRate").innerText = `${completionRate}%`;
    $("completionProgress").style.width = `${completionRate}%`;
    $("selectedDateLabel").innerText = `${searchPrefix}${currentSelectedDate === formatDate(now) ? l("今日", "今日", "Today") : currentSelectedDate.slice(5)}`;
    $("selectedDayCount").innerText = selectedDayEvents.length;
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
        if (item.note) description += `\\n備註: ${item.note.replace(/\n/g, "\\n")}`;
        return description;
    }
    const expenses = item.expenses?.map(exp => `${exp.name}: ${settings.currency} ${exp.amount}`).join("\\n") || "";
    return `分類: ${item.category}\\n對象: ${item.target || ""}\\n地點: ${item.location || ""}\\n內容: ${item.content}\\n花費: ${settings.currency} ${getGeneralExpenseTotal(item)}${expenses ? `\\n${expenses}` : ""}${item.note ? `\\n備註: ${item.note}` : ""}`;
}

function openScheduleImagePreview() {
    latestPreviewImage = createScheduleImageData();
    $("imagePreviewTitle").innerText = isCombinedMode() ? "綜合圖片預覽" : isTeacherMode() ? "課表圖片預覽" : "行程圖片預覽";
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
        .filter(item => item.start && item.end)
        .map(item => ({
            id: item.id,
            mode: item.mode || "teacher",
            date: item.date,
            start: item.start,
            end: item.end,
            completed: Boolean(item.completed),
            ...getPublicStudentFields(item)
        }));
    const untimedGeneralDates = Array.from(new Set(events
        .filter(item => (item.mode || "teacher") === "general" && item.date && (!item.start || !item.end))
        .map(item => item.date)
    )).sort();
    const publicData = {
        version: 3,
        updatedAt: new Date().toISOString(),
        selectedYear: Number(yearSelect.value),
        selectedMonth: Number(monthSelect.value),
        settings: {
            teacherName: settings.teacherName || "",
            showTeacherName: Boolean(settings.showTeacherName),
            baseTimeZone: settings.baseTimeZone,
            baseTimeZoneLabel: settings.baseTimeZoneLabel,
            displayTimeZone: settings.displayTimeZone,
            displayTimeZoneLabel: settings.displayTimeZoneLabel,
            customTimeZones: settings.customTimeZones || []
        },
        students: getPublicStudentRecords(),
        events: publicEvents,
        untimedGeneralDates
    };
    const js = `window.TEACHER_PUBLIC_SCHEDULE = ${JSON.stringify(publicData, null, 2)};\n`;
    downloadBlob(new Blob([js], { type: "text/javascript;charset=utf-8" }), "public-schedule-data.js");
    showToast(`公開頁資料已匯出 ${publicEvents.length} 筆排課與一般行程，請用新下載的 public-schedule-data.js 覆蓋專案同名檔案後推送到 GitHub。`, false);
}

function getPublicStudentFields(item) {
    if (!isTeacherEvent(item) || !item.student || item.student === "未填寫") return {};
    const name = normalizePublicStudentName(item.student);
    return {
        studentNameBase64: encodePublicBase64(name),
        studentKeyBase64: encodePublicBase64(normalizePublicStudentKey(name))
    };
}

function getPublicStudentRecords() {
    return [
        { nameBase64: "6buD6Yi66Yie", keyBase64: "6buD6Yi66Yie" },
        { nameBase64: "5p6X5a2Q6Zm4", keyBase64: "5p6X5a2Q6Zm4" },
        { nameBase64: "Tmljb2xl", keyBase64: "bmljb2xl" },
        { nameBase64: "SGF6ZWwgQ2hlZQ==", keyBase64: "aGF6ZWwgY2hlZQ==" },
        { nameBase64: "WkVZSQ==", keyBase64: "emV5aQ==" },
        { nameBase64: "6auY5YGJ6Kqg", keyBase64: "6auY5YGJ6Kqg" },
        { nameBase64: "6JSh5a6c5L+u", keyBase64: "6JSh5a6c5L+u" },
        { nameBase64: "5L2R6IGy", keyBase64: "5L2R6IGy" },
        { nameBase64: "U2FyYQ==", keyBase64: "c2FyYQ==" },
        { nameBase64: "5rKI6YOB6Zuv", keyBase64: "5rKI6YOB6Zuv" },
        { nameBase64: "TW9uaWNh", keyBase64: "bW9uaWNh" },
        { nameBase64: "YW11cm8=", keyBase64: "YW11cm8=" }
    ];
}

function normalizePublicStudentName(value) {
    return String(value || "").trim().replace(/\s+/g, " ");
}

function normalizePublicStudentKey(value) {
    return normalizePublicStudentName(value).toLocaleLowerCase();
}

function encodePublicBase64(value) {
    const bytes = new TextEncoder().encode(String(value || ""));
    let binary = "";
    bytes.forEach(byte => binary += String.fromCharCode(byte));
    return btoa(binary);
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
        monthEventsByDate[dateStr] = getScheduleImageEvents(dateStr);
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
    const rowHeights = [];
    for (let week = 0; week < weekCount; week++) {
        let maxItemsHeight = 0;
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const dayNum = week * 7 + dayIndex - firstDay + 1;
            if (dayNum >= 1 && dayNum <= daysInMonth) {
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                const itemsHeight = monthEventsByDate[dateStr].reduce((sum, item) => sum + getScheduleImageEventHeight(item), 0);
                maxItemsHeight = Math.max(maxItemsHeight, itemsHeight);
            }
        }
        rowHeights.push(Math.max(baseCellHeight, 74 + maxItemsHeight));
    }
    const height = padding + titleHeight + weekdayHeight + rowHeights.reduce((sum, h) => sum + h, 0) + footerHeight;
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = isCombinedMode() ? "#475569" : isTeacherMode() ? "#254b84" : "#0f766e";
    ctx.fillRect(0, 0, width, titleHeight + padding);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 40px Microsoft JhengHei, Arial";
    ctx.fillText(isCombinedMode() ? `${year} 年 ${month + 1} 月綜合行程表` : isTeacherMode() ? `${year} 年 ${month + 1} 月已排課的時間` : `${year} 年 ${month + 1} 月行程表`, padding, 76);
    ctx.font = "22px Microsoft JhengHei, Arial";
    ctx.fillText(`時區：${getTimezoneLabelByValue(settings.displayTimeZone, settings.displayTimeZoneLabel)}`, padding, 112);
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
                let itemOffset = 0;
                dayEvents.forEach((eventItem, eventIndex) => {
                    const eventHeight = getScheduleImageEventHeight(eventItem);
                    const itemY = y + 52 + itemOffset;
                    const style = getScheduleImageItemStyle(eventItem);
                    ctx.fillStyle = style.background;
                    roundRect(ctx, x + 14, itemY, cellWidth - 28, eventHeight - 6, 8, true, false);
                    ctx.fillStyle = style.text;
                    ctx.font = "bold 17px Microsoft JhengHei, Arial";
                    drawScheduleImageEventText(ctx, eventItem, x + 26, itemY, cellWidth - 52);
                    itemOffset += eventHeight;
                });
            }
        }
        y += rowHeight;
    }
    ctx.fillStyle = "#667085";
    ctx.font = "18px Microsoft JhengHei, Arial";
    ctx.textAlign = "center";
    ctx.fillText(isCombinedMode() ? "圖片顯示本月課程與一般行程時間。" : isTeacherMode() ? "圖片僅顯示已排課的時間；其他時段請再與老師確認。" : "圖片顯示本月行程時間與內容。", width / 2, height - 20);
    return {
        dataUrl: canvas.toDataURL("image/png"),
        fileName: `${settings.teacherName || "schedule"}_${year}年${month + 1}月${isCombinedMode() ? "綜合行程表" : isTeacherMode() ? "不可預約時間" : "行程表"}.png`
    };
}

function getScheduleImageEvents(dateStr) {
    const keyword = getSearchKeyword();
    const dayEvents = events
        .filter(item => item.date === dateStr && hasTimeRange(item))
        .filter(item => !keyword || (eventBelongsToCurrentMode(item) && eventMatchesSearch(item)))
        .sort(compareEvents);
    if (keyword) return dayEvents;
    if (hasUntimedGeneralEvent(dateStr)) {
        dayEvents.push({ id: `untimed-${dateStr}`, mode: "general", date: dateStr, untimedNotice: true });
    }
    return dayEvents;
}

function getScheduleImageEventText(eventItem) {
    if (eventItem.untimedNotice) return "本日有未定時間的行程";
    return getDisplayTimeRange(eventItem);
}

function getScheduleImageEventDetail(eventItem) {
    if (!settings.showTeacherName || eventItem.untimedNotice) return "";
    if (isTeacherEvent(eventItem)) {
        return `${eventItem.platform || "其他"}｜${eventItem.student || "未填寫學生"}`;
    }
    return `${eventItem.category || "其他"}｜${eventItem.content || "未命名行程"}`;
}

function getScheduleImageEventHeight(eventItem) {
    if (eventItem.untimedNotice) return 48;
    return getScheduleImageEventDetail(eventItem) ? 50 : 30;
}

function drawScheduleImageEventText(ctx, eventItem, x, itemY, maxWidth) {
    if (!eventItem.untimedNotice) {
        drawClippedText(ctx, getScheduleImageEventText(eventItem), x, itemY + 17, maxWidth);
        const detail = getScheduleImageEventDetail(eventItem);
        if (detail) {
            ctx.font = "15px Microsoft JhengHei, Arial";
            drawClippedText(ctx, detail, x, itemY + 37, maxWidth);
            ctx.font = "bold 17px Microsoft JhengHei, Arial";
        }
        return;
    }
    const text = getScheduleImageEventText(eventItem);
    if (ctx.measureText(text).width <= maxWidth) {
        ctx.fillText(text, x, itemY + 25);
        return;
    }
    fitCanvasFont(ctx, "bold", 17, "Microsoft JhengHei, Arial", "本日有未定時間的", maxWidth);
    ctx.fillText("本日有未定時間的", x, itemY + 19);
    ctx.font = "bold 17px Microsoft JhengHei, Arial";
    ctx.fillText("行程", x, itemY + 37);
}

function fitCanvasFont(ctx, weight, size, family, text, maxWidth) {
    let fontSize = size;
    do {
        ctx.font = `${weight} ${fontSize}px ${family}`;
        fontSize -= 1;
    } while (fontSize >= 11 && ctx.measureText(text).width > maxWidth);
}

function getScheduleImageItemStyle(eventItem) {
    if (!eventItem.untimedNotice && isEventCompleted(eventItem)) return { background: "#eef1f4", text: "#697386" };
    if (isTeacherEvent(eventItem)) return { background: "#e9f3ff", text: "#1f5f99" };
    return { background: "#ecfdf5", text: "#047857" };
}

function hasUntimedGeneralEvent(dateStr) {
    return events.some(item => (item.mode || "teacher") === "general" && item.date === dateStr && (!item.start || !item.end));
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
    if (repeatMode === "custom") return [...new Set([...dates, ...customRepeatDates])].sort();
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
        const endOfMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0);
        const next = new Date(start);
        next.setDate(next.getDate() + 1);
        while (next <= endOfMonth) {
            const day = next.getDay();
            if (day !== 0 && day !== 6) dates.push(formatDate(next));
            next.setDate(next.getDate() + 1);
        }
    }
    return dates;
}

function handleRepeatModeChange() {
    resetRepeatState();
    if ($("repeatSelect").value === "custom") openCustomRepeatModal();
}

function openCustomRepeatModal() {
    const date = new Date(`${currentSelectedDate}T00:00:00`);
    customRepeatCalendarYear = date.getFullYear();
    customRepeatCalendarMonth = date.getMonth();
    pendingCustomRepeatDates = [...new Set([currentSelectedDate, ...customRepeatDates])];
    renderCustomRepeatCalendar();
    $("customRepeatModal").style.display = "block";
}

function renderCustomRepeatCalendar() {
    $("customRepeatMonthLabel").innerText = settings.language === "en"
        ? new Intl.DateTimeFormat("en", { year: "numeric", month: "long" }).format(new Date(customRepeatCalendarYear, customRepeatCalendarMonth, 1))
        : `${customRepeatCalendarYear} 年 ${customRepeatCalendarMonth + 1} 月`;
    const firstDay = new Date(customRepeatCalendarYear, customRepeatCalendarMonth, 1).getDay();
    const daysInMonth = new Date(customRepeatCalendarYear, customRepeatCalendarMonth + 1, 0).getDate();
    let html = Array.from({ length: firstDay }, () => "<span></span>").join("");
    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${customRepeatCalendarYear}-${String(customRepeatCalendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        html += `<button type="button" class="custom-repeat-day ${pendingCustomRepeatDates.includes(date) ? "selected" : ""}" data-custom-repeat-date="${date}">${day}</button>`;
    }
    $("customRepeatCalendar").innerHTML = html;
    $("customRepeatCalendar").querySelectorAll("[data-custom-repeat-date]").forEach(button => button.onclick = () => {
        const date = button.dataset.customRepeatDate;
        pendingCustomRepeatDates = pendingCustomRepeatDates.includes(date) ? pendingCustomRepeatDates.filter(item => item !== date) : [...pendingCustomRepeatDates, date];
        renderCustomRepeatCalendar();
    });
}

function changeCustomRepeatMonth(offset) {
    const date = new Date(customRepeatCalendarYear, customRepeatCalendarMonth + offset, 1);
    customRepeatCalendarYear = date.getFullYear();
    customRepeatCalendarMonth = date.getMonth();
    renderCustomRepeatCalendar();
}

function confirmCustomRepeat() {
    customRepeatDates = [...pendingCustomRepeatDates].sort();
    $("customRepeatModal").style.display = "none";
    renderCustomRepeatSummary();
}

function cancelCustomRepeat() {
    customRepeatDates = [];
    pendingCustomRepeatDates = [];
    $("repeatSelect").value = "none";
    $("customRepeatModal").style.display = "none";
    renderCustomRepeatSummary();
}

function renderCustomRepeatSummary() {
    const prefix = settings.language === "ja" ? "繰り返し日：" : settings.language === "en" ? "Repeat dates: " : "重複日期：";
    $("customRepeatSummary").innerText = customRepeatDates.length ? `${prefix}${customRepeatDates.join(settings.language === "en" ? ", " : "、")}` : "";
    $("customRepeatSummary").classList.toggle("hidden", customRepeatDates.length === 0);
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
    ["settingsModal", "detailModal", "addModal", "deleteModal", "imagePreviewModal", "customRepeatModal"].forEach(id => {
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
    if (!hasTimeRange(eventItem)) return t("時間未定");
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
    const next = Math.min(total + minutes, TIME_INPUT_MAX_MINUTES);
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
    const useExtended = extendedMinutes >= 0 && extendedMinutes <= TIME_INPUT_MAX_MINUTES && (diff === 0 || extendedMinutes === TIME_INPUT_MAX_MINUTES);

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

function getCompactTimezoneLabel(label) {
    const match = String(label).match(/^(.*?)(（GMT[+-]?\d+）)$/);
    if (!match) return label;
    const name = match[1];
    return `${name.length > 5 ? `${name.slice(0, 5)}…` : name}${match[2]}`;
}

function makeShortCode(text) {
    const english = String(text).replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase();
    return english || "TZ";
}

function getTimezoneLabelByValue(value, label) {
    const custom = settings.customTimeZones.find(zone => zone.value === value && (!label || zone.label === label));
    if (custom) return custom.label;
    return getAllTimeZones().find(zone => zone.value === value)?.label || label || value.replace("UTC", "GMT");
}

function getTimezoneShort(value, label) {
    const zones = getAllTimeZones();
    return zones.find(zone => zone.value === value && (!label || zone.label === label))?.short || zones.find(zone => zone.value === value)?.short || value.replace("UTC", "GMT");
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
