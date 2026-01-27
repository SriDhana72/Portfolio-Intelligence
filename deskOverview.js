// ==========================================
// DESK INTELLIGENCE WIDGET LOGIC
// ==========================================

// 1. Mock Data
const deskData = {
    openTickets: 14,
    revenueRisk: "$85,000",
    volumeTrend: [
        { month: 'May', count: 45 },
        { month: 'Jun', count: 32 },
        { month: 'Jul', count: 28 },
        { month: 'Aug', count: 55 }, 
        { month: 'Sep', count: 30 },
        { month: 'Oct', count: 14 } 
    ],
    topDrivers: [
        { name: "Billing & Invoices", pct: 45 },
        { name: "SSO Login Issues", pct: 30 },
        { name: "Feature Requests", pct: 15 },
        { name: "Other", pct: 10 }
    ],
    criticalTickets: [
        { id: "1024", subject: "Platform Outage", owner: "Sarah J." },
        { id: "1019", subject: "Contract Dispute", owner: "Mike R." }
    ]
};

// 2. Initialization
function initDeskDashboard(data) {
    const openTicketsEl = document.getElementById('deskOpenTicketsCount');
    if(!openTicketsEl) return; 

    // KPI
    openTicketsEl.textContent = data.openTickets;
    document.getElementById('deskRiskValue').textContent = data.revenueRisk;
    
    const riskDetail = data.criticalTickets.length > 0 
        ? `⚠️ ${data.criticalTickets.length} Critical Issues` 
        : "No Immediate Risks";
    document.getElementById('deskRiskDetail').textContent = riskDetail;

    // --- CHART RENDERING ---
    renderDeskChart(data.volumeTrend);

    // --- DRIVERS RENDER (UPDATED LAYOUT) ---
    const driversHTML = data.topDrivers.map(d => `
        <div class="d-driver-row">
            <div class="d-driver-header-flex">
                <span class="d-driver-name">${d.name}</span>
                <span class="d-driver-pct">${d.pct}%</span>
            </div>
            <div class="d-progress-track">
                <div class="d-progress-fill" style="width: ${d.pct}%;"></div>
            </div>
        </div>
    `).join('');
    document.getElementById('deskDriversList').innerHTML = driversHTML;
}

function renderDeskChart(trendData) {
    const chartContainer = document.getElementById('deskTrendChart');
    const counts = trendData.map(d => d.count);
    
    // --- UPDATED DIMENSIONS FOR COMPACT HEIGHT ---
    const w = 600; 
    const h = 130; // Reduced from 180
    const pad = { t: 10, r: 10, b: 20, l: 25 }; // Tighter padding
    // ---------------------------------------------

    const uw = w - pad.l - pad.r; 
    const uh = h - pad.t - pad.b;
    
    const maxVal = Math.ceil(Math.max(...counts) / 10) * 10;
    
    const getY = (v) => pad.t + uh - ((v / maxVal) * uh);
    const getX = (i) => pad.l + (i / (counts.length - 1)) * uw;

    // Grid
    let grid = "";
    const steps = 3;
    for(let i=0; i<=steps; i++) {
        const pct = i / steps;
        const val = Math.round(maxVal * (1 - pct)); 
        const y = pad.t + (uh * pct);
        grid += `<line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" stroke="#F0F0F0" stroke-width="1" />`;
        if (i < steps) {
            grid += `<text x="${pad.l - 6}" y="${y + 4}" font-size="9" fill="#8E8E93" text-anchor="end">${val}</text>`;
        }
    }

    // Path Logic (Unchanged, just uses new Y coordinates)
    const points = trendData.map((d, i) => ({ x: getX(i), y: getY(d.count), label: d.month }));
    let dPath = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i]; const p1 = points[i+1];
        const cx1 = p0.x + (p1.x - p0.x) * 0.5;
        const cx2 = p1.x - (p1.x - p0.x) * 0.5;
        dPath += ` C ${cx1},${p0.y} ${cx2},${p1.y} ${p1.x},${p1.y}`;
    }
    const fillPath = `${dPath} L ${points[points.length-1].x},${pad.t + uh} L ${points[0].x},${pad.t + uh} Z`;

    // Markers (Adjusted text y position)
    let markers = "";
    points.forEach((p, i) => {
        markers += `
            <circle cx="${p.x}" cy="${p.y}" r="4" fill="white" stroke="#007AFF" stroke-width="2"/>
            <circle class="d-chart-point-hit" cx="${p.x}" cy="${p.y}" r="15" fill="transparent" 
                    data-month="${p.label}" data-value="${trendData[i].count}" style="cursor: pointer;"/>
            <text x="${p.x}" y="${h - 5}" font-size="10" fill="#8E8E93" text-anchor="${i===0?'start':(i===points.length-1?'end':'middle')}">${p.label}</text>
        `;
    });

    chartContainer.innerHTML = `
        <div id="deskChartTooltip" class="d-chart-tooltip"></div>
        <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%; height:100%;">
            <defs>
                <linearGradient id="d_g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="rgba(0,122,255,0.15)"/>
                    <stop offset="100%" stop-color="rgba(0,122,255,0)"/>
                </linearGradient>
            </defs>
            ${grid}
            <path d="${fillPath}" fill="url(#d_g1)" />
            <path d="${dPath}" fill="none" stroke="#007AFF" stroke-width="2.5" stroke-linecap="round"/>
            ${markers}
        </svg>
    `;

    // Tooltip Logic
    const tooltip = document.getElementById('deskChartTooltip');
    chartContainer.querySelectorAll('.d-chart-point-hit').forEach(point => {
        point.addEventListener('mouseenter', (e) => {
            const val = point.getAttribute('data-value');
            const month = point.getAttribute('data-month');
            const cx = parseFloat(point.getAttribute('cx'));
            const cy = parseFloat(point.getAttribute('cy'));
            
            const leftPct = (cx / w) * 100;
            const topPct = (cy / h) * 100;

            tooltip.innerHTML = `${month}<br><span style="opacity:0.7; font-weight:400">Tickets:</span> ${val}`;
            tooltip.style.left = `${leftPct}%`;
            tooltip.style.top = `${topPct}%`;
            tooltip.style.opacity = '1';
        });
        point.addEventListener('mouseleave', () => { tooltip.style.opacity = '0'; });
    });
}

// 3. Dropdown Logic
function toggleDeskDropdown() {
    const opts = document.getElementById('deskDeptOptions');
    if(opts) opts.classList.toggle('show');
}

function toggleDeskOption(item) {
    const optsContainer = document.getElementById('deskDeptOptions');
    const options = Array.from(optsContainer.querySelectorAll('.option-item'));
    const allOption = options[0];
    const specificOptions = options.slice(1);
    
    if (item === allOption) {
        item.classList.toggle('selected');
        const isSelected = item.classList.contains('selected');
        specificOptions.forEach(opt => {
            if (isSelected) opt.classList.add('selected');
            else opt.classList.remove('selected');
        });
    } else {
        item.classList.toggle('selected');
        const allSelected = specificOptions.every(opt => opt.classList.contains('selected'));
        if (allSelected) allOption.classList.add('selected');
        else allOption.classList.remove('selected');
    }
    updateDeskTriggerLabel();
}

function updateDeskTriggerLabel() {
    const trigger = document.querySelector('#deskDeptFilter .select-trigger');
    const options = Array.from(document.querySelectorAll('#deskDeptOptions .option-item'));
    const specificOptions = options.slice(1);
    const selectedCount = specificOptions.filter(o => o.classList.contains('selected')).length;
    
    if (selectedCount === specificOptions.length) trigger.innerText = "Dept: All";
    else if (selectedCount === 0) trigger.innerText = "Dept: None";
    else trigger.innerText = `Dept: ${selectedCount} Selected`;
}

function clearDeskFilter(e) {
    e.stopPropagation();
    document.querySelectorAll('#deskDeptOptions .option-item').forEach(opt => opt.classList.remove('selected'));
    updateDeskTriggerLabel();
}

function applyDeskFilter(e) {
    e.stopPropagation();
    document.getElementById('deskDeptOptions').classList.remove('show');
}

// Close on outside click
document.addEventListener('click', function(event) {
    const filter = document.getElementById('deskDeptFilter');
    if (filter && !filter.contains(event.target)) {
        document.getElementById('deskDeptOptions').classList.remove('show');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initDeskDashboard(deskData);
});