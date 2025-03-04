
import React, { useState, useEffect, useRef } from 'react';
import SlotSymbol from './SlotSymbol';
import { cn } from '@/lib/utils';

type SlotReelProps = {
  symbols: Array<'BAR' | 'SEVEN' | 'TRIPLE' | 'SPIN' | 'BLANK'>;
  spinning: boolean;
  spinDuration?: number;
  spinDelay?: number;
  onSpinEnd?: (result: string) => void;
  reelIndex: number;
};

const SlotReel: React.FC<SlotReelProps> = ({
  symbols,
  spinning,
  spinDuration = 2000,
  spinDelay = 0,
  onSpinEnd,
  reelIndex,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleSymbols, setVisibleSymbols] = useState([...symbols.slice(0, 3)]);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const spinInterval = useRef<NodeJS.Timeout | null>(null);

  // Function to get random symbol position
  const getRandomSymbolIndex = () => Math.floor(Math.random() * symbols.length);

  useEffect(() => {
    if (spinning && !isSpinning) {
      // Start spinning with delay based on reel index
      const totalDelay = spinDelay + reelIndex * 300;
      
      spinTimeoutRef.current = setTimeout(() => {
        setIsSpinning(true);
        
        // Rapidly change visible symbols during spin
        spinInterval.current = setInterval(() => {
          setVisibleSymbols([
            symbols[getRandomSymbolIndex()],
            symbols[getRandomSymbolIndex()],
            symbols[getRandomSymbolIndex()]
          ]);
        }, 100);
        
        // Stop spinning after duration
        setTimeout(() => {
          if (spinInterval.current) clearInterval(spinInterval.current);
          
          // Final result
          const resultIndex = getRandomSymbolIndex();
          setCurrentIndex(resultIndex);
          
          // Show result in middle position with symbols above and below
          const prevIndex = (resultIndex - 1 + symbols.length) % symbols.length;
          const nextIndex = (resultIndex + 1) % symbols.length;
          
          setVisibleSymbols([
            symbols[prevIndex],
            symbols[resultIndex],
            symbols[nextIndex]
          ]);
          
          setIsSpinning(false);
          
          if (onSpinEnd) {
            onSpinEnd(symbols[resultIndex]);
          }
        }, spinDuration);
      }, totalDelay);
    }
    
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (spinInterval.current) clearInterval(spinInterval.current);
    };
  }, [spinning, isSpinning, spinDuration, spinDelay, symbols, onSpinEnd, reelIndex]);

  return (
    <div className="reel-container h-72 w-28 rounded-lg border-2 border-gray-800 p-1 flex flex-col items-center justify-center relative">
      {/* Highlight lines */}
      <div className="absolute w-full h-0.5 bg-red-600 top-1/2 transform -translate-y-1/2 z-10"></div>
      
      {/* Reel content */}
      <div 
        className={cn(
          "h-full w-full flex flex-col items-center py-4 transition-all duration-200",
          isSpinning && "animate-spin-reel"
        )}
      >
        {visibleSymbols.map((symbol, idx) => (
          <div 
            key={idx} 
            className={cn(
              "flex items-center justify-center my-2 transition-all duration-300",
              idx === 1 && !isSpinning && "scale-110"
            )}
          >
            <SlotSymbol 
              type={symbol} 
              size="md"
              highlighted={idx === 1 && !isSpinning && !spinning} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlotReel;
