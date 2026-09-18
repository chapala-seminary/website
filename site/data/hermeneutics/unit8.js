/* CTSHermeneutics - unit 8: per-unit configuration and content. */

const UNIT = 8;

const NEXT_UNIT_URL = "CTSHermeneuticsUnit9.html";

const PREV_UNIT_URL = "CTSHermeneuticsUnit7.html";

const IS_FINAL_UNIT = false;

const SHOW_REGISTRATION = false;

const mcQuestions = [
    {
      textEn: "1. According to this unit, the question a pastor must ask BEFORE asking what a passage means is:",
      textEs: "1. Según esta unidad, la pregunta que un pastor debe hacer ANTES de preguntar qué significa un pasaje es:",
      optionsEn: ["A. Which translation am I reading?","B. How long is the passage?","C. What kind of writing am I reading?","D. Has this passage been preached before?"],
      optionsEs: ["A. ¿Qué traducción estoy leyendo?","B. ¿Cuán largo es el pasaje?","C. ¿Qué clase de escritura estoy leyendo?","D. ¿Se ha predicado antes este pasaje?"],
      correct: "C",
      correctFeedbackEn: "Correct. The genre question is the question before the question. A poem is not read like an epistle. A parable is not read like a chronicle. Identify the kind of literature first, and the passage opens to you in its own way.",
      correctFeedbackEs: "Correcto. La pregunta del género es la pregunta antes de la pregunta. Un poema no se lee como una epístola. Una parábola no se lee como una crónica. Identifique la clase de literatura primero, y el pasaje se le abre a su manera.",
      incorrectFeedbackEn: "Translation, length, and preaching history are secondary. The FOUNDATIONAL question is GENRE — what kind of writing this is. The pastor who skips this question forces every text into the same reading template and distorts more than he preaches.",
      incorrectFeedbackEs: "La traducción, la duración, y la historia predicada son secundarias. La pregunta FUNDAMENTAL es el GÉNERO — qué clase de escritura es ésta. El pastor que se salta esta pregunta fuerza cada texto al mismo molde de lectura y distorsiona más de lo que predica."
    },
    {
      textEn: "2. The central principle of this unit is:",
      textEs: "2. El principio central de esta unidad es:",
      optionsEn: ["A. Every Bible passage should be preached the same way","B. Genre determines interpretation","C. Modern translations should be avoided","D. Only the New Testament has clear genres"],
      optionsEs: ["A. Cada pasaje bíblico debe predicarse de la misma manera","B. El género determina la interpretación","C. Las traducciones modernas deben evitarse","D. Solo el Nuevo Testamento tiene géneros claros"],
      correct: "B",
      correctFeedbackEn: "Correct. Identify the kind of literature before you ask what it means, and the passage will open to you in its own way. Force every passage into the same template and you will distort more than you preach.",
      correctFeedbackEs: "Correcto. Identifique la clase de literatura antes de preguntar qué significa, y el pasaje se le abrirá a su manera. Fuerce cada pasaje al mismo molde y distorsionará más de lo que predica.",
      incorrectFeedbackEn: "Uniform preaching, translation-avoidance, and NT-only thinking all flatten the Bible's genres. The principle is GENRE DETERMINES INTERPRETATION — and the Bible is a library of many genres, not one.",
      incorrectFeedbackEs: "La predicación uniforme, evitar las traducciones, y el pensamiento solo del NT todos aplanan los géneros de la Biblia. El principio es EL GÉNERO DETERMINA LA INTERPRETACIÓN — y la Biblia es una biblioteca de muchos géneros, no uno."
    },
    {
      textEn: "3. The lesson names six main biblical genres. Which list correctly names them?",
      textEs: "3. La lección nombra seis géneros bíblicos principales. ¿Cuál lista los nombra correctamente?",
      optionsEn: ["A. Hebrew, Greek, Aramaic, Latin, English, Spanish","B. Old, New, Apocrypha, Tradition, Liturgy, Creed","C. Devotional, Practical, Theological, Historical, Inspirational, Doctrinal","D. Narrative, Law, Wisdom, Poetry, Prophecy, Epistles"],
      optionsEs: ["A. Hebreo, griego, arameo, latín, inglés, español","B. Antiguo, Nuevo, Apócrifos, Tradición, Liturgia, Credo","C. Devocional, Práctico, Teológico, Histórico, Inspirativo, Doctrinal","D. Narrativa, Ley, Sabiduría, Poesía, Profecía, Epístolas"],
      correct: "D",
      correctFeedbackEn: "Correct. Each of the six has its own reading rules. The pastor who treats a Proverb as if it were a Romans-style absolute promise will be wounded by life. The pastor who treats Revelation as a newspaper headline will embarrass the Lord. Genre is the corrective.",
      correctFeedbackEs: "Correcto. Cada uno de los seis tiene sus propias reglas de lectura. El pastor que trata un Proverbio como si fuera una promesa absoluta estilo Romanos será herido por la vida. El pastor que trata Apocalipsis como un titular de periódico avergonzará al Señor. El género es el correctivo.",
      incorrectFeedbackEn: "Languages, canon divisions, and tone-categories are not biblical genres. The six broad categories are: NARRATIVE, LAW, WISDOM, POETRY, PROPHECY, EPISTLES. Each has distinct reading rules.",
      incorrectFeedbackEs: "Los idiomas, las divisiones del canon, y las categorías de tono no son géneros bíblicos. Las seis categorías amplias son: NARRATIVA, LEY, SABIDURÍA, POESÍA, PROFECÍA, EPÍSTOLAS. Cada uno tiene reglas de lectura distintas."
    },
    {
      textEn: "4. When God commands Hosea to marry Gomer (Hosea 1:2), the lesson teaches we should read this as:",
      textEs: "4. Cuando Dios le manda a Oseas casarse con Gomer (Oseas 1:2), la lección enseña que debemos leerlo como:",
      optionsEn: ["A. A prophetic symbolic action — the prophet's marriage is the sermon","B. A heartbreaking private domestic anecdote","C. An ethical dilemma we must defend God against","D. A coincidence that has nothing to do with Israel"],
      optionsEs: ["A. Una acción simbólica profética — el matrimonio del profeta es el sermón","B. Una desgarradora anécdota doméstica privada","C. Un dilema ético contra el cual debemos defender a Dios","D. Una coincidencia que no tiene nada que ver con Israel"],
      correct: "A",
      correctFeedbackEn: "Correct. Biblical prophecy regularly uses symbolic actions — Isaiah walked barefoot for three years, Jeremiah wore a yoke, Ezekiel lay on his side. Hosea's entire marriage is a prophetic sign. The marriage IS the sermon.",
      correctFeedbackEs: "Correcto. La profecía bíblica usa regularmente acciones simbólicas — Isaías caminó descalzo durante tres años, Jeremías llevó un yugo, Ezequiel se acostó de un lado. El matrimonio entero de Oseas es una señal profética. El matrimonio ES el sermón.",
      incorrectFeedbackEn: "Hosea is NOT autobiography, ethical dilemma, or coincidence. It is PROPHECY — and biblical prophecy regularly uses symbolic actions to deliver covenant messages. Identify the genre and the marriage becomes the visible sermon God commanded.",
      incorrectFeedbackEs: "Oseas NO es autobiografía, ni dilema ético, ni coincidencia. Es PROFECÍA — y la profecía bíblica usa regularmente acciones simbólicas para entregar mensajes del pacto. Identifique el género y el matrimonio se vuelve el sermón visible que Dios mandó."
    },
    {
      textEn: "5. The names of Hosea's three children (Jezreel, Lo-Ruhamah, Lo-Ammi) function in the book as:",
      textEs: "5. Los nombres de los tres hijos de Oseas (Jezreel, Lo-Ruhama, Lo-Ammi) funcionan en el libro como:",
      optionsEn: ["A. Random personal names of the family","B. Three ordinary Hebrew names with no significance","C. Names chosen for grandparents","D. Prophetic announcements of judgment: God will scatter, no longer pitied, not My people"],
      optionsEs: ["A. Nombres personales al azar de la familia","B. Tres nombres hebreos ordinarios sin significado","C. Nombres escogidos para los abuelos","D. Anuncios proféticos de juicio: Dios esparcirá, ya no compadecida, no Mi pueblo"],
      correct: "D",
      correctFeedbackEn: "Correct. The children's names announce judgment on Israel. In the prophetic genre, the prophet's family becomes the sermon-board — names, marriage, and household actions all preach the covenant message God is delivering.",
      correctFeedbackEs: "Correcto. Los nombres de los hijos anuncian juicio sobre Israel. En el género profético, la familia del profeta se vuelve el tablero del sermón — los nombres, el matrimonio, y las acciones del hogar todos predican el mensaje del pacto que Dios está entregando.",
      incorrectFeedbackEn: "The children's names are not random, ordinary, or sentimental. They are PROPHETIC ANNOUNCEMENTS: Jezreel = God will scatter; Lo-Ruhamah = not pitied; Lo-Ammi = not My people. The names preach the covenant judgment Hosea was sent to deliver.",
      incorrectFeedbackEs: "Los nombres de los hijos no son al azar, ni ordinarios, ni sentimentales. Son ANUNCIOS PROFÉTICOS: Jezreel = Dios esparcirá; Lo-Ruhama = no compadecida; Lo-Ammi = no pueblo Mío. Los nombres predican el juicio del pacto que Oseas fue enviado a entregar."
    },
    {
      textEn: "6. Hosea pays fifteen pieces of silver and barley to buy Gomer back from the slave market (Hosea 3:2). The lesson says this price was:",
      textEs: "6. Oseas paga quince piezas de plata y cebada para comprar a Gomer del mercado de esclavos (Oseas 3:2). La lección dice que este precio fue:",
      optionsEn: ["A. Double the normal slave price","B. Half the normal slave price — sin had taken its toll on what she fetched at auction","C. The exact price required by Mosaic law","D. A symbolic number with no real economic meaning"],
      optionsEs: ["A. El doble del precio normal de un esclavo","B. La mitad del precio normal de un esclavo — el pecado había hecho mella en lo que ella valía en la subasta","C. El precio exacto requerido por la ley mosaica","D. Un número simbólico sin significado económico real"],
      correct: "B",
      correctFeedbackEn: "Correct. Exodus 21:32 records the standard price of a slave as thirty shekels of silver. Hosea paid roughly half — sin had visibly devalued his wife in the slave market. He still bought her back. That is what God does for Israel and for us.",
      correctFeedbackEs: "Correcto. Éxodo 21:32 registra el precio estándar de un esclavo como treinta siclos de plata. Oseas pagó aproximadamente la mitad — el pecado había devaluado visiblemente a su esposa en el mercado de esclavos. Aun así la compró de vuelta. Eso es lo que Dios hace por Israel y por nosotros.",
      incorrectFeedbackEn: "Hosea's price was HALF the normal thirty-shekel slave price recorded in Exodus 21:32. The discount itself is theology: sin had visibly taken its toll on what Gomer fetched. He still paid. That is the gospel embodied in a domestic act.",
      incorrectFeedbackEs: "El precio de Oseas fue LA MITAD del precio normal de treinta siclos registrado en Éxodo 21:32. El descuento mismo es teología: el pecado había hecho mella visible en lo que Gomer valía. Aun así pagó. Ése es el evangelio encarnado en un acto doméstico."
    },
    {
      textEn: "7. According to the lesson, the gospel of Hosea is summarized in the line:",
      textEs: "7. Según la lección, el evangelio de Oseas se resume en la línea:",
      optionsEn: ["A. \"Hosea is a more patient husband than most men\"","B. \"Marriage is the most important institution in Israel\"","C. \"God is the One who buys back what shame has unmade\"","D. \"All prophets had difficult marriages\""],
      optionsEs: ["A. «Oseas es un esposo más paciente que la mayoría de los hombres»","B. «El matrimonio es la institución más importante en Israel»","C. «Dios es Aquel que recompra lo que la vergüenza ha deshecho»","D. «Todos los profetas tuvieron matrimonios difíciles»"],
      correct: "C",
      correctFeedbackEn: "Correct. Once you read Hosea as prophecy, the marriage stops being a private story and starts being the gospel made visible. God is the One who buys back what shame has unmade. That is the truth Hosea's marriage was sent to preach.",
      correctFeedbackEs: "Correcto. Una vez que lea a Oseas como profecía, el matrimonio deja de ser una historia privada y comienza a ser el evangelio hecho visible. Dios es Aquel que recompra lo que la vergüenza ha deshecho. Ésa es la verdad que el matrimonio de Oseas fue enviado a predicar.",
      incorrectFeedbackEn: "Hosea is not about pastoral patience, institutional marriage, or prophetic biography. The gospel of Hosea is the gospel of GOD BUYING BACK WHAT SHAME HAS UNMADE. Read with the prophetic genre, the marriage becomes the visible sermon of redemptive love.",
      incorrectFeedbackEs: "Oseas no se trata de paciencia pastoral, ni de matrimonio institucional, ni de biografía profética. El evangelio de Oseas es el evangelio de DIOS RECOMPRANDO LO QUE LA VERGÜENZA HA DESHECHO. Leído con el género profético, el matrimonio se vuelve el sermón visible del amor redentor."
    },
    {
      textEn: "8. The book of Ruth is identified in this lesson as an example of:",
      textEs: "8. El libro de Rut se identifica en esta lección como un ejemplo de:",
      optionsEn: ["A. Prophetic apocalypse","B. Wisdom literature","C. Theological narrative — story carrying redemption through structure and names","D. A Mosaic legal code"],
      optionsEs: ["A. Apocalipsis profético","B. Literatura sapiencial","C. Narrativa teológica — historia que carga la redención a través de la estructura y los nombres","D. Un código legal mosaico"],
      correct: "C",
      correctFeedbackEn: "Correct. Ruth is narrative — story told as theology. Names carry meaning. Structure carries weight. The book begins with three deaths in Moab and ends with a birth in Bethlehem in the line of David. No proof-text in the middle; the whole shape of the four chapters preaches.",
      correctFeedbackEs: "Correcto. Rut es narrativa — historia contada como teología. Los nombres cargan significado. La estructura carga peso. El libro comienza con tres muertes en Moab y termina con un nacimiento en Belén en la línea de David. Ningún versículo de prueba en el medio; toda la forma de los cuatro capítulos predica.",
      incorrectFeedbackEn: "Ruth is neither apocalypse, wisdom, nor legal code. It is THEOLOGICAL NARRATIVE — a story whose names, structure, and ending are theology in motion. Read it as story; let the gospel emerge from the shape of the four chapters.",
      incorrectFeedbackEs: "Rut no es ni apocalipsis, ni sabiduría, ni código legal. Es NARRATIVA TEOLÓGICA — una historia cuyos nombres, estructura, y final son teología en movimiento. Léala como historia; deje que el evangelio emerja de la forma de los cuatro capítulos."
    },
    {
      textEn: "9. In Ruth, Naomi asks to be renamed \"Mara.\" The lesson explains this as:",
      textEs: "9. En Rut, Noemí pide ser renombrada «Mara». La lección lo explica como:",
      optionsEn: ["A. A narrator's device — Naomi means \"pleasure\"; Mara means \"bitter\"; the change preaches theology through a name","B. A nickname her grandchildren gave her","C. An ancient Hebrew custom required at every funeral","D. A mistranslation of the original text"],
      optionsEs: ["A. Un recurso del narrador — Noemí significa «placer»; Mara significa «amarga»; el cambio predica teología a través de un nombre","B. Un apodo que le dieron sus nietos","C. Una costumbre hebrea antigua requerida en cada funeral","D. Una mala traducción del texto original"],
      correct: "A",
      correctFeedbackEn: "Correct. \"Do not call me Pleasure; call me Bitter, because the Almighty has dealt bitterly with me.\" In narrative genre, names carry theology. Naomi's renaming is the narrator preaching her grief through her name itself.",
      correctFeedbackEs: "Correcto. «No me llaméis Noemí, sino llamadme Mara: porque en grande amargura me ha puesto el Todopoderoso». En el género narrativo, los nombres cargan teología. El renombramiento de Noemí es el narrador predicando su dolor a través de su nombre mismo.",
      incorrectFeedbackEn: "Naomi's renaming is neither a nickname, a custom, nor a translation issue. It is a NARRATIVE DEVICE — Naomi means \"pleasure,\" Mara means \"bitter,\" and the name-change carries the theology of her grief. Narrative genre preaches through such details.",
      incorrectFeedbackEs: "El renombramiento de Noemí no es ni un apodo, ni una costumbre, ni un problema de traducción. Es un RECURSO NARRATIVO — Noemí significa «placer», Mara significa «amarga», y el cambio de nombre carga la teología de su dolor. El género narrativo predica a través de tales detalles."
    },
    {
      textEn: "10. The lesson identifies the structural arc of Ruth as:",
      textEs: "10. La lección identifica el arco estructural de Rut como:",
      optionsEn: ["A. Three deaths in Moab become one birth in Bethlehem in the line of the Messiah","B. A romance that begins and ends happily without theological weight","C. A legal proceeding from start to finish","D. A chronological war chronicle"],
      optionsEs: ["A. Tres muertes en Moab se vuelven un nacimiento en Belén en la línea del Mesías","B. Un romance que comienza y termina felizmente sin peso teológico","C. Un procedimiento legal de principio a fin","D. Una crónica cronológica de guerra"],
      correct: "A",
      correctFeedbackEn: "Correct. The narrative moves from three deaths in Moab to one birth in Bethlehem. The famine of chapter one is gone by chapter four. The bitterness of the opening becomes the blessing of the close — and the grandson is in the line of David and of Christ.",
      correctFeedbackEs: "Correcto. La narrativa se mueve de tres muertes en Moab a un nacimiento en Belén. La hambruna del capítulo uno se ha ido en el capítulo cuatro. La amargura de la apertura se vuelve la bendición del cierre — y el nieto está en la línea de David y de Cristo.",
      incorrectFeedbackEn: "Ruth's arc is not a weightless romance, a legal proceeding, or a war chronicle. The structure is THREE DEATHS IN MOAB → ONE BIRTH IN BETHLEHEM in the Messianic line. The story shape is itself the theology, which is how narrative genre preaches.",
      incorrectFeedbackEs: "El arco de Rut no es un romance sin peso, ni un procedimiento legal, ni una crónica de guerra. La estructura es TRES MUERTES EN MOAB → UN NACIMIENTO EN BELÉN en la línea mesiánica. La forma de la historia es ella misma la teología, que es como predica el género narrativo."
    },
    {
      textEn: "11. The lesson warns that the greatest temptation when preaching Ruth is to:",
      textEs: "11. La lección advierte que la mayor tentación al predicar Rut es:",
      optionsEn: ["A. Read it in Hebrew","B. Flatten it into a moral fable — \"be loyal like Ruth\" — and lose the redemption story","C. Skip it entirely","D. Translate every name into English"],
      optionsEs: ["A. Leerla en hebreo","B. Aplanarla a una fábula moral — «sea leal como Rut» — y perder la historia de redención","C. Saltarla por completo","D. Traducir cada nombre al español"],
      correct: "B",
      correctFeedbackEn: "Correct. The narrative genre is not a moral fable. Ruth is not asking you to admire her loyalty; it is showing you the Redeemer who is coming to do for His people what Boaz did for Ruth — notice the foreigner, cover her, pay the price, bring her into the family.",
      correctFeedbackEs: "Correcto. El género narrativo no es una fábula moral. Rut no le pide que admire su lealtad; le muestra al Redentor que viene a hacer por Su pueblo lo que Boaz hizo por Rut — notar a la extranjera, cubrirla, pagar el precio, traerla a la familia.",
      incorrectFeedbackEn: "Hebrew reading, skipping, and translation are not the temptation named. The DANGER is MORALIZING the narrative — \"be loyal like Ruth\" — which strips the redemption story of its gospel content. Narrative genre preaches Christ, not character formation alone.",
      incorrectFeedbackEs: "La lectura en hebreo, saltarlo, y traducir no son la tentación nombrada. El PELIGRO es MORALIZAR la narrativa — «sea leal como Rut» — lo que despoja a la historia de redención de su contenido evangélico. El género narrativo predica a Cristo, no solo la formación del carácter."
    },
    {
      textEn: "12. The lesson compares the Prodigal Son (Luke 15) with Hosea (Hosea 1-3) to teach:",
      textEs: "12. La lección compara al Hijo Pródigo (Lucas 15) con Oseas (Oseas 1-3) para enseñar:",
      optionsEn: ["A. The same gospel of unforgivable forgiveness is preached in two different genres — parable and prophetic enacted biography","B. The Prodigal Son is the better story","C. Hosea is a Christian rewrite of the Prodigal","D. The two stories contradict each other"],
      optionsEs: ["A. El mismo evangelio del perdón imperdonable se predica en dos géneros distintos — parábola y biografía profética representada","B. El Hijo Pródigo es la mejor historia","C. Oseas es una reescritura cristiana del Pródigo","D. Las dos historias se contradicen entre sí"],
      correct: "A",
      correctFeedbackEn: "Correct. The same gospel sounds different in different genres. The Prodigal Son comes to himself and repents; Gomer is simply bought back and loved again. Repentance and pursuit — two truths necessary to the gospel, each preached in the genre best suited to deliver it.",
      correctFeedbackEs: "Correcto. El mismo evangelio suena diferente en géneros distintos. El Hijo Pródigo vuelve en sí y se arrepiente; Gomer es simplemente comprada de vuelta y amada de nuevo. Arrepentimiento y búsqueda — dos verdades necesarias al evangelio, cada una predicada en el género mejor preparado para entregarla.",
      incorrectFeedbackEn: "The comparison is not a ranking, a rewrite claim, or a contradiction. The two stories preach the SAME GOSPEL in DIFFERENT GENRES — and the genre difference is itself part of how the Bible delivers the truth from every angle.",
      incorrectFeedbackEs: "La comparación no es una clasificación, ni una reclamación de reescritura, ni una contradicción. Las dos historias predican el MISMO EVANGELIO en GÉNEROS DISTINTOS — y la diferencia de género es ella misma parte de cómo la Biblia entrega la verdad desde cada ángulo."
    },
    {
      textEn: "13. The most important difference between the Prodigal Son's return and Gomer's return, according to the lesson, is:",
      textEs: "13. La diferencia más importante entre el regreso del Hijo Pródigo y el regreso de Gomer, según la lección, es:",
      optionsEn: ["A. The Prodigal returns home; Gomer never returns home","B. The Prodigal Son was Jewish; Gomer was not","C. The Prodigal Son came to himself and repented; the text says Gomer's husband simply bought her back and loved her again","D. They lived in different historical periods"],
      optionsEs: ["A. El Pródigo regresa a casa; Gomer nunca regresa a casa","B. El Hijo Pródigo era judío; Gomer no lo era","C. El Hijo Pródigo vuelve en sí y se arrepiente; el texto dice que el esposo de Gomer simplemente la compró de vuelta y la amó de nuevo","D. Vivieron en diferentes períodos históricos"],
      correct: "C",
      correctFeedbackEn: "Correct. In one genre, redemption is preached through the sinner's return; in another, redemption is preached through the husband's pursuit. Both are true, and the Bible needs both, and each genre tells the truth its form was built to tell.",
      correctFeedbackEs: "Correcto. En un género, la redención se predica a través del retorno del pecador; en otro, la redención se predica a través de la búsqueda del esposo. Ambas son ciertas, y la Biblia necesita ambas, y cada género dice la verdad que su forma fue edificada para decir.",
      incorrectFeedbackEn: "Both Gomer and the Prodigal return home in their stories. The key difference is THEOLOGICAL: the Prodigal Son repents; Gomer's text just says her husband bought her back and loved her again. Two genres preaching two complementary halves of the gospel.",
      incorrectFeedbackEs: "Tanto Gomer como el Pródigo regresan a casa en sus historias. La diferencia clave es TEOLÓGICA: el Hijo Pródigo se arrepiente; el texto de Gomer simplemente dice que su esposo la compró de vuelta y la amó de nuevo. Dos géneros predicando dos mitades complementarias del evangelio."
    },
    {
      textEn: "14. According to this lesson, when reading the Psalms the pastor must remember:",
      textEs: "14. Según esta lección, al leer los Salmos el pastor debe recordar:",
      optionsEn: ["A. The Psalms are scientific manuals","B. The Psalms are flat doctrinal propositions","C. The Psalms are poetry — image, parallel lines, emotion","D. The Psalms are legal codes"],
      optionsEs: ["A. Los Salmos son manuales científicos","B. Los Salmos son proposiciones doctrinales planas","C. Los Salmos son poesía — imagen, líneas paralelas, emoción","D. Los Salmos son códigos legales"],
      correct: "C",
      correctFeedbackEn: "Correct. Read \"Why have You forsaken me?\" as a poet's cry, not as doctrine about divine abandonment. Read \"The Lord is my shepherd\" as metaphor, not as zoology. Read the Psalms as poetry and they will teach your people to pray.",
      correctFeedbackEs: "Correcto. Lea «¿Por qué me has desamparado?» como el grito de un poeta, no como doctrina sobre el abandono divino. Lea «Jehová es mi pastor» como metáfora, no como zoología. Lea los Salmos como poesía y enseñarán a su pueblo a orar.",
      incorrectFeedbackEn: "The Psalms are not science, propositions, or law. They are POETRY — Hebrew poetry with parallel lines, compressed images, and emotional range. Reading them as anything else strips the poetry and produces abstractions where the Psalmist meant to wring tears.",
      incorrectFeedbackEs: "Los Salmos no son ciencia, ni proposiciones, ni ley. Son POESÍA — poesía hebrea con líneas paralelas, imágenes comprimidas, y rango emocional. Leerlos como cualquier otra cosa despoja la poesía y produce abstracciones donde el salmista quiso arrancar lágrimas."
    },
    {
      textEn: "15. The lesson warns that reading Proverbs 22:6 (\"Train up a child in the way he should go...\") as an ABSOLUTE PROMISE will:",
      textEs: "15. La lección advierte que leer Proverbios 22:6 («Instruye al niño en su carrera...») como una PROMESA ABSOLUTA:",
      optionsEn: ["A. Wound the obedient parent whose child still becomes a prodigal","B. Always succeed without exception","C. Improve every child's behavior","D. Replace the need for parenting"],
      optionsEs: ["A. Herirá al padre obediente cuyo hijo todavía se vuelve pródigo","B. Siempre tendrá éxito sin excepción","C. Mejorará la conducta de cada niño","D. Reemplazará la necesidad de paternidad"],
      correct: "A",
      correctFeedbackEn: "Correct. Proverbs are observations of how the world USUALLY works under God's rule, not absolute guarantees. Reading them as guarantees crushes parents whose obedient diligence still produces a wayward child. The genre requires room for the exception.",
      correctFeedbackEs: "Correcto. Los Proverbios son observaciones de cómo USUALMENTE funciona el mundo bajo el gobierno de Dios, no garantías absolutas. Leerlos como garantías aplasta a los padres cuya diligencia obediente todavía produce un hijo descarriado. El género requiere espacio para la excepción.",
      incorrectFeedbackEn: "Proverbs are NOT absolute promises. Reading them that way produces wounded believers — the obedient parent whose child still strayed feels betrayed by what he thought was a guarantee. The genre of Proverbs requires the pastor to teach both the pattern AND the exception.",
      incorrectFeedbackEs: "Los Proverbios NO son promesas absolutas. Leerlos así produce creyentes heridos — el padre obediente cuyo hijo todavía se descarrió se siente traicionado por lo que pensó era una garantía. El género de los Proverbios requiere que el pastor enseñe el patrón Y la excepción."
    },
    {
      textEn: "16. The lesson's first rule of thumb for honoring genre is:",
      textEs: "16. La primera regla práctica de la lección para honrar el género es:",
      optionsEn: ["A. Memorize verses in Greek","B. Read a passage in its book","C. Avoid commentaries","D. Translate the verse into multiple languages"],
      optionsEs: ["A. Memorizar versículos en griego","B. Leer un pasaje en su libro","C. Evitar los comentarios","D. Traducir el versículo a varios idiomas"],
      correct: "B",
      correctFeedbackEn: "Correct. A verse pulled out of Hosea will not behave like a verse pulled out of Romans. The book is the first signal of the genre. Read the passage in its book and you have already done most of the genre work.",
      correctFeedbackEs: "Correcto. Un versículo sacado de Oseas no se comportará como un versículo sacado de Romanos. El libro es la primera señal del género. Lea el pasaje en su libro y ya habrá hecho la mayor parte del trabajo del género.",
      incorrectFeedbackEn: "Memorization, commentary-avoidance, and translation are not the first rule. The FIRST rule is READ A PASSAGE IN ITS BOOK — because the book reveals the genre, and the genre sets the reading rules.",
      incorrectFeedbackEs: "La memorización, evitar comentarios, y traducir no son la primera regla. La PRIMERA regla es LEER UN PASAJE EN SU LIBRO — porque el libro revela el género, y el género fija las reglas de lectura."
    },
    {
      textEn: "17. The lesson identifies three errors a pastor who flattens every text into the same shape will fall into. Which is NOT one of those three?",
      textEs: "17. La lección identifica tres errores en los cuales caerá un pastor que aplana cada texto a la misma forma. ¿Cuál NO es uno de esos tres?",
      optionsEn: ["A. Treating poetry as propositional doctrine","B. Treating narrative as moral fable","C. Treating prophecy as private prediction","D. Treating the Bible as a library of many genres"],
      optionsEs: ["A. Tratar la poesía como doctrina proposicional","B. Tratar la narrativa como fábula moral","C. Tratar la profecía como predicción privada","D. Tratar la Biblia como una biblioteca de muchos géneros"],
      correct: "D",
      correctFeedbackEn: "Correct. Treating the Bible as a library of many genres is exactly what the lesson RECOMMENDS — that is the solution, not the problem. The three ERRORS are flattening poetry into doctrine, narrative into moralism, and prophecy into prediction.",
      correctFeedbackEs: "Correcto. Tratar la Biblia como una biblioteca de muchos géneros es exactamente lo que la lección RECOMIENDA — ésa es la solución, no el problema. Los tres ERRORES son aplanar la poesía a doctrina, la narrativa a moralismo, y la profecía a predicción.",
      incorrectFeedbackEn: "Treating the Bible as a library is what the lesson RECOMMENDS — that is the cure, not the disease. The three errors are: poetry-as-doctrine, narrative-as-moralism, prophecy-as-prediction. Each flattens a real genre into a wrong shape.",
      incorrectFeedbackEs: "Tratar la Biblia como una biblioteca es lo que la lección RECOMIENDA — ésa es la cura, no la enfermedad. Los tres errores son: poesía-como-doctrina, narrativa-como-moralismo, profecía-como-predicción. Cada uno aplana un género real a una forma equivocada."
    },
    {
      textEn: "18. The lesson teaches that a pastor whose every sermon SOUNDS THE SAME is probably:",
      textEs: "18. La lección enseña que un pastor cuyos sermones SUENAN TODOS IGUALES probablemente está:",
      optionsEn: ["A. A very disciplined preacher","B. Not honoring genre — the Bible itself does not sound the same from book to book","C. Preaching too long","D. Using too many illustrations"],
      optionsEs: ["A. Es un predicador muy disciplinado","B. No está honrando el género — la Biblia misma no suena igual de libro a libro","C. Predicando demasiado largo","D. Usando demasiadas ilustraciones"],
      correct: "B",
      correctFeedbackEn: "Correct. A narrative sermon shows. A poetic sermon evokes. A wisdom sermon observes patterns and respects exceptions. A prophetic sermon confronts. An epistolary sermon argues from doctrine to application. Sameness across all sermons is the symptom of flattened genre.",
      correctFeedbackEs: "Correcto. Un sermón narrativo muestra. Un sermón poético evoca. Un sermón de sabiduría observa patrones y respeta excepciones. Un sermón profético confronta. Un sermón epistolar argumenta de la doctrina a la aplicación. La uniformidad en todos los sermones es el síntoma del género aplanado.",
      incorrectFeedbackEn: "Sermon uniformity is not discipline, length, or illustration count. It is the SYMPTOM of flattened genre. The Bible itself sounds different from book to book; a pastor's sermons should reflect that, because each genre asks for a different sermonic voice.",
      incorrectFeedbackEs: "La uniformidad sermónica no es disciplina, ni duración, ni conteo de ilustraciones. Es el SÍNTOMA del género aplanado. La Biblia misma suena diferente de libro a libro; los sermones del pastor deben reflejarlo, porque cada género pide una voz sermónica distinta."
    },
    {
      textEn: "19. The closing image of this unit compares the Bible to:",
      textEs: "19. La imagen de cierre de esta unidad compara la Biblia con:",
      optionsEn: ["A. A single book with one unified literary style","B. A textbook on theology","C. A historical archive of one type of document","D. A library — many genres each read in its own way"],
      optionsEs: ["A. Un solo libro con un estilo literario unificado","B. Un libro de texto de teología","C. Un archivo histórico de un solo tipo de documento","D. Una biblioteca — muchos géneros leídos cada uno a su manera"],
      correct: "D",
      correctFeedbackEn: "Correct. The Bible is a library. The God who breathed it out chose many genres on purpose. The pastor who walks into the Bible and tries to read Hosea like Romans, or Ruth like Psalms, fails at both. Each room of the library asks to be read its own way.",
      correctFeedbackEs: "Correcto. La Biblia es una biblioteca. El Dios que la exhaló escogió muchos géneros a propósito. El pastor que entra a la Biblia y trata de leer Oseas como Romanos, o Rut como Salmos, fracasa en ambos. Cada cuarto de la biblioteca pide ser leído a su propia manera.",
      incorrectFeedbackEn: "The Bible is not a single-style book, a theology textbook, or one type of document. It is a LIBRARY — many books, many genres, each chosen by the Spirit for a particular way of delivering truth. The closing image is library, not monolith.",
      incorrectFeedbackEs: "La Biblia no es un libro de un solo estilo, ni un libro de texto de teología, ni un solo tipo de documento. Es una BIBLIOTECA — muchos libros, muchos géneros, cada uno escogido por el Espíritu para una manera particular de entregar la verdad. La imagen de cierre es la biblioteca, no el monolito."
    },
    {
      textEn: "20. The closing charge of this unit to the pastor is:",
      textEs: "20. El encargo de cierre de esta unidad al pastor es:",
      optionsEn: ["A. Pick one favorite genre and preach only from it","B. Avoid all prophecy and apocalypse","C. Treat every text the same way for consistency","D. Read the library like a library — let each genre say the gospel in its own way"],
      optionsEs: ["A. Escoja un género favorito y predique solo de él","B. Evite toda la profecía y el apocalipsis","C. Trate cada texto de la misma manera por consistencia","D. Lea la biblioteca como una biblioteca — deje que cada género diga el evangelio a su propia manera"],
      correct: "D",
      correctFeedbackEn: "Correct. The same gospel of unforgivable forgiveness that Hosea preached in a marriage, Ruth preached in a love story, and Jesus preached in a parable, will preach through your sermons too — IF you let each genre say it in its own way.",
      correctFeedbackEs: "Correcto. El mismo evangelio del perdón imperdonable que Oseas predicó en un matrimonio, Rut predicó en una historia de amor, y Jesús predicó en una parábola, predicará también a través de sus sermones — SI deja que cada género lo diga a su propia manera.",
      incorrectFeedbackEn: "Favorites-only preaching, avoiding prophecy, and uniform-text treatment all violate the unit's principle. The closing charge is the LIBRARY image: read each room its own way, let each genre preach its own message, and the gospel will be delivered from every angle.",
      incorrectFeedbackEs: "Predicar solo favoritos, evitar la profecía, y tratar uniformemente los textos todos violan el principio de la unidad. El encargo de cierre es la imagen de la BIBLIOTECA: lea cada cuarto a su propia manera, deje que cada género predique su propio mensaje, y el evangelio será entregado desde cada ángulo."
    }
  ];

const kwQuestions = [
    {
      textEn: "21. State in your own words the central principle of this unit, and explain why \"what kind of writing am I reading?\" must come before \"what does this mean?\"",
      textEs: "21. Declare con sus propias palabras el principio central de esta unidad, y explique por qué «¿qué clase de escritura estoy leyendo?» debe venir antes de «¿qué significa esto?»",
      kw_en: ["genre", "determines", "interpretation", "kind", "reading", "before", "meaning", "rules"],
      kw_es: ["géner", "determina", "interpretación", "tipo", "lectura", "antes", "significado", "reglas"],
      modelEn: "The central principle is that genre determines interpretation: the kind of writing decides the rules for reading it. 'What kind of writing am I reading?' must come before 'What does this mean?' because the same words mean different things in a law, a poem, a proverb, or a narrative. Identify the genre first, then the meaning.",
      modelEs: "El principio central es que el género determina la interpretación: el tipo de escrito decide las reglas para leerlo. «¿Qué tipo de escrito estoy leyendo?» debe venir antes de «¿Qué significa esto?» porque las mismas palabras significan cosas distintas en una ley, un poema, un proverbio o una narrativa. Identifique el género primero, luego el significado."
    },
    {
      textEn: "22. List the six main biblical genres named in this lesson, and briefly describe what makes each one distinct.",
      textEs: "22. Enumere los seis géneros bíblicos principales nombrados en esta lección, y describa brevemente qué hace a cada uno distinto.",
      kw_en: ["narrative", "law", "wisdom", "poetry", "prophecy", "epistles", "genre", "distinct"],
      kw_es: ["narrativa", "ley", "sabiduría", "poesía", "profecía", "epístolas", "género", "distinto"],
      modelEn: "The lesson names six main biblical genres: narrative, which tells what happened; law, which commands; wisdom, which observes how life works; poetry, which sings in parallel lines and images; prophecy, which announces God's word in symbol and oracle; and epistles, which argue and instruct. Each genre is distinct and read by its own rules.",
      modelEs: "La lección nombra seis géneros bíblicos principales: la narrativa, que cuenta lo que pasó; la ley, que manda; la sabiduría, que observa cómo funciona la vida; la poesía, que canta en líneas paralelas e imágenes; la profecía, que anuncia la palabra de Dios en símbolo y oráculo; y las epístolas, que argumentan e instruyen. Cada género es distinto y se lee por sus propias reglas."
    },
    {
      textEn: "23. Explain why Hosea must be read as PROPHECY rather than as autobiography, and what the prophetic genre unlocks in the book that autobiography would miss.",
      textEs: "23. Explique por qué Oseas debe leerse como PROFECÍA en lugar de autobiografía, y lo que el género profético desbloquea en el libro que la autobiografía perdería.",
      kw_en: ["Hosea", "prophecy", "symbolic", "marriage", "Israel", "sermon", "genre", "autobiography"],
      kw_es: ["Oseas", "profecía", "simbólic", "matrimonio", "Israel", "sermón", "género", "autobiografía"],
      modelEn: "Hosea must be read as prophecy, not autobiography. His marriage to Gomer is a symbolic action — an enacted sermon to Israel — not merely one ancient pastor's hard marriage. Read as autobiography it becomes a debate about whether God told a man to marry a prostitute. Read in its prophetic genre, every painful detail becomes theology about God and unfaithful Israel.",
      modelEs: "Oseas debe leerse como profecía, no como autobiografía. Su matrimonio con Gomer es una acción simbólica — un sermón representado a Israel — no solo el difícil matrimonio de un pastor antiguo. Leído como autobiografía se vuelve un debate sobre si Dios mandó a un hombre casarse con una prostituta. Leído en su género profético, cada detalle doloroso se vuelve teología sobre Dios y el Israel infiel."
    },
    {
      textEn: "24. Trace what Hosea's marriage to Gomer preaches theologically: name Gomer's role, Hosea's role, the meaning of the children's names, and what the redemption from the slave market signifies.",
      textEs: "24. Trace lo que el matrimonio de Oseas con Gomer predica teológicamente: nombre el papel de Gomer, el papel de Oseas, el significado de los nombres de los hijos, y lo que la redención del mercado de esclavos significa.",
      kw_en: ["Gomer", "Israel", "Hosea", "God", "children", "redeem", "slave", "names"],
      kw_es: ["Gomer", "Israel", "Oseas", "Dios", "hijos", "redim", "esclav", "nombres"],
      modelEn: "Hosea's marriage preaches theology. Gomer plays the part of Israel, the unfaithful wife; Hosea plays the part of God, the faithful husband. The children's names announce judgment on Israel. And when Hosea buys Gomer back from the slave market, it signifies God redeeming His people out of bondage — buying back the unfaithful at a price.",
      modelEs: "El matrimonio de Oseas predica teología. Gomer hace el papel de Israel, la esposa infiel; Oseas hace el papel de Dios, el esposo fiel. Los nombres de los hijos anuncian juicio sobre Israel. Y cuando Oseas vuelve a comprar a Gomer del mercado de esclavos, significa que Dios redime a Su pueblo de la esclavitud — comprando de nuevo a los infieles por un precio."
    },
    {
      textEn: "25. Explain why Ruth is identified as theological narrative, and describe how the names (Elimelech, Naomi, Mahlon, Chilion, Ruth, Mara) carry the theology of the book.",
      textEs: "25. Explique por qué Rut se identifica como narrativa teológica, y describa cómo los nombres (Elimelec, Noemí, Mahlón, Quelión, Rut, Mara) cargan la teología del libro.",
      kw_en: ["Ruth", "narrative", "names", "Naomi", "Mara", "bitter", "pleasant", "theology"],
      kw_es: ["Rut", "narrativa", "nombres", "Noemí", "Mara", "amarga", "agradable", "teología"],
      modelEn: "Ruth is theological narrative — a story that preaches without symbolic visions. Even the names carry the theology: Naomi means 'pleasant,' but when she returns empty from Moab she calls herself Mara, meaning 'bitter.' The movement from pleasant to bitter and back to blessing is the theology of redemption told in narrative form.",
      modelEs: "Rut es narrativa teológica — una historia que predica sin visiones simbólicas. Hasta los nombres llevan la teología: Noemí significa «agradable», pero cuando regresa vacía de Moab se llama a sí misma Mara, que significa «amarga». El paso de lo agradable a lo amargo y de nuevo a la bendición es la teología de la redención contada en forma de narrativa."
    },
    {
      textEn: "26. Describe the structural arc of Ruth (from Moab to Bethlehem) and explain how the structure itself is the theology in narrative genre.",
      textEs: "26. Describa el arco estructural de Rut (de Moab a Belén) y explique cómo la estructura misma es la teología en el género narrativo.",
      kw_en: ["Moab", "Bethlehem", "famine", "deaths", "birth", "David", "Messiah", "structure"],
      kw_es: ["Moab", "Belén", "hambruna", "muertes", "nacimiento", "David", "Mesías", "estructura"],
      modelEn: "Ruth's structure is its theology. The book begins with a famine and three deaths in Moab and ends with a birth in Bethlehem — the famine becomes fullness, the bitterness becomes blessing. The child born is Obed, grandfather of David, in the line of the Messiah. The very shape of the narrative, from emptiness to fullness, preaches redemption.",
      modelEs: "La estructura de Rut es su teología. El libro comienza con una hambruna y tres muertes en Moab y termina con un nacimiento en Belén — la hambruna se vuelve abundancia, la amargura se vuelve bendición. El niño que nace es Obed, abuelo de David, en el linaje del Mesías. La forma misma de la narrativa, del vacío a la plenitud, predica redención."
    },
    {
      textEn: "27. Compare the Prodigal Son (Luke 15) with Hosea (Hosea 1-3) to show how the same gospel is preached through two different genres. Identify the key theological difference between the two stories.",
      textEs: "27. Compare al Hijo Pródigo (Lucas 15) con Oseas (Oseas 1-3) para mostrar cómo el mismo evangelio se predica a través de dos géneros distintos. Identifique la diferencia teológica clave entre las dos historias.",
      kw_en: ["Prodigal", "parable", "Hosea", "prophecy", "love", "redeem", "genre", "gospel"],
      kw_es: ["Pródigo", "parábola", "Oseas", "profecía", "amor", "redim", "género", "evangelio"],
      modelEn: "The Prodigal Son (a parable) and Hosea (prophecy) preach the same gospel of a faithful love that takes back the unfaithful, but through two different genres. The key theological difference is the cost shown: the Prodigal's father runs in welcoming grace, while Hosea must buy Gomer back from the slave market — the same redeeming love, one told as parable, one as enacted prophecy.",
      modelEs: "El Hijo Pródigo (una parábola) y Oseas (profecía) predican el mismo evangelio de un amor fiel que recupera al infiel, pero por medio de dos géneros distintos. La diferencia teológica clave es el costo que se muestra: el padre del Pródigo corre en gracia que recibe, mientras Oseas debe comprar a Gomer del mercado de esclavos — el mismo amor redentor, uno contado como parábola, otro como profecía representada."
    },
    {
      textEn: "28. Explain the danger of reading Hebrew poetry (the Psalms) as flat doctrinal propositions, and describe what the poetic genre requires the pastor to honor.",
      textEs: "28. Explique el peligro de leer la poesía hebrea (los Salmos) como proposiciones doctrinales planas, y describa lo que el género poético requiere que el pastor honre.",
      kw_en: ["poetry", "parallel", "image", "emotion", "metaphor", "flat", "proposition", "Psalms"],
      kw_es: ["poesía", "paralel", "imagen", "emoción", "metáfora", "aplan", "proposición", "Salmos"],
      modelEn: "Reading Hebrew poetry — the Psalms — as flat doctrinal propositions misses how it works. Poetry speaks in parallel lines that restate and intensify, in compressed images and metaphor, and it gives emotion room to speak. The poetic genre requires the pastor to honor the parallelism, the imagery, and the feeling, not to flatten a psalm into a list of propositions.",
      modelEs: "Leer la poesía hebrea — los Salmos — como proposiciones doctrinales planas pierde cómo funciona. La poesía habla en líneas paralelas que reafirman e intensifican, en imágenes comprimidas y metáfora, y da espacio a la emoción. El género poético exige que el pastor honre el paralelismo, las imágenes y el sentimiento, no que aplane un salmo en una lista de proposiciones."
    },
    {
      textEn: "29. Explain why Proverbs should NOT be read as absolute promises, using Proverbs 22:6 (\"Train up a child...\") as an example. What pastoral damage results when the genre is misread?",
      textEs: "29. Explique por qué los Proverbios NO deben leerse como promesas absolutas, usando Proverbios 22:6 («Instruye al niño...») como ejemplo. ¿Qué daño pastoral resulta cuando el género se lee mal?",
      kw_en: ["Proverbs", "observation", "general", "promise", "exception", "pattern", "absolute", "damage"],
      kw_es: ["Proverbios", "observac", "general", "promesa", "excepción", "patrón", "absoluta", "daño"],
      modelEn: "Proverbs are observations of how life usually works under God's rule, not absolute promises. 'Train up a child in the way he should go' (22:6) is a general pattern, not a guarantee, and there are exceptions. Read as an iron promise it does pastoral damage — wounding a faithful parent whose grown child has strayed by telling them they must have failed.",
      modelEs: "Los Proverbios son observaciones de cómo funciona normalmente la vida bajo el gobierno de Dios, no promesas absolutas. «Instruye al niño en su camino» (22:6) es un patrón general, no una garantía, y hay excepciones. Leído como una promesa de hierro hace daño pastoral — hiriendo a un padre fiel cuyo hijo adulto se ha desviado al decirle que debió haber fallado."
    },
    {
      textEn: "30. State and explain the lesson's closing image: \"Read the library like a library.\" What does this charge require the pastor to do every week in sermon preparation?",
      textEs: "30. Declare y explique la imagen de cierre de la lección: «Lea la biblioteca como una biblioteca». ¿Qué requiere este encargo que el pastor haga cada semana en la preparación del sermón?",
      kw_en: ["library", "genre", "each", "way", "Bible", "preach", "threshold", "read"],
      kw_es: ["biblioteca", "género", "cada", "manera", "Biblia", "predicar", "umbral", "leer"],
      modelEn: "The closing image is 'read the library like a library.' The Bible is a library of many genres God chose on purpose, each a different way of getting truth into the heart. As a reader would not read poetry like a phone directory, the pastor must pause at the threshold of each book and read each genre its own way before he preaches it.",
      modelEs: "La imagen de cierre es «lea la biblioteca como una biblioteca». La Biblia es una biblioteca de muchos géneros que Dios escogió a propósito, cada uno una manera distinta de meter la verdad en el corazón. Como un lector no leería poesía como una guía telefónica, el pastor debe detenerse en el umbral de cada libro y leer cada género a su manera antes de predicarlo."
    }
  ];
