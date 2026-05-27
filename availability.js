const PUBLIC_DATA = window.TEACHER_PUBLIC_SCHEDULE || {};
const TIME_DISPLAY_MAX_MINUTES = 24 * 60;

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
}

function render() {
    $("pageTitle").innerText = `${state.year} 年 ${state.month + 1} 月不可預約的時間`;
    $("timezoneLabel").innerText = `時區：${getTimezoneLabelByValue(state.displayTimeZone, state.displayTimeZoneLabel)}`;
    $("updatedAt").innerText = `最後更新：${formatUpdatedAt(PUBLIC_DATA.updatedAt, state.displayTimeZone)}`;
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
        const slots = getPublicEvents()
            .filter(item => item.date === date)
            .sort((a, b) => `${a.start}-${a.end}`.localeCompare(`${b.start}-${b.end}`));
        if (hasUntimedGeneralDate(date)) {
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

function getUntimedGeneralDates() {
    return Array.isArray(PUBLIC_DATA.untimedGeneralDates) ? PUBLIC_DATA.untimedGeneralDates : [];
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
