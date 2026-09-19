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
  // Two shapes, both of which the engine has always written:
  //   cts_<course>_u<N>_mc_passed = "1"
  //   cts_<course>_progress       = {"unit3": true, ...}
  // A unit counted by either is a unit the student passed.
  function snapshot() {
    var student = parse(get('cts_student'), null);
    var track = get('cts_track');
    var done = parse(get('cts_done_codes'), []);
    var seen = {};
    var progress = [];

    keys().forEach(function (k) {
      var m = /^cts_(.+)_u(\d+)_mc_passed$/.exec(k);
      if (m && get(k) === '1') {
        var id = m[1] + '\u0000' + m[2];
        if (!seen[id]) { seen[id] = 1; progress.push({ course: m[1], unit: +m[2] }); }
        return;
      }
      m = /^cts_(.+)_progress$/.exec(k);
      if (!m) return;
      var course = m[1];
      var map = parse(get(k), null);
      if (!map || typeof map !== 'object') return;
      Object.keys(map).forEach(function (uk) {
        var um = /^unit(\d+)$/.exec(uk);
        if (!um || !map[uk]) return;
        var id2 = course + '\u0000' + um[1];
        if (!seen[id2]) { seen[id2] = 1; progress.push({ course: course, unit: +um[1] }); }
      });
    });

    return {
      student: student ? {
        name: student.name, email: student.email, country: student.country,
        track: (student.track || track || '').toLowerCase() || undefined,
        goal: student.goal,
      } : null,
      doneCodes: Array.isArray(done) ? done : [],
      progress: progress,
    };
  }

  function digest(s) {
    return JSON.stringify([
      s.student && [s.student.name, s.student.track, s.student.email, s.student.country],
      s.doneCodes.slice().sort(),
      s.progress.map(function (p) { return p.course + ':' + p.unit; }).sort(),
    ]);
  }

  // ---- writing the server's view back, additively only --------------------
  function apply(state) {
    if (!state || !state.student) return;
    var local = parse(get('cts_student'), {}) || {};
    // The server's copy fills gaps; it does not overwrite what this browser
    // has, because this browser is where the student is typing right now.
    ['name', 'email', 'country', 'track', 'goal'].forEach(function (f) {
      if (!local[f] && state.student[f]) local[f] = state.student[f];
    });
    set('cts_student', JSON.stringify(local));
    if (!get('cts_track') && state.student.track) set('cts_track', state.student.track);

    var done = parse(get('cts_done_codes'), []);
    if (!Array.isArray(done)) done = [];
    var added = false;
    (state.doneCodes || []).forEach(function (c) { if (done.indexOf(c) === -1) { done.push(c); added = true; } });
    if (added) set('cts_done_codes', JSON.stringify(done));

    (state.progress || []).forEach(function (p) {
      var pk = 'cts_' + p.course + '_progress';
      var map = parse(get(pk), {}) || {};
      if (!map['unit' + p.unit]) { map['unit' + p.unit] = true; set(pk, JSON.stringify(map)); }
      var mk = 'cts_' + p.course + '_u' + p.unit + '_mc_passed';
      if (get(mk) !== '1') set(mk, '1');
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
    if (inFlight || !available()) return Promise.resolve(null);
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
      }).then(function (r) {
        if (!r || !r.code) return null;
        set(CODE_KEY, r.code);
        return r.code;
      });

    return start.then(function (c) {
      if (!c) return null;
      return send('/sync', { code: c, student: snap.student, progress: snap.progress, doneCodes: snap.doneCodes });
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

  function forget() {
    var c = get(CODE_KEY);
    if (!c) return Promise.resolve({ ok: false, error: 'this browser has no student code' });
    return fetch(API + '/student/' + encodeURIComponent(c), { method: 'DELETE', credentials: 'omit' })
      .then(function (r) { return { ok: r.ok }; })
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
  };
})();
