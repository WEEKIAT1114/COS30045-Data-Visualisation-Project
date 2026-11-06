// GenAI assistance is acknowledged in docs/AI-ACKNOWLEDGEMENT.md.
// Pure data functions: these can be tested without a browser or chart code.
import { AGE_GROUPS, ROAD_USERS, YEARS, FILTERS } from './config.js';

export function validateRows(rawRows) {
  if (!rawRows.length) throw new Error('The CSV contains no records.');
  const required = [
    'record_type',
    'year',
    'remoteness',
    'age_group',
    'sex',
    'road_user',
    'counterparty',
    'state',
    'indigenous_status',
    'hospitalisations',
    'bed_days',
  ];
  for (const field of required) {
    if (!(field in rawRows[0])) throw new Error(`CSV column missing: ${field}`);
  }

  const knownTypes = ['national_detail', 'state_annual', 'first_nations_annual'];
  const seen = new Set();

  return rawRows.map((raw, index) => {
    const row = { ...raw };
    row.year = Number(raw.year);
    if (!YEARS.includes(row.year) || !knownTypes.includes(row.record_type)) {
      throw new Error(`Invalid year or record type on CSV row ${index + 2}.`);
    }
    for (const field of ['hospitalisations', 'bed_days']) {
      row[field] = raw[field] === '' ? null : Number(raw[field]);
      if (
        row[field] !== null &&
        (!Number.isSafeInteger(row[field]) || row[field] < 0)
      ) {
        throw new Error(`Invalid ${field} on CSV row ${index + 2}.`);
      }
    }
    if (row.hospitalisations === null)
      throw new Error('A hospitalisation count is missing.');

    if (row.record_type === 'national_detail') {
      if (row.bed_days === null) throw new Error('National bed days are missing.');
      for (const field of FILTERS.filter((item) => item.key !== 'year')) {
        let values = field.values;
        if (field.key === 'sex') {
          values = [...field.values, 'intersex or indeterminate or missing'];
        } else if (field.key === 'age_group') {
          values = [...field.values, 'Missing']; 
        }

        if (!values.includes(row[field.key]))
          throw new Error(`Unknown ${field.key}: ${row[field.key]}`);
      }
      const key = [
        row.year,
        row.remoteness,
        row.age_group,
        row.sex,
        row.road_user,
        row.counterparty,
      ].join('|');
      if (seen.has(key)) throw new Error(`Duplicate national record: ${key}`);
      seen.add(key);
    }
    return row;
  });
}

export function filterNational(rows, filters, includeYear = true) {
  // Never add the national, state and First Nations summaries together.
  return rows.filter((row) => {
    if (row.record_type !== 'national_detail') return false;
    for (const field of FILTERS) {
      if (field.key === 'year' && !includeYear) continue;
      const selected = filters[field.key];
      if (selected !== 'All' && String(row[field.key]) !== selected) return false;
    }
    return true;
  });
}

export function totals(rows) {
  let count = 0;
  let beds = 0;
  for (const row of rows) {
    count += row.hospitalisations;
    beds += row.bed_days;
  }
  return { count, beds, ratio: count > 0 ? beds / count : null, records: rows.length };
}

export function groupRows(rows, field, order = null) {
  const groups = new Map();
  for (const row of rows) {
    const key = row[field];
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  const keys = order || [...groups.keys()];
  return keys
    .filter((key) => groups.has(key))
    .map((key) => ({ key, ...totals(groups.get(key)) }));
}

export function annualData(rows) {
  const grouped = new Map(groupRows(rows, 'year').map((item) => [item.key, item]));
  return YEARS.map((year) => ({
    key: year,
    ...(grouped.get(year) || { count: null, beds: null, ratio: null }),
  }));
}

export function distributionData(rows, roadFilter) {
  if (roadFilter !== 'All') return groupRows(rows, 'road_user', ROAD_USERS);
  const groups = groupRows(rows, 'road_user', ROAD_USERS);
  const result = groups.filter((item) => ROAD_USERS.slice(0, 5).includes(item.key));
  const others = groups.filter((item) => !ROAD_USERS.slice(0, 5).includes(item.key));
  if (others.length)
    result.push({
      key: 'Other road users',
      count: others.reduce((sum, item) => sum + item.count, 0),
    });
  return result;
}

export function matrixData(rows) {
  const ages = groupRows(rows, 'age_group', AGE_GROUPS).map((item) => item.key);
  const users = groupRows(rows, 'road_user', ROAD_USERS).map((item) => item.key);
  const cells = new Map();
  for (const row of rows) {
    const key = `${row.age_group}|${row.road_user}`;
    cells.set(key, (cells.get(key) || 0) + row.hospitalisations);
  }
  return ages.flatMap((age) =>
    users.map((user) => ({
      age,
      user,
      count: cells.has(`${age}|${user}`) ? cells.get(`${age}|${user}`) : null,
    })),
  );
}
