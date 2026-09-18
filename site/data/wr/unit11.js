/* CTSWR - unit 11: per-unit configuration and content. */

const UNIT = 11;

let currentUnit = 11;

let progress = JSON.parse(localStorage.getItem('cts_wr_progress')) || {};

const mcQuestions = [
  {
    "textEn": "1. According to this unit, the traditions studied here differ from most in Units 2-8 because they:",
    "textEs": "1. Según esta unidad, ¿en qué difieren las tradiciones estudiadas aquí de la mayoría en las Unidades 2-8?",
    "optionsEn": [
      "Are often present within the pastor's own congregation, layered beneath nominal Catholic or evangelical identity",
      "Are rarely encountered in Cuba or Mexico",
      "Have no connection to Catholicism at all",
      "Were fully eradicated centuries ago"
    ],
    "optionsEs": [
      "A menudo están presentes dentro de la propia congregación del pastor, superpuestas bajo una identidad católica o evangélica nominal",
      "Rara vez se encuentran en Cuba o México",
      "No tienen ninguna conexión con el catolicismo en absoluto",
      "Fueron completamente erradicadas hace siglos"
    ],
    "c": 21,
    "explEn": "Unlike occasional encounters with a distant visitor, these practices are often present in the extended family, neighborhood, and sometimes the congregation itself.",
    "explEs": "A diferencia de encuentros ocasionales con un visitante distante, estas prácticas a menudo están presentes en la familia extendida, el vecindario, y a veces la congregación misma."
  },
  {
    "textEn": "2. Santería developed among enslaved Yoruba people brought to Cuba, with Spanish colonial law requiring them to:",
    "textEs": "2. La Santería se desarrolló entre el pueblo yoruba esclavizado traído a Cuba, con la ley colonial española requiriendo que:",
    "optionsEn": [
      "Practice Yoruba religion openly",
      "Be baptized as Catholics",
      "Return to Africa after five years",
      "Convert to Islam"
    ],
    "optionsEs": [
      "Practicaran la religión yoruba abiertamente",
      "Fueran bautizados como católicos",
      "Regresaran a África después de cinco años",
      "Se convirtieran al islam"
    ],
    "c": 29,
    "explEn": "Spanish colonial law required enslaved Africans to be baptized as Catholics, leading Yoruba religion to survive concealed behind Catholic saint veneration.",
    "explEs": "La ley colonial española requería que los africanos esclavizados fueran bautizados como católicos, lo que llevó a que la religión yoruba sobreviviera oculta detrás de la veneración de santos católicos."
  },
  {
    "textEn": "3. In Santería, Ochún, orisha of love, beauty, and fresh water, became associated with:",
    "textEs": "3. En la Santería, Ochún, orisha del amor, la belleza, y el agua dulce, se asoció con:",
    "optionsEn": [
      "Saint Barbara",
      "Saint Anthony",
      "Our Lady of Charity, Cuba's national patroness",
      "Our Lady of Regla"
    ],
    "optionsEs": [
      "Santa Bárbara",
      "San Antonio",
      "Nuestra Señora de la Caridad, la patrona nacional de Cuba",
      "Nuestra Señora de Regla"
    ],
    "c": 37,
    "explEn": "Ochún became associated with Our Lady of Charity, Cuba's own national patroness, a fusion so deep many venerate both simultaneously.",
    "explEs": "Ochún se asoció con Nuestra Señora de la Caridad, la propia patrona nacional de Cuba, una fusión tan profunda que muchos veneran a ambas simultáneamente."
  },
  {
    "textEn": "4. According to Santería teaching, the supreme creator God, Olodumare or Olorun, is understood as:",
    "textEs": "4. Según la enseñanza de la Santería, el Dios creador supremo, Olodumare u Olorun, se entiende como:",
    "optionsEn": [
      "Close and directly accessible to petition",
      "Identical to a specific orisha",
      "Rejected entirely by practitioners",
      "Distant and largely inaccessible, with the orishas serving as intermediaries"
    ],
    "optionsEs": [
      "Cercano y directamente accesible a la petición",
      "Idéntico a un orisha específico",
      "Rechazado por completo por los practicantes",
      "Distante y en gran medida inaccesible, con los orishas sirviendo como intermediarios"
    ],
    "c": 45,
    "explEn": "Olodumare is understood as distant and largely inaccessible, with practical religious life centering on the orishas as intermediary spirits.",
    "explEs": "Olodumare se entiende como distante y en gran medida inaccesible, con la vida religiosa práctica centrándose en los orishas como espíritus intermediarios."
  },
  {
    "textEn": "5. According to this unit, many Santería practitioners understand their orisha devotion as:",
    "textEs": "5. Según esta unidad, muchos practicantes de la Santería entienden su devoción a los orishas como:",
    "optionsEn": [
      "An intensified, culturally specific form of Catholic saint veneration, not a competing religion",
      "A rejection of Catholicism entirely",
      "Identical to Islam",
      "A purely secular cultural practice"
    ],
    "optionsEs": [
      "Una forma intensificada y culturalmente específica de la veneración de santos católica, no una religión en competencia",
      "Un rechazo total del catolicismo",
      "Idéntica al islam",
      "Una práctica cultural puramente secular"
    ],
    "c": 49,
    "explEn": "Many practitioners sincerely consider themselves faithful Catholics, understanding orisha devotion as an intensified form of existing saint veneration rather than a separate religion.",
    "explEs": "Muchos practicantes sinceramente se consideran católicos fieles, entendiendo la devoción a los orishas como una forma intensificada de la veneración de santos existente en lugar de una religión separada."
  },
  {
    "textEn": "6. Espiritismo traces its origin to nineteenth-century France and a movement founded by:",
    "textEs": "6. El Espiritismo rastrea su origen a la Francia del siglo diecinueve y a un movimiento fundado por:",
    "optionsEn": [
      "Joseph Smith",
      "Allan Kardec",
      "Baha'u'llah",
      "Guru Nanak"
    ],
    "optionsEs": [
      "José Smith",
      "Allan Kardec",
      "Baha'u'llah",
      "El Gurú Nanak"
    ],
    "c": 57,
    "explEn": "Espiritismo was founded by Allan Kardec, the pen name of Hippolyte Léon Denizard Rivail, who codified spiritist doctrine.",
    "explEs": "El Espiritismo fue fundado por Allan Kardec, el seudónimo de Hippolyte Léon Denizard Rivail, quien codificó la doctrina espiritista."
  },
  {
    "textEn": "7. Kardec's spiritist teaching holds that human spirits:",
    "textEs": "7. La enseñanza espiritista de Kardec sostiene que los espíritus humanos:",
    "optionsEn": [
      "Cease to exist entirely at death",
      "Immediately become orishas",
      "Survive death and progress through successive reincarnations toward moral perfection",
      "Can never communicate with the living"
    ],
    "optionsEs": [
      "Dejan de existir por completo al morir",
      "Se convierten inmediatamente en orishas",
      "Sobreviven a la muerte y progresan a través de reencarnaciones sucesivas hacia la perfección moral",
      "Nunca pueden comunicarse con los vivos"
    ],
    "c": 65,
    "explEn": "Kardec taught that human spirits survive bodily death, progress through successive reincarnations toward moral perfection, and can communicate with the living through mediums.",
    "explEs": "Kardec enseñó que los espíritus humanos sobreviven a la muerte corporal, progresan a través de reencarnaciones sucesivas hacia la perfección moral, y pueden comunicarse con los vivos a través de médiums."
  },
  {
    "textEn": "8. The fusion of Espiritismo with Afro-Caribbean traditions like Santería is often called:",
    "textEs": "8. La fusión del Espiritismo con tradiciones afrocaribeñas como la Santería a menudo se llama:",
    "optionsEn": [
      "La Regla de Ocha",
      "Sanatana Dharma",
      "The Great Vehicle",
      "Espiritismo cruzado"
    ],
    "optionsEs": [
      "La Regla de Ocha",
      "Sanatana Dharma",
      "El Gran Vehículo",
      "Espiritismo cruzado"
    ],
    "c": 73,
    "explEn": "Practitioners often call this fusion 'espiritismo cruzado,' crossed spiritism.",
    "explEs": "Los practicantes a menudo llaman a esta fusión 'espiritismo cruzado.'"
  },
  {
    "textEn": "9. The mesa blanca in Cuban Espiritismo refers to:",
    "textEs": "9. La mesa blanca en el Espiritismo cubano se refiere a:",
    "optionsEn": [
      "A table draped in white cloth around which a misa espiritual is held",
      "A form of animal sacrifice",
      "The Santería initiation ceremony",
      "A Catholic communion table only"
    ],
    "optionsEs": [
      "Una mesa cubierta con tela blanca alrededor de la cual se celebra una misa espiritual",
      "Una forma de sacrificio animal",
      "La ceremonia de iniciación a la Santería",
      "Una mesa de comunión católica solamente"
    ],
    "c": 77,
    "explEn": "The mesa blanca is a table draped in white cloth around which mediums gather for the misa espiritual, receiving communication from spirits.",
    "explEs": "La mesa blanca es una mesa cubierta con tela blanca alrededor de la cual los médiums se reúnen para la misa espiritual, recibiendo comunicación de los espíritus."
  },
  {
    "textEn": "10. This unit compares the fluidity between Catholic Mass, Santería, and Espiritismo to which tradition studied earlier in this course?",
    "textEs": "10. Esta unidad compara la fluidez entre la Misa católica, la Santería, y el Espiritismo con qué tradición estudiada anteriormente en este curso?",
    "optionsEn": [
      "Islam",
      "Chinese folk religion, an integrated whole rather than separate choices",
      "Sikhism",
      "Jehovah's Witnesses"
    ],
    "optionsEs": [
      "El islam",
      "La religión popular china, un todo integrado en lugar de elecciones separadas",
      "El sijismo",
      "Los Testigos de Jehová"
    ],
    "c": 85,
    "explEn": "This unit compares this fluid movement between traditions to Chinese folk religion from Unit 6, functioning as an integrated whole rather than separate religious choices.",
    "explEs": "Esta unidad compara este movimiento fluido entre tradiciones con la religión popular china de la Unidad 6, funcionando como un todo integrado en lugar de elecciones religiosas separadas."
  },
  {
    "textEn": "11. Día de los Muertos layers pre-Columbian beliefs about the dead onto which Catholic liturgical observance?",
    "textEs": "11. El Día de los Muertos superpone creencias precolombinas acerca de los muertos sobre qué observancia litúrgica católica?",
    "optionsEn": [
      "Christmas",
      "Easter",
      "All Saints' and All Souls' Days",
      "Pentecost"
    ],
    "optionsEs": [
      "La Navidad",
      "La Pascua",
      "El Día de Todos los Santos y el Día de los Fieles Difuntos",
      "Pentecostés"
    ],
    "c": 93,
    "explEn": "Día de los Muertos layers pre-Columbian beliefs about ongoing connection with the dead onto the Catholic calendar's All Saints' and All Souls' Days.",
    "explEs": "El Día de los Muertos superpone creencias precolombinas acerca de la conexión continua con los muertos sobre el calendario católico del Día de Todos los Santos y el Día de los Fieles Difuntos."
  },
  {
    "textEn": "12. A curandero or curandera in Mexican folk religion combines herbal medicine and Catholic prayer with:",
    "textEs": "12. Un curandero o curandera en la religión popular mexicana combina medicina herbal y oración católica con:",
    "optionsEn": [
      "Formal ordination by the Catholic Church",
      "Rejection of all Catholic elements",
      "Buddhist meditation exclusively",
      "Ritual cleansing techniques resembling Cuban limpia practices"
    ],
    "optionsEs": [
      "Ordenación formal por la Iglesia Católica",
      "El rechazo de todos los elementos católicos",
      "Meditación budista exclusivamente",
      "Técnicas de limpieza ritual parecidas a las prácticas de limpia cubanas"
    ],
    "c": 101,
    "explEn": "A curandero combines herbal medicine, genuinely Catholic prayer, and ritual cleansing techniques closely resembling the limpia practices found in Cuban Espiritismo.",
    "explEs": "Un curandero combina medicina herbal, oración genuinamente católica, y técnicas de limpieza ritual estrechamente parecidas a las prácticas de limpia encontradas en el Espiritismo cubano."
  },
  {
    "textEn": "13. According to this unit, the institutional Catholic Church's official position on Santa Muerte veneration is:",
    "textEs": "13. Según esta unidad, ¿cuál es la posición oficial de la Iglesia Católica institucional sobre la veneración de la Santa Muerte?",
    "optionsEn": [
      "Explicit condemnation as incompatible with Christian faith",
      "Full official approval and endorsement",
      "Complete silence with no position at all",
      "Official recognition as a canonized saint"
    ],
    "optionsEs": [
      "Condenación explícita como incompatible con la fe cristiana",
      "Aprobación y respaldo oficial completo",
      "Silencio completo sin ninguna posición",
      "Reconocimiento oficial como santa canonizada"
    ],
    "c": 105,
    "explEn": "Santa Muerte veneration exists entirely outside institutional Catholic recognition, which has explicitly condemned the practice as incompatible with Christian faith.",
    "explEs": "La veneración de la Santa Muerte existe enteramente fuera del reconocimiento católico institucional, que ha condenado explícitamente la práctica como incompatible con la fe cristiana."
  },
  {
    "textEn": "14. According to this unit, the image of Our Lady of Guadalupe, appearing to Juan Diego in 1531, deliberately incorporated:",
    "textEs": "14. Según esta unidad, la imagen de Nuestra Señora de Guadalupe, que apareció a Juan Diego en 1531, deliberadamente incorporó:",
    "optionsEn": [
      "No indigenous elements whatsoever",
      "Visual elements meaningful within Aztec religious symbolism",
      "Elements exclusively from Spanish iconography",
      "Buddhist symbolism"
    ],
    "optionsEs": [
      "Ningún elemento indígena en absoluto",
      "Elementos visuales significativos dentro del simbolismo religioso azteca",
      "Elementos exclusivamente de la iconografía española",
      "Simbolismo budista"
    ],
    "c": 113,
    "explEn": "The image deliberately incorporated visual elements meaningful within Aztec religious symbolism, a missiological strategy that succeeded in drawing indigenous converts.",
    "explEs": "La imagen deliberadamente incorporó elementos visuales significativos dentro del simbolismo religioso azteca, una estrategia misiológica que tuvo éxito en atraer a conversos indígenas."
  },
  {
    "textEn": "15. According to 1 Corinthians 10:20, cited in this unit, what does Paul say about Gentile sacrifices?",
    "textEs": "15. Según 1 Corintios 10:20, citado en esta unidad, ¿qué dice Pablo acerca de los sacrificios gentiles?",
    "optionsEn": [
      "They are spiritually neutral cultural customs",
      "They should be studied but never named as dangerous",
      "They are sacrificed to demons, not to God",
      "They are identical to Christian worship"
    ],
    "optionsEs": [
      "Son costumbres culturales espiritualmente neutrales",
      "Deben estudiarse pero nunca nombrarse como peligrosos",
      "Se sacrifican a los demonios, no a Dios",
      "Son idénticos a la adoración cristiana"
    ],
    "c": 121,
    "explEn": "Paul writes that the things Gentiles sacrifice, they sacrifice to demons and not to God, taking seriously the spiritual reality behind pagan ritual.",
    "explEs": "Pablo escribe que lo que los gentiles sacrifican, lo sacrifican a los demonios y no a Dios, tomando en serio la realidad espiritual detrás del ritual pagano."
  },
  {
    "textEn": "16. Deuteronomy 18:10-12, cited in this unit, explicitly forbids practices including divination and:",
    "textEs": "16. Deuteronomio 18:10-12, citado en esta unidad, prohíbe explícitamente prácticas incluyendo la adivinación y:",
    "optionsEn": [
      "Honoring one's parents",
      "Reading Scripture daily",
      "Attending congregational worship",
      "Consulting the spirits of the dead"
    ],
    "optionsEs": [
      "Honrar a los propios padres",
      "Leer la Escritura diariamente",
      "Asistir a la adoración congregacional",
      "Consultar a los espíritus de los muertos"
    ],
    "c": 129,
    "explEn": "Deuteronomy 18:10-12 forbids divination, sorcery, interpreting omens, and consulting the spirits of the dead, calling all who do these things an abomination to the LORD.",
    "explEs": "Deuteronomio 18:10-12 prohíbe la adivinación, la hechicería, la interpretación de agüeros, y la consulta a los espíritus de los muertos, llamando a todos los que hacen estas cosas abominación para con el SEÑOR."
  },
  {
    "textEn": "17. According to this unit, a pastor who demands new converts erase their cultural inheritance wholesale repeats which earlier failure examined in this course?",
    "textEs": "17. Según esta unidad, ¿un pastor que exige que los nuevos conversos borren por completo su herencia cultural repite qué fracaso anterior examinado en este curso?",
    "optionsEn": [
      "The missionary failure examined regarding the Chinese Rites controversy in Unit 6",
      "Paul's approach at the Areopagus",
      "The Bereans' example in Acts 17:11",
      "The evidential apologetic method"
    ],
    "optionsEs": [
      "El fracaso misionero examinado respecto a la controversia de los Ritos Chinos en la Unidad 6",
      "El enfoque de Pablo en el Areópago",
      "El ejemplo de los bereanos en Hechos 17:11",
      "El método apologético evidencial"
    ],
    "c": 133,
    "explEn": "This unit warns against repeating the missionary failure of demanding indiscriminate abandonment of every cultural custom, examined regarding the Chinese Rites controversy in Unit 6.",
    "explEs": "Esta unidad advierte contra repetir el fracaso misionero de exigir el abandono indiscriminado de toda costumbre cultural, examinado respecto a la controversia de los Ritos Chinos en la Unidad 6."
  },
  {
    "textEn": "18. According to Acts 19:18-19, cited in this unit, new believers at Ephesus responded to their former occult practice by:",
    "textEs": "18. Según Hechos 19:18-19, citado en esta unidad, los nuevos creyentes en Éfeso respondieron a su antigua práctica oculta:",
    "optionsEn": [
      "Continuing the practice quietly alongside their new faith",
      "Publicly burning their occult books",
      "Ignoring the issue entirely",
      "Waiting several decades before any action"
    ],
    "optionsEs": [
      "Continuando la práctica en silencio junto a su nueva fe",
      "Quemando públicamente sus libros ocultos",
      "Ignorando el asunto por completo",
      "Esperando varias décadas antes de tomar cualquier acción"
    ],
    "c": 141,
    "explEn": "New believers at Ephesus publicly burned their occult books, illustrating that half-measures with genuine spiritual bondage rarely succeed.",
    "explEs": "Los nuevos creyentes en Éfeso quemaron públicamente sus libros ocultos, ilustrando que las medias medidas con la atadura espiritual genuina rara vez tienen éxito."
  },
  {
    "textEn": "19. According to this unit, a congregation member with inherited cultural association but no active practice calls for:",
    "textEs": "19. Según esta unidad, un miembro de la congregación con asociación cultural heredada pero sin práctica activa requiere:",
    "optionsEn": [
      "Immediate excommunication",
      "Complete silence on the topic forever",
      "Patient teaching and gentle discernment, distinguishing memory from invocation",
      "Mandatory deliverance ministry regardless of practice"
    ],
    "optionsEs": [
      "Excomunión inmediata",
      "Silencio completo sobre el tema para siempre",
      "Enseñanza paciente y discernimiento gentil, distinguiendo la memoria de la invocación",
      "Ministerio de liberación obligatorio sin importar la práctica"
    ],
    "c": 149,
    "explEn": "Inherited cultural association without active practice calls for patient teaching and gentle discernment, helping the believer distinguish memory from invocation.",
    "explEs": "La asociación cultural heredada sin práctica activa requiere enseñanza paciente y discernimiento gentil, ayudando al creyente a distinguir la memoria de la invocación."
  },
  {
    "textEn": "20. According to this unit's conclusion, the goal held since Unit 1 for engaging every tradition studied, including those in this unit, is:",
    "textEs": "20. Según la conclusión de esta unidad, ¿cuál es la meta sostenida desde la Unidad 1 para relacionarse con cada tradición estudiada, incluyendo las de esta unidad?",
    "optionsEn": [
      "Contempt for practitioners",
      "Silent compromise avoiding any confrontation",
      "Treating all practices as equally acceptable",
      "Patient understanding joined to clear, loving proclamation of Christ alone"
    ],
    "optionsEs": [
      "Desprecio por los practicantes",
      "Compromiso silencioso que evita toda confrontación",
      "Tratar todas las prácticas como igualmente aceptables",
      "Comprensión paciente unida a una proclamación clara y amorosa de Cristo solo"
    ],
    "c": 157,
    "explEn": "The goal remains the same combination Paul modeled at the Areopagus: patient understanding joined to clear, loving proclamation that in Christ alone sinners find what these traditions still seek.",
    "explEs": "La meta permanece la misma combinación que Pablo modeló en el Areópago: comprensión paciente unida a una proclamación clara y amorosa de que solo en Cristo los pecadores encuentran lo que estas tradiciones todavía buscan."
  }
];

const kwQuestions = [
  {
    "textEn": "21. Explain why this unit says the traditions it covers require a different kind of pastoral attention than the traditions studied in Units 2-8.",
    "textEs": "21. Explique por qué dice esta unidad que las tradiciones que cubre requieren un tipo diferente de atención pastoral que las tradiciones estudiadas en las Unidades 2-8.",
    "kw_en": ["extended family", "neighborhood", "congregation", "nominal", "layered", "confronted", "present", "distant visitor"],
    "kw_es": ["familia extendida", "vecindario", "congregación", "nominal", "superpuest", "confront", "presente", "visitante distante"],
    "modelEn": "Unlike occasional encounters with a distant visitor holding another religion, the practices in this unit are often present in the extended family, the neighborhood, and sometimes the congregation itself, layered quietly beneath a nominal Catholic or evangelical identity that has never fully confronted these older loyalties.",
    "modelEs": "A diferencia de encuentros ocasionales con un visitante distante que sostiene otra religión, las prácticas de esta unidad a menudo están presentes en la familia extendida, el vecindario, y a veces la congregación misma, superpuestas en silencio bajo una identidad católica o evangélica nominal que nunca ha confrontado del todo estas lealtades más antiguas."
  },
  {
    "textEn": "22. Describe how Santería developed as a syncretistic tradition, and give two examples of orisha-saint pairings this unit names.",
    "textEs": "22. Describa cómo se desarrolló la Santería como una tradición sincrética, y dé dos ejemplos de emparejamientos orisha-santo que nombra esta unidad.",
    "kw_en": ["yoruba", "enslaved", "baptized", "concealed", "orisha", "saint", "ochún", "changó"],
    "kw_es": ["yoruba", "esclavizado", "bautizado", "ocult", "orisha", "santo", "ochún", "changó"],
    "modelEn": "Santería developed among enslaved Yoruba people required by Spanish colonial law to be baptized Catholic; Yoruba religion survived concealed behind Catholic saint veneration, identifying each orisha with a corresponding saint. Examples include Ochún, orisha of love, paired with Our Lady of Charity, and Changó, orisha of thunder and fire, paired with Saint Barbara.",
    "modelEs": "La Santería se desarrolló entre el pueblo yoruba esclavizado requerido por la ley colonial española a ser bautizado católico; la religión yoruba sobrevivió oculta detrás de la veneración de santos católicos, identificando a cada orisha con un santo correspondiente. Ejemplos incluyen a Ochún, orisha del amor, emparejada con Nuestra Señora de la Caridad, y Changó, orisha del trueno y el fuego, emparejado con Santa Bárbara."
  },
  {
    "textEn": "23. Explain why this unit says many Santería practitioners do not understand themselves as practicing a religion competing with Catholicism, and why this self-understanding does not resolve the theological question.",
    "textEs": "23. Explique por qué dice esta unidad que muchos practicantes de la Santería no se entienden a sí mismos como practicando una religión en competencia con el catolicismo, y por qué este autoentendimiento no resuelve la cuestión teológica.",
    "kw_en": ["faithful catholics", "intensified", "sincere", "framework", "underlying question", "not resolve", "genuine", "assume"],
    "kw_es": ["católicos fieles", "intensificad", "sincer", "marco", "cuestión subyacente", "no resuelve", "genuin", "asum"],
    "modelEn": "Many practitioners sincerely consider themselves faithful Catholics, understanding orisha devotion as an intensified, culturally specific form of existing saint veneration rather than a separate religion. This sincerity does not resolve the underlying theological question of what spiritual reality actually lies behind orisha veneration, which the unit's fourth section addresses directly using 1 Corinthians 10:20.",
    "modelEs": "Muchos practicantes sinceramente se consideran católicos fieles, entendiendo la devoción a los orishas como una forma intensificada y culturalmente específica de la veneración de santos existente en lugar de una religión separada. Esta sinceridad no resuelve la cuestión teológica subyacente de qué realidad espiritual realmente está detrás de la veneración de orishas, que la cuarta sección de la unidad aborda directamente usando 1 Corintios 10:20."
  },
  {
    "textEn": "24. Describe Allan Kardec's spiritist teaching and explain what the misa espiritual and mesa blanca involve in Cuban practice.",
    "textEs": "24. Describa la enseñanza espiritista de Allan Kardec y explique lo que involucran la misa espiritual y la mesa blanca en la práctica cubana.",
    "kw_en": ["kardec", "spirits book", "reincarnation", "mediums", "misa espiritual", "mesa blanca", "trance", "communicate"],
    "kw_es": ["kardec", "libro de los espíritus", "reencarnación", "médiums", "misa espiritual", "mesa blanca", "trance", "comunic"],
    "modelEn": "Allan Kardec codified spiritist doctrine teaching human spirits survive death, progress through reincarnations toward moral perfection, and communicate through mediums. The misa espiritual is a devotional gathering, often around a white-clothed table called the mesa blanca, where mediums enter trance states to receive communication from deceased spirits and spirit guides.",
    "modelEs": "Allan Kardec codificó la doctrina espiritista enseñando que los espíritus humanos sobreviven a la muerte, progresan a través de reencarnaciones hacia la perfección moral, y se comunican a través de médiums. La misa espiritual es una reunión devocional, a menudo alrededor de una mesa cubierta de blanco llamada la mesa blanca, donde los médiums entran en estados de trance para recibir comunicación de espíritus fallecidos y guías espirituales."
  },
  {
    "textEn": "25. Explain espiritismo cruzado and why this unit compares this blending pattern to Chinese folk religion from Unit 6.",
    "textEs": "25. Explique el espiritismo cruzado y por qué esta unidad compara este patrón de mezcla con la religión popular china de la Unidad 6.",
    "kw_en": ["cruzado", "blend", "santería", "fluidly", "integrated whole", "not separate", "coherent", "single world"],
    "kw_es": ["cruzado", "mezcl", "santería", "fluidamente", "todo integrado", "no separad", "coherente", "un solo mundo"],
    "modelEn": "Espiritismo cruzado is the fusion of Espiritismo with Afro-Caribbean traditions like Santería. This unit compares it to Chinese folk religion because practitioners move fluidly between Catholic Mass, Santería ceremonies, and Espiritismo misas without experiencing them as competing choices, but as one coherent, integrated lived religious world rather than a set of separate religious selections.",
    "modelEs": "El espiritismo cruzado es la fusión del Espiritismo con tradiciones afrocaribeñas como la Santería. Esta unidad lo compara con la religión popular china porque los practicantes se mueven fluidamente entre la Misa católica, las ceremonias de Santería, y las misas de Espiritismo sin experimentarlas como elecciones en competencia, sino como un solo mundo religioso vivido, coherente e integrado en lugar de un conjunto de selecciones religiosas separadas."
  },
  {
    "textEn": "26. Describe curanderismo and Santa Muerte veneration, and explain the range of Mexican folk Catholicism this unit describes from mainstream to occult.",
    "textEs": "26. Describa el curanderismo y la veneración de la Santa Muerte, y explique el rango del catolicismo popular mexicano que describe esta unidad, desde lo convencional hasta lo oculto.",
    "kw_en": ["curandero", "susto", "mal de ojo", "santa muerte", "condemned", "guadalupe", "range", "occult"],
    "kw_es": ["curandero", "susto", "mal de ojo", "santa muerte", "condenad", "guadalupe", "rango", "oculto"],
    "modelEn": "A curandero combines herbal medicine, Catholic prayer, and ritual cleansing to address conditions like susto and mal de ojo. Santa Muerte veneration, a skeletal folk saint personifying death, has grown dramatically while being explicitly condemned by the institutional Catholic Church. This unit describes a range from mainstream Guadalupan devotion, through curanderismo practiced by faithful Catholics, to the clearly occult territory of Santa Muerte and folk magic.",
    "modelEs": "Un curandero combina medicina herbal, oración católica, y limpieza ritual para abordar condiciones como el susto y el mal de ojo. La veneración de la Santa Muerte, un santo popular esquelético que personifica la muerte, ha crecido dramáticamente mientras es explícitamente condenada por la Iglesia Católica institucional. Esta unidad describe un rango desde la devoción guadalupana convencional, a través del curanderismo practicado por católicos fieles, hasta el territorio claramente oculto de la Santa Muerte y la magia popular."
  },
  {
    "textEn": "27. Using 1 Corinthians 10:20 and Deuteronomy 18:10-12, explain why this unit says a pastor should not soften biblical seriousness into 'vague cultural relativism.'",
    "textEs": "27. Usando 1 Corintios 10:20 y Deuteronomio 18:10-12, explique por qué dice esta unidad que un pastor no debe suavizar la seriedad bíblica en un 'vago relativismo cultural.'",
    "kw_en": ["demons", "not to god", "divination", "abomination", "spiritual danger", "quaint", "soften", "seriousness"],
    "kw_es": ["demonios", "no a dios", "adivinación", "abominación", "peligro espiritual", "pintoresc", "suaviz", "seriedad"],
    "modelEn": "1 Corinthians 10:20 says Gentile sacrifices are offered to demons, not God, and Deuteronomy 18:10-12 forbids divination and consulting the dead, calling these an abomination to the LORD. This unit insists a pastor must not treat orisha initiation or spirit mediumship as merely quaint folk custom, since Scripture identifies genuine spiritual danger behind these practices rather than harmless cultural color.",
    "modelEs": "1 Corintios 10:20 dice que los sacrificios gentiles se ofrecen a los demonios, no a Dios, y Deuteronomio 18:10-12 prohíbe la adivinación y la consulta a los muertos, llamándolas abominación para con el SEÑOR. Esta unidad insiste en que un pastor no debe tratar la iniciación a los orishas o la mediumnidad espiritual como meramente una costumbre popular pintoresca, ya que la Escritura identifica peligro espiritual genuino detrás de estas prácticas en lugar de color cultural inofensivo."
  },
  {
    "textEn": "28. Distinguish cultural heritage from active spiritual practice as this unit describes them, and explain the pastoral error this unit warns against regarding cultural heritage.",
    "textEs": "28. Distinga la herencia cultural de la práctica espiritual activa según las describe esta unidad, y explique el error pastoral contra el cual advierte esta unidad respecto a la herencia cultural.",
    "kw_en": ["cultural heritage", "not sin", "active practice", "chinese rites", "erase", "wholesale", "different matter", "genuine bondage"],
    "kw_es": ["herencia cultural", "no es pecado", "práctica activa", "ritos chinos", "borr", "por completo", "asunto diferente", "atadura genuina"],
    "modelEn": "Cultural heritage — food, music, family stories — is not itself sin, and demanding converts erase it wholesale repeats the missionary failure examined regarding the Chinese Rites controversy in Unit 6. Genuine active spiritual practice — ongoing orisha initiation, misa participation, Santa Muerte veneration — is a different matter requiring clear confrontation with idolatry, since these often involve real spiritual bondage.",
    "modelEs": "La herencia cultural — la comida, la música, las historias familiares — no es en sí misma pecado, y exigir que los conversos la borren por completo repite el fracaso misionero examinado respecto a la controversia de los Ritos Chinos en la Unidad 6. La práctica espiritual activa genuina — la iniciación continua a los orishas, la participación en misas, la veneración de la Santa Muerte — es un asunto diferente que requiere confrontación clara con la idolatría, ya que a menudo involucran atadura espiritual real."
  },
  {
    "textEn": "29. Describe the three distinct pastoral situations this unit identifies, and the response appropriate to each.",
    "textEs": "29. Describa las tres situaciones pastorales distintas que identifica esta unidad, y la respuesta apropiada para cada una.",
    "kw_en": ["inherited association", "patient teaching", "coming out", "deliverance", "blend profession", "truthful confrontation", "three situations", "process"],
    "kw_es": ["asociación heredada", "enseñanza paciente", "saliendo", "liberación", "mezcla profesión", "confrontación veraz", "tres situaciones", "proceso"],
    "modelEn": "First, a member with inherited cultural association but no active practice needs patient teaching distinguishing memory from invocation. Second, a new believer coming out of active practice needs full pastoral care including deliverance prayer, discipleship, and community support through a process. Third, a member blending Christian profession with ongoing practice needs the same patient, truthful confrontation Paul modeled at Corinth, refusing to pretend the blend is neutral while remaining genuinely pastoral.",
    "modelEs": "Primero, un miembro con asociación cultural heredada pero sin práctica activa necesita enseñanza paciente que distinga la memoria de la invocación. Segundo, un nuevo creyente que sale de la práctica activa necesita cuidado pastoral completo incluyendo oración de liberación, discipulado, y apoyo comunitario a través de un proceso. Tercero, un miembro que mezcla la profesión cristiana con la práctica continua necesita la misma confrontación paciente y veraz que Pablo modeló en Corinto, negándose a fingir que la mezcla es neutral mientras permanece genuinamente pastoral."
  },
  {
    "textEn": "30. Synthesize this unit: explain why the pastoral approach it commends is neither contempt nor compromise, using the Areopagus pattern established in Unit 1.",
    "textEs": "30. Sintetice esta unidad: explique por qué el enfoque pastoral que recomienda no es ni desprecio ni compromiso, usando el patrón del Areópago establecido en la Unidad 1.",
    "kw_en": ["neither contempt", "compromise", "patient understanding", "loving proclamation", "christ alone", "still searching", "combination", "areopagus"],
    "kw_es": ["ni desprecio", "compromiso", "comprensión paciente", "proclamación amorosa", "cristo solo", "todavía buscando", "combinación", "areópago"],
    "modelEn": "This unit's approach is neither contempt, which would dismiss sincere devotion with mockery, nor compromise, which would pretend these practices are spiritually neutral. Following Paul's pattern at the Areopagus from Unit 1, it combines patient understanding of what practitioners actually believe with clear, loving proclamation that in Christ alone, not any orisha, spirit guide, or folk saint, sinners find the forgiveness and protection every tradition studied is still searching for.",
    "modelEs": "El enfoque de esta unidad no es ni desprecio, que descartaría la devoción sincera con burla, ni compromiso, que fingiría que estas prácticas son espiritualmente neutrales. Siguiendo el patrón de Pablo en el Areópago de la Unidad 1, combina comprensión paciente de lo que los practicantes realmente creen con una proclamación clara y amorosa de que solo en Cristo, no en ningún orisha, guía espiritual, o santo popular, los pecadores encuentran el perdón y la protección que cada tradición estudiada todavía busca."
  }
];

const PREV_HREF = 'CTSWRUnit10.html';

const NEXT_HREF = 'CTSWRUnit12.html';
