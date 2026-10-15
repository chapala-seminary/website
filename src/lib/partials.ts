/* Markup that is the same on every lesson page.
 *
 * A partial is named in a template as <!--cts-part:NAME--> and resolved here
 * when the page is rendered. THIS FILE IS THE SINGLE PLACE THE MARKUP LIVES:
 * edit it here and all 434 pages change together. It was created by
 * tools/lift-honours-partial.mjs, which is kept only so the lift can be
 * re-checked; from here on the file is edited by hand.
 *
 * Why a partial and not an Astro component: the lesson body is handed to the
 * layout as one HTML string and injected with set:html, so a component cannot
 * be placed inside it without cutting the string up. The template already had
 * a mechanism for "something goes here" -- the holes that lesson text fills --
 * and this is the same mechanism with a different kind of filling.
 *
 * WHEN YOU ADD A PARTIAL
 *
 * Add a function to PARTIALS below, put <!--cts-part:your-name--> in the
 * templates that want it, and run `node tools/verify-partials.mjs`. An
 * unknown name stops the build rather than rendering a page with a gap.
 */

export interface PartialContext {
  course: string;
  unit: number;
  langs: string[];
}

/* Each course's reading room. Nearly all are <course>Readings.html, but CTS
   points at CTSOTSReadings.html, so the mapping is written out rather than
   computed -- a rule with one exception is a rule waiting to be got wrong. */
export const READING_ROOM: Record<string, string> = {
  CTS: "CTSOTSReadings.html",
  CTS1Peter: "CTS1PeterReadings.html",
  CTSAL: "CTSALReadings.html",
  CTSActs: "CTSActsReadings.html",
  CTSApol: "CTSApolReadings.html",
  CTSBible: "CTSBibleReadings.html",
  CTSBibleCharacters: "CTSBibleCharactersReadings.html",
  CTSBibleCharacters2: "CTSBibleCharacters2Readings.html",
  CTSCE: "CTSCEReadings.html",
  CTSCG: "CTSCGReadings.html",
  CTSCH: "CTSCHReadings.html",
  CTSCS: "CTSCSReadings.html",
  CTSCults: "CTSCultsReadings.html",
  CTSDP: "CTSDPReadings.html",
  CTSDeaconFamilyMinistry: "CTSDeaconFamilyMinistryReadings.html",
  CTSEvanPreach: "CTSEvanPreachReadings.html",
  CTSEvangelism: "CTSEvangelismReadings.html",
  CTSGalatians: "CTSGalatiansReadings.html",
  CTSGenesis: "CTSGenesisReadings.html",
  CTSHS: "CTSHSReadings.html",
  CTSHermeneutics: "CTSHermeneuticsReadings.html",
  CTSJohn: "CTSJohnReadings.html",
  CTSJosh: "CTSJoshReadings.html",
  CTSLA: "CTSLAReadings.html",
  CTSLOC: "CTSLOCReadings.html",
  CTSMatt: "CTSMattReadings.html",
  CTSMissions: "CTSMissionsReadings.html",
  CTSNT: "CTSNTReadings.html",
  CTSPM: "CTSPMReadings.html",
  CTSPT: "CTSPTReadings.html",
  CTSParables: "CTSParablesReadings.html",
  CTSPent: "CTSPentReadings.html",
  CTSPentecostal: "CTSPentecostalReadings.html",
  CTSPsalms: "CTSPsalmsReadings.html",
  CTSRE: "CTSREReadings.html",
  CTSRadical: "CTSRadicalReadings.html",
  CTSRev: "CTSRevReadings.html",
  CTSRomans: "CTSRomansReadings.html",
  CTSST: "CTSSTReadings.html",
  CTSWR: "CTSWRReadings.html",
  CTSWorship: "CTSWorshipReadings.html",
};

/* The honours-readings box. It showed English and Spanish together, English
   first and larger; a Spanish reader took it for English (Dr. Cook's beta
   pass, 30 Sept 2026). It now follows the page's language switch, like the
   rest of the unit, and shows both only in the "Both" view. Its French is
   added on French pages (src/lib/french-interface.ts): a third language here
   would change the lesson text the prose baseline records. */
export function courseReadingsBox(href: string, course: string): string {
  const required = course === "CTSWR" ? "CTSWRRequired.html" : href;
  return `<div style="max-width:820px;margin:30px auto 18px;padding:18px 20px;background:#5a1f1f;border:3px solid #b08324;border-radius:12px;text-align:center;font-family:Georgia,serif;color:#f0e0b8;" data-cts-rrbox="1" data-cts-chrome>`
  + `<div style="font-size:19px;font-weight:700;margin-bottom:8px;">📖 <span class="lang-en">Course Readings — Required and Honors</span><span class="lang-es">Lecturas del curso — obligatorias y con honores</span></div>`
  + `<div style="font-size:14px;line-height:1.5;margin-bottom:14px;">`
  + `<span class="lang-en"><b>Certificate and Associate:</b> honors is optional. Read any three of the five selections for honors; no separate required-reading exam is needed.</span>`
  + `<span class="lang-es"><b>Certificado y Asociado:</b> los honores son opcionales. Lea tres de las cinco selecciones para obtener honores; no necesita un examen separado de lecturas obligatorias.</span>`
  + `</div>`
  + `<p style="font-size:14px;line-height:1.5"><span class="lang-en"><b>M.Div. and Th.M.:</b> all five assigned readings are part of the course. Their separate exam is required after activation; see its page for the current rule. Honors remains optional and does not replace the exam.</span><span class="lang-es"><b>M.Div. y Th.M.:</b> las cinco lecturas asignadas forman parte del curso. Su examen separado es obligatorio después de su activación; consulte la regla vigente en la página del examen. Los honores siguen siendo opcionales y no sustituyen el examen.</span></p>`
  + (course === "CTSWR" ? `<p><a href="${required}" style="color:inherit"><span class="lang-en">Master’s assigned readings (all five)</span><span class="lang-es">Lecturas asignadas de maestría (las cinco)</span></a> · <a href="CTSWRRequiredTest.html" style="color:inherit"><span class="lang-en">Required-reading exam</span><span class="lang-es">Examen de lecturas obligatorias</span></a></p>` : "")
  + (course === "CTSWR" ? `<p><span class="lang-en">World Religions has a separate set of five master’s assigned readings, linked above; the honors selections below are optional.</span><span class="lang-es">Religiones del Mundo tiene un conjunto separado de cinco lecturas asignadas de maestría, enlazado arriba; las selecciones para honores de abajo son opcionales.</span></p>` : "")
  + `<a href="${href}" style="display:inline-block;background:#b08324;color:#3a1a1a;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:26px;font-size:16px;line-height:1.25;">`
  + `<span class="lang-en">Open Course Readings &rarr;</span><span class="lang-es">Abrir las lecturas del curso &rarr;</span>`
  + `</a>`
  + `</div>`;
}

export const honoursBox = ({ course }: PartialContext): string => {
  const href = READING_ROOM[course];
  if (!href) throw new Error(`no reading room is recorded for ${course}, so the honours box cannot be rendered`);
  return courseReadingsBox(href, course);
};

export const PARTIALS: Record<string, (ctx: PartialContext) => string> = {
  honours: honoursBox,
};
