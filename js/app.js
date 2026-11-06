// GenAI-assisted rebuild requested on 4 November 2026.
// Student-friendly flow: build page -> load CSV -> filter records -> redraw D3 charts.
import {
  FILTERS,
  DEFAULT_FILTERS,
  PAGE_CHARTS,
  CHARTS,
  label,
  formatNumber,
  formatRatio,
} from './config.js';
import { validateRows, filterNational, totals, groupRows } from './data.js';
import { renderHeader, renderCards, icon, hideTooltip } from './ui.js';
import { renderChart } from './charts.js';
import { TERMS } from './glossary.js';

const page = document.body.dataset.page;
const filters = readFilters();
let sourceRows = [];
let geoData = null;
let activeChart = 0;
let glossaryPage = 0;
let detailPage = 0;
let detailChart = '';
let detailMode = 'info';
const tables = new Map();
const requestedChart = new URLSearchParams(location.search).get('chart');
const detailId = Object.hasOwn(CHARTS, requestedChart) ? requestedChart : 'annual';
const chartIds = page === 'detail' ? [detailId] : PAGE_CHARTS[page] || [];
const parentPage = PAGE_CHARTS.overview.includes(detailId) ? 'overview' : 'insights';

const chartUI = {
  matrixPage: 0,
  barPage: 0,
  select: selectFilter,
  selectMany(values) {
    Object.assign(filters, values);
    chartUI.matrixPage = 0;
    chartUI.barPage = 0;
    updateControls();
    redraw();
  },
  redraw,
};

function readFilters() {
  const query = new URLSearchParams(location.search);
  const result = { ...DEFAULT_FILTERS };
  for (const field of FILTERS) {
    const value = query.get(field.key);
    if (value === 'All' || field.values.map(String).includes(value))
      result[field.key] = value;
  }
  return result;
}

function updateNavigation() {
  const query = new URLSearchParams(filters).toString();
  const files = {
    overview: 'index.html',
    insights: 'insights.html',
    glossary: 'glossary.html',
  };
  document.querySelectorAll('[data-route]').forEach((link) => {
    link.href = `${files[link.dataset.route]}?${query}`;
  });
  document.querySelector('.brand').href = `index.html?${query}`;
  document.querySelectorAll('[data-expand]').forEach((link) => {
    link.href = `chart.html?chart=${link.dataset.expand}&${query}`;
  });
  const currentQuery = page === 'detail' ? `chart=${detailId}&${query}` : query;
  history.replaceState(null, '', `${location.pathname}?${currentQuery}`);
}

function buildFilters() {
  const form = document.querySelector('#filters');
  for (const field of FILTERS) {
    const control = document.createElement('div');
    control.className = 'filter-control';
    const caption = document.createElement('label');
    caption.htmlFor = `filter-${field.key}`;
    caption.textContent = field.label;
    const select = document.createElement('select');
    select.id = caption.htmlFor;
    select.name = field.key;
    select.add(new Option(field.all || 'All', 'All'));
    for (const value of field.values)
      select.add(new Option(label(value), String(value)));
    select.addEventListener('change', () => {
      filters[field.key] = select.value;
      chartUI.matrixPage = 0;
      chartUI.barPage = 0;
      updateControls();
      redraw();
    });
    control.append(caption, select);
    form.append(control);
  }
  form.addEventListener('submit', (event) => event.preventDefault());
  updateControls();
}

function updateControls() {
  for (const field of FILTERS) {
    const select = document.querySelector(`#filter-${field.key}`);
    if (!select) continue;
    select.value = filters[field.key];
    select.classList.toggle(
      'selected-filter',
      filters[field.key] !== 'All' && field.key !== 'year',
    );
    select.title = select.selectedOptions[0].textContent;
  }
  updateNavigation();
}

function selectFilter(field, value) {
  filters[field] = field === 'year' ? value : filters[field] === value ? 'All' : value;
  chartUI.matrixPage = 0;
  chartUI.barPage = 0;
  updateControls();
  redraw();
}

function buildDashboard() {
  document.querySelector('#main').innerHTML = /* HTML */ `
    <div class="page-context">
      <div>
        <h1>
          ${page === 'detail'
            ? CHARTS[detailId].question
            : page === 'overview'
              ? 'Overview'
              : 'Explore the hospital burden'}
          <span id="context-count"></span>
        </h1>
        <p>
          Year sets snapshots; trend lines retain 2011–2021. Other filters apply to
          every chart.
        </p>
      </div>
      <div class="page-actions">
        ${page === 'detail'
          ? `<a class="text-button back-link" data-route="${parentPage}" href="${parentPage === 'overview' ? 'index.html' : 'insights.html'}">Back to charts</a>`
          : ''}
        <button id="reset" class="text-button" aria-label="Reset all filters">
          ${icon('reset')}
          <span>Reset all</span>
        </button>
        <button
          id="download"
          class="icon-button"
          title="Download filtered national detail"
          aria-label="Download filtered national detail CSV"
        >
          ${icon('download')}
        </button>
      </div>
    </div>
    <div class="dashboard-shell ${page}">
      <aside class="metric-rail" aria-label="Matching data summary">
        <article class="metric-card primary-metric">
          <div class="metric-heading">
            <span class="metric-icon">${icon('bed')}</span>
            <h2>
              Hospitalised injuries
              <span class="metric-period"></span>
            </h2>
          </div>
          <strong id="total-count">—</strong>
          <p>Matching hospitalisations</p>
        </article>
        <article class="metric-card secondary-metric">
          <div class="metric-heading">
            <span class="metric-icon">${icon('calendar')}</span>
            <h2>
              Bed days per hospitalisation
              <span class="metric-period"></span>
            </h2>
          </div>
          <strong id="bed-ratio">—</strong>
          <p id="bed-total"></p>
        </article>
        <p class="summary-insight" id="summary-insight" aria-live="polite"></p>
      </aside>
      <section
        class="charts-area"
        aria-label="${page === 'overview' ? 'Overview charts' : 'Insights charts'}"
      >
        <div class="chart-switcher">
          <button id="chart-previous" aria-label="Previous chart">‹</button>
          <span id="chart-position"></span>
          <span id="chart-question"></span>
          <button id="chart-next" aria-label="Next chart">›</button>
        </div>
        <div class="chart-grid ${page}-grid"></div>
      </section>
    </div>
    <p id="load-status" role="status">Loading the supplied KNIME export…</p>
  `;
  renderCards(chartIds, page === 'detail');
  document.querySelector('#reset').onclick = () => {
    Object.assign(filters, DEFAULT_FILTERS);
    chartUI.matrixPage = 0;
    chartUI.barPage = 0;
    updateControls();
    redraw();
  };
  document.querySelector('#download').onclick = downloadData;
  document.querySelector('#chart-previous').onclick = () => {
    activeChart--;
    redraw();
  };
  document.querySelector('#chart-next').onclick = () => {
    activeChart++;
    redraw();
  };
  document.querySelectorAll('[data-details]').forEach((button) => {
    button.onclick = () => openDetails(button.dataset.details);
  });
}

function redraw() {
  if (page === 'glossary') {
    renderGlossary();
    return;
  }
  if (!sourceRows.length) return;
  hideTooltip();
  const snapshot = filterNational(sourceRows, filters);
  const history = filterNational(sourceRows, filters, false);
  const summary = totals(snapshot);
  const period = filters.year === 'All' ? '2011–2021' : filters.year;
  document.querySelector('#context-count').textContent =
    page === 'overview'
      ? ''
      : `${period} · ${formatNumber(summary.count)} hospitalisations`;

  document.querySelector('#total-count').textContent = formatNumber(summary.count);
  document.querySelector('#bed-ratio').textContent = formatRatio(summary.ratio);
  document
    .querySelector('#bed-ratio')
    .classList.toggle('unavailable', summary.ratio === null);
  document.querySelector('#bed-total').textContent =
    `${formatNumber(summary.beds)} reported bed days`;
  document.querySelectorAll('.metric-period').forEach((node) => {
    node.textContent = period;
  });
  const largest = groupRows(snapshot, 'age_group').sort((a, b) => b.count - a.count)[0];
  document.querySelector('#summary-insight').textContent =
    largest && summary.count > 0
      ? `${label(largest.key)} accounts for ${((largest.count / summary.count) * 100).toFixed(1)}% of the matching hospitalisations. Counts describe burden, not individual risk.`
      : 'No hospitalisations match this selection. Try another filter or reset all.';

  const compact = innerWidth <= 900;
  activeChart = Math.max(0, Math.min(chartIds.length - 1, activeChart));
  document.querySelector('#chart-position').textContent =
    `${activeChart + 1} / ${chartIds.length}`;
  document.querySelector('#chart-question').textContent =
    CHARTS[chartIds[activeChart]].question;
  document.querySelector('#chart-previous').disabled = activeChart === 0;
  document.querySelector('#chart-next').disabled = activeChart === chartIds.length - 1;

  chartIds.forEach((id, index) => {
    const card = document.querySelector(`[data-chart="${id}"]`);
    card.classList.toggle('visible-chart', !compact || index === activeChart);
    const temporal = ['annual', 'trends'].includes(id);
    document.querySelector(`#title-${id}`).textContent =
      `${CHARTS[id].title}, ${temporal ? '2011–2021' : period}`;
  });
  // Finish changing every card's visibility before measuring any SVG host.
  // Otherwise old visible cards can briefly consume the phone layout's height.
  chartIds.forEach((id, index) => {
    if (!compact || index === activeChart) {
      tables.set(id, renderChart(id, snapshot, history, filters, chartUI, sourceRows, geoData));
    }
  });
  updateNavigation();
}

function buildGlossary() {
  document.querySelector('#filters-shell').hidden = true;
  document.querySelector('#main').innerHTML = /* HTML */ `
    <section class="glossary-screen">
      <div class="glossary-heading">
        <div>
          <p class="eyebrow">Understand the data</p>
          <h1>Glossary & source notes</h1>
        </div>
        <p>Definitions, calculations and important limits behind the charts.</p>
      </div>
      <div class="glossary-grid"></div>
      <div class="glossary-pager">
        <button id="term-previous" class="text-button">‹ Previous</button>
        <span id="term-position" aria-live="polite"></span>
        <button id="term-next" class="text-button">Next ›</button>
      </div>
    </section>
  `;
  document.querySelector('#term-previous').onclick = () => {
    glossaryPage--;
    renderGlossary();
  };
  document.querySelector('#term-next').onclick = () => {
    glossaryPage++;
    renderGlossary();
  };
  renderGlossary();
}

function renderGlossary() {
  const perPage = innerWidth <= 900 ? 1 : innerHeight < 800 ? 4 : 6;
  const pageCount = Math.ceil(TERMS.length / perPage);
  glossaryPage = Math.max(0, Math.min(pageCount - 1, glossaryPage));
  const grid = document.querySelector('.glossary-grid');
  grid.style.setProperty('--term-rows', String(perPage / 2));
  grid.innerHTML = TERMS.slice(glossaryPage * perPage, (glossaryPage + 1) * perPage)
    .map(
      (term) => /* HTML */ `
        <article class="term-card">
          <span class="term-icon">${icon(term.icon)}</span>
          <div>
            <h2>${term.title}</h2>
            <p>${term.text}</p>
            ${term.link
              ? `<a href="${term.link}" ${term.link.startsWith('https:') ? 'target="_blank" rel="noreferrer"' : 'download'}>${term.linkText} ↗</a>`
              : ''}
          </div>
        </article>
      `,
    )
    .join('');
  document.querySelector('#term-position').textContent =
    `${glossaryPage + 1} / ${pageCount}`;
  document.querySelector('#term-previous').disabled = glossaryPage === 0;
  document.querySelector('#term-next').disabled = glossaryPage === pageCount - 1;
}

function openDetails(id) {
  detailChart = id;
  detailPage = 0;
  detailMode = 'info';
  document.querySelector('#details-title').textContent = CHARTS[id].title;
  document.querySelector('#details-info').textContent = CHARTS[id].info;
  renderDetails();
  document.querySelector('#details').showModal();
}

function renderDetails() {
  const dataMode = detailMode === 'data';
  document.querySelector('#details-info').hidden = dataMode;
  document.querySelector('#details-data').hidden = !dataMode;
  document.querySelector('#details-pager').hidden = !dataMode;
  document.querySelectorAll('[data-detail-mode]').forEach((button) => {
    button.setAttribute(
      'aria-pressed',
      String(button.dataset.detailMode === detailMode),
    );
  });
  if (!dataMode) return;
  const data = tables.get(detailChart) || { headers: [], rows: [] };
  const perPage = Math.max(2, Math.min(8, Math.floor((innerHeight - 360) / 48)));
  const pages = Math.max(1, Math.ceil(data.rows.length / perPage));
  detailPage = Math.max(0, Math.min(pages - 1, detailPage));
  const host = document.querySelector('#details-data');
  host.replaceChildren();
  if (!data.rows.length) {
    host.textContent = 'No matching records.';
  } else {
    const table = document.createElement('table');
    const caption = table.createCaption();
    caption.textContent = `Exact matching values. Page ${detailPage + 1} of ${pages}.`;
    const header = table.createTHead().insertRow();
    data.headers.forEach((name) => {
      const cell = document.createElement('th');
      cell.scope = 'col';
      cell.textContent = name;
      header.append(cell);
    });
    const body = table.createTBody();
    data.rows.slice(detailPage * perPage, (detailPage + 1) * perPage).forEach((row) => {
      const tr = body.insertRow();
      row.forEach((value, index) => {
        const cell = document.createElement(index === 0 ? 'th' : 'td');
        if (index === 0) cell.scope = 'row';
        cell.textContent =
          value == null
            ? '—'
            : typeof value === 'number' && data.headers[index] !== 'Year'
              ? formatNumber(value)
              : String(value);
        tr.append(cell);
      });
    });
    host.append(table);
  }
  document.querySelector('#details-position').textContent =
    `${detailPage + 1} / ${pages}`;
  document.querySelector('#details-previous').disabled = detailPage === 0;
  document.querySelector('#details-next').disabled = detailPage === pages - 1;
}

function downloadData() {
  const rows = filterNational(sourceRows, filters);
  const columns = [
    'year',
    'remoteness',
    'age_group',
    'sex',
    'road_user',
    'counterparty',
    'hospitalisations',
    'bed_days',
  ];
  const url = URL.createObjectURL(
    new Blob([d3.csvFormat(rows, columns)], { type: 'text/csv;charset=utf-8' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = `road-crash-filtered-${filters.year === 'All' ? '2011-2021' : filters.year}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Start the shared layout and wire controls before loading the data.
renderHeader(page === 'detail' ? parentPage : page);
updateNavigation();
document.querySelector('#details-close').innerHTML = icon('close');
document.querySelector('#details-close').onclick = () =>
  document.querySelector('#details').close();
document.querySelectorAll('[data-detail-mode]').forEach((button) => {
  button.onclick = () => {
    detailMode = button.dataset.detailMode;
    detailPage = 0;
    renderDetails();
  };
});
document.querySelector('#details-previous').onclick = () => {
  detailPage--;
  renderDetails();
};
document.querySelector('#details-next').onclick = () => {
  detailPage++;
  renderDetails();
};

if (page === 'glossary') {
  buildGlossary();
} else {
  buildFilters();
  buildDashboard();
  try {
    const rawRows = await d3.csv('data/road_crash_master.csv');
    sourceRows = validateRows(rawRows);
    
    geoData = await d3.json('https://raw.githubusercontent.com/rowanhogan/australian-states/master/states.geojson');
    
    document.querySelector('#load-status').hidden = true;
    redraw();
  } catch (error) {
    document.querySelector('#load-status').textContent =
      `The data could not be loaded: ${error.message}`;
    document.querySelector('#load-status').classList.add('load-error');
  }
}

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    redraw();
    if (document.querySelector('#details').open) renderDetails();
  }, 100);
});
