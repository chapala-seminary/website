/* CTSWR - unit 5: per-unit configuration and content. */

const UNIT = 5;

let currentUnit = 5;

const mcQuestions = [
  {
    "textEn": "1. Unlike the other religions studied in this course so far, classical Buddhism:",
    "textEs": "1. A diferencia de las otras religiones estudiadas en este curso hasta ahora, el budismo clásico:",
    "optionsEn": [
      "Largely declines to answer the question of a Creator God",
      "Centers entirely on a Creator God",
      "Was founded by multiple prophets",
      "Rejects the concept of suffering"
    ],
    "optionsEs": [
      "En gran medida declina responder la pregunta de un Dios Creador",
      "Se centra por completo en un Dios Creador",
      "Fue fundado por múltiples profetas",
      "Rechaza el concepto del sufrimiento"
    ],
    "c": 21,
    "explEn": "Classical Buddhism largely declines to answer the question of a Creator God, treating it as a distraction from its actual concern: diagnosing and curing suffering.",
    "explEs": "El budismo clásico en gran medida declina responder la pregunta de un Dios Creador, tratándola como una distracción de su verdadera preocupación: diagnosticar y curar el sufrimiento."
  },
  {
    "textEn": "2. According to Buddhist tradition, Siddhartha Gautama was exposed to the Four Sights, which included an old man, a diseased man, a corpse, and:",
    "textEs": "2. Según la tradición budista, Siddhartha Gautama fue expuesto a las Cuatro Vistas, que incluían un anciano, un hombre enfermo, un cadáver, y:",
    "optionsEn": [
      "A king",
      "A wandering ascetic",
      "A wealthy merchant",
      "A soldier"
    ],
    "optionsEs": [
      "Un rey",
      "Un asceta errante",
      "Un comerciante rico",
      "Un soldado"
    ],
    "c": 29,
    "explEn": "The Four Sights were an old man, a diseased man, a corpse, and a wandering ascetic who had renounced ordinary life in search of release from suffering.",
    "explEs": "Las Cuatro Vistas fueron un anciano, un hombre enfermo, un cadáver, y un asceta errante que había renunciado a la vida ordinaria en busca de liberación del sufrimiento."
  },
  {
    "textEn": "3. Siddhartha achieved enlightenment while meditating beneath a fig tree near the town of:",
    "textEs": "3. Siddhartha alcanzó la iluminación mientras meditaba bajo una higuera cerca del pueblo de:",
    "optionsEn": [
      "Mecca",
      "Jerusalem",
      "Bodh Gaya",
      "Varanasi"
    ],
    "optionsEs": [
      "La Meca",
      "Jerusalén",
      "Bodh Gaya",
      "Varanasi"
    ],
    "c": 37,
    "explEn": "Siddhartha achieved enlightenment while meditating beneath the Bodhi Tree near the town of Bodh Gaya.",
    "explEs": "Siddhartha alcanzó la iluminación mientras meditaba bajo el Árbol Bodhi cerca del pueblo de Bodh Gaya."
  },
  {
    "textEn": "4. According to this unit, why does the Buddha's identity as an ordinary man matter to Buddhism's entire logic?",
    "textEs": "4. Según esta unidad, ¿por qué importa la identidad del Buda como hombre ordinario para toda la lógica del budismo?",
    "optionsEn": [
      "It proves he was actually divine",
      "It has no theological significance at all",
      "It means Buddhism requires a mediator like Christianity",
      "His path is only useful if any ordinary person can also walk it"
    ],
    "optionsEs": [
      "Prueba que en realidad era divino",
      "No tiene ninguna significación teológica en absoluto",
      "Significa que el budismo requiere un mediador como el cristianismo",
      "Su camino solo es útil si cualquier persona ordinaria también puede recorrerlo"
    ],
    "c": 45,
    "explEn": "The Buddha's usefulness to followers lies in having discovered, through ordinary human effort, a path any other ordinary human being can in principle also walk.",
    "explEs": "La utilidad del Buda para sus seguidores radica en haber descubierto, a través del esfuerzo humano ordinario, un camino que cualquier otro ser humano ordinario puede en principio también recorrer."
  },
  {
    "textEn": "5. The first of the Four Noble Truths, dukkha, declares that:",
    "textEs": "5. La primera de las Cuatro Nobles Verdades, dukkha, declara que:",
    "optionsEn": [
      "Suffering is a universal and inescapable feature of ordinary life",
      "Suffering is rare and avoidable",
      "Only evil people suffer",
      "Suffering does not really exist"
    ],
    "optionsEs": [
      "El sufrimiento es un rasgo universal e ineludible de la vida ordinaria",
      "El sufrimiento es raro y evitable",
      "Solo las personas malas sufren",
      "El sufrimiento realmente no existe"
    ],
    "c": 49,
    "explEn": "The first Noble Truth declares suffering (dukkha) is a universal and inescapable feature of ordinary life, including birth, aging, sickness, and death.",
    "explEs": "La primera Noble Verdad declara que el sufrimiento (dukkha) es un rasgo universal e ineludible de la vida ordinaria, incluyendo el nacimiento, el envejecimiento, la enfermedad y la muerte."
  },
  {
    "textEn": "6. The second Noble Truth identifies the cause of suffering as:",
    "textEs": "6. La segunda Noble Verdad identifica la causa del sufrimiento como:",
    "optionsEn": [
      "Original sin",
      "Tanha, craving or desire",
      "Bad luck",
      "The actions of evil spirits"
    ],
    "optionsEs": [
      "El pecado original",
      "Tanha, el anhelo o deseo",
      "La mala suerte",
      "Las acciones de espíritus malignos"
    ],
    "c": 57,
    "explEn": "The second Noble Truth identifies tanha, craving or grasping attachment, as the cause of suffering.",
    "explEs": "La segunda Noble Verdad identifica el tanha, el anhelo o apego aferrado, como la causa del sufrimiento."
  },
  {
    "textEn": "7. The fourth Noble Truth prescribes the method for ending suffering, called:",
    "textEs": "7. La cuarta Noble Verdad prescribe el método para terminar el sufrimiento, llamado:",
    "optionsEn": [
      "The Five Pillars",
      "The Ten Commandments",
      "The Eightfold Path",
      "The Middle Way alone"
    ],
    "optionsEs": [
      "Los Cinco Pilares",
      "Los Diez Mandamientos",
      "El Óctuple Sendero",
      "El Camino Medio solo"
    ],
    "c": 65,
    "explEn": "The fourth Noble Truth prescribes the Eightfold Path as the method for ending suffering.",
    "explEs": "La cuarta Noble Verdad prescribe el Óctuple Sendero como el método para terminar el sufrimiento."
  },
  {
    "textEn": "8. This unit warns pastors that Buddhist meditation techniques adopted as 'secular wellness practice' often carry:",
    "textEs": "8. Esta unidad advierte a los pastores que las técnicas de meditación budista adoptadas como 'práctica de bienestar secular' a menudo conllevan:",
    "optionsEn": [
      "No philosophical assumptions at all",
      "Explicit Christian theology",
      "Only physical exercise value",
      "Specific claims about the illusory self and desire as the root problem"
    ],
    "optionsEs": [
      "Ninguna suposición filosófica en absoluto",
      "Teología cristiana explícita",
      "Solo valor de ejercicio físico",
      "Afirmaciones específicas acerca del yo ilusorio y el deseo como problema raíz"
    ],
    "c": 73,
    "explEn": "Techniques marketed as secular wellness practice still carry the full Buddhist framework's claims about the illusory nature of the self and desire as the root problem.",
    "explEs": "Las técnicas comercializadas como práctica de bienestar secular todavía conllevan las afirmaciones del marco budista completo acerca de la naturaleza ilusoria del yo y el deseo como problema raíz."
  },
  {
    "textEn": "9. Anicca is the Buddhist doctrine that:",
    "textEs": "9. Anicca es la doctrina budista de que:",
    "optionsEn": [
      "Everything in existence is in constant flux, without fixed essence",
      "The self is eternal",
      "Only humans experience suffering",
      "Karma does not apply to rebirth"
    ],
    "optionsEs": [
      "Todo lo que existe está en constante flujo, sin esencia fija",
      "El yo es eterno",
      "Solo los humanos experimentan sufrimiento",
      "El karma no se aplica al renacimiento"
    ],
    "c": 77,
    "explEn": "Anicca, impermanence, holds that everything in existence is in constant flux, arising and passing away, with nothing possessing a fixed, unchanging essence.",
    "explEs": "Anicca, la impermanencia, sostiene que todo lo que existe está en constante flujo, surgiendo y desapareciendo, sin que nada posea una esencia fija e inmutable."
  },
  {
    "textEn": "10. Anatta, 'no-self,' distinguishes Buddhism from Hindu Advaita Vedanta by denying:",
    "textEs": "10. Anatta, 'no-yo,' distingue al budismo del Advaita Vedanta hindú al negar:",
    "optionsEn": [
      "That Brahman exists",
      "That there is any permanent, unified self or soul at all",
      "That suffering exists",
      "That the Buddha ever lived"
    ],
    "optionsEs": [
      "Que Brahman existe",
      "Que exista ningún yo o alma permanente y unificado en absoluto",
      "Que el sufrimiento existe",
      "Que el Buda alguna vez vivió"
    ],
    "c": 85,
    "explEn": "Anatta denies that there is any permanent, unified self or soul at all, unlike Hindu Advaita Vedanta which taught the individual Atman is identical with Brahman.",
    "explEs": "Anatta niega que exista ningún yo o alma permanente y unificado en absoluto, a diferencia del Advaita Vedanta hindú que enseñaba que el Atman individual es idéntico con Brahman."
  },
  {
    "textEn": "11. This unit describes Buddhist rebirth, given the doctrine of anatta, as more like:",
    "textEs": "11. Esta unidad describe el renacimiento budista, dada la doctrina de anatta, como más parecido a:",
    "optionsEn": [
      "The same soul migrating unchanged from body to body",
      "Complete annihilation with no continuity at all",
      "One candle lighting another, a causal chain without a single unchanging thing",
      "Identical to Christian resurrection"
    ],
    "optionsEs": [
      "La misma alma migrando sin cambios de cuerpo en cuerpo",
      "Aniquilación completa sin ninguna continuidad en absoluto",
      "Una vela que enciende a otra, una cadena causal sin ninguna cosa inmutable",
      "Idéntico a la resurrección cristiana"
    ],
    "c": 93,
    "explEn": "Buddhist philosophy describes rebirth as something like one candle lighting another — a real continuity of cause and effect without a single unchanging soul that travels.",
    "explEs": "La filosofía budista describe el renacimiento como algo parecido a una vela que enciende a otra — una continuidad real de causa y efecto sin ninguna alma inmutable única que viaje."
  },
  {
    "textEn": "12. According to this unit, nirvana is most often described in Buddhist texts through:",
    "textEs": "12. Según esta unidad, el nirvana se describe con mayor frecuencia en los textos budistas mediante:",
    "optionsEn": [
      "Detailed positive descriptions of heaven",
      "Descriptions of a personal deity",
      "Comparisons to the Christian concept of grace",
      "Negation, such as the extinguishing of craving"
    ],
    "optionsEs": [
      "Descripciones positivas detalladas del cielo",
      "Descripciones de una deidad personal",
      "Comparaciones con el concepto cristiano de gracia",
      "La negación, como la extinción del anhelo"
    ],
    "c": 101,
    "explEn": "Buddhist texts most often describe nirvana by negation — the extinguishing of craving and the fires of greed, hatred, and delusion.",
    "explEs": "Los textos budistas describen el nirvana con mayor frecuencia por negación — la extinción del anhelo y los fuegos de la codicia, el odio y el engaño."
  },
  {
    "textEn": "13. This unit specifically warns pastors that nirvana should NOT be treated as:",
    "textEs": "13. Esta unidad advierte específicamente a los pastores que el nirvana NO debe tratarse como:",
    "optionsEn": [
      "A Buddhist word for heaven",
      "The cessation of suffering",
      "A goal of Buddhist practice",
      "Difficult to define positively"
    ],
    "optionsEs": [
      "Una palabra budista para el cielo",
      "El cese del sufrimiento",
      "Una meta de la práctica budista",
      "Difícil de definir positivamente"
    ],
    "c": 105,
    "explEn": "This unit warns that nirvana is not a Buddhist word for heaven, and treating it as though it were will genuinely mislead both pastor and listener.",
    "explEs": "Esta unidad advierte que el nirvana no es una palabra budista para el cielo, y tratarlo como si lo fuera engañará genuinamente tanto al pastor como al oyente."
  },
  {
    "textEn": "14. Theravada Buddhism, predominant in Sri Lanka and Thailand, emphasizes:",
    "textEs": "14. El budismo Theravada, predominante en Sri Lanka y Tailandia, enfatiza:",
    "optionsEn": [
      "Devotional worship of many bodhisattvas",
      "Monastic life as the most direct path to nirvana",
      "Esoteric ritual guided by a lama",
      "Rejection of the Four Noble Truths"
    ],
    "optionsEs": [
      "La adoración devocional de muchos bodhisattvas",
      "La vida monástica como el camino más directo al nirvana",
      "El ritual esotérico guiado por un lama",
      "El rechazo de las Cuatro Nobles Verdades"
    ],
    "c": 113,
    "explEn": "Theravada Buddhism emphasizes the monastic life as the most direct path to nirvana, generally regarding the Buddha as a wise teacher rather than an object of worship.",
    "explEs": "El budismo Theravada enfatiza la vida monástica como el camino más directo al nirvana, generalmente considerando al Buda como un maestro sabio en lugar de un objeto de adoración."
  },
  {
    "textEn": "15. A bodhisattva, in Mahayana Buddhism, is a being who:",
    "textEs": "15. Un bodhisattva, en el budismo Mahayana, es un ser que:",
    "optionsEn": [
      "Has never sought enlightenment",
      "Rejects the concept of nirvana entirely",
      "Delays entry into nirvana out of compassion to help other suffering beings",
      "Is identical to the historical Buddha"
    ],
    "optionsEs": [
      "Nunca ha buscado la iluminación",
      "Rechaza el concepto de nirvana por completo",
      "Retrasa la entrada al nirvana por compasión para ayudar a otros seres que sufren",
      "Es idéntico al Buda histórico"
    ],
    "c": 121,
    "explEn": "A bodhisattva has achieved the insight necessary for nirvana but voluntarily delays final entry into it out of compassion, to help other suffering beings first.",
    "explEs": "Un bodhisattva ha alcanzado la comprensión necesaria para el nirvana pero voluntariamente retrasa su entrada final en él por compasión, para ayudar primero a otros seres que sufren."
  },
  {
    "textEn": "16. Vajrayana Buddhism, sometimes called Tibetan Buddhism, is most widely known in the West through the figure of:",
    "textEs": "16. El budismo Vajrayana, a veces llamado budismo tibetano, es más ampliamente conocido en Occidente a través de la figura de:",
    "optionsEn": [
      "Confucius",
      "Krishna",
      "Muhammad",
      "The Dalai Lama"
    ],
    "optionsEs": [
      "Confucio",
      "Krishna",
      "Mahoma",
      "El Dalai Lama"
    ],
    "c": 129,
    "explEn": "Vajrayana Buddhism is most widely known in the West through the figure of the Dalai Lama.",
    "explEs": "El budismo Vajrayana es más ampliamente conocido en Occidente a través de la figura del Dalai Lama."
  },
  {
    "textEn": "17. According to this unit, James 4:1-2 supports which point of common ground with Buddhism?",
    "textEs": "17. Según esta unidad, ¿qué punto de terreno común con el budismo apoya Santiago 4:1-2?",
    "optionsEn": [
      "That conflict and suffering flow from desires warring within us",
      "That the Buddha was divine",
      "That nirvana and heaven are identical",
      "That karma determines salvation"
    ],
    "optionsEs": [
      "Que el conflicto y el sufrimiento fluyen de las pasiones que combaten dentro de nosotros",
      "Que el Buda era divino",
      "Que el nirvana y el cielo son idénticos",
      "Que el karma determina la salvación"
    ],
    "c": 133,
    "explEn": "James 4:1-2 traces conflict and suffering to desires warring within us, echoing Buddhism's diagnosis that craving produces suffering.",
    "explEs": "Santiago 4:1-2 rastrea el conflicto y el sufrimiento hasta las pasiones que combaten dentro de nosotros, haciendo eco del diagnóstico budista de que el anhelo produce sufrimiento."
  },
  {
    "textEn": "18. According to Matthew 11:28, cited in this unit, Jesus offers rest to those who:",
    "textEs": "18. Según Mateo 11:28, citado en esta unidad, Jesús ofrece descanso a los que:",
    "optionsEn": [
      "Achieve enlightenment through meditation",
      "Labor and are heavy laden",
      "Extinguish all desire first",
      "Belong to a particular caste"
    ],
    "optionsEs": [
      "Alcanzan la iluminación mediante la meditación",
      "Están trabajados y cargados",
      "Extinguen todo deseo primero",
      "Pertenecen a una casta particular"
    ],
    "c": 141,
    "explEn": "Matthew 11:28 says, 'Come to Me, all you who labor and are heavy laden, and I will give you rest' — an invitation to real rest from a real Person.",
    "explEs": "Mateo 11:28 dice: 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar' — una invitación a un descanso real de una Persona real."
  },
  {
    "textEn": "19. According to John 17:3, cited in this unit, eternal life consists of:",
    "textEs": "19. Según Juan 17:3, citado en esta unidad, la vida eterna consiste en:",
    "optionsEn": [
      "The extinguishing of the self",
      "Achieving nirvana through the Eightfold Path",
      "Knowing the only true God and Jesus Christ whom He sent",
      "Escaping the cycle of samsara alone"
    ],
    "optionsEs": [
      "La extinción del yo",
      "Alcanzar el nirvana a través del Óctuple Sendero",
      "Conocer al único Dios verdadero y a Jesucristo, a quien Él envió",
      "Escapar del ciclo del samsara solamente"
    ],
    "c": 149,
    "explEn": "John 17:3 describes eternal life as knowing the only true God and Jesus Christ whom He sent — relationship with a personal God, not the extinguishing of the self.",
    "explEs": "Juan 17:3 describe la vida eterna como conocer al único Dios verdadero y a Jesucristo, a quien Él envió — relación con un Dios personal, no la extinción del yo."
  },
  {
    "textEn": "20. This unit contrasts the Buddha, who died and remains simply a man, with Jesus, who:",
    "textEs": "20. Esta unidad contrasta al Buda, que murió y sigue siendo simplemente un hombre, con Jesús, que:",
    "optionsEn": [
      "Only taught a technique for enduring suffering",
      "Never claimed any unique identity",
      "Taught the same Eightfold Path as the Buddha",
      "Died and rose bodily, actually defeating suffering, sickness, and death"
    ],
    "optionsEs": [
      "Solo enseñó una técnica para soportar el sufrimiento",
      "Nunca afirmó ninguna identidad única",
      "Enseñó el mismo Óctuple Sendero que el Buda",
      "Murió y resucitó corporalmente, derrotando realmente el sufrimiento, la enfermedad y la muerte"
    ],
    "c": 157,
    "explEn": "Christians proclaim a Savior who died and rose bodily, actually defeating the suffering, sickness, and death that first sent Siddhartha on his quest, not merely teaching a technique to endure it.",
    "explEs": "Los cristianos proclaman un Salvador que murió y resucitó corporalmente, derrotando realmente el sufrimiento, la enfermedad y la muerte que originalmente enviaron a Siddhartha en su búsqueda, no meramente enseñando una técnica para soportarlo."
  }
];

const kwQuestions = [
  {
    "textEn": "21. Explain why this unit calls Buddhism 'a religion without a Creator God' and how this differs from every religion studied so far in this course.",
    "textEs": "21. Explique por qué esta unidad llama al budismo 'una religión sin ningún Dios Creador' y en qué difiere esto de cada religión estudiada hasta ahora en este curso.",
    "kw_en": ["creator", "declines", "personal", "brahman", "diagnose", "cure", "suffering", "distraction"],
    "kw_es": ["creador", "declina", "personal", "brahman", "diagnostic", "cura", "sufrimiento", "distracción"],
    "modelEn": "Classical Buddhism largely declines to answer the question of a Creator God, treating it as a distraction from its actual concern of diagnosing and curing suffering. This differs from Judaism, Islam, and Christianity, which center on a personal Deity, and from Hinduism, which centers on the impersonal ultimate reality Brahman; Buddhism instead focuses almost entirely on the practical problem of suffering and its cure, without settling the question of ultimate divine reality one way or the other.",
    "modelEs": "El budismo clásico en gran medida declina responder la pregunta de un Dios Creador, tratándola como una distracción de su verdadera preocupación de diagnosticar y curar el sufrimiento. Esto difiere del judaísmo, el islam y el cristianismo, que se centran en una Deidad personal, y del hinduismo, que se centra en la realidad última impersonal Brahman; el budismo en cambio se enfoca casi por completo en el problema práctico del sufrimiento y su cura, sin resolver la pregunta de la realidad divina última de una manera u otra."
  },
  {
    "textEn": "22. Describe the Four Sights that led Siddhartha to renounce his royal life, and explain their significance in the Buddhist account of his quest.",
    "textEs": "22. Describa las Cuatro Vistas que llevaron a Siddhartha a renunciar a su vida real, y explique su significado en el relato budista de su búsqueda.",
    "kw_en": ["old man", "diseased", "corpse", "ascetic", "renounce", "shielded", "aging", "confronted"],
    "kw_es": ["anciano", "enfermo", "cadáver", "asceta", "renunci", "protegido", "envejec", "enfrentado"],
    "modelEn": "The Four Sights were an old man bent by age, a diseased man, a corpse being carried to cremation, and a wandering ascetic at peace despite renouncing ordinary life. Having been shielded by his father from suffering, Siddhartha was confronted for the first time with the universal realities of aging, sickness, and death, and struck by the ascetic's peace, which led him to renounce his position, family, and inheritance to seek liberation from suffering.",
    "modelEs": "Las Cuatro Vistas fueron un anciano encorvado por la edad, un hombre enfermo, un cadáver siendo llevado a la cremación, y un asceta errante en paz a pesar de haber renunciado a la vida ordinaria. Habiendo sido protegido por su padre del sufrimiento, Siddhartha se enfrentó por primera vez con las realidades universales del envejecimiento, la enfermedad y la muerte, y sorprendido por la paz del asceta, lo cual lo llevó a renunciar a su posición, familia y herencia para buscar liberación del sufrimiento."
  },
  {
    "textEn": "23. List and briefly explain the Four Noble Truths.",
    "textEs": "23. Enumere y explique brevemente las Cuatro Nobles Verdades.",
    "kw_en": ["dukkha", "tanha", "nirodha", "eightfold", "suffering", "craving", "cessation", "path"],
    "kw_es": ["dukkha", "tanha", "nirodha", "óctuple", "sufrimiento", "anhelo", "cese", "sendero"],
    "modelEn": "The first Noble Truth, dukkha, declares suffering is universal and inescapable in ordinary life. The second identifies tanha, craving or grasping attachment, as suffering's cause. The third, nirodha, declares the cessation of suffering possible by eliminating craving, which is nirvana. The fourth prescribes the method, the Eightfold Path, comprising right view, intention, speech, action, livelihood, effort, mindfulness, and concentration.",
    "modelEs": "La primera Noble Verdad, dukkha, declara que el sufrimiento es universal e ineludible en la vida ordinaria. La segunda identifica el tanha, el anhelo o apego aferrado, como la causa del sufrimiento. La tercera, nirodha, declara que el cese del sufrimiento es posible al eliminar el anhelo, lo cual es el nirvana. La cuarta prescribe el método, el Óctuple Sendero, que comprende visión, intención, habla, acción, modo de vida, esfuerzo, atención y concentración correctos."
  },
  {
    "textEn": "24. Why does this unit say many Westerners adopt Buddhist meditation techniques while denying interest in Buddhism as a religion, and what tension does this create?",
    "textEs": "24. ¿Por qué dice esta unidad que muchos occidentales adoptan técnicas de meditación budista mientras niegan interés en el budismo como religión, y qué tensión crea esto?",
    "kw_en": ["technology", "mind", "practical", "inseparable", "karma", "rebirth", "contradiction", "framework"],
    "kw_es": ["tecnología", "mente", "práctic", "inseparable", "karma", "renacimiento", "contradicción", "marco"],
    "modelEn": "The Eightfold Path was designed from the beginning to function as a practical technology of the mind, which is why many adopt its techniques as therapeutic tools while denying religious interest. The tension this creates is that, in its full traditional context, this technique is inseparable from Buddhist claims about karma, rebirth, and the nature of the self, claims a Christian cannot adopt without contradiction, even while using the technique itself.",
    "modelEs": "El Óctuple Sendero fue diseñado desde el principio para funcionar como una tecnología práctica de la mente, por lo cual muchos adoptan sus técnicas como herramientas terapéuticas mientras niegan interés religioso. La tensión que esto crea es que, en su pleno contexto tradicional, esta técnica es inseparable de las afirmaciones budistas acerca del karma, el renacimiento y la naturaleza del yo, afirmaciones que un cristiano no puede adoptar sin contradicción, incluso al usar la técnica misma."
  },
  {
    "textEn": "25. Distinguish anicca and anatta, and explain how anatta differs from the Hindu Advaita Vedanta view of Atman studied in Unit 4.",
    "textEs": "25. Distinga anicca y anatta, y explique en qué difiere anatta de la visión hindú Advaita Vedanta del Atman estudiada en la Unidad 4.",
    "kw_en": ["anicca", "anatta", "impermanence", "no-self", "advaita", "atman", "brahman", "deny"],
    "kw_es": ["anicca", "anatta", "impermanencia", "no-yo", "advaita", "atman", "brahman", "nieg"],
    "modelEn": "Anicca, impermanence, holds that everything in existence is in constant flux with no fixed essence. Anatta, no-self, extends this to deny any permanent, unified self or soul at all. This differs sharply from Hindu Advaita Vedanta, which taught the individual Atman is ultimately identical with the universal Brahman; classical Buddhism instead denies there is any permanent self to be identical with anything.",
    "modelEs": "Anicca, la impermanencia, sostiene que todo lo que existe está en constante flujo sin esencia fija. Anatta, el no-yo, extiende esto para negar cualquier yo o alma permanente y unificado en absoluto. Esto difiere agudamente del Advaita Vedanta hindú, que enseñaba que el Atman individual es en última instancia idéntico al Brahman universal; el budismo clásico en cambio niega que exista ningún yo permanente que pueda ser idéntico a nada."
  },
  {
    "textEn": "26. Why is nirvana difficult to define positively, and why does this unit warn against calling it 'a Buddhist word for heaven'?",
    "textEs": "26. ¿Por qué es difícil definir positivamente el nirvana, y por qué advierte esta unidad contra llamarlo 'una palabra budista para el cielo'?",
    "kw_en": ["negation", "extinguish", "flame", "permanent self", "mislead", "cessation", "destination", "heaven"],
    "kw_es": ["negación", "extingu", "llama", "yo permanente", "engaña", "cese", "destino", "cielo"],
    "modelEn": "Nirvana is difficult to define positively because Buddhist texts most often describe it by negation, as the extinguishing of craving, likened to a flame going out. Because Buddhism denies any permanent self to begin with, nirvana cannot be described as that self reaching a blissful destination the way Christianity describes heaven; this unit warns that treating nirvana as a Buddhist word for heaven will genuinely mislead both pastor and listener.",
    "modelEs": "El nirvana es difícil de definir positivamente porque los textos budistas lo describen con mayor frecuencia por negación, como la extinción del anhelo, comparado con una llama que se apaga. Debido a que el budismo niega cualquier yo permanente desde el principio, el nirvana no puede describirse como ese yo alcanzando un destino dichoso de la manera en que el cristianismo describe el cielo; esta unidad advierte que tratar el nirvana como una palabra budista para el cielo engañará genuinamente tanto al pastor como al oyente."
  },
  {
    "textEn": "27. Compare Theravada and Mahayana Buddhism, including the concept of the bodhisattva.",
    "textEs": "27. Compare el budismo Theravada y el Mahayana, incluyendo el concepto del bodhisattva.",
    "kw_en": ["theravada", "elders", "monastic", "mahayana", "bodhisattva", "compassion", "devotional", "delay"],
    "kw_es": ["theravada", "ancianos", "monástic", "mahayana", "bodhisattva", "compasión", "devocional", "retras"],
    "modelEn": "Theravada Buddhism, 'the teaching of the elders,' emphasizes monastic life as the most direct path to nirvana and regards the Buddha as a wise teacher rather than an object of worship. Mahayana Buddhism, 'the great vehicle,' developed a broader, more devotional tradition, introducing the bodhisattva, a being who delays entry into nirvana out of compassion to help other suffering beings first, and venerating Buddhas and bodhisattvas in ways resembling devotional worship.",
    "modelEs": "El budismo Theravada, 'la enseñanza de los ancianos,' enfatiza la vida monástica como el camino más directo al nirvana y considera al Buda como un maestro sabio en lugar de un objeto de adoración. El budismo Mahayana, 'el gran vehículo,' desarrolló una tradición más amplia y devocional, introduciendo el bodhisattva, un ser que retrasa su entrada al nirvana por compasión para ayudar primero a otros seres que sufren, y venerando a Budas y bodhisattvas de maneras parecidas a la adoración devocional."
  },
  {
    "textEn": "28. According to this unit, what common ground can a pastor honor with a Buddhist neighbor, and what verse supports this?",
    "textEs": "28. Según esta unidad, ¿qué terreno común puede honrar un pastor con un vecino budista, y qué versículo apoya esto?",
    "kw_en": ["suffering", "seriousness", "compassion", "ethical", "james", "desire", "diagnose", "craving"],
    "kw_es": ["sufrimiento", "seriedad", "compasión", "ético", "santiago", "deseo", "diagnostic", "anhelo"],
    "modelEn": "A pastor can honor Buddhism's total seriousness about human suffering and its ethical teaching of compassion and restraint of greed and hatred, which overlaps with Scripture's moral vision. James 4:1-2 traces conflict and suffering to desires warring within us, supporting the affirmation that the Buddha correctly diagnosed something real: much suffering flows from disordered craving and attachment.",
    "modelEs": "Un pastor puede honrar la total seriedad del budismo acerca del sufrimiento humano y su enseñanza ética de compasión y restricción de la codicia y el odio, que se superpone con la visión moral de la Escritura. Santiago 4:1-2 rastrea el conflicto y el sufrimiento hasta las pasiones que combaten dentro de nosotros, apoyando la afirmación de que el Buda diagnosticó correctamente algo real: gran parte del sufrimiento fluye del anhelo y el apego desordenados."
  },
  {
    "textEn": "29. Using Matthew 11:28 and John 17:3, explain what the gospel offers that Buddhism cannot offer, according to this unit.",
    "textEs": "29. Usando Mateo 11:28 y Juan 17:3, explique qué ofrece el evangelio que el budismo no puede ofrecer, según esta unidad.",
    "kw_en": ["rest", "invitation", "person", "redemption", "extinguish", "eternal life", "know", "relationship"],
    "kw_es": ["descanso", "invitación", "persona", "redención", "extingu", "vida eterna", "conoc", "relación"],
    "modelEn": "Where Buddhism prescribes extinguishing desire and ultimately the self, Matthew 11:28 offers rest through an invitation from a real Person to a real person, promising redemption and restoration rather than dissolution. Where nirvana can only be described negatively, John 17:3 describes eternal life positively as knowing the only true God and Jesus Christ — relationship with a personal God, not the extinguishing of the self that would know Him.",
    "modelEs": "Donde el budismo prescribe extinguir el deseo y en última instancia el yo, Mateo 11:28 ofrece descanso a través de una invitación de una Persona real a una persona real, prometiendo redención y restauración en lugar de disolución. Donde el nirvana solo puede describirse negativamente, Juan 17:3 describe la vida eterna positivamente como conocer al único Dios verdadero y a Jesucristo — relación con un Dios personal, no la extinción del yo que lo conocería."
  },
  {
    "textEn": "30. Synthesize this unit: contrast the Buddha's death with the resurrection of Christ, and explain why this unit calls this 'not merely teaching a technique for enduring suffering, but actually defeating it.'",
    "textEs": "30. Sintetice esta unidad: contraste la muerte del Buda con la resurrección de Cristo, y explique por qué esta unidad llama a esto 'no meramente enseñando una técnica para soportar el sufrimiento, sino realmente derrotándolo.'",
    "kw_en": ["buddha", "died", "location", "risen", "bodily", "conquer", "defeat", "sickness"],
    "kw_es": ["buda", "murió", "paradero", "resucit", "corporal", "vence", "derrota", "enfermedad"],
    "modelEn": "The Buddha, however wise, remains simply a man who died, and Buddhist tradition itself does not claim to know his location with certainty. Christians proclaim a Savior who died and rose bodily, conquering the very suffering, sickness, and death that first sent Siddhartha on his quest. This unit calls this actually defeating suffering rather than merely teaching a technique for enduring it, because the resurrection is a historical victory over death itself, not a mental technique for coping with it while death remains undefeated.",
    "modelEs": "El Buda, por sabio que fuera, sigue siendo simplemente un hombre que murió, y la propia tradición budista no pretende conocer su paradero con certeza. Los cristianos proclaman un Salvador que murió y resucitó corporalmente, venciendo el mismo sufrimiento, la enfermedad y la muerte que originalmente enviaron a Siddhartha en su búsqueda. Esta unidad llama a esto realmente derrotar el sufrimiento en lugar de meramente enseñar una técnica para soportarlo, porque la resurrección es una victoria histórica sobre la muerte misma, no una técnica mental para sobrellevarla mientras la muerte permanece invicta."
  }
];

const PREV_HREF = 'CTSWRUnit4.html';

const NEXT_HREF = 'CTSWRUnit6.html';
