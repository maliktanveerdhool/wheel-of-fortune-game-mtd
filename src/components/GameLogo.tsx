
import React from 'react';
import { cn } from '@/lib/utils';

interface GameLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const GameLogo: React.FC<GameLogoProps> = ({
  className,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-3xl',
    md: 'text-5xl',
    lg: 'text-7xl'
  };
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <h1 className={cn(
        "gold-text font-extrabold tracking-wide leading-tight text-center",
        sizeClasses[size]
      )}>
        WHEEL OF <span className="block">FORTUNE</span>
      </h1>
      <div className="relative w-full h-2 mb-1">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-16 h-16 rounded-full bg-gold-dark border-4 border-gold-light -mt-8 flex items-center justify-center overflow-hidden">
          <div className="w-full h-full bg-gold-light opacity-70 animate-spin">
            <div className="w-full h-0.5 bg-gold-dark absolute top-1/2 left-0"></div>
            <div className="w-0.5 h-full bg-gold-dark absolute top-0 left-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLogo;
