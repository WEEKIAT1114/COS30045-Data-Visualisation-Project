// GenAI-assisted implementation of the user's four-panel wireframe.
import { PAGES } from './navigation.js';
import { INFO as BASE_INFO } from './notes.js';
export const CHARTS = [
  {
    id: 'decade',
    host: 'national-chart',
    title: 'Annual hospitalisations',
    question: 'How has the count changed?',
  },
  {
    id: 'age',
    host: 'age-chart',
    title: 'Hospitalisations by age group',
    question: 'Which ages account for admissions?',
  },
  {
    id: 'matrix',
    host: 'heatmap-chart',
    title: 'Age × road user',
    question: 'How do age and road user intersect?',
  },
  {
    id: 'road',
    host: 'road-chart',
    title: 'Trends by road user',
    question: 'Do road users follow the same pattern?',
  },
];
const pager = (name, label) => /* HTML */ `
  <div class="pager" aria-label="${label}">
    <button type="button" id="${name}-prev" aria-label="Previous ${label}">←</button>
    <span id="${name}-range" aria-live="polite"></span>
    <button type="button" id="${name}-next" aria-label="Next ${label}">→</button>
  </div>
`;

function filters() {
  return /* HTML */ `
    <form class="filter-grid" aria-label="Shared chart filters">
      <div class="control">
        <label for="year-select">Snapshot year</label>
        <select id="year-select"></select>
      </div>
      <div class="control">
        <label for="remoteness-select">Remoteness</label>
        <select id="remoteness-select"></select>
      </div>
      <div class="control">
        <label for="age-select">Age group</label>
        <select id="age-select"></select>
      </div>
      <div class="control">
        <label for="sex-select">Sex</label>
        <select id="sex-select"></select>
      </div>
      <div class="control">
        <label for="road-select">Road user</label>
        <select id="road-select"></select>
      </div>
      <button id="reset" class="reset-button" type="button">Reset all ↺</button>
    </form>
  `;
}

function tile(chart, full = false) {
  const mode =
    chart.id === 'matrix'
      ? /* HTML */ `
          <div class="segmented" role="group" aria-label="Heatmap measure">
            <button type="button" data-matrix="count">Count</button>
            <button type="button" data-matrix="share">Age share</button>
          </div>
        `
      : chart.id === 'road'
        ? /* HTML */ `
            <div class="segmented" role="group" aria-label="Road-user trend measure">
              <button type="button" data-trend="count">Count</button>
              <button type="button" data-trend="index">2011 = 100</button>
            </div>
          `
        : '';
  return /* HTML */ `
    <figure class="chart-card card-${chart.id}" data-chart="${chart.id}">
      <div class="chart-topline">
        <h2>${chart.title}</h2>
        <div class="card-actions">
          ${mode}
          <a
            data-page="table"
            data-view="${chart.id}"
            href="table.html"
            aria-label="Data table for ${chart.title}"
          >
            Data
          </a>
          ${full
            ? /* HTML */ `
                <a data-page="home" href="index.html">Dashboard ↗</a>
              `
            : /* HTML */ `
                <a
                  class="expand"
                  data-page="${chart.id}"
                  href="#"
                  aria-label="Expand ${chart.title}"
                >
                  ↗
                </a>
              `}
        </div>
      </div>
      <p class="chart-subtitle" id="${chart.id}-context"></p>
      ${chart.id === 'matrix'
        ? /* HTML */ `
            <div class="heatmap-key">
              <span id="heatmap-legend-title"></span>
              <span class="legend-ramp" aria-hidden="true"></span>
              <span id="heatmap-legend-range"></span>
              <span class="missing-key">—: no record · n/a: no share</span>
            </div>
          `
        : ''}
      <div id="${chart.host}" class="chart-host"></div>
      ${chart.id === 'matrix'
        ? /* HTML */ `
            <div class="matrix-bottom">
              ${pager('matrix', 'matrix view')}
              <span class="matrix-note">Shares use all matching road users.</span>
            </div>
          `
        : chart.id === 'road'
          ? /* HTML */ `
              <div
                id="road-legend"
                class="series-legend"
                role="group"
                aria-label="Filter to a plotted road user"
              ></div>
            `
          : `${
              chart.id === 'decade'
                ? /* HTML */ `
                    <figcaption>
                      Dashed boundaries: admission-policy changes in 2012 and 2017.
                    </figcaption>
                  `
                : /* HTML */ `
                    <div class="age-bottom">
                      ${pager('age', 'age groups')}
                      <span class="age-note">
                        Unequal age bands; counts are not risk.
                      </span>
                    </div>
                  `
            }`}
    </figure>
  `;
}

function analytics(page) {
  const full = page !== 'home',
    chart = CHARTS.find((c) => c.id === page);
  return /* HTML */ `
    <section class="analytics-screen ${full ? 'detail-screen' : ''}">
      <div class="dashboard-context">
        <div>
          <h1>${full ? chart.question : 'Hospitalised injuries from road crashes'}</h1>
          <p id="filter-summary" aria-live="polite"></p>
        </div>
        <div class="snapshot-metric">
          <strong id="snapshot-total"></strong>
          <span id="snapshot-label"></span>
        </div>
      </div>
      <div class="scope-note">
        <span>
          Year: snapshot/highlight. Trends: 2011–2021. Other filters apply to all
          charts.
        </span>
        <a data-page="about" data-topic="limits" href="about.html">
          Data limitations ↗
        </a>
      </div>
      ${full
        ? ''
        : /* HTML */ `
            <div class="chart-switcher">
              ${pager('chart', 'dashboard chart')}
              <span id="chart-question"></span>
            </div>
          `}
      <div class="dashboard-grid ${full ? 'single-chart' : ''}">
        ${full ? tile(chart, true) : CHARTS.map((c) => tile(c)).join('')}
      </div>
      <p class="dashboard-insight" id="dashboard-insight" aria-live="polite"></p>
    </section>
  `;
}

function notesPage(page) {
  const glossary = page === 'glossary';
  const topics = glossary
    ? [
        ['measures', 'Measures'],
        ['dimensions', 'Data fields'],
        ['limits', 'Interpretation'],
      ]
    : [
        ['source', 'Data scope'],
        ['limits', 'Limitations'],
        ['references', 'References'],
        ['accessibility', 'Accessibility'],
      ];
  return /* HTML */ `
    <section class="info-screen">
      <div class="page-heading">
        <p class="eyebrow">
          ${glossary ? 'UNDERSTAND THE DASHBOARD' : 'SOURCES & METHODS'}
        </p>
        <h1>${glossary ? 'Glossary' : 'Know what is being counted.'}</h1>
        <p>
          ${glossary
            ? 'Definitions and interpretation for the hospitalisation data.'
            : 'BITRE national release, September 2023 · AIHW National Hospital Morbidity Database.'}
        </p>
      </div>
      <nav class="info-tabs" aria-label="${glossary ? 'Glossary' : 'Source'} topics">
        ${topics
          .map(
            ([id, label]) => /* HTML */ `
              <button type="button" data-topic="${id}">${label}</button>
            `,
          )
          .join('')}
      </nav>
      <div id="info-stage" class="info-stage"></div>
      <div class="info-bottom">
        ${pager('info', 'notes')}
        <a href="data/road_crash_master.csv" download>Download the count data ↓</a>
      </div>
    </section>
  `;
}

function rates() {
  return /* HTML */ `
    <section class="rates-screen">
      <div class="page-heading">
        <p class="eyebrow">HOSPITALISED INJURY RATES</p>
        <h1>Population data are needed for rates.</h1>
        <p>
          The supplied CSV supports the count dashboard. A valid population denominator
          is not included.
        </p>
      </div>
      <div class="rates-grid">
        <article class="rate-card" data-rate="0">
          <span class="status-label">01 / CURRENT DATA</span>
          <h2>Counts are available.</h2>
          <p>
            Year, remoteness, age group, sex and road user can filter the four count
            charts. No additional KNIME export is needed for these filters.
          </p>
          <a class="primary-link" data-page="home" href="index.html">
            Explore hospitalisations ↗
          </a>
        </article>
        <article class="rate-card" data-rate="1">
          <span class="status-label">02 / NEXT DATASET</span>
          <h2>A matching denominator.</h2>
          <p>
            Use population by the same year, remoteness, age group and sex. Combined
            filters need joint population records; separate marginal tables are
            insufficient.
          </p>
          <p class="formula">Rate = hospitalisations ÷ matching population × 100,000</p>
        </article>
        <article class="rate-card" data-rate="2">
          <span class="status-label">03 / KNIME EXPORT</span>
          <h2>Keep the source definitions.</h2>
          <p>Suggested population CSV:</p>
          <code class="population-schema">
            year, remoteness, age_group, sex, population
          </code>
          <p>
            Retain source metadata, the reference date and processing steps. Population
            rates measure burden per resident. Road-user exposure risk needs travel or
            usage denominators.
          </p>
        </article>
      </div>
      <div class="rates-bottom">
        <div class="rates-paging">${pager('rates', 'rates note')}</div>
        <a data-page="about" data-topic="limits" href="about.html">
          Definitions and limits ↗
        </a>
      </div>
    </section>
  `;
}

function tablePage() {
  return /* HTML */ `
    <section class="table-screen">
      <div class="page-heading table-title">
        <div>
          <p class="eyebrow">FILTERED DATA</p>
          <h1>Exact values behind the charts</h1>
        </div>
        <a data-page="home" href="index.html">Back to dashboard ↗</a>
      </div>
      <div class="table-controls">
        <label for="table-view">Table</label>
        <select id="table-view">
          <option value="decade">Annual hospitalisations</option>
          <option value="age">Age groups</option>
          <option value="matrix">Age × road user</option>
          <option value="road">Road users</option>
        </select>
        <span id="filter-summary"></span>
      </div>
      <div id="data-table" class="table-stage"></div>
      <div class="table-bottom">
        ${pager('table', 'table rows')}
        <a href="data/road_crash_master.csv" download>Download full CSV ↓</a>
      </div>
    </section>
  `;
}

export function mountPage(page) {
  const analytical = ['home', 'decade', 'age', 'road', 'matrix'].includes(page),
    hasFilters = analytical || page === 'table';
  document.getElementById('app').innerHTML = /* HTML */ `
    <a class="skip-link" href="#main">Skip to charts and page content</a>
    <header class="site-header">
      <a class="brand" data-page="home" href="index.html">
        <span class="brand-icon" aria-hidden="true">┆</span>
        <span>
          <strong>
            ROAD INJURY
            <span>AUSTRALIA</span>
          </strong>
          <small>Hospitalised road crash injuries · 2011–2021</small>
        </span>
      </a>
      <span class="course-label">
        COS30045
        <span>/</span>
        GROUP 3
      </span>
    </header>
    <nav class="main-nav" aria-label="Page navigation">
      ${PAGES.map(
        (p) => /* HTML */ `
          <a
            data-page="${p.id}"
            href="${p.file}"
            ${(p.id === 'home' && analytical) || p.id === page
              ? 'aria-current="page"'
              : ''}
          >
            <span class="nav-full">${p.label}</span>
            <span class="nav-short">${p.short}</span>
            ${p.id === 'rates'
              ? /* HTML */ `
                  <span class="nav-badge">Data needed</span>
                `
              : ''}
          </a>
        `,
      ).join('')}
    </nav>
    <div class="filters-shell">${hasFilters ? filters() : ''}</div>
    <main id="main" tabindex="-1">
      ${analytical
        ? analytics(page)
        : page === 'rates'
          ? rates()
          : page === 'table'
            ? tablePage()
            : notesPage(page)}
      <p id="load-status" class="load-message" role="status">
        Loading the verified KNIME export…
      </p>
    </main>
    <footer class="site-footer">
      <span>BITRE · AIHW · September 2023 release</span>
      <span class="footer-links">
        <a data-page="about" href="about.html">Sources & methods</a>
        <a data-page="glossary" href="glossary.html">Glossary</a>
      </span>
    </footer>
    <div id="tooltip" role="tooltip" hidden></div>
    <div id="chart-announcer" class="sr-only" aria-live="polite"></div>
  `;
}
export const INFO = {
  ...BASE_INFO,
  measures: [
    {
      title: 'Hospitalised injuries',
      html: /* HTML */ `
        <p>
          Source-defined road traffic injury cases resulting in admission to hospital,
          excluding its in-hospital death cases. Transfers and other care episodes are
          handled by source rules to reduce duplication. These are not counts of crashes
          or necessarily distinct people.
        </p>
      `,
    },
    {
      title: 'Counts, shares and indices',
      html: /* HTML */ `
        <p>
          A count is the number of matching hospitalisations. An age-group share divides
          a cell by that group’s matching total, including road users on other matrix
          views. Index mode divides each plotted road user’s count by its own filtered
          2011 count and multiplies by 100. No baseline means no index.
        </p>
      `,
    },
    {
      title: 'Rates and risk',
      html: /* HTML */ `
        <p>
          A rate per 100,000 residents needs a compatible population denominator.
          Counts, shares and indices are not substitutes for rates. Population rates do
          not account for distance travelled or time spent as each road-user type.
        </p>
      `,
    },
  ],
  dimensions: [
    {
      title: 'Year and age',
      html: /* HTML */ `
        <p>
          The source reports calendar years of separation, 2011–2021. The year filter
          selects the bar/matrix snapshot and the highlighted trend points; the trend
          lines keep the full period. Age is at admission. The age bands have unequal
          spans and 75+ is open-ended.
        </p>
      `,
    },
    {
      title: 'Remoteness and sex',
      html: /* HTML */ `
        <p>
          Remoteness is the patient’s usual residence: Major Cities, Regional, Remote,
          or Missing (other/unknown residence). It is not the crash location. Sex
          includes Female, Male, and the combined intersex/indeterminate/missing
          category. All source categories remain available.
        </p>
      `,
    },
    {
      title: 'Road user and absent cells',
      html: /* HTML */ `
        <p>
          Road user describes the injured party’s role at the time of injury; all 12
          categories are preserved. “All” includes the complete dimension. An explicit
          recorded zero is 0; an absent combination is shown as — and is not silently
          imputed as zero.
        </p>
      `,
    },
  ],
};
