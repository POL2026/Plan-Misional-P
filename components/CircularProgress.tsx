import React from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  textColor?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 48,
  strokeWidth = 4,
  color = 'text-blue-500',
  trackColor = 'text-slate-200',
  textColor
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        {/* Track Circle */}
        <circle
          className={trackColor}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress Circle */}
        <circle
          className={`${color} transition-all duration-1000 ease-out`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className={`absolute text-[10px] font-bold ${textColor || 'text-slate-700'}`}>
        {Math.round(percentage)}%
      </span>
    </div>
  );
};

export default CircularProgress;
