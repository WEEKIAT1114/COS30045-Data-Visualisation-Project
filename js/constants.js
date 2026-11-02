// GenAI-assisted implementation; see docs/AI-ACKNOWLEDGEMENT.md for prompt summary.
export const YEARS = Array.from({ length: 11 }, (_, i) => 2011 + i);
export const AGE_GROUPS = [
  '0-7',
  '8-16',
  '17-25',
  '26-39',
  '40-64',
  '65-74',
  '75+',
  'Missing',
];
export const ROAD_USERS = [
  'Car driver',
  'Motorcyclist',
  'Pedal cyclist',
  'Car passenger',
  'Pedestrian',
  'Car unknown position',
  'Other or unknown',
  'Heavy transport driver',
  'Pick-up truck or van occupant',
  'Bus occupant',
  'Heavy transport passenger',
  'Heavy transport unknown position',
];
export const PRIMARY_USERS = ROAD_USERS.slice(0, 3);
export const SEXES = ['Female', 'Male', 'intersex or indeterminate or missing'];
export const REMOTENESS = ['Major Cities', 'Regional', 'Remote', 'Missing'];
export const SERIES_STYLES = [
  { dash: null, symbol: 'circle', glyph: '●' },
  { dash: '7 4', symbol: 'square', glyph: '■' },
  { dash: '2 4', symbol: 'triangle', glyph: '▲' },
  { dash: '9 3 2 3', symbol: 'diamond', glyph: '◆' },
];
export const number = (value) =>
  value == null ? '—' : new Intl.NumberFormat('en-AU').format(value);
export const percent = (value) =>
  value == null || !Number.isFinite(value) ? '—' : `${(value * 100).toFixed(1)}%`;
export const ageLabel = (age) => (age === 'Missing' ? 'Age not recorded' : age);
export const compactRoadLabel = (road) =>
  ({
    'Car unknown position': ['Car', 'position', 'unknown'],
    'Other or unknown': ['Other or', 'unknown'],
    'Heavy transport driver': ['Heavy', 'transport', 'driver'],
    'Heavy transport passenger': ['Heavy', 'transport', 'passenger'],
    'Heavy transport unknown position': ['Heavy', 'transport', 'position', 'unknown'],
    'Pick-up truck or van occupant': ['Pick-up /', 'van occupant'],
    'Car driver': ['Car', 'driver'],
    'Car passenger': ['Car', 'passenger'],
    'Bus occupant': ['Bus', 'occupant'],
    Motorcyclist: ['Motorcyclist'],
    'Pedal cyclist': ['Pedal', 'cyclist'],
    Pedestrian: ['Pedestrian'],
  })[road];
