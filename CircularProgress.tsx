
import React from 'react';
import { AreaConfig } from '../types';
import { getIcon } from '../constants';

interface AreaCardProps {
  config: AreaConfig;
  onClick: () => void;
  completionPercentage: number;
}

const AreaCard: React.FC<AreaCardProps> = ({ config, onClick, completionPercentage }) => {
  
  // Dynamic color classes updated to use Gradients matching the main interface style
  // REMOVED: shadow-* classes for flat design
  const getCardStyle = (color: string) => {
    switch (color) {
      case 'orange': return 'bg-gradient-to-br from-orange-400 to-red-500';
      case 'amber': return 'bg-gradient-to-br from-amber-400 to-orange-500';
      case 'sky': return 'bg-gradient-to-br from-cyan-400 to-blue-500'; 
      case 'emerald': return 'bg-gradient-to-br from-emerald-400 to-green-600';
      default: return 'bg-slate-600';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`group relative w-full aspect-square p-4 flex flex-col items-center justify-between rounded-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden ${getCardStyle(config.color)}`}
    >
      {/* Percentage Badge - Absolute Positioned Top Right */}
      <div className="absolute top-3 right-3 z-20">
         <span className="text-[10px] sm:text-xs font-bold text-white bg-white/20 px-2 py-1 rounded-full border border-white/10 backdrop-blur-md shadow-sm">
             {Math.round(completionPercentage)}%
        </span>
      </div>

      {/* Centered Icon Container - Takes up available space to center vertically */}
      <div className="flex-grow flex items-center justify-center w-full mt-2">
        <div className="p-4 sm:p-5 rounded-full bg-white/20 text-white backdrop-blur-md shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-500">
          {/* Significantly Larger Icon */}
          {getIcon(config.iconName, "w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16")}
        </div>
      </div>

      {/* Title Area at Bottom - Moved up with pb-6 */}
      <div className="relative z-10 w-full text-center pb-6">
        <h3 className="text-sm sm:text-lg md:text-xl font-black text-white leading-tight tracking-tight line-clamp-2 drop-shadow-sm uppercase">
          {config.title}
        </h3>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:w-40 group-hover:h-40 transition-all duration-500"></div>
    </button>
  );
};

export default AreaCard;
