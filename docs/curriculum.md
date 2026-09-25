# Curriculum rules: where they live, and the two exceptions that are not bugs

_25 Sept 2026. Written after Wayne's consolidated audit of the beta (items 12 and 14)._

## The rules

| Rule | Value |
|---|---|
| Foundation courses (required of everyone; every other course is locked until all seven are done) | Old Testament Survey `CTSOTS`, New Testament Survey `CTSNT`, Systematic Theology `CTSST`, Evangelism `CTSEVANGELISM`, Pastoral Ministries `CTSPM`, Church History `CTSCH`, Preaching / WiseSpeak `WISESPEAK` |
| Certificate of Ministry | 12 courses including the seven foundation courses |
| Associate of Divinity | 25 courses including the seven foundation courses |
| Master of Theology (Th.M.) | 12 courses including the seven foundation courses, earned on a master's track |
| Master of Divinity (M.Div.) | 30 courses including the 20 M.Div. core courses, earned on a master's track |
| M.Div. core (20) | the seven foundation courses plus Hermeneutics `CTSHERMENEUTICS`, Language Appreciation `CTSLA`, Genesis Intensive `CTSGENESIS`, Psalms `CTSPSALMS`, Matthew Intensive `CTSMATT`, Romans `CTSROMANS`, Acts Intensive `CTSACTS`, Apologetics `CTSAPOL`, Counseling `COUNSELING`, Church Administration & Leadership `CTSAL`, Christian Worship `CTSWORSHIP`, Christian Education `CTSCE`, World Missions `CTSMISSIONS` |

## Two courses are open before the foundation — on purpose

Every course except the seven foundation courses is locked until the foundation is complete. Two are deliberately open from the start. **Do not "fix" either of these as a gating bug.**

1. **How We Got the Bible** (`CTSBibleUnit1.html`, prefix `ctsbible`) — opened at Wayne's request so that a new student has an apologetics course available before finishing the foundation.
2. **Deacon Family Ministry Plan** (`CTSDeaconFamilyMinistryUnit1.html`, prefix `ctsdeaconfamilyministry`) — always open; it is a church-programme course, not part of a degree sequence.

Both are listed in `OPEN_ENTRY` / `OPEN_PREFIX` in `public/cts-curriculum.js` with a comment, and `tools/verify-gating.mjs` checks the locked/open state of every catalog entry against the hand-written front page, so a change to either would fail that check.

## Where the rules are defined today (and why that is a risk)

The same seven foundation codes and 20 core codes are written out in each of these places. They agree today; Wayne's audit (item 12) pointed out that a change to one and not the others is a future risk.

| File | What it holds |
|---|---|
| `worker/awards.js` | `FOUNDATION`, `MDIV_CORE`, `DEGREES` — the server-side award rules |
| `public/cts-curriculum.js` | `CORE` (the seven foundation codes) and the open-entry lists — gating in the browser |
| `migrations/0003_tracker.sql` | the seven codes and the 20 core codes inside the `degree_progress` view |
| `public/CTSCertificateOfMinistry.html` and the other degree pages | the counts and core lists the student sees |
| `tools/verify-certificate-unlock.mjs`, `test/api.test.mjs` | the numbers the checks pin |

Planned (Phase 3 of `claude/wayne-audit-response-plan.md` in the project): one `src/data/curriculum.json` generated into the Worker catalog, the gating script and the SQL view, with a verify script that fails the build if any copy drifts. Until then, **a change to the foundation or the core list must be made in every file above.**
