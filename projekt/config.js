// TASKWARRIOR COMPOSER - TECHNINĖ KONFIGŪRACIJA

// Pagrindiniai sistemos nustatymai
const CONFIG = {
    // Numatytosios reikšmės
    DEFAULT_FIELD: 'DUE',
    DEFAULT_TIME: '00:00',
    DEFAULT_WEEKDAY: 'monday',
    DEFAULT_MONTH: 'december',
    DEFAULT_MONTHDAY: 1,
    DEFAULT_INTERVAL: 'daily',
    DEFAULT_PRIORITY: '',
    DEFAULT_ESTIMATE_VALUE: '',
    DEFAULT_ESTIMATE_UNIT: 'h',
    
    // Aplikacijos nustatymai
    APP: {
        TITLE: 'TASKWARRIOR COMPOSER',
        VERSION: '1.0.0',
        AUTHOR: 'TaskWarrior Team'
    },
    
    // Kalendoriaus nustatymai
    CALENDAR: {
        YEARS_RANGE: (() => {
            const currentYear = new Date().getFullYear();
            const years = [];
            for (let i = currentYear - 2; i <= currentYear + 5; i++) {
                years.push(i);
            }
            return years;
        })(),
        WEEK_START: 1,
        WEEKS_TO_SHOW: 6,
        DAYS_PER_WEEK: 7
    },
    
    // Validacijos nustatymai
    VALIDATION: {
        DESCRIPTION: {
            MIN_LENGTH: 1,
            MAX_LENGTH: 500
        },
        PROJECT: {
            MAX_LENGTH: 50,
            ALLOWED_CHARS: /^[a-zA-Z0-9._-]*$/
        },
        TAGS: {
            MAX_TAGS: 20,
            MAX_TAG_LENGTH: 30,
            ALLOWED_CHARS: /^[a-zA-Z0-9._-]*$/
        },
        TIME: {
            HOURS_MIN: 0,
            HOURS_MAX: 23,
            MINUTES_MIN: 0,
            MINUTES_MAX: 59
        },
        MONTHDAY: {
            MIN: 1,
            MAX: 31
        },
        ESTIMATE: {
            MIN: 0,
            MAX: 9999
        },
        ISO: {
            YEARS_MIN: 0,
            YEARS_MAX: 99,
            MONTHS_MIN: 0,
            MONTHS_MAX: 11,
            DAYS_MIN: 0,
            DAYS_MAX: 365,
            HOURS_MIN: 0,
            HOURS_MAX: 23,
            MINUTES_MIN: 0,
            MINUTES_MAX: 59
        }
    }
};

// Kalendoriaus duomenys
const CALENDAR_DATA = {
    weekdays: [
        { key: 'monday', name: 'Monday', lithuanian: 'Pirmadienis', short: 'Pr' },
        { key: 'tuesday', name: 'Tuesday', lithuanian: 'Antradienis', short: 'An' },
        { key: 'wednesday', name: 'Wednesday', lithuanian: 'Trečiadienis', short: 'Tr' },
        { key: 'thursday', name: 'Thursday', lithuanian: 'Ketvirtadienis', short: 'Kt' },
        { key: 'friday', name: 'Friday', lithuanian: 'Penktadienis', short: 'Pn' },
        { key: 'saturday', name: 'Saturday', lithuanian: 'Šeštadienis', short: 'Šš' },
        { key: 'sunday', name: 'Sunday', lithuanian: 'Sekmadienis', short: 'Sk' }
    ],
    
    // Specialūs pasirinkimai
    special_options: [
        { key: 'today', name: 'Today', lithuanian: 'Šiandien', short: 'Šd' },
        { key: 'tomorrow', name: 'Tomorrow', lithuanian: 'Rytoj', short: 'Rt' }
    ],
    
    months: [
        { key: 'january', name: 'January', index: 0 },
        { key: 'february', name: 'February', index: 1 },
        { key: 'march', name: 'March', index: 2 },
        { key: 'april', name: 'April', index: 3 },
        { key: 'may', name: 'May', index: 4 },
        { key: 'june', name: 'June', index: 5 },
        { key: 'july', name: 'July', index: 6 },
        { key: 'august', name: 'August', index: 7 },
        { key: 'september', name: 'September', index: 8 },
        { key: 'october', name: 'October', index: 9 },
        { key: 'november', name: 'November', index: 10 },
        { key: 'december', name: 'December', index: 11 }
    ]
};

// Intervalų duomenys (RECUR laukui)
const INTERVALS = {
    simple: [
        { key: 'daily', name: 'daily', description: 'Kasdien' },
        { key: 'weekly', name: 'weekly', description: 'Kas savaitę' },
        { key: 'monthly', name: 'monthly', description: 'Kas mėnesį' },
        { key: 'yearly', name: 'yearly', description: 'Kasmet' },
        { key: 'weekdays', name: 'weekdays', description: 'Darbo dienomis' },
        { key: 'weekends', name: 'weekends', description: 'Savaitgaliais' }
    ]
};

// ISO 8601 intervalų duomenys
const ISO_INTERVALS = {
    FORMAT_RULES: {
        PREFIX: 'P',
        TIME_SEPARATOR: 'T',
        YEAR_SUFFIX: 'Y',
        MONTH_SUFFIX: 'M',
        DAY_SUFFIX: 'D',
        HOUR_SUFFIX: 'H',
        MINUTE_SUFFIX: 'M'
    }
};

// Įvertinimo vienetų duomenys
const ESTIMATE_UNITS = [
    { key: 'h', name: 'valandos', multiplier: 1 },
    { key: 'd', name: 'dienos', multiplier: 8 },
    { key: 'w', name: 'savaitės', multiplier: 40 }
];

// Komponentų matomumo taisyklės
const COMPONENT_VISIBILITY = {
    DUE: ['calendar', 'time', 'weekdays', 'monthdays', 'months'],
    WAIT: ['calendar', 'time', 'weekdays', 'monthdays', 'months'],
    SCHEDULED: ['calendar', 'time', 'weekdays', 'monthdays', 'months'],
    RECUR: ['intervals', 'intervals-iso'],
    UNTIL: ['calendar', 'time', 'weekdays', 'monthdays', 'months']
};

// Sistemos tekstai ir užrašai
const SYSTEM_TEXTS = {
    MAIN_TITLE: 'TASKWARRIOR COMPOSER',
    
    FIELD_NAMES: {
        DUE: 'DUE',
        WAIT: 'WAIT', 
        SCHEDULED: 'SCHEDULED',
        RECUR: 'RECUR',
        UNTIL: 'UNTIL'
    },
    
    COMPONENT_TITLES: {
        calendar: '📅 KALENDORIUS',
        time: '🕐 LAIKAS',
        weekdays: '📄 SAVAITĖS DIENOS',
        monthdays: '📊 MĖNESIO DIENOS',
        months: '📋 MĖNESIAI',
        intervals: '🔄 INTERVALAI',
        'intervals-iso': '⚡ INTERVALAI-ISO'
    },
    
    HELPER_TEXTS: {
        time_format: 'Valandos: 00-23, Minutės: 0-59',
        monthday_format: 'Sistema automatiškai prideda: 1st, 2nd, 3rd...',
        iso_format: 'ISO 8601 formatas',
        iso_parts: 'Metai : Mėnesiai : Dienos : Valandos : Minutės',
        iso_example: 'P1Y2M3DT4H5M'
    },
    
    PREVIEW_LABELS: {
        preview_field: 'Laukas:',
        preview_selected: 'Pasirinkta:',
        preview_taskwarrior: 'TaskWarrior:',
        preview_date: 'Data:'
    },
    
    // Pagalbos tekstai laukams (trumpi tekstai help sekcijai)
    HELP_TEXTS: {
        DUE: 'DUE laukas nurodo kada užduotis turi būti baigta. Gali būti konkreti data, savaitės diena ar mėnuo.',
        WAIT: 'WAIT laukas nustato, iki kada užduotis yra paslėpta. Ji taps matoma po nurodytos datos.',
        SCHEDULED: 'SCHEDULED laukas nurodo kada užduotis turėtų pradėta ar kada ji taps matoma sąraše.',
        RECUR: 'RECUR laukas nustato užduoties pasikartojimo dažnumą. Reikia taip pat nurodyti DUE datą.',
        UNTIL: 'UNTIL laukas nustato kada sustabdyti kartojamąją užduotį.',
        DEFAULT: 'Pasirinkite lauką iš viršaus mygtukų.'
    }
};

// UI konstantos
const UI_CONSTANTS = {
    COLORS: {
        PRIMARY: '#4299e1',
        BACKGROUND: '#f7fafc',
        TEXT: '#4a5568',
        SUCCESS: '#68d391',
        WARNING: '#f6e05e',
        ERROR: '#fc8181',
        HIGH_PRIORITY: '#f56565',
        MEDIUM_PRIORITY: '#f6e05e',
        LOW_PRIORITY: '#68d391'
    },
    
    TRANSITIONS: {
        FAST: '0.2s ease',
        NORMAL: '0.3s ease',
        SLOW: '0.5s ease'
    },
    
    BREAKPOINTS: {
        MOBILE: '480px',
        TABLET: '768px',
        DESKTOP: '1024px'
    }
};

// LocalStorage raktai
const STORAGE_KEYS = {
    TASKS: 'taskwarrior_tasks',
    SETTINGS: 'taskwarrior_settings',
    CURRENT_TASK: 'taskwarrior_current_task',
    STATS: 'taskwarrior_stats'
};

// =============================================================================
// SAFETY CHECKS & INITIALIZATION
// =============================================================================

// Patikrinti ar visi reikalingi objektai egzistuoja
function validateConfig() {
    const errors = [];
    
    if (!CONFIG) errors.push('CONFIG object missing');
    if (!CALENDAR_DATA) errors.push('CALENDAR_DATA object missing');
    if (!CALENDAR_DATA.weekdays || !Array.isArray(CALENDAR_DATA.weekdays)) {
        errors.push('CALENDAR_DATA.weekdays array missing or invalid');
    }
    if (!CALENDAR_DATA.special_options || !Array.isArray(CALENDAR_DATA.special_options)) {
        errors.push('CALENDAR_DATA.special_options array missing or invalid');
    }
    if (!CALENDAR_DATA.months || !Array.isArray(CALENDAR_DATA.months)) {
        errors.push('CALENDAR_DATA.months array missing or invalid');
    }
    if (!COMPONENT_VISIBILITY) errors.push('COMPONENT_VISIBILITY object missing');
    if (!SYSTEM_TEXTS) errors.push('SYSTEM_TEXTS object missing');
    
    if (errors.length > 0) {
        console.error('Config validation errors:', errors);
        return false;
    }
    
    return true;
}

// Eksportavimas globaliam naudojimui su safety check
(function() {
    try {
        window.CONFIG = CONFIG;
        window.CALENDAR_DATA = CALENDAR_DATA;
        window.INTERVALS = INTERVALS;
        window.ISO_INTERVALS = ISO_INTERVALS;
        window.ESTIMATE_UNITS = ESTIMATE_UNITS;
        window.COMPONENT_VISIBILITY = COMPONENT_VISIBILITY;
        window.SYSTEM_TEXTS = SYSTEM_TEXTS;
        window.UI_CONSTANTS = UI_CONSTANTS;
        window.STORAGE_KEYS = STORAGE_KEYS;
        
        // Validate config
        if (validateConfig()) {
            console.log('✅ Config loaded and validated successfully');
        } else {
            console.error('❌ Config validation failed');
        }
        
    } catch (error) {
        console.error('❌ Error exporting config to window:', error);
    }
})();