# Immunity Rush — Educational Content Review

**Purpose:** A complete extraction of every teaching statement (flu / vaccine facts, myths, and
health messages) currently used in the game, for a subject-matter expert to fact-check and improve.

All statements are quoted **exactly** as they appear in the game code (`script.js`, `index.html`),
including original spelling, punctuation, dashes, and capitalization. UI text, button labels,
screen scaffolding, and motivational slogans are intentionally excluded.

> **Note on "count":** For each distinct fact/myth we list every place it appears in the game and
> how many separate wordings exist. Where the *same idea* is worded differently across mini-games,
> the wordings are grouped together and each is quoted.

---

## TOTALS

- **Distinct facts (true teaching ideas): 19**
- **Distinct myths (false statements the game presents and corrects): 12**

Source features referenced below:
**FACTS** (loading-tip pop-ups) · **Vaccine Darts** · **Flu Freeze** · **Memory Match** ·
**maze pickup** (collectibles) · **Hospital Sprint** · **VaxFacts+ popup** · **End screen**.

---

# SECTION A — FACTS (true statements the game teaches)

### F1. Annual vaccination is needed because flu viruses change — appears 5×
- **FACTS pop-up:** "The flu vaccine is recommended every year because flu viruses can change."
- **Vaccine Darts** (fact): "The flu vaccine is recommended every year." → feedback: "That was a fact. Flu viruses can change from season to season."
- **Flu Freeze** (true): "People need a new flu shot every year."
- **Memory Match** (fact card): "Get your flu vaccine every year." → msg: "Correct! Flu viruses can change, so vaccination is recommended each season."
- **Memory Match** (hint message): "Every season requires updated protection."

### F2. The flu shot cannot give you the flu — appears 3×
- **FACTS pop-up:** "The flu shot cannot give you the flu."
- **Vaccine Darts** (fact): "The flu vaccine cannot give you influenza." → feedback: "That was a fact. Flu vaccines do not cause influenza infection."
- **Flu Freeze** (true): "The flu shot cannot give you influenza."
- *(Also appears as the correction to Myth M1 — see Section B.)*

### F3. Flu can be serious and cause complications — appears 3×
- **FACTS pop-up:** "The flu can cause mild illness, but it can also become serious."
- **Flu Freeze** (true): "Flu can trigger serious complications, including pneumonia."
- **Flu Freeze** (true): "Flu can worsen existing heart or lung conditions."

### F4. Vaccination reduces the risk of severe flu / complications — appears 4×
- **FACTS pop-up:** "Vaccination can help reduce the risk of severe flu illness."
- **Vaccine Darts** (fact): "Vaccination can reduce the risk of severe flu illness." → feedback: "That was a fact. Vaccination can lower the risk of serious complications."
- **Flu Freeze** (true): "Vaccination can make flu illness less severe."
- **Flu Freeze** (true): "The vaccine can reduce serious flu-related complications."

### F5. Vaccination protects you and the people around you — appears 4×
- **FACTS pop-up:** "Getting vaccinated helps protect you and the people around you."
- **Vaccine Darts** (fact): "Vaccination can help protect people around you." → feedback: "That was a fact. Reducing your risk can also reduce exposure to others."
- **Memory Match** (hint message): "Protect yourself and the people around you."
- **VaxFacts+ popup:** "A flu shot helps protect you, your loved ones and your community."
- *(Also appears as the correction to Myth M12 — see Section B.)*

### F6. Vaccinated healthcare workers protect patients, coworkers, and families — appears 1× (+1 as a myth correction)
- **FACTS pop-up:** "Healthcare workers can help protect patients, coworkers, and families by staying protected."
- *(Same idea is the correction to Myth M6: "Myth cleared! Vaccinated healthcare workers help protect patients, coworkers, and families.")*

### F7. Healthy people can still get the flu — appears 4× (+2 myth phrasings)
- **FACTS pop-up:** "Being healthy does not mean you cannot get the flu."
- **Vaccine Darts** (fact): "Healthy people can still get the flu." → feedback: "That was a fact. Anyone can become infected and spread influenza."
- **Flu Freeze** (true): "Healthy adults can still get influenza."
- **Flu Freeze** (true): "You can get the flu even if you rarely feel sick."
- *(Countered myths M2: "I'm healthy, so I don't need the flu vaccine." and "A strong immune system guarantees protection." — see Section B.)*

### F8. Past flu infection doesn't guarantee protection this season — appears 1× (+1 myth phrasing)
- **FACTS pop-up:** "Past flu infection does not guarantee protection this season."
- *(Countered myth M3: "I had the flu before, so I'm protected forever.")*

### F9. The flu vaccine is free (Ontario publicly funded program) — appears 3×
- **FACTS pop-up:** "Flu vaccination is free and available through Ontario's publicly funded flu vaccine program."
- **VaxFacts+ popup:** "Influenza vaccination is free and available through Ontario's publicly funded flu vaccine program."
- **End screen (small print):** "Influenza vaccination is free and available through Ontario's publicly funded flu vaccine program."

### F10. It's normal to have vaccine questions; VaxFacts+ offers judgement-free conversations — appears 4×
- **FACTS pop-up:** "Questions are normal. VaxFacts+ offers judgement-free vaccine conversations."
- **Vaccine Darts** (fact): "It is normal to have questions about vaccines." → feedback: "That was a fact. Reliable sources and healthcare professionals can help answer questions."
- **VaxFacts+ popup:** "Have questions about vaccines? Book an appointment with the VaxFacts+ Clinic for a one-to-one, judgement-free phone conversation with a doctor. The goal is to give you facts in a safe space so you can make an informed decision."
- **End screen (small print):** "Have questions about vaccines? Book an appointment with the VaxFacts+ Clinic for a one-to-one, judgement-free phone conversation with a doctor. The goal is to give you facts in a safe space so you can make an informed decision."

### F11. Flu is more severe in older adults; vaccination protects them — appears 4× (+ related myths)
- **Flu Freeze** (true): "Flu can lead to hospitalization in older adults."
- **Flu Freeze** (true): "Vaccination helps protect elderly family members."
- **Memory Match** (fact card): "Flu can be more severe in older adults—vaccination lowers the risk." → msg: "Correct! Older adults face a higher risk of serious flu complications, so vaccination matters for them and for the people around them."
- **maze pickup** (Wellness Star): "Flu vaccination is especially important for older adults and pregnant people."
- *(Countered myths M7 and M8 — see Section B.)*

### F12. Flu is not the same as a common cold — appears 1× (+2 myth phrasings)
- **Flu Freeze** (true): "Flu is not the same as a common cold."
- *(Countered myth M4: "The flu is just a bad cold." — appears in BOTH Vaccine Darts and Flu Freeze.)*

### F13. Babies under 6 months can't be vaccinated — adults must protect them — appears 3×
- **Flu Freeze** (true): "Babies under 6 months cannot receive the flu vaccine, they need adults to."
- **Memory Match** (fact card): "Babies under 6 months can’t get the flu shot—your vaccination helps protect them." → msg: "Correct! Babies under 6 months are too young for flu vaccination, so protection from vaccinated parents, family members, and caregivers matters."
- **maze pickup** (Speed Boost): "Babies under 6 months are too young for their own flu shot — protection around them matters."

### F14. Pregnant people can/should get the flu vaccine; pregnancy raises flu risk — appears 2× (+1 collectible, +1 myth)
- **Flu Freeze** (true): "Pregnant people can receive the flu vaccine."
- **Memory Match** (fact card): "Pregnancy raises the risk of serious flu—get protected." → msg: "Correct! Flu can be more severe during pregnancy, and vaccination helps protect both you and your baby."
- *(Also named in the Wellness Star pickup under F11; countered myth M9 — see Section B.)*

### F15. Flu vaccination is recommended while breastfeeding — appears 1× (+1 myth)
- **Flu Freeze** (true): "Flu vaccination is recommended while breastfeeding."
- *(Countered myth M10: "Breastfeeding means you cannot get vaccinated.")*

### F16. People can spread flu before symptoms appear — appears 1× (+1 related myth)
- **Flu Freeze** (true): "People can spread flu before realizing they are sick."
- *(Related myth M11: "No fever means you do not have the flu.")*

### F17. Antibiotics do not treat influenza — appears 1×
- **Flu Freeze** (true): "Antibiotics do not treat influenza viruses."

### F18. Get vaccinated early so protection builds before exposure — appears 3×
- **Flu Freeze** (true): "Getting vaccinated before flu season gives protection time to build."
- **Memory Match** (fact card): "Get vaccinated early so your body is protected before exposure." → msg: "Correct! The flu vaccine needs time to help your immune system recognize and respond to the virus, so get vaccinated before exposure."
- **maze pickup** (Vaccine Shield): "Protection starts before exposure."

### F19. Flu can cause days of illness and lingering symptoms for weeks — appears 1×
- **Memory Match** (fact card): "Flu can cause days of illness and lingering symptoms for weeks." → msg: "Correct! Influenza can keep you sick for several days, while fatigue and other symptoms may last longer."

---

# SECTION B — MYTHS (false statements the game presents, each with its in-game correction)

### M1. "The flu shot gives you the flu" — appears 2×
- **Vaccine Darts** (myth): "The flu shot gives you the flu." → "Myth cleared! The flu vaccine cannot cause influenza."
- **Flu Freeze** (false): "The flu shot can give you influenza." → "The flu vaccine cannot give you influenza — it does not contain live flu virus."

### M2. "I'm healthy, so I don't need the vaccine" / "A strong immune system guarantees protection" — appears 2×
- **Vaccine Darts** (myth): "I'm healthy, so I don't need the flu vaccine." → "Myth cleared! Healthy people can still catch and spread influenza."
- **Flu Freeze** (false): "A strong immune system guarantees protection." → "Even healthy people with strong immune systems can catch and spread the flu."

### M3. "I had the flu before, so I'm protected forever" — appears 1×
- **Vaccine Darts** (myth): "I had the flu before, so I'm protected forever." → "Myth cleared! A previous infection does not guarantee protection against this season's strains."

### M4. "The flu is just a bad cold" — appears 2× (identical wording, two mini-games)
- **Vaccine Darts** (myth): "The flu is just a bad cold." → "Myth cleared! Influenza can cause serious complications and hospitalization."
- **Flu Freeze** (false): "The flu is just a bad cold." → "Influenza is more serious than a cold and can lead to complications like pneumonia."

### M5. "One vaccine protects every year" / "Last year's shot protects forever" — appears 2×
- **Vaccine Darts** (myth): "One flu vaccine protects me every year." → "Myth cleared! Flu viruses change, so vaccination is recommended each season."
- **Flu Freeze** (false): "Last year's flu shot protects you forever." → "Flu viruses change over time, so a new vaccine is recommended each season."

### M6. "Flu vaccination is not important for healthcare workers" — appears 1×
- **Vaccine Darts** (myth): "Flu vaccination is not important for healthcare workers." → "Myth cleared! Vaccinated healthcare workers help protect patients, coworkers, and families."

### M7. "Older adults do not need yearly vaccination" — appears 1×
- **Flu Freeze** (false): "Older adults do not need yearly vaccination." → "Older adults are at higher risk from flu and are recommended to get vaccinated every season."

### M8. "Flu is only dangerous for young children" — appears 1×
- **Flu Freeze** (false): "Flu is only dangerous for young children." → "Flu can be serious for everyone, especially older adults and people with health conditions."

### M9. "Pregnancy means you cannot get vaccinated" — appears 1×
- **Flu Freeze** (false): "Pregnancy means you cannot get vaccinated." → "The flu vaccine is recommended in pregnancy and helps protect both parent and baby."

### M10. "Breastfeeding means you cannot get vaccinated" — appears 1×
- **Flu Freeze** (false): "Breastfeeding means you cannot get vaccinated." → "The flu vaccine is safe and recommended while breastfeeding."

### M11. "No fever means you do not have the flu" — appears 1×
- **Flu Freeze** (false): "No fever means you do not have the flu." → "Flu does not always cause a fever — you can be infected and contagious without one."

### M12. "Vaccination only protects the person receiving it" — appears 1×
- **Flu Freeze** (false): "Vaccination only protects the person receiving it." → "Getting vaccinated also helps protect the people around you by reducing spread."

---

# SECTION C — EDUCATIONAL MESSAGES (collectible / sprint / memory / hazard / popup teaching lines)

### Maze pickups (collectibles)
- Vaccine Shield: "Protection starts before exposure." *(same idea as F18)*
- Speed Boost: "Babies under 6 months are too young for their own flu shot — protection around them matters." *(same idea as F13)*
- Heart: "Protect the people waiting for you at home."
- Family Token: "Protect the moments waiting for you after your shift."
- Wellness Star: "Flu vaccination is especially important for older adults and pregnant people." *(same idea as F11/F14)*

### Hospital Sprint — collectibles (`msg`)
- Vaccine Booster: "Vaccine grabbed! A flu shot keeps you protected all season long."
- Heart: "Nice! You're protecting the people waiting for you at home."
- Family Token: "You made it to the family gathering — everyone stays protected! 🎉"
- Wellness Boost: "Great grab! You're staying healthy for the people who need extra care."
- Energy Icon: "Energized! The flu won't slow you down today."

### Hospital Sprint — obstacles (`msg`)
- Sick-Day Barrier: "A sick day! The flu can cost you more than a shift — a flu shot lowers the risk."
- Cancelled Plans: "Plans cancelled! The flu ruins them — get your flu shot and keep your plans."
- Low-Energy Cloud: "Wiped out! The flu drains your energy — vaccination helps you bounce back."

### Hazard lines (shown when a germ hits you in the maze)
- "Flu slowed you down — stay protected out there."
- "Watch out for the flu! Vaccination lowers your risk."
- "The flu caught you. A flu shot helps you bounce back faster."

### Memory Match — general hints (`MEMORY_MESSAGES`)
- "Read carefully."
- "Connect the action to its outcome."
- "Every season requires updated protection." *(same idea as F1)*
- "Protect yourself and the people around you." *(same idea as F5)*

### Memory Match — wrong-match hints (`MEMORY_WRONG`)
- "Not a match. Read both cards and try again."
- "These two ideas are not directly connected."
- "Try another pair."
- "Look for the action that creates this benefit."
- "Think about how influenza is prevented or spread."

### VaxFacts+ clinic walk-in popup (`vc-text` paragraphs)
- "Influenza vaccination is free and available through Ontario's publicly funded flu vaccine program." *(same idea as F9)*
- "Have questions about vaccines? Book an appointment with the VaxFacts+ Clinic for a one-to-one, judgement-free phone conversation with a doctor. The goal is to give you facts in a safe space so you can make an informed decision." *(same idea as F10)*
- "A flu shot helps protect you, your loved ones and your community." *(same idea as F5)*

### End screen small-print (`#screen-end`, index.html)
- "Influenza vaccination is free and available through Ontario's publicly funded flu vaccine program." *(same idea as F9)*
- "Have questions about vaccines? Book an appointment with the VaxFacts+ Clinic for a one-to-one, judgement-free phone conversation with a doctor. The goal is to give you facts in a safe space so you can make an informed decision." *(same idea as F10)*

---

# FLAGS FOR THE REVIEWER

Wording inconsistencies, potentially vague statements, and near-duplicate ideas worth consolidating:

1. **"flu" vs "influenza" used interchangeably.** Some statements say "the flu" and near-identical
   ones say "influenza" (e.g. F2: "The flu shot cannot give you the flu." vs "The flu vaccine cannot
   give you influenza." vs "The flu shot cannot give you influenza."). Consider standardizing the
   term or confirming the mix is intentional.

2. **F13 grammar — dangling clause.** "Babies under 6 months cannot receive the flu vaccine, they
   need adults to." reads as an incomplete sentence ("...need adults to" [what?]). The Memory Match
   and pickup wordings of the same idea are clearer; suggest aligning them.

3. **Curly vs straight apostrophes are mixed.** Memory Match cards use typographic characters
   ("can’t", "6 months—") while most other statements use straight quotes/hyphens. Cosmetic, but
   worth a consistency pass if the wording is being edited anyway.

4. **Identical myth reused across two mini-games.** "The flu is just a bad cold." (M4) appears
   verbatim in both Vaccine Darts and Flu Freeze with *different* corrections. Same for the
   "healthy/strong immune system" idea (M2) and the "one shot lasts forever" idea (M5). A player
   who plays both may see the same myth twice — confirm this repetition is desired or diversify.

5. **F16 pairing may be medically loose.** The true statement "People can spread flu before
   realizing they are sick." is separate from the myth "No fever means you do not have the flu."
   Both touch on asymptomatic/pre-symptomatic spread but aren't the same claim; a reviewer may want
   to verify the "no fever" correction ("...infected and contagious without one") is precise.

6. **"Ontario's publicly funded flu vaccine program" is location-specific.** This claim appears 3×
   (FACTS, VaxFacts+ popup, end screen). Confirm it is accurate/current for the intended audience
   (Scarborough Health Network / Ontario) and the vaccine is free for all groups implied.

7. **Vague reassurance wording.** "A strong immune system guarantees protection." is presented as a
   myth (good), but several positive lines lean general ("keeps you protected all season long,"
   "protection starts before exposure") without qualifiers like "helps." A reviewer may want to
   ensure the game never implies the vaccine is 100% protective.

8. **Near-duplicate ideas that could be consolidated** (currently many wordings of a few ideas):
   annual vaccination (5 wordings), healthy-people-still-get-flu (4 true + 2 myth), vaccination
   protects those around you (4). This is likely intentional (variety across mini-games), but the
   reviewer should confirm all wordings stay medically equivalent so no single phrasing drifts.

9. **Out-of-scope but adjacent:** the "Ready to Get Your Flu Vaccine?" info page (`VACCINE_INFO` in
   script.js) contains one teaching line — "Protect yourself, your patients, and those around you by
   getting your annual flu vaccine." — plus logistics (clinic dates/hours/locations, "available
   beginning October 15", pharmacy availability). Not included above as it is primarily operational
   info, but flag it if clinic details also need fact-checking.
