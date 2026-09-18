/* Exam engine for CTSST (shared by 1 unit page).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/st/unitN.js. */
// =====================================================================
// CTS Systematic Theology — Unit 10 (Last Things) — built on validated engine
// Implements: cts_track gating, MC-pass persists, SA-only lockout on
// partial failure, split kw_en/kw_es, UNIT_KEY mid-exam save/restore,
// Reset, 3s auto-redirect on pass.
// =====================================================================


const COURSE = 'st';

const totalUnits = 13;
let currentUnit = UNIT;

// localStorage keys
const STATE_KEY     = `cts_${COURSE}_u${UNIT}_state`;
const MC_PASS_KEY   = `cts_${COURSE}_u${UNIT}_mc_passed`;
const SA_LOCK_KEY   = `cts_${COURSE}_u${UNIT}_sa_lockout`;
const FULL_LOCK_KEY = `cts_${COURSE}_u${UNIT}_lockout`;

// Review interval after a failed exam. Purpose is to send the student back to
// the lesson to review before retrying — short for self-paced lay students,
// longer for the credential-bearing Masters tracks.
function lockMinutes() {
    try {
        const st = JSON.parse(localStorage.getItem('cts_student') || 'null');
        const t = st && st.track ? st.track : 'certificate';
        return (t === 'mdiv' || t === 'thm') ? 15 : 2;
    } catch (e) { return 2; }
}
const PROGRESS_KEY  = `cts_${COURSE}_progress`;


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
        grid.innerHTML += `<a href="CTSSTUnit${i}.html" class="${cls}" title="${unitTitlesEn[i-1]}">${i}</a>`;
    }
    if (progress[`unit${UNIT}`]) document.getElementById('nextUnitBtn').disabled = false;
}
document.getElementById('nextUnitBtn').onclick = () => { location.href = NEXT_UNIT_URL; };
updateProgressGrid();

function displayStudentGreeting() {
    const student = JSON.parse(localStorage.getItem('cts_student') || 'null');
    if (student && student.name) {
        document.getElementById('studentGreeting').innerHTML = `👋 ${student.name}`;
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
    document.getElementById('regStatus').innerHTML = "<span style='color:green'>✓ Registered successfully!</span>";
    setTimeout(() => { document.getElementById('regCard').style.display = 'none'; displayStudentGreeting(); }, 800);
};

document.getElementById('langToggleBtn').onclick = function() {
    if (document.body.classList.contains('lang-en')) {
        document.body.classList.remove('lang-en');
        document.body.classList.add('lang-es');
        this.textContent = 'English';
    } else {
        document.body.classList.remove('lang-es');
        document.body.classList.add('lang-en');
        this.textContent = 'Español';
    }
    renderQuestions();
    checkLockouts();
};

// MC answer key distribution audited: A=B=C=D=5 (perfect cycle 0,1,2,3 x5)
// MC answer key: A=B=C=D=5; all 20 verified against Psalm 1


// SA questions — split kw_en / kw_es per 2026-05-16 rule.
// Grader reads document.body.classList for lang-en or lang-es and uses only matching language array.
// Threshold: 3 keyword hits per question.
const kwQuestions = [
    { textEn: "21. Explain why Jesus emphasized readiness rather than providing a timeline for the end. How does this shape Christian living?",
      textEs: "21. Explique por qué Jesús enfatizó la preparación en lugar de dar un cronograma para el fin. ¿Cómo moldea esto la vida cristiana?",
      kw_en: ["readiness", "timeline", "no one knows", "watch", "live", "faithful", "date", "prepared"],
      kw_es: ["preparación", "cronograma", "nadie sabe", "velar", "vivir", "fiel", "fecha", "preparado"],
      modelEn: "The unit shows that Jesus deliberately withheld a timeline for the end, saying that of that day and hour no one knows, not even the angels or the Son, but only the Father. Instead of dates, He emphasized readiness. The point is not to calculate when the end will come but to be prepared whenever it comes. This shapes Christian living by turning attention away from speculation and toward faithfulness: because the timing is hidden and the coming sudden, believers are to watch and live each day ready to meet their Lord. Readiness means ongoing obedience and watchfulness rather than last-minute scrambling tied to a predicted date. So eschatology becomes a call to steady, faithful living now, not an invitation to chart the future.",
      modelEs: "La unidad muestra que Jesús deliberadamente ocultó un cronograma para el fin, diciendo que de aquel día y hora nadie sabe, ni los ángeles ni el Hijo, sino solo el Padre. En lugar de fechas, enfatizó la preparación. El punto no es calcular cuándo vendrá el fin sino estar preparados para cuando venga. Esto moldea la vida cristiana apartando la atención de la especulación y dirigiéndola a la fidelidad: como el tiempo está oculto y la venida es repentina, los creyentes deben velar y vivir cada día listos para encontrarse con su Señor. La preparación significa obediencia y vigilancia continuas en lugar de un apuro de último momento atado a una fecha predicha. Así que la escatología se vuelve un llamado a vivir de manera constante y fiel ahora, no una invitación a trazar el futuro." },

    { textEn: "22. Compare and contrast the three main millennial views. On what essentials do they agree?",
      textEs: "22. Compare y contraste las tres principales visiones milenarias. ¿En qué esenciales concuerdan?",
      kw_en: ["premillennialism", "postmillennialism", "amillennialism", "thousand", "return", "agree", "bodily", "kingdom"],
      kw_es: ["premilenialismo", "postmilenialismo", "amilenialismo", "mil", "regreso", "concuerdan", "corporal", "reino"],
      modelEn: "The unit lays out three views of the millennium. Premillennialism, especially the dispensational form, holds that Christ returns before a literal thousand-year reign on earth. Postmillennialism teaches that Christ returns after a period of gospel-inspired moral and spiritual progress that culminates in a golden age. Amillennialism interprets the thousand years symbolically as the present reign of Christ from heaven through His church, with the millennium being the entire church age. They differ over the nature and timing of the thousand years and over how literally to read the relevant texts. Yet the unit stresses that they agree on the essentials: Christ will return bodily, visibly, and gloriously; the dead will rise; and God will consummate His kingdom in a new heaven and new earth. The disagreement is real but secondary, set within a shared core hope.",
      modelEs: "La unidad expone tres visiones del milenio. El premilenialismo, especialmente la forma dispensacional, sostiene que Cristo regresa antes de un reinado literal de mil años en la tierra. El postmilenialismo enseña que Cristo regresa después de un período de progreso moral y espiritual inspirado por el evangelio que culmina en una era dorada. El amilenialismo interpreta los mil años simbólicamente como el reinado presente de Cristo desde el cielo por medio de Su iglesia, siendo el milenio toda la era de la iglesia. Difieren sobre la naturaleza y el tiempo de los mil años y sobre cuán literalmente leer los textos pertinentes. Sin embargo, la unidad subraya que concuerdan en lo esencial: Cristo regresará corporal, visible y gloriosamente; los muertos resucitarán; y Dios consumará Su reino en un cielo nuevo y una tierra nueva. El desacuerdo es real pero secundario, situado dentro de una esperanza central compartida." },

    { textEn: "23. Explain the historical context of Revelation. Why was it written, and how does that context affect our interpretation?",
      textEs: "23. Explique el contexto histórico de Apocalipsis. ¿Por qué fue escrito, y cómo afecta ese contexto nuestra interpretación?",
      kw_en: ["Revelation", "persecution", "suffering", "comfort", "sovereignty", "context", "encourage", "interpret"],
      kw_es: ["Apocalipsis", "persecución", "sufrimiento", "consuelo", "soberanía", "contexto", "animar", "interpretar"],
      modelEn: "The unit teaches that Revelation was written to a church facing suffering and persecution, and that its purpose was to assure believers of God's sovereignty in the midst of that trial. It was not given primarily as a coded calendar of future events but as comfort and encouragement to Christians under pressure, declaring that God reigns and will triumph. Reading it in this context affects interpretation directly: rather than mining it mainly for predictions and charts, we should hear it first as a message of hope and endurance to a suffering people. The imagery served to strengthen their faith and confidence that, however fierce the opposition, God is on the throne. Keeping the original setting of suffering and sovereignty in view guards us from turning the book into mere speculation and keeps its pastoral aim central.",
      modelEs: "La unidad enseña que Apocalipsis fue escrito a una iglesia que enfrentaba sufrimiento y persecución, y que su propósito era asegurar a los creyentes de la soberanía de Dios en medio de esa prueba. No fue dado principalmente como un calendario cifrado de eventos futuros sino como consuelo y aliento a los cristianos bajo presión, declarando que Dios reina y triunfará. Leerlo en este contexto afecta directamente la interpretación: en lugar de explotarlo sobre todo en busca de predicciones y diagramas, debemos oírlo primero como un mensaje de esperanza y perseverancia para un pueblo que sufre. Las imágenes servían para fortalecer su fe y su confianza de que, por feroz que fuera la oposición, Dios está en el trono. Mantener a la vista el escenario original de sufrimiento y soberanía nos guarda de convertir el libro en mera especulación y mantiene central su propósito pastoral." },

    { textEn: "24. What did Jesus mean by the \"already / not yet\" nature of the Kingdom? Give an example.",
      textEs: "24. ¿Qué quiso decir Jesús con la naturaleza de \"ya / todavía no\" del Reino? Dé un ejemplo.",
      kw_en: ["already", "not yet", "present", "future", "Jesus", "Spirit", "consummated", "kingdom"],
      kw_es: ["ya", "todavía no", "presente", "futuro", "Jesús", "Espíritu", "consumado", "reino"],
      modelEn: "The unit describes the Kingdom of God as both already present and not yet fully consummated. It is already here in the ministry of Jesus and in the indwelling of the Spirit: God's reign broke into the world with Christ's coming, so the kingdom is a present reality in the lives of those who belong to Him. Yet it is not yet complete; we still await the visible, glorious reign of Christ when the kingdom will be fully realized. An example is the indwelling Spirit: believers genuinely experience the life and power of the kingdom now, a real foretaste, while still awaiting the future fulfillment. This tension means Christians live between the times, enjoying the down payment of the kingdom already given while longing for and expecting its final consummation.",
      modelEs: "La unidad describe el Reino de Dios como a la vez ya presente y todavía no plenamente consumado. Ya está aquí en el ministerio de Jesús y en la morada del Espíritu: el reinado de Dios irrumpió en el mundo con la venida de Cristo, así que el reino es una realidad presente en la vida de quienes le pertenecen. Sin embargo, todavía no está completo; aún esperamos el reinado visible y glorioso de Cristo cuando el reino se realizará plenamente. Un ejemplo es el Espíritu que mora en nosotros: los creyentes experimentan genuinamente la vida y el poder del reino ahora, un anticipo real, mientras todavía esperan el cumplimiento futuro. Esta tensión significa que los cristianos viven entre los tiempos, gozando de las arras del reino ya dadas mientras anhelan y esperan su consumación final." },

    { textEn: "25. Why does Paul compare the Day of the Lord to a thief? What attitude should believers have because of this?",
      textEs: "25. ¿Por qué compara Pablo el Día del Señor con un ladrón? ¿Qué actitud deben tener los creyentes por causa de esto?",
      kw_en: ["thief", "unexpected", "sudden", "watchful", "deliverance", "destruction", "alert", "ready"],
      kw_es: ["ladrón", "inesperado", "repentino", "vigilantes", "liberación", "destrucción", "alerta", "listos"],
      modelEn: "The unit explains that Paul compares the Day of the Lord to a thief in the night because it will be unexpected, sudden, and decisive. A thief gives no warning, so the comparison stresses that the day will arrive without notice. For the unbeliever it brings destruction, but for the believer it brings deliverance. Because of this, Paul urges believers not to sleep as others do but to stay awake and alert. The fitting attitude is therefore watchfulness rather than fear: believers are to live soberly and ready, not caught off guard, since they belong to the day and not to the night. The thief image is meant not to terrify the faithful but to keep them spiritually awake, expectant, and prepared, confident that for them the day means rescue.",
      modelEs: "La unidad explica que Pablo compara el Día del Señor con un ladrón en la noche porque será inesperado, repentino y decisivo. Un ladrón no da aviso, así que la comparación subraya que el día llegará sin previo aviso. Para el incrédulo trae destrucción, pero para el creyente trae liberación. Por causa de esto, Pablo exhorta a los creyentes a no dormir como los demás sino a permanecer despiertos y alertas. La actitud apropiada es por tanto la vigilancia más que el temor: los creyentes deben vivir sobriamente y listos, sin ser tomados por sorpresa, pues pertenecen al día y no a la noche. La imagen del ladrón no pretende aterrar a los fieles sino mantenerlos espiritualmente despiertos, expectantes y preparados, confiados en que para ellos el día significa rescate." },

    { textEn: "26. How does eschatology produce hope rather than fear? Support your answer from Paul's teaching.",
      textEs: "26. ¿Cómo produce la escatología esperanza en lugar de temor? Apoye su respuesta desde la enseñanza de Pablo.",
      kw_en: ["hope", "fear", "comfort", "Paul", "victory", "deliverance", "resurrection", "encourage"],
      kw_es: ["esperanza", "temor", "consuelo", "Pablo", "victoria", "liberación", "resurrección", "animar"],
      modelEn: "The unit argues that, rightly understood, eschatology produces hope rather than fear. Paul's teaching about the end is framed as comfort and encouragement: the Day of the Lord brings deliverance to believers, the dead in Christ will rise, and God will bring His purposes to a glorious consummation. Because the outcome is certain victory and the believer's destiny is deliverance, the future is something to anticipate with confidence rather than dread. Paul directs his readers to encourage one another with these truths, using the hope of Christ's return to strengthen the suffering. Fear belongs to those facing destruction without Christ; for those who are His, the end is rescue and reunion with the Lord. So eschatology functions pastorally, comforting and steadying believers rather than frightening them.",
      modelEs: "La unidad sostiene que, bien entendida, la escatología produce esperanza en lugar de temor. La enseñanza de Pablo sobre el fin se presenta como consuelo y aliento: el Día del Señor trae liberación a los creyentes, los muertos en Cristo resucitarán, y Dios llevará Sus propósitos a una consumación gloriosa. Como el resultado es la victoria segura y el destino del creyente es la liberación, el futuro es algo que se anticipa con confianza y no con pavor. Pablo dirige a sus lectores a animarse unos a otros con estas verdades, usando la esperanza del regreso de Cristo para fortalecer a los que sufren. El temor pertenece a quienes enfrentan la destrucción sin Cristo; para los que son suyos, el fin es rescate y reunión con el Señor. Así que la escatología funciona pastoralmente, consolando y afirmando a los creyentes en lugar de asustarlos." },

    { textEn: "27. What were the three questions the disciples asked in Matthew 24, and how did Jesus respond to them?",
      textEs: "27. ¿Cuáles fueron las tres preguntas que hicieron los discípulos en Mateo 24, y cómo respondió Jesús a ellas?",
      kw_en: ["three questions", "Temple", "return", "sign", "age", "Matthew 24", "readiness", "answered"],
      kw_es: ["tres preguntas", "Templo", "regreso", "señal", "edad", "Mateo 24", "preparación", "respondió"],
      modelEn: "The unit identifies three questions the disciples asked in Matthew 24: when the Temple would be destroyed, when Jesus would return, and what would be the sign of the end of the age. Jesus answered them by weaving the near and far horizons together rather than giving a simple date-by-date schedule. He spoke of coming events and warnings, but His emphasis fell on watchfulness and readiness rather than precise timing, returning again to the truth that no one knows the day or hour. So His response was less a calendar than a call: He addressed their curiosity about events but redirected them toward faithful, alert living. The three questions show the disciples wanted information; Jesus' answer shows He wanted them prepared, which is the consistent thrust of the unit's treatment of the end.",
      modelEs: "La unidad identifica tres preguntas que hicieron los discípulos en Mateo 24: cuándo sería destruido el Templo, cuándo regresaría Jesús, y cuál sería la señal del fin de la edad. Jesús las respondió entretejiendo los horizontes cercano y lejano en lugar de dar un calendario simple fecha por fecha. Habló de eventos venideros y advertencias, pero Su énfasis recayó en la vigilancia y la preparación más que en el tiempo preciso, volviendo de nuevo a la verdad de que nadie sabe el día ni la hora. Así que Su respuesta fue menos un calendario que un llamado: atendió su curiosidad sobre los eventos pero los redirigió hacia una vida fiel y alerta. Las tres preguntas muestran que los discípulos querían información; la respuesta de Jesús muestra que Él los quería preparados, que es el énfasis constante del tratamiento que la unidad hace del fin." },

    { textEn: "28. Evaluate the statement: \"Eschatology is not about charts, it's about character.\" What does this mean?",
      textEs: "28. Evalúe la afirmación: \"La escatología no se trata de diagramas, se trata del carácter.\" ¿Qué significa esto?",
      kw_en: ["charts", "character", "speculation", "holiness", "living", "readiness", "transform", "purpose"],
      kw_es: ["diagramas", "carácter", "especulación", "santidad", "vivir", "preparación", "transformar", "propósito"],
      modelEn: "The statement captures the unit's central conviction about the end. To make eschatology about charts is to reduce it to diagrams, timelines, and speculation over the sequence of future events. To make it about character is to recognize that its real purpose is to shape how believers live now. The Bible's teaching on the end aims at readiness, hope, watchfulness, and holiness, not at satisfying curiosity about dates. So the statement is largely right: while there is genuine content to learn, the danger is treating eschatology as a puzzle to solve rather than a summons to be transformed. Knowing that Christ will return and that God will consummate His kingdom should produce faithful, expectant, holy lives. The proper test of one's eschatology is therefore not the cleverness of one's chart but the character it produces.",
      modelEs: "La afirmación capta la convicción central de la unidad sobre el fin. Hacer de la escatología un asunto de diagramas es reducirla a esquemas, cronogramas y especulación sobre la secuencia de eventos futuros. Hacerla un asunto de carácter es reconocer que su verdadero propósito es moldear cómo viven los creyentes ahora. La enseñanza bíblica sobre el fin apunta a la preparación, la esperanza, la vigilancia y la santidad, no a satisfacer la curiosidad sobre fechas. Así que la afirmación es en gran medida correcta: aunque hay contenido genuino que aprender, el peligro es tratar la escatología como un rompecabezas por resolver en lugar de un llamado a ser transformado. Saber que Cristo regresará y que Dios consumará Su reino debe producir vidas fieles, expectantes y santas. La verdadera prueba de la escatología de uno no es, por tanto, lo ingenioso de su diagrama sino el carácter que produce." },

    { textEn: "29. Why did early Christians refuse to say \"Caesar is Lord,\" and what does this teach about Christian allegiance?",
      textEs: "29. ¿Por qué se negaron los primeros cristianos a decir \"César es Señor,\" y qué enseña esto sobre la lealtad cristiana?",
      kw_en: ["Caesar", "Lord", "Jesus", "allegiance", "refused", "religious", "worship", "ultimate"],
      kw_es: ["César", "Señor", "Jesús", "lealtad", "negaron", "religioso", "adoración", "última"],
      modelEn: "The unit explains that early Christians were required to say \"Caesar is Lord\" once a year to prove their loyalty, but this was not merely a political gesture; it was religious, a claim of ultimate allegiance. Christians refused, declaring instead that Jesus Christ is Lord. They could honor the state in its proper place, but they would not give to Caesar the supreme allegiance that belongs to Christ alone. This teaches that the believer's ultimate loyalty is to Jesus, not to any earthly ruler or nation, and that there is a line beyond which obedience to human authority cannot go. When a government demands the worship and total allegiance owed only to God, the Christian must refuse, even at great cost. Their stand shows that confessing Jesus as Lord reorders every other loyalty beneath Him.",
      modelEs: "La unidad explica que a los primeros cristianos se les exigía decir \"César es Señor\" una vez al año para probar su lealtad, pero esto no era un mero gesto político; era religioso, una pretensión de lealtad última. Los cristianos se negaron, declarando en cambio que Jesucristo es Señor. Podían honrar al Estado en su lugar propio, pero no daban al César la lealtad suprema que pertenece solo a Cristo. Esto enseña que la lealtad última del creyente es a Jesús, no a ningún gobernante o nación terrenal, y que hay una línea más allá de la cual la obediencia a la autoridad humana no puede ir. Cuando un gobierno exige la adoración y la lealtad total que se deben solo a Dios, el cristiano debe negarse, aun a gran costo. Su postura muestra que confesar a Jesús como Señor reordena toda otra lealtad debajo de Él." },

    { textEn: `30. Summarize the main point of Unit ${UNIT}. How should eschatology affect daily life?`,
      textEs: `30. Resuma el punto principal de la Unidad ${UNIT}. ¿Cómo debe afectar la escatología la vida diaria?`,
      kw_en: ["readiness", "hope", "watchfulness", "character", "return", "daily", "faithful", "unity"],
      kw_es: ["preparación", "esperanza", "vigilancia", "carácter", "regreso", "diaria", "fiel", "unidad"],
      modelEn: "The main point of the unit is that the doctrine of last things is meant to produce readiness, hope, and faithful character rather than speculation. Jesus withheld a timeline and emphasized watchfulness; Paul presented the end as comfort and deliverance; and the millennial views, though they differ, agree that Christ will return bodily and God will consummate His kingdom. Eschatology should therefore affect daily life by keeping believers alert and prepared, filling them with hope rather than fear, and shaping holy character now. It also reorders allegiance, as the early Christians showed by refusing to call Caesar Lord, putting loyalty to Christ above every earthly power. So the certainty of Christ's return is not a riddle to decode but a motivation to live each day faithfully, expectantly, and in unity, ready to meet the Lord whenever He comes.",
      modelEs: "El punto principal de la unidad es que la doctrina de las últimas cosas está destinada a producir preparación, esperanza y carácter fiel en lugar de especulación. Jesús ocultó un cronograma y enfatizó la vigilancia; Pablo presentó el fin como consuelo y liberación; y las visiones milenarias, aunque difieren, concuerdan en que Cristo regresará corporalmente y Dios consumará Su reino. La escatología debe, por tanto, afectar la vida diaria manteniendo a los creyentes alerta y preparados, llenándolos de esperanza en lugar de temor, y moldeando un carácter santo ahora. También reordena la lealtad, como mostraron los primeros cristianos al negarse a llamar Señor al César, poniendo la lealtad a Cristo por encima de todo poder terrenal. Así que la certeza del regreso de Cristo no es un acertijo por descifrar sino una motivación para vivir cada día fielmente, con expectación y en unidad, listos para encontrarnos con el Señor cuando venga." }
];

// ---------- Mid-exam state save/restore ----------
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

// ---------- Lockout check & UI ----------
function checkLockouts() {
    const submitBtn = document.getElementById('submitExamBtn');
    const result = document.getElementById('examResult');
    const notice = document.getElementById('mcBankedNotice');
    const isEs = document.body.classList.contains('lang-es');
    const now = Date.now();
    const fullLock = parseInt(localStorage.getItem(FULL_LOCK_KEY) || '0', 10);
    const saLock = parseInt(localStorage.getItem(SA_LOCK_KEY) || '0', 10);

    // Already passed entire unit
    if (unitPassed) {
        submitBtn.disabled = true;
        result.innerHTML = isEs
            ? `<span style='color:#1f6b3b'>✓ Unidad ya aprobada. Haga clic en Unidad ${UNIT + 1} arriba.</span>`
            : `<span style='color:green'>✓ Unit already passed! Click Unit ${UNIT + 1} above.</span>`;
        notice.style.display = 'none';
        return true;
    }
    // Full unit lockout
    if (now < fullLock) {
        const m = Math.ceil((fullLock - now) / 60000);
        submitBtn.disabled = true;
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>📖 Tome unos minutos para repasar la lección de arriba, y luego intente de nuevo. Puede reintentar en ${m} minuto(s). ¡Usted puede lograrlo!</span>`
            : `<span style='color:#8a1f1f'>📖 Take a few minutes to review the lesson above, then try again. You can retry in ${m} minute(s) — you've got this!</span>`;
        notice.style.display = 'none';
        setTimeout(checkLockouts, 30000);
        return false;
    }
    // MC banked, SA-only lockout
    if (mcPreviouslyPassed && now < saLock) {
        const m = Math.ceil((saLock - now) / 60000);
        submitBtn.disabled = true;
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>📖 Opción múltiple aprobada y guardada. Repase la lección y las respuestas modelo, y reintente la sección de respuesta corta en ${m} minuto(s). ¡Siga adelante!</span>`
            : `<span style='color:#8a1f1f'>📖 Multiple-choice passed and saved. Review the lesson and model answers, then retry the short-answer section in ${m} minute(s). Keep going!</span>`;
        notice.style.display = 'none';
        setTimeout(checkLockouts, 30000);
        return false;
    }
    // MC banked, no lockout active — show notice
    submitBtn.disabled = false;
    if (mcPreviouslyPassed) {
        notice.style.display = 'block';
        notice.innerHTML = isEs
            ? "✓ MC ya aprobado y guardado. Solo necesita reenviar la sección de respuesta corta (9/10)."
            : "✓ MC already passed and banked. Only need to resubmit the short-answer section (9/10).";
    } else {
        notice.style.display = 'none';
    }
    return true;
}

// ---------- Render ----------
function renderQuestions() {
    const container = document.getElementById('questionsContainer');
    if (!container) return;
    container.innerHTML = '';
    currentLang = document.body.classList.contains('lang-en') ? 'en' : 'es';

    // MC section
    const mcTitle = document.createElement('h3');
    mcTitle.innerHTML = currentLang === 'en' ? 'Multiple Choice (Questions 1–20)' : 'Opción Múltiple (Preguntas 1–20)';
    container.appendChild(mcTitle);

    if (mcPreviouslyPassed) {
        const banked = document.createElement('div');
        banked.className = 'feedback-text correct';
        banked.style.marginBottom = '15px';
        banked.innerHTML = currentLang === 'en'
            ? '✓ Multiple-choice section previously passed. Your answers are preserved below for reference; you may proceed directly to the short-answer section.'
            : '✓ Sección de opción múltiple ya aprobada. Sus respuestas se conservan abajo para referencia; puede pasar directamente a la sección de respuesta corta.';
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

    // SA section
    const kwTitle = document.createElement('h3');
    kwTitle.style.marginTop = '30px';
    kwTitle.innerHTML = currentLang === 'en' ? 'Short Answer (21–30) — M.Div. / Th.M. Track' : 'Respuesta Corta (21–30) — M.Div. / Th.M.';
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
        // Container that will hold the model ("teaching") answer once revealed
        const modelBox = document.createElement('div');
        modelBox.className = 'model-answer';
        modelBox.style.display = 'none';
        checkBtn.onclick = function() {
            const ans = (ta.value || '').trim().toLowerCase();
            const kws = currentLang === 'es' ? q.kw_es : q.kw_en;
            if (ans.length < 100) {
                fb.className = 'feedback-text incorrect';
                fb.innerHTML = currentLang === 'en' ? 'Please write your own answer first — at least a few sentences (about 100 characters) — then check it against the model answer below.' : 'Escriba primero su propia respuesta — al menos unas cuantas oraciones (unos 100 caracteres) — luego compárela con la respuesta modelo abajo.';
                return;
            }
            const hits = kws.filter(kw => ans.indexOf(kw.toLowerCase()) !== -1);
            // Encouraging, non-punitive feedback — this is a teaching exercise, not a gate
            fb.className = 'feedback-text correct';
            if (hits.length >= 3) {
                fb.innerHTML = currentLang === 'en'
                    ? `✓ Well done — your answer touches ${hits.length} of the lesson's key ideas. Now compare it with the model answer below to deepen your understanding.`
                    : `✓ Muy bien — su respuesta toca ${hits.length} de las ideas clave de la lección. Ahora compárela con la respuesta modelo abajo para profundizar su comprensión.`;
            } else {
                fb.innerHTML = currentLang === 'en'
                    ? `Good effort — you have begun the answer. Read the model answer below and notice the key ideas you might add. This is how we learn; there is no penalty.`
                    : `Buen esfuerzo — ha comenzado la respuesta. Lea la respuesta modelo abajo y note las ideas clave que podría añadir. Así aprendemos; no hay penalización.`;
            }
            // Reveal the model (teaching) answer
            const model = currentLang === 'en' ? (q.modelEn || '') : (q.modelEs || '');
            if (model) {
                modelBox.style.display = 'block';
                modelBox.innerHTML = (currentLang === 'en'
                    ? '<strong>Model answer — study this:</strong> '
                    : '<strong>Respuesta modelo — estúdiela:</strong> ') + model;
            }
        };
        div.appendChild(checkBtn);
        div.appendChild(fb);
        div.appendChild(modelBox);
        container.appendChild(div);
        ta.addEventListener('input', e => { kwAnswers[idx] = e.target.value; saveState(); });
    });
}

// ---------- Submit ----------
function gradeMC() {
    let c = 0;
    for (let i = 0; i < 20; i++) {
        if (mcAnswers[i] === String.fromCharCode(65 + mcQuestions[i].correct)) c++;
    }
    return c;
}

// kwHit: short keywords (<=4 chars) match as whole words; longer keywords match
// as a left-boundary prefix (so intentional stems like 'medita','sacrific' still
// catch inflections, while 'no'/'ed'/'og' no longer match inside longer words).
// Word chars include accented Spanish letters.
function kwHit(ans, k){
  k = (k||'').toLowerCase();
  if(!k) return false;
  var WC = '0-9a-z\\u00e1\\u00e9\\u00ed\\u00f3\\u00fa\\u00f1\\u00fc';
  var esc = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  var pat = (k.length <= 4)
    ? '(?:^|[^'+WC+'])'+esc+'(?![' + WC + '])'
    : '(?:^|[^'+WC+'])'+esc;
  try { return new RegExp(pat, 'i').test(ans); }
  catch(e){ return ans.indexOf(k) !== -1; }
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

// Masters-level = M.Div. OR Th.M. Both are graded on MC AND SA.
// Grading must route through this, never through a bare M.Div. check.
function isMastersLevel(track) {
    return track === 'mdiv' || track === 'thm';
}

function submitExam() {
    if (!checkLockouts()) return;
    if (unitPassed) return;

    const student = JSON.parse(localStorage.getItem('cts_student') || 'null');
    if (!student || !student.name) {
        alert(currentLang === 'en' ? 'Please register first.' : 'Por favor regístrese primero.');
        return;
    }
    const isEs = document.body.classList.contains('lang-es');
    const track = student.track || 'certificate';
    const result = document.getElementById('examResult');

    const mcScore = mcPreviouslyPassed ? 20 : gradeMC();
    const mcOk = mcScore >= 18;
    if (!mcPreviouslyPassed) { mcRevealed = true; renderQuestions(); }

    // ----- Certificate / non-Masters track: MC only, 18/20 -----
    // Masters-level (M.Div. OR Th.M.) routes through isMastersLevel() below.
    if (!isMastersLevel(track)) {
        if (mcOk) {
            progress[`unit${UNIT}`] = true;
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
            localStorage.setItem(MC_PASS_KEY, 'true');
            mcPreviouslyPassed = true;
            unitPassed = true;
            result.innerHTML = isEs
                ? `<span style='color:#1f6b3b'>✓ ¡APROBADO! ${mcScore}/20. Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.</span>`
                : `<span style='color:green'>✓ PASSED! ${mcScore}/20. Your answers are marked below. Review them, then use the button at the top to continue.</span>`;
            document.getElementById('nextUnitBtn').disabled = false;
            updateProgressGrid();
        } else {
            localStorage.setItem(FULL_LOCK_KEY, String(Date.now() + lockMinutes() * 60 * 1000));
            result.innerHTML = isEs
                ? `<span style='color:#8a1f1f'>Obtuvo ${mcScore}/20 (se necesitan 18 para aprobar). ¡Está cerca, no se desanime! Repase la lección de arriba, y vuelva a intentarlo en ${lockMinutes()} minuto(s). Las explicaciones de las respuestas abajo muestran qué estudiar.</span>`
                : `<span style='color:#8a1f1f'>You scored ${mcScore}/20 (18 needed to pass). You're close — don't be discouraged! Review the lesson above, then try again in ${lockMinutes()} minute(s). The answer explanations below show what to study.</span>`;
            checkLockouts();
        }
        return;
    }

    // ----- Masters track (M.Div. or Th.M.): MC + SA, both 90% independent -----
    const saScore = gradeSA();
    const saOk = saScore >= 9;

    // Case A: MC was already banked from a prior attempt → only SA matters now
    if (mcPreviouslyPassed) {
        if (saOk) {
            progress[`unit${UNIT}`] = true;
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
            unitPassed = true;
            result.innerHTML = isEs
                ? `<span style='color:#1f6b3b'>✓ ¡APROBADO! MC ✓ banco + SA ${saScore}/10. Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.</span>`
                : `<span style='color:green'>✓ PASSED! MC ✓ banked + SA ${saScore}/10. Your answers are marked below. Review them, then use the button at the top to continue.</span>`;
            document.getElementById('nextUnitBtn').disabled = false;
            updateProgressGrid();
        } else {
            localStorage.setItem(SA_LOCK_KEY, String(Date.now() + lockMinutes() * 60 * 1000));
            result.innerHTML = isEs
                ? `<span style='color:#8a1f1f'>Su aprobación de opción múltiple está a salvo. Respuesta corta: ${saScore}/10 (se necesitan 9). Buen esfuerzo — repase la lección y las respuestas modelo abajo, y vuelva a intentar la sección de respuesta corta en ${lockMinutes()} minuto(s).</span>`
                : `<span style='color:#8a1f1f'>Your multiple-choice pass is safe. Short answer: ${saScore}/10 (9 needed). Good effort — review the lesson and the model answers below, then try the short-answer section again in ${lockMinutes()} minute(s).</span>`;
            checkLockouts();
        }
        return;
    }

    // Case B: First-time M.Div submission
    if (mcOk && saOk) {
        progress[`unit${UNIT}`] = true;
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
        localStorage.setItem(MC_PASS_KEY, 'true');
        mcPreviouslyPassed = true;
        unitPassed = true;
        result.innerHTML = isEs
            ? `<span style='color:#1f6b3b'>✓ ¡APROBADO! MC ${mcScore}/20 + SA ${saScore}/10. Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.</span>`
            : `<span style='color:green'>✓ PASSED! MC ${mcScore}/20 + SA ${saScore}/10. Your answers are marked below. Review them, then use the button at the top to continue.</span>`;
        document.getElementById('nextUnitBtn').disabled = false;
        updateProgressGrid();
    } else if (mcOk && !saOk) {
        // MC banked; SA-only lockout (the central retrofit feature)
        localStorage.setItem(MC_PASS_KEY, 'true');
        mcPreviouslyPassed = true;
        localStorage.setItem(SA_LOCK_KEY, String(Date.now() + lockMinutes() * 60 * 1000));
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>MC ${mcScore}/20 ✓ aprobado y guardado. SA ${saScore}/10 (se requiere 9). Sección SA bloqueada 15 min. Al desbloquear, reenvíe solo la SA — el MC permanece aprobado.</span>`
            : `<span style='color:#8a1f1f'>MC ${mcScore}/20 ✓ passed and banked. SA ${saScore}/10 (need 9). SA section locked 15 min. When unlocked, resubmit SA only — MC stays passed.</span>`;
        checkLockouts();
    } else {
        // MC failed → full unit lockout regardless of SA
        localStorage.setItem(FULL_LOCK_KEY, String(Date.now() + lockMinutes() * 60 * 1000));
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>✗ Reprobado: MC ${mcScore}/20 + SA ${saScore}/10 (se requiere 18 y 9). Unidad bloqueada 15 minutos.</span>`
            : `<span style='color:#8a1f1f'>✗ Failed: MC ${mcScore}/20 + SA ${saScore}/10 (need 18 and 9). Unit locked 15 minutes.</span>`;
        checkLockouts();
    }
}

// ---------- Reset ----------
function resetUnit() {
    const isEs = document.body.classList.contains('lang-es');
    const msg = isEs
        ? '¿Reiniciar esta unidad?\n\nEsto borrará: respuestas en progreso, estado MC aprobado, todos los bloqueos, y el indicador de aprobación de esta unidad.\n\nEl contenido docente permanece. Esta acción no se puede deshacer.'
        : 'Reset this unit?\n\nThis will clear: in-progress answers, MC-passed state, all lockouts, and this unit\'s pass flag.\n\nTeaching content stays. This cannot be undone.';
    if (!confirm(msg)) return;
    localStorage.removeItem(STATE_KEY);
    localStorage.removeItem(MC_PASS_KEY);
    localStorage.removeItem(SA_LOCK_KEY);
    localStorage.removeItem(FULL_LOCK_KEY);
    delete progress[`unit${UNIT}`];
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    // Clear in-memory state directly so the screen resets even if reload is
    // blocked (e.g. in a sandboxed preview). Re-render from the cleared state.
    mcAnswers = new Array(20).fill(null);
    kwAnswers = new Array(10).fill("");
    mcPreviouslyPassed = false;
    renderQuestions();
    try { location.reload(); } catch (e) { /* preview may block reload; screen already reset */ }
}

// ---------- Wire & init ----------
document.getElementById('submitExamBtn').onclick = submitExam;
document.getElementById('resetExamBtn').onclick = resetUnit;
renderQuestions();
checkLockouts();
