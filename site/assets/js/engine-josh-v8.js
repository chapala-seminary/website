/* Exam engine for CTSJosh (shared by 1 unit page).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/josh/unitN.js. */
// CTS Joshua — Unit 8: The Inheritance Allotted (Joshua 13-19). Retrofit 2026-05-16.
// MC L3 verified | KEY A=B=C=D=5 | split kw_en/kw_es
(function(){
'use strict';

const UNIT = 8;
const COURSE = 'josh';
const NEXT_UNIT_URL = 'CTSJoshUnit9.html';
const PREV_UNIT_URL = 'CTSJoshUnit7.html';

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
{q_en:"What does the LORD say to Joshua at the start of chapter 13?",q_es:"¿Qué le dice Jehová a Josué al inicio del capítulo 13?",options:{A:{en:"\"Begin a new campaign in the south\"",es:"«Comienza una nueva campaña en el sur»"},B:{en:"\"Build me a temple at Shiloh\"",es:"«Edifícame un templo en Silo»"},C:{en:"\"Thou art old and stricken in years, and there remaineth yet very much land to be possessed\"",es:"«Tú eres ya viejo, de edad avanzada, y queda aún mucha tierra por poseer»"},D:{en:"\"Choose a successor\"",es:"«Escoge un sucesor»"}}},
{q_en:"Which tribes received their inheritance east of the Jordan from Moses?",q_es:"¿Cuáles tribus recibieron heredad al oriente del Jordán de Moisés?",options:{A:{en:"Judah and Benjamin",es:"Judá y Benjamín"},B:{en:"Reuben, Gad, and the half-tribe of Manasseh",es:"Rubén, Gad y la media tribu de Manasés"},C:{en:"Ephraim and the daughters of Zelophehad",es:"Efraín y las hijas de Zelofehad"},D:{en:"Asher, Naphtali, and Dan",es:"Aser, Neftalí y Dan"}}},
{q_en:"Which tribe received no land inheritance because the LORD Himself was their inheritance?",q_es:"¿Cuál tribu no recibió heredad de tierra porque Jehová mismo era su heredad?",options:{A:{en:"Simeon",es:"Simeón"},B:{en:"Issachar",es:"Isacar"},C:{en:"Levi",es:"Leví"},D:{en:"Benjamin",es:"Benjamín"}}},
{q_en:"How old was Caleb when he asked Joshua for Hebron?",q_es:"¿Cuántos años tenía Caleb cuando le pidió Hebrón a Josué?",options:{A:{en:"Forty",es:"Cuarenta"},B:{en:"Sixty",es:"Sesenta"},C:{en:"Seventy-five",es:"Setenta y cinco"},D:{en:"Eighty-five",es:"Ochenta y cinco"}}},
{q_en:"What were Caleb's famous words to Joshua at age 85 (14:12)?",q_es:"¿Cuáles fueron las famosas palabras de Caleb a Josué a los 85 (14:12)?",options:{A:{en:"\"Choose ye this day whom ye will serve\"",es:"«Escogeos hoy a quién sirváis»"},B:{en:"\"Build me a city in the south\"",es:"«Edifícame una ciudad en el sur»"},C:{en:"\"Send me to the Anakim of Bashan\"",es:"«Envíame a los anaceos de Basán»"},D:{en:"\"Now therefore give me this mountain\"",es:"«Dame, pues, ahora este monte»"}}},
{q_en:"How long had Caleb waited for the promise made at Kadesh-barnea?",q_es:"¿Cuánto había esperado Caleb por la promesa hecha en Cades-barnea?",options:{A:{en:"Twenty years",es:"Veinte años"},B:{en:"Forty-five years",es:"Cuarenta y cinco años"},C:{en:"Seventy years",es:"Setenta años"},D:{en:"One hundred years",es:"Cien años"}}},
{q_en:"What phrase is repeated three times about Caleb in Joshua 14 (vv. 8, 9, 14)?",q_es:"¿Qué frase se repite tres veces sobre Caleb en Josué 14 (vv. 8, 9, 14)?",options:{A:{en:"\"He wholly followed the LORD God of Israel\"",es:"«Cumplió siguiendo a Jehová Dios de Israel»"},B:{en:"\"He fought a long time\"",es:"«Peleó mucho tiempo»"},C:{en:"\"He served as a judge\"",es:"«Sirvió como juez»"},D:{en:"\"He was a man of war\"",es:"«Era hombre de guerra»"}}},
{q_en:"Who was Achsah?",q_es:"¿Quién era Acsa?",options:{A:{en:"Joshua's daughter",es:"La hija de Josué"},B:{en:"A Gibeonite woman",es:"Una mujer gabaonita"},C:{en:"Caleb's daughter, given in marriage to Othniel",es:"La hija de Caleb, dada en matrimonio a Otoniel"},D:{en:"A Levite's wife",es:"La esposa de un levita"}}},
{q_en:"What did Achsah ask of her father in addition to the south land (15:19)?",q_es:"¿Qué le pidió Acsa a su padre además de la tierra del Neguev (15:19)?",options:{A:{en:"A blessing &mdash; the springs of water",es:"Un don &mdash; las fuentes de aguas"},B:{en:"A house in Hebron",es:"Una casa en Hebrón"},C:{en:"A flock of sheep",es:"Un rebaño de ovejas"},D:{en:"Forty acres of vineyards",es:"Cuarenta hectáreas de viñas"}}},
{q_en:"What did Joshua establish at Shiloh in chapter 18?",q_es:"¿Qué estableció Josué en Silo en el capítulo 18?",options:{A:{en:"The tabernacle / tent of meeting",es:"El tabernáculo / tienda de reunión"},B:{en:"A royal palace",es:"Un palacio real"},C:{en:"A military training center",es:"Un centro de entrenamiento militar"},D:{en:"A common marketplace",es:"Un mercado común"}}},
{q_en:"How long did the tabernacle remain at Shiloh as Israel's worship center?",q_es:"¿Cuánto tiempo permaneció el tabernáculo en Silo como centro de adoración?",options:{A:{en:"About fifty years",es:"Cerca de cincuenta años"},B:{en:"Until the days of Eli and Samuel (~350 years)",es:"Hasta los días de Elí y Samuel (~350 años)"},C:{en:"Until Solomon built the temple",es:"Hasta que Salomón edificó el templo"},D:{en:"Only one generation",es:"Sólo una generación"}}},
{q_en:"How did Joshua respond to the Joseph tribes' complaint about land size (17:14-18)?",q_es:"¿Cómo respondió Josué a la queja de las tribus de José (17:14-18)?",options:{A:{en:"He gave them an additional lot in the valley",es:"Les dio un lote adicional en el valle"},B:{en:"He apologized for the small allotment",es:"Se disculpó por la heredad pequeña"},C:{en:"He referred them to the elders of Manasseh",es:"Los refirió a los ancianos de Manasés"},D:{en:"He told them to go up and clear the wood country themselves",es:"Les dijo que subieran y limpiaran el bosque ellos mismos"}}},
{q_en:"To which tribe did the five daughters of Zelophehad belong?",q_es:"¿A qué tribu pertenecían las cinco hijas de Zelofehad?",options:{A:{en:"Asher",es:"Aser"},B:{en:"Issachar",es:"Isacar"},C:{en:"Manasseh",es:"Manasés"},D:{en:"Naphtali",es:"Neftalí"}}},
{q_en:"On what basis did the daughters of Zelophehad receive an inheritance?",q_es:"¿Sobre qué base recibieron heredad las hijas de Zelofehad?",options:{A:{en:"The LORD's earlier ruling through Moses (Numbers 27)",es:"El fallo anterior de Jehová por medio de Moisés (Números 27)"},B:{en:"Their personal wealth",es:"Su riqueza personal"},C:{en:"A vote of the elders",es:"Un voto de los ancianos"},D:{en:"A lottery cast by Eleazar",es:"Una suerte echada por Eleazar"}}},
{q_en:"How many tribes had not yet received inheritance when Joshua moved to Shiloh (18:2)?",q_es:"¿Cuántas tribus no habían recibido heredad cuando Josué se mudó a Silo (18:2)?",options:{A:{en:"Three",es:"Tres"},B:{en:"Seven",es:"Siete"},C:{en:"Five",es:"Cinco"},D:{en:"Nine",es:"Nueve"}}},
{q_en:"What did Joshua send three men from each remaining tribe to do (18:4)?",q_es:"¿Qué envió Josué a hacer a tres hombres de cada tribu restante (18:4)?",options:{A:{en:"Walk through the land and describe it in writing",es:"Caminar la tierra y describirla por escrito"},B:{en:"Negotiate with the Canaanites",es:"Negociar con los cananeos"},C:{en:"Establish trade routes",es:"Establecer rutas comerciales"},D:{en:"Build outposts on the borders",es:"Edificar puestos de avanzada"}}},
{q_en:"What was Joshua's own personal inheritance (19:50)?",q_es:"¿Cuál fue la heredad personal de Josué (19:50)?",options:{A:{en:"Hebron",es:"Hebrón"},B:{en:"Shechem",es:"Siquem"},C:{en:"Gibeon",es:"Gabaón"},D:{en:"Timnath-serah in mount Ephraim",es:"Timnat-sera en el monte de Efraín"}}},
{q_en:"When did Joshua receive his personal inheritance?",q_es:"¿Cuándo recibió Josué su heredad personal?",options:{A:{en:"Before any of the tribes",es:"Antes de cualquiera de las tribus"},B:{en:"Together with Caleb at Hebron",es:"Junto con Caleb en Hebrón"},C:{en:"Last, after all the tribes",es:"Al último, después de todas las tribus"},D:{en:"At the same time as Eleazar",es:"Al mismo tiempo que Eleazar"}}},
{q_en:"What does Caleb's enduring faith model for the believer?",q_es:"¿Qué modela la fe duradera de Caleb para el creyente?",options:{A:{en:"Withdrawal in old age",es:"Retiro en la vejez"},B:{en:"Quick spiritual decisions",es:"Decisiones espirituales rápidas"},C:{en:"Independence from leadership",es:"Independencia del liderazgo"},D:{en:"Wholehearted faith preserved through decades",es:"Fe de todo corazón preservada por décadas"}}},
{q_en:"What is the deeper theological message of Joshua 13-19?",q_es:"¿Cuál es el mensaje teológico más profundo de Josué 13-19?",options:{A:{en:"Israel's military superiority",es:"La superioridad militar de Israel"},B:{en:"God's promises become personal possessions, distributed family by family",es:"Las promesas de Dios se vuelven posesiones personales, repartidas familia por familia"},C:{en:"The dangers of multiple inheritances",es:"Los peligros de múltiples heredades"},D:{en:"The supremacy of the priestly tribe",es:"La supremacía de la tribu sacerdotal"}}}
];
const KEY=['C','B','C','D','D','B','A','C','A','A','B','D','C','A','B','A','D','C','D','B'];

const KW=[
{q_en:"Describe what Joshua 13:1 reveals about the work remaining.",q_es:"Describe lo que Josué 13:1 revela sobre la obra que queda.",
 kw_en:['old','land','possess','remain','inheritance','deed','promise','occup'], kw_es:['viejo','tierra','posee','queda','heredad','escritura','promesa','ocupa'],
 modelEn:"Joshua 13:1 is not a rebuke but a hand on the shoulder: Joshua was old and stricken in years, and the LORD says there remains yet very much land to be possessed. The conquest is not the whole story; the inheritance is the rest of it. The remaining land is to be divided now, with full title, even before every pocket is cleared, so the deed comes first and the dwelling second. The promise is fully given though the possession is not yet fully realized. Like the believer, Israel receives the land by inheritance and then goes in to occupy it.", modelEs:"Josué 13:1 no es un reproche sino una mano en el hombro: Josué era ya viejo, entrado en años, y el SEÑOR dice que queda aún mucha tierra por poseer. La conquista no es toda la historia; la heredad es el resto. La tierra restante ha de repartirse ahora, con título pleno, aun antes de que cada foco se limpie, así la escritura viene primero y la morada después. La promesa está plenamente dada aunque la posesión no esté plenamente realizada. Como el creyente, Israel recibe la tierra por heredad y luego entra a ocuparla."},
{q_en:"Identify the tribes who received their inheritance east of the Jordan.",q_es:"Identifica las tribus que recibieron heredad al oriente del Jordán.",
 kw_en:['reuben','gad','manasseh','east','moses','flock','cross','fight'], kw_es:['rubén','gad','manasés','oriente','moisés','rebaño','cruzar','pelear'],
 modelEn:"Reuben, Gad, and the half-tribe of Manasseh received their inheritance east of the Jordan. They had asked Moses for that rich pastureland because their flocks and cattle were many, and Moses granted it on one condition: their fighting men must cross over the Jordan and fight alongside their brothers until the western tribes were settled. The condition was honored, for they crossed and fought the seven-year campaign, so Joshua's first act of inheritance was to confirm the eastern allotment Moses had already given them. The earlier promise stood.", modelEs:"Rubén, Gad y la media tribu de Manasés recibieron su heredad al oriente del Jordán. Le habían pedido a Moisés esa rica tierra de pastoreo porque sus rebaños eran muchos, y Moisés se la concedió bajo una condición: sus hombres de guerra debían cruzar el Jordán y pelear junto a sus hermanos hasta que las tribus occidentales se asentaran. La condición fue honrada, pues cruzaron y pelearon la campaña de siete años, así que el primer acto de heredad de Josué fue confirmar el reparto oriental que Moisés ya les había dado. La promesa anterior permaneció."},
{q_en:"Explain why Levi received no land inheritance.",q_es:"Explica por qué Leví no recibió heredad de tierra.",
 kw_en:['levi','inheritance','land','lord','sacrific','cities','scattered','altar'], kw_es:['levit','heredad','tierra','jehová','sacrific','ciudad','esparc','altar'],
 modelEn:"Only the tribe of Levi received no land inheritance. Scripture says it twice: the sacrifices of the LORD made by fire are their inheritance, and the LORD God of Israel was their inheritance. The Levites got no farmland or plot; they lived in forty-eight cities scattered through the other tribes' territories and ate from the offerings of Israel. Eleven tribes received fertile valleys and cities; the twelfth received the LORD Himself. Scattered on purpose, a Levite was near every Israelite to teach the Law and serve at the altar. The tribe with no land had the most reach, and came out ahead.", modelEs:"Solo la tribu de Leví no recibió heredad de tierra. La Escritura lo dice dos veces: los sacrificios de Jehová hechos por fuego son su heredad, y Jehová Dios de Israel era su heredad. Los levitas no tuvieron tierra de labranza ni parcela; vivían en cuarenta y ocho ciudades esparcidas por los territorios de las otras tribus y comían de las ofrendas de Israel. Once tribus recibieron valles fértiles y ciudades; la doceava recibió a Jehová mismo. Esparcidos a propósito, un levita estaba cerca de cada israelita para enseñar la Ley y servir en el altar. La tribu sin tierra tenía el mayor alcance, y salió ganando."},
{q_en:"Describe Caleb's request at age 85 and what made it unique.",q_es:"Describe la petición de Caleb a los 85 y qué la hizo única.",
 kw_en:['caleb','mountain','hebron','anakim','eighty','patience','wholly','grasshopper'], kw_es:['caleb','monte','hebrón','anaceos','ochenta','paciencia','cumpli','langosta'],
 modelEn:"Caleb, now eighty-five, walks into Joshua 14 leaning on forty-five years of patience and asks for the very mountain that paralyzed his generation in Numbers 13. He says, Now therefore give me this mountain, whereof the LORD spake. A remnant of the Anakim still held Hebron; Caleb asks for Hebron and takes Hebron. The man who at forty refused to call himself a grasshopper now at eighty-five refuses to call himself too old. What made it unique was that he claimed the hardest ground, the giants' stronghold, because he had wholly followed the LORD.", modelEs:"Caleb, ahora de ochenta y cinco años, entra en Josué 14 apoyado en cuarenta y cinco años de paciencia y pide el mismo monte que paralizó a su generación en Números 13. Dice: Dame, pues, ahora este monte, del cual habló Jehová. Un remanente de los Anaceos todavía tenía Hebrón; Caleb pide Hebrón y toma Hebrón. El hombre que a los cuarenta se rehusó a llamarse langosta ahora a los ochenta y cinco se rehúsa a llamarse demasiado viejo. Lo que lo hizo único fue que reclamó el terreno más difícil, la fortaleza de los gigantes, porque cumplió siguiendo a Jehová."},
{q_en:"Identify the three-fold phrase repeated about Caleb.",q_es:"Identifica la frase triple repetida sobre Caleb.",
 kw_en:['wholly','follow','lord','caleb','three','times','phrase','faith'], kw_es:['cumpli','siguiendo','jehová','caleb','tres','veces','frase','fe'],
 modelEn:"Three times the chapter wraps the same phrase around Caleb's life: he wholly followed the LORD God of Israel. It is said of him at Kadesh-barnea, where he and Joshua alone brought back a faithful report, and it is repeated as he receives Hebron. The phrase is the verdict of a whole life of faith, not partial, not selective, but wholly. Caleb did not follow the LORD on the famous days only; he followed Him through forty-five years of waiting. Wholly followed the LORD is the epitaph every believer should want.", modelEs:"Tres veces el capítulo envuelve la misma frase alrededor de la vida de Caleb: cumplió siguiendo a Jehová Dios de Israel. Se dice de él en Cades-barnea, donde él y Josué solos trajeron un reporte fiel, y se repite al recibir Hebrón. La frase es el veredicto de toda una vida de fe, no parcial, no selectiva, sino por completo. Caleb no siguió a Jehová solo en los días famosos; lo siguió por cuarenta y cinco años de espera. Cumplió siguiendo a Jehová es el epitafio que todo creyente debería querer."},
{q_en:"Tell the story of Achsah and the springs of water.",q_es:"Cuenta la historia de Acsa y las fuentes de agua.",
 kw_en:['achsah','caleb','spring','water','bless','daughter','dry','upper'], kw_es:['acsa','caleb','manantial','agua','bendic','hija','seca','arriba'],
 modelEn:"Achsah, Caleb's daughter, had been given a south land, dry, hot, and marginal, land that would not produce without water. So she came to her father with a request: Give me a blessing; you have given me a south land, give me also springs of water. Caleb gave her the upper springs and the nether springs. The scene preserves the inheritance rights of women in Israel and shows a daughter who would not settle for dry ground. She asked her father for water, and the father gave generously, both the upper and the lower springs.", modelEs:"Acsa, la hija de Caleb, había recibido una tierra del sur, seca, calurosa y marginal, tierra que no produciría sin agua. Así que vino a su padre con una petición: Dame una bendición; me has dado tierra del sur, dame también manantiales de agua. Caleb le dio las fuentes de arriba y las de abajo. La escena preserva los derechos de heredad de las mujeres en Israel y muestra a una hija que no se conformó con tierra seca. Pidió agua a su padre, y el padre dio con generosidad los manantiales de arriba y los de abajo."},
{q_en:"Explain the significance of the tabernacle being set up at Shiloh.",q_es:"Explica el significado de levantar el tabernáculo en Silo.",
 kw_en:['shiloh','tabernacle','worship','survey','lots','measure','central','tribe'], kw_es:['silo','tabernáculo','adorac','medic','suerte','camin','central','tribu'],
 modelEn:"At Shiloh the tabernacle of the congregation was set up, making Shiloh the central place of national worship for the rest of the conquest era. From there Joshua sent out three men from each of the seven remaining tribes, twenty-one surveyors, to walk the unallotted land, measure it, and write its cities in a book. They brought the survey back to Shiloh, where Joshua cast lots before the LORD and assigned the land tribe by tribe. The land was given by promise, distributed by lot, but first walked and measured by men with their feet on the ground.", modelEs:"En Silo se levantó el tabernáculo de reunión, haciendo de Silo el lugar central de la adoración nacional por el resto de la era de la conquista. Desde allí Josué envió tres hombres de cada una de las siete tribus restantes, veintiún hombres de medición, a caminar la tierra no repartida, medirla y escribir sus ciudades en un libro. Trajeron la medición de vuelta a Silo, donde Josué echó suertes delante de Jehová y asignó la tierra tribu por tribu. La tierra se dio por promesa, se repartió por suerte, pero primero se caminó y se midió."},
{q_en:"Describe Joshua's response to the Joseph tribes' complaint.",q_es:"Describe la respuesta de Josué a la queja de las tribus de José.",
 kw_en:['joseph','wood','clear','great','chariot','mountain','narrow','drive'], kw_es:['josé','bosque','despejar','grande','carro','monte','estrecho','echar'],
 modelEn:"The tribes of Joseph complained that their inheritance was too narrow, only one lot, and protested that the Canaanites in the valley had iron chariots. Joshua's answer was hard-edged and bracing: Thou art a great people and hast great power; you shall not have one lot only, but the mountain shall be thine, for it is a wood, and you shall clear it by cutting it down; and you shall drive out the Canaanites, though they have iron chariots and are strong. The lesson: a great people clears its own wooded hills instead of complaining about its borders.", modelEs:"Las tribus de José se quejaron de que su heredad era demasiado estrecha, un solo lote, y protestaron que los cananeos del valle tenían carros de hierro. La respuesta de Josué fue de borde duro y vigorizante: Tú eres un gran pueblo y tienes gran poder; no tendrás una sola suerte, sino que el monte será tuyo, pues es un bosque, y lo despejarás cortándolo; y echarás a los cananeos, aunque tengan carros de hierro y sean fuertes. La lección: un pueblo grande despeja sus propios montes boscosos en vez de quejarse de sus fronteras."},
{q_en:"Identify the daughters of Zelophehad and what their case established.",q_es:"Identifica las hijas de Zelofehad y lo que su caso estableció.",
 kw_en:['zelophehad','daughter','inheritance','promise','son','women','rights','father'], kw_es:['zelofehad','hijas','heredad','promesa','hijo','mujer','derech','padre'],
 modelEn:"The daughters of Zelophehad came to Joshua citing a promise God had given them through Moses: their father had died with no son, and they asked that his inheritance not be lost but pass to them. Joshua granted it. Their case established the inheritance rights of women in Israel, that where a man left no son, his daughters would inherit his portion. Unlike Joseph, who complained, the daughters came citing God's word, and Joshua gave them their inheritance because they stood on a promise.", modelEs:"Las hijas de Zelofehad vinieron a Josué citando una promesa que Dios les había dado por medio de Moisés: su padre había muerto sin hijo varón, y pidieron que su heredad no se perdiera sino que pasara a ellas. Josué se la concedió. Su caso estableció los derechos de heredad de las mujeres en Israel, que donde un hombre no dejaba hijo, sus hijas heredarían su porción. A diferencia de José, que se quejó, las hijas vinieron citando la palabra de Dios, y Josué les dio su heredad porque se apoyaban en una promesa."},
{q_en:"Explain the significance of Joshua receiving his own inheritance last.",q_es:"Explica el significado de que Josué recibiera su heredad al último.",
 kw_en:['joshua','last','inheritance','timnath','ephraim','servant','built','first'], kw_es:['josué','último','heredad','timnat','efraín','siervo','edific','primero'],
 modelEn:"The most quietly remarkable detail of the whole section is that Joshua receives his own inheritance last. After the tribes had made an end of dividing the land, the children of Israel gave Joshua the city he asked for, Timnath-serah in mount Ephraim, and he built it and lived there. The general who marched all night to Gibeon, stood under the unmoving sun, and gave Caleb Hebron does not pick first and does not pick big. He takes his portion after every other tribe is settled, a picture of the servant leader who serves himself last.", modelEs:"El detalle más silenciosamente notable de toda la sección es que Josué recibe su propia heredad al último. Después de que las tribus terminaron de repartir la tierra, los hijos de Israel dieron a Josué la ciudad que pidió, Timnat-sera en el monte de Efraín, y la edificó y habitó en ella. El general que marchó toda la noche hasta Gabaón, se paró bajo el sol detenido y dio a Caleb Hebrón no escoge primero ni escoge grande. Toma su porción después de que toda otra tribu está asentada, una imagen del líder siervo que se sirve a sí mismo de último."}
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
