const PUBLIC_DATA = window.TEACHER_PUBLIC_SCHEDULE || {};
const EXTENDED_TIME_MAX_MINUTES = 29 * 60 + 30;

const DEFAULT_TIMEZONES = [
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
    { value: "UTC+08:00", label: "台北（GMT+8）" },
    { value: "UTC+09:00", label: "東京（GMT+9）" },
    { value: "UTC+10:00", label: "雪梨（GMT+10）" },
    { value: "UTC+11:00", label: "索羅門群島（GMT+11）" },
    { value: "UTC+12:00", label: "奧克蘭（GMT+12）" },
    { value: "UTC+13:00", label: "東加（GMT+13）" },
    { value: "UTC+14:00", label: "基里巴斯（GMT+14）" }
];

const state = {
    displayTimeZone: PUBLIC_DATA.settings?.displayTimeZone || "UTC+09:00",
    monthDate: getInitialMonthDate()
};

const $ = id => document.getElementById(id);

function init() {
    populateTimezones();
    populateMonths();
    $("timezoneSelect").value = state.displayTimeZone;
    $("timezoneSelect").onchange = () => {
        state.displayTimeZone = $("timezoneSelect").value;
        render();
    };
    $("monthSelect").onchange = () => {
        const [year, month] = $("monthSelect").value.split("-").map(Number);
        state.monthDate = new Date(year, month - 1, 1);
        render();
    };
    $("prevMonthBtn").onclick = () => changeMonth(-1);
    $("nextMonthBtn").onclick = () => changeMonth(1);
    render();
}

function populateTimezones() {
    const zones = getAllTimeZones();
    $("timezoneSelect").innerHTML = "";
    zones.forEach(zone => $("timezoneSelect").add(new Option(zone.label, zone.value)));
}

function getAllTimeZones() {
    const zones = [...DEFAULT_TIMEZONES];
    (PUBLIC_DATA.settings?.customTimeZones || []).forEach(zone => {
        if (!zones.some(item => item.value === zone.value && item.label === zone.label)) zones.push(zone);
    });
    return zones;
}

function populateMonths() {
    const monthSet = new Set((PUBLIC_DATA.events || []).map(item => item.date?.slice(0, 7)).filter(Boolean));
    const now = new Date();
    monthSet.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
    $("monthSelect").innerHTML = "";
    Array.from(monthSet).sort().forEach(value => {
        const [year, month] = value.split("-");
        $("monthSelect").add(new Option(`${year} 年 ${Number(month)} 月`, value));
    });
}

function changeMonth(offset) {
    state.monthDate = new Date(state.monthDate.getFullYear(), state.monthDate.getMonth() + offset, 1);
    const value = `${state.monthDate.getFullYear()}-${String(state.monthDate.getMonth() + 1).padStart(2, "0")}`;
    if (!Array.from($("monthSelect").options).some(option => option.value === value)) {
        $("monthSelect").add(new Option(`${state.monthDate.getFullYear()} 年 ${state.monthDate.getMonth() + 1} 月`, value));
        Array.from($("monthSelect").options)
            .sort((a, b) => a.value.localeCompare(b.value))
            .forEach(option => $("monthSelect").add(option));
    }
    render();
}

function render() {
    const year = state.monthDate.getFullYear();
    const month = state.monthDate.getMonth();
    $("monthSelect").value = `${year}-${String(month + 1).padStart(2, "0")}`;
    $("pageTitle").innerText = `${year} 年 ${month + 1} 月不可預約的時間`;
    $("timezoneLabel").innerText = `時區：${getTimezoneLabelByValue(state.displayTimeZone)}`;
    $("updatedAt").innerText = `最後更新：${formatUpdatedAt(PUBLIC_DATA.updatedAt)}`;
    renderWeekdays();
    renderCalendar(year, month);
}

function renderWeekdays() {
    $("weekdays").innerHTML = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"]
        .map(day => `<div class="weekday">${day}</div>`)
        .join("");
}

function renderCalendar(year, month) {
    const grid = $("calendarGrid");
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const eventsByDate = {};
    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        eventsByDate[date] = (PUBLIC_DATA.events || [])
            .filter(item => item.date === date)
            .sort((a, b) => `${a.start}-${a.end}`.localeCompare(`${b.start}-${b.end}`));
    }

    let html = "";
    for (let i = 0; i < firstDay; i++) html += '<div class="day empty"></div>';
    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const slots = eventsByDate[date];
        html += `
            <div class="day">
                <span class="day-num">${day}</span>
                ${slots.length ? slots.map(item => `<div class="slot ${item.completed ? "completed" : ""}">${getDisplayTimeRange(item)}</div>`).join("") : '<div class="none">無</div>'}
            </div>
        `;
    }
    grid.innerHTML = html;
}

function getInitialMonthDate() {
    const events = PUBLIC_DATA.events || [];
    const firstEvent = events.find(item => item.date);
    if (firstEvent) {
        const [year, month] = firstEvent.date.split("-").map(Number);
        return new Date(year, month - 1, 1);
    }
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
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
    const extendedMinutes = getDateDiff(baseDate, displayDate) * 1440 + hour * 60 + minute;
    return {
        dateLabel,
        time,
        fullLabel: `${dateLabel} ${time}`,
        useExtended: extendedMinutes >= 0 && extendedMinutes <= EXTENDED_TIME_MAX_MINUTES,
        extendedTime: formatExtendedTime(extendedMinutes)
    };
}

function getOffsetMinutes(timeZone) {
    if (!/^UTC[+-]\d{2}:\d{2}$/.test(timeZone)) return 0;
    const sign = timeZone[3] === "+" ? 1 : -1;
    const [hour, minute] = timeZone.slice(4).split(":").map(Number);
    return sign * (hour * 60 + minute);
}

function getDateDiff(baseDate, displayDate) {
    const base = new Date(`${baseDate}T00:00:00`);
    const display = new Date(`${displayDate}T00:00:00`);
    return Math.round((display - base) / 86400000);
}

function formatExtendedTime(totalMinutes) {
    return `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
}

function formatUpdatedAt(value) {
    if (!value) return "尚未匯出";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function getTimezoneLabelByValue(value) {
    return getAllTimeZones().find(zone => zone.value === value)?.label || value.replace("UTC", "GMT");
}

init();
