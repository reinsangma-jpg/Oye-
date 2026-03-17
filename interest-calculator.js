// ===================================
// Interest Calculator
// Calculates compound interest for bank and FD
// ===================================

class InterestCalculator {
    constructor() {
        this.BANK_RATE = 0.025; // 2.5% per annum
        this.FD_RATE = 0.07;    // 7% per annum
    }

    // Calculate compound interest
    // Formula: A = P(1 + r)^t
    // A = final amount
    // P = principal
    // r = rate of interest
    // t = time in years
    calculateCompoundInterest(principal, rate, years) {
        return principal * Math.pow(1 + rate, years);
    }

    // Calculate bank balance after n years
    calculateBankGrowth(principal, years) {
        return this.calculateCompoundInterest(principal, this.BANK_RATE, years);
    }

    // Calculate FD value after n years
    calculateFDGrowth(principal, years) {
        return this.calculateCompoundInterest(principal, this.FD_RATE, years);
    }

    // Get yearly breakdown for bank account
    getBankYearlyBreakdown(principal, years = 5) {
        const breakdown = [];
        for (let year = 0; year <= years; year++) {
            const amount = this.calculateBankGrowth(principal, year);
            const interest = amount - principal;
            breakdown.push({
                year: year,
                principal: principal,
                interest: interest,
                total: amount,
                rate: this.BANK_RATE * 100
            });
        }
        return breakdown;
    }

    // Get yearly breakdown for FD
    getFDYearlyBreakdown(principal, years = 5) {
        const breakdown = [];
        for (let year = 0; year <= years; year++) {
            const amount = this.calculateFDGrowth(principal, year);
            const interest = amount - principal;
            breakdown.push({
                year: year,
                principal: principal,
                interest: interest,
                total: amount,
                rate: this.FD_RATE * 100
            });
        }
        return breakdown;
    }

    // Calculate total portfolio growth (bank + FD)
    calculateTotalGrowth(bankPrincipal, fdPrincipal, years = 5) {
        const projections = [];
        
        for (let year = 0; year <= years; year++) {
            const bankAmount = this.calculateBankGrowth(bankPrincipal, year);
            const fdAmount = this.calculateFDGrowth(fdPrincipal, year);
            const total = bankAmount + fdAmount;
            
            projections.push({
                year: year,
                bank: bankAmount,
                fd: fdAmount,
                total: total,
                totalInterest: total - (bankPrincipal + fdPrincipal)
            });
        }
        
        return projections;
    }

    // Calculate monthly contribution growth
    // For SIP-like calculations
    calculateMonthlyContribution(monthlyAmount, annualRate, months) {
        const monthlyRate = annualRate / 12;
        let total = 0;
        
        for (let month = 1; month <= months; month++) {
            const monthsRemaining = months - month + 1;
            total += monthlyAmount * Math.pow(1 + monthlyRate, monthsRemaining / 12);
        }
        
        return total;
    }

    // Calculate how long to reach a target amount
    calculateTimeToTarget(principal, targetAmount, annualRate) {
        if (principal >= targetAmount) return 0;
        return Math.log(targetAmount / principal) / Math.log(1 + annualRate);
    }

    // Compare different investment scenarios
    compareScenarios(amount, years = 5) {
        return {
            bank: {
                rate: this.BANK_RATE * 100,
                finalAmount: this.calculateBankGrowth(amount, years),
                totalInterest: this.calculateBankGrowth(amount, years) - amount
            },
            fd: {
                rate: this.FD_RATE * 100,
                finalAmount: this.calculateFDGrowth(amount, years),
                totalInterest: this.calculateFDGrowth(amount, years) - amount
            }
        };
    }

    // Format currency
    formatCurrency(amount) {
        return '₹' + Math.round(amount).toLocaleString('en-IN');
    }

    // Format percentage
    formatPercentage(rate) {
        return (rate * 100).toFixed(2) + '%';
    }
}

// Initialize interest calculator
window.interestCalculator = new InterestCalculator();
