/* CTSWR - unit 8: per-unit configuration and content. */

const UNIT = 8;

let currentUnit = 8;

let progress = JSON.parse(localStorage.getItem('cts_wr_progress')) || {};

const mcQuestions = [
  {
    "textEn": "1. According to this unit, what pattern do Mormonism, Jehovah's Witnesses, and the Baha'i Faith share?",
    "textEs": "1. Según esta unidad, ¿qué patrón comparten el mormonismo, los Testigos de Jehová, y la Fe Baha'i?",
    "optionsEn": [
      "Each claims continuing or completed revelation beyond the Bible as historic Christianity received it",
      "Each arose entirely independent of Christianity",
      "Each rejects the existence of Jesus entirely",
      "Each was founded in the same country"
    ],
    "optionsEs": [
      "Cada uno afirma revelación continua o completada más allá de la Biblia tal como el cristianismo histórico la recibió",
      "Cada uno surgió completamente independiente del cristianismo",
      "Cada uno rechaza por completo la existencia de Jesús",
      "Cada uno fue fundado en el mismo país"
    ],
    "c": 21,
    "explEn": "All three movements claim some form of continuing or completed revelation beyond, or in addition to, the Bible as historic Christianity has received it.",
    "explEs": "Los tres movimientos afirman alguna forma de revelación continua o completada más allá de, o además de, la Biblia tal como el cristianismo histórico la ha recibido."
  },
  {
    "textEn": "2. According to this unit, historic Christianity has held a settled consensus, since the ecumenical councils, on the Trinity, the sufficiency of the closed canon, and:",
    "textEs": "2. Según esta unidad, el cristianismo histórico ha sostenido un consenso establecido, desde los concilios ecuménicos, sobre la Trinidad, la suficiencia del canon cerrado, y:",
    "optionsEn": [
      "The exact form of church government",
      "The full deity of Christ",
      "A single sacramental practice",
      "Agreement on eschatology"
    ],
    "optionsEs": [
      "La forma exacta de gobierno eclesiástico",
      "La plena deidad de Cristo",
      "Una sola práctica sacramental",
      "Acuerdo en escatología"
    ],
    "c": 29,
    "explEn": "Historic Christianity has held a settled consensus on the full deity of Christ, the Trinity, and the sufficiency and closed nature of the biblical canon, despite disagreeing on church government and sacramental practice.",
    "explEs": "El cristianismo histórico ha sostenido un consenso establecido sobre la plena deidad de Cristo, la Trinidad, y la suficiencia y naturaleza cerrada del canon bíblico, a pesar de discrepar en el gobierno eclesiástico y la práctica sacramental."
  },
  {
    "textEn": "3. Joseph Smith reported visions beginning in 1820 in which state?",
    "textEs": "3. José Smith reportó visiones que comenzaron en 1820 en qué estado?",
    "optionsEn": [
      "Pennsylvania",
      "Utah",
      "New York",
      "Ohio"
    ],
    "optionsEs": [
      "Pensilvania",
      "Utah",
      "Nueva York",
      "Ohio"
    ],
    "c": 37,
    "explEn": "Joseph Smith reported his series of visions beginning in 1820 in western New York state.",
    "explEs": "José Smith reportó su serie de visiones que comenzaron en 1820 en el oeste del estado de Nueva York."
  },
  {
    "textEn": "4. According to this unit, Mormonism's claim of total apostasy conflicts with which biblical texts?",
    "textEs": "4. Según esta unidad, ¿con qué textos bíblicos entra en conflicto la afirmación mormona de apostasía total?",
    "optionsEn": [
      "Genesis 1 and 2",
      "The Book of Revelation only",
      "The entire Old Testament",
      "Matthew 16:18 and 1 Timothy 3:15"
    ],
    "optionsEs": [
      "Génesis 1 y 2",
      "Solo el libro de Apocalipsis",
      "Todo el Antiguo Testamento",
      "Mateo 16:18 y 1 Timoteo 3:15"
    ],
    "c": 45,
    "explEn": "Matthew 16:18 promises the gates of Hades will not prevail against the church, and 1 Timothy 3:15 describes the church as already the pillar and ground of truth, difficult to reconcile with total apostasy.",
    "explEs": "Mateo 16:18 promete que las puertas del Hades no prevalecerán contra la iglesia, y 1 Timoteo 3:15 describe a la iglesia como ya columna y baluarte de la verdad, difícil de reconciliar con la apostasía total."
  },
  {
    "textEn": "5. The Mormon couplet 'As man now is, God once was; as God now is, man may become' teaches that:",
    "textEs": "5. El pareado mormón 'Como el hombre es ahora, Dios una vez fue; como Dios es ahora, el hombre puede llegar a ser' enseña que:",
    "optionsEn": [
      "God the Father progressed to His current divine status as an exalted man",
      "God has always existed as God, eternally",
      "Humans can never become divine in any sense",
      "Jesus and God the Father are the same person"
    ],
    "optionsEs": [
      "Dios el Padre progresó a Su actual estatus divino como un hombre exaltado",
      "Dios siempre ha existido como Dios, eternamente",
      "Los humanos nunca pueden llegar a ser divinos en ningún sentido",
      "Jesús y Dios el Padre son la misma persona"
    ],
    "c": 49,
    "explEn": "This doctrine teaches God the Father is an exalted, glorified man who progressed to His current divine status, and faithful Mormons may similarly progress toward exaltation.",
    "explEs": "Esta doctrina enseña que Dios el Padre es un hombre exaltado y glorificado que progresó a Su actual estatus divino, y los mormones fieles pueden similarmente progresar hacia la exaltación."
  },
  {
    "textEn": "6. According to this unit, historic Mormon teaching held that Jesus and Lucifer were:",
    "textEs": "6. Según esta unidad, la enseñanza mormona histórica sostuvo que Jesús y Lucifer eran:",
    "optionsEn": [
      "Completely unrelated beings",
      "Spirit brothers, both offspring of Heavenly Father",
      "The same being under two names",
      "Enemies from eternity past with no common origin"
    ],
    "optionsEs": [
      "Seres completamente sin relación",
      "Hermanos espirituales, ambos vástagos del Padre Celestial",
      "El mismo ser bajo dos nombres",
      "Enemigos desde la eternidad pasada sin origen común"
    ],
    "c": 57,
    "explEn": "Mormon teaching historically taught Jesus and Lucifer were spirit brothers, both offspring of Heavenly Father, with Jesus chosen as Savior and Lucifer becoming Satan after rejection.",
    "explEs": "La enseñanza mormona históricamente enseñó que Jesús y Lucifer eran hermanos espirituales, ambos vástagos del Padre Celestial, con Jesús elegido como Salvador y Lucifer convirtiéndose en Satanás tras el rechazo."
  },
  {
    "textEn": "7. Mormon theology's highest degree of glory, exaltation in the celestial kingdom, requires:",
    "textEs": "7. El grado más alto de gloria de la teología mormona, la exaltación en el reino celestial, requiere:",
    "optionsEn": [
      "Faith in Christ alone, apart from works",
      "Nothing at all; it is automatic for everyone",
      "Temple ordinances, priesthood authority, and enduring faithfulness to LDS teaching",
      "Only a single baptism as an infant"
    ],
    "optionsEs": [
      "Fe en Cristo sola, aparte de obras",
      "Nada en absoluto; es automático para todos",
      "Ordenanzas del templo, autoridad sacerdotal, y fidelidad perdurante a la enseñanza SUD",
      "Solo un único bautismo cuando bebé"
    ],
    "c": 65,
    "explEn": "Exaltation requires not merely faith in Christ but temple ordinances, priesthood authority, and enduring faithfulness — salvation substantially dependent on works rather than faith alone.",
    "explEs": "La exaltación requiere no meramente fe en Cristo sino ordenanzas del templo, autoridad sacerdotal, y fidelidad perdurante — una salvación sustancialmente dependiente de las obras en lugar de la fe sola."
  },
  {
    "textEn": "8. The Jehovah's Witnesses trace their origin to Charles Taze Russell's Bible study movement, which grew into:",
    "textEs": "8. Los Testigos de Jehová rastrean su origen al movimiento de estudio bíblico de Charles Taze Russell, que creció hasta convertirse en:",
    "optionsEn": [
      "The Church of Jesus Christ of Latter-day Saints",
      "The Baha'i Faith",
      "The Church of England",
      "The Watch Tower Bible and Tract Society"
    ],
    "optionsEs": [
      "La Iglesia de Jesucristo de los Santos de los Últimos Días",
      "La Fe Baha'i",
      "La Iglesia de Inglaterra",
      "La Sociedad Watchtower de Biblias y Tratados"
    ],
    "c": 73,
    "explEn": "Russell's Bible study movement, begun in Pennsylvania in the 1870s, grew into the Watch Tower Bible and Tract Society.",
    "explEs": "El movimiento de estudio bíblico de Russell, comenzado en Pensilvania en la década de 1870, creció hasta convertirse en la Sociedad Watchtower de Biblias y Tratados."
  },
  {
    "textEn": "9. Jehovah's Witness theology identifies Jesus specifically as:",
    "textEs": "9. La teología de los Testigos de Jehová identifica a Jesús específicamente como:",
    "optionsEn": [
      "Michael the Archangel, a created being",
      "The eternal, uncreated Son of God",
      "A spirit brother of the Holy Spirit",
      "Identical in person to Jehovah"
    ],
    "optionsEs": [
      "Miguel el Arcángel, un ser creado",
      "El Hijo eterno e increado de Dios",
      "Un hermano espiritual del Espíritu Santo",
      "Idéntico en persona a Jehová"
    ],
    "c": 77,
    "explEn": "Jehovah's Witnesses teach that Jesus is a created being, identified specifically as Michael the Archangel, the first and greatest of God's created spirit beings.",
    "explEs": "Los Testigos de Jehová enseñan que Jesús es un ser creado, identificado específicamente como Miguel el Arcángel, el primero y más grande de los seres espirituales creados por Dios."
  },
  {
    "textEn": "10. The New World Translation renders John 1:1 as 'the Word was a god' rather than 'the Word was God,' a translation this unit describes as:",
    "textEs": "10. La Traducción del Nuevo Mundo traduce Juan 1:1 como 'el Verbo era un dios' en lugar de 'el Verbo era Dios,' una traducción que esta unidad describe como:",
    "optionsEn": [
      "Universally accepted by Greek scholars",
      "Not grammatically justified according to virtually all recognized Greek scholars outside Watch Tower",
      "The only possible translation of the Greek text",
      "Identical to how most Bible translations render the verse"
    ],
    "optionsEs": [
      "Universalmente aceptada por eruditos griegos",
      "No justificada gramaticalmente según virtualmente todos los eruditos griegos reconocidos fuera de Watchtower",
      "La única traducción posible del texto griego",
      "Idéntica a como la mayoría de las traducciones bíblicas traducen el versículo"
    ],
    "c": 85,
    "explEn": "This translation choice is one virtually no recognized Greek scholar outside the Watch Tower organization accepts as grammatically justified.",
    "explEs": "Esta elección de traducción es una que virtualmente ningún erudito griego reconocido fuera de la organización Watchtower acepta como gramaticalmente justificada."
  },
  {
    "textEn": "11. Jehovah's Witness doctrine reserves heavenly existence and rule with Christ for a limited class of how many, taken from Revelation?",
    "textEs": "11. La doctrina de los Testigos de Jehová reserva la existencia celestial y el gobierno con Cristo para una clase limitada de cuántos, tomados de Apocalipsis?",
    "optionsEn": [
      "12",
      "1 million",
      "144,000",
      "An unlimited number"
    ],
    "optionsEs": [
      "12",
      "1 millón",
      "144,000",
      "Un número ilimitado"
    ],
    "c": 93,
    "explEn": "Jehovah's Witnesses reserve heavenly existence for a limited class of 144,000, taken literally from Revelation 7 and 14, while most believers hope for a restored paradise earth.",
    "explEs": "Los Testigos de Jehová reservan la existencia celestial para una clase limitada de 144,000, tomados literalmente de Apocalipsis 7 y 14, mientras que la mayoría de los creyentes esperan una tierra paraíso restaurada."
  },
  {
    "textEn": "12. Regarding hell, Jehovah's Witnesses teach:",
    "textEs": "12. Respecto al infierno, los Testigos de Jehová enseñan:",
    "optionsEn": [
      "Eternal conscious punishment for the wicked",
      "Universal salvation for everyone without exception",
      "A second chance after death for all people",
      "Complete annihilation of the wicked rather than eternal conscious punishment"
    ],
    "optionsEs": [
      "Castigo consciente eterno para los malvados",
      "Salvación universal para todos sin excepción",
      "Una segunda oportunidad después de la muerte para todas las personas",
      "La aniquilación completa de los malvados en lugar del castigo consciente eterno"
    ],
    "c": 101,
    "explEn": "Jehovah's Witnesses reject eternal conscious punishment, teaching instead the complete annihilation of the wicked.",
    "explEs": "Los Testigos de Jehová rechazan el castigo consciente eterno, enseñando en cambio la aniquilación completa de los malvados."
  },
  {
    "textEn": "13. The Baha'i Faith traces its origin to nineteenth-century Persia and a man known as the Bab, meaning:",
    "textEs": "13. La Fe Baha'i rastrea su origen a la Persia del siglo diecinueve y a un hombre conocido como el Báb, que significa:",
    "optionsEn": [
      "The Gate",
      "The Glory of God",
      "The Final Prophet",
      "The Messenger of Peace"
    ],
    "optionsEs": [
      "La Puerta",
      "La Gloria de Dios",
      "El Profeta Final",
      "El Mensajero de Paz"
    ],
    "c": 105,
    "explEn": "The Bab, meaning 'the Gate,' announced himself in 1844 as the forerunner of a greater prophet soon to come.",
    "explEs": "El Báb, que significa 'la Puerta,' se anunció a sí mismo en 1844 como el precursor de un profeta mayor pronto por venir."
  },
  {
    "textEn": "14. Baha'u'llah, meaning 'the Glory of God,' announced in 1863 that he was:",
    "textEs": "14. Baha'u'llah, que significa 'la Gloria de Dios,' anunció en 1863 que él era:",
    "optionsEn": [
      "The reincarnation of the Bab",
      "The promised messenger the Bab had foretold",
      "A Christian missionary",
      "An enemy of the Bab's teaching"
    ],
    "optionsEs": [
      "La reencarnación del Báb",
      "El mensajero prometido que el Báb había predicho",
      "Un misionero cristiano",
      "Un enemigo de la enseñanza del Báb"
    ],
    "c": 113,
    "explEn": "Baha'u'llah announced in 1863 that he was the promised messenger the Bab had foretold, and his teaching forms the foundation of the Baha'i Faith today.",
    "explEs": "Baha'u'llah anunció en 1863 que él era el mensajero prometido que el Báb había predicho, y su enseñanza forma el fundamento de la Fe Baha'i hoy."
  },
  {
    "textEn": "15. The Baha'i doctrine of progressive revelation holds that God has sent a series of Messengers including Abraham, Moses, Buddha, Jesus, Muhammad, and:",
    "textEs": "15. La doctrina Baha'i de la revelación progresiva sostiene que Dios ha enviado una serie de Mensajeros incluyendo a Abraham, Moisés, Buda, Jesús, Mahoma, y:",
    "optionsEn": [
      "Confucius only",
      "No one after Muhammad",
      "Baha'u'llah, the most recent and complete for the present age",
      "Guru Nanak exclusively"
    ],
    "optionsEs": [
      "Solo a Confucio",
      "A nadie después de Mahoma",
      "Baha'u'llah, el más reciente y completo para la era presente",
      "Exclusivamente al Gurú Nanak"
    ],
    "c": 121,
    "explEn": "Baha'i teaching holds Baha'u'llah is the most recent and, for the present age, most complete of God's Messengers, superseding without contradicting earlier ones.",
    "explEs": "La enseñanza Baha'i sostiene que Baha'u'llah es el más reciente y, para la era presente, más completo de los Mensajeros de Dios, sustituyendo sin contradecir a los anteriores."
  },
  {
    "textEn": "16. According to Hebrews 1:1-3, cited in this unit, how does Scripture present Christ in contrast to Baha'i progressive revelation?",
    "textEs": "16. Según Hebreos 1:1-3, citado en esta unidad, ¿cómo presenta la Escritura a Cristo en contraste con la revelación progresiva Baha'i?",
    "optionsEn": [
      "As one voice among a continuing sequence of equal messengers",
      "As inferior to Muhammad",
      "As merely a human teacher with no special status",
      "As God's final word, not one prophet among a series of successors"
    ],
    "optionsEs": [
      "Como una voz entre una secuencia continua de mensajeros iguales",
      "Como inferior a Mahoma",
      "Como meramente un maestro humano sin estatus especial",
      "Como la palabra final de Dios, no un profeta entre una serie de sucesores"
    ],
    "c": 129,
    "explEn": "Hebrews 1:1-3 presents Christ as God's final word, the brightness of His glory, not one true prophet among a series of equally authorized successors as progressive revelation implies.",
    "explEs": "Hebreos 1:1-3 presenta a Cristo como la palabra final de Dios, el resplandor de Su gloria, no un verdadero profeta entre una serie de sucesores igualmente autorizados como implica la revelación progresiva."
  },
  {
    "textEn": "17. This unit's central pastoral method for engaging these movements, modeled on Acts 17:11, is to:",
    "textEs": "17. El método pastoral central de esta unidad para relacionarse con estos movimientos, modelado en Hechos 17:11, es:",
    "optionsEn": [
      "Return again and again to what Scripture itself actually says",
      "Avoid all conversation with adherents entirely",
      "Accept each movement's additional authority as equally valid",
      "Focus exclusively on winning arguments rather than persuasion"
    ],
    "optionsEs": [
      "Regresar una y otra vez a lo que la Escritura misma realmente dice",
      "Evitar por completo toda conversación con los adherentes",
      "Aceptar la autoridad adicional de cada movimiento como igualmente válida",
      "Enfocarse exclusivamente en ganar argumentos en lugar de persuadir"
    ],
    "c": 133,
    "explEn": "Following the Bereans' example of searching the Scriptures daily, this unit's method is to return again and again to what Scripture itself actually says, tested against each movement's additional authority.",
    "explEs": "Siguiendo el ejemplo de los bereanos de escudriñar las Escrituras diariamente, el método de esta unidad es regresar una y otra vez a lo que la Escritura misma realmente dice, probado contra la autoridad adicional de cada movimiento."
  },
  {
    "textEn": "18. For Jehovah's Witness conversations, this unit suggests using Thomas's confession in John 20:28 because:",
    "textEs": "18. Para conversaciones con Testigos de Jehová, esta unidad sugiere usar la confesión de Tomás en Juan 20:28 porque:",
    "optionsEn": [
      "Jesus corrected Thomas for calling Him God",
      "The risen Jesus received the confession 'My Lord and my God' without correction",
      "Thomas was speaking about the Father, not Jesus",
      "This verse does not appear in the New World Translation"
    ],
    "optionsEs": [
      "Jesús corrigió a Tomás por llamarlo Dios",
      "El Jesús resucitado recibió la confesión 'Señor mío, y Dios mío' sin corrección",
      "Tomás hablaba acerca del Padre, no de Jesús",
      "Este versículo no aparece en la Traducción del Nuevo Mundo"
    ],
    "c": 141,
    "explEn": "Thomas's confession 'My Lord and my God' was received without correction by the risen Jesus, a text Jehovah's Witness theology struggles to explain away.",
    "explEs": "La confesión de Tomás 'Señor mío, y Dios mío' fue recibida sin corrección por el Jesús resucitado, un texto que la teología de los Testigos de Jehová lucha por explicar."
  },
  {
    "textEn": "19. According to this unit, what should a pastor honestly acknowledge about Mormon and Jehovah's Witness adherents, unlike most traditions studied in Units 4-7?",
    "textEs": "19. Según esta unidad, ¿qué debe reconocer honestamente un pastor acerca de los adherentes mormones y Testigos de Jehová, a diferencia de la mayoría de las tradiciones estudiadas en las Unidades 4-7?",
    "optionsEn": [
      "They have no moral seriousness at all",
      "They reject all forms of family life",
      "They often display genuine moral seriousness, family devotion, and evangelistic zeal using biblical vocabulary",
      "They never attempt to evangelize others"
    ],
    "optionsEs": [
      "No tienen ninguna seriedad moral en absoluto",
      "Rechazan todas las formas de vida familiar",
      "A menudo muestran seriedad moral genuina, devoción familiar, y celo evangelístico usando vocabulario bíblico",
      "Nunca intentan evangelizar a otros"
    ],
    "c": 149,
    "explEn": "These movements use biblical vocabulary and often display genuine moral seriousness, family devotion, and evangelistic zeal a pastor can honestly acknowledge.",
    "explEs": "Estos movimientos usan vocabulario bíblico y a menudo muestran seriedad moral genuina, devoción familiar, y celo evangelístico que un pastor puede reconocer honestamente."
  },
  {
    "textEn": "20. According to this unit's conclusion, the goal in engaging these movements is to help a sincere person see that:",
    "textEs": "20. Según la conclusión de esta unidad, la meta al relacionarse con estos movimientos es ayudar a una persona sincera a ver que:",
    "optionsEn": [
      "Their movement's Jesus matches the New Testament exactly",
      "All religious claims are equally valid",
      "Winning the argument is the only goal",
      "The New Testament Jesus makes exclusive claims their movement's framework was built to soften"
    ],
    "optionsEs": [
      "El Jesús de su movimiento coincide exactamente con el Nuevo Testamento",
      "Todas las afirmaciones religiosas son igualmente válidas",
      "Ganar el argumento es la única meta",
      "El Jesús del Nuevo Testamento hace afirmaciones exclusivas que el marco de su movimiento fue construido para suavizar"
    ],
    "c": 157,
    "explEn": "The goal is helping a sincere person see that the Jesus of the New Testament, read on its own terms, makes exactly the exclusive claims their movement's framework was built to soften or reinterpret.",
    "explEs": "La meta es ayudar a una persona sincera a ver que el Jesús del Nuevo Testamento, leído en sus propios términos, hace exactamente las afirmaciones exclusivas que el marco de su movimiento fue construido para suavizar o reinterpretar."
  }
];

const kwQuestions = [
  {
    "textEn": "21. Explain why this unit groups Mormonism, Jehovah's Witnesses, and the Baha'i Faith together, and why they are treated in a separate unit from historic Christian denominations.",
    "textEs": "21. Explique por qué esta unidad agrupa al mormonismo, los Testigos de Jehová, y la Fe Baha'i, y por qué se tratan en una unidad separada de las denominaciones cristianas históricas.",
    "kw_en": ["continuing", "revelation", "trinity", "deity", "canon", "closed", "consensus", "outside"],
    "kw_es": ["continua", "revelación", "trinidad", "deidad", "canon", "cerrado", "consenso", "fuera"],
    "modelEn": "All three movements claim continuing or completed revelation beyond the Bible as historic Christianity received it, and each rejects at least one of three settled convictions historic Christianity has held since the ecumenical councils: the full deity of Christ, the Trinity, or the sufficiency and closed nature of the canon. This is why classical Christian theology classifies them, on these specific points, as standing outside the Christian family rather than as denominations within it.",
    "modelEs": "Los tres movimientos afirman revelación continua o completada más allá de la Biblia tal como el cristianismo histórico la recibió, y cada uno rechaza al menos una de tres convicciones establecidas que el cristianismo histórico ha sostenido desde los concilios ecuménicos: la plena deidad de Cristo, la Trinidad, o la suficiencia y naturaleza cerrada del canon. Esto es por qué la teología cristiana clásica los clasifica, en estos puntos específicos, como fuera de la familia cristiana en lugar de como denominaciones dentro de ella."
  },
  {
    "textEn": "22. Describe the origin of Mormonism through Joseph Smith, and explain the doctrine of total apostasy central to Mormon claims.",
    "textEs": "22. Describa el origen del mormonismo a través de José Smith, y explique la doctrina de apostasía total central a las afirmaciones mormonas.",
    "kw_en": ["joseph smith", "1820", "moroni", "golden plates", "book of mormon", "apostasy", "restoration", "priesthood"],
    "kw_es": ["josé smith", "1820", "moroni", "planchas de oro", "libro de mormón", "apostasía", "restauración", "sacerdocio"],
    "modelEn": "Joseph Smith reported visions beginning in 1820, including a visit from the angel Moroni leading him to golden plates he translated as the Book of Mormon. Smith taught the true church fell into complete apostasy after the apostolic age and that his ministry restored true priesthood authority and correct doctrine, positioning Mormonism as the sole legitimate continuation of Christianity rather than a new religion alongside it.",
    "modelEs": "José Smith reportó visiones que comenzaron en 1820, incluyendo una visita del ángel Moroni que lo llevó a planchas de oro que tradujo como el Libro de Mormón. Smith enseñó que la verdadera iglesia cayó en apostasía completa después de la era apostólica y que su ministerio restauró la verdadera autoridad sacerdotal y la doctrina correcta, posicionando al mormonismo como la única continuación legítima del cristianismo en lugar de una nueva religión junto a él."
  },
  {
    "textEn": "23. Explain Mormon teaching regarding the nature of God the Father and how this differs from the biblical doctrine cited in Psalm 90:2.",
    "textEs": "23. Explique la enseñanza mormona respecto a la naturaleza de Dios el Padre y en qué difiere de la doctrina bíblica citada en el Salmo 90:2.",
    "kw_en": ["exalted", "progressed", "physical body", "couplet", "eternal", "always existed", "without beginning", "differ"],
    "kw_es": ["exaltado", "progres", "cuerpo físico", "pareado", "eterno", "siempre existido", "sin principio", "difier"],
    "modelEn": "Mormon teaching holds that God the Father is an exalted, glorified man who progressed to His current divine status and possesses a physical body, captured in the couplet 'as man now is, God once was.' This differs fundamentally from Psalm 90:2's teaching that God has always existed as God, eternally and without beginning, with no progression from a lesser state.",
    "modelEs": "La enseñanza mormona sostiene que Dios el Padre es un hombre exaltado y glorificado que progresó a Su actual estatus divino y posee un cuerpo físico, capturado en el pareado 'como el hombre es ahora, Dios una vez fue.' Esto difiere fundamentalmente de la enseñanza del Salmo 90:2 de que Dios siempre ha existido como Dios, eternamente y sin principio, sin progresión desde un estado inferior."
  },
  {
    "textEn": "24. Describe the organizational structure of Jehovah's Witnesses and explain their central denial regarding the Trinity and the deity of Christ.",
    "textEs": "24. Describa la estructura organizacional de los Testigos de Jehová y explique su negación central respecto a la Trinidad y la deidad de Cristo.",
    "kw_en": ["watch tower", "governing body", "brooklyn", "trinity", "michael", "archangel", "created", "deny"],
    "kw_es": ["watchtower", "cuerpo gobernante", "brooklyn", "trinidad", "miguel", "arcángel", "creado", "nieg"],
    "modelEn": "Jehovah's Witnesses are governed by the Watch Tower Bible and Tract Society, with doctrine flowing from the Governing Body in Brooklyn with a high degree of centralized control. They deny the Trinity outright, teaching Jehovah alone is the one true God and that Jesus is a created being, identified as Michael the Archangel, contradicting texts like Colossians 2:9's declaration that the fullness of the Godhead dwells in Christ bodily.",
    "modelEs": "Los Testigos de Jehová son gobernados por la Sociedad Watchtower de Biblias y Tratados, con la doctrina fluyendo del Cuerpo Gobernante en Brooklyn con un alto grado de control centralizado. Niegan la Trinidad rotundamente, enseñando que Jehová solo es el único Dios verdadero y que Jesús es un ser creado, identificado como Miguel el Arcángel, contradiciendo textos como Colosenses 2:9, que declara que la plenitud de la Deidad habita en Cristo corporalmente."
  },
  {
    "textEn": "25. Describe Jehovah's Witness teaching on the afterlife, including soul sleep, the 144,000, and the doctrine of hell.",
    "textEs": "25. Describa la enseñanza de los Testigos de Jehová acerca de la vida después de la muerte, incluyendo el sueño del alma, los 144,000, y la doctrina del infierno.",
    "kw_en": ["soul sleep", "144,000", "paradise earth", "heavenly", "annihilation", "eternal punishment", "revelation", "reject"],
    "kw_es": ["sueño del alma", "144,000", "tierra paraíso", "celestial", "aniquilación", "castigo eterno", "apocalipsis", "rechaz"],
    "modelEn": "Jehovah's Witnesses deny conscious existence after death, teaching soul sleep followed by resurrection to a restored paradise earth for most believers, while reserving heavenly rule with Christ for a limited class of 144,000 taken literally from Revelation. They reject eternal conscious punishment, teaching instead the complete annihilation of the wicked.",
    "modelEs": "Los Testigos de Jehová niegan la existencia consciente después de la muerte, enseñando el sueño del alma seguido de resurrección a una tierra paraíso restaurada para la mayoría de los creyentes, mientras reservan el gobierno celestial con Cristo para una clase limitada de 144,000 tomados literalmente de Apocalipsis. Rechazan el castigo consciente eterno, enseñando en cambio la aniquilación completa de los malvados."
  },
  {
    "textEn": "26. Trace the origin of the Baha'i Faith from the Bab through Baha'u'llah.",
    "textEs": "26. Rastree el origen de la Fe Baha'i desde el Báb hasta Baha'u'llah.",
    "kw_en": ["bab", "gate", "1844", "forerunner", "executed", "baha'u'llah", "glory of god", "1863"],
    "kw_es": ["báb", "puerta", "1844", "precursor", "ejecutado", "baha'u'llah", "gloria de dios", "1863"],
    "modelEn": "The Baha'i Faith traces its origin to nineteenth-century Persia and the Bab, 'the Gate,' who announced himself in 1844 as forerunner of a greater prophet and was executed in 1850. His follower Mirza Husayn Ali, later Baha'u'llah, 'the Glory of God,' announced in 1863 that he was the promised messenger the Bab had foretold, and his teaching forms the foundation of the Baha'i Faith today.",
    "modelEs": "La Fe Baha'i rastrea su origen a la Persia del siglo diecinueve y al Báb, 'la Puerta,' quien se anunció a sí mismo en 1844 como precursor de un profeta mayor y fue ejecutado en 1850. Su seguidor Mirza Husayn Ali, luego Baha'u'llah, 'la Gloria de Dios,' anunció en 1863 que él era el mensajero prometido que el Báb había predicho, y su enseñanza forma el fundamento de la Fe Baha'i hoy."
  },
  {
    "textEn": "27. Explain the Baha'i doctrine of progressive revelation and why this unit says it conflicts with Hebrews 1:1-3's picture of Christ.",
    "textEs": "27. Explique la doctrina Baha'i de la revelación progresiva y por qué dice esta unidad que entra en conflicto con el cuadro de Cristo en Hebreos 1:1-3.",
    "kw_en": ["progressive revelation", "messengers", "portion", "supersede", "final word", "one among many", "hebrews", "brightness"],
    "kw_es": ["revelación progresiva", "mensajeros", "porción", "sustitu", "palabra final", "uno entre muchos", "hebreos", "resplandor"],
    "modelEn": "Progressive revelation holds God sent a series of Messengers, each bringing a portion of truth suited to their age, with Baha'u'llah the most recent and complete, superseding without contradicting Jesus and others. This conflicts with Hebrews 1:1-3, which presents Christ as the brightness of God's glory and His final word, not one true prophet among a series of equally authorized successors as progressive revelation implies.",
    "modelEs": "La revelación progresiva sostiene que Dios envió una serie de Mensajeros, cada uno trayendo una porción de verdad adecuada a su era, con Baha'u'llah el más reciente y completo, sustituyendo sin contradecir a Jesús y otros. Esto entra en conflicto con Hebreos 1:1-3, que presenta a Cristo como el resplandor de la gloria de Dios y Su palabra final, no un verdadero profeta entre una serie de sucesores igualmente autorizados como implica la revelación progresiva."
  },
  {
    "textEn": "28. According to this unit, what adjustment should a pastor make when engaging Mormon or Jehovah's Witness neighbors, compared to the traditions studied in Units 4-7?",
    "textEs": "28. Según esta unidad, ¿qué ajuste debe hacer un pastor al relacionarse con vecinos mormones o Testigos de Jehová, comparado con las tradiciones estudiadas en las Unidades 4-7?",
    "kw_en": ["biblical vocabulary", "acknowledge", "moral seriousness", "zeal", "model", "familiar words", "meaning", "listen"],
    "kw_es": ["vocabulario bíblico", "reconoc", "seriedad moral", "celo", "modelo", "palabras familiares", "significado", "escuch"],
    "modelEn": "Unlike traditions studied earlier, these movements use biblical vocabulary and often display genuine moral seriousness, family devotion, and evangelistic zeal a pastor can honestly acknowledge, even holding up as a model. A pastor must listen with particular care to what familiar words like God, Jesus, and salvation actually mean within each system, since vocabulary often stays the same while meaning changes entirely.",
    "modelEs": "A diferencia de las tradiciones estudiadas anteriormente, estos movimientos usan vocabulario bíblico y a menudo muestran seriedad moral genuina, devoción familiar, y celo evangelístico que un pastor puede reconocer honestamente, incluso sosteniéndolo como modelo. Un pastor debe escuchar con cuidado particular lo que palabras familiares como Dios, Jesús, y salvación realmente significan dentro de cada sistema, ya que el vocabulario a menudo permanece igual mientras el significado cambia por completo."
  },
  {
    "textEn": "29. Describe this unit's Berean method from Acts 17:11 and give one specific example of a text this unit suggests using with Jehovah's Witnesses.",
    "textEs": "29. Describa el método bereano de esta unidad tomado de Hechos 17:11 y dé un ejemplo específico de un texto que sugiere esta unidad usar con los Testigos de Jehová.",
    "kw_en": ["bereans", "search", "daily", "return", "thomas", "john 20:28", "titus 2:13", "confession"],
    "kw_es": ["bereanos", "escudriñ", "diariamente", "regres", "tomás", "juan 20:28", "tito 2:13", "confesión"],
    "modelEn": "The Berean method, from Acts 17:11, means returning again and again to what Scripture itself actually says, tested against any additional authority a movement has added. For Jehovah's Witnesses, this unit suggests Thomas's confession 'My Lord and my God' in John 20:28, received without correction by the risen Jesus, or Titus 2:13's description of 'our great God and Savior Jesus Christ' as one Person.",
    "modelEs": "El método bereano, de Hechos 17:11, significa regresar una y otra vez a lo que la Escritura misma realmente dice, probado contra cualquier autoridad adicional que un movimiento haya añadido. Para los Testigos de Jehová, esta unidad sugiere la confesión de Tomás 'Señor mío, y Dios mío' en Juan 20:28, recibida sin corrección por el Jesús resucitado, o la descripción de Tito 2:13 de 'nuestro gran Dios y Salvador Jesucristo' como una sola Persona."
  },
  {
    "textEn": "30. Synthesize this unit: using John 14:6, explain the specific pastoral approach suggested for Baha'i friends, and what ultimate goal governs conversation with all three movements studied in this unit.",
    "textEs": "30. Sintetice esta unidad: usando Juan 14:6, explique el enfoque pastoral específico sugerido para amigos Baha'i, y qué meta última gobierna la conversación con los tres movimientos estudiados en esta unidad.",
    "kw_en": ["affirm", "respect", "unity", "exclusive claims", "way truth life", "accommodate", "sincere", "soften"],
    "kw_es": ["afirm", "respet", "unidad", "afirmaciones exclusivas", "camino verdad vida", "acomod", "sincer", "suaviz"],
    "modelEn": "For Baha'i friends, a pastor should affirm genuine respect for their sincere desire for religious unity and peace while pressing Jesus's specific, exclusive claims in John 14:6, 'I am the way, the truth, and the life; no one comes to the Father except through Me,' which a one-Messenger-among-many framework cannot accommodate. The ultimate goal across all three movements is helping sincere, devoted people see that the New Testament Jesus, on His own terms, makes exactly the exclusive claims their movement's framework was built to soften or reinterpret.",
    "modelEs": "Para amigos Baha'i, un pastor debe afirmar respeto genuino por su deseo sincero de unidad religiosa y paz mientras presiona las afirmaciones específicas y exclusivas de Jesús en Juan 14:6, 'Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí,' que un marco de un-Mensajero-entre-muchos no puede acomodar. La meta última a través de los tres movimientos es ayudar a personas sinceras y devotas a ver que el Jesús del Nuevo Testamento, en Sus propios términos, hace exactamente las afirmaciones exclusivas que el marco de su movimiento fue construido para suavizar o reinterpretar."
  }
];

const PREV_HREF = 'CTSWRUnit7.html';

const NEXT_HREF = 'CTSWRUnit9.html';
