// projekt/datetime/datetime-validation.js

// =============================================================================
// DATETIME VALIDATION LOGIKA
// =============================================================================

class DateTimeValidation {
    
    // Pagrindinė RECUR + DUE taisyklė
    static validateRecurDue(dateTimeValues) {
        const errors = [];
        
        const hasRecur = dateTimeValues.recur && dateTimeValues.recur !== '';
        const hasDue = dateTimeValues.due && dateTimeValues.due !== '';
        
        // TaskWarrior taisyklė: RECUR reikalauja DUE datos
        if (hasRecur && !hasDue) {
            errors.push('RECUR funkcionalumui reikalinga DUE data! (TaskWarrior reikalavimas)');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    // Datos formato validation
    static validateDateFormat(dateString) {
        const errors = [];
        
        if (!dateString || dateString === '') {
            return { isValid: true, errors: [] }; // Tuščios datos leistinos
        }
        
        // Tikrinti ISO formato: YYYY-MM-DD arba YYYY-MM-DDTHH:mm:ss
        const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
        
        if (!isoDateRegex.test(dateString) && !isoDateTimeRegex.test(dateString)) {
            errors.push('Neteisingas datos formatas. Naudokite: YYYY-MM-DD arba YYYY-MM-DDTHH:mm:ss');
        }
        
        // Tikrinti ar data galiojanti
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            errors.push('Negaliojanti data');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    // RECUR reikšmių validation
    static validateRecurValue(recurValue) {
        const errors = [];
        
        if (!recurValue || recurValue === '') {
            return { isValid: true, errors: [] };
        }
        
        // Leistinos RECUR reikšmės iš data.js
        const validRecurValues = window.DATA?.RECUR || [
            'daily', '2days', '3days', 'weekly', 'biweekly', 'monthly', 'quarterly',
            'semiannual', 'yearly', 'weekdays', 'weekends', 'monday', 'tuesday',
            'wednesday', 'thursday', 'friday', 'saturday', 'sunday', '1st', '2nd',
            '3rd', 'last', 'eom', 'eoy'
        ];
        
        if (!validRecurValues.includes(recurValue)) {
            errors.push(`Neleistina RECUR reikšmė: ${recurValue}`);
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    // Visų datetime laukų validation
    static validateAllDateTimeFields(dateTimeValues) {
        const allErrors = [];
        
        // 1. RECUR + DUE taisyklė
        const recurDueValidation = this.validateRecurDue(dateTimeValues);
        if (!recurDueValidation.isValid) {
            allErrors.push(...recurDueValidation.errors);
        }
        
        // 2. Datų formatų tikrinimas
        const dateFields = ['due', 'wait', 'scheduled'];
        dateFields.forEach(field => {
            if (dateTimeValues[field]) {
                const dateValidation = this.validateDateFormat(dateTimeValues[field]);
                if (!dateValidation.isValid) {
                    allErrors.push(...dateValidation.errors.map(error => `${field.toUpperCase()}: ${error}`));
                }
            }
        });
        
        // 3. RECUR reikšmės tikrinimas
        if (dateTimeValues.recur) {
            const recurValidation = this.validateRecurValue(dateTimeValues.recur);
            if (!recurValidation.isValid) {
                allErrors.push(...recurValidation.errors);
            }
        }
        
        // 4. Loginiai tikrinimai
        const logicalValidation = this.validateDateTimeLogic(dateTimeValues);
        if (!logicalValidation.isValid) {
            allErrors.push(...logicalValidation.errors);
        }
        
        return {
            isValid: allErrors.length === 0,
            errors: allErrors
        };
    }
    
    // Loginiai datetime tikrinimo (pvz., WAIT turi būti prieš DUE)
    static validateDateTimeLogic(dateTimeValues) {
        const errors = [];
        
        const due = dateTimeValues.due ? new Date(dateTimeValues.due) : null;
        const wait = dateTimeValues.wait ? new Date(dateTimeValues.wait) : null;
        const scheduled = dateTimeValues.scheduled ? new Date(dateTimeValues.scheduled) : null;
        
        // WAIT turėtų būti prieš DUE
        if (wait && due && wait > due) {
            errors.push('WAIT data turėtų būti anksčiau nei DUE data');
        }
        
        // SCHEDULED turėtų būti prieš DUE
        if (scheduled && due && scheduled > due) {
            errors.push('SCHEDULED data turėtų būti anksčiau nei DUE data');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    // Helper funkcija - gauti visas klaidas kaip string
    static getValidationSummary(dateTimeValues) {
        const validation = this.validateAllDateTimeFields(dateTimeValues);
        
        if (validation.isValid) {
            return 'Visi datetime laukai galiojantys ✓';
        }
        
        return 'DateTime klaidos:\n' + validation.errors.map(error => `• ${error}`).join('\n');
    }
}

// =============================================================================
// GLOBALUS EKSPORTAVIMAS
// =============================================================================

// Padaryti prieinamą globaliai
window.DateTimeValidation = DateTimeValidation;

console.log('📅 DateTime Validation módųlis užkrautas');