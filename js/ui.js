// GenAI assistance is acknowledged in docs/AI-ACKNOWLEDGEMENT.md.
// Shared presentation helpers. All chart marks are drawn with D3 in charts.js.
import { CHARTS } from './config.js';

const ICONS = {
  home: '<path d="m3 10 9-7 9 7M6 9v12h5v-7h3v7h4V9"/>',
  chart: '<path d="M5 20V12m7 8V4m7 16V8"/>',
  book: '<path d="M12 5c-3-2-7-2-10 0v15c3-2 7-2 10 0 3-2 7-2 10 0V5c-3-2-7-2-10 0Zm0 0v15"/>',
  bed: '<path d="M3 5v16m0-5h18v5M6 12h15v4H3m5-9v4m-2-2h4m7-6v6m-3-3h6"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18M8 15h1m5 0h1m-7 3h1m5 0h1"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-11v1"/>',
  reset: '<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  close: '<path d="m5 5 14 14M19 5 5 19"/>',
  arrow: '<path d="m9 5 7 7-7 7"/>',
  expand:
    '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M8 8 3 3m13 5 5-5M8 16l-5 5m13-5 5 5"/>',
  car: '<path d="m5 10 2-6h10l2 6M3 10h18v9H3zm3 9v3m12-3v3M6 14h1m10 0h1"/>',
  location:
    '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
};

export function icon(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${ICONS[name] || ICONS.chart}</svg>`;
}

export function renderHeader(page) {
  const pages = [
    ['overview', 'index.html', 'Overview', 'home'],
    ['insights', 'insights.html', 'Insights', 'chart'],
    ['glossary', 'glossary.html', 'Glossary', 'book'],
  ];

  document.querySelector('.site-header').innerHTML = /* HTML */ `
    <svg
      class="header-ribbon"
      viewBox="0 0 850 130"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0 130C170 130 200 20 390 0H850V130Z" fill="#CCDFF1" opacity=".15" />
      <path d="M40 130C210 130 245 0 450 0H850V130Z" fill="#005EB8" opacity=".25" />
      <path d="M320 130C460 80 530 15 640 0H850V130Z" fill="#003087" opacity=".45" />
    </svg>
    <a class="brand" href="index.html" aria-label="Road crash dashboard overview">
      <svg class="brand-mark" viewBox="0 0 60 60" aria-hidden="true">
        <rect x="4" y="35" width="13" height="22" rx="4" fill="#dfc7ba" />
        <rect x="23" y="22" width="13" height="35" rx="4" fill="#dfc7ba" />
        <rect x="42" y="7" width="13" height="50" rx="4" fill="#9298c6" />
      </svg>
      <span class="brand-text">
        <strong>Road Crash Hospitalisation Dashboard</strong>
        <span>Interactive overview of injury statistics · Australia, 2011–2021</span>
      </span>
    </a>
    <nav aria-label="Main navigation">
      ${pages
        .map(
          ([id, file, name, image]) => `
        <a href="${file}" data-route="${id}" ${page === id ? 'aria-current="page"' : ''}>
          ${icon(image)}<span>${name}</span>
        </a>`,
        )
        .join('')}
    </nav>
  `;
}

export function renderCards(ids, expanded = false) {
  document.querySelector('.chart-grid').innerHTML = ids
    .map(
      (id) => /* HTML */ `
        <figure class="chart-card chart-${id}" data-chart="${id}">
          <div class="card-heading">
            <h2 id="title-${id}">${CHARTS[id].title}</h2>
            <div class="card-actions">
              ${expanded
                ? ''
                : `<a class="expand-chart" data-expand="${id}" href="chart.html?chart=${id}" aria-label="Expand ${CHARTS[id].title}" title="Expand this chart">${icon('expand')}</a>`}
              <button
                class="info-button"
                data-details="${id}"
                title="Information and data"
                aria-label="Information and data for ${CHARTS[id].title}"
              >
                ${icon('info')}
              </button>
            </div>
          </div>
          <p></p>
          <div id="chart-${id}" class="chart-host"></div>
          <div id="controls-${id}" class="chart-controls"></div>
        </figure>
      `,
    )
    .join('');
}

export function showTooltip(event, text) {
  const tip = document.querySelector('#tooltip');
  tip.textContent = text;
  tip.hidden = false;
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.type.startsWith('pointer')
    ? event.clientX
    : rect.left + rect.width / 2;
  const y = event.type.startsWith('pointer') ? event.clientY : rect.top;
  tip.style.left = `${Math.max(8, Math.min(innerWidth - tip.offsetWidth - 8, x + 10))}px`;
  tip.style.top = `${Math.max(8, Math.min(innerHeight - tip.offsetHeight - 8, y - tip.offsetHeight - 10))}px`;
  event.currentTarget.setAttribute('aria-describedby', 'tooltip');
}

export function hideTooltip() {
  document.querySelector('#tooltip').hidden = true;
  document
    .querySelectorAll('[aria-describedby="tooltip"]')
    .forEach((node) => node.removeAttribute('aria-describedby'));
}

export function interactive(selection, describe, select = null) {
  selection
    .attr('tabindex', 0)
    .attr('role', select ? 'button' : 'img')
    .attr('aria-label', describe)
    .classed('data-mark', true)
    .on('pointerenter', (event, value) => showTooltip(event, describe(value)))
    .on('pointerleave', hideTooltip)
    .on('focus', (event, value) => showTooltip(event, describe(value)))
    .on('blur', hideTooltip)
    .on('click', (event, value) => {
      if (select) {
        hideTooltip();
        select(value);
      } else showTooltip(event, describe(value));
    })
    .on('keydown', (event, value) => {
      if (event.key === 'Escape') hideTooltip();
      if (select && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        hideTooltip();
        select(value);
      }
    });
}

export function frame(id, margin) {
  const host = document.querySelector(`#chart-${id}`);
  host.replaceChildren();
  const width = host.clientWidth;
  const height = host.clientHeight;
  const svg = d3
    .select(host)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'group')
    .attr('aria-labelledby', `svg-title-${id} svg-description-${id}`);
  svg.append('title').attr('id', `svg-title-${id}`).text(CHARTS[id].title);
  svg.append('desc').attr('id', `svg-description-${id}`).text(CHARTS[id].info);
  const plot = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  return {
    svg,
    plot,
    width,
    height,
    innerWidth: Math.max(20, width - margin.left - margin.right),
    innerHeight: Math.max(20, height - margin.top - margin.bottom),
  };
}

export function emptyChart(
  id,
  message = 'No records match these filters. Try another selection or reset all filters.',
) {
  const host = document.querySelector(`#chart-${id}`);
  host.replaceChildren();
  const paragraph = document.createElement('p');
  paragraph.className = 'empty-chart';
  paragraph.setAttribute('role', 'status');
  paragraph.textContent = message;
  host.append(paragraph);
  document.querySelector(`#controls-${id}`).replaceChildren();
}

export function contrastText(fill) {
  const { r, g, b } = d3.rgb(fill);
  const linear = (value) =>
    value / 255 <= 0.04045
      ? value / 255 / 12.92
      : ((value / 255 + 0.055) / 1.055) ** 2.4;
  const light = 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
  return (light + 0.05) / 0.05 >= 1.05 / (light + 0.05) ? '#000' : '#fff';
}
