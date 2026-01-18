// ==========================================
// 1. CHART INSTANCES & CONTEXTS
// ==========================================
let upsellChart; 
let crossSellChart; 
let arrTrendChart; 
let gmvConversionChart;

const upsellChartCanvas = document.getElementById('upsellChart');
const upsellCtx = upsellChartCanvas.getContext('2d');
const crossSellChartCanvas = document.getElementById('crossSellChart');
const crossSellCtx = crossSellChartCanvas.getContext('2d');
const arrTrendCanvas = document.getElementById('arrTrendChart');
const arrTrendCtx = arrTrendCanvas.getContext('2d');
const gmvConversionChartCanvas = document.getElementById('gmvConversionChartCanvas');
const gmvConversionCtx = gmvConversionChartCanvas.getContext('2d');

// ==========================================
// 2. MOCK DATA SOURCES
// ==========================================

// Regions for random assignment
const regionsList = ['APAC', 'ANZ', 'LATAM', 'INDIA', 'UK', 'US'];

function generateZUID() { return Math.floor(100000 + Math.random() * 900000); }
function getRandomRegion() { return regionsList[Math.floor(Math.random() * regionsList.length)]; }

// Main Customer Data
const originalCustomerPortfolioData = [
    { initials: 'TM', avatarColor: '#5168b5', name: 'TechMart Solutions', zuid: generateZUID(), region: 'US', industry: 'E-commerce', industrySector: 'Online Retail', arr: 1240000, arrChange: 12.6, products: ['PG', 'Neo', 'Engage'], healthScore: 82, healthText: 'Excellent', healthColor: 'excellent', status: 'Active', lastInteraction: 'Today, QRR Meeting' },
    { initials: 'GS', avatarColor: '#8c5eff', name: 'Global SaaS Inc.', zuid: generateZUID(), region: 'UK', industry: 'SaaS', industrySector: 'Cloud Software', arr: 3820000, arrChange: 8.7, products: ['PG', 'Neo'], healthScore: 78, healthText: 'Good', healthColor: 'good', status: 'Active', lastInteraction: 'Yesterday, Email' },
    { initials: 'ER', avatarColor: '#4CAF50', name: 'EduRight Academy', zuid: generateZUID(), region: 'INDIA', industry: 'Education', industrySector: 'E-learning', arr: 940000, arrChange: 24.2, products: ['PG', 'Neo', 'POS'], healthScore: 92, healthText: 'Excellent', healthColor: 'excellent', status: 'Active', lastInteraction: '3 days ago, Product Demo' },
    { initials: 'FR', avatarColor: '#ef5350', name: 'Fashion Retail Co.', zuid: generateZUID(), region: 'APAC', industry: 'Retail', industrySector: 'Apparel & Accessories', arr: 2180000, arrChange: -3.5, products: ['PG', 'POS', 'Engage'], healthScore: 68, healthText: 'Good', healthColor: 'good', status: 'At Risk', lastInteraction: '1 week ago, Support Call' },
    { initials: 'HT', avatarColor: '#ffa726', name: 'HealthTech Solutions', zuid: generateZUID(), region: 'US', industry: 'Healthcare', industrySector: 'Digital Health', arr: 1760000, arrChange: 6.2, products: ['PG', 'Neo'], healthScore: 72, healthText: 'Good', healthColor: 'good', status: 'Active', lastInteraction: '2 days ago, WhatsApp' },
    { initials: 'FS', avatarColor: '#26a69a', name: 'FoodStreet Cafe', zuid: generateZUID(), region: 'LATAM', industry: 'Food & Beverage', industrySector: 'Restaurant Management', arr: 550000, arrChange: 15.1, products: ['POS', 'Engage'], healthScore: 88, healthText: 'Excellent', healthColor: 'excellent', status: 'Active', lastInteraction: 'Today, Onboarding' },
    { initials: 'BC', avatarColor: '#ab47bc', name: 'BuildCo Inc.', zuid: generateZUID(), region: 'ANZ', industry: 'Construction', industrySector: 'Real Estate Tech', arr: 980000, arrChange: 7.8, products: ['PG', 'Neo'], healthScore: 70, healthText: 'Good', healthColor: 'good', status: 'Active', lastInteraction: '2 weeks ago, Follow-up' },
    { initials: 'GR', avatarColor: '#78909c', name: 'GreenRetail Stores', zuid: generateZUID(), region: 'UK', industry: 'Retail', industrySector: 'Eco-Friendly Retail', arr: 1300000, arrChange: -1.2, products: ['POS', 'Engage'], healthScore: 65, healthText: 'Average', healthColor: 'average', status: 'At Risk', lastInteraction: '4 days ago, Issue Resolution' },
    { initials: 'DC', avatarColor: '#42a5f5', name: 'DataCloud Solutions', zuid: generateZUID(), region: 'US', industry: 'Tech', industrySector: 'Cloud Services', arr: 4500000, arrChange: 10.5, products: ['PG', 'Neo', 'Analytics'], healthScore: 95, healthText: 'Excellent', healthColor: 'excellent', status: 'Active', lastInteraction: 'Yesterday, Data Sync' },
    { initials: 'LS', avatarColor: '#bdbdbd', name: 'Local Services Co.', zuid: generateZUID(), region: 'INDIA', industry: 'Services', industrySector: 'Field Services', arr: 720000, arrChange: 3.1, products: ['PG'], healthScore: 55, healthText: 'Poor', healthColor: 'poor', status: 'At Risk', lastInteraction: '1 month ago, Review' },
    { initials: 'AT', avatarColor: '#a1887f', name: 'Artistic Trends', zuid: generateZUID(), region: 'APAC', industry: 'Arts & Crafts', industrySector: 'Creative Platforms', arr: 890000, arrChange: 7.0, products: ['PG', 'Books'], healthScore: 75, healthText: 'Good', healthColor: 'good', status: 'Active', lastInteraction: '5 days ago, New Feature' }
];

// Upsell Data
const upsellCrossSellData = {
    "month": { upsell: { accounts: 25, revenue: 1500000 }, crossSell: { accounts: 18, revenue: 800000 } },
    "quarter": { upsell: { accounts: 75, revenue: 4800000 }, crossSell: { accounts: 50, revenue: 2500000 } },
    "year": { upsell: { accounts: 250, revenue: 18000000 }, crossSell: { accounts: 180, revenue: 9000000 } }
};

// Updated Churn Data with Rich Drivers
const churnData = {
    "mtd": { 
        churnRate: "3.5%", 
        churnedAccounts: 5, 
        revenueLost: 180000, 
        reasons: [
            { name: "Product Gaps", pct: 45, trend: "up" },
            { name: "Price/Budget", pct: 30, trend: "flat" },
            { name: "Support SLA", pct: 15, trend: "down" }
        ],
        // ... keep other fields if needed for modal
        averageAcv: 36000, highestChurnPeriod: "This Month", highestChurnPercentage: "3.5%"
    },
    "qtr": { 
        churnRate: "8.2%", 
        churnedAccounts: 18, 
        revenueLost: 650000, 
        reasons: [
            { name: "Executive Change", pct: 40, trend: "up" },
            { name: "Product Gaps", pct: 35, trend: "up" },
            { name: "Competition", pct: 25, trend: "down" }
        ],
        averageAcv: 36111, highestChurnPeriod: "April (Q2)", highestChurnPercentage: "3.0%"
    },
    "ytd": { 
        churnRate: "15.1%", 
        churnedAccounts: 32, 
        revenueLost: 1200000, 
        reasons: [
            { name: "Implementation", pct: 50, trend: "down" },
            { name: "Adoption Low", pct: 30, trend: "flat" },
            { name: "Pricing", pct: 20, trend: "up" }
        ],
        averageAcv: 37500, highestChurnPeriod: "Q1 2024 (March)", highestChurnPercentage: "4.5%"
    }
};

// Trend Data
const arrTrendData = {
    "current": { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], currentYear: [25, 28, 31, 35, 42, 50, 52, 55, 58, 62, 65, 70], previousYear: [20, 23, 26, 29, 33, 38, 40, 45, 48, 50, 55, 60] },
    "6months": { labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], currentYear: [31, 35, 42, 50, 52, 55], previousYear: [26, 29, 33, 38, 40, 45] },
    "12months": { labels: ['Aug\'24', 'Sep\'24', 'Oct\'24', 'Nov\'24', 'Dec\'24', 'Jan\'25', 'Feb\'25', 'Mar\'25', 'Apr\'25', 'May\'25', 'Jun\'25', 'Jul\'25'], currentYear: [45, 48, 50, 55, 60, 25, 28, 31, 35, 42, 50, 52], previousYear: [40, 42, 45, 48, 50, 20, 23, 26, 29, 33, 38, 40] },
    "ytd": { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], currentYear: [25, 28, 31, 35, 42, 50, 52, 55], previousYear: [20, 23, 26, 29, 33, 38, 40, 45] }
};

// Growth Opportunities Data
const upsellOpportunitiesData = [ { title: 'CRM Advanced Feature Upsell', description: 'Offer advanced CRM features like SalesIQ and workflow automation.', clients: 20, totalClients: 50, revenue: 150000 }, { title: 'Zoho One Suite Upgrade', description: 'Propose Zoho One to 10 clients currently using 3+ apps.', clients: 10, totalClients: 50, revenue: 250000 }, { title: 'Analytics Premium Plan', description: 'Target 15 clients for an upgrade to Zoho Analytics Premium.', clients: 15, totalClients: 50, revenue: 80000 } ];
const crossSellOpportunitiesData = [ { title: 'Zoho Desk for Support Teams', description: 'Introduce Zoho Desk to 18 clients who currently lack an integrated support system.', clients: 18, totalClients: 50, revenue: 120000 }, { title: 'Zoho Books for Accounting', description: 'Cross-sell Zoho Books to 12 clients using other accounting software.', clients: 12, totalClients: 50, revenue: 70000 }, { title: 'Zoho Campaigns Integration', description: 'Recommend Zoho Campaigns to 15 clients to enhance their marketing automation efforts.', clients: 15, totalClients: 50, revenue: 90000 } ];

// ==========================================
// 3. STATE VARIABLES & ELEMENTS
// ==========================================
let filteredCustomerData = [...originalCustomerPortfolioData];
let currentSortColumn = 'name';
let currentSortDirection = 'asc';
let arrLessThan5kActive = false;
let arrGreaterThan5kActive = false;
let currentPage = 1;
const itemsPerPage = 5;
let totalPages = Math.ceil(filteredCustomerData.length / itemsPerPage);

// DOM Elements - Table
const merchantTableBody = document.getElementById('merchantTableBody');
const paginationInfo = document.getElementById('paginationInfo');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageNumbersContainer = document.getElementById('pageNumbers');

// DOM Elements - Filters
const globalRegionFilter = document.getElementById('globalRegionFilter'); 
const filterArrCapsule = document.getElementById('filterArrCapsule');
const arrLessThan5kSpan = document.getElementById('arrLessThan5k');
const arrGreaterThan5kSpan = document.getElementById('arrGreaterThan5k');
const upsellCrossSellFilter = document.getElementById('upsellCrossSellFilter');
const churnFilter = document.getElementById('churnFilter');
const growthOpportunityFilter = document.getElementById('growthOpportunityFilter');
const arrTrendFilter = document.getElementById('arrTrendFilter');

// DOM Elements - Modals
const filterModal = document.getElementById('filterModal');
const filterModalBody = document.getElementById('filterModalBody');
const sortModal = document.getElementById('sortModal');
const churnAnalysisModal = document.getElementById('churnAnalysisModal');

// DOM Elements - Tabs & User
const tabButtons = document.querySelectorAll('.tab-button');
const dashboardContent = document.getElementById('dashboard-content');
const merchant360Content = document.getElementById('merchant-360-content');
const qbrDeckContent = document.getElementById('qbr-deck-content');
const userProfileToggle = document.getElementById('userProfileToggle');
const userDropdownMenu = document.getElementById('userDropdownMenu');
const currentUserNameSpan = document.getElementById('currentUserName');
const currentUserAvatarDiv = document.getElementById('currentUserAvatar');

// ==========================================
// 4. CORE FUNCTIONS (Formatting, Tabs, Table)
// ==========================================

function formatArr(value) {
    if (value >= 1000000) { return '$' + (value / 1000000).toFixed(1) + 'M'; }
    else if (value >= 1000) { return '$' + (value / 1000).toFixed(0) + 'K'; }
    return '$' + value.toFixed(2);
}

function switchTab(tabName) {
    tabButtons.forEach(button => { button.classList.remove('active'); });
    dashboardContent.style.display = 'none';
    merchant360Content.style.display = 'none';
    qbrDeckContent.style.display = 'none';
    
    if (tabName === 'dashboard') {
        document.querySelector('[data-tab="dashboard"]').classList.add('active');
        dashboardContent.style.display = 'block';
    } else if (tabName === 'merchant360') {
        document.querySelector('[data-tab="merchant360"]').classList.add('active');
        merchant360Content.style.display = 'block';
    } else if (tabName === 'qbrdeck') {
        document.querySelector('[data-tab="qbrdeck"]').classList.add('active');
        qbrDeckContent.style.display = 'block';
    }
}

// Table Rendering
function renderTable() {
    merchantTableBody.innerHTML = '';
    totalPages = Math.ceil(filteredCustomerData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredCustomerData.length);

    if (filteredCustomerData.length === 0) {
        merchantTableBody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding: 20px;">No customers found matching filters.</td></tr>';
    } else {
        for (let i = startIndex; i < endIndex; i++) {
            const customer = filteredCustomerData[i];
            const row = document.createElement('tr');
            
            // Customer Info
            const customerTd = document.createElement('td');
            customerTd.innerHTML = `
                <div class="customer-info">
                    <div class="customer-initials-avatar" style="background-color: ${customer.avatarColor};">${customer.initials}</div>
                    <div class="customer-name-and-details">
                        <div class="customer-name">${customer.name}</div>
                        <div class="customer-zuid">ID: ${customer.zuid} <span style="color:#999; font-size:0.9em">(${customer.region})</span></div>
                    </div>
                </div>`;
            row.appendChild(customerTd);

            // Industry
            const industryTd = document.createElement('td'); industryTd.textContent = customer.industry; row.appendChild(industryTd);
            
            // Sector
            const industrySectorTd = document.createElement('td'); industrySectorTd.textContent = customer.industrySector; row.appendChild(industrySectorTd);
            
            // ARR
            const arrTd = document.createElement('td');
            const arrChangeClass = customer.arrChange >= 0 ? 'positive' : 'negative';
            arrTd.innerHTML = `<div class="arr-value">${formatArr(customer.arr)}</div><div class="arr-change ${arrChangeClass}">${customer.arrChange >= 0 ? '+' : ''}${customer.arrChange}%</div>`;
            row.appendChild(arrTd);

            // Products
            const productsTd = document.createElement('td');
            productsTd.innerHTML = customer.products.map(product => `<span class="product-badge ${product.toLowerCase()}">${product}</span>`).join('');
            row.appendChild(productsTd);

            // Health Score
            const healthScoreTd = document.createElement('td');
            healthScoreTd.innerHTML = `<div class="health-score-badge"><div class="health-score-circle-small ${customer.healthColor}">${customer.healthScore}</div><span class="health-score-text ${customer.healthColor}">${customer.healthText}</span></div>`;
            row.appendChild(healthScoreTd);

            // Status
            const statusTd = document.createElement('td');
            const statusClass = customer.status.toLowerCase().replace(' ', '-');
            statusTd.innerHTML = `<span class="status-badge ${statusClass}">${customer.status}</span>`;
            row.appendChild(statusTd);

            // Last Interaction
            const lastInteractionTd = document.createElement('td');
            const lastInteractionParts = customer.lastInteraction.split(', ');
            lastInteractionTd.innerHTML = `<div class="last-interaction-content"><span class="last-interaction-day">${lastInteractionParts[0]}</span><span class="last-interaction-type">${lastInteractionParts[1] || ''}</span></div>`;
            row.appendChild(lastInteractionTd);

            // Actions
            const actionsTd = document.createElement('td');
            actionsTd.innerHTML = `<a href="#" class="action-link" onclick="switchTab('merchant360'); return false;">View</a>`;
            row.appendChild(actionsTd);

            merchantTableBody.appendChild(row);
        }
    }
    updatePaginationControls();
    updateSortIconVisuals();
}

function updatePaginationControls() {
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const currentEndIndex = Math.min(startIndex + itemsPerPage - 1, filteredCustomerData.length);
    
    if (filteredCustomerData.length === 0) {
        paginationInfo.textContent = 'Showing 0 customers';
    } else {
        paginationInfo.textContent = `Showing ${startIndex} to ${currentEndIndex} of ${filteredCustomerData.length} customers`;
    }

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    pageNumbersContainer.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.classList.add('pagination-button');
        if (i === currentPage) { pageButton.classList.add('active-page'); }
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => { currentPage = i; renderTable(); });
        pageNumbersContainer.appendChild(pageButton);
    }
}

// ==========================================
// 5. FILTERING & SORTING LOGIC
// ==========================================

function applyAllFilters() {
    let tempFilteredData = [...originalCustomerPortfolioData];

    // --- 1. REGION FILTER (Custom Dropdown) ---
    const regionDropdown = document.getElementById('region-dropdown');
    if (regionDropdown) {
        const totalOptions = regionDropdown.querySelectorAll('.dropdown-list input[type="checkbox"]:not([value="all"])').length;
        const checkedBoxes = regionDropdown.querySelectorAll('.dropdown-list input[type="checkbox"]:not([value="all"]):checked');
        const selectedValues = Array.from(checkedBoxes).map(cb => cb.value);

        // If nothing is selected, show nothing. If not all are selected, filter.
        if (selectedValues.length === 0) {
            tempFilteredData = []; 
        } else if (selectedValues.length < totalOptions) {
            tempFilteredData = tempFilteredData.filter(c => selectedValues.includes(c.region));
        }
    }
    // --- 2. INDUSTRY FILTER (Custom Dropdown) ---
    const industryDropdown = document.getElementById('industry-dropdown');
    if (industryDropdown) {
        const totalOptions = industryDropdown.querySelectorAll('.dropdown-list input[type="checkbox"]:not([value="all"])').length;
        const checkedBoxes = industryDropdown.querySelectorAll('.dropdown-list input[type="checkbox"]:not([value="all"]):checked');
        const selectedValues = Array.from(checkedBoxes).map(cb => cb.value);

        if (selectedValues.length === 0) {
            tempFilteredData = [];
        } else if (selectedValues.length < totalOptions) {
            // Checks if customer industry matches any selected checkbox
            tempFilteredData = tempFilteredData.filter(c => selectedValues.includes(c.industry));
        }
    }
    // --- 3. SERVICES FILTER (Custom Dropdown) ---
    const servicesDropdown = document.getElementById('services-dropdown');
    if (servicesDropdown) {
        const totalOptions = servicesDropdown.querySelectorAll('.dropdown-list input[type="checkbox"]:not([value="all"])').length;
        const checkedBoxes = servicesDropdown.querySelectorAll('.dropdown-list input[type="checkbox"]:not([value="all"]):checked');
        const selectedValues = Array.from(checkedBoxes).map(cb => cb.value);

        if (selectedValues.length === 0) {
            tempFilteredData = [];
        } else if (selectedValues.length < totalOptions) {
            // Note: Your current data doesn't have a 'service' field. 
            // If you add one later, uncomment this line:
            // tempFilteredData = tempFilteredData.filter(c => selectedValues.includes(c.serviceType));
        }
    }
    // --- 4. ARR CAPSULE FILTER (Existing) ---
    if (arrLessThan5kActive) {
        tempFilteredData = tempFilteredData.filter(c => c.arr < 5000000); 
    } else if (arrGreaterThan5kActive) {
        tempFilteredData = tempFilteredData.filter(c => c.arr >= 5000000);
    }

    // 5. Modal Filters
    const filterRows = filterModalBody.querySelectorAll('.filter-row');
    const activeModalFilters = [];
    filterRows.forEach(row => {
        const field = row.querySelector('.filter-field-select').value;
        const operator = row.querySelector('.filter-operator-select').value;
        const value = row.querySelector('.filter-value-input').value.trim();
        if (value) activeModalFilters.push({ field, operator, value });
    });

    if (activeModalFilters.length > 0) {
        tempFilteredData = tempFilteredData.filter(customer => {
            return activeModalFilters.every(filter => {
                let customerValue = customer[filter.field];
                if (filter.field === 'products') customerValue = customer.products.join(', ');
                
                const isStringComparison = typeof customerValue === 'string';
                const filterValue = isStringComparison ? filter.value.toLowerCase() : parseFloat(filter.value);
                const dataValue = isStringComparison ? customerValue.toLowerCase() : customerValue;

                switch (filter.operator) {
                    case 'contains': return isStringComparison && dataValue.includes(filterValue);
                    case 'equals': return dataValue === filterValue;
                    case 'starts_with': return isStringComparison && dataValue.startsWith(filterValue);
                    case 'ends_with': return isStringComparison && dataValue.endsWith(filterValue);
                    case 'greater_than': return !isNaN(dataValue) && dataValue > filterValue;
                    case 'less_than': return !isNaN(dataValue) && dataValue < filterValue;
                    default: return true;
                }
            });
        });
    }
    // --- 6. SORTING (Existing) ---
    const column = currentSortColumn;
    const direction = currentSortDirection;
    tempFilteredData.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];
        if (column === 'products') { valA = a.products[0] || ''; valB = b.products[0] || ''; }
        
        if (typeof valA === 'string') {
            return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else {
            return direction === 'asc' ? (valA - valB) : (valB - valA);
        }
    });

    // Update State & Render
    filteredCustomerData = tempFilteredData;
    currentPage = 1;
    renderTable();
}

// Region Filter Listener
if(globalRegionFilter) {
    globalRegionFilter.addEventListener('change', () => {
        applyAllFilters();
    });
}

// ARR Capsule Logic
function updateArrCapsuleVisuals() {
    if (arrLessThan5kActive) arrLessThan5kSpan.classList.add('active'); else arrLessThan5kSpan.classList.remove('active');
    if (arrGreaterThan5kActive) arrGreaterThan5kSpan.classList.add('active'); else arrGreaterThan5kSpan.classList.remove('active');
    if (arrLessThan5kActive || arrGreaterThan5kActive) filterArrCapsule.classList.add('active'); else filterArrCapsule.classList.remove('active');
}
arrLessThan5kSpan.addEventListener('click', () => {
    arrLessThan5kActive = !arrLessThan5kActive;
    if (arrLessThan5kActive) arrGreaterThan5kActive = false;
    applyAllFilters();
});
arrGreaterThan5kSpan.addEventListener('click', () => {
    arrGreaterThan5kActive = !arrGreaterThan5kActive;
    if (arrGreaterThan5kActive) arrLessThan5kActive = false;
    applyAllFilters();
});

// Modal Logic (Filter/Sort)
function createFilterRow() {
    const div = document.createElement('div');
    div.classList.add('filter-row');
    div.innerHTML = `
        <select class="filter-field-select">
            <option value="name">CUSTOMER</option><option value="industry">INDUSTRY</option><option value="arr">ARR</option>
            <option value="healthScore">HEALTH SCORE</option><option value="status">STATUS</option>
        </select>
        <select class="filter-operator-select">
            <option value="contains">contains</option><option value="equals">equals</option>
        </select>
        <input type="text" class="filter-value-input" placeholder="Enter value">
        <button class="delete-filter-btn" type="button">🗑</button>`;
    
    div.querySelector('.delete-filter-btn').addEventListener('click', () => div.remove());
    return div;
}

document.getElementById('openFilterModalBtn').addEventListener('click', () => {
    filterModal.classList.add('show-flex');
    if(filterModalBody.children.length <= 1) filterModalBody.appendChild(createFilterRow());
});
document.getElementById('closeFilterModalBtn').addEventListener('click', () => filterModal.classList.remove('show-flex'));
document.getElementById('addFilterRowBtn').addEventListener('click', () => filterModalBody.appendChild(createFilterRow()));
document.getElementById('clearAllFiltersBtn').addEventListener('click', () => {
    arrLessThan5kActive = false; arrGreaterThan5kActive = false;
    filterModalBody.innerHTML = '<p style="font-size: 0.9em; color: #616161; margin-top: 0;">Add one or more conditions.</p>';
    applyAllFilters(); filterModal.classList.remove('show-flex');
});
document.getElementById('applyFiltersBtn').addEventListener('click', () => { applyAllFilters(); filterModal.classList.remove('show-flex'); });

// Sort UI Logic
function updateSortIconVisuals() {
    document.querySelectorAll('.merchant-table th .sort-icon').forEach(icon => icon.classList.remove('active'));
    const activeIcon = document.querySelector(`.merchant-table th[data-column="${currentSortColumn}"] .sort-icon.${currentSortDirection}`);
    if (activeIcon) activeIcon.classList.add('active');
}
document.querySelectorAll('.merchant-table th[data-column]').forEach(header => {
    header.querySelectorAll('.sort-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const dir = e.target.dataset.direction;
            if (currentSortColumn === header.dataset.column && currentSortDirection === dir) {
                currentSortColumn = 'name'; currentSortDirection = 'asc';
            } else {
                currentSortColumn = header.dataset.column; currentSortDirection = dir;
            }
            applyAllFilters();
        });
    });
});

// ==========================================
// 6. DASHBOARD CARDS & VISUALIZATIONS
// ==========================================

// --- Updated Account Summary Logic with Churn Flow ---
function updateAccountSummary() {
    // 1. Base Numbers
    const totalAccounts = 5000; 
    const totalRevenue = 52000000;

    // 2. Stage Splits (Current Snapshot)
    const activeCount = 4650;
    const activeRevenue = 48500000;
    
    const warningCount = 280;
    const warningRisk = 2400000; // $2.4M
    
    const criticalCount = 70;
    const criticalRisk = 850000; // $850K

    // 3. Flow/Consequence Data
    const warningChurned = 12;
    const warningLost = 180000; 
    const criticalChurned = 8;
    const criticalLost = 420000; 

    // 4. Update DOM
    document.getElementById('summaryTotalAccounts').textContent = totalAccounts.toLocaleString();
    document.getElementById('summaryTotalValue').textContent = formatArr(totalRevenue);
    document.getElementById('summaryActiveAccounts').textContent = activeCount.toLocaleString();
    document.getElementById('summaryActiveRevenue').textContent = formatArr(activeRevenue);

    document.getElementById('summaryWarningAccounts').textContent = warningCount.toLocaleString();
    document.getElementById('summaryWarningRisk').textContent = formatArr(warningRisk);
    document.getElementById('warningChurnCount').textContent = warningChurned;
    document.getElementById('warningLostRevenue').textContent = formatArr(warningLost);

    document.getElementById('summaryCriticalAccounts').textContent = criticalCount.toLocaleString();
    document.getElementById('summaryCriticalRisk').textContent = formatArr(criticalRisk);
    document.getElementById('criticalChurnCount').textContent = criticalChurned;
    document.getElementById('criticalLostRevenue').textContent = formatArr(criticalLost);
}

// --- Reactivation Counts ---
function updateInactiveCount() {
    document.getElementById('totalInactiveCount').textContent = "350";
}

// --- Upsell/Cross-sell Card ---
function updateUpsellCrossSellCard(period) {
    const data = upsellCrossSellData[period];
    document.getElementById('upsellAccounts').textContent = data.upsell.accounts;
    document.getElementById('upsellRevenue').textContent = formatArr(data.upsell.revenue);
    document.getElementById('crossSellAccounts').textContent = data.crossSell.accounts;
    document.getElementById('crossSellRevenue').textContent = formatArr(data.crossSell.revenue);

    if (upsellChart) upsellChart.destroy();
    upsellChart = new Chart(upsellCtx, {
        type: 'bar',
        data: { labels: ['Accounts', 'Revenue'], datasets: [{ label: 'Upsell', data: [data.upsell.accounts, data.upsell.revenue], backgroundColor: ['#007bff', '#28a745'], borderRadius: 5 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, x: { grid: { display: false } } } } }
    });

    if (crossSellChart) crossSellChart.destroy();
    crossSellChart = new Chart(crossSellCtx, {
        type: 'bar',
        data: { labels: ['Accounts', 'Revenue'], datasets: [{ label: 'Cross-sell', data: [data.crossSell.accounts, data.crossSell.revenue], backgroundColor: ['#007bff', '#28a745'], borderRadius: 5 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, x: { grid: { display: false } } } } }
    });
}
upsellCrossSellFilter.addEventListener('change', (e) => updateUpsellCrossSellCard(e.target.value));

// --- Portfolio Health (Ring Design) Logic ---
function updateHealthBarAndDetails() {
    // Mock Data
    const healthData = { score: 74, poor: 30, average: 250, excellent: 120 };
    const total = healthData.poor + healthData.average + healthData.excellent;
    
    // Percentages
    const excPct = (healthData.excellent / total) * 100;
    const avgPct = (healthData.average / total) * 100;
    const poorPct = (healthData.poor / total) * 100;

    // 1. Update Horizontal Bar Segments
    document.getElementById('segment-excellent').style.width = `${excPct}%`;
    document.getElementById('segment-average').style.width = `${avgPct}%`;
    document.getElementById('segment-poor').style.width = `${poorPct}%`;

    // 2. Update Ring Chart & Score Text
    const scoreDisplay = document.getElementById('health-score-display');
    const ringCircle = document.getElementById('health-ring-circle');
    const statusPill = document.getElementById('main-status');

    if(scoreDisplay) {
        scoreDisplay.textContent = healthData.score;
        
        // Ring Calculation
        const radius = 60;
        const circumference = 2 * Math.PI * radius;
        
        ringCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        const offset = circumference - (healthData.score / 100) * circumference;
        ringCircle.style.strokeDashoffset = offset;

        // Reset Colors
        scoreDisplay.className = 'score-value';
        ringCircle.className.baseVal = 'progress-ring__circle'; 
        if(statusPill) statusPill.className = 'status-pill';

        // Apply Dynamic Colors
        if (healthData.score >= 90) {
            scoreDisplay.classList.add('text-excellent');
            ringCircle.classList.add('stroke-excellent');
            if(statusPill) { statusPill.classList.add('status-excellent'); statusPill.textContent = 'Excellent'; }
        } else if (healthData.score >= 70) {
            scoreDisplay.classList.add('text-good');
            ringCircle.classList.add('stroke-good');
            if(statusPill) { statusPill.classList.add('status-good'); statusPill.textContent = 'Good'; }
        } else if (healthData.score >= 41) {
            scoreDisplay.classList.add('text-average');
            ringCircle.classList.add('stroke-average');
            if(statusPill) { statusPill.classList.add('status-average'); statusPill.textContent = 'Average'; }
        } else {
            scoreDisplay.classList.add('text-poor');
            ringCircle.classList.add('stroke-poor');
            if(statusPill) { statusPill.classList.add('status-poor'); statusPill.textContent = 'Poor'; }
        }
    }

    // 3. Update Legend Counts
    document.getElementById('excellent-count').textContent = healthData.excellent;
    document.getElementById('excellent-percent').textContent = `(${excPct.toFixed(1)}%)`;
    document.getElementById('average-count').textContent = healthData.average;
    document.getElementById('average-percent').textContent = `(${avgPct.toFixed(1)}%)`;
    document.getElementById('poor-count').textContent = healthData.poor;
    document.getElementById('poor-percent').textContent = `(${poorPct.toFixed(1)}%)`;
}

// --- Churn Insights ---
function updateChurnCard(period) {
    const data = churnData[period];
    document.getElementById('churnRate').textContent = data.churnRate;
    document.getElementById('churnedAccounts').textContent = data.churnedAccounts;
    document.getElementById('revenueLost').textContent = formatArr(data.revenueLost);
    
    // NEW: Render Driver Bars (Apple-style)
    const container = document.getElementById('churnDriversContainer');
    
    if (container) {
        container.innerHTML = ''; // Clear previous content

        data.reasons.forEach(reason => {
            // Determine Trend Icon Logic
            let trendHtml = '';
            if (reason.trend === 'up') {
                trendHtml = '<span class="trend-icon trend-up">▲</span>'; // Rising issue (Bad)
            } else if (reason.trend === 'down') {
                trendHtml = '<span class="trend-icon trend-down">▼</span>'; // Decreasing issue (Good)
            } else {
                trendHtml = '<span class="trend-icon trend-flat">−</span>'; // Stable
            }

            // Create the Row
            const row = document.createElement('div');
            row.classList.add('churn-driver-row');
            row.innerHTML = `
                <div class="driver-info">${reason.name}</div>
                <div class="driver-bar-container">
                    <div class="driver-bar-fill" style="width: ${reason.pct}%;"></div>
                </div>
                <div class="driver-stats">${reason.pct}% ${trendHtml}</div>
            `;
            container.appendChild(row);
        });
    }
}
churnFilter.addEventListener('change', (e) => updateChurnCard(e.target.value));
document.getElementById('analyzeChurnBtn').addEventListener('click', () => {
    const d = churnData[churnFilter.value];
    document.getElementById('modalChurnedAccounts').textContent = d.churnedAccounts;
    document.getElementById('modalRevenueLost').textContent = formatArr(d.revenueLost);
    document.getElementById('modalAverageAcv').textContent = formatArr(d.averageAcv);
    document.getElementById('modalHighestChurnPeriod').textContent = `${d.highestChurnPeriod} (${d.highestChurnPercentage})`;
    churnAnalysisModal.classList.add('show-flex');
});
document.getElementById('closeChurnAnalysisModalBtn').addEventListener('click', () => churnAnalysisModal.classList.remove('show-flex'));
document.getElementById('closeChurnAnalysisModalFooterBtn').addEventListener('click', () => churnAnalysisModal.classList.remove('show-flex'));

// --- Growth Opportunities ---
function updateGrowthOpportunitiesCard(type) {
    const data = type === 'upsell' ? upsellOpportunitiesData : crossSellOpportunitiesData;
    const grid = document.getElementById('opportunitiesGrid'); grid.innerHTML = '';
    data.forEach(op => {
        const pct = (op.clients / op.totalClients) * 100;
        const div = document.createElement('div'); div.classList.add('opportunity-card');
        div.innerHTML = `<div class="opportunity-content"><div class="opportunity-title">${op.title}</div><div class="opportunity-description">${op.description}</div><div class="opportunity-progress-bar-container"><div class="opportunity-progress-bar-fill" style="width: ${pct.toFixed(0)}%;"></div></div><div class="opportunity-stats"><span>${op.clients}/${op.totalClients} clients</span><span class="value">${formatArr(op.revenue)} opportunity</span></div></div>`;
        grid.appendChild(div);
    });
    document.getElementById('growthOpportunitiesBadge').textContent = `${data.length} identified`;
}
growthOpportunityFilter.addEventListener('change', (e) => updateGrowthOpportunitiesCard(e.target.value));

// --- Charts (ARR & GMV) ---
function renderArrTrendChart(period = 'current') {
    const data = arrTrendData[period];
    if (arrTrendChart) arrTrendChart.destroy();
    arrTrendChart = new Chart(arrTrendCtx, {
        type: 'line',
        data: { labels: data.labels, datasets: [{ label: 'Current', data: data.currentYear, borderColor: '#007bff', fill: true, backgroundColor: 'rgba(0,123,255,0.1)' }, { label: 'Previous', data: data.previousYear, borderColor: '#6c757d', borderDash: [5,5], fill: false }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true, ticks: { callback: v => '$' + v + 'M' } }, x: { grid: { display: false } } } }
    });
}
arrTrendFilter.addEventListener('change', (e) => renderArrTrendChart(e.target.value));

function renderGmvConversionChart() {
    if (gmvConversionChart) gmvConversionChart.destroy();
    
    // 1. Read styles from CSS
    const styles = getComputedStyle(document.documentElement);
    const colorLightBlue = '#5b9bd5'; // Fallback if CSS var missing
    const colorDarkBlue = '#4472c4';
    const lineColor = '#7030a0';
    const textColor = '#666666';

    // 2. Data
    const labels = ['E-commerce', 'Education', 'Healthcare', 'Others', 'SaaS', 'Retail', 'Food & Beverage'];
    const arrData = [150000, 90000, 48000, 28000, 180000, 80000, 60000];
    const conversionData = [5.2, 3.5, 2.8, 1.4, 4.8, 4.1, 3.0];

    // 3. Generate Alternating Colors
    const barColors = arrData.map((_, index) => index % 2 === 0 ? colorLightBlue : colorDarkBlue);

    // 4. Render Chart
    gmvConversionChart = new Chart(gmvConversionCtx, {
        type: 'bar',
        data: { 
            labels: labels, 
            datasets: [
                { 
                    label: 'ARR ($)', 
                    data: arrData, 
                    backgroundColor: barColors,
                    barPercentage: 0.7,
                    yAxisID: 'y',
                    order: 2
                }, 
                { 
                    label: 'Conversion Rate (%)', 
                    data: conversionData, 
                    type: 'line', 
                    borderColor: lineColor, 
                    backgroundColor: lineColor,
                    pointBackgroundColor: lineColor,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    tension: 0.1,
                    yAxisID: 'y1',
                    order: 1
                }
            ] 
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            
            // --- NATIVE ANIMATION CONFIG (NO PLUGINS) ---
            animation: {
                y: {
                    duration: 2000, // Slower growth (2 seconds)
                    easing: 'easeOutQuart' // Smooth deceleration
                },
                x: {
                    duration: 0 // No horizontal animation
                }
            },
            // ---------------------------------------------

            plugins: {
                legend: {
                    position: 'top',
                    labels: { usePointStyle: true, boxWidth: 8 }
                },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: { 
                x: { 
                    grid: { display: false },
                    ticks: { maxRotation: 25, minRotation: 25, font: { size: 11 } }
                },
                y: { 
                    type: 'linear', display: true, position: 'left',
                    min: 0, max: 180000,
                    ticks: { stepSize: 20000, callback: v => '$' + v.toLocaleString() },
                    title: { display: true, text: 'ARR ($)', color: textColor }
                }, 
                y1: { 
                    type: 'linear', display: true, position: 'right',
                    min: 0, max: 6,
                    grid: { drawOnChartArea: false },
                    ticks: { stepSize: 1, callback: v => v + '%' },
                    title: { display: true, text: 'Conversion Rate (%)', color: textColor }
                } 
            } 
        }
    });
}

// --- User Profile ---
userProfileToggle.addEventListener('click', () => userDropdownMenu.classList.toggle('show'));
window.addEventListener('click', (e) => { if (!userProfileToggle.contains(e.target) && !userDropdownMenu.contains(e.target)) userDropdownMenu.classList.remove('show'); });
userDropdownMenu.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', () => {
        currentUserNameSpan.textContent = item.dataset.name;
        currentUserAvatarDiv.textContent = item.dataset.initials;
        userDropdownMenu.classList.remove('show');
    });
});

// ==========================================
// 7. GLOBAL EVENT LISTENERS & INITIALIZATION
// ==========================================

// Reactivation & Wake Up Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    // A. Win-Back Links (Switch Tabs)
    const reactivationButtons = document.querySelectorAll('.action-link-btn');
    reactivationButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('merchant360');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // B. Wake Up Modal
    const wakeUpEmailModal = document.getElementById('wakeUpEmailModal');
    const triggerWakeUpBtn = document.getElementById('openWakeUpModalBtn'); 
    const closeWakeUpModalBtn = document.getElementById('closeWakeUpModalBtn');
    const cancelWakeUpBtn = document.getElementById('cancelWakeUpBtn');
    const sendWakeUpBtn = document.getElementById('sendWakeUpBtn');

    if (triggerWakeUpBtn && wakeUpEmailModal) {
        triggerWakeUpBtn.addEventListener('click', (e) => { e.preventDefault(); wakeUpEmailModal.classList.add('show-flex'); });
        const closeMod = () => wakeUpEmailModal.classList.remove('show-flex');
        if (closeWakeUpModalBtn) closeWakeUpModalBtn.addEventListener('click', closeMod);
        if (cancelWakeUpBtn) cancelWakeUpBtn.addEventListener('click', closeMod);
        window.addEventListener('click', (e) => { if (e.target == wakeUpEmailModal) closeMod(); });

        if (sendWakeUpBtn) {
            sendWakeUpBtn.addEventListener('click', () => {
                const originalText = sendWakeUpBtn.textContent;
                sendWakeUpBtn.textContent = "Sending...";
                setTimeout(() => {
                    closeMod();
                    const toast = document.getElementById("toast");
                    if (toast) {
                        toast.textContent = "Wake Up Campaign sent to 80 accounts!";
                        toast.className = "toast show success";
                        setTimeout(() => toast.className = toast.className.replace("show", ""), 3000);
                    } else { alert("Campaign sent!"); }
                    sendWakeUpBtn.textContent = originalText;
                }, 1000);
            });
        }
    }

    // 3. Logic for "Usage Gap" Modal
    const gapModal = document.getElementById('gapAnalysisModal');
    const openGapBtn = document.getElementById('openGapAnalysisBtn');
    const closeGapBtn = document.getElementById('closeGapModalBtn');
    const cancelGapBtn = document.getElementById('cancelGapBtn');
    const sendGapBtn = document.getElementById('sendGapEmailBtn');

    if (openGapBtn && gapModal) {
        openGapBtn.addEventListener('click', (e) => {
            e.preventDefault();
            gapModal.classList.add('show-flex');
        });
        const closeGapModal = () => gapModal.classList.remove('show-flex');
        if (closeGapBtn) closeGapBtn.addEventListener('click', closeGapModal);
        if (cancelGapBtn) cancelGapBtn.addEventListener('click', closeGapModal);
        window.addEventListener('click', (e) => {
            if (e.target == gapModal) closeGapModal();
        });

        if (sendGapBtn) {
            sendGapBtn.addEventListener('click', () => {
                const originalText = sendGapBtn.textContent;
                sendGapBtn.textContent = "Sending...";
                setTimeout(() => {
                    closeGapModal();
                    const toast = document.getElementById("toast");
                    if (toast) {
                        toast.textContent = "Recommendation emails sent to 45 accounts!";
                        toast.className = "toast show success";
                        setTimeout(() => toast.className = toast.className.replace("show", ""), 3000);
                    } else {
                        alert("Recommendations Sent!");
                    }
                    sendGapBtn.textContent = originalText;
                }, 1000);
            });
        }
    }
});

// Tab Buttons
tabButtons.forEach(btn => btn.addEventListener('click', (e) => switchTab(e.target.dataset.tab)));

// Resize Handler
window.addEventListener('resize', () => {
    if (dashboardContent.style.display !== 'none') {
        updateUpsellCrossSellCard(upsellCrossSellFilter.value);
        renderArrTrendChart(arrTrendFilter.value);
        renderGmvConversionChart();
    }
});

// Refresh Handler
function handleRefresh(event) {
    const btn = event.currentTarget;
    btn.classList.add('spinning');
    setTimeout(() => {
        btn.classList.remove('spinning');
        if (dashboardContent) {
            dashboardContent.style.display = 'none';
            setTimeout(() => dashboardContent.style.display = 'block', 50);
        }
    }, 800);
}

// --- MASTER INIT ---
window.addEventListener('load', () => {
    switchTab('dashboard');
    applyAllFilters();
    updateUpsellCrossSellCard('month');
    // Removed old Product Adoption call
    renderArrTrendChart();
    renderGmvConversionChart();
    updateChurnCard('mtd');
    updateGrowthOpportunitiesCard('upsell');
    updateAccountSummary();
    updateInactiveCount();
    updateHealthBarAndDetails(); 
});
/* ==========================================
   CUSTOM DROPDOWN HELPER FUNCTIONS
   ========================================== */

// 1. Open/Close Dropdown
function toggleCustomDropdown(id) {
    const dropdown = document.getElementById(id);
    const menu = dropdown.querySelector('.dropdown-menu');
    
    // Close any other open dropdowns first
    document.querySelectorAll('.dropdown-menu').forEach(m => {
        if(m !== menu) m.classList.remove('show');
    });

    menu.classList.toggle('show');
}

// 2. "Select All" Checkbox Logic
function toggleCustomSelectAll(id, mainCheckbox) {
    const dropdown = document.getElementById(id);
    const checkboxes = dropdown.querySelectorAll('.dropdown-list input[type="checkbox"]:not([value="all"])');
    checkboxes.forEach(cb => {
        cb.checked = mainCheckbox.checked;
    });
}

// 3. Search Bar Logic inside Dropdown
function filterCustomDropdown(input) {
    const filter = input.value.toLowerCase();
    const list = input.closest('.dropdown-menu').querySelector('.dropdown-list');
    const options = list.querySelectorAll('label');

    options.forEach(option => {
        const text = option.textContent.toLowerCase();
        // Always show the "All" option, filter the rest
        if (text.includes(filter) || option.querySelector('input').value === 'all') {
            option.style.display = "";
        } else {
            option.style.display = "none";
        }
    });
}

// 4. "Clear" Button Logic
function clearCustomDropdown(id) {
    const dropdown = document.getElementById(id);
    const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
}

// 5. "OK" Button Logic (Updates Title & Triggers Filter)
function applyCustomDropdown(id) {
    const dropdown = document.getElementById(id);
    const triggerText = dropdown.querySelector('.selected-text');
    const checkboxes = dropdown.querySelectorAll('.dropdown-list input[type="checkbox"]:not([value="all"])');
    const allCheckbox = dropdown.querySelector('input[value="all"]');
    
    let selectedCount = 0;
    checkboxes.forEach(cb => { if (cb.checked) selectedCount++; });

    // Determine the Title based on ID
    let title = "Items";
    if(id.includes('region')) title = "Regions";
    if(id.includes('bu')) title = "BU Heads";
    if(id.includes('segment')) title = "Segments";
    if(id.includes('services')) title = "Services";    // <--- Added
    if(id.includes('industry')) title = "Industries";  // <--- Added

    // Update the Text displayed on the button
    if (selectedCount === 0) {
        triggerText.textContent = `Select ${title}...`;
        if(allCheckbox) allCheckbox.checked = false;
    } else if (selectedCount === checkboxes.length) {
        triggerText.textContent = `All ${title}`;
        if(allCheckbox) allCheckbox.checked = true;
    } else {
        triggerText.textContent = `${selectedCount} ${title}`;
        if(allCheckbox) allCheckbox.checked = false; 
    }

    // Close Menu
    dropdown.querySelector('.dropdown-menu').classList.remove('show');

    // Re-run the main filter function
    applyAllFilters();
}

// Close dropdowns if clicking outside
window.addEventListener('click', function(e) {
    if (!e.target.closest('.custom-dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
    }
});