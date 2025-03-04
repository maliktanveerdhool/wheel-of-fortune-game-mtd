
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
            "flex items-center justify-center bg-gradient-to-r from-teal-400 to-teal-500 rounded-md p-2",
            highlighted && "animate-pulse-glow"
          )}>
            <span className="font-extrabold text-white tracking-wider text-2xl">BAR</span>
          </div>
        );
      case 'SEVEN':
        return (
          <div className={cn(
            "flex items-center justify-center bg-slot-red rounded-md p-2",
            highlighted && "animate-pulse-glow"
          )}>
            <span className="font-extrabold text-white text-4xl">7</span>
          </div>
        );
      case 'TRIPLE':
        return (
          <div className={cn(
            "flex items-center justify-center bg-gradient-to-r from-gold-light to-gold border-2 border-gold-dark rounded-md p-2",
            highlighted && "animate-pulse-glow"
          )}>
            <span className="font-extrabold text-white text-lg tracking-tight">TRIPLE</span>
          </div>
        );
      case 'SPIN':
        return (
          <div className={cn(
            "flex items-center justify-center bg-gradient-to-r from-slot-purple to-indigo-600 rounded-md p-2",
            highlighted && "animate-pulse-glow"
          )}>
            <span className="font-extrabold text-white text-xl">SPIN</span>
          </div>
        );
      case 'BLANK':
      default:
        return <div className="flex items-center justify-center bg-gray-200 opacity-20 rounded-md"></div>;
    }
  };

  return (
    <div className={cn(
      "relative flex items-center justify-center transition-all duration-200",
      sizeClasses[size],
      highlighted && "scale-105 z-10"
    )}>
      {getSymbolContent()}
    </div>
  );
};

export default SlotSymbol;
