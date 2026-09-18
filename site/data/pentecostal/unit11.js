/* CTSPentecostal - unit 11: per-unit configuration and content. */

const UNIT = 11;

var SKEY = `cts_u${UNIT}_prosperity`;

var MCQ = [
 { correct:2,
   q:{en:"Alongside naming the prosperity gospel's error, this unit is equally careful to —",
      es:"Junto con nombrar el error del evangelio de la prosperidad, esta unidad es igualmente cuidadosa en —"},
   opts:[
     {en:"condemn the entire Pentecostal and charismatic movement for it", es:"condenar por ello a todo el movimiento pentecostal y carismático"},
     {en:"avoid quoting Scripture at all", es:"evitar del todo citar la Escritura"},
     {en:"refuse to charge the distortion to the whole movement, most of whom reject it", es:"rehusar cargar la distorsión a todo el movimiento, cuya mayoría la rechaza"},
     {en:"declare all giving of money sinful", es:"declarar pecaminoso todo dar de dinero"} ],
   exp:{en:"A teaching is judged on its own by the Word; a movement by its Scriptures and its faithful — so the error is named without condemning the many who reject it.",
        es:"Una enseñanza se juzga por sí misma según la Palabra; un movimiento por sus Escrituras y sus fieles — así el error se nombra sin condenar a los muchos que lo rechazan."} },
 { correct:3,
   q:{en:"The grain of truth the prosperity impulse seizes upon is that —",
      es:"El grano de verdad del que se apodera el impulso de la prosperidad es que —"},
   opts:[
     {en:"God guarantees every believer wealth", es:"Dios garantiza riqueza a todo creyente"},
     {en:"faith is a force that compels God", es:"la fe es una fuerza que obliga a Dios"},
     {en:"sickness always proves hidden sin", es:"la enfermedad siempre prueba pecado oculto"},
     {en:"God is a generous Father who provides for His children and does heal", es:"Dios es un Padre generoso que provee para sus hijos y sí sana"} ],
   exp:{en:"The teaching gains a hearing by seizing on real truths — God's generosity and provision — before stretching them out of shape.",
        es:"La enseñanza gana oído apoderándose de verdades reales — la generosidad y la provisión de Dios — antes de deformarlas."} },
 { correct:1,
   q:{en:"The distortion begins when the teaching adds that —",
      es:"La distorsión comienza cuando la enseñanza añade que —"},
   opts:[
     {en:"God cares about our daily needs", es:"a Dios le importan nuestras necesidades diarias"},
     {en:"health and wealth are guaranteed rights, faith is a formula, and sickness or poverty proves too little faith", es:"la salud y la riqueza son derechos garantizados, la fe es una fórmula, y la enfermedad o la pobreza prueban poca fe"},
     {en:"believers should be generous", es:"los creyentes deben ser generosos"},
     {en:"God is good and kind", es:"Dios es bueno y bondadoso"} ],
   exp:{en:"The error lies not in trusting God's provision but in the terms added: guaranteed wealth, faith as a lever, and blame on the afflicted.",
        es:"El error no está en confiar en la provisión de Dios, sino en los términos añadidos: riqueza garantizada, la fe como palanca, y culpa al afligido."} },
 { correct:0,
   q:{en:"Paul warns Timothy that —",
      es:"Pablo advierte a Timoteo que —"},
   opts:[
     {en:"those who desire to be rich fall into a snare, and the love of money is a root of all kinds of evil", es:"los que quieren enriquecerse caen en lazo, y el amor al dinero es raíz de todos los males"},
     {en:"godliness is a means of financial gain", es:"la piedad es un medio de ganancia financiera"},
     {en:"the rich are the most faithful believers", es:"los ricos son los creyentes más fieles"},
     {en:"contentment is worthless", es:"el contentamiento no vale nada"} ],
   exp:{en:"1 Timothy 6:9–10 makes riches a danger, not a goal, and lifts up godliness with contentment as the true gain.",
        es:"1 Timoteo 6:9–10 hace de las riquezas un peligro, no una meta, y ensalza la piedad con contentamiento como la verdadera ganancia."} },
 { correct:3,
   q:{en:"On suffering, the New Testament teaches that —",
      es:"Sobre el sufrimiento, el Nuevo Testamento enseña que —"},
   opts:[
     {en:"true faith removes all hardship", es:"la fe verdadera quita toda dificultad"},
     {en:"sickness is always a verdict on sin", es:"la enfermedad es siempre un veredicto sobre el pecado"},
     {en:"Christ promised His followers ease", es:"Cristo prometió comodidad a sus seguidores"},
     {en:"all who desire to live godly will suffer persecution, and we are heirs if indeed we suffer with Him", es:"todos los que quieran vivir piadosamente padecerán persecución, y somos herederos si es que padecemos con Él"} ],
   exp:{en:"2 Timothy 3:12 and Romans 8:17 place the believer's road through the cross, not around it.",
        es:"2 Timoteo 3:12 y Romanos 8:17 ponen el camino del creyente por la cruz, no alrededor de ella."} },
 { correct:2,
   q:{en:"When Paul asked three times for his thorn to be removed, God's answer was —",
      es:"Cuando Pablo pidió tres veces que le fuese quitado su aguijón, la respuesta de Dios fue —"},
   opts:[
     {en:"that Paul plainly lacked faith", es:"que a Pablo claramente le faltaba fe"},
     {en:"to remove it at once as a reward", es:"quitarlo de inmediato como recompensa"},
     {en:"My grace is sufficient for you, for My strength is made perfect in weakness", es:"Bástate mi gracia, porque mi poder se perfecciona en la debilidad"},
     {en:"complete silence", es:"un silencio total"} ],
   exp:{en:"2 Corinthians 12:9 shows faith as trust in God's will, not a technique that guarantees relief.",
        es:"2 Corintios 12:9 muestra la fe como confianza en la voluntad de Dios, no una técnica que garantiza alivio."} },
 { correct:0,
   q:{en:"A movement, this unit argues, must be judged —",
      es:"Un movimiento, argumenta esta unidad, debe ser juzgado —"},
   opts:[
     {en:"by its Scriptures and its faithful, while a teaching is judged on its own terms by the Word", es:"por sus Escrituras y sus fieles, mientras que una enseñanza se juzga por sí misma según la Palabra"},
     {en:"by its worst and most famous preachers", es:"por sus peores y más famosos predicadores"},
     {en:"by its television programs", es:"por sus programas de televisión"},
     {en:"not at all", es:"de ninguna manera"} ],
   exp:{en:"To charge the distortion to the whole movement would be unjust; the many faithful reject it for the same reason we do.",
        es:"Cargar la distorsión a todo el movimiento sería injusto; los muchos fieles la rechazan por la misma razón que nosotros."} }
];

var SA = [
 { kw:{ en:["name","error","scripture","refuse","charge","movement","reject","judge"],
        es:["nombrar","error","escritura","rehusa","cargar","movimiento","rechazan","juzgar"] },
   q:{en:"State the two things this unit is careful to do at once when it addresses the prosperity gospel, and why both matter.",
      es:"Exponga las dos cosas que esta unidad hace con cuidado a la vez al tratar el evangelio de la prosperidad, y por qué ambas importan."},
   model:{en:"The unit is careful to do two things at once: to name the error of the prosperity gospel plainly by Scripture, and to refuse to charge that error to the whole Pentecostal and charismatic movement, most of whom reject it. Both matter because a teaching must be judged on its own terms by the Word, while a movement must be judged by its Scriptures and its faithful, not by its worst preachers; to condemn the many for the distortion of a few would be unjust and untrue.",
          es:"La unidad es cuidadosa en hacer dos cosas a la vez: nombrar claramente el error del evangelio de la prosperidad por la Escritura, y rehusar cargar ese error a todo el movimiento pentecostal y carismático, que en su mayoría lo rechazan. Ambas importan porque una enseñanza debe juzgarse por sí misma según la Palabra, mientras que un movimiento debe juzgarse por sus Escrituras y sus fieles, no por sus peores predicadores; condenar a los muchos por la distorsión de unos pocos sería injusto y falso."} },
 { kw:{ en:["money","snare","contentment","suffering","persecution","grace","weakness","technique"],
        es:["dinero","lazo","contentamiento","sufrimiento","persecucion","gracia","debilidad","tecnica"] },
   q:{en:"Give three ways Scripture corrects the prosperity gospel's view of faith, wealth, and suffering.",
      es:"Dé tres maneras en que la Escritura corrige la visión del evangelio de la prosperidad sobre la fe, la riqueza y el sufrimiento."},
   model:{en:"First, Scripture treats the love of money as a snare, not a goal, and holds up godliness with contentment as the true gain. Second, it promises suffering rather than excluding it: all who live godly will face persecution, and Christ himself had nowhere to lay his head. Third, it shows faith as trust in God's will rather than a technique to bend it: Paul's thorn was left in place and the answer was grace, God's strength made perfect in weakness. So wealth is no proof of favor and hardship is no proof of unbelief.",
          es:"Primero, la Escritura trata el amor al dinero como un lazo, no como una meta, y presenta la piedad con contentamiento como la verdadera ganancia. Segundo, promete sufrimiento en lugar de excluirlo: todos los que vivan piadosamente padecerán persecución, y Cristo mismo no tuvo dónde recostar la cabeza. Tercero, muestra la fe como confianza en la voluntad de Dios y no como una técnica para doblegarla: el aguijón de Pablo quedó en su lugar y la respuesta fue la gracia, la fortaleza de Dios perfeccionada en la debilidad. Así que la riqueza no es prueba de favor ni la aflicción prueba de incredulidad."} },
 { kw:{ en:["name","contempt","afflicted","blame","test","accountability","integrity","charity"],
        es:["nombrar","desprecio","afligido","culpa","examinar","rendicion","integridad","caridad"] },
   q:{en:"Explain how a pastor should warn against the prosperity gospel and other excesses without wounding faithful believers.",
      es:"Explique cómo un pastor debe advertir contra el evangelio de la prosperidad y otros excesos sin herir a los creyentes fieles."},
   model:{en:"A pastor should name the error clearly but without contempt, warning the flock while refusing to slander the many faithful believers who reject it. He must guard the afflicted from a message that blames them for their sickness or poverty, remembering that suffering is not a verdict on sin. Against other excesses he applies the same biblical remedies: test all things, keep a plurality of elders and mutual accountability, and handle money with integrity. Truth and charity are held together, so that error is opposed and brothers are honored.",
          es:"Un pastor debe nombrar el error con claridad pero sin desprecio, advirtiendo al rebaño y a la vez rehusando calumniar a los muchos creyentes fieles que lo rechazan. Debe guardar al afligido de un mensaje que lo culpa por su enfermedad o su pobreza, recordando que el sufrimiento no es un veredicto sobre el pecado. Contra otros excesos aplica los mismos remedios bíblicos: examinar todas las cosas, mantener una pluralidad de ancianos y rendición mutua de cuentas, y manejar el dinero con integridad. La verdad y la caridad se sostienen juntas, de modo que el error es combatido y los hermanos son honrados."} }
];
