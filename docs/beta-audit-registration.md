# Beta audit: registration and recovery

Standard unit registration now asks for a valid email, matching the Worker’s required signup field. Missing or invalid email produces a visible translated error and focuses the field; verification remains optional during study.

Counseling, Narrative Preaching, WiseSpeak and Ethics now load the shared sync client. The first three legacy forms also save their registration into the shared student profile, keeping their existing course registration and progress keys. Master of Theology’s legacy track name maps to the shared thm value. Existing shared profile fields remain available.

If registration cannot reach the Worker, the browser keeps its work and offers a translated retry. Older browser profiles without an email can add one in this notice. Successful sync removes the notice. No existing student is forced to verify email to study.

Focused real-Worker tests passed 162 checks: six signup entry points in English/Spanish/French, code creation, saved coursework language and email, repeat sync without duplicate registration, restoration into another browser, simulated registration outage/retry, and recovery of a missing-email profile without losing its unit progress. All records are synthetic, in a disposable local D1 database; mail is log-only.

These checks supplement the confirmation-code/link, expiry/replay, certificate eligibility, public verification and recovery API tests in the full suite. They do not prove external email delivery in each language or sign off a live beta release. After review and beta deployment, complete actual confirmation, cross-device recovery and certificate issuance with a controlled beta student account before production promotion. Do not publish names, addresses, student codes or submitted answers in release records.
