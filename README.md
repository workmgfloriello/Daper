# Daper – Documentazione del progetto

Daper è un'app desktop pensata per studenti e universitari che vogliono organizzare i propri corsi, creare appunti, gestire il calendario accademico e tenere tutto in un unico ambiente centralizzato.

L'applicazione combina un front-end in React con un processo Electron per il desktop e un database SQLite locale, in modo da offrire un'esperienza simile a un sistema di studio personale ma completamente offline e facile da usare.

---

## 1. Panoramica

Daper nasce come tool di gestione universitario con un focus molto pratico:

- registrare i propri corsi e i relativi dettagli;
- creare, aprire, salvare, rinominare ed esportare appunti;
- organizzare i file per materia;
- tenere traccia delle scadenze e delle attività tramite calendario;
- mantenere un profilo utente personale;
- usare un editor ricco di formattazione per preparare dispense, riassunti e note strutturate.

L'app non richiede un backend esterno: i dati principali sono salvati localmente nel filesystem dell'utente e nel database SQLite associato all'applicazione.

---

## 2. Obiettivi principali

L'obiettivo di Daper è rendere più semplice la vita dello studente, automatizzando e centralizzando i compiti quotidiani di:

- studio;
- documentazione;
- organizzazione delle materie;
- ricerche e recupero delle note;
- pianificazione temporale delle attività universitarie.

In pratica, Daper vuole essere un "centro di controllo personale dello studio".

---

## 3. Funzionalità principali

### 3.1 Gestione utente

L'utente può:

- creare il proprio profilo;
- inserire nome, scuola e tipologia di percorso;
- aggiornare i dati dell'account in qualsiasi momento.

Questo profilo viene usato per personalizzare l'esperienza dell'app e per rendere il contenuto della dashboard più coerente con l'utente.

### 3.2 Gestione dei corsi

Per ogni corso è possibile salvare i seguenti dati:

- id;
- nome;
- codice;
- professore;
- CFU;
- semestre;
- anno;
- numero di appunti associati;
- descrizione;
- colore;
- stato "recente".

Il sistema permette inoltre di:

- inserire nuovi corsi;
- aggiornare i dettagli;
- aggiornare il colore di identificazione;
- eliminare un corso;
- incrementare o decrementare il contatore delle note associate.

### 3.3 Gestione appunti

Ogni appunto è salvato come file JSON e può essere:

- creato;
- aperto;
- salvato;
- rinominato;
- eliminato;
- importato;
- esportato come JSON o PDF.

Questa struttura rende i file facilmente leggibili e compatibili con un backup o un trasferimento di dati tra dispositivi.

### 3.4 Editor avanzato

L'editor è il cuore della produzione di appunti. Supporta funzionalità di formattazione avanzata come:

- titoli;
- testo in grassetto, corsivo, sottolineato;
- colori e stili testuali;
- link;
- blocchi di citazione;
- liste puntate e task list;
- tabelle;
- codice con evidenziazione sintattica;
- formule matematiche;
- separatori orizzontali;
- allineamento del testo.

Il motore editoriale viene costruito con Tiptap, una libreria molto potente usata per editor WYSIWYG in React.

### 3.5 Calendario accademico

Nella parte di calendario, l'app integra FullCalendar per permettere di:

- visualizzare eventi e attività;
- organizzare il tempo di studio;
- mantenere una vista più semplice della pianificazione accademica.

### 3.6 Dashboard e navigazione

La dashboard principale si occupa di riassumere lo stato dell'utente con una navigazione laterale e delle sezioni dedicate a:

- home;
- corsi;
- appunti;
- calendario;
- impostazioni;
- editor.

La navigazione avviene tramite React Router e sfrutta un routing basato su hash per essere compatibile con l'ambiente Electron.

### 3.7 Aggiornamenti applicativi

Il processo Electron include supporto automatico per aggiornamenti tramite electron-updater, utile per distribuire nuove versioni dell'app in modo più semplice.

---

## 4. Stack tecnologico

Daper è costruita con un insieme moderno di tecnologie:

### Front-end

- React 19
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Framer Motion
- Lucide React

### Editor

- Tiptap
- Highlight.js
- KaTeX / MathLive
- lowlight

### Desktop

- Electron
- electron-builder
- electron-updater

### Database e storage

- SQLite nativo via node:sqlite
- filesystem locale per i file JSON di appunti

### Scheduling e UI

- FullCalendar

---

## 5. Architettura applicativa

### 5.1 Struttura a livelli

L'applicazione può essere vista in tre livelli principali:

1. Renderer (UI React)
2. Processo principale Electron
3. Database e filesystem locale

#### Renderer

Il renderer è tutto ciò che si trova in `src/` ed è responsabile della visualizzazione della UI, dei componenti, delle pagine e della logica dell'interfaccia.

#### Processo principale

Il file `electron/main.ts` è il punto di ingresso dell'app desktop. Qui vengono creati:

- la finestra principale;
- la splash screen;
- la cartella dei documenti dell'utente;
- il database SQLite;
- la registrazione degli IPC handlers;
- la gestione di chiusura e rilancio della finestra.

#### Layer dati

I file in `database/` e le callable IPC gestiscono la persistenza e le operazioni di lettura/scrittura.

---

## 6. Struttura delle cartelle

```text
Daper/
├── database/
│   └── ManageDatabase.ts
├── electron/
│   ├── ipc/
│   │   ├── course-handlers.ts
│   │   ├── file-handlers.ts
│   │   ├── index.ts
│   │   ├── update-handlers.ts
│   │   └── user-handlers.ts
│   ├── main.ts
│   ├── preload.js
│   └── ...
├── public/
│   ├── splash.html
│   └── assets/
├── src/
│   ├── App.tsx
│   ├── FrameTopbar.tsx
│   ├── RouteWatcher.tsx
│   ├── components/
│   ├── editor/
│   ├── interface/
│   ├── lib/
│   ├── pages/
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
├── README.md
└── release/
```

### Descrizione sintetica

- `src/pages/`: pagine principali dell'app;
- `src/components/`: componenti riutilizzabili;
- `src/editor/`: editor WYSIWYG e strumenti di modifica;
- `src/lib/context/`: contesti React come `CoursesContext`, `NotesContext`, `ThemeContext`, `UserContext`;
- `database/ManageDatabase.ts`: logica di accesso ai dati;
- `electron/ipc/`: registrazione delle chiamate tra renderer e main process;
- `public/`: asset statici e pagina di splash.

---

## 7. Database e persistenza

### 7.1 Database SQLite

Al primo avvio viene creato un file database nella cartella utente di Electron:

- `app.getPath("userData")`
- file: `Daper.db`

Il database è inizializzato dal file `database/ManageDatabase.ts` e contiene le tabelle:

#### Tabella `courses`

Salva i corsi:

- id
- name
- code
- professor
- cfu
- semester
- notes_count
- description
- color
- recent
- year

#### Tabella `notes`

Salva i riferimenti agli appunti:

- id
- course
- name
- created_at

#### Tabella `settings`

Permette di salvare configurazioni dell'applicazione.

#### Tabella `user`

Contiene i dati dell'utente attivo:

- name
- school
- type

### 7.2 File degli appunti

I contenuti degli appunti non sono salvati direttamente in SQL, ma in file JSON in una directory dedicata costruita all'interno della cartella utente dell'app:

- `documents`

Ogni file è progettato in questo formato:

```json
{
  "metadata": {
    "id": "...",
    "name": "...",
    "createAt": "...",
    "course": "..."
  },
  "type": "doc",
  "content": {}
}
```

Questa scelta consente di mantenere un file di testo leggibile, esportabile e facilmente importabile.

---

## 8. Comunicazione tra Renderer e Main process

L'app usa Electron IPC per collegare la UI con funzioni native del sistema operativo.

### Esempi di IPC

- `file:create`
- `file:open`
- `file:save`
- `file:rename`
- `file:delate`
- `file:import_file`
- `courses:insert`
- `courses:select`
- `courses:updateRecent`
- `courses:updateColor`
- `user:create`
- `user:select`
- `user:update`

Questo meccanismo è esposto nel preload tramite `contextBridge` nell'API globale `window.electronAPI`.

La logica è organizzata in modo chiaro in:

- `electron/ipc/course-handlers.ts`
- `electron/ipc/file-handlers.ts`
- `electron/ipc/user-handlers.ts`
- `electron/ipc/update-handlers.ts`

Questo approccio mantiene la UI separata dalle operazioni native del sistema, migliorando la sicurezza e la manutenzione del codice.

---

## 9. Flusso di avvio dell'app

L'avvio dell'app segue questo percorso:

1. si avvia il processo Electron;
2. viene creato lo splash screen;
3. viene assicurata la presenza della cartella `documents`;
4. viene inizializzato il database SQLite;
5. viene creata la finestra principale;
6. viene registrata la logica IPC;
7. la UI React viene caricata tramite Vite;
8. la navigazione inizia con `HashRouter`.

Durante il caricamento, se l'utente non è stato ancora creato, l'app mostra la pagina di accesso o di inizializzazione del profilo.

---

## 10. Routing e navigazione

Il routing è gestito da `react-router-dom` e le route principali sono:

- `/` → home
- `/corsi` → pagina corsi
- `/appunti/:appuntiFilter` → appunti filtrati
- `/newappunti` → creazione nuovo appunto
- `/importappunti` → import appunti
- `/corsi/:corsoId` → dettaglio corso
- `/impostazioni` → impostazioni
- `/calendario` → calendario
- `/editor/:fileName` → editor di appunti

Il routing in Electron usa `HashRouter` per evitare problemi di navigazione in ambiente desktop.

---

## 11. Comportamento dell'editor

L'editor usa Tiptap con diverse estensioni per offrire un'esperienza di scrittura avanzata:

- StarterKit
- Underline
- TextStyle
- Color
- FontFamily
- TextAlign
- Highlight
- Link
- Placeholder
- CodeBlockLowlight
- HorizontalRule
- TaskList
- TaskItem
- Mathematics
- Table

Questo consente di creare note davvero professionali, utili per riassunti, appunti di lezione, programmi o schemi di studio.

---

## 12. Norme di sviluppo e manutenzione

### 12.1 Convenzioni di codebase

- React per la UI;
- TypeScript per tipizzazione;
- modularizzazione per funzioni e componenti;
- contesti React per dati globali;
- hander IPC dedicati per ogni dominio (file, corsi, utenti, aggiornamenti).

### 12.2 Sviluppo locale

Per installare le dipendenze:

```bash
npm install
```

Per avviare l'app in modalità sviluppo:

```bash
npm run dev
```

Per avviare Vite + Electron insieme:

```bash
npm run electron:dev
```

### 12.3 Build di produzione

Per generare la build frontend:

```bash
npm run build
```

Per costruire l'installer desktop:

```bash
npm run dist
```

La configurazione di `electron-builder` è definita in `package.json` e produce file in `release/`.

---

## 13. Script disponibili

Nel file `package.json` troviamo i comandi principali:

- `npm run dev`: avvio Vite;
- `npm run build`: build del frontend;
- `npm run preview`: anteprima della build;
- `npm run lint`: controlli ESLint;
- `npm run electron`: avvio diretto di Electron;
- `npm run electron:dev`: avvio app in sviluppo;
- `npm run dist`: build completa + packaging desktop.

---

## 14. Sicurezza e gestione dati

La sicurezza dell'app è stata progettata in modo semplice ma efficace:

- niente Node.js integrato nelle finestre del renderer;
- accesso alle funzioni native tramite `contextBridge`;
- file JSON salvati localmente nell'utente;
- database locale non esposto via rete.

Questo è importante perché un'app desktop locale non deve dipendere da un backend remoto per gestire i dati dell'utente.

---

## 15. Punti di forza del progetto

Daper combina perfettamente tre aspetti:

- organizzazione universitaria;
- gestione dei contenuti e appunti;
- esperienza desktop stabile e veloce.

La combinazione di React, Electron e SQLite lo rende un prodotto molto utile per studenti che vogliono mantenere tutto in uno spazio personale e ordinato.

---

## 16. Cosa può essere esteso in futuro

Il progetto è già molto completo, ma può essere ampliato con:

- importazione di PDF e documenti esterni;
- reminder e notifiche di scadenze;
- sincronizzazione cloud;
- ricerca avanzata per appunti e corsi;
- più temi e personalizzazioni;
- esportazione in Markdown o DOCX;
- supporto per più utenti e account;
- integrazione con calendario esterno.

---

## 17. Conclusione

Daper è un'app desktop dedicata alla gestione dello studio universitario, con un'architettura moderna, un editor potente e una struttura dati semplice ma efficace.

La sua forza principale risiede nella capacità di unire in un unico strumento:

- la gestione dei corsi;
- la note-taking;
- la pianificazione;
- la salvaguardia dei dati locali;
- un'esperienza moderna e rapida.

È una soluzione pensata per chi vuole organizzare la propria vita universitaria in modo pratico, senza dipendere da piattaforme esterne o da servizi online.

---

## 18. Crediti

Questo progetto è in fase di sviluppo come applicazione desktop per uso personale e accademico, con una base tecnica moderna e orientata alla produttività studentesca.
