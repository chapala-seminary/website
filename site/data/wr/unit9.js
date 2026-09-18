/* CTSWR - unit 9: per-unit configuration and content. */

const UNIT = 9;

let currentUnit = 9;

const mcQuestions = [
  {
    "textEn": "1. This unit uses which four-question framework, first introduced in Unit 1, to compare traditions?",
    "textEs": "1. ¿Qué marco de cuatro preguntas, introducido por primera vez en la Unidad 1, usa esta unidad para comparar tradiciones?",
    "optionsEn": [
      "Ultimate reality, human problem, path, and ultimate destiny",
      "Founder, scripture, ritual, and geography",
      "Population size, wealth, age, and language",
      "Government structure, holidays, food, and dress"
    ],
    "optionsEs": [
      "Realidad última, problema humano, camino, y destino último",
      "Fundador, escritura, ritual, y geografía",
      "Tamaño de población, riqueza, edad, e idioma",
      "Estructura de gobierno, festividades, comida, y vestimenta"
    ],
    "c": 21,
    "explEn": "This unit uses the four-question framework from Unit 1: what is ultimate reality, the human problem, the path out of it, and the ultimate destiny of a human life.",
    "explEs": "Esta unidad usa el marco de cuatro preguntas de la Unidad 1: qué es la realidad última, el problema humano, el camino para salir de él, y el destino último de una vida humana."
  },
  {
    "textEn": "2. According to this unit, comparing traditions fairly is NOT the same as:",
    "textEs": "2. Según esta unidad, comparar las tradiciones con justicia NO es lo mismo que:",
    "optionsEn": [
      "Understanding what each tradition actually teaches",
      "Relativism, treating all answers as equally weighted",
      "Reading Scripture carefully",
      "Honoring genuine insight where it appears"
    ],
    "optionsEs": [
      "Entender lo que cada tradición realmente enseña",
      "El relativismo, tratar todas las respuestas como igualmente ponderadas",
      "Leer la Escritura con cuidado",
      "Honrar la intuición genuina donde aparece"
    ],
    "c": 29,
    "explEn": "This unit insists comparison is not relativism; asking the same four questions does not presuppose all answers carry equal weight.",
    "explEs": "Esta unidad insiste en que la comparación no es relativismo; hacer las mismas cuatro preguntas no presupone que todas las respuestas lleven el mismo peso."
  },
  {
    "textEn": "3. According to this unit, Judaism, Islam, and Sikhism share which view of ultimate reality with biblical Christianity?",
    "textEs": "3. Según esta unidad, ¿qué visión de la realidad última comparten el judaísmo, el islam, y el sijismo con el cristianismo bíblico?",
    "optionsEn": [
      "An impersonal ultimate reality",
      "No god at all",
      "A personal, single, transcendent God who speaks and acts in history",
      "Many equally powerful gods"
    ],
    "optionsEs": [
      "Una realidad última impersonal",
      "Ningún dios en absoluto",
      "Un Dios personal, único, y trascendente que habla y actúa en la historia",
      "Muchos dioses igualmente poderosos"
    ],
    "c": 37,
    "explEn": "Judaism, Islam, Sikhism, and biblical Christianity affirm a personal, single, transcendent God who speaks, wills, and acts in history.",
    "explEs": "El judaísmo, el islam, el sijismo, y el cristianismo bíblico afirman un Dios personal, único, y trascendente que habla, quiere, y actúa en la historia."
  },
  {
    "textEn": "4. According to this unit, classical Buddhism is distinctive among every tradition studied because it:",
    "textEs": "4. Según esta unidad, el budismo clásico es distintivo entre cada tradición estudiada porque:",
    "optionsEn": [
      "Affirms a personal Creator God clearly",
      "Worships thirty-three million gods literally",
      "Was founded in direct response to Christianity",
      "Largely declines to settle the question of ultimate reality at all"
    ],
    "optionsEs": [
      "Afirma claramente a un Dios Creador personal",
      "Adora literalmente a treinta y tres millones de dioses",
      "Fue fundado en respuesta directa al cristianismo",
      "En gran medida declina resolver la pregunta de la realidad última en absoluto"
    ],
    "c": 45,
    "explEn": "Classical Buddhism largely declines to settle the question of ultimate reality, treating it as a distraction from ending suffering.",
    "explEs": "El budismo clásico en gran medida declina resolver la pregunta de la realidad última, tratándola como una distracción de terminar el sufrimiento."
  },
  {
    "textEn": "5. According to Romans 1:19-21, cited in this unit, why do even traditions farthest from biblical revelation retain some trace of personal ultimate reality?",
    "textEs": "5. Según Romanos 1:19-21, citado en esta unidad, ¿por qué incluso las tradiciones más alejadas de la revelación bíblica conservan algún rastro de realidad última personal?",
    "optionsEn": [
      "Because what can be known of God is evident within every person through creation",
      "Because missionaries reached every culture equally",
      "Because all religions were originally identical",
      "Because of random cultural coincidence only"
    ],
    "optionsEs": [
      "Porque lo que se puede conocer de Dios se manifiesta en cada persona a través de la creación",
      "Porque los misioneros alcanzaron cada cultura por igual",
      "Porque todas las religiones originalmente eran idénticas",
      "Solo por coincidencia cultural aleatoria"
    ],
    "c": 49,
    "explEn": "Romans 1:19-21 explains that what can be known of God is evident within every person, since God has shown it to them through creation itself.",
    "explEs": "Romanos 1:19-21 explica que lo que se puede conocer de Dios se manifiesta en cada persona, ya que Dios se lo ha manifestado a través de la creación misma."
  },
  {
    "textEn": "6. According to this unit, Scripture's diagnosis of the human problem is:",
    "textEs": "6. Según esta unidad, el diagnóstico de la Escritura del problema humano es:",
    "optionsEn": [
      "Ignorance of one's identity with an impersonal absolute",
      "Sin, rebellion against a holy, personal God incurring real guilt",
      "Simply bad luck from past lives",
      "Disordered social relationships alone"
    ],
    "optionsEs": [
      "Ignorancia de la propia identidad con un absoluto impersonal",
      "El pecado, rebelión contra un Dios santo y personal que incurre culpa real",
      "Simplemente mala suerte de vidas pasadas",
      "Relaciones sociales desordenadas solamente"
    ],
    "c": 57,
    "explEn": "Scripture's diagnosis is sin: rebellion against a holy, personal God, incurring real guilt only God Himself can remove.",
    "explEs": "El diagnóstico de la Escritura es el pecado: rebelión contra un Dios santo y personal, que incurre culpa real que solo Dios mismo puede quitar."
  },
  {
    "textEn": "7. According to this unit, how did rabbinic Judaism and Islam address the problem of guilt after losing or never receiving a substitutionary atonement doctrine?",
    "textEs": "7. Según esta unidad, ¿cómo abordaron el judaísmo rabínico y el islam el problema de la culpa después de perder o nunca recibir una doctrina de expiación sustitutoria?",
    "optionsEn": [
      "By denying guilt exists at all",
      "By adopting the Christian doctrine unchanged",
      "Through prayer, repentance, charity, submission, and uncertain mercy",
      "By requiring animal sacrifice permanently"
    ],
    "optionsEs": [
      "Negando que la culpa exista en absoluto",
      "Adoptando la doctrina cristiana sin cambios",
      "A través de la oración, el arrepentimiento, la caridad, la sumisión, y la misericordia incierta",
      "Requiriendo sacrificio animal permanentemente"
    ],
    "c": 65,
    "explEn": "Rabbinic Judaism developed prayer, repentance, and charity, and Islam developed submission, good deeds, and Allah's uncertain mercy, as alternative means of addressing guilt.",
    "explEs": "El judaísmo rabínico desarrolló la oración, el arrepentimiento, y la caridad, y el islam desarrolló la sumisión, las buenas obras, y la misericordia incierta de Alá, como medios alternativos para abordar la culpa."
  },
  {
    "textEn": "8. According to this unit, Hinduism and Buddhism relocate the human problem to:",
    "textEs": "8. Según esta unidad, el hinduismo y el budismo reubican el problema humano a:",
    "optionsEn": [
      "Guilt before a personal God",
      "Political oppression exclusively",
      "A curse placed by ancestors",
      "Ignorance, karma, and craving rather than guilt before a personal God"
    ],
    "optionsEs": [
      "Culpa delante de un Dios personal",
      "La opresión política exclusivamente",
      "Una maldición puesta por los ancestros",
      "La ignorancia, el karma, y el anhelo en lugar de la culpa delante de un Dios personal"
    ],
    "c": 73,
    "explEn": "Hinduism identifies the problem as ignorance and karma; Buddhism identifies it as tanha, craving; neither centers guilt before a personal God.",
    "explEs": "El hinduismo identifica el problema como ignorancia y karma; el budismo lo identifica como tanha, el anhelo; ninguno centra la culpa delante de un Dios personal."
  },
  {
    "textEn": "9. According to this unit, what does every tradition studied except Christianity ultimately locate the solution within?",
    "textEs": "9. Según esta unidad, ¿dentro de qué ubica en última instancia la solución cada tradición estudiada excepto el cristianismo?",
    "optionsEn": [
      "The practitioner's own effort",
      "A finished work outside the sinner",
      "Random chance",
      "Government intervention"
    ],
    "optionsEs": [
      "El propio esfuerzo del practicante",
      "Una obra terminada fuera del pecador",
      "El azar",
      "La intervención gubernamental"
    ],
    "c": 77,
    "explEn": "Every other tradition studied locates the ultimate solution within the practitioner's own effort — insight, karma, virtue, submission, or weighed deeds.",
    "explEs": "Cada otra tradición estudiada ubica la solución última dentro del propio esfuerzo del practicante — intuición, karma, virtud, sumisión, u obras pesadas."
  },
  {
    "textEn": "10. According to Romans 5:8, cited in this unit, when did Christ die for sinners?",
    "textEs": "10. Según Romanos 5:8, citado en esta unidad, ¿cuándo murió Cristo por los pecadores?",
    "optionsEn": [
      "Only after they achieved sufficient merit",
      "While they were still sinners",
      "Only for those who first performed rituals",
      "After a thousand lifetimes of purification"
    ],
    "optionsEs": [
      "Solo después de que lograran suficiente mérito",
      "Mientras todavía eran pecadores",
      "Solo por aquellos que primero realizaron rituales",
      "Después de mil vidas de purificación"
    ],
    "c": 85,
    "explEn": "Romans 5:8 says, 'while we were still sinners, Christ died for us,' a solution accomplished entirely outside the sinner's own effort.",
    "explEs": "Romanos 5:8 dice: 'siendo aún pecadores, Cristo murió por nosotros,' una solución lograda enteramente fuera del propio esfuerzo del pecador."
  },
  {
    "textEn": "11. According to this unit, what do Islam's Five Pillars, Sikhism's Five Ks, and Confucian ritual propriety share as approaches to 'the path'?",
    "textEs": "11. Según esta unidad, ¿qué comparten los Cinco Pilares del islam, las Cinco Kas del sijismo, y la propiedad ritual confuciana como enfoques hacia 'el camino'?",
    "optionsEn": [
      "They all require celibacy",
      "They reject any form of ritual entirely",
      "They offer concrete, disciplined practices to perform and repeat",
      "They are identical in every detail"
    ],
    "optionsEs": [
      "Todas requieren celibato",
      "Rechazan por completo cualquier forma de ritual",
      "Ofrecen prácticas concretas y disciplinadas para realizar y repetir",
      "Son idénticas en cada detalle"
    ],
    "c": 93,
    "explEn": "These paths supply concrete, disciplined practices a sincere adherent can perform, measure, and repeat, giving the anxious heart something definite to do.",
    "explEs": "Estos caminos suministran prácticas concretas y disciplinadas que un adherente sincero puede realizar, medir, y repetir, dándole al corazón ansioso algo definido que hacer."
  },
  {
    "textEn": "12. According to 1 John 5:13, cited in this unit, Scripture was written so that believers may:",
    "textEs": "12. Según 1 Juan 5:13, citado en esta unidad, la Escritura fue escrita para que los creyentes:",
    "optionsEn": [
      "Hope tentatively for eternal life",
      "Calculate their karma precisely",
      "Never be certain of salvation",
      "Know that they have eternal life"
    ],
    "optionsEs": [
      "Esperen tentativamente la vida eterna",
      "Calculen su karma con precisión",
      "Nunca estén seguros de la salvación",
      "Sepan que tienen vida eterna"
    ],
    "c": 101,
    "explEn": "1 John 5:13 states Scripture was written 'that you may know that you have eternal life' — settled certainty rather than tentative hope.",
    "explEs": "1 Juan 5:13 declara que la Escritura fue escrita 'para que sepáis que tenéis vida eterna' — certeza establecida en lugar de esperanza tentativa."
  },
  {
    "textEn": "13. According to this unit, what picture of ultimate destiny does Scripture teach, in contrast to nearly every other tradition studied?",
    "textEs": "13. Según esta unidad, ¿qué cuadro del destino último enseña la Escritura, en contraste con casi cualquier otra tradición estudiada?",
    "optionsEn": [
      "Bodily resurrection following a single, decisive, unrepeatable judgment",
      "An endless cycle of rebirth",
      "Complete extinction with no continuity",
      "Absorption into an impersonal whole"
    ],
    "optionsEs": [
      "La resurrección corporal siguiendo un juicio único, decisivo, e irrepetible",
      "Un ciclo interminable de renacimiento",
      "Extinción completa sin continuidad",
      "Absorción en un todo impersonal"
    ],
    "c": 105,
    "explEn": "Scripture teaches bodily resurrection and everlasting fellowship with God following a single, decisive, unrepeatable judgment, a linear history in sharp contrast to nearly every other tradition studied.",
    "explEs": "La Escritura enseña la resurrección corporal y la comunión eterna con Dios siguiendo un juicio único, decisivo, e irrepetible, una historia lineal en agudo contraste con casi cualquier otra tradición estudiada."
  },
  {
    "textEn": "14. According to this unit, why does classical Buddhism's nirvana pose a unique translation challenge compared to Hindu or Sikh liberation?",
    "textEs": "14. Según esta unidad, ¿por qué presenta el nirvana del budismo clásico un desafío de traducción único comparado con la liberación hindú o sij?",
    "optionsEn": [
      "Because nirvana is identical to the Christian concept of heaven",
      "Because Buddhism denies any permanent self persists to reach any destination",
      "Because Buddhism has no concept of liberation at all",
      "Because nirvana requires belief in a Creator God"
    ],
    "optionsEs": [
      "Porque el nirvana es idéntico al concepto cristiano de cielo",
      "Porque el budismo niega que persista ningún yo permanente para alcanzar algún destino",
      "Porque el budismo no tiene ningún concepto de liberación en absoluto",
      "Porque el nirvana requiere creencia en un Dios Creador"
    ],
    "c": 113,
    "explEn": "Because Buddhism denies any permanent self persists, nirvana cannot even be described as the self reaching a destination, unlike Hindu or Sikh liberation.",
    "explEs": "Debido a que el budismo niega que persista ningún yo permanente, el nirvana ni siquiera puede describirse como el yo alcanzando un destino, a diferencia de la liberación hindú o sij."
  },
  {
    "textEn": "15. According to this unit, Jehovah's Witness teaching on a restored paradise earth echoes the biblical hope of bodily existence more closely than Hindu or Buddhist categories, while denying:",
    "textEs": "15. Según esta unidad, la enseñanza de los Testigos de Jehová de una tierra paraíso restaurada hace eco de la esperanza bíblica de la existencia corporal más de cerca que las categorías hindúes o budistas, mientras niega:",
    "optionsEn": [
      "The existence of any afterlife",
      "Any form of resurrection whatsoever",
      "The full deity of the One who secures that hope",
      "The existence of the 144,000"
    ],
    "optionsEs": [
      "La existencia de cualquier vida después de la muerte",
      "Cualquier forma de resurrección",
      "La plena deidad de Aquel que asegura esa esperanza",
      "La existencia de los 144,000"
    ],
    "c": 121,
    "explEn": "Jehovah's Witnesses hope for bodily existence on a restored earth, echoing biblical hope, while denying the full deity of Christ who secures that hope.",
    "explEs": "Los Testigos de Jehová esperan la existencia corporal en una tierra restaurada, haciendo eco de la esperanza bíblica, mientras niegan la plena deidad de Cristo que asegura esa esperanza."
  },
  {
    "textEn": "16. According to 1 Corinthians 15:20, cited in this unit, Christ's resurrection is described as:",
    "textEs": "16. Según 1 Corintios 15:20, citado en esta unidad, la resurrección de Cristo se describe como:",
    "optionsEn": [
      "A story with no historical basis",
      "Identical to Hindu moksha",
      "Irrelevant to believers' own future",
      "The firstfruits of those who have fallen asleep"
    ],
    "optionsEs": [
      "Un relato sin base histórica",
      "Idéntica al moksha hindú",
      "Irrelevante para el futuro propio de los creyentes",
      "Primicias de los que durmieron"
    ],
    "c": 129,
    "explEn": "1 Corinthians 15:20 calls Christ's resurrection 'the firstfruits of those who have fallen asleep,' securing believers' own future bodily resurrection.",
    "explEs": "1 Corintios 15:20 llama a la resurrección de Cristo 'primicias de los que durmieron,' asegurando la propia futura resurrección corporal de los creyentes."
  },
  {
    "textEn": "17. According to this unit, three features of the biblical picture appear nowhere else across the entire survey. Which of the following is one of them?",
    "textEs": "17. Según esta unidad, tres características del cuadro bíblico no aparecen en ningún otro lugar a través de todo el estudio. ¿Cuál de las siguientes es una de ellas?",
    "optionsEn": [
      "Ultimate reality as both fully personal and fully transcendent",
      "A path requiring disciplined ritual practice",
      "Belief that actions have consequences",
      "A concern for ethical living"
    ],
    "optionsEs": [
      "La realidad última como plenamente personal y plenamente trascendente a la vez",
      "Un camino que requiere práctica ritual disciplinada",
      "La creencia de que las acciones tienen consecuencias",
      "Una preocupación por la vida ética"
    ],
    "c": 133,
    "explEn": "Only Scripture presents ultimate reality as both fully personal and fully transcendent, unlike Brahman, the Tao, or Buddhism's silence on the question.",
    "explEs": "Solo la Escritura presenta la realidad última como plenamente personal y plenamente trascendente a la vez, a diferencia de Brahman, el Tao, o el silencio del budismo sobre la pregunta."
  },
  {
    "textEn": "18. According to this unit, the comparative work of this unit does NOT flatten Christianity into:",
    "textEs": "18. Según esta unidad, el trabajo comparativo de esta unidad NO aplana al cristianismo en:",
    "optionsEn": [
      "A proclamation modeled on Paul at the Areopagus",
      "One spiritual option among many equally valid paths, the pluralism Unit 1 rejected",
      "A claim tested against Acts 4:12",
      "A conclusion reached through honest comparison"
    ],
    "optionsEs": [
      "Una proclamación modelada en Pablo en el Areópago",
      "Una opción espiritual más entre muchos caminos igualmente válidos, el pluralismo que la Unidad 1 rechazó",
      "Una afirmación probada contra Hechos 4:12",
      "Una conclusión alcanzada a través de una comparación honesta"
    ],
    "c": 141,
    "explEn": "This unit's comparative work does not flatten Christianity into one option among equally valid paths, the pluralism picture Unit 1 already identified as incompatible with Jesus's own teaching.",
    "explEs": "El trabajo comparativo de esta unidad no aplana al cristianismo en una opción entre muchos caminos igualmente válidos, el cuadro del pluralismo que la Unidad 1 ya identificó como incompatible con la propia enseñanza de Jesús."
  },
  {
    "textEn": "19. According to this unit's conclusion, what should a pastor who has done this comparative work honestly be equipped to do?",
    "textEs": "19. Según la conclusión de esta unidad, ¿qué debe estar equipado para hacer un pastor que ha hecho este trabajo comparativo con honestidad?",
    "optionsEn": [
      "Avoid ever discussing other religions again",
      "Declare all religions equally false",
      "Listen first, honor what is true, and proclaim Christ without apology, as Paul did at the Areopagus",
      "Refuse to name specific points of difference"
    ],
    "optionsEs": [
      "Evitar siempre volver a discutir otras religiones",
      "Declarar que todas las religiones son igualmente falsas",
      "Escuchar primero, honrar lo que es verdadero, y proclamar a Cristo sin disculpa, como lo hizo Pablo en el Areópago",
      "Negarse a nombrar puntos específicos de diferencia"
    ],
    "c": 149,
    "explEn": "A pastor equipped by this comparative work can walk into any conversation and do what Paul did on Mars Hill: listen first, honor what is true, then proclaim Christ without apology.",
    "explEs": "Un pastor equipado por este trabajo comparativo puede entrar en cualquier conversación y hacer lo que Pablo hizo en el Areópago: escuchar primero, honrar lo que es verdadero, y luego proclamar a Cristo sin disculpa."
  },
  {
    "textEn": "20. According to Romans 10:13, cited in this unit, salvation is available to:",
    "textEs": "20. Según Romanos 10:13, citado en esta unidad, la salvación está disponible para:",
    "optionsEn": [
      "Only those born into a specific ethnic group",
      "Only those who complete the Eightfold Path",
      "No one; salvation is impossible for anyone",
      "Whoever calls on the name of the LORD"
    ],
    "optionsEs": [
      "Solo aquellos nacidos en un grupo étnico específico",
      "Solo aquellos que completan el Óctuple Sendero",
      "Nadie; la salvación es imposible para cualquiera",
      "Todo aquel que invocare el nombre del Señor"
    ],
    "c": 157,
    "explEn": "Romans 10:13 declares that 'whoever calls on the name of the LORD shall be saved,' the search for God answered by God Himself entering history, dying, and rising.",
    "explEs": "Romanos 10:13 declara que 'todo aquel que invocare el nombre del Señor, será salvo,' la búsqueda de Dios respondida por Dios mismo entrando en la historia, muriendo, y resucitando."
  }
];

const kwQuestions = [
  {
    "textEn": "21. Explain why this unit insists that comparing religions fairly is not the same as relativism, and what a pastor gains by doing this comparative work honestly.",
    "textEs": "21. Explique por qué esta unidad insiste en que comparar religiones con justicia no es lo mismo que el relativismo, y qué gana un pastor al hacer este trabajo comparativo con honestidad.",
    "kw_en": ["fair", "weight", "presuppose", "caricature", "credibility", "conviction", "earn", "explain"],
    "kw_es": ["justicia", "peso", "presupon", "caricatura", "credibilidad", "convicción", "gana", "explic"],
    "modelEn": "Asking the same four questions of every tradition does not presuppose all answers carry equal weight; it ensures Scripture's answers are fairly compared against what each tradition actually teaches rather than a convenient caricature. A pastor who does this work honestly earns the right to proclaim Christ's uniqueness with both conviction and credibility, because he can explain precisely what he is saying no to and why.",
    "modelEs": "Hacer las mismas cuatro preguntas a cada tradición no presupone que todas las respuestas lleven el mismo peso; asegura que las respuestas de la Escritura se comparen con justicia contra lo que cada tradición realmente enseña en lugar de una caricatura conveniente. Un pastor que hace este trabajo con honestidad se gana el derecho de proclamar la singularidad de Cristo con convicción y credibilidad a la vez, porque puede explicar precisamente a qué está diciendo no y por qué."
  },
  {
    "textEn": "22. Compare how Judaism, Islam, and Sikhism describe ultimate reality with how Hinduism and Buddhism describe it, and explain the geographic/historical pattern this unit notices.",
    "textEs": "22. Compare cómo el judaísmo, el islam, y el sijismo describen la realidad última con cómo la describen el hinduismo y el budismo, y explique el patrón geográfico/histórico que nota esta unidad.",
    "kw_en": ["personal", "impersonal", "brahman", "abrahamic", "proximity", "south asia", "correlate", "pattern"],
    "kw_es": ["personal", "impersonal", "brahman", "abrahámic", "proximidad", "sur de asia", "correlaciona", "patrón"],
    "modelEn": "Judaism, Islam, and Sikhism affirm a personal, transcendent God, arising in relationship to the Abrahamic tradition, while Hinduism points to impersonal Brahman and Buddhism largely declines the question, both arising independently in South and East Asia. This unit notes that proximity to God's self-revelation in Scripture correlates with a picture of ultimate reality closer to what Scripture teaches, a pattern worth noticing though not proof by itself.",
    "modelEs": "El judaísmo, el islam, y el sijismo afirman un Dios personal y trascendente, surgiendo en relación con la tradición abrahámica, mientras el hinduismo señala al Brahman impersonal y el budismo en gran medida declina la pregunta, ambos surgiendo independientemente en el sur y este de Asia. Esta unidad nota que la proximidad a la autorrevelación de Dios en la Escritura se correlaciona con un cuadro de la realidad última más cercano a lo que enseña la Escritura, un patrón que vale la pena notar aunque no es prueba por sí mismo."
  },
  {
    "textEn": "23. Explain how Hinduism and Buddhism relocate the human problem away from guilt before a personal God, and contrast this with Scripture's diagnosis in Romans 3:23 and 5:12.",
    "textEs": "23. Explique cómo el hinduismo y el budismo reubican el problema humano lejos de la culpa delante de un Dios personal, y contraste esto con el diagnóstico de la Escritura en Romanos 3:23 y 5:12.",
    "kw_en": ["ignorance", "karma", "tanha", "craving", "guilt", "personal god", "adam", "rebellion"],
    "kw_es": ["ignorancia", "karma", "tanha", "anhelo", "culpa", "dios personal", "adán", "rebelión"],
    "modelEn": "Hindu thought identifies the problem as ignorance of one's identity with Brahman or accumulated karma; Buddhism identifies it as tanha, craving. Neither centers the human problem as an offense against a personal God. Scripture's diagnosis, by contrast, is sin: rebellion against a holy, personal God, inherited from Adam and compounded by individual choice, incurring real guilt only God Himself can remove.",
    "modelEs": "El pensamiento hindú identifica el problema como ignorancia de la propia identidad con Brahman o el karma acumulado; el budismo lo identifica como tanha, el anhelo. Ninguno centra el problema humano como una ofensa contra un Dios personal. El diagnóstico de la Escritura, por el contrario, es el pecado: rebelión contra un Dios santo y personal, heredada de Adán y agravada por la elección individual, incurriendo culpa real que solo Dios mismo puede quitar."
  },
  {
    "textEn": "24. Using Romans 5:8 and Ephesians 2:8-9, explain what this unit means when it says Scripture alone offers a solution 'accomplished entirely outside the sinner.'",
    "textEs": "24. Usando Romanos 5:8 y Efesios 2:8-9, explique qué quiere decir esta unidad cuando afirma que solo la Escritura ofrece una solución 'lograda enteramente fuera del pecador.'",
    "kw_en": ["finished", "guaranteed", "still sinners", "died for us", "faith", "not of works", "boast", "effort"],
    "kw_es": ["terminad", "garantizad", "aún pecadores", "murió por nosotros", "fe", "no por obras", "gloríe", "esfuerzo"],
    "modelEn": "Every other tradition studied locates the solution within the practitioner's own effort — insight, karma, submission, or weighed deeds — and even where grace appears, as in Islam, Sikhism, Pure Land Buddhism, or Hindu bhakti devotion, it remains uncertain rather than guaranteed in advance. Romans 5:8 says Christ died for sinners while they were still sinners, and Ephesians 2:8-9 says salvation is by grace through faith, not of works, so no one can boast — a solution finished and guaranteed before any effort on the sinner's part.",
    "modelEs": "Cada otra tradición estudiada ubica la solución dentro del propio esfuerzo del practicante — intuición, karma, sumisión, u obras pesadas — y aun donde aparece la gracia, como en el islam, el sijismo, el budismo de la Tierra Pura, o la devoción bhakti hindú, permanece incierta en lugar de garantizada de antemano. Romanos 5:8 dice que Cristo murió por los pecadores mientras todavía eran pecadores, y Efesios 2:8-9 dice que la salvación es por gracia mediante la fe, no por obras, para que nadie se gloríe — una solución terminada y garantizada antes de cualquier esfuerzo de parte del pecador."
  },
  {
    "textEn": "25. Compare the paths offered by Islam's Five Pillars and Sikhism's Five Ks with Buddhism's Eightfold Path and Hindu jnana yoga, and explain what all these paths share in common regarding certainty.",
    "textEs": "25. Compare los caminos ofrecidos por los Cinco Pilares del islam y las Cinco Kas del sijismo con el Óctuple Sendero budista y el jnana yoga hindú, y explique qué comparten todos estos caminos respecto a la certeza.",
    "kw_en": ["disciplined", "concrete", "inward", "perception", "certainty", "unresolved", "outcome", "death"],
    "kw_es": ["disciplinad", "concreto", "interior", "percepción", "certeza", "sin resolver", "resultado", "muerte"],
    "modelEn": "Islam's Five Pillars, Sikhism's Five Ks and simran, and Confucian ritual propriety offer concrete, disciplined practices to perform and repeat, while Buddhism's Eightfold Path and Hindu jnana yoga emphasize inward transformation of perception. Despite different outward forms, none of these paths offers settled certainty of a favorable outcome before death; karma may remain unresolved, deeds may be found wanting, insight may stay incomplete.",
    "modelEs": "Los Cinco Pilares del islam, las Cinco Kas y el simran del sijismo, y la propiedad ritual confuciana ofrecen prácticas concretas y disciplinadas para realizar y repetir, mientras el Óctuple Sendero budista y el jnana yoga hindú enfatizan la transformación interior de la percepción. A pesar de las diferentes formas exteriores, ninguno de estos caminos ofrece certeza establecida de un resultado favorable antes de la muerte; el karma puede permanecer sin resolver, las obras pueden resultar deficientes, la intuición puede quedar incompleta."
  },
  {
    "textEn": "26. Using 1 John 5:13, explain why this unit calls the gospel's offer of certainty 'not a minor pastoral footnote.'",
    "textEs": "26. Usando 1 Juan 5:13, explique por qué esta unidad llama a la oferta de certeza del evangelio 'no una nota pastoral menor.'",
    "kw_en": ["know", "present tense", "finished work", "anxious", "uncertainty", "named", "resolved", "practical"],
    "kw_es": ["sepáis", "tiempo presente", "obra terminada", "ansios", "incertidumbre", "nombrada", "resuelta", "práctic"],
    "modelEn": "1 John 5:13 says Scripture was written so believers may know, in the present tense, that they have eternal life, based on a finished work rather than ongoing performance. This unit calls this significant because the anxious uncertainty built into karma, weighed deeds, or unfinished spiritual attainment is something Scripture names directly and resolves directly, making it one of the sharpest practical differences a pastor can draw out in conversation.",
    "modelEs": "1 Juan 5:13 dice que la Escritura fue escrita para que los creyentes sepan, en tiempo presente, que tienen vida eterna, basada en una obra terminada en lugar de un desempeño continuo. Esta unidad llama a esto significativo porque la incertidumbre ansiosa incorporada en el karma, las obras pesadas, o la intuición espiritual inconclusa es algo que la Escritura nombra directamente y resuelve directamente, haciéndola una de las diferencias prácticas más agudas que un pastor puede señalar en conversación."
  },
  {
    "textEn": "27. Contrast the biblical picture of ultimate destiny with Hindu/Sikh samsara and Buddhist nirvana, explaining why Buddhism poses a distinct translation challenge.",
    "textEs": "27. Contraste el cuadro bíblico del destino último con el samsara hindú/sij y el nirvana budista, explicando por qué el budismo presenta un desafío de traducción distinto.",
    "kw_en": ["bodily resurrection", "single judgment", "samsara", "cycle", "nirvana", "no self", "destination", "linear"],
    "kw_es": ["resurrección corporal", "juicio único", "samsara", "ciclo", "nirvana", "no-yo", "destino", "lineal"],
    "modelEn": "Scripture teaches bodily resurrection and everlasting fellowship with God following one decisive, unrepeatable judgment, a linear history. Hinduism and Sikhism envision samsara, a cycle of rebirth ending in absorption or union rather than resurrection. Buddhism poses a distinct challenge because it denies any permanent self persists at all, so nirvana cannot even be described as the self reaching a destination, unlike Hindu or Sikh liberation.",
    "modelEs": "La Escritura enseña la resurrección corporal y la comunión eterna con Dios siguiendo un juicio único, decisivo, e irrepetible, una historia lineal. El hinduismo y el sijismo visualizan el samsara, un ciclo de renacimiento que termina en absorción o unión en lugar de resurrección. El budismo presenta un desafío distinto porque niega que persista ningún yo permanente en absoluto, así que el nirvana ni siquiera puede describirse como el yo alcanzando un destino, a diferencia de la liberación hindú o sij."
  },
  {
    "textEn": "28. Describe how Jehovah's Witness teaching on the afterlife partially echoes the biblical hope while still falling short of it, according to this unit.",
    "textEs": "28. Describa cómo la enseñanza de los Testigos de Jehová acerca de la vida después de la muerte hace eco parcialmente de la esperanza bíblica mientras todavía se queda corta, según esta unidad.",
    "kw_en": ["paradise earth", "bodily", "echo", "deny", "full deity", "144,000", "reserve", "limited"],
    "kw_es": ["tierra paraíso", "corporal", "eco", "nieg", "plena deidad", "144,000", "reserv", "limitad"],
    "modelEn": "Jehovah's Witnesses hope for resurrection to a restored paradise earth, echoing the biblical hope of bodily existence more closely than Hindu or Buddhist categories. Yet this unit notes they still fall short because they deny the full deity of the One who secures that hope and reserve genuine heavenly fellowship with God for a small, fixed number of 144,000 rather than all believers.",
    "modelEs": "Los Testigos de Jehová esperan la resurrección a una tierra paraíso restaurada, haciendo eco de la esperanza bíblica de la existencia corporal más de cerca que las categorías hindúes o budistas. Sin embargo, esta unidad nota que todavía se quedan cortos porque niegan la plena deidad de Aquel que asegura esa esperanza y reservan la comunión celestial genuina con Dios para un número pequeño y fijo de 144,000 en lugar de todos los creyentes."
  },
  {
    "textEn": "29. List and explain the three features of the biblical picture this unit says appear nowhere else across the entire survey of religions.",
    "textEs": "29. Enumere y explique las tres características del cuadro bíblico que dice esta unidad no aparecen en ningún otro lugar a través de todo el estudio de religiones.",
    "kw_en": ["personal and transcendent", "outside the sinner", "verifiable history", "restoration", "glorification", "identity", "three features", "nowhere else"],
    "kw_es": ["personal y trascendente", "fuera del pecador", "historia verificable", "restauración", "glorificación", "identidad", "tres características", "ningún otro lugar"],
    "modelEn": "First, only Scripture presents ultimate reality as both fully personal and fully transcendent, unlike Brahman, the Tao, or Buddhism's silence. Second, only the gospel offers a solution accomplished entirely outside the sinner's effort, finished at a point in verifiable history rather than accumulated across lifetimes. Third, only Scripture promises restoration and glorification of the very personal identity God created, rather than absorption or endless further striving.",
    "modelEs": "Primero, solo la Escritura presenta la realidad última como plenamente personal y plenamente trascendente a la vez, a diferencia de Brahman, el Tao, o el silencio del budismo. Segundo, solo el evangelio ofrece una solución lograda enteramente fuera del esfuerzo del pecador, terminada en un punto de la historia verificable en lugar de acumulada a través de vidas. Tercero, solo la Escritura promete la restauración y glorificación de la misma identidad personal que Dios creó, en lugar de absorción o esfuerzo adicional interminable."
  },
  {
    "textEn": "30. Synthesize this unit: explain why this unit says its comparative work does not flatten Christianity into pluralism, and describe the practical pastoral posture this unit commends, citing Acts 4:12 and Romans 10:13.",
    "textEs": "30. Sintetice esta unidad: explique por qué dice esta unidad que su trabajo comparativo no aplana al cristianismo en el pluralismo, y describa la postura pastoral práctica que recomienda esta unidad, citando Hechos 4:12 y Romanos 10:13.",
    "kw_en": ["pluralism", "areopagus", "listen", "honor", "proclaim", "no other name", "calls on", "unapologetic"],
    "kw_es": ["pluralismo", "areópago", "escuch", "honr", "proclam", "ningún otro nombre", "invocare", "sin disculpa"],
    "modelEn": "This unit's comparative work does not flatten Christianity into pluralism because it takes seriously genuine insight across traditions while still proclaiming, per Acts 4:12, that there is no other name under heaven by which we must be saved. The practical posture, modeled on Paul at the Areopagus, is to listen first, honor what is true, and then proclaim Christ without apology, trusting Romans 10:13 that whoever calls on the name of the LORD shall be saved.",
    "modelEs": "El trabajo comparativo de esta unidad no aplana al cristianismo en el pluralismo porque toma en serio la intuición genuina a través de las tradiciones mientras todavía proclama, según Hechos 4:12, que no hay otro nombre bajo el cielo por el cual debemos ser salvos. La postura práctica, modelada en Pablo en el Areópago, es escuchar primero, honrar lo que es verdadero, y luego proclamar a Cristo sin disculpa, confiando en Romanos 10:13 de que todo aquel que invocare el nombre del Señor será salvo."
  }
];

const PREV_HREF = 'CTSWRUnit8.html';

const NEXT_HREF = 'CTSWRUnit10.html';
