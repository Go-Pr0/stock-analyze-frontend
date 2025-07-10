import { useState, useEffect } from 'react';

const PopularStocks = ({ onQuickAnalysis }) => {
  const [popularStocks] = useState([
    { ticker: 'AAPL', name: 'Apple Inc.', price: '$189.84', change: '+2.34%', changeType: 'positive' },
    { ticker: 'MSFT', name: 'Microsoft Corp.', price: '$378.85', change: '+1.87%', changeType: 'positive' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', price: '$138.21', change: '-0.45%', changeType: 'negative' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', price: '$144.05', change: '+3.21%', changeType: 'positive' },
    { ticker: 'TSLA', name: 'Tesla Inc.', price: '$248.50', change: '-1.23%', changeType: 'negative' },
    { ticker: 'META', name: 'Meta Platforms', price: '$296.73', change: '+0.89%', changeType: 'positive' }
  ]);

  const handleQuickAnalysis = (stock) => {
    if (onQuickAnalysis) {
      onQuickAnalysis(stock.name, stock.ticker);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Popular Stocks</h3>
        <span className="text-sm text-slate-500">Live prices</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {popularStocks.map((stock, index) => (
          <button
            key={index}
            onClick={() => handleQuickAnalysis(stock)}
            className="text-left p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                {stock.ticker}
              </div>
              <div className={`text-sm font-medium px-2 py-1 rounded ${
                stock.changeType === 'positive' 
                  ? 'text-green-700 bg-green-100' 
                  : 'text-red-700 bg-red-100'
              }`}>
                {stock.change}
              </div>
            </div>
            <div className="text-sm text-slate-600 mb-2 truncate">{stock.name}</div>
            <div className="text-lg font-bold text-slate-800">{stock.price}</div>
          </button>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-500">
          Click any stock for quick analysis • Prices updated every 15 minutes
        </p>
      </div>
    </div>
  );
};

export default PopularStocks;