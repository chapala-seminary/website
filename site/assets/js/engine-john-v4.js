/* Exam engine for CTSJohn (shared by 1 unit page).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/john/unitN.js. */
const COURSE = 'john';

const totalUnits = 12;
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
        grid.innerHTML += `<a href="CTSJohnUnit${i}.html" class="${cls}" title="${unitTitlesEn[i-1]}">${i}</a>`;
    }
    if (progress[`unit${UNIT}`]) document.getElementById('nextUnitBtn').disabled = false;
}
document.getElementById('nextUnitBtn').onclick = () => { location.href = NEXT_UNIT_URL; };
updateProgressGrid();

function displayStudentGreeting() {
    const student = JSON.parse(localStorage.getItem('cts_student') || 'null');
    if (student && student.name) {
        document.getElementById('studentGreeting').innerHTML = `\u{1F44B} ${student.name}`;
        document.getElementById('regCard').style.display = 'none';
    } else {
        document.getElementById('studentGreeting').innerHTML = '<a href="CTSJohnUnit1.html" style="color:#8a1f1f;">Please register on Unit 1 / Reg&iacute;strese en la Unidad 1</a>';
    }
}
displayStudentGreeting();

document.getElementById('regBtn').onclick = function() {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const track = document.getElementById('regTrack').value;
    if (!name || !email) {
        document.getElementById('regStatus').innerHTML = "<span style='color:red'>Please fill all fields. / Por favor complete todos los campos.</span>";
        return;
    }
    const student = { name, email, track, registered: new Date().toISOString() };
    localStorage.setItem('cts_student', JSON.stringify(student));
    localStorage.setItem('cts_track', track);
    document.getElementById('regStatus').innerHTML = "<span style='color:green'>\u2713 Registered! / \u00a1Registrado!</span>";
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


const kwQuestions = [
{"textEn":"Explain the \"God-sized problem\" in John 6 and how it parallels Moses and the manna.","textEs":"Explique el \"problema del tama\u00f1o de Dios\" en Juan 6 y c\u00f3mo es paralelo a Mois\u00e9s y el man\u00e1.","kw_en":["problem","crowd","food","mose","manna","wildern","god","provide"],"kw_es":["problema","multitud","comida","moise","mana","desierto","dios","provee"],"modelEn":"A God-sized problem is one no human effort can solve. In John 6 a huge crowd in a wilderness had no food, just as Moses faced a multitude of former slaves with nothing to eat in the desert. In Moses' day God provided manna, a bread rained from heaven they had never seen. Now the same God meets the same kind of problem by the Sea of Galilee, multiplying loaves to feed thousands. The parallel shows that what is impossible for man is the ordinary work of God, who provides where no human solution exists.","modelEs":"Un problema del tama\u00f1o de Dios es uno que ning\u00fan esfuerzo humano puede resolver. En Juan 6 una gran multitud en un desierto no ten\u00eda comida, igual que Mois\u00e9s enfrent\u00f3 a una muchedumbre de antiguos esclavos sin nada que comer en el desierto. En tiempos de Mois\u00e9s Dios provey\u00f3 man\u00e1, un pan llovido del cielo que nunca hab\u00edan visto. Ahora el mismo Dios enfrenta la misma clase de problema junto al mar de Galilea, multiplicando panes para alimentar a miles. El paralelo muestra que lo imposible para el hombre es la obra ordinaria de Dios, que provee donde no hay soluci\u00f3n humana."},
{"textEn":"Describe the feeding miracle and the significance of the boy's gift.","textEs":"Describa el milagro de la alimentaci\u00f3n y el significado del don del ni\u00f1o.","kw_en":["boy","loave","fish","barley","five","multipl","thank","feed"],"kw_es":["nino","panes","peces","cebada","cinco","multiplic","gracias","aliment"],"modelEn":"A boy had five barley loaves and two small fish, the food of the very poor and far too little for the crowd. Jesus took the loaves, gave thanks, broke them, and as He broke them they multiplied until thousands were fed, with twelve baskets left over. The significance is that Jesus used a child's small surrendered gift to do a great work; the answer was never in the disciples' arithmetic but in the Lord. God still takes the little we give Him and multiplies it to feed many.","modelEs":"Un ni\u00f1o ten\u00eda cinco panes de cebada y dos pececillos, la comida de los muy pobres y muy poco para la multitud. Jes\u00fas tom\u00f3 los panes, dio gracias, los parti\u00f3, y al partirlos se multiplicaban hasta alimentar a miles, con doce cestas de sobra. El significado es que Jes\u00fas us\u00f3 el peque\u00f1o don entregado de un ni\u00f1o para una gran obra; la respuesta nunca estuvo en la aritm\u00e9tica de los disc\u00edpulos sino en el Se\u00f1or. Dios a\u00fan toma lo poco que le damos y lo multiplica para alimentar a muchos."},
{"textEn":"Explain Jesus' divine compassion and why the Old and New Testament God are one.","textEs":"Explique la compasi\u00f3n divina de Jes\u00fas y por qu\u00e9 el Dios del Antiguo y del Nuevo Testamento es uno.","kw_en":["compassion","jesus","need","old","testament","same","father","son"],"kw_es":["compasion","jesus","necesidad","antiguo","testamento","mismo","padre","hijo"],"modelEn":"Matthew says Jesus was moved with compassion for the crowd and healed and fed them; six times the Gospels record His compassion. Some imagine the Old Testament God as harsh and Jesus as kind, as if they were two Gods, but there is no difference between the Father and the Son. The Old Testament speaks often of God's compassion, and God was in Christ reconciling the world to Himself. The same heart that fed Israel manna fed the crowd by Galilee, so the one God has always sought to bring people to Himself in mercy.","modelEs":"Mateo dice que Jes\u00fas tuvo compasi\u00f3n de la multitud y los san\u00f3 y aliment\u00f3; seis veces registran los Evangelios su compasi\u00f3n. Algunos imaginan al Dios del Antiguo Testamento como duro y a Jes\u00fas como bondadoso, como si fueran dos dioses, pero no hay diferencia entre el Padre y el Hijo. El Antiguo Testamento habla a menudo de la compasi\u00f3n de Dios, y Dios estaba en Cristo reconciliando consigo al mundo. El mismo coraz\u00f3n que aliment\u00f3 a Israel con man\u00e1 aliment\u00f3 a la multitud junto a Galilea, as\u00ed que el \u00fanico Dios siempre ha buscado traer a la gente a s\u00ed con misericordia."},
{"textEn":"Explain divine multiplication and how God uses small, surrendered gifts.","textEs":"Explique la multiplicaci\u00f3n divina y c\u00f3mo Dios usa los dones peque\u00f1os y entregados.","kw_en":["multipl","small","gift","surrend","god","use","great","give"],"kw_es":["multiplic","pequeno","don","entreg","dios","usa","grande","da"],"modelEn":"Divine multiplication means God takes a small thing surrendered to Him and makes it accomplish far more than it could on its own. Jesus took a boy's small lunch and multiplied it to feed thousands, with more left over than He began with. The widow of Zarephath gave her last flour and oil and never ran empty again. The lesson is that God can use the little we give Him, our time, our talents, our weak gifts, and multiply them for His purposes, so no offering surrendered to Him is too small to be used greatly.","modelEs":"La multiplicaci\u00f3n divina significa que Dios toma algo peque\u00f1o entregado a \u00e9l y lo hace lograr mucho m\u00e1s de lo que podr\u00eda por s\u00ed solo. Jes\u00fas tom\u00f3 el peque\u00f1o almuerzo de un ni\u00f1o y lo multiplic\u00f3 para alimentar a miles, con m\u00e1s sobras que al comienzo. La viuda de Sarepta dio su \u00faltima harina y aceite y nunca m\u00e1s qued\u00f3 vac\u00eda. La lecci\u00f3n es que Dios puede usar lo poco que le damos, nuestro tiempo, talentos y dones d\u00e9biles, y multiplicarlos para sus prop\u00f3sitos, as\u00ed que ning\u00fan don entregado a \u00e9l es demasiado peque\u00f1o para ser usado en grande."},
{"textEn":"What do the twelve baskets and \"let nothing be lost\" teach about grace?","textEs":"\u00bfQu\u00e9 ense\u00f1an las doce cestas y \"que no se pierda nada\" sobre la gracia?","kw_en":["twelve","basket","left","abundance","grace","enough","never","waste"],"kw_es":["doce","cesta","sobr","abundancia","gracia","suficiente","nunca","perd"],"modelEn":"After everyone had eaten their fill, twelve baskets of fragments remained, more than there had been to begin with. Jesus said to gather them so that nothing would be lost. This pictures the overflowing abundance of God's grace: it is grace stacked upon grace, and we never come to the end of it. There is always enough and more than enough in Christ, both for our need and to share, so no one need go away hungry.","modelEs":"Despu\u00e9s de que todos comieron hasta saciarse, quedaron doce cestas de pedazos, m\u00e1s de lo que hab\u00eda al principio. Jes\u00fas mand\u00f3 recogerlos para que no se perdiera nada. Esto representa la abundancia desbordante de la gracia de Dios: es gracia sobre gracia, y nunca llegamos a su fin. Siempre hay suficiente y m\u00e1s que suficiente en Cristo, tanto para nuestra necesidad como para compartir, as\u00ed que nadie tiene por qu\u00e9 irse hambriento."},
{"textEn":"Why did Jesus refuse to be made king by force, and what does \"the Creator is no man's debtor\" mean?","textEs":"\u00bfPor qu\u00e9 rehus\u00f3 Jes\u00fas ser hecho rey por fuerza, y qu\u00e9 significa \"el Creador no es deudor de nadie\"?","kw_en":["king","force","withdrew","kingdom","god","father","himself","bread"],"kw_es":["rey","fuerza","retir","reino","dios","padre","mismo","pan"],"modelEn":"After the miracle the crowd wanted to take Jesus by force and make Him king to fill their stomachs, but He withdrew alone to the mountain. He would not be crowned on man's terms or for man's appetites; His kingdom comes from the Father's hand, and in due time He will truly reign. That the Creator is no man's debtor means He gives because He is good, not because we have cornered or obligated Him. The danger of every age is to want Jesus for the bread He gives rather than for Himself.","modelEs":"Tras el milagro la multitud quiso tomar a Jes\u00fas por fuerza y hacerle rey para llenar sus est\u00f3magos, pero \u00e9l se retir\u00f3 solo al monte. No ser\u00eda coronado en los t\u00e9rminos del hombre ni para los apetitos del hombre; su reino viene de la mano del Padre, y a su tiempo reinar\u00e1 de veras. Que el Creador no es deudor de nadie significa que da porque es bueno, no porque lo hayamos acorralado u obligado. El peligro de toda \u00e9poca es querer a Jes\u00fas por el pan que da y no por \u00e9l mismo."},
{"textEn":"Explain the walking on the water and the meaning of \"It is I; do not be afraid.\"","textEs":"Explique el caminar sobre el agua y el significado de \"Yo soy; no tem\u00e1is.\"","kw_en":["water","walk","storm","sea","afraid","fear","disciple","master"],"kw_es":["agua","camin","tormenta","mar","teme","miedo","discipul","domin"],"modelEn":"That night the disciples set out without Jesus and a storm rose; they strained at the oars in the dark and made no progress. Jesus came to them walking on the water, the very sea He had made holding firm beneath His feet. They were afraid until He said, It is I; do not be afraid, words that in Greek are simply I AM, the name of God spoken over the storm. The scene shows that the same Lord who multiplied bread is master of the deep, fully God even as He had been weary as a man, and when they received Him the boat at once reached the shore.","modelEs":"Aquella noche los disc\u00edpulos partieron sin Jes\u00fas y se levant\u00f3 una tormenta; remaban en la oscuridad sin avanzar. Jes\u00fas vino a ellos caminando sobre el agua, el mismo mar que \u00e9l hab\u00eda hecho firme bajo sus pies. Tuvieron miedo hasta que dijo: Yo soy; no tem\u00e1is, palabras que en griego son sencillamente YO SOY, el nombre de Dios pronunciado sobre la tormenta. La escena muestra que el mismo Se\u00f1or que multiplic\u00f3 el pan domina el abismo, plenamente Dios aun habiendo estado cansado como hombre, y cuando le recibieron la barca enseguida lleg\u00f3 a la orilla."},
{"textEn":"Explain \"I am the bread of life\" (John 6:35) and the spiritual hunger of the age.","textEs":"Explique \"Yo soy el pan de vida\" (Juan 6:35) y el hambre espiritual de la \u00e9poca.","kw_en":["bread","life","hunger","thirst","satisf","spiritual","empty","come"],"kw_es":["pan","vida","hambre","sed","satisf","espiritual","vacio","vien"],"modelEn":"Jesus declared, I am the bread of life; he who comes to Me shall never hunger, and he who believes in Me shall never thirst. He meant that He Himself satisfies the deepest need of the soul. We live in an age of spiritual hunger, and the real hunger is for God, yet people try to fill the emptiness with food, sex, money, and recognition, and each leaves the soul as hollow as before. Only Christ, the true Bread come down from heaven, can satisfy; whoever comes to Him in faith finds his hunger met for good.","modelEs":"Jes\u00fas declar\u00f3: Yo soy el pan de vida; el que a m\u00ed viene nunca tendr\u00e1 hambre, y el que en m\u00ed cree no tendr\u00e1 sed jam\u00e1s. Quiso decir que \u00e9l mismo satisface la necesidad m\u00e1s honda del alma. Vivimos en una era de hambre espiritual, y el hambre verdadera es de Dios, pero la gente trata de llenar el vac\u00edo con comida, sexo, dinero y reconocimiento, y cada uno deja el alma tan hueca como antes. Solo Cristo, el verdadero Pan descendido del cielo, puede satisfacer; quien viene a \u00e9l por fe halla su hambre saciada para siempre."},
{"textEn":"Explain Augustine's \"restless heart\" and how it relates to John 6.","textEs":"Explique el \"coraz\u00f3n inquieto\" de Agust\u00edn y c\u00f3mo se relaciona con Juan 6.","kw_en":["augustine","heart","restless","rest","god","satisf","hunger","world"],"kw_es":["agustin","corazon","inquiet","reposo","dios","satisf","hambre","mundo"],"modelEn":"Augustine spent his early years chasing lust, pride, and ambition and never found satisfaction, until he wrote that God has made us for Himself and our hearts are restless until they find their rest in Him. This relates to John 6 because Jesus, the Bread of Life, is the only one who can satisfy the soul's hunger. The world's pleasures leave the heart restless and empty, but coming to Christ gives the rest and fullness the human heart was made for. Augustine's words confess what the whole human race experiences apart from God.","modelEs":"Agust\u00edn pas\u00f3 sus primeros a\u00f1os persiguiendo la lujuria, el orgullo y la ambici\u00f3n y nunca hall\u00f3 satisfacci\u00f3n, hasta que escribi\u00f3 que Dios nos hizo para s\u00ed y nuestro coraz\u00f3n est\u00e1 inquieto hasta hallar su reposo en \u00e9l. Esto se relaciona con Juan 6 porque Jes\u00fas, el Pan de Vida, es el \u00fanico que puede satisfacer el hambre del alma. Los placeres del mundo dejan el coraz\u00f3n inquieto y vac\u00edo, pero venir a Cristo da el reposo y la plenitud para los que fue hecho el coraz\u00f3n humano. Las palabras de Agust\u00edn confiesan lo que toda la raza humana experimenta lejos de Dios."},
{"textEn":"Explain the hard saying about eating His flesh (John 6:51) and Peter's \"to whom shall we go?\"","textEs":"Explique el dicho duro de comer su carne (Juan 6:51) y el \"\u00bfa qui\u00e9n iremos?\" de Pedro.","kw_en":["flesh","bread","cross","life","peter","word","eternal","believ"],"kw_es":["carne","pan","cruz","vida","pedro","palabra","eterna","cree"],"modelEn":"Jesus said the bread He would give is His flesh, given for the life of the world, pointing past the loaves to the cross and to the soul that feeds on Him by faith. This was too hard for many, and from that time many disciples turned back and walked with Him no more. When Jesus asked the Twelve if they would also leave, Peter answered, Lord, to whom shall we go? You have the words of eternal life. The point is that when the easy bread is gone and the saying is hard, there is still no other Savior; Christ alone is the Bread of Life, and faith holds on to Him.","modelEs":"Jes\u00fas dijo que el pan que dar\u00eda es su carne, entregada por la vida del mundo, se\u00f1alando m\u00e1s all\u00e1 de los panes a la cruz y al alma que se alimenta de \u00e9l por la fe. Esto fue demasiado duro para muchos, y desde entonces muchos disc\u00edpulos volvieron atr\u00e1s y ya no andaban con \u00e9l. Cuando Jes\u00fas pregunt\u00f3 a los doce si tambi\u00e9n se ir\u00edan, Pedro respondi\u00f3: Se\u00f1or, \u00bfa qui\u00e9n iremos? T\u00fa tienes palabras de vida eterna. El punto es que cuando se acaba el pan f\u00e1cil y el dicho es duro, no hay otro Salvador; solo Cristo es el Pan de Vida, y la fe se aferra a \u00e9l."}
];

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
            ? `<span style='color:#8a1f1f'>\u{1F4D6} Tome unos minutos para repasar la lecci\u00f3n de arriba, y luego intente de nuevo. Puede reintentar en ${m} minuto(s). \u00a1Usted puede lograrlo!</span>`
            : `<span style='color:#8a1f1f'>\u{1F4D6} Take a few minutes to review the lesson above, then try again. You can retry in ${m} minute(s) \u2014 you've got this!</span>`;
        notice.style.display = 'none';
        setTimeout(checkLockouts, 30000);
        return false;
    }
    if (mcPreviouslyPassed && now < saLock) {
        const m = Math.ceil((saLock - now) / 60000);
        submitBtn.disabled = true;
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>\u{1F4D6} Opci\u00f3n m\u00faltiple aprobada y guardada. Repase la lecci\u00f3n y las respuestas modelo, y reintente la secci\u00f3n de respuesta corta en ${m} minuto(s).</span>`
            : `<span style='color:#8a1f1f'>\u{1F4D6} Multiple-choice passed and saved. Review the lesson and model answers, then retry the short-answer section in ${m} minute(s).</span>`;
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
        qText.innerHTML = (idx + 1) + '. ' + (currentLang === 'en' ? q.textEn : q.textEs);
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
        qText.innerHTML = (mcQuestions.length + idx + 1) + '. ' + (currentLang === 'en' ? q.textEn : q.textEs);
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

function isMastersLevel(track) { return track === 'mdiv' || track === 'thm'; }

function submitExam() {
    if (!checkLockouts()) return;
    if (unitPassed) return;
    const student = JSON.parse(localStorage.getItem('cts_student') || 'null');
    if (!student || !student.name) {
        alert(currentLang === 'en' ? 'Please register on Unit 1 first.' : 'Por favor reg\u00edstrese en la Unidad 1 primero.');
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
                ? `<span style='color:#8a1f1f'>Su aprobaci\u00f3n de opci\u00f3n m\u00faltiple est\u00e1 a salvo. Respuesta corta: ${saScore}/10 (se necesitan 9). Buen esfuerzo \u2014 repase la lecci\u00f3n y las respuestas modelo abajo, y reintente la secci\u00f3n de respuesta corta en ${lockMinutes()} minuto(s).</span>`
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
