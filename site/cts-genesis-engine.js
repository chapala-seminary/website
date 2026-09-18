/* CTS Genesis Intensive shared course engine
   Tracks: cert | mdiv | thm
   Unit requirements: 20 MCQ; graduate tracks add 10 SA.
   Pass: 18/20 MCQ; 9/10 SA. SA genuine response >=100 chars,
   8 bilingual single-concept keywords, threshold 3 hits.
*/
(function (global) {
  'use strict';

  const VERSION = '1.2.0';
  const COURSE = 'genesis';
  const TOTAL_UNITS = 12;
  const MC_REQUIRED = 20;
  const MC_PASS = 18;
  const SA_REQUIRED = 10;
  const SA_PASS = 9;
  const SA_MIN_CHARS = 100;
  const SA_KEYWORD_HITS = 3;
  const MC_LOCK_MS = 2 * 60 * 1000;
  const SA_LOCK_MS = 15 * 60 * 1000;

  const K = {
    student: 'cts_student',
    progress: `cts_${COURSE}_progress`,
    lang: `cts_${COURSE}_lang`,
    state: u => `cts_${COURSE}_u${u}_state`,
    mcPassed: u => `cts_${COURSE}_u${u}_mc_passed`,
    fullLock: u => `cts_${COURSE}_u${u}_lockout`,
    saLock: u => `cts_${COURSE}_u${u}_sa_lockout`,
    completion: u => `cts_${COURSE}_u${u}_completion`,
    completionTrack: (u,t) => `cts_${COURSE}_u${u}_completion_${normalizeTrack(t)}`, 
    track: 'cts_track'
  };

  function storageAvailable() {
    try {
      const x = '__cts_storage_test__';
      localStorage.setItem(x, x);
      localStorage.removeItem(x);
      return true;
    } catch (_) { return false; }
  }

  // In-memory fallback used only when the browser blocks localStorage
  // (e.g. certain restricted file-viewer contexts). Lets the assessment
  // still be answered and graded within one page session; nothing is
  // saved once the page is closed in that case.
  const memStore = {};

  function safeGet(key, fallback) {
    if (!storageAvailable()) return (key in memStore) ? memStore[key] : fallback;
    try {
      const v = localStorage.getItem(key);
      return v == null ? fallback : v;
    } catch (_) { return (key in memStore) ? memStore[key] : fallback; }
  }

  function safeSet(key, value) {
    if (!storageAvailable()) { memStore[key] = value; return true; }
    try { localStorage.setItem(key, value); return true; }
    catch (_) { memStore[key] = value; return true; }
  }

  function safeRemove(key) {
    if (!storageAvailable()) { delete memStore[key]; return true; }
    try { localStorage.removeItem(key); return true; }
    catch (_) { delete memStore[key]; return true; }
  }

  function safeJSON(key, fallback) {
    try { return JSON.parse(safeGet(key, '')) || fallback; }
    catch (_) { return fallback; }
  }

  function normalizeTrack(track) {
    const t = String(track || '').toLowerCase().trim();
    if (t === 'certificate' || t === 'cert') return 'cert';
    if (t === 'mdiv' || t === 'm.div.' || t === 'm.div') return 'mdiv';
    if (t === 'mth' || t === 'thm' || t === 'm.th.' || t === 'm.th') return 'thm';
    return 'cert';
  }

  function migrateStudent() {
    const s = safeJSON(K.student, null);
    if (!s) return null;
    const standalone = safeGet(K.track, '');
    const nt = normalizeTrack(standalone || s.track);
    let changed = false;
    if (s.track !== nt) { s.track = nt; changed = true; }
    if (changed) safeSet(K.student, JSON.stringify(s));
    safeSet(K.track, nt);
    return s;
  }

  function isGraduate(track) {
    const t = normalizeTrack(track);
    return t === 'mdiv' || t === 'thm';
  }

  function cleanText(s) {
    return String(s || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z0-9ñ\s-]/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }

  function keywordHits(answer, concepts) {
    const text = cleanText(answer);
    const hits = new Set();
    (concepts || []).forEach((concept, i) => {
      const forms = Array.isArray(concept) ? concept : [concept];
      if (forms.some(f => {
        const kw = cleanText(f);
        if (!kw) return false;
        const esc = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const WC = 'a-z0-9ñ';
        const pat = (kw.length <= 4)
          ? '(?:^|[^' + WC + '])' + esc + '(?![' + WC + '])'
          : '(?:^|[^' + WC + '])' + esc;
        try { return new RegExp(pat).test(text); } catch (e) { return text.includes(kw); }
      })) hits.add(i);
    });
    return hits.size;
  }

  function genuineSA(answer, concepts) {
    const raw = String(answer || '').trim();
    return raw.length >= SA_MIN_CHARS && keywordHits(raw, concepts) >= SA_KEYWORD_HITS;
  }

  function getProgress() { return safeJSON(K.progress, {}); }
  function setProgress(p) { return safeSet(K.progress, JSON.stringify(p)); }

  function trackCompletion(unit, track) {
    const t = normalizeTrack(track);
    const direct = safeJSON(K.completionTrack(unit, t), null);
    if (direct && normalizeTrack(direct.track) === t) return direct;
    const legacy = safeJSON(K.completion(unit), null);
    if (legacy && normalizeTrack(legacy.track) === t) return legacy;
    return null;
  }

  function completionQualifies(unit, track) {
    const t = normalizeTrack(track);
    // Graduate work satisfies certificate-level rigor. Graduate tracks remain
    // distinct so a student cannot relabel an M.Div. completion as Th.M. (or vice versa).
    if (t === 'cert') return !!(trackCompletion(unit,'cert') || trackCompletion(unit,'mdiv') || trackCompletion(unit,'thm'));
    return !!trackCompletion(unit,t);
  }

  function isUnitPassed(unit) {
    const student = migrateStudent();
    if (!student || !student.track) return false;
    return completionQualifies(unit, student.track);
  }

  function prerequisitePassed(unit) {
    if (unit <= 1) return true;
    return isUnitPassed(unit - 1);
  }

  function testMode() {
    try { return new URLSearchParams(location.search).get('ctstest') === 'on'; }
    catch (_) { return false; }
  }

  function lockRemaining(unit, kind) {
    if (testMode()) return 0;
    const key = kind === 'sa' ? K.saLock(unit) : K.fullLock(unit);
    const until = parseInt(safeGet(key, '0'), 10) || 0;
    return Math.max(0, until - Date.now());
  }

  function formatRemaining(ms) {
    const total = Math.ceil(ms / 1000);
    const m = Math.floor(total / 60), s = total % 60;
    return `${m}:${String(s).padStart(2,'0')}`;
  }

  function unitState(unit) {
    const d = safeJSON(K.state(unit), {});
    return {
      mcAnswers: Array.isArray(d.mcAnswers) ? d.mcAnswers.slice(0, MC_REQUIRED) : new Array(MC_REQUIRED).fill(null),
      saAnswers: Array.isArray(d.saAnswers) ? d.saAnswers.slice(0, SA_REQUIRED) : new Array(SA_REQUIRED).fill(''),
      graded: !!d.graded,
      mcScore: Number.isFinite(d.mcScore) ? d.mcScore : null,
      saScore: Number.isFinite(d.saScore) ? d.saScore : null
    };
  }

  function saveUnitState(unit, st) {
    return safeSet(K.state(unit), JSON.stringify(st));
  }

  function scoreMC(questions, answers) {
    let score = 0;
    for (let i = 0; i < MC_REQUIRED; i++) {
      if (answers[i] === questions[i].answer) score++;
    }
    return score;
  }

  function scoreSA(questions, answers) {
    let score = 0;
    for (let i = 0; i < SA_REQUIRED; i++) {
      if (genuineSA(answers[i], questions[i].concepts)) score++;
    }
    return score;
  }

  function awardPass(unit, result) {
    const p = getProgress();
    p[`unit${unit}`] = true;
    const c = {
      course: COURSE,
      unit,
      completedAt: new Date().toISOString(),
      mcScore: result.mcScore,
      saScore: result.saScore,
      track: normalizeTrack((migrateStudent() || {}).track),
      version: VERSION
    };
    const specificKey = K.completionTrack(unit, c.track);
    const previousSpecific = safeGet(specificKey, null);
    const previousCompletion = safeGet(K.completion(unit), null);
    if (!safeSet(specificKey, JSON.stringify(c))) return {ok:false, reason:'storage'};
    if (!safeSet(K.completion(unit), JSON.stringify(c))) {
      try {
        if (previousSpecific == null) localStorage.removeItem(specificKey);
        else localStorage.setItem(specificKey, previousSpecific);
      } catch (_) {}
      return {ok:false, reason:'storage'};
    }
    if (!setProgress(p)) {
      try {
        if (previousSpecific == null) localStorage.removeItem(specificKey);
        else localStorage.setItem(specificKey, previousSpecific);
        if (previousCompletion == null) localStorage.removeItem(K.completion(unit));
        else localStorage.setItem(K.completion(unit), previousCompletion);
      } catch (_) {}
      return {ok:false, reason:'storage'};
    }
    return {ok:true};
  }

  function submit(unit, mcQuestions, saQuestions, state) {
    const student = migrateStudent();
    if (!student || !student.name || !student.email) return { status:'registration_required' };
    if (!prerequisitePassed(unit) && !testMode()) return { status:'prerequisite_required', unit:unit-1 };
    if (isUnitPassed(unit)) return { status:'already_passed' };
    if (lockRemaining(unit, 'full')) return { status:'locked', kind:'full', remaining:lockRemaining(unit,'full') };

    const grad = isGraduate(student.track);
    const mcBanked = safeGet(K.mcPassed(unit), 'false') === 'true';
    const retainedMc = Number.isFinite(state.mcScore) ? state.mcScore : null;
    const mcScore = mcBanked ? (retainedMc == null ? MC_PASS : retainedMc) : scoreMC(mcQuestions, state.mcAnswers);
    const mcOk = mcBanked || mcScore >= MC_PASS;

    if (grad && lockRemaining(unit, 'sa')) return { status:'locked', kind:'sa', remaining:lockRemaining(unit,'sa'), mcBanked };
    const saScore = grad ? scoreSA(saQuestions, state.saAnswers) : null;
    const saOk = !grad || saScore >= SA_PASS;

    state.graded = true; state.mcScore = mcScore; state.saScore = saScore;
    if (!saveUnitState(unit, state)) return { status:'storage_error' };

    if (!mcOk) {
      if (!testMode() && !safeSet(K.fullLock(unit), String(Date.now()+MC_LOCK_MS))) return {status:'storage_error'};
      return { status:'failed_mc', mcScore, saScore, needs:MC_PASS };
    }

    if (!mcBanked && !safeSet(K.mcPassed(unit), 'true')) return {status:'storage_error'};

    if (!saOk) {
      if (!testMode() && !safeSet(K.saLock(unit), String(Date.now()+SA_LOCK_MS))) return {status:'storage_error'};
      return { status:'failed_sa', mcScore, saScore, needs:SA_PASS, mcBanked:true };
    }

    const award = awardPass(unit, {mcScore, saScore});
    if (!award.ok) return {status:'storage_error'};
    return { status:'passed', mcScore, saScore, track:normalizeTrack(student.track) };
  }

  function resetUnit(unit) {
    try {
      safeRemove(K.state(unit));
      safeRemove(K.mcPassed(unit));
      safeRemove(K.fullLock(unit));
      safeRemove(K.saLock(unit));
      const student = migrateStudent();
      const t = normalizeTrack((student || {}).track);
      safeRemove(K.completionTrack(unit, t));
      const legacy = safeJSON(K.completion(unit), null);
      if (legacy && normalizeTrack(legacy.track) === t) safeRemove(K.completion(unit));
      const p = getProgress();
      const anyRemaining = trackCompletion(unit,'cert') || trackCompletion(unit,'mdiv') || trackCompletion(unit,'thm');
      if (!anyRemaining) delete p[`unit${unit}`];
      return setProgress(p);
    } catch (_) { return false; }
  }

  function language() { return safeGet(K.lang, 'en') === 'es' ? 'es' : 'en'; }
  function setLanguage(lang) {
    const l = lang === 'es' ? 'es' : 'en';
    safeSet(K.lang, l);
    if (document.body) document.body.classList.toggle('lang-es', l==='es');
    if (document.body) document.body.classList.toggle('lang-en', l==='en');
    return l;
  }

  function registerStudent(name, email, track) {
    name = String(name || '').trim(); email = String(email || '').trim();
    if (name.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return {ok:false};
    const student = {name, email, track:normalizeTrack(track), registered:new Date().toISOString()};
    if (!safeSet(K.student, JSON.stringify(student))) return {ok:false, storage:true};
    if (!safeSet(K.track, student.track)) return {ok:false, storage:true};
    return {ok:true, student};
  }

  function completionRecord(unit) { return safeJSON(K.completion(unit), null); }

  global.CTSGenesis = Object.freeze({
    VERSION, COURSE, TOTAL_UNITS, MC_REQUIRED, MC_PASS, SA_REQUIRED, SA_PASS,
    SA_MIN_CHARS, SA_KEYWORD_HITS,
    normalizeTrack, isGraduate, migrateStudent, registerStudent,
    storageAvailable, unitState, saveUnitState, submit, resetUnit,
    getProgress, isUnitPassed, prerequisitePassed, completionRecord, trackCompletion, completionQualifies,
    keywordHits, genuineSA, lockRemaining, formatRemaining,
    language, setLanguage, testMode
  });
})(window);
