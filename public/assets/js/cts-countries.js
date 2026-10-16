/* Fills a country menu on registration forms that still had a text box.
 * The codes match src/lib/countries.mjs. The server maps old typed names. */
(function () {
  var CODES = ["AF","AL","DZ","AD","AO","AG","AR","AM","AU","AT","AZ","BS","BH","BD","BB","BY","BE","BZ","BJ","BT","BO","BA","BW","BR","BN","BG","BF","BI","CV","KH","CM","CA","CF","TD","CL","CN","CO","KM","CG","CD","CR","CI","HR","CU","CY","CZ","DK","DJ","DM","DO","EC","EG","SV","GQ","ER","EE","SZ","ET","FJ","FI","FR","GA","GM","GE","DE","GH","GR","GD","GT","GN","GW","GY","HT","HN","HK","HU","IS","IN","ID","IR","IQ","IE","IL","IT","JM","JP","JO","KZ","KE","KI","KP","KR","KW","KG","LA","LV","LB","LS","LR","LY","LI","LT","LU","MG","MW","MY","MV","ML","MT","MH","MR","MU","MX","FM","MD","MC","MN","ME","MA","MZ","MM","NA","NR","NP","NL","NZ","NI","NE","NG","MK","NO","OM","PK","PW","PS","PA","PG","PY","PE","PH","PL","PT","PR","QA","RO","RU","RW","KN","LC","VC","WS","SM","ST","SA","SN","RS","SC","SL","SG","SK","SI","SB","SO","ZA","SS","ES","LK","SD","SR","SE","CH","SY","TW","TJ","TZ","TH","TL","TG","TO","TT","TN","TR","TM","TV","UG","UA","AE","GB","US","UY","UZ","VU","VA","VE","VN","YE","ZM","ZW"];
  var names = {};
  function display(lang) {
    if (!names[lang]) {
      try { names[lang] = new Intl.DisplayNames([lang], { type: 'region' }); }
      catch (e) { names[lang] = { of: function (code) { return code; } }; }
    }
    return names[lang];
  }
  function pageLang() {
    var lang = (document.documentElement.getAttribute('lang') || '').slice(0, 2);
    if (lang === 'es' || lang === 'fr') return lang;
    if (document.body && document.body.classList.contains('lang-es')) return 'es';
    if (document.body && document.body.classList.contains('lang-fr')) return 'fr';
    return 'en';
  }
  function option(value, en, es, fr) {
    var node = document.createElement('option');
    node.value = value;
    node.setAttribute('data-en', en);
    node.setAttribute('data-es', es);
    node.setAttribute('data-fr', fr);
    var lang = pageLang();
    node.textContent = lang === 'es' ? es : lang === 'fr' ? fr : en;
    return node;
  }
  function fill(select) {
    if (!select || select.options.length > 1) return;
    select.appendChild(option('', 'Country', 'País', 'Pays'));
    CODES.forEach(function (code) {
      select.appendChild(option(code, display('en').of(code), display('es').of(code), display('fr').of(code)));
    });
    select.appendChild(option('OT', 'Other / Prefer not to say', 'Otro / Prefiero no decir', 'Autre / Je préfère ne pas répondre'));
  }
  function upgrade(id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === 'SELECT') { fill(el); return; }
    var select = document.createElement('select');
    select.id = id;
    select.required = true;
    select.setAttribute('autocomplete', 'country');
    var label = el.getAttribute('aria-label');
    if (label) select.setAttribute('aria-label', label);
    var current = el.value;
    el.replaceWith(select);
    fill(select);
    choose(select, current);
  }
  function choose(select, raw) {
    var text = String(raw || '').trim();
    if (!text) return;
    var key = text.toLowerCase();
    var alias = {
      'usa': 'US', 'u.s.a.': 'US', 'u.s.': 'US', 'eeuu': 'US', 'ee.uu.': 'US', 'ee. uu.': 'US',
      'united states': 'US', 'united states of america': 'US', 'estados unidos': 'US',
      'uk': 'GB', 'u.k.': 'GB', 'england': 'GB', 'great britain': 'GB',
      'mexico': 'MX', 'méxico': 'MX', 'mexique': 'MX',
      'other': 'OT', 'otro': 'OT', 'autre': 'OT'
    }[key];
    if (alias) { select.value = alias; return; }
    var upper = text.toUpperCase();
    for (var i = 0; i < select.options.length; i++) {
      var opt = select.options[i];
      if (opt.value === upper || opt.text.toLowerCase() === key) { select.value = opt.value; return; }
    }
    var extra = document.createElement('option');
    extra.value = text;
    extra.textContent = text;
    select.appendChild(extra);
    select.value = text;
  }
  function upgradeAll() {
    upgrade('regCountry');
    upgrade('studentCountry');
  }
  window.CTS_COUNTRIES = { fill: fill, upgrade: upgradeAll, CODES: CODES };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', upgradeAll);
  else upgradeAll();
})();
