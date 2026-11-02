# Data audit and provenance

Dashboard revision, 3 November 2026: the audited CSV and its fingerprint are unchanged. Shared remoteness, age, sex and road-user filters select records before the same aggregation process. Year selects a snapshot; the line-chart input retains all years. The matrix count colour scale is fixed across years **within the current filter subset**; unfiltered it remains 0–4,298. Pagination never changes the full matching denominator or scale. Empty combinations stay empty, explicit zeroes remain zero, and undefined zero-denominator shares display `n/a` in the heatmap.

Audit performed 2 November 2026 on the supplied files. No source workbook, workflow or original CSV was edited.

## Source chain

AIHW National Hospital Morbidity Database → BITRE national workbook `hospitalisation_injury_publication_sep2023.xlsx`, September 2023 → Group 3 KNIME workflow → `road_crash_master.csv` → D3 website views.

The national workbook contains Cover, Index, T1, T2, T2.1, T2.2, T3, T3.1, T4 and raw sheets. The raw sheet's used range includes trailing blank rows; the number of meaningful rows must not be inferred simply from Excel's maximum row number.

## Observed KNIME configuration

- Excel Reader #69 uses the workflow-relative national workbook and selects `raw`.
- Row Filter #70 retains `Cause of injury = Traffic` (86,140 raw records).
- Column Filter #71 retains relevant attributes, including the already-defined `Hospitalisations` measure.
- Duplicate Row Filter #73 uses the eight identifying dimensions: calendar year, month, remoteness, cause, age, sex, road user and counterparty. The output summary remains 86,140 records. Do not describe removing duplicates if none were removed.
- GroupBy #110 groups the five dimensions retained in the master and sums `Hospitalisations`.
- Column Renamer #111 standardises the six output column names. The master output has 5,178 rows and six columns.
- Separate EDA branches produce annual, road-user, age and matrix outputs. The age rule assigns chronological order, but the supplied heatmap still displays lexical age ordering; the D3 implementation explicitly applies chronological order.

The configuration was read from the `.knwf` archive. No claim is made that the workflow was re-executed or that all runtime paths are portable without a final KNIME check.

## Independent reconciliation

The audit independently read the original workbook's raw rows, kept the exact `Traffic` cause, grouped by `(Calendar year, ABS remoteness area, Age group, Sex, Road user)`, and summed the original `Hospitalisations` column. It did not recompute this source measure from rounded chart labels, bed days or count-of-cases fields.

| Check | Result |
| --- | --- |
| Raw Traffic rows | 86,140 |
| Distinct grouped raw keys | 5,178 |
| Master records | 5,178 |
| Master/raw key or value differences | **0** |
| Duplicate five-dimension master keys | **0** |
| Empty CSV fields | **0** |
| Noninteger or negative master counts | **0** |
| Explicit zero-count master records | 98 |
| Sum over all years | **410,884** |
| Packaged KNIME master vs external master | Byte-identical |
| Website master vs external master | Byte-identical |

CSV SHA-256:

```text
ad7e8a76d4f40fb6c0c3a60cdbebd63b5f6334dfdc14d67c8cb5f1d55995514d
```

All annual totals also match original workbook Table 1:

| Calendar year | Hospitalisations |
| --- | ---: |
| 2011 | 34,033 |
| 2012 | 34,024 |
| 2013 | 35,001 |
| 2014 | 35,515 |
| 2015 | 37,082 |
| 2016 | 38,963 |
| 2017 | 39,339 |
| 2018 | 39,590 |
| 2019 | 39,866 |
| 2020 | 37,966 |
| 2021 | 39,505 |

## Attributes and analytical meaning

| CSV field | Data type | Meaning |
| --- | --- | --- |
| `year` | Temporal, interval; parsed integer | Calendar year of separation in the source, 2011–2021 |
| `remoteness` | Nominal category | Usual residence: Major Cities, Regional, Remote, Missing; not crash location |
| `age_group` | Ordered categorical | Age at admission; 0–7, 8–16, 17–25, 26–39, 40–64, 65–74, 75+, Missing |
| `sex` | Nominal category | Female, Male, intersex or indeterminate or missing; not a binary assumption |
| `road_user` | Nominal category | Twelve source road-user categories |
| `hospitalisations` | Quantitative ratio, nonnegative integer | Source-defined hospitalisation count for the grouped record |

Missing is a literal category in some dimensions, not an empty string to delete. It should not be imputed as a demographic category or treated as a measured zero.

Full-period unknowns retained: Missing age = 1 (2014); sex intersex/indeterminate/missing = 15; Missing remoteness = 8,833. In 2021 there is one case in the combined sex category and 629 Missing-remoteness admissions.

## Chart transformations

- National line: sum all records by year.
- Road-user line: sum by year and road user. Index mode = selected road user's year count / that user's 2011 count × 100. Every selectable road user has a positive baseline.
- Age bars: select the year, optionally select road user, then sum by age group. Categories retain source age order and include Missing when observed for that year.
- Matrix: select the year and sum by age group and road user. Road-user focus outlines a column; it does not filter the underlying matrix data. Pagination controls which rows/columns are visible. Row share always equals cell count / the full all-road-user age-group total, including columns outside the current view.
- Matrix count colour domain: fixed 0–4,298 across every year. The maximum is car drivers aged 40–64 in 2019. Share colour domain: fixed 0–100%.
- Sparse combinations with no record are `null` and shown as a hatched dash. An explicit zero remains `0`. No absent matrix cell is silently turned into a known measured zero.

The website validates headers, supported categories, numeric bounds, complete year coverage and duplicate grouped keys. Unexpected input produces an explanatory load error. It does not silently discard malformed rows.

## Statistical and governance limits

The source uses hospital separations and exclusions to estimate hospitalised injury cases, reducing duplication of care episodes; it is not a linked count of unique people. The workbook's hospitalisation measure excludes its died-in-care cases. The dictionary's technical died-in-care definition includes the separation mode and a stay of 30 days or less; the website preserves the supplied measure rather than introducing a broader mortality definition.

Victoria's 2012 and NSW's 2017 admission-policy changes affect comparability. Unknowns can cause selected published subgroup totals to differ from overall totals. Counts do not establish population or exposure risk. No claims of causation, statistical significance or clinical severity are inferred from this aggregated count export.

The broader AIHW injury report concerns different years, causes and financial-year reporting; it is background context only. Do not combine its transport, ED, death or all-injury totals with this calendar-year road-traffic series.

Only publicly released aggregate records are used. The website collects no participant data and performs no individual linkage or re-identification. Before public release, review source attribution/reuse conditions and include the actual source citation. Do not invent confidentiality thresholds from the separate AIHW report and apply them to this BITRE extract without checking the applicable release rules.
