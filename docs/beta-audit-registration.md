# Beta audit: registration and recovery

Standard unit registration asks for an email and does not require one. A blank address enrolls. A malformed address produces a visible translated error and focuses the field. Verification stays optional during study and is what returns a lost code and delivers a certificate.

Counseling, Narrative Preaching, WiseSpeak and Ethics now load the shared sync client. The first three legacy forms also save their registration into the shared student profile, keeping their existing course registration and progress keys. Master of Theology’s legacy track name maps to the shared thm value. Existing shared profile fields remain available.

If registration cannot reach the Worker, the browser keeps its work and offers a translated retry. A profile whose typed address is not usable can correct or clear it in that notice. A student who enrolled with no address is asked, once they have a code, to add one for recovery and a certificate, and can dismiss that note and keep studying. Successful sync removes the failure notice. No existing student is forced to verify email to study.

Focused real-Worker tests cover six signup entry points in English, Spanish and French. A blank email creates a code and shows the optional-email note. A malformed email does not. Coursework language is saved, a second sync does not create a second registration, another browser restores the record, a simulated outage can be retried, and a profile with no email keeps its unit progress. The latest run reported 159 checks. All records are synthetic, in a disposable local D1 database; mail is log-only.

These checks supplement the confirmation-code/link, expiry/replay, certificate eligibility, public verification and recovery API tests in the full suite. They do not prove external email delivery in each language or sign off a live beta release. After review and beta deployment, complete actual confirmation, cross-device recovery and certificate issuance with a controlled beta student account before production promotion. Do not publish names, addresses, student codes or submitted answers in release records.
