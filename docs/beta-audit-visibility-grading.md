# Beta audit: visibility and model grading repairs

The 12 October technical audit identified eight blank Spanish routes and 22 supplied model-answer cases rejected by their own short-answer grader. This repair protects the generated page body from legacy `.lang-es { display: none }` copy selectors. The complete browser sweep now checks that every page body is visible and nonempty, including the Spanish course, certificate and degree routes.

Short-answer keyword matching now uses the existing Latin accent fold on both answer and keyword. It keeps ñ distinct from n and retains concept grouping, source-language support, minimum hit counts and the 90% section threshold. Accent folding resolves 16 reported cases. Six cases in four questions need content alignment:

- Radical Christianity 2 SA3: Spanish rest/panic equivalents count within the existing concepts.
- Radical Christianity 4 SA3: models now list the six commandments the prompt requests and explain what each protects.
- Radical Christianity 4 SA10: the Spanish model includes the holiness/effort explanation already present in the English model.
- World Religions 10 SA5: preservation, witness testimony and investigation equivalents count within the existing concept groups.

`test/published-models.test.mjs` checks every available English, Spanish and canonical French model in its own reader language, using the actual browser engine. All 22,219 checks pass across 466 units. Explicit Spanish accent and ñ regression checks also pass. WiseSpeak’s build-injected French models remain covered by their separate test.

The full local build and suite passed, including 5,778 desktop/phone renders with the visibility check. The earlier fee076a8 French 1 Peter reading-test source-display failure did not reproduce in this complete sweep. The subsequent upstream 233ebfb4 CI run also passed its test suite and was held only by the correct stale-branch deployment guard. These observations do not establish the cause of the earlier intermittent failure; the source-layout assertions remain strict.

Reference fingerprints changed only for the deliberate question corrections: the content baseline changes CTSWR/10, and render snapshots change Radical Units 2/4 and World Religions Unit 10. Lesson prose, URLs, storage keys, production and deployment state are unchanged. Content corrections remain subject to review.
