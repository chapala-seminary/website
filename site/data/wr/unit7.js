/* CTSWR - unit 7: per-unit configuration and content. */

const UNIT = 7;

let currentUnit = 7;

const mcQuestions = [
  {
    "textEn": "1. Unlike Hinduism and Buddhism, Sikhism is distinctive in this course because it:",
    "textEs": "1. A diferencia del hinduismo y el budismo, el sijismo es distintivo en este curso porque:",
    "optionsEn": [
      "Was founded by a specific historical figure at a datable moment",
      "Has no founder at all",
      "Developed only after Islam disappeared",
      "Rejects the existence of any God"
    ],
    "optionsEs": [
      "Fue fundado por una figura histórica específica en un momento fechable",
      "No tiene fundador en absoluto",
      "Se desarrolló solo después de que el islam desapareciera",
      "Rechaza la existencia de cualquier Dios"
    ],
    "c": 21,
    "explEn": "Unlike Hinduism and Buddhism, Sikhism traces its origin to a specific historical figure, Guru Nanak, though the tradition continued developing through the Gurus who followed him.",
    "explEs": "A diferencia del hinduismo y el budismo, el sijismo traza su origen a una figura histórica específica, el Gurú Nanak, aunque la tradición siguió desarrollándose a través de los Gurús que lo siguieron."
  },
  {
    "textEn": "2. Guru Nanak was born in 1469 in the region of:",
    "textEs": "2. El Gurú Nanak nació en 1469 en la región de:",
    "optionsEn": [
      "Bengal",
      "Punjab",
      "Tibet",
      "Kerala"
    ],
    "optionsEs": [
      "Bengala",
      "Punjab",
      "Tíbet",
      "Kerala"
    ],
    "c": 29,
    "explEn": "Guru Nanak was born in 1469 in the Punjab region of what is now Pakistan and northern India.",
    "explEs": "El Gurú Nanak nació en 1469 en la región del Punjab de lo que hoy es Pakistán y el norte de la India."
  },
  {
    "textEn": "3. Nanak's declaration 'There is no Hindu, there is no Muslim' is understood by Sikh tradition to mean:",
    "textEs": "3. La declaración de Nanak 'No hay hindú, no hay musulmán' se entiende por la tradición sij que significa:",
    "optionsEn": [
      "Both religions are completely false",
      "Both religions are equally and fully true",
      "A single formless God transcends the sectarian divide both communities built",
      "Only Sikhs will be saved"
    ],
    "optionsEs": [
      "Ambas religiones son completamente falsas",
      "Ambas religiones son igual y plenamente verdaderas",
      "Un único Dios sin forma trasciende la división sectaria que ambas comunidades construyeron",
      "Solo los sijes se salvarán"
    ],
    "c": 37,
    "explEn": "This declaration is understood as pointing beyond the sectarian divide toward a single, formless God who transcends the divisions both communities had built around Him.",
    "explEs": "Esta declaración se entiende como señalando más allá de la división sectaria hacia un único Dios sin forma que trasciende las divisiones que ambas comunidades habían construido en torno a Él."
  },
  {
    "textEn": "4. According to this unit, many of Nanak's earliest followers understood his teaching as offering:",
    "textEs": "4. Según esta unidad, muchos de los primeros seguidores de Nanak entendieron su enseñanza como ofreciendo:",
    "optionsEn": [
      "A synthesis affirming Hinduism and Islam equally",
      "A return to pure Hinduism",
      "A rejection of all religion entirely",
      "A genuine third way, a fresh revelation correcting both traditions"
    ],
    "optionsEs": [
      "Una síntesis que afirmaba al hinduismo y al islam por igual",
      "Un regreso al hinduismo puro",
      "Un rechazo total de toda religión",
      "Una genuina tercera vía, una revelación fresca que corregía ambas tradiciones"
    ],
    "c": 45,
    "explEn": "Nanak's teaching was received as a genuine third way, a distinct new revelation that Sikhs believe corrected and completed what both earlier traditions had gotten partly right and wrong.",
    "explEs": "La enseñanza de Nanak fue recibida como una genuina tercera vía, una nueva revelación distinta que los sijes creen corrigió y completó lo que ambas tradiciones anteriores habían acertado y errado en parte."
  },
  {
    "textEn": "5. Guru Gobind Singh, shortly before his death in 1708, declared that spiritual authority would pass to:",
    "textEs": "5. El Gurú Gobind Singh, poco antes de su muerte en 1708, declaró que la autoridad espiritual pasaría a:",
    "optionsEn": [
      "The Sikh scripture itself, the Guru Granth Sahib",
      "A new eleventh human Guru",
      "The Mughal emperor",
      "A council of Hindu priests"
    ],
    "optionsEs": [
      "La escritura sij misma, el Guru Granth Sahib",
      "Un nuevo undécimo Gurú humano",
      "El emperador mogol",
      "Un consejo de sacerdotes hindúes"
    ],
    "c": 49,
    "explEn": "Guru Gobind Singh declared that after his death the line of human Gurus would end, with spiritual authority passing permanently to the Guru Granth Sahib.",
    "explEs": "El Gurú Gobind Singh declaró que después de su muerte la línea de Gurús humanos terminaría, con la autoridad espiritual pasando permanentemente al Guru Granth Sahib."
  },
  {
    "textEn": "6. The Mul Mantar, the opening words of the Guru Granth Sahib, begins with the phrase:",
    "textEs": "6. El Mul Mantar, las palabras iniciales del Guru Granth Sahib, comienza con la frase:",
    "optionsEn": [
      "Om Namah Shivaya",
      "Ik Onkar, 'There is one God'",
      "Allahu Akbar",
      "Namu Amida Butsu"
    ],
    "optionsEs": [
      "Om Namah Shivaya",
      "Ik Onkar, 'Hay un Dios'",
      "Allahu Akbar",
      "Namu Amida Butsu"
    ],
    "c": 57,
    "explEn": "The Mul Mantar begins with Ik Onkar, 'There is one God,' capturing Sikh theology's uncompromising monotheism.",
    "explEs": "El Mul Mantar comienza con Ik Onkar, 'Hay un Dios,' capturando el monoteísmo intransigente de la teología sij."
  },
  {
    "textEn": "7. Unlike the impersonal Brahman of Hindu philosophy, Sikh theology describes God as:",
    "textEs": "7. A diferencia del Brahman impersonal de la filosofía hindú, la teología sij describe a Dios como:",
    "optionsEn": [
      "Completely unknowable in any sense",
      "Identical to Vishnu",
      "Loving, gracious, and near to those who seek Him sincerely",
      "A collection of many separate gods"
    ],
    "optionsEs": [
      "Completamente incognoscible en cualquier sentido",
      "Idéntico a Vishnu",
      "Amoroso, misericordioso, y cercano a quienes lo buscan sinceramente",
      "Una colección de muchos dioses separados"
    ],
    "c": 65,
    "explEn": "Sikh theology describes God in terms carrying real personal warmth, often addressed as loving, gracious, and near to sincere seekers.",
    "explEs": "La teología sij describe a Dios en términos que llevan calidez personal real, a menudo dirigido como amoroso, misericordioso, y cercano a los buscadores sinceros."
  },
  {
    "textEn": "8. The Guru Granth Sahib includes writings by Sikh Gurus and also by:",
    "textEs": "8. El Guru Granth Sahib incluye escritos de los Gurús sijes y también de:",
    "optionsEn": [
      "Only Sikh women",
      "Roman Catholic priests",
      "Buddhist monks exclusively",
      "Respected Hindu and Muslim devotional poets"
    ],
    "optionsEs": [
      "Solo mujeres sijes",
      "Sacerdotes católicos romanos",
      "Exclusivamente monjes budistas",
      "Respetados poetas devocionales hindúes y musulmanes"
    ],
    "c": 73,
    "explEn": "The Guru Granth Sahib includes a smaller number of respected Hindu and Muslim devotional poets whose writings the Sikh Gurus judged to be in harmony with their teaching.",
    "explEs": "El Guru Granth Sahib incluye un número menor de respetados poetas devocionales hindúes y musulmanes cuyos escritos los Gurús sijes juzgaron estar en armonía con su enseñanza."
  },
  {
    "textEn": "9. Since 1708, the Guru Granth Sahib is treated in gurdwaras with:",
    "textEs": "9. Desde 1708, el Guru Granth Sahib se trata en los gurdwaras con:",
    "optionsEn": [
      "The reverence a living Guru would receive",
      "No particular reverence",
      "Complete indifference",
      "Reverence lower than any human teacher"
    ],
    "optionsEs": [
      "La reverencia que recibiría un Gurú viviente",
      "Ninguna reverencia particular",
      "Indiferencia total",
      "Reverencia menor que cualquier maestro humano"
    ],
    "c": 77,
    "explEn": "Since Guru Gobind Singh's declaration, the Guru Granth Sahib is treated with the reverence a living Guru would receive, enthroned and approached with gestures of respect.",
    "explEs": "Desde la declaración del Gurú Gobind Singh, el Guru Granth Sahib se trata con la reverencia que recibiría un Gurú viviente, entronizado y abordado con gestos de respeto."
  },
  {
    "textEn": "10. Mukti, the Sikh goal of spiritual life, refers to:",
    "textEs": "10. El mukti, la meta sij de la vida espiritual, se refiere a:",
    "optionsEn": [
      "Political independence for Punjab",
      "Liberation from the cycle of karma and samsara",
      "The Sikh dietary code",
      "A form of ritual sacrifice"
    ],
    "optionsEs": [
      "Independencia política para el Punjab",
      "Liberación del ciclo de karma y samsara",
      "El código dietético sij",
      "Una forma de sacrificio ritual"
    ],
    "c": 85,
    "explEn": "Mukti is liberation from the cycle of karma and samsara, the Sikh goal shared conceptually with Hindu tradition though achieved differently.",
    "explEs": "El mukti es la liberación del ciclo de karma y samsara, la meta sij compartida conceptualmente con la tradición hindú aunque lograda de manera diferente."
  },
  {
    "textEn": "11. According to this unit, Sikh teaching on achieving liberation diverges from Hindu and Buddhist paths by:",
    "textEs": "11. Según esta unidad, la enseñanza sij sobre lograr la liberación diverge de los caminos hindú y budista al:",
    "optionsEn": [
      "Requiring celibate monasticism",
      "Denying that liberation is possible at all",
      "Rejecting ascetic withdrawal in favor of honest work and family life",
      "Requiring pilgrimage to Mecca"
    ],
    "optionsEs": [
      "Requerir monasticismo célibe",
      "Negar que la liberación sea posible en absoluto",
      "Rechazar el retiro ascético en favor del trabajo honesto y la vida familiar",
      "Requerir peregrinación a La Meca"
    ],
    "c": 93,
    "explEn": "Sikhism explicitly rejects celibate monasticism and ascetic withdrawal, achieving liberation instead through sincere remembrance of God's name combined with honest work and family engagement.",
    "explEs": "El sijismo rechaza explícitamente el monasticismo célibe y el retiro ascético, logrando la liberación en cambio a través del recuerdo sincero del nombre de Dios combinado con trabajo honesto y compromiso familiar."
  },
  {
    "textEn": "12. Guru Gobind Singh formally established the Khalsa in the year:",
    "textEs": "12. El Gurú Gobind Singh estableció formalmente el Khalsa en el año:",
    "optionsEn": [
      "1469",
      "1708 only",
      "2000",
      "1699"
    ],
    "optionsEs": [
      "1469",
      "Solo 1708",
      "2000",
      "1699"
    ],
    "c": 101,
    "explEn": "Guru Gobind Singh formally established the Khalsa in 1699, instituting the Five Ks as visible articles of faith.",
    "explEs": "El Gurú Gobind Singh estableció formalmente el Khalsa en 1699, instituyendo las Cinco Kas como artículos visibles de fe."
  },
  {
    "textEn": "13. Kesh, one of the Five Ks, refers to:",
    "textEs": "13. El Kesh, una de las Cinco Kas, se refiere a:",
    "optionsEn": [
      "Uncut hair",
      "A steel bracelet",
      "A ceremonial dagger",
      "Cotton undergarments"
    ],
    "optionsEs": [
      "El cabello sin cortar",
      "Un brazalete de acero",
      "Una daga ceremonial",
      "Prendas interiores de algodón"
    ],
    "c": 105,
    "explEn": "Kesh is uncut hair, understood as accepting God's creation as given, and is the reason many Sikh men wear a turban.",
    "explEs": "El Kesh es el cabello sin cortar, entendido como aceptar la creación de Dios tal como se da, y es la razón por la cual muchos hombres sijes usan turbante."
  },
  {
    "textEn": "14. This unit specifically clarifies that the kirpan, the ceremonial sword, is understood in Sikh teaching as:",
    "textEs": "14. Esta unidad aclara específicamente que el kirpan, la espada ceremonial, se entiende en la enseñanza sij como:",
    "optionsEn": [
      "An endorsement of casual violence",
      "A last-resort instrument of protection and justice, not aggression",
      "A purely decorative item with no meaning",
      "Reserved only for Sikh priests"
    ],
    "optionsEs": [
      "Un respaldo a la violencia casual",
      "Un instrumento de último recurso de protección y justicia, no de agresión",
      "Un elemento puramente decorativo sin significado",
      "Reservado solo para sacerdotes sijes"
    ],
    "c": 113,
    "explEn": "Sikh teaching frames the kirpan strictly as a last-resort instrument of protection and justice, symbolizing the Khalsa's commitment to defend the defenseless, not aggression.",
    "explEs": "La enseñanza sij enmarca el kirpan estrictamente como un instrumento de último recurso de protección y justicia, simbolizando el compromiso del Khalsa de defender a los indefensos, no la agresión."
  },
  {
    "textEn": "15. Guru Gobind Singh instructed Khalsa men and women to adopt the surnames Singh and Kaur in order to:",
    "textEs": "15. El Gurú Gobind Singh instruyó a los hombres y mujeres del Khalsa a adoptar los apellidos Singh y Kaur para:",
    "optionsEn": [
      "Signal high caste status",
      "Honor the Mughal emperor",
      "Erase caste markers traditionally signaled by family surnames",
      "Distinguish Khalsa members from all other Sikhs permanently"
    ],
    "optionsEs": [
      "Señalar un estatus de casta alta",
      "Honrar al emperador mogol",
      "Borrar los marcadores de casta tradicionalmente señalados por los apellidos familiares",
      "Distinguir a los miembros del Khalsa de todos los demás sijes permanentemente"
    ],
    "c": 121,
    "explEn": "This deliberate erasure of caste markers from personal names expressed Sikhism's theological conviction that caste distinctions have no standing before God.",
    "explEs": "Esta borradura deliberada de los marcadores de casta de los nombres personales expresó la convicción teológica del sijismo de que las distinciones de casta no tienen validez delante de Dios."
  },
  {
    "textEn": "16. The Sikh place of worship, meaning 'the door of the Guru,' is called the:",
    "textEs": "16. El lugar de adoración sij, que significa 'la puerta del Gurú,' se llama el:",
    "optionsEn": [
      "Mosque",
      "Synagogue",
      "Pagoda",
      "Gurdwara"
    ],
    "optionsEs": [
      "Mezquita",
      "Sinagoga",
      "Pagoda",
      "Gurdwara"
    ],
    "c": 129,
    "explEn": "The gurdwara, literally 'the door of the Guru,' refers to the Guru Granth Sahib enthroned within.",
    "explEs": "El gurdwara, literalmente 'la puerta del Gurú,' se refiere al Guru Granth Sahib entronizado dentro."
  },
  {
    "textEn": "17. Langar, the free communal kitchen at every gurdwara, serves food to:",
    "textEs": "17. El langar, la cocina comunitaria gratuita en cada gurdwara, sirve comida a:",
    "optionsEn": [
      "Absolutely anyone, regardless of religion, caste, or status",
      "Only Khalsa Sikhs",
      "Only the poor",
      "Only men"
    ],
    "optionsEs": [
      "Absolutamente cualquiera, sin importar religión, casta, o estatus",
      "Solo a los sijes Khalsa",
      "Solo a los pobres",
      "Solo a los hombres"
    ],
    "c": 133,
    "explEn": "Langar serves a simple vegetarian meal to absolutely anyone who wishes to eat, regardless of religion, caste, wealth, or social status, seated together as an equality statement.",
    "explEs": "El langar sirve una comida vegetariana simple a absolutamente cualquiera que desee comer, sin importar religión, casta, riqueza, o estatus social, sentados juntos como declaración de igualdad."
  },
  {
    "textEn": "18. According to this unit, langar, naam japna, and vand chakna together express the Sikh refusal to separate:",
    "textEs": "18. Según esta unidad, el langar, naam japna y vand chakna juntos expresan el rechazo sij a separar:",
    "optionsEn": [
      "Confucianism and Taoism",
      "Devotion to God and practical service to others",
      "The Five Ks from the Khalsa",
      "Hindu and Muslim scripture"
    ],
    "optionsEs": [
      "El confucianismo y el taoísmo",
      "La devoción a Dios y el servicio práctico a otros",
      "Las Cinco Kas del Khalsa",
      "La escritura hindú y musulmana"
    ],
    "c": 141,
    "explEn": "Sikh teaching holds naam japna (remembrance of God), seva (selfless service), and vand chakna (sharing) together as inseparable, refusing any split between devotion and practical service.",
    "explEs": "La enseñanza sij mantiene juntos el naam japna (recuerdo de Dios), el seva (servicio desinteresado), y el vand chakna (compartir) como inseparables, rechazando cualquier separación entre devoción y servicio práctico."
  },
  {
    "textEn": "19. According to Romans 2:11 and Galatians 3:28, cited in this unit, what genuine common ground exists between Sikhism and Scripture?",
    "textEs": "19. Según Romanos 2:11 y Gálatas 3:28, citados en esta unidad, ¿qué terreno común genuino existe entre el sijismo y la Escritura?",
    "optionsEn": [
      "Rejection of any moral law",
      "Agreement that karma determines salvation",
      "The conviction that there is no partiality with God and all are one in Christ",
      "Rejection of the Guru Granth Sahib entirely"
    ],
    "optionsEs": [
      "El rechazo de cualquier ley moral",
      "El acuerdo de que el karma determina la salvación",
      "La convicción de que no hay acepción de personas con Dios y todos son uno en Cristo",
      "El rechazo total del Guru Granth Sahib"
    ],
    "c": 149,
    "explEn": "Romans 2:11 and Galatians 3:28 affirm no partiality with God and unity in Christ, echoing Sikhism's radical commitment to human equality embodied in langar.",
    "explEs": "Romanos 2:11 y Gálatas 3:28 afirman que no hay acepción de personas con Dios y unidad en Cristo, haciendo eco del compromiso radical del sijismo con la igualdad humana encarnada en el langar."
  },
  {
    "textEn": "20. According to this unit, using Ephesians 2:8-9 and John 14:6, what does the gospel offer that Sikhism structurally cannot?",
    "textEs": "20. Según esta unidad, usando Efesios 2:8-9 y Juan 14:6, ¿qué ofrece el evangelio que el sijismo no puede ofrecer estructuralmente?",
    "optionsEn": [
      "A book of sacred hymns",
      "A community meal",
      "Rejection of caste",
      "Liberation as a finished gift by faith, and a living Person who is the way, not merely a book"
    ],
    "optionsEs": [
      "Un libro de himnos sagrados",
      "Una comida comunitaria",
      "El rechazo de la casta",
      "La liberación como un regalo terminado por fe, y una Persona viviente que es el camino, no meramente un libro"
    ],
    "c": 157,
    "explEn": "Ephesians 2:8-9 offers liberation as a finished gift received by faith rather than accumulated merit, and John 14:6 proclaims a living Person as the way, not merely a sacred book like the Guru Granth Sahib.",
    "explEs": "Efesios 2:8-9 ofrece la liberación como un regalo terminado recibido por fe en lugar de mérito acumulado, y Juan 14:6 proclama a una Persona viviente como el camino, no meramente un libro sagrado como el Guru Granth Sahib."
  }
];

const kwQuestions = [
  {
    "textEn": "21. Explain why this unit calls Sikhism a 'clear case study' for how a religious founder can deliberately set out to transcend, rather than reform, two existing traditions.",
    "textEs": "21. Explique por qué esta unidad llama al sijismo un 'claro estudio de caso' de cómo un fundador religioso puede deliberadamente proponerse trascender, en lugar de reformar, dos tradiciones existentes.",
    "kw_en": ["nanak", "transcend", "hindu", "muslim", "inadequate", "founder", "specific", "datable"],
    "kw_es": ["nanak", "trascend", "hindú", "musulmán", "inadecuad", "fundador", "específic", "fechable"],
    "modelEn": "Unlike Hinduism and Buddhism, which developed gradually with no single identifiable founder, Sikh tradition traces its origin to Guru Nanak, whose teaching arose in direct, conscious response to tensions between Hinduism and Islam in Punjab, even as the tradition continued to take shape through the Gurus who followed him. Sikh tradition understands Nanak as pointing beyond the sectarian divide toward a fresh revelation, rather than merely reforming either tradition from within.",
    "modelEs": "A diferencia del hinduismo y el budismo, que se desarrollaron gradualmente sin un solo fundador identificable, la tradición sij traza su origen al Gurú Nanak, cuya enseñanza surgió en respuesta directa y consciente a las tensiones entre el hinduismo y el islam en el Punjab, aun cuando la tradición siguió tomando forma a través de los Gurús que lo siguieron. La tradición sij entiende que Nanak apuntaba más allá de la división sectaria hacia una revelación fresca, en lugar de meramente reformar cualquiera de las tradiciones desde dentro."
  },
  {
    "textEn": "22. Describe the historical and religious context of sixteenth-century Punjab and how it shaped Guru Nanak's message.",
    "textEs": "22. Describa el contexto histórico y religioso del Punjab del siglo dieciséis y cómo dio forma al mensaje del Gurú Nanak.",
    "kw_en": ["mughal", "hindu", "muslim", "tension", "suspicion", "conflict", "third way", "divided"],
    "kw_es": ["mogol", "hindú", "musulmán", "tensión", "sospecha", "conflicto", "tercera vía", "dividida"],
    "modelEn": "Sixteenth-century Punjab sat under Muslim Mughal rule while remaining home to a large Hindu population, with relations marked by mutual suspicion and occasional conflict. Nanak's teaching was received by followers from both backgrounds as a genuine third way, a fresh disclosure of the one God to a religiously divided region, rather than a synthesis affirming both traditions equally or a rejection of everything either taught.",
    "modelEs": "El Punjab del siglo dieciséis estaba bajo el gobierno mogol musulmán mientras seguía siendo hogar de una gran población hindú, con relaciones marcadas por sospecha mutua y conflicto ocasional. La enseñanza de Nanak fue recibida por seguidores de ambos trasfondos como una genuina tercera vía, una revelación fresca del único Dios a una región religiosamente dividida, en lugar de una síntesis que afirmaba ambas tradiciones por igual o un rechazo de todo lo que ambas enseñaban."
  },
  {
    "textEn": "23. Explain the significance of Guru Gobind Singh's decision in 1708 regarding the succession of Gurus, and how this distinguishes Sikhism structurally from some other religions studied in this course.",
    "textEs": "23. Explique la significación de la decisión del Gurú Gobind Singh en 1708 respecto a la sucesión de Gurús, y cómo esto distingue estructuralmente al sijismo de algunas otras religiones estudiadas en este curso.",
    "kw_en": ["tenth", "guru granth sahib", "authority", "living", "human", "papal", "caliphal", "scripture"],
    "kw_es": ["décimo", "guru granth sahib", "autoridad", "viviente", "humano", "papal", "califal", "escritura"],
    "modelEn": "Guru Gobind Singh, the tenth and final human Guru, declared shortly before his death in 1708 that the line of human Gurus would end, with spiritual authority passing permanently to the Guru Granth Sahib. This means Sikhism recognizes no living human religious authority above the community and its text, distinguishing it structurally from the papal or caliphal authority structures found in some other traditions this course has studied.",
    "modelEs": "El Gurú Gobind Singh, el décimo y último Gurú humano, declaró poco antes de su muerte en 1708 que la línea de Gurús humanos terminaría, con la autoridad espiritual pasando permanentemente al Guru Granth Sahib. Esto significa que el sijismo no reconoce ninguna autoridad religiosa humana viviente por encima de la comunidad y su texto, distinguiéndolo estructuralmente de las estructuras de autoridad papal o califal encontradas en algunas otras tradiciones que este curso ha estudiado."
  },
  {
    "textEn": "24. Describe Ik Onkar and explain how Sikh theology's description of God differs from the Hindu Brahman studied in Unit 4.",
    "textEs": "24. Describa el Ik Onkar y explique en qué difiere la descripción de Dios de la teología sij del Brahman hindú estudiado en la Unidad 4.",
    "kw_en": ["ik onkar", "mul mantar", "one god", "formless", "personal", "loving", "brahman", "impersonal"],
    "kw_es": ["ik onkar", "mul mantar", "un dios", "sin forma", "personal", "amoroso", "brahman", "impersonal"],
    "modelEn": "Ik Onkar, 'There is one God,' opens the Mul Mantar and captures Sikh theology's uncompromising monotheism, describing God as formless, eternal, uncreated, and self-existent. Unlike the impersonal Brahman of Hindu philosophy, Sikh theology describes God with real personal warmth, often addressed as loving, gracious, and near to sincere seekers, knowable through devotion even while remaining formless.",
    "modelEs": "Ik Onkar, 'Hay un Dios,' abre el Mul Mantar y captura el monoteísmo intransigente de la teología sij, describiendo a Dios como sin forma, eterno, increado, y autoexistente. A diferencia del Brahman impersonal de la filosofía hindú, la teología sij describe a Dios con calidez personal real, a menudo dirigido como amoroso, misericordioso, y cercano a los buscadores sinceros, cognoscible a través de la devoción incluso mientras permanece sin forma."
  },
  {
    "textEn": "25. How does Sikh teaching on achieving mukti differ from the Hindu and Buddhist paths to liberation studied in Units 4 and 5?",
    "textEs": "25. ¿En qué difiere la enseñanza sij sobre lograr el mukti de los caminos hindú y budista hacia la liberación estudiados en las Unidades 4 y 5?",
    "kw_en": ["mukti", "simran", "reject", "celibate", "monasticism", "honest work", "family", "ascetic"],
    "kw_es": ["mukti", "simran", "rechaz", "célibe", "monasticismo", "trabajo honesto", "familia", "ascétic"],
    "modelEn": "Sikhism shares the goal of mukti, liberation from karma and samsara, but explicitly rejects celibate monasticism and ascetic withdrawal that Hinduism and Buddhism in their rigorous forms have historically prized. Instead, liberation is achieved through simran, sincere remembrance of God's name, combined with honest work, generous sharing, and full engagement in ordinary family and community life.",
    "modelEs": "El sijismo comparte la meta del mukti, la liberación del karma y el samsara, pero rechaza explícitamente el monasticismo célibe y el retiro ascético que el hinduismo y el budismo en sus formas rigurosas históricamente han apreciado. En cambio, la liberación se logra a través del simran, el recuerdo sincero del nombre de Dios, combinado con trabajo honesto, compartir generoso, y pleno compromiso con la vida familiar y comunitaria ordinaria."
  },
  {
    "textEn": "26. List and briefly explain the Five Ks, and explain the correct understanding of the kirpan this unit insists on.",
    "textEs": "26. Enumere y explique brevemente las Cinco Kas, y explique el entendimiento correcto del kirpan en el que insiste esta unidad.",
    "kw_en": ["kesh", "kangha", "kara", "kachera", "kirpan", "last resort", "defenseless", "aggression"],
    "kw_es": ["kesh", "kangha", "kara", "kachera", "kirpan", "último recurso", "indefensos", "agresión"],
    "modelEn": "The Five Ks are: Kesh, uncut hair, accepting creation as given; Kangha, a wooden comb, symbolizing cleanliness; Kara, a steel bracelet, symbolizing restraint and God's eternal nature; Kachera, cotton undergarments, symbolizing modesty; and Kirpan, a ceremonial sword symbolizing commitment to defend the defenseless. This unit insists the kirpan must be understood strictly as a last-resort instrument of protection and justice, not an endorsement of casual violence or aggression.",
    "modelEs": "Las Cinco Kas son: Kesh, cabello sin cortar, aceptando la creación tal como se da; Kangha, un peine de madera, simbolizando limpieza; Kara, un brazalete de acero, simbolizando restricción y la naturaleza eterna de Dios; Kachera, prendas interiores de algodón, simbolizando modestia; y Kirpan, una espada ceremonial simbolizando el compromiso de defender a los indefensos. Esta unidad insiste en que el kirpan debe entenderse estrictamente como un instrumento de último recurso de protección y justicia, no un respaldo a la violencia casual o la agresión."
  },
  {
    "textEn": "27. Explain the significance of the surnames Singh and Kaur, and what this practice reveals about Sikhism's founding convictions.",
    "textEs": "27. Explique la significación de los apellidos Singh y Kaur, y qué revela esta práctica acerca de las convicciones fundacionales del sijismo.",
    "kw_en": ["singh", "kaur", "lion", "princess", "caste", "erase", "surname", "standing"],
    "kw_es": ["singh", "kaur", "león", "princesa", "casta", "borr", "apellido", "validez"],
    "modelEn": "Guru Gobind Singh instructed Khalsa men to adopt Singh, 'lion,' and women to adopt Kaur, 'princess,' replacing family surnames that in Hindu culture signaled caste status. This deliberate erasure of caste markers from personal names was a concrete, lasting expression of Sikhism's theological conviction that caste distinctions have no standing before God.",
    "modelEs": "El Gurú Gobind Singh instruyó a los hombres del Khalsa a adoptar Singh, 'león,' y a las mujeres a adoptar Kaur, 'princesa,' reemplazando los apellidos familiares que en la cultura hindú señalaban el estatus de casta. Esta borradura deliberada de los marcadores de casta de los nombres personales fue una expresión concreta y duradera de la convicción teológica del sijismo de que las distinciones de casta no tienen validez delante de Dios."
  },
  {
    "textEn": "28. Describe langar and explain the three pillars it embodies alongside seva.",
    "textEs": "28. Describa el langar y explique los tres pilares que encarna junto al seva.",
    "kw_en": ["langar", "free", "vegetarian", "equality", "seva", "naam japna", "vand chakna", "inseparable"],
    "kw_es": ["langar", "gratuit", "vegetarian", "igualdad", "seva", "naam japna", "vand chakna", "inseparable"],
    "modelEn": "Langar is the free communal kitchen at every gurdwara, serving a simple vegetarian meal to anyone regardless of religion, caste, or status, seated together as a statement of equality before God. It embodies seva, selfless service, alongside naam japna, remembrance of God's name, and vand chakna, sharing honestly earned goods — three pillars Sikh teaching holds as inseparable, refusing any split between devotion to God and service to others.",
    "modelEs": "El langar es la cocina comunitaria gratuita en cada gurdwara, sirviendo una comida vegetariana simple a cualquiera sin importar religión, casta, o estatus, sentados juntos como declaración de igualdad delante de Dios. Encarna el seva, el servicio desinteresado, junto con el naam japna, el recuerdo del nombre de Dios, y el vand chakna, compartir bienes honestamente ganados — tres pilares que la enseñanza sij mantiene como inseparables, rechazando cualquier separación entre la devoción a Dios y el servicio a otros."
  },
  {
    "textEn": "29. Using Romans 2:11 and Galatians 3:28, explain the genuine common ground this unit identifies between Sikhism and Scripture regarding equality.",
    "textEs": "29. Usando Romanos 2:11 y Gálatas 3:28, explique el terreno común genuino que identifica esta unidad entre el sijismo y la Escritura respecto a la igualdad.",
    "kw_en": ["partiality", "one in christ", "equality", "dignity", "langar", "affirm", "resonate", "grasped"],
    "kw_es": ["acepción", "uno en cristo", "igualdad", "dignidad", "langar", "afirm", "resuena", "capt"],
    "modelEn": "Romans 2:11 says there is no partiality with God, and Galatians 3:28 says there is neither slave nor free, male nor female, for all are one in Christ. These affirmations resonate closely with Sikhism's radical commitment to human equality embodied in langar, allowing a pastor to affirm wholeheartedly that Sikhism has grasped something real about human dignity and equality before God, however differently grounded theologically.",
    "modelEs": "Romanos 2:11 dice que no hay acepción de personas con Dios, y Gálatas 3:28 dice que no hay esclavo ni libre, varón ni mujer, porque todos son uno en Cristo. Estas afirmaciones resuenan estrechamente con el compromiso radical del sijismo con la igualdad humana encarnada en el langar, permitiendo a un pastor afirmar de todo corazón que el sijismo ha captado algo real acerca de la dignidad humana y la igualdad delante de Dios, aunque fundamentada teológicamente de manera diferente."
  },
  {
    "textEn": "30. Synthesize this unit: using Ephesians 2:8-9 and John 14:6, explain what the gospel offers that Sikhism, for all its genuine insight, cannot offer structurally.",
    "textEs": "30. Sintetice esta unidad: usando Efesios 2:8-9 y Juan 14:6, explique qué ofrece el evangelio que el sijismo, a pesar de toda su intuición genuina, no puede ofrecer estructuralmente.",
    "kw_en": ["finished gift", "faith", "merit", "book", "living person", "way truth life", "guru", "save"],
    "kw_es": ["regalo terminado", "fe", "mérito", "libro", "persona viviente", "camino verdad vida", "gurú", "salvar"],
    "modelEn": "Where Sikh theology grounds liberation in sincere devotion and honest living offered across many lifetimes as karma requires, Ephesians 2:8-9 offers liberation as a finished gift received by faith, not of works, so no one can boast. Where the Guru Granth Sahib remains a book however reverently enthroned, John 14:6 proclaims a living Person, God become flesh, who declared Himself the way, the truth, and the life, able not merely to instruct sincere seekers but actually to save them as the true and final Guru.",
    "modelEs": "Donde la teología sij fundamenta la liberación en la devoción sincera y la vida honesta ofrecidas a lo largo de muchas vidas según requiera el karma, Efesios 2:8-9 ofrece la liberación como un regalo terminado recibido por fe, no por obras, para que nadie se gloríe. Donde el Guru Granth Sahib sigue siendo un libro por más reverentemente entronizado que esté, Juan 14:6 proclama a una Persona viviente, Dios hecho carne, que se declaró a sí mismo el camino, la verdad, y la vida, capaz no meramente de instruir a buscadores sinceros sino realmente de salvarlos como el verdadero y final Gurú."
  }
];

const PREV_HREF = 'CTSWRUnit6.html';

const NEXT_HREF = 'CTSWRUnit8.html';
