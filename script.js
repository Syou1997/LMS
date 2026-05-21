let currentSelectedDate = "";
let events = JSON.parse(localStorage.getItem("teacherEvents")) || [];
let currentDisplayTimezone = "TW";
let delTargetId = null;
let latestPreviewImage = null;

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

    for (let i = now.getFullYear() - 5; i <= now.getFullYear() + 5; i++) {
        const opt = new Option(`${i}年`, i);
        if (i === now.getFullYear()) opt.selected = true;
        yearSelect.add(opt);
    }

    for (let i = 0; i < 12; i++) {
        const opt = new Option(`${i + 1}月`, i);
        if (i === now.getMonth()) opt.selected = true;
        monthSelect.add(opt);
    }

    fillTimeOptions();
    renderCalendar();

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
        const activeTag = document.activeElement.tagName.toLowerCase();
        const isTyping = activeTag === "input" || activeTag === "textarea" || activeTag === "select";

        if (isTyping) return;

        if (e.key === "ArrowLeft") changeMonth(-1);
        if (e.key === "ArrowRight") changeMonth(1);
    });

    timezoneSelect.onchange = function () {
        currentDisplayTimezone = this.value;
        timezoneFlag.innerText = currentDisplayTimezone === "TW" ? "🇹🇼" : "🇯🇵";
        renderCalendar();

        if (document.getElementById("detailModal").style.display === "block") {
            updateDetailModal();
        }
    };

    document.getElementById("startTimeSelect").addEventListener("change", function () {
        const startVal = this.value;
        let [h, m] = startVal.split(":").map(Number);
        let endM = m + 50;
        let endH = h;

        if (endM >= 60) {
            endH += 1;
            endM -= 60;
        }

        if (endH >= 24) endH = 0;

        const endVal = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
        ensureTimeOptionExists("endTimeSelect", endVal);
        document.getElementById("endTimeSelect").value = endVal;
    });
}

function convertTimeStr(timeStr, direction) {
    if (!timeStr || !timeStr.includes(":")) return timeStr;

    let [h, m] = timeStr.split(":").map(Number);
    h += direction;

    if (h >= 24) h -= 24;
    if (h < 0) h += 24;

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function timeToMinutes(timeStr) {
    if (!timeStr || !timeStr.includes(":")) return null;

    const [h, m] = timeStr.split(":").map(Number);

    if (
        Number.isNaN(h) ||
        Number.isNaN(m) ||
        h < 0 ||
        h > 23 ||
        m < 0 ||
        m > 59
    ) {
        return null;
    }

    return h * 60 + m;
}

function getEventEndDateTime(eventItem) {
    return new Date(`${eventItem.date}T${eventItem.end}:00+08:00`);
}

function isEventCompleted(eventItem) {
    return getEventEndDateTime(eventItem) < new Date();
}

function isDayCompleted(dayEvents) {
    return dayEvents.length > 0 && dayEvents.every(isEventCompleted);
}

function getDisplayTimeRange(eventItem) {
    let displayStart = eventItem.start;
    let displayEnd = eventItem.end;

    if (currentDisplayTimezone === "JP") {
        displayStart = convertTimeStr(eventItem.start, 1);
        displayEnd = convertTimeStr(eventItem.end, 1);
    }

    return `${displayStart}-${displayEnd}`;
}

function getTimezoneLabel() {
    return currentDisplayTimezone === "TW" ? "台灣時間 GMT+8" : "日本時間 GMT+9";
}

function getSearchKeyword() {
    return searchInput.value.trim().toLowerCase();
}

function eventMatchesSearch(eventItem) {
    const keyword = getSearchKeyword();

    if (!keyword) return true;

    return [
        eventItem.platform,
        eventItem.student,
        eventItem.content,
        eventItem.date,
        eventItem.start,
        eventItem.end
    ].some(value => String(value || "").toLowerCase().includes(keyword));
}

function hasTimeConflict(dateStr, start, end, editId) {
    const newStart = timeToMinutes(start);
    const newEnd = timeToMinutes(end);

    return events.some(eventItem => {
        if (eventItem.date !== dateStr) return false;
        if (editId && eventItem.id === editId) return false;

        const existingStart = timeToMinutes(eventItem.start);
        const existingEnd = timeToMinutes(eventItem.end);

        return newStart < existingEnd && newEnd > existingStart;
    });
}

function ensureTimeOptionExists(selectId, timeVal) {
    const select = document.getElementById(selectId);
    const exists = Array.from(select.options).some(opt => opt.value === timeVal);

    if (!exists) {
        select.add(new Option(timeVal, timeVal));
    }
}

function formatDate(date) {
    const d = new Date(date);
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
}

function fillTimeOptions() {
    const starts = document.getElementById("startTimeSelect");
    const ends = document.getElementById("endTimeSelect");
    let html = "";

    for (let h = 0; h < 24; h++) {
        for (let m of ["00", "30"]) {
            const t = `${String(h).padStart(2, "0")}:${m}`;
            html += `<option value="${t}">${t}</option>`;
        }
    }

    starts.innerHTML = html;
    ends.innerHTML = html;
}

function getPlatformClass(platform) {
    switch (platform) {
        case "聯成外語": return "platform-lct";
        case "AmazingTalker": return "platform-at";
        case "Preply": return "platform-preply";
        case "日本語學校": return "platform-jp";
        case "私人ZOOM": return "platform-zoom";
        default: return "platform-default";
    }
}

function renderCalendar() {
    calendarGrid.innerHTML = "";

    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = formatDate(new Date());

    for (let i = 0; i < firstDay; i++) {
        calendarGrid.appendChild(Object.assign(document.createElement("div"), {
            className: "day-cell empty"
        }));
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const cell = document.createElement("div");

        const allDayEvents = events
            .filter(e => e.date === dateStr)
            .sort((a, b) => a.start.localeCompare(b.start));

        const visibleDayEvents = allDayEvents.filter(eventMatchesSearch);
        const completedClass = isDayCompleted(allDayEvents) ? "completed-day" : "";

        cell.className = `day-cell ${completedClass} ${dateStr === todayStr ? "is-today" : ""} ${dateStr === currentSelectedDate ? "selected" : ""}`;

        let cellHTML = `
            <div class="day-num-row">
                <span class="day-num">${d}</span>
                ${dateStr === todayStr ? '<span class="today-badge">今天</span>' : ""}
            </div>
            <div class="event-list-mini">`;

        visibleDayEvents.forEach(e => {
            const pClass = getPlatformClass(e.platform);
            const displayTime = getDisplayTimeRange(e);
            const completedEventClass = isEventCompleted(e) ? "completed-event" : "";

            cellHTML += `
                <div class="event-tag-item ${pClass} ${completedEventClass}">
                    <span>${displayTime}</span>
                    <div class="event-tag-actions">
                        <i class="fas fa-pen edit-icon-mini" onclick="openEditModal('${e.id}', event)"></i>
                        <i class="fas fa-times del-icon-mini" onclick="openDeleteModal('${e.id}', event)"></i>
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

    document.getElementById("editEventId").value = "";
    document.getElementById("addModalDateTitle").innerText = `新增排課：${dateStr}`;
    document.getElementById("modalTimezoneHint").innerText = `（目前使用：${currentDisplayTimezone === "TW" ? "台灣時間" : "日本時間"}）`;
    document.getElementById("scheduleForm").reset();
    document.getElementById("addModal").style.display = "block";
}

function openEditModal(id, e) {
    if (e) e.stopPropagation();

    const target = events.find(ev => ev.id === id);
    if (!target) return;

    document.getElementById("editEventId").value = id;
    document.getElementById("addModalDateTitle").innerText = `編輯課程：${target.date}`;
    document.getElementById("modalTimezoneHint").innerText = `（目前使用：${currentDisplayTimezone === "TW" ? "台灣時間" : "日本時間"}）`;

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

    let displayStart = target.start;
    let displayEnd = target.end;

    if (currentDisplayTimezone === "JP") {
        displayStart = convertTimeStr(target.start, 1);
        displayEnd = convertTimeStr(target.end, 1);
    }

    ensureTimeOptionExists("startTimeSelect", displayStart);
    ensureTimeOptionExists("endTimeSelect", displayEnd);

    document.getElementById("startTimeSelect").value = displayStart;
    document.getElementById("endTimeSelect").value = displayEnd;
    document.getElementById("courseContent").value = target.content;

    document.getElementById("addModal").style.display = "block";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

document.getElementById("scheduleForm").onsubmit = function (e) {
    e.preventDefault();

    const editId = document.getElementById("editEventId").value;

    const platform = !document.getElementById("platformInput").classList.contains("hidden")
        ? document.getElementById("platformInput").value
        : document.getElementById("platformSelect").value;

    let start = !document.getElementById("timeInputGroup").classList.contains("hidden")
        ? document.getElementById("startTimeInput").value
        : document.getElementById("startTimeSelect").value;

    let end = !document.getElementById("timeInputGroup").classList.contains("hidden")
        ? document.getElementById("endTimeInput").value
        : document.getElementById("endTimeSelect").value;

    if (currentDisplayTimezone === "JP") {
        start = convertTimeStr(start, -1);
        end = convertTimeStr(end, -1);
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

    const targetDate = editId
        ? events.find(ev => ev.id === editId)?.date || currentSelectedDate
        : currentSelectedDate;

    if (hasTimeConflict(targetDate, start, end, editId)) {
        alert("這個時段已經有安排課程，無法新增或儲存排課。請選擇其他時間。");
        return;
    }

    const eventData = {
        platform,
        fee: parseFloat(document.getElementById("courseFee").value) || 0,
        student: document.getElementById("studentName").value || "未填寫",
        start,
        end,
        content: document.getElementById("courseContent").value
    };

    if (editId) {
        const index = events.findIndex(ev => ev.id === editId);

        if (index !== -1) {
            events[index] = { ...events[index], ...eventData };
        }
    } else {
        const newEvent = {
            id: Date.now().toString(),
            date: currentSelectedDate,
            ...eventData
        };

        events.push(newEvent);
    }

    saveData();
    closeModal("addModal");
    renderCalendar();
};

function openDeleteModal(id, e) {
    if (e) e.stopPropagation();

    delTargetId = id;
    const target = events.find(ev => ev.id === id);
    const infoBox = document.getElementById("deleteTargetInfo");

    if (target) {
        const displayTime = getDisplayTimeRange(target);

        infoBox.innerHTML = `
            <p><strong>日期：</strong>${target.date}</p>
            <p><strong>平台：</strong>${target.platform}</p>
            <p><strong>學生：</strong>${target.student}</p>
            <p><strong>時間：</strong>${displayTime}（${currentDisplayTimezone === "TW" ? "台灣時間" : "日本時間"}）</p>
            <p><strong>費用：</strong>NT$ ${target.fee}</p>
        `;
    }

    document.getElementById("deleteModal").style.display = "block";
}

document.getElementById("confirmDelBtn").onclick = () => {
    events = events.filter(e => e.id !== delTargetId);
    saveData();
    closeModal("deleteModal");
    renderCalendar();
};

function updateFooterStats() {
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    const now = new Date();

    const monthEvents = events.filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() === month;
    });

    document.getElementById("monthCount").innerText = monthEvents.length;

    let totalMinutes = 0;
    let completedCount = 0;
    let estimatedInc = 0;

    monthEvents.forEach(e => {
        const [sH, sM] = e.start.split(":").map(Number);
        const [eH, eM] = e.end.split(":").map(Number);
        const duration = (eH * 60 + eM) - (sH * 60 + sM);

        if (duration > 0) totalMinutes += duration;
        if (getEventEndDateTime(e) < now) completedCount += 1;

        estimatedInc += e.fee || 0;
    });

    const completionRate = monthEvents.length === 0
        ? 0
        : Math.round((completedCount / monthEvents.length) * 100);

    document.getElementById("monthHours").innerText = Math.floor(totalMinutes / 60);
    document.getElementById("monthCompletionRate").innerText = `${completionRate}%`;
    document.getElementById("completionProgress").style.width = `${completionRate}%`;

    const selectedDayEvents = events.filter(e => e.date === currentSelectedDate);
    document.getElementById("selectedDateLabel").innerText = currentSelectedDate === formatDate(now)
        ? "今日"
        : currentSelectedDate.slice(5);

    document.getElementById("selectedDayCount").innerText = selectedDayEvents.length;
    document.getElementById("estimatedIncome").innerText = estimatedInc.toLocaleString();
}

document.getElementById("showDayDetailBtn").onclick = () => {
    if (!currentSelectedDate) return;

    updateDetailModal();
    document.getElementById("detailModal").style.display = "block";
};

function updateDetailModal() {
    document.getElementById("detailDateTitle").innerText = `${currentSelectedDate}（${currentDisplayTimezone === "TW" ? "台灣時間" : "日本時間"}）`;

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
        const displayTime = getDisplayTimeRange(e);
        const completedText = isEventCompleted(e) ? "｜已完成" : "";

        list.innerHTML += `
            <div style="padding:15px; border-bottom:1px solid #eee; position:relative; opacity:${isEventCompleted(e) ? "0.62" : "1"};">
                <div style="position:absolute; right:15px; top:15px; display:flex; gap:10px;">
                    <i class="fas fa-pen" style="cursor:pointer; color:#4a90e2;" onclick="openEditModal('${e.id}')"></i>
                    <i class="fas fa-times" style="cursor:pointer; color:#e74c3c;" onclick="openDeleteModal('${e.id}', event)"></i>
                </div>
                <strong>${displayTime} ｜ ${e.platform}${completedText}</strong><br>
                <small>學生：${e.student} ｜ 費用：NT$ ${e.fee}</small><br>
                <p style="font-size:13px; color:#666; margin-top:5px;">${e.content || ""}</p>
            </div>`;
    });
}

function saveData() {
    localStorage.setItem("teacherEvents", JSON.stringify(events));
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

    yearSelect.value = year;
    monthSelect.value = month;

    const selectedDay = new Date(currentSelectedDate).getDate();
    const daysInTargetMonth = new Date(year, month + 1, 0).getDate();
    const safeDay = Math.min(selectedDay, daysInTargetMonth);

    currentSelectedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(safeDay).padStart(2, "0")}`;
    renderCalendar();
}

function changeDate(offset) {
    let d = new Date(currentSelectedDate);

    d.setDate(d.getDate() + offset);
    currentSelectedDate = formatDate(d);
    yearSelect.value = d.getFullYear();
    monthSelect.value = d.getMonth();

    renderCalendar();

    if (document.getElementById("detailModal").style.display === "block") {
        updateDetailModal();
    }
}

function exportToGoogleCalendar() {
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);

    const monthEvents = events.filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() === month;
    });

    if (monthEvents.length === 0) {
        alert("本月份沒有任何排課行程可供匯出！");
        return;
    }

    let icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Teacher Schedule Management System//Professional Edition//ZH",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH"
    ];

    monthEvents.forEach(e => {
        const datePart = e.date.replace(/-/g, "");
        const startPart = e.start.replace(/:/g, "") + "00";
        const endPart = e.end.replace(/:/g, "") + "00";

        icsContent.push("BEGIN:VEVENT");
        icsContent.push(`UID:${e.id}@syoulive.com`);
        icsContent.push(`DTSTAMP:${datePart}T${startPart}`);
        icsContent.push(`DTSTART;TZID=Asia/Taipei:${datePart}T${startPart}`);
        icsContent.push(`DTEND;TZID=Asia/Taipei:${datePart}T${endPart}`);
        icsContent.push(`SUMMARY:[${e.platform}] ${e.student} 日文課`);

        let description = `學生: ${e.student}\\n平台: ${e.platform}\\n學費: NT$ ${e.fee}`;

        if (e.content) {
            description += `\\n課程進度內容: ${e.content.replace(/\n/g, "\\n")}`;
        }

        icsContent.push(`DESCRIPTION:${description}`);
        icsContent.push("END:VEVENT");
    });

    icsContent.push("END:VCALENDAR");

    const blob = new Blob([icsContent.join("\r\n")], {
        type: "text/calendar;charset=utf-8"
    });

    downloadBlob(blob, `日文課程行程表_${year}年_${month + 1}月.ics`);
}

function openScheduleImagePreview() {
    latestPreviewImage = createScheduleImageData();
    document.getElementById("schedulePreviewImage").src = latestPreviewImage.dataUrl;
    document.getElementById("imagePreviewModal").style.display = "block";
}

function downloadPreviewImage() {
    if (!latestPreviewImage) {
        latestPreviewImage = createScheduleImageData();
    }

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
    const totalCells = firstDay + daysInMonth;
    const weekCount = Math.ceil(totalCells / 7);

    const monthEventsByDate = {};

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

        monthEventsByDate[dateStr] = events
            .filter(e => e.date === dateStr)
            .sort((a, b) => a.start.localeCompare(b.start));
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const scale = 2;
    const width = 1400;
    const padding = 48;
    const titleHeight = 120;
    const weekdayHeight = 52;
    const footerHeight = 48;
    const cellWidth = (width - padding * 2) / 7;
    const baseCellHeight = 120;
    const itemHeight = 30;

    const rowHeights = [];

    for (let week = 0; week < weekCount; week++) {
        let maxItems = 0;

        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const cellIndex = week * 7 + dayIndex;
            const dayNum = cellIndex - firstDay + 1;

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
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(scale, scale);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#1e3c72";
    ctx.fillRect(0, 0, width, titleHeight + padding);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 40px Microsoft JhengHei, Arial";
    ctx.fillText(`${year} 年 ${month + 1} 月不可預約的時間`, padding, 76);

    ctx.font = "22px Microsoft JhengHei, Arial";
    ctx.fillText(`時區：${getTimezoneLabel()}`, padding, 112);

    ctx.textAlign = "right";
    ctx.fillText("教師：Syou", width - padding, 112);
    ctx.textAlign = "left";

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
            const cellIndex = week * 7 + dayIndex;
            const dayNum = cellIndex - firstDay + 1;
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
                ctx.fillText("無排課", x + 16, y + 68);
            } else {
                dayEvents.forEach((eventItem, eventIndex) => {
                    const itemY = y + 52 + eventIndex * itemHeight;
                    const timeText = getDisplayTimeRange(eventItem);

                    ctx.fillStyle = isEventCompleted(eventItem) ? "#eef1f4" : "#e9f3ff";
                    roundRect(ctx, x + 14, itemY, cellWidth - 28, 24, 8, true, false);

                    ctx.fillStyle = isEventCompleted(eventItem) ? "#697386" : "#1f5f99";
                    ctx.font = "bold 17px Microsoft JhengHei, Arial";
                    ctx.fillText(timeText, x + 26, itemY + 17);
                });
            }
        }

        y += rowHeight;
    }

    ctx.fillStyle = "#667085";
    ctx.font = "18px Microsoft JhengHei, Arial";
    ctx.textAlign = "center";
    ctx.fillText("圖片顯示的時間為已有排課的時間。", width / 2, height - 18);

    return {
        dataUrl: canvas.toDataURL("image/png"),
        fileName: `Syou_${year}年${month + 1}月不可預約時間_${currentDisplayTimezone === "TW" ? "台灣時間" : "日本時間"}.png`
    };
}

function exportBackup() {
    const backupData = {
        app: "Syou Teacher Schedule",
        version: 1,
        exportedAt: new Date().toISOString(),
        timezoneBase: "Asia/Taipei",
        events
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json;charset=utf-8"
    });

    const today = formatDate(new Date());
    downloadBlob(blob, `Syou_teacher_schedule_backup_${today}.json`);
}

function importBackup(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {
        try {
            const parsed = JSON.parse(reader.result);
            const importedEvents = Array.isArray(parsed) ? parsed : parsed.events;

            if (!Array.isArray(importedEvents)) {
                alert("備份檔格式不正確，請選擇這個 APP 匯出的 JSON 檔。");
                return;
            }

            const isValid = importedEvents.every(item =>
                item &&
                typeof item.date === "string" &&
                typeof item.start === "string" &&
                typeof item.end === "string"
            );

            if (!isValid) {
                alert("備份檔內容不完整，無法匯入。");
                return;
            }

            const confirmImport = confirm("匯入備份會取代目前所有排課資料。確定要匯入嗎？");

            if (!confirmImport) return;

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

            saveData();
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
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
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

init();