// Renewals Widget Logic (With Year Support)

// 1. Data Store (Nested by Region -> Year)
const renewalWidgetData = {
    'Global': {
        '2024': { target: 28000000, renewed: 23000000, cancelled: 3000000, growth: 2.1, topReason: 'Budget Cuts' },
        '2025': { target: 30000000, renewed: 24600000, cancelled: 4050000, growth: 3.0, topReason: 'Pricing' },
        '2026': { target: 35000000, renewed: 21000000, cancelled: 1500000, growth: 1.5, topReason: 'Merger/Acquisition' }
    },
    'APAC': {
        '2024': { target: 11000000, renewed: 9500000, cancelled: 1000000, growth: 2.5, topReason: 'Budget Cuts' },
        '2025': { target: 12500000, renewed: 10200000, cancelled: 1800000, growth: 4.2, topReason: 'Budget Cuts' },
        '2026': { target: 14000000, renewed: 11500000, cancelled: 2000000, growth: 5.1, topReason: 'Competitor Switch' }
    },
    'ANZ': {
        '2024': { target: 4500000, renewed: 4100000, cancelled: 300000, growth: 7.0, topReason: 'Feature Gap' },
        '2025': { target: 5000000, renewed: 4600000, cancelled: 350000, growth: 8.5, topReason: 'Feature Gap' },
        '2026': { target: 5500000, renewed: 4900000, cancelled: 400000, growth: 6.2, topReason: 'Pricing' }
    },
    'India': {
        '2024': { target: 7000000, renewed: 5500000, cancelled: 1000000, growth: -1.5, topReason: 'Pricing' },
        '2025': { target: 8000000, renewed: 6000000, cancelled: 1500000, growth: -2.1, topReason: 'Pricing' },
        '2026': { target: 9000000, renewed: 7500000, cancelled: 800000, growth: 3.5, topReason: 'Budget Cuts' }
    },
    'Canada': {
        '2024': { target: 4000000, renewed: 3500000, cancelled: 300000, growth: 1.2, topReason: 'Merger/Acquisition' },
        '2025': { target: 4500000, renewed: 3800000, cancelled: 400000, growth: 1.5, topReason: 'Merger/Acquisition' },
        '2026': { target: 5000000, renewed: 4200000, cancelled: 500000, growth: 2.8, topReason: 'Support Issues' }
    }
};

// 2. Helpers
const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: "compact" }).format(val);

// 3. Chart Initialization
let miniChartInstance = null;

function initRenewalWidget() {
    const ctx = document.getElementById('miniChart');
    if (!ctx) return; 

    miniChartInstance = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Renewed', 'Cancelled', 'Open'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#10b981', '#f43f5e', '#e2e8f0'],
                borderWidth: 0,
                cutout: '75%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            animation: { duration: 1000 }
        }
    });
    
    // Initial Update
    updateRenewalWidget();
}

// 4. Update Logic (Now reads BOTH Region and Year)
function updateRenewalWidget() {
    // Get values from DOM
    const region = document.getElementById('widget-region').value;
    const year = document.getElementById('widget-year').value;

    // Fetch nested data
    const data = renewalWidgetData[region] ? renewalWidgetData[region][year] : null;
    
    if(!data) {
        console.warn(`No data for ${region} in ${year}`);
        return;
    }

    // Update Text Fields
    document.getElementById('widget-target').textContent = formatCurrency(data.target);
    document.getElementById('widget-renewed').textContent = formatCurrency(data.renewed);
    document.getElementById('widget-cancelled').textContent = formatCurrency(data.cancelled);
    document.getElementById('widget-reason').textContent = data.topReason;

    // Calculate Rate
    const rate = ((data.renewed / data.target) * 100).toFixed(1);
    document.getElementById('widget-rate').textContent = `${rate}%`;
    
    // Update Growth Badge
    const growthEl = document.getElementById('widget-growth');
    const growthBadge = document.getElementById('widget-growth-badge');
    const icon = growthBadge.querySelector('i');
    
    // Set Value
    growthEl.textContent = `${Math.abs(data.growth)}%`;
    
    // Styling Reset
    growthBadge.classList.remove('trend-positive', 'trend-negative');
    icon.classList.remove('ph-trend-up', 'ph-trend-down');

    // Add "YoY" label if missing
    if (!growthBadge.querySelector('.yoy-label')) {
         // This ensures the "YoY" text is there, matching your new design
         const yoySpan = document.createElement('span');
         yoySpan.className = 'yoy-label'; 
         yoySpan.style.cssText = "margin-left: 4px; font-size: 0.8em; opacity: 0.7; text-transform: uppercase;";
         yoySpan.innerText = "YoY";
         growthBadge.appendChild(yoySpan);
    }

    if (data.growth >= 0) {
        growthBadge.classList.add('trend-positive');
        icon.classList.add('ph-trend-up');
        // We use innerHTML to rebuild it cleanly to include the icon + text + YoY
        growthBadge.innerHTML = `<i class="ph ph-trend-up"></i> +${data.growth}% <span style="margin-left:4px; font-size:0.8em; opacity:0.7; text-transform:uppercase;">YoY</span>`;
    } else {
        growthBadge.classList.add('trend-negative');
        icon.classList.add('ph-trend-down');
        growthBadge.innerHTML = `<i class="ph ph-trend-down"></i> ${data.growth}% <span style="margin-left:4px; font-size:0.8em; opacity:0.7; text-transform:uppercase;">YoY</span>`;
    }

    // Update Chart Data
    const open = data.target - (data.renewed + data.cancelled);
    const safeOpen = open > 0 ? open : 0;
    
    miniChartInstance.data.datasets[0].data = [data.renewed, data.cancelled, safeOpen];
    miniChartInstance.update();
}

// 5. Event Listeners
document.addEventListener('DOMContentLoaded', initRenewalWidget);

const widgetRegionSelect = document.getElementById('widget-region');
const widgetYearSelect = document.getElementById('widget-year');

if (widgetRegionSelect) {
    widgetRegionSelect.addEventListener('change', updateRenewalWidget);
}
if (widgetYearSelect) {
    // New listener for Year
    widgetYearSelect.addEventListener('change', updateRenewalWidget);
}