/* CTSHermeneutics - unit 11: per-unit configuration and content. */

const UNIT = 11;

const NEXT_UNIT_URL = "CTSHermeneuticsCertificate.html";

const PREV_UNIT_URL = "CTSHermeneuticsUnit10.html";

const IS_FINAL_UNIT = true;

const SHOW_REGISTRATION = false;

const mcQuestions = [
    {
      textEn: "1. The central thesis of this unit is:",
      textEs: "1. La tesis central de esta unidad es:",
      optionsEn: ["A. The whole Bible is one Christ-tracking story; every text in the Book points there","B. The Old Testament can safely be skipped","C. The Bible is a random collection of moral lessons","D. Only the Gospels track Christ"],
      optionsEs: ["A. Toda la Biblia es una sola historia rastreando a Cristo; cada texto en el Libro apunta allá","B. El Antiguo Testamento puede saltarse con seguridad","C. La Biblia es una colección al azar de lecciones morales","D. Solo los Evangelios rastrean a Cristo"],
      correct: "A",
      correctFeedbackEn: "Correct. The pastor's job is to bring his people from wherever they sit on Mars Hill to the foot of the Resurrected One. The pastor who can trace the line through the Bible can trace it through any single passage.",
      correctFeedbackEs: "Correcto. El trabajo del pastor es traer a su pueblo desde donde sea que estén sentados en el Areópago hasta el pie del Resucitado. El pastor que pueda trazar la línea a través de la Biblia puede trazarla a través de cualquier pasaje individual.",
      incorrectFeedbackEn: "The OT cannot be skipped, the Bible is not random morality, and Christ is tracked through ALL Scripture, not only the Gospels. The thesis is: THE WHOLE BIBLE IS ONE CHRIST-TRACKING STORY. Every text points there.",
      incorrectFeedbackEs: "El AT no puede saltarse, la Biblia no es moralidad al azar, y Cristo es rastreado a través de TODA la Escritura, no solo los Evangelios. La tesis es: TODA LA BIBLIA ES UNA SOLA HISTORIA RASTREANDO A CRISTO. Cada texto apunta allá."
    },
    {
      textEn: "2. On the road to Emmaus, Jesus did what (Luke 24:27)?",
      textEs: "2. En el camino a Emaús, Jesús hizo qué (Lucas 24:27)?",
      optionsEn: ["A. Quoted only the Psalms","B. Refused to speak of Himself","C. Beginning at Moses and all the Prophets, expounded in all the Scriptures the things concerning Himself","D. Asked the disciples to teach Him"],
      optionsEs: ["A. Citó solo los Salmos","B. Se negó a hablar de Sí mismo","C. Comenzando desde Moisés y de todos los profetas, declaró en todas las Escrituras lo que decían de Él","D. Pidió a los discípulos que Le enseñaran"],
      correct: "C",
      correctFeedbackEn: "Correct. All the Scriptures. The things concerning Himself. Jesus took the whole Old Testament and showed how every part had been pointing at Him. This is the foundational text for every Christ-centered sermon ever preached after Him.",
      correctFeedbackEs: "Correcto. Todas las Escrituras. Las cosas referentes a Él. Jesús tomó todo el Antiguo Testamento y mostró cómo cada parte había estado apuntando a Él. Éste es el texto fundamental para cada sermón centrado en Cristo predicado después de Él.",
      incorrectFeedbackEn: "Jesus did not limit Himself to the Psalms, did not refuse to speak of Himself, and did not ask to be taught. He BEGAN AT MOSES AND ALL THE PROPHETS and expounded in ALL THE SCRIPTURES the things concerning Himself. That is the model for Christ-centered preaching.",
      incorrectFeedbackEs: "Jesús no se limitó a los Salmos, no se negó a hablar de Sí mismo, y no pidió ser enseñado. COMENZÓ DESDE MOISÉS Y TODOS LOS PROFETAS y declaró en TODAS LAS ESCRITURAS las cosas referentes a Él. Ése es el modelo para la predicación centrada en Cristo."
    },
    {
      textEn: "3. The six movements that organize the macro-arc of the Bible are:",
      textEs: "3. Los seis movimientos que organizan el macroarco de la Biblia son:",
      optionsEn: ["A. Law, prophets, gospels, epistles, history, apocalypse","B. Creation, Fall, Israel, Christ, Church, Consummation","C. Hebrew, Greek, Aramaic, Latin, English, Spanish","D. Patriarchs, Egypt, wilderness, conquest, kings, exile"],
      optionsEs: ["A. Ley, profetas, evangelios, epístolas, historia, apocalipsis","B. Creación, Caída, Israel, Cristo, Iglesia, Consumación","C. Hebreo, griego, arameo, latín, inglés, español","D. Patriarcas, Egipto, desierto, conquista, reyes, exilio"],
      correct: "B",
      correctFeedbackEn: "Correct. CREATION (God made everything good), FALL (rebellion brought the curse), ISRAEL (the covenant people through whom redemption would come), CHRIST (God Himself entered the story), CHURCH (the gospel goes out), CONSUMMATION (Christ returns). Every passage sits somewhere on this arc.",
      correctFeedbackEs: "Correcto. CREACIÓN (Dios hizo todo bueno), CAÍDA (la rebelión trajo la maldición), ISRAEL (el pueblo del pacto a través del cual vendría la redención), CRISTO (Dios mismo entró en la historia), IGLESIA (el evangelio sale), CONSUMACIÓN (Cristo regresa). Cada pasaje se sienta en algún lugar de este arco.",
      incorrectFeedbackEn: "Canon divisions, OT subdivisions, and languages are not the macro-arc. The six MOVEMENTS are CREATION → FALL → ISRAEL → CHRIST → CHURCH → CONSUMMATION. Every passage in the Bible sits somewhere on this arc, and placement tells the pastor how Christ is connected to it.",
      incorrectFeedbackEs: "Las divisiones del canon, las subdivisiones del AT, y los idiomas no son el macroarco. Los seis MOVIMIENTOS son CREACIÓN → CAÍDA → ISRAEL → CRISTO → IGLESIA → CONSUMACIÓN. Cada pasaje en la Biblia se sienta en algún lugar de este arco, y la colocación le dice al pastor cómo Cristo está conectado con él."
    },
    {
      textEn: "4. The lesson names four reliable roads from any Old Testament passage to Christ. They are:",
      textEs: "4. La lección nombra cuatro caminos confiables desde cualquier pasaje del Antiguo Testamento a Cristo. Son:",
      optionsEn: ["A. Promise, Type, Image, Presence","B. Genesis, Exodus, Numbers, Deuteronomy","C. Reading, marking, learning, inwardly digesting","D. Doctrine, ethics, history, prophecy"],
      optionsEs: ["A. Promesa, Tipo, Imagen, Presencia","B. Génesis, Éxodo, Números, Deuteronomio","C. Leer, marcar, aprender, asimilar","D. Doctrina, ética, historia, profecía"],
      correct: "A",
      correctFeedbackEn: "Correct. PROMISE: God said it; Christ fulfilled it. TYPE: a figure or event prefigures Him. IMAGE: pictures He later inhabits (lamb, manna, rock). PRESENCE: the pre-incarnate Christ appears in the OT itself. Most passages have at least one road. None has none.",
      correctFeedbackEs: "Correcto. PROMESA: Dios lo dijo; Cristo lo cumplió. TIPO: una figura o evento Lo prefigura. IMAGEN: cuadros que Él luego habita (cordero, maná, roca). PRESENCIA: el Cristo preencarnado aparece en el AT mismo. La mayoría de los pasajes tienen al menos un camino. Ninguno tiene ninguno.",
      incorrectFeedbackEn: "Pentateuch names, devotional verbs, and broad theological categories are not the four roads. The four are PROMISE, TYPE, IMAGE, PRESENCE. From any OT passage, at least one of these four leads to Christ.",
      incorrectFeedbackEs: "Los nombres del Pentateuco, los verbos devocionales, y las categorías teológicas amplias no son los cuatro caminos. Los cuatro son PROMESA, TIPO, IMAGEN, PRESENCIA. Desde cualquier pasaje del AT, al menos uno de estos cuatro lleva a Cristo."
    },
    {
      textEn: "5. The Cochrane \"Man of Vision\" bronze statue is used in this lesson as:",
      textEs: "5. La estatua de bronce «Hombre de Visión» de Cochrane se usa en esta lección como:",
      optionsEn: ["A. A monument that should be replaced","B. The required topic of all Cochrane sermons","C. An example of biblical idolatry","D. A modern parallel to the Athenian altars — a starting point from which the pastor can track to the original Man of Vision, Christ"],
      optionsEs: ["A. Un monumento que debe ser reemplazado","B. El tema requerido de todos los sermones de Cochrane","C. Un ejemplo de la idolatría bíblica","D. Un paralelo moderno a los altares atenienses — un punto de partida desde el cual el pastor puede rastrear al Hombre de Visión original, Cristo"],
      correct: "D",
      correctFeedbackEn: "Correct. Every pastor walks into a Mars Hill on Sunday. The statues are different, but the principle is identical. Find the line that runs from where the people stand to Christ, and walk them up it. The Cochrane statue is a worked example of the Mars Hill method in modern dress.",
      correctFeedbackEs: "Correcto. Cada pastor entra a un Areópago el domingo. Las estatuas son distintas, pero el principio es idéntico. Encuentre la línea que corre de donde está parado el pueblo a Cristo, y camínelos hacia arriba por ella. La estatua de Cochrane es un ejemplo trabajado del método del Areópago en vestido moderno.",
      incorrectFeedbackEn: "The Cochrane statue is not to be replaced, is not a required topic, and is not idolatry. It is a MARS HILL ICON: a visible local landmark from which the pastor can build a sermon to the original Man of Vision, Christ. Use what the community already sees as the entry to what they need to hear.",
      incorrectFeedbackEs: "La estatua de Cochrane no debe reemplazarse, no es un tema requerido, y no es idolatría. Es un ÍCONO DE MARTE HILL: un punto de referencia local visible desde el cual el pastor puede construir un sermón al Hombre de Visión original, Cristo. Use lo que la comunidad ya ve como entrada a lo que necesitan oír."
    },
    {
      textEn: "6. The 17-line \"As a man, but as God\" progression in this lesson teaches:",
      textEs: "6. La progresión de 17 líneas «como hombre, pero como Dios» en esta lección enseña:",
      optionsEn: ["A. Two persons in Jesus","B. The full Christ requires both natures held in view at once — fully God and fully man, the centerpiece of every Christ-centered sermon","C. Three natures coexisting","D. The humanity of Christ alone"],
      optionsEs: ["A. Dos personas en Jesús","B. El Cristo pleno requiere ambas naturalezas a la vista a la vez — plenamente Dios y plenamente hombre, el eje de cada sermón centrado en Cristo","C. Tres naturalezas coexistiendo","D. Solo la humanidad de Cristo"],
      correct: "B",
      correctFeedbackEn: "Correct. Either Jesus is God or He is the greatest fraud who ever lived. There is no third option. A sermon that gives you only one of the two natures has not yet tracked all the way to the Person. The Bible insists on both, and the pastor must hold both in view.",
      correctFeedbackEs: "Correcto. O Jesús es Dios o es el fraude más grande que jamás ha vivido. No hay tercera opción. Un sermón que le da solo una de las dos naturalezas no ha rastreado todavía todo el camino hasta la Persona. La Biblia insiste en ambas, y el pastor debe tener ambas a la vista.",
      incorrectFeedbackEn: "Two persons, three natures, and humanity-only are all errors. The lesson teaches the orthodox confession: ONE PERSON, TWO NATURES — fully God and fully man. Every Christ-centered sermon must hold both in view, because the Bible insists on both.",
      incorrectFeedbackEs: "Dos personas, tres naturalezas, y solo la humanidad son todos errores. La lección enseña la confesión ortodoxa: UNA PERSONA, DOS NATURALEZAS — plenamente Dios y plenamente hombre. Cada sermón centrado en Cristo debe tener ambas a la vista, porque la Biblia insiste en ambas."
    },
    {
      textEn: "7. According to the \"As a man, but as God\" passage, Jesus as a man was born in a manger; but as God He is:",
      textEs: "7. Según el pasaje «como hombre, pero como Dios», Jesús como hombre nació en un pesebre; pero como Dios Él es:",
      optionsEn: ["A. A historical figure only","B. The Everlasting One","C. A teacher among teachers","D. A symbolic construction"],
      optionsEs: ["A. Solo una figura histórica","B. El Eterno","C. Un maestro entre maestros","D. Una construcción simbólica"],
      correct: "B",
      correctFeedbackEn: "Correct. The manger is a real historical event in time. The Everlasting One is the eternal Son who entered time. Both are equally true. The Christmas story preaches both natures in one event, and the pastor must preach both in his sermons.",
      correctFeedbackEs: "Correcto. El pesebre es un evento histórico real en el tiempo. El Eterno es el Hijo eterno que entró en el tiempo. Ambos son igualmente ciertos. La historia de Navidad predica ambas naturalezas en un solo evento, y el pastor debe predicar ambas en sus sermones.",
      incorrectFeedbackEn: "Historical only, teacher only, and symbolic only all reduce Christ. The truth is BOTH — born in a manger AS A MAN; the EVERLASTING ONE as God. Both natures coexist in one Person. That is the Christ every passage tracks toward.",
      incorrectFeedbackEs: "Solo histórico, solo maestro, y solo simbólico todos reducen a Cristo. La verdad es AMBOS — nacido en un pesebre COMO HOMBRE; el ETERNO como Dios. Ambas naturalezas coexisten en una sola Persona. Ése es el Cristo hacia el cual rastrea cada pasaje."
    },
    {
      textEn: "8. The first error in Christ-tracking, according to this lesson, is:",
      textEs: "8. El primer error al rastrear a Cristo, según esta lección, es:",
      optionsEn: ["A. Reading the Bible too often","B. Using study tools","C. Forcing every detail to mean Christ — assigning christological meaning to every named object the text contains","D. Consulting commentaries"],
      optionsEs: ["A. Leer la Biblia demasiado a menudo","B. Usar herramientas de estudio","C. Forzar cada detalle para que signifique Cristo — asignar significado cristológico a cada objeto nombrado que contiene el texto","D. Consultar comentarios"],
      correct: "C",
      correctFeedbackEn: "Correct. The five smooth stones are not the five wounds. The thirty pieces of silver in Joseph's story do not equal the thirty Judas threw down. Some details connect; many do not. Forced connections cost the legitimate ones their force, and the congregation learns to mistrust.",
      correctFeedbackEs: "Correcto. Las cinco piedras lisas no son las cinco heridas. Las treinta piezas de plata en la historia de José no equivalen a las treinta que Judas tiró. Algunos detalles se conectan; muchos no. Las conexiones forzadas cuestan a las legítimas su fuerza, y la congregación aprende a desconfiar.",
      incorrectFeedbackEn: "Reading frequency, study tools, and commentaries are not errors. The FIRST error is FORCING EVERY DETAIL — assigning christological meaning to objects the text never asked you to spiritualize. Honor the connections the text makes; resist the ones it does not.",
      incorrectFeedbackEs: "La frecuencia de lectura, las herramientas de estudio, y los comentarios no son errores. El PRIMER error es FORZAR CADA DETALLE — asignar significado cristológico a objetos que el texto nunca le pidió espiritualizar. Honre las conexiones que el texto hace; resista las que no hace."
    },
    {
      textEn: "9. The second error in Christ-tracking is:",
      textEs: "9. El segundo error al rastrear a Cristo es:",
      optionsEn: ["A. Ignoring the connections the Bible itself makes — preaching Genesis 22 without the NT's Father-Son framing, or Numbers 21 without John 3:14","B. Praying before sermon preparation","C. Reading multiple translations","D. Using illustrations"],
      optionsEs: ["A. Ignorar las conexiones que la misma Biblia hace — predicar Génesis 22 sin el marco Padre-Hijo del NT, o Números 21 sin Juan 3:14","B. Orar antes de la preparación del sermón","C. Leer múltiples traducciones","D. Usar ilustraciones"],
      correct: "A",
      correctFeedbackEn: "Correct. The Spirit provided the map. The NT explicitly tracks Christ through dozens of OT passages. The pastor who preaches Genesis 22 without the Father-Son framing, or Numbers 21 without John 3:14, has refused to follow the map. Use the connections the Bible itself gives.",
      correctFeedbackEs: "Correcto. El Espíritu proveyó el mapa. El NT explícitamente rastrea a Cristo a través de docenas de pasajes del AT. El pastor que predica Génesis 22 sin el marco Padre-Hijo, o Números 21 sin Juan 3:14, se ha rehusado a seguir el mapa. Use las conexiones que la misma Biblia da.",
      incorrectFeedbackEn: "Prayer, translations, and illustrations are not errors. The SECOND error is IGNORING THE BIBLE'S OWN CONNECTIONS — refusing to track Christ through OT passages that the NT itself explicitly connects to Him. The map exists; follow it.",
      incorrectFeedbackEs: "La oración, las traducciones, y las ilustraciones no son errores. El SEGUNDO error es IGNORAR LAS PROPIAS CONEXIONES DE LA BIBLIA — rehusarse a rastrear a Cristo a través de pasajes del AT que el NT mismo conecta explícitamente con Él. El mapa existe; sígalo."
    },
    {
      textEn: "10. The third error in Christ-tracking is:",
      textEs: "10. El tercer error al rastrear a Cristo es:",
      optionsEn: ["A. Preaching too quickly","B. Using only one Bible translation","C. Skipping the Old Testament entirely — starving the people of three-quarters of the Bible and disconnecting them from the gospel's soil","D. Preaching for too long"],
      optionsEs: ["A. Predicar demasiado rápido","B. Usar solo una traducción de la Biblia","C. Saltarse el Antiguo Testamento por completo — matando de hambre al pueblo de tres cuartas partes de la Biblia y desconectándolos del suelo del evangelio","D. Predicar por demasiado tiempo"],
      correct: "C",
      correctFeedbackEn: "Correct. Without Passover the people cannot understand the Lord's Supper. Without the priesthood they cannot understand Hebrews. Without David's kingdom they cannot understand the throne the angel promised Mary's Son. Skip the OT and the climax loses most of its weight.",
      correctFeedbackEs: "Correcto. Sin la Pascua el pueblo no puede entender la Cena del Señor. Sin el sacerdocio no pueden entender Hebreos. Sin el reino de David no pueden entender el trono que el ángel le prometió al Hijo de María. Sáltese el AT y el clímax pierde la mayor parte de su peso.",
      incorrectFeedbackEn: "Speed, single translation, and length are not the third error. The THIRD error is SKIPPING THE OT — preaching only from the Gospels and Epistles. The OT is not a museum; it is the first three-quarters of one story whose climax is Christ.",
      incorrectFeedbackEs: "La velocidad, la única traducción, y la duración no son el tercer error. El TERCER error es SALTARSE EL AT — predicar solo de los Evangelios y las Epístolas. El AT no es un museo; es las primeras tres cuartas partes de una sola historia cuyo clímax es Cristo."
    },
    {
      textEn: "11. The Mars Hill preaching method, reduced to four steps, begins with:",
      textEs: "11. El método de predicación del Areópago, reducido a cuatro pasos, comienza con:",
      optionsEn: ["A. A condemnation of the audience's idolatry","B. Beginning where they are — starting with the question, story, or observation that meets the community in its own life","C. A long quotation from the prophets","D. A doctrinal statement"],
      optionsEs: ["A. Una condenación de la idolatría de la audiencia","B. Comenzando donde están — comenzando con la pregunta, historia, u observación que encuentra a la comunidad en su propia vida","C. Una cita larga de los profetas","D. Una declaración doctrinal"],
      correct: "B",
      correctFeedbackEn: "Correct. Paul began with their altars, not with his Bible. The pastor who opens each sermon with a question, a story, or an observation about his people's lives has already passed the threshold the same way Paul did at the Areopagus.",
      correctFeedbackEs: "Correcto. Pablo comenzó con sus altares, no con su Biblia. El pastor que abre cada sermón con una pregunta, una historia, o una observación sobre la vida de su pueblo ya ha pasado el umbral de la misma manera que Pablo en el Areópago.",
      incorrectFeedbackEn: "Condemnation, prophet quotations, and doctrinal statements are not where Paul began. Paul BEGAN WHERE THEY WERE. The first step of the Mars Hill method is to meet people in their own context — what they see, what they value, what they fear — and start there.",
      incorrectFeedbackEs: "La condenación, las citas de los profetas, y las declaraciones doctrinales no son donde Pablo comenzó. Pablo COMENZÓ DONDE ESTABAN. El primer paso del método del Areópago es encontrar a la gente en su propio contexto — lo que ven, lo que valoran, lo que temen — y comenzar allí."
    },
    {
      textEn: "12. The fourth and final step of the Mars Hill preaching method is:",
      textEs: "12. El cuarto y último paso del método de predicación del Areópago es:",
      optionsEn: ["A. End with general theism","B. End with moral exhortation","C. End with social commentary","D. Drive to the resurrection — without the resurrection there is no gospel; end every Mars Hill sermon at the empty tomb"],
      optionsEs: ["A. Termine con teísmo general","B. Termine con exhortación moral","C. Termine con comentario social","D. Vaya hasta la resurrección — sin la resurrección no hay evangelio; termine cada sermón del Areópago en la tumba vacía"],
      correct: "D",
      correctFeedbackEn: "Correct. Paul did not stop at theism. He pressed all the way to \"the Man whom He has appointed, of whom He has given assurance by raising Him from the dead.\" Without the resurrection there is no gospel. Every Mars Hill sermon must end at the empty tomb.",
      correctFeedbackEs: "Correcto. Pablo no se detuvo en el teísmo. Empujó todo el camino hasta «aquel varón al cual destinó, dando fe á todos con haberle levantado de los muertos». Sin la resurrección no hay evangelio. Cada sermón del Areópago debe terminar en la tumba vacía.",
      incorrectFeedbackEn: "Theism, moral exhortation, and social commentary are not Paul's destination. He drove ALL THE WAY TO THE RESURRECTION. The empty tomb is the climax of every Mars Hill sermon. Stop short of it and you have not preached the gospel.",
      incorrectFeedbackEs: "El teísmo, la exhortación moral, y el comentario social no son el destino de Pablo. Empujó TODO EL CAMINO HASTA LA RESURRECCIÓN. La tumba vacía es el clímax de cada sermón del Areópago. Deténgase antes y no habrá predicado el evangelio."
    },
    {
      textEn: "13. According to Acts 17, the three responses to Paul's Mars Hill sermon were:",
      textEs: "13. Según Hechos 17, las tres respuestas al sermón de Pablo en el Areópago fueron:",
      optionsEn: ["A. Some mocked, some delayed, some believed and were saved","B. All believed immediately","C. All rejected him completely","D. All asked for further evidence"],
      optionsEs: ["A. Algunos burlaron, algunos demoraron, algunos creyeron y fueron salvos","B. Todos creyeron inmediatamente","C. Todos lo rechazaron completamente","D. Todos pidieron más evidencia"],
      correct: "A",
      correctFeedbackEn: "Correct. Some mocked when Paul reached the resurrection. Some delayed: \"we will hear you again on this matter.\" Some believed: Dionysius, Damaris, and others. Every Mars Hill audience will divide into these three groups. Preach with all three in view.",
      correctFeedbackEs: "Correcto. Algunos burlaron cuando Pablo llegó a la resurrección. Algunos demoraron: «te oiremos acerca de esto otra vez». Algunos creyeron: Dionisio, Dámaris, y otros. Cada audiencia del Areópago se dividirá en estos tres grupos. Predique con los tres a la vista.",
      incorrectFeedbackEn: "Acts 17 does not record unanimous belief, total rejection, or universal request for more evidence. It records THREE GROUPS: MOCKERS, DELAYERS, AND BELIEVERS. The pastor must preach to all three because every congregation contains all three.",
      incorrectFeedbackEs: "Hechos 17 no registra creencia unánime, ni rechazo total, ni petición universal de más evidencia. Registra TRES GRUPOS: BURLADORES, DEMORADORES, Y CREYENTES. El pastor debe predicar a los tres porque cada congregación contiene a los tres."
    },
    {
      textEn: "14. The lesson says the MOST COMMON and MOST DANGEROUS response on Mars Hill is:",
      textEs: "14. La lección dice que la respuesta MÁS COMÚN y MÁS PELIGROSA en el Areópago es:",
      optionsEn: ["A. Mocking","B. Belief","C. Persecution","D. Delay — \"we will hear you again on this matter\" — because delay is decision, and most who delay do not return"],
      optionsEs: ["A. Burlarse","B. La creencia","C. La persecución","D. La demora — «te oiremos acerca de esto otra vez» — porque la demora es una decisión, y la mayoría de los que demoran no regresan"],
      correct: "D",
      correctFeedbackEn: "Correct. Mockers self-identify; believers join the church. The danger is the DELAYERS. They feel they have responded politely, but they have decided against the gospel by postponing it. The pastor must press for response now.",
      correctFeedbackEs: "Correcto. Los burladores se identifican solos; los creyentes se unen a la iglesia. El peligro son los DEMORADORES. Sienten que han respondido cortésmente, pero han decidido contra el evangelio al posponerlo. El pastor debe presionar por una respuesta ahora.",
      incorrectFeedbackEn: "Mocking is visible but not the most common; belief is the goal not the danger; persecution is not Acts 17's response. The most COMMON and most DANGEROUS response is DELAY. Most who delay never return. Press for response now.",
      incorrectFeedbackEs: "Burlarse es visible pero no la más común; la creencia es la meta no el peligro; la persecución no es la respuesta de Hechos 17. La respuesta más COMÚN y más PELIGROSA es la DEMORA. La mayoría de los que demoran nunca regresan. Presione por una respuesta ahora."
    },
    {
      textEn: "15. The story a pastor tells (a homeless boy who became a pastor preaching to 1500 people) is told in this lesson to illustrate:",
      textEs: "15. La historia que cuenta un pastor (un niño sin hogar que se volvió pastor predicando a 1500 personas) se cuenta en esta lección para ilustrar:",
      optionsEn: ["A. The American Dream applied to ministry","B. That homeless people can be successful","C. The economic impact of urban ministry","D. That God has every Mars Hill address — even the ones with no statues and no altars — and the gospel finds them"],
      optionsEs: ["A. El sueño americano aplicado al ministerio","B. Que las personas sin hogar pueden ser exitosas","C. El impacto económico del ministerio urbano","D. Que Dios tiene la dirección de cada Areópago — incluso las que no tienen estatuas ni altares — y el evangelio las encuentra"],
      correct: "D",
      correctFeedbackEn: "Correct. \"God had my address.\" Even when the boy was sleeping on the pavement under a bridge, God knew where he was. David said the same in Psalm 27: \"When my father and mother forsake me, the LORD will take me up.\" Every Mars Hill has an address, and God has it.",
      correctFeedbackEs: "Correcto. «Dios tenía mi dirección». Aun cuando el niño estaba durmiendo en el pavimento bajo un puente, Dios sabía dónde estaba. David dijo lo mismo en el Salmo 27: «cuando mi padre y mi madre me dejaren, Jehová me recogerá». Cada Areópago tiene una dirección, y Dios la tiene.",
      incorrectFeedbackEn: "The story is not about the American Dream, generic success, or urban economics. It is about THE GOSPEL FINDING THE FORGOTTEN. God has every Mars Hill address — even the addresses with no altars at all. The pastor preaches to people God already knows.",
      incorrectFeedbackEs: "La historia no se trata del sueño americano, ni del éxito genérico, ni de la economía urbana. Se trata del EVANGELIO ENCONTRANDO AL OLVIDADO. Dios tiene la dirección de cada Areópago — incluso las direcciones sin altares en absoluto. El pastor predica a personas que Dios ya conoce."
    },
    {
      textEn: "16. The lesson uses Genesis 22 (Abraham offering Isaac) as an example of:",
      textEs: "16. La lección usa Génesis 22 (Abraham ofreciendo a Isaac) como un ejemplo de:",
      optionsEn: ["A. A connection the Bible itself makes — the NT treats this story as a picture of the Father offering the Son; the pastor must not ignore this explicit link","B. A passage that should be skipped","C. A story about ancient Middle Eastern customs only","D. A passage with no christological connection"],
      optionsEs: ["A. Una conexión que la misma Biblia hace — el NT trata esta historia como un cuadro del Padre ofreciendo al Hijo; el pastor no debe ignorar este vínculo explícito","B. Un pasaje que debe saltarse","C. Una historia sobre las costumbres antiguas del Medio Oriente solamente","D. Un pasaje sin conexión cristológica"],
      correct: "A",
      correctFeedbackEn: "Correct. The NT explicitly treats Genesis 22 as Father-Son Calvary typology. Preaching it as merely a story of Abraham's faith — without the NT's framing — is the second error in Christ-tracking. The Spirit gave the map; the pastor must follow it.",
      correctFeedbackEs: "Correcto. El NT explícitamente trata Génesis 22 como tipología Padre-Hijo del Calvario. Predicarlo como meramente una historia de la fe de Abraham — sin el marco del NT — es el segundo error al rastrear a Cristo. El Espíritu dio el mapa; el pastor debe seguirlo.",
      incorrectFeedbackEn: "Genesis 22 should not be skipped, is not merely ancient custom, and has a CLEAR christological connection in the NT. The lesson uses it as the prime example of a connection the Bible ITSELF makes that the pastor must not ignore.",
      incorrectFeedbackEs: "Génesis 22 no debe saltarse, no es meramente costumbre antigua, y tiene una CLARA conexión cristológica en el NT. La lección lo usa como el ejemplo principal de una conexión que la Biblia MISMA hace y que el pastor no debe ignorar."
    },
    {
      textEn: "17. Numbers 21 (the bronze serpent in the wilderness) is connected to Christ by:",
      textEs: "17. Números 21 (la serpiente de bronce en el desierto) se conecta con Cristo por:",
      optionsEn: ["A. A medieval allegory","B. A pastor's personal interpretation","C. Jesus Himself in John 3:14 — \"as Moses lifted up the serpent in the wilderness, even so must the Son of Man be lifted up\"","D. A Reformation tradition"],
      optionsEs: ["A. Una alegoría medieval","B. La interpretación personal de un pastor","C. El mismo Jesús en Juan 3:14 — «como Moisés levantó la serpiente en el desierto, así es necesario que el Hijo del Hombre sea levantado»","D. Una tradición de la Reforma"],
      correct: "C",
      correctFeedbackEn: "Correct. The connection is not medieval allegory, personal interpretation, or Reformation tradition — it is JESUS HIMSELF in John 3:14. The Spirit recorded the link directly. The pastor who preaches Numbers 21 without quoting John 3:14 has chosen to ignore the connection Jesus made.",
      correctFeedbackEs: "Correcto. La conexión no es alegoría medieval, ni interpretación personal, ni tradición de la Reforma — es JESÚS MISMO en Juan 3:14. El Espíritu registró el vínculo directamente. El pastor que predica Números 21 sin citar Juan 3:14 ha escogido ignorar la conexión que Jesús hizo.",
      incorrectFeedbackEn: "The bronze serpent → Christ connection is not allegory, opinion, or tradition. JESUS HIMSELF made it explicit in John 3:14. The NT provides the typology; the pastor uses it. This is exactly the kind of biblical connection the lesson commands the pastor not to ignore.",
      incorrectFeedbackEs: "La conexión serpiente de bronce → Cristo no es alegoría, ni opinión, ni tradición. JESÚS MISMO la hizo explícita en Juan 3:14. El NT provee la tipología; el pastor la usa. Ésta es exactamente la clase de conexión bíblica que la lección manda al pastor no ignorar."
    },
    {
      textEn: "18. According to this lesson, the pastor's central task in tracking Christ on any given Sunday is to:",
      textEs: "18. Según esta lección, la tarea central del pastor al rastrear a Cristo en cualquier domingo dado es:",
      optionsEn: ["A. Find every detail that could symbolize Christ, however remote","B. Avoid the Old Testament entirely","C. Walk his people from wherever they sit on Mars Hill to the foot of the Resurrected One — using the four roads where applicable","D. Translate the original languages aloud"],
      optionsEs: ["A. Encontrar cada detalle que pudiera simbolizar a Cristo, por remoto que sea","B. Evitar el Antiguo Testamento completamente","C. Caminar a su pueblo desde donde sea que estén sentados en el Areópago hasta el pie del Resucitado — usando los cuatro caminos donde se aplique","D. Traducir los idiomas originales en voz alta"],
      correct: "C",
      correctFeedbackEn: "Correct. Begin where they are. End where He is. Use the four roads — promise, type, image, presence — where the text supports them. Hold both natures of Christ in view. Drive to the resurrection. That is Christ-centered preaching every Sunday.",
      correctFeedbackEs: "Correcto. Comience donde están. Termine donde Él está. Use los cuatro caminos — promesa, tipo, imagen, presencia — donde el texto los apoya. Tenga ambas naturalezas de Cristo a la vista. Vaya hasta la resurrección. Ésa es la predicación centrada en Cristo cada domingo.",
      incorrectFeedbackEn: "Forcing details, avoiding the OT, and reciting Greek are not the central task. The TASK is to WALK PEOPLE FROM MARS HILL TO THE RESURRECTED CHRIST — using the four roads where they apply, holding both natures in view, ending at the empty tomb.",
      incorrectFeedbackEs: "Forzar detalles, evitar el AT, y recitar griego no son la tarea central. La TAREA es CAMINAR A LA GENTE DE MARTE HILL AL CRISTO RESUCITADO — usando los cuatro caminos donde se aplican, teniendo ambas naturalezas a la vista, terminando en la tumba vacía."
    },
    {
      textEn: "19. The closing image of this unit — \"God had my address\" — teaches the pastor that:",
      textEs: "19. La imagen de cierre de esta unidad — «Dios tenía mi dirección» — le enseña al pastor que:",
      optionsEn: ["A. Postal services are spiritually significant","B. Genealogy research is a pastoral priority","C. Only those with stable addresses can be reached by the gospel","D. The God of the Bible knows every Mars Hill address — including the ones with no altars at all — and the whole Book points at the One who came to find them"],
      optionsEs: ["A. Los servicios postales son espiritualmente significativos","B. La investigación genealógica es una prioridad pastoral","C. Solo los que tienen direcciones estables pueden ser alcanzados por el evangelio","D. El Dios de la Biblia conoce la dirección de cada Areópago — incluyendo las que no tienen altares en absoluto — y todo el Libro apunta a Aquel que vino a encontrarlos"],
      correct: "D",
      correctFeedbackEn: "Correct. Some sitting in front of the pastor have wealthy altars. Some have no altars at all. The God of the Bible has every address. The whole Book has been pointing at the One who came to find them. The pastor's job is to put before them the Person every passage was pointing to all along.",
      correctFeedbackEs: "Correcto. Algunos sentados frente al pastor tienen altares acaudalados. Algunos no tienen altares en absoluto. El Dios de la Biblia tiene cada dirección. Todo el Libro ha estado apuntando a Aquel que vino a encontrarlos. El trabajo del pastor es poner ante ellos a la Persona a la que cada pasaje ha estado apuntando todo el tiempo.",
      incorrectFeedbackEn: "Postal services, genealogy, and stable addresses are not the point. The point is that GOD KNOWS EVERY MARS HILL ADDRESS — including the addresses of those sleeping under bridges with no altars at all. The whole Book points at the One who came to find them.",
      incorrectFeedbackEs: "Los servicios postales, la genealogía, y las direcciones estables no son el punto. El punto es que DIOS CONOCE LA DIRECCIÓN DE CADA MARTE HILL — incluyendo las direcciones de los que duermen bajo puentes sin altares en absoluto. Todo el Libro apunta a Aquel que vino a encontrarlos."
    },
    {
      textEn: "20. The closing charge of this unit to the pastor is:",
      textEs: "20. El encargo de cierre de esta unidad al pastor es:",
      optionsEn: ["A. Memorize the Pauline epistles","B. Begin where your people are; end where He is — track Christ through every text, because He had their address before they knew His name","C. Read only Acts on Sundays","D. Avoid speaking of the resurrection except at Easter"],
      optionsEs: ["A. Memorice las epístolas paulinas","B. Comience donde está su pueblo; termine donde Él está — rastree a Cristo a través de cada texto, porque Él tenía su dirección antes de que conocieran Su nombre","C. Lea solo Hechos los domingos","D. Evite hablar de la resurrección excepto en Pascua"],
      correct: "B",
      correctFeedbackEn: "Correct. Track Christ through your text this week and you will be doing in your pulpit what Paul did on the Areopagus. The whole Bible is one Christ-tracking story, and the pastor's job is to walk his people from wherever they stand to the foot of the Resurrected One.",
      correctFeedbackEs: "Correcto. Rastree a Cristo a través de su texto esta semana y estará haciendo en su púlpito lo que Pablo hizo en el Areópago. Toda la Biblia es una sola historia rastreando a Cristo, y el trabajo del pastor es caminar a su pueblo desde donde sea que estén parados hasta el pie del Resucitado.",
      incorrectFeedbackEn: "Memorization-only, Acts-only, and Easter-only resurrection preaching are not the closing charge. The CHARGE is to BEGIN WHERE THE PEOPLE ARE, END WHERE HE IS — track Christ through every text, every Sunday, because He had their address before they knew His name.",
      incorrectFeedbackEs: "La memorización solamente, Hechos solamente, y predicar la resurrección solo en Pascua no son el encargo de cierre. El ENCARGO es COMENZAR DONDE ESTÁ EL PUEBLO, TERMINAR DONDE ÉL ESTÁ — rastree a Cristo a través de cada texto, cada domingo, porque Él tenía su dirección antes de que conocieran Su nombre."
    }
  ];

const kwQuestions = [
    {
      textEn: "21. State the central thesis of this unit in your own words, and explain why every text in the Bible is part of one Christ-tracking story.",
      textEs: "21. Declare la tesis central de esta unidad con sus propias palabras, y explique por qué cada texto en la Biblia es parte de una sola historia rastreando a Cristo.",
      kw_en: ["whole", "Bible", "Christ", "tracking", "story", "every", "points", "one"],
      kw_es: ["toda", "Biblia", "Cristo", "rastrea", "historia", "cada", "apunta", "una"],
      modelEn: "The thesis of this unit is that the whole Bible is one Christ-tracking story: every text, in every book, finds its place in the single account that points to Him. From Genesis to Revelation the Scriptures track toward Christ, so the pastor's task is to find where any given passage stands in that one story and follow the line to Him.",
      modelEs: "La tesis de esta unidad es que toda la Biblia es una sola historia que rastrea a Cristo: cada texto, en cada libro, encuentra su lugar en el único relato que apunta a Él. De Génesis a Apocalipsis las Escrituras rastrean hacia Cristo, así que la tarea del pastor es hallar dónde se sitúa un pasaje en esa única historia y seguir la línea hasta Él."
    },
    {
      textEn: "22. Tell the story of Paul on Mars Hill (Acts 17), and explain how he moved his hostile audience from the altar of \"the unknown god\" to the risen Christ in a single sermon.",
      textEs: "22. Cuente la historia de Pablo en el Areópago (Hechos 17), y explique cómo movió a su audiencia hostil del altar al «dios no conocido» al Cristo resucitado en un solo sermón.",
      kw_en: ["Paul", "Athens", "Mars", "unknown", "god", "altar", "resurrection", "Christ"],
      kw_es: ["Pablo", "Atenas", "Marte", "desconocido", "dios", "altar", "resurrección", "Cristo"],
      modelEn: "In Athens Paul stood on Mars Hill among altars to every Greek god, including one inscribed 'to the unknown god.' He began where his hostile audience stood, with that altar, and moved them step by step to the God they did not know and to the risen Christ. In a single sermon he tracked from their own religion to the resurrection.",
      modelEs: "En Atenas Pablo se paró en la colina de Marte, el Areópago, entre altares a cada dios griego, incluido uno con la inscripción «al dios desconocido». Comenzó donde estaba su audiencia hostil, con ese altar, y los llevó paso a paso al Dios que no conocían y al Cristo resucitado. En un solo sermón rastreó desde su propia religión hasta la resurrección."
    },
    {
      textEn: "23. Explain Luke 24:27, what Jesus did on the road to Emmaus, and why this verse is the foundation for every Christ-centered sermon.",
      textEs: "23. Explique Lucas 24:27, lo que Jesús hizo en el camino a Emaús, y por qué este versículo es el fundamento para cada sermón centrado en Cristo.",
      kw_en: ["Emmaus", "Moses", "Prophets", "Scriptures", "Himself", "Christ", "expounded", "concerning"],
      kw_es: ["Emaús", "Moisés", "Profetas", "Escrituras", "Mismo", "Cristo", "expuso", "acerca"],
      modelEn: "Luke 24:27 is the foundation for every Christ-centered sermon. On the Emmaus road, beginning at Moses and all the Prophets, Jesus expounded in all the Scriptures the things concerning Himself. He shows that the Old Testament is about Him, so the preacher is authorized — and obligated — to track Christ through every passage as Jesus did.",
      modelEs: "Lucas 24:27 es el fundamento de todo sermón centrado en Cristo. En el camino a Emaús, comenzando por Moisés y todos los Profetas, Jesús expuso en todas las Escrituras las cosas acerca de Sí mismo. Muestra que el Antiguo Testamento trata de Él, así que el predicador está autorizado — y obligado — a rastrear a Cristo por cada pasaje como Jesús lo hizo."
    },
    {
      textEn: "24. Name and briefly describe the six movements of the Bible's macro-arc, and explain how knowing the arc helps the pastor place any single passage.",
      textEs: "24. Nombre y describa brevemente los seis movimientos del macroarco de la Biblia, y explique cómo conocer el arco ayuda al pastor a colocar cualquier pasaje individual.",
      kw_en: ["Creation", "Fall", "Israel", "Christ", "Church", "Consummation", "arc", "passage"],
      kw_es: ["Creación", "Caída", "Israel", "Cristo", "Iglesia", "Consumación", "arco", "pasaje"],
      modelEn: "The Bible's macro-arc has six movements: Creation, Fall, Israel, Christ, Church, and Consummation. Knowing this arc lets the pastor place any single passage on the storyline — is this before or after the Fall, in Israel's history, in Christ's coming, in the Church's age, or pointing to the Consummation? Locating the passage on the arc shows how it relates to Christ at the center.",
      modelEs: "El macro-arco de la Biblia tiene seis movimientos: Creación, Caída, Israel, Cristo, Iglesia y Consumación. Conocer este arco permite al pastor ubicar cualquier pasaje en la línea de la historia — ¿está antes o después de la Caída, en la historia de Israel, en la venida de Cristo, en la era de la Iglesia, o apuntando a la Consumación? Ubicar el pasaje en el arco muestra cómo se relaciona con Cristo en el centro."
    },
    {
      textEn: "25. Identify and briefly describe the four roads from any Old Testament passage to Christ.",
      textEs: "25. Identifique y describa brevemente los cuatro caminos desde cualquier pasaje del Antiguo Testamento a Cristo.",
      kw_en: ["promise", "type", "image", "presence", "fulfill", "prefigure", "appears", "Christ"],
      kw_es: ["promesa", "tipo", "imagen", "presencia", "cumple", "prefigura", "aparece", "Cristo"],
      modelEn: "There are four roads from any Old Testament passage to Christ. A passage may hold a promise He fulfills; it may give a type — a person or event that prefigures Him; it may carry an image of His character; or it may record His presence, where the pre-incarnate Christ actually appears. Ask which road connects the passage to Christ; most have at least one, none has none.",
      modelEs: "Hay cuatro caminos de cualquier pasaje del Antiguo Testamento a Cristo. Un pasaje puede contener una promesa que Él cumple; puede dar un tipo — una persona o evento que lo prefigura; puede llevar una imagen de Su carácter; o puede registrar Su presencia, donde el Cristo pre-encarnado realmente aparece. Pregunte qué camino conecta el pasaje con Cristo; la mayoría tiene al menos uno, ninguno no tiene ninguno."
    },
    {
      textEn: "26. Explain the \"As a man, but as God\" christological progression in your own words. Why must every Christ-centered sermon hold both natures in view at once?",
      textEs: "26. Explique la progresión cristológica «como hombre, pero como Dios» con sus propias palabras. ¿Por qué debe cada sermón centrado en Cristo tener ambas naturalezas a la vista a la vez?",
      kw_en: ["man", "God", "natures", "Person", "Christ", "both", "manger", "Bread"],
      kw_es: ["hombre", "Dios", "naturalezas", "Persona", "Cristo", "ambas", "pesebre", "Pan"],
      modelEn: "The 'As a man, but as God' progression holds both natures of Christ in view at once: as a man He was born in a manger, but as God He is the Everlasting One; as a man He hungered, but as God He is the Bread of Life; as a man He thirsted, but as God He is the Living Water. Every Christ-centered sermon must hold both natures together, for He is one Person, fully God and fully man.",
      modelEs: "La progresión «como hombre, pero como Dios» sostiene ambas naturalezas de Cristo a la vez: como hombre nació en un pesebre, pero como Dios es el Eterno; como hombre tuvo hambre, pero como Dios es el Pan de Vida; como hombre tuvo sed, pero como Dios es el Agua Viva. Todo sermón centrado en Cristo debe sostener ambas naturalezas juntas, porque Él es una sola Persona, plenamente Dios y plenamente hombre."
    },
    {
      textEn: "27. Name and briefly explain the three errors in Christ-tracking that the lesson warns against.",
      textEs: "27. Nombre y explique brevemente los tres errores al rastrear a Cristo contra los cuales la lección advierte.",
      kw_en: ["forcing", "ignoring", "skipping", "connection", "detail", "Old", "Testament", "Christ"],
      kw_es: ["forzar", "ignorar", "saltar", "conexión", "detalle", "Antiguo", "Testamento", "Cristo"],
      modelEn: "Three errors threaten Christ-tracking. Forcing — dragging Christ into a text by allegory where the connection is not really there. Ignoring — refusing to track Christ at all and preaching the Old Testament as mere morality. And skipping — leaping to Christ so fast that the details and original meaning of the passage are lost. The pastor must track Christ honestly, neither forcing nor ignoring nor skipping.",
      modelEs: "Tres errores amenazan el rastreo de Cristo. Forzar — arrastrar a Cristo a un texto por alegoría donde la conexión no está realmente. Ignorar — negarse a rastrear a Cristo y predicar el Antiguo Testamento como mera moral. Y saltar — brincar a Cristo tan rápido que se pierden los detalles y el significado original del pasaje. El pastor debe rastrear a Cristo con honestidad, sin forzar, ignorar ni saltar."
    },
    {
      textEn: "28. List the four steps of the Mars Hill preaching method, and briefly explain each.",
      textEs: "28. Enumere los cuatro pasos del método de predicación del Areópago, y explique brevemente cada uno.",
      kw_en: ["begin", "unknown", "introduce", "resurrection", "seeking", "Christ", "method", "response"],
      kw_es: ["comenzar", "desconocido", "presentar", "resurrección", "buscando", "Cristo", "método", "respuesta"],
      modelEn: "The Mars Hill method has four steps. Begin where the people are, with the altar to the unknown god they already have. Introduce the true God they are seeking without knowing. Track to the resurrection of Christ. And call for a response. Begin with what they know, track to who He is — a method any pastor can use to preach Christ in the public square.",
      modelEs: "El método del Areópago tiene cuatro pasos. Comenzar donde está la gente, con el altar al dios desconocido que ya tienen. Presentar al Dios verdadero que están buscando sin saberlo. Rastrear hasta la resurrección de Cristo. Y llamar a una respuesta. Comenzar con lo que conocen, rastrear hacia quién es Él — un método que cualquier pastor puede usar para predicar a Cristo en la plaza pública."
    },
    {
      textEn: "29. Describe the three responses to Paul's Mars Hill sermon, and explain why DELAY is named the most dangerous of the three.",
      textEs: "29. Describa las tres respuestas al sermón de Pablo en el Areópago, y explique por qué la DEMORA se nombra la más peligrosa de las tres.",
      kw_en: ["mocked", "delayed", "believed", "danger", "decision", "press", "response", "Paul"],
      kw_es: ["burlaron", "postergaron", "creyeron", "peligro", "decisión", "presionar", "respuesta", "demora"],
      modelEn: "Paul's Mars Hill sermon drew three responses: some mocked, some delayed saying 'we will hear you again,' and some believed. Delay is named the most dangerous, because the mocker may still be argued with and the believer is saved, but the one who delays feels he has made no decision when in fact he has — he postpones until the moment passes. The preacher must press for a decision now, not later.",
      modelEs: "El sermón de Pablo en el Areópago provocó tres respuestas: algunos se burlaron, algunos postergaron diciendo «te oiremos otra vez», y algunos creyeron. La demora es la más peligrosa, porque al burlador todavía se le puede argumentar y el creyente es salvo, pero el que posterga siente que no ha tomado ninguna decisión cuando en realidad sí — la aplaza hasta que el momento pasa. El predicador debe presionar por una decisión ahora, no después."
    },
    {
      textEn: "30. Tell the story of the homeless boy who became a pastor (as told in this lesson) and explain the closing image \"God had my address\" — what does this teach the pastor about preaching to a Mars Hill that has no altars at all?",
      textEs: "30. Cuente la historia del niño sin hogar que se volvió pastor (como se relata en esta lección) y explique la imagen de cierre «Dios tenía mi dirección» — ¿qué le enseña esto al pastor sobre predicar a un Areópago que no tiene altares en absoluto?",
      kw_en: ["abandon", "homeless", "bridge", "God", "address", "preached", "Mars", "lost"],
      kw_es: ["abandon", "hogar", "puente", "Dios", "dirección", "predicaba", "perdido", "Areópago"],
      modelEn: "The boy in the story was abandoned, homeless, sleeping under a bridge and studying by a 7-Eleven light, yet within thirteen years he preached to fifteen hundred people. Looking back he said, 'God had my address' — God knew where to find him even with no home. The lesson is that the pastor preaches to a Mars Hill with no altars at all, trusting that God already has the address of every lost hearer.",
      modelEs: "El niño de la historia fue abandonado, sin hogar, durmiendo bajo un puente y estudiando a la luz de un 7-Eleven, y sin embargo en trece años predicaba a mil quinientas personas. Mirando atrás dijo: «Dios tenía mi dirección» — Dios sabía dónde encontrarlo aun sin hogar. La lección es que el pastor predica a un Areópago sin altares, confiando en que Dios ya tiene la dirección de cada oyente perdido."
    }
  ];
