import { useState, useEffect } from 'react';

const LoadingPage = ({ companyName, ticker }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { text: "Initializing analysis...", duration: 28696 },
    { text: "Gathering financial data...", duration: 35870 },
    { text: "Analyzing market trends...", duration: 35870 },
    { text: "Processing competitive landscape...", duration: 28696 },
    { text: "Generating insights...", duration: 21522 },
    { text: "Finalizing report...", duration: 14348 }
  ];

  useEffect(() => {
    const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);
    let elapsedTime = 0;

    const stepUpdater = setInterval(() => {
      elapsedTime += 100;

      if (elapsedTime >= totalDuration) {
        clearInterval(stepUpdater);
        setCurrentStep(steps.length - 1);
        setProgress(100);
        return;
      }

      let cumulativeDuration = 0;
      let currentStepIndex = 0;
      let stepStartTime = 0;
      for (let i = 0; i < steps.length; i++) {
        cumulativeDuration += steps[i].duration;
        if (elapsedTime < cumulativeDuration) {
          currentStepIndex = i;
          stepStartTime = cumulativeDuration - steps[i].duration;
          break;
        }
      }
      setCurrentStep(currentStepIndex);

      const timeInCurrentStep = elapsedTime - stepStartTime;
      const progressInCurrentStep = (timeInCurrentStep / steps[currentStepIndex].duration);
      
      let progressOfCompletedSteps = 0;
      for (let i = 0; i < currentStepIndex; i++) {
        progressOfCompletedSteps += (steps[i].duration / totalDuration) * 100;
      }
      
      const progressOfCurrentStep = progressInCurrentStep * (steps[currentStepIndex].duration / totalDuration) * 100;
      
      const totalProgress = progressOfCompletedSteps + progressOfCurrentStep;
      
      setProgress(Math.min(100, totalProgress));

    }, 100);

    return () => {
      clearInterval(stepUpdater);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center z-50">
      <div className="max-w-md w-full mx-4">
        {/* Main Loading Card */}
        <div className="glass-effect rounded-3xl p-8 shadow-2xl border-2 border-white/30">
          {/* Company Info Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing {companyName}</h2>
            <p className="text-slate-600 font-medium">{ticker}</p>
          </div>

          {/* Animated Loading Spinner */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Outer ring */}
              <div className="w-20 h-20 border-4 border-slate-200 rounded-full"></div>
              {/* Animated ring */}
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              {/* Inner pulsing dot */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Progress</span>
              <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Current Step */}
          <div className="text-center">
            <p className="text-slate-700 font-medium mb-4">{steps[currentStep]?.text}</p>
            
            {/* Step Indicators */}
            <div className="flex justify-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-blue-600 scale-110' 
                      : 'bg-slate-300'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Elements for Visual Interest */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-200 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-200 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 -left-8 w-4 h-4 bg-green-200 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Background Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-100 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-green-100 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default LoadingPage;