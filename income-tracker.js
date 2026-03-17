// ===================================
// Income Tracker
// Manages all income and expense transactions
// ===================================

class IncomeTracker {
    constructor() {
        this.transactions = this.loadTransactions();
        this.currentFilter = 'all';
        this.currentMonth = null;
        this.editingId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.refreshTransactions();
        this.setDefaultDate();
    }

    setupEventListeners() {
        // Add transaction button
        const addBtn = document.getElementById('addTransactionBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openModal());
        }

        // Modal controls
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelTransaction');
        const modal = document.getElementById('transactionModal');

        if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeModal());
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }

        // Form submission
        const form = document.getElementById('transactionForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveTransaction();
            });
        }

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.refreshTransactions();
            });
        });

        // Month filter
        const monthFilter = document.getElementById('monthFilter');
        if (monthFilter) {
            monthFilter.addEventListener('change', (e) => {
                this.currentMonth = e.target.value;
                this.refreshTransactions();
            });
        }

        // Export data
        const exportBtn = document.getElementById('exportData');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
    }

    setDefaultDate() {
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    }

    openModal(transaction = null) {
        const modal = document.getElementById('transactionModal');
        const form = document.getElementById('transactionForm');
        const title = document.getElementById('modalTitle');

        if (transaction) {
            // Edit mode
            this.editingId = transaction.id;
            title.textContent = 'Edit Transaction';
            document.querySelector(`input[name="type"][value="${transaction.type}"]`).checked = true;
            document.getElementById('amount').value = transaction.amount;
            document.getElementById('date').value = transaction.date;
            document.getElementById('notes').value = transaction.notes;
        } else {
            // Add mode
            this.editingId = null;
            title.textContent = 'Add Transaction';
            form.reset();
            this.setDefaultDate();
        }

        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('transactionModal');
        modal.classList.remove('active');
        this.editingId = null;
    }

    saveTransaction() {
        const type = document.querySelector('input[name="type"]:checked').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const date = document.getElementById('date').value;
        const notes = document.getElementById('notes').value;

        if (!amount || !date) {
            alert('Please fill in all required fields');
            return;
        }

        if (this.editingId) {
            // Update existing transaction
            const index = this.transactions.findIndex(t => t.id === this.editingId);
            if (index !== -1) {
                this.transactions[index] = {
                    ...this.transactions[index],
                    type,
                    amount,
                    date,
                    notes
                };
            }
        } else {
            // Add new transaction
            const transaction = {
                id: Date.now().toString(),
                type,
                amount,
                date,
                notes,
                createdAt: new Date().toISOString()
            };
            this.transactions.unshift(transaction);
        }

        this.saveTransactions();
        this.refreshTransactions();
        this.closeModal();
        
        // Update dashboard
        if (window.dashboard) {
            window.dashboard.updateDashboard();
        }
        
        // Update charts
        if (window.chartsManager) {
            window.chartsManager.updateAllCharts();
        }

        // Show success message
        this.showNotification(this.editingId ? 'Transaction updated!' : 'Transaction added!');
    }

    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveTransactions();
            this.refreshTransactions();
            
            if (window.dashboard) {
                window.dashboard.updateDashboard();
            }
            
            if (window.chartsManager) {
                window.chartsManager.updateAllCharts();
            }

            this.showNotification('Transaction deleted!');
        }
    }

    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (transaction) {
            this.openModal(transaction);
        }
    }

    refreshTransactions() {
        let filtered = [...this.transactions];

        // Apply type filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(t => t.type === this.currentFilter);
        }

        // Apply month filter
        if (this.currentMonth) {
            const [year, month] = this.currentMonth.split('-');
            filtered = filtered.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getFullYear() === parseInt(year) && 
                       tDate.getMonth() === parseInt(month) - 1;
            });
        }

        this.renderTransactions(filtered);
    }

    renderTransactions(transactions) {
        const tbody = document.getElementById('transactionsTableBody');
        if (!tbody) return;

        if (transactions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📊</div>
                        <p>No transactions found</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = transactions.map(t => `
            <tr>
                <td>${this.formatDate(t.date)}</td>
                <td>
                    <span class="type-badge ${t.type}">
                        ${t.type === 'income' ? '📈 Income' : '💸 Expense'}
                    </span>
                </td>
                <td style="font-weight: 700; color: ${t.type === 'income' ? '#56ab2f' : '#ff6b6b'};">
                    ${t.type === 'income' ? '+' : '-'}${this.formatCurrency(t.amount)}
                </td>
                <td>${t.notes || '-'}</td>
                <td>
                    <button class="action-btn" onclick="window.incomeTracker.editTransaction('${t.id}')" title="Edit">
                        ✏️
                    </button>
                    <button class="action-btn" onclick="window.incomeTracker.deleteTransaction('${t.id}')" title="Delete">
                        🗑️
                    </button>
                </td>
            </tr>
        `).join('');
    }

    exportData() {
        const data = this.transactions.map(t => ({
            Date: t.date,
            Type: t.type,
            Amount: t.amount,
            Notes: t.notes
        }));

        // Convert to CSV
        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => headers.map(header => row[header]).join(','))
        ].join('\n');

        // Download
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.showNotification('Data exported successfully!');
    }

    loadTransactions() {
        const data = localStorage.getItem('transactions');
        return data ? JSON.parse(data) : [];
    }

    saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    formatCurrency(amount) {
        return '₹' + Math.round(amount).toLocaleString('en-IN');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            z-index: 3000;
            animation: slideIn 0.3s ease;
            font-weight: 600;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize income tracker when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.incomeTracker = new IncomeTracker();
});
