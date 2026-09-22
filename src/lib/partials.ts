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

/* The honours-readings box. Bilingual in the markup itself: the box is not
   language-switched, and it was not before this file existed either. */
export const honoursBox = ({ course }: PartialContext): string => {
  const href = READING_ROOM[course];
  if (!href) throw new Error(`no reading room is recorded for ${course}, so the honours box cannot be rendered`);
  return `<div style="max-width:820px;margin:30px auto 18px;padding:18px 20px;background:#5a1f1f;border:3px solid #b08324;border-radius:12px;text-align:center;font-family:Georgia,serif;color:#f0e0b8;" data-cts-rrbox="1">`
  + `<div style="font-size:19px;font-weight:700;margin-bottom:8px;">📖 Honors Readings &middot; Lecturas con Honores</div>`
  + `<div style="font-size:14px;line-height:1.5;margin-bottom:14px;">This class has five full readings &mdash; read any three in full to earn it <b>With Honors</b>.<br>`
  + `<span style="font-size:13px;">Esta clase tiene cinco lecturas completas &mdash; lea tres completas para obtenerla <b>con Honores</b>.</span>`
  + `</div>`
  + `<a href="${href}" style="display:inline-block;background:#b08324;color:#3a1a1a;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:26px;font-size:16px;line-height:1.25;">Open the Reading Room &rarr;<br>`
  + `<span style="font-size:12px;font-weight:400;">Abrir la Sala de Lecturas</span>`
  + `</a>`
  + `</div>`;
};

export const PARTIALS: Record<string, (ctx: PartialContext) => string> = {
  honours: honoursBox,
};
