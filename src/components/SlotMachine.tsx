import React, { useState, useEffect } from 'react';
import SlotReel from './SlotReel';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Coins, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import GameLogo from './GameLogo';

// Define symbols and their values
const SYMBOLS = ['BAR', 'SEVEN', 'TRIPLE', 'SPIN', 'BLANK'] as const;
type Symbol = typeof SYMBOLS[number];

// Define payout multipliers
const PAYOUTS = {
  'BAR-BAR-BAR': 50,
  'SEVEN-SEVEN-SEVEN': 100,
  'TRIPLE-TRIPLE-TRIPLE': 300,
  'SPIN-SPIN-SPIN': 75,
  'BAR-BAR-SEVEN': 20,
  'SEVEN-SEVEN-BAR': 20,
  'TRIPLE-TRIPLE-BAR': 25,
  'TRIPLE-TRIPLE-SEVEN': 30,
  'SPIN-SPIN-BAR': 15,
  'SPIN-SPIN-SEVEN': 20,
  'SPIN-SPIN-TRIPLE': 25,
};

const SlotMachine: React.FC = () => {
  const [spinning, setSpinning] = useState(false);
  const [reelResults, setReelResults] = useState<Symbol[]>(['BLANK', 'BLANK', 'BLANK']);
  const [balance, setBalance] = useState(10000);
  const [bet, setBet] = useState(100);
  const [win, setWin] = useState(0);
  const [winningLine, setWinningLine] = useState(false);
  
  // Available bets
  const betOptions = [50, 100, 250, 500, 1000];

  // Reels configuration - each reel has different probability distribution
  const reelSymbols: Symbol[][] = [
    ['BAR', 'BAR', 'SEVEN', 'SEVEN', 'TRIPLE', 'SPIN', 'BLANK', 'BAR', 'SEVEN', 'BLANK'],
    ['BAR', 'SEVEN', 'SEVEN', 'TRIPLE', 'TRIPLE', 'SPIN', 'BLANK', 'BLANK', 'BAR', 'SEVEN'],
    ['SEVEN', 'SEVEN', 'TRIPLE', 'BAR', 'SPIN', 'SPIN', 'BLANK', 'BLANK', 'TRIPLE', 'BAR']
  ];

  const increaseBet = () => {
    const currentIndex = betOptions.indexOf(bet);
    if (currentIndex < betOptions.length - 1) {
      setBet(betOptions[currentIndex + 1]);
    }
  };

  const decreaseBet = () => {
    const currentIndex = betOptions.indexOf(bet);
    if (currentIndex > 0) {
      setBet(betOptions[currentIndex - 1]);
    }
  };

  const handleSpin = () => {
    if (spinning) return;
    
    // Check if player has enough balance
    if (balance < bet) {
      toast.error("Insufficient balance!");
      return;
    }
    
    // Deduct bet from balance
    setBalance(prev => prev - bet);
    setWin(0);
    setWinningLine(false);
    
    // Start spinning
    setSpinning(true);
  };

  const handleReelStop = (reelIndex: number, result: string) => {
    // Update the result for this reel
    setReelResults(prev => {
      const newResults = [...prev];
      newResults[reelIndex] = result as Symbol;
      return newResults;
    });
    
    // Check if all reels have stopped
    if (reelIndex === 2) {
      setTimeout(() => {
        const resultKey = reelResults.join('-');
        
        // Check if it matches any winning combination
        if (PAYOUTS[resultKey as keyof typeof PAYOUTS]) {
          const multiplier = PAYOUTS[resultKey as keyof typeof PAYOUTS];
          const winAmount = bet * multiplier;
          
          setWin(winAmount);
          setBalance(prev => prev + winAmount);
          setWinningLine(true);
          
          // Display win animation and message immediately
          toast.success(`You won ${winAmount.toLocaleString()}!`, {
            position: "top-center"
          });
        }
        
        setSpinning(false);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Game title */}
      <div className="relative mb-4">
        <GameLogo size="md" />
        <div className="flex justify-between w-full px-4 mt-2">
          <div className="gold-text text-2xl font-bold">TRIPLE GOLD</div>
          <div className="gold-text text-2xl font-bold">GOLD SPIN</div>
        </div>
      </div>
      
      {/* Slot machine cabinet */}
      <div className="slot-machine rounded-xl p-6 relative">
        {/* Top display */}
        <div className="bg-black rounded-lg mb-4 p-2 border-2 border-gold-dark flex justify-between">
          <div className="text-white font-bold">WHEEL OF FORTUNE</div>
          <div className="text-gold font-bold">GOLD SPIN</div>
        </div>
        
        {/* Reels container */}
        <div className="flex justify-center gap-3 p-4 bg-black rounded-lg border-4 border-slot-border relative">
          {/* Winning line highlight */}
          {winningLine && (
            <div className="absolute h-24 w-full top-1/2 transform -translate-y-1/2 bg-gold-light opacity-20 z-0 animate-pulse"></div>
          )}
          
          {reelSymbols.map((symbols, index) => (
            <SlotReel
              key={index}
              symbols={symbols}
              spinning={spinning}
              spinDuration={2000 + index * 500}
              reelIndex={index}
              onSpinEnd={(result) => handleReelStop(index, result)}
            />
          ))}
          
          {/* Light decorations on the sides */}
          <div className="absolute left-0 top-0 bottom-0 w-2 flex flex-col justify-around">
            {Array.from({length: 8}).map((_, i) => (
              <div 
                key={`left-${i}`} 
                className={cn(
                  "w-2 h-2 rounded-full bg-red-500", 
                  spinning && "animate-pulse"
                )}
              ></div>
            ))}
          </div>
          
          <div className="absolute right-0 top-0 bottom-0 w-2 flex flex-col justify-around">
            {Array.from({length: 8}).map((_, i) => (
              <div 
                key={`right-${i}`} 
                className={cn(
                  "w-2 h-2 rounded-full bg-red-500", 
                  spinning && "animate-pulse"
                )}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Controls section */}
        <div className="flex justify-between mt-4 gap-3">
          {/* Bet controls */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-gold-dark text-white button-3d border-2 border-gold-light" 
              onClick={decreaseBet}
              disabled={spinning || betOptions.indexOf(bet) === 0}
            >
              <span className="text-xl font-bold">-</span>
            </Button>
            
            <div className="flex flex-col items-center justify-center bg-black rounded-lg border-2 border-gold px-4 py-2 min-w-24">
              <span className="text-gold text-xl font-bold">{bet.toLocaleString()}</span>
              <span className="text-white text-xs">TOTAL BET</span>
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-gold-dark text-white button-3d border-2 border-gold-light" 
              onClick={increaseBet}
              disabled={spinning || betOptions.indexOf(bet) === betOptions.length - 1}
            >
              <span className="text-xl font-bold">+</span>
            </Button>
          </div>
          
          {/* Win display */}
          <div className="flex flex-col items-center justify-center bg-black rounded-lg border-2 border-gold px-6 py-2 min-w-28">
            <span className={cn(
              "text-xl font-bold",
              win > 0 ? "text-gold animate-pulse" : "text-white"
            )}>
              {win.toLocaleString()}
            </span>
            <span className="text-white text-xs">WIN</span>
          </div>
          
          {/* Balance display */}
          <div className="flex flex-col items-center justify-center bg-black rounded-lg border-2 border-gold px-4 py-2 min-w-28">
            <span className="text-gold text-xl font-bold">{balance.toLocaleString()}</span>
            <span className="text-white text-xs">BALANCE</span>
          </div>
        </div>
      </div>
      
      {/* Spin button */}
      <div className="mt-6">
        <Button 
          onClick={handleSpin} 
          disabled={spinning || balance < bet}
          className={cn(
            "rounded-full w-20 h-20 button-3d border-4",
            spinning 
              ? "bg-blue-400 border-blue-600" 
              : "bg-teal-400 border-teal-600 hover:bg-teal-500",
            "shadow-lg flex items-center justify-center"
          )}
        >
          {spinning ? (
            <RotateCw className="h-10 w-10 text-white animate-spin" />
          ) : (
            <Coins className="h-10 w-10 text-white" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default SlotMachine;
