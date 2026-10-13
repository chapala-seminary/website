# French translation — batch 4: five courses (draft for review)

Prepared 12–13 Oct 2026 from beta (`0597da9`). Same method as batch 3:
- **Shared brief:** `tools/BRIEF.md`, including the edition conventions.
- **Scripture:** checked word for word against the offline Segond 1910.
- **Short answers:** no French prompt passes its own keywords.
- **Second pass:** an independent check by another reviewer.
- **Validator:** every unit passes `tools/validate.py` with 0 errors.

| Course | Units | English words | Questions for Wayne | English-source problems |
|---|---|---|---|---|
| Situations de relation d'aide (Counseling Situations) | 13 (0–12) | 31,400 | 54 | 57 |
| Croissance de l'Église (Church Growth) | 12 | 17,500 | 52 | 76 |
| Le pentecôtisme et le mouvement charismatique (Pentecostalism) | 12 | 30,400 | 55 | 54 |
| Le christianisme radical (Radical Christianity) | 13 | 27,100 | 55 | 80 |
| Les religions du monde (World Religions) | 12 | 28,600 | 39 | 78 |

## Worth Dr. Cook's attention

- **Live answer key fixed:** Church Growth 11, MC 19 was keyed to "building"; the lesson
  teaches "transformation". The fix is added to PR #74.
- **Church Growth 2, SA3:** the English model answer has the divine/human halves backwards
  (the lesson and SA8 say the opposite). The French follows the lesson.
- **Church Growth 3:** the lesson never names McGavran, but six exam items require his name.
- **Pentecostalism 6:** a history unit and an exam explanation already say the course
  "respectfully declines" tongues as the required sign. Is that the even-handed tone wanted
  for Pentecostal readers in Kinshasa?
- **Radical Christianity 6:** the "backhand slap / nonviolent resistance" reading of
  Matthew 5:39 is presented as settled fact. It is one scholarly view.
- **Radical Christianity 13:** "only weeks before Thessalonica" should be about twenty years.
- **World Religions:** Unit 4 says 33 million Hindu gods (traditionally 330 million). Unit 7's
  English says Buddhism has no founder, contradicting the lesson. Unit 11 states the Aztec
  symbolism of the Guadalupe image as fact. Unit 11 also omits Palo Monte, the Afro-Cuban
  tradition of Kongo origin, which Congolese readers would find relevant.
- **Counseling Situations:** the abuse, suicide-risk, grief and addiction content was
  checked with particular care. Unit 3 asks whether to name the DR Congo reporting route.
  The ten steps' names vary between units, so one wording should be chosen.
- **Counseling Situations 12, SA 1–5:** the English keyword lists are just the first eight
  words of each model answer. The French uses real ideas from the lesson.

## Edition-wide clean-up still to do

Small interface labels vary across all French units: « Catalogue » vs « Catalogue / Catálogo »,
« Soumettre l'examen » vs « Envoyer », « Score » vs « Note », « Dr » vs « Dr. », and the
Master's-track wording. If Robert's French build doesn't set these itself, one mechanical
pass can make them uniform.
