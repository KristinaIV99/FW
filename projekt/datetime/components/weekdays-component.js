// projekt/datetime/components/weekdays-component.js
// Weekdays Component - Adapted button design iš pavyzdžio projekto

class WeekdaysComponent {
    constructor(onWeekdayChange) {
        this.onWeekdayChange = onWeekdayChange; // Callback kai keičiasi weekday
        this.selectedWeekday = null;
        this.isInitialized = false;
    }

    // =============================================================================
    // INITIALIZATION
    // =============================================================================

    initialize(containerId = 'weekdaysContent') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Weekdays container ${containerId} not found`);
            return false;
        }

        this.generateWeekdayButtons(container);
        this.isInitialized = true;

        console.log('WeekdaysComponent initialized successfully');
        return true;
    }

    // =============================================================================
    // UI GENERATION - Adapted iš pavyzdžio button design
    // =============================================================================

    generateWeekdayButtons(container) {
        // Get weekdays data from CONFIG
        const weekdays = this.getWeekdaysFromConfig();
        const specialOptions = this.getSpecialOptionsFromConfig();
        
        container.innerHTML = `
            <div class="button-group button-group-single" id="weekdaysButtons">
                <!-- Special options (Today, Tomorrow) -->
                ${specialOptions.map(option => `
                    <div class="btn-small btn-special" data-weekday="${option.key}" data-type="special">
                        ${option.name} (${option.short})
                    </div>
                `).join('')}
                
                <!-- Regular weekdays -->
                ${weekdays.map((weekday, index) => `
                    <div class="btn-small" data-weekday="${weekday.key}" data-index="${index}" data-type="weekday">
                        ${weekday.name} (${weekday.short})
                    </div>
                `).join('')}
            </div>
            <div class="helper-text">Pasirinkite savaitės dieną arba specialų pasirinkimą</div>
        `;

        // Add event listeners to all buttons
        this.setupButtonEventListeners(container);
    }

    setupButtonEventListeners(container) {
        const buttons = container.querySelectorAll('[data-weekday]');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleWeekdaySelection(button);
            });
        });
    }

    getWeekdaysFromConfig() {
        if (window.CALENDAR_DATA?.weekdays) {
            return window.CALENDAR_DATA.weekdays;
        }
        
        console.warn('CALENDAR_DATA.weekdays not found in config, using defaults');
        return this.getDefaultWeekdays();
    }

    getSpecialOptionsFromConfig() {
        if (window.CALENDAR_DATA?.special_options) {
            return window.CALENDAR_DATA.special_options;
        }
        
        console.warn('CALENDAR_DATA.special_options not found in config, using defaults');
        return this.getDefaultSpecialOptions();
    }

    getDefaultWeekdays() {
        return [
            { key: 'monday', name: 'Monday', short: 'Pr' },
            { key: 'tuesday', name: 'Tuesday', short: 'An' },
            { key: 'wednesday', name: 'Wednesday', short: 'Tr' },
            { key: 'thursday', name: 'Thursday', short: 'Kt' },
            { key: 'friday', name: 'Friday', short: 'Pn' },
            { key: 'saturday', name: 'Saturday', short: 'Šš' },
            { key: 'sunday', name: 'Sunday', short: 'Sk' }
        ];
    }

    getDefaultSpecialOptions() {
        return [
            { key: 'today', name: 'Today', short: 'Šd' },
            { key: 'tomorrow', name: 'Tomorrow', short: 'Rt' }
        ];
    }

    // =============================================================================
    // SELECTION HANDLING - Adapted logic
    // =============================================================================

    handleWeekdaySelection(button) {
        const weekdayKey = button.getAttribute('data-weekday');
        const type = button.getAttribute('data-type');
        
        console.log(`Weekday selected: ${weekdayKey} (type: ${type})`);
        
        // Clear previous selection
        this.clearSelectionInContainer(button.closest('.button-group'));
        
        // Set new selection
        button.classList.add('selected');
        this.selectedWeekday = weekdayKey;
        
        // Get weekday data - ENSURE CONSISTENT FORMAT
        const weekdayData = this.getWeekdayData(weekdayKey, type);
        
        // Notify parent component
        if (this.onWeekdayChange && weekdayData) {
            this.onWeekdayChange(weekdayKey, weekdayData, button);
        }
    }

    getWeekdayData(weekdayKey, type) {
        let rawData;
        
        if (type === 'special') {
            const specialOptions = this.getSpecialOptionsFromConfig();
            rawData = specialOptions.find(option => option.key === weekdayKey);
        } else {
            const weekdays = this.getWeekdaysFromConfig();
            rawData = weekdays.find(weekday => weekday.key === weekdayKey);
        }
        
        // ENSURE CONSISTENT FORMAT - always include all required fields
        if (rawData) {
            return {
                key: rawData.key,
                name: rawData.name,
                short: rawData.short || rawData.key.substr(0, 2).toUpperCase(),
                type: type || 'weekday',
                formatted: this.getTaskWarriorFormat(rawData.key, type)
            };
        }
        
        // Fallback
        return {
            key: weekdayKey,
            name: weekdayKey,
            short: weekdayKey.substr(0, 2).toUpperCase(),
            type: type || 'weekday',
            formatted: weekdayKey
        };
    }

    getTaskWarriorFormat(weekdayKey, type) {
        if (type === 'special') {
            // For today/tomorrow, calculate actual date
            if (weekdayKey === 'today') {
                return this.getTodayFormat();
            } else if (weekdayKey === 'tomorrow') {
                return this.getTomorrowFormat();
            }
        }
        
        // For regular weekdays, return the key (monday, tuesday, etc.)
        return weekdayKey;
    }

    getTodayFormat() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    getTomorrowFormat() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    clearSelectionInContainer(container) {
        if (container) {
            container.querySelectorAll('.selected').forEach(el => {
                el.classList.remove('selected');
            });
        }
    }

    // =============================================================================
    // PUBLIC API METHODS
    // =============================================================================

    getValue() {
        if (!this.selectedWeekday) {
            return {
                weekday: null,
                weekdayKey: null,
                formatted: null,
                isEmpty: true
            };
        }

        // Try to find in regular weekdays first
        let weekdayData = this.getWeekdaysFromConfig().find(w => w.key === this.selectedWeekday);
        let type = 'weekday';
        
        // If not found, try special options
        if (!weekdayData) {
            weekdayData = this.getSpecialOptionsFromConfig().find(w => w.key === this.selectedWeekday);
            type = 'special';
        }

        // Use consistent data format
        const consistentData = this.getWeekdayData(this.selectedWeekday, type);

        return {
            weekday: this.selectedWeekday,
            weekdayKey: this.selectedWeekday,
            weekdayName: consistentData.name,
            shortName: consistentData.short,
            type: consistentData.type,
            formatted: consistentData.formatted,
            isEmpty: false
        };
    }

    setValue(data) {
        if (!data) {
            this.clearSelection();
            return;
        }

        let weekdayKey = null;
        
        if (typeof data === 'string') {
            weekdayKey = data;
        } else if (data.weekday) {
            weekdayKey = data.weekday;
        } else if (data.weekdayKey) {
            weekdayKey = data.weekdayKey;
        }

        if (weekdayKey) {
            this.setSelection(weekdayKey);
        }
    }

    setSelection(weekdayKey) {
        // Find button with this weekday
        const button = document.querySelector(`[data-weekday="${weekdayKey}"]`);
        if (button) {
            this.handleWeekdaySelection(button);
        }
    }

    clearSelection() {
        this.selectedWeekday = null;
        
        // Clear UI selection
        const container = document.getElementById('weekdaysButtons');
        if (container) {
            this.clearSelectionInContainer(container);
        }
    }

    getSelectedWeekday() {
        return this.selectedWeekday;
    }

    // =============================================================================
    // UTILITY METHODS
    // =============================================================================

    isValid() {
        return this.selectedWeekday !== null;
    }

    isEmpty() {
        return this.selectedWeekday === null;
    }

    // Get next occurrence of selected weekday
    getNextDate() {
        if (!this.selectedWeekday) return null;

        // Handle special options
        if (this.selectedWeekday === 'today') {
            return new Date();
        }
        
        if (this.selectedWeekday === 'tomorrow') {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow;
        }

        // Handle regular weekdays
        const weekdays = this.getWeekdaysFromConfig();
        const weekdayIndex = weekdays.findIndex(w => w.key === this.selectedWeekday);
        
        if (weekdayIndex === -1) return null;
        
        const today = new Date();
        const targetWeekday = weekdayIndex + 1; // Monday = 1, not 0
        const currentWeekday = today.getDay() || 7; // Sunday = 7, not 0
        
        let daysToAdd = targetWeekday - currentWeekday;
        if (daysToAdd <= 0) {
            daysToAdd += 7; // Next week
        }
        
        const resultDate = new Date(today);
        resultDate.setDate(today.getDate() + daysToAdd);
        return resultDate;
    }

    getFormattedNextDate() {
        const nextDate = this.getNextDate();
        if (!nextDate) return null;
        
        const year = nextDate.getFullYear();
        const month = String(nextDate.getMonth() + 1).padStart(2, '0');
        const day = String(nextDate.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }

    // =============================================================================
    // CLEANUP
    // =============================================================================

    destroy() {
        // Remove event listeners
        const buttons = document.querySelectorAll('[data-weekday]');
        buttons.forEach(button => {
            button.removeEventListener('click', this.handleWeekdaySelection);
        });
        
        this.isInitialized = false;
        this.selectedWeekday = null;
        console.log('WeekdaysComponent destroyed');
    }
}

// =============================================================================
// GLOBAL EXPORT
// =============================================================================
window.WeekdaysComponent = WeekdaysComponent;