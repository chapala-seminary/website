Describe the change and how it was checked.

Review commit: REPLACE_WITH_FULL_HEAD_SHA

Reviews are recorded as PR comments, one per review, each with this line on its
own (the release check reads the comments itself; links are not proof):

    CTS review: reviewer=Claude verdict=approve scope=technical head=<full head SHA>
    CTS review: reviewer=ChatGPT verdict=approve scope=technical head=<full head SHA>

reviewer is Claude or ChatGPT; verdict approve or changes; scope content or
technical. Each assistant's latest record must approve the current head; a new
push makes earlier records stale. Only accounts with access to the repository
can post a record. No student data or secrets in comments.

Content: both records (content scope is enough) and Wayne's GitHub approval of
this exact commit; the AI account may then merge to beta once checks pass.
Technical or mixed (unknown paths count as technical): both records must be
technical scope, then Wayne approves this exact commit in GitHub. AI records
never stand in for a GitHub approval.
Production: the AI opens beta -> main, Wayne checks the published beta release
and approves the exact commit, then Wayne merges using his human account. Every
main PR needs this, with no exception.
