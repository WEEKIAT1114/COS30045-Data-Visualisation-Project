# Road Crash Hospitalisation Dashboard

COS30045 · Group 3. A fixed-screen D3.js website using the updated KNIME export.
The design follows the supplied navy, lavender and sand reference screens.

## Run locally

Open `index.html` with VS Code Live Server, or run:

```powershell
cd "C:\Users\Edward\Downloads\COS30045-Data-Visualisation-Project"
node server.mjs
```

Open the printed URL, normally `http://127.0.0.1:8080`. If that port is already in
use, set `$env:PORT = '8082'` before running the server. Stop it with Ctrl+C.
The website needs HTTP for its CSV and JavaScript modules. No package installation,
framework or build step is needed. D3 v7.9.0 is included locally with its licence.

## Pages and interactions

- **Overview:** exactly four charts: annual hospitalisations, age groups,
  remoteness and road-user distribution. The two summary cards show the matching
  count and reported bed days per hospitalisation.
- **Insights:** exactly five charts: road-user trends, age/road-user heatmap,
  counterparty treemap, count/bed-day scatterplot and bed-day burden by age.
- **Glossary:** paginated definitions, source notes and calculation limits.
- **Expanded chart:** each chart's expand icon opens a larger view in `chart.html`.

Six shared filters select year, remoteness, road user, sex, age and counterparty.
The Sex menu offers exactly **All, Male, Female**. All retains the source's
unrecorded categories. Year controls snapshots and highlighted points; line
charts retain the full 2011–2021 context under the other five filters. All years
adds the complete period in snapshot charts. Selections travel between pages.

Select bars, treemap areas, line points or heatmap cells to explore linked groups.
Reset all returns to the unfiltered 2021 snapshot. Keyboard focus reveals the
same details as pointer hover; Enter/Space selects a mark and Escape hides its
tooltip. Each information button opens chart guidance and a paginated data table.
The download button exports matching national detail records.

Each page fits the viewport. Narrow screens show one of the page's four/five
charts at a time. Matrix and bar paging keeps labels readable, and the expanded
view offers more space. No chart categories are removed by pagination.

## Understand the code

The code uses multiple lines and two-space indentation. The supplied Prettier
settings maintain that style; the original CSV and third-party library are
excluded from formatting.

| File | Purpose |
| --- | --- |
| `index.html`, `insights.html`, `glossary.html`, `chart.html` | Simple page entries |
| `css/styles.css` | Colours, fixed-screen grids and responsive layouts |
| `js/app.js` | Page setup, controls, shared filter state and data tables |
| `js/config.js` | Ordered categories, palette and chart explanations |
| `js/data.js` | Validation, filtering and aggregation; no DOM dependencies |
| `js/charts.js` | The nine D3 chart functions |
| `js/ui.js` | Header, chart frames, SVG interaction and tooltips |
| `js/glossary.js` | Short source definitions |
| `data/road_crash_master.csv` | Byte-identical updated KNIME export |
| `tests/data.test.mjs` | Data and filtering regression checks |

Read a chart function in this order: prepare values, define scales, add axes,
join data to SVG marks, add keyboard/pointer interaction, return table rows.

## Check the data and implementation

```powershell
node --test tests/*.test.mjs
```

See [data notes](docs/DATA-NOTES.md), [design notes](docs/DESIGN-NOTES.md) and the
[GenAI acknowledgement](docs/AI-ACKNOWLEDGEMENT.md).

The current nine charts need no additional export. Fully filterable state or
First Nations charts need joint detail that is absent from their annual summary
records. Population rates need compatible denominators. Those values are not
invented. The team still needs its own Design Book, real usability evaluation and
verified assessment-hosting links.
