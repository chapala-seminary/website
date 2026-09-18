/* CTSPentecostal - unit 12: per-unit configuration and content. */

const UNIT = 12;

var SKEY = `cts_u${UNIT}_assessment`;

var MCQ = [
 { correct:3,
   q:{en:"The task of this capstone unit is threefold, and it deliberately refuses to —",
      es:"La tarea de esta unidad final es triple, y rehúsa deliberadamente —"},
   opts:[
     {en:"affirm anything that is good", es:"afirmar cualquier cosa que sea buena"},
     {en:"quote Scripture at all", es:"citar la Escritura en absoluto"},
     {en:"discuss the movement's history", es:"tratar la historia del movimiento"},
     {en:"collapse the assessment into a single verdict that the movement is simply right or simply wrong", es:"reducir la evaluación a un solo veredicto de que el movimiento es simplemente correcto o simplemente equivocado"} ],
   exp:{en:"The movement is not one thing and its questions are not all of one kind, so the unit affirms, declines, and leaves open rather than reaching for one verdict.",
        es:"El movimiento no es una sola cosa y sus preguntas no son todas de una misma clase, así que la unidad afirma, declina y deja abierto en vez de alcanzar un solo veredicto."} },
 { correct:0,
   q:{en:"The method that guided the whole course keeps two questions apart, namely —",
      es:"El método que guió todo el curso mantiene dos preguntas separadas, a saber —"},
   opts:[
     {en:"whether a gift is real is one question; whether an experience is required of every believer is another", es:"si un don es real es una pregunta; si una experiencia se requiere de todo creyente es otra"},
     {en:"whether Scripture is inspired", es:"si la Escritura es inspirada"},
     {en:"whether the church should exist", es:"si la iglesia debe existir"},
     {en:"whether God answers prayer at all", es:"si Dios responde la oración en absoluto"} ],
   exp:{en:"Throughout the course, the reality of a gift and the requiring of an experience were kept distinct, and much confusion dissolved.",
        es:"A lo largo del curso, la realidad de un don y el requerir una experiencia se mantuvieron distintos, y mucha confusión se disolvió."} },
 { correct:2,
   q:{en:"Among the things this unit affirms is that —",
      es:"Entre las cosas que esta unidad afirma está que —"},
   opts:[
     {en:"tongues are required of every believer", es:"las lenguas se requieren de todo creyente"},
     {en:"wealth proves God's favor", es:"la riqueza prueba el favor de Dios"},
     {en:"the Holy Spirit is God, personally at work today, and the New Testament gifts are real", es:"el Espíritu Santo es Dios, personalmente obrando hoy, y los dones del Nuevo Testamento son reales"},
     {en:"experience outranks Scripture", es:"la experiencia supera a la Escritura"} ],
   exp:{en:"The affirmations come first and are many: the Spirit's deity and work, the reality of the gifts, and the movement's evangelistic fruit.",
        es:"Las afirmaciones vienen primero y son muchas: la deidad y obra del Espíritu, la realidad de los dones, y el fruto evangelístico del movimiento."} },
 { correct:1,
   q:{en:"Among the things this unit declines is —",
      es:"Entre las cosas que esta unidad declina está —"},
   opts:[
     {en:"that God still heals", es:"que Dios todavía sana"},
     {en:"the teaching that speaking in tongues is the required, universal evidence of the Spirit's baptism", es:"la enseñanza de que hablar en lenguas es la evidencia requerida y universal del bautismo del Espíritu"},
     {en:"the reality of the Spirit's gifts", es:"la realidad de los dones del Espíritu"},
     {en:"world evangelism", es:"la evangelización mundial"} ],
   exp:{en:"Scripture makes no rule that tongues must accompany every Spirit-baptism, so the unit declines that teaching, along with the prosperity gospel and the excesses.",
        es:"La Escritura no hace ninguna regla de que las lenguas deban acompañar todo bautismo del Espíritu, así que la unidad declina esa enseñanza, junto con el evangelio de la prosperidad y los excesos."} },
 { correct:0,
   q:{en:"The questions the unit deliberately leaves open include —",
      es:"Las preguntas que la unidad deja abiertas deliberadamente incluyen —"},
   opts:[
     {en:"whether the revelatory gifts continue or ceased, and whether “the perfect” is the canon or Christ's return", es:"si los dones revelatorios continúan o cesaron, y si “lo perfecto” es el canon o el regreso de Cristo"},
     {en:"whether the Holy Spirit is a person", es:"si el Espíritu Santo es una persona"},
     {en:"whether Christ rose from the dead", es:"si Cristo resucitó de los muertos"},
     {en:"whether the prosperity gospel is biblical", es:"si el evangelio de la prosperidad es bíblico"} ],
   exp:{en:"On genuinely disputed questions, faithful Christians differ with Scripture in hand, so the unit sets out each case and imposes no verdict.",
        es:"En preguntas genuinamente disputadas, cristianos fieles difieren con la Escritura en la mano, así que la unidad expone cada caso y no impone veredicto."} },
 { correct:3,
   q:{en:"The surest measure of any work claiming to be the Spirit's is —",
      es:"La medida más segura de cualquier obra que dice ser del Espíritu es —"},
   opts:[
     {en:"its noise and excitement", es:"su ruido y excitación"},
     {en:"the size of its crowds", es:"el tamaño de sus multitudes"},
     {en:"the number of its wonders", es:"el número de sus prodigios"},
     {en:"whether it glorifies Jesus Christ and makes His people more like Him", es:"si glorifica a Jesucristo y hace a su pueblo más semejante a Él"} ],
   exp:{en:"The Lord said the Spirit came to glorify the Son (John 16:14); Christ-centeredness is the test.",
        es:"El Señor dijo que el Espíritu vino a glorificar al Hijo (Juan 16:14); el estar centrado en Cristo es la prueba."} },
 { correct:1,
   q:{en:"Toward Christians who have weighed the same texts and reached different conclusions, the unit counsels —",
      es:"Hacia los cristianos que han sopesado los mismos textos y llegado a conclusiones diferentes, la unidad aconseja —"},
   opts:[
     {en:"sharp condemnation", es:"condenación cortante"},
     {en:"receiving them as brothers and sisters, reserving sharp words for real errors, not honest differences", es:"recibirlos como hermanos y hermanas, reservando las palabras cortantes para errores reales, no para diferencias honestas"},
     {en:"ending all fellowship", es:"terminar toda comunión"},
     {en:"ignoring Scripture", es:"ignorar la Escritura"} ],
   exp:{en:"Charity holds with truth: be clear where Scripture is clear, humble where it is not, and gracious toward honest difference.",
        es:"La caridad se sostiene con la verdad: sea claro donde la Escritura es clara, humilde donde no lo es, y amable hacia la diferencia honesta."} }
];

var SA = [
 { kw:{ en:["affirm","decline","open","verdict","movement","scripture","questions","refuse"],
        es:["afirmar","declinar","abiertas","veredicto","movimiento","escritura","preguntas","rehusa"] },
   q:{en:"State the three parts of this unit's biblical assessment and why it refuses to reduce them to a single verdict.",
      es:"Exponga las tres partes de la evaluación bíblica de esta unidad y por qué rehúsa reducirlas a un solo veredicto."},
   model:{en:"The assessment has three parts: to affirm what is true and good, to decline what fails the test of Scripture, and to leave open the questions Scripture does not settle. It refuses to reduce these to a single verdict because the movement is not one thing and its questions are not all of one kind; to call it simply right or simply wrong would flatten real distinctions. So the unit affirms the shared core, declines the genuine errors, and keeps the open questions open, measuring every part by Scripture.",
          es:"La evaluación tiene tres partes: afirmar lo que es verdadero y bueno, declinar lo que no pasa la prueba de la Escritura, y dejar abiertas las preguntas que la Escritura no resuelve. Rehúsa reducirlas a un solo veredicto porque el movimiento no es una sola cosa y sus preguntas no son todas de una misma clase; llamarlo simplemente correcto o simplemente equivocado aplanaría distinciones reales. Así la unidad afirma el núcleo compartido, declina los errores genuinos, y mantiene abiertas las preguntas abiertas, midiendo cada parte por la Escritura."} },
 { kw:{ en:["affirm","spirit","gifts","evangelism","decline","prosperity","experience","required"],
        es:["afirma","espiritu","dones","evangelismo","declina","prosperidad","experiencia","requerida"] },
   q:{en:"List three things this unit affirms and three it declines.",
      es:"Enumere tres cosas que esta unidad afirma y tres que declina."},
   model:{en:"The unit affirms that the Holy Spirit is God at work today, that the New Testament gifts are real and the desire for them is commanded, and that the movement has borne great evangelism fruit in carrying the gospel to the world. It declines the teaching that tongues are the required evidence of Spirit-baptism, the prosperity gospel that promises guaranteed wealth, and any spirit that exalts experience above Scripture or a gift above the Giver. In short, it affirms the Spirit's genuine work and declines the distortions of it.",
          es:"La unidad afirma que el Espíritu Santo es Dios obrando hoy, que los dones del Nuevo Testamento son reales y que el deseo de ellos es mandado, y que el movimiento ha dado gran fruto de evangelismo al llevar el evangelio al mundo. Declina la enseñanza de que las lenguas son la evidencia requerida del bautismo del Espíritu, el evangelio de la prosperidad que promete riqueza garantizada, y todo espíritu que exalta la experiencia por encima de la Escritura o un don por encima del Dador. En resumen, afirma la obra genuina del Espíritu y declina las distorsiones de ella."} },
 { kw:{ en:["open","continue","perfect","baptism","judged","glorify","christ","scripture"],
        es:["abiertas","continuan","perfecto","bautismo","juzga","glorifica","cristo","escritura"] },
   q:{en:"Give the questions this unit leaves open, and state the single test by which every gift and claim is finally judged.",
      es:"Dé las preguntas que esta unidad deja abiertas, y exponga la única prueba por la cual todo don y afirmación se juzga finalmente."},
   model:{en:"The unit leaves open whether the revelatory gifts continue or have ceased, whether the perfect of First Corinthians is the completed canon or the return of Christ, whether the baptism in the Spirit is conversion itself or a later empowering, and whether the tongues of Acts ten and nineteen were known languages. It imposes no verdict on these, since faithful people differ with Scripture in hand. The single test by which every gift and claim is finally judged is whether it glorifies Jesus Christ and makes His people more like Him, for the Spirit was given to glorify the Son.",
          es:"La unidad deja abiertas si los dones revelatorios continúan o han cesado, si lo perfecto de Primera de Corintios es el canon completo o el regreso de Cristo, si el bautismo en el Espíritu es la conversión misma o un empoderamiento posterior, y si las lenguas de Hechos diez y diecinueve eran idiomas conocidos. No impone veredicto sobre estas, pues gente fiel difiere con la Escritura en la mano. La única prueba por la cual todo don y toda afirmación se juzga finalmente es si glorifica a Jesucristo y hace a su pueblo más semejante a Él, pues el Espíritu fue dado para glorificar al Hijo."} }
];
