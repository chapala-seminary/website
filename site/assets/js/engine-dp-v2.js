/* Exam engine for CTSDP (shared by 1 unit page).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/dp/unitN.js. */
const COURSE = 'dp';

const totalUnits = 10;
let currentUnit = UNIT;

const STATE_KEY     = `cts_${COURSE}_u${UNIT}_state`;
const MC_PASS_KEY   = `cts_${COURSE}_u${UNIT}_mc_passed`;
const SA_LOCK_KEY   = `cts_${COURSE}_u${UNIT}_sa_lockout`;
const FULL_LOCK_KEY = `cts_${COURSE}_u${UNIT}_lockout`;
const PROGRESS_KEY  = `cts_${COURSE}_progress`;

function lockMinutes() {
    try {
        const st = JSON.parse(localStorage.getItem('cts_student') || 'null');
        const t = st && st.track ? st.track : 'certificate';
        return (t === 'mdiv' || t === 'thm') ? 15 : 2;
    } catch (e) { return 2; }
}


try { progress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch(e) { progress = {}; }
let unitPassed = !!progress[`unit${UNIT}`];
let mcPreviouslyPassed = localStorage.getItem(MC_PASS_KEY) === 'true';



function updateProgressGrid() {
    const grid = document.getElementById('progressGrid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 1; i <= totalUnits; i++) {
        let cls = '';
        if (progress[`unit${i}`]) cls = 'completed';
        if (i === currentUnit) cls += ' active';
        grid.innerHTML += `<a href="CTSDPUnit${i}.html" class="${cls}" title="${unitTitlesEn[i-1]}">${i}</a>`;
    }
    if (progress[`unit${UNIT}`]) document.getElementById('nextUnitBtn').disabled = false;
}
document.getElementById('nextUnitBtn').onclick = () => { location.href = NEXT_UNIT_URL; };
updateProgressGrid();

function displayStudentGreeting() {
    const student = JSON.parse(localStorage.getItem('cts_student') || 'null');
    if (student && student.name) {
        document.getElementById('studentGreeting').innerHTML = `\U0001F44B ${student.name}`;
        document.getElementById('regCard').style.display = 'none';
    }
}
displayStudentGreeting();

document.getElementById('regBtn').onclick = function() {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const track = document.getElementById('regTrack').value;
    if (!name || !email) {
        document.getElementById('regStatus').innerHTML = "<span style='color:red'>Please fill all fields.</span>";
        return;
    }
    const student = { name, email, track, registered: new Date().toISOString() };
    localStorage.setItem('cts_student', JSON.stringify(student));
    localStorage.setItem('cts_track', track);
    document.getElementById('regStatus').innerHTML = "<span style='color:green'>\u2713 Registered successfully!</span>";
    setTimeout(() => { document.getElementById('regCard').style.display = 'none'; displayStudentGreeting(); }, 800);
};

document.getElementById('langToggleBtn').onclick = function() {
    if (document.body.classList.contains('lang-en')) {
        document.body.classList.remove('lang-en'); document.body.classList.add('lang-es');
        this.textContent = 'English';
    } else {
        document.body.classList.remove('lang-es'); document.body.classList.add('lang-en');
        this.textContent = 'Espa\u00f1ol';
    }
    renderQuestions(); checkLockouts();
};


const kwQuestions = [{"textEn": "21. Define doctrinal (theological) preaching in your own words. What two things does it aim to do with a belief?", "textEs": "21. Defina la predicación doctrinal (teológica) con sus propias palabras. ¿Qué dos cosas busca hacer con una creencia?", "kw_en": ["doctrin", "preach", "teach", "understand", "accept", "belief", "truth", "life"], "kw_es": ["doctrina", "predic", "enseñ", "entend", "acept", "creencia", "verdad", "vida"], "modelEn": "Doctrinal or theological preaching takes a basic Christian belief, or doctrine, and expounds it so the people both understand it and accept it. But it does not stop at the mind: it then applies that truth to life. So it is not a lecture that only informs; it is proclamation that aims at understanding, acceptance, and a changed life. The preacher teaches the doctrine in order to move the hearer toward trust and obedience.", "modelEs": "La predicación doctrinal o teológica toma una creencia cristiana básica, una doctrina, y la expone para que el pueblo la entienda y la acepte. Pero no se detiene en la mente: luego aplica esa verdad a la vida. Así que no es una clase que solo informa; es proclamación que busca el entendimiento, la aceptación y una vida cambiada. El predicador enseña la doctrina para mover al oyente a la confianza y la obediencia."}, {"textEn": "22. Give the three reasons for preaching a theological sermon, and explain one of them.", "textEs": "22. Dé las tres razones para predicar un sermón teológico, y explique una de ellas.", "kw_en": ["foundation", "kerygma", "educate", "develop", "position", "theolog", "reason", "ground"], "kw_es": ["fundament", "educ", "desarroll", "posici", "teolog", "razon", "predic", "mensaje"], "modelEn": "The course gives three reasons for preaching a theological sermon. First, to lay a foundation, preaching the kerygma, the core gospel message on which everything rests. Second, to educate people, building them up in the faith. Third, to develop the preacher’s own theological position, since preparing such sermons forces real study. For example, laying a foundation matters because a church grounded in the gospel can stand firm when teaching grows shallow elsewhere.", "modelEs": "El curso da tres razones para predicar un sermón teológico. Primera, poner un fundamento, predicando el kerigma, el mensaje central del evangelio sobre el cual descansa todo. Segunda, educar al pueblo, edificándolo en la fe. Tercera, desarrollar la propia posición teológica del predicador, pues preparar tales sermones obliga a un estudio verdadero. Por ejemplo, poner un fundamento importa porque una iglesia basada en el evangelio puede mantenerse firme cuando la enseñanza se vuelve superficial en otros lugares."}, {"textEn": "23. Explain the difference between deduction and induction in preaching.", "textEs": "23. Explique la diferencia entre deducción e inducción en la predicación.", "kw_en": ["deduct", "induct", "general", "specific", "topical", "textual", "point", "subject"], "kw_es": ["deducc", "inducc", "general", "específic", "tópic", "textual", "punto", "tema"], "modelEn": "Deduction moves from the general to the specific: the preacher begins with a large subject and divides it into its parts, which is how the topical sermon works. Induction moves the other way, from the specific to the general: the preacher begins with the particular points found in the text and lets them build to the subject, which is how textual and expository sermons work. So deduction arranges the points under a chosen subject, while induction draws the subject out of the points the text supplies.", "modelEs": "La deducción va de lo general a lo específico: el predicador comienza con un tema amplio y lo divide en sus partes, que es como funciona el sermón tópico. La inducción va al revés, de lo específico a lo general: el predicador comienza con los puntos particulares que halla en el texto y deja que formen el tema, que es como funcionan los sermones textual y expositivo. Así que la deducción ordena los puntos bajo un tema escogido, mientras que la inducción saca el tema de los puntos que el texto provee."}, {"textEn": "24. Distinguish the textual, topical, and expository sermon by where the divisions and the explanation come from.", "textEs": "24. Distinga el sermón textual, tópico y expositivo por dónde vienen las divisiones y la explicación.", "kw_en": ["textual", "topical", "exposit", "division", "explanation", "text", "preacher", "arrange"], "kw_es": ["textual", "tópic", "exposit", "divis", "explic", "texto", "predicador", "disposici"], "modelEn": "These three are distinguished by where the divisions and the explanation come from. In the textual sermon the divisions come from the text, but the explanation is supplied by the preacher. In the expository sermon both the divisions and the explanation come from the text, so it is the most closely tied to the passage. In the topical sermon the idea comes from the text but the arrangement of the points is deduced by the preacher, so it is the least tied to the text analytically, though it is still biblical when each point rests on a verse.", "modelEs": "Estos tres se distinguen por dónde vienen las divisiones y la explicación. En el sermón textual las divisiones vienen del texto, pero la explicación la aporta el predicador. En el sermón expositivo tanto las divisiones como la explicación vienen del texto, por lo que es el más ligado al pasaje. En el sermón tópico la idea viene del texto, pero la disposición de los puntos la deduce el predicador, así que es el menos ligado al texto analíticamente, aunque sigue siendo bíblico cuando cada punto descansa en un versículo."}, {"textEn": "25. The objection to topical preaching is that it is “only the preacher’s ideas.” How does doctrinal preaching answer that objection?", "textEs": "25. La objeción a la predicación tópica es que es “solo las ideas del predicador.” ¿Cómo responde la predicación doctrinal a esa objeción?", "kw_en": ["point", "text", "structure", "develop", "derived", "biblical", "priest", "interpret"], "kw_es": ["punto", "texto", "estructura", "desarroll", "deriva", "bíblic", "sacerd", "interpret"], "modelEn": "The objection is that topical preaching is only the preacher’s own ideas with a few verses attached. Doctrinal preaching answers it by insisting that every point rests on, and quotes, its own text, so the points are not the preacher’s notions but the teaching of Scripture. But the deeper answer is that structure by itself settles nothing: a preacher can take an expository or textual structure straight from the text and still develop it in an unbiblical way, while a well-built topical sermon whose points are each derived from the Word is fully biblical. What makes a sermon biblical is that its content is truly derived from the Word of God, not the shape of its outline. God gives His people, a kingdom of priests, the ability to interpret Scripture, and the faithful preacher lets the text govern the idea rather than imposing his idea on the text.", "modelEs": "La objeción es que la predicación tópica es solo las ideas propias del predicador con unos versículos añadidos. La predicación doctrinal la responde insistiendo en que cada punto descansa en su propio texto y lo cita, de modo que los puntos no son ocurrencias del predicador sino la enseñanza de la Escritura. Pero la respuesta más honda es que la estructura por sí sola no decide nada: un predicador puede tomar una estructura expositiva o textual sacada directamente del texto y aun así desarrollarla de modo no bíblico, mientras que un sermón tópico bien hecho cuyos puntos se derivan cada uno de la Palabra es plenamente bíblico. Lo que hace bíblico un sermón es que su contenido se derive verdaderamente de la Palabra de Dios, no la forma de su bosquejo. Dios da a su pueblo, un reino de sacerdotes, la capacidad de interpretar la Escritura, y el predicador fiel deja que el texto gobierne la idea en lugar de imponer su idea sobre el texto."}, {"textEn": "26. Why does the course say, “If you cannot find a text to preach the idea, it may be your idea and not the Lord’s”?", "textEs": "26. ¿Por qué dice el curso: “Si no puedes hallar un texto para predicar la idea, puede ser tu idea y no la del Señor”?", "kw_en": ["text", "idea", "scripture", "whole", "contradict", "sola", "Bible", "accountable"], "kw_es": ["texto", "idea", "escritura", "todo", "contradic", "sola", "Biblia", "responsab"], "modelEn": "The saying expresses the principle of sola scriptura: Scripture alone is our authority, so if a thing is not in the Bible we should not preach it as God’s truth. If the preacher searches and can find no text that actually teaches the idea, that is a warning that the idea may be his own and not the Lord’s. It also guards us from building a theology on one or two verses: when a doctrine is gathered, we let Scripture explain itself and read each verse in light of the whole, so that if our reading of a verse seems to contradict what the Bible teaches generally, it is our interpretation that must be corrected. And because the preacher is held accountable to God by a stricter standard, he handles the Word with care, letting the text govern the idea rather than the other way around.", "modelEs": "El dicho expresa el principio de sola scriptura: la Escritura sola es nuestra autoridad, así que si algo no está en la Biblia no debemos predicarlo como verdad de Dios. Si el predicador busca y no halla ningún texto que de veras enseñe la idea, eso advierte que la idea puede ser suya y no del Señor. También nos guarda de edificar una teología sobre uno o dos versículos: cuando se reúne una doctrina, dejamos que la Escritura se explique a sí misma y leemos cada versículo a la luz del todo, de modo que si nuestra lectura de un versículo parece contradecir lo que la Biblia enseña en general, es nuestra interpretación la que debe corregirse. Y porque el predicador es responsable ante Dios bajo un criterio más estricto, maneja la Palabra con cuidado, dejando que el texto gobierne la idea y no al revés."}, {"textEn": "27. Name and briefly explain the four ingredients of successful preaching.", "textEs": "27. Nombre y explique brevemente los cuatro ingredientes de la predicación exitosa.", "kw_en": ["interpret", "people", "arrange", "deliver", "style", "knowledge", "outline", "enthusiasm"], "kw_es": ["interpret", "gente", "arregl", "entrega", "estilo", "conocim", "bosquej", "entusiasm"], "modelEn": "The four ingredients of successful preaching are interpretation, knowledge of people, arrangement and style, and delivery. Interpretation is the careful study that makes the sermon’s subject the text’s subject. Knowledge of people is sensitivity to the listeners’ real concerns and needs. Arrangement and style give the sermon a clear, simple, pictorial outline that people can follow. Delivery carries it home, and its chief mark is enthusiasm. A preacher needs all four; strength in one cannot replace weakness in another.", "modelEs": "Los cuatro ingredientes de la predicación exitosa son la interpretación, el conocimiento de la gente, el arreglo y el estilo, y la entrega. La interpretación es el estudio cuidadoso que hace que el tema del sermón sea el tema del texto. El conocimiento de la gente es la sensibilidad a las preocupaciones y necesidades reales de los oyentes. El arreglo y el estilo dan al sermón un bosquejo claro, sencillo y pictórico que la gente puede seguir. La entrega lo lleva al corazón, y su marca principal es el entusiasmo. El predicador necesita los cuatro; la fuerza en uno no reemplaza la debilidad en otro."}, {"textEn": "28. List the marks of a good outline, and explain why “movement” matters.", "textEs": "28. Enumere las marcas de un buen bosquejo, y explique por qué importa el “movimiento.”", "kw_en": ["unity", "order", "movement", "parallel", "proportion", "peak", "invitation", "progress"], "kw_es": ["unidad", "orden", "movimient", "paralel", "proporci", "culmin", "invitaci", "progres"], "modelEn": "The marks of a good outline are unity, order, movement, parallel structure, and proportion. Unity means one sermon and one focus, not many. Order means each division is distinct and purposeful. Parallel means the points are worded alike as far as possible, and proportion means they are balanced in length and weight. Movement matters most because the sermon must progress and go somewhere: the preacher builds toward a peak, usually at the invitation, so the last point is the most powerful and the hearer is carried to a response.", "modelEs": "Las marcas de un buen bosquejo son la unidad, el orden, el movimiento, la estructura paralela y la proporción. La unidad significa un solo sermón y un solo enfoque, no muchos. El orden significa que cada división es distinta y tiene un propósito. Lo paralelo significa que los puntos se redactan de forma semejante en lo posible, y la proporción significa que están equilibrados en extensión y peso. El movimiento importa más porque el sermón debe progresar e ir a algún lugar: el predicador avanza hacia un punto culminante, normalmente en la invitación, de modo que el último punto es el más poderoso y el oyente es llevado a una respuesta."}, {"textEn": "29. What does “knowledge of people” add to a preacher who already knows his theology?", "textEs": "29. ¿Qué añade “el conocimiento de la gente” a un predicador que ya conoce su teología?", "kw_en": ["people", "needs", "concern", "sensit", "heart", "listener", "connect", "theolog"], "kw_es": ["gente", "necesidad", "preocupac", "sensib", "coraz", "oyente", "conect", "teolog"], "modelEn": "Knowledge of people adds the human sensitivity that pure theology cannot supply. A preacher may know doctrine deeply and still miss the listeners if he is not aware of their real concerns and needs. This knowledge is not an academic degree in psychology but a sensitivity of heart that lets the preacher connect doctrine to the people in front of him. Without it, true theology can still leave the congregation untouched; with it, the same truth reaches the heart.", "modelEs": "El conocimiento de la gente añade la sensibilidad humana que la pura teología no puede dar. Un predicador puede conocer la doctrina a fondo y aun así no alcanzar a los oyentes si no percibe sus preocupaciones y necesidades reales. Este conocimiento no es un título académico en psicología, sino una sensibilidad del corazón que permite al predicador conectar la doctrina con la gente que tiene delante. Sin ella, la teología verdadera puede dejar intacta a la congregación; con ella, la misma verdad llega al corazón."}, {"textEn": `30. Summarize the main point of Unit ${UNIT}: why preach doctrine, and how can it be topical yet still biblical?`, "textEs": `30. Resuma el punto principal de la Unidad ${UNIT}: ¿por qué predicar la doctrina, y cómo puede ser tópica y aún bíblica?`, "kw_en": ["doctrine", "preach", "topical", "biblical", "text", "point", "understand", "apply"], "kw_es": ["doctrina", "predic", "tópic", "bíblic", "texto", "punto", "entend", "aplic"], "modelEn": `Unit ${UNIT} teaches why doctrine must be preached and how it can be preached topically yet remain biblical. We preach doctrine to lay a foundation, to educate the people, and to apply Christian belief to life, so the congregation both understands the truth and lives by it. Doctrinal preaching is by nature topical, since a doctrine must be gathered from the whole of Scripture rather than one passage, yet it is biblical because every point rests on its own text and its content is truly derived from the Word of God, not from the mere shape of the outline. Held by sola scriptura and a stricter accountability before God, the preacher lets the text govern the idea. The aim is not a lecture but understanding that moves to acceptance and obedience, with the sermon peaking at the call to respond.`, "modelEs": `La Unidad ${UNIT} enseña por qué se debe predicar la doctrina y cómo puede predicarse de forma tópica y seguir siendo bíblica. Predicamos la doctrina para poner un fundamento, para educar al pueblo y para aplicar la creencia cristiana a la vida, de modo que la congregación entienda la verdad y viva conforme a ella. La predicación doctrinal es por naturaleza tópica, pues una doctrina debe reunirse del todo de la Escritura y no de un solo pasaje, y sin embargo es bíblica porque cada punto descansa en su propio texto y su contenido se deriva verdaderamente de la Palabra de Dios, no de la mera forma del bosquejo. Sostenido por la sola scriptura y por una responsabilidad más estricta ante Dios, el predicador deja que el texto gobierne la idea. La meta no es una clase, sino el entendimiento que lleva a la aceptación y la obediencia, con el sermón culminando en el llamado a responder.`}];

let currentLang = 'en';
let mcAnswers = new Array(20).fill(null);
let kwAnswers = new Array(10).fill("");
let mcRevealed = false;
try {
    const st = JSON.parse(localStorage.getItem(STATE_KEY) || '{}');
    if (Array.isArray(st.mcAnswers) && st.mcAnswers.length === 20) mcAnswers = st.mcAnswers;
    if (Array.isArray(st.kwAnswers) && st.kwAnswers.length === 10) kwAnswers = st.kwAnswers;
} catch(e) {}

function saveState() {
    try { localStorage.setItem(STATE_KEY, JSON.stringify({ mcAnswers, kwAnswers })); } catch(e) {}
}

function checkLockouts() {
    const submitBtn = document.getElementById('submitExamBtn');
    const result = document.getElementById('examResult');
    const notice = document.getElementById('mcBankedNotice');
    const isEs = document.body.classList.contains('lang-es');
    const now = Date.now();
    const fullLock = parseInt(localStorage.getItem(FULL_LOCK_KEY) || '0', 10);
    const saLock = parseInt(localStorage.getItem(SA_LOCK_KEY) || '0', 10);

    if (unitPassed) {
        submitBtn.disabled = true;
        result.innerHTML = isEs
            ? `<span style='color:#1f6b3b'>\u2713 Unidad ya aprobada. Haga clic en Unidad ${UNIT + 1} arriba.</span>`
            : `<span style='color:green'>\u2713 Unit already passed! Click Unit ${UNIT + 1} above.</span>`;
        notice.style.display = 'none';
        return true;
    }
    if (now < fullLock) {
        const m = Math.ceil((fullLock - now) / 60000);
        submitBtn.disabled = true;
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>\U0001F4D6 Tome unos minutos para repasar la lecci\u00f3n de arriba, y luego intente de nuevo. Puede reintentar en ${m} minuto(s). \u00a1Usted puede lograrlo!</span>`
            : `<span style='color:#8a1f1f'>\U0001F4D6 Take a few minutes to review the lesson above, then try again. You can retry in ${m} minute(s) \u2014 you've got this!</span>`;
        notice.style.display = 'none';
        setTimeout(checkLockouts, 30000);
        return false;
    }
    if (mcPreviouslyPassed && now < saLock) {
        const m = Math.ceil((saLock - now) / 60000);
        submitBtn.disabled = true;
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>\U0001F4D6 Opci\u00f3n m\u00faltiple aprobada y guardada. Repase la lecci\u00f3n y las respuestas modelo, y reintente la secci\u00f3n de respuesta corta en ${m} minuto(s). \u00a1Siga adelante!</span>`
            : `<span style='color:#8a1f1f'>\U0001F4D6 Multiple-choice passed and saved. Review the lesson and model answers, then retry the short-answer section in ${m} minute(s). Keep going!</span>`;
        notice.style.display = 'none';
        setTimeout(checkLockouts, 30000);
        return false;
    }
    submitBtn.disabled = false;
    if (mcPreviouslyPassed) {
        notice.style.display = 'block';
        notice.innerHTML = isEs
            ? "\u2713 MC ya aprobado y guardado. Solo necesita reenviar la secci\u00f3n de respuesta corta (9/10)."
            : "\u2713 MC already passed and banked. Only need to resubmit the short-answer section (9/10).";
    } else {
        notice.style.display = 'none';
    }
    return true;
}

function renderQuestions() {
    const container = document.getElementById('questionsContainer');
    if (!container) return;
    container.innerHTML = '';
    currentLang = document.body.classList.contains('lang-en') ? 'en' : 'es';

    const mcTitle = document.createElement('h3');
    mcTitle.innerHTML = currentLang === 'en' ? 'Multiple Choice (Questions 1\u201320)' : 'Opci\u00f3n M\u00faltiple (Preguntas 1\u201320)';
    container.appendChild(mcTitle);

    if (mcPreviouslyPassed) {
        const banked = document.createElement('div');
        banked.className = 'feedback-text correct';
        banked.style.marginBottom = '15px';
        banked.innerHTML = currentLang === 'en'
            ? '\u2713 Multiple-choice section previously passed. Your answers are preserved below for reference; you may proceed directly to the short-answer section.'
            : '\u2713 Secci\u00f3n de opci\u00f3n m\u00faltiple ya aprobada. Sus respuestas se conservan abajo para referencia; puede pasar directamente a la secci\u00f3n de respuesta corta.';
        container.appendChild(banked);
    }

    const mcReveal = mcRevealed || mcPreviouslyPassed;
    mcQuestions.forEach((q, idx) => {
        const div = document.createElement('div');
        div.className = 'question';
        const qText = document.createElement('p');
        qText.style.fontWeight = 'bold';
        qText.innerHTML = currentLang === 'en' ? q.textEn : q.textEs;
        div.appendChild(qText);
        const options = currentLang === 'en' ? q.optionsEn : q.optionsEs;
        const correctLetter = String.fromCharCode(65 + q.correct);
        const answered = !!mcAnswers[idx];
        options.forEach((opt, optIdx) => {
            const letter = String.fromCharCode(65 + optIdx);
            const btn = document.createElement('button');
            btn.className = 'option';
            btn.textContent = `${letter}. ${opt}`;
            if (mcReveal || answered) {
                if (optIdx === q.correct) btn.classList.add('correct');
                else if (mcAnswers[idx] === letter) btn.classList.add('wrong');
            } else if (mcAnswers[idx] === letter) {
                btn.style.background = '#efe7d2';
                btn.style.borderColor = '#d4af37';
                btn.style.fontWeight = '600';
            }
            if (!mcPreviouslyPassed && !unitPassed && !answered) {
                btn.onclick = function() {
                    
                    mcAnswers[idx] = letter;
                    saveState();
                    renderQuestions();
                };
            }
            div.appendChild(btn);
        });
        if (mcReveal || answered) {
            const fb = document.createElement('div');
            const exp = currentLang === 'en' ? (q.explanationEn || '') : (q.explanationEs || '');
            if (mcAnswers[idx] === correctLetter) {
                fb.className = 'feedback-text correct';
                fb.innerHTML = (currentLang === 'en' ? '✓ Correct! ' : '✓ ¡Correcto! ') + exp;
            } else if (mcAnswers[idx]) {
                fb.className = 'feedback-text incorrect';
                fb.innerHTML = (currentLang === 'en' ? `✗ Incorrect. Correct answer: ${correctLetter}. ` : `✗ Incorrecto. Respuesta correcta: ${correctLetter}. `) + exp;
            } else {
                fb.className = 'feedback-text incorrect';
                fb.innerHTML = (currentLang === 'en' ? `Not answered. Correct answer: ${correctLetter}. ` : `Sin responder. Respuesta correcta: ${correctLetter}. `) + exp;
            }
            div.appendChild(fb);
        }
        container.appendChild(div);
    });

    const kwTitle = document.createElement('h3');
    kwTitle.style.marginTop = '30px';
    kwTitle.innerHTML = currentLang === 'en' ? 'Short Answer (21\u201330) \u2014 M.Div. / Th.M. Track' : 'Respuesta Corta (21\u201330) \u2014 M.Div. / Th.M.';
    container.appendChild(kwTitle);

    kwQuestions.forEach((q, idx) => {
        const div = document.createElement('div');
        div.className = 'question';
        const qText = document.createElement('p');
        qText.style.fontWeight = 'bold';
        qText.innerHTML = currentLang === 'en' ? q.textEn : q.textEs;
        div.appendChild(qText);
        const ta = document.createElement('textarea');
        ta.className = 'kw-answer';
        ta.rows = 3;
        ta.placeholder = currentLang === 'en' ? 'Type your answer...' : 'Escriba su respuesta...';
        ta.value = kwAnswers[idx] || '';
        div.appendChild(ta);
        const checkBtn = document.createElement('button');
        checkBtn.className = 'small';
        checkBtn.textContent = currentLang === 'en' ? 'Check Answer' : 'Verificar';
        const fb = document.createElement('div');
        fb.style.marginTop = '8px';
        const modelBox = document.createElement('div');
        modelBox.className = 'model-answer';
        modelBox.style.display = 'none';
        checkBtn.onclick = function() {
            const ans = (ta.value || '').trim().toLowerCase();
            const kws = currentLang === 'es' ? q.kw_es : q.kw_en;
            if (ans.length < 100) {
                fb.className = 'feedback-text incorrect';
                fb.innerHTML = currentLang === 'en' ? 'Please write your own answer first (at least 20 characters), then check it against the model answer below.' : 'Escriba primero su propia respuesta (al menos 20 caracteres), luego comp\u00e1rela con la respuesta modelo abajo.';
                return;
            }
            const hits = kws.filter(k => kwHit(ans, k));
            fb.className = 'feedback-text correct';
            if (hits.length >= 3) {
                fb.innerHTML = currentLang === 'en'
                    ? `\u2713 Well done \u2014 your answer touches ${hits.length} of the lesson's key ideas. Now compare it with the model answer below to deepen your understanding.`
                    : `\u2713 Muy bien \u2014 su respuesta toca ${hits.length} de las ideas clave de la lecci\u00f3n. Ahora comp\u00e1rela con la respuesta modelo abajo para profundizar su comprensi\u00f3n.`;
            } else {
                fb.innerHTML = currentLang === 'en'
                    ? `Good effort \u2014 you have begun the answer. Read the model answer below and notice the key ideas you might add. This is how we learn; there is no penalty.`
                    : `Buen esfuerzo \u2014 ha comenzado la respuesta. Lea la respuesta modelo abajo y note las ideas clave que podr\u00eda a\u00f1adir. As\u00ed aprendemos; no hay penalizaci\u00f3n.`;
            }
            const model = currentLang === 'en' ? (q.modelEn || '') : (q.modelEs || '');
            if (model) {
                modelBox.style.display = 'block';
                modelBox.innerHTML = (currentLang === 'en' ? '<strong>Model answer \u2014 study this:</strong> ' : '<strong>Respuesta modelo \u2014 est\u00fadiela:</strong> ') + model;
            }
        };
        div.appendChild(checkBtn);
        div.appendChild(fb);
        div.appendChild(modelBox);
        container.appendChild(div);
        ta.addEventListener('input', e => { kwAnswers[idx] = e.target.value; saveState(); });
    });
}

function gradeMC() {
    let c = 0;
    for (let i = 0; i < 20; i++) {
        if (mcAnswers[i] === String.fromCharCode(65 + mcQuestions[i].correct)) c++;
    }
    return c;
}

function kwHit(ans, k) {
    k = (k || '').toLowerCase();
    if (!k) return false;
    var WC = '0-9a-z\u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00fc';
    var esc = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var pat = (k.length <= 4)
        ? '(?:^|[^' + WC + '])' + esc + '(?![' + WC + '])'
        : '(?:^|[^' + WC + '])' + esc;
    try { return new RegExp(pat, 'i').test(ans); }
    catch(e) { return ans.indexOf(k) !== -1; }
}

function gradeSA() {
    const isEs = document.body.classList.contains('lang-es');
    let c = 0;
    for (let i = 0; i < 10; i++) {
        const ans = (kwAnswers[i] || '').toLowerCase();
        if (ans.length < 100) continue;
        const kws = isEs ? kwQuestions[i].kw_es : kwQuestions[i].kw_en;
        let hits = 0;
        kws.forEach(k => { if (kwHit(ans, k)) hits++; });
        if (hits >= 3) c++;
    }
    return c;
}

function isMastersLevel(track) {
    return track === 'mdiv' || track === 'thm';
}

function submitExam() {
    if (!checkLockouts()) return;
    if (unitPassed) return;
    const student = JSON.parse(localStorage.getItem('cts_student') || 'null');
    if (!student || !student.name) {
        alert(currentLang === 'en' ? 'Please register first.' : 'Por favor reg\u00edstrese primero.');
        return;
    }
    const isEs = document.body.classList.contains('lang-es');
    const track = student.track || 'certificate';
    const result = document.getElementById('examResult');
    const mcScore = mcPreviouslyPassed ? 20 : gradeMC();
    const mcOk = mcScore >= 18;
    if (!mcPreviouslyPassed) { mcRevealed = true; renderQuestions(); }

    if (!isMastersLevel(track)) {
        if (mcOk) {
            progress[`unit${UNIT}`] = true;
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
            localStorage.setItem(MC_PASS_KEY, 'true');
            mcPreviouslyPassed = true; unitPassed = true;
            result.innerHTML = isEs
                ? `<span style='color:#1f6b3b'>\u2713 \u00a1APROBADO! ${mcScore}/20. Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.</span>`
                : `<span style='color:green'>\u2713 PASSED! ${mcScore}/20. Your answers are marked below. Review them, then use the button at the top to continue.</span>`;
            document.getElementById('nextUnitBtn').disabled = false;
            updateProgressGrid();
        } else {
            localStorage.setItem(FULL_LOCK_KEY, String(Date.now() + lockMinutes() * 60 * 1000));
            result.innerHTML = isEs
                ? `<span style='color:#8a1f1f'>Obtuvo ${mcScore}/20 (se necesitan 18 para aprobar). \u00a1Est\u00e1 cerca, no se desanime! Repase la lecci\u00f3n de arriba, y vuelva a intentarlo en ${lockMinutes()} minuto(s). Las explicaciones de abajo muestran qu\u00e9 estudiar.</span>`
                : `<span style='color:#8a1f1f'>You scored ${mcScore}/20 (18 needed to pass). You're close \u2014 don't be discouraged! Review the lesson above, then try again in ${lockMinutes()} minute(s). The answer explanations below show what to study.</span>`;
            checkLockouts();
        }
        return;
    }

    const saScore = gradeSA();
    const saOk = saScore >= 9;

    if (mcPreviouslyPassed) {
        if (saOk) {
            progress[`unit${UNIT}`] = true;
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
            unitPassed = true;
            result.innerHTML = isEs
                ? `<span style='color:#1f6b3b'>\u2713 \u00a1APROBADO! MC \u2713 banco + SA ${saScore}/10. Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.</span>`
                : `<span style='color:green'>\u2713 PASSED! MC \u2713 banked + SA ${saScore}/10. Your answers are marked below. Review them, then use the button at the top to continue.</span>`;
            document.getElementById('nextUnitBtn').disabled = false;
            updateProgressGrid();
        } else {
            localStorage.setItem(SA_LOCK_KEY, String(Date.now() + lockMinutes() * 60 * 1000));
            result.innerHTML = isEs
                ? `<span style='color:#8a1f1f'>Su aprobaci\u00f3n de opci\u00f3n m\u00faltiple est\u00e1 a salvo. Respuesta corta: ${saScore}/10 (se necesitan 9). Buen esfuerzo \u2014 repase la lecci\u00f3n y las respuestas modelo abajo, y vuelva a intentar la secci\u00f3n de respuesta corta en ${lockMinutes()} minuto(s).</span>`
                : `<span style='color:#8a1f1f'>Your multiple-choice pass is safe. Short answer: ${saScore}/10 (9 needed). Good effort \u2014 review the lesson and the model answers below, then try the short-answer section again in ${lockMinutes()} minute(s).</span>`;
            checkLockouts();
        }
        return;
    }

    if (mcOk && saOk) {
        progress[`unit${UNIT}`] = true;
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
        localStorage.setItem(MC_PASS_KEY, 'true');
        mcPreviouslyPassed = true; unitPassed = true;
        result.innerHTML = isEs
            ? `<span style='color:#1f6b3b'>\u2713 \u00a1APROBADO! MC ${mcScore}/20 + SA ${saScore}/10. Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.</span>`
            : `<span style='color:green'>\u2713 PASSED! MC ${mcScore}/20 + SA ${saScore}/10. Your answers are marked below. Review them, then use the button at the top to continue.</span>`;
        document.getElementById('nextUnitBtn').disabled = false;
        updateProgressGrid();
    } else if (mcOk && !saOk) {
        localStorage.setItem(MC_PASS_KEY, 'true');
        mcPreviouslyPassed = true;
        localStorage.setItem(SA_LOCK_KEY, String(Date.now() + lockMinutes() * 60 * 1000));
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>MC ${mcScore}/20 \u2713 aprobado y guardado. SA ${saScore}/10 (se requiere 9). Secci\u00f3n SA bloqueada ${lockMinutes()} min. Al desbloquear, reenv\u00ede solo la SA \u2014 el MC permanece aprobado.</span>`
            : `<span style='color:#8a1f1f'>MC ${mcScore}/20 \u2713 passed and banked. SA ${saScore}/10 (need 9). SA section locked ${lockMinutes()} min. When unlocked, resubmit SA only \u2014 MC stays passed.</span>`;
        checkLockouts();
    } else {
        localStorage.setItem(FULL_LOCK_KEY, String(Date.now() + lockMinutes() * 60 * 1000));
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>\u2717 Reprobado: MC ${mcScore}/20 + SA ${saScore}/10 (se requiere 18 y 9). Unidad bloqueada ${lockMinutes()} minutos.</span>`
            : `<span style='color:#8a1f1f'>\u2717 Failed: MC ${mcScore}/20 + SA ${saScore}/10 (need 18 and 9). Unit locked ${lockMinutes()} minutes.</span>`;
        checkLockouts();
    }
}

function resetUnit() {
    const isEs = document.body.classList.contains('lang-es');
    const msg = isEs
        ? '\u00bfReiniciar esta unidad?\n\nEsto borrar\u00e1: respuestas en progreso, estado MC aprobado, todos los bloqueos, y el indicador de aprobaci\u00f3n de esta unidad.\n\nEl contenido docente permanece. Esta acci\u00f3n no se puede deshacer.'
        : 'Reset this unit?\n\nThis will clear: in-progress answers, MC-passed state, all lockouts, and this unit\'s pass flag.\n\nTeaching content stays. This cannot be undone.';
    if (!confirm(msg)) return;
    localStorage.removeItem(STATE_KEY);
    localStorage.removeItem(MC_PASS_KEY);
    localStorage.removeItem(SA_LOCK_KEY);
    localStorage.removeItem(FULL_LOCK_KEY);
    delete progress[`unit${UNIT}`];
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    mcAnswers = new Array(20).fill(null);
    kwAnswers = new Array(10).fill("");
    mcPreviouslyPassed = false;
    renderQuestions();
    try { location.reload(); } catch (e) {}
}

document.getElementById('submitExamBtn').onclick = submitExam;
document.getElementById('resetExamBtn').onclick = resetUnit;
renderQuestions();
checkLockouts();
