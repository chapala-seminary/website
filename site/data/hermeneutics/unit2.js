/* CTSHermeneutics - unit 2: per-unit configuration and content. */

const UNIT = 2;

const NEXT_UNIT_URL = "CTSHermeneuticsUnit3.html";

const PREV_UNIT_URL = "CTSHermeneuticsUnit1.html";

const IS_FINAL_UNIT = false;

const SHOW_REGISTRATION = false;

const mcQuestions = [
    {
      textEn: "1. According to 1 Corinthians 2:10-11, who alone knows the deep things of God?",
      textEs: "1. Según 1 Corintios 2:10-11, ¿quién es el único que conoce las cosas profundas de Dios?",
      optionsEn: ["A. The most learned scholars","B. The Spirit of God","C. The original authors of Scripture","D. The ancient apostles"],
      optionsEs: ["A. Los eruditos más doctos","B. El Espíritu de Dios","C. Los autores originales de la Escritura","D. Los antiguos apóstoles"],
      correct: "B",
      correctFeedbackEn: "Correct. Just as only my own spirit knows what I am thinking, only the Spirit of God knows the mind of God. He has been given to us so we may understand the things freely given by God.",
      correctFeedbackEs: "Correcto. Así como solo mi propio espíritu conoce lo que pienso, solo el Espíritu de Dios conoce la mente de Dios. Nos ha sido dado para que podamos entender las cosas que Dios nos ha dado.",
      incorrectFeedbackEn: "Scholars, original authors, and apostles all served as instruments, but none of them — by themselves — can give a believer access to the deep things of God. Only the Spirit can.",
      incorrectFeedbackEs: "Eruditos, autores originales, y apóstoles sirvieron todos como instrumentos, pero ninguno de ellos, por sí mismo, puede dar al creyente acceso a las cosas profundas de Dios. Solo el Espíritu puede."
    },
    {
      textEn: "2. According to Paul in 1 Corinthians 2:14, the natural man:",
      textEs: "2. Según Pablo en 1 Corintios 2:14, el hombre natural:",
      optionsEn: ["A. Cannot receive or understand the things of God's Spirit","B. Can grasp Scripture easily with enough study","C. Is naturally drawn to spiritual things","D. Always rejects truth on purpose"],
      optionsEs: ["A. No puede recibir ni entender las cosas del Espíritu de Dios","B. Puede captar la Escritura fácilmente con suficiente estudio","C. Es atraído naturalmente a las cosas espirituales","D. Siempre rechaza la verdad a propósito"],
      correct: "A",
      correctFeedbackEn: "Correct. Paul says they are foolishness to the natural man, and he cannot know them because they are spiritually discerned. A brilliant unbeliever cannot read the Bible well; a simple believer with the Spirit can.",
      correctFeedbackEs: "Correcto. Pablo dice que son locura para el hombre natural, y no las puede entender porque se han de discernir espiritualmente. Un incrédulo brillante no puede leer bien la Biblia; un creyente sencillo con el Espíritu sí puede.",
      incorrectFeedbackEn: "The verse says spiritual things are foolishness to the natural man and that he CANNOT know them. The problem is not effort or intent — it is a missing faculty. Only the Spirit can give what the natural man lacks.",
      incorrectFeedbackEs: "El versículo dice que las cosas espirituales son locura para el hombre natural y que NO PUEDE entenderlas. El problema no es esfuerzo ni intención: es una facultad ausente. Solo el Espíritu puede dar lo que al hombre natural le falta."
    },
    {
      textEn: "3. According to the lesson, the first qualification for understanding the Bible is:",
      textEs: "3. Según la lección, la primera condición para entender la Biblia es:",
      optionsEn: ["A. A theological degree","B. A complete library of commentaries","C. Knowledge of Hebrew and Greek","D. The presence and help of the Holy Spirit"],
      optionsEs: ["A. Un título teológico","B. Una biblioteca completa de comentarios","C. Conocimiento del hebreo y del griego","D. La presencia y la ayuda del Espíritu Santo"],
      correct: "D",
      correctFeedbackEn: "Correct. Paul himself was a trained scholar, so this is not anti-intellectualism. But the first qualification is not a library card; it is a Helper. The Spirit of God must teach the pastor before the pastor teaches anyone.",
      correctFeedbackEs: "Correcto. Pablo mismo era un erudito formado, así que esto no es anti-intelectualismo. Pero la primera condición no es una credencial de biblioteca; es un Ayudador. El Espíritu de Dios debe enseñar al pastor antes de que el pastor enseñe a nadie.",
      incorrectFeedbackEn: "Degrees, libraries, and languages are useful tools, but Scripture is clear: only the Spirit gives access to the deep things of God. The first qualification is the Helper, not the credentials.",
      incorrectFeedbackEs: "Los títulos, las bibliotecas, y los idiomas son herramientas útiles, pero la Escritura es clara: solo el Espíritu da acceso a las cosas profundas de Dios. La primera condición es el Ayudador, no las credenciales."
    },
    {
      textEn: "4. The lesson teaches that hermeneutics is, in the end:",
      textEs: "4. La lección enseña que la hermenéutica es, al final:",
      optionsEn: ["A. A technique to be mastered through repetition","B. A conversation between three Persons and the preacher","C. The work of seminary professors alone","D. An ancient art with limited modern relevance"],
      optionsEs: ["A. Una técnica que se domina por repetición","B. Una conversación entre tres Personas y el predicador","C. La obra de profesores de seminario solamente","D. Un arte antiguo de poca relevancia moderna"],
      correct: "B",
      correctFeedbackEn: "Correct. The Father who gave the Word, the Son who is the Word made flesh, the Spirit who interprets the Word — and one preacher who has come quietly to the page with his heart in his hands.",
      correctFeedbackEs: "Correcto. El Padre que dio la Palabra, el Hijo que es la Palabra hecha carne, el Espíritu que interpreta la Palabra — y un predicador que ha venido en silencio a la página con su corazón en las manos.",
      incorrectFeedbackEn: "Hermeneutics is not finally a technique to memorize or an academic monopoly. It is a personal conversation between the Triune God who authored the Word and the preacher who has come humbly to read it.",
      incorrectFeedbackEs: "La hermenéutica no es al final una técnica para memorizar ni un monopolio académico. Es una conversación personal entre el Dios Trino que es Autor de la Palabra y el predicador que ha venido humildemente a leerla."
    },
    {
      textEn: "5. Ezra 7:10 is connected to this unit because it teaches that the pastor:",
      textEs: "5. Esdras 7:10 se conecta con esta unidad porque enseña que el pastor:",
      optionsEn: ["A. Should research the text before he prays over it","B. Should write his sermon before reading the passage","C. Should prepare his heart before he opens the page","D. Should consult three commentaries before deciding"],
      optionsEs: ["A. Debe investigar el texto antes de orar sobre él","B. Debe escribir su sermón antes de leer el pasaje","C. Debe preparar su corazón antes de abrir la página","D. Debe consultar tres comentarios antes de decidir"],
      correct: "C",
      correctFeedbackEn: "Correct. Ezra prepared not his notes nor his outline, but his heart. The pastor comes to the desk on Monday morning not first to think, but first to bow.",
      correctFeedbackEs: "Correcto. Esdras preparó no sus notas ni su bosquejo, sino su corazón. El pastor viene al escritorio el lunes por la mañana no primero a pensar, sino primero a inclinarse.",
      incorrectFeedbackEn: "Ezra 7:10 is explicit: he prepared his HEART. Not research, not an outline, not commentaries — but the inward posture in which all the other work must be done.",
      incorrectFeedbackEs: "Esdras 7:10 es explícito: preparó su CORAZÓN. Ni investigación, ni bosquejo, ni comentarios — sino la postura interior en la que toda la otra labor debe hacerse."
    },
    {
      textEn: "6. According to the lesson, what is the antidote to eisegesis (reading our own meaning into the text)?",
      textEs: "6. Según la lección, ¿cuál es el antídoto contra la eiségesis (leer nuestro propio significado dentro del texto)?",
      optionsEn: ["A. Memorizing more verses","B. A humble heart, brought daily under the Author's gaze, asking for help","C. Reading only modern translations","D. Avoiding the Old Testament"],
      optionsEs: ["A. Memorizar más versículos","B. Un corazón humilde, traído cada día bajo la mirada del Autor, pidiendo ayuda","C. Leer solo traducciones modernas","D. Evitar el Antiguo Testamento"],
      correct: "B",
      correctFeedbackEn: "Correct. A pastor who comes proud will read his pride back out of the page. A pastor who comes broken and asking will be answered. The antidote to eisegesis is a heart prepared by humility and prayer.",
      correctFeedbackEs: "Correcto. Un pastor que viene orgulloso leerá su orgullo de regreso desde la página. Un pastor que viene quebrantado y pidiendo será respondido. El antídoto contra la eiségesis es un corazón preparado por humildad y oración.",
      incorrectFeedbackEn: "Memorization, translation choices, and Old-Testament avoidance do nothing about the heart. Eisegesis is fundamentally a heart problem. The cure is a humble heart in daily prayer, not a method on the desk.",
      incorrectFeedbackEs: "La memorización, la elección de traducción, y evitar el Antiguo Testamento no hacen nada por el corazón. La eiségesis es fundamentalmente un problema del corazón. La cura es un corazón humilde en oración diaria, no un método sobre el escritorio."
    },
    {
      textEn: "7. According to James 1:5, what does God give to those who ask for wisdom?",
      textEs: "7. Según Santiago 1:5, ¿qué le da Dios a los que piden sabiduría?",
      optionsEn: ["A. A measured response delayed by years","B. Wisdom only after seven years of formal study","C. The exact wisdom He once gave Solomon","D. Wisdom liberally and without reproach"],
      optionsEs: ["A. Una respuesta medida y retrasada por años","B. Sabiduría solo después de siete años de estudio formal","C. Exactamente la sabiduría que dio a Salomón","D. Sabiduría abundantemente y sin reproche"],
      correct: "D",
      correctFeedbackEn: "Correct. God gives liberally and without reproach — He is not stingy, and He does not scold the one who asks. The pastor who asks for wisdom over a text receives wisdom over a text.",
      correctFeedbackEs: "Correcto. Dios da abundantemente y sin reproche — no es tacaño, y no regaña al que pide. El pastor que pide sabiduría sobre un texto recibe sabiduría sobre ese texto.",
      incorrectFeedbackEn: "James says God gives LIBERALLY (generously) and WITHOUT REPROACH (no scolding). There is no delay, no quota of study, no Solomon-special. He answers the one who asks in faith.",
      incorrectFeedbackEs: "Santiago dice que Dios da ABUNDANTEMENTE (generosamente) y SIN REPROCHE (sin regaños). No hay demora, ni cuota de estudio, ni un Salomón especial. Responde al que pide con fe."
    },
    {
      textEn: "8. James 1:6-8 warns that the double-minded man:",
      textEs: "8. Santiago 1:6-8 advierte que el hombre de doble ánimo:",
      optionsEn: ["A. Will receive a partial answer","B. Will eventually be granted his request","C. Should pray louder and longer","D. Will receive nothing from the Lord"],
      optionsEs: ["A. Recibirá una respuesta parcial","B. Eventualmente se le concederá su petición","C. Debe orar más fuerte y por más tiempo","D. No recibirá nada del Señor"],
      correct: "D",
      correctFeedbackEn: "Correct. James says the double-minded man — half asking, half doubting, tossed like a wave — should not suppose he will receive anything from the Lord. Faith in prayer matters.",
      correctFeedbackEs: "Correcto. Santiago dice que el hombre de doble ánimo — medio pidiendo, medio dudando, agitado como una ola — no suponga que recibirá cosa alguna del Señor. La fe en la oración importa.",
      incorrectFeedbackEn: "James is severe here. The double-minded man receives NOTHING — not a partial answer, not a delayed answer. He is unstable in all his ways. The remedy is single-minded faith, not louder volume.",
      incorrectFeedbackEs: "Santiago es severo aquí. El hombre de doble ánimo no recibe NADA — ni una respuesta parcial, ni una respuesta retrasada. Es inconstante en todos sus caminos. El remedio es fe de un solo ánimo, no volumen más alto."
    },
    {
      textEn: "9. The father-at-the-store illustration teaches the principle that:",
      textEs: "9. La ilustración del padre en la tienda enseña el principio de que:",
      optionsEn: ["A. Children only receive what they earn","B. Some good gifts from God come only by asking","C. Parents should always say yes to their children","D. Asking earns merit before God"],
      optionsEs: ["A. Los hijos solo reciben lo que ganan","B. Algunos buenos regalos de Dios vienen solo al pedir","C. Los padres siempre deben decir sí a sus hijos","D. Pedir gana mérito delante de Dios"],
      correct: "B",
      correctFeedbackEn: "Correct. Some gifts the father gave just because the child was his. Other gifts came because the child asked. So with the understanding of Scripture: God does not push His Word into a closed pastor.",
      correctFeedbackEs: "Correcto. Algunos regalos el padre los daba simplemente porque el hijo era suyo. Otros regalos venían porque el hijo pedía. Así con el entendimiento de la Escritura: Dios no empuja Su Palabra dentro de un pastor cerrado.",
      incorrectFeedbackEn: "Asking does not earn merit, parents do not always say yes, and children do not have to earn every gift. The point is that some specific gifts (like Bible understanding) come ONLY when asked.",
      incorrectFeedbackEs: "Pedir no gana mérito, los padres no siempre dicen sí, y los hijos no tienen que ganar cada regalo. El punto es que algunos dones específicos (como el entendimiento bíblico) vienen SOLO cuando se pide."
    },
    {
      textEn: "10. The Maria Monsen story (North China, 1932) illustrates the principle that:",
      textEs: "10. La historia de Maria Monsen (Norte de China, 1932) ilustra el principio de que:",
      optionsEn: ["A. Prayer is more powerful in some countries than others","B. Missionaries always see revival in their first year","C. Mighty rivers begin as raindrops — agreed prayer starts the awakening","D. Norwegian missionaries were the most effective in Asia"],
      optionsEs: ["A. La oración es más poderosa en algunos países que en otros","B. Los misioneros siempre ven avivamiento en su primer año","C. Los ríos poderosos comienzan como gotas de lluvia — la oración acordada inicia el despertar","D. Los misioneros noruegos fueron los más eficaces en Asia"],
      correct: "C",
      correctFeedbackEn: "Correct. Maria Monsen remembered the Yangtze River begins as raindrops in the mountains, and she found one prayer partner. \"Two of us have agreed!\" Two years later, revival swept the province.",
      correctFeedbackEs: "Correcto. Maria Monsen recordó que el río Yangtsé comienza como gotas de lluvia en las montañas, y encontró una compañera de oración. «¡Dos de nosotras hemos acordado!» Dos años después, el avivamiento barrió la provincia.",
      incorrectFeedbackEn: "Geography and nationality do not change prayer's power; first-year revival is not promised. The principle is the raindrop-to-river image: two believers agreeing in prayer are how the awakening begins.",
      incorrectFeedbackEs: "La geografía y la nacionalidad no cambian el poder de la oración; el avivamiento del primer año no se promete. El principio es la imagen de gota a río: dos creyentes que se ponen de acuerdo en oración es como comienza el despertar."
    },
    {
      textEn: "11. The \"God sold the cattle\" story from Dallas Theological Seminary illustrates:",
      textEs: "11. La historia «Dios vendió el ganado» del Seminario Teológico de Dallas ilustra:",
      optionsEn: ["A. God sometimes answers prayer before we finish praying it","B. Texas cattlemen built the early American seminaries","C. Seminaries should never go into debt","D. Prayer is most effective at the noon hour"],
      optionsEs: ["A. Dios a veces responde la oración antes de que terminemos de orarla","B. Los ganaderos de Texas edificaron los seminarios estadounidenses tempranos","C. Los seminarios nunca deben endeudarse","D. La oración es más eficaz al mediodía"],
      correct: "A",
      correctFeedbackEn: "Correct. While they were still praying, a Texas cattleman knocked at the door with a check — exactly the amount of the debt. Sometimes God answers before we have finished speaking.",
      correctFeedbackEs: "Correcto. Mientras todavía oraban, un ganadero de Texas tocó a la puerta con un cheque — exactamente la cantidad de la deuda. A veces Dios responde antes de que terminemos de hablar.",
      incorrectFeedbackEn: "The story is not about seminaries, cattlemen as a class, debt policy, or noon hours. It is about how God can answer faster than we can pray — the cattleman arrived WHILE the men were still praying.",
      incorrectFeedbackEs: "La historia no trata de seminarios, ganaderos como clase, política de deuda, ni horarios del mediodía. Trata de cómo Dios puede responder más rápido de lo que oramos — el ganadero llegó MIENTRAS los hombres aún oraban."
    },
    {
      textEn: "12. The lesson identifies three doubts that pastors face, named after which three biblical men?",
      textEs: "12. La lección identifica tres dudas que enfrentan los pastores, nombradas por cuáles tres hombres bíblicos:",
      optionsEn: ["A. Abraham, Moses, David","B. Peter, Paul, John","C. Thomas, Peter, John the Baptist","D. Job, Jeremiah, Habakkuk"],
      optionsEs: ["A. Abraham, Moisés, David","B. Pedro, Pablo, Juan","C. Tomás, Pedro, Juan el Bautista","D. Job, Jeremías, Habacuc"],
      correct: "C",
      correctFeedbackEn: "Correct. Thomas doubted that Christ had risen at all (does God exist?). Peter doubted that Christ's power reached him in the waves. John the Baptist, in prison, doubted whether Jesus was really the One.",
      correctFeedbackEs: "Correcto. Tomás dudó de que Cristo hubiera resucitado (¿existe Dios?). Pedro dudó de que el poder de Cristo lo alcanzara en las olas. Juan el Bautista, en prisión, dudó si Jesús era realmente el Esperado.",
      incorrectFeedbackEn: "The three names from the Gospels are THOMAS (after the resurrection), PETER (on the water), and JOHN THE BAPTIST (from prison). Each one suffered a distinct kind of doubt the pastor will recognize.",
      incorrectFeedbackEs: "Los tres nombres de los Evangelios son TOMÁS (después de la resurrección), PEDRO (sobre el agua), y JUAN EL BAUTISTA (desde la prisión). Cada uno sufrió una clase distinta de duda que el pastor reconocerá."
    },
    {
      textEn: "13. The Thomas doubt is essentially the question:",
      textEs: "13. La duda de Tomás es esencialmente la pregunta:",
      optionsEn: ["A. Does God exist at all?","B. Will I be remembered after death?","C. Are my sins really forgiven?","D. Does the Bible contradict itself?"],
      optionsEs: ["A. ¿Existe Dios siquiera?","B. ¿Seré recordado después de la muerte?","C. ¿Están mis pecados realmente perdonados?","D. ¿Se contradice la Biblia a sí misma?"],
      correct: "A",
      correctFeedbackEn: "Correct. Thomas-doubt is the prior question: is there a God at all? Is Christ really risen? It is the question that hits every honest believer, often when they are young. The answer was — and is — the risen Christ Himself.",
      correctFeedbackEs: "Correcto. La duda de Tomás es la pregunta previa: ¿existe acaso un Dios? ¿Resucitó Cristo de verdad? Es la pregunta que golpea a todo creyente honesto, muchas veces cuando es joven. La respuesta era — y es — el Cristo resucitado mismo.",
      incorrectFeedbackEn: "Memory, forgiveness, and Bible coherence are real questions but they presuppose Thomas-doubt has already been answered. Thomas doubt is the most basic: Is there a God? Did Christ really rise?",
      incorrectFeedbackEs: "La memoria, el perdón, y la coherencia de la Biblia son preguntas reales pero presuponen que la duda de Tomás ya fue respondida. La duda de Tomás es la más básica: ¿Hay un Dios? ¿Resucitó Cristo de verdad?"
    },
    {
      textEn: "14. The Peter doubt, in the lesson's framework, is the question:",
      textEs: "14. La duda de Pedro, en el marco de la lección, es la pregunta:",
      optionsEn: ["A. Am I really saved?","B. Does Christ's power reach me, in my particular weakness?","C. Did Christ really rise from the dead?","D. Are all religions equally valid paths?"],
      optionsEs: ["A. ¿Soy verdaderamente salvo?","B. ¿Alcanza el poder de Cristo a mí, en mi debilidad particular?","C. ¿Resucitó Cristo verdaderamente de los muertos?","D. ¿Son todas las religiones caminos igualmente válidos?"],
      correct: "B",
      correctFeedbackEn: "Correct. Peter did not doubt that Christ was Lord. He doubted that Christ's power reached HIM in those particular waves. Many pastors carry this doubt about themselves: am I adequate? Can He use me?",
      correctFeedbackEs: "Correcto. Pedro no dudaba de que Cristo era Señor. Dudaba de que el poder de Cristo lo alcanzara a ÉL en esas olas particulares. Muchos pastores cargan esta duda acerca de sí mismos: ¿soy adecuado? ¿Puede usarme?",
      incorrectFeedbackEn: "Peter doubt is not about salvation status or about Christ's identity or about other religions. Peter doubt is about whether Christ's power reaches us in the particular waves we are sinking in right now.",
      incorrectFeedbackEs: "La duda de Pedro no es sobre el estado de salvación, ni sobre la identidad de Cristo, ni sobre otras religiones. La duda de Pedro es sobre si el poder de Cristo nos alcanza en las olas particulares en las que nos estamos hundiendo ahora mismo."
    },
    {
      textEn: "15. The Wayne Woodward story (the deaf seminary student from Winnipeg) illustrates:",
      textEs: "15. La historia de Wayne Woodward (el estudiante sordo de seminario de Winnipeg) ilustra:",
      optionsEn: ["A. A pastor wrestling with Peter doubt about his own abilities","B. The importance of bilingual seminary education","C. A miraculous physical healing","D. The dangers of moving across country for ministry"],
      optionsEs: ["A. Un pastor que lucha con la duda de Pedro sobre sus propias capacidades","B. La importancia de la educación bilingüe en el seminario","C. Una sanidad física milagrosa","D. Los peligros de mudarse a través del país por el ministerio"],
      correct: "A",
      correctFeedbackEn: "Correct. Wayne said, \"I don't belong here. I could never pastor a church.\" That is Peter doubt — not about Christ's existence or power in general, but about whether Christ's power reaches HIM, with his particular weakness.",
      correctFeedbackEs: "Correcto. Wayne dijo: «Yo no pertenezco aquí. Nunca podría pastorear una iglesia.» Esa es la duda de Pedro — no sobre la existencia o el poder de Cristo en general, sino sobre si el poder de Cristo lo alcanza a ÉL, con su debilidad particular.",
      incorrectFeedbackEn: "Wayne's story is not about education policy, miraculous healing, or relocation risks. It is the picture of Peter doubt: a man called to ministry asking whether Christ's power reaches HIM in his particular weakness.",
      incorrectFeedbackEs: "La historia de Wayne no es sobre política educativa, sanidad milagrosa, ni riesgos de reubicación. Es el cuadro de la duda de Pedro: un hombre llamado al ministerio preguntando si el poder de Cristo lo alcanza a ÉL en su debilidad particular."
    },
    {
      textEn: "16. The John the Baptist doubt, in the lesson's framework, is the question:",
      textEs: "16. La duda de Juan el Bautista, en el marco de la lección, es la pregunta:",
      optionsEn: ["A. Will God provide for my financial needs?","B. Did the prophets predict the right Messiah?","C. Am I really His? — doubt about one's own salvation","D. Will the church grow under my leadership?"],
      optionsEs: ["A. ¿Proveerá Dios para mis necesidades financieras?","B. ¿Predijeron los profetas al Mesías correcto?","C. ¿Soy verdaderamente Suyo? — duda sobre la propia salvación","D. ¿Crecerá la iglesia bajo mi liderazgo?"],
      correct: "C",
      correctFeedbackEn: "Correct. John doubted his own relationship to the One he had baptized. The pastor's version: \"Am I really His? Have I really been saved?\" It comes most often to the sincerest believers.",
      correctFeedbackEs: "Correcto. Juan dudó de su propia relación con Aquel a quien había bautizado. La versión del pastor: «¿Soy verdaderamente Suyo? ¿He sido verdaderamente salvo?» Viene más a menudo a los creyentes más sinceros.",
      incorrectFeedbackEn: "Finance, prophecy, and church growth are pastoral concerns but they are not John-the-Baptist doubt. JtB doubt is personal and inward: am I really saved? Am I really His?",
      incorrectFeedbackEs: "Las finanzas, la profecía, y el crecimiento de la iglesia son preocupaciones pastorales, pero no son la duda de Juan el Bautista. La duda de JeB es personal e interior: ¿soy verdaderamente salvo? ¿Soy verdaderamente Suyo?"
    },
    {
      textEn: "17. According to the lesson, our relationship with God does NOT depend on which of the following?",
      textEs: "17. Según la lección, nuestra relación con Dios NO depende de cuál de los siguientes:",
      optionsEn: ["A. Christ's promise and His finished work on the cross","B. The witness of the Holy Spirit","C. The unchanging Word of God","D. Our feelings or steady moods"],
      optionsEs: ["A. La promesa de Cristo y Su obra terminada en la cruz","B. El testimonio del Espíritu Santo","C. La Palabra inmutable de Dios","D. Nuestros sentimientos o estados de ánimo estables"],
      correct: "D",
      correctFeedbackEn: "Correct. Feelings come and go; the psychologists tell us chemistry shifts day to day. Our relationship rests on Christ's promise and finished work, not on the glands. \"I will never leave you nor forsake you.\"",
      correctFeedbackEs: "Correcto. Los sentimientos van y vienen; los psicólogos nos dicen que la química cambia día a día. Nuestra relación descansa en la promesa de Cristo y Su obra terminada, no en las glándulas. «Nunca te dejaré ni te desampararé.»",
      incorrectFeedbackEn: "Christ's work, the Spirit's witness, and the Word ARE the foundations. Feelings are not. The pastor who has wrestled John-the-Baptist doubt knows that mood-based assurance is treacherous.",
      incorrectFeedbackEs: "La obra de Cristo, el testimonio del Espíritu, y la Palabra SÍ son los fundamentos. Los sentimientos no. El pastor que ha luchado con la duda de Juan el Bautista sabe que la seguridad basada en el estado de ánimo es traicionera."
    },
    {
      textEn: "18. According to the lesson's treatment of Exodus 4, which excuse did Moses raise against God's call?",
      textEs: "18. Según el tratamiento que la lección da a Éxodo 4, ¿qué excusa puso Moisés contra el llamado de Dios?",
      optionsEn: ["A. He was too old to begin a new task","B. He had committed too many sins","C. He was slow of speech and tongue","D. He could not read or write"],
      optionsEs: ["A. Era demasiado viejo para comenzar una nueva tarea","B. Había cometido demasiados pecados","C. Era tardo en el habla y de lengua torpe","D. No sabía leer ni escribir"],
      correct: "C",
      correctFeedbackEn: "Correct. Moses said, \"O Lord, I have never been eloquent... I am slow of speech and tongue.\" God answered with His own question: Who made the mouth? God is interested in availability, not ability.",
      correctFeedbackEs: "Correcto. Moisés dijo: «Señor, nunca he sido elocuente... soy tardo en el habla y torpe de lengua.» Dios respondió con Su propia pregunta: ¿Quién hizo la boca? A Dios le interesa la disponibilidad, no la habilidad.",
      incorrectFeedbackEn: "Moses had four excuses — no body, no authority, no credentials, no ability. The lesson features the fourth: he was slow of speech and tongue. God's answer: \"Who made the mouth?\"",
      incorrectFeedbackEs: "Moisés tenía cuatro excusas — sin cuerpo, sin autoridad, sin credenciales, sin habilidad. La lección destaca la cuarta: era tardo en el habla y torpe de lengua. La respuesta de Dios: «¿Quién hizo la boca?»"
    },
    {
      textEn: "19. God's answer to Moses' \"no ability\" excuse is summed up in the lesson as:",
      textEs: "19. La respuesta de Dios a la excusa de «no tengo habilidad» de Moisés se resume en la lección como:",
      optionsEn: ["A. God is interested in availability, not ability","B. God will reduce the size of the assignment","C. God only sends the naturally gifted","D. God will train Moses for forty more years before sending him"],
      optionsEs: ["A. A Dios le interesa la disponibilidad, no la habilidad","B. Dios reducirá el tamaño de la tarea","C. Dios envía solo a los naturalmente dotados","D. Dios entrenará a Moisés por cuarenta años más antes de enviarlo"],
      correct: "A",
      correctFeedbackEn: "Correct. God did not promise to make Moses eloquent. He did not shrink the task. He asked, \"Who made the mouth?\" — and sent him. The pastor's qualification is not natural ability but a willing yes.",
      correctFeedbackEs: "Correcto. Dios no prometió hacer elocuente a Moisés. No redujo la tarea. Preguntó: «¿Quién hizo la boca?» — y lo envió. La calificación del pastor no es la habilidad natural sino un sí dispuesto.",
      incorrectFeedbackEn: "God did not reduce the task, restrict His call to the gifted, or delay Moses another generation. He sent him as he was. The pastor's call works the same way: availability matters more than ability.",
      incorrectFeedbackEs: "Dios no redujo la tarea, ni restringió Su llamado a los dotados, ni demoró a Moisés otra generación. Lo envió tal como era. El llamado del pastor funciona igual: la disponibilidad importa más que la habilidad."
    },
    {
      textEn: "20. The closing charge to the pastor in this unit is:",
      textEs: "20. El encargo de cierre al pastor en esta unidad es:",
      optionsEn: ["A. Memorize the text before praying over it","B. Spend most of your week debating other pastors","C. Use only one commentary per sermon you prepare","D. You do not need to be the brightest pastor; you need to be the quietest before the Author"],
      optionsEs: ["A. Memorice el texto antes de orar sobre él","B. Pase la mayor parte de la semana debatiendo con otros pastores","C. Use solo un comentario por sermón que prepare","D. No necesita ser el pastor más brillante; necesita ser el más callado ante el Autor"],
      correct: "D",
      correctFeedbackEn: "Correct. You do not need to be the brightest pastor in your city. You need to be the quietest before the Author of the Book. That is enough.",
      correctFeedbackEs: "Correcto. Usted no necesita ser el pastor más brillante de su ciudad. Necesita ser el más callado ante el Autor del Libro. Eso es suficiente.",
      incorrectFeedbackEn: "Memorization, debate, and commentary-counting are not the heart of pastoral hermeneutics. The closing charge is quietness before the Author — a humble heart at a quiet desk, waiting on the Spirit.",
      incorrectFeedbackEs: "La memorización, el debate, y el conteo de comentarios no son el corazón de la hermenéutica pastoral. El encargo de cierre es quietud delante del Autor — un corazón humilde en un escritorio quieto, esperando en el Espíritu."
    }
  ];

const kwQuestions = [
    {
      textEn: "21. According to 1 Corinthians 2:10-14, why is the Holy Spirit essential for understanding the Bible? Explain what only the Spirit can give the interpreter.",
      textEs: "21. Según 1 Corintios 2:10-14, ¿por qué es esencial el Espíritu Santo para entender la Biblia? Explique lo que solo el Espíritu le puede dar al intérprete.",
      kw_en: ["Spirit", "deep", "reveal", "natural", "discern", "mind", "God", "spiritual"],
      kw_es: ["Espíritu", "profund", "revel", "natural", "discern", "mente", "Dios", "espiritual"],
      modelEn: "Paul says the Spirit searches the deep things of God and reveals them; the natural man cannot receive them because they are spiritually discerned. Only the Spirit can give the interpreter the mind to understand what God has freely given, so apart from the Spirit the Bible stays closed.",
      modelEs: "Pablo dice que el Espíritu escudriña las cosas profundas de Dios y las revela; el hombre natural no puede recibirlas porque deben discernirse espiritualmente. Solo el Espíritu puede dar al intérprete la mente para entender lo que Dios ha dado, así que sin el Espíritu la Biblia permanece cerrada."
    },
    {
      textEn: "22. Explain the principle in Ezra 7:10 that \"Ezra prepared his heart.\" Why does heart-preparation come before exegesis in this unit's argument?",
      textEs: "22. Explique el principio de Esdras 7:10 — «Esdras preparó su corazón». ¿Por qué la preparación del corazón viene antes de la exégesis en el argumento de esta unidad?",
      kw_en: ["heart", "prepar", "humble", "posture", "pray", "bow", "before", "Ezra"],
      kw_es: ["coraz", "prepar", "humild", "postura", "orar", "inclin", "antes", "Esdras"],
      modelEn: "Ezra prepared his heart before he handled the Law. Heart-preparation comes before exegesis because the interpreter must come in a humble posture — praying and bowing before the page — so that he reads to obey rather than to master. A proud heart will twist even good exegesis.",
      modelEs: "Esdras preparó su corazón antes de manejar la Ley. La preparación del corazón viene antes de la exégesis porque el intérprete debe acercarse en una postura humilde — orando e inclinándose ante la página — para leer y obedecer en lugar de dominar. Un corazón orgulloso torcerá aun la buena exégesis."
    },
    {
      textEn: "23. James 1:5-8 tells the pastor to ask God for wisdom. Explain what kind of asking receives wisdom, and what kind of asking does NOT.",
      textEs: "23. Santiago 1:5-8 le dice al pastor que pida sabiduría a Dios. Explique qué clase de petición recibe sabiduría, y qué clase de petición NO la recibe.",
      kw_en: ["wisdom", "ask", "faith", "doubt", "waver", "double", "liberal", "receiv"],
      kw_es: ["sabiduría", "pedir", "fe", "duda", "vacil", "doble", "abundant", "recib"],
      modelEn: "God gives wisdom liberally to the one who asks in faith without doubting. The kind of asking that receives is single-hearted trust; the kind that does not is the double-minded man who wavers like a wave of the sea, and he should not expect to receive anything from the Lord.",
      modelEs: "Dios da sabiduría en abundancia al que la pide con fe, sin dudar. La clase de petición que recibe es la confianza sin doblez; la que no recibe es el hombre de doble ánimo que vacila como una ola del mar, y no debe esperar recibir nada del Señor."
    },
    {
      textEn: "24. Describe at least two of the three prayer stories in this unit (Maria Monsen, \"God sold the cattle,\" the man with prayer lists) and explain what each teaches about prayer over the Bible.",
      textEs: "24. Describa al menos dos de las tres historias de oración en esta unidad (Maria Monsen, «Dios vendió el ganado», el hombre de las listas de oración) y explique lo que cada una enseña sobre la oración sobre la Biblia.",
      kw_en: ["Monsen", "raindrop", "agree", "revival", "Dallas", "cattle", "check", "prayer"],
      kw_es: ["Monsen", "gotas", "acuerdo", "avivamiento", "Dallas", "ganado", "cheque", "oración"],
      modelEn: "Maria Monsen prayed for revival in China and, remembering that the Yangtze begins as raindrops, found one partner to agree with her — and revival came. At Dallas Seminary, facing foreclosure, Harry Ironside prayed that God would sell some of the cattle on a thousand hills, and a Texas rancher arrived with a check for the exact debt. Both stories teach that prayer over the Bible moves God to act.",
      modelEs: "Maria Monsen oró por avivamiento en China y, recordando que el Yangtsé comienza como gotas de lluvia, encontró una compañera de acuerdo con ella — y vino el avivamiento. En el Seminario de Dallas, ante el embargo, Harry Ironside pidió que Dios vendiera algo del ganado de mil colinas, y un ranchero de Texas llegó con un cheque por la deuda exacta. Ambas historias enseñan que la oración sobre la Biblia mueve a Dios a actuar."
    },
    {
      textEn: "25. The lesson names three doubts after Thomas, Peter, and John the Baptist. Name each doubt and briefly explain the question it asks.",
      textEs: "25. La lección nombra tres dudas según Tomás, Pedro, y Juan el Bautista. Nombre cada duda y explique brevemente la pregunta que plantea.",
      kw_en: ["Thomas", "Peter", "John", "exist", "power", "reach", "really", "doubt"],
      kw_es: ["Tomás", "Pedro", "Juan", "existe", "poder", "alcanz", "realmente", "duda"],
      modelEn: "The three doubts are named for three men. Thomas doubt asks, 'Does God really exist?' Peter doubt asks, 'Does His power reach me?' And John the Baptist doubt asks, 'Am I really His?' The first is about God, the second about His power, the third about myself.",
      modelEs: "Las tres dudas llevan el nombre de tres hombres. La duda de Tomás pregunta: «¿Existe realmente Dios?» La duda de Pedro pregunta: «¿Me alcanza Su poder?» Y la duda de Juan el Bautista pregunta: «¿Soy realmente Suyo?» La primera es sobre Dios, la segunda sobre Su poder, la tercera sobre mí mismo."
    },
    {
      textEn: "26. Explain Thomas doubt and how a pastor who has wrestled with it can help an unbeliever or a doubting believer.",
      textEs: "26. Explique la duda de Tomás y cómo un pastor que ha luchado con ella puede ayudar a un incrédulo o a un creyente que duda.",
      kw_en: ["Thomas", "exist", "risen", "Christ", "evidence", "doubt", "unbeliev", "answer"],
      kw_es: ["Tomás", "existe", "resucitado", "Cristo", "evidencia", "duda", "incrédulo", "respuesta"],
      modelEn: "Thomas doubt asks whether God exists and whether the risen Christ is real. The pastor who has wrestled this doubt to the ground — and found his answer in the risen Christ Himself, not only in the evidence of apologetics — can stand calmly before an unbeliever or a doubting believer and meet the same question with quiet confidence.",
      modelEs: "La duda de Tomás pregunta si Dios existe y si el Cristo resucitado es real. El pastor que ha luchado con esta duda hasta vencerla — y ha hallado su respuesta en el Cristo resucitado mismo, no solo en la evidencia de la apologética — puede estar tranquilo ante un incrédulo o un creyente que duda y enfrentar la misma pregunta con confianza."
    },
    {
      textEn: "27. Tell the Wayne Woodward story in your own words and explain why it is an illustration of Peter doubt rather than Thomas doubt or John the Baptist doubt.",
      textEs: "27. Cuente la historia de Wayne Woodward con sus propias palabras y explique por qué es una ilustración de la duda de Pedro y no de la duda de Tomás o de la duda de Juan el Bautista.",
      kw_en: ["Woodward", "deaf", "seminary", "ability", "Peter", "reach", "power", "Boeing"],
      kw_es: ["Woodward", "sordo", "seminario", "habilidad", "Pedro", "alcanz", "poder", "Boeing"],
      modelEn: "Wayne Woodward left a good job at Boeing in Winnipeg and brought his family across the country to seminary, even though he was deaf and had only a high-school diploma. His questions were all about his own ability — what church could he pastor, how could he compete? That is Peter doubt: not 'Is Christ real?' but 'Can Christ's power reach and use me, this man, in these waves?'",
      modelEs: "Wayne Woodward dejó un buen empleo en Boeing en Winnipeg y trajo a su familia a través del país al seminario, aunque era sordo y solo tenía un diploma de secundaria. Sus preguntas eran todas sobre su propia habilidad — ¿qué iglesia podría pastorear, cómo competiría? Esa es la duda de Pedro: no «¿Es real Cristo?» sino «¿Puede el poder de Cristo alcanzarme y usarme, a este hombre, en estas olas?»"
    },
    {
      textEn: "28. Explain John the Baptist doubt and how Jesus addressed John's question from prison. What does this teach about pastoral care for doubting believers?",
      textEs: "28. Explique la duda de Juan el Bautista y cómo Jesús respondió la pregunta de Juan desde la prisión. ¿Qué enseña esto sobre el cuidado pastoral de los creyentes que dudan?",
      kw_en: ["John", "Baptist", "prison", "Messiah", "evidence", "blessed", "works", "doubt"],
      kw_es: ["Juan", "Bautista", "prisión", "Mesías", "evidencia", "bienaventur", "obras", "duda"],
      modelEn: "John the Baptist, in prison, sent to ask whether Jesus was really the Messiah. Jesus did not rebuke him; He pointed to the evidence of His works — the blind see, the lame walk — and said, 'Blessed is he who is not offended in Me.' This teaches the pastor to meet a doubting believer not with scorn but with gentle evidence and reassurance.",
      modelEs: "Juan el Bautista, en la prisión, mandó a preguntar si Jesús era realmente el Mesías. Jesús no lo reprendió; señaló la evidencia de Sus obras — los ciegos ven, los cojos andan — y dijo: «Bienaventurado el que no halle tropiezo en Mí.» Esto enseña al pastor a tratar a un creyente que duda no con desprecio sino con evidencia suave y consuelo."
    },
    {
      textEn: "29. List at least three of Moses' four excuses in Exodus 3-4, and explain the lesson's summary: \"God is interested in availability, not ability.\"",
      textEs: "29. Enumere al menos tres de las cuatro excusas de Moisés en Éxodo 3-4, y explique el resumen de la lección: «A Dios le interesa la disponibilidad, no la habilidad».",
      kw_en: ["Moses", "excuse", "mouth", "ability", "availability", "speech", "tongue", "send"],
      kw_es: ["Moisés", "excusa", "boca", "habilidad", "disponibilidad", "habla", "lengua", "enviar"],
      modelEn: "Moses made four excuses at the burning bush: Who am I? What is Your name? They will not believe me. And I am slow of speech, not eloquent. To each God answered with His own sufficiency. The lesson is that God is interested in availability, not ability — He supplies the mouth and the words; He only asks that Moses go.",
      modelEs: "Moisés puso cuatro excusas en la zarza: ¿Quién soy yo? ¿Cuál es Tu nombre? No me creerán. Y soy torpe de habla, no elocuente. A cada una Dios respondió con Su propia suficiencia. La lección es que a Dios le interesa la disponibilidad, no la habilidad — Él provee la boca y las palabras; solo pide que Moisés vaya."
    },
    {
      textEn: "30. The lesson calls hermeneutics \"a conversation between three Persons and the preacher.\" Name each Person and briefly explain the role each plays in the pastor's interpretation of Scripture.",
      textEs: "30. La lección llama a la hermenéutica «una conversación entre tres Personas y el predicador». Nombre cada Persona y explique brevemente el papel que cada una juega en la interpretación pastoral de la Escritura.",
      kw_en: ["Father", "Son", "Spirit", "preacher", "interpret", "Trinity", "Word", "conversation"],
      kw_es: ["Padre", "Hijo", "Espíritu", "predicador", "interpret", "Trinidad", "Palabra", "conversación"],
      modelEn: "Hermeneutics is a conversation among three Persons and the preacher. The Father is the source who speaks; the Son is the Word, the center of all Scripture; the Spirit reveals and applies the meaning to the interpreter. The preacher listens to all three and carries the Word to the people, so interpretation is a Trinity-shaped conversation, not a solo act.",
      modelEs: "La hermenéutica es una conversación entre tres Personas y el predicador. El Padre es la fuente que habla; el Hijo es la Palabra, el centro de toda la Escritura; el Espíritu revela y aplica el significado al intérprete. El predicador escucha a los tres y lleva la Palabra al pueblo, así que la interpretación es una conversación con forma de Trinidad, no un acto en solitario."
    }
  ];
