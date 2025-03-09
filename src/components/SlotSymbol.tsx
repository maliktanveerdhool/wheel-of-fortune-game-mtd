
import React from 'react';
import { cn } from '@/lib/utils';

type SlotSymbolProps = {
  type: 'BAR' | 'SEVEN' | 'TRIPLE' | 'SPIN' | 'BLANK';
  size?: 'sm' | 'md' | 'lg';
  highlighted?: boolean;
};

const SlotSymbol: React.FC<SlotSymbolProps> = ({ 
  type, 
  size = 'md',
  highlighted = false 
}) => {
  const sizeClasses = {
    sm: 'h-14 w-14',
    md: 'h-20 w-20',
    lg: 'h-24 w-24',
  };

  const getSymbolContent = () => {
    switch (type) {
      case 'BAR':
        return (
          <div className={cn(
            "flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-700 rounded-md p-2 border-2 border-teal-300 shadow-lg",
            highlighted && "animate-pulse-glow"
          )}>
            <span className="font-extrabold text-white tracking-wider text-2xl" 
              style={{textShadow: "0 2px 4px rgba(0,0,0,0.5)"}}>BAR</span>
            {highlighted && (
              <div className="absolute inset-0 bg-white/30 animate-pulse rounded-md"></div>
            )}
          </div>
        );
      case 'SEVEN':
        return (
          <div className={cn(
            "flex items-center justify-center bg-gradient-to-br from-red-500 to-red-800 rounded-md p-2 border-2 border-red-300 shadow-lg",
            highlighted && "animate-pulse-glow"
          )}>
            <span className="font-extrabold text-white text-4xl"
              style={{textShadow: "0 2px 4px rgba(0,0,0,0.5)"}}>7</span>
            {highlighted && (
              <div className="absolute inset-0 bg-white/30 animate-pulse rounded-md"></div>
            )}
          </div>
        );
      case 'TRIPLE':
        return (
          <div className={cn(
            "flex items-center justify-center bg-gradient-to-br from-gold-light to-gold-dark rounded-md p-2 border-2 border-yellow-300 shadow-lg",
            highlighted && "animate-pulse-glow"
          )}>
            <span className="font-extrabold text-white text-lg tracking-tight"
              style={{textShadow: "0 2px 4px rgba(0,0,0,0.5)"}}>TRIPLE</span>
            {highlighted && (
              <div className="absolute inset-0 bg-white/30 animate-pulse rounded-md"></div>
            )}
          </div>
        );
      case 'SPIN':
        return (
          <div className={cn(
            "flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-700 rounded-md p-2 border-2 border-purple-300 shadow-lg",
            highlighted && "animate-pulse-glow"
          )}>
            <span className="font-extrabold text-white text-xl"
              style={{textShadow: "0 2px 4px rgba(0,0,0,0.5)"}}>SPIN</span>
            {highlighted && (
              <div className="absolute inset-0 bg-white/30 animate-pulse rounded-md"></div>
            )}
          </div>
        );
      case 'BLANK':
      default:
        return <div className="flex items-center justify-center bg-gray-200/20 rounded-md"></div>;
    }
  };

  return (
    <div className={cn(
      "relative flex items-center justify-center transition-all duration-200",
      sizeClasses[size],
      highlighted && "scale-110 z-10"
    )}>
      <div className="absolute inset-0 rounded-md bg-black/10"></div>
      {getSymbolContent()}
      
      {/* Add reflection/glossiness */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-md pointer-events-none"></div>
      
      {/* Add sparkles on highlighted symbols */}
      {highlighted && (
        <>
          <div className="sparkle absolute -top-1 -right-1" style={{ animationDelay: "0s" }}></div>
          <div className="sparkle absolute top-1/3 -left-2" style={{ animationDelay: "0.3s" }}></div>
          <div className="sparkle absolute -bottom-1 -right-1" style={{ animationDelay: "0.6s" }}></div>
          <div className="sparkle absolute top-2/3 -left-1" style={{ animationDelay: "0.9s" }}></div>
        </>
      )}
    </div>
  );
};

export default SlotSymbol;
