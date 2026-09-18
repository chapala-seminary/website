/* CTSPM - unit 9: per-unit configuration and content. */

const UNIT = 9;

let currentUnit = 9;

const mcQuestions = [
  {
    "textEn": "1. The pastor is fundamentally:",
    "textEs": "1. El pastor es fundamentalmente:",
    "optionsEn": [
      "A small-business CEO",
      "A board manager",
      "A facility administrator",
      "A shepherd, not a corporate executive"
    ],
    "optionsEs": [
      "Un CEO de negocio pequeño",
      "Un gerente de junta",
      "Un administrador de instalaciones",
      "Un pastor de ovejas, no un ejecutivo corporativo"
    ],
    "c": 24,
    "explEn": "The pastor is fundamentally a shepherd, not a corporate executive.",
    "explEs": "El pastor es fundamentalmente un pastor de ovejas, no un ejecutivo corporativo."
  },
  {
    "textEn": "2. According to 1 Peter 5:2-3, the pastor must NOT lead:",
    "textEs": "2. Según 1 Pedro 5:2-3, el pastor NO debe dirigir:",
    "optionsEn": [
      "By gentleness or example",
      "By compulsion, for dishonest gain, or by lording over the flock",
      "Voluntarily",
      "Eagerly"
    ],
    "optionsEs": [
      "Con gentileza o ejemplo",
      "Por fuerza, por ganancia deshonesta, o teniendo señorío sobre el rebaño",
      "Voluntariamente",
      "Con ánimo pronto"
    ],
    "c": 29,
    "explEn": "1 Peter 5:2-3 forbids leading by compulsion, for dishonest gain, or by lording over the flock.",
    "explEs": "1 Pedro 5:2-3 prohíbe dirigir por fuerza, por ganancia deshonesta o teniendo señorío sobre el rebaño."
  },
  {
    "textEn": "3. The first leadership crisis in the New Testament church (Acts 6) was about:",
    "textEs": "3. La primera crisis de liderazgo en la iglesia del Nuevo Testamento (Hechos 6) fue sobre:",
    "optionsEn": [
      "Hellenistic widows being neglected in food distribution",
      "A doctrinal dispute",
      "Persecution from outside",
      "Choosing a successor for Peter"
    ],
    "optionsEs": [
      "Viudas helenistas siendo descuidadas en la distribución de alimentos",
      "Una disputa doctrinal",
      "Persecución de afuera",
      "Elegir un sucesor para Pedro"
    ],
    "c": 35,
    "explEn": "The first New Testament leadership crisis was Hellenistic widows neglected in food distribution.",
    "explEs": "La primera crisis de liderazgo del NT fueron las viudas helenistas desatendidas en la distribución de alimentos."
  },
  {
    "textEn": "4. The apostles' response to the Acts 6 crisis was to:",
    "textEs": "4. La respuesta de los apóstoles a la crisis de Hechos 6 fue:",
    "optionsEn": [
      "Solve it themselves",
      "Ignore it",
      "Identify qualified men, have the congregation choose them, and commission them publicly",
      "Form a committee to study it"
    ],
    "optionsEs": [
      "Resolverlo ellos mismos",
      "Ignorarlo",
      "Identificar hombres calificados, hacer que la congregación los eligiera, y comisionarlos públicamente",
      "Formar un comité para estudiarlo"
    ],
    "c": 44,
    "explEn": "The apostles had the congregation choose qualified men and commissioned them publicly.",
    "explEs": "Los apóstoles hicieron que la congregación eligiera hombres calificados y los comisionaron públicamente."
  },
  {
    "textEn": "5. The immediate result of delegation in Acts 6:7 was:",
    "textEs": "5. El resultado inmediato de la delegación en Hechos 6:7 fue:",
    "optionsEn": [
      "The word of God spread and disciples multiplied greatly",
      "The dispute deepened",
      "Persecution broke out",
      "The apostles took control again"
    ],
    "optionsEs": [
      "La Palabra de Dios se extendió y los discípulos se multiplicaron grandemente",
      "La disputa se profundizó",
      "Estalló la persecución",
      "Los apóstoles tomaron control de nuevo"
    ],
    "c": 49,
    "explEn": "The immediate result in Acts 6:7 was the word spread and disciples multiplied greatly.",
    "explEs": "El resultado inmediato en Hechos 6:7 fue que la palabra se difundió y los discípulos se multiplicaron."
  },
  {
    "textEn": "6. New Orleans Baptist Theological Seminary ran a Bible school inside Angola Prison that trained inmates through:",
    "textEs": "6. El Seminario Teológico Bautista de Nueva Orleans dirigía una escuela bíblica dentro de la Prisión de Angola que entrenaba reclusos hasta:",
    "optionsEn": [
      "Two-year certificates only",
      "Master's degrees only",
      "Short-term seminars only",
      "The bachelor's degree in theology"
    ],
    "optionsEs": [
      "Solo certificados de dos años",
      "Solo maestrías",
      "Solo seminarios de corto plazo",
      "La licenciatura en teología"
    ],
    "c": 59,
    "explEn": "New Orleans Seminary trained Angola inmates through the bachelor's degree in theology.",
    "explEs": "El Seminario de Nueva Orleans entrenó a reclusos de Angola por la licenciatura en teología."
  },
  {
    "textEn": "7. Within a few years the professor's facility had how many inmate chaplains serving?",
    "textEs": "7. Dentro de unos pocos años la instalación del profesor tenía ¿cuántos capellanes reclusos sirviendo?",
    "optionsEn": [
      "Two or three",
      "Four or five",
      "Eight or nine",
      "Six or seven"
    ],
    "optionsEs": [
      "Dos o tres",
      "Cuatro o cinco",
      "Ocho o nueve",
      "Seis o siete"
    ],
    "c": 65,
    "explEn": "Within a few years the professor's facility had eight or nine inmate chaplains serving.",
    "explEs": "En pocos años la instalación del profesor tenía ocho o nueve capellanes reclusos sirviendo."
  },
  {
    "textEn": "8. The professor's leadership philosophy when each new inmate chaplain arrived was:",
    "textEs": "8. La filosofía de liderazgo del profesor cuando cada nuevo capellán recluso llegaba era:",
    "optionsEn": [
      "You work for me; do exactly what I tell you",
      "I am not here as your boss. I am here as your co-worker. God called you here. Find your ministry and do it.",
      "I will train you for two years before you serve",
      "Wait for assignment from administration"
    ],
    "optionsEs": [
      "Tú trabajas para mí; haz exactamente lo que te digo",
      "No estoy aquí como tu jefe. Estoy aquí como tu compañero. Dios te llamó aquí. Encuentra tu ministerio y hazlo.",
      "Te entrenaré por dos años antes de que sirvas",
      "Espera asignación de la administración"
    ],
    "c": 71,
    "explEn": "The professor told each chaplain: I am not your boss, I am your co-worker; find your ministry.",
    "explEs": "El profesor le decía a cada capellán: no soy tu jefe, soy tu colaborador; encuentra tu ministerio."
  },
  {
    "textEn": "9. The two New Testament offices for ongoing church leadership are:",
    "textEs": "9. Los dos oficios del Nuevo Testamento para el liderazgo continuo de la iglesia son:",
    "optionsEn": [
      "Apostle and prophet",
      "Bishop and priest",
      "Evangelist and teacher",
      "Elder (overseer/pastor) and deacon"
    ],
    "optionsEs": [
      "Apóstol y profeta",
      "Obispo y sacerdote",
      "Evangelista y maestro",
      "Anciano (obispo/pastor) y diácono"
    ],
    "c": 80,
    "explEn": "The two New Testament leadership offices are elder (overseer/pastor) and deacon.",
    "explEs": "Los dos oficios de liderazgo del NT son anciano (obispo/pastor) y diácono."
  },
  {
    "textEn": "10. According to this unit, decisions made too fast:",
    "textEs": "10. Según esta unidad, las decisiones tomadas demasiado rápido:",
    "optionsEn": [
      "Crack later",
      "Show strong leadership",
      "Always work out",
      "Are biblically required"
    ],
    "optionsEs": [
      "Se quiebran después",
      "Muestran liderazgo fuerte",
      "Siempre funcionan",
      "Son bíblicamente requeridas"
    ],
    "c": 84,
    "explEn": "Decisions made too fast crack later; decisions made together hold.",
    "explEs": "Las decisiones tomadas demasiado rápido se agrietan después; las tomadas juntos se sostienen."
  },
  {
    "textEn": "11. The Acts 15 Jerusalem Council resolved a dispute about:",
    "textEs": "11. El Concilio de Jerusalén de Hechos 15 resolvió una disputa sobre:",
    "optionsEn": [
      "Who would replace Judas",
      "Whether Gentile believers must be circumcised and follow the Mosaic law",
      "Whether Paul was a true apostle",
      "How to organize church finances"
    ],
    "optionsEs": [
      "Quién reemplazaría a Judas",
      "Si los creyentes gentiles deben ser circuncidados y seguir la ley mosaica",
      "Si Pablo era un verdadero apóstol",
      "Cómo organizar las finanzas de la iglesia"
    ],
    "c": 92,
    "explEn": "The Acts 15 Jerusalem Council resolved whether Gentiles must be circumcised and keep the law.",
    "explEs": "El Concilio de Jerusalén en Hechos 15 resolvió si los gentiles debían circuncidarse y guardar la ley."
  },
  {
    "textEn": "12. The biblical model for personal conflict resolution (Matthew 18) begins with:",
    "textEs": "12. El modelo bíblico para la resolución de conflicto personal (Mateo 18) comienza con:",
    "optionsEn": [
      "Bringing it before the church",
      "Calling the pastor",
      "Going to the brother privately first",
      "Taking witnesses"
    ],
    "optionsEs": [
      "Traerlo ante la iglesia",
      "Llamar al pastor",
      "Ir al hermano en privado primero",
      "Tomar testigos"
    ],
    "c": 100,
    "explEn": "Matthew 18 conflict resolution begins with going to the brother privately first.",
    "explEs": "La resolución de conflictos de Mateo 18 comienza yendo al hermano en privado primero."
  },
  {
    "textEn": "13. Most modern church conflict skips:",
    "textEs": "13. La mayoría del conflicto moderno de la iglesia se salta:",
    "optionsEn": [
      "Talking to the person directly first",
      "The pastor's advice",
      "Reading Scripture",
      "Praying about it"
    ],
    "optionsEs": [
      "Hablar a la persona directamente primero",
      "El consejo del pastor",
      "Leer la Escritura",
      "Orar sobre ello"
    ],
    "c": 105,
    "explEn": "Most modern church conflict skips talking to the person directly first.",
    "explEs": "La mayoría del conflicto eclesial moderno omite hablar con la persona directamente primero."
  },
  {
    "textEn": "14. Gaius in 3 John was:",
    "textEs": "14. Gayo en 3 Juan era:",
    "optionsEn": [
      "A proud divisive leader",
      "A traveling missionary",
      "An unbelieving relative",
      "A faithful, hospitable, generous believer who walked in truth"
    ],
    "optionsEs": [
      "Un líder orgulloso y divisivo",
      "Un misionero viajero",
      "Un familiar no creyente",
      "Un creyente fiel, hospitalario, generoso que caminaba en la verdad"
    ],
    "c": 115,
    "explEn": "Gaius was a faithful, hospitable, generous believer who walked in truth.",
    "explEs": "Gayo era un creyente fiel, hospitalario y generoso que andaba en la verdad."
  },
  {
    "textEn": "15. Diotrephes in 3 John was characterized as:",
    "textEs": "15. Diótrefes en 3 Juan fue caracterizado como:",
    "optionsEn": [
      "A model deacon",
      "A proud leader who loved the preeminence and blocked others from ministry",
      "A traveling teacher",
      "A wealthy benefactor"
    ],
    "optionsEs": [
      "Un diácono modelo",
      "Un líder orgulloso que amaba el primado y bloqueaba a otros del ministerio",
      "Un maestro viajero",
      "Un benefactor rico"
    ],
    "c": 120,
    "explEn": "Diotrephes was a proud leader who loved the preeminence and blocked others from ministry.",
    "explEs": "Diótrefes era un líder orgulloso que amaba la preeminencia y bloqueaba a otros del ministerio."
  },
  {
    "textEn": "16. Demetrius in 3 John was:",
    "textEs": "16. Demetrio en 3 Juan era:",
    "optionsEn": [
      "A false teacher",
      "A church planter only",
      "A man of solid testimony from all who knew him",
      "A young convert"
    ],
    "optionsEs": [
      "Un falso maestro",
      "Solo un plantador de iglesias",
      "Un hombre de testimonio sólido de todos los que lo conocían",
      "Un nuevo convertido"
    ],
    "c": 128,
    "explEn": "Demetrius was a man of solid testimony from all who knew him.",
    "explEs": "Demetrio era un hombre de testimonio sólido de parte de todos los que lo conocían."
  },
  {
    "textEn": "17. The pastor's stewardship responsibilities include:",
    "textEs": "17. Las responsabilidades de mayordomía del pastor incluyen:",
    "optionsEn": [
      "Only money",
      "Time, money, building, and staff",
      "Only the calendar",
      "Only the building"
    ],
    "optionsEs": [
      "Solo dinero",
      "Tiempo, dinero, edificio, y personal",
      "Solo el calendario",
      "Solo el edificio"
    ],
    "c": 134,
    "explEn": "The pastor's stewardship covers time, money, building, and staff.",
    "explEs": "La mayordomía del pastor cubre el tiempo, el dinero, el edificio y el personal."
  },
  {
    "textEn": "18. The pastor does NOT have authority to:",
    "textEs": "18. El pastor NO tiene autoridad para:",
    "optionsEn": [
      "Preach the Word of God",
      "Lead in concert with deacons",
      "Teach sound doctrine",
      "Override Scripture for personal preference, abuse his position, or silence legitimate questions"
    ],
    "optionsEs": [
      "Predicar la Palabra de Dios",
      "Dirigir en concierto con diáconos",
      "Enseñar doctrina sana",
      "Anular la Escritura por preferencia personal, abusar de su posición, o silenciar preguntas legítimas"
    ],
    "c": 143,
    "explEn": "The pastor lacks authority to override Scripture, abuse his position, or silence legitimate questions.",
    "explEs": "El pastor carece de autoridad para anular la Escritura, abusar de su posición o silenciar preguntas legítimas."
  },
  {
    "textEn": "19. The pastor who pushes past the limits of his authority eventually:",
    "textEs": "19. El pastor que empuja más allá de los límites de su autoridad eventualmente:",
    "optionsEn": [
      "Loses everything",
      "Becomes more effective",
      "Earns more respect",
      "Builds a stronger church"
    ],
    "optionsEs": [
      "Lo pierde todo",
      "Se vuelve más efectivo",
      "Gana más respeto",
      "Construye una iglesia más fuerte"
    ],
    "c": 147,
    "explEn": "The pastor who pushes past the limits of his authority eventually loses everything.",
    "explEs": "El pastor que traspasa los límites de su autoridad eventualmente lo pierde todo."
  },
  {
    "textEn": "20. The faithful pastor's reward, per 1 Peter 5:4, is:",
    "textEs": "20. La recompensa del pastor fiel, según 1 Pedro 5:4, es:",
    "optionsEn": [
      "A larger congregation",
      "Recognition from the denomination",
      "The crown of glory that does not fade away when the Chief Shepherd appears",
      "Financial security"
    ],
    "optionsEs": [
      "Una congregación más grande",
      "Reconocimiento de la denominación",
      "La corona de gloria que no se desvanece cuando aparece el Príncipe de los Pastores",
      "Seguridad financiera"
    ],
    "c": 156,
    "explEn": "1 Peter 5:4 promises the unfading crown of glory when the Chief Shepherd appears.",
    "explEs": "1 Pedro 5:4 promete la corona incorruptible de gloria cuando aparezca el Príncipe de los pastores."
  }
];

const kwQuestions = [
  {
    "textEn": "21. Defend the claim that the pastor is a shepherd, not a CEO. Apply 1 Peter 5:2-3 and Hebrews 13:17 to a typical local church leadership culture.",
    "textEs": "21. Defienda la afirmación de que el pastor es un pastor de ovejas, no un CEO. Aplique 1 Pedro 5:2-3 y Hebreos 13:17 a una cultura típica de liderazgo de iglesia local.",
    "kw_en": [
      "shepherd",
      "ceo",
      "executive",
      "peter",
      "lord",
      "serve",
      "flock",
      "lead"
    ],
    "kw_es": [
      "pastor",
      "ceo",
      "ejecutivo",
      "pedro",
      "señorío",
      "servir",
      "rebaño",
      "dirig"
    ],
    "modelEn": "The pastor is a shepherd, not a corporate executive, and the difference is fundamental. 1 Peter 5:2-3 commands him to shepherd the flock not by compulsion or for dishonest gain, and not by lording over those entrusted to him, but as an example. Hebrews 13:17 frames his leadership as those who watch over souls and will give account — a shepherd's burden, not a manager's metrics. A CEO drives an organization toward profit by authority and command; a shepherd leads living souls by feeding, knowing, and going before them. When a pastor adopts a corporate leadership culture — top-down command, results at any cost, people as resources — he betrays the nature of the office. The flock is not a company and the members are not employees; they are blood-bought sheep belonging to Christ. The pastor leads as one who serves, not as one who reigns.",
    "modelEs": "El pastor es un pastor de ovejas, no un ejecutivo corporativo, y la diferencia es fundamental. 1 Pedro 5:2-3 le manda apacentar la grey no por fuerza ni por ganancia deshonesta, y no teniendo señorío sobre los que le son encomendados, sino siendo ejemplo. Hebreos 13:17 enmarca su liderazgo como los que velan por las almas y darán cuenta — una carga de pastor, no las métricas de un gerente. Un CEO impulsa una organización hacia la ganancia por autoridad y mando; un pastor dirige almas vivientes alimentándolas, conociéndolas y yendo delante de ellas. Cuando un pastor adopta una cultura de liderazgo corporativa — mando de arriba abajo, resultados a cualquier costo, la gente como recursos — traiciona la naturaleza del oficio. El rebaño no es una empresa y los miembros no son empleados; son ovejas compradas con sangre que pertenecen a Cristo. El pastor dirige como quien sirve, no como quien reina."
  },
  {
    "textEn": "22. Outline the Acts 6 leadership pattern. What did the apostles do, and what was the result? Why is this the foundational text for pastoral delegation?",
    "textEs": "22. Bosqueje el patrón de liderazgo de Hechos 6. ¿Qué hicieron los apóstoles, y cuál fue el resultado? ¿Por qué es este el texto fundamental para la delegación pastoral?",
    "kw_en": [
      "acts",
      "delegate",
      "widow",
      "apostle",
      "word",
      "multiply",
      "choose",
      "commission"
    ],
    "kw_es": [
      "hechos",
      "delegar",
      "viuda",
      "apóstol",
      "palabra",
      "multiplic",
      "elegir",
      "comisionar"
    ],
    "modelEn": "Acts 6 is the foundational text for pastoral delegation. When the Hellenistic widows were being neglected in the daily food distribution, the apostles did not try to do everything themselves; they recognized that they could not abandon the ministry of the word and prayer to wait tables. So they had the congregation identify qualified men, the people chose them, and the apostles commissioned them publicly. The result in Acts 6:7 was that the word of God spread and the number of disciples multiplied greatly. This is the pattern: leaders must guard their primary calling, delegate real responsibility to qualified others, and release them to serve. Delegation is not abdication or laziness; it is wisdom that frees the shepherd for what only he can do while multiplying ministry through others. A pastor who refuses to delegate strangles the church's growth and exhausts himself; the Acts 6 pattern produces both healthier leaders and a multiplying church.",
    "modelEs": "Hechos 6 es el texto fundamental para la delegación pastoral. Cuando las viudas helenistas estaban siendo desatendidas en la distribución diaria de alimentos, los apóstoles no intentaron hacer todo ellos mismos; reconocieron que no podían abandonar el ministerio de la palabra y la oración para servir las mesas. Así que hicieron que la congregación identificara hombres calificados, el pueblo los escogió, y los apóstoles los comisionaron públicamente. El resultado en Hechos 6:7 fue que la palabra de Dios se difundió y el número de discípulos se multiplicó grandemente. Este es el patrón: los líderes deben guardar su llamado principal, delegar responsabilidad real a otros calificados, y liberarlos para servir. La delegación no es abdicación ni pereza; es sabiduría que libera al pastor para lo que solo él puede hacer mientras multiplica el ministerio a través de otros. Un pastor que rehúsa delegar estrangula el crecimiento de la iglesia y se agota a sí mismo; el patrón de Hechos 6 produce líderes más sanos y una iglesia que se multiplica."
  },
  {
    "textEn": "23. Apply the professor's experience with NOBTS-trained inmate chaplains as a real-life case study in Acts 6 delegation. What did his philosophy 'I am not your boss; I am your co-worker' accomplish?",
    "textEs": "23. Aplique la experiencia del profesor con capellanes reclusos entrenados por NOBTS como un caso de estudio real en la delegación de Hechos 6. ¿Qué logró su filosofía 'No soy su jefe; soy su compañero'?",
    "kw_en": [
      "inmate",
      "chaplain",
      "co-worker",
      "boss",
      "delegate",
      "empower",
      "ministry",
      "trust"
    ],
    "kw_es": [
      "recluso",
      "capellán",
      "colaborador",
      "jefe",
      "delegar",
      "empoderar",
      "ministerio",
      "confianza"
    ],
    "modelEn": "The professor's experience training inmate chaplains at Angola, through New Orleans Seminary's program that took men through a bachelor's in theology, is a living case study in Acts 6 delegation. Within a few years his facility had eight or nine inmate chaplains serving. His philosophy when each new chaplain arrived was telling: 'I am not here as your boss. I am here as your co-worker. God called you here. Find your ministry and do it.' This accomplished what command-and-control never could — it released gifted men into real ownership of their ministry rather than keeping them dependent on him. By refusing to be the boss, he multiplied shepherds; by treating them as co-workers called by God, he gave them dignity and responsibility. This is the heart of biblical delegation: not handing out tasks to subordinates, but recognizing God's call in others and empowering them to find and do their ministry. The pastor who leads this way builds leaders, not followers.",
    "modelEs": "La experiencia del profesor entrenando capellanes reclusos en Angola, mediante el programa del Seminario de Nueva Orleans que llevaba a los hombres por una licenciatura en teología, es un caso de estudio vivo de la delegación de Hechos 6. En pocos años su instalación tenía ocho o nueve capellanes reclusos sirviendo. Su filosofía cuando cada nuevo capellán llegaba era reveladora: 'No estoy aquí como tu jefe. Estoy aquí como tu colaborador. Dios te llamó aquí. Encuentra tu ministerio y hazlo.' Esto logró lo que el mando y control nunca pudo — liberó a hombres dotados a una verdadera apropiación de su ministerio en vez de mantenerlos dependientes de él. Al rehusar ser el jefe, multiplicó pastores; al tratarlos como colaboradores llamados por Dios, les dio dignidad y responsabilidad. Este es el corazón de la delegación bíblica: no repartir tareas a subordinados, sino reconocer el llamado de Dios en otros y empoderarlos para encontrar y hacer su ministerio. El pastor que dirige así construye líderes, no seguidores."
  },
  {
    "textEn": "24. Discuss the cultivation of a pastor's relationship with his deacons and elders. Why does retreating to unilateral control destroy this relationship over time?",
    "textEs": "24. Discuta el cultivo de la relación de un pastor con sus diáconos y ancianos. ¿Por qué retirarse al control unilateral destruye esta relación con el tiempo?",
    "kw_en": [
      "deacon",
      "elder",
      "relationship",
      "unilateral",
      "control",
      "trust",
      "team",
      "destroy"
    ],
    "kw_es": [
      "diácono",
      "anciano",
      "relación",
      "unilateral",
      "control",
      "confianza",
      "equipo",
      "destruir"
    ],
    "modelEn": "The pastor must cultivate his relationship with his deacons and elders, the two New Testament offices for ongoing church leadership, because these men are his partners, not his rivals or his rubber stamp. This relationship is built slowly through trust, honesty, shared prayer, and genuine collaboration over years. When a pastor retreats to unilateral control — making decisions alone, presenting them as done deals, treating the leaders as obstacles to be managed — he destroys this relationship over time. Each unilateral move spends trust, and trust spent is hard to recover; eventually the leaders disengage or organize against him. A wise pastor leads with his deacons and elders, not over them, valuing their counsel even when he could legally override it. The strength of a church's leadership is the strength of the trust among its leaders, and that trust is either patiently built or carelessly destroyed by how the pastor handles shared authority.",
    "modelEs": "El pastor debe cultivar su relación con sus diáconos y ancianos, los dos oficios del Nuevo Testamento para el liderazgo continuo de la iglesia, porque estos hombres son sus socios, no sus rivales ni su sello de goma. Esta relación se construye lentamente mediante la confianza, la honestidad, la oración compartida y la colaboración genuina a lo largo de los años. Cuando un pastor se repliega al control unilateral — tomando decisiones solo, presentándolas como hechos consumados, tratando a los líderes como obstáculos a manejar — destruye esta relación con el tiempo. Cada movimiento unilateral gasta confianza, y la confianza gastada es difícil de recuperar; eventualmente los líderes se desconectan o se organizan contra él. Un pastor sabio dirige con sus diáconos y ancianos, no sobre ellos, valorando su consejo aun cuando legalmente podría anularlo. La fuerza del liderazgo de una iglesia es la fuerza de la confianza entre sus líderes, y esa confianza se construye pacientemente o se destruye descuidadamente por cómo el pastor maneja la autoridad compartida."
  },
  {
    "textEn": "25. Apply the wisdom that 'decisions made too fast crack later' and 'decisions made together hold' to a real church scenario. Why does the Jerusalem Council in Acts 15 model this?",
    "textEs": "25. Aplique la sabiduría de que 'las decisiones tomadas demasiado rápido se quiebran después' y 'las decisiones tomadas juntos se sostienen' a un escenario real de iglesia. ¿Por qué modela esto el Concilio de Jerusalén en Hechos 15?",
    "kw_en": [
      "decision",
      "slow",
      "together",
      "crack",
      "council",
      "acts",
      "consensus",
      "hold"
    ],
    "kw_es": [
      "decisión",
      "lento",
      "juntos",
      "agrieta",
      "concilio",
      "hechos",
      "consenso",
      "sostiene"
    ],
    "modelEn": "The wisdom that 'decisions made too fast crack later' and 'decisions made together hold' applies to nearly every significant church decision. A pastor who pushes a major change through quickly, by force of personality or a narrow vote, will often find it cracking later as resentment surfaces and support erodes. But a decision reached together, with patient discussion until the leaders genuinely own it, holds under pressure. The Jerusalem Council in Acts 15 models this: faced with the explosive question of whether Gentile believers must be circumcised, the apostles and elders did not rush; they gathered, debated openly, heard testimony, searched the Scriptures, and reached a conclusion the whole assembly could embrace, sending it out as 'it seemed good to the Holy Spirit and to us.' The lesson for a church scenario is patience: the extra weeks spent building genuine consensus save years of conflict, and a decision the people helped make is a decision the people will keep.",
    "modelEs": "La sabiduría de que 'las decisiones tomadas demasiado rápido se agrietan después' y 'las decisiones tomadas juntos se sostienen' aplica a casi toda decisión eclesial significativa. Un pastor que empuja un cambio mayor rápidamente, por fuerza de personalidad o un voto estrecho, a menudo lo verá agrietarse después mientras el resentimiento sale a la superficie y el apoyo se erosiona. Pero una decisión alcanzada juntos, con discusión paciente hasta que los líderes genuinamente la hacen suya, se sostiene bajo presión. El Concilio de Jerusalén en Hechos 15 modela esto: ante la explosiva pregunta de si los creyentes gentiles debían circuncidarse, los apóstoles y ancianos no se apresuraron; se reunieron, debatieron abiertamente, oyeron testimonio, escudriñaron las Escrituras, y llegaron a una conclusión que toda la asamblea pudo abrazar, enviándola como 'ha parecido bien al Espíritu Santo y a nosotros.' La lección para un escenario eclesial es la paciencia: las semanas extra invertidas en construir consenso genuino ahorran años de conflicto, y una decisión que el pueblo ayudó a tomar es una decisión que el pueblo guardará."
  },
  {
    "textEn": "26. Explain Matthew 18 conflict resolution. Why is the failure to go directly to the brother first the root of most modern church conflict?",
    "textEs": "26. Explique la resolución de conflicto de Mateo 18. ¿Por qué el fracaso de ir directamente al hermano primero es la raíz de la mayoría del conflicto moderno de la iglesia?",
    "kw_en": [
      "matthew",
      "conflict",
      "private",
      "directly",
      "brother",
      "resolution",
      "first",
      "go"
    ],
    "kw_es": [
      "mateo",
      "conflicto",
      "privado",
      "directamente",
      "hermano",
      "resolución",
      "primero",
      "ir"
    ],
    "modelEn": "Matthew 18 lays out Jesus' pattern for personal conflict resolution: if your brother sins against you, go and tell him his fault between you and him alone — privately, directly, first. Only if he will not hear do you bring one or two others, and only then the church. The genius is in the first step, and the root of most modern church conflict is precisely the failure to take it. Instead of going directly to the brother, the offended person tells everyone else — spouses, friends, the parking-lot coalition — until a private offense becomes a public faction. By the time it reaches the pastor, the conflict has metastasized through gossip and triangulation. If God's people simply obeyed Matthew 18 and went directly and privately to the one who offended them, most church splits would never happen. The pastor must teach this pattern relentlessly and model it himself, refusing to entertain complaints about someone the complainer has not first approached directly.",
    "modelEs": "Mateo 18 expone el patrón de Jesús para la resolución de conflictos personales: si tu hermano peca contra ti, ve y repréndele estando tú y él solos — en privado, directamente, primero. Solo si no oye traes a uno o dos más, y solo entonces a la iglesia. El genio está en el primer paso, y la raíz de la mayoría del conflicto eclesial moderno es precisamente la falla en darlo. En vez de ir directamente al hermano, la persona ofendida se lo dice a todos los demás — cónyuges, amigos, la coalición del estacionamiento — hasta que una ofensa privada se vuelve una facción pública. Para cuando llega al pastor, el conflicto ha hecho metástasis por el chisme y la triangulación. Si el pueblo de Dios simplemente obedeciera Mateo 18 y fuera directa y privadamente al que lo ofendió, la mayoría de las divisiones eclesiales nunca ocurrirían. El pastor debe enseñar este patrón sin cesar y modelarlo él mismo, rehusando atender quejas sobre alguien a quien el quejoso no ha abordado primero directamente."
  },
  {
    "textEn": "27. Identify and contrast the three leadership types in 3 John (Gaius, Diotrephes, Demetrius). How does the faithful pastor recognize and respond to each?",
    "textEs": "27. Identifique y contraste los tres tipos de líderes en 3 Juan (Gayo, Diótrefes, Demetrio). ¿Cómo reconoce y responde el pastor fiel a cada uno?",
    "kw_en": [
      "gaius",
      "diotrephes",
      "demetrius",
      "proud",
      "faithful",
      "preeminence",
      "testimony",
      "recognize"
    ],
    "kw_es": [
      "gayo",
      "diótrefes",
      "demetrio",
      "orgulloso",
      "fiel",
      "preeminencia",
      "testimonio",
      "reconocer"
    ],
    "modelEn": "Third John presents three contrasting leadership types the pastor must learn to recognize and respond to. Gaius was a faithful, hospitable, generous believer who walked in truth — the kind of member who quietly strengthens a church, and whom the pastor should honor, encourage, and lean on. Diotrephes loved the preeminence, was proud, and blocked others from ministry, even refusing to receive the apostle's emissaries — the controlling figure every church seems to have, whom the pastor must confront with courage rather than appease. Demetrius was a man of solid testimony from all who knew him — the trustworthy servant whose reputation commends him, worth commissioning and following. The faithful pastor recognizes each: he treasures the Gaiuses, he lovingly but firmly resists the Diotrepheses who would seize control, and he raises up the Demetriuses of proven character. Misreading these three — coddling a Diotrephes or overlooking a Gaius — wrecks a church's leadership.",
    "modelEs": "Tercera de Juan presenta tres tipos contrastantes de liderazgo que el pastor debe aprender a reconocer y a los cuales responder. Gayo era un creyente fiel, hospitalario y generoso que andaba en la verdad — el tipo de miembro que fortalece silenciosamente una iglesia, y a quien el pastor debe honrar, animar y en quien apoyarse. Diótrefes amaba la preeminencia, era orgulloso y bloqueaba a otros del ministerio, rehusando aun recibir a los emisarios del apóstol — la figura controladora que toda iglesia parece tener, a quien el pastor debe confrontar con valentía en vez de apaciguar. Demetrio era un hombre de testimonio sólido de parte de todos los que lo conocían — el siervo confiable cuya reputación lo recomienda, digno de comisionar y seguir. El pastor fiel reconoce a cada uno: atesora a los Gayos, resiste amorosa pero firmemente a los Diótrefes que tomarían el control, y levanta a los Demetrios de carácter probado. Malinterpretar a estos tres — consentir a un Diótrefes o pasar por alto a un Gayo — arruina el liderazgo de una iglesia."
  },
  {
    "textEn": "28. Discuss the pastor's stewardship of time, money, building, and staff. Which of these is most easily neglected by pastors, and what are the consequences?",
    "textEs": "28. Discuta la mayordomía del pastor del tiempo, dinero, edificio, y personal. ¿Cuál de estos es más fácilmente descuidado por los pastores, y cuáles son las consecuencias?",
    "kw_en": [
      "steward",
      "time",
      "money",
      "building",
      "staff",
      "neglect",
      "manage",
      "account"
    ],
    "kw_es": [
      "mayordom",
      "tiempo",
      "dinero",
      "edificio",
      "personal",
      "descuid",
      "administrar",
      "cuenta"
    ],
    "modelEn": "The pastor is a steward of several resources — time, money, building, and staff — none of which truly belong to him, all of which he will give account for. He stewards time by guarding his hours for what matters most rather than letting the urgent crowd out the important. He stewards money with scrupulous integrity and transparency, since nothing destroys trust faster than financial carelessness or self-dealing. He stewards the building as a tool for ministry, neither idolizing it nor neglecting it. He stewards staff by developing, supporting, and holding accountable those who serve alongside him. Of these, time is often the most easily neglected, because it has no line item and no committee watching it; a pastor can waste years in busyness that produces nothing eternal, or pour his hours into the trivial while souls go untended. The consequence of poor time stewardship is a ministry that looks busy but bears little fruit, and a man who reaches the end with regret.",
    "modelEs": "El pastor es mayordomo de varios recursos — tiempo, dinero, edificio y personal — ninguno de los cuales le pertenece verdaderamente, de todos los cuales dará cuenta. Administra el tiempo guardando sus horas para lo que más importa en vez de dejar que lo urgente desplace lo importante. Administra el dinero con integridad y transparencia escrupulosas, ya que nada destruye la confianza más rápido que el descuido financiero o el beneficio propio. Administra el edificio como una herramienta para el ministerio, ni idolatrándolo ni descuidándolo. Administra al personal desarrollando, apoyando y haciendo responsables a los que sirven junto a él. De estos, el tiempo es a menudo el más fácilmente descuidado, porque no tiene partida presupuestaria ni comité que lo vigile; un pastor puede desperdiciar años en ajetreo que no produce nada eterno, o verter sus horas en lo trivial mientras las almas quedan sin atender. La consecuencia de la mala mayordomía del tiempo es un ministerio que parece ocupado pero da poco fruto, y un hombre que llega al final con remordimiento."
  },
  {
    "textEn": "29. Defend the principle that the pastor's authority has limits. Identify what he has authority to do and what he does NOT have authority to do.",
    "textEs": "29. Defienda el principio de que la autoridad del pastor tiene límites. Identifique lo que tiene autoridad para hacer y lo que NO tiene autoridad para hacer.",
    "kw_en": [
      "authority",
      "limit",
      "scripture",
      "abuse",
      "override",
      "silence",
      "servant",
      "boundary"
    ],
    "kw_es": [
      "autoridad",
      "límite",
      "escritura",
      "abuso",
      "anular",
      "silenciar",
      "siervo",
      "límite"
    ],
    "modelEn": "The pastor's authority is real but limited, and recognizing its limits guards both him and the church. He has authority to preach and teach the Word, to lead the church in its mission, to guard sound doctrine, to oversee and shepherd. But he does NOT have authority to override Scripture for his personal preference, to abuse his position for power or gain, or to silence legitimate questions from the people he serves. His authority is derived and delegated — it comes from Christ through the Word, not from his own person — so it ends exactly where Scripture ends. A pastor who pushes past these limits, who treats his preferences as commands and dissent as rebellion, eventually loses everything: trust, leaders, congregation, and sometimes his ministry altogether. The authority of the shepherd is the authority of a servant under a Master, never the authority of a tyrant over subjects. Knowing what he may not do is as important as knowing what he may.",
    "modelEs": "La autoridad del pastor es real pero limitada, y reconocer sus límites lo guarda a él y a la iglesia. Tiene autoridad para predicar y enseñar la Palabra, para dirigir a la iglesia en su misión, para guardar la sana doctrina, para supervisar y pastorear. Pero NO tiene autoridad para anular la Escritura por su preferencia personal, para abusar de su posición por poder o ganancia, ni para silenciar preguntas legítimas del pueblo que sirve. Su autoridad es derivada y delegada — viene de Cristo a través de la Palabra, no de su propia persona — así que termina exactamente donde termina la Escritura. Un pastor que traspasa estos límites, que trata sus preferencias como mandatos y el disentimiento como rebelión, eventualmente lo pierde todo: confianza, líderes, congregación, y a veces su ministerio entero. La autoridad del pastor es la autoridad de un siervo bajo un Maestro, nunca la autoridad de un tirano sobre súbditos. Saber lo que no puede hacer es tan importante como saber lo que sí puede."
  },
  {
    "textEn": "30. Synthesize the entire unit: How does a pastor who shepherds rather than lords, delegates wisely, decides slowly, handles conflict biblically, and stewards faithfully build a church that endures past his own ministry?",
    "textEs": "30. Sintetice toda la unidad: ¿Cómo un pastor que pastorea en lugar de enseñorearse, delega sabiamente, decide lentamente, maneja el conflicto bíblicamente, y administra fielmente edifica una iglesia que perdura más allá de su propio ministerio?",
    "kw_en": [
      "shepherd",
      "delegate",
      "slow",
      "conflict",
      "steward",
      "endure",
      "trust",
      "lead"
    ],
    "kw_es": [
      "pastor",
      "delegar",
      "lento",
      "conflicto",
      "mayordom",
      "perdura",
      "confianza",
      "dirig"
    ],
    "modelEn": "A pastor builds a church that endures past his own ministry by leading the way a shepherd leads, not the way an executive commands. He shepherds rather than lords, remembering the flock belongs to Christ. He delegates wisely after the Acts 6 pattern, multiplying ministry through others rather than hoarding it. He decides slowly and together, knowing that decisions made too fast crack while decisions made together hold. He handles conflict biblically through Matthew 18, going directly and privately first. He stewards time, money, building, and staff with integrity, and he keeps within the limits of his God-given authority. Each of these builds trust, and trust is the currency that lets a church survive transitions and outlast any single leader. The pastor who leads this way leaves behind not a personality cult that collapses when he goes, but a healthy body of equipped leaders who carry the work forward, because he led like the Chief Shepherd whose under-shepherd he was.",
    "modelEs": "Un pastor construye una iglesia que perdura más allá de su propio ministerio dirigiendo como dirige un pastor de ovejas, no como manda un ejecutivo. Pastorea en vez de enseñorearse, recordando que el rebaño pertenece a Cristo. Delega sabiamente según el patrón de Hechos 6, multiplicando el ministerio a través de otros en vez de acapararlo. Decide lentamente y en conjunto, sabiendo que las decisiones tomadas demasiado rápido se agrietan mientras que las tomadas juntos se sostienen. Maneja el conflicto bíblicamente mediante Mateo 18, yendo directa y privadamente primero. Administra el tiempo, el dinero, el edificio y el personal con integridad, y se mantiene dentro de los límites de su autoridad dada por Dios. Cada uno de estos construye confianza, y la confianza es la moneda que permite a una iglesia sobrevivir las transiciones y sobrevivir a cualquier líder individual. El pastor que dirige así deja detrás no un culto a la personalidad que colapsa cuando se va, sino un cuerpo sano de líderes equipados que llevan la obra adelante, porque dirigió como el Príncipe de los pastores de quien era subpastor."
  }
];

const PREV_HREF = 'CTSPMUnit8.html';

const NEXT_HREF = 'CTSPMUnit10.html';
