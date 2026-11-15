# AMAZE — Interactive Space Mission Engineering Simulator

> **"Think Like an Engineer. Survive Like an Astronaut."**

AMAZE is an interactive educational space mission simulator designed for students aged 12–18, educators, and space enthusiasts. Rather than reading abstract textbook chapters, students become the mission commander of **Outpost Alpha**—humanity's first research settlement at the Lunar South Pole.

Over 30 simulated mission days (Sols), commanders must manage interconnected closed-loop life-support systems, balance scarce energy and water, construct and upgrade lunar infrastructure, mitigate cosmic radiation, and make life-or-death engineering trade-offs when critical space emergencies strike.

---

## 🚀 Key Features

- **Mathematically Grounded Simulation Engine:**
  - Real aerospace formulas for human metabolic burn (~0.84 kg O₂/day, 2.5 L H₂O/day).
  - Catalytic Sabatier CO₂ reduction, water electrolysis, multi-stage vapor compression distillation (VCD), and reverse osmosis loops.
  - Photovoltaic polar towers capturing low-elevation sunlight (1.5° horizon angle at the "Peaks of Eternal Light"), vulnerable to electrostatic regolith dust adhesion.
  - Auxiliary cryogenic battery banks to survive polar crater shadows.
  - Cumulative Galactic Cosmic Ray (GCR) and Solar Particle Event (SPE) radiation modeling with regolith mass attenuation.

- **Interactive Lunar Outpost Vector Schematic:**
  - Dynamic vector SVG visualization depicting Outpost Alpha on Shackleton Crater rim, with Earth visible in the distance (384,400 km).
  - Seven clickable facilities with real-time health indicators, operational modes, and upgrade tiers.

- **Seven Engineering Facilities & Upgrade Tiers:**
  1. **ECLSS Life Support:** Basic regenerative scrubber → Catalytic Sabatier loop → MOXIE Solid Oxide Electrolysis.
  2. **Water Recovery System:** Vapor compression distiller → Multi-stage reverse osmosis → 98% catalytic closed-loop purifier.
  3. **Polar Solar Array:** Fixed photovoltaic mast → Dual-axis tracking heliostat → Perovskite grid with electrostatic dust repellers.
  4. **Auxiliary Battery Bank:** LiFePO₄ bank (120 units) → Solid-state lithium matrix (180 units) → Regenerative H₂-O₂ fuel cell array (260 units).
  5. **Lunar Hydroponic Bay:** Hydroponic seedling racks → Aeroponic vertical carousels → Automated photobioreactors.
  6. **Regolith Storm Shelter:** Excavated regolith berm (45% absorption) → Sintered regolith vault (72% absorption) → Active magnetic deflector & deep cavern (90% protection).
  7. **Habitat Repair Bay:** Manual sealant patches → Robotic hull crawlers → Self-healing regolith 3D printing.

- **Dynamic Crisis Scenarios & Ethical Engineering Decisions:**
  - Solar Particle Events (SPEs), electrostatic dust contamination, greywater conduit breaches, root zone freeze in the greenhouse, hypervelocity micrometeorite hull penetrations, lithium cell thermal runaway, and Sabatier catalyst poisoning.
  - Every scenario provides three distinct tactical choices with transparent physical trade-offs and an embedded **Engineering Insight** card explaining how NASA and aerospace engineers tackle the problem.

- **"Science Behind the Mission" Interactive Encyclopedia:**
  - Deep, illustrated aerospace science articles on Closed-Loop ECLSS, Space Radiation Physics, Polar Photovoltaics, Regolith Morphology, Hydroponic PAR Spectra, and Whipple Bumper Shields.
  - Interactive calculators for crew oxygen recycling and regolith shielding depth.
  - Verified references to the NASA Artemis Program, ISS ECLSS operational metrics, and Apollo lunar surface data.

- **Procedural Web Audio API Sound Design:**
  - Zero external MP3 downloads. Real-time synthesized spacecraft ambient air circulation hum, crisp UI telemetry clicks, two-tone warning pulses, and crisis alarms with a dedicated mute toggle.

- **Evaluation & Commander Debrief:**
  - Comprehensive 30-day evaluation calculating survival score, resource efficiency, crew welfare, and radiation dose.
  - Earn authentic commander ranks: *Mission Commander*, *Senior Mission Engineer*, *Lunar Exploration Specialist*, or *Legendary Space Commander*.
  - Printable mission certificate and debrief analysis for student science portfolios.

- **Offline & Cross-Platform:**
  - 100% self-contained Vanilla HTML5, CSS3, and JavaScript (ES Modules).
  - No React, Vue, or heavy dependencies.
  - Persistent state via browser `localStorage` with auto-save and resume capability.

---

## 🎮 How to Play

### 1. Mission Mandate & Objectives
As the Mission Commander of **Outpost Alpha** at the Lunar South Pole (Shackleton Crater Rim), your objective is to survive **30 simulated lunar mission days (Sols)** with your 4-astronaut crew alive and outpost infrastructure sustainable.

- **Primary Goal:** Reach Sol 30 without exhausting vital life-support reserves, suffering fatal radiation doses, or experiencing catastrophic hull decompression.
- **Difficulty Selection:**
  - **EASY:** +30% starting supplies, -20% daily consumption, milder emergency events.
  - **NORMAL:** Scientifically balanced starting reserves, standard consumption, authentic space hazards.
  - **EXPERT:** Austere starting cache (-20%), +20% consumption, aggressive regolith dust adhesion.

---

### 2. The Daily Mission Loop (Turn Sequence)
Each Sol follows a structured engineering workflow:

```
[1. Inspect Telemetry] ──> [2. Engineering Bay & Modes] ──> [3. Maintenance / Repairs]
         │
         ▼
[4. Click "Advance to Sol N+1"] ──> [5. Emergency Crisis Event?] ──> [6. Daily Physics Calculation]
                                                │                                    │
                                                ▼ (If Triggered)                     ▼
                                      [Tactical 3-Way Choice]              [Update Vitals & Checks]
```

1. **Inspect Telemetry & Forecasts:** Review the left monitoring panel. Each card shows current reserves, daily burn vs. production, net rate (`+` or `-`), and estimated **Sols Remaining**.
2. **Configure Operating Modes & Upgrades:** Open the **Engineering Bay** to spend Construction Materials on permanent facility upgrades (Level 1 → 2 → 3), or toggle operational modes (e.g., switch to **ECO mode** during power shortages).
3. **Perform Field Maintenance:** If the Polar Solar Array has accumulated dust (>20%), click **Clean Solar Dust** (costs 4 Materials). If Hull Structural Integrity is degrading (<80%), click **Patch Hull Breach** to prevent micro-leaks.
4. **Advance the Sol:** Click **ADVANCE TO SOL N+1**. The button displays a real-time net resource preview before you commit.
5. **Handle Dynamic Emergencies:** If an environmental crisis occurs (e.g., Solar Storm, Micrometeorite Strike, Water Pipe Leak), evaluate the 3 tactical engineering directives and choose the trade-off that best aligns with your survival strategy.
6. **Review Daily Log & Health:** Physical consumption and production are applied, crew physiology is updated, and failure buffers are verified.

---

### 3. Understanding Core Resources

| Resource | Base Daily Rate (4 Crew) | System Recovery | Shortage Consequences |
|---|---|---|---|
| **Oxygen ($\text{O}_2$)** | $-8.0\text{ units/day}$ | ECLSS recycles exhaled $\text{CO}_2$ ($+4$ to $+9.5$) | At 0 units, **Hypoxia** sets in immediately; fatal after a 2-day buffer. |
| **Water ($\text{H}_2\text{O}$)** | $-10\text{ crew} - 4\text{ greenhouse}$ | Water Recovery purifies graywater ($+7$ to $+14$) | At 0 units, acute **Dehydration** degrades health rapidly; fatal after 3 days. |
| **Food Rations** | $-4.0\text{ units/day}$ | Hydroponic Bay harvests fresh crops ($+2$ to $+5.5$) | At 0 units, crew burns metabolic reserves; fatal after 5 days. |
| **Battery Energy** | Consumed by ECLSS, pumps, heaters | Solar Arrays generate $+28$ to $+64\text{ units/day}$ | At 0 units, **BROWNOUT**: heaters fail, life support drops to 25%, greenhouse halts. |
| **Materials** | Non-renewable stockpile (100 units) | Consumed by repairs, dust wipers, and upgrades | Running out prevents repairs and leaves damaged facilities offline. |
| **Radiation Index** | $+2.4\text{ mSv/day}$ background GCR | Regolith Shielding absorbs 45% to 90% | High cumulative doses (>120 mSv) cause radiation sickness and health loss. |
| **Hull Integrity** | $-1.0\%/\text{day}$ micrometeorite wear | Repaired at Habitat Repair Bay ($+15\%$ to $+28\%$) | Under 40%, pressure micro-leaks vent extra $\text{O}_2$. At 0%, decompression failure. |

---

### 4. Crew Roster & Synergy Perks
Each astronaut on Apex Squad provides an active engineering perk when their health remains above **60%**:

- **Maya Lin (Mission Commander):** *Commander Presence* — Increases outpost stress tolerance (+15%) and grants **1 extra buffer day** during critical resource shortages.
- **Dr. Alex Chen (Astrobiologist):** *Green Thumb* — Hydroponic food production increases by **+20%** when health is above 75%.
- **Sarah Kowalski (EVA Lead):** *Field Machinist* — Habitat hull repair operations consume **20% fewer Construction Materials**.
- **Marcus Vance (ECLSS Lead):** *Resource Scavenger* — Water Recovery System efficiency **+15%** and ECLSS power draw **-10%**.

*Tip: Keep crew health high by never allowing resources to drop to zero; healthy astronauts significantly reduce resource burn rates.*

---

### 5. Facility Operating Modes & Engineering Trade-offs
In the **Engineering Bay**, you can toggle individual operational modes for active facilities:

- **ECLSS Life Support & Water Recovery:**
  - `STANDARD`: Balanced recovery and nominal power consumption.
  - `ECO`: Reduces electrical power load by 40–50%, but recovery output drops by 35–40%. *(Crucial during dust storms or solar eclipses!)*
  - `BOOST`: Boosts recovery output by +25–35%, but draws +50–60% more electrical power. *(Use when reserves are in the critical red zone!)*
- **Polar Solar Array:**
  - `HELIOSTAT TRACKING`: Maximum solar collection tracking low polar sun angles.
  - `STORM DEFENSE`: Partially retracts panels to minimize abrasive damage during dust events.
- **Lunar Hydroponic Bay:**
  - `GROWTH`: Standard continuous cultivation.
  - `WATER SAVER`: Reduces water consumption by 45%, but crop yields drop by 40%.
  - `HARVEST BURST`: Overdrives nutrient delivery (+50% food harvest, but +70% water and power draw).
- **Regolith Radiation Shelter:**
  - `NORMAL`: Standard habitat rotation.
  - `STORM LOCKDOWN`: Crew retreats to the deep subterranean vault during Solar Particle Events (reduces storm radiation by 90%, but halts EVAs).

---

### 6. Survival Strategy & Commander Pro-Tips

1. **Upgrade Life Support Early:** On Sol 1, base ECLSS only recovers 4 units of oxygen per day while 4 astronauts consume 8 units (net -4/day). Upgrading to Level 2 (Sabatier Loop) increases recovery to 7 units/day (net -1/day), extending your 100-unit reserve from 25 Sols to over 100 Sols!
2. **Watch the Solar Dust Meter:** Jagged lunar regolith electrostatically clings to solar arrays. When dust exceeds 25%, solar generation drops significantly. Perform a **Clean Solar Dust** EVA before battery reserves deplete.
3. **Never Let Batteries Hit Zero:** An energy blackout is the most lethal cascade in AMAZE. If the battery bank hits 0, the habitat plunges into freezing temperatures and ECLSS oxygen scrubbing drops by 75%.
4. **Reserve 15–20 Materials:** Never spend your last Construction Materials on upgrades. Keep a reserve of at least 15 units to patch unexpected micrometeorite penetrations or repair ruptured graywater conduits.
5. **Use the Science Archive:** Whenever an event or upgrade introduces a concept (like the Sabatier reaction, Whipple shields, or regolith radiation attenuation), click **Read More in Science Archive** to inspect real NASA engineering formulas and calculator tools.

---

### 7. Mission Evaluation & Ranks
Surviving all 30 Sols unlocks the **Mission Evaluation Certificate** with detailed performance scoring:
- **Survival Duration:** Points awarded for each Sol survived (+250 bonus for full completion).
- **Crew Welfare:** Average health of all 4 astronauts at mission end.
- **Resource Efficiency:** Unused stockpiles of oxygen, water, food, energy, and materials.
- **Radiation Safety:** Bonus for maintaining cumulative dose below 50 mSv.
- **Infrastructure Tech Level:** Number of facility upgrades successfully commissioned.
- **Crises Resolved:** Successful mitigation of emergency space events.

**Commander Ranks:**
- **Legendary Space Commander:** Score 1,350+
- **Lunar Exploration Specialist:** Score 1,100 – 1,349
- **Senior Mission Engineer:** Score 850 – 1,099
- **Mission Commander:** Score 600 – 849
- **Cadet Engineer:** Score < 600

---

### Option 1: Native Node.js Server
Clone or navigate to the directory and run:
```bash
npm start
```
Open [http://localhost:8080](http://localhost:8080) in your web browser.

### Option 2: Run Automated Simulation Tests
Run the deterministic simulation and physics test suite:
```bash
npm test
```

### Option 3: Direct Browser Launch
Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari) using a local web server (e.g., Live Server in VS Code or python `-m http.server 8000`).

---

## 📁 Project Architecture

```
amaze/
├── index.html              # Core single-page application structure & SVG defs
├── serve.js                # Lightweight zero-dependency static server
├── test_sim.js             # Automated physics and simulation test suite
├── package.json            # Project manifest & npm scripts
├── README.md               # Product documentation & engineering manual
│
├── css/
│   ├── style.css           # Tokens, reset, typography, buttons, badges
│   ├── landing.css         # Landing page hero, editorial layout, briefing dossier
│   ├── mission-control.css # Operational 3-column layout, telemetry bar, monitors
│   └── components.css      # Modals (Engineering, Events, Science, Charts, Tutorial)
│
└── js/
    ├── main.js             # Application entry point & DOM bootstrap
    ├── game.js             # Game state machine, view coordinator, turn loop
    ├── simulation.js       # Central deterministic simulation engine & failure checks
    ├── resources.js        # Mathematical resource models, burn rates, capacities
    ├── infrastructure.js   # Seven facilities, 3-tier upgrades, operating modes
    ├── events.js           # Dynamic mission events library & decision trees
    ├── crew.js             # Four-astronaut physiological modeling & role perks
    ├── scoring.js          # Mission evaluation, scoring formulas, rank titles
    ├── storage.js          # LocalStorage persistence & state serialization
    ├── educational.js      # Science Behind the Mission archive & calculators
    ├── charts.js           # Responsive standalone SVG telemetry charts
    ├── outpost-visual.js   # Interactive lunar outpost SVG schematic & module map
    ├── sound.js            # Procedural Web Audio API sound synthesizer
    └── tutorial.js         # Interactive onboarding walkthrough overlay
```

---

## 🔬 Educational Disclaimer

> "AMAZE is an independent educational simulation designed to introduce students to the engineering challenges of human space exploration. It is not affiliated with, sponsored by, or endorsed by NASA, ISRO or any other space agency."
