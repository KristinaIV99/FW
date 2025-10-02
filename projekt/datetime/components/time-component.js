// projekt/datetime/components/time-component.js
// Time Input Component - Adapted design iš pavyzdžio projekto

class TimeComponent {
    constructor(onTimeChange) {
        this.onTimeChange = onTimeChange;
        this.currentTime = { 
            hours: null, 
            minutes: null 
        };
        this.isInitialized = false;
    }

    // =============================================================================
    // INITIALIZATION
    // =============================================================================

    initialize(containerId = 'timeContent') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Time component container ${containerId} not found`);
            return false;
        }

        this.generateTimeInputs(container);
        this.setupEventListeners();
        this.isInitialized = true;

        console.log('TimeComponent initialized successfully');
        return true;
    }

    // =============================================================================
    // UI GENERATION - Adapted iš pavyzdžio projekto design
    // =============================================================================

    generateTimeInputs(container) {
        container.innerHTML = `
            <div class="time-input-container">
                <input type="number" 
                       id="timeHours" 
                       class="time-input" 
                       min="0" 
                       max="23" 
                       placeholder="HH" 
                       value="">
                <span class="time-separator">:</span>
                <input type="number" 
                       id="timeMinutes" 
                       class="time-input" 
                       min="0" 
                       max="59" 
                       placeholder="MM" 
                       value="">
            </div>
        `;
    }

    // =============================================================================
    // EVENT LISTENERS
    // =============================================================================

    setupEventListeners() {
        const timeHours = document.getElementById('timeHours');
        const timeMinutes = document.getElementById('timeMinutes');
        
        if (!timeHours || !timeMinutes) {
            console.error('Time input elements not found');
            return;
        }

        timeHours.addEventListener('input', (e) => {
            this.handleHoursChange(e.target);
        });

        timeHours.addEventListener('blur', (e) => {
            this.validateAndFormatHours(e.target);
        });

        timeMinutes.addEventListener('input', (e) => {
            this.handleMinutesChange(e.target);
        });

        timeMinutes.addEventListener('blur', (e) => {
            this.validateAndFormatMinutes(e.target);
        });

        timeHours.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e, timeHours, timeMinutes);
        });

        timeMinutes.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e, timeMinutes, timeHours);
        });
    }

    // =============================================================================
    // INPUT VALIDATION - Adapted validation logic
    // =============================================================================

    handleHoursChange(input) {
        // Jei laukas tuščias - nustatyti null
        if (input.value === '' || input.value === null) {
            this.currentTime.hours = null;
            this.updateTimeValue();
            return;
        }
        
        const value = parseInt(input.value);
        
        if (!isNaN(value)) {
            const validatedValue = this.validateTimeInput(value, 0, 23);
            this.currentTime.hours = validatedValue;
        }
        
        this.updateTimeValue();
    }

    handleMinutesChange(input) {
        // Jei laukas tuščias - nustatyti null
        if (input.value === '' || input.value === null) {
            this.currentTime.minutes = null;
            this.updateTimeValue();
            return;
        }
        
        const value = parseInt(input.value);
        
        if (!isNaN(value)) {
            const validatedValue = this.validateTimeInput(value, 0, 59);
            this.currentTime.minutes = validatedValue;
        }
        
        this.updateTimeValue();
    }

    validateTimeInput(value, min, max) {
        if (isNaN(value) || value < min) {
            return min;
        } else if (value > max) {
            return max;
        }
        return value;
    }

    validateAndFormatHours(input) {
        // Jei laukas tuščias - palikti tuščią
        if (input.value === '' || input.value === null) {
            this.currentTime.hours = null;
            this.updateTimeValue();
            return;
        }
        
        // Tik jei įvestas skaičius - formatuoti
        const parsedValue = parseInt(input.value);
        if (!isNaN(parsedValue)) {
            const validatedValue = this.validateTimeInput(parsedValue, 0, 23);
            input.value = String(validatedValue).padStart(2, '0');
            this.currentTime.hours = validatedValue;
        } else {
            // Jei neteisingas įvedimas - išvalyti
            input.value = '';
            this.currentTime.hours = null;
        }
        
        this.updateTimeValue();
    }

    validateAndFormatMinutes(input) {
        // Jei laukas tuščias - palikti tuščią
        if (input.value === '' || input.value === null) {
            this.currentTime.minutes = null;
            this.updateTimeValue();
            return;
        }
        
        // Tik jei įvestas skaičius - formatuoti
        const parsedValue = parseInt(input.value);
        if (!isNaN(parsedValue)) {
            const validatedValue = this.validateTimeInput(parsedValue, 0, 59);
            input.value = String(validatedValue).padStart(2, '0');
            this.currentTime.minutes = validatedValue;
        } else {
            // Jei neteisingas įvedimas - išvalyti
            input.value = '';
            this.currentTime.minutes = null;
        }
        
        this.updateTimeValue();
    }

    // =============================================================================
    // KEYBOARD NAVIGATION
    // =============================================================================

    handleKeyNavigation(event, currentInput, otherInput) {
        switch(event.key) {
            case 'Tab':
                break;
                
            case 'Enter':
                event.preventDefault();
                otherInput.focus();
                otherInput.select();
                break;
                
            case 'ArrowUp':
                event.preventDefault();
                this.incrementValue(currentInput, currentInput === document.getElementById('timeHours') ? 23 : 59);
                break;
                
            case 'ArrowDown':
                event.preventDefault();
                this.decrementValue(currentInput, 0);
                break;
                
            case ':':
                if (currentInput === document.getElementById('timeHours')) {
                    event.preventDefault();
                    otherInput.focus();
                    otherInput.select();
                }
                break;
        }
    }

    incrementValue(input, max) {
        // Jei laukas tuščias - pradėti nuo 0
        const currentValue = input.value === '' ? -1 : parseInt(input.value);
        const newValue = currentValue >= max ? 0 : currentValue + 1;
        input.value = String(newValue).padStart(2, '0');
        
        if (input.id === 'timeHours') {
            this.handleHoursChange(input);
        } else {
            this.handleMinutesChange(input);
        }
    }

    decrementValue(input, min) {
        // Jei laukas tuščias - pradėti nuo max
        const maxValue = input.id === 'timeHours' ? 23 : 59;
        const currentValue = input.value === '' ? maxValue + 1 : parseInt(input.value);
        const newValue = currentValue <= min ? maxValue : currentValue - 1;
        input.value = String(newValue).padStart(2, '0');
        
        if (input.id === 'timeHours') {
            this.handleHoursChange(input);
        } else {
            this.handleMinutesChange(input);
        }
    }

    // =============================================================================
    // TIME VALUE MANAGEMENT
    // =============================================================================

    updateTimeValue() {
        const formattedTime = this.getFormattedTime();
        
        if (this.onTimeChange) {
            this.onTimeChange(formattedTime, { ...this.currentTime });
        }
    }

    getFormattedTime() {
        // Jei abu null - grąžinti tuščią stringą
        if (this.currentTime.hours === null && this.currentTime.minutes === null) {
            return '';
        }
        
        // Jei tik vienas null - naudoti 0
        const hours = String(this.currentTime.hours ?? 0).padStart(2, '0');
        const minutes = String(this.currentTime.minutes ?? 0).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // =============================================================================
    // PUBLIC API METHODS
    // =============================================================================

    setTime(hours, minutes) {
        // Jei abu undefined/null - palikti tuščius
        if ((hours === undefined || hours === null) && (minutes === undefined || minutes === null)) {
            this.currentTime.hours = null;
            this.currentTime.minutes = null;
            
            const timeHours = document.getElementById('timeHours');
            const timeMinutes = document.getElementById('timeMinutes');
            
            if (timeHours) timeHours.value = '';
            if (timeMinutes) timeMinutes.value = '';
            
            this.updateTimeValue();
            return this.getFormattedTime();
        }
        
        // Validate inputs
        hours = hours !== null && hours !== undefined ? this.validateTimeInput(parseInt(hours), 0, 23) : null;
        minutes = minutes !== null && minutes !== undefined ? this.validateTimeInput(parseInt(minutes), 0, 59) : null;
        
        this.currentTime.hours = hours;
        this.currentTime.minutes = minutes;
        
        // Update UI inputs
        const timeHours = document.getElementById('timeHours');
        const timeMinutes = document.getElementById('timeMinutes');
        
        if (timeHours) {
            timeHours.value = hours !== null ? String(hours).padStart(2, '0') : '';
        }
        if (timeMinutes) {
            timeMinutes.value = minutes !== null ? String(minutes).padStart(2, '0') : '';
        }
        
        this.updateTimeValue();
        return this.getFormattedTime();
    }

    setTimeFromString(timeString) {
        if (!timeString || typeof timeString !== 'string' || timeString.trim() === '') {
            return this.setTime(null, null);
        }

        const parts = timeString.split(':');
        if (parts.length !== 2) {
            return this.setTime(null, null);
        }

        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        
        if (isNaN(hours) || isNaN(minutes)) {
            return this.setTime(null, null);
        }
        
        return this.setTime(hours, minutes);
    }

    getCurrentTime() {
        return { ...this.currentTime };
    }

    getFormattedCurrentTime() {
        return this.getFormattedTime();
    }

    // =============================================================================
    // STATE MANAGEMENT
    // =============================================================================

    getValue() {
        return {
            hours: this.currentTime.hours,
            minutes: this.currentTime.minutes,
            formatted: this.getFormattedTime(),
            isEmpty: this.currentTime.hours === null && this.currentTime.minutes === null
        };
    }

    setValue(data) {
        if (!data) {
            return this.setTime(null, null);
        }

        if (typeof data === 'string') {
            return this.setTimeFromString(data);
        }

        if (data.hours !== undefined || data.minutes !== undefined) {
            return this.setTime(data.hours, data.minutes);
        }

        if (data.formatted) {
            return this.setTimeFromString(data.formatted);
        }

        return this.getFormattedTime();
    }

    clear() {
        return this.setTime(null, null);
    }

    // =============================================================================
    // UTILITY METHODS
    // =============================================================================

    isValid() {
        // Jei abu null - valid (tuščias laukas)
        if (this.currentTime.hours === null && this.currentTime.minutes === null) {
            return true;
        }
        
        return this.currentTime.hours >= 0 && this.currentTime.hours <= 23 &&
               this.currentTime.minutes >= 0 && this.currentTime.minutes <= 59;
    }

    isEmpty() {
        return this.currentTime.hours === null && this.currentTime.minutes === null;
    }

    // =============================================================================
    // CLEANUP
    // =============================================================================

    destroy() {
        const timeHours = document.getElementById('timeHours');
        const timeMinutes = document.getElementById('timeMinutes');
        
        if (timeHours) {
            timeHours.removeEventListener('input', this.handleHoursChange);
            timeHours.removeEventListener('blur', this.validateAndFormatHours);
            timeHours.removeEventListener('keydown', this.handleKeyNavigation);
        }
        
        if (timeMinutes) {
            timeMinutes.removeEventListener('input', this.handleMinutesChange);
            timeMinutes.removeEventListener('blur', this.validateAndFormatMinutes);
            timeMinutes.removeEventListener('keydown', this.handleKeyNavigation);
        }
        
        this.isInitialized = false;
        console.log('TimeComponent destroyed');
    }
}

// =============================================================================
// GLOBAL EXPORT
// =============================================================================
window.TimeComponent = TimeComponent;