// Attendance Tracker
const attendanceManager = {
    records: new Set(),
    trackingPeriod: 30,
    storageKey: 'chessmaster_attendance'
};

// Initialize Attendance
function initAttendance() {
    loadAttendance();
    setupAttendanceControls();
    updateAttendanceDisplay();
}

// Load attendance from localStorage
function loadAttendance() {
    const saved = localStorage.getItem(attendanceManager.storageKey);
    if (saved) {
        attendanceManager.records = new Set(JSON.parse(saved));
    }
}

// Save attendance to localStorage
function saveAttendance() {
    localStorage.setItem(
        attendanceManager.storageKey,
        JSON.stringify([...attendanceManager.records])
    );
}

// Record attendance for today
window.recordAttendance = function() {
    const today = new Date().toDateString();
    if (!attendanceManager.records.has(today)) {
        attendanceManager.records.add(today);
        saveAttendance();
        updateAttendanceDisplay();
    }
};

// Setup attendance controls
function setupAttendanceControls() {
    const periodButtons = document.querySelectorAll('.period-btn');
    const customPeriodDiv = document.getElementById('customPeriod');
    const customDaysInput = document.getElementById('customDays');
    
    periodButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            periodButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const period = btn.dataset.period;
            
            if (period === 'custom') {
                customPeriodDiv.style.display = 'block';
            } else {
                customPeriodDiv.style.display = 'none';
                attendanceManager.trackingPeriod = parseInt(period);
                updateAttendanceDisplay();
            }
        });
    });
    
    customDaysInput.addEventListener('change', (e) => {
        const days = parseInt(e.target.value);
        if (days > 0) {
            attendanceManager.trackingPeriod = days;
            updateAttendanceDisplay();
        }
    });
}

// Update attendance display
function updateAttendanceDisplay() {
    const stats = calculateAttendanceStats();
    
    document.getElementById('attendanceRate').textContent = `${stats.rate}%`;
    document.getElementById('daysPlayed').textContent = stats.daysPlayed;
    document.getElementById('missedDays').textContent = stats.missedDays;
    document.getElementById('currentStreak').textContent = stats.currentStreak;
    
    renderCalendar();
}

// Calculate attendance statistics
function calculateAttendanceStats() {
    const period = attendanceManager.trackingPeriod;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    
    let daysPlayed = 0;
    let currentStreak = 0;
    let streakActive = true;
    
    for (let i = 0; i < period; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toDateString();
        
        if (attendanceManager.records.has(dateStr)) {
            daysPlayed++;
            if (streakActive) {
                currentStreak++;
            }
        } else {
            streakActive = false;
        }
    }
    
    const missedDays = period - daysPlayed;
    const rate = Math.round((daysPlayed / period) * 100);
    
    return {
        daysPlayed,
        missedDays,
        rate,
        currentStreak
    };
}

// Render calendar
function renderCalendar() {
    const calendarContainer = document.getElementById('attendanceCalendar');
    const period = attendanceManager.trackingPeriod;
    
    calendarContainer.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.style.cssText = 'text-align: center; font-weight: 600; padding: 0.5rem; color: #7F8C8D;';
        header.textContent = day;
        calendarContainer.appendChild(header);
    });
    
    // Calculate start date
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - period);
    
    // Find the first day of the week to start from
    const firstDayOfWeek = new Date(startDate);
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay());
    
    // Render calendar days
    const totalDays = Math.ceil(period / 7) * 7 + 7;
    
    for (let i = 0; i < totalDays; i++) {
        const currentDate = new Date(firstDayOfWeek);
        currentDate.setDate(currentDate.getDate() + i);
        
        const isInPeriod = currentDate >= startDate && currentDate <= today;
        const dateStr = currentDate.toDateString();
        const isPlayed = attendanceManager.records.has(dateStr);
        const isToday = currentDate.toDateString() === today.toDateString();
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (isInPeriod) {
            if (isPlayed) {
                dayElement.classList.add('played');
            } else {
                dayElement.classList.add('missed');
            }
        } else {
            dayElement.style.opacity = '0.3';
        }
        
        if (isToday) {
            dayElement.classList.add('today');
        }
        
        dayElement.textContent = currentDate.getDate();
        dayElement.title = `${dateStr}${isPlayed ? ' - Played' : ''}`;
        
        calendarContainer.appendChild(dayElement);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initAttendance();
});
