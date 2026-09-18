/* CTSPM - unit 7: per-unit configuration and content. */

const UNIT = 7;

let currentUnit = 7;

const mcQuestions = [
  {
    "textEn": "1. The pastor's most lasting ministry, according to this unit, is:",
    "textEs": "1. El ministerio más duradero del pastor, según esta unidad, es:",
    "optionsEn": [
      "The pulpit",
      "The wedding",
      "The funeral",
      "Discipleship"
    ],
    "optionsEs": [
      "El púlpito",
      "La boda",
      "El funeral",
      "El discipulado"
    ],
    "c": 24,
    "explEn": "The pastor's most lasting ministry is discipleship — multiplying himself into others.",
    "explEs": "El ministerio más duradero del pastor es el discipulado — multiplicarse en otros."
  },
  {
    "textEn": "2. Ephesians 4:11 likely describes pastor and teacher as:",
    "textEs": "2. Efesios 4:11 probablemente describe pastor y maestro como:",
    "optionsEn": [
      "One combined office — the pastor-teacher",
      "Two completely separate offices",
      "The same as evangelist",
      "An optional gift"
    ],
    "optionsEs": [
      "Un oficio combinado — el pastor-maestro",
      "Dos oficios completamente separados",
      "Lo mismo que evangelista",
      "Un don opcional"
    ],
    "c": 28,
    "explEn": "Ephesians 4:11 likely describes one combined office — the pastor-teacher.",
    "explEs": "Efesios 4:11 probablemente describe un oficio combinado — el pastor-maestro."
  },
  {
    "textEn": "3. The purpose of pastors and teachers, per Ephesians 4:12, is:",
    "textEs": "3. El propósito de pastores y maestros, según Efesios 4:12, es:",
    "optionsEn": [
      "To do all the ministry themselves",
      "To replace the saints",
      "To equip the saints for the work of ministry",
      "To run programs"
    ],
    "optionsEs": [
      "Hacer todo el ministerio ellos mismos",
      "Reemplazar a los santos",
      "Equipar a los santos para la obra del ministerio",
      "Dirigir programas"
    ],
    "c": 37,
    "explEn": "The purpose of pastors and teachers is to equip the saints for the work of ministry.",
    "explEs": "El propósito de pastores y maestros es equipar a los santos para la obra del ministerio."
  },
  {
    "textEn": "4. The professor served as a seminary professor for approximately:",
    "textEs": "4. El profesor sirvió como profesor de seminario por aproximadamente:",
    "optionsEn": [
      "Eleven years",
      "Five years",
      "Twenty years",
      "Three years"
    ],
    "optionsEs": [
      "Once años",
      "Cinco años",
      "Veinte años",
      "Tres años"
    ],
    "c": 42,
    "explEn": "The professor served as a seminary professor for approximately eleven years.",
    "explEs": "El profesor sirvió como profesor de seminario por aproximadamente once años."
  },
  {
    "textEn": "5. The Great Commission's third movement, often neglected, is:",
    "textEs": "5. El tercer movimiento de la Gran Comisión, a menudo descuidado, es:",
    "optionsEn": [
      "Going",
      "Teaching them to observe all things Christ commanded",
      "Baptizing",
      "Praying"
    ],
    "optionsEs": [
      "Ir",
      "Enseñándoles a guardar todas las cosas que Cristo mandó",
      "Bautizar",
      "Orar"
    ],
    "c": 50,
    "explEn": "The neglected third movement of the Great Commission is teaching them to observe all Christ commanded.",
    "explEs": "El tercer movimiento descuidado de la Gran Comisión es enseñarles a guardar todo lo que Cristo mandó."
  },
  {
    "textEn": "6. 2 Timothy 2:2 describes how many generations of teaching?",
    "textEs": "6. 2 Timoteo 2:2 describe ¿cuántas generaciones de enseñanza?",
    "optionsEn": [
      "One",
      "Two",
      "Three",
      "Four"
    ],
    "optionsEs": [
      "Una",
      "Dos",
      "Tres",
      "Cuatro"
    ],
    "c": 59,
    "explEn": "2 Timothy 2:2 describes four generations of teaching.",
    "explEs": "2 Timoteo 2:2 describe cuatro generaciones de enseñanza."
  },
  {
    "textEn": "7. In 2 Timothy 2:2, the four generations are:",
    "textEs": "7. En 2 Timoteo 2:2, las cuatro generaciones son:",
    "optionsEn": [
      "Paul, Peter, Timothy, Titus",
      "Christ, Paul, Timothy, others",
      "Paul, Timothy, faithful men, others also",
      "Father, Son, Spirit, church"
    ],
    "optionsEs": [
      "Pablo, Pedro, Timoteo, Tito",
      "Cristo, Pablo, Timoteo, otros",
      "Pablo, Timoteo, hombres fieles, otros también",
      "Padre, Hijo, Espíritu, iglesia"
    ],
    "c": 65,
    "explEn": "The four generations are Paul, Timothy, faithful men, and others also.",
    "explEs": "Las cuatro generaciones son Pablo, Timoteo, hombres fieles y también otros."
  },
  {
    "textEn": "8. The four elements of the Paul-Timothy relationship include all EXCEPT:",
    "textEs": "8. Los cuatro elementos de la relación Pablo-Timoteo incluyen todos EXCEPTO:",
    "optionsEn": [
      "Time together",
      "Financial support contracts",
      "Honest correction",
      "Spiritual succession"
    ],
    "optionsEs": [
      "Tiempo juntos",
      "Contratos de apoyo financiero",
      "Corrección honesta",
      "Sucesión espiritual"
    ],
    "c": 71,
    "explEn": "Financial support contracts is NOT one of the four Paul-Timothy mentoring elements.",
    "explEs": "Los contratos de apoyo financiero NO son uno de los cuatro elementos de mentoría de Pablo-Timoteo."
  },
  {
    "textEn": "9. The four levels at which a pastor teaches are:",
    "textEs": "9. Los cuatro niveles en los cuales un pastor enseña son:",
    "optionsEn": [
      "Pulpit, Bible study/Sunday school, small group, one-on-one",
      "Sermon, prayer, fasting, fellowship",
      "Preaching, evangelism, missions, prayer",
      "Sunday morning, Sunday evening, Wednesday, Saturday"
    ],
    "optionsEs": [
      "Púlpito, estudio bíblico/escuela dominical, grupo pequeño, uno a uno",
      "Sermón, oración, ayuno, comunión",
      "Predicación, evangelismo, misiones, oración",
      "Domingo en la mañana, domingo en la tarde, miércoles, sábado"
    ],
    "c": 77,
    "explEn": "The four teaching levels are pulpit, Bible study, small group, and one-on-one.",
    "explEs": "Los cuatro niveles de enseñanza son púlpito, estudio bíblico, grupo pequeño e individual."
  },
  {
    "textEn": "10. The deepest level of pastoral teaching is:",
    "textEs": "10. El nivel más profundo de enseñanza pastoral es:",
    "optionsEn": [
      "The pulpit",
      "The Sunday school class",
      "The one-on-one conversation",
      "The small group"
    ],
    "optionsEs": [
      "El púlpito",
      "La clase de escuela dominical",
      "La conversación uno a uno",
      "El grupo pequeño"
    ],
    "c": 86,
    "explEn": "The deepest level of pastoral teaching is the one-on-one conversation.",
    "explEs": "El nivel más profundo de enseñanza pastoral es la conversación individual."
  },
  {
    "textEn": "11. The pastor uses 1 Timothy 3 / Titus 1 qualifications best as:",
    "textEs": "11. El pastor usa las calificaciones de 1 Timoteo 3 / Tito 1 mejor como:",
    "optionsEn": [
      "A hiring checklist only",
      "Optional guidelines",
      "A historical curiosity",
      "A curriculum for forming the next generation of leaders"
    ],
    "optionsEs": [
      "Solo una lista de verificación para contratar",
      "Pautas opcionales",
      "Una curiosidad histórica",
      "Un currículum para formar la próxima generación de líderes"
    ],
    "c": 94,
    "explEn": "The elder qualifications work best as a curriculum for forming the next generation of leaders.",
    "explEs": "Las cualificaciones del anciano sirven mejor como currículo para formar la próxima generación de líderes."
  },
  {
    "textEn": "12. Arthur, the inmate the professor knew, became:",
    "textEs": "12. Arthur, el recluso que el profesor conoció, se convirtió en:",
    "optionsEn": [
      "A pastor in Texas",
      "Head chaplain at Parchman Prison in Mississippi",
      "A theologian in California",
      "A missionary to Africa"
    ],
    "optionsEs": [
      "Un pastor en Texas",
      "Capellán principal en la Prisión de Parchman en Mississippi",
      "Un teólogo en California",
      "Un misionero a África"
    ],
    "c": 99,
    "explEn": "Arthur became head chaplain at Parchman Prison in Mississippi.",
    "explEs": "Arthur llegó a ser capellán principal de la prisión de Parchman en Misisipi."
  },
  {
    "textEn": "13. Arthur came to Christ:",
    "textEs": "13. Arthur vino a Cristo:",
    "optionsEn": [
      "Inside Angola Prison after considering taking his life",
      "At a youth camp",
      "Through his family",
      "After his release"
    ],
    "optionsEs": [
      "Dentro de la Prisión de Angola después de considerar quitarse la vida",
      "En un campamento juvenil",
      "A través de su familia",
      "Después de su liberación"
    ],
    "c": 105,
    "explEn": "Arthur came to Christ inside Angola Prison after considering taking his life.",
    "explEs": "Arthur vino a Cristo dentro de la prisión de Angola tras considerar quitarse la vida."
  },
  {
    "textEn": "14. The pastor who only thinks one Sunday at a time will likely:",
    "textEs": "14. El pastor que solo piensa en un domingo a la vez probablemente:",
    "optionsEn": [
      "Build the strongest church",
      "Earn the most respect",
      "Burn out by his fifth year",
      "Stay productive for life"
    ],
    "optionsEs": [
      "Edificará la iglesia más fuerte",
      "Ganará el mayor respeto",
      "Se quemará para su quinto año",
      "Permanecerá productivo de por vida"
    ],
    "c": 114,
    "explEn": "The pastor who only thinks one Sunday at a time will likely burn out by his fifth year.",
    "explEs": "El pastor que solo piensa un domingo a la vez probablemente se agotará para su quinto año."
  },
  {
    "textEn": "15. 1 Corinthians 3:6 teaches that:",
    "textEs": "15. 1 Corintios 3:6 enseña que:",
    "optionsEn": [
      "The pastor sees all the harvest",
      "Paul plants, Apollos waters, but God gives the increase",
      "Only the gifted disciple",
      "The pastor must labor alone"
    ],
    "optionsEs": [
      "El pastor ve toda la cosecha",
      "Pablo planta, Apolos riega, pero Dios da el crecimiento",
      "Solo los talentosos discipulan",
      "El pastor debe trabajar solo"
    ],
    "c": 120,
    "explEn": "1 Corinthians 3:6 teaches Paul plants, Apollos waters, but God gives the increase.",
    "explEs": "1 Corintios 3:6 enseña que Pablo planta, Apolos riega, pero Dios da el crecimiento."
  },
  {
    "textEn": "16. A pastor who has stopped learning will, by his fifteenth year:",
    "textEs": "16. Un pastor que ha dejado de aprender, para su decimoquinto año:",
    "optionsEn": [
      "Have his deepest ministry",
      "Be at peak power",
      "Have grown wiser",
      "Be repeating himself with shallow teaching"
    ],
    "optionsEs": [
      "Tendrá su ministerio más profundo",
      "Estará en el pico de su poder",
      "Habrá crecido más sabio",
      "Se estará repitiendo con enseñanza superficial"
    ],
    "c": 129,
    "explEn": "A pastor who stops learning will, by his fifteenth year, be repeating himself with shallow teaching.",
    "explEs": "Un pastor que deja de aprender, para su decimoquinto año, se repetirá con enseñanza superficial."
  },
  {
    "textEn": "17. John Drakeford, whose counseling methodology the professor incorporates, taught at:",
    "textEs": "17. John Drakeford, cuya metodología de consejería incorpora el profesor, enseñó en:",
    "optionsEn": [
      "Dallas Theological Seminary",
      "Southwestern Baptist Theological Seminary",
      "Princeton Seminary",
      "Fuller Seminary"
    ],
    "optionsEs": [
      "Seminario Teológico de Dallas",
      "Seminario Teológico Bautista del Suroeste",
      "Seminario de Princeton",
      "Seminario Fuller"
    ],
    "c": 134,
    "explEn": "John Drakeford taught at Southwestern Baptist Theological Seminary.",
    "explEs": "John Drakeford enseñó en el Seminario Teológico Bautista del Suroeste."
  },
  {
    "textEn": "18. John Drakeford himself studied under:",
    "textEs": "18. El propio John Drakeford estudió bajo:",
    "optionsEn": [
      "Carl Rogers",
      "B. F. Skinner",
      "O. Hobart Mowrer",
      "Paul Tournier"
    ],
    "optionsEs": [
      "Carl Rogers",
      "B. F. Skinner",
      "O. Hobart Mowrer",
      "Paul Tournier"
    ],
    "c": 142,
    "explEn": "John Drakeford himself studied under O. Hobart Mowrer.",
    "explEs": "John Drakeford mismo estudió bajo O. Hobart Mowrer."
  },
  {
    "textEn": "19. The Mowrer → Drakeford → Wayne → next generation chain illustrates:",
    "textEs": "19. La cadena Mowrer → Drakeford → Wayne → próxima generación ilustra:",
    "optionsEn": [
      "2 Timothy 2:2 lived out across academic generations",
      "The danger of secular psychology",
      "The need for credentials",
      "Modern pastoral fads"
    ],
    "optionsEs": [
      "2 Timoteo 2:2 vivido a través de generaciones académicas",
      "El peligro de la psicología secular",
      "La necesidad de credenciales",
      "Modas pastorales modernas"
    ],
    "c": 147,
    "explEn": "The Mowrer-Drakeford-Wayne chain illustrates 2 Timothy 2:2 lived out across generations.",
    "explEs": "La cadena Mowrer-Drakeford-Wayne ilustra 2 Timoteo 2:2 vivido a través de generaciones."
  },
  {
    "textEn": "20. The faithful pastor's voice, after his pulpit ministry ends, continues:",
    "textEs": "20. La voz del pastor fiel, después de que termina su ministerio del púlpito, continúa:",
    "optionsEn": [
      "Only in recordings",
      "Only in his books",
      "Only in memory",
      "Through every disciple he ever poured his life into"
    ],
    "optionsEs": [
      "Solo en grabaciones",
      "Solo en sus libros",
      "Solo en la memoria",
      "A través de cada discípulo en quien jamás derramó su vida"
    ],
    "c": 157,
    "explEn": "The faithful pastor's voice continues through every disciple he ever poured his life into.",
    "explEs": "La voz del pastor fiel continúa a través de cada discípulo en quien derramó su vida."
  }
];

const kwQuestions = [
  {
    "textEn": "21. Explain why the pastor's primary job, per Ephesians 4:11-12, is to equip the saints rather than to do all the ministry himself. Apply this to a typical local church.",
    "textEs": "21. Explique por qué el trabajo principal del pastor, según Efesios 4:11-12, es equipar a los santos en lugar de hacer todo el ministerio él mismo. Aplique esto a una iglesia local típica.",
    "kw_en": [
      "equip",
      "ephesians",
      "saint",
      "ministry",
      "multiply",
      "delegate",
      "body",
      "pastor"
    ],
    "kw_es": [
      "equip",
      "efesios",
      "santo",
      "ministerio",
      "multiplic",
      "delegar",
      "cuerpo",
      "pastor"
    ],
    "modelEn": "Ephesians 4:11-12 says the pastor's primary job is to equip the saints for the work of ministry, not to do all the ministry himself. The pastor is not the only minister in the church; he is the equipper of ministers, the one who trains and releases the body to serve. Applied to a typical local church, this means the pastor who tries to do every visit, every class, every counseling session, and every program himself produces a dependent congregation and an exhausted shepherd. The biblical model is multiplication: the pastor equips others, delegates real ministry to them, and watches the body grow as every member shares the work. A church where only the pastor ministers is sub-biblical; a church where the saints are equipped to minister is the New Testament pattern. The measure of success is not how much the pastor does but how many he has raised up.",
    "modelEs": "Efesios 4:11-12 dice que el trabajo principal del pastor es equipar a los santos para la obra del ministerio, no hacer todo el ministerio él mismo. El pastor no es el único ministro en la iglesia; es el equipador de ministros, el que entrena y libera al cuerpo para servir. Aplicado a una iglesia local típica, esto significa que el pastor que intenta hacer cada visita, cada clase, cada sesión de consejería y cada programa él mismo produce una congregación dependiente y un pastor agotado. El modelo bíblico es la multiplicación: el pastor equipa a otros, delega ministerio real en ellos, y ve crecer al cuerpo mientras cada miembro comparte la obra. Una iglesia donde solo el pastor ministra es subbíblica; una iglesia donde los santos son equipados para ministrar es el patrón del Nuevo Testamento. La medida del éxito no es cuánto hace el pastor sino a cuántos ha levantado."
  },
  {
    "textEn": "22. Discuss why most churches stop short at the third movement of the Great Commission ('teaching them to observe all things'). What is lost when discipleship is neglected?",
    "textEs": "22. Discuta por qué la mayoría de las iglesias se queda corta en el tercer movimiento de la Gran Comisión ('enseñándoles que guarden todas las cosas'). ¿Qué se pierde cuando se descuida el discipulado?",
    "kw_en": [
      "commission",
      "teach",
      "observe",
      "disciple",
      "convert",
      "neglect",
      "depth",
      "obey"
    ],
    "kw_es": [
      "comisión",
      "enseñar",
      "guardar",
      "discípulo",
      "convertir",
      "descuid",
      "profundidad",
      "obedecer"
    ],
    "modelEn": "Most churches stop short at the third movement of the Great Commission — 'teaching them to observe all things I have commanded you.' They evangelize (go) and they baptize, but they neglect the long, slow work of teaching new believers to actually obey everything Christ taught. When discipleship is neglected, the church fills with converts who never mature, baptized believers who remain spiritual infants, knowing the gospel's entry point but never its depths. The result is a wide but shallow church, full of decisions but empty of disciples. Jesus did not commission us to make converts but disciples — and a disciple is one taught to observe, not merely to believe. The pastor who skips the third movement builds a nursery that never grows up; the pastor who embraces it builds mature saints who can in turn teach others.",
    "modelEs": "La mayoría de las iglesias se quedan cortas en el tercer movimiento de la Gran Comisión — 'enseñándoles que guarden todas las cosas que os he mandado.' Evangelizan (id) y bautizan, pero descuidan la obra larga y lenta de enseñar a los nuevos creyentes a obedecer realmente todo lo que Cristo enseñó. Cuando se descuida el discipulado, la iglesia se llena de convertidos que nunca maduran, creyentes bautizados que permanecen como infantes espirituales, conociendo el punto de entrada del evangelio pero nunca sus profundidades. El resultado es una iglesia ancha pero superficial, llena de decisiones pero vacía de discípulos. Jesús no nos comisionó a hacer convertidos sino discípulos — y un discípulo es uno enseñado a guardar, no meramente a creer. El pastor que se salta el tercer movimiento construye una guardería que nunca crece; el pastor que lo abraza construye santos maduros que a su vez pueden enseñar a otros."
  },
  {
    "textEn": "23. Outline the four generations described in 2 Timothy 2:2. Why is this verse the foundational text for Christian disciple-making across centuries?",
    "textEs": "23. Bosqueje las cuatro generaciones descritas en 2 Timoteo 2:2. ¿Por qué es este versículo el texto fundacional para hacer discípulos cristianos a través de los siglos?",
    "kw_en": [
      "timothy",
      "generation",
      "paul",
      "faithful",
      "others",
      "entrust",
      "teach",
      "chain"
    ],
    "kw_es": [
      "timoteo",
      "generación",
      "pablo",
      "fieles",
      "otros",
      "encargar",
      "enseñar",
      "cadena"
    ],
    "modelEn": "2 Timothy 2:2 describes four generations of teaching in a single verse: 'the things you have heard from me (Paul), commit these to faithful men (Timothy), who will be able to teach others also.' That is Paul to Timothy to faithful men to others also — four links in a chain. This verse is the foundational text for Christian disciple-making across centuries because it shows the gospel advancing not by programs but by faithful men entrusting truth to faithful men, generation after generation. Paul did not tell Timothy to reach the masses but to invest deeply in reliable people who would carry it on. The genius of the verse is its built-in multiplication: each generation is responsible to reach the next, so that the chain never depends on one star teacher but on faithful transmission. This is how the faith has survived two thousand years.",
    "modelEs": "2 Timoteo 2:2 describe cuatro generaciones de enseñanza en un solo versículo: 'lo que has oído de mí (Pablo), esto encarga a hombres fieles (Timoteo), que sean idóneos para enseñar también a otros.' Eso es Pablo a Timoteo a hombres fieles a otros también — cuatro eslabones en una cadena. Este versículo es el texto fundamental para el hacer discípulos cristianos a través de los siglos porque muestra el evangelio avanzando no por programas sino por hombres fieles encargando la verdad a hombres fieles, generación tras generación. Pablo no le dijo a Timoteo que alcanzara a las masas sino que invirtiera profundamente en personas confiables que lo llevarían adelante. El genio del versículo es su multiplicación incorporada: cada generación es responsable de alcanzar la siguiente, de modo que la cadena nunca depende de un maestro estrella sino de la transmisión fiel. Así ha sobrevivido la fe dos mil años."
  },
  {
    "textEn": "24. Identify the four elements of the Paul-Timothy mentoring pattern (time, shared ministry, correction, succession). How does each translate to modern pastoral practice?",
    "textEs": "24. Identifique los cuatro elementos del patrón de mentoría Pablo-Timoteo (tiempo, ministerio compartido, corrección, sucesión). ¿Cómo se traduce cada uno a la práctica pastoral moderna?",
    "kw_en": [
      "time",
      "ministry",
      "correct",
      "succession",
      "mentor",
      "shared",
      "invest",
      "model"
    ],
    "kw_es": [
      "tiempo",
      "ministerio",
      "corregir",
      "sucesión",
      "mentor",
      "compartido",
      "invertir",
      "modelo"
    ],
    "modelEn": "The Paul-Timothy mentoring pattern had four elements. First, time — Paul spent years with Timothy, not a weekend seminar, because disciples are made slowly. Second, shared ministry — Timothy traveled with Paul, watched him work, and did ministry alongside him, learning by doing rather than only by lecture. Third, correction — Paul corrected Timothy honestly, urging him to fan his gift into flame and not to be timid, because a mentor who never corrects does not truly disciple. Fourth, succession — Paul aimed at Timothy carrying on after he was gone, so that the ministry would outlive the mentor. Translated to modern pastoral practice, this means a pastor who disciples will give a few men real time, bring them into ministry beside him, speak hard truth to them in love, and aim from the start at releasing them to lead. Mentoring is not a class; it is a shared life with a goal.",
    "modelEs": "El patrón de mentoría de Pablo y Timoteo tuvo cuatro elementos. Primero, tiempo — Pablo pasó años con Timoteo, no un seminario de fin de semana, porque los discípulos se hacen lentamente. Segundo, ministerio compartido — Timoteo viajó con Pablo, lo vio trabajar e hizo ministerio junto a él, aprendiendo haciendo en vez de solo por conferencia. Tercero, corrección — Pablo corrigió a Timoteo honestamente, instándolo a avivar su don y a no ser tímido, porque un mentor que nunca corrige no discipula de verdad. Cuarto, sucesión — Pablo apuntó a que Timoteo continuara después de que él se fuera, para que el ministerio sobreviviera al mentor. Traducido a la práctica pastoral moderna, esto significa que un pastor que discipula dará a unos pocos hombres tiempo real, los traerá al ministerio junto a él, les hablará verdad dura en amor, y apuntará desde el inicio a liberarlos para dirigir. La mentoría no es una clase; es una vida compartida con una meta."
  },
  {
    "textEn": "25. Outline the four levels at which a pastor teaches. Which level is most easily neglected, and why?",
    "textEs": "25. Bosqueje los cuatro niveles en los cuales un pastor enseña. ¿Cuál nivel es más fácilmente descuidado, y por qué?",
    "kw_en": [
      "pulpit",
      "study",
      "group",
      "one-on-one",
      "level",
      "personal",
      "neglect",
      "teach"
    ],
    "kw_es": [
      "púlpito",
      "estudio",
      "grupo",
      "individual",
      "nivel",
      "personal",
      "descuid",
      "enseñar"
    ],
    "modelEn": "A pastor teaches at four levels. The first is the pulpit — the Sunday sermon to the whole congregation. The second is the Bible study or Sunday school — a smaller, more interactive setting. The third is the small group — fewer people, deeper conversation, real relationship. The fourth and deepest is the one-on-one conversation, where a man's life is actually shaped face to face. The most easily neglected is the one-on-one, because it does not scale, produces no visible crowd, and demands the pastor's personal time. Yet it is precisely here that disciples are truly made, as Jesus made the Twelve and Paul made Timothy. Pulpit ministry reaches many shallowly; one-on-one reaches few deeply. The pastor who only preaches will inform a crowd but disciple no one; the pastor who also invests personally will raise up leaders.",
    "modelEs": "Un pastor enseña en cuatro niveles. El primero es el púlpito — el sermón dominical a toda la congregación. El segundo es el estudio bíblico o la escuela dominical — un entorno más pequeño y más interactivo. El tercero es el grupo pequeño — menos personas, conversación más profunda, relación real. El cuarto y más profundo es la conversación individual, donde la vida de un hombre realmente se forma cara a cara. El más fácilmente descuidado es el individual, porque no escala, no produce multitud visible y exige el tiempo personal del pastor. Sin embargo es precisamente aquí donde los discípulos se hacen de verdad, como Jesús hizo a los Doce y Pablo hizo a Timoteo. El ministerio del púlpito alcanza a muchos superficialmente; el individual alcanza a pocos profundamente. El pastor que solo predica informará a una multitud pero no discipulará a nadie; el pastor que también invierte personalmente levantará líderes."
  },
  {
    "textEn": "26. Apply Arthur's transformation from Angola inmate to Parchman head chaplain as a case study in disciple-making. What does this teach about who can become a leader?",
    "textEs": "26. Aplique la transformación de Arthur de recluso de Angola a capellán principal de Parchman como un caso de estudio en hacer discípulos. ¿Qué enseña esto sobre quién puede llegar a ser un líder?",
    "kw_en": [
      "arthur",
      "inmate",
      "transform",
      "leader",
      "angola",
      "chaplain",
      "grace",
      "anyone"
    ],
    "kw_es": [
      "arthur",
      "recluso",
      "transform",
      "líder",
      "angola",
      "capellán",
      "gracia",
      "cualquiera"
    ],
    "modelEn": "Arthur came to Christ inside Angola Prison after considering taking his own life, and was so transformed that he eventually became head chaplain at Parchman Prison in Mississippi. His story is a case study in disciple-making that teaches who can become a leader: not the polished and credentialed only, but anyone in whom the grace of God is at work. Arthur was an inmate — by the world's reckoning a write-off — yet God took him, others discipled him, and he became a shepherd of other prisoners. This teaches the pastor never to despise the raw material God brings him, because the next leader may be the most unlikely person in the room. Disciple-making believes that grace can transform anyone into a faithful man able to teach others, even a man the world has thrown away. The pastor looks at people the way God does, seeing not only what they are but what grace can make them.",
    "modelEs": "Arthur vino a Cristo dentro de la prisión de Angola tras considerar quitarse la vida, y fue tan transformado que con el tiempo llegó a ser capellán principal de la prisión de Parchman en Misisipi. Su historia es un caso de estudio en el hacer discípulos que enseña quién puede llegar a ser líder: no solo los pulidos y acreditados, sino cualquiera en quien la gracia de Dios está obrando. Arthur era un recluso — según el cálculo del mundo un caso perdido — sin embargo Dios lo tomó, otros lo discipularon, y llegó a ser pastor de otros prisioneros. Esto enseña al pastor a nunca despreciar la materia prima que Dios le trae, porque el próximo líder puede ser la persona más inverosímil del salón. El hacer discípulos cree que la gracia puede transformar a cualquiera en un hombre fiel capaz de enseñar a otros, aun a un hombre que el mundo ha desechado. El pastor mira a la gente como lo hace Dios, viendo no solo lo que son sino lo que la gracia puede hacerlos."
  },
  {
    "textEn": "27. Defend the discipline of thinking in generations rather than weeks. How does the long view change the way a pastor handles slow growth in his disciples?",
    "textEs": "27. Defienda la disciplina de pensar en generaciones en lugar de semanas. ¿Cómo cambia la visión a largo plazo la manera en que un pastor maneja el crecimiento lento en sus discípulos?",
    "kw_en": [
      "generation",
      "long",
      "slow",
      "patient",
      "plant",
      "grow",
      "view",
      "fruit"
    ],
    "kw_es": [
      "generación",
      "largo",
      "lento",
      "paciente",
      "plantar",
      "crecer",
      "visión",
      "fruto"
    ],
    "modelEn": "The discipline of thinking in generations rather than weeks changes the way a pastor handles slow growth in his disciples. 1 Corinthians 3:6 teaches that Paul plants, Apollos waters, but God gives the increase — growth is God's work on God's timetable, not the pastor's. A man who thinks only one Sunday at a time will burn out by his fifth year, frustrated by people who change slowly; but the man who thinks in generations is patient, knowing he may not see the fruit of his discipling for decades. He plants seeds in a young believer that will bear fruit in that believer's children and disciples long after the pastor is gone. The long view frees him from demanding instant maturity and lets him invest faithfully in slow soil. He measures his ministry not by this year's visible results but by the chain of faithful men stretching into a future he will never see.",
    "modelEs": "La disciplina de pensar en generaciones en vez de semanas cambia la manera en que un pastor maneja el crecimiento lento en sus discípulos. 1 Corintios 3:6 enseña que Pablo planta, Apolos riega, pero Dios da el crecimiento — el crecimiento es obra de Dios en el calendario de Dios, no del pastor. Un hombre que piensa solo un domingo a la vez se agotará para su quinto año, frustrado por gente que cambia lentamente; pero el hombre que piensa en generaciones es paciente, sabiendo que tal vez no vea el fruto de su discipulado por décadas. Planta semillas en un joven creyente que darán fruto en los hijos y discípulos de ese creyente mucho después de que el pastor se haya ido. La visión larga lo libera de exigir madurez instantánea y le permite invertir fielmente en tierra lenta. Mide su ministerio no por los resultados visibles de este año sino por la cadena de hombres fieles que se extiende hacia un futuro que nunca verá."
  },
  {
    "textEn": "28. Why must a pastor remain a learner throughout his ministry? What happens to a pastor who stops studying after seminary?",
    "textEs": "28. ¿Por qué debe un pastor permanecer un aprendiz a lo largo de su ministerio? ¿Qué le sucede a un pastor que deja de estudiar después del seminario?",
    "kw_en": [
      "learn",
      "study",
      "grow",
      "shallow",
      "repeat",
      "stale",
      "humble",
      "continue"
    ],
    "kw_es": [
      "aprender",
      "estudiar",
      "crecer",
      "superficial",
      "repetir",
      "rancio",
      "humilde",
      "continuar"
    ],
    "modelEn": "A pastor must remain a learner throughout his ministry, because the man who stops studying after seminary will, by his fifteenth year, be repeating himself with shallow teaching. The well runs dry when nothing new is poured in; the congregation hears the same handful of sermons recycled, and the pastor's own soul grows stale. A pastor who keeps reading, studying Scripture freshly, and learning from others stays green and keeps feeding his people genuine food. Lifelong learning also keeps him humble, since the student posture resists the pride that destroys ministries. The teacher must never stop being taught. The pastor who treats his seminary diploma as the finish line will preach thin sermons to a starving flock, while the one who remains a learner to the end will have something fresh to give even in his fortieth year.",
    "modelEs": "Un pastor debe permanecer un aprendiz a lo largo de su ministerio, porque el hombre que deja de estudiar después del seminario, para su decimoquinto año, estará repitiéndose con enseñanza superficial. El pozo se seca cuando no se vierte nada nuevo; la congregación oye el mismo puñado de sermones reciclados, y el alma misma del pastor se vuelve rancia. Un pastor que sigue leyendo, estudiando la Escritura con frescura y aprendiendo de otros se mantiene verde y sigue alimentando a su pueblo con comida genuina. El aprendizaje de por vida también lo mantiene humilde, pues la postura de estudiante resiste el orgullo que destruye los ministerios. El maestro nunca debe dejar de ser enseñado. El pastor que trata su diploma de seminario como la meta final predicará sermones delgados a un rebaño hambriento, mientras que el que permanece aprendiz hasta el fin tendrá algo fresco que dar aun en su cuadragésimo año."
  },
  {
    "textEn": "29. Apply the Mowrer → Drakeford → Wayne → next generation chain as a real-life example of 2 Timothy 2:2. How does this show that the verse is not theoretical but historical?",
    "textEs": "29. Aplique la cadena Mowrer → Drakeford → Wayne → próxima generación como un ejemplo real de 2 Timoteo 2:2. ¿Cómo muestra esto que el versículo no es teórico sino histórico?",
    "kw_en": [
      "chain",
      "drakeford",
      "mowrer",
      "generation",
      "historical",
      "timothy",
      "real",
      "transmit"
    ],
    "kw_es": [
      "cadena",
      "drakeford",
      "mowrer",
      "generación",
      "histórico",
      "timoteo",
      "real",
      "transmitir"
    ],
    "modelEn": "The Mowrer → Drakeford → Wayne → next generation chain is a real-life example of 2 Timothy 2:2, showing the verse is not theoretical but historical. O. Hobart Mowrer taught John Drakeford, who taught at Southwestern Baptist Theological Seminary; Drakeford's methods passed to Wayne, who now passes them to the students of this very course, who will teach others also. That is four living generations of faithful transmission, exactly the pattern Paul described. The chain proves that disciple-making is not an abstract ideal but the actual mechanism by which knowledge and ministry are handed down through time. Each man received from the one before and gave to the ones after. This course itself is a link in such a chain — and every student who learns it and teaches another keeps 2 Timothy 2:2 alive in his own generation. The verse describes not history's exception but its ordinary means.",
    "modelEs": "La cadena Mowrer → Drakeford → Wayne → próxima generación es un ejemplo de la vida real de 2 Timoteo 2:2, mostrando que el versículo no es teórico sino histórico. O. Hobart Mowrer enseñó a John Drakeford, que enseñó en el Seminario Teológico Bautista del Suroeste; los métodos de Drakeford pasaron a Wayne, quien ahora los pasa a los estudiantes de este mismo curso, que enseñarán también a otros. Esas son cuatro generaciones vivas de transmisión fiel, exactamente el patrón que Pablo describió. La cadena prueba que el hacer discípulos no es un ideal abstracto sino el mecanismo real por el cual el conocimiento y el ministerio se transmiten a través del tiempo. Cada hombre recibió del anterior y dio a los posteriores. Este curso mismo es un eslabón en tal cadena — y cada estudiante que lo aprende y enseña a otro mantiene vivo 2 Timoteo 2:2 en su propia generación. El versículo describe no la excepción de la historia sino su medio ordinario."
  },
  {
    "textEn": "30. Synthesize the entire unit: How does the pastor's discipleship ministry, lived consistently over decades, build a church that is stronger after he is gone than it was while he was there?",
    "textEs": "30. Sintetice toda la unidad: ¿Cómo el ministerio de discipulado del pastor, vivido consistentemente a lo largo de décadas, edifica una iglesia que es más fuerte después de que él se ha ido que cuando él estaba allí?",
    "kw_en": [
      "disciple",
      "generation",
      "multiply",
      "stronger",
      "equip",
      "leader",
      "endure",
      "legacy"
    ],
    "kw_es": [
      "discípulo",
      "generación",
      "multiplic",
      "fuerte",
      "equip",
      "líder",
      "perdura",
      "legado"
    ],
    "modelEn": "The pastor's discipleship ministry, lived consistently over decades, builds a church that is stronger after he is gone than it was while he was there. By equipping the saints rather than doing all the ministry himself, teaching at every level but especially one on one, and thinking in generations rather than weeks, the pastor multiplies himself into faithful men who will teach others also. The fruit of discipleship is not a crowd dependent on one man but a body full of equipped, maturing ministers. When he dies or retires, the church does not collapse, because he poured his life into people who carry it forward — his voice continues through every disciple he ever invested in. This is the deepest legacy a pastor can leave: not a building or a budget, but a chain of faithful men stretching into a future he will never see. The undershepherd who disciples leaves the flock in the hands of shepherds he has raised.",
    "modelEs": "El ministerio de discipulado del pastor, vivido consistentemente a lo largo de décadas, construye una iglesia que es más fuerte después de que él se va de lo que era mientras él estaba. Al equipar a los santos en vez de hacer todo el ministerio él mismo, enseñar en cada nivel pero especialmente uno a uno, y pensar en generaciones en vez de semanas, el pastor se multiplica en hombres fieles que enseñarán también a otros. El fruto del discipulado no es una multitud dependiente de un hombre sino un cuerpo lleno de ministros equipados que maduran. Cuando muere o se jubila, la iglesia no colapsa, porque derramó su vida en personas que lo llevan adelante — su voz continúa a través de cada discípulo en quien invirtió. Este es el legado más profundo que un pastor puede dejar: no un edificio o un presupuesto, sino una cadena de hombres fieles que se extiende hacia un futuro que nunca verá. El subpastor que discipula deja al rebaño en manos de pastores que ha levantado."
  }
];

const PREV_HREF = 'CTSPMUnit6.html';

const NEXT_HREF = 'CTSPMUnit8.html';
