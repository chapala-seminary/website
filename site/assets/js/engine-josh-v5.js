/* Exam engine for CTSJosh (shared by 1 unit page).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/josh/unitN.js. */
// CTS Joshua — Unit 5: Achan's Sin & Restoration of Ai (Joshua 7-8). Retrofit 2026-05-16.
// MC L3 audit verified | distribution A=B=C=D=5 | split kw_en/kw_es | track gating | MC-persist
(function(){
'use strict';

const UNIT = 5;
const COURSE = 'josh';
const NEXT_UNIT_URL = 'CTSJoshUnit6.html';
const PREV_UNIT_URL = 'CTSJoshUnit4.html';

const STATE_KEY     = `cts_${COURSE}_u${UNIT}_state`;
const MC_PASS_KEY   = `cts_${COURSE}_u${UNIT}_mc_passed`;
const SA_LOCK_KEY   = `cts_${COURSE}_u${UNIT}_sa_lockout`;
const FULL_LOCK_KEY = `cts_${COURSE}_u${UNIT}_lockout`;
const PROGRESS_KEY  = `cts_${COURSE}_progress`;

const langButtons=document.querySelectorAll('.lang-toggle button');
langButtons.forEach(btn=>{btn.addEventListener('click',()=>{const lang=btn.getAttribute('data-lang');document.body.classList.remove('lang-en','lang-es','lang-both');document.body.classList.add('lang-'+lang);langButtons.forEach(b=>b.classList.toggle('active',b===btn));renderBankedNotice();});});

let student=null;try{student=JSON.parse(localStorage.getItem('cts_student')||'null');}catch(e){student=null;}
const greetingEl=document.getElementById('greeting');const regWarn=document.getElementById('reg-warn');
if(student&&student.name){const isEs=document.body.classList.contains('lang-es');greetingEl.textContent=(isEs?'Bienvenido, ':'Welcome, ')+student.name;if(regWarn)regWarn.classList.add('hidden');}else{greetingEl.textContent='';if(regWarn)regWarn.classList.remove('hidden');}

let progress={};try{progress=JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}');}catch(e){progress={};}
let unitPassed = !!progress['unit'+UNIT];
let mcPreviouslyPassed = localStorage.getItem(MC_PASS_KEY) === 'true';

const grid=document.getElementById('progress-units');
for(let n=1;n<=10;n++){const pill=document.createElement('div');pill.className='unit-pill';pill.textContent='U'+n;if(progress['unit'+n])pill.classList.add('done');if(n===UNIT)pill.classList.add('current');if(n>UNIT&&!progress['unit'+(n-1)])pill.classList.add('locked');grid.appendChild(pill);}

// MC: L3 verified against Joshua 7-8. Distribution via KEY array below = A:5 B:5 C:5 D:5.
const MC=[
{q_en:"What single anchor phrase from John Fischer's song captures the lesson of Joshua 7?",q_es:"¿Qué frase ancla de la canción de John Fischer captura la lección de Josué 7?",options:{A:{en:"\"Pride goes before a fall.\"",es:"«El orgullo precede a la caída»."},B:{en:"\"You don't sin alone.\"",es:"«No pecas a solas»."},C:{en:"\"Be sure your sin will find you out.\"",es:"«Tu pecado os alcanzará»."},D:{en:"\"Confess your faults one to another.\"",es:"«Confesaos vuestras ofensas unos a otros»."}}},
{q_en:"After Jericho fell, what was Israel's first major military setback?",q_es:"Después de que cayó Jericó, ¿cuál fue el primer revés militar mayor de Israel?",options:{A:{en:"Ai routed the 3,000 sent against it",es:"Hai derrotó a los 3,000 enviados contra ella"},B:{en:"The siege of Hebron failed",es:"El sitio de Hebrón fracasó"},C:{en:"The Gibeonites deceived them",es:"Los gabaonitas los engañaron"},D:{en:"The Amorites attacked at night",es:"Los amorreos atacaron de noche"}}},
{q_en:"How many Israelites were killed in the first attack on Ai?",q_es:"¿Cuántos israelitas murieron en el primer ataque contra Hai?",options:{A:{en:"Twelve",es:"Doce"},B:{en:"Twenty-four",es:"Veinticuatro"},C:{en:"Thirty-six",es:"Treinta y seis"},D:{en:"One hundred",es:"Cien"}}},
{q_en:"What does Joshua 7:2-5 reveal as the FIRST reason for the defeat at Ai?",q_es:"¿Qué revela Josué 7:2-5 como la PRIMERA razón de la derrota en Hai?",options:{A:{en:"Failure of equipment",es:"Falla del equipo"},B:{en:"Numerical inferiority",es:"Inferioridad numérica"},C:{en:"Pride and over-confidence based on the spies' report",es:"Orgullo y exceso de confianza basados en el reporte de los espías"},D:{en:"Disloyalty in the ranks",es:"Deslealtad en las filas"}}},
{q_en:"Which Old Testament proverb does Wayne use to describe the spiritual posture before defeat?",q_es:"¿Qué proverbio usa Wayne para describir la postura espiritual antes de la derrota?",options:{A:{en:"\"Pride goes before destruction, and a haughty spirit before a fall.\" (Proverbs 16:18)",es:"«Antes del quebrantamiento es la soberbia». (Proverbios 16:18)"},B:{en:"\"The fear of the LORD is the beginning of wisdom.\"",es:"«El temor de Jehová es el principio de la sabiduría»."},C:{en:"\"A soft answer turns away wrath.\"",es:"«La blanda respuesta quita la ira»."},D:{en:"\"Trust in the LORD with all your heart.\"",es:"«Fíate de Jehová de todo tu corazón»."}}},
{q_en:"What did Dr. C. J. Fowler put on God's altar before he found peace?",q_es:"¿Qué puso el Dr. C. J. Fowler sobre el altar de Dios antes de encontrar paz?",options:{A:{en:"His Bible and his pulpit notes",es:"Su Biblia y sus notas de púlpito"},B:{en:"A gold-headed cane and a stovepipe hat",es:"Un bastón de cabeza dorada y un sombrero de copa"},C:{en:"The deed to his home",es:"La escritura de su casa"},D:{en:"His salary check",es:"Su cheque de sueldo"}}},
{q_en:"What did God ultimately show Dr. Fowler was the real obstacle to his sanctification?",q_es:"¿Qué le mostró Dios al Dr. Fowler que era el verdadero obstáculo a su santificación?",options:{A:{en:"A grudge against a deacon",es:"Un rencor contra un diácono"},B:{en:"Professional pride - desire to pastor a large church and hold prominent places",es:"Orgullo profesional - deseo de pastorear una iglesia grande y tener lugares prominentes"},C:{en:"A secret sin from his youth",es:"Un pecado secreto de su juventud"},D:{en:"Worry about his family's finances",es:"Preocupación por las finanzas de su familia"}}},
{q_en:"What is the SECOND reason for the defeat at Ai that Wayne identifies?",q_es:"¿Cuál es la SEGUNDA razón de la derrota en Hai que Wayne identifica?",options:{A:{en:"Lack of equipment",es:"Falta de equipo"},B:{en:"Poor scouting of the terrain",es:"Mal reconocimiento del terreno"},C:{en:"Untrained soldiers",es:"Soldados no entrenados"},D:{en:"Neglect of prayer - silence before the battle",es:"Descuido de la oración - silencio antes de la batalla"}}},
{q_en:"Wayne quotes a verse that ends, \"And Satan trembles when he sees / The weakest saint upon his ____.\"",q_es:"Wayne cita una estrofa que termina: «Y Satanás tiembla cuando ve / Al santo más débil sobre sus ____».",options:{A:{en:"Feet",es:"Pies"},B:{en:"Rooftop",es:"Techo"},C:{en:"Watchtower",es:"Atalaya"},D:{en:"Knees",es:"Rodillas"}}},
{q_en:"What did Achan take from the spoils of Jericho?",q_es:"¿Qué tomó Acán de los despojos de Jericó?",options:{A:{en:"A bronze sword and a silver shield",es:"Una espada de bronce y un escudo de plata"},B:{en:"A Babylonian cloak, silver, and a wedge of gold",es:"Un manto babilónico, plata y una cuña de oro"},C:{en:"Two oxen and a war horse",es:"Dos bueyes y un caballo de guerra"},D:{en:"Pottery and grain",es:"Cerámica y grano"}}},
{q_en:"When God explained the defeat to Joshua, what was the underlying problem?",q_es:"Cuando Dios le explicó la derrota a Josué, ¿cuál era el problema de fondo?",options:{A:{en:"The army was outnumbered",es:"El ejército estaba superado en número"},B:{en:"The spies had lied",es:"Los espías habían mentido"},C:{en:"The covenant was broken; one man had taken what was devoted to God",es:"El pacto estaba roto; un hombre había tomado lo que estaba dedicado a Dios"},D:{en:"The LORD had withdrawn His promise",es:"El SEÑOR había retirado Su promesa"}}},
{q_en:"In the \"Ring the Bell\" story, what did the dying farmer do that brought his healing?",q_es:"En la historia de «Toca la campana», ¿qué hizo el granjero moribundo que trajo su sanidad?",options:{A:{en:"He confessed his faults to each of his children one by one",es:"Confesó sus faltas a cada uno de sus hijos uno por uno"},B:{en:"He recited the Lord's Prayer aloud",es:"Recitó el Padrenuestro en voz alta"},C:{en:"He had the elders anoint him with oil",es:"Hizo que los ancianos lo ungieran con aceite"},D:{en:"He drank a remedy his wife prepared",es:"Bebió un remedio que su esposa preparó"}}},
{q_en:"What James verse does Wayne attach to the Ring-the-Bell story?",q_es:"¿Qué versículo de Santiago vincula Wayne a la historia de Toca-la-Campana?",options:{A:{en:"\"Faith without works is dead.\"",es:"«La fe sin obras es muerta»."},B:{en:"\"Confess your faults one to another, that ye may be healed.\"",es:"«Confesaos vuestras ofensas unos a otros, para que seáis sanados»."},C:{en:"\"Resist the devil and he will flee from you.\"",es:"«Resistid al diablo, y huirá de vosotros»."},D:{en:"\"The prayer of a righteous man avails much.\"",es:"«La oración eficaz del justo puede mucho»."}}},
{q_en:"Who was Karla Faye Tucker?",q_es:"¿Quién fue Karla Faye Tucker?",options:{A:{en:"A pickax killer who became a born-again Christian in prison and was executed Feb 3, 1998",es:"Una asesina con pico que se hizo cristiana nacida de nuevo en prisión y fue ejecutada el 3 de febrero de 1998"},B:{en:"A holiness preacher converted at a camp meeting",es:"Una predicadora de santidad convertida en una reunión de campamento"},C:{en:"A missionary to New Guinea who died in the field",es:"Una misionera a Nueva Guinea que murió en el campo"},D:{en:"The wife of Achan in rabbinic tradition",es:"La esposa de Acán en tradición rabínica"}}},
{q_en:"Who wrote a song based on the Achan/Ai story while serving on Wayne's church staff?",q_es:"¿Quién escribió una canción basada en la historia de Acán/Hai mientras servía en el equipo de la iglesia de Wayne?",options:{A:{en:"Luci Shaw",es:"Luci Shaw"},B:{en:"Ray Stedman",es:"Ray Stedman"},C:{en:"Doug Goins",es:"Doug Goins"},D:{en:"John Fischer",es:"John Fischer"}}},
{q_en:"How is a monkey caught in the New Guinea gourd-trap illustration?",q_es:"¿Cómo es atrapado un mono en la ilustración de la trampa de calabaza de Nueva Guinea?",options:{A:{en:"Hunters startle it from the canopy",es:"Cazadores lo asustan desde el dosel"},B:{en:"It falls asleep eating the bait",es:"Se queda dormido comiendo el cebo"},C:{en:"It steps on a hidden snare",es:"Pisa un lazo oculto"},D:{en:"It refuses to let go of the nuts in its fist and cannot pull its hand free",es:"Se rehúsa a soltar las nueces en su puño y no puede sacar la mano"}}},
{q_en:"What is the literal meaning of Achan's name?",q_es:"¿Cuál es el significado literal del nombre Acán?",options:{A:{en:"Trouble",es:"Problema"},B:{en:"Beloved",es:"Amado"},C:{en:"Wandering",es:"Errante"},D:{en:"Hidden",es:"Oculto"}}},
{q_en:"When God spoke to Joshua about attacking Ai a second time, what were His first words?",q_es:"Cuando Dios le habló a Josué sobre atacar a Hai por segunda vez, ¿cuáles fueron Sus primeras palabras?",options:{A:{en:"\"I have given you the city's spoils.\"",es:"«Te he entregado los despojos de la ciudad»."},B:{en:"\"Sharpen your swords.\"",es:"«Afilen sus espadas»."},C:{en:"\"Do not fear or be dismayed.\"",es:"«No temas ni desmayes»."},D:{en:"\"Build an altar on Mount Ebal.\"",es:"«Edifica un altar en el monte Ebal»."}}},
{q_en:"Where did Joshua build an altar after Ai was taken (Joshua 8:30)?",q_es:"¿Dónde edificó Josué un altar después de que fue tomada Hai (Josué 8:30)?",options:{A:{en:"Mount Sinai",es:"Monte Sinaí"},B:{en:"Mount Gerizim",es:"Monte Gerizim"},C:{en:"Mount Carmel",es:"Monte Carmelo"},D:{en:"Mount Ebal",es:"Monte Ebal"}}},
{q_en:"What did Joshua do at Mount Ebal and Mount Gerizim after the altar was built (Joshua 8:32-35)?",q_es:"¿Qué hizo Josué en el monte Ebal y el monte Gerizim después de que se edificó el altar (Josué 8:32-35)?",options:{A:{en:"He divided the Promised Land among the tribes",es:"Repartió la Tierra Prometida entre las tribus"},B:{en:"He commissioned the priests as judges",es:"Comisionó a los sacerdotes como jueces"},C:{en:"He inscribed the Law on stones and read all the blessings and curses to the assembly",es:"Inscribió la Ley en piedras y leyó todas las bendiciones y maldiciones a la asamblea"},D:{en:"He led the people in a national fast",es:"Dirigió al pueblo en un ayuno nacional"}}}
];
const KEY=['B','A','C','C','A','B','B','D','D','B','C','A','B','A','D','D','A','C','D','C'];

// SA: split kw_en/kw_es (was pooled: first 5 EN, last 5 ES)
const KW=[
{q_en:"State Wayne's central principle about sin, captured in John Fischer's song.",q_es:"Enuncia el principio central de Wayne sobre el pecado, capturado en la canción de John Fischer.",
 kw_en:['alone','sin','other','effect','consequen','famil','ripple','love'], kw_es:['solas','pecado','otros','efecto','consecuen','familia','ondas','aman'],
 modelEn:"Joshua 7 teaches the other half of the truth: sometimes bad things happen to people who do bad things, and the consequences fall on the people they love. One man, Achan, took, and the whole nation suffered; thirty-six men died on the slope of Ai. Wayne's story of Dave and Debbie shows the same ripple: a father's neglect pulled five children away from church, and the effects reached the ones he loved most. You do not sin alone. Sin spreads outward like ripples on a stream, and others always feel it.", modelEs:"Josué 7 enseña la otra mitad de la verdad: a veces les pasan cosas malas a personas que hacen cosas malas, y las consecuencias caen sobre la gente que aman. Un hombre, Acán, tomó, y toda la nación sufrió; treinta y seis hombres murieron en la cuesta de Hai. La historia de Dave y Debbie muestra la misma onda: el descuido de un padre alejó a cinco hijos de la iglesia, y los efectos alcanzaron a los que más amaba. No pecas a solas. El pecado se extiende como ondas en un arroyo, y otros siempre lo sienten."},
{q_en:"Identify the three reasons for failure that Wayne draws from Joshua 7.",q_es:"Identifica las tres razones del fracaso que Wayne saca de Josué 7.",
 kw_en:['pride','prayer','disobe','neglect','sin','ai','confiden','achan'], kw_es:['orgullo','oración','desobed','descuido','pecado','hai','confian','acán'],
 modelEn:"Three reasons explain the defeat at Ai. First, pride: after Jericho fell without a sword, the confident spies advised sending only three thousand men, and Joshua agreed without asking God, for pride goes before a fall. Second, neglect of prayer: the text records no prayer before the battle; the weakest saint on his knees has more power than the strongest army on the slope. Third, disobedience: Achan's hidden sin had broken the covenant. Pride opened the door, prayerlessness left it open, and Achan's disobedience walked through it.", modelEs:"Tres razones explican la derrota en Hai. Primero, el orgullo: tras caer Jericó sin espada, los espías confiados aconsejaron enviar solo tres mil hombres, y Josué accedió sin preguntar a Dios, pues antes de la caída va la altivez. Segundo, el descuido de la oración: el texto no registra oración antes de la batalla; el santo más débil de rodillas tiene más poder que el ejército más fuerte. Tercero, la desobediencia: el pecado oculto de Acán había roto el pacto. El orgullo abrió la puerta, la falta de oración la dejó abierta, y la desobediencia de Acán entró por ella."},
{q_en:"Summarize Dr. C. J. Fowler's altar story and what he learned about pride.",q_es:"Resume la historia del altar del Dr. C. J. Fowler y lo que aprendió sobre el orgullo.",
 kw_en:['fowler','cane','hat','altar','professional','pride','prominen','reputation'], kw_es:['fowler','bastón','sombrero','altar','profesional','orgullo','prominen','reputación'],
 modelEn:"Dr. C. J. Fowler, a noted holiness preacher, went to the altar seeking to be sanctified and laid down many things, including his gold-headed cane and his stovepipe hat. Yet the witness did not come. When he asked God what remained, God showed him a professional pride, a desire to be known as pastor of a large church and to hold places of prominence. Only when he surrendered his reputation to God did peace come. God then gave him a wider usefulness than pride could ever have won. The deepest idol is often the love of one's own prominence.", modelEs:"El Dr. C. J. Fowler, un notable predicador de santidad, fue al altar buscando ser santificado y entregó muchas cosas, incluyendo su bastón de cabeza dorada y su sombrero de copa. Pero el testimonio no llegaba. Cuando preguntó a Dios qué quedaba, Dios le mostró un orgullo profesional, un deseo de ser conocido como pastor de una iglesia grande y de tener lugares de prominencia. Solo cuando entregó su reputación a Dios vino la paz. Dios le dio una utilidad más amplia de la que el orgullo jamás habría ganado. El ídolo más profundo suele ser el amor a la propia prominencia."},
{q_en:"Explain why \\\"Pride goes before destruction\\\" applied to Joshua's response to the spies' report.",q_es:"Explica por qué «Antes del quebrantamiento es la soberbia» se aplicó a la respuesta de Josué al reporte de los espías.",
 kw_en:['pride','spies','report','confiden','fall','ai','prayer','three'], kw_es:['orgullo','espía','reporte','confian','caída','hai','oración','tres'],
 modelEn:"After Jericho, pride and overconfidence set the trap. The spies brought back a confident report: the people of Ai are few, send only two or three thousand men. Joshua took the report without praying about it. The men of Ai routed them, and thirty-six fell. Proverbs warns, pride goes before destruction and a haughty spirit before a fall. The army was riding a winning streak, so no one asked God; the confident report rested on a sin no one had dealt with, and the fall came at Ai.", modelEs:"Tras Jericó, el orgullo y el exceso de confianza prepararon la trampa. Los espías trajeron un reporte confiado: los de Hai son pocos, envía solo dos o tres mil hombres. Josué tomó el reporte sin orar. Los hombres de Hai los derrotaron, y treinta y seis cayeron. Proverbios advierte: antes del quebrantamiento es la soberbia, y antes de la caída la altivez. El ejército venía de una racha ganadora, así que nadie preguntó a Dios; el reporte confiado descansaba sobre un pecado no tratado, y la caída vino en Hai."},
{q_en:"Describe how the \\\"Ring the Bell\\\" story illustrates James's command about confession.",q_es:"Describe cómo la historia de «Toca la campana» ilustra el mandato de Santiago sobre la confesión.",
 kw_en:['confess','fault','heal','ring','bell','farmer','james','hidden'], kw_es:['confes','falta','sanid','campana','toca','granjero','santiago','oculto'],
 modelEn:"Wayne illustrates confession with a dying farmer. Resigned to death, he suddenly told his wife, Ring the bell, the signal for the family to gather for goodbye. As they wept around him he began confessing his faults to his children one by one, where he had wronged them. When he was through he asked for his clothes: the Lord had healed him. Confession can heal a home. James 5:16 says, confess your faults one to another that ye may be healed. Confession is the only thing that drags hidden sin into the open where God can deal with it; the bell has to be rung.", modelEs:"Wayne ilustra la confesión con un granjero moribundo. Resignado a morir, de repente dijo a su esposa: Toca la campana, la señal para que la familia se reuniera a despedirse. Mientras lloraban a su alrededor comenzó a confesar sus faltas a sus hijos uno por uno, donde los había agraviado. Al terminar pidió su ropa: el Señor lo había sanado. Santiago 5:16 dice: confesaos vuestras ofensas unos a otros, para que seáis sanados. La confesión es lo único que saca el pecado oculto a la luz donde Dios puede tratarlo; hay sanidad cuando se toca la campana."},
{q_en:"Explain why Achan's whole household was punished and what lesson it teaches about sin's reach.",q_es:"Explica por qué toda la casa de Acán fue castigada y qué lección enseña sobre el alcance del pecado.",
 kw_en:['famil','household','consequen','ripple','alone','sin','other','spread'], kw_es:['familia','casa','consecuen','ondas','solas','pecado','otros','extiende'],
 modelEn:"John Fischer's refrain says it: you don't sin alone. Achan buried his loot in his own tent, but the consequences spread to the whole camp and finally to his own household. Sin is never private; like ripples on a stream it spreads outward from one heart to family and others who never touched the stolen goods. The thirty-six who died at Ai never saw Achan's tent, yet they bore his sin. No one sins in isolation; what we hide always reaches the people around us.", modelEs:"El estribillo de John Fischer lo dice: no pecas a solas. Acán enterró su botín en su propia tienda, pero las consecuencias se extendieron a todo el campamento y al fin a su propia casa. El pecado nunca es privado; como ondas en un arroyo se extiende hacia afuera de un corazón a la familia y a otros que nunca tocaron lo robado. Los treinta y seis que murieron en Hai nunca vieron la tienda de Acán, pero cargaron su pecado. Nadie peca en aislamiento; lo que escondemos siempre alcanza a la gente a nuestro alrededor."},
{q_en:"Identify the meaning of Achan's name and how it relates to the Valley of Achor.",q_es:"Identifica el significado del nombre Acán y cómo se relaciona con el Valle de Acor.",
 kw_en:['trouble','achan','achor','valley','name','hope','door','hosea'], kw_es:['problema','acán','acor','valle','nombre','esperanza','puerta','oseas'],
 modelEn:"Achan and his family were dealt with publicly in a valley that took its name from the event: the Valley of Achor, which means trouble. The sin that troubled Israel was brought into the open and judged, and the covenant was restored. But the story does not end in trouble. Centuries later Hosea 2:15 promises that God will make the Valley of Achor a door of hope. The very place named for trouble becomes, in grace, the doorway through which hope enters; sin confessed and judged opens the way back to blessing.", modelEs:"Acán y su familia fueron tratados públicamente en un valle que tomó su nombre del suceso: el Valle de Acor, que significa problema. El pecado que turbó a Israel fue sacado a la luz y juzgado, y el pacto fue restaurado. Pero la historia no termina en problema. Siglos después Oseas 2:15 promete que Dios hará del Valle de Acor una puerta de esperanza. El mismo lugar llamado por el problema se vuelve, por gracia, la puerta por donde entra la esperanza; el pecado confesado y juzgado abre el camino de regreso a la bendición."},
{q_en:"Describe the New Guinea monkey-trap illustration and what it teaches about holding onto sin.",q_es:"Describe la ilustración de la trampa para monos y lo que enseña sobre aferrarse al pecado.",
 kw_en:['monkey','gourd','nuts','let','slave','grasp','hand','release'], kw_es:['mono','calabaza','nueces','soltar','esclav','agarr','mano','puño'],
 modelEn:"The New Guinea monkey trap is a gourd tied down, with a hole just big enough for an open hand. Inside are nuts. The monkey reaches in, grasps a fistful, and cannot pull his closed hand back through the hole. He could be free in an instant if he would simply let go of the nuts, but he will not release them, and so he is caught. That is the slave to sin: not held by the trap but by his own refusal to open his hand. Sin keeps no one it cannot persuade to keep holding on.", modelEs:"La trampa para monos de Nueva Guinea es una calabaza atada, con un agujero apenas del tamaño de una mano abierta. Adentro hay nueces. El mono mete la mano, agarra un puño lleno, y no puede sacar su mano cerrada por el agujero. Podría quedar libre al instante si simplemente soltara las nueces, pero no quiere soltarlas, y así queda atrapado. Ese es el esclavo del pecado: no lo retiene la trampa sino su propia negativa a abrir la mano. El pecado no retiene a nadie a quien no convenza de seguir aferrado."},
{q_en:"Summarize what changed for Israel after Achan was dealt with and they returned to Ai (Joshua 8).",q_es:"Resume qué cambió para Israel después de que se trató con Acán y regresaron a Hai (Josué 8).",
 kw_en:['fear','ambush','victory','given','restor','dismayed','ai','covenant'], kw_es:['temas','emboscada','victoria','entregado','restaur','desmay','hai','pacto'],
 modelEn:"Once Achan's sin was judged and the covenant restored, God spoke to Joshua again: Do not fear or be dismayed; take all the people and go up to Ai, for I have given its king and land into your hand. This time God's strategy used an ambush, drawing the men of Ai out of the city, then taking it from behind. The same Ai that routed Israel a week earlier now fell, and the victory came. The lesson: with sin dealt with and the covenant restored, the city that could not be taken was given.", modelEs:"Una vez que el pecado de Acán fue juzgado y el pacto restaurado, Dios habló a Josué otra vez: No temas ni desmayes; toma a todo el pueblo y sube a Hai, porque he entregado en tu mano a su rey y su tierra. Esta vez la estrategia de Dios usó una emboscada, sacando a los hombres de Hai de la ciudad, y luego tomándola por detrás. La misma Hai que derrotó a Israel una semana antes ahora cayó, y vino la victoria. La lección: tratado el pecado y restaurado el pacto, la ciudad que no se podía tomar fue entregada."},
{q_en:"Explain the significance of building the altar on Mount Ebal and reading the Law (Joshua 8:30-35).",q_es:"Explica la significancia de construir el altar en el monte Ebal y leer la Ley (Josué 8:30-35).",
 kw_en:['altar','ebal','gerizim','law','bless','curse','read','covenant'], kw_es:['altar','ebal','gerizim','ley','bendic','maldic','leyó','pacto'],
 modelEn:"After the victory, Joshua climbed Mount Ebal and built an altar to the LORD, then read the whole Law aloud over the assembled nation, every word, blessings and curses both. Half the tribes stood on Mount Gerizim for the blessings and half on Mount Ebal for the curses, with the law read between them. The covenant that Achan had broken was now publicly renewed before all Israel. God will gladly bless an army that has dealt with its sin and gathered again around His altar and His Word.", modelEs:"Tras la victoria, Josué subió al monte Ebal y edificó un altar a Jehová, luego leyó toda la Ley en voz alta sobre la nación reunida, cada palabra, bendiciones y maldiciones por igual. La mitad de las tribus se puso en el monte Gerizim para las bendiciones y la mitad en el monte Ebal para las maldiciones, con la ley leída entre ellos. El pacto que Acán había roto fue ahora renovado públicamente ante todo Israel. Dios bendecirá con gusto a un ejército que ha tratado su pecado y se ha reunido de nuevo alrededor de Su altar y Su Palabra."}
];

// ---------- State ----------
let mcAnswers = new Array(20).fill(null);
let kwAnswers = new Array(10).fill('');
try{const st=JSON.parse(localStorage.getItem(STATE_KEY)||'{}');if(Array.isArray(st.mcAnswers)&&st.mcAnswers.length===20)mcAnswers=st.mcAnswers;if(Array.isArray(st.kwAnswers)&&st.kwAnswers.length===10)kwAnswers=st.kwAnswers;}catch(e){}
function saveState(){try{localStorage.setItem(STATE_KEY,JSON.stringify({mcAnswers,kwAnswers}));}catch(e){}}

// ---------- Render MC ----------
const mcc=document.getElementById('mc-questions');
function renderMC(){
  mcc.innerHTML='';
  MC.forEach((q,idx)=>{
    const n=idx+1;
    const div=document.createElement('div');
    div.className='question';
    const fb='<div class="mc-fb" id="mcfb'+n+'" style="margin-top:6px;font-size:.9rem"></div>';
    let h='<p class="q"><strong>'+n+'.</strong> <span class="en-only">'+q.q_en+'</span><span class="es-only">'+q.q_es+'</span></p><div class="options">';
    ['A','B','C','D'].forEach(L=>{
      const o=q.options[L];
      const checked = (mcAnswers[idx]===L) ? ' checked' : '';
      const disabled = mcPreviouslyPassed ? ' disabled' : '';
      h+='<label><input type="radio" name="mc'+n+'" value="'+L+'"'+checked+disabled+'> <strong>'+L+'.</strong> <span class="en-only">'+o.en+'</span><span class="es-only">'+o.es+'</span></label>';
    });
    h+='</div>'+fb;
    div.innerHTML=h;
    mcc.appendChild(div);
    if(mcAnswers[idx]) showMCFeedback(idx, mcAnswers[idx]);
    div.querySelectorAll('input[type=radio]').forEach(r=>{
      r.addEventListener('change',()=>{
        if(mcPreviouslyPassed) return;
        mcAnswers[idx]=r.value;
        saveState();
        showMCFeedback(idx, r.value);
      });
    });
  });
}
function showMCFeedback(idx, picked){
  const fb=document.getElementById('mcfb'+(idx+1));
  if(!fb) return;
  const correct = KEY[idx];
  if(picked === correct){
    fb.style.color = '#1f6b3b';
    fb.innerHTML = '<span class="en-only">✓ Correct!</span><span class="es-only">✓ ¡Correcto!</span>';
  } else {
    fb.style.color = '#8a1f1f';
    fb.innerHTML = '<span class="en-only">✗ Incorrect. Correct: '+correct+'.</span><span class="es-only">✗ Incorrecto. Correcta: '+correct+'.</span>';
  }
}

// ---------- Render KW ----------
const kwc=document.getElementById('kw-questions');
function renderKW(){
  kwc.innerHTML='';
  KW.forEach((q,idx)=>{
    const n=21+idx;
    const div=document.createElement('div');
    div.className='question';
    div.innerHTML='<p class="q"><strong>'+n+'.</strong> <span class="en-only">'+q.q_en+'</span><span class="es-only">'+q.q_es+'</span></p><textarea id="kw'+(idx+1)+'" rows="3" placeholder="Your answer / Tu respuesta..." aria-label="Your answer / Tu respuesta..."></textarea>'+'<div class="js-model-box" style="display:none;margin-top:10px;padding:10px 12px;background:#fbf3d5;border:1px solid #d4af37;border-radius:8px;"><strong><span class="en-only">Model answer — study this</span><span class="es-only">Respuesta modelo — estúdiela</span></strong><br><span class="en-only">'+q.modelEn+'</span><span class="es-only">'+q.modelEs+'</span></div>' ;
    kwc.appendChild(div);
    const ta = div.querySelector('textarea');
    ta.value = kwAnswers[idx] || '';
    ta.addEventListener('input', e => { kwAnswers[idx] = e.target.value; saveState(); });
  });
}

renderMC();
renderKW();

// ---------- Controls ----------
const submitBtn=document.getElementById('submit-btn');
const resetBtn=document.getElementById('reset-btn');
const resultEl=document.getElementById('result');
const bankedEl=document.getElementById('mc-banked-notice');
const nextBtn=document.getElementById('next-unit-btn');
const prevBtn=document.getElementById('prev-unit-btn');
if(progress['unit'+UNIT])nextBtn.disabled=false;

function renderBankedNotice(){
  const isEs=document.body.classList.contains('lang-es');
  if(mcPreviouslyPassed && !unitPassed){
    bankedEl.style.display='block';
    bankedEl.innerHTML = isEs
      ? '✓ MC ya aprobado y guardado. Solo necesita reenviar la sección de respuesta corta (9/10).'
      : '✓ MC already passed and banked. Only need to resubmit the short-answer section (9/10).';
  } else {
    bankedEl.style.display='none';
  }
}

function checkLockouts(){
  const isEs=document.body.classList.contains('lang-es');
  const now=Date.now();
  const fullLock=parseInt(localStorage.getItem(FULL_LOCK_KEY)||'0',10);
  const saLock=parseInt(localStorage.getItem(SA_LOCK_KEY)||'0',10);

  if(unitPassed){
    submitBtn.disabled=true;
    resultEl.style.color='#1f6b3b';
    resultEl.textContent = isEs ? `✓ Unidad ya aprobada. Haga clic en Unidad ${UNIT + 1}.` : `✓ Unit already passed. Click Unit ${UNIT + 1}.`;
    renderBankedNotice();
    return true;
  }
  if(now<fullLock){
    const m=Math.ceil((fullLock-now)/60000);
    submitBtn.disabled=true;
    resultEl.style.color='#8a1f1f';
    resultEl.textContent = isEs ? '⏰ Bloqueado. Espera '+m+' min.' : '⏰ Locked. Wait '+m+' min.';
    renderBankedNotice();
    setTimeout(checkLockouts,30000);
    return false;
  }
  if(mcPreviouslyPassed && now<saLock){
    const m=Math.ceil((saLock-now)/60000);
    submitBtn.disabled=true;
    resultEl.style.color='#8a1f1f';
    resultEl.textContent = isEs ? '⏰ MC ✓ aprobado. Sección SA bloqueada. Espera '+m+' min.' : '⏰ MC ✓ passed. SA section locked. Wait '+m+' min.';
    renderBankedNotice();
    setTimeout(checkLockouts,30000);
    return false;
  }
  submitBtn.disabled=false;
  resultEl.textContent='';
  renderBankedNotice();
  return true;
}

function gradeMC(){let c=0;for(let i=0;i<20;i++){if(mcAnswers[i]===KEY[i])c++;}return c;}

// kwHit: short keywords (<=4 chars) match as whole words; longer keywords match
// as a left-boundary prefix (so intentional stems like 'medita','sacrific' still
// catch inflections, while 'no'/'ed'/'og' no longer match inside longer words).
// Word chars include accented Spanish letters.
function kwHit(ans, k){
  k = (k||'').toLowerCase();
  if(!k) return false;
  var WC = '0-9a-z\\u00e1\\u00e9\\u00ed\\u00f3\\u00fa\\u00f1\\u00fc';
  var esc = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  var pat = (k.length <= 4)
    ? '(?:^|[^'+WC+'])'+esc+'(?![' + WC + '])'
    : '(?:^|[^'+WC+'])'+esc;
  try { return new RegExp(pat, 'i').test(ans); }
  catch(e){ return ans.indexOf(k) !== -1; }
}

function gradeSA(){
  const isEs=document.body.classList.contains('lang-es');
  let c=0;
  for(let i=0;i<10;i++){
    const ans=(kwAnswers[i]||'').toLowerCase();
    if(ans.length < 100) continue;
    const kws = isEs ? KW[i].kw_es : KW[i].kw_en;
    let hits=0;
    kws.forEach(k=>{ if(kwHit(ans,k)) hits++; });
    if(hits >= 3) c++;
  }
  return c;
}

// Masters-level = M.Div. OR Th.M. Both graded on MC AND SA. Route grading through this.
function isMastersLevel(track){ return track === 'mdiv' || track === 'thm'; }

function passUnit(message){
  progress['unit'+UNIT]=true;
  localStorage.setItem(PROGRESS_KEY,JSON.stringify(progress));
  unitPassed=true;
  resultEl.style.color='#1f6b3b';
  resultEl.textContent=message;
  nextBtn.disabled=false;
  const pills=grid.querySelectorAll('.unit-pill');
  if(pills[UNIT-1]){pills[UNIT-1].classList.add('done');pills[UNIT-1].classList.remove('current');}
}

submitBtn.addEventListener('click',()=>{
  if(!checkLockouts()) return;
  if(unitPassed) return;
  if(!student || !student.name){
    alert(document.body.classList.contains('lang-es') ? 'Por favor regístrese primero en la Unidad 1.' : 'Please register on Unit 1 first.');
    return;
  }
  const isEs=document.body.classList.contains('lang-es');
  const track=(student && student.track) || 'certificate';
  document.querySelectorAll('.js-model-box').forEach(function(e){ e.style.display='block'; });
  const mcScore = mcPreviouslyPassed ? 20 : gradeMC();
  const mcOk = mcScore >= 18;

  if(!isMastersLevel(track)){ // certificate / non-Masters: MC only
    if(mcOk){
      localStorage.setItem(MC_PASS_KEY,'true');
      mcPreviouslyPassed=true;
      passUnit(isEs ? '✓ ¡APROBADO! '+mcScore+'/20. Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.' : '✓ PASSED! '+mcScore+'/20. Your answers are marked below. Review them, then use the button at the top to continue.');
    } else {
      localStorage.setItem(FULL_LOCK_KEY, String(Date.now()+2*60*1000));
      resultEl.style.color='#8a1f1f';
      resultEl.textContent = isEs ? '✗ Reprobado: '+mcScore+'/20 (se requiere 18). Bloqueado 2 minutos.' : '✗ Failed: '+mcScore+'/20 (need 18). Locked 2 minutes.';
      checkLockouts();
    }
    return;
  }

  const saScore = gradeSA();
  const saOk = saScore >= 9;

  if(mcPreviouslyPassed){
    if(saOk){
      passUnit(isEs ? '✓ ¡APROBADO! MC ✓ banco + SA '+saScore+'/10. Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.' : '✓ PASSED! MC ✓ banked + SA '+saScore+'/10. Your answers are marked below. Review them, then use the button at the top to continue.');
    } else {
      localStorage.setItem(SA_LOCK_KEY, String(Date.now()+15*60*1000));
      resultEl.style.color='#8a1f1f';
      resultEl.textContent = isEs ? '✗ MC ✓ permanece aprobado. SA reprobada: '+saScore+'/10 (se requiere 9). Sección SA bloqueada 15 min.' : '✗ MC ✓ stays passed. SA failed: '+saScore+'/10 (need 9). SA section locked 15 min.';
      checkLockouts();
    }
    return;
  }

  if(mcOk && saOk){
    localStorage.setItem(MC_PASS_KEY,'true');
    mcPreviouslyPassed=true;
    passUnit(isEs ? '✓ ¡APROBADO! MC '+mcScore+'/20 + SA '+saScore+'/10. Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.' : '✓ PASSED! MC '+mcScore+'/20 + SA '+saScore+'/10. Your answers are marked below. Review them, then use the button at the top to continue.');
  } else if(mcOk && !saOk){
    localStorage.setItem(MC_PASS_KEY,'true');
    mcPreviouslyPassed=true;
    localStorage.setItem(SA_LOCK_KEY, String(Date.now()+15*60*1000));
    renderMC();
    resultEl.style.color='#8a1f1f';
    resultEl.textContent = isEs ? 'MC '+mcScore+'/20 ✓ aprobado y guardado. SA '+saScore+'/10 (se requiere 9). Sección SA bloqueada 15 min. Al desbloquear, reenvíe solo la SA — el MC permanece aprobado.' : 'MC '+mcScore+'/20 ✓ passed and banked. SA '+saScore+'/10 (need 9). SA section locked 15 min. When unlocked, resubmit SA only — MC stays passed.';
    checkLockouts();
  } else {
    localStorage.setItem(FULL_LOCK_KEY, String(Date.now()+2*60*1000));
    resultEl.style.color='#8a1f1f';
    resultEl.textContent = isEs ? '✗ Reprobado: MC '+mcScore+'/20 + SA '+saScore+'/10 (se requiere 18 y 9). Unidad bloqueada 2 minutos.' : '✗ Failed: MC '+mcScore+'/20 + SA '+saScore+'/10 (need 18 and 9). Unit locked 2 minutes.';
    checkLockouts();
  }
});

resetBtn.addEventListener('click',()=>{
  const isEs=document.body.classList.contains('lang-es');
  const msg = isEs
    ? '¿Reiniciar esta unidad?\n\nEsto borrará: respuestas en progreso, estado MC aprobado, todos los bloqueos, y el indicador de aprobación de esta unidad.\n\nEl contenido docente permanece. Esta acción no se puede deshacer.'
    : 'Reset this unit?\n\nThis will clear: in-progress answers, MC-passed state, all lockouts, and this unit\'s pass flag.\n\nTeaching content stays. This cannot be undone.';
  if(!confirm(msg)) return;
  localStorage.removeItem(STATE_KEY);
  localStorage.removeItem(MC_PASS_KEY);
  localStorage.removeItem(SA_LOCK_KEY);
  localStorage.removeItem(FULL_LOCK_KEY);
  delete progress['unit'+UNIT];
  localStorage.setItem(PROGRESS_KEY,JSON.stringify(progress));
  location.reload();
});

prevBtn.addEventListener('click',()=>{window.location.href=PREV_UNIT_URL;});
nextBtn.addEventListener('click',()=>{if(!nextBtn.disabled)window.location.href=NEXT_UNIT_URL;});

checkLockouts();
})();
