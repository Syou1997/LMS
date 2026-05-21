let currentSelectedDate = "";
// LocalStorage 內一律儲存「台灣時間基準 (GMT+8)」的資料
let events = JSON.parse(localStorage.getItem('teacherEvents')) || [];
// 目前介面顯示的時區：'TW' 或 'JP'
let currentDisplayTimezone = "TW"; 

const yearSelect = document.getElementById('yearSelect');
const monthSelect = document.getElementById('monthSelect');
const calendarGrid = document.getElementById('calendarGrid');
const timezoneSelect = document.getElementById('timezoneSelect');
const timezoneFlag = document.getElementById('timezoneFlag');

function init() {
    const now = new Date();
    currentSelectedDate = formatDate(now);

    // 年份與月份下拉
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
    document.getElementById('backToToday').onclick = goToday;
    document.getElementById('exportCalendarBtn').onclick = exportToGoogleCalendar;

    // 時區變更監聽
    timezoneSelect.onchange = function() {
        currentDisplayTimezone = this.value;
        timezoneFlag.innerText = currentDisplayTimezone === "TW" ? "🇹🇼" : "🇯🇵";
        renderCalendar();
        if (document.getElementById('detailModal').style.display === 'block') {
            updateDetailModal();
        }
    };

    // 連動結束時間 (開始時間 + 50分)
    document.getElementById('startTimeSelect').addEventListener('change', function() {
        const startVal = this.value;
        let [h, m] = startVal.split(':').map(Number);
        let endM = m + 50;
        let endH = h;
        if (endM >= 60) { endH += 1; endM -= 60; }
        if (endH >= 24) endH = 0;
        const endVal = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
        
        ensureTimeOptionExists('endTimeSelect', endVal);
        document.getElementById('endTimeSelect').value = endVal;
    });
}

// 核心時間轉換工具：傳入 HH:MM 格式與轉換方向，回傳調整後的 HH:MM
// direction: 1 代表台灣轉日本 (+1小時)，-1 代表日本轉台灣 (-1小時)
function convertTimeStr(timeStr, direction) {
    if (!timeStr || !timeStr.includes(':')) return timeStr;
    let [h, m] = timeStr.split(':').map(Number);
    h += direction;
    if (h >= 24) h -= 24;
    if (h < 0) h += 24;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function ensureTimeOptionExists(selectId, timeVal) {
    const select = document.getElementById(selectId);
    const exists = Array.from(select.options).some(opt => opt.value === timeVal);
    if(!exists) {
        select.add(new Option(timeVal, timeVal));
    }
}

function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}

function fillTimeOptions() {
    const starts = document.getElementById('startTimeSelect');
    const ends = document.getElementById('endTimeSelect');
    let html = "";
    for (let h = 0; h < 24; h++) {
        for (let m of ['00', '30']) {
            const t = `${String(h).padStart(2, '0')}:${m}`;
            html += `<option value="${t}">${t}</option>`;
        }
    }
    starts.innerHTML = html;
    ends.innerHTML = html;
}

function getPlatformClass(platform) {
    switch (platform) {
        case '聯成外語': return 'platform-lct';
        case 'AmazingTalker': return 'platform-at';
        case 'Preply': return 'platform-preply';
        case '日本語學校': return 'platform-jp';
        case '私人ZOOM': return 'platform-zoom';
        default: return 'platform-default';
    }
}

function renderCalendar() {
    calendarGrid.innerHTML = '';
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);

    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = firstDay; 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = formatDate(new Date());

    for (let i = 0; i < startOffset; i++) {
        calendarGrid.appendChild(Object.assign(document.createElement('div'), { className: 'day-cell empty' }));
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const cell = document.createElement('div');
        cell.className = `day-cell ${dateStr === todayStr ? 'is-today' : ''} ${dateStr === currentSelectedDate ? 'selected' : ''}`;
        
        let cellHTML = `<span class="day-num">${d}</span><div class="event-list-mini">`;
        
        // 抓出當天行程，並依時間排序
        const dayEvents = events.filter(e => e.date === dateStr).sort((a, b) => a.start.localeCompare(b.start));

        dayEvents.forEach(e => {
            const pClass = getPlatformClass(e.platform);
            // 根據目前顯示時區進行前端渲染轉換 (若為日本時區，將資料庫儲存的台灣時間 +1 小時)
            let displayStart = e.start;
            let displayEnd = e.end;
            if (currentDisplayTimezone === "JP") {
                displayStart = convertTimeStr(e.start, 1);
                displayEnd = convertTimeStr(e.end, 1);
            }

            cellHTML += `
                <div class="event-tag-item ${pClass}">
                    <span>${displayStart}-${displayEnd}</span>
                    <div class="event-tag-actions">
                        <i class="fas fa-pen edit-icon-mini" onclick="openEditModal('${e.id}', event)"></i>
                        <i class="fas fa-times del-icon-mini" onclick="openDeleteModal('${e.id}', event)"></i>
                    </div>
                </div>`;
        });
        cellHTML += `</div>`;
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
    if (type === 'platform') {
        document.getElementById('platformSelect').classList.toggle('hidden');
        document.getElementById('platformInput').classList.toggle('hidden');
    } else {
        document.getElementById('timeSelectGroup').classList.toggle('hidden');
        document.getElementById('timeInputGroup').classList.toggle('hidden');
    }
}

function openAddModal(dateStr) {
    currentSelectedDate = dateStr;
    document.getElementById('editEventId').value = "";
    document.getElementById('addModalDateTitle').innerText = `新增排課：${dateStr}`;
    document.getElementById('modalTimezoneHint').innerText = `(目前使用：${currentDisplayTimezone === 'TW' ? '台灣時間' : '日本時間'})`;
    document.getElementById('scheduleForm').reset();
    document.getElementById('addModal').style.display = 'block';
}

function openEditModal(id, e) {
    if(e) e.stopPropagation();
    const target = events.find(ev => ev.id === id);
    if(!target) return;

    document.getElementById('editEventId').value = id;
    document.getElementById('addModalDateTitle').innerText = `編輯課程：${target.date}`;
    document.getElementById('modalTimezoneHint').innerText = `(目前使用：${currentDisplayTimezone === 'TW' ? '台灣時間' : '日本時間'})`;
    
    const pSelect = document.getElementById('platformSelect');
    const options = Array.from(pSelect.options).map(o => o.value);
    if(options.includes(target.platform)) {
        pSelect.value = target.platform;
        pSelect.classList.remove('hidden');
        document.getElementById('platformInput').classList.add('hidden');
    } else {
        document.getElementById('platformInput').value = target.platform;
        document.getElementById('platformInput').classList.remove('hidden');
        pSelect.classList.add('hidden');
    }

    document.getElementById('courseFee').value = target.fee;
    document.getElementById('studentName').value = target.student;
    
    // 編輯載入時，如果介面為日本時區，需將資料庫儲存的台灣時間轉成日本時間顯示在選單上
    let displayStart = target.start;
    let displayEnd = target.end;
    if (currentDisplayTimezone === "JP") {
        displayStart = convertTimeStr(target.start, 1);
        displayEnd = convertTimeStr(target.end, 1);
    }

    ensureTimeOptionExists('startTimeSelect', displayStart);
    ensureTimeOptionExists('endTimeSelect', displayEnd);
    
    document.getElementById('startTimeSelect').value = displayStart;
    document.getElementById('endTimeSelect').value = displayEnd;
    document.getElementById('courseContent').value = target.content;

    document.getElementById('addModal').style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

document.getElementById('scheduleForm').onsubmit = function(e) {
    e.preventDefault();
    const editId = document.getElementById('editEventId').value;
    const platform = !document.getElementById('platformInput').classList.contains('hidden') ? 
                      document.getElementById('platformInput').value : document.getElementById('platformSelect').value;
    
    let start = !document.getElementById('timeInputGroup').classList.contains('hidden') ? 
                   document.getElementById('startTimeInput').value : document.getElementById('startTimeSelect').value;
    let end = !document.getElementById('timeInputGroup').classList.contains('hidden') ? 
                 document.getElementById('endTimeInput').value : document.getElementById('endTimeSelect').value;

    // 儲存邏輯：如果在日本時區輸入，需要將輸入的時間 -1 小時換算回台灣時間再進行儲存
    if (currentDisplayTimezone === "JP") {
        start = convertTimeStr(start, -1);
        end = convertTimeStr(end, -1);
    }

    const eventData = {
        platform,
        fee: parseFloat(document.getElementById('courseFee').value) || 0,
        student: document.getElementById('studentName').value || "未填寫",
        start,
        end,
        content: document.getElementById('courseContent').value
    };

    if(editId) {
        const index = events.findIndex(ev => ev.id === editId);
        if(index !== -1) {
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
    closeModal('addModal');
    renderCalendar();
};

let delTargetId = null;
function openDeleteModal(id, e) {
    e.stopPropagation();
    delTargetId = id;
    const target = events.find(ev => ev.id === id);
    const infoBox = document.getElementById('deleteTargetInfo');
    
    if(target) {
        let displayStart = target.start;
        let displayEnd = target.end;
        if (currentDisplayTimezone === "JP") {
            displayStart = convertTimeStr(target.start, 1);
            displayEnd = convertTimeStr(target.end, 1);
        }

        infoBox.innerHTML = `
            <p><strong>日期：</strong>${target.date}</p>
            <p><strong>平台：</strong>${target.platform}</p>
            <p><strong>學生：</strong>${target.student}</p>
            <p><strong>時間：</strong>${displayStart} ~ ${displayEnd} (${currentDisplayTimezone === 'TW' ? '台灣時間' : '日本時間'})</p>
            <p><strong>費用：</strong>NT$ ${target.fee}</p>
        `;
    }
    document.getElementById('deleteModal').style.display = 'block';
}

document.getElementById('confirmDelBtn').onclick = () => {
    events = events.filter(e => e.id !== delTargetId);
    saveData();
    closeModal('deleteModal');
    renderCalendar();
};

function updateFooterStats() {
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    
    // 獲取當前使用者的本地時間
    const now = new Date();

    const monthEvents = events.filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() === month;
    });
    document.getElementById('monthCount').innerText = monthEvents.length;

    let totalMinutes = 0;
    monthEvents.forEach(e => {
        const [sH, sM] = e.start.split(':').map(Number);
        const [eH, eM] = e.end.split(':').map(Number);
        const duration = (eH * 60 + eM) - (sH * 60 + sM);
        if (duration > 0) totalMinutes += duration;
    });
    document.getElementById('monthHours').innerText = Math.floor(totalMinutes / 60);

    const selectedDayEvents = events.filter(e => e.date === currentSelectedDate);
    document.getElementById('selectedDateLabel').innerText = (currentSelectedDate === formatDate(now)) ? "今日" : currentSelectedDate.slice(5);
    document.getElementById('selectedDayCount').innerText = selectedDayEvents.length;

    let currentInc = 0;
    let estimatedInc = 0;

    monthEvents.forEach(e => {
        const fee = e.fee || 0;
        estimatedInc += fee;
        
        // 由於資料庫儲存的是台灣時間，不論使用者身在日本或台灣，皆以台灣時區 (GMT+0800) 來還原課程完結時間點
        const eventEndDateTime = new Date(`${e.date}T${e.end}:00+08:00`);
        if (eventEndDateTime < now) currentInc += fee;
    });

    document.getElementById('currentIncome').innerText = currentInc.toLocaleString();
    document.getElementById('estimatedIncome').innerText = estimatedInc.toLocaleString();
}

document.getElementById('showDayDetailBtn').onclick = () => {
    if(!currentSelectedDate) return;
    updateDetailModal();
    document.getElementById('detailModal').style.display = 'block';
}

function updateDetailModal() {
    document.getElementById('detailDateTitle').innerText = `${currentSelectedDate} (${currentDisplayTimezone === 'TW' ? '台灣時間' : '日本時間'})`;
    const list = document.getElementById('detailList');
    list.innerHTML = '';
    const dayEvents = events.filter(e => e.date === currentSelectedDate).sort((a,b) => a.start.localeCompare(b.start));
    
    if(dayEvents.length === 0) {
        list.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">無行程</p>';
    } else {
        dayEvents.forEach(e => {
            let displayStart = e.start;
            let displayEnd = e.end;
            if (currentDisplayTimezone === "JP") {
                displayStart = convertTimeStr(e.start, 1);
                displayEnd = convertTimeStr(e.end, 1);
            }

            list.innerHTML += `
                <div style="padding:15px; border-bottom:1px solid #eee; position:relative;">
                    <div style="position:absolute; right:15px; top:15px; display:flex; gap:10px;">
                        <i class="fas fa-pen" style="cursor:pointer; color:#4a90e2;" onclick="openEditModal('${e.id}')"></i>
                        <i class="fas fa-times" style="cursor:pointer; color:#e74c3c;" onclick="openDeleteModal('${e.id}', event)"></i>
                    </div>
                    <strong>${displayStart}-${displayEnd} | ${e.platform}</strong><br>
                    <small>學生：${e.student} | 費用：NT$ ${e.fee}</small><br>
                    <p style="font-size:13px; color:#666; margin-top:5px;">${e.content || ''}</p>
                </div>`;
        });
    }
}

function saveData() { localStorage.setItem('teacherEvents', JSON.stringify(events)); }

function goToday() {
    const now = new Date();
    yearSelect.value = now.getFullYear();
    monthSelect.value = now.getMonth();
    currentSelectedDate = formatDate(now);
    renderCalendar();
}

function changeDate(offset) {
    let d = new Date(currentSelectedDate);
    d.setDate(d.getDate() + offset);
    currentSelectedDate = formatDate(d);
    yearSelect.value = d.getFullYear();
    monthSelect.value = d.getMonth();
    renderCalendar();
    if(document.getElementById('detailModal').style.display === 'block') {
        updateDetailModal();
    }
}

// 新增：匯出當月行程為 .ics 檔案供 Google Calendar 匯入
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
        // 將儲存的日期與時間結合成標準格式
        const datePart = e.date.replace(/-/g, ""); // YYYYMMDD
        const startPart = e.start.replace(/:/g, "") + "00"; // HHMMSS
        const endPart = e.end.replace(/:/g, "") + "00"; // HHMMSS

        icsContent.push("BEGIN:VEVENT");
        icsContent.push(`UID:${e.id}@syoulive.com`);
        icsContent.push(`DTSTAMP:${datePart}T${startPart}`);
        // 核心：由於內部位台灣時間，直接標註 TZID=Asia/Taipei 讓 Google 行事曆匯入時自動辨識與轉換
        icsContent.push(`DTSTART;TZID=Asia/Taipei:${datePart}T${startPart}`);
        icsContent.push(`DTEND;TZID=Asia/Taipei:${datePart}T${endPart}`);
        icsContent.push(`SUMMARY:[${e.platform}] ${e.student} 日文課`);
        
        let description = `學生: ${e.student}\\n平台: ${e.platform}\\n學費: NT$ ${e.fee}`;
        if (e.content) {
            description += `\\n課程進度內容: ${e.content.replace(/\n/g, '\\n')}`;
        }
        icsContent.push(`DESCRIPTION:${description}`);
        icsContent.push("END:VEVENT");
    });

    icsContent.push("END:VCALENDAR");

    // 打包成 Blob 檔案物件並觸發下載
    const blob = new Blob([icsContent.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `日文課程行程表_${year}年_${month + 1}月.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

init();

