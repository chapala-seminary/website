/* CTSWR - unit 2: per-unit configuration and content. */

const UNIT = 2;

let currentUnit = 2;

const mcQuestions = [
  {
    "textEn": "1. According to Romans 9:4-5, Paul says the adoption, the glory, the covenants, the giving of the law, and the promises belong to:",
    "textEs": "1. Según Romanos 9:4-5, Pablo dice que la adopción, la gloria, los pactos, la promulgación de la ley y las promesas pertenecen a:",
    "optionsEn": [
      "His kinsmen the Israelites",
      "The Roman church",
      "The Corinthian believers",
      "The Gentile nations generally"
    ],
    "optionsEs": [
      "Sus parientes los israelitas",
      "La iglesia romana",
      "Los creyentes corintios",
      "Las naciones gentiles en general"
    ],
    "c": 21,
    "explEn": "Paul lists the adoption, glory, covenants, giving of the law, service of God, and promises as belonging to his kinsmen according to the flesh, the Israelites.",
    "explEs": "Pablo enumera la adopción, la gloria, los pactos, la promulgación de la ley, el servicio a Dios y las promesas como pertenecientes a sus parientes según la carne, los israelitas."
  },
  {
    "textEn": "2. In John 4:22, Jesus tells the Samaritan woman that:",
    "textEs": "2. En Juan 4:22, Jesús le dice a la mujer samaritana que:",
    "optionsEn": [
      "Samaritans worship correctly",
      "Salvation is of the Jews",
      "The Temple no longer matters",
      "All worship is equally valid"
    ],
    "optionsEs": [
      "Los samaritanos adoran correctamente",
      "La salvación viene de los judíos",
      "El Templo ya no importa",
      "Toda adoración es igualmente válida"
    ],
    "c": 29,
    "explEn": "Jesus states plainly, 'salvation is of the Jews' (John 4:22), a historical and theological fact essential to understanding Christianity's roots.",
    "explEs": "Jesús declara claramente: 'la salvación viene de los judíos' (Juan 4:22), un hecho histórico y teológico esencial para entender las raíces del cristianismo."
  },
  {
    "textEn": "3. The Shema, recited daily by observant Jews, is found in:",
    "textEs": "3. El Shemá, recitado diariamente por judíos observantes, se encuentra en:",
    "optionsEn": [
      "Genesis 1:1",
      "Exodus 20:1",
      "Deuteronomy 6:4",
      "Isaiah 53:1"
    ],
    "optionsEs": [
      "Génesis 1:1",
      "Éxodo 20:1",
      "Deuteronomio 6:4",
      "Isaías 53:1"
    ],
    "c": 37,
    "explEn": "The Shema begins in Deuteronomy 6:4: 'Hear, O Israel: The LORD our God, the LORD is one!'",
    "explEs": "El Shemá comienza en Deuteronomio 6:4: 'Oye, Israel: el SEÑOR nuestro Dios, el SEÑOR uno es.'"
  },
  {
    "textEn": "4. According to this unit, the Shema is best understood as:",
    "textEs": "4. Según esta unidad, el Shemá se entiende mejor como:",
    "optionsEn": [
      "A vague philosophical statement",
      "A minor prayer with little importance",
      "A rule invented by the rabbis after A.D. 70",
      "A covenantal claim binding Israel to its God"
    ],
    "optionsEs": [
      "Una declaración filosófica vaga",
      "Una oración menor de poca importancia",
      "Una regla inventada por los rabinos después del año 70 d.C.",
      "Una afirmación pactual que ata a Israel a su Dios"
    ],
    "c": 45,
    "explEn": "The Shema is a covenantal claim: this God, and no other, is Israel's God, binding theological confession to daily life and the household.",
    "explEs": "El Shemá es una afirmación pactual: este Dios, y ningún otro, es el Dios de Israel, atando la confesión teológica a la vida diaria y al hogar."
  },
  {
    "textEn": "5. Deuteronomy 7:7-8 explains that God chose Israel because:",
    "textEs": "5. Deuteronomio 7:7-8 explica que Dios eligió a Israel porque:",
    "optionsEn": [
      "The LORD loved them, not because of their number",
      "Israel was the largest nation",
      "Israel had earned it through obedience",
      "No other nation existed yet"
    ],
    "optionsEs": [
      "El SEÑOR los amó, no por su número",
      "Israel era la nación más grande",
      "Israel se lo había ganado por obediencia",
      "Ninguna otra nación existía todavía"
    ],
    "c": 49,
    "explEn": "Deuteronomy 7:7-8 says God did not choose Israel for their number, since they were the least of all peoples, but because the LORD loves them.",
    "explEs": "Deuteronomio 7:7-8 dice que Dios no eligió a Israel por su número, ya que eran el más pequeño de los pueblos, sino porque el SEÑOR los amó."
  },
  {
    "textEn": "6. According to Genesis 12:3, God's promise to Abraham was intended to bless:",
    "textEs": "6. Según Génesis 12:3, la promesa de Dios a Abraham estaba destinada a bendecir:",
    "optionsEn": [
      "Only Abraham's immediate family",
      "All the families of the earth",
      "Only the twelve tribes of Israel",
      "Only the priestly line"
    ],
    "optionsEs": [
      "Solo a la familia inmediata de Abraham",
      "A todas las familias de la tierra",
      "Solo a las doce tribus de Israel",
      "Solo a la línea sacerdotal"
    ],
    "c": 57,
    "explEn": "Genesis 12:3 says 'in you all the families of the earth shall be blessed' — Israel's election was never meant to be hoarded but was meant to bless the whole world.",
    "explEs": "Génesis 12:3 dice 'en ti serán benditas todas las familias de la tierra' — la elección de Israel nunca fue para acaparar sino para bendecir al mundo entero."
  },
  {
    "textEn": "7. The three sections of the Tanakh are the Torah, the Nevi'im, and the:",
    "textEs": "7. Las tres secciones del Tanaj son la Torá, los Nevi'im, y los:",
    "optionsEn": [
      "Mishnah",
      "Talmud",
      "Ketuvim (Writings)",
      "Targum"
    ],
    "optionsEs": [
      "Mishná",
      "Talmud",
      "Ketuvim (Escritos)",
      "Tárgum"
    ],
    "c": 65,
    "explEn": "The Tanakh consists of the Torah, the Nevi'im (Prophets), and the Ketuvim (Writings) — the same books Christians call the Old Testament, in a different order.",
    "explEs": "El Tanaj consiste en la Torá, los Nevi'im (Profetas) y los Ketuvim (Escritos) — los mismos libros que los cristianos llaman el Antiguo Testamento, en otro orden."
  },
  {
    "textEn": "8. The Jewish Tanakh, unlike the Christian Old Testament arrangement, ends with:",
    "textEs": "8. El Tanaj judío, a diferencia del orden cristiano del Antiguo Testamento, termina con:",
    "optionsEn": [
      "Malachi",
      "Daniel",
      "Zechariah",
      "2 Chronicles"
    ],
    "optionsEs": [
      "Malaquías",
      "Daniel",
      "Zacarías",
      "2 Crónicas"
    ],
    "c": 73,
    "explEn": "The Tanakh contains the same canon as the Christian Old Testament but in a different order, ending with 2 Chronicles rather than Malachi.",
    "explEs": "El Tanaj contiene el mismo canon que el Antiguo Testamento cristiano pero en un orden diferente, terminando con 2 Crónicas en lugar de Malaquías."
  },
  {
    "textEn": "9. The Roman general who destroyed the Jerusalem Temple in A.D. 70 was:",
    "textEs": "9. El general romano que destruyó el Templo de Jerusalén en el año 70 d.C. fue:",
    "optionsEn": [
      "Titus",
      "Pompey",
      "Herod",
      "Nero"
    ],
    "optionsEs": [
      "Tito",
      "Pompeyo",
      "Herodes",
      "Nerón"
    ],
    "c": 77,
    "explEn": "The Roman general Titus destroyed the Jerusalem Temple in A.D. 70, crushing the Jewish revolt that had begun four years earlier.",
    "explEs": "El general romano Tito destruyó el Templo de Jerusalén en el año 70 d.C., aplastando la revuelta judía que había comenzado cuatro años antes."
  },
  {
    "textEn": "10. The three pillars around which rabbis reconstructed Jewish religious life after A.D. 70 were prayer, deeds of loving-kindness, and:",
    "textEs": "10. Los tres pilares en torno a los cuales los rabinos reconstruyeron la vida religiosa judía después del año 70 d.C. fueron la oración, las obras de bondad amorosa, y:",
    "optionsEn": [
      "Temple sacrifice",
      "The study of Torah",
      "Military resistance",
      "Pilgrimage to Rome"
    ],
    "optionsEs": [
      "El sacrificio en el Templo",
      "El estudio de la Torá",
      "La resistencia militar",
      "La peregrinación a Roma"
    ],
    "c": 85,
    "explEn": "The rabbis at Yavneh, led by Yohanan ben Zakkai, rebuilt Jewish religious life around prayer, the study of Torah, and deeds of loving-kindness.",
    "explEs": "Los rabinos en Yavne, liderados por Yojanán ben Zakai, reconstruyeron la vida religiosa judía en torno a la oración, el estudio de la Torá y las obras de bondad amorosa."
  },
  {
    "textEn": "11. The Talmud was completed in two versions, the Jerusalem Talmud and the much larger:",
    "textEs": "11. El Talmud se completó en dos versiones, el Talmud de Jerusalén y el mucho más extenso:",
    "optionsEn": [
      "Egyptian Talmud",
      "Roman Talmud",
      "Babylonian Talmud",
      "Alexandrian Talmud"
    ],
    "optionsEs": [
      "Talmud de Egipto",
      "Talmud de Roma",
      "Talmud de Babilonia",
      "Talmud de Alejandría"
    ],
    "c": 93,
    "explEn": "The Talmud exists in two versions: the Jerusalem Talmud and the much larger Babylonian Talmud, completed by roughly A.D. 500.",
    "explEs": "El Talmud existe en dos versiones: el Talmud de Jerusalén y el mucho más extenso Talmud de Babilonia, completado hacia el año 500 d.C."
  },
  {
    "textEn": "12. Which branch of Judaism holds that the written and oral Torah were given by God at Sinai and remain fully binding today?",
    "textEs": "12. ¿Qué rama del judaísmo sostiene que la Torá escrita y oral fueron dadas por Dios en el Sinaí y siguen siendo plenamente vinculantes hoy?",
    "optionsEn": [
      "Reform Judaism",
      "Reconstructionist Judaism",
      "Secular Judaism",
      "Orthodox Judaism"
    ],
    "optionsEs": [
      "Judaísmo reformista",
      "Judaísmo reconstruccionista",
      "Judaísmo secular",
      "Judaísmo ortodoxo"
    ],
    "c": 101,
    "explEn": "Orthodox Judaism holds that the Torah, both written and oral, was given by God to Moses at Sinai and remains fully binding today.",
    "explEs": "El judaísmo ortodoxo sostiene que la Torá, tanto escrita como oral, fue dada por Dios a Moisés en el Sinaí y sigue siendo plenamente vinculante hoy."
  },
  {
    "textEn": "13. Which branch of Judaism treats Jewish law as a valuable heritage rather than a binding legal code, emphasizing personal autonomy?",
    "textEs": "13. ¿Qué rama del judaísmo trata la ley judía como una herencia valiosa en lugar de un código legal vinculante, enfatizando la autonomía personal?",
    "optionsEn": [
      "Reform Judaism",
      "Orthodox Judaism",
      "Conservative Judaism",
      "Karaite Judaism"
    ],
    "optionsEs": [
      "Judaísmo reformista",
      "Judaísmo ortodoxo",
      "Judaísmo conservador",
      "Judaísmo caraíta"
    ],
    "c": 105,
    "explEn": "Reform Judaism treats Jewish law as a valuable ethical and spiritual heritage rather than a binding legal code, emphasizing personal autonomy in religious practice.",
    "explEs": "El judaísmo reformista trata la ley judía como una valiosa herencia ética y espiritual en lugar de un código legal vinculante, enfatizando la autonomía personal."
  },
  {
    "textEn": "14. This unit warns pastors that an Orthodox Jewish neighbor and a secular Jewish coworker may share almost nothing religiously beyond:",
    "textEs": "14. Esta unidad advierte a los pastores que un vecino judío ortodoxo y un compañero de trabajo judío secular pueden compartir casi nada religiosamente más allá de:",
    "optionsEn": [
      "Language",
      "Ancestry and a general sense of Jewish identity",
      "Political affiliation",
      "Diet"
    ],
    "optionsEs": [
      "El idioma",
      "La ascendencia y un sentido general de identidad judía",
      "La afiliación política",
      "La dieta"
    ],
    "c": 113,
    "explEn": "An Orthodox and a secular Jewish person may share almost nothing religiously beyond ancestry and a general sense of Jewish identity and history.",
    "explEs": "Una persona judía ortodoxa y una secular pueden compartir casi nada religiosamente más allá de la ascendencia y un sentido general de identidad e historia judías."
  },
  {
    "textEn": "15. Traditional Judaism has historically expected a Messiah who is:",
    "textEs": "15. El judaísmo tradicional ha esperado históricamente un Mesías que es:",
    "optionsEn": [
      "A divine being who dies for sin",
      "An angel sent to rule the nations",
      "A human, Davidic deliverer who restores Israel",
      "A symbol with no personal identity"
    ],
    "optionsEs": [
      "Un ser divino que muere por el pecado",
      "Un ángel enviado a gobernar las naciones",
      "Un libertador humano davídico que restaura a Israel",
      "Un símbolo sin identidad personal"
    ],
    "c": 121,
    "explEn": "Judaism has historically expected a specially anointed, human deliverer descended from David who would restore Israel and usher in an age of peace.",
    "explEs": "El judaísmo históricamente ha esperado un libertador humano especialmente ungido, descendiente de David, que restauraría a Israel y daría inicio a una era de paz."
  },
  {
    "textEn": "16. According to this unit, traditional Jewish interpretation of Isaiah 53's suffering servant has often identified the subject as:",
    "textEs": "16. Según esta unidad, la interpretación judía tradicional del siervo sufriente de Isaías 53 a menudo ha identificado al sujeto como:",
    "optionsEn": [
      "The Roman Empire",
      "King David personally",
      "An unnamed Gentile prophet",
      "The nation of Israel itself"
    ],
    "optionsEs": [
      "El Imperio Romano",
      "El rey David personalmente",
      "Un profeta gentil sin nombre",
      "La nación de Israel misma"
    ],
    "c": 129,
    "explEn": "Centuries of Jewish interpretation have often identified Isaiah 53's suffering servant as the nation of Israel itself, rather than a single divine-human individual.",
    "explEs": "Siglos de interpretación judía a menudo han identificado al siervo sufriente de Isaías 53 como la nación de Israel misma, en lugar de un solo individuo divino-humano."
  },
  {
    "textEn": "17. Leviticus 17:11 teaches that atonement is accomplished specifically through:",
    "textEs": "17. Levítico 17:11 enseña que la expiación se logra específicamente por medio de:",
    "optionsEn": [
      "Blood",
      "Fasting alone",
      "Almsgiving alone",
      "Pilgrimage to Jerusalem"
    ],
    "optionsEs": [
      "La sangre",
      "El ayuno solo",
      "La limosna sola",
      "La peregrinación a Jerusalén"
    ],
    "c": 133,
    "explEn": "Leviticus 17:11 says 'it is the blood that makes atonement for the soul,' the Torah's own insistence that blood alone atones for sin.",
    "explEs": "Levítico 17:11 dice 'porque la vida de la carne en la sangre está... para hacer expiación,' la propia insistencia de la Torá en que solo la sangre expía el pecado."
  },
  {
    "textEn": "18. Since the destruction of the Temple, most branches of Judaism have understood prayer, repentance, and charitable deeds, especially around Yom Kippur, to:",
    "textEs": "18. Desde la destrucción del Templo, la mayoría de las ramas del judaísmo han entendido que la oración, el arrepentimiento y las obras de caridad, especialmente en torno a Iom Kipur:",
    "optionsEn": [
      "Have replaced the need for any atonement",
      "Accomplish what sacrifice once did",
      "Are purely symbolic with no theological weight",
      "Were rejected by all rabbis"
    ],
    "optionsEs": [
      "Han eliminado la necesidad de cualquier expiación",
      "Logran lo que antes lograba el sacrificio",
      "Son puramente simbólicas sin peso teológico",
      "Fueron rechazadas por todos los rabinos"
    ],
    "c": 141,
    "explEn": "With the sacrificial system gone, most branches of Judaism came to understand prayer, repentance, and charitable deeds as accomplishing what sacrifice once did.",
    "explEs": "Sin el sistema de sacrificios, la mayoría de las ramas del judaísmo llegaron a entender la oración, el arrepentimiento y las obras de caridad como logrando lo que antes lograba el sacrificio."
  },
  {
    "textEn": "19. According to Romans 11:28-29, God regards Israel, even where they have not yet believed, as:",
    "textEs": "19. Según Romanos 11:28-29, Dios considera a Israel, incluso donde todavía no han creído, como:",
    "optionsEn": [
      "Permanently rejected",
      "Equal in status to the church only after conversion",
      "Beloved for the sake of the fathers",
      "Irrelevant to God's ongoing plan"
    ],
    "optionsEs": [
      "Permanentemente rechazado",
      "Iguales en estatus a la iglesia solo después de la conversión",
      "Amados por causa de los padres",
      "Irrelevantes para el plan continuo de Dios"
    ],
    "c": 149,
    "explEn": "Romans 11:28 says Israel remains 'beloved for the sake of the fathers' even where they have not yet believed, and Paul insists God has not cast away His people.",
    "explEs": "Romanos 11:28 dice que Israel sigue siendo 'amados por causa de los padres' incluso donde todavía no han creído, y Pablo insiste en que Dios no ha desechado a Su pueblo."
  },
  {
    "textEn": "20. This unit teaches that Paul's pattern in Acts, going to the synagogue first in city after city, shows that the gospel is:",
    "textEs": "20. Esta unidad enseña que el patrón de Pablo en Hechos, yendo primero a la sinagoga en ciudad tras ciudad, muestra que el evangelio es:",
    "optionsEn": [
      "Not intended for Jewish people",
      "Only for Gentiles after A.D. 70",
      "A private matter never to be preached publicly",
      "To the Jew first and also for the Greek"
    ],
    "optionsEs": [
      "No destinado a las personas judías",
      "Solo para los gentiles después del año 70 d.C.",
      "Un asunto privado que nunca debe predicarse públicamente",
      "Al judío primeramente, y también al griego"
    ],
    "c": 157,
    "explEn": "Paul's consistent pattern of going to the synagogue first reflects his own words that the gospel is 'to the Jew first and also for the Greek' (Romans 1:16).",
    "explEs": "El patrón constante de Pablo de ir primero a la sinagoga refleja sus propias palabras de que el evangelio es 'al judío primeramente, y también al griego' (Romanos 1:16)."
  }
];

const kwQuestions = [
  {
    "textEn": "21. Explain why this unit says Judaism is not simply one religion among many for a Christian to study, but 'the soil Christianity grew out of.'",
    "textEs": "21. Explique por qué esta unidad dice que el judaísmo no es simplemente una religión más para que un cristiano estudie, sino 'la tierra de la cual creció el cristianismo.'",
    "kw_en": ["jew", "disciple", "romans", "adoption", "covenant", "salvation", "christ", "flesh"],
    "kw_es": ["judío", "discípulo", "romanos", "adopción", "pacto", "salvación", "cristo", "carne"],
    "modelEn": "Jesus was a Jew, every one of His first disciples was a Jew, and every book of the Old Testament was written by and for a Jewish audience. Paul lists the adoption, the glory, the covenants, the giving of the law, and the promises as belonging to Israel, and notes that Christ came from them according to the flesh (Romans 9:4-5). Jesus Himself told the Samaritan woman that salvation is of the Jews (John 4:22). This means Christianity did not emerge alongside Judaism but out of it, so understanding Judaism is essential to understanding Christianity's own roots.",
    "modelEs": "Jesús era judío, cada uno de Sus primeros discípulos era judío, y cada libro del Antiguo Testamento fue escrito por y para una audiencia judía. Pablo enumera la adopción, la gloria, los pactos, la promulgación de la ley y las promesas como pertenecientes a Israel, y señala que Cristo vino de ellos según la carne (Romanos 9:4-5). Jesús mismo le dijo a la mujer samaritana que la salvación viene de los judíos (Juan 4:22). Esto significa que el cristianismo no surgió junto al judaísmo sino de él, así que entender el judaísmo es esencial para entender las propias raíces del cristianismo."
  },
  {
    "textEn": "22. What is the Shema, and why does this unit say Jewish religious identity and ethnic identity are not two separate categories?",
    "textEs": "22. ¿Qué es el Shemá, y por qué dice esta unidad que la identidad religiosa judía y la identidad étnica no son dos categorías separadas?",
    "kw_en": ["shema", "hear", "israel", "one", "covenant", "abraham", "inheritance", "deuteronomy"],
    "kw_es": ["shemá", "oye", "israel", "uno", "pacto", "abraham", "herencia", "deuteronomio"],
    "modelEn": "The Shema is the daily confession from Deuteronomy 6:4, 'Hear, O Israel: The LORD our God, the LORD is one,' bound directly to loving God and teaching the next generation. It is a covenantal claim, not just abstract monotheism: this God belongs to Israel in a unique way. Because this covenant traces back through Abraham, Isaac, Jacob, Moses, and David, Jewish religious identity and ethnic identity form a single inheritance rather than two separate things that happen to overlap.",
    "modelEs": "El Shemá es la confesión diaria de Deuteronomio 6:4, 'Oye, Israel: el SEÑOR nuestro Dios, el SEÑOR uno es,' atada directamente a amar a Dios y enseñar a la siguiente generación. Es una afirmación pactual, no solo monoteísmo abstracto: este Dios pertenece a Israel de una manera única. Debido a que este pacto se remonta a través de Abraham, Isaac, Jacob, Moisés y David, la identidad religiosa judía y la identidad étnica forman una sola herencia en lugar de dos cosas separadas que coinciden."
  },
  {
    "textEn": "23. According to this unit, Israel's election was never meant to be an end in itself. Support this claim using Genesis 12:3 and Isaiah 49:6.",
    "textEs": "23. Según esta unidad, la elección de Israel nunca fue diseñada para ser un fin en sí misma. Sustente esta afirmación usando Génesis 12:3 e Isaías 49:6.",
    "kw_en": ["bless", "families", "earth", "light", "gentiles", "election", "genesis", "isaiah"],
    "kw_es": ["bendic", "familias", "tierra", "luz", "gentiles", "elección", "génesis", "isaías"],
    "modelEn": "Genesis 12:3 says that through Abraham 'all the families of the earth shall be blessed,' showing that God's promise always included the whole world, not Israel alone. Isaiah 49:6 extends this further, calling Israel to be 'a light to the Gentiles,' a verse the New Testament applies to Christ in Acts 13:47. Together these passages show that Israel's election was intended to bless and reach the nations rather than to be hoarded as a private privilege.",
    "modelEs": "Génesis 12:3 dice que a través de Abraham 'serán benditas todas las familias de la tierra,' mostrando que la promesa de Dios siempre incluyó al mundo entero, no solo a Israel. Isaías 49:6 extiende esto más, llamando a Israel a ser 'luz de las naciones,' un versículo que el Nuevo Testamento aplica a Cristo en Hechos 13:47. Juntos estos pasajes muestran que la elección de Israel fue diseñada para bendecir y alcanzar a las naciones en lugar de acapararse como un privilegio privado."
  },
  {
    "textEn": "24. Describe the crisis the destruction of the Jerusalem Temple in A.D. 70 created for Jewish religious life, and how the rabbis responded.",
    "textEs": "24. Describa la crisis que la destrucción del Templo de Jerusalén en el año 70 d.C. creó para la vida religiosa judía, y cómo respondieron los rabinos.",
    "kw_en": ["temple", "sacrifice", "titus", "yavneh", "prayer", "torah", "reconstruct", "atonement"],
    "kw_es": ["templo", "sacrificio", "tito", "yavne", "oración", "torá", "reconstru", "expiación"],
    "modelEn": "When Titus destroyed the Jerusalem Temple in A.D. 70, the entire sacrificial system Leviticus commanded for atonement of sin suddenly had no location where it could be carried out, striking at the heart of how a Jewish person could be reconciled to God. Rabbis surviving the destruction, gathered at Yavneh under Yohanan ben Zakkai, reconstructed Jewish religious life around three pillars that did not require a Temple: prayer, the study of Torah, and deeds of loving-kindness, eventually recording their interpretations in the Mishnah and Talmud.",
    "modelEs": "Cuando Tito destruyó el Templo de Jerusalén en el año 70 d.C., todo el sistema de sacrificios que Levítico ordenaba para la expiación del pecado de repente no tenía lugar donde llevarse a cabo, golpeando el corazón de cómo una persona judía podía reconciliarse con Dios. Los rabinos que sobrevivieron a la destrucción, reunidos en Yavne bajo Yojanán ben Zakai, reconstruyeron la vida religiosa judía en torno a tres pilares que no requerían un Templo: la oración, el estudio de la Torá y las obras de bondad amorosa, registrando eventualmente sus interpretaciones en la Mishná y el Talmud."
  },
  {
    "textEn": "25. Compare Orthodox and Reform Judaism as described in this unit. Why does this diversity matter for pastoral ministry?",
    "textEs": "25. Compare el judaísmo ortodoxo y el reformista según se describen en esta unidad. ¿Por qué importa esta diversidad para el ministerio pastoral?",
    "kw_en": ["orthodox", "reform", "binding", "autonomy", "sinai", "heritage", "credibility", "neighbor"],
    "kw_es": ["ortodox", "reformista", "vinculante", "autonomía", "sinaí", "herencia", "credibilidad", "vecino"],
    "modelEn": "Orthodox Judaism holds that the written and oral Torah were given by God at Sinai and remain fully binding today, maintaining traditional practice around Sabbath, dietary law, and prayer. Reform Judaism treats Jewish law as a valuable heritage rather than a binding legal code, emphasizing personal autonomy and social justice. This diversity matters for ministry because a pastor who addresses an Orthodox Jewish neighbor as though addressing a Reform or secular Jewish person will quickly lose credibility and fail to communicate in terms that actually connect with what that person believes.",
    "modelEs": "El judaísmo ortodoxo sostiene que la Torá escrita y oral fueron dadas por Dios en el Sinaí y siguen siendo plenamente vinculantes hoy, manteniendo la práctica tradicional del sábado, la ley alimentaria y la oración. El judaísmo reformista trata la ley judía como una herencia valiosa en lugar de un código legal vinculante, enfatizando la autonomía personal y la justicia social. Esta diversidad importa para el ministerio porque un pastor que se dirige a un vecino judío ortodoxo como si se dirigiera a una persona judía reformista o secular perderá credibilidad rápidamente y no logrará comunicarse en términos que realmente conecten con lo que esa persona cree."
  },
  {
    "textEn": "26. What common ground does this unit say Judaism and Christianity share, and where do the two traditions diverge most sharply?",
    "textEs": "26. ¿Qué terreno común dice esta unidad que comparten el judaísmo y el cristianismo, y dónde divergen más agudamente las dos tradiciones?",
    "kw_en": ["one god", "creator", "hebrew", "scripture", "moral", "messiah", "diverge", "identity"],
    "kw_es": ["un dios", "creador", "hebre", "escritura", "moral", "mesías", "diverg", "identidad"],
    "modelEn": "Judaism and Christianity share belief in one God the Creator, the authority of the Hebrew Scriptures, a moral law rooted in that revelation, and the conviction that history moves toward a divinely appointed goal. The traditions diverge most sharply over the identity of the Messiah: Judaism expects a human, Davidic deliverer, while traditional Judaism has not generally accepted that the Messiah would be divine, die an atoning death, or come twice, which is precisely where Christianity claims its central truth.",
    "modelEs": "El judaísmo y el cristianismo comparten la creencia en un solo Dios Creador, la autoridad de las Escrituras hebreas, una ley moral arraigada en esa revelación, y la convicción de que la historia se mueve hacia una meta divinamente señalada. Las tradiciones divergen más agudamente en la identidad del Mesías: el judaísmo espera un libertador humano davídico, mientras que el judaísmo tradicional generalmente no ha aceptado que el Mesías fuera divino, muriera una muerte expiatoria, o viniera dos veces, que es precisamente donde el cristianismo reclama su verdad central."
  },
  {
    "textEn": "27. How does this unit explain the way rabbinic Judaism answered the loss of the Temple's atoning sacrifices, and how does Hebrews respond to that answer?",
    "textEs": "27. ¿Cómo explica esta unidad la manera en que el judaísmo rabínico respondió a la pérdida de los sacrificios expiatorios del Templo, y cómo responde Hebreos a esa respuesta?",
    "kw_en": ["blood", "leviticus", "repentance", "charity", "yom kippur", "hebrews", "fulfill", "atone"],
    "kw_es": ["sangre", "levítico", "arrepentimiento", "caridad", "iom kipur", "hebreos", "cumpl", "expia"],
    "modelEn": "Since Leviticus 17:11 insists that it is the blood that makes atonement, and the Temple's destruction removed the means of offering that blood, rabbinic Judaism developed prayer, repentance, and charitable deeds, especially around Yom Kippur, as accomplishing what sacrifice once did. The book of Hebrews responds by showing at length that Jesus fulfills, rather than abolishes, the sacrificial system Moses established, offering the very blood atonement the Torah requires and that rabbinic substitutes cannot ultimately supply.",
    "modelEs": "Dado que Levítico 17:11 insiste en que es la sangre la que hace expiación, y la destrucción del Templo eliminó el medio para ofrecer esa sangre, el judaísmo rabínico desarrolló la oración, el arrepentimiento y las obras de caridad, especialmente en torno a Iom Kipur, como aquello que logra lo que antes lograba el sacrificio. El libro de Hebreos responde mostrando extensamente que Jesús cumple, en lugar de abolir, el sistema de sacrificios que Moisés estableció, ofreciendo la misma expiación por sangre que la Torá requiere y que los sustitutos rabínicos no pueden finalmente suministrar."
  },
  {
    "textEn": "28. Using Romans 11, explain why this unit warns against both replacement theology and squeamishness about evangelizing Jewish people.",
    "textEs": "28. Usando Romanos 11, explique por qué esta unidad advierte tanto contra la teología del reemplazo como contra el recelo hacia evangelizar a las personas judías.",
    "kw_en": ["cast away", "branches", "boast", "all israel", "beloved", "synagogue", "arrogance", "romans"],
    "kw_es": ["desech", "ramas", "jact", "todo israel", "amados", "sinagoga", "arrogancia", "romanos"],
    "modelEn": "Romans 11 warns against two opposite errors. Paul denies that God has cast away His people (11:1-2) and insists all Israel will be saved (11:26), which rules out replacement theology's claim that promises to Israel simply expired. Paul also warns Gentile believers not to boast against the branches (11:18-21), but this is not a call to abandon evangelism; Paul went to the synagogue first in city after city, showing the gospel remains for Jews as Jews, addressed to them as still beloved for the sake of the fathers (11:28).",
    "modelEs": "Romanos 11 advierte contra dos errores opuestos. Pablo niega que Dios haya desechado a Su pueblo (11:1-2) e insiste en que todo Israel será salvo (11:26), lo cual descarta la afirmación de la teología del reemplazo de que las promesas a Israel simplemente expiraron. Pablo también advierte a los creyentes gentiles que no se jacten contra las ramas (11:18-21), pero esto no es un llamado a abandonar el evangelismo; Pablo fue primero a la sinagoga en ciudad tras ciudad, mostrando que el evangelio sigue siendo para los judíos como judíos, dirigido a ellos como todavía amados por causa de los padres (11:28)."
  },
  {
    "textEn": "29. According to this unit, how should a pastor practically engage a Jewish friend or neighbor with the gospel?",
    "textEs": "29. Según esta unidad, ¿cómo debe un pastor acercarse prácticamente a un amigo o vecino judío con el evangelio?",
    "kw_en": ["isaiah", "daniel", "passover", "leviticus", "scripture", "honor", "history", "nazareth"],
    "kw_es": ["isaías", "daniel", "pascua", "levítico", "escritura", "honr", "historia", "nazaret"],
    "modelEn": "This unit teaches that a pastor should speak with Jewish neighbors from within their own Scriptures rather than around them, pointing to Isaiah 53, Daniel 9, the Passover lamb of Exodus 12, and the blood-atonement theology of Leviticus 17, showing how each finds its answer in Jesus of Nazareth. It also means honoring rather than dismissing Jewish history and suffering, and the genuine devotion many Jewish people bring to God even without yet knowing Christ, following Paul's own pattern of engagement.",
    "modelEs": "Esta unidad enseña que un pastor debe hablar con vecinos judíos desde dentro de sus propias Escrituras en lugar de rodearlas, señalando a Isaías 53, Daniel 9, el cordero de la Pascua de Éxodo 12, y la teología de expiación por sangre de Levítico 17, mostrando cómo cada uno encuentra su respuesta en Jesús de Nazaret. También significa honrar en lugar de descartar la historia y el sufrimiento judíos, y la devoción genuina que muchas personas judías traen a Dios incluso sin conocer todavía a Cristo, siguiendo el propio patrón de acercamiento de Pablo."
  },
  {
    "textEn": "30. Synthesize this unit: why does understanding Judaism matter both for accurate scholarship and for faithful evangelism, according to Romans 11:25-26?",
    "textEs": "30. Sintetice esta unidad: ¿por qué importa entender el judaísmo tanto para una erudición precisa como para un evangelismo fiel, según Romanos 11:25-26?",
    "kw_en": ["mystery", "fullness", "gentiles", "unfinished", "scholarship", "evangelism", "root", "respect"],
    "kw_es": ["misterio", "plenitud", "gentiles", "inconclus", "erudición", "evangelismo", "raíz", "respet"],
    "modelEn": "Romans 11:25-26 speaks of a mystery: hardening has come upon part of Israel until the fullness of the Gentiles has come in, and so all Israel will be saved, treating God's dealings with the Jewish people as far from finished rather than a closed chapter. This unit synthesizes that understanding Judaism matters for scholarship because Christianity grew directly out of it, and matters for evangelism because Jewish people remain beloved for the sake of the fathers and are owed the same gospel Paul preached to them first, delivered with respect for their Scriptures, history, and ongoing role in God's unfinished plan.",
    "modelEs": "Romanos 11:25-26 habla de un misterio: ha acontecido a Israel endurecimiento en parte, hasta que haya entrado la plenitud de los gentiles, y luego todo Israel será salvo, tratando el trato de Dios con el pueblo judío como lejos de estar terminado en lugar de un capítulo cerrado. Esta unidad sintetiza que entender el judaísmo importa para la erudición porque el cristianismo creció directamente de él, e importa para el evangelismo porque las personas judías siguen siendo amadas por causa de los padres y se les debe el mismo evangelio que Pablo les predicó primero, entregado con respeto por sus Escrituras, su historia y su papel continuo en el plan inconcluso de Dios."
  }
];

const PREV_HREF = 'CTSWRUnit1.html';

const NEXT_HREF = 'CTSWRUnit3.html';
