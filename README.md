# Diesel vs Benzina

Applicazione web stand-alone (HTML, CSS, JavaScript puro — nessun backend, nessuna build) che aiuta a capire, in base al proprio tragitto casa-lavoro, se conviene di più un'auto diesel o un'auto a benzina in termini di costo del carburante.

Provala live su GitHub Pages: `https://<tuo-utente>.github.io/diesel-vs-benzina/` (link attivo dopo la pubblicazione, vedi sotto).

## A cosa serve

Inserendo consumo medio e costo del carburante per entrambe le motorizzazioni, più la distanza del tragitto casa-lavoro, l'app calcola:

- il costo **giornaliero** (andata e ritorno),
- il costo **mensile** (in base ai giorni lavorativi indicati),
- il costo **annuale** (proiezione su 12 mesi),

per diesel e benzina, mostra quale opzione è più conveniente e di quanto, e visualizza il confronto con un grafico a barre.

Tutto il calcolo avviene nel browser: nessun dato viene inviato a un server o salvato da qualche parte.

## Come si usa

1. Apri `index.html` (o la pagina pubblicata su GitHub Pages).
2. Nella scheda **Auto diesel** inserisci:
   - consumo medio in km/litro (quanti km percorre l'auto con un litro di gasolio);
   - costo del gasolio in €/litro.
3. Nella scheda **Auto a benzina** inserisci gli stessi dati per la benzina.
4. Nella scheda **Tragitto** inserisci:
   - la distanza casa-lavoro, **sola andata**, in km (l'app calcola automaticamente andata + ritorno);
   - i giorni lavorativi al mese (precompilato a 21, modificabile).
5. Premi **Calcola confronto**.
6. Nella sezione risultati:
   - il banner in alto indica subito quale motorizzazione conviene e il risparmio annuo stimato;
   - i tre pulsanti **Giornaliero / Mensile / Annuale** permettono di cambiare l'orizzonte temporale mostrato nei riquadri numerici e nel grafico a barre.

## Formula di calcolo

```
costo per km      = costo carburante al litro / consumo medio (km/litro)
km giornalieri    = distanza casa-lavoro × 2   (andata + ritorno)
costo giornaliero = costo per km × km giornalieri
costo mensile     = costo giornaliero × giorni lavorativi al mese
costo annuale     = costo mensile × 12
```

Il confronto è puramente indicativo: considera solo il costo del carburante, non manutenzione, bollo, assicurazione, svalutazione o differenze di prezzo tra i due veicoli.

## Struttura del progetto

```
diesel-vs-benzina/
├── index.html   → struttura della pagina e dei form
├── style.css    → stile dell'applicazione
├── script.js    → logica di calcolo e interazione
└── README.md    → questo file
```

Nessuna dipendenza da installare, nessun framework, nessun processo di build. L'unica risorsa esterna è il caricamento dei font (Oswald, IBM Plex Sans, IBM Plex Mono) da Google Fonts; se necessario un ambiente completamente offline, è sufficiente rimuovere i tag `<link>` dei font nell'`<head>` di `index.html`: verranno usati i font di sistema come fallback.

## Pubblicazione su GitHub Pages

1. Crea un repository GitHub chiamato **`diesel-vs-benzina`** e carica i quattro file di questo progetto nella root (o in `/docs`, a scelta).
2. Vai su **Settings → Pages** del repository.
3. In **Source** seleziona il branch (es. `main`) e la cartella (`/root` o `/docs`).
4. Salva: dopo qualche minuto la pagina sarà raggiungibile all'indirizzo indicato da GitHub (in genere `https://<tuo-utente>.github.io/diesel-vs-benzina/`).

Non serve alcuna configurazione aggiuntiva: essendo l'app completamente stand-alone, funziona così com'è su GitHub Pages.

## Licenza

Puoi usare, modificare e distribuire liberamente questo progetto.
