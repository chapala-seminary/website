/* CTSBible - unit 4: per-unit configuration and content. */

const UNIT = 4;

const COURSE_PREFIX = 'cts_bible_u4_';

const mcQuestions = [
  { textEn:`The "second witness" of the course concerns:`, textEs:`El "segundo testigo" del curso trata de:`,
    optionsEn:[`The right words (text and transmission)`,`The right books (canon)`,`Archaeology`,`Geography`],
    optionsEs:[`Las palabras correctas (texto y transmisión)`,`Los libros correctos (canon)`,`La arqueología`,`La geografía`],
    correct:0, explanationEn:`The second witness is the text — the right words — and how they were transmitted.`, explanationEs:`El segundo testigo es el texto — las palabras correctas — y cómo se transmitieron.` },

  { textEn:`The "autographs" are:`, textEs:`Los "autógrafos" son:`,
    optionsEn:[`The signatures of the scribes`,`The oldest translations`,`The original manuscripts written by the biblical authors`,`The printed Bibles`],
    optionsEs:[`Las firmas de los escribas`,`Las traducciones más antiguas`,`Los manuscritos originales escritos por los autores bíblicos`,`Las Biblias impresas`],
    correct:2, explanationEn:`Autographs = the original manuscripts penned by the authors.`, explanationEs:`Autógrafos = los manuscritos originales escritos por los autores.` },

  { textEn:`Which is true of the autographs today?`, textEs:`¿Qué es verdad de los autógrafos hoy?`,
    optionsEn:[`They are kept in the Vatican`,`They were never written`,`None survive; we have only copies`,`They are on display in Jerusalem`],
    optionsEs:[`Se guardan en el Vaticano`,`Nunca se escribieron`,`Ninguno sobrevive; solo tenemos copias`,`Están en exhibición en Jerusalén`],
    correct:2, explanationEn:`No autographs survive; we possess only copies.`, explanationEs:`No sobrevive ningún autógrafo; solo poseemos copias.` },

  { textEn:`Before the printing press, every copy of Scripture was made:`, textEs:`Antes de la imprenta, cada copia de la Escritura se hacía:`,
    optionsEn:[`By hand, one letter at a time`,`By stamping`,`By a machine`,`Only from memory`],
    optionsEs:[`A mano, una letra a la vez`,`Con sellos`,`Con una máquina`,`Solo de memoria`],
    correct:0, explanationEn:`Every copy was made by hand before printing.`, explanationEs:`Cada copia se hacía a mano antes de la imprenta.` },

  { textEn:`Which materials were used for copying, from earlier to later?`, textEs:`¿Qué materiales se usaron para copiar, de lo más temprano a lo más tardío?`,
    optionsEn:[`Paper, then stone`,`Metal, then clay`,`Silk, then paper`,`Papyrus (fragile), then parchment or vellum (durable)`],
    optionsEs:[`Papel, luego piedra`,`Metal, luego barro`,`Seda, luego papel`,`Papiro (frágil), luego pergamino o vitela (duradero)`],
    correct:3, explanationEn:`Papyrus (fragile) came first, then durable parchment/vellum.`, explanationEs:`El papiro (frágil) vino primero, luego el pergamino/vitela duradero.` },

  { textEn:`Christians very early adopted the ______ (book form) rather than the scroll:`, textEs:`Los cristianos adoptaron muy temprano el ______ (forma de libro) en vez del rollo:`,
    optionsEn:[`wax tablet`,`scroll`,`codex (bound book form)`,`papyrus roll`],
    optionsEs:[`tablilla de cera`,`rollo`,`códice (forma de libro encuadernado)`,`rollo de papiro`],
    correct:2, explanationEn:`Christians adopted the codex — the bound book — very early.`, explanationEs:`Los cristianos adoptaron el códice — el libro encuadernado — muy temprano.` },

  { textEn:`The Masoretes were:`, textEs:`Los masoretas eran:`,
    optionsEn:[`Greek philosophers`,`Christian monks who wrote the Gospels`,`Roman officials`,`Jewish scribes who built elaborate safeguards around the Old Testament text`],
    optionsEs:[`Filósofos griegos`,`Monjes cristianos que escribieron los Evangelios`,`Funcionarios romanos`,`Escribas judíos que levantaron salvaguardas elaboradas alrededor del texto del Antiguo Testamento`],
    correct:3, explanationEn:`The Masoretes were Jewish scribes who guarded the OT text.`, explanationEs:`Los masoretas eran escribas judíos que guardaron el texto del AT.` },

  { textEn:`Which was a Masoretic safeguard?`, textEs:`¿Cuál fue una salvaguarda masorética?`,
    optionsEn:[`Counting the letters and words, and knowing the middle letter`,`Burning all old copies`,`Translating into Latin`,`Adding new books`],
    optionsEs:[`Contar las letras y palabras, y saber la letra central`,`Quemar todas las copias antiguas`,`Traducir al latín`,`Añadir libros nuevos`],
    correct:0, explanationEn:`They counted letters and words and knew the middle letter.`, explanationEs:`Contaban letras y palabras y sabían la letra central.` },

  { textEn:`The popular fear the unit answers is that:`, textEs:`El temor popular que la unidad responde es que:`,
    optionsEn:[`The Bible was never copied`,`The scribes could not write`,`Careless or scheming hands slowly changed the Bible over the centuries`,`There are too few manuscripts`],
    optionsEs:[`La Biblia nunca se copió`,`Los escribas no sabían escribir`,`Manos descuidadas o intrigantes cambiaron lentamente la Biblia a lo largo de los siglos`,`Hay muy pocos manuscritos`],
    correct:2, explanationEn:`The fear is that careless or scheming hands slowly changed the Bible.`, explanationEs:`El temor es que manos descuidadas o intrigantes cambiaron lentamente la Biblia.` },

  { textEn:`Most copying errors were:`, textEs:`La mayoría de los errores de copia fueron:`,
    optionsEn:[`Unintentional (errors of the eye, ear, and memory)`,`Deliberate doctrinal changes`,`Invented by translators`,`Impossible to detect`],
    optionsEs:[`Involuntarios (errores de la vista, del oído y de la memoria)`,`Cambios doctrinales deliberados`,`Inventados por los traductores`,`Imposibles de detectar`],
    correct:0, explanationEn:`Most were unintentional slips of eye, ear, and memory.`, explanationEs:`La mayoría fueron deslices involuntarios de vista, oído y memoria.` },

  { textEn:`Skipping a line because two lines end with the same word is an example of:`, textEs:`Saltarse una línea porque dos líneas terminan con la misma palabra es un ejemplo de:`,
    optionsEn:[`An error of the ear`,`A doctrinal change`,`A Masoretic note`,`An error of the eye`],
    optionsEs:[`Un error del oído`,`Un cambio doctrinal`,`Una nota masorética`,`Un error de la vista`],
    correct:3, explanationEn:`Skipping between same-ending lines is an error of the eye.`, explanationEs:`Saltar entre líneas de igual terminación es un error de la vista.` },

  { textEn:`Intentional scribal changes were usually:`, textEs:`Los cambios intencionales de los escribas solían ser:`,
    optionsEn:[`Attempts to teach heresy`,`Well-meant (smoothing, harmonizing, clarifying)`,`Random`,`Never made`],
    optionsEs:[`Intentos de enseñar herejía`,`Bien intencionados (suavizar, armonizar, aclarar)`,`Al azar`,`Nunca hechos`],
    correct:1, explanationEn:`Intentional changes were usually well-meant, not corrupting.`, explanationEs:`Los cambios intencionales solían ser bien intencionados, no corruptores.` },

  { textEn:`The New Testament survives in how many Greek manuscripts (whole or part)?`, textEs:`¿En cuántos manuscritos griegos (enteros o en parte) sobrevive el Nuevo Testamento?`,
    optionsEn:[`About a dozen`,`More than five thousand`,`About a hundred`,`Exactly twenty-seven`],
    optionsEs:[`Cerca de una docena`,`Más de cinco mil`,`Cerca de cien`,`Exactamente veintisiete`],
    correct:1, explanationEn:`More than five thousand Greek NT manuscripts survive.`, explanationEs:`Sobreviven más de cinco mil manuscritos griegos del NT.` },

  { textEn:`Compared with the New Testament, most classical works survive in:`, textEs:`Comparadas con el Nuevo Testamento, la mayoría de las obras clásicas sobreviven en:`,
    optionsEn:[`Far more copies than the NT`,`A handful to a few hundred copies, often with a thousand-year gap`,`The same number of copies`,`No copies at all`],
    optionsEs:[`Muchas más copias que el NT`,`Un puñado o unos pocos cientos de copias, a menudo con mil años de diferencia`,`El mismo número de copias`,`Ninguna copia`],
    correct:1, explanationEn:`Classical works survive in far fewer copies, with large time gaps.`, explanationEs:`Las obras clásicas sobreviven en muchas menos copias, con grandes brechas de tiempo.` },

  { textEn:`Scholars call the New Testament's manuscript wealth:`, textEs:`Los eruditos llaman a la riqueza de manuscritos del Nuevo Testamento:`,
    optionsEn:[`A famine of evidence`,`A single thread`,`A forgery`,`An embarrassment of riches`],
    optionsEs:[`Una hambruna de evidencia`,`Un solo hilo`,`Una falsificación`,`Una vergüenza de riquezas`],
    correct:3, explanationEn:`It is called an "embarrassment of riches."`, explanationEs:`Se le llama una "vergüenza de riquezas".` },

  { textEn:`The large number of textual variants exists mainly because:`, textEs:`El gran número de variantes textuales existe principalmente porque:`,
    optionsEn:[`The text was heavily corrupted`,`Translators invented them`,`There is a large number of manuscripts to compare`,`The autographs disagreed`],
    optionsEs:[`El texto fue muy corrompido`,`Los traductores las inventaron`,`Hay un gran número de manuscritos para comparar`,`Los autógrafos discrepaban`],
    correct:2, explanationEn:`Many manuscripts means many counted differences — abundance, not corruption.`, explanationEs:`Muchos manuscritos significan muchas diferencias contadas — abundancia, no corrupción.` },

  { textEn:`The overwhelming majority of variants are:`, textEs:`La abrumadora mayoría de las variantes son:`,
    optionsEn:[`Changes to core doctrines`,`Spelling, word order, and obvious slips`,`Missing books`,`Deliberate forgeries`],
    optionsEs:[`Cambios a doctrinas centrales`,`Ortografía, orden de palabras y deslices evidentes`,`Libros faltantes`,`Falsificaciones deliberadas`],
    correct:1, explanationEn:`Most variants are spelling, word order, and obvious slips.`, explanationEs:`La mayoría de las variantes son ortografía, orden de palabras y deslices evidentes.` },

  { textEn:`How many articles of the Christian faith are placed in doubt by the meaningful, viable variants?`, textEs:`¿Cuántos artículos de la fe cristiana ponen en duda las variantes significativas y viables?`,
    optionsEn:[`Most of them`,`About half`,`All of them`,`None`],
    optionsEs:[`La mayoría`,`Cerca de la mitad`,`Todos`,`Ninguno`],
    correct:3, explanationEn:`Not one article of the faith is placed in doubt.`, explanationEs:`Ni un solo artículo de la fe queda en duda.` },

  { textEn:`The manuscripts fall into families (copies descended from a common ancestor). Why does this make a scribe’s error correctable?`, textEs:`Los manuscritos caen en familias (copias descendientes de un antepasado común). ¿Por qué esto hace corregible el error de un escriba?`,
    optionsEn:[`His error passes to his own family but is absent from the others, so comparing the families exposes it`,`Every copy in a family is identical, so no error can occur`,`The families were copied directly from the surviving autographs`,`Older families are always right and newer families always wrong`],
    optionsEs:[`Su error pasa a su propia familia pero está ausente de las otras, así que comparar las familias lo delata`,`Cada copia de una familia es idéntica, así que no puede ocurrir error`,`Las familias se copiaron directamente de los autógrafos sobrevivientes`,`Las familias más antiguas siempre tienen razón y las más nuevas siempre se equivocan`],
    correct:0, explanationEn:`An error breeds true down its own family but never appears in the others; its absence there exposes it, and textual criticism recovers the earlier reading by comparing families.`, explanationEs:`Un error se propaga por su propia familia pero nunca aparece en las otras; su ausencia allí lo delata, y la crítica textual recupera la lectura anterior comparando las familias.` },

  { textEn:`The two most-discussed disputed passages (Mark's longer ending; the woman caught in adultery) are handled by:`, textEs:`Los dos pasajes disputados más discutidos (el final más largo de Marcos; la mujer sorprendida en adulterio) se tratan:`,
    optionsEn:[`Declaring them certainly false`,`Noting the whole debate turns on a handful of places, with the detailed Received/Critical question saved for Unit 6`,`Hiding them`,`Removing them from all Bibles`],
    optionsEs:[`Declarándolos ciertamente falsos`,`Notando que todo el debate gira en torno a un puñado de lugares, dejando la cuestión detallada del Texto Recibido/Crítico para la Unidad 6`,`Ocultándolos`,`Quitándolos de todas las Biblias`],
    correct:1, explanationEn:`The debate turns on a few places; the RT/CT mechanics come in Unit 6.`, explanationEs:`El debate gira en torno a pocos lugares; la mecánica del TR/TC viene en la Unidad 6.` }
];

const saQuestions = [
  { promptEn:`What is the honest situation regarding the original biblical manuscripts, and what question does it raise?`,
    promptEs:`¿Cuál es la situación honesta respecto a los manuscritos bíblicos originales, y qué pregunta plantea?`,
    keywords:[`original`,`manuscript`,`manuscrit`,`copi`,`hand`,`mano`,`print`,`imprent`],
    modelEn:`We do not possess a single original manuscript, or autograph; not one page in the hand of Moses or Paul survives. What we have instead are copies of copies, made by hand for centuries before the printing press. This raises a fair question: can a text copied by hand so many times still be trusted as the Word of God?`,
    modelEs:`No poseemos ni un solo manuscrito original, o autógrafo; no sobrevive ni una página de la mano de Moisés o de Pablo. Lo que tenemos en su lugar son copias de copias, hechas a mano por siglos antes de la imprenta. Esto plantea una pregunta justa: ¿puede confiarse en un texto copiado a mano tantas veces como la Palabra de Dios?` },

  { promptEn:`Describe how Scripture was copied before the printing press, including materials and form.`,
    promptEs:`Describe cómo se copiaba la Escritura antes de la imprenta, incluyendo materiales y forma.`,
    keywords:[`hand`,`mano`,`papyr`,`papir`,`parchment`,`pergamin`,`scrib`,`escrib`],
    modelEn:`Before printing, every copy was made by hand, one letter at a time, either from an exemplar or by dictation to a room of scribes. The earliest material was papyrus, cheap but fragile, and later parchment or vellum from animal skin, far more durable. The Jews used scrolls, but Christians adopted the codex, the bound book form, very early.`,
    modelEs:`Antes de la imprenta, cada copia se hacía a mano, una letra a la vez, ya de un ejemplar o por dictado a una sala de escribas. El material más antiguo fue el papiro, barato pero frágil, y luego el pergamino o vitela de piel animal, mucho más duradero. Los judíos usaban rollos, pero los cristianos adoptaron el códice, la forma de libro encuadernado, muy temprano.` },

  { promptEn:`Who were the Masoretes, and how did they guard the Old Testament text?`,
    promptEs:`¿Quiénes eran los masoretas, y cómo guardaron el texto del Antiguo Testamento?`,
    keywords:[`masor`,`scrib`,`escrib`,`count`,`cont`,`letter`,`letra`,`safeguard`],
    modelEn:`The Masoretes were Jewish scribes, working from about the sixth to tenth century, who built extraordinary safeguards around the Old Testament. They counted the letters and words of each book, knew the middle letter of the Torah, and recorded marginal notes called the Masorah. A copy that failed their checks was not used, because they believed every letter was God's.`,
    modelEs:`Los masoretas eran escribas judíos, que trabajaron desde cerca del siglo sexto hasta el décimo, que levantaron salvaguardas extraordinarias alrededor del Antiguo Testamento. Contaban las letras y palabras de cada libro, sabían la letra central de la Torá, y registraban notas marginales llamadas la Masora. Una copia que no pasaba sus verificaciones no se usaba, porque creían que cada letra era de Dios.` },

  { promptEn:`Name and explain two kinds of unintentional copying errors.`,
    promptEs:`Nombra y explica dos clases de errores de copia involuntarios.`,
    keywords:[`eye`,`vista`,`dict`,`memor`,`unintention`,`involuntar`,`scrib`,`escrib`],
    modelEn:`Errors of the eye happened when a scribe mistook one similar letter for another, or skipped a line because two lines ended with the same word. Errors of the ear happened when a scribe wrote from dictation and two words sounded alike. Errors of memory occurred when he held a phrase in mind and altered it slightly. These were unintentional, the ordinary slips of hand-copying.`,
    modelEs:`Los errores de la vista ocurrían cuando un escriba confundía una letra parecida con otra, o se saltaba una línea porque dos líneas terminaban con la misma palabra. Los errores del oído ocurrían cuando un escriba escribía al dictado y dos palabras sonaban igual. Los errores de la memoria ocurrían cuando retenía una frase en la mente y la alteraba un poco. Estos eran involuntarios, los deslices ordinarios de la copia a mano.` },

  { promptEn:`Were most intentional scribal changes attempts to corrupt doctrine? Explain.`,
    promptEs:`¿Fueron la mayoría de los cambios intencionales de los escribas intentos de corromper la doctrina? Explica.`,
    keywords:[`intention`,`intencion`,`harmoniz`,`armoniz`,`doctrin`,`detectab`,`corrupt`,`corromp`],
    modelEn:`No. Most intentional changes were well-meant: a scribe smoothing a hard reading, harmonizing one Gospel to match another, or adding a clarifying word. Deliberate changes to teach false doctrine are rare, and where they exist they are detectable. The scribes were mostly trying to help, not to corrupt.`,
    modelEs:`No. La mayoría de los cambios intencionales fueron bien intencionados: un escriba suavizando una lectura difícil, armonizando un Evangelio para que coincidiera con otro, o añadiendo una palabra aclaratoria. Los cambios deliberados para enseñar falsa doctrina son raros, y donde existen son detectables. Los escribas en su mayoría trataban de ayudar, no de corromper.` },

  { promptEn:`What is the "embarrassment of riches," and how does the New Testament compare with classical works?`,
    promptEs:`¿Qué es la "vergüenza de riquezas", y cómo se compara el Nuevo Testamento con las obras clásicas?`,
    keywords:[`manuscript`,`manuscrit`,`greek`,`grieg`,`abundan`,`copi`,`thousand`,`mil`],
    modelEn:`The New Testament survives in more than five thousand Greek manuscripts, plus thousands more in other languages and countless quotations by the church fathers — far more than any other ancient work. Most classical works survive in only a handful to a few hundred copies, often first copied a thousand years after the author died. Scholars call this abundance an embarrassment of riches.`,
    modelEs:`El Nuevo Testamento sobrevive en más de cinco mil manuscritos griegos, además de miles más en otros idiomas e incontables citas de los padres de la iglesia — mucho más que cualquier otra obra antigua. La mayoría de las obras clásicas sobreviven en apenas un puñado o unos pocos cientos de copias, a menudo copiadas por primera vez mil años después de la muerte del autor. Los eruditos llaman a esta abundancia una vergüenza de riquezas.` },

  { promptEn:`Why is the large number of textual variants not a reason for alarm?`,
    promptEs:`¿Por qué el gran número de variantes textuales no es motivo de alarma?`,
    keywords:[`variant`,`witness`,`testig`,`spelling`,`ortograf`,`orden`,`secure`,`segur`],
    modelEn:`The variant count is large because the number of manuscripts is large: five thousand copies each with a few slips produce many differences, while the text is more secure, not less. The overwhelming majority are spelling and word-order differences or obvious slips, and not one meaningful, viable variant places any article of the faith in doubt. The variants are the footprints of many witnesses.`,
    modelEs:`El conteo de variantes es grande porque el número de manuscritos es grande: cinco mil copias, cada una con unos pocos deslices, producen muchas diferencias, mientras el texto es más seguro, no menos. La abrumadora mayoría son diferencias de ortografía y de orden de palabras o deslices evidentes, y ni una sola variante significativa y viable pone en duda un artículo de la fe. Las variantes son las huellas de muchos testigos.` },

  { promptEn:`The manuscripts fall into families. Explain how this lets the science of textual criticism find and correct a scribe’s error.`,
    promptEs:`Los manuscritos caen en familias. Explica cómo esto permite a la ciencia de la crítica textual encontrar y corregir el error de un escriba.`,
    keywords:[`famil`,`error`,`textual`,`compar`,`descend`,`origin`,`recover`,`recuper`],
    modelEn:`The more than five thousand manuscripts are not identical, but they fall into families — groups of copies descended from a common ancestor. When a scribe makes an error, it is passed down to his whole family but never appears in the families descended from another line, so its very absence elsewhere exposes it. By comparing the families against one another, the science of textual criticism can see where and when the reading entered and recover the original wording from the witnesses that never carried the error.`,
    modelEs:`Los más de cinco mil manuscritos no son idénticos, pero caen en familias — grupos de copias descendientes de un antepasado común. Cuando un escriba comete un error, este pasa a toda su familia pero nunca aparece en las familias descendientes de otra línea, de modo que su misma ausencia en el resto lo delata. Al comparar las familias unas con otras, la ciencia de la crítica textual puede ver dónde y cuándo entró la lectura y recuperar la redacción original a partir de los testigos que nunca llevaron el error.` },

  { promptEn:`How does the unit handle the two largest disputed passages, and what does their existence show?`,
    promptEs:`¿Cómo trata la unidad los dos pasajes disputados más grandes, y qué muestra su existencia?`,
    keywords:[`mark`,`marc`,`adulter`,`receiv`,`recib`,`debate`,`passage`,`pasaj`],
    modelEn:`The longer ending of Mark and the account of the woman caught in adultery are the two most discussed passages in the New Testament. They stand in the Received Text behind the King James and the Reina-Valera and are printed there in full, while some of the earliest Greek copies lack them. The unit notes that the whole debate turns on a handful of places, never on the heart of the faith, and saves the detailed Received-versus-Critical question for Unit 6.`,
    modelEs:`El final más largo de Marcos y el relato de la mujer sorprendida en adulterio son los dos pasajes más discutidos del Nuevo Testamento. Están en el Texto Recibido detrás de la King James y la Reina-Valera y allí se imprimen completos, mientras que algunas de las copias griegas más antiguas no los tienen. La unidad nota que todo el debate gira en torno a un puñado de lugares, nunca en torno al corazón de la fe, y guarda la cuestión detallada del Texto Recibido frente al Crítico para la Unidad 6.` },

  { promptEn:`In your own words, what honest promise can we make to the believer about the words of the Bible — and what overclaim do we avoid?`,
    promptEs:`Con tus palabras, ¿qué promesa honesta podemos hacer al creyente sobre las palabras de la Biblia — y qué exageración evitamos?`,
    keywords:[`preserv`,`abundan`,`overclaim`,`exager`,`chain`,`cadena`,`stumbl`,`variant`],
    modelEn:`We can promise that the words the believer reads are, in substance and overwhelmingly in detail, what the prophets and apostles wrote, because God preserved His Word through an abundance no accident could erase. We avoid the overclaim of a perfect, unbroken chain of copies, which God did not promise and which would set a believer up to stumble at the first variant. Respect for the text means honesty and confidence together.`,
    modelEs:`Podemos prometer que las palabras que el creyente lee son, en sustancia y en su inmensa mayoría en detalle, lo que escribieron los profetas y los apóstoles, porque Dios preservó su Palabra mediante una abundancia que ningún accidente pudo borrar. Evitamos la exageración de una cadena de copias perfecta e ininterrumpida, que Dios no prometió y que prepararía al creyente para tropezar ante la primera variante. El respeto por el texto significa honestidad y confianza juntas.` }
];
