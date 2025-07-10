const FeatureCards = () => {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Financial Analysis",
      description: "Comprehensive financial metrics including revenue, profit margins, and growth trends",
      color: "blue"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: "Market Trends",
      description: "Real-time market data and trend analysis to understand stock performance",
      color: "green"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Competitive Analysis",
      description: "Compare companies against their competitors in the same industry",
      color: "purple"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "AI Insights",
      description: "Advanced AI-powered analysis providing actionable investment insights",
      color: "orange"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Real-time Data",
      description: "Up-to-date financial information and market data for accurate analysis",
      color: "indigo"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Detailed Reports",
      description: "Comprehensive research reports with executive summaries and key findings",
      color: "teal"
    }
  ];

  const colorClasses = {
    blue: "from-blue-500 to-blue-600 text-blue-600 bg-blue-50",
    green: "from-green-500 to-green-600 text-green-600 bg-green-50",
    purple: "from-purple-500 to-purple-600 text-purple-600 bg-purple-50",
    orange: "from-orange-500 to-orange-600 text-orange-600 bg-orange-50",
    indigo: "from-indigo-500 to-indigo-600 text-indigo-600 bg-indigo-50",
    teal: "from-teal-500 to-teal-600 text-teal-600 bg-teal-50"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-slate-300 group relative z-10"
        >
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colorClasses[feature.color].split(' ').slice(-2).join(' ')} mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <div className={colorClasses[feature.color].split(' ').slice(-3, -2).join(' ')}>
              {feature.icon}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;