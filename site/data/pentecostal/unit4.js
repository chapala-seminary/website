/* CTSPentecostal - unit 4: per-unit configuration and content. */

const UNIT = 4;

var SKEY = `cts_u${UNIT}_tongues`;

var MCQ = [
 { correct:0,
   q:{en:"On the day of Pentecost, the tongues that were spoken were —",
      es:"En el día de Pentecostés, las lenguas que se hablaron fueron —"},
   opts:[
     {en:"known human languages the pilgrims recognized", es:"idiomas humanos conocidos que los peregrinos reconocían"},
     {en:"an unknown, ecstatic prayer language", es:"una lengua de oración desconocida y extática"},
     {en:"understood only by the apostles", es:"entendidas sólo por los apóstoles"},
     {en:"written, not spoken", es:"escritas, no habladas"} ],
   exp:{en:"The crowd heard their own native languages (Acts 2:6, 8). Pentecost was a reversal of Babel, not ecstatic speech.",
        es:"La multitud oyó sus propios idiomas nativos (Hechos 2:6, 8). Pentecostés fue una reversión de Babel, no un hablar extático."} },

 { correct:2,
   q:{en:"Acts 1:8 functions in the book as —",
      es:"Hechos 1:8 funciona en el libro como —"},
   opts:[
     {en:"a warning against missions", es:"una advertencia contra las misiones"},
     {en:"a promise fulfilled only at Pentecost", es:"una promesa cumplida sólo en Pentecostés"},
     {en:"the geographic outline of the whole book", es:"el bosquejo geográfico de todo el libro"},
     {en:"a command to remain in Jerusalem forever", es:"un mandato de permanecer en Jerusalén para siempre"} ],
   exp:{en:"Jerusalem → Judea and Samaria → the ends of the earth maps the entire narrative of Acts.",
        es:"Jerusalén → Judea y Samaria → lo último de la tierra traza toda la narrativa de Hechos."} },

 { correct:1,
   q:{en:"In Acts 8, concerning the Samaritans, Luke —",
      es:"En Hechos 8, respecto a los samaritanos, Lucas —"},
   opts:[
     {en:"explicitly says they spoke in tongues", es:"dice explícitamente que hablaron en lenguas"},
     {en:"does not actually state that they spoke in tongues", es:"en realidad no afirma que hablaran en lenguas"},
     {en:"says they refused the Spirit", es:"dice que rechazaron al Espíritu"},
     {en:"records no response at all", es:"no registra ninguna respuesta"} ],
   exp:{en:"Luke leaves it unstated. Something visible happened (Simon's reaction), but tongues are never named.",
        es:"Lucas lo deja sin decir. Algo visible ocurrió (la reacción de Simón), pero nunca se nombran las lenguas."} },

 { correct:3,
   q:{en:"The most likely reason the Spirit's coming was delayed in Samaria until the apostles arrived was —",
      es:"La razón más probable de que la venida del Espíritu se demorara en Samaria hasta que llegaron los apóstoles fue —"},
   opts:[
     {en:"to punish the Samaritans", es:"para castigar a los samaritanos"},
     {en:"because Philip lacked faith", es:"porque a Felipe le faltaba fe"},
     {en:"because tongues are always required first", es:"porque las lenguas siempre se requieren primero"},
     {en:"to preserve the unity of the one church", es:"para preservar la unidad de la única iglesia"} ],
   exp:{en:"Apostolic witness kept Jewish and Samaritan believers one church rather than two rival bodies.",
        es:"El testimonio apostólico mantuvo a judíos y samaritanos como una sola iglesia y no dos cuerpos rivales."} },

 { correct:1,
   q:{en:"In the house of Cornelius (Acts 10), the tongues chiefly served to —",
      es:"En la casa de Cornelio (Hechos 10), las lenguas sirvieron principalmente para —"},
   opts:[
     {en:"show the Gentiles were superior", es:"mostrar que los gentiles eran superiores"},
     {en:"prove God accepted Gentiles by faith on the same footing as Jews", es:"probar que Dios aceptó a los gentiles por la fe sobre la misma base que a los judíos"},
     {en:"replace the preaching of the gospel", es:"reemplazar la predicación del evangelio"},
     {en:"begin a new law for Gentiles", es:"iniciar una nueva ley para los gentiles"} ],
   exp:{en:"The sign convinced Jewish believers; Peter later appealed to it to defend Gentile inclusion.",
        es:"La señal convenció a los creyentes judíos; Pedro luego apeló a ella para defender la inclusión de los gentiles."} },

 { correct:0,
   q:{en:"The principle that Acts \u201Cdescribes\u201D rather than automatically \u201Cprescribes\u201D means that —",
      es:"El principio de que Hechos \u201Cdescribe\u201D en lugar de \u201Cprescribir\u201D automáticamente significa que —"},
   opts:[
     {en:"we should not build a universal required pattern from varied narratives, and also should not declare the gift invalid", es:"no debemos construir un patrón universal obligatorio a partir de narrativas variadas, ni tampoco declarar inválido el don"},
     {en:"the events in Acts are untrue", es:"los sucesos de Hechos no son verdaderos"},
     {en:"we may ignore the book of Acts", es:"podemos ignorar el libro de Hechos"},
     {en:"tongues have certainly ceased", es:"las lenguas ciertamente han cesado"} ],
   exp:{en:"The principle cuts both ways. How the gifts function in church life is settled by the epistles, not by narrative alone.",
        es:"El principio corta en ambas direcciones. Cómo funcionan los dones en la vida de la iglesia lo definen las epístolas, no la narrativa sola."} },

 { correct:2,
   q:{en:"A biblically balanced conclusion from this unit is that —",
      es:"Una conclusión bíblicamente equilibrada de esta unidad es que —"},
   opts:[
     {en:"tongues is the required initial evidence for every believer", es:"las lenguas son la evidencia inicial requerida para todo creyente"},
     {en:"the gift of tongues is invalid today", es:"el don de lenguas es inválido hoy"},
     {en:"the gift is genuine, yet tongues is not the mandatory proof of receiving the Spirit", es:"el don es genuino, pero las lenguas no son la prueba obligatoria de recibir el Espíritu"},
     {en:"Pentecostals are not true Christians", es:"los pentecostales no son verdaderos cristianos"} ],
   exp:{en:"Affirm the gift; decline the required-evidence doctrine; receive fellow believers as family in Christ.",
        es:"Afirmar el don; rechazar la doctrina de la evidencia requerida; recibir a los hermanos como familia en Cristo."} }
];

var SA = [
 { kw:{ en:["languages","known","understood","native","babel","human","nations","heard"],
        es:["lenguas","conocidas","entend","propias","babel","humanas","naciones","multitud"] },
   q:{en:"Explain why it is a stretch to treat the tongues of Pentecost (Acts 2) as an unknown or ecstatic tongue.",
      es:"Explique por qué es exagerado tratar las lenguas de Pentecostés (Hechos 2) como una lengua desconocida o extática."},
   model:{en:"At Pentecost the crowd heard the disciples praising God in their own native languages, so the tongues were real, known human languages, not unintelligible speech. This was a reversal of Babel, gathering the nations by giving the disciples their languages. Because everyone understood, it is a stretch to read Pentecost as an unknown or ecstatic tongue.",
          es:"En Pentecostés la multitud oyó a los discípulos alabar a Dios en sus propias lenguas nativas, de modo que fueron lenguas humanas verdaderas y conocidas, no un hablar ininteligible. Fue una reversión de Babel, reuniendo a las naciones. Como todos entendían, es exagerado leer Pentecostés como una lengua desconocida o extática."} },

 { kw:{ en:["gift","forbid","evidence","blessing","universal","vary","affirm","regulate"],
        es:["don","prohibir","evidencia","bendicion","universal","varian","afirmamos","regula"] },
   q:{en:"Distinguish the two questions the Pentecostal movement raises about tongues, and state how you would answer each from Scripture.",
      es:"Distinga las dos preguntas que el movimiento pentecostal plantea sobre las lenguas, y diga cómo respondería cada una desde la Escritura."},
   model:{en:"The first question is whether the gift of tongues is real and available; Scripture answers yes, since Paul regulates tongues and tells the church not to forbid them. The second question is whether tongues is the required initial evidence of a second blessing every believer must have; Acts gives no universal rule, since the accounts vary and most believers never speak in tongues. So we affirm the gift while declining the required evidence.",
          es:"La primera pregunta es si el don de lenguas es real y está disponible; la Escritura responde que sí, pues Pablo lo regula y manda a la iglesia no prohibirlo. La segunda pregunta es si las lenguas son la evidencia inicial requerida de una segunda bendición que todo creyente debe recibir; Hechos no da ninguna regla universal, pues los relatos varían y la mayoría nunca habla en lenguas. Así afirmamos el don y a la vez rechazamos la evidencia requerida."} },

 { kw:{ en:["narrative","describe","command","pattern","invalid","epistles","repeat","varied"],
        es:["narrativa","describe","manda","patron","invalido","epistolas","repita","variados"] },
   q:{en:"Explain the difference between description and prescription in Acts, and how it applies to tongues in both directions.",
      es:"Explique la diferencia entre descripción y prescripción en Hechos, y cómo se aplica a las lenguas en ambas direcciones."},
   model:{en:"Acts is narrative; it describes what happened but does not automatically command every believer to repeat it. This cuts two ways for tongues: we should not build a required pattern from the varied outpourings, yet we also must not declare the gift invalid, since narrative was not written to settle how gifts function. For that teaching we turn to the epistles.",
          es:"Hechos es narrativa; describe lo que sucedió pero no manda automáticamente que todo creyente lo repita. Esto corta en dos direcciones para las lenguas: no debemos construir un patrón obligatorio a partir de los derramamientos variados, pero tampoco debemos declarar inválido el don, pues la narrativa no fue escrita para definir cómo funcionan los dones. Para esa enseñanza acudimos a las epístolas."} }
];
