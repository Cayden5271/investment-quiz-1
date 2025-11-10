# 💰 Investment Quiz - Educational Financial Planning Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF)](https://vitejs.dev/)

A production-ready, multi-page React + TypeScript web application that provides personalized, educational investment planning recommendations for young and inexperienced investors.

## 🚀 Live Demo

[Try it out here!](https://cayden5271.github.io/investment-quiz-1/) *(Set up GitHub Pages to enable)*

Or deploy to [Vercel](https://vercel.com) for instant live demo!

## ⚠️ Important Disclaimer

**This tool is for educational purposes only and is not financial advice.** Investing involves risk, including loss of principal. Consider consulting a fiduciary financial professional for personalized advice.

## ✨ Features

- 📊 **Multi-page quiz flow** covering profile, cash flow, goals, risk tolerance, and account types
- 🎯 **Personalized portfolio recommendations** based on risk score and age
- 📋 **Action plan** with prioritized steps (emergency fund, debt payoff, employer match, investments)
- 🎁 **Goal buckets** for short-term and long-term savings
- 📥 **Export functionality** (PDF, CSV, JSON)
- 📚 **Educational content** explaining the "why" behind recommendations
- ⚖️ **Compliance disclaimers** throughout
- 💾 **Local storage** for progress saving
- 📱 **Mobile-responsive** design with Tailwind CSS
- ✅ **70+ unit tests** for core logic functions

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **jsPDF** for PDF export
- **Vitest** for unit testing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/investment-quiz.git
cd investment-quiz
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser** to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Run Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 📁 Project Structure

```
investment-quiz/
├── src/
│   ├── components/       # Reusable components (Footer, ProgressBar)
│   ├── pages/           # Page components (Welcome, Profile, Results, etc.)
│   ├── utils/           # Business logic, storage, export utilities
│   │   ├── logic.ts    # Core portfolio logic (with tests)
│   │   ├── allocation.ts # Pure allocation functions (with tests)
│   │   ├── storage.ts  # LocalStorage utilities
│   │   └── export.ts   # PDF/CSV/JSON export
│   ├── test/           # Test setup files
│   ├── types.ts         # TypeScript interfaces
│   ├── App.tsx          # Main app with routing
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## 🎯 Key Features Explained

### Safety Rails

- **Emergency Fund**: Recommends 3-6 months of expenses (6+ for variable income)
- **High-Interest Debt**: Prioritizes debt with APR ≥ 8% before investing
- **Employer Match**: Always captures full employer match first

### Asset Allocation

- Risk-based allocation (0-100 score) mapped to equity/bond splits
- Age guardrails (never >95% equity, never <30% equity for young investors)
- Default: 70% US / 30% International equity split
- Low-cost index funds by default (expense ratio ≤ 0.15%)

### Short-Term Goals

- Goals ≤3 years: 60-100% cash equivalents (HYSA, money market, CDs)
- No equities for must-have goals within 2 years
- Short-term bonds for goals 18+ months away

## 🧪 Testing

The project includes comprehensive unit tests for all core logic functions:

- Risk score calculation
- Asset allocation algorithms
- Debt prioritization
- Emergency fund calculations
- Portfolio plan generation

Run tests with:
```bash
npm test
```

## 📝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚖️ Compliance

This tool is for **educational purposes only** and is **not financial advice**. All pages include appropriate disclaimers. The tool:

- Does not make performance promises
- Recommends diversified, low-cost index funds
- Prioritizes safety for short-term goals
- Recommends paying high-interest debt first
- Does not provide tax advice

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Charts powered by [Recharts](https://recharts.org/)
- PDF generation with [jsPDF](https://github.com/parallax/jsPDF)

## 📧 Support

If you have questions or find issues, please open an issue on GitHub.

---

**Remember**: This is an educational tool. Always consult with a qualified financial professional before making investment decisions.
