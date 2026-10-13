# Inspecting and correcting a course certificate

Use this walkthrough with a separate browser profile or private window for one student at a time. Student codes grant access to the entire record. Keep them out of shared documents, screenshots, terminal logs, GitHub and git. Do not clear the student's browser data or ask them to repeat a valid exam to fix a display problem.

## Worked example (13 October 2026, anonymized)

The production record supported Hermeneutics (units 1–11), Evangelistic Preaching (1–10), World Missions (1–10), and Counseling Situations (0–12). Each required unit was present, the completion level was `cert`, and email verification was present. The first three had no issued certificate. The existing certificate for Counseling Situations was a **course** award with a generic title, not a program diploma.

The three supported course certificates were issued through the existing production `/api/certificate` endpoint, which checks eligibility. The generic title was corrected on the existing Counseling Situations certificate, preserving its verification code and issue date. A before/after comparison confirmed that progress, completion records and textbook results were unchanged. Spanish PDFs were made with the site's PDF maker, the real verification codes and the original recorded completion dates. No honors or advanced award was added.

A reproduced Spanish visibility defect in Hermeneutics and Evangelistic Preaching also hides the entire body because `.lang-es { display: none }` matches `body.lang-es`. The repair excludes the body from this rule.

A reproduced timing defect affects the first three pages: they inspect local progress once, before asynchronous sync can restore it. A repair on `codex/certificate-sync-repair` makes the pages recheck after each completed application of server progress. It also updates Counseling Situations after restoration, restarts registration and PDF controls after slow restorations outlast their original polling windows, names the course explicitly for certificate registration, and corrects Hermeneutics' twelve/doce to eleven/once and Evangelistic Preaching's eleven/once to ten/diez. This does not prove the timing defect was the only cause on the student's device; screenshots were requested separately. The code repair requires review and production publication.

## 1. Inspect the full record

1. Sign in at `https://chapalaseminary.org/staff/students` and confirm the intended student. The roster gives a summary; it does not offer full unit editing or certificate reissue controls.
2. In the separate browser window, open `https://chapalaseminary.org/cts-backup.html` and restore the supplied student code. Use an empty staff window so another student's progress cannot be merged into this record. The student's own study browser can restore safely because restoration adds progress rather than deleting it.
3. Inspect the student record returned by `GET /api/student/<code>` in the browser's Network panel. Treat the full request URL as private. Check `student.email_verified_at`, `student.track`, `progress`, `completions`, `textbooks`, and `certificates`.
4. Compare the **exact unit numbers**, not just the count or last-unit notice, with `GET /api/catalog` → `courses[slug].units`. Counseling Situations includes unit **0**. For courses that keep no units, check the canonical completion code. Confirm the course's recorded completion level separately from the student's current program.
5. Check `certificates` for an unrevoked entry with `level: "course"` and the correct course. Its `verify_code`, `title` and `issued_at` are the issued record. An absent email notice alone does not prove an absent award.

A last-unit completion notice is evidence of that event; it is not independent evidence that every earlier required unit passed. The grading itself remains client-side; these records attest to reported passes.

## 2. Correct the problem without replacing valid progress

- **All units present, page locked:** let restoration finish, then open or refresh the certificate page. The proposed code repair makes this automatic. If still blocked, record the missing-unit list and screenshot, without exposing the student code. Compare that list with the server record.
- **Units absent from the server but present on the original study device:** open the course on that device and allow sync to finish; inspect the record again. Do not invent missing passes from a last-unit email. If records disagree, have the technical administrator inspect the original saved pass evidence before any narrowly scoped correction.
- **Email unverified:** use the site's confirmation flow with the student's registered address. Do not substitute a reply-from address or manually mark it verified.
- **Existing certificate, wrong title:** have the technical administrator correct only that certificate's title. Preserve the course, level, verification code, issue date and revocation state. The normal reissue API returns the existing code and does **not** update its title or resend its original email.

For a technical administrator, a title correction must use a guarded production D1 update: identify the student, verification code, course, level and expected old title, require `revoked_at IS NULL`, change only `title`, and verify exactly one changed row. Use the repository's pinned CTS account and production database. Never revoke/delete an otherwise valid award just to change its wording; never bulk-update student progress.

## 3. Issue, reissue and download

Open the course's certificate page from `catalog.completions[code].page`. With a complete synchronized record and verified email, the page registers the certificate automatically. Wait for its verification code before downloading. The existing endpoint is idempotent: repeating the same course award returns its original unrevoked code.

If the page itself prevents issuance, a technical administrator can use the same endpoint from the production site console after privately inspecting the complete record. Enter the student's code through `prompt`, not a saved script or pasted command history:

```js
const code = prompt('Student code (private)');
const course = 'hermeneutics'; // change to the exact inspected catalog slug
const catalog = await (await fetch('/api/catalog')).json();
const record = await (await fetch('/api/student/' + encodeURIComponent(code))).json();
const c = catalog.courses[course];
const missing = c.units.filter(u => !record.progress.some(p => p.course === course && p.unit === u));
if (missing.length) throw new Error('Missing units: ' + missing.join(', '));
if (!record.student.email_verified_at) throw new Error('Email is unverified');
// This example is only for work earned at Certificate level.
if (record.student.track !== 'cert' || record.student.goal === 'assoc' ||
    !record.completions.some(x => x.code === c.code && x.track === 'cert'))
  throw new Error('Review the recorded completion level before issuing');
const info = catalog.completions[c.code];
const response = await fetch('/api/certificate', {
  method: 'POST', headers: {'content-type': 'application/json'},
  body: JSON.stringify({code, level: 'course', course,
    title: info.name + ' — Certificate of Ministry', page: info.page})
});
const result = await response.json();
if (!response.ok) throw new Error(result.error || 'Certificate not issued');
console.log({verificationCode: result.verifyCode, reissued: result.reissued,
             emailed: result.emailed});
```

A new award sends a student email with the verification link and certificate-page link; it does not attach a PDF. `emailed: true` means the email service accepted it, not that the recipient read it. A reissue returns the existing code without a new email. Do not run this as a workaround for missing requirements.

Use **Download PDF / Descargar PDF**, select the student's language, and check the saved file: name, course, Certificate track, date, signatures, verification code and absence of unearned honors. Open `https://chapalaseminary.org/verify/<verification-code>` and confirm its course, student name and validity. The current normal PDF maker prints the download day's date under “Date of Completion”; an office copy should use the original supported completion date and preserve the separate issuance date in the server record. Send copies through the seminary's established private channel after checking the registered address. Close the separate browser window when finished.

## 4. Separate course certificates from advanced study

Changing a student's goal does not upgrade prior Certificate-level completions. Associate work requires its additional assessments; Th.M. and M.Div. require the advanced unit assessments, applicable mandatory textbook and required-reading tests, and their program's required courses and totals. Keep valid existing progress, identify the additional requirements course by course, and confirm a progression plan with the faculty. This case issues already-earned course certificates only.
