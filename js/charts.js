// Each function follows the same D3 steps: data -> scales -> axes -> marks.
// GenAI assistance and source definitions are documented in docs/.
import {
  AGE_GROUPS,
  ROAD_USERS,
  COLORS,
  label,
  formatNumber,
  formatRatio,
} from './config.js';
import { totals, groupRows, annualData, distributionData, matrixData } from './data.js';
import { frame, emptyChart, interactive, contrastText } from './ui.js';

const NAVY = '#37507e';
const LAVENDER = '#9298c6';
const trendColors = [NAVY, '#76648c', '#9b654a'];

function lineAxes(plot, x, y, width, height) {
  plot
    .append('g')
    .attr('class', 'grid')
    .attr('aria-hidden', 'true')
    .call(d3.axisLeft(y).ticks(3).tickSize(-width).tickFormat(''));
  plot
    .append('g')
    .attr('class', 'axis')
    .attr('aria-hidden', 'true')
    .attr('transform', `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .tickValues(width > 420 ? d3.range(2011, 2022, 2) : [2011, 2016, 2021])
        .tickFormat(d3.format('d'))
        .tickSizeOuter(0)
        .tickPadding(7),
    );
  plot
    .append('g')
    .attr('class', 'axis')
    .attr('aria-hidden', 'true')
    .call(
      d3.axisLeft(y).ticks(3).tickFormat(d3.format('~s')).tickSize(0).tickPadding(6),
    )
    .select('.domain')
    .remove();

  for (const year of [2011.5, 2016.5]) {
    plot
      .append('line')
      .attr('class', 'policy-line')
      .attr('x1', x(year))
      .attr('x2', x(year))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('aria-hidden', 'true');
    plot
      .append('text')
      .attr('class', 'policy-label')
      .attr('x', x(year) + 4)
      .attr('y', -8)
      .text(`${Math.ceil(year)} change`)
      .attr('aria-hidden', 'true');
  }
}

function phases(values) {
  return [
    values.filter((item) => item.key === 2011),
    values.filter((item) => item.key >= 2012 && item.key < 2017),
    values.filter((item) => item.key >= 2017),
  ];
}

function roadColor(user) {
  const index = ROAD_USERS.indexOf(user);
  return index < 3 ? trendColors[index] : COLORS[index];
}

function drawAnnual(snapshot, history, filters, ui) {
  const values = annualData(history);
  const table = {
    headers: ['Year', 'Hospitalisations'],
    rows: values.map((item) => [item.key, item.count]),
  };
  if (!history.length) {
    emptyChart('annual');
    return table;
  }

  const chart = frame('annual', { top: 24, right: 16, bottom: 28, left: 40 });
  const { plot, innerWidth: width, innerHeight: height } = chart;
  const x = d3.scaleLinear().domain([2011, 2021]).range([0, width]);
  const y = d3
    .scaleLinear()
    .domain([0, Math.max(10, d3.max(values, (item) => item.count) * 1.15)])
    .nice()
    .range([height, 0]);
  lineAxes(plot, x, y, width, height);

  const line = d3
    .line()
    .defined((item) => item.count !== null)
    .x((item) => x(item.key))
    .y((item) => y(item.count));
  plot
    .selectAll('path.data-line')
    .data(phases(values))
    .join('path')
    .attr('class', 'data-line')
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', (_, index) => (index === 2 ? '#7178aa' : NAVY))
    .attr('stroke-width', 2.3);

  const points = plot
    .selectAll('g.point')
    .data(values.filter((item) => item.count !== null))
    .join('g')
    .attr('class', 'point')
    .attr('transform', (item) => `translate(${x(item.key)},${y(item.count)})`);
  points.append('circle').attr('r', 10).attr('fill', 'transparent');
  points
    .append('circle')
    .attr('r', (item) => (String(item.key) === filters.year ? 4.8 : 3))
    .attr('fill', (item) => (String(item.key) === filters.year ? NAVY : '#fff'))
    .attr('stroke', NAVY)
    .attr('stroke-width', 1.5);
  interactive(
    points,
    (item) =>
      `${item.key}: ${formatNumber(item.count)} hospitalisations. Select this year.`,
    (item) => ui.select('year', String(item.key)),
  );

  const selected = values.find(
    (item) => String(item.key) === filters.year && item.count !== null,
  );
  if (selected)
    plot
      .append('text')
      .attr('class', 'value-label')
      .attr('x', x(selected.key))
      .attr('y', Math.max(10, y(selected.count) - 12))
      .attr(
        'text-anchor',
        selected.key === 2021 ? 'end' : selected.key === 2011 ? 'start' : 'middle',
      )
      .text(formatNumber(selected.count));
  return table;
}

function drawAge(snapshot, history, filters, ui) {
  const values = groupRows(snapshot, 'age_group', AGE_GROUPS);
  const table = {
    headers: ['Age group', 'Hospitalisations'],
    rows: values.map((item) => [label(item.key), item.count]),
  };
  if (!values.length) {
    emptyChart('age');
    return table;
  }
  const {
    plot,
    innerWidth: width,
    innerHeight: height,
  } = frame('age', { top: 18, right: 6, bottom: 27, left: 41 });
  const x = d3
    .scaleBand()
    .domain(values.map((item) => item.key))
    .range([0, width])
    .padding(0.2);
  const max = d3.max(values, (item) => item.count);
  const y = d3
    .scaleLinear()
    .domain([0, Math.max(10, max * 1.18)])
    .nice()
    .range([height, 0]);
  plot
    .append('g')
    .attr('class', 'grid')
    .attr('aria-hidden', 'true')
    .call(d3.axisLeft(y).ticks(3).tickSize(-width).tickFormat(''));
  plot
    .append('g')
    .attr('class', 'axis')
    .attr('aria-hidden', 'true')
    .call(
      d3.axisLeft(y).ticks(3).tickFormat(d3.format('~s')).tickSize(0).tickPadding(6),
    )
    .select('.domain')
    .remove();
  plot
    .append('g')
    .attr('class', 'axis')
    .attr('aria-hidden', 'true')
    .attr('transform', `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .tickFormat((value) => (value === 'Missing' ? 'Unknown' : label(value)))
        .tickSize(0)
        .tickPadding(8),
    );

  const bars = plot
    .selectAll('rect.age-bar')
    .data(values)
    .join('rect')
    .attr('class', 'age-bar')
    .attr('x', (item) => x(item.key))
    .attr('y', (item) => y(item.count))
    .attr('width', x.bandwidth())
    .attr('height', (item) => height - y(item.count))
    .attr('fill', (item) => (item.count === max ? NAVY : LAVENDER))
    .attr('stroke', NAVY);
  interactive(
    bars,
    (item) =>
      `${label(item.key)}: ${formatNumber(item.count)} hospitalisations. Select this age group.`,
    (item) => ui.select('age_group', item.key),
  );
  if (x.bandwidth() >= 25)
    plot
      .selectAll('text.bar-value')
      .data(values)
      .join('text')
      .attr('class', 'value-label')
      .attr('x', (item) => x(item.key) + x.bandwidth() / 2)
      .attr('y', (item) => y(item.count) - 6)
      .attr('text-anchor', 'middle')
      .text((item) => formatNumber(item.count));
  return table;
}

function drawHorizontal(id, values, metric, field, ui) {
  const rows = values.map((item) => [
    label(item.key),
    metric === 'count' ? item.count : formatRatio(item.ratio),
  ]);
  const table = {
    headers: [
      field === 'remoteness' ? 'Remoteness' : 'Age group',
      metric === 'count' ? 'Hospitalisations' : 'Bed days / hospitalisation',
    ],
    rows,
  };
  if (!values.length) {
    emptyChart(id);
    return table;
  }
  const available = values.filter((item) => item[metric] !== null);
  if (!available.length) {
    emptyChart(
      id,
      'Bed-day ratios are unavailable because the matching hospitalisation total is zero.',
    );
    return table;
  }

  const left = field === 'remoteness' ? 91 : 58;
  const {
    plot,
    innerWidth: width,
    innerHeight: height,
  } = frame(id, { top: 6, right: 46, bottom: 24, left });
  const perPage = Math.max(1, Math.floor(height / 19));
  const pages = Math.ceil(values.length / perPage);
  ui.barPage = Math.min(ui.barPage, pages - 1);
  const visible = values.slice(ui.barPage * perPage, (ui.barPage + 1) * perPage);
  const visibleValues = visible.filter((item) => item[metric] !== null);
  const y = d3
    .scaleBand()
    .domain(visible.map((item) => item.key))
    .range([0, height])
    .padding(0.24);
  const x = d3
    .scaleLinear()
    .domain([0, Math.max(1, d3.max(available, (item) => item[metric]) * 1.08)])
    .nice()
    .range([0, width]);
  plot
    .append('g')
    .attr('class', 'grid')
    .attr('aria-hidden', 'true')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(3).tickSize(-height).tickFormat(''));
  plot
    .append('g')
    .attr('class', 'axis')
    .attr('aria-hidden', 'true')
    .call(
      d3
        .axisLeft(y)
        .tickFormat((value) => (value === 'Missing' ? 'Not recorded' : label(value)))
        .tickSize(0)
        .tickPadding(8),
    )
    .select('.domain')
    .remove();
  plot
    .append('g')
    .attr('class', 'axis')
    .attr('aria-hidden', 'true')
    .attr('transform', `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(3)
        .tickSizeOuter(0)
        .tickFormat(metric === 'count' ? d3.format('~s') : d3.format('~g')),
    );
  const bars = plot
    .selectAll('rect.horizontal-bar')
    .data(visibleValues)
    .join('rect')
    .attr('class', 'horizontal-bar')
    .attr('x', 0)
    .attr('y', (item) => y(item.key))
    .attr('height', y.bandwidth())
    .attr('width', (item) => x(item[metric]))
    .attr('fill', (item) =>
      metric === 'ratio'
        ? LAVENDER
        : [NAVY, LAVENDER, '#dfc7ba', '#a1a6b2'][values.indexOf(item) % 4],
    )
    .attr('stroke', NAVY)
    .attr('stroke-width', 0.8);
  interactive(
    bars,
    (item) =>
      `${label(item.key)}: ${metric === 'count' ? formatNumber(item.count) + ' hospitalisations' : formatRatio(item.ratio) + ' bed days per hospitalisation'}. Select this group.`,
    (item) => ui.select(field, item.key),
  );
  plot
    .selectAll('text.bar-value')
    .data(visibleValues)
    .join('text')
    .attr('class', 'value-label')
    .attr('x', (item) => x(item[metric]) + 6)
    .attr('y', (item) => y(item.key) + y.bandwidth() / 2)
    .attr('dominant-baseline', 'middle')
    .text((item) =>
      metric === 'count' ? formatNumber(item.count) : formatRatio(item.ratio),
    );
  const controls = document.querySelector(`#controls-${id}`);
  controls.innerHTML = `<span>Groups ${ui.barPage * perPage + 1}–${Math.min(values.length, (ui.barPage + 1) * perPage)} of ${values.length}</span>
    <span class="mini-pager"><button id="bar-prev-${id}" aria-label="Previous ${field === 'remoteness' ? 'remoteness' : 'age'} groups">‹</button>
    <span>${ui.barPage + 1}/${pages}</span><button id="bar-next-${id}" aria-label="Next ${field === 'remoteness' ? 'remoteness' : 'age'} groups">›</button></span>`;
  controls.querySelector(`#bar-prev-${id}`).disabled = ui.barPage === 0;
  controls.querySelector(`#bar-next-${id}`).disabled = ui.barPage === pages - 1;
  controls.querySelector(`#bar-prev-${id}`).onclick = () => {
    ui.barPage--;
    ui.redraw();
  };
  controls.querySelector(`#bar-next-${id}`).onclick = () => {
    ui.barPage++;
    ui.redraw();
  };
  return table;
}

function drawDistribution(snapshot, history, filters, ui) {
  const values = distributionData(snapshot, filters.road_user);
  const total = totals(snapshot).count;
  const table = {
    headers: ['Road user', 'Hospitalisations', 'Share'],
    rows: values.map((item) => [
      item.key,
      item.count,
      total > 0 ? `${((item.count / total) * 100).toFixed(1)}%` : 'Unavailable',
    ]),
  };
  if (total === 0) {
    emptyChart(
      'distribution',
      snapshot.length
        ? 'The matching records contain zero hospitalisations, so shares are undefined.'
        : undefined,
    );
    return table;
  }

  const { svg, width, height } = frame('distribution', {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
  const radius = Math.max(15, Math.min(height / 2 - 8, width * 0.235));
  const centerX = width * 0.25;
  const arcs = d3
    .pie()
    .sort(null)
    .value((item) => item.count)(values.filter((item) => item.count > 0));
  const arc = d3
    .arc()
    .innerRadius(radius * 0.57)
    .outerRadius(radius);
  const ring = svg.append('g').attr('transform', `translate(${centerX},${height / 2})`);
  const color = (item) =>
    COLORS[item.key === 'Other road users' ? 5 : ROAD_USERS.indexOf(item.key)];
  const slices = ring
    .selectAll('path')
    .data(arcs)
    .join('path')
    .attr('d', arc)
    .attr('fill', (item) => color(item.data))
    .attr('stroke', '#fff')
    .attr('stroke-width', 2);
  interactive(
    slices,
    (item) =>
      `${item.data.key}: ${formatNumber(item.data.count)} hospitalisations, ${((item.data.count / total) * 100).toFixed(1)}% of matching total.`,
  );
  ring
    .append('text')
    .attr('class', 'donut-total')
    .attr('text-anchor', 'middle')
    .attr('y', 1)
    .text(formatNumber(total));
  ring
    .append('text')
    .attr('class', 'donut-caption')
    .attr('text-anchor', 'middle')
    .attr('y', 17)
    .text('hospitalisations');

  const rowHeight = Math.min(31, (height - 8) / Math.max(1, values.length));
  const legend = svg
    .append('g')
    .attr(
      'transform',
      `translate(${width * 0.53},${(height - values.length * rowHeight) / 2})`,
    );
  const items = legend
    .selectAll('g')
    .data(values)
    .join('g')
    .attr('transform', (_, index) => `translate(0,${index * rowHeight})`);
  items
    .append('circle')
    .attr('cx', 5)
    .attr('cy', rowHeight / 2)
    .attr('r', 4)
    .attr('fill', color)
    .attr('stroke', NAVY)
    .attr('stroke-width', 0.5);
  items
    .append('text')
    .attr('class', 'legend-label')
    .attr('x', 15)
    .attr('y', rowHeight / 2 - 2)
    .text((item) => item.key);
  items
    .append('text')
    .attr('class', 'legend-value')
    .attr('x', 15)
    .attr('y', rowHeight / 2 + 10)
    .text(
      (item) =>
        `${((item.count / total) * 100).toFixed(1)}% · ${formatNumber(item.count)}`,
    );
  return table;
}

function drawTrends(snapshot, history, filters, ui) {
  const users = groupRows(history, 'road_user', ROAD_USERS)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((item) => item.key);
  const series = users.map((user) => ({
    user,
    values: annualData(history.filter((row) => row.road_user === user)),
  }));
  const table = {
    headers: ['Year', 'Road user', 'Hospitalisations'],
    rows: series.flatMap((series) =>
      series.values.map((item) => [item.key, series.user, item.count]),
    ),
  };
  if (!history.length) {
    emptyChart('trends');
    return table;
  }
  const {
    plot,
    innerWidth: width,
    innerHeight: height,
  } = frame('trends', { top: 23, right: 10, bottom: 25, left: 39 });
  const x = d3.scaleLinear().domain([2011, 2021]).range([0, width]);
  const y = d3
    .scaleLinear()
    .domain([
      0,
      Math.max(
        10,
        d3.max(
          series.flatMap((series) => series.values),
          (item) => item.count,
        ) * 1.1,
      ),
    ])
    .nice()
    .range([height, 0]);
  lineAxes(plot, x, y, width, height);
  const line = d3
    .line()
    .defined((item) => item.count !== null)
    .x((item) => x(item.key))
    .y((item) => y(item.count));
  const symbols = [d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle];
  const dashes = [null, '7 4', '2 3'];

  series.forEach((series, index) => {
    plot
      .selectAll(`path.series-${index}`)
      .data(phases(series.values))
      .join('path')
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', roadColor(series.user))
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', dashes[index]);
    const points = plot
      .selectAll(`g.series-point-${index}`)
      .data(series.values.filter((item) => item.count !== null))
      .join('g')
      .attr('transform', (item) => `translate(${x(item.key)},${y(item.count)})`);
    points.append('circle').attr('r', 8).attr('fill', 'transparent');
    points
      .append('path')
      .attr('d', (item) =>
        d3.symbol(symbols[index], String(item.key) === filters.year ? 42 : 22)(),
      )
      .attr('fill', roadColor(series.user))
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5);
    interactive(
      points,
      (item) =>
        `${series.user}, ${item.key}: ${formatNumber(item.count)} hospitalisations. Select this year.`,
      (item) => ui.select('year', String(item.key)),
    );
  });
  const legend = document.querySelector('#controls-trends');
  legend.replaceChildren();
  users.forEach((user, index) => {
    const button = document.createElement('button');
    button.className = 'legend-button';
    button.textContent = `${['●', '■', '▲'][index]} ${user}`;
    button.style.borderBottomColor = roadColor(user);
    button.title = `Filter all charts to ${user}`;
    button.addEventListener('click', () => ui.select('road_user', user));
    legend.append(button);
  });
  return table;
}

const shortRoad = {
  'Car driver': ['Car', 'driver'],
  'Car passenger': ['Car', 'passenger'],
  Motorcyclist: ['Motorcyclist'],
  'Pedal cyclist': ['Pedal', 'cyclist'],
  Pedestrian: ['Pedestrian'],
  'Car unknown position': ['Car position', 'unknown'],
  'Heavy transport driver': ['Heavy vehicle', 'driver'],
  'Heavy transport passenger': ['Heavy vehicle', 'passenger'],
  'Heavy transport unknown position': ['Heavy vehicle', 'unknown'],
  'Pick-up truck or van occupant': ['Pick-up /', 'van occupant'],
  'Bus occupant': ['Bus', 'occupant'],
  'Other or unknown': ['Other /', 'unknown'],
};

function drawHeatmap(snapshot, history, filters, ui) {
  const values = matrixData(snapshot);
  const table = {
    headers: ['Age', 'Road user', 'Hospitalisations'],
    rows: values.map((item) => [label(item.age), item.user, item.count]),
  };
  if (!snapshot.length) {
    emptyChart('heatmap');
    return table;
  }
  const {
    plot,
    svg,
    innerWidth: width,
    innerHeight: height,
  } = frame('heatmap', { top: 40, right: 3, bottom: 2, left: 49 });
  const ages = [...new Set(values.map((item) => item.age))];
  const users = [...new Set(values.map((item) => item.user))];
  const columnsPerPage = Math.max(1, Math.floor(width / 76));
  const rowsPerPage = Math.max(1, Math.floor(height / 22));
  const columnPages = Math.ceil(users.length / columnsPerPage);
  const rowPages = Math.ceil(ages.length / rowsPerPage);
  const pages = columnPages * rowPages;
  ui.matrixPage = Math.min(ui.matrixPage, pages - 1);
  const columnPage = ui.matrixPage % columnPages;
  const rowPage = Math.floor(ui.matrixPage / columnPages);
  const visibleUsers = users.slice(
    columnPage * columnsPerPage,
    (columnPage + 1) * columnsPerPage,
  );
  const visibleAges = ages.slice(rowPage * rowsPerPage, (rowPage + 1) * rowsPerPage);
  const max = d3.max(values, (item) => item.count) || 0;
  const color = d3
    .scaleSequential(d3.piecewise(d3.interpolateRgb, ['#f1f0f8', LAVENDER, NAVY]))
    .domain([0, max || 1]);
  const x = d3.scaleBand().domain(visibleUsers).range([0, width]).padding(0.025);
  const y = d3.scaleBand().domain(visibleAges).range([0, height]).padding(0.04);
  const pattern = svg
    .append('defs')
    .append('pattern')
    .attr('id', 'missing-cell')
    .attr('width', 6)
    .attr('height', 6)
    .attr('patternUnits', 'userSpaceOnUse');
  pattern.append('rect').attr('width', 6).attr('height', 6).attr('fill', '#f4f1f4');
  pattern.append('path').attr('d', 'M0 6L6 0').attr('stroke', '#c2becb');

  visibleUsers.forEach((user) => {
    const words = shortRoad[user];
    const header = plot
      .append('text')
      .attr('class', 'matrix-header')
      .attr('text-anchor', 'middle')
      .attr('x', x(user) + x.bandwidth() / 2)
      .attr('y', -8 - (words.length - 1) * 12);
    words.forEach((word, index) =>
      header
        .append('tspan')
        .attr('x', x(user) + x.bandwidth() / 2)
        .attr('dy', index ? 12 : 0)
        .text(word),
    );
  });
  plot
    .selectAll('text.row-label')
    .data(visibleAges)
    .join('text')
    .attr('class', 'matrix-label')
    .attr('x', -7)
    .attr('y', (age) => y(age) + y.bandwidth() / 2)
    .attr('text-anchor', 'end')
    .attr('dominant-baseline', 'middle')
    .text((age) => (age === 'Missing' ? 'Unknown' : label(age)));
  const cells = plot
    .selectAll('g.cell')
    .data(
      values.filter(
        (item) => visibleUsers.includes(item.user) && visibleAges.includes(item.age),
      ),
    )
    .join('g')
    .attr('class', 'cell')
    .attr('transform', (item) => `translate(${x(item.user)},${y(item.age)})`);
  cells
    .append('rect')
    .attr('width', x.bandwidth())
    .attr('height', y.bandwidth())
    .attr('rx', 2)
    .attr('fill', (item) =>
      item.count === null ? 'url(#missing-cell)' : color(item.count),
    );
  cells
    .append('text')
    .attr('class', 'matrix-value')
    .attr('x', x.bandwidth() / 2)
    .attr('y', y.bandwidth() / 2)
    .attr('dominant-baseline', 'middle')
    .attr('text-anchor', 'middle')
    .attr('fill', (item) =>
      item.count === null ? NAVY : contrastText(color(item.count)),
    )
    .text((item) => (item.count === null ? '—' : formatNumber(item.count)));
  interactive(
    cells,
    (item) =>
      `${label(item.age)}, ${item.user}: ${item.count === null ? 'no record' : formatNumber(item.count) + ' hospitalisations'}. Select this age and road user.`,
    (item) => ui.selectMany({ age_group: item.age, road_user: item.user }),
  );

  const controls = document.querySelector('#controls-heatmap');
  controls.innerHTML = `<span class="heat-key"><span class="heat-ramp"></span>0–${formatNumber(max)} · — no record</span>
    <span class="mini-pager"><button type="button" id="matrix-prev" aria-label="Previous matrix view">‹</button>
    <span>View ${ui.matrixPage + 1}/${pages}</span><button type="button" id="matrix-next" aria-label="Next matrix view">›</button></span>`;
  controls.querySelector('#matrix-prev').disabled = ui.matrixPage === 0;
  controls.querySelector('#matrix-next').disabled = ui.matrixPage === pages - 1;
  controls.querySelector('#matrix-prev').onclick = () => {
    ui.matrixPage--;
    ui.redraw();
  };
  controls.querySelector('#matrix-next').onclick = () => {
    ui.matrixPage++;
    ui.redraw();
  };
  return table;
}

function drawCounterparty(snapshot, history, filters, ui) {
  const values = groupRows(snapshot, 'counterparty').sort((a, b) => b.count - a.count);
  const total = totals(snapshot).count;
  const table = {
    headers: ['Counterparty', 'Hospitalisations'],
    rows: values.map((item) => [item.key, item.count]),
  };
  if (total === 0) {
    emptyChart(
      'counterparty',
      snapshot.length
        ? 'The matching records contain zero hospitalisations. Areas cannot represent a zero total.'
        : undefined,
    );
    return table;
  }
  const {
    plot,
    innerWidth: width,
    innerHeight: height,
  } = frame('counterparty', { top: 1, right: 1, bottom: 1, left: 1 });
  const root = d3
    .hierarchy({ children: values.filter((item) => item.count > 0) })
    .sum((item) => item.count || 0);
  d3.treemap().size([width, height]).paddingInner(3).round(true)(root);
  const nodes = plot
    .selectAll('g.tile')
    .data(root.leaves())
    .join('g')
    .attr('transform', (item) => `translate(${item.x0},${item.y0})`);
  nodes
    .append('rect')
    .attr('width', (item) => item.x1 - item.x0)
    .attr('height', (item) => item.y1 - item.y0)
    .attr('rx', 4)
    .attr('fill', (_, index) => COLORS[index % COLORS.length]);
  nodes.each(function (item, index) {
    const cellWidth = item.x1 - item.x0;
    const cellHeight = item.y1 - item.y0;
    if (cellWidth < 72 || cellHeight < 30) return;
    const words = item.data.key.split(' ');
    const lines = [];
    let line = '';
    const limit = Math.max(6, Math.floor((cellWidth - 14) / 6.4));
    for (const word of words) {
      if ((line + ' ' + word).trim().length > limit && line) {
        lines.push(line);
        line = word;
      } else line = `${line} ${word}`.trim();
    }
    if (line) lines.push(line);
    const maxLines = Math.max(1, Math.floor((cellHeight - 17) / 13));
    const shown = lines
      .slice(0, maxLines)
      .map((line) => (line.length > limit ? line.slice(0, limit - 1) + '…' : line));
    if (lines.length > maxLines)
      shown[shown.length - 1] = shown.at(-1).slice(0, -1) + '…';
    const clipId = `counterparty-label-${index}`;
    d3.select(this)
      .append('clipPath')
      .attr('id', clipId)
      .append('rect')
      .attr('width', Math.max(1, cellWidth - 6))
      .attr('height', Math.max(1, cellHeight - 3));
    const text = d3
      .select(this)
      .append('text')
      .attr('class', 'treemap-label')
      .attr('clip-path', `url(#${clipId})`)
      .attr('x', 8)
      .attr('y', 16)
      .attr('fill', contrastText(COLORS[index % COLORS.length]));
    shown.forEach((line, i) =>
      text
        .append('tspan')
        .attr('x', 8)
        .attr('dy', i ? 13 : 0)
        .text(line),
    );
    if (cellHeight > shown.length * 13 + 25)
      text
        .append('tspan')
        .attr('x', 8)
        .attr('dy', 19)
        .attr('font-weight', 700)
        .text(formatNumber(item.data.count));
  });
  interactive(
    nodes,
    (item) =>
      `${item.data.key}: ${formatNumber(item.data.count)} hospitalisations, ${((item.data.count / total) * 100).toFixed(1)}%. Select this counterparty.`,
    (item) => ui.select('counterparty', item.data.key),
  );
  return table;
}

function drawScatter(snapshot, history, filters, ui) {
  const all = groupRows(snapshot, 'road_user', ROAD_USERS);
  const values = all.filter((item) => item.ratio !== null);
  const table = {
    headers: ['Road user', 'Hospitalisations', 'Bed days / hospitalisation'],
    rows: all.map((item) => [item.key, item.count, formatRatio(item.ratio)]),
  };
  if (!values.length) {
    emptyChart(
      'scatter',
      snapshot.length
        ? 'No ratio can be calculated because the matching hospitalisation counts are zero.'
        : undefined,
    );
    return table;
  }
  const {
    plot,
    innerWidth: width,
    innerHeight: height,
  } = frame('scatter', { top: 10, right: 15, bottom: 42, left: 34 });
  const x = d3
    .scaleLinear()
    .domain([0, Math.max(10, d3.max(values, (item) => item.count) * 1.15)])
    .nice()
    .range([0, width]);
  const y = d3
    .scaleLinear()
    .domain([0, Math.max(1, d3.max(values, (item) => item.ratio) * 1.15)])
    .nice()
    .range([height, 0]);
  plot
    .append('g')
    .attr('class', 'grid')
    .attr('aria-hidden', 'true')
    .call(d3.axisLeft(y).ticks(3).tickSize(-width).tickFormat(''));
  plot
    .append('g')
    .attr('class', 'axis')
    .attr('aria-hidden', 'true')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(3).tickFormat(d3.format('~s')).tickSizeOuter(0));
  plot
    .append('g')
    .attr('class', 'axis')
    .attr('aria-hidden', 'true')
    .call(d3.axisLeft(y).ticks(3).tickSize(0))
    .select('.domain')
    .remove();
  plot
    .append('text')
    .attr('class', 'axis-label')
    .attr('x', width / 2)
    .attr('y', height + 35)
    .attr('text-anchor', 'middle')
    .text('Hospitalisations');
  const points = plot
    .selectAll('circle.scatter-point')
    .data(values)
    .join('circle')
    .attr('class', 'scatter-point')
    .attr('cx', (item) => x(item.count))
    .attr('cy', (item) => y(item.ratio))
    .attr('r', 5.5)
    .attr('fill', (item) => COLORS[ROAD_USERS.indexOf(item.key)])
    .attr('stroke', NAVY)
    .attr('stroke-width', 1.2);
  interactive(
    points,
    (item) =>
      `${item.key}: ${formatNumber(item.count)} hospitalisations; ${formatNumber(item.beds)} reported bed days; ratio ${formatRatio(item.ratio)}. Select this road user.`,
    (item) => ui.select('road_user', item.key),
  );
  return table;
}

export function renderChart(id, snapshot, history, filters, ui) {
  if (id === 'annual') return drawAnnual(snapshot, history, filters, ui);
  if (id === 'age') return drawAge(snapshot, history, filters, ui);
  if (id === 'remoteness')
    return drawHorizontal(
      id,
      groupRows(snapshot, 'remoteness', [
        'Major Cities',
        'Regional',
        'Remote',
        'Missing',
      ]),
      'count',
      'remoteness',
      ui,
    );
  if (id === 'distribution') return drawDistribution(snapshot, history, filters, ui);
  if (id === 'trends') return drawTrends(snapshot, history, filters, ui);
  if (id === 'heatmap') return drawHeatmap(snapshot, history, filters, ui);
  if (id === 'counterparty') return drawCounterparty(snapshot, history, filters, ui);
  if (id === 'scatter') return drawScatter(snapshot, history, filters, ui);
  if (id === 'bedAge')
    return drawHorizontal(
      id,
      groupRows(snapshot, 'age_group', AGE_GROUPS),
      'ratio',
      'age_group',
      ui,
    );
}
