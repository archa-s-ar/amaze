/**
 * AMAZE — Space Mission Engineering Simulator
 * charts.js — Self-contained responsive SVG telemetry charts
 */

export class TelemetryCharts {
  /**
   * Render an SVG multi-line telemetry chart
   * @param {HTMLElement} container 
   * @param {Array<Object>} history - [{ day, oxygen, water, food, energy, crewHealth, integrity, radiation }]
   * @param {string} mode - 'LIFESUPPORT' | 'ENERGY_INTEGRITY' | 'CREW_RADIATION'
   */
  static renderChart(container, history, mode = 'LIFESUPPORT') {
    if (!container) return;
    if (!history || history.length === 0) {
      container.innerHTML = '<div class="chart-empty">NO TELEMETRY RECORDED YET (ADVANCE TO DAY 2)</div>';
      return;
    }

    const width = 640;
    const height = 260;
    const padding = { top: 25, right: 35, bottom: 35, left: 45 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    let series = [];
    if (mode === 'LIFESUPPORT') {
      series = [
        { key: 'oxygen', label: 'Oxygen', color: '#55DDE0', max: 180 },
        { key: 'water', label: 'Water', color: '#78C091', max: 200 },
        { key: 'food', label: 'Food', color: '#FFB547', max: 180 }
      ];
    } else if (mode === 'ENERGY_INTEGRITY') {
      series = [
        { key: 'energy', label: 'Battery Energy', color: '#55DDE0', max: 200 },
        { key: 'integrity', label: 'Hull Integrity %', color: '#78C091', max: 100 },
        { key: 'materials', label: 'Materials', color: '#A7ADB0', max: 200 }
      ];
    } else {
      series = [
        { key: 'crewHealth', label: 'Avg Crew Health %', color: '#78C091', max: 100 },
        { key: 'radiation', label: 'Cum. Radiation (mSv)', color: '#E85D5D', max: 150 }
      ];
    }

    const maxDay = Math.max(30, history[history.length - 1].day);
    const minDay = 1;

    // Scale helpers
    const scaleX = (d) => padding.left + ((d - minDay) / (maxDay - minDay)) * chartW;
    const scaleY = (val, maxVal) => padding.top + chartH - (Math.min(maxVal, Math.max(0, val)) / maxVal) * chartH;

    // Grid lines
    let gridLinesSvg = '';
    for (let i = 0; i <= 4; i++) {
      const yVal = padding.top + (chartH / 4) * i;
      const pct = 100 - i * 25;
      gridLinesSvg += `
        <line x1="${padding.left}" y1="${yVal}" x2="${width - padding.right}" y2="${yVal}" stroke="#243342" stroke-dasharray="3,3" stroke-width="1" />
        <text x="${padding.left - 8}" y="${yVal + 3}" fill="#A7ADB0" font-family="'IBM Plex Mono', monospace" font-size="9" text-anchor="end">${pct}%</text>
      `;
    }

    // X-axis day markers
    let xAxisSvg = '';
    for (let day = 5; day <= maxDay; day += 5) {
      const xVal = scaleX(day);
      xAxisSvg += `
        <line x1="${xVal}" y1="${padding.top}" x2="${xVal}" y2="${padding.top + chartH}" stroke="#1A242F" stroke-width="1" />
        <text x="${xVal}" y="${height - 12}" fill="#A7ADB0" font-family="'IBM Plex Mono', monospace" font-size="9" text-anchor="middle">SOL ${day}</text>
      `;
    }

    // Generate paths for each series
    let seriesSvg = '';
    series.forEach(s => {
      let pathData = '';
      history.forEach((pt, idx) => {
        const x = scaleX(pt.day);
        const y = scaleY(pt[s.key] ?? 0, s.max);
        if (idx === 0) {
          pathData += `M ${x} ${y}`;
        } else {
          pathData += ` L ${x} ${y}`;
        }
      });

      seriesSvg += `
        <path d="${pathData}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      `;

      // Plot data dots
      history.forEach(pt => {
        const x = scaleX(pt.day);
        const y = scaleY(pt[s.key] ?? 0, s.max);
        seriesSvg += `
          <circle cx="${x}" cy="${y}" r="3" fill="${s.color}" stroke="#101820" stroke-width="1.5">
            <title>Sol ${pt.day}: ${s.label} = ${pt[s.key]}</title>
          </circle>
        `;
      });
    });

    // Legend
    let legendSvg = '';
    series.forEach((s, i) => {
      const legX = padding.left + i * 140;
      legendSvg += `
        <rect x="${legX}" y="6" width="10" height="10" fill="${s.color}" rx="2" />
        <text x="${legX + 16}" y="15" fill="#F1EFE8" font-family="'Inter', sans-serif" font-size="11" font-weight="500">${s.label}</text>
      `;
    });

    const svg = `
      <svg viewBox="0 0 ${width} ${height}" class="telemetry-chart-svg" preserveAspectRatio="xMidYMid meet">
        <rect width="${width}" height="${height}" fill="#101820" rx="4" />
        ${legendSvg}
        ${gridLinesSvg}
        ${xAxisSvg}
        ${seriesSvg}
        <!-- Axes -->
        <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + chartH}" stroke="#A7ADB0" stroke-width="1.5" />
        <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${width - padding.right}" y2="${padding.top + chartH}" stroke="#A7ADB0" stroke-width="1.5" />
      </svg>
    `;

    container.innerHTML = svg;
  }
}
