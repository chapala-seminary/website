/* Exam engine for CTSJosh (shared by 1 unit page).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/josh/unitN.js. */
// CTS Joshua — Unit 6: Gibeonite Deception & the Long Day (Joshua 9-10). Retrofit 2026-05-16.
// MC L3 verified | KEY distribution A=B=C=D=5 | split kw_en/kw_es | track gating | MC-persist
(function(){
'use strict';

const UNIT = 6;
const COURSE = 'josh';
const NEXT_UNIT_URL = 'CTSJoshUnit7.html';
const PREV_UNIT_URL = 'CTSJoshUnit5.html';

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

const MC=[
{q_en:"What new spiritual danger does Joshua 9 introduce after the victory at Ai?",q_es:"¿Qué nuevo peligro espiritual introduce Josué 9 después de la victoria en Hai?",options:{A:{en:"Famine in the camp",es:"Hambre en el campamento"},B:{en:"Internal division",es:"División interna"},C:{en:"Deception by enemies pretending to be allies",es:"Engaño por enemigos fingiendo ser aliados"},D:{en:"A counterstrike from the east",es:"Un contraataque del oriente"}}},
{q_en:"What boyhood story does Wayne use to illustrate human indifference to spiritual warning?",q_es:"¿Qué historia de niñez usa Wayne para ilustrar la indiferencia humana ante la advertencia espiritual?",options:{A:{en:"Hog killing day &mdash; surviving hogs ate as if nothing happened",es:"Día de matanza de cerdos &mdash; los cerdos sobrevivientes comían como si nada"},B:{en:"A flock of geese flying south",es:"Una bandada de gansos volando al sur"},C:{en:"A team of mules at plow",es:"Una yunta de mulas arando"},D:{en:"A dog watching its pack member fall",es:"Un perro viendo caer a un compañero"}}},
{q_en:"William Moses Tidwell's mountain-pass illustration argues:",q_es:"La ilustración del paso de montaña de William Moses Tidwell argumenta:",options:{A:{en:"Trust the strongest leaper",es:"Confía en el mejor saltador"},B:{en:"Build bridges across hard places",es:"Construye puentes en lugares difíciles"},C:{en:"Stay home when in doubt",es:"Quédate en casa cuando dudes"},D:{en:"If 100 fell to their deaths you would not try the leap, yet you do exactly that with sin",es:"Si 100 cayeran a la muerte no intentarías el salto, pero eso es lo que haces con el pecado"}}},
{q_en:"What disguise did the Gibeonites use to deceive Israel (Joshua 9:4-5)?",q_es:"¿Qué disfraz usaron los gabaonitas para engañar a Israel (Josué 9:4-5)?",options:{A:{en:"Royal robes and gold",es:"Ropa real y oro"},B:{en:"Worn-out sacks, cracked wineskins, patched sandals, moldy bread",es:"Costales gastados, odres rajados, sandalias remendadas, pan mohoso"},C:{en:"Soldier's armor",es:"Armadura de soldado"},D:{en:"Pilgrim's staffs and palm fronds",es:"Báculos de peregrino y palmas"}}},
{q_en:"What divinely-provided mechanism could Joshua have used to determine God's will about the Gibeonites?",q_es:"¿Qué mecanismo divinamente provisto podría haber usado Josué para determinar la voluntad de Dios sobre los gabaonitas?",options:{A:{en:"Casting lots before the elders",es:"Echar suertes ante los ancianos"},B:{en:"The Urim and Thummim in the high priest's breastpiece",es:"El Urim y el Tumim en el pectoral del sumo sacerdote"},C:{en:"A consultation with the prophets",es:"Una consulta con los profetas"},D:{en:"Reading the law aloud over the camp",es:"Leer la ley en voz alta sobre el campamento"}}},
{q_en:"In Aesop's two-frogs story, what was the cautious frog's question?",q_es:"En la historia de las dos ranas de Esopo, ¿cuál fue la pregunta de la rana cautelosa?",options:{A:{en:"\"Where will we find food?\"",es:"«¿Dónde hallaremos comida?»"},B:{en:"\"Are there other frogs there?\"",es:"«¿Hay otras ranas allí?»"},C:{en:"\"Will the well dry up?\"",es:"«¿Se secará el pozo?»"},D:{en:"\"How can we get out again from so great a depth?\"",es:"«¿Cómo saldremos de nuevo desde tan gran profundidad?»"}}},
{q_en:"Which verse does Wayne pair with Joshua 9 to call for discernment?",q_es:"¿Qué versículo vincula Wayne a Josué 9 para llamar al discernimiento?",options:{A:{en:"Matthew 10:16 &mdash; \"shrewd as snakes, innocent as doves\"",es:"Mateo 10:16 &mdash; «prudentes como serpientes, sencillos como palomas»"},B:{en:"Romans 12:2",es:"Romanos 12:2"},C:{en:"Galatians 6:7",es:"Gálatas 6:7"},D:{en:"Ephesians 6:11",es:"Efesios 6:11"}}},
{q_en:"What James verse does Wayne attach to \"Alert to Pray First\"?",q_es:"¿Qué versículo de Santiago vincula Wayne a «Alerta a orar primero»?",options:{A:{en:"James 5:16",es:"Santiago 5:16"},B:{en:"James 1:5 &mdash; \"If any of you lacks wisdom, let him ask of God\"",es:"Santiago 1:5 &mdash; «Si alguno tiene falta de sabiduría, pídala a Dios»"},C:{en:"James 4:7",es:"Santiago 4:7"},D:{en:"James 2:17",es:"Santiago 2:17"}}},
{q_en:"Who is the OT parallel Wayne draws to the Gibeonites &mdash; also a liar who came to faith?",q_es:"¿Quién es el paralelo del AT que Wayne traza a los gabaonitas?",options:{A:{en:"Esther",es:"Ester"},B:{en:"Naomi",es:"Noemí"},C:{en:"Rahab",es:"Rahab"},D:{en:"Tamar",es:"Tamar"}}},
{q_en:"What four-fold honor does Wayne note God gave the Gibeonites in later history?",q_es:"¿Qué honor cuádruple nota Wayne que Dios dio a los gabaonitas?",options:{A:{en:"Priests, prophets, kings, scribes",es:"Sacerdotes, profetas, reyes, escribas"},B:{en:"Judges, mighty men, levites, governors",es:"Jueces, valientes, levitas, gobernadores"},C:{en:"Hewers/water; Nethinim place of honor; tabernacle at Gibeon; helpers in Nehemiah's wall",es:"Leñadores/agua; Netineos; tabernáculo en Gabaón; muro de Nehemías"},D:{en:"Singers, merchants, gatekeepers, soldiers",es:"Cantores, mercaderes, porteros, soldados"}}},
{q_en:"What Pauline verse does Wayne use to close the Gibeonite redemption arc?",q_es:"¿Qué versículo paulino usa Wayne para cerrar el arco de redención gabaonita?",options:{A:{en:"Romans 8:28 &mdash; \"all things work together for good\"",es:"Romanos 8:28 &mdash; «todas las cosas ayudan a bien»"},B:{en:"Philippians 4:13",es:"Filipenses 4:13"},C:{en:"Galatians 2:20",es:"Gálatas 2:20"},D:{en:"1 Corinthians 15:58",es:"1 Corintios 15:58"}}},
{q_en:"Who is Jaime Guerrero in Wayne's illustration?",q_es:"¿Quién es Jaime Guerrero en la ilustración de Wayne?",options:{A:{en:"A Spanish reformer",es:"Un reformador español"},B:{en:"A Briarwood deacon",es:"Un diácono de Briarwood"},C:{en:"A Mexican judge",es:"Un juez mexicano"},D:{en:"A Mexican white-collar bank robber serving 70 years who came to Christ in prison",es:"Un ladrón mexicano de cuello blanco con 70 años que vino a Cristo en prisión"}}},
{q_en:"How many Amorite kings allied against Gibeon (Joshua 10:5)?",q_es:"¿Cuántos reyes amorreos se aliaron contra Gabaón (Josué 10:5)?",options:{A:{en:"Three",es:"Tres"},B:{en:"Seven",es:"Siete"},C:{en:"Five",es:"Cinco"},D:{en:"Twelve",es:"Doce"}}},
{q_en:"The five kings came from Jerusalem, Hebron, Jarmuth, Lachish, and which fifth city?",q_es:"Los cinco reyes vinieron de Jerusalén, Hebrón, Jarmut, Laquis, y ¿cuál quinta ciudad?",options:{A:{en:"Eglon",es:"Eglón"},B:{en:"Gezer",es:"Gezer"},C:{en:"Hazor",es:"Hazor"},D:{en:"Bethel",es:"Betel"}}},
{q_en:"What killed more enemy soldiers than the Israelite sword at Beth-horon (Joshua 10:11)?",q_es:"¿Qué mató a más soldados enemigos que la espada israelita en Bet-horón (Josué 10:11)?",options:{A:{en:"Hailstones from heaven",es:"Piedras de granizo del cielo"},B:{en:"Earthquake",es:"Terremoto"},C:{en:"Lightning strikes",es:"Rayos"},D:{en:"Drowning in the Jordan",es:"Ahogamiento en el Jordán"}}},
{q_en:"What did Joshua command in his prayer at Gibeon (Joshua 10:12)?",q_es:"¿Qué ordenó Josué en su oración en Gabaón (Josué 10:12)?",options:{A:{en:"\"Drown the kings in the sea\"",es:"«Ahoga a los reyes en el mar»"},B:{en:"\"Sun, stand still upon Gibeon; and Moon, in the Valley of Aijalon\"",es:"«Sol, detente en Gabaón; y tú, luna, en el valle de Ajalón»"},C:{en:"\"Send angels to fight\"",es:"«Envía ángeles a pelear»"},D:{en:"\"Tear down the walls\"",es:"«Derriba los muros»"}}},
{q_en:"Joshua 10:14 says, \"There has been no day like that, before it or after it, that the LORD ___\":",q_es:"Josué 10:14 dice: «No hubo día como aquel, ni antes ni después de él, habiendo Jehová ___»:",options:{A:{en:"Sent a comet across the sky",es:"Enviado un cometa por el cielo"},B:{en:"Required a sacrifice of the king",es:"Requerido sacrificio del rey"},C:{en:"Rebuked Joshua for his prayer",es:"Reprendido a Josué por su oración"},D:{en:"Hearkened to the voice of a man, for the LORD fought for Israel",es:"Atendido a la voz de un hombre, porque Jehová peleaba por Israel"}}},
{q_en:"What did the captains of Israel do to the five kings brought from the cave at Makkedah (10:24)?",q_es:"¿Qué hicieron los capitanes de Israel a los cinco reyes traídos de la cueva en Maceda (10:24)?",options:{A:{en:"Made them swear allegiance and let them go",es:"Los hicieron jurar lealtad y los soltaron"},B:{en:"Put their feet on the necks of the kings",es:"Pusieron sus pies sobre los cuellos de los reyes"},C:{en:"Crowned a single king as ruler of all five",es:"Coronaron un solo rey sobre los cinco"},D:{en:"Sent them to Joshua's tent for trial",es:"Los enviaron a la tienda de Josué para juicio"}}},
{q_en:"What words did Joshua speak to the captains at the necks of the kings (10:25), echoing Joshua 1:9?",q_es:"¿Qué palabras dijo Josué a los capitanes sobre los cuellos de los reyes (10:25), haciendo eco de Josué 1:9?",options:{A:{en:"\"Trust in the LORD with all your heart\"",es:"«Fíate de Jehová con todo tu corazón»"},B:{en:"\"The battle is the LORD's\"",es:"«La batalla es de Jehová»"},C:{en:"\"I have set you over kings\"",es:"«Os he puesto sobre reyes»"},D:{en:"\"Fear not, nor be dismayed; be strong and of good courage\"",es:"«No temáis, ni os atemoricéis; sed fuertes y valientes»"}}},
{q_en:"What does Joshua 10:42 say is the reason the southern campaign succeeded against so many cities at one time?",q_es:"¿Qué dice Josué 10:42 que es la razón del éxito de la campaña del sur?",options:{A:{en:"Israel's superior tactics",es:"Tácticas superiores de Israel"},B:{en:"The kings' coalition collapsed",es:"La coalición de reyes colapsó"},C:{en:"\"The LORD God of Israel fought for Israel\"",es:"«Jehová el Dios de Israel peleaba por Israel»"},D:{en:"Famine in the south",es:"Hambre en el sur"}}}
];
const KEY=['C','A','D','B','B','D','A','B','C','C','A','D','C','A','A','B','D','B','D','C'];

const KW=[
{q_en:"State Wayne's three \\\"alerts\\\" from Joshua 9.",q_es:"Enuncia las tres «alertas» de Wayne en Josué 9.",
 kw_en:['victory','deceiv','pray','alert','first','ask','wisdom','decide'], kw_es:['victoria','engañ','orar','alerta','primero','pregunt','sabiduría','decidir'],
 modelEn:"Wayne draws three alerts from Joshua 9. First, be alert to attacks after victory: the Gibeonites come not after a defeat but right after Jericho and Ai, for Satan waits for the camp to relax. Second, be alert to being deceived: Jesus said be wise as serpents and harmless as doves, both at once. Third, be alert to pray first: James 1:5 says ask God for wisdom and He gives liberally. The single protection from both sin and deception is the same, to ask the LORD and pray before you decide, not after you have signed.", modelEs:"Wayne saca tres alertas de Josué 9. Primero, está alerta a los ataques después de la victoria: los gabaonitas llegan no tras una derrota sino justo después de Jericó y Hai, pues Satanás espera a que el campamento se relaje. Segundo, está alerta al engaño: Jesús dijo ser prudentes como serpientes y sencillos como palomas, ambas a la vez. Tercero, está alerta a orar primero: Santiago 1:5 dice pedir a Dios sabiduría y Él la da abundantemente. La única protección del pecado y del engaño es la misma, preguntar a Jehová y orar antes de decidir, no después de firmar."},
{q_en:"Summarize the hog-killing-day illustration and its lesson about indifference.",q_es:"Resume la ilustración de la matanza de cerdos y su lección.",
 kw_en:['hog','slaughter','eat','indifferent','deceiv','perish','get','sin'], kw_es:['cerdo','matanza','comer','indifer','engañ','perec','librar','pecado'],
 modelEn:"Wayne recalls hog-killing day from boyhood: the men would slaughter one hog after another, yet the remaining hogs kept eating as if nothing had happened, utterly indifferent to the death right beside them. He asks, we understand it in unintelligent animals, but what about human beings? Tidwell sharpens the warning: you watch others perish in sin by the thousands, yet you plunge on saying I will get by. Be not deceived, you cannot do wrong and get by. The Gibeonite treaty is that same blind leap, signed by a camp too comfortable to suspect a thing.", modelEs:"Wayne recuerda el día de matanza de cerdos de su niñez: los hombres sacrificaban un cerdo tras otro, pero los cerdos restantes seguían comiendo como si nada, totalmente indiferentes a la muerte junto a ellos. Pregunta: lo entendemos en animales no inteligentes, ¿pero qué de los seres humanos? Tidwell afila la advertencia: ves a otros perecer en pecado por miles, y sigues lanzándote diciendo yo me la libraré. No te engañes, no puedes hacer lo malo y librarte. El tratado gabaonita es ese mismo salto ciego, firmado por un campamento demasiado cómodo."},
{q_en:"Describe the Gibeonites' disguise and how it succeeded.",q_es:"Describe el disfraz gabaonita y cómo tuvo éxito.",
 kw_en:['moldy','worn','sack','sandal','bread','disguise','distant','treaty'], kw_es:['mohoso','gastad','costal','sandal','pan','disfraz','lejan','tratado'],
 modelEn:"The Gibeonite disguise is theatrical genius. Knowing Israel could make peace only with a far country, they manufacture distance: worn-out sacks, patched sandals, cracked wineskins, and bread left to crumble into moldy crusts. They load the donkeys, walk out and back until they look travel-worn, and arrive at Gilgal claiming, from a very far country your servants have come. They flatter the LORD and name His acts in Egypt and against Sihon and Og, but never mention Jericho or Ai, which would expose them as local. The disguise works, and Joshua signs the treaty.", modelEs:"El disfraz gabaonita es un genio teatral. Sabiendo que Israel solo podía hacer paz con una tierra lejana, fabrican distancia: costales gastados, sandalias remendadas, odres rajados, y pan dejado hasta volverse mohoso. Cargan los asnos, caminan ida y vuelta hasta parecer gastados por el viaje, y llegan a Gilgal diciendo: de tierra muy lejana han venido tus siervos. Adulan a Jehová y nombran Sus actos en Egipto y contra Sehón y Og, pero nunca mencionan Jericó ni Hai, lo que los delataría como locales. El disfraz funciona, y Josué firma el tratado."},
{q_en:"Explain Joshua 9:14's significance and the divinely-provided mechanism Joshua could have used.",q_es:"Explica el significado de Josué 9:14 y el mecanismo divinamente provisto que Josué pudo haber usado.",
 kw_en:['urim','thummim','priest','breastpiece','counsel','ask','discern','prayer'], kw_es:['urim','tumim','sacerdote','pectoral','consejo','pregunt','discern','oración'],
 modelEn:"Joshua 9:14 is the saddest line in the chapter: the men of Israel took some of their provisions, but they did not ask counsel of the LORD. They examined the bread, tasted the wine, inspected the sandals, competent at evidence but lacking discernment. What sharpens the failure is that God had provided a direct way to ask: the Urim and Thummim in the breastpiece of the high priest, which gave a clear yes-or-no answer. Eleazar the priest was right there. Joshua simply did not use it; he trusted the moldy bread instead of the prayer he skipped.", modelEs:"Josué 9:14 es la línea más triste del capítulo: los hombres de Israel tomaron de las provisiones, pero no pidieron consejo a Jehová. Examinaron el pan, probaron el vino, inspeccionaron las sandalias, competentes con la evidencia pero sin discernimiento. Lo que afila la falla es que Dios había provisto una manera directa de preguntar: el Urim y el Tumim en el pectoral del sumo sacerdote, que daba una respuesta clara de sí o no. Eleazar el sacerdote estaba allí. Josué simplemente no lo usó; confió en el pan mohoso en lugar de la oración que se saltó."},
{q_en:"Identify the parallel between Rahab and the Gibeonites.",q_es:"Identifica el paralelo entre Rahab y los gabaonitas.",
 kw_en:['rahab','lied','faith','gibeon','spared','oath','grace','canaanite'], kw_es:['rahab','menti','fe','gabaon','perdona','juramento','gracia','canane'],
 modelEn:"Both Rahab and the Gibeonites were Canaanites who used deception and were spared, but the difference is instructive. Rahab lied out of faith; she believed the LORD was God and risked her life on it, and she was spared and honored. The Gibeonites lied out of fear and self-preservation, yet because Israel had sworn an oath in the LORD's name, they too were spared. Grace reached past the deception in both cases, drawing outsiders into Israel; but Rahab's lie sprang from faith, while the Gibeonites' sprang only from dread.", modelEs:"Tanto Rahab como los gabaonitas eran cananeos que usaron engaño y fueron perdonados, pero la diferencia es instructiva. Rahab mintió por fe; creyó que Jehová era Dios y arriesgó su vida en ello, y fue perdonada y honrada. Los gabaonitas mintieron por miedo y autopreservación, pero porque Israel había hecho un juramento en el nombre de Jehová, también fueron perdonados. La gracia alcanzó más allá del engaño en ambos casos, atrayendo a forasteros a Israel; pero la mentira de Rahab brotó de la fe, mientras la de los gabaonitas brotó solo del terror."},
{q_en:"Describe how God turned the Gibeonites from deceivers into honored servants.",q_es:"Describe cómo Dios convirtió a los gabaonitas en siervos honrados.",
 kw_en:['hewer','water','tabernacle','honor','servant','wood','house','redemption'], kw_es:['leñador','agua','tabernáculo','honra','siervo','leña','casa','redención'],
 modelEn:"The redemption arc is surprising. Joshua does not destroy the Gibeonites, but neither does he simply release them; he makes them hewers of wood and drawers of water for the house of God. What began as liars at the gate ends as honored servants at the tabernacle, carrying wood and water for the altar of the LORD. Like Rahab the harlot, deceivers from a doomed people are drawn in and given a place of service in God's own house. Grace turns the curse of servitude into the honor of nearness to the altar.", modelEs:"El arco de redención es sorprendente. Josué no destruye a los gabaonitas, pero tampoco simplemente los suelta; los hace leñadores y aguadores para la casa de Dios. Lo que comenzó como mentirosos a la puerta termina como siervos honrados en el tabernáculo, llevando leña y agua para el altar de Jehová. Como Rahab la ramera, engañadores de un pueblo condenado son atraídos y reciben un lugar de servicio en la casa misma de Dios. La gracia convierte la maldición de la servidumbre en el honor de la cercanía al altar."},
{q_en:"Tell the Jaime Guerrero story and what it teaches about God's use of imperfect beginnings.",q_es:"Cuenta la historia de Jaime Guerrero y lo que enseña sobre los inicios imperfectos.",
 kw_en:['jaime','prison','prayer','held','mexican','pray','mean','guerrero'], kw_es:['jaime','prisión','oración','sostuv','mexican','orar','serio','guerrero'],
 modelEn:"The closing returns to a Mexican prison cell where a con man named Jaime Guerrero prayed a prayer he did not even mean. To his own surprise, the Lord held him to it, taking the empty words of a manipulator and making them real. The same God who would not let Israel break a careless oath would not let Jaime escape a careless prayer; both discovered that the LORD takes His own name seriously, even when we do not. Grace can hold a man to a prayer he never intended to keep.", modelEs:"El cierre vuelve a una celda de prisión mexicana donde un estafador llamado Jaime Guerrero oró una oración que ni siquiera decía en serio. Para su propia sorpresa, el Señor lo sostuvo a ella, tomando las palabras vacías de un manipulador y haciéndolas reales. El mismo Dios que no dejó a Israel romper un juramento descuidado no dejó a Jaime escapar de una oración descuidada; ambos descubrieron que Jehová toma Su propio nombre en serio, aun cuando nosotros no. La gracia puede sostener a un hombre a una oración que nunca pensó cumplir."},
{q_en:"Summarize the events of Joshua 10:1-11 leading to the long day.",q_es:"Resume los eventos de Josué 10:1-11 que llevan al día largo.",
 kw_en:['five','kings','gibeon','hailstone','beth','coalition','defend','heaven'], kw_es:['cinco','reyes','gabaón','granizo','bet','coalición','defend','cielo'],
 modelEn:"When the five kings of the south, a coalition led by Jerusalem, heard that Gibeon had made peace with Israel, they marched against Gibeon to punish it. The Gibeonites sent to Joshua, who marched all night to defend his new ally. The LORD threw the coalition into panic, and as they fled down the descent of Beth-horon He cast great hailstones from heaven on them; more died from the hailstones than from the sword. God fought for Israel and for the people Israel had sworn to protect, even though the treaty had been made by deception.", modelEs:"Cuando los cinco reyes del sur, una coalición liderada por Jerusalén, oyeron que Gabaón había hecho paz con Israel, marcharon contra Gabaón para castigarla. Los gabaonitas enviaron a Josué, quien marchó toda la noche para defender a su nuevo aliado. Jehová sembró pánico en la coalición, y mientras huían por la bajada de Bet-horón Él lanzó grandes piedras de granizo desde el cielo sobre ellos; más murieron por el granizo que por la espada. Dios peleó por Israel y por el pueblo que Israel había jurado proteger, aunque el tratado se hizo por engaño."},
{q_en:"Explain what was unique about the long day in Joshua 10:12-14.",q_es:"Explica qué fue único del día largo en Josué 10:12-14.",
 kw_en:['sun','stand','still','gibeon','day','moon','long','voice'], kw_es:['sol','deten','quieto','gabaón','día','luna','largo','voz'],
 modelEn:"On the longest day in history, Joshua, needing more daylight to finish the victory, cried out before Israel: Sun, stand still upon Gibeon, and Moon, in the Valley of Aijalon. And the sun stood still and the moon stayed until the nation took vengeance on its enemies, about a whole day. The text marvels that there was no day like it before or since, when the LORD heeded the voice of a man. The God who hung the sun was willing to hold it in the sky because one man, fighting God's battle, asked Him to.", modelEs:"En el día más largo de la historia, Josué, necesitando más luz para terminar la victoria, clamó ante Israel: Sol, detente en Gabaón; y tú, Luna, en el valle de Ajalón. Y el sol quedó quieto y la luna se detuvo hasta que la nación se vengó de sus enemigos, casi un día entero. El texto se maravilla de que no hubo día como aquel ni antes ni después, cuando Jehová obedeció la voz de un hombre. El Dios que colgó el sol estuvo dispuesto a sostenerlo en el cielo porque un hombre, peleando la batalla de Dios, se lo pidió."},
{q_en:"Identify the meaning of \\\"feet on the necks\\\" and how it ties to Joshua 1:9.",q_es:"Identifica «pies sobre los cuellos» y el lazo con Josué 1:9.",
 kw_en:['feet','necks','fear','dismayed','courage','strong','fought','kings'], kw_es:['pies','cuello','temor','desmay','valient','esforz','pelea','reyes'],
 modelEn:"After the victory Joshua had the five kings brought out and told his captains to put their feet on the kings' necks, saying, Do not fear nor be dismayed; be strong and of good courage, for thus the LORD will do to all your enemies. The foot on the neck was a sign that the enemy was wholly defeated. The whole southern campaign closes with the sentence that threads the book: the LORD God of Israel fought for Israel. The courage was never in Israel's strength but in the God who fought their battles.", modelEs:"Tras la victoria Josué hizo sacar a los cinco reyes y dijo a sus capitanes que pusieran los pies sobre los cuellos de los reyes, diciendo: No temáis ni desmayéis; esforzaos y sed valientes, porque así hará Jehová a todos vuestros enemigos. El pie sobre el cuello era señal de que el enemigo estaba del todo vencido. Toda la campaña del sur cierra con la frase que une el libro: Jehová el Dios de Israel peleaba por Israel. El valor nunca estuvo en la fuerza de Israel sino en el Dios que peleaba sus batallas."}
];

let mcAnswers = new Array(20).fill(null);
let kwAnswers = new Array(10).fill('');
try{const st=JSON.parse(localStorage.getItem(STATE_KEY)||'{}');if(Array.isArray(st.mcAnswers)&&st.mcAnswers.length===20)mcAnswers=st.mcAnswers;if(Array.isArray(st.kwAnswers)&&st.kwAnswers.length===10)kwAnswers=st.kwAnswers;}catch(e){}
function saveState(){try{localStorage.setItem(STATE_KEY,JSON.stringify({mcAnswers,kwAnswers}));}catch(e){}}

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
