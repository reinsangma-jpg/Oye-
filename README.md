# MoneyFlow - Personal Finance Tracker

A modern, beautiful personal finance tracking website with a bright, clean, and slightly cute UI design.

## 🌟 Features

### Dashboard
- **Financial Overview Cards**: Track total balance, monthly income, monthly expenses, and net worth
- **Interactive Charts**: Visualize income vs expenses and balance trends
- **Recent Transactions**: Quick view of latest financial activity
- **Real-time Updates**: All data updates instantly across the application

### Transaction Management
- **Add/Edit/Delete Transactions**: Full CRUD operations for income and expenses
- **Smart Filtering**: Filter by type (all/income/expense) and month
- **Export Data**: Download transaction history as CSV
- **Transaction History**: Beautiful table view with all your financial records

### Asset Portfolio
- **Four Asset Types**:
  - 🏦 Bank Account (2.5% annual interest)
  - 📊 Demat Account (investments)
  - 🔒 Fixed Deposits (7% annual interest)
  - 🛡️ Insurance (total coverage)
- **Asset Distribution Chart**: Visual breakdown of your wealth
- **Projected Growth**: 5-year growth projection with compound interest

### Additional Features
- 🌙 **Dark/Light Mode**: Toggle between themes
- 📱 **Responsive Design**: Works perfectly on mobile and desktop
- 💾 **Local Storage**: All data stored securely on your device
- 🎨 **Beautiful Animations**: Smooth transitions and micro-interactions
- 📊 **Interactive Charts**: Powered by Chart.js

## 🚀 Getting Started

### Installation
1. Download all files to a folder on your computer
2. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, or Edge)
3. That's it! No server or installation required.

### File Structure
```
moneyflow/
├── index.html              # Main dashboard page
├── about.html              # Developer information
├── terms.html              # Terms and conditions
├── style.css               # All styling and animations
├── dashboard.js            # Dashboard controller
├── income-tracker.js       # Transaction management
├── asset-tracker.js        # Asset portfolio management
├── interest-calculator.js  # Compound interest calculations
└── charts.js               # Chart.js visualizations
```

## 📖 How to Use

### Adding Transactions
1. Click the "+ Add Transaction" button in the navigation
2. Select type (Income or Expense)
3. Enter amount, date, and optional notes
4. Click "Save Transaction"

### Managing Assets
1. Navigate to the "Assets" section
2. Click "Update" on any asset card
3. Enter the current value
4. Click "Update Asset"

### Viewing Analytics
- All charts update automatically when you add/edit data
- View income vs expenses comparison
- Track your balance trend over time
- See asset distribution and projected growth

### Exporting Data
1. Go to the "Transactions" section
2. Click the "📊 Export" button
3. Your data will download as a CSV file

### Theme Toggle
- Click the moon/sun icon in the navigation to switch between dark and light modes
- Your preference is saved automatically

## 💡 Tips & Best Practices

1. **Regular Updates**: Update your transactions daily for accurate tracking
2. **Backup Data**: Periodically export your data as CSV for backup
3. **Asset Updates**: Update asset values monthly for better projections
4. **Use Notes**: Add descriptions to transactions for better tracking
5. **Review Charts**: Check the analytics section regularly to understand spending patterns

## 🔒 Privacy & Security

- All data is stored locally in your browser
- No data is sent to any server
- No account or login required
- Clear browser data will delete all stored information
- Use the export feature to backup important data

## 🎯 Interest Calculations

The application uses compound interest formulas:
- **Bank Account**: 2.5% per annum
- **Fixed Deposits**: 7% per annum
- **Formula**: A = P(1 + r)^t

Where:
- A = Final amount
- P = Principal
- r = Interest rate
- t = Time in years

## 🌈 Color Scheme

### Light Mode
- Soft pastel gradient backgrounds
- Bright accent colors (purple, green, coral)
- Clean white cards with glassmorphism

### Dark Mode
- Deep blue/purple gradients
- Neon accent colors
- Semi-transparent cards

## 📱 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables, animations, and gradients
- **JavaScript (ES6+)**: Modular, class-based architecture
- **Chart.js**: Interactive data visualizations
- **Local Storage API**: Client-side data persistence
- **Google Fonts**: Quicksand & DM Sans

## 📝 About the Developer

**Reinhard Son Sangma**
- B.A 4th Semester, Raha College, Nagaon, Assam
- From Dalimbari, West Karbi Anglong, Assam, India
- Passionate about web development and creative digital tools

This project is part of my journey to become a better developer and build useful applications.

## ⚠️ Disclaimer

This application is for personal financial tracking only and does not provide financial advice. Users are responsible for their own financial decisions. Interest calculations are estimates based on standard rates. Always consult qualified financial advisors for investment decisions.

## 📄 License

This project is created for educational and personal use. Feel free to modify and customize for your own needs.

---

**Version**: 1.0.0  
**Last Updated**: March 2026  

Made with ❤️ by Reinhard Son Sangma
