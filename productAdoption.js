// Product Adoption Component Logic
const ProductAdoption = {
    isTrialActive: true,

    // Data Store
    metricsData: {
        trial: {
            All: { 
                signups: 1250, converted: 210, 
                firstBuy: ["CRM", "Desk"], nextAdoption: ["Projects", "People"],
                topRegion: "North America", lowRegion: "APAC"
            },
            NA:  { 
                signups: 600,  converted: 120, 
                firstBuy: ["CRM", "One"], nextAdoption: ["Projects", "People"],
                topRegion: "USA", lowRegion: "Canada"
            },
            EU:  { 
                signups: 400,  converted: 60,  
                firstBuy: ["Desk", "Mail"], nextAdoption: ["Analytics", "CRM"],
                topRegion: "UK", lowRegion: "Germany"
            },
            APAC:{ 
                signups: 250,  converted: 30,  
                firstBuy: ["Bigin", "CRM"], nextAdoption: ["Social", "Desk"],
                topRegion: "Australia", lowRegion: "India"
            }
        },
        paid: {
            All: { 
                base: 850, retained: 765, 
                firstBuy: ["CRM", "Desk"], nextAdoption: ["Projects", "People"],
                topRetained: "Technology", topChurned: "Retail"
            },
            Tech: { 
                base: 350, retained: 335, 
                firstBuy: ["One", "Analytics"], nextAdoption: ["Desk", "Projects"],
                topRetained: "SaaS", topChurned: "Hardware"
            },
            Retail: { 
                base: 300, retained: 240, 
                firstBuy: ["CRM", "Bigin"], nextAdoption: ["Inventory", "Books"],
                topRetained: "Luxury", topChurned: "Fashion"
            },
            Healthcare: { 
                base: 200, retained: 190, 
                firstBuy: ["Desk", "People"], nextAdoption: ["Assist", "Vault"],
                topRetained: "Hospitals", topChurned: "Clinics"
            }
        }
    },

    // Initialize
    init: function() {
        this.cacheDOM();
        this.bindEvents();
        this.renderInitialState();
    },

    cacheDOM: function() {
        this.prevBtn = document.getElementById('pa-prev-btn');
        this.nextBtn = document.getElementById('pa-next-btn');
        this.regionFilter = document.getElementById('pa-region-filter');
        this.industryFilter = document.getElementById('pa-industry-filter');
        this.trialContainer = document.getElementById('pa-trial-card-container');
        this.paidContainer = document.getElementById('pa-paid-card-container');
    },

    bindEvents: function() {
        this.prevBtn.addEventListener('click', () => this.navigate(-1));
        this.nextBtn.addEventListener('click', () => this.navigate(1));
        this.regionFilter.addEventListener('change', () => this.updateDashboard());
        this.industryFilter.addEventListener('change', () => this.updateDashboard());
    },

    renderInitialState: function() {
        // Render initial trial data
        const regionKey = this.regionFilter.value;
        this.trialContainer.innerHTML = this.renderTrialCard(regionKey);
        
        // Set Visibility
        this.setFilterVisibility('trial');
        this.paidContainer.style.display = 'none';
        this.trialContainer.classList.add('slide-active');
        this.updateNavButtons();
    },

    updateNavButtons: function() {
        this.prevBtn.disabled = this.isTrialActive;
        this.nextBtn.disabled = !this.isTrialActive;
    },

    navigate: function(direction) {
        if (direction === 1 && this.isTrialActive) {
            this.isTrialActive = false;
            this.transitionCard(1);
        } else if (direction === -1 && !this.isTrialActive) {
            this.isTrialActive = true;
            this.transitionCard(-1);
        }
        this.updateNavButtons();
    },

    setFilterVisibility: function(segment) {
        if (segment === 'trial') {
            this.regionFilter.style.display = 'block';
            this.industryFilter.style.display = 'none';
        } else {
            this.regionFilter.style.display = 'none';
            this.industryFilter.style.display = 'block';
        }
    },

    updateDashboard: function() {
        const regionKey = this.regionFilter.value;
        const industryKey = this.industryFilter.value;
        
        if (this.isTrialActive) {
            this.trialContainer.innerHTML = this.renderTrialCard(regionKey);
        } else {
            this.paidContainer.innerHTML = this.renderPaidCard(industryKey);
        }
    },
    

    // HTML Generators
    renderTrialCard: function(regionKey) {
        const data = this.metricsData.trial[regionKey];
        const conversionRate = ((data.converted / data.signups) * 100).toFixed(1);
        
        // REMOVED: Tip/Tag Calculation logic was here

        return `
            <div class="pa-segment-insight">
                <div class="pa-card-header">
                    <div>
                        <h3 class="text-trial">Trial Users</h3>
                        <small>Focus: Conversion Funnel</small>
                    </div>
                    <span class="pa-filter-badge">${regionKey}</span>
                </div>
                
                <div class="pa-main-metrics-row">
                    <div class="pa-metric-group">
                        <small>Signups</small>
                        <strong class="text-trial">${data.signups}</strong>
                    </div>
                    <div class="pa-metric-group">
                        <small>Converted</small>
                        <strong>${data.converted}</strong>
                    </div>
                    <div class="pa-metric-group">
                        <small>Rate</small>
                        <strong class="text-paid">${conversionRate}%</strong>
                        </div>
                </div>

                <div class="pa-adoption-list">
                    <div class="pa-adoption-item">
                        <span class="pa-adoption-label">Top First Buy</span>
                        <span class="pa-adoption-val">${data.firstBuy.join(', ')}</span>
                    </div>
                    <div class="pa-adoption-item">
                        <span class="pa-adoption-label">Next Adoption</span>
                        <span class="pa-adoption-val">${data.nextAdoption.join(', ')}</span>
                    </div>
                    <div class="pa-adoption-item">
                        <span class="pa-adoption-label">Top Converted Region</span>
                        <span class="pa-adoption-val">${data.topRegion}</span>
                    </div>
                    <div class="pa-adoption-item">
                        <span class="pa-adoption-label">Lowest Converting Region</span>
                        <span class="pa-adoption-val">${data.lowRegion}</span>
                    </div>
                </div>
            </div>
        `;
    },

    renderPaidCard: function(industryKey) {
        const data = this.metricsData.paid[industryKey];
        const retentionRate = ((data.retained / data.base) * 100).toFixed(1);

        // REMOVED: Tip/Tag Calculation logic was here

        return `
            <div class="pa-segment-insight">
                <div class="pa-card-header">
                    <div>
                        <h3 class="text-paid">Customers</h3>
                        <small>Focus: Retention</small>
                    </div>
                    <span class="pa-filter-badge">${industryKey}</span>
                </div>

                <div class="pa-main-metrics-row">
                    <div class="pa-metric-group">
                        <small>Base</small>
                        <strong>${data.base}</strong>
                    </div>
                    <div class="pa-metric-group">
                        <small>Retained</small>
                        <strong class="text-paid">${data.retained}</strong>
                    </div>
                    <div class="pa-metric-group">
                        <small>Retention</small>
                        <strong class="text-paid">${retentionRate}%</strong>
                        </div>
                </div>

                <div class="pa-adoption-list">
                    <div class="pa-adoption-item">
                        <span class="pa-adoption-label">Top First Buy</span>
                        <span class="pa-adoption-val">${data.firstBuy.join(', ')}</span>
                    </div>
                    <div class="pa-adoption-item">
                        <span class="pa-adoption-label">Expansion To</span>
                        <span class="pa-adoption-val">${data.nextAdoption.join(', ')}</span>
                    </div>
                    <div class="pa-adoption-item">
                        <span class="pa-adoption-label">Top Retained Industry</span>
                        <span class="pa-adoption-val">${data.topRetained}</span>
                    </div>
                    <div class="pa-adoption-item">
                        <span class="pa-adoption-label">Top Churned Industry</span>
                        <span class="pa-adoption-val">${data.topChurned}</span>
                    </div>
                </div>
            </div>
        `;
    },

    transitionCard: function(direction) {
        const outgoing = this.isTrialActive ? this.paidContainer : this.trialContainer; // Was just active
        const incoming = this.isTrialActive ? this.trialContainer : this.paidContainer; // Becoming active

        // Animation Classes
        const slideOutClass = (direction === 1) ? 'slide-out-left' : 'slide-out-right';
        const slideInClass = (direction === 1) ? 'slide-in-right' : 'slide-in-left';

        // 1. Prepare Incoming Data
        if(!this.isTrialActive) { // Moving TO Paid
            this.industryFilter.value = 'All';
            incoming.innerHTML = this.renderPaidCard('All');
            this.setFilterVisibility('paid');
        } else { // Moving TO Trial
            this.regionFilter.value = 'All';
            incoming.innerHTML = this.renderTrialCard('All');
            this.setFilterVisibility('trial');
        }

        // 2. Position Incoming (Hidden & Off-screen)
        incoming.style.display = 'block';
        incoming.className = `pa-card-container ${slideInClass}`;
        
        // 3. Mark Outgoing for Exit
        outgoing.className = `pa-card-container ${slideOutClass}`;

        // 4. Trigger Animation (Small delay to allow browser to register the starting position)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                incoming.classList.remove(slideInClass);
                incoming.classList.add('slide-active');
            });
        });

        // 5. Clean up after animation finishes (0.4s matches CSS)
        setTimeout(() => {
            outgoing.style.display = 'none';
            outgoing.classList.remove(slideOutClass);
        }, 400);
    }
};

// Initialize when loaded
document.addEventListener('DOMContentLoaded', () => {
    ProductAdoption.init();
});