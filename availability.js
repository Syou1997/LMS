const PUBLIC_DATA = window.TEACHER_PUBLIC_SCHEDULE || {};
const TIME_DISPLAY_MAX_MINUTES = 24 * 60;
const STUDENT_SESSION_KEY = "availabilityStudentNameBase64";
const LANGUAGE_KEY = "availabilityLanguage";
const LANGUAGES = ["zh-TW", "ja", "en"];
const TEXT = {
    "zh-TW": {
        pageTitle: (year, month) => `${year} 年 ${month} 月已排課的時間`,
        timezonePrefix: "時區：",
        updatedPrefix: "最後更新：",
        announcementTitle: "最新公告：",
        yearOption: year => `${year} 年`,
        monthOption: month => `${month} 月`,
        weekdays: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
        studentPlaceholder: "輸入學生姓名",
        login: "登入",
        logout: "登出",
        loggedIn: name => `已登入：${name}`,
        studentNotFound: "找不到這個學生姓名，請確認輸入是否和老師提供的名稱一致。",
        noSchedule: "無排課",
        untimedNotice: "本日有未定時間的行程",
        notExported: "尚未匯出",
        dataLoadError: "找不到 public-schedule-data.js。請確認這個資料檔已放在 availability.html 同一層，並且已推送到 GitHub。",
        emptyData: "目前讀到的 public-schedule-data.js 還沒有課程資料。請在教師模式按「公開頁資料」，把下載的新 public-schedule-data.js 覆蓋專案內的同名檔案後，再推送到 GitHub。",
        footnote: "此頁僅顯示已排課的時間；其他時段請再與老師確認。",
        calendarLabel: "已排課時間月曆",
        yearAria: "選擇年份",
        monthAria: "選擇月份",
        timezoneAria: "選擇顯示時區",
        languageAria: "選擇語言",
        prevMonthAria: "上一個月",
        nextMonthAria: "下一個月"
    },
    ja: {
        pageTitle: (year, month) => `${year} 年 ${month} 月の予約済み時間`,
        timezonePrefix: "タイムゾーン：",
        updatedPrefix: "最終更新：",
        announcementTitle: "最新のお知らせ：",
        yearOption: year => `${year} 年`,
        monthOption: month => `${month} 月`,
        weekdays: ["日", "月", "火", "水", "木", "金", "土"],
        studentPlaceholder: "学生名を入力",
        login: "ログイン",
        logout: "ログアウト",
        loggedIn: name => `ログイン中：${name}`,
        studentNotFound: "この学生名が見つかりません。先生から案内された名前と一致しているか確認してください。",
        noSchedule: "予約済みなし",
        untimedNotice: "本日は時間未定の予定があります",
        notExported: "未出力",
        dataLoadError: "public-schedule-data.js が見つかりません。このデータファイルを availability.html と同じ階層に置き、GitHub に反映してください。",
        emptyData: "読み込んだ public-schedule-data.js には、まだ予定データがありません。教師モードで「公開頁資料」を押し、ダウンロードした新しい public-schedule-data.js を同名ファイルに上書きしてから GitHub に反映してください。",
        footnote: "このページには予約済みの時間のみ表示されます。その他の時間は先生に確認してください。",
        calendarLabel: "予約済み時間カレンダー",
        yearAria: "年を選択",
        monthAria: "月を選択",
        timezoneAria: "表示タイムゾーンを選択",
        languageAria: "言語を選択",
        prevMonthAria: "前の月",
        nextMonthAria: "次の月"
    },
    en: {
        pageTitle: (year, month) => `Booked times for ${getEnglishMonthName(month)} ${year}`,
        timezonePrefix: "Time zone: ",
        updatedPrefix: "Last updated: ",
        announcementTitle: "Latest announcement:",
        yearOption: year => `${year}`,
        monthOption: month => getEnglishMonthName(month),
        weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        studentPlaceholder: "Enter student name",
        login: "Log in",
        logout: "Log out",
        loggedIn: name => `Logged in: ${name}`,
        studentNotFound: "Student name not found. Please check that it matches the name provided by the teacher.",
        noSchedule: "No booked times",
        untimedNotice: "There is an event with no fixed time on this day",
        notExported: "Not exported yet",
        dataLoadError: "public-schedule-data.js was not found. Make sure this data file is in the same folder as availability.html and has been pushed to GitHub.",
        emptyData: "The loaded public-schedule-data.js does not contain schedule data yet. In teacher mode, click the public page data export button, replace the project file with the downloaded public-schedule-data.js, then push it to GitHub.",
        footnote: "This page shows only booked times. Please confirm other time slots with the teacher.",
        calendarLabel: "Booked times calendar",
        yearAria: "Choose year",
        monthAria: "Choose month",
        timezoneAria: "Choose display time zone",
        languageAria: "Choose language",
        prevMonthAria: "Previous month",
        nextMonthAria: "Next month"
    }
};
const DEFAULT_STUDENTS = [
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
    { nameBase64: "YW11cm8=", keyBase64: "YW11cm8=" },
    { nameBase64: "RXRoYW4=", keyBase64: "ZXRoYW4=" }
];

const DEFAULT_TIMEZONES = [
    { value: "UTC+08:00", label: "台北（GMT+8）" },
    { value: "UTC+09:00", label: "東京（GMT+9）" },
    { value: "UTC-12:00", label: "貝克島（GMT-12）" },
    { value: "UTC-11:00", label: "美屬薩摩亞（GMT-11）" },
    { value: "UTC-10:00", label: "夏威夷（GMT-10）" },
    { value: "America/Anchorage", label: "阿拉斯加（GMT-9）" },
    { value: "America/Los_Angeles", label: "洛杉磯（GMT-8）" },
    { value: "America/Vancouver", label: "溫哥華（GMT-8）" },
    { value: "America/Denver", label: "丹佛（GMT-7）" },
    { value: "America/Chicago", label: "芝加哥（GMT-6）" },
    { value: "America/Toronto", label: "多倫多（GMT-5）" },
    { value: "America/New_York", label: "紐約（GMT-5）" },
    { value: "America/Santiago", label: "聖地牙哥（GMT-4）" },
    { value: "UTC-03:00", label: "布宜諾斯艾利斯（GMT-3）" },
    { value: "UTC-02:00", label: "南喬治亞（GMT-2）" },
    { value: "Atlantic/Azores", label: "亞速群島（GMT-1）" },
    { value: "Europe/London", label: "倫敦（GMT+0）" },
    { value: "Europe/Paris", label: "巴黎（GMT+1）" },
    { value: "Europe/Athens", label: "雅典（GMT+2）" },
    { value: "Europe/Istanbul", label: "伊斯坦堡（GMT+3）" },
    { value: "UTC+04:00", label: "杜拜（GMT+4）" },
    { value: "UTC+05:00", label: "塔什干（GMT+5）" },
    { value: "UTC+06:00", label: "達卡（GMT+6）" },
    { value: "UTC+07:00", label: "曼谷（GMT+7）" },
    { value: "Australia/Sydney", label: "雪梨（GMT+10）" },
    { value: "Australia/Adelaide", label: "阿德雷德（GMT+9:30）" },
    { value: "Australia/Brisbane", label: "布里斯本（GMT+10）" },
    { value: "Australia/Perth", label: "伯斯（GMT+8）" },
    { value: "UTC+11:00", label: "索羅門群島（GMT+11）" },
    { value: "Pacific/Auckland", label: "奧克蘭（GMT+12）" },
    { value: "UTC+13:00", label: "東加（GMT+13）" },
    { value: "UTC+14:00", label: "基里巴斯（GMT+14）" }
];
const TIMEZONE_NAME_TRANSLATIONS = {
    "台北": ["台北", "台北", "Taipei"],
    "東京": ["東京", "東京", "Tokyo"],
    "貝克島": ["貝克島", "ベーカー島", "Baker Island"],
    "美屬薩摩亞": ["美屬薩摩亞", "米領サモア", "American Samoa"],
    "夏威夷": ["夏威夷", "ハワイ", "Hawaii"],
    "阿拉斯加": ["阿拉斯加", "アラスカ", "Alaska"],
    "洛杉磯": ["洛杉磯", "ロサンゼルス", "Los Angeles"],
    "溫哥華": ["溫哥華", "バンクーバー", "Vancouver"],
    "丹佛": ["丹佛", "デンバー", "Denver"],
    "芝加哥": ["芝加哥", "シカゴ", "Chicago"],
    "多倫多": ["多倫多", "トロント", "Toronto"],
    "紐約": ["紐約", "ニューヨーク", "New York"],
    "聖地牙哥": ["聖地牙哥", "サンティアゴ", "Santiago"],
    "布宜諾斯艾利斯": ["布宜諾斯艾利斯", "ブエノスアイレス", "Buenos Aires"],
    "南喬治亞": ["南喬治亞", "サウスジョージア", "South Georgia"],
    "亞速群島": ["亞速群島", "アゾレス諸島", "Azores"],
    "倫敦": ["倫敦", "ロンドン", "London"],
    "巴黎": ["巴黎", "パリ", "Paris"],
    "雅典": ["雅典", "アテネ", "Athens"],
    "伊斯坦堡": ["伊斯坦堡", "イスタンブール", "Istanbul"],
    "杜拜": ["杜拜", "ドバイ", "Dubai"],
    "塔什干": ["塔什干", "タシケント", "Tashkent"],
    "達卡": ["達卡", "ダッカ", "Dhaka"],
    "曼谷": ["曼谷", "バンコク", "Bangkok"],
    "雪梨": ["雪梨", "シドニー", "Sydney"],
    "阿德雷德": ["阿德雷德", "アデレード", "Adelaide"],
    "布里斯本": ["布里斯本", "ブリスベン", "Brisbane"],
    "伯斯": ["伯斯", "パース", "Perth"],
    "索羅門群島": ["索羅門群島", "ソロモン諸島", "Solomon Islands"],
    "奧克蘭": ["奧克蘭", "オークランド", "Auckland"],
    "東加": ["東加", "トンガ", "Tonga"],
    "基里巴斯": ["基里巴斯", "キリバス", "Kiribati"]
};

const $ = id => document.getElementById(id);
const now = new Date();
const state = {
    year: now.getFullYear(),
    month: now.getMonth(),
    displayTimeZone: getDeviceTimeZoneValue(),
    displayTimeZoneLabel: "",
    language: getSavedLanguage()
};

function init() {
    populateLanguageSelect();
    populateYearSelect();
    populateMonthSelect();
    populateTimezones();
    bindControls();
    renderDataAlert();
    render();
}

function populateLanguageSelect() {
    const select = $("languageSelect");
    if (!select) return;
    select.value = state.language;
}

function populateYearSelect() {
    const years = new Set([state.year - 1, state.year, state.year + 1, now.getFullYear()]);
    getPublicEvents().forEach(item => {
        const year = Number(item.date?.slice(0, 4));
        if (year) years.add(year);
    });
    getUntimedGeneralDates().forEach(date => {
        const year = Number(date?.slice(0, 4));
        if (year) years.add(year);
    });
    $("yearSelect").innerHTML = "";
    Array.from(years).sort((a, b) => a - b).forEach(year => {
        $("yearSelect").add(new Option(tr("yearOption", year), year));
    });
    $("yearSelect").value = state.year;
}

function populateMonthSelect() {
    $("monthSelect").innerHTML = "";
    for (let month = 0; month < 12; month++) {
        $("monthSelect").add(new Option(tr("monthOption", month + 1), month));
    }
    $("monthSelect").value = state.month;
}

function populateTimezones() {
    $("timezoneSelect").innerHTML = "";
    getAllTimeZones().forEach(zone => {
        const option = new Option(zone.label, zone.value);
        option.dataset.label = zone.label;
        $("timezoneSelect").add(option);
    });
    setTimezoneSelectValue("timezoneSelect", state.displayTimeZone, state.displayTimeZoneLabel);
    state.displayTimeZoneLabel = readTimezoneSelection("timezoneSelect").label;
}

function bindControls() {
    $("prevMonthBtn").onclick = () => changeMonth(-1);
    $("nextMonthBtn").onclick = () => changeMonth(1);
    $("languageSelect").onchange = () => {
        state.language = LANGUAGES.includes($("languageSelect").value) ? $("languageSelect").value : "zh-TW";
        localStorage.setItem(LANGUAGE_KEY, state.language);
        populateYearSelect();
        populateMonthSelect();
        populateTimezones();
        render();
    };
    $("yearSelect").onchange = () => {
        state.year = Number($("yearSelect").value);
        render();
    };
    $("monthSelect").onchange = () => {
        state.month = Number($("monthSelect").value);
        render();
    };
    $("timezoneSelect").onchange = () => {
        const selectedTimeZone = readTimezoneSelection("timezoneSelect");
        state.displayTimeZone = selectedTimeZone.value;
        state.displayTimeZoneLabel = selectedTimeZone.label;
        render();
    };
    $("studentLoginForm").onsubmit = handleStudentLogin;
    $("studentLogoutBtn").onclick = handleStudentLogout;
}

function changeMonth(offset) {
    const target = new Date(state.year, state.month + offset, 1);
    state.year = target.getFullYear();
    state.month = target.getMonth();
    ensureYearOption(state.year);
    $("yearSelect").value = state.year;
    $("monthSelect").value = state.month;
    render();
}

function ensureYearOption(year) {
    if (Array.from($("yearSelect").options).some(option => Number(option.value) === year)) return;
    $("yearSelect").add(new Option(tr("yearOption", year), year));
    const sorted = Array.from($("yearSelect").options).sort((a, b) => Number(a.value) - Number(b.value));
    $("yearSelect").innerHTML = "";
    sorted.forEach(option => $("yearSelect").add(option));
}

function render() {
    renderStaticTexts();
    $("pageTitle").innerText = tr("pageTitle", state.year, state.month + 1);
    $("timezoneLabel").innerText = `${tr("timezonePrefix")}${getTimezoneLabelByValue(state.displayTimeZone, state.displayTimeZoneLabel)}`;
    $("updatedAt").innerText = `${tr("updatedPrefix")}${formatUpdatedAt(PUBLIC_DATA.updatedAt, state.displayTimeZone)}`;
    renderDataAlert();
    renderAnnouncement();
    renderStudentLogin();
    renderWeekdays();
    renderCalendar();
}

function renderStaticTexts() {
    document.documentElement.lang = state.language;
    document.title = tr("pageTitle", state.year, state.month + 1);
    $("studentNameInput").placeholder = tr("studentPlaceholder");
    $("studentLoginBtn").innerText = tr("login");
    $("studentLogoutBtn").innerText = tr("logout");
    $("prevMonthBtn").setAttribute("aria-label", tr("prevMonthAria"));
    $("nextMonthBtn").setAttribute("aria-label", tr("nextMonthAria"));
    $("yearSelect").setAttribute("aria-label", tr("yearAria"));
    $("monthSelect").setAttribute("aria-label", tr("monthAria"));
    $("timezoneSelect").setAttribute("aria-label", tr("timezoneAria"));
    $("languageSelect").setAttribute("aria-label", tr("languageAria"));
    document.querySelector(".calendar")?.setAttribute("aria-label", tr("calendarLabel"));
    $("announcement")?.setAttribute("aria-label", tr("announcementTitle").replace(/[:：]$/, ""));
    const footnote = document.querySelector(".footnote");
    if (footnote) footnote.innerText = tr("footnote");
    const announcementTitle = document.querySelector("#announcement h3");
    if (announcementTitle) announcementTitle.innerText = tr("announcementTitle");
}

function renderAnnouncement() {
    const announcement = String(PUBLIC_DATA.settings?.announcement || "").trim();
    const element = $("announcement");
    const content = $("announcementContent");
    if (!announcement) {
        element.classList.add("hidden");
        content.innerText = "";
        return;
    }
    content.innerText = announcement;
    element.classList.remove("hidden");
}

function renderCalendar() {
    const grid = $("calendarGrid");
    const daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
    const firstDay = new Date(state.year, state.month, 1).getDay();
    const today = getTodayInDisplayTimeZone();

    let html = "";
    for (let i = 0; i < firstDay; i++) html += '<div class="day empty"></div>';
    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${state.year}-${String(state.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const slots = getVisibleEvents()
            .filter(item => item.date === date)
            .sort((a, b) => `${a.start}-${a.end}`.localeCompare(`${b.start}-${b.end}`));
        if (!getCurrentStudent() && hasUntimedGeneralDate(date)) {
            slots.push({ date, mode: "general", untimedNotice: true });
        }
        html += `
            <div class="day ${date < today ? "past-day" : ""}">
                <span class="day-num">${day}<span class="mobile-weekday">${getWeekdayLabel(date)}</span></span>
                ${slots.length ? slots.map(renderSlot).join("") : `<div class="none">${tr("noSchedule")}</div>`}
            </div>
        `;
    }
    grid.innerHTML = html;
}

function renderSlot(item) {
    const range = item.untimedNotice ? tr("untimedNotice") : getDisplayTimeRange(item);
    return `<div class="slot ${getSlotClass(item)} ${range.includes("/") ? "date-time" : ""}">${range}</div>`;
}

function getDisplayTimeRange(eventItem) {
    const baseTimeZone = migrateDefaultTimeZoneValue(PUBLIC_DATA.settings?.baseTimeZone || "UTC+08:00", PUBLIC_DATA.settings?.baseTimeZoneLabel);
    const startUtc = zonedTimeToUtc(eventItem.date, eventItem.start, baseTimeZone);
    const endUtc = zonedTimeToUtc(eventItem.date, eventItem.end, baseTimeZone);
    const displayTimeZone = migrateDefaultTimeZoneValue(state.displayTimeZone, state.displayTimeZoneLabel);
    const start = getDisplayTimeInfo(eventItem.date, startUtc, displayTimeZone);
    const end = getDisplayTimeInfo(eventItem.date, endUtc, displayTimeZone);

    if (start.useExtended && end.useExtended) return `${start.extendedTime}-${end.extendedTime}`;
    if (start.dateLabel === end.dateLabel) return `${start.dateLabel} ${start.time}-${end.time}`;
    return `${start.fullLabel}-${end.fullLabel}`;
}

function renderWeekdays() {
    $("weekdays").innerHTML = tr("weekdays")
        .map(day => `<div class="weekday">${day}</div>`)
        .join("");
}

function getWeekdayLabel(dateStr) {
    const [year, month, day] = dateStr.split("-").map(Number);
    return tr("weekdays")[new Date(year, month - 1, day).getDay()];
}

function renderDataAlert() {
    const alert = $("dataAlert");
    const eventCount = getPublicEvents().length;
    if (!alert) return;
    if (PUBLIC_DATA.loadError) {
        alert.innerText = tr("dataLoadError");
        alert.classList.remove("hidden");
        return;
    }
    if (!PUBLIC_DATA.updatedAt || eventCount === 0) {
        alert.innerText = tr("emptyData");
        alert.classList.remove("hidden");
        return;
    }
    alert.classList.add("hidden");
}

function getPublicEvents() {
    return Array.isArray(PUBLIC_DATA.events) ? PUBLIC_DATA.events : [];
}

function getVisibleEvents() {
    const current = getCurrentStudent();
    if (!current) return getPublicEvents();
    if (!hasStudentScopedEvents()) return getPublicEvents();
    return getPublicEvents().filter(item => isStudentEvent(item, current));
}

function hasStudentScopedEvents() {
    return getPublicEvents().some(item => item.studentNameBase64 || item.studentKeyBase64);
}

function getUntimedGeneralDates() {
    return Array.isArray(PUBLIC_DATA.untimedGeneralDates) ? PUBLIC_DATA.untimedGeneralDates : [];
}

function getPublicStudents() {
    const students = Array.isArray(PUBLIC_DATA.students) ? PUBLIC_DATA.students : [];
    const merged = [...students, ...DEFAULT_STUDENTS];
    const seen = new Set();
    return merged.filter(item => {
        const key = item.keyBase64 || item.nameBase64 || "";
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function handleStudentLogin(event) {
    event.preventDefault();
    const input = $("studentNameInput");
    const error = $("studentLoginError");
    const normalized = normalizeStudentName(input.value);
    const student = getPublicStudents().find(item => {
        const key = item.keyBase64 || encodeBase64(normalizeStudentName(decodeBase64(item.nameBase64)));
        return key === encodeBase64(normalized);
    });
    if (!student) {
        error.innerText = tr("studentNotFound");
        error.classList.remove("hidden");
        return;
    }
    sessionStorage.setItem(STUDENT_SESSION_KEY, student.nameBase64);
    input.value = "";
    error.classList.add("hidden");
    render();
}

function handleStudentLogout() {
    sessionStorage.removeItem(STUDENT_SESSION_KEY);
    render();
}

function renderStudentLogin() {
    const current = getCurrentStudent();
    const form = $("studentLoginForm");
    const status = $("studentLoginStatus");
    const text = $("studentLoginText");
    if (current) {
        form.classList.add("hidden");
        status.classList.remove("hidden");
        text.innerText = tr("loggedIn", current.name);
    } else {
        form.classList.remove("hidden");
        status.classList.add("hidden");
        $("studentLoginError").classList.add("hidden");
    }
}

function getCurrentStudent() {
    const nameBase64 = sessionStorage.getItem(STUDENT_SESSION_KEY);
    if (!nameBase64) return null;
    const name = decodeBase64(nameBase64);
    if (!name) return null;
    return {
        name,
        nameBase64,
        keyBase64: encodeBase64(normalizeStudentName(name))
    };
}

function isStudentEvent(item, current) {
    if (item.untimedNotice) return "";
    if (!current) return "";
    const eventNameBase64 = item.studentNameBase64 || "";
    const eventKeyBase64 = item.studentKeyBase64 || (eventNameBase64 ? encodeBase64(normalizeStudentName(decodeBase64(eventNameBase64))) : "");
    return eventKeyBase64 === current.keyBase64;
}

function normalizeStudentName(value) {
    return String(value || "").trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function encodeBase64(value) {
    const bytes = new TextEncoder().encode(String(value || ""));
    let binary = "";
    bytes.forEach(byte => binary += String.fromCharCode(byte));
    return btoa(binary);
}

function decodeBase64(value) {
    try {
        const binary = atob(String(value || ""));
        const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
        return new TextDecoder().decode(bytes);
    } catch (error) {
        return "";
    }
}

function escapeHtml(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function hasUntimedGeneralDate(date) {
    return getUntimedGeneralDates().includes(date);
}

function getSlotClass(item) {
    if (item.untimedNotice) return "general untimed";
    if (item.completed) return "completed";
    return (item.mode || "teacher") === "general" ? "general" : "teacher";
}

function getAllTimeZones() {
    const zones = DEFAULT_TIMEZONES.map(zone => ({ ...zone, label: getDynamicTimezoneLabel(zone.label, zone.value) }));
    (PUBLIC_DATA.settings?.customTimeZones || []).forEach(zone => {
        if (!zones.some(item => item.value === zone.value && item.label === zone.label)) zones.push(zone);
    });
    return zones;
}

function getDynamicTimezoneLabel(label, value) {
    const match = String(label).match(/^(.*?)（GMT[^）]+）$/);
    if (!match) return label;
    return `${localizeTimezoneName(match[1])}（${getGmtLabelByValue(value)}）`;
}

function migrateDefaultTimeZoneValue(value, label) {
    const text = String(label || "");
    const migrations = [
        ["阿拉斯加", "America/Anchorage"],
        ["洛杉磯", "America/Los_Angeles"],
        ["溫哥華", "America/Vancouver"],
        ["丹佛", "America/Denver"],
        ["芝加哥", "America/Chicago"],
        ["多倫多", "America/Toronto"],
        ["紐約", "America/New_York"],
        ["聖地牙哥", "America/Santiago"],
        ["亞速群島", "Atlantic/Azores"],
        ["倫敦", "Europe/London"],
        ["巴黎", "Europe/Paris"],
        ["雅典", "Europe/Athens"],
        ["伊斯坦堡", "Europe/Istanbul"],
        ["雪梨", "Australia/Sydney"],
        ["阿德雷德", "Australia/Adelaide"],
        ["布里斯本", "Australia/Brisbane"],
        ["伯斯", "Australia/Perth"],
        ["奧克蘭", "Pacific/Auckland"]
    ];
    const matched = migrations.find(([name]) => text.includes(name));
    return matched ? matched[1] : value;
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
    const options = Array.from(select.options);
    const index = options.findIndex(option => option.value === value && (!label || option.dataset.label === label));
    select.selectedIndex = index >= 0 ? index : options.findIndex(option => option.value === value);
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

function getDisplayTimeInfo(baseDate, date, timeZone) {
    const parts = getZonedParts(date, timeZone);
    const { year, month, day, hour, minute } = parts;
    const displayDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dateLabel = `${month}/${day}`;
    const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    const diff = getDateDiff(baseDate, displayDate);
    const extendedMinutes = diff * 1440 + hour * 60 + minute;

    return {
        dateLabel,
        time,
        fullLabel: `${dateLabel} ${time}`,
        useExtended: extendedMinutes >= 0 && extendedMinutes <= TIME_DISPLAY_MAX_MINUTES && (diff === 0 || extendedMinutes === TIME_DISPLAY_MAX_MINUTES),
        extendedTime: formatExtendedTime(extendedMinutes)
    };
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
    try {
        const parts = new Intl.DateTimeFormat("en-CA", { timeZone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(date);
        const map = {};
        parts.forEach(part => { if (part.type !== "literal") map[part.type] = Number(part.value); });
        return map;
    } catch (error) {
        return getZonedParts(date, "UTC+00:00");
    }
}

function getDeviceTimeZoneValue() {
    const deviceZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (deviceZone && DEFAULT_TIMEZONES.some(zone => zone.value === deviceZone)) return deviceZone;
    const offset = -new Date().getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const abs = Math.abs(offset);
    const hour = Math.floor(abs / 60);
    const minute = abs % 60;
    return `UTC${sign}${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function getTodayInDisplayTimeZone() {
    const parts = getZonedParts(new Date(), state.displayTimeZone);
    return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function getDateDiff(baseDate, displayDate) {
    const base = new Date(`${baseDate}T00:00:00`);
    const display = new Date(`${displayDate}T00:00:00`);
    return Math.round((display - base) / 86400000);
}

function formatExtendedTime(totalMinutes) {
    return `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
}

function formatUpdatedAt(value, timeZone) {
    if (!value) return tr("notExported");
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    const parts = getZonedParts(date, timeZone);
    return `${parts.year}/${String(parts.month).padStart(2, "0")}/${String(parts.day).padStart(2, "0")} ${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
}

function getTimezoneLabelByValue(value, label) {
    const defaultZone = getAllTimeZones().find(zone => zone.value === value);
    if (defaultZone) return defaultZone.label;
    if (label) return label;
    return isFixedOffsetZone(value) ? value.replace("UTC", "GMT") : value;
}

function getGmtLabelByValue(value) {
    if (isFixedOffsetZone(value)) return value.replace("UTC", "GMT").replace(":00", "");
    return getGmtLabelForDate(value, new Date());
}

function getGmtLabelForDate(timeZone, date) {
    try {
        const zoneName = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" })
            .formatToParts(date)
            .find(part => part.type === "timeZoneName")?.value || "";
        return normalizeGmtLabel(zoneName);
    } catch (error) {
        return String(timeZone || "").replace("UTC", "GMT");
    }
}

function normalizeGmtLabel(value) {
    if (!value || value === "GMT" || value === "UTC") return "GMT+0";
    const match = String(value).replace("UTC", "GMT").match(/^GMT([+-])(\d{1,2})(?::?(\d{2}))?$/);
    if (!match) return String(value).replace("UTC", "GMT");
    const minute = match[3] && match[3] !== "00" ? `:${match[3]}` : "";
    return `GMT${match[1]}${Number(match[2])}${minute}`;
}

function tr(key, ...args) {
    const source = TEXT[state.language] || TEXT["zh-TW"];
    const value = source[key] ?? TEXT["zh-TW"][key] ?? "";
    return typeof value === "function" ? value(...args) : value;
}

function getSavedLanguage() {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    return LANGUAGES.includes(saved) ? saved : "zh-TW";
}

function getLanguageIndex() {
    return state.language === "ja" ? 1 : state.language === "en" ? 2 : 0;
}

function getEnglishMonthName(month) {
    return [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ][month - 1] || "";
}

function localizeTimezoneName(name) {
    return TIMEZONE_NAME_TRANSLATIONS[name]?.[getLanguageIndex()] || name;
}

init();
