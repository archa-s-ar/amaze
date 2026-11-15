/**
 * AMAZE — Space Mission Engineering Simulator
 * educational.js — "Science Behind the Mission" encyclopedia and interactive calculators
 */

export const SCIENCE_TOPICS = [
  {
    id: 'life_support',
    title: 'Closed-Loop Atmospheric Life Support (ECLSS)',
    category: 'ATMOSPHERE',
    subtitle: 'How astronauts breathe in an airless vacuum without opening a window',
    icon: 'wind',
    summary: 'Humans consume roughly 0.84 kg of pure oxygen daily and exhale 1.0 kg of carbon dioxide. In deep space, replenishing oxygen from Earth is prohibitively heavy, requiring catalytic recycling loops.',
    sections: [
      {
        heading: 'The Sabatier Reaction',
        content: `To recover water and oxygen from metabolic exhalations, spacecraft use a catalytic process discovered by French chemist Paul Sabatier. In the presence of a nickel or ruthenium catalyst heated to 300°C–400°C, carbon dioxide reacts with hydrogen:

$$\\text{CO}_2 + 4\\text{H}_2 \\longrightarrow \\text{CH}_4 + 2\\text{H}_2\\text{O} + \\text{Heat}$$

The produced water ($\\text{H}_2\\text{O}$) is condensed and channeled directly into an electrolysis system, while the byproduct methane ($\\text{CH}_4$) is either vented into space or cracked into solid carbon and hydrogen to further close the loop.`
      },
      {
        heading: 'Oxygen Generation via Water Electrolysis',
        content: `Once water is recovered, an Oxygen Generation Assembly (OGA) passes an electric current through high-purity water to crack it back into breathable diatomic oxygen:

$$2\\text{H}_2\\text{O} + \\text{Electrical Energy} \\longrightarrow 2\\text{H}_2 + \\text{O}_2$$

The generated $\\text{O}_2$ is metered directly into the habitat atmosphere at a partial pressure of approximately 21 kPa (matching Earth sea-level oxygen concentration), while the $\\text{H}_2$ feeds right back into the Sabatier reactor.`
      },
      {
        heading: 'Carbon Dioxide Scrubbing',
        content: `Before $\\text{CO}_2$ can reach toxic levels (>0.5% causes headaches, >2% causes severe impairment), regenerative amine or zeolite thermal swing adsorption beds (CDRA) continually strip $\\text{CO}_2$ molecules from the circulating cabin breeze without consuming expendable filters.`
      }
    ],
    realWorldRef: 'NASA Environmental Control and Life Support System (ECLSS) on the International Space Station and the Orion Exploration ECLSS architecture.',
    calculator: {
      type: 'oxygen_calculator',
      title: 'Crew Oxygen & Recovery Simulator',
      desc: 'Simulate how varying crew size and ECLSS loop closure efficiency impacts daily oxygen resupply requirements.'
    }
  },

  {
    id: 'water_recycling',
    title: 'Closed-Loop Hydrology & Water Recovery',
    category: 'HYDROLOGY',
    subtitle: 'Why every single drop of water in space must be reclaimed and purified',
    icon: 'droplet',
    summary: 'Lifting 1 liter of water from Earth\'s gravity well to the Moon costs thousands of dollars. Sustainable human settlements require recovering at least 95–98% of all water from sweat, breath moisture, hygiene wash, and urine.',
    sections: [
      {
        heading: 'Vapor Compression Distillation (VCD)',
        content: `Because boiling water in microgravity or reduced lunar gravity (1/6th g) suffers from bubbles that do not rise normally, spacecraft utilize rotating distillation centrifuges. Urine is acidified with chromium or phosphoric acid to prevent urea breakdown into ammonia, then boiled at low pressure inside a rotating vacuum drum. The water vapor is compressed, condensing as pristine distilled water.`
      },
      {
        heading: 'Multi-Barrier Filtration & Catalytic Oxidation',
        content: `The distilled water passes through particulate filters, high-pressure reverse osmosis membranes, and a catalytic oxidation reactor heated to 125°C. Any residual volatile organic carbons (VOCs) are oxidized into trace carbon dioxide and pure water. Biocides (such as silver ions or iodine) are added to prevent bacterial biofilm formation in storage tanks.`
      },
      {
        heading: 'The 98% Recovery Milestone',
        content: `In 2023, NASA\'s ISS ECLSS team achieved a historic milestone: 98% overall water recovery efficiency by deploying a Brine Processor Assembly (BPA) that extracts the final drops of moisture from concentrated wastewater brine.`
      }
    ],
    realWorldRef: 'NASA Marshall Space Flight Center — Exploration ECLSS Development & ISS Water Recovery System (WRS).',
    calculator: {
      type: 'water_calculator',
      title: 'Water Recovery Loop Simulator',
      desc: 'Calculate the total mass of water saved over a 30-day lunar expedition based on filtration efficiency.'
    }
  },

  {
    id: 'radiation',
    title: 'Space Radiation Hazards & Regolith Shielding',
    category: 'RADIATION',
    subtitle: 'Surviving without Earth\'s atmosphere and geomagnetic shield',
    icon: 'shield',
    summary: 'On Earth, a thick atmosphere and a powerful geomagnetic field protect us from lethal cosmic radiation. On the Moon, astronauts face Galactic Cosmic Rays and sudden Solar Particle Events.',
    sections: [
      {
        heading: 'The Dual Radiation Threats',
        content: `1. **Galactic Cosmic Rays (GCR):** High-energy atomic nuclei (relativistic protons, helium nuclei, and HZE ions like iron) originating from ancient supernova explosions outside our solar system. They deliver a steady background dose of ~1.5 to 2.5 mSv per day on the lunar surface.
2. **Solar Particle Events (SPE):** Sudden blasts of intense coronal mass ejection protons ejected by solar flares. An unshielded astronaut caught during a major SPE can receive a dose exceeding 1,000 to 4,000 mSv within hours—causing acute radiation sickness, vomiting, bone marrow suppression, or death.`
      },
      {
        heading: 'The Physics of Shielding Materials',
        content: `Heavy metals like lead are surprisingly poor shields against high-energy cosmic rays because cosmic iron nuclei collide with lead atoms, producing dangerous secondary neutron showers (spallation). 

Instead, materials rich in light hydrogen nuclei (like water, polyethylene plastic, and liquid hydrogen) are vastly superior at absorbing proton momentum without producing secondary fragments.`
      },
      {
        heading: 'Lunar Regolith as Bulk Shielding',
        content: `The most cost-effective shielding is local lunar dirt (regolith). Burying a habitat under 2 to 3 meters of compacted regolith (density ~1.5 to 1.8 g/cm³) absorbs both GCR flux and lethal solar flare protons, bringing radiation exposure down to safe terrestrial occupational levels.`
      }
    ],
    realWorldRef: 'NASA Space Radiation Analysis Group (SRAG) at Johnson Space Center; NASA Artemis Lunar Surface Radiation Assessment.',
    calculator: {
      type: 'radiation_calculator',
      title: 'Regolith Depth vs Radiation Exposure Calculator',
      desc: 'See how many centimeters of lunar regolith are needed to attenuate cosmic rays down to safe human thresholds.'
    }
  },

  {
    id: 'energy_systems',
    title: 'Polar Photovoltaics & Extreme Thermal Management',
    category: 'ENERGY',
    subtitle: 'Generating gigajoules at 1.5° sun elevation with zero atmospheric convection',
    icon: 'sun',
    summary: 'The Moon has no atmosphere to scatter light or carry heat away. Surface temperatures swing from +120°C in direct sunlight to -130°C in shadow, demanding specialized vertical solar towers and auxiliary storage.',
    sections: [
      {
        heading: 'Peaks of Eternal Light (PEL)',
        content: `Because the Moon\'s rotational axis is tilted by only 1.54° relative to the ecliptic plane, the sun never rises high in the sky at the lunar poles—it skims the jagged horizon continuously. 

Elevated rims of craters such as Shackleton, Faustini, and Malapert Mountain receive sunlight up to 80% to 90% of the year. Installing vertical solar towers on these peaks provides nearly continuous clean electrical generation.`
      },
      {
        heading: 'Thermal Vacuum Challenges',
        content: `In a complete vacuum, heat cannot transfer via convection or conduction through air. Spacecraft can only shed excess heat through infrared radiation into deep space via large radiator fins:

$$Q = \\varepsilon \\sigma A (T_{\\text{radiator}}^4 - T_{\\text{space}}^4)$$

Where $\\sigma$ is the Stefan-Boltzmann constant ($5.67 \\times 10^{-8} \\text{ W/m}^2\\text{K}^4$). Active pumped liquid cooling loops (using ammonia or water-glycol) transfer heat from electronics to reflective titanium radiators.`
      },
      {
        heading: 'Energy Storage for Lunar Shadows',
        content: `When local craters cast shadows, photovoltaic generation stops. High-density solid-state batteries or Regenerative Fuel Cells (RFC)—which electrolyze water into hydrogen and oxygen during sunlit periods and recombine them into water during darkness—are essential to keep habitats from freezing.`
      }
    ],
    realWorldRef: 'NASA Glenn Research Center — Fission Surface Power & Vertical Solar Array Technology (VSAT) for Artemis.',
    calculator: null
  },

  {
    id: 'lunar_dust',
    title: 'Lunar Regolith & Dust Adhesion Mechanics',
    category: 'GEOLOGY',
    subtitle: 'Why pulverized abrasive glass is one of the greatest engineering hazards in space',
    icon: 'alert-triangle',
    summary: 'Without wind, rain, or atmospheric friction, micrometeorite impacts have pulverized lunar rock into microscopic, razor-sharp glass shards that cling to everything electrostatically.',
    sections: [
      {
        heading: 'Abrasive Morphology',
        content: `Unlike terrestrial sand grains, which are smoothed over millennia by wind and river erosion, lunar regolith particles are jagged, sharp shards of volcanic basalt, anorthosite, and impact glass with barbed edges. During the Apollo missions, dust chewed through Kevlar boot layers, clogged mechanical bearings, and abraded camera lenses.`
      },
      {
        heading: 'Photoelectric Charging & Levitation',
        content: `Solar ultraviolet radiation and solar wind ions knock electrons out of lunar dust grains on the sunlit surface, giving them a net positive electrical charge. Across the day/night terminator boundary, electrostatic fields cause dust grains to levitate and form low-altitude dust fountains that adhere tenaciously to solar panels and spacesuit visors.`
      },
      {
        heading: 'Engineering Countermeasures',
        content: `Engineers develop active electrostatic dust repulsion grids (using pulsed wire arrays embedded in solar glass), specialized liquid nitrogen shower airlocks, and omniphobic carbon nanotube coatings to repel charged regolith before it can enter the living quarters.`
      }
    ],
    realWorldRef: 'Apollo Lunar Surface Journal; NASA Dust Mitigation Project (DMP) at Kennedy Space Center.',
    calculator: null
  },

  {
    id: 'space_agriculture',
    title: 'Controlled Environment Agriculture & Hydroponics',
    category: 'AGRICULTURE',
    subtitle: 'Cultivating crops in 1/6th gravity with precision lighting and recycled nutrients',
    icon: 'sprout',
    summary: 'Fresh crops produce essential vitamins (like Vitamin C and K) that degrade in packaged freeze-dried rations over long missions, while providing vital psychological well-being to isolated astronauts.',
    sections: [
      {
        heading: 'Hydroponics and Aeroponics in Low Gravity',
        content: `In 1/6th gravity, water does not drain downward as rapidly as on Earth; capillary forces dominate. Aeroponic systems mist bare roots with nutrient-rich water droplets at high pressure, providing optimal oxygenation to root tissues while consuming 95% less water than traditional soil farming.`
      },
      {
        heading: 'Photosynthetically Active Radiation (PAR)',
        content: `Plants do not need the full broad spectrum of sunlight. Chlorophyll a and b primarily absorb light in the blue (430–450 nm) and red (640–660 nm) spectrums. Modern space growth chambers use tuned LED arrays emitting "magenta" light, saving up to 60% of electrical power compared to full-spectrum incandescent or fluorescent fixtures.`
      },
      {
        heading: 'Crop Selection for Lunar Outposts',
        content: `Candidate space crops include dwarf wheat, radishes, sweet potatoes, microgreens, and spirulina microalgae. These crops feature high harvest index (percentage of edible biomass), fast seed-to-harvest turnover (under 25 days for greens), and high nutrient density.`
      }
    ],
    realWorldRef: 'NASA Kennedy Space Center — Advanced Plant Habitat (APH) and Vegetable Production System (Veggie) aboard ISS.',
    calculator: null
  },

  {
    id: 'isru',
    title: 'In-Situ Resource Utilization (ISRU) & Lunar Ice',
    category: 'GEOLOGY',
    subtitle: 'Living off the land: mining rocket propellant and water from lunar craters',
    icon: 'compass',
    summary: 'In-Situ Resource Utilization means manufacturing what you need from local celestial materials rather than transporting every kilogram from Earth.',
    sections: [
      {
        heading: 'Permanently Shadowed Cold Traps',
        content: `Because the lunar polar axis has virtually no tilt, deep crater floors (like Shackleton, Cabeus, and Shoemaker) never receive a ray of sunlight. Temperatures drop to 40 Kelvin (-233°C)—colder than the surface of Pluto! 

Comets and water-bearing asteroids impacting the Moon over billions of years deposited volatile water vapor that froze into these natural cryogenic traps, forming vast underground reserves of water ice.`
      },
      {
        heading: 'Extracting Oxygen from Dry Regolith',
        content: `Even outside icy craters, dry lunar regolith consists of roughly 40% to 45% oxygen by weight, bound chemically to metals in minerals like ilmenite ($\\text{FeTiO}_3$) and silica ($\\text{SiO}_2$). 

Using molten regolith electrolysis or carbothermal reduction, high-temperature reactors heated to 1,600°C split molten rock into pure oxygen gas and structural metal alloys (iron, silicon, and aluminum) for construction.`
      }
    ],
    realWorldRef: 'NASA Lunar Flashlight, VIPER rover mission architecture, and ESA ISRU Demonstration Project.',
    calculator: null
  },

  {
    id: 'micrometeorites',
    title: 'Hypervelocity Impact Physics & Whipple Shielding',
    category: 'STRUCTURES',
    subtitle: 'Stopping cosmic bullets traveling at 30 kilometers per second',
    icon: 'target',
    summary: 'Without an atmosphere to burn up incoming space debris, dust particles impact the Moon at velocities ranging from 11 km/s to over 72 km/s. At these speeds, a speck of sand hits with explosive kinetic force.',
    sections: [
      {
        heading: 'The Kinetic Energy Equation',
        content: `Kinetic energy scales with the square of velocity:

$$E_k = \\frac{1}{2} m v^2$$

A 1-gram pebble traveling at 30 km/s carries approximately 450 kilojoules of kinetic energy—equivalent to the explosion of 100 grams of TNT! A solid metal wall would simply shatter or blast shrapnel into the habitat interior.`
      },
      {
        heading: 'Fred Whipple\'s Ingenious Bumper Shield',
        content: `In 1947, astronomer Fred Whipple invented the sacrificial bumper shield. A thin aluminum outer sheet is offset by 5 to 10 centimeters from the main pressure hull. 

When a hypervelocity particle strikes the thin outer bumper, the immense shockwave instantly vaporizes both the projectile and the bumper sheet into an expanding cloud of superheated plasma and micro-droplets. This cloud disperses over a wide area, harmlessly dissipating its force against the inner pressure hull.`
      },
      {
        heading: 'Multi-Layer Flexible Stuffs',
        content: `Modern inflatable lunar habitats combine outer Whipple bumper sheets with layers of Nextel ceramic fabric, Kevlar ballistic weave, and open-cell foam shock absorbers, providing superior protection at a fraction of the mass of solid metal armor.`
      }
    ],
    realWorldRef: 'NASA Orbital Debris Program Office & Hypervelocity Impact Technology (HVIT) Facility at Johnson Space Center.',
    calculator: null
  }
];
