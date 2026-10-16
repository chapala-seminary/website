# Lighthouse (mobile) — Phase 1

Measured against a local build of this branch. Home Performance is reported
and not enforced: the inherited front page is a large inline document
(docs/PLAN-cts-seo.md). Course landings and a lesson page must meet the
budgets.

Budgets: Performance ≥95, SEO 100, Accessibility ≥95, Best Practices ≥95,
LCP <2.5s, CLS <0.1.

| Page | Perf | SEO | A11y | BP | LCP (ms) | CLS |
|---|---:|---:|---:|---:|---:|---:|
| home-en `/` | 88 | 100 | 93 | 96 | 3061 | 0.047 |
| home-es `/es/index.html` | 83 | 100 | 93 | 96 | 3480 | 0.036 |
| course-en `/CTSNTCourse.html` | 100 | 100 | 100 | 100 | 1054 | 0 |
| course-es `/es/CTSNTCourse.html` | 100 | 100 | 100 | 100 | 1055 | 0 |
| lesson-en `/CTSNTUnit1.html` | 99 | 100 | 100 | 96 | 1964 | 0 |
| lesson-es `/es/CTSNTUnit1.html` | 99 | 100 | 100 | 96 | 1963 | 0 |

All enforced budgets passed.
