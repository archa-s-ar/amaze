/**
 * AMAZE — Space Mission Engineering Simulator
 * crew.js — Four-astronaut crew management and physiological modeling
 */

export const INITIAL_CREW = [
  {
    id: 'maya',
    name: 'Maya Lin',
    callsign: 'Apex-1',
    role: 'Mission Commander',
    specialty: 'Systems Engineering & Flight Operations',
    bio: 'Former aerospace test pilot with a doctorate in autonomous flight dynamics. Experienced in high-stress orbital rendezvous.',
    health: 100,
    radiationDose: 0,
    status: 'OPTIMAL',
    perk: 'Commander Presence: Outpost stress tolerance +15%; critical buffer extended by 1 day during shortages.'
  },
  {
    id: 'alex',
    name: 'Dr. Alex Chen',
    callsign: 'Apex-2',
    role: 'Astrobiologist',
    specialty: 'Controlled Environment Agriculture & Microbiology',
    bio: 'Lead researcher in extremophile botany. Designed the closed-loop nutrient solution used in Outpost Alpha\'s hydroponic bay.',
    health: 100,
    radiationDose: 0,
    status: 'OPTIMAL',
    perk: 'Green Thumb: Hydroponic food production +20% when health is above 75%.'
  },
  {
    id: 'sarah',
    name: 'Sarah Kowalski',
    callsign: 'Apex-3',
    role: 'EVA Specialist',
    specialty: 'Structural Integrity & Regolith Engineering',
    bio: 'Veteran spacewalker and mechanical architect. Mastered tele-robotic maintenance during orbital assembly missions.',
    health: 100,
    radiationDose: 0,
    status: 'OPTIMAL',
    perk: 'Field Machinist: Habitat repair operations consume 20% fewer Construction Materials when healthy.'
  },
  {
    id: 'marcus',
    name: 'Marcus Vance',
    callsign: 'Apex-4',
    role: 'ECLSS Specialist',
    specialty: 'Atmospheric Physics & Life-Support Loops',
    bio: 'Specialist in catalytic Sabatier reactors and electrochemical urine distillation. Obsessive about every cubic milliliter of recovered water.',
    health: 100,
    radiationDose: 0,
    status: 'OPTIMAL',
    perk: 'Resource Scavenger: Water Recovery System efficiency +15% and ECLSS power draw -10% when health > 75%.'
  }
];

export class CrewManager {
  constructor(initialCrew = null) {
    this.crew = initialCrew ? JSON.parse(JSON.stringify(initialCrew)) : JSON.parse(JSON.stringify(INITIAL_CREW));
  }

  /**
   * Calculate average crew health
   * @returns {number} 0 - 100
   */
  getAverageHealth() {
    if (!this.crew.length) return 0;
    const total = this.crew.reduce((sum, member) => sum + member.health, 0);
    return Math.round((total / this.crew.length) * 10) / 10;
  }

  /**
   * Count how many crew members are currently functional (health > 20)
   */
  getActiveCrewCount() {
    return this.crew.filter(c => c.health > 20).length;
  }

  /**
   * Count deceased or fully incapacitated crew (health <= 0)
   */
  getIncapacitatedCount() {
    return this.crew.filter(c => c.health <= 0).length;
  }

  /**
   * Apply daily physiological effects to each crew member
   * @param {Object} conditions - Daily environmental & shortage conditions
   * @returns {Array<string>} Notifications of health events
   */
  applyDailyPhysiology(conditions) {
    const logs = [];
    const {
      oxygenDeficit = 0,    // 0 = full O2, >0 = shortage
      waterDeficit = 0,     // 0 = full H2O, >0 = shortage
      foodDeficit = 0,      // 0 = full food, >0 = shortage
      radiationExposure = 0,// daily dose in mSv
      tempAnomaly = false,  // thermal failure
      integrityFailure = false
    } = conditions;

    this.crew.forEach(member => {
      let healthDelta = 0;
      let statusFlags = [];

      // 1. Oxygen deprivation is the most acute hazard
      if (oxygenDeficit > 0) {
        // Hypoxia damages quickly
        const hypoxiaDamage = Math.min(35, 12 + oxygenDeficit * 15);
        healthDelta -= hypoxiaDamage;
        statusFlags.push('HYPOXIA');
      }

      // 2. Dehydration
      if (waterDeficit > 0) {
        const dehydrationDamage = Math.min(25, 8 + waterDeficit * 10);
        healthDelta -= dehydrationDamage;
        statusFlags.push('DEHYDRATION');
      }

      // 3. Malnutrition
      if (foodDeficit > 0) {
        const hungerDamage = Math.min(15, 4 + foodDeficit * 6);
        healthDelta -= hungerDamage;
        statusFlags.push('MALNUTRITION');
      }

      // 4. Radiation exposure accumulation
      member.radiationDose += radiationExposure;
      if (member.radiationDose > 250) {
        // Severe acute radiation sickness
        healthDelta -= 12;
        statusFlags.push('ACUTE_RAD_SICKNESS');
      } else if (member.radiationDose > 120) {
        // Moderate radiation syndrome
        healthDelta -= 5;
        statusFlags.push('RAD_FATIGUE');
      }

      // 5. Environmental extreme (thermal / structural leak)
      if (tempAnomaly) {
        healthDelta -= 6;
        statusFlags.push('HYPOTHERMIA_RISK');
      }
      if (integrityFailure) {
        healthDelta -= 8;
        statusFlags.push('DECOMPRESSION_STRESS');
      }

      // Natural recovery if all basic survival needs are 100% met
      if (oxygenDeficit === 0 && waterDeficit === 0 && foodDeficit === 0 && !tempAnomaly && !integrityFailure) {
        if (member.health < 100) {
          healthDelta += 4; // Gradual recuperation in comfortable habitat
        }
      }

      const prevHealth = member.health;
      member.health = Math.max(0, Math.min(100, Math.round(member.health + healthDelta)));

      // Update status string
      if (member.health <= 0) {
        member.status = 'INCAPACITATED';
        logs.push(`CRITICAL: Astronaut ${member.name} has suffered medical collapse!`);
      } else if (member.health < 30) {
        member.status = 'CRITICAL';
        logs.push(`WARNING: ${member.name}'s health is critically degraded (${member.health}%).`);
      } else if (statusFlags.length > 0) {
        member.status = statusFlags[0];
      } else if (member.health < 70) {
        member.status = 'FATIGUED';
      } else if (member.health < 90) {
        member.status = 'STABLE';
      } else {
        member.status = 'OPTIMAL';
      }

      if (prevHealth > 30 && member.health <= 30 && member.health > 0) {
        logs.push(`ALERT: ${member.name} entered critical health zone.`);
      }
    });

    return logs;
  }

  /**
   * Check if specific crew perk is active
   * @param {string} memberId 
   * @returns {boolean}
   */
  isPerkActive(memberId) {
    const member = this.crew.find(c => c.id === memberId);
    return member ? member.health >= 60 : false;
  }

  /**
   * Treat or boost crew member health through medical intervention (from event or triage)
   */
  healCrew(amount) {
    this.crew.forEach(c => {
      if (c.health > 0) {
        c.health = Math.min(100, c.health + amount);
        if (c.health > 70 && c.status === 'FATIGUED') c.status = 'STABLE';
      }
    });
  }

  /**
   * Export serializable state
   */
  getState() {
    return JSON.parse(JSON.stringify(this.crew));
  }

  /**
   * Restore state
   */
  loadState(savedCrew) {
    this.crew = JSON.parse(JSON.stringify(savedCrew));
  }
}
