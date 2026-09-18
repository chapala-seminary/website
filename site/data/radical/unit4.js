/* CTSRadical - unit 4: per-unit configuration and content. */

const UNIT = 4;

const PREV_URL = 'CTSRadicalUnit3.html';

const NEXT_URL = 'CTSRadicalUnit5.html';

const PROGRESS_KEY = 'cts_radical_progress';

const MC_PASS_KEY = `cts_radical_u${UNIT}_mc_passed`;

const SA_LOCK_KEY = `cts_radical_u${UNIT}_sa_lockout`;

const mcQuestions = [
  // A correct (correct: 0)
  {
    text_en: '1. The Greek word <em>homoia</em> in Matthew 22:39 means:',
    text_es: '1. La palabra griega <em>homoia</em> en Mateo 22:39 significa:',
    options_en: ['"Of the same kind / like it"', '"Second in rank"', '"Dependent upon the first"', '"Less important but related"'],
    options_es: ['"De la misma clase / semejante"', '"Segundo en rango"', '"Dependiente del primero"', '"Menos importante pero relacionado"'],
    correct: 0,
    correctFeedback_en: 'Correct. Homoia means "of the same kind." Jesus places both commandments on equal footing — not a hierarchy but a single architecture.',
    correctFeedback_es: 'Correcto. Homoia significa "de la misma clase." Jesús coloca ambos mandamientos en el mismo nivel, no como jerarquía sino como una sola arquitectura.',
    incorrectFeedback_en: 'The Greek homoia means "of the same kind." Jesus refuses to rank the two commandments; they are structurally equal in their claim on the disciple\'s life.',
    incorrectFeedback_es: 'El griego homoia significa "de la misma clase." Jesús se niega a jerarquizar los dos mandamientos; son estructuralmente iguales en su demanda sobre la vida del discípulo.'
  },
  {
    text_en: '2. According to 1 John 4:20, a person who claims to love God but hates his brother is:',
    text_es: '2. Según 1 Juan 4:20, una persona que dice amar a Dios pero aborrece a su hermano es:',
    options_en: ['In need of better teaching', 'Deceived but sincere', 'Spiritually immature', 'A liar'],
    options_es: ['En necesidad de mejor enseñanza', 'Engañado pero sincero', 'Espiritualmente inmaduro', 'Un mentiroso'],
    correct: 3,
    correctFeedback_en: 'Correct. John is blunt: "he is a liar." The proof of love for the invisible God is love for the visible brother.',
    correctFeedback_es: 'Correcto. Juan es directo: "es mentiroso." La prueba del amor al Dios invisible es el amor al hermano visible.',
    incorrectFeedback_en: 'John uses direct language: "he is a liar." The claim to love God is disproved by hatred of the brother we can see (1 John 4:20).',
    incorrectFeedback_es: 'Juan usa un lenguaje directo: "es mentiroso." La afirmación de amar a Dios queda refutada por el odio al hermano que podemos ver (1 Jn. 4:20).'
  },
  {
    text_en: '3. In the Good Samaritan parable, who passed the wounded man first?',
    text_es: '3. En la parábola del Buen Samaritano, ¿quién pasó primero junto al herido?',
    options_en: ['A Levite', 'A priest', 'A Samaritan', 'A Roman soldier'],
    options_es: ['Un levita', 'Un sacerdote', 'Un samaritano', 'Un soldado romano'],
    correct: 1,
    correctFeedback_en: 'Correct. The priest came first, then the Levite — both religious professionals who passed by on the other side.',
    correctFeedback_es: 'Correcto. El sacerdote vino primero, luego el levita — ambos profesionales religiosos que pasaron por el otro lado.',
    incorrectFeedback_en: 'The priest came first (Luke 10:31). Then the Levite (v. 32). The Samaritan — the cultural outsider — was last and the only one who stopped.',
    incorrectFeedback_es: 'El sacerdote vino primero (Lc. 10:31). Luego el levita (v. 32). El samaritano — el forastero cultural — fue el último y el único que se detuvo.'
  },
  {
    text_en: '4. The "royal law" of James 2:8 commands us to:',
    text_es: '4. La "ley real" de Santiago 2:8 nos manda a:',
    options_en: ['Keep the Sabbath holy', 'Honor the king\'s authority', 'Love your neighbor as yourself', 'Bring tithes to the temple'],
    options_es: ['Santificar el sábado', 'Honrar la autoridad del rey', 'Amar a tu prójimo como a ti mismo', 'Traer los diezmos al templo'],
    correct: 2,
    correctFeedback_en: 'Correct. James 2:8 identifies "love your neighbor as yourself" as the royal law — the sovereign command of the King.',
    correctFeedback_es: 'Correcto. Santiago 2:8 identifica "amarás a tu prójimo como a ti mismo" como la ley real — el mandato soberano del Rey.',
    incorrectFeedback_en: 'The royal law in James 2:8 is: "You shall love your neighbor as yourself." It is called royal because it is the law of the King himself.',
    incorrectFeedback_es: 'La ley real en Santiago 2:8 es: "Amarás a tu prójimo como a ti mismo." Se llama real porque es la ley del propio Rey.'
  },
  {
    text_en: '5. According to James 2:9, the most common violation of the royal law is:',
    text_es: '5. Según Santiago 2:9, la violación más común de la ley real es:',
    options_en: ['Speaking evil of others', 'Violence toward neighbors', 'Coveting a neighbor\'s goods', 'Partiality'],
    options_es: ['Hablar mal de otros', 'La violencia hacia los vecinos', 'Codiciar los bienes del prójimo', 'La parcialidad'],
    correct: 3,
    correctFeedback_en: 'Correct. James 2:9 names partiality — treating people differently based on wealth or status — as the primary way the royal law is broken.',
    correctFeedback_es: 'Correcto. Santiago 2:9 nombra la parcialidad — tratar a las personas de manera diferente según su riqueza o estatus — como la forma principal en que se viola la ley real.',
    incorrectFeedback_en: 'James 2:9 identifies partiality as the key violation: "if you show partiality, you commit sin." Choosing faces over need is the most common failure of neighbor-love.',
    incorrectFeedback_es: 'Santiago 2:9 identifica la parcialidad como la violación clave: "si hacéis acepción de personas, coméis pecado." Elegir rostros sobre necesidad es el fracaso más común del amor al prójimo.'
  },
  // B correct (correct: 1)
  {
    text_en: '6. Matthew 22:39 quotes which Old Testament verse?',
    text_es: '6. Mateo 22:39 cita ¿qué versículo del Antiguo Testamento?',
    options_en: ['Deuteronomy 6:5', 'Exodus 20:13', 'Leviticus 19:18', 'Psalm 119:105'],
    options_es: ['Deuteronomio 6:5', 'Éxodo 20:13', 'Levítico 19:18', 'Salmo 119:105'],
    correct: 2,
    correctFeedback_en: 'Correct. "Love your neighbor as yourself" comes from Leviticus 19:18 — a commandment Israel received at Sinai.',
    correctFeedback_es: 'Correcto. "Amarás a tu prójimo como a ti mismo" proviene de Levítico 19:18 — un mandamiento que Israel recibió en el Sinaí.',
    incorrectFeedback_en: 'Matt. 22:39 quotes Leviticus 19:18. Deuteronomy 6:5 is the source for the first great commandment (love God with all your heart).',
    incorrectFeedback_es: 'Mat. 22:39 cita Levítico 19:18. Deuteronomio 6:5 es la fuente del primer gran mandamiento (amar a Dios con todo tu corazón).'
  },
  {
    text_en: '7. In the Good Samaritan parable, who ultimately helped the wounded man?',
    text_es: '7. En la parábola del Buen Samaritano, ¿quién ayudó finalmente al herido?',
    options_en: ['The priest', 'A Samaritan', 'The Levite', 'The innkeeper alone'],
    options_es: ['El sacerdote', 'Un samaritano', 'El levita', 'Solo el posadero'],
    correct: 1,
    correctFeedback_en: 'Correct. The Samaritan — a cultural enemy of the Jews — stopped, gave first aid, transported the man, and paid for his ongoing care.',
    correctFeedback_es: 'Correcto. El samaritano — enemigo cultural de los judíos — se detuvo, dio primeros auxilios, transportó al hombre y pagó por su cuidado continuo.',
    incorrectFeedback_en: 'The Samaritan stopped and helped (Luke 10:33-35). The priest and Levite both passed by. Jesus chose the despised outsider as the model of neighbor-love.',
    incorrectFeedback_es: 'El samaritano se detuvo y ayudó (Lc. 10:33-35). El sacerdote y el levita pasaron de largo. Jesús eligió al forastero despreciado como modelo de amor al prójimo.'
  },
  {
    text_en: '8. The commandment "You shall not murder" is:',
    text_es: '8. El mandamiento "No matarás" es:',
    options_en: ['The sixth commandment', 'The fifth commandment', 'The seventh commandment', 'The fourth commandment'],
    options_es: ['El sexto mandamiento', 'El quinto mandamiento', 'El séptimo mandamiento', 'El cuarto mandamiento'],
    correct: 0,
    correctFeedback_en: 'Correct. The sixth commandment — "You shall not murder" — guards your neighbor\'s life.',
    correctFeedback_es: 'Correcto. El sexto mandamiento — "No matarás" — protege la vida de tu prójimo.',
    incorrectFeedback_en: 'The sixth commandment is "You shall not murder." The fifth is "Honor your father and mother," the seventh is "You shall not commit adultery."',
    incorrectFeedback_es: 'El sexto mandamiento es "No matarás." El quinto es "Honra a tu padre y a tu madre," el séptimo es "No cometerás adulterio."'
  },
  {
    text_en: '9. The second tablet of the Ten Commandments (5–10) primarily guards your neighbor\'s:',
    text_es: '9. La segunda tabla de los Diez Mandamientos (5–10) protege principalmente:',
    options_en: ['Relationship with God', 'Access to the temple', 'Sabbath observance', 'Life, family, property, reputation, and peace'],
    options_es: ['La relación del prójimo con Dios', 'El acceso al templo', 'La observancia del sábado', 'La vida, familia, propiedad, reputación y paz del prójimo'],
    correct: 3,
    correctFeedback_en: 'Correct. The second tablet is a series of protections: life (6th), marriage (7th), property (8th), reputation (9th), peace (10th) — and family structure (5th).',
    correctFeedback_es: 'Correcto. La segunda tabla es una serie de protecciones: vida (6.º), matrimonio (7.º), propiedad (8.º), reputación (9.º), paz (10.º) — y estructura familiar (5.º).',
    incorrectFeedback_en: 'The second tablet guards your neighbor\'s life, marriage, property, reputation, and peace. Each negative command is a positive duty to protect what belongs to your neighbor.',
    incorrectFeedback_es: 'La segunda tabla protege la vida, el matrimonio, la propiedad, la reputación y la paz de tu prójimo. Cada mandamiento negativo es un deber positivo de proteger lo que pertenece al prójimo.'
  },
  {
    text_en: '10. The Samaritan gave the innkeeper two denarii and also promised to:',
    text_es: '10. El samaritano dio al posadero dos denarios y también prometió:',
    options_en: ['Return within three days with servants', 'Repay any additional costs upon his return', 'Send money through a messenger', 'Report the robbery to Roman authorities'],
    options_es: ['Regresar en tres días con siervos', 'Pagar cualquier costo adicional a su regreso', 'Enviar dinero por un mensajero', 'Reportar el robo a las autoridades romanas'],
    correct: 1,
    correctFeedback_en: 'Correct. "Whatever more you spend, when I come back, I will repay you" (Luke 10:35). The Samaritan wrote a blank check for a stranger\'s recovery.',
    correctFeedback_es: 'Correcto. "Y todo lo que gastes de más, yo te lo pagaré cuando regrese" (Lc. 10:35). El samaritano firmó un cheque en blanco para la recuperación de un extraño.',
    incorrectFeedback_en: 'The Samaritan\'s promise was open-ended: "Whatever more you spend, when I come back, I will repay you." He committed to an unknown future cost for someone he had never met.',
    incorrectFeedback_es: 'La promesa del samaritano fue abierta: "Todo lo que gastes de más, yo te lo pagaré cuando regrese." Se comprometió a un costo futuro desconocido para alguien que nunca había conocido.'
  },
  // C correct (correct: 2)
  {
    text_en: '11. Jesus said that all the Law and the Prophets "hang on":',
    text_es: '11. Jesús dijo que toda la ley y los profetas "dependen de":',
    options_en: ['The Ten Commandments alone', 'Faith in the coming Messiah', 'The two great commandments', 'The Sermon on the Mount'],
    options_es: ['Solo los Diez Mandamientos', 'La fe en el Mesías venidero', 'Los dos grandes mandamientos', 'El Sermón del Monte'],
    correct: 2,
    correctFeedback_en: 'Correct. Matthew 22:40 — "On these two commandments hang all the Law and the Prophets." Every command in Scripture flows from loving God and neighbor.',
    correctFeedback_es: 'Correcto. Mateo 22:40 — "De estos dos mandamientos dependen toda la ley y los profetas." Todo mandamiento en la Escritura fluye de amar a Dios y al prójimo.',
    incorrectFeedback_en: 'Matt. 22:40 says all the Law and the Prophets hang on the two great commandments — love God, love neighbor. Every other command is downstream of these two.',
    incorrectFeedback_es: 'Mat. 22:40 dice que toda la ley y los profetas dependen de los dos grandes mandamientos — amar a Dios y amar al prójimo. Todo otro mandamiento es derivado de estos dos.'
  },
  {
    text_en: '12. The lawyer who asked "Who is my neighbor?" wanted to:',
    text_es: '12. El abogado que preguntó "¿Y quién es mi prójimo?" quería:',
    options_en: ['Narrow and limit who he was obligated to love', 'Understand which Gentiles were included', 'Receive Jesus\' commendation for his piety', 'Open the commandment to include foreigners'],
    options_es: ['Reducir y limitar a quién estaba obligado a amar', 'Entender qué gentiles estaban incluidos', 'Recibir el elogio de Jesús por su piedad', 'Abrir el mandamiento para incluir a los extranjeros'],
    correct: 0,
    correctFeedback_en: 'Correct. Luke 10:29 says he asked "wanting to justify himself" — he wanted a definition narrow enough to excuse him from inconvenient neighbors.',
    correctFeedback_es: 'Correcto. Lucas 10:29 dice que preguntó "queriendo justificarse a sí mismo" — quería una definición lo suficientemente estrecha para excusarlo de prójimos inconvenientes.',
    incorrectFeedback_en: 'Luke 10:29 says the lawyer wanted "to justify himself." He was trying to narrow the definition — to find who did NOT qualify as his neighbor.',
    incorrectFeedback_es: 'Lucas 10:29 dice que el abogado quería "justificarse a sí mismo." Intentaba reducir la definición — encontrar quién NO calificaba como su prójimo.'
  },
  {
    text_en: '13. According to Romans 13:10, love does no:',
    text_es: '13. Según Romanos 13:10, el amor no hace:',
    options_en: ['Service to those who deserve judgment', 'Good to those who oppose it', 'Violence to the enemy', 'Harm to a neighbor'],
    options_es: ['Servicio a quienes merecen juicio', 'Bien a quienes se le oponen', 'Violencia al enemigo', 'Mal al prójimo'],
    correct: 3,
    correctFeedback_en: 'Correct. Romans 13:10 — "Love does no harm to a neighbor; therefore love is the fulfillment of the law."',
    correctFeedback_es: 'Correcto. Romanos 13:10 — "El amor no hace mal al prójimo; así que el cumplimiento de la ley es el amor."',
    incorrectFeedback_en: 'Romans 13:10 says "love does no harm to a neighbor; therefore love is the fulfillment of the law." Every commandment in the second tablet is an expression of this.',
    incorrectFeedback_es: 'Romanos 13:10 dice "el amor no hace mal al prójimo; así que el cumplimiento de la ley es el amor." Cada mandamiento en la segunda tabla es una expresión de esto.'
  },
  {
    text_en: '14. James specifically calls "love your neighbor as yourself" the:',
    text_es: '14. Santiago llama específicamente a "amarás a tu prójimo como a ti mismo":',
    options_en: ['Greatest commandment', 'Royal law', 'First commandment', 'Golden rule'],
    options_es: ['El gran mandamiento', 'La ley real', 'El primer mandamiento', 'La regla de oro'],
    correct: 1,
    correctFeedback_en: 'Correct. James 2:8 calls it the "royal law" — nomos basilikon in Greek — the sovereign command of the King.',
    correctFeedback_es: 'Correcto. Santiago 2:8 lo llama "la ley real" — nomos basilikon en griego — el mandato soberano del Rey.',
    incorrectFeedback_en: 'James 2:8 specifically calls it the "royal law" — from basilikon, meaning kingly. It is the law of the King, binding on all subjects of the kingdom.',
    incorrectFeedback_es: 'Santiago 2:8 específicamente lo llama la "ley real" — de basilikon, que significa real. Es la ley del Rey, vinculante para todos los súbditos del reino.'
  },
  {
    text_en: '15. The Greek word <em>basilikon</em> in James 2:8 means:',
    text_es: '15. La palabra griega <em>basilikon</em> en Santiago 2:8 significa:',
    options_en: ['Kingly or of the sovereign', 'Beautiful or glorious', 'Biblical or scripture-based', 'Binding on all people'],
    options_es: ['Real o del soberano', 'Hermoso o glorioso', 'Bíblico o basado en la Escritura', 'Vinculante para todos'],
    correct: 0,
    correctFeedback_en: 'Correct. Basilikon comes from basileus (king). The royal law is the king\'s law — sovereign, not optional.',
    correctFeedback_es: 'Correcto. Basilikon proviene de basileus (rey). La ley real es la ley del rey — soberana, no opcional.',
    incorrectFeedback_en: 'Basilikon comes from basileus, meaning king. The "royal law" is the law of the King — not a suggestion but a sovereign command.',
    incorrectFeedback_es: 'Basilikon proviene de basileus, que significa rey. La "ley real" es la ley del Rey — no una sugerencia sino un mandato soberano.'
  },
  // D correct (correct: 3)
  {
    text_en: '16. Jesus changed the lawyer\'s question from "Who is my neighbor?" to:',
    text_es: '16. Jesús cambió la pregunta del abogado de "¿Y quién es mi prójimo?" a:',
    options_en: ['"How much love must I give?"', '"Who is my enemy?"', '"Who became a neighbor?"', '"How do I qualify as righteous?"'],
    options_es: ['"¿Cuánto amor debo dar?"', '"¿Quién es mi enemigo?"', '"¿Quién se hizo prójimo?"', '"¿Cómo me califico como justo?"'],
    correct: 2,
    correctFeedback_en: 'Correct. Jesus asked: "Which of the three was a neighbor to the man?" He shifted from category (who qualifies) to conduct (who showed love).',
    correctFeedback_es: 'Correcto. Jesús preguntó: "¿Cuál de estos tres te parece que fue el prójimo del que cayó?" Cambió de categoría (quién califica) a conducta (quién mostró amor).',
    incorrectFeedback_en: 'Jesus changed the question. The lawyer asked "Who is my neighbor?" — seeking to limit obligation. Jesus asked "Who became a neighbor?" — demanding conduct, not classification.',
    incorrectFeedback_es: 'Jesús cambió la pregunta. El abogado preguntó "¿Y quién es mi prójimo?" — buscando limitar la obligación. Jesús preguntó "¿Quién se hizo prójimo?" — exigiendo conducta, no clasificación.'
  },
  {
    text_en: '17. The commandment "You shall not covet" primarily protects your neighbor\'s:',
    text_es: '17. El mandamiento "No codiciarás" protege principalmente:',
    options_en: ['Peace and contentment', 'Marriage and family', 'Property and possessions', 'Life and physical safety'],
    options_es: ['La paz y contentamiento del prójimo', 'El matrimonio y familia del prójimo', 'La propiedad y posesiones del prójimo', 'La vida y seguridad física del prójimo'],
    correct: 0,
    correctFeedback_en: 'Correct. The tenth commandment guards your neighbor\'s peace. Covetousness is the root from which murder, adultery, theft, and false witness grow.',
    correctFeedback_es: 'Correcto. El décimo mandamiento protege la paz de tu prójimo. La codicia es la raíz de la que crecen el homicidio, el adulterio, el hurto y el falso testimonio.',
    incorrectFeedback_en: 'The tenth commandment — "You shall not covet" — guards your neighbor\'s peace and contentment. Coveting is an inward act that, unchecked, violates every other commandment.',
    incorrectFeedback_es: 'El décimo mandamiento — "No codiciarás" — protege la paz y el contentamiento de tu prójimo. La codicia es un acto interno que, sin control, viola todos los demás mandamientos.'
  },
  {
    text_en: '18. In addition to two denarii, the Samaritan\'s final commitment to the innkeeper was:',
    text_es: '18. Además de dos denarios, el compromiso final del samaritano con el posadero fue:',
    options_en: ['A letter of commendation to city officials', 'An open-ended pledge to repay whatever more was spent', 'Payment of the wounded man\'s travel expenses', 'Three days of personal nursing care'],
    options_es: ['Una carta de recomendación a los funcionarios de la ciudad', 'Una promesa abierta de pagar todo gasto adicional', 'El pago de los gastos de viaje del herido', 'Tres días de cuidado personal de enfermería'],
    correct: 1,
    correctFeedback_en: 'Correct. "Whatever more you spend, when I come back, I will repay you" — the Samaritan wrote a blank check for a stranger\'s recovery.',
    correctFeedback_es: 'Correcto. "Todo lo que gastes de más, yo te lo pagaré cuando regrese" — el samaritano firmó un cheque en blanco para la recuperación de un extraño.',
    incorrectFeedback_en: 'The Samaritan\'s final cost was an open pledge: "Whatever more you spend, when I come back, I will repay you" (Luke 10:35). He committed to an unknown future debt.',
    incorrectFeedback_es: 'El costo final del samaritano fue una promesa abierta: "Todo lo que gastes de más, yo te lo pagaré cuando regrese" (Lc. 10:35). Se comprometió a una deuda futura desconocida.'
  },
  {
    text_en: '19. According to 1 John 4:20, love for God is ultimately proved by:',
    text_es: '19. Según 1 Juan 4:20, el amor a Dios se prueba en última instancia por:',
    options_en: ['Faithful attendance at worship', 'Observance of all the commandments', 'Prayer and fasting practices', 'Love for the visible brother'],
    options_es: ['La asistencia fiel al culto', 'La observancia de todos los mandamientos', 'Las prácticas de oración y ayuno', 'El amor al hermano visible'],
    correct: 3,
    correctFeedback_en: 'Correct. "He who does not love his brother whom he has seen, how can he love God whom he has not seen?" The horizontal is the test of the vertical.',
    correctFeedback_es: 'Correcto. "El que no ama a su hermano a quien ha visto, ¿cómo puede amar a Dios a quien no ha visto?" Lo horizontal es la prueba de lo vertical.',
    incorrectFeedback_en: '1 John 4:20 argues: if you cannot love the brother you can see, how can you love God you cannot see? Love for the visible neighbor is the test of love for the invisible God.',
    incorrectFeedback_es: '1 Juan 4:20 argumenta: si no puedes amar al hermano que puedes ver, ¿cómo puedes amar a Dios que no puedes ver? El amor al prójimo visible es la prueba del amor al Dios invisible.'
  },
  {
    text_en: '20. According to Romans 13:9–10, all the commandments are summed up in:',
    text_es: '20. Según Romanos 13:9–10, todos los mandamientos se resumen en:',
    options_en: ['The law of Moses', 'The Sermon on the Mount', 'Love your neighbor as yourself', 'The Ten Commandments'],
    options_es: ['La ley de Moisés', 'El Sermón del Monte', 'Amarás a tu prójimo como a ti mismo', 'Los Diez Mandamientos'],
    correct: 2,
    correctFeedback_en: 'Correct. Romans 13:9 — "if there is any other commandment, it is summed up in this word: You shall love your neighbor as yourself."',
    correctFeedback_es: 'Correcto. Romanos 13:9 — "y cualquier otro mandamiento, en esta sentencia se resume: Amarás a tu prójimo como a ti mismo."',
    incorrectFeedback_en: 'Romans 13:9 says all commandments are "summed up in this word: You shall love your neighbor as yourself." Love your neighbor and you have fulfilled the whole second tablet.',
    incorrectFeedback_es: 'Romanos 13:9 dice que todos los mandamientos se "resumen en esta sentencia: Amarás a tu prójimo como a ti mismo." Ama a tu prójimo y habrás cumplido toda la segunda tabla.'
  }
];

const saQuestions = [
  {
    text_en: '21. Explain why Jesus uses the word <em>homoia</em> ("like it") in Matthew 22:39 and what this teaches about the relationship between loving God and loving neighbor.',
    text_es: '21. Explica por qué Jesús usa la palabra <em>homoia</em> ("semejante a él") en Mateo 22:39 y qué enseña esto sobre la relación entre amar a Dios y amar al prójimo.',
    kw_en: ['homoia', 'like', 'same kind', 'vertical', 'horizontal', '1 john', 'liar'],
    kw_es: ['homoia', 'semejante', 'misma clase', 'vertical', 'horizontal', '1 juan', 'mentiroso'],
    explanationEn: 'Homoia means "of the same kind" — not second in importance but equal in structural claim on the disciple\'s life. The two commandments form a cross: vertical (love God) and horizontal (love neighbor). 1 John 4:20 shows they cannot be separated: claiming love for God while failing the visible neighbor is a self-contradiction.',
    explanationEs: 'Homoia significa "de la misma clase" — no segundo en importancia sino igual en su reclamo estructural sobre la vida del discípulo. Los dos mandamientos forman una cruz: vertical (amar a Dios) y horizontal (amar al prójimo). 1 Juan 4:20 muestra que no pueden separarse.'
  },
  {
    text_en: '22. Re-narrate the Good Samaritan parable (Luke 10:30–35) and explain what each specific cost the Samaritan paid teaches about the nature of neighbor-love.',
    text_es: '22. Vuelve a narrar la parábola del Buen Samaritano (Lucas 10:30–35) y explica qué enseña cada costo específico que pagó el samaritano sobre la naturaleza del amor al prójimo.',
    kw_en: ['oil', 'wine', 'animal', 'denarii', 'open-ended', 'innkeeper', 'cost'],
    kw_es: ['aceite', 'vino', 'bestia', 'denarios', 'promesa abierta', 'posadero', 'costo'],
    explanationEn: 'The Samaritan gave his medical supplies (oil and wine), his animal\'s comfort (walking so the injured man could ride), his time (stayed overnight), two denarii, and an open-ended pledge. Each item shows neighbor-love is specific, costly, and committed — not vague sentiment.',
    explanationEs: 'El samaritano dio sus suministros médicos, la comodidad de su animal (caminó para que el herido pudiera montar), su tiempo, dos denarios y una promesa abierta. Cada elemento muestra que el amor al prójimo es específico, costoso y comprometido, no un sentimentalismo vago.'
  },
  {
    text_en: '23. List the six commandments of the Second Tablet (5–10) and explain how each one protects your neighbor.',
    text_es: '23. Enumera los seis mandamientos de la Segunda Tabla (5–10) y explica cómo cada uno protege a tu prójimo.',
    kw_en: ['honor father', 'murder', 'adultery', 'steal', 'false witness', 'covet', 'sixth', 'seventh'],
    kw_es: ['honra padre', 'matar', 'adulterio', 'hurtar', 'falso testimonio', 'codiciar', 'sexto', 'séptimo'],
    explanationEn: 'The fifth guards family structure, the sixth guards life, the seventh guards marriage, the eighth guards property, the ninth guards reputation, the tenth guards peace. Romans 13:10 — "love does no harm to a neighbor; therefore love is the fulfillment of the law." Each negative command is a positive duty.',
    explanationEs: 'El quinto protege la estructura familiar, el sexto la vida, el séptimo el matrimonio, el octavo la propiedad, el noveno la reputación, el décimo la paz. Romanos 13:10 — "el amor no hace mal al prójimo; así que el cumplimiento de la ley es el amor."'
  },
  {
    text_en: '24. Apply Romans 13:9–10 to a specific situation in ministry or daily life, showing how the second-tablet commandments are expressions of neighbor-love.',
    text_es: '24. Aplica Romanos 13:9–10 a una situación específica del ministerio o la vida diaria, mostrando cómo los mandamientos de la segunda tabla son expresiones del amor al prójimo.',
    kw_en: ['Romans 13', 'love', 'harm', 'fulfillment', 'commandments', 'neighbor'],
    kw_es: ['Romanos 13', 'amor', 'mal', 'cumplimiento', 'mandamientos', 'prójimo'],
    explanationEn: 'Romans 13:9-10 summarizes the second tablet in love: "love does no harm to a neighbor; therefore love is the fulfillment of the law." Any contemporary situation (business dealings, speech, family relations) can be tested: does this action harm my neighbor? If yes, love forbids it.',
    explanationEs: 'Romanos 13:9-10 resume la segunda tabla en amor: "el amor no hace mal al prójimo; así que el cumplimiento de la ley es el amor." Cualquier situación contemporánea puede probarse: ¿esta acción daña a mi prójimo?'
  },
  {
    text_en: '25. Define partiality as James describes it in James 2:1–9 and give two examples of how partiality shows up in the modern church.',
    text_es: '25. Define la parcialidad según la describe Santiago en Santiago 2:1–9 y da dos ejemplos de cómo se manifiesta en la iglesia moderna.',
    kw_en: ['partiality', 'James', 'face', 'wealthy', 'poor', 'seat', 'sin'],
    kw_es: ['parcialidad', 'Santiago', 'rostro', 'rico', 'pobre', 'asiento', 'pecado'],
    explanationEn: 'Partiality (prosōpolēmpsia — "receiving of faces") is treating people differently based on wealth, status, or appearance. James illustrates it with the wealthy man getting the good seat while the poor man is told to stand. Modern examples include favoring generous donors in decisions or giving more pastoral care to influential families.',
    explanationEs: 'La parcialidad (prosōpolēmpsia — "recibir rostros") es tratar a las personas de manera diferente según su riqueza, estatus o apariencia. Santiago lo ilustra con el hombre rico recibiendo el buen asiento mientras al pobre se le dice que se quede de pie.'
  },
  {
    text_en: '26. Use 1 John 4:20 to examine the claim "I love God." What does John say is the proof of that claim, and why does the visible/invisible distinction matter?',
    text_es: '26. Usa 1 Juan 4:20 para examinar la afirmación "Yo amo a Dios." ¿Qué dice Juan que es la prueba de esa afirmación, y por qué importa la distinción visible/invisible?',
    kw_en: ['1 John 4:20', 'liar', 'brother', 'seen', 'unseen', 'visible', 'invisible'],
    kw_es: ['1 Juan 4:20', 'mentiroso', 'hermano', 'visto', 'no visto', 'visible', 'invisible'],
    explanationEn: 'John says the person who claims to love God while hating the visible brother "is a liar." The argument runs from lesser to greater: if you cannot love the neighbor you can see and touch, you cannot love the God you cannot see. Love for God must pass the visible test.',
    explanationEs: 'Juan dice que quien afirma amar a Dios mientras aborrece al hermano visible "es mentiroso." El argumento va de menor a mayor: si no puedes amar al prójimo que puedes ver y tocar, no puedes amar al Dios que no puedes ver.'
  },
  {
    text_en: '27. Explain how Jesus changed the lawyer\'s question in Luke 10:25–37, and what this change reveals about the nature of neighbor-love.',
    text_es: '27. Explica cómo Jesús cambió la pregunta del abogado en Lucas 10:25–37 y qué revela este cambio sobre la naturaleza del amor al prójimo.',
    kw_en: ['who is my neighbor', 'who became a neighbor', 'conduct', 'justify', 'Samaritan', 'category'],
    kw_es: ['quién es mi prójimo', 'quién se hizo prójimo', 'conducta', 'justificarse', 'samaritano', 'categoría'],
    explanationEn: 'The lawyer asked "Who is my neighbor?" seeking to narrow obligation. Jesus changed it to "Who became a neighbor?" — shifting from category (who deserves love) to conduct (who showed love). Neighbor-love is not about finding eligible recipients; it is about becoming the kind of person who stops.',
    explanationEs: 'El abogado preguntó "¿Y quién es mi prójimo?" buscando limitar su obligación. Jesús lo cambió a "¿Quién se hizo prójimo?" — pasando de categoría (quién merece amor) a conducta (quién mostró amor).'
  },
  {
    text_en: '28. What does the behavior of the priest and Levite in the parable reveal about the relationship between religious function and genuine neighbor-love?',
    text_es: '28. ¿Qué revela el comportamiento del sacerdote y del levita en la parábola sobre la relación entre la función religiosa y el amor genuino al prójimo?',
    kw_en: ['priest', 'Levite', 'pass by', 'other side', 'religious', 'schedule', 'purity'],
    kw_es: ['sacerdote', 'levita', 'pasar', 'otro lado', 'religioso', 'agenda', 'pureza'],
    explanationEn: 'The priest and Levite were the most religiously qualified people in Israel — yet they passed by. Jesus chose these characters deliberately: religious function does not guarantee neighbor-love. Ritual, schedule, and purity concerns can become excuses for avoiding the costly demand of the person in the ditch.',
    explanationEs: 'El sacerdote y el levita eran las personas más calificadas religiosamente en Israel, sin embargo pasaron de largo. Jesús eligió estos personajes deliberadamente: la función religiosa no garantiza el amor al prójimo.'
  },
  {
    text_en: '29. How does Section VI ("Across the Street") apply the Good Samaritan parable to ordinary daily life? Distinguish between seeking a neighbor and encountering one.',
    text_es: '29. ¿Cómo aplica la Sección VI ("Al Otro Lado de la Calle") la parábola del Buen Samaritano a la vida diaria ordinaria? Distingue entre buscar un prójimo y encontrarse con uno.',
    kw_en: ['encounter', 'stop', 'mission field', 'ditch', 'ordinary', 'choice', 'traveling'],
    kw_es: ['encuentro', 'detenerse', 'campo misionero', 'zanja', 'ordinario', 'elección', 'viajando'],
    explanationEn: 'The Samaritan was not on a mission trip — he was traveling on ordinary business. The "mission field" appeared in the road. Neighbor-love is primarily reactive to real encounters, not proactive searches for worthy recipients. The choice is not who to love but whether to stop when love is needed.',
    explanationEs: 'El samaritano no iba en un viaje misionero, sino en viaje ordinario de negocios. El "campo misionero" apareció en el camino. El amor al prójimo es principalmente reactivo ante encuentros reales, no búsquedas proactivas de destinatarios dignos.'
  },
  {
    text_en: `30. Connect Unit ${UNIT} (Love Neighbor) to Unit ${UNIT + 1} (Be Holy): why does loving your neighbor at the level Jesus demands require more than effort alone?`,
    text_es: `30. Conecta la Unidad ${UNIT} (Ama a Tu Prójimo) con la Unidad ${UNIT + 1} (Sé Santo): ¿por qué amar al prójimo al nivel que Jesús exige requiere más que solo esfuerzo?`,
    kw_en: ['holiness', 'Spirit', 'effort', 'transform', 'holy', 'sustained', 'enemy'],
    kw_es: ['santidad', 'Espíritu', 'esfuerzo', 'transformar', 'santo', 'sostenido', 'enemigo'],
    explanationEn: 'The Samaritan\'s love cost him everything on the road that day. Sustaining that kind of love across a lifetime — toward enemies, the ungrateful, the difficult — cannot be powered by human will alone. It requires the Spirit\'s transforming work. Holiness is the only engine powerful enough to sustain radical neighbor-love.',
    explanationEs: 'El amor del samaritano le costó todo lo que tenía ese día. Mantener ese amor a lo largo de una vida — hacia los enemigos, los ingratos, los difíciles — no puede impulsarse solo con la voluntad humana. Requiere la obra transformadora del Espíritu.'
  }
];
