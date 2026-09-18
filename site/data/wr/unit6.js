/* CTSWR - unit 6: per-unit configuration and content. */

const UNIT = 6;

let currentUnit = 6;

const mcQuestions = [
  {
    "textEn": "1. The Chinese term san jiao refers to:",
    "textEs": "1. El término chino san jiao se refiere a:",
    "optionsEn": [
      "The blend of Confucianism, Taoism, and Buddhism, 'the three teachings'",
      "A single unified Chinese religion",
      "The Chinese imperial examination system",
      "A festival honoring ancestors"
    ],
    "optionsEs": [
      "La mezcla de confucianismo, taoísmo y budismo, 'las tres enseñanzas'",
      "Una sola religión china unificada",
      "El sistema chino de exámenes imperiales",
      "Un festival que honra a los ancestros"
    ],
    "c": 21,
    "explEn": "San jiao, 'the three teachings,' names the traditional Chinese blend of Confucianism, Taoism, and Buddhism, held together without a sense of contradiction.",
    "explEs": "San jiao, 'las tres enseñanzas,' nombra la mezcla tradicional china de confucianismo, taoísmo y budismo, sostenida junta sin sentido de contradicción."
  },
  {
    "textEn": "2. Unlike Judaism, Islam, and Buddhism, which generally expect exclusive adherence, traditional Chinese religious culture:",
    "textEs": "2. A diferencia del judaísmo, el islam y el budismo, que generalmente esperan adhesión exclusiva, la cultura religiosa tradicional china:",
    "optionsEn": [
      "Also demands exclusive membership in one tradition",
      "Has comfortably blended multiple traditions for over two thousand years",
      "Rejects all forms of ancestor veneration",
      "Was founded by a single prophet"
    ],
    "optionsEs": [
      "También exige membresía exclusiva en una tradición",
      "Ha mezclado cómodamente múltiples tradiciones durante más de dos mil años",
      "Rechaza toda forma de veneración de ancestros",
      "Fue fundada por un solo profeta"
    ],
    "c": 29,
    "explEn": "Traditional Chinese religious culture has comfortably blended Confucianism, Taoism, and Buddhism for over two thousand years without treating them as exclusive alternatives.",
    "explEs": "La cultura religiosa tradicional china ha mezclado cómodamente el confucianismo, el taoísmo y el budismo durante más de dos mil años sin tratarlos como alternativas exclusivas."
  },
  {
    "textEn": "3. Confucius understood himself primarily as:",
    "textEs": "3. Confucio se entendía a sí mismo principalmente como:",
    "optionsEn": [
      "An innovator founding a new religion",
      "A military general",
      "A transmitter of the wisdom of earlier sage-kings",
      "A Buddhist monk"
    ],
    "optionsEs": [
      "Un innovador que fundaba una nueva religión",
      "Un general militar",
      "Un transmisor de la sabiduría de reyes sabios anteriores",
      "Un monje budista"
    ],
    "c": 37,
    "explEn": "Confucius understood himself as a transmitter rather than an innovator, seeking to restore the wisdom of earlier Chinese sage-kings.",
    "explEs": "Confucio se entendía a sí mismo como transmisor más que innovador, buscando restaurar la sabiduría de reyes sabios chinos anteriores."
  },
  {
    "textEn": "4. Confucius's teachings are recorded in a collection called the:",
    "textEs": "4. Las enseñanzas de Confucio están registradas en una colección llamada:",
    "optionsEn": [
      "Tao Te Ching",
      "Bhagavad Gita",
      "Qur'an",
      "Analects"
    ],
    "optionsEs": [
      "El Tao Te Ching",
      "El Bhagavad Gita",
      "El Corán",
      "Las Analectas"
    ],
    "c": 45,
    "explEn": "Confucius's teachings were recorded by later disciples in a collection called the Analects.",
    "explEs": "Las enseñanzas de Confucio fueron registradas por discípulos posteriores en una colección llamada las Analectas."
  },
  {
    "textEn": "5. Ren, central to Confucian ethics, is usually translated:",
    "textEs": "5. El ren, central a la ética confuciana, usualmente se traduce:",
    "optionsEn": [
      "Benevolence or humaneness",
      "Ritual propriety",
      "Non-action",
      "Filial piety"
    ],
    "optionsEs": [
      "Benevolencia o humanidad",
      "Propiedad ritual",
      "No-acción",
      "Piedad filial"
    ],
    "c": 49,
    "explEn": "Ren is usually translated 'benevolence' or 'humaneness,' the fundamental virtue Confucius held to be the root from which all other virtues grow.",
    "explEs": "El ren usualmente se traduce 'benevolencia' o 'humanidad,' la virtud fundamental que Confucio sostenía era la raíz de la cual crecen todas las demás virtudes."
  },
  {
    "textEn": "6. Xiao, regarded as the foundational Confucian relationship, refers to:",
    "textEs": "6. El xiao, considerado la relación confuciana fundamental, se refiere a:",
    "optionsEn": [
      "Ritual propriety in temples",
      "Filial piety, the relationship between father and son",
      "The relationship between ruler and subject",
      "Non-action in harmony with the Tao"
    ],
    "optionsEs": [
      "La propiedad ritual en templos",
      "La piedad filial, la relación entre padre e hijo",
      "La relación entre gobernante y súbdito",
      "La no-acción en armonía con el Tao"
    ],
    "c": 57,
    "explEn": "Xiao, filial piety, expressed in the relationship between father and son, is regarded as the foundational relationship from which the other Five Relationships take their pattern.",
    "explEs": "El xiao, la piedad filial, expresada en la relación entre padre e hijo, se considera la relación fundamental de la cual las demás Cinco Relaciones toman su patrón."
  },
  {
    "textEn": "7. For roughly two thousand years, Confucian classics formed the core of:",
    "textEs": "7. Durante aproximadamente dos mil años, los clásicos confucianos formaron el núcleo de:",
    "optionsEn": [
      "Taoist temple ritual",
      "Buddhist monastic training only",
      "The imperial examination system for selecting civil servants",
      "Ancestor veneration ceremonies"
    ],
    "optionsEs": [
      "El ritual del templo taoísta",
      "Solo el entrenamiento monástico budista",
      "El sistema de exámenes imperiales para seleccionar funcionarios públicos",
      "Las ceremonias de veneración de ancestros"
    ],
    "c": 65,
    "explEn": "Confucian classics formed the core curriculum of the imperial examination system through which China's civil servants were selected for roughly two thousand years.",
    "explEs": "Los clásicos confucianos formaron el currículo central del sistema de exámenes imperiales a través del cual se seleccionaban los funcionarios públicos de China durante aproximadamente dos mil años."
  },
  {
    "textEn": "8. The Tao Te Ching is traditionally attributed to:",
    "textEs": "8. El Tao Te Ching tradicionalmente se atribuye a:",
    "optionsEn": [
      "Confucius",
      "The Buddha",
      "Muhammad",
      "Laozi"
    ],
    "optionsEs": [
      "Confucio",
      "El Buda",
      "Mahoma",
      "Laozi"
    ],
    "c": 73,
    "explEn": "The Tao Te Ching is traditionally credited to a sage named Laozi, though scholars debate his historicity.",
    "explEs": "El Tao Te Ching tradicionalmente se atribuye a un sabio llamado Laozi, aunque los eruditos debaten su historicidad."
  },
  {
    "textEn": "9. Wu wei, the central practical teaching of philosophical Taoism, is best translated:",
    "textEs": "9. El wu wei, la enseñanza práctica central del taoísmo filosófico, se traduce mejor como:",
    "optionsEn": [
      "Effortless action in harmony with the Tao",
      "Ritual propriety",
      "Ancestor veneration",
      "Filial piety"
    ],
    "optionsEs": [
      "Acción sin esfuerzo en armonía con el Tao",
      "Propiedad ritual",
      "La veneración de ancestros",
      "Piedad filial"
    ],
    "c": 77,
    "explEn": "Wu wei, usually translated 'non-action' or 'effortless action,' means acting in harmony with the natural flow of the Tao rather than forcing outcomes.",
    "explEs": "El wu wei, usualmente traducido 'no-acción' o 'acción sin esfuerzo,' significa actuar en armonía con el flujo natural del Tao en lugar de forzar resultados."
  },
  {
    "textEn": "10. Taoist texts frequently use which image as the model for wu wei?",
    "textEs": "10. ¿Qué imagen usan frecuentemente los textos taoístas como modelo del wu wei?",
    "optionsEn": [
      "Fire",
      "Water overcoming stone through patient yielding",
      "A soaring eagle",
      "A burning candle"
    ],
    "optionsEs": [
      "El fuego",
      "El agua que vence a la piedra a través de la cesión paciente",
      "Un águila que se eleva",
      "Una vela encendida"
    ],
    "c": 85,
    "explEn": "Taoist texts frequently use the image of water, which overcomes the hardest stone not through force but through patient yielding, as the model for wu wei.",
    "explEs": "Los textos taoístas frecuentemente usan la imagen del agua, que vence a la piedra más dura no a través de la fuerza sino a través de la cesión paciente, como modelo del wu wei."
  },
  {
    "textEn": "11. Yin and yang represent:",
    "textEs": "11. El yin y el yang representan:",
    "optionsEn": [
      "Two rival Chinese gods",
      "The two founders of Confucianism",
      "Complementary, interdependent opposite forces in dynamic balance",
      "A form of ancestor tablet"
    ],
    "optionsEs": [
      "Dos dioses chinos rivales",
      "Los dos fundadores del confucianismo",
      "Fuerzas opuestas complementarias e interdependientes en equilibrio dinámico",
      "Una forma de tablilla ancestral"
    ],
    "c": 93,
    "explEn": "Yin and yang are complementary, interdependent opposite forces whose dynamic balance is understood to constitute the natural harmony of the universe.",
    "explEs": "El yin y el yang son fuerzas opuestas complementarias e interdependientes cuyo equilibrio dinámico se entiende que constituye la armonía natural del universo."
  },
  {
    "textEn": "12. Chinese folk religion's ancestor veneration is rooted in the conviction that:",
    "textEs": "12. La veneración de ancestros de la religión popular china está arraigada en la convicción de que:",
    "optionsEn": [
      "The dead cease to exist entirely",
      "Only Buddhist monks can honor the dead",
      "Ancestors become Taoist immortals automatically",
      "The dead continue to exist and remain bound to living descendants"
    ],
    "optionsEs": [
      "Los muertos dejan de existir por completo",
      "Solo los monjes budistas pueden honrar a los muertos",
      "Los ancestros se convierten automáticamente en inmortales taoístas",
      "Los muertos continúan existiendo y permanecen atados a los descendientes vivos"
    ],
    "c": 101,
    "explEn": "Ancestor veneration is rooted in the conviction that the dead continue to exist in some form and remain bound to their living descendants by mutual obligation.",
    "explEs": "La veneración de ancestros está arraigada en la convicción de que los muertos continúan existiendo en alguna forma y permanecen atados a sus descendientes vivos por obligación mutua."
  },
  {
    "textEn": "13. The annual festival when Chinese families visit and tend ancestral graves is called:",
    "textEs": "13. El festival anual cuando las familias chinas visitan y cuidan las tumbas ancestrales se llama:",
    "optionsEn": [
      "Qingming",
      "Ramadan",
      "Yom Kippur",
      "Vesak"
    ],
    "optionsEs": [
      "Qingming",
      "Ramadán",
      "Iom Kipur",
      "Vesak"
    ],
    "c": 105,
    "explEn": "The Qingming festival is when Chinese families traditionally visit and tend ancestral graves.",
    "explEs": "El festival de Qingming es cuando las familias chinas tradicionalmente visitan y cuidan las tumbas ancestrales."
  },
  {
    "textEn": "14. Gui, particularly 'hungry ghosts' in Chinese folk religion, are believed to be:",
    "textEs": "14. Los gui, particularmente los 'fantasmas hambrientos' en la religión popular china, se cree que son:",
    "optionsEn": [
      "Benevolent nature spirits only",
      "Spirits wandering without descendants to honor them or proper burial",
      "Deified emperors",
      "A Taoist term for yin and yang"
    ],
    "optionsEs": [
      "Solo espíritus benevolentes de la naturaleza",
      "Espíritus que vagan sin descendientes que los honren o entierro apropiado",
      "Emperadores deificados",
      "Un término taoísta para el yin y el yang"
    ],
    "c": 113,
    "explEn": "Gui, particularly hungry ghosts, are believed to wander without descendants to honor them or proper burial rites, appeased during the Hungry Ghost Festival.",
    "explEs": "Los gui, particularmente los fantasmas hambrientos, se cree que vagan sin descendientes que los honren o ritos de entierro apropiados, apaciguados durante el Festival de los Fantasmas Hambrientos."
  },
  {
    "textEn": "15. Feng shui draws on both Taoist cosmology and folk belief regarding:",
    "textEs": "15. El feng shui se basa tanto en la cosmología taoísta como en la creencia popular respecto a:",
    "optionsEn": [
      "The correct order of Confucian classics",
      "The historical dates of Buddhist festivals",
      "How placement of the living and dead affects fortune and family well-being",
      "The structure of the imperial examination"
    ],
    "optionsEs": [
      "El orden correcto de los clásicos confucianos",
      "Las fechas históricas de los festivales budistas",
      "Cómo la ubicación de los vivos y los muertos afecta la fortuna y el bienestar familiar",
      "La estructura del examen imperial"
    ],
    "c": 121,
    "explEn": "Feng shui draws on Taoist cosmology and folk belief about how the placement of the living and the dead affects fortune and family well-being.",
    "explEs": "El feng shui se basa en la cosmología taoísta y la creencia popular acerca de cómo la ubicación de los vivos y los muertos afecta la fortuna y el bienestar familiar."
  },
  {
    "textEn": "16. According to this unit, Exodus 20:12 and Ephesians 6:1 provide genuine common ground with which Confucian value?",
    "textEs": "16. Según esta unidad, ¿con qué valor confuciano proporcionan Éxodo 20:12 y Efesios 6:1 un terreno común genuino?",
    "optionsEn": [
      "Wu wei",
      "Yin and yang balance",
      "Feng shui placement",
      "Filial piety, honoring parents"
    ],
    "optionsEs": [
      "El wu wei",
      "El equilibrio de yin y yang",
      "La ubicación del feng shui",
      "La piedad filial, honrar a los padres"
    ],
    "c": 129,
    "explEn": "Exodus 20:12's command to honor father and mother and Ephesians 6:1's instruction for children to obey parents affirm the deep respect for parents Confucian filial piety cultivates.",
    "explEs": "El mandamiento de Éxodo 20:12 de honrar a padre y madre y la instrucción de Efesios 6:1 para que los hijos obedezcan a sus padres afirman el profundo respeto por los padres que cultiva la piedad filial confuciana."
  },
  {
    "textEn": "17. According to this unit, the difficult pastoral line to draw is between:",
    "textEs": "17. Según esta unidad, la difícil línea pastoral a trazar es entre:",
    "optionsEn": [
      "Honoring the dead as family members and worshiping them as objects of religious devotion",
      "Honoring ancestors and dishonoring them entirely",
      "Confucianism and Taoism generally",
      "Buddhism and Chinese folk religion"
    ],
    "optionsEs": [
      "Honrar a los muertos como miembros familiares y adorarlos como objetos de devoción religiosa",
      "Honrar a los ancestros y deshonrarlos por completo",
      "El confucianismo y el taoísmo en general",
      "El budismo y la religión popular china"
    ],
    "c": 133,
    "explEn": "The careful pastoral distinction is between honoring the dead as beloved family members and worshiping them as objects of religious devotion through prayer and sacrifice.",
    "explEs": "La cuidadosa distinción pastoral es entre honrar a los muertos como miembros familiares amados y adorarlos como objetos de devoción religiosa mediante oración y sacrificio."
  },
  {
    "textEn": "18. According to John 1:1, 3, cited in this unit, the Word (Logos) is presented in contrast to the impersonal Tao as:",
    "textEs": "18. Según Juan 1:1, 3, citado en esta unidad, el Verbo (Logos) se presenta en contraste con el Tao impersonal como:",
    "optionsEn": [
      "An impersonal pattern to align with",
      "A Person present at creation, through whom all things were made",
      "Identical to the Confucian junzi",
      "A minor deity among many"
    ],
    "optionsEs": [
      "Un patrón impersonal con el cual alinearse",
      "Una Persona presente en la creación, por medio de quien todas las cosas fueron hechas",
      "Idéntico al junzi confuciano",
      "Una deidad menor entre muchas"
    ],
    "c": 141,
    "explEn": "John 1:1, 3 presents the Word as a Person present at creation, through whom all things were made, unlike the impersonal Tao that is merely a pattern to align with.",
    "explEs": "Juan 1:1, 3 presenta al Verbo como una Persona presente en la creación, por medio de quien todas las cosas fueron hechas, a diferencia del Tao impersonal que es meramente un patrón con el cual alinearse."
  },
  {
    "textEn": "19. The Chinese Rites controversy in Roman Catholic missionary history arose over disagreement about:",
    "textEs": "19. La controversia de los Ritos Chinos en la historia misionera católica romana surgió por el desacuerdo acerca de:",
    "optionsEn": [
      "Whether Confucius was divine",
      "The correct date of Easter",
      "Whether ancestral rites were civil commemoration or religious worship",
      "Whether Taoism should be studied at all"
    ],
    "optionsEs": [
      "Si Confucio era divino",
      "La fecha correcta de la Pascua",
      "Si los ritos ancestrales eran conmemoración civil o adoración religiosa",
      "Si el taoísmo debía estudiarse en absoluto"
    ],
    "c": 149,
    "explEn": "The Chinese Rites controversy concerned whether ancestral rites were merely civil commemoration or religious worship, remaining unresolved for well over a century.",
    "explEs": "La controversia de los Ritos Chinos concernía si los ritos ancestrales eran meramente conmemoración civil o adoración religiosa, sin resolverse durante bien más de un siglo."
  },
  {
    "textEn": "20. According to this unit's final section, a pastor helping a Chinese convert should aim to help him express filial love:",
    "textEs": "20. Según la sección final de esta unidad, un pastor que ayuda a un converso chino debe buscar ayudarlo a expresar el amor filial:",
    "optionsEn": [
      "By abandoning all family customs entirely",
      "By continuing all ancestral worship unchanged",
      "Only through Confucian ritual propriety",
      "Without the specific elements of worship that belong to God alone"
    ],
    "optionsEs": [
      "Abandonando por completo todas las costumbres familiares",
      "Continuando toda la adoración ancestral sin cambios",
      "Solo a través de la propiedad ritual confuciana",
      "Sin los elementos específicos de adoración que pertenecen solo a Dios"
    ],
    "c": 157,
    "explEn": "A pastor should help a new believer find ways to express the same filial love Scripture commands without the specific elements of worship, which belong to God alone.",
    "explEs": "Un pastor debe ayudar a un nuevo creyente a encontrar formas de expresar el mismo amor filial que la Escritura ordena sin los elementos específicos de adoración, que pertenecen solo a Dios."
  }
];

const kwQuestions = [
  {
    "textEn": "21. Explain the concept of san jiao and why traditional Chinese religious culture differs from most religions studied earlier in this course regarding exclusive adherence.",
    "textEs": "21. Explique el concepto de san jiao y por qué la cultura religiosa tradicional china difiere de la mayoría de las religiones estudiadas anteriormente en este curso respecto a la adhesión exclusiva.",
    "kw_en": ["san jiao", "three teachings", "blend", "confucianism", "taoism", "buddhism", "exclusive", "contradiction"],
    "kw_es": ["san jiao", "tres enseñanzas", "mezcl", "confucianismo", "taoísmo", "budismo", "exclusiv", "contradicción"],
    "modelEn": "San jiao, 'the three teachings,' names the traditional Chinese blend of Confucianism, Taoism, and Buddhism, captured in the saying that the three teachings are one. Unlike Judaism, Islam, and Buddhism studied earlier, which generally expect exclusive adherence, traditional Chinese religious culture has comfortably blended these three streams for over two thousand years, with a person consulting Confucian ethics, practicing Taoist disciplines, and venerating ancestors all without any sense of contradiction.",
    "modelEs": "San jiao, 'las tres enseñanzas,' nombra la mezcla tradicional china de confucianismo, taoísmo y budismo, capturada en el dicho de que las tres enseñanzas son una. A diferencia del judaísmo, el islam y el budismo estudiados anteriormente, que generalmente esperan adhesión exclusiva, la cultura religiosa tradicional china ha mezclado cómodamente estas tres corrientes durante más de dos mil años, con una persona consultando la ética confuciana, practicando disciplinas taoístas, y venerando a los ancestros todo sin ningún sentido de contradicción."
  },
  {
    "textEn": "22. Describe Confucius's own self-understanding and explain why his response about serving the spirits is described as 'characteristically this-worldly.'",
    "textEs": "22. Describa el propio entendimiento de sí mismo de Confucio y explique por qué su respuesta acerca de servir a los espíritus se describe como 'característicamente terrenal.'",
    "kw_en": ["transmitter", "innovator", "sage-kings", "spirits", "serve men", "ethics", "metaphysical", "present"],
    "kw_es": ["transmisor", "innovador", "reyes sabios", "espíritus", "servir hombres", "ética", "metafísic", "presente"],
    "modelEn": "Confucius understood himself as a transmitter rather than an innovator, seeking to restore the wisdom of earlier Chinese sage-kings. When asked about serving spirits, he responded, 'You are not yet able to serve men, how can you serve the spirits?' This is called characteristically this-worldly because it redirects attention from metaphysical or spiritual questions toward present moral duty toward other people, reflecting Confucianism's overwhelming focus on ethics and social relationships rather than the afterlife or ultimate reality.",
    "modelEs": "Confucio se entendía a sí mismo como transmisor más que innovador, buscando restaurar la sabiduría de reyes sabios chinos anteriores. Cuando se le preguntó acerca de servir a los espíritus, respondió: 'Todavía no eres capaz de servir a los hombres, ¿cómo puedes servir a los espíritus?' Esto se llama característicamente terrenal porque redirige la atención de cuestiones metafísicas o espirituales hacia el deber moral presente hacia otras personas, reflejando el enfoque abrumador del confucianismo en la ética y las relaciones sociales más que en la vida después de la muerte o la realidad última."
  },
  {
    "textEn": "23. Define ren, li, and xiao, and explain how they relate to the Confucian Five Relationships.",
    "textEs": "23. Defina ren, li y xiao, y explique cómo se relacionan con las Cinco Relaciones confucianas.",
    "kw_en": ["ren", "li", "xiao", "benevolence", "ritual propriety", "filial piety", "five relationships", "foundational"],
    "kw_es": ["ren", "li", "xiao", "benevolencia", "propiedad ritual", "piedad filial", "cinco relaciones", "fundamental"],
    "modelEn": "Ren is benevolence or humaneness, the root virtue of care for others. Li is ritual propriety, the fabric of proper behavior that expresses inward virtue. Xiao is filial piety, the obligation between father and son. These virtues structure the Five Relationships (ruler-subject, father-son, husband-wife, elder-younger brother, friend-friend), with xiao regarded as the foundational relationship from which the other four take their pattern.",
    "modelEs": "El ren es benevolencia o humanidad, la virtud raíz del cuidado por otros. El li es propiedad ritual, el tejido del comportamiento apropiado que expresa la virtud interior. El xiao es piedad filial, la obligación entre padre e hijo. Estas virtudes estructuran las Cinco Relaciones (gobernante-súbdito, padre-hijo, esposo-esposa, hermano mayor-menor, amigo-amigo), con el xiao considerado la relación fundamental de la cual las otras cuatro toman su patrón."
  },
  {
    "textEn": "24. Explain wu wei and how it reflects a different orientation from Confucianism, using the water imagery this unit describes.",
    "textEs": "24. Explique el wu wei y cómo refleja una orientación diferente del confucianismo, usando la imagen del agua que describe esta unidad.",
    "kw_en": ["wu wei", "effortless", "harmony", "forcing", "water", "yield", "stone", "confucianism"],
    "kw_es": ["wu wei", "sin esfuerzo", "armonía", "forzar", "agua", "ced", "piedra", "confucianismo"],
    "modelEn": "Wu wei, effortless action, means acting in harmony with the natural flow of the Tao rather than forcing outcomes through striving, ambition, or rigid rule-following, the very things Confucianism prized. Taoist texts use water, which overcomes the hardest stone not through force but through patient yielding, as the model, reflecting Taoism's orientation toward aligning with nature's deeper pattern rather than Confucianism's orientation toward structuring human society through active moral effort.",
    "modelEs": "El wu wei, la acción sin esfuerzo, significa actuar en armonía con el flujo natural del Tao en lugar de forzar resultados a través de la lucha, la ambición, o el seguimiento rígido de reglas, las mismas cosas que el confucianismo apreciaba. Los textos taoístas usan el agua, que vence a la piedra más dura no a través de la fuerza sino a través de la cesión paciente, como modelo, reflejando la orientación del taoísmo hacia alinearse con el patrón más profundo de la naturaleza en lugar de la orientación del confucianismo hacia estructurar la sociedad humana a través del esfuerzo moral activo."
  },
  {
    "textEn": "25. Describe Chinese ancestor veneration and how Confucian filial piety and folk religion reinforced one another regarding this practice.",
    "textEs": "25. Describa la veneración de ancestros china y cómo la piedad filial confuciana y la religión popular se reforzaron mutuamente respecto a esta práctica.",
    "kw_en": ["ancestral tablets", "incense", "qingming", "obligation", "descendants", "reinforce", "neglect", "moral failure"],
    "kw_es": ["tablillas", "incienso", "qingming", "obligación", "descendientes", "refuerz", "descuid", "falla moral"],
    "modelEn": "Chinese families maintained ancestral tablets inscribed with deceased family members' names, offering incense, food, and prayer, especially during the Qingming festival. Confucian filial piety and folk ancestor veneration reinforced each other closely: the obligation owed living parents was understood to extend, modified, to parents after death, and neglecting these observances was regarded as a serious moral failure, not merely a religious one.",
    "modelEs": "Las familias chinas mantenían tablillas ancestrales inscritas con los nombres de los familiares fallecidos, ofreciendo incienso, comida y oración, especialmente durante el festival de Qingming. La piedad filial confuciana y la veneración popular de los ancestros se reforzaban mutuamente de cerca: la obligación debida a los padres vivos se entendía que se extendía, modificada, a los padres después de la muerte, y descuidar estas observancias se consideraba una falla moral seria, no meramente religiosa."
  },
  {
    "textEn": "26. Why does this unit say that for many Chinese families, the entire complex of ancestor veneration, feng shui, and folk deities 'functions as an integrated whole, not a set of separate religious choices'? What pastoral consequence follows?",
    "textEs": "26. ¿Por qué dice esta unidad que para muchas familias chinas, todo el complejo de veneración de ancestros, feng shui y deidades populares 'funciona como un todo integrado, no un conjunto de elecciones religiosas separadas'? ¿Qué consecuencia pastoral se deriva?",
    "kw_en": ["integrated", "whole", "disruptive", "conversion", "encompassing", "separate", "denomination", "family"],
    "kw_es": ["integrado", "todo", "disruptiv", "conversión", "totalizador", "separad", "denominación", "familia"],
    "modelEn": "This unit says the practice functions as an integrated whole because a family's Confucian ethics, Taoist practice, folk deity worship, and Buddhist devotion are not experienced as separate religious choices but as one coherent way of life. The pastoral consequence is that conversion to Christianity has historically been a much more disruptive, all-encompassing decision for Chinese families than, for example, conversion between Protestant denominations, since it touches the entire integrated system at once rather than a single isolated religious choice.",
    "modelEs": "Esta unidad dice que la práctica funciona como un todo integrado porque la ética confuciana, la práctica taoísta, la adoración de deidades populares y la devoción budista de una familia no se experimentan como elecciones religiosas separadas sino como una forma de vida coherente. La consecuencia pastoral es que la conversión al cristianismo ha sido históricamente una decisión mucho más disruptiva y totalizadora para las familias chinas que, por ejemplo, la conversión entre denominaciones protestantes, ya que toca todo el sistema integrado a la vez en lugar de una sola elección religiosa aislada."
  },
  {
    "textEn": "27. Using Exodus 20:12 and Ephesians 6:1, explain the genuine common ground between Confucian filial piety and Scripture, and where a pastor must still draw a careful line.",
    "textEs": "27. Usando Éxodo 20:12 y Efesios 6:1, explique el terreno común genuino entre la piedad filial confuciana y la Escritura, y dónde un pastor todavía debe trazar una línea cuidadosa.",
    "kw_en": ["honor", "parents", "commandment", "obey", "right", "worship", "prayer", "distinguish"],
    "kw_es": ["honra", "padres", "mandamiento", "obedec", "justo", "adoración", "oración", "distingu"],
    "modelEn": "Exodus 20:12 commands honoring father and mother, and Ephesians 6:1 says children should obey parents 'for this is right,' affirming the deep respect Confucian ethics has cultivated for millennia. A pastor should not ask a convert to abandon honoring ancestors as people, but must still distinguish between honoring the dead as family members and worshiping them through prayer and sacrifice intended to secure their favor, since the latter crosses into worship owed to God alone.",
    "modelEs": "Éxodo 20:12 ordena honrar a padre y madre, y Efesios 6:1 dice que los hijos deben obedecer a los padres 'porque esto es justo,' afirmando el profundo respeto que la ética confuciana ha cultivado durante milenios. Un pastor no debe pedirle a un converso que abandone honrar a los ancestros como personas, pero todavía debe distinguir entre honrar a los muertos como miembros familiares y adorarlos a través de oración y sacrificio destinados a asegurar su favor, ya que esto último cruza hacia la adoración debida solo a Dios."
  },
  {
    "textEn": "28. Using John 1:1, 3, explain what the gospel's picture of the Word (Logos) offers that the impersonal Tao cannot.",
    "textEs": "28. Usando Juan 1:1, 3, explique qué ofrece el cuadro evangélico del Verbo (Logos) que el Tao impersonal no puede ofrecer.",
    "kw_en": ["word", "logos", "person", "creation", "impersonal", "pattern", "speak", "known"],
    "kw_es": ["verbo", "logos", "persona", "creación", "impersonal", "patrón", "habla", "conocido"],
    "modelEn": "This unit affirms partial insight in the Tao's conviction that reality has a coherent underlying order worth aligning with, echoing Romans 1:20 and Psalm 19. But John 1:1, 3 proclaims what wu wei's impersonal Way cannot offer: the Word was a Person present at creation, through whom all things were made, who speaks and acts decisively in history, and who, unlike an impersonal natural pattern, can be known, trusted, and loved.",
    "modelEs": "Esta unidad afirma una intuición parcial en la convicción del Tao de que la realidad tiene un orden subyacente coherente digno de ser alineado, haciendo eco de Romanos 1:20 y el Salmo 19. Pero Juan 1:1, 3 proclama lo que el Camino impersonal del wu wei no puede ofrecer: el Verbo fue una Persona presente en la creación, por medio de quien todas las cosas fueron hechas, que habla y actúa decisivamente en la historia, y que, a diferencia de un patrón natural impersonal, puede ser conocido, confiado y amado."
  },
  {
    "textEn": "29. Describe the two opposite pastoral failures this unit identifies in missionary history regarding ancestor veneration, including the Chinese Rites controversy.",
    "textEs": "29. Describa los dos fracasos pastorales opuestos que identifica esta unidad en la historia misionera respecto a la veneración de ancestros, incluyendo la controversia de los Ritos Chinos.",
    "kw_en": ["indiscriminate", "abandon", "alienate", "blur", "civil commemoration", "chinese rites", "unresolved", "century"],
    "kw_es": ["indiscriminad", "abandon", "alien", "difumin", "conmemoración civil", "ritos chinos", "sin resolver", "siglo"],
    "modelEn": "Some missionaries demanded converts abandon every ancestral custom indiscriminately, even non-worshipful ones, needlessly alienating converts from their families. Others blurred the line too far the other way, permitting continued ancestral worship under the theory it was merely civil commemoration, a controversy known as the Chinese Rites controversy in Roman Catholic missionary history, unresolved for well over a century.",
    "modelEs": "Algunos misioneros exigían que los conversos abandonaran indiscriminadamente toda costumbre ancestral, incluso las no devocionales, alienando innecesariamente a los conversos de sus familias. Otros difuminaron la línea demasiado en la dirección opuesta, permitiendo que continuara la adoración ancestral bajo la teoría de que era meramente conmemoración civil, una controversia conocida como la controversia de los Ritos Chinos en la historia misionera católica romana, sin resolver durante bien más de un siglo."
  },
  {
    "textEn": "30. Synthesize this unit: how can a pastor help a Chinese convert receive the gospel as 'the truest fulfillment' of filial loyalty rather than an attack on it?",
    "textEs": "30. Sintetice esta unidad: ¿cómo puede un pastor ayudar a un converso chino a recibir el evangelio como 'su más verdadero cumplimiento' de la lealtad filial en lugar de un ataque a ella?",
    "kw_en": ["affirm", "honoring", "identify", "distinguish", "worship alone", "fulfillment", "same god", "commanded"],
    "kw_es": ["afirm", "honra", "identific", "distingu", "adoración sola", "cumplimiento", "mismo dios", "ordenó"],
    "modelEn": "A pastor can affirm without hesitation a believer's continued honoring of parents and grandparents, visiting graves, and remembering family history, while helping the believer identify clearly which specific practices function as worship — prayer to ancestors, offerings for blessing, incense as devotion — and finding ways to express the same filial love without those elements, which belong to God alone. This allows the gospel to be received as the fulfillment of filial loyalty, since the same God who commanded honoring father and mother is the God to whom worship is finally due.",
    "modelEs": "Un pastor puede afirmar sin vacilación la continua honra que un creyente da a padres y abuelos, la visita a tumbas, y el recuerdo de la historia familiar, mientras ayuda al creyente a identificar claramente cuáles prácticas específicas funcionan como adoración — la oración a los ancestros, las ofrendas para bendición, el incienso como devoción — y encontrando formas de expresar el mismo amor filial sin esos elementos, que pertenecen solo a Dios. Esto permite que el evangelio sea recibido como el cumplimiento de la lealtad filial, ya que el mismo Dios que ordenó honrar a padre y madre es el Dios a quien finalmente se debe la adoración."
  }
];

const PREV_HREF = 'CTSWRUnit5.html';

const NEXT_HREF = 'CTSWRUnit7.html';
