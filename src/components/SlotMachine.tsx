import React, { useState, useEffect } from 'react';
import SlotReel from './SlotReel';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Coins, RotateCw, Volume2, VolumeX, Zap, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import GameLogo from './GameLogo';

const SYMBOLS = ['BAR', 'SEVEN', 'TRIPLE', 'SPIN', 'BLANK'] as const;
type Symbol = typeof SYMBOLS[number];

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
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const betOptions = [50, 100, 250, 500, 1000];

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
    
    if (balance < bet) {
      toast.error("Insufficient balance!");
      return;
    }
    
    setBalance(prev => prev - bet);
    setWin(0);
    setWinningLine(false);
    
    setSpinning(true);
  };

  const handleReelStop = (reelIndex: number, result: string) => {
    setReelResults(prev => {
      const newResults = [...prev];
      newResults[reelIndex] = result as Symbol;
      return newResults;
    });
    
    if (reelIndex === 2) {
      setTimeout(() => {
        checkWinningCombination();
        setSpinning(false);
      }, 500);
    }
  };

  const checkWinningCombination = () => {
    const resultKey = reelResults.join('-');
    
    if (PAYOUTS[resultKey as keyof typeof PAYOUTS]) {
      const multiplier = PAYOUTS[resultKey as keyof typeof PAYOUTS];
      const winAmount = bet * multiplier;
      
      setWin(winAmount);
      setBalance(prev => prev + winAmount);
      setWinningLine(true);
      
      toast.success(`You won ${winAmount.toLocaleString()}!`, {
        position: "top-center",
        icon: <Trophy className="h-5 w-5 text-gold" />
      });
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="self-end mb-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-black/40 text-white border-gold-dark"
          onClick={toggleSound}
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4 text-gold" />
          ) : (
            <VolumeX className="h-4 w-4 text-gold" />
          )}
        </Button>
      </div>
      
      <div className="relative mb-6">
        <GameLogo size="md" />
        <div className="flex justify-between w-full px-4 mt-2">
          <div className="gold-text text-2xl font-bold shine-effect">TRIPLE GOLD</div>
          <div className="gold-text text-2xl font-bold shine-effect">GOLD SPIN</div>
        </div>
      </div>
      
      <div className="slot-machine rounded-xl p-6 relative shadow-2xl">
        <div className="bg-black rounded-lg mb-6 p-3 border-2 border-gold-dark flex justify-between items-center">
          <div className="text-white font-bold text-lg">WHEEL OF FORTUNE</div>
          <div className="flex gap-2 items-center">
            {Array.from({length: 5}).map((_, i) => (
              <div 
                key={`top-${i}`} 
                className={cn(
                  "w-3 h-3 rounded-full",
                  spinning ? "animate-pulse bg-amber-400" : "bg-amber-500"
                )}
                style={{ 
                  animationDelay: `${i * 0.2}s`,
                  boxShadow: spinning ? '0 0 8px 2px rgba(255, 215, 0, 0.6)' : 'none'
                }}
              ></div>
            ))}
          </div>
          <div className="text-gold font-bold text-lg">GOLD SPIN</div>
        </div>
        
        <div className="flex justify-center gap-3 p-4 bg-black rounded-lg border-4 border-slot-border relative">
          <div className="absolute inset-0 border-4 border-gold-dark rounded-lg opacity-60 pointer-events-none"></div>
          
          {reelSymbols.map((symbols, index) => (
            <SlotReel
              key={index}
              symbols={symbols}
              spinning={spinning}
              spinDuration={2000 + index * 500}
              reelIndex={index}
              onSpinEnd={(result) => handleReelStop(index, result)}
              showWinLine={winningLine}
            />
          ))}
          
          <div className="absolute left-0 top-0 bottom-0 w-2 flex flex-col justify-around">
            {Array.from({length: 8}).map((_, i) => (
              <div 
                key={`left-${i}`} 
                className={cn(
                  "w-3 h-3 rounded-full",
                  spinning ? "animate-pulse bg-red-500" : "bg-red-600"
                )}
                style={{ 
                  animationDelay: `${i * 0.15}s`,
                  boxShadow: spinning ? '0 0 8px 2px rgba(255, 0, 0, 0.4)' : 'none',
                  marginLeft: '-4px'
                }}
              ></div>
            ))}
          </div>
          
          <div className="absolute right-0 top-0 bottom-0 w-2 flex flex-col justify-around">
            {Array.from({length: 8}).map((_, i) => (
              <div 
                key={`right-${i}`} 
                className={cn(
                  "w-3 h-3 rounded-full",
                  spinning ? "animate-pulse bg-red-500" : "bg-red-600"
                )}
                style={{ 
                  animationDelay: `${i * 0.15}s`,
                  boxShadow: spinning ? '0 0 8px 2px rgba(255, 0, 0, 0.4)' : 'none',
                  marginRight: '-4px'
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between mt-6 gap-3 p-4 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg border border-gray-600 shadow-lg">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-gold-dark text-white button-3d border-2 border-gold-light shadow-md" 
              onClick={decreaseBet}
              disabled={spinning || betOptions.indexOf(bet) === 0}
            >
              <span className="text-xl font-bold">-</span>
            </Button>
            
            <div className="flex flex-col items-center justify-center bg-black rounded-lg border-2 border-gold px-4 py-2 min-w-24 shadow-inner">
              <span className="text-gold text-xl font-bold">{bet.toLocaleString()}</span>
              <span className="text-white text-xs">TOTAL BET</span>
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-gold-dark text-white button-3d border-2 border-gold-light shadow-md" 
              onClick={increaseBet}
              disabled={spinning || betOptions.indexOf(bet) === betOptions.length - 1}
            >
              <span className="text-xl font-bold">+</span>
            </Button>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-black rounded-lg border-2 border-gold px-6 py-2 min-w-28 shadow-inner">
            <span className={cn(
              "text-xl font-bold",
              win > 0 ? "text-gold animate-pulse" : "text-white"
            )}
              style={{
                textShadow: win > 0 ? '0 0 10px rgba(255, 215, 0, 0.8)' : 'none'
              }}
            >
              {win.toLocaleString()}
            </span>
            <span className="text-white text-xs">WIN</span>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-black rounded-lg border-2 border-gold px-4 py-2 min-w-28 shadow-inner">
            <span className="text-gold text-xl font-bold">{balance.toLocaleString()}</span>
            <span className="text-white text-xs">BALANCE</span>
          </div>
        </div>
        
        <div className="w-full h-6 mt-4 bg-pattern-casino rounded-b-lg border-t-2 border-gold-dark/30"></div>
      </div>
      
      <div className="mt-6">
        <Button 
          onClick={handleSpin} 
          disabled={spinning || balance < bet}
          className={cn(
            "rounded-full w-20 h-20 button-3d border-4 relative",
            spinning 
              ? "bg-blue-500 border-blue-700 shadow-blue-300/50" 
              : "bg-gradient-to-br from-teal-400 to-teal-600 border-teal-700 hover:from-teal-500 hover:to-teal-700 shadow-teal-300/50",
            "shadow-lg flex items-center justify-center overflow-hidden"
          )}
        >
          <div className="absolute inset-0 rounded-full bg-white/20 opacity-70"></div>
          
          {spinning ? (
            <RotateCw className="h-10 w-10 text-white animate-spin relative z-10" />
          ) : (
            <>
              <Zap className="absolute h-full w-full text-white/10 animate-pulse" />
              <Coins className="h-10 w-10 text-white relative z-10" />
            </>
          )}
          
          <div className={cn(
            "absolute inset-0 rounded-full",
            spinning ? "animate-none" : "animate-pulse-glow"
          )} 
          style={{
            boxShadow: spinning ? 'none' : '0 0 15px 5px rgba(20, 184, 166, 0.4)'
          }}></div>
        </Button>
      </div>
    </div>
  );
};

export default SlotMachine;
