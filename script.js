(() => {
  'use strict';

  const form = document.getElementById('calc-form');
  const resultsSection = document.getElementById('results');

  const winnerBadge = document.getElementById('winner-badge');
  const winnerText = document.getElementById('winner-text');

  const dieselValueEl = document.getElementById('diesel-value');
  const benzinaValueEl = document.getElementById('benzina-value');
  const diffValueEl = document.getElementById('diff-value');

  const dieselBar = document.getElementById('diesel-bar');
  const benzinaBar = document.getElementById('benzina-bar');
  const dieselBarValue = document.getElementById('diesel-bar-value');
  const benzinaBarValue = document.getElementById('benzina-bar-value');
  const chartPeriodLabel = document.getElementById('chart-period-label');

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

  function computeCosts({ dieselConsumo, dieselCosto, benzinaConsumo, benzinaCosto, distanza, giorni }) {
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

    return {
      daily: { diesel: dailyDiesel, benzina: dailyBenzina },
      monthly: { diesel: monthlyDiesel, benzina: monthlyBenzina },
      annual: { diesel: annualDiesel, benzina: annualBenzina }
    };
  }

  function updateWinnerBadge(data) {
    // Winner is decided on the annual figures, the most representative horizon.
    const { diesel, benzina } = data.annual;
    const delta = Math.abs(diesel - benzina);

    winnerBadge.classList.remove('tie');

    if (Math.abs(diesel - benzina) < 0.01) {
      winnerBadge.classList.add('tie');
      winnerText.textContent = 'Diesel e benzina costano praticamente uguale';
      return;
    }

    if (diesel < benzina) {
      winnerText.textContent = `Il diesel conviene — risparmi ${currency.format(delta)} all'anno`;
    } else {
      winnerText.textContent = `La benzina conviene — risparmi ${currency.format(delta)} all'anno`;
    }
  }

  function renderPeriod(period) {
    if (!currentData) return;
    currentPeriod = period;

    const { diesel, benzina } = currentData[period];
    const maxVal = Math.max(diesel, benzina, 0.01);

    dieselValueEl.textContent = currency.format(diesel);
    benzinaValueEl.textContent = currency.format(benzina);
    diffValueEl.textContent = currency.format(Math.abs(diesel - benzina));

    chartPeriodLabel.textContent = PERIOD_LABELS[period];

    // Bar heights as % of the larger value, floor at 4% for visibility.
    const dieselPct = Math.max((diesel / maxVal) * 100, 4);
    const benzinaPct = Math.max((benzina / maxVal) * 100, 4);

    dieselBar.style.height = dieselPct + '%';
    benzinaBar.style.height = benzinaPct + '%';

    dieselBarValue.textContent = currency.format(diesel);
    benzinaBarValue.textContent = currency.format(benzina);

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

    currentData = computeCosts(values);
    updateWinnerBadge(currentData);

    resultsSection.classList.remove('hidden');
    renderPeriod(currentPeriod);

    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => renderPeriod(tab.dataset.period));
  });

})();
