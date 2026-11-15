/**
 * AMAZE — Space Mission Engineering Simulator
 * scoring.js — Mission Evaluation, Commander Ranks, and Performance Metrics
 */

export class ScoringSystem {
  /**
   * Calculate comprehensive mission score and rank
   * @param {Object} sim - SimulationEngine instance
   * @returns {Object} Full evaluation report
   */
  static evaluate(sim) {
    const isSuccess = sim.isComplete && !sim.isFailed;
    const dayReached = sim.day;
    const avgCrewHealth = sim.crewManager.getAverageHealth();
    const activeCrew = sim.crewManager.getActiveCrewCount();

    // 1. Base Survival Points
    let survivalScore = dayReached * 25; // Up to 750 for 30 days
    if (isSuccess) survivalScore += 250; // Bonus for completing all 30 days

    // 2. Crew Health & Welfare
    const crewScore = Math.round((avgCrewHealth / 100) * 300 * (activeCrew / 4));

    // 3. Resource Preservation & Stockpiles
    const res = sim.resources;
    const o2Points = Math.min(100, Math.round((res.oxygen.current / res.oxygen.max) * 100));
    const waterPoints = Math.min(100, Math.round((res.water.current / res.water.max) * 100));
    const foodPoints = Math.min(100, Math.round((res.food.current / res.food.max) * 100));
    const energyPoints = Math.min(80, Math.round((res.energy.current / res.energy.max) * 80));
    const materialsPoints = Math.min(80, Math.round((res.materials.current / res.materials.max) * 80));
    const resourceScore = o2Points + waterPoints + foodPoints + energyPoints + materialsPoints;

    // 4. Habitat Integrity
    const integrityScore = Math.round((res.habitatIntegrity / 100) * 150);

    // 5. Radiation Mitigation (Penalize high radiation)
    // Nominal background over 30 days is ~30-50 mSv. Anything above 100 mSv receives progressive penalty.
    let radiationPenalty = 0;
    if (res.radiationIndex > 50) {
      radiationPenalty = Math.min(200, Math.round((res.radiationIndex - 50) * 1.5));
    }
    const radiationScore = Math.max(0, 150 - radiationPenalty);

    // 6. Infrastructure Tech Advancement
    let infrastructureUpgrades = 0;
    Object.values(sim.infrastructure.facilities).forEach(fac => {
      infrastructureUpgrades += (fac.level - 1);
    });
    const infrastructureScore = infrastructureUpgrades * 40; // up to 14 upgrades * 40 = 560

    // 7. Crisis Handling
    const eventsResolved = sim.eventManager.eventHistory.length;
    const crisisScore = eventsResolved * 35;

    // 8. Difficulty Multiplier
    let diffMult = 1.0;
    if (sim.difficulty === 'EASY') diffMult = 0.85;
    if (sim.difficulty === 'EXPERT') diffMult = 1.3;

    // 9. Science Discovery Bonuses
    const scienceBonus = sim.activeModifiers.scienceBonus || 0;

    const rawTotal = survivalScore + crewScore + resourceScore + integrityScore + radiationScore + infrastructureScore + crisisScore + scienceBonus;
    const finalScore = Math.round(rawTotal * diffMult);

    // Commander Rank Determination
    let rank = 'Cadet Engineer';
    let badge = 'bronze';
    let rankDescription = 'Completed basic spaceflight procedures, but outpost struggled with resource equilibrium.';

    if (finalScore >= 1350) {
      rank = 'Legendary Space Commander';
      badge = 'diamond';
      rankDescription = 'Exemplary mastery of closed-loop life support, flawless crisis triage, and exceptional crew safety under harsh lunar conditions.';
    } else if (finalScore >= 1100) {
      rank = 'Lunar Exploration Specialist';
      badge = 'gold';
      rankDescription = 'Outstanding engineering judgment. Maintained robust life-support margins and advanced outpost infrastructure.';
    } else if (finalScore >= 850) {
      rank = 'Senior Mission Engineer';
      badge = 'silver';
      rankDescription = 'Solid operational leadership. Outpost survived the 30-day mandate with sustainable systems intact.';
    } else if (finalScore >= 600) {
      rank = 'Mission Commander';
      badge = 'bronze';
      rankDescription = 'Navigated the crew through severe hardships to survive the initial lunar mission cycle.';
    }

    return {
      finalScore,
      rank,
      badge,
      rankDescription,
      difficulty: sim.difficulty,
      isSuccess,
      dayReached,
      breakdown: {
        survival: survivalScore,
        crewWelfare: crewScore,
        resources: resourceScore,
        integrity: integrityScore,
        radiationSafety: radiationScore,
        infrastructure: infrastructureScore,
        crisesResolved: crisisScore,
        scienceBonuses: scienceBonus,
        difficultyMultiplier: diffMult
      },
      stats: {
        avgCrewHealth: Math.round(avgCrewHealth),
        activeCrew,
        remainingOxygen: Math.round(res.oxygen.current),
        remainingWater: Math.round(res.water.current),
        remainingFood: Math.round(res.food.current),
        remainingEnergy: Math.round(res.energy.current),
        remainingMaterials: Math.round(res.materials.current),
        radiationIndex: Math.round(res.radiationIndex),
        habitatIntegrity: Math.round(res.habitatIntegrity),
        upgradesCompleted: infrastructureUpgrades,
        eventsResolved
      }
    };
  }
}
