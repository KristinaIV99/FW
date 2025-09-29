// projekt/datetime/datetime-compatibility.js
// Komponentų suderinamumo logika

class DateTimeCompatibility {
    
    // Grąžina kuriuos komponentus reikia disable pagal aktyvius
    static getDisabledComponents(field, fieldData) {
        const disabled = [];
        
        if (!fieldData) return disabled;
        
        // TAISYKLĖ 1: Jei aktyvus Calendar - disable Weekdays, Months, Monthdays
        if (fieldData.calendar) {
            disabled.push('weekdays', 'months', 'monthdays');
        }
        
        // TAISYKLĖ 2: Jei aktyvus Weekdays - disable visus kitus
        if (fieldData.weekdays) {
            const weekdayValue = fieldData.weekdays.weekday || fieldData.weekdays.weekdayKey;
            
            // Išimtis: jei weekday yra 'today' arba 'tomorrow' - time lieka aktyvus
            const isSpecialDay = weekdayValue === 'today' || weekdayValue === 'tomorrow';
            
            if (isSpecialDay) {
                // Tik calendar, months, monthdays disabled
                disabled.push('calendar', 'months', 'monthdays');
            } else {
                // Visi disabled (įskaitant time)
                disabled.push('calendar', 'time', 'months', 'monthdays');
            }
        }
        
        // TAISYKLĖ 3: Jei aktyvus Monthdays - disable visus kitus
        if (fieldData.monthdays) {
            disabled.push('calendar', 'time', 'weekdays', 'months');
        }
        
        // TAISYKLĖ 4: Jei aktyvus Months - disable visus kitus
        if (fieldData.months) {
            disabled.push('calendar', 'time', 'weekdays', 'monthdays');
        }
        
        // TAISYKLĖ 5: RECUR field - Intervals ir Intervals-ISO negali būti kartu
        if (field === 'recur') {
            if (fieldData.intervals) {
                disabled.push('intervals-iso');
            }
            if (fieldData['intervals-iso']) {
                disabled.push('intervals');
            }
        }
        
        return disabled;
    }
}

// Globalus eksportavimas
window.DateTimeCompatibility = DateTimeCompatibility;

console.log('🔗 DateTime Compatibility modulis užkrautas');
