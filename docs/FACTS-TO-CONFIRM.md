# Facts the seminary must confirm

Phase 1 JSON-LD, `/llms.txt`, and course landings use only facts already on
the About page, `docs/curriculum.md`, or the course catalog. Anything below
is either used with that existing wording or left out until a director
answers.

Mark each row when you have checked it.

## Identity

| Fact | Used as | Confirm? |
|---|---|---|
| Legal / public name: Chapala Theological Seminary; Spanish: Seminario Teológico de Chapala | Yes | |
| Parent ministry: Common Ground Fellowship at Little Chapel, Ajijic, Jalisco, Mexico | Yes (`parentOrganization`) | Confirm the exact legal name of the church |
| Based in the Chapala / Ajijic area | Yes | |
| Contact: info@chapalaseminary.org | Yes | |
| Director: Dr. Ted Rogers, Ph.D. | Yes (Person) | Confirm the field and granting school of the Ph.D. |
| Course author: Dr. Wayne Cook, Th.D., New Orleans Baptist Theological Seminary | Yes (Person) | |
| Additional authors: Dr. Ted Rogers (Pentateuch), the late Andi Cook (Christian Education), Glenda Rogers (Ruth & Esther) | Yes, on those three landings | Confirm no other course has a different author |
| Non-denominational evangelical; not Baptist | Yes, in llms.txt | |
| Not accredited; pursuing formal recognition in Mexico | Yes; no schema.org accreditation | Confirm whether any filing with SEP / RVOE has started |
| Scripture: English NKJV, Spanish RVG, French Louis Segond 1910 (draft) | llms-full.txt | Confirm these are the editions students should be told |

## Programs (do not change the rules; confirm the public wording)

| Fact | Source in the repo | Confirm the public sentence |
|---|---|---|
| 45 self-study courses | catalog-intro / home | |
| Seven foundation courses unlock the catalog | `docs/curriculum.md` | |
| Two courses are open before the foundation: How We Got the Bible; Deacon Family Ministry Plan | same | OK to say on the landing? |
| Certificate of Ministry: 12 courses including the seven | same | “Internal ministry recognition” — Phase 2 wording |
| Associate of Divinity: 25 courses including the seven | same | |
| Th.M.: 15 courses including the seven, master’s-track work | same | |
| M.Div.: 30 courses including the 20-course core, master’s-track work | same | |
| Class certificate per course; honors via Supplemental Reading Room | existing pages | |
| Certificate track: multiple choice only; Associate adds fill-ins; Th.M. / M.Div. add short answers and, where present, textbook / reading tests | home FAQ | |

## Audience and languages

| Fact | Confirm? |
|---|---|
| Built for pastors and lay leaders without seminary access, including Cuba, Mexico, and Latin America; open to anyone | |
| English and Spanish are offered now; French is a draft and must not be advertised as finished | |
| Progress is stored in the browser and under a private student code | Already on the privacy and registration copy |

## Do not publish until confirmed

- A street address or plus-code for Little Chapel (About names the area only).
- Years the seminary began, student counts, or country counts.
- Any claim that a CTS title is recognized by a government, denomination, or
  university.
- Testimonials (need the person’s consent — Phase 5).
- A statement of faith text (Phase 2).
- Whether `www` should remain a second public name. This PR 301s it to the
  apex; say so if that is wrong.

## Wrong facts Phase 1 already corrects

- `public/llms.txt` said the Th.M. is 12 courses. The curriculum rule is 15.
- Certificate pages were in the sitemap. They are student documents.
