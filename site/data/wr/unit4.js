/* CTSWR - unit 4: per-unit configuration and content. */

const UNIT = 4;

let currentUnit = 4;

const mcQuestions = [
  {
    "textEn": "1. Unlike Judaism and Islam, this unit notes that Hinduism has:",
    "textEs": "1. A diferencia del judaísmo y el islam, esta unidad señala que el hinduismo tiene:",
    "optionsEn": [
      "No founder, no single sacred text, and no central authority",
      "A single founder and fixed creed",
      "The same historical origin as Christianity",
      "A single central text like the Qur'an"
    ],
    "optionsEs": [
      "Ningún fundador, ningún texto sagrado único, y ninguna autoridad central",
      "Un solo fundador y credo fijo",
      "El mismo origen histórico que el cristianismo",
      "Un solo texto central como el Corán"
    ],
    "c": 21,
    "explEn": "Hinduism developed over a long historical arc from ancient Vedic traditions through later centuries, with no single founder, no single sacred text, no central authority, and no fixed creed.",
    "explEs": "El hinduismo se desarrolló a lo largo de un extenso arco histórico desde antiguas tradiciones védicas hasta siglos posteriores, sin un solo fundador, sin un solo texto sagrado, sin autoridad central, y sin credo fijo."
  },
  {
    "textEn": "2. Many Hindus prefer to describe their own tradition using the term:",
    "textEs": "2. Muchos hindúes prefieren describir su propia tradición usando el término:",
    "optionsEn": [
      "Sunnah",
      "Sanatana Dharma",
      "Talmud",
      "Shahada"
    ],
    "optionsEs": [
      "Sunna",
      "Sanatana Dharma",
      "Talmud",
      "Shahada"
    ],
    "c": 29,
    "explEn": "Many Hindus describe their tradition as Sanatana Dharma, the 'eternal law' or 'eternal way,' signaling it is not thought of as founded at a single historical moment.",
    "explEs": "Muchos hindúes describen su tradición como Sanatana Dharma, la 'ley eterna' o 'camino eterno,' señalando que no se piensa como fundada en un solo momento histórico."
  },
  {
    "textEn": "3. The earliest of the Vedas, containing hymns to deities associated with natural forces, is the:",
    "textEs": "3. El más antiguo de los Vedas, que contiene himnos a deidades asociadas con fuerzas naturales, es el:",
    "optionsEn": [
      "Upanishads",
      "Bhagavad Gita",
      "Rigveda",
      "Mahabharata"
    ],
    "optionsEs": [
      "Los Upanishads",
      "El Bhagavad Gita",
      "El Rigveda",
      "El Mahabharata"
    ],
    "c": 37,
    "explEn": "The Rigveda is the earliest of the Vedas, a large collection of hymns to deities associated with fire, storm, sun, and the sacred drink soma.",
    "explEs": "El Rigveda es el más antiguo de los Vedas, una gran colección de himnos a deidades asociadas con el fuego, la tormenta, el sol y la bebida sagrada soma."
  },
  {
    "textEn": "4. The traditional caste system divided society into broad categories including Brahmins, Kshatriyas, Vaishyas, and:",
    "textEs": "4. El sistema tradicional de castas dividía a la sociedad en amplias categorías que incluían brahmanes, chatrías, vaisias, y:",
    "optionsEn": [
      "Sufis",
      "Levites",
      "Pharisees",
      "Shudras"
    ],
    "optionsEs": [
      "Sufíes",
      "Levitas",
      "Fariseos",
      "Sudras"
    ],
    "c": 45,
    "explEn": "The caste system's four broad categories were Brahmins (priests), Kshatriyas (warriors), Vaishyas (merchants), and Shudras (laborers).",
    "explEs": "Las cuatro amplias categorías del sistema de castas eran brahmanes (sacerdotes), chatrías (guerreros), vaisias (comerciantes) y sudras (trabajadores)."
  },
  {
    "textEn": "5. Brahman, in the most philosophically developed strands of Hindu thought, refers to:",
    "textEs": "5. Brahman, en las corrientes más desarrolladas filosóficamente del pensamiento hindú, se refiere a:",
    "optionsEn": [
      "The single, ultimate, impersonal reality underlying the universe",
      "A minor local deity",
      "The individual human soul",
      "A specific Hindu temple"
    ],
    "optionsEs": [
      "La única realidad última e impersonal que subyace al universo",
      "Una deidad local menor",
      "El alma humana individual",
      "Un templo hindú específico"
    ],
    "c": 49,
    "explEn": "Brahman refers to the single, ultimate, impersonal reality underlying and pervading the entire universe, the ground of being itself.",
    "explEs": "Brahman se refiere a la única realidad última e impersonal que subyace y permea todo el universo, el fundamento del ser mismo."
  },
  {
    "textEn": "6. The school of Hindu thought called Advaita Vedanta teaches that Atman and Brahman are:",
    "textEs": "6. La escuela del pensamiento hindú llamada Advaita Vedanta enseña que Atman y Brahman son:",
    "optionsEn": [
      "Two entirely separate and opposed realities",
      "Not two things at all, but one",
      "Both created by Vishnu",
      "Concepts found only in Buddhism"
    ],
    "optionsEs": [
      "Dos realidades completamente separadas y opuestas",
      "No dos cosas en absoluto, sino una",
      "Ambos creados por Vishnu",
      "Conceptos que se encuentran solo en el budismo"
    ],
    "c": 57,
    "explEn": "Advaita Vedanta's central claim is that Atman and Brahman are not two things but one, and that the sense of separateness is the illusion called maya.",
    "explEs": "La afirmación central del Advaita Vedanta es que Atman y Brahman no son dos cosas sino una, y que el sentido de separación es la ilusión llamada maya."
  },
  {
    "textEn": "7. Karma, in its proper Hindu sense, refers to:",
    "textEs": "7. El karma, en su sentido hindú propio, se refiere a:",
    "optionsEn": [
      "A type of temple architecture",
      "A festival celebrated once a year",
      "The moral law of cause and effect governing all action",
      "The Hindu term for a priest"
    ],
    "optionsEs": [
      "Un tipo de arquitectura de templo",
      "Un festival celebrado una vez al año",
      "La ley moral de causa y efecto que gobierna toda acción",
      "El término hindú para un sacerdote"
    ],
    "c": 65,
    "explEn": "Karma refers to the moral law of cause and effect: every deed generates consequences that must eventually be experienced by the one who performed it.",
    "explEs": "El karma se refiere a la ley moral de causa y efecto: todo hecho genera consecuencias que eventualmente deben ser experimentadas por quien lo realizó."
  },
  {
    "textEn": "8. Samsara refers to:",
    "textEs": "8. El samsara se refiere a:",
    "optionsEn": [
      "A sacred Hindu text",
      "The Hindu priestly class",
      "A form of Hindu marriage ceremony",
      "The cycle of birth, death, and rebirth"
    ],
    "optionsEs": [
      "Un texto sagrado hindú",
      "La clase sacerdotal hindú",
      "Una forma de ceremonia de matrimonio hindú",
      "El ciclo de nacimiento, muerte y renacimiento"
    ],
    "c": 73,
    "explEn": "Samsara is the cycle of birth, death, and rebirth through which every soul passes, its circumstances determined by accumulated karma.",
    "explEs": "El samsara es el ciclo de nacimiento, muerte y renacimiento por el cual pasa toda alma, sus circunstancias determinadas por el karma acumulado."
  },
  {
    "textEn": "9. Moksha is best defined as:",
    "textEs": "9. El moksha se define mejor como:",
    "optionsEn": [
      "Liberation from the entire cycle of rebirth",
      "A better rebirth in the next life",
      "The Hindu New Year festival",
      "A form of ritual sacrifice"
    ],
    "optionsEs": [
      "Liberación de todo el ciclo de renacimiento",
      "Un mejor renacimiento en la próxima vida",
      "El festival de Año Nuevo hindú",
      "Una forma de sacrificio ritual"
    ],
    "c": 77,
    "explEn": "Moksha is liberation from the entire cycle of samsara — not a better rebirth, but escape from rebirth altogether.",
    "explEs": "El moksha es la liberación de todo el ciclo del samsara — no un mejor renacimiento, sino escapar del renacimiento por completo."
  },
  {
    "textEn": "10. The Trimurti names Brahma the creator, Vishnu the preserver, and:",
    "textEs": "10. El Trimurti nombra a Brahma el creador, Vishnu el preservador, y:",
    "optionsEn": [
      "Krishna the warrior",
      "Shiva the destroyer",
      "Rama the king",
      "Ganesha the remover of obstacles"
    ],
    "optionsEs": [
      "Krishna el guerrero",
      "Shiva el destructor",
      "Rama el rey",
      "Ganesha el que remueve obstáculos"
    ],
    "c": 85,
    "explEn": "The Trimurti, or 'three forms,' names Brahma the creator, Vishnu the preserver, and Shiva the destroyer.",
    "explEs": "El Trimurti, o 'tres formas,' nombra a Brahma el creador, Vishnu el preservador, y Shiva el destructor."
  },
  {
    "textEn": "11. According to this unit, most sophisticated Hindu thought regarding the Trimurti is best understood as:",
    "textEs": "11. Según esta unidad, el pensamiento hindú más sofisticado respecto al Trimurti se entiende mejor como:",
    "optionsEn": [
      "Simple polytheism like ancient Canaanite religion",
      "Strict atheism",
      "A form of monism or henotheism wearing many faces",
      "Identical to the Christian Trinity"
    ],
    "optionsEs": [
      "Simple politeísmo como la antigua religión cananea",
      "Ateísmo estricto",
      "Una forma de monismo o henoteísmo con muchos rostros",
      "Idéntico a la Trinidad cristiana"
    ],
    "c": 93,
    "explEn": "Most sophisticated Hindu thought regards the Trimurti as three functions of one ultimate Brahman, closer to monism or henotheism than simple polytheism.",
    "explEs": "El pensamiento hindú más sofisticado considera el Trimurti como tres funciones de un único Brahman último, más cercano al monismo o henoteísmo que al simple politeísmo."
  },
  {
    "textEn": "12. Krishna and Rama are both understood in Hindu tradition as:",
    "textEs": "12. Krishna y Rama son ambos entendidos en la tradición hindú como:",
    "optionsEn": [
      "Historical Christian missionaries",
      "Forms of the goddess Kali",
      "Founders of the caste system",
      "Avatars of Vishnu"
    ],
    "optionsEs": [
      "Misioneros cristianos históricos",
      "Formas de la diosa Kali",
      "Fundadores del sistema de castas",
      "Avatares de Vishnu"
    ],
    "c": 101,
    "explEn": "Krishna and Rama are believed to be avatars, descents of Vishnu to earth during times of crisis to restore cosmic order.",
    "explEs": "Se cree que Krishna y Rama son avatares, descensos de Vishnu a la tierra durante tiempos de crisis para restaurar el orden cósmico."
  },
  {
    "textEn": "13. Bhakti yoga is the path of liberation through:",
    "textEs": "13. El bhakti yoga es el camino de liberación a través de:",
    "optionsEn": [
      "Loving devotion to a personal deity",
      "Philosophical study alone",
      "Selfless action without attachment",
      "Strict caste observance"
    ],
    "optionsEs": [
      "La devoción amorosa a una deidad personal",
      "El estudio filosófico solo",
      "La acción desinteresada sin apego",
      "La estricta observancia de castas"
    ],
    "c": 105,
    "explEn": "Bhakti yoga is the path of devotion, pursuing liberation through loving worship of a personal deity, historically the most widely practiced path.",
    "explEs": "El bhakti yoga es el camino de la devoción, persiguiendo la liberación a través de la adoración amorosa de una deidad personal, históricamente el camino más practicado."
  },
  {
    "textEn": "14. Jnana yoga pursues liberation primarily through:",
    "textEs": "14. El jnana yoga persigue la liberación principalmente a través de:",
    "optionsEn": [
      "Ritual animal sacrifice",
      "Philosophical study and meditation",
      "Pilgrimage to Mecca",
      "Almsgiving alone"
    ],
    "optionsEs": [
      "El sacrificio ritual de animales",
      "El estudio filosófico y la meditación",
      "La peregrinación a La Meca",
      "La limosna sola"
    ],
    "c": 113,
    "explEn": "Jnana yoga is the path of knowledge, pursuing liberation through philosophical study and meditation aimed at realizing the identity of Atman and Brahman.",
    "explEs": "El jnana yoga es el camino del conocimiento, persiguiendo la liberación a través del estudio filosófico y la meditación dirigida a realizar la identidad de Atman y Brahman."
  },
  {
    "textEn": "15. The Shruti texts, considered directly revealed, include the Vedas and the:",
    "textEs": "15. Los textos Shruti, considerados directamente revelados, incluyen los Vedas y los:",
    "optionsEn": [
      "Puranas",
      "Ramayana",
      "Upanishads",
      "Mahabharata"
    ],
    "optionsEs": [
      "Puranas",
      "Ramayana",
      "Upanishads",
      "Mahabharata"
    ],
    "c": 121,
    "explEn": "The Shruti texts, meaning 'that which is heard,' include the four Vedas and the philosophical treatises called the Upanishads.",
    "explEs": "Los textos Shruti, que significa 'lo que se oye,' incluyen los cuatro Vedas y los tratados filosóficos llamados los Upanishads."
  },
  {
    "textEn": "16. The Bhagavad Gita is a philosophical dialogue embedded within which larger epic?",
    "textEs": "16. El Bhagavad Gita es un diálogo filosófico incorporado dentro de cuál épica más grande?",
    "optionsEn": [
      "The Ramayana",
      "The Rigveda",
      "The Upanishads",
      "The Mahabharata"
    ],
    "optionsEs": [
      "El Ramayana",
      "El Rigveda",
      "Los Upanishads",
      "El Mahabharata"
    ],
    "c": 129,
    "explEn": "The Bhagavad Gita is embedded within the Mahabharata, presenting a dialogue between the warrior prince Arjuna and the god Krishna.",
    "explEs": "El Bhagavad Gita está incorporado dentro del Mahabharata, presentando un diálogo entre el príncipe guerrero Arjuna y el dios Krishna."
  },
  {
    "textEn": "17. According to Hebrews 9:27, cited in this unit, human beings are appointed to:",
    "textEs": "17. Según Hebreos 9:27, citado en esta unidad, a los hombres les está establecido:",
    "optionsEn": [
      "Die once, and after this the judgment",
      "Be reborn endlessly until liberation",
      "Achieve moksha through their own merit",
      "Avoid judgment entirely"
    ],
    "optionsEs": [
      "Morir una sola vez, y después de esto el juicio",
      "Renacer sin fin hasta la liberación",
      "Lograr el moksha a través de su propio mérito",
      "Evitar el juicio por completo"
    ],
    "c": 133,
    "explEn": "Hebrews 9:27 says it is appointed for men to die once, but after this the judgment — a linear view of history directly contrasting with Hindu cyclical time.",
    "explEs": "Hebreos 9:27 dice que está establecido para los hombres que mueran una sola vez, y después de esto el juicio — una visión lineal de la historia que contrasta directamente con el tiempo cíclico hindú."
  },
  {
    "textEn": "18. This unit contrasts Christianity's one atoning sacrifice with Hindu thought's approach to liberation, which is generally achieved:",
    "textEs": "18. Esta unidad contrasta el único sacrificio expiatorio del cristianismo con el enfoque del pensamiento hindú hacia la liberación, que generalmente se logra:",
    "optionsEn": [
      "Through a single decisive sacrifice like Christ's",
      "By the self, for the self, through accumulated merit",
      "Only through baptism",
      "Immediately at birth for everyone"
    ],
    "optionsEs": [
      "A través de un único sacrificio decisivo como el de Cristo",
      "Por el yo, para el yo, a través del mérito acumulado",
      "Solo a través del bautismo",
      "Inmediatamente al nacer para todos"
    ],
    "c": 141,
    "explEn": "Hindu thought generally offers moksha achieved by the self, for the self, across countless lives through accumulated merit, rather than received as a gift.",
    "explEs": "El pensamiento hindú generalmente ofrece el moksha logrado por el yo, para el yo, a través de innumerables vidas mediante el mérito acumulado, en lugar de recibido como un regalo."
  },
  {
    "textEn": "19. According to this unit, what genuine common ground can a pastor honor when engaging a Hindu neighbor?",
    "textEs": "19. Según esta unidad, ¿qué terreno común genuino puede honrar un pastor al relacionarse con un vecino hindú?",
    "optionsEn": [
      "Belief that actions have no real consequences",
      "Agreement that all religions teach identical doctrine",
      "Moral seriousness and a genuine hunger for relationship with the divine",
      "Rejection of any spiritual discipline"
    ],
    "optionsEs": [
      "La creencia de que las acciones no tienen consecuencias reales",
      "El acuerdo de que todas las religiones enseñan doctrina idéntica",
      "La seriedad moral y un hambre genuina de relación con lo divino",
      "El rechazo de cualquier disciplina espiritual"
    ],
    "c": 149,
    "explEn": "Hindu tradition's moral seriousness and, especially in bhakti devotion, genuine hunger for personal relationship with the divine offer real common ground.",
    "explEs": "La seriedad moral de la tradición hindú y, especialmente en la devoción bhakti, el hambre genuina de relación personal con lo divino ofrecen un terreno común real."
  },
  {
    "textEn": "20. According to 1 Corinthians 13:12, cited in this unit, the gospel's promise of personal, conscious fellowship with God contrasts with which Hindu concept?",
    "textEs": "20. Según 1 Corintios 13:12, citado en esta unidad, la promesa evangélica de comunión personal y consciente con Dios contrasta con cuál concepto hindú?",
    "optionsEn": [
      "Karma yoga",
      "The caste system",
      "The Trimurti",
      "The dissolution of the individual self into an impersonal absolute"
    ],
    "optionsEs": [
      "El karma yoga",
      "El sistema de castas",
      "El Trimurti",
      "La disolución del yo individual en un absoluto impersonal"
    ],
    "c": 157,
    "explEn": "Where Atman-Brahman identity ultimately dissolves individual selfhood, 1 Corinthians 13:12 promises knowing and being known personally — fellowship, not absorption.",
    "explEs": "Donde la identidad Atman-Brahman finalmente disuelve la identidad individual, 1 Corintios 13:12 promete conocer y ser conocido personalmente — comunión, no absorción."
  }
];

const kwQuestions = [
  {
    "textEn": "21. Why does this unit say Hinduism is 'the hardest religion this course will study to summarize fairly'? What two opposite errors does it warn against?",
    "textEs": "21. ¿Por qué dice esta unidad que el hinduismo es 'la religión más difícil que este curso estudiará para resumir con justicia'? ¿Qué dos errores opuestos advierte?",
    "kw_en": ["diversity", "founder", "flatten", "exotic", "misrepresent", "theology", "internal", "authority"],
    "kw_es": ["diversidad", "fundador", "aplanar", "exótic", "tergivers", "teología", "interna", "autoridad"],
    "modelEn": "Hinduism has no founder, no single sacred text, and no central authority, making it hard to summarize fairly because it contains enormous internal diversity. This unit warns against two opposite errors: Western observers flattening that diversity into a few exotic images, and well-meaning Christians wrongly assuming a religion with many gods must lack serious theology, when in fact sophisticated Hindu philosophical schools exist alongside simple devotional and ritual practice.",
    "modelEs": "El hinduismo no tiene fundador, ni un solo texto sagrado, ni autoridad central, lo que dificulta resumirlo con justicia porque contiene una enorme diversidad interna. Esta unidad advierte contra dos errores opuestos: observadores occidentales que aplanan esa diversidad en unas pocas imágenes exóticas, y cristianos bien intencionados que asumen erróneamente que una religión con muchos dioses debe carecer de teología seria, cuando de hecho existen escuelas filosóficas hindúes sofisticadas junto a la práctica devocional y ritual simple."
  },
  {
    "textEn": "22. Explain the pastoral challenge this unit describes regarding Hindu concepts diffused into secular popular culture, and give the example used.",
    "textEs": "22. Explique el desafío pastoral que describe esta unidad respecto a los conceptos hindúes difundidos en la cultura popular secular, y dé el ejemplo usado.",
    "kw_en": ["karma", "yoga", "meditation", "secular", "detached", "atman", "unnamed", "notice"],
    "kw_es": ["karma", "yoga", "meditación", "secular", "desprend", "atman", "sin nombre", "notar"],
    "modelEn": "This unit explains that Hindu concepts like karma and reincarnation have spread into popular culture detached from their original theology, often marketed as secular practices like meditation for stress relief. The example given is a congregant remarking 'that's just my karma' or taking up meditation rooted in Atman concepts without realizing it draws on a coherent theology different from Scripture. The pastoral challenge is learning to notice these borrowed concepts and address the actual idea rather than just the vocabulary.",
    "modelEs": "Esta unidad explica que conceptos hindúes como el karma y la reencarnación se han extendido en la cultura popular desprendidos de su teología original, a menudo comercializados como prácticas seculares como la meditación para el alivio del estrés. El ejemplo dado es un miembro de la congregación que comenta 'eso es simplemente mi karma' o que emprende una meditación arraigada en conceptos del Atman sin darse cuenta de que se apoya en una teología coherente diferente de la Escritura. El desafío pastoral es aprender a notar estos conceptos prestados y abordar la idea real en lugar de solo el vocabulario."
  },
  {
    "textEn": "23. Define Brahman and Atman, and explain the central claim of Advaita Vedanta regarding their relationship.",
    "textEs": "23. Defina Brahman y Atman, y explique la afirmación central del Advaita Vedanta respecto a su relación.",
    "kw_en": ["brahman", "atman", "ultimate", "soul", "advaita", "identity", "maya", "illusion"],
    "kw_es": ["brahman", "atman", "última", "alma", "advaita", "identidad", "maya", "ilusión"],
    "modelEn": "Brahman is the single, ultimate, impersonal reality underlying and pervading the universe, the ground of being itself. Atman is the individual self or soul. Advaita Vedanta's central claim is that Atman and Brahman are not two things but one in the deepest sense, and that the sense of being a separate self is itself the fundamental illusion, called maya, that keeps a person bound to suffering.",
    "modelEs": "Brahman es la única realidad última e impersonal que subyace y permea el universo, el fundamento del ser mismo. Atman es el yo o alma individual. La afirmación central del Advaita Vedanta es que Atman y Brahman no son dos cosas sino una en el sentido más profundo, y que el sentido de ser un yo separado es en sí mismo la ilusión fundamental, llamada maya, que mantiene a una persona atada al sufrimiento."
  },
  {
    "textEn": "24. Explain how karma and samsara work together in traditional Hindu thought, and what determines a person's circumstances at birth.",
    "textEs": "24. Explique cómo funcionan juntos el karma y el samsara en el pensamiento hindú tradicional, y qué determina las circunstancias de una persona al nacer.",
    "kw_en": ["karma", "samsara", "cause", "effect", "rebirth", "accumulated", "caste", "impersonal"],
    "kw_es": ["karma", "samsara", "causa", "efecto", "renacimiento", "acumulado", "casta", "impersonal"],
    "modelEn": "Karma is the moral law of cause and effect, where every deed generates consequences experienced by the one who performed it. Samsara is the cycle of birth, death, and rebirth through which souls pass, with circumstances in each new birth, including caste, health, and wealth, determined by accumulated karma from previous lives. Traditional Hindu thought understands this as the operation of an impersonal, inescapable law rather than arbitrary injustice.",
    "modelEs": "El karma es la ley moral de causa y efecto, donde todo hecho genera consecuencias experimentadas por quien lo realizó. El samsara es el ciclo de nacimiento, muerte y renacimiento por el cual pasan las almas, con las circunstancias en cada nuevo nacimiento, incluyendo casta, salud y riqueza, determinadas por el karma acumulado de vidas previas. El pensamiento hindú tradicional entiende esto como la operación de una ley impersonal e ineludible en lugar de injusticia arbitraria."
  },
  {
    "textEn": "25. What is the Trimurti, and why does this unit say most sophisticated Hindu thought is not simple polytheism?",
    "textEs": "25. ¿Qué es el Trimurti, y por qué dice esta unidad que el pensamiento hindú más sofisticado no es simple politeísmo?",
    "kw_en": ["trimurti", "brahma", "vishnu", "shiva", "function", "manifestation", "monism", "henotheism"],
    "kw_es": ["trimurti", "brahma", "vishnu", "shiva", "función", "manifestación", "monismo", "henoteísmo"],
    "modelEn": "The Trimurti names Brahma the creator, Vishnu the preserver, and Shiva the destroyer. This unit explains that many Hindus understand these as three functions or manifestations of the one ultimate Brahman rather than three separate competing gods, meaning sophisticated Hindu thought is closer to a form of monism or henotheism wearing many faces than simple polytheism like ancient Canaanite religion.",
    "modelEs": "El Trimurti nombra a Brahma el creador, Vishnu el preservador, y Shiva el destructor. Esta unidad explica que muchos hindúes entienden estos como tres funciones o manifestaciones del único Brahman último en lugar de tres dioses separados y en competencia, lo que significa que el pensamiento hindú sofisticado está más cerca de una forma de monismo o henoteísmo con muchos rostros que del simple politeísmo como la antigua religión cananea."
  },
  {
    "textEn": "26. Distinguish jnana yoga, bhakti yoga, and karma yoga as paths toward moksha.",
    "textEs": "26. Distinga el jnana yoga, el bhakti yoga y el karma yoga como caminos hacia el moksha.",
    "kw_en": ["jnana", "bhakti", "karma yoga", "knowledge", "devotion", "selfless", "attachment", "temperament"],
    "kw_es": ["jnana", "bhakti", "karma yoga", "conocimiento", "devoción", "desinteresad", "apego", "temperamento"],
    "modelEn": "Jnana yoga is the path of knowledge, pursuing liberation through philosophical study and meditation realizing the identity of Atman and Brahman. Bhakti yoga is the path of devotion, pursuing liberation through loving worship of a personal deity, historically the most widely practiced path. Karma yoga is the path of selfless action, performing duties without attachment to results. Hinduism offers these multiple paths because it has no single required creed, suiting different temperaments.",
    "modelEs": "El jnana yoga es el camino del conocimiento, persiguiendo la liberación a través del estudio filosófico y la meditación que realiza la identidad de Atman y Brahman. El bhakti yoga es el camino de la devoción, persiguiendo la liberación a través de la adoración amorosa de una deidad personal, históricamente el camino más practicado. El karma yoga es el camino de la acción desinteresada, realizando deberes sin apego a los resultados. El hinduismo ofrece estos múltiples caminos porque no tiene un solo credo requerido, adecuándose a diferentes temperamentos."
  },
  {
    "textEn": "27. Distinguish the Shruti and Smriti categories of Hindu sacred literature, and name at least two texts in each category.",
    "textEs": "27. Distinga las categorías Shruti y Smriti de la literatura sagrada hindú, y nombre al menos dos textos en cada categoría.",
    "kw_en": ["shruti", "smriti", "heard", "remembered", "vedas", "upanishads", "ramayana", "mahabharata"],
    "kw_es": ["shruti", "smriti", "oye", "recuerda", "vedas", "upanishads", "ramayana", "mahabharata"],
    "modelEn": "Shruti texts, meaning 'that which is heard,' are considered directly revealed and include the four Vedas and the Upanishads. Smriti texts, meaning 'that which is remembered,' carry great authority without being directly revealed in the same sense, and include the epics Ramayana and Mahabharata, along with the Puranas.",
    "modelEs": "Los textos Shruti, que significa 'lo que se oye,' se consideran directamente revelados e incluyen los cuatro Vedas y los Upanishads. Los textos Smriti, que significa 'lo que se recuerda,' llevan gran autoridad sin ser directamente revelados en el mismo sentido, e incluyen las épicas Ramayana y Mahabharata, junto con los Puranas."
  },
  {
    "textEn": "28. Contrast the linear view of history in Hebrews 9:27-28 with the cyclical view of time in much Hindu thought, and explain why this unit calls it 'not a minor difference in emphasis.'",
    "textEs": "28. Contraste la visión lineal de la historia en Hebreos 9:27-28 con la visión cíclica del tiempo en gran parte del pensamiento hindú, y explique por qué esta unidad la llama 'no una diferencia menor de énfasis.'",
    "kw_en": ["linear", "cyclical", "cosmic ages", "once", "judgment", "reality", "shape", "hebrews"],
    "kw_es": ["lineal", "cíclic", "edades cósmicas", "una sola vez", "juicio", "realidad", "forma", "hebreos"],
    "modelEn": "Hebrews 9:27 teaches a linear view: it is appointed for men to die once, and after this the judgment. Much Hindu thought understands time as cyclical, moving through vast cosmic ages that repeat without ultimate beginning or end, with souls cycling through countless rebirths. This unit calls it not a minor difference because it is a genuinely different picture of reality itself, shaping how each tradition understands accountability, mercy, and how liberation or salvation is achieved.",
    "modelEs": "Hebreos 9:27 enseña una visión lineal: está establecido para los hombres que mueran una sola vez, y después de esto el juicio. Gran parte del pensamiento hindú entiende el tiempo como cíclico, moviéndose a través de vastas edades cósmicas que se repiten sin comienzo o fin último, con las almas cicladas a través de innumerables renacimientos. Esta unidad la llama no una diferencia menor porque es un cuadro genuinamente diferente de la realidad misma, dando forma a cómo cada tradición entiende la rendición de cuentas, la misericordia, y cómo se logra la liberación o salvación."
  },
  {
    "textEn": "29. According to this unit, what common ground can a pastor honor with a Hindu neighbor before addressing points of difference?",
    "textEs": "29. Según esta unidad, ¿qué terreno común puede honrar un pastor con un vecino hindú antes de abordar los puntos de diferencia?",
    "kw_en": ["moral", "seriousness", "consequence", "bhakti", "hunger", "personal", "areopagus", "instinct"],
    "kw_es": ["moral", "seriedad", "consecuencia", "bhakti", "hambre", "personal", "areópago", "instinto"],
    "modelEn": "Following Paul's pattern at the Areopagus, a pastor should honor Hindu tradition's moral seriousness, the conviction that actions have consequences and the universe is not morally indifferent, along with the genuine hunger for personal relationship with the divine displayed especially in bhakti devotion, recognizing it as a true religious instinct even though differently directed, echoing the pattern established in Unit 1.",
    "modelEs": "Siguiendo el patrón de Pablo en el Areópago, un pastor debe honrar la seriedad moral de la tradición hindú, la convicción de que las acciones tienen consecuencias y el universo no es moralmente indiferente, junto con el hambre genuina de relación personal con lo divino mostrada especialmente en la devoción bhakti, reconociéndolo como un instinto religioso verdadero aunque dirigido de manera diferente, haciendo eco del patrón establecido en la Unidad 1."
  },
  {
    "textEn": "30. Synthesize this unit: using Titus 3:5 and 1 Corinthians 13:12, explain what the gospel offers that karma, samsara, and Atman-Brahman identity cannot.",
    "textEs": "30. Sintetice esta unidad: usando Tito 3:5 y 1 Corintios 13:12, explique qué ofrece el evangelio que el karma, el samsara y la identidad Atman-Brahman no pueden ofrecer.",
    "kw_en": ["mercy", "debt", "paid", "another", "sufficient", "known", "personal", "absorption"],
    "kw_es": ["misericordia", "deuda", "pagada", "otro", "suficiente", "conocido", "personal", "absorción"],
    "modelEn": "Titus 3:5 says salvation is not by works of righteousness but according to God's mercy, contrasting with karma's law where every debt must be paid by the one who incurred it. Where samsara offers countless further lives to keep trying, Hebrews offers one life and one sufficient sacrifice. And where Atman-Brahman identity ultimately dissolves the self into an impersonal absolute, 1 Corinthians 13:12 promises knowing and being known personally, offering conscious eternal fellowship rather than absorption and loss of identity as the goal of the spiritual life.",
    "modelEs": "Tito 3:5 dice que la salvación no es por obras de justicia sino según la misericordia de Dios, contrastando con la ley del karma donde toda deuda debe ser pagada por quien la incurrió. Donde el samsara ofrece innumerables vidas más para seguir intentando, Hebreos ofrece una vida y un sacrificio suficiente. Y donde la identidad Atman-Brahman finalmente disuelve el yo en un absoluto impersonal, 1 Corintios 13:12 promete conocer y ser conocido personalmente, ofreciendo comunión eterna consciente en lugar de absorción y pérdida de identidad como meta de la vida espiritual."
  }
];

const PREV_HREF = 'CTSWRUnit3.html';

const NEXT_HREF = 'CTSWRUnit5.html';
