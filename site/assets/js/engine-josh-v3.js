/* Exam engine for CTSJosh (shared by 1 unit page).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/josh/unitN.js. */
// CTS Joshua — Unit 10 CAPSTONE: Choose This Day (Joshua 23-24). Retrofit 2026-05-16.
// MC L3 audit (Wayne-approved 12 swaps): MC2,4,6,7,9,10,13,14,15,17,18,19.
// Final unit — redirect target is Certificate, not next unit.
(function(){
'use strict';

const UNIT = 10;
const COURSE = 'josh';
const NEXT_UNIT_URL = (function(){try{var s=JSON.parse(localStorage.getItem('cts_student')||'null');var t=s&&s.track;if(t==='mdiv')return 'CTSJoshMDivCertificate.html';if(t==='thm')return 'CTSJoshThMCertificate.html';}catch(e){}return 'CTSJoshCertificate.html';})();
const PREV_UNIT_URL = 'CTSJoshUnit9.html';

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
{q_en:"What is the chronological setting of Joshua 23?",q_es:"¿Cuál es el escenario cronológico de Josué 23?",options:{A:{en:"A long time after the LORD had given rest to Israel; Joshua was old and ready to die",es:"Mucho tiempo después de que Jehová diera reposo; Josué era viejo y próximo a morir"},B:{en:"During the conquest of Hazor",es:"Durante la conquista de Hazor"},C:{en:"Before the Jordan crossing",es:"Antes del cruce del Jordán"},D:{en:"At Caleb's request for Hebron",es:"A petición de Caleb por Hebrón"}}},
{q_en:"Wayne identifies three farewells of Joshua. What is their structure?",q_es:"Wayne identifica tres adioses de Josué. ¿Cuál es su estructura?",options:{A:{en:"Priests, Levites, and warriors only",es:"Sólo sacerdotes, levitas y guerreros"},B:{en:"One speech to all twelve tribes",es:"Un solo discurso a las doce tribus"},C:{en:"Eastern tribes (ch. 22); leaders (ch. 23); all the people at Shechem (ch. 24)",es:"Tribus orientales (cap. 22); líderes (cap. 23); todo el pueblo en Siquem (cap. 24)"},D:{en:"To the Anakim survivors only",es:"Sólo a los sobrevivientes Anaceos"}}},
{q_en:"Where did Joshua deliver his final farewell to all the people?",q_es:"¿Dónde dio Josué su adiós final a todo el pueblo?",options:{A:{en:"Gilgal",es:"Gilgal"},B:{en:"Hebron",es:"Hebrón"},C:{en:"Shiloh",es:"Silo"},D:{en:"Shechem",es:"Siquem"}}},
{q_en:"What is theologically significant about Shechem as the location of Joshua's final speech?",q_es:"¿Qué es teológicamente significativo de Siquem como ubicación del último discurso?",options:{A:{en:"It was Egypt's stronghold",es:"Era la fortaleza de Egipto"},B:{en:"Abraham received the first promise of the land there; Jacob buried foreign gods there; Joseph's bones lay in the ground there",es:"Abraham recibió allí la primera promesa de la tierra; Jacob enterró allí dioses extranjeros; los huesos de José yacían allí"},C:{en:"It was Joshua's birthplace",es:"Era el lugar de nacimiento de Josué"},D:{en:"It was a Levitical city",es:"Era una ciudad levítica"}}},
{q_en:"How does the LORD begin His historical recital in Joshua 24:2?",q_es:"¿Cómo comienza el SEÑOR Su recital histórico en Josué 24:2?",options:{A:{en:"\"Behold the children of Abraham&hellip;\"",es:"«He aquí los hijos de Abraham&hellip;»"},B:{en:"\"From the days of Adam&hellip;\"",es:"«Desde los días de Adán&hellip;»"},C:{en:"\"You alone have I chosen\"",es:"«Sólo a ti he escogido»"},D:{en:"\"Your fathers dwelt on the other side of the flood&hellip; and they served other gods\"",es:"«Vuestros padres habitaron antiguamente al otro lado del río&hellip; y servían a dioses extraños»"}}},
{q_en:"What two-word transition opens Joshua 24:14?",q_es:"¿Qué transición de dos palabras abre Josué 24:14?",options:{A:{en:"\"Behold then\"",es:"«He aquí pues»"},B:{en:"\"Now therefore\"",es:"«Ahora, pues»"},C:{en:"\"Hear ye\"",es:"«Oíd»"},D:{en:"\"And finally\"",es:"«Y finalmente»"}}},
{q_en:"What is the famous challenge Joshua issues in 24:15?",q_es:"¿Cuál es el famoso desafío que Josué emite en 24:15?",options:{A:{en:"\"Cross over the Jordan again\"",es:"«Cruzad de nuevo el Jordán»"},B:{en:"\"Build me an altar at Shiloh\"",es:"«Edifícame un altar en Silo»"},C:{en:"\"Forsake the Anakim\"",es:"«Olvidad a los Anaceos»"},D:{en:"\"Choose you this day whom ye will serve&hellip; but as for me and my house, we will serve the LORD\"",es:"«Escogeos hoy a quién sirváis&hellip; pero yo y mi casa serviremos a Jehová»"}}},
{q_en:"Wayne lists five qualities of Joshua's challenge in 24:15. Which is NOT one of them?",q_es:"Wayne enumera cinco cualidades del desafío. ¿Cuál NO es una de ellas?",options:{A:{en:"It can be deferred to the next generation",es:"Puede ser diferida a la siguiente generación"},B:{en:"It is daily",es:"Es diaria"},C:{en:"It is honest about live alternatives",es:"Es honesta sobre alternativas vivas"},D:{en:"It is exemplary &mdash; Joshua chose first",es:"Es ejemplar &mdash; Josué escogió primero"}}},
{q_en:"Who was Von Zealand?",q_es:"¿Quién era Von Zealand?",options:{A:{en:"A Dutch reformer",es:"Un reformador holandés"},B:{en:"Frederick the Great's greatest general, who rebuked the king for blaspheming Christ",es:"El más grande general de Federico el Grande, que reprendió al rey por blasfemar a Cristo"},C:{en:"A British missionary to India",es:"Un misionero británico a la India"},D:{en:"A Confederate chaplain",es:"Un capellán confederado"}}},
{q_en:"How many battles had Von Zealand won for Prussia, by his own count?",q_es:"¿Cuántas batallas había ganado Von Zealand para Prusia, según su propia cuenta?",options:{A:{en:"Thirty-eight",es:"Treinta y ocho"},B:{en:"Twelve",es:"Doce"},C:{en:"Twenty-four",es:"Veinticuatro"},D:{en:"One hundred",es:"Cien"}}},
{q_en:"What did Frederick the Great say after Von Zealand's stand?",q_es:"¿Qué dijo Federico el Grande después de la postura de Von Zealand?",options:{A:{en:"\"Have him removed\"",es:"«Que se lo lleven»"},B:{en:"He laughed louder",es:"Se rió más fuerte"},C:{en:"He demoted the general",es:"Degradó al general"},D:{en:"\"General Von Zealand, I beg your pardon. I beg your pardon\"",es:"«General Von Zealand, le pido perdón. Le pido perdón»"}}},
{q_en:"In Wayne's seven faith-motifs from Joshua, what is the first?",q_es:"En los siete motivos de fe de Wayne, ¿cuál es el primero?",options:{A:{en:"Faith believes God keeps His promises",es:"La fe cree que Dios cumple Sus promesas"},B:{en:"Faith fights wars",es:"La fe pelea guerras"},C:{en:"Faith builds altars",es:"La fe edifica altares"},D:{en:"Faith memorizes scripture",es:"La fe memoriza la Escritura"}}},
{q_en:"What devotional book does Wayne mention as a catalog of God's promises?",q_es:"¿Qué libro devocional menciona Wayne como catálogo de las promesas de Dios?",options:{A:{en:"Herbert Lockyer, \"All the Promises of the Bible\"",es:"Herbert Lockyer, «Todas las promesas de la Biblia»"},B:{en:"Foxe's Book of Martyrs",es:"Libro de los Mártires de Foxe"},C:{en:"Matthew Henry, \"Commentary on the Whole Bible\"",es:"Matthew Henry, «Comentario de toda la Biblia»"},D:{en:"Oswald Chambers, \"My Utmost\"",es:"Oswald Chambers, «En pos de lo Supremo»"}}},
{q_en:"In Booth's framed-check parable, what was the man's mistake?",q_es:"En la parábola del cheque enmarcado de Booth, ¿cuál fue el error del hombre?",options:{A:{en:"He spent the money too quickly",es:"Gastó el dinero demasiado rápido"},B:{en:"He framed and admired the check but never cashed it",es:"Enmarcó y admiró el cheque pero nunca lo cobró"},C:{en:"He forgot where he put it",es:"Olvidó dónde lo puso"},D:{en:"He gave the check away",es:"Regaló el cheque"}}},
{q_en:"Which two-and-a-half tribes does Wayne note as missing many blessings by staying east of the Jordan?",q_es:"¿Cuáles dos tribus y media nota Wayne que perdieron bendiciones al quedarse al oriente?",options:{A:{en:"Ephraim and the half-tribe of Manasseh",es:"Efraín y la media tribu de Manasés"},B:{en:"Levi, Asher, and Naphtali",es:"Leví, Aser y Neftalí"},C:{en:"Judah, Benjamin, and Simeon",es:"Judá, Benjamín y Simeón"},D:{en:"Reuben, Gad, and the half-tribe of Manasseh",es:"Rubén, Gad y la media tribu de Manasés"}}},
{q_en:"Whose bones were buried in Shechem at the close of the book of Joshua (24:32)?",q_es:"¿Los huesos de quién fueron sepultados en Siquem al cierre del libro (24:32)?",options:{A:{en:"Joseph's",es:"De José"},B:{en:"Moses'",es:"De Moisés"},C:{en:"Eleazar's",es:"De Eleazar"},D:{en:"Aaron's",es:"De Aarón"}}},
{q_en:"How long had Israel been carrying Joseph's bones before they were buried at Shechem?",q_es:"¿Cuánto tiempo había estado Israel cargando los huesos de José antes de ser sepultados?",options:{A:{en:"About four hundred years (since Genesis 50)",es:"Aproximadamente cuatrocientos años (desde Génesis 50)"},B:{en:"Forty years",es:"Cuarenta años"},C:{en:"Forty days",es:"Cuarenta días"},D:{en:"One year",es:"Un año"}}},
{q_en:"How old was Joshua when he died (24:29)?",q_es:"¿Cuántos años tenía Josué al morir (24:29)?",options:{A:{en:"Seventy",es:"Setenta"},B:{en:"Eighty-five",es:"Ochenta y cinco"},C:{en:"One hundred and ten",es:"Ciento diez"},D:{en:"Ninety-nine",es:"Noventa y nueve"}}},
{q_en:"Where was Joshua buried?",q_es:"¿Dónde fue sepultado Josué?",options:{A:{en:"Gilgal",es:"Gilgal"},B:{en:"Hebron",es:"Hebrón"},C:{en:"Shechem",es:"Siquem"},D:{en:"In his own inheritance, Timnath-serah in mount Ephraim",es:"En su propia heredad, Timnat-sera en el monte de Efraín"}}},
{q_en:"What single verdict captures both Caleb's life and Joshua's life across the book?",q_es:"¿Qué veredicto único captura tanto la vida de Caleb como la de Josué en el libro?",options:{A:{en:"\"He was a mighty warrior\"",es:"«Era un poderoso guerrero»"},B:{en:"\"He wholly followed the LORD God of Israel\"",es:"«Cumplió siguiendo a Jehová Dios de Israel»"},C:{en:"\"He led the conquest faithfully\"",es:"«Lideró fielmente la conquista»"},D:{en:"\"He prayed without ceasing\"",es:"«Oraba sin cesar»"}}}
];
const KEY=['A','C','D','B','D','B','D','A','B','A','D','C','A','B','D','A','A','C','D','B'];

const KW=[
{q_en:"State Wayne's three-fold farewell structure of Joshua's last speeches.",q_es:"Enuncia la estructura triple de los adioses de Josué.",
 kw_en:['three','farewell','leader','people','shechem','serve','eastern','speech'], kw_es:['tres','desped','líder','pueblo','siquem','servir','oriental','discurso'],
 modelEn:"Wayne lays out Joshua's farewell in a threefold structure that mirrors Moses' threefold farewell in Deuteronomy. First, Joshua bids farewell to the eastern tribes in chapter 22, the altar of witness. Second, he bids farewell to the leaders, the elders, judges, and officers, in chapter 23. Third, he bids farewell to all the people at Shechem in chapter 24. The purpose of all three speeches is the same: to bring the people to resolve to serve the LORD, climaxing in the challenge, choose you this day whom you will serve.", modelEs:"Wayne expone la despedida de Josué en una estructura triple que refleja la despedida triple de Moisés en Deuteronomio. Primero, Josué se despide de las tribus orientales en el capítulo 22, el altar del testimonio. Segundo, se despide de los líderes, los ancianos, jueces y oficiales, en el capítulo 23. Tercero, se despide de todo el pueblo en Siquem en el capítulo 24. El propósito de los tres discursos es el mismo: llevar al pueblo a resolver servir a Jehová, culminando en el desafío, escogeos hoy a quién serviréis."},
{q_en:"Explain the significance of Shechem as the location for Joshua's final speech.",q_es:"Explica el significado de Siquem como ubicación del último discurso.",
 kw_en:['shechem','abraham','covenant','history','faithfulness','choose','joseph','renew'], kw_es:['siquem','abraham','pacto','histor','fidel','escog','josé','renov'],
 modelEn:"Shechem was the fitting place for Joshua's final speech because it was saturated with covenant history. It was where Abraham first received God's promise of the land, where Jacob buried his foreign gods, and where Joshua had earlier renewed the covenant at Ebal and Gerizim. At Shechem Joshua rehearses the whole story of God's faithfulness from Abraham to the present day, then calls the people to choose whom they will serve. Fittingly, Joseph's bones are buried at Shechem too; the place of covenant memory becomes the place of covenant decision.", modelEs:"Siquem era el lugar idóneo para el discurso final de Josué porque estaba saturado de historia del pacto. Fue donde Abraham recibió primero la promesa de la tierra, donde Jacob enterró sus dioses ajenos, y donde Josué antes había renovado el pacto en Ebal y Gerizim. En Siquem Josué repasa toda la historia de la fidelidad de Dios desde Abraham hasta el día presente, luego llama al pueblo a escoger a quién servirán. Apropiadamente, los huesos de José están sepultados en Siquem también; el lugar de la memoria del pacto se vuelve el lugar de la decisión del pacto."},
{q_en:"Describe Joshua's challenge in 24:15 and the five qualities Wayne identifies.",q_es:"Describe el desafío de Josué y las cinco cualidades que Wayne identifica.",
 kw_en:['choose','daily','honest','exemplary','family','reject','serve','house'], kw_es:['escog','diari','honest','ejemplar','familia','rechaz','servir','casa'],
 modelEn:"Joshua's challenge in 24:15 is, Choose you this day whom you will serve, but as for me and my house, we will serve the LORD. Wayne identifies five qualities of this choice. First, it is daily, since this day is emphatic, a decision made fresh each morning. Second, it is honest, for Joshua names the real alternatives, the gods of Mesopotamia, Egypt, and the Amorites, without softening them. Third, it is exemplary, for Joshua has already chosen and calls the people to join him. Fourth, it is family-wide, me and my house, the household as one unit. Fifth, it is rejectable, if it seem evil unto you, granting the dignity of refusal.", modelEs:"El desafío de Josué en 24:15 es: Escogeos hoy a quién serviréis, pero yo y mi casa serviremos a Jehová. Wayne identifica cinco cualidades de esta elección. Primera, es diaria, pues hoy es enfático, una decisión tomada fresca cada mañana. Segunda, es honesta, pues Josué nombra las alternativas reales, los dioses de Mesopotamia, Egipto y los amorreos, sin suavizarlas. Tercera, es ejemplar, pues Josué ya ha escogido y llama al pueblo a unírsele. Cuarta, es familiar, yo y mi casa, el hogar como una unidad. Quinta, es rechazable, si os parece mal, concediendo la dignidad del rechazo."},
{q_en:"Tell the Von Zealand story and what it teaches about standing up for Christ.",q_es:"Cuenta la historia de Von Zealand y lo que enseña.",
 kw_en:['zealand','frederick','general','blasphem','savio','pardon','silent','stand'], kw_es:['zealand','federico','general','blasfem','salvador','perdón','callad','defender'],
 modelEn:"Wayne's centerpiece illustration reaches into eighteenth-century Prussia. Frederick the Great's greatest general was Von Zealand, a Christian. One day the king was making coarse jokes about the Saviour while his courtiers roared with laughter. It was too much for old Von Zealand. He rose and said he would soon stand before a greater than the king, the mighty God, the Lord Jesus Christ, whom the king was blaspheming, and that he could not bear to hear his Saviour spoken of so. He saluted the king as an old man on the edge of eternity and sat down. Frederick, with a trembling voice, fell silent and said, General Von Zealand, I beg your pardon. The lesson: stand up for Christ.", modelEs:"La ilustración central de Wayne llega a la Prusia del siglo dieciocho. El mayor general de Federico el Grande era Von Zealand, un cristiano. Un día el rey hacía bromas groseras sobre el Salvador mientras sus cortesanos reían a carcajadas. Fue demasiado para el viejo Von Zealand. Se levantó y dijo que pronto estaría ante uno mayor que el rey, el Dios poderoso, el Señor Jesucristo, a quien el rey estaba blasfemando, y que no podía soportar oír hablar así de su Salvador. Saludó al rey como un anciano al borde de la eternidad y se sentó. Federico, con voz temblorosa, se quedó callado y dijo: General Von Zealand, le pido perdón. La lección: hay que defender a Cristo."},
{q_en:"Identify Wayne's seven faith-motifs from the book of Joshua.",q_es:"Identifica los siete motivos de fe de Wayne.",
 kw_en:['seven','faith','promise','possession','wait','worship','sin','prayer'], kw_es:['siete','fe','promesa','posesi','esper','adora','pecado','oración'],
 modelEn:"Wayne pulls seven faith-motifs out of the entire book of Joshua. First, faith in God's promises, trusting the I have given. Second, faith taking possession, going in to occupy what is promised. Third, faith waiting, the long obedience of made war a long time. Fourth, faith worshiping, falling before the Captain on holy ground. Fifth, faith meeting God face to face. Sixth, faith hindered by sin, Achan in the tent. Seventh, faith hindered by lack of prayer, Ai attacked without asking God. Together the seven trace the whole life of faith across the book.", modelEs:"Wayne saca siete motivos de fe del libro entero de Josué. Primero, la fe en las promesas de Dios, confiar en el Yo he entregado. Segundo, la fe tomando posesión, entrar a ocupar lo prometido. Tercero, la fe esperando, la larga obediencia de hizo guerra mucho tiempo. Cuarto, la fe adorando, caer ante el Capitán en tierra santa. Quinto, la fe encontrándose con Dios cara a cara. Sexto, la fe estorbada por el pecado, Acán en la tienda. Séptimo, la fe estorbada por la falta de oración, Hai atacada sin preguntar a Dios. Juntos los siete trazan toda la vida de fe a través del libro."},
{q_en:"Tell the General Booth framed-check parable and its application.",q_es:"Cuenta la parábola del cheque enmarcado de Booth.",
 kw_en:['booth','check','frame','promise','cash','starving','music','claim'], kw_es:['booth','cheque','enmarcar','promesa','cobrar','hambr','música','reclamar'],
 modelEn:"General Booth of the Salvation Army told of a starving man who received a check from a friend promising to pay him a sum of money. Overjoyed, he danced about; then he said he would have the check framed, hung on the wall, and set to music to sing every day. Booth observed that he could frame it and sing it forever, but it would do him no good until he took it and cashed it. So with God's promises: many believers admire and frame the promise without ever claiming it. A promise must be cashed, not just hung on the wall.", modelEs:"El General Booth del Ejército de Salvación contó de un hombre hambriento que recibió un cheque de un amigo prometiéndole pagarle una suma de dinero. Lleno de gozo, bailó; luego dijo que enmarcaría el cheque, lo colgaría en la pared y lo pondría en música para cantarlo cada día. Booth observó que podía enmarcarlo y cantarlo para siempre, pero no le serviría de nada hasta que lo tomara y lo cobrara. Así con las promesas de Dios: muchos creyentes admiran y enmarcan la promesa sin nunca reclamarla. Una promesa debe cobrarse, no solo colgarse en la pared."},
{q_en:"Explain why the two-and-a-half eastern tribes missed many of God's blessings.",q_es:"Explica por qué las dos tribus y media perdieron bendiciones.",
 kw_en:['eastern','tribe','jordan','bless','miss','shepherd','plain','defeat'], kw_es:['oriental','tribu','jordán','bendic','perdi','pastor','llano','derrot'],
 modelEn:"The two-and-a-half eastern tribes, Reuben, Gad, and half-Manasseh, chose to settle on the wrong side of the Jordan. They were shepherds who liked the grassy plains east of the river, so they asked for that land rather than crossing fully into the inheritance. As a result they missed many of God's blessings in the heartland, were cut off from the central place of worship, and were the first tribes to be defeated and carried away when later invasions came. Choosing the comfortable plains over the full inheritance cost them dearly.", modelEs:"Las dos tribus y media orientales, Rubén, Gad y media Manasés, escogieron asentarse en el lado equivocado del Jordán. Eran pastores a quienes gustaban los llanos de pasto al oriente del río, así que pidieron esa tierra en vez de cruzar plenamente a la heredad. Como resultado perdieron muchas de las bendiciones de Dios en el corazón de la tierra, quedaron lejos del lugar central de adoración, y fueron las primeras tribus en ser derrotadas y llevadas cautivas cuando vinieron invasiones posteriores. Escoger los cómodos llanos sobre la heredad plena les costó caro."},
{q_en:"Describe what happened to Joseph's bones and why their burial closes the book.",q_es:"Describe lo que pasó con los huesos de José y por qué su entierro cierra el libro.",
 kw_en:['joseph','bones','egypt','shechem','buried','promise','jacob','inheritance'], kw_es:['josé','hueso','egipto','siquem','sepult','promesa','jacob','heredad'],
 modelEn:"Joseph's bones close the book. Dying in Egypt in Genesis 50, Joseph made Israel swear to carry his bones up when God brought them to the promised land. For four hundred years the embalmed coffin waited; Israel carried it through the Exodus and the wilderness and the conquest. Now, in Joshua 24:32, the bones of Joseph are buried at Shechem, in the parcel of ground Jacob had bought, and it became the inheritance of Joseph's children. A promise made on a deathbed centuries earlier is kept to the letter; the book closes on God's faithfulness to His word.", modelEs:"Los huesos de José cierran el libro. Al morir en Egipto en Génesis 50, José hizo jurar a Israel que llevaría sus huesos cuando Dios los trajera a la tierra prometida. Por cuatrocientos años esperó el ataúd embalsamado; Israel lo cargó por el Éxodo, el desierto y la conquista. Ahora, en Josué 24:32, los huesos de José son sepultados en Siquem, en la parcela que Jacob había comprado, y se volvió la heredad de los hijos de José. Una promesa hecha en un lecho de muerte siglos antes se cumple al pie de la letra; el libro cierra sobre la fidelidad de Dios a Su palabra."},
{q_en:"Summarize Joshua's life-verdict and how it should apply to the believer.",q_es:"Resume el veredicto de la vida de Josué y cómo aplica al creyente.",
 kw_en:['serve','lord','house','verdict','faithful','fought','choose','believe'], kw_es:['servir','jehová','casa','veredicto','fiel','pelea','escog','creyente'],
 modelEn:"Joshua's life-verdict is summed up in his own words: as for me and my house, we will serve the LORD. The whole book testifies that the LORD fought for him; his life had one explanation, and it was not Joshua but the faithful God who kept every promise. The verdict on Joshua is that he served the LORD wholly to the end and led his house to do the same. The application to the believer is direct: like Joshua, each one must choose this day to serve the LORD, and lead his own house in faithful service, trusting the God who fights for His people.", modelEs:"El veredicto de la vida de Josué se resume en sus propias palabras: yo y mi casa serviremos a Jehová. Todo el libro testifica que Jehová peleó por él; su vida tuvo una sola explicación, y no fue Josué sino el Dios fiel que cumplió toda promesa. El veredicto sobre Josué es que sirvió a Jehová por completo hasta el fin y guió a su casa a hacer lo mismo. La aplicación al creyente es directa: como Josué, cada uno debe escoger hoy servir a Jehová, y guiar su propia casa en servicio fiel, confiando en el Dios que pelea por Su pueblo."},
{q_en:"Explain how the Joshua Intensive's seven faith-motifs form a doctrinal summary of the course.",q_es:"Explica cómo los siete motivos de fe forman un resumen doctrinal.",
 kw_en:['seven','faith','motif','doctrin','summary','course','promise','possession'], kw_es:['siete','fe','motivo','doctrin','resum','curso','promesa','posesi'],
 modelEn:"The seven faith-motifs Wayne draws from Joshua serve as the doctrinal summary of the whole Intensive. Faith in God's promises is justification by trusting the I have given; faith taking possession is sanctification, walking in what is already ours; faith waiting is endurance; faith worshiping is the priority of God's presence; faith meeting God face to face is consecration; faith hindered by sin and faith hindered by lack of prayer are the two great obstacles. Together the seven motifs summarize the doctrine the course has taught, from the Jordan crossing to Joshua's farewell.", modelEs:"Los siete motivos de fe que Wayne saca de Josué sirven como el resumen doctrinal de todo el Intensivo. La fe en las promesas de Dios es la justificación por confiar en el Yo he entregado; la fe tomando posesión es la santificación, andar en lo que ya es nuestro; la fe esperando es perseverancia; la fe adorando es la prioridad de la presencia de Dios; la fe encontrándose con Dios cara a cara es consagración; la fe estorbada por el pecado y por la falta de oración son los dos grandes obstáculos. Juntos los siete motivos resumen la doctrina que el curso ha enseñado, del cruce del Jordán al adiós de Josué."}
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
    resultEl.textContent = isEs ? '✓ Unidad aprobada. Haga clic en Certificado.' : '✓ Unit passed. Click Certificate.';
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
    if(ans.length < 60) continue;
    const kws = isEs ? KW[i].kw_es : KW[i].kw_en;
    let hits=0;
    kws.forEach(k=>{ if(kwHit(ans,k)) hits++; });
    if(hits >= 2) c++;
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
      passUnit(isEs ? '✓ ¡APROBADO! '+mcScore+'/20. Curso completo. Abriendo Certificado en 3 segundos…' : '✓ PASSED! '+mcScore+'/20. Course complete. Opening Certificate in 3 seconds…');
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
      passUnit(isEs ? '✓ ¡APROBADO! MC ✓ banco + SA '+saScore+'/10. Curso completo. Abriendo Certificado en 3 segundos…' : '✓ PASSED! MC ✓ banked + SA '+saScore+'/10. Course complete. Opening Certificate in 3 seconds…');
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
    passUnit(isEs ? '✓ ¡APROBADO! MC '+mcScore+'/20 + SA '+saScore+'/10. Curso completo. Abriendo Certificado en 3 segundos…' : '✓ PASSED! MC '+mcScore+'/20 + SA '+saScore+'/10. Course complete. Opening Certificate in 3 seconds…');
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
