const PUBLIC_DATA = window.TEACHER_PUBLIC_SCHEDULE || {};
const TIME_DISPLAY_MAX_MINUTES = 24 * 60;
const STUDENT_SESSION_KEY = "availabilityStudentNameBase64";
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
    { nameBase64: "TW9uaWNh", keyBase64: "bW9uaWNh" }
];

const DEFAULT_TIMEZONES = [
    { value: "UTC+08:00", label: "台北（GMT+8）" },
    { value: "UTC+09:00", label: "東京（GMT+9）" },
    { value: "UTC-12:00", label: "貝克島（GMT-12）" },
    { value: "UTC-11:00", label: "美屬薩摩亞（GMT-11）" },
    { value: "UTC-10:00", label: "夏威夷（GMT-10）" },
    { value: "UTC-09:00", label: "阿拉斯加（GMT-9）" },
    { value: "UTC-08:00", label: "洛杉磯（GMT-8）" },
    { value: "UTC-07:00", label: "溫哥華（GMT-7）" },
    { value: "UTC-06:00", label: "芝加哥（GMT-6）" },
    { value: "UTC-05:00", label: "紐約（GMT-5）" },
    { value: "UTC-04:00", label: "聖地牙哥（GMT-4）" },
    { value: "UTC-03:00", label: "布宜諾斯艾利斯（GMT-3）" },
    { value: "UTC-02:00", label: "南喬治亞（GMT-2）" },
    { value: "UTC-01:00", label: "亞速群島（GMT-1）" },
    { value: "UTC+00:00", label: "倫敦（GMT+0）" },
    { value: "UTC+01:00", label: "巴黎（GMT+1）" },
    { value: "UTC+02:00", label: "雅典（GMT+2）" },
    { value: "UTC+03:00", label: "伊斯坦堡（GMT+3）" },
    { value: "UTC+04:00", label: "杜拜（GMT+4）" },
    { value: "UTC+05:00", label: "塔什干（GMT+5）" },
    { value: "UTC+06:00", label: "達卡（GMT+6）" },
    { value: "UTC+07:00", label: "曼谷（GMT+7）" },
    { value: "UTC+10:00", label: "雪梨（GMT+10）" },
    { value: "UTC+11:00", label: "索羅門群島（GMT+11）" },
    { value: "UTC+12:00", label: "奧克蘭（GMT+12）" },
    { value: "UTC+13:00", label: "東加（GMT+13）" },
    { value: "UTC+14:00", label: "基里巴斯（GMT+14）" }
];

const $ = id => document.getElementById(id);
const now = new Date();
const state = {
    year: now.getFullYear(),
    month: now.getMonth(),
    displayTimeZone: getDeviceTimeZoneValue(),
    displayTimeZoneLabel: ""
};

function init() {
    populateYearSelect();
    populateMonthSelect();
    populateTimezones();
    bindControls();
    renderDataAlert();
    render();
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
        $("yearSelect").add(new Option(`${year} 年`, year));
    });
    $("yearSelect").value = state.year;
}

function populateMonthSelect() {
    $("monthSelect").innerHTML = "";
    for (let month = 0; month < 12; month++) {
        $("monthSelect").add(new Option(`${month + 1} 月`, month));
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
    $("yearSelect").add(new Option(`${year} 年`, year));
    const sorted = Array.from($("yearSelect").options).sort((a, b) => Number(a.value) - Number(b.value));
    $("yearSelect").innerHTML = "";
    sorted.forEach(option => $("yearSelect").add(option));
}

function render() {
    $("pageTitle").innerText = `${state.year} 年 ${state.month + 1} 月已排課的時間`;
    $("timezoneLabel").innerText = `時區：${getTimezoneLabelByValue(state.displayTimeZone, state.displayTimeZoneLabel)}`;
    $("updatedAt").innerText = `最後更新：${formatUpdatedAt(PUBLIC_DATA.updatedAt, state.displayTimeZone)}`;
    renderStudentLogin();
    renderWeekdays();
    renderCalendar();
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
                <span class="day-num">${day}</span>
                ${slots.length ? slots.map(renderSlot).join("") : '<div class="none">無</div>'}
            </div>
        `;
    }
    grid.innerHTML = html;
}

function renderSlot(item) {
    const range = item.untimedNotice ? "本日有未定時間的行程" : getDisplayTimeRange(item);
    return `<div class="slot ${getSlotClass(item)} ${range.includes("/") ? "date-time" : ""}">${range}</div>`;
}

function getDisplayTimeRange(eventItem) {
    const baseTimeZone = PUBLIC_DATA.settings?.baseTimeZone || "UTC+08:00";
    const startUtc = zonedTimeToUtc(eventItem.date, eventItem.start, baseTimeZone);
    const endUtc = zonedTimeToUtc(eventItem.date, eventItem.end, baseTimeZone);
    const start = getDisplayTimeInfo(eventItem.date, startUtc, state.displayTimeZone);
    const end = getDisplayTimeInfo(eventItem.date, endUtc, state.displayTimeZone);

    if (start.useExtended && end.useExtended) return `${start.extendedTime}-${end.extendedTime}`;
    if (start.dateLabel === end.dateLabel) return `${start.dateLabel} ${start.time}-${end.time}`;
    return `${start.fullLabel}-${end.fullLabel}`;
}

function renderWeekdays() {
    $("weekdays").innerHTML = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"]
        .map(day => `<div class="weekday">${day}</div>`)
        .join("");
}

function renderDataAlert() {
    const alert = $("dataAlert");
    const eventCount = getPublicEvents().length;
    if (!alert) return;
    if (PUBLIC_DATA.loadError) {
        alert.innerText = "找不到 public-schedule-data.js。請確認這個資料檔已放在 availability.html 同一層，並且已推送到 GitHub。";
        alert.classList.remove("hidden");
        return;
    }
    if (!PUBLIC_DATA.updatedAt || eventCount === 0) {
        alert.innerText = "目前讀到的 public-schedule-data.js 還沒有課程資料。請在教師模式按「公開頁資料」，把下載的新 public-schedule-data.js 覆蓋專案內的同名檔案後，再推送到 GitHub。";
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
    return Array.isArray(PUBLIC_DATA.students) && PUBLIC_DATA.students.length ? PUBLIC_DATA.students : DEFAULT_STUDENTS;
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
        error.innerText = "找不到這個學生姓名，請確認輸入是否和老師提供的名稱一致。";
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
        text.innerText = `已登入：${current.name}`;
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
    const zones = [...DEFAULT_TIMEZONES];
    (PUBLIC_DATA.settings?.customTimeZones || []).forEach(zone => {
        if (!zones.some(item => item.value === zone.value && item.label === zone.label)) zones.push(zone);
    });
    return zones;
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
    return new Date(Date.UTC(year, month - 1, day, hour, minute) - getOffsetMinutes(timeZone) * 60000);
}

function getDisplayTimeInfo(baseDate, date, timeZone) {
    const shifted = new Date(date.getTime() + getOffsetMinutes(timeZone) * 60000);
    const year = shifted.getUTCFullYear();
    const month = shifted.getUTCMonth() + 1;
    const day = shifted.getUTCDate();
    const hour = shifted.getUTCHours();
    const minute = shifted.getUTCMinutes();
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

function getOffsetMinutes(timeZone) {
    if (!/^UTC[+-]\d{2}:\d{2}$/.test(timeZone)) return 0;
    const sign = timeZone[3] === "+" ? 1 : -1;
    const [hour, minute] = timeZone.slice(4).split(":").map(Number);
    return sign * (hour * 60 + minute);
}

function getDeviceTimeZoneValue() {
    const offset = -new Date().getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const abs = Math.abs(offset);
    const hour = Math.floor(abs / 60);
    const minute = abs % 60;
    return `UTC${sign}${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function getTodayInDisplayTimeZone() {
    const shifted = new Date(Date.now() + getOffsetMinutes(state.displayTimeZone) * 60000);
    return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, "0")}-${String(shifted.getUTCDate()).padStart(2, "0")}`;
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
    if (!value) return "尚未匯出";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    const shifted = new Date(date.getTime() + getOffsetMinutes(timeZone) * 60000);
    return `${shifted.getUTCFullYear()}/${String(shifted.getUTCMonth() + 1).padStart(2, "0")}/${String(shifted.getUTCDate()).padStart(2, "0")} ${String(shifted.getUTCHours()).padStart(2, "0")}:${String(shifted.getUTCMinutes()).padStart(2, "0")}`;
}

function getTimezoneLabelByValue(value, label) {
    if (label) return label;
    return getAllTimeZones().find(zone => zone.value === value)?.label || value.replace("UTC", "GMT");
}

init();
