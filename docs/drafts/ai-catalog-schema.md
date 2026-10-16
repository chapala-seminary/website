# DRAFT — not published

A future `/catalog.json` (name to confirm) generated from
`src/content/courses` and `worker/catalog.json`. Not a second list of
courses. Not published until Phase 4.

```json
{
  "name": "Chapala Theological Seminary",
  "alternateName": "Seminario Teológico de Chapala",
  "url": "https://chapalaseminary.org/",
  "isAccessibleForFree": true,
  "accredited": false,
  "accreditationNote": "Internal ministry recognitions only. See the accreditation statement.",
  "inLanguage": ["en", "es"],
  "draftLanguage": ["fr"],
  "tracks": [
    { "id": "certificate", "courses": 12, "core": "foundation-7" },
    { "id": "associate", "courses": 25, "core": "foundation-7" },
    { "id": "thm", "courses": 15, "core": "foundation-7" },
    { "id": "mdiv", "courses": 30, "core": "mdiv-20" }
  ],
  "courses": [
    {
      "code": "CTSNT",
      "url": "https://chapalaseminary.org/CTSNTCourse.html",
      "start": "https://chapalaseminary.org/CTSNTUnit1.html",
      "title": { "en": "New Testament Survey", "es": "Panorama del Nuevo Testamento" },
      "status": "foundation",
      "isAccessibleForFree": true
    }
  ]
}
```

Rules: no student data; no answer keys; no implied accreditation; French
only when a director marks a course final.
