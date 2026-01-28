/* ==========================================
   AT-RISK ACCOUNTS WIDGET LOGIC
   ========================================== */

   const atRiskData = [
    {
        name: "Alpha Corp",
        score: 58,
        metric: "-5.2% Engagement",
        // Combined your bullet points into a clean single line
        risks: "Low CRM feature adoption • No recent support interactions",
        btnText: "Initiate Engagement",
        iconClass: "danger",
        btnClass: "btn-red",
        // Icon: Activity / Pulse (Warning)
        iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`
    },
    {
        name: "Beta Solutions",
        score: 34,
        metric: "-2.1% Payment Rate",
        // Combined your bullet points
        risks: "2 invoices overdue • Unresolved integration errors",
        btnText: "Follow-up Payments",
        iconClass: "danger",
        btnClass: "btn-red",
        // Icon: Alert Triangle
        iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
    }
];

function renderAtRiskItems() {
    const container = document.getElementById('atRiskGrid');
    const badge = document.querySelector('#widget-at-risk .badge-pending');
    
    if (!container) return;

    // Update Badge
    if (badge) {
        badge.textContent = `${atRiskData.length} accounts`;
        // Make badge red to match theme
        badge.style.backgroundColor = '#fef2f2';
        badge.style.color = '#dc2626';
        badge.style.borderColor = '#fecaca';
    }

    let html = '';
    atRiskData.forEach(item => {
        html += `
        <div class="action-item" style="align-items: flex-start;">
            <div class="icon-box ${item.iconClass}" style="margin-top: 2px;">
                ${item.iconSvg}
            </div>
            <div class="action-details">
                <div class="action-title" style="display:flex; align-items:center; gap:8px;">
                    ${item.name} 
                    <span style="font-size:0.75em; background:#fee2e2; color:#b91c1c; padding:1px 6px; border-radius:4px;">Score: ${item.score}</span>
                </div>
                <div class="action-desc" style="font-size: 0.8em; color: #64748b; margin-bottom: 6px; line-height: 1.3;">
                    <span style="color:#dc2626; font-weight:600;">Risk Factors:</span> ${item.risks}
                </div>
                <div class="action-meta">
                    <span style="color: #dc2626; font-weight: 500;">${item.metric}</span>
                </div>
            </div>
            <button class="action-btn ${item.btnClass}" style="margin-top: 2px;">${item.btnText}</button>
        </div>
        `;
    });

    container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    renderAtRiskItems();
});