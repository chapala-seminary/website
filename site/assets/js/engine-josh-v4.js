/* Exam engine for CTSJosh (shared by 1 unit page).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/josh/unitN.js. */
// CTS Joshua — Unit 4: The Captain of the LORD's Host & the Walls of Jericho (Joshua 5-6). Repaired 2026-05-29.
// MC L3 audit verified | distribution A=B=C=D=5 | split kw_en/kw_es | track gating | MC-persist
(function(){
'use strict';

const UNIT = 4;
const COURSE = 'josh';
const NEXT_UNIT_URL = 'CTSJoshUnit5.html';
const PREV_UNIT_URL = 'CTSJoshUnit3.html';

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
{q_en:"What anchor principle does Joshua 5 teach about preparation for service?",q_es:"¿Qué principio ancla enseña Josué 5 sobre la preparación para el servicio?",options:{A:{en:"Action must always precede contemplation",es:"La acción siempre debe preceder a la contemplación"},B:{en:"Discipline always precedes desire",es:"La disciplina siempre precede al deseo"},C:{en:"God wants us to become something before we can do something",es:"Dios quiere que lleguemos a ser algo antes de que podamos hacer algo"},D:{en:"Strategy is more important than spirituality",es:"La estrategia es más importante que la espiritualidad"}}},
{q_en:"Whose changed life inside prison led another inmate to Christ in Wayne's first illustration?",q_es:"¿La vida cambiada de quién dentro de la prisión llevó a otro recluso a Cristo en la primera ilustración de Wayne?",options:{A:{en:"A pastor named Edwards",es:"Un pastor llamado Edwards"},B:{en:"A holdup man named Roy",es:"Un atracador llamado Roy"},C:{en:"A missionary to China",es:"Un misionero a China"},D:{en:"A Welsh coal miner",es:"Un minero de carbón galés"}}},
{q_en:"When Israel crossed the Jordan, what did the kings of the land conclude (Joshua 5:1)?",q_es:"Cuando Israel cruzó el Jordán, ¿qué concluyeron los reyes de la tierra (Josué 5:1)?",options:{A:{en:"Their heart melted; there was no spirit in them any longer",es:"Su corazón desfalleció; ya no hubo aliento en ellos"},B:{en:"They demanded tribute payments",es:"Exigieron pagos de tributo"},C:{en:"They mobilized for immediate counterattack",es:"Se movilizaron para un contraataque inmediato"},D:{en:"They sought peace negotiations",es:"Buscaron negociaciones de paz"}}},
{q_en:"Why was Israel's first act after crossing the Jordan circumcision rather than attack?",q_es:"¿Por qué fue el primer acto de Israel después de cruzar el Jordán la circuncisión y no el ataque?",options:{A:{en:"To intimidate the Canaanites",es:"Para intimidar a los cananeos"},B:{en:"To lighten travel for the men",es:"Para aligerar el viaje a los varones"},C:{en:"To save provisions for the siege",es:"Para ahorrar provisiones para el sitio"},D:{en:"To renew covenant with God before any battle",es:"Para renovar el pacto con Dios antes de cualquier batalla"}}},
{q_en:"According to John Chapman, what did Jonathan Edwards do for three days before his 'Sinners in the Hands of an Angry God' sermon?",q_es:"Según John Chapman, ¿qué hizo Jonathan Edwards durante tres días antes de su sermón «Pecadores en manos de un Dios airado»?",options:{A:{en:"Fasted and prayed without sleep, crying 'Give me New England!'",es:"Ayunó y oró sin dormir, clamando «¡Dame Nueva Inglaterra!»"},B:{en:"Memorized the entire book of Romans",es:"Memorizó todo el libro de Romanos"},C:{en:"Walked the streets of Northampton in silence",es:"Caminó las calles de Northampton en silencio"},D:{en:"Wrote and rewrote his manuscript twelve times",es:"Escribió y reescribió su manuscrito doce veces"}}},
{q_en:"What changed about Israel's food supply when they entered Canaan (Joshua 5:11–12)?",q_es:"¿Qué cambió respecto al suministro de alimento de Israel al entrar en Canaán (Josué 5:11–12)?",options:{A:{en:"Manna doubled in quantity",es:"El maná se duplicó en cantidad"},B:{en:"Quail returned in greater abundance",es:"Las codornices volvieron en mayor abundancia"},C:{en:"Manna ceased; they ate from the produce of the land",es:"El maná cesó; comieron del fruto de la tierra"},D:{en:"They began fasting permanently",es:"Comenzaron a ayunar permanentemente"}}},
{q_en:"In Aesop's fable, what happened to the gully frog who refused to move?",q_es:"En la fábula de Esopo, ¿qué le pasó a la rana de la zanja que se negó a mudarse?",options:{A:{en:"He grew old and content in his small pool",es:"Envejeció contento en su pequeño charco"},B:{en:"He was crushed by a heavy wagon",es:"Fue aplastado por un carro pesado"},C:{en:"He befriended the pond frog and visited daily",es:"Se hizo amigo de la rana del estanque y la visitaba a diario"},D:{en:"He drowned in a flood",es:"Se ahogó en una inundación"}}},
{q_en:"When Joshua confronted the man with the drawn sword and asked, 'Are you for us or for our adversaries?' what was the answer?",q_es:"Cuando Josué confrontó al varón con la espada desnuda y preguntó: «¿Eres de los nuestros, o de nuestros enemigos?», ¿cuál fue la respuesta?",options:{A:{en:"'I am with you.'",es:"«Estoy contigo»."},B:{en:"'I am against your enemies.'",es:"«Estoy contra tus enemigos»."},C:{en:"'I am Michael the archangel.'",es:"«Soy Miguel el arcángel»."},D:{en:"'No; but as Commander of the army of the LORD I have now come.'",es:"«No; mas como Príncipe del ejército de Jehová he venido ahora»."}}},
{q_en:"According to Wayne, what is the secret of Hudson Taylor's power with God?",q_es:"Según Wayne, ¿cuál es el secreto del poder de Hudson Taylor con Dios?",options:{A:{en:"Fasting one day each week",es:"Ayunar un día cada semana"},B:{en:"Memorizing one chapter of Scripture daily",es:"Memorizar un capítulo de la Escritura diariamente"},C:{en:"Rising at 3 a.m. every morning for an hour alone with God",es:"Levantarse a las 3 a.m. cada mañana por una hora a solas con Dios"},D:{en:"Praying with a partner before every meeting",es:"Orar con un compañero antes de cada reunión"}}},
{q_en:"What single phrase did the regenerate Chicago man repeat as the secret of his transformation?",q_es:"¿Qué frase repitió el hombre regenerado de Chicago como el secreto de su transformación?",options:{A:{en:"'I have studied the Word.'",es:"«He estudiado la Palabra»."},B:{en:"'I have seen Jesus Christ. I have seen Him.'",es:"«He visto a Jesucristo. Le he visto»."},C:{en:"'I have prayed without ceasing.'",es:"«He orado sin cesar»."},D:{en:"'I have learned to surrender.'",es:"«He aprendido a rendirme»."}}},
{q_en:"What New Testament verse does Wayne identify as the best summary of Joshua 6?",q_es:"¿Qué versículo del Nuevo Testamento identifica Wayne como el mejor resumen de Josué 6?",options:{A:{en:"Hebrews 11:30",es:"Hebreos 11:30"},B:{en:"Ephesians 6:12",es:"Efesios 6:12"},C:{en:"Romans 8:31",es:"Romanos 8:31"},D:{en:"2 Corinthians 10:4",es:"2 Corintios 10:4"}}},
{q_en:"What did the flight instructor tell the panicked student pilot?",q_es:"¿Qué le dijo el instructor de vuelo al estudiante piloto en pánico?",options:{A:{en:"'Always trust your altimeter.'",es:"«Siempre confía en tu altímetro»."},B:{en:"'Pull up immediately or you will die.'",es:"«Sube inmediatamente o morirás»."},C:{en:"'Take the controls; I will not help you.'",es:"«Toma los controles; no te ayudaré»."},D:{en:"'There is no position you can get this airplane into that I cannot get you out of.'",es:"«No hay posición en la que puedas poner este avión de la que yo no pueda sacarte»."}}},
{q_en:"Before the first soldier marched, what verb tense did God use when speaking to Joshua about Jericho?",q_es:"Antes de que marchara el primer soldado, ¿qué tiempo verbal usó Dios al hablarle a Josué de Jericó?",options:{A:{en:"Future — 'I will give Jericho into your hand'",es:"Futuro — «Yo daré a Jericó en tu mano»"},B:{en:"Past — 'I have given Jericho into your hand'",es:"Pasado — «Yo he entregado a Jericó en tu mano»"},C:{en:"Conditional — 'If you obey, I will give Jericho'",es:"Condicional — «Si obedeces, daré a Jericó»"},D:{en:"Imperative — 'Take Jericho today'",es:"Imperativo — «Toma a Jericó hoy»"}}},
{q_en:"How many total laps did Israel make around Jericho before the walls fell?",q_es:"¿Cuántas vueltas en total dio Israel alrededor de Jericó antes de que cayeran los muros?",options:{A:{en:"Seven",es:"Siete"},B:{en:"Twenty-one",es:"Veintiuno"},C:{en:"Thirteen",es:"Trece"},D:{en:"Forty",es:"Cuarenta"}}},
{q_en:"Which Pauline passage did Wayne use to anchor the 'foolish plan' of marching around Jericho?",q_es:"¿Qué pasaje paulino usó Wayne para anclar el «plan necio» de marchar alrededor de Jericó?",options:{A:{en:"1 Corinthians 1:26–29",es:"1 Corintios 1:26–29"},B:{en:"Galatians 2:20",es:"Gálatas 2:20"},C:{en:"Romans 12:1–2",es:"Romanos 12:1–2"},D:{en:"Ephesians 2:8–9",es:"Efesios 2:8–9"}}},
{q_en:"What did the simple woman of great calmness call herself when asked the secret of her faith?",q_es:"¿Cómo se llamó a sí misma la mujer sencilla de gran calma cuando le preguntaron el secreto de su fe?",options:{A:{en:"'A woman who has died to self.'",es:"«Una mujer que ha muerto a sí misma»."},B:{en:"'A woman who has wrestled with God.'",es:"«Una mujer que ha luchado con Dios»."},C:{en:"'A woman with mountain-moving faith.'",es:"«Una mujer con fe que mueve montañas»."},D:{en:"'A woman with little faith in the great God.'",es:"«Una mujer con poca fe en el gran Dios»."}}},
{q_en:"In the drowned-duck story, who did Dallas finally confess to in order to break his sister's blackmail?",q_es:"En la historia del pato ahogado, ¿a quién finalmente confesó Dallas para romper el chantaje de su hermana?",options:{A:{en:"His mother",es:"Su madre"},B:{en:"His father",es:"Su padre"},C:{en:"His pastor",es:"Su pastor"},D:{en:"The neighbor",es:"El vecino"}}},
{q_en:"Who is Assad in Wayne's 'second Jericho' illustration?",q_es:"¿Quién es Assad en la ilustración del «segundo Jericó» de Wayne?",options:{A:{en:"A Hebrew soldier under Joshua",es:"Un soldado hebreo bajo Josué"},B:{en:"A Muslim convert from Damascus",es:"Un converso musulmán de Damasco"},C:{en:"A timid Christian leader interrogated by the secret police",es:"Un líder cristiano tímido interrogado por la policía secreta"},D:{en:"A Roman centurion at Caesarea",es:"Un centurión romano en Cesarea"}}},
{q_en:"What tragic mistake did the April 1988 skydiver-photographer make?",q_es:"¿Qué error trágico cometió el paracaidista-fotógrafo de abril de 1988?",options:{A:{en:"He pulled the ripcord too early",es:"Tiró de la cuerda demasiado pronto"},B:{en:"He filmed in the wrong direction",es:"Filmó en la dirección equivocada"},C:{en:"He collided with another skydiver",es:"Chocó con otro paracaidista"},D:{en:"He jumped without buckling on a parachute",es:"Saltó sin abrocharse un paracaídas"}}},
{q_en:"According to F. B. Meyer, what are the two things we do not know about a brother or sister in sin?",q_es:"Según F. B. Meyer, ¿cuáles son las dos cosas que no sabemos sobre un hermano o hermana en pecado?",options:{A:{en:"The depth of their hidden guilt and the duration of their rebellion",es:"La profundidad de su culpa oculta y la duración de su rebelión"},B:{en:"How hard they tried not to sin and the power of the forces that assailed them",es:"Cuán duro trataron de no pecar y el poder de las fuerzas que los asaltaron"},C:{en:"The shape of God's discipline and the length of their punishment",es:"La forma de la disciplina de Dios y la duración de su castigo"},D:{en:"The strength of their conscience and the size of their reward",es:"La fuerza de su conciencia y el tamaño de su recompensa"}}}
];
const KEY = ['C','B','A','D','A','C','B','D','C','B','A','D','B','C','A','D','A','C','D','B'];

// SA: split kw_en/kw_es (was pooled: first 5 EN, last 5 ES)
const KW=[{"q_en": "State the central principle of Joshua 5 that frames the entire unit.", "q_es": "Enuncia el principio central de Josué 5 que enmarca toda la unidad.", "kw_en": ["become", "before", "something", "do", "god", "prepar", "consecrat", "servant"], "kw_es": ["llegar", "antes", "hacer", "algo", "dios", "prepar", "consagr", "siervo"], "modelEn": "The central principle of Joshua 5 is that God wants us to become something before we do something. Before Israel could do the battle of Jericho, God had them become a prepared, consecrated people — renewing the covenant, keeping Passover, meeting the Captain. Being precedes doing; God shapes the servant before He sends him into the work.", "modelEs": "El principio central de Josué 5 es que Dios quiere que lleguemos a ser algo antes de hacer algo. Antes de que Israel pudiera hacer la batalla de Jericó, Dios los hizo llegar a ser un pueblo preparado y consagrado — renovando el pacto, guardando la Pascua, encontrando al Capitán. El ser precede al hacer; Dios forma al siervo antes de enviarlo a la obra."}, {"q_en": "Identify the four 'becoming' steps Joshua 5 lays out before the battle of Jericho.", "q_es": "Identifica los cuatro pasos de «llegar a ser» que Josué 5 establece antes de la batalla de Jericó.", "kw_en": ["testimony", "prepar", "change", "face", "meet", "circumcis", "manna", "covenant"], "kw_es": ["testimonio", "preparado", "cambi", "cara", "encontr", "circuncis", "maná", "pacto"], "modelEn": "Joshua 5 lays out four steps of becoming before the doing of battle. First, their testimony went ahead of them — the kings' hearts melted when they heard. Second, they were prepared inwardly through the renewed covenant of circumcision. Third, their diet changed as the manna ceased and they ate the produce of the land. Fourth, Joshua was brought to meet the Captain of the LORD's host face to face. Each step formed the people before the battle.", "modelEs": "Josué 5 establece cuatro pasos de llegar a ser antes del hacer de la batalla. Primero, su testimonio fue delante de ellos — el corazón de los reyes desfalleció al oírlo. Segundo, fueron preparados por dentro mediante el pacto renovado de la circuncisión. Tercero, su comida cambió cuando el maná cesó y comieron del fruto de la tierra. Cuarto, Josué encontró cara a cara al Capitán del ejército de Jehová. Cada paso formó al pueblo antes de la batalla."}, {"q_en": "Summarize the role of circumcision and Passover in Joshua 5:2–10.", "q_es": "Resume el papel de la circuncisión y la Pascua en Josué 5:2–10.", "kw_en": ["covenant", "renew", "circumcis", "passover", "sign", "generation", "redemption", "consecrat"], "kw_es": ["pacto", "renov", "circuncis", "pascua", "señal", "generaci", "redenci", "consagr"], "modelEn": "In Joshua 5:2–10 the new generation is circumcised and then keeps the Passover. Circumcision renews the covenant sign that had lapsed in the wilderness, marking them again as God's covenant people. The Passover remembers their redemption from Egypt. Together they restore the covenant relationship before the conquest — the sign on the body and the meal of remembrance preparing a consecrated people.", "modelEs": "En Josué 5:2–10 la nueva generación es circuncidada y luego guarda la Pascua. La circuncisión renovó la señal del pacto que se había suspendido en el desierto, marcándolos de nuevo como pueblo del pacto de Dios. La Pascua recuerda su redención de Egipto. Juntas restauran la relación del pacto antes de la conquista — la señal en el cuerpo y la cena del recuerdo preparando a un pueblo consagrado."}, {"q_en": "Describe what Aesop's two-frogs story teaches about resistance to change.", "q_es": "Describe lo que la historia de las dos ranas de Esopo enseña sobre la resistencia al cambio.", "kw_en": ["frog", "gully", "wagon", "change", "refuse", "comfort", "crush", "fatal"], "kw_es": ["rana", "zanja", "carro", "cambi", "negar", "comod", "aplast", "fatal"], "modelEn": "Aesop's story has two frogs: one in a pond, one in a gully on the road. The pond frog urges the gully frog to move to safety, but the gully frog refuses to change, insisting he is comfortable where he is. A heavy wagon comes down the road and crushes him. The fable teaches that refusing to change, clinging to comfort, can be fatal — Israel had to be willing to change to enter what God had for them.", "modelEs": "La historia de Esopo tiene dos ranas: una en un estanque, otra en una zanja del camino. La rana del estanque insta a la rana de la zanja a moverse a un lugar seguro, pero la rana de la zanja se niega a cambiar, insistiendo en que está cómoda. Un carro pesado baja por el camino y la aplasta. La fábula enseña que negarse a cambiar, aferrándose a la comodidad, puede ser fatal — Israel tuvo que estar dispuesto a cambiar."}, {"q_en": "Explain what the encounter with the Captain of the LORD's host (Joshua 5:13–15) reveals about Joshua's leadership.", "q_es": "Explica lo que el encuentro con el Capitán del ejército de Jehová (Josué 5:13–15) revela sobre el liderazgo de Josué.", "kw_en": ["captain", "host", "sandal", "holy", "worship", "sword", "commander", "submit"], "kw_es": ["capitán", "ejército", "sandalia", "santa", "adorar", "espada", "príncipe", "somet"], "modelEn": "When Joshua met the man with the drawn sword, he asked whose side he was on. The answer was 'No; but as Commander of the army of the LORD I have now come.' Joshua fell on his face to worship and was told to remove his sandal, for the ground was holy. The encounter reveals that the true leader is first a worshiper: Joshua does not command the Captain of the host but submits to Him, learning the battle is the LORD's.", "modelEs": "Cuando Josué encontró al varón con la espada desnuda, preguntó de qué lado estaba. La respuesta fue: «No; mas como Príncipe del ejército de Jehová he venido ahora». Josué cayó sobre su rostro para adorar y se le mandó quitar la sandalia, porque la tierra era santa. El encuentro revela que el verdadero líder es primero un adorador: Josué no manda al Capitán del ejército sino que se somete a Él."}, {"q_en": "State why Hebrews 11:30 is the New Testament summary of Joshua 6.", "q_es": "Enuncia por qué Hebreos 11:30 es el resumen del Nuevo Testamento de Josué 6.", "kw_en": ["faith", "walls", "jericho", "encircled", "fell", "obedient", "march", "triumph"], "kw_es": ["fe", "muros", "jericó", "rodear", "cayeron", "obedien", "marcha", "triunfo"], "modelEn": "Hebrews 11:30 is the New Testament summary of Joshua 6: 'By faith the walls of Jericho fell down after they were encircled for seven days.' It names the cause the narrative only shows — faith. The walls did not fall by military force but by faith expressed in obedient marching. Hebrews puts Jericho in the great roll call of faith, reading the conquest as a triumph of believing God.", "modelEs": "Hebreos 11:30 es el resumen del Nuevo Testamento de Josué 6: «Por la fe cayeron los muros de Jericó después de rodearlos siete días.» Nombra la causa que la narrativa solo muestra — la fe. Los muros no cayeron por fuerza militar sino por fe expresada en una marcha obediente. Hebreos pone a Jericó en la gran lista de la fe, leyendo la conquista como un triunfo de creer a Dios."}, {"q_en": "Explain the significance of God's past-tense statement, 'I have given Jericho into your hand' (Joshua 6:2).", "q_es": "Explica la significancia de la declaración en pasado de Dios: «Yo he entregado a Jericó en tu mano» (Josué 6:2).", "kw_en": ["given", "past", "tense", "victory", "before", "obedience", "settled", "march"], "kw_es": ["entregado", "pasado", "tiempo", "victoria", "antes", "obedien", "decidido", "marcha"], "modelEn": "God says, 'I have given Jericho into your hand' — past tense, before a single soldier marched. The victory was already accomplished in God's purpose before Israel acted. The past tense teaches that obedience does not earn the victory; it walks out a victory God has already given. Faith marches because the outcome is settled, not to make it settled.", "modelEs": "Dios dice: «Yo he entregado a Jericó en tu mano» — tiempo pasado, antes de que marchara un solo soldado. La victoria ya estaba consumada en el propósito de Dios antes de que Israel actuara. El tiempo pasado enseña que la obediencia no gana la victoria; camina una victoria que Dios ya ha entregado. La fe marcha porque el resultado está decidido, no para decidirlo."}, {"q_en": "Describe how 1 Corinthians 1:26–29 frames God's 'foolish plan' at Jericho.", "q_es": "Describe cómo 1 Corintios 1:26–29 enmarca el «plan necio» de Dios en Jericó.", "kw_en": ["foolish", "weak", "shame", "boast", "chose", "wise", "strong", "flesh"], "kw_es": ["necio", "débil", "avergonzar", "gloriar", "escogió", "sabio", "fuerte", "gritar"], "modelEn": "First Corinthians 1:26–29 frames the foolish plan of marching around Jericho. God chose the foolish things to shame the wise and the weak things to shame the strong, so that no one may boast before Him. Marching and shouting looks militarily foolish, but God works that way on purpose — so the victory is unmistakably His and no flesh can boast.", "modelEs": "Primera de Corintios 1:26–29 enmarca el plan necio de marchar alrededor de Jericó. Dios escogió lo necio para avergonzar a lo sabio y lo débil para avergonzar a lo fuerte, para que nadie se gloríe delante de Él. Marchar y gritar parece militarmente necio, pero Dios obra así a propósito — para que la victoria sea inconfundiblemente Suya y nadie pueda gloriarse."}, {"q_en": "Identify the two 'Jerichos' believers still face according to Wayne, and how God grants victory in each.", "q_es": "Identifica los dos «Jericós» que los creyentes aún enfrentan según Wayne, y cómo Dios da la victoria en cada uno.", "kw_en": ["sin", "trouble", "faith", "victory", "duck", "confess", "hidden", "march"], "kw_es": ["pecado", "prueba", "fe", "victoria", "pato", "confes", "oculto", "marcha"], "modelEn": "Wayne names two Jerichos believers still face. The first is the Jericho of besetting sin — like the boy in the drowned-duck story, victory comes when hidden sin is confessed and dragged into the open. The second is the Jericho of trouble or trial — victory comes by faith, marching in obedience until God brings the walls down. In both, the victory is God's, received by confession and by faith.", "modelEs": "Wayne nombra dos Jericós que los creyentes aún enfrentan. El primero es el Jericó del pecado dominante — como el niño de la historia del pato ahogado, la victoria viene cuando el pecado oculto se confiesa y se saca a la luz. El segundo es el Jericó de la prueba o tribulación — la victoria viene por la fe, marchando en obediencia hasta que Dios derriba los muros. En ambos, la victoria es de Dios, recibida por confesión y por fe."}, {"q_en": "Summarize F. B. Meyer's two cautions about a brother or sister in sin.", "q_es": "Resume las dos cautelas de F. B. Meyer sobre un hermano o hermana en pecado.", "kw_en": ["tried", "forces", "assailed", "meyer", "humility", "judge", "compassion", "hidden"], "kw_es": ["trató", "fuerzas", "asalt", "humildad", "meyer", "juzgar", "compasión", "oculto"], "modelEn": "F. B. Meyer gives two cautions about judging a brother or sister in sin: we do not know how hard they tried not to fall, and we do not know the power of the forces that assailed them. Because both are hidden from us, we must judge with humility and compassion rather than contempt. The one who stands could not see the pressure the fallen one faced.", "modelEs": "F. B. Meyer da dos cautelas sobre juzgar a un hermano o hermana en pecado: no sabemos cuán duro trató de no caer, ni sabemos el poder de las fuerzas que lo asaltaron. Como ambas cosas nos están ocultas, debemos juzgar con humildad y compasión en vez de desprecio. El que está en pie no pudo ver la presión que enfrentó el caído."}];

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
    resultEl.textContent = isEs ? '✓ Unidad ya aprobada. Haga clic en Unidad 6.' : '✓ Unit already passed. Click Unit 6.';
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
