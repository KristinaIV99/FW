// projekt/datetime/components/time-component.js
// Time Input Component - Adapted design iš pavyzdžio projekto

class TimeComponent {
    constructor(onTimeChange) {
        this.onTimeChange = onTimeChange; // Callback kai keičiasi laikas
        this.currentTime = { 
            hours: 0, 
            minutes: 0 
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
                       value="00">
                <span class="time-separator">:</span>
                <input type="number" 
                       id="timeMinutes" 
                       class="time-input" 
                       min="0" 
                       max="59" 
                       placeholder="MM" 
                       value="00">
            </div>
            <div class="helper-text">Valandos: 00-23, Minutės: 0-59</div>
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

        // Hours input event listeners
        timeHours.addEventListener('input', (e) => {
            this.handleHoursChange(e.target);
        });

        timeHours.addEventListener('blur', (e) => {
            this.validateAndFormatHours(e.target);
        });

        // Minutes input event listeners
        timeMinutes.addEventListener('input', (e) => {
            this.handleMinutesChange(e.target);
        });

        timeMinutes.addEventListener('blur', (e) => {
            this.validateAndFormatMinutes(e.target);
        });

        // Keyboard navigation enhancements
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
        const value = parseInt(input.value);
        
        // Real-time validation
        if (!isNaN(value)) {
            const validatedValue = this.validateTimeInput(value, 0, 23);
            this.currentTime.hours = validatedValue;
        }
        
        this.updateTimeValue();
    }

    handleMinutesChange(input) {
        const value = parseInt(input.value);
        
        // Real-time validation
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
        const validatedValue = this.validateTimeInput(parseInt(input.value) || 0, 0, 23);
        input.value = String(validatedValue).padStart(2, '0');
        this.currentTime.hours = validatedValue;
        this.updateTimeValue();
    }

    validateAndFormatMinutes(input) {
        const validatedValue = this.validateTimeInput(parseInt(input.value) || 0, 0, 59);
        input.value = String(validatedValue).padStart(2, '0');
        this.currentTime.minutes = validatedValue;
        this.updateTimeValue();
    }

    // =============================================================================
    // KEYBOARD NAVIGATION
    // =============================================================================

    handleKeyNavigation(event, currentInput, otherInput) {
        switch(event.key) {
            case 'Tab':
                // Let natural tab flow work
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
        const currentValue = parseInt(input.value) || 0;
        const newValue = currentValue >= max ? 0 : currentValue + 1;
        input.value = String(newValue).padStart(2, '0');
        
        // Trigger change event
        if (input.id === 'timeHours') {
            this.handleHoursChange(input);
        } else {
            this.handleMinutesChange(input);
        }
    }

    decrementValue(input, min) {
        const currentValue = parseInt(input.value) || 0;
        const maxValue = input.id === 'timeHours' ? 23 : 59;
        const newValue = currentValue <= min ? maxValue : currentValue - 1;
        input.value = String(newValue).padStart(2, '0');
        
        // Trigger change event
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
        const hours = String(this.currentTime.hours).padStart(2, '0');
        const minutes = String(this.currentTime.minutes).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // =============================================================================
    // PUBLIC API METHODS
    // =============================================================================

    setTime(hours, minutes) {
        // Validate inputs
        hours = this.validateTimeInput(parseInt(hours) || 0, 0, 23);
        minutes = this.validateTimeInput(parseInt(minutes) || 0, 0, 59);
        
        this.currentTime.hours = hours;
        this.currentTime.minutes = minutes;
        
        // Update UI inputs
        const timeHours = document.getElementById('timeHours');
        const timeMinutes = document.getElementById('timeMinutes');
        
        if (timeHours) timeHours.value = String(hours).padStart(2, '0');
        if (timeMinutes) timeMinutes.value = String(minutes).padStart(2, '0');
        
        this.updateTimeValue();
        return this.getFormattedTime();
    }

    setTimeFromString(timeString) {
        if (!timeString || typeof timeString !== 'string') {
            return this.setTime(0, 0);
        }

        const parts = timeString.split(':');
        if (parts.length !== 2) {
            return this.setTime(0, 0);
        }

        const hours = parseInt(parts[0]) || 0;
        const minutes = parseInt(parts[1]) || 0;
        
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
            isEmpty: this.currentTime.hours === 0 && this.currentTime.minutes === 0
        };
    }

    setValue(data) {
        if (!data) {
            return this.setTime(0, 0);
        }

        if (typeof data === 'string') {
            return this.setTimeFromString(data);
        }

        if (data.hours !== undefined && data.minutes !== undefined) {
            return this.setTime(data.hours, data.minutes);
        }

        if (data.formatted) {
            return this.setTimeFromString(data.formatted);
        }

        return this.getFormattedTime();
    }

    clear() {
        return this.setTime(0, 0);
    }

    // =============================================================================
    // UTILITY METHODS
    // =============================================================================

    isValid() {
        return this.currentTime.hours >= 0 && this.currentTime.hours <= 23 &&
               this.currentTime.minutes >= 0 && this.currentTime.minutes <= 59;
    }

    isEmpty() {
        return this.currentTime.hours === 0 && this.currentTime.minutes === 0;
    }

    // =============================================================================
    // CLEANUP
    // =============================================================================

    destroy() {
        // Remove event listeners
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