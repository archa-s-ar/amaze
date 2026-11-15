/**
 * AMAZE — Space Mission Engineering Simulator
 * events.js — Dynamic Mission Scenarios, Crises, Decision Trees, and Science Insights
 */

export const MISSION_EVENTS = [
  {
    id: 'solar_storm_warning',
    title: 'Coronal Mass Ejection: Solar Particle Event (SPE)',
    severity: 'CRITICAL',
    affectedFacility: 'radiationShelter',
    minDay: 4,
    maxDay: 28,
    cooldownDays: 8,
    weight: 15,
    description: 'Deep Space Climate Observatory sensors detect an X-class solar flare directed toward the Earth-Moon system. High-energy protons (100+ MeV) will impact the lunar surface within 6 hours. The outpost lacks a global magnetosphere to deflect them.',
    scienceInsight: 'Unlike Earth, the Moon has no intrinsic dipolar magnetic field. During Solar Particle Events (SPEs), unshielded astronauts can receive lethal doses of ionizing radiation (>1–2 Gy) within hours. Dense materials with low atomic mass (like water, polyethylene, and thick lunar regolith) offer the best proton absorption.',
    readMoreTopic: 'radiation',
    choices: [
      {
        id: 'storm_shelter_lockdown',
        label: 'Order Full Crew Lockdown in Regolith Storm Shelter',
        desc: 'Relocate all 4 astronauts into the subterranean bunker until flux subsides. EVA maintenance halted.',
        costPreview: 'Zero radiation damage; EVA operations halted for 1 day; -10 Energy for auxiliary bunker life support.',
        apply(sim) {
          sim.resources.energy.current = Math.max(0, sim.resources.energy.current - 10);
          sim.activeModifiers.shelterLockdown = 1;
          sim.addLog('TACTICAL: Crew took shelter in Regolith Bunker. Solar storm safely weathered.');
          return 'Crew safely shielded within the sub-regolith vault. Minimal radiation absorbed.';
        }
      },
      {
        id: 'storm_active_deflector',
        label: 'Overdrive Magnetic Coil & Deploy Regolith Shutters',
        desc: 'Route surge power to active electromagnetic deflectors and external blast louvers.',
        costPreview: '-25 Energy; -8 Construction Materials; Minor radiation dose (+6 mSv).',
        apply(sim) {
          sim.resources.energy.current = Math.max(0, sim.resources.energy.current - 25);
          sim.resources.spendMaterials(8);
          sim.resources.radiationIndex += 6;
          sim.addLog('ENGINEERING: Electromagnetic deflectors and shutters absorbed 90% of the proton burst.');
          return 'Active coil deflection contained the proton shower, but strained power converters.';
        }
      },
      {
        id: 'storm_ride_it_out',
        label: 'Maintain Operational Stations (Risk Exposure)',
        desc: 'Keep habitat modules running at normal power. Crew relies only on surface hull shielding.',
        costPreview: 'No resource cost; Severe radiation dose (+28 mSv to all crew); -10% Crew Health.',
        apply(sim) {
          sim.resources.radiationIndex += 28;
          sim.crewManager.crew.forEach(c => {
            c.health = Math.max(10, c.health - 12);
            c.radiationDose += 28;
            c.status = 'RAD_FATIGUE';
          });
          sim.addLog('CRITICAL: Outpost hull failed to stop high-energy protons. Crew shows acute radiation fatigue.');
          return 'Crew sustained heavy ionizing radiation exposure. Medical intervention required.';
        }
      }
    ]
  },

  {
    id: 'solar_array_degradation',
    title: 'Regolith Dust Electrostatic Adhesion',
    severity: 'MEDIUM',
    affectedFacility: 'solarArray',
    minDay: 3,
    maxDay: 26,
    cooldownDays: 6,
    weight: 20,
    description: 'Sub-micron lunar dust (regolith) particles, electrostatically charged by solar ultraviolet radiation and solar wind plasma, have levitated and coated the photovoltaic arrays, dropping generation by 35%.',
    scienceInsight: 'Lunar dust is jagged, abrasive, and un-weathered due to the lack of wind or liquid water. It clings electrostatically to spacesuits, radiator surfaces, and solar cells. NASA Apollo missions recorded significant thermal spikes and optical degradation from dust deposition.',
    readMoreTopic: 'lunar_dust',
    choices: [
      {
        id: 'dust_eva_cleaning',
        label: 'Deploy Sarah Kowalski on Targeted Cleaning EVA',
        desc: 'Use CO2 pulse-wipers and mechanical brushes to clear the panels.',
        costPreview: '-6 Construction Materials (wiper gas/seals); Restores array output to 100%.',
        apply(sim) {
          sim.resources.spendMaterials(6);
          sim.infrastructure.facilities.solarArray.dustAccumulation = 0;
          sim.addLog('MAINTENANCE: EVA specialist cleaned the solar arrays. Power generation restored.');
          return 'Arrays cleared of jagged regolith. Photovoltaic efficiency back to nominal.';
        }
      },
      {
        id: 'dust_draw_battery',
        label: 'Compensate with Auxiliary Battery Discharge',
        desc: 'Leave dust in place and rely on backup battery cells to cover the daily deficit.',
        costPreview: '0 Materials; -20 Battery Energy reserves; Array remains degraded.',
        apply(sim) {
          sim.resources.energy.current = Math.max(0, sim.resources.energy.current - 20);
          sim.infrastructure.facilities.solarArray.dustAccumulation = Math.min(60, sim.infrastructure.facilities.solarArray.dustAccumulation + 25);
          sim.addLog('SYSTEMS: Auxiliary battery absorbed power deficit. Array remains dust-encrusted.');
          return 'Battery reserves cushioned the loss, but panels remain partially obscured.';
        }
      },
      {
        id: 'dust_shed_load',
        label: 'Shed Non-Essential Habitat Loads',
        desc: 'Dim habitat illumination, reduce science lab heating, and power down external telemetry.',
        costPreview: 'Conserves power; -5% Crew Health (morale & cold fatigue); Array remains dusty.',
        apply(sim) {
          sim.crewManager.crew.forEach(c => {
            c.health = Math.max(10, c.health - 5);
          });
          sim.infrastructure.facilities.solarArray.dustAccumulation = Math.min(50, sim.infrastructure.facilities.solarArray.dustAccumulation + 15);
          sim.addLog('OPERATIONS: Non-essential systems shut down to match degraded solar output.');
          return 'Base load reduced. Crew suffered cold and restricted operations inside the dim habitat.';
        }
      }
    ]
  },

  {
    id: 'water_leakage',
    title: 'Water Recovery Loop: Seal Rupture',
    severity: 'HIGH',
    affectedFacility: 'waterRecovery',
    minDay: 5,
    maxDay: 25,
    cooldownDays: 7,
    weight: 18,
    description: 'A thermal expansion cycle cracked an elastomeric seal in the gray water distillation loop. High-pressure treated water is venting into the vacuum maintenance conduit at 15 units per hour.',
    scienceInsight: 'Lunar surface temperatures swing from +120°C in sunlight down to -130°C in shadow. These massive thermal oscillations cause metal pipes and seals to expand and contract violently. In space, every drop of water is recycled from sweat, breath condensate, and urine.',
    readMoreTopic: 'water_recycling',
    choices: [
      {
        id: 'leak_immediate_repair',
        label: 'Emergency Seal Replacement with Composite Patch',
        desc: 'Isolate the manifold and execute a rapid seal replacement using spare conduit alloys.',
        costPreview: '-12 Construction Materials; -6 Water lost during isolation; Loop restored.',
        apply(sim) {
          sim.resources.spendMaterials(12);
          sim.resources.water.current = Math.max(0, sim.resources.water.current - 6);
          sim.addLog('REPAIR: Technicians patched the gray water loop. Leak arrested.');
          return 'Loop repressurized with composite seal. Venting halted with minimal water loss.';
        }
      },
      {
        id: 'leak_isolate_subloop',
        label: 'Isolate Gray Water Sub-Loop (Partial Bypass)',
        desc: 'Shut down the auxiliary distiller branch. Halts venting without using materials, but cuts recycling rate.',
        costPreview: '0 Materials; -12 Water lost; Water recovery reduced by 35% for 3 days.',
        apply(sim) {
          sim.resources.water.current = Math.max(0, sim.resources.water.current - 12);
          sim.activeModifiers.waterRecoveryPenalty = 3; // 3 days penalty
          sim.addLog('SYSTEMS: Ruptured section bypassed. Recycling throughput temporarily downgraded.');
          return 'Manifold isolated. Water loss halted, but wastewater recycling operates at reduced capacity.';
        }
      },
      {
        id: 'leak_emergency_freeze',
        label: 'Cryo-Freeze Pipe Section using External Lunar Shadow',
        desc: 'Vent ambient lunar cold (-130°C) to freeze the leak shut until scheduled maintenance.',
        costPreview: '-18 Water lost; -8 Energy; Risk of micro-fracturing habitat integrity (-4%).',
        apply(sim) {
          sim.resources.water.current = Math.max(0, sim.resources.water.current - 18);
          sim.resources.energy.current = Math.max(0, sim.resources.energy.current - 8);
          sim.resources.habitatIntegrity = Math.max(10, sim.resources.habitatIntegrity - 4);
          sim.addLog('ALERT: Thermal shock cryo-plug held the leak, but induced thermal stress on bulkhead.');
          return 'Cryogenic ice plug arrested the venting, but caused micro-stresses on surrounding bulkheads.';
        }
      }
    ]
  },

  {
    id: 'greenhouse_malfunction',
    title: 'Hydroponic Thermal Regulator Failure',
    severity: 'MEDIUM',
    affectedFacility: 'greenhouse',
    minDay: 6,
    maxDay: 27,
    cooldownDays: 6,
    weight: 18,
    description: 'The heat exchanger valve regulating nutrient solution temperature inside the greenhouse has jammed open. Root zones are plunging toward 4°C, threatening seedling shock and total crop wilt.',
    scienceInsight: 'Plant roots require precise temperature ranges (18°C–22°C) to absorb dissolved nitrates, phosphorus, and potassium. Below 10°C, nutrient uptake stops and cell membrane transport fails, leading to permanent crop death within 48 hours.',
    readMoreTopic: 'space_agriculture',
    choices: [
      {
        id: 'greenhouse_boost_power',
        label: 'Engage Auxiliary Infrared Radiant Heaters',
        desc: 'Saturate the plant canopy with high-intensity thermal IR lamps from battery reserves.',
        costPreview: '-22 Energy; Saves entire crop; Food harvest boosted (+5 Food bonus).',
        apply(sim) {
          sim.resources.energy.current = Math.max(0, sim.resources.energy.current - 22);
          sim.resources.food.current = Math.min(sim.resources.food.max, sim.resources.food.current + 5);
          sim.addLog('AGRICULTURE: Auxiliary IR arrays prevented root freeze. Crop vigor preserved.');
          return 'Infrared radiators stabilized the bio-canopy. Photosynthesis resumed normally.';
        }
      },
      {
        id: 'greenhouse_sacrifice_tier',
        label: 'Sacrifice Outlying Racks to Conserve Power',
        desc: 'Cull 40% of peripheral seedlings to preserve thermal concentration in the central core.',
        costPreview: '-8 Food reserves lost; -6 Energy; Core crop survives.',
        apply(sim) {
          sim.resources.food.current = Math.max(0, sim.resources.food.current - 8);
          sim.resources.energy.current = Math.max(0, sim.resources.energy.current - 6);
          sim.addLog('TACTICAL: Peripheral greenhouse trays sacrificed to safeguard primary seed stock.');
          return 'Outer seedling trays lost to frost, but primary seed stock saved.';
        }
      },
      {
        id: 'greenhouse_tap_emergency_rations',
        label: 'Shutdown Greenhouse & Tap Freeze-Dried Emergency Rations',
        desc: 'Completely shut down greenhouse heaters to save electricity; feed crew shelf-stable packs.',
        costPreview: '+15 Energy saved; -14 Food rations consumed; Greenhouse dormant for 2 days.',
        apply(sim) {
          sim.resources.energy.current = Math.min(sim.resources.energy.max, sim.resources.energy.current + 15);
          sim.resources.food.current = Math.max(0, sim.resources.food.current - 14);
          sim.activeModifiers.greenhouseDormant = 2;
          sim.addLog('LOGISTICS: Greenhouse placed into dormancy. Crew switched to emergency rations.');
          return 'Greenhouse powered down. Conserved vital power, but consumed non-renewable food packs.';
        }
      }
    ]
  },

  {
    id: 'micrometeorite_impact',
    title: 'Hypervelocity Micrometeorite Penetration',
    severity: 'HIGH',
    affectedFacility: 'repairStation',
    minDay: 7,
    maxDay: 28,
    cooldownDays: 7,
    weight: 16,
    description: 'A 2-millimeter interplanetary dust particle traveling at 22 km/s breached the secondary Whipple bumper shield on the habitat\'s western logistics node. Pressure transducer alarms sound as atmospheric pressure begins to drop.',
    scienceInsight: 'At cosmic velocities (15–70 km/s), even a dust speck carries the kinetic energy of a rifle bullet. Spacecraft use "Whipple shields" (sacrificial outer aluminum foils) that vaporize the projectile into an expanding cloud of harmless gas before it reaches the inner pressure vessel.',
    readMoreTopic: 'micrometeorites',
    choices: [
      {
        id: 'impact_rapid_patch',
        label: 'Deploy Automated Sealant Foam & Regolith Sintering Patch',
        desc: 'Fire structural epoxy into the puncture and weld a sintered titanium plate over the exterior breach.',
        costPreview: '-15 Construction Materials; -5 Oxygen; Restores integrity by +10%.',
        apply(sim) {
          sim.resources.spendMaterials(15);
          sim.resources.oxygen.current = Math.max(0, sim.resources.oxygen.current - 5);
          sim.resources.habitatIntegrity = Math.min(100, sim.resources.habitatIntegrity + 10);
          sim.addLog('REPAIR: Breach sealed with structural epoxy and titanium patch. Hull integrity secured.');
          return 'Emergency patch solidified within seconds. Pressure leak halted permanently.';
        }
      },
      {
        id: 'impact_isolate_bulkhead',
        label: 'Dog Down Hatch and Isolate Western Logistics Module',
        desc: 'Seal pressure bulkheads around the compromised module. Halts leak without using materials, but confines crew.',
        costPreview: '0 Materials; -12 Oxygen vented; Habitat integrity -12%; -5% Crew Health.',
        apply(sim) {
          sim.resources.oxygen.current = Math.max(0, sim.resources.oxygen.current - 12);
          sim.resources.habitatIntegrity = Math.max(10, sim.resources.habitatIntegrity - 12);
          sim.crewManager.crew.forEach(c => {
            c.health = Math.max(10, c.health - 5);
          });
          sim.addLog('SYSTEMS: Logistics hatch dogged shut. Air vented from damaged compartment.');
          return 'Bulkhead isolation saved main cabin pressure, but logistics module remains depressurized.';
        }
      },
      {
        id: 'impact_overpressure_pump',
        label: 'Pump Reserve Oxygen to Compensate Leak while Delaying Patch',
        desc: 'Keep module accessible by dumping reserve O2 into the compartment until end of shift.',
        costPreview: '-22 Oxygen reserves lost; -10 Construction Materials; Habitat integrity -8%.',
        apply(sim) {
          sim.resources.oxygen.current = Math.max(0, sim.resources.oxygen.current - 22);
          sim.resources.spendMaterials(10);
          sim.resources.habitatIntegrity = Math.max(10, sim.resources.habitatIntegrity - 8);
          sim.addLog('ALERT: Excessive oxygen vented to buy time. Heavy resource toll.');
          return 'Excessive oxygen consumed maintaining cabin pressure before delayed patch was applied.';
        }
      }
    ]
  },

  {
    id: 'battery_degradation',
    title: 'Solid-State Battery Cell Thermal Runaway Warning',
    severity: 'MEDIUM',
    affectedFacility: 'batterySystem',
    minDay: 8,
    maxDay: 26,
    cooldownDays: 6,
    weight: 15,
    description: 'Internal temperature sensors in Battery Bank #2 spike past 85°C. Dendrite formation in the lithium cell matrix risks a cascaded short circuit that could permanently destroy half the outpost\'s energy storage capacity.',
    scienceInsight: 'Batteries in space must operate in a vacuum where heat cannot escape via air convection—only through liquid cooling loops and radiative surfaces. Repeated fast charge-discharge cycles promote microscopic lithium dendrite needles that can pierce cell separators.',
    readMoreTopic: 'energy_systems',
    choices: [
      {
        id: 'battery_recondition',
        label: 'Replace Degraded Matrix Sub-Modules with Spares',
        desc: 'Swap out shorted cell modules and replenish thermal dielectric gel.',
        costPreview: '-14 Construction Materials; Battery capacity preserved; -8 Energy during overhaul.',
        apply(sim) {
          sim.resources.spendMaterials(14);
          sim.resources.energy.current = Math.max(0, sim.resources.energy.current - 8);
          sim.addLog('MAINTENANCE: Marcus Vance replaced damaged battery sub-modules. Capacity nominal.');
          return 'Damaged cells replaced and dielectric fluid balanced. Storage integrity restored.';
        }
      },
      {
        id: 'battery_isolate_bank',
        label: 'Decommission Bank #2 and Rewire as Reduced String',
        desc: 'Permanently isolate the compromised bank. Eliminates fire risk with zero material cost, but lowers max storage.',
        costPreview: '0 Materials; Max Battery capacity permanently reduced by 25 units.',
        apply(sim) {
          sim.resources.energy.max = Math.max(60, sim.resources.energy.max - 25);
          sim.resources.energy.current = Math.min(sim.resources.energy.current, sim.resources.energy.max);
          sim.addLog('SYSTEMS: Degraded battery bank permanently isolated. Total storage capacity reduced.');
          return 'Compromised cell group removed from the bus. Outpost storage capacity decreased by 25 units.';
        }
      },
      {
        id: 'battery_cryo_vent',
        label: 'Pulse Liquid Nitrogen Coolant from Life Support',
        desc: 'Flash-cool the battery bank using cryo-nitrogen coolant reserves.',
        costPreview: '-12 Energy; -10 Water/Oxygen reserves (shared cryo); Bank saved.',
        apply(sim) {
          sim.resources.energy.current = Math.max(0, sim.resources.energy.current - 12);
          sim.resources.oxygen.current = Math.max(0, sim.resources.oxygen.current - 6);
          sim.resources.water.current = Math.max(0, sim.resources.water.current - 6);
          sim.addLog('TACTICAL: Cryo coolant pulse chilled the battery bank, preventing thermal runaway.');
          return 'Rapid cooling quenched the thermal spike. Consumed valuable cryo life-support stocks.';
        }
      }
    ]
  },

  {
    id: 'life_support_scrubber_warning',
    title: 'Sabatier Catalyst Poisoning & CO2 Spike',
    severity: 'HIGH',
    affectedFacility: 'lifeSupport',
    minDay: 9,
    maxDay: 28,
    cooldownDays: 7,
    weight: 18,
    description: 'Siloxane contaminants from habitat sealants have poisoned the ruthenium catalyst inside the Sabatier carbon dioxide reduction reactor. Cabin carbon dioxide levels climb to 1.8%, causing headaches, cognitive fatigue, and lethargy.',
    scienceInsight: 'Humans exhale approximately 1 kg of CO2 every day. In an airtight lunar habitat, un-scrubbed CO2 rapidly reaches toxic concentrations (>1.0% causes cognitive impairment; >4% is life-threatening). Sabatier reactors use CO2 and hydrogen to produce water and methane.',
    readMoreTopic: 'life_support',
    choices: [
      {
        id: 'scrubber_replace_catalyst',
        label: 'Overhaul Reactor with Fresh Ruthenium Catalyst Bed',
        desc: 'Dismantle the reactor chamber, burn off siloxane deposits, and install clean catalyst pellets.',
        costPreview: '-14 Construction Materials; Restores full CO2 reduction and nominal O2 recovery.',
        apply(sim) {
          sim.resources.spendMaterials(14);
          sim.addLog('ECLSS: Sabatier catalyst bed overhauled. CO2 scrubbing returned to 100% efficiency.');
          return 'Catalyst bed renewed. Cabin carbon dioxide returned to 0.2% baseline.';
        }
      },
      {
        id: 'scrubber_lithium_hydroxide',
        label: 'Deploy Emergency Lithium Hydroxide (LiOH) Canisters',
        desc: 'Use expendable chemical absorption canisters as a temporary stopgap.',
        costPreview: '0 Materials; -8 Construction Materials equivalent in canister reserves; Buys 3 days.',
        apply(sim) {
          sim.resources.spendMaterials(6);
          sim.addLog('ECLSS: Non-renewable LiOH chemical canisters deployed to scrub ambient CO2.');
          return 'LiOH canisters absorbed the CO2 spike, but expendable reserves are limited.';
        }
      },
      {
        id: 'scrubber_air_dump',
        label: 'Vent Cabin Volume and Replenish from High-Pressure Tanks',
        desc: 'Flush contaminated cabin atmosphere into space and repressurize from reserve oxygen cylinders.',
        costPreview: '-20 Oxygen; -12 Energy; -5% Crew Health; Clears air immediately.',
        apply(sim) {
          sim.resources.oxygen.current = Math.max(0, sim.resources.oxygen.current - 20);
          sim.resources.energy.current = Math.max(0, sim.resources.energy.current - 12);
          sim.crewManager.crew.forEach(c => {
            c.health = Math.max(10, c.health - 5);
          });
          sim.addLog('ALERT: Cabin air flushed and repressurized from tanks. Severe oxygen depletion.');
          return 'Atmospheric purge cleared toxic CO2, but drained critical high-pressure oxygen reserves.';
        }
      }
    ]
  },

  {
    id: 'greenhouse_harvest_breakthrough',
    title: 'Controlled Agriculture: High-Yield Crop Harvest',
    severity: 'LOW',
    affectedFacility: 'greenhouse',
    minDay: 10,
    maxDay: 28,
    cooldownDays: 8,
    weight: 14,
    description: 'Dr. Alex Chen\'s optimized photoperiod cycle has produced an unprecedented bounty of dwarf wheat, spirulina, and vitamin-rich microgreens in the hydroponic growth chambers.',
    scienceInsight: 'By tailoring LED light wavelengths to chlorophyll absorption peaks (450 nm blue and 660 nm deep red) and enriching ambient CO2, space hydroponics can achieve growth rates up to four times faster than terrestrial open-field farming.',
    readMoreTopic: 'space_agriculture',
    choices: [
      {
        id: 'harvest_store_food',
        label: 'Process & Vacuum-Pack Harvest into Food Reserves',
        desc: 'Dehydrate and store the surplus produce directly into emergency survival rations.',
        costPreview: '+18 Food added to reserves; +5 Crew Health boost (fresh nutrition).',
        apply(sim) {
          sim.resources.food.current = Math.min(sim.resources.food.max, sim.resources.food.current + 18);
          sim.crewManager.healCrew(6);
          sim.addLog('CELEBRATION: Bountiful crop harvested and packaged into reserve rations. Crew morale boosted.');
          return 'Fresh harvest processed into shelf-stable rations. Crew enjoyed fresh greens.';
        }
      },
      {
        id: 'harvest_biomass_recycling',
        label: 'Ferment Biomass to Recover Water and Soil Microbes',
        desc: 'Route inedible plant stalks into the anaerobic digester to extract purified water and organic compost.',
        costPreview: '+12 Food; +14 Water recovered; +6 Construction Materials (biopolymer).',
        apply(sim) {
          sim.resources.food.current = Math.min(sim.resources.food.max, sim.resources.food.current + 12);
          sim.resources.water.current = Math.min(sim.resources.water.max, sim.resources.water.current + 14);
          sim.resources.materials.current = Math.min(sim.resources.materials.max, sim.resources.materials.current + 6);
          sim.addLog('BIO-LOOP: Agricultural waste converted into recycled water and bio-composites.');
          return 'Closed-loop biomass digester yielded fresh water and structural polymers.';
        }
      },
      {
        id: 'harvest_expand_seedlings',
        label: 'Reinvest Yield into Secondary High-Density Seeding Trays',
        desc: 'Propagate new root stocks to increase baseline daily food production permanently.',
        costPreview: '-6 Water; -5 Energy; Daily greenhouse food production permanently +1.0 unit/day.',
        apply(sim) {
          sim.resources.water.current = Math.max(0, sim.resources.water.current - 6);
          sim.resources.energy.current = Math.max(0, sim.resources.energy.current - 5);
          sim.infrastructure.facilities.greenhouse.upgrades[sim.infrastructure.facilities.greenhouse.level - 1].foodProduction += 1.0;
          sim.addLog('INVESTMENT: Hydroponic canopy expanded. Permanent daily yield increased.');
          return 'Seed stock multiplied. Outpost long-term agricultural production increased.';
        }
      }
    ]
  },

  {
    id: 'lunar_ice_discovery',
    title: 'ISRU Discovery: Volatile Water Ice in Shackleton Crater',
    severity: 'LOW',
    affectedFacility: 'waterRecovery',
    minDay: 11,
    maxDay: 26,
    cooldownDays: 10,
    weight: 12,
    description: 'An autonomous prospecting rover scouting the permanently shadowed interior of Shackleton Crater has detected high hydrogen concentrations, indicating a subsurface water-ice pocket at 40 Kelvin.',
    scienceInsight: 'Permanently Shadowed Regions (PSRs) at the lunar poles have remained in perpetual darkness for over two billion years, acting as cold traps where comet impacts deposited water ice. Harvesting this ice via In-Situ Resource Utilization (ISRU) is key to deep space habitation.',
    readMoreTopic: 'isru',
    choices: [
      {
        id: 'ice_rover_sublimation',
        label: 'Deploy Rover Thermal Drill to Extract Ice Core Samples',
        desc: 'Direct the rover to heat the icy regolith and condense water vapor into sealed recovery tanks.',
        costPreview: '-12 Energy; +24 Water added to outpost tanks; +10 Materials.',
        apply(sim) {
          sim.resources.energy.current = Math.max(0, sim.resources.energy.current - 12);
          sim.resources.water.current = Math.min(sim.resources.water.max, sim.resources.water.current + 24);
          sim.resources.materials.current = Math.min(sim.resources.materials.max, sim.resources.materials.current + 10);
          sim.addLog('SCIENCE: Rover extracted pristine lunar ice from Shackleton Crater floor!');
          return 'Lunar water ice sublimated, purified, and pumped into Outpost Alpha storage.';
        }
      },
      {
        id: 'ice_scientific_analysis',
        label: 'Preserve Core for Deep Cryogenic Paleoclimatology Research',
        desc: 'Preserve ancient cometary ice layers for scientific analysis rather than immediate consumption.',
        costPreview: '+8 Water; +15 Construction Materials (geological samples); Mission score bonus.',
        apply(sim) {
          sim.resources.water.current = Math.min(sim.resources.water.max, sim.resources.water.current + 8);
          sim.resources.materials.current = Math.min(sim.resources.materials.max, sim.resources.materials.current + 15);
          sim.activeModifiers.scienceBonus = (sim.activeModifiers.scienceBonus || 0) + 150;
          sim.addLog('DISCOVERY: Cryogenic cometary core cataloged. Major scientific milestone achieved.');
          return 'Ancient cometary volatiles analyzed. Valuable scientific breakthrough for the mission.';
        }
      },
      {
        id: 'ice_electrolysis_fuel',
        label: 'Electrolyze Ice into Emergency LOX (Liquid Oxygen)',
        desc: 'Run captured water ice through high-power electrolysis to generate breathable oxygen.',
        costPreview: '-15 Energy; +20 Oxygen added to habitat tanks.',
        apply(sim) {
          sim.resources.energy.current = Math.max(0, sim.resources.energy.current - 15);
          sim.resources.oxygen.current = Math.min(sim.resources.oxygen.max, sim.resources.oxygen.current + 20);
          sim.addLog('ISRU: Lunar water ice cracked into pure breathable oxygen.');
          return 'Meltwater electrolyzed into high-purity oxygen, reinforcing life-support reserves.';
        }
      }
    ]
  },

  {
    id: 'lunar_polar_shadow',
    title: 'Solar Eclipse: Extended Polar Crater Shadow',
    severity: 'MEDIUM',
    affectedFacility: 'solarArray',
    minDay: 13,
    maxDay: 24,
    cooldownDays: 8,
    weight: 15,
    description: 'Orbital mechanics alignment causes the peaks of Malapert Mountain to cast an elongated 36-hour shadow over Outpost Alpha\'s solar towers. Solar energy generation drops to near zero.',
    scienceInsight: 'At the lunar poles, the sun skims the horizon at an angle of only 1.5°. While elevated crater rims receive sunlight up to 80–90% of the year ("Peaks of Eternal Light"), brief topographical shadows still plunge habitats into bitter cold and darkness, requiring robust energy storage.',
    readMoreTopic: 'energy_systems',
    choices: [
      {
        id: 'shadow_battery_triage',
        label: 'Switch to Full Battery Power & Prioritize ECLSS',
        desc: 'Draw energy strictly from the auxiliary battery bank, maintaining life support and heaters.',
        costPreview: '-30 Energy from Battery; Habitat warm and nominal; No material loss.',
        apply(sim) {
          sim.resources.energy.current = Math.max(0, sim.resources.energy.current - 30);
          sim.addLog('ENERGY: Outpost operated on battery reserves throughout the polar shadow.');
          return 'Battery bank carried Outpost Alpha through the dark eclipse period safely.';
        }
      },
      {
        id: 'shadow_deep_conservation',
        label: 'Enter Deep Eco-Hibernation Mode',
        desc: 'Lower cabin temperature to 14°C, suspend hydroponic lighting, and confine crew to sleeping berths.',
        costPreview: '-12 Energy; -5% Crew Health (cold stress); -3 Food (slowed growth).',
        apply(sim) {
          sim.resources.energy.current = Math.max(0, sim.resources.energy.current - 12);
          sim.crewManager.crew.forEach(c => {
            c.health = Math.max(10, c.health - 5);
          });
          sim.resources.food.current = Math.max(0, sim.resources.food.current - 3);
          sim.addLog('HIBERNATION: Habitat entered low-power hibernation to preserve battery reserves.');
          return 'Severe power throttling conserved batteries. Crew endured cold until sunlight returned.';
        }
      },
      {
        id: 'shadow_fuel_cell_pulse',
        label: 'Run Fuel Cell in Regenerative Reversal with Material Burn',
        desc: 'Consume stored oxygen and hydrogen catalysts to sustain full electrical power.',
        costPreview: '-12 Oxygen; -8 Materials; 0 Battery drain.',
        apply(sim) {
          sim.resources.oxygen.current = Math.max(0, sim.resources.oxygen.current - 12);
          sim.resources.spendMaterials(8);
          sim.addLog('SYSTEMS: Regenerative fuel cell burned chemical catalysts to generate full power.');
          return 'Chemical power sustained the outpost without depleting battery reserves.';
        }
      }
    ]
  }
];

export class EventManager {
  constructor(savedEvents = null) {
    this.eventHistory = savedEvents ? savedEvents.history || [] : [];
    this.lastTriggeredDay = savedEvents ? savedEvents.lastTriggeredDay || {} : {};
    this.activeEvent = savedEvents ? savedEvents.activeEvent || null : null;
  }

  /**
   * Determine if an event should trigger for the given day
   * @param {Object} sim - The simulation engine instance
   * @returns {Object|null} Triggered event or null
   */
  evaluateEventTrigger(sim) {
    const day = sim.day;

    // Guaranteed tutorial / narrative milestones or randomized based on condition
    // For educational immersion, ensure at least one event every 2-3 days
    const eligibleEvents = MISSION_EVENTS.filter(evt => {
      if (day < evt.minDay || day > evt.maxDay) return false;
      const lastDay = this.lastTriggeredDay[evt.id] || -99;
      if (day - lastDay < evt.cooldownDays) return false;

      // Condition filters
      if (evt.id === 'solar_array_degradation') {
        const dust = sim.infrastructure.facilities.solarArray.dustAccumulation;
        return dust > 10 || day % 5 === 0;
      }
      if (evt.id === 'micrometeorite_impact') {
        return sim.resources.habitatIntegrity < 90 || day % 6 === 0;
      }
      if (evt.id === 'greenhouse_malfunction') {
        return sim.infrastructure.facilities.greenhouse.level >= 1 && (sim.resources.water.current < 60 || day % 7 === 0);
      }
      return true;
    });

    if (eligibleEvents.length === 0) return null;

    // Deterministic selection based on day seed or priority
    const selected = eligibleEvents[(day * 7 + 3) % eligibleEvents.length];
    this.activeEvent = selected;
    return selected;
  }

  /**
   * Apply user's selected choice
   */
  resolveActiveEvent(choiceId, sim) {
    if (!this.activeEvent) return null;
    const choice = this.activeEvent.choices.find(c => c.id === choiceId);
    if (!choice) return null;

    const resultMessage = choice.apply(sim);
    this.lastTriggeredDay[this.activeEvent.id] = sim.day;

    const record = {
      day: sim.day,
      eventId: this.activeEvent.id,
      title: this.activeEvent.title,
      choiceLabel: choice.label,
      resultMessage: resultMessage,
      timestamp: Date.now()
    };

    this.eventHistory.push(record);
    const resolvedEvent = this.activeEvent;
    this.activeEvent = null;

    return {
      event: resolvedEvent,
      choice: choice,
      message: resultMessage
    };
  }

  /**
   * Export state
   */
  getState() {
    return {
      history: this.eventHistory,
      lastTriggeredDay: this.lastTriggeredDay,
      activeEvent: this.activeEvent
    };
  }

  /**
   * Load state
   */
  loadState(saved) {
    if (!saved) return;
    this.eventHistory = saved.history || [];
    this.lastTriggeredDay = saved.lastTriggeredDay || {};
    this.activeEvent = saved.activeEvent || null;
  }
}
