
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
  showWinLine?: boolean;
};

const SlotReel: React.FC<SlotReelProps> = ({
  symbols,
  spinning,
  spinDuration = 2000,
  spinDelay = 0,
  onSpinEnd,
  reelIndex,
  showWinLine = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleSymbols, setVisibleSymbols] = useState([...symbols.slice(0, 3)]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinSpeed, setSpinSpeed] = useState(100);
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const spinInterval = useRef<NodeJS.Timeout | null>(null);
  const reelRef = useRef<HTMLDivElement>(null);

  // Function to get random symbol position
  const getRandomSymbolIndex = () => Math.floor(Math.random() * symbols.length);

  // Function to get valid symbols (ensure no BLANK during spinning)
  const getValidSpinSymbol = () => {
    const validSymbols = symbols.filter(symbol => symbol !== 'BLANK');
    return validSymbols[Math.floor(Math.random() * validSymbols.length)];
  };

  // Create a full reel of symbols for continuous animation
  const createReelStrip = () => {
    // Filter out BLANKs during spinning to avoid empty spaces
    const reelSymbols = spinning ? symbols.filter(s => s !== 'BLANK') : symbols;
    
    let strip = [];
    // Create enough symbols to fill the view and allow for smooth scrolling
    for (let i = 0; i < 20; i++) {
      strip.push(reelSymbols[Math.floor(Math.random() * reelSymbols.length)]);
    }
    return strip;
  };

  useEffect(() => {
    if (spinning && !isSpinning) {
      // Start spinning with delay based on reel index
      const totalDelay = spinDelay + reelIndex * 300;
      
      spinTimeoutRef.current = setTimeout(() => {
        setIsSpinning(true);
        
        // Create an initial reel strip with valid symbols (no BLANKs)
        const initialStrip = [
          getValidSpinSymbol(),
          getValidSpinSymbol(),
          getValidSpinSymbol(),
          getValidSpinSymbol(),
          getValidSpinSymbol()
        ];
        
        setVisibleSymbols(initialStrip);
        
        // Start with fast spin speed
        setSpinSpeed(50);
        
        // Rapidly change visible symbols during spin
        spinInterval.current = setInterval(() => {
          setVisibleSymbols(prev => {
            // Move symbols up (remove first, add new at end)
            const newSymbols = [...prev.slice(1)];
            newSymbols.push(getValidSpinSymbol());
            return newSymbols;
          });
        }, spinSpeed);
        
        // Gradually slow down the spin before stopping
        setTimeout(() => {
          if (spinInterval.current) clearInterval(spinInterval.current);
          
          // Slower spin for "winding down" effect
          setSpinSpeed(120);
          
          spinInterval.current = setInterval(() => {
            setVisibleSymbols(prev => {
              const newSymbols = [...prev.slice(1)];
              newSymbols.push(getValidSpinSymbol());
              return newSymbols;
            });
          }, spinSpeed);
          
          // Final slowdown before stop
          setTimeout(() => {
            if (spinInterval.current) clearInterval(spinInterval.current);
            
            // Even slower for final rotations
            setSpinSpeed(200);
            
            spinInterval.current = setInterval(() => {
              setVisibleSymbols(prev => {
                const newSymbols = [...prev.slice(1)];
                newSymbols.push(getValidSpinSymbol());
                return newSymbols;
              });
            }, spinSpeed);
            
            // Final stop with result
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
            }, 600);
          }, 500);
        }, spinDuration - 1600); // Subtract the time for slowdowns
        
      }, totalDelay);
    }
    
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (spinInterval.current) clearInterval(spinInterval.current);
    };
  }, [spinning, isSpinning, spinDuration, spinDelay, symbols, onSpinEnd, reelIndex]);

  return (
    <div className="reel-container h-72 w-28 rounded-lg border-2 border-gray-800 p-1 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Marquee lights around the reel */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-around">
          {Array.from({length: 10}).map((_, i) => (
            <div 
              key={`left-${i}`} 
              className={cn(
                "w-2 h-2 rounded-full",
                spinning ? "animate-pulse bg-red-500" : "bg-red-600"
              )}
              style={{ 
                animationDelay: `${i * 0.15}s`,
                boxShadow: spinning ? '0 0 8px 2px rgba(255, 0, 0, 0.6)' : '0 0 5px 1px rgba(255, 0, 0, 0.3)',
                marginLeft: '2px'
              }}
            ></div>
          ))}
        </div>
        
        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-around">
          {Array.from({length: 10}).map((_, i) => (
            <div 
              key={`right-${i}`} 
              className={cn(
                "w-2 h-2 rounded-full",
                spinning ? "animate-pulse bg-red-500" : "bg-red-600"
              )}
              style={{ 
                animationDelay: `${i * 0.15}s`,
                boxShadow: spinning ? '0 0 8px 2px rgba(255, 0, 0, 0.6)' : '0 0 5px 1px rgba(255, 0, 0, 0.3)',
                marginRight: '2px'
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Glass reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent z-20 pointer-events-none"></div>
      
      {/* Highlight winning line - only show when there is a win */}
      {showWinLine && (
        <div className="absolute w-full h-2 bg-red-600 top-1/2 transform -translate-y-1/2 z-10 animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.8)]"></div>
      )}
      
      {/* Reel content */}
      <div 
        ref={reelRef}
        className={cn(
          "h-full w-full flex flex-col items-center py-4 transition-all duration-200",
          isSpinning ? "animate-spin-reel" : ""
        )}
        style={{
          transform: isSpinning ? 'translateY(-20px)' : 'translateY(0)',
          transition: isSpinning ? 'transform 100ms linear' : 'transform 500ms cubic-bezier(0.33, 1, 0.68, 1)'
        }}
      >
        {visibleSymbols.map((symbol, idx) => (
          <div 
            key={`${symbol}-${idx}`} 
            className={cn(
              "flex items-center justify-center my-2 transition-all duration-300",
              idx === 1 && !isSpinning && "scale-110"
            )}
          >
            <SlotSymbol 
              type={symbol} 
              size="md"
              highlighted={idx === 1 && !isSpinning && !spinning && showWinLine} 
            />
          </div>
        ))}
      </div>
      
      {/* Chrome effect to make it more realistic */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/20 to-transparent z-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/20 to-transparent z-10"></div>
        
        {/* Inner shadows for depth */}
        <div className="absolute inset-0 shadow-[inset_0_5px_15px_rgba(0,0,0,0.4)] rounded-lg"></div>
      </div>
    </div>
  );
};

export default SlotReel;
