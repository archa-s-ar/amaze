/**
 * AMAZE — Space Mission Engineering Simulator
 * infrastructure.js — Seven Outpost Facilities, Upgrades, Operating Modes, and Trade-offs
 */

export const FACILITIES = {
  lifeSupport: {
    id: 'lifeSupport',
    name: 'ECLSS Life Support',
    category: 'LIFE_SUPPORT',
    icon: 'wind',
    description: 'Closed-loop atmospheric revitalization: Sabatier CO2 scrubbers, trace contaminant filters, and oxygen generation via water electrolysis.',
    level: 1,
    maxLevel: 3,
    health: 100, // 0 - 100%
    mode: 'STANDARD', // 'ECO', 'STANDARD', 'BOOST'
    upgrades: [
      {
        level: 1,
        title: 'Basic Regenerative ECLSS',
        desc: 'Recovers 4 O2/day from cabin air. Requires 4 energy/day.',
        cost: 0,
        o2Recovery: 4,
        energyLoad: 4
      },
      {
        level: 2,
        title: 'Catalytic Sabatier Loop',
        desc: 'Converts exhaled CO2 + H2 into methane and water. Recovers 7 O2/day. Consumes 5 energy/day.',
        cost: 30,
        o2Recovery: 7,
        energyLoad: 5
      },
      {
        level: 3,
        title: 'Solid Oxide Electrolysis (MOXIE-L)',
        desc: 'High-temperature regolith & carbon recycling. Recovers 9.5 O2/day (full closed-loop). Consumes 6 energy/day.',
        cost: 50,
        o2Recovery: 9.5,
        energyLoad: 6
      }
    ]
  },

  waterRecovery: {
    id: 'waterRecovery',
    name: 'Water Recovery System',
    category: 'LIFE_SUPPORT',
    icon: 'droplet',
    description: 'Multi-barrier filtration, vapor compression distillation, and urine processing to recycle habitat moisture and wastewater.',
    level: 1,
    maxLevel: 3,
    health: 100,
    mode: 'STANDARD', // 'ECO', 'STANDARD', 'BOOST'
    upgrades: [
      {
        level: 1,
        title: 'Vapor Compression Distiller',
        desc: 'Recovers 7 units of water/day from humidity and gray water. Consumes 5 energy/day.',
        cost: 0,
        waterRecovery: 7,
        energyLoad: 5
      },
      {
        level: 2,
        title: 'Multi-Stage Reverse Osmosis',
        desc: 'Adds high-pressure membrane filters. Recovers 11 units/day. Consumes 6 energy/day.',
        cost: 25,
        waterRecovery: 11,
        energyLoad: 6
      },
      {
        level: 3,
        title: 'Advanced Catalytic Purifier',
        desc: 'Near 98% closed loop recovery. Recovers 14 units/day. Consumes 7 energy/day.',
        cost: 45,
        waterRecovery: 14,
        energyLoad: 7
      }
    ]
  },

  solarArray: {
    id: 'solarArray',
    name: 'Polar Solar Array',
    category: 'ENERGY',
    icon: 'sun',
    description: 'High-efficiency photovoltaic towers positioned on South Pole crater rims to capture low-angle continuous sunlight.',
    level: 1,
    maxLevel: 3,
    health: 100,
    dustAccumulation: 0, // 0 - 100% dust
    mode: 'TRACKING', // 'TRACKING', 'STORM_DEFENSE'
    upgrades: [
      {
        level: 1,
        title: 'Fixed Photovoltaic Tower',
        desc: 'Generates up to 30 energy/day in full illumination. Vulnerable to lunar regolith dust.',
        cost: 0,
        generation: 30
      },
      {
        level: 2,
        title: 'Dual-Axis Heliostat Gimbal',
        desc: 'Tracks low-horizon polar sun. Generates up to 46 energy/day.',
        cost: 30,
        generation: 46
      },
      {
        level: 3,
        title: 'Perovskite Grid + Electrostatic Wiper',
        desc: 'High-flux perovskite tandem cells with active dust repulsion. Generates up to 64 energy/day.',
        cost: 50,
        generation: 64
      }
    ]
  },

  batterySystem: {
    id: 'batterySystem',
    name: 'Auxiliary Battery Bank',
    category: 'ENERGY',
    icon: 'battery-charging',
    description: 'Cryo-insulated energy storage to keep critical life support and heaters running during shadow phases or peak load.',
    level: 1,
    maxLevel: 3,
    health: 100,
    mode: 'BALANCED', // 'BALANCED', 'RESERVE_LOCK'
    upgrades: [
      {
        level: 1,
        title: 'Lithium-Iron Phosphate Bank',
        desc: 'Max energy storage: 120 units.',
        cost: 0,
        capacity: 120
      },
      {
        level: 2,
        title: 'Solid-State Lithium Matrix',
        desc: 'Improves charge density. Max energy storage: 180 units.',
        cost: 25,
        capacity: 180
      },
      {
        level: 3,
        title: 'Regenerative H2-O2 Fuel Cell Array',
        desc: 'Massive energy reserve with zero discharge loss. Max storage: 260 units.',
        cost: 45,
        capacity: 260
      }
    ]
  },

  greenhouse: {
    id: 'greenhouse',
    name: 'Lunar Hydroponic Bay',
    category: 'AGRICULTURE',
    icon: 'sprout',
    description: 'Controlled environment agriculture cultivating fast-growing microgreens, dwarf wheat, and potatoes under tuned LED spectra.',
    level: 1,
    maxLevel: 3,
    health: 100,
    mode: 'GROWTH', // 'GROWTH', 'WATER_SAVER', 'HARVEST_BURST'
    upgrades: [
      {
        level: 1,
        title: 'Hydroponic Rack Unit',
        desc: 'Produces 2 food/day. Consumes 4 water/day and 6 energy/day.',
        cost: 0,
        foodProduction: 2.0,
        waterConsumption: 4,
        energyLoad: 6
      },
      {
        level: 2,
        title: 'Aeroponic Vertical Carousel',
        desc: 'Nutrient-mist roots reduce water use per kg. Produces 3.8 food/day. Consumes 4.5 water/day and 7 energy/day.',
        cost: 30,
        foodProduction: 3.8,
        waterConsumption: 4.5,
        energyLoad: 7
      },
      {
        level: 3,
        title: 'Automated Photobioreactor',
        desc: 'Closed-loop spirulina and automated harvest. Produces 5.5 food/day (food surplus). Consumes 5 water/day and 8 energy/day.',
        cost: 50,
        foodProduction: 5.5,
        waterConsumption: 5,
        energyLoad: 8
      }
    ]
  },

  radiationShelter: {
    id: 'radiationShelter',
    name: 'Regolith Storm Shelter',
    category: 'DEFENSE',
    icon: 'shield',
    description: 'Sub-surface bunker covered in 3 meters of compacted lunar regolith and hydrogenated polyethylene to shield astronauts from GCR and solar storms.',
    level: 1,
    maxLevel: 3,
    health: 100,
    mode: 'NORMAL', // 'NORMAL', 'LOCKDOWN'
    upgrades: [
      {
        level: 1,
        title: 'Excavated Regolith Berm',
        desc: 'Absorbs 45% of background cosmic radiation. Consumes 2 energy/day for environmental control.',
        cost: 0,
        radProtection: 0.45,
        energyLoad: 2
      },
      {
        level: 2,
        title: 'Sintered Regolith Vault',
        desc: 'Microwave-sintered regolith brick vault. Absorbs 72% of radiation. Consumes 2.5 energy/day.',
        cost: 30,
        radProtection: 0.72,
        energyLoad: 2.5
      },
      {
        level: 3,
        title: 'Active Magnetic Deflector + Deep Cavern',
        desc: 'Superconducting coil deflector combined with deep lava tube access. Absorbs 90% of radiation. Consumes 3.5 energy/day.',
        cost: 50,
        radProtection: 0.90,
        energyLoad: 3.5
      }
    ]
  },

  repairStation: {
    id: 'repairStation',
    name: 'Habitat Repair Bay',
    category: 'MAINTENANCE',
    icon: 'tool',
    description: 'Robotic sealant crawlers and 3D printing equipment to reinforce the habitat pressure hull and seal micrometeorite penetrations.',
    level: 1,
    maxLevel: 3,
    health: 100,
    mode: 'STANDBY', // 'STANDBY', 'AUTO_REPAIR'
    upgrades: [
      {
        level: 1,
        title: 'Manual Patch & Seal Bay',
        desc: 'Repair action restores +15% integrity for 10 materials. Base integrity wear: -1.2%/day.',
        cost: 0,
        repairEfficiency: 15,
        repairMaterialCost: 10,
        wearMitigation: 0
      },
      {
        level: 2,
        title: 'Robotic Hull Crawlers',
        desc: 'Repair action restores +20% integrity for 8 materials. Reduces daily hull wear by 40%.',
        cost: 25,
        repairEfficiency: 20,
        repairMaterialCost: 8,
        wearMitigation: 0.4
      },
      {
        level: 3,
        title: 'Self-Healing Regolith Printer',
        desc: 'Repair action restores +28% integrity for 6 materials. Reduces daily hull wear by 75%.',
        cost: 45,
        repairEfficiency: 28,
        repairMaterialCost: 6,
        wearMitigation: 0.75
      }
    ]
  }
};

export class InfrastructureManager {
  constructor(savedFacilities = null) {
    this.facilities = savedFacilities 
      ? JSON.parse(JSON.stringify(savedFacilities))
      : JSON.parse(JSON.stringify(FACILITIES));
  }

  /**
   * Get specific facility by ID
   */
  getFacility(id) {
    return this.facilities[id];
  }

  /**
   * Get current upgrade tier object for a facility
   */
  getCurrentTier(id) {
    const fac = this.facilities[id];
    if (!fac) return null;
    return fac.upgrades[fac.level - 1];
  }

  /**
   * Get next upgrade tier object (if available)
   */
  getNextTier(id) {
    const fac = this.facilities[id];
    if (!fac || fac.level >= fac.maxLevel) return null;
    return fac.upgrades[fac.level];
  }

  /**
   * Check if facility can be upgraded
   * @param {string} id 
   * @param {number} availableMaterials 
   * @returns {{canUpgrade: boolean, reason?: string, cost: number}}
   */
  canUpgrade(id, availableMaterials) {
    const fac = this.facilities[id];
    if (!fac) return { canUpgrade: false, reason: 'Unknown facility' };
    if (fac.level >= fac.maxLevel) return { canUpgrade: false, reason: 'Already at maximum level' };
    const nextTier = fac.upgrades[fac.level];
    if (availableMaterials < nextTier.cost) {
      return { 
        canUpgrade: false, 
        reason: `Insufficient materials (Requires ${nextTier.cost}, you have ${Math.floor(availableMaterials)})`,
        cost: nextTier.cost
      };
    }
    return { canUpgrade: true, cost: nextTier.cost };
  }

  /**
   * Perform upgrade
   */
  upgrade(id, resourceManager) {
    const check = this.canUpgrade(id, resourceManager.materials.current);
    if (!check.canUpgrade) return false;

    const fac = this.facilities[id];
    const nextTier = fac.upgrades[fac.level];

    // Spend materials
    resourceManager.spendMaterials(nextTier.cost);
    fac.level += 1;

    // Apply immediate capacity bonuses if applicable
    if (id === 'batterySystem') {
      resourceManager.expandCapacity('energy', nextTier.capacity - fac.upgrades[fac.level - 2].capacity);
    } else if (id === 'lifeSupport') {
      resourceManager.expandCapacity('oxygen', 20);
    } else if (id === 'waterRecovery') {
      resourceManager.expandCapacity('water', 20);
    } else if (id === 'greenhouse') {
      resourceManager.expandCapacity('food', 20);
    }

    return true;
  }

  /**
   * Set operating mode of facility
   */
  setMode(id, newMode) {
    const fac = this.facilities[id];
    if (fac) {
      fac.mode = newMode;
      return true;
    }
    return false;
  }

  /**
   * Clean dust from solar panels
   */
  cleanSolarArray(resourceManager) {
    const fac = this.facilities.solarArray;
    if (fac.dustAccumulation <= 5) return { success: false, reason: 'Solar array is already clean.' };
    const cost = 4;
    if (resourceManager.materials.current < cost) {
      return { success: false, reason: `Requires ${cost} materials for EVA wiper seals.` };
    }
    resourceManager.spendMaterials(cost);
    fac.dustAccumulation = 0;
    return { success: true };
  }

  /**
   * Perform structural repair on habitat
   */
  performRepair(resourceManager, crewManager) {
    if (resourceManager.habitatIntegrity >= 100) {
      return { success: false, reason: 'Hull integrity is already at 100%.' };
    }
    const fac = this.facilities.repairStation;
    const tier = this.getCurrentTier('repairStation');
    let cost = tier.repairMaterialCost;

    // Sarah Kowalski's Field Machinist perk: 20% discount on repairs
    if (crewManager && crewManager.isPerkActive('sarah')) {
      cost = Math.max(2, Math.round(cost * 0.8));
    }

    if (resourceManager.materials.current < cost) {
      return { success: false, reason: `Requires ${cost} Construction Materials (You have ${Math.floor(resourceManager.materials.current)})` };
    }

    resourceManager.spendMaterials(cost);
    const restored = tier.repairEfficiency;
    resourceManager.habitatIntegrity = Math.min(100, Math.round(resourceManager.habitatIntegrity + restored));
    return { success: true, restored, cost };
  }

  /**
   * Export state
   */
  getState() {
    return JSON.parse(JSON.stringify(this.facilities));
  }

  /**
   * Load state
   */
  loadState(savedFacilities) {
    this.facilities = JSON.parse(JSON.stringify(savedFacilities));
  }
}
