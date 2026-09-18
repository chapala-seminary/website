/* CTSWR - unit 12: per-unit configuration and content. */

const UNIT = 12;

let currentUnit = 12;

const mcQuestions = [
  {
    "textEn": "1. According to this unit, this capstone unit does NOT primarily introduce:",
    "textEs": "1. Según esta unidad, esta unidad culminante NO introduce principalmente:",
    "optionsEn": [
      "A shortcut that replaces Units 2 through 11's specific content",
      "A single coherent theology of religions gathering the course together",
      "New content, but rather connects and synthesizes what prior units built",
      "An answer to what the church should believe and do about the religious world"
    ],
    "optionsEs": [
      "Un atajo que reemplaza el contenido específico de las Unidades 2 a 11",
      "Una sola teología coherente de las religiones que reúne el curso",
      "Contenido nuevo, sino que conecta y sintetiza lo que las unidades anteriores construyeron",
      "Una respuesta a lo que la iglesia debe creer y hacer acerca del mundo religioso"
    ],
    "c": 21,
    "explEn": "This unit explicitly states it cannot condense eleven units of tradition-by-tradition study into a shortcut; it offers connective tissue, not a replacement.",
    "explEs": "Esta unidad declara explícitamente que no puede condensar once unidades de estudio tradición por tradición en un atajo; ofrece tejido conectivo, no un reemplazo."
  },
  {
    "textEn": "2. Exclusivism, as defined in this unit, holds that:",
    "textEs": "2. El exclusivismo, según se define en esta unidad, sostiene que:",
    "optionsEn": [
      "General revelation alone saves everyone",
      "Explicit, conscious faith in Christ is necessary for salvation",
      "All religions lead equally to God",
      "Missions are unnecessary since salvation is automatic"
    ],
    "optionsEs": [
      "La revelación general por sí sola salva a todos",
      "La fe explícita y consciente en Cristo es necesaria para la salvación",
      "Todas las religiones llevan por igual a Dios",
      "Las misiones son innecesarias ya que la salvación es automática"
    ],
    "c": 29,
    "explEn": "Exclusivism holds that explicit, conscious faith in Jesus Christ is necessary for salvation; general revelation leaves people without excuse but does not itself save.",
    "explEs": "El exclusivismo sostiene que la fe explícita y consciente en Jesucristo es necesaria para la salvación; la revelación general deja a las personas sin excusa pero no salva por sí misma."
  },
  {
    "textEn": "3. Inclusivism, associated with theologians like Karl Rahner, holds that Christ's atoning work:",
    "textEs": "3. El inclusivismo, asociado con teólogos como Karl Rahner, sostiene que la obra expiatoria de Cristo:",
    "optionsEn": [
      "Is unnecessary for anyone's salvation",
      "Applies only to those born into Christian families",
      "Remains the sole ground of salvation, but its benefits may extend to some who respond in faith to the light they have",
      "Is identical to pluralism"
    ],
    "optionsEs": [
      "Es innecesaria para la salvación de cualquiera",
      "Se aplica solo a aquellos nacidos en familias cristianas",
      "Sigue siendo el único fundamento de la salvación, pero sus beneficios pueden extenderse a algunos que responden con fe a la luz que tienen",
      "Es idéntica al pluralismo"
    ],
    "c": 37,
    "explEn": "Inclusivism holds Christ's atoning work remains the sole ground of salvation, but allows God may apply its benefits to some who respond in faith to the light they have received.",
    "explEs": "El inclusivismo sostiene que la obra expiatoria de Cristo sigue siendo el único fundamento de la salvación, pero permite que Dios aplique sus beneficios a algunos que responden con fe a la luz que han recibido."
  },
  {
    "textEn": "4. This unit cites Cornelius in Acts 10-11 as an example relevant to inclusivism because his prayers and alms:",
    "textEs": "4. Esta unidad cita a Cornelio en Hechos 10-11 como ejemplo relevante para el inclusivismo porque sus oraciones y limosnas:",
    "optionsEn": [
      "Saved him without any need to hear the gospel",
      "Were rejected by God entirely",
      "Proved pluralism correct",
      "Came up as a memorial before God prior to hearing the gospel, yet he still required Peter's preaching to be saved"
    ],
    "optionsEs": [
      "Lo salvaron sin ninguna necesidad de escuchar el evangelio",
      "Fueron rechazadas por Dios por completo",
      "Probaron que el pluralismo era correcto",
      "Subieron para memoria delante de Dios antes de escuchar el evangelio, aunque todavía requirió la predicación de Pedro para ser salvo"
    ],
    "c": 45,
    "explEn": "Cornelius's prayers and alms came up as a memorial before God prior to hearing the gospel, but he still required Peter's preaching to be saved, per Acts 11:14.",
    "explEs": "Las oraciones y limosnas de Cornelio subieron para memoria delante de Dios antes de escuchar el evangelio, pero todavía requirió la predicación de Pedro para ser salvo, según Hechos 11:14."
  },
  {
    "textEn": "5. According to this unit, why has this course consistently declined to treat pluralism as a live option, per Unit 9's work?",
    "textEs": "5. Según esta unidad, ¿por qué este curso ha declinado consistentemente tratar el pluralismo como una opción viable, según el trabajo de la Unidad 9?",
    "optionsEn": [
      "The traditions contradict one another on the most basic questions of what is real",
      "The traditions studied agree on everything important",
      "Pluralism was never discussed in this course",
      "All religions were founded in the same century"
    ],
    "optionsEs": [
      "Las tradiciones se contradicen entre sí en las preguntas más básicas de qué es real",
      "Las tradiciones estudiadas concuerdan en todo lo importante",
      "El pluralismo nunca se discutió en este curso",
      "Todas las religiones se fundaron en el mismo siglo"
    ],
    "c": 49,
    "explEn": "The traditions surveyed contradict one another on the most basic questions of what is real, making the claim that they all lead to the same destination false to what the traditions themselves teach.",
    "explEs": "Las tradiciones estudiadas se contradicen entre sí en las preguntas más básicas de qué es real, haciendo falsa la afirmación de que todas llevan al mismo destino según lo que las tradiciones mismas enseñan."
  },
  {
    "textEn": "6. According to this unit, what do exclusivism and inclusivism agree on, despite their disagreement?",
    "textEs": "6. Según esta unidad, ¿en qué concuerdan el exclusivismo y el inclusivismo, a pesar de su desacuerdo?",
    "optionsEn": [
      "Neither affirms salvation through Christ alone",
      "Both affirm salvation through Christ's atoning work alone and the urgency of missions",
      "Both reject the necessity of world missions",
      "Both are identical to pluralism"
    ],
    "optionsEs": [
      "Ninguno afirma la salvación solo a través de Cristo",
      "Ambos afirman la salvación solo a través de la obra expiatoria de Cristo y la urgencia de las misiones",
      "Ambos rechazan la necesidad de las misiones mundiales",
      "Ambos son idénticos al pluralismo"
    ],
    "c": 57,
    "explEn": "Both positions affirm salvation is through Christ's atoning work alone and both affirm the necessity and urgency of world missions.",
    "explEs": "Ambas posturas afirman que la salvación es solo a través de la obra expiatoria de Cristo y ambas afirman la necesidad y urgencia de las misiones mundiales."
  },
  {
    "textEn": "7. This unit warns that a pastor who slides from inclusivism into functional pluralism has:",
    "textEs": "7. Esta unidad advierte que un pastor que se desliza del inclusivismo hacia el pluralismo funcional ha:",
    "optionsEn": [
      "Correctly applied genuine inclusivism",
      "Strengthened missionary urgency",
      "Abandoned a position this unit has actually described",
      "Done nothing theologically significant"
    ],
    "optionsEs": [
      "Aplicado correctamente el inclusivismo genuino",
      "Fortalecido la urgencia misionera",
      "Abandonado una postura que esta unidad realmente ha descrito",
      "No hecho nada teológicamente significativo"
    ],
    "c": 65,
    "explEn": "Treating the possibility of salvation through general revelation as a reason missions is merely helpful rather than urgent abandons genuine inclusivism, which has never withheld proclamation on that basis.",
    "explEs": "Tratar la posibilidad de salvación a través de la revelación general como una razón por la cual las misiones son meramente útiles en lugar de urgentes abandona el inclusivismo genuino, que nunca ha retenido la proclamación sobre esa base."
  },
  {
    "textEn": "8. According to Romans 1:18-20, cited in this unit, general revelation through creation is sufficient to establish:",
    "textEs": "8. Según Romanos 1:18-20, citado en esta unidad, la revelación general a través de la creación es suficiente para establecer:",
    "optionsEn": [
      "Universal salvation for everyone",
      "That no one can ever know God exists",
      "A completely separate path of salvation",
      "That all people are without excuse, establishing guilt"
    ],
    "optionsEs": [
      "La salvación universal para todos",
      "Que nadie puede jamás saber que Dios existe",
      "Un camino completamente separado de salvación",
      "Que todas las personas son inexcusables, estableciendo culpa"
    ],
    "c": 73,
    "explEn": "Romans 1:18-20 teaches general revelation renders all people without excuse for the purpose of establishing universal guilt, not universal salvation.",
    "explEs": "Romanos 1:18-20 enseña que la revelación general hace a todas las personas inexcusables con el propósito de establecer la culpa universal, no la salvación universal."
  },
  {
    "textEn": "9. According to Romans 3:23, cited in this unit as part of the surrounding argument, what does Paul conclude about all people?",
    "textEs": "9. Según Romanos 3:23, citado en esta unidad como parte del argumento circundante, ¿qué concluye Pablo acerca de todas las personas?",
    "optionsEn": [
      "All have sinned and fall short of the glory of God",
      "All are automatically saved",
      "Only some people have sinned",
      "Sin does not actually exist"
    ],
    "optionsEs": [
      "Todos pecaron y están destituidos de la gloria de Dios",
      "Todos están automáticamente salvos",
      "Solo algunas personas han pecado",
      "El pecado en realidad no existe"
    ],
    "c": 77,
    "explEn": "Paul concludes all have sinned and fall short of the glory of God, showing Romans moves from general revelation to universal condemnation, not an alternate path of salvation.",
    "explEs": "Pablo concluye que todos pecaron y están destituidos de la gloria de Dios, mostrando que Romanos se mueve desde la revelación general hacia la condenación universal, no un camino alternativo de salvación."
  },
  {
    "textEn": "10. According to Romans 10:14-15, cited in this unit, the rhetorical question 'how shall they hear without a preacher' assumes:",
    "textEs": "10. Según Romanos 10:14-15, citado en esta unidad, la pregunta retórica '¿cómo oirán sin haber quien les predique?' asume:",
    "optionsEn": [
      "That preaching is unnecessary for salvation",
      "Hearing and believing the preached gospel as the ordinary means of salvation",
      "That missions should be discontinued",
      "That general revelation alone always suffices"
    ],
    "optionsEs": [
      "Que la predicación es innecesaria para la salvación",
      "Oír y creer el evangelio predicado como el medio ordinario de salvación",
      "Que las misiones deben discontinuarse",
      "Que la revelación general por sí sola siempre es suficiente"
    ],
    "c": 85,
    "explEn": "This passage assumes hearing and believing the preached gospel as the ordinary means of salvation, which is why Paul pivots immediately to the urgency of sending preachers.",
    "explEs": "Este pasaje asume el oír y creer el evangelio predicado como el medio ordinario de salvación, que es por qué Pablo gira inmediatamente hacia la urgencia de enviar predicadores."
  },
  {
    "textEn": "11. According to this unit, what does Paul NOT do in Romans 10, unlike a pastor might be tempted to do?",
    "textEs": "11. Según esta unidad, ¿qué NO hace Pablo en Romanos 10, a diferencia de lo que un pastor podría sentirse tentado a hacer?",
    "optionsEn": [
      "Emphasize the urgency of sending preachers",
      "Ask how people will hear without a preacher",
      "Pause to speculate confidently about the eternal fate of the unreached before deciding whether sending is worth it",
      "Call the feet of gospel messengers beautiful"
    ],
    "optionsEs": [
      "Enfatizar la urgencia de enviar predicadores",
      "Preguntar cómo la gente oirá sin un predicador",
      "Detenerse a especular confiadamente acerca del destino eterno de los no alcanzados antes de decidir si el envío vale la pena",
      "Llamar hermosos los pies de los mensajeros del evangelio"
    ],
    "c": 93,
    "explEn": "Paul treats the question as settled in the direction that matters for practice — people need to hear, so preachers must be sent — rather than pausing to weigh exclusivist against inclusivist possibilities first.",
    "explEs": "Pablo trata la pregunta como resuelta en la dirección que importa para la práctica — la gente necesita oír, así que los predicadores deben ser enviados — en lugar de detenerse a sopesar primero posibilidades exclusivistas contra inclusivistas."
  },
  {
    "textEn": "12. According to Matthew 28:18-20, the Great Commission follows directly from Christ's claim to:",
    "textEs": "12. Según Mateo 28:18-20, la Gran Comisión sigue directamente de la afirmación de Cristo de:",
    "optionsEn": [
      "Limited authority over only Israel",
      "No authority at all until His return",
      "Authority shared equally with earthly rulers",
      "All authority in heaven and on earth"
    ],
    "optionsEs": [
      "Autoridad limitada solo sobre Israel",
      "Ninguna autoridad en absoluto hasta Su regreso",
      "Autoridad compartida por igual con gobernantes terrenales",
      "Toda potestad en el cielo y en la tierra"
    ],
    "c": 101,
    "explEn": "The Great Commission follows directly from Christ's claim to all authority in heaven and on earth, making the missionary mandate a command from the risen, universally authoritative Christ.",
    "explEs": "La Gran Comisión sigue directamente de la afirmación de Cristo de toda potestad en el cielo y en la tierra, haciendo del mandato misionero un mandamiento del Cristo resucitado y universalmente autoritativo."
  },
  {
    "textEn": "13. According to this unit, the phrase 'all the nations' in the Great Commission would have included, for its first hearers:",
    "textEs": "13. Según esta unidad, la frase 'todas las naciones' en la Gran Comisión habría incluido, para sus primeros oyentes:",
    "optionsEn": [
      "Every tradition this course has surveyed",
      "Only the nation of Israel",
      "No one outside the Roman Empire",
      "Only Christians already converted"
    ],
    "optionsEs": [
      "Cada tradición que este curso ha estudiado",
      "Solo la nación de Israel",
      "A nadie fuera del Imperio Romano",
      "Solo a cristianos ya convertidos"
    ],
    "c": 105,
    "explEn": "The phrase 'all the nations' would have included, for its first hearers, every tradition this course has surveyed.",
    "explEs": "La frase 'todas las naciones' habría incluido, para sus primeros oyentes, cada tradición que este curso ha estudiado."
  },
  {
    "textEn": "14. According to this unit, the Great Commission's goal, 'teaching them to observe all things,' describes:",
    "textEs": "14. Según esta unidad, la meta de la Gran Comisión, 'enseñándoles que guarden todas las cosas,' describe:",
    "optionsEn": [
      "A single decisive conversation",
      "A lifelong process of discipleship",
      "Winning arguments as the primary goal",
      "A task completed instantly at conversion"
    ],
    "optionsEs": [
      "Una sola conversación decisiva",
      "Un proceso de discipulado de toda la vida",
      "Ganar argumentos como meta principal",
      "Una tarea completada instantáneamente en la conversión"
    ],
    "c": 113,
    "explEn": "The Commission's goal aims at making disciples through a lifelong process of discipleship, teaching them to observe all Christ commanded, not a single decisive conversation.",
    "explEs": "La meta de la Comisión apunta a hacer discípulos a través de un proceso de discipulado de toda la vida, enseñándoles a guardar todo lo que Cristo mandó, no una sola conversación decisiva."
  },
  {
    "textEn": "15. According to this unit, the scope of this course itself has been a small enactment of:",
    "textEs": "15. Según esta unidad, el alcance de este curso mismo ha sido una pequeña puesta en práctica de:",
    "optionsEn": [
      "A single religion's history",
      "Only Cuban and Mexican culture",
      "The Great Commission's scope, covering a cross-section of all the nations",
      "A purely academic exercise with no missionary purpose"
    ],
    "optionsEs": [
      "La historia de una sola religión",
      "Solo la cultura cubana y mexicana",
      "El alcance de la Gran Comisión, cubriendo un corte transversal de todas las naciones",
      "Un ejercicio puramente académico sin propósito misionero"
    ],
    "c": 121,
    "explEn": "The traditions this course surveyed together represent a genuine cross-section of 'all the nations' Christ commanded His church to reach, enacting the Commission's scope in miniature.",
    "explEs": "Las tradiciones que este curso estudió juntas representan un corte transversal genuino de 'todas las naciones' que Cristo mandó a Su iglesia alcanzar, poniendo en práctica en miniatura el alcance de la Comisión."
  },
  {
    "textEn": "16. According to this unit's warning, what happens when comparative religious knowledge never leads to actual pastoral engagement?",
    "textEs": "16. Según la advertencia de esta unidad, ¿qué sucede cuando el conocimiento religioso comparativo nunca lleva a un compromiso pastoral real?",
    "optionsEn": [
      "It has fully achieved its purpose",
      "It automatically converts people anyway",
      "It was never actually knowledge at all",
      "It has failed its purpose, becoming an academic trophy rather than a pastoral tool"
    ],
    "optionsEs": [
      "Ha logrado plenamente su propósito",
      "Automáticamente convierte a la gente de todos modos",
      "Nunca fue realmente conocimiento en absoluto",
      "Ha fallado su propósito, convirtiéndose en un trofeo académico en lugar de una herramienta pastoral"
    ],
    "c": 129,
    "explEn": "Knowledge that never leads to an actual conversation with an actual neighbor has failed its purpose, becoming an academic trophy rather than a pastoral tool.",
    "explEs": "El conocimiento que nunca lleva a una conversación real con un vecino real ha fallado su propósito, convirtiéndose en un trofeo académico en lugar de una herramienta pastoral."
  },
  {
    "textEn": "17. According to this unit, where is the entire value of this course actually realized?",
    "textEs": "17. Según esta unidad, ¿dónde se realiza realmente el valor entero de este curso?",
    "optionsEn": [
      "In the ordinary, unglamorous work of pastoral ministry",
      "In possessing facts for their own sake",
      "Only in passing the final exam",
      "In academic publication alone"
    ],
    "optionsEs": [
      "En el trabajo ordinario y poco glamoroso del ministerio pastoral",
      "En poseer hechos por sí mismos",
      "Solo en aprobar el examen final",
      "Solo en la publicación académica"
    ],
    "c": 133,
    "explEn": "The entire value of this course is realized in the ordinary, unglamorous work of pastoral ministry — a doorstep conversation, an honest answer, patient discipleship — not in possessing facts alone.",
    "explEs": "El valor entero de este curso se realiza en el trabajo ordinario y poco glamoroso del ministerio pastoral — una conversación en un umbral, una respuesta honesta, un discipulado paciente — no en poseer hechos por sí mismos."
  },
  {
    "textEn": "18. According to this unit, the posture modeled by Paul at the Areopagus, which opened and closes this course, is described as:",
    "textEs": "18. Según esta unidad, la postura modelada por Pablo en el Areópago, que abre y cierra este curso, se describe como:",
    "optionsEn": [
      "A technique to deploy once and set aside",
      "A lifelong pastoral disposition",
      "Irrelevant to modern ministry",
      "Something only for academic settings"
    ],
    "optionsEs": [
      "Una técnica para desplegar una vez y dejar de lado",
      "Una disposición pastoral de toda la vida",
      "Irrelevante para el ministerio moderno",
      "Algo solo para entornos académicos"
    ],
    "c": 141,
    "explEn": "Paul's posture at the Areopagus is not a technique to use once and discard, but a lifelong pastoral disposition of careful observation, respect, patience, and clarity.",
    "explEs": "La postura de Pablo en el Areópago no es una técnica para usar una vez y descartar, sino una disposición pastoral de toda la vida de observación cuidadosa, respeto, paciencia, y claridad."
  },
  {
    "textEn": "19. According to Revelation 7:9, cited in this unit, the ultimate answer to every religious system studied is:",
    "textEs": "19. Según Apocalipsis 7:9, citado en esta unidad, la respuesta última a cada sistema religioso estudiado es:",
    "optionsEn": [
      "The complete disappearance of all nations",
      "A single ethnic group saved exclusively",
      "Every nation, tribe, people, and tongue gathered before the throne",
      "Endless separate destinies for each religion"
    ],
    "optionsEs": [
      "La desaparición completa de todas las naciones",
      "Un solo grupo étnico salvo exclusivamente",
      "Toda nación, tribu, pueblo, y lengua reunidos delante del trono",
      "Destinos separados interminables para cada religión"
    ],
    "c": 149,
    "explEn": "Revelation 7:9 envisions every nation, tribe, people, and tongue gathered before the throne, the ultimate unity every religious system has, in its own way, been reaching toward.",
    "explEs": "Apocalipsis 7:9 visualiza a toda nación, tribu, pueblo, y lengua reunidos delante del trono, la unidad última hacia la cual cada sistema religioso, a su propia manera, ha estado alcanzando."
  },
  {
    "textEn": "20. According to this unit's closing charge, a pastor is commissioned to make disciples of:",
    "textEs": "20. Según el encargo final de esta unidad, un pastor está comisionado a hacer discípulos de:",
    "optionsEn": [
      "An abstraction called 'the nations' only",
      "Only people who already agree with him",
      "No one, since the course itself completes the task",
      "The actual specific neighbors, families, and congregation God has placed under his care"
    ],
    "optionsEs": [
      "Una abstracción llamada 'las naciones' solamente",
      "Solo personas que ya están de acuerdo con él",
      "A nadie, ya que el curso mismo completa la tarea",
      "Los vecinos, familias, y congregación específicos y reales que Dios ha puesto bajo su cuidado"
    ],
    "c": 157,
    "explEn": "The charge is to go and make disciples not of an abstraction, but of the actual specific neighbors, families, and congregation God has placed under a pastor's care.",
    "explEs": "El encargo es ir y hacer discípulos no de una abstracción, sino de los vecinos, familias, y congregación específicos y reales que Dios ha puesto bajo el cuidado de un pastor."
  }
];

const kwQuestions = [
  {
    "textEn": "21. Explain what this unit says it can and cannot do as a capstone, and why a pastor cannot simply skip to it.",
    "textEs": "21. Explique lo que dice esta unidad que puede y no puede hacer como unidad culminante, y por qué un pastor no puede simplemente saltar a ella.",
    "kw_en": ["connective tissue", "shortcut", "specific knowledge", "depend", "framework", "nothing to hang", "cannot condense", "prior units"],
    "kw_es": ["tejido conectivo", "atajo", "conocimiento específico", "depend", "marco", "nada de qué colgar", "no puede condensar", "unidades anteriores"],
    "modelEn": "This unit says it cannot condense eleven units of tradition-by-tradition study into a shortcut replacing the specific knowledge each prior unit built. A pastor who skips ahead without doing that work finds a framework with nothing to hang it on, since the four-question comparison, apologetic method, and closing charge all depend on content from Units 2-11. What this unit offers instead is connective tissue, gathering the course into a coherent theology of religions.",
    "modelEs": "Esta unidad dice que no puede condensar once unidades de estudio tradición por tradición en un atajo que reemplace el conocimiento específico que cada unidad anterior construyó. Un pastor que salta adelante sin hacer ese trabajo encuentra un marco sin nada de qué colgarlo, ya que la comparación de cuatro preguntas, el método apologético, y el encargo final todos dependen del contenido de las Unidades 2-11. Lo que esta unidad ofrece en cambio es tejido conectivo, reuniendo el curso en una teología coherente de las religiones."
  },
  {
    "textEn": "22. Distinguish exclusivism, inclusivism, and pluralism as this unit revisits them, and explain what this unit says the first two positions hold in common.",
    "textEs": "22. Distinga el exclusivismo, el inclusivismo, y el pluralismo según esta unidad los revisita, y explique lo que dice esta unidad que las primeras dos posturas sostienen en común.",
    "kw_en": ["explicit faith", "light they have received", "equally valid", "atoning work alone", "missions", "agree", "disagree", "common ground"],
    "kw_es": ["fe explícita", "luz que han recibido", "igualmente válidas", "solo obra expiatoria", "misiones", "concuerdan", "discrepan", "terreno común"],
    "modelEn": "Exclusivism holds explicit faith in Christ is necessary for salvation; inclusivism holds Christ's atoning work is the sole ground but its benefits may extend to some responding to the light they have received; pluralism holds many paths lead equally to God. This unit says exclusivism and inclusivism agree on far more than they disagree: both affirm salvation through Christ's atoning work alone and the necessity and urgency of world missions.",
    "modelEs": "El exclusivismo sostiene que la fe explícita en Cristo es necesaria para la salvación; el inclusivismo sostiene que la obra expiatoria de Cristo es el único fundamento pero sus beneficios pueden extenderse a algunos que responden a la luz que han recibido; el pluralismo sostiene que muchos caminos llevan por igual a Dios. Esta unidad dice que el exclusivismo y el inclusivismo concuerdan en mucho más de lo que discrepan: ambos afirman la salvación solo a través de la obra expiatoria de Cristo y la necesidad y urgencia de las misiones mundiales."
  },
  {
    "textEn": "23. Using the example of Cornelius in Acts 10-11, explain the nuance this unit draws regarding inclusivism.",
    "textEs": "23. Usando el ejemplo de Cornelio en Hechos 10-11, explique el matiz que señala esta unidad respecto al inclusivismo.",
    "kw_en": ["cornelius", "prayers", "alms", "memorial", "still required", "peter", "preaching", "acts 11:14"],
    "kw_es": ["cornelio", "oraciones", "limosnas", "memoria", "todavía requirió", "pedro", "predicación", "hechos 11:14"],
    "modelEn": "Cornelius's prayers and alms came up as a memorial before God prior to hearing the gospel, a text inclusivists cite as evidence God can be at work in someone's life before explicit gospel knowledge. Yet this unit notes Cornelius still required Peter's preaching to actually be saved, per Acts 11:14, showing even this example does not remove the ordinary means of hearing and believing the preached word.",
    "modelEs": "Las oraciones y limosnas de Cornelio subieron para memoria delante de Dios antes de escuchar el evangelio, un texto que los inclusivistas citan como evidencia de que Dios puede estar obrando en la vida de alguien antes del conocimiento explícito del evangelio. Sin embargo, esta unidad nota que Cornelio todavía requirió la predicación de Pedro para realmente ser salvo, según Hechos 11:14, mostrando que incluso este ejemplo no elimina el medio ordinario de oír y creer la palabra predicada."
  },
  {
    "textEn": "24. Explain the warning this unit gives about sliding from inclusivism into 'functional pluralism.'",
    "textEs": "24. Explique la advertencia que da esta unidad acerca de deslizarse del inclusivismo hacia el 'pluralismo funcional.'",
    "kw_en": ["functional pluralism", "merely helpful", "urgent", "abandoned", "genuine inclusivism", "withhold", "never treated", "romans 10"],
    "kw_es": ["pluralismo funcional", "meramente útil", "urgente", "abandonado", "inclusivismo genuino", "reten", "nunca ha tratado", "romanos 10"],
    "modelEn": "This unit warns that a pastor who treats the possibility of salvation through general revelation as a reason missions are merely helpful rather than urgent has abandoned genuine inclusivism, which has never treated that possibility as grounds for withholding gospel proclamation. Romans 10:14-15 presses every position toward the same missionary urgency regardless.",
    "modelEs": "Esta unidad advierte que un pastor que trata la posibilidad de salvación a través de la revelación general como una razón por la cual las misiones son meramente útiles en lugar de urgentes ha abandonado el inclusivismo genuino, que nunca ha tratado esa posibilidad como fundamento para retener la proclamación del evangelio. Romanos 10:14-15 presiona a cada postura hacia la misma urgencia misionera sin importar cuál se sostenga."
  },
  {
    "textEn": "25. Using Romans 1:18-21 and 3:23, explain what this unit says general revelation actually accomplishes, and what it does not accomplish.",
    "textEs": "25. Usando Romanos 1:18-21 y 3:23, explique lo que dice esta unidad que la revelación general realmente logra, y lo que no logra.",
    "kw_en": ["without excuse", "guilt", "not salvation", "did not glorify", "all have sinned", "condemnation", "establishes accountability", "not an alternate path"],
    "kw_es": ["inexcusables", "culpa", "no salvación", "no le glorificaron", "todos pecaron", "condenación", "establece rendición de cuentas", "no un camino alternativo"],
    "modelEn": "General revelation renders all people without excuse and establishes guilt, per Romans 1:20-21, since though they knew God they did not glorify Him. Romans 3:23 concludes all have sinned and fall short of God's glory. This unit says general revelation establishes accountability and moves toward universal condemnation, not toward an alternate path of salvation running alongside the gospel.",
    "modelEs": "La revelación general hace a todas las personas inexcusables y establece culpa, según Romanos 1:20-21, ya que aunque conocieron a Dios no le glorificaron como a Dios. Romanos 3:23 concluye que todos pecaron y están destituidos de la gloria de Dios. Esta unidad dice que la revelación general establece la rendición de cuentas y se mueve hacia la condenación universal, no hacia un camino alternativo de salvación que corra junto al evangelio."
  },
  {
    "textEn": "26. Using Romans 10:14-15, explain the logical chain this unit draws from hearing to sending, and what Paul notably does not pause to do.",
    "textEs": "26. Usando Romanos 10:14-15, explique la cadena lógica que señala esta unidad desde el oír hasta el envío, y lo que Pablo notablemente no se detiene a hacer.",
    "kw_en": ["hear", "believe", "preacher", "sent", "logical chain", "settled", "does not speculate", "eternal fate"],
    "kw_es": ["oír", "creer", "predicador", "enviado", "cadena lógica", "resuelta", "no especula", "destino eterno"],
    "modelEn": "Romans 10:14-15 builds a chain: people cannot call on Christ without believing, cannot believe without hearing, cannot hear without a preacher, and preachers cannot preach unless sent. This unit notes Paul does not pause to speculate confidently about the eternal fate of the unreached before deciding sending is worthwhile; he treats the question as settled toward action — people need to hear, so preachers must be sent.",
    "modelEs": "Romanos 10:14-15 construye una cadena: la gente no puede invocar a Cristo sin creer, no puede creer sin oír, no puede oír sin un predicador, y los predicadores no pueden predicar si no son enviados. Esta unidad nota que Pablo no se detiene a especular confiadamente acerca del destino eterno de los no alcanzados antes de decidir que el envío vale la pena; trata la pregunta como resuelta hacia la acción — la gente necesita oír, así que los predicadores deben ser enviados."
  },
  {
    "textEn": "27. Using Matthew 28:18-20, explain why this unit calls the Great Commission a command rather than a suggestion, and what 'all the nations' meant for its first hearers.",
    "textEs": "27. Usando Mateo 28:18-20, explique por qué llama esta unidad a la Gran Comisión un mandato en lugar de una sugerencia, y qué significaba 'todas las naciones' para sus primeros oyentes.",
    "kw_en": ["all authority", "command", "risen", "universally authoritative", "not a suggestion", "all the nations", "every tradition", "first hearers"],
    "kw_es": ["toda potestad", "mandato", "resucitado", "universalmente autoritativo", "no una sugerencia", "todas las naciones", "cada tradición", "primeros oyentes"],
    "modelEn": "The Great Commission follows directly from Christ's claim to all authority in heaven and on earth, making it a command issued by the risen, universally authoritative Christ rather than a suggestion offered alongside competing priorities. 'All the nations' would have included, for its first hearers, every tradition this course has surveyed.",
    "modelEs": "La Gran Comisión sigue directamente de la afirmación de Cristo de toda potestad en el cielo y en la tierra, haciéndola un mandato emitido por el Cristo resucitado y universalmente autoritativo en lugar de una sugerencia ofrecida junto a prioridades en competencia. 'Todas las naciones' habría incluido, para sus primeros oyentes, cada tradición que este curso ha estudiado."
  },
  {
    "textEn": "28. Explain why this unit warns against treating comparative religious knowledge as 'an academic trophy,' giving the examples it uses.",
    "textEs": "28. Explique por qué advierte esta unidad contra tratar el conocimiento religioso comparativo como 'un trofeo académico,' dando los ejemplos que usa.",
    "kw_en": ["academic trophy", "pastoral tool", "failed its purpose", "five pillars", "grieving parishioner", "doorstep", "ordinary", "unglamorous"],
    "kw_es": ["trofeo académico", "herramienta pastoral", "fallado su propósito", "cinco pilares", "feligrés que sufre", "umbral", "ordinario", "poco glamoroso"],
    "modelEn": "This unit warns that knowledge of Islam's Five Pillars that never leads to an actual conversation with a Muslim neighbor has failed its purpose, as has understanding of Buddhist suffering that never comforts a grieving parishioner drawn to meditation. The course's value is realized only in ordinary, unglamorous pastoral work — a doorstep conversation, an honest hospital-room answer — not in possessing facts for their own sake.",
    "modelEs": "Esta unidad advierte que el conocimiento de los Cinco Pilares del islam que nunca lleva a una conversación real con un vecino musulmán ha fallado su propósito, como también lo ha hecho el entendimiento del sufrimiento budista que nunca consuela a un feligrés que sufre y se siente atraído a la meditación. El valor del curso se realiza solo en el trabajo pastoral ordinario y poco glamoroso — una conversación en un umbral, una respuesta honesta en una habitación de hospital — no en poseer hechos por sí mismos."
  },
  {
    "textEn": "29. Using Revelation 7:9, explain how this unit describes the ultimate answer to every religious system studied in this course.",
    "textEs": "29. Usando Apocalipsis 7:9, explique cómo describe esta unidad la respuesta última a cada sistema religioso estudiado en este curso.",
    "kw_en": ["every nation", "tribe", "tongue", "throne", "unity", "lamb", "reaching toward", "ultimate answer"],
    "kw_es": ["toda nación", "tribu", "lengua", "trono", "unidad", "cordero", "alcanzando hacia", "respuesta última"],
    "modelEn": "Revelation 7:9 envisions every nation, tribe, people, and tongue gathered before the throne. This unit describes this as the ultimate answer to every religious system studied, each of which, in its own way, has been reaching toward a unity and peace only the Lamb who was slain can actually provide.",
    "modelEs": "Apocalipsis 7:9 visualiza a toda nación, tribu, pueblo, y lengua reunidos delante del trono. Esta unidad describe esto como la respuesta última a cada sistema religioso estudiado, cada uno de los cuales, a su propia manera, ha estado alcanzando hacia una unidad y paz que solo el Cordero que fue inmolado puede realmente proveer."
  },
  {
    "textEn": "30. Synthesize this unit: describe the closing charge it gives a graduate, and how it connects back to Paul at the Areopagus from Unit 1.",
    "textEs": "30. Sintetice esta unidad: describa el encargo final que da a un graduado, y cómo se conecta de regreso con Pablo en el Areópago de la Unidad 1.",
    "kw_en": ["areopagus", "lifelong disposition", "specific neighbors", "not an abstraction", "patient love", "unyielding truth", "commissioned", "small corner"],
    "kw_es": ["areópago", "disposición de toda la vida", "vecinos específicos", "no una abstracción", "amor paciente", "verdad inquebrantable", "comisionado", "pequeño rincón"],
    "modelEn": "This unit closes by charging the graduate to carry Paul's Areopagus posture — careful observation, respect, patience, and clarity — as a lifelong pastoral disposition rather than a technique used once. The charge is to make disciples not of an abstraction called 'the nations' but of the actual specific neighbors, families, and congregation God has placed in the graduate's small corner of the world, with the same patient love and unyielding truth Paul carried onto Mars Hill.",
    "modelEs": "Esta unidad cierra encargando al graduado llevar la postura de Pablo en el Areópago — observación cuidadosa, respeto, paciencia, y claridad — como una disposición pastoral de toda la vida en lugar de una técnica usada una vez. El encargo es hacer discípulos no de una abstracción llamada 'las naciones' sino de los vecinos, familias, y congregación específicos y reales que Dios ha puesto en el pequeño rincón del mundo del graduado, con el mismo amor paciente y verdad inquebrantable que Pablo llevó al Areópago."
  }
];

const PREV_HREF = 'CTSWRUnit11.html';

const NEXT_HREF = 'CTSWRCertificate.html';
