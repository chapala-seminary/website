/* Exam engine for CTSJosh (shared by 1 unit page).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/josh/unitN.js. */
// CTS Joshua — Unit 7: Northern Conquest & Kings Defeated (Joshua 11-12). Retrofit 2026-05-16.
// MC L3 verified (MC19 B/C swapped to fix violation) | KEY A=B=C=D=5 | split kw_en/kw_es
(function(){
'use strict';

const UNIT = 7;
const COURSE = 'josh';
const NEXT_UNIT_URL = 'CTSJoshUnit8.html';
const PREV_UNIT_URL = 'CTSJoshUnit6.html';

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
{q_en:"Who led the northern coalition against Israel (Joshua 11:1)?",q_es:"¿Quién lideró la coalición del norte contra Israel (Josué 11:1)?",options:{A:{en:"Adoni-Zedek of Jerusalem",es:"Adonisedec de Jerusalén"},B:{en:"Jabin king of Hazor",es:"Jabín rey de Hazor"},C:{en:"Sihon king of the Amorites",es:"Sehón rey de los amorreos"},D:{en:"Og king of Bashan",es:"Og rey de Basán"}}},
{q_en:"How does Joshua 11:4 describe the size of the northern army?",q_es:"¿Cómo describe Josué 11:4 el tamaño del ejército del norte?",options:{A:{en:"Like a swarm of locusts",es:"Como un enjambre de langostas"},B:{en:"Like the trees of the forest",es:"Como los árboles del bosque"},C:{en:"As the sand on the seashore in multitude",es:"Como la arena que está a la orilla del mar"},D:{en:"As a great cloud over the valley",es:"Como una gran nube sobre el valle"}}},
{q_en:"What distinctive military advantage did the northern coalition possess?",q_es:"¿Qué ventaja militar distintiva tenía la coalición del norte?",options:{A:{en:"Very many horses and chariots",es:"Muchísimos caballos y carros"},B:{en:"Long-range archers",es:"Arqueros de largo alcance"},C:{en:"Fortified mountain passes",es:"Pasos de montaña fortificados"},D:{en:"Trained war elephants",es:"Elefantes de guerra"}}},
{q_en:"Where did the northern coalition camp before the battle?",q_es:"¿Dónde acampó la coalición del norte antes de la batalla?",options:{A:{en:"The Waters of Merom",es:"Las aguas de Merom"},B:{en:"Plain of Jezreel",es:"Llanura de Jezreel"},C:{en:"Valley of Aijalon",es:"Valle de Ajalón"},D:{en:"Beth-horon descent",es:"Bajada de Bet-horón"}}},
{q_en:"What word from the LORD did Joshua receive before the Merom battle (11:6)?",q_es:"¿Qué palabra recibió Josué antes de la batalla de Merom (11:6)?",options:{A:{en:"\"Withdraw and wait for the rains\"",es:"«Retírate y espera las lluvias»"},B:{en:"\"Send messengers to Jabin first\"",es:"«Envía mensajeros primero a Jabín»"},C:{en:"\"Build siege ramps around their camp\"",es:"«Construye rampas de asedio»"},D:{en:"\"Be not afraid; tomorrow about this time I will deliver them up all slain\"",es:"«No tengas temor; mañana a esta hora yo entregaré a todos ellos muertos»"}}},
{q_en:"What did Joshua do to the northern army's horses and chariots (11:9)?",q_es:"¿Qué hizo Josué a los caballos y carros del ejército del norte (11:9)?",options:{A:{en:"Captured them for Israel's army",es:"Los capturó para el ejército de Israel"},B:{en:"Hamstrung the horses and burned the chariots",es:"Desjarretó los caballos y quemó los carros"},C:{en:"Sold them to Phoenician traders",es:"Los vendió a comerciantes fenicios"},D:{en:"Drove them into the sea",es:"Los echó al mar"}}},
{q_en:"Of all the cities of the north, which alone did Joshua burn with fire?",q_es:"De todas las ciudades del norte, ¿cuál sola quemó Josué con fuego?",options:{A:{en:"Hazor",es:"Hazor"},B:{en:"Madon",es:"Madón"},C:{en:"Achshaph",es:"Acsaf"},D:{en:"Shimron",es:"Simrón"}}},
{q_en:"Why was Hazor singled out for total destruction (11:10)?",q_es:"¿Por qué fue Hazor señalada para destrucción total (11:10)?",options:{A:{en:"Its king had personally insulted Joshua",es:"Su rey había insultado personalmente a Josué"},B:{en:"It \"beforetime was the head of all those kingdoms\"",es:"«Fue antes cabeza de todos estos reinos»"},C:{en:"It was the wealthiest city in Canaan",es:"Era la ciudad más rica de Canaán"},D:{en:"It harbored the high priest of Baal",es:"Albergaba al sumo sacerdote de Baal"}}},
{q_en:"How long does Joshua 11:18 say the northern campaign lasted?",q_es:"¿Cuánto duró la campaña del norte según Josué 11:18?",options:{A:{en:"A long time",es:"Mucho tiempo"},B:{en:"Forty days",es:"Cuarenta días"},C:{en:"One season",es:"Una sola temporada"},D:{en:"Three weeks",es:"Tres semanas"}}},
{q_en:"Who were the Anakim cut off in Joshua 11:21?",q_es:"¿Quiénes eran los Anaceos cortados en Josué 11:21?",options:{A:{en:"The race of giants the twelve spies feared in Numbers 13",es:"La raza de gigantes que los doce espías temieron en Números 13"},B:{en:"A Phoenician trading guild",es:"Un gremio comercial fenicio"},C:{en:"The Hivite priestly clan",es:"El clan sacerdotal heveo"},D:{en:"A group of mercenary horsemen",es:"Un grupo de jinetes mercenarios"}}},
{q_en:"From which three cities did Joshua cut off the Anakim?",q_es:"¿De qué tres ciudades cortó Josué a los Anaceos?",options:{A:{en:"Sidon, Tyre, and Acco",es:"Sidón, Tiro y Aco"},B:{en:"Jerusalem, Jericho, and Bethel",es:"Jerusalén, Jericó y Betel"},C:{en:"Shechem, Dothan, and Tirzah",es:"Siquem, Dotán y Tirsa"},D:{en:"Hebron, Debir, and Anab",es:"Hebrón, Debir y Anab"}}},
{q_en:"Why is the Anakim victory in Joshua 11 deeply significant for Israel's history?",q_es:"¿Por qué es profundamente significativa la victoria sobre los Anaceos en Josué 11?",options:{A:{en:"It produced a new royal dynasty",es:"Produjo una nueva dinastía real"},B:{en:"It opened a sea route to Egypt",es:"Abrió una ruta marítima a Egipto"},C:{en:"It established a peace treaty with Phoenicia",es:"Estableció un tratado de paz con Fenicia"},D:{en:"The same giants paralyzed Israel for 40 years after the spies' grasshopper report",es:"Los mismos gigantes paralizaron a Israel 40 años tras el reporte de las langostas"}}},
{q_en:"Joshua 11:15 emphasizes Joshua's obedience by saying:",q_es:"Josué 11:15 enfatiza la obediencia de Josué diciendo:",options:{A:{en:"He sought counsel from every elder",es:"Buscó consejo de cada anciano"},B:{en:"He kept a daily diary of battles",es:"Mantuvo un diario diario de batallas"},C:{en:"He left nothing undone of all that the LORD commanded Moses",es:"Ninguna cosa dejó por hacer de todo lo que Jehová mandó a Moisés"},D:{en:"He fasted between every campaign",es:"Ayunó entre cada campaña"}}},
{q_en:"What did the land do after the conquest (11:23)?",q_es:"¿Qué hizo la tierra después de la conquista (11:23)?",options:{A:{en:"Rejoiced with feasts",es:"Se gozó con banquetes"},B:{en:"Was divided in haste",es:"Fue dividida apresuradamente"},C:{en:"Brought forth a famine",es:"Produjo una hambruna"},D:{en:"Rested from war",es:"Descansó de la guerra"}}},
{q_en:"What is Joshua 12 essentially?",q_es:"¿Qué es esencialmente Josué 12?",options:{A:{en:"A genealogy of the priestly tribes",es:"Una genealogía de las tribus sacerdotales"},B:{en:"An account of Caleb's inheritance",es:"Un relato de la herencia de Caleb"},C:{en:"A ledger of all the kings defeated under Moses and Joshua",es:"Un libro mayor de todos los reyes derrotados bajo Moisés y Josué"},D:{en:"A list of the tribes' census numbers",es:"Una lista de los censos de las tribus"}}},
{q_en:"How many kings did Joshua defeat west of the Jordan (12:24)?",q_es:"¿Cuántos reyes derrotó Josué al occidente del Jordán (12:24)?",options:{A:{en:"Twenty-four",es:"Veinticuatro"},B:{en:"Forty",es:"Cuarenta"},C:{en:"Thirty-one",es:"Treinta y uno"},D:{en:"Twelve",es:"Doce"}}},
{q_en:"Which two kings east of Jordan did Moses defeat (Joshua 12:1-6)?",q_es:"¿Cuáles dos reyes al oriente del Jordán derrotó Moisés (Josué 12:1-6)?",options:{A:{en:"Hadad of Edom and Balak of Moab",es:"Hadad de Edom y Balac de Moab"},B:{en:"Pharaoh and the king of Petra",es:"Faraón y el rey de Petra"},C:{en:"Sihon king of the Amorites and Og king of Bashan",es:"Sehón rey de los amorreos y Og rey de Basán"},D:{en:"Eglon and Achish",es:"Eglón y Aquis"}}},
{q_en:"Where is Hazor located in Canaan?",q_es:"¿Dónde está ubicada Hazor en Canaán?",options:{A:{en:"In the Shephelah lowlands",es:"En las tierras bajas de la Sefela"},B:{en:"On the coastal plain near Joppa",es:"En la llanura costera cerca de Jope"},C:{en:"In the Negev south of Beersheba",es:"En el Negueb al sur de Beerseba"},D:{en:"In the northern hills near upper Galilee",es:"En las colinas del norte cerca de la alta Galilea"}}},
{q_en:"What faith pattern does Joshua 11 model for the Christian life?",q_es:"¿Qué patrón de fe modela Josué 11 para la vida cristiana?",options:{A:{en:"Withdrawal from public ministry",es:"Retiro del ministerio público"},B:{en:"Long obedience over many seasons",es:"Larga obediencia a través de muchas temporadas"},C:{en:"Reliance on dramatic miracles only",es:"Dependencia sólo en milagros dramáticos"},D:{en:"Strict ascetic isolation",es:"Aislamiento ascético estricto"}}},
{q_en:"What is the closing summary verse of the conquest in Joshua 11:23?",q_es:"¿Cuál es el versículo resumen del cierre de la conquista en Josué 11:23?",options:{A:{en:"\"Be strong and of good courage\"",es:"«Esfuérzate y sé valiente»"},B:{en:"\"So Joshua took the whole land, according to all that the LORD said unto Moses\"",es:"«Tomó, pues, Josué toda la tierra, conforme a todo lo que Jehová había dicho a Moisés»"},C:{en:"\"There hath not failed one word of all His good promise\"",es:"«No ha faltado palabra de todas las buenas promesas»"},D:{en:"\"By faith the walls of Jericho fell\"",es:"«Por la fe cayeron los muros de Jericó»"}}}
];
const KEY=['B','C','A','A','D','B','A','B','A','A','D','D','C','D','C','C','C','D','B','B'];

const KW=[
{q_en:"Describe the northern coalition led by Jabin (composition, size, weapons).",q_es:"Describe la coalición del norte dirigida por Jabín (composición, tamaño, armas).",
 kw_en:['jabin','hazor','coalition','horse','chariot','sand','north','kings'], kw_es:['jabín','hazor','coalición','caballo','carro','arena','norte','reyes'],
 modelEn:"Jabin, king of Hazor, gathered the northern coalition after hearing of the southern campaign. He summoned kings from across the upper half of Canaan: Madon, Shimron, Achshaph, the hill country, the Arabah, the lowlands, and more. The text describes the host as the sand on the seashore in multitude, with very many horses and chariots, the same image God once gave Abraham, now standing on the wrong side of the field. Israel, forbidden to multiply horses, had no chariots of its own; only the LORD could win this battle in the north.", modelEs:"Jabín, rey de Hazor, reunió la coalición del norte tras oír de la campaña del sur. Convocó a reyes de toda la mitad superior de Canaán: Madón, Simrón, Acsaf, el monte, la Arabá, los llanos, y más. El texto describe el ejército como la arena a la orilla del mar en multitud, con muchísimos caballos y carros, la misma imagen que Dios dio a Abraham, ahora parada en el lado equivocado del campo. Israel, a quien se prohibió multiplicar caballos, no tenía carros propios; solo Jehová podía ganar esta batalla en el norte."},
{q_en:"Explain Joshua's strategy at Merom and what he did to horses and chariots.",q_es:"Explica la estrategia de Josué en Merom y lo que hizo a caballos y carros.",
 kw_en:['merom','surprise','hamstr','burn','horse','chariot','night','obey'], kw_es:['merom','sorpresa','desjarret','quema','caballo','carro','noche','obedien'],
 modelEn:"At Merom Joshua used the same strategy as at Gibeon: he marched all night and fell on the enemy by surprise at dawn, so the cavalry had no time to mount and the chariots could not maneuver in the broken terrain. The LORD delivered them. Then, in obedience to Deuteronomy 17:16, Joshua hamstrung their horses and burned every chariot, choosing to burn serviceable equipment so Israel would never trust captured hardware instead of God. Some gifts God gives only long enough for us to obey Him by destroying them.", modelEs:"En Merom Josué usó la misma estrategia que en Gabaón: marchó toda la noche y cayó sobre el enemigo por sorpresa al amanecer, así la caballería no tuvo tiempo de montar y los carros no pudieron maniobrar en el terreno quebrado. Jehová los entregó. Luego, en obediencia a Deuteronomio 17:16, Josué desjarretó sus caballos y sus carros fueron quemados con fuego, destruyendo equipo útil para que Israel nunca confiara en hardware capturado en lugar de Dios. Algunos dones Dios los da solo el tiempo suficiente para obedecerle destruyéndolos."},
{q_en:"Identify why Hazor alone was burned of all the northern cities.",q_es:"Identifica por qué Hazor sola fue quemada.",
 kw_en:['hazor','head','kingdom','burn','capital','regenerate','king','tumor'], kw_es:['hazor','cabeza','reino','quema','capital','regenerar','rey','tumor'],
 modelEn:"Of all the northern cities, only Hazor was burned to the ground; the others were emptied but left standing. The reason is one phrase: Hazor was the head of all those kingdoms. It was the regional capital, the largest fortified city in Canaan, controlling trade routes from Egypt to Mesopotamia. To leave it standing would let the strategic center regenerate the very coalition Joshua had just defeated. So Joshua treated Hazor like a surgeon treats a tumor: he killed its king and burned the city; the head must burn. Some sins are Hazors, and the head must come off.", modelEs:"De todas las ciudades del norte, solo Hazor fue quemada hasta los cimientos; las otras fueron vaciadas pero dejadas en pie. La razón es una frase: Hazor era la cabeza de todos esos reinos. Era la capital regional, la mayor ciudad fortificada de Canaán, controlando rutas comerciales de Egipto a Mesopotamia. Dejarla en pie permitiría que el centro estratégico regenerara la misma coalición que Josué acababa de derrotar. Así Josué trató a Hazor como un cirujano trata un tumor: mató a su rey y la ciudad fue quemada; la cabeza debe ser quemada. Algunos pecados son Hazor, y la cabeza debe caer."},
{q_en:"State what Joshua 11:15 says about Joshua's obedience.",q_es:"Enuncia lo que dice Josué 11:15 sobre la obediencia de Josué.",
 kw_en:['nothing','undone','obey','command','moses','left','complete','lord'], kw_es:['nada','hacer','obedien','mandad','moisés','dejó','complet','jehová'],
 modelEn:"Joshua 11:15 gives one of the most satisfying verdicts in the Old Testament: Joshua left nothing undone of all that the LORD commanded Moses. The chain of obedience runs from God to Moses to Joshua, and not one link is dropped. Joshua did not obey selectively or stop when the famous battles were over; he carried out the complete command through the long, unglamorous war. Full obedience means leaving nothing undone, finishing all the LORD commanded, not just the parts that make headlines.", modelEs:"Josué 11:15 da uno de los veredictos más satisfactorios del Antiguo Testamento: ninguna cosa dejó por hacer Josué de todo lo que Jehová había mandado a Moisés. La cadena de obediencia corre de Dios a Moisés a Josué, y no se suelta un solo eslabón. Josué no obedeció selectivamente ni se detuvo cuando terminaron las batallas famosas; llevó a cabo el mandato completo por la guerra larga y sin gloria. La obediencia completa es no dejar nada sin hacer, terminar todo lo que Jehová mandó, no solo lo que sale en titulares."},
{q_en:"Explain who the Anakim were and connect to Numbers 13.",q_es:"Explica quiénes eran los Anaceos y la conexión con Números 13.",
 kw_en:['anakim','giant','grasshopper','number','hebron','faith','cut','spies'], kw_es:['anaceos','gigante','langosta','númer','hebrón','fe','cortad','espía'],
 modelEn:"The Anakim were the giants of Numbers 13, the sons of Anak whose size made the spies say, we were in our own sight as grasshoppers, and so we were in their sight. That grasshopper report broke Israel's faith and paralyzed an entire generation in the wilderness for forty years. Now, in Joshua 11:21, Joshua cuts the Anakim off from Hebron, Debir, and Anab. The same giants who had once cut down Israel's faith are themselves cut down in the long war. What terrified the fathers, the obedient son removed.", modelEs:"Los Anaceos eran los gigantes de Números 13, los hijos de Anac cuyo tamaño hizo decir a los espías: éramos a nuestro parecer como langostas, y así les parecíamos a ellos. Ese reporte de las langostas quebró la fe de Israel y paralizó a toda una generación en el desierto por cuarenta años. Ahora, en Josué 11:21, Josué corta a los Anaceos de Hebrón, Debir y Anab. Los mismos gigantes que una vez cortaron la fe de Israel son ahora cortados en la guerra larga. Lo que aterró a los padres, el hijo obediente lo quitó."},
{q_en:"Describe what \\\"Joshua made war a long time\\\" teaches about Christian endurance.",q_es:"Describe lo que enseña «Josué hizo guerra mucho tiempo» sobre la perseverancia cristiana.",
 kw_en:['long','war','endur','carey','judson','time','famous','obedience'], kw_es:['larga','guerra','persever','carey','judson','tiempo','famos','obedien'],
 modelEn:"Joshua 11:18 says simply, Joshua made war a long time with all those kings. There are no trumpets or hailstones here; the chapter has shifted from miracle to endurance. This is where most Christian biographies divide. The Jericho moments are easy to recognize; the long stretches are harder. William Carey spent seven years in India before his first convert, and Adoniram Judson six years in Burma before his first. Joshua 11 is the chapter for the unglamorous middle between the famous chapters, where the only headline is the long obedience of made war a long time.", modelEs:"Josué 11:18 dice sencillamente: por mucho tiempo tuvo guerra Josué con estos reyes. Aquí no hay trompetas ni granizo; el capítulo ha pasado del milagro a la perseverancia. Aquí se dividen la mayoría de las biografías cristianas. Los momentos de Jericó son fáciles de reconocer; los largos trechos son más difíciles. William Carey pasó siete años en la India antes de su primer convertido, y Adoniram Judson seis años en Birmania antes del suyo. Josué 11 es el capítulo del medio sin gloria entre los capítulos famosos, donde el único titular es la larga obediencia de hizo guerra mucho tiempo."},
{q_en:"Summarize the structure of Joshua 12 and the count of kings.",q_es:"Resume la estructura de Josué 12 y el conteo de reyes.",
 kw_en:['ledger','column','thirty','kings','promise','moses','joshua','count'], kw_es:['libro','columna','treinta','reyes','promesa','moisés','josué','contable'],
 modelEn:"Joshua 12 is the ledger of the conquest, doing for the wars what Kings and Chronicles later do for the monarchy. It lists every defeated king by name and city in two columns. The east-Jordan column names two kings Moses defeated; the west-Jordan column lists the thirty-one kings Joshua defeated, in a geographical sweep across the land, thirty-three in all. It reads like an accounting report, but every line is a covenant promise kept. Each name is a place where God said I have given, and Joshua, in the long obedience, took.", modelEs:"Josué 12 es el libro mayor de la conquista, haciendo por las guerras lo que Reyes y Crónicas harán después por la monarquía. Enumera cada rey derrotado por nombre y ciudad en dos columnas. La columna al oriente del Jordán nombra dos reyes que Moisés derrotó; la columna al occidente enumera los treinta y un reyes que Josué derrotó, en un barrido geográfico por la tierra, treinta y tres en total. Lee como un reporte contable, pero cada línea es una promesa del pacto cumplida. Cada nombre es un lugar donde Dios dijo Yo he entregado, y Josué, en la larga obediencia, tomó."},
{q_en:"Identify the two kings Moses defeated east of the Jordan.",q_es:"Identifica los dos reyes que Moisés derrotó al oriente del Jordán.",
 kw_en:['sihon','amorite','heshbon','og','bashan','moses','east','rephaim'], kw_es:['sehón','amorre','hesbón','og','basán','moisés','oriente','refaí'],
 modelEn:"The east-Jordan column of Joshua 12 names the two kings Moses defeated under God's command before he died: Sihon, king of the Amorites, who reigned at Heshbon, and Og, king of Bashan, the last of the Rephaim. These victories east of the Jordan came under Moses; the thirty-one kings west of the Jordan came under Joshua. Two and thirty-one, the ledger keeps the score of a covenant promise kept on both sides of the river.", modelEs:"La columna al oriente del Jordán de Josué 12 nombra a los dos reyes que Moisés derrotó bajo el mandato de Dios antes de morir: Sehón, rey de los amorreos, que reinaba en Hesbón, y Og, rey de Basán, el último de los refaítas. Estas victorias al oriente del Jordán fueron bajo Moisés; los treinta y un reyes al occidente fueron bajo Josué. Dos y treinta y uno, el libro mayor lleva la cuenta de una promesa del pacto cumplida a ambos lados del río."},
{q_en:"Explain the importance of \\\"the land rested from war.\\\"",q_es:"Explica la importancia de «la tierra descansó de la guerra».",
 kw_en:['land','rest','rested','war','conquest','complete','sabbath','peace'], kw_es:['tierra','descans','guerra','conquista','repos','complet','sábado','paz'],
 modelEn:"The conquest closes with one quiet sentence: So Joshua took the whole land, according to all that the LORD said unto Moses, and the land rested from war. The dramatic chapters echo; the long chapter brings rest. The promise is now complete, the land that had been fought over since Jericho finally has peace. This rest points forward: as Hebrews teaches, there remains a Sabbath rest for the people of God, a deeper rest that Joshua's conquest only foreshadowed. The war ends; the land rests.", modelEs:"La conquista cierra con una frase silenciosa: Tomó, pues, Josué toda la tierra, conforme a todo lo que Jehová había dicho a Moisés, y la tierra descansó de la guerra. Los capítulos dramáticos resuenan; el capítulo largo trae reposo. La promesa está ahora completa, la tierra que se había disputado desde Jericó al fin tiene paz. Este reposo apunta adelante: como enseña Hebreos, queda un reposo de sábado para el pueblo de Dios, un descanso más profundo que la conquista de Josué solo prefiguró. La guerra termina; la tierra descansa."},
{q_en:"Describe the principle of full obedience as modeled by Joshua.",q_es:"Describe el principio de obediencia plena modelado por Josué.",
 kw_en:['obedience','nothing','undone','complete','selective','joshua','finish','command'], kw_es:['obedien','nada','hacer','complet','selectiv','josué','termin','mandato'],
 modelEn:"Joshua models full obedience: he left nothing undone of all the LORD commanded, finishing the complete command rather than obeying selectively. He did not stop when the famous battles were over; he carried the whole task through the long, unglamorous war until the land rested. Full obedience is not picking the dramatic parts of God's command and leaving the rest; it is finishing everything, the headline chapters and the long stretches alike. Joshua left nothing undone, and that is the pattern for the obedient life.", modelEs:"Josué modela la obediencia completa: no dejó nada sin hacer de todo lo que Jehová mandó, terminando el mandato completo en vez de obedecer selectivamente. No se detuvo cuando terminaron las batallas famosas; llevó toda la tarea por la guerra larga y sin gloria hasta que la tierra descansó. La obediencia completa no es escoger las partes dramáticas del mandato de Dios y dejar el resto; es terminar todo, los capítulos de titular y los largos trechos por igual. Josué no dejó nada sin hacer, y ese es el patrón para la vida obediente."}
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
