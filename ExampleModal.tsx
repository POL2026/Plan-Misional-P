
import React from 'react';

interface ProgressBarProps {
  percentage: number;
  color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, color }) => {
  const getColorClass = (c: string) => {
    switch (c) {
      case 'orange': return 'bg-orange-500 text-orange-700';
      case 'amber': return 'bg-amber-500 text-amber-700';
      case 'sky': return 'bg-sky-500 text-sky-700';
      case 'emerald': return 'bg-emerald-500 text-emerald-700';
      default: return 'bg-gray-500 text-gray-700';
    }
  };

  // Updated to use vibrant colors for text to match the area theme
  const getTextColor = (c: string) => {
    switch (c) {
      case 'orange': return 'text-orange-600';
      case 'amber': return 'text-amber-600';
      case 'sky': return 'text-sky-600';
      case 'emerald': return 'text-emerald-600';
      default: return 'text-gray-600';
    }
  };
  
  const getBgClass = (c: string) => {
     switch (c) {
      case 'orange': return 'bg-orange-100';
      case 'amber': return 'bg-amber-100';
      case 'sky': return 'bg-sky-100';
      case 'emerald': return 'bg-emerald-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 mb-6">
      <div className="flex justify-between items-end">
        {/* Label and Percentage now share the exact same thematic color */}
        <span className={`text-sm font-bold ${getTextColor(color)}`}>
          Progreso
        </span>
        <span className={`text-xl font-bold ${getTextColor(color)}`}>
          {Math.round(percentage)}%
        </span>
      </div>
      <div className={`w-full h-4 ${getBgClass(color)} rounded-full overflow-hidden shadow-inner`}>
        <div
          className={`h-full ${getColorClass(color).split(' ')[0]} transition-all duration-700 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;