/* CTSBible - unit 9: per-unit configuration and content. */

const UNIT = 9;

const COURSE_PREFIX = 'cts_bible_u9_';

const mcQuestions = [
  { textEn:`The fourth and final witness is:`, textEs:`El cuarto y último testigo es:`,
    optionsEn:[`The canon`, `The text`, `Geography — the land itself, the stage of events`, `Archaeology`],
    optionsEs:[`El canon`, `El texto`, `La geografía — la tierra misma, el escenario de los eventos`, `La arqueología`],
    correct:2, explanationEn:`The fourth witness is geography — the very stage of the events.`, explanationEs:`El cuarto testigo es la geografía — el mismísimo escenario de los eventos.` },

  { textEn:`What is special about the witness of geography, per the unit?`, textEs:`¿Qué es especial del testigo de la geografía, según la unidad?`,
    optionsEn:[`It requires Greek`, `Only scholars can test it`, `It proves miracles`, `Anyone can check it, with a map`],
    optionsEs:[`Requiere griego`, `Solo los eruditos pueden probarlo`, `Prueba los milagros`, `Cualquiera puede comprobarlo, con un mapa`],
    correct:3, explanationEn:`Anyone can test it with a map — no scholar's training needed.`, explanationEs:`Cualquiera puede probarlo con un mapa — sin formación de erudito.` },

  { textEn:`In the Bible, one always "goes up" to Jerusalem and "down" from it because:`, textEs:`En la Biblia, uno siempre "sube" a Jerusalén y "baja" de ella porque:`,
    optionsEn:[`It sits high on the central ridge, regardless of compass direction`, `It is by the sea`, `It is in the north`, `The language is only symbolic`],
    optionsEs:[`Se asienta en lo alto de la cordillera central, sin importar la dirección de la brújula`, `Está junto al mar`, `Está en el norte`, `El lenguaje es solo simbólico`],
    correct:0, explanationEn:`Jerusalem sits high on the ridge, so you always go "up" to it.`, explanationEs:`Jerusalén se asienta en lo alto de la cordillera, así que siempre "subes" a ella.` },

  { textEn:`"A certain man went down from Jerusalem to Jericho" (Luke 10:30) is topographically exact because:`, textEs:`"Un hombre descendía de Jerusalén a Jericó" (Lucas 10:30) es topográficamente exacto porque:`,
    optionsEn:[`Jericho is higher than Jerusalem`, `The road drops over 3,000 feet in about 17 miles`, `They are at the same elevation`, `Jericho is in the mountains`],
    optionsEs:[`Jericó es más alto que Jerusalén`, `El camino cae más de 3,000 pies en unas 17 millas`, `Están a la misma elevación`, `Jericó está en las montañas`],
    correct:1, explanationEn:`The road plunges over 3,000 feet from Jerusalem down to Jericho.`, explanationEs:`El camino se precipita más de 3,000 pies de Jerusalén hasta Jericó.` },

  { textEn:`The Sea of Galilee is prone to sudden violent storms because:`, textEs:`El Mar de Galilea es propenso a súbitas tormentas violentas porque:`,
    optionsEn:[`It is on a mountaintop`, `It is an ocean`, `It sits in a basin below sea level, where cold air spilling down the hills whips the water`, `It never storms`],
    optionsEs:[`Está en la cima de una montaña`, `Es un océano`, `Se asienta en un cuenco bajo el nivel del mar, donde el aire frío que baja por las colinas azota el agua`, `Nunca tiene tormentas`],
    correct:2, explanationEn:`Cold air spilling into the below-sea-level basin whips up sudden storms.`, explanationEs:`El aire frío que baja al cuenco bajo el nivel del mar levanta súbitas tormentas.` },

  { textEn:`The Dead Sea is notable as:`, textEs:`El Mar Muerto es notable como:`,
    optionsEn:[`Located in Egypt`, `The highest lake on earth`, `A freshwater lake`, `The lowest exposed land elevation on the earth's surface`],
    optionsEs:[`Ubicado en Egipto`, `El lago más alto de la tierra`, `Un lago de agua dulce`, `La elevación de tierra expuesta más baja de la superficie de la tierra`],
    correct:3, explanationEn:`The Dead Sea's shore is the lowest exposed land elevation on the earth's surface.`, explanationEs:`La orilla del Mar Muerto es la elevación de tierra expuesta más baja de la superficie de la tierra.` },

  { textEn:`John says the Pool of Bethesda had:`, textEs:`Juan dice que el estanque de Betesda tenía:`,
    optionsEn:[`Five porticoes — later confirmed by excavation`, `A hundred steps`, `No porticoes`, `No water`],
    optionsEs:[`Cinco pórticos — luego confirmado por excavación`, `Cien escalones`, `Ningún pórtico`, `Nada de agua`],
    correct:0, explanationEn:`John's five porticoes were confirmed when the pool was excavated.`, explanationEs:`Los cinco pórticos de Juan se confirmaron al excavar el estanque.` },

  { textEn:`John's precise knowledge of Jerusalem's pools and pavements argues that:`, textEs:`El conocimiento preciso de Juan de los estanques y enlosados de Jerusalén argumenta que:`,
    optionsEn:[`He never saw the city`, `He knew the city intimately, before its destruction in AD 70`, `He wrote centuries later`, `He invented the places`],
    optionsEs:[`Nunca vio la ciudad`, `Conocía la ciudad íntimamente, antes de su destrucción en el 70 d.C.`, `Escribió siglos después`, `Inventó los lugares`],
    correct:1, explanationEn:`Such exact knowledge argues John knew Jerusalem before AD 70.`, explanationEs:`Tal conocimiento exacto argumenta que Juan conocía Jerusalén antes del 70 d.C.` },

  { textEn:`Luke's naming of local officials in Acts is remarkable because:`, textEs:`El nombramiento de Lucas de los funcionarios locales en Hechos es notable porque:`,
    optionsEn:[`All titles were the same everywhere`, `He never names officials`, `The titles were all wrong`, `Titles differed by city and changed over time, yet Luke is right every time`],
    optionsEs:[`Todos los títulos eran iguales en todas partes`, `Nunca nombra funcionarios`, `Los títulos estaban todos equivocados`, `Los títulos diferían por ciudad y cambiaban con el tiempo, sin embargo Lucas acierta cada vez`],
    correct:3, explanationEn:`Titles varied and changed, yet Luke got them right every time.`, explanationEs:`Los títulos variaban y cambiaban, sin embargo Lucas los acertó cada vez.` },

  { textEn:`The "politarchs" of Thessalonica (Acts 17:6) were:`, textEs:`Los "politarcas" de Tesalónica (Hechos 17:6) fueron:`,
    optionsEn:[`Roman emperors`, `A title Luke invented`, `Once called an error, then confirmed by inscriptions`, `Jewish priests`],
    optionsEs:[`Emperadores romanos`, `Un título que Lucas inventó`, `Una vez llamados un error, luego confirmados por inscripciones`, `Sacerdotes judíos`],
    correct:2, explanationEn:`"Politarchs" was called an error until inscriptions confirmed it.`, explanationEs:`"Politarcas" fue llamado un error hasta que las inscripciones lo confirmaron.` },

  { textEn:`The scholar Sir William Ramsay:`, textEs:`El erudito Sir William Ramsay:`,
    optionsEn:[`Proved Luke was a fraud`, `Began doubting Luke and ended calling him a historian of the first rank`, `Never studied Acts`, `Ignored geography`],
    optionsEs:[`Probó que Lucas era un fraude`, `Comenzó dudando de Lucas y terminó llamándolo un historiador de primer orden`, `Nunca estudió Hechos`, `Ignoró la geografía`],
    correct:1, explanationEn:`Ramsay began a skeptic and ended calling Luke a first-rank historian.`, explanationEs:`Ramsay comenzó escéptico y terminó llamando a Lucas historiador de primer orden.` },

  { textEn:`The shipwreck voyage of Acts 27 reads like:`, textEs:`El viaje del naufragio de Hechos 27 se lee como:`,
    optionsEn:[`A mariner's own log, exact in winds and soundings`, `A vague legend`, `A poem`, `An error-filled tale`],
    optionsEs:[`El propio cuaderno de bitácora de un marinero, exacto en vientos y sondeos`, `Una leyenda vaga`, `Un poema`, `Un relato lleno de errores`],
    correct:0, explanationEn:`Acts 27 reads like a mariner's log — exact in winds and soundings.`, explanationEs:`Hechos 27 se lee como la bitácora de un marinero — exacto en vientos y sondeos.` },

  { textEn:`Luke sets Emmaus about ___ from Jerusalem, and John sets Bethany about ___ away.`, textEs:`Lucas sitúa Emaús a unos ___ de Jerusalén, y Juan sitúa Betania a unos ___.`,
    optionsEn:[`A hundred miles / a thousand furlongs`, `One mile / two miles`, `No distances are given`, `Threescore furlongs / fifteen furlongs`],
    optionsEs:[`Cien millas / mil estadios`, `Una milla / dos millas`, `No se dan distancias`, `Sesenta estadios / quince estadios`],
    correct:3, explanationEn:`Emmaus ~60 furlongs (Luke 24); Bethany ~15 furlongs (John 11).`, explanationEs:`Emaús ~60 estadios (Lucas 24); Betania ~15 estadios (Juan 11).` },

  { textEn:`The towns of Jesus's ministry (Capernaum, Bethsaida, Chorazin):`, textEs:`Los pueblos del ministerio de Jesús (Capernaúm, Betsaida, Corazín):`,
    optionsEn:[`Cannot be located`, `Are scattered randomly across the empire`, `Cluster just where they should, around the northern shore of Galilee`, `Are in Egypt`],
    optionsEs:[`No pueden ubicarse`, `Están esparcidos al azar por el imperio`, `Se agrupan justo donde deberían, alrededor de la orilla norte de Galilea`, `Están en Egipto`],
    correct:2, explanationEn:`They cluster around the northern shore of Galilee, just as expected.`, explanationEs:`Se agrupan alrededor de la orilla norte de Galilea, justo como se espera.` },

  { textEn:`When later, distant writers invented gospels about Jesus, they often:`, textEs:`Cuando escritores posteriores y distantes inventaron evangelios sobre Jesús, a menudo:`,
    optionsEn:[`Betrayed themselves by vague or mistaken geography`, `Never mentioned places`, `Got the geography exactly right`, `Were the true accounts`],
    optionsEs:[`Se delataron con geografía vaga o equivocada`, `Nunca mencionaron lugares`, `Acertaron la geografía exactamente`, `Eran los relatos verdaderos`],
    correct:0, explanationEn:`Distant forgers betrayed themselves with vague or mistaken geography.`, explanationEs:`Los falsificadores distantes se delataron con geografía vaga o equivocada.` },

  { textEn:`The geographical precision of the canonical writers is a mark of:`, textEs:`La precisión geográfica de los escritores canónicos es una marca de:`,
    optionsEn:[`Later invention`, `The eyewitness, or one who drew from eyewitnesses`, `Ignorance of the land`, `Careless writing`],
    optionsEs:[`Invención posterior`, `El testigo ocular, o de uno que se valió de testigos oculares`, `Ignorancia de la tierra`, `Escritura descuidada`],
    correct:1, explanationEn:`Such precision is the mark of the eyewitness.`, explanationEs:`Tal precisión es la marca del testigo ocular.` },

  { textEn:`Does geography prove the message of the Bible?`, textEs:`¿Prueba la geografía el mensaje de la Biblia?`,
    optionsEn:[`Yes, it proves the resurrection`, `No, it disproves it`, `No — correlation, not proof — but it corroborates that the writers stood where they said`, `Geography is irrelevant`],
    optionsEs:[`Sí, prueba la resurrección`, `No, la refuta`, `No — correlación, no prueba — pero corrobora que los escritores estuvieron donde dijeron`, `La geografía es irrelevante`],
    correct:2, explanationEn:`Correlation, not proof — it corroborates the writers stood where they said.`, explanationEs:`Correlación, no prueba — corrobora que los escritores estuvieron donde dijeron.` },

  { textEn:`The witness of geography especially allows:`, textEs:`El testigo de la geografía permite especialmente:`,
    optionsEn:[`The proof of miracles`, `Only experts to weigh it`, `No testing at all`, `The ordinary reader to test the Bible himself, with a map`],
    optionsEs:[`La prueba de los milagros`, `Que solo los expertos la pesen`, `Ninguna prueba en absoluto`, `Que el lector común pruebe la Biblia por sí mismo, con un mapa`],
    correct:3, explanationEn:`It lets the ordinary reader test the Bible himself, with a map.`, explanationEs:`Permite que el lector común pruebe la Biblia por sí mismo, con un mapa.` },

  { textEn:`Having heard all four witnesses, what remains for Unit 10?`, textEs:`Habiendo oído a los cuatro testigos, ¿qué queda para la Unidad 10?`,
    optionsEn:[`To abandon the case`, `To gather their testimony into one cumulative case`, `To start over`, `To discuss only geography`],
    optionsEs:[`Abandonar el caso`, `Reunir su testimonio en un caso acumulativo`, `Empezar de nuevo`, `Discutir solo la geografía`],
    correct:1, explanationEn:`Unit 10 gathers all four witnesses into one cumulative case.`, explanationEs:`La Unidad 10 reúne a los cuatro testigos en un caso acumulativo.` },

  { textEn:`The four witnesses of the course are:`, textEs:`Los cuatro testigos del curso son:`,
    optionsEn:[`The right books, the right words, the real events, the real stage`, `Faith, hope, love, and works`, `Matthew, Mark, Luke, John`, `The four Gospels`],
    optionsEs:[`Los libros correctos, las palabras correctas, los eventos reales, el escenario real`, `Fe, esperanza, amor y obras`, `Mateo, Marcos, Lucas, Juan`, `Los cuatro Evangelios`],
    correct:0, explanationEn:`The four witnesses: right books, right words, real events, real stage.`, explanationEs:`Los cuatro testigos: libros correctos, palabras correctas, eventos reales, escenario real.` }
];

const saQuestions = [
  { promptEn:`What is the fourth witness, and what is special about how it can be tested?`,
    promptEs:`¿Cuál es el cuarto testigo, y qué es especial de cómo puede probarse?`,
    keywords:[`geography`,`geograf`,`land`,`tierra`,`map`,`mapa`,`stage`,`escenari`],
    modelEn:`The fourth and final witness is geography — the land itself, the very stage on which the events happened, with its roads, rivers, and hills. What is special is that anyone can test it: you do not need a scholar's training, only a map. The Bible, we find, knows the land the way a man knows his own home, and the same rule holds — correlation, not proof.`,
    modelEs:`El cuarto y último testigo es la geografía — la tierra misma, el mismísimo escenario en que ocurrieron los eventos, con sus caminos, ríos y colinas. Lo especial es que cualquiera puede probarlo: no necesitas la formación de un erudito, solo un mapa. La Biblia, hallamos, conoce la tierra como un hombre conoce su propia casa, y la misma regla se mantiene — correlación, no prueba.` },

  { promptEn:`Explain how the Bible's "up/down" language matches the real topography, using Jerusalem and Jericho.`,
    promptEs:`Explica cómo el lenguaje de "subir/bajar" de la Biblia coincide con la topografía real, usando Jerusalén y Jericó.`,
    keywords:[`jerusal`,`jeric`,`descen`,`ridge`,`cordiller`,`road`,`camino`,`feet`],
    modelEn:`In the Bible one always goes up to Jerusalem and down from it, whatever the compass direction, because Jerusalem sits high on the central ridge. The Lord's parable says a man went down from Jerusalem to Jericho, and that is exact: the road drops over three thousand feet in about seventeen miles, from the heights of Jerusalem to Jericho near the Dead Sea, one of the steepest descents on earth. The Bible's directions are the true shape of the land.`,
    modelEs:`En la Biblia uno siempre sube a Jerusalén y baja de ella, cualquiera que sea la dirección de la brújula, porque Jerusalén se asienta en lo alto de la cordillera central. La parábola del Señor dice que un hombre descendió de Jerusalén a Jericó, y eso es exacto: el camino cae más de tres mil pies en unas diecisiete millas, desde las alturas de Jerusalén hasta Jericó cerca del Mar Muerto, uno de los descensos más empinados de la tierra. Las direcciones de la Biblia son la verdadera forma de la tierra.` },

  { promptEn:`Why is the Sea of Galilee prone to sudden storms, and how does this match the Gospels?`,
    promptEs:`¿Por qué el Mar de Galilea es propenso a súbitas tormentas, y cómo coincide esto con los Evangelios?`,
    keywords:[`galile`,`storm`,`torment`,`hills`,`colina`,`water`,`agua`,`lake`],
    modelEn:`The Sea of Galilee sits some seven hundred feet below the level of the ocean, ringed by hills, so that cold air spilling down the slopes collides with the warm air over the water and whips it, without warning, into violent storms. This is exactly what the Gospels describe — the sudden squall that terrified seasoned fishermen while Jesus slept. The meteorology of a real lake is reported by men who had been soaked by it.`,
    modelEs:`El Mar de Galilea se asienta unos setecientos pies bajo el nivel del océano, rodeado de colinas, de modo que el aire frío que se derrama por las laderas choca con el aire cálido sobre el agua y lo azota, sin aviso, en tormentas violentas. Esto es exactamente lo que describen los Evangelios — la súbita borrasca que aterrorizó a pescadores experimentados mientras Jesús dormía. La meteorología de un lago real es reportada por hombres que habían sido empapados por ella.` },

  { promptEn:`How does John's precise knowledge of Jerusalem support his account?`,
    promptEs:`¿Cómo apoya el conocimiento preciso de Juan de Jerusalén su relato?`,
    keywords:[`john`,`juan`,`bethesda`,`betesda`,`silo`,`jerusal`,`pool`,`estanqu`],
    modelEn:`The Gospel of John names places with such precision that skeptics once used them against him, and the spade has answered. He says the Pool of Bethesda had five porticoes, and the pool was found with exactly that colonnaded shape; he names the Pool of Siloam, now excavated, and the Pavement called Gabbatha. Such exact knowledge argues the writer knew Jerusalem intimately, before the Romans leveled it in AD 70 — the report of one who had been there.`,
    modelEs:`El Evangelio de Juan nombra lugares con tal precisión que los escépticos una vez los usaron contra él, y la pala ha respondido. Dice que el estanque de Betesda tenía cinco pórticos, y el estanque fue hallado con exactamente esa forma de columnata; nombra el estanque de Siloé, ahora excavado, y el Enlosado llamado Gabata. Tal conocimiento exacto argumenta que el escritor conocía Jerusalén íntimamente, antes de que los romanos la arrasaran en el 70 d.C. — el reporte de uno que había estado allí.` },

  { promptEn:`Why is Luke's naming of local officials in Acts remarkable, and who was Ramsay?`,
    promptEs:`¿Por qué es notable el nombramiento de Lucas de los funcionarios locales en Hechos, y quién fue Ramsay?`,
    keywords:[`luke`,`lucas`,`official`,`funcionari`,`politarc`,`ramsay`,`inscription`,`historia`],
    modelEn:`As Paul crosses the empire, Luke names the local officials, and their titles differed from city to city and changed with the years, a trap for any forger. Yet Luke is right every time: the politarchs of Thessalonica, once called an error and then found on inscriptions; the proconsuls of Cyprus and Achaia; the town clerk of Ephesus. The scholar William Ramsay began doubting Luke and ended by calling him a historian of the first rank.`,
    modelEs:`Mientras Pablo cruza el imperio, Lucas nombra a los funcionarios locales, y sus títulos diferían de ciudad en ciudad y cambiaban con los años, una trampa para cualquier falsificador. Sin embargo Lucas acierta cada vez: los politarcas de Tesalónica, una vez llamados un error y luego hallados en inscripciones; los procónsules de Chipre y Acaya; el escribano de Éfeso. El erudito William Ramsay comenzó dudando de Lucas y terminó llamándolo un historiador de primer orden.` },

  { promptEn:`Give examples of the Bible's accuracy in routes, distances, and place-names.`,
    promptEs:`Da ejemplos de la exactitud de la Biblia en rutas, distancias y nombres de lugares.`,
    keywords:[`bethany`,`betania`,`distance`,`distanc`,`road`,`camino`,`galilee`,`galile`],
    modelEn:`The journeys of the Bible trace real roads, and the distances match: Luke sets Emmaus about threescore furlongs from Jerusalem, and John sets Bethany about fifteen furlongs away. The towns of Jesus's ministry cluster just where they should, around the northern shore of Galilee. Hundreds of towns and springs and landmarks are named — Bethlehem, Nazareth, the brook Kidron, the Mount of Olives — and where we can find them, they fit the page.`,
    modelEs:`Los viajes de la Biblia trazan caminos reales, y las distancias coinciden: Lucas sitúa Emaús a unos sesenta estadios de Jerusalén, y Juan sitúa Betania a unos quince estadios. Los pueblos del ministerio de Jesús se agrupan justo donde deberían, alrededor de la orilla norte de Galilea. Cientos de pueblos y manantiales y puntos de referencia son nombrados — Belén, Nazaret, el arroyo Cedrón, el Monte de los Olivos — y donde podemos hallarlos, encajan con la página.` },

  { promptEn:`Explain the "mark of the eyewitness" argument from geography.`,
    promptEs:`Explica el argumento de la "marca del testigo ocular" desde la geografía.`,
    keywords:[`eyewitness`,`ocular`,`geography`,`geograf`,`invent`,`corrobor`,`mistaken`,`equivoc`],
    modelEn:`When later writers, generations removed, invented gospels about Jesus, they betrayed themselves in the geography — vague about the land or plainly mistaken, because they had never seen it. But the canonical writers get it right, down to the slope of a road, the name of a pool, and the title of a magistrate. This exact, incidental, effortless knowledge is the mark of the eyewitness, or of one who drew from eyewitnesses. It does not prove the message, but powerfully corroborates that these men stood where they said.`,
    modelEs:`Cuando escritores posteriores, a generaciones de distancia, inventaron evangelios sobre Jesús, se delataron en la geografía — vagos sobre la tierra o claramente equivocados, porque nunca la habían visto. Pero los escritores canónicos aciertan, hasta la pendiente de un camino, el nombre de un estanque, y el título de un magistrado. Este conocimiento exacto, incidental y sin esfuerzo es la marca del testigo ocular, o de uno que se valió de testigos oculares. No prueba el mensaje, pero corrobora poderosamente que estos hombres estuvieron donde dijeron.` },

  { promptEn:`Does geography prove the Bible's message? State the unit's position.`,
    promptEs:`¿Prueba la geografía el mensaje de la Biblia? Enuncia la posición de la unidad.`,
    keywords:[`correlat`,`correlac`,`prove`,`prob`,`miracle`,`milagr`,`corrobor`,`map`],
    modelEn:`No — the rule is correlation, not proof. Geography cannot prove that the tomb was empty; no map can reach a miracle. But it powerfully corroborates that the writers stood where they said they stood and saw what they said they saw, since their knowledge of the real land is too exact to have been faked from far away. It shows the Bible is no fable told from a distance, but a record rooted in real roads and hills and stones.`,
    modelEs:`No — la regla es correlación, no prueba. La geografía no puede probar que la tumba estaba vacía; ningún mapa puede alcanzar un milagro. Pero corrobora poderosamente que los escritores estuvieron donde dijeron que estuvieron y vieron lo que dijeron que vieron, pues su conocimiento de la tierra real es demasiado exacto para haber sido falsificado desde lejos. Muestra que la Biblia no es una fábula contada desde la distancia, sino un registro arraigado en caminos y colinas y piedras reales.` },

  { promptEn:`What does the witness of geography especially allow the ordinary believer to do?`,
    promptEs:`¿Qué permite especialmente el testigo de la geografía al creyente común?`,
    keywords:[`reader`,`lector`,`map`,`mapa`,`test`,`prob`,`jeric`,`descen`],
    modelEn:`It especially allows the ordinary reader to test the Bible himself, with a map, without a scholar's training. He can trace the road from Jerusalem to Jericho and feel the descent, or stand at the Pool of Siloam. This is a witness the humblest believer can weigh with his own eyes: here is a book that knows the land it describes, that knows which way is up, and names the pool and the road and the ruler and gets them right.`,
    modelEs:`Permite especialmente que el lector común pruebe la Biblia por sí mismo, con un mapa, sin la formación de un erudito. Puede trazar el camino de Jerusalén a Jericó y sentir el descenso, o estar de pie en el estanque de Siloé. Este es un testigo que el creyente más humilde puede pesar con sus propios ojos: aquí hay un libro que conoce la tierra que describe, que sabe cuál es la dirección hacia arriba, y nombra el estanque y el camino y el gobernante y los acierta.` },

  { promptEn:`In your own words, why is a book's exact knowledge of geography evidence that it is trustworthy?`,
    promptEs:`Con tus palabras, ¿por qué el conocimiento exacto de la geografía de un libro es evidencia de que es confiable?`,
    keywords:[`geography`,`geograf`,`invent`,`eyewitness`,`ocular`,`corrobor`,`correlat`,`correlac`],
    modelEn:`Because a writer inventing a story from a distant land and a later century cannot help getting the geography wrong, while one who truly knew the land gets it right without effort. When a book names the pool, the road, the slope, and the ruler correctly, down to incidental detail, it shows the author stood on the real ground. This exact knowledge is a mark of the eyewitness and corroborates his trustworthiness, though it is correlation, not proof of the message.`,
    modelEs:`Porque un escritor que inventa una historia desde una tierra distante y un siglo posterior no puede evitar equivocarse en la geografía, mientras que uno que en verdad conoció la tierra la acierta sin esfuerzo. Cuando un libro nombra el estanque, el camino, la pendiente y el gobernante correctamente, hasta el detalle incidental, muestra que el autor estuvo en la tierra real. Este conocimiento exacto es una marca del testigo ocular y corrobora su confiabilidad, aunque es correlación, no prueba del mensaje.` }
];
