const ReportDisplay = ({ report, onNewSearch, onCompetitiveAnalysis }) => {
  const { data } = report;
  
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'BUY': return 'text-green-600 bg-green-50 border-green-200';
      case 'SELL': return 'text-red-600 bg-red-50 border-red-200';
      case 'HOLD': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {data.overview.name}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <span className="font-medium">{data.overview.ticker}</span>
              <span>•</span>
              <span>{data.overview.sector}</span>
              <span>•</span>
              <span>Generated {formatDate(report.timestamp)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onNewSearch}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg
                       hover:bg-blue-700 transition-all duration-200 font-medium"
            >
              New
            </button>
            {data.competitive && data.competitive.competitors && data.competitive.competitors.length > 0 && (
              <button
                onClick={onCompetitiveAnalysis}
                className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg
                         hover:from-green-700 hover:to-green-800 transition-all duration-200
                         font-medium shadow-sm hover:shadow-md"
              >
                Compare
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Market Overview */}
        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
            <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
            Market Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">Current Price</div>
              <div className="text-2xl font-bold text-slate-800">{data.overview.price}</div>
              <div className="text-sm text-green-600 font-medium">{data.overview.change}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">Market Cap</div>
              <div className="text-2xl font-bold text-slate-800">{data.overview.marketCap}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">P/E Ratio</div>
              <div className="text-2xl font-bold text-slate-800">{data.financials.peRatio}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">EPS</div>
              <div className="text-2xl font-bold text-slate-800">{data.financials.eps}</div>
            </div>
          </div>
        </section>

        {/* Financial Highlights */}
        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
            <div className="w-1 h-6 bg-green-500 rounded-full mr-3"></div>
            Financial Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-600">Revenue</span>
                <span className="font-semibold text-slate-800">{data.financials.revenue}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-600">Net Income</span>
                <span className="font-semibold text-slate-800">{data.financials.netIncome}</span>
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="font-semibold text-slate-800 mb-3">Key Metrics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Earnings Per Share</span>
                  <span className="font-medium">{data.financials.eps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Price-to-Earnings</span>
                  <span className="font-medium">{data.financials.peRatio}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Analysis */}
        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
            <div className="w-1 h-6 bg-purple-500 rounded-full mr-3"></div>
            Analysis Summary
          </h2>

          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
              {data.analysis}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReportDisplay;