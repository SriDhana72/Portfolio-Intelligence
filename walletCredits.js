// ==========================================
// WALLET CREDITS 
// ==========================================

// 1. Mock Data
const walletData = {
    balance: 24500,
    currency: "Credits",
    monthlyBurn: 3200,
    runwayMonths: 7.5,
    
    // Chart Data (Consumption)
    usageTrend: [
        { month: 'Aug', value: 2100 },
        { month: 'Sep', value: 2400 },
        { month: 'Oct', value: 1800 },
        { month: 'Nov', value: 2900 },
        { month: 'Dec', value: 3500 }, // Peak
        { month: 'Jan', value: 3200 }
    ],

    // Recent Transactions
    transactions: [
        { id: 1, type: "usage", title: "API Usage: Bulk Export", date: "Today", amount: -450, icon: "⚡" },
        { id: 2, type: "usage", title: "Monthly Subscription", date: "Jan 01", amount: -2500, icon: "📅" },
        { id: 3, type: "topup", title: "Auto-Topup", date: "Dec 28", amount: +10000, icon: "💰" },
        { id: 4, type: "usage", title: "Support Add-on", date: "Dec 15", amount: -250, icon: "🎧" }
    ]
};

// 2. Init Function
function initWalletWidget(data) {
    const balanceEl = document.getElementById('balanceValue');
    if(balanceEl) balanceEl.textContent = data.balance.toLocaleString();

// Render Chart (Bar Chart for Usage)
const chartContainer = document.getElementById('usageChart');
if(chartContainer) {
    const vals = data.usageTrend.map(d => d.value);
    const maxVal = Math.max(...vals) * 1.2;
    
    // --- UPDATED DIMENSIONS FOR COMPACT HEIGHT ---
    const w = 500; 
    const h = 130; // Reduced from 180
    const pad = { t: 10, r: 0, b: 20, l: 30 }; // Tighter padding
    // ---------------------------------------------
    
    const uw = w - pad.l - pad.r; 
    const uh = h - pad.t - pad.b;
    const barWidth = 24; 

    // Grid
    let grid = "";
    [0, 0.5, 1].forEach(pct => {
        const y = pad.t + (uh * pct);
        const val = Math.round(maxVal * (1-pct));
        grid += `<line x1="${pad.l}" y1="${y}" x2="${w}" y2="${y}" stroke="#F0F0F0" stroke-width="1" />`;
        grid += `<text x="${pad.l - 8}" y="${y + 4}" font-size="9" fill="#8E8E93" text-anchor="end">${val >= 1000 ? (val/1000).toFixed(1) + 'k' : val}</text>`;
    });

    // Bars
    let bars = "";
    const numBars = data.usageTrend.length;
    const gap = (uw - (numBars * barWidth)) / (numBars + 1);

    data.usageTrend.forEach((d, i) => {
        const x = pad.l + gap + (i * (barWidth + gap));
        const barH = (d.value / maxVal) * uh;
        const y = pad.t + uh - barH;
        
        bars += `
            <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="3" ry="3" fill="#AF52DE" opacity="0.85" />
            <text x="${x + barWidth/2}" y="${h - 5}" font-size="10" fill="#8E8E93" text-anchor="middle">${d.month}</text>
        `;
    });

    chartContainer.innerHTML = `
        <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%; height:100%;">
            ${grid}
            ${bars}
        </svg>
    `;
}

    // Render List
    const listContainer = document.getElementById('transactionList');
    if(listContainer) {
        listContainer.innerHTML = data.transactions.map(t => {
            const isPos = t.amount > 0;
            const colorClass = isPos ? 'positive' : 'negative';
            const sign = isPos ? '+' : '';
            
            return `
                <div class="usage-item">
                    <div class="usage-info">
                        <div class="usage-icon">${t.icon}</div>
                        <div class="usage-details">
                            <h4>${t.title}</h4>
                            <span>${t.date}</span>
                        </div>
                    </div>
                    <div class="usage-amount ${colorClass}">
                        ${sign}${Math.abs(t.amount).toLocaleString()}
                    </div>
                </div>
            `;
        }).join('');
    }
}

// 3. Auto-load on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initWalletWidget(walletData);
});