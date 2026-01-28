/* ==========================================
   GROWTH OPPORTUNITIES WIDGET LOGIC (With Descriptions)
   ========================================== */

   const growthData = {
    upsell: [
        {
            title: "CRM Advanced Feature Upsell",
            // NEW: Added Description
            desc: "Offer advanced CRM features like SalesIQ and workflow automation to high-usage accounts.",
            value: "$150K Opportunity",
            sub: "20/50 clients",
            iconClass: "success", 
            btnClass: "btn-green",
            btnText: "Pitch Upsell",
            iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`
        },
        {
            title: "Zoho One Suite Upgrade",
            // NEW: Added Description
            desc: "Propose Zoho One to 10 clients currently using 3+ standalone apps.",
            value: "$250K Opportunity",
            sub: "10/50 clients",
            iconClass: "purple", 
            btnClass: "btn-blue", 
            btnText: "Upgrade",
            btnStyle: "background-color: #9333ea; border:none;",
            iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`
        },
        {
            title: "Analytics Premium Plan",
            // NEW: Added Description
            desc: "Target 15 clients for an upgrade to Zoho Analytics Premium for deeper insights.",
            value: "$80K Opportunity",
            sub: "15/50 clients",
            iconClass: "info", 
            btnClass: "btn-blue",
            btnText: "Send Quote",
            iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>`
        }
    ],
    cross_sell: [
        {
            title: "Zoho Desk Integration",
            // NEW: Added Description
            desc: "Introduce Zoho Desk to 18 clients who currently lack an integrated support system.",
            value: "$45K Potential",
            sub: "Support usage high",
            iconClass: "warning", 
            btnClass: "btn-amber",
            btnText: "Suggest Desk",
            iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line></svg>`
        },
        {
            title: "Zoho Books Cross-sell",
            // NEW: Added Description
            desc: "Cross-sell Zoho Books to 12 clients currently using other accounting software.",
            value: "$20K Potential",
            sub: "Finance interest",
            iconClass: "purple", 
            btnClass: "btn-blue",
            btnStyle: "background-color: #9333ea; border:none;",
            btnText: "Pitch Books",
            iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`
        },
        {
            title: "Zoho Campaigns",
            // NEW: Added Description
            desc: "Recommend Zoho Campaigns to 15 clients to enhance their marketing automation efforts.",
            value: "$12K Potential",
            sub: "Low engagement",
            iconClass: "info", 
            btnClass: "btn-blue",
            btnText: "Enable Trial",
            iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`
        }
    ]
};

function renderGrowthItems(type) {
    const container = document.getElementById('opportunitiesGrid');
    const badge = document.querySelector('#widget-growth .badge-pending');
    
    if (!container) return;

    // 1. Get data
    const items = growthData[type] || growthData.upsell;
    
    // 2. Update Badge
    if (badge) {
        badge.textContent = `${items.length} identified`;
    }

    // 3. Render HTML
    let html = '';
    items.forEach(item => {
        let valueColor = '#333';
        if(item.iconClass === 'success') valueColor = '#15803d';
        if(item.iconClass === 'purple') valueColor = '#9333ea';
        if(item.iconClass === 'info') valueColor = '#3b82f6';
        if(item.iconClass === 'warning') valueColor = '#d97706';

        html += `
        <div class="action-item" style="align-items: flex-start;">
            <div class="icon-box ${item.iconClass}" style="margin-top: 2px;">
                ${item.iconSvg}
            </div>
            <div class="action-details">
                <div class="action-title">${item.title}</div>
                <div class="action-desc" style="font-size: 0.8em; color: #64748b; margin-bottom: 6px; line-height: 1.3;">${item.desc}</div>
                
                <div class="action-meta">
                    <span style="color: ${valueColor}; font-weight: 600;">${item.value}</span>
                    <span style="margin: 0 6px; color: #cbd5e1;">|</span>
                    <span>${item.sub}</span>
                </div>
            </div>
            <button class="action-btn ${item.btnClass}" style="${item.btnStyle || ''} margin-top: 2px;">${item.btnText}</button>
        </div>
        `;
    });

    container.innerHTML = html;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const filter = document.getElementById('growthOpportunityFilter');
    
    renderGrowthItems('upsell');

    if (filter) {
        filter.addEventListener('change', (e) => {
            let val = e.target.value;
            if(val === 'cross-sell') val = 'cross_sell';
            renderGrowthItems(val);
        });
    }
});