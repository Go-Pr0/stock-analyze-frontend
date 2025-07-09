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
  
  if (!data.competitive || !data.competitive.competitors || data.competitive.competitors.length === 0) {
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

  // Helper function to format percentage
  const formatPercentage = (value) => {
    if (!value || value === 'N/A') return '0%';
    return value.includes('%') ? value : `${value}%`;
  };

  // Prepare data for charts
  const prepareChartData = () => {
    const companies = [
      {
        name: data.overview.name,
        ticker: data.overview.ticker,
        marketCap: parseNumeric(data.overview.marketCap),
        price: parseNumeric(data.overview.price),
        revenue: parseNumeric(data.financials.revenue),
        netIncome: parseNumeric(data.financials.netIncome),
        eps: parseNumeric(data.financials.eps),
        peRatio: parseNumeric(data.financials.peRatio),
        change: parseNumeric(data.overview.change.replace('%', '')),
        isMainCompany: true
      },
      ...data.competitive.competitors.map(competitor => ({
        name: competitor.name,
        ticker: competitor.ticker,
        marketCap: parseNumeric(competitor.marketCap),
        price: parseNumeric(competitor.price),
        revenue: parseNumeric(competitor.revenue),
        netIncome: parseNumeric(competitor.netIncome),
        eps: parseNumeric(competitor.eps),
        peRatio: parseNumeric(competitor.peRatio),
        change: parseNumeric(competitor.change.replace('%', '')),
        isMainCompany: false
      }))
    ];

    return companies;
  };

  const chartData = prepareChartData();

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const value = payload[0].value;
      const formatter = payload[0].payload.formatter || ((v) => v);
      
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800">{`${data.name} (${data.ticker})`}</p>
          <p className="text-sm text-slate-600">
            {`${payload[0].name}: ${typeof value === 'number' ? value.toFixed(2) : value}`}
          </p>
          {data.isMainCompany && (
            <p className="text-xs text-blue-600 mt-1">Primary Company</p>
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
          color: "#3b82f6",
          formatter: formatCurrency
        },
        {
          title: "Stock Price",
          dataKey: "price",
          color: "#10b981",
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
          color: "#8b5cf6",
          formatter: formatCurrency
        },
        {
          title: "Net Income",
          dataKey: "netIncome",
          color: "#f59e0b",
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
          color: "#ef4444",
          formatter: (value) => `$${value.toFixed(2)}`
        },
        {
          title: "Price-to-Earnings Ratio",
          dataKey: "peRatio",
          color: "#06b6d4",
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
          color: "#84cc16",
          formatter: (value) => `${value.toFixed(2)}%`
        }
      ]
    }
  ];

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
              Comparing {data.overview.ticker} against {data.competitive.competitors.length} competitors
            </div>
          </div>
        </div>
      </div>

      {/* Chart Sections */}
      <div className="p-8 space-y-12">
        {chartSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
              <div className="w-1 h-8 bg-blue-500 rounded-full mr-4"></div>
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
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
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
                        <Legend />
                                                  <Bar 
                            dataKey={chart.dataKey} 
                            fill={chart.color}
                            name={chart.title}
                            radius={[4, 4, 0, 0]}
                          >
                            {chartData.map((entry, index) => {
                              // Special handling for price change chart
                              if (chart.dataKey === 'change') {
                                const color = entry.change >= 0 ? '#10b981' : '#ef4444';
                                return (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.isMainCompany ? color : `${color}80`}
                                  />
                                );
                              }
                              return (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={entry.isMainCompany ? chart.color : `${chart.color}80`}
                                />
                              );
                            })}
                          </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Chart Legend */}
                  <div className="mt-4 flex flex-wrap justify-center gap-4">
                    {chartData.map((company, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div 
                          className={`w-3 h-3 rounded-full ${
                            company.isMainCompany 
                              ? 'bg-blue-600 border-2 border-blue-800' 
                              : 'bg-slate-400'
                          }`}
                        />
                        <span className={`text-sm ${
                          company.isMainCompany 
                            ? 'text-slate-800 font-medium' 
                            : 'text-slate-600'
                        }`}>
                          {company.ticker}
                          {company.isMainCompany && (
                            <span className="text-xs text-blue-600 ml-1">(Primary)</span>
                          )}
                        </span>
                      </div>
                    ))}
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