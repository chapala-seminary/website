/* CTSBible - unit 6: per-unit configuration and content. */

const UNIT = 6;

const COURSE_PREFIX = 'cts_bible_u6_';

const mcQuestions = [
  { textEn:`The honest question Unit 6 takes up is:`, textEs:`La pregunta honesta que la Unidad 6 aborda es:`,
    optionsEn:[`Where the great early manuscripts differ from the later Received Text`,`Whether we have the Word of God at all`,`Whether the Bible was copied`,`The date of the Gospels`],
    optionsEs:[`Dónde los grandes manuscritos antiguos difieren del Texto Recibido posterior`,`Si tenemos la Palabra de Dios en absoluto`,`Si la Biblia fue copiada`,`La fecha de los Evangelios`],
    correct:0, explanationEn:`The live question is where the early manuscripts differ from the Received Text.`, explanationEs:`La pregunta viva es dónde los manuscritos antiguos difieren del Texto Recibido.` },

  { textEn:`This question is, in the course's terms:`, textEs:`Esta pregunta es, en los términos del curso:`,
    optionsEn:[`A test of whether someone is truly saved`,`A settled doctrine`,`A genuine in-house disagreement among Bible-believing Christians`,`A modern invention`],
    optionsEs:[`Una prueba de si alguien es verdaderamente salvo`,`Una doctrina establecida`,`Un desacuerdo genuino entre cristianos que creen en la Biblia`,`Un invento moderno`],
    correct:2, explanationEn:`It is a real in-house disagreement, not a test of faith.`, explanationEs:`Es un desacuerdo real entre hermanos, no una prueba de fe.` },

  { textEn:`The first published Greek New Testament (1516) was produced by:`, textEs:`El primer Nuevo Testamento griego publicado (1516) fue producido por:`,
    optionsEn:[`Westcott and Hort`,`Tischendorf`,`Jerome`,`Erasmus`],
    optionsEs:[`Westcott y Hort`,`Tischendorf`,`Jerónimo`,`Erasmo`],
    correct:3, explanationEn:`Erasmus published the first printed Greek NT in 1516.`, explanationEs:`Erasmo publicó el primer NT griego impreso en 1516.` },

  { textEn:`The Greek text refined from Erasmus (by Stephanus, Beza, the Elzevirs) became known as:`, textEs:`El texto griego refinado de Erasmo (por Stephanus, Beza, los Elzevir) llegó a conocerse como:`,
    optionsEn:[`The Received Text (Textus Receptus)`,`The Critical Text`,`The Dead Sea Scrolls`,`The Vulgate`],
    optionsEs:[`El Texto Recibido (Textus Receptus)`,`El Texto Crítico`,`Los Rollos del Mar Muerto`,`La Vulgata`],
    correct:0, explanationEn:`It became the Textus Receptus, the "Received Text."`, explanationEs:`Llegó a ser el Textus Receptus, el "Texto Recibido".` },

  { textEn:`Which translations stand in the Received Text tradition?`, textEs:`¿Cuáles traducciones están en la tradición del Texto Recibido?`,
    optionsEn:[`The ESV and NIV`,`The King James, the NKJV, and the Reina-Valera (including RVG)`,`Only Catholic Bibles`,`None`],
    optionsEs:[`La ESV y la NIV`,`La King James, la NKJV, y la Reina-Valera (incluyendo la RVG)`,`Solo las Biblias católicas`,`Ninguna`],
    correct:1, explanationEn:`The KJV, NKJV, and Reina-Valera (incl. RVG) follow the Received Text.`, explanationEs:`La KJV, NKJV, y Reina-Valera (incl. RVG) siguen el Texto Recibido.` },

  { textEn:`The Reina-Valera Gómez (RVG), this course's Spanish Bible, was made specifically to:`, textEs:`La Reina-Valera Gómez (RVG), la Biblia en español de este curso, fue hecha específicamente para:`,
    optionsEn:[`Follow the Critical Text`,`Remove the Old Testament`,`Bring the Spanish Bible into fuller agreement with the Received Text tradition`,`Add the Apocrypha`],
    optionsEs:[`Seguir el Texto Crítico`,`Quitar el Antiguo Testamento`,`Llevar la Biblia en español a un acuerdo más pleno con la tradición del Texto Recibido`,`Añadir los apócrifos`],
    correct:2, explanationEn:`The RVG was made to align the Spanish Bible with the Received Text.`, explanationEs:`La RVG fue hecha para alinear la Biblia en español con el Texto Recibido.` },

  { textEn:`The Critical (Eclectic) Text, built in the 1800s and after, gives heaviest weight to:`, textEs:`El Texto Crítico (Ecléctico), construido en el siglo XIX y después, da el mayor peso a:`,
    optionsEn:[`The latest medieval copies`,`The Latin Vulgate`,`The King James`,`The earliest manuscripts (papyri and the great codices)`],
    optionsEs:[`Las copias medievales más tardías`,`La Vulgata latina`,`La King James`,`Los manuscritos más antiguos (papiros y los grandes códices)`],
    correct:3, explanationEn:`The Critical Text weights the earliest manuscripts most heavily.`, explanationEs:`El Texto Crítico da el mayor peso a los manuscritos más antiguos.` },

  { textEn:`Most modern versions (ESV, NIV, NVI) are based on:`, textEs:`La mayoría de las versiones modernas (ESV, NIV, NVI) se basan en:`,
    optionsEn:[`The Received Text`,`The Critical Text`,`The Apocrypha`,`The Majority Text only`],
    optionsEs:[`El Texto Recibido`,`El Texto Crítico`,`Los apócrifos`,`Solo el Texto Mayoritario`],
    correct:1, explanationEn:`Most modern versions follow the Critical Text.`, explanationEs:`La mayoría de las versiones modernas siguen el Texto Crítico.` },

  { textEn:`How much of the New Testament do the two texts agree on?`, textEs:`¿En cuánto del Nuevo Testamento concuerdan los dos textos?`,
    optionsEn:[`About half`,`Almost none`,`The overwhelming majority`,`Only the Gospels`],
    optionsEs:[`Cerca de la mitad`,`Casi nada`,`La abrumadora mayoría`,`Solo los Evangelios`],
    correct:2, explanationEn:`The two texts agree across the overwhelming majority of the NT.`, explanationEs:`Los dos textos concuerdan en la abrumadora mayoría del NT.` },

  { textEn:`The differences between the two texts:`, textEs:`Las diferencias entre los dos textos:`,
    optionsEn:[`Cluster in a relatively small number of places`,`Change the whole gospel`,`Affect every verse`,`Concern only spelling`],
    optionsEs:[`Se agrupan en un número relativamente pequeño de lugares`,`Cambian todo el evangelio`,`Afectan cada versículo`,`Conciernen solo la ortografía`],
    correct:0, explanationEn:`The differences gather in a relatively small number of places.`, explanationEs:`Las diferencias se agrupan en un número relativamente pequeño de lugares.` },

  { textEn:`Which cardinal doctrine stands or falls on the textual differences?`, textEs:`¿Cuál doctrina cardinal se levanta o cae sobre las diferencias textuales?`,
    optionsEn:[`The deity of Christ`,`The Trinity`,`The resurrection`,`None of them`],
    optionsEs:[`La deidad de Cristo`,`La Trinidad`,`La resurrección`,`Ninguna de ellas`],
    correct:3, explanationEn:`No cardinal doctrine depends on any disputed reading.`, explanationEs:`Ninguna doctrina cardinal depende de ninguna lectura disputada.` },

  { textEn:`The Critical Text position reasons that, over time, scribes tended to:`, textEs:`La posición del Texto Crítico razona que, con el tiempo, los escribas tendían a:`,
    optionsEn:[`Add, harmonize, and smooth — rarely to omit`,`Only delete`,`Never change anything`,`Rewrite whole books`],
    optionsEs:[`Añadir, armonizar y suavizar — rara vez omitir`,`Solo borrar`,`Nunca cambiar nada`,`Reescribir libros enteros`],
    correct:0, explanationEn:`Scribes tended to add and harmonize more than to omit.`, explanationEs:`Los escribas tendían a añadir y armonizar más que a omitir.` },

  { textEn:`A central Majority Text argument is that the original reading is likely found in:`, textEs:`Un argumento central del Texto Mayoritario es que la lectura original probablemente se halla en:`,
    optionsEn:[`A few Egyptian manuscripts`,`The great majority of manuscripts the church continuously used`,`The Apocrypha`,`The Latin only`],
    optionsEs:[`Unos pocos manuscritos egipcios`,`La gran mayoría de los manuscritos que la iglesia usó continuamente`,`Los apócrifos`,`Solo el latín`],
    correct:1, explanationEn:`The Majority Text argues from the mass of manuscripts the church used.`, explanationEs:`El Texto Mayoritario argumenta desde la masa de manuscritos que la iglesia usó.` },

  { textEn:`A central preservation argument of the Received Text tradition is that:`, textEs:`Un argumento central de preservación de la tradición del Texto Recibido es que:`,
    optionsEn:[`The true text was lost for 1,500 years`,`Only Egypt preserved the text`,`God would not let the true text be lost to the church until a few copies were recovered`,`The church never had the Word`],
    optionsEs:[`El texto verdadero se perdió por 1,500 años`,`Solo Egipto preservó el texto`,`Dios no dejaría que el texto verdadero se perdiera para la iglesia hasta que unas pocas copias fueran recuperadas`,`La iglesia nunca tuvo la Palabra`],
    correct:2, explanationEn:`Preservation: God would not lose the true text to His church for centuries.`, explanationEs:`Preservación: Dios no perdería el texto verdadero para su iglesia por siglos.` },

  { textEn:`The longer ending of Mark (16:9-20) is:`, textEs:`El final más largo de Marcos (16:9-20) está:`,
    optionsEn:[`Absent from the King James`,`In the Received Text (printed in the KJV and Reina-Valera), footnoted in modern versions`,`In no Bible`,`Part of the Old Testament`],
    optionsEs:[`Ausente de la King James`,`En el Texto Recibido (impreso en la KJV y la Reina-Valera), con nota en las versiones modernas`,`En ninguna Biblia`,`Parte del Antiguo Testamento`],
    correct:1, explanationEn:`It is in the Received Text (KJV, Reina-Valera); modern versions footnote it.`, explanationEs:`Está en el Texto Recibido (KJV, Reina-Valera); las versiones modernas lo anotan.` },

  { textEn:`The Comma Johanneum (1 John 5:7-8) is textually notable because it:`, textEs:`La Coma Juanina (1 Juan 5:7-8) es notable textualmente porque:`,
    optionsEn:[`Appears in every early manuscript`,`Was written by Erasmus`,`Denies the Trinity`,`Stands in the Received Text/KJV/Reina-Valera but is found in only a very few, very late Greek manuscripts`],
    optionsEs:[`Aparece en cada manuscrito antiguo`,`Fue escrita por Erasmo`,`Niega la Trinidad`,`Está en el Texto Recibido/KJV/Reina-Valera pero se halla en solo unos muy pocos manuscritos griegos muy tardíos`],
    correct:3, explanationEn:`It is in the Received Text but found in very few, very late Greek copies.`, explanationEs:`Está en el Texto Recibido pero se halla en muy pocas copias griegas muy tardías.` },

  { textEn:`The truth of the Trinity, the unit stresses, rests on:`, textEs:`La verdad de la Trinidad, subraya la unidad, descansa en:`,
    optionsEn:[`The Comma alone`,`The whole of Scripture that both texts share`,`No verses`,`The Apocrypha`],
    optionsEs:[`La Coma sola`,`Toda la Escritura que ambos textos comparten`,`Ningún versículo`,`Los apócrifos`],
    correct:1, explanationEn:`The Trinity is taught throughout the Scriptures both texts share.`, explanationEs:`La Trinidad se enseña por toda la Escritura que ambos textos comparten.` },

  { textEn:`The course's own Bibles (NKJV, RVG) stand in the ______ tradition.`, textEs:`Las propias Biblias del curso (NKJV, RVG) están en la tradición ______.`,
    optionsEn:[`Received Text`,`Critical Text`,`Vulgate`,`Septuagint`],
    optionsEs:[`del Texto Recibido`,`del Texto Crítico`,`de la Vulgata`,`de la Septuaginta`],
    correct:0, explanationEn:`CTS's Bibles (NKJV, RVG) stand in the Received Text tradition.`, explanationEs:`Las Biblias de CTS (NKJV, RVG) están en la tradición del Texto Recibido.` },

  { textEn:`The unit refuses the extreme claim that:`, textEs:`La unidad rechaza la afirmación extrema de que:`,
    optionsEn:[`The Received Text fed the church for centuries`,`Both texts carry the gospel`,`The differences are few`,`Modern versions are a deliberate satanic corruption that "deletes" verses`],
    optionsEs:[`El Texto Recibido alimentó a la iglesia por siglos`,`Ambos textos llevan el evangelio`,`Las diferencias son pocas`,`Las versiones modernas son una corrupción satánica deliberada que "borra" versículos`],
    correct:3, explanationEn:`The unit refuses the conspiracy charge against modern versions.`, explanationEs:`La unidad rechaza la acusación de conspiración contra las versiones modernas.` },

  { textEn:`According to the unit, a believer with an ESV or NVI, and a believer with a KJV or Reina-Valera:`, textEs:`Según la unidad, un creyente con una ESV o NVI, y un creyente con una KJV o Reina-Valera:`,
    optionsEn:[`Cannot both be saved`,`Hold different gospels`,`Both hold the Word of God`,`Must switch Bibles`],
    optionsEs:[`No pueden ambos ser salvos`,`Sostienen evangelios diferentes`,`Ambos tienen la Palabra de Dios`,`Deben cambiar de Biblia`],
    correct:2, explanationEn:`Either faithful translation is the Word of God.`, explanationEs:`Cualquiera de las dos traducciones fieles es la Palabra de Dios.` }
];

const saQuestions = [
  { promptEn:`What is the honest question Unit 6 takes up, and how does the unit frame its importance?`,
    promptEs:`¿Cuál es la pregunta honesta que la Unidad 6 aborda, y cómo enmarca la unidad su importancia?`,
    keywords:[`receiv`,`recib`,`differ`,`difer`,`disagree`,`desacuerd`,`gospel`,`evangel`],
    modelEn:`The unit takes up the difference between the later Received Text, behind the King James and the Reina-Valera, and the earlier manuscripts favored by the Critical Text. It frames this as a genuine in-house disagreement among Bible-believing Christians, not a question of whether we have the Word of God. Both texts carry the whole gospel, so the question is real but never touches salvation.`,
    modelEs:`La unidad toma la diferencia entre el Texto Recibido posterior, detrás de la King James y la Reina-Valera, y los manuscritos más antiguos que favorece el Texto Crítico. La enmarca como un desacuerdo genuino entre cristianos que creen en la Biblia, no como una pregunta de si tenemos la Palabra de Dios. Ambos textos llevan todo el evangelio, así que la pregunta es real pero nunca toca la salvación.` },

  { promptEn:`Trace how we came to have two printed Greek texts.`,
    promptEs:`Traza cómo llegamos a tener dos textos griegos impresos.`,
    keywords:[`erasm`,`receiv`,`recib`,`print`,`imprent`,`byzantine`,`bizantin`,`modern`],
    modelEn:`For centuries the New Testament was hand-copied, and most surviving copies are Byzantine. When printing came, Erasmus produced the first published Greek New Testament in 1516, refined by others into the Received Text behind the King James and the Reina-Valera. Later, the discovery of the great early manuscripts led scholars like Westcott and Hort to build the Critical Text, giving weight to the earliest witnesses, which underlies most modern versions.`,
    modelEs:`Por siglos el Nuevo Testamento se copió a mano, y la mayoría de las copias que sobreviven son bizantinas. Cuando llegó la imprenta, Erasmo produjo el primer Nuevo Testamento griego publicado en 1516, refinado por otros en el Texto Recibido detrás de la King James y la Reina-Valera. Después, el descubrimiento de los grandes manuscritos antiguos llevó a eruditos como Westcott y Hort a construir el Texto Crítico, dando peso a los testigos más antiguos, que subyace a la mayoría de las versiones modernas.` },

  { promptEn:`Where do the two texts agree, and where do they differ? Why does the difference not threaten the gospel?`,
    promptEs:`¿Dónde concuerdan los dos textos, y dónde difieren? ¿Por qué la diferencia no amenaza el evangelio?`,
    keywords:[`agree`,`concuerd`,`differ`,`difer`,`doctrin`,`deity`,`deidad`,`resurrec`],
    modelEn:`The two texts agree in the overwhelming majority of the New Testament; the differences cluster in a relatively small number of places, such as the longer ending of Mark, the woman caught in adultery, and some fuller verses in the Received Text. Not one cardinal doctrine — the deity of Christ, the Trinity, the resurrection, salvation by grace — depends on any of these, since each is taught many times in passages both texts share.`,
    modelEs:`Los dos textos concuerdan en la abrumadora mayoría del Nuevo Testamento; las diferencias se agrupan en un número relativamente pequeño de lugares, como el final más largo de Marcos, la mujer sorprendida en adulterio, y algunos versículos más completos en el Texto Recibido. Ni una sola doctrina cardinal — la deidad de Cristo, la Trinidad, la resurrección, la salvación por gracia — depende de ninguna de estas, pues cada una se enseña muchas veces en pasajes que ambos textos comparten.` },

  { promptEn:`State the case for the Critical Text as its defenders make it.`,
    promptEs:`Expón el caso del Texto Crítico como lo hacen sus defensores.`,
    keywords:[`earli`,`antigu`,`manuscript`,`manuscrit`,`harmoniz`,`armoniz`,`scrib`,`escrib`],
    modelEn:`Its aim is to recover as closely as possible the exact wording the apostles wrote. Its guiding conviction is that the earliest manuscripts, being fewer copies removed from the originals, are generally the most reliable. Scribes over time tended to add, harmonize, and smooth rather than omit, so where the earliest copies are shorter or harder, that is often the original. This is the majority view in scholarship, held by many Bible-believing Christians.`,
    modelEs:`Su meta es recuperar lo más cercanamente posible la redacción exacta que escribieron los apóstoles. Su convicción rectora es que los manuscritos más antiguos, al estar a menos copias de los originales, son generalmente los más confiables. Los escribas con el tiempo tendían a añadir, armonizar y suavizar en vez de omitir, así que donde las copias más antiguas son más cortas o más difíciles, eso a menudo es lo original. Esta es la visión mayoritaria en la erudición, sostenida por muchos cristianos que creen en la Biblia.` },

  { promptEn:`State the case for the Received/Majority Text as its defenders make it.`,
    promptEs:`Expón el caso del Texto Recibido/Mayoritario como lo hacen sus defensores.`,
    keywords:[`majorit`,`mayorit`,`preserv`,`manuscript`,`manuscrit`,`church`,`iglesia`,`original`],
    modelEn:`There are two strands. The Majority Text argument is that the reading found in the great majority of manuscripts, which the church continuously used, is likely original — why trust a few Egyptian copies over the thousands the church actually read? The preservation argument is that God promised to preserve His Word, so it would be strange if the true text were lost to the church for 1,500 years until a few copies were recovered. This too is held by serious believing Christians.`,
    modelEs:`Hay dos vertientes. El argumento del Texto Mayoritario es que la lectura hallada en la gran mayoría de los manuscritos, que la iglesia usó continuamente, es probablemente la original — ¿por qué confiar en unas pocas copias egipcias sobre los miles que la iglesia en verdad leyó? El argumento de la preservación es que Dios prometió preservar su Palabra, así que sería extraño que el texto verdadero se perdiera para la iglesia por 1,500 años hasta que unas pocas copias fueran recuperadas. Esto también lo sostienen cristianos serios que creen.` },

  { promptEn:`Using the Comma Johanneum or the ending of Mark, show how the two approaches reason — and why the doctrine is secure.`,
    promptEs:`Usando la Coma Juanina o el final de Marcos, muestra cómo razonan los dos enfoques — y por qué la doctrina está segura.`,
    keywords:[`comma`,`coma`,`trinit`,`trinid`,`mark`,`marc`,`doctrin`,`receiv`],
    modelEn:`The longer ending of Mark and the Comma Johanneum (1 John 5:7-8) stand in the Received Text, the King James, and the Reina-Valera, but the Comma is found in only a very few late Greek manuscripts, which is why the Critical Text omits it. Yet the truth of the Trinity is taught throughout the Scriptures both texts share — Matthew 28:19, John 1, 2 Corinthians 13:14 — so the doctrine loses nothing whichever reading is printed.`,
    modelEs:`El final más largo de Marcos y la Coma Juanina (1 Juan 5:7-8) están en el Texto Recibido, la King James y la Reina-Valera, pero la Coma se halla en solo unos muy pocos manuscritos griegos tardíos, por lo cual el Texto Crítico la omite. Sin embargo, la verdad de la Trinidad se enseña por toda la Escritura que ambos textos comparten — Mateo 28:19, Juan 1, 2 Corintios 13:14 — así que la doctrina no pierde nada cualquiera que sea la lectura impresa.` },

  { promptEn:`What text tradition does CTS use, and what two extremes does the unit refuse?`,
    promptEs:`¿Qué tradición textual usa CTS, y qué dos extremos rechaza la unidad?`,
    keywords:[`receiv`,`recib`,`refus`,`rechaz`,`extrem`,`corrupt`,`modern`,`preserv`],
    modelEn:`CTS's own Bibles, the New King James and the Reina-Valera Gómez, stand in the Received Text tradition, whose preservation argument the course finds weighty. But the unit refuses two extremes: the claim that the Received Text and King James tradition are corrupt or ignorant, and the opposite claim that modern versions are a deliberate satanic corruption that deletes verses. Both charges mistake an honest disagreement for something worse.`,
    modelEs:`Las propias Biblias de CTS, la Nueva King James y la Reina-Valera Gómez, están en la tradición del Texto Recibido, cuyo argumento de preservación el curso considera de peso. Pero la unidad rechaza dos extremos: la afirmación de que el Texto Recibido y la tradición King James son corruptos o ignorantes, y la afirmación opuesta de que las versiones modernas son una corrupción satánica deliberada que borra versículos. Ambas acusaciones confunden un desacuerdo honesto con algo peor.` },

  { promptEn:`Explain the unit's pastoral conclusion about believers who use different Bibles.`,
    promptEs:`Explica la conclusión pastoral de la unidad sobre los creyentes que usan Biblias diferentes.`,
    keywords:[`believ`,`creyent`,`word`,`palabra`,`tradition`,`tradic`,`modern`,`recib`],
    modelEn:`The unit teaches that a believer with an ESV or an NVI holds the Word of God, and a believer with a King James or a Reina-Valera holds the Word of God. The choice of text is not a test of a person's faith. Conservative candor means standing warmly in our own Received Text tradition without unchurching brothers who read faithful modern Bibles.`,
    modelEs:`La unidad enseña que un creyente con una ESV o una NVI tiene la Palabra de Dios, y un creyente con una King James o una Reina-Valera tiene la Palabra de Dios. La elección del texto no es una prueba de la fe de una persona. La franqueza conservadora significa mantenerse con cariño en nuestra propia tradición del Texto Recibido sin descomulgar a los hermanos que leen Biblias modernas fieles.` },

  { promptEn:`Summarize the anchor doctrine that holds through this entire debate.`,
    promptEs:`Resume la doctrina ancla que se mantiene a través de todo este debate.`,
    keywords:[`preserv`,`word`,`palabra`,`gospel`,`evangel`,`faithful`,`fiel`,`differ`],
    modelEn:`The anchor is that God preserved His Word — not by handing us a single flawless manuscript, but so richly and so publicly that His truth could never be lost. Whichever faithful text and translation one holds, one holds the Word of God, and not one of the textual differences touches the gospel by which we are saved. The question is never whether we have the Word, only which reading to print in a few places.`,
    modelEs:`El ancla es que Dios preservó su Palabra — no entregándonos un solo manuscrito sin falla, sino tan rica y tan públicamente que su verdad nunca podría perderse. Cualquiera que sea el texto y la traducción fiel que uno tenga, uno tiene la Palabra de Dios, y ni una sola de las diferencias textuales toca el evangelio por el cual somos salvos. La pregunta nunca es si tenemos la Palabra, solo cuál lectura imprimir en unos pocos lugares.` },

  { promptEn:`In your own words, how should this unit shape the way you speak about Bible translations with other Christians?`,
    promptEs:`Con tus palabras, ¿cómo debe esta unidad formar la manera en que hablas sobre las traducciones de la Biblia con otros cristianos?`,
    keywords:[`charit`,`carid`,`receiv`,`recib`,`convict`,`convicc`,`corrupt`,`modern`],
    modelEn:`I should speak with both conviction and charity: holding my own Received Text Bible with confidence while treating the text question as a real but in-house matter, not a test of faith. I should refuse both the claim that the King James tradition is corrupt and the claim that modern versions are a satanic plot, and I should assure any believer that a faithful translation, whichever family it follows, is the preserved Word of God.`,
    modelEs:`Debo hablar con convicción y con caridad: sosteniendo con confianza mi propia Biblia del Texto Recibido, mientras trato la cuestión del texto como un asunto real pero entre hermanos, no como una prueba de fe. Debo rechazar tanto la afirmación de que la tradición King James es corrupta como la afirmación de que las versiones modernas son un complot satánico, y debo asegurar a todo creyente que una traducción fiel, cualquiera que sea la familia que siga, es la Palabra de Dios preservada.` }
];
