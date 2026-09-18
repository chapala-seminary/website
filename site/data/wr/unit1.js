/* CTSWR - unit 1: per-unit configuration and content. */

const UNIT = 1;

let currentUnit = 1;

const mcQuestions = [
  {
    "textEn": "1. According to Ecclesiastes 3:11 and Romans 1:19-20, the universal human impulse to worship something is best explained as:",
    "textEs": "1. Según Eclesiastés 3:11 y Romanos 1:19-20, el impulso humano universal de adorar algo se explica mejor como:",
    "optionsEn": [
      "A signature the Creator has left on every human heart",
      "A cultural accident found only in some societies",
      "A leftover superstition from primitive fear",
      "Proof that all religions are equally true"
    ],
    "optionsEs": [
      "Una firma que el Creador ha dejado en cada corazón humano",
      "Un accidente cultural que solo se halla en algunas sociedades",
      "Una superstición residual del miedo primitivo",
      "Prueba de que todas las religiones son igualmente verdaderas"
    ],
    "c": 21,
    "explEn": "Religious or sacred practices appear across virtually all known human cultures; Scripture explains this as God's own imprint on the human heart, not accident or mere superstition.",
    "explEs": "Prácticas religiosas o sagradas aparecen en prácticamente todas las culturas humanas conocidas; la Escritura explica esto como la huella de Dios mismo en el corazón humano, no un accidente ni mera superstición."
  },
  {
    "textEn": "2. In Acts 17:16, Luke tells us Paul's spirit was provoked because Athens was:",
    "textEs": "2. En Hechos 17:16, Lucas nos dice que el espíritu de Pablo se enardecía porque Atenas estaba:",
    "optionsEn": [
      "Under Roman military occupation",
      "Given over to idols",
      "Suffering from famine",
      "Divided by civil war"
    ],
    "optionsEs": [
      "Bajo ocupación militar romana",
      "Dada enteramente a la idolatría",
      "Sufriendo hambruna",
      "Dividida por guerra civil"
    ],
    "c": 29,
    "explEn": "Luke records that Paul's spirit was provoked within him because he saw the city was given over to idols.",
    "explEs": "Lucas registra que el espíritu de Pablo se enardecía dentro de él al ver la ciudad dada enteramente a la idolatría."
  },
  {
    "textEn": "3. Before Paul ever spoke at the Areopagus, what did he do first?",
    "textEs": "3. Antes de que Pablo hablara en el Areópago, ¿qué hizo primero?",
    "optionsEn": [
      "Demanded the city repent immediately",
      "Refused to enter any pagan temple",
      "Walked the city and carefully observed their objects of worship",
      "Left Athens in protest"
    ],
    "optionsEs": [
      "Exigió que la ciudad se arrepintiera de inmediato",
      "Se negó a entrar en cualquier templo pagano",
      "Caminó por la ciudad y observó con cuidado sus objetos de adoración",
      "Salió de Atenas en protesta"
    ],
    "c": 37,
    "explEn": "Paul walked the city, carefully observed the objects of worship, and even read their inscriptions and quoted their poets before he ever spoke.",
    "explEs": "Pablo caminó por la ciudad, observó con cuidado los objetos de adoración, e incluso leyó sus inscripciones y citó a sus poetas antes de hablar."
  },
  {
    "textEn": "4. The altar Paul noticed in Athens was inscribed:",
    "textEs": "4. El altar que Pablo notó en Atenas estaba inscrito:",
    "optionsEn": [
      "To Zeus, father of the gods",
      "To the goddess Athena",
      "To Caesar",
      "To the unknown god"
    ],
    "optionsEs": [
      "A Zeus, padre de los dioses",
      "A la diosa Atenea",
      "Al César",
      "Al dios no conocido"
    ],
    "c": 45,
    "explEn": "Paul found an altar inscribed 'TO THE UNKNOWN GOD' and used it as his opening bridge to proclaim the true God.",
    "explEs": "Pablo halló un altar inscrito 'AL DIOS NO CONOCIDO' y lo usó como su puente inicial para proclamar al Dios verdadero."
  },
  {
    "textEn": "5. Paul's opening line, 'I perceived that in all things you are very religious,' functioned as:",
    "textEs": "5. La frase inicial de Pablo, 'Percibo que en todo sois muy religiosos,' funcionó como:",
    "optionsEn": [
      "A genuine bridge acknowledging their spiritual hunger",
      "A curse against the Athenians",
      "A sarcastic insult",
      "A formal legal accusation"
    ],
    "optionsEs": [
      "Un puente genuino que reconocía su hambre espiritual",
      "Una maldición contra los atenienses",
      "Un insulto sarcástico",
      "Una acusación legal formal"
    ],
    "c": 49,
    "explEn": "Paul's opening was a genuine acknowledgment of the Athenians' spiritual hunger, building a bridge before he proclaimed the true God.",
    "explEs": "La apertura de Pablo fue un reconocimiento genuino del hambre espiritual de los atenienses, construyendo un puente antes de proclamar al Dios verdadero."
  },
  {
    "textEn": "6. Which of the following was NOT part of Paul's method at the Areopagus?",
    "textEs": "6. ¿Cuál de las siguientes NO fue parte del método de Pablo en el Areópago?",
    "optionsEn": [
      "Careful observation before speaking",
      "Compromising the exclusivity of his conclusion",
      "Quoting the Athenians' own poets",
      "Building a bridge from common ground"
    ],
    "optionsEs": [
      "Observación cuidadosa antes de hablar",
      "Transigir la exclusividad de su conclusión",
      "Citar a los propios poetas de los atenienses",
      "Construir un puente desde el terreno común"
    ],
    "c": 57,
    "explEn": "Paul's method was respectful and informed, but his conclusion remained just as exclusive and urgent as any sermon he preached — he did not compromise it.",
    "explEs": "El método de Pablo fue respetuoso e informado, pero su conclusión siguió siendo tan exclusiva y urgente como cualquier sermón que predicó — no la transigió."
  },
  {
    "textEn": "7. The four comparison questions this course asks of every religion include all EXCEPT:",
    "textEs": "7. Las cuatro preguntas de comparación que este curso hace a cada religión incluyen todas EXCEPTO:",
    "optionsEn": [
      "What is ultimate reality?",
      "What is the fundamental human problem?",
      "Which nation founded this religion?",
      "What is the ultimate destiny of a human life?"
    ],
    "optionsEs": [
      "¿Qué es la realidad última?",
      "¿Cuál es el problema humano fundamental?",
      "¿Qué nación fundó esta religión?",
      "¿Cuál es el destino último de una vida humana?"
    ],
    "c": 65,
    "explEn": "The four framework questions are ultimate reality, the human problem, the path out of that problem, and ultimate destiny — not national origin.",
    "explEs": "Las cuatro preguntas del marco son la realidad última, el problema humano, el camino para salir de ese problema, y el destino último — no el origen nacional."
  },
  {
    "textEn": "8. According to John 14:6, cited in this unit, Jesus said:",
    "textEs": "8. Según Juan 14:6, citado en esta unidad, Jesús dijo:",
    "optionsEn": [
      "All roads lead to God",
      "I am one way among many",
      "No one can know the Father",
      "I am the way, the truth, and the life"
    ],
    "optionsEs": [
      "Todos los caminos llevan a Dios",
      "Soy un camino entre muchos",
      "Nadie puede conocer al Padre",
      "Yo soy el camino, y la verdad, y la vida"
    ],
    "c": 73,
    "explEn": "Jesus declared, 'I am the way, the truth, and the life; no one comes to the Father except through Me' (John 14:6).",
    "explEs": "Jesús declaró: 'Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí' (Juan 14:6)."
  },
  {
    "textEn": "9. Exclusivism, as defined in this unit, holds that:",
    "textEs": "9. El exclusivismo, según se define en esta unidad, sostiene que:",
    "optionsEn": [
      "Explicit faith in Christ is necessary for salvation",
      "Many paths lead equally to God",
      "General revelation alone is sufficient to save",
      "No religion contains any truth"
    ],
    "optionsEs": [
      "La fe explícita en Cristo es necesaria para la salvación",
      "Muchos caminos llevan por igual a Dios",
      "La revelación general por sí sola es suficiente para salvar",
      "Ninguna religión contiene verdad alguna"
    ],
    "c": 77,
    "explEn": "Exclusivism holds that explicit faith in Jesus Christ is necessary for salvation, and that general revelation, while real, is not sufficient to save.",
    "explEs": "El exclusivismo sostiene que la fe explícita en Jesucristo es necesaria para la salvación, y que la revelación general, aunque real, no es suficiente para salvar."
  },
  {
    "textEn": "10. Inclusivism, as defined in this unit, holds that:",
    "textEs": "10. El inclusivismo, según se define en esta unidad, sostiene que:",
    "optionsEn": [
      "All religions are equally valid paths to God",
      "Christ's atoning work is the only ground of salvation, but its benefits may be applied to some who respond in faith to the light they have",
      "Salvation requires no knowledge of any deity",
      "Only baptized Christians can be saved"
    ],
    "optionsEs": [
      "Todas las religiones son caminos igualmente válidos a Dios",
      "La obra expiatoria de Cristo es el único fundamento de la salvación, pero sus beneficios pueden aplicarse a algunos que responden con fe a la luz que tienen",
      "La salvación no requiere conocimiento de ninguna deidad",
      "Solo los cristianos bautizados pueden salvarse"
    ],
    "c": 85,
    "explEn": "Inclusivism holds that Christ's atoning work remains the only ground of salvation, while allowing that God may apply its benefits to some who respond in faith to the light they have.",
    "explEs": "El inclusivismo sostiene que la obra expiatoria de Cristo sigue siendo el único fundamento de la salvación, permitiendo que Dios aplique sus beneficios a algunos que responden con fe a la luz que tienen."
  },
  {
    "textEn": "11. This course treats religious pluralism (the view that many paths lead equally to God) as:",
    "textEs": "11. Este curso trata el pluralismo religioso (la postura de que muchos caminos llevan por igual a Dios) como:",
    "optionsEn": [
      "The preferred position of this seminary",
      "Equally valid alongside exclusivism",
      "Not a live option for a Christian minister, given passages like John 14:6 and Acts 4:12",
      "A topic never addressed in Scripture"
    ],
    "optionsEs": [
      "La postura preferida de este seminario",
      "Igualmente válido junto al exclusivismo",
      "No una opción viable para un ministro cristiano, dados pasajes como Juan 14:6 y Hechos 4:12",
      "Un tema que la Escritura nunca aborda"
    ],
    "c": 93,
    "explEn": "Pluralism runs directly against passages like John 14:6 and Acts 4:12, and this course does not treat it as a live option for a Christian minister.",
    "explEs": "El pluralismo choca directamente con pasajes como Juan 14:6 y Hechos 4:12, y este curso no lo trata como una opción viable para un ministro cristiano."
  },
  {
    "textEn": "12. In Cuba, decades of official atheism had the effect of:",
    "textEs": "12. En Cuba, décadas de ateísmo oficial tuvieron el efecto de:",
    "optionsEn": [
      "Eliminating religion entirely",
      "Converting the whole population to state atheism",
      "Ending all Afro-Cuban traditions",
      "Driving much religious practice underground, deeply woven into daily life"
    ],
    "optionsEs": [
      "Eliminar la religión por completo",
      "Convertir a toda la población al ateísmo estatal",
      "Terminar con todas las tradiciones afrocubanas",
      "Empujar gran parte de la práctica religiosa a la clandestinidad, profundamente entretejida en la vida diaria"
    ],
    "c": 101,
    "explEn": "Official atheism in Cuba did not eliminate religion; it drove much of it underground, leaving Santería, Espiritismo, and other traditions deeply woven into daily life.",
    "explEs": "El ateísmo oficial en Cuba no eliminó la religión; empujó gran parte de ella a la clandestinidad, dejando a la Santería, el Espiritismo y otras tradiciones profundamente entretejidas en la vida diaria."
  },
  {
    "textEn": "13. In Mexico, centuries of blending indigenous tradition with Catholic practice produced:",
    "textEs": "13. En México, siglos de mezcla entre la tradición indígena y la práctica católica produjeron:",
    "optionsEn": [
      "Forms of folk religion such as the veneration of Santa Muerte and the ministry of the curandero",
      "The complete disappearance of indigenous belief",
      "A purely Roman Catholic culture with no folk elements",
      "An official state religion"
    ],
    "optionsEs": [
      "Formas de religiosidad popular como la veneración de la Santa Muerte y el ministerio del curandero",
      "La desaparición completa de la creencia indígena",
      "Una cultura puramente católica romana sin elementos populares",
      "Una religión estatal oficial"
    ],
    "c": 105,
    "explEn": "Indigenous traditions blended with Catholic practice in Mexico to produce forms of folk religion, including veneration of Santa Muerte and the ministry of the curandero or curandera.",
    "explEs": "Las tradiciones indígenas se mezclaron con la práctica católica en México para producir formas de religiosidad popular, incluyendo la veneración de la Santa Muerte y el ministerio del curandero o curandera."
  },
  {
    "textEn": "14. This unit warns that a pastor who cannot name the spiritual condition in front of him will likely:",
    "textEs": "14. Esta unidad advierte que un pastor que no puede nombrar la condición espiritual frente a él probablemente:",
    "optionsEn": [
      "Automatically succeed in ministry anyway",
      "Misdiagnose it, and a misdiagnosed condition rarely heals",
      "Need no further theological training",
      "Should avoid the congregation entirely"
    ],
    "optionsEs": [
      "Tendrá éxito automáticamente en el ministerio de todos modos",
      "La diagnosticará mal, y una condición mal diagnosticada rara vez sana",
      "No necesitará más formación teológica",
      "Debería evitar por completo a la congregación"
    ],
    "c": 113,
    "explEn": "A pastor who cannot name what he is looking at will misdiagnose it, and a misdiagnosed spiritual condition rarely heals.",
    "explEs": "Un pastor que no puede nombrar lo que está observando lo diagnosticará mal, y una condición espiritual mal diagnosticada rara vez sana."
  },
  {
    "textEn": "15. Romans 1:19-20 teaches that God's invisible attributes are:",
    "textEs": "15. Romanos 1:19-20 enseña que los atributos invisibles de Dios son:",
    "optionsEn": [
      "Completely hidden from all people",
      "Only knowable through Old Testament law",
      "Clearly seen, understood through the things that are made",
      "Irrelevant to non-Christians"
    ],
    "optionsEs": [
      "Completamente ocultos a todas las personas",
      "Solo conocibles por medio de la ley del Antiguo Testamento",
      "Claramente visibles, entendidas por medio de las cosas hechas",
      "Irrelevantes para los no cristianos"
    ],
    "c": 121,
    "explEn": "Romans 1:20 says God's invisible attributes are clearly seen, being understood through the things that are made.",
    "explEs": "Romanos 1:20 dice que los atributos invisibles de Dios se hacen claramente visibles, siendo entendidos por medio de las cosas hechas."
  },
  {
    "textEn": "16. This course's overall posture toward other faiths, as stated in this unit, combines confidence in Christ's uniqueness with:",
    "textEs": "16. La postura general de este curso hacia otras religiones, según se declara en esta unidad, combina confianza en la singularidad de Cristo con:",
    "optionsEn": [
      "Contempt for all non-Christian belief",
      "Silence about doctrinal differences",
      "Agreement that all religions are equally true",
      "Respect for adherents and honesty about what they actually teach"
    ],
    "optionsEs": [
      "Desprecio por toda creencia no cristiana",
      "Silencio acerca de las diferencias doctrinales",
      "Acuerdo en que todas las religiones son igualmente verdaderas",
      "Respeto por los adherentes y honestidad acerca de lo que realmente enseñan"
    ],
    "c": 129,
    "explEn": "This course holds confidence in the uniqueness of Christ together with respect for those who hold other beliefs and honesty about what those beliefs actually teach.",
    "explEs": "Este curso sostiene confianza en la singularidad de Cristo junto con respeto por quienes sostienen otras creencias y honestidad acerca de lo que esas creencias realmente enseñan."
  },
  {
    "textEn": "17. According to Acts 17:27, God fixed the times and boundaries of the nations so that they would:",
    "textEs": "17. Según Hechos 17:27, Dios fijó los tiempos y límites de las naciones para que:",
    "optionsEn": [
      "Seek God, though He is not far from each one of us",
      "Remain permanently separated from Him",
      "Compete for territory",
      "Never learn of His existence"
    ],
    "optionsEs": [
      "Buscaran a Dios, aunque ciertamente no está lejos de cada uno de nosotros",
      "Permanecieran separadas de Él para siempre",
      "Compitieran por territorio",
      "Nunca conocieran Su existencia"
    ],
    "c": 133,
    "explEn": "Acts 17:27 says God did this so that people would seek Him, though He is not far from each one of us.",
    "explEs": "Hechos 17:27 dice que Dios hizo esto para que buscaran a Dios, aunque ciertamente no está lejos de cada uno de nosotros."
  },
  {
    "textEn": "18. The final unit of this course will treat which topic more fully?",
    "textEs": "18. ¿Qué tema tratará con más profundidad la unidad final de este curso?",
    "optionsEn": [
      "The history of the Athenian Areopagus",
      "The exclusivism-inclusivism debate itself",
      "The geography of ancient Greece",
      "The biography of the Apostle Paul"
    ],
    "optionsEs": [
      "La historia del Areópago ateniense",
      "El debate mismo entre exclusivismo e inclusivismo",
      "La geografía de la Grecia antigua",
      "La biografía del apóstol Pablo"
    ],
    "c": 141,
    "explEn": "This unit notes that faithful pastors have disagreed on the finer points of the exclusivism-inclusivism debate, and that the course's final unit will treat the debate itself more fully.",
    "explEs": "Esta unidad señala que pastores fieles han discrepado sobre los matices del debate entre exclusivismo e inclusivismo, y que la unidad final del curso tratará el debate mismo con más profundidad."
  },
  {
    "textEn": "19. This unit states that ignorance of what other faiths actually teach is:",
    "textEs": "19. Esta unidad declara que la ignorancia de lo que otras religiones realmente enseñan es:",
    "optionsEn": [
      "A form of true humility",
      "Required for sound doctrine",
      "Simply ignorance, and it makes for bad shepherding",
      "Irrelevant to pastoral ministry"
    ],
    "optionsEs": [
      "Una forma de verdadera humildad",
      "Requerida para la sana doctrina",
      "Simplemente ignorancia, y produce mal pastoreo",
      "Irrelevante para el ministerio pastoral"
    ],
    "c": 149,
    "explEn": "The unit states plainly that ignorance is not humility — it is simply ignorance, and it makes for bad shepherding.",
    "explEs": "La unidad declara claramente que la ignorancia no es humildad — es simplemente ignorancia, y produce mal pastoreo."
  },
  {
    "textEn": `20. Which best summarizes the purpose of this course, according to Unit ${UNIT}?`,
    "textEs": `20. ¿Cuál resume mejor el propósito de este curso, según la Unidad ${UNIT}?`,
    "optionsEn": [
      "To prove all religions teach the same truth",
      "To replace the study of Scripture with world religions",
      "To avoid ever discussing non-Christian belief",
      "To equip pastors to understand other faiths accurately so they can love their neighbors and proclaim Christ, as Paul did at the Areopagus"
    ],
    "optionsEs": [
      "Demostrar que todas las religiones enseñan la misma verdad",
      "Reemplazar el estudio de la Escritura con las religiones del mundo",
      "Evitar siempre discutir la creencia no cristiana",
      "Equipar a los pastores para entender con precisión otras religiones para que puedan amar a su prójimo y proclamar a Cristo, como Pablo lo hizo en el Areópago"
    ],
    "c": 157,
    "explEn": "This course exists to prepare pastors to understand other faiths accurately, following Paul's Areopagus model, so they can love their neighbors well and proclaim Christ.",
    "explEs": "Este curso existe para preparar a los pastores a entender con precisión otras religiones, siguiendo el modelo de Pablo en el Areópago, para que puedan amar bien a su prójimo y proclamar a Cristo."
  }
];

const kwQuestions = [
  {
    "textEn": "21. Why does Ecclesiastes 3:11 and Romans 1:19-20 suggest that the universal religious impulse is not merely a cultural accident?",
    "textEs": "21. ¿Por qué sugieren Eclesiastés 3:11 y Romanos 1:19-20 que el impulso religioso universal no es meramente un accidente cultural?",
    "kw_en": [
      "eternity",
      "heart",
      "creator",
      "signature",
      "invisible",
      "attribute",
      "clearly",
      "romans"
    ],
    "kw_es": [
      "eternidad",
      "corazón",
      "creador",
      "firma",
      "invisible",
      "atributo",
      "claramente",
      "romanos"
    ],
    "modelEn": "Ecclesiastes 3:11 says God has put eternity in the human heart, and Romans 1:19-20 says God's invisible attributes are clearly seen through creation. Together these passages teach that the universal human impulse to worship is not an accident of culture but a signature the Creator has left on every human heart. Religious or sacred practices appear across virtually all known human cultures, because every person carries this built-in awareness of something greater than themselves, however that awareness later becomes distorted.",
    "modelEs": "Eclesiastés 3:11 dice que Dios ha puesto eternidad en el corazón humano, y Romanos 1:19-20 dice que los atributos invisibles de Dios se hacen claramente visibles por medio de la creación. Juntos estos pasajes enseñan que el impulso humano universal de adorar no es un accidente cultural sino una firma que el Creador ha dejado en cada corazón humano. Prácticas religiosas o sagradas aparecen en prácticamente todas las culturas humanas conocidas, porque cada persona lleva esta conciencia incorporada de algo más grande que sí misma, por más que esa conciencia luego se distorsione."
  },
  {
    "textEn": "22. Describe Paul's method at the Areopagus in Acts 17, and explain why his approach matters for how we study other religions today.",
    "textEs": "22. Describa el método de Pablo en el Areópago en Hechos 17, y explique por qué su enfoque importa para cómo estudiamos otras religiones hoy.",
    "kw_en": [
      "observe",
      "athens",
      "idol",
      "bridge",
      "poet",
      "respect",
      "proclaim",
      "areopagus"
    ],
    "kw_es": [
      "observ",
      "atenas",
      "idolatría",
      "puente",
      "poeta",
      "respet",
      "proclam",
      "areópago"
    ],
    "modelEn": "At the Areopagus, Paul first walked Athens and carefully observed the objects of worship, even reading their inscriptions and quoting their own poets by name, before he ever spoke. When he did speak, he built a bridge by acknowledging their genuine spiritual hunger before moving to proclaim the true God and call for repentance. This matters for us today because it shows that respectful, informed observation is not compromise; Paul's conclusion remained fully exclusive even though his method was relational and patient. Studying other religions carefully, as this course asks, follows Paul's own pattern rather than departing from it.",
    "modelEs": "En el Areópago, Pablo primero caminó por Atenas y observó con cuidado los objetos de adoración, incluso leyendo sus inscripciones y citando a sus propios poetas por nombre, antes de hablar. Cuando habló, construyó un puente reconociendo su genuina hambre espiritual antes de avanzar a proclamar al Dios verdadero y llamar al arrepentimiento. Esto importa para nosotros hoy porque muestra que la observación respetuosa e informada no es transigencia; la conclusión de Pablo siguió siendo totalmente exclusiva aunque su método fue relacional y paciente. Estudiar otras religiones con cuidado, como pide este curso, sigue el propio patrón de Pablo en lugar de apartarse de él."
  },
  {
    "textEn": "23. List the four comparison questions this course asks of every religion, and explain why they are useful.",
    "textEs": "23. Enumere las cuatro preguntas de comparación que este curso hace a cada religión, y explique por qué son útiles.",
    "kw_en": [
      "ultimate",
      "reality",
      "problem",
      "path",
      "destiny",
      "framework",
      "compare",
      "clarity"
    ],
    "kw_es": [
      "última",
      "realidad",
      "problema",
      "camino",
      "destino",
      "marco",
      "compar",
      "claridad"
    ],
    "modelEn": "The four framework questions are: what is ultimate reality, what is the fundamental human problem, what is the path out of that problem, and what is the ultimate destiny of a human life. They are useful because asking the same four questions of every religion we study keeps us from getting lost in details and lets us see clearly where each system agrees with the biblical picture, where it borrows a true instinct but distorts it, and where it departs entirely. This clarity is what makes a pastor useful in an actual conversation rather than merely informed.",
    "modelEs": "Las cuatro preguntas del marco son: qué es la realidad última, cuál es el problema humano fundamental, cuál es el camino para salir de ese problema, y cuál es el destino último de una vida humana. Son útiles porque hacer las mismas cuatro preguntas a cada religión que estudiamos nos evita perdernos en los detalles y nos permite ver con claridad dónde cada sistema concuerda con el cuadro bíblico, dónde toma prestado un instinto verdadero pero lo distorsiona, y dónde se aparta por completo. Esta claridad es lo que hace útil a un pastor en una conversación real y no meramente informado."
  },
  {
    "textEn": "24. Distinguish exclusivism, inclusivism, and pluralism as defined in this unit. Which does this course treat as a live option, and why?",
    "textEs": "24. Distinga el exclusivismo, el inclusivismo y el pluralismo según se definen en esta unidad. ¿Cuál trata este curso como una opción viable, y por qué?",
    "kw_en": [
      "exclusiv",
      "inclusiv",
      "plural",
      "explicit",
      "atone",
      "general",
      "revelation",
      "john"
    ],
    "kw_es": [
      "exclusiv",
      "inclusiv",
      "plural",
      "explícit",
      "expiator",
      "general",
      "revelación",
      "juan"
    ],
    "modelEn": "Exclusivism holds that explicit faith in Christ is necessary for salvation and that general revelation alone is not sufficient. Inclusivism holds that Christ's atoning work remains the only ground of salvation, but allows that its benefits may be applied to some who respond in faith to the light they have without explicit knowledge of Christ. Pluralism holds that many paths lead equally to God. This course does not treat pluralism as a live option for a Christian minister, because it runs directly against passages like John 14:6 and Acts 4:12; the course does allow that faithful pastors have long debated the finer points between exclusivism and inclusivism.",
    "modelEs": "El exclusivismo sostiene que la fe explícita en Cristo es necesaria para la salvación y que la revelación general por sí sola no es suficiente. El inclusivismo sostiene que la obra expiatoria de Cristo sigue siendo el único fundamento de la salvación, pero permite que sus beneficios se apliquen a algunos que responden con fe a la luz que tienen sin conocimiento explícito de Cristo. El pluralismo sostiene que muchos caminos llevan por igual a Dios. Este curso no trata el pluralismo como una opción viable para un ministro cristiano, porque choca directamente con pasajes como Juan 14:6 y Hechos 4:12; el curso sí permite que pastores fieles hayan debatido durante mucho tiempo los matices entre exclusivismo e inclusivismo."
  },
  {
    "textEn": "25. Explain how decades of official atheism in Cuba actually affected religious practice, according to this unit.",
    "textEs": "25. Explique cómo décadas de ateísmo oficial en Cuba realmente afectaron la práctica religiosa, según esta unidad.",
    "kw_en": [
      "atheism",
      "underground",
      "santería",
      "espiritismo",
      "daily",
      "nominal",
      "woven",
      "cuba"
    ],
    "kw_es": [
      "ateísmo",
      "clandestin",
      "santería",
      "espiritismo",
      "diaria",
      "nominal",
      "entretej",
      "cuba"
    ],
    "modelEn": "According to this unit, decades of official atheism in Cuba did not eliminate religion; instead it drove much religious practice underground, leaving Santería, Espiritismo, and other Afro-Cuban traditions deeply woven into daily life. This often happens alongside a nominal Catholic or even evangelical identity, meaning a pastor may find these practices present in his own congregation even when they are not openly discussed.",
    "modelEs": "Según esta unidad, décadas de ateísmo oficial en Cuba no eliminaron la religión; en cambio, empujaron gran parte de la práctica religiosa a la clandestinidad, dejando a la Santería, el Espiritismo y otras tradiciones afrocubanas profundamente entretejidas en la vida diaria. Esto ocurre a menudo junto a una identidad católica nominal o incluso evangélica, lo que significa que un pastor puede encontrar estas prácticas presentes en su propia congregación aunque no se discutan abiertamente."
  },
  {
    "textEn": "26. Describe the kind of folk religion this unit says a pastor is likely to encounter in Mexico, and name two specific examples given.",
    "textEs": "26. Describa el tipo de religiosidad popular que esta unidad dice que un pastor probablemente encontrará en México, y nombre dos ejemplos específicos que se dan.",
    "kw_en": [
      "indigenous",
      "catholic",
      "blend",
      "santa muerte",
      "curandero",
      "syncret",
      "folk",
      "century"
    ],
    "kw_es": [
      "indígena",
      "católic",
      "mezcl",
      "santa muerte",
      "curandero",
      "sincrét",
      "popular",
      "siglo"
    ],
    "modelEn": "This unit describes how, in Mexico, indigenous traditions blended centuries ago with Catholic practice to produce forms of folk religion. Two specific examples given are the veneration of Santa Muerte and the ministry of the curandero or curandera, along with syncretistic festivals that combine indigenous and Catholic elements. A pastor is likely to meet these traditions in nearly every congregation, whether openly discussed or not.",
    "modelEs": "Esta unidad describe cómo, en México, las tradiciones indígenas se mezclaron hace siglos con la práctica católica para producir formas de religiosidad popular. Dos ejemplos específicos que se dan son la veneración de la Santa Muerte y el ministerio del curandero o la curandera, junto con festivales sincréticos que combinan elementos indígenas y católicos. Un pastor probablemente encontrará estas tradiciones en casi toda congregación, se hable abiertamente de ello o no."
  },
  {
    "textEn": "27. Why does this unit insist that studying world religions is not the same as teaching that all religions are equally true?",
    "textEs": "27. ¿Por qué insiste esta unidad en que estudiar las religiones del mundo no es lo mismo que enseñar que todas las religiones son igualmente verdaderas?",
    "kw_en": [
      "relativism",
      "instinct",
      "true",
      "distort",
      "unique",
      "christ",
      "nation",
      "wander"
    ],
    "kw_es": [
      "relativismo",
      "instinto",
      "verdad",
      "distorsion",
      "único",
      "cristo",
      "nación",
      "extravi"
    ],
    "modelEn": "This unit insists that a course in world religions is not a course in relativism. It explains that every religion began with a true instinct — that there is something greater than ourselves — but that what differs enormously is what that something is understood to be and what is owed to it. Studying these systems seriously, as Paul did with the nations groping in the dark, means taking their true instincts seriously without conceding that they are equally true; the uniqueness of Christ remains central throughout the course.",
    "modelEs": "Esta unidad insiste en que un curso de religiones del mundo no es un curso de relativismo. Explica que toda religión comenzó con un instinto verdadero — que hay algo más grande que nosotros mismos — pero que lo que difiere enormemente es lo que se entiende que es ese algo y lo que se le debe. Estudiar estos sistemas en serio, como Pablo lo hizo con las naciones a tientas en la oscuridad, significa tomar en serio sus instintos verdaderos sin conceder que sean igualmente verdaderos; la singularidad de Cristo permanece central a lo largo del curso."
  },
  {
    "textEn": "28. What does this unit mean when it says a pastor who cannot name a spiritual condition will 'misdiagnose' it? Give a pastoral application.",
    "textEs": "28. ¿Qué quiere decir esta unidad cuando afirma que un pastor que no puede nombrar una condición espiritual la 'diagnosticará mal'? Dé una aplicación pastoral.",
    "kw_en": [
      "misdiagnose",
      "heal",
      "name",
      "context",
      "shepherd",
      "condition",
      "congregation",
      "understand"
    ],
    "kw_es": [
      "diagnos",
      "san",
      "nombr",
      "contexto",
      "pastor",
      "condición",
      "congregación",
      "entend"
    ],
    "modelEn": "This unit means that spiritual conditions, like medical ones, must be correctly identified before they can be addressed; a pastor who does not understand what he is looking at — whether Santería, Espiritismo, or folk Catholic syncretism — will misdiagnose it, and a misdiagnosed spiritual condition rarely heals. A pastoral application is that a pastor should learn to recognize the specific beliefs and practices present in his own congregation's context rather than responding with vague generalities, so that his counsel and preaching actually address what people are struggling with.",
    "modelEs": "Esta unidad quiere decir que las condiciones espirituales, como las médicas, deben identificarse correctamente antes de poder abordarse; un pastor que no entiende lo que está observando — sea Santería, Espiritismo, o sincretismo popular católico — lo diagnosticará mal, y una condición espiritual mal diagnosticada rara vez sana. Una aplicación pastoral es que el pastor debe aprender a reconocer las creencias y prácticas específicas presentes en el contexto de su propia congregación en lugar de responder con generalidades vagas, para que su consejo y predicación realmente aborden aquello con lo que la gente lucha."
  },
  {
    "textEn": "29. According to this unit, what combination of attitudes should mark a Christian's engagement with people of other faiths?",
    "textEs": "29. Según esta unidad, ¿qué combinación de actitudes debe marcar el acercamiento de un cristiano hacia personas de otras religiones?",
    "kw_en": [
      "confidence",
      "uniqueness",
      "respect",
      "honest",
      "adherent",
      "teach",
      "love",
      "neighbor"
    ],
    "kw_es": [
      "confianza",
      "singularidad",
      "respet",
      "honest",
      "adherente",
      "enseñ",
      "amor",
      "prójimo"
    ],
    "modelEn": "This unit teaches that every unit in the course holds three things in common: confidence in the uniqueness of Christ, respect for the people who hold other beliefs, and honesty about what those beliefs actually teach. This combination reflects the command to love our neighbor, which requires understanding what he actually believes before speaking to him about Christ, following Paul's own pattern at the Areopagus rather than either contemptuous dismissal or vague relativism.",
    "modelEs": "Esta unidad enseña que toda unidad del curso tiene tres cosas en común: confianza en la singularidad de Cristo, respeto por las personas que sostienen otras creencias, y honestidad acerca de lo que esas creencias realmente enseñan. Esta combinación refleja el mandamiento de amar al prójimo, que exige entender lo que realmente cree antes de hablarle de Cristo, siguiendo el propio patrón de Pablo en el Areópago en lugar de un descarte despectivo o un relativismo vago."
  },
  {
    "textEn": "30. Synthesize this unit: why does the author believe a course like this one is essential preparation for pastors serving in Cuba and Mexico specifically?",
    "textEs": "30. Sintetice esta unidad: ¿por qué cree el autor que un curso como este es preparación esencial para los pastores que sirven específicamente en Cuba y México?",
    "kw_en": [
      "context",
      "encounter",
      "santería",
      "curandero",
      "misdiagnose",
      "areopagus",
      "core",
      "ministry"
    ],
    "kw_es": [
      "contexto",
      "encuentr",
      "santería",
      "curandero",
      "diagnos",
      "areópago",
      "central",
      "ministerio"
    ],
    "modelEn": "The author believes this course is essential because it is not an abstract academic exercise but a direct response to what pastors in Cuba and Mexico actually encounter in their congregations — Santería and Espiritismo woven into daily life in Cuba, and folk traditions like Santa Muerte veneration and curanderismo in Mexico. Following Paul's Areopagus model of careful, respectful observation before proclamation, this course gives these specific traditions core attention rather than treating them as a footnote, so that pastors can correctly name what they encounter, avoid misdiagnosis, and shepherd their people toward Christ with both accuracy and love.",
    "modelEs": "El autor cree que este curso es esencial porque no es un ejercicio académico abstracto sino una respuesta directa a lo que los pastores en Cuba y México realmente encuentran en sus congregaciones — la Santería y el Espiritismo entretejidos en la vida diaria en Cuba, y tradiciones populares como la veneración de la Santa Muerte y el curanderismo en México. Siguiendo el modelo de Pablo en el Areópago de observación cuidadosa y respetuosa antes de proclamar, este curso da a estas tradiciones específicas atención central en lugar de tratarlas como una nota al pie, para que los pastores puedan nombrar correctamente lo que encuentran, evitar el mal diagnóstico, y pastorear a su gente hacia Cristo con precisión y amor a la vez."
  }
];

const PREV_HREF = null;

const NEXT_HREF = 'CTSWRUnit2.html';
