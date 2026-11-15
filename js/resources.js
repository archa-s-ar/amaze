/**
 * AMAZE — Space Mission Engineering Simulator
 * resources.js — Mathematical models, capacities, flow rates, and projections
 */

export const RESOURCE_DEFAULTS = {
  EASY: {
    oxygen: { current: 130, max: 180 },
    water: { current: 150, max: 200 },
    food: { current: 130, max: 180 },
    energy: { current: 130, max: 150 },
    materials: { current: 130, max: 200 },
    consumptionMultiplier: 0.8,
    productionMultiplier: 1.15
  },
  NORMAL: {
    oxygen: { current: 100, max: 150 },
    water: { current: 120, max: 180 },
    food: { current: 100, max: 160 },
    energy: { current: 100, max: 120 },
    materials: { current: 100, max: 160 },
    consumptionMultiplier: 1.0,
    productionMultiplier: 1.0
  },
  EXPERT: {
    oxygen: { current: 80, max: 140 },
    water: { current: 90, max: 160 },
    food: { current: 80, max: 140 },
    energy: { current: 80, max: 100 },
    materials: { current: 75, max: 140 },
    consumptionMultiplier: 1.2,
    productionMultiplier: 0.9
  }
};

export class ResourceManager {
  constructor(difficulty = 'NORMAL', savedData = null) {
    this.difficulty = difficulty;
    const defaults = RESOURCE_DEFAULTS[difficulty] || RESOURCE_DEFAULTS.NORMAL;

    if (savedData) {
      this.oxygen = { ...savedData.oxygen };
      this.water = { ...savedData.water };
      this.food = { ...savedData.food };
      this.energy = { ...savedData.energy };
      this.materials = { ...savedData.materials };
      this.radiationIndex = savedData.radiationIndex ?? 0;
      this.habitatIntegrity = savedData.habitatIntegrity ?? 100;
      this.consumptionMultiplier = savedData.consumptionMultiplier ?? defaults.consumptionMultiplier;
      this.productionMultiplier = savedData.productionMultiplier ?? defaults.productionMultiplier;
      this.history = savedData.history || [];
    } else {
      this.oxygen = {
        current: defaults.oxygen.current,
        max: defaults.oxygen.max,
        dailyConsumption: 0,
        dailyProduction: 0,
        netRate: 0,
        status: 'STABLE'
      };
      this.water = {
        current: defaults.water.current,
        max: defaults.water.max,
        dailyConsumption: 0,
        dailyProduction: 0,
        netRate: 0,
        status: 'STABLE'
      };
      this.food = {
        current: defaults.food.current,
        max: defaults.food.max,
        dailyConsumption: 0,
        dailyProduction: 0,
        netRate: 0,
        status: 'STABLE'
      };
      this.energy = {
        current: defaults.energy.current,
        max: defaults.energy.max,
        dailyGeneration: 0,
        dailyLoad: 0,
        netRate: 0,
        status: 'STABLE'
      };
      this.materials = {
        current: defaults.materials.current,
        max: defaults.materials.max,
        dailyConsumption: 0,
        dailyProduction: 0,
        status: 'STABLE'
      };
      this.radiationIndex = 0;       // Cumulative mSv
      this.habitatIntegrity = 100;   // 0 - 100%
      this.consumptionMultiplier = defaults.consumptionMultiplier;
      this.productionMultiplier = defaults.productionMultiplier;
      this.history = [];
    }
  }

  /**
   * Determine health status tag for a resource
   * @param {number} current 
   * @param {number} max 
   * @param {number} daysLeft 
   */
  evaluateStatus(current, max, daysLeft) {
    if (current <= 0 || (daysLeft !== null && daysLeft <= 2)) return 'CRITICAL';
    if (current < max * 0.25 || (daysLeft !== null && daysLeft <= 5)) return 'WARNING';
    return 'STABLE';
  }

  /**
   * Calculate how many days a resource will last at current net burn
   */
  projectDaysRemaining(current, netRate) {
    if (netRate >= 0) return 999; // Sustainable or growing
    if (current <= 0) return 0;
    const days = Math.floor(current / Math.abs(netRate));
    return Math.max(0, days);
  }

  /**
   * Record telemetry snapshot for historical charts
   * @param {number} day 
   * @param {number} crewHealth 
   */
  recordSnapshot(day, crewHealth) {
    this.history.push({
      day,
      oxygen: Math.round(this.oxygen.current),
      water: Math.round(this.water.current),
      food: Math.round(this.food.current),
      energy: Math.round(this.energy.current),
      materials: Math.round(this.materials.current),
      crewHealth: Math.round(crewHealth),
      integrity: Math.round(this.habitatIntegrity),
      radiation: Math.round(this.radiationIndex)
    });
  }

  /**
   * Adjust storage capacity when infrastructure upgrades expand tanks
   */
  expandCapacity(resourceKey, additionalMax) {
    if (this[resourceKey]) {
      this[resourceKey].max += additionalMax;
      this[resourceKey].current = Math.min(this[resourceKey].current, this[resourceKey].max);
    }
  }

  /**
   * Spend materials safely
   * @param {number} amount 
   * @returns {boolean} True if affordable and deducted
   */
  spendMaterials(amount) {
    if (this.materials.current >= amount) {
      this.materials.current = Math.round((this.materials.current - amount) * 10) / 10;
      return true;
    }
    return false;
  }

  /**
   * Export state for storage
   */
  getState() {
    return {
      oxygen: { ...this.oxygen },
      water: { ...this.water },
      food: { ...this.food },
      energy: { ...this.energy },
      materials: { ...this.materials },
      radiationIndex: this.radiationIndex,
      habitatIntegrity: this.habitatIntegrity,
      consumptionMultiplier: this.consumptionMultiplier,
      productionMultiplier: this.productionMultiplier,
      history: this.history
    };
  }
}
