/* ==========================================
   ARR ANALYTICS (TRENDS) LOGIC - FINAL VISUAL FIX
   ========================================== */

// --- 1. Mock Data ---
const riData2025 = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    currentARR: [2.5, 2.6, 2.75, 2.9, 3.1, 3.25, 3.4, 3.55, 3.7, 3.9, 4.1, 4.4],
    previousARR: [1.2, 1.25, 1.3, 1.35, 1.4, 1.5, 1.6, 1.65, 1.7, 1.85, 2.1, 2.4],
    gained: [0.15, 0.12, 0.18, 0.17, 0.22, 0.18, 0.19, 0.20, 0.18, 0.25, 0.28, 0.35],
    lost: [0.02, 0.02, 0.03, 0.02, 0.02, 0.03, 0.04, 0.05, 0.03, 0.05, 0.08, 0.05],
    cancelled: [0.01, 0.01, 0.02, 0.01, 0.01, 0.02, 0.02, 0.03, 0.02, 0.03, 0.05, 0.03],
    target: [0.12, 0.14, 0.15, 0.15, 0.18, 0.18, 0.16, 0.16, 0.18, 0.20, 0.22, 0.28],
    get stability() { return this.gained.map((g, i) => g - this.lost[i]); }
};

const riData2024 = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    currentARR: [1.2, 1.25, 1.3, 1.35, 1.4, 1.5, 1.6, 1.65, 1.7, 1.85, 2.1, 2.4],
    previousARR: [0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.5],
    gained: [0.05, 0.06, 0.08, 0.07, 0.1, 0.15, 0.12, 0.08, 0.09, 0.2, 0.3, 0.35],
    lost: [0.01, 0.02, 0.01, 0.02, 0.05, 0.02, 0.02, 0.03, 0.01, 0.05, 0.02, 0.04],
    cancelled: [0.005, 0.01, 0.005, 0.01, 0.02, 0.01, 0.01, 0.02, 0.005, 0.02, 0.01, 0.02],
    target: [0.05, 0.05, 0.08, 0.08, 0.09, 0.10, 0.10, 0.08, 0.09, 0.15, 0.25, 0.30],
    get stability() { return this.gained.map((g, i) => g - this.lost[i]); }
};

let riActiveData = riData2025;

// --- 2. Canvas Helpers ---
function setupRiCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if(!canvas) return null;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const wrapper = canvas.parentElement;
    const rect = wrapper.getBoundingClientRect();
    
    if(rect.width === 0 || rect.height === 0) return null;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.resetTransform();
    ctx.scale(dpr, dpr);
    return { canvas, ctx, width: rect.width, height: rect.height };
}

// Layout Constants
const CHART_PADDING_TOP = 20;
const CHART_PADDING_BOTTOM = 30; 
const CHART_PADDING_LEFT = 50;   
const CHART_PADDING_RIGHT = 10;

function getRiY(val, max, height) {
    const chartHeight = height - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;
    return (height - CHART_PADDING_BOTTOM) - (val / max) * chartHeight;
}

function getRiYflux(val, max, min, height) {
    const chartHeight = height - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;
    const range = max - min;
    if(range === 0) return height - CHART_PADDING_BOTTOM;
    const pxPerUnit = chartHeight / range;
    return (height - CHART_PADDING_BOTTOM) - ((val - min) * pxPerUnit);
}

function getRiX(index, total, width) {
    const chartWidth = width - CHART_PADDING_LEFT - CHART_PADDING_RIGHT;
    return CHART_PADDING_LEFT + (index / (total - 1)) * chartWidth;
}

function drawRiSmoothCurve(ctx, dataPoints, width, height, maxVal, minVal = 0, isFlux = false) {
    if (dataPoints.length === 0) return;
    ctx.beginPath();
    const getLocY = (v) => isFlux ? getRiYflux(v, maxVal, minVal, height) : getRiY(v, maxVal, height);

    let x0 = getRiX(0, dataPoints.length, width);
    let y0 = getLocY(dataPoints[0]);
    ctx.moveTo(x0, y0);
    for (let i = 0; i < dataPoints.length - 1; i++) {
        const x1 = getRiX(i, dataPoints.length, width);
        const y1 = getLocY(dataPoints[i]);
        const x2 = getRiX(i + 1, dataPoints.length, width);
        const y2 = getLocY(dataPoints[i + 1]);
        
        const cp1x = x1 + (x2 - x1) / 2;
        const cp1y = y1;
        const cp2x = x1 + (x2 - x1) / 2;
        const cp2y = y2;
        
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
    }
}

// --- 3. Chart Drawing Functions ---

// FRONT FACE
function drawRiMainChart(data) {
    const setup = setupRiCanvas('riMainChart');
    if(!setup) return;
    const { canvas, ctx, width, height } = setup;
    
    const maxVal = Math.ceil(Math.max(...data.currentARR, ...data.previousARR) * 1.1); 

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#9ca3af';
    ctx.font = '500 11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const gridSteps = 5;
    for(let i=0; i <= gridSteps; i++) {
        const val = (maxVal / gridSteps) * i;
        const y = getRiY(val, maxVal, height);
        
        ctx.beginPath();
        ctx.moveTo(CHART_PADDING_LEFT, y);
        ctx.lineTo(width - CHART_PADDING_RIGHT, y);
        ctx.stroke();

        ctx.fillText('$' + val.toFixed(1) + 'M', CHART_PADDING_LEFT - 10, y);
    }

    ctx.save();
    ctx.strokeStyle = '#d1d5db'; 
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    drawRiSmoothCurve(ctx, data.previousARR, width, height, maxVal);
    ctx.stroke();
    ctx.restore();

    const gradient = ctx.createLinearGradient(0, CHART_PADDING_TOP, 0, height - CHART_PADDING_BOTTOM);
    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.15)'); 
    gradient.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

    ctx.beginPath(); 
    drawRiSmoothCurve(ctx, data.currentARR, width, height, maxVal);
    ctx.lineTo(getRiX(data.currentARR.length - 1, data.currentARR.length, width), height - CHART_PADDING_BOTTOM);
    ctx.lineTo(getRiX(0, data.currentARR.length, width), height - CHART_PADDING_BOTTOM);
    ctx.fillStyle = gradient; 
    ctx.fill();

    ctx.strokeStyle = '#2563eb'; 
    ctx.lineWidth = 3; 
    ctx.lineCap = 'round';
    drawRiSmoothCurve(ctx, data.currentARR, width, height, maxVal);
    ctx.stroke();

    const lastIdx = data.currentARR.length - 1;
    const lx = getRiX(lastIdx, data.currentARR.length, width);
    const ly = getRiY(data.currentARR[lastIdx], maxVal, height);
    
    ctx.beginPath(); ctx.arc(lx, ly, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill(); 
    ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 3; ctx.stroke();

    ctx.fillStyle = '#6b7280'; 
    ctx.textAlign = 'center'; 
    ctx.textBaseline = 'top';
    ctx.font = '500 11px Inter';
    
    data.labels.forEach((label, i) => {
        const x = getRiX(i, data.labels.length, width);
        ctx.fillText(label, x, height - CHART_PADDING_BOTTOM + 10);
    });

    attachTooltip(canvas, data, width, height, maxVal, 0, false);
}

// BACK FACE (UPDATED: Thinner Bars, More Spacing)
function drawRiStabilityChart(data) {
    const setup = setupRiCanvas('riStabilityChart');
    if(!setup) return;
    const { canvas, ctx, width, height } = setup;

    const maxGain = Math.max(...data.gained, ...data.target) * 1.3;
    const maxLoss = Math.max(...data.lost);
    const absMax = Math.max(maxGain, maxLoss) * 1.1;
    const minVal = -absMax * 0.5;
    const maxVal = absMax;
    const yZero = getRiYflux(0, maxVal, minVal, height);

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#f3f4f6'; ctx.lineWidth = 1;
    ctx.fillStyle = '#9ca3af'; ctx.font = '500 10px Inter'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    
    // Zero line
    ctx.save(); 
    ctx.strokeStyle = '#d1d5db'; 
    ctx.beginPath(); 
    ctx.moveTo(CHART_PADDING_LEFT, yZero); 
    ctx.lineTo(width-CHART_PADDING_RIGHT, yZero); 
    ctx.stroke(); 
    ctx.restore();

    // --- UPDATED BAR CALCULATION ---
    // Factor 0.2 ensures distinct separate bars (20% of slot on left + 20% on right = 40% total width)
    const barHalfWidth = ((width - CHART_PADDING_LEFT - CHART_PADDING_RIGHT) / data.labels.length) * 0.2;

    data.labels.forEach((label, i) => {
        const centerX = getRiX(i, data.labels.length, width);
        
        // Gain Bar (Green)
        const yGain = getRiYflux(data.gained[i], maxVal, minVal, height);
        const hGain = yZero - yGain;
        if(hGain > 0) {
            ctx.fillStyle = '#10b981'; 
            ctx.beginPath(); 
            // x, y, width, height, radii
            ctx.roundRect(centerX - barHalfWidth, yGain, barHalfWidth * 2, hGain, [4, 4, 0, 0]); 
            ctx.fill();
        }

        // Loss Bar (Red)
        const yLoss = getRiYflux(-data.lost[i], maxVal, minVal, height);
        const hLoss = yLoss - yZero;
        if(hLoss > 0) {
            ctx.fillStyle = '#ef4444'; 
            ctx.beginPath(); 
            ctx.roundRect(centerX - barHalfWidth, yZero, barHalfWidth * 2, hLoss, [0, 0, 4, 4]); 
            ctx.fill();
        }

        ctx.fillStyle = '#6b7280'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(label, centerX, height - CHART_PADDING_BOTTOM + 10);
    });

    // Target Line
    ctx.save();
    ctx.strokeStyle = '#374151'; 
    ctx.lineWidth = 2; 
    ctx.setLineDash([5, 5]); 
    drawRiSmoothCurve(ctx, data.target, width, height, maxVal, minVal, true);
    ctx.stroke();
    ctx.restore();

    // Cancelled Line
    ctx.save();
    ctx.strokeStyle = '#f97316'; 
    ctx.lineWidth = 2; 
    ctx.setLineDash([]);
    const cancelledNegative = data.cancelled.map(v => -v); 
    drawRiSmoothCurve(ctx, cancelledNegative, width, height, maxVal, minVal, true);
    ctx.stroke();
    ctx.restore();

    // Net Stability
    ctx.save();
    ctx.strokeStyle = '#3b82f6'; 
    ctx.lineWidth = 3; 
    ctx.setLineDash([1, 6]); // Increased spacing for dots
    ctx.lineCap = 'round';   
    drawRiSmoothCurve(ctx, data.stability, width, height, maxVal, minVal, true);
    ctx.stroke();
    ctx.restore();

    attachTooltip(canvas, data, width, height, maxVal, minVal, true);
}

// --- Tooltip ---
function attachTooltip(canvas, data, width, height, maxVal, minVal, isFlux) {
    canvas.onmousemove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const chartWidth = width - CHART_PADDING_LEFT - CHART_PADDING_RIGHT;
        const index = Math.round(((mouseX - CHART_PADDING_LEFT) / chartWidth) * (data.labels.length - 1));
        
        if (index >= 0 && index < data.labels.length) {
            const tooltip = document.getElementById('ri-tooltip');
            tooltip.style.left = e.clientX + 'px';
            tooltip.style.top = e.clientY + 'px';
            tooltip.style.opacity = 1;

            if(isFlux) {
                const net = (data.gained[index] - data.lost[index]).toFixed(2);
                tooltip.innerHTML = `<strong>${data.labels[index]}</strong>
                    <div class="ri-tooltip-row"><span style="color:#374151">Target</span><b>$${data.target[index].toFixed(2)}M</b></div>
                    <div class="ri-tooltip-row"><span style="color:#10b981">Gain</span><span>+$${data.gained[index].toFixed(2)}M</span></div>
                    <div class="ri-tooltip-row"><span style="color:#ef4444">Loss</span><span>-$${data.lost[index].toFixed(2)}M</span></div>
                    <div class="ri-tooltip-row"><span style="color:#f97316">Cancelled</span><span>-$${data.cancelled[index].toFixed(2)}M</span></div>
                    <div class="ri-tooltip-row" style="border-top:1px solid #eee; margin-top:4px; padding-top:4px;"><span style="color:#3b82f6">Net</span><span>$${net}M</span></div>`;
            } else {
                 tooltip.innerHTML = `<strong>${data.labels[index]}</strong>
                    <div class="ri-tooltip-row"><span style="color:#2563eb">Current</span><b>$${data.currentARR[index].toFixed(2)}M</b></div>
                    <div class="ri-tooltip-row"><span style="color:#999">Prev</span><span>$${data.previousARR[index].toFixed(2)}M</span></div>`;
            }
        }
    };
    canvas.onmouseleave = () => { document.getElementById('ri-tooltip').style.opacity = 0; };
}

// --- 4. Controls ---
function updateRiCharts() {
    requestAnimationFrame(() => {
        drawRiMainChart(riActiveData);
        drawRiStabilityChart(riActiveData);
    });
}

function handleRiYearChange(val) {
    // Show/Hide Custom Date Inputs
    const rangeDiv = document.getElementById('riCustomDateRange');
    if (rangeDiv) {
        rangeDiv.style.display = (val === 'custom') ? 'flex' : 'none';
    }

    if(val === '2025') {
        riActiveData = riData2025;
        updateRiCharts();
    }
    else if(val === '2024') {
        riActiveData = riData2024;
        updateRiCharts();
    }
    // If custom, we wait for the date pickers to trigger setRiCustomRange()
}

function toggleRiGraphView() {
    const flipper = document.getElementById('riCardFlipper');
    const btn = document.getElementById('riFlipBtn');
    flipper.classList.toggle('is-flipped');
    btn.classList.toggle('active');
    const span = btn.querySelector('span');
    span.textContent = flipper.classList.contains('is-flipped') ? "View Trajectory" : "View Flux";
}

window.addEventListener('load', () => { setTimeout(updateRiCharts, 500); });
window.addEventListener('resize', updateRiCharts);