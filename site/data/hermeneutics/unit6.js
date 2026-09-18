/* CTSHermeneutics - unit 6: per-unit configuration and content. */

const UNIT = 6;

const NEXT_UNIT_URL = "CTSHermeneuticsUnit7.html";

const PREV_UNIT_URL = "CTSHermeneuticsUnit5.html";

const IS_FINAL_UNIT = false;

const SHOW_REGISTRATION = false;

const mcQuestions = [
    {
      textEn: "1. According to the lesson, the Chinese artist's first painting of the Prodigal Son was wrong because:",
      textEs: "1. Según la lección, el primer cuadro del Hijo Pródigo hecho por el artista chino estaba equivocado porque:",
      optionsEn: ["A. The colors were too dark","B. The Prodigal looked too healthy","C. The Father was painted standing with folded arms instead of running","D. The artist had never read the parable"],
      optionsEs: ["A. Los colores eran demasiado oscuros","B. El Pródigo se veía demasiado saludable","C. El Padre fue pintado parado con los brazos cruzados en lugar de corriendo","D. El artista nunca había leído la parábola"],
      correct: "C",
      correctFeedbackEn: "Correct. The whole parable turns on what God is like — anxious to love, quick to forgive, eager to reconcile. The Father RUNS while the son is still a great way off. A stern Father with folded arms misses the parable's central point.",
      correctFeedbackEs: "Correcto. La parábola entera gira sobre cómo es Dios — ansioso por amar, listo para perdonar, ávido por reconciliar. El Padre CORRE mientras el hijo está aún lejos. Un Padre severo con los brazos cruzados pierde el punto central de la parábola.",
      incorrectFeedbackEn: "The artist's technical work was beautiful — colors, composition, anatomy were fine. The problem was theological: he painted the Father as stern, not running. He had missed the ONE CENTRAL POINT of the parable.",
      incorrectFeedbackEs: "El trabajo técnico del artista era hermoso — los colores, la composición, la anatomía estaban bien. El problema era teológico: pintó al Padre como severo, no corriendo. Había perdido el ÚNICO PUNTO CENTRAL de la parábola."
    },
    {
      textEn: "2. The Greek word \"parabolé\" literally means:",
      textEs: "2. La palabra griega «parabolé» significa literalmente:",
      optionsEn: ["A. To hide a truth","B. To prove a doctrine","C. To throw alongside","D. To memorize"],
      optionsEs: ["A. Esconder una verdad","B. Probar una doctrina","C. Arrojar al lado","D. Memorizar"],
      correct: "C",
      correctFeedbackEn: "Correct. Jesus would take a familiar earthly scene — a farmer, a woman sweeping, a king — and throw it alongside a spiritual truth so the truth could be seen by familiar light. That is what a parable does: it places one thing next to another.",
      correctFeedbackEs: "Correcto. Jesús tomaba una escena terrenal familiar — un labrador, una mujer barriendo, un rey — y la arrojaba al lado de una verdad espiritual para que la verdad pudiera verse a la luz familiar. Eso es lo que hace una parábola: coloca una cosa al lado de otra.",
      incorrectFeedbackEn: "Parables can hide and reveal, but the Greek ROOT means \"to throw alongside.\" Jesus places an everyday scene next to a spiritual truth so the truth becomes visible through the familiar image.",
      incorrectFeedbackEs: "Las parábolas pueden ocultar y revelar, pero la RAÍZ griega significa «arrojar al lado». Jesús coloca una escena cotidiana al lado de una verdad espiritual para que la verdad se vuelva visible a través de la imagen familiar."
    },
    {
      textEn: "3. According to the lesson, the difference between a parable and an allegory is:",
      textEs: "3. Según la lección, la diferencia entre una parábola y una alegoría es:",
      optionsEn: ["A. Parables are in the Old Testament, allegories in the New","B. A parable makes one comparison; an allegory makes many","C. Parables are spoken, allegories are written","D. There is no real difference between them"],
      optionsEs: ["A. Las parábolas están en el Antiguo Testamento, las alegorías en el Nuevo","B. Una parábola hace una comparación; una alegoría hace muchas","C. Las parábolas son habladas, las alegorías son escritas","D. No hay una verdadera diferencia entre ellas"],
      correct: "B",
      correctFeedbackEn: "Correct. An allegory assigns symbolic meaning to every detail — Pilgrim's Progress is an allegory. Jesus' parables make ONE central comparison, with the details as scenery. Treating a parable as an allegory smothers Christ's central point.",
      correctFeedbackEs: "Correcto. Una alegoría asigna significado simbólico a cada detalle — El progreso del peregrino es una alegoría. Las parábolas de Jesús hacen UNA comparación central, con los detalles como escenografía. Tratar una parábola como una alegoría sofoca el punto central de Cristo.",
      incorrectFeedbackEn: "Parables and allegories appear across the canon and may be written or spoken. The key difference is in HOW MANY COMPARISONS they make: a parable makes one, an allegory makes many. Reading parables as allegories produces serious errors.",
      incorrectFeedbackEs: "Las parábolas y las alegorías aparecen a lo largo del canon y pueden ser escritas o habladas. La diferencia clave está en CUÁNTAS COMPARACIONES hacen: una parábola hace una, una alegoría hace muchas. Leer las parábolas como alegorías produce errores serios."
    },
    {
      textEn: "4. Augustine's allegorical reading of the Good Samaritan (the inn = the church, the two coins = the two testaments, etc.) is used in this lesson as:",
      textEs: "4. La lectura alegórica de Agustín del Buen Samaritano (la posada = la iglesia, las dos monedas = los dos testamentos, etc.) se usa en esta lección como:",
      optionsEn: ["A. The classic case of how allegorizing smothers a parable's central point","B. A model of careful exegesis","C. A reading the modern church should recover","D. An exception that proves the rule"],
      optionsEs: ["A. El caso clásico de cómo el alegorizar sofoca el punto central de una parábola","B. Un modelo de exégesis cuidadosa","C. Una lectura que la iglesia moderna debe recuperar","D. Una excepción que confirma la regla"],
      correct: "A",
      correctFeedbackEn: "Correct. Augustine assigned a symbol to every detail. Ingenious, but he stopped hearing what Jesus actually said. Jesus told the parable to answer one question — \"Who is my neighbor?\" — and the answer was buried under a pile of symbols.",
      correctFeedbackEs: "Correcto. Agustín asignó un símbolo a cada detalle. Ingenioso, pero dejó de oír lo que Jesús realmente dijo. Jesús contó la parábola para responder una sola pregunta — «¿quién es mi prójimo?» — y la respuesta quedó enterrada bajo una pila de símbolos.",
      incorrectFeedbackEn: "Augustine's reading is brilliant but wrong, not a model or an exception. The lesson treats it as the classic CAUTIONARY example: when every detail is allegorized, the parable's one central point is lost beneath the symbols.",
      incorrectFeedbackEs: "La lectura de Agustín es brillante pero equivocada, no un modelo ni una excepción. La lección la trata como el ejemplo clásico de ADVERTENCIA: cuando cada detalle se alegoriza, el único punto central de la parábola se pierde bajo los símbolos."
    },
    {
      textEn: "5. The single question Jesus was answering in the Parable of the Good Samaritan was:",
      textEs: "5. La única pregunta que Jesús estaba respondiendo en la Parábola del Buen Samaritano era:",
      optionsEn: ["A. \"What does it cost to follow me?\"","B. \"Why does God allow evil?\"","C. \"Should we travel from Jerusalem to Jericho?\"","D. \"Who is my neighbor?\""],
      optionsEs: ["A. «¿Qué cuesta seguirme?»","B. «¿Por qué permite Dios el mal?»","C. «¿Debemos viajar de Jerusalén a Jericó?»","D. «¿Quién es mi prójimo?»"],
      correct: "D",
      correctFeedbackEn: "Correct. A lawyer asked, \"Who is my neighbor?\" The whole parable answers that one question: your neighbor is anyone who needs your mercy, no matter their race or religion. The audience question is the first key to the central point.",
      correctFeedbackEs: "Correcto. Un intérprete de la ley preguntó: «¿Quién es mi prójimo?» Toda la parábola responde esa única pregunta: su prójimo es cualquiera que necesite su misericordia, sin importar su raza ni su religión. La pregunta de la audiencia es la primera clave al punto central.",
      incorrectFeedbackEn: "The Good Samaritan was told in response to a specific lawyer's question recorded in Luke 10:29: \"And who is my neighbor?\" The whole parable is built to answer that one question, and reading it through any other lens distorts its central point.",
      incorrectFeedbackEs: "El Buen Samaritano fue contado en respuesta a una pregunta específica de un intérprete de la ley registrada en Lucas 10:29: «¿y quién es mi prójimo?» Toda la parábola está construida para responder esa única pregunta, y leerla a través de cualquier otro lente distorsiona su punto central."
    },
    {
      textEn: "6. The lesson names three signals that usually help the pastor identify a parable's central point. The first is:",
      textEs: "6. La lección nombra tres señales que generalmente ayudan al pastor a identificar el punto central de una parábola. La primera es:",
      optionsEn: ["A. What question is Jesus answering?","B. Which Greek word is repeated?","C. How many verses does the parable take?","D. Which Old Testament prophet is referenced?"],
      optionsEs: ["A. ¿Qué pregunta está respondiendo Jesús?","B. ¿Qué palabra griega se repite?","C. ¿Cuántos versículos toma la parábola?","D. ¿Qué profeta del Antiguo Testamento es referenciado?"],
      correct: "A",
      correctFeedbackEn: "Correct. The Good Samaritan answers \"Who is my neighbor?\" The Lost Sheep answers \"Why is Jesus eating with sinners?\" The Vineyard Workers answers \"Are the latecomers really equal?\" Find the question, and you have found the central point.",
      correctFeedbackEs: "Correcto. El Buen Samaritano responde «¿quién es mi prójimo?» La Oveja Perdida responde «¿por qué come Jesús con pecadores?» Los Obreros de la Viña responden «¿son los que llegan tarde realmente iguales?» Encuentre la pregunta, y habrá encontrado el punto central.",
      incorrectFeedbackEn: "Word frequency, verse count, and prophet references can be useful in some texts but they are not the FIRST signal for a parable's central point. Start with the QUESTION Jesus was answering — it usually drives the whole story.",
      incorrectFeedbackEs: "La frecuencia de palabras, el conteo de versículos, y las referencias proféticas pueden ser útiles en algunos textos pero no son la PRIMERA señal del punto central de una parábola. Comience con la PREGUNTA que Jesús estaba respondiendo — generalmente impulsa toda la historia."
    },
    {
      textEn: "7. The second signal for finding a parable's central point is:",
      textEs: "7. La segunda señal para encontrar el punto central de una parábola es:",
      optionsEn: ["A. The translator's footnote","B. The chapter heading in your study Bible","C. The denomination you belong to","D. The audience originally hearing the parable"],
      optionsEs: ["A. La nota al pie del traductor","B. El encabezado del capítulo en su Biblia de estudio","C. La denominación a la que pertenece","D. La audiencia que originalmente escuchó la parábola"],
      correct: "D",
      correctFeedbackEn: "Correct. The Prodigal Son was told to grumbling Pharisees who resented Jesus' company with sinners. That is why the parable's elder brother features so prominently — the audience is caught in the mirror. Know the audience and you find the point.",
      correctFeedbackEs: "Correcto. El Hijo Pródigo fue contado a fariseos que murmuraban resentidos por la compañía de Jesús con los pecadores. Por eso el hermano mayor en la parábola es tan prominente — la audiencia está atrapada en el espejo. Conozca la audiencia y encontrará el punto.",
      incorrectFeedbackEn: "Footnotes, headings, and denominations come from later editors, not from Christ. The second signal is the ORIGINAL AUDIENCE — who Jesus was speaking to. The audience often reveals which character in the parable is the mirror.",
      incorrectFeedbackEs: "Las notas al pie, los encabezados, y las denominaciones vienen de editores posteriores, no de Cristo. La segunda señal es la AUDIENCIA ORIGINAL — a quién hablaba Jesús. La audiencia a menudo revela qué personaje en la parábola es el espejo."
    },
    {
      textEn: "8. The third signal for finding a parable's central point is:",
      textEs: "8. La tercera señal para encontrar el punto central de una parábola es:",
      optionsEn: ["A. The length of the parable","B. The climax — the most emotional or surprising line in the story","C. The geography mentioned","D. The cost of materials in the story"],
      optionsEs: ["A. La duración de la parábola","B. El clímax — la línea más emotiva o sorprendente de la historia","C. La geografía mencionada","D. El costo de los materiales en la historia"],
      correct: "B",
      correctFeedbackEn: "Correct. The climax usually carries the main point. In the Prodigal Son, the climax is the Father running. The whole parable is about that running — every other detail serves it. Find the climax, you find the heart.",
      correctFeedbackEs: "Correcto. El clímax generalmente carga el punto principal. En el Hijo Pródigo, el clímax es el Padre corriendo. Toda la parábola es acerca de esa carrera — cada otro detalle la sirve. Encuentre el clímax, encuentra el corazón.",
      incorrectFeedbackEn: "Length, geography, and economic details are scenery. The third signal is the CLIMAX — the line where the story breaks open emotionally or surprisingly. That climax almost always carries the central point Jesus wants you to hear.",
      incorrectFeedbackEs: "La duración, la geografía, y los detalles económicos son escenografía. La tercera señal es el CLÍMAX — la línea donde la historia se abre emotiva o sorprendentemente. Ese clímax casi siempre carga el punto central que Jesús quiere que usted oiga."
    },
    {
      textEn: "9. The Father in the Prodigal Son painting wears mismatched shoes (one red, one blue) because:",
      textEs: "9. El Padre en el cuadro del Hijo Pródigo lleva zapatos desiguales (uno rojo, uno azul) porque:",
      optionsEn: ["A. Persian fashion of the day required it","B. The artist could not afford matching paint","C. The shoes represent the two testaments","D. He grabbed the two nearest shoes in his hurry to run out and welcome his son"],
      optionsEs: ["A. La moda persa del día lo requería","B. El artista no podía pagar pintura a juego","C. Los zapatos representan los dos testamentos","D. Agarró los dos zapatos más cercanos en su prisa por correr a recibir a su hijo"],
      correct: "D",
      correctFeedbackEn: "Correct. The artist made the Father so overjoyed and eager that he grabbed whatever shoes were closest and ran. The shoes are not a symbol of a doctrine; they are an image of the haste of grace. Notice — this is scenery serving the central point.",
      correctFeedbackEs: "Correcto. El artista hizo al Padre tan rebosante de gozo y anhelo que agarró los zapatos que estuvieran más cerca y corrió. Los zapatos no son símbolo de una doctrina; son una imagen de la prisa de la gracia. Note — esto es escenografía sirviendo al punto central.",
      incorrectFeedbackEn: "The mismatched shoes are not a fashion fact, a money problem, or a symbol of the testaments. They are an artist's image of the Father's haste — grabbing the two closest shoes and running. Scenery serving the central point.",
      incorrectFeedbackEs: "Los zapatos desiguales no son un hecho de moda, ni un problema de dinero, ni un símbolo de los testamentos. Son la imagen del artista de la prisa del Padre — agarrando los dos zapatos más cercanos y corriendo. Escenografía sirviendo al punto central."
    },
    {
      textEn: "10. The Buddhist parable of the prodigal son (from the Lotus of Perfect Law) differs from Jesus' parable in that:",
      textEs: "10. La parábola budista del hijo pródigo (del Loto de la Ley Perfecta) difiere de la parábola de Jesús en que:",
      optionsEn: ["A. The Buddhist son never returns home","B. The Buddhist father reveals his identity immediately","C. The Buddhist father waits until the son becomes worthy step by step before welcoming him","D. The Buddhist parable does not feature a father"],
      optionsEs: ["A. El hijo budista nunca regresa a casa","B. El padre budista revela su identidad inmediatamente","C. El padre budista espera hasta que el hijo se vuelva digno paso a paso antes de recibirlo","D. La parábola budista no presenta a un padre"],
      correct: "C",
      correctFeedbackEn: "Correct. Same plot, opposite point. The Buddhist parable teaches that the son must EARN his way back. Jesus' parable teaches the OPPOSITE — the Father runs while the son is still a great way off. Grace precedes earning. A pastor who allegorizes Jesus' parable can end up preaching the Buddhist version.",
      correctFeedbackEs: "Correcto. La misma trama, el punto opuesto. La parábola budista enseña que el hijo debe GANARSE el camino de regreso. La parábola de Jesús enseña lo OPUESTO — el Padre corre mientras el hijo está aún lejos. La gracia precede al merecimiento. Un pastor que alegoriza la parábola de Jesús puede terminar predicando la versión budista.",
      incorrectFeedbackEn: "In the Buddhist version, the son does return and the father is present, but the father conceals his identity and waits until the son has earned his way back step by step. That is the OPPOSITE of Jesus' point — and that is why allegorizing matters.",
      incorrectFeedbackEs: "En la versión budista, el hijo sí regresa y el padre está presente, pero el padre oculta su identidad y espera hasta que el hijo se haya ganado el camino paso a paso. Eso es lo OPUESTO al punto de Jesús — y por eso importa alegorizar."
    },
    {
      textEn: "11. The central point of the Parable of the Sower (Mark 4) is:",
      textEs: "11. El punto central de la Parábola del Sembrador (Marcos 4) es:",
      optionsEn: ["A. The condition of the heart determines what happens when the Word is preached","B. Farmers should sow seed more carefully","C. There are exactly four types of human beings","D. Birds, rocks, thorns, and good ground all symbolize one thing"],
      optionsEs: ["A. La condición del corazón determina lo que sucede cuando se predica la Palabra","B. Los labradores deben sembrar la semilla con más cuidado","C. Hay exactamente cuatro tipos de seres humanos","D. Las aves, las rocas, los espinos, y la buena tierra todos simbolizan una sola cosa"],
      correct: "A",
      correctFeedbackEn: "Correct. Do not preach four separate sermons on four kinds of soil. Preach one sermon on whether the listener will receive the seed. The four soils are scenery serving that single point — and the point is the responding heart.",
      correctFeedbackEs: "Correcto. No predique cuatro sermones separados sobre cuatro clases de suelo. Predique un solo sermón sobre si el oyente recibirá la semilla. Los cuatro suelos son escenografía que sirve a ese único punto — y el punto es el corazón que responde.",
      incorrectFeedbackEn: "The Sower is not agricultural advice, not a four-fold human typology, and not a uniform symbol. The CENTRAL POINT is the heart's reception of the Word — the four soils illustrate how that reception varies, but they are not the point itself.",
      incorrectFeedbackEs: "El Sembrador no es consejo agrícola, ni una tipología humana cuádruple, ni un símbolo uniforme. El PUNTO CENTRAL es la recepción de la Palabra por el corazón — los cuatro suelos ilustran cómo varía esa recepción, pero ellos no son el punto mismo."
    },
    {
      textEn: "12. The central point of the Parable of the Vineyard Workers (Matthew 20) is:",
      textEs: "12. El punto central de la Parábola de los Obreros de la Viña (Mateo 20) es:",
      optionsEn: ["A. A lesson in fair labor wages","B. God's generosity is not constrained by human bookkeeping","C. Latecomers should be paid less for less work","D. The vineyard owner was secretly unjust"],
      optionsEs: ["A. Una lección sobre salarios laborales justos","B. La generosidad de Dios no está constreñida por la contabilidad humana","C. Los que llegan tarde deben recibir menos por menos trabajo","D. El dueño de la viña era secretamente injusto"],
      correct: "B",
      correctFeedbackEn: "Correct. The parable comforts those who came to Christ late and rebukes those who think early arrival gives them a higher claim. It is not about wages or unfairness — it is about a generosity that exceeds bookkeeping.",
      correctFeedbackEs: "Correcto. La parábola consuela a los que vinieron a Cristo tarde y reprende a los que piensan que su llegada temprana les da un reclamo mayor. No se trata de salarios ni de injusticia — se trata de una generosidad que excede a la contabilidad.",
      incorrectFeedbackEn: "The parable is NOT labor economics. The owner is not unjust. The whole point is that God's grace gives the same eternal life to those who come late as to those who come early — and that this generosity scandalizes those who count by ledger.",
      incorrectFeedbackEs: "La parábola NO es economía laboral. El dueño no es injusto. El punto entero es que la gracia de Dios da la misma vida eterna a los que llegan tarde como a los que llegan temprano — y que esa generosidad escandaliza a los que cuentan por libro mayor."
    },
    {
      textEn: "13. The central point of the Parable of the Persistent Widow (Luke 18) is:",
      textEs: "13. El punto central de la Parábola de la Viuda Persistente (Lucas 18) es:",
      optionsEn: ["A. God resembles an unjust judge","B. Widows should always pursue lawsuits","C. If even an unjust judge yields to persistent pleading, how much more will a righteous God hear His own?","D. The judge represents the Roman Empire"],
      optionsEs: ["A. Dios se parece a un juez injusto","B. Las viudas siempre deben perseguir juicios","C. Si aun un juez injusto cede a la súplica persistente, ¿cuánto más oirá un Dios justo a los Suyos?","D. El juez representa al Imperio Romano"],
      correct: "C",
      correctFeedbackEn: "Correct. The parable argues from contrast, not from similarity. God is NOT like the unjust judge; God is the opposite. The point is to encourage persistence in prayer to a Father who is not reluctant but eager to hear.",
      correctFeedbackEs: "Correcto. La parábola argumenta por contraste, no por semejanza. Dios NO es como el juez injusto; Dios es lo opuesto. El punto es animar a la persistencia en la oración a un Padre que no es reacio sino ávido de oír.",
      incorrectFeedbackEn: "Allegorizing the widow as the church and the judge as God produces a strange and wrong reading: it makes God resemble an unjust judge. The parable's central point is the OPPOSITE — a contrast that magnifies God's eagerness to hear our prayers.",
      incorrectFeedbackEs: "Alegorizar la viuda como la iglesia y al juez como Dios produce una lectura extraña y equivocada: hace que Dios se parezca a un juez injusto. El punto central de la parábola es lo OPUESTO — un contraste que magnifica la avidez de Dios por oír nuestras oraciones."
    },
    {
      textEn: "14. The one exception to the rule \"parables are not allegories\" is:",
      textEs: "14. La única excepción a la regla «las parábolas no son alegorías» es:",
      optionsEn: ["A. When the parable is more than ten verses long","B. When the parable involves animals","C. When Jesus Himself explains a detail of the parable","D. When the parable appears in more than one Gospel"],
      optionsEs: ["A. Cuando la parábola tiene más de diez versículos","B. Cuando la parábola involucra animales","C. Cuando Jesús mismo explica un detalle de la parábola","D. Cuando la parábola aparece en más de un Evangelio"],
      correct: "C",
      correctFeedbackEn: "Correct. When Jesus interprets the Sower for His disciples — the seed is the Word, the path is the hardened hearer, the rocky ground is the shallow hearer — those are not the allegorizer's invention. They are the Author's authorized commentary. Use them.",
      correctFeedbackEs: "Correcto. Cuando Jesús interpreta al Sembrador para Sus discípulos — la semilla es la Palabra, el camino es el oyente endurecido, el terreno pedregoso es el oyente superficial — esas no son invención del alegorista. Son el comentario autorizado del Autor. Úselas.",
      incorrectFeedbackEn: "Length, animal characters, and multiple Gospel attestation are not the exception. The exception is when JESUS HIMSELF EXPLAINS a detail. His authorized commentary lifts that detail from scenery to symbol — but only that detail, and only because He said so.",
      incorrectFeedbackEs: "La duración, los personajes animales, y la atestación en múltiples Evangelios no son la excepción. La excepción es cuando JESÚS MISMO EXPLICA un detalle. Su comentario autorizado eleva ese detalle de escenografía a símbolo — pero solo ese detalle, y solo porque Él lo dijo."
    },
    {
      textEn: "15. The lesson summarizes: when Jesus does not tell us what a detail represents:",
      textEs: "15. La lección resume: cuando Jesús no nos dice lo que un detalle representa:",
      optionsEn: ["A. Silence from the Author means scenery, not symbol","B. We get to decide for Him","C. The pastor should pick the most spiritual meaning","D. Tradition fills in what Christ omitted"],
      optionsEs: ["A. El silencio del Autor significa escenografía, no símbolo","B. Nosotros podemos decidir por Él","C. El pastor debe escoger el significado más espiritual","D. La tradición llena lo que Cristo omitió"],
      correct: "A",
      correctFeedbackEn: "Correct. The fatted calf is not the Lord's Supper. The two coins are not the two testaments. The widow's judge is not the Father. When the Author is silent on what a detail means, the detail is SCENERY — not a symbol waiting for human invention.",
      correctFeedbackEs: "Correcto. El becerro engordado no es la Cena del Señor. Las dos monedas no son los dos testamentos. El juez de la viuda no es el Padre. Cuando el Autor está en silencio sobre lo que significa un detalle, el detalle es ESCENOGRAFÍA — no un símbolo a la espera de invención humana.",
      incorrectFeedbackEn: "Deciding for Jesus, picking spiritual meanings, and importing tradition all fill the Author's silence with human voices. The discipline of this principle is the opposite: when Jesus is silent, the detail is SCENERY. Resist the temptation to symbolize.",
      incorrectFeedbackEs: "Decidir por Jesús, escoger significados espirituales, y traer la tradición todos llenan el silencio del Autor con voces humanas. La disciplina de este principio es lo opuesto: cuando Jesús está en silencio, el detalle es ESCENOGRAFÍA. Resista la tentación de simbolizar."
    },
    {
      textEn: "16. The lesson recommends five practical steps for preaching a parable. The first step is:",
      textEs: "16. La lección recomienda cinco pasos prácticos para predicar una parábola. El primer paso es:",
      optionsEn: ["A. Pick a memorable illustration","B. Read the parable in its setting — the question, the audience, the chapter","C. Choose a contemporary application","D. Decide on a memorable title"],
      optionsEs: ["A. Escoger una ilustración memorable","B. Leer la parábola en su entorno — la pregunta, la audiencia, el capítulo","C. Escoger una aplicación contemporánea","D. Decidir un título memorable"],
      correct: "B",
      correctFeedbackEn: "Correct. Read the parable in its setting first: what question is being asked, what audience is being addressed, what chapter it sits inside. Setting is the source of the central point. Skip this step and the rest of the sermon drifts.",
      correctFeedbackEs: "Correcto. Lea la parábola en su entorno primero: qué pregunta se hace, qué audiencia se aborda, qué capítulo la alberga. El entorno es la fuente del punto central. Sáltese este paso y el resto del sermón se desvía.",
      incorrectFeedbackEn: "Illustrations, applications, and titles are downstream from the central point. The FIRST step is to read the parable IN ITS SETTING — the question being asked, the audience listening, the chapter around it. Only then can the central point be found.",
      incorrectFeedbackEs: "Las ilustraciones, las aplicaciones, y los títulos vienen río abajo del punto central. El PRIMER paso es leer la parábola EN SU ENTORNO — la pregunta que se hace, la audiencia que escucha, el capítulo alrededor. Solo entonces puede encontrarse el punto central."
    },
    {
      textEn: "17. The second practical step the lesson recommends is:",
      textEs: "17. El segundo paso práctico que la lección recomienda es:",
      optionsEn: ["A. Memorize the parable in Greek","B. State the central point in one sentence","C. Find five commentaries that agree with each other","D. Look up the Hebrew word for parable"],
      optionsEs: ["A. Memorizar la parábola en griego","B. Declarar el punto central en una sola oración","C. Encontrar cinco comentarios que estén de acuerdo entre sí","D. Buscar la palabra hebrea para parábola"],
      correct: "B",
      correctFeedbackEn: "Correct. If you cannot write the central point on a single line, you have not yet found it. Forcing one-sentence clarity is a discipline that exposes muddy thinking and prevents allegorical drift.",
      correctFeedbackEs: "Correcto. Si no puede escribir el punto central en una sola línea, todavía no lo ha encontrado. Forzar la claridad de una sola oración es una disciplina que expone el pensamiento turbio y previene la deriva alegórica.",
      incorrectFeedbackEn: "Greek memorization, multiple commentaries, and Hebrew word study are tools, not the second step. The second step is one-sentence clarity: if you cannot SAY the central point in a single sentence, you have not yet FOUND the central point.",
      incorrectFeedbackEs: "La memorización griega, los múltiples comentarios, y el estudio de palabras hebreas son herramientas, no el segundo paso. El segundo paso es la claridad de una sola oración: si no puede DECIR el punto central en una sola oración, todavía no ha ENCONTRADO el punto central."
    },
    {
      textEn: "18. The Henri Nouwen / Rembrandt Hermitage story (two hours in front of the Prodigal Son painting) illustrates:",
      textEs: "18. La historia de Henri Nouwen / Rembrandt en el Hermitage (dos horas frente al cuadro del Hijo Pródigo) ilustra:",
      optionsEn: ["A. The importance of expensive art for spiritual life","B. The danger of museum visits","C. The fact that all great Russian painters were Christians","D. A great parable has many facets and angles — but one central light source"],
      optionsEs: ["A. La importancia del arte costoso para la vida espiritual","B. El peligro de las visitas a museos","C. El hecho de que todos los grandes pintores rusos eran cristianos","D. Una gran parábola tiene muchas facetas y ángulos — pero una sola fuente central de luz"],
      correct: "D",
      correctFeedbackEn: "Correct. Nouwen wrote, \"There were as many paintings in the Prodigal Son as there were changes in the day.\" A parable is like that: many facets, many details, many angles — but one central light source. Find that source and every detail glows.",
      correctFeedbackEs: "Correcto. Nouwen escribió: «había tantos cuadros en el Hijo Pródigo como había cambios en el día». Una parábola es así: muchas facetas, muchos detalles, muchos ángulos — pero una sola fuente central de luz. Encuentre esa fuente y cada detalle brilla.",
      incorrectFeedbackEn: "The story is not about art purchase, museum risk, or Russian Christianity. It is the closing IMAGE of the unit: a parable has many angles and facets that change with the light — but a SINGLE central light source. Find it, and the painting glows.",
      incorrectFeedbackEs: "La historia no se trata de la compra de arte, ni del riesgo de los museos, ni de la cristiandad rusa. Es la IMAGEN de cierre de la unidad: una parábola tiene muchos ángulos y facetas que cambian con la luz — pero una SOLA fuente central de luz. Encuéntrela, y el cuadro brilla."
    },
    {
      textEn: "19. According to this lesson, what does an allegorized sermon do to the listening congregation?",
      textEs: "19. Según esta lección, ¿qué hace un sermón alegorizado a la congregación oyente?",
      optionsEn: ["A. Impresses them with the pastor's cleverness for ten minutes and feeds them nothing for the week","B. Always converts the lost","C. Provides the deepest possible insight into Scripture","D. Helps everyone memorize the Bible faster"],
      optionsEs: ["A. Los impresiona con el ingenio del pastor por diez minutos y no los alimenta nada para la semana","B. Siempre convierte a los perdidos","C. Proporciona la perspectiva más profunda posible en la Escritura","D. Ayuda a todos a memorizar la Biblia más rápido"],
      correct: "A",
      correctFeedbackEn: "Correct. Allegorized sermons can be ingenious. They cannot feed the soul, because they substitute the pastor's invention for Christ's words. Ten minutes of admiration, then a week of nothing. A parable rightly preached burns for the whole week.",
      correctFeedbackEs: "Correcto. Los sermones alegorizados pueden ser ingeniosos. No pueden alimentar al alma, porque sustituyen la invención del pastor por las palabras de Cristo. Diez minutos de admiración, luego una semana de nada. Una parábola predicada correctamente arde durante toda la semana.",
      incorrectFeedbackEn: "Allegorized sermons do not consistently convert, deepen, or aid memorization. The honest evaluation is that they impress for ten minutes and feed nothing for the week — because the pastor's creativity has replaced the Lord's actual point.",
      incorrectFeedbackEs: "Los sermones alegorizados no convierten consistentemente, ni profundizan, ni ayudan a memorizar. La evaluación honesta es que impresionan por diez minutos y no alimentan nada para la semana — porque la creatividad del pastor ha reemplazado el punto real del Señor."
    },
    {
      textEn: "20. The closing charge of this unit to the pastor is:",
      textEs: "20. El encargo de cierre de esta unidad al pastor es:",
      optionsEn: ["A. Avoid all parables in preaching","B. Allegorize freely whenever possible","C. Memorize every parable in Greek","D. Paint the Father running — preach the single central light Jesus shone into the room, and the details will take care of themselves"],
      optionsEs: ["A. Evite todas las parábolas en la predicación","B. Alegorice libremente siempre que sea posible","C. Memorice cada parábola en griego","D. Pinte al Padre corriendo — predique la única luz central que Jesús hizo brillar en el cuarto, y los detalles se cuidarán solos"],
      correct: "D",
      correctFeedbackEn: "Correct. Paint the Father running. Paint the question being answered. Paint the single light Jesus shone into the room. The mismatched shoes — every supporting detail of the story — will take care of themselves.",
      correctFeedbackEs: "Correcto. Pinte al Padre corriendo. Pinte la pregunta que se está respondiendo. Pinte la luz única que Jesús hizo brillar en el cuarto. Los zapatos desiguales — cada detalle de apoyo de la historia — se cuidarán solos.",
      incorrectFeedbackEn: "Avoiding parables, allegorizing them, and Greek-only memorization all miss the mark. The closing charge is positive and pastoral: paint the central light, and every detail of the story will glow in the right place because of it.",
      incorrectFeedbackEs: "Evitar las parábolas, alegorizarlas, y memorizarlas solo en griego todos pierden el blanco. El encargo de cierre es positivo y pastoral: pinte la luz central, y cada detalle de la historia brillará en el lugar correcto por causa de ella."
    }
  ];

const kwQuestions = [
    {
      textEn: "21. Tell the story of the Chinese artist and the missionary's correction of his first painting of the Prodigal Son. Explain what it teaches about reading parables.",
      textEs: "21. Cuente la historia del artista chino y la corrección del misionero a su primer cuadro del Hijo Pródigo. Explique lo que enseña sobre leer las parábolas.",
      kw_en: ["Chinese", "artist", "Prodigal", "Father", "running", "central", "point", "paint"],
      kw_es: ["chino", "artista", "Pródigo", "Padre", "corriendo", "central", "punto", "pintar"],
      modelEn: "A missionary told a Chinese artist who wanted to paint the Christian faith to paint the Parable of the Prodigal Son. When the artist got it right, the central figure was the Father running to meet his son, robes flapping, full of joy. The story teaches that a parable has one central point — here, the running, welcoming Father — not a dozen scattered symbols to paint.",
      modelEs: "Un misionero le dijo a un artista chino que quería pintar la fe cristiana que pintara la Parábola del Hijo Pródigo. Cuando el artista lo logró, la figura central era el Padre corriendo a recibir a su hijo, con las túnicas al viento, lleno de gozo. La historia enseña que una parábola tiene un solo punto central — aquí, el Padre que corre y recibe — no una docena de símbolos dispersos que pintar."
    },
    {
      textEn: "22. Define a parable in your own words and contrast it with an allegory. Why does this distinction matter for the pastor?",
      textEs: "22. Defina una parábola con sus propias palabras y contrástela con una alegoría. ¿Por qué importa esta distinción para el pastor?",
      kw_en: ["parable", "allegory", "central", "comparison", "scenery", "detail", "Jesus", "single"],
      kw_es: ["parábola", "alegoría", "central", "comparación", "escenografía", "detalle", "Jesús", "único"],
      modelEn: "Most parables make a single central comparison, with the rest of the story serving as scenery that carries that one point — though a few, like the Wheat and Tares, come with several correspondences Jesus Himself supplies (Matthew 13:36-43). An allegory, by contrast, assigns the interpreter's own separate meaning to every detail without textual warrant. The distinction matters because if the pastor allegorizes Jesus' parables on his own authority, he will find a dozen hidden meanings Jesus never intended and miss the point or points He did intend.",
      modelEs: "La mayoría de las parábolas hacen una sola comparación central, con el resto de la historia sirviendo de escenografía que lleva ese único punto — aunque algunas, como el Trigo y la Cizaña, vienen con varias correspondencias que el mismo Jesús proporciona (Mateo 13:36-43). Una alegoría, en cambio, asigna el propio significado del intérprete a cada detalle sin respaldo textual. La distinción importa porque si el pastor alegoriza las parábolas de Jesús por su propia autoridad, hallará una docena de significados ocultos que Jesús nunca quiso y perderá el punto o los puntos que sí quiso."
    },
    {
      textEn: "23. Describe Augustine's allegorical reading of the Good Samaritan and explain why this lesson treats it as a cautionary example.",
      textEs: "23. Describa la lectura alegórica de Agustín del Buen Samaritano y explique por qué esta lección la trata como un ejemplo de advertencia.",
      kw_en: ["Augustine", "Samaritan", "inn", "coins", "symbol", "detail", "allegory", "caution"],
      kw_es: ["Agustín", "Samaritano", "posada", "monedas", "símbolo", "detalle", "alegoría", "advertencia"],
      modelEn: "Augustine read the Good Samaritan as an allegory, assigning a symbol to every detail — the inn became the church, the innkeeper Paul, the two coins the two testaments, the Samaritan Christ. The lesson treats this as a cautionary example because once each detail is a symbol, the interpreter, not Jesus, controls the meaning, and the parable's real point is buried.",
      modelEs: "Agustín leyó al Buen Samaritano como una alegoría, asignando un símbolo a cada detalle — la posada era la iglesia, el posadero Pablo, las dos monedas los dos testamentos, el Samaritano Cristo. La lección lo trata como ejemplo de advertencia porque una vez que cada detalle es un símbolo, el intérprete, no Jesús, controla el significado, y el punto real de la parábola queda enterrado."
    },
    {
      textEn: "24. The lesson names three signals that help identify a parable's central point. Name and briefly explain each signal.",
      textEs: "24. La lección nombra tres señales que ayudan a identificar el punto central de una parábola. Nombre y explique brevemente cada señal.",
      kw_en: ["question", "audience", "climax", "central", "signal", "point", "story", "prompt"],
      kw_es: ["pregunta", "audiencia", "clímax", "central", "señal", "punto", "historia", "provocó"],
      modelEn: "Three signals help find a parable's central point. First, the question or situation that prompted the parable. Second, the audience Jesus was addressing. Third, the climax of the story, where the weight falls. Reading these signals together keeps the interpreter on the one central point rather than wandering into the scenery.",
      modelEs: "Tres señales ayudan a hallar el punto central de una parábola. Primero, la pregunta o situación que provocó la parábola. Segundo, la audiencia a la que Jesús se dirigía. Tercero, el clímax de la historia, donde cae el peso. Leer estas señales juntas mantiene al intérprete en el único punto central en lugar de divagar por la escenografía."
    },
    {
      textEn: "25. Tell the Buddhist Prodigal Son story (from the Lotus of Perfect Law) and explain how it has the same plot as Jesus' parable but the opposite central point.",
      textEs: "25. Cuente la historia budista del hijo pródigo (del Loto de la Ley Perfecta) y explique cómo tiene la misma trama que la parábola de Jesús pero el punto central opuesto.",
      kw_en: ["Buddhist", "Lotus", "earn", "worthy", "grace", "precedes", "Father", "opposite"],
      kw_es: ["budista", "Loto", "ganar", "digno", "gracia", "precede", "Padre", "opuesto"],
      modelEn: "The Buddhist Prodigal in the Lotus Sutra has the same plot as Jesus' parable but the opposite central point: the son must work for years to earn his way and prove himself worthy before the father will receive him. In Jesus' parable the Father runs out first — grace precedes the son's worthiness. Same story, opposite gospel.",
      modelEs: "El Pródigo budista del Sutra del Loto tiene la misma trama que la parábola de Jesús pero el punto central opuesto: el hijo debe trabajar años para ganarse el regreso y probarse digno antes de que el padre lo reciba. En la parábola de Jesús el Padre corre primero — la gracia precede a la dignidad del hijo. Misma historia, evangelio opuesto."
    },
    {
      textEn: "26. State in one sentence the central point of the Parable of the Sower (Mark 4), and explain why the four soils are scenery rather than four separate doctrines.",
      textEs: "26. Declare en una sola oración el punto central de la Parábola del Sembrador (Marcos 4), y explique por qué los cuatro suelos son escenografía y no cuatro doctrinas separadas.",
      kw_en: ["Sower", "seed", "Word", "heart", "receive", "soils", "scenery", "central"],
      kw_es: ["Sembrador", "semilla", "Palabra", "coraz", "recib", "suelos", "escenografía", "central"],
      modelEn: "The central point of the Parable of the Sower is that the same seed — the Word of God — meets different hearts and only the receptive heart bears fruit. The four soils are scenery serving that one point, not four separate doctrines to be mined individually. Read as four doctrines, the parable loses its single message about how the heart receives the Word.",
      modelEs: "El punto central de la Parábola del Sembrador es que la misma semilla — la Palabra de Dios — encuentra corazones diferentes y solo el corazón receptivo da fruto. Los cuatro suelos son escenografía que sirve a ese único punto, no cuatro doctrinas separadas para explotar individualmente. Leída como cuatro doctrinas, la parábola pierde su mensaje único sobre cómo el corazón recibe la Palabra."
    },
    {
      textEn: "27. State the central point of the Parable of the Vineyard Workers (Matthew 20) and explain why this parable is NOT about labor economics.",
      textEs: "27. Declare el punto central de la Parábola de los Obreros de la Viña (Mateo 20) y explique por qué esta parábola NO se trata de economía laboral.",
      kw_en: ["Vineyard", "workers", "generous", "grace", "equal", "late", "owner", "economics"],
      kw_es: ["viña", "obreros", "generos", "gracia", "igual", "tarde", "dueño", "economía"],
      modelEn: "The central point of the Vineyard Workers is the owner's generosity, not labor economics. He pays the same wage to those hired late as to those hired early, and when they grumble he answers that he may do as he wishes with his own. The parable is about grace — God's equal, undeserved generosity — not a lesson in fair wages.",
      modelEs: "El punto central de los Obreros de la Viña es la generosidad del dueño, no la economía laboral. Paga el mismo salario a los contratados tarde que a los contratados temprano, y cuando se quejan responde que puede hacer lo que quiera con lo suyo. La parábola trata de la gracia — la generosidad igual e inmerecida de Dios — no de salarios justos."
    },
    {
      textEn: "28. State the central point of the Parable of the Persistent Widow (Luke 18) and explain why the judge is a CONTRAST to God, not a symbol of God.",
      textEs: "28. Declare el punto central de la Parábola de la Viuda Persistente (Lucas 18) y explique por qué el juez es un CONTRASTE de Dios, no un símbolo de Dios.",
      kw_en: ["widow", "judge", "unjust", "contrast", "persist", "pray", "God", "symbol"],
      kw_es: ["viuda", "juez", "injusto", "contraste", "persist", "orar", "Dios", "símbolo"],
      modelEn: "The central point of the Persistent Widow is that we should always pray and not lose heart. The unjust judge is a contrast to God, not a symbol of Him: if even a corrupt judge will finally answer a persistent widow, how much more will the righteous God answer His own. Reading the judge as a symbol of the Father reverses the parable's meaning.",
      modelEs: "El punto central de la Viuda Persistente es que siempre debemos orar y no desmayar. El juez injusto es un contraste de Dios, no un símbolo de Él: si hasta un juez corrupto finalmente responde a una viuda persistente, cuánto más el Dios justo responderá a los suyos. Leer al juez como símbolo del Padre invierte el significado de la parábola."
    },
    {
      textEn: "29. Explain the one exception to the rule \"parables are not allegories\" and why this exception is limited to that single case.",
      textEs: "29. Explique la única excepción a la regla «las parábolas no son alegorías» y por qué esta excepción se limita a ese único caso.",
      kw_en: ["Jesus", "explain", "detail", "authorized", "commentary", "Sower", "exception", "decide"],
      kw_es: ["Jesús", "explica", "detalle", "autorizado", "comentario", "Sembrador", "excepción", "decidir"],
      modelEn: "The one exception to 'parables are not allegories' is when Jesus Himself explains the details, as He does with the Parable of the Sower — there the seed, the birds, and the soils each get a meaning straight from His mouth. That is authorized commentary. Where Jesus does not assign a meaning, the interpreter does not get to decide one; the exception is limited to His own explanations.",
      modelEs: "La única excepción a «las parábolas no son alegorías» es cuando Jesús mismo explica los detalles, como hace con la Parábola del Sembrador — allí la semilla, las aves y los suelos reciben un significado directo de Su boca. Eso es comentario autorizado. Donde Jesús no asigna un significado, el intérprete no puede decidir uno; la excepción se limita a Sus propias explicaciones."
    },
    {
      textEn: "30. List the five practical steps the lesson recommends for preaching a parable and briefly describe each.",
      textEs: "30. Enumere los cinco pasos prácticos que la lección recomienda para predicar una parábola y describa brevemente cada uno.",
      kw_en: ["setting", "sentence", "central", "climax", "detail", "build", "test", "preach"],
      kw_es: ["entorno", "oración", "central", "clímax", "detalle", "edificar", "probar", "predicar"],
      modelEn: "Five steps guide preaching a parable: first establish its setting and the question that prompted it; second state the one central point in a single sentence; third test every detail against that point, refusing to allegorize what Jesus left as scenery; fourth build the sermon toward the parable's climax; and fifth preach that one point home. Setting, sentence, test, climax, point.",
      modelEs: "Cinco pasos guían la predicación de una parábola: primero establecer su entorno y la pregunta que la provocó; segundo declarar el único punto central en una sola oración; tercero probar cada detalle contra ese punto, negándose a alegorizar lo que Jesús dejó como escenografía; cuarto edificar el sermón hacia el clímax de la parábola; y quinto predicar ese único punto. Entorno, oración, prueba, clímax, punto."
    }
  ];
