import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import ProfilePage from './pages/ProfilePage';
import CashFlowPage from './pages/CashFlowPage';
import GoalsPage from './pages/GoalsPage';
import RiskQuizPage from './pages/RiskQuizPage';
import AccountsPage from './pages/AccountsPage';
import ResultsPage from './pages/ResultsPage';
import LearnMorePage from './pages/LearnMorePage';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cashflow" element={<CashFlowPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/risk" element={<RiskQuizPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/learn" element={<LearnMorePage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

