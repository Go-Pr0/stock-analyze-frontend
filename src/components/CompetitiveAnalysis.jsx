import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell 
} from 'recharts';

const CompetitiveAnalysis = ({ report, onBack }) => {
  const { data } = report;
  const [showGlobal, setShowGlobal] = useState(true);
  const [showNational, setShowNational] = useState(false);
  
  // Check if we have any competitive data
  const hasGlobalCompetitors = data.competitive?.global_competitors?.length > 0;
  const hasNationalCompetitors = data.competitive?.national_competitors?.length > 0;
  
  if (!data.competitive || (!hasGlobalCompetitors && !hasNationalCompetitors)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">No Competitive Data Available</h2>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Report
          </button>
        </div>
      </div>
    );
  }

  // Helper function to parse numeric values from strings
  const parseNumeric = (value) => {
    if (!value || value === 'N/A') return 0;
    
    // Remove $ and other currency symbols
    let cleaned = value.replace(/[$,]/g, '');
    
    // Handle billions (B) and trillions (T)
    if (cleaned.includes('B')) {
      return parseFloat(cleaned.replace('B', '')) * 1000; // Convert to millions for consistent scale
    } else if (cleaned.includes('T')) {
      return parseFloat(cleaned.replace('T', '')) * 1000000; // Convert to millions for consistent scale
    }
    
    return parseFloat(cleaned) || 0;
  };

  // Helper function to format currency values
  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}T`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}B`;
    }
    return `$${value.toFixed(2)}`;
  };

  // COMPLETELY NEW DATA PREPARATION LOGIC
  const prepareChartData = () => {
    // Start with main company - always included
    const companies = [{
      ticker: data.overview.ticker,
      name: data.overview.name,
      marketCap: parseNumeric(data.overview.marketCap),
      price: parseNumeric(data.overview.price),
      revenue: parseNumeric(data.financials.revenue),
      netIncome: parseNumeric(data.financials.netIncome),
      eps: parseNumeric(data.financials.eps),
      peRatio: parseNumeric(data.financials.peRatio),
      change: parseNumeric(data.overview.change.replace('%', '')),
      type: 'main'
    }];

    // Add competitors based on what's selected
    if (showGlobal && data.competitive.global_competitors) {
      data.competitive.global_competitors.forEach(competitor => {
        companies.push({
          ticker: competitor.ticker,
          name: competitor.name,
          marketCap: parseNumeric(competitor.marketCap),
          price: parseNumeric(competitor.price),
          revenue: parseNumeric(competitor.revenue),
          netIncome: parseNumeric(competitor.netIncome),
          eps: parseNumeric(competitor.eps),
          peRatio: parseNumeric(competitor.peRatio),
          change: parseNumeric(competitor.change.replace('%', '')),
          type: 'global'
        });
      });
    }

    if (showNational && data.competitive.national_competitors) {
      data.competitive.national_competitors.forEach(competitor => {
        // Check if this competitor is already in the list (from global)
        const existingIndex = companies.findIndex(c => c.ticker === competitor.ticker);
        
        if (existingIndex !== -1) {
          // Company exists, update type to indicate it's in both
          companies[existingIndex].type = 'both';
        } else {
          // New company, add it
          companies.push({
            ticker: competitor.ticker,
            name: competitor.name,
            marketCap: parseNumeric(competitor.marketCap),
            price: parseNumeric(competitor.price),
            revenue: parseNumeric(competitor.revenue),
            netIncome: parseNumeric(competitor.netIncome),
            eps: parseNumeric(competitor.eps),
            peRatio: parseNumeric(competitor.peRatio),
            change: parseNumeric(competitor.change.replace('%', '')),
            type: 'national'
          });
        }
      });
    }

    return companies;
  };

  const chartData = prepareChartData();

  // COMPLETELY NEW TOOLTIP LOGIC
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const companyData = chartData.find(c => c.ticker === label);
      
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800">{`${companyData?.name || label} (${label})`}</p>
          <p className="text-sm text-slate-600">
            {`Value: ${typeof payload[0].value === 'number' ? payload[0].value.toFixed(2) : payload[0].value}`}
          </p>
          {companyData?.type === 'main' && (
            <p className="text-xs text-purple-600 mt-1">Primary Company</p>
          )}
          {companyData?.type === 'global' && (
            <p className="text-xs text-blue-600 mt-1">Global Competitor</p>
          )}
          {companyData?.type === 'national' && (
            <p className="text-xs text-green-600 mt-1">National Competitor</p>
          )}
          {companyData?.type === 'both' && (
            <p className="text-xs text-orange-600 mt-1">Global & National Competitor</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Chart sections configuration
  const chartSections = [
    {
      title: "Market Valuation",
      charts: [
        {
          title: "Market Capitalization",
          dataKey: "marketCap",
          globalColor: "#3b82f6",
          nationalColor: "#10b981",
          formatter: formatCurrency
        },
        {
          title: "Stock Price",
          dataKey: "price",
          globalColor: "#8b5cf6",
          nationalColor: "#f59e0b",
          formatter: (value) => `$${value.toFixed(2)}`
        }
      ]
    },
    {
      title: "Financial Performance",
      charts: [
        {
          title: "Revenue",
          dataKey: "revenue",
          globalColor: "#ef4444",
          nationalColor: "#06b6d4",
          formatter: formatCurrency
        },
        {
          title: "Net Income",
          dataKey: "netIncome",
          globalColor: "#84cc16",
          nationalColor: "#f97316",
          formatter: formatCurrency
        }
      ]
    },
    {
      title: "Financial Ratios",
      charts: [
        {
          title: "Earnings Per Share (EPS)",
          dataKey: "eps",
          globalColor: "#ec4899",
          nationalColor: "#8b5cf6",
          formatter: (value) => `$${value.toFixed(2)}`
        },
        {
          title: "Price-to-Earnings Ratio",
          dataKey: "peRatio",
          globalColor: "#06b6d4",
          nationalColor: "#84cc16",
          formatter: (value) => `${value.toFixed(1)}x`
        }
      ]
    },
    {
      title: "Market Performance",
      charts: [
        {
          title: "Price Change (%)",
          dataKey: "change",
          globalColor: "#10b981",
          nationalColor: "#f59e0b",
          formatter: (value) => `${value.toFixed(2)}%`
        }
      ]
    }
  ];

  // Get active display mode
  const getDisplayMode = () => {
    if (showGlobal && showNational) return 'both';
    if (showGlobal) return 'global';
    if (showNational) return 'national';
    return 'none';
  };

  const displayMode = getDisplayMode();

  // COMPLETELY NEW FILL DETERMINATION LOGIC
  const getFillColor = (company, chart, chartIndex) => {
    // Main company is always purple
    if (company.type === 'main') {
      return '#8b5cf6';
    }

    // For price change, use dynamic colors
    if (chart.dataKey === 'change') {
      const baseColor = company.change >= 0 ? '#10b981' : '#ef4444';
      
      if (displayMode === 'both') {
        // In overlay mode, national/both companies get striped pattern
        if (company.type === 'national' || company.type === 'both') {
          return `url(#stripes-change-${chartIndex})`;
        } else {
          return baseColor;
        }
      } else {
        return baseColor;
      }
    }

    // For other charts
    if (displayMode === 'both') {
      // In overlay mode, prioritize national pattern
      if (company.type === 'national' || company.type === 'both') {
        return `url(#stripes-${chartIndex})`;
      } else if (company.type === 'global') {
        return chart.globalColor;
      }
    } else if (displayMode === 'global') {
      return chart.globalColor;
    } else if (displayMode === 'national') {
      return `url(#stripes-${chartIndex})`;
    }

    return chart.globalColor;
  };

  // Custom pattern definitions for striped bars
  const StripedPattern = ({ id, color }) => (
    <defs>
      <pattern id={id} patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
        <rect width="4" height="8" fill={color} />
        <rect x="4" width="4" height="8" fill={`${color}40`} />
      </pattern>
    </defs>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={onBack}
              className="flex items-center text-slate-600 hover:text-slate-800 transition-colors mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Report
            </button>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Competitive Analysis: {data.overview.name}
            </h1>
            <div className="text-sm text-slate-600">
              Comparing {data.overview.ticker} against {chartData.length - 1} competitors
              {displayMode === 'both' && ' (Overlay Mode - Striped National Priority)'}
              {displayMode === 'global' && ' (Global Only)'}
              {displayMode === 'national' && ' (National Only)'}
            </div>
          </div>
          
          {/* Separate Selectors */}
          <div className="flex items-center space-x-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="global-checkbox"
                  checked={showGlobal}
                  onChange={(e) => setShowGlobal(e.target.checked)}
                  disabled={!hasGlobalCompetitors}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                />
                <label 
                  htmlFor="global-checkbox" 
                  className={`text-sm font-medium ${!hasGlobalCompetitors ? 'text-gray-400' : 'text-slate-700'}`}
                >
                  Global ({data.competitive.global_competitors?.length || 0})
                </label>
                <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="national-checkbox"
                  checked={showNational}
                  onChange={(e) => setShowNational(e.target.checked)}
                  disabled={!hasNationalCompetitors}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 disabled:opacity-50"
                />
                <label 
                  htmlFor="national-checkbox" 
                  className={`text-sm font-medium ${!hasNationalCompetitors ? 'text-gray-400' : 'text-slate-700'}`}
                >
                  National ({data.competitive.national_competitors?.length || 0})
                </label>
                <div className="w-4 h-4 bg-green-600 rounded-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-green-600 opacity-60" 
                       style={{
                         backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 4px)'
                       }}>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Sections */}
      <div className="p-8 space-y-12">
        {/* Display Mode Indicator */}
        {displayMode !== 'none' && (
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  {displayMode === 'both' && 'Overlay Mode: Same Position Bars'}
                  {displayMode === 'global' && 'Global Competition'}
                  {displayMode === 'national' && 'National Competition'}
                </h3>
                <p className="text-sm text-slate-600">
                  {displayMode === 'both' && 'All bars at same positions - National competitors show striped pattern, Global show solid colors'}
                  {displayMode === 'global' && 'Showing only global competitors with solid colors'}
                  {displayMode === 'national' && 'Showing only national competitors with striped patterns'}
                </p>
              </div>
              <div className="text-sm font-medium text-slate-700">
                {chartData.length} Companies Total
              </div>
            </div>
          </div>
        )}

        {displayMode === 'none' && (
          <div className="bg-slate-50 rounded-lg p-8 border border-slate-200 text-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Competitors Selected</h3>
            <p className="text-sm text-slate-600">
              Please select Global and/or National competitors using the checkboxes above to view the competitive analysis.
            </p>
          </div>
        )}

        {displayMode !== 'none' && chartSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
              <div className={`w-1 h-8 rounded-full mr-4 ${
                displayMode === 'both' ? 'bg-gradient-to-b from-blue-500 to-green-500' :
                displayMode === 'global' ? 'bg-blue-500' : 'bg-green-500'
              }`}></div>
              {section.title}
            </h2>
            
            <div className="space-y-8">
              {section.charts.map((chart, chartIndex) => (
                <div key={chartIndex} className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-6 text-center">
                    {chart.title}
                  </h3>
                  
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        {/* Define patterns for this specific chart */}
                        <StripedPattern id={`stripes-${chartIndex}`} color={chart.nationalColor} />
                        <StripedPattern id={`stripes-change-${chartIndex}`} color="#10b981" />
                        
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="ticker" 
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickFormatter={chart.formatter}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        
                        {/* SINGLE BAR COMPONENT - NO MULTIPLE BARS */}
                        <Bar 
                          dataKey={chart.dataKey} 
                          name="Companies"
                          radius={[4, 4, 0, 0]}
                        >
                          {chartData.map((company, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={getFillColor(company, chart, chartIndex)}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* COMPLETELY NEW LEGEND */}
                  <div className="mt-1 space-y-3">
                    <div className="text-center text-sm font-medium text-slate-700 mb-3">
                      Company Legend
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {chartData.map((company, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
                          {/* Visual indicator based on company type */}
                          <div className="flex items-center space-x-1">
                            {company.type === 'main' && (
                              <div className="w-3 h-3 bg-purple-600 rounded-full border-2 border-purple-800" />
                            )}
                            {company.type === 'global' && (
                              <div className="w-3 h-3 bg-blue-600 rounded-sm" />
                            )}
                            {(company.type === 'national' || company.type === 'both') && displayMode === 'both' && (
                              <div className="w-3 h-3 bg-green-600 rounded-sm relative overflow-hidden">
                                <div className="absolute inset-0 bg-green-600 opacity-60" 
                                     style={{
                                       backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(255,255,255,0.4) 1px, rgba(255,255,255,0.4) 2px)'
                                     }}>
                                </div>
                              </div>
                            )}
                            {company.type === 'national' && displayMode === 'national' && (
                              <div className="w-3 h-3 bg-green-600 rounded-sm relative overflow-hidden">
                                <div className="absolute inset-0 bg-green-600 opacity-60" 
                                     style={{
                                       backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(255,255,255,0.4) 1px, rgba(255,255,255,0.4) 2px)'
                                     }}>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Company name and ticker */}
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium truncate ${
                              company.type === 'main' ? 'text-purple-700' :
                              company.type === 'global' ? 'text-blue-700' :
                              company.type === 'national' ? 'text-green-700' :
                              'text-orange-700'
                            }`}>
                              {company.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {company.ticker}
                              {company.type === 'main' && ' (Primary)'}
                              {company.type === 'both' && ' (Both Lists)'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitiveAnalysis;