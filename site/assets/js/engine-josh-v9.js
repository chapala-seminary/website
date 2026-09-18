/* Exam engine for CTSJosh (shared by 1 unit page).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/josh/unitN.js. */
// CTS Joshua — Unit 9: Cities of Refuge & Altar of Witness (Joshua 20-22). Retrofit 2026-05-16.
// MC L3 audit (Wayne-approved 14 swaps): MC3,4,7,8,9,10,11,12,13,16,17,18,19,20.
// KEY A=B=C=D=5 | split kw_en/kw_es | track gating | MC-persist
(function(){
'use strict';

const UNIT = 9;
const COURSE = 'josh';
const NEXT_UNIT_URL = 'CTSJoshUnit10.html';
const PREV_UNIT_URL = 'CTSJoshUnit8.html';

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
{q_en:"What is a city of refuge?",q_es:"¿Qué es una ciudad de refugio?",options:{A:{en:"A safe place where the unintentional manslayer could flee from the avenger of blood",es:"Un lugar seguro adonde el matador involuntario podía huir del vengador de sangre"},B:{en:"A walled fortress for army officers",es:"Una fortaleza amurallada para oficiales del ejército"},C:{en:"A storehouse for tribal grain reserves",es:"Un almacén de reservas de grano tribales"},D:{en:"A treaty-zone with foreign nations",es:"Una zona de tratado con naciones extranjeras"}}},
{q_en:"Whose pastoral story does Wayne use as the modern parallel to a city of refuge?",q_es:"¿Qué historia pastoral usa Wayne como paralelo moderno a una ciudad de refugio?",options:{A:{en:"A young farmer's accidental death",es:"La muerte accidental de un joven granjero"},B:{en:"A missionary kidnapping in Africa",es:"Un secuestro misionero en África"},C:{en:"Karen, an abused woman who fled to a safe-house four hours away with her daughters",es:"Karen, una mujer abusada que huyó a una casa de refugio a cuatro horas con sus hijas"},D:{en:"A church-camp accident",es:"Un accidente en un campamento eclesiástico"}}},
{q_en:"What three OT passages give the full law-background of the cities of refuge?",q_es:"¿Qué tres pasajes del AT dan el trasfondo legal completo de las ciudades de refugio?",options:{A:{en:"Genesis 9; Exodus 12; Leviticus 16",es:"Génesis 9; Éxodo 12; Levítico 16"},B:{en:"Exodus 21, Numbers 35, and Deuteronomy 19",es:"Éxodo 21, Números 35, y Deuteronomio 19"},C:{en:"Leviticus 17; Numbers 19; Deuteronomy 24",es:"Levítico 17; Números 19; Deuteronomio 24"},D:{en:"Genesis 12; Exodus 20; Leviticus 25",es:"Génesis 12; Éxodo 20; Levítico 25"}}},
{q_en:"Who was the avenger of blood in ancient Israel?",q_es:"¿Quién era el vengador de sangre en el Israel antiguo?",options:{A:{en:"A priest assigned by the high priest",es:"Un sacerdote asignado por el sumo sacerdote"},B:{en:"A judge of the local Sanhedrin",es:"Un juez del sanedrín local"},C:{en:"A family member closest to the victim, charged with avenging the death",es:"El familiar más cercano de la víctima, encargado de vengar la muerte"},D:{en:"An appointed king's messenger",es:"Un mensajero designado del rey"}}},
{q_en:"How many cities of refuge were appointed in Joshua 20?",q_es:"¿Cuántas ciudades de refugio fueron señaladas en Josué 20?",options:{A:{en:"Four",es:"Cuatro"},B:{en:"Six (three on each side of the Jordan)",es:"Seis (tres a cada lado del Jordán)"},C:{en:"Twelve",es:"Doce"},D:{en:"Three only, west of the Jordan",es:"Sólo tres, al occidente del Jordán"}}},
{q_en:"Which three cities west of the Jordan were appointed?",q_es:"¿Qué tres ciudades al occidente del Jordán fueron señaladas?",options:{A:{en:"Bethel, Bethlehem, and Jericho",es:"Betel, Belén, y Jericó"},B:{en:"Kedesh in Galilee, Shechem in mount Ephraim, Hebron in Judah",es:"Cedes en Galilea, Siquem en el monte de Efraín, Hebrón en Judá"},C:{en:"Shiloh, Gilgal, and Gibeon",es:"Silo, Gilgal, y Gabaón"},D:{en:"Joppa, Acco, and Jericho",es:"Jope, Aco, y Jericó"}}},
{q_en:"Which three cities east of the Jordan were appointed?",q_es:"¿Qué tres ciudades al oriente del Jordán fueron señaladas?",options:{A:{en:"Mahanaim, Jabesh-gilead, and Penuel",es:"Mahanaim, Jabes-galaad, y Peniel"},B:{en:"Bezer in the wilderness, Ramoth in Gilead, Golan in Bashan",es:"Beser en el desierto, Ramot en Galaad, Golán en Basán"},C:{en:"Heshbon, Edrei, and Aroer",es:"Hesbón, Edrei, y Aroer"},D:{en:"Sidon, Tyre, and Damascus",es:"Sidón, Tiro, y Damasco"}}},
{q_en:"For whom were the cities of refuge appointed (Joshua 20:9)?",q_es:"¿Para quiénes fueron señaladas las ciudades de refugio (Josué 20:9)?",options:{A:{en:"Children of Israel AND the stranger that sojourns among them",es:"Los hijos de Israel Y el extranjero que mora entre ellos"},B:{en:"Israelites only",es:"Sólo israelitas"},C:{en:"Priests only",es:"Sólo sacerdotes"},D:{en:"Levites and their families only",es:"Sólo los levitas y sus familias"}}},
{q_en:"What rabbinic tradition does Wayne cite about the roads to the cities of refuge?",q_es:"¿Qué tradición rabínica cita Wayne sobre los caminos a las ciudades?",options:{A:{en:"They were lit with torches each night",es:"Se iluminaban con antorchas cada noche"},B:{en:"They were closed during festivals",es:"Se cerraban durante las fiestas"},C:{en:"They could only be traveled at night",es:"Sólo podían recorrerse de noche"},D:{en:"They were repaired and cleared yearly with REFUGE signs at every crossroads",es:"Se reparaban y limpiaban cada año con letreros de REFUGIO en cada cruce"}}},
{q_en:"Why did the gates of the cities of refuge stay open day and night?",q_es:"¿Por qué las puertas de las ciudades permanecían abiertas día y noche?",options:{A:{en:"For trade purposes",es:"Por propósitos comerciales"},B:{en:"To collect taxes from travelers",es:"Para cobrar impuestos a los viajeros"},C:{en:"To welcome foreign dignitaries",es:"Para recibir dignatarios extranjeros"},D:{en:"So the runner would not be cut down by the avenger right outside a locked gate",es:"Para que el corredor no fuera cortado por el vengador justo afuera de una puerta cerrada"}}},
{q_en:"Which hymn does Wayne attach to the cities of refuge through the Wesley story?",q_es:"¿Qué himno vincula Wayne a las ciudades de refugio mediante la historia de Wesley?",options:{A:{en:"\"Amazing Grace\"",es:"«Sublime Gracia»"},B:{en:"\"Rock of Ages\"",es:"«Roca de la Eternidad»"},C:{en:"\"Jesus, Lover of My Soul\"",es:"«Jesús, Amante de mi Alma»"},D:{en:"\"Just as I Am\"",es:"«Tal Como Soy»"}}},
{q_en:"What inspired John Wesley to write \"Jesus, Lover of My Soul\"?",q_es:"¿Qué inspiró a John Wesley a escribir «Jesús, Amante de mi Alma»?",options:{A:{en:"A bird that fled into his bosom from a hawk through an open window",es:"Un pájaro que huyó a su seno de un halcón por una ventana abierta"},B:{en:"A vision during prayer",es:"Una visión durante la oración"},C:{en:"A sermon by his brother Charles",es:"Un sermón de su hermano Carlos"},D:{en:"A letter from George Whitefield",es:"Una carta de George Whitefield"}}},
{q_en:"In Wayne's Civil War story, what saved the Confederate soldier from the Union ambush?",q_es:"En la historia de la Guerra Civil, ¿qué salvó al soldado confederado de la emboscada?",options:{A:{en:"He sang \"Jesus, Lover of My Soul\" softly and the Union officer ordered his men not to shoot",es:"Cantó «Jesús, Amante de mi Alma» y el oficial de la Unión ordenó a sus hombres no disparar"},B:{en:"A signal flare",es:"Una bengala"},C:{en:"A scout's warning",es:"La advertencia de un explorador"},D:{en:"Sudden fog",es:"Niebla súbita"}}},
{q_en:"Whose London-waif story closes Wayne's third feature with the words \"In His name\"?",q_es:"¿De quién es la historia del niño londinense con las palabras «En Su nombre»?",options:{A:{en:"A. B. Simpson",es:"A. B. Simpson"},B:{en:"D. L. Moody",es:"D. L. Moody"},C:{en:"Charles Spurgeon",es:"Charles Spurgeon"},D:{en:"Hudson Taylor",es:"Hudson Taylor"}}},
{q_en:"What released the slayer to return home from the city of refuge?",q_es:"¿Qué liberaba al matador para regresar a casa de la ciudad de refugio?",options:{A:{en:"A letter from the king",es:"Una carta del rey"},B:{en:"The death of the high priest who was serving when his case was decided",es:"La muerte del sumo sacerdote que servía cuando se decidió su caso"},C:{en:"Payment of a ransom",es:"El pago de un rescate"},D:{en:"The seventh year",es:"El séptimo año"}}},
{q_en:"What NT verse uses the language of \"fled for refuge\"?",q_es:"¿Qué versículo del NT usa el lenguaje «hemos buscado refugio»?",options:{A:{en:"1 Peter 2:9",es:"1 Pedro 2:9"},B:{en:"Romans 5:8",es:"Romanos 5:8"},C:{en:"Hebrews 6:18",es:"Hebreos 6:18"},D:{en:"John 14:6",es:"Juan 14:6"}}},
{q_en:"What lesson did Mr. ten Boom teach Corrie about strength to suffer?",q_es:"¿Qué lección le enseñó el Sr. ten Boom a Corrie sobre la fuerza para sufrir?",options:{A:{en:"Pray for it three weeks early",es:"Órala con tres semanas de anticipación"},B:{en:"You will need it tomorrow if you train today",es:"La necesitarás mañana si entrenas hoy"},C:{en:"You are strong because of your family name",es:"Eres fuerte por el nombre de tu familia"},D:{en:"God supplies the strength just in time, like the train ticket money he gave her just before they boarded",es:"Dios suple la fuerza justo a tiempo, como el dinero del boleto que le daba justo antes de subir al tren"}}},
{q_en:"What is the great summary statement at the end of Joshua 21 (vv. 43-45)?",q_es:"¿Cuál es la gran declaración resumen al final de Josué 21 (vv. 43-45)?",options:{A:{en:"\"Be strong and of good courage\"",es:"«Esfuérzate y sé valiente»"},B:{en:"\"Choose you this day whom ye will serve\"",es:"«Escogeos hoy a quién sirváis»"},C:{en:"\"By faith Joshua took the land\"",es:"«Por la fe Josué tomó la tierra»"},D:{en:"\"There failed not ought of any good thing which the LORD had spoken\"",es:"«No faltó palabra de todas las buenas promesas que Jehová había hecho»"}}},
{q_en:"What did Reuben, Gad, and the half-tribe of Manasseh build on their way home (Joshua 22)?",q_es:"¿Qué construyeron Rubén, Gad, y la media tribu de Manasés en su camino a casa (Josué 22)?",options:{A:{en:"A border-fort against Moab",es:"Una fortaleza fronteriza contra Moab"},B:{en:"A new tabernacle east of the Jordan",es:"Un nuevo tabernáculo al oriente del Jordán"},C:{en:"A great altar, which they named \"Ed\" (Witness)",es:"Un gran altar, al que llamaron «Ed» (Testimonio)"},D:{en:"A city of refuge of their own",es:"Una ciudad de refugio propia"}}},
{q_en:"Who was sent to investigate the altar before Israel went to war?",q_es:"¿Quién fue enviado a investigar el altar antes de que Israel fuera a la guerra?",options:{A:{en:"Caleb",es:"Caleb"},B:{en:"Joshua himself",es:"Josué mismo"},C:{en:"The elders of Ephraim alone",es:"Los ancianos de Efraín solos"},D:{en:"Phinehas the priest, son of Eleazar, with a delegation",es:"Finees el sacerdote, hijo de Eleazar, con una delegación"}}}
];
const KEY=['A','C','B','C','B','B','B','A','D','D','C','A','A','A','B','C','D','D','C','D'];

const KW=[
{q_en:"Tell Karen's story and how it parallels a city of refuge.",q_es:"Cuenta la historia de Karen y su paralelo con una ciudad de refugio.",
 kw_en:['karen','safe','abusiv','refuge','husband','fled','identity','daughter'], kw_es:['karen','segur','abusiv','refugio','esposo','huido','identidad','hijas'],
 modelEn:"Wayne tells of Karen, a woman from his pastoral years in Cochrane. She came to church but kept to herself, with several daughters. Her husband had been abusive; her restraining order had done no good, and she was very afraid. She had fled with her girls to a safe house four hours away, which helped her build a new life with a new identity and a new name. Her safe house was a city of refuge in real life: a place to run when there is trouble. Karen knew what a city of refuge felt like before anyone could explain Joshua 20 to her.", modelEs:"Wayne cuenta de Karen, una mujer de sus años pastorales en Cochrane. Venía a la iglesia pero se mantenía aparte, con varias hijas. Su esposo había sido abusivo; su orden de restricción no había servido de nada, y estaba muy asustada. Había huido con sus niñas a una casa de refugio a cuatro horas, que le ayudó a construir una nueva vida con una nueva identidad y un nombre nuevo. Su casa segura era una ciudad de refugio en la vida real: un lugar adonde correr cuando hay problemas. Karen sabía lo que se sentía una ciudad de refugio antes de que nadie pudiera explicarle Josué 20."},
{q_en:"Explain the difference between premeditated murder and manslaughter in the law.",q_es:"Explica la diferencia entre asesinato premeditado y homicidio involuntario.",
 kw_en:['premeditated','murder','manslaughter','accident','avenger','blood','intent','flee'], kw_es:['premeditad','asesin','homicid','accidente','vengad','sangre','intenci','huir'],
 modelEn:"The law distinguished premeditated murder from what we call manslaughter. A man guilty of intentional, premeditated murder faced capital punishment with no asylum; the avenger of blood would carry it out. But if a death was an accident, unintentional, the slayer could flee to a city of refuge and be safe until a hearing. Moses' examples are ordinary: an ax head flies off the handle and kills a neighbor; a man falls and hits his head. Nobody is innocent, someone is dead, but it is not murder. The avenger of blood, the kinsman closest to the victim, might act in grief or fury, so God gave the cities to protect the difference between intent and accident.", modelEs:"La ley distinguía el asesinato premeditado de lo que llamamos homicidio involuntario. Un hombre culpable de asesinato intencional y premeditado enfrentaba pena capital sin asilo; el vengador de sangre lo ejecutaba. Pero si una muerte era un accidente, sin intención, el homicida podía huir a una ciudad de refugio y estar a salvo hasta una audiencia. Los ejemplos de Moisés son comunes: la cabeza del hacha se sale del mango y mata al vecino; un hombre cae y se golpea la cabeza. Nadie es inocente, alguien murió, pero no es asesinato. El vengador de sangre, el pariente más cercano a la víctima, podía actuar con furia, así que Dios dio las ciudades para proteger la diferencia entre intención y accidente."},
{q_en:"Identify the six cities of refuge by name.",q_es:"Identifica las seis ciudades de refugio por nombre.",
 kw_en:['kedesh','shechem','hebron','bezer','ramoth','golan','six','refuge'], kw_es:['cedes','siquem','hebrón','beser','ramot','golán','seis','refugio'],
 modelEn:"Joshua 20:7-9 names the six cities of refuge, three on each side of the Jordan. West of the Jordan: Kedesh in Galilee in mount Naphtali, Shechem in mount Ephraim, and Kirjath-arba, which is Hebron, in the mountain of Judah. East of the Jordan, by Jericho: Bezer in the wilderness from the tribe of Reuben, Ramoth in Gilead from the tribe of Gad, and Golan in Bashan from the tribe of Manasseh. Six cities, evenly spread, so that no slayer in Israel was ever more than a hard day's run from refuge.", modelEs:"Josué 20:7-9 nombra las seis ciudades de refugio, tres a cada lado del Jordán. Al occidente del Jordán: Cedes en Galilea en el monte de Neftalí, Siquem en el monte de Efraín, y Quiriat-arba, que es Hebrón, en el monte de Judá. Al oriente del Jordán, junto a Jericó: Beser en el desierto de la tribu de Rubén, Ramot en Galaad de la tribu de Gad, y Golán en Basán de la tribu de Manasés. Seis ciudades, repartidas uniformemente, para que ningún homicida en Israel estuviera a más de un día duro de carrera del refugio."},
{q_en:"Describe Wayne's first feature: the cities were close by.",q_es:"Describe la primera característica de Wayne: las ciudades estaban cerca.",
 kw_en:['close','near','maryland','day','run','roads','refuge','reach'], kw_es:['cerca','maryland','día','carrera','caminos','refugio','alcance','lejos'],
 modelEn:"Wayne's first feature is that the cities of refuge were close. The land of Israel is only about the size of the state of Maryland, so no one could ever be very far from a refuge. The six cities were spread so that no slayer was more than a hard day's run away, always within reach. The rabbis preserved a tradition that once a year the roads leading to the cities were carefully repaired and kept clear, with the way marked, so a fleeing man would never be slowed. Salvation in Christ is likewise near, never far to run.", modelEs:"La primera característica de Wayne es que las ciudades de refugio estaban cerca. La tierra de Israel es apenas del tamaño del estado de Maryland, así que nadie podía estar muy lejos de un refugio. Las seis ciudades estaban repartidas para que ningún homicida estuviera a más de un día duro de carrera, siempre al alcance. Los rabinos preservaron una tradición de que una vez al año los caminos a las ciudades se reparaban con cuidado y se mantenían limpios, con el camino señalado, para que el que huía nunca se retrasara. La salvación en Cristo está igualmente cerca, nunca lejos para correr."},
{q_en:"Tell the story of John Wesley and the bird that inspired \\\"Jesus, Lover of My Soul.\\\"",q_es:"Cuenta la historia de John Wesley y el pájaro que inspiró «Jesús, Amante de mi Alma».",
 kw_en:['wesley','bird','hawk','bosom','window','refuge','hymn','fly'], kw_es:['wesley','pájaro','halcón','seno','ventana','refugio','himno','persegu'],
 modelEn:"Wesley's hymn-bird: a little bird flitting in the sunshine caught a man's attention when a hawk came swooping down. Terrified, the bird could find no hiding place in the air, the trees, or the fields. Then, seeing an open window and a man sitting by it, the bird flew straight into his bosom for refuge, and was safe. The picture gave us the hymn: Jesus, Lover of my soul, let me to Thy bosom fly, other refuge have I none. Like that bird from the hawk, the sinner flees to the bosom of Christ, the only refuge.", modelEs:"El pájaro-himno de Wesley: un pajarito que revoloteaba al sol llamó la atención de un hombre cuando un halcón cayó en picada. Aterrado, el pájaro no hallaba escondite en el aire, los árboles ni los campos. Entonces, viendo una ventana abierta y a un hombre sentado junto a ella, voló directo a su seno por refugio, y quedó a salvo. La imagen nos dio el himno: Jesús, amante de mi alma, déjame a Tu seno volar, otro refugio no tengo. Como ese pájaro perseguido por el halcón, el pecador huye al seno de Cristo, el único refugio."},
{q_en:"Explain why there was no other place of guaranteed safety for the slayer.",q_es:"Explica por qué no había otro lugar de seguridad garantizada.",
 kw_en:['other','refuge','none','safet','city','outside','christ','hebrews'], kw_es:['otro','refugio','ningun','segurid','ciudad','fuera','cristo','hebreos'],
 modelEn:"There was no other place of guaranteed safety for the slayer. Outside the city of refuge, the avenger of blood could still strike him down; the city alone gave singular, guaranteed safety. This is the fourth feature: no other refuge. The hymn captures it, other refuge have I none. Hebrews 6:18 carries the picture into the gospel: we have fled for refuge to lay hold of the hope set before us, the bosom of Christ. As the slayer had only the city, the sinner has only Christ. There is no other name, no other refuge.", modelEs:"No había otro lugar de seguridad garantizada para el homicida. Fuera de la ciudad de refugio, el vengador de sangre aún podía derribarlo; solo la ciudad daba seguridad única y garantizada. Esta es la cuarta característica: ningún otro refugio. El himno lo capta: otro refugio no tengo. Hebreos 6:18 lleva la imagen al evangelio: hemos huido buscando refugio para asirnos de la esperanza puesta delante, el seno de Cristo. Como el homicida solo tenía la ciudad, el pecador solo tiene a Cristo. No hay otro nombre, ningún otro refugio."},
{q_en:"Tell Corrie ten Boom's train-ticket lesson from her father.",q_es:"Cuenta la lección del boleto de tren del padre de Corrie ten Boom.",
 kw_en:['corrie','train','ticket','strength','father','time','martyr','need'], kw_es:['corrie','tren','boleto','fuerza','padre','tiempo','mártir','necesit'],
 modelEn:"Corrie ten Boom, who hid Jews from the Nazis and survived prison, worried as a little girl that she would never be strong enough to be a martyr for Jesus. Her wise father asked when he gave her the money for a train trip, three weeks before? No, she answered, just before you get on the train. He said our wise Father in heaven is the same: today you do not need the strength to be a martyr, but as soon as you are called on for it, the strength comes. Like the train ticket, God gives the grace just in time, not before we need it.", modelEs:"Corrie ten Boom, que escondió judíos de los nazis y sobrevivió la prisión, de niña temía no ser nunca lo bastante fuerte para ser mártir por Jesús. Su sabio padre le preguntó cuándo le daba el dinero para un viaje en tren, ¿tres semanas antes? No, respondió ella, justo antes de subir al tren. Él dijo que nuestro sabio Padre celestial es igual: hoy no necesitas la fuerza para ser mártir, pero en cuanto se te pida, la fuerza viene. Como el boleto del tren, Dios da la gracia justo a tiempo, no antes de que la necesitemos."},
{q_en:"Explain the role of the high priest's death in releasing the slayer.",q_es:"Explica el papel de la muerte del sumo sacerdote en la liberación del matador.",
 kw_en:['priest','death','slayer','free','release','cover','christ','home'], kw_es:['sacerdote','muerte','homicida','libre','liberac','cubri','cristo','casa'],
 modelEn:"The fifth feature is the high priest's death as the release. The slayer had to remain in the city of refuge until the high priest who was serving died; when the high priest died, the slayer was free to go home, and the avenger of blood could no longer touch him. Why? Because the high priest's death was understood to cover the unintentional bloodshed, a life was owed for the life taken, and the high priest, the people's representative before God, paid that debt symbolically. It points to Christ: our great High Priest, whose death releases the guilty and sends them home free.", modelEs:"La quinta característica es la muerte del sumo sacerdote como liberación. El homicida debía permanecer en la ciudad de refugio hasta que muriera el sumo sacerdote en funciones; cuando el sumo sacerdote moría, el homicida quedaba libre para ir a casa, y el vengador de sangre ya no podía tocarlo. ¿Por qué? Porque la muerte del sumo sacerdote se entendía como algo que cubrió el derramamiento involuntario de sangre, una vida se debía por la vida quitada, y el sumo sacerdote, representante del pueblo ante Dios, pagó esa deuda simbólicamente. Apunta a Cristo: nuestro gran Sumo Sacerdote, cuya muerte libera al culpable y lo envía a casa libre."},
{q_en:"Summarize Joshua 21:43-45 and what it teaches about God's faithfulness.",q_es:"Resume Josué 21:43-45 y lo que enseña sobre la fidelidad de Dios.",
 kw_en:['faithful','promise','failed','rest','gave','possess','word','good'], kw_es:['fiel','promesa','faltó','reposo','dio','posey','palabra','buena'],
 modelEn:"Joshua 21:43-45 is the summary of God's faithfulness. The LORD gave Israel all the land He had sworn; they possessed it and dwelt in it; the LORD gave them rest on every side; not a man of all their enemies stood before them. Then the climactic line: there failed not ought of any good thing which the LORD had spoken to the house of Israel; all came to pass. Every promise was kept, not one word fell to the ground. The passage teaches that God is utterly faithful: what He says, He gives; what He promises, He performs, down to the last word.", modelEs:"Josué 21:43-45 es el resumen de la fidelidad de Dios. Jehová dio a Israel toda la tierra que había jurado; la poseyeron y habitaron en ella; Jehová les dio reposo por todos lados; ningún hombre de sus enemigos se sostuvo delante de ellos. Luego la línea culminante: no faltó palabra de toda la buena promesa que Jehová había hecho a la casa de Israel; todo se cumplió. Cada promesa fue cumplida, ni una palabra cayó a tierra. El pasaje enseña que Dios es del todo fiel: lo que dice, lo da; lo que promete, lo hace, hasta la última palabra."},
{q_en:"Describe the altar of witness in Joshua 22 and what it teaches.",q_es:"Describe el altar del testimonio en Josué 22 y lo que enseña.",
 kw_en:['altar','witness','reuben','gad','phinehas','war','misunderstanding','investigate'], kw_es:['altar','testimonio','rubén','gad','finees','guerra','malentendido','investigar'],
 modelEn:"On their way home east of the Jordan, Reuben, Gad, and half-Manasseh built a great altar by the Jordan. To the western tribes it looked like rebellion or idolatry, Achan all over again at a regional scale, and the gathered army prepared for civil war. But first Phinehas the priest led a delegation across to investigate. The altar turned out not to be for sacrifice but a witness; they named it Ed, meaning witness, that they too served the LORD and shared the same God. The lesson: be quick to investigate and slow to attack; a misunderstanding nearly became a war over an altar that was actually a testimony.", modelEs:"De camino a casa al oriente del Jordán, Rubén, Gad y media Manasés edificaron un gran altar junto al Jordán. A las tribus occidentales les pareció rebelión o idolatría, Acán otra vez a escala regional, y el ejército reunido se preparó para una guerra civil. Pero primero Finees el sacerdote llevó una delegación a investigar. El altar resultó no ser para sacrificio sino un testimonio; lo llamaron Ed, que significa testimonio, de que ellos también servían a Jehová y compartían el mismo Dios. La lección: sé rápido para investigar y lento para atacar; un malentendido casi se volvió guerra por un altar que en realidad era un testimonio."}
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
