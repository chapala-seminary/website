/* CTSPentecostal - unit 8: per-unit configuration and content. */

const UNIT = 8;

var SKEY = `cts_u${UNIT}_baptism`;

var MCQ = [
 { correct:0,
   q:{en:"The central question of this unit is —",
      es:"La pregunta central de esta unidad es —"},
   opts:[
     {en:"whether Spirit-baptism is received by every believer at conversion or is a distinct experience afterward", es:"si el bautismo del Espíritu lo recibe todo creyente en la conversión o es una experiencia distinta después"},
     {en:"whether the Holy Spirit is truly God", es:"si el Espíritu Santo es verdaderamente Dios"},
     {en:"whether tongues are known or unknown languages", es:"si las lenguas son idiomas conocidos o desconocidos"},
     {en:"whether the canon of Scripture is closed", es:"si el canon de la Escritura está cerrado"} ],
   exp:{en:"The debate is not whether we need the Spirit, but when Spirit-baptism occurs and what it is.",
        es:"El debate no es si necesitamos al Espíritu, sino cuándo ocurre el bautismo del Espíritu y qué es."} },

 { correct:1,
   q:{en:"Which view teaches that Spirit-baptism is a distinct experience after conversion, normally evidenced by tongues?",
      es:"¿Qué postura enseña que el bautismo del Espíritu es una experiencia distinta después de la conversión, normalmente evidenciada por las lenguas?"},
   opts:[
     {en:"Conversion-initiation", es:"Iniciación en la conversión"},
     {en:"Classical Pentecostal", es:"Pentecostal clásica"},
     {en:"The mediating \u201Cone baptism, many fillings\u201D view", es:"La postura mediadora \u201Cun bautismo, muchas llenuras\u201D"},
     {en:"Wesleyan-Holiness", es:"Wesleyana de santidad"} ],
   exp:{en:"Classical Pentecostalism holds a subsequent empowerment normally evidenced by speaking in tongues.",
        es:"El pentecostalismo clásico sostiene un poder posterior normalmente evidenciado por el hablar en lenguas."} },

 { correct:3,
   q:{en:"First Corinthians 12:13 (\u201Cby one Spirit we were all baptized into one body\u201D) is the key text for which view?",
      es:"1 Corintios 12:13 (\u201Cpor un solo Espíritu somos todos bautizados en un cuerpo\u201D) es el texto clave de cuál postura?"},
   opts:[
     {en:"Classical Pentecostal", es:"Pentecostal clásica"},
     {en:"The prosperity gospel", es:"El evangelio de la prosperidad"},
     {en:"Wesleyan-Holiness", es:"Wesleyana de santidad"},
     {en:"Conversion-initiation", es:"Iniciación en la conversión"} ],
   exp:{en:"The conversion-initiation view reads 12:13 as making Spirit-baptism the possession of every believer at conversion.",
        es:"La postura de iniciación en la conversión lee 12:13 como que hace del bautismo del Espíritu posesión de todo creyente en la conversión."} },

 { correct:0,
   q:{en:"The unit argues that much of the disagreement eases once we distinguish —",
      es:"La unidad sostiene que mucho del desacuerdo se alivia una vez que distinguimos —"},
   opts:[
     {en:"the one baptism into the body from the repeated filling the church is commanded to seek", es:"el único bautismo en el cuerpo de la llenura repetida que la iglesia recibe el mandato de buscar"},
     {en:"Jews from Gentiles", es:"a los judíos de los gentiles"},
     {en:"the Old Testament from the New", es:"el Antiguo Testamento del Nuevo"},
     {en:"prophecy from tongues", es:"la profecía de las lenguas"} ],
   exp:{en:"Scripture speaks of one baptism into the body and a repeated, ongoing filling; keeping them apart cools the debate.",
        es:"La Escritura habla de un bautismo en el cuerpo y de una llenura repetida y continua; mantenerlos separados enfría el debate."} },

 { correct:2,
   q:{en:"\u201CBe filled with the Spirit\u201D (Ephesians 5:18) is significant because —",
      es:"\u201CSed llenos del Espíritu\u201D (Efesios 5:18) es significativo porque —"},
   opts:[
     {en:"it forbids seeking the Spirit's power", es:"prohíbe buscar el poder del Espíritu"},
     {en:"it describes the one baptism into the body", es:"describe el único bautismo en el cuerpo"},
     {en:"its present-tense command points to a continual, repeatable filling", es:"su mandato en tiempo presente señala una llenura continua y repetible"},
     {en:"it proves tongues are required for all", es:"prueba que las lenguas se requieren para todos"} ],
   exp:{en:"The present-tense command means \u201Ckeep on being filled\u201D — an ongoing work, not a one-time event.",
        es:"El mandato en tiempo presente significa \u201Cseguid siendo llenos\u201D — una obra continua, no un suceso único."} },

 { correct:1,
   q:{en:"The Wesleyan-Holiness view understands Spirit-baptism chiefly as —",
      es:"La postura wesleyana de santidad entiende el bautismo del Espíritu principalmente como —"},
   opts:[
     {en:"the moment every believer enters the body of Christ", es:"el momento en que todo creyente entra al cuerpo de Cristo"},
     {en:"a second work of grace related to heart-cleansing and holiness", es:"una segunda obra de gracia relacionada con la limpieza del corazón y la santidad"},
     {en:"a guarantee of health and wealth", es:"una garantía de salud y riqueza"},
     {en:"the closing of the biblical canon", es:"el cierre del canon bíblico"} ],
   exp:{en:"The Wesleyan-Holiness tradition frames it as a second, sanctifying work purifying the heart for holy living.",
        es:"La tradición wesleyana de santidad la enmarca como una segunda obra santificadora que purifica el corazón para una vida santa."} },

 { correct:3,
   q:{en:"The even-handed conclusion this unit reaches about tongues is that —",
      es:"La conclusión equilibrada que esta unidad alcanza sobre las lenguas es que —"},
   opts:[
     {en:"tongues is the required initial evidence for every believer", es:"las lenguas son la evidencia inicial requerida para todo creyente"},
     {en:"the gift of tongues is invalid today", es:"el don de lenguas es inválido hoy"},
     {en:"only Pentecostals possess the Holy Spirit", es:"sólo los pentecostales poseen el Espíritu Santo"},
     {en:"Spirit-empowerment is real and to be sought, yet tongues is not the required proof of a mandatory second blessing", es:"el poder del Espíritu es real y ha de buscarse, pero las lenguas no son la prueba requerida de una segunda bendición obligatoria"} ],
   exp:{en:"Seek the Spirit's fullness with all your heart; decline the doctrine that makes tongues the required evidence for all.",
        es:"Busque la plenitud del Espíritu con todo el corazón; rechace la doctrina que hace de las lenguas la evidencia requerida para todos."} }
];

var SA = [
 { kw:{ en:["conversion","baptism","believer","body","filling","distinct","spirit","every"],
        es:["conversion","bautismo","creyente","cuerpo","llenura","distinta","espiritu","todo"] },
   q:{en:"State the central question of the debate over Spirit-baptism, and briefly summarize how the conversion-initiation view answers it from 1 Corinthians 12:13.",
      es:"Enuncie la pregunta central del debate sobre el bautismo del Espíritu, y resuma brevemente cómo la responde la postura de iniciación en la conversión desde 1 Corintios 12:13."},
   model:{en:"The central question is whether the baptism in the Holy Spirit is received by every believer at conversion or is a distinct experience after conversion. The conversion-initiation view answers that by one Spirit all believers are baptized into one body (1 Corinthians 12:13), so Spirit-baptism belongs to every Christian at conversion, and later experiences of power are fillings rather than a second baptism.",
          es:"La pregunta central es si el bautismo en el Espíritu Santo lo recibe todo creyente en la conversión o es una experiencia distinta después de la conversión. La postura de iniciación en la conversión responde que por un solo Espíritu todos los creyentes son bautizados en un cuerpo (1 Corintios 12:13), de modo que el bautismo del Espíritu pertenece a todo cristiano en la conversión, y las experiencias posteriores de poder son llenuras y no un segundo bautismo."} },

 { kw:{ en:["baptism","body","filling","repeated","conversion","command","unity","power"],
        es:["bautismo","cuerpo","llenura","repetida","conversion","mandato","unidad","poder"] },
   q:{en:"Explain the distinction between the one baptism into the body and the repeated filling of the Spirit, citing a text for each.",
      es:"Explique la distinción entre el único bautismo en el cuerpo y la llenura repetida del Espíritu, citando un texto para cada uno."},
   model:{en:"The one baptism into the body is received once by every believer at conversion, joining them to Christ's church, as in 1 Corinthians 12:13 and the one baptism of Ephesians 4:5. The repeated filling is an ongoing, seekable power that the same believers receive again and again, as shown by the present-tense command to be filled with the Spirit in Ephesians 5:18 and the repeated fillings in Acts. Distinguishing the two lets us affirm both the unity of all Christians and the call to keep seeking the Spirit's power.",
          es:"El único bautismo en el cuerpo lo recibe una sola vez todo creyente en la conversión, uniéndolo a la iglesia de Cristo, como en 1 Corintios 12:13 y el un bautismo de Efesios 4:5. La llenura repetida es un poder continuo que se busca y que los mismos creyentes reciben una y otra vez, como muestra el mandato en tiempo presente de ser llenos del Espíritu en Efesios 5:18 y las llenuras repetidas en Hechos. Distinguir los dos nos permite afirmar la unidad de todos los cristianos y el llamado a seguir buscando el poder del Espíritu."} },

 { kw:{ en:["pentecostal","empowerment","holiness","tongues","evidence","universal","treasure","blessing"],
        es:["pentecostal","poder","santidad","lenguas","evidencia","universal","atesora","bendicion"] },
   q:{en:"Summarize what the classical Pentecostal and Wesleyan-Holiness views each rightly treasure, and name the one claim this unit declines as a universal rule.",
      es:"Resuma lo que la postura pentecostal clásica y la wesleyana de santidad atesoran con razón, y nombre la única afirmación que esta unidad rechaza como regla universal."},
   model:{en:"The classical Pentecostal view rightly treasures the reality of Spirit-empowerment for witness and refuses to let the Spirit's power become a dead letter, expecting God to act. The Wesleyan-Holiness view rightly treasures the pursuit of holiness, refusing to settle for a shallow Christian life and pressing toward a pure heart. The one claim this unit declines as a universal rule is that speaking in tongues is the required initial evidence of a mandatory second blessing every believer must receive.",
          es:"La postura pentecostal clásica atesora con razón la realidad del poder del Espíritu para el testimonio y se niega a dejar que ese poder quede en letra muerta, esperando que Dios actúe. La postura wesleyana de santidad atesora con razón la búsqueda de la santidad, negándose a conformarse con una vida cristiana superficial y anhelando un corazón puro. La única afirmación que esta unidad rechaza como regla universal es que el hablar en lenguas sea la evidencia inicial requerida de una segunda bendición obligatoria que todo creyente deba recibir."} }
];
