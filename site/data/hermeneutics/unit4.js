/* CTSHermeneutics - unit 4: per-unit configuration and content. */

const UNIT = 4;

const NEXT_UNIT_URL = "CTSHermeneuticsUnit5.html";

const PREV_UNIT_URL = "CTSHermeneuticsUnit3.html";

const IS_FINAL_UNIT = false;

const SHOW_REGISTRATION = false;

const mcQuestions = [
    {
      textEn: "1. The West Side Baptist Church gas-leak story (Beatrice, Nebraska, 1950) is used in this lesson to illustrate:",
      textEs: "1. La historia de la fuga de gas en la Iglesia Bautista del Lado Oeste (Beatrice, Nebraska, 1950) se usa en esta lección para ilustrar:",
      optionsEn: ["A. Why churches need fire insurance","B. The danger of antiquated furnaces","C. How context — many small events read together — changes the meaning of each","D. The importance of choir practice"],
      optionsEs: ["A. Por qué las iglesias necesitan seguro contra incendios","B. El peligro de las calderas antiguas","C. Cómo el contexto — muchos eventos pequeños leídos juntos — cambia el significado de cada uno","D. La importancia de los ensayos del coro"],
      correct: "C",
      correctFeedbackEn: "Correct. Take any one of the 18 delays alone and it means nothing. Read them together and you see God's providence. Same with Bible verses: pulled out of context they can mean almost anything; read in context they say what the Author intended.",
      correctFeedbackEs: "Correcto. Tome cualquiera de los 18 retrasos por sí solo y no significa nada. Léalos juntos y verá la providencia de Dios. Lo mismo con los versículos bíblicos: sacados de contexto pueden significar casi cualquier cosa; leídos en contexto dicen lo que el Autor quiso.",
      incorrectFeedbackEn: "The story is not about insurance, equipment failure, or attendance. The 18 small delays only become meaningful when read TOGETHER — that is the point. Context is what changes the meaning of each event, and of each Bible verse.",
      incorrectFeedbackEs: "La historia no se trata de seguros, fallas de equipo, ni asistencia. Los 18 pequeños retrasos solo se vuelven significativos cuando se leen JUNTOS — ése es el punto. El contexto es lo que cambia el significado de cada evento, y de cada versículo bíblico."
    },
    {
      textEn: "2. The lesson names five layers of context the pastor must honor. They are:",
      textEs: "2. La lección nombra cinco capas de contexto que el pastor debe honrar. Son:",
      optionsEn: ["A. Greek, Hebrew, Aramaic, Latin, English","B. Immediate, book, historical, cultural, canonical","C. Past, present, future, eternal, ecclesial","D. Spiritual, literal, allegorical, moral, anagogical"],
      optionsEs: ["A. Griego, hebreo, arameo, latín, inglés","B. Inmediato, del libro, histórico, cultural, canónico","C. Pasado, presente, futuro, eterno, eclesial","D. Espiritual, literal, alegórico, moral, anagógico"],
      correct: "B",
      correctFeedbackEn: "Correct. Each frame surrounds the verse: the paragraph (immediate), the whole book, the historical moment, the cultural world, and the rest of Scripture (canonical). All five must hang square before the sermon is nailed up.",
      correctFeedbackEs: "Correcto. Cada marco rodea el versículo: el párrafo (inmediato), el libro entero, el momento histórico, el mundo cultural, y el resto de la Escritura (canónico). Los cinco deben colgar rectos antes de clavar el sermón.",
      incorrectFeedbackEn: "The five layers of context taught here are practical exegetical frames: IMMEDIATE (paragraph), BOOK, HISTORICAL, CULTURAL, and CANONICAL. Each is a frame the pastor must check before preaching.",
      incorrectFeedbackEs: "Las cinco capas de contexto enseñadas aquí son marcos exegéticos prácticos: INMEDIATO (párrafo), del LIBRO, HISTÓRICO, CULTURAL, y CANÓNICO. Cada uno es un marco que el pastor debe revisar antes de predicar."
    },
    {
      textEn: "3. The hardest word a pastor must say to himself before Sunday, according to this lesson, is:",
      textEs: "3. La palabra más dura que un pastor debe decirse a sí mismo antes del domingo, según esta lección, es:",
      optionsEn: ["A. Pray","B. Wait","C. Read","D. Write"],
      optionsEs: ["A. Ora","B. Espera","C. Lee","D. Escribe"],
      correct: "B",
      correctFeedbackEn: "Correct. Wait before applying. Wait before quoting. Wait before turning the page. Context demands patience. Skip any frame and you risk preaching a sentence the Author never said.",
      correctFeedbackEs: "Correcto. Espera antes de aplicar. Espera antes de citar. Espera antes de pasar la página. El contexto exige paciencia. Sáltese cualquier marco y se arriesga a predicar una frase que el Autor nunca dijo.",
      incorrectFeedbackEn: "Prayer, reading, and writing are essential pastoral disciplines — but the HARDEST word is WAIT. The pastor who hurries past context preaches what the verse never said.",
      incorrectFeedbackEs: "La oración, la lectura, y la escritura son disciplinas pastorales esenciales — pero la palabra más DURA es ESPERA. El pastor que pasa apresuradamente sobre el contexto predica lo que el versículo nunca dijo."
    },
    {
      textEn: "4. Jeremiah 29:11 is used in this lesson as an example of:",
      textEs: "4. Jeremías 29:11 se usa en esta lección como ejemplo de:",
      optionsEn: ["A. A verse honored in immediate context teaches very different things than the same verse lifted out","B. A passage that has no historical setting","C. A verse that means the same thing in any context","D. A verse that should never be quoted"],
      optionsEs: ["A. Un versículo honrado en su contexto inmediato enseña cosas muy distintas que el mismo versículo sacado fuera","B. Un pasaje que no tiene contexto histórico","C. Un versículo que significa lo mismo en cualquier contexto","D. Un versículo que nunca debe citarse"],
      correct: "A",
      correctFeedbackEn: "Correct. In context, Jeremiah 29:11 is given to exiles facing 70 more years of captivity — a promise to their grandchildren. Out of context, it becomes a prosperity-gospel slogan. Same words; two different verses; only one is what God said.",
      correctFeedbackEs: "Correcto. En contexto, Jeremías 29:11 es dado a exiliados que enfrentan 70 años más de cautiverio — una promesa para sus nietos. Fuera de contexto, se vuelve un eslogan del evangelio de la prosperidad. Las mismas palabras; dos versículos distintos; solo uno es lo que Dios dijo.",
      incorrectFeedbackEn: "Jeremiah 29:11 absolutely has a historical setting (Babylonian exile), the immediate context matters intensely, and the verse is glorious when properly handled. The lesson uses it as Exhibit A for how context transforms meaning.",
      incorrectFeedbackEs: "Jeremías 29:11 ciertamente tiene un contexto histórico (el exilio babilónico), el contexto inmediato importa intensamente, y el versículo es glorioso cuando se maneja correctamente. La lección lo usa como muestra principal de cómo el contexto transforma el significado."
    },
    {
      textEn: "5. In its immediate context, Jeremiah 29:11 was originally addressed to:",
      textEs: "5. En su contexto inmediato, Jeremías 29:11 fue dirigido originalmente a:",
      optionsEn: ["A. New Testament believers in Asia Minor","B. Jewish exiles in Babylon facing seventy more years of captivity","C. The Twelve Apostles","D. The early Roman church"],
      optionsEs: ["A. Creyentes neotestamentarios en Asia Menor","B. Exiliados judíos en Babilonia que enfrentaban setenta años más de cautiverio","C. Los Doce Apóstoles","D. La iglesia romana primitiva"],
      correct: "B",
      correctFeedbackEn: "Correct. Two verses earlier, God tells the exiles through Jeremiah that they will be in captivity for seventy years. Most will die in a foreign land. The promise of peace is for the long haul — and largely for their grandchildren.",
      correctFeedbackEs: "Correcto. Dos versículos antes, Dios les dice a los exiliados por medio de Jeremías que estarán en cautiverio durante setenta años. La mayoría morirá en tierra extraña. La promesa de paz es para el largo plazo — y en gran parte para sus nietos.",
      incorrectFeedbackEn: "Jeremiah wrote in the early 6th century B.C. — long before any New Testament audience. His letter (Jeremiah 29) was sent to Jewish exiles in Babylon. Read 29:1-10 and the context of the promise becomes unmistakable.",
      incorrectFeedbackEs: "Jeremías escribió a principios del siglo VI a.C. — mucho antes de cualquier audiencia neotestamentaria. Su carta (Jeremías 29) fue enviada a exiliados judíos en Babilonia. Lea 29:1-10 y el contexto de la promesa se vuelve inconfundible."
    },
    {
      textEn: "6. The lesson says the book of Esther is unusual because:",
      textEs: "6. La lección dice que el libro de Ester es inusual porque:",
      optionsEn: ["A. It is the only book written in Persian","B. It is the only book with two endings","C. The name of God is never mentioned in it","D. It is the shortest book of the Old Testament"],
      optionsEs: ["A. Es el único libro escrito en persa","B. Es el único libro con dos finales","C. El nombre de Dios nunca se menciona en él","D. Es el libro más corto del Antiguo Testamento"],
      correct: "C",
      correctFeedbackEn: "Correct. The name of God appears nowhere in Esther. No prayer, no temple, no priest, no sacrifice. The whole book teaches what God does when He says nothing — His silent providence behind the scenes. This is its book-context message.",
      correctFeedbackEs: "Correcto. El nombre de Dios no aparece en ninguna parte de Ester. No hay oración, no hay templo, no hay sacerdote, no hay sacrificio. El libro entero enseña lo que Dios hace cuando no dice nada — Su providencia silenciosa tras bambalinas. Éste es su mensaje a nivel del libro.",
      incorrectFeedbackEn: "Esther was written in Hebrew, has one ending, and is not the shortest OT book. Its distinctive feature is the absence of God's name — a literary silence that becomes the very point of the book.",
      incorrectFeedbackEs: "Ester fue escrito en hebreo, tiene un solo final, y no es el libro más corto del AT. Su característica distintiva es la ausencia del nombre de Dios — un silencio literario que se vuelve el punto mismo del libro."
    },
    {
      textEn: "7. Reading Esther at the level of book context reveals its main theme to be:",
      textEs: "7. Leer Ester al nivel del contexto del libro revela que su tema principal es:",
      optionsEn: ["A. The silent God is still the providential God","B. The duty of beauty contests","C. The political history of Persia","D. The proper protocols for courtroom drama"],
      optionsEs: ["A. El Dios silencioso sigue siendo el Dios providente","B. El deber de los concursos de belleza","C. La historia política de Persia","D. Los protocolos apropiados para el drama judicial"],
      correct: "A",
      correctFeedbackEn: "Correct. Read in isolation, Esther looks like court intrigue. Read as a whole book, it teaches God's scattered people that their silent God is still their providential God. That is the book context.",
      correctFeedbackEs: "Correcto. Leído aislado, Ester parece intriga palaciega. Leído como libro entero, enseña al pueblo disperso de Dios que su Dios silencioso sigue siendo su Dios providente. Ése es el contexto del libro.",
      incorrectFeedbackEn: "Esther's main theme is not pageantry, Persian history, or legal procedure. The book is about God's silent, providential rule over events — caring for His people even when His name is never spoken aloud.",
      incorrectFeedbackEs: "El tema principal de Ester no son los desfiles, la historia persa, ni el procedimiento legal. El libro trata del gobierno silencioso y providente de Dios sobre los eventos — cuidando a Su pueblo aun cuando Su nombre nunca se pronuncia."
    },
    {
      textEn: "8. In the historical context of Esther, who was Haman?",
      textEs: "8. En el contexto histórico de Ester, ¿quién era Amán?",
      optionsEn: ["A. A Babylonian general","B. The brother of King Xerxes","C. A descendant of the Amalekites — Israel's ancient enemy","D. A converted Jew who had turned against his people"],
      optionsEs: ["A. Un general babilonio","B. El hermano del rey Asuero","C. Un descendiente de los amalecitas — el antiguo enemigo de Israel","D. Un judío convertido que se había vuelto contra su pueblo"],
      correct: "C",
      correctFeedbackEn: "Correct. Haman descended from the Amalekites — the tribe that opposed Israel a thousand years earlier near Sinai. Once you know the history, his plot is not random villainy; it is one more chapter in an ancient war.",
      correctFeedbackEs: "Correcto. Amán descendía de los amalecitas — la tribu que se opuso a Israel mil años antes cerca de Sinaí. Una vez que usted conoce la historia, su complot no es maldad al azar; es un capítulo más en una guerra antigua.",
      incorrectFeedbackEn: "Haman was neither Babylonian, a brother of Xerxes, nor a Jew. He was AN AMALEKITE — and that ancestry matters enormously, because Israel and the Amalekites had been at war for a thousand years before Esther's day.",
      incorrectFeedbackEs: "Amán no era babilonio, ni hermano de Asuero, ni judío. Era un AMALECITA — y esa ascendencia importa enormemente, porque Israel y los amalecitas habían estado en guerra durante mil años antes de los días de Ester."
    },
    {
      textEn: "9. According to the lesson, Esther's cultural context (Persian court protocol) gives weight to which famous line in her story?",
      textEs: "9. Según la lección, el contexto cultural de Ester (el protocolo de la corte persa) le da peso a cuál línea famosa de su historia:",
      optionsEn: ["A. \"I will go in to the king, and if I perish, I perish\"","B. \"Behold the Lamb of God who takes away the sin of the world\"","C. \"In the beginning was the Word\"","D. \"The fear of the Lord is the beginning of wisdom\""],
      optionsEs: ["A. «Entraré al rey, y si perezco, que perezca»","B. «He aquí el Cordero de Dios que quita el pecado del mundo»","C. «En el principio era la Palabra»","D. «El temor de Jehová es el principio de la sabiduría»"],
      correct: "A",
      correctFeedbackEn: "Correct. In Persian court protocol, even the queen risked death entering uninvited. The modern reader hears \"if I perish, I perish\" as dramatic. The original reader knew Esther meant it literally. Cultural context restores the weight.",
      correctFeedbackEs: "Correcto. En el protocolo de la corte persa, aun la reina arriesgaba la muerte al entrar sin invitación. El lector moderno oye «si perezco, que perezca» como dramático. El lector original sabía que Ester lo decía literalmente. El contexto cultural restaura el peso.",
      incorrectFeedbackEn: "All four lines are biblical, but only Esther's \"if I perish, I perish\" sits inside Persian court culture. Court protocol made unsummoned entrance a capital risk — and Esther's line meant exactly what it said.",
      incorrectFeedbackEs: "Las cuatro líneas son bíblicas, pero solo el «si perezco, que perezca» de Ester se ubica dentro de la cultura de la corte persa. El protocolo de la corte hacía que la entrada sin convocatoria fuera un riesgo capital — y la línea de Ester significaba exactamente lo que decía."
    },
    {
      textEn: "10. The lesson explains the king's sleepless night and the reading of the royal chronicles (Esther 6) by appealing to:",
      textEs: "10. La lección explica la noche de insomnio del rey y la lectura de las crónicas reales (Ester 6) apelando a:",
      optionsEn: ["A. Random coincidence in the storytelling","B. A late addition to the book by Persian editors","C. Persian cultural custom — kings often had clerks read records aloud as a sleep aid","D. A symbol of Babylonian astrology"],
      optionsEs: ["A. Una coincidencia al azar en la narración","B. Una adición tardía al libro por editores persas","C. La costumbre cultural persa — los reyes muchas veces hacían que los escribas leyeran registros en voz alta como remedio para dormir","D. Un símbolo de la astrología babilónica"],
      correct: "C",
      correctFeedbackEn: "Correct. To us a sleepless king reading chronicles seems quirky. To a Persian, it was routine — kings often had records read aloud to help them sleep. Cultural context turns what looks like coincidence into routine palace habit — and God's providence within it.",
      correctFeedbackEs: "Correcto. Para nosotros un rey insomne leyendo crónicas parece extraño. Para un persa, era rutinario — los reyes muchas veces hacían que les leyeran registros en voz alta para ayudarles a dormir. El contexto cultural convierte lo que parece coincidencia en costumbre palaciega rutinaria — y la providencia de Dios dentro de ella.",
      incorrectFeedbackEn: "The scene is neither random coincidence, a late addition, nor a Babylonian symbol. Persian kings routinely had the royal chronicles read aloud as a sleep aid. Once you know the culture, the scene shifts from accident to providence.",
      incorrectFeedbackEs: "La escena no es ni una coincidencia al azar, ni una adición tardía, ni un símbolo babilonio. Los reyes persas rutinariamente hacían que les leyeran las crónicas reales como remedio para dormir. Una vez que usted conoce la cultura, la escena pasa de accidente a providencia."
    },
    {
      textEn: "11. The canonical-context promise that runs underneath the whole book of Esther is:",
      textEs: "11. La promesa de contexto canónico que corre por debajo de todo el libro de Ester es:",
      optionsEn: ["A. The Sermon on the Mount","B. The Abrahamic covenant in Genesis 12 — \"I will curse him who curses you\"","C. The Davidic covenant in 2 Samuel 7","D. The New Covenant in Jeremiah 31"],
      optionsEs: ["A. El Sermón del Monte","B. El pacto abrahámico en Génesis 12 — «a los que te maldijeren maldeciré»","C. El pacto davídico en 2 Samuel 7","D. El Nuevo Pacto en Jeremías 31"],
      correct: "B",
      correctFeedbackEn: "Correct. Genesis 12:3 — \"I will curse him who curses you.\" Haman curses Abraham's people; Haman swings from his own gallows. The covenant operates silently through the entire book. Canonical context reveals it.",
      correctFeedbackEs: "Correcto. Génesis 12:3 — «a los que te maldijeren maldeciré». Amán maldice al pueblo de Abraham; Amán se balancea en su propia horca. El pacto opera silenciosamente a lo largo del libro entero. El contexto canónico lo revela.",
      incorrectFeedbackEn: "All four are real biblical covenants or texts, but only the ABRAHAMIC covenant (Genesis 12:3) directly drives Esther. \"I will curse him who curses you\" is fulfilled before our eyes when Haman dies on his own gallows.",
      incorrectFeedbackEs: "Los cuatro son pactos o textos bíblicos reales, pero solo el pacto ABRAHÁMICO (Génesis 12:3) impulsa directamente a Ester. «A los que te maldijeren maldeciré» se cumple ante nuestros ojos cuando Amán muere en su propia horca."
    },
    {
      textEn: "12. The lesson calls the distinction between what people can see and what only God sees:",
      textEs: "12. La lección llama a la distinción entre lo que la gente puede ver y lo que solo Dios ve:",
      optionsEn: ["A. Type and antitype","B. Letter and spirit","C. Lower story and upper story","D. Form and function"],
      optionsEs: ["A. Tipo y antitipo","B. Letra y espíritu","C. Historia de abajo e historia de arriba","D. Forma y función"],
      correct: "C",
      correctFeedbackEn: "Correct. The lower story is what the palace can see (insomnia, courage, ambition); the upper story is what God sees from above (a covenant keeping itself). Both are real. The pastor preaches both — neither moralism alone nor abstraction alone.",
      correctFeedbackEs: "Correcto. La historia de abajo es lo que el palacio puede ver (insomnio, valor, ambición); la historia de arriba es lo que Dios ve desde arriba (un pacto que se cumple a sí mismo). Ambas son reales. El pastor predica ambas — ni solo moralismo ni solo abstracción.",
      incorrectFeedbackEn: "The distinction in this lesson is the LOWER STORY (what the human characters and witnesses see) and the UPPER STORY (what God alone sees and is doing). Both must be preached together if the sermon is to do justice to the text.",
      incorrectFeedbackEs: "La distinción en esta lección es la HISTORIA DE ABAJO (lo que los personajes humanos y los testigos ven) y la HISTORIA DE ARRIBA (lo que solo Dios ve y está haciendo). Ambas deben predicarse juntas para que el sermón haga justicia al texto."
    },
    {
      textEn: "13. According to this lesson, a pastor who preaches only the lower story produces:",
      textEs: "13. Según esta lección, un pastor que predica solo la historia de abajo produce:",
      optionsEn: ["A. Mysticism — God removed from real events","B. Doctrinal abstraction","C. Apologetic argument","D. Moralism — \"be brave like Esther\""],
      optionsEs: ["A. Misticismo — Dios alejado de eventos reales","B. Abstracción doctrinal","C. Argumento apologético","D. Moralismo — «sea valiente como Ester»"],
      correct: "D",
      correctFeedbackEn: "Correct. Lower-story-only preaching turns every Bible story into a life lesson stripped of God's plan. Be brave like Esther. Be wise like Solomon. Be patient like Job. Helpful, but flat — God Himself drops out of the picture.",
      correctFeedbackEs: "Correcto. La predicación de solo la historia de abajo convierte cada historia bíblica en una lección de vida despojada del plan de Dios. Sea valiente como Ester. Sea sabio como Salomón. Sea paciente como Job. Útil, pero plano — Dios mismo desaparece del cuadro.",
      incorrectFeedbackEn: "Lower-story-only preaching does not produce mysticism, abstraction, or apologetics. It produces MORALISM: extracting life lessons from biblical narratives without God's overarching purpose. \"Be brave like Esther\" — without saying why God put her there.",
      incorrectFeedbackEs: "La predicación de solo la historia de abajo no produce misticismo, ni abstracción, ni apologética. Produce MORALISMO: extraer lecciones de vida de las narraciones bíblicas sin el propósito general de Dios. «Sea valiente como Ester» — sin decir por qué Dios la puso allí."
    },
    {
      textEn: "14. According to this lesson, a pastor who preaches only the upper story produces:",
      textEs: "14. Según esta lección, un pastor que predica solo la historia de arriba produce:",
      optionsEn: ["A. Comedy","B. Personal application","C. Historical research","D. Abstraction — God's sovereignty as a doctrine without a face"],
      optionsEs: ["A. Comedia","B. Aplicación personal","C. Investigación histórica","D. Abstracción — la soberanía de Dios como doctrina sin rostro"],
      correct: "D",
      correctFeedbackEn: "Correct. Upper-story-only preaching reduces God's action to doctrine without flesh-and-blood human characters. The pastor must preach both stories: the lower so the people can recognize their own lives, the upper so they can recognize God's hand.",
      correctFeedbackEs: "Correcto. La predicación de solo la historia de arriba reduce la acción de Dios a doctrina sin personajes humanos de carne y hueso. El pastor debe predicar ambas historias: la de abajo para que la gente reconozca sus propias vidas, la de arriba para que reconozca la mano de Dios.",
      incorrectFeedbackEn: "Upper-story-only preaching is ABSTRACTION — God's plan without the human face of His people. Esther disappears; only sovereignty remains. The pastor must hold the two together: the upper story embedded in the lower.",
      incorrectFeedbackEs: "La predicación de solo la historia de arriba es ABSTRACCIÓN — el plan de Dios sin el rostro humano de Su pueblo. Ester desaparece; solo queda la soberanía. El pastor debe sostener las dos juntas: la historia de arriba dentro de la de abajo."
    },
    {
      textEn: "15. Mordecai's famous line to Esther — \"Who knows whether you have come to the kingdom for such a time as this?\" — illustrates:",
      textEs: "15. La famosa línea de Mardoqueo a Ester — «¿y quién sabe si para esta hora has llegado al reino?» — ilustra:",
      optionsEn: ["A. Preaching the upper story into the lower","B. The doctrine of predestination","C. A purely human pep talk","D. Persian political philosophy"],
      optionsEs: ["A. Predicar la historia de arriba dentro de la de abajo","B. La doctrina de la predestinación","C. Una arenga puramente humana","D. La filosofía política persa"],
      correct: "A",
      correctFeedbackEn: "Correct. Mordecai cannot prove God is acting — the book never lets us see God's face. But he names the upper story inside the lower-story situation. He preaches it into the moment, and Esther rises to it. So must we.",
      correctFeedbackEs: "Correcto. Mardoqueo no puede probar que Dios está actuando — el libro nunca nos deja ver el rostro de Dios. Pero nombra la historia de arriba dentro de la situación de la historia de abajo. La predica al momento, y Ester se levanta a ella. Así debemos hacerlo nosotros.",
      incorrectFeedbackEn: "Mordecai is not delivering a doctrinal lecture, a flat pep talk, or political philosophy. He is naming God's invisible purpose IN the moment of crisis — preaching the upper story (providence) into the lower story (danger).",
      incorrectFeedbackEs: "Mardoqueo no está dando una conferencia doctrinal, ni una arenga plana, ni filosofía política. Está nombrando el propósito invisible de Dios EN el momento de crisis — predicando la historia de arriba (providencia) dentro de la historia de abajo (peligro)."
    },
    {
      textEn: "16. The lesson names four serious errors that the discipline of context saves the pastor from. They are:",
      textEs: "16. La lección nombra cuatro errores serios de los cuales la disciplina del contexto salva al pastor. Son:",
      optionsEn: ["A. Proof-texting, moralizing, chronological flattening, cultural projection","B. Greek, Hebrew, Aramaic, Latin","C. Insomnia, anxiety, doubt, pride","D. Allegory, typology, prophecy, parable"],
      optionsEs: ["A. Uso de versículos como prueba, moralismo, aplanamiento cronológico, proyección cultural","B. Griego, hebreo, arameo, latín","C. Insomnio, ansiedad, duda, orgullo","D. Alegoría, tipología, profecía, parábola"],
      correct: "A",
      correctFeedbackEn: "Correct. Proof-texting (lifting verses out of their argument). Moralizing (stripping a story of God's plan). Chronological flattening (treating Sinai commands as if they were given to your church today). Cultural projection (reading our customs back into theirs).",
      correctFeedbackEs: "Correcto. Uso de versículos como prueba (sacar versículos de su argumento). Moralismo (despojar una historia del plan de Dios). Aplanamiento cronológico (tratar mandamientos del Sinaí como si fueran dados a su iglesia hoy). Proyección cultural (leer nuestras costumbres dentro de las suyas).",
      incorrectFeedbackEn: "The four errors the lesson names are all failures of CONTEXT: proof-texting (ignoring immediate context), moralizing (ignoring book context), chronological flattening (ignoring historical context), cultural projection (ignoring cultural context).",
      incorrectFeedbackEs: "Los cuatro errores que la lección nombra son todos fallas de CONTEXTO: uso como prueba (ignorar el contexto inmediato), moralismo (ignorar el contexto del libro), aplanamiento cronológico (ignorar el contexto histórico), proyección cultural (ignorar el contexto cultural)."
    },
    {
      textEn: "17. The error of \"chronological flattening\" refers to:",
      textEs: "17. El error del «aplanamiento cronológico» se refiere a:",
      optionsEn: ["A. Ignoring the order of New Testament books","B. Reading the Bible too quickly","C. Skipping over genealogies","D. Treating commands given to Israel in the wilderness as if given directly to a modern congregation"],
      optionsEs: ["A. Ignorar el orden de los libros del Nuevo Testamento","B. Leer la Biblia demasiado rápido","C. Saltarse las genealogías","D. Tratar mandamientos dados a Israel en el desierto como si fueran dados directamente a una congregación moderna"],
      correct: "D",
      correctFeedbackEn: "Correct. Some commands were given to Israel under the law of Moses, others to the church under the new covenant. Treating them as flat — every command equally direct to every audience — collapses redemptive history and produces confusion.",
      correctFeedbackEs: "Correcto. Algunos mandamientos fueron dados a Israel bajo la ley de Moisés, otros a la iglesia bajo el nuevo pacto. Tratarlos como planos — cada mandamiento igualmente directo a cada audiencia — colapsa la historia redentiva y produce confusión.",
      incorrectFeedbackEn: "Chronological flattening is not about NT book order, reading speed, or genealogies. It is the error of treating Old Testament commands (given to Israel) as if they were given directly to a modern congregation without considering covenantal progression.",
      incorrectFeedbackEs: "El aplanamiento cronológico no se trata del orden de los libros del NT, la velocidad de lectura, ni las genealogías. Es el error de tratar los mandamientos del Antiguo Testamento (dados a Israel) como si fueran dados directamente a una congregación moderna sin considerar la progresión del pacto."
    },
    {
      textEn: "18. The cure for the cult-twist of Bible verses (Mormons, JWs, prosperity teachers all using the same words to mean different things) is:",
      textEs: "18. La cura para el giro de las sectas que tuercen los versículos bíblicos (Mormones, Testigos de Jehová, predicadores de prosperidad, todos usando las mismas palabras para significar cosas distintas) es:",
      optionsEn: ["A. Ban modern Bible translations","B. Honor the five frames of context — every Bible verse lives inside its paragraph, book, history, culture, and canon","C. Memorize only the New Testament","D. Avoid all evangelism"],
      optionsEs: ["A. Prohibir las traducciones bíblicas modernas","B. Honrar los cinco marcos del contexto — cada versículo bíblico vive dentro de su párrafo, libro, historia, cultura, y canon","C. Memorizar solo el Nuevo Testamento","D. Evitar toda evangelización"],
      correct: "B",
      correctFeedbackEn: "Correct. Cults speak fluent Bible. The defense is not to retreat from Scripture but to honor it more deeply — the five frames of context hold each verse in place, against every twister who quotes verses out of their setting.",
      correctFeedbackEs: "Correcto. Las sectas hablan Biblia con fluidez. La defensa no es retirarse de la Escritura sino honrarla más profundamente — los cinco marcos del contexto sostienen cada versículo en su lugar, contra cualquier torcedor que cite versículos fuera de su entorno.",
      incorrectFeedbackEn: "Banning translations, restricting Scripture, or avoiding evangelism are all retreats. The cure for cult-twisting is MORE Bible, more carefully read: honor every layer of context, and the verses cannot be made to say what they were never meant to say.",
      incorrectFeedbackEs: "Prohibir traducciones, restringir la Escritura, o evitar la evangelización son todas retiradas. La cura para el giro de las sectas es MÁS Biblia, leída con más cuidado: honre cada capa de contexto, y los versículos no pueden hacerse decir lo que nunca debieron decir."
    },
    {
      textEn: "19. The lesson's practical weekly schedule places \"trace the canonical thread\" on which day?",
      textEs: "19. El horario semanal práctico de la lección coloca «trazar el hilo canónico» en qué día:",
      optionsEn: ["A. Monday","B. Tuesday","C. Wednesday","D. Friday"],
      optionsEs: ["A. Lunes","B. Martes","C. Miércoles","D. Viernes"],
      correct: "D",
      correctFeedbackEn: "Correct. Monday: immediate context. Tuesday: whole book. Wednesday: historical setting. Thursday: cultural details. Friday: canonical thread — what earlier Scripture stands behind, what later Scripture refers back. Saturday is for the sermon.",
      correctFeedbackEs: "Correcto. Lunes: contexto inmediato. Martes: libro entero. Miércoles: contexto histórico. Jueves: detalles culturales. Viernes: hilo canónico — qué Escritura anterior está detrás, qué Escritura posterior se refiere. El sábado es para el sermón.",
      incorrectFeedbackEn: "The weekly schedule walks outward through the five frames: Monday immediate, Tuesday book, Wednesday historical, Thursday cultural, FRIDAY canonical. Saturday is reserved for the sermon, once all five frames hang square.",
      incorrectFeedbackEs: "El horario semanal recorre los cinco marcos hacia afuera: lunes inmediato, martes libro, miércoles histórico, jueves cultural, VIERNES canónico. El sábado se reserva para el sermón, una vez que los cinco marcos cuelgan rectos."
    },
    {
      textEn: "20. The closing image of this lesson is:",
      textEs: "20. La imagen de cierre de esta lección es:",
      optionsEn: ["A. The pastor as a king who rules over his text","B. The pastor as a soldier who fights to the end","C. The pastor as a builder whose work will be tested by fire","D. The same Hand that saved the choir at West Side Baptist works through five small disciplines across one Bible week"],
      optionsEs: ["A. El pastor como un rey que reina sobre su texto","B. El pastor como un soldado que pelea hasta el final","C. El pastor como un edificador cuya obra será probada por el fuego","D. La misma Mano que salvó al coro en la Bautista del Lado Oeste obra a través de cinco pequeñas disciplinas a lo largo de una semana bíblica"],
      correct: "D",
      correctFeedbackEn: "Correct. The choir was saved by fifteen small interruptions on a single night. Your congregation will be saved by five small disciplines across one Bible week. The same Hand is at work — quiet, providential, contextual.",
      correctFeedbackEs: "Correcto. El coro fue salvado por quince pequeñas interrupciones en una sola noche. Su congregación será salvada por cinco pequeñas disciplinas a lo largo de una semana bíblica. La misma Mano está obrando — silenciosa, providente, contextual.",
      incorrectFeedbackEn: "The closing image is providential and contextual, not regal, military, or architectural. It links the West Side Baptist gas-leak (where small things saved many lives) with the pastor's five-day exegetical discipline (where small things save sermons).",
      incorrectFeedbackEs: "La imagen de cierre es providencial y contextual, no real, militar, ni arquitectónica. Une la fuga de gas en la Bautista del Lado Oeste (donde cosas pequeñas salvaron muchas vidas) con la disciplina exegética de cinco días del pastor (donde cosas pequeñas salvan sermones)."
    }
  ];

const kwQuestions = [
    {
      textEn: "21. Tell the West Side Baptist Church gas-leak story (Beatrice, Nebraska, 1950) in your own words and explain what it illustrates about reading the Bible in context.",
      textEs: "21. Cuente la historia de la fuga de gas en la Iglesia Bautista del Lado Oeste (Beatrice, Nebraska, 1950) con sus propias palabras y explique lo que ilustra sobre leer la Biblia en su contexto.",
      kw_en: ["choir", "late", "gas", "leak", "providence", "context", "together", "fifteen"],
      kw_es: ["coro", "tarde", "gas", "fuga", "providencia", "contexto", "juntos", "quince"],
      modelEn: "On March 1, 1950, all fifteen members of the West Side Baptist choir in Beatrice were late for fifteen unrelated reasons, and the empty choir loft was spared when a gas leak blew up the church minutes later. Any single delay meant nothing; read together they reveal God's providence. So with Scripture: a verse pulled from its setting can mean anything, but read in context it says what its Author intended.",
      modelEs: "El 1 de marzo de 1950, los quince miembros del coro de la Iglesia Bautista del Lado Oeste en Beatrice llegaron tarde por quince razones distintas, y el palco vacío se salvó cuando una fuga de gas voló la iglesia minutos después. Cualquier retraso por sí solo no significaba nada; leídos juntos revelan la providencia de Dios. Así con la Escritura: un versículo sacado de su entorno puede significar cualquier cosa, pero leído en contexto dice lo que su Autor quiso."
    },
    {
      textEn: "22. Name the five layers of context the pastor must honor before preaching, and briefly explain what each layer is.",
      textEs: "22. Nombre las cinco capas de contexto que el pastor debe honrar antes de predicar, y explique brevemente qué es cada capa.",
      kw_en: ["immediate", "book", "historical", "cultural", "canonical", "frame", "context", "layer"],
      kw_es: ["inmediato", "libro", "histórico", "cultural", "canónico", "marco", "contexto", "capa"],
      modelEn: "The pastor must honor five frames of context before preaching: the immediate context of the surrounding verses, the book context of the whole book's purpose, the historical context of who was there and when, the cultural context of how they lived, and the canonical context of the whole Bible around the verse. Each layer guards the verse's meaning.",
      modelEs: "El pastor debe honrar cinco marcos de contexto antes de predicar: el contexto inmediato de los versículos vecinos, el contexto del libro y su propósito, el contexto histórico de quién estaba y cuándo, el contexto cultural de cómo vivían, y el contexto canónico de toda la Biblia alrededor del versículo. Cada capa guarda el significado."
    },
    {
      textEn: "23. Take Jeremiah 29:11 as your example. Explain how the prosperity-gospel misreading violates immediate context, and what the verse actually meant to its original readers.",
      textEs: "23. Tome Jeremías 29:11 como ejemplo. Explique cómo la mala lectura del evangelio de la prosperidad viola el contexto inmediato, y lo que el versículo significaba realmente para sus lectores originales.",
      kw_en: ["Jeremiah", "exile", "Babylon", "seventy", "prosperity", "context", "immediate", "captiv"],
      kw_es: ["Jeremías", "exili", "Babilonia", "setenta", "prosperidad", "contexto", "inmediato", "cautiv"],
      modelEn: "The prosperity reading rips Jeremiah 29:11 from its immediate context, where the very next verses speak of seventy years in Babylon. The promise was given to exiles facing long captivity, not to guarantee personal success today. Honoring the immediate context shows the verse means God's faithfulness through hardship, not a blank check for prosperity.",
      modelEs: "La lectura de prosperidad arranca Jeremías 29:11 de su contexto inmediato, donde los versículos siguientes hablan de setenta años en Babilonia. La promesa fue dada a exiliados que enfrentaban un largo cautiverio, no para garantizar el éxito personal hoy. Honrar el contexto inmediato muestra que el versículo habla de la fidelidad de Dios en la dificultad, no de un cheque en blanco de prosperidad."
    },
    {
      textEn: "24. Explain why the absence of God's name in the book of Esther is itself the key to reading the book — give the book-context interpretation.",
      textEs: "24. Explique por qué la ausencia del nombre de Dios en el libro de Ester es ella misma la clave para leer el libro — dé la interpretación del contexto del libro.",
      kw_en: ["Esther", "name", "God", "absent", "providence", "book", "hidden", "scene"],
      kw_es: ["Ester", "nombre", "Dios", "ausen", "providencia", "libro", "oculto", "escena"],
      modelEn: "God's name is never mentioned in Esther, and that silence is itself the key to the book. The absence is deliberate: God is hidden but present, working His providence behind every scene — the insomnia, the banquet, the timing. Read at the book level, Esther teaches that the unnamed God rules even when He seems absent.",
      modelEs: "El nombre de Dios nunca se menciona en Ester, y ese silencio es en sí la clave del libro. La ausencia es deliberada: Dios está oculto pero presente, obrando Su providencia detrás de cada escena — el insomnio, el banquete, el momento justo. Leído al nivel del libro, Ester enseña que el Dios sin nombrar gobierna aun cuando parece ausente."
    },
    {
      textEn: "25. Describe the historical context of the book of Esther — Persian Empire, Jews in exile, Haman as an Amalekite — and explain how this background changes the way we read the story.",
      textEs: "25. Describa el contexto histórico del libro de Ester — el Imperio Persa, los judíos en el exilio, Amán como amalecita — y explique cómo este trasfondo cambia la manera de leer la historia.",
      kw_en: ["Persia", "Xerxes", "exile", "Haman", "Amalekite", "ancient", "history", "enemy"],
      kw_es: ["Persia", "Asuero", "exilio", "Amán", "amalecita", "antiguo", "historia", "enemigo"],
      modelEn: "Esther is set around 480 B.C. in the Persian Empire under Xerxes, with the Jews scattered in exile across 127 provinces. Haman is an Amalekite, descended from Israel's ancient enemy since Sinai. Knowing this history, his plot to destroy the Jews is not random villainy but one more chapter in a thousand-year war — and the danger feels real.",
      modelEs: "Ester ocurre alrededor del 480 a.C. en Persia, el Imperio Persa bajo Asuero, con los judíos dispersos en el exilio por 127 provincias. Amán es amalecita, descendiente del antiguo enemigo de Israel desde Sinaí. Al conocer esta historia, su plan de destruir a los judíos no es maldad al azar sino un capítulo más en una guerra de mil años — y el peligro se siente real."
    },
    {
      textEn: "26. Give one example from the book of Esther where understanding the Persian cultural context changes the meaning of a scene the modern reader might otherwise miss.",
      textEs: "26. Dé un ejemplo del libro de Ester donde entender el contexto cultural persa cambia el significado de una escena que el lector moderno podría pasar por alto.",
      kw_en: ["Persian", "scepter", "king", "custom", "culture", "scene", "providence", "sleep"],
      kw_es: ["persa", "cetro", "rey", "costumbre", "cultura", "escena", "providencia", "dormir"],
      modelEn: "In Persian culture no one, not even the queen, could approach the king uninvited; without his golden scepter the visitor was put to death — so Esther's 'if I perish, I perish' was literal, not dramatic. And a king having the chronicles read aloud when he could not sleep was a normal custom, not a quirk; on that one night it became providence for Mordecai. Cultural context restores the weight of each scene.",
      modelEs: "En la cultura persa nadie, ni siquiera la reina, podía acercarse al rey sin invitación; sin su cetro de oro el visitante era ejecutado — así que el «si perezco, perezco» de Ester era literal, no dramático. Y que un rey hiciera leer las crónicas cuando no podía dormir era una costumbre normal, no un capricho; esa noche se volvió providencia para Mardoqueo. El contexto cultural restaura el peso de cada escena."
    },
    {
      textEn: "27. Identify the canonical-context promise that drives the book of Esther from underneath, and show how it is fulfilled in the story.",
      textEs: "27. Identifique la promesa de contexto canónico que impulsa el libro de Ester por debajo, y muestre cómo se cumple en la historia.",
      kw_en: ["Abraham", "covenant", "Genesis", "bless", "curse", "Haman", "gallows", "Messiah"],
      kw_es: ["Abraham", "pacto", "Génesis", "bendecir", "maldecir", "Amán", "horca", "Mesías"],
      modelEn: "The promise running underneath Esther is the covenant God made with Abraham in Genesis 12 — to bless those who bless his line and curse those who curse it. Haman, who plotted to curse and destroy the Jews, ends hanged on his own gallows, while the covenant people are preserved. Read canonically, Esther is the covenant keeping itself so the Messiah's line survives.",
      modelEs: "La promesa que corre por debajo de Ester es el pacto que Dios hizo con Abraham en Génesis 12 — bendecir a los que bendicen su linaje y maldecir a los que lo maldicen. Amán, que tramó maldecir y destruir a los judíos, termina colgado en su propia horca, mientras el pueblo del pacto es preservado. Leído canónicamente, Ester es el pacto cumpliéndose para que sobreviva el linaje del Mesías."
    },
    {
      textEn: "28. Explain the distinction between the \"lower story\" and the \"upper story\" using Esther as your example, and describe what happens when a pastor preaches only one or the other.",
      textEs: "28. Explique la distinción entre la «historia de abajo» y la «historia de arriba» usando a Ester como ejemplo, y describa qué pasa cuando un pastor predica solo una o la otra.",
      kw_en: ["lower", "upper", "story", "palace", "God", "moralism", "abstraction", "preach"],
      kw_es: ["abajo", "arriba", "historia", "palacio", "Dios", "moralismo", "abstracción", "predica"],
      modelEn: "Every text has a lower story and an upper story. In Esther the lower story is what the palace sees — a sleepless king, a brave queen, an ambitious courtier. The upper story is what only God sees — His covenant keeping itself and the Messiah's line preserved. Preach only the lower story and you get moralism; preach only the upper and you get abstraction. The exegete must see both.",
      modelEs: "Cada texto tiene una historia de abajo y una historia de arriba. En Ester la historia de abajo es lo que ve el palacio — un rey insomne, una reina valiente, un cortesano ambicioso. La historia de arriba es lo que solo Dios ve — Su pacto cumpliéndose y el linaje del Mesías preservado. Si predica solo la de abajo obtiene moralismo; solo la de arriba y obtiene abstracción. El exégeta debe ver ambas."
    },
    {
      textEn: "29. Name the four serious errors that the discipline of context saves the pastor from, and briefly describe how each error fails to honor context.",
      textEs: "29. Nombre los cuatro errores serios de los cuales la disciplina del contexto salva al pastor, y describa brevemente cómo cada error falla en honrar el contexto.",
      kw_en: ["proof", "texting", "moralism", "chronological", "flatten", "cultural", "projection", "context"],
      kw_es: ["prueba", "versículos", "moralismo", "cronológic", "aplanamiento", "cultural", "proyección", "contexto"],
      modelEn: "Context saves the pastor from four errors: proof-texting, snatching a verse to prove a point; moralism, turning every story into a lesson about being good; chronological flattening, ignoring where a passage sits in redemptive history; and cultural projection, reading our own customs back into the text. Each error fails to honor the context.",
      modelEs: "El contexto salva al pastor de cuatro errores: sacar versículos de prueba, arrancando un texto para probar un punto; el moralismo, convertir cada historia en una lección de ser bueno; el aplanamiento cronológico, ignorar dónde se sitúa un pasaje en la historia de la redención; y la proyección cultural, leer nuestras costumbres en el texto. Cada error falla en honrar el contexto."
    },
    {
      textEn: "30. Walk through the practical weekly schedule this lesson recommends (Monday through Saturday) and explain what discipline belongs on each day.",
      textEs: "30. Recorra el horario semanal práctico que esta lección recomienda (de lunes a sábado) y explique qué disciplina corresponde a cada día.",
      kw_en: ["Monday", "Tuesday", "Friday", "Saturday", "sermon", "frame", "context", "week"],
      kw_es: ["lunes", "martes", "viernes", "sábado", "sermón", "marco", "contexto", "semana"],
      modelEn: "The lesson spreads the five frames across one week: begin Monday with the immediate context, work through the book, historical, cultural, and canonical context from Tuesday through Friday, so that by Saturday the frames are hung and the sermon can be preached knowing the verse says what its Author intended. Five small disciplines across one Bible week.",
      modelEs: "La lección reparte los cinco marcos a lo largo de una semana: comience el lunes con el contexto inmediato, trabaje el contexto del libro, histórico, cultural y canónico de martes a viernes, de modo que para el sábado los marcos estén colgados y el sermón pueda predicarse sabiendo que el versículo dice lo que su Autor quiso. Cinco pequeñas disciplinas en una semana bíblica."
    }
  ];
