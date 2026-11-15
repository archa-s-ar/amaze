/**
 * AMAZE — Space Mission Engineering Simulator
 * ui.js — User Interface controller, DOM binding, telemetry panels, modals, and event rendering
 */

import { OutpostVisualizer } from './outpost-visual.js';
import { TelemetryCharts } from './charts.js';
import { SCIENCE_TOPICS } from './educational.js';
import { ScoringSystem } from './scoring.js';

export class UIController {
  constructor(game) {
    this.game = game;
    this.outpostVisualizer = null;
    this.currentChartMode = 'LIFESUPPORT';
    this.selectedScienceTopic = 'life_support';
  }

  /**
   * Initialize UI and visualizer
   */
  init() {
    this.outpostVisualizer = new OutpostVisualizer('outpost-visual-container', (facId) => {
      this.openEngineeringBay(facId);
    });
    this.bindGlobalEvents();
  }

  /**
   * Bind permanent DOM buttons and navigation
   */
  bindGlobalEvents() {
    // Bottom Dock navigation
    document.getElementById('btn-engineering-bay')?.addEventListener('click', () => {
      this.game.sound.playClick();
      this.openEngineeringBay();
    });

    document.getElementById('btn-science-hub')?.addEventListener('click', () => {
      this.game.sound.playClick();
      this.openScienceArchive();
    });

    document.getElementById('btn-mission-log')?.addEventListener('click', () => {
      this.game.sound.playClick();
      this.openMissionLog();
    });

    document.getElementById('btn-advance-day')?.addEventListener('click', () => {
      this.game.advanceSol();
    });

    // Header buttons
    document.getElementById('btn-audio-toggle')?.addEventListener('click', () => {
      this.game.toggleAudio();
    });

    document.getElementById('btn-help-guide')?.addEventListener('click', () => {
      this.game.sound.playClick();
      this.openHelpModal();
    });

    document.getElementById('btn-about')?.addEventListener('click', () => {
      this.game.sound.playClick();
      this.openAboutModal();
    });

    document.getElementById('btn-restart-mission')?.addEventListener('click', () => {
      if (confirm('Restart mission? All progress for this lunar campaign will be reset.')) {
        this.game.restartMission();
      }
    });

    // Close buttons for modals
    document.querySelectorAll('.modal-close-btn, .modal-backdrop').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop') || e.target.classList.contains('modal-close-btn') || e.target.closest('.modal-close-btn')) {
          this.closeAllModals();
        }
      });
    });

    // Keyboard shortcuts: Space advances Sol, Esc closes modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  /**
   * Full re-render of all telemetry panels and readouts
   */
  renderTelemetry(sim) {
    if (!sim) return;

    // 1. Top Telemetry Bar
    const solEl = document.getElementById('telemetry-sol');
    if (solEl) solEl.textContent = `SOL ${sim.day.toString().padStart(2, '0')} / 30`;

    const phaseEl = document.getElementById('telemetry-phase');
    if (phaseEl) {
      if (sim.day <= 10) phaseEl.textContent = 'PHASE 1: INCEPTION & STABILIZATION';
      else if (sim.day <= 20) phaseEl.textContent = 'PHASE 2: OPERATIONS & DUST REGIME';
      else phaseEl.textContent = 'PHASE 3: DEEP LUNAR SURVIVAL';
    }

    const diffEl = document.getElementById('telemetry-diff');
    if (diffEl) diffEl.textContent = sim.difficulty;

    // 2. Resource Monitors
    this.renderResourceCard('oxygen', sim.resources.oxygen);
    this.renderResourceCard('water', sim.resources.water);
    this.renderResourceCard('food', sim.resources.food);
    this.renderEnergyCard(sim.resources.energy);
    this.renderMaterialsCard(sim.resources.materials);

    // 3. Crew Vitals
    this.renderCrewRoster(sim.crewManager);

    // 4. Habitat & Environmental Sensors
    this.renderHabAndEnvironment(sim);

    // 5. Update Outpost Map visual indicators
    if (this.outpostVisualizer) {
      this.outpostVisualizer.updateTelemetry(sim.infrastructure);
    }

    // 6. Update Advance Sol button forecast label
    this.updateAdvanceButtonPreview(sim);

    // 7. Render recent telemetry log
    this.renderTelemetryLogs(sim.logs);
  }

  /**
   * Render individual life-support resource card
   */
  renderResourceCard(key, res) {
    const card = document.getElementById(`res-card-${key}`);
    if (!card) return;

    const valEl = card.querySelector('.res-current-val');
    const maxEl = card.querySelector('.res-max-val');
    const netEl = card.querySelector('.res-net-rate');
    const statusBadge = card.querySelector('.res-status-badge');
    const progressBar = card.querySelector('.res-progress-fill');
    const daysLeftEl = card.querySelector('.res-days-left');
    const burnEl = card.querySelector('.res-burn-rate');
    const prodEl = card.querySelector('.res-prod-rate');

    if (valEl) valEl.textContent = Math.round(res.current);
    if (maxEl) maxEl.textContent = res.max;
    if (burnEl) burnEl.textContent = `-${res.dailyConsumption}`;
    if (prodEl) prodEl.textContent = `+${res.dailyProduction}`;

    if (netEl) {
      const sign = res.netRate >= 0 ? '+' : '';
      netEl.textContent = `${sign}${res.netRate}/day`;
      netEl.className = `res-net-rate ${res.netRate >= 0 ? 'text-success' : 'text-danger'}`;
    }

    if (statusBadge) {
      statusBadge.textContent = res.status;
      statusBadge.className = `status-pill badge-${res.status.toLowerCase()}`;
    }

    if (progressBar) {
      const pct = Math.min(100, Math.max(0, (res.current / res.max) * 100));
      progressBar.style.width = `${pct}%`;
      progressBar.className = `res-progress-fill fill-${res.status.toLowerCase()}`;
    }

    if (daysLeftEl) {
      if (res.netRate >= 0) {
        daysLeftEl.textContent = 'SUSTAINABLE';
        daysLeftEl.className = 'res-days-left text-success';
      } else {
        daysLeftEl.textContent = `~${res.daysLeft} SOLS REMAINING`;
        daysLeftEl.className = `res-days-left ${res.daysLeft <= 3 ? 'text-danger font-bold pulse' : res.daysLeft <= 6 ? 'text-amber' : ''}`;
      }
    }
  }

  /**
   * Render Energy & Battery Card
   */
  renderEnergyCard(energy) {
    const card = document.getElementById('res-card-energy');
    if (!card) return;

    const valEl = card.querySelector('.res-current-val');
    const maxEl = card.querySelector('.res-max-val');
    const netEl = card.querySelector('.res-net-rate');
    const statusBadge = card.querySelector('.res-status-badge');
    const progressBar = card.querySelector('.res-progress-fill');
    const genEl = card.querySelector('.res-gen-rate');
    const loadEl = card.querySelector('.res-load-rate');
    const daysLeftEl = card.querySelector('.res-days-left');

    if (valEl) valEl.textContent = Math.round(energy.current);
    if (maxEl) maxEl.textContent = energy.max;
    if (genEl) genEl.textContent = `+${energy.dailyGeneration}`;
    if (loadEl) loadEl.textContent = `-${energy.dailyLoad}`;

    if (netEl) {
      const sign = energy.netRate >= 0 ? '+' : '';
      netEl.textContent = `${sign}${energy.netRate}/day`;
      netEl.className = `res-net-rate ${energy.netRate >= 0 ? 'text-success' : 'text-danger'}`;
    }

    if (statusBadge) {
      statusBadge.textContent = energy.status;
      statusBadge.className = `status-pill badge-${energy.status.toLowerCase()}`;
    }

    if (progressBar) {
      const pct = Math.min(100, Math.max(0, (energy.current / energy.max) * 100));
      progressBar.style.width = `${pct}%`;
      progressBar.className = `res-progress-fill fill-${energy.status.toLowerCase()}`;
    }

    if (daysLeftEl) {
      if (energy.netRate >= 0) {
        daysLeftEl.textContent = 'STORAGE FULL / SURPLUS';
        daysLeftEl.className = 'res-days-left text-success';
      } else {
        daysLeftEl.textContent = `BATTERY DEPLETION IN ~${energy.daysLeft} SOLS`;
        daysLeftEl.className = `res-days-left ${energy.daysLeft <= 2 ? 'text-danger pulse' : 'text-amber'}`;
      }
    }
  }

  /**
   * Render Construction Materials card
   */
  renderMaterialsCard(mat) {
    const card = document.getElementById('res-card-materials');
    if (!card) return;
    const valEl = card.querySelector('.mat-current-val');
    if (valEl) valEl.textContent = Math.round(mat.current);
  }

  /**
   * Render Crew Roster & Vitals
   */
  renderCrewRoster(crewManager) {
    const list = document.getElementById('crew-roster-list');
    if (!list) return;

    list.innerHTML = crewManager.crew.map(m => {
      const isPerkActive = m.health >= 60;
      let badgeClass = 'badge-optimal';
      if (m.health <= 0) badgeClass = 'badge-critical';
      else if (m.health < 40) badgeClass = 'badge-danger';
      else if (m.health < 75) badgeClass = 'badge-warning';

      return `
        <div class="crew-card ${m.health <= 0 ? 'crew-incapacitated' : ''}">
          <div class="crew-header">
            <div class="crew-name-box">
              <span class="crew-callsign">${m.callsign}</span>
              <span class="crew-name">${m.name}</span>
            </div>
            <span class="status-pill ${badgeClass}">${m.status}</span>
          </div>
          <div class="crew-role-row">
            <span class="crew-role">${m.role}</span>
            <span class="crew-health-pct ${m.health < 40 ? 'text-danger pulse' : ''}">${m.health}% HP</span>
          </div>
          <div class="crew-progress-track">
            <div class="crew-progress-fill ${m.health < 40 ? 'fill-critical' : m.health < 75 ? 'fill-warning' : 'fill-stable'}" style="width: ${m.health}%"></div>
          </div>
          <div class="crew-perk ${isPerkActive ? 'perk-active' : 'perk-disabled'}">
            <span class="perk-bullet">⚡</span> ${m.perk}
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render Environmental and Habitat Integrity metrics
   */
  renderHabAndEnvironment(sim) {
    // 1. Habitat Integrity
    const integrityVal = document.getElementById('telemetry-integrity-val');
    const integrityBar = document.getElementById('telemetry-integrity-bar');
    if (integrityVal) integrityVal.textContent = `${Math.round(sim.resources.habitatIntegrity)}%`;
    if (integrityBar) {
      integrityBar.style.width = `${Math.round(sim.resources.habitatIntegrity)}%`;
      integrityBar.className = `gauge-fill ${sim.resources.habitatIntegrity < 40 ? 'fill-critical' : sim.resources.habitatIntegrity < 70 ? 'fill-warning' : 'fill-stable'}`;
    }

    // 2. Radiation Exposure Index
    const radVal = document.getElementById('telemetry-rad-val');
    const radBar = document.getElementById('telemetry-rad-bar');
    if (radVal) radVal.textContent = `${Math.round(sim.resources.radiationIndex)} mSv`;
    if (radBar) {
      // Scale 0 - 200 mSv
      const pct = Math.min(100, (sim.resources.radiationIndex / 200) * 100);
      radBar.style.width = `${pct}%`;
      radBar.className = `gauge-fill ${sim.resources.radiationIndex > 120 ? 'fill-critical' : sim.resources.radiationIndex > 60 ? 'fill-warning' : 'fill-stable'}`;
    }

    // 3. Solar Dust Adhesion
    const dustVal = document.getElementById('telemetry-dust-val');
    const dustBar = document.getElementById('telemetry-dust-bar');
    const dust = sim.infrastructure.facilities.solarArray.dustAccumulation;
    if (dustVal) dustVal.textContent = `${Math.round(dust)}%`;
    if (dustBar) {
      dustBar.style.width = `${dust}%`;
      dustBar.className = `gauge-fill ${dust > 40 ? 'fill-warning' : 'fill-stable'}`;
    }

    // 4. Clean Dust EVA quick button visibility
    const cleanBtn = document.getElementById('btn-quick-clean-dust');
    if (cleanBtn) {
      cleanBtn.style.display = dust > 10 ? 'inline-flex' : 'none';
      cleanBtn.onclick = () => {
        const res = sim.infrastructure.cleanSolarArray(sim.resources);
        if (res.success) {
          this.game.sound.playUpgrade();
          this.game.logMessage('MAINTENANCE: Dust removed from solar arrays.');
          this.renderTelemetry(sim);
        } else {
          alert(res.reason);
        }
      };
    }

    // 5. Quick Hull Repair button visibility
    const repairBtn = document.getElementById('btn-quick-repair-hull');
    if (repairBtn) {
      repairBtn.style.display = sim.resources.habitatIntegrity < 90 ? 'inline-flex' : 'none';
      repairBtn.onclick = () => {
        const res = sim.infrastructure.performRepair(sim.resources, sim.crewManager);
        if (res.success) {
          this.game.sound.playUpgrade();
          this.game.logMessage(`REPAIR: Structural patch applied (+${res.restored}% integrity).`);
          this.renderTelemetry(sim);
        } else {
          alert(res.reason);
        }
      };
    }
  }

  /**
   * Update the label on "Advance Sol" button with forecast summary
   */
  updateAdvanceButtonPreview(sim) {
    const btn = document.getElementById('btn-advance-day');
    if (!btn) return;
    const nextSol = sim.day + 1;
    btn.innerHTML = `
      <span class="btn-adv-primary">ADVANCE TO SOL ${nextSol}</span>
      <span class="btn-adv-sub">Net: O₂ ${sim.resources.oxygen.netRate > 0 ? '+' : ''}${sim.resources.oxygen.netRate} • H₂O ${sim.resources.water.netRate > 0 ? '+' : ''}${sim.resources.water.netRate} • PWR ${sim.resources.energy.netRate > 0 ? '+' : ''}${sim.resources.energy.netRate}</span>
    `;
  }

  /**
   * Render the scrollable chronological log feed
   */
  renderTelemetryLogs(logs) {
    const feed = document.getElementById('telemetry-feed');
    if (!feed) return;
    feed.innerHTML = logs.slice(0, 15).map(log => {
      let cls = 'log-info';
      if (log.includes('CRITICAL') || log.includes('ABORT') || log.includes('FAILURE')) cls = 'log-critical';
      else if (log.includes('WARNING') || log.includes('ALERT') || log.includes('BROWNOUT')) cls = 'log-warning';
      else if (log.includes('SUCCESS') || log.includes('CELEBRATION') || log.includes('REPAIR')) cls = 'log-success';

      return `<div class="log-entry ${cls}">${log}</div>`;
    }).join('');
  }

  /**
   * Open Engineering Bay Modal
   */
  openEngineeringBay(preselectedFacilityId = null) {
    const modal = document.getElementById('modal-engineering-bay');
    if (!modal) return;
    modal.classList.add('active');
    this.renderEngineeringBayFacilities(preselectedFacilityId);
  }

  /**
   * Render all 7 facilities inside the Engineering Bay
   */
  renderEngineeringBayFacilities(highlightId = null) {
    const container = document.getElementById('eng-facilities-container');
    if (!container) return;

    const sim = this.game.sim;
    const facilities = sim.infrastructure.facilities;

    container.innerHTML = Object.values(facilities).map(fac => {
      const currentTier = sim.infrastructure.getCurrentTier(fac.id);
      const nextTier = sim.infrastructure.getNextTier(fac.id);
      const canUp = sim.infrastructure.canUpgrade(fac.id, sim.resources.materials.current);
      const isHighlighted = highlightId === fac.id;

      return `
        <div class="facility-card ${isHighlighted ? 'facility-highlight' : ''}" id="eng-card-${fac.id}">
          <div class="fac-header">
            <div class="fac-title-group">
              <span class="fac-name">${fac.name}</span>
              <span class="fac-tier-badge">LEVEL ${fac.level} OF ${fac.maxLevel}</span>
            </div>
            <div class="fac-status-indicator">
              <span class="status-pill ${fac.health < 50 ? 'badge-critical' : 'badge-optimal'}">${fac.health}% HEALTH</span>
            </div>
          </div>
          <p class="fac-desc">${fac.description}</p>

          <!-- Current Performance -->
          <div class="fac-current-tier-box">
            <div class="tier-label">CURRENT CONFIGURATION: <strong>${currentTier.title}</strong></div>
            <div class="tier-desc">${currentTier.desc}</div>
          </div>

          <!-- Operating Modes Selection -->
          <div class="fac-mode-section">
            <span class="mode-label">OPERATING MODE:</span>
            <div class="mode-buttons-group">
              ${this.renderModeButtons(fac)}
            </div>
          </div>

          <!-- Upgrade Tier Action -->
          <div class="fac-upgrade-section">
            ${nextTier ? `
              <div class="next-tier-info">
                <span class="next-title">NEXT: Level ${fac.level + 1} — ${nextTier.title}</span>
                <span class="next-desc">${nextTier.desc}</span>
              </div>
              <div class="upgrade-action-row">
                <span class="upgrade-cost ${canUp.canUpgrade ? 'text-success' : 'text-danger'}">
                  Cost: ${nextTier.cost} Materials (Available: ${Math.floor(sim.resources.materials.current)})
                </span>
                <button class="btn btn-sm ${canUp.canUpgrade ? 'btn-primary' : 'btn-disabled'}" data-upgrade-fac="${fac.id}" ${canUp.canUpgrade ? '' : 'disabled'}>
                  UPGRADE TO LVL ${fac.level + 1}
                </button>
              </div>
            ` : `
              <div class="max-tier-banner">✓ MAXIMUM UPGRADE LEVEL ATTAINED</div>
            `}
          </div>
        </div>
      `;
    }).join('');

    // Bind upgrade buttons
    container.querySelectorAll('[data-upgrade-fac]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const facId = btn.getAttribute('data-upgrade-fac');
        const success = sim.infrastructure.upgrade(facId, sim.resources);
        if (success) {
          this.game.sound.playUpgrade();
          this.game.logMessage(`ENGINEERING: Upgraded ${facilities[facId].name} to Level ${facilities[facId].level}.`);
          this.renderTelemetry(sim);
          this.renderEngineeringBayFacilities(facId);
        }
      });
    });

    // Bind mode toggle buttons
    container.querySelectorAll('[data-set-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        const facId = btn.getAttribute('data-fac-id');
        const mode = btn.getAttribute('data-set-mode');
        sim.infrastructure.setMode(facId, mode);
        this.game.sound.playClick();
        sim.recalculateDailyProjections();
        this.renderTelemetry(sim);
        this.renderEngineeringBayFacilities(facId);
      });
    });

    if (highlightId) {
      document.getElementById(`eng-card-${highlightId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /**
   * Helper to render operational mode toggle pills
   */
  renderModeButtons(fac) {
    if (fac.id === 'lifeSupport' || fac.id === 'waterRecovery') {
      return `
        <button class="btn-mode ${fac.mode === 'ECO' ? 'active' : ''}" data-fac-id="${fac.id}" data-set-mode="ECO">ECO (-50% PWR)</button>
        <button class="btn-mode ${fac.mode === 'STANDARD' ? 'active' : ''}" data-fac-id="${fac.id}" data-set-mode="STANDARD">STANDARD</button>
        <button class="btn-mode ${fac.mode === 'BOOST' ? 'active' : ''}" data-fac-id="${fac.id}" data-set-mode="BOOST">BOOST (+RECOVERY)</button>
      `;
    }
    if (fac.id === 'solarArray') {
      return `
        <button class="btn-mode ${fac.mode === 'TRACKING' ? 'active' : ''}" data-fac-id="${fac.id}" data-set-mode="TRACKING">HELIOSTAT TRACKING</button>
        <button class="btn-mode ${fac.mode === 'STORM_DEFENSE' ? 'active' : ''}" data-fac-id="${fac.id}" data-set-mode="STORM_DEFENSE">STORM DEFENSE</button>
      `;
    }
    if (fac.id === 'greenhouse') {
      return `
        <button class="btn-mode ${fac.mode === 'WATER_SAVER' ? 'active' : ''}" data-fac-id="${fac.id}" data-set-mode="WATER_SAVER">WATER SAVER</button>
        <button class="btn-mode ${fac.mode === 'GROWTH' ? 'active' : ''}" data-fac-id="${fac.id}" data-set-mode="GROWTH">NORMAL GROWTH</button>
        <button class="btn-mode ${fac.mode === 'HARVEST_BURST' ? 'active' : ''}" data-fac-id="${fac.id}" data-set-mode="HARVEST_BURST">HARVEST BURST</button>
      `;
    }
    if (fac.id === 'radiationShelter') {
      return `
        <button class="btn-mode ${fac.mode === 'NORMAL' ? 'active' : ''}" data-fac-id="${fac.id}" data-set-mode="NORMAL">STANDARD ROTATION</button>
        <button class="btn-mode ${fac.mode === 'LOCKDOWN' ? 'active' : ''}" data-fac-id="${fac.id}" data-set-mode="LOCKDOWN">STORM LOCKDOWN</button>
      `;
    }
    return `<span class="mode-auto">AUTOMATED OPERATION</span>`;
  }

  /**
   * Open the Dynamic Mission Event / Emergency Modal
   */
  openEventModal(event) {
    const modal = document.getElementById('modal-mission-event');
    if (!modal) return;

    this.game.sound.playCriticalAlarm();
    modal.classList.add('active');

    const severityClass = `event-severity-${event.severity.toLowerCase()}`;
    modal.querySelector('.event-modal-content').innerHTML = `
      <div class="event-header ${severityClass}">
        <div class="event-header-top">
          <span class="event-alert-tag">⚠ TACTICAL SITUATION REPORT</span>
          <span class="event-severity-badge">${event.severity} SEVERITY</span>
        </div>
        <h2 class="event-title">${event.title}</h2>
      </div>

      <div class="event-body">
        <p class="event-desc">${event.description}</p>

        <!-- Science & Engineering Insight Box -->
        <div class="event-insight-card">
          <div class="insight-label">🔬 ENGINEERING INSIGHT</div>
          <p class="insight-text">${event.scienceInsight}</p>
          ${event.readMoreTopic ? `
            <button class="btn-link-science" data-topic="${event.readMoreTopic}">
              Read More in Science Archive ➔
            </button>
          ` : ''}
        </div>

        <div class="event-choices-header">DIRECTIVE REQUIRED — SELECT ENGINEERING ACTION:</div>
        <div class="event-choices-list">
          ${event.choices.map((ch, idx) => `
            <button class="event-choice-btn" data-choice-id="${ch.id}">
              <div class="choice-title-row">
                <span class="choice-number">[OPTION ${idx + 1}]</span>
                <span class="choice-name">${ch.label}</span>
              </div>
              <p class="choice-desc">${ch.desc}</p>
              <div class="choice-cost-preview">Trade-off: ${ch.costPreview}</div>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Bind choice buttons
    modal.querySelectorAll('[data-choice-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const choiceId = btn.getAttribute('data-choice-id');
        this.game.resolveEventChoice(choiceId);
      });
    });

    // Bind science link
    modal.querySelector('.btn-link-science')?.addEventListener('click', (e) => {
      const topicId = e.currentTarget.getAttribute('data-topic');
      modal.classList.remove('active');
      this.openScienceArchive(topicId);
    });
  }

  /**
   * Open Science Behind the Mission Archive
   */
  openScienceArchive(focusTopicId = null) {
    const modal = document.getElementById('modal-science-archive');
    if (!modal) return;
    modal.classList.add('active');

    if (focusTopicId) {
      this.selectedScienceTopic = focusTopicId;
    }

    this.renderScienceArchive();
  }

  /**
   * Render topics & reader inside Science Archive
   */
  renderScienceArchive() {
    const topicList = document.getElementById('science-topic-list');
    const reader = document.getElementById('science-reader-body');
    if (!topicList || !reader) return;

    // Render left topic sidebar
    topicList.innerHTML = SCIENCE_TOPICS.map(topic => `
      <button class="science-topic-item ${this.selectedScienceTopic === topic.id ? 'active' : ''}" data-topic-id="${topic.id}">
        <span class="topic-cat">${topic.category}</span>
        <span class="topic-title">${topic.title}</span>
      </button>
    `).join('');

    // Bind sidebar clicks
    topicList.querySelectorAll('[data-topic-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedScienceTopic = btn.getAttribute('data-topic-id');
        this.game.sound.playClick();
        this.renderScienceArchive();
      });
    });

    // Render active topic reader
    const current = SCIENCE_TOPICS.find(t => t.id === this.selectedScienceTopic) || SCIENCE_TOPICS[0];
    reader.innerHTML = `
      <div class="science-article">
        <div class="article-meta">
          <span class="article-cat">${current.category}</span>
          <span class="article-ref">Source: ${current.realWorldRef}</span>
        </div>
        <h2 class="article-title">${current.title}</h2>
        <h4 class="article-subtitle">${current.subtitle}</h4>
        <div class="article-summary-lead">${current.summary}</div>

        <div class="article-sections">
          ${current.sections.map(s => `
            <div class="article-subheading">
              <h3>${s.heading}</h3>
              <div class="article-prose">${this.formatProse(s.content)}</div>
            </div>
          `).join('')}
        </div>

        ${current.calculator ? this.renderInteractiveCalculator(current.calculator) : ''}
      </div>
    `;

    this.bindCalculatorEvents(current.calculator);
  }

  /**
   * Parse simple markdown bold / KaTeX formulas into readable HTML
   */
  formatProse(content) {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<p></p>')
      .replace(/\$\$(.*?)\$\$/g, '<div class="math-block">$1</div>')
      .replace(/\$(.*?)\$/g, '<span class="math-inline">$1</span>');
  }

  /**
   * Render interactive educational calculator
   */
  renderInteractiveCalculator(calc) {
    if (calc.type === 'oxygen_calculator') {
      return `
        <div class="calc-widget">
          <h4>🧪 ${calc.title}</h4>
          <p class="calc-desc">${calc.desc}</p>
          <div class="calc-controls">
            <label>Crew Size: <span id="calc-crew-val">4</span> astronauts</label>
            <input type="range" id="calc-crew-range" min="1" max="10" value="4" />

            <label>ECLSS Loop Closure: <span id="calc-eff-val">80</span>%</label>
            <input type="range" id="calc-eff-range" min="0" max="100" value="80" />
          </div>
          <div class="calc-results" id="calc-o2-result">
            Daily O₂ Required: <strong>3.36 kg</strong> | Recycled: <strong>2.69 kg</strong> | Resupply Deficit: <strong>0.67 kg/day</strong>
          </div>
        </div>
      `;
    }
    if (calc.type === 'radiation_calculator') {
      return `
        <div class="calc-widget">
          <h4>🛡 ${calc.title}</h4>
          <p class="calc-desc">${calc.desc}</p>
          <div class="calc-controls">
            <label>Compacted Regolith Thickness: <span id="calc-reg-val">150</span> cm</label>
            <input type="range" id="calc-reg-range" min="0" max="300" step="10" value="150" />
          </div>
          <div class="calc-results" id="calc-rad-result">
            Radiation Attenuation: <strong>85% reduction</strong> | Residual Daily GCR: <strong>0.36 mSv/day</strong> (Safe Occupational Range)
          </div>
        </div>
      `;
    }
    return '';
  }

  bindCalculatorEvents(calc) {
    if (!calc) return;
    if (calc.type === 'oxygen_calculator') {
      const crewInput = document.getElementById('calc-crew-range');
      const effInput = document.getElementById('calc-eff-range');
      const updateO2 = () => {
        const crew = parseInt(crewInput.value);
        const eff = parseInt(effInput.value) / 100;
        document.getElementById('calc-crew-val').textContent = crew;
        document.getElementById('calc-eff-val').textContent = Math.round(eff * 100);
        const req = (crew * 0.84).toFixed(2);
        const rec = (req * eff).toFixed(2);
        const def = (req - rec).toFixed(2);
        document.getElementById('calc-o2-result').innerHTML = `
          Daily O₂ Required: <strong>${req} kg</strong> | Recycled: <strong>${rec} kg</strong> | Resupply Deficit: <strong>${def} kg/day</strong>
        `;
      };
      crewInput?.addEventListener('input', updateO2);
      effInput?.addEventListener('input', updateO2);
    }
    if (calc.type === 'radiation_calculator') {
      const regInput = document.getElementById('calc-reg-range');
      const updateRad = () => {
        const depth = parseInt(regInput.value);
        document.getElementById('calc-reg-val').textContent = depth;
        // Exponential attenuation approx: I = I0 * exp(-depth / half_value_layer)
        const attenuation = Math.min(99, Math.round((1 - Math.exp(-depth / 80)) * 100));
        const residual = (2.4 * (1 - attenuation / 100)).toFixed(2);
        document.getElementById('calc-rad-result').innerHTML = `
          Radiation Attenuation: <strong>${attenuation}% reduction</strong> | Residual Daily GCR: <strong>${residual} mSv/day</strong> ${residual < 0.5 ? '(Safe Occupational Range)' : '(Elevated Cosmic Exposure)'}
        `;
      };
      regInput?.addEventListener('input', updateRad);
    }
  }

  /**
   * Open Mission Log & SVG History Charts Modal
   */
  openMissionLog() {
    const modal = document.getElementById('modal-mission-log');
    if (!modal) return;
    modal.classList.add('active');

    // Chart mode toggle buttons
    const container = document.getElementById('chart-container');
    TelemetryCharts.renderChart(container, this.game.sim.resources.history, this.currentChartMode);

    modal.querySelectorAll('.chart-filter-btn').forEach(btn => {
      btn.onclick = () => {
        modal.querySelectorAll('.chart-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentChartMode = btn.getAttribute('data-chart-mode');
        TelemetryCharts.renderChart(container, this.game.sim.resources.history, this.currentChartMode);
      };
    });

    // Populate event history table
    const historyList = document.getElementById('log-history-list');
    if (historyList) {
      const hist = this.game.sim.eventManager.eventHistory;
      if (hist.length === 0) {
        historyList.innerHTML = '<div class="empty-state">No major crises recorded yet.</div>';
      } else {
        historyList.innerHTML = hist.map(rec => `
          <div class="history-item">
            <span class="hist-sol">SOL ${rec.day}</span>
            <div class="hist-content">
              <strong>${rec.title}</strong>
              <div class="hist-choice">Directive: ${rec.choiceLabel}</div>
              <div class="hist-result">${rec.resultMessage}</div>
            </div>
          </div>
        `).join('');
      }
    }
  }

  /**
   * Open Final Mission Debrief / Evaluation Modal (Success or Failure)
   */
  openEvaluationModal(report) {
    const modal = document.getElementById('modal-evaluation');
    if (!modal) return;
    modal.classList.add('active');

    const isSuccess = report.isSuccess;
    if (isSuccess) {
      this.game.sound.playUpgrade();
    } else {
      this.game.sound.playCriticalAlarm();
    }

    modal.querySelector('.eval-modal-content').innerHTML = `
      <div class="eval-header ${isSuccess ? 'eval-success' : 'eval-failure'}">
        <div class="eval-badge-tag">${isSuccess ? '🏆 MISSION COMPLETE' : '❌ MISSION TERMINATED'}</div>
        <h1 class="eval-rank-title">${report.rank}</h1>
        <p class="eval-tagline">${report.rankDescription}</p>
        <div class="eval-final-score">FINAL RATING: <strong>${report.finalScore}</strong> PTS (${report.difficulty} DIFFICULTY)</div>
      </div>

      <div class="eval-body">
        ${!isSuccess && this.game.sim.failureReason ? `
          <div class="failure-post-mortem">
            <h3>POST-MORTEM ENGINEERING ANALYSIS</h3>
            <p class="fail-desc"><strong>Cause:</strong> ${this.game.sim.failureReason.desc}</p>
            <ul>
              ${this.game.sim.failureReason.contributingFactors.map(f => `<li>${f}</li>`).join('')}
            </ul>
            <div class="fail-tip">💡 <strong>Engineering Recommendation:</strong> ${this.game.sim.failureReason.tip}</div>
          </div>
        ` : ''}

        <div class="eval-stats-grid">
          <div class="eval-stat-box">
            <span class="stat-lbl">Duration Survived</span>
            <span class="stat-val">${report.dayReached} / 30 Sols</span>
          </div>
          <div class="eval-stat-box">
            <span class="stat-lbl">Crew Health</span>
            <span class="stat-val">${report.stats.avgCrewHealth}% (${report.stats.activeCrew}/4 Alive)</span>
          </div>
          <div class="eval-stat-box">
            <span class="stat-lbl">Remaining O₂</span>
            <span class="stat-val">${report.stats.remainingOxygen} units</span>
          </div>
          <div class="eval-stat-box">
            <span class="stat-lbl">Remaining Water</span>
            <span class="stat-val">${report.stats.remainingWater} units</span>
          </div>
          <div class="eval-stat-box">
            <span class="stat-lbl">Remaining Food</span>
            <span class="stat-val">${report.stats.remainingFood} units</span>
          </div>
          <div class="eval-stat-box">
            <span class="stat-lbl">Remaining Energy</span>
            <span class="stat-val">${report.stats.remainingEnergy} units</span>
          </div>
          <div class="eval-stat-box">
            <span class="stat-lbl">Cum. Radiation Dose</span>
            <span class="stat-val">${report.stats.radiationIndex} mSv</span>
          </div>
          <div class="eval-stat-box">
            <span class="stat-lbl">Hull Integrity</span>
            <span class="stat-val">${report.stats.habitatIntegrity}%</span>
          </div>
          <div class="eval-stat-box">
            <span class="stat-lbl">Tech Upgrades</span>
            <span class="stat-val">${report.stats.upgradesCompleted} Completed</span>
          </div>
          <div class="eval-stat-box">
            <span class="stat-lbl">Crises Handled</span>
            <span class="stat-val">${report.stats.eventsResolved} Resolved</span>
          </div>
        </div>

        <div class="eval-score-breakdown">
          <h4>SCORING BREAKDOWN</h4>
          <div class="breakdown-row"><span>Survival Duration:</span> <strong>+${report.breakdown.survival}</strong></div>
          <div class="breakdown-row"><span>Crew Welfare & Health:</span> <strong>+${report.breakdown.crewWelfare}</strong></div>
          <div class="breakdown-row"><span>Resource Stockpile Conservation:</span> <strong>+${report.breakdown.resources}</strong></div>
          <div class="breakdown-row"><span>Structural Integrity:</span> <strong>+${report.breakdown.integrity}</strong></div>
          <div class="breakdown-row"><span>Radiation Shielding Safety:</span> <strong>+${report.breakdown.radiationSafety}</strong></div>
          <div class="breakdown-row"><span>Infrastructure Engineering:</span> <strong>+${report.breakdown.infrastructure}</strong></div>
          <div class="breakdown-row"><span>Emergency Crises Triage:</span> <strong>+${report.breakdown.crisesResolved}</strong></div>
          ${report.breakdown.scienceBonuses > 0 ? `<div class="breakdown-row text-success"><span>Scientific Discoveries:</span> <strong>+${report.breakdown.scienceBonuses}</strong></div>` : ''}
          <div class="breakdown-row diff-mult"><span>Difficulty Multiplier:</span> <strong>×${report.breakdown.difficultyMultiplier}</strong></div>
        </div>

        <div class="eval-actions">
          <button class="btn btn-primary" id="btn-eval-restart">RESTART NEW MISSION</button>
          <button class="btn btn-secondary" onclick="window.print()">PRINT MISSION CERTIFICATE</button>
        </div>
      </div>
    `;

    document.getElementById('btn-eval-restart')?.addEventListener('click', () => {
      this.closeAllModals();
      this.game.restartMission();
    });
  }

  openHelpModal() {
    const modal = document.getElementById('modal-how-to-play');
    if (modal) modal.classList.add('active');
  }

  openAboutModal() {
    const modal = document.getElementById('modal-about');
    if (modal) modal.classList.add('active');
  }

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  }
}
