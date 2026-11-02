# Design rationale, lecture mapping and storyboard

## Colour theme revision — 3 November 2026

The user supplied `#dfc7ba`, `#9298c6`, `#37507e` and `#161c2e`. Warm sand supplies navigation text and restrained borders/badges; lavender marks the active page and fills the age bars; navy supplies links, control emphasis, chart lines and the largest age bar; deep navy anchors the masthead, navigation and primary text. A warm off-white canvas (`#f6f2ef`), white panels and pale lavender control surfaces reduce the amount of saturated colour across a fixed screen.

Colour follows the lecture principles of restrained emphasis, ordered magnitude and redundant encoding. The matrix uses a pale-lavender → lavender → navy sequential scale with decreasing lightness; its CSS legend and D3 interpolator use the same stops. The matrix chooses black or white labels against each actual fill. Road-user series use matching muted blue, plum and brown, with stable symbols, dash patterns and written labels. Lavender age bars have navy boundaries so the marks remain visible against white.

UI and chart colours share CSS custom properties in `css/style.css`; D3 resolves those tokens through `themeColor` in `js/ui.js`. Numerical values, scales, filters and the fixed-screen layout are unchanged by this revision. See `VALIDATION.md` for measured contrast and browser checks; these checks do not establish full WCAG conformance or participant usability results.

## Current wireframe revision — 3 November 2026

At the user's request, the main screen now follows a header → page navigation → shared filters → 2×2 chart grid layout. The four chart questions and source limitations retain the guided interpretation required by the brief. Year selects the snapshot/highlight while the time series retain all 11 years; remoteness, age, sex and road user filter every chart. Each chart has an expanded page and a table. Phones use chart paging, and dense row/column subsets paginate with full-data scales/denominators. The rates page states that population data are missing; it presents no calculated rates. This section supersedes earlier layout descriptions retained below as iteration evidence. See [DASHBOARD-AND-DATA-READINESS.md](DASHBOARD-AND-DATA-READINESS.md).

This is implementation support for the team's Design Book. It documents the design built in this project; it is not evidence of participant feedback or a replacement for the assessed book.

## Fixed-screen revision requested by the user

The current design uses six separate HTML pages plus a data-table page. Every page occupies the viewport without downward scrolling. The narrative sequence is unchanged, but movement between its stages is now explicit through the top navigation and Previous/Next links. Shared year, road-user and measure selections travel in validated URL parameters. Source notes and tables are paginated; the matrix paginates both columns and age rows when space is limited. Colour domains and row-share denominators continue to use the full source data, irrespective of which matrix section is visible.

This revision supersedes the initial long-page wireframe and scrollable-matrix interaction described below. Retain those descriptions as initial-design evidence when documenting iteration; use screenshots of the current fixed-screen pages for the final design.

## Audience, purpose and questions

Proposed primary audience: interested Australian residents and road-safety students who need a clear introduction to the distribution of hospitalised road crash injuries. Secondary audience: analysts forming questions for more detailed investigation. Validate these choices with your team and actual participants.

Purpose: communicate where recorded hospital burden concentrates, while helping readers distinguish hospitalisation counts from risk and recognise time-series limitations.

Key user tasks:

1. Describe the recent national pattern and identify the 2020 dip and 2021 rebound.
2. Compare the three leading 2021 road-user groups, including recorded relative change from a common baseline.
3. Identify the largest age-group count for a chosen year and road user.
4. Compare the road-user mix within different age groups and retrieve exact values.
5. Explain why a large count or percentage does not establish a high population or travel-exposure risk.

## Storyboard

| Step | User question | Experience and expected response |
| --- | --- | --- |
| Opening | What is this story about? | A descriptive title, the 2021 national count, coverage and source introduce the measure |
| 1. The decade | Did hospitalisations fall and stay down? | A fixed full-decade line with recent exact values explains the dip/rebound; visible boundaries qualify historical comparability |
| 2. Road users | Do groups follow the same pattern? | Compare the leading three groups using common position, direct labels and redundant styles; an index mode separates relative count change from absolute size |
| 3. Age | Who accounts for this hospital burden? | Chronological, zero-based age bars update for the chosen year/road user; unequal age bands and national context are explained |
| 4. Intersection | Does the road-user mix differ with age? | A complete 12-column matrix offers counts or within-row shares, exact detail and a linked age profile |
| Interpretation | What can I conclude? | A closing question distinguishes burden from risk and points to population/exposure research |
| Sources | Can I trust or inspect the numbers? | Methods, source links, retained unknowns, data download and tables support verification |

Current desktop wireframe: persistent masthead/navigation → page heading → relevant controls → one chart or content panel filling the remaining height → brief interpretation/caveat → persistent page-navigation footer. The introduction uses a two-column opening and four chart links. Data tables have their own page with row navigation; source topics have a paginated notes panel.

Current phone wireframe: compact persistent navigation → page heading and controls → one chart → concise interpretation and footer. Matrix views display only the rows/columns that fit, with Previous/Next controls providing complete coverage. Table rows and source notes are also paginated. No vertical or horizontal page scrolling is needed. This text documents the layout; create and include a genuine low-fidelity wireframe/sketch in the assessed Design Book.

## Marks, channels and alternatives

| View | Data and marks | Channels and reasons | Alternatives considered |
| --- | --- | --- | --- |
| National trend | Temporal year, quantitative count; points and line paths | Horizontal position encodes year; vertical position encodes count; equal time spacing and linear interpolation retain annual observations; no smoothing invents intermediate peaks | Bars are possible but less direct for following the decade; a truncated line scale exaggerates small changes; an area adds emphasis without adding information |
| Road-user trends | Temporal year, nominal road user, quantitative count/index; paths and point symbols | Shared x/y position supports comparison; hue identifies groups, reinforced by dash pattern, point shape, legend text and desktop endpoint labels | A 12-line chart would overplot; stacked lines prevent comparing most categories from a common baseline; small multiples would work but use more space and require careful shared scales |
| Age bars | Ordered age categories and quantitative counts; rectangles | Common zero-based horizontal length accurately compares burden; chronological vertical order preserves the age structure; navy emphasises the largest count against lavender bars; exact labels remove legend-memory work | A histogram would be misleading with unequal/open-ended pre-aggregated age groups; a rainbow category legend adds effort; a pie makes precise age comparisons harder |
| Age × road user | Two categorical dimensions and count/share; rectangular matrix cells | Row/column position encodes categories; sequential light-to-dark luminance encodes increasing magnitude; printed values and detail support precise comparison | Clustered bars with 12 categories per age group would be dense; a stacked chart makes middle segments hard to compare; a diverging scale would imply a meaningful centre that these nonnegative counts lack |

Count line charts and bars start at zero. The heatmap count domain is fixed across all years; its share domain is fixed at 0–100%. Index mode uses each series' own 2011 count as 100 and states that this does not normalise by population or exposure. Selected road users are highlighted without removing matrix context. Missing age is shown after known chronological bands when present.

## Interaction table

| Interaction | Input | Behaviour | Purpose and scope |
| --- | --- | --- | --- |
| Year control | Native select; keyboard or pointer | Updates national summary values, age bars, matrix and selected-year markers | A controlled comparison across years; full trend history stays visible |
| National/year point | Click, or focus + Enter/Space | Same year update as the native select | Direct manipulation of the overview; equivalent keyboard path |
| Road-user focus | Native select; keyboard or pointer | Focuses the age bars and highlights the matrix column; adds one additional line when outside the leading three | Investigate one relevant group without a 12-series line chart |
| Road legend | Button | Select/toggle that road-user focus | Link the comparison to the age profile |
| Matrix heading | Click, or focus + Enter/Space | Focus/toggle its road-user column | Preserve matrix overview while relating a column to the age profile |
| Matrix cell | Click, or focus + Enter/Space | Shows count/share detail and selects that cell's road user | Retrieve exact intersection values and link views |
| Counts/index | Toggle button group | Recomputes line y positions on count or indexed scale with explanatory text | Compare absolute burden and relative recorded changes |
| Counts/row share | Toggle button group | Recomputes cell colour/value using the age-group total as denominator | Compare mixes between differently sized age groups |
| Detail on demand | Pointer hover or keyboard focus | Tooltip for the same labelled data mark; Escape dismisses | Exact values without permanent chart clutter |
| Data tables | Native disclosure | Opens an equivalent text/table representation | Screen-reader and precise-value access |
| Reset | Native button | Returns to 2021, all road users and both count modes | Recover from a confusing selection |
| Matrix pagination | Previous/Next buttons, keyboard or pointer | Advance through viewport-sized subsets of rows and columns | Keep every source category reachable while preserving readable labels and the full-data denominators |

The design intentionally exposes only year and road-user focus. Sex and remoteness appear as clearly labelled national context, not additional global filters. Zooming an 11-observation annual line would add little analytical value, so it is not included merely to increase feature count.

## Lecture-by-lecture application

| Lecture PDF in supplied archive | Pages | Theory/programming connection |
| --- | ---: | --- |
| W1.0 Introduction to COS30045 | 17 | Document AI help, support incremental demonstration and team understanding; do not substitute generated work for the team's ability to explain it |
| W1.1 Introduction to Data Visualisation | 31 | Munzner's domain → task/data abstraction → encoding/interaction → algorithm sequence underlies the question-led design |
| W1.2 Data Processing | 27 | Distinguish nominal/ordinal/interval/ratio fields; inspect missing values, duplicates, provenance and aggregation before rendering |
| Topic 02 P1 Design Guidelines | 69 | Tufte's integrity/data-ink principles: zero-based bars, proportional length, honest temporal context, restrained chart structure and no decorative 3D |
| Topic 02 P2 Design Guidelines | 24 | Avoid unjustified 3D; reduce memory burden; keep simultaneous context and readable category labels; do not encode bubble radius as if it were area |
| W2.3 Common chart types | 32 | Lines for temporal patterns, bars for categorical magnitude, heatmap for two categorical dimensions; reject pies/secondary axes where common position is clearer |
| W3.1 Storytelling | 20 | Set audience/purpose, identify a big idea, separate exploration from explanation, sequence the evidence and qualify the claim |
| W3.2 Data Governance and Privacy | 17 | Record origin/processing and use only released aggregates; do not imply individual-level health records or collect participant identifiers on the site |
| Topic 04 Marks and Channels | 33 | Use position/length for quantitative comparison, hue/shape for identity and luminance for magnitude; avoid implying order through arbitrary hues |
| W4.1 DOM and SVGs | 19 | Semantic DOM, SVG rectangles/paths/text/groups and responsive viewBox dimensions |
| W4.2 Introduction to D3 | 23 | Direct D3 selections and SVG construction; D3 v7.9.0; no charting-package wrapper |
| W4.3 Loading data and building charts | 21 | `d3.csv`, numeric parsing, explicit validation, keyed data joins, shared data loading and per-chart functions |
| W4.4 Scaling and Labelling | 16 | Linear/band scales, chronological band domains, margins, direct category/value labels and separate quantitative units |
| W5.1 Drawing lines and arcs | 39 | Margin convention, line generators, SVG paths and axis generation; linear interpolation suits annual discrete observations |
| W5.2 Pie and Stack | 34 | Understand pie/stack tradeoffs; deliberately avoid pie slices and unaligned stacked components for this comparison task |
| W6.1 Histogram | 19 | A histogram requires appropriate numeric bins; the unequal pre-grouped ages and open-ended 75+ band support labelled bars instead |
| W6.2 Interaction | 25 | Separate event handling/state; linked updates; shared tooltip routines; short interrupted transitions respect rapid selections |
| W7.1 Psychology of Data Visualisation | 37 | Restrain palette, use pre-attentive emphasis, direct labelling and stable category order to reduce working-memory demands |
| W8 Chart Accessibility | 51 | Semantic navigation/headings, descriptions, equivalent tables, keyboard focus/detail, non-colour identification and responsive text |
| W9 Validation | 33 | Separate technical inspection from participant evaluation; use real task goals, completion criteria, informed consent and anonymised notes |
| W10 Interaction Design | 21 | Overview first, controlled focus/filter and details on demand; preserve full timeline and matrix context |
| W11 Visualisation Chart Exploration | 24 | Extend familiar charts through custom matrix design and coordinated/alternative measures; complexity should serve the question |

Total lecture pages: 632 across 22 PDFs. This is a mapping of ideas used or considered; it does not imply that every chart type in the lectures must appear in the project.

## Accessibility and integrity decisions

Use native selects and buttons, a skip link, one h1 and logical headings, semantic sections/figures, SVG titles/descriptions, accessible data-mark labels, keyboard activation and focus styling. Equivalent tables follow every chart. Lines use different symbols and dash patterns. Matrix values appear as text and tooltips, and the cell label colour is selected for contrast against its actual fill. Bars have a dark boundary against the background. No autoplay, flashing or forced animation is used; reduced-motion preferences disable transitions.

The website rebuilds chart geometry for the measured panel width and height. The dense matrix uses 12px cell/header labels and paginated subsets rather than shrinking a 12-column drawing to fit a phone. The row/column pagination is tested to cover every combination exactly once for a fixed viewport.

These features support accessibility; they are **not a claim of complete WCAG conformance or screen-reader certification**. Perform a manual keyboard/readability review, a screen-reader trial and a contrast/accessibility audit in the final hosted environment. The general lecture slide's shape contrast example should not be substituted for checking the applicable WCAG criteria.

## Evidence to add to the Design Book

Keep the four original KNIME charts as EDA/before evidence. Capture the actual final views and explain concrete improvements: chronological heatmap age order, complete road-user headings, restrained palette, source breaks, linked exploration and numeric table alternatives. Add authentic participant feedback and any subsequent refinements. The programmatic/browser inspection recorded here is technical evaluation, not a human usability study.

## Sources actually used

- Supplied COS30045 lecture PDFs listed above (course materials; exact author/date/bibliographic details should be taken from the original slides for the team's APA 7 list).
- Supplied BITRE September 2023 workbook and data dictionary.
- Observable. (n.d.). *Joining data*. https://d3js.org/d3-selection/joining
- Observable. (n.d.). *Sequential scales*. https://d3js.org/d3-scale/sequential
- World Wide Web Consortium. (n.d.). *Understanding SC 1.4.1: Use of color*. https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html

The course slides discuss Tufte, Munzner, Knaflic and other authors. Cite the lecture materials as consulted sources, or consult and verify the original works before presenting them as directly read references. Do not invent page numbers, quotations, publication details or user-study findings.
