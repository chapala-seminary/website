/* CTSHermeneutics - unit 7: per-unit configuration and content. */

const UNIT = 7;

const NEXT_UNIT_URL = "CTSHermeneuticsUnit8.html";

const PREV_UNIT_URL = "CTSHermeneuticsUnit6.html";

const IS_FINAL_UNIT = false;

const SHOW_REGISTRATION = false;

const mcQuestions = [
    {
      textEn: "1. The central thesis of this unit is that Christ's miracles are best understood as:",
      textEs: "1. La tesis central de esta unidad es que los milagros de Cristo se entienden mejor como:",
      optionsEn: ["A. Random demonstrations of supernatural power","B. Enacted parables — visible actions that preach the same kind of truth a parable preaches","C. Advertising for Jesus' growing ministry","D. Tests of the disciples' faith levels"],
      optionsEs: ["A. Demostraciones al azar de poder sobrenatural","B. Parábolas representadas — acciones visibles que predican la misma clase de verdad que predica una parábola","C. Publicidad para el ministerio creciente de Jesús","D. Pruebas de los niveles de fe de los discípulos"],
      correct: "B",
      correctFeedbackEn: "Correct. A parable speaks truth in a story; a miracle speaks the same kind of truth in an action. The miracle is the visible word, and the spoken word interprets it. Both preach the same gospel.",
      correctFeedbackEs: "Correcto. Una parábola pronuncia la verdad en una historia; un milagro pronuncia la misma clase de verdad en una acción. El milagro es la palabra visible, y la palabra pronunciada la interpreta. Ambos predican el mismo evangelio.",
      incorrectFeedbackEn: "Miracles are not random, not advertising, and not faith-tests. They are ENACTED PARABLES — visible sermons that preach the same truth Christ also spoke aloud. Visible act + spoken word = one teaching.",
      incorrectFeedbackEs: "Los milagros no son al azar, ni publicidad, ni pruebas de fe. Son PARÁBOLAS REPRESENTADAS — sermones visibles que predican la misma verdad que Cristo también pronunció en voz alta. Acto visible + palabra pronunciada = una sola enseñanza."
    },
    {
      textEn: "2. The Greek word the Apostle John prefers for Jesus' miracles is:",
      textEs: "2. La palabra griega que el apóstol Juan prefiere para los milagros de Jesús es:",
      optionsEn: ["A. Dynamis (power)","B. Teras (wonder)","C. Sêmeion (sign — something that points beyond itself)","D. Ergon (work)"],
      optionsEs: ["A. Dýnamis (poder)","B. Téras (maravilla)","C. Semeion (señal — algo que apunta más allá de sí mismo)","D. Érgon (obra)"],
      correct: "C",
      correctFeedbackEn: "Correct. John calls Jesus' miracles SEMEIA — signs. A sign is not a destination; it is a pointer. The miracle directs attention to a spiritual reality the visible act is preaching.",
      correctFeedbackEs: "Correcto. Juan llama a los milagros de Jesús SEMEIA — señales. Una señal no es un destino; es un indicador. El milagro dirige la atención a una realidad espiritual que el acto visible está predicando.",
      incorrectFeedbackEn: "Dynamis, teras, and ergon all appear in the NT for miracles, but John's preferred term is SEMEION — sign. The word itself teaches the principle: a miracle points beyond itself to a deeper spiritual truth.",
      incorrectFeedbackEs: "Dýnamis, téras, y érgon todos aparecen en el NT para los milagros, pero el término preferido de Juan es SEMEION — señal. La palabra misma enseña el principio: un milagro apunta más allá de sí mismo a una verdad espiritual más profunda."
    },
    {
      textEn: "3. The sentence Jesus speaks before raising Lazarus that interprets the entire miracle is:",
      textEs: "3. La oración que Jesús pronuncia antes de levantar a Lázaro que interpreta todo el milagro es:",
      optionsEn: ["A. \"I am the resurrection and the life\"","B. \"Be still, my son\"","C. \"Father, glorify Your name\"","D. \"It is finished\""],
      optionsEs: ["A. «Yo soy la resurrección y la vida»","B. «Quédate quieto, hijo mío»","C. «Padre, glorifica Tu nombre»","D. «Consumado es»"],
      correct: "A",
      correctFeedbackEn: "Correct (John 11:25). Jesus speaks the sentence to Martha while Lazarus is still in the tomb. Minutes later He performs what He has just declared. Word and act together preach Christ's identity.",
      correctFeedbackEs: "Correcto (Juan 11:25). Jesús pronuncia la oración a Marta mientras Lázaro está todavía en la tumba. Minutos después realiza lo que acaba de declarar. La palabra y el acto juntos predican la identidad de Cristo.",
      incorrectFeedbackEn: "The interpretive sentence at Bethany is \"I AM THE RESURRECTION AND THE LIFE\" (John 11:25). Jesus speaks it while Lazarus is still in the tomb, then performs what He has just declared. The act preaches what the word said.",
      incorrectFeedbackEs: "La oración interpretativa en Betania es «YO SOY LA RESURRECCIÓN Y LA VIDA» (Juan 11:25). Jesús la pronuncia mientras Lázaro está todavía en la tumba, luego realiza lo que acaba de declarar. El acto predica lo que la palabra dijo."
    },
    {
      textEn: "4. The four-part structure the lesson traces through the Lazarus story is:",
      textEs: "4. La estructura cuádruple que la lección traza a través de la historia de Lázaro es:",
      optionsEn: ["A. Birth, life, death, resurrection","B. Tragedy, trial, tears, triumph","C. Sickness, decay, burial, mourning","D. Galilee, Judea, Bethany, Jerusalem"],
      optionsEs: ["A. Nacimiento, vida, muerte, resurrección","B. Tragedia, prueba, lágrimas, triunfo","C. Enfermedad, descomposición, sepultura, duelo","D. Galilea, Judea, Betania, Jerusalén"],
      correct: "B",
      correctFeedbackEn: "Correct. The Tragedy (Lazarus dies), the Trial (Jesus delays on purpose), the Tears (Mary, Martha, mourners, and Jesus Himself weep), and the Triumph (Lazarus comes out). Each movement is part of one sermon Jesus is preaching with His hands and voice together.",
      correctFeedbackEs: "Correcto. La Tragedia (Lázaro muere), la Prueba (Jesús se demora a propósito), las Lágrimas (María, Marta, los plañideros, y Jesús mismo lloran), y el Triunfo (Lázaro sale). Cada movimiento es parte de un solo sermón que Jesús está predicando con Sus manos y Su voz juntas.",
      incorrectFeedbackEn: "The lesson traces FOUR T's through Lazarus: TRAGEDY, TRIAL, TEARS, TRIUMPH. Each is a movement in a single enacted-parable sermon. This four-fold structure is a useful preaching template for any miracle text.",
      incorrectFeedbackEs: "La lección traza CUATRO T's a través de Lázaro: TRAGEDIA, PRUEBA, LÁGRIMAS, TRIUNFO. Cada una es un movimiento en un solo sermón de parábola representada. Esta estructura cuádruple es una plantilla útil de predicación para cualquier texto de milagro."
    },
    {
      textEn: "5. In Mark 2, Jesus first tells the paralytic, \"Your sins are forgiven you,\" and then heals him. The lesson reads this as:",
      textEs: "5. En Marcos 2, Jesús primero le dice al paralítico: «tus pecados te son perdonados», y luego lo sana. La lección lee esto como:",
      optionsEn: ["A. A demonstration that physical healing is more important than forgiveness","B. An indication that Jesus did not know which problem to address first","C. The textbook miracle-as-enacted-parable: the visible healing preaches the invisible forgiveness","D. A coincidence that has nothing to do with the principle of enacted parables"],
      optionsEs: ["A. Una demostración de que la sanidad física es más importante que el perdón","B. Una indicación de que Jesús no sabía cuál problema atender primero","C. El milagro como parábola representada por excelencia: la sanidad visible predica el perdón invisible","D. Una coincidencia que no tiene nada que ver con el principio de las parábolas representadas"],
      correct: "C",
      correctFeedbackEn: "Correct. Jesus tells us explicitly in Mark 2:10 — \"that you may know that the Son of Man has authority on earth to forgive sins\" — He performs the visible healing so the invisible forgiveness can be seen. This is the textbook miracle-as-enacted-parable.",
      correctFeedbackEs: "Correcto. Jesús nos dice explícitamente en Marcos 2:10 — «para que sepáis que el Hijo del Hombre tiene potestad en la tierra de perdonar pecados» — realiza la sanidad visible para que el perdón invisible pueda verse. Este es el milagro como parábola representada por excelencia.",
      incorrectFeedbackEn: "Mark 2:9-11 is NOT about prioritizing healing over forgiveness, indecision, or coincidence. Jesus EXPLICITLY says He performs the visible miracle \"that you may know\" — the visible act preaches the invisible forgiveness. This is the principle in plain language.",
      incorrectFeedbackEs: "Marcos 2:9-11 NO se trata de priorizar la sanidad sobre el perdón, ni de indecisión, ni de coincidencia. Jesús EXPLÍCITAMENTE dice que realiza el milagro visible «para que sepáis» — el acto visible predica el perdón invisible. Este es el principio en lenguaje claro."
    },
    {
      textEn: "6. According to Mark 2:10, Jesus heals the paralytic specifically:",
      textEs: "6. Según Marcos 2:10, Jesús sana al paralítico específicamente:",
      optionsEn: ["A. To attract more disciples","B. Because the four friends had earned the favor","C. \"That you may know the Son of Man has authority on earth to forgive sins\"","D. To prove He was a better physician than the local healers"],
      optionsEs: ["A. Para atraer más discípulos","B. Porque los cuatro amigos se habían ganado el favor","C. «Para que sepáis que el Hijo del Hombre tiene potestad en la tierra de perdonar pecados»","D. Para probar que Él era mejor médico que los sanadores locales"],
      correct: "C",
      correctFeedbackEn: "Correct. Mark 2:10 is one of the clearest examples in the NT of a miracle interpreting itself. The healing is performed so that the watching eyes can know what only God can do — forgive sin. The visible act preaches the invisible truth.",
      correctFeedbackEs: "Correcto. Marcos 2:10 es uno de los ejemplos más claros en el NT de un milagro que se interpreta a sí mismo. La sanidad se realiza para que los ojos que observan puedan saber lo que solo Dios puede hacer — perdonar el pecado. El acto visible predica la verdad invisible.",
      incorrectFeedbackEn: "Jesus does not heal to attract followers, reward intermediaries, or rival local healers. He states His purpose plainly: \"THAT YOU MAY KNOW the Son of Man has authority on earth to forgive sins.\" The miracle preaches the forgiveness.",
      incorrectFeedbackEs: "Jesús no sana para atraer seguidores, ni para recompensar intermediarios, ni para rivalizar con sanadores locales. Declara Su propósito claramente: «PARA QUE SEPÁIS que el Hijo del Hombre tiene potestad en la tierra de perdonar pecados». El milagro predica el perdón."
    },
    {
      textEn: "7. The lesson gives four questions a pastor should ask when preparing to preach a miracle. The first question is:",
      textEs: "7. La lección da cuatro preguntas que un pastor debe hacer al prepararse para predicar un milagro. La primera pregunta es:",
      optionsEn: ["A. How can I scientifically explain what Jesus did?","B. Which Greek manuscript should I prefer?","C. What physical action does Jesus perform?","D. How long was the miracle remembered?"],
      optionsEs: ["A. ¿Cómo puedo explicar científicamente lo que hizo Jesús?","B. ¿Qué manuscrito griego debo preferir?","C. ¿Qué acción física realiza Jesús?","D. ¿Cuánto tiempo se recordó el milagro?"],
      correct: "C",
      correctFeedbackEn: "Correct. Begin with the visible event. State it plainly: a man healed, a storm stilled, water turned to wine. The visible act is the canvas. Without naming the act, the rest of the sermon has nothing to rest on.",
      correctFeedbackEs: "Correcto. Comience con el evento visible. Declarelo claramente: un hombre sanado, una tormenta calmada, el agua convertida en vino. El acto visible es el lienzo. Sin nombrar el acto, el resto del sermón no tiene sobre qué descansar.",
      incorrectFeedbackEn: "Scientific explanation, manuscript variants, and historical reception are downstream. The FIRST question is the simplest: what did Jesus visibly DO? Start with the visible act, then move to the spoken word, then to the truth, then to the application.",
      incorrectFeedbackEs: "La explicación científica, las variantes de manuscritos, y la recepción histórica vienen río abajo. La PRIMERA pregunta es la más sencilla: &iquest;qué hizo Jesús visiblemente? Comience con el acto visible, luego pase a la palabra pronunciada, luego a la verdad, luego a la aplicación."
    },
    {
      textEn: "8. The second question the pastor should ask when preaching a miracle is:",
      textEs: "8. La segunda pregunta que el pastor debe hacer al predicar un milagro es:",
      optionsEn: ["A. What spoken word of Jesus interprets the miracle?","B. How can I make the miracle relatable to modern science?","C. What political event was happening that week?","D. What time of day did the miracle occur?"],
      optionsEs: ["A. ¿Qué palabra pronunciada de Jesús interpreta el milagro?","B. ¿Cómo puedo hacer el milagro relacionable con la ciencia moderna?","C. ¿Qué evento político estaba sucediendo esa semana?","D. ¿A qué hora del día ocurrió el milagro?"],
      correct: "A",
      correctFeedbackEn: "Correct. The spoken word is the key to the miracle. \"I am the resurrection.\" \"I am the bread of life.\" \"Your sins are forgiven.\" Find the sentence Jesus spoke alongside the miracle, and you have found the authorized interpretation of the act.",
      correctFeedbackEs: "Correcto. La palabra pronunciada es la llave del milagro. «Yo soy la resurrección». «Yo soy el pan de vida». «Tus pecados te son perdonados». Encuentre la oración que Jesús pronunció junto al milagro, y habrá encontrado la interpretación autorizada del acto.",
      incorrectFeedbackEn: "Science, politics, and time-of-day are scenery. The second question — and the most important interpretive question — is what JESUS SAID alongside the act. His spoken word interprets His own miracle.",
      incorrectFeedbackEs: "La ciencia, la política, y la hora del día son escenografía. La segunda pregunta — y la pregunta interpretativa más importante — es lo que JESÚS DIJO junto al acto. Su palabra pronunciada interpreta Su propio milagro."
    },
    {
      textEn: "9. The Maurice Rawlings story (the cardiologist in Chattanooga whose patient had three heart attacks during one test) illustrates:",
      textEs: "9. La historia de Maurice Rawlings (el cardiólogo en Chattanooga cuyo paciente tuvo tres ataques al corazón durante una sola prueba) ilustra:",
      optionsEn: ["A. The danger of treadmill stress tests","B. The need for better hospital protocols","C. The skill of Tennessee cardiologists","D. A modern enacted parable — physical revival used to bring about spiritual rescue"],
      optionsEs: ["A. El peligro de las pruebas de esfuerzo en caminadora","B. La necesidad de mejores protocolos hospitalarios","C. La habilidad de los cardiólogos de Tennessee","D. Una parábola representada moderna — la reanimación física usada para producir el rescate espiritual"],
      correct: "D",
      correctFeedbackEn: "Correct. The patient came back from physical death three times so that he could be saved from spiritual death once. The body was the canvas; the soul was the painting. That is the same logic as Jesus' miracles — the visible event preaches the invisible truth.",
      correctFeedbackEs: "Correcto. El paciente regresó de la muerte física tres veces para que pudiera ser salvado de la muerte espiritual una sola vez. El cuerpo era el lienzo; el alma era el cuadro. Esa es la misma lógica de los milagros de Jesús — el evento visible predica la verdad invisible.",
      incorrectFeedbackEn: "The Rawlings story is not medical commentary. It is a modern enacted parable: the patient's physical revivals were the visible act, and the urgent question \"Do you believe?\" was the spoken word that turned the physical rescue into a spiritual one.",
      incorrectFeedbackEs: "La historia de Rawlings no es un comentario médico. Es una parábola representada moderna: las reanimaciones físicas del paciente fueron el acto visible, y la pregunta urgente «&iquest;crees?» fue la palabra pronunciada que convirtió el rescate físico en uno espiritual."
    },
    {
      textEn: "10. The lesson identifies three common errors pastors make when preaching miracles. The first error is:",
      textEs: "10. La lección identifica tres errores comunes que los pastores cometen al predicar los milagros. El primer error es:",
      optionsEn: ["A. The naturalistic error — explaining the miracle away (e.g. five thousand were really just sharing hidden lunches)","B. Preaching the miracle on Sunday","C. Reading the text in Greek","D. Showing the congregation a map"],
      optionsEs: ["A. El error naturalista — explicar el milagro (p.ej. los cinco mil realmente solo estaban compartiendo loncheras ocultas)","B. Predicar el milagro el domingo","C. Leer el texto en griego","D. Mostrarle a la congregación un mapa"],
      correct: "A",
      correctFeedbackEn: "Correct. The modernist's habit is to explain miracles away — the feeding becomes sharing, the storm becomes a calm patch, the walking on water becomes a sandbar. The pastor who explains miracles away has nothing left to preach. Let the miracle stand.",
      correctFeedbackEs: "Correcto. El hábito del modernista es explicar los milagros — la alimentación se vuelve compartir, la tormenta se vuelve un parche calmo, el caminar sobre el agua se vuelve un banco de arena. El pastor que explica los milagros no tiene nada que predicar. Deje que el milagro permanezca.",
      incorrectFeedbackEn: "Sunday preaching, Greek study, and visual aids are all legitimate. The first ERROR named in the lesson is the NATURALISTIC error — explaining the miracle away as something ordinary that has been misunderstood. This drains the miracle of its preaching power.",
      incorrectFeedbackEs: "Predicar el domingo, estudiar griego, y usar ayudas visuales son todos legítimos. El primer ERROR nombrado en la lección es el error NATURALISTA — explicar el milagro como algo ordinario que ha sido malentendido. Esto drena al milagro de su poder de predicación."
    },
    {
      textEn: "11. The second common error this lesson warns against is:",
      textEs: "11. El segundo error común contra el cual esta lección advierte es:",
      optionsEn: ["A. The spectacle error — stopping at \"look how powerful Jesus is\" and never letting the miracle become a sermon","B. The geographic error","C. The chronological error","D. The translation error"],
      optionsEs: ["A. El error del espectáculo — detenerse en «miren qué poderoso es Jesús» y nunca dejar que el milagro se vuelva sermón","B. El error geográfico","C. El error cronológico","D. El error de traducción"],
      correct: "A",
      correctFeedbackEn: "Correct. Preaching a miracle as a thrill leaves the congregation impressed but unchanged. The miracle was meant to PREACH a truth — resurrection, bread of life, forgiveness. Stop at the spectacle and you starve your people of the message.",
      correctFeedbackEs: "Correcto. Predicar un milagro como una emoción deja a la congregación impresionada pero sin cambiar. El milagro fue diseñado para PREDICAR una verdad — la resurrección, el pan de vida, el perdón. Deténgase en el espectáculo y matará de hambre a su pueblo privándolo del mensaje.",
      incorrectFeedbackEn: "Geographic, chronological, and translation errors do occur but are not the second error named here. The SPECTACLE error is preaching the miracle as a thrill while never letting it become the sermon Jesus meant it to be.",
      incorrectFeedbackEs: "Los errores geográficos, cronológicos, y de traducción sí ocurren pero no son el segundo error nombrado aquí. El error del ESPECTÁCULO es predicar el milagro como una emoción mientras nunca se le deja convertirse en el sermón que Jesús pretendió que fuera."
    },
    {
      textEn: "12. The third common error this lesson warns against is:",
      textEs: "12. El tercer error común contra el cual esta lección advierte es:",
      optionsEn: ["A. Using a study Bible","B. The allegorical error — inventing symbolic meanings for every detail (e.g. five loaves = five books of Moses)","C. Preaching too quietly","D. Skipping the introduction"],
      optionsEs: ["A. Usar una Biblia de estudio","B. El error alegórico — inventar significados simbólicos para cada detalle (p.ej. cinco panes = cinco libros de Moisés)","C. Predicar demasiado bajo","D. Saltarse la introducción"],
      correct: "B",
      correctFeedbackEn: "Correct. Unit 6 warned us against this in parables, and the same warning applies to miracles. We do not get to invent symbols. Stay with the central word Jesus spoke alongside the miracle — that word is the authorized interpretation.",
      correctFeedbackEs: "Correcto. La Unidad 6 nos advirtió contra esto en las parábolas, y la misma advertencia se aplica a los milagros. No podemos inventar símbolos. Quédese con la palabra central que Jesús pronunció junto al milagro — esa palabra es la interpretación autorizada.",
      incorrectFeedbackEn: "Study Bibles, vocal volume, and sermon structure are not the errors. The ALLEGORICAL error is the temptation to assign symbolic meaning to every detail — the five loaves, the twelve baskets, the jars at Cana. Stay with the spoken word; resist the invention.",
      incorrectFeedbackEs: "Las Biblias de estudio, el volumen vocal, y la estructura del sermón no son los errores. El error ALEGÓRICO es la tentación de asignar significado simbólico a cada detalle — los cinco panes, los doce canastos, las tinajas de Caná. Quédese con la palabra pronunciada; resista la invención."
    },
    {
      textEn: "13. The lesson uses the \"falling asleep on the couch\" illustration to teach:",
      textEs: "13. La lección usa la ilustración de «quedarse dormido en el sofá» para enseñar:",
      optionsEn: ["A. Children should not stay up late","B. Couches are better than beds for sleeping","C. Death for a Christian is the Father picking us up and carrying us to the right place — the same truth the Lazarus miracle preaches","D. Parents should not carry tired children"],
      optionsEs: ["A. Los niños no deben quedarse despiertos hasta tarde","B. Los sofás son mejores que las camas para dormir","C. La muerte para un cristiano es el Padre recogiéndonos y llevándonos al lugar correcto — la misma verdad que predica el milagro de Lázaro","D. Los padres no deben cargar a los niños cansados"],
      correct: "C",
      correctFeedbackEn: "Correct. The mother's words to her son speak the same truth Jesus enacted at Bethany. The Father, in His Son, picks up the dead and carries them into the right place. That is the resurrection preached in language a child can carry.",
      correctFeedbackEs: "Correcto. Las palabras de la madre a su hijo pronuncian la misma verdad que Jesús representó en Betania. El Padre, en Su Hijo, recoge a los muertos y los lleva al lugar correcto. Esa es la resurrección predicada en un lenguaje que un niño puede cargar.",
      incorrectFeedbackEn: "The illustration is not about bedtime, furniture, or carrying. It is a tender reframing of the Christian death: the Father picks up the sleeping child and carries them to the right place — the same truth the Lazarus miracle preached aloud at Bethany.",
      incorrectFeedbackEs: "La ilustración no se trata de la hora de dormir, de muebles, ni de cargar. Es un replanteo tierno de la muerte cristiana: el Padre recoge al niño dormido y lo lleva al lugar correcto — la misma verdad que predicó el milagro de Lázaro en voz alta en Betania."
    },
    {
      textEn: "14. According to the lesson, the verse \"Jesus wept\" (John 11:35) teaches:",
      textEs: "14. Según la lección, el versículo «Jesús lloró» (Juan 11:35) enseña:",
      optionsEn: ["A. Jesus was overcome with His own grief and unable to act","B. Tears are a sign of spiritual weakness","C. Jesus did not yet know how the story would end","D. The Lord did not pretend death was nothing — He wept at it"],
      optionsEs: ["A. Jesús estaba abrumado por Su propio dolor e incapaz de actuar","B. Las lágrimas son señal de debilidad espiritual","C. Jesús aún no sabía cómo terminaría la historia","D. El Señor no fingió que la muerte no era nada — lloró por ella"],
      correct: "D",
      correctFeedbackEn: "Correct. Death is a tragedy in the Bible — Jesus did not deny it. He wept at the tomb before He raised the dead. The shortest verse in the Bible is also one of the fullest: it teaches the pastor that grief is honored even when victory is coming.",
      correctFeedbackEs: "Correcto. La muerte es una tragedia en la Biblia — Jesús no la negó. Lloró ante la tumba antes de levantar al muerto. El versículo más corto de la Biblia es también uno de los más plenos: enseña al pastor que el duelo es honrado aun cuando la victoria está por venir.",
      incorrectFeedbackEn: "Jesus' tears were neither helplessness, weakness, nor ignorance. They were the Lord HONORING the tragedy of death before He overcame it. A pastor who reads this story rightly learns that grief is welcomed at the graveside, even where resurrection is coming.",
      incorrectFeedbackEs: "Las lágrimas de Jesús no fueron ni impotencia, ni debilidad, ni ignorancia. Fueron el Señor HONRANDO la tragedia de la muerte antes de superarla. Un pastor que lee correctamente esta historia aprende que el duelo es bienvenido junto a la tumba, aun donde la resurrección está por venir."
    },
    {
      textEn: "15. The lesson says the pastor's role at the end of the Lazarus story is pictured by Jesus' command:",
      textEs: "15. La lección dice que el papel del pastor al final de la historia de Lázaro está representado por el mandato de Jesús:",
      optionsEn: ["A. \"Lazarus, come out\"","B. \"Take away the stone\"","C. \"Father, glorify Your name\"","D. \"Loose him, and let him go\""],
      optionsEs: ["A. «Lázaro, ven fuera»","B. «Quitad la piedra»","C. «Padre, glorifica Tu nombre»","D. «Desatadlo, y dejadle ir»"],
      correct: "D",
      correctFeedbackEn: "Correct. The miracle was Christ's. The unbinding was His people's. \"Loose him, and let him go\" is the picture of pastoral ministry: the Lord raises the dead; the pastor unwraps the graveclothes. Christ raises; the pastor releases.",
      correctFeedbackEs: "Correcto. El milagro fue de Cristo. El desatar fue de Su pueblo. «Desatadlo, y dejadle ir» es el cuadro del ministerio pastoral: el Señor levanta al muerto; el pastor desenvuelve los lienzos sepulcrales. Cristo levanta; el pastor libera.",
      incorrectFeedbackEn: "\"Lazarus, come out,\" \"Take away the stone,\" and \"Father, glorify Your name\" are Christ's words and actions. The pastor's modeled role is the LAST command — LOOSE HIM, AND LET HIM GO. The Lord does the raising; the pastor does the releasing.",
      incorrectFeedbackEs: "«Lázaro, ven fuera», «quitad la piedra», y «Padre, glorifica Tu nombre» son palabras y acciones de Cristo. El papel modelado del pastor es el ÚLTIMO mandato — DESATADLO, Y DEJADLE IR. El Señor hace el levantar; el pastor hace el liberar."
    },
    {
      textEn: "16. The lesson says feeding the five thousand was not really about the bread because:",
      textEs: "16. La lección dice que la alimentación de los cinco mil no era realmente acerca del pan porque:",
      optionsEn: ["A. The next day Jesus declared aloud \"I am the bread of life\" — the bread was the enacted parable of that spoken word","B. The bread was not very tasty","C. The crowd did not actually eat","D. There were not really five thousand people"],
      optionsEs: ["A. Al día siguiente Jesús declaró en voz alta «Yo soy el pan de vida» — el pan era la parábola representada de esa palabra pronunciada","B. El pan no era muy sabroso","C. La multitud realmente no comió","D. Realmente no había cinco mil personas"],
      correct: "A",
      correctFeedbackEn: "Correct. The miracle preached the next day's sermon in advance. The fish, the bread, the leftovers were not the point. Jesus is the bread. The miracle was the visible word; \"I am the bread of life\" was the spoken word that interpreted it.",
      correctFeedbackEs: "Correcto. El milagro predicó de antemano el sermón del día siguiente. Los peces, el pan, las sobras no eran el punto. Jesús es el pan. El milagro fue la palabra visible; «Yo soy el pan de vida» fue la palabra pronunciada que lo interpretó.",
      incorrectFeedbackEn: "The feeding was a real miracle with real food and a real crowd. But the POINT was not the bread itself. The point was the SPOKEN WORD that came alongside the miracle: \"I am the bread of life\" (John 6). The visible word and the spoken word together preach Christ.",
      incorrectFeedbackEs: "La alimentación fue un milagro real con comida real y una multitud real. Pero el PUNTO no era el pan mismo. El punto era la PALABRA PRONUNCIADA que vino junto al milagro: «Yo soy el pan de vida» (Juan 6). La palabra visible y la palabra pronunciada juntas predican a Cristo."
    },
    {
      textEn: "17. The lesson teaches that the pastor's sermon method on a miracle text should:",
      textEs: "17. La lección enseña que el método sermónico del pastor sobre un texto de milagro debe:",
      optionsEn: ["A. Open with theology, then move to the text","B. Open with the visible event, move to the spoken word, then to the truth, then to the application","C. Open with personal experience, then defend the miracle scientifically","D. Open with the application and never return to the text"],
      optionsEs: ["A. Comenzar con la teología, luego pasar al texto","B. Comenzar con el evento visible, pasar a la palabra pronunciada, luego a la verdad, luego a la aplicación","C. Comenzar con la experiencia personal, luego defender el milagro científicamente","D. Comenzar con la aplicación y nunca regresar al texto"],
      correct: "B",
      correctFeedbackEn: "Correct. The four-step pattern mirrors how Jesus Himself preached the miracle. Show what He did. Quote what He said. Connect the two as a single truth. Then carry that truth into the room where your people sit. The pattern protects you from the three errors.",
      correctFeedbackEs: "Correcto. El patrón cuádruple refleja cómo Jesús mismo predicó el milagro. Muestre lo que hizo. Cite lo que dijo. Conecte los dos como una sola verdad. Luego lleve esa verdad al cuarto donde se sienta su pueblo. El patrón le protege de los tres errores.",
      incorrectFeedbackEn: "Opening with theology, science, or application all bypass what Jesus did. The lesson's pattern is sequential: VISIBLE ACT, SPOKEN WORD, TRUTH, APPLICATION. Follow this order and your sermon will preach the miracle the way Christ Himself meant it to preach.",
      incorrectFeedbackEs: "Comenzar con la teología, la ciencia, o la aplicación pasa por alto lo que Jesús hizo. El patrón de la lección es secuencial: ACTO VISIBLE, PALABRA PRONUNCIADA, VERDAD, APLICACIÓN. Siga este orden y su sermón predicará el milagro de la manera en que Cristo mismo quiso que predicara."
    },
    {
      textEn: "18. The lesson teaches that Jesus' delay in coming to Lazarus (staying two more days after hearing of the sickness) was:",
      textEs: "18. La lección enseña que la demora de Jesús al venir a Lázaro (quedándose dos días más después de oír de la enfermedad) fue:",
      optionsEn: ["A. A failure of pastoral responsiveness","B. The canvas on which the miracle would be painted — the delay was part of how God prepared His people to see His glory","C. Evidence that He did not really love the family","D. A scheduling conflict with another teaching engagement"],
      optionsEs: ["A. Una falla de respuesta pastoral","B. El lienzo sobre el cual se pintaría el milagro — la demora fue parte de cómo Dios preparó a Su pueblo para ver Su gloria","C. Evidencia de que realmente no amaba a la familia","D. Un conflicto de horario con otro compromiso de enseñanza"],
      correct: "B",
      correctFeedbackEn: "Correct. The miracle would not have been a miracle if Jesus had arrived in time to prevent the death. The delay was the canvas. God's timing is not our timing, and delay is often how He prepares His people to see His glory.",
      correctFeedbackEs: "Correcto. El milagro no habría sido un milagro si Jesús hubiera llegado a tiempo para prevenir la muerte. La demora fue el lienzo. El tiempo de Dios no es nuestro tiempo, y la demora es a menudo cómo Él prepara a Su pueblo para ver Su gloria.",
      incorrectFeedbackEn: "Jesus did not fail, did not lack love, and did not have a scheduling conflict. The text says He stayed two more days deliberately. The DELAY was the canvas — without it, there would have been no resurrection miracle to preach.",
      incorrectFeedbackEs: "Jesús no falló, ni le faltó amor, ni tuvo conflicto de horario. El texto dice que se quedó dos días más deliberadamente. La DEMORA fue el lienzo — sin ella, no habría habido milagro de resurrección que predicar."
    },
    {
      textEn: "19. The lesson's warning against the naturalistic error specifically rejects which kind of interpretation?",
      textEs: "19. La advertencia de la lección contra el error naturalista rechaza específicamente cuál clase de interpretación:",
      optionsEn: ["A. Reading the miracle as the visible act it actually was","B. Believing the spoken word that interprets the act","C. Applying the truth pastorally","D. \"The crowd really just shared their hidden lunches\" — or similar attempts to explain miracles away as ordinary events"],
      optionsEs: ["A. Leer el milagro como el acto visible que realmente fue","B. Creer la palabra pronunciada que interpreta el acto","C. Aplicar la verdad pastoralmente","D. «La multitud realmente solo compartió sus loncheras ocultas» — u otros intentos similares de explicar los milagros como eventos ordinarios"],
      correct: "D",
      correctFeedbackEn: "Correct. The naturalistic reading drains the miracle of its preaching power. The pastor who explains miracles away has nothing left to preach. Let the miracle stand as the text describes it; THEN preach what it preaches.",
      correctFeedbackEs: "Correcto. La lectura naturalista drena al milagro de su poder de predicación. El pastor que explica los milagros no tiene nada que predicar. Deje que el milagro permanezca como el texto lo describe; LUEGO prediquelo.",
      incorrectFeedbackEn: "Reading the miracle as the visible act, believing the spoken word, and applying the truth pastorally are all the lesson's recommendations. The naturalistic ERROR rejects ONLY the explaining-away — the modernist habit of turning miracles into ordinary events misinterpreted.",
      incorrectFeedbackEs: "Leer el milagro como el acto visible, creer la palabra pronunciada, y aplicar la verdad pastoralmente son todas recomendaciones de la lección. El ERROR naturalista rechaza SOLO el explicar — el hábito modernista de convertir los milagros en eventos ordinarios mal interpretados."
    },
    {
      textEn: "20. The closing charge of this unit to the pastor is:",
      textEs: "20. El encargo de cierre de esta unidad al pastor es:",
      optionsEn: ["A. Avoid miracles in preaching","B. Preach miracles only at Easter","C. Memorize each miracle in Greek","D. Preach the visible event as the visible sermon, the spoken word as its interpretation, and then say to your people, \"Loose them, and let them go\""],
      optionsEs: ["A. Evite los milagros en la predicación","B. Predique los milagros solo en Pascua","C. Memorice cada milagro en griego","D. Predique el evento visible como el sermón visible, la palabra pronunciada como su interpretación, y luego dígale a su pueblo: «desatadlos, y dejadlos ir»"],
      correct: "D",
      correctFeedbackEn: "Correct. The pastor's role is the unbinding — releasing the people Christ has raised from their own graveclothes of sin, fear, and grief. The Lord does the raising; the pastor does the releasing. That is the closing image of the unit.",
      correctFeedbackEs: "Correcto. El papel del pastor es el desatar — liberar a la gente que Cristo ha levantado de sus propios lienzos sepulcrales de pecado, temor, y duelo. El Señor hace el levantar; el pastor hace el liberar. Esa es la imagen de cierre de la unidad.",
      incorrectFeedbackEn: "Avoiding, restricting, or memorizing-only-in-Greek all miss the heart of the unit. The closing charge is pastoral and active: preach what Jesus did and what Jesus said, then turn to your people and SET THEM FREE — \"Loose them, and let them go.\"",
      incorrectFeedbackEs: "Evitar, restringir, o memorizar solo en griego pierden el corazón de la unidad. El encargo de cierre es pastoral y activo: predique lo que Jesús hizo y lo que Jesús dijo, luego vuélvase a su pueblo y LIBÉRELO — «desatadlos, y dejadlos ir»."
    }
  ];

const kwQuestions = [
    {
      textEn: "21. Tell the story of Lazarus (John 11) in your own words and explain why the lesson calls this miracle an \"enacted parable.\"",
      textEs: "21. Cuente la historia de Lázaro (Juan 11) con sus propias palabras y explique por qué la lección llama a este milagro una «parábola representada».",
      kw_en: ["Lazarus", "Bethany", "tomb", "resurrection", "life", "Jesus", "enacted", "raise"],
      kw_es: ["Lázaro", "Betania", "tumba", "resurrección", "vida", "Jesús", "representada", "resucit"],
      modelEn: "At Bethany, four days after Lazarus was buried, Jesus stood before the sealed tomb, wept, and called him out — having declared, 'I am the resurrection and the life.' The word and the act are one teaching: the miracle is not separate from the sermon. The raising of Lazarus is an enacted parable preaching that Jesus is the resurrection and the life.",
      modelEs: "En Betania, cuatro días después de sepultar a Lázaro, Jesús se paró ante la tumba sellada, lloró y lo llamó afuera — habiendo declarado: «Yo soy la resurrección y la vida.» La palabra y el acto son una sola enseñanza: el milagro no está separado del sermón. La resurrección de Lázaro es una parábola representada que predica que Jesús es la resurrección y la vida."
    },
    {
      textEn: "22. Define the Greek word sêmeion and explain why John's choice of this term for Jesus' miracles teaches the central principle of this unit.",
      textEs: "22. Defina la palabra griega semeion y explique por qué la elección de John de este término para los milagros de Jesús enseña el principio central de esta unidad.",
      kw_en: ["sêmeion", "sign", "points", "beyond", "miracle", "truth", "John", "Greek"],
      kw_es: ["sêmeion", "señal", "apunta", "invisible", "milagro", "verdad", "Juan", "griego"],
      modelEn: "John chose the Greek word sêmeion, meaning 'sign,' for Jesus' miracles rather than a word for raw wonder. A sign is not the destination; it points beyond itself to a truth. By calling the miracles signs, John teaches the central principle of the unit: every miracle points beyond the visible event to an invisible truth about Christ.",
      modelEs: "Juan escogió la palabra griega sêmeion, que significa «señal», para los milagros de Jesús en lugar de una palabra de mero prodigio. Una señal no es el destino; apunta más allá de sí misma a una verdad. Al llamar señales a los milagros, Juan enseña el principio central de la unidad: cada milagro apunta más allá del evento visible a una verdad invisible acerca de Cristo."
    },
    {
      textEn: "23. Trace the four-T structure of the Lazarus story (Tragedy, Trial, Tears, Triumph) and explain what each movement contributes to the enacted parable.",
      textEs: "23. Trace la estructura cuádruple de la historia de Lázaro (Tragedia, Prueba, Lágrimas, Triunfo) y explique qué contribuye cada movimiento a la parábola representada.",
      kw_en: ["tragedy", "trial", "tears", "triumph", "death", "delay", "glory", "Lazarus"],
      kw_es: ["tragedia", "prueba", "lágrimas", "triunfo", "muerte", "demora", "gloria", "Lázaro"],
      modelEn: "The Lazarus story moves through four movements. Tragedy: Lazarus sickens and dies. Trial: Jesus delays on purpose, and the sisters wait in grief. Tears: Jesus weeps at the tomb. Triumph: He calls Lazarus out alive. Each movement is part of one sermon, turning death and delay into the glory of God.",
      modelEs: "La historia de Lázaro avanza por cuatro movimientos. Tragedia: Lázaro enferma y muere. Prueba: Jesús se demora a propósito, y las hermanas esperan en el dolor. Lágrimas: Jesús llora ante la tumba. Triunfo: lo llama afuera con vida. Cada movimiento es parte de un solo sermón, que convierte la muerte y la demora en la gloria de Dios."
    },
    {
      textEn: "24. Explain how Mark 2:9-11 (the paralytic at Capernaum) is the clearest textbook example of a miracle being performed to preach an invisible truth.",
      textEs: "24. Explique cómo Marcos 2:9-11 (el paralítico en Capernaum) es el ejemplo de libro de texto más claro de un milagro realizado para predicar una verdad invisible.",
      kw_en: ["Mark", "paralytic", "forgiven", "authority", "Son", "visible", "heal", "invisible"],
      kw_es: ["Marcos", "paralítico", "perdonados", "autoridad", "Hijo", "visible", "sanar", "invisible"],
      modelEn: "In Mark 2, when four friends lowered a paralytic to Jesus, He first said, 'Your sins are forgiven.' Then, 'that you may know the Son of Man has authority on earth to forgive sins,' He healed the man. The visible healing was performed to preach the invisible truth that Jesus has authority to forgive. It is the clearest textbook case of a miracle enacting a sermon.",
      modelEs: "En Marcos 2, cuando cuatro amigos bajaron a un paralítico ante Jesús, Él primero dijo: «Tus pecados te son perdonados.» Luego, «para que sepáis que el Hijo del Hombre tiene autoridad en la tierra para perdonar pecados», sanó al hombre. La sanidad visible se hizo para predicar la verdad invisible: que Jesús tiene autoridad para perdonar. Es el caso más claro de un milagro que representa un sermón."
    },
    {
      textEn: "25. List the four questions the lesson recommends a pastor ask before preaching any miracle text, and briefly explain each.",
      textEs: "25. Enumere las cuatro preguntas que la lección recomienda que un pastor haga antes de predicar cualquier texto de milagro, y explique brevemente cada una.",
      kw_en: ["action", "word", "truth", "application", "visible", "spoken", "need", "invisible"],
      kw_es: ["acción", "palabra", "verdad", "aplicación", "visible", "hablada", "necesidad", "invisible"],
      modelEn: "Before preaching any miracle text the pastor asks four questions: What is the visible action Jesus performed? What is the spoken word that interprets it? What invisible truth does the sign preach? And what is the application — the need in my people that this truth meets? The questions move from the visible act to the truth to the listener's need.",
      modelEs: "Antes de predicar cualquier texto de milagro el pastor hace cuatro preguntas: ¿Cuál es la acción visible que Jesús realizó? ¿Cuál es la palabra hablada que la interpreta? ¿Qué verdad invisible predica la señal? Y ¿cuál es la aplicación — la necesidad de mi pueblo que esa verdad satisface? Las preguntas van del acto visible a la verdad y a la necesidad del oyente."
    },
    {
      textEn: "26. Tell the Maurice Rawlings story (the Chattanooga cardiologist and the patient with three heart attacks) and explain how it functions as a modern enacted parable.",
      textEs: "26. Cuente la historia de Maurice Rawlings (el cardiólogo de Chattanooga y el paciente con tres ataques al corazón) y explique cómo funciona como una parábola representada moderna.",
      kw_en: ["Rawlings", "Chattanooga", "cardiologist", "patient", "heart", "saved", "parable", "death"],
      kw_es: ["Rawlings", "Chattanooga", "cardiólogo", "paciente", "infarto", "salvado", "parábola", "muerte"],
      modelEn: "Dr. Maurice Rawlings, a Chattanooga cardiologist, was a nominal Christian when a patient had repeated heart attacks during a stress test, screaming in terror between revivals. Rawlings led him to Christ with a verse from Sunday School. The man came back from physical death so he could be saved from spiritual death once — an enacted parable, the body the canvas and the soul the painting.",
      modelEs: "El Dr. Maurice Rawlings, un cardiólogo de Chattanooga, era cristiano nominal cuando un paciente sufrió varios infartos durante una prueba de esfuerzo, gritando de terror entre las reanimaciones. Rawlings lo guió a Cristo con un versículo de la Escuela Dominical. El hombre volvió de la muerte física para ser salvado una vez de la muerte espiritual — una parábola representada, el cuerpo el lienzo y el alma la pintura."
    },
    {
      textEn: "27. Name and briefly describe the three common errors pastors make when preaching miracle texts.",
      textEs: "27. Nombre y describa brevemente los tres errores comunes que los pastores cometen al predicar textos de milagros.",
      kw_en: ["naturalistic", "spectacle", "allegorical", "explain", "thrill", "invent", "detail", "error"],
      kw_es: ["naturalista", "espectáculo", "alegórico", "explicar", "emoción", "inventar", "detalle", "error"],
      modelEn: "Three errors plague the preaching of miracle texts. The naturalistic error explains the miracle away as something ordinary. The spectacle error stops at the thrill of the wonder without the truth it preaches. The allegorical error invents a meaning for every detail Jesus left alone. Each error keeps the sign from pointing where Jesus aimed it.",
      modelEs: "Tres errores plagan la predicación de los textos de milagros. El error naturalista explica el milagro como algo ordinario. El error del espectáculo se detiene en la emoción del prodigio sin la verdad que predica. El error alegórico inventa un significado para cada detalle que Jesús dejó en paz. Cada error impide que la señal apunte adonde Jesús la dirigió."
    },
    {
      textEn: "28. Explain why the lesson rejects the naturalistic explanation of miracles (e.g. \"the crowd really just shared their hidden lunches\"), and what is lost when a pastor adopts that reading.",
      textEs: "28. Explique por qué la lección rechaza la explicación naturalista de los milagros (p.ej. «la multitud realmente solo compartió sus loncheras ocultas»), y lo que se pierde cuando un pastor adopta esa lectura.",
      kw_en: ["naturalistic", "explain", "modernist", "miracle", "preach", "nothing", "power", "lost"],
      kw_es: ["naturalista", "explicar", "modernista", "milagro", "predicar", "nada", "poder", "pierde"],
      modelEn: "The lesson rejects the naturalistic reading — that the feeding of the five thousand was really just the crowd sharing hidden lunches. To explain the miracle away is the modernist move, and it leaves nothing to preach: a Christ who only inspired sharing has no power to save. When the miracle is explained away, the gospel power in it is lost.",
      modelEs: "La lección rechaza la lectura naturalista — que la alimentación de los cinco mil fue en realidad solo la multitud compartiendo almuerzos escondidos. Explicar el milagro como algo natural es la movida modernista, y no deja nada que predicar: un Cristo que solo inspiró a compartir no tiene poder para salvar. Cuando se explica el milagro, se pierde el poder del evangelio que hay en él."
    },
    {
      textEn: "29. Tell the \"falling asleep on the couch\" illustration and explain how it connects to the resurrection of Lazarus.",
      textEs: "29. Cuente la ilustración de «quedarse dormido en el sofá» y explique cómo se conecta con la resurrección de Lázaro.",
      kw_en: ["asleep", "couch", "father", "carries", "bed", "death", "sleep", "Lazarus"],
      kw_es: ["dormido", "sofá", "padre", "lleva", "cama", "muerte", "sueño", "Lázaro"],
      modelEn: "A child who falls asleep on the couch is carried by his father to his own bed and wakes there in the morning. That is a picture of death for the Christian: we fall asleep here and the Father carries us, waking in His house. It connects to Lazarus, of whom Jesus said, 'Our friend sleeps' — for the believer death is only a sleep from which Christ raises us.",
      modelEs: "Un niño que se queda dormido en el sofá es llevado por su padre a su propia cama y despierta allí por la mañana. Esa es una imagen de la muerte para el cristiano: nos dormimos aquí y el Padre nos lleva, despertando en Su casa. Se conecta con Lázaro, de quien Jesús dijo: «Nuestro amigo duerme» — para el creyente la muerte es solo un sueño del cual Cristo nos levanta."
    },
    {
      textEn: "30. Explain the closing image of the unit: Jesus' command \"Loose him, and let him go\" as a picture of pastoral ministry.",
      textEs: "30. Explique la imagen de cierre de la unidad: el mandato de Jesús «desatadlo, y dejadle ir» como un cuadro del ministerio pastoral.",
      kw_en: ["loose", "graveclothes", "Christ", "raise", "pastor", "release", "free", "life"],
      kw_es: ["suelt", "vendas", "Cristo", "resucit", "pastor", "liber", "vida", "muerte"],
      modelEn: "After raising Lazarus, Jesus told the bystanders, 'Loose him, and let him go.' Christ raises the dead to life; then He hands the work of unbinding the graveclothes to others. That is a picture of pastoral ministry: Christ gives new life, and the pastor's task is to loose and release those He has raised, freeing them from what still binds them.",
      modelEs: "Después de resucitar a Lázaro, Jesús dijo a los presentes: «Desatadlo y dejadlo ir.» Cristo resucita a los muertos a la vida; luego entrega la obra de soltar las vendas a otros. Esa es una imagen del ministerio pastoral: Cristo da nueva vida, y la tarea del pastor es soltar y liberar a los que Él ha resucitado de la muerte, librándolos de lo que aún los ata."
    }
  ];
