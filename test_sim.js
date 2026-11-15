/**
 * AMAZE — Automated Test Suite
 * Validates simulation math, event resolution, failure buffers, and state serialization
 */

import { SimulationEngine } from './js/simulation.js';
import { ScoringSystem } from './js/scoring.js';
import { MISSION_EVENTS } from './js/events.js';

function runTests() {
  console.log('=== RUNNING AMAZE SIMULATION TESTS ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${message}`);
      failed++;
    }
  }

  // TEST 1: Initialization across difficulties
  const simEasy = new SimulationEngine('EASY');
  const simNorm = new SimulationEngine('NORMAL');
  const simExp = new SimulationEngine('EXPERT');

  assert(simEasy.resources.oxygen.current === 130, 'Easy mode starts with 130 Oxygen');
  assert(simNorm.resources.oxygen.current === 100, 'Normal mode starts with 100 Oxygen');
  assert(simExp.resources.oxygen.current === 80, 'Expert mode starts with 80 Oxygen');
  assert(simNorm.crewManager.crew.length === 4, 'Crew starts with 4 astronauts');
  assert(simNorm.crewManager.getAverageHealth() === 100, 'Crew starts at 100% health');

  // TEST 2: Daily calculations and projections
  simNorm.recalculateDailyProjections();
  assert(simNorm.resources.oxygen.dailyConsumption === 8, '4 crew consume 8.0 units O2/day');
  assert(simNorm.resources.water.dailyConsumption === 14, 'Crew + greenhouse consume 14.0 units H2O/day');

  // TEST 3: Facility Upgrades
  const initialMaterials = simNorm.resources.materials.current;
  const upgradeCheck = simNorm.infrastructure.canUpgrade('lifeSupport', initialMaterials);
  assert(upgradeCheck.canUpgrade === true, 'Can afford Life Support Level 2 upgrade');

  const upgradeSuccess = simNorm.infrastructure.upgrade('lifeSupport', simNorm.resources);
  assert(upgradeSuccess === true, 'Life Support successfully upgraded');
  assert(simNorm.infrastructure.getFacility('lifeSupport').level === 2, 'Life Support is now Level 2');
  assert(simNorm.resources.materials.current === initialMaterials - 30, '30 materials deducted for upgrade');

  // Verify increased O2 recovery
  simNorm.recalculateDailyProjections();
  assert(simNorm.resources.oxygen.dailyProduction === 7, 'Level 2 Sabatier recovers 7.0 units O2/day');

  // TEST 4: Solar Dust & Maintenance
  simNorm.infrastructure.facilities.solarArray.dustAccumulation = 40;
  const cleanResult = simNorm.infrastructure.cleanSolarArray(simNorm.resources);
  assert(cleanResult.success === true, 'Solar array dust cleaning succeeded');
  assert(simNorm.infrastructure.facilities.solarArray.dustAccumulation === 0, 'Dust reset to 0% after cleaning');

  // TEST 5: Habitat Repair
  simNorm.resources.habitatIntegrity = 60;
  const repairResult = simNorm.infrastructure.performRepair(simNorm.resources, simNorm.crewManager);
  assert(repairResult.success === true, 'Habitat hull repair succeeded');
  assert(simNorm.resources.habitatIntegrity > 60, 'Habitat integrity restored');

  // TEST 6: Event Decision Handling
  const event = MISSION_EVENTS.find(e => e.id === 'solar_storm_warning');
  assert(event !== undefined, 'Solar storm event exists');
  assert(event.choices.length === 3, 'Solar storm event has 3 choices');

  // Apply shelter lockdown choice
  simNorm.eventManager.activeEvent = event;
  const choiceRes = simNorm.eventManager.resolveActiveEvent('storm_shelter_lockdown', simNorm);
  assert(choiceRes !== null, 'Event successfully resolved with shelter lockdown');
  assert(simNorm.activeModifiers.shelterLockdown === 1, 'Shelter lockdown modifier active');

  // TEST 7: 30-Day Guided Playthrough Simulation (Thoughtful Commander Strategy)
  console.log('\n--- Simulating 30-Day Campaign ---');
  const simPlay = new SimulationEngine('NORMAL');
  let survived = true;

  for (let s = 1; s <= 30; s++) {
    // Strategy: upgrade Life Support on Sol 2 to prevent hypoxia, then Water Recovery on Sol 4
    if (s === 2 && simPlay.infrastructure.canUpgrade('lifeSupport', simPlay.resources.materials.current).canUpgrade) {
      simPlay.infrastructure.upgrade('lifeSupport', simPlay.resources);
    }
    if (s === 4 && simPlay.infrastructure.canUpgrade('waterRecovery', simPlay.resources.materials.current).canUpgrade) {
      simPlay.infrastructure.upgrade('waterRecovery', simPlay.resources);
    }
    if (s === 6 && simPlay.infrastructure.canUpgrade('solarArray', simPlay.resources.materials.current).canUpgrade) {
      simPlay.infrastructure.upgrade('solarArray', simPlay.resources);
    }
    if (s === 12 && simPlay.infrastructure.canUpgrade('greenhouse', simPlay.resources.materials.current).canUpgrade) {
      simPlay.infrastructure.upgrade('greenhouse', simPlay.resources);
    }

    // Clean dust if over 25%
    if (simPlay.infrastructure.facilities.solarArray.dustAccumulation > 25 && simPlay.resources.materials.current >= 4) {
      simPlay.infrastructure.cleanSolarArray(simPlay.resources);
    }

    // Repair hull if below 80%
    if (simPlay.resources.habitatIntegrity < 80 && simPlay.resources.materials.current >= 10) {
      simPlay.infrastructure.performRepair(simPlay.resources, simPlay.crewManager);
    }

    // Check dynamic event
    const dayEvent = simPlay.eventManager.evaluateEventTrigger(simPlay);
    if (dayEvent) {
      // Pick first tactical option
      simPlay.eventManager.resolveActiveEvent(dayEvent.choices[0].id, simPlay);
    }

    // Advance day
    const tick = simPlay.advanceDay();
    if (tick.isFailed) {
      survived = false;
      console.log(`Failed on Sol ${s}: ${simPlay.failureReason.title}`);
      break;
    }
  }

  assert(survived === true, 'Outpost Alpha survived all 30 days under thoughtful engineering command');
  assert(simPlay.isComplete === true, 'Mission successfully marked complete');

  // TEST 8: Evaluation & Scoring
  const evalReport = ScoringSystem.evaluate(simPlay);
  assert(evalReport.finalScore > 600, `Evaluation score is ${evalReport.finalScore} (valid score)`);
  assert(evalReport.rank !== 'Cadet Engineer', `Earned rank: ${evalReport.rank}`);

  // TEST 9: State Serialization & Deserialization
  const serialized = simPlay.getState();
  const restoredSim = new SimulationEngine('NORMAL', serialized);
  assert(restoredSim.day === simPlay.day, 'Restored simulation matches day');
  assert(restoredSim.resources.oxygen.current === simPlay.resources.oxygen.current, 'Restored oxygen matches');
  assert(restoredSim.crewManager.crew[0].name === 'Maya Lin', 'Restored crew matches');

  console.log(`\n=== TEST RESULTS: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) process.exit(1);
}

runTests();
