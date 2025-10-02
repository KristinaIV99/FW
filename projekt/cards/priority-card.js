// projekt/cards/priority-card.js

// =============================================================================
// PRIORITY KORTELĖ - SKAITO DUOMENIS IŠ DATA.JS
// =============================================================================

class PriorityCard {
    constructor() {
        this.name = 'priority';
        this.selectedPriority = '';
        this.element = null;
        this.app = null;
        this.priorityData = [];
    }

    init(app) {
        this.app = app;
        
        this.element = document.querySelector('[data-card="priority"]');
        if (!this.element) {
            console.error('PRIORITY: Nerastas priority elementas');
            return;
        }

        this.loadPriorityData();
        this.generateUI();
        this.setupEvents();
    }

    loadPriorityData() {
        if (!window.DATA || !window.DATA.PRIORITY) {
            console.error('PRIORITY: Nerasti priority duomenys DATA.PRIORITY');
            return;
        }

        this.priorityData = window.DATA.PRIORITY;
        console.log('PRIORITY: Duomenys užkrauti:', this.priorityData);
    }

    generateUI() {
        const container = this.element.querySelector('#priorityButtons');
        
        if (!container || this.priorityData.length === 0) {
            console.error('PRIORITY: Container nerastas arba nėra duomenų');
            return;
        }

        container.innerHTML = '';

        // Sukurti priority mygtukus iš duomenų
        this.priorityData.forEach(priorityItem => {
            const btn = document.createElement('button');
            btn.className = 'priority-btn';
            btn.textContent = priorityItem.label; // Rodyti label vietoj key
            btn.dataset.priority = priorityItem.key; // Saugoti key data-atribute
            btn.title = priorityItem.description; // Tooltip su aprašymu
            btn.onclick = () => this.selectPriority(priorityItem.key, btn);
            container.appendChild(btn);
        });
    }

    selectPriority(priority, button) {
        // Išvalyti ankstesnius pasirinkimus
        this.element.querySelectorAll('.priority-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Jei paspaudžiame tą patį - atzymime
        if (this.selectedPriority === priority) {
            this.selectedPriority = '';
        } else {
            this.selectedPriority = priority;
            button.classList.add('selected');
        }
        
        this.updateState();
    }

    updateState() {
        if (this.app) {
            this.app.updateState('currentTask.priority', this.selectedPriority);
        }
    }

    setupEvents() {
        // Paprastas setup - pagrindinė logika jau onclick
    }

    // =============================================================================
    // CLEAR FORM METODAS
    // =============================================================================
    
    clearForm() {
        // Atžymėti visus priority mygtukus
        this.element.querySelectorAll('.priority-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Reset internal state
        this.selectedPriority = '';
        
        // Update app state
        this.updateState();
    }

    // =============================================================================
    // PAGRINDINES FUNKCIJOS
    // =============================================================================

    getValue() {
        return this.selectedPriority;
    }

    generateTaskWarriorCommand() {
        if (!this.selectedPriority) return '';
        return `priority:${this.selectedPriority}`;
    }

    // Utility metodas - gauti priority objektą pagal key
    getPriorityByKey(key) {
        return this.priorityData.find(item => item.key === key);
    }

    // Utility metodas - gauti priority label pagal key
    getPriorityLabel(key) {
        const priority = this.getPriorityByKey(key);
        return priority ? priority.label : key;
    }

    // Utility metodas - gauti priority aprašymą pagal key
    getPriorityDescription(key) {
        const priority = this.getPriorityByKey(key);
        return priority ? priority.description : '';
    }
}

// =============================================================================
// REGISTRACIJA
// =============================================================================

let priorityCard;

document.addEventListener('DOMContentLoaded', () => {
    priorityCard = new PriorityCard();
    
    if (window.registerCard) {
        window.registerCard('priority', priorityCard);
    } else {
        setTimeout(() => {
            if (window.registerCard) {
                window.registerCard('priority', priorityCard);
            }
        }, 500);
    }
});