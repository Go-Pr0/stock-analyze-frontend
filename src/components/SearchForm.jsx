import { useState } from 'react';

const SearchForm = ({ onSearch, isLoading }) => {
  const [companyName, setCompanyName] = useState('');
  const [ticker, setTicker] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((companyName.trim() || ticker.trim()) && !isLoading) {
      onSearch(companyName.trim(), ticker.trim());
      setCompanyName('');
      setTicker('');
    }
  };

  const popularSearches = [
    { name: 'Apple', ticker: 'AAPL' },
    { name: 'Microsoft', ticker: 'MSFT' },
    { name: 'Tesla', ticker: 'TSLA' },
    { name: 'Amazon', ticker: 'AMZN' },
    { name: 'Google', ticker: 'GOOGL' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="flex w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company Name/Extra Info"
              className="w-2/3 px-6 py-4 text-lg bg-transparent border-r border-slate-200 focus:outline-none"
              disabled={isLoading}
            />
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="Ticker"
              className="w-1/3 px-6 py-4 text-lg bg-transparent focus:outline-none"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={(!companyName.trim() && !ticker.trim()) || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2
                     px-6 py-2 bg-blue-600 text-white rounded-xl
                     hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100
                     disabled:bg-slate-300 disabled:cursor-not-allowed
                     transition-all duration-200 font-medium"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing...</span>
              </div>
            ) : (
              'Research'
            )}
          </button>
        </div>
      </form>
      
      {/* Quick suggestions */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500 mb-3">Popular searches:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {popularSearches.map((suggestion) => (
            <button
              key={suggestion.name}
              onClick={() => !isLoading && onSearch(suggestion.name, suggestion.ticker)}
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg
                       hover:bg-slate-50 hover:border-slate-300 transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {suggestion.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;