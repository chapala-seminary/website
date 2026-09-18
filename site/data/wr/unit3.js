/* CTSWR - unit 3: per-unit configuration and content. */

const UNIT = 3;

let currentUnit = 3;

const mcQuestions = [
  {
    "textEn": "1. Muhammad was born around A.D. 570 in:",
    "textEs": "1. Mahoma nació alrededor del año 570 d.C. en:",
    "optionsEn": [
      "Mecca",
      "Medina",
      "Jerusalem",
      "Damascus"
    ],
    "optionsEs": [
      "La Meca",
      "Medina",
      "Jerusalén",
      "Damasco"
    ],
    "c": 21,
    "explEn": "Muhammad ibn Abdullah was born around A.D. 570 in Mecca, a trading city that also housed the pagan pilgrimage site called the Kaaba.",
    "explEs": "Mahoma ibn Abdullah nació alrededor del año 570 d.C. en La Meca, una ciudad comercial que también albergaba el sitio de peregrinación pagana llamado la Kaaba."
  },
  {
    "textEn": "2. According to Islamic tradition, Muhammad's revelations were delivered to him by:",
    "textEs": "2. Según la tradición islámica, las revelaciones de Mahoma le fueron entregadas por:",
    "optionsEn": [
      "Moses directly",
      "The angel Jibril (Gabriel)",
      "A voice from the Kaaba",
      "His wife Khadijah"
    ],
    "optionsEs": [
      "Moisés directamente",
      "El ángel Yibril (Gabriel)",
      "Una voz desde la Kaaba",
      "Su esposa Jadiya"
    ],
    "c": 29,
    "explEn": "Muslims believe Muhammad received his revelations from the angel Jibril (Gabriel) over a period of twenty-three years.",
    "explEs": "Los musulmanes creen que Mahoma recibió sus revelaciones del ángel Yibril (Gabriel) durante un período de veintitrés años."
  },
  {
    "textEn": "3. The Hijra refers to:",
    "textEs": "3. La Hégira se refiere a:",
    "optionsEn": [
      "Muhammad's first revelation",
      "The conquest of Mecca",
      "The migration from Mecca to Medina in A.D. 622",
      "Muhammad's death"
    ],
    "optionsEs": [
      "La primera revelación de Mahoma",
      "La conquista de La Meca",
      "La migración de La Meca a Medina en el año 622 d.C.",
      "La muerte de Mahoma"
    ],
    "c": 37,
    "explEn": "The Hijra was Muhammad's migration with his followers from Mecca to Medina in A.D. 622, an event so significant that the Islamic calendar dates from it.",
    "explEs": "La Hégira fue la migración de Mahoma con sus seguidores de La Meca a Medina en el año 622 d.C., un evento tan significativo que el calendario islámico se fecha desde él."
  },
  {
    "textEn": "4. Islamic tradition holds that Muhammad regarded himself as:",
    "textEs": "4. La tradición islámica sostiene que Mahoma se consideraba a sí mismo como:",
    "optionsEn": [
      "The first prophet in history",
      "Opposed to all previous prophets",
      "Unrelated to the biblical tradition",
      "The last in a line of prophets including Abraham, Moses, and Jesus"
    ],
    "optionsEs": [
      "El primer profeta de la historia",
      "Opuesto a todos los profetas anteriores",
      "Sin relación con la tradición bíblica",
      "El último de una línea de profetas que incluye a Abraham, Moisés y Jesús"
    ],
    "c": 45,
    "explEn": "Muhammad regarded himself as the 'seal of the prophets,' the last and greatest in a line including Adam, Noah, Abraham, Moses, and Jesus.",
    "explEs": "Mahoma se consideraba a sí mismo el 'sello de los profetas,' el último y más grande de una línea que incluye a Adán, Noé, Abraham, Moisés y Jesús."
  },
  {
    "textEn": "5. The Qur'an is organized into 114 chapters called:",
    "textEs": "5. El Corán está organizado en 114 capítulos llamados:",
    "optionsEn": [
      "Surahs",
      "Psalms",
      "Hadiths",
      "Epistles"
    ],
    "optionsEs": [
      "Suras",
      "Salmos",
      "Hadices",
      "Epístolas"
    ],
    "c": 49,
    "explEn": "The Qur'an is organized into 114 chapters called surahs, arranged roughly from longest to shortest rather than chronologically.",
    "explEs": "El Corán está organizado en 114 capítulos llamados suras, ordenados aproximadamente de más largo a más corto en lugar de cronológicamente."
  },
  {
    "textEn": "6. According to this unit, Islam holds that the Torah and the Injil (Gospel) were:",
    "textEs": "6. Según esta unidad, el islam sostiene que la Torá y el Inyil (Evangelio) fueron:",
    "optionsEn": [
      "Never given by God at all",
      "Originally true revelations later corrupted or altered",
      "Equal in authority to the Qur'an today",
      "Written entirely by Muhammad"
    ],
    "optionsEs": [
      "Nunca dados por Dios en absoluto",
      "Revelaciones originalmente verdaderas, luego corrompidas o alteradas",
      "Iguales en autoridad al Corán hoy",
      "Escritos enteramente por Mahoma"
    ],
    "c": 57,
    "explEn": "Islam affirms the Torah and Injil were originally true revelations from God but holds they were later corrupted or altered by Jewish and Christian communities.",
    "explEs": "El islam afirma que la Torá y el Inyil fueron originalmente revelaciones verdaderas de Dios pero sostiene que luego fueron corrompidas o alteradas por las comunidades judías y cristianas."
  },
  {
    "textEn": "7. The Shahada is:",
    "textEs": "7. La Shahada es:",
    "optionsEn": [
      "The pilgrimage to Mecca",
      "The month-long fast",
      "The declaration of faith making a person a Muslim",
      "The obligatory almsgiving"
    ],
    "optionsEs": [
      "La peregrinación a La Meca",
      "El ayuno de un mes",
      "La declaración de fe que hace musulmana a una persona",
      "La limosna obligatoria"
    ],
    "c": 65,
    "explEn": "The Shahada, 'There is no god but Allah, and Muhammad is his messenger,' sincerely recited, is what formally makes a person a Muslim.",
    "explEs": "La Shahada, 'No hay más dios que Alá, y Mahoma es su mensajero,' recitada sinceramente, es lo que formalmente hace musulmana a una persona."
  },
  {
    "textEn": "8. Sawm refers to:",
    "textEs": "8. El Sawm se refiere a:",
    "optionsEn": [
      "Daily ritual prayer",
      "Almsgiving",
      "Pilgrimage to Mecca",
      "Fasting during Ramadan"
    ],
    "optionsEs": [
      "La oración ritual diaria",
      "La limosna",
      "La peregrinación a La Meca",
      "El ayuno durante el Ramadán"
    ],
    "c": 73,
    "explEn": "Sawm is fasting during the month of Ramadan, abstaining from food, drink, and other physical needs from dawn until sunset.",
    "explEs": "El Sawm es el ayuno durante el mes de Ramadán, absteniéndose de comida, bebida y otras necesidades físicas desde el amanecer hasta la puesta del sol."
  },
  {
    "textEn": "9. Zakat is best described as:",
    "textEs": "9. El Zakat se describe mejor como:",
    "optionsEn": [
      "Obligatory almsgiving for the relief of the poor",
      "Ritual prayer five times daily",
      "The declaration of faith",
      "The pilgrimage to Mecca"
    ],
    "optionsEs": [
      "Limosna obligatoria para el alivio de los pobres",
      "La oración ritual cinco veces al día",
      "La declaración de fe",
      "La peregrinación a La Meca"
    ],
    "c": 77,
    "explEn": "Zakat is obligatory almsgiving, typically about two and a half percent of accumulated wealth, given annually for the relief of the poor.",
    "explEs": "El Zakat es la limosna obligatoria, típicamente alrededor del dos y medio por ciento de la riqueza acumulada, dada anualmente para el alivio de los pobres."
  },
  {
    "textEn": "10. The dispute that produced the Sunni-Shia division was originally about:",
    "textEs": "10. La disputa que produjo la división sunita-chiita fue originalmente acerca de:",
    "optionsEn": [
      "Which direction to pray",
      "Who should succeed Muhammad as leader",
      "The number of daily prayers",
      "The content of the Qur'an itself"
    ],
    "optionsEs": [
      "Hacia qué dirección orar",
      "Quién debía suceder a Mahoma como líder",
      "El número de oraciones diarias",
      "El contenido mismo del Corán"
    ],
    "c": 85,
    "explEn": "The Sunni-Shia division arose over a question of leadership succession after Muhammad's death, not initially a question of doctrine.",
    "explEs": "La división sunita-chiita surgió por una cuestión de sucesión de liderazgo tras la muerte de Mahoma, no inicialmente una cuestión de doctrina."
  },
  {
    "textEn": "11. Shia Muslims are known by that name because they were originally 'the party of':",
    "textEs": "11. Los musulmanes chiitas son conocidos por ese nombre porque originalmente eran 'el partido de':",
    "optionsEn": [
      "Abu Bakr",
      "Umar",
      "Ali",
      "Uthman"
    ],
    "optionsEs": [
      "Abu Bakr",
      "Umar",
      "Ali",
      "Uzmán"
    ],
    "c": 93,
    "explEn": "Shia comes from 'Shiat Ali,' meaning 'the party of Ali,' Muhammad's cousin and son-in-law, whose bloodline this group held should have inherited leadership.",
    "explEs": "Chiita viene de 'Shiat Ali,' que significa 'el partido de Ali,' primo y yerno de Mahoma, cuya línea de sangre este grupo sostenía que debía haber heredado el liderazgo."
  },
  {
    "textEn": "12. The Battle of Karbala in A.D. 680, resulting in the death of Ali's son Husayn, is especially significant to:",
    "textEs": "12. La Batalla de Karbala en el año 680 d.C., que resultó en la muerte del hijo de Ali, Huseín, es especialmente significativa para:",
    "optionsEn": [
      "Sunni identity",
      "Sufi identity",
      "Secular Muslim identity",
      "Shia identity"
    ],
    "optionsEs": [
      "La identidad sunita",
      "La identidad sufí",
      "La identidad musulmana secular",
      "La identidad chiita"
    ],
    "c": 101,
    "explEn": "Husayn's martyrdom at Karbala became a defining event of Shia religious identity, commemorated annually during the month of Muharram.",
    "explEs": "El martirio de Huseín en Karbala se convirtió en un evento definitorio de la identidad religiosa chiita, conmemorado anualmente durante el mes de Muharram."
  },
  {
    "textEn": "13. Approximately what percentage of the world's Muslims are Sunni?",
    "textEs": "13. ¿Aproximadamente qué porcentaje de los musulmanes del mundo son sunitas?",
    "optionsEn": [
      "About 85-90%",
      "About 10-15%",
      "About 50%",
      "Nearly 100%"
    ],
    "optionsEs": [
      "Cerca del 85-90%",
      "Cerca del 10-15%",
      "Cerca del 50%",
      "Casi el 100%"
    ],
    "c": 105,
    "explEn": "Sunni Muslims make up roughly eighty-five to ninety percent of the world's Muslim population, with Shia Muslims concentrated especially in Iran and Iraq.",
    "explEs": "Los musulmanes sunitas constituyen aproximadamente entre el ochenta y cinco y el noventa por ciento de la población musulmana mundial, con musulmanes chiitas concentrados especialmente en Irán e Irak."
  },
  {
    "textEn": "14. Sufism, as described in this unit, is best characterized as:",
    "textEs": "14. El sufismo, según se describe en esta unidad, se caracteriza mejor como:",
    "optionsEn": [
      "A separate religion unrelated to Islam",
      "A mystical current emphasizing experiential closeness to God",
      "The largest Shia political party",
      "A rejection of the Five Pillars"
    ],
    "optionsEs": [
      "Una religión separada sin relación con el islam",
      "Una corriente mística que enfatiza la cercanía experiencial a Dios",
      "El partido político chiita más grande",
      "Un rechazo de los Cinco Pilares"
    ],
    "c": 113,
    "explEn": "Sufism is a mystical current within both Sunni and Shia Islam emphasizing direct, experiential closeness to God through disciplined spiritual practice.",
    "explEs": "El sufismo es una corriente mística dentro tanto del islam sunita como del chiita que enfatiza la cercanía directa y experiencial a Dios a través de la práctica espiritual disciplinada."
  },
  {
    "textEn": "15. According to this unit, the Qur'an affirms which of the following about Jesus (Isa)?",
    "textEs": "15. Según esta unidad, ¿cuál de las siguientes afirma el Corán acerca de Jesús (Isa)?",
    "optionsEn": [
      "He never performed any miracles",
      "He was merely a Roman citizen",
      "He was born of a virgin and performed miracles",
      "He never existed historically"
    ],
    "optionsEs": [
      "Nunca realizó ningún milagro",
      "Era simplemente un ciudadano romano",
      "Nació de una virgen y realizó milagros",
      "Nunca existió históricamente"
    ],
    "c": 121,
    "explEn": "The Qur'an affirms Jesus' virgin birth, calls him the Messiah, and attributes numerous miracles to him, including healing the blind and raising the dead.",
    "explEs": "El Corán afirma el nacimiento virginal de Jesús, lo llama el Mesías, y le atribuye numerosos milagros, incluyendo sanar a los ciegos y resucitar a los muertos."
  },
  {
    "textEn": "16. Regarding the crucifixion, this unit explains that most Muslim interpreters hold that:",
    "textEs": "16. Respecto a la crucifixión, esta unidad explica que la mayoría de los intérpretes musulmanes sostienen que:",
    "optionsEn": [
      "Jesus died on the cross exactly as the Gospels describe",
      "The crucifixion is not mentioned at all in Islamic tradition",
      "Jesus crucified himself voluntarily",
      "Jesus was taken up to heaven and someone else died in his place"
    ],
    "optionsEs": [
      "Jesús murió en la cruz exactamente como describen los Evangelios",
      "La crucifixión no se menciona en absoluto en la tradición islámica",
      "Jesús se crucificó a sí mismo voluntariamente",
      "Jesús fue llevado al cielo y otra persona murió en su lugar"
    ],
    "c": 129,
    "explEn": "Most Muslim interpreters hold that Jesus was taken up to heaven before the crucifixion and that someone else died in his place, meaning Islam denies the crucifixion occurred.",
    "explEs": "La mayoría de los intérpretes musulmanes sostienen que Jesús fue llevado al cielo antes de la crucifixión y que otra persona murió en su lugar, lo que significa que el islam niega que la crucifixión haya ocurrido."
  },
  {
    "textEn": "17. The Arabic term tawhid refers to:",
    "textEs": "17. El término árabe tawhid se refiere a:",
    "optionsEn": [
      "Islam's uncompromising monotheism",
      "The pilgrimage to Mecca",
      "The Islamic legal schools",
      "The Shia doctrine of the Imams"
    ],
    "optionsEs": [
      "El monoteísmo intransigente del islam",
      "La peregrinación a La Meca",
      "Las escuelas legales islámicas",
      "La doctrina chiita de los Imanes"
    ],
    "c": 133,
    "explEn": "Tawhid is Islam's uncompromising monotheism, the doctrine that leads Islam to reject the Trinity as a form of polytheism.",
    "explEs": "El tawhid es el monoteísmo intransigente del islam, la doctrina que lleva al islam a rechazar la Trinidad como una forma de politeísmo."
  },
  {
    "textEn": "18. According to this unit, Islam generally teaches that human beings are born:",
    "textEs": "18. Según esta unidad, el islam generalmente enseña que los seres humanos nacen:",
    "optionsEn": [
      "With a corrupted nature inherited from Adam",
      "In a state of natural submission to God called fitrah",
      "Already condemned regardless of belief",
      "Divine themselves"
    ],
    "optionsEs": [
      "Con una naturaleza corrompida heredada de Adán",
      "En un estado de sumisión natural a Dios llamado fitrah",
      "Ya condenados sin importar la creencia",
      "Divinos ellos mismos"
    ],
    "c": 141,
    "explEn": "Islam generally teaches human beings are born in a state of natural submission to God called fitrah, with sin understood as individual acts rather than inherited corruption.",
    "explEs": "El islam generalmente enseña que los seres humanos nacen en un estado de sumisión natural a Dios llamado fitrah, entendiendo el pecado como actos individuales en lugar de corrupción heredada."
  },
  {
    "textEn": "19. On the Day of Judgment, Islamic teaching holds that a person's eternal destiny is determined largely by:",
    "textEs": "19. En el Día del Juicio, la enseñanza islámica sostiene que el destino eterno de una persona se determina en gran parte por:",
    "optionsEn": [
      "Faith alone, apart from works",
      "Membership in a particular tribe",
      "The weighing of good and bad deeds, tempered by Allah's mercy",
      "A substitutionary sacrifice already accomplished"
    ],
    "optionsEs": [
      "La fe sola, aparte de las obras",
      "La membresía en una tribu particular",
      "El pesaje de las buenas y malas obras, atenuado por la misericordia de Alá",
      "Un sacrificio sustitutorio ya realizado"
    ],
    "c": 149,
    "explEn": "Islamic teaching holds that a person's good and bad deeds will be weighed, with eternal destiny determined largely on that basis, tempered by Allah's mercy but not guaranteed in advance.",
    "explEs": "La enseñanza islámica sostiene que las buenas y malas obras de una persona serán pesadas, determinando el destino eterno en gran parte sobre esa base, atenuado por la misericordia de Alá pero no garantizado de antemano."
  },
  {
    "textEn": "20. According to 1 Timothy 2:5-6, cited in this unit, what does Christianity proclaim that directly answers Islam's view of salvation?",
    "textEs": "20. Según 1 Timoteo 2:5-6, citado en esta unidad, ¿qué proclama el cristianismo que responde directamente a la visión islámica de la salvación?",
    "optionsEn": [
      "Salvation is earned entirely by good deeds",
      "There is no need for any mediator",
      "Allah's mercy is never available",
      "A Mediator who gave Himself as a ransom for all"
    ],
    "optionsEs": [
      "La salvación se gana enteramente por buenas obras",
      "No hay necesidad de ningún mediador",
      "La misericordia de Alá nunca está disponible",
      "Un Mediador que se dio a sí mismo en rescate por todos"
    ],
    "c": 157,
    "explEn": "1 Timothy 2:5-6 proclaims one Mediator, the Man Christ Jesus, who gave Himself as a ransom for all — an atonement actually accomplished, unlike Islam's uncertain weighing of deeds.",
    "explEs": "1 Timoteo 2:5-6 proclama un solo Mediador, Jesucristo hombre, que se dio a sí mismo en rescate por todos — una expiación realmente lograda, a diferencia del incierto pesaje de obras del islam."
  }
];

const kwQuestions = [
  {
    "textEn": "21. Describe Muhammad's trajectory from prophet in Mecca to statesman and military commander in Medina, and explain why this unit says it contrasts with Jesus' earthly ministry.",
    "textEs": "21. Describa la trayectoria de Mahoma de profeta en La Meca a estadista y comandante militar en Medina, y explique por qué esta unidad dice que contrasta con el ministerio terrenal de Jesús.",
    "kw_en": ["mecca", "hijra", "medina", "conquest", "political", "military", "contrast", "authority"],
    "kw_es": ["meca", "hégira", "medina", "conquista", "político", "militar", "contrast", "autoridad"],
    "modelEn": "Muhammad began preaching in Mecca, calling Arab tribes to abandon idols, but faced persecution and migrated to Medina in the Hijra of A.D. 622. There his role expanded to political and military leadership, eventually conquering Mecca and unifying Arabia before his death. This trajectory of prophet to statesman to military commander contrasts with Jesus, whose earthly ministry never involved political rule or military conquest, shaping lasting differences in how each religion has understood the relationship between religious authority and political power.",
    "modelEs": "Mahoma comenzó predicando en La Meca, llamando a las tribus árabes a abandonar los ídolos, pero enfrentó persecución y emigró a Medina en la Hégira del año 622 d.C. Allí su papel se expandió a liderazgo político y militar, eventualmente conquistando La Meca y unificando Arabia antes de su muerte. Esta trayectoria de profeta a estadista a comandante militar contrasta con Jesús, cuyo ministerio terrenal nunca involucró gobierno político ni conquista militar, dando forma a diferencias duraderas en cómo cada religión ha entendido la relación entre autoridad religiosa y poder político."
  },
  {
    "textEn": "22. What does Islam teach about the Torah and the Injil (Gospel), and what implication does this unit say that teaching has for how Muslims regard the Bible today?",
    "textEs": "22. ¿Qué enseña el islam acerca de la Torá y el Inyil (Evangelio), y qué implicación dice esta unidad que tiene esa enseñanza para cómo los musulmanes consideran la Biblia hoy?",
    "kw_en": ["torah", "injil", "corrupt", "alter", "qurान", "revelation", "supersede", "bible"],
    "kw_es": ["torá", "inyil", "corromp", "alter", "corán", "revelación", "sustitu", "biblia"],
    "modelEn": "Islam affirms that the Torah given to Moses and the Injil given to Jesus were originally true revelations from God, but holds they were later corrupted or altered by Jewish and Christian communities, and that the Qur'an supersedes them as the final, unchangeable revelation. This means many Muslims regard the Bible Christians actually possess today with suspicion, believing it does not accurately preserve the original revelation, which is an important point for a pastor to understand before discussing Scripture with a Muslim friend.",
    "modelEs": "El islam afirma que la Torá dada a Moisés y el Inyil dado a Jesús fueron originalmente revelaciones verdaderas de Dios, pero sostiene que luego fueron corrompidas o alteradas por las comunidades judías y cristianas, y que el Corán las sustituye como la revelación final e inmutable. Esto significa que muchos musulmanes consideran la Biblia que los cristianos realmente poseen hoy con sospecha, creyendo que no preserva con precisión la revelación original, lo cual es un punto importante para que un pastor entienda antes de discutir la Escritura con un amigo musulmán."
  },
  {
    "textEn": "23. Name and briefly describe the Five Pillars of Islam.",
    "textEs": "23. Nombre y describa brevemente los Cinco Pilares del Islam.",
    "kw_en": ["shahada", "salat", "zakat", "sawm", "hajj", "prayer", "fasting", "pilgrimage"],
    "kw_es": ["shahada", "salat", "zakat", "sawm", "hach", "oración", "ayuno", "peregrina"],
    "modelEn": "The Five Pillars are: the Shahada, the declaration that there is no god but Allah and Muhammad is his messenger; Salat, ritual prayer performed five times daily facing Mecca; Zakat, obligatory almsgiving of roughly two and a half percent of wealth for the poor; Sawm, fasting during the month of Ramadan from dawn to sunset; and Hajj, the pilgrimage to Mecca required once in a lifetime for those who are able.",
    "modelEs": "Los Cinco Pilares son: la Shahada, la declaración de que no hay más dios que Alá y Mahoma es su mensajero; el Salat, la oración ritual realizada cinco veces al día orientada hacia La Meca; el Zakat, la limosna obligatoria de aproximadamente el dos y medio por ciento de la riqueza para los pobres; el Sawm, el ayuno durante el mes de Ramadán desde el amanecer hasta la puesta del sol; y el Hach, la peregrinación a La Meca requerida una vez en la vida para quienes puedan realizarla."
  },
  {
    "textEn": "24. Explain the origin of the Sunni-Shia division. Was the original dispute about doctrine or something else?",
    "textEs": "24. Explique el origen de la división sunita-chiita. ¿Era la disputa original acerca de doctrina o de otra cosa?",
    "kw_en": ["succession", "caliph", "ali", "muhammad", "leadership", "bloodline", "consensus", "death"],
    "kw_es": ["sucesión", "califa", "ali", "mahoma", "liderazgo", "sangre", "consenso", "muerte"],
    "modelEn": "The Sunni-Shia division arose almost immediately after Muhammad's death in A.D. 632 over a question of leadership succession, not initially doctrine. Sunni Muslims held the caliph should be chosen by community consensus and accepted the first four caliphs as legitimate, while Shia Muslims insisted leadership should have passed by divine right through Muhammad's bloodline through Ali. Centuries of separate development later produced real theological differences as well.",
    "modelEs": "La división sunita-chiita surgió casi inmediatamente después de la muerte de Mahoma en el año 632 d.C. por una cuestión de sucesión de liderazgo, no inicialmente de doctrina. Los musulmanes sunitas sostenían que el califa debía elegirse por consenso comunitario y aceptaron a los primeros cuatro califas como legítimos, mientras que los musulmanes chiitas insistían en que el liderazgo debía haber pasado por derecho divino a través de la línea de sangre de Mahoma mediante Ali. Siglos de desarrollo separado luego produjeron también diferencias teológicas reales."
  },
  {
    "textEn": "25. What role do Imams play in Shia Islam, and how does this differ from Sunni understanding of religious authority after Muhammad?",
    "textEs": "25. ¿Qué papel juegan los Imanes en el islam chiita, y en qué difiere esto del entendimiento sunita de la autoridad religiosa después de Mahoma?",
    "kw_en": ["imam", "shia", "divinely", "appointed", "descended", "sunni", "infallible", "authority"],
    "kw_es": ["imán", "chiita", "divina", "designado", "descend", "sunita", "infalible", "autoridad"],
    "modelEn": "Shia Islam places great emphasis on a line of divinely appointed spiritual leaders called Imams, descended from Ali, understood to hold special religious authority. Sunni Islam does not recognize any comparable ongoing office of infallible religious authority after Muhammad, relying instead on scholarly consensus and the four major schools of Islamic law. This difference reflects the deeper theological development that grew out of the original succession dispute.",
    "modelEs": "El islam chiita otorga gran énfasis a una línea de líderes espirituales divinamente designados llamados Imanes, descendientes de Ali, entendidos como poseedores de autoridad religiosa especial. El islam sunita no reconoce ningún cargo continuo comparable de autoridad religiosa infalible después de Mahoma, dependiendo en cambio del consenso erudito y las cuatro escuelas principales de ley islámica. Esta diferencia refleja el desarrollo teológico más profundo que surgió de la disputa original de sucesión."
  },
  {
    "textEn": "26. What does the Qur'an affirm about Jesus (Isa), and why does this unit call this affirmation genuine common ground for gospel conversation?",
    "textEs": "26. ¿Qué afirma el Corán acerca de Jesús (Isa), y por qué llama esta unidad a esta afirmación terreno común genuino para la conversación evangelística?",
    "kw_en": ["isa", "virgin", "birth", "messiah", "miracle", "heal", "raise", "return"],
    "kw_es": ["isa", "virgen", "nacimiento", "mesías", "milagro", "san", "resucit", "regres"],
    "modelEn": "The Qur'an affirms Jesus' virgin birth, calls him the Messiah, attributes numerous miracles to him including healing the blind and raising the dead, and anticipates his return at the end of the age. This unit calls this genuine common ground because a pastor can begin gospel conversation from convictions a Muslim neighbor already holds about Jesus, rather than starting from nothing, even though the traditions diverge sharply on his deity and death.",
    "modelEs": "El Corán afirma el nacimiento virginal de Jesús, lo llama el Mesías, le atribuye numerosos milagros incluyendo sanar a los ciegos y resucitar a los muertos, y anticipa su regreso al final de los tiempos. Esta unidad llama a esto terreno común genuino porque un pastor puede comenzar la conversación evangelística desde convicciones que un vecino musulmán ya sostiene acerca de Jesús, en lugar de partir de la nada, aunque las tradiciones divergen agudamente en cuanto a su deidad y su muerte."
  },
  {
    "textEn": "27. Explain what Islam teaches about the crucifixion of Jesus, and why this unit says the difference is not a minor one.",
    "textEs": "27. Explique lo que el islam enseña acerca de la crucifixión de Jesús, y por qué dice esta unidad que la diferencia no es menor.",
    "kw_en": ["deny", "cross", "taken up", "resemble", "atonement", "denies", "death", "substitute"],
    "kw_es": ["nieg", "cruz", "llevado", "parecer", "expiación", "niega", "muerte", "sustitu"],
    "modelEn": "Islam denies that Jesus died on the cross at all; most Muslim interpreters hold he was taken up to heaven before the crucifixion and that someone else, made to resemble him, died in his place. This unit says the difference is not minor because it means Islam has no doctrine of atonement through Christ's death, since it denies the death occurred, striking at the very heart of the gospel rather than being a peripheral disagreement.",
    "modelEs": "El islam niega que Jesús muriera en la cruz en absoluto; la mayoría de los intérpretes musulmanes sostienen que fue llevado al cielo antes de la crucifixión y que alguien más, hecho para parecerse a él, murió en su lugar. Esta unidad dice que la diferencia no es menor porque significa que el islam no tiene doctrina de expiación a través de la muerte de Cristo, ya que niega que la muerte haya ocurrido, llegando al corazón mismo del evangelio en lugar de ser un desacuerdo periférico."
  },
  {
    "textEn": "28. Contrast the Christian and Islamic understanding of sin and its remedy, referencing fitrah and Ephesians 2:8-9.",
    "textEs": "28. Contraste el entendimiento cristiano e islámico del pecado y su remedio, haciendo referencia al fitrah y a Efesios 2:8-9.",
    "kw_en": ["fitrah", "submission", "corrupt", "nature", "grace", "faith", "works", "boast"],
    "kw_es": ["fitrah", "sumisión", "corromp", "naturaleza", "gracia", "fe", "obras", "gloríe"],
    "modelEn": "Christianity teaches sin is a corruption of human nature inherited from Adam, requiring a substitutionary atonement only God could provide. Islam generally teaches humans are born in a state of natural submission called fitrah, and sin is individual acts of disobedience addressed through repentance, good works, and Allah's mercy rather than a substitutionary sacrifice. Ephesians 2:8-9 states salvation is by grace through faith, not of works, lest anyone should boast, directly contrasting with Islam's weighing of deeds.",
    "modelEs": "El cristianismo enseña que el pecado es una corrupción de la naturaleza humana heredada de Adán, que requiere una expiación sustitutoria que solo Dios podía proveer. El islam generalmente enseña que los humanos nacen en un estado de sumisión natural llamado fitrah, y el pecado son actos individuales de desobediencia abordados a través del arrepentimiento, las buenas obras y la misericordia de Alá en lugar de un sacrificio sustitutorio. Efesios 2:8-9 declara que la salvación es por gracia mediante la fe, no por obras, para que nadie se gloríe, contrastando directamente con el pesaje de obras del islam."
  },
  {
    "textEn": "29. How does this unit say a pastor should begin a gospel conversation with a Muslim neighbor, following the pattern established with Paul at the Areopagus?",
    "textEs": "29. ¿Cómo dice esta unidad que un pastor debe comenzar una conversación evangelística con un vecino musulmán, siguiendo el patrón establecido con Pablo en el Areópago?",
    "kw_en": ["common ground", "creator", "scripture", "morality", "respect", "honor", "confrontation", "areopagus"],
    "kw_es": ["terreno común", "creador", "escritura", "moralidad", "respet", "honr", "confrontación", "areópago"],
    "modelEn": "Following Paul's pattern at the Areopagus, a pastor should begin from real common ground rather than immediate confrontation: shared belief in one Creator God, a high view of Scripture, serious concern for personal morality, respect for prayer and fasting, and genuine reverence for Jesus. Honoring these shared convictions first, as Paul honored Athenian religiosity before correcting it, makes Muslim neighbors far more willing to continue the conversation than an opening confrontation would.",
    "modelEs": "Siguiendo el patrón de Pablo en el Areópago, un pastor debe comenzar desde un terreno común real en lugar de la confrontación inmediata: la creencia compartida en un Dios Creador, una alta consideración de la Escritura, preocupación seria por la moralidad personal, respeto por la oración y el ayuno, y reverencia genuina por Jesús. Honrar primero estas convicciones compartidas, como Pablo honró la religiosidad ateniense antes de corregirla, hace que los vecinos musulmanes estén mucho más dispuestos a continuar la conversación que una confrontación de apertura."
  },
  {
    "textEn": "30. Synthesize this unit: using 1 Timothy 2:5-6, explain what the gospel offers that Islam cannot, and how a pastor should present this truth practically.",
    "textEs": "30. Sintetice esta unidad: usando 1 Timoteo 2:5-6, explique qué ofrece el evangelio que el islam no puede, y cómo debe un pastor presentar esta verdad en la práctica.",
    "kw_en": ["mediator", "ransom", "accomplished", "one god", "historical", "evidence", "crucifixion", "friendship"],
    "kw_es": ["mediador", "rescate", "logrado", "un dios", "histórica", "evidencia", "crucifixión", "amistad"],
    "modelEn": "1 Timothy 2:5-6 proclaims one Mediator, the Man Christ Jesus, who gave Himself a ransom for all, affirming the one God Islam insists on while proclaiming what Islam denies: an atonement actually accomplished rather than a judgment pending on uncertain mercy. Practically, a pastor should discuss honestly the historical evidence for the crucifixion, the reliability of the New Testament text, and what the Qur'an itself says about Jesus, all within a context of genuine friendship, patient listening, and hospitality rather than confrontation alone.",
    "modelEs": "1 Timoteo 2:5-6 proclama un solo Mediador, Jesucristo hombre, que se dio a sí mismo en rescate por todos, afirmando el único Dios en el que insiste el islam mientras proclama lo que el islam niega: una expiación realmente lograda en lugar de un juicio pendiente sobre una misericordia incierta. En la práctica, un pastor debe discutir honestamente la evidencia histórica de la crucifixión, la fiabilidad del texto del Nuevo Testamento, y lo que el Corán mismo dice acerca de Jesús, todo dentro de un contexto de amistad genuina, escucha paciente y hospitalidad en lugar de confrontación sola."
  }
];

const PREV_HREF = 'CTSWRUnit2.html';

const NEXT_HREF = 'CTSWRUnit4.html';
