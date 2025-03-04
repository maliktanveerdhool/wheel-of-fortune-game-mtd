
import React from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

interface GoldButtonProps extends ButtonProps {
  glowing?: boolean;
}

const GoldButton: React.FC<GoldButtonProps> = ({
  children,
  className,
  glowing = false,
  ...props
}) => {
  return (
    <Button
      className={cn(
        "relative overflow-hidden",
        "bg-gold-gradient border-2 border-gold-light text-black font-bold",
        "transition-all duration-300 ease-in-out",
        glowing && "animate-pulse-glow",
        "button-3d shadow-md hover:shadow-lg",
        "hover:scale-105 active:scale-95",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <span 
        className={cn(
          "absolute inset-0 bg-white opacity-20 shine-effect",
          "transform -translate-x-full"
        )}
      />
    </Button>
  );
};

export default GoldButton;
