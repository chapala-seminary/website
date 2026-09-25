# Completion notices from the Google Apps Script (interim)

_25 Sept 2026. Wayne's audit, item 5(a). Interim only: the plan is for the Cloudflare Worker to send this notice as part of one server-side completion event and to record it in D1 (see `claude/server-side-completion-plan.md`, Phase 2), after which the Apps Script call in `public/assets/js/cts-record.js` is removed._

## What the site sends today

`cts-record.js` POSTs a form-encoded body to the Apps Script web app the moment a course's last unit is passed — once per course per browser, and only for a completion new to the student's record, so a restore onto a new device does not re-report. Fields:

| field | value |
|---|---|
| `name` | the student's registered name |
| `course` | the course name as the certificate page writes it (e.g. `Romans \|`) |
| `track` | `Certificate of Ministry`, `Associate of Divinity`, `Master of Theology (Th.M.)` or `Master of Divinity (M.Div.)` |
| `date` | `YYYY-MM-DD` |
| `email` | the student's email, if given |

The endpoint is the `ENDPOINT` constant at the top of `cts-record.js`. Genesis used to post to a different Apps Script URL; it now goes through the same one.

## The change to make in the Apps Script editor

The script is not in this repository — it lives in the seminary's Google account (the one that owns the sheet the count is kept in). Open it at script.google.com, find `doPost`, and add the `MailApp.sendEmail` call after the row is appended. Nothing else changes.

```javascript
var NOTIFY_TO = 'info@chapalaseminary.org';   // forwards to chapalatheological@gmail.com (Cloudflare Email Routing)

function doPost(e) {
  var p = (e && e.parameter) || {};
  var row = [new Date(), p.name || '', p.course || '', p.track || '', p.date || '', p.email || ''];

  // ...the existing code that appends `row` to the sheet stays as it is...

  // New: email the seminary the moment the record lands, so nothing depends
  // on the student pressing Send in their own mail app.
  try {
    MailApp.sendEmail({
      to: NOTIFY_TO,
      subject: 'CTS completion: ' + (p.course || '(course?)') + ' — ' + (p.name || '(name?)'),
      body: [
        'Name:   ' + (p.name || ''),
        'Course: ' + (p.course || ''),
        'Track:  ' + (p.track || ''),
        'Date:   ' + (p.date || ''),
        'Email:  ' + (p.email || '(none given)'),
        '',
        'Recorded automatically by the course page when the last unit was passed.',
      ].join('\n'),
      replyTo: p.email || undefined,
    });
  } catch (err) {
    // A mail failure must never turn into a failed record.
    Logger.log('MailApp failed: ' + err);
  }

  return ContentService.createTextOutput('ok');
}
```

Then **Deploy → Manage deployments → edit the active deployment → New version → Deploy**. The web-app URL does not change when a deployment is versioned this way, so the site needs no edit. (Creating a *new* deployment instead would give a new URL, which would then have to replace `ENDPOINT` in `cts-record.js`.)

Notes:

* `info@chapalaseminary.org` is the seminary's mailbox as of 25 Sept 2026: Cloudflare Email Routing forwards it to chapalatheological@gmail.com, so the notices still land in the same inbox Wayne's tracker reads, and the address stays right if the Gmail account ever changes.
* `MailApp` sends from the Google account that owns the script; the daily quota (100 for a consumer account) is far above the seminary's volume.
* The first run after adding `MailApp` will ask for the additional "send email as you" permission; approve it once from the editor (**Run → doPost** with no arguments is enough to trigger the prompt, though the call itself will fail without parameters).
* If the sheet is meant to stay the running count, no change there. If it is not, this is also the moment to confirm what the current `doPost` does with `row`.

## How to check it worked

Open any course's last unit on the beta site, register as a test student, pass the unit, and watch the inbox. The same completion will not send twice from the same browser (`cts_cc_recorded_<page>` in localStorage guards it); clear site data to test again.
