/* CTSHermeneutics - unit 3: per-unit configuration and content. */

const UNIT = 3;

const NEXT_UNIT_URL = "CTSHermeneuticsUnit4.html";

const PREV_UNIT_URL = "CTSHermeneuticsUnit2.html";

const IS_FINAL_UNIT = false;

const SHOW_REGISTRATION = false;

const mcQuestions = [
    {
      textEn: "1. The Greek word \"exegesis\" literally means:",
      textEs: "1. La palabra griega «exégesis» significa literalmente:",
      optionsEn: ["A. To translate into modern language","B. To memorize verbatim","C. To preach with persuasion","D. To leading out — drawing the meaning out of the text"],
      optionsEs: ["A. Traducir al lenguaje moderno","B. Memorizar al pie de la letra","C. Predicar con persuasión","D. Sacar fuera — extraer el significado del texto"],
      correct: "D",
      correctFeedbackEn: "Correct. Exegesis comes from a Greek verb meaning to draw out or lead forth. The exegete leads meaning OUT of the text. Eisegesis (eis = into) pushes meaning IN. The difference is the direction of flow.",
      correctFeedbackEs: "Correcto. Exégesis viene de un verbo griego que significa sacar fuera o llevar hacia afuera. El exégeta saca el significado del texto. La eiségesis (eis = dentro) empuja el significado adentro. La diferencia es la dirección del flujo.",
      incorrectFeedbackEn: "Exegesis is not about translation, memorization, or rhetoric. The Greek root means \"to lead out\" — drawing the meaning the author intended out of the text into the open.",
      incorrectFeedbackEs: "La exégesis no se trata de traducción, memorización, ni retórica. La raíz griega significa «sacar fuera» — extraer el significado que el autor pretendía y llevarlo a la luz."
    },
    {
      textEn: "2. The opposite of exegesis is:",
      textEs: "2. Lo opuesto a la exégesis es:",
      optionsEn: ["A. Theology","B. Application","C. Eisegesis — reading our own meaning INTO the text","D. Memorization"],
      optionsEs: ["A. La teología","B. La aplicación","C. La eiségesis — leer nuestro propio significado DENTRO del texto","D. La memorización"],
      correct: "C",
      correctFeedbackEn: "Correct. Eisegesis (from eis = into) is the opposite error. The eisegete comes to the text knowing what he wants it to say and pushes his meaning in. He marvels at how the Bible agrees with him because he never let it disagree.",
      correctFeedbackEs: "Correcto. La eiségesis (de eis = dentro) es el error opuesto. El eiségeta viene al texto sabiendo lo que quiere que diga y empuja su significado dentro. Se maravilla de cuán de acuerdo está la Biblia con él porque nunca le permitió estar en desacuerdo.",
      incorrectFeedbackEn: "Theology, application, and memorization can all flow from sound exegesis. The opposite of exegesis is its mirror-image error: EISEGESIS, pushing meaning into the text instead of drawing it out.",
      incorrectFeedbackEs: "La teología, la aplicación, y la memorización pueden surgir de la exégesis sólida. Lo opuesto a la exégesis es su error en espejo: la EISÉGESIS, empujar el significado dentro del texto en lugar de sacarlo."
    },
    {
      textEn: "3. According to the lesson, the one question every exegete must ask is:",
      textEs: "3. Según la lección, la única pregunta que todo exégeta debe hacer es:",
      optionsEn: ["A. How does this verse make me feel?","B. What is the most popular interpretation today?","C. How does this support my next sermon?","D. What did the author intend his ORIGINAL readers to understand?"],
      optionsEs: ["A. ¿Cómo me hace sentir este versículo?","B. ¿Cuál es la interpretación más popular hoy?","C. ¿Cómo apoya esto mi próximo sermón?","D. ¿Qué quería el autor que sus lectores ORIGINALES entendieran?"],
      correct: "D",
      correctFeedbackEn: "Correct. Paul wrote to Timothy. Peter wrote to scattered believers in Asia Minor. Moses wrote to Israel coming out of Egypt. Before we apply the words to our church, we must hear what those original ears were hearing.",
      correctFeedbackEs: "Correcto. Pablo le escribió a Timoteo. Pedro escribió a creyentes dispersos en Asia Menor. Moisés escribió a Israel saliendo de Egipto. Antes de aplicar las palabras a nuestra iglesia, debemos oír lo que aquellos oídos originales estaban oyendo.",
      incorrectFeedbackEn: "Feelings, popularity, and sermon needs all push the pastor toward eisegesis. The one exegetical question is about authorial intent for the original audience — only then can faithful application follow.",
      incorrectFeedbackEs: "Los sentimientos, la popularidad, y las necesidades del sermón empujan al pastor hacia la eiségesis. La única pregunta exegética es sobre la intención del autor para la audiencia original — solo entonces puede seguir una aplicación fiel."
    },
    {
      textEn: "4. The clearest Old Testament picture of exegesis in this lesson is taken from:",
      textEs: "4. El cuadro más claro de exégesis en el Antiguo Testamento en esta lección es tomado de:",
      optionsEn: ["A. Numbers 22 — Balaam's prophecies","B. Joshua 1 — meditate on the Law day and night","C. Genesis 1 — God said","D. Nehemiah 8 — Ezra and the Levites \"gave the sense\""],
      optionsEs: ["A. Números 22 — las profecías de Balaam","B. Josué 1 — meditar en la Ley de día y de noche","C. Génesis 1 — Dios dijo","D. Nehemías 8 — Esdras y los levitas «daban a entender el sentido»"],
      correct: "D",
      correctFeedbackEn: "Correct. Nehemiah 8:8 says they read distinctly, gave the sense, and helped them understand. That is the pastor's job description: read the text plainly, draw out its meaning, help the people grasp it.",
      correctFeedbackEs: "Correcto. Nehemías 8:8 dice que leían claramente, daban a entender el sentido, y ayudaban a comprender. Ésa es la descripción del oficio pastoral: leer el texto claramente, sacar su significado, ayudar al pueblo a comprenderlo.",
      incorrectFeedbackEn: "Other OT passages teach the value of Scripture, but the clearest WORKED EXAMPLE of exegesis is Nehemiah 8: Ezra and the Levites read the Law and \"gave the sense.\" That is what a faithful pastor does on Sunday.",
      incorrectFeedbackEs: "Otros pasajes del AT enseñan el valor de la Escritura, pero el EJEMPLO PRÁCTICO más claro de exégesis es Nehemías 8: Esdras y los levitas leyeron la Ley y «daban a entender el sentido». Eso es lo que un pastor fiel hace el domingo."
    },
    {
      textEn: "5. In the wilderness, Satan's most striking strategy was to:",
      textEs: "5. En el desierto, la estrategia más impactante de Satanás fue:",
      optionsEn: ["A. Deny that the Bible was authoritative","B. Quote Scripture itself, but out of context","C. Offer Jesus a non-biblical religion","D. Argue with Jesus about Hebrew vocabulary"],
      optionsEs: ["A. Negar que la Biblia tuviera autoridad","B. Citar la Escritura misma, pero fuera de contexto","C. Ofrecer a Jesús una religión no bíblica","D. Discutir con Jesús sobre vocabulario hebreo"],
      correct: "B",
      correctFeedbackEn: "Correct. Satan does not deny the Bible — he quotes it. At the temple he cites Psalm 91 word for word, but ripped from its context. The verses are real; the application is satanic. Eisegesis weaponized.",
      correctFeedbackEs: "Correcto. Satanás no niega la Biblia — la cita. En el templo cita el Salmo 91 palabra por palabra, pero arrancado de su contexto. Los versículos son reales; la aplicación es satánica. Eiségesis convertida en arma.",
      incorrectFeedbackEn: "Satan did not deny the Bible, offer a different religion, or argue about Hebrew. He did something far more dangerous — he QUOTED Scripture out of context. This is why exegesis matters: error often comes wearing Bible clothes.",
      incorrectFeedbackEs: "Satanás no negó la Biblia, ni ofreció otra religión, ni discutió hebreo. Hizo algo mucho más peligroso: CITÓ la Escritura fuera de contexto. Por eso importa la exégesis: el error a menudo viene vestido de Biblia."
    },
    {
      textEn: "6. Which passage did Satan quote at Jesus' second temptation?",
      textEs: "6. ¿Qué pasaje citó Satanás en la segunda tentación de Jesús?",
      optionsEn: ["A. Genesis 3 — the serpent's promise to Eve","B. Isaiah 53 — the suffering servant","C. Psalm 91 — \"He shall give His angels charge over you\"","D. Proverbs 3 — \"Trust in the LORD with all your heart\""],
      optionsEs: ["A. Génesis 3 — la promesa de la serpiente a Eva","B. Isaías 53 — el siervo sufriente","C. Salmo 91 — «A sus ángeles mandará acerca de ti»","D. Proverbios 3 — «Confía en Jehová de todo tu corazón»"],
      correct: "C",
      correctFeedbackEn: "Correct. Satan quoted Psalm 91:11-12 verbatim — \"He shall give His angels charge over you, and in their hands they shall bear you up.\" The Psalm promises protection on the path of obedience, not on a stunt that tests God.",
      correctFeedbackEs: "Correcto. Satanás citó el Salmo 91:11-12 al pie de la letra — «A sus ángeles mandará acerca de ti, y en las manos te sostendrán». El Salmo promete protección en el camino de la obediencia, no en una acrobacia que tiente a Dios.",
      incorrectFeedbackEn: "Satan's quotation at the temple was Psalm 91:11-12. He used a beautiful promise of protection — given for the path of obedience — and twisted it to justify a leap that would test God. Classic eisegesis.",
      incorrectFeedbackEs: "La cita de Satanás en el templo fue el Salmo 91:11-12. Usó una hermosa promesa de protección — dada para el camino de la obediencia — y la torció para justificar un salto que tentaría a Dios. Eiségesis clásica."
    },
    {
      textEn: "7. Jesus answered each temptation with a quotation from which book?",
      textEs: "7. Jesús respondió a cada tentación con una cita de cuál libro:",
      optionsEn: ["A. Deuteronomy","B. Psalms","C. Isaiah","D. Genesis"],
      optionsEs: ["A. Deuteronomio","B. Salmos","C. Isaías","D. Génesis"],
      correct: "A",
      correctFeedbackEn: "Correct. All three of Jesus' answers come from Deuteronomy — the book Moses wrote to Israel on the edge of the Promised Land. Each quotation is exegetically tight: same principle, same application, contexts honored.",
      correctFeedbackEs: "Correcto. Las tres respuestas de Jesús vienen de Deuteronomio — el libro que Moisés escribió a Israel al borde de la Tierra Prometida. Cada cita es exegéticamente firme: mismo principio, misma aplicación, contextos honrados.",
      incorrectFeedbackEn: "All three of Jesus' wilderness answers come from a single book: DEUTERONOMY. He quoted 8:3, 6:16, and 6:13 — each one keeping the original meaning intact. That is the model of contextual exegesis.",
      incorrectFeedbackEs: "Las tres respuestas de Jesús en el desierto vienen de un solo libro: DEUTERONOMIO. Citó 8:3, 6:16, y 6:13 — cada uno conservando el significado original intacto. Ése es el modelo de la exégesis contextual."
    },
    {
      textEn: "8. The \"bread eisegesis\" in this lesson refers to:",
      textEs: "8. La «eiségesis del pan» en esta lección se refiere a:",
      optionsEn: ["A. Pulling verses out of context to guarantee physical blessing and prosperity","B. Eating before Bible study","C. Ignoring passages about food in the Old Testament","D. Using bread illustrations in sermons"],
      optionsEs: ["A. Sacar versículos de contexto para garantizar bendición física y prosperidad","B. Comer antes del estudio bíblico","C. Ignorar pasajes sobre comida en el Antiguo Testamento","D. Usar ilustraciones de pan en los sermones"],
      correct: "A",
      correctFeedbackEn: "Correct. Satan's first temptation — turn stones to bread — becomes any misuse of Scripture that bends a promise toward physical comfort. Jeremiah 29:11 at every funeral. Mark 11:24 as a vending machine. The Bible was given to feed the spirit, not fatten the flesh.",
      correctFeedbackEs: "Correcto. La primera tentación de Satanás — convertir piedras en pan — se vuelve cualquier mal uso de la Escritura que doble una promesa hacia el confort físico. Jeremías 29:11 en cada funeral. Marcos 11:24 como máquina expendedora. La Biblia fue dada para alimentar al espíritu, no para engordar la carne.",
      incorrectFeedbackEn: "The \"bread eisegesis\" is not about timing of meals, ignoring food passages, or sermon illustrations. It is the error of taking promises of God and bending them toward physical appetite — the prosperity-gospel error.",
      incorrectFeedbackEs: "La «eiségesis del pan» no se trata del horario de las comidas, ni de ignorar pasajes sobre comida, ni de ilustraciones sermónicas. Es el error de tomar las promesas de Dios y doblarlas hacia el apetito físico — el error del evangelio de la prosperidad."
    },
    {
      textEn: "9. The \"temple eisegesis\" in this lesson refers to:",
      textEs: "9. La «eiségesis del templo» en esta lección se refiere a:",
      optionsEn: ["A. Worshipping in the wrong building","B. Wrenching God's protection promises away from their condition of obedience","C. Being too reverent in church","D. Quoting Old Testament temple verses too often"],
      optionsEs: ["A. Adorar en el edificio equivocado","B. Arrancar las promesas de protección de Dios de su condición de obediencia","C. Ser demasiado reverente en la iglesia","D. Citar con demasiada frecuencia versículos del templo del Antiguo Testamento"],
      correct: "B",
      correctFeedbackEn: "Correct. Satan twisted Psalm 91 — \"He will catch you\" — apart from its assumption of obedient walking with God. The temple eisegesis claims God's promises while ignoring God's path. Philippians 4:19 after running into debt; Romans 8:28 after adultery.",
      correctFeedbackEs: "Correcto. Satanás torció el Salmo 91 — «Él te sostendrá» — aparte de su suposición de caminar obediente con Dios. La eiségesis del templo reclama las promesas de Dios mientras ignora el camino de Dios. Filipenses 4:19 después de endeudarse; Romanos 8:28 después del adulterio.",
      incorrectFeedbackEn: "The temple eisegesis is not about buildings, reverence, or verse frequency. It is the error of claiming God's protection promises while breaking the obedience that those promises presuppose. The promises of God assume the path of God.",
      incorrectFeedbackEs: "La eiségesis del templo no se trata de edificios, reverencia, ni frecuencia de versículos. Es el error de reclamar las promesas de protección de Dios mientras se rompe la obediencia que esas promesas presuponen. Las promesas de Dios suponen el camino de Dios."
    },
    {
      textEn: "10. The \"kingdoms eisegesis\" in this lesson refers to:",
      textEs: "10. La «eiségesis de los reinos» en esta lección se refiere a:",
      optionsEn: ["A. Misreading prophecies about end-time kingdoms","B. Confusing the Old Testament kings","C. Pressing Scripture into service for personal ambition and power","D. Disagreeing about post-tribulation theology"],
      optionsEs: ["A. Malinterpretar profecías sobre reinos del fin","B. Confundir a los reyes del Antiguo Testamento","C. Forzar la Escritura al servicio de la ambición personal y el poder","D. Estar en desacuerdo sobre la teología post-tribulación"],
      correct: "C",
      correctFeedbackEn: "Correct. Satan offered all the kingdoms of the world for a single act of worship — a shortcut to glory bypassing the cross. The kingdoms eisegesis is the same shortcut for pastors: Genesis 1:28 to justify empire-building, Matthew 16:19 to claim power over others.",
      correctFeedbackEs: "Correcto. Satanás ofreció todos los reinos del mundo por un solo acto de adoración — un atajo a la gloria evitando la cruz. La eiségesis de los reinos es el mismo atajo para los pastores: Génesis 1:28 para justificar la construcción de imperios, Mateo 16:19 para reclamar poder sobre otros.",
      incorrectFeedbackEn: "The kingdoms eisegesis is not about prophecy or end-times debates. It is the use of Scripture to gain power, control, or empire apart from God's appointed way. A short-cut to glory always runs past the cross — Satan's offer in the wilderness.",
      incorrectFeedbackEs: "La eiségesis de los reinos no se trata de profecía o debates sobre el fin de los tiempos. Es el uso de la Escritura para ganar poder, control, o imperio fuera del camino designado por Dios. Un atajo a la gloria siempre pasa por encima de la cruz — la oferta de Satanás en el desierto."
    },
    {
      textEn: "11. According to the lesson, the right answer to a misused Bible verse is:",
      textEs: "11. Según la lección, la respuesta correcta a un versículo bíblico mal usado es:",
      optionsEn: ["A. Throw out the Bible","B. Avoid that verse for a year","C. Use less Scripture in the future","D. More Bible, more context, more careful exegesis"],
      optionsEs: ["A. Desechar la Biblia","B. Evitar ese versículo durante un año","C. Usar menos Escritura en el futuro","D. Más Biblia, más contexto, más exégesis cuidadosa"],
      correct: "D",
      correctFeedbackEn: "Correct. Jesus did not throw out Psalm 91 when Satan misused it. He brought another passage — Deuteronomy 6:16 — that held the first one in place. The cure for bad exegesis is not less Bible; it is more Bible, more carefully read.",
      correctFeedbackEs: "Correcto. Jesús no desechó el Salmo 91 cuando Satanás lo malusó. Trajo otro pasaje — Deuteronomio 6:16 — que sostuvo al primero en su lugar. La cura para la mala exégesis no es menos Biblia; es más Biblia, leída con más cuidado.",
      incorrectFeedbackEn: "Throwing out the Bible, avoiding verses, or using less Scripture all surrender ground to the eisegete. The proper response is MORE Bible, MORE context, MORE careful exegesis — exactly what Jesus modeled in the wilderness.",
      incorrectFeedbackEs: "Desechar la Biblia, evitar versículos, o usar menos Escritura ceden terreno al eiségeta. La respuesta apropiada es MÁS Biblia, MÁS contexto, MÁS exégesis cuidadosa — exactamente lo que Jesús modeló en el desierto."
    },
    {
      textEn: "12. The Faust legend illustrates which principle for the pastor?",
      textEs: "12. La leyenda de Fausto ilustra qué principio para el pastor:",
      optionsEn: ["A. The Reformation began in Germany","B. Twisting Scripture for personal gain is a soul-costing bargain","C. Theological education must be earned slowly","D. Earthquakes are usually divine judgment"],
      optionsEs: ["A. La Reforma comenzó en Alemania","B. Torcer la Escritura por ganancia personal es un pacto que cuesta el alma","C. La educación teológica debe ganarse lentamente","D. Los terremotos suelen ser juicio divino"],
      correct: "B",
      correctFeedbackEn: "Correct. Faust signed in blood for 24 years of pleasure; at the end he lost his soul. The pastor who twists Scripture for crowds, donors, or pride signs the same contract. \"What shall it profit a man if he gains the whole world and loses his own soul?\"",
      correctFeedbackEs: "Correcto. Fausto firmó en sangre por 24 años de placer; al final perdió su alma. El pastor que tuerce la Escritura por multitudes, donantes, u orgullo firma el mismo contrato. «¿Qué aprovechará al hombre si ganare todo el mundo, y perdiere su alma?»",
      incorrectFeedbackEn: "The Faust illustration is not about Reformation history, slow education, or earthquakes. It is the picture of a soul-costing bargain: the pastor who twists Scripture for gain may enjoy the deal for a season, but the final clause is paid in souls.",
      incorrectFeedbackEs: "La ilustración de Fausto no se trata de la historia de la Reforma, la educación lenta, ni los terremotos. Es el cuadro de un pacto que cuesta el alma: el pastor que tuerce la Escritura por ganancia puede disfrutar el trato por un tiempo, pero la cláusula final se paga con almas."
    },
    {
      textEn: "13. Jesus' answer to the bread temptation came from Deuteronomy 8:3 and made what point?",
      textEs: "13. La respuesta de Jesús a la tentación del pan vino de Deuteronomio 8:3 e hizo cuál punto:",
      optionsEn: ["A. The Sabbath was made for man, not man for the Sabbath","B. Man shall not live by bread alone, but by every word from God's mouth","C. Trust the Lord with all your heart","D. Love your neighbor as yourself"],
      optionsEs: ["A. El sábado fue hecho para el hombre, no el hombre para el sábado","B. No solo de pan vivirá el hombre, sino de toda palabra de la boca de Dios","C. Confía en Jehová de todo tu corazón","D. Ama a tu prójimo como a ti mismo"],
      correct: "B",
      correctFeedbackEn: "Correct. Moses said it to Israel in the wilderness, where God taught them by hunger that He sustains. Jesus, in His own wilderness, applies it the SAME way. The original context fits perfectly because Jesus did not pull the verse from its setting.",
      correctFeedbackEs: "Correcto. Moisés se lo dijo a Israel en el desierto, donde Dios les enseñó por el hambre que Él sostiene. Jesús, en Su propio desierto, lo aplica de la MISMA manera. El contexto original encaja perfectamente porque Jesús no sacó el versículo de su entorno.",
      incorrectFeedbackEn: "Jesus' answer to the bread temptation was from Deuteronomy 8:3: \"Man shall not live by bread alone, but by every word that proceeds from the mouth of God.\" Same wilderness setting in Moses' day, same principle applied directly.",
      incorrectFeedbackEs: "La respuesta de Jesús a la tentación del pan fue de Deuteronomio 8:3: «No solo de pan vivirá el hombre, sino de toda palabra que sale de la boca de Dios». El mismo escenario del desierto en los días de Moisés, el mismo principio aplicado directamente."
    },
    {
      textEn: "14. The lesson summarizes practical exegesis as a sequence. Which step comes FIRST?",
      textEs: "14. La lección resume la exégesis práctica como una secuencia. ¿Qué paso viene PRIMERO?",
      optionsEn: ["A. Look up commentaries","B. Write the sermon outline","C. Pray for wisdom (James 1:5)","D. Find an illustration"],
      optionsEs: ["A. Consultar comentarios","B. Escribir el bosquejo del sermón","C. Orar por sabiduría (Santiago 1:5)","D. Buscar una ilustración"],
      correct: "C",
      correctFeedbackEn: "Correct. Pray first. James 1:5 — ask for wisdom. Without prayer, exegesis degrades into mere technique, and the pastor's blind spots will show up on Sunday. Prayer first; then read, observe, compare, apply.",
      correctFeedbackEs: "Correcto. Ore primero. Santiago 1:5 — pida sabiduría. Sin oración, la exégesis se degrada a mera técnica, y los puntos ciegos del pastor aparecerán el domingo. Primero la oración; luego leer, observar, comparar, aplicar.",
      incorrectFeedbackEn: "Commentaries, outlines, and illustrations all come AFTER the foundational step: prayer for wisdom (James 1:5). A pastor who skips prayer can produce a clever sermon, but not necessarily a true one.",
      incorrectFeedbackEs: "Los comentarios, los bosquejos, y las ilustraciones vienen DESPUÉS del paso fundamental: la oración por sabiduría (Santiago 1:5). Un pastor que se salta la oración puede producir un sermón ingenioso, pero no necesariamente uno verdadero."
    },
    {
      textEn: "15. The lesson warns that violating the proper order — letting application crowd in before exegesis is done — produces:",
      textEs: "15. La lección advierte que violar el orden adecuado — dejar que la aplicación se cuele antes de que la exégesis esté hecha — produce:",
      optionsEn: ["A. The pastor preaching himself instead of the text","B. Sermons that are too long","C. Church members who fall asleep","D. Better attendance numbers"],
      optionsEs: ["A. El pastor predicándose a sí mismo en lugar del texto","B. Sermones que son demasiado largos","C. Miembros de la iglesia que se duermen","D. Mejores números de asistencia"],
      correct: "A",
      correctFeedbackEn: "Correct. When application crowds in early, the pastor preaches himself. After enough Sundays the church is shaped to his size, not the Bible's. That is replacing, not pastoring.",
      correctFeedbackEs: "Correcto. Cuando la aplicación se cuela temprano, el pastor se predica a sí mismo. Después de suficientes domingos, la iglesia es moldeada a su tamaño, no al tamaño de la Biblia. Eso es reemplazar, no pastorear.",
      incorrectFeedbackEn: "Sermon length, sleeping listeners, and attendance numbers are surface issues. The deeper danger of skipping exegesis is that the pastor ends up preaching HIMSELF — and the church takes his shape instead of Scripture's.",
      incorrectFeedbackEs: "La duración del sermón, los oyentes dormidos, y los números de asistencia son asuntos de superficie. El peligro más profundo de saltarse la exégesis es que el pastor termina predicándose a sí MISMO — y la iglesia toma su forma en lugar de la de la Escritura."
    },
    {
      textEn: "16. The Alexander-and-the-deserter story is used in the lesson to illustrate:",
      textEs: "16. La historia de Alejandro y el desertor se usa en la lección para ilustrar:",
      optionsEn: ["A. The value of military discipline","B. The greatness of ancient empires","C. A pastor's title must match his ways — \"either change your name or change your ways\"","D. Heroic individual courage"],
      optionsEs: ["A. El valor de la disciplina militar","B. La grandeza de los antiguos imperios","C. El título del pastor debe coincidir con su conducta — «o cambias tu nombre o cambias tu conducta»","D. El valor individual heroico"],
      correct: "C",
      correctFeedbackEn: "Correct. Three times the cowardly soldier said his name was \"Alexander.\" The general replied: \"Either change your name or change your ways.\" A pastor who calls himself a minister of the Word and then twists the Word bears a name his life denies.",
      correctFeedbackEs: "Correcto. Tres veces el soldado cobarde dijo que su nombre era «Alejandro». El general respondió: «O cambias tu nombre o cambias tu conducta». Un pastor que se llama a sí mismo ministro de la Palabra y luego tuerce la Palabra lleva un nombre que su vida niega.",
      incorrectFeedbackEn: "The Alexander story is not about military discipline or empire or heroism. The point is the mismatch between name and conduct — a warning to every man called \"minister of the Word\" who handles the Word carelessly.",
      incorrectFeedbackEs: "La historia de Alejandro no se trata de disciplina militar, ni imperio, ni heroísmo. El punto es la falta de coincidencia entre el nombre y la conducta — una advertencia a todo hombre llamado «ministro de la Palabra» que maneja la Palabra descuidadamente."
    },
    {
      textEn: "17. According to the lesson, the doctrine that allows one passage to interpret another is called:",
      textEs: "17. Según la lección, la doctrina que permite que un pasaje interprete a otro se llama:",
      optionsEn: ["A. Sola Scriptura","B. Scripture interprets Scripture","C. The analogy of being","D. Verbal plenary inspiration"],
      optionsEs: ["A. Sola Scriptura","B. La Escritura interpreta la Escritura","C. La analogía del ser","D. La inspiración verbal plenaria"],
      correct: "B",
      correctFeedbackEn: "Correct. When Satan misused Psalm 91, Jesus answered with Deuteronomy 6:16. Scripture interprets Scripture: clear passages illuminate difficult ones; the whole Bible holds each verse in its proper place. This principle will get its own unit later.",
      correctFeedbackEs: "Correcto. Cuando Satanás malusó el Salmo 91, Jesús respondió con Deuteronomio 6:16. La Escritura interpreta la Escritura: los pasajes claros iluminan los difíciles; toda la Biblia sostiene cada versículo en su lugar apropiado. Este principio tendrá su propia unidad más adelante.",
      incorrectFeedbackEn: "Sola Scriptura is the doctrine of Scripture's authority. Verbal plenary inspiration is about how Scripture was given. The analogy of being is a Roman Catholic concept. The principle that lets one passage interpret another is SCRIPTURE INTERPRETS SCRIPTURE.",
      incorrectFeedbackEs: "Sola Scriptura es la doctrina de la autoridad de la Escritura. La inspiración verbal plenaria se trata de cómo fue dada la Escritura. La analogía del ser es un concepto católico romano. El principio que permite que un pasaje interprete a otro es LA ESCRITURA INTERPRETA LA ESCRITURA."
    },
    {
      textEn: "18. The lesson says that every cult, prosperity teacher, and modernist denial has one thing in common:",
      textEs: "18. La lección dice que cada secta, predicador de prosperidad, y negación modernista tiene una cosa en común:",
      optionsEn: ["A. They all use the Bible — the error is in the direction of the flow, not the text","B. They all reject the Bible entirely","C. They all originated in America","D. They all use only the New Testament"],
      optionsEs: ["A. Todos usan la Biblia — el error está en la dirección del flujo, no en el texto","B. Todos rechazan la Biblia por completo","C. Todos se originaron en América","D. Todos usan solo el Nuevo Testamento"],
      correct: "A",
      correctFeedbackEn: "Correct. Every cult, prosperity teacher, and modernist quotes chapter and verse. The error is not in the text — it is in the direction of the flow. Are we letting the Word fill us, or filling it with us? That is the question of exegesis.",
      correctFeedbackEs: "Correcto. Cada secta, predicador de prosperidad, y modernista cita capítulo y versículo. El error no está en el texto — está en la dirección del flujo. ¿Estamos dejando que la Palabra nos llene, o la llenamos con nosotros? Ésa es la pregunta de la exégesis.",
      incorrectFeedbackEn: "Cults and prosperity teachers do not reject the Bible, they have not all come from one country, and many use the whole Bible. What they share is the eisegetical move: pushing their meaning into the text instead of drawing the text's meaning out.",
      incorrectFeedbackEs: "Las sectas y los predicadores de prosperidad no rechazan la Biblia, no han venido todos de un país, y muchos usan la Biblia entera. Lo que comparten es el movimiento eisegético: empujar su significado dentro del texto en lugar de sacar el significado del texto."
    },
    {
      textEn: "19. The lesson says that the choice every pastor faces every Monday morning is:",
      textEs: "19. La lección dice que la elección que cada pastor enfrenta cada lunes por la mañana es:",
      optionsEn: ["A. To preach or to skip the week","B. Hebrew or Greek","C. Topical or expository","D. Exegesis or eisegesis — refusing to choose means choosing eisegesis by default"],
      optionsEs: ["A. Predicar o saltarse la semana","B. Hebreo o griego","C. Temático o expositivo","D. Exégesis o eiségesis — negarse a elegir significa elegir la eiségesis por defecto"],
      correct: "D",
      correctFeedbackEn: "Correct. The choice is not between exegesis and nothing. It is between exegesis and eisegesis. Refuse the discipline of careful study, and the pastor will read his own meaning into the page by default. There is no neutral.",
      correctFeedbackEs: "Correcto. La elección no es entre la exégesis y nada. Es entre la exégesis y la eiségesis. Niéguese a la disciplina del estudio cuidadoso, y el pastor leerá su propio significado dentro de la página por defecto. No hay neutralidad.",
      incorrectFeedbackEn: "Skipping a week, language choice, and sermon style are secondary. The fundamental Monday-morning choice is between EXEGESIS (drawing meaning out of the text) and EISEGESIS (reading meaning in). And inaction defaults to eisegesis.",
      incorrectFeedbackEs: "Saltarse una semana, la elección de idioma, y el estilo del sermón son secundarios. La decisión fundamental del lunes por la mañana es entre EXÉGESIS (sacar el significado del texto) y EISÉGESIS (leer significado dentro). Y la inacción se inclina por defecto hacia la eiségesis."
    },
    {
      textEn: "20. The lesson's closing charge to the pastor is:",
      textEs: "20. El encargo de cierre de la lección al pastor es:",
      optionsEn: ["A. Stay with the text until you hear what the author meant, then carry that meaning and no other","B. Memorize the entire Bible","C. Avoid all commentaries","D. Always preach the same passage twice"],
      optionsEs: ["A. Permanezca con el texto hasta oír lo que el autor quiso decir, luego lleve ese significado y ningún otro","B. Memorice la Biblia entera","C. Evite todos los comentarios","D. Predique siempre el mismo pasaje dos veces"],
      correct: "A",
      correctFeedbackEn: "Correct. Stay there until you hear it. Then carry that meaning — and no other — to your people. The Spirit who breathed out the Word will breathe life through it again when it is rightly handled.",
      correctFeedbackEs: "Correcto. Permanezca allí hasta oírlo. Luego lleve ese significado — y ningún otro — a su pueblo. El Espíritu que exhaló la Palabra soplará vida a través de ella otra vez cuando se maneje rectamente.",
      incorrectFeedbackEn: "Memorization is good, commentaries are useful, repetition is fine — but the closing charge is more basic: STAY with the text until you hear the author's meaning, then deliver THAT meaning, and no other. Faithfulness in interpretation begins and ends there.",
      incorrectFeedbackEs: "La memorización es buena, los comentarios son útiles, la repetición está bien — pero el encargo de cierre es más básico: PERMANEZCA con el texto hasta oír el significado del autor, luego entregue ESE significado, y ningún otro. La fidelidad en la interpretación comienza y termina allí."
    }
  ];

const kwQuestions = [
    {
      textEn: "21. Define exegesis and eisegesis, and explain why every pastor faces this choice every Monday morning.",
      textEs: "21. Defina exégesis y eiségesis, y explique por qué cada pastor enfrenta esta elección cada lunes por la mañana.",
      kw_en: ["exegesis", "eisegesis", "meaning", "draw", "read", "Monday", "choice", "author"],
      kw_es: ["exéges", "eiséges", "significado", "sacar", "leer", "lunes", "elección", "autor"],
      modelEn: "Exegesis means drawing the meaning out of the text — letting the author's intent govern. Eisegesis means reading your own meaning into the text. Every pastor faces this choice every Monday morning as he prepares; and if he refuses to choose exegesis, he chooses eisegesis by default.",
      modelEs: "La exégesis significa sacar el significado del texto — dejar que gobierne la intención del autor. La eiségesis significa leer tu propio significado dentro del texto. Cada pastor enfrenta esta elección cada lunes por la mañana; y si se niega a escoger la exégesis, escoge la eiségesis por defecto."
    },
    {
      textEn: "22. Explain Nehemiah 8:8 (\"they gave the sense\") and describe how it serves as a portrait of the pastor's job description.",
      textEs: "22. Explique Nehemías 8:8 («daban a entender el sentido») y describa cómo sirve de retrato de la descripción del oficio pastoral.",
      kw_en: ["Nehemiah", "Ezra", "read", "sense", "understand", "Levites", "distinct", "explain"],
      kw_es: ["Nehem", "Esdras", "leer", "sentido", "entender", "levitas", "claro", "explicar"],
      modelEn: "In Nehemiah 8:8 Ezra and the Levites read distinctly from the Law of God and gave the sense, helping the people understand. That is the pastor's job description: not merely to read the words aloud but to explain their sense so the hearers truly understand what God has said.",
      modelEs: "En Nehemías 8:8 Esdras y los levitas leyeron claramente de la Ley de Dios y dieron el sentido, ayudando al pueblo a entender. Esa es la descripción del oficio pastoral: no solo leer las palabras en voz alta sino explicar su sentido para que los oyentes entiendan de veras lo que Dios ha dicho."
    },
    {
      textEn: "23. In Matthew 4, Satan quotes Psalm 91 at Jesus. Explain how this is an example of eisegesis weaponized, and how Jesus responds.",
      textEs: "23. En Mateo 4, Satanás cita el Salmo 91 a Jesús. Explique cómo es un ejemplo de eiségesis convertida en arma, y cómo responde Jesús.",
      kw_en: ["Satan", "Psalm", "temple", "context", "Deuteronomy", "tempt", "Scripture", "quote"],
      kw_es: ["Satanás", "Salmo", "templo", "contexto", "Deuteronomio", "tentar", "Escritura", "arma"],
      modelEn: "At the temple Satan quoted Psalm 91 to Jesus, ripping the promise of angelic protection out of its context to tempt Him to jump. This is eisegesis weaponized — using a true verse with a false meaning. Jesus answered with Scripture rightly used, quoting Deuteronomy in its true context: 'You shall not tempt the Lord your God.'",
      modelEs: "En el templo Satanás citó el Salmo 91 a Jesús, arrancando la promesa de protección angélica de su contexto para tentarlo a saltar. Esto es eiségesis convertida en arma — usar un versículo verdadero con un significado falso. Jesús respondió con la Escritura bien usada, citando Deuteronomio en su verdadero contexto: «No tentarás al Señor tu Dios.»"
    },
    {
      textEn: "24. The lesson identifies three eisegeses corresponding to Satan's three temptations. Name and briefly describe each (bread / temple / kingdoms).",
      textEs: "24. La lección identifica tres eiségesis correspondientes a las tres tentaciones de Satanás. Nombre y describa brevemente cada una (pan / templo / reinos).",
      kw_en: ["bread", "temple", "kingdoms", "prosperity", "presumption", "power", "ambition", "temptation"],
      kw_es: ["pan", "templo", "reinos", "prosperidad", "presunción", "poder", "ambición", "tentación"],
      modelEn: "The three eisegeses match Satan's three temptations. The bread eisegesis turns spiritual promises into material prosperity. The temple eisegesis is presumption — forcing God to act by misusing a promise. The kingdoms eisegesis grasps for power and ambition through a shortcut Christ refused. Each twists a text to serve a fleshly want.",
      modelEs: "Las tres eiségesis corresponden a las tres tentaciones de Satanás. La eiségesis del pan convierte las promesas espirituales en prosperidad material. La eiségesis del templo es presunción — forzar a Dios a actuar abusando de una promesa. La eiségesis de los reinos busca poder y ambición por un atajo que Cristo rechazó. Cada una tuerce un texto para servir un deseo carnal."
    },
    {
      textEn: "25. Explain the \"bread eisegesis\" with at least one example of a Bible verse commonly misused this way and why the misuse fails.",
      textEs: "25. Explique la «eiségesis del pan» con al menos un ejemplo de un versículo bíblico comúnmente mal usado de esta manera y por qué el mal uso falla.",
      kw_en: ["bread", "physical", "spiritual", "context", "promise", "material", "Jeremiah", "prosper"],
      kw_es: ["pan", "físico", "espiritual", "contexto", "promesa", "material", "Jeremías", "prosper"],
      modelEn: "The bread eisegesis reads physical, material bread where God meant spiritual provision. A verse like Jeremiah 29:11 gets twisted into a promise of wealth, but in context it spoke to exiles facing seventy years of hardship. The misuse fails because it ignores the context and confuses spiritual promise with material guarantee.",
      modelEs: "La eiségesis del pan lee pan físico y material donde Dios quiso decir provisión espiritual. Un versículo como Jeremías 29:11 se tuerce en promesa de riqueza, pero en su contexto habló a exiliados que enfrentaban setenta años de dificultad. El mal uso falla porque ignora el contexto y confunde la promesa espiritual con la garantía material."
    },
    {
      textEn: "26. Jesus answered each of Satan's three temptations with a quotation from Deuteronomy. Identify each Deuteronomy passage and what makes Jesus' use of it a model of contextual exegesis.",
      textEs: "26. Jesús respondió a cada una de las tres tentaciones de Satanás con una cita de Deuteronomio. Identifique cada pasaje de Deuteronomio y lo que hace que el uso por Jesús sea un modelo de exégesis contextual.",
      kw_en: ["Deuteronomy", "Moses", "wilderness", "context", "original", "Israel", "quote", "twist"],
      kw_es: ["Deuteronomio", "Moisés", "desierto", "contexto", "original", "Israel", "cita", "torcer"],
      modelEn: "Jesus answered each temptation with a quotation from Deuteronomy, the book Moses gave Israel in the wilderness. 'Man shall not live by bread alone,' 'You shall not tempt the Lord,' and 'You shall worship the Lord only.' Each quotation keeps its original meaning in context and refuses to be twisted — the model of contextual exegesis.",
      modelEs: "Jesús respondió a cada tentación con una cita de Deuteronomio, el libro que Moisés dio a Israel en el desierto. «No solo de pan vivirá el hombre», «No tentarás al Señor», y «Al Señor adorarás solo a Él». Cada cita conserva su significado original en contexto y se niega a ser torcida — el modelo de la exégesis contextual."
    },
    {
      textEn: "27. Tell the Faust legend in your own words and explain how it illustrates the cost of twisting Scripture for personal gain.",
      textEs: "27. Cuente la leyenda de Fausto con sus propias palabras y explique cómo ilustra el costo de torcer la Escritura por ganancia personal.",
      kw_en: ["Faust", "contract", "soul", "Satan", "gain", "twist", "blood", "bargain"],
      kw_es: ["Fausto", "contrato", "alma", "Satanás", "ganancia", "torcer", "sangre", "pacto"],
      modelEn: "Dr. Johann Faust signed a contract in his own blood: Satan would serve him twenty-four years, and then own his soul. He got everything he wanted, and in the end the devil took his soul. Eisegesis is a Faust bargain — the pastor who twists Scripture for gain, bigger crowds or flattering doctrine, signs a contract whose final clause is paid in souls.",
      modelEs: "El Dr. Johann Fausto firmó un contrato con su propia sangre: Satanás le serviría veinticuatro años, y luego sería dueño de su alma. Obtuvo todo lo que quería, y al final el diablo se llevó su alma. La eiségesis es un pacto de Fausto — el pastor que tuerce la Escritura por ganancia, multitudes más grandes o doctrina que halaga, firma un contrato cuya cláusula final se paga en almas."
    },
    {
      textEn: "28. Tell the Alexander-the-Great-and-the-deserter story and explain its application to the pastor who calls himself a minister of the Word.",
      textEs: "28. Cuente la historia de Alejandro Magno y el desertor y explique su aplicación al pastor que se llama a sí mismo ministro de la Palabra.",
      kw_en: ["Alexander", "deserter", "name", "change", "ways", "minister", "Word", "soldier"],
      kw_es: ["Alejandro", "desertor", "nombre", "cambi", "conducta", "ministro", "Palabra", "soldado"],
      modelEn: "A deserter brought before Alexander the Great shared the general's name. Alexander told him, 'Either change your name or change your ways.' The pastor who calls himself a minister of the Word bears a great name. He must live up to it — handle the Word faithfully — or stop claiming the name; he cannot keep the name while deserting the calling.",
      modelEs: "Un desertor llevado ante Alejandro Magno compartía el nombre del general. Alejandro le dijo: «O cambias tu nombre o cambias tu conducta.» El pastor que se llama a sí mismo ministro de la Palabra lleva un gran nombre. Debe estar a la altura — manejar la Palabra con fidelidad — o dejar de reclamar el nombre; no puede conservar el nombre mientras deserta del llamado."
    },
    {
      textEn: "29. List the practical exegetical steps the lesson recommends for the pastor's Monday morning, in their proper order.",
      textEs: "29. Enumere los pasos exegéticos prácticos que la lección recomienda para el lunes por la mañana del pastor, en su orden adecuado.",
      kw_en: ["pray", "read", "passage", "context", "question", "compare", "apply", "Monday"],
      kw_es: ["orar", "leer", "pasaje", "contexto", "pregunta", "comparar", "aplicar", "lunes"],
      modelEn: "The lesson recommends a Monday order: first pray over the passage, then read it carefully, study its context, ask honest questions of the text, compare it with other Scripture, and only then apply it. The steps move from prayer and reading to context and questions before any application is drawn.",
      modelEs: "La lección recomienda un orden para el lunes: primero orar sobre el pasaje, luego leerlo con cuidado, estudiar su contexto, hacer preguntas honestas al texto, compararlo con otra Escritura, y solo entonces aplicarlo. Los pasos van de la oración y la lectura al contexto y las preguntas antes de sacar cualquier aplicación."
    },
    {
      textEn: "30. Why does the lesson call exegesis \"the first principle\" of hermeneutics, and what happens to a pastor's ministry if this principle is ignored?",
      textEs: "30. ¿Por qué llama la lección a la exégesis «el primer principio» de la hermenéutica, y qué le pasa al ministerio del pastor si este principio es ignorado?",
      kw_en: ["first", "principle", "foundation", "preach", "himself", "replace", "shape", "meaning"],
      kw_es: ["primer", "principio", "fundament", "predic", "mismo", "reemplaz", "moldea", "significado"],
      modelEn: "Exegesis is called the first principle because it is the foundation every other principle rests on. If the pastor ignores it, he ends up preaching himself instead of the text — replacing God's meaning with his own and shaping Scripture to fit his agenda. Without exegesis the whole ministry drifts into eisegesis.",
      modelEs: "La exégesis se llama el primer principio porque es el fundamento sobre el cual descansan los demás principios. Si el pastor lo ignora, termina predicándose a sí mismo en lugar del texto — reemplazando el significado de Dios con el suyo y moldeando la Escritura a su agenda. Sin exégesis, todo el ministerio se desliza hacia la eiségesis."
    }
  ];
