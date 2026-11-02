// Shared SVG scaffolding, native table alternatives, and multimodal detail on demand.
// GenAI-assisted; accessibility choices are explained in docs/DESIGN-RATIONALE.md.
import { number } from './constants.js';

// Resolve the same CSS tokens used by controls, legends and chart panels.

export function themeColor(token) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${token}`)
    .trim();
}

export function frame(id, title, description, height, margin, minWidth = 0) {
  const d3 = globalThis.d3;
  const host = document.getElementById(id);
  const width = Math.max(minWidth, Math.round(host.clientWidth || 600));
  // Each chart uses its allocated viewport panel, preserving readable font sizes.
  height = Math.max(
    margin.top + margin.bottom + 25,
    Math.round(host.clientHeight || height),
  );
  const svg = d3
    .select(host)
    .selectAll('svg')
    .data([null])
    .join('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'group')
    .attr('aria-labelledby', `${id}-title ${id}-desc`);
  svg
    .selectAll('title')
    .data([title])
    .join('title')
    .attr('id', `${id}-title`)
    .text((d) => d);
  svg
    .selectAll('desc')
    .data([description])
    .join('desc')
    .attr('id', `${id}-desc`)
    .text((d) => d);
  const plot = svg
    .selectAll('g.plot')
    .data([null])
    .join('g')
    .attr('class', 'plot')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  return {
    svg,
    plot,
    width,
    height,
    iw: width - margin.left - margin.right,
    ih: height - margin.top - margin.bottom,
  };
}

export function group(parent, name) {
  return parent.selectAll(`g.${name}`).data([null]).join('g').attr('class', name);
}

export function axes(
  plot,
  x,
  y,
  iw,
  ih,
  { years = false, small = false, yFormat = null } = {},
) {
  const d3 = globalThis.d3;
  group(plot, 'grid')
    .attr('aria-hidden', 'true')
    .call(d3.axisLeft(y).ticks(4).tickSize(-iw).tickFormat(''));
  group(plot, 'axis-x')
    .classed('axis', true)
    .attr('aria-hidden', 'true')
    .attr('transform', `translate(0,${ih})`)
    .call(
      d3
        .axisBottom(x)
        .tickValues(
          years
            ? small
              ? [2011, 2013, 2015, 2017, 2019, 2021]
              : d3.range(2011, 2022)
            : null,
        )
        .tickFormat(years ? d3.format('d') : null)
        .tickSizeOuter(0)
        .tickPadding(10),
    );
  const ya = d3.axisLeft(y).ticks(4).tickSize(0).tickPadding(10);
  if (yFormat) ya.tickFormat(yFormat);
  group(plot, 'axis-y')
    .classed('axis', true)
    .attr('aria-hidden', 'true')
    .call(ya)
    .select('.domain')
    .remove();
}

export function breakMarkers(plot, x, ih) {
  const d3 = globalThis.d3;
  const breaks = group(plot, 'series-breaks')
    .attr('aria-hidden', 'true')
    .selectAll('g.break')
    .data([2011.5, 2016.5])
    .join('g')
    .attr('class', 'break');
  breaks
    .selectAll('line')
    .data((d) => [d])
    .join('line')
    .attr('x1', x)
    .attr('x2', x)
    .attr('y1', 0)
    .attr('y2', ih)
    .attr('stroke', themeColor('chart-policy'))
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '3 4');
  breaks
    .selectAll('text')
    .data((d) => [d])
    .join('text')
    .attr('x', (d) => x(d) + 5)
    .attr('y', -12)
    .attr('class', 'chart-label')
    .style('font-size', '10px')
    .text((d) => (d < 2012 ? '2012 policy change' : '2017 policy change'));
}

export function phases(values) {
  return [
    values.filter((d) => d.year === 2011),
    values.filter((d) => d.year >= 2012 && d.year < 2017),
    values.filter((d) => d.year >= 2017),
  ];
}

export function hideTooltip() {
  const tip = document.getElementById('tooltip');
  tip.hidden = true;
  document
    .querySelectorAll('[aria-describedby="tooltip"]')
    .forEach((node) => node.removeAttribute('aria-describedby'));
}

export function showTooltip(event, text) {
  const tip = document.getElementById('tooltip');
  tip.textContent = text;
  tip.hidden = false;
  const rect = event.currentTarget.getBoundingClientRect();
  const px = event.type.startsWith('pointer')
    ? event.clientX
    : rect.left + rect.width / 2;
  const py = event.type.startsWith('pointer') ? event.clientY : rect.top;
  const left = Math.max(8, Math.min(window.innerWidth - tip.offsetWidth - 8, px + 12));
  const top = Math.max(
    8,
    Math.min(window.innerHeight - tip.offsetHeight - 8, py - tip.offsetHeight - 12),
  );
  tip.style.left = `${left}px`;
  tip.style.top = `${top}px`;
  event.currentTarget.setAttribute('aria-describedby', 'tooltip');
}

export function interactive(selection, label, activate = null) {
  // Identical detail and selection for pointer and keyboard; do not override arrow keys.
  selection
    .attr('tabindex', 0)
    .attr('role', activate ? 'button' : 'img')
    .attr('aria-label', label)
    .on('pointerenter.detail', function (event, d) {
      showTooltip(event, label(d));
    })
    .on('pointerleave.detail', hideTooltip)
    .on('focus.detail', function (event, d) {
      showTooltip(event, label(d));
    })
    .on('blur.detail', hideTooltip)
    .on('keydown.detail', function (event, d) {
      if (event.key === 'Escape') hideTooltip();
      if (activate && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        hideTooltip();
        activate(d);
      }
    })
    .on('click.detail', function (event, d) {
      showTooltip(event, label(d));
      if (activate) activate(d);
    });
  return selection;
}

export function table(id, caption, headers, rows) {
  const d3 = globalThis.d3;
  const el = d3.select(`#${id}`).selectAll('table').data([null]).join('table');
  el.selectAll('caption')
    .data([caption])
    .join('caption')
    .text((d) => d);
  el.selectAll('thead')
    .data([null])
    .join('thead')
    .selectAll('tr')
    .data([headers])
    .join('tr')
    .selectAll('th')
    .data((d) => d)
    .join('th')
    .attr('scope', 'col')
    .text((d) => d);
  // Matrix rows repeat the age label; include the road-user column in the key.
  const tr = el
    .selectAll('tbody')
    .data([null])
    .join('tbody')
    .selectAll('tr')
    .data(rows, (d) => JSON.stringify(d.slice(0, 2)))
    .join('tr');
  tr.each(function (row) {
    const node = d3.select(this);
    node
      .selectAll('th')
      .data([row[0]])
      .join('th')
      .attr('scope', 'row')
      .text((d) => d);
    node
      .selectAll('td')
      .data(row.slice(1))
      .join('td')
      .text((d) => (typeof d === 'number' ? number(d) : (d ?? '—')));
  });
}

export function textContrast(fill) {
  const color = globalThis.d3.rgb(fill);
  const lin = (v) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const light = 0.2126 * lin(color.r) + 0.7152 * lin(color.g) + 0.0722 * lin(color.b);
  // Pick the greater WCAG contrast ratio; one of white/near-black exceeds 4.5 here.
  return (light + 0.05) / 0.05 >= 1.05 / (light + 0.05) ? '#000000' : '#ffffff';
}
