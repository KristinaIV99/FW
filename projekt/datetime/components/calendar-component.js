// projekt/datetime/components/calendar-component.js
// Calendar Component - Adapted iš jūsų pavyzdžio projekto

class CalendarComponent {
    constructor(onDateChange, onCalendarUpdate) {
        this.onDateChange = onDateChange;           // Callback kai pasirenkama data
        this.onCalendarUpdate = onCalendarUpdate;   // Callback kai keichiasi metai/menesiai
        
        // Šiandienos data inicializavimui
        this.today = {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            day: new Date().getDate()
        };
        
        // Dabartinė kalendoriaus būsena
        this.currentView = {
            year: this.today.year,
            month: this.today.month
        };
        
        this.selectedDate = null;
        this.isInitialized = false;
    }

    // =============================================================================
    // INITIALIZATION - Adapted iš jūsų pavyzdžio
    // =============================================================================

    initialize(containerId = 'calendarContent') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Calendar container ${containerId} not found`);
            return false;
        }

        this.generateCalendarHTML(container);
        this.setupEventListeners();
        this.generateYearOptions();
        this.generateMonthOptions();
        this.generateCalendarGrid();
        this.isInitialized = true;

        console.log('CalendarComponent initialized successfully');
        return true;
    }

    generateCalendarHTML(container) {
        container.innerHTML = `
            <div class="calendar">
                <div class="calendar-selects">
                    <select id="yearSelect"></select>
                    <select id="monthSelect"></select>
                </div>
                <div class="calendar-grid" id="calendarGrid"></div>
            </div>
        `;
    }

    // =============================================================================
    // YEAR & MONTH SELECT GENERATION - Adapted
    // =============================================================================
    
    generateYearOptions() {
        const yearSelect = document.getElementById('yearSelect');
        if (!yearSelect) {
            console.error('Year select element not found');
            return false;
        }

        yearSelect.innerHTML = '';
        
        // Naudojame CONFIG.CALENDAR.YEARS_RANGE jei yra
        const yearsRange = window.CONFIG?.CALENDAR?.YEARS_RANGE || this.getDefaultYearsRange();
        
        yearsRange.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            option.selected = year === this.today.year;
            yearSelect.appendChild(option);
        });

        return true;
    }

    getDefaultYearsRange() {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear - 2; i <= currentYear + 5; i++) {
            years.push(i);
        }
        return years;
    }

    generateMonthOptions() {
        const monthSelect = document.getElementById('monthSelect');
        if (!monthSelect) {
            console.error('Month select element not found');
            return false;
        }

        monthSelect.innerHTML = '';
        
        // Naudojame CALENDAR_DATA.months jei yra
        const months = window.CALENDAR_DATA?.months || this.getDefaultMonths();
        
        months.forEach(month => {
            const option = document.createElement('option');
            option.value = month.index;
            option.textContent = month.name;
            option.selected = month.index === this.today.month;
            monthSelect.appendChild(option);
        });

        return true;
    }

    getDefaultMonths() {
        return [
            { name: 'Sausis', index: 0 },
            { name: 'Vasaris', index: 1 },
            { name: 'Kovas', index: 2 },
            { name: 'Balandis', index: 3 },
            { name: 'Gegužė', index: 4 },
            { name: 'Birželis', index: 5 },
            { name: 'Liepa', index: 6 },
            { name: 'Rugpjūtis', index: 7 },
            { name: 'Rugsėjis', index: 8 },
            { name: 'Spalis', index: 9 },
            { name: 'Lapkritis', index: 10 },
            { name: 'Gruodis', index: 11 }
        ];
    }

    // =============================================================================
    // CALENDAR GRID GENERATION - Adapted iš jūsų pavyzdžio
    // =============================================================================

    generateCalendarGrid(year = null, month = null) {
        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarGrid) {
            console.error('Calendar grid element not found');
            return false;
        }

        // Naudoti perduotas reikšmes arba dabartinį view
        const displayYear = year !== null ? year : this.currentView.year;
        const displayMonth = month !== null ? month : this.currentView.month;

        // Atnaujinti dabartinį view
        this.currentView.year = displayYear;
        this.currentView.month = displayMonth;

        // Išvalyti esamą turinį
        calendarGrid.innerHTML = '';
        
        // HEADERS GENERAVIMAS
        this.generateCalendarHeaders(calendarGrid);
        
        // CALENDAR DAYS GENERAVIMAS
        this.generateCalendarDays(calendarGrid, displayYear, displayMonth);
        
        return true;
    }

    generateCalendarHeaders(container) {
        // Savaitės numerio antraštė
        const weekHeader = document.createElement('div');
        weekHeader.className = 'week-number header';
        weekHeader.textContent = 'S';
        container.appendChild(weekHeader);
        
        // Savaitės dienų antraštės
        const weekdays = window.CALENDAR_DATA?.weekdays || this.getDefaultWeekdays();
        weekdays.forEach(weekday => {
            const headerDiv = document.createElement('div');
            headerDiv.className = 'calendar-day header';
            headerDiv.textContent = weekday.short;
            container.appendChild(headerDiv);
        });
    }

    getDefaultWeekdays() {
        return [
            { short: 'Pr' }, { short: 'An' }, { short: 'Tr' }, 
            { short: 'Kt' }, { short: 'Pn' }, { short: 'Šš' }, { short: 'Sk' }
        ];
    }

    generateCalendarDays(container, year, month) {
        const firstDay = new Date(year, month, 1);
        const startOfWeek = this.getWeekStart(firstDay);
        
        let currentDate = new Date(startOfWeek);
        let generatedDays = 0;
        
        const weeksToShow = window.CONFIG?.CALENDAR?.WEEKS_TO_SHOW || 6;
        const daysPerWeek = window.CONFIG?.CALENDAR?.DAYS_PER_WEEK || 7;
        const totalDays = weeksToShow * daysPerWeek;
        
        while (generatedDays < totalDays) {
            // Savaitės pradžioje pridėti savaitės numerį
            if (generatedDays % daysPerWeek === 0) {
                const weekNumber = this.getWeekNumber(currentDate);
                const weekDiv = document.createElement('div');
                weekDiv.className = 'week-number';
                weekDiv.textContent = weekNumber;
                container.appendChild(weekDiv);
            }
            
            // Sukurti dieną
            const dayDate = new Date(currentDate.getTime());
            const dayElement = this.createDayElement(dayDate, year, month);
            container.appendChild(dayElement);
            
            // Pereiti į kitą dieną
            currentDate.setDate(currentDate.getDate() + 1);
            generatedDays++;
        }
    }

    createDayElement(date, displayYear, displayMonth) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        
        const isCurrentMonth = date.getMonth() === displayMonth;
        const dayNumber = date.getDate();
        
        // Nustatyti dienos numerį
        dayDiv.textContent = dayNumber;
        
        // Išsaugoti datos informaciją elemento atributuose
        dayDiv.dataset.year = date.getFullYear();
        dayDiv.dataset.month = date.getMonth();
        dayDiv.dataset.day = dayNumber;
        
        if (isCurrentMonth) {
            // Dabartinio mėnesio dienos
            this.styleCurrentMonthDay(dayDiv, date);
            
            // Pridėti click event listener
            dayDiv.addEventListener('click', (e) => {
                this.handleDayClick(dayDiv, e);
            });
        } else {
            // Kito mėnesio dienos - pilkos ir mažesnės
            this.styleOtherMonthDay(dayDiv);
        }
        
        return dayDiv;
    }

    styleCurrentMonthDay(element, date) {
        // Patikrinti ar tai šiandienos diena
        const isToday = date.getFullYear() === this.today.year && 
                       date.getMonth() === this.today.month && 
                       date.getDate() === this.today.day;
        
        if (isToday) {
            element.classList.add('today');
        }
        
        // Nustatyti kaip clickable
        element.style.cursor = 'pointer';
    }

    styleOtherMonthDay(element) {
        element.classList.add('other-month');
        element.style.cursor = 'default';
    }

    // =============================================================================
    // EVENT HANDLING - Adapted
    // =============================================================================

    setupEventListeners() {
        const yearSelect = document.getElementById('yearSelect');
        const monthSelect = document.getElementById('monthSelect');

        if (yearSelect) {
            yearSelect.addEventListener('change', (e) => {
                this.handleYearChange(parseInt(e.target.value));
            });
        }

        if (monthSelect) {
            monthSelect.addEventListener('change', (e) => {
                this.handleMonthChange(parseInt(e.target.value));
            });
        }
    }

    handleDayClick(element, event) {
        event.stopPropagation();
        
        // Gauti datos informaciją iš elemento atributų
        const year = parseInt(element.dataset.year);
        const month = parseInt(element.dataset.month);
        const day = parseInt(element.dataset.day);
        
        console.log(`Calendar day clicked: ${year}-${month + 1}-${day}`);
        
        // Pašalinti ankstesnį pasirinkimą
        this.clearDateSelection();
        
        // Pridėti pasirinkimą
        element.classList.add('selected');
        
        // Atnaujinti selected date
        this.selectedDate = {
            year: year,
            month: month,
            day: day
        };
        
        // Pranešti apie pasikeitimą
        if (this.onDateChange) {
            const formattedDate = this.formatSelectedDate();
            this.onDateChange(formattedDate, this.selectedDate);
        }
    }

    handleYearChange(newYear) {
        this.currentView.year = newYear;
        this.regenerateCalendar();
        
        if (this.onCalendarUpdate) {
            this.onCalendarUpdate('year', newYear);
        }
    }

    handleMonthChange(newMonth) {
        this.currentView.month = newMonth;
        this.regenerateCalendar();
        
        if (this.onCalendarUpdate) {
            this.onCalendarUpdate('month', newMonth);
        }
    }

    // =============================================================================
    // UTILITY METHODS - Adapted
    // =============================================================================

    getWeekStart(date) {
        const startOfWeek = new Date(date);
        const dayOfWeek = startOfWeek.getDay();
        
        // Konvertuoti į pirmadienio pradžią
        const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        startOfWeek.setDate(startOfWeek.getDate() + daysToMonday);
        
        return startOfWeek;
    }

    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    regenerateCalendar() {
        this.generateCalendarGrid();
        
        // Atstatyti pasirinkimą po pergenavimo
        if (this.selectedDate && 
            this.selectedDate.year === this.currentView.year && 
            this.selectedDate.month === this.currentView.month) {
            
            setTimeout(() => {
                this.highlightSelectedDay();
            }, 50);
        }
    }

    clearDateSelection() {
        const selectedDays = document.querySelectorAll('.calendar-day.selected');
        selectedDays.forEach(day => day.classList.remove('selected'));
    }

    highlightSelectedDay() {
        if (!this.selectedDate) return;
        
        const calendarDays = document.querySelectorAll('.calendar-day');
        calendarDays.forEach(day => {
            const dayYear = parseInt(day.dataset.year);
            const dayMonth = parseInt(day.dataset.month);
            const dayDay = parseInt(day.dataset.day);
            
            if (dayYear === this.selectedDate.year &&
                dayMonth === this.selectedDate.month &&
                dayDay === this.selectedDate.day) {
                
                day.classList.add('selected');
            }
        });
    }

    formatSelectedDate() {
        if (!this.selectedDate) return null;
        
        const { year, month, day } = this.selectedDate;
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    // =============================================================================
    // PUBLIC API METHODS
    // =============================================================================

    setDate(year, month, day) {
        this.selectedDate = { year, month, day };
        this.currentView = { year, month };
        
        // Atnaujinti select'us
        this.updateSelects(year, month);
        
        // Peregenruoti kalendorių
        this.regenerateCalendar();
    }

    updateSelects(year, month) {
        const yearSelect = document.getElementById('yearSelect');
        const monthSelect = document.getElementById('monthSelect');
        
        if (yearSelect) yearSelect.value = year;
        if (monthSelect) monthSelect.value = month;
    }

    goToToday() {
        this.setDate(this.today.year, this.today.month, this.today.day);
    }

    getValue() {
        if (!this.selectedDate) {
            return {
                date: null,
                formatted: null,
                dateObject: null,
                isEmpty: true
            };
        }

        return {
            date: this.selectedDate,
            formatted: this.formatSelectedDate(),
            dateObject: new Date(this.selectedDate.year, this.selectedDate.month, this.selectedDate.day),
            isEmpty: false
        };
    }

    setValue(data) {
        if (!data) {
            this.clearSelection();
            return;
        }

        if (typeof data === 'string') {
            // Parse YYYY-MM-DD formatas
            const parts = data.split('-');
            if (parts.length === 3) {
                const year = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1; // Month is 0-based
                const day = parseInt(parts[2]);
                this.setDate(year, month, day);
            }
        } else if (data.year !== undefined && data.month !== undefined && data.day !== undefined) {
            this.setDate(data.year, data.month, data.day);
        } else if (data.formatted) {
            this.setValue(data.formatted);
        }
    }

    clearSelection() {
        this.selectedDate = null;
        this.clearDateSelection();
    }

    // =============================================================================
    // CLEANUP
    // =============================================================================

    destroy() {
        // Pašalinti event listeners
        const yearSelect = document.getElementById('yearSelect');
        const monthSelect = document.getElementById('monthSelect');
        
        if (yearSelect) yearSelect.removeEventListener('change', this.handleYearChange);
        if (monthSelect) monthSelect.removeEventListener('change', this.handleMonthChange);
        
        // Išvalyti kalendorių
        const calendarGrid = document.getElementById('calendarGrid');
        if (calendarGrid) {
            calendarGrid.innerHTML = '';
        }
        
        this.isInitialized = false;
        console.log('CalendarComponent destroyed');
    }
}

// =============================================================================
// GLOBAL EXPORT
// =============================================================================
window.CalendarComponent = CalendarComponent;