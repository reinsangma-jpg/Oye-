// ===================================
// Charts Manager
// Handles all Chart.js visualizations
// ===================================

class ChartsManager {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        // Wait for DOM and other modules to load
        setTimeout(() => {
            this.createAllCharts();
        }, 100);
    }

    createAllCharts() {
        this.createIncomeExpenseChart();
        this.createBalanceTrendChart();
        this.createAssetDistributionChart();
        this.createProjectedGrowthChart();
    }

    updateAllCharts() {
        this.updateIncomeExpenseChart();
        this.updateBalanceTrendChart();
        this.updateAssetDistributionChart();
        this.updateProjectedGrowthChart();
    }

    // Income vs Expense Chart
    createIncomeExpenseChart() {
        const ctx = document.getElementById('incomeExpenseChart');
        if (!ctx) return;

        const data = this.getMonthlyIncomeExpenseData();
        
        this.charts.incomeExpense = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Income',
                        data: data.income,
                        backgroundColor: 'rgba(86, 171, 47, 0.8)',
                        borderColor: 'rgb(86, 171, 47)',
                        borderWidth: 2,
                        borderRadius: 8
                    },
                    {
                        label: 'Expenses',
                        data: data.expenses,
                        backgroundColor: 'rgba(255, 107, 107, 0.8)',
                        borderColor: 'rgb(255, 107, 107)',
                        borderWidth: 2,
                        borderRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 13,
                                family: "'DM Sans', sans-serif"
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        borderRadius: 8,
                        callbacks: {
                            label: (context) => {
                                return context.dataset.label + ': ₹' + 
                                    Math.round(context.parsed.y).toLocaleString('en-IN');
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => '₹' + (value / 1000) + 'k'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    updateIncomeExpenseChart() {
        if (!this.charts.incomeExpense) return;
        
        const data = this.getMonthlyIncomeExpenseData();
        this.charts.incomeExpense.data.labels = data.labels;
        this.charts.incomeExpense.data.datasets[0].data = data.income;
        this.charts.incomeExpense.data.datasets[1].data = data.expenses;
        this.charts.incomeExpense.update();
    }

    // Balance Trend Chart
    createBalanceTrendChart() {
        const ctx = document.getElementById('balanceTrendChart');
        if (!ctx) return;

        const data = this.getBalanceTrendData();
        
        this.charts.balanceTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Balance',
                    data: data.balance,
                    borderColor: 'rgb(102, 126, 234)',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: 'rgb(102, 126, 234)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        borderRadius: 8,
                        callbacks: {
                            label: (context) => {
                                return 'Balance: ₹' + 
                                    Math.round(context.parsed.y).toLocaleString('en-IN');
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => '₹' + (value / 1000) + 'k'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    updateBalanceTrendChart() {
        if (!this.charts.balanceTrend) return;
        
        const data = this.getBalanceTrendData();
        this.charts.balanceTrend.data.labels = data.labels;
        this.charts.balanceTrend.data.datasets[0].data = data.balance;
        this.charts.balanceTrend.update();
    }

    // Asset Distribution Chart
    createAssetDistributionChart() {
        const ctx = document.getElementById('assetDistributionChart');
        if (!ctx) return;

        const data = window.assetTracker?.getAssetDistribution() || {
            labels: ['Bank', 'Demat', 'Fixed Deposits', 'Insurance'],
            values: [0, 0, 0, 0]
        };
        
        this.charts.assetDistribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        'rgba(79, 172, 254, 0.8)',
                        'rgba(67, 233, 123, 0.8)',
                        'rgba(250, 112, 154, 0.8)',
                        'rgba(48, 207, 208, 0.8)'
                    ],
                    borderColor: [
                        'rgb(79, 172, 254)',
                        'rgb(67, 233, 123)',
                        'rgb(250, 112, 154)',
                        'rgb(48, 207, 208)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 13,
                                family: "'DM Sans', sans-serif"
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        borderRadius: 8,
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return label + ': ₹' + Math.round(value).toLocaleString('en-IN') + 
                                    ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
    }

    updateAssetDistributionChart() {
        if (!this.charts.assetDistribution) return;
        
        const data = window.assetTracker?.getAssetDistribution() || {
            labels: ['Bank', 'Demat', 'Fixed Deposits', 'Insurance'],
            values: [0, 0, 0, 0]
        };
        
        this.charts.assetDistribution.data.datasets[0].data = data.values;
        this.charts.assetDistribution.update();
    }

    // Projected Growth Chart
    createProjectedGrowthChart() {
        const ctx = document.getElementById('projectedGrowthChart');
        if (!ctx) return;

        const projections = window.assetTracker?.calculateProjectedGrowth(5) || [];
        
        this.charts.projectedGrowth = new Chart(ctx, {
            type: 'line',
            data: {
                labels: projections.map(p => 'Year ' + p.year),
                datasets: [
                    {
                        label: 'Bank',
                        data: projections.map(p => p.bank),
                        borderColor: 'rgb(79, 172, 254)',
                        backgroundColor: 'rgba(79, 172, 254, 0.1)',
                        borderWidth: 2,
                        tension: 0.4
                    },
                    {
                        label: 'Fixed Deposits',
                        data: projections.map(p => p.fd),
                        borderColor: 'rgb(250, 112, 154)',
                        backgroundColor: 'rgba(250, 112, 154, 0.1)',
                        borderWidth: 2,
                        tension: 0.4
                    },
                    {
                        label: 'Total',
                        data: projections.map(p => p.total),
                        borderColor: 'rgb(102, 126, 234)',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 13,
                                family: "'DM Sans', sans-serif"
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        borderRadius: 8,
                        callbacks: {
                            label: (context) => {
                                return context.dataset.label + ': ₹' + 
                                    Math.round(context.parsed.y).toLocaleString('en-IN');
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => '₹' + (value / 1000) + 'k'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    updateProjectedGrowthChart() {
        if (!this.charts.projectedGrowth) return;
        
        const projections = window.assetTracker?.calculateProjectedGrowth(5) || [];
        this.charts.projectedGrowth.data.labels = projections.map(p => 'Year ' + p.year);
        this.charts.projectedGrowth.data.datasets[0].data = projections.map(p => p.bank);
        this.charts.projectedGrowth.data.datasets[1].data = projections.map(p => p.fd);
        this.charts.projectedGrowth.data.datasets[2].data = projections.map(p => p.total);
        this.charts.projectedGrowth.update();
    }

    // Helper: Get monthly income/expense data for last 6 months
    getMonthlyIncomeExpenseData() {
        const transactions = window.dashboard?.getTransactions() || [];
        const months = [];
        const income = [];
        const expenses = [];

        // Get last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const month = date.toLocaleDateString('en-IN', { month: 'short' });
            const year = date.getFullYear();
            const monthNum = date.getMonth();

            months.push(month);

            let monthIncome = 0;
            let monthExpense = 0;

            transactions.forEach(t => {
                const tDate = new Date(t.date);
                if (tDate.getMonth() === monthNum && tDate.getFullYear() === year) {
                    if (t.type === 'income') {
                        monthIncome += parseFloat(t.amount);
                    } else {
                        monthExpense += parseFloat(t.amount);
                    }
                }
            });

            income.push(monthIncome);
            expenses.push(monthExpense);
        }

        return { labels: months, income, expenses };
    }

    // Helper: Get balance trend data for last 6 months
    getBalanceTrendData() {
        const transactions = window.dashboard?.getTransactions() || [];
        const months = [];
        const balance = [];

        // Get last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const month = date.toLocaleDateString('en-IN', { month: 'short' });
            const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            months.push(month);

            // Calculate cumulative balance up to end of month
            let totalIncome = 0;
            let totalExpense = 0;

            transactions.forEach(t => {
                const tDate = new Date(t.date);
                if (tDate <= endDate) {
                    if (t.type === 'income') {
                        totalIncome += parseFloat(t.amount);
                    } else {
                        totalExpense += parseFloat(t.amount);
                    }
                }
            });

            balance.push(totalIncome - totalExpense);
        }

        return { labels: months, balance };
    }
}

// Initialize charts when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chartsManager = new ChartsManager();
});
