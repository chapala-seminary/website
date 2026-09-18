/* CTSPentecostal - unit 5: per-unit configuration and content. */

const UNIT = 5;

var SKEY = `cts_u${UNIT}_gifts`;

var MCQ = [
 { correct:1,
   q:{en:"Paul's gift lists (Romans 12; 1 Corinthians 12; Ephesians 4) are best understood as \u2014",
      es:"Las listas de dones de Pablo (Romanos 12; 1 Corintios 12; Efesios 4) se entienden mejor como \u2014"},
   opts:[
     {en:"a single fixed catalog every church must match", es:"un único catálogo fijo que toda iglesia debe igualar"},
     {en:"overlapping, illustrative lists, not an exhaustive inventory", es:"listas que se superponen, ilustrativas, no un inventario exhaustivo"},
     {en:"proof that only a few gifts exist", es:"prueba de que solo existen unos pocos dones"},
     {en:"identical to one another", es:"idénticas entre sí"} ],
   exp:{en:"The lists overlap but none matches another; they are illustrative, not exhaustive, so we need not argue whether a gift \u201Ccounts.\u201D",
        es:"Las listas se superponen pero ninguna iguala a otra; son ilustrativas, no exhaustivas, así que no hay que discutir si un don \u201Ccuenta.\u201D"} },

 { correct:3,
   q:{en:"In 1 Corinthians 12, the phrase \u201Cfor the profit of all\u201D (12:7) teaches that gifts are given \u2014",
      es:"En 1 Corintios 12, la frase \u201Cpara provecho\u201D (12:7) enseña que los dones se dan \u2014"},
   opts:[
     {en:"to mark out superior Christians", es:"para señalar a cristianos superiores"},
     {en:"only to church leaders", es:"solo a los líderes de la iglesia"},
     {en:"for private spiritual status", es:"para una posición espiritual privada"},
     {en:"for the common good of the whole body", es:"para el bien común de todo el cuerpo"} ],
   exp:{en:"Gifts serve the common good, not private standing; no member may despise another or think itself unneeded.",
        es:"Los dones sirven al bien común, no a una posición privada; ningún miembro puede menospreciar a otro ni creerse innecesario."} },

 { correct:0,
   q:{en:"Why does Paul place the \u201Clove chapter\u201D (1 Corinthians 13) in the middle of his teaching on gifts?",
      es:"¿Por qué pone Pablo el \u201Ccapítulo de la caridad\u201D (1 Corintios 13) en medio de su enseñanza sobre los dones?"},
   opts:[
     {en:"Because love is the frame without which any gift profits nothing", es:"Porque la caridad es el marco sin el cual ningún don aprovecha nada"},
     {en:"Because love is one more gift to seek", es:"Porque la caridad es un don más que buscar"},
     {en:"To end the discussion of gifts entirely", es:"Para terminar del todo la discusión sobre los dones"},
     {en:"Because the Corinthians already loved one another well", es:"Porque los corintios ya se amaban bien unos a otros"} ],
   exp:{en:"Tongues, prophecy, and faith without love are noise or nothing (13:1\u20133); love is the indispensable frame for every gift.",
        es:"Lenguas, profecía y fe sin caridad son ruido o nada (13:1\u20133); la caridad es el marco indispensable de todo don."} },

 { correct:1,
   q:{en:"In 1 Corinthians 14, Paul prefers prophecy to uninterpreted tongues in the gathering because \u2014",
      es:"En 1 Corintios 14, Pablo prefiere la profecía a las lenguas sin interpretación en la congregación porque \u2014"},
   opts:[
     {en:"tongues are sinful", es:"las lenguas son pecaminosas"},
     {en:"prophecy edifies the whole church, while uninterpreted tongues edify only the speaker", es:"la profecía edifica a toda la iglesia, mientras que las lenguas sin interpretación edifican solo al que habla"},
     {en:"prophecy is the only real gift", es:"la profecía es el único don verdadero"},
     {en:"tongues were already forbidden", es:"las lenguas ya estaban prohibidas"} ],
   exp:{en:"His rule is edification: prophecy builds up the church; yet he still says, \u201Cdo not forbid to speak with tongues\u201D (14:39).",
        es:"Su regla es la edificación: la profecía edifica a la iglesia; sin embargo dice: \u201Cno impidáis el hablar lenguas\u201D (14:39)."} },

 { correct:2,
   q:{en:"Regarding the word \u201Cunknown\u201D in \u201Cunknown tongue\u201D (1 Corinthians 14) \u2014",
      es:"Respecto a la palabra \u201Cdesconocida\u201D en \u201Clengua desconocida\u201D (1 Corintios 14) \u2014"},
   opts:[
     {en:"it is the central word in the Greek text", es:"es la palabra central en el texto griego"},
     {en:"it proves tongues are always ecstatic", es:"prueba que las lenguas siempre son extáticas"},
     {en:"it is a word the KJV supplied; the NKJV drops it, and the Spanish tradition instead reads \u201Clengua extra\u00F1a\u201D", es:"es una palabra que suplió la KJV; la NKJV la omite, y la tradición española lee \u201Clengua extra\u00F1a\u201D"},
     {en:"it appears identically in every translation", es:"aparece idéntica en toda traducción"} ],
   exp:{en:"\u201CUnknown\u201D is not in the Greek; the KJV added it in italics. The reading must rest on Paul's description, not the supplied word.",
        es:"\u201CDesconocida\u201D no está en el griego; la KJV la añadió en cursiva. La lectura debe descansar en la descripción de Pablo, no en la palabra añadida."} },

 { correct:3,
   q:{en:"The reading that the Corinthian gift of tongues is a Spirit-given prayer language directed to God rests chiefly on \u2014",
      es:"La lectura de que el don de lenguas de Corinto es un lenguaje de oración dado por el Espíritu y dirigido a Dios descansa principalmente en \u2014"},
   opts:[
     {en:"the word \u201Cunknown\u201D in the KJV", es:"la palabra \u201Cdesconocida\u201D en la KJV"},
     {en:"the events of Pentecost in Acts 2", es:"los sucesos de Pentecostés en Hechos 2"},
     {en:"a church council's ruling", es:"la decisión de un concilio de la iglesia"},
     {en:"Paul's description \u2014 speaking \u201Cnot to men but to God,\u201D edifying oneself, the spirit praying while the understanding is unfruitful", es:"la descripción de Pablo \u2014 hablar \u201Cno a los hombres sino a Dios,\u201D edificarse a sí mismo, el espíritu que ora mientras el entendimiento queda sin fruto"} ],
   exp:{en:"1 Corinthians 14:2, 4, 14 describe speech directed to God that no one understands \u2014 this, not a supplied word, grounds the reading.",
        es:"1 Corintios 14:2, 4, 14 describen un hablar dirigido a Dios que nadie entiende \u2014 esto, y no una palabra añadida, fundamenta la lectura."} },

 { correct:2,
   q:{en:"The phrase \u201Cwhen that which is perfect has come\u201D (1 Corinthians 13:10) \u2014",
      es:"La frase \u201Ccuando venga lo que es perfecto\u201D (1 Corintios 13:10) \u2014"},
   opts:[
     {en:"clearly means the completed Bible, beyond dispute", es:"claramente significa la Biblia completada, sin discusión"},
     {en:"proves the gifts have certainly ceased", es:"prueba que los dones ciertamente han cesado"},
     {en:"is read two ways \u2014 as the completed revelation, or as Christ's return \u2014 and godly scholars land on both sides", es:"se lee de dos maneras \u2014 como la revelación completada, o como el regreso de Cristo \u2014 y eruditos piadosos se sitúan en ambos lados"},
     {en:"proves the gifts must certainly continue", es:"prueba que los dones ciertamente deben continuar"} ],
   exp:{en:"The verse itself can be read either way; the larger question of whether the gifts continue today is taken up in a later unit.",
        es:"El versículo mismo puede leerse de ambas maneras; la cuestión mayor de si los dones continúan hoy se trata en una unidad posterior."} }
];

var SA = [
 { kw:{ en:["lists","illustrative","exhaustive","overlap","believer","service","spirit","common"],
        es:["listas","ilustrativas","exhaustivo","superponen","creyente","servicio","espiritu","comun"] },
   q:{en:"Explain why Paul's gift lists should be read as illustrative rather than as a fixed, exhaustive catalog, and what follows for how we regard a believer's gift.",
      es:"Explique por qué las listas de dones de Pablo deben leerse como ilustrativas y no como un catálogo fijo y exhaustivo, y qué se sigue para cómo consideramos el don de un creyente."},
   model:{en:"Paul's several gift lists overlap but none matches another exactly, and they mix speaking gifts, serving gifts, and offices, which shows they are illustrative rather than an exhaustive catalog; Paul never intends a closed inventory. What follows is that every believer is gifted by the one Spirit for service, so we should not argue over whether a gift counts because it is missing from a list; each gift is given for the common good of the body.",
          es:"Las varias listas de dones de Pablo se superponen pero ninguna coincide exactamente con otra, y mezclan dones de palabra, dones de servicio y oficios, lo cual muestra que son ilustrativas y no un catálogo exhaustivo; Pablo nunca pretende un inventario cerrado. De ahí se sigue que todo creyente es dotado por el único Espíritu para el servicio, de modo que no debemos discutir si un don cuenta porque falte en una lista; cada don se da para el bien común del cuerpo."} },

 { kw:{ en:["perfect","cessationist","continuationist","canon","return","face","completed","verse"],
        es:["perfecto","cesacionista","continuista","canon","regreso","cara","completada","versiculo"] },
   q:{en:"Describe the two ways \u201Cthat which is perfect\u201D (1 Corinthians 13:10) is understood, and state one text each reading appeals to.",
      es:"Describa las dos maneras en que se entiende \u201Clo que es perfecto\u201D (1 Corintios 13:10), y diga un texto al que apela cada lectura."},
   model:{en:"The cessationist reading takes that which is perfect to mean the completed revelation or canon of Scripture, so the revelatory gifts served the foundation age and have ceased; it appeals to the contrast with knowing in part. The continuationist reading takes the perfect to mean the return of Christ, when we shall see face to face, so the gifts continue until then; it appeals to verse twelve. The same verse is read both ways, and godly scholars land on both sides.",
          es:"La lectura cesacionista entiende lo perfecto como la revelación completada o el canon de la Escritura, de modo que los dones reveladores sirvieron a la edad fundacional y han cesado; apela al contraste con conocer en parte. La lectura continuista entiende lo perfecto como el regreso de Cristo, cuando veremos cara a cara, de modo que los dones continúan hasta entonces; apela al versículo doce. El mismo versículo se lee de ambas maneras, y eruditos piadosos se sitúan en ambos lados."} },

 { kw:{ en:["unknown","supplied","italics","nkjv","description","understands","edifies","prayer"],
        es:["desconocida","suplieron","cursiva","extraña","descripcion","entiende","edifica","oracion"] },
   q:{en:"Explain honestly the status of the word \u201Cunknown\u201D in 1 Corinthians 14, and say what actually grounds the reading that the Corinthian tongue is a private prayer language.",
      es:"Explique con honestidad el estado de la palabra \u201Cdesconocida\u201D en 1 Corintios 14, y diga qué fundamenta en realidad la lectura de que la lengua de Corinto es un lenguaje privado de oración."},
   model:{en:"The word unknown is not in the Greek; it is a word the KJV translators supplied, printed in italics, and the NKJV drops it, reading simply that a person speaks in a tongue, so the word unknown cannot carry the argument. What actually grounds the reading that the Corinthian tongue is a private prayer language is Paul's own description: the speaker addresses God and not men, no one understands him, and he edifies himself while his understanding is unfruitful.",
          es:"La palabra desconocida no está en el griego; en inglés es una palabra que los traductores de la KJV suplieron, impresa en cursiva, y la NKJV la omite; la tradición española Reina-Valera, por su parte, suple la palabra extraña, así que la palabra añadida no puede sostener el argumento. Lo que en realidad fundamenta la lectura de que la lengua de Corinto es un lenguaje privado de oración es la descripción del mismo Pablo: el que habla se dirige a Dios y no a los hombres, nadie le entiende, y se edifica a sí mismo mientras su entendimiento queda sin fruto."} }
];
