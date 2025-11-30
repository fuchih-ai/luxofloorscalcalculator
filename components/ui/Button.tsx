import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "brand";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-luxo-charcoal text-white hover:bg-black focus:ring-luxo-charcoal border border-transparent shadow-sm",
    brand: "bg-luxo-teal text-white hover:bg-[#4A8694] focus:ring-luxo-teal border border-transparent shadow-sm",
    secondary: "bg-luxo-pistachio text-luxo-charcoal hover:bg-[#DCEAE8] focus:ring-luxo-teal border border-transparent",
    outline: "bg-white text-luxo-charcoal border border-luxo-steel hover:bg-luxo-glass focus:ring-luxo-charcoal",
    ghost: "bg-transparent text-luxo-lava hover:text-luxo-charcoal hover:bg-luxo-pistachio/50",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};