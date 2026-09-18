/* CTSHermeneutics - unit 10: per-unit configuration and content. */

const UNIT = 10;

const NEXT_UNIT_URL = "CTSHermeneuticsUnit11.html";

const PREV_UNIT_URL = "CTSHermeneuticsUnit9.html";

const IS_FINAL_UNIT = false;

const SHOW_REGISTRATION = false;

const mcQuestions = [
    {
      textEn: "1. The central thesis of this unit is:",
      textEs: "1. La tesis central de esta unidad es:",
      optionsEn: ["A. The goal of hermeneutics is mastering the original languages","B. The goal of hermeneutics is academic credentialing","C. The goal of hermeneutics is transformation — a life and a congregation re-made by the God who breathed out the Book","D. The goal of hermeneutics is doctrinal precision alone"],
      optionsEs: ["A. La meta de la hermenéutica es dominar los idiomas originales","B. La meta de la hermenéutica es la acreditación académica","C. La meta de la hermenéutica es la transformación — una vida y una congregación rehechas por el Dios que exhaló el Libro","D. La meta de la hermenéutica es la precisión doctrinal sola"],
      correct: "C",
      correctFeedbackEn: "Correct. We do not interpret the text so that we can master the text. We interpret the text so that the text can master us. Knowledge that does not produce transformation has missed the goal of every prior unit in this course.",
      correctFeedbackEs: "Correcto. No interpretamos el texto para que podamos dominar el texto. Interpretamos el texto para que el texto pueda dominarnos. El conocimiento que no produce transformación ha perdido la meta de cada unidad anterior en este curso.",
      incorrectFeedbackEn: "Languages, credentialing, and doctrinal precision are all means, not ends. The GOAL of hermeneutics is TRANSFORMATION — the text re-making lives and congregations. Stop short of transformation, and the previous nine units have not been completed.",
      incorrectFeedbackEs: "Los idiomas, la acreditación, y la precisión doctrinal todos son medios, no fines. La META de la hermenéutica es la TRANSFORMACIÓN — el texto rehaciendo vidas y congregaciones. Detenerse antes de la transformación significa que las nueve unidades anteriores no se han completado."
    },
    {
      textEn: "2. According to James 1:22, the hearer who is not a doer of the word is:",
      textEs: "2. Según Santiago 1:22, el que oye y no hace la palabra:",
      optionsEn: ["A. Praised for his careful listening","B. Deceiving himself — reasoning his way into thinking that hearing was enough","C. Excused on account of his good intentions","D. Promoted to leadership in the church"],
      optionsEs: ["A. Es alabado por su escucha cuidadosa","B. Se engaña a sí mismo — razonándose para pensar que el oír era suficiente","C. Es excusado por sus buenas intenciones","D. Es promovido al liderazgo en la iglesia"],
      correct: "B",
      correctFeedbackEn: "Correct. James is blunt. The hearer who never obeys argues himself into thinking that hearing was enough. It never was. The Greek word James uses, paralogizomenoi (from paralogizomai), means to reason your way into a false conclusion. Hearing without doing is self-deception.",
      correctFeedbackEs: "Correcto. Santiago es contundente. El que oye y nunca obedece se argumenta para pensar que el oír era suficiente. Nunca lo fue. La palabra griega que usa Santiago, paralogizomenoi (de paralogizomai), significa razonar hasta llegar a una conclusión falsa. Oír sin hacer es auto-engaño.",
      incorrectFeedbackEn: "James 1:22 does not praise, excuse, or promote the non-doing hearer. It says he is DECEIVING HIMSELF. The Greek word implies false reasoning — talking yourself into thinking that hearing alone was enough. The verse demands obedience, not merely attention.",
      incorrectFeedbackEs: "Santiago 1:22 no alaba, ni excusa, ni promueve al oyente que no hace. Dice que se ENGAÑA A SÍ MISMO. La palabra griega implica razonamiento falso — convencerse de que el oír solo era suficiente. El versículo exige obediencia, no meramente atención."
    },
    {
      textEn: "3. The lesson tells the story of Misha, a Russian orphan, who put TWO babies in his manger. Misha explained that:",
      textEs: "3. La lección cuenta la historia de Misha, un huérfano ruso, que puso DOS bebés en su pesebre. Misha explicó que:",
      optionsEn: ["A. Jesus had asked him if he had a place to stay, and Misha had climbed into the manger to keep Jesus warm — for always","B. He had miscounted the felt pieces","C. The orphanage had given him two doll-babies","D. The translator had told him to make two babies"],
      optionsEs: ["A. Jesús le había preguntado si tenía un lugar para quedarse, y Misha se había metido en el pesebre para mantener a Jesús caliente — para siempre","B. Había contado mal los pedazos de fieltro","C. El orfanato le había dado dos muñecos-bebés","D. El traductor le había dicho que hiciera dos bebés"],
      correct: "A",
      correctFeedbackEn: "Correct. The text reached its goal in Misha's soul. He did not parse the Greek of Luke 2 — he did not need to. The Christmas story had landed, and his life now had a Person in it who had not been there an hour before. That is the goal of hermeneutics in one small boy.",
      correctFeedbackEs: "Correcto. El texto alcanzó su meta en el alma de Misha. No analizó el griego de Lucas 2 — no necesitaba hacerlo. La historia de Navidad había aterrizado, y su vida ahora tenía una Persona en ella que no había estado allí una hora antes. Ésa es la meta de la hermenéutica en un pequeño niño.",
      incorrectFeedbackEn: "Misha's two babies were not a miscount, an extra doll, or a translator's instruction. They were JESUS AND MISHA — the orphan climbing into the manger to keep Jesus warm forever. The story is the lesson's central illustration of what transformational interpretation looks like.",
      incorrectFeedbackEs: "Los dos bebés de Misha no fueron un error de conteo, ni un muñeco extra, ni una instrucción del traductor. Fueron JESÚS Y MISHA — el huérfano metiéndose en el pesebre para mantener a Jesús caliente para siempre. La historia es la ilustración central de la lección de cómo se ve la interpretación transformadora."
    },
    {
      textEn: "4. The Reni dome painting in Rome is used in this lesson to illustrate that:",
      textEs: "4. La pintura de la cúpula de Reni en Roma se usa en esta lección para ilustrar que:",
      optionsEn: ["A. Catholic art is superior to Protestant interpretation","B. Christ is the mirror in which the Father's character becomes clear — what is hazy in the dome of heaven becomes visible in the face of Jesus","C. Italian Renaissance theology is the standard for hermeneutics","D. Domes are easier to read than ceilings"],
      optionsEs: ["A. El arte católico es superior a la interpretación protestante","B. Cristo es el espejo en el cual el carácter del Padre se vuelve claro — lo que es nebuloso en la cúpula del cielo se vuelve visible en el rostro de Jesús","C. La teología renacentista italiana es el estándar para la hermenéutica","D. Las cúpulas son más fáciles de leer que los techos"],
      correct: "B",
      correctFeedbackEn: "Correct. Strain your neck at the dome and the fresco is hazy. Look down into the mirror and the painting is sharp. Christ is that mirror. \"If you have seen Me, you have seen the Father.\" Hermeneutics that does not show the Father in Jesus' face is straining at the dome.",
      correctFeedbackEs: "Correcto. Fuerce el cuello hacia la cúpula y el fresco está nebuloso. Mire hacia abajo al espejo y la pintura está nítida. Cristo es ese espejo. «El que me ha visto, ha visto al Padre». La hermenéutica que no muestra al Padre en el rostro de Jesús está forzando el cuello hacia la cúpula.",
      incorrectFeedbackEn: "The Reni dome is not about Catholic art, Renaissance theology, or architecture. It is a HERMENEUTICAL IMAGE: Jesus is the mirror in which the otherwise-hazy fresco of God's character becomes clear. Look at Christ, not the dome.",
      incorrectFeedbackEs: "La cúpula de Reni no se trata del arte católico, ni de la teología renacentista, ni de la arquitectura. Es una IMAGEN HERMENÉUTICA: Jesús es el espejo en el cual el fresco de otro modo nebuloso del carácter de Dios se vuelve claro. Mire a Cristo, no a la cúpula."
    },
    {
      textEn: "5. In Bret Harte's \"The Luck of Roaring Camp,\" the rough mining town transforms because:",
      textEs: "5. En «La fortuna de Campamento Rugiente» de Bret Harte, el rudo pueblo minero se transforma porque:",
      optionsEn: ["A. A baby girl was let into their camp, and the cradle, the rags, the floor, the walls, and finally the men themselves were all transformed in cascade","B. The men were arrested by the territorial sheriff","C. The mining company imposed new rules","D. Cherokee Sal returned from the dead"],
      optionsEs: ["A. Una niña fue dejada entrar a su campamento, y la cuna, los trapos, el piso, las paredes, y finalmente los hombres mismos fueron todos transformados en cascada","B. Los hombres fueron arrestados por el sheriff territorial","C. La compañía minera impuso nuevas reglas","D. Sal la Cheroqui regresó de la muerte"],
      correct: "A",
      correctFeedbackEn: "Correct. One quiet life let in changes everything. The cradle does not match the rags; the floor does not match the cradle; the walls do not match the floor; the brawling wakes the baby. Within a year the whole camp is unrecognizable — not because anyone imposed a discipline, but because they welcomed her in. So with Christ.",
      correctFeedbackEs: "Correcto. Una vida silenciosa dejada entrar cambia todo. La cuna no combina con los trapos; el piso no combina con la cuna; las paredes no combinan con el piso; la pelea despierta a la bebé. En un año el campamento entero es irreconocible — no porque alguien impusiera una disciplina, sino porque la recibieron a ella. Así con Cristo.",
      incorrectFeedbackEn: "Roaring Camp was not changed by external force, imposed rules, or resurrection. It was changed by a BABY GIRL let into the camp. The cascade of transformation — cradle, rags, floor, walls, fighting, hands — is the model for how Christ transforms a life: welcome Him in, and everything else follows.",
      incorrectFeedbackEs: "Campamento Rugiente no fue cambiado por fuerza externa, ni reglas impuestas, ni resurrección. Fue cambiado por UNA NIÑA dejada entrar al campamento. La cascada de transformación — cuna, trapos, piso, paredes, pelea, manos — es el modelo de cómo Cristo transforma una vida: recíbalo a Él, y todo lo demás sigue."
    },
    {
      textEn: "6. The lesson identifies the first error that stops transformation as:",
      textEs: "6. La lección identifica el primer error que detiene la transformación como:",
      optionsEn: ["A. Information without transformation — the Pharisee who can quote Moses chapter and verse but cannot see the Christ standing in front of him","B. Reading too quickly","C. Listening to only one preacher","D. Memorizing too many verses"],
      optionsEs: ["A. Información sin transformación — el fariseo que puede citar a Moisés capítulo y versículo pero no puede ver al Cristo parado frente a él","B. Leer demasiado rápido","C. Escuchar solo a un predicador","D. Memorizar demasiados versículos"],
      correct: "A",
      correctFeedbackEn: "Correct. Jesus said it Himself: \"You search the Scriptures, for in them you think you have eternal life... but you are not willing to come to Me.\" All their interpretation produced no transformation because their interpretation never delivered them to the Person the Scriptures were about.",
      correctFeedbackEs: "Correcto. Jesús lo dijo Él mismo: «escudriñad las Escrituras, porque á vosotros os parece que en ellas tenéis la vida eterna... y no queréis venir á mí». Toda su interpretación no produjo transformación porque su interpretación nunca los entregó a la Persona de quien las Escrituras hablaban.",
      incorrectFeedbackEn: "Reading speed, preacher variety, and memorization count are not the FIRST error. The first error is INFORMATION WITHOUT TRANSFORMATION — the Pharisaical mistake of mastering the text without being mastered by the Person at its center.",
      incorrectFeedbackEs: "La velocidad de lectura, la variedad de predicadores, y el conteo de memorización no son el PRIMER error. El primer error es INFORMACIÓN SIN TRANSFORMACIÓN — el error farisaico de dominar el texto sin ser dominado por la Persona en su centro."
    },
    {
      textEn: "7. The lesson identifies the SECOND error that stops transformation as:",
      textEs: "7. La lección identifica el SEGUNDO error que detiene la transformación como:",
      optionsEn: ["A. Using modern Bible translations","B. Quoting from the Old Testament too often","C. Preaching too quietly","D. Transformation talk without text — sermons about changed lives, breakthrough, and blessing that do not rest on the careful interpretation of any passage"],
      optionsEs: ["A. Usar traducciones modernas de la Biblia","B. Citar el Antiguo Testamento con demasiada frecuencia","C. Predicar demasiado bajo","D. El lenguaje de la transformación sin texto — sermones sobre vidas cambiadas, avance, y bendición que no descansan en la interpretación cuidadosa de ningún pasaje"],
      correct: "D",
      correctFeedbackEn: "Correct. The pastor reaches for the equipping at the end of 2 Timothy 3:16-17 without doing the doctrine-reproof-correction work that gets him there. The result is sentimentalism. Lives are not changed by warmth without truth; they are changed by the truth that warms.",
      correctFeedbackEs: "Correcto. El pastor alcanza el equipamiento al final de 2 Timoteo 3:16-17 sin hacer el trabajo de doctrina-redargución-corrección que lo lleva allí. El resultado es el sentimentalismo. Las vidas no son cambiadas por el calor sin la verdad; son cambiadas por la verdad que calienta.",
      incorrectFeedbackEn: "Translations, OT citation, and volume are not the second error. The second error is TRANSFORMATION TALK WITHOUT TEXT — preaching about changed lives without the disciplined interpretive work that produces real change. Warmth without truth is sentimentalism.",
      incorrectFeedbackEs: "Las traducciones, citar el AT, y el volumen no son el segundo error. El segundo error es EL LENGUAJE DE LA TRANSFORMACIÓN SIN TEXTO — predicar sobre vidas cambiadas sin el trabajo interpretativo disciplinado que produce el cambio real. Calor sin verdad es sentimentalismo."
    },
    {
      textEn: "8. The lesson says the FIRST hermeneutic — before the sermon reaches the people — must be:",
      textEs: "8. La lección dice que la PRIMERA hermenéutica — antes de que el sermón alcance al pueblo — debe ser:",
      optionsEn: ["A. The pastor's own life — the text must change his week before it can change his congregation's Sunday","B. The seminary professor's published commentary","C. The denominational leader's approval","D. The latest preaching software"],
      optionsEs: ["A. La propia vida del pastor — el texto debe cambiar su semana antes de que pueda cambiar el domingo de su congregación","B. El comentario publicado del profesor del seminario","C. La aprobación del líder denominacional","D. El último software de predicación"],
      correct: "A",
      correctFeedbackEn: "Correct. A pastor who has not been moved by what he is preaching cannot move anyone with it. The Bible refuses to be carried by hands it has not first laid hold of. Let the text interrogate your week before you carry it to your pulpit.",
      correctFeedbackEs: "Correcto. Un pastor que no ha sido movido por lo que predica no puede mover a nadie con ello. La Biblia se niega a ser cargada por manos que no la han asido primero. Deje que el texto interrogue su semana antes de llevarla a su púlpito.",
      incorrectFeedbackEn: "Commentaries, denominational approval, and software are not the first hermeneutic. The PASTOR'S OWN LIFE is. The text must shape his Monday before it can shape his people's Sunday. A teacher who is not learning is not really teaching.",
      incorrectFeedbackEs: "Los comentarios, la aprobación denominacional, y el software no son la primera hermenéutica. La PROPIA VIDA DEL PASTOR lo es. El texto debe formar su lunes antes de que pueda formar el domingo de su pueblo. Un maestro que no está aprendiendo realmente no está enseñando."
    },
    {
      textEn: "9. The first of three rules for transformational reading is:",
      textEs: "9. La primera de las tres reglas para la lectura transformadora es:",
      optionsEn: ["A. Begin sermon prep with the question \"what will I say on Sunday?\"","B. Read the text in three different translations","C. Read it for yourself before you read it for the pulpit — ask first what God is saying to you through this text right now","D. Wait for inspiration before opening the Bible"],
      optionsEs: ["A. Comenzar la preparación del sermón con la pregunta «¿qué diré el domingo?»","B. Leer el texto en tres traducciones distintas","C. Léalo para usted mismo antes de leerlo para el púlpito — pregunte primero qué le está diciendo Dios a usted a través de este texto en este momento","D. Esperar la inspiración antes de abrir la Biblia"],
      correct: "C",
      correctFeedbackEn: "Correct. The text that has spoken to you will be the only text you can preach with conviction. Sermon prep that begins with \"what will I say?\" is hermeneutically backwards. Begin with \"what is God saying to me?\" and the second question will answer itself.",
      correctFeedbackEs: "Correcto. El texto que le ha hablado a usted será el único texto que pueda predicar con convicción. La preparación del sermón que comienza con «¿qué diré?» está hermenéuticamente al revés. Comience con «¿qué me está diciendo Dios a mí?» y la segunda pregunta se responderá sola.",
      incorrectFeedbackEn: "Sunday-first prep, multiple translations, and waiting for inspiration are not the first rule. The first rule is READ IT FOR YOURSELF FIRST. Let the text reach you on Monday, and then carry what it said to the pulpit on Sunday.",
      incorrectFeedbackEs: "La preparación enfocada en el domingo, las múltiples traducciones, y esperar la inspiración no son la primera regla. La primera regla es LÉALO PARA USTED MISMO PRIMERO. Deje que el texto le alcance el lunes, y luego lleve lo que dijo al púlpito el domingo."
    },
    {
      textEn: "10. The second rule for transformational reading is:",
      textEs: "10. La segunda regla para la lectura transformadora es:",
      optionsEn: ["A. Make a long list of things you should do someday","B. Write a research paper after every study","C. End every study with one obedient action — not a list, but one specific, immediate, costly obedience this text requires of you this week","D. Compare every passage to a systematic theology textbook"],
      optionsEs: ["A. Hacer una larga lista de cosas que debería hacer algún día","B. Escribir un trabajo de investigación después de cada estudio","C. Termine cada estudio con una acción obediente — no una lista, sino una obediencia específica, inmediata, y costosa que este texto le requiere a usted esta semana","D. Comparar cada pasaje con un libro de texto de teología sistemática"],
      correct: "C",
      correctFeedbackEn: "Correct. Confess this sin. Make this phone call. Forgive this person. Open the Bible with this family member. Stop this habit. Begin this discipline. Make the application concrete, immediate, and costly enough to matter. A study without one obedient action is a study session, not a hermeneutical hour.",
      correctFeedbackEs: "Correcto. Confiese este pecado. Haga esta llamada telefónica. Perdone a esta persona. Abra la Biblia con este miembro de la familia. Detenga este hábito. Comience esta disciplina. Haga la aplicación concreta, inmediata, y suficientemente costosa para importar. Un estudio sin una acción obediente es una sesión de estudio, no una hora hermenéutica.",
      incorrectFeedbackEn: "Lists, papers, and theology comparison all bypass the second rule. The second rule is ONE OBEDIENT ACTION — concrete, immediate, costly. Not many possible obediences; ONE actual obedience this week. Otherwise the hermeneutical hour collapses into mere study.",
      incorrectFeedbackEs: "Las listas, los trabajos, y la comparación de teología todos eluden la segunda regla. La segunda regla es UNA ACCIÓN OBEDIENTE — concreta, inmediata, costosa. No muchas obediencias posibles; UNA obediencia real esta semana. De otro modo la hora hermenéutica colapsa en mero estudio."
    },
    {
      textEn: "11. The third rule for transformational reading is:",
      textEs: "11. La tercera regla para la lectura transformadora es:",
      optionsEn: ["A. Preach the longest sermon you can","B. Avoid the Old Testament","C. Use only the King James Version","D. Preach toward the Person, not toward the page — track the Christ at the center of every text"],
      optionsEs: ["A. Predicar el sermón más largo que pueda","B. Evite el Antiguo Testamento","C. Usar solo la Reina Valera Antigua","D. Predique hacia la Persona, no hacia la página — rastree al Cristo en el centro de cada texto"],
      correct: "D",
      correctFeedbackEn: "Correct. Every text the Spirit has breathed out points somewhere to the Christ at its center. The transformation you want for your people is not better behavior alone; it is conformity to the image of the One whose face is in the mirror. Aim there, every Sunday.",
      correctFeedbackEs: "Correcto. Cada texto que el Espíritu ha exhalado apunta en algún lugar al Cristo en su centro. La transformación que quiere para su pueblo no es la mejor conducta sola; es la conformidad a la imagen de Aquel cuyo rostro está en el espejo. Apunte allá, cada domingo.",
      incorrectFeedbackEn: "Sermon length, OT avoidance, and translation preference are not the third rule. The third rule is PREACH TOWARD THE PERSON. Track the Christ at the center. Hermeneutics that does not deliver people to Christ has not yet reached its goal.",
      incorrectFeedbackEs: "La longitud del sermón, evitar el AT, y la preferencia de traducción no son la tercera regla. La tercera regla es PREDIQUE HACIA LA PERSONA. Rastree al Cristo en el centro. La hermenéutica que no entrega a la gente a Cristo aún no ha alcanzado su meta."
    },
    {
      textEn: "12. The lesson asks Job's haunting question — \"If a man dies, shall he live again?\" — in order to make the point that:",
      textEs: "12. La lección hace la pregunta inquietante de Job — «si el hombre muriere, ¿volverá á vivir?» — para hacer el punto de que:",
      optionsEn: ["A. Job had no answer to his own question","B. Death is the end of all stories","C. Wisdom literature should not be preached","D. The resurrection of Christ is what makes the transformation begun in this life PERMANENT — outlasting the grave"],
      optionsEs: ["A. Job no tenía respuesta a su propia pregunta","B. La muerte es el fin de todas las historias","C. La literatura sapiencial no debe predicarse","D. La resurrección de Cristo es lo que hace la transformación comenzada en esta vida PERMANENTE — sobreviviendo la tumba"],
      correct: "D",
      correctFeedbackEn: "Correct. If everything we have talked about ends at the grave, transformation is a temporary kindness. The resurrection guarantees it is not. The Baby who entered the camp will not be taken from it. The mirror that shows the Father's face is permanent.",
      correctFeedbackEs: "Correcto. Si todo lo que hemos discutido termina en la tumba, la transformación es una bondad temporal. La resurrección garantiza que no lo es. El Bebé que entró al campamento no será quitado de él. El espejo que muestra el rostro del Padre es permanente.",
      incorrectFeedbackEn: "Job's question is not unanswered, not a verdict about death's finality, and not a reason to avoid wisdom literature. It is the doorway to the LESSON'S RESURRECTION ARGUMENT: Christ has been to the grave and come back; therefore the transformation begun in this life is permanent.",
      incorrectFeedbackEs: "La pregunta de Job no está sin respuesta, ni es un veredicto sobre la finalidad de la muerte, ni una razón para evitar la literatura sapiencial. Es la puerta al ARGUMENTO DE RESURRECCIÓN DE LA LECCIÓN: Cristo ha estado en la tumba y ha regresado; por lo tanto la transformación comenzada en esta vida es permanente."
    },
    {
      textEn: "13. The motto on Spain's coat of arms changed from \"Ne Plus Ultra\" to \"Plus Ultra\" after Columbus's voyage. The lesson uses this to illustrate:",
      textEs: "13. El lema en el escudo de armas de España cambió de «Ne Plus Ultra» a «Plus Ultra» después del viaje de Colón. La lección usa esto para ilustrar:",
      optionsEn: ["A. The history of Spanish heraldry","B. The political achievements of the Spanish empire","C. The Christian death now reads \"more beyond\" because one Explorer descended into the pit and walked out of it","D. The importance of Latin in seminary education"],
      optionsEs: ["A. La historia de la heráldica española","B. Los logros políticos del imperio español","C. La muerte cristiana ahora lee «más allá» porque un Explorador descendió al pozo y salió de él","D. La importancia del latín en la educación del seminario"],
      correct: "C",
      correctFeedbackEn: "Correct. For centuries believers stood beside the grave wondering if there was anything beyond. Then a young Explorer walked out of the tomb and announced there was a paradise beyond, a Father waiting with outstretched arms. The motto over every Christian death changed forever.",
      correctFeedbackEs: "Correcto. Por siglos los creyentes se pararon junto a la tumba preguntándose si había algo más allá. Entonces un joven Explorador salió de la tumba y anunció que había un paraíso más allá, un Padre esperando con brazos abiertos. El lema sobre cada muerte cristiana cambió para siempre.",
      incorrectFeedbackEn: "The Plus Ultra story is not about heraldry, empire, or Latin pedagogy. It is a HERMENEUTICAL IMAGE: the Christian death now reads MORE BEYOND because one Explorer descended into the grave and walked out. The resurrection re-writes the inscription over every believer's death.",
      incorrectFeedbackEs: "La historia de Plus Ultra no se trata de la heráldica, del imperio, ni de la pedagogía latina. Es una IMAGEN HERMENÉUTICA: la muerte cristiana ahora lee MÁS ALLÁ porque un Explorador descendió a la tumba y salió. La resurrección reescribe la inscripción sobre la muerte de cada creyente."
    },
    {
      textEn: "14. The bumblebee illustration in this lesson (the boy with bee allergy and the father who caught the bee in his palm) teaches that:",
      textEs: "14. La ilustración del abejorro en esta lección (el niño con alergia a las abejas y el padre que atrapó el abejorro en su palma) enseña que:",
      optionsEn: ["A. Bees are dangerous to children","B. The resurrection is the Father's open palm — the sting of death is in His hand, not yours; \"I have taken the sting for you\"","C. Fathers should drive more carefully with car windows up","D. Allergies are a sign of God's judgment"],
      optionsEs: ["A. Las abejas son peligrosas para los niños","B. La resurrección es la palma abierta del Padre — el aguijón de la muerte está en Su mano, no en la suya; «yo he recibido el aguijón por ti»","C. Los padres deben conducir con más cuidado con las ventanas del coche cerradas","D. Las alergias son señal del juicio de Dios"],
      correct: "B",
      correctFeedbackEn: "Correct. The Father caught the bee, squeezed it, and the stinger lodged in His palm. You do not need to be afraid anymore. The resurrection is the Father's open palm showing the stinger. \"O death, where is your sting?\" The transformation begun in your life will outlast the grave.",
      correctFeedbackEs: "Correcto. El Padre atrapó el abejorro, lo apretó, y el aguijón se quedó en Su palma. Ya no tiene que tener miedo. La resurrección es la palma abierta del Padre mostrando el aguijón. «¿Dónde está, oh muerte, tu aguijón?» La transformación comenzada en su vida sobrevivirá la tumba.",
      incorrectFeedbackEn: "The bumblebee story is not about safe driving, bee danger, or allergy theology. It is a CHRISTOLOGICAL IMAGE: the Father has taken the sting of death in His own palm; you do not need to fear what is now in His hand. The resurrection secures the permanence of the transformation begun in this life.",
      incorrectFeedbackEs: "La historia del abejorro no se trata de conducir con seguridad, ni del peligro de las abejas, ni de la teología de las alergias. Es una IMAGEN CRISTOLÓGICA: el Padre ha tomado el aguijón de la muerte en Su propia palma; usted no necesita temer lo que ahora está en Su mano. La resurrección asegura la permanencia de la transformación comenzada en esta vida."
    },
    {
      textEn: "15. The Swindoll kindergarten boy's response \"Totally awesome!\" came when he heard:",
      textEs: "15. La respuesta del niño de jardín de infantes de Swindoll «¡Totalmente asombroso!» vino cuando oyó:",
      optionsEn: ["A. That Jesus was nailed to a cross","B. That Jesus rose from the dead and is alive","C. That Jesus had twelve disciples","D. That Jesus had been born in a manger"],
      optionsEs: ["A. Que Jesús fue clavado a una cruz","B. Que Jesús resucitó de entre los muertos y está vivo","C. Que Jesús tuvo doce discípulos","D. Que Jesús había nacido en un pesebre"],
      correct: "B",
      correctFeedbackEn: "Correct. The boy's first response to the crucifixion was \"Oh, that's too bad.\" His response to the resurrection was \"Totally awesome!\" The death of Christ becomes good news only when the resurrection is announced with it. The pastor's hermeneutics must reach Sunday with the same news.",
      correctFeedbackEs: "Correcto. La primera respuesta del niño a la crucifixión fue «ay, qué triste». Su respuesta a la resurrección fue «¡totalmente asombroso!» La muerte de Cristo se vuelve buenas noticias solo cuando la resurrección se anuncia con ella. La hermenéutica del pastor debe alcanzar el domingo con las mismas noticias.",
      incorrectFeedbackEn: "The crucifixion alone produced \"Oh, that's too bad.\" The disciples and the manger were not in the conversation. The RESURRECTION — \"Christ is alive\" — produced \"Totally awesome!\" The kindergartener's response is the response your hermeneutics is supposed to produce.",
      incorrectFeedbackEs: "La crucifixión sola produjo «ay, qué triste». Los discípulos y el pesebre no estaban en la conversación. La RESURRECCIÓN — «Cristo está vivo» — produjo «¡totalmente asombroso!» La respuesta del pequeño de jardín de infantes es la respuesta que su hermenéutica está diseñada para producir."
    },
    {
      textEn: "16. According to 2 Timothy 3:16-17, the Scriptures are profitable in the following chain:",
      textEs: "16. Según 2 Timoteo 3:16-17, las Escrituras son útiles en la siguiente cadena:",
      optionsEn: ["A. Entertainment, education, debate, status","B. Memorization, recitation, performance, evaluation","C. Doctrine, reproof, correction, instruction in righteousness, leading to a complete and equipped servant of God","D. Tradition, ritual, ceremony, authority"],
      optionsEs: ["A. Entretenimiento, educación, debate, estatus","B. Memorización, recitación, desempeño, evaluación","C. Doctrina, redargución, corrección, instrucción en justicia, llevando a un siervo de Dios completo y equipado","D. Tradición, ritual, ceremonia, autoridad"],
      correct: "C",
      correctFeedbackEn: "Correct. Doctrine is first; equipping is last. Skip any link and the chain breaks. Stop at doctrine and you have a scholar with no fruit. Skip doctrine and you have a sentimentalist with no roots. The chain is meant to be walked end to end, and the last link is always transformation.",
      correctFeedbackEs: "Correcto. La doctrina es primero; el equipamiento es último. Salte cualquier eslabón y la cadena se rompe. Deténgase en la doctrina y tendrá un erudito sin fruto. Salte la doctrina y tendrá un sentimentalista sin raíces. La cadena está diseñada para ser caminada de un extremo al otro, y el último eslabón es siempre la transformación.",
      incorrectFeedbackEn: "Entertainment, memorization-for-its-own-sake, and tradition are not the Pauline chain. The 2 Timothy chain is DOCTRINE → REPROOF → CORRECTION → INSTRUCTION IN RIGHTEOUSNESS → COMPLETE EQUIPPING. Doctrine begins it; transformation ends it. Both ends are necessary.",
      incorrectFeedbackEs: "El entretenimiento, la memorización por sí misma, y la tradición no son la cadena paulina. La cadena de 2 Timoteo es DOCTRINA → REDARGUCIÓN → CORRECCIÓN → INSTRUCCIÓN EN JUSTICIA → EQUIPAMIENTO COMPLETO. La doctrina la comienza; la transformación la termina. Ambos extremos son necesarios."
    },
    {
      textEn: "17. The lesson says \"the first hermeneutic is always the pastor's own life\" because:",
      textEs: "17. La lección dice que «la primera hermenéutica es siempre la propia vida del pastor» porque:",
      optionsEn: ["A. The Bible refuses to be carried by hands it has not first laid hold of — a pastor who has not been moved by what he is preaching cannot move anyone with it","B. Pastors should be celebrities","C. Pastors should hide their lives from their congregations","D. The pastor's biography is more important than the biblical text"],
      optionsEs: ["A. La Biblia se niega a ser cargada por manos que no la han asido primero — un pastor que no ha sido movido por lo que predica no puede mover a nadie con ello","B. Los pastores deben ser celebridades","C. Los pastores deben ocultar sus vidas a sus congregaciones","D. La biografía del pastor es más importante que el texto bíblico"],
      correct: "A",
      correctFeedbackEn: "Correct. He will pronounce the words correctly and land the doctrinal points, but the wind of the Spirit will pass through the room without bending the trees, because nothing was bent in him. Let the text interrogate your week before you carry it to your pulpit.",
      correctFeedbackEs: "Correcto. Pronunciará las palabras correctamente y aterrizará los puntos doctrinales, pero el viento del Espíritu pasará por el cuarto sin doblar los árboles, porque nada fue doblado en él. Deje que el texto interrogue su semana antes de llevarla a su púlpito.",
      incorrectFeedbackEn: "Celebrity, secrecy, and elevating biography over text all distort the point. The pastor's own life is the FIRST HERMENEUTIC because the Bible will not carry weight in hands that have not first been gripped by it. The text changes the pastor's Monday before it changes the people's Sunday.",
      incorrectFeedbackEs: "La celebridad, el secretismo, y elevar la biografía sobre el texto todos distorsionan el punto. La propia vida del pastor es la PRIMERA HERMENÉUTICA porque la Biblia no cargará peso en manos que no han sido primero asidas por ella. El texto cambia el lunes del pastor antes de que cambie el domingo del pueblo."
    },
    {
      textEn: "18. The lesson teaches that the response \"Totally awesome!\" from the Swindoll kindergartener represents:",
      textEs: "18. La lección enseña que la respuesta «¡totalmente asombroso!» del niño de jardín de infantes de Swindoll representa:",
      optionsEn: ["A. Childish enthusiasm without theological weight","B. A communication style only appropriate for children","C. American religious culture in the 1980s","D. The response your hermeneutics is supposed to produce in your people — not nodding agreement to your exegesis, but transformed wonder at the risen Christ"],
      optionsEs: ["A. Entusiasmo infantil sin peso teológico","B. Un estilo de comunicación solo apropiado para niños","C. La cultura religiosa americana en los años 1980","D. La respuesta que su hermenéutica está diseñada para producir en su pueblo — no el asentimiento a su exégesis, sino el asombro transformado ante el Cristo resucitado"],
      correct: "D",
      correctFeedbackEn: "Correct. The boy was not impressed by the teacher's pedagogy. He was undone by the news. That is what your hermeneutics is supposed to produce. The place of the skull has become a throne. The Father's palm holds the stinger. \"Totally awesome\" is the right reaction.",
      correctFeedbackEs: "Correcto. El niño no estaba impresionado por la pedagogía de la maestra. Estaba deshecho por la noticia. Eso es lo que su hermenéutica está diseñada para producir. El lugar de la calavera se ha vuelto un trono. La palma del Padre sostiene el aguijón. «Totalmente asombroso» es la reacción correcta.",
      incorrectFeedbackEn: "The Swindoll kindergartener's response is not childish, age-restricted, or culturally bound. It is the TRANSFORMATION RESPONSE — undone wonder at the risen Christ. Your hermeneutics should produce that reaction in adults too. \"Totally awesome\" is the right reaction to good news from a grave.",
      incorrectFeedbackEs: "La respuesta del niño de Swindoll no es infantil, ni restringida por edad, ni vinculada culturalmente. Es la RESPUESTA DE TRANSFORMACIÓN — asombro deshecho ante el Cristo resucitado. Su hermenéutica debe producir esa reacción también en los adultos. «Totalmente asombroso» es la reacción correcta a las buenas noticias desde una tumba."
    },
    {
      textEn: "19. The closing summary image of this unit pulls together all of its parts. It pictures:",
      textEs: "19. La imagen resumen de cierre de esta unidad reúne todas sus partes. Representa:",
      optionsEn: ["A. The pastor as scholar in his study","B. The Baby in the camp, Misha in the manger, the mirror at the floor — and the pastor carrying all of it into the room where his people sit","C. A list of hermeneutical rules to memorize","D. A flowchart of doctrinal categories"],
      optionsEs: ["A. El pastor como erudito en su estudio","B. El Bebé en el campamento, Misha en el pesebre, el espejo en el piso — y el pastor llevando todo ello al cuarto donde se sienta su pueblo","C. Una lista de reglas hermenéuticas para memorizar","D. Un diagrama de flujo de categorías doctrinales"],
      correct: "B",
      correctFeedbackEn: "Correct. Hermeneutics, rightly done, is the door through which a transformed Christ walks into transformed lives. The Baby has entered the camp. Misha is keeping Jesus warm forever. The mirror shows the Father's face. And the changed pastor carries all of this to his people.",
      correctFeedbackEs: "Correcto. La hermenéutica, hecha correctamente, es la puerta a través de la cual un Cristo transformado entra a vidas transformadas. El Bebé ha entrado al campamento. Misha está manteniendo a Jesús caliente para siempre. El espejo muestra el rostro del Padre. Y el pastor cambiado lleva todo ello a su pueblo.",
      incorrectFeedbackEn: "The closing image is not scholarship-in-the-study, a rule list, or a doctrinal flowchart. It is the THREE IMAGES OF THE UNIT bundled together — Roaring Camp Baby + Misha + Reni dome mirror — carried by a changed pastor into the room where his people sit. That is the goal: transformation in motion.",
      incorrectFeedbackEs: "La imagen de cierre no es la erudición en el estudio, ni una lista de reglas, ni un diagrama doctrinal. Son las TRES IMÁGENES DE LA UNIDAD unidas — el Bebé de Campamento Rugiente + Misha + el espejo de la cúpula de Reni — cargadas por un pastor cambiado al cuarto donde se sienta su pueblo. Ésa es la meta: transformación en movimiento."
    },
    {
      textEn: "20. The closing charge of this unit to the pastor is:",
      textEs: "20. El encargo de cierre de esta unidad al pastor es:",
      optionsEn: ["A. Only preach the resurrection at Easter","B. Replace exegesis with personal testimony","C. Avoid all illustrations to keep sermons clean","D. Open the door of transformed interpretation this week, keep opening it every week, because the Mishas in your congregation are waiting to be told Jesus has a place for them — for always"],
      optionsEs: ["A. Solo predique la resurrección en Pascua","B. Reemplace la exégesis con el testimonio personal","C. Evite todas las ilustraciones para mantener los sermones limpios","D. Abra la puerta de la interpretación transformada esta semana, sígala abriendo cada semana, porque los Mishas en su congregación están esperando que se les diga que Jesús tiene un lugar para ellos — para siempre"],
      correct: "D",
      correctFeedbackEn: "Correct. The Mishas in your congregation are waiting for someone to tell them Jesus has a place for them — for always. Open the door this week. Keep opening it every week until your last sermon. That is the goal toward which all ten units of this course have been pointing.",
      correctFeedbackEs: "Correcto. Los Mishas en su congregación están esperando que alguien les diga que Jesús tiene un lugar para ellos — para siempre. Abra la puerta esta semana. Siga abriéndola cada semana hasta su último sermón. Ésa es la meta hacia la cual todas las diez unidades de este curso han estado apuntando.",
      incorrectFeedbackEn: "Easter-only preaching, testimony-without-exegesis, and illustration-avoidance all miss the closing charge. The CHARGE is to OPEN THE DOOR OF TRANSFORMED INTERPRETATION every week, because the Mishas in your congregation are waiting for someone to tell them Jesus has a place for them — for always.",
      incorrectFeedbackEs: "Predicar solo en Pascua, el testimonio sin exégesis, y evitar las ilustraciones todos pierden el encargo de cierre. El ENCARGO es ABRIR LA PUERTA DE LA INTERPRETACIÓN TRANSFORMADA cada semana, porque los Mishas en su congregación están esperando que alguien les diga que Jesús tiene un lugar para ellos — para siempre."
    }
  ];

const kwQuestions = [
    {
      textEn: "21. State the central thesis of this unit in your own words, and explain why all the interpretive machinery taught in the prior nine units exists to serve this single end.",
      textEs: "21. Declare la tesis central de esta unidad con sus propias palabras, y explique por qué toda la maquinaria interpretativa enseñada en las nueve unidades previas existe para servir este único fin.",
      kw_en: ["goal", "transform", "information", "life", "congregat", "chang", "serve", "interpret"],
      kw_es: ["meta", "transform", "informac", "vida", "congregac", "cambi", "servir", "interpret"],
      modelEn: "The central thesis is that the goal of all interpretation is transformation, not mere information. Every tool from the prior nine units — exegesis, context, genre, Christ-tracking — exists to serve one end: a changed life in the pastor and in his congregation.",
      modelEs: "La tesis central es que la meta de toda interpretación es la transformación, no la mera información. Cada herramienta de las nueve unidades previas existe para servir un solo fin: una vida cambiada en el pastor y en su congregación."
    },
    {
      textEn: "22. Explain the warning of James 1:22 about the hearer who is not a doer. What does the Greek word paralogizomenoi (from paralogizomai) imply about self-deception?",
      textEs: "22. Explique la advertencia de Santiago 1:22 sobre el oyente que no hace. ¿Qué implica la palabra griega paralogizomenoi (de paralogizomai) sobre el autoengaño?",
      kw_en: ["James", "doer", "hearer", "deceiv", "paralogiz", "reason", "self", "obey"],
      kw_es: ["Santiago", "hacedor", "oidor", "engañ", "paralogiz", "razon", "mismo", "obedec"],
      modelEn: "James warns that a hearer of the Word who is not a doer deceives himself. The Greek word he uses, paralogizomenoi, from paralogizomai, means to mislead by false reasoning — the hearer reasons himself into thinking that hearing equals obeying, and so deceives his own self.",
      modelEs: "Santiago advierte que el oidor de la Palabra que no es hacedor se engaña a sí mismo. La palabra griega que usa, paralogizomenoi, de paralogizomai, significa engañar por medio de un razonamiento falso — el oidor se convence de que oír equivale a obedecer, y así se engaña a sí mismo."
    },
    {
      textEn: "23. Tell the story of Misha the Russian orphan and the manger with two babies, and explain how this story illustrates the goal of hermeneutics.",
      textEs: "23. Cuente la historia de Misha el huérfano ruso y el pesebre con dos bebés, y explique cómo esta historia ilustra la meta de la hermenéutica.",
      kw_en: ["Misha", "Russian", "orphan", "manger", "warm", "Jesus", "always", "welcom"],
      kw_es: ["Misha", "ruso", "huérfano", "pesebre", "caliente", "Jesús", "siempre", "recib"],
      modelEn: "Misha, a Russian orphan, hears the Christmas story and climbs into the manger himself to keep the baby Jesus warm, because Jesus had no place of His own and had promised to be with him always. The story shows the goal of hermeneutics: not merely to understand the text but to welcome Christ in and be warmed and changed by Him.",
      modelEs: "Misha, un huérfano ruso, escucha la historia de Navidad y se mete él mismo en el pesebre para mantener caliente al niño Jesús, porque Jesús no tenía lugar propio y había prometido estar con él siempre. La historia muestra la meta de la hermenéutica: no solo entender el texto sino recibir a Cristo y ser calentado y cambiado por Él."
    },
    {
      textEn: "24. Describe the Reni dome painting illustration and explain how Christ functions as the mirror in which the Father's character becomes clear.",
      textEs: "24. Describa la ilustración de la pintura de la cúpula de Reni y explique cómo Cristo funciona como el espejo en el cual el carácter del Padre se vuelve claro.",
      kw_en: ["Reni", "dome", "mirror", "Christ", "Father", "clear", "hazy", "reflect"],
      kw_es: ["Reni", "cúpula", "espejo", "Cristo", "Padre", "claro", "nebuloso", "reflej"],
      modelEn: "Reni's painting in the dome was too high to see, but a mirror set below it reflected the image clearly. In the same way the Father is hazy and far above us until we look into Christ, the mirror in which His character is reflected. He who has seen Christ has seen the Father clearly.",
      modelEs: "La pintura de Reni en la cúpula estaba demasiado alta para verla, pero un espejo colocado debajo la reflejaba con nitidez. Del mismo modo el Padre nos resulta nebuloso y lejano hasta que miramos a Cristo, el espejo en el cual su carácter se vuelve claro. El que ha visto a Cristo ha visto al Padre, ahora claro y no nebuloso."
    },
    {
      textEn: "25. Tell the story of \"The Luck of Roaring Camp\" and explain how the cascading transformation of the mining town parallels what happens when Christ is welcomed into a life or a congregation.",
      textEs: "25. Cuente la historia de «La fortuna de Campamento Rugiente» y explique cómo la transformación en cascada del pueblo minero es paralela a lo que sucede cuando Cristo es recibido en una vida o una congregación.",
      kw_en: ["Roaring", "Camp", "baby", "cradle", "cascade", "welcom", "transform", "clean"],
      kw_es: ["Rugiente", "Campamento", "bebé", "cuna", "cascada", "recib", "transform", "limpi"],
      modelEn: "When a baby was brought into the rough mining town of Roaring Camp, the hardened miners cleaned themselves up, built a cradle, and changed the whole camp in a cascade of small reforms to make it fit for the child. So when Christ is welcomed into a life or a congregation, His presence cascades outward and transforms everything around it.",
      modelEs: "Cuando un bebé fue llevado al rudo pueblo minero de Campamento Rugiente, los mineros endurecidos se limpiaron, construyeron una cuna, y cambiaron todo el campamento en una cascada de pequeñas reformas para hacerlo digno del niño. Así, cuando Cristo es recibido en una vida o una congregación, su presencia se derrama en cascada y lo transforma todo."
    },
    {
      textEn: "26. Identify and describe the two errors that stop transformation, and explain why both fail to deliver what the goal of hermeneutics requires.",
      textEs: "26. Identifique y describa los dos errores que detienen la transformación, y explique por qué ambos no logran entregar lo que la meta de la hermenéutica requiere.",
      kw_en: ["information", "Pharisee", "sentiment", "warmth", "truth", "text", "transform", "emotion"],
      kw_es: ["información", "fariseo", "sentimental", "calor", "verdad", "texto", "transform", "emoción"],
      modelEn: "The first error is information without transformation — the Pharisee who masters the text but is never changed by it, the Greek lecture that informs but does not warm. The second error is sentimentalism — warmth and emotion with no truth from the text behind it. Both fail the goal, which needs the text's truth doing its transforming work on the heart.",
      modelEs: "El primer error es la información sin transformación — el fariseo que domina el texto pero nunca es cambiado por él, la conferencia que informa pero no calienta. El segundo error es el sentimentalismo — calor y emoción sin la verdad del texto detrás. Ambos fallan la meta, que necesita la verdad del texto haciendo su obra transformadora en el corazón."
    },
    {
      textEn: "27. Explain why the pastor's own life must be the FIRST hermeneutic, and what happens when a pastor preaches a text that has not first changed him.",
      textEs: "27. Explique por qué la propia vida del pastor debe ser la PRIMERA hermenéutica, y qué sucede cuando un pastor predica un texto que no lo ha cambiado primero a él.",
      kw_en: ["pastor", "life", "first", "hermeneutic", "chang", "moved", "power", "preach"],
      kw_es: ["pastor", "vida", "primer", "hermenéutica", "cambi", "movido", "poder", "predic"],
      modelEn: "The pastor's own life is the first hermeneutic: the text must change him before it can change anyone through him. When a pastor preaches a passage that has not first moved and changed his own life, the sermon has no power — it is wind that never stirred the preacher, so it stirs no one else.",
      modelEs: "La propia vida del pastor es la primera hermenéutica: el texto debe cambiarlo a él antes de poder cambiar a otros por medio de él. Cuando un pastor predica un pasaje que no ha movido ni cambiado primero su propia vida, el sermón no tiene poder — es viento que nunca movió al predicador, así que no mueve a nadie más."
    },
    {
      textEn: "28. List and briefly explain the three rules for transformational reading given in this unit.",
      textEs: "28. Enumere y explique brevemente las tres reglas para la lectura transformadora dadas en esta unidad.",
      kw_en: ["yourself", "pulpit", "obedient", "action", "Person", "page", "Christ", "first"],
      kw_es: ["usted", "púlpito", "obedien", "acción", "Persona", "página", "Cristo", "primer"],
      modelEn: "Three rules govern transformational reading. First, read the text into yourself before you carry it into the pulpit. Second, read it for obedient action, not just information. Third, read it to meet a Person — the living Christ on the page — and not merely to master content.",
      modelEs: "Tres reglas gobiernan la lectura transformadora. Primera, lea el texto dentro de usted mismo antes de llevarlo al púlpito. Segunda, léalo para la acción obediente, no solo para la información. Tercera, léalo para encontrar a una Persona — el Cristo vivo en la página — y no meramente para dominar el contenido."
    },
    {
      textEn: "29. Explain how the resurrection of Christ (illustrated by the Plus Ultra motto and the bumblebee story) makes the transformation begun in this life PERMANENT.",
      textEs: "29. Explique cómo la resurrección de Cristo (ilustrada por el lema Plus Ultra y la historia del abejorro) hace la transformación comenzada en esta vida PERMANENTE.",
      kw_en: ["resurrection", "permanent", "Ultra", "bumblebee", "sting", "death", "Christ", "beyond"],
      kw_es: ["resurrección", "permanente", "Ultra", "abejorro", "aguijón", "muerte", "Cristo", "tumba"],
      modelEn: "Because of the resurrection, the transformation begun in this life is permanent — death cannot undo it. The Plus Ultra motto means 'further beyond': there is more beyond the grave. Like the father who caught the bumblebee and took its sting into his own hand, Christ took the sting of death into Himself, so for us death has lost its sting forever.",
      modelEs: "Por causa de la resurrección, la transformación comenzada en esta vida es permanente — la muerte no puede deshacerla. El lema Plus Ultra significa 'más allá': hay algo más allá de la tumba. Como el padre que atrapó el abejorro y tomó su aguijón en su propia mano, Cristo tomó el aguijón de la muerte en Sí mismo, de modo que para nosotros la muerte ha perdido su aguijón para siempre."
    },
    {
      textEn: "30. Explain the closing image of this unit: the Swindoll kindergartener's \"Totally awesome!\" response and what it represents about the goal of pastoral hermeneutics.",
      textEs: "30. Explique la imagen de cierre de esta unidad: la respuesta «¡totalmente asombroso!» del niño de jardín de infantes de Swindoll y lo que representa sobre la meta de la hermenéutica pastoral.",
      kw_en: ["Swindoll", "kindergart", "totally", "awesome", "resurrection", "wonder", "response", "awe"],
      kw_es: ["Swindoll", "jardín", "totalmente", "asombroso", "resurrección", "asombro", "respuesta", "maravill"],
      modelEn: "Chuck Swindoll tells of a kindergartener who, on hearing that Jesus rose from the dead, burst out 'Totally awesome!' That childlike wonder is the right response to the resurrection. The goal of pastoral hermeneutics is finally to bring people to that awe — not just to inform them, but to leave them marveling at the risen Christ.",
      modelEs: "Chuck Swindoll cuenta de un niño de jardín de infantes que, al oír que Jesús resucitó de los muertos, exclamó «¡totalmente asombroso!». Ese asombro infantil es la respuesta correcta ante la resurrección. La meta de la hermenéutica pastoral es finalmente llevar a la gente a ese asombro — no solo informarles, sino dejarlos maravillados ante el Cristo resucitado."
    }
  ];
