/* CTSPM - unit 3: per-unit configuration and content. */

const UNIT = 3;

let currentUnit = 3;

const mcQuestions = [
  {
    "textEn": "1. The Greek root of 'therapeutic' (therapeuō) means:",
    "textEs": "1. La raíz griega de 'terapéutico' (therapeuō) significa:",
    "optionsEn": [
      "To entertain",
      "To heal, serve, attend",
      "To lecture",
      "To analyze"
    ],
    "optionsEs": [
      "Entretener",
      "Sanar, servir, atender",
      "Conferenciar",
      "Analizar"
    ],
    "c": 22,
    "explEn": "The Greek therapeuō means to heal, serve, and attend — the root of all genuine therapeutic ministry.",
    "explEs": "El griego therapeuō significa sanar, servir y atender — la raíz de todo ministerio terapéutico genuino."
  },
  {
    "textEn": "2. Jesus' first hometown sermon (Luke 4:18) was based on:",
    "textEs": "2. El primer sermón de Jesús en su pueblo (Lucas 4:18) se basó en:",
    "optionsEn": [
      "Psalm 23",
      "Isaiah 53",
      "Isaiah 61:1",
      "Jeremiah 31"
    ],
    "optionsEs": [
      "Salmo 23",
      "Isaías 53",
      "Isaías 61:1",
      "Jeremías 31"
    ],
    "c": 30,
    "explEn": "Jesus's first hometown sermon was based on Isaiah 61:1, His mission to bind up the brokenhearted.",
    "explEs": "El primer sermón de Jesús en su tierra se basó en Isaías 61:1, Su misión de vendar a los quebrantados."
  },
  {
    "textEn": "3. The Greek word splagchnizomai (Matthew 9:36) describes:",
    "textEs": "3. La palabra griega splagchnizomai (Mateo 9:36) describe:",
    "optionsEn": [
      "Gut-twisting compassion in the inward parts",
      "Public weeping",
      "Loud preaching",
      "Anger at sin"
    ],
    "optionsEs": [
      "Compasión que tuerce las entrañas en lo íntimo",
      "Llanto público",
      "Predicación a gritos",
      "Ira contra el pecado"
    ],
    "c": 35,
    "explEn": "Splagchnizomai describes gut-twisting compassion in the inward parts, the way Jesus saw the multitudes.",
    "explEs": "Splagchnizomai describe la compasión que retuerce las entrañas, como Jesús vio a las multitudes."
  },
  {
    "textEn": "4. The pew of the local church should be thought of as:",
    "textEs": "4. La banca de la iglesia local debe pensarse como:",
    "optionsEn": [
      "A classroom",
      "A theater",
      "A concert hall",
      "A hospital ward"
    ],
    "optionsEs": [
      "Un salón de clase",
      "Un teatro",
      "Una sala de conciertos",
      "Una sala de hospital"
    ],
    "c": 45,
    "explEn": "The pew should be thought of as a hospital ward, full of hidden wounds the others cannot see.",
    "explEs": "El banco debe pensarse como una sala de hospital, llena de heridas ocultas que los demás no ven."
  },
  {
    "textEn": "5. Hebrews 4:15 teaches that Christ is a High Priest who:",
    "textEs": "5. Hebreos 4:15 enseña que Cristo es un Sumo Sacerdote que:",
    "optionsEn": [
      "Stands above human suffering",
      "Sympathizes with our weaknesses",
      "Judges only",
      "Cannot relate to us"
    ],
    "optionsEs": [
      "Está por encima del sufrimiento humano",
      "Se compadece de nuestras flaquezas",
      "Solo juzga",
      "No puede relacionarse con nosotros"
    ],
    "c": 50,
    "explEn": "Hebrews 4:15 teaches Christ is a High Priest who sympathizes with our weaknesses, not a distant one.",
    "explEs": "Hebreos 4:15 enseña que Cristo es un Sumo Sacerdote que simpatiza con nuestras debilidades, no distante."
  },
  {
    "textEn": "6. 2 Corinthians 1:3-4 teaches that comfort:",
    "textEs": "6. 2 Corintios 1:3-4 enseña que el consuelo:",
    "optionsEn": [
      "Is private only",
      "Belongs to the strong",
      "Flows from God to us, then to others",
      "Is a feeling we generate"
    ],
    "optionsEs": [
      "Es solo privado",
      "Pertenece a los fuertes",
      "Fluye de Dios a nosotros, luego a otros",
      "Es un sentimiento que generamos"
    ],
    "c": 58,
    "explEn": "2 Corinthians 1:3-4 shows comfort flows from God to us, then through us to others.",
    "explEs": "2 Corintios 1:3-4 muestra que el consuelo fluye de Dios a nosotros, luego por nosotros a otros."
  },
  {
    "textEn": "7. Joe Bayly's two visitors after his son's death illustrate:",
    "textEs": "7. Los dos visitantes de Joe Bayly después de la muerte de su hijo ilustran:",
    "optionsEn": [
      "The danger of pastoral visits",
      "Presence and listening matter more than correct words",
      "Why pastors should never visit",
      "The need for psychology degrees"
    ],
    "optionsEs": [
      "El peligro de las visitas pastorales",
      "La presencia y la escucha importan más que las palabras correctas",
      "Por qué los pastores nunca deben visitar",
      "La necesidad de títulos en psicología"
    ],
    "c": 64,
    "explEn": "Bayly's two visitors show that presence and listening matter more than correct words to the grieving.",
    "explEs": "Los dos visitantes de Bayly muestran que la presencia y el escuchar importan más que las palabras correctas."
  },
  {
    "textEn": "8. The Interstate 95 trucker on the CB radio illustrates:",
    "textEs": "8. El camionero de la Interestatal 95 en la radio CB ilustra:",
    "optionsEn": [
      "The danger of distracted driving",
      "The need for better trucks",
      "Coming alongside the suffering and handing them off to others who will see them home",
      "Modern technology in ministry"
    ],
    "optionsEs": [
      "El peligro de manejar distraído",
      "La necesidad de mejores camiones",
      "Acercarse al que sufre y entregarlo a otros que lo verán llegar a casa",
      "Tecnología moderna en el ministerio"
    ],
    "c": 72,
    "explEn": "The I-95 trucker pictures coming alongside the suffering and handing them off toward home.",
    "explEs": "El camionero de la I-95 retrata acompañar al que sufre y entregarlo hacia el hogar."
  },
  {
    "textEn": "9. The first movement of therapeutic preaching is:",
    "textEs": "9. El primer movimiento de la predicación terapéutica es:",
    "optionsEn": [
      "Honest diagnosis — naming the wound",
      "Singing a hymn",
      "Telling a joke",
      "Reading the announcements"
    ],
    "optionsEs": [
      "Diagnóstico honesto — nombrar la herida",
      "Cantar un himno",
      "Contar un chiste",
      "Leer los anuncios"
    ],
    "c": 77,
    "explEn": "The first movement is honest diagnosis — naming the wound rather than pretending all is well.",
    "explEs": "El primer movimiento es el diagnóstico honesto — nombrar la herida en vez de fingir que todo está bien."
  },
  {
    "textEn": "10. The second movement of therapeutic preaching is:",
    "textEs": "10. El segundo movimiento de la predicación terapéutica es:",
    "optionsEn": [
      "Personal autobiography",
      "Pastoral opinion",
      "General encouragement",
      "The application of Scripture as the only true balm"
    ],
    "optionsEs": [
      "Autobiografía personal",
      "Opinión pastoral",
      "Aliento general",
      "La aplicación de la Escritura como el único bálsamo verdadero"
    ],
    "c": 87,
    "explEn": "The second movement applies Scripture as the only true balm for the wound.",
    "explEs": "El segundo movimiento aplica la Escritura como el único bálsamo verdadero para la herida."
  },
  {
    "textEn": "11. The third movement of therapeutic preaching is:",
    "textEs": "11. El tercer movimiento de la predicación terapéutica es:",
    "optionsEn": [
      "Asking for an offering",
      "Pointing to Christ as the Wounded Healer",
      "Closing in prayer",
      "Reading announcements"
    ],
    "optionsEs": [
      "Pedir una ofrenda",
      "Señalar a Cristo como el Sanador Herido",
      "Cerrar en oración",
      "Leer anuncios"
    ],
    "c": 92,
    "explEn": "The third movement points to Christ as the Wounded Healer, ending in the Savior not technique.",
    "explEs": "El tercer movimiento señala a Cristo como el Sanador herido, terminando en el Salvador no en técnica."
  },
  {
    "textEn": "12. Triumphalism in preaching is dangerous because it:",
    "textEs": "12. El triunfalismo en la predicación es peligroso porque:",
    "optionsEn": [
      "Tells the suffering saint that her suffering is her own fault",
      "Quotes too much Scripture",
      "Lasts too long",
      "Is too quiet"
    ],
    "optionsEs": [
      "Le dice al santo que sufre que su sufrimiento es su propia culpa",
      "Cita demasiada Escritura",
      "Dura demasiado",
      "Es demasiado silencioso"
    ],
    "c": 98,
    "explEn": "Triumphalism is dangerous because it tells the suffering saint her suffering is her own fault.",
    "explEs": "El triunfalismo es peligroso porque le dice al santo que sufre que su sufrimiento es culpa suya."
  },
  {
    "textEn": "13. Sentimentality is preaching that:",
    "textEs": "13. El sentimentalismo es predicación que:",
    "optionsEn": [
      "Is too short",
      "Is too quiet",
      "Reaches for emotion without truth",
      "Uses too much Scripture"
    ],
    "optionsEs": [
      "Es demasiado corta",
      "Es demasiado silenciosa",
      "Busca la emoción sin verdad",
      "Usa demasiada Escritura"
    ],
    "c": 107,
    "explEn": "Sentimentality reaches for emotion without truth, stirring feelings but giving no real medicine.",
    "explEs": "El sentimentalismo busca la emoción sin la verdad, agitando sentimientos pero sin medicina real."
  },
  {
    "textEn": "14. Theological distance produces preaching that is:",
    "textEs": "14. La distancia teológica produce predicación que es:",
    "optionsEn": [
      "Too entertaining",
      "Too long",
      "Too emotional",
      "Doctrinally precise but pastorally cold"
    ],
    "optionsEs": [
      "Demasiado entretenida",
      "Demasiado larga",
      "Demasiado emocional",
      "Doctrinalmente precisa pero pastoralmente fría"
    ],
    "c": 115,
    "explEn": "Theological distance produces preaching that is doctrinally precise but pastorally cold.",
    "explEs": "La distancia teológica produce predicación doctrinalmente precisa pero pastoralmente fría."
  },
  {
    "textEn": "15. Cheap comfort means:",
    "textEs": "15. El consuelo barato significa:",
    "optionsEn": [
      "Refusing to comfort anyone",
      "Avoiding Scripture altogether",
      "Making the sermon shorter",
      "Tossing true verses lightly at deep wounds"
    ],
    "optionsEs": [
      "Rehusar consolar a alguien",
      "Evitar la Escritura del todo",
      "Hacer el sermón más corto",
      "Arrojar versículos verdaderos a la ligera sobre heridas profundas"
    ],
    "c": 122,
    "explEn": "Cheap comfort means tossing true verses lightly at deep wounds, trivializing real pain.",
    "explEs": "El consuelo barato es arrojar versículos verdaderos a la ligera sobre heridas profundas."
  },
  {
    "textEn": "16. The pastor preaches therapeutically:",
    "textEs": "16. El pastor predica terapéuticamente:",
    "optionsEn": [
      "From his own healed and unhealed wounds",
      "Only after a counseling degree",
      "Only when sad",
      "Only at funerals"
    ],
    "optionsEs": [
      "Desde sus propias heridas sanadas y no sanadas",
      "Solo después de un título en consejería",
      "Solo cuando está triste",
      "Solo en funerales"
    ],
    "c": 126,
    "explEn": "The pastor preaches therapeutically from his own healed and unhealed wounds, not in theory.",
    "explEs": "El pastor predica terapéuticamente desde sus propias heridas sanadas y no sanadas, no en teoría."
  },
  {
    "textEn": "17. Pastoral suffering is described in this unit as:",
    "textEs": "17. El sufrimiento pastoral es descrito en esta unidad como:",
    "optionsEn": [
      "Always avoidable",
      "A failure of faith",
      "The seminary of therapeutic preaching",
      "Optional"
    ],
    "optionsEs": [
      "Siempre evitable",
      "Una falla de fe",
      "El seminario de la predicación terapéutica",
      "Opcional"
    ],
    "c": 135,
    "explEn": "Pastoral suffering is described as the seminary of therapeutic preaching.",
    "explEs": "El sufrimiento pastoral se describe como el seminario de la predicación terapéutica."
  },
  {
    "textEn": "18. According to Isaiah 61, the Spirit-anointed preacher gives:",
    "textEs": "18. Según Isaías 61, el predicador ungido por el Espíritu da:",
    "optionsEn": [
      "Education for the masses",
      "Wealth for the poor",
      "Easy answers",
      "Beauty for ashes, oil of joy for mourning"
    ],
    "optionsEs": [
      "Educación para las masas",
      "Riqueza para los pobres",
      "Respuestas fáciles",
      "Gloria en lugar de ceniza, óleo de gozo en lugar de luto"
    ],
    "c": 143,
    "explEn": "Isaiah 61 promises the anointed preacher gives beauty for ashes, the oil of joy for mourning.",
    "explEs": "Isaías 61 promete que el predicador ungido da gloria en lugar de ceniza, óleo de gozo por luto."
  },
  {
    "textEn": "19. Without Christ as the Wounded Healer, what remains in the sermon is:",
    "textEs": "19. Sin Cristo como el Sanador Herido, lo que queda en el sermón es:",
    "optionsEn": [
      "Pure exegesis",
      "Moralism",
      "Strong evangelism",
      "Effective discipleship"
    ],
    "optionsEs": [
      "Exégesis pura",
      "Moralismo",
      "Evangelismo fuerte",
      "Discipulado eficaz"
    ],
    "c": 148,
    "explEn": "Without Christ the Wounded Healer, what remains in the sermon is mere moralism.",
    "explEs": "Sin Cristo el Sanador herido, lo que queda en el sermón es mero moralismo."
  },
  {
    "textEn": "20. The pulpit is best described in this unit as:",
    "textEs": "20. El púlpito es descrito mejor en esta unidad como:",
    "optionsEn": [
      "A healing station",
      "A platform",
      "A stage",
      "A classroom"
    ],
    "optionsEs": [
      "Una estación de sanidad",
      "Una plataforma",
      "Un escenario",
      "Un salón de clase"
    ],
    "c": 154,
    "explEn": "The pulpit is best described as a healing station where the wounded meet God's tenderness.",
    "explEs": "El púlpito se describe mejor como una estación de sanidad donde el herido encuentra la ternura de Dios."
  }
];

const kwQuestions = [
  {
    "textEn": "21. Define therapeutic preaching biblically. How does it differ from secular psychology dressed up in Christian language?",
    "textEs": "21. Defina la predicación terapéutica bíblicamente. ¿Cómo difiere de la psicología secular vestida con lenguaje cristiano?",
    "kw_en": [
      "heal",
      "wound",
      "scripture",
      "biblical",
      "christ",
      "psycholog",
      "comfort",
      "soul"
    ],
    "kw_es": [
      "sanar",
      "herida",
      "escritura",
      "bíblic",
      "cristo",
      "psicolog",
      "consuelo",
      "alma"
    ],
    "modelEn": "Therapeutic preaching, biblically defined, is preaching that brings the healing balm of God's Word to the wounds of His people — the Greek root therapeuō means to heal, serve, and attend. It differs sharply from secular psychology dressed in Christian language, because its diagnosis, its medicine, and its healer are all drawn from Scripture, not from the wisdom of the age. Psychology may name a wound, but it cannot point a soul to the Wounded Healer. The therapeutic preacher does not replace the gospel with self-help; he applies the Word of God to real suffering and leads the hurting to Christ. It is biblical comfort flowing from God to the wounded, not human technique baptized with a few verses.",
    "modelEs": "La predicación terapéutica, definida bíblicamente, es la predicación que lleva el bálsamo sanador de la Palabra de Dios a las heridas de Su pueblo — la raíz griega therapeuō significa sanar, servir y atender. Difiere marcadamente de la psicología secular vestida con lenguaje cristiano, porque su diagnóstico, su medicina y su sanador se sacan todos de la Escritura, no de la sabiduría de la época. La psicología puede nombrar una herida, pero no puede señalar a un alma al Sanador herido. El predicador terapéutico no reemplaza el evangelio con la autoayuda; aplica la Palabra de Dios al sufrimiento real y lleva al herido a Cristo. Es consuelo bíblico que fluye de Dios al herido, no técnica humana bautizada con unos pocos versículos."
  },
  {
    "textEn": "22. Describe what the pastor should see when he looks out across his congregation. Why does this awareness shape every sermon?",
    "textEs": "22. Describa lo que el pastor debe ver cuando mira a través de su congregación. ¿Por qué moldea esta conciencia cada sermón?",
    "kw_en": [
      "wound",
      "hospital",
      "congregation",
      "suffer",
      "see",
      "compassion",
      "hidden",
      "sermon"
    ],
    "kw_es": [
      "herida",
      "hospital",
      "congregación",
      "sufre",
      "ver",
      "compasión",
      "oculto",
      "sermón"
    ],
    "modelEn": "When the pastor looks across his congregation he should see a hospital ward, not an audience — every pew holds someone carrying a wound the others cannot see. There is the widow in her first month alone, the couple whose marriage is quietly dying, the man who lost his job, the teenager battling despair. Jesus, seeing the multitudes, was moved with splagchnizomai — gut-twisting compassion in the inward parts. This awareness shapes every sermon because a man who preaches to the wounded as if they were the comfortable will wound them further, while a man who remembers the hidden suffering will preach with tenderness. The preacher who forgets the hospital ward turns the pulpit cold.",
    "modelEs": "Cuando el pastor mira a su congregación debe ver una sala de hospital, no un auditorio — cada banco sostiene a alguien que carga una herida que los demás no pueden ver. Está la viuda en su primer mes sola, la pareja cuyo matrimonio muere en silencio, el hombre que perdió su empleo, el adolescente que lucha con la desesperación. Jesús, al ver las multitudes, fue movido con splagchnizomai — compasión que retuerce las entrañas. Esta conciencia da forma a cada sermón porque un hombre que predica a los heridos como si fueran los cómodos los herirá más, mientras que un hombre que recuerda el sufrimiento oculto predicará con ternura. El predicador que olvida la sala de hospital vuelve frío el púlpito."
  },
  {
    "textEn": "23. Explain how Isaiah 61, Hebrews 4:15, and 2 Corinthians 1:3-4 together establish the biblical foundation of therapeutic preaching.",
    "textEs": "23. Explique cómo Isaías 61, Hebreos 4:15 y 2 Corintios 1:3-4 establecen juntos el fundamento bíblico de la predicación terapéutica.",
    "kw_en": [
      "isaiah",
      "hebrews",
      "corinthians",
      "comfort",
      "sympath",
      "anoint",
      "foundation",
      "christ"
    ],
    "kw_es": [
      "isaías",
      "hebreos",
      "corintios",
      "consuelo",
      "simpat",
      "ungido",
      "fundamento",
      "cristo"
    ],
    "modelEn": "Three texts together establish the biblical foundation of therapeutic preaching. Isaiah 61, which Jesus claimed as His own mission, says the Spirit-anointed preacher is sent to bind up the brokenhearted and give beauty for ashes. Hebrews 4:15 shows that Christ is a High Priest who is not distant but sympathizes with our weaknesses, having been tempted in all points as we are. And 2 Corinthians 1:3-4 teaches that comfort flows from the God of all comfort to us, and then through us to others, so that the pastor's own comfort becomes the supply for the wounded. Together they ground therapeutic preaching not in technique but in the very heart of God, who anoints, sympathizes, and comforts. The pastor preaches healing because the God he serves is a healing God.",
    "modelEs": "Tres textos juntos establecen el fundamento bíblico de la predicación terapéutica. Isaías 61, que Jesús reclamó como Su propia misión, dice que el predicador ungido por el Espíritu es enviado a vendar a los quebrantados de corazón y dar gloria en lugar de ceniza. Hebreos 4:15 muestra que Cristo es un Sumo Sacerdote que no es distante sino que simpatiza con nuestras debilidades, habiendo sido tentado en todo como nosotros. Y 2 Corintios 1:3-4 enseña que el consuelo fluye del Dios de toda consolación a nosotros, y luego a través de nosotros a otros, de modo que el propio consuelo del pastor se vuelve el suministro para el herido. Juntos fundamentan la predicación terapéutica no en la técnica sino en el corazón mismo de Dios, que unge, simpatiza y consuela. El pastor predica sanidad porque el Dios a quien sirve es un Dios que sana."
  },
  {
    "textEn": "24. Discuss Joe Bayly's two visitors. What does this story teach the pastor about ministering to the grieving?",
    "textEs": "24. Discuta los dos visitantes de Joe Bayly. ¿Qué enseña esta historia al pastor sobre ministrar a los que lloran?",
    "kw_en": [
      "bayly",
      "presence",
      "listen",
      "grief",
      "silence",
      "word",
      "comfort",
      "visitor"
    ],
    "kw_es": [
      "bayly",
      "presencia",
      "escuchar",
      "duelo",
      "silencio",
      "palabra",
      "consuelo",
      "visitante"
    ],
    "modelEn": "After Joe Bayly lost his son, two visitors came. The first talked freely, explaining suffering, quoting verses, offering reasons — and Bayly wished he would leave. The second simply sat with him, said little, listened, and prayed briefly before going — and Bayly did not want him to leave. The story teaches the pastor that in ministering to the grieving, presence and listening matter more than correct words. The wounded do not need their pain explained; they need someone to sit in it with them. A pastor who rushes to fix grief with answers wounds the sufferer, while the one who is willing to be silently present brings the comfort of Christ. Sometimes the holiest thing a pastor can do at a graveside is say nothing and stay.",
    "modelEs": "Después de que Joe Bayly perdió a su hijo, vinieron dos visitantes. El primero habló libremente, explicando el sufrimiento, citando versículos, ofreciendo razones — y Bayly deseó que se fuera. El segundo simplemente se sentó con él, dijo poco, escuchó y oró brevemente antes de irse — y Bayly no quería que se fuera. La historia enseña al pastor que al ministrar a los que sufren, la presencia y el escuchar importan más que las palabras correctas. El herido no necesita que le expliquen su dolor; necesita a alguien que se siente en él con él. Un pastor que se apresura a arreglar el duelo con respuestas hiere al doliente, mientras que el que está dispuesto a estar presente en silencio trae el consuelo de Cristo. A veces lo más santo que un pastor puede hacer junto a una tumba es no decir nada y quedarse."
  },
  {
    "textEn": "25. Apply the Interstate 95 trucker illustration to the pastor's role in therapeutic preaching. What is the role of 'the next exit'?",
    "textEs": "25. Aplique la ilustración del camionero de la Interestatal 95 al rol del pastor en la predicación terapéutica. ¿Cuál es el rol de 'la próxima salida'?",
    "kw_en": [
      "trucker",
      "alongside",
      "exit",
      "hand",
      "suffer",
      "accompany",
      "guide",
      "home"
    ],
    "kw_es": [
      "camionero",
      "acompañ",
      "salida",
      "entreg",
      "sufre",
      "junto",
      "guía",
      "hogar"
    ],
    "modelEn": "On Interstate 95 a trucker came alongside a frightened, lost driver on the CB radio, guided him mile by mile, and at his own exit handed him off to another trucker who would see him farther down the road. This pictures the pastor's role in therapeutic preaching: he comes alongside the suffering, walks with them through the immediate darkness, and points them to 'the next exit' — the next step toward healing, whether that is Christ, the community of believers, or further help. The pastor cannot personally carry every wounded person all the way home, but he can accompany them and hand them safely on. He is not the destination; he is the voice on the radio guiding the hurting toward the One who heals. Faithful therapeutic preaching always keeps the sufferer moving toward home, never abandoned on the roadside.",
    "modelEs": "En la Interestatal 95 un camionero se puso al lado de un conductor asustado y perdido por la radio CB, lo guió milla por milla, y en su propia salida lo entregó a otro camionero que lo llevaría más adelante. Esto retrata el papel del pastor en la predicación terapéutica: se pone al lado del que sufre, camina con él a través de la oscuridad inmediata, y lo señala hacia 'la próxima salida' — el próximo paso hacia la sanidad, sea Cristo, la comunidad de creyentes o más ayuda. El pastor no puede llevar personalmente a cada herido todo el camino a casa, pero puede acompañarlo y entregarlo a salvo. Él no es el destino; es la voz en la radio que guía al herido hacia Aquel que sana. La predicación terapéutica fiel siempre mantiene al doliente avanzando hacia el hogar, nunca abandonado al borde del camino."
  },
  {
    "textEn": "26. Outline the three movements of therapeutic preaching and explain how each one functions in a Sunday sermon.",
    "textEs": "26. Bosqueje los tres movimientos de la predicación terapéutica y explique cómo funciona cada uno en un sermón dominical.",
    "kw_en": [
      "diagnosis",
      "scripture",
      "christ",
      "balm",
      "wound",
      "movement",
      "name",
      "heal"
    ],
    "kw_es": [
      "diagnóstico",
      "escritura",
      "cristo",
      "bálsamo",
      "herida",
      "movimiento",
      "nombrar",
      "sanar"
    ],
    "modelEn": "Therapeutic preaching moves in three movements. First is honest diagnosis — naming the wound, refusing to pretend the congregation is whole, speaking the truth about grief, fear, guilt, and despair so the sufferer knows he has been seen. Second is the application of Scripture as the only true balm — not human advice but the Word of God pressed gently into the wound, because only God's truth actually heals. Third is pointing to Christ as the Wounded Healer, the One who was pierced for our transgressions and bears the scars still, so that the sermon ends not in technique but in the Savior. Each movement functions in a Sunday sermon: the diagnosis makes the wounded feel known, the Scripture brings real medicine, and Christ brings lasting hope. Skip any movement and the preaching either wounds, moralizes, or comforts cheaply.",
    "modelEs": "La predicación terapéutica avanza en tres movimientos. Primero es el diagnóstico honesto — nombrar la herida, rehusar fingir que la congregación está entera, decir la verdad sobre el duelo, el miedo, la culpa y la desesperación para que el doliente sepa que ha sido visto. Segundo es la aplicación de la Escritura como el único bálsamo verdadero — no consejo humano sino la Palabra de Dios presionada suavemente en la herida, porque solo la verdad de Dios sana de verdad. Tercero es señalar a Cristo como el Sanador herido, Aquel que fue traspasado por nuestras transgresiones y lleva las cicatrices todavía, para que el sermón termine no en técnica sino en el Salvador. Cada movimiento funciona en un sermón dominical: el diagnóstico hace que el herido se sienta conocido, la Escritura trae medicina real, y Cristo trae esperanza duradera. Omita cualquier movimiento y la predicación o hiere, o moraliza, o consuela baratamente."
  },
  {
    "textEn": "27. Identify the four common errors that turn the pulpit cold to the wounded. Which error is most common in your tradition, and why?",
    "textEs": "27. Identifique los cuatro errores comunes que enfrían el púlpito hacia los heridos. ¿Cuál error es el más común en su tradición, y por qué?",
    "kw_en": [
      "triumphalism",
      "sentimental",
      "distance",
      "cheap",
      "cold",
      "error",
      "wound",
      "truth"
    ],
    "kw_es": [
      "triunfalismo",
      "sentimental",
      "distancia",
      "barato",
      "frío",
      "error",
      "herir",
      "verdad"
    ],
    "modelEn": "Four common errors turn the pulpit cold to the wounded. Triumphalism tells the suffering saint that her suffering is her own fault — that more faith would have prevented it — and so heaps guilt on grief. Sentimentality reaches for emotion without truth, stirring feelings but offering no real medicine. Theological distance produces preaching that is doctrinally precise but pastorally cold, correct but unfeeling. And cheap comfort tosses true verses lightly at deep wounds, as if Romans 8:28 quoted quickly could mend a shattered heart. Each error fails the wounded in a different way: the first blames, the second numbs, the third freezes, the fourth trivializes. The cure is preaching that is both true and tender, neither hard nor shallow.",
    "modelEs": "Cuatro errores comunes vuelven frío el púlpito hacia el herido. El triunfalismo le dice al santo que sufre que su sufrimiento es su propia culpa — que más fe lo habría evitado — y así amontona culpa sobre el duelo. El sentimentalismo busca la emoción sin la verdad, agitando sentimientos pero sin ofrecer medicina real. La distancia teológica produce predicación doctrinalmente precisa pero pastoralmente fría, correcta pero sin sentimiento. Y el consuelo barato arroja versículos verdaderos a la ligera sobre heridas profundas, como si Romanos 8:28 citado rápidamente pudiera reparar un corazón destrozado. Cada error falla al herido de manera distinta: el primero culpa, el segundo adormece, el tercero congela, el cuarto trivializa. La cura es una predicación que sea a la vez verdadera y tierna, ni dura ni superficial."
  },
  {
    "textEn": "28. Why is the pastor's own soul-work essential to therapeutic preaching? What happens when this work is neglected?",
    "textEs": "28. ¿Por qué es esencial el trabajo del propio pastor sobre su alma para la predicación terapéutica? ¿Qué sucede cuando este trabajo se descuida?",
    "kw_en": [
      "soul",
      "wound",
      "suffer",
      "own",
      "heal",
      "seminary",
      "authentic",
      "neglect"
    ],
    "kw_es": [
      "alma",
      "herida",
      "sufre",
      "propio",
      "sanar",
      "seminario",
      "auténtic",
      "descuid"
    ],
    "modelEn": "The pastor's own soul-work is essential to therapeutic preaching, because a man preaches healing most truly from his own healed and unhealed wounds. Pastoral suffering is the seminary of therapeutic preaching — the losses, the grief, the dark seasons a pastor has walked through with God become the very places from which he can comfort others, as 2 Corinthians 1 promises. A man who has never let God work in his own wounds will preach about suffering theoretically, and the wounded will sense the hollowness. When this soul-work is neglected, the preaching turns cold or false: either clinically detached or dishonestly triumphant, because the man is hiding his own unhealed places rather than offering them to God. The healer must first be a patient. The pulpit cannot give what the pastor's own soul has not received.",
    "modelEs": "El trabajo del alma del propio pastor es esencial para la predicación terapéutica, porque un hombre predica sanidad más verdaderamente desde sus propias heridas sanadas y no sanadas. El sufrimiento pastoral es el seminario de la predicación terapéutica — las pérdidas, el duelo, las temporadas oscuras que un pastor ha atravesado con Dios se vuelven los lugares mismos desde donde puede consolar a otros, como promete 2 Corintios 1. Un hombre que nunca ha dejado que Dios obre en sus propias heridas predicará sobre el sufrimiento teóricamente, y el herido sentirá el vacío. Cuando se descuida este trabajo del alma, la predicación se vuelve fría o falsa: o clínicamente distante o deshonestamente triunfalista, porque el hombre esconde sus propios lugares no sanados en vez de ofrecerlos a Dios. El sanador debe ser primero un paciente. El púlpito no puede dar lo que el alma del pastor no ha recibido."
  },
  {
    "textEn": "29. Why must therapeutic preaching always lead to Christ as the Wounded Healer? What replaces the gospel when this step is missing?",
    "textEs": "29. ¿Por qué debe la predicación terapéutica siempre llevar a Cristo como el Sanador Herido? ¿Qué reemplaza al evangelio cuando este paso falta?",
    "kw_en": [
      "christ",
      "wounded",
      "moralism",
      "gospel",
      "scar",
      "cross",
      "hope",
      "heal"
    ],
    "kw_es": [
      "cristo",
      "herido",
      "moralismo",
      "evangelio",
      "cicatriz",
      "cruz",
      "esperanza",
      "sanar"
    ],
    "modelEn": "Therapeutic preaching must always lead to Christ as the Wounded Healer, because He alone is the source of true and lasting healing — pierced for our transgressions, bearing the scars still, able to sympathize because He has suffered. When this final step is missing, what replaces the gospel is moralism: 'try harder, have more faith, follow these steps,' which lays a heavier burden on the already wounded. A sermon that names the wound and applies Scripture but never arrives at Christ leaves the sufferer with advice instead of a Savior. The cross is where the wounded meet the One whose wounds heal theirs. Without Him, therapeutic preaching collapses into religious self-help, and the hurting are sent away with a technique instead of hope.",
    "modelEs": "La predicación terapéutica siempre debe llevar a Cristo como el Sanador herido, porque solo Él es la fuente de sanidad verdadera y duradera — traspasado por nuestras transgresiones, llevando las cicatrices todavía, capaz de simpatizar porque Él ha sufrido. Cuando falta este paso final, lo que reemplaza al evangelio es el moralismo: 'esfuérzate más, ten más fe, sigue estos pasos,' lo cual pone una carga más pesada sobre el ya herido. Un sermón que nombra la herida y aplica la Escritura pero nunca llega a Cristo deja al doliente con consejos en vez de un Salvador. La cruz es donde el herido encuentra a Aquel cuyas heridas sanan las suyas. Sin Él, la predicación terapéutica colapsa en autoayuda religiosa, y el que sufre es despedido con una técnica en vez de esperanza."
  },
  {
    "textEn": "30. Synthesize the entire unit: How does therapeutic preaching express the heart of God toward His wounded people through the voice of His undershepherd?",
    "textEs": "30. Sintetice toda la unidad: ¿Cómo expresa la predicación terapéutica el corazón de Dios hacia Su pueblo herido a través de la voz de Su subpastor?",
    "kw_en": [
      "heart",
      "god",
      "wounded",
      "undershepherd",
      "heal",
      "scripture",
      "christ",
      "comfort"
    ],
    "kw_es": [
      "corazón",
      "dios",
      "herido",
      "subpastor",
      "sanar",
      "escritura",
      "cristo",
      "consuelo"
    ],
    "modelEn": "Therapeutic preaching expresses the heart of God toward His wounded people through the voice of His undershepherd. God is the God of all comfort, the One who binds up the brokenhearted, and the pastor is the instrument through whom that comfort reaches the pew. Seeing his congregation as a hospital ward, the preacher diagnoses honestly, applies Scripture as the only true balm, and points always to Christ the Wounded Healer. He avoids the cold errors of triumphalism, sentimentality, distance, and cheap comfort, and he preaches from his own soul-work, his own wounds healed and being healed. In all of it the pulpit becomes a healing station where the suffering meet not the pastor's cleverness but the tenderness of God Himself. This is the undershepherd carrying the wounded sheep, because the Chief Shepherd carried him first.",
    "modelEs": "La predicación terapéutica expresa el corazón de Dios hacia Su pueblo herido a través de la voz de Su subpastor. Dios es el Dios de toda consolación, Aquel que venda a los quebrantados de corazón, y el pastor es el instrumento por medio del cual ese consuelo llega al banco. Viendo a su congregación como una sala de hospital, el predicador diagnostica honestamente, aplica la Escritura como el único bálsamo verdadero, y señala siempre a Cristo el Sanador herido. Evita los errores fríos del triunfalismo, el sentimentalismo, la distancia y el consuelo barato, y predica desde el trabajo de su propia alma, sus propias heridas sanadas y siendo sanadas. En todo ello el púlpito se vuelve una estación de sanidad donde el que sufre encuentra no la astucia del pastor sino la ternura de Dios mismo. Este es el subpastor cargando a la oveja herida, porque el Príncipe de los pastores lo cargó a él primero."
  }
];

const PREV_HREF = 'CTSPMUnit2.html';

const NEXT_HREF = 'CTSPMUnit4.html';
