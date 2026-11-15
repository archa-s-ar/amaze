/**
 * AMAZE — Space Mission Engineering Simulator
 * storage.js — LocalStorage persistence and state serialization
 */

const STORAGE_KEY = 'amaze_luna_save_v1';
const SETTINGS_KEY = 'amaze_settings_v1';

export const Storage = {
  /**
   * Check if a saved mission exists
   */
  hasSave() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data !== null;
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
      return false;
    }
  },

  /**
   * Save current mission state
   * @param {Object} state - The full game state
   */
  saveMission(state) {
    try {
      const serialized = JSON.stringify({
        version: '1.0',
        timestamp: Date.now(),
        state: state
      });
      localStorage.setItem(STORAGE_KEY, serialized);
      return true;
    } catch (e) {
      console.error('Failed to save mission:', e);
      return false;
    }
  },

  /**
   * Load saved mission state
   * @returns {Object|null}
   */
  loadMission() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed.state || null;
    } catch (e) {
      console.error('Failed to load mission:', e);
      return null;
    }
  },

  /**
   * Delete current mission save
   */
  clearMission() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      console.error('Failed to clear mission:', e);
      return false;
    }
  },

  /**
   * Save user preferences (audio, tutorial seen, etc.)
   */
  saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  },

  /**
   * Load user preferences
   */
  loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) {
        return {
          soundEnabled: true,
          ambientSound: true,
          tutorialCompleted: false,
          highContrast: false
        };
      }
      return JSON.parse(raw);
    } catch (e) {
      return {
        soundEnabled: true,
        ambientSound: true,
        tutorialCompleted: false,
        highContrast: false
      };
    }
  }
};
