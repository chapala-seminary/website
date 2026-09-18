/* CTSPentecostal - unit 10: per-unit configuration and content. */

const UNIT = 10;

var SKEY = `cts_u${UNIT}_revelation`;

var MCQ = [
 { correct:1,
   q:{en:"This unit keeps two questions distinct: whether the revelatory gifts continue today, and —",
      es:"Esta unidad mantiene dos preguntas distintas: si los dones revelatorios continúan hoy, y —"},
   opts:[
     {en:"whether the Holy Spirit exists", es:"si el Espíritu Santo existe"},
     {en:"how any continuing prophecy relates to the closed canon of Scripture", es:"cómo se relaciona cualquier profecía que continúe con el canon cerrado de la Escritura"},
     {en:"whether Paul wrote 1 Corinthians", es:"si Pablo escribió 1 Corintios"},
     {en:"whether tongues are known human languages", es:"si las lenguas son idiomas humanos conocidos"} ],
   exp:{en:"The two questions — do the gifts continue, and how does any continuing prophecy relate to the closed canon — must be kept apart to avoid confusion.",
        es:"Las dos preguntas — si los dones continúan, y cómo se relaciona cualquier profecía que continúe con el canon cerrado — deben mantenerse separadas para evitar confusión."} },
 { correct:0,
   q:{en:"Both cessationists and responsible continuationists agree that —",
      es:"Tanto cesacionistas como continuistas responsables concuerdan en que —"},
   opts:[
     {en:"the canon of Scripture is closed and no one adds to the Bible", es:"el canon de la Escritura está cerrado y nadie añade a la Biblia"},
     {en:"the sign-gifts are required for salvation", es:"los dones de señal se requieren para la salvación"},
     {en:"prophecy today equals Scripture", es:"la profecía de hoy equivale a la Escritura"},
     {en:"tongues must accompany conversion", es:"las lenguas deben acompañar la conversión"} ],
   exp:{en:"Both sides confess a closed canon and the final, sufficient authority of Scripture; the debate is narrower.",
        es:"Ambos lados confiesan un canon cerrado y la autoridad final y suficiente de la Escritura; el debate es más estrecho."} },
 { correct:1,
   q:{en:"The cessationist position holds that the revelatory gifts —",
      es:"La postura cesacionista sostiene que los dones revelatorios —"},
   opts:[
     {en:"will continue until the end of the world no matter what", es:"continuarán hasta el fin del mundo pase lo que pase"},
     {en:"served to found and authenticate the church and its Scriptures, and ceased once that foundation was complete", es:"sirvieron para fundar y autenticar la iglesia y sus Escrituras, y cesaron una vez completada esa fundación"},
     {en:"were never real", es:"nunca fueron reales"},
     {en:"are the same as the fruit of the Spirit", es:"son lo mismo que el fruto del Espíritu"} ],
   exp:{en:"Cessationists tie the gifts to the founding era (Eph 2:20; Heb 2:3–4) and to the sufficiency of the completed Scripture.",
        es:"Los cesacionistas ligan los dones a la era fundacional (Ef 2:20; Heb 2:3–4) y a la suficiencia de la Escritura completa."} },
 { correct:2,
   q:{en:"A central continuationist argument is that —",
      es:"Un argumento continuista central es que —"},
   opts:[
     {en:"Scripture explicitly dates the end of the gifts to the first century", es:"la Escritura fecha explícitamente el fin de los dones en el primer siglo"},
     {en:"the gifts are unimportant", es:"los dones no son importantes"},
     {en:"Scripture nowhere says the gifts cease before Christ's return, and Paul says do not forbid and earnestly desire them", es:"la Escritura en ninguna parte dice que los dones cesan antes del regreso de Cristo, y Pablo dice no prohibir y desear con anhelo los dones"},
     {en:"prophecy today outranks Scripture", es:"la profecía de hoy supera a la Escritura"} ],
   exp:{en:"Continuationists note the commands were never revoked (1 Cor 14:1, 39) and read the perfect as Christ's return.",
        es:"Los continuistas notan que los mandatos nunca fueron revocados (1 Cor 14:1, 39) y leen lo perfecto como el regreso de Cristo."} },
 { correct:3,
   q:{en:"On the continuationist view, prophecy given in a congregation today —",
      es:"En la postura continuista, la profecía dada en una congregación hoy —"},
   opts:[
     {en:"is added to the Bible as new Scripture", es:"se añade a la Biblia como nueva Escritura"},
     {en:"carries the same authority as the apostles' writings", es:"lleva la misma autoridad que los escritos de los apóstoles"},
     {en:"replaces the need for Scripture", es:"reemplaza la necesidad de la Escritura"},
     {en:"is not new Scripture, carries no canonical authority, and must be tested", es:"no es nueva Escritura, no tiene autoridad canónica, y debe ser examinada"} ],
   exp:{en:"Even where the gift is affirmed, congregational prophecy is fallible, non-canonical, and subordinate to Scripture.",
        es:"Aun donde se afirma el don, la profecía congregacional es falible, no canónica, y subordinada a la Escritura."} },
 { correct:0,
   q:{en:"Scripture's command for any claimed prophecy is —",
      es:"El mandato de la Escritura para toda profecía reclamada es —"},
   opts:[
     {en:"test all things and hold fast what is good — weigh it, and keep only what is good (1 Thess 5:21)", es:"examinarlo todo y retener lo bueno — sopesarla, y retener solo lo bueno (1 Ts 5:21)"},
     {en:"accept every prophecy without question", es:"aceptar toda profecía sin cuestionar"},
     {en:"forbid all prophecy outright", es:"prohibir toda profecía por completo"},
     {en:"ignore it entirely", es:"ignorarla por completo"} ],
   exp:{en:"1 Thessalonians 5:20–21 forbids both scorn and credulity: do not despise prophecies, but test all things.",
        es:"1 Tesalonicenses 5:20–21 prohíbe tanto el desdén como la credulidad: no menospreciéis las profecías, pero examinadlo todo."} },
 { correct:2,
   q:{en:"On whether the gifts continue, this unit —",
      es:"Sobre si los dones continúan, esta unidad —"},
   opts:[
     {en:"declares cessationism the only faithful view", es:"declara el cesacionismo la única postura fiel"},
     {en:"declares continuationism the only faithful view", es:"declara el continuismo la única postura fiel"},
     {en:"presents both positions at their strongest and leaves the question open, while insisting the canon stays closed and all things be tested", es:"presenta ambas posturas en su forma más fuerte y deja la pregunta abierta, insistiendo en que el canon siga cerrado y todo sea examinado"},
     {en:"says Scripture gives no guidance at all", es:"dice que la Escritura no da ninguna guía"} ],
   exp:{en:"As with the millennium, both faithful positions are set out fairly and no verdict is imposed — but the canon stays closed and all is tested.",
        es:"Como con el milenio, ambas posturas fieles se exponen con justicia y no se impone veredicto — pero el canon sigue cerrado y todo se examina."} }
];

var SA = [
 { kw:{ en:["continue","cease","prophecy","canon","closed","relate","distinct","scripture"],
        es:["continuan","cesado","profecia","canon","cerrado","relaciona","distintas","escritura"] },
   q:{en:"State the two distinct questions this unit keeps apart, and why keeping them apart matters.",
      es:"Exponga las dos preguntas distintas que esta unidad mantiene separadas, y por qué importa mantenerlas separadas."},
   model:{en:"The first question is whether the revelatory gifts — prophecy, tongues, words of knowledge — continue today or have ceased. The second is how any prophecy that continues relates to the closed canon of Scripture. Keeping them distinct matters because a person can believe the gifts continue while still holding that the canon is closed and Scripture is final; confusing the two makes people fear that continuing prophecy would add to the Bible, which no responsible view claims.",
          es:"La primera pregunta es si los dones revelatorios — profecía, lenguas, palabras de conocimiento — continúan hoy o han cesado. La segunda es cómo se relaciona cualquier profecía que continúe con el canon cerrado de la Escritura. Mantenerlas distintas importa porque una persona puede creer que los dones continúan y a la vez sostener que el canon está cerrado y la Escritura es final; confundir las dos hace temer que la profecía continua añadiría a la Biblia, lo cual ninguna postura responsable afirma."} },
 { kw:{ en:["cessationist","foundation","authenticate","continuationist","forbid","return","desire","ceased"],
        es:["cesacionista","fundacion","autenticar","continuista","prohibir","regreso","desear","cesaron"] },
   q:{en:"Summarize the cessationist and continuationist positions on whether the revelatory gifts continue, giving the main support for each.",
      es:"Resuma las posturas cesacionista y continuista sobre si los dones revelatorios continúan, dando el apoyo principal de cada una."},
   model:{en:"The cessationist position holds that the revelatory gifts served to found and authenticate the church and its Scriptures, so they ceased once that foundation was complete; it appeals to the foundational role of apostles and prophets and to the sufficiency of Scripture. The continuationist position holds that Scripture nowhere says the gifts cease before Christ's return, and that Paul commands the church not to forbid tongues and to desire prophecy; it appeals to those commands and to the Spirit still giving gifts as He wills.",
          es:"La postura cesacionista sostiene que los dones revelatorios sirvieron para fundar y autenticar la iglesia y sus Escrituras, de modo que cesaron una vez completada esa fundación; apela al papel fundacional de apóstoles y profetas y a la suficiencia de la Escritura. La postura continuista sostiene que la Escritura en ninguna parte dice que los dones cesan antes del regreso de Cristo, y que Pablo manda a la iglesia no prohibir las lenguas y desear la profecía; apela a esos mandatos y a que el Espíritu sigue dando dones como Él quiere."} },
 { kw:{ en:["canon","closed","scripture","authority","tested","fallible","subordinate","add"],
        es:["canon","cerrado","escritura","autoridad","examinada","falible","subordinada","anade"] },
   q:{en:"Explain how a continuing gift of prophecy can be affirmed without threatening the closed canon of Scripture.",
      es:"Explique cómo se puede afirmar un don de profecía que continúa sin amenazar el canon cerrado de la Escritura."},
   model:{en:"Even where prophecy is affirmed as continuing, it is not new Scripture and carries no canonical authority; the canon is closed and nothing is added to the Bible. Congregational prophecy is treated as fallible and subordinate to Scripture, to be tested and weighed by it, and held only where it proves good. In this way the gift can be affirmed while Scripture remains the final and sufficient authority.",
          es:"Aun donde se afirma que la profecía continúa, no es nueva Escritura y no tiene autoridad canónica; el canon está cerrado y nada se añade a la Biblia. La profecía congregacional se trata como falible y subordinada a la Escritura, para ser examinada y sopesada por ella, y retenida solo donde resulte buena. De este modo el don puede afirmarse mientras la Escritura sigue siendo la autoridad final y suficiente."} }
];
