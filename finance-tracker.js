// Finance Tracker Manager
const financeManager = {
    dailyEntries: [],
    assets: {
        bankAccount: 0,
        dematAccount: 0,
        fixedDeposits: 0,
        insurance: 0
    },
    storageKey: {
        daily: 'chessmaster_daily_finance',
        assets: 'chessmaster_assets'
    }
};

// Initialize Finance Tracker
function initFinanceTracker() {
    loadFinanceData();
    setupFinanceControls();
    updateFinanceDisplay();
}

// Load finance data from localStorage
function loadFinanceData() {
    const savedDaily = localStorage.getItem(financeManager.storageKey.daily);
    const savedAssets = localStorage.getItem(financeManager.storageKey.assets);
    
    if (savedDaily) {
        financeManager.dailyEntries = JSON.parse(savedDaily);
    }
    
    if (savedAssets) {
        financeManager.assets = JSON.parse(savedAssets);
    }
}

// Save finance data to localStorage
function saveFinanceData() {
    localStorage.setItem(
        financeManager.storageKey.daily,
        JSON.stringify(financeManager.dailyEntries)
    );
    localStorage.setItem(
        financeManager.storageKey.assets,
        JSON.stringify(financeManager.assets)
    );
}

// Setup finance controls
function setupFinanceControls() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${targetTab}Tab`).classList.add('active');
            
            window.playSound('click');
        });
    });
    
    // Daily form submission
    const dailyForm = document.getElementById('dailyForm');
    dailyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addDailyEntry();
    });
    
    // Assets form submission
    const assetsForm = document.getElementById('assetsForm');
    assetsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateAssets();
    });
    
    // Set today's date as default
    document.getElementById('entryDate').valueAsDate = new Date();
    
    // Load current assets into form
    document.getElementById('bankAccount').value = financeManager.assets.bankAccount;
    document.getElementById('dematAccount').value = financeManager.assets.dematAccount;
    document.getElementById('fixedDeposits').value = financeManager.assets.fixedDeposits;
    document.getElementById('insurance').value = financeManager.assets.insurance;
}

// Add daily entry
function addDailyEntry() {
    const date = document.getElementById('entryDate').value;
    const income = parseFloat(document.getElementById('dailyIncome').value) || 0;
    const expense = parseFloat(document.getElementById('dailyExpense').value) || 0;
    const note = document.getElementById('entryNote').value;
    
    const entry = {
        id: Date.now(),
        date,
        income,
        expense,
        balance: income - expense,
        note
    };
    
    financeManager.dailyEntries.unshift(entry);
    
    // Keep only last 100 entries
    financeManager.dailyEntries = financeManager.dailyEntries.slice(0, 100);
    
    saveFinanceData();
    updateFinanceDisplay();
    
    // Reset form
    document.getElementById('dailyIncome').value = '';
    document.getElementById('dailyExpense').value = '';
    document.getElementById('entryNote').value = '';
    
    window.playSound('click');
}

// Update assets
function updateAssets() {
    financeManager.assets.bankAccount = parseFloat(document.getElementById('bankAccount').value) || 0;
    financeManager.assets.dematAccount = parseFloat(document.getElementById('dematAccount').value) || 0;
    financeManager.assets.fixedDeposits = parseFloat(document.getElementById('fixedDeposits').value) || 0;
    financeManager.assets.insurance = parseFloat(document.getElementById('insurance').value) || 0;
    
    saveFinanceData();
    updateFinanceDisplay();
    updateInterestProjection();
    
    window.playSound('click');
}

// Update finance display
function updateFinanceDisplay() {
    const stats = calculateFinanceStats();
    
    document.getElementById('netWorth').textContent = formatCurrency(stats.netWorth);
    document.getElementById('monthlyIncome').textContent = formatCurrency(stats.monthlyIncome);
    document.getElementById('monthlyExpenses').textContent = formatCurrency(stats.monthlyExpenses);
    document.getElementById('monthlySavings').textContent = formatCurrency(stats.monthlySavings);
    
    displayDailyEntries();
    updateInterestProjection();
    updateCharts();
}

// Calculate finance statistics
function calculateFinanceStats() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let monthlyIncome = 0;
    let monthlyExpenses = 0;
    
    financeManager.dailyEntries.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
            monthlyIncome += entry.income;
            monthlyExpenses += entry.expense;
        }
    });
    
    const monthlySavings = monthlyIncome - monthlyExpenses;
    
    const netWorth = financeManager.assets.bankAccount +
                     financeManager.assets.dematAccount +
                     financeManager.assets.fixedDeposits +
                     financeManager.assets.insurance;
    
    return {
        netWorth,
        monthlyIncome,
        monthlyExpenses,
        monthlySavings
    };
}

// Display daily entries
function displayDailyEntries() {
    const container = document.getElementById('dailyEntries');
    
    if (financeManager.dailyEntries.length === 0) {
        container.innerHTML = '<p class="empty-state">No entries yet. Add your first entry!</p>';
        return;
    }
    
    container.innerHTML = financeManager.dailyEntries
        .slice(0, 20)
        .map(entry => createEntryCard(entry))
        .join('');
    
    // Add delete handlers
    document.querySelectorAll('.delete-entry').forEach(btn => {
        btn.addEventListener('click', () => {
            const entryId = parseInt(btn.dataset.entryId);
            deleteEntry(entryId);
        });
    });
}

// Create entry card
function createEntryCard(entry) {
    const date = new Date(entry.date).toLocaleDateString();
    const balanceColor = entry.balance >= 0 ? '#27ae60' : '#e74c3c';
    
    return `
        <div class="entry-card" style="
            background: rgba(255, 255, 255, 0.7);
            padding: 1rem;
            margin-bottom: 0.5rem;
            border-radius: 12px;
            border-left: 4px solid ${balanceColor};
        ">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${date}</strong>
                    ${entry.note ? `<div style="font-size: 0.85rem; color: #7F8C8D;">${entry.note}</div>` : ''}
                </div>
                <div style="text-align: right;">
                    <div style="color: #27ae60;">+${formatCurrency(entry.income)}</div>
                    <div style="color: #e74c3c;">-${formatCurrency(entry.expense)}</div>
                    <div style="font-weight: 600; color: ${balanceColor};">
                        ${formatCurrency(entry.balance)}
                    </div>
                </div>
                <button class="delete-entry" data-entry-id="${entry.id}" style="
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    cursor: pointer;
                ">Delete</button>
            </div>
        </div>
    `;
}

// Delete entry
function deleteEntry(entryId) {
    financeManager.dailyEntries = financeManager.dailyEntries.filter(e => e.id !== entryId);
    saveFinanceData();
    updateFinanceDisplay();
}

// Update interest projection
function updateInterestProjection() {
    const container = document.getElementById('interestProjection');
    
    const bankInterest = financeManager.assets.bankAccount * 0.025;
    const fdInterest = financeManager.assets.fixedDeposits * 0.07;
    const totalInterest = bankInterest + fdInterest;
    
    const projectedBank = financeManager.assets.bankAccount + bankInterest;
    const projectedFD = financeManager.assets.fixedDeposits + fdInterest;
    const projectedTotal = financeManager.assets.bankAccount +
                           financeManager.assets.dematAccount +
                           financeManager.assets.fixedDeposits +
                           financeManager.assets.insurance +
                           totalInterest;
    
    container.innerHTML = `
        <div style="display: grid; gap: 1rem;">
            <div style="padding: 1rem; background: rgba(255,255,255,0.5); border-radius: 8px;">
                <strong>Bank Account Interest (2.5%)</strong>
                <div style="font-size: 1.2rem; color: #27ae60; margin-top: 0.5rem;">
                    +${formatCurrency(bankInterest)}
                </div>
                <div style="font-size: 0.9rem; color: #7F8C8D;">
                    Projected: ${formatCurrency(projectedBank)}
                </div>
            </div>
            <div style="padding: 1rem; background: rgba(255,255,255,0.5); border-radius: 8px;">
                <strong>Fixed Deposit Interest (7%)</strong>
                <div style="font-size: 1.2rem; color: #27ae60; margin-top: 0.5rem;">
                    +${formatCurrency(fdInterest)}
                </div>
                <div style="font-size: 0.9rem; color: #7F8C8D;">
                    Projected: ${formatCurrency(projectedFD)}
                </div>
            </div>
            <div style="padding: 1rem; background: linear-gradient(135deg, #43e97b, #38f9d7); border-radius: 8px; color: white;">
                <strong>Total Annual Interest</strong>
                <div style="font-size: 1.5rem; margin-top: 0.5rem;">
                    +${formatCurrency(totalInterest)}
                </div>
                <div style="font-size: 0.9rem; opacity: 0.9;">
                    Projected Net Worth: ${formatCurrency(projectedTotal)}
                </div>
            </div>
        </div>
    `;
}

// Update charts (simplified - would use Chart.js in production)
function updateCharts() {
    // This would create actual charts using Chart.js
    // For now, creating simple text-based visualization
    const incomeExpenseChart = document.getElementById('incomeExpenseChart');
    const assetChart = document.getElementById('assetChart');
    
    if (incomeExpenseChart) {
        incomeExpenseChart.style.cssText = 'width: 100%; height: 300px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.5); border-radius: 12px;';
        incomeExpenseChart.textContent = 'Chart: Income vs Expenses visualization would appear here';
    }
    
    if (assetChart) {
        assetChart.style.cssText = 'width: 100%; height: 300px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.5); border-radius: 12px;';
        assetChart.textContent = 'Chart: Asset distribution visualization would appear here';
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initFinanceTracker();
});
