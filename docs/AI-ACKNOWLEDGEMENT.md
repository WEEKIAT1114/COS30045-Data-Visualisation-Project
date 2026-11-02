# GenAI acknowledgement and prompt summary

The user renamed the project folder to
`C:\Users\Edward\Downloads\COS30045-Data-Visualisation-Project` and requested
readable code rather than compressed lines. Codex assisted with multi-line
formatting of the project HTML, CSS, JavaScript, server, tests and configuration,
including embedded HTML templates. Formatting settings and the README path were
updated. Structural comparisons and the existing tests checked that the changes
preserved the application logic, stylesheet rules, page content and source data.

On 3 November 2026 the user provided a four-chart dashboard wireframe and requested shared year/remoteness/age/sex/road-user filters, page navigation, and advice on data sufficiency. Codex assisted with the grid layout, validated shared-filter model, D3 renderers, expanded chart/table views, rates-readiness page, glossary, new tests and documentation. The historical CSV was preserved; no population denominators or rates were fabricated.

OpenAI Codex assisted with this project on 2 November 2026. This file describes the work performed; it does not claim that the team independently authored generated code or conducted participant research.

## User request summarised

Review the attached project brief, marking rubric, Design Book template, data dictionary, source reports, lecture-note archive, Power BI examples, original workbook, KNIME workflow, master CSV and four chart images; then create a D3 website in the specified project folder based on lecture theory and assess whether further data/charts would help an HD case. The user explicitly identified the Power BI PDFs as examples.

## Work assisted by GenAI

- Extracting/reviewing document content and identifying relevant scope, definitions and marking criteria.
- Independently aggregating source data to validate the master export, calculating descriptive statistics, and checking sparse/unknown categories.
- Developing the narrative and restrained page design, responsive CSS, SVG chart code, state/interaction handling and data-table alternatives.
- Writing source comments, data tests, the local preview server and supporting project documentation.
- Reviewing the actual browser-rendered site and correcting observed readability issues.

Implementation refinements focused on policy-break annotations; preserved unknown categories; null versus explicit-zero cells; chronological age order; indexed counts versus rates; matching denominators for row shares; keyboard/pointer equivalence; responsive layout; contrast; input validation; and source attribution. These are summaries of implementation decisions in this coding session, not a fabricated list of separate student prompts.

The source acknowledgement in `js/main.js` contains the request/prompt summary and refers here. Relevant HTML, CSS, data and shared UI modules also identify assistance. The vendored D3 library is third-party software with its own licence and authorship.

## What has not been claimed

No participant study, participant feedback, lecturer approval, assigned grade, Mercury publication, GitHub publication or assessment submission is represented as completed. No new population denominators or measured risk rates have been fabricated. Existing workflow settings were inspected, but the workflow was not re-executed in KNIME.

## Team responsibilities

Review and adapt the code and narrative, retain the actual conversation/prompt record where required, verify references and any later changes, conduct real evaluation, and complete the required institutional declaration. Every team member should be able to explain D3 joins/scales, the aggregation and denominator logic, linked state, keyboard interactions and the data's limits. Update this acknowledgement if further tools or prompts are used.

## Subsequent layout instruction

The user requested that each page be fixed to the screen with no downward scrolling and allowed separate pages. Codex assisted with the multi-page shell, viewport-sized charts, shared URL selections and pagination of table rows, matrix sections and source notes. The original data and its definitions were preserved. Additional tests check navigation and pagination coverage.

## Subsequent colour instruction

The user supplied `#dfc7ba`, `#9298c6`, `#37507e` and `#161c2e` and allowed matching supporting colours for a comfortable, usable theme. Codex assisted with shared CSS/D3 colour tokens, navigation and control styling, matching chart colours and favicon, calculated contrast checks, and desktop/phone browser review. Data, filtering and layout behaviour were preserved. The measured checks and their limits are recorded in `VALIDATION.md`.
