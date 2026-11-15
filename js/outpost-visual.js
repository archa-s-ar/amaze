/**
 * AMAZE — Space Mission Engineering Simulator
 * outpost-visual.js — Interactive Lunar Outpost Vector Schematic & Animated Module Map
 */

export class OutpostVisualizer {
  constructor(containerId, onSelectFacility) {
    this.container = document.getElementById(containerId);
    this.onSelectFacility = onSelectFacility;
    this.init();
  }

  init() {
    if (!this.container) return;
    this.container.innerHTML = this.getOutpostSvg();
    this.bindEvents();
  }

  getOutpostSvg() {
    return `
      <svg viewBox="0 0 960 480" class="outpost-svg" preserveAspectRatio="xMidYMid meet" id="outpost-map-svg">
        <defs>
          <!-- Stars & Background Glow -->
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#080D12" />
            <stop offset="70%" stop-color="#101820" />
            <stop offset="100%" stop-color="#16202A" />
          </linearGradient>

          <linearGradient id="lunarSurfaceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#243342" />
            <stop offset="25%" stop-color="#1C2733" />
            <stop offset="100%" stop-color="#121A22" />
          </linearGradient>

          <linearGradient id="domeGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#55DDE0" stop-opacity="0.25" />
            <stop offset="100%" stop-color="#55DDE0" stop-opacity="0.05" />
          </linearGradient>

          <linearGradient id="greenhouseGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#78C091" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#78C091" stop-opacity="0.08" />
          </linearGradient>

          <linearGradient id="solarGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#55DDE0" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#247B7D" stop-opacity="0.9" />
          </linearGradient>

          <!-- Module Drop Shadow -->
          <filter id="moduleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#55DDE0" flood-opacity="0.3" />
          </filter>
        </defs>

        <!-- Deep Lunar Sky -->
        <rect x="0" y="0" width="960" height="480" fill="url(#skyGrad)" />

        <!-- Starfield -->
        <g class="starfield" fill="#F1EFE8" opacity="0.6">
          <circle cx="45" cy="35" r="1" />
          <circle cx="95" cy="85" r="1.5" opacity="0.8" />
          <circle cx="160" cy="40" r="1" />
          <circle cx="240" cy="95" r="0.8" />
          <circle cx="310" cy="30" r="1.2" />
          <circle cx="420" cy="70" r="1" />
          <circle cx="510" cy="45" r="1.5" opacity="0.9" />
          <circle cx="620" cy="80" r="0.8" />
          <circle cx="710" cy="35" r="1.2" />
          <circle cx="830" cy="65" r="1" />
          <circle cx="890" cy="30" r="1.5" />
          <circle cx="930" cy="95" r="0.8" />
          <circle cx="780" cy="110" r="1" />
          <circle cx="120" cy="120" r="0.7" />
        </g>

        <!-- Earth in distance (384,400 km) -->
        <g class="earth-globe" transform="translate(830, 70)">
          <circle cx="0" cy="0" r="28" fill="#1A535C" />
          <!-- Continents -->
          <path d="M-12,-18 Q-5,-10 -8,-2 Q-10,8 -4,15 Q-14,12 -18,2 Z" fill="#78C091" opacity="0.8" />
          <path d="M4,-22 Q12,-14 8,-2 Q5,6 15,10 Q18,-5 12,-18 Z" fill="#78C091" opacity="0.8" />
          <!-- Cloud swirls -->
          <path d="M-22,-8 Q-10,-14 6,-10 Q20,-8 22,-2" stroke="#F1EFE8" stroke-width="2" fill="none" opacity="0.6" stroke-linecap="round" />
          <path d="M-15,10 Q2,6 18,12" stroke="#F1EFE8" stroke-width="2" fill="none" opacity="0.5" stroke-linecap="round" />
          <!-- Atmosphere rim -->
          <circle cx="0" cy="0" r="28" fill="none" stroke="#55DDE0" stroke-width="1.5" opacity="0.5" />
          <text x="0" y="42" fill="#A7ADB0" font-family="'IBM Plex Mono', monospace" font-size="8" text-anchor="middle" letter-spacing="1">EARTH 384,400 KM</text>
        </g>

        <!-- Distant Crater Mountains (Shackleton Rim) -->
        <path d="M0,230 L110,180 L230,220 L380,165 L520,210 L680,155 L820,200 L960,170 L960,480 L0,480 Z" fill="#151E27" />
        <path d="M0,260 L90,225 L210,250 L340,215 L480,245 L620,205 L770,240 L960,215 L960,480 L0,480 Z" fill="#1C2733" />
        
        <!-- Foreground Lunar Surface -->
        <path d="M0,290 C220,275 420,295 620,280 C780,268 890,285 960,275 L960,480 L0,480 Z" fill="url(#lunarSurfaceGrad)" />

        <!-- Craters & Surface Boulders -->
        <ellipse cx="140" cy="380" rx="45" ry="12" fill="#121A22" stroke="#243342" stroke-width="1.5" />
        <ellipse cx="790" cy="410" rx="60" ry="15" fill="#121A22" stroke="#243342" stroke-width="1.5" />
        <ellipse cx="490" cy="445" rx="35" ry="9" fill="#121A22" stroke="#243342" stroke-width="1" />

        <!-- Pressurized Connecting Corridors / Hab Transit Tubes -->
        <g class="corridors" stroke="#3A4D5F" stroke-width="8" stroke-linecap="round" fill="none">
          <!-- Solar to Battery -->
          <line x1="160" y1="260" x2="280" y2="300" stroke="#FFB547" stroke-width="3" stroke-dasharray="4,4" />
          <!-- Battery to ECLSS -->
          <line x1="280" y1="300" x2="380" y2="290" />
          <!-- ECLSS to Central Hab -->
          <line x1="380" y1="290" x2="480" y2="300" />
          <!-- Central Hab to Greenhouse -->
          <line x1="480" y1="300" x2="610" y2="310" />
          <!-- Central Hab to Water Recovery -->
          <line x1="480" y1="300" x2="440" y2="370" />
          <!-- Central Hab to Repair Station -->
          <line x1="480" y1="300" x2="570" y2="380" />
          <!-- Central Hab to Radiation Bunker -->
          <line x1="480" y1="300" x2="730" y2="320" />
        </g>

        <!-- ==================== FACILITY MODULES ==================== -->

        <!-- 1. POLAR SOLAR ARRAY (Left Ridge) -->
        <g class="facility-node" id="node-solarArray" data-facility="solarArray" cursor="pointer" transform="translate(130, 180)">
          <!-- Mast -->
          <line x1="30" y1="90" x2="30" y2="35" stroke="#A7ADB0" stroke-width="4" />
          <!-- Tracking Pivot -->
          <circle cx="30" cy="35" r="5" fill="#F1EFE8" />
          <!-- Solar Panel Wings -->
          <polygon points="5,15 55,20 50,45 0,40" fill="url(#solarGlow)" stroke="#55DDE0" stroke-width="1.5" />
          <polygon points="10,5 60,10 55,18 5,14" fill="#243342" stroke="#55DDE0" stroke-width="1" />
          <!-- Base foundation -->
          <rect x="15" y="85" width="30" height="8" fill="#243342" rx="2" />
          <!-- Badge -->
          <rect x="0" y="98" width="60" height="18" fill="#101820" stroke="#55DDE0" stroke-width="1" rx="3" />
          <text x="30" y="110" fill="#F1EFE8" font-family="'IBM Plex Mono', monospace" font-size="8" font-weight="600" text-anchor="middle">SOLAR</text>
          <circle cx="53" cy="107" r="3" fill="#78C091" id="dot-solarArray" />
        </g>

        <!-- 2. AUXILIARY BATTERY BANK (Cryo Storage) -->
        <g class="facility-node" id="node-batterySystem" data-facility="batterySystem" cursor="pointer" transform="translate(250, 260)">
          <!-- Tanks & Cells -->
          <rect x="0" y="15" width="22" height="32" rx="4" fill="#1C2733" stroke="#55DDE0" stroke-width="1.5" />
          <rect x="26" y="15" width="22" height="32" rx="4" fill="#1C2733" stroke="#55DDE0" stroke-width="1.5" />
          <rect x="7" y="8" width="8" height="7" fill="#FFB547" rx="1" />
          <rect x="33" y="8" width="8" height="7" fill="#FFB547" rx="1" />
          <!-- Status LED bars -->
          <line x1="5" y1="25" x2="17" y2="25" stroke="#55DDE0" stroke-width="2" />
          <line x1="5" y1="32" x2="17" y2="32" stroke="#55DDE0" stroke-width="2" />
          <line x1="31" y1="25" x2="43" y2="25" stroke="#55DDE0" stroke-width="2" />
          <line x1="31" y1="32" x2="43" y2="32" stroke="#55DDE0" stroke-width="2" />
          <!-- Badge -->
          <rect x="-4" y="52" width="56" height="18" fill="#101820" stroke="#55DDE0" stroke-width="1" rx="3" />
          <text x="24" y="64" fill="#F1EFE8" font-family="'IBM Plex Mono', monospace" font-size="8" font-weight="600" text-anchor="middle">BATTERY</text>
          <circle cx="45" cy="61" r="3" fill="#78C091" id="dot-batterySystem" />
        </g>

        <!-- 3. ECLSS LIFE SUPPORT STATION -->
        <g class="facility-node" id="node-lifeSupport" data-facility="lifeSupport" cursor="pointer" transform="translate(350, 245)">
          <!-- Scrubbing Towers -->
          <rect x="5" y="10" width="16" height="38" rx="3" fill="#243342" stroke="#55DDE0" stroke-width="1.5" />
          <rect x="25" y="5" width="18" height="43" rx="3" fill="#1C2733" stroke="#55DDE0" stroke-width="1.5" />
          <!-- Radiator Loop -->
          <path d="M13,10 L13,2 L34,2 L34,5" stroke="#55DDE0" stroke-width="2" fill="none" />
          <circle cx="34" cy="22" r="4" fill="#55DDE0" opacity="0.8" />
          <!-- Badge -->
          <rect x="-2" y="55" width="52" height="18" fill="#101820" stroke="#55DDE0" stroke-width="1" rx="3" />
          <text x="24" y="67" fill="#F1EFE8" font-family="'IBM Plex Mono', monospace" font-size="8" font-weight="600" text-anchor="middle">ECLSS</text>
          <circle cx="43" cy="64" r="3" fill="#78C091" id="dot-lifeSupport" />
        </g>

        <!-- 4. CENTRAL HABITAT COMMAND DOME -->
        <g class="facility-node habitat-core" transform="translate(435, 230)">
          <!-- Outer Dome Pressure Vessel -->
          <path d="M0,55 A45,45 0 0,1 90,55 Z" fill="url(#domeGlow)" stroke="#F1EFE8" stroke-width="2" />
          <path d="M12,55 A35,35 0 0,1 78,55 Z" fill="#1A242F" opacity="0.6" />
          <!-- Window Porch -->
          <rect x="36" y="28" width="18" height="10" rx="3" fill="#55DDE0" opacity="0.9" />
          <!-- Foundation -->
          <rect x="-5" y="55" width="100" height="12" fill="#243342" rx="3" />
          <!-- Comms Dish -->
          <line x1="45" y1="10" x2="45" y2="2" stroke="#A7ADB0" stroke-width="2" />
          <path d="M35,2 Q45,-4 55,2" stroke="#F1EFE8" stroke-width="2" fill="none" />
          <!-- Label -->
          <rect x="10" y="70" width="70" height="18" fill="#101820" stroke="#F1EFE8" stroke-width="1" rx="3" />
          <text x="45" y="82" fill="#F1EFE8" font-family="'IBM Plex Mono', monospace" font-size="8" font-weight="700" text-anchor="middle">HAB-ALPHA</text>
        </g>

        <!-- 5. WATER RECOVERY SYSTEM (Below Hab) -->
        <g class="facility-node" id="node-waterRecovery" data-facility="waterRecovery" cursor="pointer" transform="translate(390, 340)">
          <!-- VCD Centrifuge Drum -->
          <circle cx="25" cy="20" r="16" fill="#1C2733" stroke="#55DDE0" stroke-width="1.5" />
          <circle cx="25" cy="20" r="8" fill="#121A22" stroke="#78C091" stroke-width="1.5" />
          <!-- Recycling Pipes -->
          <path d="M9,20 C9,10 41,10 41,20" stroke="#78C091" stroke-width="2" fill="none" />
          <!-- Badge -->
          <rect x="-2" y="42" width="54" height="18" fill="#101820" stroke="#55DDE0" stroke-width="1" rx="3" />
          <text x="25" y="54" fill="#F1EFE8" font-family="'IBM Plex Mono', monospace" font-size="8" font-weight="600" text-anchor="middle">H2O RECV</text>
          <circle cx="45" cy="51" r="3" fill="#78C091" id="dot-waterRecovery" />
        </g>

        <!-- 6. LUNAR GREENHOUSE BIO-DOME -->
        <g class="facility-node" id="node-greenhouse" data-facility="greenhouse" cursor="pointer" transform="translate(565, 250)">
          <!-- Translucent Dome -->
          <path d="M5,45 A38,38 0 0,1 81,45 Z" fill="url(#greenhouseGlow)" stroke="#78C091" stroke-width="2" />
          <!-- Hydroponic Vertical Racks Inside -->
          <line x1="25" y1="45" x2="25" y2="25" stroke="#78C091" stroke-width="3" />
          <line x1="43" y1="45" x2="43" y2="18" stroke="#78C091" stroke-width="3" />
          <line x1="61" y1="45" x2="61" y2="25" stroke="#78C091" stroke-width="3" />
          <!-- Plant tray leaves -->
          <circle cx="25" cy="22" r="4" fill="#78C091" />
          <circle cx="43" cy="15" r="5" fill="#78C091" />
          <circle cx="61" cy="22" r="4" fill="#78C091" />
          <!-- Base -->
          <rect x="0" y="45" width="86" height="8" fill="#243342" rx="2" />
          <!-- Badge -->
          <rect x="10" y="58" width="66" height="18" fill="#101820" stroke="#78C091" stroke-width="1" rx="3" />
          <text x="43" y="70" fill="#F1EFE8" font-family="'IBM Plex Mono', monospace" font-size="8" font-weight="600" text-anchor="middle">BIO-DOME</text>
          <circle cx="68" cy="67" r="3" fill="#78C091" id="dot-greenhouse" />
        </g>

        <!-- 7. REPAIR STATION & AIRLOCK -->
        <g class="facility-node" id="node-repairStation" data-facility="repairStation" cursor="pointer" transform="translate(540, 350)">
          <!-- Workshop Bay -->
          <rect x="5" y="10" width="45" height="26" rx="3" fill="#1C2733" stroke="#A7ADB0" stroke-width="1.5" />
          <!-- Robotic Arm / Crane -->
          <line x1="12" y1="10" x2="25" y2="-2" stroke="#FFB547" stroke-width="2.5" />
          <line x1="25" y1="-2" x2="38" y2="5" stroke="#FFB547" stroke-width="2" />
          <circle cx="38" cy="5" r="2.5" fill="#F1EFE8" />
          <!-- Airlock hatch -->
          <circle cx="40" cy="23" r="6" fill="#243342" stroke="#F1EFE8" stroke-width="1" />
          <!-- Badge -->
          <rect x="-2" y="40" width="58" height="18" fill="#101820" stroke="#55DDE0" stroke-width="1" rx="3" />
          <text x="27" y="52" fill="#F1EFE8" font-family="'IBM Plex Mono', monospace" font-size="8" font-weight="600" text-anchor="middle">REPAIR BAY</text>
          <circle cx="48" cy="49" r="3" fill="#78C091" id="dot-repairStation" />
        </g>

        <!-- 8. REGOLITH RADIATION SHELTER (Bunker) -->
        <g class="facility-node" id="node-radiationShelter" data-facility="radiationShelter" cursor="pointer" transform="translate(685, 275)">
          <!-- Regolith Mound / Berm -->
          <path d="M0,45 Q40,5 80,45 Z" fill="#243342" stroke="#55DDE0" stroke-width="1.5" />
          <!-- Reinforced Shielded Airlock Portal -->
          <rect x="26" y="24" width="28" height="21" rx="2" fill="#121A22" stroke="#FFB547" stroke-width="1.5" />
          <line x1="40" y1="24" x2="40" y2="45" stroke="#FFB547" stroke-width="1" />
          <!-- Shield Indicator lines -->
          <path d="M15,18 Q40,0 65,18" stroke="#55DDE0" stroke-width="1.5" stroke-dasharray="3,3" fill="none" opacity="0.8" />
          <!-- Badge -->
          <rect x="12" y="52" width="56" height="18" fill="#101820" stroke="#55DDE0" stroke-width="1" rx="3" />
          <text x="40" y="64" fill="#F1EFE8" font-family="'IBM Plex Mono', monospace" font-size="8" font-weight="600" text-anchor="middle">SHELTER</text>
          <circle cx="61" cy="61" r="3" fill="#78C091" id="dot-radiationShelter" />
        </g>
      </svg>
    `;
  }

  bindEvents() {
    const nodes = this.container.querySelectorAll('.facility-node[data-facility]');
    nodes.forEach(node => {
      node.addEventListener('click', (e) => {
        const facId = node.getAttribute('data-facility');
        if (this.onSelectFacility) {
          this.onSelectFacility(facId);
        }
      });
    });
  }

  /**
   * Update visual status indicators on modules (green, amber, red status dots, dust overlay, etc.)
   */
  updateTelemetry(infrastructure) {
    if (!infrastructure) return;

    Object.keys(infrastructure.facilities).forEach(facId => {
      const fac = infrastructure.facilities[facId];
      const dot = document.getElementById(`dot-${facId}`);
      if (dot) {
        if (fac.health < 40 || (facId === 'solarArray' && fac.dustAccumulation > 50)) {
          dot.setAttribute('fill', '#E85D5D'); // Emergency Red
        } else if (fac.health < 75 || (facId === 'solarArray' && fac.dustAccumulation > 20)) {
          dot.setAttribute('fill', '#FFB547'); // Mission Amber
        } else {
          dot.setAttribute('fill', '#78C091'); // Success Green
        }
      }
    });
  }
}
