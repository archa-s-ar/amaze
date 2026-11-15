/**
 * AMAZE — Space Mission Engineering Simulator
 * tutorial.js — Interactive Onboarding Walkthrough for first-time Commanders
 */

export const TUTORIAL_STEPS = [
  {
    target: '.telemetry-bar',
    title: 'COMMAND TELEMETRY',
    text: 'Welcome to Outpost Alpha, Commander. Your mission is to survive 30 simulated lunar days (Sols) with a crew of four astronauts at the Lunar South Pole.',
    position: 'bottom'
  },
  {
    target: '#panel-resources',
    title: 'LIFE-SUPPORT RESOURCES',
    text: 'Monitor Oxygen, Water, Food, and Energy continuously. Each shows your current reserves, daily burn vs production, and estimated days remaining.',
    position: 'right'
  },
  {
    target: '#outpost-visual-container',
    title: 'OUTPOST INFRASTRUCTURE SCHEMATIC',
    text: 'This interactive map shows all 7 outpost modules. Click on any facility (Solar Array, ECLSS, Greenhouse, etc.) to inspect its operational mode or upgrade its systems.',
    position: 'bottom'
  },
  {
    target: '#panel-crew-env',
    title: 'CREW VITALS & RADIATION',
    text: 'Keep track of all four astronauts. If oxygen, water, or food runs out, health degrades rapidly. The Radiation Index tracks cosmic ray exposure.',
    position: 'left'
  },
  {
    target: '#btn-engineering-bay',
    title: 'ENGINEERING BAY',
    text: 'Spend Construction Materials to upgrade facilities, switch operating modes (Eco vs Boost), clean dust from solar arrays, and patch hull breaches.',
    position: 'top'
  },
  {
    target: '#btn-advance-day',
    title: 'ADVANCING THE MISSION CYCLE',
    text: 'When your systems are balanced and planned actions executed, advance to the next Sol. Watch out for unpredictable space emergencies!',
    position: 'top'
  }
];

export class TutorialController {
  constructor(onComplete = null) {
    this.currentStep = 0;
    this.isActive = false;
    this.onComplete = onComplete;
  }

  start() {
    this.currentStep = 0;
    this.isActive = true;
    this.render();
  }

  next() {
    this.currentStep++;
    if (this.currentStep >= TUTORIAL_STEPS.length) {
      this.close();
    } else {
      this.render();
    }
  }

  prev() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.render();
    }
  }

  close() {
    this.isActive = false;
    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) overlay.remove();
    if (this.onComplete) this.onComplete();
  }

  render() {
    let overlay = document.getElementById('tutorial-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'tutorial-overlay';
      overlay.className = 'tutorial-overlay';
      document.body.appendChild(overlay);
    }

    const step = TUTORIAL_STEPS[this.currentStep];
    const targetEl = document.querySelector(step.target);

    // Position calculation
    let rect = { top: 100, left: 100, width: 300, height: 100 };
    if (targetEl) {
      rect = targetEl.getBoundingClientRect();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    overlay.innerHTML = `
      <div class="tutorial-backdrop"></div>
      <div class="tutorial-card" style="top: ${Math.min(window.innerHeight - 240, Math.max(30, rect.top + (step.position === 'bottom' ? rect.height + 15 : step.position === 'top' ? -210 : 0)))}px; left: ${Math.min(window.innerWidth - 380, Math.max(20, rect.left + (step.position === 'right' ? rect.width + 15 : 0)))}px;">
        <div class="tutorial-badge">STEP ${this.currentStep + 1} OF ${TUTORIAL_STEPS.length}</div>
        <h4 class="tutorial-title">${step.title}</h4>
        <p class="tutorial-body">${step.text}</p>
        <div class="tutorial-actions">
          <button id="tut-skip" class="btn btn-ghost btn-sm">Skip Briefing</button>
          <div class="tut-nav-group">
            ${this.currentStep > 0 ? '<button id="tut-prev" class="btn btn-secondary btn-sm">Prev</button>' : ''}
            <button id="tut-next" class="btn btn-primary btn-sm">${this.currentStep === TUTORIAL_STEPS.length - 1 ? 'Understood, Commander' : 'Next Step'}</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('tut-next')?.addEventListener('click', () => this.next());
    document.getElementById('tut-prev')?.addEventListener('click', () => this.prev());
    document.getElementById('tut-skip')?.addEventListener('click', () => this.close());
  }
}
