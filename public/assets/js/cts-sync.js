/* Chapala Theological Seminary — progress sync.
 *
 * localStorage stays in charge. This file mirrors it to the seminary's
 * database so that a cleared browser or a new phone is no longer the end of
 * someone's degree. It is deliberately incapable of making the site worse:
 *
 *   - it never removes anything from localStorage, only adds
 *   - every call is wrapped; failed registration offers a clear retry
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
  /* A registration the seminary paused because this name and email already
     have a record (Wayne, 5 Oct 2026; worker/api.js, register). Holds the
     name and email it was paused for, so a student who corrects either is
     registered as normal. While it holds, nothing is sent: the student
     chooses -- their code by email, or "this is not me" (SEPARATE_KEY). */
  var EXISTING_KEY = 'cts_reg_existing';
  var SEPARATE_KEY = 'cts_reg_separate';
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
    "genesis":              { completion: "genesis" },                 // cts_genesis_uN_completion[_track]
    // the single-page courses: one page, a state map per unit ({n: {passed: true}}); Ethics has
    // a page per unit and writes cts_ethics_progress like the unit courses
    "counseling":           { state: "cts_drakeford_state" },
    "storytel":             { state: "cts_storytel_state" },
    "wisespeak":            { state: "cts_wisespeak_state" }
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
    // Lowest level first, so a course recorded at several keeps the highest;
    // the Associate's list is new (29 Sept 2026, cts-degrees.js). A code on
    // any list is a completion, as the degree pages count it.
    var tracks = {};
    done = Array.isArray(done) ? done.slice() : [];
    var inDone = {};
    done.forEach(function (c) { inDone[String(c).toUpperCase()] = 1; });
    [['cts_assoc_done_codes', 'assoc'], ['cts_thm_done_codes', 'thm'], ['cts_mdiv_done_codes', 'mdiv']].forEach(function (pair) {
      var list = parse(get(pair[0]), []);
      if (Array.isArray(list)) list.forEach(function (c) {
        var up = String(c).toUpperCase();
        tracks[up] = pair[1];
        if (!inDone[up]) { inDone[up] = 1; done.push(up); }
      });
    });

    // The textbook tests passed (cts-textbook.js keeps one dated key per
    // book); on the master's tracks a course's completion waits for its
    // textbook's, so the pass has to travel with the record (4 Oct 2026).
    var textbooks = [];
    keys().forEach(function (k) {
      var m = /^cts_textbook_([a-z]+)_passed$/.exec(k);
      if (m && get(k)) textbooks.push({ slug: m[1], passedAt: /^\d{4}-\d{2}-\d{2}$/.test(get(k)) ? get(k) + 'T12:00:00.000Z' : undefined });
    });

    return {
      student: student ? {
        name: student.name, email: student.email, country: student.country,
        track: (student.track || track || '').toLowerCase() || undefined,
        goal: student.goal, heard: student.heard,
      } : null,
      doneCodes: Array.isArray(done) ? done : [],
      completionTracks: tracks,
      // the language the student reads in, for notes the seminary sends them
      lang: (function (l) { return l === 'en' || l === 'es' || l === 'fr' ? l : null; })(get('cts_lang')),
      progress: progress,
      textbooks: textbooks,
    };
  }

  function digest(s) {
    return JSON.stringify([
      s.student && [s.student.name, s.student.track, s.student.email, s.student.country, s.student.heard],
      s.doneCodes.slice().sort(),
      Object.keys(s.completionTracks).sort().map(function (k) { return k + ':' + s.completionTracks[k]; }),
      s.progress.map(function (p) { return p.course + ':' + p.unit; }).sort(),
      (s.textbooks || []).map(function (t) { return t.slug; }).sort(),
      s.lang,
    ]);
  }

  // ---- writing the server's view back, additively only --------------------
  function applyPolicy(state) {
    if (!state || !state.requiredFrom) return;
    var dates = {};
    Object.keys(state.requiredFrom).forEach(function (slug) {
      var date = state.requiredFrom[slug];
      if (typeof date === 'string' && !isNaN(Date.parse(date))) dates[slug] = date;
    });
    set('cts_required_from', JSON.stringify(dates));
    document.dispatchEvent(new CustomEvent('cts-sync-applied'));
  }
  // Most certificate pages draw themselves once, from this browser's copy of
  // the record, as the page loads. When the server's copy arrives later and
  // adds progress, those pages would keep showing "not finished" until the
  // student reloaded by hand (18 Oct 2026 audit: 69 of 74 certificate pages).
  // So: if applying the record changed what this browser holds, a certificate
  // page reloads itself -- once a minute at most, so it can never loop.
  function fingerprint() {
    return keys().filter(function (k) { return k.indexOf('cts_') === 0; }).sort()
      .map(function (k) { return k + '=' + get(k); }).join('\n');
  }
  function reloadCertificateIfChanged(before) {
    if (!/Certificate\.html$/i.test(location.pathname || '')) return;
    if (fingerprint() === before) return;
    var flag = 'cts_cert_reload:' + location.pathname, now = Date.now(), last = 0;
    try { last = parseInt(sessionStorage.getItem(flag) || '0', 10) || 0; } catch (e) { return; }
    if (now - last < 60000) return;
    try { sessionStorage.setItem(flag, String(now)); } catch (e) { return; }
    location.reload();
  }
  function apply(state) {
    var before = fingerprint();
    applyPolicy(state);
    if (!state || !state.student) return;
    // Server-owned approval cache: replace or clear it; never send it in snapshot().
    set('cts_thm_study_plan', JSON.stringify({ studentId: state.student.id, plan: state.thmStudyPlan || null }));
    var local = parse(get('cts_student'), {}) || {};
    // The server's copy fills gaps; it does not overwrite what this browser
    // has, because this browser is where the student is typing right now.
    ['name', 'email', 'country', 'track', 'goal', 'heard'].forEach(function (f) {
      if ((f === 'goal' ? local[f] == null : !local[f]) && state.student[f]) local[f] = state.student[f];
    });
    // Confirmation is recorded only by the email challenge. Copy it when the
    // server has it. A payload that omits it must not wipe a local flag.
    if (state.student.email_verified_at) local.email_verified_at = state.student.email_verified_at;
    set('cts_student', JSON.stringify(local));
    if (local.email_verified_at) {
      var confirmed = document.getElementById('cts-email-confirm');
      if (confirmed) confirmed.remove();
    }
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
      if (c.track === 'assoc') addTo('cts_assoc_done_codes', c.code);
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

    (state.textbooks || []).forEach(function (t) {
      if (!t || !/^[a-z]+$/.test(String(t.textbook || ''))) return;
      var k = 'cts_textbook_' + t.textbook + '_passed';
      if (!get(k)) set(k, String(t.passed_at || '').slice(0, 10) || new Date().toISOString().slice(0, 10));
      addTo('cts_textbooks_passed', t.textbook);
    });

    // The required-reading tests the record does not need of this student: a
    // master's completion of the course it held before the test began to count
    // (9 Oct 2026; worker/awards.js). Kept apart from the passes -- never sent
    // up as one -- so the pages say what the record says (cts-record.js,
    // cts-textbook-gate.js).
    (state.exemptions || []).forEach(function (slug) {
      if (!/^[a-z]+$/.test(String(slug || ''))) return;
      var k = 'cts_textbook_' + slug + '_exempt';
      if (!get(k)) set(k, 'record');
    });
    // pages that show something by these keys (the certificate's gate) look again
    try { document.dispatchEvent(new CustomEvent('cts-sync-applied')); } catch (e) {}
    reloadCertificateIfChanged(before);
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
      .then(function (r) {
        // An answer, either way, is worth remembering for the session: an API
        // that is there, or one that is not deployed (404). A request that
        // never got an answer -- the student navigated away mid-probe, or the
        // connection dropped -- says nothing about the API, and remembering
        // it as "no API" would silence every page for the rest of the tab.
        // (This page still asks only once; the next page asks again.)
        try { sessionStorage.setItem(API_KEY, r.ok ? '1' : '0'); } catch (e) {}
        return r.ok;
      })
      .catch(function () { return false; });
    return apiCheck;
  }

  var lastDigest = null;
  var inFlight = null;

  function syncOnce(force) {
    // A track change must wait for an older snapshot, then send the new one.
    if (inFlight) return inFlight.then(function () { return syncOnce(force); });
    if (!available() || optedOut()) return Promise.resolve(null);
    var snap = snapshot();
    // Nothing to sync until the student has registered in this browser.
    if (!snap.student || !snap.student.name) return Promise.resolve(null);
    // Nor for the placeholder "Course Tester" that tester mode creates: it is
    // not a person, and the seminary's roster (and its notes to students who
    // have gone quiet) must not count it as one.
    if ((parse(get('cts_student'), {}) || {})._tester) return Promise.resolve(null);
    var d = digest(snap);
    if (!force && d === lastDigest) return Promise.resolve(null);

    return apiPresent().then(function (up) { return up ? push(snap, d) : null; });
  }

  function who(student) {
    return String(student.name || '').trim().toLowerCase() + '\u0000' + String(student.email || '').trim().toLowerCase();
  }
  function paused(snap) {
    var held = get(EXISTING_KEY);
    return !!held && !get(CODE_KEY) && held === who(snap.student);
  }

  function push(snap, d) {
    if (inFlight) return inFlight.then(function () { return syncOnce(true); });
    // paused: wait for the student's choice rather than asking again every poll
    if (paused(snap)) { showExisting(); return Promise.resolve(null); }
    var code = get(CODE_KEY);
    var separate = get(SEPARATE_KEY) === who(snap.student);
    var fresh = false;

    var start = code
      ? Promise.resolve(code)
      // An existing student, already part-way through their degree, gets a
      // code on their next visit and their whole localStorage is pushed up.
      // Nobody has to start again, and nobody is asked to do anything.
      : fetch(API + '/register', {
        method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'omit', keepalive: true,
        body: JSON.stringify({
          name: snap.student.name, email: snap.student.email,
          country: snap.student.country, track: snap.student.track || 'cert', goal: snap.student.goal,
          heard: snap.student.heard, lang: snap.lang, separate: separate || undefined,
        }),
      }).then(function (r) {
        if (r.status === 409) { set(EXISTING_KEY, who(snap.student)); showExisting(); return null; }
        if (!r.ok) throw new Error('registration');
        return r.json();
      }).then(function (r) {
        if (!r || !r.code) return null;
        set(CODE_KEY, r.code);
        fresh = true;
        try { localStorage.removeItem(EXISTING_KEY); localStorage.removeItem(SEPARATE_KEY); } catch (e) {}
        return r.code;
      });

    inFlight = start.then(function (c) {
      if (!c) return null;
      return send('/sync', { code: c, student: snap.student, progress: snap.progress,
                             doneCodes: snap.doneCodes, completionTracks: snap.completionTracks,
                             textbooks: snap.textbooks, lang: snap.lang })
        .then(function (state) { return { state: state, code: c }; });
    }).then(function (packed) {
      if (!packed) return null;
      if (packed.state) {
        apply(packed.state); lastDigest = digest(snapshot());
        var problem = document.getElementById('cts-registration-problem');
        if (problem) problem.remove();
      }
      try { offerEmail(packed.code, snap, packed.state, fresh); } catch (e) {}
      return packed.state;
    }).catch(function () { showRegistrationProblem(snap.student); return null; })
      .then(function (r) { inFlight = null; return r; });
    return inFlight;
  }

  function showRegistrationProblem(student) {
    if (!document.body || document.getElementById('cts-registration-problem')) return;
    var note = document.createElement('section');
    note.id = 'cts-registration-problem'; note.className = 'card';
    note.setAttribute('role', 'alert');
    var missing = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email || '');
    var words = missing
      ? { en: 'Add a valid email address to keep your progress with the seminary and receive your student code. Your work in this browser is still saved.', es: 'Añada un correo válido para guardar su progreso en el seminario y recibir su código de estudiante. Su trabajo en este navegador sigue guardado.', fr: 'Ajoutez une adresse e-mail valide pour conserver votre progression au séminaire et recevoir votre code étudiant. Votre travail dans ce navigateur reste enregistré.' }
      : { en: 'We could not save your registration with the seminary. Your work is saved in this browser. Please try again.', es: 'No pudimos guardar su registro en el seminario. Su trabajo está guardado en este navegador. Inténtelo de nuevo.', fr: 'Nous n’avons pas pu enregistrer votre inscription au séminaire. Votre travail est enregistré dans ce navigateur. Réessayez.' };
    var text = window.CTSLanguage ? window.CTSLanguage.bi(words) : words.en;
    note.innerHTML = '<p>' + text + '</p>';
    if (missing) {
      var input = document.createElement('input');
      input.type = 'email'; input.autocomplete = 'email'; input.required = true;
      input.setAttribute('aria-label', window.CTSLanguage?.lang === 'fr' ? 'Adresse e-mail' : window.CTSLanguage?.lang === 'es' ? 'Correo electrónico' : 'Email');
      note.appendChild(input);
    }
    var retry = document.createElement('button'); retry.type = 'button'; retry.className = 'btn';
    var labels = { en: missing ? 'Save email and retry' : 'Try again', es: missing ? 'Guardar correo y reintentar' : 'Reintentar', fr: missing ? 'Enregistrer et réessayer' : 'Réessayer' };
    retry.innerHTML = window.CTSLanguage ? window.CTSLanguage.bi(labels) : labels.en;
    retry.addEventListener('click', function () {
      var input = note.querySelector('input');
      if (input) {
        if (!input.reportValidity()) return;
        var st = parse(get('cts_student'), {}); st.email = input.value.trim();
        set('cts_student', JSON.stringify(st));
      }
      note.remove(); syncOnce(true);
    });
    note.appendChild(retry); document.body.prepend(note);
  }

  /* Confirming an email returns a lost code, sends reminders, and unlocks a
     certificate. It does not gate study. The note is sent once, when the code
     is first issued. A student who already has a code sees the same note and
     chooses when to send it, so opening a lesson does not mail everyone who
     has not confirmed. A failed send leaves the lesson usable. */
  var OFFER_KEY = 'cts_email_offer';
  function sessionGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function sessionSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  function words(set) {
    var lang = window.CTSLanguage && window.CTSLanguage.lang;
    return (lang && set[lang]) || set.en;
  }
  function validEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || ''); }
  function postJson(path, payload) {
    return fetch(API + path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'omit',
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (body) { return { ok: r.ok, status: r.status, body: body }; });
    }).catch(function () { return { ok: false, status: 0, body: {} }; });
  }
  function offerEmail(code, snap, state, fresh) {
    if (!code || typeof document === 'undefined' || !document.body) return;
    var email = (snap.student && snap.student.email) || '';
    if (!validEmail(email)) return;
    var verified = (state && state.student && state.student.email_verified_at) || (parse(get('cts_student'), {}) || {}).email_verified_at;
    var existing = document.getElementById('cts-email-confirm');
    if (verified) { if (existing) existing.remove(); return; }
    if (sessionGet('cts_email_dismiss') === code) return;
    var box = existing || buildEmailBanner(code);
    if (fresh && get(OFFER_KEY) !== code) {
      set(OFFER_KEY, code);
      sendConfirmation(code, email, box);
    }
  }
  function buildEmailBanner(code) {
    var note = document.createElement('section');
    note.id = 'cts-email-confirm';
    note.setAttribute('role', 'status');
    note.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:40;margin:0 auto;max-width:720px;padding:12px 14px;background:#fbf6ea;color:#2a241d;border:2px solid #b08324;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.18);font:16px/1.45 Georgia,serif';
    var p = document.createElement('p');
    p.style.margin = '0 0 8px';
    p.textContent = words({
      en: 'Confirm your email so we can return your student code, send reminders, and deliver a certificate. You can keep studying if the message is slow to arrive.',
      es: 'Confirme su correo para que podamos devolverle su código de estudiante, enviarle recordatorios y entregarle el certificado. Puede seguir estudiando si el mensaje tarda en llegar.',
      fr: 'Confirmez votre adresse e-mail afin que nous puissions vous renvoyer votre code étudiant, vous envoyer des rappels et vous remettre un certificat. Vous pouvez continuer à étudier si le message tarde à arriver.'
    });
    var status = document.createElement('p');
    status.className = 'cts-email-status';
    status.style.margin = '0 0 8px';
    var input = document.createElement('input');
    input.type = 'text';
    input.inputMode = 'numeric';
    input.autocomplete = 'one-time-code';
    input.maxLength = 6;
    input.style.cssText = 'width:8em;margin:0 8px 8px 0;padding:6px 8px;font:16px Georgia,serif';
    input.setAttribute('aria-label', words({ en: 'Six-digit code', es: 'Código de seis dígitos', fr: 'Code à six chiffres' }));
    function button(label, primary) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.style.cssText = 'margin:0 8px 8px 0;padding:6px 10px;font:15px Georgia,serif;cursor:pointer;border-radius:8px;border:1px solid #6d2233;background:' + (primary ? '#6d2233' : '#fff') + ';color:' + (primary ? '#fff' : '#6d2233');
      return b;
    }
    var sendBtn = button(words({ en: 'Send confirmation', es: 'Enviar confirmación', fr: 'Envoyer la confirmation' }), true);
    var confirmBtn = button(words({ en: 'Enter code', es: 'Introducir código', fr: 'Saisir le code' }), false);
    var keep = button(words({ en: 'Keep studying', es: 'Seguir estudiando', fr: 'Continuer à étudier' }), false);
    var link = document.createElement('a');
    link.href = '/cts-confirm-email.html';
    link.style.color = '#6d2233';
    link.textContent = words({ en: 'Open the confirmation page', es: 'Abrir la página de confirmación', fr: 'Ouvrir la page de confirmation' });
    sendBtn.addEventListener('click', function () {
      var local = parse(get('cts_student'), {}) || {};
      sendConfirmation(code, local.email || '', note);
    });
    confirmBtn.addEventListener('click', function () {
      var typed = String(input.value || '').replace(/\D/g, '');
      if (typed.length !== 6) {
        status.textContent = words({
          en: 'Enter the six-digit code from the email.',
          es: 'Escriba el código de seis dígitos del correo.',
          fr: 'Saisissez le code à six chiffres reçu par e-mail.'
        });
        return;
      }
      postJson('/email/confirm', { code: code, verification: typed }).then(function (r) {
        if (r.ok && r.body && r.body.verified) {
          var local = parse(get('cts_student'), {}) || {};
          local.email_verified_at = new Date().toISOString();
          if (r.body.email) local.email = r.body.email;
          set('cts_student', JSON.stringify(local));
          note.remove();
          return;
        }
        status.textContent = words({
          en: 'That code was not accepted. You can ask for another, or keep studying and try later.',
          es: 'Ese código no fue aceptado. Puede pedir otro, o seguir estudiando e intentarlo más tarde.',
          fr: 'Ce code n’a pas été accepté. Vous pouvez en demander un autre, ou continuer à étudier et réessayer plus tard.'
        });
      });
    });
    keep.addEventListener('click', function () { sessionSet('cts_email_dismiss', code); note.remove(); });
    note.appendChild(p);
    note.appendChild(status);
    note.appendChild(input);
    note.appendChild(sendBtn);
    note.appendChild(confirmBtn);
    note.appendChild(keep);
    note.appendChild(link);
    document.body.appendChild(note);
    return note;
  }
  function sendConfirmation(code, email, note) {
    var status = note.querySelector('.cts-email-status');
    if (!validEmail(email)) {
      status.textContent = words({
        en: 'Add a valid email address on your registration, then send the confirmation. Your study in this browser is saved.',
        es: 'Añada un correo válido en su registro y luego envíe la confirmación. Su estudio en este navegador está guardado.',
        fr: 'Ajoutez une adresse e-mail valide à votre inscription, puis envoyez la confirmation. Votre étude dans ce navigateur est enregistrée.'
      });
      return Promise.resolve();
    }
    status.textContent = words({ en: 'Sending the confirmation…', es: 'Enviando la confirmación…', fr: 'Envoi de la confirmation…' });
    return postJson('/email/start', { code: code, email: email, lang: get('cts_lang') }).then(function (r) {
      status.textContent = r.ok
        ? words({
          en: 'We sent a six-digit code. Enter it here. Check the spam folder if it is not in your inbox. You can keep studying while you wait.',
          es: 'Enviamos un código de seis dígitos. Escríbalo aquí. Revise la carpeta de correo no deseado si no está en su bandeja. Puede seguir estudiando mientras espera.',
          fr: 'Nous avons envoyé un code à six chiffres. Saisissez-le ici. Vérifiez le dossier des indésirables s’il n’est pas dans votre boîte. Vous pouvez continuer à étudier en attendant.'
        })
        : words({
          en: 'We could not send the confirmation just now. You can keep studying and confirm later from the confirmation page.',
          es: 'No pudimos enviar la confirmación en este momento. Puede seguir estudiando y confirmar más tarde en la página de confirmación.',
          fr: 'Nous n’avons pas pu envoyer la confirmation pour le moment. Vous pouvez continuer à étudier et confirmer plus tard sur la page de confirmation.'
        });
    });
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
        set(CODE_KEY, state.student.id);
        apply(state);
        try { localStorage.removeItem(EXISTING_KEY); localStorage.removeItem(SEPARATE_KEY); } catch (e) {}
        var note = document.getElementById('cts-existing-note'); if (note) note.remove();
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

  /* "Email me my code": sent by the seminary to that address only. The answer
     does not say whether the address has a record. */
  function emailCode(email) {
    var e = String(email || '').trim();
    if (!e) return Promise.resolve({ ok: false, error: 'no email given' });
    return fetch(API + '/code/email', {
      method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'omit',
      body: JSON.stringify({ email: e, lang: get('cts_lang') }),
    }).then(function (r) {
      if (r.ok) return { ok: true };
      return { ok: false, status: r.status, error: r.status === 429 ? 'too many requests' : 'could not send' };
    }, function () { return { ok: false, error: 'could not reach the seminary' }; });
  }
  /* "This is not me": two people share the address and the name. Register
     anyway, once, for exactly this name and email. */
  function registerSeparately() {
    var snap = snapshot();
    if (!snap.student || !snap.student.name) return Promise.resolve(null);
    set(SEPARATE_KEY, who(snap.student));
    try { localStorage.removeItem(EXISTING_KEY); } catch (e) {}
    var note = document.getElementById('cts-existing-note'); if (note) note.remove();
    return syncOnce(true);
  }
  function existing() {
    var snap = snapshot();
    return !!(snap.student && snap.student.name && paused(snap));
  }
  /* Pages without their own place for this (every page but the front page
     and Save & Restore, which show the full choice) get one line pointing to
     where the choice is made. */
  function showExisting() {
    if (typeof document === 'undefined' || !document.body) return;
    if (document.getElementById('reg-code') || document.getElementById('code-card')) {
      try { document.dispatchEvent(new CustomEvent('cts-sync-existing')); } catch (e) {}
      return;
    }
    if (document.getElementById('cts-existing-note')) return;
    var d = document.createElement('div');
    d.id = 'cts-existing-note';
    d.setAttribute('role', 'status');
    d.style.cssText = 'margin:0;padding:10px 16px;background:#fbf6ea;color:#2a241d;border-bottom:2px solid #b08324;font:15px/1.5 Georgia,serif;text-align:center';
    var link = function (t) { return '<a href="/cts-backup.html" style="color:#6d2233;font-weight:700">' + t + '</a>'; };
    var words = {
      en: 'You already have a student record under this name and email. ' + link('Continue with it') + ' so this progress is kept with it.',
      es: 'Ya tiene un registro de estudiante con este nombre y correo. ' + link('Contin\u00fae con \u00e9l') + ' para que este progreso se guarde en \u00e9l.',
      fr: 'Un dossier \u00e9tudiant existe d\u00e9j\u00e0 sous ce nom et cette adresse e-mail. ' + link('Continuez avec ce dossier') + ' pour que cette progression y soit conserv\u00e9e.'
    };
    d.innerHTML = window.CTSLanguage ? window.CTSLanguage.bi(words)
      : '<span class="lang-en en en-only">' + words.en + '</span><span class="lang-es es es-only">' + words.es + '</span>';
    document.body.insertBefore(d, document.body.firstChild);
  }

  // ---- when to sync --------------------------------------------------------
  function schedule() {
    fetch(API + '/health', { credentials: 'omit' }).then(function (r) { return r.ok ? r.json() : null; }).then(applyPolicy).catch(function () {});
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
    // a paused registration (this name and email already have a record)
    existing: existing,
    emailCode: emailCode,
    registerSeparately: registerSeparately,

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
