(() => {
  'use strict';

  const form = document.getElementById('calc-form');
  const resultsSection = document.getElementById('results');

  const winnerBadge = document.getElementById('winner-badge');
  const winnerText = document.getElementById('winner-text');

  const dieselValueEl = document.getElementById('diesel-value');
  const benzinaValueEl = document.getElementById('benzina-value');
  const gplValueEl = document.getElementById('gpl-value');
  const diffValueEl = document.getElementById('diff-value');

  const dieselBar = document.getElementById('diesel-bar');
  const benzinaBar = document.getElementById('benzina-bar');
  const gplBar = document.getElementById('gpl-bar');
  const dieselBarValue = document.getElementById('diesel-bar-value');
  const benzinaBarValue = document.getElementById('benzina-bar-value');
  const gplBarValue = document.getElementById('gpl-bar-value');
  const gplBarCol = document.getElementById('gpl-bar-col');
  const gplReadout = document.getElementById('gpl-readout');
  const chartPeriodLabel = document.getElementById('chart-period-label');

  const gplCard = document.getElementById('gpl-card');
  const gplCostoInput = document.getElementById('gpl-costo');
  const benzinaConsumoInput = document.getElementById('benzina-consumo');
  const benzinaCostoInput = document.getElementById('benzina-costo');

  const GPL_EFFICIENCY = 0.85; // una GPL percorre l'85% dei km/litro rispetto alla benzina

  function hasBenzinaData() {
    return benzinaConsumoInput.value.trim() !== '' && benzinaCostoInput.value.trim() !== '';
  }

  function toggleGplCard() {
    const enabled = hasBenzinaData();
    gplCard.classList.toggle('is-disabled', !enabled);
    gplCostoInput.disabled = !enabled;
    if (!enabled) {
      gplCostoInput.value = '';
    }
  }

  [benzinaConsumoInput, benzinaCostoInput].forEach(input => {
    input.addEventListener('input', toggleGplCard);
  });
  toggleGplCard();

  const tabs = Array.from(document.querySelectorAll('.tab'));

  const currency = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const PERIOD_LABELS = {
    daily: 'giornaliero',
    monthly: 'mensile',
    annual: 'annuale'
  };

  let currentData = null; // { daily: {diesel, benzina}, monthly: {...}, annual: {...} }
  let currentPeriod = 'daily';

  function computeCosts({ dieselConsumo, dieselCosto, benzinaConsumo, benzinaCosto, gplCosto, distanza, giorni }) {
    const dailyKm = distanza * 2; // andata + ritorno

    // consumo espresso in km/litro: costo per km = prezzo al litro / km percorribili con un litro
    const dieselCostPerKm = dieselCosto / dieselConsumo;
    const benzinaCostPerKm = benzinaCosto / benzinaConsumo;

    const dailyDiesel = dieselCostPerKm * dailyKm;
    const dailyBenzina = benzinaCostPerKm * dailyKm;

    const monthlyDiesel = dailyDiesel * giorni;
    const monthlyBenzina = dailyBenzina * giorni;

    const annualDiesel = monthlyDiesel * 12;
    const annualBenzina = monthlyBenzina * 12;

    const result = {
      daily: { diesel: dailyDiesel, benzina: dailyBenzina },
      monthly: { diesel: monthlyDiesel, benzina: monthlyBenzina },
      annual: { diesel: annualDiesel, benzina: annualBenzina }
    };

    if (Number.isFinite(gplCosto)) {
      // Costo annuale GPL = prezzo GPL * (km totali / (consumo benzina * 0.85))
      const kmTotaliAnno = dailyKm * giorni * 12;
      const annualGpl = gplCosto * (kmTotaliAnno / (benzinaConsumo * GPL_EFFICIENCY));
      const monthlyGpl = annualGpl / 12;
      const dailyGpl = monthlyGpl / giorni;

      result.daily.gpl = dailyGpl;
      result.monthly.gpl = monthlyGpl;
      result.annual.gpl = annualGpl;
    }

    return result;
  }

  const FUEL_LABELS = {
    diesel: 'Il diesel',
    benzina: 'La benzina',
    gpl: 'Il GPL'
  };

  function updateWinnerBadge(data) {
    // Winner is decided on the annual figures, the most representative horizon.
    const annual = data.annual;
    const fuels = Object.keys(FUEL_LABELS).filter(key => key in annual);

    const cheapest = fuels.reduce((best, key) => annual[key] < annual[best] ? key : best, fuels[0]);
    const priciest = fuels.reduce((worst, key) => annual[key] > annual[worst] ? key : worst, fuels[0]);
    const delta = annual[priciest] - annual[cheapest];

    winnerBadge.classList.remove('tie');

    if (delta < 0.01) {
      winnerBadge.classList.add('tie');
      winnerText.textContent = 'Tutte le motorizzazioni costano praticamente uguale';
      return;
    }

    winnerText.textContent = `${FUEL_LABELS[cheapest]} conviene — risparmi ${currency.format(delta)} all'anno`;
  }

  function renderPeriod(period) {
    if (!currentData) return;
    currentPeriod = period;

    const { diesel, benzina, gpl } = currentData[period];
    const hasGpl = gpl !== undefined;
    const maxVal = Math.max(diesel, benzina, hasGpl ? gpl : 0, 0.01);

    dieselValueEl.textContent = currency.format(diesel);
    benzinaValueEl.textContent = currency.format(benzina);

    const values = [diesel, benzina].concat(hasGpl ? [gpl] : []);
    diffValueEl.textContent = currency.format(Math.max(...values) - Math.min(...values));

    chartPeriodLabel.textContent = PERIOD_LABELS[period];

    // Bar heights as % of the larger value, floor at 4% for visibility.
    const dieselPct = Math.max((diesel / maxVal) * 100, 4);
    const benzinaPct = Math.max((benzina / maxVal) * 100, 4);

    dieselBar.style.height = dieselPct + '%';
    benzinaBar.style.height = benzinaPct + '%';

    dieselBarValue.textContent = currency.format(diesel);
    benzinaBarValue.textContent = currency.format(benzina);

    gplReadout.classList.toggle('hidden', !hasGpl);
    gplBarCol.classList.toggle('hidden', !hasGpl);

    if (hasGpl) {
      gplValueEl.textContent = currency.format(gpl);
      gplBarValue.textContent = currency.format(gpl);
      gplBar.style.height = Math.max((gpl / maxVal) * 100, 4) + '%';
    }

    tabs.forEach(tab => {
      const isActive = tab.dataset.period === period;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const dieselConsumo = parseFloat(document.getElementById('diesel-consumo').value);
    const dieselCosto = parseFloat(document.getElementById('diesel-costo').value);
    const benzinaConsumo = parseFloat(document.getElementById('benzina-consumo').value);
    const benzinaCosto = parseFloat(document.getElementById('benzina-costo').value);
    const distanza = parseFloat(document.getElementById('distanza').value);
    const giorni = parseFloat(document.getElementById('giorni').value);

    const values = { dieselConsumo, dieselCosto, benzinaConsumo, benzinaCosto, distanza, giorni };
    const invalid = Object.values(values).some(v => Number.isNaN(v) || v < 0);

    if (invalid) {
      return;
    }

    // GPL è opzionale: la sua sezione compare solo se sono presenti i dati benzina.
    let gplCosto = NaN;
    if (hasBenzinaData() && gplCostoInput.value.trim() !== '') {
      gplCosto = parseFloat(gplCostoInput.value);
      if (Number.isNaN(gplCosto) || gplCosto < 0) {
        return;
      }
    }

    currentData = computeCosts({ ...values, gplCosto });
    updateWinnerBadge(currentData);

    resultsSection.classList.remove('hidden');
    renderPeriod(currentPeriod);

    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => renderPeriod(tab.dataset.period));
  });

})();
