/* =============================================================================
   Immunity Rush — Flu Facts content registry + selection logic
   -----------------------------------------------------------------------------
   Centralized, approved educational content for the in-game "Flu Facts" pop-ups.
   Facts and sources are kept SEPARATE and joined through `sourceIds` so source
   metadata is written once and annual reviews are easy.

   ⚠️ ANNUAL REVIEW: This educational content and the seasonal recommendations it
   references must be reviewed and updated BEFORE EACH NEW FLU SEASON (check every
   source URL and each `reviewedOn` date; confirm NACI season statements are the
   current ones). Do not add numeric vaccine-effectiveness figures, current strain
   names, or specific product recommendations. Use "reduces risk" / "helps protect"
   wording. Canadian spelling (e.g. "defence").

   This file is a plain classic browser script that also runs under Node (for the
   tests in tests/fluFacts.test.mjs). It exposes everything on `window.FluFacts`
   (or `globalThis.FluFacts` when there is no `window`). No build step, no deps.

   Type shapes (documented via JSDoc since the project is plain JS, not TS):

   @typedef {Object} FluFact
   @property {string} id
   @property {"flu-basics"|"spread-prevention"|"vaccine"|"higher-risk"|"care"} category
   @property {string} title
   @property {string} body
   @property {string[]} sourceIds
   @property {"core"|"additional"} priority

   @typedef {Object} HealthSource
   @property {string} id
   @property {string} organization
   @property {string} title
   @property {string} url
   @property {string} reviewedOn   // ISO date the source was last checked
   ============================================================================= */

/** @type {FluFact[]} */
const FLU_FACTS = [
  {
    id: "flu-respiratory-illness",
    category: "flu-basics",
    title: "What is the flu?",
    body: "Seasonal influenza is a contagious illness caused by influenza viruses. It affects the nose, throat and lungs.",
    sourceIds: ["phac-symptoms", "who-seasonal"],
    priority: "core",
  },
  {
    id: "flu-sudden-symptoms",
    category: "flu-basics",
    title: "Symptoms can start suddenly",
    body: "Common flu symptoms include fever, cough, muscle aches, chills, tiredness, headache, sore throat, and a runny or stuffy nose.",
    sourceIds: ["phac-symptoms", "cdc-symptoms"],
    priority: "core",
  },
  {
    id: "flu-no-fever",
    category: "flu-basics",
    title: "No fever? Flu is still possible",
    body: "A person can have influenza without a fever, so fever is not required for flu to be possible.",
    sourceIds: ["cdc-symptoms"],
    priority: "additional",
  },
  {
    id: "flu-incubation",
    category: "flu-basics",
    title: "Symptoms take time",
    body: "Flu symptoms generally begin one to four days after exposure to the virus.",
    sourceIds: ["phac-symptoms", "who-seasonal"],
    priority: "additional",
  },
  {
    id: "flu-can-be-serious",
    category: "flu-basics",
    title: "Flu can be serious",
    body: "Many people recover without medical treatment, but flu can also cause pneumonia, worsen chronic conditions, lead to hospitalization, or cause death.",
    sourceIds: ["phac-symptoms", "who-seasonal"],
    priority: "core",
  },
  {
    id: "spread-before-symptoms",
    category: "spread-prevention",
    title: "Flu can spread before symptoms",
    body: "Adults may be able to spread influenza starting about one day before symptoms begin and for roughly five days after symptoms start.",
    sourceIds: ["phac-symptoms", "naci-2025-2026"],
    priority: "core",
  },
  {
    id: "most-contagious",
    category: "spread-prevention",
    title: "The first days matter",
    body: "People with flu are generally most contagious during the first three days after symptoms begin.",
    sourceIds: ["phac-symptoms"],
    priority: "additional",
  },
  {
    id: "stay-home",
    category: "spread-prevention",
    title: "Stay home when sick",
    body: "Staying home and avoiding close contact helps prevent passing flu to other people, especially those at higher risk.",
    sourceIds: ["phac-symptoms"],
    priority: "core",
  },
  {
    id: "cover-coughs",
    category: "spread-prevention",
    title: "Cover coughs and sneezes",
    body: "Cough or sneeze into a tissue or your elbow, not your hand, and dispose of used tissues properly.",
    sourceIds: ["phac-prevention", "who-seasonal"],
    priority: "core",
  },
  {
    id: "clean-hands",
    category: "spread-prevention",
    title: "Clean hands help",
    body: "Wash hands often with soap and water for at least 20 seconds. If that is unavailable, use hand sanitizer containing at least 60% alcohol.",
    sourceIds: ["phac-prevention"],
    priority: "core",
  },
  {
    id: "ventilation",
    category: "spread-prevention",
    title: "Cleaner air can help",
    body: "When possible, improving ventilation by opening windows or doors can help reduce the risk of respiratory infection spread.",
    sourceIds: ["phac-prevention"],
    priority: "additional",
  },
  {
    id: "layer-protection",
    category: "spread-prevention",
    title: "Layer your protection",
    body: "Vaccination works best alongside other measures such as staying home when sick, cleaning hands, covering coughs, improving ventilation, and wearing a well-fitting mask when appropriate.",
    sourceIds: ["phac-prevention", "phac-vaccine"],
    priority: "core",
  },
  {
    id: "vaccine-best-defence",
    category: "vaccine",
    title: "Your best defence",
    body: "Annual vaccination is the best way to prevent influenza and reduce its serious complications.",
    sourceIds: ["phac-vaccine", "who-seasonal"],
    priority: "core",
  },
  {
    id: "vaccine-six-months",
    category: "vaccine",
    title: "Who should get vaccinated?",
    body: "In Canada, an influenza vaccine is recommended each year for almost everyone aged six months and older.",
    sourceIds: ["phac-vaccine", "naci-2026-2027"],
    priority: "core",
  },
  {
    id: "vaccine-every-year",
    category: "vaccine",
    title: "Vaccinate every year",
    body: "Protection decreases over time, and circulating influenza viruses change. Vaccine composition is reviewed and updated for each flu season.",
    sourceIds: ["phac-vaccine", "who-seasonal", "naci-2026-2027"],
    priority: "core",
  },
  {
    id: "vaccine-two-weeks",
    category: "vaccine",
    title: "Protection takes time",
    body: "It generally takes about two weeks after vaccination for the body to build its best protection against influenza.",
    sourceIds: ["phac-vaccine"],
    priority: "core",
  },
  {
    id: "vaccine-cannot-cause-flu",
    category: "vaccine",
    title: "The vaccine cannot give you flu",
    body: "Flu vaccines do not cause influenza illness. Injectable vaccines use inactivated virus or viral components; nasal-spray vaccine viruses are weakened so they do not cause flu illness.",
    sourceIds: ["phac-vaccine", "cdc-vaccine-safety"],
    priority: "core",
  },
  {
    id: "vaccine-side-effects",
    category: "vaccine",
    title: "Side effects are usually mild",
    body: "Common effects can include soreness or redness at the injection site, headache, fever, nausea, or muscle aches. They usually resolve within a few days.",
    sourceIds: ["phac-vaccine", "cdc-vaccine-safety"],
    priority: "core",
  },
  {
    id: "vaccinated-can-get-flu",
    category: "vaccine",
    title: "Protection is not all-or-nothing",
    body: "A vaccinated person can still get flu, but vaccination may reduce the severity of the illness.",
    sourceIds: ["phac-vaccine", "cdc-vaccine-facts"],
    priority: "core",
  },
  {
    id: "vaccine-specific",
    category: "vaccine",
    title: "Flu vaccine targets influenza",
    body: "The flu vaccine is designed for influenza. It does not protect against COVID-19, RSV, or every cough and cold.",
    sourceIds: ["phac-vaccine"],
    priority: "additional",
  },
  {
    id: "vaccines-together",
    category: "vaccine",
    title: "Vaccines can be given together",
    body: "Canadian guidance says people aged six months and older can receive a flu vaccine at the same time as, before, or after other vaccines.",
    sourceIds: ["phac-vaccine", "naci-2026-2027"],
    priority: "additional",
  },
  {
    id: "protect-others",
    category: "vaccine",
    title: "Vaccination helps protect others",
    body: "Being vaccinated lowers your chance of getting flu and makes you less likely to spread it to people close to you.",
    sourceIds: ["phac-vaccine"],
    priority: "core",
  },
  {
    id: "higher-risk-groups",
    category: "higher-risk",
    title: "Some people face greater risk",
    body: "Higher-risk groups include young children, adults aged 65 and older, pregnant people, people with certain chronic conditions, and people with weakened immune systems.",
    sourceIds: ["phac-prevention", "who-seasonal", "naci-2026-2027"],
    priority: "core",
  },
  {
    id: "pregnancy",
    category: "higher-risk",
    title: "Flu vaccination during pregnancy",
    body: "Pregnant people have a higher risk of serious flu complications. Canadian guidance says flu vaccination during pregnancy is safe and also passes some protection to the baby.",
    sourceIds: ["phac-prevention", "naci-2026-2027"],
    priority: "additional",
  },
  {
    id: "babies-under-six-months",
    category: "higher-risk",
    title: "Protect the youngest babies",
    body: "Babies under six months are too young for a flu vaccine, making protection from vaccinated caregivers and vaccination during pregnancy especially valuable.",
    sourceIds: ["phac-prevention", "phac-vaccine"],
    priority: "additional",
  },
  {
    id: "antibiotics",
    category: "care",
    title: "Antibiotics do not treat flu",
    body: "Influenza is caused by viruses. Antibiotics treat bacterial infections and do not work against flu viruses.",
    sourceIds: ["cdc-treatment"],
    priority: "core",
  },
  {
    id: "antivirals",
    category: "care",
    title: "Early treatment can help",
    body: "Prescription flu antivirals can make illness milder, shorten it, and may reduce some complications. They work best when started early, ideally within two days after symptoms begin.",
    sourceIds: ["cdc-treatment"],
    priority: "core",
  },
  {
    id: "urgent-warning-signs",
    category: "care",
    title: "Know urgent warning signs",
    body: "Trouble breathing, persistent chest pain or pressure, confusion, seizures, severe weakness, dehydration, or symptoms that improve and then worsen require prompt medical attention.",
    sourceIds: ["cdc-symptoms"],
    priority: "core",
  },
];

/** @type {HealthSource[]} */
const HEALTH_SOURCES = [
  {
    id: "phac-symptoms",
    organization: "Public Health Agency of Canada",
    title: "Flu (seasonal influenza): Symptoms and treatment",
    url: "https://www.canada.ca/en/public-health/services/diseases/flu-influenza.html",
    reviewedOn: "2026-09-14",
  },
  {
    id: "phac-prevention",
    organization: "Public Health Agency of Canada",
    title: "Flu (seasonal influenza): Spread, prevention and risks",
    url: "https://www.canada.ca/en/public-health/services/diseases/flu-influenza/prevention-risks.html",
    reviewedOn: "2026-09-14",
  },
  {
    id: "phac-vaccine",
    organization: "Public Health Agency of Canada",
    title: "Flu (seasonal influenza): Get your flu vaccine",
    url: "https://www.canada.ca/en/public-health/services/diseases/flu-influenza/get-your-flu-shot.html",
    reviewedOn: "2026-09-14",
  },
  {
    id: "naci-2025-2026",
    organization: "National Advisory Committee on Immunization",
    title: "Statement on Seasonal Influenza Vaccines for 2025–2026",
    url: "https://www.canada.ca/en/public-health/services/publications/vaccines-immunization/national-advisory-committee-immunization-statement-seasonal-influenza-vaccines-2025-2026.html",
    reviewedOn: "2026-09-14",
  },
  {
    id: "naci-2026-2027",
    organization: "National Advisory Committee on Immunization",
    title: "Summary of NACI statement: Seasonal influenza vaccines for 2026–2027",
    url: "https://www.canada.ca/en/public-health/services/publications/vaccines-immunization/national-advisory-committee-immunization-summary-statement-seasonal-influenza-vaccines-2026-2027.html",
    reviewedOn: "2026-09-14",
  },
  {
    id: "who-seasonal",
    organization: "World Health Organization",
    title: "Influenza (seasonal)",
    url: "https://www.who.int/news-room/fact-sheets/detail/influenza-(seasonal)",
    reviewedOn: "2026-09-14",
  },
  {
    id: "cdc-symptoms",
    organization: "U.S. Centers for Disease Control and Prevention",
    title: "Signs and Symptoms of Flu",
    url: "https://www.cdc.gov/flu/signs-symptoms/",
    reviewedOn: "2026-09-14",
  },
  {
    id: "cdc-vaccine-safety",
    organization: "U.S. Centers for Disease Control and Prevention",
    title: "Flu Vaccine Safety",
    url: "https://www.cdc.gov/flu/vaccine-safety/index.html",
    reviewedOn: "2026-09-14",
  },
  {
    id: "cdc-vaccine-facts",
    organization: "U.S. Centers for Disease Control and Prevention",
    title: "Key Facts About Seasonal Flu Vaccine",
    url: "https://www.cdc.gov/flu/vaccines/keyfacts.html",
    reviewedOn: "2026-09-14",
  },
  {
    id: "cdc-treatment",
    organization: "U.S. Centers for Disease Control and Prevention",
    title: "Treatment of Flu",
    url: "https://www.cdc.gov/flu/treatment/index.html",
    reviewedOn: "2026-09-14",
  },
];

// Human-readable category label shown at the top of each card.
const FLU_CATEGORY_LABELS = {
  "flu-basics": "FLU FACT",
  "spread-prevention": "PREVENTION FACT",
  vaccine: "VACCINE FACT",
  "higher-risk": "WHO'S AT RISK",
  care: "CARE & TREATMENT",
  "hand-hygiene": "HAND HYGIENE",
};

/* -----------------------------------------------------------------------------
   HAND-HYGIENE FACTS — shown at the maze's hand-wash station (same rotating
   Next/Close card as the Information desk). Same shape as FluFact; these have no
   external source registry entries (sourceIds left empty). Edit the wording here.
   ----------------------------------------------------------------------------- */
/** @type {FluFact[]} */
const HANDHYGIENE_FACTS = [
  {
    id: "hh-abhr-envelope",
    category: "hand-hygiene",
    title: "ABHR inactivates the flu virus",
    body: "Alcohol-based hand rub (ABHR) rapidly disrupts the influenza virus's lipid envelope, rendering the virus inactive.",
    sourceIds: [],
    priority: "core",
  },
  {
    id: "hh-gloves",
    category: "hand-hygiene",
    title: "Gloves don't replace hand hygiene",
    body: "Glove use does not replace hand hygiene. Perform hand hygiene immediately after removing gloves to reduce the risk of cross-transmission.",
    sourceIds: [],
    priority: "core",
  },
  {
    id: "hh-missed-areas",
    category: "hand-hygiene",
    title: "Don't miss these spots",
    body: "During hand hygiene, focus on commonly missed areas: the fingertips, thumbs, and spaces between the fingers, and apply enough ABHR to completely cover all surfaces of both hands.",
    sourceIds: [],
    priority: "core",
  },
  {
    id: "hh-cdiff",
    category: "hand-hygiene",
    title: "C. difficile needs soap and water",
    body: "When caring for patients with suspected or confirmed C. difficile, wear gloves and wash your hands with soap and water after glove removal—particularly during an outbreak.",
    sourceIds: [],
    priority: "core",
  },
  {
    id: "hh-abhr-vs-soap",
    category: "hand-hygiene",
    title: "ABHR vs. frequent washing",
    body: "ABHR is generally more effective at reducing microbial contamination and causes less skin irritation than frequent handwashing with soap and water.",
    sourceIds: [],
    priority: "core",
  },
];

// Shown in the Sources / About view. Educational only — not personal advice.
const FLU_DISCLAIMER =
  "Educational information only; not personal medical advice. Ask a health care provider or local public-health authority about your situation.";

/* -----------------------------------------------------------------------------
   Pure, testable logic (no DOM, no storage). A random function is injectable so
   selection is deterministic under test.
   ----------------------------------------------------------------------------- */

// Fisher–Yates shuffle. Returns a NEW array; never mutates the input. `rand`
// must return a float in [0, 1) (defaults to Math.random).
function fluShuffle(arr, rand = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

// Build the rotation queue of fact IDs: CORE facts first (shuffled), then
// ADDITIONAL facts (shuffled). So the initial rotation is all core facts, and the
// additional facts follow once core have been seen.
function fluBuildQueue(facts, rand = Math.random) {
  const core = facts.filter((f) => f.priority === "core").map((f) => f.id);
  const extra = facts.filter((f) => f.priority !== "core").map((f) => f.id);
  return [...fluShuffle(core, rand), ...fluShuffle(extra, rand)];
}

// Advance the rotation by one. `state` = { queue: string[], pos: number,
// seen: string[] }. When the queue is exhausted (or empty), a fresh shuffled
// queue is built and `seen` resets — so no fact repeats until every fact has
// appeared. Returns { fact, state } with a NEW state object (pure).
function fluPickNext(state, facts, rand = Math.random) {
  let { queue = [], pos = 0, seen = [] } = state || {};
  if (!Array.isArray(queue) || pos >= queue.length) {
    queue = fluBuildQueue(facts, rand);
    pos = 0;
    seen = [];
  }
  const id = queue[pos];
  const fact = facts.find((f) => f.id === id) || null;
  return {
    fact,
    state: { queue, pos: pos + 1, seen: seen.concat(id) },
  };
}

// Resolve a fact's sources. Missing source IDs are reported (not thrown) so a
// content typo warns during development without crashing gameplay.
function fluGetSourcesFor(fact, sources) {
  const found = [];
  const missing = [];
  (fact.sourceIds || []).forEach((id) => {
    const s = sources.find((x) => x.id === id);
    if (s) found.push(s);
    else missing.push(id);
  });
  return { sources: found, missing };
}

// One-time content integrity check: every sourceId used by a fact must exist.
// Returns the list of problems; callers may warn without crashing.
function fluValidateContent(facts, sources) {
  const ids = new Set(sources.map((s) => s.id));
  const problems = [];
  facts.forEach((f) => {
    (f.sourceIds || []).forEach((sid) => {
      if (!ids.has(sid)) problems.push(`Fact "${f.id}" references missing source "${sid}"`);
    });
  });
  return problems;
}

const FLU_API = {
  fluFacts: FLU_FACTS,
  handHygieneFacts: HANDHYGIENE_FACTS,
  healthSources: HEALTH_SOURCES,
  categoryLabels: FLU_CATEGORY_LABELS,
  disclaimer: FLU_DISCLAIMER,
  shuffle: fluShuffle,
  buildQueue: fluBuildQueue,
  pickNext: fluPickNext,
  getSourcesFor: fluGetSourcesFor,
  validateContent: fluValidateContent,
};

// Expose as `FluFacts` on the global object in both the browser (window) and
// Node/tests (globalThis). No module system required.
(typeof window !== "undefined" ? window : globalThis).FluFacts = FLU_API;
