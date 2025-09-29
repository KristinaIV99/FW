// projekt/cards/actions-card.js

// =============================================================================
// ACTIONS KORTELĖ - SU REAL-TIME PREVIEW
// =============================================================================

class ActionsCard {
    constructor() {
        this.name = 'actions';
        this.element = null;
        this.app = null;
        this.previewContainer = null;
        this.lastCommand = { html: '', plain: '', isValid: false }; // Cache komandų
    }

    init(app) {
        this.app = app;
        
        this.element = document.querySelector('[data-card="actions"]');
        if (!this.element) {
            console.error('ACTIONS: Nerastas actions elementas');
            return;
        }

        this.setupUI();
        this.setupEvents();
        this.setupStateListeners();
        this.updatePreview();
    }

    setupUI() {
        // Preview konteineris jau turi būti HTML'e
        this.previewContainer = this.element.querySelector('#commandPreview');
        if (!this.previewContainer) {
            console.error('ACTIONS: Nerastas #commandPreview konteineris');
        }
    }

    setupEvents() {
        const saveBtn = this.element.querySelector('#saveBtn');
        const exportBtn = this.element.querySelector('#exportBtn');

        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.handleSave());
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.handleExport());
        }
    }

    setupStateListeners() {
        // Klausytis kitų kortelių pakeitimų
        if (this.app && this.app.on) {
            this.app.on('stateChange', (data) => {
                // Atnaujinti preview kai keiĨiasi bet kuri kortelė
                this.updatePreview();
            });
        }

        // Backup - periodinės patestulės
        setInterval(() => {
            this.updatePreview();
        }, 1000);
    }

    updatePreview() {
        if (!this.previewContainer) return;

        const command = this.generatePreviewCommand();
        this.lastCommand = command; // Cache'iname
        
        // PAKEISTA: Atnaujinti preview su global-preview-section stilium
        this.previewContainer.innerHTML = `
            <div class="preview-title">TaskWarrior komanda:</div>
            <div class="command-output">
                <div class="command-preview-header">
                    <span class="command-label">Komanda:</span>
                    <button id="copyCommandBtn" class="copy-btn" title="Kopijuoti komandą">📋</button>
                </div>
                <div class="command-text">${command.html}</div>
            </div>
        `;

        // Perkabinti copy button event'ą
        const copyBtn = this.previewContainer.querySelector('#copyCommandBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.handleCopy());
        }

        // Pažymėti ar komanda galiojanti
        this.updateValidationStatus(command);
    }

    generatePreviewCommand() {
        // Gauti command mode duomenis
        const commandModeCard = this.app?.cards?.get('commandmode')?.instance;
        let baseCommand = 'task add ';
        let isModify = false;
        
        if (commandModeCard) {
            const commandMode = commandModeCard.getValue();
            if (commandMode.mode === 'modify') {
                isModify = true;
                if (commandMode.taskId) {
                    baseCommand = `task ${commandMode.taskId} modify `;
                } else {
                    baseCommand = 'task [ID] modify ';
                }
            }
        }

        let htmlCommand = baseCommand;
        let plainCommand = baseCommand;
        let hasValidContent = false;
        let hasAnyModifications = false; // NAUJAS FLAG MODIFY REŽIMUI

        // 1. Description - PRIVALOMAS TIK ADD MODE
        const descCard = this.app?.cards?.get('description')?.instance;
        if (descCard && typeof descCard.generateTaskWarriorCommand === 'function') {
            try {
                const descCmd = descCard.generateTaskWarriorCommand();
                if (descCmd && descCmd !== '""') {
                    // Turime description
                    plainCommand += descCmd;
                    const htmlDesc = this.convertLineBreaksToHtml(descCmd);
                    htmlCommand += htmlDesc;
                    hasValidContent = true;
                    hasAnyModifications = true; // MODIFY režime description skaičiuojasi kaip modifikacija
                } else {
                    // Nėra description
                    if (isModify) {
                        // MODIFY mode - description neprivalomas, tiesiog praleisti
                        hasValidContent = true; // Kol kas true, patikrįsime task ID vėliau
                    } else {
                        // ADD mode - description privalomas
                        const missingText = '"[DESCRIPTION REQUIRED]"';
                        plainCommand += missingText;
                        htmlCommand += '<span class="missing-field">' + missingText + '</span>';
                        hasValidContent = false;
                    }
                }
            } catch (error) {
                console.warn('Description card error:', error);
                if (!isModify) {
                    // Tik ADD mode reikalauja description
                    const missingText = '"[DESCRIPTION REQUIRED]"';
                    plainCommand += missingText;
                    htmlCommand += '<span class="missing-field">' + missingText + '</span>';
                    hasValidContent = false;
                } else {
                    hasValidContent = true; // MODIFY mode gali būti be description
                }
            }
        } else {
            // Nėra description card
            if (!isModify) {
                // ADD mode reikalauja description
                const missingText = '"[DESCRIPTION REQUIRED]"';
                plainCommand += missingText;
                htmlCommand += '<span class="missing-field">' + missingText + '</span>';
                hasValidContent = false;
            } else {
                hasValidContent = true; // MODIFY mode gali būti be description
            }
        }

        // 2. Project - toje pačioje eilutėje po description
        const projectCard = this.app?.cards?.get('project')?.instance;
        if (projectCard && typeof projectCard.generateTaskWarriorCommand === 'function') {
            try {
                const projectCmd = projectCard.generateTaskWarriorCommand();
                if (projectCmd) {
                    plainCommand += ` ${projectCmd}`;
                    htmlCommand += ` <span class="field-project">${projectCmd}</span>`;
                    hasAnyModifications = true; // MODIFY režime project skaičiuojasi
                }
            } catch (error) {
                console.warn('Project card error:', error);
            }
        }

        // 3. Tags - toje pačioje eilutėje
        const tagsCard = this.app?.cards?.get('tags')?.instance;
        if (tagsCard && typeof tagsCard.generateTaskWarriorCommand === 'function') {
            try {
                const tagsCmd = tagsCard.generateTaskWarriorCommand();
                if (tagsCmd) {
                    plainCommand += ` ${tagsCmd}`;
                    htmlCommand += ` <span class="field-tags">${tagsCmd}</span>`;
                    hasAnyModifications = true; // MODIFY režime tags skaičiuojasi
                }
            } catch (error) {
                console.warn('Tags card error:', error);
            }
        }

        // 4. Priority - toje pačioje eilutėje
        const priorityCard = this.app?.cards?.get('priority')?.instance;
        if (priorityCard && typeof priorityCard.generateTaskWarriorCommand === 'function') {
            try {
                const priorityCmd = priorityCard.generateTaskWarriorCommand();
                if (priorityCmd) {
                    plainCommand += ` ${priorityCmd}`;
                    htmlCommand += ` <span class="field-priority">${priorityCmd}</span>`;
                    hasAnyModifications = true; // MODIFY režime priority skaičiuojasi
                }
            } catch (error) {
                console.warn('Priority card error:', error);
            }
        }

        // 5. DateTime laukai
        const datetimeCard = this.app?.cards?.get('datetime')?.instance;
        if (datetimeCard && typeof datetimeCard.generateTaskWarriorCommand === 'function') {
            try {
                const datetimeCmd = datetimeCard.generateTaskWarriorCommand();
                if (datetimeCmd) {
                    plainCommand += ` ${datetimeCmd}`;
                    htmlCommand += ` <span class="field-datetime">${datetimeCmd}</span>`;
                    hasAnyModifications = true; // MODIFY režime datetime skaičiuojasi
                }
            } catch (error) {
                console.warn('DateTime card error:', error);
            }
        }

        // 6. Estimate - toje pačioje eilutėje
        const estimateCard = this.app?.cards?.get('estimate')?.instance;
        if (estimateCard && typeof estimateCard.generateTaskWarriorCommand === 'function') {
            try {
                const estimateCmd = estimateCard.generateTaskWarriorCommand();
                if (estimateCmd) {
                    plainCommand += ` ${estimateCmd}`;
                    htmlCommand += ` <span class="field-estimate">${estimateCmd}</span>`;
                    hasAnyModifications = true; // MODIFY režime estimate skaičiuojasi
                }
            } catch (error) {
                console.warn('Estimate card error:', error);
            }
        }

        // MODIFY mode final validation: turi turėti task ID ir bent vieną modifikuojamą lauką
        if (isModify) {
            const hasTaskId = commandModeCard && commandModeCard.getValue().taskId;
            
            // PATAISYTA LOGIKA: naudojame hasAnyModifications flag'ą vietoj plainCommand.length
            hasValidContent = hasTaskId && hasAnyModifications;
            
            // Specifiniai error case'ai
            if (!hasTaskId) {
                // Nėra task ID
                plainCommand = plainCommand.replace('task [ID] modify', 'task [ID_REQUIRED] modify');
                htmlCommand = htmlCommand.replace('task [ID] modify', '<span class="missing-field">task [ID_REQUIRED] modify</span>');
                hasValidContent = false;
            } else if (!hasAnyModifications) {
                // Yra task ID, bet nėra modifikacijų
                const noModsText = ' [NO_MODIFICATIONS]';
                plainCommand += noModsText;
                htmlCommand += '<span class="missing-field">' + noModsText + '</span>';
                hasValidContent = false;
            }
        }

        return {
            html: htmlCommand.trim(),
            plain: plainCommand.trim(),
            isValid: hasValidContent
        };
    }

    // Konvertuoti \n į <br> HTML preview'ui, bet išlaikyti kabutes
    convertLineBreaksToHtml(text) {
        if (!text) return text;
        
        // Tikrinti ar tekstas prasideda ir baigiasi kabutėmis
        if (text.startsWith('"') && text.endsWith('"')) {
            // Išimti kabutes, konvertuoti line breaks, grąžinti su kabutėmis
            const content = text.slice(1, -1); // Pašalinti kabutes
            const htmlContent = content.replace(/\n/g, '<br>');
            return `"${htmlContent}"`;
        }
        
        // Jei ne kabutėse, tiesiog konvertuoti
        return text.replace(/\n/g, '<br>');
    }

    updateValidationStatus(commandObj) {
        if (!this.previewContainer) return;

        // Ieškoti global-preview-section vietoj command-preview-container
        const container = this.previewContainer.closest('.global-preview-section');
        if (!container) return;

        // Pašalinti senas klases
        container.classList.remove('valid', 'invalid', 'empty');

        // Patikrinti ar yra bet kokių klaidų žymeklių
        const hasErrors = commandObj.plain && (
            commandObj.plain.includes('[DESCRIPTION REQUIRED]') ||
            commandObj.plain.includes('[ID_REQUIRED]') ||
            commandObj.plain.includes('[NO_MODIFICATIONS]')
        );

        if (!commandObj.plain || hasErrors) {
            container.classList.add('invalid');
        } else if (commandObj.isValid) {
            container.classList.add('valid');
        } else {
            container.classList.add('empty');
        }
    }

    handleSave() {
        if (this.app && this.app.saveTask) {
            this.app.saveTask();
        }
    }

    handleExport() {
        if (this.app && this.app.exportTasks) {
            this.app.exportTasks();
        }
    }

    handleCopy() {
        const cleanCommand = this.lastCommand.plain;
        
        if (!cleanCommand || cleanCommand === 'task add' || cleanCommand.includes('[DESCRIPTION REQUIRED]')) {
            this.showFeedback('Nėra ko kopijuoti!', 'warning');
            return;
        }

        // Kopijuoti į clipboard
        navigator.clipboard.writeText(cleanCommand).then(() => {
            this.showFeedback('Komanda nukopijuota!', 'success');
        }).catch(() => {
            // Fallback metodas
            const textArea = document.createElement('textarea');
            textArea.value = cleanCommand;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showFeedback('Komanda nukopijuota!', 'success');
        });
    }

    showFeedback(message, type) {
        if (this.app && this.app.showFeedback) {
            this.app.showFeedback(message, type);
        }
    }

    getValue() {
        return this.lastCommand;
    }

    generateTaskWarriorCommand() {
        return this.lastCommand.plain || '';
    }
}

// =============================================================================
// REGISTRACIJA
// =============================================================================

let actionsCard;

document.addEventListener('DOMContentLoaded', () => {
    actionsCard = new ActionsCard();
    
    if (window.registerCard) {
        window.registerCard('actions', actionsCard);
    } else {
        setTimeout(() => {
            if (window.registerCard) {
                window.registerCard('actions', actionsCard);
            }
        }, 500);
    }
});