Describe the change and how it was checked.

Review commit: REPLACE_WITH_FULL_HEAD_SHA
ChatGPT review: https://REPLACE_WITH_REVIEW_EVIDENCE
Claude review: https://REPLACE_WITH_REVIEW_EVIDENCE

Use links to the actual reviews, with no student data or secrets. Update the
commit and review evidence after changing the branch. The human reviewer checks
that both reviews cover this exact change. GitHub checks that evidence is
present; it cannot prove which AI wrote it.

Content: Wayne approves, then the AI may merge to beta after checks pass.
Technical or mixed: Robert approves. Unknown paths count as technical.
Production: the AI opens beta -> main, Wayne checks the published beta release
and approves the exact commit, then Wayne merges using his human account.
