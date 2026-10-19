/* Country values stored on a student record.
 * The registration menus offer these ISO codes. canonicalCountry maps the
 * typed variants (USA, EEUU, Estados Unidos) onto the same code. An unknown
 * value is kept as typed so a migration never invents a country.
 */
export const CODES = ["AF","AL","DZ","AD","AO","AG","AR","AM","AU","AT","AZ","BS","BH","BD","BB","BY","BE","BZ","BJ","BT","BO","BA","BW","BR","BN","BG","BF","BI","CV","KH","CM","CA","CF","TD","CL","CN","CO","KM","CG","CD","CR","CI","HR","CU","CY","CZ","DK","DJ","DM","DO","EC","EG","SV","GQ","ER","EE","SZ","ET","FJ","FI","FR","GA","GM","GE","DE","GH","GR","GD","GT","GN","GW","GY","HT","HN","HK","HU","IS","IN","ID","IR","IQ","IE","IL","IT","JM","JP","JO","KZ","KE","KI","KP","KR","KW","KG","LA","LV","LB","LS","LR","LY","LI","LT","LU","MG","MW","MY","MV","ML","MT","MH","MR","MU","MX","FM","MD","MC","MN","ME","MA","MZ","MM","NA","NR","NP","NL","NZ","NI","NE","NG","MK","NO","OM","PK","PW","PS","PA","PG","PY","PE","PH","PL","PT","PR","QA","RO","RU","RW","KN","LC","VC","WS","SM","ST","SA","SN","RS","SC","SL","SG","SK","SI","SB","SO","ZA","SS","ES","LK","SD","SR","SE","CH","SY","TW","TJ","TZ","TH","TL","TG","TO","TT","TN","TR","TM","TV","UG","UA","AE","GB","US","UY","UZ","VU","VA","VE","VN","YE","ZM","ZW"];
export const EXTRA = {
  "US": [
    "usa",
    "u.s.a.",
    "u.s.",
    "eeuu",
    "ee.uu.",
    "ee. uu.",
    "united states of america",
    "estados unidos de america",
    "estados unidos de américa",
    "états-unis d’amérique",
    "etats-unis d'amerique"
  ],
  "GB": [
    "uk",
    "u.k.",
    "great britain",
    "britain",
    "england",
    "inglaterra",
    "gran bretaña",
    "gran bretana",
    "reino unido"
  ],
  "AE": [
    "uae",
    "u.a.e.",
    "eau"
  ],
  "KR": [
    "south korea",
    "korea",
    "corea",
    "corea del sur",
    "corée du sud",
    "coree du sud"
  ],
  "CD": [
    "drc",
    "rdc",
    "dr congo",
    "congo kinshasa",
    "democratic republic of the congo",
    "république démocratique du congo",
    "republica democratica del congo"
  ],
  "CG": [
    "congo brazzaville",
    "republic of the congo",
    "république du congo"
  ]
};

const NAMES = ['en', 'es', 'fr'].map((lang) => new Intl.DisplayNames([lang], { type: 'region' }));

export function fold(value) {
  return String(value).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z]/g, '');
}

const byFold = new Map();
const byLiteral = new Map();
function add(raw, code) {
  const text = String(raw).trim();
  if (!text) return;
  byLiteral.set(text.toLowerCase(), code);
  const folded = fold(text);
  if (folded) byFold.set(folded, code);
}
for (const code of CODES) {
  add(code, code);
  for (const names of NAMES) add(names.of(code), code);
}
for (const [code, list] of Object.entries(EXTRA)) for (const raw of list) add(raw, code);
for (const raw of ['ot', 'other', 'otro', 'autre', 'prefer not to say', 'prefiero no decir']) add(raw, 'OT');

/** @returns {string | null} ISO code, OT, the original text, or null when empty. */
export function canonicalCountry(value) {
  if (value == null) return null;
  const text = String(value).trim();
  if (!text) return null;
  if (text.length === 2 && CODES.includes(text.toUpperCase())) return text.toUpperCase();
  if (text.toUpperCase() === 'OT') return 'OT';
  const literal = byLiteral.get(text.toLowerCase());
  if (literal) return literal;
  const folded = byFold.get(fold(text));
  return folded || text;
}

export function countryUpdates() {
  const groups = new Map();
  for (const [literal, code] of byLiteral) {
    if (!groups.has(code)) groups.set(code, new Set());
    groups.get(code).add(literal);
  }
  const sql = [];
  for (const [code, literals] of groups) {
    const list = [...literals].map((s) => "'" + s.replace(/'/g, "''") + "'").join(', ');
    const compact = [...new Set([...literals].map(fold).filter(Boolean))].map((s) => "'" + s.replace(/'/g, "''") + "'").join(', ');
    sql.push(`UPDATE students SET country = '${code}' WHERE country IS NOT NULL AND country <> '${code}' AND (lower(trim(country)) IN (${list}) OR replace(replace(replace(replace(lower(trim(country)), ' ', ''), '.', ''), '-', ''), '''', '') IN (${compact}));`);
  }
  return sql.join('\n');
}
