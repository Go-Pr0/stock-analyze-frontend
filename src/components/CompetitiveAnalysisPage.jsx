import ResearchHistory from './ResearchHistory';
import CompetitiveAnalysis from './CompetitiveAnalysis';

const CompetitiveAnalysisPage = ({ 
  report, 
  onBack, 
  researchHistory, 
  onHistorySelect, 
  onDeleteReport, 
  currentReportId 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <CompetitiveAnalysis 
          report={report} 
          onBack={onBack}
        />
      </div>
      <div className="lg:col-span-1">
        <ResearchHistory 
          history={researchHistory} 
          onSelect={onHistorySelect}
          onDelete={onDeleteReport}
          currentReportId={currentReportId}
        />
      </div>
    </div>
  );
};

export default CompetitiveAnalysisPage; 