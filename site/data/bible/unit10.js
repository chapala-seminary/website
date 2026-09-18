/* CTSBible - unit 10: per-unit configuration and content. */

const UNIT = 10;

const COURSE_PREFIX = 'cts_bible_u10_';

const mcQuestions = [
  { textEn:`Unit 10 gathers the four witnesses. They are:`, textEs:`La Unidad 10 reúne a los cuatro testigos. Son:`,
    optionsEn:[`The right books, the right words, the real events, the real stage`,`Faith, hope, love, works`,`The four Gospels`,`Moses, David, Isaiah, Paul`],
    optionsEs:[`Los libros correctos, las palabras correctas, los eventos reales, el escenario real`,`Fe, esperanza, amor, obras`,`Los cuatro Evangelios`,`Moisés, David, Isaías, Pablo`],
    correct:0, explanationEn:`The four witnesses: right books, right words, real events, real stage.`, explanationEs:`Los cuatro testigos: libros correctos, palabras correctas, eventos reales, escenario real.` },

  { textEn:`The maxim "correlation, not proof" means no single witness:`, textEs:`La máxima "correlación, no prueba" significa que ningún testigo por sí solo:`,
    optionsEn:[`Is trustworthy`,`Proves the whole Bible by itself`,`Matters`,`Should be examined`],
    optionsEs:[`Es confiable`,`Prueba toda la Biblia por sí mismo`,`Importa`,`Debe examinarse`],
    correct:1, explanationEn:`No single witness proves the whole Bible by itself.`, explanationEs:`Ningún testigo prueba toda la Biblia por sí mismo.` },

  { textEn:`How does a cumulative case gain its force?`, textEs:`¿Cómo gana su fuerza un caso acumulativo?`,
    optionsEn:[`From one knockout proof`,`From a single manuscript`,`From the convergence of many independent witnesses pointing the same way`,`From ignoring the evidence`],
    optionsEs:[`De una prueba de golpe único`,`De un solo manuscrito`,`De la convergencia de muchos testigos independientes que apuntan en la misma dirección`,`De ignorar la evidencia`],
    correct:2, explanationEn:`Its force comes from the convergence of many independent witnesses.`, explanationEs:`Su fuerza viene de la convergencia de muchos testigos independientes.` },

  { textEn:`The image the unit uses for the cumulative case is:`, textEs:`La imagen que usa la unidad para el caso acumulativo es:`,
    optionsEn:[`A single thread easily broken`,`An empty room`,`A house of cards`,`A hundred threads braided into a rope that holds`],
    optionsEs:[`Un solo hilo fácilmente roto`,`Un cuarto vacío`,`Un castillo de naipes`,`Cien hilos trenzados en una cuerda que sostiene`],
    correct:3, explanationEn:`Many threads braided together make a rope that holds.`, explanationEs:`Muchos hilos trenzados juntos hacen una cuerda que sostiene.` },

  { textEn:`The course returns to which text, with which Luke states his purpose?`, textEs:`¿A cuál texto vuelve el curso, con el cual Lucas enuncia su propósito?`,
    optionsEn:[`John 3:16`,`Genesis 1:1`,`Luke 1:1-4 — "that you may know the certainty"`,`Revelation 22`],
    optionsEs:[`Juan 3:16`,`Génesis 1:1`,`Lucas 1:1-4 — "para que conozcas la certeza"`,`Apocalipsis 22`],
    correct:2, explanationEn:`Luke 1:1-4: "that you may know the certainty."`, explanationEs:`Lucas 1:1-4: "para que conozcas la certeza".` },

  { textEn:`Luke wrote his orderly, investigated account so that Theophilus would:`, textEs:`Lucas escribió su relato ordenado e investigado para que Teófilo:`,
    optionsEn:[`Know the certainty of the things he was taught`,`Feel comforted only`,`Doubt the story`,`Ignore eyewitnesses`],
    optionsEs:[`Conociera la certeza de las cosas que le fueron enseñadas`,`Solo se sintiera reconfortado`,`Dudara de la historia`,`Ignorara a los testigos oculares`],
    correct:0, explanationEn:`Luke wrote so Theophilus would know the certainty.`, explanationEs:`Lucas escribió para que Teófilo conociera la certeza.` },

  { textEn:`Does the believer's certainty ultimately rest on the cumulative evidence?`, textEs:`¿Descansa la certeza del creyente, en última instancia, sobre la evidencia acumulada?`,
    optionsEn:[`Yes, entirely`,`No — evidence is the servant; certainty rests on the God who spoke and the Spirit's witness`,`No, evidence is worthless`,`Certainty is impossible`],
    optionsEs:[`Sí, enteramente`,`No — la evidencia es la sierva; la certeza descansa en el Dios que habló y el testimonio del Espíritu`,`No, la evidencia es inútil`,`La certeza es imposible`],
    correct:1, explanationEn:`Evidence is the servant; certainty rests on God and the Spirit's witness.`, explanationEs:`La evidencia es la sierva; la certeza descansa en Dios y el testimonio del Espíritu.` },

  { textEn:`Why is certainty resting on evidence alone unstable?`, textEs:`¿Por qué es inestable la certeza que descansa solo en la evidencia?`,
    optionsEn:[`Evidence is always false`,`Evidence never changes`,`There is no evidence`,`What can be argued up can be argued down`],
    optionsEs:[`La evidencia siempre es falsa`,`La evidencia nunca cambia`,`No hay evidencia`,`Lo que puede argumentarse a favor puede argumentarse en contra`],
    correct:3, explanationEn:`What can be argued up can be argued down.`, explanationEs:`Lo que puede argumentarse a favor puede argumentarse en contra.` },

  { textEn:`What do the four witnesses actually accomplish for faith?`, textEs:`¿Qué logran realmente los cuatro testigos para la fe?`,
    optionsEn:[`They create saving faith by themselves`,`They replace the Spirit`,`They remove obstacles and confirm, silencing the charge that faith is blind`,`They prove every miracle`],
    optionsEs:[`Crean la fe salvadora por sí mismos`,`Reemplazan al Espíritu`,`Quitan obstáculos y confirman, silenciando la acusación de que la fe es ciega`,`Prueban cada milagro`],
    correct:2, explanationEn:`They remove obstacles, confirm, and silence the charge that faith is blind.`, explanationEs:`Quitan obstáculos, confirman, y silencian la acusación de que la fe es ciega.` },

  { textEn:`The headline the whole course moves toward is:`, textEs:`El titular hacia el cual se mueve todo el curso es:`,
    optionsEn:[`The absolute authority of the Word in your hands`,`Inerrancy and its qualifications`,`That the autographs were perfect`,`That evidence is the foundation of faith`],
    optionsEs:[`La autoridad absoluta de la Palabra en tus manos`,`La inerrancia y sus matices`,`Que los autógrafos eran perfectos`,`Que la evidencia es el fundamento de la fe`],
    correct:0, explanationEn:`The headline is the absolute authority of the Word in your hands.`, explanationEs:`El titular es la autoridad absoluta de la Palabra en tus manos.` },

  { textEn:`On what does the unit rest the Bible's authority?`, textEs:`¿Sobre qué descansa la unidad la autoridad de la Biblia?`,
    optionsEn:[`On first proving every word yourself`,`On the lost original manuscripts alone`,`On scholarly consensus`,`On God's giving and preserving His Word, so authority travels into the copy`],
    optionsEs:[`En que primero pruebes cada palabra tú mismo`,`En los manuscritos originales perdidos por sí solos`,`En el consenso erudito`,`En que Dios dio y preservó su Palabra, de modo que la autoridad desciende a la copia`],
    correct:3, explanationEn:`Authority rests on God's giving and preserving His Word — it travels into the copy.`, explanationEs:`La autoridad descansa en que Dios dio y preservó su Palabra — desciende a la copia.` },

  { textEn:`When the apostles preached, they preached:`, textEs:`Cuando los apóstoles predicaban, predicaban:`,
    optionsEn:[`Only from the original autographs`,`From copies and translations, with the full authority of God`,`Without any Scripture`,`With no authority`],
    optionsEs:[`Solo de los autógrafos originales`,`De copias y traducciones, con la plena autoridad de Dios`,`Sin ninguna Escritura`,`Sin ninguna autoridad`],
    correct:1, explanationEn:`They preached from copies and translations, with full authority.`, explanationEs:`Predicaban de copias y traducciones, con plena autoridad.` },

  { textEn:`The unit's image contrasts the Word as:`, textEs:`La imagen de la unidad contrasta la Palabra como:`,
    optionsEn:[`A fortress you defend inch by inch vs. a throne from which God speaks`,`A library vs. a museum`,`A river vs. a mountain`,`A map vs. a compass`],
    optionsEs:[`Una fortaleza que defiendes palmo a palmo vs. un trono desde el cual Dios habla`,`Una biblioteca vs. un museo`,`Un río vs. una montaña`,`Un mapa vs. una brújula`],
    correct:0, explanationEn:`Not a fortress to defend, but a throne from which God speaks.`, explanationEs:`No una fortaleza que defender, sino un trono desde el cual Dios habla.` },

  { textEn:`What does the man in the pew actually hold?`, textEs:`¿Qué tiene realmente el hombre en la banca?`,
    optionsEn:[`The original autograph`,`A distant echo, not God's Word`,`A worthless copy`,`A translation of a copy — which is nonetheless God's preserved, authoritative Word`],
    optionsEs:[`El autógrafo original`,`Un eco distante, no la Palabra de Dios`,`Una copia sin valor`,`Una traducción de una copia — que es no obstante la Palabra preservada y autoritativa de Dios`],
    correct:3, explanationEn:`A translation of a copy — yet it is God's preserved, authoritative Word.`, explanationEs:`Una traducción de una copia — pero es la Palabra preservada y autoritativa de Dios.` },

  { textEn:`God's preservation promise was:`, textEs:`La promesa de preservación de Dios fue:`,
    optionsEn:[`To hand every believer the autograph`,`To preserve His Word so that what you hold is His authoritative Word`,`That copies would be perfect`,`That translation is impossible`],
    optionsEs:[`Entregar a cada creyente el autógrafo`,`Preservar su Palabra de modo que lo que tienes es su Palabra autoritativa`,`Que las copias serían perfectas`,`Que la traducción es imposible`],
    correct:1, explanationEn:`God promised to preserve His Word — what you hold is His authoritative Word.`, explanationEs:`Dios prometió preservar su Palabra — lo que tienes es su Palabra autoritativa.` },

  { textEn:`Why did the course take the harder road of honest candor?`, textEs:`¿Por qué tomó el curso el camino más difícil de la franqueza honesta?`,
    optionsEn:[`To make the Bible look weak`,`To please skeptics`,`So that faith would not shatter at the first hard question`,`To avoid the evidence`],
    optionsEs:[`Para hacer que la Biblia parezca débil`,`Para complacer a los escépticos`,`Para que la fe no se hiciera pedazos ante la primera pregunta difícil`,`Para evitar la evidencia`],
    correct:2, explanationEn:`So that faith would not shatter at the first hard question.`, explanationEs:`Para que la fe no se hiciera pedazos ante la primera pregunta difícil.` },

  { textEn:`The "settled thing" the course stands on is:`, textEs:`Lo "establecido" sobre lo cual se mantiene el curso es:`,
    optionsEn:[`That every dispute is resolved`,`That the autographs are recovered`,`That evidence proves the resurrection`,`That God has spoken, has preserved His Word, and it is worthy of absolute trust`],
    optionsEs:[`Que toda disputa está resuelta`,`Que los autógrafos han sido recuperados`,`Que la evidencia prueba la resurrección`,`Que Dios ha hablado, ha preservado su Palabra, y es digna de confianza absoluta`],
    correct:3, explanationEn:`God has spoken and preserved His Word, worthy of absolute trust.`, explanationEs:`Dios ha hablado y preservado su Palabra, digna de confianza absoluta.` },

  { textEn:`The fruit of honest confidence is:`, textEs:`El fruto de la confianza honesta es:`,
    optionsEn:[`A nervous certainty that fears the next question`,`A settled certainty that has faced the questions and stands`,`Blind faith`,`Constant doubt`],
    optionsEs:[`Una certeza nerviosa que teme la próxima pregunta`,`Una certeza asentada que ha enfrentado las preguntas y se mantiene`,`Fe ciega`,`Duda constante`],
    correct:1, explanationEn:`A settled certainty that has faced the questions and stands.`, explanationEs:`Una certeza asentada que ha enfrentado las preguntas y se mantiene.` },

  { textEn:`The course's closing command, from 1 Thessalonians 5:21, is:`, textEs:`El mandato final del curso, de 1 Tesalonicenses 5:21, es:`,
    optionsEn:[`"Prove all things; hold fast that which is good"`,`"Judge not"`,`"Be still and know"`,`"Doubt everything"`],
    optionsEs:[`"Examinadlo todo; retened lo bueno"`,`"No juzguéis"`,`"Estad quietos y conoced"`,`"Dudad de todo"`],
    correct:0, explanationEn:`"Prove all things; hold fast that which is good" (1 Thess 5:21).`, explanationEs:`"Examinadlo todo; retened lo bueno" (1 Tes 5:21).` },

  { textEn:`The final answer to the driving question — can we trust the Bible we hold — is:`, textEs:`La respuesta final a la pregunta motriz — ¿podemos confiar en la Biblia que tenemos — es:`,
    optionsEn:[`No`,`Only scholars can`,`Yes, on the evidence and the promise of God`,`It cannot be known`],
    optionsEs:[`No`,`Solo los eruditos pueden`,`Sí, sobre la evidencia y la promesa de Dios`,`No puede saberse`],
    correct:2, explanationEn:`Yes — on the evidence and on the promise of God.`, explanationEs:`Sí — sobre la evidencia y sobre la promesa de Dios.` }
];

const saQuestions = [
  { promptEn:`Name the four witnesses of the course and what each established.`,
    promptEs:`Nombra a los cuatro testigos del curso y lo que cada uno estableció.`,
    keywords:[`canon`,`text`,`texto`,`archaeolog`,`arqueolog`,`geography`,`geograf`,`witness`],
    modelEn:`The first witness, the canon, gave us the right books, recognized and not invented. The second, the text, gave us the right words, preserved in abundance. The third, archaeology, showed the real events, the world of the Bible grounded in real soil. The fourth, geography, showed the real stage, a land so exactly known one can walk the Bible with a map. Together they establish that the Bible is a true and faithfully kept record.`,
    modelEs:`El primer testigo, el canon, nos dio los libros correctos, reconocidos y no inventados. El segundo, el texto, nos dio las palabras correctas, preservadas en abundancia. El tercero, la arqueología, mostró los eventos reales, el mundo de la Biblia arraigado en tierra real. El cuarto, la geografía, mostró el escenario real, una tierra tan exactamente conocida que uno puede caminar la Biblia con un mapa. Juntos establecen que la Biblia es un registro verdadero y fielmente guardado.` },

  { promptEn:`Explain how a cumulative case gains its force, using the unit's image.`,
    promptEs:`Explica cómo un caso acumulativo gana su fuerza, usando la imagen de la unidad.`,
    keywords:[`cumulat`,`acumul`,`correlat`,`correlac`,`thread`,`hilo`,`rope`,`cuerda`],
    modelEn:`No single witness proves the Bible — correlation, not proof — but witnesses testify together, and their agreement has a force no one has alone. In a court, a single thread can be explained away, but a hundred threads braided together make a rope that holds. So the right books, the faithful words, the real events, and the real stage are each a strand, but together they make an overwhelming case. The cumulative weight is far greater than the sum of the parts.`,
    modelEs:`Ningún testigo por sí solo prueba la Biblia — correlación, no prueba — pero los testigos testifican juntos, y su acuerdo tiene una fuerza que ninguno tiene solo. En un tribunal, un solo hilo puede explicarse, pero cien hilos trenzados juntos hacen una cuerda que sostiene. Así los libros correctos, las palabras fieles, los eventos reales y el escenario real son cada uno una hebra, pero juntos hacen un caso abrumador. El peso acumulado es mucho mayor que la suma de las partes.` },

  { promptEn:`What is the purpose Luke states in Luke 1:1-4, and how does the course fulfill it?`,
    promptEs:`¿Cuál es el propósito que Lucas enuncia en Lucas 1:1-4, y cómo lo cumple el curso?`,
    keywords:[`certaint`,`certez`,`luke`,`lucas`,`eyewitness`,`ocular`,`investigat`,`investig`],
    modelEn:`Luke tells Theophilus that many had written, that he had carefully investigated everything from the first following eyewitnesses, and had set it in orderly account — so that Theophilus would know the certainty of the things he was taught. The key word is certainty. Luke wrote not for a comforting feeling but for certainty. The course fulfills the same purpose: having examined the books, words, events, and land, it can tell every believer, you may know the certainty.`,
    modelEs:`Lucas le dice a Teófilo que muchos habían escrito, que él había investigado cuidadosamente todo desde el principio siguiendo a testigos oculares, y lo había puesto en relato ordenado — para que Teófilo conociera la certeza de las cosas que le fueron enseñadas. La palabra clave es certeza. Lucas escribió no para un sentimiento reconfortante sino para la certeza. El curso cumple el mismo propósito: habiendo examinado los libros, las palabras, los eventos y la tierra, puede decir a todo creyente, puedes conocer la certeza.` },

  { promptEn:`Does the believer's certainty rest on the cumulative evidence? Explain the unit's answer.`,
    promptEs:`¿Descansa la certeza del creyente sobre la evidencia acumulada? Explica la respuesta de la unidad.`,
    keywords:[`evidence`,`evidenc`,`certaint`,`certez`,`servant`,`sierv`,`foundation`,`fundament`],
    modelEn:`No — the evidence is the servant, not the master. If certainty rested on archaeology it would rise and fall with the next dig; what can be argued up can be argued down. The true ground of certainty is that God breathed out the Scripture and His Spirit bears witness that this is His Word. The evidence does not create that certainty; it clears away obstacles, confirms it, and silences the charge that faith is blind. Evidence serves faith; it is not its foundation.`,
    modelEs:`No — la evidencia es la sierva, no la señora. Si la certeza descansara en la arqueología subiría y caería con la próxima excavación; lo que puede argumentarse a favor puede argumentarse en contra. El verdadero fundamento de la certeza es que Dios exhaló la Escritura y su Espíritu da testimonio de que esta es su Palabra. La evidencia no crea esa certeza; despeja los obstáculos, la confirma, y silencia la acusación de que la fe es ciega. La evidencia sirve a la fe; no es su fundamento.` },

  { promptEn:`What is the headline the whole course moves toward, and what does it NOT claim?`,
    promptEs:`¿Cuál es el titular hacia el cual se mueve todo el curso, y qué NO afirma?`,
    keywords:[`authorit`,`autorid`,`absolute`,`absolut`,`preserv`,`throne`,`trono`,`fortress`],
    modelEn:`The headline is the absolute authority of the Word in your hands. It does not claim that you must first prove every word before you may trust it, and it does not rest that authority on the lost original manuscripts. It claims that because God gave and preserved His Word, His authority travels down through faithful copying and translation into the Bible you hold. The Word is not a fortress to defend inch by inch but a throne from which God speaks.`,
    modelEs:`El titular es la autoridad absoluta de la Palabra en tus manos. No afirma que debas primero probar cada palabra antes de poder confiar en ella, y no descansa esa autoridad en los manuscritos originales perdidos. Afirma que porque Dios dio y preservó su Palabra, su autoridad desciende a través de la copia y traducción fieles hasta la Biblia que tienes. La Palabra no es una fortaleza para defender palmo a palmo sino un trono desde el cual Dios habla.` },

  { promptEn:`Speak to the man in the pew: what does he hold, and what is the honest promise?`,
    promptEs:`Habla al hombre en la banca: ¿qué tiene, y cuál es la promesa honesta?`,
    keywords:[`translat`,`traducc`,`copy`,`copia`,`preserv`,`promise`,`promet`,`obey`],
    modelEn:`He does not hold the original that Moses or Paul wrote; no one does. He holds a translation, an NKJV or a Reina-Valera, of a copy of a copy, and the course is honest about that. But God did not promise to hand him the autograph; He promised to preserve His Word — and He has done so faithfully and abundantly, so that the Bible open before him is the preserved, authoritative Word of God. He should read it, believe it, and obey it as such.`,
    modelEs:`No tiene el original que Moisés o Pablo escribió; nadie lo tiene. Tiene una traducción, una NKJV o una Reina-Valera, de una copia de una copia, y el curso es honesto en eso. Pero Dios no prometió entregarle el autógrafo; prometió preservar su Palabra — y lo ha hecho fiel y abundantemente, de modo que la Biblia abierta ante él es la Palabra preservada y autoritativa de Dios. Debe leerla, creerla, y obedecerla como tal.` },

  { promptEn:`Why did the course take the harder road of honest candor, and what is its fruit?`,
    promptEs:`¿Por qué tomó el curso el camino más difícil de la franqueza honesta, y cuál es su fruto?`,
    keywords:[`overclaim`,`exager`,`gnat`,`mosquit`,`certaint`,`certez`,`settled`,`asentad`],
    modelEn:`The course could have overclaimed, crying 'proven!' at every turn and straining the gnat, and it would have felt stronger for a season — but it would have left a faith that shatters at the first hard question. Instead it conceded what was genuinely open, refused what was merely assumed, and stood on what is settled: God has spoken and preserved His Word, worthy of absolute trust. The fruit is not a nervous certainty that fears the next question, but a settled certainty that has faced the questions and stands.`,
    modelEs:`El curso pudo haber exagerado, clamando '¡probado!' a cada paso y colando el mosquito, y habría parecido más fuerte por una temporada — pero habría dejado una fe que se hace pedazos ante la primera pregunta difícil. En cambio concedió lo genuinamente abierto, rechazó lo meramente supuesto, y se mantuvo en lo establecido: Dios ha hablado y preservado su Palabra, digna de confianza absoluta. El fruto no es una certeza nerviosa que teme la próxima pregunta, sino una certeza asentada que ha enfrentado las preguntas y se mantiene.` },

  { promptEn:`On what does the unit ultimately rest the Bible's absolute authority?`,
    promptEs:`¿Sobre qué descansa la unidad, en última instancia, la autoridad absoluta de la Biblia?`,
    keywords:[`authorit`,`autorid`,`preserv`,`copy`,`copia`,`translat`,`traducc`,`throne`],
    modelEn:`Not on the believer first proving every word, and not on the lost original manuscripts alone, but on the fact that God gave His Word and God has preserved it. Because of this, His authority travels down through faithful copying and translation into the very Bible in the believer's hands. The apostles themselves preached from copies and translations with the full authority of God, and so may we. The Word is a throne from which God still speaks, with full authority, today.`,
    modelEs:`No en que el creyente primero pruebe cada palabra, ni en los manuscritos originales perdidos por sí solos, sino en el hecho de que Dios dio su Palabra y Dios la ha preservado. Por esto, su autoridad desciende a través de la copia y traducción fieles hasta la mismísima Biblia en las manos del creyente. Los apóstoles mismos predicaron de copias y traducciones con la plena autoridad de Dios, y así podemos nosotros. La Palabra es un trono desde el cual Dios aún habla, con plena autoridad, hoy.` },

  { promptEn:`State the course's closing command and the final answer to the driving question.`,
    promptEs:`Enuncia el mandato final del curso y la respuesta final a la pregunta motriz.`,
    keywords:[`prove`,`examin`,`hold`,`reten`,`trust`,`confi`,`evidence`,`evidenc`],
    modelEn:`The closing command, from 1 Thessalonians 5:21, is: Prove all things; hold fast that which is good. Having proved the Bible — the books, the words, the events, the land — and found it good and true and kept, the believer is to hold it fast, not timidly but boldly. And the final answer to the question with which the course began, can we trust the Bible we hold, is yes — on the evidence and on the promise of God.`,
    modelEs:`El mandato final, de 1 Tesalonicenses 5:21, es: Examinadlo todo; retened lo bueno. Habiendo examinado la Biblia — los libros, las palabras, los eventos, la tierra — y hallándola buena y verdadera y guardada, el creyente ha de retenerla firmemente, no con timidez sino con audacia. Y la respuesta final a la pregunta con que el curso comenzó, ¿podemos confiar en la Biblia que tenemos?, es sí — sobre la evidencia y sobre la promesa de Dios.` },

  { promptEn:`In your own words, summarize what this whole course has shown about whether the Bible we hold can be trusted.`,
    promptEs:`Con tus palabras, resume lo que todo este curso ha mostrado sobre si la Biblia que tenemos puede ser confiada.`,
    keywords:[`witness`,`testig`,`cumulat`,`acumul`,`preserv`,`authorit`,`autorid`,`certaint`],
    modelEn:`The course called four witnesses — the canon, the text, archaeology, and geography — and each testified honestly, conceding open questions and refusing overclaims, yet together building an overwhelming cumulative case that the Bible is a true and faithfully preserved record. But the real ground of certainty is that God spoke it and preserved it, so that His absolute authority travels into the translation in my hands. On the evidence and the promise of God, the Bible I hold can be trusted.`,
    modelEs:`El curso llamó a cuatro testigos — el canon, el texto, la arqueología y la geografía — y cada uno testificó con honestidad, concediendo las preguntas abiertas y rechazando las exageraciones, y sin embargo juntos construyendo un caso acumulado abrumador de que la Biblia es un registro verdadero y fielmente preservado. Pero el verdadero fundamento de la certeza es que Dios la habló y la preservó, de modo que su autoridad absoluta desciende hasta la traducción en mis manos. Sobre la evidencia y la promesa de Dios, la Biblia que tengo puede ser confiada.` }
];
