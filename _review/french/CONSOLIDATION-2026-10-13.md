# Consolidated French review drafts

This selection starts from beta `17a7dc6e` and replaces PRs
[#76](https://github.com/chapala-seminary/website/pull/76),
[#79](https://github.com/chapala-seminary/website/pull/79),
[#80](https://github.com/chapala-seminary/website/pull/80) and
[#81](https://github.com/chapala-seminary/website/pull/81).
It adds **163 packets across fifteen existing English courses**, bringing
the French review collection to 464 packets across forty-one courses.
These are machine drafts for review; a separate import/publication change
and French theological review remain necessary. Published runtime content
is unchanged.

| Source PR | Added packets | Added courses | Excluded duplicate coverage |
|---|---:|---|---|
| #76 | 63 | Hermeneutics, Language Appreciation, Administration/Leadership, Worship, Christian Education, Missions | Genesis (12), Apologetics (10) |
| #79 | 50 | Cults, Practical Theology, Doctrinal Preaching, Evangelistic Preaching, Deacon/Family Ministry | Holy Spirit (10) |
| #80 | 50 | Counseling Situations (includes unit 0 frame), Church Growth, Radical Christianity, World Religions | Pentecostalism (12) |
| #81 | 0 | Original summary findings retained | 1 Peter, Bible Characters I/II, Galatians, Life of Christ, Parables, Ruth/Esther, Revelation (96) |

## Current-source alignment

The original #76 Language Appreciation and #80 Church Growth packets used
the reordered choices from #74. The merged replacement #83 preserves the
original choice order to protect saved numeric student selections. For 86
questions across eleven units, this consolidation maps the French choices
back into current English order using the exact English option text. The
correct answer text is preserved; source indices now match beta. The
corresponding readable MC sections are regenerated from these aligned
packets. No French lesson, question, option or explanation wording is changed.

Only the MC ordering/keys in these source snapshots are updated. Original
lesson, fill-in and short-answer snapshots retain their historical provenance;
their drift from canonical content must be assessed before import. Each
changed source packet records `mc_alignment`, and
`CONSOLIDATION-2026-10-13.json` records the source PR commits and changed
question numbers. The original unmodified packets remain accessible at
those commits.

## Findings retained from overlapping courses

The original reports are preserved as `SUMMARY-batch2.md` through
`SUMMARY-batch5.md`. They contain source-content, translation and theological
questions from both included and excluded courses. Their historical claims
are not new approval or current validation results. In particular:

- #76's claim that all 85 packets validate is superseded: its twelve alternate
  Genesis packets fail the repaired validator and omit the French keyword
  groups already retained in beta. None replace the existing Genesis packets.
- The 195 Language Appreciation / Holy Spirit key corrections and Church
  Growth 11 MC19 are resolved by merged #83. Revelation 12 MC19 is resolved
  by merged #82. The other findings remain for faculty/editorial review.
- #81's alternate translation coverage is redundant, but its summary findings
  and review limitations are retained. Per-unit details for excluded courses
  remain available in the original commits listed in the manifest and linked
  below; closing the old PRs does not discard that history.

Original full packet/review trees:

- [#76 at b0044feb](https://github.com/chapala-seminary/website/tree/b0044feba19e0fb0ced2b83209a86d8f5876ce0d/_review/french)
- [#79 at 93ac74fd](https://github.com/chapala-seminary/website/tree/93ac74fd2b47337cb7203bca93ec89f61c8f93f5/_review/french)
- [#80 at c58b5270](https://github.com/chapala-seminary/website/tree/c58b5270c62968446d87319574ee1b9cb7844bf3/_review/french)
- [#81 at 5cca4768](https://github.com/chapala-seminary/website/tree/5cca4768c6b7b478951ca22f8a03d7e7cad3fa90/_review/french)

## Validation

`python3 _review/french/tools/test_validate.py` checks all 464 delivered
packets and corruption cases. All packets pass, including the 163 additions.
Structural integration checks verify the new packets' MC options/keys match
canonical beta and that the 301 existing packets are unchanged. These checks
establish packet consistency and grading compatibility, not French theological
approval or resolution of the reports' editorial findings.
