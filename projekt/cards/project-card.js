// projekt/cards/project-card.js - SU PIN FUNKCIONALUMU

// =============================================================================
// PROJECT KORTELĖ - TRIJŲ LYGIŲ HIERARCHIJA SU PIN
// =============================================================================

class ProjectCard {
    constructor() {
        this.name = 'project';
        this.selectedProject = '';
        this.projectsData = {};
        this.element = null;
        this.app = null;
        this.isPinnedState = false;
    }

    init(app) {
        this.app = app;
        
        this.element = document.querySelector('[data-card="project"]');
        if (!this.element) {
            console.error('PROJECT: Nerastas project elementas');
            return;
        }

        this.buildProjectsHierarchy();
        this.generateUI();
        this.setupEvents();
        this.loadPinnedState();
    }

    buildProjectsHierarchy() {
        if (!window.DATA || !window.DATA.PROJECTS) {
            console.error('PROJECT: Nėra window.DATA.PROJECTS');
            return;
        }

        const projects = { primary: new Set(), secondary: {}, tertiary: {} };
        
        window.DATA.PROJECTS.forEach(projectPath => {
            const parts = projectPath.split('.');
            const primary = parts[0];
            projects.primary.add(primary);

            if (parts.length > 1) {
                const secondary = parts[1];
                if (!projects.secondary[primary]) {
                    projects.secondary[primary] = new Set();
                }
                projects.secondary[primary].add(secondary);

                if (parts.length > 2) {
                    const tertiary = parts[2];
                    const secondaryKey = `${primary}.${secondary}`;
                    if (!projects.tertiary[secondaryKey]) {
                        projects.tertiary[secondaryKey] = new Set();
                    }
                    projects.tertiary[secondaryKey].add(tertiary);
                }
            }
        });

        this.projectsData = projects;
        console.log('PROJECT: Hierarchija sukurta:', projects);
    }

    generateUI() {
        const container = this.element.querySelector('#projectCategories');
        
        if (!container) {
            console.error('PROJECT: Nerastas #projectCategories konteineris');
            return;
        }

        container.innerHTML = '';

        // Trijų lygių select'ai atskirose eilutėse
        
        // Primary select su savo konteineniu
        const primaryContainer = document.createElement('div');
        const primarySelect = document.createElement('select');
        primarySelect.id = 'projectPrimary';
        primarySelect.innerHTML = '<option value="">Pasirinkti...</option>';
        Array.from(this.projectsData.primary).sort().forEach(project => {
            const option = document.createElement('option');
            option.value = project;
            option.textContent = project;
            primarySelect.appendChild(option);
        });
        primaryContainer.appendChild(primarySelect);
        
        // Secondary select su savo konteineniu
        const secondaryContainer = document.createElement('div');
        const secondarySelect = document.createElement('select');
        secondarySelect.id = 'projectSecondary';
        secondarySelect.disabled = true;
        secondarySelect.innerHTML = '<option value="">Pasirinkti...</option>';
        secondaryContainer.appendChild(secondarySelect);
        
        // Tertiary select su savo konteineniu
        const tertiaryContainer = document.createElement('div');
        const tertiarySelect = document.createElement('select');
        tertiarySelect.id = 'projectTertiary';
        tertiarySelect.disabled = true;
        tertiarySelect.innerHTML = '<option value="">Pasirinkti...</option>';
        tertiaryContainer.appendChild(tertiarySelect);
        
        container.appendChild(primaryContainer);
        container.appendChild(secondaryContainer);
        container.appendChild(tertiaryContainer);
        
        // Pridėti pin mygtuką
        this.addPinButton();
    }

    handleProjectChange(level, value) {
        const secondarySelect = document.getElementById('projectSecondary');
        const tertiarySelect = document.getElementById('projectTertiary');

        if (level === 'primary') {
            // Reset ir užpildyti secondary
            secondarySelect.innerHTML = '<option value="">Pasirinkti...</option>';
            tertiarySelect.innerHTML = '<option value="">Pasirinkti...</option>';
            tertiarySelect.disabled = true;

            if (value && this.projectsData.secondary[value]) {
                secondarySelect.disabled = false;
                Array.from(this.projectsData.secondary[value]).sort().forEach(project => {
                    const option = document.createElement('option');
                    option.value = project;
                    option.textContent = project;
                    secondarySelect.appendChild(option);
                });
            } else {
                secondarySelect.disabled = true;
            }
        } else if (level === 'secondary') {
            // Reset ir užpildyti tertiary
            tertiarySelect.innerHTML = '<option value="">Pasirinkti...</option>';
            
            const primaryValue = document.getElementById('projectPrimary').value;
            const secondaryKey = `${primaryValue}.${value}`;
            
            if (value && this.projectsData.tertiary[secondaryKey]) {
                tertiarySelect.disabled = false;
                Array.from(this.projectsData.tertiary[secondaryKey]).sort().forEach(project => {
                    const option = document.createElement('option');
                    option.value = project;
                    option.textContent = project;
                    tertiarySelect.appendChild(option);
                });
            } else {
                tertiarySelect.disabled = true;
            }
        }

        // Atnaujinti pasirinkimą
        this.updateSelectedProject();
    }

    updateSelectedProject() {
        const primary = document.getElementById('projectPrimary').value;
        const secondary = document.getElementById('projectSecondary').value;
        const tertiary = document.getElementById('projectTertiary').value;
        
        let projectPath = '';
        if (primary) {
            projectPath = primary;
            if (secondary) {
                projectPath += '.' + secondary;
                if (tertiary) {
                    projectPath += '.' + tertiary;
                }
            }
        }

        this.selectedProject = projectPath;
        this.updateState();
        
        // Jei pinned - atnaujinti pinned value
        if (this.isPinnedState && window.StorageManager) {
            window.StorageManager.updatePinnedValue('project', this.selectedProject);
        }
    }

    updateState() {
        if (this.app) {
            this.app.updateState('currentTask.project', this.selectedProject);
        }
    }

    setupEvents() {
        // Event listener'iai select'ams
        document.getElementById('projectPrimary').addEventListener('change', (e) => {
            this.handleProjectChange('primary', e.target.value);
        });

        document.getElementById('projectSecondary').addEventListener('change', (e) => {
            this.handleProjectChange('secondary', e.target.value);
        });

        document.getElementById('projectTertiary').addEventListener('change', (e) => {
            this.updateSelectedProject();
        });
    }

    // =============================================================================
    // PIN FUNKCIONALUMAS
    // =============================================================================

    addPinButton() {
        const header = this.element.querySelector('.card-header');
        if (!header || header.querySelector('.pin-btn')) return;

        const pinBtn = document.createElement('button');
        pinBtn.className = 'pin-btn';
        pinBtn.textContent = '📌';
        pinBtn.title = 'Prisegti kortelę';
        
        // PAKEISTA: vietoj onclick naudojame addEventListener
        pinBtn.addEventListener('click', () => {
            console.log('PROJECT PIN: mygtukas paspaustas!');
            this.togglePin();
        });

        // TAISYMAS: įdėti PRIEŠ help mygtuką
        const helpBtn = header.querySelector('.help-btn');
        if (helpBtn) {
            header.insertBefore(pinBtn, helpBtn);
        } else {
            header.appendChild(pinBtn);
        }
    }

    togglePin() {
        this.isPinnedState = !this.isPinnedState;
        
        if (window.StorageManager) {
            const currentValue = this.isPinnedState ? this.getValue() : null;
            window.StorageManager.setPinned('project', this.isPinnedState, currentValue);
        }

        this.updatePinVisuals();
    }

    updatePinVisuals() {
        const header = this.element.querySelector('.card-header');
        const pinBtn = header.querySelector('.pin-btn');
        
        if (this.isPinnedState) {
            header.classList.add('pinned');
            pinBtn.classList.add('pinned');
        } else {
            header.classList.remove('pinned');
            pinBtn.classList.remove('pinned');
        }
    }

    loadPinnedState() {
        if (window.StorageManager) {
            this.isPinnedState = window.StorageManager.isPinned('project');
            
            if (this.isPinnedState) {
                const pinnedValue = window.StorageManager.getPinnedValue('project');
                if (pinnedValue) {
                    this.setProjectValue(pinnedValue);
                }
            }
            
            this.updatePinVisuals();
        }
    }

    setProjectValue(projectPath) {
        const parts = projectPath.split('.');
        const primarySelect = document.getElementById('projectPrimary');
        
        if (parts[0] && primarySelect) {
            primarySelect.value = parts[0];
            this.handleProjectChange('primary', parts[0]);
            
            if (parts[1]) {
                setTimeout(() => {
                    const secondarySelect = document.getElementById('projectSecondary');
                    if (secondarySelect) {
                        secondarySelect.value = parts[1];
                        this.handleProjectChange('secondary', parts[1]);
                        
                        if (parts[2]) {
                            setTimeout(() => {
                                const tertiarySelect = document.getElementById('projectTertiary');
                                if (tertiarySelect) {
                                    tertiarySelect.value = parts[2];
                                    this.updateSelectedProject();
                                }
                            }, 50);
                        }
                    }
                }, 50);
            }
        }
    }

    clearForm() {
        if (!this.isPinnedState) {
            document.getElementById('projectPrimary').value = '';
            document.getElementById('projectSecondary').value = '';
            document.getElementById('projectTertiary').value = '';
            document.getElementById('projectSecondary').disabled = true;
            document.getElementById('projectTertiary').disabled = true;
            this.selectedProject = '';
            this.updateState();
        }
    }

    // =============================================================================
    // PAGRINDINES FUNKCIJOS
    // =============================================================================

    getValue() {
        return this.selectedProject;
    }

    generateTaskWarriorCommand() {
        if (!this.selectedProject) return '';
        return `project:${this.selectedProject}`;
    }
}

// =============================================================================
// REGISTRACIJA
// =============================================================================

let projectCard;

document.addEventListener('DOMContentLoaded', () => {
    projectCard = new ProjectCard();
    
    if (window.registerCard) {
        window.registerCard('project', projectCard);
    } else {
        setTimeout(() => {
            if (window.registerCard) {
                window.registerCard('project', projectCard);
            }
        }, 500);
    }
});