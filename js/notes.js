// Reviewed source notes; GenAI assistance acknowledged in main.js.
export const INFO = {
  source: [
    {
      title: 'The source and scope',
      html: /* HTML */ `<p>
        BITRE’s September 2023 national workbook uses the AIHW National Hospital
        Morbidity Database. The website uses Group 3’s
        <strong>road_crash_master.csv</strong>: 5,178 grouped records, calendar years
        2011–2021, Traffic cause only.
      </p>`,
    },
    {
      title: 'From KNIME to D3',
      html: /* HTML */ `<p>
        Hospitalisations are summed by year, usual-residence remoteness, age at
        admission, sex and road user. D3 aggregates the export for each chart. All 5,178
        groups and 11 annual totals reconcile with the original workbook.
      </p>`,
    },
    {
      title: 'What the count means',
      html: /* HTML */ `<p>
        The full period totals <strong>410,884 hospitalisations</strong>, not
        necessarily distinct people. The source applies care-episode exclusions to
        reduce double counting and excludes its in-hospital death cases. Injuries
        treated without admission are outside this measure.
      </p>`,
    },
  ],
  limits: [
    {
      title: 'Breaks in the series',
      html: /* HTML */ `<p>
        Victoria changed admission criteria in 2012; NSW changed them in 2017. Counts
        before and after those boundaries are not directly comparable. Indexed count
        changes do not remove these breaks.
      </p>`,
    },
    {
      title: 'Burden is different from risk',
      html: /* HTML */ `<p>
        Groups differ in population size and travel exposure. Counts, shares and indices
        do not measure individual risk. Age bands have unequal spans; ages 40–64 cover
        25 years and 75+ is open-ended.
      </p>`,
    },
    {
      title: 'Unknown categories are retained',
      html: /* HTML */ `<p>
        The full period includes one missing-age admission (2014), 15 in the combined
        intersex/indeterminate/missing sex category and 8,833 with missing remoteness.
        Missing residence corresponds to the source’s other/unknown category.
      </p>`,
    },
    {
      title: 'Place and reporting period',
      html: /* HTML */ `<p>
        Remoteness is the patient’s usual residence, not where the crash happened. This
        historical release ends in 2021 and is subject to revision. Broader AIHW
        transport/injury figures use different periods and scope and are not combined
        here.
      </p>`,
    },
  ],
  references: [
    {
      title: 'National count dataset',
      html: /* HTML */ `<p>
          Bureau of Infrastructure and Transport Research Economics. (2023, September
          22). <em>Hospitalised injury</em> [Data set].
        </p>
        <a href="https://www.bitre.gov.au/resource/road-safety/hospitalised-injury"
          >BITRE source and downloads ↗</a
        >`,
    },
    {
      title: 'Technical definitions',
      html: /* HTML */ `<p>
          Bureau of Infrastructure and Transport Research Economics. (2023, September).
          <em>Hospitalised injuries from road crashes: Data dictionary.</em>
        </p>
        <a href="https://www.bitre.gov.au/resource/road-safety/hospitalised-injury"
          >Dictionary with the national workbook ↗</a
        >`,
    },
    {
      title: 'Background context',
      html: /* HTML */ `<p>
          Australian Institute of Health and Welfare. (2026).
          <em>Injury in Australia.</em> Context only; its wider transport totals are not
          combined with this series.
        </p>
        <a
          href="https://www.aihw.gov.au/reports/injury/injury-in-australia/contents/about"
          >AIHW report ↗</a
        >`,
    },
    {
      title: 'D3 and accessible encoding',
      html: /* HTML */ `<p>
          Observable. (n.d.). <em>D3 documentation.</em> D3 v7.9.0, ISC licence. World
          Wide Web Consortium. (n.d.). <em>Understanding SC 1.4.1: Use of color.</em>
        </p>
        <a href="https://d3js.org/">D3 ↗</a> ·
        <a href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"
          >W3C guidance ↗</a
        >`,
    },
  ],
  accessibility: [
    {
      title: 'Keyboard and exact values',
      html: /* HTML */ `<p>
        Tab to controls and marks. Enter or Space activates a selection; Escape
        dismisses a tooltip. Each chart has a separate, paginated data table. Download
        the CSV for the full export.
      </p>`,
    },
    {
      title: 'Readable fixed-screen pages',
      html: /* HTML */ `<p>
        Each page fits the viewport. Charts recompute their geometry when resized.
        Narrow heatmaps show subsets of columns with Previous/Next controls, keeping all
        categories accessible. Source notes and tables are paginated.
      </p>`,
    },
    {
      title: 'Colour and motion',
      html: /* HTML */ `<p>
        Road-user series combine colour, line patterns, symbols and text. Matrix values
        have contrasting text; explicit zeroes and absent records differ. Reduced-motion
        settings disable transitions. These features are not a claim of complete WCAG
        conformance.
      </p>`,
    },
  ],
};
