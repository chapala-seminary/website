/* CTSPM - unit 2: per-unit configuration and content. */

const UNIT = 2;

let currentUnit = 2;

const mcQuestions = [
  {
    "textEn": "1. The two pillars of pastoral ministry are:",
    "textEs": "1. Los dos pilares del ministerio pastoral son:",
    "optionsEn": [
      "Education and experience",
      "Charisma and confidence",
      "Calling and character",
      "Preaching and prayer"
    ],
    "optionsEs": [
      "Educación y experiencia",
      "Carisma y confianza",
      "Llamado y carácter",
      "Predicación y oración"
    ],
    "c": 23,
    "explEn": "The two pillars are calling (the divine summons) and character (the life that sustains a man in the office).",
    "explEs": "Los dos pilares son el llamado (la convocatoria divina) y el carácter (la vida que sostiene al hombre en el oficio)."
  },
  {
    "textEn": "2. Isaiah received his call:",
    "textEs": "2. Isaías recibió su llamado:",
    "optionsEn": [
      "At Mount Sinai",
      "In the year King Uzziah died",
      "On the road to Damascus",
      "At his father's farm"
    ],
    "optionsEs": [
      "En el monte Sinaí",
      "En el año que murió el rey Uzías",
      "En el camino a Damasco",
      "En la granja de su padre"
    ],
    "c": 29,
    "explEn": "Isaiah was called 'in the year King Uzziah died,' when the throne was vacant and the nation anxious.",
    "explEs": "Isaías fue llamado 'en el año que murió el rey Uzías,' cuando el trono estaba vacante y la nación ansiosa."
  },
  {
    "textEn": "3. Isaiah's first response to seeing the Lord was:",
    "textEs": "3. La primera respuesta de Isaías al ver al Señor fue:",
    "optionsEn": [
      "\"Woe is me, for I am undone\"",
      "\"Here am I, send me\"",
      "Joy and excitement",
      "\"Who am I that I should go?\""
    ],
    "optionsEs": [
      "\"¡Ay de mí! que soy muerto\"",
      "\"Heme aquí, envíame a mí\"",
      "Gozo y entusiasmo",
      "\"¿Quién soy yo para que vaya?\""
    ],
    "c": 35,
    "explEn": "Isaiah's first response was undoing — 'Woe is me, for I am undone' — not enthusiasm.",
    "explEs": "La primera respuesta de Isaías fue deshacerse — '¡Ay de mí! que soy muerto' — no entusiasmo."
  },
  {
    "textEn": "4. Which of these biblical figures DID NOT initially resist their call?",
    "textEs": "4. ¿Cuál de estas figuras bíblicas NO resistió inicialmente su llamado?",
    "optionsEn": [
      "Moses",
      "Jeremiah",
      "Amos",
      "Paul"
    ],
    "optionsEs": [
      "Moisés",
      "Jeremías",
      "Amós",
      "Pablo"
    ],
    "c": 45,
    "explEn": "Paul is the exception; Moses, Jeremiah, and Amos all initially resisted their call.",
    "explEs": "Pablo es la excepción; Moisés, Jeremías y Amós todos resistieron inicialmente su llamado."
  },
  {
    "textEn": "5. The internal call is best described as:",
    "textEs": "5. El llamado interno se describe mejor como:",
    "optionsEn": [
      "Academic credentials",
      "Desire, burden, and gifting awakened by the Spirit",
      "Family approval",
      "Denominational endorsement"
    ],
    "optionsEs": [
      "Credenciales académicas",
      "Deseo, carga y don despertados por el Espíritu",
      "Aprobación familiar",
      "Respaldo denominacional"
    ],
    "c": 50,
    "explEn": "The internal call is desire, burden, and gifting awakened by the Spirit — a holy ache, not a casual interest.",
    "explEs": "El llamado interno es deseo, carga y don despertados por el Espíritu — un anhelo santo, no un interés casual."
  },
  {
    "textEn": "6. The external call is confirmed through:",
    "textEs": "6. El llamado externo se confirma por medio de:",
    "optionsEn": [
      "Personal feelings alone",
      "Political success",
      "The church's affirmation",
      "Financial offerings"
    ],
    "optionsEs": [
      "Sentimientos personales solamente",
      "Éxito político",
      "La afirmación de la iglesia",
      "Ofrendas financieras"
    ],
    "c": 58,
    "explEn": "The external call is confirmed by the church's affirmation, not by personal feelings alone.",
    "explEs": "El llamado externo se confirma por la afirmación de la iglesia, no por sentimientos personales solamente."
  },
  {
    "textEn": "7. In Acts 13, who commissioned Barnabas and Saul?",
    "textEs": "7. En Hechos 13, ¿quién comisionó a Bernabé y Saulo?",
    "optionsEn": [
      "The Antioch church through prayer and fasting",
      "The Roman emperor",
      "The Jerusalem council",
      "King Herod"
    ],
    "optionsEs": [
      "La iglesia de Antioquía mediante oración y ayuno",
      "El emperador romano",
      "El concilio de Jerusalén",
      "El rey Herodes"
    ],
    "c": 63,
    "explEn": "In Acts 13 the Antioch church commissioned Barnabas and Saul through prayer and fasting.",
    "explEs": "En Hechos 13 la iglesia de Antioquía comisionó a Bernabé y Saulo mediante oración y ayuno."
  },
  {
    "textEn": "8. The umbrella qualification over the elder lists in 1 Timothy 3 and Titus 1 is:",
    "textEs": "8. La cualificación paraguas sobre las listas de ancianos en 1 Timoteo 3 y Tito 1 es:",
    "optionsEn": [
      "Able to preach",
      "Well-educated",
      "Above reproach",
      "Financially successful"
    ],
    "optionsEs": [
      "Apto para predicar",
      "Bien educado",
      "Irreprensible",
      "Financieramente exitoso"
    ],
    "c": 72,
    "explEn": "'Above reproach' is the umbrella over every elder qualification in 1 Timothy 3 and Titus 1.",
    "explEs": "'Irreprensible' es el paraguas sobre cada cualificación del anciano en 1 Timoteo 3 y Tito 1."
  },
  {
    "textEn": "9. What is striking about what is NOT on the elder qualifications list?",
    "textEs": "9. ¿Qué es notable sobre lo que NO está en la lista de cualificaciones del anciano?",
    "optionsEn": [
      "Character traits",
      "Family leadership",
      "Teaching ability",
      "Charisma and entertainment skills"
    ],
    "optionsEs": [
      "Rasgos de carácter",
      "Liderazgo familiar",
      "Capacidad de enseñanza",
      "Carisma y habilidades de entretenimiento"
    ],
    "c": 80,
    "explEn": "Strikingly absent from the lists are charisma and entertainment skills — the qualifications are about character.",
    "explEs": "Notablemente ausentes de las listas están el carisma y las habilidades de entretenimiento — las cualificaciones son de carácter."
  },
  {
    "textEn": "10. The ermine illustration teaches that:",
    "textEs": "10. La ilustración del armiño enseña que:",
    "optionsEn": [
      "Animals are smarter than people",
      "Appearance matters most",
      "Character will not compromise even at the cost of life",
      "Hunters always win"
    ],
    "optionsEs": [
      "Los animales son más inteligentes que las personas",
      "La apariencia importa más",
      "El carácter no transige aun al costo de la vida",
      "Los cazadores siempre ganan"
    ],
    "c": 86,
    "explEn": "The ermine, which faces death rather than soil its coat, pictures character that will not compromise.",
    "explEs": "El armiño, que enfrenta la muerte antes que ensuciar su pelaje, retrata el carácter que no transige."
  },
  {
    "textEn": "11. Tetzel's selling of indulgences inspired:",
    "textEs": "11. La venta de indulgencias por Tetzel inspiró:",
    "optionsEn": [
      "The Crusades",
      "Martin Luther's 95 Theses",
      "The Council of Trent",
      "The founding of the Jesuits"
    ],
    "optionsEs": [
      "Las Cruzadas",
      "Las 95 Tesis de Martín Lutero",
      "El Concilio de Trento",
      "La fundación de los Jesuitas"
    ],
    "c": 92,
    "explEn": "Tetzel's sale of indulgences provoked Martin Luther's 95 Theses and the Reformation.",
    "explEs": "La venta de indulgencias por Tetzel provocó las 95 Tesis de Martín Lutero y la Reforma."
  },
  {
    "textEn": "12. Amos's plumb line vision teaches that:",
    "textEs": "12. La visión de la plomada de Amós enseña que:",
    "optionsEn": [
      "God measures His people's faithfulness against the unchanging line of His Word",
      "Amos was a builder",
      "Amos was a carpenter",
      "Amos traveled in straight lines"
    ],
    "optionsEs": [
      "Dios mide la fidelidad de Su pueblo contra la línea inmutable de Su Palabra",
      "Amós era constructor",
      "Amós era carpintero",
      "Amós viajaba en líneas rectas"
    ],
    "c": 98,
    "explEn": "Amos's plumb line shows God measuring His people against the unchanging line of His Word.",
    "explEs": "La plomada de Amós muestra a Dios midiendo a Su pueblo contra la línea inmutable de Su Palabra."
  },
  {
    "textEn": "13. The hidden life of the pastor is sustained primarily by:",
    "textEs": "13. La vida oculta del pastor se sostiene principalmente por:",
    "optionsEn": [
      "Public attention",
      "Denominational politics",
      "Spiritual disciplines",
      "Academic conferences"
    ],
    "optionsEs": [
      "Atención pública",
      "Política denominacional",
      "Disciplinas espirituales",
      "Conferencias académicas"
    ],
    "c": 107,
    "explEn": "The pastor's hidden life is sustained primarily by spiritual disciplines the congregation never sees.",
    "explEs": "La vida oculta del pastor se sostiene principalmente por disciplinas espirituales que la congregación nunca ve."
  },
  {
    "textEn": "14. The iceberg illustration teaches that:",
    "textEs": "14. La ilustración del iceberg enseña que:",
    "optionsEn": [
      "Icebergs are dangerous",
      "Surface winds and deep ocean currents pull in different directions; the deep currents must rule",
      "Most icebergs are unseen",
      "Icebergs melt slowly"
    ],
    "optionsEs": [
      "Los icebergs son peligrosos",
      "Los vientos de superficie y las corrientes profundas tiran en direcciones diferentes; las corrientes profundas deben reinar",
      "La mayoría de los icebergs no se ven",
      "Los icebergs se derriten lentamente"
    ],
    "c": 113,
    "explEn": "The iceberg shows that deep currents, not surface winds, must rule the pastor's life.",
    "explEs": "El iceberg muestra que las corrientes profundas, no los vientos de superficie, deben gobernar la vida del pastor."
  },
  {
    "textEn": "15. According to 1 Timothy 3:4-5, family leadership is:",
    "textEs": "15. Según 1 Timoteo 3:4-5, el liderazgo familiar es:",
    "optionsEn": [
      "Optional for pastors",
      "Less important than preaching",
      "The deacon's responsibility",
      "The testing ground for whether a man can lead the church"
    ],
    "optionsEs": [
      "Opcional para pastores",
      "Menos importante que la predicación",
      "Responsabilidad del diácono",
      "El campo de prueba para saber si un hombre puede dirigir la iglesia"
    ],
    "c": 122,
    "explEn": "Family leadership is the testing ground for whether a man can lead the church (1 Timothy 3:4-5).",
    "explEs": "El liderazgo familiar es el campo de prueba de si un hombre puede dirigir la iglesia (1 Timoteo 3:4-5)."
  },
  {
    "textEn": "16. The five most common pastoral wrecks are:",
    "textEs": "16. Los cinco naufragios pastorales más comunes son:",
    "optionsEn": [
      "Pride, lust, money, isolation, discouragement",
      "Poor preaching and weak prayer",
      "Lack of education",
      "Denominational politics"
    ],
    "optionsEs": [
      "Orgullo, lujuria, dinero, aislamiento, desánimo",
      "Predicación pobre y oración débil",
      "Falta de educación",
      "Política denominacional"
    ],
    "c": 126,
    "explEn": "The five common pastoral wrecks are pride, lust, money, isolation, and discouragement.",
    "explEs": "Los cinco naufragios pastorales comunes son orgullo, lujuria, dinero, aislamiento y desánimo."
  },
  {
    "textEn": "17. The answer to the dark side of ministry is:",
    "textEs": "17. La respuesta al lado oscuro del ministerio es:",
    "optionsEn": [
      "Honest self-examination with trusted accountability",
      "Denial and pretense",
      "More activity",
      "Quitting the ministry"
    ],
    "optionsEs": [
      "Auto-examen honesto con rendición de cuentas confiable",
      "Negación y fingimiento",
      "Más actividad",
      "Abandonar el ministerio"
    ],
    "c": 133,
    "explEn": "The answer to the dark side is honest self-examination with trusted accountability, never denial.",
    "explEs": "La respuesta al lado oscuro es el autoexamen honesto con rendición de cuentas confiable, nunca la negación."
  },
  {
    "textEn": "18. James 3:1 reminds us that teachers will receive:",
    "textEs": "18. Santiago 3:1 nos recuerda que los maestros recibirán:",
    "optionsEn": [
      "Higher salaries",
      "An easier path",
      "Exemption from criticism",
      "Stricter judgment"
    ],
    "optionsEs": [
      "Salarios más altos",
      "Un camino más fácil",
      "Exención de crítica",
      "Mayor condenación"
    ],
    "c": 143,
    "explEn": "James 3:1 reminds us that those who teach will receive a stricter judgment.",
    "explEs": "Santiago 3:1 nos recuerda que los que enseñan recibirán mayor condenación."
  },
  {
    "textEn": "19. The pastor's home is described in 1 Timothy 3 as:",
    "textEs": "19. El hogar del pastor es descrito en 1 Timoteo 3 como:",
    "optionsEn": [
      "An optional concern",
      "The testing ground for church leadership",
      "A private matter",
      "Less important than the pulpit"
    ],
    "optionsEs": [
      "Una preocupación opcional",
      "El campo de prueba para el liderazgo de la iglesia",
      "Un asunto privado",
      "Menos importante que el púlpito"
    ],
    "c": 148,
    "explEn": "The pastor's home is described as the testing ground for church leadership.",
    "explEs": "El hogar del pastor se describe como el campo de prueba para el liderazgo de la iglesia."
  },
  {
    "textEn": "20. The promise to the faithful pastor at the end of his ministry is:",
    "textEs": "20. La promesa al pastor fiel al final de su ministerio es:",
    "optionsEn": [
      "Worldly fame",
      "Large congregations",
      "Denominational promotion",
      "The crown of glory that does not fade away from the Chief Shepherd"
    ],
    "optionsEs": [
      "Fama mundana",
      "Congregaciones grandes",
      "Promoción denominacional",
      "La corona incorruptible de gloria del Príncipe de los pastores"
    ],
    "c": 157,
    "explEn": "The faithful pastor's promise is the unfading crown of glory from the Chief Shepherd.",
    "explEs": "La promesa al pastor fiel es la corona incorruptible de gloria del Príncipe de los pastores."
  }
];

const kwQuestions = [
  {
    "textEn": "21. Explain why both calling and character are essential pillars for pastoral ministry. What happens when one is missing?",
    "textEs": "21. Explique por qué tanto el llamado como el carácter son pilares esenciales del ministerio pastoral. ¿Qué sucede cuando uno falta?",
    "kw_en": [
      "call",
      "character",
      "pillar",
      "missing",
      "fall",
      "both",
      "office",
      "sustain"
    ],
    "kw_es": [
      "llam",
      "carácter",
      "pilar",
      "falta",
      "cae",
      "ambos",
      "oficio",
      "sostiene"
    ],
    "modelEn": "Pastoral ministry stands on two pillars: the call, which is the divine summons placing a man in the office, and character, the inward life that sustains him there. Both are essential — take away either and the building falls. A man with a strong call but weak character will scandalize the gospel before he is forty; a man with strong character but no genuine call will wear himself out doing what God never asked of him. The world wants charisma and platforms, but God demands character and purity. The pulpit is no place for the unsent, and no place for the unprepared in soul.",
    "modelEs": "El ministerio pastoral se sostiene sobre dos pilares: el llamado, que es la convocatoria divina que coloca a un hombre en el oficio, y el carácter, la vida interior que lo sostiene allí. Ambos son esenciales — quite cualquiera de los dos y el edificio cae. Un hombre con un llamado fuerte pero carácter débil escandalizará al evangelio antes de los cuarenta; un hombre con carácter fuerte pero sin un llamado genuino se agotará haciendo lo que Dios nunca le pidió. El mundo quiere carisma y plataformas, pero Dios exige carácter y pureza. El púlpito no es lugar para el no enviado, ni lugar para el no preparado en alma."
  },
  {
    "textEn": "22. Compare Moses, Jeremiah, and Amos in how they responded to God's call. What lesson does this teach about God's choice of leaders?",
    "textEs": "22. Compare a Moisés, Jeremías y Amós en cómo respondieron al llamado de Dios. ¿Qué lección enseña esto sobre la elección de líderes por parte de Dios?",
    "kw_en": [
      "moses",
      "jeremiah",
      "amos",
      "resist",
      "unworthy",
      "weak",
      "choose",
      "grace"
    ],
    "kw_es": [
      "moisés",
      "jeremías",
      "amós",
      "resist",
      "indigno",
      "débil",
      "escoge",
      "gracia"
    ],
    "modelEn": "Moses asked 'Who am I?', Jeremiah protested 'I am a youth,' and Amos insisted he was no prophet but a herdsman — almost every man God calls in Scripture initially resists. This teaches that God does not normally choose the eager and self-confident, but the man who feels least qualified. That very sense of unworthiness is part of how God prepares a man to lean on grace rather than on himself for the rest of his ministry. The men who were quick to volunteer often failed; the ones who hesitated and felt weak lasted forty and fifty years. God's choice of leaders runs opposite to the world's, which prizes the strong and the sure.",
    "modelEs": "Moisés preguntó '¿Quién soy yo?', Jeremías protestó 'soy niño,' y Amós insistió en que no era profeta sino boyero — casi todo hombre que Dios llama en la Escritura inicialmente resiste. Esto enseña que Dios normalmente no escoge a los entusiastas y seguros de sí mismos, sino al hombre que se siente menos calificado. Ese mismo sentido de indignidad es parte de cómo Dios prepara a un hombre para apoyarse en la gracia y no en sí mismo por el resto de su ministerio. Los hombres que se ofrecieron rápido a menudo fracasaron; los que vacilaron y se sintieron débiles duraron cuarenta y cincuenta años. La elección de líderes por parte de Dios va al revés de la del mundo, que premia al fuerte y al seguro."
  },
  {
    "textEn": "23. Discuss the relationship between the internal call (the Spirit's witness) and the external call (the church's confirmation). Why must both be present?",
    "textEs": "23. Discuta la relación entre el llamado interno (testimonio del Espíritu) y el llamado externo (confirmación de la iglesia). ¿Por qué deben estar ambos presentes?",
    "kw_en": [
      "internal",
      "external",
      "spirit",
      "church",
      "confirm",
      "both",
      "witness",
      "affirm"
    ],
    "kw_es": [
      "interno",
      "externo",
      "espíritu",
      "iglesia",
      "confirm",
      "ambos",
      "testimonio",
      "afirm"
    ],
    "modelEn": "The internal call is the inward witness of the Spirit — a holy combination of desire, burden, and gifting that will not let a man go. The external call is the church's confirmation, when a body of mature believers recognizes and affirms what the Spirit has already begun, as in Acts 13 when Antioch laid hands on Barnabas and Saul. Both must be present, because God does not normally give the call to a man and hide it from His church. When a man feels called but no congregation, presbytery, or group of mature believers will confirm it, he should pause long and hard before insisting he is right and they are wrong. The two work together; when they do not, something is usually wrong with the man.",
    "modelEs": "El llamado interno es el testimonio interior del Espíritu — una santa combinación de deseo, carga y don que no suelta a un hombre. El llamado externo es la confirmación de la iglesia, cuando un cuerpo de creyentes maduros reconoce y afirma lo que el Espíritu ya ha comenzado, como en Hechos 13 cuando Antioquía impuso las manos sobre Bernabé y Saulo. Ambos deben estar presentes, porque Dios normalmente no le da el llamado a un hombre y lo esconde de Su iglesia. Cuando un hombre se siente llamado pero ninguna congregación, presbiterio o grupo de creyentes maduros lo confirma, debe detenerse mucho antes de insistir en que él tiene razón y ellos están equivocados. Los dos trabajan juntos; cuando no lo hacen, usualmente algo está mal con el hombre."
  },
  {
    "textEn": "24. Examine the elder qualifications in 1 Timothy 3 and Titus 1. What is striking about what is NOT on these lists?",
    "textEs": "24. Examine las cualificaciones del anciano en 1 Timoteo 3 y Tito 1. ¿Qué es notable sobre lo que NO está en estas listas?",
    "kw_en": [
      "reproach",
      "character",
      "charisma",
      "skill",
      "qualif",
      "elder",
      "mature",
      "absent"
    ],
    "kw_es": [
      "irreprensible",
      "carácter",
      "carisma",
      "habilidad",
      "cualific",
      "anciano",
      "maduro",
      "ausente"
    ],
    "modelEn": "The elder qualifications in 1 Timothy 3 and Titus 1 are gathered under one umbrella phrase: above reproach. What is striking is what is absent from the lists — nothing about charisma, nothing about being entertaining, nothing about a degree, nothing about being a great speaker or having church-growth strategies. Almost every qualification is about character, not skill: the man's marriage, money, speech, temper, and reputation brought under the lordship of Christ. The biblical qualifications are essentially the marks of a grown-up Christian. This rebukes a modern church culture that hires for talent and platform while assuming character will sort itself out.",
    "modelEs": "Las cualificaciones del anciano en 1 Timoteo 3 y Tito 1 se reúnen bajo una frase paraguas: irreprensible. Lo notable es lo que está ausente de las listas — nada sobre carisma, nada sobre ser entretenido, nada sobre un título, nada sobre ser un gran orador o tener estrategias de crecimiento. Casi toda cualificación es sobre carácter, no habilidad: el matrimonio del hombre, su dinero, su palabra, su temperamento y su reputación puestos bajo el señorío de Cristo. Las cualificaciones bíblicas son esencialmente las marcas de un cristiano maduro. Esto reprende a una cultura eclesial moderna que contrata por talento y plataforma asumiendo que el carácter se arreglará solo."
  },
  {
    "textEn": "25. Apply the ermine illustration to pastoral character. What does it teach about compromise and integrity?",
    "textEs": "25. Aplique la ilustración del armiño al carácter pastoral. ¿Qué enseña sobre el compromiso y la integridad?",
    "kw_en": [
      "ermine",
      "character",
      "compromise",
      "integrity",
      "clean",
      "cost",
      "refuse",
      "value"
    ],
    "kw_es": [
      "armiño",
      "carácter",
      "compromiso",
      "integridad",
      "limpio",
      "costo",
      "rehúsa",
      "valor"
    ],
    "modelEn": "The ermine is a small white animal that values the cleanness of its coat above its own life; hunters smear its den with dirt, and rather than enter the filth to escape the dogs, the ermine turns and faces death. That is a parable of pastoral character: the man called to this office must value the cleanness of his life more than his own comfort, safety, or preferences. There is a place he will not go, a thing he will not say, a profit he will not take, a flattery he will not accept — even if refusing costs him dearly. Character is exactly this refusal to compromise integrity for advantage. The white coat is worth more than the easy escape.",
    "modelEs": "El armiño es un pequeño animal blanco que valora la limpieza de su pelaje por encima de su propia vida; los cazadores ensucian su guarida con lodo, y antes que entrar en la suciedad para escapar de los perros, el armiño se vuelve y enfrenta la muerte. Esa es una parábola del carácter pastoral: el hombre llamado a este oficio debe valorar la limpieza de su vida más que su propia comodidad, seguridad o preferencias. Hay un lugar a donde no irá, una cosa que no dirá, una ganancia que no tomará, una adulación que no aceptará — aunque rehusarlo le cueste caro. El carácter es exactamente este rechazo a comprometer la integridad por ventaja. El pelaje blanco vale más que el escape fácil."
  },
  {
    "textEn": "26. Why is Amos's plumb line a fitting symbol for pastoral accountability? How should pastors apply this image to their lives?",
    "textEs": "26. ¿Por qué es la plomada de Amós un símbolo adecuado de la rendición de cuentas pastoral? ¿Cómo deben los pastores aplicar esta imagen a sus vidas?",
    "kw_en": [
      "plumb",
      "amos",
      "measure",
      "word",
      "account",
      "straight",
      "unchang",
      "vertical"
    ],
    "kw_es": [
      "plomada",
      "amós",
      "medir",
      "palabra",
      "cuenta",
      "recto",
      "inmutable",
      "vertical"
    ],
    "modelEn": "Amos saw the Lord standing on a wall with a plumb line in His hand — a weighted string builders use to find true vertical. A plumb line does not bend to the carpenter's whim or adjust to fashion; it hangs true, and all the work must line up with it. God said He was setting a plumb line in the midst of His people, and that is a fitting symbol for pastoral accountability. The pastor lives under the plumb line, measuring himself, his marriage, his money, his speech, his preaching, and his motives against the unchanging line of God's Word. The man who refuses to measure himself by it will eventually build a crooked life; the man who lives under it builds a life that lasts.",
    "modelEs": "Amós vio al Señor de pie sobre un muro con una plomada en Su mano — un cordel con peso que los albañiles usan para hallar la vertical exacta. Una plomada no se dobla al capricho del carpintero ni se ajusta a la moda; cuelga verdadera, y toda la obra debe alinearse con ella. Dios dijo que ponía una plomada en medio de Su pueblo, y ese es un símbolo adecuado de la rendición de cuentas pastoral. El pastor vive bajo la plomada, midiéndose a sí mismo, su matrimonio, su dinero, su palabra, su predicación y sus motivos contra la línea inmutable de la Palabra de Dios. El hombre que rehúsa medirse por ella eventualmente edificará una vida torcida; el que vive bajo ella edifica una vida que dura."
  },
  {
    "textEn": "27. Discuss the iceberg illustration: surface winds versus deep ocean currents. How does this apply to the pastor's hidden spiritual disciplines?",
    "textEs": "27. Discuta la ilustración del iceberg: vientos de superficie versus corrientes oceánicas profundas. ¿Cómo se aplica esto a las disciplinas espirituales ocultas del pastor?",
    "kw_en": [
      "iceberg",
      "surface",
      "deep",
      "current",
      "discipline",
      "hidden",
      "wind",
      "anchor"
    ],
    "kw_es": [
      "iceberg",
      "superficie",
      "profund",
      "corriente",
      "disciplina",
      "oculto",
      "viento",
      "ancla"
    ],
    "modelEn": "Icebergs are pulled by two forces: surface winds that push the small ones around, and deep ocean currents that carry the great masses steadily, even against the wind. The pastor's life is subject to the same two forces — the surface winds are the criticism, the unexpected funeral, the deacon who quit, the donor who left; the deep current is the unchanging purpose and love of God. When a pastor is carried by the deep current, the surface winds do not throw him off course; when he is moved only by the surface, every storm sends him sideways. Hidden spiritual disciplines — the daily Word, private prayer, Sabbath rest, accountability, self-examination, and confession — are how a man drops his anchor into the deep current. The congregation never sees them, but they are what keep him steady over thirty years.",
    "modelEs": "Los icebergs son arrastrados por dos fuerzas: los vientos de superficie que empujan a los pequeños, y las corrientes oceánicas profundas que llevan las grandes masas con firmeza, aun contra el viento. La vida del pastor está sujeta a las mismas dos fuerzas — los vientos de superficie son la crítica, el funeral inesperado, el diácono que renunció, el donante que se fue; la corriente profunda es el propósito y el amor inmutable de Dios. Cuando un pastor es llevado por la corriente profunda, los vientos de superficie no lo desvían; cuando es movido solo por la superficie, cada tormenta lo lanza de lado. Las disciplinas espirituales ocultas — la Palabra diaria, la oración privada, el descanso sabático, la rendición de cuentas, el autoexamen y la confesión — son cómo un hombre echa su ancla en la corriente profunda. La congregación nunca las ve, pero son lo que lo mantiene estable durante treinta años."
  },
  {
    "textEn": "28. Explain why the pastor's family is the testing ground for his church leadership (1 Timothy 3:4-5). What practical wisdom flows from this?",
    "textEs": "28. Explique por qué la familia del pastor es el campo de prueba para su liderazgo en la iglesia (1 Timoteo 3:4-5). ¿Qué sabiduría práctica fluye de esto?",
    "kw_en": [
      "family",
      "home",
      "testing",
      "lead",
      "church",
      "present",
      "wife",
      "children"
    ],
    "kw_es": [
      "familia",
      "hogar",
      "prueba",
      "dirig",
      "iglesia",
      "presente",
      "esposa",
      "hijos"
    ],
    "modelEn": "Paul ties family leadership to church leadership: if a man does not know how to rule his own house, how will he take care of the church of God? The home is the testing ground — whatever a man cannot do at his own kitchen table, he cannot do in the pulpit either, and whatever spiritual leadership is missing from the dinner conversation will eventually be missing from the morning service. This is not a demand for perfect children, since they grow up and make their own choices; the point is faithfulness of function, not perfection of outcome. Is the pastor present in his home, leading his wife in love, discipling his children in the truth? The practical wisdom is to protect family rhythms — date nights, family meals, real vacations, a weekly day off — because ministry never lacks for 'emergencies,' most of which are not emergencies at all.",
    "modelEs": "Pablo ata el liderazgo familiar al liderazgo eclesial: si un hombre no sabe gobernar su propia casa, ¿cómo cuidará de la iglesia de Dios? El hogar es el campo de prueba — lo que un hombre no puede hacer en su propia mesa de cocina, tampoco puede hacerlo en el púlpito, y cualquier liderazgo espiritual que falte en la conversación de la cena eventualmente faltará en el servicio de la mañana. Esto no es una exigencia de hijos perfectos, pues crecen y toman sus propias decisiones; el punto es la fidelidad de la función, no la perfección del resultado. ¿Está el pastor presente en su hogar, dirigiendo a su esposa en amor, discipulando a sus hijos en la verdad? La sabiduría práctica es proteger los ritmos familiares — citas, comidas familiares, vacaciones reales, un día libre semanal — porque el ministerio nunca carece de 'emergencias,' la mayoría de las cuales no son emergencias en absoluto."
  },
  {
    "textEn": "29. Identify the five great wrecks of pastoral ministry and explain how each one operates. What is the antidote?",
    "textEs": "29. Identifique los cinco grandes naufragios del ministerio pastoral y explique cómo opera cada uno. ¿Cuál es el antídoto?",
    "kw_en": [
      "pride",
      "lust",
      "money",
      "isolation",
      "discourage",
      "wreck",
      "account",
      "antidote"
    ],
    "kw_es": [
      "orgullo",
      "lujuria",
      "dinero",
      "aislamiento",
      "desánimo",
      "naufragio",
      "cuenta",
      "antídoto"
    ],
    "modelEn": "The five great wrecks of pastoral ministry are nearly always the same: pride, lust, money, isolation, and discouragement. Pride whispers that the man is now too successful to need accountability. Lust finds its ground in long hours, the emotional intimacy of counseling, and the easy access of digital temptation. Money corrupts when the salary or the praise of donors begins to shape the preaching. Isolation is the soil in which all the others grow — the pastor with no peers and no one to speak truth to him is one bad decision from disaster. Discouragement is the slow erosion of small Sundays and members who leave. The antidote to all five is honest, regular, ruthless self-examination before the Lord with one or two trusted brothers who know the dark places and pray about them by name.",
    "modelEs": "Los cinco grandes naufragios del ministerio pastoral son casi siempre los mismos: orgullo, lujuria, dinero, aislamiento y desánimo. El orgullo susurra que el hombre ahora es demasiado exitoso para necesitar rendición de cuentas. La lujuria encuentra su terreno en las largas horas, la intimidad emocional de la consejería y el fácil acceso de la tentación digital. El dinero corrompe cuando el salario o el elogio de los donantes empieza a moldear la predicación. El aislamiento es el suelo en el que crecen todos los demás — el pastor sin pares y sin nadie que le hable verdad está a una mala decisión del desastre. El desánimo es la erosión lenta de domingos pequeños y miembros que se van. El antídoto a los cinco es un autoexamen honesto, regular y despiadado delante del Señor con uno o dos hermanos de confianza que conozcan los lugares oscuros y oren por ellos por nombre."
  },
  {
    "textEn": "30. Synthesize the entire unit: How does the convergence of true calling and proven character produce a faithful, lasting pastoral ministry?",
    "textEs": "30. Sintetice toda la unidad: ¿Cómo produce la convergencia del llamado verdadero y el carácter probado un ministerio pastoral fiel y duradero?",
    "kw_en": [
      "call",
      "character",
      "faithful",
      "last",
      "pillar",
      "discipline",
      "shepherd",
      "endure"
    ],
    "kw_es": [
      "llam",
      "carácter",
      "fiel",
      "dura",
      "pilar",
      "disciplina",
      "pastor",
      "perdura"
    ],
    "modelEn": "Calling and character are the two pillars, and a faithful, lasting pastoral ministry is produced when both converge in one man. The call gives him the right to be in the office and the authority to do the work; the character gives him the inward life to sustain it through decades of storms. Most pastoral disasters are not failures of strategy but failures of one of these two foundations — a man stepped in without a real call and burned out, or without real character and crashed. The man who has both will outlast the storms, kept by hidden disciplines that anchor him in the deep current of God's purposes. When the Chief Shepherd appears, the faithful undershepherd who guarded both pillars will receive the crown of glory that does not fade away.",
    "modelEs": "El llamado y el carácter son los dos pilares, y un ministerio pastoral fiel y duradero se produce cuando ambos convergen en un solo hombre. El llamado le da el derecho de estar en el oficio y la autoridad para hacer la obra; el carácter le da la vida interior para sostenerlo a través de décadas de tormentas. La mayoría de los desastres pastorales no son fallas de estrategia sino fallas de uno de estos dos fundamentos — un hombre entró sin un llamado real y se quemó, o sin carácter real y se estrelló. El hombre que tiene ambos sobrevivirá las tormentas, guardado por disciplinas ocultas que lo anclan en la corriente profunda de los propósitos de Dios. Cuando aparezca el Príncipe de los pastores, el subpastor fiel que guardó ambos pilares recibirá la corona incorruptible de gloria."
  }
];

const PREV_HREF = 'CTSPMUnit1.html';

const NEXT_HREF = 'CTSPMUnit3.html';
