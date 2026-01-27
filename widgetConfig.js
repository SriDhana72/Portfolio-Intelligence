/* ==========================================
   WIDGET CUSTOMIZATION LOGIC
   ========================================== */

// 1. Registry of Custom widgets
// Ensure these IDs exist on the parent DIVs in your HTML
const widgetRegistry = [
    { id: 'widget-wallet', label: 'Wallet & Credits' },
    { id: 'widget-desk', label: 'Desk Overview' },
    { id: 'widget-renewal', label: 'Renewal Health' },
    { id: 'widget-upsell', label: 'Upsell & Cross-sell' },
    { id: 'widget-adoption', label: 'Product Adoption' },
    { id: 'widget-health', label: 'Portfolio Health' },
    { id: 'widget-churn', label: 'Churn Insights' },
    { id: 'widget-arr-trends', label: 'ARR Analytics (Graph)' },
    { id: 'widget-gmv', label: 'Industry GMV' },
    { id: 'widget-actions', label: 'Action Items' },
    { id: 'widget-growth', label: 'Growth Opportunities' },
    { id: 'widget-at-risk', label: 'At-Risk Accounts' }
];

// 2. Load State from LocalStorage
function loadWidgetPreferences() {
    const saved = localStorage.getItem('pm_dashboard_widgets');
    if (saved) return JSON.parse(saved);
    // Default: All visible
    const defaults = {};
    widgetRegistry.forEach(w => defaults[w.id] = true);
    return defaults;
}

// 3. Apply Visibility based on State
function applyWidgetVisibility() {
    const prefs = loadWidgetPreferences();
    
    widgetRegistry.forEach(widget => {
        const el = document.getElementById(widget.id);
        if (el) {
            if (prefs[widget.id] === false) {
                // Hide it
                el.style.display = 'none';
            } else {
                // Restore display. 
                // Removing inline style allows CSS to take back control (flex/block)
                el.style.display = ''; 
            }
        }
    });
}

// 4. Render the Modal List (Updated for Toggle Switches)
function renderWidgetConfigModal() {
    const list = document.getElementById('widgetToggleList');
    if (!list) return; 
    
    const prefs = loadWidgetPreferences();
    list.innerHTML = '';

    widgetRegistry.forEach(widget => {
        const item = document.createElement('div'); // Changed from label to div container
        item.className = 'widget-toggle-item';
        
        const isChecked = prefs[widget.id] !== false; 
        
        item.innerHTML = `
            <span class="widget-toggle-label">${widget.label}</span>
            <label class="toggle-switch">
                <input type="checkbox" data-id="${widget.id}" ${isChecked ? 'checked' : ''}>
                <span class="slider"></span>
            </label>
        `;
        list.appendChild(item);
    });
}

// 5. Save Changes
function saveWidgetConfig() {
    const checkboxes = document.querySelectorAll('#widgetToggleList input[type="checkbox"]');
    const prefs = {};
    
    checkboxes.forEach(cb => {
        prefs[cb.dataset.id] = cb.checked;
    });

    localStorage.setItem('pm_dashboard_widgets', JSON.stringify(prefs));
    applyWidgetVisibility();
    
    // Close Modal
    const modal = document.getElementById('widgetConfigModal');
    if (modal) modal.classList.remove('show-flex');
    
    // Show Toast (Using your existing toast element)
    const toast = document.getElementById("toast");
    if(toast) {
        toast.textContent = "Dashboard Layout Updated!";
        toast.className = "toast show success";
        setTimeout(() => toast.className = toast.className.replace("show", ""), 3000);
    }
}

// 6. Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Apply saved state immediately on load
    applyWidgetVisibility();

    // Modal Triggers
    const openBtn = document.getElementById('openWidgetConfigBtn');
    const closeBtn = document.getElementById('closeWidgetConfigBtn');
    const saveBtn = document.getElementById('saveWidgetsBtn');
    const resetBtn = document.getElementById('resetWidgetsBtn');
    const modal = document.getElementById('widgetConfigModal');

    if(openBtn && modal) {
        openBtn.addEventListener('click', () => {
            renderWidgetConfigModal();
            modal.classList.add('show-flex');
        });
    }

    if(closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.classList.remove('show-flex'));
    }
    
    if(saveBtn) {
        saveBtn.addEventListener('click', saveWidgetConfig);
    }

    if(resetBtn) {
        resetBtn.addEventListener('click', () => {
            localStorage.removeItem('pm_dashboard_widgets');
            renderWidgetConfigModal(); // Re-render logic to show all checked
            saveWidgetConfig(); // Save clean state
        });
    }
    
    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show-flex');
        }
    });
});