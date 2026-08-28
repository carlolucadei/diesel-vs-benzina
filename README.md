# Diesel vs Benzina vs GPL

Applicazione web stand-alone (HTML, CSS, JavaScript puro — nessun backend, nessuna build) che aiuta a capire, in base al proprio tragitto casa-lavoro, se conviene di più un'auto diesel, un'auto a benzina o un'auto a GPL in termini di costo del carburante.

Provala live su GitHub Pages: `https://<tuo-utente>.github.io/diesel-vs-benzina/` (link attivo dopo la pubblicazione, vedi sotto).

## A cosa serve

Inserendo consumo medio e costo del carburante per diesel e benzina, il costo del GPL al litro e la distanza del tragitto casa-lavoro, l'app calcola:

- il costo **giornaliero** (andata e ritorno),
- il costo **mensile** (in base ai giorni lavorativi indicati),
- il costo **annuale** (proiezione su 12 mesi),

per diesel, benzina e — se i dati della benzina sono stati inseriti — anche per il GPL, mostra quale opzione è più conveniente e di quanto, e visualizza il confronto con un grafico a barre.

La sezione **GPL** è visibile fin da subito ma resta disattivata finché non si compilano consumo e costo della benzina: il consumo di un'auto a GPL viene infatti stimato automaticamente come l'85% di quello a benzina, quindi basta indicare il prezzo del GPL al litro per attivarla.

Tutto il calcolo avviene nel browser: nessun dato viene inviato a un server o salvato da qualche parte.

## Come si usa

1. Apri `index.html` (o la pagina pubblicata su GitHub Pages).
2. Nella scheda **Tragitto** inserisci:
   - la distanza casa-lavoro, **sola andata**, in km (l'app calcola automaticamente andata + ritorno);
   - i giorni lavorativi al mese (precompilato a 21, modificabile).
3. Nella scheda **Auto diesel** inserisci:
   - consumo medio in km/litro (quanti km percorre l'auto con un litro di gasolio);
   - costo del gasolio in €/litro.
4. Nella scheda **Auto a benzina** inserisci gli stessi dati per la benzina.
5. Non appena consumo e costo della benzina sono compilati, la scheda **Auto a GPL** si attiva: inserisci solo il costo del GPL in €/litro.
6. Premi **Calcola confronto**.
7. Nella sezione risultati:
   - il banner in alto indica subito quale motorizzazione conviene e il risparmio annuo stimato (diesel, benzina ed eventualmente GPL);
   - i tre pulsanti **Giornaliero / Mensile / Annuale** permettono di cambiare l'orizzonte temporale mostrato nei riquadri numerici e nel grafico a barre.

## Formula di calcolo

```
costo per km      = costo carburante al litro / consumo medio (km/litro)
km giornalieri    = distanza casa-lavoro × 2   (andata + ritorno)
costo giornaliero = costo per km × km giornalieri
costo mensile     = costo giornaliero × giorni lavorativi al mese
costo annuale     = costo mensile × 12
```

Per il GPL, non essendo richiesto un consumo medio dedicato, si stima il consumo come l'85% di quello a benzina e si applica questa formula (costo annuale):

```
km totali annui = distanza casa-lavoro × 2 × giorni lavorativi al mese × 12
costo annuale GPL = costo GPL al litro × (km totali annui / (consumo medio benzina × 0,85))
```

I costi giornaliero e mensile del GPL vengono poi ricavati dal costo annuale dividendo rispettivamente per 12 e per i giorni lavorativi al mese.

Il confronto è puramente indicativo: considera solo il costo del carburante, non manutenzione, bollo, assicurazione, svalutazione o differenze di prezzo tra i veicoli.

## Struttura del progetto

```
diesel-vs-benzina/
├── index.html   → struttura della pagina e dei form
├── style.css    → stile dell'applicazione
├── script.js    → logica di calcolo e interazione
└── README.md    → questo file
```

Nessuna dipendenza da installare, nessun framework, nessun processo di build. L'unica risorsa esterna è il caricamento dei font (Oswald, IBM Plex Sans, IBM Plex Mono) da Google Fonts; se necessario un ambiente completamente offline, è sufficiente rimuovere i tag `<link>` dei font nell'`<head>` di `index.html`: verranno usati i font di sistema come fallback.

## Come usarlo

Dato che ho attivato **GitHub Pages**, se vuoi puoi accedere al simulatore direttamente online all'indirizzo: https://carlolucadei.github.io/diesel-vs-benzina/.

Non serve alcuna configurazione aggiuntiva: essendo l'app completamente stand-alone, funziona così com'è su GitHub Pages.

## Licenza

MIT License

Copyright (c) 2026 carlolucadei

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Licenza MIT: puoi usare, copiare, modificare, distribuire e pubblicare questo codice liberamente, anche per scopi commerciali, senza chiedere permesso. L'unica condizione è mantenere il testo della licenza nelle copie distribuite.
