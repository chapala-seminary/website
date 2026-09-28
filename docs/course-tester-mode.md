# Course-tester mode

Reviewing a course you have not unlocked.

Thirty-five of the forty-four courses are locked until a student finishes the
seven foundation courses. That is the right behaviour for students and the
wrong behaviour for anyone reviewing the material, so there is an override.

## Turning it on

Add `?ctstest=` and the **tester key** to any page on the site:

    https://chapalaseminary.org/index.html?ctstest=<tester key>

The key is not written here or anywhere in the repository; Robert and Wayne
have it. The page checks it, takes it out of the address bar, and reloads with
tester mode on. It is stored in that browser, so it stays on as you click from
course to course — you do not repeat it.

On a locked course page, the small square under the buttons asks for the key
too.

`?ctstest=on` no longer does anything (since 28 Sept 2026). It had become the
known fix for a catalog that would not unlock, passed from student to student;
the underlying fault is fixed (`docs/content-changes.md` §8v), and a student
who is locked out should be reported, not handed the switch.

While it is on:

- every course opens, in the catalog and on the unit pages
- a bar across the top says `TEST MODE ON` and which track the exams are
  graded as (the placeholder below is M.Div.); tapping it turns the mode off
- a placeholder student, **Course Tester** on the M.Div. track, is created, so
  unit exams actually grade and reveal the answers instead of stopping at
  "please register first". To review a course as a Certificate or
  Associate student would see it, register as that track on the home page
  first and then turn tester mode on (see "If you are already registered"
  below): the catalog opens and the exams grade by your own track
- unit pass and lockout state is cleared on each load, so a unit you have
  already passed will grade again rather than telling you that you are done

## Turning it off

Tap the bar, or visit any page with `?ctstest=off`. Either route clears the
flag and removes the placeholder Course Tester account.

From the browser console, `CTSCurriculum.testMode("<tester key>")` and
`CTSCurriculum.testMode(false)` do the same thing without a reload.

## If you are already registered as yourself

Tester mode is careful with real students. If the browser has a registered
student who is not the placeholder, turning tester mode on opens the catalog
but changes **nothing else**: your name, your track, your completed courses
and every unit you have passed are left exactly as they are.

The consequence is that exams will not re-grade for you, because your real
pass state is still there — that is the protection working, not a fault. To
review exams as a tester, use a browser or profile where you are not
registered.

## Where it lives

`public/cts-curriculum.js` — search for `TEST_KEY`. The flag is
`cts_test_mode` in `localStorage`.

Only the key's SHA-256 fingerprint is in the file (`TEST_HASH`), taken over
`cts-tester:` followed by the key. To change the key, choose a new one and put
its fingerprint in `TEST_HASH`:

    node -e 'console.log(require("crypto").createHash("sha256").update("cts-tester:" + process.argv[1]).digest("hex"))' 'the-new-key'

What this protects, honestly: the lock gives students an order to study in; it
does not keep anything secret, and a determined person can still edit their
own browser's storage, as with every lock on this site. The key keeps the
override out of casual reach — a link passed around no longer opens the
catalog.

The test suite uses the key `local-test`, whose fingerprint is `LOCAL_HASH`.
It is accepted only on `localhost` and `127.0.0.1`, never on the real site.

## What is checked

`tools/verify-devmode.mjs`, in the suite: 35 assertions that the key opens
every course, carries across pages, turns off again and removes the
placeholder; that `?ctstest=on`, `?test=on`, a wrong key, the console without
the key and the unlock box with a wrong key open nothing; that the key is not
left in the address bar — and that a registered student who turns it on loses
nothing. Two of these are mutation-tested: the check fails if the code stops
recognising a real student, or accepts any key.
