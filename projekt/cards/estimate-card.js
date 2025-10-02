// projekt/cards/estimate-card.js

// =============================================================================
// ESTIMATE KORTELĖ – 5 ATSKIRI INPUT LAUKAI VIENOJE EILUTĖJE
// =============================================================================

class EstimateCard {
    constructor() {
        this.name = 'estimate';
        this.estimateData = {
            years: 0,
            months: 0,
            days: 0,
            hours: 0,
            minutes: 0
        };
        this.element = null;
        this.app = null;
    }

    init(app) {
        this.app = app;
        
        this.element = document.querySelector('[data-card="estimate"]');
        if (!this.element) {
            console.error('ESTIMATE: Nerastas estimate elementas');
            return;
        }

        this.generateUI();
        this.setupEvents();
    }

    generateUI() {
        const container = this.element.querySelector('#estimateCategories');
        
        if (!container) {
            console.error('ESTIMATE: Nerastas #estimateCategories konteineris');
            return;
        }

        container.innerHTML = '';

        // Create estimate picker container - similar to time picker
        const pickerContainer = document.createElement('div');
        pickerContainer.className = 'estimate-picker';

        // Years input
        const yearsInput = document.createElement('input');
        yearsInput.type = 'number';
        yearsInput.id = 'estimateYears';
        yearsInput.className = 'estimate-input input-number';
        yearsInput.placeholder = 'YY';
        yearsInput.min = window.CONFIG?.VALIDATION?.ISO?.YEARS_MIN || '0';
        yearsInput.max = window.CONFIG?.VALIDATION?.ISO?.YEARS_MAX || '99';
        yearsInput.addEventListener('input', () => this.handleInputChange('years', yearsInput.value));

        // First separator
        const sep1 = document.createElement('span');
        sep1.className = 'estimate-separator';
        sep1.textContent = ':';

        // Months input
        const monthsInput = document.createElement('input');
        monthsInput.type = 'number';
        monthsInput.id = 'estimateMonths';
        monthsInput.className = 'estimate-input input-number';
        monthsInput.placeholder = 'MM';
        monthsInput.min = '0';
        monthsInput.max = '99';
        monthsInput.addEventListener('input', () => this.handleInputChange('months', monthsInput.value));

        // Second separator
        const sep2 = document.createElement('span');
        sep2.className = 'estimate-separator';
        sep2.textContent = ':';

        // Days input
        const daysInput = document.createElement('input');
        daysInput.type = 'number';
        daysInput.id = 'estimateDays';
        daysInput.className = 'estimate-input estimate-input-wide input-number';
        daysInput.placeholder = 'DD';
        daysInput.min = window.CONFIG?.VALIDATION?.ISO?.DAYS_MIN || '0';
        daysInput.max = window.CONFIG?.VALIDATION?.ISO?.DAYS_MAX || '365';
        daysInput.addEventListener('input', () => this.handleInputChange('days', daysInput.value));

        // Third separator
        const sep3 = document.createElement('span');
        sep3.className = 'estimate-separator';
        sep3.textContent = ':';

        // Hours input
        const hoursInput = document.createElement('input');
        hoursInput.type = 'number';
        hoursInput.id = 'estimateHours';
        hoursInput.className = 'estimate-input input-number';
        hoursInput.placeholder = 'HH';
        hoursInput.min = window.CONFIG?.VALIDATION?.ISO?.HOURS_MIN || '0';
        hoursInput.max = window.CONFIG?.VALIDATION?.ISO?.HOURS_MAX || '23';
        hoursInput.addEventListener('input', () => this.handleInputChange('hours', hoursInput.value));

        // Fourth separator
        const sep4 = document.createElement('span');
        sep4.className = 'estimate-separator';
        sep4.textContent = ':';

        // Minutes input
        const minutesInput = document.createElement('input');
        minutesInput.type = 'number';
        minutesInput.id = 'estimateMinutes';
        minutesInput.className = 'estimate-input input-number';
        minutesInput.placeholder = 'MM';
        minutesInput.min = window.CONFIG?.VALIDATION?.ISO?.MINUTES_MIN || '0';
        minutesInput.max = window.CONFIG?.VALIDATION?.ISO?.MINUTES_MAX || '59';
        minutesInput.addEventListener('input', () => this.handleInputChange('minutes', minutesInput.value));

        // Append all elements to picker container
        pickerContainer.appendChild(yearsInput);
        pickerContainer.appendChild(sep1);
        pickerContainer.appendChild(monthsInput);
        pickerContainer.appendChild(sep2);
        pickerContainer.appendChild(daysInput);
        pickerContainer.appendChild(sep3);
        pickerContainer.appendChild(hoursInput);
        pickerContainer.appendChild(sep4);
        pickerContainer.appendChild(minutesInput);

        // Create help text
        const helpText = document.createElement('div');
        helpText.className = 'estimate-help';
        helpText.textContent = 'Metai : Mėnesiai : Dienos : Valandos : Minutės';

        // TaskWarrior ISO 8601 Duration preview section (pašalintas dubliavimas)
        const commandPreviewDiv = document.createElement('div');
        commandPreviewDiv.className = 'global-preview-section';
        commandPreviewDiv.innerHTML = `
            <div class="preview-title">TaskWarrior ISO 8601 Duration Preview:</div>
            <div class="command-output" id="estimateCommandOutput">
                <span class="no-command">Nepasirinktas estimate</span>
            </div>
        `;

        container.appendChild(pickerContainer);
        container.appendChild(helpText);
        container.appendChild(commandPreviewDiv);
    }

    handleInputChange(type, value) {
        // Parse the value
        let numValue = parseInt(value) || 0;
        
        // Apply CONFIG validation limits
        const validation = window.CONFIG?.VALIDATION?.ISO;
        if (validation) {
            switch (type) {
                case 'years':
                    numValue = Math.max(validation.YEARS_MIN, Math.min(validation.YEARS_MAX, numValue));
                    break;
                case 'months':
                    numValue = Math.max(validation.MONTHS_MIN, Math.min(validation.MONTHS_MAX, numValue));
                    break;
                case 'days':
                    numValue = Math.max(validation.DAYS_MIN, Math.min(validation.DAYS_MAX, numValue));
                    break;
                case 'hours':
                    numValue = Math.max(validation.HOURS_MIN, Math.min(validation.HOURS_MAX, numValue));
                    break;
                case 'minutes':
                    numValue = Math.max(validation.MINUTES_MIN, Math.min(validation.MINUTES_MAX, numValue));
                    break;
            }
        }
        
        // Update the input field if value was clamped
        const inputElement = document.getElementById(`estimate${type.charAt(0).toUpperCase() + type.slice(1)}`);
        if (inputElement && parseInt(inputElement.value) !== numValue) {
            inputElement.value = numValue || '';
        }
        
        // Update internal data
        this.estimateData[type] = numValue;
        
        // Update preview
        this.updatePreview();
        
        // Update app state
        this.updateState();
    }

    updatePreview() {
        // Update TaskWarrior ISO 8601 Duration preview (vienintelis preview)
        const commandOutputEl = document.getElementById('estimateCommandOutput');
        if (commandOutputEl) {
            const command = this.generateTaskWarriorCommand();
            
            if (command) {
                commandOutputEl.innerHTML = `<code>${command}</code>`;
                commandOutputEl.classList.add('has-command');
            } else {
                commandOutputEl.innerHTML = '<span class="no-command">Nepasirinktas estimate</span>';
                commandOutputEl.classList.remove('has-command');
            }
        }
    }

    generateISO8601Duration() {
        const { years, months, days, hours, minutes } = this.estimateData;
        
        // If all values are zero, return empty
        if (years === 0 && months === 0 && days === 0 && hours === 0 && minutes === 0) {
            return '';
        }
        
        let duration = 'P';
        
        // Add date components
        if (years > 0) duration += `${years}Y`;
        if (months > 0) duration += `${months}M`;
        if (days > 0) duration += `${days}D`;
        
        // Add time components if any exist
        if (hours > 0 || minutes > 0) {
            duration += 'T';
            if (hours > 0) duration += `${hours}H`;
            if (minutes > 0) duration += `${minutes}M`;
        }
        
        return duration;
    }

    updateState() {
        if (this.app) {
            this.app.updateState('currentTask.estimate', {
                data: this.estimateData,
                iso8601: this.generateISO8601Duration()
            });
        }
    }

    setupEvents() {
        // Add keyboard navigation between fields
        const inputs = ['estimateYears', 'estimateMonths', 'estimateDays', 'estimateHours', 'estimateMinutes'];
        
        inputs.forEach((inputId, index) => {
            const input = document.getElementById(inputId);
            if (input) {
                // Tab or Enter to next field
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab' || e.key === 'Enter') {
                        const nextIndex = (index + 1) % inputs.length;
                        const nextInput = document.getElementById(inputs[nextIndex]);
                        if (nextInput && e.key === 'Enter') {
                            e.preventDefault();
                            nextInput.focus();
                            nextInput.select();
                        }
                    }
                    
                    // Prevent invalid keys
                    if (e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && 
                        e.key !== 'Enter' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' &&
                        (e.key < '0' || e.key > '9') && !e.ctrlKey) {
                        e.preventDefault();
                    }
                });

                // Real-time validation on input
                input.addEventListener('input', (e) => {
                    const value = parseInt(e.target.value);
                    const validation = window.CONFIG?.VALIDATION?.ISO;
                    
                    if (validation && !isNaN(value)) {
                        let maxValue;
                        switch (inputId) {
                            case 'estimateYears':
                                maxValue = validation.YEARS_MAX;
                                break;
                            case 'estimateMonths':
                                maxValue = validation.MONTHS_MAX;
                                break;
                            case 'estimateDays':
                                maxValue = validation.DAYS_MAX;
                                break;
                            case 'estimateHours':
                                maxValue = validation.HOURS_MAX;
                                break;
                            case 'estimateMinutes':
                                maxValue = validation.MINUTES_MAX;
                                break;
                        }
                        
                        if (value > maxValue) {
                            e.target.value = maxValue;
                            e.target.classList.add('error');
                            setTimeout(() => e.target.classList.remove('error'), 1000);
                        }
                    }
                });

                // Auto-select on focus
                input.addEventListener('focus', () => {
                    setTimeout(() => input.select(), 0);
                });
            }
        });
    }

    // =============================================================================
    // CLEAR FORM METODAS
    // =============================================================================
    
    clearForm() {
        // Reset internal data
        this.estimateData = {
            years: 0,
            months: 0,
            days: 0,
            hours: 0,
            minutes: 0
        };

        // Clear input fields
        ['estimateYears', 'estimateMonths', 'estimateDays', 'estimateHours', 'estimateMinutes'].forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = '';
                input.classList.remove('error'); // Remove any error states
            }
        });

        // Update preview and state
        this.updatePreview();
        this.updateState();
    }

    // =============================================================================
    // PAGRINDINĖS FUNKCIJOS
    // =============================================================================

    getValue() {
        return {
            data: this.estimateData,
            iso8601: this.generateISO8601Duration()
        };
    }

    generateTaskWarriorCommand() {
        const duration = this.generateISO8601Duration();
        if (!duration) return '';
        return `estimate:${duration}`;
    }

    // Clear method - alias for clearForm to maintain compatibility
    clear() {
        this.clearForm();
    }

    // Validation
    isValid() {
        return true; // Estimate is optional
    }

    // Set values programmatically
    setValues(data) {
        if (!data) return;

        const inputMap = {
            years: 'estimateYears',
            months: 'estimateMonths', 
            days: 'estimateDays',
            hours: 'estimateHours',
            minutes: 'estimateMinutes'
        };

        Object.keys(this.estimateData).forEach(key => {
            if (data[key] !== undefined) {
                this.estimateData[key] = parseInt(data[key]) || 0;
                const input = document.getElementById(inputMap[key]);
                if (input) {
                    input.value = this.estimateData[key] || '';
                }
            }
        });

        this.updatePreview();
        this.updateState();
    }
}

// =============================================================================
// REGISTRACIJA
// =============================================================================

let estimateCard;

document.addEventListener('DOMContentLoaded', () => {
    estimateCard = new EstimateCard();
    
    if (window.registerCard) {
        window.registerCard('estimate', estimateCard);
    } else {
        setTimeout(() => {
            if (window.registerCard) {
                window.registerCard('estimate', estimateCard);
            }
        }, 500);
    }
});