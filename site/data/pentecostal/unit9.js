/* CTSPentecostal - unit 9: per-unit configuration and content. */

const UNIT = 9;

var SKEY = 'cts_u09_healing';

var MCQ = [
 { correct:1,
   q:{en:"On healing, Scripture teaches that God —",
      es:"Sobre la sanidad, la Escritura enseña que Dios —"},
   opts:[
     {en:"never heals anyone today", es:"nunca sana a nadie hoy"},
     {en:"is the LORD who heals, and the church is to pray for the sick, expecting Him to act", es:"es el Señor que sana, y la iglesia ha de orar por los enfermos, esperando que Él actúe"},
     {en:"guarantees every believer perfect health", es:"garantiza salud perfecta a todo creyente"},
     {en:"heals only apostles", es:"sana solo a los apóstoles"} ],
   exp:{en:"Scripture affirms God as Healer (Ex 15:26; Ps 103:3) and commands the church to pray for the sick (James 5:14–15); the gift of healings is real.",
        es:"La Escritura afirma a Dios como Sanador (Éx 15:26; Sal 103:3) y manda a la iglesia orar por los enfermos (Stg 5:14–15); el don de sanidades es real."} },
 { correct:2,
   q:{en:"James 5:14–15 directs that when a believer is sick —",
      es:"Santiago 5:14–15 indica que cuando un creyente está enfermo —"},
   opts:[
     {en:"he should hide his illness", es:"debe esconder su enfermedad"},
     {en:"he should demand healing as his right", es:"debe exigir la sanidad como su derecho"},
     {en:"he should call for the elders to pray over him and anoint him with oil", es:"debe llamar a los ancianos para que oren por él y lo unjan con aceite"},
     {en:"he should never see a physician", es:"nunca debe ver a un médico"} ],
   exp:{en:"The church is to pray in faith for the sick; healing is sought from the Lord, who raises up as He wills.",
        es:"La iglesia ha de orar en fe por los enfermos; la sanidad se busca del Señor, quien levanta como Él quiere."} },
 { correct:0,
   q:{en:"The distortion this unit rejects is the teaching that —",
      es:"La distorsión que esta unidad rechaza es la enseñanza de que —"},
   opts:[
     {en:"every believer will always be healed if only his faith is strong enough, so that continued sickness proves unbelief", es:"todo creyente siempre será sanado con tal que su fe sea suficientemente fuerte, de modo que la enfermedad que continúa prueba incredulidad"},
     {en:"God is able to heal", es:"Dios es capaz de sanar"},
     {en:"the church should pray for the sick", es:"la iglesia debe orar por los enfermos"},
     {en:"Christ had compassion on the suffering", es:"Cristo tuvo compasión de los que sufrían"} ],
   exp:{en:"Scripture shows godly people who were not healed — Paul's thorn, Trophimus, Timothy, Epaphroditus — so healing is God's to give as He wills, never a wage owed to sufficient faith.",
        es:"La Escritura muestra a personas piadosas que no fueron sanadas — el aguijón de Pablo, Trófimo, Timoteo, Epafrodito — así que la sanidad es de Dios para darla como Él quiere, nunca un salario debido a fe suficiente."} },
 { correct:3,
   q:{en:"That Paul's thorn was not removed, and that he left Trophimus sick, shows that —",
      es:"Que el aguijón de Pablo no fue quitado, y que dejó a Trófimo enfermo, muestra que —"},
   opts:[
     {en:"Paul lacked faith", es:"a Pablo le faltaba fe"},
     {en:"healing is always guaranteed", es:"la sanidad siempre está garantizada"},
     {en:"sickness is always sin", es:"la enfermedad es siempre pecado"},
     {en:"even the most faithful are not always healed, and healing is given according to God's will", es:"aun los más fieles no siempre son sanados, y la sanidad se da según la voluntad de Dios"} ],
   exp:{en:"God's grace was sufficient for Paul; full and final healing belongs to the resurrection, while now God heals as He wills, in mercy.",
        es:"La gracia de Dios le bastó a Pablo; la sanidad plena y final pertenece a la resurrección, mientras ahora Dios sana como Él quiere, en misericordia."} },
 { correct:1,
   q:{en:"On spiritual warfare, Scripture teaches that —",
      es:"Sobre la guerra espiritual, la Escritura enseña que —"},
   opts:[
     {en:"there is no real spiritual enemy", es:"no hay un enemigo espiritual real"},
     {en:"the battle is real, but the believer's armor is truth, righteousness, the gospel, faith, salvation, the Word, and prayer — not techniques or sensational rituals", es:"la batalla es real, pero la armadura del creyente es la verdad, la justicia, el evangelio, la fe, la salvación, la Palabra y la oración — no técnicas ni rituales sensacionalistas"},
     {en:"every sin and illness should be blamed on a demon", es:"todo pecado y enfermedad debe atribuirse a un demonio"},
     {en:"believers should fear the devil more than they trust Christ", es:"los creyentes deben temer al diablo más de lo que confían en Cristo"} ],
   exp:{en:"Ephesians 6 describes a real conflict fought with biblical armor; Christ has disarmed the powers (Col 2:15), and the enemy flees when resisted (James 4:7).",
        es:"Efesios 6 describe un conflicto real librado con la armadura bíblica; Cristo ha despojado a los poderes (Col 2:15), y el enemigo huye cuando se le resiste (Stg 4:7)."} },
 { correct:3,
   q:{en:"How should the church treat a believer who is not healed despite prayer?",
      es:"¿Cómo debe la iglesia tratar a un creyente que no es sanado a pesar de la oración?"},
   opts:[
     {en:"tell him his faith was too weak", es:"decirle que su fe fue demasiado débil"},
     {en:"conclude he has hidden sin", es:"concluir que tiene pecado oculto"},
     {en:"stop praying for anyone", es:"dejar de orar por cualquiera"},
     {en:"comfort him, assure him of God's nearness and sufficient grace, and never blame him for his suffering", es:"consolarlo, asegurarle la cercanía de Dios y su gracia suficiente, y nunca culparlo por su sufrimiento"} ],
   exp:{en:"To blame the afflicted for their affliction adds cruelty to grief; God is near the brokenhearted, and His grace is sufficient even when the thorn remains.",
        es:"Culpar al afligido por su aflicción añade crueldad al dolor; Dios está cerca del quebrantado, y su gracia es suficiente aun cuando el aguijón permanece."} },
 { correct:2,
   q:{en:"This unit's balanced position on healing and warfare is to —",
      es:"La posición equilibrada de esta unidad sobre la sanidad y la guerra es —"},
   opts:[
     {en:"deny that God heals or that evil spirits exist", es:"negar que Dios sana o que existen espíritus malignos"},
     {en:"guarantee healing and hunt demons behind every trouble", es:"garantizar la sanidad y cazar demonios detrás de cada problema"},
     {en:"affirm that God heals and the battle is real, while rejecting guaranteed-healing and demon-obsession, and keeping Christ at the center", es:"afirmar que Dios sana y que la batalla es real, mientras rechaza la sanidad garantizada y la obsesión con los demonios, y mantiene a Cristo en el centro"},
     {en:"ignore the subject entirely", es:"ignorar el tema por completo"} ],
   exp:{en:"The unit holds both truths together: God heals and the spiritual battle is real, yet neither is a formula; the aim of every healing and victory is to glorify Christ.",
        es:"La unidad sostiene ambas verdades juntas: Dios sana y la batalla espiritual es real, pero ninguna es una fórmula; el fin de toda sanidad y victoria es glorificar a Cristo."} }
];

var SA = [
 { kw:{ en:["heals","gift","pray","sick","guaranteed","faith","will","distortion"],
        es:["sana","don","orar","enfermos","garantizada","fe","voluntad","distorsion"] },
   q:{en:"State what this unit affirms about God's healing and what distortion it rejects.",
      es:"Exponga lo que esta unidad afirma sobre la sanidad de Dios y qué distorsión rechaza."},
   model:{en:"This unit affirms that God heals — He is the Lord who heals, the gift of healings is real, and the church is commanded to pray for the sick and anoint them, expecting the Lord to act. What it rejects is the distortion of guaranteed healing — the teaching that every believer will always be healed if only his faith is strong enough, so that continued sickness becomes proof of unbelief. Scripture shows godly people who were not healed, which teaches that healing is God's to give according to His will, in mercy, and is never a wage owed to sufficient faith.",
          es:"Esta unidad afirma que Dios sana — Él es el Señor que sana, el don de sanidades es real, y a la iglesia se le manda orar por los enfermos y ungirlos, esperando que el Señor actúe. Lo que rechaza es la distorsión de la sanidad garantizada: la enseñanza de que todo creyente siempre será sanado con tal que su fe sea suficientemente fuerte, de modo que la enfermedad que continúa se vuelve prueba de incredulidad. La Escritura muestra a personas piadosas que no fueron sanadas, lo cual enseña que la sanidad es de Dios para darla según su voluntad, en misericordia, y nunca es un salario debido a fe suficiente."} },
 { kw:{ en:["paul","thorn","trophimus","timothy","grace","resurrection","unbelief","will"],
        es:["pablo","aguijon","trofimo","timoteo","gracia","resurreccion","incredulidad","voluntad"] },
   q:{en:"Give three examples from Scripture of faithful people who were not healed, and explain what they teach.",
      es:"Dé tres ejemplos de la Escritura de personas fieles que no fueron sanadas, y explique qué enseñan."},
   model:{en:"Scripture gives several examples. Paul asked three times for his thorn in the flesh to be removed, but it was not; the answer was that God's grace was sufficient for him. Paul left Trophimus sick at Miletus, and he told Timothy to take a little wine for his frequent stomach ailments rather than rebuking him for unbelief. These teach that even the most faithful are not always healed now, that sickness is no proof of unbelief, and that full and final healing belongs to the resurrection, while now God heals as He wills according to His will.",
          es:"La Escritura da varios ejemplos. Pablo pidió tres veces que le fuese quitado su aguijón en la carne, pero no lo fue; la respuesta fue que la gracia de Dios le bastaba. Pablo dejó a Trófimo enfermo en Mileto, y dijo a Timoteo que tomara un poco de vino para sus frecuentes males de estómago en vez de reprenderlo por incredulidad. Estos enseñan que aun los más fieles no siempre son sanados ahora, que la enfermedad no es prueba de incredulidad, y que la sanidad plena y final pertenece a la resurrección, mientras ahora Dios sana como Él quiere según su voluntad."} },
 { kw:{ en:["battle","enemy","armor","truth","prayer","christ","demon","sober"],
        es:["batalla","enemigo","armadura","verdad","oracion","cristo","demonio","sobrio"] },
   q:{en:"Summarize the biblical view of spiritual warfare, including what to affirm and what to avoid.",
      es:"Resuma la visión bíblica de la guerra espiritual, incluyendo qué afirmar y qué evitar."},
   model:{en:"The biblical view affirms that spiritual warfare is real: there is a genuine enemy, the devil, and real forces of evil, and the Christian life is a battle. But the armor Scripture gives is truth, righteousness, the gospel, faith, salvation, the Word, and prayer — not techniques or sensational rituals. What we avoid is blaming every sin, illness, or misfortune on a demon, and a preoccupation with the demonic that eclipses Christ. Victory belongs to Christ, who disarmed the powers; the believer resists the enemy, stays sober and watchful, and keeps the Savior, not the devil, at the center.",
          es:"La visión bíblica afirma que la guerra espiritual es real: hay un enemigo genuino, el diablo, y fuerzas reales de maldad, y la vida cristiana es una batalla. Pero la armadura que la Escritura da es la verdad, la justicia, el evangelio, la fe, la salvación, la Palabra y la oración — no técnicas ni rituales sensacionalistas. Lo que evitamos es culpar de todo pecado, enfermedad o desgracia a un demonio, y una preocupación con lo demoníaco que eclipsa a Cristo. La victoria pertenece a Cristo, que despojó a los principados; el creyente resiste al enemigo, se mantiene sobrio y vigilante, y mantiene al Salvador, no al diablo, en el centro."} }
];
