import { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthWrapper from './components/AuthWrapper';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ReportDisplay from './components/ReportDisplay';
import ResearchHistory from './components/ResearchHistory';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentReport, setCurrentReport] = useState(null);
  const [researchHistory, setResearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load research history from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadResearchHistory();
    } else {
      // Clear history when user logs out
      setResearchHistory([]);
      setCurrentReport(null);
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

    const apiUrl = import.meta.env.VITE_API_URL || '';

    try {
      const response = await axios.post(`${apiUrl}/api/research`, {
        prompt,
        ticker
      });

      const report = response.data;
      setCurrentReport(report);
      
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
    }
  };

  const handleHistorySelect = (report) => {
    setCurrentReport(report);
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
                    onDelete={handleDeleteReport}
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
                  onDelete={handleDeleteReport}
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
