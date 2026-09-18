/* CTSPM - unit 4: per-unit configuration and content. */

const UNIT = 4;

let currentUnit = 4;

const mcQuestions = [
  {
    "textEn": "1. Jesus's most concise definition of worship comes from:",
    "textEs": "1. La definición más concisa de adoración de Jesús viene de:",
    "optionsEn": [
      "John 3:16",
      "Matthew 6:9",
      "John 4:24",
      "Luke 4:18"
    ],
    "optionsEs": [
      "Juan 3:16",
      "Mateo 6:9",
      "Juan 4:24",
      "Lucas 4:18"
    ],
    "c": 23,
    "explEn": "Jesus's most concise definition of worship comes from John 4:24 — in spirit and in truth.",
    "explEs": "La definición más concisa de adoración de Jesús viene de Juan 4:24 — en espíritu y en verdad."
  },
  {
    "textEn": "2. The two pillars of biblical worship are:",
    "textEs": "2. Los dos pilares de la adoración bíblica son:",
    "optionsEn": [
      "Music and prayer",
      "Spirit and truth",
      "Tradition and emotion",
      "Pastor and people"
    ],
    "optionsEs": [
      "Música y oración",
      "Espíritu y verdad",
      "Tradición y emoción",
      "Pastor y pueblo"
    ],
    "c": 29,
    "explEn": "The two pillars of biblical worship are spirit and truth; both must be present.",
    "explEs": "Los dos pilares de la adoración bíblica son espíritu y verdad; ambos deben estar presentes."
  },
  {
    "textEn": "3. Hannah at the temple was mistaken by Eli for being:",
    "textEs": "3. Ana en el templo fue confundida por Elí como:",
    "optionsEn": [
      "Possessed",
      "Drunk",
      "A foreigner",
      "Sick"
    ],
    "optionsEs": [
      "Poseída",
      "Ebria",
      "Extranjera",
      "Enferma"
    ],
    "c": 36,
    "explEn": "Hannah prayed so intensely that Eli mistook her for being drunk.",
    "explEs": "Ana oró tan intensamente que Elí la confundió con estar ebria."
  },
  {
    "textEn": "4. At Pentecost, the bystanders said the disciples were:",
    "textEs": "4. En Pentecostés, los espectadores dijeron que los discípulos estaban:",
    "optionsEn": [
      "Full of new wine",
      "Speaking nonsense",
      "Possessed",
      "Sleeping"
    ],
    "optionsEs": [
      "Llenos de mosto",
      "Hablando tonterías",
      "Poseídos",
      "Durmiendo"
    ],
    "c": 42,
    "explEn": "At Pentecost the bystanders said the Spirit-filled disciples were full of new wine.",
    "explEs": "En Pentecostés los presentes dijeron que los discípulos llenos del Espíritu estaban llenos de mosto."
  },
  {
    "textEn": "5. Ephesians 5:18 contrasts being drunk with wine with being:",
    "textEs": "5. Efesios 5:18 contrasta estar embriagado con vino con estar:",
    "optionsEn": [
      "Asleep",
      "Hungry",
      "Tired",
      "Filled with the Spirit"
    ],
    "optionsEs": [
      "Dormido",
      "Hambriento",
      "Cansado",
      "Lleno del Espíritu"
    ],
    "c": 52,
    "explEn": "Ephesians 5:18 contrasts being drunk with wine with being filled with the Spirit.",
    "explEs": "Efesios 5:18 contrasta el embriagarse con vino con ser lleno del Espíritu."
  },
  {
    "textEn": "6. The 'drink poison thinking it's medicine' illustration warns against:",
    "textEs": "6. La ilustración de 'beber veneno pensando que es medicina' advierte contra:",
    "optionsEn": [
      "Modern medicine",
      "Drinking water from wells",
      "Sincerity without truth",
      "Religious tradition"
    ],
    "optionsEs": [
      "La medicina moderna",
      "Beber agua de pozos",
      "La sinceridad sin verdad",
      "La tradición religiosa"
    ],
    "c": 58,
    "explEn": "The 'poison as medicine' image warns against sincerity without truth.",
    "explEs": "La imagen del 'veneno como medicina' advierte contra la sinceridad sin verdad."
  },
  {
    "textEn": "7. Paul and Silas in the Philippian jail at midnight illustrate:",
    "textEs": "7. Pablo y Silas en la cárcel de Filipos a medianoche ilustran:",
    "optionsEn": [
      "The danger of preaching",
      "Pastoral burnout",
      "The need for instruments",
      "Worship in spirit and truth even in suffering"
    ],
    "optionsEs": [
      "El peligro de predicar",
      "El agotamiento pastoral",
      "La necesidad de instrumentos",
      "Adoración en espíritu y verdad aun en el sufrimiento"
    ],
    "c": 66,
    "explEn": "Paul and Silas singing in the Philippian jail show worship in spirit and truth even in suffering.",
    "explEs": "Pablo y Silas cantando en la cárcel de Filipos muestran adoración en espíritu y verdad aun en sufrimiento."
  },
  {
    "textEn": "8. The African widow who came early to whisper prayers illustrates:",
    "textEs": "8. La viuda africana que venía temprano a susurrar oraciones ilustra:",
    "optionsEn": [
      "Heart preparation for worship before the service",
      "The need for early services",
      "Africa's church life",
      "Female piety"
    ],
    "optionsEs": [
      "La preparación del corazón para la adoración antes del servicio",
      "La necesidad de servicios tempranos",
      "La vida eclesiástica de África",
      "La piedad femenina"
    ],
    "c": 70,
    "explEn": "The African widow coming early to whisper prayers illustrates heart preparation before the service.",
    "explEs": "La viuda africana que llegaba temprano a susurrar oraciones ilustra la preparación del corazón antes del servicio."
  },
  {
    "textEn": "9. The pastor's role as worship leader is first:",
    "textEs": "9. El papel del pastor como guía de adoración es primero:",
    "optionsEn": [
      "Musical",
      "Administrative",
      "Internal — preparing his own heart",
      "Logistical"
    ],
    "optionsEs": [
      "Musical",
      "Administrativo",
      "Interno — preparando su propio corazón",
      "Logístico"
    ],
    "c": 79,
    "explEn": "The pastor's role as worship leader is first internal — preparing his own heart.",
    "explEs": "El papel del pastor como líder de adoración es primero interno — preparar su propio corazón."
  },
  {
    "textEn": "10. Songs sung in worship are properly understood as:",
    "textEs": "10. Los cánticos cantados en adoración se entienden propiamente como:",
    "optionsEn": [
      "Filler material",
      "Theology set to melody",
      "Warm-up for the sermon",
      "Optional decoration"
    ],
    "optionsEs": [
      "Material de relleno",
      "Teología puesta a melodía",
      "Calentamiento para el sermón",
      "Decoración opcional"
    ],
    "c": 85,
    "explEn": "Songs in worship are properly understood as theology set to melody.",
    "explEs": "Los cantos en la adoración se entienden propiamente como teología puesta en melodía."
  },
  {
    "textEn": "11. The benediction at the end of the service is:",
    "textEs": "11. La bendición al final del servicio es:",
    "optionsEn": [
      "A closing announcement",
      "Optional",
      "A formality",
      "The pastor speaking God's favor on His people for the week"
    ],
    "optionsEs": [
      "Un anuncio de cierre",
      "Opcional",
      "Una formalidad",
      "El pastor hablando el favor de Dios sobre Su pueblo para la semana"
    ],
    "c": 94,
    "explEn": "The benediction is the pastor speaking God's favor on His people for the week.",
    "explEs": "La bendición es el pastor hablando el favor de Dios sobre Su pueblo para la semana."
  },
  {
    "textEn": "12. Christ left His church how many ordinances?",
    "textEs": "12. Cristo dejó a Su iglesia ¿cuántas ordenanzas?",
    "optionsEn": [
      "Four",
      "Three",
      "Two",
      "Seven"
    ],
    "optionsEs": [
      "Cuatro",
      "Tres",
      "Dos",
      "Siete"
    ],
    "c": 100,
    "explEn": "Christ left His church two ordinances: baptism and the Lord's Supper.",
    "explEs": "Cristo dejó a Su iglesia dos ordenanzas: el bautismo y la Cena del Señor."
  },
  {
    "textEn": "13. The biblical order regarding faith and baptism is always:",
    "textEs": "13. El orden bíblico respecto a la fe y el bautismo es siempre:",
    "optionsEn": [
      "Faith, then baptism",
      "Baptism, then faith",
      "Simultaneous",
      "Either order"
    ],
    "optionsEs": [
      "Fe, luego bautismo",
      "Bautismo, luego fe",
      "Simultáneos",
      "Cualquier orden"
    ],
    "c": 105,
    "explEn": "The biblical order is always faith first, then baptism.",
    "explEs": "El orden bíblico es siempre la fe primero, luego el bautismo."
  },
  {
    "textEn": "14. Romans 6:3-4 teaches that baptism is a picture of:",
    "textEs": "14. Romanos 6:3-4 enseña que el bautismo es un cuadro de:",
    "optionsEn": [
      "Cleansing only",
      "Death and resurrection with Christ",
      "Joining the local church",
      "Receiving the Holy Spirit"
    ],
    "optionsEs": [
      "Solo limpieza",
      "Muerte y resurrección con Cristo",
      "Unirse a la iglesia local",
      "Recibir el Espíritu Santo"
    ],
    "c": 113,
    "explEn": "Romans 6:3-4 teaches baptism is a picture of death and resurrection with Christ.",
    "explEs": "Romanos 6:3-4 enseña que el bautismo es un cuadro de muerte y resurrección con Cristo."
  },
  {
    "textEn": "15. The historic Baptist position on the Lord's Supper is:",
    "textEs": "15. La posición histórica bautista sobre la Cena del Señor es:",
    "optionsEn": [
      "Transubstantiation",
      "Consubstantiation",
      "Real spiritual presence",
      "Memorial view — symbols pointing to a real sacrifice"
    ],
    "optionsEs": [
      "Transubstanciación",
      "Consubstanciación",
      "Presencia espiritual real",
      "Vista memorial — símbolos que señalan a un sacrificio real"
    ],
    "c": 122,
    "explEn": "The historic Baptist position is the memorial view — symbols pointing to a real sacrifice.",
    "explEs": "La posición bautista histórica es la vista memorial — símbolos que señalan a un sacrificio real."
  },
  {
    "textEn": "16. The doctrine that the bread and wine literally become the body and blood of Christ is called:",
    "textEs": "16. La doctrina de que el pan y el vino se convierten literalmente en el cuerpo y la sangre de Cristo se llama:",
    "optionsEn": [
      "Transubstantiation",
      "Memorial view",
      "Spiritual presence",
      "Symbolic communion"
    ],
    "optionsEs": [
      "Transubstanciación",
      "Vista memorial",
      "Presencia espiritual",
      "Comunión simbólica"
    ],
    "c": 126,
    "explEn": "Transubstantiation is the doctrine that bread and wine literally become Christ's body and blood.",
    "explEs": "La transubstanciación es la doctrina de que el pan y el vino literalmente se vuelven el cuerpo y sangre de Cristo."
  },
  {
    "textEn": "17. The 12 stones at the Jordan (Joshua 4) and the Passover meal (Exodus 12) are examples of:",
    "textEs": "17. Las 12 piedras en el Jordán (Josué 4) y la cena de la Pascua (Éxodo 12) son ejemplos de:",
    "optionsEn": [
      "Old Testament rituals only",
      "Burdensome traditions",
      "God's physical reminders of spiritual realities",
      "Cultural celebrations"
    ],
    "optionsEs": [
      "Solo rituales del Antiguo Testamento",
      "Tradiciones onerosas",
      "Recordatorios físicos de Dios sobre realidades espirituales",
      "Celebraciones culturales"
    ],
    "c": 135,
    "explEn": "The Jordan stones and the Passover are God's physical reminders of spiritual realities.",
    "explEs": "Las piedras del Jordán y la Pascua son recordatorios físicos de Dios de realidades espirituales."
  },
  {
    "textEn": "18. 1 Corinthians 11:28-30 warns that taking the Lord's Supper unworthily can result in:",
    "textEs": "18. 1 Corintios 11:28-30 advierte que tomar la Cena del Señor indignamente puede resultar en:",
    "optionsEn": [
      "Excommunication",
      "Loss of fellowship",
      "Public shame",
      "Weakness, sickness, and death"
    ],
    "optionsEs": [
      "Excomunión",
      "Pérdida del compañerismo",
      "Vergüenza pública",
      "Debilidad, enfermedad y muerte"
    ],
    "c": 143,
    "explEn": "1 Corinthians 11 warns that taking the Supper unworthily can bring weakness, sickness, and death.",
    "explEs": "1 Corintios 11 advierte que tomar la Cena indignamente puede traer debilidad, enfermedad y muerte."
  },
  {
    "textEn": "19. Which is NOT one of the four common errors in public worship?",
    "textEs": "19. ¿Cuál NO es uno de los cuatro errores comunes en la adoración pública?",
    "optionsEn": [
      "Entertainment",
      "Long sermons",
      "Pastor-centeredness",
      "Casualness"
    ],
    "optionsEs": [
      "Entretenimiento",
      "Sermones largos",
      "Centrismo del pastor",
      "Informalidad"
    ],
    "c": 148,
    "explEn": "Long sermons is NOT one of the four common worship errors named in the unit.",
    "explEs": "Los sermones largos NO son uno de los cuatro errores comunes de adoración nombrados en la unidad."
  },
  {
    "textEn": "20. The pastor's job in worship is fundamentally to:",
    "textEs": "20. El trabajo del pastor en la adoración es fundamentalmente:",
    "optionsEn": [
      "Lead the people into the presence of the living God",
      "Entertain the congregation",
      "Showcase his talents",
      "Manage logistics"
    ],
    "optionsEs": [
      "Guiar al pueblo a la presencia del Dios viviente",
      "Entretener a la congregación",
      "Mostrar sus talentos",
      "Manejar logística"
    ],
    "c": 154,
    "explEn": "The pastor's fundamental job in worship is to lead the people into the presence of the living God.",
    "explEs": "El trabajo fundamental del pastor en la adoración es llevar al pueblo a la presencia del Dios vivo."
  }
];

const kwQuestions = [
  {
    "textEn": "21. Define worship biblically using John 4:24. Why must both pillars (spirit and truth) be present, and what happens when one is missing?",
    "textEs": "21. Defina la adoración bíblicamente usando Juan 4:24. ¿Por qué deben estar presentes ambos pilares (espíritu y verdad), y qué sucede cuando uno falta?",
    "kw_en": [
      "spirit",
      "truth",
      "worship",
      "pillar",
      "john",
      "balance",
      "sincere",
      "doctrine"
    ],
    "kw_es": [
      "espíritu",
      "verdad",
      "adoración",
      "pilar",
      "juan",
      "equilibrio",
      "sincero",
      "doctrina"
    ],
    "modelEn": "Jesus gave the most concise definition of worship in John 4:24: God is Spirit, and those who worship Him must worship in spirit and in truth. The two pillars are spirit and truth, and both must be present. Worship in spirit without truth becomes sincere emotion built on error — drinking poison thinking it is medicine. Worship in truth without spirit becomes correct doctrine with a dead heart, orthodox but cold. When one pillar is missing the whole act collapses: feeling without foundation, or foundation without feeling. True worship engages the renewed heart and the revealed truth of God together, neither sacrificed to the other.",
    "modelEs": "Jesús dio la definición más concisa de adoración en Juan 4:24: Dios es Espíritu, y los que le adoran deben adorarle en espíritu y en verdad. Los dos pilares son espíritu y verdad, y ambos deben estar presentes. La adoración en espíritu sin verdad se vuelve emoción sincera edificada sobre el error — beber veneno pensando que es medicina. La adoración en verdad sin espíritu se vuelve doctrina correcta con un corazón muerto, ortodoxa pero fría. Cuando falta un pilar todo el acto colapsa: sentimiento sin fundamento, o fundamento sin sentimiento. La adoración verdadera compromete el corazón renovado y la verdad revelada de Dios juntos, sin sacrificar uno al otro."
  },
  {
    "textEn": "22. Discuss the parallel between Hannah at the temple (1 Samuel 1) and the disciples at Pentecost (Acts 2). What does this teach about Spirit-filled worship?",
    "textEs": "22. Discuta el paralelo entre Ana en el templo (1 Samuel 1) y los discípulos en Pentecostés (Hechos 2). ¿Qué enseña esto sobre la adoración llena del Espíritu?",
    "kw_en": [
      "hannah",
      "pentecost",
      "spirit",
      "drunk",
      "filled",
      "wine",
      "intense",
      "mistaken"
    ],
    "kw_es": [
      "ana",
      "pentecostés",
      "espíritu",
      "ebrio",
      "lleno",
      "vino",
      "intenso",
      "confund"
    ],
    "modelEn": "Hannah at the temple prayed so intensely that Eli mistook her for being drunk, and at Pentecost the bystanders said the disciples were full of new wine. The parallel is striking: in both cases Spirit-filled worship was so intense that observers mistook it for drunkenness. Ephesians 5:18 makes the connection explicit, contrasting being drunk with wine with being filled with the Spirit. This teaches that genuine, Spirit-filled worship has an intensity and abandon that a cold, formal religion never produces — it can look excessive to the watching world. The pastor leading worship should not fear depth of feeling, nor should he manufacture it; he should seek the genuine filling of the Spirit that made Hannah and the disciples look intoxicated with God.",
    "modelEs": "Ana en el templo oró tan intensamente que Elí la confundió con una ebria, y en Pentecostés los presentes dijeron que los discípulos estaban llenos de mosto. El paralelo es notable: en ambos casos la adoración llena del Espíritu fue tan intensa que los observadores la confundieron con embriaguez. Efesios 5:18 hace explícita la conexión, contrastando el embriagarse con vino con ser lleno del Espíritu. Esto enseña que la adoración genuina, llena del Espíritu, tiene una intensidad y un abandono que una religión fría y formal nunca produce — puede parecer excesiva al mundo que observa. El pastor que dirige la adoración no debe temer la profundidad del sentimiento, ni debe fabricarla; debe buscar el llenado genuino del Espíritu que hizo que Ana y los discípulos parecieran embriagados de Dios."
  },
  {
    "textEn": "23. Apply Paul and Silas singing in the Philippian jail to a modern worship service. What does this teach the pastor about worship's true source?",
    "textEs": "23. Aplique a Pablo y Silas cantando en la cárcel de Filipos a un servicio de adoración moderno. ¿Qué enseña esto al pastor sobre la verdadera fuente de la adoración?",
    "kw_en": [
      "paul",
      "silas",
      "jail",
      "sing",
      "suffer",
      "midnight",
      "source",
      "spirit"
    ],
    "kw_es": [
      "pablo",
      "silas",
      "cárcel",
      "cantar",
      "sufre",
      "medianoche",
      "fuente",
      "espíritu"
    ],
    "modelEn": "Paul and Silas, beaten and chained in the Philippian jail at midnight, were singing hymns to God — worship in spirit and truth even in suffering. Applied to a modern worship service, this teaches the pastor that worship's true source is not the comfort of the circumstances, the quality of the music, or the warmth of the room, but the Spirit of God in the heart of the worshiper. If Paul and Silas could worship in a dungeon with bleeding backs, then worship does not depend on perfect conditions. A congregation that only worships when everything is pleasant has not learned this. The pastor should teach his people that real worship rises from the Spirit within, so that it can sing at midnight in a jail as truly as on a bright Sunday morning.",
    "modelEs": "Pablo y Silas, azotados y encadenados en la cárcel de Filipos a medianoche, cantaban himnos a Dios — adoración en espíritu y verdad aun en el sufrimiento. Aplicado a un servicio de adoración moderno, esto enseña al pastor que la fuente verdadera de la adoración no es la comodidad de las circunstancias, la calidad de la música ni el calor del lugar, sino el Espíritu de Dios en el corazón del adorador. Si Pablo y Silas pudieron adorar en un calabozo con las espaldas sangrantes, entonces la adoración no depende de condiciones perfectas. Una congregación que solo adora cuando todo es agradable no ha aprendido esto. El pastor debe enseñar a su pueblo que la adoración real surge del Espíritu interior, de modo que pueda cantar a medianoche en una cárcel tan verdaderamente como en una brillante mañana de domingo."
  },
  {
    "textEn": "24. Explain why the pastor's heart preparation is more important than the technical preparation of the service. Use the African widow illustration.",
    "textEs": "24. Explique por qué la preparación del corazón del pastor es más importante que la preparación técnica del servicio. Use la ilustración de la viuda africana.",
    "kw_en": [
      "heart",
      "prepar",
      "widow",
      "internal",
      "technical",
      "early",
      "pray",
      "service"
    ],
    "kw_es": [
      "corazón",
      "prepar",
      "viuda",
      "interno",
      "técnic",
      "temprano",
      "orar",
      "servicio"
    ],
    "modelEn": "The pastor's heart preparation is more important than the technical preparation of the service, because a perfectly run service led by an unprepared heart is a hollow performance. The African widow who came early to the church to whisper her prayers before anyone else arrived illustrates this: she prepared her heart to meet God before the service began. The pastor's first role as worship leader is internal — preparing his own heart — before it is external. He may have the order of service, the songs, the sound, and the sermon all in place, but if he has not met God in private, he leads the people toward a God he himself has not sought that morning. Technical excellence serves worship; it cannot substitute for the prepared heart that actually enters God's presence.",
    "modelEs": "La preparación del corazón del pastor es más importante que la preparación técnica del servicio, porque un servicio perfectamente ejecutado dirigido por un corazón no preparado es una representación vacía. La viuda africana que llegaba temprano a la iglesia a susurrar sus oraciones antes de que llegara nadie más ilustra esto: preparaba su corazón para encontrarse con Dios antes de que comenzara el servicio. El primer papel del pastor como líder de adoración es interno — preparar su propio corazón — antes que externo. Puede tener el orden del servicio, los cantos, el sonido y el sermón todos listos, pero si no se ha encontrado con Dios en privado, dirige al pueblo hacia un Dios que él mismo no ha buscado esa mañana. La excelencia técnica sirve a la adoración; no puede sustituir al corazón preparado que realmente entra en la presencia de Dios."
  },
  {
    "textEn": "25. Outline the major components of a faithful Sunday worship service and explain the function of each.",
    "textEs": "25. Bosqueje los componentes principales de un servicio fiel de adoración dominical y explique la función de cada uno.",
    "kw_en": [
      "song",
      "prayer",
      "scripture",
      "sermon",
      "benediction",
      "theology",
      "component",
      "lead"
    ],
    "kw_es": [
      "canto",
      "oración",
      "escritura",
      "sermón",
      "bendición",
      "teología",
      "componente",
      "dirig"
    ],
    "modelEn": "A faithful Sunday worship service gathers several components, each with a purpose. The songs are theology set to melody, teaching the congregation truth even as they express praise. The prayers — invocation, confession, intercession, thanksgiving — lead the people to address God directly. The reading and preaching of Scripture is the central act, feeding the flock from the Word. The ordinances, baptism and the Lord's Supper, give visible signs of invisible grace. And the benediction at the end is the pastor speaking God's favor on His people for the week ahead, sending them out blessed. Each component is not a filler between the sermon but a genuine movement of worship, and the pastor leads the people through them into the presence of the living God.",
    "modelEs": "Un servicio de adoración dominical fiel reúne varios componentes, cada uno con un propósito. Los cantos son teología puesta en melodía, enseñando verdad a la congregación aun mientras expresan alabanza. Las oraciones — invocación, confesión, intercesión, acción de gracias — llevan al pueblo a dirigirse a Dios directamente. La lectura y predicación de la Escritura es el acto central, alimentando al rebaño de la Palabra. Las ordenanzas, el bautismo y la Cena del Señor, dan señales visibles de la gracia invisible. Y la bendición al final es el pastor hablando el favor de Dios sobre Su pueblo para la semana venidera, enviándolos bendecidos. Cada componente no es un relleno entre el sermón sino un movimiento genuino de adoración, y el pastor dirige al pueblo a través de ellos hacia la presencia del Dios vivo."
  },
  {
    "textEn": "26. Explain and defend CTS's position on the New Testament pattern of believer's baptism by immersion, while fairly representing the paedobaptist covenant argument. How does Romans 6:3-4 inform both the meaning and the mode?",
    "textEs": "26. Explique y defienda la posición de CTS sobre el patrón del Nuevo Testamento de bautismo de creyentes por inmersión, representando con justicia el argumento pedobautista del pacto. ¿Cómo informa Romanos 6:3-4 tanto el significado como el modo?",
    "kw_en": [
      "baptism",
      "faith",
      "immersion",
      "romans",
      "death",
      "resurrection",
      "believer",
      "picture"
    ],
    "kw_es": [
      "bautismo",
      "fe",
      "inmersión",
      "romanos",
      "muerte",
      "resurrección",
      "creyente",
      "cuadro"
    ],
    "modelEn": "CTS teaches believer's baptism by immersion as the New Testament pattern, and the biblical order is faith first, then baptism -- never baptism before faith. Romans 6:3-4 informs both the meaning and the mode: baptism is a picture of death and resurrection with Christ, the believer buried with Him in the water and raised to walk in newness of life, a picture immersion displays more fully than sprinkling. Paedobaptist traditions, including Presbyterian, Reformed, and Lutheran churches, hold a different and seriously-reasoned position: drawing on the continuity between the Abrahamic covenant sign of circumcision and baptism as its New Testament counterpart, they baptize the children of believers as members of the covenant community, anticipating a later profession of faith rather than requiring one beforehand. CTS's own conclusion, following the immersionist reading of the New Testament pattern, is that baptism follows a personal profession of faith and is by immersion, because the act itself preaches the gospel of a buried and risen Savior.",
    "modelEs": "CTS enseña el bautismo del creyente por inmersión como el patrón del Nuevo Testamento, y el orden bíblico es la fe primero, luego el bautismo — nunca el bautismo antes de la fe. Romanos 6:3-4 informa tanto el significado como el modo: el bautismo es un cuadro de muerte y resurrección con Cristo, el creyente sepultado con Él en el agua y levantado para andar en novedad de vida, un cuadro que la inmersión retrata más plenamente que la aspersión. Las tradiciones pedobautistas, incluyendo las iglesias presbiterianas, reformadas y luteranas, sostienen una posición diferente y seriamente razonada: partiendo de la continuidad entre la circuncisión como señal del pacto abrahámico y el bautismo como su contraparte del Nuevo Testamento, bautizan a los hijos de los creyentes como miembros de la comunidad del pacto, anticipando una profesión de fe posterior en lugar de exigirla de antemano. La propia conclusión de CTS, siguiendo la lectura inmersionista del patrón del Nuevo Testamento, es que el bautismo sigue a una profesión personal de fe y es por inmersión, porque el acto mismo predica el evangelio de un Salvador sepultado y resucitado."
  },
  {
    "textEn": "27. Compare the three views of the Lord's Supper (transubstantiation, consubstantiation, memorial). Which view is taught here, and why?",
    "textEs": "27. Compare las tres vistas de la Cena del Señor (transubstanciación, consubstanciación, memorial). ¿Cuál vista se enseña aquí y por qué?",
    "kw_en": [
      "memorial",
      "transubstantiation",
      "consubstantiation",
      "symbol",
      "baptist",
      "supper",
      "remember",
      "view"
    ],
    "kw_es": [
      "memorial",
      "transubstanciación",
      "consubstanciación",
      "símbolo",
      "bautista",
      "cena",
      "recordar",
      "vista"
    ],
    "modelEn": "There are three historic views of the Lord's Supper. Transubstantiation holds that the bread and wine literally become the body and blood of Christ. Consubstantiation holds that Christ is present in, with, and under the elements. The memorial view, the historic Baptist position taught here, holds that the bread and wine are symbols pointing to a real sacrifice — Christ's once-for-all death — which the believer remembers with thanksgiving. The memorial view is taught because Jesus said 'do this in remembrance of Me,' and because Hebrews insists His sacrifice was once for all and is not repeated. The elements are not the body and blood; they are signs that direct the worshiper's heart back to the cross. This guards both the finished work of Christ and the heart-engagement of the worshiper.",
    "modelEs": "Hay tres vistas históricas de la Cena del Señor. La transubstanciación sostiene que el pan y el vino literalmente se convierten en el cuerpo y la sangre de Cristo. La consubstanciación sostiene que Cristo está presente en, con y bajo los elementos. La vista memorial, la posición bautista histórica que se enseña aquí, sostiene que el pan y el vino son símbolos que señalan a un sacrificio real — la muerte de Cristo de una vez por todas — que el creyente recuerda con acción de gracias. La vista memorial se enseña porque Jesús dijo 'haced esto en memoria de mí,' y porque Hebreos insiste en que Su sacrificio fue una vez para siempre y no se repite. Los elementos no son el cuerpo y la sangre; son señales que dirigen el corazón del adorador de vuelta a la cruz. Esto guarda tanto la obra terminada de Cristo como el compromiso del corazón del adorador."
  },
  {
    "textEn": "28. Discuss the connection between the Passover, the 12 stones at the Jordan, and the Lord's Supper. What does this teach about God's use of physical reminders?",
    "textEs": "28. Discuta la conexión entre la Pascua, las 12 piedras en el Jordán, y la Cena del Señor. ¿Qué enseña esto sobre el uso de recordatorios físicos por parte de Dios?",
    "kw_en": [
      "passover",
      "stones",
      "supper",
      "remind",
      "physical",
      "remember",
      "jordan",
      "spiritual"
    ],
    "kw_es": [
      "pascua",
      "piedras",
      "cena",
      "recordatorio",
      "físico",
      "recordar",
      "jordán",
      "espiritual"
    ],
    "modelEn": "The Passover meal in Exodus 12, the twelve stones set up at the Jordan in Joshua 4, and the Lord's Supper are all examples of God's use of physical reminders of spiritual realities. The Passover lamb and unleavened bread reminded Israel yearly of their deliverance from Egypt. The twelve stones stood at the Jordan so that when children asked 'What do these stones mean?' the fathers would tell of God's mighty crossing. The Lord's Supper takes bread and cup to remind the church of Christ's body broken and blood shed. This teaches that God knows we are forgetful creatures, so He gives tangible signs to anchor invisible truths in our memory. The pastor should value the ordinances not as empty ritual but as God-given physical reminders that preach to the senses what the heart is prone to forget.",
    "modelEs": "La comida de la Pascua en Éxodo 12, las doce piedras levantadas en el Jordán en Josué 4, y la Cena del Señor son todos ejemplos del uso que Dios hace de recordatorios físicos de realidades espirituales. El cordero pascual y el pan sin levadura recordaban a Israel cada año su liberación de Egipto. Las doce piedras estaban en el Jordán para que cuando los hijos preguntaran '¿Qué significan estas piedras?' los padres contaran del poderoso cruce de Dios. La Cena del Señor toma pan y copa para recordar a la iglesia el cuerpo partido y la sangre derramada de Cristo. Esto enseña que Dios sabe que somos criaturas olvidadizas, así que da señales tangibles para anclar verdades invisibles en nuestra memoria. El pastor debe valorar las ordenanzas no como ritual vacío sino como recordatorios físicos dados por Dios que predican a los sentidos lo que el corazón tiende a olvidar."
  },
  {
    "textEn": "29. Identify the four common errors in public worship. Which error is most prevalent in your tradition or region, and what is the cure?",
    "textEs": "29. Identifique los cuatro errores comunes en la adoración pública. ¿Cuál error es más prevalente en su tradición o región, y cuál es la cura?",
    "kw_en": [
      "error",
      "entertainment",
      "ritual",
      "irreverence",
      "cold",
      "worship",
      "cure",
      "balance"
    ],
    "kw_es": [
      "error",
      "entretenimiento",
      "ritual",
      "irreverencia",
      "frío",
      "adoración",
      "cura",
      "equilibrio"
    ],
    "modelEn": "Four common errors corrupt public worship. The first is entertainment — turning the service into a performance for an audience rather than an offering to God. The second is dead ritual — going through correct forms with no living heart, truth without spirit. The third is irreverence — a casualness that forgets we are entering the presence of a holy God. The fourth is emotionalism — feeling pursued for its own sake, spirit without truth. Each errs by losing one of the two pillars or the reverence both require. The cure in every case is worship in spirit and truth: heart and doctrine held together, reverence and joy together, an offering to God rather than a show for people. The pastor must guard against whichever error is most prevalent in his own tradition.",
    "modelEs": "Cuatro errores comunes corrompen la adoración pública. El primero es el entretenimiento — convertir el servicio en una representación para un auditorio en vez de una ofrenda a Dios. El segundo es el ritual muerto — pasar por formas correctas sin corazón vivo, verdad sin espíritu. El tercero es la irreverencia — una informalidad que olvida que entramos en la presencia de un Dios santo. El cuarto es el emocionalismo — el sentimiento buscado por sí mismo, espíritu sin verdad. Cada uno yerra al perder uno de los dos pilares o la reverencia que ambos requieren. La cura en cada caso es la adoración en espíritu y verdad: corazón y doctrina sostenidos juntos, reverencia y gozo juntos, una ofrenda a Dios en vez de un espectáculo para la gente. El pastor debe guardarse contra cualquier error que sea más prevalente en su propia tradición."
  },
  {
    "textEn": "30. Synthesize the unit: How does the pastor's role as worship leader gather all his other pastoral duties into a single act every Sunday morning?",
    "textEs": "30. Sintetice la unidad: ¿Cómo el rol del pastor como guía de adoración reúne todos sus otros deberes pastorales en un solo acto cada domingo por la mañana?",
    "kw_en": [
      "worship",
      "lead",
      "gather",
      "duty",
      "presence",
      "spirit",
      "truth",
      "sunday"
    ],
    "kw_es": [
      "adoración",
      "dirig",
      "reúne",
      "deber",
      "presencia",
      "espíritu",
      "verdad",
      "domingo"
    ],
    "modelEn": "The pastor's role as worship leader gathers all his other pastoral duties into a single act every Sunday morning. The shepherding, the teaching, the visiting, the counseling, the praying he has done all week converge as he leads the gathered people into the presence of the living God. In worship he feeds them through the Word, comforts the wounded he has visited, instructs through songs that are theology set to melody, and seals it with the ordinances and the benediction. Worship in spirit and truth is the summit toward which all his labor climbs, the moment when the flock he has tended all week meets their God together. His first preparation is internal — his own heart sought God before he leads — and his aim is never performance but presence. Sunday worship is where the undershepherd brings the whole flock before the Chief Shepherd.",
    "modelEs": "El papel del pastor como líder de adoración reúne todos sus otros deberes pastorales en un solo acto cada domingo por la mañana. El pastoreo, la enseñanza, la visitación, la consejería, la oración que ha hecho toda la semana convergen mientras dirige al pueblo reunido a la presencia del Dios vivo. En la adoración los alimenta por la Palabra, consuela a los heridos que ha visitado, instruye mediante cantos que son teología en melodía, y lo sella con las ordenanzas y la bendición. La adoración en espíritu y verdad es la cumbre hacia la cual sube toda su labor, el momento en que el rebaño que ha cuidado toda la semana se encuentra con su Dios juntos. Su primera preparación es interna — su propio corazón buscó a Dios antes de dirigir — y su meta nunca es la representación sino la presencia. La adoración dominical es donde el subpastor trae a todo el rebaño ante el Príncipe de los pastores."
  }
];

const PREV_HREF = 'CTSPMUnit3.html';

const NEXT_HREF = 'CTSPMUnit5.html';
