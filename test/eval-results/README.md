# Real eval runs

Agent-written answers only (no student text). Grader: `@cf/meta/llama-3.3-70b-instruct-fp8-fast`.

| Run | Prompt | Items | Cost | Result against the bar (docs/ai-grading.md §13) |
|---|---|---|---|---|
| 1 (15 Oct; file overwritten by run 2) | 2026-10-15.1 | 2,346 | $0.85 | Too strict. Agreement 89.3%; right answers failed 14.2%; ES gap 8.3 pts. Cause: quotes that did not match the answer letter for letter dropped points that were really made. |
| 2 (`…run2-prompt-15.2.json`) | 2026-10-15.2 | 2,346, 100 repeated | $0.92 | Agreement 97.8%; right failed 0.6%; ES/FR gaps 1.7 pts; repeatability 98%. Failing answers passed 5.6%: 7 real cases (topic-only quotes), plus 11 biased relabels, now "debatable". |
| 3 (`…run3-targeted-prompt-15.3.json`) | 2026-10-15.3 | 965 of 1,022 short answers (stopped at its $0.60 cap) | $0.60 | Agreement 98.6%; right failed 1.0%; ES/FR within 3.4 pts. **Failing answers passed 2.2% against a bar of 2%** (6 of 160 "half" answers). Partial run. |

Labels are agent guesses until faculty blind-grade a sample (`tools/eval-blind-sheet.mjs`).
Total spent on real runs, including two smoke tests ($0.02): $2.39.
