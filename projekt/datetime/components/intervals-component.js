// projekt/datetime/components/intervals-component.js
// Intervals Component - Adapted button design iš pavyzdžio projekto

class IntervalsComponent {
    constructor(onIntervalChange) {
        this.onIntervalChange = onIntervalChange; // Callback kai keičiasi interval
        this.selectedInterval = null;
        this.isInitialized = false;
    }

    // =============================================================================
    // INITIALIZATION
    // =============================================================================

    initialize(containerId = 'intervalsContent') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Intervals container ${containerId} not found`);
            return false;
        }

        this.generateIntervalButtons(container);
        this.isInitialized = true;

        console.log('IntervalsComponent initialized successfully');
        return true;
    }

    // =============================================================================
    // UI GENERATION - Adapted iš pavyzdžio button design
    // =============================================================================

    generateIntervalButtons(container) {
        // Get intervals data from CONFIG or use defaults
        const intervals = window.INTERVALS?.simple || this.getDefaultIntervals();
        
        container.innerHTML = `
            <div class="button-group button-group-double" id="intervalsButtons">
                <!-- Buttons will be generated here -->
            </div>
        `;

        const buttonsContainer = container.querySelector('#intervalsButtons');
        
        intervals.forEach((interval, index) => {
            const button = document.createElement('div');
            button.className = 'btn-small';
            button.setAttribute('data-interval', interval.key);
            button.setAttribute('data-index', index);
            button.textContent = interval.name;
            button.title = interval.description || interval.name; // Tooltip
            
            // Event listener
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleIntervalSelection(button, interval);
            });
            
            buttonsContainer.appendChild(button);
        });
    }

    getDefaultIntervals() {
        return [
            { key: 'daily', name: 'daily', description: 'Kasdien' },
            { key: 'weekly', name: 'weekly', description: 'Kas savaitę' },
            { key: 'monthly', name: 'monthly', description: 'Kas mėnesį' },
            { key: 'yearly', name: 'yearly', description: 'Kasmet' },
            { key: 'weekdays', name: 'weekdays', description: 'Darbo dienomis' },
            { key: 'weekends', name: 'weekends', description: 'Savaitgaliais' }
        ];
    }

    // =============================================================================
    // SELECTION HANDLING - Adapted logic
    // =============================================================================

    handleIntervalSelection(button, interval) {
        console.log(`Interval selected: ${interval.key}`);
        
        // Clear previous selection
        this.clearSelectionInContainer(button.parentElement);
        
        // Set new selection
        button.classList.add('selected');
        this.selectedInterval = interval.key;
        
        // Notify parent component
        if (this.onIntervalChange) {
            this.onIntervalChange(interval.key, interval, button);
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
        if (!this.selectedInterval) {
            return {
                interval: null,
                intervalKey: null,
                formatted: null,
                isEmpty: true
            };
        }

        const intervals = window.INTERVALS?.simple || this.getDefaultIntervals();
        const intervalData = intervals.find(i => i.key === this.selectedInterval);

        return {
            interval: this.selectedInterval,
            intervalKey: this.selectedInterval,
            intervalName: intervalData?.name || this.selectedInterval,
            description: intervalData?.description || this.selectedInterval,
            formatted: this.selectedInterval, // TaskWarrior format
            isEmpty: false
        };
    }

    setValue(data) {
        if (!data) {
            this.clearSelection();
            return;
        }

        let intervalKey = null;
        
        if (typeof data === 'string') {
            intervalKey = data;
        } else if (data.interval) {
            intervalKey = data.interval;
        } else if (data.intervalKey) {
            intervalKey = data.intervalKey;
        }

        if (intervalKey) {
            this.setSelection(intervalKey);
        }
    }

    setSelection(intervalKey) {
        // Find button with this interval
        const button = document.querySelector(`[data-interval="${intervalKey}"]`);
        if (button) {
            // Get interval data
            const intervals = window.INTERVALS?.simple || this.getDefaultIntervals();
            const intervalData = intervals.find(i => i.key === intervalKey);
            
            if (intervalData) {
                this.handleIntervalSelection(button, intervalData);
            }
        }
    }

    clearSelection() {
        this.selectedInterval = null;
        
        // Clear UI selection
        const container = document.getElementById('intervalsButtons');
        if (container) {
            this.clearSelectionInContainer(container);
        }
    }

    getSelectedInterval() {
        return this.selectedInterval;
    }

    // =============================================================================
    // INTERVAL UTILITIES
    // =============================================================================

    getIntervalName(intervalKey = null) {
        const key = intervalKey || this.selectedInterval;
        if (!key) return null;

        const intervals = window.INTERVALS?.simple || this.getDefaultIntervals();
        const intervalData = intervals.find(i => i.key === key);
        return intervalData ? intervalData.name : key;
    }

    getIntervalDescription(intervalKey = null) {
        const key = intervalKey || this.selectedInterval;
        if (!key) return null;

        const intervals = window.INTERVALS?.simple || this.getDefaultIntervals();
        const intervalData = intervals.find(i => i.key === key);
        return intervalData ? intervalData.description : key;
    }

    // Check if interval is time-based (vs frequency-based)
    isTimeBased() {
        const timeBasedIntervals = ['daily', 'weekly', 'monthly', 'yearly'];
        return timeBasedIntervals.includes(this.selectedInterval);
    }

    // Check if interval is context-based
    isContextBased() {
        const contextBasedIntervals = ['weekdays', 'weekends'];
        return contextBasedIntervals.includes(this.selectedInterval);
    }

    // Get example of what this interval means
    getExampleDescription() {
        if (!this.selectedInterval) return null;

        const examples = {
            'daily': 'Kas dieną tuo pačiu laiku',
            'weekly': 'Kas savaitę tą pačią dieną',
            'monthly': 'Kas mėnesį tą pačią dieną',
            'yearly': 'Kasmet tą pačią datą',
            'weekdays': 'Pirmadienį-penktadienį',
            'weekends': 'Šeštadienį ir sekmadienį'
        };

        return examples[this.selectedInterval] || this.getIntervalDescription();
    }

    // =============================================================================
    // UTILITY METHODS
    // =============================================================================

    isValid() {
        return this.selectedInterval !== null;
    }

    isEmpty() {
        return this.selectedInterval === null;
    }

    // Get all available intervals
    getAllIntervals() {
        return window.INTERVALS?.simple || this.getDefaultIntervals();
    }

    // Check if given interval key is valid
    isValidInterval(intervalKey) {
        const intervals = this.getAllIntervals();
        return intervals.some(interval => interval.key === intervalKey);
    }

    // =============================================================================
    // CLEANUP
    // =============================================================================

    destroy() {
        // Remove event listeners
        const buttons = document.querySelectorAll('[data-interval]');
        buttons.forEach(button => {
            button.removeEventListener('click', this.handleIntervalSelection);
        });
        
        this.isInitialized = false;
        this.selectedInterval = null;
        console.log('IntervalsComponent destroyed');
    }
}

// =============================================================================
// GLOBAL EXPORT
// =============================================================================
window.IntervalsComponent = IntervalsComponent;