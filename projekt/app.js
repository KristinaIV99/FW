// projekt/app.js

// =============================================================================
// APLIKACIJOS KODAS
// =============================================================================

class TaskwarriorComposer {
    constructor() {
        this.tasks = [];
        this.projectsData = [];
        this.init();
    }

    init() {
        this.loadAllData();
        this.setupEventListeners();
        this.updateTaskCounter();
    }

    // Load all data from CONFIG
    loadAllData() {
        console.log('Loading data from CONFIG...');
        
        // Build projects hierarchy
        this.buildProjects(CONFIG.PROJECTS);

        // Build tags UI
        this.buildTagsUI(CONFIG.TAGS);

        // Populate selects
        this.populateSelect('priority', CONFIG.PRIORITY);
        this.populateSelect('recur', CONFIG.RECUR);

        console.log('Data loaded successfully!');
    }

    // Build hierarchical project structure
    buildProjects(projectList) {
        const projects = { primary: new Set(), secondary: {}, tertiary: {} };
        
        projectList.forEach(line => {
            const parts = line.split('.');
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
        this.populateProjectSelects();
    }

    // Populate project select dropdowns
    populateProjectSelects() {
        const primarySelect = document.getElementById('projectPrimary');
        
        // Clear and populate primary
        primarySelect.innerHTML = '<option value="">Pasirinkti...</option>';
        Array.from(this.projectsData.primary).sort().forEach(project => {
            const option = document.createElement('option');
            option.value = project;
            option.textContent = project;
            primarySelect.appendChild(option);
        });
    }

    // Handle project selection cascade
    handleProjectChange(level, value) {
        const secondarySelect = document.getElementById('projectSecondary');
        const tertiarySelect = document.getElementById('projectTertiary');

        if (level === 'primary') {
            // Reset and populate secondary
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
            // Reset and populate tertiary
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
    }

    // Populate select element with options
    populateSelect(elementId, options) {
        const select = document.getElementById(elementId);
        select.innerHTML = '<option value="">Pasirinkti...</option>';
        
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            select.appendChild(optionElement);
        });
    }

    // Build tags UI with category dropdowns
    buildTagsUI(tagCategories) {
        const container = document.getElementById('tagsContainer');
        container.innerHTML = '';

        // Create UI for each category
        Object.entries(tagCategories).forEach(([categoryName, tags]) => {
            // Create category group
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'tag-category';

            // Category header (clickable)
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'tag-category-header';
            
            const categoryTitle = document.createElement('span');
            categoryTitle.className = 'tag-category-title';
            categoryTitle.textContent = categoryName;
            
            const categoryArrow = document.createElement('span');
            categoryArrow.className = 'tag-category-arrow';
            categoryArrow.textContent = '▼';
            
            categoryHeader.appendChild(categoryTitle);
            categoryHeader.appendChild(categoryArrow);
            categoryDiv.appendChild(categoryHeader);

            // Category content (hidden by default)
            const categoryContent = document.createElement('div');
            categoryContent.className = 'tag-category-content';
            categoryContent.style.display = 'none';

            // Create tag chips for this category
            tags.forEach(tag => {
                const chip = document.createElement('div');
                chip.className = 'tag-chip';
                chip.textContent = tag;
                chip.dataset.tag = tag;
                chip.dataset.category = categoryName;
                chip.addEventListener('click', () => this.toggleTag(chip));
                categoryContent.appendChild(chip);
            });

            categoryDiv.appendChild(categoryContent);

            // Add click handler for expand/collapse
            categoryHeader.addEventListener('click', () => {
                const isOpen = categoryContent.style.display !== 'none';
                if (isOpen) {
                    categoryContent.style.display = 'none';
                    categoryArrow.textContent = '▼';
                } else {
                    categoryContent.style.display = 'flex';
                    categoryArrow.textContent = '▲';
                }
            });

            container.appendChild(categoryDiv);
        });
    }

    // Toggle tag selection
    toggleTag(chip) {
        chip.classList.toggle('selected');
    }

    // Format due date and time
    formatDue(date, hours, minutes) {
        if (!date) return '';
        
        if (hours !== '' || minutes !== '') {
            const h = String(hours || '00').padStart(2, '0');
            const m = String(minutes || '00').padStart(2, '0');
            return `${date}T${h}:${m}:00`;
        } else {
            return date;
        }
    }

    // Format estimate value to ISO 8601 duration
    formatEstimate() {
        const years = parseInt(document.getElementById('estimateYears').value) || 0;
        const months = parseInt(document.getElementById('estimateMonths').value) || 0;
        const days = parseInt(document.getElementById('estimateDays').value) || 0;
        const hours = parseInt(document.getElementById('estimateHours').value) || 0;
        const minutes = parseInt(document.getElementById('estimateMinutes').value) || 0;
        
        // If no values are set, return empty string
        if (years === 0 && months === 0 && days === 0 && hours === 0 && minutes === 0) {
            return '';
        }
        
        let duration = 'P';
        
        // Add date components
        if (years > 0) {
            duration += `${years}Y`;
        }
        if (months > 0) {
            duration += `${months}M`;
        }
        if (days > 0) {
            duration += `${days}D`;
        }
        
        // Add time components if any exist
        if (hours > 0 || minutes > 0) {
            duration += 'T';
            if (hours > 0) {
                duration += `${hours}H`;
            }
            if (minutes > 0) {
                duration += `${minutes}M`;
            }
        }
        
        return duration;
    }

    // Build TaskWarrior JSON object instead of CLI command
    buildTaskObject() {
        // Get form values
        const description = document.getElementById('description').value.trim();
        const isMilestone = document.getElementById('milestoneToggle').classList.contains('active');
        const annotations = document.getElementById('annotations').value.trim();
        
        // Build project path
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

        // Get selected tags
        const selectedTagsArray = Array.from(document.querySelectorAll('.tag-chip.selected'))
            .map(chip => chip.dataset.tag);

        // Get other fields
        const priority = document.getElementById('priority').value;
        const dueDate = document.getElementById('dueDate').value;
        const dueHours = document.getElementById('dueHours').value;
        const dueMinutes = document.getElementById('dueMinutes').value;
        const scheduled = document.getElementById('scheduled').value;
        const wait = document.getElementById('wait').value;
        const recur = document.getElementById('recur').value;
        const estimate = this.formatEstimate();

        // Build task object in TaskWarrior JSON format
        const task = {
            description: isMilestone ? `MILESTONE: ${description}` : description,
            status: "pending",
            entry: new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '') + 'Z'
        };

        // Add optional fields only if they have values
        if (projectPath) {
            task.project = projectPath;
        }

        if (annotations) {
            task.annotations = [
                {
                    description: annotations
                }
            ];
        }

        if (selectedTagsArray.length > 0) {
            task.tags = selectedTagsArray;
        }

        if (priority) {
            task.priority = priority;
        }

        // Format due date properly
        const dueFormatted = this.formatDue(dueDate, dueHours, dueMinutes);
        if (dueFormatted) {
            // Convert to TaskWarrior format 
            if (dueFormatted.includes('T')) {
                task.due = dueFormatted.replace(/[-:]/g, '').replace('T', 'T') + 'Z';
            } else {
                task.due = dueFormatted;
            }
        }

        if (scheduled) {
            task.scheduled = scheduled;
        }

        if (wait) {
            task.wait = wait;
        }

        if (recur) {
            task.recur = recur;
        }

        if (estimate) {
            task.estimate = estimate;
        }

        return task;
    }

    // Save task to memory
    saveTask() {
        const description = document.getElementById('description').value.trim();
        if (!description) {
            alert('DESCRIPTION laukas yra privalomas!');
            return;
        }

        const taskObject = this.buildTaskObject(); // Changed from buildTaskCommand()
        this.tasks.push(taskObject);
        
        // Clear form
        this.clearForm();
        
        // Update counter
        this.updateTaskCounter();
        
        // Show success feedback
        this.showFeedback('Užduotis išsaugota!', 'success');
    }

    // Export tasks to JSON file for TaskWarrior import
    exportTasks() {
        if (this.tasks.length === 0) {
            alert('Nėra išsaugotų užduočių eksportavimui!');
            return;
        }

        // Create JSON content
        const jsonContent = JSON.stringify(this.tasks, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `taskwarrior_import_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Clear tasks from memory
        this.tasks = [];
        this.updateTaskCounter();
        
        this.showFeedback(`JSON failas eksportuotas! Importuoti: task import ${a.download}`, 'success');
    }

    // Clear form
    clearForm() {
        const form = document.getElementById('taskForm');
        
        // Reset all inputs
        form.reset();
        
        // Reset milestone toggle
        document.getElementById('milestoneToggle').classList.remove('active');
        
        // Reset project selects
        document.getElementById('projectSecondary').disabled = true;
        document.getElementById('projectTertiary').disabled = true;
        document.getElementById('projectSecondary').innerHTML = '<option value="">Pasirinkti...</option>';
        document.getElementById('projectTertiary').innerHTML = '<option value="">Pasirinkti...</option>';
        
        // Reset tag chips and close all dropdowns
        document.querySelectorAll('.tag-chip.selected').forEach(chip => {
            chip.classList.remove('selected');
        });
        
        // Close all tag category dropdowns
        document.querySelectorAll('.tag-category-content').forEach(content => {
            content.style.display = 'none';
        });
        document.querySelectorAll('.tag-category-arrow').forEach(arrow => {
            arrow.textContent = '▼';
        });
    }

    // Update task counter
    updateTaskCounter() {
        document.getElementById('taskCount').textContent = this.tasks.length;
    }

    // Show feedback message
    showFeedback(message, type) {
        // Create temporary feedback element
        const feedback = document.createElement('div');
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 1001;
            animation: fadeInOut 3s ease;
        `;
        
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 3000);
    }

    // Show help modal using CONFIG data
    showHelp(helpKey) {
        try {
            const helpText = CONFIG.HELP[helpKey];
            if (!helpText) {
                alert('Pagalbos informacija nerasta.');
                return;
            }

            const modal = document.getElementById('helpModal');
            const contentDiv = document.getElementById('helpContent');
            
            // Convert \n to <br> for HTML display
            contentDiv.innerHTML = helpText.replace(/\n/g, '<br>');
            modal.style.display = 'block';
        } catch (error) {
            console.error('Error showing help:', error);
            alert('Nepavyko užkrauti pagalbos informacijos.');
        }
    }

    // Setup all event listeners
    setupEventListeners() {
        // Milestone toggle
        document.getElementById('milestoneToggle').addEventListener('click', (e) => {
            e.target.classList.toggle('active');
        });

        // Project cascading selects
        document.getElementById('projectPrimary').addEventListener('change', (e) => {
            this.handleProjectChange('primary', e.target.value);
        });

        document.getElementById('projectSecondary').addEventListener('change', (e) => {
            this.handleProjectChange('secondary', e.target.value);
        });

        // Save and Export buttons
        document.getElementById('saveBtn').addEventListener('click', () => this.saveTask());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportTasks());

        // Help buttons - map data-help to CONFIG.HELP keys
        document.querySelectorAll('.info-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const helpFile = e.target.dataset.help;
                // Convert filename to CONFIG key (remove .txt and _HELP suffix)
                const helpKey = helpFile.replace('_HELP.txt', '').replace('.txt', '');
                this.showHelp(helpKey);
            });
        });

        // Modal close
        document.querySelector('.modal-close').addEventListener('click', () => {
            document.getElementById('helpModal').style.display = 'none';
        });

        // Close modal on outside click
        document.getElementById('helpModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                e.target.style.display = 'none';
            }
        });

        // Form submission prevention
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TaskwarriorComposer();
});

// Add CSS animation for feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -20px); }
        15% { opacity: 1; transform: translate(-50%, 0); }
        85% { opacity: 1; transform: translate(-50%, 0); }
        100% { opacity: 0; transform: translate(-50%, -20px); }
    }
`;
document.head.appendChild(style);