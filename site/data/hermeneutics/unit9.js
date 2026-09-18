/* CTSHermeneutics - unit 9: per-unit configuration and content. */

const UNIT = 9;

const NEXT_UNIT_URL = "CTSHermeneuticsUnit10.html";

const PREV_UNIT_URL = "CTSHermeneuticsUnit8.html";

const IS_FINAL_UNIT = false;

const SHOW_REGISTRATION = false;

const mcQuestions = [
    {
      textEn: "1. The central principle of this unit is best summarized as:",
      textEs: "1. El principio central de esta unidad se resume mejor como:",
      optionsEn: ["A. The literal sense and the literalistic sense are the same","B. Literal interpretation means flat physical reading in every case","C. Literal interpretation means the sense the author intended — which is sometimes figurative","D. Spiritual interpretation always overrides literal interpretation"],
      optionsEs: ["A. El sentido literal y el sentido literalista son lo mismo","B. La interpretación literal significa lectura física plana en cada caso","C. La interpretación literal significa el sentido que el autor pretendía — que a veces es figurativo","D. La interpretación espiritual siempre anula la interpretación literal"],
      correct: "C",
      correctFeedbackEn: "Correct. The literal sense is the sense the author MEANT. When Jesus says \"I am the door,\" the literal sense IS the figurative sense, because figure is what He meant. Literal does not equal flat physical.",
      correctFeedbackEs: "Correcto. El sentido literal es el sentido que el autor QUISO DECIR. Cuando Jesús dice «Yo soy la puerta», el sentido literal ES el sentido figurativo, porque la figura es lo que Él quiso decir. Literal no es igual a físico plano.",
      incorrectFeedbackEn: "Literal and literalistic are NOT synonyms. Literal = the author's intended sense, which may be figurative. Literalistic = flat physical reading regardless of intent. The whole unit defends this distinction.",
      incorrectFeedbackEs: "Literal y literalista NO son sinónimos. Literal = el sentido pretendido del autor, que puede ser figurativo. Literalista = lectura física plana sin importar la intención. Toda la unidad defiende esta distinción."
    },
    {
      textEn: "2. When Jesus tells Nicodemus he must be born again, Nicodemus responds (John 3:4):",
      textEs: "2. Cuando Jesús le dice a Nicodemo que debe nacer de nuevo, Nicodemo responde (Juan 3:4):",
      optionsEn: ["A. \"Lord, I believe; help my unbelief\"","B. \"Show me a sign and I will follow You\"","C. \"How can a man be born when he is old? Can he enter a second time into his mother's womb?\"","D. \"What must I do to inherit eternal life?\""],
      optionsEs: ["A. «Creo, ayuda mi incredulidad»","B. «Muéstrame una señal y te seguiré»","C. «¿Cómo puede el hombre nacer siendo viejo? ¿Puede entrar otra vez en el vientre de su madre?»","D. «¿Qué haré para heredar la vida eterna?»"],
      correct: "C",
      correctFeedbackEn: "Correct. Nicodemus's response is one of the most cited examples of interpretive confusion in the NT. He hears \"born again\" and demands a flat physical reading. The absurdity of the question exposes the literalist confusion the unit is built around.",
      correctFeedbackEs: "Correcto. La respuesta de Nicodemo es uno de los ejemplos más citados de confusión interpretativa en el NT. Oye «nacer de nuevo» y exige una lectura física plana. El absurdo de la pregunta expone la confusión literalista alrededor de la cual está edificada la unidad.",
      incorrectFeedbackEn: "The other answers come from different gospel passages. Nicodemus's specific reply was the literalist question: \"How can a man enter his mother's womb a second time?\" This is the textbook case of literalistic misreading.",
      incorrectFeedbackEs: "Las otras respuestas vienen de pasajes evangélicos distintos. La respuesta específica de Nicodemo fue la pregunta literalista: «¿Cómo puede un hombre entrar a su madre por segunda vez?» Éste es el caso de libro de texto de la mala lectura literalista."
    },
    {
      textEn: "3. The lesson says the literal sense of \"I am the door\" (Jesus speaking) means:",
      textEs: "3. La lección dice que el sentido literal de «Yo soy la puerta» (Jesús hablando) significa:",
      optionsEn: ["A. Jesus is made of wood and has hinges","B. Jesus is the entrance into the sheepfold of God — figure is the literal meaning","C. Jesus was once mistaken for a carpenter's tool","D. The verse should be skipped because it makes no sense"],
      optionsEs: ["A. Jesús es de madera y tiene bisagras","B. Jesús es la entrada al redil de Dios — la figura es el significado literal","C. Jesús fue una vez confundido con una herramienta de carpintero","D. El versículo debe saltarse porque no tiene sentido"],
      correct: "B",
      correctFeedbackEn: "Correct. When Jesus says \"I am the door,\" the literal sense IS the figurative sense, because figure is what He meant. He is the entrance — He admits or excludes — He does what a door does. That is the literal meaning.",
      correctFeedbackEs: "Correcto. Cuando Jesús dice «Yo soy la puerta», el sentido literal ES el sentido figurativo, porque la figura es lo que Él quiso decir. Él es la entrada — admite o excluye — hace lo que una puerta hace. Ése es el significado literal.",
      incorrectFeedbackEn: "Wood-and-hinges readings, carpenter confusion, and skipping the verse all miss the point. The LITERAL sense of \"I am the door\" is what Jesus MEANT — the entrance into the sheepfold of God. Figure IS the literal meaning when figure is what was meant.",
      incorrectFeedbackEs: "Las lecturas de madera-y-bisagras, la confusión del carpintero, y saltarse el versículo todos pierden el punto. El sentido LITERAL de «Yo soy la puerta» es lo que Jesús QUISO DECIR — la entrada al redil de Dios. La figura ES el significado literal cuando la figura es lo que se quiso decir."
    },
    {
      textEn: "4. Jesus' wind illustration in John 3:8 is meant to teach Nicodemus that:",
      textEs: "4. La ilustración del viento de Jesús en Juan 3:8 está diseñada para enseñarle a Nicodemo que:",
      optionsEn: ["A. The Spirit's origin is hidden but His effect is visible — you cannot see the wind, but you can see what it does","B. Wind is a more important topic than rebirth","C. Israel's weather patterns are theologically significant","D. Pharisees should study meteorology before theology"],
      optionsEs: ["A. El origen del Espíritu está oculto pero Su efecto es visible — no puedes ver el viento, pero puedes ver lo que hace","B. El viento es un tema más importante que el renacimiento","C. Los patrones climáticos de Israel son teológicamente significativos","D. Los fariseos deben estudiar meteorología antes que teología"],
      correct: "A",
      correctFeedbackEn: "Correct. The Greek word \"pneuma\" means both wind and Spirit. Nicodemus's mistake was asking the wrong question — \"can a man enter his mother's womb?\" The right question is \"can you see what the Spirit has done?\" Visible effect, hidden origin.",
      correctFeedbackEs: "Correcto. La palabra griega «pneuma» significa tanto viento como Espíritu. El error de Nicodemo fue hacer la pregunta equivocada — «¿puede un hombre entrar al vientre de su madre?» La pregunta correcta es «¿puedes ver lo que el Espíritu ha hecho?» Efecto visible, origen oculto.",
      incorrectFeedbackEn: "The wind illustration is not about weather, meteorology, or topic-ranking. Jesus is teaching Nicodemus HOW TO READ — the Spirit's work is invisible in origin but visible in effect, just like the wind. That is the literal-as-figurative meaning of John 3:8.",
      incorrectFeedbackEs: "La ilustración del viento no se trata del clima, ni de la meteorología, ni de clasificar temas. Jesús le está enseñando a Nicodemo CÓMO LEER — la obra del Espíritu es invisible en origen pero visible en efecto, como el viento. Ése es el significado literal-como-figurativo de Juan 3:8."
    },
    {
      textEn: "5. The Samaritan Woman in John 4 makes the same literalistic mistake as Nicodemus when:",
      textEs: "5. La mujer samaritana en Juan 4 comete el mismo error literalista que Nicodemo cuando:",
      optionsEn: ["A. She refuses to speak with Jesus","B. She asks where to worship","C. She runs away from the well","D. She hears \"living water\" and asks Jesus where He keeps His bucket"],
      optionsEs: ["A. Se niega a hablar con Jesús","B. Pregunta dónde adorar","C. Corre del pozo","D. Oye «agua viva» y le pregunta a Jesús dónde guarda Su balde"],
      correct: "D",
      correctFeedbackEn: "Correct. \"Sir, You have nothing to draw with, and the well is deep. Where then do You get that living water?\" Same pattern as Nicodemus — she hears the figure as flat H₂O. Jesus meant the Spirit who quenches deeper thirst. Two literalists, two chapters.",
      correctFeedbackEs: "Correcto. «Señor, no tienes con qué sacarla, y el pozo es hondo: ¿de dónde, pues, tienes el agua viva?» Mismo patrón que Nicodemo — ella oye la figura como H₂O plana. Jesús quiso decir el Espíritu que apaga la sed más profunda. Dos literalistas, dos capítulos.",
      incorrectFeedbackEn: "The Samaritan Woman did speak with Jesus, did not flee, and her worship question came LATER as a deflection. Her LITERALIST mistake was hearing \"living water\" as flat H₂O — \"Sir, where then do You get that living water?\" Same pattern as Nicodemus.",
      incorrectFeedbackEs: "La mujer samaritana sí habló con Jesús, no huyó, y su pregunta sobre la adoración vino DESPUÉS como evasión. Su error LITERALISTA fue oír «agua viva» como H₂O plana — «Señor, ¿de dónde, pues, tienes el agua viva?» Mismo patrón que Nicodemo."
    },
    {
      textEn: "6. According to the lesson, John has paired Nicodemus and the Samaritan Woman in John 3-4 to teach that:",
      textEs: "6. Según la lección, Juan ha emparejado a Nicodemo y a la mujer samaritana en Juan 3-4 para enseñar que:",
      optionsEn: ["A. The literalist mistake is a class issue — only poor people make it","B. The literalist mistake is an education issue — only uneducated people make it","C. The literalist mistake is a religious issue — only Pharisees make it","D. The literalist mistake is a HUMAN issue — natural ears reach for water, womb, bread, and door"],
      optionsEs: ["A. El error literalista es un asunto de clase — solo lo cometen los pobres","B. El error literalista es un asunto de educación — solo lo cometen los no educados","C. El error literalista es un asunto religioso — solo lo cometen los fariseos","D. El error literalista es un asunto HUMANO — los oídos naturales alcanzan el agua, el vientre, el pan, y la puerta"],
      correct: "D",
      correctFeedbackEn: "Correct. One wealthy Pharisee with theological training; one poor Samaritan woman with five failed marriages. Both miss the same thing. John has arranged these on purpose — the literalist instinct is universal. The pastor must address it in every congregation.",
      correctFeedbackEs: "Correcto. Un fariseo acaudalado con entrenamiento teológico; una pobre mujer samaritana con cinco matrimonios fracasados. Ambos pierden lo mismo. Juan los ha arreglado a propósito — el instinto literalista es universal. El pastor debe atenderlo en cada congregación.",
      incorrectFeedbackEn: "The literalist mistake is not bound by class, education, or religious background. It is a HUMAN issue. John pairs the wealthy Pharisee and the poor Samaritan woman to show that the natural ear universally reaches for the flat physical reading.",
      incorrectFeedbackEs: "El error literalista no está limitado por clase, educación, o trasfondo religioso. Es un asunto HUMANO. Juan empareja al fariseo acaudalado y a la pobre mujer samaritana para mostrar que el oído natural alcanza universalmente la lectura física plana."
    },
    {
      textEn: "7. When Jesus says \"I am the bread of life,\" the LITERAL meaning according to this lesson is:",
      textEs: "7. Cuando Jesús dice «Yo soy el pan de vida», el significado LITERAL según esta lección es:",
      optionsEn: ["A. Jesus is made of flour and water","B. Jesus does for the soul what bread does for the body — He satisfies hunger and keeps you alive","C. Jesus once worked as a baker","D. The verse refers only to communion wafers"],
      optionsEs: ["A. Jesús está hecho de harina y agua","B. Jesús hace por el alma lo que el pan hace por el cuerpo — satisface el hambre y le mantiene vivo","C. Jesús una vez trabajó como panadero","D. El versículo se refiere solo a las hostias de la comunión"],
      correct: "B",
      correctFeedbackEn: "Correct. The figure IS the literal meaning. Jesus does what bread does — satisfies hunger, keeps you alive — but for the soul. Bread is the image. The spiritual reality is the meaning. Both are part of the same literal interpretation Jesus intended.",
      correctFeedbackEs: "Correcto. La figura ES el significado literal. Jesús hace lo que el pan hace — satisface el hambre, le mantiene vivo — pero para el alma. El pan es la imagen. La realidad espiritual es el significado. Ambos son parte de la misma interpretación literal que Jesús pretendía.",
      incorrectFeedbackEn: "Jesus is not flour-and-water, not a baker, and not limited to communion wafers. \"I am the bread of life\" means Jesus does for the soul what bread does for the body — satisfies hunger, keeps you alive. Figure is the literal meaning.",
      incorrectFeedbackEs: "Jesús no es harina-y-agua, ni panadero, ni se limita a las hostias de la comunión. «Yo soy el pan de vida» significa que Jesús hace por el alma lo que el pan hace por el cuerpo — satisface el hambre, le mantiene vivo. La figura es el significado literal."
    },
    {
      textEn: "8. The diagnostic test for spotting a figure of speech in Scripture, according to this lesson, is:",
      textEs: "8. La prueba diagnóstica para detectar una figura del habla en la Escritura, según esta lección, es:",
      optionsEn: ["A. Ask if the speaker was tired that day","B. Ask if the verse appears in the original Greek","C. Ask: \"If I take the speaker's words at face flat-physical value, am I left with absurdity?\"","D. Ask whether the verse has been preached recently"],
      optionsEs: ["A. Preguntar si el hablante estaba cansado ese día","B. Preguntar si el versículo aparece en el griego original","C. Preguntar: «si tomo las palabras del hablante en su valor físico plano, ¿quedo con un absurdo?»","D. Preguntar si el versículo se ha predicado recientemente"],
      correct: "C",
      correctFeedbackEn: "Correct. If the flat physical reading produces absurdity (a man re-entering his mother's womb, a person made of bread), the speaker is using figure. Your job is to find the spiritual reality the figure was made to deliver.",
      correctFeedbackEs: "Correcto. Si la lectura física plana produce un absurdo (un hombre regresando al vientre de su madre, una persona hecha de pan), el hablante está usando figura. Su trabajo es encontrar la realidad espiritual que la figura fue hecha para entregar.",
      incorrectFeedbackEn: "Fatigue, original-language status, and preaching frequency are not the test. The DIAGNOSTIC TEST is the absurdity test: if a flat physical reading produces nonsense (womb re-entry, wood-and-hinges), the speaker is using FIGURE, and the literal meaning IS the figure's meaning.",
      incorrectFeedbackEs: "El cansancio, el estado de idioma original, y la frecuencia de predicación no son la prueba. La PRUEBA DIAGNÓSTICA es la prueba del absurdo: si una lectura física plana produce sinsentido (regreso al vientre, madera-y-bisagras), el hablante está usando FIGURA, y el significado literal ES el significado de la figura."
    },
    {
      textEn: "9. The story of \"Old Bill\" / \"New Bill\" of Evansville, Indiana is told in this lesson to illustrate:",
      textEs: "9. La historia de «Viejo Bill» / «Nuevo Bill» de Evansville, Indiana se cuenta en esta lección para ilustrar:",
      optionsEn: ["A. What \"born again\" actually delivers — visible spiritual transformation, not physical re-birth","B. The history of rescue missions in the American Midwest","C. The dangers of drinking alcohol","D. The importance of having a clear name"],
      optionsEs: ["A. Lo que «nacer de nuevo» realmente entrega — transformación espiritual visible, no renacimiento físico","B. La historia de las misiones de rescate en el medio oeste americano","C. Los peligros de beber alcohol","D. La importancia de tener un nombre claro"],
      correct: "A",
      correctFeedbackEn: "Correct. Old Bill did not climb back into his mother's womb. He was born of the Spirit, and his transformation was so visible that his old drinking buddies stopped calling him \"Old Bill\" and began calling him \"New Bill.\" That is the LITERAL meaning of \"born again\" preached without literalist distortion.",
      correctFeedbackEs: "Correcto. Viejo Bill no regresó al vientre de su madre. Nació del Espíritu, y su transformación fue tan visible que sus viejos amigos bebedores dejaron de llamarlo «Viejo Bill» y comenzaron a llamarlo «Nuevo Bill». Ése es el significado LITERAL de «nacer de nuevo» predicado sin distorsión literalista.",
      incorrectFeedbackEn: "The Old Bill story is not rescue-mission history, an anti-drinking sermon, or about names. It is the LITERAL meaning of \"born again\" embodied in a real life. Bill's visible transformation is what the wind of the Spirit does — and what Jesus meant when He told Nicodemus.",
      incorrectFeedbackEs: "La historia del Viejo Bill no es historia de misiones de rescate, ni un sermón contra la bebida, ni se trata de nombres. Es el significado LITERAL de «nacer de nuevo» encarnado en una vida real. La transformación visible de Bill es lo que el viento del Espíritu hace — y lo que Jesús quiso decir al hablarle a Nicodemo."
    },
    {
      textEn: "10. The OPPOSITE error to literalism, according to this lesson, is:",
      textEs: "10. El error OPUESTO al literalismo, según esta lección, es:",
      optionsEn: ["A. Reading too quickly","B. Reading in the original languages","C. Using a study Bible","D. Over-spiritualizing — turning straightforward narrative or historical statements into hidden allegories"],
      optionsEs: ["A. Leer demasiado rápido","B. Leer en los idiomas originales","C. Usar una Biblia de estudio","D. Sobre-espiritualizar — convertir narrativas directas o declaraciones históricas en alegorías ocultas"],
      correct: "D",
      correctFeedbackEn: "Correct. The literalist demands flat reading where the author used figure; the over-spiritualizer demands figure where the author was telling history. Both ignore the author's meaning. The Red Sea is not always a symbol of baptism; the five stones of David are not always five virtues.",
      correctFeedbackEs: "Correcto. El literalista exige una lectura plana donde el autor usó figura; el que sobre-espiritualiza exige figura donde el autor estaba contando historia. Ambos ignoran el significado del autor. El Mar Rojo no siempre es un símbolo del bautismo; las cinco piedras de David no siempre son cinco virtudes.",
      incorrectFeedbackEn: "Speed, languages, and study Bibles are not the opposite error. The OPPOSITE of literalism is OVER-SPIRITUALIZING — taking a plain historical statement and forcing it into hidden allegory. The pastor must avoid both extremes.",
      incorrectFeedbackEs: "La velocidad, los idiomas, y las Biblias de estudio no son el error opuesto. El opuesto del literalismo es SOBRE-ESPIRITUALIZAR — tomar una declaración histórica clara y forzarla a una alegoría oculta. El pastor debe evitar ambos extremos."
    },
    {
      textEn: "11. According to the lesson, the rule that protects against BOTH literalism and over-spiritualizing is:",
      textEs: "11. Según la lección, la regla que protege contra TANTO el literalismo como la sobre-espiritualización es:",
      optionsEn: ["A. Always preach the longest passage available","B. Identify the kind of language before deciding what to do with it — let genre tell you which kind of literal you are dealing with","C. Use only red-letter editions of the Bible","D. Avoid the Old Testament"],
      optionsEs: ["A. Siempre predicar el pasaje más largo disponible","B. Identificar la clase de lenguaje antes de decidir qué hacer con él — dejar que el género le diga con cuál clase de literal está tratando","C. Usar solo ediciones en letras rojas de la Biblia","D. Evitar el Antiguo Testamento"],
      correct: "B",
      correctFeedbackEn: "Correct. This is Unit 8's principle applied again. Is this historical narrative? Read it that way. Is this Jesus teaching with a figure? Read it that way. Is this a symbolic prophetic action? Read it that way. Genre tells you which kind of literal you are dealing with.",
      correctFeedbackEs: "Correcto. Éste es el principio de la Unidad 8 aplicado otra vez. ¿Es ésta narrativa histórica? Léala así. ¿Es éste Jesús enseñando con una figura? Léalo así. ¿Es ésta una acción profética simbólica? Léala así. El género le dice con cuál clase de literal está tratando.",
      incorrectFeedbackEn: "Length, red-letter editions, and avoiding the OT do not protect the reader. The rule from Unit 8 returns here: IDENTIFY THE KIND OF LANGUAGE FIRST. Genre tells you whether to read historically, figuratively, or symbolically.",
      incorrectFeedbackEs: "La longitud, las ediciones en letras rojas, y evitar el AT no protegen al lector. La regla de la Unidad 8 regresa aquí: IDENTIFIQUE LA CLASE DE LENGUAJE PRIMERO. El género le dice si leer histórica, figurativa, o simbólicamente."
    },
    {
      textEn: "12. The lesson's first of three diagnostic questions the pastor should ask is:",
      textEs: "12. La primera de las tres preguntas diagnósticas que el pastor debe hacer es:",
      optionsEn: ["A. What does the word say in the dictionary?","B. Who else has preached this passage?","C. What did the speaker mean when he chose this word?","D. How many manuscripts contain this verse?"],
      optionsEs: ["A. ¿Qué dice la palabra en el diccionario?","B. ¿Quién más ha predicado este pasaje?","C. ¿Qué quiso decir el hablante cuando escogió esta palabra?","D. ¿Cuántos manuscritos contienen este versículo?"],
      correct: "C",
      correctFeedbackEn: "Correct. The author's intent is the literal sense. Nicodemus asked the wrong question — he asked about the dictionary, not the speaker. \"What did Jesus mean by 'born again'?\" is the first question of literal interpretation.",
      correctFeedbackEs: "Correcto. La intención del autor es el sentido literal. Nicodemo hizo la pregunta equivocada — preguntó sobre el diccionario, no sobre el hablante. «¿Qué quiso decir Jesús con 'nacer de nuevo'?» es la primera pregunta de la interpretación literal.",
      incorrectFeedbackEn: "Dictionaries, sermon history, and manuscript counts are downstream. The FIRST question is the SPEAKER'S question: what did HE mean when HE chose this word? That is the literal sense. Nicodemus's mistake was reaching for the dictionary instead.",
      incorrectFeedbackEs: "Los diccionarios, la historia sermónica, y los conteos de manuscritos vienen río abajo. La PRIMERA pregunta es la del HABLANTE: ¿qué quiso decir ÉL cuando ÉL escogió esta palabra? Ése es el sentido literal. El error de Nicodemo fue alcanzar el diccionario en su lugar."
    },
    {
      textEn: "13. The second diagnostic question the pastor should ask is:",
      textEs: "13. La segunda pregunta diagnóstica que el pastor debe hacer es:",
      optionsEn: ["A. Would a flat physical reading produce absurdity?","B. Is the verse popular in modern hymns?","C. How long is the sermon expected to be?","D. Was the speaker known to use sarcasm?"],
      optionsEs: ["A. ¿Produciría un absurdo una lectura física plana?","B. ¿Es el versículo popular en los himnos modernos?","C. ¿Cuán largo se espera que sea el sermón?","D. ¿Era el hablante conocido por usar sarcasmo?"],
      correct: "A",
      correctFeedbackEn: "Correct. If yes, you are looking at a figure. A door without hinges, a sheep with a staff, a man re-entering his mother — these absurdities are the text's own way of signaling: this is figure; look for the spiritual reality the figure delivers.",
      correctFeedbackEs: "Correcto. Si sí, está mirando una figura. Una puerta sin bisagras, una oveja con un cayado, un hombre regresando a su madre — estos absurdos son la manera misma del texto de señalar: esto es figura; busque la realidad espiritual que la figura entrega.",
      incorrectFeedbackEn: "Hymn popularity, sermon length, and the speaker's sarcasm habits are not the test. The SECOND question is the ABSURDITY TEST: would the flat physical reading make no sense? If yes, the speaker is using figure, and the literal sense IS the figure.",
      incorrectFeedbackEs: "La popularidad himnódica, la duración del sermón, y los hábitos sarcásticos del hablante no son la prueba. La SEGUNDA pregunta es la PRUEBA DEL ABSURDO: ¿no tendría sentido la lectura física plana? Si sí, el hablante está usando figura, y el sentido literal ES la figura."
    },
    {
      textEn: "14. The third diagnostic question, according to this lesson, is:",
      textEs: "14. La tercera pregunta diagnóstica, según esta lección, es:",
      optionsEn: ["A. What spiritual reality does the figure deliver?","B. What year was the verse written?","C. What was the population of Jerusalem at the time?","D. How many words long is the passage?"],
      optionsEs: ["A. ¿Qué realidad espiritual entrega la figura?","B. ¿En qué año fue escrito el versículo?","C. ¿Cuál era la población de Jerusalén en ese tiempo?","D. ¿Cuántas palabras de largo es el pasaje?"],
      correct: "A",
      correctFeedbackEn: "Correct. Once you have named the figure, name the truth. New birth. Living water. Bread of life. Spiritual sight. The literal meaning IS the spiritual meaning, because the speaker meant the figure to carry exactly that reality.",
      correctFeedbackEs: "Correcto. Una vez que haya nombrado la figura, nombre la verdad. Nuevo nacimiento. Agua viva. Pan de vida. Vista espiritual. El significado literal ES el significado espiritual, porque el hablante quiso que la figura cargara exactamente esa realidad.",
      incorrectFeedbackEn: "Dating, demographics, and word counts are not the third question. After naming the figure, NAME THE TRUTH the figure was made to deliver. The literal meaning is the spiritual reality the speaker embodied in his chosen image.",
      incorrectFeedbackEs: "La datación, la demografía, y los conteos de palabras no son la tercera pregunta. Después de nombrar la figura, NOMBRE LA VERDAD que la figura fue hecha para entregar. El significado literal es la realidad espiritual que el hablante encarnó en su imagen escogida."
    },
    {
      textEn: "15. The lesson identifies Ezekiel and Jeremiah as prophets who had already promised what Jesus told Nicodemus. The two key prophetic promises were:",
      textEs: "15. La lección identifica a Ezequiel y Jeremías como profetas que ya habían prometido lo que Jesús le dijo a Nicodemo. Las dos promesas proféticas clave fueron:",
      optionsEn: ["A. A new sacrificial system and a new temple","B. A new political king and a new army","C. A new geographic homeland and a new language","D. A new heart and a new spirit; God's law written on their hearts"],
      optionsEs: ["A. Un nuevo sistema sacrificial y un nuevo templo","B. Un nuevo rey político y un nuevo ejército","C. Una nueva patria geográfica y un nuevo idioma","D. Un corazón nuevo y un espíritu nuevo; la ley de Dios escrita en sus corazones"],
      correct: "D",
      correctFeedbackEn: "Correct. Ezekiel promised \"a new heart and a new spirit\" (Ezek 36:26). Jeremiah promised \"I will write My law upon their hearts\" (Jer 31:33). Any first-century rabbi familiar with the prophets should have heard the echo. Nicodemus knew the texts but missed the meaning.",
      correctFeedbackEs: "Correcto. Ezequiel prometió «un corazón nuevo y un espíritu nuevo» (Ezeq 36:26). Jeremías prometió «escribiré Mi ley en sus corazones» (Jer 31:33). Cualquier rabí del siglo primero familiarizado con los profetas debería haber oído el eco. Nicodemo conocía los textos pero perdió el significado.",
      incorrectFeedbackEn: "The prophets did not promise sacrificial-system changes, political kings, or geographic homelands as the spiritual rebirth Jesus described. They promised A NEW HEART AND A NEW SPIRIT (Ezekiel) and GOD'S LAW WRITTEN ON THEIR HEARTS (Jeremiah). These are the OT echoes Nicodemus should have heard.",
      incorrectFeedbackEs: "Los profetas no prometieron cambios al sistema sacrificial, ni reyes políticos, ni patrias geográficas como el renacimiento espiritual que Jesús describió. Prometieron UN CORAZÓN NUEVO Y UN ESPÍRITU NUEVO (Ezequiel) y LA LEY DE DIOS ESCRITA EN SUS CORAZONES (Jeremías). Estos son los ecos del AT que Nicodemo debería haber oído."
    },
    {
      textEn: "16. Jesus tells Nicodemus, \"That which is born of the flesh is flesh, and that which is born of the Spirit is spirit.\" The lesson reads this as:",
      textEs: "16. Jesús le dice a Nicodemo: «lo que es nacido de la carne, carne es; y lo que es nacido del Espíritu, espíritu es». La lección lee esto como:",
      optionsEn: ["A. Two domains — physical birth delivers a body; spiritual birth delivers a soul; the first cannot accomplish what only the second can","B. A statement about reincarnation","C. A scientific claim about genetics","D. A philosophical paradox with no clear meaning"],
      optionsEs: ["A. Dos dominios — el nacimiento físico entrega un cuerpo; el nacimiento espiritual entrega un alma; el primero no puede lograr lo que solo el segundo puede","B. Una declaración sobre la reencarnación","C. Una afirmación científica sobre la genética","D. Una paradoja filosófica sin significado claro"],
      correct: "A",
      correctFeedbackEn: "Correct. Jesus is teaching Nicodemus — and every literalist preacher after him — that two domains are at work. Physical and spiritual. Each operates by its own laws. Jesus' words about \"born again\" address the spiritual domain. The literal meaning is the spiritual meaning.",
      correctFeedbackEs: "Correcto. Jesús está enseñando a Nicodemo — y a cada predicador literalista después de él — que dos dominios están en operación. Físico y espiritual. Cada uno opera por sus propias leyes. Las palabras de Jesús sobre «nacer de nuevo» se dirigen al dominio espiritual. El significado literal es el significado espiritual.",
      incorrectFeedbackEn: "Reincarnation, genetics, and philosophical paradox are not the meaning of John 3:6. Jesus is identifying TWO DOMAINS: flesh and Spirit, physical and spiritual. Each has its own birth. The new birth is in the spiritual domain — which is what Jesus LITERALLY meant.",
      incorrectFeedbackEs: "La reencarnación, la genética, y la paradoja filosófica no son el significado de Juan 3:6. Jesús está identificando DOS DOMINIOS: la carne y el Espíritu, lo físico y lo espiritual. Cada uno tiene su propio nacimiento. El nuevo nacimiento es en el dominio espiritual — que es lo que Jesús LITERALMENTE quiso decir."
    },
    {
      textEn: "17. The closing image of this unit — Nicodemus in John 19 — shows him:",
      textEs: "17. La imagen de cierre de esta unidad — Nicodemo en Juan 19 — lo muestra:",
      optionsEn: ["A. Still asking literalist questions","B. Bringing a hundred pounds of myrrh and aloes to prepare Jesus' body for burial — preparation reserved for a king","C. Persecuting the early church","D. Returning to the Sanhedrin to denounce Jesus"],
      optionsEs: ["A. Aún haciendo preguntas literalistas","B. Trayendo cien libras de mirra y áloes para preparar el cuerpo de Jesús para la sepultura — preparación reservada para un rey","C. Persiguiendo a la iglesia primitiva","D. Regresando al Sanedrín para denunciar a Jesús"],
      correct: "B",
      correctFeedbackEn: "Correct. The Pharisee who could not see the kingdom in chapter 3 is preparing the King for burial in chapter 19. The wind had blown through him. The new birth he could not understand at first was already happening inside him while he stood there in the dark.",
      correctFeedbackEs: "Correcto. El fariseo que no podía ver el reino en el capítulo 3 está preparando al Rey para la sepultura en el capítulo 19. El viento había soplado a través de él. El nuevo nacimiento que no pudo entender al principio ya estaba sucediendo dentro de él mientras estaba allí en la oscuridad.",
      incorrectFeedbackEn: "Nicodemus did NOT remain a literalist, did NOT persecute the church, and did NOT denounce Jesus. He reappears in John 19 with A HUNDRED POUNDS OF MYRRH AND ALOES — royal burial spices for Jesus. The new birth he couldn't grasp at night was already at work in him.",
      incorrectFeedbackEs: "Nicodemo NO se quedó como literalista, NO persiguió a la iglesia, y NO denunció a Jesús. Reaparece en Juan 19 con CIEN LIBRAS DE MIRRA Y ÁLOES — especias funerarias reales para Jesús. El nuevo nacimiento que no pudo captar de noche ya estaba obrando en él."
    },
    {
      textEn: "18. The Greek word \"pneuma\" in John 3:8 is significant because:",
      textEs: "18. La palabra griega «pneuma» en Juan 3:8 es significativa porque:",
      optionsEn: ["A. It is found only once in the New Testament","B. It is a Hebrew word borrowed into Greek","C. It means both \"wind\" and \"Spirit\" — the same word for the breath you cannot see and the Spirit you cannot map","D. It refers only to physical air movement"],
      optionsEs: ["A. Se encuentra solo una vez en el Nuevo Testamento","B. Es una palabra hebrea prestada al griego","C. Significa tanto «viento» como «Espíritu» — la misma palabra para el aliento que no puedes ver y el Espíritu que no puedes mapear","D. Se refiere solo al movimiento físico del aire"],
      correct: "C",
      correctFeedbackEn: "Correct. The double meaning of pneuma is exactly what Jesus is using. He is teaching with a word that points to both the visible-yet-invisible wind AND the invisible-yet-visibly-working Spirit. The vocabulary itself preaches the figure.",
      correctFeedbackEs: "Correcto. El doble significado de pneuma es exactamente lo que Jesús está usando. Está enseñando con una palabra que apunta tanto al viento visible-pero-invisible COMO al Espíritu invisible-pero-visiblemente-obrando. El vocabulario mismo predica la figura.",
      incorrectFeedbackEn: "Pneuma appears frequently in the NT, is native Greek, and is NOT limited to physical air. The key fact is its DOUBLE MEANING: wind AND Spirit. Jesus uses the dual sense deliberately to teach Nicodemus that the spiritual reality works like wind — hidden in origin, visible in effect.",
      incorrectFeedbackEs: "Pneuma aparece frecuentemente en el NT, es griego nativo, y NO se limita al aire físico. El hecho clave es su DOBLE SIGNIFICADO: viento Y Espíritu. Jesús usa el sentido dual deliberadamente para enseñarle a Nicodemo que la realidad espiritual obra como el viento — oculto en origen, visible en efecto."
    },
    {
      textEn: "19. According to this lesson, the pastor's task on Sunday morning is to do for his people what Jesus did for Nicodemus. That means:",
      textEs: "19. Según esta lección, la tarea del pastor el domingo por la mañana es hacer por su pueblo lo que Jesús hizo por Nicodemo. Eso significa:",
      optionsEn: ["A. Confuse them with riddles","B. Honor the literal sense, reject the literalistic flattening, teach the difference patiently, show them what the speaker meant","C. Avoid all figures of speech in preaching","D. Translate every Greek word aloud"],
      optionsEs: ["A. Confundirlos con acertijos","B. Honrar el sentido literal, rechazar el aplanamiento literalista, enseñar la diferencia pacientemente, mostrarles lo que el hablante quiso decir","C. Evitar todas las figuras del habla en la predicación","D. Traducir cada palabra griega en voz alta"],
      correct: "B",
      correctFeedbackEn: "Correct. Your people will sit in front of you with the same literalist instinct Nicodemus brought to Jesus by night. Your task is to teach them the difference between literal and literalistic, gently and patiently, until the wind blows through them too.",
      correctFeedbackEs: "Correcto. Su pueblo se sentará frente a usted con el mismo instinto literalista que Nicodemo trajo a Jesús de noche. Su tarea es enseñarles la diferencia entre lo literal y lo literalista, gentil y pacientemente, hasta que el viento sople también a través de ellos.",
      incorrectFeedbackEn: "Pastoral teaching is not riddling, figure-avoidance, or Greek lectures. The pastor's task is to HONOR THE LITERAL, REJECT THE LITERALISTIC, AND TEACH THE DIFFERENCE — patiently, gently, the way Jesus taught Nicodemus.",
      incorrectFeedbackEs: "La enseñanza pastoral no es plantear acertijos, ni evitar figuras, ni dar clases de griego. La tarea del pastor es HONRAR LO LITERAL, RECHAZAR LO LITERALISTA, Y ENSEÑAR LA DIFERENCIA — pacientemente, gentilmente, de la manera en que Jesús le enseñó a Nicodemo."
    },
    {
      textEn: "20. The closing charge of this unit to the pastor is:",
      textEs: "20. El encargo de cierre de esta unidad al pastor es:",
      optionsEn: ["A. Avoid Greek words","B. Preach only the Gospels","C. Memorize all of John","D. Honor the literal sense; reject the literalistic flattening; teach the difference — and the wind will do what the wind does, producing New Bills, new Samaritan women, and new Nicodemuses"],
      optionsEs: ["A. Evite las palabras griegas","B. Predique solo los Evangelios","C. Memorice todo Juan","D. Honre el sentido literal; rechace el aplanamiento literalista; enseñe la diferencia — y el viento hará lo que el viento hace, produciendo Nuevos Bills, nuevas mujeres samaritanas, y nuevos Nicodemos"],
      correct: "D",
      correctFeedbackEn: "Correct. The wind will do what the wind does. Some Nicodemus in the third row will leave at night confused and return at noon carrying a hundred pounds of myrrh. That is how the literal gospel preached without literalist distortion produces transformed lives to this day.",
      correctFeedbackEs: "Correcto. El viento hará lo que el viento hace. Algún Nicodemo en la tercera fila se irá de noche confundido y regresará al mediodía cargando cien libras de mirra. Así es como el evangelio literal predicado sin distorsión literalista produce vidas transformadas hasta el día de hoy.",
      incorrectFeedbackEn: "Greek-avoidance, gospel-only preaching, and memorization are not the charge. The closing charge is the PASTORAL TASK: honor the literal, reject the literalistic, teach the difference — and trust the wind to do what the wind does in the lives of your people.",
      incorrectFeedbackEs: "Evitar el griego, predicar solo los evangelios, y memorizar no son el encargo. El encargo de cierre es la TAREA PASTORAL: honrar lo literal, rechazar lo literalista, enseñar la diferencia — y confiar en que el viento haga lo que el viento hace en las vidas de su pueblo."
    }
  ];

const kwQuestions = [
    {
      textEn: "21. Define the difference between LITERAL and LITERALISTIC interpretation in your own words, and explain why the two are not synonyms.",
      textEs: "21. Defina la diferencia entre la interpretación LITERAL y la LITERALISTA con sus propias palabras, y explique por qué los dos no son sinónimos.",
      kw_en: ["literal", "literalistic", "author", "meant", "figure", "sense", "spiritual", "flat"],
      kw_es: ["literal", "literalista", "autor", "quiso", "figura", "sentido", "espiritual", "aplan"],
      modelEn: "Literal interpretation means taking the words in the sense the author meant — which may be a figure of speech. Literalistic interpretation flattens everything to bare physical meaning, ignoring that the author may have meant a figure. They are not synonyms: 'I am the door' is read literally when we take Christ's intended figurative sense, but literalistically if we imagine wood and hinges.",
      modelEs: "La interpretación literal significa tomar las palabras en el sentido que el autor quiso — que puede ser una figura de lenguaje. La interpretación literalista aplana todo a un significado físico desnudo, ignorando que el autor pudo querer una figura. No son sinónimos: «Yo soy la puerta» se lee literalmente cuando tomamos el sentido figurado que Cristo quiso, pero literalistamente si imaginamos madera y bisagras."
    },
    {
      textEn: "22. Tell the story of Nicodemus coming to Jesus by night (John 3) and explain the precise nature of Nicodemus's literalist mistake.",
      textEs: "22. Cuente la historia de Nicodemo viniendo a Jesús de noche (Juan 3) y explique la naturaleza precisa del error literalista de Nicodemo.",
      kw_en: ["Nicodemus", "Pharisee", "night", "born", "womb", "physical", "flat", "spiritual"],
      kw_es: ["Nicodemo", "fariseo", "noche", "nacer", "vientre", "físico", "fisiolog", "espiritual"],
      modelEn: "Nicodemus, a Pharisee who came to Jesus by night, heard 'you must be born again' and dropped into a flat physical reading: how can a man enter his mother's womb a second time? His mistake was literalistic — taking a spiritual figure as bare physiology. Jesus meant a spiritual birth from above, not a second trip through the womb.",
      modelEs: "Nicodemo, un fariseo que vino a Jesús de noche, oyó «tienes que nacer de nuevo» y cayó en una lectura física y plana: ¿cómo puede un hombre entrar por segunda vez en el vientre de su madre? Su error fue literalista — tomar una figura espiritual como mera fisiología. Jesús quiso decir un nacimiento espiritual de lo alto, no un segundo paso por el vientre."
    },
    {
      textEn: "23. Explain Jesus' wind illustration in John 3:8. What does the Greek word \"pneuma\" mean, and what is Jesus teaching Nicodemus through this image?",
      textEs: "23. Explique la ilustración del viento de Jesús en Juan 3:8. ¿Qué significa la palabra griega «pneuma», y qué le está enseñando Jesús a Nicodemo a través de esta imagen?",
      kw_en: ["wind", "pneuma", "Spirit", "invisible", "visible", "effect", "born", "blow"],
      kw_es: ["viento", "pneuma", "Espíritu", "invisible", "visible", "efecto", "nacer", "sopla"],
      modelEn: "In John 3:8 Jesus points to the wind: the Greek pneuma means both wind and Spirit. You cannot see the wind itself, but you see its effect — it blows where it wishes and you hear the sound. So it is with everyone born of the Spirit: the Spirit is invisible, but His visible effect in a changed life proves He is at work. Jesus teaches Nicodemus to read the invisible by its visible fruit.",
      modelEs: "En Juan 3:8 Jesús señala el viento: el griego pneuma significa tanto viento como Espíritu. No puedes ver el viento mismo, pero ves su efecto — sopla donde quiere y oyes el sonido. Así es con todo el que nace del Espíritu: el Espíritu es invisible, pero su efecto visible en una vida cambiada prueba que está obrando. Jesús enseña a Nicodemo a leer lo invisible por su fruto visible."
    },
    {
      textEn: "24. Describe how the Samaritan Woman in John 4 makes the same literalist mistake as Nicodemus, and explain why John has paired these two encounters in consecutive chapters.",
      textEs: "24. Describa cómo la mujer samaritana en Juan 4 comete el mismo error literalista que Nicodemo, y explique por qué Juan ha emparejado estos dos encuentros en capítulos consecutivos.",
      kw_en: ["Samaritan", "woman", "well", "living", "water", "bucket", "literalist", "human"],
      kw_es: ["Samaritana", "mujer", "pozo", "viva", "agua", "cubo", "literalista", "humano"],
      modelEn: "At the well of Sychar the Samaritan woman makes the same mistake as Nicodemus: Jesus offers living water and she thinks of the physical well and her bucket. John pairs the wealthy Pharisee and the poor Samaritan woman on purpose, to show the literalist mistake is not about class or education but is a human issue. Both take spiritual words flatly until Jesus patiently corrects them.",
      modelEs: "En el pozo de Sicar la mujer samaritana comete el mismo error que Nicodemo: Jesús ofrece agua viva y ella piensa en el pozo físico y su cubo. Juan empareja al fariseo rico y a la pobre samaritana a propósito, para mostrar que el error literalista no es de clase ni de educación sino un asunto humano. Ambos toman las palabras espirituales de forma plana hasta que Jesús los corrige con paciencia."
    },
    {
      textEn: "25. Explain why \"I am the door\" or \"I am the bread of life\" should be read literally — and how the literal sense is the figurative sense.",
      textEs: "25. Explique por qué «Yo soy la puerta» o «Yo soy el pan de vida» deben leerse literalmente — y cómo el sentido literal es el sentido figurativo.",
      kw_en: ["door", "bread", "figure", "meant", "spiritual", "literal", "entrance", "satisfies"],
      kw_es: ["puerta", "pan", "figura", "quiso", "espiritual", "literal", "entrada", "satisface"],
      modelEn: "When Jesus says 'I am the door' or 'I am the bread of life,' we read Him literally by taking the figure He meant — He is the entrance to salvation, the One who satisfies the soul. The literal sense here is the figurative sense, because that is what the author meant. To demand wood or wheat would be literalistic, missing the spiritual meaning Jesus intended.",
      modelEs: "Cuando Jesús dice «Yo soy la puerta» o «Yo soy el pan de vida», lo leemos literalmente al tomar la figura que Él quiso — Él es la entrada a la salvación, el que satisface el alma. El sentido literal aquí es el sentido figurado, porque eso es lo que el autor quiso. Exigir madera o trigo sería literalista, perdiendo el significado espiritual que Jesús quiso."
    },
    {
      textEn: "26. State the absurdity test for spotting figures of speech in Scripture, and apply it to one example from the lesson.",
      textEs: "26. Declare la prueba del absurdo para detectar figuras del habla en la Escritura, y aplíquela a un ejemplo de la lección.",
      kw_en: ["absurdity", "figure", "speaker", "meant", "literal", "flat", "spiritual", "sense"],
      kw_es: ["absurdo", "figura", "hablante", "quiso", "literal", "físic", "espiritual", "realidad"],
      modelEn: "The absurdity test asks: if I take this flatly and literally, does it become absurd? If a literal physical reading is absurd, the speaker meant a figure. 'I am the door' read flatly makes Christ wood, which is absurd — so He meant the figure. The test sends us to ask what the speaker actually meant rather than forcing a flat sense onto a spiritual truth.",
      modelEs: "La prueba del absurdo pregunta: si tomo esto de forma plana y literal, ¿se vuelve absurdo? Si una lectura física literal es absurda, el hablante quiso una figura. «Yo soy la puerta» leído de forma plana hace a Cristo de madera, lo cual es absurdo — así que quiso la figura. La prueba nos manda a preguntar qué quiso decir realmente el hablante en vez de forzar un sentido plano sobre una realidad espiritual."
    },
    {
      textEn: "27. Tell the story of \"Old Bill\" / \"New Bill\" of Evansville, Indiana, and explain how the story illustrates the literal meaning of \"born again.\"",
      textEs: "27. Cuente la historia de «Viejo Bill» / «Nuevo Bill» de Evansville, Indiana, y explique cómo la historia ilustra el significado literal de «nacer de nuevo».",
      kw_en: ["Bill", "Evansville", "Savior", "new", "life", "transform", "born", "changed"],
      kw_es: ["Bill", "Evansville", "Salvador", "nuevo", "vida", "transform", "nacer", "cambiado"],
      modelEn: "Old Bill of Evansville was so changed after he trusted the Savior that the town began calling him New Bill. The transformation in his life was so real and visible that a new name fit. That is the literal meaning of 'born again' — not a second physical birth but a genuinely new life, a man so transformed that he is not the same person.",
      modelEs: "El Viejo Bill de Evansville quedó tan cambiado después de confiar en el Salvador que el pueblo comenzó a llamarlo el Nuevo Bill. La transformación en su vida fue tan real y visible que un nombre nuevo le quedaba. Ese es el significado literal de «nacer de nuevo» — no un segundo nacimiento físico sino una vida genuinamente nueva, un hombre tan transformado que no es la misma persona."
    },
    {
      textEn: "28. Explain the OPPOSITE error to literalism (over-spiritualizing), and describe how the rule from Unit 8 — identify the kind of language before deciding what to do with it — protects against both extremes.",
      textEs: "28. Explique el error OPUESTO al literalismo (sobre-espiritualizar), y describa cómo la regla de la Unidad 8 — identifique la clase de lenguaje antes de decidir qué hacer con él — protege contra ambos extremos.",
      kw_en: ["over-spiritualizing", "allegory", "genre", "language", "author", "intent", "both", "literal"],
      kw_es: ["sobreespiritual", "alegoría", "género", "lenguaje", "autor", "intención", "ambos", "literal"],
      modelEn: "The opposite error to literalism is over-spiritualizing — turning a plain historical statement into hidden allegory. The rule from Unit 8 guards against both extremes: first identify the kind of language and genre before deciding what to do with it. Ask the author's intent. Some texts are literal history, some are figure; reading the genre rightly keeps the pastor from both flat literalism and runaway allegory.",
      modelEs: "El error opuesto al literalismo es sobreespiritualizar — convertir una declaración histórica sencilla en alegoría oculta. La regla de la Unidad 8 protege de ambos extremos: primero identifique el tipo de lenguaje y el género antes de decidir qué hacer con él. Pregunte la intención del autor. Algunos textos son historia literal, otros son figura; leer bien el género evita tanto el literalismo plano como la alegoría desbocada."
    },
    {
      textEn: "29. List the three diagnostic questions the pastor should ask when interpreting Scripture, and briefly explain each one.",
      textEs: "29. Enumere las tres preguntas diagnósticas que el pastor debe hacer al interpretar la Escritura, y explique brevemente cada una.",
      kw_en: ["speaker", "meant", "absurdity", "figure", "literal", "reality", "spiritual", "question"],
      kw_es: ["hablante", "quiso", "absurdo", "figura", "literal", "realidad", "espiritual", "pregunta"],
      modelEn: "The three diagnostic questions are: What did the speaker actually mean? Does a flat literal reading produce an absurdity? And is this a figure of speech or a literal statement of reality? Asking these three keeps the pastor between the ditches, reading each text for the spiritual or literal sense the author intended.",
      modelEs: "Las tres preguntas diagnósticas son: ¿Qué quiso decir realmente el hablante? ¿Produce un absurdo una lectura literal y plana? Y ¿es esto una figura de lenguaje o una declaración literal de la realidad? Hacer estas tres mantiene al pastor entre las zanjas, leyendo cada texto según el sentido espiritual o literal que el autor quiso."
    },
    {
      textEn: "30. Describe how Nicodemus reappears in John 19 with a hundred pounds of myrrh and aloes, and explain what this closing image teaches the pastor about preaching the literal sense without literalist distortion.",
      textEs: "30. Describa cómo Nicodemo reaparece en Juan 19 con cien libras de mirra y áloes, y explique qué le enseña esta imagen de cierre al pastor sobre predicar el sentido literal sin distorsión literalista.",
      kw_en: ["Nicodemus", "myrrh", "burial", "King", "born", "dark", "openly", "literal"],
      kw_es: ["Nicodemo", "mirra", "sepultura", "Rey", "nacer", "oscuridad", "abiertamente", "literal"],
      modelEn: "Nicodemus, who first came to Jesus in the dark, reappears in John 19 bringing a hundred pounds of myrrh for the burial of the crucified King, openly. The man who once stumbled over a literalistic reading of 'born again' now lives out its literal truth: he is a changed man, no longer hiding. The closing image teaches that reading for the literal sense rightly — the new birth Jesus meant — produces real transformation without literalist distortion.",
      modelEs: "Nicodemo, que primero vino a Jesús en la oscuridad, reaparece en Juan 19 trayendo cien libras de mirra para la sepultura del Rey crucificado, abiertamente. El hombre que una vez tropezó con una lectura literalista de «nacer de nuevo» ahora vive su verdad literal: es un hombre cambiado, que ya no se esconde. La imagen de cierre enseña que leer bien el sentido literal — el nuevo nacimiento que Jesús quiso — produce transformación real sin distorsión literalista."
    }
  ];
