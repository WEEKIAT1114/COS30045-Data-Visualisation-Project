# Implementation validation

## Code readability revision — 3 November 2026

Reformatted the project source into multiple lines with two-space indentation,
separate CSS declarations, expanded D3 method chains, readable arrays/objects,
and nested HTML templates. Added shared Prettier settings and an ignore file;
the original CSV and vendored D3 library were preserved. The README now uses the
renamed `COS30045-Data-Visualisation-Project` folder.

All **22 regression tests pass**, all JavaScript files pass syntax checks, and
Prettier's formatting and internal consistency checks pass. Independent parsed
comparisons confirm equivalent JavaScript logic in 12 application/server/test
files, equivalent CSS selectors/declarations/media queries/values, equivalent
structure and normalised text in the nine HTML entries and SVG favicon, and an
equivalent package configuration. The nine generated page routes also retain
their element structure, attributes and normalised text. Whitespace within HTML
templates is intentionally expanded for readability. No new browser or
participant usability evaluation was conducted for this formatting revision.

## Current colour theme — 3 November 2026

Applied the user's sand/lavender/navy palette consistently across the masthead, navigation, controls, charts, information pages, data tables, tooltip and favicon. D3 and CSS share colour tokens. The input CSV is unchanged; all **22 regression tests pass** and application JavaScript syntax checks pass.

Calculated WCAG relative-luminance contrast for 20 intended text/background pairs: the lowest is **4.98:1**. Across the 12 road-user colours, national line and policy markers, the lowest contrast against white is **4.62:1**; control boundaries measure **3.59:1**. A sample of 1,001 D3 heatmap fills confirms decreasing lightness, with a minimum **4.59:1** for the chosen black/white cell labels. Pale lavender fills are supplemented by navy bar boundaries; hue is supplemented by line patterns, symbols and labels. These are scoped implementation checks, not a full accessibility audit.

Browser review at actual CSS viewports of **1,280 × 720** and **355 × 767** confirmed the four-panel desktop view, phone chart paging, matching legend/cell colours, no document overflow and no clipped visible chart panels. Checked active-filter styling and the expected **174** admissions for 2021 / Regional / 40–64 / Female / Pedal cyclist; rates and glossary cards fit the desktop viewport. Keyboard focus remains visible on the active navigation item, and focusing a chart point reveals the dark tooltip with white text. No browser errors or warnings were captured. An actual dashboard screenshot was saved as theme-review evidence outside the delivered website.

## Current four-chart revision — 3 November 2026

The current count dashboard implements the user's title/navigation/filter/four-panel wireframe, with five shared controls. The CSV fingerprint is unchanged. All **22 tests pass**, including reconciliation for every remoteness/age/sex/road-user option, combined filters, empty/zero cases, unknown categories, full matching share denominators and URL preservation.

Actual browser checks confirm the 2×2 desktop layout, matching snapshot values across charts, preserved controls in expanded/table pages, four mobile chart views, no-records messages, and an explicit unavailable-index message where a positive filtered 2011 baseline is absent. The combined 2021 / Regional / 40–64 / Female / Pedal cyclist result is 174 in the UI and an independent CSV calculation. The rates page contains data-readiness guidance rather than computed rates. Glossary notes define fields, measures and limits. Older sections below describe superseded layouts and remain as iteration evidence.

The desktop grid was inspected at actual CSS viewports of 1,396 × 873 and 1,280 × 720. At the latter size all seven default age bars remain visible. Phone checks used 355 × 767 and 320 × 569: all four chart views fit without document overflow, with matrix/age pagination preserving readable labels. All three rates-data notes and every glossary measure/dimension/interpretation note were checked at the shortest phone size without clipped content. On the rates page, a phone layout overlap was corrected by paginating its three information cards. Normal viewport settings were restored after testing.

## Current fixed-screen revision

The user requested separate pages that fit the screen with no downward scrolling. The current implementation has six narrative/chart/source pages and a separate data-table page. The source CSV is unchanged.

All **16 regression tests** pass: the original 11 data tests plus URL-state validation, cross-page selection round trips, pagination bounds, and coverage of every matrix row/column combination. JavaScript module syntax checks pass.

Browser checks covered all six primary pages at actual CSS viewport sizes of 1,164 × 654, 355 × 767, 320 × 569 and the restored normal 460 × 595 viewport. No vertical document overflow was found. Visible content panels were checked for clipping; a cramped matrix at the shortest size was corrected by adding row pagination, and the compact introduction was adjusted to fit its content. Matrix values/headers retain 12px text. Source topics and table rows paginate without a vertical scroll area.

Verified cross-page selection: 2014 / Pedal cyclist carries from the matrix to Age groups and its table, retaining 6,636 admissions and the unknown-age category. Selecting an uncommon road user adds its fourth trend line. The matrix table includes all 96 combinations for 2014, with accessible Next/Previous rows; matrix view controls expose all row/column sections. Share mode retains a 0–100% scale and the full-age-group denominator. Keyboard Enter selects the national 2020 point. Page Down leaves both document and main-panel scroll positions at zero. No browser warnings/errors were captured during the final review.

The earlier long-page checks below are retained as initial-version iteration evidence. Their references to scrollable matrices and expandable in-page tables describe that earlier layout, which has been superseded.

## Earlier layout evidence

Checked 2 November 2026. This records technical checks, not participant usability research.

## Data and source evidence

- An independent Python aggregation of the original workbook's 86,140 raw Traffic records matches every one of the 5,178 master keys and counts.
- The 11 annual values match original workbook Table 1.
- The website's CSV and the workflow's embedded master have the reviewed external CSV's SHA-256 hash.
- All 11 Node regression tests pass. They cover source fingerprint, full-period and annual totals, cross-dimension/chart reconciliation for every year, retained unknowns, row-share denominators, absent/zero cells, descriptive claims and malformed CSV handling.
- JavaScript syntax checks pass for the application modules.

## Actual browser checks

The local site was served over HTTP and opened in the in-app browser. Desktop review used the normal 1,280px viewport; responsive review used a temporary 390 × 844px viewport, then restored the normal size.

Verified behaviours:

- Initial load displays four live D3 SVG views and the 2021 count of 39,505, with no captured browser warning/error messages.
- Selecting 2014 updates the national count to 35,515 and retains an eighth unknown-age row in the detail views.
- Selecting pedal cyclists in 2014 produces the age-view total of 6,636.
- The 2012 selection replaces the year-over-year percentage with an admission-policy comparability message.
- Selecting Heavy transport unknown position adds a fourth line, with a 2012 detail total of 48.
- Index mode visibly changes the line chart and explains the 2011 baseline; share mode changes the heatmap legend to a fixed 0–100% domain.
- Keyboard Enter on the national 2020 point selects 2020. Keyboard focus reveals point detail; equivalent table access is available.
- Selecting the 2021 age 40–64 / pedal cyclist matrix cell focuses pedal cyclists, gives a detail total of 8,163 and identifies the cell as 3,393 (26.0% of that age-group total).
- Reset restores 2021, all road users and both count modes.
- The age table expands and displays the seven 2021 age counts and shares.
- At phone width, the page has no horizontal document overflow; chart geometry rebuilds at the narrower width, while the dense matrix remains in its own horizontal scroll region with 12px cell/header text.

## Refinements made during inspection

- Split long heavy-transport and unknown-position matrix headings into shorter lines and preserved a minimum matrix width to prevent crowding.
- Added dark bar boundaries to maintain mark visibility against the background.
- Corrected awkward automatically pluralised road-user wording in the age explanation.
- Verified the global heatmap maximum independently: 4,298, car drivers aged 40–64 in 2019. A test's provisional expected maximum was corrected to that source-derived value; the implementation already computed it dynamically.

## Limits and final team checks

No actual screen-reader session, full WCAG audit, user study, Mercury hosting test or KNIME execution was performed. The final hosted URL must still be checked for relative asset paths, CSV/module delivery, keyboard use, readable text, responsive layout and expected downloads. Test a missing/invalid CSV in a disposable copy if changing the loader. Technical checks do not establish that real readers understand the narrative; use the participant protocol for that evidence.
