// projekt/datetime/components/intervals-iso-component.js
// ISO Intervals Component - Adapted iš pavyzdžio projekto ISO logic

class IntervalsIsoComponent {
    constructor(onIsoChange) {
        this.onIsoChange = onIsoChange; // Callback kai keiČiasi ISO
        this.currentIso = 'P';
        this.isInitialized = false;
        this.inputElements = {};
    }

    // =============================================================================
    // INITIALIZATION
    // =============================================================================

    initialize(containerId = 'intervalsIsoContent') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Intervals ISO container ${containerId} not found`);
            return false;
        }

        this.generateIsoInputs(container);
        this.setupEventListeners();
        this.isInitialized = true;

        console.log('IntervalsIsoComponent initialized successfully');
        return true;
    }

    // =============================================================================
    // UI GENERATION - Adapted iš pavyzdžio projekto design
    // =============================================================================

    generateIsoInputs(container) {
        // Get validation config or use defaults
        const validation = window.CONFIG?.VALIDATION?.ISO || this.getDefaultValidation();
        
        container.innerHTML = `
            <div class="iso-input-container">
                <div class="iso-format-label">ISO 8601 formato intervalas</div>
                <div class="iso-inputs">
                    <input type="number" 
                           id="isoYears" 
                           class="iso-input" 
                           min="${validation.YEARS_MIN}" 
                           max="${validation.YEARS_MAX}" 
                           placeholder="YY"
                           value="">
                    <span class="iso-separator">Y</span>
                    <input type="number" 
                           id="isoMonths" 
                           class="iso-input" 
                           min="${validation.MONTHS_MIN}" 
                           max="${validation.MONTHS_MAX}" 
                           placeholder="MM"
                           value="">
                    <span class="iso-separator">M</span>
                    <input type="number" 
                           id="isoDays" 
                           class="iso-input-wide" 
                           min="${validation.DAYS_MIN}" 
                           max="${validation.DAYS_MAX}" 
                           placeholder="DDD"
                           value="">
                    <span class="iso-separator">D T</span>
                    <input type="number" 
                           id="isoHours" 
                           class="iso-input" 
                           min="${validation.HOURS_MIN}" 
                           max="${validation.HOURS_MAX}" 
                           placeholder="HH"
                           value="">
                    <span class="iso-separator">H</span>
                    <input type="number" 
                           id="isoMinutes" 
                           class="iso-input" 
                           min="${validation.MINUTES_MIN}" 
                           max="${validation.MINUTES_MAX}" 
                           placeholder="MM"
                           value="">
                    <span class="iso-separator">M</span>
                </div>
                <div class="helper-text">Metai : Mėnesiai : Dienos : Valandos : Minutės</div>
                <div class="iso-preview" id="isoPreview">P</div>
            </div>
        `;

        // Store references to inputs
        this.inputElements = {
            years: document.getElementById('isoYears'),
            months: document.getElementById('isoMonths'),
            days: document.getElementById('isoDays'),
            hours: document.getElementById('isoHours'),
            minutes: document.getElementById('isoMinutes'),
            preview: document.getElementById('isoPreview')
        };
    }

    getDefaultValidation() {
        return {
            YEARS_MIN: 0,
            YEARS_MAX: 99,
            MONTHS_MIN: 0,
            MONTHS_MAX: 99,
            DAYS_MIN: 0,
            DAYS_MAX: 999,
            HOURS_MIN: 0,
            HOURS_MAX: 23,
            MINUTES_MIN: 0,
            MINUTES_MAX: 59
        };
    }

    // =============================================================================
    // EVENT LISTENERS
    // =============================================================================

    setupEventListeners() {
        Object.keys(this.inputElements).forEach(key => {
            const input = this.inputElements[key];
            if (input && input.tagName === 'INPUT') {
                // Input event - real-time validation and preview
                input.addEventListener('input', (e) => {
                    this.handleIsoInput(e.target, key);
                });

                // Blur event - final validation and formatting
                input.addEventListener('blur', (e) => {
                    this.validateAndFormatInput(e.target, key);
                });

                // Keyboard navigation
                input.addEventListener('keydown', (e) => {
                    this.handleKeyNavigation(e, input, key);
                });
            }
        });
    }

    // =============================================================================
    // INPUT VALIDATION - Adapted validation logic
    // =============================================================================

    handleIsoInput(input, inputType) {
        const value = parseInt(input.value);
        
        if (!isNaN(value) || input.value === '') {
            this.updateIsoInterval();
        }
    }

    validateAndFormatInput(input, inputType) {
        const validation = this.getValidationForInput(inputType);
        let value = parseInt(input.value);
        
        if (isNaN(value) || input.value === '') {
            input.value = '';
            this.updateIsoInterval();
            return;
        }
        
        // Validate range
        if (value < validation.min) {
            value = validation.min;
        } else if (value > validation.max) {
            value = validation.max;
        }
        
        input.value = value;
        this.updateIsoInterval();
    }

    getValidationForInput(inputType) {
        const validation = window.CONFIG?.VALIDATION?.ISO || this.getDefaultValidation();
        
        switch(inputType) {
            case 'years':
                return { min: validation.YEARS_MIN, max: validation.YEARS_MAX };
            case 'months':
                return { min: validation.MONTHS_MIN, max: validation.MONTHS_MAX };
            case 'days':
                return { min: validation.DAYS_MIN, max: validation.DAYS_MAX };
            case 'hours':
                return { min: validation.HOURS_MIN, max: validation.HOURS_MAX };
            case 'minutes':
                return { min: validation.MINUTES_MIN, max: validation.MINUTES_MAX };
            default:
                return { min: 0, max: 99 };
        }
    }

    // =============================================================================
    // KEYBOARD NAVIGATION
    // =============================================================================

    handleKeyNavigation(event, currentInput, inputType) {
        switch(event.key) {
            case 'Tab':
                // Let natural tab flow work
                break;
                
            case 'Enter':
                event.preventDefault();
                this.focusNextInput(inputType);
                break;
                
            case 'ArrowUp':
                event.preventDefault();
                this.incrementValue(currentInput, inputType);
                break;
                
            case 'ArrowDown':
                event.preventDefault();
                this.decrementValue(currentInput, inputType);
                break;
        }
    }

    focusNextInput(currentType) {
        const inputOrder = ['years', 'months', 'days', 'hours', 'minutes'];
        const currentIndex = inputOrder.indexOf(currentType);
        const nextIndex = (currentIndex + 1) % inputOrder.length;
        const nextInput = this.inputElements[inputOrder[nextIndex]];
        
        if (nextInput) {
            nextInput.focus();
            nextInput.select();
        }
    }

    incrementValue(input, inputType) {
        const validation = this.getValidationForInput(inputType);
        const currentValue = parseInt(input.value) || 0;
        const newValue = currentValue >= validation.max ? validation.min : currentValue + 1;
        input.value = newValue;
        this.updateIsoInterval();
    }

    decrementValue(input, inputType) {
        const validation = this.getValidationForInput(inputType);
        const currentValue = parseInt(input.value) || validation.min;
        const newValue = currentValue <= validation.min ? validation.max : currentValue - 1;
        input.value = newValue;
        this.updateIsoInterval();
    }

    // =============================================================================
    // ISO INTERVAL GENERATION - Adapted iš pavyzdžio projekto
    // =============================================================================

    updateIsoInterval() {
        const years = this.inputElements.years?.value || '';
        const months = this.inputElements.months?.value || '';
        const days = this.inputElements.days?.value || '';
        const hours = this.inputElements.hours?.value || '';
        const minutes = this.inputElements.minutes?.value || '';
        
        let iso = 'P'; // Always start with P
        
        // Add date components
        if (years) iso += years + 'Y';
        if (months) iso += months + 'M';
        if (days) iso += days + 'D';
        
        // Add time components
        if (hours || minutes) {
            iso += 'T';
            if (hours) iso += hours + 'H';
            if (minutes) iso += minutes + 'M';
        }
        
        this.currentIso = iso;
        
        // Update preview
        this.updatePreview();
        
        // Notify parent component
        if (this.onIsoChange) {
            this.onIsoChange(iso, this.getIsoComponents());
        }
    }

    updatePreview() {
        if (this.inputElements.preview) {
            this.inputElements.preview.textContent = this.currentIso;
            
            // Add visual feedback
            if (this.currentIso === 'P') {
                this.inputElements.preview.className = 'iso-preview empty';
            } else {
                this.inputElements.preview.className = 'iso-preview';
            }
        }
    }

    // =============================================================================
    // PUBLIC API METHODS
    // =============================================================================

    getValue() {
        if (this.currentIso === 'P') {
            return {
                iso: null,
                formatted: null,
                components: null,
                isEmpty: true
            };
        }

        return {
            iso: this.currentIso,
            formatted: this.currentIso,
            components: this.getIsoComponents(),
            isEmpty: false
        };
    }

    setValue(data) {
        if (!data) {
            this.clearAllInputs();
            return;
        }

        if (typeof data === 'string') {
            this.parseIsoString(data);
        } else if (data.iso) {
            this.parseIsoString(data.iso);
        } else if (data.components) {
            this.setFromComponents(data.components);
        }
    }

    setFromComponents(components) {
        const inputs = this.inputElements;
        
        if (inputs.years) inputs.years.value = components.years || '';
        if (inputs.months) inputs.months.value = components.months || '';
        if (inputs.days) inputs.days.value = components.days || '';
        if (inputs.hours) inputs.hours.value = components.hours || '';
        if (inputs.minutes) inputs.minutes.value = components.minutes || '';
        
        this.updateIsoInterval();
    }

    getIsoComponents() {
        return {
            years: this.inputElements.years?.value || '',
            months: this.inputElements.months?.value || '',
            days: this.inputElements.days?.value || '',
            hours: this.inputElements.hours?.value || '',
            minutes: this.inputElements.minutes?.value || ''
        };
    }

    clearAllInputs() {
        Object.keys(this.inputElements).forEach(key => {
            const input = this.inputElements[key];
            if (input && input.tagName === 'INPUT') {
                input.value = '';
            }
        });
        
        this.currentIso = 'P';
        this.updatePreview();
        
        if (this.onIsoChange) {
            this.onIsoChange(this.currentIso, this.getIsoComponents());
        }
    }

    // =============================================================================
    // ISO STRING PARSING
    // =============================================================================

    parseIsoString(isoString) {
        if (!isoString || !isoString.startsWith('P')) {
            this.clearAllInputs();
            return;
        }

        // Simple regex parsing for P1Y2M3DT4H5M format
        const regex = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?/;
        const matches = isoString.match(regex);
        
        if (matches) {
            const [, years, months, days, hours, minutes] = matches;
            this.setFromComponents({
                years: years || '',
                months: months || '',
                days: days || '',
                hours: hours || '',
                minutes: minutes || ''
            });
        }
    }

    // =============================================================================
    // UTILITY METHODS
    // =============================================================================

    isValid() {
        return this.currentIso !== 'P' && this.currentIso.length > 1;
    }

    isEmpty() {
        return this.currentIso === 'P';
    }

    getCurrentIso() {
        return this.currentIso;
    }

    // Generate human-readable description
    getDescription() {
        if (this.isEmpty()) return 'Nenurodyta';

        const components = this.getIsoComponents();
        const parts = [];
        
        if (components.years) parts.push(`${components.years} m.`);
        if (components.months) parts.push(`${components.months} mėn.`);
        if (components.days) parts.push(`${components.days} d.`);
        if (components.hours) parts.push(`${components.hours} val.`);
        if (components.minutes) parts.push(`${components.minutes} min.`);
        
        return parts.length > 0 ? parts.join(' ') : 'Nenurodyta';
    }

    // =============================================================================
    // CLEANUP
    // =============================================================================

    destroy() {
        // Remove event listeners
        Object.keys(this.inputElements).forEach(key => {
            const input = this.inputElements[key];
            if (input && input.tagName === 'INPUT') {
                input.removeEventListener('input', this.handleIsoInput);
                input.removeEventListener('blur', this.validateAndFormatInput);
                input.removeEventListener('keydown', this.handleKeyNavigation);
            }
        });
        
        this.inputElements = {};
        this.isInitialized = false;
        console.log('IntervalsIsoComponent destroyed');
    }
}

// =============================================================================
// GLOBAL EXPORT
// =============================================================================
window.IntervalsIsoComponent = IntervalsIsoComponent;