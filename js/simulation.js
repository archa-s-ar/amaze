/**
 * AMAZE — Space Mission Engineering Simulator
 * simulation.js — Central simulation engine, deterministic daily calculations, and failure buffer
 */

import { ResourceManager } from './resources.js';
import { InfrastructureManager } from './infrastructure.js';
import { CrewManager } from './crew.js';
import { EventManager } from './events.js';

export const MISSION_MAX_DAYS = 30;

export class SimulationEngine {
  constructor(difficulty = 'NORMAL', savedState = null) {
    this.difficulty = difficulty;

    if (savedState) {
      this.day = savedState.day;
      this.isComplete = savedState.isComplete || false;
      this.isFailed = savedState.isFailed || false;
      this.failureReason = savedState.failureReason || null;
      this.activeModifiers = savedState.activeModifiers || {};
      this.starvationCounters = savedState.starvationCounters || {
        oxygen: 0,
        water: 0,
        food: 0,
        power: 0
      };
      this.logs = savedState.logs || [];

      this.resources = new ResourceManager(difficulty, savedState.resources);
      this.infrastructure = new InfrastructureManager(savedState.infrastructure);
      this.crewManager = new CrewManager(savedState.crew);
      this.eventManager = new EventManager(savedState.events);
    } else {
      this.day = 1;
      this.isComplete = false;
      this.isFailed = false;
      this.failureReason = null;
      this.activeModifiers = {};
      this.starvationCounters = {
        oxygen: 0,
        water: 0,
        food: 0,
        power: 0
      };
      this.logs = [
        'MISSION INITIALIZATION: Outpost Alpha telemetry link established with Houston Mission Operations.',
        'COMMAND: All 4 crew members reporting nominal biometric telemetry. Welcome to the Moon, Commander.'
      ];

      this.resources = new ResourceManager(difficulty);
      this.infrastructure = new InfrastructureManager();
      this.crewManager = new CrewManager();
      this.eventManager = new EventManager();

      // Record Day 1 starting snapshot
      this.resources.recordSnapshot(1, this.crewManager.getAverageHealth());
    }

    // Run initial projection calculations
    this.recalculateDailyProjections();
  }

  /**
   * Log an event message with mission timestamp
   */
  addLog(msg) {
    const timestamp = `SOL ${this.day.toString().padStart(2, '0')}`;
    this.logs.unshift(`[${timestamp}] ${msg}`);
    if (this.logs.length > 80) this.logs.pop();
  }

  /**
   * Calculate real-time projections for UI display
   * Shows expected generation, consumption, net balance, and days remaining
   */
  recalculateDailyProjections() {
    const activeCrew = Math.max(1, this.crewManager.getActiveCrewCount());
    const consMult = this.resources.consumptionMultiplier;
    const prodMult = this.resources.productionMultiplier;

    // 1. OXYGEN
    const baseO2Burn = activeCrew * 2.0 * consMult;
    const eclssTier = this.infrastructure.getCurrentTier('lifeSupport');
    const eclssFac = this.infrastructure.getFacility('lifeSupport');
    let o2ModeMult = 1.0;
    if (eclssFac.mode === 'ECO') o2ModeMult = 0.6;
    if (eclssFac.mode === 'BOOST') o2ModeMult = 1.35;

    // Is there enough power for ECLSS?
    const hasPower = this.resources.energy.current > 2;
    const o2Recovery = hasPower ? (eclssTier.o2Recovery * prodMult * o2ModeMult) : 0.8;
    const netO2 = Math.round((o2Recovery - baseO2Burn) * 10) / 10;

    this.resources.oxygen.dailyConsumption = Math.round(baseO2Burn * 10) / 10;
    this.resources.oxygen.dailyProduction = Math.round(o2Recovery * 10) / 10;
    this.resources.oxygen.netRate = netO2;
    const o2DaysLeft = this.resources.projectDaysRemaining(this.resources.oxygen.current, netO2);
    this.resources.oxygen.daysLeft = o2DaysLeft;
    this.resources.oxygen.status = this.resources.evaluateStatus(this.resources.oxygen.current, this.resources.oxygen.max, o2DaysLeft);

    // 2. WATER
    const crewWaterBurn = activeCrew * 2.5 * consMult;
    const greenTier = this.infrastructure.getCurrentTier('greenhouse');
    const greenFac = this.infrastructure.getFacility('greenhouse');
    let greenWaterMult = 1.0;
    if (greenFac.mode === 'WATER_SAVER') greenWaterMult = 0.55;
    if (greenFac.mode === 'HARVEST_BURST') greenWaterMult = 1.6;
    const greenhouseWaterBurn = this.activeModifiers.greenhouseDormant ? 0 : (greenTier.waterConsumption * greenWaterMult);
    const totalWaterBurn = Math.round((crewWaterBurn + greenhouseWaterBurn) * 10) / 10;

    const waterTier = this.infrastructure.getCurrentTier('waterRecovery');
    const waterFac = this.infrastructure.getFacility('waterRecovery');
    let waterModeMult = 1.0;
    if (waterFac.mode === 'ECO') waterModeMult = 0.65;
    if (waterFac.mode === 'BOOST') waterModeMult = 1.25;

    // Marcus perk: +15% water recovery
    const marcusBonus = this.crewManager.isPerkActive('marcus') ? 1.15 : 1.0;
    const waterPenalty = this.activeModifiers.waterRecoveryPenalty ? 0.65 : 1.0;
    const waterRecovery = hasPower ? (waterTier.waterRecovery * prodMult * waterModeMult * marcusBonus * waterPenalty) : 1.5;
    const netWater = Math.round((waterRecovery - totalWaterBurn) * 10) / 10;

    this.resources.water.dailyConsumption = totalWaterBurn;
    this.resources.water.dailyProduction = Math.round(waterRecovery * 10) / 10;
    this.resources.water.netRate = netWater;
    const waterDaysLeft = this.resources.projectDaysRemaining(this.resources.water.current, netWater);
    this.resources.water.daysLeft = waterDaysLeft;
    this.resources.water.status = this.resources.evaluateStatus(this.resources.water.current, this.resources.water.max, waterDaysLeft);

    // 3. FOOD
    const crewFoodBurn = activeCrew * 1.0 * consMult;
    let greenFoodMult = 1.0;
    if (greenFac.mode === 'WATER_SAVER') greenFoodMult = 0.6;
    if (greenFac.mode === 'HARVEST_BURST') greenFoodMult = 1.5;

    // Alex perk: +20% greenhouse food
    const alexBonus = this.crewManager.isPerkActive('alex') ? 1.2 : 1.0;
    const foodProduced = (hasPower && !this.activeModifiers.greenhouseDormant)
      ? (greenTier.foodProduction * prodMult * greenFoodMult * alexBonus)
      : 0;
    const netFood = Math.round((foodProduced - crewFoodBurn) * 10) / 10;

    this.resources.food.dailyConsumption = Math.round(crewFoodBurn * 10) / 10;
    this.resources.food.dailyProduction = Math.round(foodProduced * 10) / 10;
    this.resources.food.netRate = netFood;
    const foodDaysLeft = this.resources.projectDaysRemaining(this.resources.food.current, netFood);
    this.resources.food.daysLeft = foodDaysLeft;
    this.resources.food.status = this.resources.evaluateStatus(this.resources.food.current, this.resources.food.max, foodDaysLeft);

    // 4. ENERGY
    const solarTier = this.infrastructure.getCurrentTier('solarArray');
    const solarFac = this.infrastructure.getFacility('solarArray');
    const dustLoss = solarFac.dustAccumulation / 100;
    // South pole orbital light angle (90% to 100% nominal illumination)
    const solarLighting = 0.95;
    const generatedEnergy = Math.max(0, solarTier.generation * prodMult * (1 - dustLoss) * solarLighting);

    // Energy loads
    const baseHabLoad = 8.0;
    let eclssEnergy = eclssTier.energyLoad * (eclssFac.mode === 'ECO' ? 0.5 : eclssFac.mode === 'BOOST' ? 1.6 : 1.0);
    if (this.crewManager.isPerkActive('marcus')) eclssEnergy *= 0.9;

    let waterEnergy = waterTier.energyLoad * (waterFac.mode === 'ECO' ? 0.6 : waterFac.mode === 'BOOST' ? 1.5 : 1.0);
    let greenEnergy = this.activeModifiers.greenhouseDormant ? 1.0 : (greenTier.energyLoad * (greenFac.mode === 'WATER_SAVER' ? 0.75 : greenFac.mode === 'HARVEST_BURST' ? 1.6 : 1.0));
    const shelterTier = this.infrastructure.getCurrentTier('radiationShelter');
    const shelterEnergy = shelterTier.energyLoad;

    const totalEnergyLoad = Math.round((baseHabLoad + eclssEnergy + waterEnergy + greenEnergy + shelterEnergy) * 10) / 10;
    const netEnergy = Math.round((generatedEnergy - totalEnergyLoad) * 10) / 10;

    this.resources.energy.dailyGeneration = Math.round(generatedEnergy * 10) / 10;
    this.resources.energy.dailyLoad = totalEnergyLoad;
    this.resources.energy.netRate = netEnergy;
    const energyDaysLeft = netEnergy < 0 ? this.resources.projectDaysRemaining(this.resources.energy.current, netEnergy) : 999;
    this.resources.energy.daysLeft = energyDaysLeft;
    this.resources.energy.status = this.resources.evaluateStatus(this.resources.energy.current, this.resources.energy.max, energyDaysLeft);
  }

  /**
   * Advance to the next mission day
   * Executes deterministic physical simulations, updates crew physiology, checks failures.
   * @returns {{success: boolean, dayAdvanced: number, summaryLogs: Array<string>}}
   */
  advanceDay() {
    if (this.isComplete || this.isFailed) {
      return { success: false, reason: 'Mission is already finished.' };
    }

    const summaryLogs = [];
    this.recalculateDailyProjections();

    // 1. UPDATE ENERGY & CHECK BROWNOUT
    const energyDelta = this.resources.energy.netRate;
    let wasBrownout = false;
    this.resources.energy.current = Math.min(this.resources.energy.max, this.resources.energy.current + energyDelta);

    if (this.resources.energy.current <= 0) {
      this.resources.energy.current = 0;
      wasBrownout = true;
      this.starvationCounters.power += 1;
      summaryLogs.push('BROWNOUT: Auxiliary battery banks completely exhausted! Thermal regulators and non-essential systems cut offline.');
      this.addLog('CRITICAL: Outpost Alpha experienced total power blackout.');
    } else {
      this.starvationCounters.power = 0;
    }

    // 2. APPLY OXYGEN DYNAMICS
    let actualO2Production = this.resources.oxygen.dailyProduction;
    if (wasBrownout) {
      actualO2Production = Math.round(actualO2Production * 0.25 * 10) / 10; // Severely crippled
    }
    const o2Net = actualO2Production - this.resources.oxygen.dailyConsumption;
    this.resources.oxygen.current = Math.min(this.resources.oxygen.max, this.resources.oxygen.current + o2Net);

    let oxygenDeficit = 0;
    if (this.resources.oxygen.current <= 0) {
      this.resources.oxygen.current = 0;
      this.starvationCounters.oxygen += 1;
      oxygenDeficit = this.starvationCounters.oxygen;
      summaryLogs.push(`HYPOXIA ALERT: Oxygen tanks empty! Crew breathing residual cabin air (${this.starvationCounters.oxygen} days without O2).`);
    } else {
      this.starvationCounters.oxygen = 0;
    }

    // 3. APPLY WATER DYNAMICS
    let actualWaterRecovery = this.resources.water.dailyProduction;
    if (wasBrownout) {
      actualWaterRecovery = 0;
    }
    const waterNet = actualWaterRecovery - this.resources.water.dailyConsumption;
    this.resources.water.current = Math.min(this.resources.water.max, this.resources.water.current + waterNet);

    let waterDeficit = 0;
    if (this.resources.water.current <= 0) {
      this.resources.water.current = 0;
      this.starvationCounters.water += 1;
      waterDeficit = this.starvationCounters.water;
      summaryLogs.push(`DEHYDRATION ALERT: Potable water exhausted! (${this.starvationCounters.water} days without water).`);
    } else {
      this.starvationCounters.water = 0;
    }

    // 4. APPLY FOOD DYNAMICS
    let actualFoodProduction = this.resources.food.dailyProduction;
    if (wasBrownout) actualFoodProduction = 0;
    const foodNet = actualFoodProduction - this.resources.food.dailyConsumption;
    this.resources.food.current = Math.min(this.resources.food.max, this.resources.food.current + foodNet);

    let foodDeficit = 0;
    if (this.resources.food.current <= 0) {
      this.resources.food.current = 0;
      this.starvationCounters.food += 1;
      foodDeficit = this.starvationCounters.food;
      summaryLogs.push(`RATION WARNING: Food supplies depleted! Crew relying on metabolic reserves (${this.starvationCounters.food} days without rations).`);
    } else {
      this.starvationCounters.food = 0;
    }

    // 5. RADIATION ACCUMULATION
    const shelterTier = this.infrastructure.getCurrentTier('radiationShelter');
    const baseGCR = 2.4; // mSv background
    const netRadiation = Math.round(baseGCR * (1 - shelterTier.radProtection) * 10) / 10;
    this.resources.radiationIndex = Math.round((this.resources.radiationIndex + netRadiation) * 10) / 10;

    // 6. HABITAT INTEGRITY DEGRADATION & MICROLEAKS
    const repairTier = this.infrastructure.getCurrentTier('repairStation');
    const baseWear = 1.0 * (1 - repairTier.wearMitigation);
    this.resources.habitatIntegrity = Math.max(0, Math.round((this.resources.habitatIntegrity - baseWear) * 10) / 10);

    let integrityFailure = false;
    if (this.resources.habitatIntegrity < 40) {
      // Micro-leaks bleed an extra 2 units of oxygen
      this.resources.oxygen.current = Math.max(0, this.resources.oxygen.current - 2);
      summaryLogs.push('INTEGRITY ALERT: Structural pressure micro-leaks detected across bulkhead seams.');
    }
    if (this.resources.habitatIntegrity <= 0) {
      integrityFailure = true;
      summaryLogs.push('CATASTROPHIC FAILURE: Habitat pressure hull integrity collapsed!');
    }

    // 7. SOLAR DUST ACCUMULATION
    const solarFac = this.infrastructure.getFacility('solarArray');
    if (solarFac.level < 3) {
      solarFac.dustAccumulation = Math.min(75, solarFac.dustAccumulation + 3);
    } else {
      solarFac.dustAccumulation = Math.min(25, solarFac.dustAccumulation + 1); // Electrostatic repellent
    }

    // 8. CREW PHYSIOLOGY UPDATE
    const medicalLogs = this.crewManager.applyDailyPhysiology({
      oxygenDeficit,
      waterDeficit,
      foodDeficit,
      radiationExposure: netRadiation,
      tempAnomaly: wasBrownout,
      integrityFailure
    });
    medicalLogs.forEach(ml => summaryLogs.push(ml));

    // 9. CHECK FAILURE CONDITIONS (with scientific buffer tolerance)
    const mayaBuffer = this.crewManager.isPerkActive('maya') ? 1 : 0;
    const avgCrewHealth = this.crewManager.getAverageHealth();

    if (avgCrewHealth <= 0 || this.crewManager.getActiveCrewCount() === 0) {
      this.isFailed = true;
      this.failureReason = {
        title: 'CREW MEDICAL COLLAPSE',
        desc: 'All 4 astronauts have suffered critical physiological collapse. Vital signs lost.',
        contributingFactors: [
          oxygenDeficit > 0 ? `Unmitigated hypoxia (${oxygenDeficit} days)` : null,
          waterDeficit > 0 ? `Severe dehydration (${waterDeficit} days)` : null,
          foodDeficit > 0 ? `Prolonged malnutrition (${foodDeficit} days)` : null,
          this.resources.radiationIndex > 200 ? `Fatal cumulative radiation dose (${this.resources.radiationIndex} mSv)` : null
        ].filter(Boolean),
        tip: 'Ensure ECLSS and Water Recovery upgrades are prioritized early, and maintain reserve batteries to avoid life-support brownouts.'
      };
      this.addLog('MISSION ABORT: Crew vital signs ceased. Mission terminated.');
    } else if (this.starvationCounters.oxygen > (2 + mayaBuffer)) {
      this.isFailed = true;
      this.failureReason = {
        title: 'ATMOSPHERIC ASPHYXIATION',
        desc: 'The habitat completely ran out of breathable oxygen for consecutive days beyond human survival tolerance.',
        contributingFactors: ['Oxygen depleted to zero', 'ECLSS loop unable to keep pace with crew metabolic demand'],
        tip: 'Upgrade ECLSS to Level 2 (Sabatier) before Sol 10, or boost oxygen electrolysis when reserves drop below 30 units.'
      };
      this.addLog('MISSION ABORT: Total atmospheric depletion. Mission failed.');
    } else if (this.starvationCounters.water > (3 + mayaBuffer)) {
      this.isFailed = true;
      this.failureReason = {
        title: 'ACUTE DEHYDRATION CRISIS',
        desc: 'Zero potable water remaining for over 3 days. Renal failure and circulatory collapse occurred.',
        contributingFactors: ['Potable water reserves exhausted', 'Wastewater recovery disabled or lagging'],
        tip: 'Build Multi-Stage Reverse Osmosis in the Water Recovery Bay to recycle up to 11 units/day, and switch Greenhouse to Water Saver mode if water drops.'
      };
      this.addLog('MISSION ABORT: Critical water starvation. Mission failed.');
    } else if (this.resources.habitatIntegrity <= 0) {
      this.isFailed = true;
      this.failureReason = {
        title: 'STRUCTURAL DECOMPRESSION',
        desc: 'Habitat pressure vessel suffered catastrophic hull rupture from un-repaired micrometeorite stress.',
        contributingFactors: ['Hull integrity reached 0%', 'Failure to execute repairs at Habitat Repair Bay'],
        tip: 'Keep at least 15 Construction Materials in reserve to conduct immediate hull patches when integrity drops below 60%.'
      };
      this.addLog('MISSION ABORT: Catastrophic hull failure. Mission failed.');
    }

    // 10. DECREMENT ACTIVE MODIFIERS
    if (this.activeModifiers.greenhouseDormant) {
      this.activeModifiers.greenhouseDormant -= 1;
      if (this.activeModifiers.greenhouseDormant <= 0) delete this.activeModifiers.greenhouseDormant;
    }
    if (this.activeModifiers.waterRecoveryPenalty) {
      this.activeModifiers.waterRecoveryPenalty -= 1;
      if (this.activeModifiers.waterRecoveryPenalty <= 0) delete this.activeModifiers.waterRecoveryPenalty;
    }
    if (this.activeModifiers.shelterLockdown) {
      this.activeModifiers.shelterLockdown -= 1;
      if (this.activeModifiers.shelterLockdown <= 0) delete this.activeModifiers.shelterLockdown;
    }

    // 11. RECORD SNAPSHOT FOR CHARTS
    this.resources.recordSnapshot(this.day, avgCrewHealth);

    // 12. ADVANCE DAY OR COMPLETE MISSION
    if (!this.isFailed) {
      if (this.day >= MISSION_MAX_DAYS) {
        this.isComplete = true;
        this.addLog('MISSION SUCCESS: Sol 30 reached! Outpost Alpha successfully completed its baseline survival mandate!');
        summaryLogs.push('MISSION SUCCESS! Earth Operations commends Outpost Alpha for surviving 30 days on the lunar frontier!');
      } else {
        this.day += 1;
        this.addLog(`STATUS: Sol ${this.day} commenced. Average crew health: ${avgCrewHealth}%.`);
      }
    }

    // Recalculate projections for the new day
    this.recalculateDailyProjections();

    return {
      success: true,
      day: this.day,
      isComplete: this.isComplete,
      isFailed: this.isFailed,
      summaryLogs
    };
  }

  /**
   * Export serializable state
   */
  getState() {
    return {
      difficulty: this.difficulty,
      day: this.day,
      isComplete: this.isComplete,
      isFailed: this.isFailed,
      failureReason: this.failureReason,
      activeModifiers: { ...this.activeModifiers },
      starvationCounters: { ...this.starvationCounters },
      logs: [...this.logs],
      resources: this.resources.getState(),
      infrastructure: this.infrastructure.getState(),
      crew: this.crewManager.getState(),
      events: this.eventManager.getState()
    };
  }
}
