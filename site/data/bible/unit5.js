/* CTSBible - unit 5: per-unit configuration and content. */

const UNIT = 5;

const COURSE_PREFIX = 'cts_bible_u5_';

const mcQuestions = [
  { textEn:`Unit 4 met the manuscripts "in the mass, as a number." Unit 5 meets them:`, textEs:`La Unidad 4 conoció los manuscritos "en masa, como un número". La Unidad 5 los conoce:`,
    optionsEn:[`Only through translations`,`One by one, as individual witnesses`,`As archaeology`,`As geography`],
    optionsEs:[`Solo por medio de traducciones`,`Uno por uno, como testigos individuales`,`Como arqueología`,`Como geografía`],
    correct:1, explanationEn:`Unit 5 is a gallery: the witnesses meet us one by one.`, explanationEs:`La Unidad 5 es una galería: los testigos nos salen al encuentro uno por uno.` },

  { textEn:`What kind of evidence do the manuscripts primarily give, in the course's terms?`, textEs:`¿Qué clase de evidencia dan principalmente los manuscritos, en los términos del curso?`,
    optionsEn:[`Corroboration of faithful transmission`,`Proof of inspiration`,`Nothing useful`,`Contradiction`],
    optionsEs:[`Corroboración de la transmisión fiel`,`Prueba de la inspiración`,`Nada útil`,`Contradicción`],
    correct:0, explanationEn:`They corroborate faithful transmission — corroboration, not proof.`, explanationEs:`Corroboran la transmisión fiel — corroboración, no prueba.` },

  { textEn:`P52 (the Rylands fragment) is a small scrap of which book?`, textEs:`P52 (el fragmento Rylands) es un pequeño pedazo de cuál libro?`,
    optionsEn:[`Romans`,`Isaiah`,`The Gospel of John`,`Genesis`],
    optionsEs:[`Romanos`,`Isaías`,`El Evangelio de Juan`,`Génesis`],
    correct:2, explanationEn:`P52 preserves a few verses of the Gospel of John.`, explanationEs:`P52 preserva unos pocos versículos del Evangelio de Juan.` },

  { textEn:`P52, dated to about the first half of the second century, is significant because it:`, textEs:`P52, fechado hacia la primera mitad del siglo segundo, es significativo porque:`,
    optionsEn:[`Proves the Bible is inspired`,`Shows John's Gospel was circulating early, answering the claim it was written too late`,`Contains the whole New Testament`,`Was written by John himself`],
    optionsEs:[`Prueba que la Biblia es inspirada`,`Muestra que el Evangelio de Juan circulaba temprano, respondiendo a la afirmación de que se escribió demasiado tarde`,`Contiene todo el Nuevo Testamento`,`Fue escrito por Juan mismo`],
    correct:1, explanationEn:`An early copy in Egypt means John was written in the first century.`, explanationEs:`Una copia temprana en Egipto significa que Juan se escribió en el siglo primero.` },

  { textEn:`The skeptical claim that P52 answers is that:`, textEs:`La afirmación escéptica que P52 responde es que:`,
    optionsEn:[`John was written in the first century`,`John never existed`,`John was written in Latin`,`The Gospel of John was a late second-century composition, too late to be apostolic`],
    optionsEs:[`Juan se escribió en el siglo primero`,`Juan nunca existió`,`Juan se escribió en latín`,`El Evangelio de Juan fue una composición tardía del siglo segundo, demasiado tarde para ser apostólica`],
    correct:3, explanationEn:`P52 answers the claim that John was a late, non-apostolic composition.`, explanationEs:`P52 responde a la afirmación de que Juan fue una composición tardía y no apostólica.` },

  { textEn:`P46 (Chester Beatty) is the earliest substantial collection of:`, textEs:`P46 (Chester Beatty) es la colección sustancial más antigua de:`,
    optionsEn:[`The Gospels`,`The Old Testament`,`Paul's epistles`,`The Apocrypha`],
    optionsEs:[`Los Evangelios`,`El Antiguo Testamento`,`Las epístolas de Pablo`,`Los apócrifos`],
    correct:2, explanationEn:`P46 is the earliest substantial copy of Paul's letters gathered.`, explanationEs:`P46 es la copia sustancial más antigua de las cartas de Pablo reunidas.` },

  { textEn:`P46, from about AD 200, shows that Paul's letters were:`, textEs:`P46, de alrededor del año 200, muestra que las cartas de Pablo fueron:`,
    optionsEn:[`Gathered and copied as a collection early`,`Invented in the Middle Ages`,`Never copied`,`Written by Peter`],
    optionsEs:[`Reunidas y copiadas como colección temprano`,`Inventadas en la Edad Media`,`Nunca copiadas`,`Escritas por Pedro`],
    correct:0, explanationEn:`Paul's letters were gathered and circulating early, not invented late.`, explanationEs:`Las cartas de Pablo fueron reunidas y circulaban temprano, no inventadas tarde.` },

  { textEn:`The Bodmer papyrus P75 contains portions of:`, textEs:`El papiro Bodmer P75 contiene porciones de:`,
    optionsEn:[`Luke and John`,`Genesis and Exodus`,`Revelation only`,`The Apocrypha`],
    optionsEs:[`Lucas y Juan`,`Génesis y Éxodo`,`Solo Apocalipsis`,`Los apócrifos`],
    correct:0, explanationEn:`P75 preserves large portions of Luke and John.`, explanationEs:`P75 preserva grandes porciones de Lucas y Juan.` },

  { textEn:`The great importance of P75 is that its text is remarkably close to:`, textEs:`La gran importancia de P75 es que su texto es notablemente cercano a:`,
    optionsEn:[`The Dead Sea Scrolls`,`Codex Vaticanus (4th century)`,`The Latin Vulgate`,`The King James Bible`],
    optionsEs:[`Los Rollos del Mar Muerto`,`El Códice Vaticano (siglo cuarto)`,`La Vulgata latina`,`La Biblia King James`],
    correct:1, explanationEn:`P75's text is very close to fourth-century Codex Vaticanus.`, explanationEs:`El texto de P75 es muy cercano al Códice Vaticano del siglo cuarto.` },

  { textEn:`P75's closeness to Vaticanus overturned the theory that Vaticanus's text was:`, textEs:`La cercanía de P75 al Vaticano derribó la teoría de que el texto del Vaticano era:`,
    optionsEn:[`A faithful copy`,`Written in Hebrew`,`Lost`,`A late fourth-century invention`],
    optionsEs:[`Una copia fiel`,`Escrito en hebreo`,`Perdido`,`Una invención tardía del siglo cuarto`],
    correct:3, explanationEn:`It disproved the idea that Vaticanus's text was a 4th-century invention.`, explanationEs:`Refutó la idea de que el texto del Vaticano era una invención del siglo cuarto.` },

  { textEn:`What does the P75–Vaticanus agreement demonstrate?`, textEs:`¿Qué demuestra la concordancia entre P75 y el Vaticano?`,
    optionsEn:[`The text drifted greatly over time`,`The autographs survive`,`The text was faithfully preserved across about 150 years, not drifting`,`Vaticanus is a forgery`],
    optionsEs:[`El texto se desvió mucho con el tiempo`,`Los autógrafos sobreviven`,`El texto fue preservado fielmente a través de unos 150 años, sin desviarse`,`El Vaticano es una falsificación`],
    correct:2, explanationEn:`It shows the text was faithfully preserved across ~150 years.`, explanationEs:`Muestra que el texto fue preservado fielmente a través de ~150 años.` },

  { textEn:`Codex Sinaiticus and Codex Vaticanus both date from the:`, textEs:`El Códice Sinaítico y el Códice Vaticano datan ambos del:`,
    optionsEn:[`First century`,`Fourth century`,`Tenth century`,`Sixteenth century`],
    optionsEs:[`Siglo primero`,`Siglo cuarto`,`Siglo décimo`,`Siglo dieciséis`],
    correct:1, explanationEn:`Both are fourth-century codices.`, explanationEs:`Ambos son códices del siglo cuarto.` },

  { textEn:`Codex Sinaiticus was discovered by Constantin von Tischendorf at:`, textEs:`El Códice Sinaítico fue descubierto por Constantin von Tischendorf en:`,
    optionsEn:[`St. Catherine's Monastery on Mount Sinai`,`The Vatican`,`Qumran`,`Rylands Library`],
    optionsEs:[`El Monasterio de Santa Catalina en el Monte Sinaí`,`El Vaticano`,`Qumrán`,`La Biblioteca Rylands`],
    correct:0, explanationEn:`Tischendorf found it at St. Catherine's Monastery, Mount Sinai.`, explanationEs:`Tischendorf lo halló en el Monasterio de Santa Catalina, Monte Sinaí.` },

  { textEn:`The great codices (Sinaiticus, Vaticanus) are described in the unit as:`, textEs:`Los grandes códices (Sinaítico, Vaticano) se describen en la unidad como:`,
    optionsEn:[`Forgeries`,`Medieval copies`,`The autographs`,`Complete, early, magnificent witnesses to the whole New Testament`],
    optionsEs:[`Falsificaciones`,`Copias medievales`,`Los autógrafos`,`Testigos completos, tempranos y magníficos de todo el Nuevo Testamento`],
    correct:3, explanationEn:`They are complete, early, magnificent witnesses to the whole NT.`, explanationEs:`Son testigos completos, tempranos y magníficos de todo el NT.` },

  { textEn:`The unit notes these early manuscripts sometimes differ from the later Received Text, and that how to weigh this is:`, textEs:`La unidad nota que estos manuscritos antiguos a veces difieren del Texto Recibido posterior, y que cómo pesarlo es:`,
    optionsEn:[`A settled question`,`The subject of Unit 6 (Received Text vs Critical Text)`,`Proof the Bible is false`,`Never discussed`],
    optionsEs:[`Una cuestión zanjada`,`El tema de la Unidad 6 (Texto Recibido vs Texto Crítico)`,`Prueba de que la Biblia es falsa`,`Nunca discutido`],
    correct:1, explanationEn:`How to weigh the difference is the subject of Unit 6.`, explanationEs:`Cómo pesar la diferencia es el tema de la Unidad 6.` },

  { textEn:`The Dead Sea Scrolls were discovered in 1947 at:`, textEs:`Los Rollos del Mar Muerto fueron descubiertos en 1947 en:`,
    optionsEn:[`Rome`,`Mount Sinai`,`Alexandria`,`Qumran, near the Dead Sea`],
    optionsEs:[`Roma`,`El Monte Sinaí`,`Alejandría`,`Qumrán, cerca del Mar Muerto`],
    correct:3, explanationEn:`They were found at Qumran near the Dead Sea in 1947.`, explanationEs:`Fueron hallados en Qumrán cerca del Mar Muerto en 1947.` },

  { textEn:`The Dead Sea Scrolls contain portions of every Old Testament book except:`, textEs:`Los Rollos del Mar Muerto contienen porciones de cada libro del Antiguo Testamento excepto:`,
    optionsEn:[`Genesis`,`Isaiah`,`Esther`,`Psalms`],
    optionsEs:[`Génesis`,`Isaías`,`Ester`,`Salmos`],
    correct:2, explanationEn:`Every OT book but Esther is represented among the scrolls.`, explanationEs:`Todo libro del AT menos Ester está representado entre los rollos.` },

  { textEn:`The Great Isaiah Scroll is roughly ______ older than the previously-oldest Hebrew manuscripts.`, textEs:`El Gran Rollo de Isaías es aproximadamente ______ más antiguo que los manuscritos hebreos previamente más antiguos.`,
    optionsEn:[`ten years`,`one hundred years`,`a thousand years`,`two years`],
    optionsEs:[`diez años`,`cien años`,`mil años`,`dos años`],
    correct:2, explanationEn:`The scrolls are about a thousand years older than the prior oldest.`, explanationEs:`Los rollos son unos mil años más antiguos que los anteriores más antiguos.` },

  { textEn:`When the Isaiah Scroll is compared to the Masoretic text copied a thousand years later, it is:`, textEs:`Cuando el Rollo de Isaías se compara con el texto masorético copiado mil años después, es:`,
    optionsEn:[`Substantially identical`,`Completely different`,`Written in Greek`,`A forgery`],
    optionsEs:[`Sustancialmente idéntico`,`Completamente diferente`,`Escrito en griego`,`Una falsificación`],
    correct:0, explanationEn:`They are substantially identical — a millennium, and the text held.`, explanationEs:`Son sustancialmente idénticos — un milenio, y el texto se mantuvo.` },

  { textEn:`What do the manuscripts NOT do, according to the unit's honest accounting?`, textEs:`¿Qué NO hacen los manuscritos, según el recuento honesto de la unidad?`,
    optionsEn:[`Corroborate faithful transmission`,`Answer specific skeptical claims`,`Turn a number into faces`,`Hand us the autographs or prove inspiration by themselves`],
    optionsEs:[`Corroborar la transmisión fiel`,`Responder a afirmaciones escépticas específicas`,`Convertir un número en rostros`,`Entregarnos los autógrafos o probar la inspiración por sí solos`],
    correct:3, explanationEn:`They do not give the autographs or prove inspiration by themselves.`, explanationEs:`No dan los autógrafos ni prueban la inspiración por sí solos.` }
];

const saQuestions = [
  { promptEn:`What does the "gallery" of manuscripts give us, and what does it not give us, in the course's terms of evidence?`,
    promptEs:`¿Qué nos da la "galería" de manuscritos, y qué no nos da, en los términos de evidencia del curso?`,
    keywords:[`corrobor`,`proof`,`prueb`,`preserv`,`manuscript`,`manuscrit`,`inspir`,`testig`],
    modelEn:`The manuscripts give us corroboration, not proof: they confirm that the text was faithfully preserved and early, but they do not by themselves prove the Bible is inspired, and they do not hand us the lost autographs. As Unit 1 taught, corroboration is the honest workhorse of evidence, and these witnesses corroborate powerfully, turning the abundance of Unit 4 from a number into faces.`,
    modelEs:`Los manuscritos nos dan corroboración, no prueba: confirman que el texto fue preservado fielmente y temprano, pero no prueban por sí solos que la Biblia es inspirada, ni nos entregan los autógrafos perdidos. Como enseñó la Unidad 1, la corroboración es la herramienta honesta de la evidencia, y estos testigos corroboran con fuerza, convirtiendo la abundancia de la Unidad 4 de un número en rostros.` },

  { promptEn:`Describe P52 and explain the skeptical claim it answers.`,
    promptEs:`Describe P52 y explica la afirmación escéptica que responde.`,
    keywords:[`john`,`juan`,`fragment`,`egypt`,`egipt`,`centur`,`siglo`,`tard`],
    modelEn:`P52, the Rylands fragment, is a tiny scrap of the Gospel of John, dated to about the first half of the second century and found in Egypt. Skeptics had claimed John was a late second-century composition, too late to be apostolic. But a copy circulating in Egypt by around AD 125 means the original was written decades earlier, in the first century. The smallest manuscript answers one of the largest claims.`,
    modelEs:`P52, el fragmento Rylands, es un pedacito del Evangelio de Juan, fechado hacia la primera mitad del siglo segundo y hallado en Egipto. Los escépticos habían afirmado que Juan era una composición tardía del siglo segundo, demasiado tarde para ser apostólica. Pero una copia circulando en Egipto hacia el año 125 significa que el original se escribió décadas antes, en el siglo primero. El manuscrito más pequeño responde a una de las afirmaciones más grandes.` },

  { promptEn:`What does P46 show about the letters of Paul?`,
    promptEs:`¿Qué muestra P46 sobre las cartas de Pablo?`,
    keywords:[`paul`,`pablo`,`letter`,`carta`,`collect`,`colecc`,`transmit`,`tempran`],
    modelEn:`P46, the Chester Beatty papyrus from about AD 200, is the earliest substantial collection of Paul's epistles, containing most of the Pauline corpus. It shows that within roughly 150 years of Paul, his letters were already gathered and copied as a collection and circulating widely. The apostle's words were treasured and transmitted early, not invented late.`,
    modelEs:`P46, el papiro Chester Beatty de alrededor del año 200, es la colección sustancial más antigua de las epístolas de Pablo, que contiene la mayor parte del corpus paulino. Muestra que dentro de unos 150 años de Pablo, sus cartas ya estaban reunidas y copiadas como colección y circulando ampliamente. Las palabras del apóstol fueron atesoradas y transmitidas temprano, no inventadas tarde.` },

  { promptEn:`Explain the importance of the agreement between P75 and Codex Vaticanus.`,
    promptEs:`Explica la importancia de la concordancia entre P75 y el Códice Vaticano.`,
    keywords:[`vatican`,`text`,`preserv`,`invent`,`invenc`,`drift`,`theor`,`teor`],
    modelEn:`P75, a Bodmer papyrus from about AD 175 to 225, has a text remarkably close to the fourth-century Codex Vaticanus. This overturned the theory that Vaticanus's careful text was a late fourth-century invention; instead, that text reached back nearly unchanged into the second century. It shows concretely that the text was faithfully preserved across about a hundred and fifty years, not drifting.`,
    modelEs:`P75, un papiro Bodmer de alrededor del año 175 al 225, tiene un texto notablemente cercano al Códice Vaticano del siglo cuarto. Esto derribó la teoría de que el texto cuidadoso del Vaticano era una invención tardía del siglo cuarto; más bien, ese texto se remontaba casi sin cambios al siglo segundo. Muestra de forma concreta que el texto fue preservado fielmente a través de unos ciento cincuenta años, sin desviarse.` },

  { promptEn:`Describe Codex Sinaiticus and Codex Vaticanus.`,
    promptEs:`Describe el Códice Sinaítico y el Códice Vaticano.`,
    keywords:[`tischendorf`,`vatican`,`parchment`,`pergamin`,`fourth`,`cuart`,`monaster`,`greek`],
    modelEn:`Sinaiticus and Vaticanus are the two great fourth-century codices, written on fine parchment and containing whole Bibles in Greek. Vaticanus is kept in the Vatican Library, and Sinaiticus was discovered by Tischendorf at St. Catherine's Monastery on Mount Sinai. They are complete, early, and magnificent witnesses to the whole New Testament and the Greek Old Testament.`,
    modelEs:`Sinaítico y Vaticano son los dos grandes códices del siglo cuarto, escritos en pergamino fino y que contienen Biblias enteras en griego. El Vaticano se guarda en la Biblioteca Vaticana, y el Sinaítico fue descubierto por Tischendorf en el Monasterio de Santa Catalina en el Monte Sinaí. Son testigos completos, tempranos y magníficos de todo el Nuevo Testamento y del Antiguo Testamento griego.` },

  { promptEn:`What honest point does the unit make about the great codices and the Received Text?`,
    promptEs:`¿Qué punto honesto hace la unidad sobre los grandes códices y el Texto Recibido?`,
    keywords:[`receiv`,`recib`,`differ`,`difer`,`manuscript`,`manuscrit`,`witness`,`testig`],
    modelEn:`The unit notes honestly that these early manuscripts, Sinaiticus and Vaticanus, sometimes differ from the later Received Text that underlies the King James and the Reina-Valera. It does not settle which reading is right; it simply presents them as the great early witnesses they are, and leaves how to weigh the difference to Unit 6, the question of the Received and Critical Texts.`,
    modelEs:`La unidad nota con honestidad que estos manuscritos antiguos, el Sinaítico y el Vaticano, a veces difieren del Texto Recibido posterior que subyace a la King James y a la Reina-Valera. No zanja cuál lectura es la correcta; simplemente los presenta como los grandes testigos antiguos que son, y deja cómo pesar la diferencia para la Unidad 6, la cuestión del Texto Recibido y el Crítico.` },

  { promptEn:`Describe the Dead Sea Scrolls and their significance for the Old Testament.`,
    promptEs:`Describe los Rollos del Mar Muerto y su importancia para el Antiguo Testamento.`,
    keywords:[`scroll`,`rollo`,`esther`,`ester`,`masoret`,`confirm`,`thousand`,`transmis`],
    modelEn:`The Dead Sea Scrolls were discovered in 1947 at Qumran, hidden in desert caves since the first century. They contain portions of every Old Testament book except Esther and are about a thousand years older than the previously-oldest Hebrew manuscripts. The Great Isaiah Scroll, from about 125 BC, when compared to the Masoretic text a thousand years later, is substantially identical — a stunning confirmation of faithful transmission.`,
    modelEs:`Los Rollos del Mar Muerto fueron descubiertos en 1947 en Qumrán, escondidos en cuevas del desierto desde el siglo primero. Contienen porciones de cada libro del Antiguo Testamento excepto Ester y son unos mil años más antiguos que los manuscritos hebreos previamente más antiguos. El Gran Rollo de Isaías, de alrededor del 125 a.C., comparado con el texto masorético mil años después, es sustancialmente idéntico — una asombrosa confirmación de la transmisión fiel.` },

  { promptEn:`What do the manuscripts NOT do, and what do they do?`,
    promptEs:`¿Qué NO hacen los manuscritos, y qué sí hacen?`,
    keywords:[`inspir`,`corrobor`,`preserv`,`prove`,`prueb`,`john`,`juan`,`invent`],
    modelEn:`They do not hand us the lost autographs, and they do not prove the Bible is inspired by themselves — inspiration is confessed, not excavated. What they do, powerfully, is corroborate that the text is early and faithfully preserved, and answer specific skeptical claims, such as that John was written too late or that the text was a late invention. They turn Unit 4's number into faces.`,
    modelEs:`No nos entregan los autógrafos perdidos, y no prueban por sí solos que la Biblia es inspirada — la inspiración se confiesa, no se excava. Lo que sí hacen, con fuerza, es corroborar que el texto es temprano y fielmente preservado, y responder a afirmaciones escépticas específicas, como que Juan se escribió demasiado tarde o que el texto fue una invención tardía. Convierten el número de la Unidad 4 en rostros.` },

  { promptEn:`How does the gallery apply the course's method (concede, refuse, stand)?`,
    promptEs:`¿Cómo aplica la galería el método del curso (conceder, rechazar, mantenerse)?`,
    keywords:[`conced`,`refus`,`rechaz`,`camel`,`confirm`,`attest`,`atestigu`,`abundan`],
    modelEn:`We concede honestly what the manuscripts do not do — they are not the autographs and do not prove inspiration. We refuse the skeptic's camel that the manuscripts undermine the text; in fact they confirm it. And we stand where the evidence stands: on faithful, abundant, early attestation of the Word. This is exactly the discipline of Unit 1, applied to real manuscripts.`,
    modelEs:`Concedemos con honestidad lo que los manuscritos no hacen — no son los autógrafos ni prueban la inspiración. Rechazamos el camello del escéptico de que los manuscritos socavan el texto; de hecho lo confirman. Y nos mantenemos donde la evidencia se mantiene: en una atestiguación fiel, abundante y temprana de la Palabra. Esta es exactamente la disciplina de la Unidad 1, aplicada a manuscritos reales.` },

  { promptEn:`In your own words, summarize the second witness's testimony and what remains for Unit 6.`,
    promptEs:`Con tus palabras, resume el testimonio del segundo testigo y lo que queda para la Unidad 6.`,
    keywords:[`witness`,`testig`,`faithful`,`fiel`,`receiv`,`recib`,`preserv`,`differ`],
    modelEn:`The second witness testifies, both in the mass and one by one, that the words we read were faithfully carried down the centuries. But it has also shown that the great early manuscripts sometimes differ from the later Received Text behind the King James and the Reina-Valera. How thoughtful Christians weigh that difference is the subject of Unit 6, where even this debate rests on a Word so preserved that the question is never whether we have it, but only which reading to print in a few places.`,
    modelEs:`El segundo testigo testifica, tanto en masa como uno por uno, que las palabras que leemos fueron llevadas fielmente a través de los siglos. Pero también ha mostrado que los grandes manuscritos antiguos a veces difieren del Texto Recibido posterior detrás de la King James y la Reina-Valera. Cómo pesan los cristianos reflexivos esa diferencia es el tema de la Unidad 6, donde aun este debate descansa sobre una Palabra tan preservada que la pregunta nunca es si la tenemos, sino solo cuál lectura imprimir en unos pocos lugares.` }
];
