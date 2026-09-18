/* CTSPM - unit 1: per-unit configuration and content. */

const UNIT = 1;

let currentUnit = 1;

const mcQuestions = [
  {
    "textEn": "1. Pastoral ministry originates in:",
    "textEs": "1. El ministerio pastoral se origina en:",
    "optionsEn": [
      "God Himself",
      "Seminaries",
      "Denominations",
      "The apostles"
    ],
    "optionsEs": [
      "Dios mismo",
      "Los seminarios",
      "Las denominaciones",
      "Los apóstoles"
    ],
    "c": 21,
    "explEn": "Pastoral ministry begins in the heart of God, the eternal Shepherd, long before any human institution.",
    "explEs": "El ministerio pastoral comienza en el corazón de Dios, el Pastor eterno, mucho antes de cualquier institución humana."
  },
  {
    "textEn": "2. The most important pastoral image of God in the Old Testament is:",
    "textEs": "2. La imagen pastoral de Dios más importante en el Antiguo Testamento es:",
    "optionsEn": [
      "Judge",
      "King",
      "Shepherd",
      "Warrior"
    ],
    "optionsEs": [
      "Juez",
      "Rey",
      "Pastor",
      "Guerrero"
    ],
    "c": 30,
    "explEn": "Scripture's dominant pastoral picture of God is the Shepherd who leads, feeds, and gathers His people.",
    "explEs": "La imagen pastoral dominante de Dios en la Escritura es el Pastor que guía, alimenta y recoge a Su pueblo."
  },
  {
    "textEn": "3. Psalm 23 was written by:",
    "textEs": "3. El Salmo 23 fue escrito por:",
    "optionsEn": [
      "Solomon",
      "David",
      "Asaph",
      "Moses"
    ],
    "optionsEs": [
      "Salomón",
      "David",
      "Asaf",
      "Moisés"
    ],
    "c": 36,
    "explEn": "David, the shepherd-boy of Bethlehem, wrote Psalm 23 from his own experience tending sheep.",
    "explEs": "David, el pastorcillo de Belén, escribió el Salmo 23 desde su propia experiencia cuidando ovejas."
  },
  {
    "textEn": "4. Ezekiel 34 thunders against:",
    "textEs": "4. Ezequiel 34 truena contra:",
    "optionsEn": [
      "False prophets",
      "False shepherds",
      "Egypt",
      "Babylon"
    ],
    "optionsEs": [
      "Falsos profetas",
      "Falsos pastores",
      "Egipto",
      "Babilonia"
    ],
    "c": 43,
    "explEn": "Ezekiel 34 is God's thunderous indictment of the false shepherds who fed themselves and neglected the flock.",
    "explEs": "Ezequiel 34 es la atronadora acusación de Dios contra los falsos pastores que se apacentaron a sí mismos y descuidaron el rebaño."
  },
  {
    "textEn": "5. In John 10:11, Jesus declares:",
    "textEs": "5. En Juan 10:11, Jesús declara:",
    "optionsEn": [
      "\"I am the good shepherd\"",
      "\"I am the way\"",
      "\"I am the vine\"",
      "\"I am the bread\""
    ],
    "optionsEs": [
      "\"Yo soy el buen pastor\"",
      "\"Yo soy el camino\"",
      "\"Yo soy la vid\"",
      "\"Yo soy el pan\""
    ],
    "c": 49,
    "explEn": "In John 10:11 Jesus claims to be the good shepherd who gives His life for the sheep.",
    "explEs": "En Juan 10:11 Jesús afirma ser el buen pastor que da Su vida por las ovejas."
  },
  {
    "textEn": "6. The Good Shepherd is distinguished from the hireling because He:",
    "textEs": "6. El Buen Pastor se distingue del asalariado porque Él:",
    "optionsEn": [
      "Charges more",
      "Trains other shepherds",
      "Lays down His life for the sheep",
      "Sleeps in the fold"
    ],
    "optionsEs": [
      "Cobra más",
      "Entrena a otros pastores",
      "Da Su vida por las ovejas",
      "Duerme en el redil"
    ],
    "c": 58,
    "explEn": "Unlike the hireling who flees, the Good Shepherd lays down His life for the sheep.",
    "explEs": "A diferencia del asalariado que huye, el Buen Pastor da Su vida por las ovejas."
  },
  {
    "textEn": "7. After His resurrection, Jesus restored Peter with the words:",
    "textEs": "7. Después de Su resurrección, Jesús restauró a Pedro con las palabras:",
    "optionsEn": [
      "\"Wait in Jerusalem\"",
      "\"Build my church\"",
      "\"Make disciples\"",
      "\"Feed My sheep\""
    ],
    "optionsEs": [
      "\"Esperen en Jerusalén\"",
      "\"Edifica mi iglesia\"",
      "\"Hagan discípulos\"",
      "\"Apacienta mis ovejas\""
    ],
    "c": 66,
    "explEn": "Jesus restored Peter on the shore with the threefold charge, 'Feed My sheep.'",
    "explEs": "Jesús restauró a Pedro en la orilla con el triple encargo: 'Apacienta mis ovejas.'"
  },
  {
    "textEn": "8. Pastors are best described as:",
    "textEs": "8. Los pastores se describen mejor como:",
    "optionsEn": [
      "Chief shepherds",
      "Hirelings",
      "Prophets",
      "Undershepherds"
    ],
    "optionsEs": [
      "Príncipes de los pastores",
      "Asalariados",
      "Profetas",
      "Subpastores"
    ],
    "c": 73,
    "explEn": "Pastors are undershepherds who serve beneath the Chief Shepherd, never owners of the flock.",
    "explEs": "Los pastores son subpastores que sirven bajo el Príncipe de los pastores, nunca dueños del rebaño."
  },
  {
    "textEn": "9. The course Scripture for Pastoral Ministries is:",
    "textEs": "9. La Escritura del curso de Ministerios Pastorales es:",
    "optionsEn": [
      "Acts 20:28",
      "2 Timothy 4:2",
      "1 Peter 5:2-4",
      "John 21:17"
    ],
    "optionsEs": [
      "Hechos 20:28",
      "2 Timoteo 4:2",
      "1 Pedro 5:2-4",
      "Juan 21:17"
    ],
    "c": 79,
    "explEn": "The course Scripture is 1 Peter 5:2-4, which lays out the pastoral office with surgical clarity.",
    "explEs": "La Escritura del curso es 1 Pedro 5:2-4, que expone el oficio pastoral con claridad quirúrgica."
  },
  {
    "textEn": "10. Phillip Keller's 'fence-crawler' sheep teaches that sheep:",
    "textEs": "10. La oveja 'trepadora de cercas' de Phillip Keller enseña que las ovejas:",
    "optionsEn": [
      "Wander and lead others astray",
      "Protect the flock",
      "Need no guidance",
      "Graze independently"
    ],
    "optionsEs": [
      "Vagan y llevan a otras por mal camino",
      "Protegen al rebaño",
      "No necesitan guía",
      "Pastan independientemente"
    ],
    "c": 84,
    "explEn": "Keller's restless fence-crawler shows that sheep wander into ruin and lead others astray with them.",
    "explEs": "La inquieta trepadora de cercas de Keller muestra que las ovejas vagan a la ruina y llevan a otras consigo."
  },
  {
    "textEn": "11. The shepherd Andrew of New Zealand illustrates:",
    "textEs": "11. El pastor Andrew de Nueva Zelanda ilustra:",
    "optionsEn": [
      "Sheep know themselves",
      "Shepherds are unnecessary",
      "Sheep follow any voice",
      "The shepherd knows each sheep by name"
    ],
    "optionsEs": [
      "Las ovejas se conocen a sí mismas",
      "Los pastores son innecesarios",
      "Las ovejas siguen cualquier voz",
      "El pastor conoce cada oveja por nombre"
    ],
    "c": 94,
    "explEn": "Shepherd Andrew calling each sheep by name pictures how the shepherd knows the flock individually.",
    "explEs": "El pastor Andrew llamando a cada oveja por nombre retrata cómo el pastor conoce al rebaño individualmente."
  },
  {
    "textEn": "12. Peter commands pastors to shepherd God's flock:",
    "textEs": "12. Pedro manda a los pastores a apacentar la grey de Dios:",
    "optionsEn": [
      "For dishonest gain",
      "By lording over them",
      "Willingly, as examples",
      "Only when paid"
    ],
    "optionsEs": [
      "Por ganancia deshonesta",
      "Teniendo señorío sobre ellos",
      "Voluntariamente, como ejemplos",
      "Solo cuando se les paga"
    ],
    "c": 100,
    "explEn": "Peter commands pastors to shepherd willingly and as examples, not for gain or by domineering.",
    "explEs": "Pedro manda a los pastores apacentar voluntariamente y como ejemplos, no por ganancia ni dominando."
  },
  {
    "textEn": "13. The 'Chief Shepherd' of 1 Peter 5:4 is:",
    "textEs": "13. El 'Príncipe de los pastores' de 1 Pedro 5:4 es:",
    "optionsEn": [
      "Peter",
      "Paul",
      "Timothy",
      "Jesus Christ"
    ],
    "optionsEs": [
      "Pedro",
      "Pablo",
      "Timoteo",
      "Jesucristo"
    ],
    "c": 108,
    "explEn": "The Chief Shepherd of 1 Peter 5:4 is Jesus Christ, to whom every pastor will give account.",
    "explEs": "El Príncipe de los pastores de 1 Pedro 5:4 es Jesucristo, a quien todo pastor dará cuentas."
  },
  {
    "textEn": "14. According to 1 Peter 5:3, pastors lead by:",
    "textEs": "14. Según 1 Pedro 5:3, los pastores lideran:",
    "optionsEn": [
      "Example",
      "Compulsion",
      "Money",
      "Seniority"
    ],
    "optionsEs": [
      "Por ejemplo",
      "Por fuerza",
      "Por dinero",
      "Por antigüedad"
    ],
    "c": 112,
    "explEn": "1 Peter 5:3 says pastors lead by example, not by compulsion, money, or seniority.",
    "explEs": "1 Pedro 5:3 dice que los pastores lideran por ejemplo, no por fuerza, dinero o antigüedad."
  },
  {
    "textEn": "15. Which is NOT one of the five marks of biblical pastoral ministry?",
    "textEs": "15. ¿Cuál NO es una de las cinco marcas del ministerio pastoral bíblico?",
    "optionsEn": [
      "Theological",
      "Protective",
      "Entertaining",
      "Sacrificial"
    ],
    "optionsEs": [
      "Teológico",
      "Protector",
      "Entretenido",
      "Sacrificial"
    ],
    "c": 121,
    "explEn": "'Entertaining' is not a biblical mark; the five marks are theological, protective, relational, sacrificial, and equipping.",
    "explEs": "'Entretenido' no es una marca bíblica; las cinco marcas son teológico, protector, relacional, sacrificial y equipador."
  },
  {
    "textEn": "16. Paul warned the Ephesian elders in Acts 20:29 about:",
    "textEs": "16. Pablo advirtió a los ancianos efesios en Hechos 20:29 acerca de:",
    "optionsEn": [
      "Financial trouble",
      "Savage wolves",
      "Lazy deacons",
      "Roman soldiers"
    ],
    "optionsEs": [
      "Problemas financieros",
      "Lobos rapaces",
      "Diáconos perezosos",
      "Soldados romanos"
    ],
    "c": 127,
    "explEn": "Paul warned the Ephesian elders that savage wolves would come in, not sparing the flock.",
    "explEs": "Pablo advirtió a los ancianos efesios que entrarían lobos rapaces que no perdonarían al rebaño."
  },
  {
    "textEn": "17. Ephesians 4:11-12 teaches that pastors are given to:",
    "textEs": "17. Efesios 4:11-12 enseña que los pastores son dados para:",
    "optionsEn": [
      "Rule the saints",
      "Equip the saints for ministry",
      "Replace the saints",
      "Entertain the saints"
    ],
    "optionsEs": [
      "Gobernar a los santos",
      "Perfeccionar a los santos para la obra del ministerio",
      "Reemplazar a los santos",
      "Entretener a los santos"
    ],
    "c": 134,
    "explEn": "Ephesians 4:11-12 says pastors are given to equip the saints for the work of ministry.",
    "explEs": "Efesios 4:11-12 dice que los pastores son dados para perfeccionar a los santos para la obra del ministerio."
  },
  {
    "textEn": "18. The 'crown of glory that does not fade away' is given by:",
    "textEs": "18. La 'corona incorruptible de gloria' es dada por:",
    "optionsEn": [
      "The church board",
      "The denomination",
      "The seminary",
      "The Chief Shepherd"
    ],
    "optionsEs": [
      "La junta de la iglesia",
      "La denominación",
      "El seminario",
      "El Príncipe de los pastores"
    ],
    "c": 143,
    "explEn": "The unfading crown of glory is given by the Chief Shepherd Himself when He appears.",
    "explEs": "La corona incorruptible de gloria es dada por el Príncipe de los pastores mismo cuando Él aparece."
  },
  {
    "textEn": "19. James 3:1 warns teachers because they will receive:",
    "textEs": "19. Santiago 3:1 advierte a los maestros porque recibirán:",
    "optionsEn": [
      "Stricter judgment",
      "Public honor",
      "Easier work",
      "More pay"
    ],
    "optionsEs": [
      "Mayor condenación",
      "Honor público",
      "Trabajo más fácil",
      "Más paga"
    ],
    "c": 147,
    "explEn": "James 3:1 warns that those who teach will receive a stricter judgment.",
    "explEs": "Santiago 3:1 advierte que los que enseñan recibirán mayor condenación."
  },
  {
    "textEn": "20. Pastoral ministry is fundamentally:",
    "textEs": "20. El ministerio pastoral es fundamentalmente:",
    "optionsEn": [
      "A hobby",
      "A sacred calling",
      "A business",
      "A profession"
    ],
    "optionsEs": [
      "Un pasatiempo",
      "Un llamado sagrado",
      "Un negocio",
      "Una profesión"
    ],
    "c": 155,
    "explEn": "Pastoral ministry is fundamentally a sacred calling, not a hobby, business, or mere profession.",
    "explEs": "El ministerio pastoral es fundamentalmente un llamado sagrado, no un pasatiempo, negocio ni mera profesión."
  }
];

const kwQuestions = [
  {
    "textEn": "21. Why is it significant that pastoral ministry begins with God's own shepherd-heart and not with seminaries or denominations?",
    "textEs": "21. ¿Por qué es significativo que el ministerio pastoral comience con el corazón pastoral de Dios mismo y no con seminarios o denominaciones?",
    "kw_en": [
      "god",
      "shepherd",
      "origin",
      "heart",
      "begin",
      "throne",
      "etern",
      "call"
    ],
    "kw_es": [
      "dios",
      "pastor",
      "origen",
      "corazón",
      "comenz",
      "trono",
      "etern",
      "llam"
    ],
    "modelEn": "Pastoral ministry did not begin in a seminary, a denomination, or a credentialing committee — it began in the heart of God Himself, who is the original and eternal Shepherd of His people. Before there was ever a pastor, there was a Shepherd; before there was ever a flock, there was a Shepherd's heart. This matters because it locates the pastor's authority and pattern in God, not in human institutions. Every man who enters the office today steps into a stream that began at the throne of God and runs through every page of Scripture. The pastor is therefore accountable first to the One who calls, not to the structures that train or recognize him.",
    "modelEs": "El ministerio pastoral no comenzó en un seminario, una denominación ni un comité de credenciales — comenzó en el corazón de Dios mismo, quien es el Pastor original y eterno de Su pueblo. Antes de que existiera un pastor, ya existía un Pastor; antes de que existiera un rebaño, ya existía un corazón de Pastor. Esto importa porque ubica la autoridad y el modelo del pastor en Dios, no en instituciones humanas. Todo hombre que entra hoy al oficio entra en una corriente que comenzó en el trono de Dios y corre por cada página de la Escritura. El pastor, por tanto, rinde cuentas primero a Aquel que llama, no a las estructuras que lo entrenan o reconocen."
  },
  {
    "textEn": "22. Explain how Ezekiel 34 functions as both warning and gospel for pastors today.",
    "textEs": "22. Explique cómo funciona Ezequiel 34 tanto como advertencia y evangelio para los pastores hoy.",
    "kw_en": [
      "ezekiel",
      "shepherd",
      "warn",
      "judg",
      "feed",
      "neglect",
      "flock",
      "account"
    ],
    "kw_es": [
      "ezequiel",
      "pastor",
      "advert",
      "juicio",
      "aliment",
      "descuid",
      "rebaño",
      "cuenta"
    ],
    "modelEn": "Ezekiel 34 is the most sobering chapter in Scripture for any man who would enter pastoral leadership, because God thunders against shepherds who fed themselves instead of the flock. They had eaten the fat and worn the wool, but the weak they had not strengthened, the sick they had not healed, and the scattered they had not gathered — so God said, 'I am against the shepherds.' As warning, it tells every pastor that the office carries real accountability and that neglect of the flock is sin God Himself opposes. As gospel, the same chapter promises that God will Himself seek His sheep and set over them one true Shepherd, fulfilled in Christ. The faithful pastor reads it on his knees: warned by the woe, comforted that the Chief Shepherd has not abandoned the flock.",
    "modelEs": "Ezequiel 34 es el capítulo más solemne de la Escritura para cualquier hombre que entraría al liderazgo pastoral, porque Dios truena contra los pastores que se apacentaron a sí mismos en lugar del rebaño. Habían comido la grosura y se habían vestido de la lana, pero a las débiles no fortalecieron, a las enfermas no sanaron y a las descarriadas no recogieron — por eso Dios dijo: 'Yo estoy contra los pastores.' Como advertencia, le dice a todo pastor que el oficio conlleva verdadera responsabilidad y que descuidar el rebaño es pecado que Dios mismo combate. Como evangelio, el mismo capítulo promete que Dios mismo buscará Sus ovejas y pondrá sobre ellas un Pastor verdadero, cumplido en Cristo. El pastor fiel lo lee de rodillas: advertido por el ay, consolado de que el Príncipe de los pastores no ha abandonado el rebaño."
  },
  {
    "textEn": "23. Discuss what John 10's image of the Good Shepherd teaches about pastoral character and sacrifice.",
    "textEs": "23. Discuta lo que la imagen del Buen Pastor en Juan 10 enseña sobre el carácter pastoral y el sacrificio.",
    "kw_en": [
      "shepherd",
      "life",
      "sheep",
      "sacrific",
      "hireling",
      "know",
      "voice",
      "lay"
    ],
    "kw_es": [
      "pastor",
      "vida",
      "ovejas",
      "sacrific",
      "asalariado",
      "conoc",
      "voz",
      "da"
    ],
    "modelEn": "In John 10 Jesus declares, 'I am the good shepherd. The good shepherd gives His life for the sheep,' setting Himself apart from the hireling who runs when the wolf comes. Three things mark the Good Shepherd: He knows His sheep by name, His sheep know His voice, and He lays down His life for them. This teaches that pastoral character is measured by sacrifice, not salary or convenience. The undershepherd cannot do less than his Master — there will be sleep lost, comfort surrendered, and reputation risked. A pastor who flees at the first sign of danger has shown himself a hireling, not a shepherd.",
    "modelEs": "En Juan 10 Jesús declara: 'Yo soy el buen pastor; el buen pastor su vida da por las ovejas,' distinguiéndose del asalariado que huye cuando viene el lobo. Tres cosas marcan al Buen Pastor: conoce a Sus ovejas por nombre, Sus ovejas conocen Su voz, y da Su vida por ellas. Esto enseña que el carácter pastoral se mide por el sacrificio, no por el salario ni la comodidad. El subpastor no puede hacer menos que su Maestro — habrá sueño perdido, comodidad entregada y reputación arriesgada. Un pastor que huye a la primera señal de peligro se ha mostrado asalariado, no pastor."
  },
  {
    "textEn": "24. What does it mean that the pastor is an 'undershepherd' rather than the chief shepherd? Why does this matter for daily ministry?",
    "textEs": "24. ¿Qué significa que el pastor es un 'subpastor' y no el Príncipe de los pastores? ¿Por qué importa esto para el ministerio diario?",
    "kw_en": [
      "under",
      "shepherd",
      "serve",
      "steward",
      "christ",
      "account",
      "flock",
      "humb"
    ],
    "kw_es": [
      "sub",
      "pastor",
      "sirv",
      "mayordom",
      "cristo",
      "cuenta",
      "rebaño",
      "humil"
    ],
    "modelEn": "To be an undershepherd means the pastor serves beneath the Chief Shepherd; he is never the owner of the flock but a steward of it. The flock belongs to Christ — they are 'My sheep,' as Jesus told Peter — and the pastor manages what is not his own. This keeps a man humble in his successes, faithful in his failures, and steady in his old age, because the weight of ownership never rested on him. For daily ministry it changes everything: decisions are made to please the Chief Shepherd, not the man himself or the crowd. One day He will appear, and the steward will give account for how he cared for another's sheep.",
    "modelEs": "Ser subpastor significa que el pastor sirve bajo el Príncipe de los pastores; nunca es el dueño del rebaño sino un mayordomo de él. El rebaño pertenece a Cristo — son 'mis ovejas,' como Jesús le dijo a Pedro — y el pastor administra lo que no es suyo. Esto mantiene al hombre humilde en sus éxitos, fiel en sus fracasos y estable en su vejez, porque el peso de la propiedad nunca recayó sobre él. Para el ministerio diario lo cambia todo: las decisiones se toman para agradar al Príncipe de los pastores, no al hombre mismo ni a la multitud. Un día Él aparecerá, y el mayordomo dará cuentas de cómo cuidó las ovejas de Otro."
  },
  {
    "textEn": "25. Apply 1 Peter 5:1-4 to a modern pastor's life. Which phrase challenges you most, and why?",
    "textEs": "25. Aplique 1 Pedro 5:1-4 a la vida de un pastor moderno. ¿Cuál frase le desafía más, y por qué?",
    "kw_en": [
      "peter",
      "willing",
      "example",
      "compulsion",
      "shepherd",
      "eager",
      "elder",
      "crown"
    ],
    "kw_es": [
      "pedro",
      "voluntar",
      "ejemplo",
      "fuerza",
      "pastor",
      "ánimo",
      "anciano",
      "corona"
    ],
    "modelEn": "1 Peter 5:1-4 lays out the office with surgical clarity: shepherd the flock of God among you, serving as overseers not by compulsion but willingly, not for dishonest gain but eagerly, not lording over those entrusted to you but being examples. Applied to a modern pastor, every phrase confronts a real temptation — duty without willingness, ministry shaped by money, leadership that dominates rather than models. The phrase that challenges most is often 'being examples to the flock,' because it means the preaching must be doubled by the living. Peter, himself a fellow elder and a restored failure, writes not as a distant authority but as a shepherd among shepherds. And he anchors it all in the promise that when the Chief Shepherd appears, the faithful will receive the crown of glory that does not fade away.",
    "modelEs": "1 Pedro 5:1-4 expone el oficio con claridad quirúrgica: apacentad la grey de Dios que está entre vosotros, cuidando de ella no por fuerza sino voluntariamente, no por ganancia deshonesta sino con ánimo pronto, no como teniendo señorío sobre los que están a vuestro cargo sino siendo ejemplos. Aplicada a un pastor moderno, cada frase confronta una tentación real — el deber sin voluntad, el ministerio moldeado por el dinero, el liderazgo que domina en vez de modelar. La frase que más desafía suele ser 'siendo ejemplos a la grey,' porque significa que la predicación debe duplicarse con la vida. Pedro, él mismo anciano y un fracasado restaurado, escribe no como autoridad distante sino como pastor entre pastores. Y lo ancla todo en la promesa de que cuando aparezca el Príncipe de los pastores, los fieles recibirán la corona incorruptible de gloria."
  },
  {
    "textEn": "26. List and explain the five marks of biblical pastoral ministry. Which is most often missing in modern ministry?",
    "textEs": "26. Enumere y explique las cinco marcas del ministerio pastoral bíblico. ¿Cuál falta más a menudo en el ministerio moderno?",
    "kw_en": [
      "theolog",
      "protect",
      "relation",
      "sacrific",
      "equip",
      "word",
      "wolf",
      "saint"
    ],
    "kw_es": [
      "teológ",
      "protect",
      "relacion",
      "sacrific",
      "equip",
      "palabra",
      "lobo",
      "santo"
    ],
    "modelEn": "The five marks of biblical pastoral ministry are that it is theological, protective, relational, sacrificial, and equipping. It is theological because the pastor feeds the flock through the Word; protective because he guards against wolves and false teaching; relational because he knows his sheep by name and is present in their lives; sacrificial because, like the Good Shepherd, he lays down his life; and equipping because Ephesians 4 says he is given to prepare the saints for the work of ministry. In modern ministry the relational and equipping marks are most often missing — many men preach well but never enter the homes, and many do all the work themselves rather than raising up others to serve. A faithful pastorate is measured not by how much the pastor does but by how many believers have been raised up to serve. Recovering all five keeps the office from collapsing into mere performance or management.",
    "modelEs": "Las cinco marcas del ministerio pastoral bíblico son que es teológico, protector, relacional, sacrificial y equipador. Es teológico porque el pastor alimenta al rebaño por medio de la Palabra; protector porque guarda contra los lobos y la falsa enseñanza; relacional porque conoce a sus ovejas por nombre y está presente en sus vidas; sacrificial porque, como el Buen Pastor, da su vida; y equipador porque Efesios 4 dice que es dado para perfeccionar a los santos para la obra del ministerio. En el ministerio moderno las marcas relacional y equipadora son las que más faltan — muchos hombres predican bien pero nunca entran en los hogares, y muchos hacen toda la obra ellos mismos en vez de levantar a otros para servir. Un pastorado fiel no se mide por cuánto hace el pastor sino por cuántos creyentes han sido levantados para servir. Recuperar las cinco evita que el oficio se reduzca a mero desempeño o administración."
  },
  {
    "textEn": "27. How does the pastor's accountability to the Chief Shepherd shape his daily decisions and long-term faithfulness?",
    "textEs": "27. ¿Cómo da forma la rendición de cuentas del pastor al Príncipe de los pastores a sus decisiones diarias y a su fidelidad a largo plazo?",
    "kw_en": [
      "account",
      "shepherd",
      "appear",
      "judg",
      "crown",
      "faithful",
      "day",
      "give"
    ],
    "kw_es": [
      "cuenta",
      "pastor",
      "aparec",
      "juicio",
      "corona",
      "fiel",
      "día",
      "dar"
    ],
    "modelEn": "The pastor serves under a Chief Shepherd who will one day appear, and that coming day of accountability shapes every present decision. James warns that teachers will receive a stricter judgment, so the office is glorious but weighty. Knowing he will give account, the faithful pastor asks whether the Chief Shepherd will find him feeding the flock or feeding himself, knowing his sheep by name or merely managing an institution. This horizon guards him from the small compromises that accumulate over a long ministry. It is also a comfort, for the same Lord who judges unfaithful shepherds rewards the faithful with the crown of glory that does not fade away.",
    "modelEs": "El pastor sirve bajo un Príncipe de los pastores que un día aparecerá, y ese día venidero de rendición de cuentas da forma a cada decisión presente. Santiago advierte que los maestros recibirán mayor condenación, así que el oficio es glorioso pero pesado. Sabiendo que dará cuentas, el pastor fiel se pregunta si el Príncipe de los pastores lo hallará apacentando el rebaño o apacentándose a sí mismo, conociendo a sus ovejas por nombre o simplemente administrando una institución. Este horizonte lo guarda de los pequeños compromisos que se acumulan a lo largo de un ministerio largo. También es un consuelo, porque el mismo Señor que juzga a los pastores infieles recompensa a los fieles con la corona incorruptible de gloria."
  },
  {
    "textEn": "28. Why is preaching the Word of God ('theological' ministry) the foundation of pastoral work? What happens when this foundation is weakened?",
    "textEs": "28. ¿Por qué es la predicación de la Palabra de Dios (ministerio 'teológico') el fundamento de la obra pastoral? ¿Qué sucede cuando se debilita este fundamento?",
    "kw_en": [
      "preach",
      "word",
      "scripture",
      "feed",
      "starv",
      "foundation",
      "pulpit",
      "weak"
    ],
    "kw_es": [
      "predic",
      "palabra",
      "escritura",
      "aliment",
      "hambre",
      "fundamento",
      "púlpito",
      "débil"
    ],
    "modelEn": "Preaching the Word is the theological mark, and it is foundational because the pastor feeds the flock through the Word of God, as Paul charged Timothy to 'preach the word.' When the pulpit grows weak, the church grows weak; sheep are fed by green grass, not by ribbons tied around the fence post. When Scripture is replaced with stories, exegesis with anecdotes, and the Word reduced to a launching pad for the pastor's opinions, the flock starves in the middle of plenty. Everything else in ministry rests on this — a man who will not feed the people from the Word has nothing to protect, and no foundation to build on. The weakening of this foundation is the quiet beginning of most pastoral collapse.",
    "modelEs": "Predicar la Palabra es la marca teológica, y es fundamental porque el pastor alimenta al rebaño por medio de la Palabra de Dios, como Pablo encargó a Timoteo: 'predica la palabra.' Cuando el púlpito se debilita, la iglesia se debilita; las ovejas se alimentan de pasto verde, no de cintas atadas al poste de la cerca. Cuando la Escritura se reemplaza con historias, la exégesis con anécdotas, y la Palabra se reduce a una plataforma de lanzamiento para las opiniones del pastor, el rebaño muere de hambre en medio de la abundancia. Todo lo demás en el ministerio descansa sobre esto — un hombre que no alimentará al pueblo de la Palabra no tiene nada que proteger ni fundamento sobre el cual edificar. El debilitamiento de este fundamento es el comienzo silencioso de la mayoría de los colapsos pastorales."
  },
  {
    "textEn": "29. Discuss how the equipping mark of pastoral ministry (Ephesians 4:11-12) reshapes how a pastor measures success.",
    "textEs": "29. Discuta cómo la marca equipadora del ministerio pastoral (Efesios 4:11-12) reformula cómo un pastor mide el éxito.",
    "kw_en": [
      "equip",
      "ephesian",
      "saint",
      "ministry",
      "success",
      "serv",
      "body",
      "raise"
    ],
    "kw_es": [
      "equip",
      "efesios",
      "santo",
      "ministerio",
      "éxito",
      "serv",
      "cuerpo",
      "levant"
    ],
    "modelEn": "Ephesians 4:11-12 says pastors and teachers are given to the church 'for the equipping of the saints for the work of ministry, for the edifying of the body of Christ.' This reshapes how a pastor measures success: the pastor is not the only minister in the congregation but the equipper of ministers. A successful pastorate is not measured by how much the pastor does, but by how many believers have been raised up to serve. The man who tries to do everything himself produces a dependent church and an exhausted pastor. The man who equips produces a body where every member shares the work, which is the New Testament pattern.",
    "modelEs": "Efesios 4:11-12 dice que los pastores y maestros son dados a la iglesia 'a fin de perfeccionar a los santos para la obra del ministerio, para la edificación del cuerpo de Cristo.' Esto reformula cómo un pastor mide el éxito: el pastor no es el único ministro en la congregación sino el equipador de ministros. Un pastorado exitoso no se mide por cuánto hace el pastor, sino por cuántos creyentes han sido levantados para servir. El hombre que intenta hacer todo él mismo produce una iglesia dependiente y un pastor agotado. El hombre que equipa produce un cuerpo donde cada miembro comparte la obra, que es el patrón del Nuevo Testamento."
  },
  {
    "textEn": "30. Synthesize the entire unit: How does the biblical foundation of pastoral ministry shape both the calling and the daily work of a faithful pastor?",
    "textEs": "30. Sintetice toda la unidad: ¿Cómo da forma el fundamento bíblico del ministerio pastoral tanto al llamado como a la labor diaria de un pastor fiel?",
    "kw_en": [
      "shepherd",
      "under",
      "christ",
      "scripture",
      "call",
      "flock",
      "account",
      "sacred"
    ],
    "kw_es": [
      "pastor",
      "sub",
      "cristo",
      "escritura",
      "llam",
      "rebaño",
      "cuenta",
      "sagrado"
    ],
    "modelEn": "The biblical foundation of pastoral ministry is that Christ is the Shepherd and the pastor is His undershepherd; the flock is His, not ours. From this everything flows: the Word is our food, the truth is our weapon, the people are our charge, and the Day of accountability is our horizon. The calling is shaped by this because no man takes the office to himself — he is called by God and confirmed by the church. The daily work is shaped by it because the undershepherd feeds, protects, knows, sacrifices for, and equips a flock that belongs to Another. Without these foundations pastoral ministry becomes a profession; with them it becomes a sacred calling worthy of a man's whole life.",
    "modelEs": "El fundamento bíblico del ministerio pastoral es que Cristo es el Pastor y el pastor es Su subpastor; el rebaño es Suyo, no nuestro. De esto fluye todo: la Palabra es nuestro alimento, la verdad es nuestra arma, el pueblo es nuestra carga, y el Día de la rendición de cuentas es nuestro horizonte. El llamado se forma por esto porque ningún hombre toma el oficio para sí — es llamado por Dios y confirmado por la iglesia. La labor diaria se forma por ello porque el subpastor alimenta, protege, conoce, se sacrifica por y equipa a un rebaño que pertenece a Otro. Sin estos fundamentos el ministerio pastoral se vuelve una profesión; con ellos se vuelve un llamado sagrado digno de toda la vida de un hombre."
  }
];

const PREV_HREF = null;

const NEXT_HREF = 'CTSPMUnit2.html';
