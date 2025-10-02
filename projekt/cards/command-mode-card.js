// projekt/cards/command-mode-card.js

// =============================================================================
// COMMAND MODE KORTELĖ - ADD / MODIFY TOGGLE
// =============================================================================

class CommandModeCard {
    constructor() {
        this.name = 'commandmode';
        this.element = null;
        this.app = null;
        this.currentMode = 'add'; // 'add' arba 'modify'
        this.taskId = '';
    }

    init(app) {
        this.app = app;
        
        this.element = document.querySelector('[data-card="commandmode"]');
        if (!this.element) {
            console.error('COMMAND MODE: Nerastas command mode elementas');
            return;
        }

        this.generateUI();
        this.setupEvents();
        this.updateState();
    }

    generateUI() {
        const container = this.element.querySelector('#commandModeContainer');
        
        if (!container) {
            console.error('COMMAND MODE: Nerastas #commandModeContainer');
            return;
        }

        container.innerHTML = `
            <!-- Mode Toggle -->
            <div class="command-mode-toggle">
                <button class="seg-action mode-btn active" data-mode="add">ADD Task</button>
                <button class="seg-action mode-btn" data-mode="modify">MODIFY Task</button>
            </div>

            <!-- Task ID Section (hidden by default) -->
            <div class="task-id-section hidden" id="taskIdSection">
                <input 
                    type="text" 
                    id="taskIdInput" 
                    class="task-id-input input-base" 
                    placeholder="Įveskite task ID numerį..."
                >
            </div>
        `;
    }

    setupEvents() {
        // Mode toggle mygtukai
        const modeButtons = this.element.querySelectorAll('.mode-btn');
        modeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.setMode(mode);
            });
        });

        // Task ID input
        const taskIdInput = this.element.querySelector('#taskIdInput');
        if (taskIdInput) {
            taskIdInput.addEventListener('input', (e) => {
                this.taskId = e.target.value.trim();
                this.updateState();
            });

            // Enter klavišo paspaudimas
            taskIdInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    taskIdInput.blur();
                }
            });
        }
    }

    setMode(mode) {
        if (mode !== 'add' && mode !== 'modify') {
            console.warn('COMMAND MODE: Neteisingas mode:', mode);
            return;
        }

        this.currentMode = mode;

        // Atnaujinti mygtuką
        const modeButtons = this.element.querySelectorAll('.mode-btn');
        modeButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.mode === mode) {
                button.classList.add('active');
            }
        });

        // Rodyti/slėpti Task ID sekciją
        const taskIdSection = this.element.querySelector('#taskIdSection');
        const taskIdInput = this.element.querySelector('#taskIdInput');
        
        if (taskIdSection) {
            if (mode === 'modify') {
                taskIdSection.classList.remove('hidden');
                taskIdSection.classList.add('visible');
                // Focus į input jei modify mode
                if (taskIdInput) {
                    setTimeout(() => taskIdInput.focus(), 100);
                }
            } else {
                taskIdSection.classList.add('hidden');
                taskIdSection.classList.remove('visible');
                // Išvalyti task ID kai perjungiame į ADD
                this.taskId = '';
                if (taskIdInput) {
                    taskIdInput.value = '';
                }
            }
        }

        this.updateState();
    }

    updateState() {
        if (this.app) {
            this.app.updateState('commandMode', {
                mode: this.currentMode,
                taskId: this.taskId
            });
        }
    }

    // Public metodai kitoms kortelėms
    getMode() {
        return this.currentMode;
    }

    getTaskId() {
        return this.taskId;
    }

    getValue() {
        return {
            mode: this.currentMode,
            taskId: this.taskId
        };
    }

    generateTaskWarriorCommand() {
        if (this.currentMode === 'modify') {
            if (this.taskId) {
                return `task ${this.taskId} modify`;
            } else {
                return 'task [ID] modify'; // Placeholder
            }
        } else {
            return 'task add';
        }
    }

    // Validation
    isValid() {
        if (this.currentMode === 'modify') {
            return this.taskId.length > 0;
        }
        return true; // ADD mode visada valid
    }

    // =============================================================================
    // CLEAR METODAI - PRIDĖTAS clearForm() METODAS
    // =============================================================================

    // Clear metodas - originalus
    clear() {
        this.setMode('add');
        this.taskId = '';
        const taskIdInput = this.element.querySelector('#taskIdInput');
        if (taskIdInput) {
            taskIdInput.value = '';
        }
        this.updateState();
    }

    // clearForm metodas - NAUJAS! Tai ko ieškojo app.js smartClear()
    clearForm() {
        // Tikrinti ar turi pin funkcionalumą (jei ateityje reikės)
        // Kol kas command mode neturi pin, tai visada valome
        
        console.log('COMMAND MODE: clearForm() - grąžiname į ADD režimą ir valome ID');
        
        this.setMode('add');
        this.taskId = '';
        const taskIdInput = this.element.querySelector('#taskIdInput');
        if (taskIdInput) {
            taskIdInput.value = '';
        }
        this.updateState();
    }

    // Set values programmatically
    setValues(data) {
        if (!data) return;

        if (data.mode) {
            this.setMode(data.mode);
        }

        if (data.taskId !== undefined) {
            this.taskId = data.taskId;
            const taskIdInput = this.element.querySelector('#taskIdInput');
            if (taskIdInput) {
                taskIdInput.value = data.taskId;
            }
        }

        this.updateState();
    }
}

// =============================================================================
// REGISTRACIJA
// =============================================================================

let commandModeCard;

document.addEventListener('DOMContentLoaded', () => {
    commandModeCard = new CommandModeCard();
    
    if (window.registerCard) {
        window.registerCard('commandmode', commandModeCard);
    } else {
        setTimeout(() => {
            if (window.registerCard) {
                window.registerCard('commandmode', commandModeCard);
            }
        }, 500);
    }
});