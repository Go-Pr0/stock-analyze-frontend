const ResearchHistory = ({ history, onSelect, onDelete, currentReportId }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const handleDelete = (e, reportId) => {
    e.stopPropagation(); // Prevent triggering the select action
    if (window.confirm('Are you sure you want to delete this report?')) {
      onDelete(reportId);
    }
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800">Research History</h3>
        <p className="text-sm text-slate-600 mt-1">Recent company analyses</p>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {history.map((report) => (
          <button
            key={report.id}
            onClick={() => onSelect(report)}
            className={`w-full text-left px-6 py-4 border-b border-slate-100 last:border-b-0
                       hover:bg-slate-50 transition-all duration-200 group
                       ${currentReportId === report.id ? 'bg-blue-50 border-blue-200' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                    {report.companyName}
                  </h4>
                  {currentReportId === report.id && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <span>{report.data.overview.ticker}</span>
                  <span>•</span>
                  <span>{formatDate(report.timestamp)}</span>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-700">
                    {report.data.overview.price}
                  </span>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">
                    {report.data.overview.change}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {onDelete && (
                  <button
                    onClick={(e) => handleDelete(e, report.id)}
                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete report"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {history.length >= 10 && (
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            Showing last 10 searches
          </p>
        </div>
      )}
    </div>
  );
};

export default ResearchHistory;