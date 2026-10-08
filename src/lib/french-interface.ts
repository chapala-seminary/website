/* Interface drafts only. Never translate lesson or answer-key text here. */
export const FRENCH_INTERFACE: Record<string, string> = {
  'Skip to the lesson': 'Aller à la leçon',
  'Previous': 'Précédent', 'Next': 'Suivant',
  'Register once, for every course': 'Une seule inscription pour tous les cours',
  'Full name — as it should appear on your certificate': 'Nom complet — tel qu’il doit apparaître sur votre certificat',
  'Certificate of Ministry': 'Certificat de ministère',
  'Associate of Divinity': 'Diplôme associé en théologie',
  'Master of Divinity': 'Master en théologie pastorale (M.Div.)',
  'Master of Theology (Th.M.)': 'Master en théologie (Th.M.)',
  'Country': 'Pays', 'Study track': 'Parcours d’études',
  'Save registration': 'Enregistrer l’inscription',
  'All courses': 'Tous les cours', 'Save my progress': 'Enregistrer ma progression',
  'Your information': 'Vos informations',
  'Chapala Theological Seminary · Free, bilingual theological training.': 'Chapala Theological Seminary · Formation théologique gratuite en plusieurs langues.',
  'Required readings for this course': 'Lectures obligatoires pour ce cours',
  'Required-reading test': 'Test des lectures obligatoires',
  'Textbook for this course': 'Manuel pour ce cours', 'Textbook test': 'Test du manuel',
  ' — required on the M.Div. and Th.M. tracks, open to every student: ': ' — obligatoire pour les parcours M.Div. et Th.M., accessible à tous : ',
  ' — required reading on the M.Div. and Th.M. tracks: ': ' — lecture obligatoire pour les parcours M.Div. et Th.M. : ',
  'The Certificate track answers the multiple choice. The Associate adds the fill-in-the-blank questions; M.Div. and Th.M. add those and the short-answer questions. 90% of each part is required to pass.': 'Le parcours Certificat comprend les questions à choix multiple. Le diplôme associé ajoute les textes à compléter ; les parcours M.Div. et Th.M. ajoutent aussi les réponses courtes. Il faut réussir 90 % de chaque partie requise.',
  'Your progress is saved in this browser as you study, and kept with the seminary under your student code, so you can continue on any device. Keep the code private, like a password. A confirmed email is needed only to receive a certificate. <a href="/fr/CTSPrivacy.html">What we keep</a>.': 'Votre progression est enregistrée dans ce navigateur et conservée par le séminaire sous votre code étudiant, pour continuer sur tout appareil. Gardez ce code privé, comme un mot de passe. Une adresse courriel confirmée est nécessaire uniquement pour recevoir un certificat. <a href="/fr/CTSPrivacy.html">Les informations conservées</a>.',
};
export function frenchInterface(root: any) {
  for (const option of root.querySelectorAll('#regTrack option')) {
    const translated = FRENCH_INTERFACE[option.text];
    if (translated) { option.setAttribute('data-en', option.text); option.setAttribute('data-fr', translated); option.set_content(translated); }
  }
  for (const node of root.querySelectorAll('.cts-nav .cts-reading, #cts-register .cts-reading, #cts-textbook .cts-reading, footer .cts-reading')) {
    const translated = FRENCH_INTERFACE[node.innerHTML];
    if (translated) { node.set_content(translated); node.setAttribute('lang', 'fr'); }
  }
}
