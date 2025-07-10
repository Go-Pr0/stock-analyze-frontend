import { useState, useEffect } from 'react';

const QuickStats = () => {
  const [stats, setStats] = useState({
    totalReports: 0,
    companiesAnalyzed: 0,
    avgAnalysisTime: 0
  });

  useEffect(() => {
    // Animate the numbers on component mount
    const animateNumber = (target, setter, duration = 2000) => {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(start));
        }
      }, 16);
    };

    animateNumber(1247, (val) => setStats(prev => ({ ...prev, totalReports: val })));
    animateNumber(892, (val) => setStats(prev => ({ ...prev, companiesAnalyzed: val })));
    animateNumber(45, (val) => setStats(prev => ({ ...prev, avgAnalysisTime: val })));
  }, []);

  const statItems = [
    {
      label: "Reports Generated",
      value: stats.totalReports.toLocaleString(),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "blue"
    },
    {
      label: "Companies Analyzed",
      value: stats.companiesAnalyzed.toLocaleString(),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: "green"
    },
    {
      label: "Avg Analysis Time",
      value: `${stats.avgAnalysisTime}s`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "purple"
    }
  ];

  const colorClasses = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50"
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 mb-8">
      <h3 className="text-lg font-semibold text-slate-800 mb-6 text-center">Platform Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statItems.map((item, index) => (
          <div key={index} className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colorClasses[item.color]} mb-3`}>
              {item.icon}
            </div>
            <div className="text-2xl font-bold text-slate-800 mb-1">{item.value}</div>
            <div className="text-sm text-slate-600">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStats;