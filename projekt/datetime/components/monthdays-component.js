// projekt/datetime/components/monthdays-component.js
// Month Days Component - Adapted input su suffix logic iš pavyzdžio projekto

class MonthdaysComponent {
    constructor(onDayChange) {
        this.onDayChange = onDayChange; // Callback kai keičiasi day
        this.currentDay = null;
        this.isInitialized = false;
    }

    // =============================================================================
    // INITIALIZATION
    // =============================================================================

    initialize(containerId = 'monthdaysContent') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Monthdays container ${containerId} not found`);
            return false;
        }

        this.generateMonthdayInput(container);
        this.setupEventListeners();
        this.isInitialized = true;

        console.log('MonthdaysComponent initialized successfully');
        return true;
    }

    // =============================================================================
    // UI GENERATION - Adapted iš pavyzdžio input design
    // =============================================================================

    generateMonthdayInput(container) {
        // Get validation config
        const minDay = window.CONFIG?.VALIDATION?.MONTHDAY?.MIN || 1;
        const maxDay = window.CONFIG?.VALIDATION?.MONTHDAY?.MAX || 31;
        
        container.innerHTML = `
            <div class="centered-input">
                <input type="number" 
                       id="monthDayInput" 
                       class="monthday-input" 
                       min="${minDay}" 
                       max="${maxDay}" 
                       placeholder="DD">
            </div>
            <div class="monthday-preview" id="monthdayPreview" style="display: none;"></div>
        `;
    }

    // =============================================================================
    // EVENT LISTENERS
    // =============================================================================

    setupEventListeners() {
        const input = document.getElementById('monthDayInput');
        if (!input) {
            console.error('Month day input element not found');
            return;
        }

        // Input event - real-time validation and preview
        input.addEventListener('input', (e) => {
            this.handleDayInput(e.target);
        });

        // Blur event - final validation and formatting
        input.addEventListener('blur', (e) => {
            this.validateAndFormatDay(e.target);
        });

        // Keyboard navigation
        input.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e, input);
        });
    }

    // =============================================================================
    // INPUT VALIDATION - Adapted validation logic
    // =============================================================================

    handleDayInput(input) {
        const value = parseInt(input.value);
        
        if (!isNaN(value)) {
            const validatedValue = this.validateDayInput(value);
            this.currentDay = validatedValue;
            this.updatePreview();
            this.showPreview();
            this.notifyChange();
        } else {
            this.currentDay = null; // PRIDĖTA: null kai nėra vertės
            this.hidePreview(); // PRIDĖTA: slėpti preview
        }
    }

    validateAndFormatDay(input) {
        const inputValue = input.value.trim();
        
        // Jei input tuščias - palikti tuščią
        if (inputValue === '' || inputValue === null || inputValue === undefined) {
            this.currentDay = null;
            this.hidePreview();
            this.notifyChange();
            return;
        }
        
        // Jei yra vertė - validuoti ir formatuoti
        const numValue = parseInt(inputValue);
        if (!isNaN(numValue)) {
            const validatedValue = this.validateDayInput(numValue);
            input.value = validatedValue;
            this.currentDay = validatedValue;
            this.updatePreview();
            this.showPreview();
            this.notifyChange();
        } else {
            // Neteisingas input - išvalyti
            input.value = '';
            this.currentDay = null;
            this.hidePreview();
            this.notifyChange();
        }
    }

    validateDayInput(value) {
        const minDay = window.CONFIG?.VALIDATION?.MONTHDAY?.MIN || 1;
        const maxDay = window.CONFIG?.VALIDATION?.MONTHDAY?.MAX || 31;
        
        if (isNaN(value) || value < minDay) {
            return minDay;
        } else if (value > maxDay) {
            return maxDay;
        }
        return value;
    }

    // =============================================================================
    // KEYBOARD NAVIGATION
    // =============================================================================

    handleKeyNavigation(event, input) {
        switch(event.key) {
            case 'ArrowUp':
                event.preventDefault();
                this.incrementDay(input);
                break;
                
            case 'ArrowDown':
                event.preventDefault();
                this.decrementDay(input);
                break;
                
            case 'Enter':
                event.preventDefault();
                input.blur(); // Trigger validation
                break;
        }
    }

    incrementDay(input) {
        // Jei currentDay null - nieko nedaryti
        if (this.currentDay === null) {
            return; // PAKEISTA: nieko nedaryt vietoj auto-nustatymo
        }
        
        const maxDay = window.CONFIG?.VALIDATION?.MONTHDAY?.MAX || 31;
        const newValue = this.currentDay >= maxDay ? 1 : this.currentDay + 1;
        input.value = newValue;
        this.handleDayInput(input);
    }

    decrementDay(input) {
        // Jei currentDay null - nieko nedaryti
        if (this.currentDay === null) {
            return; // PAKEISTA: nieko nedaryt vietoj auto-nustatymo
        }
        
        const minDay = window.CONFIG?.VALIDATION?.MONTHDAY?.MIN || 1;
        const maxDay = window.CONFIG?.VALIDATION?.MONTHDAY?.MAX || 31;
        const newValue = this.currentDay <= minDay ? maxDay : this.currentDay - 1;
        input.value = newValue;
        this.handleDayInput(input);
    }

    // =============================================================================
    // SUFFIX GENERATION - Adapted iš pavyzdžio projekto
    // =============================================================================

    getSuffix(num) {
        const lastDigit = num % 10;
        const lastTwoDigits = num % 100;
        
        // Special cases for 11th, 12th, 13th
        if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
            return 'th';
        }
        
        // Regular cases
        switch (lastDigit) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    getFormattedDay() {
        if (this.currentDay === null) return '';
        return this.currentDay + this.getSuffix(this.currentDay);
    }

    // =============================================================================
    // PREVIEW & NOTIFICATIONS
    // =============================================================================

    updatePreview() {
        const preview = document.getElementById('monthdayPreview');
        if (preview) {
            preview.textContent = this.getFormattedDay();
        }
    }

    showPreview() {
        const preview = document.getElementById('monthdayPreview');
        if (preview) {
            preview.style.display = 'block';
        }
    }

    hidePreview() {
        const preview = document.getElementById('monthdayPreview');
        if (preview) {
            preview.style.display = 'none';
        }
    }

    notifyChange() {
        if (this.onDayChange) {
            this.onDayChange(this.currentDay, this.getFormattedDay());
        }
    }

    // =============================================================================
    // DATE CALCULATION UTILITIES
    // =============================================================================

    generatePreviewDate() {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const targetDay = this.currentDay;
        
        // Try current month first
        let targetDate = new Date(currentYear, currentMonth, targetDay);
        
        // If date is in the past or invalid, try next month
        if (targetDate <= today || targetDate.getMonth() !== currentMonth) {
            targetDate = new Date(currentYear, currentMonth + 1, targetDay);
            
            // If next year (month overflow), adjust
            if (targetDate.getMonth() !== (currentMonth + 1) % 12) {
                targetDate = new Date(currentYear + 1, 0, targetDay);
            }
        }
        
        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDay).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }

    getDescription() {
        const previewDate = this.generatePreviewDate();
        const formattedDay = this.getFormattedDay();
        return `${formattedDay} kiekvieno mėnesio (kitas: ${previewDate})`;
    }

    // =============================================================================
    // PUBLIC API METHODS
    // =============================================================================

    getValue() {
        return {
            day: this.currentDay,
            formatted: this.getFormattedDay(),
            previewDate: this.generatePreviewDate(),
            description: this.getDescription(),
            isEmpty: this.currentDay === null
        };
    }

    setValue(data) {
        if (!data) {
            this.setDay(1);
            return;
        }

        let dayValue = null;
        
        if (typeof data === 'number') {
            dayValue = data;
        } else if (typeof data === 'string') {
            // Parse formatted day (e.g., "15th" -> 15)
            dayValue = parseInt(data.replace(/\D/g, ''));
        } else if (data.day !== undefined) {
            dayValue = data.day;
        }

        if (dayValue && !isNaN(dayValue)) {
            this.setDay(dayValue);
        }
    }

    setDay(day) {
        const validatedDay = this.validateDayInput(day);
        this.currentDay = validatedDay;
        
        // Update UI input
        const input = document.getElementById('monthDayInput');
        if (input) {
            input.value = validatedDay;
        }
        
        // Update preview
        this.updatePreview();
        
        // Notify change
        this.notifyChange();
        
        return this.getFormattedDay();
    }

    getCurrentDay() {
        return this.currentDay;
    }

    clear() {
        this.currentDay = null; // PAKEISTA: buvo setDay(1), dabar null
        
        const input = document.getElementById('monthDayInput');
        if (input) {
            input.value = ''; // PAKEISTA: tuščias input
        }
        
        this.hidePreview(); // PRIDĖTA: slėpti preview
        this.notifyChange();
        return '';
    }

    // =============================================================================
    // UTILITY METHODS
    // =============================================================================

    isValid() {
        const minDay = window.CONFIG?.VALIDATION?.MONTHDAY?.MIN || 1;
        const maxDay = window.CONFIG?.VALIDATION?.MONTHDAY?.MAX || 31;
        return this.currentDay >= minDay && this.currentDay <= maxDay;
    }

    isEmpty() {
        return this.currentDay === null;
    }

    // Get all possible formatted days (for reference)
    getAllFormattedDays() {
        const days = [];
        for (let i = 1; i <= 31; i++) {
            days.push({
                day: i,
                formatted: i + this.getSuffix(i)
            });
        }
        return days;
    }

    // =============================================================================
    // CLEANUP
    // =============================================================================

    destroy() {
        // Remove event listeners
        const input = document.getElementById('monthDayInput');
        if (input) {
            input.removeEventListener('input', this.handleDayInput);
            input.removeEventListener('blur', this.validateAndFormatDay);
            input.removeEventListener('keydown', this.handleKeyNavigation);
        }
        
        this.isInitialized = false;
        console.log('MonthdaysComponent destroyed');
    }
}

// =============================================================================
// GLOBAL EXPORT
// =============================================================================
window.MonthdaysComponent = MonthdaysComponent;