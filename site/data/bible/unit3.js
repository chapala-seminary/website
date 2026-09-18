/* CTSBible - unit 3: per-unit configuration and content. */

const UNIT = 3;

const COURSE_PREFIX = 'cts_bible_u3_';

const mcQuestions = [
  { textEn:`Unit 3 completes the "first witness" by turning from the Old Testament to:`, textEs:`La Unidad 3 completa el "primer testigo" pasando del Antiguo Testamento a:`,
    optionsEn:[`The New Testament and the question of the Apocrypha`,`Geography`,`Archaeology`,`The Dead Sea Scrolls`],
    optionsEs:[`El Nuevo Testamento y la cuestión de los apócrifos`,`La geografía`,`La arqueología`,`Los Rollos del Mar Muerto`],
    correct:0, explanationEn:`The first witness (canon) finishes with the NT and the Apocrypha question.`, explanationEs:`El primer testigo (canon) termina con el NT y la cuestión de los apócrifos.` },

  { textEn:`The same principle from Unit 2 governs the NT canon: the books are Scripture because they were:`, textEs:`El mismo principio de la Unidad 2 gobierna el canon del NT: los libros son Escritura porque fueron:`,
    optionsEn:[`Voted in by a council`,`Chosen by an emperor`,`Recognized, not conferred`,`The most popular writings`],
    optionsEs:[`Votados por un concilio`,`Escogidos por un emperador`,`Reconocidos, no conferidos`,`Los escritos más populares`],
    correct:2, explanationEn:`Recognition, not conferral — the church discerned what was already Scripture.`, explanationEs:`Reconocimiento, no conferimiento — la iglesia discernió lo que ya era Escritura.` },

  { textEn:`Which was a mark by which New Testament books were recognized?`, textEs:`¿Cuál fue una marca por la que se reconocieron los libros del Nuevo Testamento?`,
    optionsEn:[`Apostolic origin (written by an apostle or apostolic associate)`,`Written in Latin`,`Approved by Rome's senate`,`Discovered in Egypt`],
    optionsEs:[`Origen apostólico (escrito por un apóstol o asociado apostólico)`,`Escrito en latín`,`Aprobado por el senado de Roma`,`Descubierto en Egipto`],
    correct:0, explanationEn:`Apostolicity was a chief mark of NT canonicity.`, explanationEs:`La apostolicidad fue una marca principal de la canonicidad del NT.` },

  { textEn:`Books like Mark and Luke were received though not written by apostles because they:`, textEs:`Libros como Marcos y Lucas fueron recibidos aunque no fueron escritos por apóstoles porque:`,
    optionsEn:[`Were the longest`,`Were written last`,`Were found together`,`Stood under apostolic authority (Mark with Peter, Luke with Paul)`],
    optionsEs:[`Eran los más largos`,`Se escribieron al final`,`Se hallaron juntos`,`Estaban bajo autoridad apostólica (Marcos con Pedro, Lucas con Pablo)`],
    correct:3, explanationEn:`They wrote under the authority of Peter and Paul.`, explanationEs:`Escribieron bajo la autoridad de Pedro y Pablo.` },

  { textEn:`The handful of NT books discussed before full acceptance (Hebrews, James, 2 Peter, Revelation) are called:`, textEs:`El puñado de libros del NT discutidos antes de su plena aceptación (Hebreos, Santiago, 2 Pedro, Apocalipsis) se llaman:`,
    optionsEn:[`The Gospels`,`The Apocrypha`,`The antilegomena ("spoken against")`,`The Pentateuch`],
    optionsEs:[`Los Evangelios`,`Los apócrifos`,`Los antilegómena ("contradichos")`,`El Pentateuco`],
    correct:2, explanationEn:`Antilegomena = the "spoken against" books, later received.`, explanationEs:`Antilegómena = los libros "contradichos", recibidos después.` },

  { textEn:`An early (c. AD 170) witness to a functioning list of NT books is:`, textEs:`Un testigo temprano (c. 170 d.C.) de una lista funcional de libros del NT es:`,
    optionsEn:[`The Book of Enoch`,`The Muratorian Fragment`,`The Council of Trent`,`The Dead Sea Scrolls`],
    optionsEs:[`El Libro de Enoc`,`El Fragmento Muratoriano`,`El Concilio de Trento`,`Los Rollos del Mar Muerto`],
    correct:1, explanationEn:`The Muratorian Fragment (~170) shows an early functioning list.`, explanationEs:`El Fragmento Muratoriano (~170) muestra una lista funcional temprana.` },

  { textEn:`Athanasius's Festal Letter of AD 367 is notable because it:`, textEs:`La Carta Festal de Atanasio del año 367 d.C. es notable porque:`,
    optionsEn:[`Rejected the Gospels`,`Lists the 27 New Testament books`,`Created the Apocrypha`,`Was written by Jerome`],
    optionsEs:[`Rechazó los Evangelios`,`Enumera los 27 libros del Nuevo Testamento`,`Creó los apócrifos`,`Fue escrita por Jerónimo`],
    correct:1, explanationEn:`It names all 27 NT books in 367.`, explanationEs:`Nombra los 27 libros del NT en el 367.` },

  { textEn:`The Councils of Hippo (393) and Carthage (397), regarding the NT canon:`, textEs:`Los Concilios de Hipona (393) y Cartago (397), respecto al canon del NT:`,
    optionsEn:[`Invented the canon by vote`,`Removed the Gospels`,`Added the Apocrypha to the NT`,`Recognized the books the churches already used`],
    optionsEs:[`Inventaron el canon por votación`,`Quitaron los Evangelios`,`Añadieron los apócrifos al NT`,`Reconocieron los libros que las iglesias ya usaban`],
    correct:3, explanationEn:`They recognized, not created, the functioning canon.`, explanationEs:`Reconocieron, no crearon, el canon en funcionamiento.` },

  { textEn:`Marcion (c. AD 140) is remembered as a foil because he:`, textEs:`Marción (c. 140 d.C.) es recordado como contraste porque:`,
    optionsEn:[`Wrote the four Gospels`,`Recognized all 27 books`,`Cut Scripture down to a truncated canon`,`Translated the Septuagint`],
    optionsEs:[`Escribió los cuatro Evangelios`,`Reconoció los 27 libros`,`Redujo la Escritura a un canon truncado`,`Tradujo la Septuaginta`],
    correct:2, explanationEn:`Marcion's truncated canon was rejected by the church.`, explanationEs:`El canon truncado de Marción fue rechazado por la iglesia.` },

  { textEn:`The Gnostic "gospels" (Thomas, Judas) differ from the canonical Gospels in that they are:`, textEs:`Los "evangelios" gnósticos (Tomás, Judas) difieren de los Evangelios canónicos en que son:`,
    optionsEn:[`Older than the four Gospels`,`Written by apostles`,`Part of the Hebrew canon`,`Second-century and later, pseudonymous, and never widely received`],
    optionsEs:[`Más antiguos que los cuatro Evangelios`,`Escritos por apóstoles`,`Parte del canon hebreo`,`Del siglo segundo o después, pseudónimos, y nunca ampliamente recibidos`],
    correct:3, explanationEn:`They are late, pseudonymous, and were never widely received.`, explanationEs:`Son tardíos, pseudónimos, y nunca fueron ampliamente recibidos.` },

  { textEn:`The books called the "Apocrypha" or "deuterocanon" include:`, textEs:`Los libros llamados "apócrifos" o "deuterocanon" incluyen:`,
    optionsEn:[`Matthew and Mark`,`Tobit, Judith, Sirach, and 1–2 Maccabees`,`Genesis and Exodus`,`The Gnostic gospels`],
    optionsEs:[`Mateo y Marcos`,`Tobías, Judit, Eclesiástico, y 1–2 Macabeos`,`Génesis y Éxodo`,`Los evangelios gnósticos`],
    correct:1, explanationEn:`Tobit, Judith, Sirach, Maccabees, etc. are the deuterocanon.`, explanationEs:`Tobías, Judit, Eclesiástico, Macabeos, etc. son el deuterocanon.` },

  { textEn:`The unit describes the Apocrypha question as:`, textEs:`La unidad describe la cuestión de los apócrifos como:`,
    optionsEn:[`A settled doctrine no Christian disputes`,`The same as doubting the resurrection`,`A genuine, old disagreement among Christians`,`A modern invention`],
    optionsEs:[`Una doctrina establecida que ningún cristiano disputa`,`Lo mismo que dudar de la resurrección`,`Un desacuerdo genuino y antiguo entre cristianos`,`Un invento moderno`],
    correct:2, explanationEn:`It is a real, old in-house disagreement — not a settled doctrine.`, explanationEs:`Es un desacuerdo real y antiguo entre cristianos — no una doctrina establecida.` },

  { textEn:`Part of the Catholic and Orthodox case for the Apocrypha is that:`, textEs:`Parte del caso católico y ortodoxo a favor de los apócrifos es que:`,
    optionsEn:[`The early church used the Greek Old Testament (Septuagint), which came to include these books`,`The Hebrew Bible never existed`,`Jesus wrote them`,`The Reformers added them`],
    optionsEs:[`La iglesia primitiva usó el Antiguo Testamento griego (Septuaginta), que llegó a incluir estos libros`,`La Biblia hebrea nunca existió`,`Jesús los escribió`,`Los Reformadores los añadieron`],
    correct:0, explanationEn:`The Septuagint, used by the early church, came to include these books.`, explanationEs:`La Septuaginta, usada por la iglesia primitiva, llegó a incluir estos libros.` },

  { textEn:`The Council of Trent (1546) is significant to this question because it:`, textEs:`El Concilio de Trento (1546) es significativo para esta cuestión porque:`,
    optionsEn:[`First removed the Apocrypha`,`Dogmatically affirmed the deuterocanon as Scripture`,`Wrote the New Testament`,`Rejected the Septuagint`],
    optionsEs:[`Quitó por primera vez los apócrifos`,`Afirmó dogmáticamente el deuterocanon como Escritura`,`Escribió el Nuevo Testamento`,`Rechazó la Septuaginta`],
    correct:1, explanationEn:`Trent (1546) dogmatically affirmed the deuterocanon.`, explanationEs:`Trento (1546) afirmó dogmáticamente el deuterocanon.` },

  { textEn:`The unit is careful NOT to claim that:`, textEs:`La unidad tiene cuidado de NO afirmar que:`,
    optionsEn:[`The canon was recognized`,`The NT has 27 books`,`Jerome translated the Vulgate`,`Jesus explicitly refuted the Apocrypha`],
    optionsEs:[`El canon fue reconocido`,`El NT tiene 27 libros`,`Jerónimo tradujo la Vulgata`,`Jesús refutó explícitamente los apócrifos`],
    correct:3, explanationEn:`Jesus gave no canon list and no explicit refutation — we do not claim one.`, explanationEs:`Jesús no dio una lista ni una refutación explícita — no afirmamos que la diera.` },

  { textEn:`That the great 4th-century codices bind the Apocrypha with the Old Testament shows:`, textEs:`Que los grandes códices del siglo cuarto unen los apócrifos con el Antiguo Testamento muestra:`,
    optionsEn:[`What 4th-century Christians bound together, not the canon of Jesus' day`,`A fixed first-century "Alexandrian canon"`,`That Jesus endorsed those books`,`That the Hebrew canon was wrong`],
    optionsEs:[`Lo que los cristianos del siglo cuarto encuadernaron juntos, no el canon de los días de Jesús`,`Un "canon alejandrino" fijo del primer siglo`,`Que Jesús aprobó esos libros`,`Que el canon hebreo estaba equivocado`],
    correct:0, explanationEn:`The codices are 4th-century Christian volumes, not Jesus' fixed canon.`, explanationEs:`Los códices son volúmenes cristianos del siglo cuarto, no el canon fijo de Jesús.` },

  { textEn:`"Allusion is not canonization" is illustrated by the fact that:`, textEs:`"La alusión no es canonización" se ilustra con el hecho de que:`,
    optionsEn:[`Jude alludes to 1 Enoch and Paul quotes pagan poets, yet these are not Scripture`,`The Gospels quote Genesis`,`Paul never quotes anyone`,`Enoch is in the Hebrew canon`],
    optionsEs:[`Judas alude a 1 Enoc y Pablo cita a poetas paganos, y sin embargo no son Escritura`,`Los Evangelios citan Génesis`,`Pablo nunca cita a nadie`,`Enoc está en el canon hebreo`],
    correct:0, explanationEn:`Citing or alluding to a book does not make it Scripture.`, explanationEs:`Citar o aludir a un libro no lo hace Escritura.` },

  { textEn:`Jerome, who translated the Latin Vulgate, distinguished canonical books from books that were:`, textEs:`Jerónimo, que tradujo la Vulgata latina, distinguió los libros canónicos de los libros que eran:`,
    optionsEn:[`Heretical and banned`,`Written by apostles`,`Part of the New Testament`,`"Ecclesiastical" — edifying, but not for establishing doctrine`],
    optionsEs:[`Heréticos y prohibidos`,`Escritos por apóstoles`,`Parte del Nuevo Testamento`,`"Eclesiásticos" — edificantes, pero no para establecer doctrina`],
    correct:3, explanationEn:`Jerome called them "ecclesiastical" — good to read, not doctrine-establishing.`, explanationEs:`Jerónimo los llamó "eclesiásticos" — buenos para leer, no para establecer doctrina.` },

  { textEn:`That the KJV of 1611 also printed the Apocrypha (between the Testaments) shows that:`, textEs:`Que la King James de 1611 también imprimió los apócrifos (entre los Testamentos) muestra que:`,
    optionsEn:[`Protestants considered it canonical`,`Printing or reading a book is not the same as receiving it as canon`,`The KJV rejected the New Testament`,`The Apocrypha is in the Hebrew Bible`],
    optionsEs:[`Los protestantes lo consideraban canónico`,`Imprimir o leer un libro no es lo mismo que recibirlo como canon`,`La King James rechazó el Nuevo Testamento`,`Los apócrifos están en la Biblia hebrea`],
    correct:1, explanationEn:`Printing a book is not receiving it as canon (the KJV printed it too).`, explanationEs:`Imprimir un libro no es recibirlo como canon (la King James también lo imprimió).` },

  { textEn:`The canon CTS teaches is:`, textEs:`El canon que CTS enseña es:`,
    optionsEn:[`39 books only`,`73 books including the deuterocanon`,`The 66 books (39 Old Testament, 27 New Testament)`,`The New Testament alone`],
    optionsEs:[`Solo 39 libros`,`73 libros incluyendo el deuterocanon`,`Los 66 libros (39 del Antiguo Testamento, 27 del Nuevo)`,`Solo el Nuevo Testamento`],
    correct:2, explanationEn:`CTS teaches the 66-book canon: 39 OT + 27 NT.`, explanationEs:`CTS enseña el canon de 66 libros: 39 del AT + 27 del NT.` }
];

const saQuestions = [
  { promptEn:`By what marks was the New Testament recognized as Scripture?`,
    promptEs:`¿Por qué marcas se reconoció el Nuevo Testamento como Escritura?`,
    keywords:[`apost`,`recogniz`,`reconoc`,`univers`,`orthodox`,`ortodox`,`antiqu`,`antig`],
    modelEn:`The New Testament was recognized by marks such as apostolic origin (written by an apostle or apostolic associate), antiquity from the apostolic age, orthodoxy or agreement with the rule of faith, and universal use across the churches. As with the Old Testament, these marks recognized a book's authority; they did not create it.`,
    modelEs:`El Nuevo Testamento fue reconocido por marcas como el origen apostólico (escrito por un apóstol o un asociado apostólico), la antigüedad de la era apostólica, la ortodoxia o concordancia con la regla de fe, y el uso universal en las iglesias. Como con el Antiguo Testamento, estas marcas reconocieron la autoridad de un libro; no la crearon.` },

  { promptEn:`Explain what the Councils of Hippo and Carthage did — and did not — do for the New Testament canon.`,
    promptEs:`Explica qué hicieron — y qué no hicieron — los Concilios de Hipona y Cartago por el canon del Nuevo Testamento.`,
    keywords:[`recogniz`,`reconoc`,`council`,`concili`,`crea`,`gold`,`oro`,`sello`],
    modelEn:`The Councils of Hippo (393) and Carthage (397) recognized the 27 New Testament books the churches were already using; they did not vote books into inspiration or create the canon. A council put its stamp on what was already functioning as Scripture, just as an assayer certifies gold he did not make.`,
    modelEs:`Los Concilios de Hipona (393) y Cartago (397) reconocieron los 27 libros del Nuevo Testamento que las iglesias ya usaban; no votaron para dar inspiración a los libros ni crearon el canon. Un concilio puso su sello sobre lo que ya funcionaba como Escritura, así como un ensayador certifica el oro que no hizo.` },

  { promptEn:`Why do the Gnostic "gospels" and Marcion's canon actually strengthen our confidence in the New Testament?`,
    promptEs:`¿Por qué los "evangelios" gnósticos y el canon de Marción en realidad fortalecen nuestra confianza en el Nuevo Testamento?`,
    keywords:[`trunc`,`recogniz`,`reconoc`,`counterfeit`,`falsific`,`receiv`,`recib`,`marci`],
    modelEn:`Marcion (about AD 140) cut Scripture down to a truncated canon, and the Gnostic gospels like Thomas and Judas were second-century and later, pseudonymous, and never widely received. Against these obvious counterfeits the genuine apostolic books stand out clearly. The church recognized the true books rather than inventing a canon to win a power struggle.`,
    modelEs:`Marción (cerca del año 140 d.C.) redujo la Escritura a un canon truncado, y los evangelios gnósticos como Tomás y Judas eran del siglo segundo o después, pseudónimos, y nunca fueron ampliamente recibidos. Frente a estas falsificaciones evidentes, los verdaderos libros apostólicos se destacan con claridad. La iglesia reconoció los libros verdaderos en vez de inventar un canon para ganar una lucha de poder.` },

  { promptEn:`What is the Apocrypha, and why does the unit treat its inclusion differently from a settled doctrine like the resurrection?`,
    promptEs:`¿Qué son los apócrifos, y por qué la unidad trata su inclusión de modo distinto a una doctrina establecida como la resurrección?`,
    keywords:[`deuteroca`,`disagree`,`desacuerd`,`resurrec`,`canon`,`maccab`,`macab`,`genuin`],
    modelEn:`The Apocrypha, or deuterocanon, is a group of books such as Tobit, Judith, Wisdom, Sirach, and 1–2 Maccabees found in Catholic and Orthodox Bibles. The unit treats its inclusion as a genuine, old disagreement among Christians, not a settled doctrine. No Christian doubts the resurrection, but sincere believers have long disagreed over the extent of the Old Testament canon.`,
    modelEs:`Los apócrifos, o deuterocanónicos, son un grupo de libros como Tobías, Judit, Sabiduría, Eclesiástico y 1–2 Macabeos que se hallan en las Biblias católicas y ortodoxas. La unidad trata su inclusión como un desacuerdo genuino y antiguo entre cristianos, no como una doctrina establecida. Ningún cristiano duda de la resurrección, pero creyentes sinceros han discrepado por mucho tiempo sobre la extensión del canon del Antiguo Testamento.` },

  { promptEn:`State the strongest part of the case for including the Apocrypha, as its defenders make it.`,
    promptEs:`Expón la parte más fuerte del caso a favor de incluir los apócrifos, como lo hacen sus defensores.`,
    keywords:[`septuagin`,`trent`,`continu`,`cit`,`father`,`padr`,`defend`,`defens`],
    modelEn:`Its defenders point out that the early church used the Greek Old Testament, the Septuagint, which came to include these books, and that the apostles quoted the Septuagint. The great fourth-century codices bound the deuterocanon with the Old Testament, many Church Fathers cited these books, and the Council of Trent affirmed them. The continuity argument is that the church read them from the beginning.`,
    modelEs:`Sus defensores señalan que la iglesia primitiva usó el Antiguo Testamento griego, la Septuaginta, que llegó a incluir estos libros, y que los apóstoles citaron la Septuaginta. Los grandes códices del siglo cuarto unieron los deuterocanónicos con el Antiguo Testamento, muchos Padres de la Iglesia citaron estos libros, y el Concilio de Trento los afirmó. El argumento de continuidad es que la iglesia los leyó desde el principio.` },

  { promptEn:`Give two things the unit is careful NOT to claim in the Protestant case, and why.`,
    promptEs:`Da dos cosas que la unidad tiene cuidado de NO afirmar en el caso protestante, y por qué.`,
    keywords:[`refut`,`alexandr`,`alejandr`,`overclaim`,`exager`,`gnat`,`mosquit`,`canon`],
    modelEn:`The unit does not claim that Jesus explicitly refuted the Apocrypha, because he gave no canon list and no such refutation exists. It also does not claim a fixed first-century "Alexandrian canon," since the codices binding these books are fourth-century Christian manuscripts. Overclaiming would be straining a gnat and would set a believer up to stumble.`,
    modelEs:`La unidad no afirma que Jesús refutó explícitamente los apócrifos, porque Él no dio una lista del canon y no existe tal refutación. Tampoco afirma un "canon alejandrino" fijo del primer siglo, ya que los códices que unen estos libros son manuscritos cristianos del siglo cuarto. Exagerar sería colar un mosquito y prepararía al creyente para tropezar.` },

  { promptEn:`Why does "using the Septuagint" not settle the Apocrypha question in favor of inclusion?`,
    promptEs:`¿Por qué "usar la Septuaginta" no zanja la cuestión de los apócrifos a favor de incluirlos?`,
    keywords:[`translat`,`traducc`,`endors`,`aprob`,`septuagin`,`canon`,`philo`,`fil`],
    modelEn:`Using a translation is not the same as endorsing every book later bound with it. The codices that include the deuterocanon are fourth-century Christian manuscripts, not a fixed canon of Jesus' day, and the King James Bible of 1611 also printed the Apocrypha without treating it as canon. Philo, an Alexandrian Jew, used the Septuagint heavily yet never cited these books as Scripture.`,
    modelEs:`Usar una traducción no es lo mismo que aprobar cada libro que después se encuadernó con ella. Los códices que incluyen los deuterocanónicos son manuscritos cristianos del siglo cuarto, no un canon fijo de los días de Jesús, y la Biblia King James de 1611 también imprimió los apócrifos sin tratarlos como canon. Filón, un judío alejandrino, usó la Septuaginta mucho, pero nunca citó estos libros como Escritura.` },

  { promptEn:`What did Jerome teach about the Apocrypha, and what changed at Trent?`,
    promptEs:`¿Qué enseñó Jerónimo sobre los apócrifos, y qué cambió en Trento?`,
    keywords:[`jer`,`vulgat`,`ecclesiast`,`eclesi`,`trent`,`doctrin`,`reform`,`establ`],
    modelEn:`Jerome, who translated the Latin Vulgate, distinguished the canonical books from "ecclesiastical" books: the deuterocanon was edifying to read but not for establishing doctrine. This lower-tier status held for centuries until the Council of Trent in 1546, in reaction to the Reformation, dogmatically affirmed these books as Scripture.`,
    modelEs:`Jerónimo, que tradujo la Vulgata latina, distinguió los libros canónicos de los libros "eclesiásticos": los deuterocanónicos eran edificantes para leer pero no para establecer doctrina. Este estatus de menor rango se mantuvo por siglos hasta que el Concilio de Trento en 1546, en reacción a la Reforma, afirmó dogmáticamente estos libros como Escritura.` },

  { promptEn:`How does the principle "allusion is not canonization" apply here?`,
    promptEs:`¿Cómo se aplica aquí el principio "la alusión no es canonización"?`,
    keywords:[`allud`,`alud`,`enoc`,`poet`,`pagan`,`deuteroca`,`quot`,`cit`],
    modelEn:`The New Testament sometimes echoes or alludes to books without treating them as Scripture. Jude alludes to 1 Enoch, and Paul quotes pagan poets, yet no one counts Enoch or those poets as canonical. In the same way, an echo of a deuterocanonical book in the New Testament does not by itself make that book Scripture.`,
    modelEs:`El Nuevo Testamento a veces refleja o alude a libros sin tratarlos como Escritura. Judas alude a 1 Enoc, y Pablo cita a poetas paganos, pero nadie cuenta a Enoc ni a esos poetas como canónicos. Del mismo modo, un eco de un libro deuterocanónico en el Nuevo Testamento no hace por sí solo que ese libro sea Escritura.` },

  { promptEn:`In your own words, how should a Protestant speak to a Catholic brother about the Apocrypha, according to this unit's spirit?`,
    promptEs:`Con tus palabras, ¿cómo debe un protestante hablar con un hermano católico sobre los apócrifos, según el espíritu de esta unidad?`,
    keywords:[`disagree`,`desacuerd`,`respect`,`respet`,`hebre`,`trent`,`refut`,`honest`],
    modelEn:`We should hold the Hebrew canon honestly while treating the disagreement as a real and old one among fellow Christians, not as a mark of a false gospel. We can explain why we receive the sixty-six books — the Hebrew canon Jesus marked, Jerome's lower tier, the late date of Trent — without pretending Jesus refuted the Apocrypha or that the question was never open. Respect and candor belong together.`,
    modelEs:`Debemos sostener el canon hebreo con honestidad, tratando el desacuerdo como algo real y antiguo entre hermanos cristianos, no como señal de un evangelio falso. Podemos explicar por qué recibimos los sesenta y seis libros — el canon hebreo que Jesús marcó, el rango menor de Jerónimo, la fecha tardía de Trento — sin pretender que Jesús refutó los apócrifos ni que la cuestión nunca estuvo abierta. El respeto y la franqueza van juntos.` }
];
