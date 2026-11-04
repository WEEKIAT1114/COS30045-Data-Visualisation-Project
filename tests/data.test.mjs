import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import {
  validateRows,
  filterNational,
  totals,
  annualData,
  groupRows,
  matrixData,
  distributionData,
} from '../js/data.js';
import { DEFAULT_FILTERS, FILTERS, AGE_GROUPS } from '../js/config.js';

const library = await readFile(
  new URL('../vendor/d3.v7.9.0.min.js', import.meta.url),
  'utf8',
);
const context = {};
vm.runInNewContext(library, context);
const bytes = await readFile(new URL('../data/road_crash_master.csv', import.meta.url));
const raw = Array.from(context.d3.csvParse(bytes.toString('utf8')), (row) => ({
  ...row,
}));
const rows = validateRows(raw);
const selection = (changes) => ({ ...DEFAULT_FILTERS, ...changes });

test('the CSV is the updated KNIME master and all record grains remain intact', () => {
  assert.equal(
    createHash('sha256').update(bytes).digest('hex'),
    'c86b252408f8ada3e47eb28cf8aa5b6d5d5850ad20f067edafb6b4e576801d6c',
  );
  assert.equal(rows.length, 18074);
  assert.equal(
    rows.filter((row) => row.record_type === 'national_detail').length,
    17953,
  );
  assert.equal(rows.filter((row) => row.record_type === 'state_annual').length, 88);
  assert.equal(
    rows.filter((row) => row.record_type === 'first_nations_annual').length,
    33,
  );
});

test('summary record types cannot double-count the national dashboard', () => {
  const current = filterNational(rows, selection());
  assert.equal(totals(current).count, 39505);
  assert.ok(current.every((row) => row.record_type === 'national_detail'));
  assert.equal(
    rows
      .filter((row) => row.year === 2021)
      .reduce((sum, row) => sum + row.hospitalisations, 0),
    118045,
  );
});

test('all eleven annual totals match the original national workbook', () => {
  const full = filterNational(rows, selection({ year: 'All' }));
  assert.deepEqual(
    annualData(full).map((item) => item.count),
    [34033, 34024, 35001, 35515, 37082, 38963, 39339, 39590, 39866, 37966, 39505],
  );
  assert.equal(totals(full).count, 410884);
});

test('2021 age totals match the supplied data chart, not the illustrative mockup', () => {
  const groups = groupRows(filterNational(rows, selection()), 'age_group', AGE_GROUPS);
  assert.deepEqual(
    groups.map((item) => item.count),
    [707, 2863, 8010, 9423, 13026, 3018, 2458],
  );
});

test('recorded bed-day ratio uses sums and does not average source-row ratios', () => {
  const current = filterNational(rows, selection());
  const summary = totals(current);
  assert.equal(summary.beds, 198934);
  assert.equal(summary.ratio, 198934 / 39505);
  assert.equal(summary.ratio.toFixed(1), '5.0');
  assert.equal(totals([]).ratio, null);
  assert.equal(totals([{ hospitalisations: 0, bed_days: 8 }]).ratio, null);
});

test('every filter choice reconciles age, road-user and counterparty counts', () => {
  for (const field of FILTERS) {
    for (const value of ['All', ...field.values.map(String)]) {
      const current = filterNational(rows, selection({ [field.key]: value }));
      const expected = totals(current).count;
      for (const dimension of [
        'age_group',
        'road_user',
        'remoteness',
        'counterparty',
      ]) {
        assert.equal(
          groupRows(current, dimension).reduce((sum, item) => sum + item.count, 0),
          expected,
        );
      }
      assert.equal(
        matrixData(current).reduce((sum, item) => sum + (item.count || 0), 0),
        expected,
      );
    }
  }
});

test('combined filters use joint national detail, including counterparty', () => {
  const filters = selection({
    remoteness: 'Regional',
    age_group: '40-64',
    sex: 'Female',
    road_user: 'Pedal cyclist',
  });
  assert.equal(totals(filterNational(rows, filters)).count, 174);
  for (const counterparty of FILTERS.find((field) => field.key === 'counterparty')
    .values) {
    const expected = raw
      .filter(
        (row) =>
          row.record_type === 'national_detail' &&
          row.year === '2021' &&
          row.remoteness === 'Regional' &&
          row.age_group === '40-64' &&
          row.sex === 'Female' &&
          row.road_user === 'Pedal cyclist' &&
          row.counterparty === counterparty,
      )
      .reduce((sum, row) => sum + Number(row.hospitalisations), 0);
    assert.equal(
      totals(filterNational(rows, { ...filters, counterparty })).count,
      expected,
    );
  }
});

test('sex offers only All, Male and Female while All retains source unknowns', () => {
  assert.deepEqual(FILTERS.find((field) => field.key === 'sex').values, [
    'Male',
    'Female',
  ]);
  const all = totals(filterNational(rows, selection({ year: 'All' }))).count;
  const male = totals(
    filterNational(rows, selection({ year: 'All', sex: 'Male' })),
  ).count;
  const female = totals(
    filterNational(rows, selection({ year: 'All', sex: 'Female' })),
  ).count;
  assert.equal(all - male - female, 15);
  assert.equal(
    totals(filterNational(rows, selection({ year: '2014', age_group: 'Missing' })))
      .count,
    1,
  );
});

test('a selected year changes the snapshot and retains filtered trend context', () => {
  const filters = selection({ road_user: 'Pedal cyclist', year: '2014' });
  assert.equal(totals(filterNational(rows, filters)).count, 6636);
  assert.deepEqual(
    [...new Set(filterNational(rows, filters, false).map((row) => row.year))],
    [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
  );
});

test('donut grouping preserves the complete denominator and selected uncommon users', () => {
  const current = filterNational(rows, selection());
  const groups = distributionData(current, 'All');
  assert.equal(groups.length, 6);
  assert.equal(
    groups.reduce((sum, item) => sum + item.count, 0),
    39505,
  );
  assert.equal(groups.find((item) => item.key === 'Car driver').count, 13327);
  const selected = filterNational(
    rows,
    selection({ road_user: 'Heavy transport driver' }),
  );
  assert.deepEqual(
    distributionData(selected, 'Heavy transport driver').map((item) => item.key),
    ['Heavy transport driver'],
  );
});

test('matrix distinguishes recorded zero from absent cells', () => {
  const values = matrixData(filterNational(rows, selection()));
  assert.equal(
    values.find(
      (item) => item.age === '75+' && item.user === 'Heavy transport unknown position',
    ).count,
    0,
  );
  assert.equal(
    values.find((item) => item.age === '0-7' && item.user === 'Heavy transport driver')
      .count,
    null,
  );
});

test('malformed numerics, unknown categories and duplicate detail fail clearly', () => {
  const bad = (changes) => [{ ...raw[0], ...changes }];
  for (const value of ['-1', '1.5', 'abc'])
    assert.throws(() => validateRows(bad({ hospitalisations: value })));
  assert.throws(() => validateRows(bad({ bed_days: '' })));
  assert.throws(() => validateRows(bad({ year: '2030' })));
  assert.throws(() => validateRows(bad({ sex: 'unexpected' })));
  assert.throws(() => validateRows([{ ...raw[0] }, { ...raw[0] }]));
  assert.throws(() => validateRows([]));
});
