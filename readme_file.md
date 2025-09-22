# 📋 Taskwarrior Composer PWA

Progressive Web App, skirta lengvam Taskwarrior užduočių kūrimui ir eksportavimui.

## 🎯 Apie projektą

Taskwarrior Composer yra moderna PWA programėlė, kuri leidžia patogiai kurti ir tvarkyti užduotis Taskwarrior formatui. Programa veikia bet kokiame naršyklėje, gali būti įdiegta į telefoną kaip native programėlė ir veikia net be interneto ryšio.

## ✨ Funkcijos

### 📱 PWA funkcionalumas
- **Installable** - įdiegkite į telefono ekraną
- **Offline veikimas** - naudokite be interneto
- **Fast loading** - greitai kraunasi
- **Responsive design** - prisitaiko prie bet kokio ekrano

### 🎨 Intuityvi sąsaja
- **Hierarchiniai projektai** - 3 lygių projektų struktūra
- **Kategorijuoti tagai** - LOCATION, ENERGY, TIME, TYPE, COMPLEXITY, IMPORTANCE, OTHER
- **Milestone režimas** - pažymėkite svarbius tikslus
- **Vizualus feedback** - animacijos ir spalvos

### ⚙️ Taskwarrior integracija
- **Pilnas JSON eksportas** - tiesioginis importas į Taskwarrior
- **Visi Taskwarrior laukai** - description, project, tags, priority, due, scheduled, wait, recur, estimate
- **ISO 8601 formatai** - teisingi datos ir laiko formatai
- **Annotations palaikymas** - papildoma informacija užduotims

### 📊 Valdymo įrankiai
- **Task counter** - skaičiuokite išsaugotas užduotis
- **Batch export** - eksportuokite visas užduotis vienu metu
- **Form validation** - apsauga nuo klaidų
- **Clear feedback** - informaciniai pranešimai

## 🚀 Naudojimas

### 1. Atvėrimas
Programėlę galite naudoti tiesiogiai naršyklėje: [Demo Link]

### 2. Užduoties kūrimas
1. Įveskite **DESCRIPTION** (privalomas laukas)
2. Pasirinkite **PROJECT** hierarchiją
3. Pridėkite **ANNOTATIONS** jei reikia
4. Pasirinkite **TAGS** iš kategorijų
5. Nustatykite **PRIORITY** (L/M/H)
6. Nurodykite **DUE** datą ir laiką
7. Nustatykite kitus parametrus pagal poreikį

### 3. Išsaugojimas
- Spauskite **SAVE** - užduotis išsaugojama atmintyje
- Spauskite **EXPORT** - atsisiunčiamas JSON failas

### 4. Taskwarrior importas
```bash
task import taskwarrior_import_2025-09-22.json
```

## 🔧 Technologijos

- **Vanilla JavaScript** - jokių priklausomybių
- **CSS3** - modernus dizainas su animacijomis  
- **PWA APIs** - Service Worker, Web App Manifest
- **LocalStorage** - duomenų saugojimas
- **JSON Export** - Taskwarrior integracijos

## 📁 Projekto struktūra

```
taskwarrior-composer-pwa/
├── index.html              # Pagrindinis HTML
├── manifest.json           # PWA konfigūracija
├── sw.js                   # Service Worker
├── projekt/
│   ├── app.js              # Programos logika
│   ├── config.js           # Konfigūracija ir duomenys
│   └── styles.css          # Stiliai
├── icons/                  # PWA ikonos
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
└── README.md
```

## ⚙️ Konfigūracija

### Projektų pridėjimas
Redaguokite `projekt/config.js` failą ir pridėkite naujus projektus į `CONFIG.PROJECTS` masyvą:

```javascript
'naujas.projektas',
'naujas.projektas.subprojektas'
```

### Tagų pridėjimas
Pridėkite naujus tagus į atitinkamą kategoriją `CONFIG.TAGS` objekte:

```javascript
LOCATION: ['home', 'office', 'naujas-tag'],
```

### Prioritetų keitimas
Pakeiskite `CONFIG.PRIORITY` masyvą:

```javascript
PRIORITY: ['L', 'M', 'H', 'C'] // Critical pridėtas
```

## 🔄 Deployment

### GitHub Pages
1. Fork šį repository
2. Eikite į Settings → Pages
3. Pasirinkite Source: "Deploy from a branch"
4. Branch: main, folder: / (root)
5. Išsaugokite

### Kiti hosting'ai
Programa veiks bet kuriame static hosting servyje:
- Netlify
- Vercel
- Firebase Hosting
- Surge.sh

## 📱 PWA įdiegimas

### Android (Chrome)
1. Atidarykite programėlę Chrome naršyklėje
2. Spustelėkite "Įdiegti programėlę" mygtuką arba
3. Menu → "Add to Home Screen"

### iOS (Safari)
1. Atidarykite programėlę Safari
2. Spustelėkite Share mygtuką
3. Pasirinkite "Add to Home Screen"

### Desktop
1. Chrome/Edge: spustelėkite install ikoną adreso juostoje
2. Arba Menu → "Install Taskwarrior Composer"

## 🛠️ Utveckling

### Local development
```bash
# Clone repository
git clone https://github.com/jusu-username/taskwarrior-composer-pwa.git
cd taskwarrior-composer-pwa

# Paleisti local serverį
python -m http.server 8000
# arba
npx serve .

# Atidarykite http://localhost:8000
```

### PWA testavimas
1. Chrome DevTools → Application tab
2. Patikrinkite Manifest konfigūraciją
3. Išbandykite Service Worker cache
4. Lighthouse audit PWA score

## 🤝 Contributions

Contributions yra laukiami! Prašome:

1. Fork šį repository
2. Sukurkite feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit pakeitimai (`git commit -m 'Add some AmazingFeature'`)
4. Push į branch (`git push origin feature/AmazingFeature`)
5. Atidarykite Pull Request

## 📝 Licencija

Šis projektas yra atviro kodo pagal MIT licenciją. Žiūrėkite `LICENSE` failą dėl detalių.

## 🔗 Nuorodos

- [Taskwarrior oficialus website](https://taskwarrior.org/)
- [PWA dokumentacija](https://web.dev/progressive-web-apps/)
- [Taskwarrior JSON format](https://taskwarrior.org/docs/design/task.html)

## 📞 Kontaktai

Jei turite klausimų ar pasiūlymų:
- Atidarykite GitHub Issue
- Susisiekite per GitHub Discussions

---

**Padarytas su ❤️ produktyvumui ir Taskwarrior bendruomenei**