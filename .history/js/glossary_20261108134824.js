// GenAI assistance is acknowledged in docs/AI-ACKNOWLEDGEMENT.md.
// Short definitions are paginated so the glossary never requires vertical scrolling.
export const TERMS = [
  {
    title: 'Hospitalised injuries',
    icon: 'bed',
    text:
      'Source-defined road traffic injury cases resulting in hospital admission. ' +
      'The source excludes in-hospital deaths within 30 days and applies ' +
      'care-episode rules to reduce duplicate cases. A count is not necessarily a ' +
      'count of distinct people or crashes.',
  },
  {
    title: 'Bed days',
    icon: 'calendar',
    text:
      'The total reported patient days of care. <b>Bed days</b> can include ' +
      'transferred-care episodes and cases ending in death. The master preserves ' +
      'the original <b>Bed days</b> field. These totals describe hospital resource use.',
  },
  {
    title: 'Sex',
    icon: 'chart',
    text:
      'The menu offers <u>All</u>, <u>Male</u> and <u>Female</u>. All retains the combined intersex, ' +
      'indeterminate or missing category as well; its 15 hospitalisations over ' +
      '2011–2021 are part of the national total. Selecting <u>Male</u> or <u>Female</u> selects ' +
      'only that recorded category.',
  },
  {
    title: 'Road user',
    icon: 'car',
    text:
      'The injured person’s role at the time of injury, such as car driver, ' +
      'passenger, motorcyclist, cyclist or pedestrian. All 12 source categories ' +
      'remain selectable. The donut’s <u>Other</u> road users combines the seven ' +
      'categories outside its five named groups.',
  },
  {
    title: 'Remoteness',
    icon: 'location',
    text:
      'The patient’s usual residential area, not the crash location. Regional ' +
      'combines inner and outer regional areas. Remote combines remote and very ' +
      'remote areas. Not recorded corresponds to the source’s other or unknown ' +
      'residence category.',
  },
  {
    title: 'Counterparty',
    icon: 'car',
    text:
      'The other vehicle, object or circumstance involved in the injury event. ' +
      'Categories include another car, a fixed object and a non-collision ' +
      'transport accident. It does not identify responsibility for a crash.',
  },
  {
    title: 'Age and reporting year',
    icon: 'calendar',
    text:
      'Age is measured at admission. Age bands have unequal spans; 75+ has no ' +
      'upper limit. Year is the calendar year of hospital separation. All years ' +
      'adds 2011–2021. A selected year sets snapshots and highlights the ' +
      'corresponding points on full-history charts.',
  },
  {
    title: 'Bed days per hospitalisation',
    icon: 'bed',
    text:
      'Divide summed reported bed days by summed hospitalisations. The two source ' +
      'measures have different episode and death rules, so this is a ratio of ' +
      'published totals, not a mean individual length of stay. A zero ' +
      'hospitalisation denominator produces an unavailable ratio.',
  },
  {
    title: 'Comparing years',
    icon: 'chart',
    text:
      'Victoria changed admission criteria in 2012; NSW changed criteria in 2017. ' +
      'The trend charts show those breaks. Changes in recorded counts can reflect ' +
      'reporting rules and population or travel changes. Counts alone do not ' +
      'measure individual risk.',
  },
  {
    title: 'Additional summary records',
    icon: 'info',
    text:
      'The combined CSV also contains state_annual and first_nations_annual ' +
      'records. They lack the joint demographic and counterparty fields required ' +
      'by these filters. The charts use national_detail only. Adding all three ' +
      'record types would count the same injuries more than once.',
  },
  {
    title: 'Rates and source',
    icon: 'book',
    text:
      'Population rates require matching population denominators. These are ' +
      'absent from the supplied master, so this website reports counts, shares ' +
      'and bed-day ratios. Data: BITRE September 2023 release, using the AIHW ' +
      'National Hospital Morbidity Database.',
    link: 'https://www.bitre.gov.au/resource/road-safety/hospitalised-injury',
    linkText: 'Open the BITRE source',
  },
  {
    title: 'Project and acknowledgements',
    icon: 'book',
    text:
      'COS30045 · Group 3. Data processing: the supplied KNIME workflow. Charts: ' +
      'D3.js v7.9.0, ISC licence. OpenAI Codex assisted with the implementation ' +
      'and checks; the prompt summary and data limitations are documented with ' +
      'the code.',
    link: 'data/road_crash_master.csv',
    linkText: 'Download the supplied master CSV',
  },
];
