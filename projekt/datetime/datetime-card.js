// projekt/datetime/datetime-card.js
// PAPRASTAS SPRENDIMAS: Vienas komponentas keliauja tarp laukų

class DateTimeCard {
    constructor() {
        this.name = 'datetime';
        this.element = null;
        this.app = null;
        
        // Duomenys kiekvienam laukui
        this.fieldData = {
            due: {},
            wait: {},
            scheduled: {},
            recur: {},
            until: {}
        };
        
        // Vienas shared komponentas kiekvienam tipui
        this.sharedComponents = {};
        
        // Kas dabar aktyvus
        this.currentField = null;
        this.currentComponent = null;
        
        // Laukų konfigūracija
        this.fieldConfigs = {
            due: ['calendar', 'time', 'weekdays', 'monthdays', 'months'],
            wait: ['calendar', 'time', 'weekdays', 'monthdays', 'months'],
            scheduled: ['calendar', 'time', 'weekdays', 'monthdays', 'months'],
            recur: ['intervals', 'intervals-iso'],
            until: ['calendar', 'time', 'weekdays', 'monthdays', 'months']
        };
        
        this.componentClasses = {
            'calendar': 'CalendarComponent',
            'time': 'TimeComponent',
            'weekdays': 'WeekdaysComponent',
            'monthdays': 'MonthdaysComponent',
            'months': 'MonthsComponent',
            'intervals': 'IntervalsComponent',
            'intervals-iso': 'IntervalsIsoComponent'
        };

        this.fieldInfo = {
            due: 'DUE',
            wait: 'WAIT',
            scheduled: 'SCHEDULED',
            recur: 'RECUR',
            until: 'UNTIL'
        };
    }

    init(app) {
        this.app = app;
        this.element = document.querySelector('[data-card="datetime"]');
        if (!this.element) {
            console.error('DATETIME: Nerastas datetime elementas');
            return;
        }

        this.generateAccordionFields();
        this.createSharedComponents();
        console.log('DATETIME: Accordion su shared komponentais');
    }

    generateAccordionFields() {
        const cardContent = this.element.querySelector('.card-content');
        
        cardContent.innerHTML = `
            <div class="datetime-accordion-container">
                ${Object.keys(this.fieldConfigs).map(field => this.generateAccordionField(field)).join('')}
            </div>
            
            <!-- Shared component area - invisible container -->
            <div id="sharedComponentArea" style="display: none;">
                <!-- Komponentai bus čia -->
            </div>
            
            <!-- Global preview section - TEISINGAI NAUDOJA global-preview-section -->
            <div class="global-preview-section">
                <div class="preview-title">TaskWarrior Command Preview:</div>
                <div class="command-output" id="commandOutput">
                    <span class="no-command">Nepasirinkti jokie datetime laukai</span>
                </div>
            </div>
        `;
    }

    generateAccordionField(field) {
        const title = this.fieldInfo[field];
        
        return `
            <div class="accordion-item" data-field="${field}">
                <div class="accordion-header" onclick="datetimeCard.toggleAccordion('${field}')">
                    <div class="accordion-title">
                        <span class="field-name">${title}</span>
                    </div>
                    <div class="accordion-controls">
                        <span class="field-status clickable-status" id="${field}-status" onclick="datetimeCard.clearField('${field}')" title="Paspausti norėdami išvalyti"></span>
                        <button class="field-help-btn" onclick="event.stopPropagation(); datetimeCard.showFieldHelp('${field}')" title="Pagalba apie ${title}">?</button>
                    </div>
                </div>
                
                <div class="accordion-content collapsed" id="${field}-accordion-content">
                    <div class="components-section">
                        <div class="component-grid">
                            ${this.fieldConfigs[field].map(component => `
                                <div class="component-card" 
                                     data-component="${component}"
                                     onclick="datetimeCard.showComponent('${field}', '${component}')">
                                    <div class="component-header">
                                        <span class="component-icon">${this.getComponentIcon(component)}</span>
                                        <span class="component-name">${this.getComponentName(component)}</span>
                                    </div>
                                    <div class="component-status clickable-component-status" id="${field}-${component}-status" onclick="event.stopPropagation(); datetimeCard.clearComponent('${field}', '${component}')" title="Paspausti norėdami išvalyti ${component}"></div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <!-- Vieta komponentui -->
                        <div class="active-component-area" id="${field}-active-component" style="display: none;">
                            <!-- Aktyvus komponentas bus čia -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showFieldHelp(field) {
        const fieldUpper = field.toUpperCase();
        if (window.showHelpModal && window.DATA && window.DATA.HELP[fieldUpper]) {
            window.showHelpModal(fieldUpper);
        } else {
            // Fallback
            alert(`${fieldUpper} pagalba: Informacija apie ${field} lauką.`);
        }
    }

    // Sukurti shared komponentus
    createSharedComponents() {
        Object.keys(this.componentClasses).forEach(componentType => {
            const ComponentClass = window[this.componentClasses[componentType]];
            if (ComponentClass) {
                this.sharedComponents[componentType] = new ComponentClass(
                    (...args) => this.onComponentChange(componentType, ...args)
                );
                console.log(`Shared ${componentType} sukurtas`);
            }
        });
    }

    // Accordion toggle
    toggleAccordion(field) {
        const content = document.getElementById(`${field}-accordion-content`);
        
        if (!content) return;
        
        const isCollapsed = content.classList.contains('collapsed');
        
        if (isCollapsed) {
            // NAUJAS KODAS: Uždarykite visas kitas korteles
            this.closeAllAccordions();
            
            // Atidarykite paspaustą kortelę
            content.classList.remove('collapsed');
        } else {
            content.classList.add('collapsed');
            this.hideActiveComponent();
        }
    }

    closeAllAccordions() {
        Object.keys(this.fieldConfigs).forEach(field => {
            const content = document.getElementById(`${field}-accordion-content`);
            
            if (content && !content.classList.contains('collapsed')) {
                content.classList.add('collapsed');
            }
        });
        
        this.hideActiveComponent();
    }

    // Rodyti komponentą
    showComponent(field, componentType) {
        console.log(`Showing ${componentType} for ${field}`);
        
        // PRIDĖTA: Tikrinti ar tas pats komponentas jau aktyvus
        if (this.currentField === field && this.currentComponent === componentType) {
            // Jei tas pats komponentas - uždaryti jį (toggle effect)
            this.hideActiveComponent();
            return; // SVARBU: sustabdyti funkcijos vykdymą
        }
        
        // Slėpti aktyvų komponentą
        this.hideActiveComponent();
        
        // Nustatyti naują aktyvų
        this.currentField = field;
        this.currentComponent = componentType;
        
        // Gauti shared komponentą
        const component = this.sharedComponents[componentType];
        if (!component) {
            console.error(`Shared component ${componentType} not found`);
            return;
        }
        
        // Gauti target area
        const targetArea = document.getElementById(`${field}-active-component`);
        if (!targetArea) {
            console.error(`Target area for ${field} not found`);
            return;
        }
        
        // Sukurti HTML su standartiniais ID
        targetArea.innerHTML = this.getComponentHTML(componentType);
        targetArea.style.display = 'block';
        
        // Nustatyti CSS klases
        targetArea.className = 'active-component-area component-card';
        targetArea.setAttribute('data-component', componentType);
        
        // Inicializuoti komponentą target area
        const success = component.initialize(targetArea.id);
        
        if (success) {
            // Užkrauti duomenis jei yra
            if (this.fieldData[field] && this.fieldData[field][componentType]) {
                component.setValue(this.fieldData[field][componentType]);
            }
            
            // Pažymėti card kaip aktyvų
            this.setComponentCardActive(field, componentType, true);
            
            console.log(`Component ${componentType} active in ${field}`);
        }
    }

    // Slėpti aktyvų komponentą
    hideActiveComponent() {
        if (!this.currentField || !this.currentComponent) return;
        
        // Išsaugoti duomenis
        this.saveCurrentComponentData();
        
        // Destroy komponentą
        const component = this.sharedComponents[this.currentComponent];
        if (component && component.destroy) {
            component.destroy();
        }
        
        // Slėpti area
        const targetArea = document.getElementById(`${this.currentField}-active-component`);
        if (targetArea) {
            targetArea.style.display = 'none';
            targetArea.innerHTML = '';
        }
        
        // Pažymėti card kaip neaktyvų
        this.setComponentCardActive(this.currentField, this.currentComponent, false);
        
        console.log(`Component ${this.currentComponent} hidden from ${this.currentField}`);
        
        this.currentField = null;
        this.currentComponent = null;
    }

    // Išsaugoti aktyvaus komponento duomenis
    saveCurrentComponentData() {
        if (!this.currentField || !this.currentComponent) return;
        
        const component = this.sharedComponents[this.currentComponent];
        if (component && component.getValue) {
            const value = component.getValue();
            if (!value.isEmpty) {
                if (!this.fieldData[this.currentField]) {
                    this.fieldData[this.currentField] = {};
                }
                this.fieldData[this.currentField][this.currentComponent] = value;
            } else {
                if (this.fieldData[this.currentField]) {
                    delete this.fieldData[this.currentField][this.currentComponent];
                }
            }
            
            this.updateFieldStatus(this.currentField);
            this.updateComponentStatus(this.currentField, this.currentComponent);
            this.updateComponentAvailability(this.currentField);
        }
    }

    updateComponentAvailability(field) {
        const fieldData = this.fieldData[field] || {};
        const disabledComponents = window.DateTimeCompatibility.getDisabledComponents(field, fieldData);
        
        this.fieldConfigs[field].forEach(componentType => {
            const shouldBeDisabled = disabledComponents.includes(componentType);
            const card = document.querySelector(`[data-field="${field}"] [data-component="${componentType}"]`);
            
            if (card) {
                if (shouldBeDisabled) {
                    card.classList.add('disabled');
                    card.style.opacity = '0.4';
                    card.style.pointerEvents = 'none';
                } else {
                    card.classList.remove('disabled');
                    card.style.opacity = '';
                    card.style.pointerEvents = '';
                }
            }
        });
    }

    // Komponento callback
    onComponentChange(componentType, ...args) {
        if (this.currentField && this.currentComponent === componentType) {
            this.saveCurrentComponentData();
            this.updateGlobalPreview();
            this.updateState();
        }
    }

    // Komponentų HTML
    getComponentHTML(componentType) {
        switch (componentType) {
            case 'calendar':
                return `
                    <div class="calendar">
                        <div class="calendar-selects">
                            <select id="yearSelect"></select>
                            <select id="monthSelect"></select>
                        </div>
                        <div class="calendar-grid" id="calendarGrid"></div>
                    </div>
                `;
            case 'time':
                return `
                    <div class="time-input-container">
                        <input type="number" id="timeHours" class="time-input" min="0" max="23" placeholder="HH" value="">
                        <span class="time-separator">:</span>
                        <input type="number" id="timeMinutes" class="time-input" min="0" max="59" placeholder="MM" value="">
                    </div>
                    <div class="helper-text">Valandos: 00-23, Minutės: 0-59</div>
                `;
            case 'weekdays':
                return `<div id="weekdaysContent"></div>`;
            case 'monthdays':
                return `
                    <div class="centered-input">
                        <input type="number" id="monthDayInput" class="monthday-input" min="1" max="31" placeholder="DD">
                    </div>
                    <div class="monthday-preview" id="monthdayPreview" style="display: none;"></div>
                    <div class="helper-text">Sistema automatiškai prideda: 1st, 2nd, 3rd...</div>
                `;
            case 'months':
                return `<div id="monthsContent"></div>`;
            case 'intervals':
                return `<div id="intervalsContent"></div>`;
            case 'intervals-iso':
                return `
                    <div class="iso-input-container">
                        <div class="iso-format-label">ISO 8601 formatas</div>
                        <div class="iso-inputs">
                            <input type="number" id="isoYears" class="iso-input" min="0" max="99" placeholder="YY">
                            <span class="iso-separator">:</span>
                            <input type="number" id="isoMonths" class="iso-input" min="0" max="99" placeholder="MM">
                            <span class="iso-separator">:</span>
                            <input type="number" id="isoDays" class="iso-input" min="0" max="999" placeholder="DD">
                            <span class="iso-separator">:</span>
                            <input type="number" id="isoHours" class="iso-input" min="0" max="23" placeholder="hh">
                            <span class="iso-separator">:</span>
                            <input type="number" id="isoMinutes" class="iso-input" min="0" max="59" placeholder="mm">
                        </div>
                        <div class="helper-text">Metai : Mėnesiai : Dienos : Valandos : Minutės</div>
                        <div class="iso-preview" id="isoPreview"></div>
                    </div>
                `;
            default:
                return '<div>Komponentas nerastas</div>';
        }
    }

    // UI helper metodai
    setComponentCardActive(field, componentType, isActive) {
        const card = document.querySelector(`[data-field="${field}"] [data-component="${componentType}"]`);
        if (card) {
            if (isActive) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        }
    }

    updateFieldStatus(field) {
        const statusEl = document.getElementById(`${field}-status`);
        if (!statusEl) return;
        
        const fieldData = this.fieldData[field];
        const hasData = fieldData && Object.keys(fieldData).length > 0;
        
        if (hasData) {
            const command = this.generateFieldCommand(field, fieldData);
            statusEl.textContent = command || '✓';
            statusEl.classList.add('has-data');
        } else {
            statusEl.textContent = '';
            statusEl.classList.remove('has-data');
        }
    }

    clearField(field) {
        // Tikrinti ar yra duomenų
        const fieldData = this.fieldData[field];
        const hasData = fieldData && Object.keys(fieldData).length > 0;
        
        if (!hasData) {
            // Jei nėra duomenų - nieko nedaryti
            return;
        }
        
        // PRIDĖTA: Išvalyti VISŲ field komponentų vidines būsenas
        const fieldComponents = this.fieldConfigs[field] || [];
        fieldComponents.forEach(componentType => {
            const component = this.sharedComponents[componentType];
            if (component) {
                console.log(`Clearing shared component ${componentType} for field ${field}`);
                
                // Laikinai inicializuoti komponentą jei reikia
                const tempContainer = document.createElement('div');
                tempContainer.id = `temp-clear-${componentType}-${Date.now()}`;
                tempContainer.style.display = 'none';
                document.body.appendChild(tempContainer);
                
                try {
                    if (component.initialize && component.initialize(tempContainer.id)) {
                        this.clearActiveComponent(component, componentType);
                        component.destroy && component.destroy();
                    }
                } catch (error) {
                    console.warn(`Error clearing component ${componentType}:`, error);
                }
                
                document.body.removeChild(tempContainer);
            }
        });
        
        // Išvalyti field duomenis
        this.fieldData[field] = {};
        
        // Jei šis field aktyvus - uždaryti komponentą
        if (this.currentField === field) {
        this.hideActiveComponent();
        }
        
        // Atnaujinti visų to field komponentų status
        fieldComponents.forEach(componentType => {
            this.updateComponentStatus(field, componentType);
            this.setComponentCardActive(field, componentType, false);
        });
        
        // Atnaujinti field status
        this.updateFieldStatus(field);
        
        // Atnaujinti global preview
        this.updateGlobalPreview();
        this.updateState();
        
        console.log(`Field ${field} and all its components cleared by clicking field status`);
    }

    updateComponentStatus(field, componentType) {
        const statusEl = document.getElementById(`${field}-${componentType}-status`);
        if (!statusEl) return;
        
        const hasData = this.fieldData[field] && this.fieldData[field][componentType];
        
        if (hasData) {
            statusEl.textContent = '✓';
            statusEl.classList.add('has-data');
        } else {
            statusEl.textContent = '';
            statusEl.classList.remove('has-data');
        }
    }

    clearComponent(field, componentType) {
        const hasData = this.fieldData[field] && this.fieldData[field][componentType];
        if (!hasData) return;
        
        // Išvalyti komponento vidinę būseną - PRISITAIKOMASIS METODAS
        const component = this.sharedComponents[componentType];
        if (component) {
            if (this.currentField === field && this.currentComponent === componentType) {
                // Jei aktyvus - bandyti išvalyti
                this.clearActiveComponent(component, componentType);
            } else {
                // Jei neaktyvus - laikinai inicializuoti ir išvalyti
                const targetArea = document.getElementById(`${field}-active-component`);
                if (targetArea) {
                    targetArea.innerHTML = this.getComponentHTML(componentType);
                    targetArea.style.display = 'none';
                    
                    if (component.initialize(targetArea.id)) {
                        this.clearActiveComponent(component, componentType);
                        component.destroy && component.destroy();
                    }
                    
                    targetArea.innerHTML = '';
                }
            }
        }
        
        // Išvalyti fieldData
        if (this.fieldData[field]) {
            delete this.fieldData[field][componentType];
            if (Object.keys(this.fieldData[field]).length === 0) {
                this.fieldData[field] = {};
            }
        }
        
        // Atnaujinti UI
        this.updateComponentStatus(field, componentType);
        this.setComponentCardActive(field, componentType, false);
        this.updateFieldStatus(field);
        this.updateComponentAvailability(field); 
        this.updateGlobalPreview();
        this.updateState();
    }

    // PRIDĖTI naują helper metodą:
    clearActiveComponent(component, componentType) {
        // Bandyti skirtingus clear metodus priklausomai nuo komponento tipo
        if (componentType === 'calendar' || componentType === 'weekdays' || componentType === 'months' || componentType === 'intervals') {
            // Šie komponentai naudoja clearSelection()
            if (component.clearSelection && typeof component.clearSelection === 'function') {
                component.clearSelection();
                console.log(`${componentType} cleared using clearSelection()`);
            }
        } else if (componentType === 'intervals-iso') {
            // ISO intervals komponentas naudoja clearAllInputs()
            if (component.clearAllInputs && typeof component.clearAllInputs === 'function') {
                component.clearAllInputs();
                console.log('ISO intervals cleared using clearAllInputs()');
            }
        } else if (component.clear && typeof component.clear === 'function') {
            // Kiti komponentai naudoja clear()
            component.clear();
            console.log(`${componentType} cleared using clear()`);
        } else {
            console.warn(`No clear method found for ${componentType}`);
        }
    }

    updateGlobalPreview() {
        const outputEl = document.getElementById('commandOutput');
        if (!outputEl) return;
        
        const command = this.generateTaskWarriorCommand();
        
        if (command) {
            outputEl.innerHTML = `<code>${command}</code>`;
            outputEl.classList.add('has-command');
        } else {
            outputEl.innerHTML = '<span class="no-command">Nepasirinkti jokie datetime laukai</span>';
            outputEl.classList.remove('has-command');
        }
    }

    // Komandos generavimas
    generateFieldCommand(field, fieldData) {
        if (!fieldData || Object.keys(fieldData).length === 0) return '';
        
        let commandValue = '';
        
        // Check calendar component
        if (fieldData.calendar && fieldData.calendar.formatted) {
            commandValue = fieldData.calendar.formatted;
            // Add time if present
            if (fieldData.time && fieldData.time.formatted && fieldData.time.formatted !== '00:00') {
                commandValue += `T${fieldData.time.formatted}`;
            }
        }
        // Check weekdays component
        else if (fieldData.weekdays && fieldData.weekdays.formatted) {
            commandValue = fieldData.weekdays.formatted;
            
            // PRIDĖTI LAIKĄ jei weekday yra today/tomorrow
            const weekdayValue = fieldData.weekdays.weekday || fieldData.weekdays.weekdayKey;
            const isSpecialDay = weekdayValue === 'today' || weekdayValue === 'tomorrow';
            
            if (isSpecialDay && fieldData.time && fieldData.time.formatted && fieldData.time.formatted !== '00:00') {
                commandValue += `:${fieldData.time.formatted}`;
            }
        }
        // Check months component
        else if (fieldData.months && fieldData.months.formatted) {
            commandValue = fieldData.months.formatted;
        }
        // Check monthdays component
        else if (fieldData.monthdays && fieldData.monthdays.formatted) {
            commandValue = fieldData.monthdays.formatted;
        }
        // Check intervals component
        else if (fieldData.intervals && fieldData.intervals.formatted) {
            commandValue = fieldData.intervals.formatted;
        }
        // Check intervals-iso component
        else if (fieldData['intervals-iso'] && fieldData['intervals-iso'].formatted) {
            commandValue = fieldData['intervals-iso'].formatted;
        }
        // Check time component (standalone)
        else if (fieldData.time && fieldData.time.formatted && fieldData.time.formatted !== '00:00') {
            commandValue = fieldData.time.formatted;
        }
        
        if (!commandValue) return '';
        return `${field}:${commandValue}`;
    }

    generateTaskWarriorCommand() {
        const parts = [];
        Object.keys(this.fieldData).forEach(field => {
            const fieldData = this.fieldData[field];
            const command = this.generateFieldCommand(field, fieldData);
            if (command) parts.push(command);
        });
        return parts.join(' ');
    }

    // Helper metodai
    getFieldHelpText(field) {
        const helpTexts = window.SYSTEM_TEXTS?.HELP_TEXTS || {};
        return helpTexts[field.toUpperCase()] || `${field.toUpperCase()} laukas`;
    }

    getComponentIcon(component) {
        const icons = {
            calendar: '📅', time: '🕐', weekdays: '📄', monthdays: '📊',
            months: '📋', intervals: '🔄', 'intervals-iso': '⚡'
        };
        return icons[component] || '🔧';
    }

    getComponentName(component) {
        const names = {
            calendar: 'Calendar', time: 'Time', weekdays: 'Weekdays', monthdays: 'Month Days',
            months: 'Months', intervals: 'Intervals', 'intervals-iso': 'ISO Intervals'
        };
        return names[component] || component;
    }

    getTaskDescription() {
        if (window.descriptionCard && window.descriptionCard.getValue) {
            return window.descriptionCard.getValue() || 'My task';
        }
        return 'My task';
    }

    // Public API
    getValue() {
        this.saveCurrentComponentData();
        return this.fieldData;
    }

    clearForm() {
        this.hideActiveComponent();
        
        // Išvalyti shared komponentų vidinę būseną
        Object.keys(this.sharedComponents).forEach(componentType => {
            const component = this.sharedComponents[componentType];
            if (component) {
                // Kalendoriui - reset į šiandienos metus/mėnesį
                if (componentType === 'calendar' && component.currentView) {
                    const today = new Date();
                    component.currentView = {
                        year: today.getFullYear(),
                        month: today.getMonth()
                    };
                    component.selectedDate = null;
                }
                // Kitiems komponentams - clearSelection jei turi
                else if (component.clearSelection) {
                    component.clearSelection();
                }
            }
        });
        
        Object.keys(this.fieldData).forEach(field => {
            this.fieldData[field] = {};
        });
        
        Object.keys(this.fieldConfigs).forEach(field => {
            const content = document.getElementById(`${field}-accordion-content`);
            
            if (content) {
                content.classList.add('collapsed');
            }
            
            this.updateFieldStatus(field);
            this.updateComponentAvailability(field);
            this.fieldConfigs[field].forEach(componentType => {
                this.updateComponentStatus(field, componentType);
                this.setComponentCardActive(field, componentType, false);
            });
        });
        
        this.updateGlobalPreview();
        this.updateState();
        console.log('DateTime form cleared');
    }

    updateState() {
        if (this.app) {
            this.app.updateState('currentTask.datetime', this.fieldData);
        }
    }

    isValid() {
        return { isValid: true, errors: [] };
    }

    showDateTimeHelp() {
        if (window.showHelpModal && window.DATA && window.DATA.HELP && window.DATA.HELP.DATETIME_GENERAL) {
            window.showHelpModal('DATETIME_GENERAL');
        } else {
            alert('DateTime help: Pasirinkite lauką ir komponentą.');
        }
    }
}

// Global functions
window.toggleAccordion = function(field) {
    if (window.datetimeCard) {
        window.datetimeCard.toggleAccordion(field);
    }
};

window.showComponent = function(field, component) {
    if (window.datetimeCard) {
        window.datetimeCard.showComponent(field, component);
    }
};

// Registration
let datetimeCard;

document.addEventListener('DOMContentLoaded', () => {
    datetimeCard = new DateTimeCard();
    window.datetimeCard = datetimeCard;
    
    if (window.registerCard) {
        window.registerCard('datetime', datetimeCard);
    } else {
        setTimeout(() => {
            if (window.registerCard) {
                window.registerCard('datetime', datetimeCard);
            }
        }, 500);
    }
});