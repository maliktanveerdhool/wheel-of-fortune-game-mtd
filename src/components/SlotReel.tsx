
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
  
  const [visibleSymbols, setVisibleSymbols] = useState([
    validSymbols[Math.floor(Math.random() * validSymbols.length)],
    validSymbols[Math.floor(Math.random() * validSymbols.length)],
    validSymbols[Math.floor(Math.random() * validSymbols.length)]
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinSpeed, setSpinSpeed] = useState(20); // Faster initial speed for smoother animation
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);
  const spinCountRef = useRef(0);
  const stripRef = useRef<string[]>([]);
  const stripPositionRef = useRef(0);

  // Function to get random valid symbol (never BLANK)
  const getRandomSymbol = () => {
    return validSymbols[Math.floor(Math.random() * validSymbols.length)];
  };

  // Function to create a full strip of symbols for animation
  const createReelStrip = (count: number = 30) => {
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
      
      // Update strip position
      stripPositionRef.current++;
      if (stripPositionRef.current >= stripRef.current.length - 3) {
        stripPositionRef.current = 0;
      }
      
      // Get current visible symbols from the strip
      setVisibleSymbols([
        stripRef.current[(stripPositionRef.current) % stripRef.current.length],
        stripRef.current[(stripPositionRef.current + 1) % stripRef.current.length],
        stripRef.current[(stripPositionRef.current + 2) % stripRef.current.length]
      ]);
      
      spinCountRef.current++;
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
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }
    lastTimestampRef.current = 0;
    spinCountRef.current = 0;
  };

  useEffect(() => {
    if (spinning && !isSpinning) {
      // Start spinning with delay based on reel index
      const totalDelay = spinDelay + reelIndex * 250;
      
      spinTimeoutRef.current = setTimeout(() => {
        setIsSpinning(true);
        
        // Create a strip with only valid symbols
        stripRef.current = createReelStrip(30);
        stripPositionRef.current = 0;
        
        // Get initial visible symbols
        setVisibleSymbols([
          stripRef.current[0],
          stripRef.current[1],
          stripRef.current[2]
        ]);
        
        // Start with very fast spin speed
        setSpinSpeed(15);
        animationRef.current = requestAnimationFrame(animateReel);
        
        // Schedule gradual slowdown for realistic inertia effect
        const slowdownStart = spinDuration * 0.6;
        const finalSlowdownStart = spinDuration * 0.75;
        const stopTime = spinDuration * 0.9;
        
        // First phase - fast spinning
        setTimeout(() => {
          // Medium-fast speed
          setSpinSpeed(25);
        }, slowdownStart / 3);
        
        // Second phase - beginning to slow down
        setTimeout(() => {
          // Medium speed
          setSpinSpeed(40);
        }, slowdownStart);
        
        // Third phase - slowing down more
        setTimeout(() => {
          // Slow speed
          setSpinSpeed(60);
        }, finalSlowdownStart);
        
        // Fourth phase - very slow, almost stopping
        setTimeout(() => {
          // Very slow
          setSpinSpeed(90);
        }, stopTime);
        
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
        }, spinDuration);
        
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
      
      {/* Highlight winning line - always show as a payline, but highlighted when there's a win */}
      <div className={cn(
        "absolute w-full h-2 top-1/2 transform -translate-y-1/2 z-10", 
        showWinLine 
          ? "bg-red-600 animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.8)]" 
          : "bg-red-800/50"
      )}></div>
      
      {/* Reel content */}
      <div 
        className={cn(
          "h-full w-full flex flex-col items-center transition-all",
          isSpinning ? "animate-spin-reel" : ""
        )}
        style={{
          transform: isSpinning ? 'translateY(-20px)' : 'translateY(0)',
          transition: isSpinning 
            ? 'none' 
            : 'transform 500ms cubic-bezier(0.33, 1, 0.68, 1)'
        }}
      >
        {visibleSymbols.map((symbol, idx) => (
          <div 
            key={`${symbol}-${idx}-${isSpinning ? 'spinning' : 'static'}`} 
            className={cn(
              "flex items-center justify-center my-2 transition-all duration-300",
              idx === 1 && !isSpinning && !spinning && "scale-110"
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
