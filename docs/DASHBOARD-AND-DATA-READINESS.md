# Four-chart dashboard and data readiness

Updated 3 November 2026 to follow the user's supplied wireframe.

## Implemented layout

The main Hospitalised injuries page contains a title/course header, navigation, a shared filter row, and four D3 charts arranged as requested:

| Position | Chart | Question |
| --- | --- | --- |
| Top left | Annual hospitalisations | How has the recorded count changed? |
| Top right | Hospitalisations by age group | Which ages account for the admissions? |
| Bottom left | Age × road-user heatmap | How does the road-user mix differ by age? |
| Bottom right | Trends by road user | Do road users follow the same pattern? |

The main navigation is Hospitalised injuries, Hospitalised injury rates, and Glossary. Sources and methods are available in the footer. Each chart can be expanded into a separate fixed-screen page or opened as a paginated data table. The existing detail URLs remain usable.

The desktop dashboard displays all four panels. On narrow screens, Previous/Next chart controls show one panel at a time so labels remain readable. Matrix sections and, when needed, age bars use pagination; the full filtered data remain available in the tables. Every page retains the no-downward-scroll constraint.

## Shared filters

The master CSV supports every requested field:

| Filter | Behaviour |
| --- | --- |
| Snapshot year | Sets the bar/matrix year and highlighted points. Both lines retain 2011–2021 for trend context. |
| Remoteness | Filters all charts by usual residence: Major Cities, Regional, Remote, or other/unknown residence (CSV `Missing`). |
| Age group | Filters all charts to the chosen source age band; All keeps every band, including the one Missing-age case where present. |
| Sex | Filters all charts to Female, Male, or the source's combined intersex/indeterminate/missing category. |
| Road user | Filters all charts to one of the twelve source categories; All retains the complete dimension. |

All filters except year select the record subset before aggregation. The snapshot year is deliberately not applied to the time-series input; otherwise an annual line would collapse to one point. This behaviour is stated on the dashboard.

Selections travel in validated URL parameters when moving between pages. Reset all restores the initial 2021, all-category, count-mode view. An empty combination displays a no-records message, rather than an invented zero. A genuine zero remains zero. An index is unavailable if its filtered 2011 baseline is absent or zero.

Default road-user lines show the three largest road-user totals within the filtered 2011–2021 history. Choosing a road user shows that category alone. Colours/shapes/styles are assigned consistently to categories. Age-bar lengths use the complete filtered snapshot's scale even when age rows are paginated. Matrix shares always use the full matching age-group total, including columns on other matrix views. If a zero total makes a share undefined, the matrix shows `n/a`.

## Is the data complete enough?

**For these four count charts and the five shared controls: yes.** No additional KNIME export is required. The same audited master CSV is used; its 5,178 records and 11 annual totals remain unchanged. This is a historical September 2023 release ending in 2021, not a claim to contain more recent years or every injury.

**For population-based injury rates: no.** The master has no population denominator. The rates page explicitly explains the missing dataset and does not plot fabricated rates or copy rounded values from Power BI screenshots.

To support rates under arbitrary combinations of remoteness, age and sex, obtain compatible population data at the joint grain:

```text
year,remoteness,age_group,sex,population
```

Required validation:

- Match the reporting year/reference date, age bands, sex definitions and remoteness classification to the numerator.
- Supply joint population records for combined filters. Separate age totals, sex totals and remoteness totals cannot be treated as a joint cube by a Cartesian join.
- Preserve the denominator's source, scope, geography/reference date and processing evidence in the KNIME workflow and Design Book.
- Restrict the rates interface to the dimensions/years actually supported if only marginal summaries or a single year's population are available.
- Calculate `matching hospitalisations / matching population * 100000`, with a defined policy for unknown/unpublished categories and no division by zero.

This requirement supersedes the earlier review's simpler marginal-summary export suggestion when **combined demographic rate filters** are desired. Do not use 2021 population for every historical year's rate, infer population from rounded chart labels, or present shares/indices as population rates.

Population rates describe burden per resident. Road-user exposure risk requires appropriate denominators such as travel distance or usage, with compatible definitions. Resident population is not a count of drivers, cyclists or trips.

## Are four charts enough for HD?

Four purposeful charts can support a strong submission. More static chart images alone would not establish an HD. This dashboard retains question-led chart titles, filter scope, policy-break notes, exact values and data limitations so it supports the brief's explanatory aim as well as exploration.

The highest complexity descriptor also mentions meaningful integration of multiple datasets. Adding a well-matched population dataset and contrasting count burden with resident rates would be a substantive extension. The current single-source count dashboard does not claim that criterion has already been satisfied.

The team still needs genuine usability evaluation, documented iterations, a completed Design Book, justified design/interaction choices and accurate references. Test whether users understand the snapshot-versus-trend distinction and the difference between counts, shares, indices and rates. Use actual participants; the technical checks here are not a participant study.

If the team later chooses monthly seasonality, counterparties or bed-day questions, those fields were aggregated out of this master and require a justified new KNIME export from the original raw data. State/territory or First Nations analyses need their corresponding source data and careful interpretation. These are optional analytical extensions, not chart-count requirements.

## Verification

The data/filter/navigation suite has 22 passing checks. It covers the unchanged CSV, every annual total, all categorical filter options, combined intersections, unknown categories, sparse/empty data, valid share denominators, URL-state preservation and pagination coverage.

An independent source check confirms that the combination **2021 / Regional / 40–64 / Female / Pedal cyclist** has **174 hospitalisations**. The dashboard, age bar, matrix, expanded view and data table agree. Browser validation also checks empty combinations and unavailable 2011 indices, all four desktop panels, chart paging on phones and the rates/glossary pages.
