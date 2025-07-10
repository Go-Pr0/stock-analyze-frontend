import EnhancedSearchForm from './EnhancedSearchForm';
import FeatureCards from './FeatureCards';
import ResearchHistory from './ResearchHistory';

const HomePage = ({ 
  onSearch, 
  isLoading, 
  researchHistory, 
  onHistorySelect, 
  onDeleteReport 
}) => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          Advanced Stock Research
          <span className="block text-blue-600">Made Simple</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
          Get comprehensive company analysis and financial insights with our AI-powered research tools. 
          Make informed investment decisions with real-time data and expert analysis.
        </p>
        
        {/* Enhanced Search Form */}
        <div className="mb-12">
          <EnhancedSearchForm onSearch={onSearch} isLoading={isLoading} />
        </div>
      </div>

      {/* Feature Cards */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">
          Powerful Research Features
        </h2>
        <FeatureCards />
      </div>

      {/* Research History - Full Width */}
      {researchHistory.length > 0 && (
        <div className="mb-8">
          <ResearchHistory 
            history={researchHistory} 
            onSelect={onHistorySelect}
            onDelete={onDeleteReport}
          />
        </div>
      )}

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white mb-8">
        <h3 className="text-2xl font-bold mb-4">Ready to Start Your Research?</h3>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Join thousands of investors who trust our platform for comprehensive stock analysis. 
          Get started with your first research report today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => document.querySelector('input[placeholder="Company Name"]')?.focus()}
            className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            Start Research
          </button>
          <button className="px-6 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Learn More
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center py-8 border-t border-slate-200">
        <p className="text-slate-500 text-sm">
          Powered by advanced AI and real-time market data • 
          <span className="mx-2">•</span>
          Trusted by professional investors worldwide
        </p>
      </div>
    </div>
  );
};

export default HomePage;