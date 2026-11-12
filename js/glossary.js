// Plain-language glossary. Every topic is available on one fixed-screen page.
// GenAI assistance is acknowledged in docs/AI-ACKNOWLEDGEMENT.md.
export const TERMS = [
  {
    title: 'Hospitalised injuries',
    shortTitle: 'Admissions',
    icon: 'bed',
    summary: 'Hospital admissions after a road crash.',
    text:
      'These figures count hospital admissions following road traffic injuries. ' +
      'A person may have more than one admission. The source applies rules to ' +
      'reduce duplicate care episodes and excludes in-hospital deaths within 30 days.',
  },
  {
    title: 'Bed days',
    shortTitle: 'Bed days',
    icon: 'calendar',
    summary: 'The total days of hospital care recorded.',
    text:
      'Bed days add up the days of care recorded across hospital episodes. ' +
      'They help describe the demand on hospital services. The supplied total ' +
      'can include transferred-care episodes and cases ending in death.',
  },
  {
    title: 'Sex',
    shortTitle: 'Sex',
    icon: 'chart',
    summary: 'The sex recorded in the hospital data.',
    text:
      'Choose All, Male or Female in the filter. All also retains the source’s ' +
      'combined intersex, indeterminate or missing category. That category ' +
      'accounts for 15 hospitalisations across 2011–2021.',
  },
  {
    title: 'Road user',
    shortTitle: 'Road users',
    icon: 'car',
    summary: 'The injured person’s role on the road.',
    text:
      'This describes the person who was injured: a driver, passenger, ' +
      'motorcyclist, pedal cyclist or pedestrian, for example. The Road user ' +
      'filter focuses on a selected role. Broader Other groupings should be ' +
      'read with the chart’s own explanation.',
  },
  {
    title: 'Remoteness',
    shortTitle: 'Home area',
    icon: 'location',
    summary: 'Whether the patient lives in a city, regional or remote area.',
    text:
      'Remoteness describes the patient’s usual home area. Regional combines ' +
      'inner and outer regional areas; Remote combines remote and very remote ' +
      'areas. The source also has other or unknown residence records, although ' +
      'the current menu does not list those separately.',
  },
  {
    title: 'Counterparty',
    shortTitle: 'Counterparty',
    icon: 'car',
    summary: 'The other vehicle, object or circumstance involved.',
    text:
      'Counterparty means what else was involved in the injury event. It may ' +
      'be another vehicle, a fixed object, or a non-collision circumstance. ' +
      'This category does not tell us who was responsible for a crash.',
  },
  {
    title: 'Age and reporting year',
    shortTitle: 'Age & year',
    icon: 'calendar',
    summary: 'Age at admission and the year the hospital episode ended.',
    text:
      'Age is recorded at admission. Year refers to the calendar year of ' +
      'hospital separation. A selected year sets the snapshots and highlights ' +
      'the trend points; All years combines 2011–2021. Age bands cover ' +
      'different spans, and 75+ has no upper limit.',
  },
  {
    title: 'Bed days per hospitalisation',
    shortTitle: 'Bed-day ratio',
    icon: 'bed',
    summary: 'Reported bed days divided by hospitalisations.',
    text:
      'We divide summed reported bed days by summed hospitalisations. The two ' +
      'measures use different care-episode and death rules, so this describes ' +
      'hospital burden rather than an individual’s average stay. A zero ' +
      'hospitalisation total has no available ratio.',
  },
  {
    title: 'Comparing years',
    shortTitle: 'Year comparisons',
    icon: 'chart',
    summary: 'Reporting-rule changes can affect the trends.',
    text:
      'Admission criteria changed in Victoria in 2012 and NSW in 2017. ' +
      'Differences across these years can reflect reporting rules as well as ' +
      'changes in injuries, population and travel. Keep those changes in mind ' +
      'when interpreting a rise or fall.',
  },
  {
    title: 'Additional summary data',
    shortTitle: 'Extra data',
    icon: 'info',
    summary: 'State and First Nations figures have a different level of detail.',
    text:
      'The master also includes annual state and First Nations summaries. ' +
      'They do not contain every demographic and counterparty field together. ' +
      'Read those summaries within their supported scope, and avoid adding ' +
      'them to national detail as extra injuries.',
  },
  {
    title: 'Rates and data sources',
    shortTitle: 'Rates & sources',
    icon: 'book',
    summary: 'Where the figures come from and what a rate needs.',
    text:
      'Population rates need a matching population denominator. Those inputs ' +
      'are absent here, so the measures are counts, shares and bed-day ratios. ' +
      'The data comes from BITRE’s September 2023 release, using the AIHW ' +
      'National Hospital Morbidity Database.',
    link: 'https://www.bitre.gov.au/resource/road-safety/hospitalised-injury',
    linkText: 'Visit the BITRE source',
  },
  {
    title: 'About this project',
    shortTitle: 'The project',
    icon: 'book',
    summary: 'The people, tools and acknowledgements behind the dashboard.',
    text:
      'Created by Group 3 for COS30045. The data was prepared in KNIME and ' +
      'the interactive charts use D3.js. OpenAI Codex helped with implementation ' +
      'and checks; acknowledgements and data notes are included with the code.',
    link: 'data/road_crash_master.csv',
    linkText: 'Download the source CSV',
  },
];
