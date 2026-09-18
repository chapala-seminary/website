/* CTSHermeneutics - unit 5: per-unit configuration and content. */

const UNIT = 5;

const NEXT_UNIT_URL = "CTSHermeneuticsUnit6.html";

const PREV_UNIT_URL = "CTSHermeneuticsUnit4.html";

const IS_FINAL_UNIT = false;

const SHOW_REGISTRATION = false;

const mcQuestions = [
    {
      textEn: "1. The Bible passage that most clearly models \"Scripture interprets Scripture\" being done by Jesus Himself is:",
      textEs: "1. El pasaje bíblico que más claramente modela «la Escritura interpreta a la Escritura» hecho por Jesús mismo es:",
      optionsEn: ["A. The Sermon on the Mount (Matthew 5-7)","B. The cleansing of the temple (John 2)","C. The road to Emmaus (Luke 24:27)","D. The wedding at Cana (John 2:1-11)"],
      optionsEs: ["A. El Sermón del Monte (Mateo 5-7)","B. La limpieza del templo (Juan 2)","C. El camino a Emaús (Lucas 24:27)","D. Las bodas de Caná (Juan 2:1-11)"],
      correct: "C",
      correctFeedbackEn: "Correct. On the road to Emmaus the risen Christ walked two disciples through Moses, the Prophets, and \"all the Scriptures\" to show them what every part of the Old Testament said about Him. That is canonical exegesis modeled by the Lord Himself.",
      correctFeedbackEs: "Correcto. En el camino a Emaús el Cristo resucitado recorrió a dos discípulos por Moisés, los Profetas, y «todas las Escrituras» para mostrarles lo que cada parte del Antiguo Testamento decía de Él. Esa es la exégesis canónica modelada por el Señor mismo.",
      incorrectFeedbackEn: "The Sermon on the Mount, the temple cleansing, and the Cana wedding all show Jesus teaching or acting, but only LUKE 24:27 — the Emmaus road — shows Him walking two disciples through the entire Old Testament to show how every part speaks of Him.",
      incorrectFeedbackEs: "El Sermón del Monte, la limpieza del templo, y la boda de Caná muestran todos a Jesús enseñando o actuando, pero solo LUCAS 24:27 — el camino a Emaús — Lo muestra recorriendo a dos discípulos por todo el Antiguo Testamento para mostrar cómo cada parte habla de Él."
    },
    {
      textEn: "2. According to Luke 24:44, what three divisions did Jesus name when He said the whole Old Testament spoke of Him?",
      textEs: "2. Según Lucas 24:44, ¿cuáles tres divisiones nombró Jesús al decir que todo el Antiguo Testamento hablaba de Él?",
      optionsEn: ["A. Pentateuch, History, Wisdom","B. The Law of Moses, the Prophets, and the Psalms","C. The Apocrypha, the Septuagint, the Targums","D. Genesis, Exodus, Leviticus"],
      optionsEs: ["A. Pentateuco, Historia, Sabiduría","B. La Ley de Moisés, los Profetas, y los Salmos","C. Los apócrifos, la Septuaginta, los Targums","D. Génesis, Éxodo, Levítico"],
      correct: "B",
      correctFeedbackEn: "Correct. Those were the three traditional Jewish divisions of the Hebrew Bible. Jesus said the whole Old Testament — every section — had been about Him. Read through that lens, the canon opens.",
      correctFeedbackEs: "Correcto. Esas eran las tres divisiones judías tradicionales de la Biblia hebrea. Jesús dijo que todo el Antiguo Testamento — cada sección — había tratado de Él. Leído a través de ese lente, el canon se abre.",
      incorrectFeedbackEn: "Jesus named the three traditional Hebrew sections: THE LAW OF MOSES (Pentateuch), THE PROPHETS (Former and Latter), and THE PSALMS (Writings, named for their first book). Modern categories like Apocrypha or single book titles miss His point.",
      incorrectFeedbackEs: "Jesús nombró las tres secciones tradicionales hebreas: LA LEY DE MOISÉS (Pentateuco), LOS PROFETAS (Anteriores y Posteriores), y LOS SALMOS (Escritos, nombrados por su primer libro). Categorías modernas como Apócrifos o títulos de libros individuales pierden Su punto."
    },
    {
      textEn: "3. The doctrine of canonical unity teaches that:",
      textEs: "3. La doctrina de la unidad canónica enseña que:",
      optionsEn: ["A. Only the New Testament should govern Christian doctrine","B. The Bible is mostly contradictions reconciled by clever theologians","C. The Bible's sixty-six books were inspired by one Spirit and form one coherent message","D. Each Bible book stands entirely on its own"],
      optionsEs: ["A. Solo el Nuevo Testamento debe gobernar la doctrina cristiana","B. La Biblia es mayormente contradicciones reconciliadas por teólogos ingeniosos","C. Los sesenta y seis libros de la Biblia fueron inspirados por un solo Espíritu y forman un mensaje coherente","D. Cada libro bíblico se sostiene completamente por sí solo"],
      correct: "C",
      correctFeedbackEn: "Correct. Approximately forty authors, three languages, roughly sixteen centuries, one Author behind it all. Because one Spirit inspired every word, the parts of the Bible are not strangers to each other — they are family.",
      correctFeedbackEs: "Correcto. Aproximadamente cuarenta autores, tres idiomas, unos dieciséis siglos, un solo Autor detrás de todo. Porque un solo Espíritu inspiró cada palabra, las partes de la Biblia no son extrañas entre sí — son familia.",
      incorrectFeedbackEn: "Canonical unity does not exclude the Old Testament, dismiss the Bible as contradictory, or isolate each book. It teaches the OPPOSITE: one Spirit inspired the whole, so every book speaks coherently with every other book.",
      incorrectFeedbackEs: "La unidad canónica no excluye el Antiguo Testamento, ni descarta la Biblia como contradictoria, ni aísla cada libro. Enseña LO OPUESTO: un solo Espíritu inspiró el todo, así que cada libro habla coherentemente con cada otro libro."
    },
    {
      textEn: "4. The first level of the \"three-fold cord\" of Scripture-interprets-Scripture is:",
      textEs: "4. El primer nivel del «cordón de tres dobleces» de la Escritura interpretando a la Escritura es:",
      optionsEn: ["A. Clear passages illuminate difficult ones","B. The original Hebrew is always preferred to the Greek","C. Newer revelation always cancels older revelation","D. Personal experience completes Scripture"],
      optionsEs: ["A. Los pasajes claros iluminan los difíciles","B. El hebreo original siempre se prefiere al griego","C. La revelación más nueva siempre cancela la más antigua","D. La experiencia personal completa la Escritura"],
      correct: "A",
      correctFeedbackEn: "Correct. The wise pastor anchors his interpretation in the plain places and lets them light up the dark ones. If a difficult verse seems to teach what twenty clear verses deny, the difficult verse must mean something other than what it appears to say.",
      correctFeedbackEs: "Correcto. El pastor sabio ancla su interpretación en los lugares claros y deja que iluminen los oscuros. Si un versículo difícil parece enseñar lo que veinte versículos claros niegan, el versículo difícil debe significar algo distinto de lo que parece decir.",
      incorrectFeedbackEn: "Hebrew preference, revelation cancellation, and experience-completion are not biblical principles. The first principle of canonical interpretation is the simplest: build doctrine from the daylight (clear texts), not from the shadows (difficult texts).",
      incorrectFeedbackEs: "La preferencia por el hebreo, la cancelación de revelación, y completar con experiencia no son principios bíblicos. El primer principio de la interpretación canónica es el más sencillo: edifique la doctrina desde la luz del día (textos claros), no desde las sombras (textos difíciles)."
    },
    {
      textEn: "5. The second level of the three-fold cord is:",
      textEs: "5. El segundo nivel del cordón de tres dobleces es:",
      optionsEn: ["A. Sentimental verses outweigh practical ones","B. Old Testament verses outweigh New Testament ones","C. Famous verses outweigh obscure ones","D. Repeated teaching outweighs isolated mention"],
      optionsEs: ["A. Los versículos sentimentales pesan más que los prácticos","B. Los versículos del Antiguo Testamento pesan más que los del Nuevo","C. Los versículos famosos pesan más que los oscuros","D. La enseñanza repetida pesa más que la mención aislada"],
      correct: "D",
      correctFeedbackEn: "Correct. A doctrine the Bible repeats fifty times is more important than a phrase it uses once. A pastor who builds doctrine on a single verse is building on a single nail; a pastor who builds on a repeated teaching is building on a beam.",
      correctFeedbackEs: "Correcto. Una doctrina que la Biblia repite cincuenta veces es más importante que una frase que usa una sola vez. Un pastor que edifica la doctrina sobre un solo versículo está edificando sobre un solo clavo; un pastor que edifica sobre una enseñanza repetida está edificando sobre una viga.",
      incorrectFeedbackEn: "Tone, testament, and fame are not interpretive weights. The principle is repetition: what Scripture says often and emphatically carries more doctrinal weight than what it says once in passing.",
      incorrectFeedbackEs: "El tono, el testamento, y la fama no son pesos interpretativos. El principio es la repetición: lo que la Escritura dice a menudo y enfáticamente carga más peso doctrinal que lo que dice una sola vez de paso."
    },
    {
      textEn: "6. The third level of the three-fold cord is:",
      textEs: "6. El tercer nivel del cordón de tres dobleces es:",
      optionsEn: ["A. Each pastor's denomination decides the meaning","B. Modern theologians correct ancient ones","C. The whole canon holds each verse in place","D. Whoever shouts loudest wins the debate"],
      optionsEs: ["A. La denominación de cada pastor decide el significado","B. Los teólogos modernos corrigen a los antiguos","C. El canon entero sostiene cada versículo en su lugar","D. Quien grite más fuerte gana el debate"],
      correct: "C",
      correctFeedbackEn: "Correct. Every verse sits inside the canon, and the canon holds it where God put it. We saw this in Unit 3 (Jesus answering Psalm 91 with Deuteronomy 6) and Unit 4 (Esther driven by Genesis 12). The whole Bible holds each verse.",
      correctFeedbackEs: "Correcto. Cada versículo está dentro del canon, y el canon lo sostiene donde Dios lo puso. Vimos esto en la Unidad 3 (Jesús respondiendo al Salmo 91 con Deuteronomio 6) y en la Unidad 4 (Ester impulsado por Génesis 12). La Biblia entera sostiene cada versículo.",
      incorrectFeedbackEn: "Denominations, modern theologians, and rhetorical volume do not interpret Scripture. The CANON does. The whole Bible — sixty-six books inspired by one Spirit — holds each verse in its proper place.",
      incorrectFeedbackEs: "Las denominaciones, los teólogos modernos, y el volumen retórico no interpretan la Escritura. El CANON lo hace. La Biblia entera — sesenta y seis libros inspirados por un solo Espíritu — sostiene cada versículo en su lugar apropiado."
    },
    {
      textEn: "7. The lesson uses Philippians 4:13 (\"I can do all things through Christ\") as a worked example of:",
      textEs: "7. La lección usa Filipenses 4:13 («todo lo puedo en Cristo») como ejemplo trabajado de:",
      optionsEn: ["A. A verse so clear no context is needed","B. A verse whose meaning is restored by reading verses 11-12 with it","C. A verse meant only for first-century Christians","D. A verse that has no application today"],
      optionsEs: ["A. Un versículo tan claro que no se necesita contexto","B. Un versículo cuyo significado se restaura al leer los versículos 11-12 con él","C. Un versículo destinado solo a los cristianos del primer siglo","D. Un versículo que no tiene aplicación hoy"],
      correct: "B",
      correctFeedbackEn: "Correct. Verses 11-12 are about contentment in plenty and in want. Verse 13's \"all things\" is therefore being content in every circumstance — not a divine guarantee of every venture's success. Scripture interprets Scripture, and the prosperity reading dies.",
      correctFeedbackEs: "Correcto. Los versículos 11-12 tratan del contentamiento en abundancia y en escasez. El «todo» del versículo 13 es por tanto estar contento en cada circunstancia — no una garantía divina del éxito de cada empresa. La Escritura interpreta a la Escritura, y la lectura de la prosperidad muere.",
      incorrectFeedbackEn: "Phil 4:13 is not context-free, ancient-only, or inapplicable today. It is a worked example of how the SURROUNDING VERSES rescue a misused favorite verse from the wrong meaning. Read 11-12 first, and 13 says what Paul meant.",
      incorrectFeedbackEs: "Fil 4:13 no es libre de contexto, ni solo antiguo, ni inaplicable hoy. Es un ejemplo trabajado de cómo los VERSÍCULOS CIRCUNDANTES rescatan un versículo favorito mal usado del significado equivocado. Lea 11-12 primero, y 13 dice lo que Pablo quiso decir."
    },
    {
      textEn: "8. When read with Philippians 4:11-12, what does \"I can do all things through Christ who strengthens me\" actually mean?",
      textEs: "8. Cuando se lee con Filipenses 4:11-12, ¿qué significa realmente «todo lo puedo en Cristo que me fortalece»?",
      optionsEn: ["A. Christ guarantees success in any venture I attempt","B. I will be physically protected from all harm","C. I will become a great athlete or businessman","D. I can be content in every circumstance — plenty and want, success and failure"],
      optionsEs: ["A. Cristo garantiza el éxito en cualquier empresa que yo intente","B. Seré físicamente protegido de todo daño","C. Me convertiré en un gran atleta o empresario","D. Puedo estar contento en cada circunstancia — abundancia y escasez, éxito y fracaso"],
      correct: "D",
      correctFeedbackEn: "Correct. Paul's context is contentment: \"I have learned, in whatever state I am, to be content. I know how to be abased, and how to abound.\" The \"all things\" is contentment in every circumstance, not victory in every venture.",
      correctFeedbackEs: "Correcto. El contexto de Pablo es el contentamiento: «he aprendido a contentarme cualquiera que sea mi situación. Sé estar humillado, y sé tener abundancia». El «todo» es el contentamiento en cada circunstancia, no la victoria en cada empresa.",
      incorrectFeedbackEn: "Phil 4:13 is not about athletic success, financial victory, or physical invulnerability. Read in context (11-12 about contentment in plenty and want), it promises stability of soul in every circumstance — far better than what locker-room readings claim.",
      incorrectFeedbackEs: "Fil 4:13 no se trata de éxito atlético, victoria financiera, ni invulnerabilidad física. Leído en contexto (11-12 sobre contentamiento en abundancia y escasez), promete estabilidad del alma en cada circunstancia — mucho mejor de lo que reclaman las lecturas de vestuario."
    },
    {
      textEn: "9. The Eric Booth story (the New York actor) illustrates:",
      textEs: "9. La historia de Eric Booth (el actor neoyorquino) ilustra:",
      optionsEn: ["A. How dramatic recital improves Bible translation","B. How memorizing Scripture in large amounts can transform a secular man into a believer","C. How professional acting techniques should be used in preaching","D. How Mark's Gospel is the easiest to memorize"],
      optionsEs: ["A. Cómo el recital dramático mejora la traducción bíblica","B. Cómo memorizar Escritura en grandes cantidades puede transformar a un hombre secular en un creyente","C. Cómo las técnicas profesionales de actuación deben usarse en la predicación","D. Cómo el Evangelio de Marcos es el más fácil de memorizar"],
      correct: "B",
      correctFeedbackEn: "Correct. Booth came to the work as a secular man with no ax to grind. He simply memorized the lines. By the time he finished, he believed. Scripture in saturation does its own work — the Bible interprets the man who lives inside it.",
      correctFeedbackEs: "Correcto. Booth llegó al trabajo como un hombre secular sin hacha que afilar. Simplemente memorizó las líneas. Al terminar, creía. La Escritura en saturación hace su propia obra — la Biblia interpreta al hombre que vive dentro de ella.",
      incorrectFeedbackEn: "The story is not about translation, performance technique, or Mark's relative difficulty. It is about SATURATION: prolonged exposure to Scripture in large doses changes the person, sometimes against their initial intent. The Bible reads the reader.",
      incorrectFeedbackEs: "La historia no se trata de traducción, técnica de actuación, ni la dificultad relativa de Marcos. Se trata de SATURACIÓN: la exposición prolongada a la Escritura en grandes dosis cambia a la persona, a veces contra su intención inicial. La Biblia lee al lector."
    },
    {
      textEn: "10. The lesson identifies three serious errors that the principle \"Scripture interprets Scripture\" saves the pastor from. The first of these is:",
      textEs: "10. La lección identifica tres errores serios de los cuales el principio «la Escritura interpreta a la Escritura» salva al pastor. El primero es:",
      optionsEn: ["A. Excessive use of cross-references","B. Single-verse cults — building error on one isolated passage","C. Ignoring the New Testament","D. Reading too many commentaries"],
      optionsEs: ["A. El uso excesivo de referencias cruzadas","B. Las sectas de un solo versículo — edificar el error sobre un pasaje aislado","C. Ignorar el Nuevo Testamento","D. Leer demasiados comentarios"],
      correct: "B",
      correctFeedbackEn: "Correct. Almost every modern cult builds on one isolated verse used to override the rest of the Bible. Jehovah's Witnesses lean on a strained reading of John 1:1 while ignoring John 1:14, John 20:28, Hebrews 1:8, Titus 2:13, and many more.",
      correctFeedbackEs: "Correcto. Casi toda secta moderna se edifica sobre un versículo aislado usado para anular el resto de la Biblia. Los Testigos de Jehová se apoyan en una lectura forzada de Juan 1:1 mientras ignoran Juan 1:14, Juan 20:28, Hebreos 1:8, Tito 2:13, y muchos más.",
      incorrectFeedbackEn: "Cross-references, the New Testament, and commentaries are not the errors named. The error is SINGLE-VERSE CULTS: building a whole doctrine on one isolated verse, ignoring all the other Scriptures that contradict the cult's reading of it.",
      incorrectFeedbackEs: "Las referencias cruzadas, el Nuevo Testamento, y los comentarios no son los errores nombrados. El error son las SECTAS DE UN SOLO VERSÍCULO: edificar una doctrina entera sobre un versículo aislado, ignorando todas las otras Escrituras que contradicen la lectura que la secta hace de él."
    },
    {
      textEn: "11. The second error this principle saves the pastor from is:",
      textEs: "11. El segundo error del cual este principio salva al pastor es:",
      optionsEn: ["A. Chain-quoting — stringing together verses that share a single word but not a single meaning","B. Praying too long before sermons","C. Memorizing too much Scripture","D. Studying Greek and Hebrew"],
      optionsEs: ["A. La cadena de citas — hilar versículos que comparten una sola palabra pero no un solo significado","B. Orar demasiado antes de los sermones","C. Memorizar demasiada Escritura","D. Estudiar griego y hebreo"],
      correct: "A",
      correctFeedbackEn: "Correct. A pastor can \"prove\" almost anything by stringing verses that share vocabulary but not meaning. The word fire in Exodus 3, Acts 2, and Hebrews 12 carries different theological weights — chain-quoting collapses them and produces misreadings.",
      correctFeedbackEs: "Correcto. Un pastor puede «probar» casi cualquier cosa hilando versículos que comparten vocabulario pero no significado. La palabra fuego en Éxodo 3, Hechos 2, y Hebreos 12 carga pesos teológicos distintos — la cadena de citas los colapsa y produce malas lecturas.",
      incorrectFeedbackEn: "Long prayer, Scripture memory, and language study are good disciplines, not errors. The error this principle saves the pastor from is CHAIN-QUOTING — connecting verses by shared vocabulary while ignoring their different contexts and meanings.",
      incorrectFeedbackEs: "La oración larga, la memorización de la Escritura, y el estudio de idiomas son buenas disciplinas, no errores. El error del cual este principio salva al pastor es la CADENA DE CITAS — conectar versículos por vocabulario compartido mientras se ignoran sus contextos y significados distintos."
    },
    {
      textEn: "12. The third error this principle saves the pastor from is:",
      textEs: "12. El tercer error del cual este principio salva al pastor es:",
      optionsEn: ["A. Preaching too long","B. Using study Bibles","C. Isolated proof-texting — quoting a verse without asking what other Scripture stands behind and beside it","D. Quoting from memory"],
      optionsEs: ["A. Predicar demasiado tiempo","B. Usar Biblias de estudio","C. El uso aislado de versículos como prueba — citar un versículo sin preguntar qué otra Escritura está detrás y junto a él","D. Citar de memoria"],
      correct: "C",
      correctFeedbackEn: "Correct. Even an accurately quoted verse, in its proper context, with its right meaning, is wise to set in the company of other Scripture. A verse held by its fellows almost cannot be misunderstood; a verse standing alone often can be.",
      correctFeedbackEs: "Correcto. Aun un versículo citado con precisión, en su contexto adecuado, con su significado correcto, es sabio colocarlo en la compañía de otra Escritura. Un versículo sostenido por sus compañeros casi no puede ser mal entendido; un versículo solo a menudo sí.",
      incorrectFeedbackEn: "Length, study Bibles, and memory are not the errors. The error is ISOLATED PROOF-TEXTING — quoting a verse alone without considering what other Scripture says about the same truth. Even accurate quotation benefits from the company of fellow verses.",
      incorrectFeedbackEs: "La duración, las Biblias de estudio, y la memoria no son los errores. El error es el USO AISLADO DE VERSÍCULOS COMO PRUEBA — citar un versículo solo sin considerar qué otra Escritura dice sobre la misma verdad. Aun la cita precisa se beneficia de la compañía de versículos hermanos."
    },
    {
      textEn: "13. The lesson identifies a Jehovah's Witness use of John 1:1 as an example of:",
      textEs: "13. La lección identifica un uso por parte de los Testigos de Jehová de Juan 1:1 como un ejemplo de:",
      optionsEn: ["A. A single-verse cult building error on one isolated passage","B. A legitimate alternative reading","C. Greek scholarship at its finest","D. A successful exegetical tradition"],
      optionsEs: ["A. Una secta de un solo versículo edificando el error sobre un pasaje aislado","B. Una lectura alternativa legítima","C. La erudición griega en su mejor expresión","D. Una tradición exegética exitosa"],
      correct: "A",
      correctFeedbackEn: "Correct. The JW denial of Christ's deity hangs on a strained reading of John 1:1 while ignoring John 1:14, John 20:28, Hebrews 1:8, Titus 2:13, and dozens of other passages that affirm what John 1:1 plainly says. Single-verse cult.",
      correctFeedbackEs: "Correcto. La negación de la deidad de Cristo por los TJ cuelga de una lectura forzada de Juan 1:1 mientras ignora Juan 1:14, Juan 20:28, Hebreos 1:8, Tito 2:13, y docenas de otros pasajes que afirman lo que Juan 1:1 dice claramente. Secta de un solo versículo.",
      incorrectFeedbackEn: "The JW reading of John 1:1 is not legitimate, scholarly, or exegetically successful. It is the textbook case of a single-verse cult: isolate one passage, ignore the rest of the canon, and build a doctrine that contradicts what the Bible repeatedly affirms.",
      incorrectFeedbackEs: "La lectura TJ de Juan 1:1 no es legítima, ni erudita, ni exegéticamente exitosa. Es el caso clásico de una secta de un solo versículo: aislar un pasaje, ignorar el resto del canon, y edificar una doctrina que contradice lo que la Biblia afirma repetidamente."
    },
    {
      textEn: "14. The famous response of the two Emmaus disciples after Jesus opened the Scriptures to them was:",
      textEs: "14. La famosa respuesta de los dos discípulos de Emaús después de que Jesús les abriera las Escrituras fue:",
      optionsEn: ["A. \"What a clever Bible study that was\"","B. \"We need to write this down for the church\"","C. \"Did not our heart burn within us?\"","D. \"How can these things be?\""],
      optionsEs: ["A. «Qué estudio bíblico tan ingenioso fue ése»","B. «Necesitamos escribir esto para la iglesia»","C. «¿No ardía nuestro corazón en nosotros?»","D. «¿Cómo puede ser esto?»"],
      correct: "C",
      correctFeedbackEn: "Correct (Luke 24:32). The payoff of Scripture interprets Scripture is not better lecture notes or a more impressive doctrinal statement. It is a burning heart. When the parts begin to speak to each other, fire follows.",
      correctFeedbackEs: "Correcto (Lucas 24:32). El resultado de la Escritura interpretando a la Escritura no son mejores apuntes de conferencia ni una declaración doctrinal más impresionante. Es un corazón ardiente. Cuando las partes comienzan a hablarse entre sí, sigue el fuego.",
      incorrectFeedbackEn: "The Emmaus disciples did not respond with academic commentary, archival concern, or Nicodemus's puzzled question. They responded with FIRE: \"Did not our heart burn within us while He talked with us on the road, and while He opened the Scriptures to us?\"",
      incorrectFeedbackEs: "Los discípulos de Emaús no respondieron con comentario académico, ni con preocupación archivística, ni con la pregunta desconcertada de Nicodemo. Respondieron con FUEGO: «¿No ardía nuestro corazón en nosotros, mientras nos hablaba en el camino, y cuando nos abría las Escrituras?»"
    },
    {
      textEn: "15. According to the lesson, if a pastor's sermons leave hearers \"informed but unwarmed,\" the usual issue is:",
      textEs: "15. Según la lección, si los sermones de un pastor dejan a los oyentes «informados pero no calentados», el problema usual es:",
      optionsEn: ["A. The parts of the Bible have not yet been allowed to speak to each other in his study","B. The translation is wrong","C. The congregation is too small","D. The pastor needs a better microphone"],
      optionsEs: ["A. Las partes de la Biblia no han sido dejadas todavía hablarse entre sí en su estudio","B. La traducción está equivocada","C. La congregación es demasiado pequeña","D. El pastor necesita un mejor micrófono"],
      correct: "A",
      correctFeedbackEn: "Correct. The problem is rarely delivery. The problem is usually that the canonical connections have not yet been made in the pastor's study. Sit with two passages until you see how they hold each other. The burn comes when the connections come.",
      correctFeedbackEs: "Correcto. El problema rara vez es la entrega. El problema es generalmente que las conexiones canónicas todavía no se han hecho en el estudio del pastor. Siéntese con dos pasajes hasta ver cómo se sostienen una a la otra. El ardor viene cuando llegan las conexiones.",
      incorrectFeedbackEn: "Translation, congregation size, and equipment are not the heart of the issue. The lesson teaches that a cold sermon usually traces back to a study where the parts of the Bible have not yet been allowed to talk to each other.",
      incorrectFeedbackEs: "La traducción, el tamaño de la congregación, y el equipo no son el corazón del asunto. La lección enseña que un sermón frío usualmente se remonta a un estudio donde las partes de la Biblia todavía no han sido dejadas hablar entre sí."
    },
    {
      textEn: "16. The lesson recommends three practical habits for a pastor who lets Scripture interpret Scripture. The first habit is:",
      textEs: "16. La lección recomienda tres hábitos prácticos para un pastor que deja que la Escritura interprete a la Escritura. El primer hábito es:",
      optionsEn: ["A. Listening to many sermons each week","B. Watching Christian television","C. Joining several denominations","D. Cross-referencing — looking up the parallel passages your study Bible lists in the margin"],
      optionsEs: ["A. Escuchar muchos sermones cada semana","B. Ver televisión cristiana","C. Unirse a varias denominaciones","D. Las referencias cruzadas — buscar los pasajes paralelos que su Biblia de estudio enumera en el margen"],
      correct: "D",
      correctFeedbackEn: "Correct. Look up every reference, read it in its own paragraph. Half an hour of cross-referencing teaches more than half a day of reading commentaries about a verse. The parallels train your eye to see how the Bible speaks to itself.",
      correctFeedbackEs: "Correcto. Busque cada referencia, léala en su propio párrafo. Media hora de referencias cruzadas enseña más que medio día de leer comentarios sobre un versículo. Los paralelos entrenan su ojo para ver cómo la Biblia se habla a sí misma.",
      incorrectFeedbackEn: "Sermons, television, and multiple denominations do not train a pastor to handle the canon. CROSS-REFERENCING does — the slow, simple work of looking up every parallel passage and reading it in its own paragraph.",
      incorrectFeedbackEs: "Los sermones, la televisión, y las múltiples denominaciones no entrenan a un pastor a manejar el canon. LAS REFERENCIAS CRUZADAS sí — el trabajo lento y sencillo de buscar cada pasaje paralelo y leerlo en su propio párrafo."
    },
    {
      textEn: "17. The second practical habit the lesson recommends is:",
      textEs: "17. El segundo hábito práctico que la lección recomienda es:",
      optionsEn: ["A. Memorizing the entire Bible by age forty","B. Concordance work — looking up every occurrence of a word that matters to your text","C. Visiting Israel every year","D. Avoiding all Bible study guides"],
      optionsEs: ["A. Memorizar la Biblia entera para los cuarenta años","B. El trabajo con concordancia — buscar cada vez que aparece una palabra que importa para su texto","C. Visitar Israel cada año","D. Evitar todas las guías de estudio bíblico"],
      correct: "B",
      correctFeedbackEn: "Correct. Tracing a word through every appearance teaches the range of meanings God has given it. Faith, righteousness, justify, flesh, spirit, world — almost every important biblical word carries shades a pastor needs to know.",
      correctFeedbackEs: "Correcto. Rastrear una palabra a través de cada aparición enseña el rango de significados que Dios le ha dado. Fe, justicia, justificar, carne, espíritu, mundo — casi cada palabra bíblica importante carga matices que un pastor necesita conocer.",
      incorrectFeedbackEn: "Bible memorization by 40, travel to Israel, and avoiding study guides are not the lesson's practical recommendations. The practical habit is CONCORDANCE WORK — tracing important words through every passage where they appear.",
      incorrectFeedbackEs: "La memorización de la Biblia para los 40, los viajes a Israel, y evitar guías de estudio no son las recomendaciones prácticas de la lección. El hábito práctico es EL TRABAJO CON CONCORDANCIA — rastrear palabras importantes a través de cada pasaje donde aparecen."
    },
    {
      textEn: "18. The third practical habit the lesson recommends is:",
      textEs: "18. El tercer hábito práctico que la lección recomienda es:",
      optionsEn: ["A. Whole-Bible reading — reading the Bible through every year if possible","B. Speed-reading on Sunday afternoons","C. Reading only the New Testament","D. Reading only with commentaries"],
      optionsEs: ["A. La lectura de la Biblia entera — leerla completa cada año si es posible","B. Lectura rápida los domingos por la tarde","C. Leer solo el Nuevo Testamento","D. Leer solo con comentarios"],
      correct: "A",
      correctFeedbackEn: "Correct. A pastor who has never read the whole Bible through cannot let Scripture interpret Scripture, because he does not yet know what Scripture says. Read it through every year. The cross-references you cannot look up will rise unbidden in your preaching.",
      correctFeedbackEs: "Correcto. Un pastor que nunca ha leído la Biblia entera no puede dejar que la Escritura interprete a la Escritura, porque todavía no sabe lo que la Escritura dice. Léala completa cada año. Las referencias cruzadas que no podrá buscar surgirán sin invitación en su predicación.",
      incorrectFeedbackEn: "Speed-reading, partial canon, and commentary-only reading all fail to give the pastor command of the whole Bible. WHOLE-BIBLE READING through every year is the slow discipline that gives a pastor unsearchable cross-references stored within himself.",
      incorrectFeedbackEs: "La lectura rápida, el canon parcial, y la lectura solo con comentarios todos fallan en darle al pastor el dominio de la Biblia entera. LA LECTURA DE LA BIBLIA ENTERA cada año es la disciplina lenta que le da a un pastor referencias cruzadas inagotables almacenadas dentro de sí mismo."
    },
    {
      textEn: "19. According to the lesson, what did the Emmaus disciples do immediately after Jesus revealed Himself and disappeared?",
      textEs: "19. Según la lección, ¿qué hicieron inmediatamente los discípulos de Emaús después de que Jesús se les reveló y desapareció?",
      optionsEn: ["A. They went to bed for the night, planning to tell the others in the morning","B. They wrote a written account of what had happened","C. They began to argue about what they had just seen","D. They got up that same hour and walked the seven miles back to Jerusalem in the dark"],
      optionsEs: ["A. Se fueron a dormir esa noche, planeando contar a los otros en la mañana","B. Escribieron un relato de lo que había sucedido","C. Comenzaron a discutir sobre lo que acababan de ver","D. Se levantaron en esa misma hora y caminaron las siete millas de regreso a Jerusalén en la oscuridad"],
      correct: "D",
      correctFeedbackEn: "Correct. A burning heart cannot be kept indoors. They walked back through the night to tell the others. When the Word has burned in the pastor's study, his Sunday is not a duty — it is a delivery he cannot wait to make.",
      correctFeedbackEs: "Correcto. Un corazón ardiente no puede quedarse encerrado en casa. Caminaron de regreso durante la noche para contar a los otros. Cuando la Palabra ha ardido en el estudio del pastor, su domingo no es un deber — es una entrega que no puede esperar hacer.",
      incorrectFeedbackEn: "The Emmaus disciples did not wait, write, or argue. They IMMEDIATELY walked the seven miles back through the night to tell the others. Luke says they rose \"that same hour.\" A burning heart cannot be put off until morning.",
      incorrectFeedbackEs: "Los discípulos de Emaús no esperaron, ni escribieron, ni discutieron. INMEDIATAMENTE caminaron las siete millas de regreso durante la noche para contar a los otros. Lucas dice que se levantaron «en aquella misma hora». Un corazón ardiente no puede posponerse hasta la mañana."
    },
    {
      textEn: "20. The closing charge of this unit is:",
      textEs: "20. El encargo de cierre de esta unidad es:",
      optionsEn: ["A. Memorize at least ten verses each week","B. Read only the New Testament","C. Avoid all cross-referencing","D. Preach what burns — what the canon has hammered into one shape"],
      optionsEs: ["A. Memorice al menos diez versículos cada semana","B. Lea solo el Nuevo Testamento","C. Evite todas las referencias cruzadas","D. Predique lo que arde — lo que el canon ha martillado en una sola forma"],
      correct: "D",
      correctFeedbackEn: "Correct. Preach what burns. Preach what holds together. When Scripture interprets Scripture in the study, the pastor does not need to manufacture enthusiasm in the pulpit. The fire is already there; his job is only to bring it down without smothering it.",
      correctFeedbackEs: "Correcto. Predique lo que arde. Predique lo que se sostiene unido. Cuando la Escritura interpreta a la Escritura en el estudio, el pastor no necesita fabricar entusiasmo en el púlpito. El fuego ya está ahí; su tarea es solo llevarlo abajo sin sofocarlo.",
      incorrectFeedbackEn: "Memorization volume, partial canon, and avoiding cross-references all contradict the unit. The closing charge is to PREACH WHAT BURNS — what the whole canon, working on itself, has shaped into one truth the pastor cannot help but proclaim.",
      incorrectFeedbackEs: "El volumen de memorización, el canon parcial, y evitar las referencias cruzadas todos contradicen la unidad. El encargo de cierre es PREDICAR LO QUE ARDE — lo que el canon entero, obrando sobre sí mismo, ha formado en una verdad que el pastor no puede sino proclamar."
    }
  ];

const kwQuestions = [
    {
      textEn: "21. Tell the Emmaus-road story (Luke 24:13-32) and explain why this lesson calls it the most important hermeneutics lesson ever given.",
      textEs: "21. Cuente la historia del camino a Emaús (Lucas 24:13-32) y explique por qué esta lección la llama la lección de hermenéutica más importante jamás dada.",
      kw_en: ["Emmaus", "disciples", "Jesus", "Moses", "Prophets", "Scriptures", "Himself", "road"],
      kw_es: ["Emaús", "discípulos", "Jesús", "Moisés", "Profetas", "Escrituras", "Mismo", "camino"],
      modelEn: "On the first Easter two heartbroken disciples walked the road to Emmaus, and a Stranger — the risen Jesus — joined them. Beginning at Moses and all the Prophets, He expounded in all the Scriptures the things concerning Himself. The lesson calls this the most important hermeneutics lesson ever given because Jesus shows that all of Scripture points to Him.",
      modelEs: "En el primer domingo de resurrección dos discípulos abatidos caminaban por el camino a Emaús, y un Desconocido — el Jesús resucitado — se les unió. Comenzando por Moisés y todos los Profetas, les explicó en todas las Escrituras las cosas acerca de Sí mismo. La lección la llama la lección de hermenéutica más importante jamás dada porque Jesús muestra que toda la Escritura apunta a Él."
    },
    {
      textEn: "22. Explain the doctrine of canonical unity and why it grounds the principle \"Scripture interprets Scripture.\"",
      textEs: "22. Explique la doctrina de la unidad canónica y por qué fundamenta el principio «la Escritura interpreta a la Escritura».",
      kw_en: ["books", "authors", "Spirit", "inspired", "coherent", "unity", "Bible", "one"],
      kw_es: ["libros", "autores", "Espíritu", "inspir", "coherente", "unidad", "Biblia", "único"],
      modelEn: "Canonical unity means that though the Bible's many books were written by dozens of human authors across centuries, one divine Author — the Holy Spirit — inspired them all, giving the whole a single coherent message. Because the sixty-six books form one unified book, a clear passage in one place may be used to interpret a difficult one in another. The unity grounds the principle that Scripture interprets Scripture.",
      modelEs: "La unidad canónica significa que aunque los muchos libros de la Biblia fueron escritos por decenas de autores humanos a lo largo de siglos, un solo Autor divino — el Espíritu Santo — los inspiró a todos, dando al conjunto un mensaje coherente y único. Porque los sesenta y seis libros forman un solo libro unido, un pasaje claro puede usarse para interpretar uno difícil. La unidad fundamenta el principio de que la Escritura interpreta la Escritura."
    },
    {
      textEn: "23. Describe the three-fold cord that holds each verse in place. Name and explain each of its three strands.",
      textEs: "23. Describa el cordón de tres dobleces que sostiene cada versículo en su lugar. Nombre y explique cada uno de sus tres dobleces.",
      kw_en: ["clear", "illumin", "difficult", "repeated", "outweigh", "canon", "whole", "strand"],
      kw_es: ["claro", "ilumin", "difícil", "repet", "pesa", "canon", "entero", "cordón"],
      modelEn: "The three-fold cord holds each verse with three strands. First, clear passages illumine the difficult ones. Second, a truth repeated across many texts outweighs a meaning drawn from a single obscure verse. Third, the whole canon surrounds and anchors each verse. Together the three strands keep any one verse from being pulled out of place.",
      modelEs: "El cordón de tres dobleces sostiene cada versículo con tres hebras. Primero, los pasajes claros iluminan los difíciles. Segundo, una verdad repetida en muchos textos pesa más que un significado sacado de un solo versículo oscuro. Tercero, todo el canon entero rodea y ancla cada versículo. Juntas las tres hebras evitan que un versículo sea sacado de su lugar."
    },
    {
      textEn: "24. Take Philippians 4:13 as your worked example. Show how reading verses 11-12 with it transforms the meaning and refutes the prosperity-gospel reading.",
      textEs: "24. Tome Filipenses 4:13 como ejemplo trabajado. Muestre cómo leer los versículos 11-12 con él transforma el significado y refuta la lectura del evangelio de la prosperidad.",
      kw_en: ["Philippians", "content", "want", "circumstance", "Christ", "prosperity", "strength", "learn"],
      kw_es: ["Filipenses", "content", "abund", "humill", "circunstancia", "Cristo", "prosperidad", "fuerza"],
      modelEn: "Philippians 4:13 — 'I can do all things through Christ' — is not a promise of achievement or wealth. Read with verses 11-12, Paul has learned to be content whether abased or abounding, in want or in plenty. The 'all things' is enduring every circumstance through Christ's strength, which refutes the prosperity reading.",
      modelEs: "Filipenses 4:13 — «todo lo puedo en Cristo» — no es una promesa de logro ni de riqueza. Leído con los versículos 11-12, Pablo ha aprendido a estar contento ya sea humillado o teniendo abundancia, en escasez o en hartura. El «todo» es soportar cualquier circunstancia por la fuerza de Cristo, lo cual refuta la lectura de prosperidad."
    },
    {
      textEn: "25. Tell the Eric Booth story (the New York actor memorizing Mark's Gospel) and explain what it teaches about Scripture's transforming power when read in saturation.",
      textEs: "25. Cuente la historia de Eric Booth (el actor neoyorquino memorizando el Evangelio de Marcos) y explique lo que enseña sobre el poder transformador de la Escritura cuando se lee en saturación.",
      kw_en: ["Booth", "actor", "Mark", "memorize", "secular", "saturation", "faith", "Gospel"],
      kw_es: ["Booth", "actor", "Marcos", "memoriz", "secular", "saturación", "fe", "Evangelio"],
      modelEn: "Eric Booth was a secular New York actor cast to recite the whole Gospel of Mark from memory, with no ax to grind. As he memorized the lines, the work began to do its own work on him, and the saturated Word brought the unbelieving actor to faith. The story shows Scripture's transforming power when it is taken in by saturation.",
      modelEs: "Eric Booth era un actor secular de Nueva York contratado para recitar de memoria todo el Evangelio de Marcos, sin nada que defender. Mientras memorizaba las líneas, la obra empezó a hacer su propia obra en él, y la Palabra saturada llevó al actor incrédulo a la fe. La historia muestra el poder transformador de la Escritura cuando se recibe por saturación."
    },
    {
      textEn: "26. Name the three errors that the principle of Scripture-interprets-Scripture saves the pastor from, and briefly describe each.",
      textEs: "26. Nombre los tres errores de los cuales el principio de la Escritura-interpretando-a-la-Escritura salva al pastor, y describa brevemente cada uno.",
      kw_en: ["single", "verse", "cult", "chain", "proof", "isolated", "quoting", "context"],
      kw_es: ["solo", "versículo", "secta", "cadena", "prueba", "aislado", "citar", "contexto"],
      modelEn: "The principle saves the pastor from three errors: building doctrine on a single isolated verse; the cult habit of chain-quoting verses out of context to prove a system; and proof-texting that ignores everything the rest of the canon says. Letting Scripture interpret Scripture keeps no verse standing alone.",
      modelEs: "El principio salva al pastor de tres errores: edificar doctrina sobre un solo versículo aislado; el hábito de las sectas de citar versículos en cadena fuera de contexto para probar un sistema; y sacar textos de prueba que ignoran todo lo que dice el resto del canon. Dejar que la Escritura interprete la Escritura impide que un versículo quede solo."
    },
    {
      textEn: "27. Explain how a single-verse cult (such as the Jehovah's Witness use of John 1:1) is corrected by the principle of Scripture-interprets-Scripture.",
      textEs: "27. Explique cómo una secta de un solo versículo (como el uso por los Testigos de Jehová de Juan 1:1) es corregida por el principio de la Escritura-interpretando-a-la-Escritura.",
      kw_en: ["cult", "John", "deity", "canon", "ignore", "contradict", "passages", "Christ"],
      kw_es: ["secta", "Juan", "deidad", "canon", "ignor", "contrad", "pasajes", "Cristo"],
      modelEn: "A single-verse cult like the Jehovah's Witnesses leans on John 1:1, rendering it 'the Word was a god' to deny Christ's deity. The principle corrects this by reading the verse against the whole canon: the many passages that affirm Christ as God cannot be ignored or contradicted by one disputed translation. Scripture interpreting Scripture protects His deity.",
      modelEs: "Una secta de un solo versículo como los Testigos de Jehová se apoya en Juan 1:1, traduciéndolo «el Verbo era un dios» para negar la deidad de Cristo. El principio lo corrige al leer el versículo frente a todo el canon: los muchos pasajes que afirman a Cristo como Dios no pueden ser ignorados ni contradichos por una sola traducción discutida. La Escritura interpretando a la Escritura protege Su deidad."
    },
    {
      textEn: "28. Discuss Luke 24:32 — \"Did not our heart burn within us?\" — and explain why this verse describes the true payoff of Scripture-interprets-Scripture.",
      textEs: "28. Comente Lucas 24:32 — «¿no ardía nuestro corazón en nosotros?» — y explique por qué este versículo describe el verdadero resultado de la Escritura-interpretando-a-la-Escritura.",
      kw_en: ["heart", "burn", "road", "Scriptures", "opened", "payoff", "fire", "Spirit"],
      kw_es: ["coraz", "ardía", "camino", "Escrituras", "abría", "fuego", "resultado", "Espíritu"],
      modelEn: "On the Emmaus road the disciples asked, 'Did not our heart burn within us while He opened the Scriptures to us?' That burning heart is the payoff of Scripture-interpreting-Scripture — not better lecture notes but a fire the Spirit lights when the parts of the Bible speak to each other. The Word given by the Spirit is opened by the Spirit and warms the people of the Spirit.",
      modelEs: "En el camino a Emaús los discípulos preguntaron: «¿No ardía nuestro corazón mientras nos abría las Escrituras?» Ese corazón ardiente es el resultado de la Escritura-que-interpreta-la-Escritura — no mejores apuntes sino un fuego que el Espíritu enciende cuando las partes de la Biblia se hablan entre sí. La Palabra dada por el Espíritu es abierta por el Espíritu y calienta al pueblo del Espíritu."
    },
    {
      textEn: "29. Name the three practical habits this lesson recommends for forming a pastor who lets Scripture interpret Scripture, and briefly explain each.",
      textEs: "29. Nombre los tres hábitos prácticos que esta lección recomienda para formar a un pastor que deja que la Escritura interprete a la Escritura, y explique brevemente cada uno.",
      kw_en: ["cross", "reference", "concordance", "whole", "Bible", "reading", "habit", "compare"],
      kw_es: ["cruzada", "referencia", "concordancia", "entera", "Biblia", "lectura", "hábito", "comparar"],
      modelEn: "The lesson recommends three habits: use cross-references to let one text point to another, keep a concordance to trace a word across the canon, and make the regular reading of the whole Bible a habit so its parts live together in your mind. These habits form a pastor who lets Scripture interpret Scripture by comparing text with text.",
      modelEs: "La lección recomienda tres hábitos: usar referencias cruzadas para que un texto señale a otro, tener una concordancia para rastrear una palabra por el canon, y hacer de la lectura de la Biblia entera un hábito para que sus partes vivan juntas en la mente. Estos hábitos forman a un pastor que deja que la Escritura interprete la Escritura comparando texto con texto."
    },
    {
      textEn: "30. Explain what it means that \"the Bible interprets the man who lives inside it\" and why this connects Scripture-interprets-Scripture to the pastor's own transformation.",
      textEs: "30. Explique qué significa que «la Biblia interpreta al hombre que vive dentro de ella» y por qué esto conecta la Escritura-interpretando-a-la-Escritura con la transformación del pastor mismo.",
      kw_en: ["saturation", "pastor", "transform", "categories", "metaphors", "interprets", "inside", "Bible"],
      kw_es: ["saturación", "pastor", "transform", "categorías", "metáforas", "interpreta", "dentro", "Biblia"],
      modelEn: "When a pastor lives inside the Bible long enough, the Bible begins to interpret him: its saturation transforms his thinking until his categories and metaphors become biblical ones. This connects Scripture-interprets-Scripture to the pastor's own transformation — the Word he interprets all week ends up interpreting and reshaping the man himself.",
      modelEs: "Cuando un pastor vive dentro de la Biblia el tiempo suficiente, la Biblia empieza a interpretarlo a él: su saturación transforma su pensamiento hasta que sus categorías y metáforas se vuelven bíblicas. Esto conecta la Escritura-que-interpreta-la-Escritura con la propia transformación del pastor — la Palabra que interpreta toda la semana termina interpretando y remodelando al hombre mismo."
    }
  ];
