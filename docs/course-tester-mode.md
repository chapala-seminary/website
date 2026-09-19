# Course-tester mode

Reviewing a course you have not unlocked.

Thirty-five of the forty-four courses are locked until a student finishes the
seven foundation courses. That is the right behaviour for students and the
wrong behaviour for anyone reviewing the material, so there is an override.

## Turning it on

Add `?ctstest=on` to any page on the site:

    https://chapalaseminary.org/index.html?ctstest=on

That is the whole thing. It is stored in that browser, so it stays on as you
click from course to course — you do not repeat the parameter. `?test=on`
works the same way.

While it is on:

- every course opens, in the catalog and on the unit pages
- a bar across the top says `TEST MODE ON`; tapping it turns the mode off
- a placeholder student, **Course Tester** on the M.Div. track, is created, so
  unit exams actually grade and reveal the answers instead of stopping at
  "please register first"
- unit pass and lockout state is cleared on each load, so a unit you have
  already passed will grade again rather than telling you that you are done

## Turning it off

Tap the bar, or visit any page with `?ctstest=off`. Either route clears the
flag and removes the placeholder Course Tester account.

From the browser console, `CTSCurriculum.testMode(true)` and
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

It is deliberately a plain, guessable parameter. The lock exists to give
students an order to study in, not to keep the material secret; every course
is free to anyone who finishes the foundation. Nothing behind it is
confidential, so there is nothing for a harder-to-guess switch to protect.

## What is checked

`tools/verify-devmode.mjs`, in the suite: 23 assertions that the parameter
opens every course, carries across pages, turns off again and removes the
placeholder — and that a registered student who turns it on loses nothing.
That last one is mutation-tested: the check fails if the code stops
recognising a real student.
