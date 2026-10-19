Describe the change and how it was tested.

Beta: agents may push directly or merge a PR without human review.
Production: the agent opens beta -> main after the exact beta commit finishes
its build, tests, deployment and live verification. Wayne checks beta, approves
the current commit and merges using ChapalaTheological1. Robert review and
ChatGPT/Claude review links are not required. Keep secrets/student data out.
