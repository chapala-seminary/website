/* Exam engine for CTSRev (shared by 1 unit page).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/rev/unitN.js. */
// =====================================================================
// CTS Revelation Intensive — Unit 12 (The Millennial Views: Postmillennialism, Revelation 20)
// Built on Cook's validated masters engine (from ST11) with two upgrades:
//   (1) per-question Check Answer now uses smart kwHit (was raw indexOf)
//   (2) storage hardening: lsGet/lsSet/lsDel with in-memory _ctsMem fallback
//       (so the engine survives Android content:// browsers that block
//        localStorage).
// Implements: cts_track gating, MC-pass persists, SA-only lockout on
// partial failure, split kw_en/kw_es, mid-exam save/restore, Reset,
// 3s auto-redirect on pass.
// =====================================================================


const COURSE = 'rev';

const totalUnits = 15;
let currentUnit = UNIT;

// ---------- Storage hardening (Android content:// fallback) ----------
var _ctsMem = {};
function lsGet(k){ try { return localStorage.getItem(k); } catch(e){ return (k in _ctsMem) ? _ctsMem[k] : null; } }
function lsSet(k,v){ try { localStorage.setItem(k,v); } catch(e){ _ctsMem[k] = String(v); } }
function lsDel(k){ try { localStorage.removeItem(k); } catch(e){ delete _ctsMem[k]; } }

// localStorage keys
const STATE_KEY     = `cts_${COURSE}_u${UNIT}_state`;
const MC_PASS_KEY   = `cts_${COURSE}_u${UNIT}_mc_passed`;
const SA_LOCK_KEY   = `cts_${COURSE}_u${UNIT}_sa_lock`;
const FULL_LOCK_KEY = `cts_${COURSE}_u${UNIT}_full_lock`;
const PROGRESS_KEY  = `cts_${COURSE}_progress`;

function lockMinutes() {
    try {
        const t = (JSON.parse(lsGet('cts_student') || 'null') || {}).track;
        return (t === 'mdiv' || t === 'thm') ? 15 : 2;
    } catch (e) { return 2; }
}


try { progress = JSON.parse(lsGet(PROGRESS_KEY) || '{}'); } catch(e) { progress = {}; }
let unitPassed = !!progress[`unit${UNIT}`];
let mcPreviouslyPassed = lsGet(MC_PASS_KEY) === 'true';



function updateProgressGrid() {
    const grid = document.getElementById('progressGrid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 1; i <= totalUnits; i++) {
        let cls = '';
        if (progress[`unit${i}`]) cls = 'completed';
        if (i === currentUnit) cls += ' active';
        grid.innerHTML += `<a href="CTSRevUnit${i}.html" class="${cls}" title="${unitTitlesEn[i-1]}">${i}</a>`;
    }
    if (progress[`unit${UNIT}`]) document.getElementById('nextUnitBtn').disabled = false;
}
document.getElementById('nextUnitBtn').onclick = () => { location.href = NEXT_UNIT_URL; };
updateProgressGrid();

function displayStudentGreeting() {
    const student = JSON.parse(lsGet('cts_student') || 'null');
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
    lsSet('cts_student', JSON.stringify(student));
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

// MC answer key distribution audited: A=B=C=D=5 (verified by build script)


const kwQuestions = [{"textEn": "21. What does postmillennialism hold about the millennium and the return of Christ?", "textEs": "21. ¿Qué sostiene el postmilenialismo acerca del milenio y el regreso de Cristo?", "kw_en": ["postmillennialism", "after", "millennium", "golden", "gospel", "triumph", "before", "christianized"], "kw_es": ["postmilenialismo", "después", "milenio", "oro", "evangelio", "triunfo", "antes", "cristianizado"], "modelEn": "The word postmillennialism means after the millennium, for in this view Christ returns after the millennial age. Postmillennialism teaches that the thousand years describe a coming, or an already begun and growing, golden age in which the gospel triumphs throughout the world before Christ returns. Through the ordinary preaching of the gospel and the work of the Holy Spirit, the nations will be so widely converted, and Christian influence will so pervade the world, that a long era of peace, righteousness, and the knowledge of God will prevail. Christ reigns now from heaven through His Word and Spirit, and that reign will grow until the world is largely Christianized. Only after this golden age does Christ return in person. Postmillennialism is therefore marked by hope and confidence about the real success of the gospel within this present age of history, expecting the kingdom to advance until the world is won before the King appears.", "modelEs": "La palabra postmilenialismo significa después del milenio, pues en esta vista Cristo regresa después de la edad milenial. El postmilenialismo enseña que los mil años describen una edad de oro venidera, o ya comenzada y creciente, en la cual el evangelio triunfa por todo el mundo antes de que Cristo regrese. Por medio de la predicación ordinaria del evangelio y la obra del Espíritu Santo, las naciones serán tan ampliamente convertidas, y la influencia cristiana penetrará tanto el mundo, que prevalecerá una larga era de paz, justicia, y conocimiento de Dios. Cristo reina ahora desde el cielo por su Palabra y Espíritu, y ese reinado crecerá hasta que el mundo sea en gran parte cristianizado. Solo después de esta edad de oro regresa Cristo en persona. El postmilenialismo se caracteriza por tanto por la esperanza y la confianza en el éxito real del evangelio dentro de esta presente edad, esperando que el reino avance hasta que el mundo sea ganado antes de que aparezca el Rey."}, {"textEn": "22. Describe the postmillennial order of events.", "textEs": "22. Describa el orden postmilenial de los acontecimientos.", "kw_en": ["gospel", "kingdom", "millennium", "golden", "return", "resurrection", "judgment", "after"], "kw_es": ["evangelio", "reino", "milenio", "oro", "regreso", "resurrección", "juicio", "después"], "modelEn": "In postmillennialism the sequence runs in this order. First comes the present gospel age, in which the kingdom of Christ grows like a seed. This grows into the millennium itself, a long golden age of gospel triumph and worldwide Christian influence, during which Christ reigns spiritually over a Christianized world and Satan's power to deceive the nations is held back. Near the very end, many postmillennialists allow for a brief final apostasy or rebellion, the loosing of Satan for a little while. Then comes the bodily return of Christ, followed by the general resurrection of the righteous and the wicked together, the final judgment at the great white throne, and the new heaven and new earth. The single distinctive that gives the view its name is the placing of Christ's return after the millennium, and the conviction that the golden age is brought about through the ordinary means of grace rather than by Christ's visible reign on the earth.", "modelEs": "En el postmilenialismo la secuencia corre en este orden. Primero viene la presente edad del evangelio, en la cual el reino de Cristo crece como una semilla. Esto crece hasta el milenio mismo, una larga edad de oro de triunfo del evangelio e influencia cristiana mundial, durante la cual Cristo reina espiritualmente sobre un mundo cristianizado y el poder de Satanás para engañar a las naciones es contenido. Cerca del fin mismo, muchos postmilenialistas admiten una breve apostasía o rebelión final, el soltar de Satanás por un poco de tiempo. Entonces viene el regreso corporal de Cristo, seguido por la resurrección general de los justos y los impíos juntos, el juicio final en el gran trono blanco, y el nuevo cielo y la nueva tierra. El único rasgo distintivo que da su nombre a la vista es la colocación del regreso de Cristo después del milenio, y la convicción de que la edad de oro se logra por los medios ordinarios de gracia y no por el reinado visible de Cristo en la tierra."}, {"textEn": "23. Summarize the biblical case postmillennialists make.", "textEs": "23. Resuma el caso bíblico que hacen los postmilenialistas.", "kw_en": ["commission", "nations", "mustard", "leaven", "psalms", "prophets", "knowledge", "reign"], "kw_es": ["comisión", "naciones", "mostaza", "levadura", "salmos", "profetas", "conocimiento", "reinar"], "modelEn": "Postmillennialists build their case from passages that promise the gospel real and growing success. They point to the Great Commission, in which the risen Christ claims all authority and sends the church to disciple all the nations, promising His presence to the end of the age. They cite the parables of the kingdom's irresistible growth, the mustard seed that becomes a great tree and the leaven that works through the whole lump. They appeal to the royal psalms that give the Messiah the nations as His inheritance and dominion to the ends of the earth. They turn to the prophets, who foresaw the mountain of the LORD exalted and the earth full of the knowledge of the LORD as the waters cover the sea, and to Daniel's stone that becomes a mountain and fills the whole earth. And they cite Paul's word that Christ must reign till He has put all enemies under His feet. Taken together, they argue, Scripture promises not merely a remnant rescued from a failing world, but the gospel triumphing in history before the end.", "modelEs": "Los postmilenialistas edifican su caso a partir de pasajes que prometen al evangelio un éxito real y creciente. Señalan la Gran Comisión, en la cual el Cristo resucitado reclama toda autoridad y envía a la iglesia a hacer discípulos a todas las naciones, prometiendo su presencia hasta el fin del mundo. Citan las parábolas del crecimiento irresistible del reino, el grano de mostaza que se hace un gran árbol y la levadura que obra por toda la masa. Apelan a los salmos reales que dan al Mesías las naciones por herencia y dominio hasta los confines de la tierra. Acuden a los profetas, que previeron el monte del SEÑOR exaltado y la tierra llena del conocimiento del SEÑOR como las aguas cubren el mar, y a la piedra de Daniel que se hace un monte y llena toda la tierra. Y citan la palabra de Pablo de que Cristo debe reinar hasta poner a todos sus enemigos debajo de sus pies. En conjunto, argumentan, la Escritura promete no meramente un remanente rescatado de un mundo en ruina, sino el evangelio triunfando en la historia antes del fin."}, {"textEn": "24. How does postmillennialism read Revelation 20 — the thousand years, the binding of Satan, and the first resurrection?", "textEs": "24. ¿Cómo lee el postmilenialismo Apocalipsis 20 — los mil años, el atar de Satanás, y la primera resurrección?", "kw_en": ["thousand", "indefinite", "triumph", "binding", "deceive", "resurrection", "spiritual", "faithful"], "kw_es": ["mil", "indefinido", "triunfo", "atar", "engañar", "resurrección", "espiritual", "fieles"], "modelEn": "Reading Revelation with sensitivity to its symbols, postmillennialists understand the thousand years as a long, indefinite period rather than a literal span of exactly one thousand calendar years, a time in which the gospel triumphs and Christ reigns spiritually over a Christianized world. The binding of Satan they take as the restraining of his power to deceive the nations as the gospel advances; the strong man is bound so that the peoples can no longer be held in the darkness that gripped them before the gospel went out. The first resurrection they understand spiritually, as the reign of the souls of the faithful with Christ and the triumph of their cause, rather than as a bodily rising from the grave. On this reading, Revelation 20 pictures the present age moving toward its full flowering, after which Satan is loosed for a little while, and then come the return of Christ and the final judgment described in the closing verses. For postmillennialism the millennium and the church age are the same growing reality.", "modelEs": "Leyendo Apocalipsis con sensibilidad a sus símbolos, los postmilenialistas entienden los mil años como un período largo e indefinido más que como un lapso literal de exactamente mil años de calendario, un tiempo en el cual el evangelio triunfa y Cristo reina espiritualmente sobre un mundo cristianizado. El atar de Satanás lo toman como la contención de su poder para engañar a las naciones a medida que el evangelio avanza; el hombre fuerte es atado para que los pueblos ya no puedan ser retenidos en las tinieblas que los dominaban antes de que saliera el evangelio. La primera resurrección la entienden espiritualmente, como el reinado de las almas de los fieles con Cristo y el triunfo de su causa, más que como un levantarse corporal de la tumba. En esta lectura, Apocalipsis 20 retrata la presente edad avanzando hacia su plena flor, después de la cual Satanás es suelto por un poco de tiempo, y entonces vienen el regreso de Cristo y el juicio final descrito en los versículos finales. Para el postmilenialismo el milenio y la edad de la iglesia son la misma realidad creciente."}, {"textEn": "25. Who have been notable proponents of postmillennialism, and when was it most popular?", "textEs": "25. ¿Quiénes han sido proponentes notables del postmilenialismo, y cuándo fue más popular?", "kw_en": ["puritans", "edwards", "hodge", "warfield", "nineteenth", "missionary", "onward", "optimism"], "kw_es": ["puritanos", "edwards", "hodge", "warfield", "diecinueve", "misionero", "adelante", "optimismo"], "modelEn": "Postmillennialism flourished especially among the Puritans and through the eighteenth and nineteenth centuries. Jonathan Edwards looked for a coming age of revival and gospel advance; the Princeton theologians Charles Hodge and Benjamin Warfield held the view, as did many leaders of the great missionary movement of that era, who labored in the confidence that the gospel would conquer the nations. The view was especially popular in the nineteenth century, an age full of optimism and confident that the world was moving onward and upward, and that society would keep improving until at last the millennium arrived. This hope fit naturally with the era's faith in progress and with the rapid spread of missions around the world. So postmillennialism was not a fringe opinion but the widely shared expectation of many of the most earnest and learned Christians of its day, who believed they were watching the kingdom of Christ steadily grow toward its golden age.", "modelEs": "El postmilenialismo floreció especialmente entre los puritanos y durante los siglos dieciocho y diecinueve. Jonathan Edwards esperaba una edad venidera de avivamiento y avance del evangelio; los teólogos de Princeton Charles Hodge y Benjamin Warfield sostuvieron la vista, como también muchos líderes del gran movimiento misionero de aquella era, que trabajaron en la confianza de que el evangelio conquistaría las naciones. La vista fue especialmente popular en el siglo diecinueve, una era llena de optimismo y confiada en que el mundo se movía hacia arriba y adelante, y que la sociedad seguiría mejorando hasta que al fin llegara el milenio. Esta esperanza encajaba naturalmente con la fe de la era en el progreso y con la rápida difusión de las misiones por el mundo. Así el postmilenialismo no era una opinión marginal sino la expectativa ampliamente compartida de muchos de los cristianos más serios y doctos de su día, que creían estar viendo el reino de Cristo crecer sin cesar hacia su edad de oro."}, {"textEn": "26. What changed the climate in the twentieth century, according to the lesson?", "textEs": "26. ¿Qué cambió el clima en el siglo veinte, según la lección?", "kw_en": ["scofield", "dispensational", "premillennialism", "world", "war", "optimism", "shattered", "dominant"], "kw_es": ["scofield", "dispensacional", "premilenialismo", "guerra", "mundial", "optimismo", "destrozó", "dominante"], "modelEn": "Two developments changed the climate in the twentieth century. The first was the spread of the Scofield Reference Bible, published in 1909, which carried dispensational premillennialism into countless homes and pulpits and trained a generation to expect not a golden age but a world growing worse until Christ's sudden return. The second was the First World War, whose horror shattered the easy nineteenth-century confidence that the world was steadily improving onward and upward. The mass slaughter of that war made the optimistic vision of inevitable progress seem hollow. In the wake of these two developments, premillennialism in some form became dominant across much of twentieth-century evangelicalism, and postmillennialism, which had been so widely held, fell out of favor. The lesson notes, however, that postmillennialism did not disappear; it has seen a modern revival among some Reformed writers who again look for the long-term triumph of the gospel in history, even while acknowledging the hard lessons of the past century.", "modelEs": "Dos acontecimientos cambiaron el clima en el siglo veinte. El primero fue la difusión de la Biblia de Referencia de Scofield, publicada en 1909, que llevó el premilenialismo dispensacional a innumerables hogares y púlpitos y entrenó a una generación a esperar no una edad de oro sino un mundo que empeoraba hasta el regreso repentino de Cristo. El segundo fue la Primera Guerra Mundial, cuyo horror destrozó la fácil confianza del siglo diecinueve en que el mundo mejoraba sin cesar hacia arriba y adelante. La matanza masiva de esa guerra hizo que la visión optimista del progreso inevitable pareciera hueca. Tras estos dos acontecimientos, el premilenialismo en alguna forma llegó a ser dominante en gran parte del evangelicalismo del siglo veinte, y el postmilenialismo, que había sido tan ampliamente sostenido, cayó en desfavor. La lección nota, sin embargo, que el postmilenialismo no desapareció; ha visto un renacimiento moderno entre algunos escritores reformados que de nuevo buscan el triunfo a largo plazo del evangelio en la historia, aun reconociendo las duras lecciones del siglo pasado."}, {"textEn": "27. What objections do others raise against postmillennialism?", "textEs": "27. ¿Qué objeciones plantean otros contra el postmilenialismo?", "kw_en": ["apostasy", "increase", "warns", "wars", "christianizing", "figurative", "before", "question"], "kw_es": ["apostasía", "aumentar", "advierte", "guerras", "cristianizando", "figurada", "antes", "cuestionar"], "modelEn": "Those who hold other views raise several objections, and fairness requires that they be heard. First, the New Testament seems to warn that evil and apostasy will increase, not decrease, before the end: it speaks of perilous times in the last days, of deceivers growing worse and worse, of a great falling away and the man of sin, and of days so shortened that, unless cut short, no flesh would be saved. Second, critics say the optimistic form of the view was deeply shaken by the World Wars and the other horrors of the twentieth century, which seemed to contradict the expectation of a steadily improving world. Third, they observe that the world does not appear to be progressively Christianizing. Fourth, they question whether the figurative reading of the thousand years and the first resurrection is justified, and whether Scripture really promises a golden age before Christ's return rather than after it. These objections, taken together, ask whether the hopeful postmillennial picture of history matches what Scripture and experience actually show.", "modelEs": "Los que sostienen otras vistas plantean varias objeciones, y la justicia exige que se escuchen. Primero, el Nuevo Testamento parece advertir que el mal y la apostasía aumentarán, no disminuirán, antes del fin: habla de tiempos peligrosos en los postreros días, de engañadores que van de mal en peor, de una gran apostasía y el hombre de pecado, y de días tan acortados que, si no fueran acortados, ninguna carne sería salva. Segundo, los críticos dicen que la forma optimista de la vista fue profundamente sacudida por las Guerras Mundiales y los demás horrores del siglo veinte, que parecían contradecir la expectativa de un mundo que mejoraba sin cesar. Tercero, observan que el mundo no parece estar cristianizándose progresivamente. Cuarto, cuestionan si la lectura figurada de los mil años y la primera resurrección está justificada, y si la Escritura realmente promete una edad de oro antes del regreso de Cristo y no después. Estas objeciones, en conjunto, preguntan si el esperanzador cuadro postmilenial de la historia corresponde a lo que la Escritura y la experiencia realmente muestran."}, {"textEn": "28. How do postmillennialists respond to those objections?", "textEs": "28. ¿Cómo responden los postmilenialistas a esas objeciones?", "kw_en": ["setbacks", "disprove", "triumph", "gospel", "future", "golden", "history", "reign"], "kw_es": ["reveses", "refutar", "triunfo", "evangelio", "futuro", "oro", "historia", "reinar"], "modelEn": "Postmillennialists offer several replies to these objections. They argue that temporary setbacks, even great and terrible ones, do not disprove the long-term triumph of the gospel, any more than a hard winter disproves the coming of spring. The promised golden age, they say, may still lie in the future, so that the failures of the present age do not refute the hope but simply show that the millennium has not yet arrived. They point out that the New Testament warnings of apostasy can describe particular crises rather than the whole shape of history, and that the same Scriptures also promise the kingdom's growth and Christ's present reign. They stress that Christ already holds all authority and must reign until all His enemies are subdued, which gives ground for confidence that the gospel will yet win the nations. And they insist that a low view of the gospel's power does not honor the King who promised to disciple all nations. So postmillennialists hold their hope not in human progress but in the reigning Christ and the power of His gospel in history.", "modelEs": "Los postmilenialistas ofrecen varias respuestas a estas objeciones. Argumentan que los reveses temporales, aun los grandes y terribles, no refutan el triunfo a largo plazo del evangelio, como tampoco un duro invierno refuta la llegada de la primavera. La edad de oro prometida, dicen, puede estar aún en el futuro, de modo que los fracasos de la presente edad no refutan la esperanza sino que simplemente muestran que el milenio aún no ha llegado. Señalan que las advertencias del Nuevo Testamento sobre la apostasía pueden describir crisis particulares más que la forma entera de la historia, y que las mismas Escrituras también prometen el crecimiento del reino y el presente reinado de Cristo. Destacan que Cristo ya tiene toda autoridad y debe reinar hasta que todos sus enemigos sean sometidos, lo cual da base para confiar en que el evangelio todavía ganará las naciones. E insisten en que un bajo concepto del poder del evangelio no honra al Rey que prometió hacer discípulos a todas las naciones. Así los postmilenialistas tienen su esperanza no en el progreso humano sino en el Cristo que reina y en el poder de su evangelio en la historia."}, {"textEn": "29. What is the strength of postmillennialism, and what do all three millennial views share?", "textEs": "29. ¿Cuál es la fortaleza del postmilenialismo, y qué comparten las tres vistas mileniales?", "kw_en": ["strength", "gospel", "reign", "godly", "favors", "return", "judge", "hope"], "kw_es": ["fortaleza", "evangelio", "reinado", "piadosos", "favorece", "regreso", "juzgar", "esperanza"], "modelEn": "The great strength of postmillennialism is its high view of the power of the gospel and of the present, active reign of Christ, and its hope that the Great Commission will truly succeed in the world. It honors the King who claims all authority and refuses to expect that His gospel will simply fail. Sincere, godly, orthodox Christians have held this view, among them some of the church's finest theologians, and the course presents it at full strength without endorsing it; it favors no single view. The units that follow present premillennialism and amillennialism with the very same fairness, so that students may weigh the views for themselves. What all three views share, and what matters most of all, is the certain hope that the Lord Jesus Christ will return in glory, raise the dead, judge the world in righteousness, and make all things new. On that great hope the whole church stands together, however its members may differ on the nature and timing of the thousand years.", "modelEs": "La gran fortaleza del postmilenialismo es su alto concepto del poder del evangelio y del presente y activo reinado de Cristo, y su esperanza de que la Gran Comisión realmente tendrá éxito en el mundo. Honra al Rey que reclama toda autoridad y rehúsa esperar que su evangelio simplemente fracase. Cristianos sinceros, piadosos, y ortodoxos han sostenido esta vista, entre ellos algunos de los más finos teólogos de la iglesia, y el curso la presenta a plena fuerza sin respaldarla; no favorece ninguna vista. Las unidades que siguen presentan el premilenialismo y el amilenialismo con la misma justicia, para que los estudiantes puedan sopesar las vistas por sí mismos. Lo que las tres vistas comparten, y lo que más importa de todo, es la esperanza cierta de que el Señor Jesucristo regresará en gloria, resucitará a los muertos, juzgará al mundo en justicia, y hará nuevas todas las cosas. Sobre esa gran esperanza toda la iglesia está unida, por mucho que sus miembros difieran sobre la naturaleza y el tiempo de los mil años."}, {"textEn": "30. Summarize the central claim of postmillennialism in an even-handed way.", "textEs": "30. Resuma la afirmación central del postmilenialismo de manera imparcial.", "kw_en": ["millennium", "golden", "gospel", "before", "return", "spirit", "godly", "favors"], "kw_es": ["milenio", "oro", "evangelio", "antes", "regreso", "espíritu", "piadosos", "favorece"], "modelEn": "The central claim of postmillennialism is that the millennium of Revelation 20 is a golden age of gospel triumph that comes before the return of Christ, brought about through the preaching of the gospel and the work of the Spirit rather than by Christ's visible presence on the earth. In this view Christ reigns now from heaven, the gospel will so succeed that the world is largely Christianized, and only after that golden age does Christ return for the resurrection and the judgment. The view was especially popular in the optimistic nineteenth century and was weakened in the twentieth by the Scofield Bible and the World Wars, though it has seen a modern revival. Others object that Scripture warns of increasing evil before the end and that the world does not seem to be Christianizing, while postmillennialists reply that setbacks do not disprove the gospel's ultimate triumph. Godly, orthodox Christians hold this view, and the course presents it fairly and favors no single position, since all the views share the certain hope of Christ's return.", "modelEs": "La afirmación central del postmilenialismo es que el milenio de Apocalipsis 20 es una edad de oro de triunfo del evangelio que viene antes del regreso de Cristo, lograda por la predicación del evangelio y la obra del Espíritu más que por la presencia visible de Cristo en la tierra. En esta vista Cristo reina ahora desde el cielo, el evangelio tendrá tal éxito que el mundo será en gran parte cristianizado, y solo después de esa edad de oro regresa Cristo para la resurrección y el juicio. La vista fue especialmente popular en el optimista siglo diecinueve y fue debilitada en el veinte por la Biblia de Scofield y las Guerras Mundiales, aunque ha visto un renacimiento moderno. Otros objetan que la Escritura advierte del aumento del mal antes del fin y que el mundo no parece estar cristianizándose, mientras los postmilenialistas responden que los reveses no refutan el triunfo final del evangelio. Cristianos piadosos y ortodoxos sostienen esta vista, y el curso la presenta con justicia y no favorece ninguna posición, pues todas las vistas comparten la esperanza cierta del regreso de Cristo."}];

// ---------- Mid-exam state save/restore ----------
let currentLang = 'en';
let mcAnswers = new Array(20).fill(null);
let kwAnswers = new Array(10).fill("");
let mcRevealed = false;
try {
    const st = JSON.parse(lsGet(STATE_KEY) || '{}');
    if (Array.isArray(st.mcAnswers) && st.mcAnswers.length === 20) mcAnswers = st.mcAnswers;
    if (Array.isArray(st.kwAnswers) && st.kwAnswers.length === 10) kwAnswers = st.kwAnswers;
} catch(e) {}

function saveState() {
    lsSet(STATE_KEY, JSON.stringify({ mcAnswers, kwAnswers }));
}

// ---------- Lockout check & UI ----------
function checkLockouts() {
    const submitBtn = document.getElementById('submitExamBtn');
    const result = document.getElementById('examResult');
    const notice = document.getElementById('mcBankedNotice');
    const isEs = document.body.classList.contains('lang-es');
    const now = Date.now();
    const fullLock = parseInt(lsGet(FULL_LOCK_KEY) || '0', 10);
    const saLock = parseInt(lsGet(SA_LOCK_KEY) || '0', 10);

    if (unitPassed) {
        submitBtn.disabled = true;
        result.innerHTML = isEs
            ? `<span style='color:#1f6b3b'>✓ Unidad ya aprobada. Haga clic en Unidad ${UNIT + 1} arriba.</span>`
            : `<span style='color:green'>✓ Unit already passed! Click Unit ${UNIT + 1} above.</span>`;
        notice.style.display = 'none';
        return true;
    }
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
    if (mcPreviouslyPassed && now < saLock) {
        const m = Math.ceil((saLock - now) / 60000);
        submitBtn.disabled = true;
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>📖 Opción múltiple aprobada y guardada. Repase la lección y las respuestas modelo, y reintente la sección de respuesta corta en ${m} minuto(s). ¡Siga adelante!</span>`
            : `<span style='color:#8a1f1f'>📖 Multiple choice passed and banked. Review the lesson and the model answers, then retry the short-answer section in ${m} minute(s). Keep going!</span>`;
        if (notice) {
            notice.style.display = 'block';
            notice.innerHTML = isEs
                ? "✓ MC ya aprobado y guardado. Solo necesita reenviar la sección de respuesta corta (9/10)."
                : "✓ MC already passed and banked. Only need to resubmit the short-answer section (9/10).";
        }
        return false;
    }
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
            // Smart kwHit matcher (upgrade over ST11's raw indexOf in the live check)
            const hits = kws.filter(kw => kwHit(ans, kw)).length;
            fb.className = 'feedback-text correct';
            if (hits >= 3) {
                fb.innerHTML = currentLang === 'en'
                    ? `✓ Well done — your answer touches ${hits} of the lesson's key ideas. Now compare it with the model answer below to deepen your understanding.`
                    : `✓ Muy bien — su respuesta toca ${hits} de las ideas clave de la lección. Ahora compárela con la respuesta modelo abajo para profundizar su comprensión.`;
            } else {
                fb.innerHTML = currentLang === 'en'
                    ? `Good effort — you have begun the answer. Read the model answer below and notice the key ideas you might add. This is how we learn; there is no penalty.`
                    : `Buen esfuerzo — ha comenzado la respuesta. Lea la respuesta modelo abajo y note las ideas clave que podría añadir. Así aprendemos; no hay penalización.`;
            }
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
// as a left-boundary prefix (so intentional stems like 'prepar','resurrect' still
// catch inflections, while short keys no longer match inside longer words).
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

function isMastersLevel(track) {
    return track === 'mdiv' || track === 'thm';
}

function submitExam() {
    if (!checkLockouts()) return;
    if (unitPassed) return;

    const student = JSON.parse(lsGet('cts_student') || 'null');
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

    // ----- Certificate track: MC only; SA is ungraded practice -----
    if (!isMastersLevel(track)) {
        if (mcOk) {
            progress[`unit${UNIT}`] = true;
            lsSet(PROGRESS_KEY, JSON.stringify(progress));
            unitPassed = true;
            result.innerHTML = isEs
                ? `<span style='color:#1f6b3b'>✓ ¡APROBADO! MC ${mcScore}/20. Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.</span>`
                : `<span style='color:green'>✓ PASSED! MC ${mcScore}/20. Your answers are marked below. Review them, then use the button at the top to continue.</span>`;
            document.getElementById('nextUnitBtn').disabled = false;
            updateProgressGrid();
        } else {
            lsSet(FULL_LOCK_KEY, String(Date.now() + lockMinutes() * 60 * 1000));
            result.innerHTML = isEs
                ? `<span style='color:#8a1f1f'>MC ${mcScore}/20 (se necesitan 18). Repase la lección y vuelva a intentarlo en ${lockMinutes()} minuto(s).</span>`
                : `<span style='color:#8a1f1f'>MC ${mcScore}/20 (18 needed). Review the lesson and try again in ${lockMinutes()} minute(s).</span>`;
            checkLockouts();
        }
        return;
    }

    // ----- Masters track (M.Div. or Th.M.): MC + SA, both required -----
    const saScore = gradeSA();
    const saOk = saScore >= 9;

    if (mcPreviouslyPassed) {
        if (saOk) {
            progress[`unit${UNIT}`] = true;
            lsSet(PROGRESS_KEY, JSON.stringify(progress));
            unitPassed = true;
            result.innerHTML = isEs
                ? `<span style='color:#1f6b3b'>✓ ¡APROBADO! MC ✓ banco + SA ${saScore}/10. Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.</span>`
                : `<span style='color:green'>✓ PASSED! MC ✓ banked + SA ${saScore}/10. Your answers are marked below. Review them, then use the button at the top to continue.</span>`;
            document.getElementById('nextUnitBtn').disabled = false;
            updateProgressGrid();
        } else {
            lsSet(SA_LOCK_KEY, String(Date.now() + lockMinutes() * 60 * 1000));
            result.innerHTML = isEs
                ? `<span style='color:#8a1f1f'>Su aprobación de opción múltiple está a salvo. Respuesta corta: ${saScore}/10 (se necesitan 9). Buen esfuerzo — repase la lección y las respuestas modelo abajo, y vuelva a intentar la sección de respuesta corta en ${lockMinutes()} minuto(s).</span>`
                : `<span style='color:#8a1f1f'>Your multiple-choice pass is safe. Short answer: ${saScore}/10 (9 needed). Good effort — review the lesson and the model answers below, then try the short-answer section again in ${lockMinutes()} minute(s).</span>`;
            checkLockouts();
        }
        return;
    }

    if (mcOk && saOk) {
        progress[`unit${UNIT}`] = true;
        lsSet(PROGRESS_KEY, JSON.stringify(progress));
        lsSet(MC_PASS_KEY, 'true');
        mcPreviouslyPassed = true;
        unitPassed = true;
        result.innerHTML = isEs
            ? `<span style='color:#1f6b3b'>✓ ¡APROBADO! MC ${mcScore}/20 + SA ${saScore}/10. Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.</span>`
            : `<span style='color:green'>✓ PASSED! MC ${mcScore}/20 + SA ${saScore}/10. Your answers are marked below. Review them, then use the button at the top to continue.</span>`;
        document.getElementById('nextUnitBtn').disabled = false;
        updateProgressGrid();
    } else if (mcOk && !saOk) {
        lsSet(MC_PASS_KEY, 'true');
        mcPreviouslyPassed = true;
        lsSet(SA_LOCK_KEY, String(Date.now() + lockMinutes() * 60 * 1000));
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>MC ${mcScore}/20 ✓ aprobado y guardado. SA ${saScore}/10 (se requiere 9). Sección SA bloqueada ${lockMinutes()} min. Al desbloquear, reenvíe solo la SA — el MC permanece aprobado.</span>`
            : `<span style='color:#8a1f1f'>MC ${mcScore}/20 ✓ passed and banked. SA ${saScore}/10 (need 9). SA section locked ${lockMinutes()} min. When unlocked, resubmit SA only — MC stays passed.</span>`;
        checkLockouts();
    } else {
        lsSet(FULL_LOCK_KEY, String(Date.now() + lockMinutes() * 60 * 1000));
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>✗ Reprobado: MC ${mcScore}/20 + SA ${saScore}/10 (se requiere 18 y 9). Unidad bloqueada ${lockMinutes()} minutos.</span>`
            : `<span style='color:#8a1f1f'>✗ Failed: MC ${mcScore}/20 + SA ${saScore}/10 (need 18 and 9). Unit locked ${lockMinutes()} minutes.</span>`;
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
    lsDel(STATE_KEY);
    lsDel(MC_PASS_KEY);
    lsDel(SA_LOCK_KEY);
    lsDel(FULL_LOCK_KEY);
    delete progress[`unit${UNIT}`];
    lsSet(PROGRESS_KEY, JSON.stringify(progress));
    mcAnswers = new Array(20).fill(null);
    kwAnswers = new Array(10).fill("");
    mcPreviouslyPassed = false;
    unitPassed = false;
    mcRevealed = false;
    renderQuestions();
    try { location.reload(); } catch (e) { /* preview may block reload; screen already reset */ }
}

// ---------- Wire & init ----------
document.getElementById('submitExamBtn').onclick = submitExam;
document.getElementById('resetExamBtn').onclick = resetUnit;
renderQuestions();
checkLockouts();
