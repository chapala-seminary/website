# English still showing when a unit is read in Spanish

_30 Sept 2026, after Dr. Cook's real-device beta pass. Found by opening all
451 unit pages in English and in Spanish, lesson and exam views, and listing
text that stays the same in both and reads as English. Course names in
brackets are the unit pages (e.g. `CTSSTUnit12`)._

Already fixed on the branch: the language not carrying into courses, the
greeting, the registration form, the honours box, the track button — and one
real bug, below.

## 1. Fixed: a whole lesson section that showed English (Systematic Theology, Unit 12)

The Spanish was written, but a misplaced `</div>` in the page left the second
half of the English lesson (from "The Intermediate State: Where Are We Now?"
to the end, about ten paragraphs) outside the English container, so it showed
in Spanish mode too, above the Spanish. Fixed on the branch.

## 2. Diagrams — 11 diagrams, 135 labels (recommend translating)

The diagrams are drawn in the page (SVG), and most have a bilingual title
("Herod's Temple / El Templo de Herodes") but English-only labels and
captions. Labels already carrying their Spanish are left out of this list.
Five diagrams, marked "shared", appear in two courses and are translated once. Translation needs Spanish for each label below; the labels
can then switch with the page like the rest of the lesson.

### The Old Testament at a glance (timeline) — 10 labels
*Old Testament Survey, Unit 1*

- The Old Testament — A Survey Timeline
- The Patriarchs
- The Exodus
- Conquest of Canaan
- The Judges
- United Kingdom
- Kingdom Divides
- Exile in Babylon
- The Return
- The Old Testament at a glance — Creation to the Return (dates approximate).

### The New Testament at a glance (timeline) — 6 labels
*New Testament Survey, Unit 1; Life of Christ, Unit 1 (shared)*

- The New Testament — A Survey Timeline
- Birth of Christ
- The Epistles
- → the apostolic age closes
- Where the life of Christ sits in the New Testament story (dates approximate).
- The New Testament at a glance — Bethlehem to Patmos (dates approximate).

### Herod's Temple (plan) — 13 labels
*New Testament Survey, Unit 2; Life of Christ, Unit 7 (shared)*

- ③ COURT OF THE WOMEN
- Holy of Holies
- Court of the Gentiles
- The Soreg — warning barrier
- Court of the Women
- Court of Israel
- Court of the Priests
- Altar of Burnt Offering
- The Laver
- The Temple (Porch · Holy Place · Holy of Holies)
- In the Holy Place stood the Menorah, the Table of Showbread, and the Altar of Incense. The Holy of Holies stood empty — the ark was lost when the First Temple fell.
- Herod's Temple — where Jesus taught in His final week, and whose veil was torn at the cross.
- Herod's Temple — the house to which the King came.

### The Tabernacle (plan) — 7 labels
*Pentateuch, Unit 7; Worship, Unit 3 (shared)*

- The Gate (East)
- Table of Showbread
- Altar of Incense
- The Veil
- Ark of the Covenant (Mercy Seat)
- The Tabernacle — God's dwelling among His people at Sinai.
- The Tabernacle — the pattern of Old Testament worship.

### The WiseSpeak method (sermon outline) — 14 labels
*Doctrinal Preaching, Unit 2; Evangelistic Preaching, Unit 4 (shared)*

- A Method for Building the Sermon Outline
- The theme — what you preach about.
- The Scripture passage preached.
- The one timeless truth, stated in a single declarative sentence.
- The probing question: Why? How? What? Where? When? Who?
- A plural noun that answers the interrogative and classifies every main division.
- Bridges proposition, interrogative, and keyword into the body of the sermon.
- Division One
- Unity is the chief mark of a good outline — the keyword is its tool.
- Subject: Prayer · Proposition: “The believer should pray with confidence.”
- Interrogative: Why? · Keyword: Reasons (a plural noun)
- Divisions → I. God hears II. God loves III. God answers (each one a reason)
- The WiseSpeak method — the structure behind every doctrinal sermon.
- The WiseSpeak method — the frame for planning an evangelistic sermon.

### The path of faithful interpretation — 11 labels
*Hermeneutics, Unit 1*

- Pray for wisdom; the Spirit is the Author and your Teacher.
- Draw out the author's intended sense; never read your own in.
- Nehemiah 8:8 — “they gave the sense”
- Read every verse in its setting — immediate, book, historical.
- immediate · book · historical
- The Bible is one book; let the clear explain the unclear.
- Luke 24:27 — the road to Emmaus
- Read each kind as itself — a parable has one point; literal is not literalistic.
- narrative · law · poetry · prophecy · parable · letter
- Not information but a changed life: study it, do it, teach it.
- The path of faithful interpretation — from the text to a transformed life.

### A harmony of the four Gospels — 18 labels
*Life of Christ, Unit 10*

- Genealogy of Jesus
- Birth of Jesus
- Visit of the Magi
- Ministry of John the Baptist
- Baptism of Jesus
- Temptation in the Wilderness
- Sermon on the Mount †
- Feeding of the 5,000 ★
- Walking on the Water
- The Transfiguration
- The Woman Caught in Adultery ‡
- Raising of Lazarus
- The Last Supper
- The Crucifixion
- The Resurrection
- ★ The Feeding of the 5,000 is the only miracle — besides the Resurrection — recorded in all four Gospels.
- ‡ John 7:53–8:11 is absent from the earliest manuscripts and Lukan in style, yet bears the marks of an authentic event; retained in the NKJV and RVG.
- A harmony of the four Gospels — what each records of the life of Christ.

### Three views of the millennium — 23 labels
*Matthew, Unit 11; Systematic Theology, Unit 10 (shared)*

- THE MILLENNIUM —
- A literal future 1,000-year reign of Christ on
- Before the millennium (pre-).
- Christ returns, then establishes His earthly
- kingdom.
- Held in two forms — Historic and Dispensational.
- Justin Martyr, Irenaeus; much of modern
- A coming golden age as the gospel triumphs in the
- After the millennium (post-).
- The gospel gradually wins the nations, then
- The “millennium” may be a long age, not exactly
- Jonathan Edwards and the Puritans.
- Symbolic of the present age — Christ reigns now
- from heaven.
- At the end of the present age.
- The “thousand years” is all the time between
- Return, resurrection, and judgment come together
- at the end.
- Augustine; Luther and Calvin; much of the Reformed
- All three are held by orthodox Christians who affirm Christ's bodily return, the resurrection, and the final judgment.
- The differences turn on how to interpret Revelation 20 and the prophetic Scriptures.
- Three views of the millennium — how Christians read the thousand years of Revelation 20.
- Three views of the millennium — held by orthodox Christians who read Revelation 20 differently.

### The Shield of the Trinity — 8 labels
*Systematic Theology, Unit 2*

- Father
- Son
- Holy
- Spirit
- God
- is not
- “…baptizing them in the name of the Father and of the Son and of the Holy Spirit.” — Matthew 28:19
- The Shield of the Trinity — one God in three Persons.

### The threefold office of Christ — 11 labels
*Systematic Theology, Unit 3*

- the Anointed One
- Speaks God's word to men
- Meets our ignorance
- Brings man's needs before God
- Meets our guilt
- KING
- Rules and reigns over all
- over all · sobre todo
- Meets our bondage
- In Israel, prophets, priests, and kings were anointed with oil. Jesus is the Christ — the Anointed One —
- The threefold office of Christ — Prophet, Priest, and King.

### The order of salvation — 14 labels
*Systematic Theology, Unit 7*

- God calls every hearer to Christ · 1 Timothy 2:4 · John 3:16
- It opens blind eyes and frees the will to respond · John 6:44
- the response God requires — “without faith it is impossible to please Him” (Hebrews 11:6)
- An open question: does the new birth come before or after faith? Faithful Christians differ.
- new spiritual life
- the new birth
- received as a son
- Indwelling Spirit
- sealed as God's own
- the Spirit conforms the believer to Christ across a lifetime
- An open question: is the believer kept to the end, or can he finally fall away? Faithful Christians differ.
- the believer raised and made perfectly like Christ
- From first to last, one unbroken work of grace — begun by God, received by faith, finished by God.
- The order of salvation — faith as the hinge; the two disputed links left open.

Not translated on purpose: *Empress of Ireland* (a ship's name, Deacon & Family Ministry Unit 7).

## 3. Headings and labels (recommend translating) — small, fixed text

| Where | English shown | Suggested Spanish |
|---|---|---|
| Holy Spirit, all 10 units — course name above the unit title | The Doctrine of the Holy Spirit | La Doctrina del Espíritu Santo |
| Holy Spirit, each unit — unit title line | "Unit 1 · The Spirit in the Trinity" (and Units 2–10) | "Unidad 1 · El Espíritu en la Trinidad" … (10 titles) |
| Life of Christ, all 10 units — course name | The Life of Christ | La Vida de Cristo |
| Life of Christ, units 1, 2, 4, 5, 6, 8, 9 — unit title line | "Unit 1 · The Word Became Flesh" … (7 titles) | "Unidad 1 · El Verbo se hizo carne" … |
| Ruth & Esther, all 9 units — header | "Ruth and Esther —" | "Rut y Ester —" |
| Christian Education, all 10 units — byline | Dr. Wayne Cook with Andi Cook \| Director: Dr. Ted Rogers | "Dr. Wayne Cook con Andi Cook \| Director: Dr. Ted Rogers" |
| Administration & Leadership, Holy Spirit, Life of Christ — exam headings | Multiple Choice · Short Answer | Opción múltiple · Respuesta corta |
| Administration & Leadership, Unit 1 — buttons | Check Multiple Choice · Check My Progress for This Unit | Revisar opción múltiple · Revisar mi progreso en esta unidad |
| Genesis (12 units), Joshua — buttons | "Submit / Enviar", "Reset / Reiniciar" (both languages at once) | show one language at a time |
| Worship, Unit 6 — dedication | In memory of Andi Cook | En memoria de Andi Cook |

## 4. Left in English on purpose (recommend leaving)

These are names, titles or original-language words that are the same in a
Spanish Bible class:

- **Hebrew letter names and transliterations** (Biblical Languages, Units 1–9):
  Aleph, Bet, Gimel…; Shin / Sin; Yod-He-Vav-He; YHWH.
- **Greek transliterations** (Biblical Languages, Units 7–9): *to pneuma hopou
  thelei pnei…*, *kyrie sôson me*, *Ou gar epaischynomai…*, *sôzein eis to
  panteles*, *Egô eimi to Alpha kai to Ômega*.
- **Titles of real books, articles and churches**: *The View From a Hearse*
  (Counseling Situations 7, Pastoral Ministry 3), *The Sharecropper* (Psalms 3),
  *Dialogue: A Journal of Mormon Thought* (Cults 4), Saddleback Community
  Church and Willow Creek Community Church (Church Growth 3).

Worth a second look: the translated title could go in brackets after the
original, e.g. *The View From a Hearse* (La vista desde un coche fúnebre).

## How to recheck

Build, start the local Worker, and run the scan again (`tools/_eng2.mjs` in the
session scratchpad is the prototype; it can become a test once the diagrams
are done, so new English cannot creep back in).
