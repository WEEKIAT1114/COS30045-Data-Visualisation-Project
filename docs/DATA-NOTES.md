# Data scope, calculations and checks

## Reviewed inputs

- `COS30045_Group3_DataProcessing.knwf`, supplied on 4 November 2026.
- Its embedded and external updated `road_crash_master.csv`; both are identical.
- National September 2023 hospitalised-injury workbook and data dictionary.
- State/territory and First Nations workbooks in the supplied KNIME folder.
- The supplied chart images and three dashboard reference layouts.

The screenshots specify visual direction. Their illustrative values are not
used as data. For example, the actual 2021 age totals are **707; 2,863; 8,010;
9,423; 13,026; 3,018; 2,458**, in chronological order.

CSV SHA-256:
`c86b252408f8ada3e47eb28cf8aa5b6d5d5850ad20f067edafb6b4e576801d6c`.

## Avoiding duplicate counts

The master has 18,074 records at three different grains:

| Record type | Records | Website treatment |
| --- | ---: | --- |
| `national_detail` | 17,953 | The source for every chart and KPI |
| `state_annual` | 88 | Retained in the downloadable master; not added to national detail |
| `first_nations_annual` | 33 | Retained in the master; not added to national detail |

All 17,953 national keys and both their count/bed-day totals reconcile exactly
with an independent aggregation of the original workbook's Traffic raw records.
The key is year × remoteness × age × sex × road user × counterparty.

The national 2021 total is **39,505**. Adding all three record types would give
**118,045**, an invalid duplicate total. Full-period national hospitalisations
are **410,884**. State/First Nations rows lack joint filter dimensions, so they
cannot support these six shared filters. Marginal tables must not be cross-joined
to manufacture joint observations.

## Bed-day interpretation

The updated workflow sums the original **Bed days** field. For 2021 it totals
**198,934**. The website preserves that export and computes:

`reported bed days per hospitalisation = sum(bed_days) / sum(hospitalisations)`

The 2021 ratio is `198934 / 39505 ≈ 5.036`, displayed as **5.0**. It is not
an average of row ratios or a mean individual length of stay. The dictionary
describes transfer-care episodes in bed days, and the raw bed-day field also
retains days associated with in-hospital deaths. The hospitalisation numerator
excludes in-hospital deaths within 30 days. This difference is explained in the
glossary and relevant chart information. A zero denominator gives Unavailable.

If the team needs an explicitly non-fatal bed-day ratio, export and document a
new measure subtracting `Died_bed_days`; do not silently relabel the existing
`bed_days` field.

## Filter and missing-value rules

- All six filters select joint national-detail records before aggregation.
- Year selects snapshots and highlights corresponding full-history points.
  All years sums 2011–2021 for snapshots. The other five filters affect both
  history and snapshots.
- Sex has All, Male and Female options. All retains 15 hospitalisations in the
  combined intersex/indeterminate/missing category over the full period.
- Missing age (one admission in 2014) and unrecorded residence remain available.
- A missing heatmap combination is a dash with hatching. A recorded zero is 0.
- The donut combines seven categories as Other road users only when showing All
  road users. Its denominator is the full matching count, including unknowns.
- Pagination changes the visible categories, not totals, scales or denominators.
- Counts are not population rates or estimates of individual crash risk.

## Source and comparison limits

BITRE, *Hospitalised injury*, September 2023 national release, using the AIHW
National Hospital Morbidity Database. Source landing page:
https://www.bitre.gov.au/resource/road-safety/hospitalised-injury

The provided dictionary records Victoria's 2012 and NSW's 2017 admission-policy
changes. Both are marked in time-series charts. Bed-day counting also has
episode/rehabilitation rules described in that dictionary. These historical
data end in 2021 and may be revised by the publisher.

The user selected Insights instead of Rates because compatible population
denominators are absent. State and First Nations context charts can be added
when their supported filter scope is agreed or matching joint data is supplied.

## Completed verification

Twelve regression tests cover the source fingerprint, record grains, annual and
age totals, sum-based bed ratios, every filter option, joint selections including
counterparty, retained unknowns, line-history scope, donut reconciliation,
missing/zero cells and malformed data. JavaScript syntax and formatting checks
are also run.

Actual browser review includes 1,280 × 720, 355 × 767 and 320 × 569 CSS viewports.
Four Overview and five Insights chart views render, filters and expanded views
retain their selections, and data tables paginate. The combined 2021 / Regional /
40–64 / Female / Pedal cyclist count is 174; adding Non-collision gives 78.
The narrow matrix pager visits all 84 default cells exactly once. Every glossary
term was checked at desktop and the shortest phone size. Page Down leaves the
document and main scroll positions at zero.

Scoped colour checks cover ten text/background pairs (minimum 4.57:1), control
boundaries (3.66:1), and 1,001 sequential matrix fills (minimum 4.59:1 with the
chosen black/white labels). These checks are not a full WCAG audit, a real
screen-reader test or participant usability research.
