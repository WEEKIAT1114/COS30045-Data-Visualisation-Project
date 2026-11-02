// GenAI-assisted direct D3 chart construction. Shared filters are applied before aggregation.
import {
  YEARS,
  ROAD_USERS,
  SERIES_STYLES,
  compactRoadLabel,
  number,
  percent,
  ageLabel,
} from './constants.js';
import {
  frame,
  group,
  axes,
  breakMarkers,
  phases,
  interactive,
  textContrast,
  themeColor,
} from './ui.js';

const styleFor = (user) => {
  const i = ROAD_USERS.indexOf(user);
  return { ...SERIES_STYLES[i % 4], color: themeColor(`series-${i + 1}`) };
};

function empty(id, message) {
  const d3 = globalThis.d3,
    host = d3.select(`#${id}`);
  host.selectAll('svg').remove();
  host
    .selectAll('div.empty-chart')
    .data([message])
    .join('div')
    .attr('class', 'empty-chart')
    .attr('role', 'status')
    .text((d) => d);
}

function ready(id) {
  globalThis.d3.select(`#${id}`).selectAll('.empty-chart').remove();
}

function lineAxes(plot, x, y, iw, ih) {
  const d3 = globalThis.d3;
  axes(plot, x, y, iw, ih, { years: true, small: true, yFormat: d3.format('~s') });
  if (iw < 270)
    group(plot, 'axis-x').call(
      d3
        .axisBottom(x)
        .tickValues([2011, 2016, 2021])
        .tickFormat(d3.format('d'))
        .tickSizeOuter(0)
        .tickPadding(7),
    );
  group(plot, 'axis-y')
    .call(
      d3.axisLeft(y).ticks(3).tickSize(0).tickPadding(7).tickFormat(d3.format('~s')),
    )
    .select('.domain')
    .remove();
}

export function drawNational(model, state, setYear) {
  const d3 = globalThis.d3,
    values = YEARS.map((year) => ({ year, value: model.annual.get(year) ?? null }));
  if (values.every((d) => d.value == null))
    return empty(
      'national-chart',
      'No records match these filters. Try resetting a filter.',
    );
  ready('national-chart');
  const { plot, iw, ih } = frame(
    'national-chart',
    'Annual hospitalised road crash injuries, filtered',
    `2011–2021 history under the selected remoteness, age, sex and road-user filters. Snapshot year ${state.year}. Policy breaks in 2012 and 2017.`,
    220,
    { top: 25, right: 18, bottom: 26, left: 44 },
  );
  const x = d3.scaleLinear().domain([2011, 2021]).range([0, iw]);
  const y = d3
    .scaleLinear()
    .domain([0, Math.max(10, (d3.max(values, (d) => d.value) || 0) * 1.1)])
    .range([ih, 0])
    .nice();
  lineAxes(plot, x, y, iw, ih);
  breakMarkers(plot, x, ih);
  const line = d3
    .line()
    .defined((d) => d.value != null)
    .x((d) => x(d.year))
    .y((d) => y(d.value));
  group(plot, 'trend-lines')
    .attr('aria-hidden', 'true')
    .selectAll('path')
    .data(phases(values))
    .join('path')
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', themeColor('accent'))
    .attr('stroke-width', 2);
  group(plot, 'selected-year')
    .attr('aria-hidden', 'true')
    .selectAll('line')
    .data([state.year])
    .join('line')
    .attr('x1', x)
    .attr('x2', x)
    .attr('y1', 0)
    .attr('y2', ih)
    .attr('stroke', themeColor('accent'))
    .attr('stroke-opacity', 0.25);
  const points = group(plot, 'points')
    .selectAll('g.point')
    .data(
      values.filter((d) => d.value != null),
      (d) => d.year,
    )
    .join('g')
    .attr('class', 'point')
    .attr('transform', (d) => `translate(${x(d.year)},${y(d.value)})`);
  points
    .selectAll('circle.hit')
    .data((d) => [d])
    .join('circle')
    .attr('class', 'hit')
    .attr('r', 11)
    .attr('fill', 'transparent');
  points
    .selectAll('circle.dot')
    .data((d) => [d])
    .join('circle')
    .attr('class', 'dot')
    .attr('r', (d) => (d.year === state.year ? 5 : 2.8))
    .attr('fill', (d) =>
      d.year === state.year ? themeColor('accent') : themeColor('surface'),
    )
    .attr('stroke', themeColor('accent'))
    .attr('stroke-width', 1.7);
  interactive(
    points,
    (d) =>
      `${d.year}: ${number(d.value)} matching hospitalisations. Select this snapshot year.`,
    (d) => setYear(d.year),
  ).attr('aria-pressed', (d) => d.year === state.year);
  group(plot, 'selected-label')
    .attr('aria-hidden', 'true')
    .selectAll('text')
    .data(values.filter((d) => d.year === state.year && d.value != null))
    .join('text')
    .attr('class', 'point-label')
    .attr('x', (d) => x(d.year))
    .attr('y', (d) => Math.max(10, y(d.value) - 10))
    .attr('text-anchor', (d) =>
      d.year === 2011 ? 'start' : d.year === 2021 ? 'end' : 'middle',
    )
    .text((d) => number(d.value));
}

export function drawAge(model, state) {
  const d3 = globalThis.d3,
    all = model.ageData(state.year),
    values = state.ageRows || all;
  if (!values.length)
    return empty(
      'age-chart',
      `No records match these filters in ${state.year}. Try another snapshot or reset a filter.`,
    );
  ready('age-chart');
  const { plot, iw, ih } = frame(
    'age-chart',
    `Hospitalisations by age group, ${state.year}`,
    `Filtered snapshot. Bars use chronological age order and a zero baseline. Unequal age spans and population sizes limit risk comparisons.`,
    220,
    { top: 3, right: 49, bottom: 26, left: 60 },
  );
  const total = d3.sum(all, (d) => d.value),
    max = d3.max(all, (d) => d.value) || 0;
  const x = d3
    .scaleLinear()
    .domain([0, Math.max(10, max)])
    .range([0, iw])
    .nice();
  const y = d3
    .scaleBand()
    .domain(values.map((d) => d.age))
    .range([0, ih])
    .padding(0.21);
  group(plot, 'age-grid')
    .classed('grid', true)
    .attr('aria-hidden', 'true')
    .attr('transform', `translate(0,${ih})`)
    .call(d3.axisBottom(x).ticks(3).tickSize(-ih).tickFormat(''));
  group(plot, 'age-x')
    .classed('axis', true)
    .attr('aria-hidden', 'true')
    .attr('transform', `translate(0,${ih})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(3)
        .tickFormat(d3.format('~s'))
        .tickSizeOuter(0)
        .tickPadding(7),
    );
  group(plot, 'age-y')
    .classed('axis', true)
    .attr('aria-hidden', 'true')
    .call(
      d3
        .axisLeft(y)
        .tickSize(0)
        .tickPadding(8)
        .tickFormat((d) => (d === 'Missing' ? 'Unknown' : d)),
    )
    .select('.domain')
    .remove();
  const bars = group(plot, 'bars')
    .selectAll('rect')
    .data(values, (d) => d.age)
    .join('rect')
    .attr('x', 0)
    .attr('y', (d) => y(d.age))
    .attr('height', y.bandwidth())
    .attr('width', (d) => x(d.value))
    .attr('fill', (d) =>
      d.value === max ? themeColor('accent') : themeColor('lavender'),
    )
    .attr('stroke', themeColor('accent'))
    .attr('stroke-width', 1);
  interactive(
    bars,
    (d) =>
      `${ageLabel(d.age)} years: ${number(d.value)} hospitalisations${total > 0 ? `, ${percent(d.value / total)} of the filtered snapshot` : ''}.`,
  );
  group(plot, 'value-labels')
    .attr('aria-hidden', 'true')
    .selectAll('text')
    .data(values, (d) => d.age)
    .join('text')
    .attr('class', 'point-label')
    .attr('x', (d) => x(d.value) + 6)
    .attr('y', (d) => y(d.age) + y.bandwidth() / 2)
    .attr('dominant-baseline', 'middle')
    .text((d) => number(d.value));
}

export function roadSeries(model, state) {
  if (state.road !== 'All') return [state.road];
  const d3 = globalThis.d3;
  return ROAD_USERS.filter((user) => model.series(user).some((d) => d.value != null))
    .sort(
      (a, b) =>
        d3.sum(model.series(b), (d) => d.value) -
        d3.sum(model.series(a), (d) => d.value),
    )
    .slice(0, 3);
}

export function drawRoad(model, state, setYear, setRoad) {
  const d3 = globalThis.d3,
    users = roadSeries(model, state);
  const series = users.map((user) => {
    const baseline = model.road.get(2011)?.get(user);
    return {
      user,
      style: styleFor(user),
      values: model.series(user).map((d) => ({
        ...d,
        display:
          state.trend === 'index'
            ? baseline > 0 && d.value != null
              ? (d.value / baseline) * 100
              : null
            : d.value,
      })),
    };
  });
  const legend = d3
    .select('#road-legend')
    .selectAll('button')
    .data(series, (d) => d.user)
    .join('button')
    .attr('type', 'button')
    .attr('aria-label', (d) => `Filter every chart to ${d.user}`)
    .on('click', (e, d) => setRoad(d.user));
  legend.each(function (d) {
    const node = d3.select(this);
    node
      .selectAll('span.swatch')
      .data([d])
      .join('span')
      .attr('class', 'swatch')
      .attr('aria-hidden', 'true')
      .style('color', d.style.color)
      .text(d.style.glyph);
    node
      .selectAll('span.name')
      .data([d])
      .join('span')
      .attr('class', 'name')
      .text((d) => d.user);
  });
  if (!series.some((s) => s.values.some((d) => d.display != null)))
    return empty(
      'road-chart',
      state.trend === 'index'
        ? 'Index unavailable: these filters have no positive 2011 baseline. Switch to Count.'
        : 'No records match these filters. Try resetting a filter.',
    );
  ready('road-chart');
  const { plot, iw, ih } = frame(
    'road-chart',
    `Filtered road-user trends, ${state.trend === 'count' ? 'counts' : '2011 = 100'}`,
    `${users.join(', ')}. ${state.trend === 'index' ? 'Each road user is indexed to its own filtered 2011 count. No positive baseline means no index.' : ''} Policy breaks apply.`,
    220,
    { top: 25, right: 15, bottom: 26, left: 41 },
  );
  const x = d3.scaleLinear().domain([2011, 2021]).range([0, iw]);
  const y = d3
    .scaleLinear()
    .domain([
      0,
      Math.max(
        10,
        (d3.max(
          series.flatMap((s) => s.values),
          (d) => d.display,
        ) || 0) * 1.13,
      ),
    ])
    .range([ih, 0])
    .nice();
  lineAxes(plot, x, y, iw, ih);
  breakMarkers(plot, x, ih);
  group(plot, 'selected-year')
    .attr('aria-hidden', 'true')
    .selectAll('line')
    .data([state.year])
    .join('line')
    .attr('x1', x)
    .attr('x2', x)
    .attr('y1', 0)
    .attr('y2', ih)
    .attr('stroke', themeColor('accent'))
    .attr('stroke-opacity', 0.25);
  const line = d3
    .line()
    .defined((d) => d.display != null)
    .x((d) => x(d.year))
    .y((d) => y(d.display));
  const paths = series.flatMap((s) =>
    phases(s.values).map((values, i) => ({
      key: `${s.user}-${i}`,
      style: s.style,
      values,
    })),
  );
  group(plot, 'road-lines')
    .attr('aria-hidden', 'true')
    .selectAll('path')
    .data(paths, (d) => d.key)
    .join('path')
    .attr('d', (d) => line(d.values))
    .attr('fill', 'none')
    .attr('stroke', (d) => d.style.color)
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', (d) => d.style.dash);
  const shape = {
    circle: d3.symbolCircle,
    square: d3.symbolSquare,
    triangle: d3.symbolTriangle,
    diamond: d3.symbolDiamond,
  };
  const points = group(plot, 'road-points')
    .selectAll('g.road-point')
    .data(
      series.flatMap((s) =>
        s.values
          .filter((d) => d.display != null)
          .map((d) => ({ ...d, style: s.style })),
      ),
      (d) => `${d.user}-${d.year}`,
    )
    .join('g')
    .attr('class', 'road-point')
    .attr('transform', (d) => `translate(${x(d.year)},${y(d.display)})`);
  points
    .selectAll('circle.hit')
    .data((d) => [d])
    .join('circle')
    .attr('class', 'hit')
    .attr('r', 8)
    .attr('fill', 'transparent');
  points
    .selectAll('path')
    .data((d) => [d])
    .join('path')
    .attr('d', (d) =>
      d3.symbol(shape[d.style.symbol], d.year === state.year ? 42 : 19)(),
    )
    .attr('fill', (d) => d.style.color)
    .attr('stroke', themeColor('surface'))
    .attr('stroke-width', 0.6);
  interactive(
    points,
    (d) =>
      `${d.user}, ${d.year}: ${number(d.value)} hospitalisations${state.trend === 'index' ? `, index ${d.display.toFixed(1)}` : ''}. Select this snapshot year.`,
    (d) => setYear(d.year),
  );
}

export function drawMatrix(model, state, setRoad, announce) {
  const d3 = globalThis.d3,
    all = model.cells(state.year),
    columns = state.matrixColumns || ROAD_USERS,
    ages = state.matrixAges || [...new Set(all.map((d) => d.age))];
  if (!all.length)
    return empty(
      'heatmap-chart',
      `No records match these filters in ${state.year}. Try another snapshot or reset a filter.`,
    );
  ready('heatmap-chart');
  const { plot, svg, iw, ih } = frame(
    'heatmap-chart',
    `Filtered age by road-user matrix, ${state.year}`,
    `Current view shows ${columns.join(', ')} for ages ${ages.join(', ')}. Previous/Next controls expose all matching categories. Shares always use the full matching age-group total.`,
    220,
    { top: 70, right: 3, bottom: 3, left: 51 },
  );
  const x = d3.scaleBand().domain(columns).range([0, iw]).padding(0.04),
    y = d3.scaleBand().domain(ages).range([0, ih]).padding(0.05);
  const limit = state.matrix === 'share' ? 1 : model.maxCell || 1;
  // Monotone-lightness sequence, matching the CSS legend's three stops.
  const heatStops = ['heat-start', 'lavender', 'accent'].map(themeColor);
  const color = d3
    .scaleSequential(d3.piecewise(d3.interpolateRgb, heatStops))
    .domain([0, limit]);
  const fill = (d) =>
    d.value == null || (state.matrix === 'share' && d.share == null)
      ? 'url(#no-record)'
      : color(state.matrix === 'share' ? d.share : d.value);
  const pattern = svg
    .selectAll('defs')
    .data([null])
    .join('defs')
    .selectAll('pattern')
    .data([null])
    .join('pattern')
    .attr('id', 'no-record')
    .attr('width', 6)
    .attr('height', 6)
    .attr('patternUnits', 'userSpaceOnUse');
  pattern
    .selectAll('rect')
    .data([null])
    .join('rect')
    .attr('width', 6)
    .attr('height', 6)
    .attr('fill', themeColor('paper'));
  pattern
    .selectAll('path')
    .data([null])
    .join('path')
    .attr('d', 'M0 6L6 0')
    .attr('stroke', themeColor('hatch'));
  const headers = group(plot, 'matrix-headers')
    .selectAll('g.column')
    .data(columns, (d) => d)
    .join('g')
    .attr('class', 'column')
    .attr('transform', (d) => `translate(${x(d) + x.bandwidth() / 2},-8)`);
  headers
    .selectAll('rect')
    .data((d) => [d])
    .join('rect')
    .attr('x', -x.bandwidth() / 2)
    .attr('y', -58)
    .attr('width', x.bandwidth())
    .attr('height', 63)
    .attr('fill', 'transparent');
  headers.each(function (user) {
    d3.select(this)
      .selectAll('text')
      .data(compactRoadLabel(user))
      .join('text')
      .attr('class', 'matrix-header')
      .attr('text-anchor', 'middle')
      .attr('y', (d, i, nodes) => -7 - (nodes.length - 1 - i) * 13)
      .text((d) => d);
  });
  interactive(
    headers,
    (user) => `${user}. Select to filter every chart to this road user.`,
    setRoad,
  );
  group(plot, 'matrix-age-labels')
    .attr('aria-hidden', 'true')
    .selectAll('text')
    .data(ages, (d) => d)
    .join('text')
    .attr('class', 'matrix-row-label')
    .attr('x', -9)
    .attr('y', (d) => y(d) + y.bandwidth() / 2)
    .attr('text-anchor', 'end')
    .attr('dominant-baseline', 'middle')
    .text((d) => (d === 'Missing' ? 'Unknown' : d));
  const cells = group(plot, 'matrix-cells')
    .selectAll('g.cell')
    .data(
      all.filter((d) => columns.includes(d.user) && ages.includes(d.age)),
      (d) => `${d.age}|${d.user}`,
    )
    .join('g')
    .attr('class', 'cell')
    .attr('transform', (d) => `translate(${x(d.user)},${y(d.age)})`);
  cells
    .selectAll('rect')
    .data((d) => [d])
    .join('rect')
    .attr('width', x.bandwidth())
    .attr('height', y.bandwidth())
    .attr('fill', fill)
    .attr('rx', 1);
  cells
    .selectAll('text')
    .data((d) => [d])
    .join('text')
    .attr('class', 'matrix-cell-value')
    .attr('aria-hidden', 'true')
    .attr('x', x.bandwidth() / 2)
    .attr('y', y.bandwidth() / 2)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', (d) =>
      fill(d).startsWith('url') ? themeColor('muted') : textContrast(fill(d)),
    )
    .text((d) =>
      d.value == null
        ? '—'
        : state.matrix === 'count'
          ? number(d.value)
          : d.share == null
            ? 'n/a'
            : percent(d.share),
    );
  const detail = (d) =>
    `${state.year} · age ${ageLabel(d.age)} · ${d.user}: ${d.value == null ? 'no record' : `${number(d.value)} admissions; ${d.share == null ? 'share unavailable because the group total is zero' : `${percent(d.share)} of ${number(d.total)} matching age-group admissions`}`}.`;
  interactive(cells, detail, (d) => setRoad(d.user));
  cells
    .on('pointerenter.readout', (e, d) => announce(detail(d)))
    .on('focus.readout', (e, d) => announce(detail(d)));
}
