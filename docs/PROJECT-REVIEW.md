# Review of the supplied materials and implications for the project

**Current revision, 3 November 2026:** the user's new wireframe is implemented as a four-chart dashboard with shared demographic filters, separate rates and glossary pages, and expanded chart views. The original source review below remains applicable. The current combined-filter population requirements are detailed in [DASHBOARD-AND-DATA-READINESS.md](DASHBOARD-AND-DATA-READINESS.md); they supersede the earlier marginal-summary suggestion for a fully filtered rates page.

Review date: 2 November 2026. Scope: the ten standalone PDFs, all 22 PDFs inside the lecture archive, the original national workbook, the master CSV, the KNIME workflow configuration and its embedded master CSV, and all four supplied chart images. Text was extracted across the PDF corpus; key design/rubric/data pages and the Power BI examples were also rendered for visual inspection. Lecture graphics were sampled, rather than every example figure being separately audited.

Layout revision: at the user's subsequent request, the website is now divided into separate fixed-screen HTML pages without downward scrolling. Source conclusions, the validated CSV and statistical definitions are unchanged. Dense matrix sections, source notes and data tables use pagination; selections carry between pages.

## Main decision

Use `road_crash_master.csv` as the website's single source of hospitalisation counts. It preserves useful dimensions, matches the workflow's packaged CSV byte for byte, and reconciles exactly with an independent aggregation of the original workbook's raw Traffic records. No replacement CSV is needed for the current four-view story.

The four supplied charts form a suitable starting point. Adding more static chart images would not by itself establish an HD result. The strongest improvements are a coherent question-led narrative, justified encodings and interactions, careful handling of data limitations, evidence of iteration and real usability evaluation, and technical work beyond basic lab examples. The implemented website addresses the first four chart designs through live D3 views; assessment evidence and participant research remain team work.

## What the assessment documents actually require

The attached project brief calls for an analytically grounded, interactive **data story**, with structured exploration. It explicitly says the aim is not an unconstrained dashboard showing every possible combination. D3 is compulsory for the website's visualisations. Power BI is contextual reference, not a design to reproduce.

The attached submission PDF specifies:

- A Design Book PDF; a team-named KNIME workflow containing the source data and exported datasets; a Mercury-hosted D3 website; and a GitHub code link.
- Commented code, identification of GenAI use and a summary of AI prompts in code comments.
- APA 7 references and real evidence of data preparation, design decisions, iteration and usability evaluation.
- Each team member must understand and contribute to both design and programming; continuity with stand-ups matters.

The copy supplied lists a due date of **15 November at 23:59** and 53 rubric points. Treat that as the saved assessment snapshot; verify the live course page for any later changes. No live course deadline was independently checked here. The template's `.knfw` spelling conflicts with the submission's `.knwf`; use the actual **`.knwf`** format already supplied.

### Rubric mapping and remaining work

| Criterion | Points | What the implementation/documentation supports | What the team still needs |
| --- | ---: | --- | --- |
| Introduction and purpose | 4 | Target audience, questions and evidence-led story in the design rationale | Personalise the motivation and integrate credible domain literature in the Design Book |
| Data source and governance | 3 | Source provenance, aggregate nature, limitations and data dictionary | Confirm source reuse/attribution terms; write the formal governance discussion |
| Data processing and exploration | 5 | Exact master/raw reconciliation, actual workflow settings and EDA findings | Submit annotated, executable team workflow with all inputs/exports and original screenshots |
| Website design | 3 | Clear narrative sequence, responsive layout and documented storyboard | Include your own wireframes and actual before/after evidence |
| Visualisation design | 10 | Task/encoding rationale, alternatives, labels, colour, zero bars and limitations | Tie design choices to lecture theory and formal accessibility evidence in the book |
| Interaction design | 5 | Purposeful linked selection, focus, index/share modes and detail on demand | Explain expected behaviour and evaluate whether users understand each interaction |
| Iteration and validation | 5 | Technical tests, browser review and participant protocol | Conduct and document genuine participant evaluation, feedback and refinement |
| Implementation: coding practice | 5 | Modular D3, validated loading, shared state, comments and AI summary | Team code understanding, deployment checks, any lecturer-specific conventions |
| Implementation: complexity | 5 | Custom matrix, coordinated updates, alternative measures and robust sparse-cell handling | Stronger independent extension and meaningful integration of a second dataset for the highest descriptor |
| Implementation: storytelling | 5 | Four connected questions, numerical claims, caveats and a concluding investigation question | Evaluate that the intended audience can follow and accurately retell the story |
| References | 3 | Real data, D3 and accessibility sources; lecture mapping | Complete, consistently formatted APA 7 references for all material used |

These are implementation observations, not an awarded grade or a prediction of an HD.

## Assessment of the four supplied charts

| Supplied image | What works | Important issues | Website response |
| --- | --- | --- | --- |
| Annual hospitalisations, 2011–2021 | Line chart suits ordered time; zero baseline preserves magnitude context | Oversized vertical space, sparse labelling, no narrative annotations; 2012 and 2017 policy breaks are not explained | Compact line chart, recent-year narrative, year selection, policy boundaries, explicit count unit and table |
| Road-user trends, 2011–2021 | Comparing car drivers, motorcyclists and pedal cyclists gives a meaningful contrast | Legend contains processing syntax and is paginated/truncated; nonzero y-axis magnifies slopes; no policy-break qualification | Clean labels, shape plus line style, zero baseline, direct endpoint labels on wider screens, optional 2011 index and a controlled fourth series |
| Age groups in 2021 | Bar length is an effective quantitative channel; counts agree with the export | Age labels rely on the colour legend, y-axis says the attribute name rather than readable group labels, rainbow hues imply unnecessary categories; unequal age spans need explanation | Chronological, directly labelled bars, restrained teal, largest bar emphasis, exact counts and an unequal-band caveat |
| Age × road user in 2021 | Heatmap suits a two-dimensional categorical comparison and reveals concentration | `8–16` appears last due to lexical ordering, some x labels are clipped/omitted, blank cells are ambiguous, colours need clear quantitative semantics | Fixed chronological age order, all 12 wrapped road-user headings, fixed sequential count scale, explicit absence/zero semantics and row-share mode |

These images are EDA/reference evidence. The website recreates the visualisations from numeric CSV records; it does not embed screenshots as the submitted charts.

## Data findings relevant to the story

- National counts: 39,866 in 2019, 37,966 in 2020, and 39,505 in 2021. The 2020-to-2021 increase is 4.1%; that comparison stays within the post-2017 phase.
- In 2021, car drivers account for 13,327 admissions (33.7%); motorcyclists 8,883; pedal cyclists 8,163. The latter two total 17,046, or 43.1% of national admissions.
- Ages 40–64 account for 13,026 admissions (33.0%) in 2021. This band spans more ages than most other groups, so it cannot identify the highest-risk age group.
- Male admissions account for 65.3% and Major Cities residents 66.7% of the 2021 national count. These are count shares, not incidence rates; remoteness describes usual residence.
- The export retains 15 cases across all years with sex recorded as intersex, indeterminate or missing, 8,833 with Missing remoteness, and one case in 2014 with Missing age. Dropping them would change totals.
- Pedal cyclist counts are 51.4% higher and motorcyclist counts 17.4% higher in 2021 than 2011. Because these comparisons span policy breaks, they are described only as recorded count changes, with prominent qualification; they do not establish true incidence growth.

See [DATA-AUDIT.md](DATA-AUDIT.md) for the complete annual totals and reconciliation method.

## What would strengthen the HD case?

### Most useful additional dataset: a compatible population denominator

The highest complexity descriptor explicitly mentions meaningful integration of multiple datasets. A single validated master CSV, even with several derived views, does **not** constitute several independently sourced datasets. The current implementation therefore cannot claim to meet that part of the highest descriptor.

An appropriate next extension is a matching ABS population dataset, or the documented denominator extract used for BITRE's published 2021 rates. This would let the story compare **hospital burden versus population rates**, an analytical improvement rather than simply increasing chart count. Start with 2021 rather than inventing a multi-year denominator.

Recommended KNIME export, after obtaining and validating the source:

```text
year,dimension,category,population,hospitalisations,rate_per_100000
```

Use `dimension` to distinguish age group, sex and remoteness summaries. The rows are separate marginal summaries: never sum or join them as if they were disjoint people. The formula is `hospitalisations / population * 100000`. Population definitions, age bands, sex classifications, reference date and remoteness geography must match. Retain source and processing metadata in the workflow and Design Book. If only a 2021 population extract is available, use it only for 2021 rates. Do not divide every year's counts by the same 2021 population and call the result historical incidence.

This export cannot be produced correctly from `road_crash_master.csv` alone because it contains no population denominator. Population rates also do not adjust for kilometres travelled or time spent travelling; they are not exposure-adjusted road-user risk. Do not infer denominators by reverse engineering rounded Power BI labels.

### Other possible extensions, if the story needs them

- The workflow archive already contains state/territory and First Nations workbooks. They could support a separate, carefully scoped question after inspecting definitions, completeness and appropriate denominators. Do not add a raw-count choropleth merely for visual complexity, or treat First Nations as an additional disjoint group to add to national totals.
- Monthly data and counterparty fields exist in the original raw sheet but were aggregated away from the master. A justified seasonality or counterparty analysis would require a new KNIME export preserving those dimensions.
- Bed days and the source's died-in-care fields require particular care. The dictionary explains changed bed-day methods around 2015–16 and timing differences across episodes. A casual `bed days / hospitalisations` calculation should not be labelled an individual patient's length of stay. No bed-day or severity claim has been added to this website.

A well-evaluated focused story can be stronger than a larger dashboard. Complete real usability evaluation and the Design Book evidence before adding features without a clear question.

## Document-by-document review

| Supplied PDF | Pages | Role and relevant conclusion |
| --- | ---: | --- |
| 2026 Data Visualisation Project Brief | 5 | Primary scope: D3, meaningful national hospitalisation story, structured explanation/exploration, count limitations |
| Project Design Book and Website (team) (Week 13) | 13 | Submission requirements and full 53-point rubric; high complexity explicitly includes meaningful multiple-dataset integration |
| Design Book Template | 3 | Introduction, governance, processing/EDA, wireframe/storyboard, marks/channels, interaction table, iteration and usability evidence |
| Hospitalised Injury — BITRE | 5 | September 2023 national series; source measure excludes in-hospital death cases; national, jurisdiction and First Nations resources |
| Hospitalised injury data dictionary, September 2023 | 6 | Exact traffic scope, admission/separation definitions, age at admission, usual residence, policy breaks, bed-day caveats and revisions |
| Injury in Australia, Ranked causes — AIHW | 3 | Background only; transport is broader than road traffic and its 2024–25 figures are not combined with the 2011–2021 series |
| Injury-in-Australia | 69 | Broader injury burden, rates, severity, demographic differences and technical notes; distinct reporting periods and methods. Some narrative/card years differ within the saved report, reinforcing the decision to use the primary BITRE release for plotted claims |
| Microsoft Power BI 1 | 1 | Count-dashboard example; useful comparison of context/controls, not the design target |
| Microsoft Power BI 2 | 1 | Rate-dashboard example; requires population data absent from the master CSV |
| Microsoft Power BI 3 | 1 | Glossary example; supports interpretation of road user, residence, unknowns and policy breaks |

All 22 lecture PDFs are mapped individually in [DESIGN-RATIONALE.md](DESIGN-RATIONALE.md). The archived KNIME workflow was inspected as configuration and data evidence; it was not reopened and executed in KNIME during this work. The master/raw reconciliation independently verifies its numerical output.

## Submission work remaining

1. Check that the team agrees with the audience, questions and story, and can explain the code.
2. Conduct participant usability evaluation and save authentic notes. Use the supplied protocol; do not present its blank log as results.
3. Record design iterations with real screenshots and decision rationales.
4. Complete the actual Design Book with names/IDs, wireframe/storyboard, EDA evidence, governance, references, evaluation and GenAI declaration.
5. Keep the existing team-named workflow self-contained; include any new denominator sources and exports if the extension is pursued.
6. Publish to the assigned Mercury space, verify the hosted website, and provide real GitHub/Mercury links in the required submission location. No submission or publication has been carried out here.
