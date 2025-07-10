import { useState, useRef, useEffect } from 'react';
import { searchTickers } from '../utils/tickerSuggestions';

const EnhancedSearchForm = ({ onSearch, isLoading }) => {
  const [companyName, setCompanyName] = useState('');
  const [ticker, setTicker] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  const tickerInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (ticker.length > 0) {
      const results = searchTickers(ticker);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedSuggestionIndex(-1);
  }, [ticker]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (companyName.trim() && ticker.trim() && !isLoading) {
      onSearch(companyName.trim(), ticker.trim());
      setCompanyName('');
      setTicker('');
      setShowSuggestions(false);
    }
  };

  const handleTickerChange = (e) => {
    setTicker(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setTicker(suggestion.ticker);
    setCompanyName(suggestion.name);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const handleClickOutside = (e) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
        tickerInputRef.current && !tickerInputRef.current.contains(e.target)) {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const areFieldsFilled = companyName.trim() !== '' && ticker.trim() !== '';

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="flex w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company Name"
              className="w-1/2 px-6 py-4 text-lg bg-transparent border-r border-slate-200 focus:outline-none rounded-l-2xl"
              disabled={isLoading}
            />
            <div className="relative w-1/2">
              <input
                ref={tickerInputRef}
                type="text"
                value={ticker}
                onChange={handleTickerChange}
                onKeyDown={handleKeyDown}
                onFocus={() => ticker.length > 0 && setShowSuggestions(suggestions.length > 0)}
                placeholder="Ticker Symbol"
                className="w-full px-6 py-4 text-lg bg-transparent focus:outline-none rounded-r-2xl"
                disabled={isLoading}
                autoComplete="off"
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion.ticker}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors ${
                        index === selectedSuggestionIndex ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-800">{suggestion.ticker}</div>
                          <div className="text-sm text-slate-600 truncate">{suggestion.name}</div>
                        </div>
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!areFieldsFilled || isLoading}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2
                     px-6 py-2 bg-blue-600 text-white rounded-xl
                     hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100
                     disabled:bg-slate-300 disabled:cursor-not-allowed
                     transition-all duration-300 font-medium ${areFieldsFilled ? 'opacity-100' : 'opacity-0'}`}
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
    </div>
  );
};

export default EnhancedSearchForm;