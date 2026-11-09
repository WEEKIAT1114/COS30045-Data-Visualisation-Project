// GenAI-assisted code. See docs/AI-ACKNOWLEDGEMENT.md.
// Keep category order in one place so controls, charts and tables agree.
export const YEARS = Array.from({ length: 11 }, (_, index) => 2011 + index);

export const AGE_GROUPS = [
  '0-7',
  '8-16',
  '17-25',
  '26-39',
  '40-64',
  '65-74',
  '75+'
];

export const ROAD_USERS = [
  'Car driver',
  'Car passenger',
  'Motorcyclist',
  'Pedal cyclist',
  'Pedestrian',
  'Car unknown position',
  'Heavy transport driver',
  'Heavy transport passenger',
  'Heavy transport unknown position',
  'Pick-up truck or van occupant',
  'Bus occupant'
];

export const COUNTERPARTIES = [
  'Car, pick-up truck or van',
  'Non-collision transport accident',
  'Fixed or stationary object',
  'Other and unspecified transport accidents',
  'Heavy transport vehicle or bus',
  'Pedestrian or animal',
  'Pedal cycle',
  '2- or 3- wheeled motor vehicle',
  'Other non-motor vehicle',
  'Train',
];

export const FILTERS = [
  { key: 'year', label: 'Year', values: YEARS, all: 'All years' },
  {
    key: 'remoteness',
    label: 'Remoteness',
    values: ['Major Cities', 'Regional', 'Remote'],
  },
  { key: 'road_user', label: 'Road user', values: ROAD_USERS },
  { key: 'sex', label: 'Sex', values: ['Male', 'Female'] },
  { key: 'age_group', label: 'Age group', values: AGE_GROUPS },
  { key: 'counterparty', label: 'Counterparty', values: COUNTERPARTIES },
];

export const COLORS = [
  '#003087', // NHS Dark Blue
  '#005EB8', // NHS Primary Blue
  '#4C9EEB', // A lighter blue for contrast
  '#CCDFF1', // NHS Light Blue
  '#212B32', // NHS Text (Dark grey)
  '#535e76', // Muted cool grey
  '#8B99AF', // Medium cool grey
  '#B5C2D4', // Soft grey-blue
  '#0072CE', // Bright blue
  '#E8EDEE', // Very light grey
  '#333333', // Dark charcoal
  '#768692'  // Neutral slate
];

export function label(value) {
  if (value === 'Missing') return 'Not recorded';
  if (value === '75+') return '75+';
  return String(value).replace(/(\d)-(\d)/g, '$1–$2');
}

export function formatNumber(value) {
  return value == null ? 'Unavailable' : new Intl.NumberFormat('en-AU').format(value);
}

export function formatRatio(value) {
  return value == null ? 'Unavailable' : value.toFixed(1);
}

export const DEFAULT_FILTERS = {
  year: '2021',
  remoteness: 'All',
  road_user: 'All',
  sex: 'All',
  age_group: 'All',
  counterparty: 'All',
};

export const CHARTS = {
  annual: {
    title: 'Annual hospitalised injuries',
    question: 'How has the recorded hospital burden changed?',
    info: 'Counts use the selected remoteness, road user, sex, age and counterparty. The line retains 2011–2021 as context; the year filter highlights the snapshot.',
  },
  age: {
    title: 'Hospitalised injuries by age group',
    question: 'Which age groups account for the most admissions?',
    info: 'Bars start at zero and use chronological age order. The age bands have unequal spans and population sizes.',
  },
  stateMap: {
    title: 'Hospitalised injuries by state/territory',
    question: 'How are hospitalisations distributed across Australia?',
    info: 'This map uses state_annual records. Demographic filters do not apply. Values show the total counts for the selected year snapshot.',
  },
  distribution: {
    title: 'Hospitalised injuries by road user',
    question: 'How is the burden distributed across road users?',
    info: 'Five named road-user categories are shown separately. Percentages use the complete filtered count.',
  },
  trends: {
    title: 'Road-user trends',
    question: 'Do the leading road users follow the same pattern?',
    info: 'The three largest road-user totals over the filtered full period are compared. Selecting a road user shows that one series.',
  },
  heatmap: {
    title: 'Age group and road user',
    question: 'How do age and road user combine?',
    info: 'Cell colour and labels show hospitalisation counts. The colour scale uses the largest cell in the complete filtered snapshot.',
  },
  counterparty: {
    title: 'Hospitalisations by counterparty',
    question: 'What vehicle or object was involved?',
    info: 'Each treemap area is proportional to the filtered count. Small rectangles keep exact values in keyboard/pointer tooltips.',
  },
  scatter: {
    title: 'Hospital burden by road user',
    question: 'Which road users combine volume with bed-day burden?',
    info: 'Horizontal position shows hospitalisations; vertical position is reported bed days divided by hospitalisations.',
  },
  firstNations: {
    title: 'Hospitalisations by First Nations Status',
    question: 'What are the trends for First Nations people?',
    info: 'This chart uses first_nations_annual records from 2011-2021. Demographic filters do not apply.',
  },
};

export const PAGE_CHARTS = {
  overview: ['annual', 'age', 'stateMap', 'distribution'],
  insights: ['trends', 'heatmap', 'counterparty', 'scatter', 'firstNations'],
};
