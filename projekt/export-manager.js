// projekt/export-manager.js
// PATAISYTA VERSIJA su FALLBACK parsing iš _command

class ExportManager {
    constructor() {
        this.app = null;
    }

    init(app) {
        this.app = app;
        console.log('✅ ExportManager initialized');
    }

    exportTasks() {
        if (!window.StorageManager) {
            this.showFeedback('StorageManager neprieinamas!', 'error');
            return;
        }
        
        const savedTasks = window.StorageManager.getSavedTasks();
        
        if (!savedTasks || savedTasks.length === 0) {
            this.showFeedback('Nėra išsaugotų užduočių eksportavimui!', 'error');
            return;
        }
        
        const exportData = savedTasks.map(task => this.convertTaskWithMetadata(task));
        
        const jsonContent = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        
        const timestamp = new Date().toISOString().split('T')[0];
        a.download = `taskwarrior_${timestamp}.json`;
        
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 200);
        
        this.showFeedback(`${savedTasks.length} užduočių eksportuota!`, 'success');
    }

    convertTaskWithMetadata(savedTask) {
        const taskData = savedTask.taskData;
        const isModify = savedTask.taskCommand && savedTask.taskCommand.includes(' modify ');
        
        const exportTask = {
            _mode: isModify ? 'modify' : 'add',
            _command: savedTask.taskCommand,
            _timestamp: savedTask.timestamp
        };
        
        // FALLBACK: Parse iš _command, jei duomenų taskData nėra
        const parsedFromCommand = this.parseCommandFields(savedTask.taskCommand);
        
        // Jei MODIFY - ištraukti task ID
        if (isModify) {
            const match = savedTask.taskCommand.match(/task (\d+) modify/);
            if (match) {
                exportTask._task_id = match[1];
            }
        }
        
        // Description
        exportTask.description = taskData.isMilestone 
            ? `MILESTONE: ${taskData.description}` 
            : taskData.description;
        exportTask.status = "pending";
        exportTask.entry = this.formatTimestamp(savedTask.timestamp);
        
        // Project - iš taskData arba parsed
        if (taskData.project) {
            exportTask.project = taskData.project;
        } else if (parsedFromCommand.project) {
            exportTask.project = parsedFromCommand.project;
        }
        
        // Tags - iš taskData arba parsed
        if (taskData.tags && taskData.tags.length > 0) {
            exportTask.tags = taskData.tags;
        } else if (parsedFromCommand.tags && parsedFromCommand.tags.length > 0) {
            exportTask.tags = parsedFromCommand.tags;
        }
        
        // Priority - iš taskData arba parsed
        if (taskData.priority) {
            exportTask.priority = taskData.priority;
        } else if (parsedFromCommand.priority) {
            exportTask.priority = parsedFromCommand.priority;
        }
        
        // DateTime fields - iš taskData arba parsed
        if (taskData.datetime) {
            // DUE
            if (taskData.datetime.due) {
                const dueValue = this.extractFieldValue(taskData.datetime.due);
                if (dueValue) exportTask.due = dueValue;
            } else if (parsedFromCommand.due) {
                exportTask.due = parsedFromCommand.due;
            }
            
            // WAIT
            if (taskData.datetime.wait) {
                const waitValue = this.extractFieldValue(taskData.datetime.wait);
                if (waitValue) exportTask.wait = waitValue;
            } else if (parsedFromCommand.wait) {
                exportTask.wait = parsedFromCommand.wait;
            }
            
            // SCHEDULED
            if (taskData.datetime.scheduled) {
                const schedValue = this.extractFieldValue(taskData.datetime.scheduled);
                if (schedValue) exportTask.scheduled = schedValue;
            } else if (parsedFromCommand.scheduled) {
                exportTask.scheduled = parsedFromCommand.scheduled;
            }
            
            // RECUR
            if (taskData.datetime.recur) {
                const recurValue = this.extractFieldValue(taskData.datetime.recur);
                if (recurValue) exportTask.recur = recurValue;
            } else if (parsedFromCommand.recur) {
                exportTask.recur = parsedFromCommand.recur;
            }
            
            // UNTIL
            if (taskData.datetime.until) {
                const untilValue = this.extractFieldValue(taskData.datetime.until);
                if (untilValue) exportTask.until = untilValue;
            } else if (parsedFromCommand.until) {
                exportTask.until = parsedFromCommand.until;
            }
        } else {
            // Visiškai nėra datetime - naudoti parsed
            if (parsedFromCommand.due) exportTask.due = parsedFromCommand.due;
            if (parsedFromCommand.wait) exportTask.wait = parsedFromCommand.wait;
            if (parsedFromCommand.scheduled) exportTask.scheduled = parsedFromCommand.scheduled;
            if (parsedFromCommand.recur) exportTask.recur = parsedFromCommand.recur;
            if (parsedFromCommand.until) exportTask.until = parsedFromCommand.until;
        }
        
        // Estimate - iš taskData arba parsed
        if (taskData.estimate && taskData.estimate.iso8601) {
            exportTask.estimate = taskData.estimate.iso8601;
        } else if (parsedFromCommand.estimate) {
            exportTask.estimate = parsedFromCommand.estimate;
        }
        
        return exportTask;
    }

    // NAUJA: Parse laukus iš _command string
    parseCommandFields(command) {
        const fields = {};
        
        if (!command) return fields;
        
        // Project: project:XXX
        const projectMatch = command.match(/project:([^\s]+)/);
        if (projectMatch) fields.project = projectMatch[1];
        
        // Priority: priority:X
        const priorityMatch = command.match(/priority:([HML])/);
        if (priorityMatch) fields.priority = priorityMatch[1];
        
        // Due: due:XXX
        const dueMatch = command.match(/due:([^\s]+)/);
        if (dueMatch) fields.due = dueMatch[1];
        
        // Wait: wait:XXX
        const waitMatch = command.match(/wait:([^\s]+)/);
        if (waitMatch) fields.wait = waitMatch[1];
        
        // Scheduled: scheduled:XXX
        const schedMatch = command.match(/scheduled:([^\s]+)/);
        if (schedMatch) fields.scheduled = schedMatch[1];
        
        // Recur: recur:XXX
        const recurMatch = command.match(/recur:([^\s]+)/);
        if (recurMatch) fields.recur = recurMatch[1];
        
        // Until: until:XXX
        const untilMatch = command.match(/until:([^\s]+)/);
        if (untilMatch) fields.until = untilMatch[1];
        
        // Estimate: estimate:XXX
        const estimateMatch = command.match(/estimate:([^\s]+)/);
        if (estimateMatch) fields.estimate = estimateMatch[1];
        
        // Tags: +XXX
        const tagMatches = command.match(/\+([^\s]+)/g);
        if (tagMatches) {
            fields.tags = tagMatches.map(tag => tag.substring(1));
        }
        
        return fields;
    }

    extractFieldValue(fieldData) {
        if (!fieldData) return null;
        
        // 1. Calendar + time
        if (fieldData.calendar && fieldData.calendar.formatted) {
            let dateValue = fieldData.calendar.formatted; // YYYY-MM-DD
            
            if (fieldData.time && fieldData.time.formatted && fieldData.time.formatted !== '00:00') {
                // PAKEISTA: Ne UTC, o local time
                return `${dateValue}T${fieldData.time.formatted}:00`; // 2025-09-30T03:25:00
            }
            
            return dateValue;
        }
        
        // 2. Weekdays
        if (fieldData.weekdays && fieldData.weekdays.formatted) {
            const weekdayValue = fieldData.weekdays.formatted;
            
            if ((weekdayValue === 'today' || weekdayValue === 'tomorrow') && 
                fieldData.time && fieldData.time.formatted && fieldData.time.formatted !== '00:00') {
                return `${weekdayValue}:${fieldData.time.formatted}`;
            }
            
            return weekdayValue;
        }
        
        // 3. Monthdays
        if (fieldData.monthdays && fieldData.monthdays.formatted) {
            return fieldData.monthdays.formatted;
        }
        
        // 4. Months
        if (fieldData.months && fieldData.months.formatted) {
            return fieldData.months.formatted;
        }
        
        // 5. Intervals
        if (fieldData.intervals && fieldData.intervals.formatted) {
            return fieldData.intervals.formatted;
        }
        
        // 6. ISO intervals
        if (fieldData['intervals-iso'] && fieldData['intervals-iso'].formatted) {
            return fieldData['intervals-iso'].formatted;
        }
        
        // 7. Time standalone
        if (fieldData.time && fieldData.time.formatted && fieldData.time.formatted !== '00:00') {
            return fieldData.time.formatted;
        }
        
        return null;
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        
        return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    }

    showFeedback(message, type) {
        if (this.app && this.app.showFeedback) {
            this.app.showFeedback(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Global export
window.ExportManager = new ExportManager();

// Register with app
document.addEventListener('DOMContentLoaded', () => {
    const checkApp = setInterval(() => {
        if (window.TaskWarriorApp) {
            window.ExportManager.init(window.TaskWarriorApp);
            clearInterval(checkApp);
        }
    }, 100);
});
