// projekt/data.js

// =============================================================================
// DUOMENYS - ČEIA KEISKITE VISUS DUOMENIS
// =============================================================================

const DATA = {
    // PROJEKTŲ HIERARCHIJA (dot notation formatu)
    PROJECTS: [
        'learning',
        'learning.svenska',
        'learning.english',
        'learning.revit',
        'learning.svenska.learn',
        'learning.svenska.tech_work',
        'learning.english.learn',
        'learning.english.tech_work',
        'learning.revit.learn',
        'learning.revit.tech_work',
        'BUNI',
        'BUNI.programming',
        'BUNI.DB',
        'BUNI.DB.svenska',
        'BUNI.DB.english',
        'career',
        'health',
        'health.physical',
        'health.mental',
        'development',
        'development.book',
        'development.book.LT',
        'house',
        'home',
        'home.sewing',
        'home.cleaning',
        'sewing',
        'calendar',
        'calendar.birthdays',
        'calendar.anniversaries',
        'inbox',
        'lists',
        'lists.shopping',
        'lists.shopping.christmas',
        'lists.travel',
        'finances',
        'celebrations',
        'celebrations.christmas',
        'ideas',
    ],

    // TAGŲ KATEGORIJOS
    TAGS: {
        LOCATION: ['home', 'LT', 'livingroom', 'bedroom', 'hallway', 'bathroom', 'kitchen', 'basement'],
        TIME: ['morning', 'afternoon', 'evening', 'weekend'],
        ENERGY: ['tired'],
        DURATION: ['quick'],
        TOOLS: ['computer', 'AI', 'tablet', 'internet', 'lan'],
        METHOD: ['online'],
        MOOD: ['dislike', 'hate', 'stressful', 'relaxing', 'exciting'],
        COMPLEXITY: ['simple', 'focus', 'multitasking', 'routine', 'technical'],
        TYPE: ['coding', 'doctor', 'hobby', 'one_time'],
        OTHER: ['creative', 'mind']
    },

    // PRIORITETŲ DUOMENYS - su key ir display formatu
    PRIORITY: [
        { key: 'L', label: 'Low', description: 'Žemas prioritetas' },
        { key: 'M', label: 'Medium', description: 'Vidutinis prioritetas' },
        { key: 'H', label: 'High', description: 'Aukštas prioritetas' }
    ],

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

PROJEKTŲ APRAŠYMAI:
- learning: mokymasis
- BUNI: skaitymo programėlė
- career: karjeros planavimas
- health: fizinis aktyvumas, psichikos sveikata
- development: asmeninis/profesinis tobulėjimas
- house: namo statybos projektas
- home: namų tvarka
- sewing: siuvimas
- calendar: gimtadieniai,progos
- inbox: neišrūšiuoti/neaiškūs dalykai
- lists: įvairūs sąrašai
- finances: įvairūs mokėjimai
- celebrations.christmas: čia bus pildomas visas pasiruošimo planas, kas kada, kas po ko...
- ideas: norimi darbai, projektai, kelionės ir kiti atsiradę norai - kurie gal kadanors bus įgyvendinti.

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
- LOCATION: vieta (home, livingroom, bedroom, hallway, bathroom, kitchen, basement)
- TIME: laiko kontekstas (morning, afternoon, evening, weekend)
- ENERGY: energijos lygis (tired)
- DURATION: trukmė (quick)
- TOOLS: reikalingi įrankiai (computer, AI, tablet, internet, lan)
- METHOD: vykdymo būdas (online)
- MOOD: nuotaika (dislike, hate)
- COMPLEXITY: sudėtingumas (simple, focus, routine, technical)
- IMPORTANCE: svarba (urgent, important, someday)
- TYPE: veiklos tipas (coding, doctor, hobby)
- OTHER: kiti (creative, relax)

Pavyzdys rezultate: +home,+highenergy,+evening,+computer,+learning

Tag'ai padeda greitai rasti panašias užduotis ir planuoti dieną pagal energijos lygį ar kontekstą.`,

        PRIORITY: `PRIORITY laukas nustato užduoties svarbumą.

Galimi prioritetai:
- H (High) - Aukštas prioritetas
- M (Medium) - Vidutinis prioritetas  
- L (Low) - Žemas prioritetas

Aukšto prioriteto užduotys bus rodomos pirmiau Taskwarrior sąrašuose ir bus lengviau identifikuojamos.

Pavyzdys rezultate: priority:H

Naudokite H tik tikrai svarbioms užduotims, kad nerastų prioritetų sistema savo prasmės.`,

        DATETIME_GENERAL: `TASKWARRIOR DATE & TIME SISTEMOS APŽVALGA

Taskwarrior palaiko lankstų datos ir laiko valdymą su 5 pagrindiniais laukais:

PAGRINDINIAI LAUKAI:
• DUE - kada turi būti baigta užduotis (terminas)
• WAIT - iki kada užduotis paslėpta (laukimo būsena)  
• SCHEDULED - kada pradėti arba kada rodyti užduotį
• RECUR - užduoties pasikartojimo dažnumas
• UNTIL - kada sustabdyti kartojamąją užduotį

LAIKO FORMATAI:
• Tik data: 2025-12-31 
• Data su laiku: 2025-12-31T14:30:00
• Savaitės dienos: monday, tuesday, etc.
• Mėnesio dienos: 1st, 2nd, 15th, last
• Mėnesiai: january, february, etc.

INTERVALŲ FORMATAI:
• Paprastas: daily, weekly, monthly, yearly
• Skaičiuotas: 2days, 3weeks, 6months  
• ISO 8601: P1Y2M3DT4H5M (1 metai, 2 mėn., 3 d., 4 val., 5 min.)

DAŽNOS KOMBINACIJOS:
• Savaitinis susitikimas: due:friday recur:weekly
• Mėnesio pabaigos ataskaita: due:eom recur:monthly  
• Atidėti iki kitų metų: wait:2026-01-01
• Pradėti rytoj: scheduled:tomorrow
• Kasdienis dalykas: due:today recur:daily

SVARBŪS PRINCIPAI:
• RECUR reikalauja DUE datos
• UNTIL naudojamas tik su RECUR
• WAIT slepia užduotį iki nurodytos datos
• SCHEDULED rodo užduotį tik nuo nurodytos datos
• Galima kombinuoti kelis laukus vienu metu

PATARIMAI:
• Naudokite SCHEDULED kasdieniam planavimui
• WAIT - kai laukiate atsakymo ar sprendimo  
• DUE - tikroms karštoms datoms
• RECUR - rutinos užduotims automatizuoti`,

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

// Eksportavimas globaliam naudojimui
window.DATA = DATA;