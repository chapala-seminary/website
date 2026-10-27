# PR #180 custom-domain health: positive browser fetch, failed release-parameter negative control
**Date:** 26 October 2026 (Mexico City); **mode:** read-only public HTTP, no production edits. This complements, but does not supersede, `PR180_POST_MERGE_RELEASE_STATE_2026-10-26.md`.

## Direct evidence
- The exact PR #180 approved head `c6110458213ee676833149a8f30c8b121572ec89` was owner-merged to main commit `a5d7b380361e4db1a54b88bf7113f3eaed83ab81` on 27 Oct 02:33:10Z. Production workflow 40439092559 previously passed build, private-key checkout, tests, deploy and direct Worker release verification.
- A normal generic HTTP/web fetch of `https://chapalaseminary.org/api/health?release=2026-10-27%20a5d7b380` could not access the custom-domain endpoint (Cloudflare challenge/tool access limitation).
- An independent fresh JavaScript-capable browser-content fetch (TTL 0) of that **same public custom-domain URL** returned valid JSON, `"ok":true`, with a `"requiredFrom"` object (3,087 characters). No login or privileged data was used.
- **Negative control:** fetched `https://chapalaseminary.org/api/health?release=NONEXISTENT-RELEASE-CHECK` independently, also fresh (TTL 0). It returned **exactly the same 3,087-character JSON body**, `"ok":true`; neither response has a `"release"` field. Thus the supplied `release=` query parameter is **not a meaningful release-identity assertion** on this endpoint. Do not treat a successful `?release=...` health query as proof that the custom domain serves the specified Git SHA.
- Observed positive result is **custom-domain health reachability** through a browser-capable fetch, not proof of full student workflows, not a new assessment-key audit, and not a domain-to-exact-commit identity match. The successful GitHub production workflow remains separate evidence for the exact tested/deployed release.

## Required improvement (proposal only; no production changes)
1. Expose a safe, non-secret **immutable build/release identifier** in the health JSON or in a dedicated read-only `/api/version` endpoint, populated at build/deploy from the exact Git SHA. A supplied query parameter must never be echoed as if it were an authoritative release marker.
2. Have the production acceptance workflow assert **the response's actual release identifier** equals the expected main SHA, fail closed on mismatch or missing field, and verify the custom domain from a browser-capable runner if Cloudflare challenges generic probes.
3. Continue private-key-exposure checks and synthetic student-safe smoke tests; do not change production without owner approval.

**Status:** custom-domain endpoint independently returns `ok:true`; exact custom-domain release identity **UNVERIFIED** because health JSON has no release marker and the query parameter failed the negative control. PR #164 remains separate draft/non-sending. No merge, deploy, student data, keys, grades or email changes made.
