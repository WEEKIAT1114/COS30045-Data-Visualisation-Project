# Road Injury Australia

A fixed-screen D3 dashboard about hospitalised road crash injuries in Australia, using Group 3's verified KNIME export for 2011–2021. The current design follows the supplied four-chart wireframe.

## Open the website

Open this folder in VS Code and use **Live Server** on `index.html`, or run:

```powershell
cd "C:\Users\Edward\Downloads\COS30045-Data-Visualisation-Project"
node server.mjs
```

Open the Local URL printed by the server, normally `http://127.0.0.1:8080`. No package installation or build is needed. Double-clicking the HTML file uses `file://`, which does not reliably load CSV/modules. Stop the preview with Ctrl+C.

If port 8080 is occupied, set `$env:PORT = '8082'` before starting the server. Node is only needed for this optional preview and tests; the deployed website is static.

## Current layout and behaviour

- Header with project/course identity, navigation, and a shared filter row.
- Desktop 2×2 charts: annual line, age bars, age × road-user matrix, road-user lines.
- Filters: snapshot year, remoteness, age group, sex and road user.
- The year selects snapshots and highlighted points; trends retain 2011–2021. Every other filter applies to all four charts.
- Separate **Hospitalised injuries**, **Injury rates** and **Glossary** pages. The rates page explains the missing population data; it does not show calculated rates.
- Expand and Data links on each chart preserve selections in the URL.
- Smaller windows use chart paging. Matrix sections, age rows, tables and notes paginate when necessary; pages do not scroll down.
- Keyboard details and activation, explicit empty/zero handling, shape/pattern/text in addition to colour, and table alternatives.

Use a full-width desktop browser to see all four panels together. In a narrow Codex side panel, the responsive chart pager appears.

## Data and assessment readiness

Read [DASHBOARD-AND-DATA-READINESS.md](docs/DASHBOARD-AND-DATA-READINESS.md). The original master CSV supports all current count charts and filters. A matched population dataset is needed for rates; combined demographic rate filters require joint population records. More static chart images alone do not establish an HD.

The team still needs the actual Design Book PDF, genuine usability evaluation, documented refinements, understanding of the code, and verified Mercury/GitHub submission links. The supporting documents do not claim that participant testing, hosting or assessment submission has occurred.

Other supporting files:

- [PROJECT-REVIEW.md](docs/PROJECT-REVIEW.md): document review and rubric mapping.
- [DATA-AUDIT.md](docs/DATA-AUDIT.md): exact source reconciliation and definitions.
- [DESIGN-RATIONALE.md](docs/DESIGN-RATIONALE.md): theory, interactions and recorded design iterations.
- [USABILITY-EVALUATION.md](docs/USABILITY-EVALUATION.md): a protocol to conduct with real participants.
- [AI-ACKNOWLEDGEMENT.md](docs/AI-ACKNOWLEDGEMENT.md): actual assistance and prompt summary.
- [VALIDATION.md](docs/VALIDATION.md): data and browser checks.

## Code structure

Source files use multiple lines, consistent two-space indentation and separated
CSS declarations, JavaScript statements and D3 method chains. HTML templates in
JavaScript are also expanded so their nested elements are visible.

The shared formatting settings are in `.prettierrc.json`. The `/* HTML */`
comments identify embedded markup for Prettier; they have no runtime behaviour.
`.prettierignore` preserves the original CSV and the third-party D3 distribution.

| File | Responsibility |
| --- | --- |
| Nine HTML files | Dashboard, rates, glossary, four expanded charts, sources and tables |
| `css/style.css` | Fixed-screen grid and responsive layouts |
| `js/pages.js`, `js/notes.js` | Shared page templates, sources and glossary content |
| `js/main.js` | Filter state, linked updates, resize and pagination |
| `js/data.js` | CSV validation, shared filtering and aggregation |
| `js/dashboard-charts.js` | Four charts constructed directly with D3 |
| `js/navigation.js` | Validated URL state and pagination helpers |
| `js/constants.js`, `js/ui.js` | Categories, formatting, SVG frames, tooltips and tables |
| `data/road_crash_master.csv` | Byte-identical copy of the supplied KNIME export |
| `vendor/` | Pinned D3 v7.9.0 and its ISC licence |

## Verify

```powershell
node --test tests/*.test.mjs
```

All 22 checks pass. They cover the CSV fingerprint, annual totals, each categorical filter, combined intersections, retained unknowns, empty/zero cases, share denominators, URL preservation and pagination.

## Mercury deployment

Upload all nine HTML files (`index.html`, `rates.html`, `glossary.html`, `decade.html`, `road-users.html`, `age.html`, `intersection.html`, `about.html`, `table.html`), `favicon.svg`, `css/`, `js/`, `data/` and `vendor/`. Preserve relative paths and keep the D3 licence. Node/npm are not needed on Mercury. Exclude tests and private assessment notes from the public web directory unless you intend to publish them.

Verify the actual hosted URL's charts, filters, navigation, tables, keyboard controls and responsive layout before submitting the Mercury and GitHub links. No external deployment has been performed here.

## Updating data

Preserve the reviewed export as the reproducible baseline. If changing the data, rerun source reconciliation, update expected tests and source notes, and review fixed-year statements. Do not invent denominators or infer them from rounded Power BI labels. See the data-readiness document for the required rates workflow.
