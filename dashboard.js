// ===================================
// Dashboard Controller
// Manages navigation, theme, and UI interactions
// ===================================

class DashboardController {
    constructor() {
        this.currentSection = 'dashboard';
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupEventListeners();
        this.updateDashboard();
        
        // Update dashboard every 5 seconds
        setInterval(() => this.updateDashboard(), 5000);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                if (!e.target.getAttribute('href').includes('.html')) {
                    e.preventDefault();
                    const section = e.target.getAttribute('href').substring(1);
                    this.navigateToSection(section);
                }
            });
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // View all transactions
        const viewAllBtn = document.getElementById('viewAllTransactions');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => {
                this.navigateToSection('income');
            });
        }
    }

    navigateToSection(sectionId) {
        // Update active section
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });

        this.currentSection = sectionId;

        // Refresh section-specific data
        if (sectionId === 'dashboard') {
            this.updateDashboard();
        } else if (sectionId === 'income') {
            window.incomeTracker?.refreshTransactions();
        } else if (sectionId === 'assets') {
            window.assetTracker?.refreshAssets();
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.theme);
    }

    applyTheme() {
        const body = document.body;
        const themeIcon = document.querySelector('.theme-icon');
        
        if (this.theme === 'dark') {
            body.classList.add('dark-mode');
            themeIcon.textContent = '☀️';
        } else {
            body.classList.remove('dark-mode');
            themeIcon.textContent = '🌙';
        }
    }

    updateDashboard() {
        const transactions = this.getTransactions();
        const assets = this.getAssets();
        
        // Calculate totals
        const stats = this.calculateStats(transactions);
        
        // Update stat cards
        this.updateStatCard('totalBalance', stats.balance, stats.balanceChange);
        this.updateStatCard('monthlyIncome', stats.monthlyIncome, stats.incomeChange);
        this.updateStatCard('monthlyExpenses', stats.monthlyExpenses, stats.expenseChange);
        
        // Calculate net worth
        const netWorth = assets.bank + assets.demat + assets.fd + assets.insurance;
        const previousNetWorth = parseFloat(localStorage.getItem('previousNetWorth')) || netWorth;
        const networthChange = previousNetWorth > 0 ? 
            ((netWorth - previousNetWorth) / previousNetWorth * 100).toFixed(1) : 0;
        
        this.updateStatCard('totalNetWorth', netWorth, networthChange);
        localStorage.setItem('previousNetWorth', netWorth);
        
        // Update recent transactions
        this.updateRecentTransactions(transactions.slice(0, 5));
    }

    calculateStats(transactions) {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        let totalIncome = 0;
        let totalExpense = 0;
        let monthlyIncome = 0;
        let monthlyExpense = 0;
        let lastMonthIncome = 0;
        let lastMonthExpense = 0;

        transactions.forEach(t => {
            const tDate = new Date(t.date);
            const amount = parseFloat(t.amount);

            if (t.type === 'income') {
                totalIncome += amount;
                if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
                    monthlyIncome += amount;
                }
                if (tDate.getMonth() === lastMonth && tDate.getFullYear() === lastMonthYear) {
                    lastMonthIncome += amount;
                }
            } else {
                totalExpense += amount;
                if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
                    monthlyExpense += amount;
                }
                if (tDate.getMonth() === lastMonth && tDate.getFullYear() === lastMonthYear) {
                    lastMonthExpense += amount;
                }
            }
        });

        const balance = totalIncome - totalExpense;
        const lastMonthBalance = lastMonthIncome - lastMonthExpense;
        const balanceChange = lastMonthBalance > 0 ? 
            ((balance - lastMonthBalance) / lastMonthBalance * 100).toFixed(1) : 0;
        
        const incomeChange = lastMonthIncome > 0 ? 
            ((monthlyIncome - lastMonthIncome) / lastMonthIncome * 100).toFixed(1) : 0;
        
        const expenseChange = lastMonthExpense > 0 ? 
            ((monthlyExpense - lastMonthExpense) / lastMonthExpense * 100).toFixed(1) : 0;

        return {
            balance,
            balanceChange,
            monthlyIncome,
            incomeChange,
            monthlyExpense,
            expenseChange,
            totalIncome,
            totalExpense
        };
    }

    updateStatCard(elementId, value, change) {
        const valueElement = document.getElementById(elementId);
        const trendElement = document.getElementById(elementId.replace('total', '').replace('monthly', '') + 'Trend');
        
        if (valueElement) {
            valueElement.textContent = this.formatCurrency(value);
            
            // Add number animation
            this.animateValue(valueElement, 0, value, 1000);
        }
        
        if (trendElement) {
            const changeValue = parseFloat(change);
            trendElement.textContent = `${changeValue >= 0 ? '+' : ''}${changeValue}%`;
            trendElement.className = 'card-trend ' + (changeValue >= 0 ? 'positive' : 'negative');
        }
    }

    animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = this.formatCurrency(Math.round(current));
        }, 16);
    }

    updateRecentTransactions(transactions) {
        const container = document.getElementById('recentTransactionsList');
        if (!container) return;

        if (transactions.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No transactions yet. Add your first transaction!</p>';
            return;
        }

        container.innerHTML = transactions.map(t => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-icon ${t.type}">
                        ${t.type === 'income' ? '📈' : '💸'}
                    </div>
                    <div class="transaction-details">
                        <h4>${t.notes || (t.type === 'income' ? 'Income' : 'Expense')}</h4>
                        <p>${this.formatDate(t.date)}</p>
                    </div>
                </div>
                <div class="transaction-amount ${t.type}">
                    ${t.type === 'income' ? '+' : '-'}${this.formatCurrency(t.amount)}
                </div>
            </div>
        `).join('');
    }

    getTransactions() {
        const data = localStorage.getItem('transactions');
        return data ? JSON.parse(data) : [];
    }

    getAssets() {
        const data = localStorage.getItem('assets');
        return data ? JSON.parse(data) : {
            bank: 0,
            demat: 0,
            fd: 0,
            insurance: 0
        };
    }

    formatCurrency(amount) {
        return '₹' + Math.round(amount).toLocaleString('en-IN');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
            });
        }
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new DashboardController();
});
