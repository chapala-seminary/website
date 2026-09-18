/* CTSBible - unit 2: per-unit configuration and content. */

const UNIT = 2;

const COURSE_PREFIX = 'cts_bible_u2_';

const mcQuestions = [
  { textEn:`The word "canon" comes from a Greek word meaning:`, textEs:`La palabra "canon" viene de un término griego que significa:`,
    optionsEn:[`A measuring reed or rule`,`A council`,`A scroll`,`A cannon or weapon`],
    optionsEs:[`Una caña de medir o regla`,`Un concilio`,`Un rollo`,`Un cañón o arma`],
    correct:0, explanationEn:`Kanōn means a measuring rod; the canon is the standard list of Scripture.`, explanationEs:`Kanōn significa una vara de medir; el canon es la lista normativa de la Escritura.` },

  { textEn:`The unit's central point about the canon is that the books are Scripture because:`, textEs:`El punto central de la unidad sobre el canon es que los libros son Escritura porque:`,
    optionsEn:[`A council declared them so`,`They are old`,`They were popular`,`God gave them; councils recognized what already was`],
    optionsEs:[`Un concilio los declaró así`,`Son antiguos`,`Eran populares`,`Dios los dio; los concilios reconocieron lo que ya era`],
    correct:3, explanationEn:`Recognition, not conferral — a council certifies what is already Scripture.`, explanationEs:`Reconocimiento, no conferimiento — un concilio certifica lo que ya es Escritura.` },

  { textEn:`The image used for how the community related to the canon is:`, textEs:`La imagen usada para cómo la comunidad se relacionó con el canon es:`,
    optionsEn:[`A king writing a law`,`An assayer certifying gold he did not create`,`A builder making bricks`,`A judge inventing a verdict`],
    optionsEs:[`Un rey escribiendo una ley`,`Un ensayador certificando oro que no creó`,`Un albañil haciendo ladrillos`,`Un juez inventando un veredicto`],
    correct:1, explanationEn:`The community recognized intrinsic authority; it did not manufacture it.`, explanationEs:`La comunidad reconoció una autoridad intrínseca; no la fabricó.` },

  { textEn:`The threefold shape of the Hebrew Bible is:`, textEs:`La forma triple de la Biblia hebrea es:`,
    optionsEn:[`Law, Prophets, Writings`,`Genesis, Exodus, Leviticus`,`History, Poetry, Prophecy`,`Old, Middle, New`],
    optionsEs:[`Ley, Profetas, Escritos`,`Génesis, Éxodo, Levítico`,`Historia, Poesía, Profecía`,`Antiguo, Medio, Nuevo`],
    correct:0, explanationEn:`Torah (Law), Nevi'im (Prophets), Ketuvim (Writings).`, explanationEs:`Torá (Ley), Nevi'im (Profetas), Ketuvim (Escritos).` },

  { textEn:`Jesus reflects this shape in Luke 24:44 when He names "the Law of Moses and the Prophets and the ______":`, textEs:`Jesús refleja esta forma en Lucas 24:44 al nombrar "la ley de Moisés, y los profetas, y los ______":`,
    optionsEn:[`Gospels`,`Apostles`,`Psalms`,`Proverbs`],
    optionsEs:[`Evangelios`,`Apóstoles`,`Salmos`,`Proverbios`],
    correct:2, explanationEn:`"The Psalms" stands for the Writings, the third division.`, explanationEs:`"Los Salmos" representan los Escritos, la tercera división.` },

  { textEn:`The Law (Torah) was recognized as Scripture:`, textEs:`La Ley (Torá) fue reconocida como Escritura:`,
    optionsEn:[`Last of the three divisions`,`Only after the exile`,`At the Council of Jamnia`,`Earliest, in Moses' own day (placed beside the ark)`],
    optionsEs:[`La última de las tres divisiones`,`Solo después del exilio`,`En el Concilio de Jamnia`,`Lo más temprano, en los días de Moisés (junto al arca)`],
    correct:3, explanationEn:`Deuteronomy 31:24–26 — the Book of the Law placed beside the ark.`, explanationEs:`Deuteronomio 31:24–26 — el Libro de la Ley colocado junto al arca.` },

  { textEn:`Which was NOT one of the marks by which OT books were recognized?`, textEs:`¿Cuál NO fue una de las marcas por las que se reconocieron los libros del AT?`,
    optionsEn:[`Written by a prophet or under prophetic authority`,`Consistency with prior revelation`,`Approval by the Roman senate`,`Reception by the covenant community over time`],
    optionsEs:[`Escrito por un profeta o bajo autoridad profética`,`Consistencia con la revelación previa`,`Aprobación por el senado romano`,`Recepción por la comunidad del pacto con el tiempo`],
    correct:2, explanationEn:`Canon was recognized by prophetic authority and the community, not Rome.`, explanationEs:`El canon se reconoció por autoridad profética y la comunidad, no por Roma.` },

  { textEn:`"The Scripture cannot be broken" is Jesus' statement in:`, textEs:`"La Escritura no puede ser quebrantada" es una declaración de Jesús en:`,
    optionsEn:[`Luke 24:44`,`John 10:35`,`Matthew 5:17`,`2 Timothy 3:16`],
    optionsEs:[`Lucas 24:44`,`Juan 10:35`,`Mateo 5:17`,`2 Timoteo 3:16`],
    correct:1, explanationEn:`John 10:35 shows Jesus' view of the OT's unbreakable authority.`, explanationEs:`Juan 10:35 muestra la visión de Jesús sobre la autoridad indestructible del AT.` },

  { textEn:`In Luke 11:51, "from the blood of Abel to the blood of Zechariah" marks:`, textEs:`En Lucas 11:51, "desde la sangre de Abel hasta la sangre de Zacarías" marca:`,
    optionsEn:[`The most famous murders`,`The span of the Hebrew Scriptures, Genesis to Chronicles`,`Only the book of Genesis`,`The New Testament`],
    optionsEs:[`Los asesinatos más famosos`,`El alcance de las Escrituras hebreas, de Génesis a Crónicas`,`Solo el libro de Génesis`,`El Nuevo Testamento`],
    correct:1, explanationEn:`Abel (Genesis) to Zechariah (Chronicles, last in the Hebrew order) = the whole Hebrew Bible.`, explanationEs:`Abel (Génesis) a Zacarías (Crónicas, último en el orden hebreo) = toda la Biblia hebrea.` },

  { textEn:`Chronicles stands ______ in the Hebrew arrangement, which is why "to Zechariah" marks the end of the canon.`, textEs:`Crónicas está ______ en el arreglo hebreo, por lo que "hasta Zacarías" marca el fin del canon.`,
    optionsEn:[`first`,`in the middle`,`last`,`among the Prophets`],
    optionsEs:[`primero`,`en el medio`,`al final`,`entre los Profetas`],
    correct:2, explanationEn:`In the Hebrew order Chronicles is the final book, so Abel-to-Zechariah spans the whole.`, explanationEs:`En el orden hebreo Crónicas es el último libro, así que Abel-a-Zacarías abarca todo.` },

  { textEn:`Jesus marking Abel-to-Zechariah is compared in the unit to saying:`, textEs:`Que Jesús marque de Abel a Zacarías se compara en la unidad con decir:`,
    optionsEn:[`"From Moses to Malachi only"`,`"From Matthew to John"`,`"From the Law to the Apocrypha"`,`"From Genesis to Revelation"`],
    optionsEs:[`"De Moisés a Malaquías solamente"`,`"De Mateo a Juan"`,`"De la Ley a los Apócrifos"`,`"De Génesis a Apocalipsis"`],
    correct:3, explanationEn:`It is a way of naming the whole span of the recognized Scriptures.`, explanationEs:`Es una manera de nombrar todo el alcance de las Escrituras reconocidas.` },

  { textEn:`The Jewish historian who testified (about AD 95) that the Hebrew books were fixed and unaltered was:`, textEs:`El historiador judío que testificó (cerca del 95 d.C.) que los libros hebreos eran fijos e inalterados fue:`,
    optionsEn:[`Josephus`,`Philo`,`Eusebius`,`Herodotus`],
    optionsEs:[`Josefo`,`Filón`,`Eusebio`,`Heródoto`],
    correct:0, explanationEn:`Josephus, in Against Apion, describes a closed, fixed number of books.`, explanationEs:`Josefo, en Contra Apión, describe un número de libros cerrado y fijo.` },

  { textEn:`Josephus said the Hebrew Scriptures were written between Moses and the reign of:`, textEs:`Josefo dijo que las Escrituras hebreas se escribieron entre Moisés y el reinado de:`,
    optionsEn:[`Herod`,`Artaxerxes`,`Nebuchadnezzar`,`Augustus`],
    optionsEs:[`Herodes`,`Artajerjes`,`Nabucodonosor`,`Augusto`],
    correct:1, explanationEn:`Josephus placed the close of writing at the time of Artaxerxes.`, explanationEs:`Josefo situó el cierre de la escritura en el tiempo de Artajerjes.` },

  { textEn:`Josephus counted the Hebrew books as:`, textEs:`Josefo contó los libros hebreos como:`,
    optionsEn:[`Thirty-nine`,`Sixty-six`,`Twelve`,`Twenty-two`],
    optionsEs:[`Treinta y nueve`,`Sesenta y seis`,`Doce`,`Veintidós`],
    correct:3, explanationEn:`He counted twenty-two (matching the Hebrew alphabet).`, explanationEs:`Contó veintidós (igualando el alfabeto hebreo).` },

  { textEn:`The numbers 22, 24, and 39 for the Old Testament represent:`, textEs:`Los números 22, 24 y 39 para el Antiguo Testamento representan:`,
    optionsEn:[`Three different canons`,`The same books counted and grouped differently`,`Additions made over time`,`A scribal error`],
    optionsEs:[`Tres cánones diferentes`,`Los mismos libros contados y agrupados de otra manera`,`Adiciones hechas con el tiempo`,`Un error de copista`],
    correct:1, explanationEn:`Same content; the Hebrew tradition combines books the English/Spanish Bible separates.`, explanationEs:`Mismo contenido; la tradición hebrea une libros que la Biblia en español/inglés separa.` },

  { textEn:`English and Spanish Bibles reach 39 OT books partly because they:`, textEs:`Las Biblias en inglés y español llegan a 39 libros del AT en parte porque:`,
    optionsEn:[`Add the Apocrypha`,`Remove the Writings`,`Split the Minor Prophets and books like Samuel and Kings into separate books`,`Count Psalms as five books`],
    optionsEs:[`Añaden los Apócrifos`,`Quitan los Escritos`,`Separan los Profetas Menores y libros como Samuel y Reyes en libros distintos`,`Cuentan los Salmos como cinco libros`],
    correct:2, explanationEn:`The Twelve, Samuel, Kings, Chronicles, Ezra-Nehemiah are single in Hebrew, separate in English/Spanish.`, explanationEs:`Los Doce, Samuel, Reyes, Crónicas, Esdras-Nehemías son únicos en hebreo, separados en español/inglés.` },

  { textEn:`The "Council of Jamnia" as the event that closed the OT canon is, according to the unit:`, textEs:`El "Concilio de Jamnia" como el evento que cerró el canon del AT es, según la unidad:`,
    optionsEn:[`A well-documented first-century council`,`The same as the Council of Carthage`,`Where Josephus wrote`,`A nineteenth-century reconstruction, not an ancient record`],
    optionsEs:[`Un concilio bien documentado del primer siglo`,`Lo mismo que el Concilio de Cartago`,`Donde Josefo escribió`,`Una reconstrucción del siglo XIX, no un registro antiguo`],
    correct:3, explanationEn:`The "council" that fixed the canon is a modern scholarly reconstruction, not history.`, explanationEs:`El "concilio" que fijó el canon es una reconstrucción académica moderna, no historia.` },

  { textEn:`What the rabbis at Yavneh (Jamnia) actually discussed was:`, textEs:`Lo que los rabinos en Yavne (Jamnia) en verdad discutieron fue:`,
    optionsEn:[`Whether books like Ecclesiastes and Song of Songs "defile the hands"`,`Which Gospels to accept`,`The date of Easter`,`Whether to add the Apocrypha`],
    optionsEs:[`Si libros como Eclesiastés y Cantares "contaminan las manos"`,`Cuáles Evangelios aceptar`,`La fecha de la Pascua`,`Si añadir los Apócrifos`],
    correct:0, explanationEn:`The discussion assumed the books were already Scripture; it did not create the canon.`, explanationEs:`La discusión suponía que los libros ya eran Escritura; no creó el canon.` },

  { textEn:`Correcting the Jamnia claim, the unit says, makes the conservative case:`, textEs:`Corregir la afirmación de Jamnia, dice la unidad, hace la posición conservadora:`,
    optionsEn:[`Weaker`,`Unchanged`,`Stronger, since the canon was recognized far earlier and needed no council`,`Dependent on Rome`],
    optionsEs:[`Más débil`,`Sin cambio`,`Más fuerte, pues el canon se reconoció mucho antes y no necesitó concilio`,`Dependiente de Roma`],
    correct:2, explanationEn:`The honest history is more conservative, not less — the canon was settled early.`, explanationEs:`La historia honesta es más conservadora, no menos — el canon se estableció temprano.` },

  { textEn:`The unit concludes that the Old Testament you hold is:`, textEs:`La unidad concluye que el Antiguo Testamento que tienes es:`,
    optionsEn:[`The Hebrew Scriptures already settled in Jesus' day — the books He read and called unbreakable`,`A later collection imposed by a council`,`Different from the books Jesus used`,`Still open and undecided`],
    optionsEs:[`Las Escrituras hebreas ya establecidas en tiempos de Jesús — los libros que Él leyó y llamó indestructibles`,`Una colección posterior impuesta por un concilio`,`Distinto de los libros que Jesús usó`,`Todavía abierto y sin decidir`],
    correct:0, explanationEn:`The OT in your Bible is the OT Jesus held — the right books.`, explanationEs:`El AT en tu Biblia es el AT que Jesús tenía — los libros correctos.` }
];

const saQuestions = [
  { promptEn:`Explain the difference between the canon being "recognized" and being "conferred," and why it matters.`,
    promptEs:`Explica la diferencia entre que el canon sea "reconocido" y sea "conferido", y por qué importa.`,
    keywords:[`recogniz`,`reconoc`,`council`,`concili`,`gold`,`oro`,`author`,`intrins`],
    modelEn:`The canon was recognized, not conferred: the books were already God-breathed Scripture, and the community simply recognized the authority God had given. A council no more makes a book Scripture than an assayer makes gold precious — it certifies what is already so. This matters because Scripture's authority is intrinsic, not granted by any church.`,
    modelEs:`El canon fue reconocido, no conferido: los libros ya eran Escritura exhalada por Dios, y la comunidad solo reconoció la autoridad que Dios había dado. Un concilio no hace que un libro sea Escritura, como un ensayador no hace precioso el oro — certifica lo que ya lo es. Esto importa porque la autoridad de la Escritura es intrínseca, no otorgada por ninguna iglesia.` },

  { promptEn:`Name the threefold division of the Hebrew Bible and say where Jesus reflects it.`,
    promptEs:`Nombra la división triple de la Biblia hebrea y di dónde Jesús la refleja.`,
    keywords:[`law`,`ley`,`prophet`,`profet`,`writing`,`escrit`,`psalm`,`salmo`],
    modelEn:`The Hebrew Bible came in three parts: the Law (Torah), the Prophets (Nevi'im), and the Writings (Ketuvim). Jesus reflects this shape in Luke 24:44 when He speaks of "the Law of Moses and the Prophets and the Psalms," the Psalms standing for the Writings.`,
    modelEs:`La Biblia hebrea vino en tres partes: la Ley (Torá), los Profetas (Nevi'im) y los Escritos (Ketuvim). Jesús refleja esta forma en Lucas 24:44 cuando habla de "la ley de Moisés, y los profetas, y los salmos", representando los Salmos a los Escritos.` },

  { promptEn:`By what marks were Old Testament books recognized as Scripture?`,
    promptEs:`¿Por qué marcas se reconocieron los libros del Antiguo Testamento como Escritura?`,
    keywords:[`prophet`,`prof`,`consist`,`communit`,`comunid`,`recogniz`,`reconoc`,`reveal`],
    modelEn:`Books were recognized by marks such as prophetic authorship or authority, consistency with what God had already revealed, and reception by the covenant community over generations. Recognition was a settling over time, not a manufacturing by decree.`,
    modelEs:`Los libros se reconocían por marcas como la autoría o autoridad profética, la consistencia con lo que Dios ya había revelado, y la recepción por la comunidad del pacto a través de generaciones. El reconocimiento fue un asentarse con el tiempo, no una fabricación por decreto.` },

  { promptEn:`How does Luke 11:51 ("from Abel to Zechariah") show the extent of the canon Jesus received?`,
    promptEs:`¿Cómo muestra Lucas 11:51 ("desde Abel hasta Zacarías") el alcance del canon que Jesús recibió?`,
    keywords:[`abel`,`zechar`,`zacar`,`genesis`,`chronic`,`crónic`,`span`,`whole`],
    modelEn:`Abel is the first martyr in Genesis and Zechariah the last in Chronicles, which stands last in the Hebrew order. By naming "from Abel to Zechariah," Jesus draws a line around the whole span of the Hebrew Scriptures — much as we might say "from Genesis to Revelation" — showing the canon was already fixed.`,
    modelEs:`Abel es el primer mártir en Génesis y Zacarías el último en Crónicas, que está al final del orden hebreo. Al nombrar "desde Abel hasta Zacarías", Jesús traza una línea alrededor de todo el alcance de las Escrituras hebreas — como diríamos "desde Génesis hasta Apocalipsis" — mostrando que el canon ya estaba fijado.` },

  { promptEn:`What does Josephus tell us about the state of the Hebrew canon by the first century?`,
    promptEs:`¿Qué nos dice Josefo sobre el estado del canon hebreo para el primer siglo?`,
    keywords:[`josephus`,`josefo`,`fij`,`cerr`,`artaxerx`,`alter`,`twenty`,`veintid`],
    modelEn:`Writing about AD 95, Josephus testified that the Hebrew books were a fixed number, written between Moses and Artaxerxes, to which nothing had been added and which no one dared alter — he counted twenty-two. This is outside testimony that the canon was already closed and known in the first century, not still open.`,
    modelEs:`Escribiendo cerca del año 95 d.C., Josefo testificó que los libros hebreos eran un número fijo, escritos entre Moisés y Artajerjes, a los que nada se había añadido y que nadie osaba alterar — contó veintidós. Es un testimonio externo de que el canon ya estaba cerrado y conocido en el primer siglo, no todavía abierto.` },

  { promptEn:`Explain why the Old Testament is counted as 22, 24, or 39 books.`,
    promptEs:`Explica por qué el Antiguo Testamento se cuenta como 22, 24 o 39 libros.`,
    keywords:[`same`,`mism`,`agrup`,`group`,`minor`,`samuel`,`split`,`divid`],
    modelEn:`These numbers are the same books counted differently. The Hebrew tradition reached 22 or 24 by treating the twelve Minor Prophets as one book and joining Samuel, Kings, Chronicles, and Ezra-Nehemiah each as single books. English and Spanish Bibles split these out to reach 39. Nothing is added or removed — only grouped differently.`,
    modelEs:`Estos números son los mismos libros contados de modo distinto. La tradición hebrea llegó a 22 o 24 tratando los doce Profetas Menores como un libro y uniendo Samuel, Reyes, Crónicas y Esdras-Nehemías cada uno como libros únicos. Las Biblias en inglés y español los separan para llegar a 39. Nada se añade ni se quita — solo se agrupa distinto.` },

  { promptEn:`What was the "Council of Jamnia," and why does the unit call it a camel worth refusing?`,
    promptEs:`¿Qué fue el "Concilio de Jamnia", y por qué la unidad lo llama un camello que vale rechazar?`,
    keywords:[`jamnia`,`yavneh`,`concili`,`council`,`reconstruc`,`defile`,`assum`,`suppos`],
    modelEn:`It was long taught that a Jewish council at Jamnia closed the OT canon about AD 90, but that council is a nineteenth-century reconstruction, not an ancient record. What the rabbis at Yavneh actually discussed — whether books like Ecclesiastes "defile the hands" — assumes those books were already Scripture. It is a camel because it was swallowed on a teacher's word without checking.`,
    modelEs:`Por mucho tiempo se enseñó que un concilio judío en Jamnia cerró el canon del AT cerca del año 90 d.C., pero ese concilio es una reconstrucción del siglo XIX, no un registro antiguo. Lo que los rabinos en Yavne en verdad discutieron — si libros como Eclesiastés "contaminan las manos" — supone que esos libros ya eran Escritura. Es un camello porque se tragó por la palabra de un maestro sin comprobarlo.` },

  { promptEn:`Why does correcting the Jamnia claim strengthen, rather than weaken, the conservative case?`,
    promptEs:`¿Por qué corregir la afirmación de Jamnia fortalece, en vez de debilitar, la posición conservadora?`,
    keywords:[`conserv`,`council`,`concili`,`recogniz`,`reconoc`,`earlier`,`antes`,`honest`],
    modelEn:`Because the Jamnia story actually places the canon's close late, in a Jewish council after Christ. Removing it does not lose ground — it gains it: the honest history is that the canon was recognized far earlier and needed no council to make it so. The more accurate account is the more conservative one.`,
    modelEs:`Porque la historia de Jamnia en realidad sitúa el cierre del canon tarde, en un concilio judío después de Cristo. Quitarla no pierde terreno — lo gana: la historia honesta es que el canon fue reconocido mucho antes y no necesitó concilio para serlo. El relato más exacto es el más conservador.` },

  { promptEn:`In what sense is the Old Testament the believer holds "the canon Jesus held"?`,
    promptEs:`¿En qué sentido es el Antiguo Testamento que el creyente tiene "el canon que Jesús tenía"?`,
    keywords:[`jesus`,`jesús`,`quot`,`cit`,`hebre`,`settled`,`establ`,`unbreak`],
    modelEn:`The Old Testament in the believer's Bible is the Hebrew Scriptures that were already settled in Jesus' day — the very books He read, quoted as authoritative, and called unbreakable ("the Scripture cannot be broken"). Opening to Genesis, the Psalms, or Malachi, the believer holds what Jesus held.`,
    modelEs:`El Antiguo Testamento en la Biblia del creyente es las Escrituras hebreas que ya estaban establecidas en tiempos de Jesús — los mismos libros que Él leyó, citó como autoritativos y llamó indestructibles ("la Escritura no puede ser quebrantada"). Al abrir en Génesis, los Salmos o Malaquías, el creyente sostiene lo que Jesús sostuvo.` },

  { promptEn:`Restate this unit's method in your own words: how should we treat a familiar claim like the Jamnia council?`,
    promptEs:`Expresa el método de esta unidad con tus palabras: ¿cómo debemos tratar una afirmación familiar como el concilio de Jamnia?`,
    keywords:[`test`,`prueb`,`comprob`,`check`,`familiar`,`evidenc`,`assum`,`honest`],
    modelEn:`A familiar claim should not be believed simply because it is familiar or came from a trusted teacher. We test it against the evidence and follow where the evidence leads — even when that means correcting a long-held belief. Here that discipline led to a more honest and more conservative conclusion.`,
    modelEs:`Una afirmación familiar no debe creerse solo porque es familiar o vino de un maestro de confianza. La probamos contra la evidencia y seguimos adonde la evidencia lleva — aun cuando eso signifique corregir una creencia sostenida por mucho tiempo. Aquí esa disciplina llevó a una conclusión más honesta y más conservadora.` }
];
