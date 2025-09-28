// projekt/datetime/components/months-component.js
// Months Component - Adapted button design iš pavyzdžio projekto

class MonthsComponent {
    constructor(onMonthChange) {
        this.onMonthChange = onMonthChange; // Callback kai keičiasi month
        this.selectedMonth = null;
        this.isInitialized = false;
    }

    // =============================================================================
    // INITIALIZATION
    // =============================================================================

    initialize(containerId = 'monthsContent') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Months container ${containerId} not found`);
            return false;
        }

        this.generateMonthButtons(container);
        this.isInitialized = true;

        console.log('MonthsComponent initialized successfully');
        return true;
    }

    // =============================================================================
    // UI GENERATION - Adapted iš pavyzdžio button design
    // =============================================================================

    generateMonthButtons(container) {
        // Get months data from CONFIG or use defaults
        const months = window.CALENDAR_DATA?.months || this.getDefaultMonths();
        
        container.innerHTML = `
            <div class="button-group button-group-double" id="monthsButtons">
                <!-- Buttons will be generated here -->
            </div>
            <div class="helper-text">Pasirinkite mėnesį</div>
        `;

        const buttonsContainer = container.querySelector('#monthsButtons');
        
        months.forEach((month, index) => {
            const button = document.createElement('div');
            button.className = 'btn-small';
            button.setAttribute('data-month', month.key);
            button.setAttribute('data-index', month.index);
            button.textContent = month.name;
            
            // Event listener
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleMonthSelection(button, month);
            });
            
            buttonsContainer.appendChild(button);
        });
    }

    getDefaultMonths() {
        return [
            { key: 'january', name: 'January', index: 0 },
            { key: 'february', name: 'February', index: 1 },
            { key: 'march', name: 'March', index: 2 },
            { key: 'april', name: 'April', index: 3 },
            { key: 'may', name: 'May', index: 4 },
            { key: 'june', name: 'June', index: 5 },
            { key: 'july', name: 'July', index: 6 },
            { key: 'august', name: 'August', index: 7 },
            { key: 'september', name: 'September', index: 8 },
            { key: 'october', name: 'October', index: 9 },
            { key: 'november', name: 'November', index: 10 },
            { key: 'december', name: 'December', index: 11 }
        ];
    }

    // =============================================================================
    // SELECTION HANDLING - Adapted logic
    // =============================================================================

    handleMonthSelection(button, month) {
        console.log(`Month selected: ${month.key}`);
        
        // Clear previous selection
        this.clearSelectionInContainer(button.parentElement);
        
        // Set new selection
        button.classList.add('selected');
        this.selectedMonth = month.key;
        
        // Notify parent component
        if (this.onMonthChange) {
            this.onMonthChange(month.key, month, button);
        }
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
        if (!this.selectedMonth) {
            return {
                month: null,
                monthKey: null,
                monthIndex: null,
                formatted: null,
                isEmpty: true
            };
        }

        const months = window.CALENDAR_DATA?.months || this.getDefaultMonths();
        const monthData = months.find(m => m.key === this.selectedMonth);

        return {
            month: this.selectedMonth,
            monthKey: this.selectedMonth,
            monthName: monthData?.name || this.selectedMonth,
            monthIndex: monthData?.index || null,
            formatted: this.getTaskWarriorFormat(), // TaskWarrior format
            isEmpty: false
        };
    }

    setValue(data) {
        if (!data) {
            this.clearSelection();
            return;
        }

        let monthKey = null;
        
        if (typeof data === 'string') {
            monthKey = data;
        } else if (data.month) {
            monthKey = data.month;
        } else if (data.monthKey) {
            monthKey = data.monthKey;
        }

        if (monthKey) {
            this.setSelection(monthKey);
        }
    }

    setSelection(monthKey) {
        // Find button with this month
        const button = document.querySelector(`[data-month="${monthKey}"]`);
        if (button) {
            // Get month data
            const months = window.CALENDAR_DATA?.months || this.getDefaultMonths();
            const monthData = months.find(m => m.key === monthKey);
            
            if (monthData) {
                this.handleMonthSelection(button, monthData);
            }
        }
    }

    clearSelection() {
        this.selectedMonth = null;
        
        // Clear UI selection
        const container = document.getElementById('monthsButtons');
        if (container) {
            this.clearSelectionInContainer(container);
        }
    }

    getSelectedMonth() {
        return this.selectedMonth;
    }

    // =============================================================================
    // TASKWARRIOR FORMAT GENERATION
    // =============================================================================

    getTaskWarriorFormat() {
        if (!this.selectedMonth) return null;

        const nextDate = this.getNextMonthDate();
        if (!nextDate) return this.selectedMonth;

        // Generate YYYY-MM format for TaskWarrior
        const year = nextDate.getFullYear();
        const month = String(nextDate.getMonth() + 1).padStart(2, '0');
        
        return `${year}-${month}`;
    }

    // =============================================================================
    // DATE CALCULATION UTILITIES
    // =============================================================================

    getNextMonthDate() {
        if (!this.selectedMonth) return null;

        const months = window.CALENDAR_DATA?.months || this.getDefaultMonths();
        const monthData = months.find(m => m.key === this.selectedMonth);
        
        if (!monthData) return null;
        
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const targetMonthIndex = monthData.index;
        
        let targetYear = currentYear;
        let targetMonth = targetMonthIndex;
        
        // If target month is in the past this year, use next year
        if (targetMonth <= currentMonth) {
            targetYear += 1;
        }
        
        return new Date(targetYear, targetMonth, 1);
    }

    getFormattedNextDate() {
        const nextDate = this.getNextMonthDate();
        if (!nextDate) return null;
        
        const year = nextDate.getFullYear();
        const month = String(nextDate.getMonth() + 1).padStart(2, '0');
        
        return `${year}-${month}-01`;
    }

    // Get month name in different formats
    getMonthName(format = 'full') {
        if (!this.selectedMonth) return null;

        const months = window.CALENDAR_DATA?.months || this.getDefaultMonths();
        const monthData = months.find(m => m.key === this.selectedMonth);
        
        if (!monthData) return this.selectedMonth;

        switch (format) {
            case 'full':
                return monthData.name;
            case 'key':
                return monthData.key;
            case 'index':
                return monthData.index;
            default:
                return monthData.name;
        }
    }

    // =============================================================================
    // UTILITY METHODS
    // =============================================================================

    isValid() {
        return this.selectedMonth !== null;
    }

    isEmpty() {
        return this.selectedMonth === null;
    }

    // Get human-readable description
    getDescription() {
        if (!this.selectedMonth) return null;

        const monthName = this.getMonthName('full');
        const nextDate = this.getNextMonthDate();
        
        if (nextDate) {
            const year = nextDate.getFullYear();
            return `${monthName} ${year}`;
        }
        
        return monthName;
    }

    // =============================================================================
    // CLEANUP
    // =============================================================================

    destroy() {
        // Remove event listeners
        const buttons = document.querySelectorAll('[data-month]');
        buttons.forEach(button => {
            button.removeEventListener('click', this.handleMonthSelection);
        });
        
        this.isInitialized = false;
        this.selectedMonth = null;
        console.log('MonthsComponent destroyed');
    }
}

// =============================================================================
// GLOBAL EXPORT
// =============================================================================
window.MonthsComponent = MonthsComponent;