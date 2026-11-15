/**
 * AMAZE — Space Mission Engineering Simulator
 * game.js — Main game state machine, campaign coordinator, and view switcher
 */

import { SimulationEngine } from './simulation.js';
import { Storage } from './storage.js';
import { SoundEngine } from './sound.js';
import { UIController } from './ui.js';
import { TutorialController } from './tutorial.js';
import { ScoringSystem } from './scoring.js';

export class GameController {
  constructor() {
    this.currentView = 'VIEW_LANDING';
    this.selectedDifficulty = 'NORMAL';
    this.sim = null;
    this.sound = new SoundEngine();
    this.ui = new UIController(this);
    this.tutorial = new TutorialController(() => {
      const settings = Storage.loadSettings();
      settings.tutorialCompleted = true;
      Storage.saveSettings(settings);
    });
  }

  /**
   * Boot the application
   */
  start() {
    this.ui.init();
    this.loadSettings();
    this.bindLandingEvents();

    // Check if previous mission can be resumed
    const hasSave = Storage.hasSave();
    const resumeBtn = document.getElementById('btn-landing-resume');
    if (resumeBtn) {
      if (hasSave) {
        resumeBtn.style.display = 'inline-flex';
        resumeBtn.onclick = () => this.resumeSavedMission();
      } else {
        resumeBtn.style.display = 'none';
      }
    }
  }

  /**
   * Bind events on landing page and briefing
   */
  bindLandingEvents() {
    // Landing Start Mission button -> goes to briefing
    document.getElementById('btn-landing-start')?.addEventListener('click', () => {
      this.sound.playClick();
      this.switchView('VIEW_BRIEFING');
    });

    document.getElementById('btn-hero-start')?.addEventListener('click', () => {
      this.sound.playClick();
      this.switchView('VIEW_BRIEFING');
    });

    document.getElementById('btn-landing-guide')?.addEventListener('click', () => {
      this.sound.playClick();
      this.ui.openHelpModal();
    });

    document.getElementById('btn-landing-about')?.addEventListener('click', () => {
      this.sound.playClick();
      this.ui.openAboutModal();
    });

    // Briefing difficulty selector buttons
    document.querySelectorAll('.diff-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.sound.playClick();
        document.querySelectorAll('.diff-select-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedDifficulty = btn.getAttribute('data-diff');
        this.updateBriefingResourceTable(this.selectedDifficulty);
      });
    });

    // Launch Mission button on briefing screen
    document.getElementById('btn-briefing-launch')?.addEventListener('click', () => {
      this.sound.playDayAdvance();
      this.initializeNewMission(this.selectedDifficulty);
    });

    document.getElementById('btn-briefing-back')?.addEventListener('click', () => {
      this.sound.playClick();
      this.switchView('VIEW_LANDING');
    });
  }

  /**
   * Update numbers in briefing table based on selected difficulty
   */
  updateBriefingResourceTable(diff) {
    const table = document.getElementById('briefing-resource-table');
    if (!table) return;

    if (diff === 'EASY') {
      table.innerHTML = `
        <tr><td>Oxygen</td><td>130 units</td><td>Reduced burn (-20%)</td></tr>
        <tr><td>Potable Water</td><td>150 units</td><td>High recycling efficiency</td></tr>
        <tr><td>Food Rations</td><td>130 units</td><td>Extended supplies</td></tr>
        <tr><td>Battery Energy</td><td>130 units</td><td>Stable polar light</td></tr>
        <tr><td>Construction Materials</td><td>130 units</td><td>Generous spare parts</td></tr>
      `;
    } else if (diff === 'EXPERT') {
      table.innerHTML = `
        <tr><td>Oxygen</td><td>80 units</td><td>Heavy metabolic burn (+20%)</td></tr>
        <tr><td>Potable Water</td><td>90 units</td><td>High wastewater filtration load</td></tr>
        <tr><td>Food Rations</td><td>80 units</td><td>Strict rationing required</td></tr>
        <tr><td>Battery Energy</td><td>80 units</td><td>Severe polar shadow risk</td></tr>
        <tr><td>Construction Materials</td><td>75 units</td><td>Severe supply limitations</td></tr>
      `;
    } else {
      table.innerHTML = `
        <tr><td>Oxygen</td><td>100 units</td><td>Standard consumption</td></tr>
        <tr><td>Potable Water</td><td>120 units</td><td>Balanced filtration cycle</td></tr>
        <tr><td>Food Rations</td><td>100 units</td><td>Standard metabolic demand</td></tr>
        <tr><td>Battery Energy</td><td>100 units</td><td>Nominal solar collection</td></tr>
        <tr><td>Construction Materials</td><td>100 units</td><td>Standard deployment cache</td></tr>
      `;
    }
  }

  /**
   * Initialize a brand-new mission campaign
   */
  initializeNewMission(difficulty) {
    this.selectedDifficulty = difficulty;
    this.sim = new SimulationEngine(difficulty);
    Storage.saveMission(this.sim.getState());

    this.switchView('VIEW_MISSION_CONTROL');
    this.sound.startAmbient();
    this.ui.renderTelemetry(this.sim);

    // Check if tutorial should be shown
    const settings = Storage.loadSettings();
    if (!settings.tutorialCompleted) {
      setTimeout(() => this.tutorial.start(), 400);
    }
  }

  /**
   * Resume an existing mission from LocalStorage
   */
  resumeSavedMission() {
    const saved = Storage.loadMission();
    if (!saved) {
      alert('No saved mission found.');
      return;
    }

    this.selectedDifficulty = saved.difficulty || 'NORMAL';
    this.sim = new SimulationEngine(this.selectedDifficulty, saved);
    this.switchView('VIEW_MISSION_CONTROL');
    this.sound.startAmbient();
    this.ui.renderTelemetry(this.sim);
  }

  /**
   * Restart campaign completely
   */
  restartMission() {
    Storage.clearMission();
    this.sound.stopAmbient();
    this.switchView('VIEW_BRIEFING');
  }

  /**
   * Advance Sol by 1 day
   * Evaluates dynamic crisis events first; if triggered, presents choices to commander
   */
  advanceSol() {
    if (!this.sim || this.sim.isComplete || this.sim.isFailed) return;

    // Check if an event is triggered today
    const event = this.sim.eventManager.evaluateEventTrigger(this.sim);
    if (event) {
      // Open event decision dialog and pause daily advance until resolved
      this.ui.openEventModal(event);
      return;
    }

    // No event today: execute daily physical simulation directly
    this.executeDailyTick();
  }

  /**
   * Called when commander selects a choice for an active event
   */
  resolveEventChoice(choiceId) {
    const res = this.sim.eventManager.resolveActiveEvent(choiceId, this.sim);
    this.ui.closeAllModals();

    if (res) {
      this.sound.playClick();
      // Now continue daily tick
      this.executeDailyTick();
    }
  }

  /**
   * Execute physical daily tick, advance day, save state, and check completion/failure
   */
  executeDailyTick() {
    const result = this.sim.advanceDay();
    this.sound.playDayAdvance();

    // Auto-save to LocalStorage
    Storage.saveMission(this.sim.getState());

    // Re-render UI
    this.ui.renderTelemetry(this.sim);

    // Check completion or failure
    if (result.isComplete || result.isFailed) {
      const report = ScoringSystem.evaluate(this.sim);
      setTimeout(() => {
        this.ui.openEvaluationModal(report);
      }, 700);
    }
  }

  /**
   * Switch major screen views
   */
  switchView(viewName) {
    this.currentView = viewName;
    document.querySelectorAll('.app-view').forEach(view => {
      view.classList.remove('active');
    });

    const viewIdMap = {
      'VIEW_LANDING': 'view-landing',
      'VIEW_BRIEFING': 'view-briefing',
      'VIEW_MISSION_CONTROL': 'view-mission-control'
    };
    const targetId = viewIdMap[viewName] || viewName.toLowerCase().replace(/_/g, '-');
    const target = document.getElementById(targetId);
    if (target) {
      target.classList.add('active');
      window.scrollTo(0, 0);
    } else {
      console.error(`View element #${targetId} not found for viewName ${viewName}`);
    }
  }

  /**
   * Log message to simulation
   */
  logMessage(msg) {
    if (this.sim) {
      this.sim.addLog(msg);
      this.ui.renderTelemetry(this.sim);
    }
  }

  /**
   * Toggle audio mute
   */
  toggleAudio() {
    const settings = Storage.loadSettings();
    settings.soundEnabled = !settings.soundEnabled;
    this.sound.setMuted(!settings.soundEnabled);
    Storage.saveSettings(settings);

    const icon = document.getElementById('audio-toggle-icon');
    if (icon) {
      icon.textContent = settings.soundEnabled ? '🔊' : '🔇';
    }
  }

  loadSettings() {
    const settings = Storage.loadSettings();
    this.sound.setMuted(!settings.soundEnabled);
    const icon = document.getElementById('audio-toggle-icon');
    if (icon) {
      icon.textContent = settings.soundEnabled ? '🔊' : '🔇';
    }
  }
}
