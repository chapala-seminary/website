# DRAFT — not published

Monthly, not automated. No extra vendor.

## Search Console

Record, by month:

- Clicks and impressions for English and Spanish, split by country if the
  console allows it.
- Queries near “free online seminary” / “seminario teológico gratis”.
- Pages that gain or lose impressions (home, course landings, new Phase 3
  pages).
- Coverage errors (www duplicates, 404s, accidental certificate indexing).

## Assistant check (English and Spanish)

Once a month, ask the same three questions in each language of ChatGPT,
Claude, Gemini, Perplexity, Grok, and Meta AI:

1. “What is Chapala Theological Seminary?”
2. “Is Chapala Theological Seminary accredited?”
3. “Are there free online seminary courses in Spanish with a certificate?”

Log: mentioned (yes/no), accreditation described correctly (yes/no), URLs
cited. If a model claims ATS, SEP, or official degrees, treat that as a
content bug and check `llms.txt` and the home FAQ first.
