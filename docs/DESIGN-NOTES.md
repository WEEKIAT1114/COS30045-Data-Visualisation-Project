# Design and D3 implementation

The user requested the three reference layouts, a fixed screen without vertical
scrolling, the supplied sand/lavender/navy palette and readable student code.
After the data review, the user chose a five-chart Insights page instead of rates
without population denominators.

## Structure and story

Overview introduces recorded hospital burden through the national trend and its
age, residential-remoteness and road-user distribution. Insights moves to
relationships between dimensions, counterparty and bed-day burden. The glossary
explains source scope, calculations and interpretation. Each chart poses a
specific question, has an information panel and provides equivalent exact data.

Four charts appear on Overview; five appear on Insights. Wider screens show the
whole grid. Narrow screens use Previous/Next chart controls, preserving the same
four/five-chart collection. Dense bars and matrices paginate categories. An
expanded chart page provides more space without changing the selected records.

## Theory used

| Lecture idea | Implementation |
| --- | --- |
| Marks and channels | Lines use time and common vertical position; bars use zero-based length; scatter uses two quantitative positions |
| Nominal and ordered data | Stable road-user identities, chronological age order, actual year spacing |
| Proportion and hierarchy | Donut shows broad composition; treemap area shows counterparty share, with exact values available |
| Sequential colour | Heatmap lightness decreases with count; count labels supplement colour |
| Interaction design | Six linked filters, mark selection, reset, details on demand and consistent cross-page state |
| Accessibility | Native labelled controls, semantic headings, keyboard detail/selection, pattern/shape line distinctions, high-contrast labels and data tables |
| Cognitive load | Two-stage Overview/Insights story, consistent palette, restrained chart titles and direct values |
| Validation | Original-workbook reconciliation, record-grain checks, regression tests and actual responsive browser review |

The line plots retain explicit gaps at both source-policy breaks. No smoothing
or estimated observations are added. Age bands are categorical, not equal-width
histogram bins. Charts and glossary explain why counts do not establish risk.

## Read the code

`app.js` reads validated URL selections, builds controls, loads the CSV, calls
`filterNational` and redraws the current page. Page visibility is changed for all
cards before measuring SVG hosts, which prevents blank charts during resizing.

`data.js` keeps the counting logic separate from presentation. `charts.js`
contains explicit functions for scales, axes, marks and interaction. D3 is used
directly for every chart: `scaleLinear`, `scaleBand`, `line`, `pie`/`arc`,
`hierarchy`/`treemap`, axes and SVG data joins. No charting framework or generated
chart images are used in the website.

The code is formatted with two spaces and separated statements/declarations.
Comments explain calculations, source scope and non-obvious layout choices.
The minified D3 distribution remains an unchanged third-party dependency with
its licence. The team should understand and adapt the code, conduct genuine
usability evaluation, and document its own design iterations in the Design Book.
