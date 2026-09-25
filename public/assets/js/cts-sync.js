/* Chapala Theological Seminary — progress sync.
 *
 * localStorage stays in charge. This file mirrors it to the seminary's
 * database so that a cleared browser or a new phone is no longer the end of
 * someone's degree. It is deliberately incapable of making the site worse:
 *
 *   - it never removes anything from localStorage, only adds
 *   - every call is wrapped; a failed request is dropped, never surfaced
 *   - if the API is unreachable, unconfigured, or slow, nothing on the page
 *     waits for it and nothing changes
 *   - it sends only what the student already stored in their own browser
 *
 * It does not patch localStorage or hook the exam engine. It takes a digest of
 * the cts_* keys, and when that digest changes it syncs. Slower than a hook by
 * a few seconds, and it cannot break an exam.
 *
 * Load it deferred, after the engine:
 *     <script src="/assets/js/cts-sync.js" defer></script>
 */
(function () {
  'use strict';

  // Same origin by default. window.CTS_SYNC_API overrides it, which is how
  // the test harness points at a dev server and how a separate API host would.
  var API = (typeof window !== 'undefined' && window.CTS_SYNC_API) || '/api';
  var CODE_KEY = 'cts_student_code';
  var POLL_MS = 5000;

  // ---- storage, tolerant of blocked localStorage (some Android webviews) ----
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function keys() { try { return Object.keys(localStorage); } catch (e) { return []; } }
  function parse(s, fallback) { try { var v = JSON.parse(s); return v == null ? fallback : v; } catch (e) { return fallback; } }

  function available() {
    try { localStorage.setItem('cts_sync_probe', '1'); localStorage.removeItem('cts_sync_probe'); return true; }
    catch (e) { return false; }
  }

  // ---- read the student's state out of the keys the engine already writes --
  //
  // The engine writes two keys per unit, and only one of them means "passed":
  //   cts_<course>_progress       = {"unit3": true, ...}   the unit is passed:
  //                                 every part the student's track requires
  //                                 (multiple choice, and short answer on the
  //                                 master's tracks) reached its mark
  //   cts_<course>_u<N>_mc_passed = "1"                    multiple choice is
  //                                 banked while the rest is still to do
  // Only the progress map is progress. Until 25 Sept 2026 the banked flag was
  // read as well, so a master's student who passed multiple choice and failed
  // short answer reached the seminary's records as having passed the unit,
  // and a restore onto another device marked it complete (Wayne's audit, #2).
  /* ---- the keys the old per-course engines wrote ----------------------
   * Several courses kept progress under another slug or key shape before the
   * unified engine (see LEGACY in cts-engine.js -- the two tables must agree,
   * and tools/verify-legacy-table.mjs checks that they do). Here they matter
   * twice: a browser that only has the old keys must still sync its progress,
   * under the engine's slug; and a restored device must get the old keys
   * written, because the certificate pages read them. */
  var LEGACY = {
    "1peter":               { slug: "1pet" },
    "biblecharacters":      { slug: "CTSBC" },
    "biblecharacters2":     { slug: "CTSBC2" },
    "galatians":            { slug: "gal" },
    "deaconfamilyministry": { slug: "CTSDFM" },
    "evangelism":           { slug: "ev" },
    "hermeneutics":         { slug: "herm",       flag: function (n) { return "cts_herm_u" + n + "_passed"; },         value: "true" },
    "evanpreach":           { slug: "evenpreach", flag: function (n) { return "cts_evenpreach_unit" + n + "_passed"; }, value: "1" },
    "bible":                { flag: function (n) { return "cts_bible_u" + n + "_mcpass"; },      value: "1" },
    "pent":                 { flag: function (n) { return "cts_pent_unit" + n + "_passed"; },    value: "true" },
    "romans":               { flag: function (n) { return "cts_romans_unit" + n + "_passed"; },  value: "true" },
    "re":                   { flag: function (n) { return "re_unit" + n + "_passed"; },          value: "1" },
    "cs":                   { state: "cts_cs_state" },                 // {n: {passed: true}}
    "genesis":              { completion: "genesis" }                  // cts_genesis_uN_completion[_track]
  };
  var LEGACY_SLUG = {};                 // old slug -> engine slug
  Object.keys(LEGACY).forEach(function (c) { if (LEGACY[c].slug) LEGACY_SLUG[LEGACY[c].slug] = c; });

  function legacyUnits(course) {       // units passed under the old keys, by course
    var l = LEGACY[course], out = [];
    if (!l) return out;
    for (var n = 0; n <= 40; n++) {
      var hit = false;
      if (l.flag) { var v = get(l.flag(n)); hit = v === '1' || v === 'true' || v === 'passed'; }
      if (!hit && l.state) { var st = parse(get(l.state), {}) || {}; hit = !!(st[n] && st[n].passed); }
      if (!hit && l.completion) {
        hit = ['', '_cert', '_mdiv', '_thm'].some(function (t) { return !!parse(get('cts_genesis_u' + n + '_completion' + t), null); });
      }
      if (hit) out.push(n);
    }
    return out;
  }
  function writeLegacy(course, n) {
    var l = LEGACY[course];
    if (!l) return;
    if (l.slug) {
      set('cts_' + l.slug + '_u' + n + '_mc_passed', '1');
      var lp = parse(get('cts_' + l.slug + '_progress'), {}) || {}; lp['unit' + n] = true;
      set('cts_' + l.slug + '_progress', JSON.stringify(lp));
    }
    if (l.flag) set(l.flag(n), l.value);
    if (l.state) { var st = parse(get(l.state), {}) || {}; st[n] = st[n] || {}; st[n].passed = true; set(l.state, JSON.stringify(st)); }
    if (l.completion && !parse(get('cts_genesis_u' + n + '_completion'), null)) {
      var tr = String(get('cts_track') || 'cert').toLowerCase(); tr = tr === 'mdiv' ? 'mdiv' : (tr === 'thm' || tr === 'mth') ? 'thm' : 'cert';
      var c = { course: 'genesis', unit: n, completedAt: new Date().toISOString(), track: tr, version: 2 };
      set('cts_genesis_u' + n + '_completion_' + tr, JSON.stringify(c));
      set('cts_genesis_u' + n + '_completion', JSON.stringify(c));
    }
  }

  function snapshot() {
    var student = parse(get('cts_student'), null);
    var track = get('cts_track');
    var done = parse(get('cts_done_codes'), []);
    var seen = {};
    var progress = [];

    function add(course, unit) {
      course = LEGACY_SLUG[course] || course;          // old slug -> engine slug
      var id = course + '\u0000' + unit;
      if (!seen[id]) { seen[id] = 1; progress.push({ course: course, unit: +unit }); }
    }
    keys().forEach(function (k) {
      var m = /^cts_(.+)_progress$/.exec(k);
      if (!m) return;
      var course = m[1];
      var map = parse(get(k), null);
      if (!map || typeof map !== 'object') return;
      Object.keys(map).forEach(function (uk) {
        var um = /^unit(\d+)$/.exec(uk);
        if (um && map[uk]) add(course, um[1]);
      });
    });
    Object.keys(LEGACY).forEach(function (c) { legacyUnits(c).forEach(function (n) { add(c, n); }); });

    // The certificate pages keep, beside the gating list, the codes finished
    // on a master's track; a degree counts only the courses at its own level,
    // so the track each completion was earned on travels with it.
    var tracks = {};
    [['cts_mdiv_done_codes', 'mdiv'], ['cts_thm_done_codes', 'thm']].forEach(function (pair) {
      var list = parse(get(pair[0]), []);
      if (Array.isArray(list)) list.forEach(function (c) { tracks[String(c).toUpperCase()] = pair[1]; });
    });

    return {
      student: student ? {
        name: student.name, email: student.email, country: student.country,
        track: (student.track || track || '').toLowerCase() || undefined,
        goal: student.goal, heard: student.heard,
      } : null,
      doneCodes: Array.isArray(done) ? done : [],
      completionTracks: tracks,
      progress: progress,
    };
  }

  function digest(s) {
    return JSON.stringify([
      s.student && [s.student.name, s.student.track, s.student.email, s.student.country, s.student.heard],
      s.doneCodes.slice().sort(),
      Object.keys(s.completionTracks).sort().map(function (k) { return k + ':' + s.completionTracks[k]; }),
      s.progress.map(function (p) { return p.course + ':' + p.unit; }).sort(),
    ]);
  }

  // ---- writing the server's view back, additively only --------------------
  function apply(state) {
    if (!state || !state.student) return;
    var local = parse(get('cts_student'), {}) || {};
    // The server's copy fills gaps; it does not overwrite what this browser
    // has, because this browser is where the student is typing right now.
    ['name', 'email', 'country', 'track', 'goal', 'heard'].forEach(function (f) {
      if (!local[f] && state.student[f]) local[f] = state.student[f];
    });
    set('cts_student', JSON.stringify(local));
    if (!get('cts_track') && state.student.track) set('cts_track', state.student.track);

    var done = parse(get('cts_done_codes'), []);
    if (!Array.isArray(done)) done = [];
    var added = false;
    (state.doneCodes || []).forEach(function (c) { if (done.indexOf(c) === -1) { done.push(c); added = true; } });
    if (added) set('cts_done_codes', JSON.stringify(done));

    // The lists the degree pages count: master's completions by code, and
    // every completion by the name its certificate page wrote. Without these
    // a student restored onto a new device kept their unit progress and lost
    // their degree progress.
    function addTo(key, value) {
      var list = parse(get(key), []);
      if (!Array.isArray(list)) list = [];
      if (list.indexOf(value) === -1) { list.push(value); set(key, JSON.stringify(list)); }
    }
    (state.completions || []).forEach(function (c) {
      if (!c || !c.code) return;
      if (c.track === 'mdiv') addTo('cts_mdiv_done_codes', c.code);
      if (c.track === 'thm') addTo('cts_thm_done_codes', c.code);
      if (c.name) addTo('cts_degree_courses', c.name);
    });

    (state.progress || []).forEach(function (p) {
      var pk = 'cts_' + p.course + '_progress';
      var map = parse(get(pk), {}) || {};
      if (!map['unit' + p.unit]) { map['unit' + p.unit] = true; set(pk, JSON.stringify(map)); }
      var mk = 'cts_' + p.course + '_u' + p.unit + '_mc_passed';
      if (get(mk) !== '1') set(mk, '1');
      writeLegacy(p.course, p.unit);                   // the keys the certificate page reads
    });
  }

  // ---- the network, which is always allowed to fail ------------------------
  function send(path, payload, method) {
    return fetch(API + path, {
      method: method || 'POST',
      headers: { 'content-type': 'application/json' },
      body: payload === undefined ? undefined : JSON.stringify(payload),
      credentials: 'omit',
      keepalive: true,
    }).then(function (r) {
      if (!r.ok) return null;
      return r.json().catch(function () { return null; });
    }).catch(function () { return null; });
  }

  /* The site is deployed without this API, and will be for a while. So the
   * script asks once per tab whether there is an API at all, remembers the
   * answer, and otherwise does nothing: no repeated failing requests, no
   * console noise, and no need to add a script tag on the day the database
   * goes live. When the API appears, this starts working by itself. */
  var API_KEY = 'cts_sync_api';

  /* A student who asked to be forgotten stays forgotten.
   *
   * Deleting the record is not enough on its own. push() registers a new
   * student whenever there is no code, and the name and email are still in
   * this browser, so the very next unit they pass would quietly hand the
   * seminary the same details again and the delete would undo itself. This
   * flag is what makes it stick: set when a record is deleted, and cleared
   * only when the student says, deliberately, that they want to take part
   * again. Nothing reads it but this file. */
  var OFF_KEY = 'cts_sync_off';
  function optedOut() { return get(OFF_KEY) === '1'; }
  var apiCheck = null;
  function apiPresent() {
    if (apiCheck) return apiCheck;
    var cached = null;
    try { cached = sessionStorage.getItem(API_KEY); } catch (e) {}
    if (cached === '1') return (apiCheck = Promise.resolve(true));
    if (cached === '0') return (apiCheck = Promise.resolve(false));
    apiCheck = fetch(API + '/health', { credentials: 'omit' })
      .then(function (r) { return r.ok; })
      .catch(function () { return false; })
      .then(function (up) {
        try { sessionStorage.setItem(API_KEY, up ? '1' : '0'); } catch (e) {}
        return up;
      });
    return apiCheck;
  }

  var lastDigest = null;
  var inFlight = false;

  function syncOnce(force) {
    if (inFlight || !available() || optedOut()) return Promise.resolve(null);
    var snap = snapshot();
    // Nothing to sync until the student has registered in this browser.
    if (!snap.student || !snap.student.name) return Promise.resolve(null);
    var d = digest(snap);
    if (!force && d === lastDigest) return Promise.resolve(null);

    return apiPresent().then(function (up) { return up ? push(snap, d) : null; });
  }

  function push(snap, d) {
    if (inFlight) return Promise.resolve(null);
    inFlight = true;
    var code = get(CODE_KEY);

    var start = code
      ? Promise.resolve(code)
      // An existing student, already part-way through their degree, gets a
      // code on their next visit and their whole localStorage is pushed up.
      // Nobody has to start again, and nobody is asked to do anything.
      : send('/register', {
        name: snap.student.name, email: snap.student.email,
        country: snap.student.country, track: snap.student.track || 'cert', goal: snap.student.goal,
        heard: snap.student.heard,
      }).then(function (r) {
        if (!r || !r.code) return null;
        set(CODE_KEY, r.code);
        return r.code;
      });

    return start.then(function (c) {
      if (!c) return null;
      return send('/sync', { code: c, student: snap.student, progress: snap.progress,
                             doneCodes: snap.doneCodes, completionTracks: snap.completionTracks });
    }).then(function (state) {
      if (state) { apply(state); lastDigest = digest(snapshot()); }
      return state;
    }).catch(function () { return null; })
      .then(function (r) { inFlight = false; return r; });
  }

  /* Restore a record onto this device from a student code. This is the whole
   * point of the exercise: a student who lost their browser types their code
   * and their degree comes back. It only ever adds. */
  function restore(rawCode) {
    var c = String(rawCode || '').trim();
    if (!c) return Promise.resolve({ ok: false, error: 'no code given' });
    return fetch(API + '/student/' + encodeURIComponent(c), { credentials: 'omit' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (state) {
        if (!state) return { ok: false, error: 'no record for that code' };
        apply(state);
        set(CODE_KEY, state.student.id);
        // A successful restore is proof the API is there, whatever an earlier
        // probe concluded.
        apiCheck = Promise.resolve(true);
        try { sessionStorage.setItem(API_KEY, '1'); } catch (e) {}
        lastDigest = null;
        return { ok: true, student: state.student, units: (state.progress || []).length };
      })
      .catch(function () { return { ok: false, error: 'could not reach the seminary' }; });
  }

  /* Delete this student's record at the seminary.
   *
   * The code goes with it. It used to stay behind, which made the delete a
   * lie in two ways at once: the browser still held the student's code, name
   * and email after they had asked to be forgotten, and every poll from then
   * on posted that code to an endpoint that answered 404. Clearing it is also
   * what stops the record coming back -- push() registers a new student only
   * when there is no code, so a code left behind is a code that keeps trying.
   *
   * What this does NOT do is erase the progress saved in this browser. That is
   * a different request -- "stop holding my details" is not "delete my work" --
   * and the page that offers this offers that separately, and says so. */
  function forget() {
    var c = get(CODE_KEY);
    if (!c) return Promise.resolve({ ok: false, error: 'this browser has no student code' });
    return fetch(API + '/student/' + encodeURIComponent(c), { method: 'DELETE', credentials: 'omit' })
      .then(function (r) {
        if (!r.ok) return { ok: false, error: 'the seminary could not delete that record' };
        try { localStorage.removeItem(CODE_KEY); } catch (e) {}
        try { sessionStorage.removeItem(API_KEY); } catch (e) {}
        set(OFF_KEY, '1');
        lastDigest = null;
        return { ok: true };
      })
      .catch(function () { return { ok: false, error: 'could not reach the seminary' }; });
  }

  // ---- when to sync --------------------------------------------------------
  function schedule() {
    syncOnce(true);
    setInterval(function () { if (!document.hidden) syncOnce(false); }, POLL_MS);
    // A student who passes a unit and immediately closes the tab is exactly
    // the person this whole file exists for.
    document.addEventListener('visibilitychange', function () { if (document.hidden) syncOnce(false); });
    window.addEventListener('pagehide', function () { syncOnce(false); });
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', schedule);
  else schedule();

  window.CTS_SYNC = {
    /* Is there an API at all? The pages that show a student their code use
       this to stay hidden until the database is live, rather than offering a
       recovery that cannot work yet. Resolves to a boolean, never rejects. */
    available: apiPresent,
    code: function () { return get(CODE_KEY); },
    snapshot: snapshot,
    sync: function () { return syncOnce(true); },
    restore: restore,
    forget: forget,

    /* Whether this browser is holding back from the seminary, and the way
       back. A student who deleted their record and later wants their work
       kept again has to be able to say so; an opt-out with no way out is not
       a choice, it is a trap. rejoin() only permits syncing again -- it sends
       nothing by itself, so the student's next passed unit is what registers
       them, exactly as it would for anyone new. */
    optedOut: optedOut,
    rejoin: function () {
      try { localStorage.removeItem(OFF_KEY); } catch (e) {}
      apiCheck = null;
      try { sessionStorage.removeItem(API_KEY); } catch (e) {}
      return true;
    },
  };
})();
