/* Which mail in a PERSONAL mailbox is the seminary's business (Wayne, 23 Oct
 * 2026: read all six connected accounts, because CTS letters went out from
 * several and replies can arrive anywhere).
 *
 * A personal account holds the owner's private mail too. That mail must not
 * enter the ledger, the dashboard, a model prompt or an automatic reply. So,
 * for a mailbox marked personal, a message is kept only on evidence that it
 * belongs to CTS:
 *
 *   1. it answers (In-Reply-To / References) a message already in the ledger;
 *   2. it names the seminary (Chapala, chapalaseminary.org, "Theological
 *      Seminary", "Seminario Teológico", CTS ...);
 *   3. its counterpart is already a seminary contact AND it speaks of study
 *      (course, exam, certificate, unit, student code ...).
 *
 * Anything else is skipped: only its id is noted, so it is not fetched again.
 * Mailing lists and automated mail in a personal box are skipped unless they
 * name the seminary (a bounce of a CTS letter quotes it). The check runs on
 * the text in memory; nothing about a skipped message is stored.
 */
import { normAddress, addressList } from './normalize.js';

export const STRONG = /\bchapala\b|chapalaseminary|\btheological\s+seminary\b|\bseminario\s+teol[óo]gico\b|\bs[ée]minaire\s+th[ée]ologique\b|\bsemin[áa]rio\s+teol[óo]gico\b|\bCTS\b|\bwisespeak\b/i;
export const STUDY = /\b(course|courses|class|unit|lesson|exam|test|quiz|certificate|diploma|degree|student\s+code|enrol+|register(ed)?|m\.?\s?div|th\.?\s?m|seminary|theolog\w*|curso|cursos|clase|unidad|lecci[óo]n|examen|certificado|diploma|t[íi]tulo|c[óo]digo|inscri\w+|registr\w+|seminario|teolog\w*|cours|le[çc]on|examen|certificat|dipl[ôo]me|s[ée]minaire|th[ée]olog\w*|estudar|semin[áa]rio)\b/i;

/** Is this personal-mailbox message about the seminary? Returns the reason, or ''. */
export async function ctsReason(db, msg, own) {
  const text = `${msg.subject || ''}\n${msg.body || ''}`;
  const refs = [msg.in_reply_to, ...(msg.references || [])].filter(Boolean);
  for (const ref of refs) {
    if (await db.prepare('SELECT 1 FROM messages WHERE rfc_message_id = ? LIMIT 1').bind(ref).first()) return 'replies_to_known';
  }
  if (msg.rfc_message_id && await db.prepare('SELECT 1 FROM messages WHERE rfc_message_id = ? LIMIT 1').bind(msg.rfc_message_id).first()) return 'copy_of_known';
  if (STRONG.test(text)) return 'names_seminary';
  const from = normAddress(msg.from);
  const people = own.has(from) ? addressList([...(msg.to || []), ...(msg.cc || [])]).filter((a) => !own.has(a)) : [from];
  for (const a of people) {
    const c = await db.prepare(`SELECT 1 FROM contacts k WHERE k.address_norm = ? AND EXISTS (SELECT 1 FROM cases c WHERE c.contact_id = k.id) LIMIT 1`).bind(a).first();
    if (c && STUDY.test(text)) return 'known_contact_study';
  }
  return '';
}
