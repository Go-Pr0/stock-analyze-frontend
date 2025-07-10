import { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthWrapper from './components/AuthWrapper';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import HomePage from './components/HomePage';
import ReportDisplay from './components/ReportDisplay';
import ResearchHistory from './components/ResearchHistory';
import CompetitiveAnalysisPage from './components/CompetitiveAnalysisPage';
import LoadingPage from './components/LoadingPage';
import WhitelistManager from './components/WhitelistManager';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentReport, setCurrentReport] = useState(null);
  const [researchHistory, setResearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showCompetitiveAnalysis, setShowCompetitiveAnalysis] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState({ companyName: '', ticker: '' });

  // Load research history from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadResearchHistory();
    } else {
      // Clear history when user logs out
      setResearchHistory([]);
      setCurrentReport(null);
      setShowCompetitiveAnalysis(false);
    }
  }, [isAuthenticated]);

  const loadResearchHistory = async () => {
    setIsLoadingHistory(true);
    const apiUrl = import.meta.env.VITE_API_URL || '';

    try {
      const response = await axios.get(`${apiUrl}/api/research`);
      setResearchHistory(response.data);
    } catch (error) {
      console.error('Failed to load research history:', error);
      if (error.response?.status === 401) {
        console.log('User not authenticated, skipping history load');
      } else {
        console.error('Error loading research history');
      }
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSearch = async (prompt, ticker) => {
    setIsLoading(true);
    setLoadingInfo({ companyName: prompt, ticker: ticker });

    const apiUrl = import.meta.env.VITE_API_URL || '';

    try {
      const response = await axios.post(`${apiUrl}/api/research`, {
        prompt,
        ticker
      });

      const report = response.data;
      setCurrentReport(report);
      setShowCompetitiveAnalysis(false);
      
      // Reload history from backend to get the latest data
      await loadResearchHistory();
    } catch (error) {
      console.error('Research request failed:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
      } else {
        alert('Sorry, something went wrong while fetching the report.');
      }
    } finally {
      setIsLoading(false);
      setLoadingInfo({ companyName: '', ticker: '' });
    }
  };

  const handleHistorySelect = (report) => {
    setCurrentReport(report);
    setShowCompetitiveAnalysis(false);
  };

  const handleCompetitiveAnalysis = () => {
    setShowCompetitiveAnalysis(true);
  };

  const handleBackToReport = () => {
    setShowCompetitiveAnalysis(false);
  };

  const handleGoHome = () => {
    setCurrentReport(null);
    setShowCompetitiveAnalysis(false);
    setShowAdminPanel(false);
  };

  const handleDeleteReport = async (reportId) => {
    const apiUrl = import.meta.env.VITE_API_URL || '';

    try {
      await axios.delete(`${apiUrl}/api/research/${reportId}`);
      
      // If the deleted report is currently displayed, clear it
      if (currentReport?.id === reportId) {
        setCurrentReport(null);
      }
      
      // Reload history to reflect the deletion
      await loadResearchHistory();
    } catch (error) {
      console.error('Failed to delete report:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
      } else {
        alert('Sorry, something went wrong while deleting the report.');
      }
    }
  };

  // Show loading page when analysis is in progress
  if (isLoading && loadingInfo.companyName && loadingInfo.ticker) {
    return <LoadingPage companyName={loadingInfo.companyName} ticker={loadingInfo.ticker} />;
  }

  // Show admin panel
  if (showAdminPanel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header onShowAdmin={() => setShowAdminPanel(true)} onGoHome={handleGoHome} />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-4">
            <button
              onClick={handleGoHome}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              ← Back to Research
            </button>
          </div>
          <WhitelistManager />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header onShowAdmin={() => setShowAdminPanel(true)} onGoHome={handleGoHome} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Main Content */}
        {!currentReport ? (
          <HomePage 
            onSearch={handleSearch}
            isLoading={isLoading}
            researchHistory={researchHistory}
            onHistorySelect={handleHistorySelect}
            onDeleteReport={handleDeleteReport}
          />
        ) : showCompetitiveAnalysis ? (
          <CompetitiveAnalysisPage
            report={currentReport}
            onBack={handleBackToReport}
            researchHistory={researchHistory}
            onHistorySelect={handleHistorySelect}
            onDeleteReport={handleDeleteReport}
            currentReportId={currentReport?.id}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <ReportDisplay 
                report={currentReport} 
                onNewSearch={handleGoHome}
                onCompetitiveAnalysis={handleCompetitiveAnalysis}
              />
            </div>
            <div className="lg:col-span-1">
              <ResearchHistory 
                history={researchHistory} 
                onSelect={handleHistorySelect}
                onDelete={handleDeleteReport}
                currentReportId={currentReport?.id}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthWrapper>
        <AppContent />
      </AuthWrapper>
    </AuthProvider>
  );
}

export default App;
