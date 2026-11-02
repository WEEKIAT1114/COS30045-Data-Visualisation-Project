// Read-only transformations of the exact KNIME export. No population rates are inferred.
// GenAI assistance and prompt summary: docs/AI-ACKNOWLEDGEMENT.md.
import { YEARS, AGE_GROUPS, ROAD_USERS, SEXES, REMOTENESS } from './constants.js';
const FIELDS = [
  'year',
  'remoteness',
  'age_group',
  'sex',
  'road_user',
  'hospitalisations',
];

// Year selects the snapshot. Other filters apply to both snapshots and full-history trends.

export function filterRows(rows, filters = {}) {
  return rows.filter(
    (row) =>
      (!filters.remoteness ||
        filters.remoteness === 'All' ||
        row.remoteness === filters.remoteness) &&
      (!filters.age || filters.age === 'All' || row.age_group === filters.age) &&
      (!filters.sex || filters.sex === 'All' || row.sex === filters.sex) &&
      (!filters.road || filters.road === 'All' || row.road_user === filters.road),
  );
}

export function validateRows(source, columns = FIELDS) {
  if (!source.length) throw new Error('The CSV is empty.');
  if (FIELDS.some((field) => !columns.includes(field)))
    throw new Error(`CSV headers must include: ${FIELDS.join(', ')}.`);
  const seen = new Set();
  const rows = source.map((row, index) => {
    for (const field of FIELDS) {
      if (row[field] == null || String(row[field]).trim() === '')
        throw new Error(`Blank ${field} on CSV record ${index + 1}.`);
    }
    const year = Number(row.year),
      hospitalisations = Number(row.hospitalisations);
    if (!Number.isInteger(year) || !YEARS.includes(year))
      throw new Error(`Unsupported year on record ${index + 1}.`);
    if (!Number.isSafeInteger(hospitalisations) || hospitalisations < 0)
      throw new Error(`Invalid hospitalisation count on record ${index + 1}.`);
    for (const [key, values] of [
      ['age_group', AGE_GROUPS],
      ['road_user', ROAD_USERS],
      ['sex', SEXES],
      ['remoteness', REMOTENESS],
    ]) {
      if (!values.includes(row[key]))
        throw new Error(`Unexpected ${key} '${row[key]}' on record ${index + 1}.`);
    }
    const key = JSON.stringify([
      year,
      row.remoteness,
      row.age_group,
      row.sex,
      row.road_user,
    ]);
    if (seen.has(key))
      throw new Error(`Duplicate grouped record ${index + 1}; check the KNIME export.`);
    seen.add(key);
    return { ...row, year, hospitalisations };
  });
  if (YEARS.some((year) => !rows.some((row) => row.year === year)))
    throw new Error('The CSV must contain every year from 2011 to 2021.');
  return rows;
}

export function buildModel(rows) {
  const d3 = globalThis.d3;
  const sum = (values) => d3.sum(values, (d) => d.hospitalisations);
  const annual = d3.rollup(rows, sum, (d) => d.year);
  const road = d3.rollup(
    rows,
    sum,
    (d) => d.year,
    (d) => d.road_user,
  );
  const ages = d3.rollup(
    rows,
    sum,
    (d) => d.year,
    (d) => d.age_group,
    (d) => d.road_user,
  );
  const sexes = d3.rollup(
    rows,
    sum,
    (d) => d.year,
    (d) => d.sex,
  );
  const remoteness = d3.rollup(
    rows,
    sum,
    (d) => d.year,
    (d) => d.remoteness,
  );
  const cells = (year) =>
    AGE_GROUPS.filter((age) => ages.get(year)?.has(age)).flatMap((age) => {
      const row = ages.get(year).get(age);
      const total = d3.sum(row.values());
      // Null is intentionally distinct from an explicit zero. Never impute absent cells.
      return ROAD_USERS.map((user) => ({
        age,
        user,
        total,
        value: row.has(user) ? row.get(user) : null,
        share: row.has(user) && total > 0 ? row.get(user) / total : null,
      }));
    });
  return {
    rows,
    annual,
    road,
    sexes,
    remoteness,
    cells,
    maxCell: d3.max(YEARS.flatMap(cells), (d) => d.value) ?? 0,
    ageData(year, user = 'All') {
      return AGE_GROUPS.filter((age) => ages.get(year)?.has(age)).map((age) => {
        const group = ages.get(year).get(age);
        return {
          age,
          value:
            user === 'All'
              ? d3.sum(group.values())
              : group.has(user)
                ? group.get(user)
                : null,
        };
      });
    },
    series(user) {
      return YEARS.map((year) => ({
        year,
        user,
        value: road.get(year)?.get(user) ?? null,
      }));
    },
  };
}

export async function loadData() {
  if (!globalThis.d3)
    throw new Error('The local D3 library did not load. Check the vendor folder.');
  const source = await globalThis.d3.csv('data/road_crash_master.csv');
  return buildModel(validateRows(source, source.columns));
}
