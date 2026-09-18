/* CTSBible - unit 7: per-unit configuration and content. */

const UNIT = 7;

const COURSE_PREFIX = 'cts_bible_u7_';

const mcQuestions = [
  { textEn:`The third witness of the course is:`, textEs:`El tercer testigo del curso es:`,
    optionsEn:[`The canon`,`The text`,`Archaeology`,`Personal experience`],
    optionsEs:[`El canon`,`El texto`,`La arqueología`,`La experiencia personal`],
    correct:2, explanationEn:`The third witness is archaeology — the world of the Bible in the ground.`, explanationEs:`El tercer testigo es la arqueología — el mundo de la Biblia en la tierra.` },

  { textEn:`The governing maxim for archaeology in this course is:`, textEs:`La máxima rectora para la arqueología en este curso es:`,
    optionsEn:[`Correlation, not proof`,`Proof, not correlation`,`Silence is a verdict`,`Archaeology proves everything`],
    optionsEs:[`Correlación, no prueba`,`Prueba, no correlación`,`El silencio es un veredicto`,`La arqueología prueba todo`],
    correct:0, explanationEn:`Correlation, not proof — the maxim that governs the archaeology units.`, explanationEs:`Correlación, no prueba — la máxima que gobierna las unidades de arqueología.` },

  { textEn:`Archaeology is best described as:`, textEs:`La arqueología se describe mejor como:`,
    optionsEn:[`A machine that proves or disproves the Bible`,`The recovery and interpretation of the material remains of the past`,`A branch of theology`,`The study of ancient languages only`],
    optionsEs:[`Una máquina que prueba o refuta la Biblia`,`La recuperación e interpretación de los restos materiales del pasado`,`Una rama de la teología`,`Solo el estudio de lenguas antiguas`],
    correct:1, explanationEn:`It is the recovery and interpretation of material remains — a science of fragments.`, explanationEs:`Es la recuperación e interpretación de restos materiales — una ciencia de fragmentos.` },

  { textEn:`Which is true of how much survives and is recovered?`, textEs:`¿Qué es verdad de cuánto sobrevive y se recupera?`,
    optionsEn:[`Nearly everything ancient is found`,`All inscriptions survive`,`Only a small fraction of sites are dug, and most materials perish`,`Excavation is complete`],
    optionsEs:[`Casi todo lo antiguo se halla`,`Todas las inscripciones sobreviven`,`Solo una pequeña fracción de los sitios se excavan, y la mayoría de los materiales perecen`,`La excavación está completa`],
    correct:2, explanationEn:`Only a fraction is dug and most materials perish — archaeology is incomplete.`, explanationEs:`Solo una fracción se excava y la mayoría de los materiales perecen — la arqueología es incompleta.` },

  { textEn:`In archaeology, as in all history, real proof is:`, textEs:`En la arqueología, como en toda la historia, la prueba real es:`,
    optionsEn:[`The usual result`,`Guaranteed by every dig`,`The same as illustration`,`Rare; we almost never get it`],
    optionsEs:[`El resultado usual`,`Garantizada por cada excavación`,`Lo mismo que la ilustración`,`Rara; casi nunca la obtenemos`],
    correct:3, explanationEn:`Real proof is rare in archaeology, as in all history.`, explanationEs:`La prueba real es rara en la arqueología, como en toda la historia.` },

  { textEn:`What does archaeology do best and most often?`, textEs:`¿Qué hace la arqueología mejor y con más frecuencia?`,
    optionsEn:[`Prove doctrines`,`Corroborate — confirm and support the Bible's world`,`Contradict the Bible`,`Nothing`],
    optionsEs:[`Probar doctrinas`,`Corroborar — confirmar y apoyar el mundo de la Biblia`,`Contradecir la Biblia`,`Nada`],
    correct:1, explanationEn:`Corroboration is the daily work of biblical archaeology.`, explanationEs:`La corroboración es el trabajo diario de la arqueología bíblica.` },

  { textEn:`Uncovering a lamp, a house, or a pavement from Bible times is an example of archaeology's power to:`, textEs:`Descubrir una lámpara, una casa o un pavimento de los tiempos bíblicos es un ejemplo del poder de la arqueología para:`,
    optionsEn:[`Prove inspiration`,`Disprove miracles`,`Illustrate — make the world of the text vivid`,`Date the autographs`],
    optionsEs:[`Probar la inspiración`,`Refutar los milagros`,`Ilustrar — hacer vívido el mundo del texto`,`Fechar los autógrafos`],
    correct:2, explanationEn:`Such finds illustrate — they make the world of the text vivid.`, explanationEs:`Tales hallazgos ilustran — hacen vívido el mundo del texto.` },

  { textEn:`"Absence of evidence is not evidence of absence" warns against:`, textEs:`"La ausencia de evidencia no es evidencia de ausencia" advierte contra:`,
    optionsEn:[`The apologist's overclaim`,`Reading the Bible`,`Excavating at all`,`The skeptic's error of treating a missing find as a verdict`],
    optionsEs:[`La exageración del apologista`,`Leer la Biblia`,`Excavar en absoluto`,`El error del escéptico de tratar un hallazgo faltante como un veredicto`],
    correct:3, explanationEn:`It warns the skeptic not to treat a missing find as a verdict.`, explanationEs:`Advierte al escéptico de no tratar un hallazgo faltante como un veredicto.` },

  { textEn:`The Hittites are a classic example because they were:`, textEs:`Los hititas son un ejemplo clásico porque fueron:`,
    optionsEn:[`Never mentioned in the Bible`,`Once dismissed as a biblical fiction, then confirmed by vast archives`,`A Christian invention`,`Proof of the resurrection`],
    optionsEs:[`Nunca mencionados en la Biblia`,`Una vez descartados como ficción bíblica, luego confirmados por vastos archivos`,`Una invención cristiana`,`Prueba de la resurrección`],
    correct:1, explanationEn:`The Hittites were doubted, then confirmed by vast archives.`, explanationEs:`Los hititas fueron dudados, luego confirmados por vastos archivos.` },

  { textEn:`The stone found at Tel Dan is significant because it bears the words:`, textEs:`La piedra hallada en Tel Dan es significativa porque lleva las palabras:`,
    optionsEn:[`"Pontius Pilate"`,`"Jesus of Nazareth"`,`"the house of David"`,`"the Hittites"`],
    optionsEs:[`"Poncio Pilato"`,`"Jesús de Nazaret"`,`"la casa de David"`,`"los hititas"`],
    correct:2, explanationEn:`The Tel Dan stone names "the house of David."`, explanationEs:`La piedra de Tel Dan nombra "la casa de David".` },

  { textEn:`The overclaim "Archaeology proves the Bible!" is dangerous because it:`, textEs:`La exageración "¡La arqueología prueba la Biblia!" es peligrosa porque:`,
    optionsEn:[`Sets up a believer to stumble when he meets a genuine dispute`,`Is too modest`,`Denies the Bible`,`Is always false`],
    optionsEs:[`Prepara al creyente para tropezar cuando halla una disputa genuina`,`Es demasiado modesta`,`Niega la Biblia`,`Siempre es falsa`],
    correct:0, explanationEn:`Overclaiming sets a believer up to stumble at the first real dispute.`, explanationEs:`Exagerar prepara al creyente para tropezar ante la primera disputa real.` },

  { textEn:`Refusing the overclaim, the unit says, is done in order to:`, textEs:`Rechazar la exageración, dice la unidad, se hace para:`,
    optionsEn:[`Weaken the Bible`,`Please skeptics`,`Avoid study`,`Protect the faith of those we teach`],
    optionsEs:[`Debilitar la Biblia`,`Complacer a los escépticos`,`Evitar el estudio`,`Proteger la fe de aquellos a quienes enseñamos`],
    correct:3, explanationEn:`We refuse the overclaim to protect the faith of those we teach.`, explanationEs:`Rechazamos la exageración para proteger la fe de aquellos a quienes enseñamos.` },

  { textEn:`The cumulative weight of many honest correlations:`, textEs:`El peso acumulado de muchas correlaciones honestas:`,
    optionsEn:[`Proves the resurrection`,`Earns reasonable trust for the Bible's whole account`,`Means nothing`,`Disproves the Bible`],
    optionsEs:[`Prueba la resurrección`,`Gana una confianza razonable para todo el relato de la Biblia`,`No significa nada`,`Refuta la Biblia`],
    correct:1, explanationEn:`Cumulative correlation earns reasonable trust for the whole account.`, explanationEs:`La correlación acumulada gana confianza razonable para todo el relato.` },

  { textEn:`A document that gets its verifiable world right again and again:`, textEs:`Un documento que acierta su mundo verificable una y otra vez:`,
    optionsEn:[`Earns a reasonable trust for the rest of its account`,`Should be distrusted`,`Proves every miracle`,`Has no historical value`],
    optionsEs:[`Gana una confianza razonable para el resto de su relato`,`Debe desconfiarse`,`Prueba cada milagro`,`No tiene valor histórico`],
    correct:0, explanationEn:`Getting the verifiable world right earns trust for the rest.`, explanationEs:`Acertar el mundo verificable gana confianza para el resto.` },

  { textEn:`Archaeology can confirm that a city was destroyed by fire, but it cannot:`, textEs:`La arqueología puede confirmar que una ciudad fue destruida por fuego, pero no puede:`,
    optionsEn:[`Date the ruins`,`Identify pottery`,`Find inscriptions`,`Tell you that God gave it into Israel's hand`],
    optionsEs:[`Fechar las ruinas`,`Identificar la cerámica`,`Hallar inscripciones`,`Decirte que Dios la entregó en mano de Israel`],
    correct:3, explanationEn:`It can date the fire, but not tell you God gave the city to Israel.`, explanationEs:`Puede fechar el fuego, pero no decirte que Dios dio la ciudad a Israel.` },

  { textEn:`Archaeology can show a man named Jesus was crucified under Pilate, but it cannot show:`, textEs:`La arqueología puede mostrar que un hombre llamado Jesús fue crucificado bajo Pilato, pero no puede mostrar:`,
    optionsEn:[`That Pilate existed`,`That on the third day He rose`,`That Judea was Roman`,`That crucifixion happened`],
    optionsEs:[`Que Pilato existió`,`Que al tercer día resucitó`,`Que Judea era romana`,`Que la crucifixión sucedió`],
    correct:1, explanationEn:`It cannot reach the resurrection — the miracle lies beyond the spade.`, explanationEs:`No puede alcanzar la resurrección — el milagro está más allá de la pala.` },

  { textEn:`The deepest truths of the faith, the unit says, rest on:`, textEs:`Las verdades más profundas de la fe, dice la unidad, descansan en:`,
    optionsEn:[`The character of the God who spoke and the witness of His Spirit`,`The spade`,`Archaeology alone`,`Inscriptions`],
    optionsEs:[`El carácter del Dios que habló y el testimonio de su Espíritu`,`La pala`,`Solo la arqueología`,`Las inscripciones`],
    correct:0, explanationEn:`Faith rests on God's character and the Spirit's witness, not the spade.`, explanationEs:`La fe descansa en el carácter de Dios y el testimonio del Espíritu, no en la pala.` },

  { textEn:`When a genuine archaeological dispute stands, the unit counsels us to:`, textEs:`Cuando hay una disputa arqueológica genuina, la unidad nos aconseja:`,
    optionsEn:[`Declare the Bible false`,`Ignore it`,`Hold it honestly as an open question`,`Overclaim a resolution`],
    optionsEs:[`Declarar la Biblia falsa`,`Ignorarla`,`Sostenerla con honestidad como una pregunta abierta`,`Exagerar una resolución`],
    correct:2, explanationEn:`Hold genuine disputes honestly as open questions.`, explanationEs:`Sostén las disputas genuinas con honestidad como preguntas abiertas.` },

  { textEn:`Archaeology's proper place is:`, textEs:`El lugar propio de la arqueología es:`,
    optionsEn:[`The foundation of our faith`,`Irrelevant`,`Greater than Scripture`,`A supporting witness to the world in which faith's events occurred`],
    optionsEs:[`El fundamento de nuestra fe`,`Irrelevante`,`Mayor que la Escritura`,`Un testigo que apoya el mundo en que ocurrieron los eventos de la fe`],
    correct:3, explanationEn:`It is a supporting witness to the world of the events, not the foundation.`, explanationEs:`Es un testigo que apoya el mundo de los eventos, no el fundamento.` },

  { textEn:`The next unit (Unit 8) will:`, textEs:`La próxima unidad (Unidad 8):`,
    optionsEn:[`Walk among actual finds — confirmations and honest puzzles`,`Abandon archaeology`,`Return to the canon`,`Discuss geography only`],
    optionsEs:[`Caminará entre los hallazgos reales — confirmaciones y enigmas honestos`,`Abandonará la arqueología`,`Volverá al canon`,`Discutirá solo la geografía`],
    correct:0, explanationEn:`Unit 8 walks among actual finds — confirmations and honest puzzles.`, explanationEs:`La Unidad 8 camina entre los hallazgos reales — confirmaciones y enigmas honestos.` }
];

const saQuestions = [
  { promptEn:`What is the governing maxim for archaeology in this course, and why?`,
    promptEs:`¿Cuál es la máxima rectora para la arqueología en este curso, y por qué?`,
    keywords:[`correlat`,`correlac`,`proof`,`prueb`,`archaeolog`,`arqueolog`,`real`,`stumbl`],
    modelEn:`The governing maxim is "correlation, not proof." Archaeology can show again and again that the world of the Bible was real — real kings, cities, and customs — which is genuine correlation, but it is not the same as proof, which settles a matter beyond dispute. Confusing correlation with proof, in either direction, leads a believer to stumble.`,
    modelEs:`La máxima rectora es "correlación, no prueba". La arqueología puede mostrar una y otra vez que el mundo de la Biblia era real — reyes, ciudades y costumbres reales — lo cual es correlación genuina, pero no es lo mismo que prueba, que zanja un asunto sin disputa. Confundir la correlación con la prueba, en cualquier dirección, lleva al creyente a tropezar.` },

  { promptEn:`Explain why archaeology so rarely proves and why its silence proves even less.`,
    promptEs:`Explica por qué la arqueología tan rara vez prueba y por qué su silencio prueba aún menos.`,
    keywords:[`fragment`,`excavat`,`excav`,`perish`,`perec`,`inscription`,`absence`,`ausenc`],
    modelEn:`Archaeology is a science of fragments: only a fraction of ancient sites are found, only a fraction excavated, and most materials perish, while inscriptions are rarest of all, and every find must still be interpreted. Because so little survives and is recovered, a matter is rarely settled beyond dispute, and the mere absence of a find proves even less, since the ground is only partly dug.`,
    modelEs:`La arqueología es una ciencia de fragmentos: solo una fracción de los sitios antiguos se hallan, solo una fracción se excavan, y la mayoría de los materiales perecen, mientras que las inscripciones son las más raras de todas, y todo hallazgo aún debe interpretarse. Porque tan poco sobrevive y se recupera, un asunto rara vez se zanja sin disputa, y la mera ausencia de un hallazgo prueba aún menos, pues la tierra está solo parcialmente excavada.` },

  { promptEn:`Name and apply the three things evidence can do to archaeology.`,
    promptEs:`Nombra y aplica las tres cosas que la evidencia puede hacer a la arqueología.`,
    keywords:[`proof`,`prueb`,`corrobor`,`illustrat`,`ilustr`,`confirm`,`custom`,`costumbr`],
    modelEn:`Proof settles a matter beyond dispute, and in archaeology it is rare. Corroboration confirms and supports — a king, city, or custom the Bible names turning up in the ground — and this is what archaeology does best. Illustration makes the world of the text vivid, as when a lamp or a house or a pavement from Bible times is uncovered. Corroboration and illustration are the daily work of biblical archaeology.`,
    modelEs:`La prueba zanja un asunto sin disputa, y en la arqueología es rara. La corroboración confirma y apoya — un rey, ciudad o costumbre que la Biblia nombra apareciendo en la tierra — y esto es lo que la arqueología hace mejor. La ilustración hace vívido el mundo del texto, como cuando se descubre una lámpara o una casa o un pavimento de los tiempos bíblicos. La corroboración y la ilustración son el trabajo diario de la arqueología bíblica.` },

  { promptEn:`Explain "absence of evidence is not evidence of absence," with an example.`,
    promptEs:`Explica "la ausencia de evidencia no es evidencia de ausencia", con un ejemplo.`,
    keywords:[`absence`,`ausenc`,`hittite`,`hitita`,`david`,`camel`,`evidence`,`evidenc`],
    modelEn:`Because archaeology is so incomplete, a missing find can never by itself be a verdict. Again and again the Bible has been called unhistorical because nothing had turned up, and then it did. The Hittites were once dismissed as a fiction until vast archives were found; King David was called a legend until a stone at Tel Dan named "the house of David." So the skeptic who says "no evidence, therefore it did not happen" swallows a camel.`,
    modelEs:`Porque la arqueología es tan incompleta, un hallazgo faltante nunca puede por sí solo ser un veredicto. Una y otra vez la Biblia ha sido llamada no histórica porque nada había aparecido, y luego apareció. Los hititas fueron una vez descartados como ficción hasta que se hallaron vastos archivos; el rey David fue llamado una leyenda hasta que una piedra en Tel Dan nombró "la casa de David". Así que el escéptico que dice "no hay evidencia, por tanto no sucedió" traga un camello.` },

  { promptEn:`Why does the unit refuse the overclaim "Archaeology proves the Bible"?`,
    promptEs:`¿Por qué la unidad rechaza la exageración "La arqueología prueba la Biblia"?`,
    keywords:[`overclaim`,`exager`,`correlat`,`correlac`,`protect`,`proteg`,`dispute`,`disput`],
    modelEn:`Because archaeology does not prove the Bible; it correlates with it. The believer told "it is all proven," when he later meets a genuine dispute, can have his faith shaken far more than the difficulty deserved, since it rested on a promise that was never true. The unit refuses the overclaim not from weakness but to protect the faith of those we teach; honest correlation is a firmer foundation than a proof that cannot bear weight.`,
    modelEs:`Porque la arqueología no prueba la Biblia; se correlaciona con ella. El creyente al que se le dijo "todo está probado", cuando luego halla una disputa genuina, puede ver su fe sacudida mucho más de lo que la dificultad merecía, pues descansaba en una promesa que nunca fue verdadera. La unidad rechaza la exageración no por debilidad sino para proteger la fe de los que enseñamos; la correlación honesta es un fundamento más firme que una prueba que no puede sostener peso.` },

  { promptEn:`If archaeology only correlates, what is it worth?`,
    promptEs:`Si la arqueología solo se correlaciona, ¿qué vale?`,
    keywords:[`cumulat`,`acumul`,`correlat`,`correlac`,`confirm`,`verifiab`,`trust`,`confianz`],
    modelEn:`A great deal, because the cumulative weight of honest correlation is powerful. The Bible names many checkable kings, nations, cities, and customs, and across a century and a half of excavation these details have been confirmed on an enormous scale. A document that gets its verifiable world right again and again earns reasonable trust for the rest of its account — not proof of the miracles, but strong evidence that the Bible is rooted in real history, not detached from it.`,
    modelEs:`Muchísimo, porque el peso acumulado de la correlación honesta es poderoso. La Biblia nombra muchos reyes, naciones, ciudades y costumbres verificables, y a través de siglo y medio de excavación estos detalles han sido confirmados a una escala enorme. Un documento que acierta su mundo verificable una y otra vez gana una confianza razonable para el resto de su relato — no prueba de los milagros, sino fuerte evidencia de que la Biblia está arraigada en la historia real, no separada de ella.` },

  { promptEn:`What can archaeology NOT touch?`,
    promptEs:`¿Qué NO puede alcanzar la arqueología?`,
    keywords:[`material`,`miracle`,`milagr`,`meaning`,`significa`,`crucif`,`pilat`,`confirm`],
    modelEn:`Archaeology reaches the material and the datable — walls, bones, coins, names — and there it stops. It can confirm that a city burned but not that the LORD gave it to Israel; it can show that Jesus was crucified under Pilate but not that He rose on the third day. It cannot reach the miracle, the meaning, or the God behind the event. The deepest truths of the faith were never meant to be dug out of the ground.`,
    modelEs:`La arqueología alcanza lo material y lo databe — muros, huesos, monedas, nombres — y ahí se detiene. Puede confirmar que una ciudad se quemó pero no que Jehová la dio a Israel; puede mostrar que Jesús fue crucificado bajo Pilato pero no que resucitó al tercer día. No puede alcanzar el milagro, el significado, ni el Dios detrás del evento. Las verdades más profundas de la fe nunca fueron destinadas a ser desenterradas de la tierra.` },

  { promptEn:`What are the rules for weighing archaeological evidence, according to the unit?`,
    promptEs:`¿Cuáles son las reglas para pesar la evidencia arqueológica, según la unidad?`,
    keywords:[`correlat`,`correlac`,`silence`,`silenc`,`camel`,`overclaim`,`exager`,`dispute`],
    modelEn:`Expect correlation, not proof. Never argue from silence in either direction, since the ground is only partly dug. Refuse the skeptic's camel that a missing find is a verdict, and refuse the apologist's overclaim that a find proves all things. Hold genuine disputes honestly as open questions, and let the cumulative weight of real correlations build an unhurried confidence, remembering that archaeology reaches the world of the Bible but not its miracles.`,
    modelEs:`Espera correlación, no prueba. Nunca argumentes desde el silencio en ninguna dirección, pues la tierra está solo parcialmente excavada. Rechaza el camello del escéptico de que un hallazgo faltante es un veredicto, y rechaza la exageración del apologista de que un hallazgo prueba todas las cosas. Sostén las disputas genuinas con honestidad como preguntas abiertas, y deja que el peso acumulado de correlaciones reales construya una confianza sin prisa, recordando que la arqueología alcanza el mundo de la Biblia pero no sus milagros.` },

  { promptEn:`Explain archaeology's proper place in relation to faith.`,
    promptEs:`Explica el lugar propio de la arqueología en relación con la fe.`,
    keywords:[`foundation`,`fundament`,`witness`,`testig`,`corrobor`,`miracle`,`milagr`,`real`],
    modelEn:`Archaeology is not the foundation of faith but a supporting witness to the world in which faith's events occurred. It corroborates the stage and the actors — real places, real people, real history — but it cannot script the drama or reach the miracle. Our faith rests, as from the beginning, on the character of the God who spoke and the witness of His Spirit, and archaeology takes its modest, honest place beside that foundation, not in place of it.`,
    modelEs:`La arqueología no es el fundamento de la fe sino un testigo que apoya el mundo en que ocurrieron los eventos de la fe. Corrobora el escenario y los actores — lugares reales, personas reales, historia real — pero no puede escribir el drama ni alcanzar el milagro. Nuestra fe descansa, como desde el principio, en el carácter del Dios que habló y el testimonio de su Espíritu, y la arqueología toma su lugar modesto y honesto junto a ese fundamento, no en su lugar.` },

  { promptEn:`In your own words, how should the rules of this unit guide you when you hear a claim about archaeology and the Bible?`,
    promptEs:`Con tus palabras, ¿cómo deben las reglas de esta unidad guiarte cuando oyes una afirmación sobre la arqueología y la Biblia?`,
    keywords:[`correlat`,`correlac`,`prove`,`prob`,`absence`,`ausenc`,`extrem`,`dispute`],
    modelEn:`When I hear that a find "proves the Bible," I should remember it correlates rather than proves, and state it soberly. When I hear that a missing find shows the Bible is false, I should recall that absence of evidence is not evidence of absence. I should refuse both extremes, hold genuine disputes as open questions, and rest my faith not on the spade but on God, letting real correlations build honest confidence.`,
    modelEs:`Cuando oiga que un hallazgo "prueba la Biblia", debo recordar que se correlaciona en vez de probar, y afirmarlo con sobriedad. Cuando oiga que un hallazgo faltante muestra que la Biblia es falsa, debo recordar que la ausencia de evidencia no es evidencia de ausencia. Debo rechazar ambos extremos, sostener las disputas genuinas como preguntas abiertas, y descansar mi fe no en la pala sino en Dios, dejando que las correlaciones reales construyan una confianza honesta.` }
];
