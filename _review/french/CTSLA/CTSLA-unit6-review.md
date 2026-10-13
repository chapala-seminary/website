# French review draft — Initiation aux langues bibliques (Language Appreciation), Unit 6

English source: CTS Language Appreciation — Unit 6: Greek Alphabet Part 1 (Alpha through Mu)  
Source: chapala-seminary/website at commit `0597da909801` (src/content/lessons/CTSLA/6.json, src/content/units/CTSLA/6.json)  
Status: **machine draft, checked by a second pass — NOT yet reviewed by a French theological reader.** Do not publish.

Counts: 147 lesson blocks · 20 multiple choice · 10 fill-in · 10 short answer

## 1. Questions for Wayne

1. [Resolved: answer keys corrected in PR #74; French options reordered to match] URGENT, not a translation issue: the MC answer key in this unit's source points to a wrong option in 16 of 20 questions. Only MC2, MC11, MC13 and MC20 point to the right answer. Examples: MC1 answer index 2 = 'William Tyndale' (should be Tischendorf, index 1); MC4 index 0 = '22' (should be 24); MC8 index 1 = 'Delta' (should be Theta, index 0); MC15 index 2 = a wrongly ordered list (should be index 0). The live file src/content/units/CTSLA/6.json has the same indices, and the exam engine uses them as they are, so students who answer correctly are probably being marked wrong on the live site. The French keeps the English option order as instructed; once the English key is fixed, the same indices will be right for the French. Unit 1's source looks similar and should be checked too.
2. The English short-answer questions have no model answers. French model answers were written from the lesson; please check them. As in Unit 1, the keyword lists mix English and Spanish words in separate slots, so the French list repeats each concept for the Spanish half. In SA9 the English keywords include single letters ('h', 'r', 'p', 'n', 'v', 'b'), which match almost any answer; the French mirrors them. SA5 'and', SA8 'et' and SA9/SA3 'mu', 'nu' are also very short; the French uses phrases such as « signifie et » and « mot et » where it could.
3. MC18 calls Lambda 'the most important [letter] for Christian theology', but the lesson (b051) says that about Theta ('one of the most important in Christian theology'). A student who remembers the lesson may answer Theta (option D). Translated as written.
4. Matthieu 5:18: Louis Segond literally says « un seul iota ou un seul trait de lettre » (not 'jot'). That supports your point, but the MC9 stem would give away the answer if it quoted LSG, so the French stem paraphrases. Please confirm.
5. Exam-information blocks: b121–b124 list Certificate, Th.M. and M.Div. but leave out the Associate track that b119 describes, and b124 says 'all 30 questions' although the exam has 40 (20 + 10 + 10). The Th.M./M.Div. lines also say nothing about the fill-ins that b119 requires. Translated as written (same issue as Unit 1).
6. Some exam items rely on earlier units rather than this lesson: MC16 (Strong's ranges H1–H8674 / G1–G5624), MC19 why (Masoretes around AD 700), and SA9 (Rho and Nu are only mentioned in passing in b026 and b063; they are taught in Unit 7).
7. Letter names use standard French spellings (Bêta, Zêta, Êta, Thêta, Oméga), and the reader's language is « français » throughout (e.g. « Héritière en français », « comme le français et l'anglais »), following Unit 1. b051's 'G' as a stand-in for 'God' became « D » for « Dieu », as in the Spanish edition. Please confirm.
8. b110: the English transliteration of Matthew 4:23 has 'holen'; the Greek ὅλην has an eta, so the French prints 'holên' to match the course's ê-for-eta convention. Please confirm.

## Problems in the English source

- SA1: English prompt passes its own keywords
- SA2: English prompt passes its own keywords
- SA8: English prompt passes its own keywords
- SA9: English prompt passes its own keywords (single-letter keywords 'h', 'r', 'p', 'n', 'v', 'b' match almost any text; the French replaces them with phrases)
- SA10: English prompt passes its own keywords

## 2. Bible quotations (Louis Segond 1910)

Items marked **⚠** differ from the English (NKJV) wording in a way the lesson or exam depends on.

- **Apocalypse 22:13** — « Je suis l'alpha et l'oméga, le premier et le dernier, le commencement et la fin. »  
  _Verified on biblestudytools (LSG). Used in b006, b007, b112, b114 (first half only), b117 (first half only), MC12 why, SA8 model. '(NKJV)' changed to '(LSG)' in b007. LSG has the order 'le premier et le dernier, le commencement et la fin' (NKJV: 'the Beginning and the End, the First and the Last'); nothing in the lesson depends on the order. LSG prints 'alpha'/'oméga' in lowercase; the teaching prose capitalises the letter names._
- **⚠** **Matthieu 5:18** — « Car, je vous le dis en vérité, tant que le ciel et la terre ne passeront point, il ne disparaîtra pas de la loi un seul iota ou un seul trait de lettre, jusqu'à ce que tout soit arrivé. »  
  _Verified on biblestudytools (LSG). Quoted in b052 and MC9 why. English (KJV-style) says 'not one jot or one tittle'; LSG says « un seul iota ou un seul trait de lettre ». This helps the lesson (Jesus names the iota), but MC9's stem in English calls it 'one jot'; quoting LSG there would give away the answer 'Iota', so the French stem paraphrases (« pas même la plus petite lettre ne disparaîtra de la loi ») without quotation marks._
- **Matthieu 6:10** — « que ton règne vienne; que ta volonté soit faite sur la terre comme au ciel. »  
  _Verified on biblestudytools (LSG). « que ta volonté soit faite » used in b098, MC11 (options and why), Fill 9, SA6. MC11 option texts for bread/name/kingdom ('donne-nous aujourd'hui notre pain quotidien', 'que ton nom soit sanctifié', 'que ton règne vienne') match LSG Matthieu 6:9-11 (checked with the offline LSG tool)._
- **Romains 12:2** — « Ne vous conformez pas au siècle présent, mais soyez transformés par le renouvellement de l'intelligence, afin que vous discerniez quelle est la volonté de Dieu, ce qui est bon, agréable et parfait. »  
  _Verified on biblestudytools (LSG). b098 and MC11 why quote « quelle est la volonté de Dieu, ce qui est bon, agréable et parfait » (English: 'the good and acceptable and perfect will of God'). In LSG the adjectives describe what God's will is; the word « volonté » (thelêma) is kept, so the lesson's point stands._
- **Matthieu 2:1** — « Jésus étant né à Bethléhem en Judée, au temps du roi Hérode, voici des mages d'Orient arrivèrent à Jérusalem, »  
  _Verified on biblestudytools (LSG). b103, MC17 why, SA7: « à Bethléhem en Judée ». The English quotation substitutes the Greek spelling ('in Bêthleem of Judea'); the French keeps LSG's « Bethléhem » inside the quotation, and the surrounding sentence already gives the Greek form Bêthleem._
- **Luc 2:4** — « Joseph aussi monta de la Galilée, de la ville de Nazareth, pour se rendre en Judée, dans la ville de David, appelée Bethléhem, parce qu'il était de la maison et de la famille de David, »  
  _Verified on biblestudytools (LSG). b103, MC17 why: « dans la ville de David, appelée Bethléhem » (English quotation substitutes 'Bêthleem'; same handling as Matthieu 2:1)._
- **Matthieu 4:23** — « Jésus parcourait toute la Galilée, enseignant dans les synagogues, prêchant la bonne nouvelle du royaume, et guérissant toute maladie et toute infirmité parmi le peuple. »  
  _Checked with the offline LSG tool. b110 quotes only « Jésus parcourait toute la Galilée ». The English gloss 'And Jesus went...' renders the Greek kai; LSG has no « Et ». Transliteration 'holen' corrected to 'holên' (ὅλην has an eta), consistent with the lesson's ê-for-eta convention._
- **Jean 1:1** — « Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu. »  
  _Verified on biblestudytools (LSG). b060 and MC18 why quote « Au commencement était la Parole ». MC18's English why says 'In the beginning was the Logos' (an adapted quotation); French quotes LSG and adds « (en grec, le Logos) » outside the quotation marks. 'Word' = « Parole », as in Unit 1._

## 3. Terms for the reviewer to confirm

- **Greek letter names (Beta, Zeta, Eta, Theta, Omega)** → Bêta, Zêta, Êta, Thêta, Oméga (Alpha, Gamma, Delta, Epsilon, Iota, Kappa, Lambda, Mu unchanged) — Standard French spellings with circumflex/accent. Used everywhere, including tables, MC15 options and the catalogue blocks. Keywords and grading also accept the unaccented forms. The Spanish edition kept the English spellings (except Alfa, Épsilon).
- **Koiné** → la koinè (grec koinè) — Usual French spelling, feminine (« la koinè »), as in Unit 1. Fill 2 accepts koinè/koine/koinê (accents ignored) plus « grec koinè », « grec commun », « grec hellénistique ».
- **Septuagint (LXX)** → la Septante (LXX) — Normal French name. Fill 3 answer « Septante », also accepts « Septuaginta », « version des Septante », « Bible des Septante ».
- **English heir (table column)** → Héritière en français — Following the Unit 1 practice of making the reader's language French (Spanish edition: « Heredera en español »). The letter (« lettre ») is feminine, hence « héritière ».
- **steward (of the monastery)** → l'économe du monastère — The monk in charge of a monastery's goods; « l'intendant » would also work.
- **uncial script** → écriture onciale — Standard technical term; may be unfamiliar to some readers but the English uses the technical word too.
- **superhighway** → autoroute — SA2 keyword; kept the image.
- **the Lord's Prayer** → le Notre Père — Common name in francophone churches; « l'oraison dominicale » is more formal. SA6 keywords accept both « notre père » and « prière »/« oraison ».
- **vowel sounds ('father', 'bet', 'they', 'machine', 'go')** → « papa », « sept », « fête », « ami », « gare » — French example words chosen for the sound (as the Spanish edition did). « th » of Thêta still refers to English 'thin' because French has no such sound (Spanish edition does the same).

## 4. Lesson

Each block: French first, English source underneath.

**b001**  
Initiation aux langues bibliques — Unité 6 : L'alphabet grec, 1re partie (d'Alpha à Mu)

> EN: Language Appreciation — Unit 6: Greek Alphabet Part 1 (Alpha through Mu)

**b004**  
Unité 6 · Apocalypse 22:13 · L'alphabet grec, 1re partie

> EN: Unit 6 · Revelation 22:13 · The Greek Alphabet, Part 1

**b005**  
L'alphabet grec, 1re partie : d'Alpha à Mu

> EN: Greek Alphabet Part 1: Alpha through Mu

**b006**  
« Je suis l'alpha et l'oméga, le premier et le dernier, le commencement et la fin. »

> EN: "I am the Alpha and the Omega, the Beginning and the End, the First and the Last."

**b007**  
Écriture de l'Unité : « Je suis l'alpha et l'oméga, le premier et le dernier, le commencement et la fin. » — Apocalypse 22:13 (LSG)

> EN: Unit Scripture: "I am the Alpha and the Omega, the Beginning and the End, the First and the Last." — Revelation 22:13 (NKJV)

**b008**  
Orientation : le tissu rouge du mont Sinaï

> EN: Orientation: The Red Cloth at Mount Sinai

**b009**  
En février 1859, un bibliste allemand nommé Constantin von Tischendorf effectuait sa troisième visite à l'antique monastère de Sainte-Catherine, niché au pied du mont Sinaï, dans le désert égyptien. Il avait quarante-quatre ans ; il maîtrisait le grec, le latin, l'hébreu et une demi-douzaine d'autres langues, et il était célèbre dans les milieux savants d'Europe pour traquer les anciens manuscrits du Nouveau Testament dans les bibliothèques de monastères reculés. Quinze ans plus tôt, lors de sa première visite à Sainte-Catherine, il avait fait une découverte saisissante. Dans un panier d'osier rempli de vieux parchemins destinés à être brûlés comme combustible, il avait trouvé quarante-trois feuillets d'une Bible grecque plus ancienne que tout ce qu'il avait jamais vu. Les moines l'avaient laissé emporter ces quarante-trois pages. Il les avait publiées. Mais il était convaincu qu'il en existait davantage quelque part dans le monastère, et par deux fois il était revenu sans rien trouver.

> EN: In February of 1859, a German biblical scholar named Constantin von Tischendorf was making his third visit to the ancient monastery of Saint Catherine, perched at the foot of Mount Sinai in the Egyptian desert. He was forty-four years old, fluent in Greek, Latin, Hebrew, and a half-dozen other languages, and famous in European scholarly circles for hunting down ancient New Testament manuscripts in the libraries of remote monasteries. Fifteen years earlier, on his first visit to Saint Catherine's, he had found something startling. In a wicker basket of old parchments destined to be burned for fuel, he had discovered forty-three leaves of a Greek Bible older than anything he had ever seen. The monks had let him take those forty-three pages. He had published them. But he was convinced more existed somewhere in the monastery, and twice he had returned and found nothing.

**b010**  
Le dernier soir de sa troisième visite — le 4 février 1859, ses bagages faits, sa caravane prête à partir le lendemain matin — l'économe du monastère lui mentionna en passant, autour d'une tasse de café du soir, qu'il avait lui aussi un manuscrit grec dans sa cellule. Il alla le chercher. Le manuscrit était enveloppé dans un tissu rouge. Tischendorf déplia le tissu et vit trois cent quarante-six feuillets de parchemin, écrits dans une magnifique écriture grecque onciale. Il tenait entre ses mains la plus grande partie de l'Ancien Testament grec, tout le Nouveau Testament grec, et en plus deux écrits chrétiens anciens — un seul manuscrit datant d'environ 350 apr. J.-C., l'une des deux plus anciennes copies complètes de la Bible au monde.

> EN: On the last evening of his third visit — February 4, 1859, his bags packed, his caravan ready to leave the next morning — the steward of the monastery casually mentioned to him over an evening cup of coffee that he too had a Greek manuscript in his cell. He fetched it. It was wrapped in a red cloth. Tischendorf unfolded the cloth and saw three hundred and forty-six parchment leaves, written in beautiful Greek uncial script. He held in his hands most of the Greek Old Testament, the entire Greek New Testament, and two early Christian writings besides — a single manuscript from about AD 350, one of the two oldest complete copies of the Bible on earth.

**b011**  
Tischendorf écrivit plus tard qu'il ne dormit pas de la nuit. « Dormir même me semblait un sacrilège. » Il veilla, lisant à la lueur de la bougie, recopiant des passages, cherchant des différences avec les manuscrits plus tardifs, et n'en trouvant presque aucune. Il tenait entre ses mains le Nouveau Testament tel que l'Église primitive le lisait — les mots grecs eux-mêmes, mis par écrit seulement trois cents ans après les apôtres. Il finit par persuader les moines de prêter le manuscrit au tsar de Russie, afin qu'il soit transporté en sûreté et publié. Le manuscrit fut connu sous le nom de Codex Sinaiticus — le Livre du Sinaï. En 1933, le gouvernement soviétique le vendit au British Museum pour cent mille livres sterling, une somme astronomique. Il se trouve aujourd'hui à la British Library, à Londres : c'est le manuscrit biblique le plus étudié au monde.

> EN: Tischendorf later wrote that he did not sleep that night. "It seemed sacrilege even to sleep." He sat up reading by candlelight, copying out passages, looking for differences from later manuscripts, finding almost none. He had in his hands the New Testament as the early church read it — the very Greek words written down only three hundred years after the apostles. Eventually he persuaded the monks to lend the manuscript to the Tsar of Russia for safe transport and publication. The manuscript became known as Codex Sinaiticus — the Sinai Book. In 1933 the Soviet government sold it to the British Museum for one hundred thousand pounds, an astronomical sum. Today it sits in the British Library in London, the most-studied biblical manuscript in the world.

**b012**  
« Dormir même me semblait un sacrilège. » — Constantin Tischendorf à Sainte-Catherine, le 4 février 1859

> EN: "It seemed sacrilege even to sleep." — Constantin Tischendorf at Saint Catherine's, February 4, 1859

**b013**  
Pourquoi ouvrir l'Unité 6 avec cette histoire ? Pour la même raison que l'Unité 3 s'ouvrait avec un jeune Bédouin découvrant des rouleaux hébreux dans une grotte. Les manuscrits de la mer Morte ont prouvé que l'Ancien Testament hébreu avait été préservé presque sans changement à travers mille ans. Le Codex Sinaiticus prouve la même chose pour le Nouveau Testament grec. Quand les spécialistes ont comparé le texte du Codex Sinaiticus, du IVe siècle, aux manuscrits grecs médiévaux sur lesquels reposent nos Bibles imprimées, ils se sont révélés presque identiques. Mille deux cents ans les séparent, et les mots grecs concordent toujours. Les lettres grecques que vous allez apprendre — les mêmes lettres que Tischendorf vit briller sous sa bougie cette nuit-là au Sinaï — ont été fidèlement préservées pendant près de deux mille ans.

> EN: Why does this open Unit 6? For the same reason Unit 3 opened with a Bedouin boy discovering Hebrew scrolls in a cave. The Dead Sea Scrolls proved that the Hebrew Old Testament had been preserved across one thousand years almost unchanged. The Codex Sinaiticus proves the same thing for the Greek New Testament. When scholars compared the fourth-century text of Codex Sinaiticus to the medieval Greek manuscripts our printed Bibles are based on, they were almost identical. Twelve hundred years between them, and the Greek words still match. The Greek letters you are about to learn — the same letters Tischendorf saw glowing under his candle that night at Sinai — have been faithfully preserved for nearly two thousand years.

**b014**  
Où nous en sommes

> EN: Where we are

**b015**  
Vous avez terminé l'Unité 5 avec treize mots hébreux et une connaissance pratique de l'Ancien Testament. Vous traversez maintenant le pont. L'Unité 6 enseigne les douze premières lettres de l'alphabet grec : Alpha, Bêta, Gamma, Delta, Epsilon, Zêta, Êta, Thêta, Iota, Kappa, Lambda, Mu. L'Unité 7 enseigne les douze dernières et lit Jean 1:1. Les Unités 8 et 9 vous ouvrent les grands trésors de mots grecs du Nouveau Testament. L'Unité 10 vous apprend à utiliser les numéros Strong des trois manières — papier, téléphone, Internet complet — et l'Unité 11 est votre première véritable étude de mot. À partir d'ici, c'est la descente, dans le meilleur sens du terme : l'ascension est faite, et vous commencez à voir à quoi elle servait.

> EN: You finished Unit 5 with thirteen Hebrew words and a working acquaintance with the Old Testament. You cross the bridge now. Unit 6 teaches the first twelve letters of the Greek alphabet: Alpha, Beta, Gamma, Delta, Epsilon, Zeta, Eta, Theta, Iota, Kappa, Lambda, Mu. Unit 7 teaches the last twelve and reads John 1:1. Units 8 and 9 give you the great Greek word treasures of the New Testament. Unit 10 teaches you how to use Strong's numbers in all three ways — paper, phone, full internet — and Unit 11 is your first real word study. From here it is downhill in the best possible sense: the climbing is done, and you start to see what the climbing was for.

**b016**  
I. Le grec : un alphabet différent pour un Testament différent

> EN: I. Greek: A Different Alphabet for a Different Testament

**b017**  
Avant de regarder les lettres, regardons la langue. Vous avez appris dans l'Unité 1 que Dieu a préparé le grec pour l'Évangile. Vers 330 av. J.-C., Alexandre le Grand conquit la plus grande partie du monde connu, de la Grèce jusqu'à l'Inde, et partout où passaient ses armées, son grec commun — la koinè — devint la langue du commerce, de l'administration et de la conversation. Lorsque Jésus naquit, trois cents ans plus tard, toute personne lettrée, de Rome à Babylone, savait lire ou parler un peu de grec. L'Empire romain, qui avait conquis les Grecs, ne put pas supplanter la langue grecque ; au contraire, il se mit lui-même à parler grec. Un pêcheur de Galilée, un soldat de Capernaüm, un pharisien de Jérusalem et un philosophe stoïcien d'Athènes pouvaient tous tenir la même lettre et la lire. Dieu a construit son autoroute avant d'y faire rouler son Évangile.

> EN: Before we look at letters, let us look at the language. You learned in Unit 1 that God prepared Greek for the gospel. Around 330 BC, Alexander the Great conquered most of the known world from Greece to India, and wherever his armies went, his common Greek — Koiné — became the language of trade, government, and conversation. By the time Jesus was born three hundred years later, every literate person from Rome to Babylon could read or speak some Greek. The Roman Empire that conquered the Greeks could not displace the Greek language; instead it became Greek-speaking itself. A fisherman in Galilee, a soldier in Capernaum, a Pharisee in Jerusalem, and a Stoic philosopher in Athens could all hold the same letter and read it. God built His superhighway before He drove His gospel down it.

**b018**  
Cela eut quatre heureuses conséquences. Premièrement, les apôtres écrivirent le Nouveau Testament en grec koinè, et non dans leur araméen maternel. Ils voulaient que le monde le lise, et le grec était la langue du monde. Deuxièmement, l'Ancien Testament avait déjà été traduit en grec environ deux cent cinquante ans avant Jésus — la célèbre Septante (souvent abrégée LXX, le chiffre romain pour 70, car la tradition dit que soixante-dix ou soixante-douze savants la traduisirent à Alexandrie). Quand les apôtres citaient l'Ancien Testament, ils citaient habituellement la Septante, ce qui veut dire que l'Ancien Testament hébreu atteignit le monde non juif par le grec. Troisièmement, le grec devint la langue chrétienne universelle pendant les cinq premiers siècles de l'Église. Quatrièmement, quand les spécialistes veulent retrouver le texte le plus exact possible du Nouveau Testament, ils se tournent vers des manuscrits grecs comme le Codex Sinaiticus. Aucune traduction ne peut les remplacer.

> EN: This had four happy consequences. First, the apostles wrote the New Testament in Koiné Greek, not in their native Aramaic. They wanted the world to read it, and Greek was the world's language. Second, the Old Testament had already been translated into Greek about two hundred and fifty years before Jesus — the famous Septuagint (often abbreviated LXX, the Roman numeral for 70, because tradition says seventy or seventy-two scholars translated it in Alexandria). When the apostles quoted the Old Testament, they usually quoted the Septuagint, which means the Hebrew Old Testament reached the Gentile world through Greek. Third, Greek became the universal Christian language for the first five hundred years of the church. Fourth, when scholars want to recover the most accurate possible text of the New Testament, they go to Greek manuscripts like Codex Sinaiticus. No translation is allowed to substitute.

**b019**  
Le grec et l'hébreu côte à côte

> EN: Greek versus Hebrew: a side-by-side

**b020**  
CaractéristiqueHébreuGrec

> EN: FeatureHebrewGreek

**b021**  
Lettres22 consonnes (voyelles ajoutées sous forme de signes)24 lettres (voyelles intégrées)

> EN: Letters22 consonants (vowels added as marks)24 letters (vowels built in)

**b022**  
Sens de lectureDe droite à gaucheDe gauche à droite, comme le français et l'anglais

> EN: DirectionRight to leftLeft to right, like English and Spanish

**b023**  
Structure des motsRacines de trois consonnesRadicaux avec préfixes et terminaisons

> EN: Word structureThree-letter consonant rootsStems with prefixes and endings

**b024**  
FamiliaritéParaît étranger au premier regardBeaucoup de lettres ressemblent déjà à celles du français (A, B, E, Z, I, K, M, N, O, T, X, Y)

> EN: FamiliarityLooks alien at first sightMany letters already look like English (A, B, E, Z, I, K, M, N, O, T, X, Y)

**b025**  
Usage mathématiqueChaque lettre a une valeur numériqueLettres grecques employées en mathématiques et en sciences (alpha, bêta, gamma, pi, sigma, oméga)

> EN: Mathematical useEach letter has a number valueGreek letters used in math/science (alpha, beta, gamma, pi, sigma, omega)

**b026**  
Difficulté de lectureLe plus difficile : des formes inconnuesLe plus difficile : cela ressemble au français mais n'en est pas (ρ est r, pas p ; ν est n, pas v)

> EN: Reading difficultyHardest part: unfamiliar shapesHardest part: looks like English but isn't (ρ is r, not p; ν is n, not v)

**b027**  
Le fait le plus important sur le grec pour un lecteur occidental : l'alphabet grec est le père de l'alphabet latin, et l'alphabet latin est le père de celui du français et de l'anglais. Beaucoup de lettres grecques sont les ancêtres directs de lettres que vous écrivez déjà tous les jours. Alpha est devenu A. Bêta est devenu B. Gamma est devenu C et G. Iota est devenu I et J. Kappa est devenu K. Lambda est devenu L. Mu est devenu M. Vous n'apprenez pas un alphabet étranger à partir de rien ; vous faites la connaissance des grands-parents du vôtre.

> EN: The single most important fact about Greek for a Western reader: the Greek alphabet is the parent of the Latin alphabet, and the Latin alphabet is the parent of English and Spanish. Many Greek letters are direct ancestors of letters you already write every day. Alpha became A. Beta became B. Gamma became C and G. Iota became I and J. Kappa became K. Lambda became L. Mu became M. You are not learning a foreign alphabet from scratch; you are meeting the grandparents of your own.

**b028**  
II. D'Alpha à Epsilon : les cinq premières lettres

> EN: II. Alpha through Epsilon: The First Five Letters

**b029**  
Lisez chaque nom à haute voix. Remarquez la majuscule et la minuscule. Regardez l'héritière française. Puis écrivez chaque minuscule trois fois dans votre cahier. La main enseigne l'œil.

> EN: Read each name aloud. Notice the capital and lowercase forms. Look at the English heir. Then write each lowercase letter three times in your notebook. The hand teaches the eye.

**b030**  
MajusculeMinusculeNomSonHéritière en français

> EN: CapitalLowercaseNameSoundEnglish heir

**b031**  
ΑαAlpha« a » comme dans « papa »A

> EN: ΑαAlpha"a" as in "father"A

**b032**  
ΒβBêta« b » (en grec moderne, « v »)B

> EN: ΒβBeta"b" (in modern Greek, "v")B

**b033**  
ΓγGamma« g » comme dans « gare »C, G

> EN: ΓγGamma"g" as in "go"C, G

**b034**  
ΔδDelta« d »D

> EN: ΔδDelta"d"D

**b035**  
ΕεEpsilon« e » bref comme dans « sept »E

> EN: ΕεEpsilonshort "e" as in "bet"E

**b036**  
Remarques sur ces cinq lettres

> EN: Notes on these five letters

**b037**  
Alpha est la première lettre de l'alphabet grec. Comme l'Aleph hébreu dont elle descend, elle représente une voyelle « a ». Le mot français « alphabet » lui-même vient de alpha + bêta, les deux premières lettres de cette écriture. Les mathématiques emploient alpha pour désigner un « angle ». L'Alpha majuscule est identique au A français ; la minuscule ressemble à un ventre recourbé.

> EN: Alpha is the first letter of the Greek alphabet. Like the Hebrew Aleph from which it descends, it represents an "ah" vowel. The English word "alphabet" itself comes from alpha + beta, the first two letters of this script. Mathematics uses alpha for "angle." The Greek capital Alpha looks identical to English A; the lowercase looks like a curled stomach.

**b038**  
Bêta est la deuxième lettre et la source de notre B. Fait curieux : en grec ancien (le grec du Nouveau Testament), bêta se prononce « b » comme en français ; en grec moderne (le grec parlé aujourd'hui à Athènes), la même lettre se prononce « v ». Dans ce cours, nous suivrons la prononciation ancienne. Le Bêta majuscule ressemble au B français ; la minuscule ressemble à un B tracé rapidement et penché.

> EN: Beta is the second letter and the source of our B. Curious fact: in ancient Greek (the Greek of the New Testament) beta is pronounced "b" as in English; in modern Greek (the Greek spoken in Athens today) the same letter is pronounced "v." We will follow the ancient pronunciation in this course. Capital Beta looks like English B; lowercase looks like a B drawn quickly, leaning over.

**b039**  
Gamma est la troisième lettre et la source à la fois du C et du G français. Le mot grec pour « terre » est gê (γῆ) — d'où viennent en français « géographie » (description de la terre), « géologie » (étude de la terre), et ainsi de suite. Le Gamma majuscule ressemble à un L à l'envers. Le gamma minuscule ressemble à un « y » avec un crochet.

> EN: Gamma is the third letter and the source of both English C and English G. The Greek word for "earth" is gê (γῆ) — from which English gets "geography" (writing about the earth) and "geology" (study of the earth) and so on. Capital Gamma looks like an upside-down L. Lowercase gamma looks like a "y" with a hook.

**b040**  
Delta est la quatrième lettre et la source de notre D. Le Delta majuscule ressemble à un triangle — d'où les mathématiciens tirent le symbole de la « variation » ou de la « différence ». Les géographes ont tiré le mot « delta » d'un fleuve de cette même forme triangulaire (l'embouchure du Nil ressemblait à cette lettre). Le delta minuscule ressemble à un « d » stylisé.

> EN: Delta is the fourth letter and the source of our D. The capital Delta looks like a triangle — from which mathematicians get the symbol for "change" or "difference." Geographers got the word "river delta" from the same triangular shape (the mouth of the Nile resembled this letter). Lowercase delta looks like a stylized "d."

**b041**  
Epsilon est la cinquième lettre, un son « e » bref. Son nom signifie littéralement « e simple » (e psilon) — pour le distinguer du « e » long de l'Êta que nous allons rencontrer dans un instant. L'Epsilon majuscule ressemble à un E français ; la minuscule ressemble à un 3 inversé, ou à notre propre « e » vu dans un miroir.

> EN: Epsilon is the fifth letter, a short "e" sound. The name literally means "simple e" (e psilon) — to distinguish it from the long "e" of Eta which we will meet in a moment. Capital Epsilon looks like an English E; lowercase looks like a backwards 3 or like our own "e" mirrored.

**b042**  
III. De Zêta à Iota : les lettres six à neuf

> EN: III. Zeta through Iota: Letters Six through Nine

**b043**  
MajusculeMinusculeNomSonHéritière en français

> EN: CapitalLowercaseNameSoundEnglish heir

**b044**  
ΖζZêta« z » (ou « dz »)Z

> EN: ΖζZeta"z" (or "dz")Z

**b045**  
ΗηÊta« ê » long comme dans « fête »H (visuellement seulement)

> EN: ΗηEtalong "e" as in "they"H (visually only)

**b046**  
ΘθThêta« th » comme dans l'anglais « thin » (sourd)(pas d'héritière directe)

> EN: ΘθTheta"th" as in "thin" (voiceless)(no direct heir)

**b047**  
ΙιIota« i » comme dans « ami »I, J

> EN: ΙιIota"i" as in "machine"I, J

**b048**  
Remarques sur ces quatre lettres

> EN: Notes on these four letters

**b049**  
Zêta est la sixième lettre et la source de notre Z. Le Zêta majuscule ressemble au Z français ; la minuscule ressemble à un Z ondulé avec une fioriture.

> EN: Zeta is the sixth letter and the source of our Z. Capital Zeta looks like English Z; lowercase looks like a wiggly Z with a flourish.

**b050**  
Êta est la septième lettre. Important : l'Êta majuscule ressemble au H français, mais il produit un son « e » long, et non un son « h ». C'est l'un des pièges les plus courants pour ceux qui commencent à lire le grec. Quand vous voyez Η ou η en grec, ne dites pas « h » ; dites un son long « é » ou « i ». Le mot grec pour « la » (article féminin singulier) est hê (ἡ), et le mot grec pour « ou » est ê (ἤ). Tous deux s'écrivent avec un Êta mais se prononcent comme un « e » long. L'êta minuscule ressemble à un n minuscule français dont la jambe droite descend sous la ligne.

> EN: Eta is the seventh letter. Important: the capital Eta looks like English H, but it makes a long "e" sound, not an "h" sound. This is one of the most common pitfalls for new readers of Greek. When you see Η or η in Greek, do not say "h"; say a long "ay" or "ee" sound. The Greek word for "the" (feminine, singular) is hê (ἡ), and the Greek word for "or" is ê (ἤ). Both are spelled with Eta but pronounced like a long "e." Lowercase eta looks like a lowercase English n with the right leg extended below the line.

**b051**  
Thêta est la huitième lettre, et l'une des plus importantes de la théologie chrétienne. C'est la première lettre de theos (θεός), le mot grec pour « Dieu ». Vous verrez parfois des inscriptions chrétiennes anciennes dans lesquelles une seule lettre Θ représente le mot entier « Dieu » — comme nous pourrions écrire « D » à sa place. Le Thêta majuscule ressemble à un O traversé d'une barre horizontale ; la minuscule ressemble à un ovale haut et étroit coupé en deux par un trait. Le son est le « th » doux de l'anglais « thin » ou « think », et non le « th » plus dur de « this ».

> EN: Theta is the eighth letter, and one of the most important in Christian theology. It is the first letter of theos (θεός), the Greek word for "God." Sometimes you will see early Christian inscriptions in which a single letter Θ stands for the entire word "God" — the way we might write "G" as a stand-in. Capital Theta looks like an O with a horizontal bar inside; lowercase looks like a tall thin oval bisected by a line. The sound is the soft English "th" of "thin" or "think," not the harder "th" of "this."

**b052**  
Iota est la neuvième lettre et la plus petite. Vous l'avez déjà rencontrée dans l'Unité 2 — c'est la descendante grecque du Yod hébreu, et c'est la lettre même dont Jésus parlait en Matthieu 5:18 quand il a dit : « il ne disparaîtra pas de la loi un seul iota ou un seul trait de lettre ». Iota grec = Yod hébreu = la plus petite lettre. De l'iota descendent à la fois le I et le J français. C'est aussi l'origine de l'expression française « pas d'un iota », qui signifie « pas le moins du monde ».

> EN: Iota is the ninth letter and the smallest. You met it already in Unit 2 — this is the Greek descendant of the Hebrew Yod, and it is the very letter Jesus referred to in Matthew 5:18 when He said "not one jot or one tittle will by no means pass from the law." Greek iota = Hebrew Yod = the smallest letter. From iota descend both English I and English J. It is also the root of the English idiom "not one iota" meaning "not the smallest bit."

**b053**  
IV. De Kappa à Mu : les lettres dix à douze

> EN: IV. Kappa through Mu: Letters Ten through Twelve

**b054**  
MajusculeMinusculeNomSonHéritière en français

> EN: CapitalLowercaseNameSoundEnglish heir

**b055**  
ΚκKappa« k »K, C (dur)

> EN: ΚκKappa"k"K, C (hard)

**b056**  
ΛλLambda« l »L

> EN: ΛλLambda"l"L

**b057**  
ΜμMu« m »M

> EN: ΜμMu"m"M

**b058**  
Remarques sur ces trois lettres

> EN: Notes on these three letters

**b059**  
Kappa est la dixième lettre, la source grecque de notre K. C'est un son « k » net et dur. Le Kappa majuscule est identique au K français ; la minuscule ressemble à une version plus petite de la majuscule. Beaucoup de mots grecs entrés en français avec un son « c » dur (cardiaque, cosmique, caractère) commençaient à l'origine par un Kappa.

> EN: Kappa is the tenth letter, the Greek source of our K. It is a clean, hard "k" sound. Capital Kappa looks identical to English K; lowercase looks like a smaller version of the capital. Many Greek words that came into English with a hard "c" sound (cardiac, cosmic, character) originally began with Kappa.

**b060**  
Lambda est la onzième lettre, la source de notre L. Le Lambda majuscule ressemble à un V à l'envers ou à un toit pointu ; le lambda minuscule ressemble à un « l » au sommet fourchu. Le mot grec logos (λόγος), « parole », commence par un Lambda — le même mot qui ouvre l'Évangile de Jean (« Au commencement était la Parole »). Nous étudierons logos en détail dans l'Unité 8.

> EN: Lambda is the eleventh letter, the source of our L. Capital Lambda looks like an upside-down V or a peaked roof; lowercase lambda looks like an "l" with a forked top. The Greek word logos (λόγος), "word," begins with Lambda — the same word that opens the Gospel of John ("In the beginning was the Word"). We will study logos in detail in Unit 8.

**b061**  
Mu est la douzième lettre, la source de notre M. Le Mu majuscule est identique au M français ; la minuscule ressemble presque à un « u » français avec une queue qui pend sous la ligne. Mu ouvre beaucoup de mots grecs importants : mathêtês (μαθητής, disciple), megas (μέγας, grand), Messias (Μεσσίας, Messie, transcrit de l'hébreu). Les scientifiques connaissent le mu minuscule comme symbole de « micro- » (un millionième).

> EN: Mu is the twelfth letter, the source of our M. Capital Mu looks identical to English M; lowercase looks almost like an English "u" with a tail that hangs below the line. Mu opens many important Greek words: mathetes (μαθητής, disciple), megas (μέγας, great), Messias (Μεσσίας, Messiah, transliterated from Hebrew). Scientists know lowercase mu as the symbol for "micro-" (one millionth).

**b062**  
Douze de faites, douze à venir

> EN: Twelve down, twelve to go

**b063**  
Vous venez d'apprendre la moitié de l'alphabet grec. Les majuscules que vous connaissez déjà ressemblent à A, B, Γ (nouvelle), Δ (nouvelle), E, Z, H, Θ (nouvelle), I, K, Λ (nouvelle), M. Sur ces douze, huit sont déjà identiques à des lettres françaises et seulement quatre (Gamma, Delta, Thêta, Lambda) ont des formes visiblement différentes. Le grec est plus doux pour les yeux occidentaux que l'hébreu. La difficulté du grec n'est pas l'étrangeté des formes ; la difficulté, c'est de se rappeler que certaines formes qui ressemblent à des lettres françaises signifient en réalité autre chose (Êta n'est pas H, Rhô ne sera pas P, Nu ne sera pas V). Vous avez déjà franchi le premier de ces pièges ce soir.

> EN: You have just learned half the Greek alphabet. The capital letters you already know look like A, B, Γ (new), Δ (new), E, Z, H, Θ (new), I, K, Λ (new), M. Of those twelve, eight already look identical to English/Spanish letters and only four (Gamma, Delta, Theta, Lambda) have visibly different shapes. Greek is gentler on Western eyes than Hebrew. The hard part with Greek is not the strangeness of the shapes; the hard part is remembering that some shapes that look like English letters actually mean something different (Eta is not H, Rho will not be P, Nu will not be V). You have already cleared the first of those traps tonight.

**b064**  
V. Écrire les lettres à la main

> EN: V. Writing the Letters by Hand

**b065**  
Vous avez déjà rencontré cette même pratique avec les lettres hébraïques. Voici les lettres grecques. Ce sont les formes minuscules imprimées — celles que vous lisez réellement dans un Nouveau Testament grec ; la majuscule est indiquée à côté du nom, pour référence. Le grand caractère est votre modèle. Recopiez la minuscule dans votre cahier, en suivant les traits numérotés, jusqu'à ce que votre main trace la forme sans y penser. Le sigma est à cheval sur les deux moitiés de l'alphabet — vous rencontrerez ses deux formes minuscules dans l'Unité 7. La main enseigne l'œil.

> EN: You met the same practice with the Hebrew letters. Here are the Greek ones. These are the printed lowercase (minuscule) forms — the forms you actually read in a Greek New Testament; the capital is shown beside the name for reference. The large character is your model. Copy the lowercase letter into your notebook, following the numbered strokes, until your hand makes the shape without thinking. Sigma is split across the two halves of the alphabet — you will meet its two lowercase forms in Unit 7. The hand teaches the eye.

**b066**  
Un seul trait continu : commencez en haut à droite, courbez vers la gauche et vers le bas pour former un bol arrondi, puis remontez et terminez par une petite queue à droite.

> EN: One continuous stroke: start at the upper right, curve left and down to make a round bowl, then come back up and finish with a short tail on the right.

**b067**  
Un grand trait vertical qui descend sous la ligne.

> EN: A tall vertical stroke that dips below the line.

**b068**  
Deux bosses sur le côté droit, une boucle en haut et une en bas — comme un « B » tracé vite et penché.

> EN: Two bumps on the right side, an upper and a lower loop — like a quickly drawn 'B' leaning over.

**b069**  
Un petit trait en diagonale qui arrive au centre depuis le haut à gauche.

> EN: A short diagonal coming into the center from the upper left.

**b070**  
Un trait qui descend sous la ligne en se courbant vers la gauche — la forme d'un « y ».

> EN: A stroke dropping below the line and curving left — the shape of a 'y'.

**b071**  
Une petite boucle en haut.

> EN: A small loop at the top.

**b072**  
En dessous, un ventre arrondi — comme un 6 bouclé ou un « d » stylisé.

> EN: A round belly curving below it — like a curly 6 or a stylized 'd'.

**b073**  
Deux courbes superposées ouvertes vers la droite — comme un 3 arrondi inversé.

> EN: Two stacked curves that open to the right — like a rounded backwards 3.

**b074**  
Une petite vague en haut.

> EN: A small wave across the top.

**b075**  
Un trait qui descend en balayant sous la ligne et se termine par un petit crochet à gauche — un « z » aplati avec une queue.

> EN: A stroke sweeping down below the line, ending in a little left hook — a flattened 'z' with a tail.

**b076**  
Une bosse comme la lettre « n ».

> EN: A hump like the letter 'n'.

**b077**  
Mais la jambe droite descend tout droit sous la ligne.

> EN: But the right leg drops straight down below the line.

**b078**  
Un ovale.

> EN: An oval.

**b079**  
Un petit trait horizontal en plein milieu.

> EN: A short horizontal line straight across its middle.

**b080**  
Un seul petit trait droit vers le bas, posé sur la ligne — et pas de point au-dessus.

> EN: One short stroke straight down, sitting on the line — and no dot on top.

**b081**  
Un petit trait vertical.

> EN: A short vertical stroke.

**b082**  
Deux bras qui partent vers la droite depuis son milieu — l'un vers le haut, l'autre vers le bas — comme un petit « k ».

> EN: Two arms branching out to the right from its middle — one up, one down — like a small 'k'.

**b083**  
Un grand trait qui monte du bas à gauche jusqu'à un sommet.

> EN: A tall stroke rising from the lower left up to a peak.

**b084**  
Un second trait qui redescend vers le bas à droite — un V à l'envers (le côté droit commence un peu plus haut).

> EN: A second stroke down to the lower right — an upside-down V (the right side starts a touch higher).

**b085**  
Un trait qui descend sous la ligne, à gauche.

> EN: A stroke that drops below the line on the left.

**b086**  
Puis remonte et passe par-dessus pour former un « u » — comme un « u » avec une queue devant.

> EN: Then up and over into a 'u' shape — like a 'u' with a tail in front.

**b087**  
VI. Lire vos premiers mots grecs

> EN: VI. Reading Your First Greek Words

**b088**  
Vous connaissez maintenant assez de grec pour lire plusieurs vrais mots du Nouveau Testament. Le grec se lit de gauche à droite, comme le français et l'anglais. Lisez chaque mot à haute voix. Le numéro Strong est donné pour chacun, afin que vous puissiez le chercher ce soir.

> EN: You now know enough Greek to read several real New Testament words. Greek reads left to right, like English and Spanish. Read each word out loud. Strong's number is given for each so you can look it up tonight.

**b089**  
καί

> EN: καί

**b090**  
kai

> EN: kai

**b091**  
Strong G2532

> EN: Strong's G2532

**b092**  
« et / aussi / même »

> EN: "and / also / even"

**b093**  
Kai est le mot le plus fréquent de tout le Nouveau Testament grec. Il apparaît environ neuf mille fois. C'est la conjonction bonne à tout faire — « et » — qui enfile les récits des Évangiles comme des perles sur un fil. Ouvrez n'importe quel chapitre de Marc ou de Jean, et vous verrez kai commencer presque une phrase sur deux. Ses trois lettres sont Kappa-Alpha-Iota : k-a-i. Le petit signe au-dessus de l'iota est un accent grec — ne vous laissez pas distraire. Le mot est simplement kai, et il signifie « et ».

> EN: Kai is the most common word in the entire Greek New Testament. It appears about nine thousand times. It is the workhorse conjunction — "and" — that strings the Gospel narratives together like beads on a string. Open any chapter of Mark or any chapter of John and you will see kai begin almost every other sentence. The three letters are Kappa-Alpha-Iota: k-a-i. The little mark over the iota is a Greek accent — do not let it distract you. The word is just kai, and it means "and."

**b094**  
θέλημα

> EN: θέλημα

**b095**  
thelêma

> EN: thelêma

**b096**  
Strong G2307

> EN: Strong's G2307

**b097**  
« volonté / désir / souhait »

> EN: "will / desire / wish"

**b098**  
Thelêma est le mot grec pour « volonté » ou « désir » — ce qu'une personne veut. Ses six lettres sont Thêta-Epsilon-Lambda-Êta-Mu-Alpha : th-e-l-ê-m-a. Remarquez le Thêta au début (le « th » doux de l'anglais « thin ») et l'Êta en quatrième position (« e » long). C'est le mot que Jésus a employé dans le Notre Père : « Genêthêtô to thelêma sou » — « que ta volonté soit faite » (Matthieu 6:10). C'est le mot de Romains 12:2, quand Paul appelle les croyants à discerner « quelle est la volonté de Dieu, ce qui est bon, agréable et parfait ». La prochaine fois que vous prierez « que ta volonté soit faite », vous prierez avec thelêma à l'oreille.

> EN: Thelêma is the Greek word for "will" or "desire" — what a person wants. The six letters are Theta-Epsilon-Lambda-Eta-Mu-Alpha: th-e-l-ê-m-a. Notice the Theta at the start (the soft "th" of "thin"), and the Eta as the fourth letter (long "e"). This is the word Jesus used in the Lord's Prayer: "Genêthêtô to thelêma sou" — "Thy will be done" (Matthew 6:10). It is the word in Romans 12:2 when Paul calls believers to discern "the good and acceptable and perfect will of God." The next time you pray "Thy will be done," you will be praying with thelêma in your ear.

**b099**  
Βηθλέεμ

> EN: Βηθλέεμ

**b100**  
Bêthleem

> EN: Bêthleem

**b101**  
Strong G965

> EN: Strong's G965

**b102**  
« Bethléhem »

> EN: "Bethlehem"

**b103**  
La transcription grecque du nom de lieu hébreu Bet-lechem (« maison du pain »). Ses sept lettres couvrent la plus grande partie de notre nouvel alphabet : Bêta-Êta-Thêta-Lambda-Epsilon-Epsilon-Mu. Lisez-les dans l'ordre, de gauche à droite : B-ê-th-l-e-e-m. Le mot apparaît en Matthieu 2:1 (les mages cherchant l'enfant né « à Bethléhem en Judée ») et de nouveau en Luc 2:4 (Joseph montant « dans la ville de David, appelée Bethléhem »). Numéro Strong G965 dans n'importe quelle concordance grecque.

> EN: The Greek transliteration of the Hebrew place-name Bet-lechem ("house of bread"). The seven letters spread across most of our new alphabet: Beta-Eta-Theta-Lambda-Epsilon-Epsilon-Mu. Read them in order, left to right: B-ê-th-l-e-e-m. The word appears in Matthew 2:1 (the Magi seeking the child born "in Bêthleem of Judea") and again in Luke 2:4 (Joseph going up to "the city of David which is called Bêthleem"). Strong's number G965 in any Greek concordance.

**b104**  
Avec seulement douze lettres grecques, vous avez lu le mot que Jésus a prié à Gethsémané, la conjonction qui enfile les Évangiles, et la ville où il est né.

> EN: In just twelve Greek letters, you have read the word Jesus prayed in Gethsemane, the conjunction that strings the Gospels together, and the town where He was born.

**b105**  
Encore un, pour le plaisir

> EN: One more, just because

**b106**  
Γαλιλαία

> EN: Γαλιλαία

**b107**  
Galilaia

> EN: Galilaia

**b108**  
Strong G1056

> EN: Strong's G1056

**b109**  
« Galilée »

> EN: "Galilee"

**b110**  
Le nom grec de la région où Jésus a grandi et exercé son ministère. Huit lettres : Gamma-Alpha-Lambda-Iota-Lambda-Alpha-Iota-Alpha. Lisez-les : G-a-l-i-l-a-i-a. L'accent au-dessus du second iota est un accent tonique — le mot se prononce « Ga-li-LAÏ-a ». Matthieu 4:23 : « Kai periêgen ho Iêsous holên tên Galilaian » — « Jésus parcourait toute la Galilée ». Il y a deux unités, vous n'auriez pas pu lire cela. Maintenant, vous le pouvez.

> EN: The Greek name for the region where Jesus grew up and ministered. Eight letters: Gamma-Alpha-Lambda-Iota-Lambda-Alpha-Iota-Alpha. Read them out: G-a-l-i-l-a-i-a. The accent mark above the second iota is a stress mark — the word is pronounced "Ga-li-LAI-a." Matthew 4:23: "Kai periêgen ho Iêsous holen tên Galilaian" — "And Jesus went throughout all Galilee." Two units ago you could not have read this. Now you can.

**b111**  
VII. Pour conclure : l'Alpha et l'Oméga

> EN: VII. A Closer: Alpha and Omega

**b112**  
Ouvrez votre Bible en Apocalypse 22:13. C'est Christ qui parle : « Je suis l'alpha et l'oméga, le premier et le dernier, le commencement et la fin. » Vous avez lu ces mots toute votre vie chrétienne. Jusqu'à ce soir, vous les connaissiez comme une image : Christ, le premier et le dernier. Maintenant, vous pouvez les lire comme une leçon d'alphabet grec sortie directement de la bouche du Seigneur ressuscité. Alpha est la première lettre de l'alphabet grec — la lettre que vous avez apprise il y a dix minutes. Oméga est la dernière lettre de l'alphabet grec — la lettre que vous apprendrez dans l'Unité 7. Christ revendique l'alphabet grec lui-même comme son titre. Il est tout, de A à Z. Il est ce par quoi l'alphabet commence et ce par quoi l'alphabet finit. Toute la langue — et, par extension, tout le Nouveau Testament écrit — lui appartient.

> EN: Open your Bible to Revelation 22:13. Christ is speaking: "I am the Alpha and the Omega, the Beginning and the End, the First and the Last." You have read these words your whole Christian life. Until tonight you knew them as a metaphor: Christ as first and last. Now you can read them as a Greek alphabet lesson coming directly from the lips of the risen Lord. Alpha is the first letter of the Greek alphabet — the letter you learned ten minutes ago. Omega is the last letter of the Greek alphabet — the letter you will learn in Unit 7. Christ is claiming the Greek alphabet itself as His title. He is everything from A to Z. He is what the alphabet begins with and what the alphabet ends with. The whole language — and by extension the whole written New Testament — is His.

**b113**  
Arrêtez-vous et remarquez autre chose. Dans l'Unité 3, nous avons vu que le petit mot hébreu et de Genèse 1:1 s'écrit Aleph-Tav — la première et la dernière lettre de l'alphabet hébreu, l'Alpha et l'Oméga hébreux inscrits dans la toute première phrase de la Bible. Aleph-Tav en hébreu, Alpha-Oméga en grec. La même idée, dans les deux langues, encadrant les deux Testaments. Christ dans l'hébreu. Christ dans le grec. La première phrase de la Genèse contient discrètement le titre que le dernier livre de la Bible proclamera ouvertement.

> EN: Stop and notice something further. In Unit 3 we saw that the little Hebrew word et in Genesis 1:1 is spelled Aleph-Tav — the first and last letters of the Hebrew alphabet, the Hebrew Alpha and Omega built into the very first sentence of the Bible. Hebrew Aleph-Tav, Greek Alpha-Omega. The same idea, in both languages, framing both Testaments. Christ in the Hebrew. Christ in the Greek. The first sentence of Genesis quietly contains the title that the last book of the Bible will speak openly.

**b114**  
« Je suis l'alpha et l'oméga » — la première et la dernière lettre de l'alphabet grec, le titre que Christ s'est choisi.

> EN: "I am the Alpha and the Omega — the first and last letters of the Greek alphabet, the title Christ chose for Himself."

**b115**  
Vous avez maintenant appris la première lettre de son titre. À la fin de l'Unité 7, vous connaîtrez la dernière. À la fin de l'Unité 8, vous connaîtrez le nom de Parole qui lui fut donné quand il a pris chair : Logos. La route devant vous est lumineuse.

> EN: You have now learned the first letter of His title. By the end of Unit 7 you will know the last. By the end of Unit 8 you will know the Word He was called when He took on flesh: Logos. The road ahead is bright.

**b116**  
Activité du cahier (papier et stylo)

> EN: Notebook Activity (paper and pen)

**b117**  
Ouvrez votre cahier à une nouvelle page. Intitulez-la « Unité 6 — La première moitié de l'alphabet grec ». Tracez un tableau de cinq colonnes : Majuscule, Minuscule, Nom, Son, Héritière en français. Remplissez-le avec les douze lettres dans l'ordre : d'Alpha à Mu. Sous le tableau, écrivez trois lignes : (1) « Je suis l'alpha et l'oméga » — Apocalypse 22:13. (2) Thelêma = la volonté de Dieu. (3) Kai = « et ». Sous ces lignes, écrivez encore cinq fois, lentement, chacune des douze minuscules grecques. Le grec est plus aimable pour votre main que l'hébreu : il se pose à plat sur la ligne, il va de gauche à droite, et beaucoup de ses lettres sont les ancêtres directs de lettres que vous écrivez depuis l'enfance. Bienvenue dans le second alphabet de la Bible.

> EN: Open your notebook to a fresh page. Title it "Unit 6 — The First Half of the Greek Alphabet." Make a table with five columns: Capital, Lowercase, Name, Sound, English/Spanish heir. Fill in all twelve letters in order: Alpha through Mu. Below the table, write three lines: (1) "I am the Alpha and the Omega" — Revelation 22:13. (2) Thelêma = the will of God. (3) Kai = "and." Below the lines, write each of the twelve Greek lowercase letters five more times slowly. Greek is friendlier to your hand than Hebrew was: it sits flat on the line, it goes left to right, and many letters are direct ancestors of letters you have been writing since childhood. Welcome to the second alphabet of the Bible.

**b118**  
Examen de l'Unité 6

> EN: Unit 6 Examination

**b119**  
Parcours Certificat : les 20 questions à choix multiples. Parcours Associé en divinité : les questions à choix multiples et les 10 phrases à compléter. M.Div. et Th.M. : les questions à choix multiples, les phrases à compléter et les 10 questions à réponse courte. Il faut obtenir 90 % dans chaque partie pour réussir. Si vous ne réussissez pas, l'examen impose un court délai avant que vous puissiez réessayer.

> EN: Certificate track: the 20 multiple-choice questions. Associate: multiple choice and the 10 fill-in-the-blank questions. M.Div. and Th.M.: multiple choice, fill-ins and the 10 short-answer questions. 90% of each part is required to pass. If you do not pass, the exam waits a short time before you can try again.

**b120**  
Votre parcours

> EN: Your Track

**b121**  
Certificat de ministère — seules les 20 questions à choix multiples comptent (il faut 18/20).

> EN: Certificate of Ministry — only the 20 multiple-choice count (need 18/20).

**b122**  
Th.M. — 20 questions à choix multiples (18/20) et 10 questions à réponse courte (9/10).

> EN: Master of Theology — 20 multiple-choice (18/20) and 10 short-answer (9/10).

**b123**  
M.Div. — 20 questions à choix multiples (18/20) et 10 questions à réponse courte (9/10).

> EN: Master of Divinity — 20 multiple-choice (18/20) and 10 short-answer (9/10).

**b124**  
Tout le monde peut lire et répondre aux 30 questions. Tentatives illimitées — recommencez autant de fois que nécessaire.

> EN: Everyone may read and answer all 30 questions. Unlimited attempts — retake as many times as needed.

**b125**  
📚 Catalogue / Catálogo

> EN: 📚 Catalog / Catálogo

**b126**  
Alpha · Α α

> EN: Alpha · Α α

**b127**  
α

> EN: α

**b128**  
Bêta · Β β

> EN: Beta · Β β

**b129**  
β

> EN: β

**b130**  
Gamma · Γ γ

> EN: Gamma · Γ γ

**b131**  
γ

> EN: γ

**b132**  
Delta · Δ δ

> EN: Delta · Δ δ

**b133**  
δ

> EN: δ

**b134**  
Epsilon · Ε ε

> EN: Epsilon · Ε ε

**b135**  
ε

> EN: ε

**b136**  
Zêta · Ζ ζ

> EN: Zeta · Ζ ζ

**b137**  
ζ

> EN: ζ

**b138**  
Êta · Η η

> EN: Eta · Η η

**b139**  
η

> EN: η

**b140**  
Thêta · Θ θ

> EN: Theta · Θ θ

**b141**  
θ

> EN: θ

**b142**  
Iota · Ι ι

> EN: Iota · Ι ι

**b143**  
ι

> EN: ι

**b144**  
Kappa · Κ κ

> EN: Kappa · Κ κ

**b145**  
κ

> EN: κ

**b146**  
Lambda · Λ λ

> EN: Lambda · Λ λ

**b147**  
λ

> EN: λ

**b148**  
Mu · Μ μ

> EN: Mu · Μ μ

**b149**  
μ

> EN: μ

## 5. Multiple choice

✓ marks the keyed answer (same position in all languages).

**1. Qui a découvert le Codex Sinaiticus en 1859 au monastère Sainte-Catherine, sur le mont Sinaï ?**  
· A. James Strong  
· B. William Tyndale  
✓ C. Constantin von Tischendorf  
· D. Érasme de Rotterdam  
_Pourquoi :_ Constantin von Tischendorf, un bibliste allemand, effectuait en février 1859 sa troisième visite à Sainte-Catherine lorsque l'économe lui montra en passant un manuscrit enveloppé dans un tissu rouge. Il s'agissait de la plus grande partie de l'Ancien Testament grec et de tout le Nouveau Testament grec, datant d'environ 350 apr. J.-C. — l'une des deux plus anciennes copies complètes de la Bible au monde.  
> EN: Who discovered Codex Sinaiticus in 1859 at St. Catherine's Monastery on Mount Sinai? — ✓ Constantin von Tischendorf

**2. Qu'est-ce que le Codex Sinaiticus, et que prouve-t-il au sujet du texte du Nouveau Testament ?**  
· A. Une Bible latine médiévale qui prouve que la Vulgate est le texte original  
· B. Un papyrus égyptien ne contenant qu'un seul Évangile  
✓ C. Un manuscrit grec d'environ 350 apr. J.-C., presque identique aux textes grecs médiévaux, qui prouve que le Nouveau Testament a été fidèlement préservé pendant près de 2 000 ans  
· D. Une copie des lettres de Paul datant du Ier siècle  
_Pourquoi :_ Le Codex Sinaiticus est un manuscrit grec d'environ 350 apr. J.-C. — l'une des deux plus anciennes copies complètes de la Bible. Sa quasi-identité avec les manuscrits grecs médiévaux (mille deux cents ans plus tard) prouve ce que les manuscrits de la mer Morte ont prouvé pour l'Ancien Testament hébreu : le texte biblique a été fidèlement préservé au fil des siècles.  
> EN: What is Codex Sinaiticus, and what does it prove about the New Testament text? — ✓ A ca. AD 350 Greek manuscript whose near-identity with medieval Greek texts proves the New Testament has been faithfully preserved for nearly 2,000 years

**3. Qui a répandu la langue grecque dans le monde méditerranéen antique par la conquête militaire, la préparant à devenir la langue du Nouveau Testament ?**  
· A. Jules César  
· B. Constantin le Grand  
✓ C. Alexandre le Grand (vers 330 av. J.-C.)  
· D. Ponce Pilate  
_Pourquoi :_ Alexandre le Grand conquit la plus grande partie du monde connu, de la Grèce à l'Inde, vers 330 av. J.-C. Partout où passaient ses armées, le grec koinè devint la langue commune du commerce, de l'administration et de la conversation. Au temps de Christ, toute personne lettrée, de Rome à Babylone, savait lire ou parler un peu de grec — Dieu a construit son autoroute avant d'envoyer son Évangile.  
> EN: Who spread the Greek language across the ancient Mediterranean world by military conquest, preparing it as the language of the New Testament? — ✓ Alexander the Great (around 330 BC)

**4. Combien de lettres compte l'alphabet grec ?**  
· A. 22  
✓ B. 24  
· C. 26  
· D. 30  
_Pourquoi :_ L'alphabet grec compte 24 lettres, voyelles comprises (contrairement à l'hébreu, qui a 22 consonnes, les voyelles ayant été ajoutées plus tard sous forme de signes).  
> EN: How many letters are in the Greek alphabet? — ✓ 24

**5. Dans quel sens le grec se lit-il ?**  
· A. De droite à gauche, comme l'hébreu  
· B. Cela varie selon le livre  
· C. De haut en bas, en colonnes  
✓ D. De gauche à droite, comme le français et l'anglais  
_Pourquoi :_ Le grec se lit de gauche à droite, dans le même sens que le français et l'anglais. C'est l'une des grandes différences de sens de lecture avec l'hébreu, et cela rend le grec tout de suite plus naturel pour les lecteurs occidentaux.  
> EN: In which direction is Greek read? — ✓ Left to right, like English and Spanish

**6. Quelle est la première lettre de l'alphabet grec, et de quelle lettre hébraïque descend-elle ?**  
· A. Bêta, du Bet hébreu  
· B. Thêta, du Tet hébreu  
· C. Oméga, du Tav hébreu  
✓ D. Alpha, de l'Aleph hébreu  
_Pourquoi :_ Alpha est la première lettre grecque et descend de l'Aleph hébreu (Unité 2). Les deux lettres représentent une voyelle « a » et viennent en tête de leur alphabet respectif. Le mot « alphabet » est formé d'alpha + bêta — les deux premières lettres grecques, qui viennent elles-mêmes d'aleph + bet.  
> EN: What is the first letter of the Greek alphabet, and from what Hebrew letter does it descend? — ✓ Alpha, from Hebrew Aleph

**7. Piège important : la majuscule grecque Η (Êta) est identique au H français. Quel son produit-elle en réalité ?**  
✓ A. Un « ê » long comme dans « fête » — PAS un son « h »  
· B. Un son « h », comme le H français  
· C. Un son « z »  
· D. Elle est muette  
_Pourquoi :_ L'Êta est le piège le plus célèbre pour ceux qui commencent à lire le grec. La majuscule Η est identique au H français mais produit un son « e » long, et non un « h ». Le mot grec pour « la » (féminin) est ἡ — prononcé « hê » (e long), et non « h ». L'Êta est le pendant long de l'Epsilon, qui est bref.  
> EN: Critical pitfall: the capital Greek letter Η (Eta) looks identical to English H. What sound does it actually make? — ✓ A long 'e' as in 'they' — NOT an 'h' sound

**8. Quelle lettre grecque est la première lettre du mot « theos » (Dieu), est parfois employée seule, dans les inscriptions chrétiennes anciennes, comme abréviation d'une seule lettre pour « Dieu », et ressemble à un O traversé d'une barre horizontale ?**  
✓ A. Thêta (Θ)  
· B. Delta (Δ)  
· C. Lambda (Λ)  
· D. Zêta (Ζ)  
_Pourquoi :_ Thêta est la huitième lettre grecque. La majuscule Θ ressemble à un O avec une barre horizontale à l'intérieur. Le mot grec pour « Dieu » est theos (θεός), qui commence par un Thêta — et les inscriptions chrétiennes anciennes emploient parfois un seul Θ comme abréviation de « Dieu ». Le son est un « th » doux, comme dans l'anglais « thin ».  
> EN: Which Greek letter is the first letter of the word 'theos' (God), is sometimes used by itself as a one-letter abbreviation for 'God' in early Christian inscriptions, and looks like an O with a horizontal bar through it? — ✓ Theta (Θ)

**9. Quelle lettre grecque est la neuvième lettre, descend du Yod hébreu, est la plus petite lettre, et est justement la lettre dont Jésus parle en Matthieu 5:18 quand il dit que pas même la plus petite lettre ne disparaîtra de la loi ?**  
· A. Mu  
· B. Lambda  
· C. Epsilon  
✓ D. Iota  
_Pourquoi :_ Iota est la descendante grecque du Yod hébreu. C'est la plus petite lettre grecque et la source du I et du J français. Le mot grec « iota » est exactement celui que Jésus emploie en Matthieu 5:18 (« il ne disparaîtra pas de la loi un seul iota ou un seul trait de lettre »). L'expression française « pas d'un iota », qui signifie « pas le moins du monde », vient du même mot.  
> EN: Which Greek letter is the ninth letter, descends from Hebrew Yod, is the smallest letter, and is the very letter Jesus called 'one jot' in Matthew 5:18? — ✓ Iota

**10. Que signifie le mot grec « kai » (καί), et combien de fois environ apparaît-il dans le Nouveau Testament ?**  
✓ A. « Et / aussi / même », environ 9 000 fois — le mot le plus fréquent du Nouveau Testament grec  
· B. « Dieu », environ 500 fois  
· C. « Parole », environ 100 fois  
· D. « Roi », environ 200 fois  
_Pourquoi :_ Kai (Strong G2532) signifie « et, aussi, même ». Il apparaît environ 9 000 fois dans le Nouveau Testament grec — le mot le plus fréquent de tout le Nouveau Testament. Il enfile les récits des Évangiles comme des perles sur un fil. Trois lettres grecques : Kappa-Alpha-Iota.  
> EN: What does the Greek word 'kai' (καί) mean, and approximately how often does it appear in the New Testament? — ✓ 'And / also / even,' appearing about 9,000 times — the most common word in the Greek NT

**11. Qu'est-ce que « thelêma » (θέλημα), et où Jésus l'emploie-t-il dans le Notre Père ?**  
· A. « Pain » — dans « donne-nous aujourd'hui notre pain quotidien »  
· B. « Règne » — dans « que ton règne vienne »  
· C. « Nom » — dans « que ton nom soit sanctifié »  
✓ D. « Volonté / désir » — dans « que ta volonté soit faite » (Matthieu 6:10)  
_Pourquoi :_ Thelêma (Strong G2307) signifie « volonté, désir, souhait ». Jésus l'emploie en Matthieu 6:10 : « Genêthêtô to thelêma sou » — « que ta volonté soit faite ». Paul l'emploie en Romains 12:2 : discerner « quelle est la volonté de Dieu, ce qui est bon, agréable et parfait ». Six lettres grecques : Thêta-Epsilon-Lambda-Êta-Mu-Alpha.  
> EN: What is 'thelēma' (θέλημα), and where does Jesus use it in the Lord's Prayer? — ✓ 'Will / desire' — in 'Thy will be done' (Matthew 6:10)

**12. En Apocalypse 22:13, par quelles lettres de l'alphabet grec Christ se désigne-t-il ?**  
· A. Iota et Kappa  
· B. Delta et Mu  
· C. Bêta et Thêta  
✓ D. Alpha et Oméga — la première et la dernière lettre de l'alphabet grec  
_Pourquoi :_ En Apocalypse 22:13, Christ dit : « Je suis l'alpha et l'oméga, le premier et le dernier, le commencement et la fin. » Alpha est la première lettre de l'alphabet grec (Unité 6) ; Oméga est la dernière (Unité 7). Christ revendique l'alphabet grec tout entier comme son titre — un discret parallèle avec l'Aleph-Tav hébreu caché dans Genèse 1:1.  
> EN: In Revelation 22:13, Christ identifies Himself by what Greek alphabet letters? — ✓ Alpha and Omega — the first and last letters of the Greek alphabet

**13. Qu'est-ce que la Septante (LXX) ?**  
· A. La traduction latine du Nouveau Testament par Jérôme  
✓ B. La traduction grecque de l'Ancien Testament hébreu, faite à Alexandrie vers 250 av. J.-C. — la version que les apôtres citent habituellement quand ils citent l'Ancien Testament  
· C. Un commentaire rabbinique médiéval  
· D. Un ancien codex grec du Nouveau Testament  
_Pourquoi :_ La Septante est la traduction grecque de l'Ancien Testament hébreu, faite par des savants juifs à Alexandrie à partir d'environ 250 av. J.-C. La tradition dit que 70 (ou 72) traducteurs y ont travaillé — d'où le nom latin « septuaginta » (soixante-dix), souvent abrégé LXX. Quand les apôtres citent l'Ancien Testament dans leurs lettres, ils citent habituellement la Septante : c'est ainsi que l'Écriture hébraïque a atteint le monde non juif par le grec.  
> EN: What is the Septuagint (LXX)? — ✓ The Greek translation of the Hebrew Old Testament, made in Alexandria around 250 BC — the version the apostles usually quote when they cite the OT

**14. Dans quelle sorte de grec le Nouveau Testament est-il écrit ?**  
· A. Le grec classique, la langue littéraire soignée de Platon et de Sophocle  
✓ B. Le grec koinè, le grec commun de tous les jours du monde méditerranéen du Ier siècle  
· C. Le grec moderne, le grec parlé aujourd'hui à Athènes  
· D. De l'araméen écrit en lettres grecques  
_Pourquoi :_ Le Nouveau Testament est écrit en grec koinè — le « grec commun » — le grec de tous les jours des marchés, des soldats, des pêcheurs et des lettres personnelles au Ier siècle. Dieu n'a pas choisi le grec classique soigné de Platon et de Sophocle ; il a choisi la langue des marchands de poisson, des collecteurs d'impôts et des artisans itinérants.  
> EN: What kind of Greek is the New Testament written in? — ✓ Koiné Greek, the common everyday Greek of the first-century Mediterranean

**15. Les douze premières lettres de l'alphabet grec, dans l'ordre, sont :**  
✓ A. Alpha, Bêta, Gamma, Delta, Epsilon, Zêta, Êta, Thêta, Iota, Kappa, Lambda, Mu  
· B. Alpha, Bêta, Gamma, Delta, Epsilon, Zêta, Thêta, Êta, Iota, Lambda, Kappa, Mu  
· C. Alpha, Gamma, Bêta, Delta, Epsilon, Êta, Zêta, Thêta, Kappa, Iota, Mu, Lambda  
· D. Aleph, Bet, Gimel, Dalet, He, Vav, Zayin, Chet, Tet, Yod, Kaf, Lamed  
_Pourquoi :_ L'ordre correct est : Alpha, Bêta, Gamma, Delta, Epsilon, Zêta, Êta, Thêta, Iota, Kappa, Lambda, Mu. (L'option D donne les douze premières lettres hébraïques des Unités 2 et 3 — de proches cousines, mais un autre alphabet.)  
> EN: The first twelve letters of the Greek alphabet, in order, are: — ✓ Alpha, Beta, Gamma, Delta, Epsilon, Zeta, Eta, Theta, Iota, Kappa, Lambda, Mu

**16. Quelle lettre sert de préfixe aux numéros Strong des mots grecs du Nouveau Testament ?**  
· A. H (la même que pour l'hébreu)  
✓ B. G (G2532 pour kai, G2307 pour thelêma, G965 pour Bêthleem)  
· C. NT (NT2532)  
· D. Il n'y a pas de lettre en préfixe  
_Pourquoi :_ Les mots grecs portent le préfixe G (par exemple, G2532 = kai, G2307 = thelêma, G965 = Bêthleem). Les mots hébreux portent le préfixe H. James Strong a numéroté l'hébreu de H1 à H8674 et le grec de G1 à G5624. La lettre vous indique de quelle langue originale — celle de quel Testament — provient le mot.  
> EN: What is the Strong's number letter prefix for Greek New Testament words? — ✓ G (G2532 for kai, G2307 for thelēma, G965 for Bēthleem)

**17. Quel est le mot grec pour « Bethléhem », et quel est son numéro Strong ?**  
· A. Galilaia / G1056  
· B. Ioudaia / G2449  
✓ C. Bêthleem (Βηθλέεμ) / G965  
· D. Nazareth / G3478  
_Pourquoi :_ Bêthleem (Βηθλέεμ) est la transcription grecque du nom de lieu hébreu Bet-lechem (« maison du pain »). Strong G965. Sept lettres grecques : Bêta-Êta-Thêta-Lambda-Epsilon-Epsilon-Mu. Il apparaît en Matthieu 2:1 (les mages cherchant l'enfant né « à Bethléhem en Judée ») et en Luc 2:4 (Joseph montant « dans la ville de David, appelée Bethléhem »).  
> EN: What is the Greek word for 'Bethlehem,' and what is its Strong's number? — ✓ Bēthleem (Βηθλέεμ) / G965

**18. Quelle lettre grecque est la plus importante pour la théologie chrétienne, étant la première lettre de « Logos » (Parole) — le titre que Jean donne à Christ en Jean 1:1 ?**  
· A. Kappa  
· B. Mu  
✓ C. Lambda  
· D. Thêta  
_Pourquoi :_ Lambda est la onzième lettre grecque et la première lettre de Logos (λόγος) — le mot par lequel Jean ouvre son Évangile : « Au commencement était la Parole » (en grec, le Logos). Nous étudierons Logos en détail dans l'Unité 8. Le Lambda majuscule (Λ) ressemble à un V à l'envers ; la minuscule ressemble à un « l » au sommet fourchu.  
> EN: Which Greek letter is the most important for Christian theology, being the first letter of 'Logos' (Word) — the title John gives to Christ in John 1:1? — ✓ Lambda

**19. Quelle est l'une des grandes différences entre l'alphabet grec et l'alphabet hébreu ?**  
✓ A. Le grec a 24 lettres, voyelles comprises ; l'hébreu a 22 consonnes, les voyelles ayant été ajoutées plus tard sous forme de signes  
· B. Le grec est plus ancien que l'hébreu  
· C. Le grec se lit de droite à gauche, l'hébreu de gauche à droite  
· D. Les lettres grecques n'ont aucune valeur numérique  
_Pourquoi :_ Le grec a 24 lettres, les voyelles faisant partie de l'alphabet lui-même ; l'hébreu n'a que 22 consonnes, les voyelles ayant été ajoutées sous forme de signes, au-dessus et au-dessous, par les massorètes vers 700 apr. J.-C. Sens de lecture : l'hébreu va de droite à gauche, le grec de gauche à droite. Les lettres grecques et hébraïques ont toutes deux des valeurs numériques, mais seules les lettres grecques sont devenues un usage courant en mathématiques et en sciences.  
> EN: What is one major difference between the Greek alphabet and the Hebrew alphabet? — ✓ Greek has 24 letters with vowels built in; Hebrew has 22 consonants with vowels added as later marks

**20. Quelle observation relie le mot hébreu « et » (Aleph-Tav) de Genèse 1:1 au titre de Christ en Apocalypse 22:13 ?**  
· A. Ils s'écrivent de la même façon  
✓ B. Tous deux sont « la première et la dernière lettre » de leur alphabet respectif — Aleph-Tav en hébreu et Alpha-Oméga en grec — encadrant discrètement toute l'Écriture  
· C. Tous deux se prononcent « et »  
· D. Ce sont tous deux des noms de Dieu  
_Pourquoi :_ Dans l'Unité 3, nous avons vu que « et » en Genèse 1:1 s'écrit Aleph-Tav — la première et la dernière lettre de l'alphabet hébreu. En Apocalypse 22:13, Christ se nomme l'Alpha et l'Oméga — la première et la dernière lettre de l'alphabet grec. Le même encadrement christologique dans les deux langues, ouvrant le premier verset de la Bible et fermant le dernier livre.  
> EN: Which historical observation links the Hebrew word 'et' (Aleph-Tav) in Genesis 1:1 with Christ's title in Revelation 22:13? — ✓ Both are the 'first and last letters' of their respective alphabets — Hebrew Aleph-Tav and Greek Alpha-Omega — quietly framing all of Scripture

## 6. Fill in the blank

Grading ignores accents, capitals and one leading article (le/la/les/l'/un/une/des).

**1.** La Bible grecque que Tischendorf trouva enveloppée dans un tissu rouge au monastère Sainte-Catherine fut connue sous le nom de Codex ____, « le Livre du Sinaï ».  
Réponse : **Sinaiticus** · aussi acceptées : Sinaitique  
> EN: The Greek Bible that Tischendorf found wrapped in a red cloth at Saint Catherine's monastery became known as Codex ____, "the Sinai Book." — **Sinaiticus**

**2.** Partout où passaient les armées d'Alexandre le Grand, son grec commun, appelé la ____, devint la langue du commerce, de l'administration et de la conversation.  
Réponse : **koinè** · aussi acceptées : grec koinè, grec commun, grec hellénistique  
> EN: Wherever Alexander the Great's armies went, his common Greek, called ____, became the language of trade, government, and conversation. — **Koiné**

**3.** La traduction grecque de l'Ancien Testament faite environ deux cent cinquante ans avant Jésus, abrégée LXX, s'appelle la ____.  
Réponse : **Septante** · aussi acceptées : Septuaginta, version des Septante, Bible des Septante  
> EN: The Greek translation of the Old Testament made about two hundred and fifty years before Jesus, abbreviated LXX, is the ____. — **Septuagint**

**4.** L'alphabet grec est le père de l'alphabet ____, qui est à son tour le père de celui du français et de l'anglais.  
Réponse : **latin** · aussi acceptées : romain  
> EN: The Greek alphabet is the parent of the ____ alphabet, which in turn is the parent of English and Spanish. — **Latin**

**5.** La septième lettre grecque, l'____, a une majuscule qui ressemble au H français mais produit un son « e » long.  
Réponse : **Êta**  
> EN: The seventh Greek letter, ____, has a capital that looks like English H but makes a long "e" sound. — **Eta**

**6.** Le Thêta est la première lettre de ____, le mot grec pour « Dieu ».  
Réponse : **theos**  
> EN: Theta is the first letter of ____, the Greek word for "God." — **theos**

**7.** L'iota, la plus petite lettre grecque, est la descendante grecque de la lettre hébraïque ____.  
Réponse : **Yod** · aussi acceptées : Youd, Yud, Yodh  
> EN: Iota, the smallest Greek letter, is the Greek descendant of the Hebrew letter ____. — **Yod**

**8.** Le mot le plus fréquent de tout le Nouveau Testament grec, qui apparaît environ neuf mille fois, est ____, qui signifie « et ».  
Réponse : **kai**  
> EN: The most common word in the entire Greek New Testament, appearing about nine thousand times, is ____, meaning "and." — **kai**

**9.** Thelêma est le mot que Jésus a employé dans le Notre Père : « que ta ____ soit faite » (Matthieu 6:10).  
Réponse : **volonté**  
> EN: Thelêma is the word Jesus used in the Lord's Prayer: "Thy ____ be done" (Matthew 6:10). — **will**

**10.** Bêthleem est la forme grecque du nom de lieu hébreu Bet-lechem, qui signifie « maison du ____ ».  
Réponse : **pain**  
> EN: Bêthleem is the Greek form of the Hebrew place-name Bet-lechem, which means "house of ____." — **bread**

## 7. Short answer

Keywords are matched as word-parts; accents count, so accented words also list an unaccented form. An answer passes with at least 3 keyword groups (or all, if fewer).

**1. Racontez l'histoire de Constantin Tischendorf et du manuscrit qu'il découvrit, et expliquez pourquoi cette unité s'ouvre avec elle.**  
Mots-clés : tischendorf · sinaï / sinai · catherine · monast · tissu rouge / étoffe rouge / etoffe rouge / linge rouge / drap rouge · codex · sinaiticus · 1859 · grec · préserv / preserv / conserv · parchemin · mer morte · catherine · monast · tissu rouge / étoffe rouge / etoffe rouge / linge rouge / drap rouge · identique · british library / londres · 1859 · grec · préserv / preserv / conserv  
Modèle : En 1859, lors de sa troisième visite au monastère Sainte-Catherine, au pied du mont Sinaï, le bibliste allemand Constantin von Tischendorf, qui avait déjà trouvé quinze ans plus tôt quarante-trois feuillets d'une très ancienne Bible grecque dans un panier destiné au feu, se vit montrer par l'économe, la veille de son départ, un manuscrit enveloppé dans un tissu rouge : 346 feuillets de parchemin contenant la plus grande partie de l'Ancien Testament grec et tout le Nouveau Testament grec, vers 350 apr. J.-C. Il ne dormit pas de la nuit. Ce manuscrit est le Codex Sinaiticus, aujourd'hui à la British Library. L'unité s'ouvre avec cette histoire parce que, comme les manuscrits de la mer Morte pour l'hébreu, le Codex prouve la préservation du texte grec du Nouveau Testament : comparé aux manuscrits médiévaux mille deux cents ans plus tard, il est presque identique. Les lettres grecques que nous apprenons ont été fidèlement préservées.

> EN: Tell the story of Constantin Tischendorf and Codex Sinaiticus and explain why this unit opens with it.

**2. Expliquez pourquoi Dieu a choisi le grec koinè comme langue du Nouveau Testament et quel rôle a joué Alexandre de Macédoine.**  
Mots-clés : koinè / koine / koinê · commun · alexandre · grand · conqu · méditerran / mediterran · autoroute · univers · évangile / evangile · septante · commerce · commun · apôtre / apotre · grèce / grece · conqu · méditerran / mediterran · autoroute · univers · évangile / evangile · septante  
Modèle : Vers 330 av. J.-C., Alexandre le Grand conquit le monde connu, de la Grèce à l'Inde, et sa conquête répandit dans tout le monde méditerranéen le grec commun, la koinè, langue du commerce, de l'administration et de la conversation. Au temps de Jésus, toute personne lettrée de Rome à Babylone lisait ou parlait un peu de grec. Dieu a ainsi construit son autoroute avant d'y faire rouler son Évangile : les apôtres écrivirent en koinè pour que le monde entier puisse lire ; l'Ancien Testament existait déjà en grec dans la Septante, que les apôtres citaient ; et le grec devint la langue chrétienne universelle pendant cinq siècles.

> EN: Explain why God chose Koiné Greek as the language of the New Testament and how Alexander the Great played a role.

**3. Énumérez dans l'ordre les douze premières lettres de l'alphabet grec, avec leurs sons.**  
Mots-clés : alpha · bêta / beta · gamma · delta · epsilon · zêta / zeta · êta / eta · thêta / theta · iota · kappa · lambda · mu · alpha · bêta / beta · gamma · delta · epsilon · zêta / zeta · êta / eta · thêta / theta · iota · kappa · lambda · mu  
Modèle : Alpha (α) : « a » comme dans « papa ». Bêta (β) : « b ». Gamma (γ) : « g » comme dans « gare ». Delta (δ) : « d ». Epsilon (ε) : « e » bref. Zêta (ζ) : « z » ou « dz ». Êta (η) : « ê » long, et non « h ». Thêta (θ) : « th » doux comme dans l'anglais « thin ». Iota (ι) : « i » comme dans « ami ». Kappa (κ) : « k ». Lambda (λ) : « l ». Mu (μ) : « m ».

> EN: List the first twelve letters of the Greek alphabet in order with their sounds.

**4. Comparez l'alphabet grec et l'alphabet hébreu en nommant au moins trois différences importantes.**  
Mots-clés : grec · hébreu / hebreu · 24 · 22 · voyelle · consonne · gauche · droite · direction / sens de lecture / sens · famili · français / francais / anglais · racine · préfix / prefix / terminaison · 24 · 22 · voyelle · consonne · gauche · droite · direction / sens de lecture / sens · famili · français / francais / anglais  
Modèle : Premièrement, le grec a 24 lettres avec les voyelles intégrées, tandis que l'hébreu a 22 consonnes et les voyelles ajoutées sous forme de signes. Deuxièmement, le sens de lecture : l'hébreu se lit de droite à gauche, le grec de gauche à droite, comme le français. Troisièmement, la structure des mots : l'hébreu repose sur des racines de trois consonnes, le grec sur des radicaux avec préfixes et terminaisons. Enfin, la familiarité : l'hébreu paraît étranger, alors que beaucoup de lettres grecques ressemblent déjà aux lettres françaises — avec le piège que certaines (η, ρ, ν) n'ont pas le son qu'elles semblent avoir.

> EN: Compare the Greek and Hebrew alphabets, naming at least three significant differences.

**5. Lisez le mot grec καί et expliquez ce qu'il signifie et pourquoi il est important.**  
Mots-clés : kai · signifie et / veut dire et / le mot et / conjonction et / traduit par et · fréquent / frequent / courant / commun · 9000 / 9 000 / neuf mille · le plus / la plus · conjonction · évangile / evangile · strong · g2532 · kai · signifie et / veut dire et / le mot et / conjonction et / traduit par et · fréquent / frequent / courant / commun · 9000 / 9 000 / neuf mille · le plus / la plus · conjonction · évangile / evangile · strong · g2532  
Modèle : Καί se lit kai (Kappa-Alpha-Iota). Le mot signifie « et », « aussi » ou « même ». C'est le mot le plus fréquent de tout le Nouveau Testament grec : il apparaît environ 9 000 fois. Cette conjonction enfile les récits des Évangiles comme des perles sur un fil ; dans Marc ou Jean, presque une phrase sur deux commence par kai. Son numéro Strong est G2532.

> EN: Read the Greek word καί and explain what it means and why it matters.

**6. Lisez le mot grec θέλημα et expliquez ce qu'il signifie et où Jésus l'emploie.**  
Mots-clés : thelêma / thelema / thélèma · volonté / volonte · désir / desir · notre père / notre pere / seigneur · prière / priere / oraison / notre père / notre pere · matthieu · romains · strong · g2307 · thelêma / thelema / thélèma · volonté / volonte · désir / desir · notre père / notre pere · notre père / notre pere / oraison · matthieu · romains · strong · g2307  
Modèle : Θέλημα se lit thelêma (Thêta-Epsilon-Lambda-Êta-Mu-Alpha). Il signifie « volonté », « désir », « souhait » — ce qu'une personne veut. Jésus l'emploie dans le Notre Père, la prière qu'il a enseignée : « Genêthêtô to thelêma sou », « que ta volonté soit faite » (Matthieu 6:10). Paul l'emploie aussi en Romains 12:2, où le croyant doit discerner « quelle est la volonté de Dieu, ce qui est bon, agréable et parfait ». Numéro Strong G2307.

> EN: Read the Greek word θέλημα and explain what it means and where Jesus uses it.

**7. Lisez le nom de lieu grec Βηθλέεμ et expliquez sa signification et son origine.**  
Mots-clés : bêthleem / bethleem · bethléhem / bethlehem / bethléem · maison · du pain / de pain · hébreu / hebreu · translitt · strong · g965 · matthieu · luc 2 / selon luc / de luc / et luc / dans luc · bêthleem / bethleem · bethléhem / bethlehem / bethléem · maison · du pain / de pain · hébreu / hebreu · translitt · strong · g965 · matthieu · luc 2 / selon luc / de luc / et luc / dans luc  
Modèle : Βηθλέεμ se lit Bêthleem (Bêta-Êta-Thêta-Lambda-Epsilon-Epsilon-Mu) : c'est Bethléhem. Ce n'est pas un mot grec d'origine mais la translittération grecque du nom de lieu hébreu Bet-lechem, qui signifie « maison du pain ». On le trouve en Matthieu 2:1, où les mages cherchent l'enfant né à Bethléhem en Judée, et dans l'Évangile de Luc 2:4, où Joseph monte à la ville de David appelée Bethléhem. Numéro Strong G965.

> EN: Read the Greek place name Βηθλέεμ and explain its meaning and origin.

**8. Expliquez le titre « Je suis l'alpha et l'oméga » et montrez son lien avec un petit mot étudié dans l'Unité 3.**  
Mots-clés : alpha · oméga / omega · premi · derni · grec · aleph · tav · hébreu / hebreu · mot et / petit et / hébreu et / hebreu et · christ · genèse / genese · apocalypse · commencement · deux testament · premi · derni · grec · aleph · tav · hébreu / hebreu · mot et / petit et / hébreu et / hebreu et · christ · genèse / genese · apocalypse  
Modèle : En Apocalypse 22:13, Christ dit : « Je suis l'alpha et l'oméga, le premier et le dernier, le commencement et la fin. » Alpha est la première lettre de l'alphabet grec et Oméga la dernière : Christ revendique tout l'alphabet, toute la langue et tout le Nouveau Testament écrit ; il est tout, de A à Z. Dans l'Unité 3, nous avons vu que le petit mot hébreu et, en Genèse 1:1, s'écrit Aleph-Tav, la première et la dernière lettre de l'alphabet hébreu. La même idée encadre donc les deux Testaments : Christ dans l'hébreu, Christ dans le grec ; la première phrase de la Genèse contient discrètement le titre que l'Apocalypse proclame ouvertement.

> EN: Explain Christ's title 'I am the Alpha and the Omega' (Revelation 22:13) and connect it to the Hebrew 'et' (Aleph-Tav) from Unit 3.

**9. Expliquez trois pièges qu'un nouveau lecteur du grec doit éviter parce que certaines lettres grecques ressemblent à des lettres françaises mais produisent des sons différents.**  
Mots-clés : êta / eta · h français / h francais / jamais h / pas h / pas un h · long · rhô / rho · est un r / son r / comme un r / prononce r · à un p / a un p / comme un p / forme de p / forme d un p · le nu / du nu / lettre nu · est un n / son n / comme un n / prononce n · à un v / a un v / comme un v / forme de v · bêta / beta · son b / comme un b / à un b / a un b / prononce b · moderne · ressembl / semble · prononc / le son / un son / sonor · différ / differ · êta / eta · h français / h francais / jamais h / pas h / pas un h · long · rhô / rho · est un r / son r / comme un r / prononce r · à un p / a un p / comme un p / forme de p / forme d un p · le nu / du nu / lettre nu · est un n / son n / comme un n / prononce n · à un v / a un v / comme un v / forme de v · bêta / beta · son b / comme un b / à un b / a un b / prononce b · ancien · familier / familière / familiere · prononc / le son / un son / sonor · forme  
Modèle : Premier piège : l'Êta majuscule (Η) ressemble au H français, mais il se prononce comme un « e » long, jamais « h ». Deuxième piège : le Rhô (ρ) ressemble à un p, mais c'est un r. Troisième piège : le Nu (ν) ressemble à un v, mais c'est un n. On peut ajouter le Bêta (β) : il ressemble à un B et se prononce « b » en grec ancien, mais « v » en grec moderne. La difficulté du grec n'est donc pas l'étrangeté des formes : des lettres qui semblent familières ont un son différent.

> EN: Explain three pitfalls a new reader of Greek must watch out for because some Greek letters look like English letters but make different sounds.

**10. Décrivez l'Activité du cahier de l'Unité 6 et expliquez pourquoi il est important d'écrire soi-même, au stylo, les caractères appris dans cette unité.**  
Mots-clés : cahier · douze · grec · lettre · tableau · majuscule · minuscule · apocalypse · thelêma / thelema · kai · la main / à la main / a la main / de la main · mémoire / memoire / mémoris / memoris · colonne · douze · grec · lettre · tableau · majuscule · minuscule · apocalypse · thelêma / thelema · kai · la main / à la main / a la main / de la main · mémoire / memoire / mémoris / memoris  
Modèle : Dans le cahier, sur une nouvelle page intitulée « Unité 6 — La première moitié de l'alphabet grec », on trace un tableau de cinq colonnes (majuscule, minuscule, nom, son, héritière en français) et on y inscrit les douze lettres grecques d'Alpha à Mu. En dessous, on écrit trois lignes : « Je suis l'alpha et l'oméga » (Apocalypse 22:13) ; thelêma = la volonté de Dieu ; kai = « et ». Puis on écrit encore cinq fois chaque minuscule, lentement. Écrire à la main compte parce que la main enseigne l'œil : le geste grave la forme dans la mémoire, si bien qu'on reconnaît ensuite les lettres sans y penser.

> EN: Describe the Notebook Activity for Unit 6 and explain why writing all twelve Greek letters by hand matters.

## 8. For Robert

Import data: `CTSLA-unit6-fr.json` (same folder). `blocks[].id` matches the lesson block ids; `mc`/`fill`/`sa` are in source order. Import as `machine` status with the source hash, per docs/french-pilot.md.
Keyword groups may have grown from a string to an array (unaccented twins); slot count is unchanged.
