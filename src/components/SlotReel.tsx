
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
  // Always filter out BLANK symbols during spinning to prevent empty slots
  const validSymbols = symbols.filter(symbol => symbol !== 'BLANK');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleSymbols, setVisibleSymbols] = useState([
    validSymbols[Math.floor(Math.random() * validSymbols.length)],
    validSymbols[Math.floor(Math.random() * validSymbols.length)],
    validSymbols[Math.floor(Math.random() * validSymbols.length)]
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinSpeed, setSpinSpeed] = useState(30); // Faster initial speed for smoother animation
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const spinInterval = useRef<NodeJS.Timeout | null>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);

  // Function to get random valid symbol (never BLANK)
  const getRandomSymbol = () => {
    return validSymbols[Math.floor(Math.random() * validSymbols.length)];
  };

  // Function to create a full strip of symbols for animation
  const createReelStrip = (count: number = 15) => {
    let strip = [];
    for (let i = 0; i < count; i++) {
      strip.push(getRandomSymbol());
    }
    return strip;
  };

  // Use requestAnimationFrame for smoother animation
  const animateReel = (timestamp: number) => {
    if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
    
    const elapsed = timestamp - lastTimestampRef.current;
    
    if (elapsed > spinSpeed) {
      lastTimestampRef.current = timestamp;
      
      setVisibleSymbols(prev => {
        const newSymbols = [...prev.slice(1)];
        newSymbols.push(getRandomSymbol());
        return newSymbols;
      });
    }
    
    if (isSpinning) {
      animationRef.current = requestAnimationFrame(animateReel);
    }
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (spinInterval.current) {
      clearInterval(spinInterval.current);
      spinInterval.current = null;
    }
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }
    lastTimestampRef.current = 0;
  };

  useEffect(() => {
    if (spinning && !isSpinning) {
      // Start spinning with delay based on reel index
      const totalDelay = spinDelay + reelIndex * 250;
      
      spinTimeoutRef.current = setTimeout(() => {
        setIsSpinning(true);
        
        // Create a strip with only valid symbols
        const initialStrip = createReelStrip(5);
        setVisibleSymbols(initialStrip.slice(0, 3));
        
        // Start with fast spin speed using requestAnimationFrame
        setSpinSpeed(30);
        animationRef.current = requestAnimationFrame(animateReel);
        
        // Gradually slow down
        setTimeout(() => {
          // Medium speed
          setSpinSpeed(50);
          
          setTimeout(() => {
            // Slower speed
            setSpinSpeed(80);
            
            setTimeout(() => {
              // Final very slow speed before stopping
              setSpinSpeed(120);
              
              // Final stop with result
              setTimeout(() => {
                stopAnimation();
                
                // Select a random result from valid symbols
                const resultIndex = Math.floor(Math.random() * validSymbols.length);
                const result = validSymbols[resultIndex];
                
                // Find valid symbols for positions above and below
                const prevIndex = (resultIndex - 1 + validSymbols.length) % validSymbols.length;
                const nextIndex = (resultIndex + 1) % validSymbols.length;
                
                // Set final visible symbols with the result in the middle
                setVisibleSymbols([
                  validSymbols[prevIndex],
                  result,
                  validSymbols[nextIndex]
                ]);
                
                setIsSpinning(false);
                
                if (onSpinEnd) {
                  onSpinEnd(result);
                }
              }, 400);
            }, 500);
          }, 600);
        }, spinDuration - 1700); // Subtract the time for slowdowns
        
      }, totalDelay);
    }
    
    return () => {
      stopAnimation();
    };
  }, [spinning, isSpinning, spinDuration, spinDelay, onSpinEnd, reelIndex, validSymbols]);

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
          "h-full w-full flex flex-col items-center py-4 transition-all",
          isSpinning ? "animate-spin-reel" : ""
        )}
        style={{
          transform: isSpinning ? 'translateY(-20px)' : 'translateY(0)',
          transition: isSpinning 
            ? 'transform 50ms linear' 
            : 'transform 500ms cubic-bezier(0.33, 1, 0.68, 1)'
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
