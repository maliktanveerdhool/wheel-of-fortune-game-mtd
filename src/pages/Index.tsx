
import React from 'react';
import SlotMachine from '@/components/SlotMachine';

const Index = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center pt-8 pb-12 red-rays">
      <div className="container max-w-4xl mx-auto px-4">
        <SlotMachine />
        
        <div className="mt-12 bg-black/30 backdrop-blur-sm rounded-lg p-6 text-white max-w-2xl mx-auto">
          <h2 className="gold-text text-2xl font-bold mb-4">How to Play</h2>
          <ul className="space-y-2 text-sm">
            <li>• Set your bet amount using the + and - buttons</li>
            <li>• Click the spin button to start the reels</li>
            <li>• Match symbols across the center line to win</li>
            <li>• Three matching symbols pay the highest rewards</li>
            <li>• "TRIPLE" symbols offer the biggest payout (300x your bet)</li>
          </ul>
          
          <h3 className="gold-text text-xl font-bold mt-6 mb-3">Winning Combinations</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>• 3 TRIPLE: 300x</div>
            <div>• 3 SEVEN: 100x</div>
            <div>• 3 SPIN: 75x</div>
            <div>• 3 BAR: 50x</div>
            <div>• TRIPLE + TRIPLE + SEVEN: 30x</div>
            <div>• TRIPLE + TRIPLE + BAR: 25x</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
