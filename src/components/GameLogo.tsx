
import React from 'react';
import { cn } from '@/lib/utils';
import { Trophy } from 'lucide-react';

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
    <div className={cn("flex flex-col items-center relative", className)}>
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gold-dark border-4 border-gold-light flex items-center justify-center overflow-hidden z-20">
        <Trophy className="h-8 w-8 text-white" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
      </div>
      
      <div className="bg-gradient-to-r from-gold-dark via-gold-light to-gold-dark p-6 rounded-xl border-2 border-gold-light shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent"></div>
        
        <h1 className={cn(
          "title-3d font-extrabold tracking-wide leading-tight text-center",
          sizeClasses[size]
        )}>
          <span className="gold-text">WHEEL OF</span> 
          <span className="block gold-text">FORTUNE</span>
        </h1>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold-dark opacity-50"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-white opacity-30"></div>
        
        {/* Animated light reflections */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="shine-effect absolute top-0 left-0 w-full h-full"></div>
        </div>
      </div>
      
      <div className="flex justify-between w-full px-4 mt-6 z-10">
        <div className="gold-text text-2xl font-bold bg-black/50 p-2 rounded-lg border border-gold/50 transform -rotate-3 shadow-lg">
          TRIPLE GOLD
        </div>
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text p-2 rounded-lg border border-blue-500/50 transform rotate-3 shadow-lg">
          GOLD SPIN
        </div>
      </div>
    </div>
  );
};

export default GameLogo;
