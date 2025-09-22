// projekt/config.js

// =============================================================================
// KONFIGŪRACIJA - ČEIA KEISKITE VISUS DUOMENIS
// =============================================================================

const CONFIG = {
    // PROJEKTŲ HIERARCHIJA (dot notation formatu)
    PROJECTS: [
        'learning',
        'learning.svenska',
        'learning.svenska.reading',
        'learning.svenska.speaking',
        'learning.svenska.grammar',
        'learning.english',
        'learning.english.vocabulary',
        'learning.english.conversation',
        'learning.english.writing',
        'learning.revit',
        'learning.revit.basics',
        'learning.revit.advanced',
        'learning.programming',
        'learning.programming.javascript',
        'learning.programming.python',
        'learning.programming.react',
        'work',
        'work.meetings',
        'work.meetings.daily',
        'work.meetings.weekly',
        'work.meetings.planning',
        'work.projects',
        'work.projects.current',
        'work.projects.archived',
        'work.admin',
        'work.admin.reports',
        'work.admin.documentation',
        'personal',
        'personal.health',
        'personal.health.exercise',
        'personal.health.nutrition',
        'personal.health.medical',
        'personal.finance',
        'personal.finance.budget',
        'personal.finance.taxes',
        'personal.finance.investments',
        'personal.home',
        'personal.home.maintenance',
        'personal.home.cleaning',
        'personal.home.organization',
        'planning',
        'planning.goals',
        'planning.goals.yearly',
        'planning.goals.monthly',
        'planning.goals.weekly',
        'planning.review',
        'planning.review.daily',
        'planning.review.weekly',
        'planning.review.monthly',
        'startup',
        'startup.legal',
        'startup.legal.contracts',
        'startup.legal.compliance',
        'startup.tech',
        'startup.tech.development',
        'startup.tech.infrastructure',
        'startup.marketing',
        'startup.marketing.content',
        'startup.marketing.social'
    ],

    // TAGŲ KATEGORIJOS
    TAGS: {
        LOCATION: ['home', 'office', 'online', 'outdoor', 'indoor', 'travel', 'phone'],
        ENERGY: ['highenergy', 'lowenergy', 'focused', 'tired', 'motivated'],
        TIME: ['morning', 'afternoon', 'evening', 'weekend', 'weekday', 'quick', 'longterm'],
        TYPE: ['meeting', 'call', 'email', 'reading', 'writing', 'research', 'creative', 'learning', 'practice'],
        COMPLEXITY: ['simple', 'complex', 'routine', 'challenging', 'technical'],
        IMPORTANCE: ['urgent', 'important', 'critical', 'optional', 'someday'],
        OTHER: ['computer', 'review', 'planning', 'organizing', 'health', 'exercise', 'cooking', 'shopping', 'cleaning', 'maintenance', 'financial', 'legal', 'social', 'family', 'friends']
    },

    // PRIORITETŲ SĄRAŠAS
    PRIORITY: ['L', 'M', 'H'],

    // RECUR VARIANTAI
    RECUR: [
        'daily', '2days', '3days', 'weekly', 'biweekly', 'monthly', 'quarterly',
        'semiannual', 'yearly', 'weekdays', 'weekends', 'monday', 'tuesday',
        'wednesday', 'thursday', 'friday', 'saturday', 'sunday', '1st', '2nd',
        '3rd', 'last', 'eom', 'eoy'
    ],

    // PAGALBOS TEKSTAI
    HELP: {
        DESCRIPTION: `DESCRIPTION laukas yra privalomas ir nurodo užduoties pavadinimą arba trumpą aprašymą.

Pavyzdžiai:
- "Parašyti savaitės ataskaitą"
- "Nusipirkti produktus"
- "Paskambinti daktarui"
- "Revit: atsisiųsti programą"

Jei paspausite MILESTONE mygtuką, prie aprašymo bus pridėtas "MILESTONE: " prefiksas, kuris pažymi svarbų tikslą ar etapą.

Aprašymas bus uždėtas į kabutes Taskwarrior komandoje.`,

        PROJECT: `PROJECT laukas leidžia priskirti užduotį prie konkretaus projekto hierarchijoje.

Hierarchija veikia trimis lygiais:
1. Pagrindinis (pvz. "learning")
2. Antrinis (pvz. "svenska")  
3. Tretinis (pvz. "reading")

Pavyzdžiai:
- Tik pagrindinis: project:learning
- Du lygiai: project:learning.svenska
- Trys lygiai: project:learning.svenska.reading

Projektai padeda grupuoti susijusias užduotis ir palengvina jų paiešką bei filtravimą Taskwarrior programoje.`,

        ANNOTATIONS: `ANNOTATIONS laukas skirtas papildomai informacijai apie užduotį.

Čia galite įrašyti:
- Kontaktų duomenis
- Papildomas instrukcijas
- Nuorodas
- Pastabas sau

Pavyzdžiai:
- "Dentist: Dr. Smith, +46-987-654-321"
- "Priminti apie draudimą"
- "https://example.com/dokumentas"
- "Reikės kreditinės kortelės"

Anotacijos bus pridėtos prie užduoties kaip papildoma informacija.`,

        TAGS: `TAGS laukas leidžia priskirti užduočiai etiketes, kurios padeda kategorizuoti ir filtruoti užduotis.

Tagai suskirstyti į kategorijas. Iš kiekvienos kategorijos galite pasirinkti kelis tagus paspausdami ant jų. Pasirinkti tagai bus pažymėti mėlynai.

Kategorijos:
- LOCATION: vieta (home, office, online, outdoor...)
- ENERGY: energijos lygis (highenergy, lowenergy, focused...)
- TIME: laiko kontekstas (morning, evening, weekend...)
- TYPE: veiklos tipas (meeting, call, email, reading...)
- COMPLEXITY: sudėtingumas (simple, complex, routine...)
- IMPORTANCE: svarba (urgent, important, critical...)
- OTHER: kiti (computer, health, financial...)

Pavyzdys rezultate: +home,+highenergy,+evening,+computer,+learning

Tag'ai padeda greitai rasti panašias užduotis ir planuoti dieną pagal energijos lygį ar kontekstą.`,

        PRIORITY: `PRIORITY laukas nustato užduoties svarbumą.

Galimi prioritetai:
- H (High) - Aukštas prioritetas
- M (Medium) - Vidutinis prioritetas  
- L (Low) - Žemas prioritetas

Aukšto prioriteto užduotys bus rodomos pirmiau Taskwarrior sąrašuose ir bus lengviau identifikuojamos.

Pavyzdys rezultate: priority:H

Naudokite H tik tikrai svarbioms užduotims, kad neprastų prioritetų sistema savo prasmės.`,

        DUE: `DUE laukas nustato užduoties termino datą ir laiką.

Galite nurodyti:
- Tik datą: 2025-12-31
- Datą ir laiką: 2025-12-31T14:30:00

Formatai:
- Su laiku: YYYY-MM-DDThh:mm:ss
- Tik data: YYYY-MM-DD

Pavyzdžiai:
- due:2025-01-15
- due:2025-01-15T09:00:00

Užduotys su terminais bus automatiškai rikiuojamos pagal artėjančius terminus ir pažymėtos, jei terminas praeitas.`,

        SCHEDULED: `SCHEDULED laukas nurodo kada užduotis turėtų būti pradėta ar kada ji taps matoma jūsų užduočių sąraše.

Skirtumas nuo DUE:
- DUE = kada reikia baigti
- SCHEDULED = kada pradėti ar kada rodyti

Formatas: YYYY-MM-DD

Pavyzdys: scheduled:2025-11-01

Užduotis su SCHEDULED data bus paslėpta iki tos datos, o tada automatiškai atsiras jūsų užduočių sąraše.

Naudinga užduotims, kurias norite atlikti konkrečią dieną, bet ne anksčiau.`,

        WAIT: `WAIT laukas nustato datą, iki kurios užduotis yra "laukimo" būsenos ir nerodoma aktyvių užduočių sąraše.

Formatas: YYYY-MM-DD

Pavyzdys: wait:2025-04-01

Naudojimo atvejai:
- Laukiate atsakymo iš kito asmens
- Užduotis priklauso nuo išorinių veiksnių  
- Norite atidėti užduotį konkrečiam laikui

Užduotis automatiškai taps aktyvi po nurodytos datos ir vėl atsiras jūsų sąraše.

Skiriasi nuo SCHEDULED tuo, kad WAIT daugiau skirta užduotims, kurios "užblokuotos" išorinių priežasčių.`,

        RECUR: `RECUR laukas nustato užduoties pasikartojimo dažnumą. Užbaigus kartojamą užduotį, automatiškai sukuriama nauja pagal nustatytą intervalą.

Pagrindiniai variantai:
- daily - kasdien
- weekly - kas savaitę  
- monthly - kas mėnesį
- yearly - kas metus

Savaitės dienos:
- monday, tuesday, ..., sunday

Specialūs:
- weekdays - darbo dienomis
- weekends - savaitgaliais
- eom - mėnesio pabaigoje
- 2nd, 3rd - konkrečia mėnesio diena

Pavyzdžiai:
- recur:weekly
- recur:3days  
- recur:monthly

Naudinga rutinos užduotims: sportas, valymas, mokesčiai, susitikimai.`,

        ESTIMATE: `ESTIMATE laukas nurodo, kiek laiko užtruks užduoties atlikimas.

Užpildykite reikiamus laukus:
- Metai (YY): 0-99
- Mėnesiai (MM): 0-99  
- Dienos (DD): 0-999
- Valandos (HH): 0-23
- Minutės (MM): 0-59

Pavyzdžiai:
- 3 dienos: užpildyti tik "3" dienos lauke → P3D
- 2 valandos 30 minučių: "2" valandos, "30" minutės → PT2H30M
- 1 metai 6 mėnesiai: "1" metai, "6" mėnesiai → P1Y6M
- 2 dienos 5 valandos: "2" dienos, "5" valandos → P2DT5H

Rezultatas bus ISO 8601 formato (pvz: P1Y2M3DT4H5M).

Galite užpildyti tik reikiamus laukus - tuščius sistema ignoruos.`
    }
};