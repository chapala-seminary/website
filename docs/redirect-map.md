# Redirect map (Phase 1)

No existing public page is moved. These are new aliases only.

| Request | Response | Notes |
|---|---|---|
| `http://chapalaseminary.org/…` | HTTPS (Cloudflare) | Already the edge default. |
| `https://www.chapalaseminary.org` | 301 → `https://chapalaseminary.org/` | One indexable host. |
| `https://www.chapalaseminary.org/PATH` | 301 → `https://chapalaseminary.org/PATH` | Query string kept. |
| `https://chapalaseminary.org/en` | 301 → `https://chapalaseminary.org/` | English stays at the root. |
| `https://chapalaseminary.org/en/` | 301 → `https://chapalaseminary.org/` | |
| `https://chapalaseminary.org/en/PATH` | 301 → `https://chapalaseminary.org/PATH` | So `/en/CTSNTUnit1.html` works. |
| `https://beta.chapalaseminary.org/…` | 200 + `X-Robots-Tag: noindex` | Staging. No redirect to production. |

Spanish `/es/…` and French `/fr/…` are real pages, not redirects.

New pages (200, no redirect):

| URL | What |
|---|---|
| `/CTSNTCourse.html` (and the other 44 `*Course.html` landings) | Course overview. First unit stays at `CTSNTUnit1.html`. |
| `/es/CTSNTCourse.html` | Spanish landing. |
| `/404.html` | Body of the real 404. Missing URLs keep status 404. |
| `/llms-full.txt` | Long assistant-facing description. |

`/fr/*Course.html` is built with the other French pages. Untranslated French
stays `noindex` under the existing language-pages rule.
