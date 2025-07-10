import { useState } from 'react';

const RecentNews = () => {
  const [news] = useState([
    {
      title: "Tech Stocks Rally as AI Adoption Accelerates",
      summary: "Major technology companies see significant gains as artificial intelligence integration drives investor confidence.",
      time: "2 hours ago",
      category: "Technology",
      source: "Financial Times"
    },
    {
      title: "Federal Reserve Signals Potential Rate Changes",
      summary: "Latest Fed meeting minutes suggest possible monetary policy adjustments in response to economic indicators.",
      time: "4 hours ago",
      category: "Economics",
      source: "Reuters"
    },
    {
      title: "Energy Sector Shows Strong Q4 Performance",
      summary: "Oil and gas companies report better-than-expected earnings as global demand remains robust.",
      time: "6 hours ago",
      category: "Energy",
      source: "Bloomberg"
    },
    {
      title: "Healthcare Innovation Drives Market Interest",
      summary: "Breakthrough treatments and medical technologies attract significant investment and market attention.",
      time: "8 hours ago",
      category: "Healthcare",
      source: "Wall Street Journal"
    }
  ]);

  const categoryColors = {
    Technology: "bg-blue-100 text-blue-800",
    Economics: "bg-green-100 text-green-800",
    Energy: "bg-orange-100 text-orange-800",
    Healthcare: "bg-purple-100 text-purple-800"
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Market News</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {news.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1 mr-3">
                {item.title}
              </h4>
              <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[item.category]} whitespace-nowrap`}>
                {item.category}
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">{item.summary}</p>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{item.source}</span>
              <span>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-500">
          Stay informed with the latest market developments
        </p>
      </div>
    </div>
  );
};

export default RecentNews;