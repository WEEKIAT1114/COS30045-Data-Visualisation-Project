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
  'Heavy transport driver',
  'Heavy transport passenger',
  'Heavy transport unknown position',
  'Pick-up truck or van occupant',
  'Bus occupant',
  'Other or unknown',
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
    values: ['Major Cities', 'Regional', 'Remote', 'Missing'],
  },
  { key: 'road_user', label: 'Road user', values: ROAD_USERS },
  { key: 'sex', label: 'Sex', values: ['Male', 'Female'] },
  { key: 'age_group', label: 'Age group', values: AGE_GROUPS },
  { key: 'counterparty', label: 'Counterparty', values: COUNTERPARTIES },
];

export const COLORS = [
  '#37507e',
  '#7178aa',
  '#9298c6',
  '#dfc7ba',
  '#a66b54',
  '#626b7d',
  '#78618b',
  '#536e83',
  '#98705c',
  '#4b7771',
  '#806475',
  '#706e4f',
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
    info:
      'Counts use the selected remoteness, road user, sex, age and counterparty. ' +
      'The line retains 2011–2021 as context; the year filter highlights the ' +
      'snapshot. Gaps mark changes to admission criteria in Victoria (2012) and ' +
      'NSW (2017). Counts on either side are not directly comparable.',
  },
  age: {
    title: 'Hospitalised injuries by age group',
    
    question: 'Which age groups account for the most admissions?',
    info:
      'Bars start at zero and use chronological age order. The age bands have ' +
      'unequal spans and population sizes, so a larger count does not demonstrate ' +
      'greater individual risk. Not-recorded age is retained when present.',
  },
  remoteness: {
    title: 'Hospitalised injuries by remoteness',
    
    question: 'Where do the injured people usually live?',
    info:
      'Remoteness describes the patient’s usual residence. Regional combines ' +
      'inner and outer regional areas; Remote combines remote and very remote ' +
      'areas. Not-recorded residence remains in the totals. These are counts, not ' +
      'population rates.',
  },
  distribution: {
    title: 'Hospitalised injuries by road user',
    
    question: 'How is the burden distributed across road users?',
    info:
      'Five named road-user categories are shown separately. Other road ' +
      'users combines the remaining seven source categories; it is broader than ' +
      'the source category “Other or unknown”. A selected road-user filter is ' +
      'shown under its own name. Percentages use the complete filtered count.',
  },
  trends: {
    title: 'Road-user trends',
    
    question: 'Do the leading road users follow the same pattern?',
    info:
      'The three largest road-user totals over the filtered full period are ' +
      'compared. Selecting a road user shows that one series. Colour is ' +
      'reinforced with distinct point shapes and line patterns. Admission-policy ' +
      'breaks are retained, and no smoothing is applied.',
  },
  heatmap: {
    title: 'Age group and road user',
    
    question: 'How do age and road user combine?',
    info:
      'Cell colour and labels show hospitalisation counts. The colour scale uses ' +
      'the largest cell in the complete filtered snapshot, including cells on ' +
      'other matrix pages. A dash means no source record; a recorded zero remains ' +
      '0. Paging preserves readable labels and access to every row and column.',
  },
  counterparty: {
    title: 'Hospitalisations by counterparty',
    
    question: 'What vehicle or object was involved?',
    info:
      'A counterparty is the other vehicle, object or non-collision circumstance ' +
      'involved in the injury event. Each treemap area is proportional to the ' +
      'filtered count. Small rectangles keep exact values in keyboard/pointer ' +
      'tooltips and the data table; missing labels do not remove records.',
  },
  scatter: {
    title: 'Hospital burden by road user',
   
    question: 'Which road users combine volume with bed-day burden?',
    info:
      'Each point is one road-user category. Horizontal position shows ' +
      'hospitalisations; vertical position is reported bed days divided by ' +
      'hospitalisations, calculated from summed totals. This is a source-total ' +
      'burden ratio, not the mean length of stay of individual patients. A zero ' +
      'denominator has no ratio.',
  },
  bedAge: {
    title: 'Bed-day burden by age group',
    
    question: 'How does recorded bed-day burden vary by age?',
    info:
      'For each age group, divide total reported bed days by total ' +
      'hospitalisations. Do not average row-level ratios. Bed days include ' +
      'transferred-care episodes and the master retains bed days from cases ' +
      'ending in death, while its hospitalisation count excludes in-hospital ' +
      'deaths within 30 days. Interpret the result as a ratio of published ' +
      'totals.',
  },
};

export const PAGE_CHARTS = {
  overview: ['annual', 'age', 'remoteness', 'distribution'],
  insights: ['trends', 'heatmap', 'counterparty', 'scatter', 'bedAge'],
};
