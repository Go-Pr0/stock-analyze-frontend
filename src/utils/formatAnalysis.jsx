import React from 'react';

/**
 * Formats Discord-style markdown text into React components
 * Supports:
 * - # Largest title
 * - ## Larger title  
 * - ### Smaller title
 * - **bold text** (removes stars)
 * - * bullet point
 */
export const formatAnalysisText = (text) => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let currentList = [];
  let listKey = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} className="list-none space-y-2 mb-6 ml-4">
          {currentList.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-500 mr-3 mt-1 text-sm">•</span>
              <span className="text-slate-700 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) {
      flushList();
      return;
    }

    // Handle headings
    if (trimmedLine.startsWith('### ')) {
      flushList();
      const text = trimmedLine.substring(4);
      elements.push(
        <h3 key={`h3-${index}`} className="text-lg font-semibold text-slate-800 mb-3 mt-6">
          {formatInlineText(text)}
        </h3>
      );
    } else if (trimmedLine.startsWith('## ')) {
      flushList();
      const text = trimmedLine.substring(3);
      elements.push(
        <h2 key={`h2-${index}`} className="text-xl font-bold text-slate-800 mb-4 mt-8 flex items-center">
          <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
          {formatInlineText(text)}
        </h2>
      );
    } else if (trimmedLine.startsWith('# ')) {
      flushList();
      const text = trimmedLine.substring(2);
      elements.push(
        <h1 key={`h1-${index}`} className="text-2xl font-bold text-slate-900 mb-6 mt-8 flex items-center">
          <div className="w-2 h-8 bg-purple-600 rounded-full mr-4"></div>
          {formatInlineText(text)}
        </h1>
      );
    } 
    // Handle bullet points
    else if (trimmedLine.startsWith('* ')) {
      const text = trimmedLine.substring(2);
      currentList.push(formatInlineText(text));
    }
    // Handle regular paragraphs
    else {
      flushList();
      elements.push(
        <p key={`p-${index}`} className="text-slate-700 leading-relaxed mb-4">
          {formatInlineText(trimmedLine)}
        </p>
      );
    }
  });

  // Flush any remaining list items
  flushList();

  return elements;
};

/**
 * Formats inline text elements like bold (**text**)
 */
const formatInlineText = (text) => {
  if (!text) return '';

  // Handle bold text **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="font-semibold text-slate-900">
          {boldText}
        </strong>
      );
    }
    return part;
  });
};

/**
 * React component wrapper for formatted analysis text
 */
export const FormattedAnalysis = ({ text, className = "" }) => {
  const formattedElements = formatAnalysisText(text);
  
  return (
    <div className={`formatted-analysis ${className}`}>
      {formattedElements}
    </div>
  );
};