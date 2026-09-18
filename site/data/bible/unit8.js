/* CTSBible - unit 8: per-unit configuration and content. */

const UNIT = 8;

const COURSE_PREFIX = 'cts_bible_u8_';

const mcQuestions = [
  { textEn:`Unit 8 does two things honestly: shows the great confirmations and:`, textEs:`La Unidad 8 hace dos cosas con honestidad: muestra las grandes confirmaciones y:`,
    optionsEn:[`Looks squarely at the genuine puzzles that remain open`,`Hides the puzzles`,`Proves every event`,`Abandons archaeology`],
    optionsEs:[`Mira de frente los enigmas genuinos que quedan abiertos`,`Oculta los enigmas`,`Prueba cada evento`,`Abandona la arqueología`],
    correct:0, explanationEn:`It shows confirmations AND faces the genuine open puzzles.`, explanationEs:`Muestra confirmaciones Y enfrenta los enigmas genuinos abiertos.` },

  { textEn:`Why does the unit say this is the "credibility anchor"?`, textEs:`¿Por qué dice la unidad que este es el "ancla de credibilidad"?`,
    optionsEn:[`Because it hides hard cases`,`Because it avoids disputes`,`Because a witness who faces his hard cases honestly earns trust`,`Because it proves the Bible`],
    optionsEs:[`Porque oculta los casos difíciles`,`Porque evita las disputas`,`Porque un testigo que enfrenta sus casos difíciles con honestidad gana confianza`,`Porque prueba la Biblia`],
    correct:2, explanationEn:`Facing hard cases honestly is what earns the course its credibility.`, explanationEs:`Enfrentar los casos difíciles con honestidad es lo que gana la credibilidad del curso.` },

  { textEn:`Sennacherib's Prism records his 701 BC campaign and boasts that he:`, textEs:`El prisma de Senaquerib registra su campaña del 701 a.C. y se jacta de que:`,
    optionsEn:[`Captured and burned Jerusalem`,`Killed Hezekiah`,`Never came to Judah`,`Shut Hezekiah up "like a bird in a cage" but never claims to take the city`],
    optionsEs:[`Capturó y quemó Jerusalén`,`Mató a Ezequías`,`Nunca vino a Judá`,`Encerró a Ezequías "como un pájaro en una jaula" pero nunca afirma tomar la ciudad`],
    correct:3, explanationEn:`He boasts of the siege but never claims to capture Jerusalem.`, explanationEs:`Se jacta del asedio pero nunca afirma capturar Jerusalén.` },

  { textEn:`Sennacherib's silence about capturing Jerusalem fits the biblical account that:`, textEs:`El silencio de Senaquerib sobre capturar Jerusalén encaja con el relato bíblico de que:`,
    optionsEn:[`The city fell`,`The LORD delivered Jerusalem and the Assyrians withdrew`,`Hezekiah surrendered`,`There was no siege`],
    optionsEs:[`La ciudad cayó`,`Jehová libró a Jerusalén y los asirios se retiraron`,`Ezequías se rindió`,`No hubo asedio`],
    correct:1, explanationEn:`The Bible records the LORD delivered the city and the army withdrew.`, explanationEs:`La Biblia registra que Jehová libró la ciudad y el ejército se retiró.` },

  { textEn:`Hezekiah's Tunnel and the Siloam Inscription corroborate:`, textEs:`El túnel de Ezequías y la Inscripción de Siloé corroboran:`,
    optionsEn:[`The fall of Babylon`,`The Exodus`,`The waterworks Hezekiah built, described in 2 Kings 20`,`The conquest of Jericho`],
    optionsEs:[`La caída de Babilonia`,`El Éxodo`,`La obra hidráulica que Ezequías construyó, descrita en 2 Reyes 20`,`La conquista de Jericó`],
    correct:2, explanationEn:`The tunnel corroborates Hezekiah's waterworks in 2 Kings 20.`, explanationEs:`El túnel corrobora la obra hidráulica de Ezequías en 2 Reyes 20.` },

  { textEn:`Critics long said Belshazzar (Daniel 5) never existed because:`, textEs:`Los críticos por mucho tiempo dijeron que Belsasar (Daniel 5) nunca existió porque:`,
    optionsEn:[`The records named Nabonidus as Babylon's last king`,`He was too famous`,`Daniel invented him`,`He was Persian`],
    optionsEs:[`Los registros nombraban a Nabonido como el último rey de Babilonia`,`Era demasiado famoso`,`Daniel lo inventó`,`Era persa`],
    correct:0, explanationEn:`The records named Nabonidus, not Belshazzar, as the last king.`, explanationEs:`Los registros nombraban a Nabonido, no a Belsasar, como el último rey.` },

  { textEn:`The tablets revealed Belshazzar was:`, textEs:`Las tablillas revelaron que Belsasar era:`,
    optionsEn:[`A later legendary invention`,`The son and co-regent of Nabonidus, ruling Babylon in his father's absence`,`King of Persia`,`A high priest`],
    optionsEs:[`Una invención legendaria posterior`,`El hijo y co-regente de Nabonido, gobernando Babilonia en ausencia de su padre`,`Rey de Persia`,`Un sumo sacerdote`],
    correct:1, explanationEn:`Belshazzar was Nabonidus's son and co-regent.`, explanationEs:`Belsasar era hijo y co-regente de Nabonido.` },

  { textEn:`Belshazzar offering Daniel only "third ruler in the kingdom" is explained because:`, textEs:`Que Belsasar ofreciera a Daniel solo el "tercer gobernante del reino" se explica porque:`,
    optionsEn:[`Daniel refused higher office`,`There were only three officials`,`It was an error`,`First was Nabonidus, second Belshazzar, so third was the highest he could give`],
    optionsEs:[`Daniel rechazó un cargo más alto`,`Solo había tres funcionarios`,`Fue un error`,`El primero era Nabonido, el segundo Belsasar, así que el tercero era lo más alto que podía dar`],
    correct:3, explanationEn:`Third was the highest place, since first and second were taken.`, explanationEs:`El tercero era el lugar más alto, pues el primero y el segundo estaban ocupados.` },

  { textEn:`The Cyrus Cylinder corroborates:`, textEs:`El Cilindro de Ciro corrobora:`,
    optionsEn:[`The crucifixion`,`The flood`,`The Persian policy of returning captive peoples to rebuild their temples (cf. Ezra 1)`,`The Exodus`],
    optionsEs:[`La crucifixión`,`El diluvio`,`La política persa de devolver a los pueblos cautivos para reconstruir sus templos (cf. Esdras 1)`,`El Éxodo`],
    correct:2, explanationEn:`It corroborates the return-and-rebuild policy of Ezra 1.`, explanationEs:`Corrobora la política de retorno y reconstrucción de Esdras 1.` },

  { textEn:`The Gallio inscription at Delphi is valuable because it:`, textEs:`La inscripción de Galión en Delfos es valiosa porque:`,
    optionsEn:[`Fixes the year Paul stood before Gallio in Corinth, dating his ministry (Acts 18)`,`Names Jesus`,`Mentions Moses`,`Dates the Exodus`],
    optionsEs:[`Fija el año en que Pablo compareció ante Galión en Corinto, fechando su ministerio (Hechos 18)`,`Nombra a Jesús`,`Menciona a Moisés`,`Fecha el Éxodo`],
    correct:0, explanationEn:`It fixes the date of Paul before Gallio, anchoring his ministry.`, explanationEs:`Fija la fecha de Pablo ante Galión, anclando su ministerio.` },

  { textEn:`On the walls of Jericho, John Garstang (1930s) found fallen walls and burning and dated them to:`, textEs:`En los muros de Jericó, John Garstang (años 1930) halló muros caídos y quema y los fechó hacia:`,
    optionsEn:[`About 1550 BC`,`About 500 BC`,`The time of Jesus`,`About 1400 BC, matching the conquest`],
    optionsEs:[`Cerca del 1550 a.C.`,`Cerca del 500 a.C.`,`El tiempo de Jesús`,`Cerca del 1400 a.C., coincidiendo con la conquista`],
    correct:3, explanationEn:`Garstang dated the destruction to ~1400 BC, matching the conquest.`, explanationEs:`Garstang fechó la destrucción hacia el ~1400 a.C., coincidiendo con la conquista.` },

  { textEn:`Kathleen Kenyon (1950s) re-dated Jericho's destruction to about 1550 BC, which would mean:`, textEs:`Kathleen Kenyon (años 1950) refechó la destrucción de Jericó hacia el 1550 a.C., lo que significaría:`,
    optionsEn:[`The city was thriving in Joshua's day`,`The city was already ruined and nearly empty by Joshua's day`,`Joshua never existed`,`The walls never fell`],
    optionsEs:[`La ciudad prosperaba en tiempos de Josué`,`La ciudad ya estaba en ruinas y casi vacía en tiempos de Josué`,`Josué nunca existió`,`Los muros nunca cayeron`],
    correct:1, explanationEn:`Kenyon's date would leave the city ruined and empty by Joshua's day.`, explanationEs:`La fecha de Kenyon dejaría la ciudad en ruinas y vacía en tiempos de Josué.` },

  { textEn:`How does the unit treat the Jericho dating question?`, textEs:`¿Cómo trata la unidad la cuestión de la datación de Jericó?`,
    optionsEn:[`It declares Jericho proves the Bible`,`It declares Jericho disproves the Bible`,`It holds it as a genuine open question, still debated`,`It ignores it`],
    optionsEs:[`Declara que Jericó prueba la Biblia`,`Declara que Jericó refuta la Biblia`,`La sostiene como una pregunta genuinamente abierta, aún debatida`,`La ignora`],
    correct:2, explanationEn:`The unit holds Jericho as a genuine, still-debated open question.`, explanationEs:`La unidad sostiene a Jericó como una pregunta genuina, aún debatida.` },

  { textEn:`The date of the Exodus is debated between:`, textEs:`La fecha del Éxodo se debate entre:`,
    optionsEn:[`1446 BC (early) and 1260 BC (late)`,`AD 30 and AD 70`,`500 BC and 400 BC`,`There is no debate`],
    optionsEs:[`1446 a.C. (temprana) y 1260 a.C. (tardía)`,`30 d.C. y 70 d.C.`,`500 a.C. y 400 a.C.`,`No hay debate`],
    correct:0, explanationEn:`The Exodus date is debated between ~1446 BC and ~1260 BC.`, explanationEs:`La fecha del Éxodo se debate entre ~1446 a.C. y ~1260 a.C.` },

  { textEn:`Regarding Egypt's silence about the Exodus, the unit applies the rule that:`, textEs:`Respecto al silencio de Egipto sobre el Éxodo, la unidad aplica la regla de que:`,
    optionsEn:[`Silence proves it did not happen`,`The Exodus is disproven`,`Egypt recorded everything`,`Egypt rarely recorded its defeats or slave peoples, so silence is weak evidence`],
    optionsEs:[`El silencio prueba que no sucedió`,`El Éxodo queda refutado`,`Egipto registraba todo`,`Egipto rara vez registraba sus derrotas o pueblos esclavos, así que el silencio es evidencia débil`],
    correct:3, explanationEn:`Egypt rarely recorded defeats or slaves, so silence is weak evidence.`, explanationEs:`Egipto rara vez registraba derrotas o esclavos, así que el silencio es evidencia débil.` },

  { textEn:`The Merneptah Stele (~1208 BC) is a real anchor because it:`, textEs:`La Estela de Merneptah (~1208 a.C.) es un ancla real porque:`,
    optionsEn:[`Describes the parting of the sea`,`Names "Israel" as a people already in Canaan`,`Was written by Moses`,`Denies Israel existed`],
    optionsEs:[`Describe la separación del mar`,`Nombra a "Israel" como un pueblo ya en Canaán`,`Fue escrita por Moisés`,`Niega que Israel existiera`],
    correct:1, explanationEn:`It names "Israel" as a people already settled in Canaan by ~1208 BC.`, explanationEs:`Nombra a "Israel" como un pueblo ya asentado en Canaán hacia el ~1208 a.C.` },

  { textEn:`The unit's honest posture on the Exodus is:`, textEs:`La postura honesta de la unidad sobre el Éxodo es:`,
    optionsEn:[`It is fully proven`,`It is fully disproven`,`The mechanism is disputed, but Israel's presence in the land is attested`,`It should not be discussed`],
    optionsEs:[`Está totalmente probado`,`Está totalmente refutado`,`El mecanismo se disputa, pero la presencia de Israel en la tierra está atestiguada`,`No debe discutirse`],
    correct:2, explanationEn:`The mechanism is disputed; Israel's presence in the land is attested.`, explanationEs:`El mecanismo se disputa; la presencia de Israel en la tierra está atestiguada.` },

  { textEn:`Why, according to the unit, do the honest puzzles make the confirmations stronger?`, textEs:`¿Por qué, según la unidad, los enigmas honestos hacen más fuertes las confirmaciones?`,
    optionsEn:[`Candor about hard cases earns trust for the rest of the testimony`,`They don't`,`Because puzzles prove the Bible`,`Because confirmations are hidden`],
    optionsEs:[`La franqueza sobre los casos difíciles gana confianza para el resto del testimonio`,`No lo hacen`,`Porque los enigmas prueban la Biblia`,`Porque las confirmaciones se ocultan`],
    correct:0, explanationEn:`Candor about the hard cases earns trust for the rest.`, explanationEs:`La franqueza sobre los casos difíciles gana confianza para el resto.` },

  { textEn:`The verdict of the third witness is that archaeology:`, textEs:`El veredicto del tercer testigo es que la arqueología:`,
    optionsEn:[`Proves the Bible beyond dispute`,`Disproves the Bible`,`Is useless`,`Has not proved the Bible but shows its world is real history — correlation, not proof`],
    optionsEs:[`Prueba la Biblia sin disputa`,`Refuta la Biblia`,`Es inútil`,`No ha probado la Biblia pero muestra que su mundo es historia real — correlación, no prueba`],
    correct:3, explanationEn:`Archaeology has not proved the Bible but shows its world is real history.`, explanationEs:`La arqueología no ha probado la Biblia pero muestra que su mundo es historia real.` },

  { textEn:`The fourth and final witness, coming next, is:`, textEs:`El cuarto y último testigo, que viene a continuación, es:`,
    optionsEn:[`The canon`,`Geography — the very stage on which events happened`,`The text`,`Personal experience`],
    optionsEs:[`El canon`,`La geografía — el mismísimo escenario en que ocurrieron los eventos`,`El texto`,`La experiencia personal`],
    correct:1, explanationEn:`The fourth witness is geography — the stage of the events.`, explanationEs:`El cuarto testigo es la geografía — el escenario de los eventos.` }
];

const saQuestions = [
  { promptEn:`What two things does Unit 8 do honestly, and why does the unit call this the credibility anchor?`,
    promptEs:`¿Qué dos cosas hace la Unidad 8 con honestidad, y por qué la unidad llama a esto el ancla de credibilidad?`,
    keywords:[`confirm`,`puzzle`,`enigma`,`corrobor`,`trust`,`confianz`,`honest`,`credib`],
    modelEn:`The unit looks at the great confirmations, where archaeology corroborates the Bible, and it looks squarely at the genuine puzzles that remain open, hiding neither. It is the credibility anchor because a witness who faces his hard cases honestly earns trust; by showing the puzzles openly and leaving them unsolved, the course earns the right to be believed when it points to the stones that confirm Scripture.`,
    modelEs:`La unidad mira las grandes confirmaciones, donde la arqueología corrobora la Biblia, y mira de frente los enigmas genuinos que quedan abiertos, sin ocultar ninguno. Es el ancla de credibilidad porque un testigo que enfrenta sus casos difíciles con honestidad gana confianza; al mostrar los enigmas abiertamente y dejarlos sin resolver, el curso gana el derecho de ser creído cuando señala las piedras que confirman la Escritura.` },

  { promptEn:`Describe how Sennacherib's Prism and Hezekiah's Tunnel corroborate the biblical account.`,
    promptEs:`Describe cómo el prisma de Senaquerib y el túnel de Ezequías corroboran el relato bíblico.`,
    keywords:[`prism`,`jerusal`,`corrobor`,`hezekiah`,`ezequ`,`siege`,`asedi`,`deliver`],
    modelEn:`Sennacherib's Prism records his 701 BC siege of Jerusalem, boasting that he shut Hezekiah up like a bird in a cage — yet he never claims to capture the city, which fits the Bible's account that the LORD delivered Jerusalem and the Assyrians withdrew. Hezekiah's Tunnel, with its inscription left by the diggers, is the very waterwork 2 Kings 20 describes. The enemy's prism and the king's tunnel both corroborate the crisis of Hezekiah.`,
    modelEs:`El prisma de Senaquerib registra su asedio de Jerusalén en el 701 a.C., jactándose de que encerró a Ezequías como un pájaro en una jaula — sin embargo nunca afirma capturar la ciudad, lo cual concuerda con el relato bíblico de que Jehová libró a Jerusalén y los asirios se retiraron. El túnel de Ezequías, con su inscripción dejada por los excavadores, es la misma obra hidráulica que 2 Reyes 20 describe. El prisma del enemigo y el túnel del rey corroboran la crisis de Ezequías.` },

  { promptEn:`Tell the story of Belshazzar and explain what it shows about archaeology.`,
    promptEs:`Cuenta la historia de Belsasar y explica qué muestra sobre la arqueología.`,
    keywords:[`belsha`,`belsa`,`babylon`,`babilon`,`nabonid`,`regent`,`error`,`king`],
    modelEn:`Daniel 5 names Belshazzar as king of Babylon at its fall, and critics long said he never existed, since records named Nabonidus as the last king. Then the tablets revealed Belshazzar was Nabonidus's son and co-regent, ruling Babylon in his father's absence. This even explains why he could offer Daniel only third place in the kingdom. A charge of error became a mark of accuracy — the pattern of the whole third witness.`,
    modelEs:`Daniel 5 nombra a Belsasar como rey de Babilonia en su caída, y los críticos por mucho tiempo dijeron que nunca existió, ya que los registros nombraban a Nabonido como el último rey. Luego las tablillas revelaron que Belsasar era hijo y co-regente de Nabonido, gobernando Babilonia en ausencia de su padre. Esto incluso explica por qué solo pudo ofrecer a Daniel el tercer lugar en el reino. Una acusación de error se convirtió en una marca de exactitud — el patrón de todo el tercer testigo.` },

  { promptEn:`Name two or three further confirmations (from Cyrus to Caiaphas) and what each corroborates.`,
    promptEs:`Nombra dos o tres confirmaciones más (de Ciro a Caifás) y qué corrobora cada una.`,
    keywords:[`cyrus`,`ciro`,`caiaphas`,`caif`,`gallio`,`gali`,`moabit`,`templ`],
    modelEn:`The Cyrus Cylinder records the Persian policy of returning captive peoples to rebuild their temples, matching the decree of Cyrus in Ezra 1. The Moabite Stone names King Mesha's revolt against Israel and the house of Omri, matching 2 Kings 3. The Caiaphas ossuary bears the name of a high priest, in all likelihood the very one who tried Jesus, and the Gallio inscription fixes the year Paul stood before Gallio in Corinth, anchoring his ministry in Roman history.`,
    modelEs:`El Cilindro de Ciro registra la política persa de devolver a los pueblos cautivos para reconstruir sus templos, coincidiendo con el decreto de Ciro en Esdras 1. La Piedra Moabita nombra la revuelta del rey Mesa contra Israel y la casa de Omri, coincidiendo con 2 Reyes 3. El osario de Caifás lleva el nombre de un sumo sacerdote, muy probablemente el mismo que juzgó a Jesús, y la inscripción de Galión fija el año en que Pablo compareció ante Galión en Corinto, anclando su ministerio en la historia romana.` },

  { promptEn:`Present the Jericho dispute fairly, and state how the unit treats it.`,
    promptEs:`Presenta la disputa de Jericó con justicia, y di cómo la trata la unidad.`,
    keywords:[`jeric`,`wall`,`muro`,`garstang`,`kenyon`,`destruc`,`debate`,`debat`],
    modelEn:`Joshua says Jericho's walls fell and the city burned. Garstang, digging in the 1930s, found fallen walls and burning dated to about 1400 BC, matching the conquest; but Kenyon, in the 1950s, dated the destruction to about 1550 BC, meaning the city was already ruined by Joshua's day; and Wood later argued Garstang was right. The unit does not say Jericho proves or disproves the Bible; it holds the dating as a genuine open question, still debated.`,
    modelEs:`Josué dice que los muros de Jericó cayeron y la ciudad se quemó. Garstang, excavando en los años 1930, halló muros caídos y quema fechados hacia el 1400 a.C., coincidiendo con la conquista; pero Kenyon, en los años 1950, fechó la destrucción hacia el 1550 a.C., lo que significa que la ciudad ya estaba en ruinas en tiempos de Josué; y Wood después argumentó que Garstang tenía razón. La unidad no dice que Jericó prueba o refuta la Biblia; sostiene la datación como una pregunta genuinamente abierta, aún debatida.` },

  { promptEn:`Present the Exodus/conquest question fairly, including the silence and the anchor.`,
    promptEs:`Presenta la pregunta del Éxodo/conquista con justicia, incluyendo el silencio y el ancla.`,
    keywords:[`conquest`,`conquist`,`egypt`,`egipt`,`silence`,`silenc`,`merneptah`,`israel`],
    modelEn:`Scholars debate even the date of the Exodus, an earlier one around 1446 BC or a later one around 1260 BC, and Egypt left no clear record of Israelite slaves, while the conquest archaeology is mixed. But two things keep us steady: the rule that Egypt rarely recorded defeats or slave peoples, so silence is weak evidence; and a real anchor, the Merneptah Stele of about 1208 BC, which names Israel as a people already in Canaan. The mechanism is disputed; Israel's presence is attested.`,
    modelEs:`Los eruditos debaten incluso la fecha del Éxodo, una más temprana hacia el 1446 a.C. o una más tardía hacia el 1260 a.C., y Egipto no dejó registro claro de esclavos israelitas, mientras que la arqueología de la conquista es mixta. Pero dos cosas nos mantienen firmes: la regla de que Egipto rara vez registraba derrotas o pueblos esclavos, así que el silencio es evidencia débil; y un ancla real, la Estela de Merneptah de alrededor del 1208 a.C., que nombra a Israel como un pueblo ya en Canaán. El mecanismo se disputa; la presencia de Israel está atestiguada.` },

  { promptEn:`Why do the honest puzzles make the confirmations stronger?`,
    promptEs:`¿Por qué los enigmas honestos hacen más fuertes las confirmaciones?`,
    keywords:[`candor`,`franquez`,`trust`,`confianz`,`suspic`,`sospech`,`confirm`,`honest`],
    modelEn:`Because candor about the hard cases earns trust for the rest. A merchant who admits no fault invites suspicion, but a witness who freely grants the hard points is believed on the rest. Because the course set Jericho and the Exodus on the table and left them honestly open, a student can trust that when it says the stones confirm Scripture — Sennacherib, Belshazzar, Cyrus, Caiaphas — it is telling the truth. Honesty about the gnat makes the testimony about the camel believable.`,
    modelEs:`Porque la franqueza sobre los casos difíciles gana confianza para el resto. Un mercader que no admite falta invita sospecha, pero un testigo que concede libremente los puntos difíciles es creído en el resto. Porque el curso puso a Jericó y el Éxodo sobre la mesa y los dejó honestamente abiertos, un estudiante puede confiar en que cuando dice que las piedras confirman la Escritura — Senaquerib, Belsasar, Ciro, Caifás — dice la verdad. La honestidad sobre el mosquito hace creíble el testimonio sobre el camello.` },

  { promptEn:`State the verdict of the third witness.`,
    promptEs:`Enuncia el veredicto del tercer testigo.`,
    keywords:[`prove`,`prob`,`correlat`,`correlac`,`real`,`event`,`evento`,`histor`],
    modelEn:`Archaeology has not proved the Bible — no spade can prove a book from God — and it has left a few questions honestly open. But across an immense field of checkable fact, from the palaces of Assyria to the pavements of Corinth, the world of the Bible has again and again proved to be the real world, just where the Bible sets it. That is correlation, not proof, and it is mighty: the Scriptures are not detached from history but a record sunk into real places, peoples, and events.`,
    modelEs:`La arqueología no ha probado la Biblia — ninguna pala puede probar un libro de Dios — y ha dejado unas pocas preguntas honestamente abiertas. Pero a través de un campo inmenso de hechos verificables, desde los palacios de Asiria hasta los pavimentos de Corinto, el mundo de la Biblia una y otra vez ha resultado ser el mundo real, justo donde la Biblia lo sitúa. Eso es correlación, no prueba, y es poderoso: las Escrituras no están separadas de la historia sino que son un registro hundido en lugares, pueblos y eventos reales.` },

  { promptEn:`What is the fourth and final witness, and how does the unit introduce it?`,
    promptEs:`¿Cuál es el cuarto y último testigo, y cómo lo introduce la unidad?`,
    keywords:[`geography`,`geograf`,`stage`,`escenari`,`land`,`tierra`,`map`,`mapa`],
    modelEn:`The fourth and final witness is geography — not the events this time, but the very stage on which they were played: the land itself, with its roads, rivers, and hills, described so exactly that one may walk the Bible with a map in hand and find every step true. The third witness of archaeology sits down, having shown the world of the Bible is real history, and the witness of the land now rises to testify.`,
    modelEs:`El cuarto y último testigo es la geografía — no los eventos esta vez, sino el mismísimo escenario en que se representaron: la tierra misma, con sus caminos, ríos y colinas, descrita tan exactamente que uno puede caminar la Biblia con un mapa en la mano y hallar que cada paso es verdadero. El tercer testigo de la arqueología se sienta, habiendo mostrado que el mundo de la Biblia es historia real, y el testigo de la tierra ahora se levanta a testificar.` },

  { promptEn:`In your own words, explain why a course that honestly shows its hard cases is more trustworthy than one that shows only confirmations.`,
    promptEs:`Con tus palabras, explica por qué un curso que muestra con honestidad sus casos difíciles es más confiable que uno que muestra solo confirmaciones.`,
    keywords:[`confirm`,`puzzle`,`enigma`,`hidden`,`ocult`,`trust`,`confianz`,`honest`],
    modelEn:`A course that only ever confirms invites a thoughtful student to wonder what is being hidden, but a course that sets its genuine puzzles on the table and leaves them honestly open has nothing to conceal, and so its confirmations can be believed. By facing Jericho and the Exodus candidly, the course earns the right to be trusted when it points to the stones that speak. Honesty about the difficulties is what makes the confidence credible.`,
    modelEs:`Un curso que solo confirma invita al estudiante reflexivo a preguntarse qué se está ocultando, pero un curso que pone sus enigmas genuinos sobre la mesa y los deja honestamente abiertos no tiene nada que ocultar, y por eso sus confirmaciones pueden ser creídas. Al enfrentar Jericó y el Éxodo con franqueza, el curso gana el derecho de ser creído cuando señala las piedras que hablan. La honestidad sobre las dificultades es lo que hace creíble la confianza.` }
];
