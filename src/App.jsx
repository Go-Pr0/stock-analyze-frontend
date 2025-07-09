import { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthProvider } from './contexts/AuthContext';
import AuthWrapper from './components/AuthWrapper';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ReportDisplay from './components/ReportDisplay';
import ResearchHistory from './components/ResearchHistory';

function AppContent() {
  const [currentReport, setCurrentReport] = useState(null);
  const [researchHistory, setResearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load research history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('researchHistory');
    if (savedHistory) {
      setResearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save research history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('researchHistory', JSON.stringify(researchHistory));
  }, [researchHistory]);

  const handleSearch = async (prompt, ticker) => {
    setIsLoading(true);

    const apiUrl = import.meta.env.VITE_API_URL || '';

    try {
      const response = await axios.post(`${apiUrl}/api/research`, {
        prompt,
        ticker
      });

      const report = response.data;
      setCurrentReport(report);
      setResearchHistory(prev => [report, ...prev.slice(0, 9)]); // Keep last 10 reports
    } catch (error) {
      console.error('Research request failed:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
      } else {
        alert('Sorry, something went wrong while fetching the report.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (report) => {
    setCurrentReport(report);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get comprehensive company analysis and financial insights with our advanced research tools
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {!currentReport ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <SearchForm onSearch={handleSearch} isLoading={isLoading} />
              {researchHistory.length > 0 && (
                <div className="mt-16 w-full max-w-4xl">
                  <ResearchHistory 
                    history={researchHistory} 
                    onSelect={handleHistorySelect}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <ReportDisplay 
                  report={currentReport} 
                  onNewSearch={() => setCurrentReport(null)}
                />
              </div>
              <div className="lg:col-span-1">
                <ResearchHistory 
                  history={researchHistory} 
                  onSelect={handleHistorySelect}
                  currentReportId={currentReport?.id}
                />
              </div>
            </div>
          )}
        </div>
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
