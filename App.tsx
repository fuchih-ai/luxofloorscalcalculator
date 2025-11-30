import React from "react";
import { Calculator } from "./components/Calculator";

// Custom Logo Component based on Brand Guidelines (L + Bird motif)
const LuxoLogo = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <path 
      d="M12 12C12 10.3431 13.3431 9 15 9H18C20.2091 9 22 10.7909 22 13V24C22 28.4183 25.5817 32 30 32H32C33.6569 32 35 33.3431 35 35C35 36.6569 33.6569 38 32 38H24C17.3726 38 12 32.6274 12 26V12Z" 
      fill="#5A97A5"
    />
    <path 
      d="M22 24C22 19.5817 25.5817 16 30 16C33.3137 16 36 18.6863 36 22V26C36 29.3137 33.3137 32 30 32H30C25.5817 32 22 28.4183 22 24Z" 
      fill="#5A97A5"
    />
  </svg>
);

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-luxo-glass font-sans text-luxo-charcoal">
      {/* Header */}
      <header className="w-full border-b border-luxo-pistachio bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LuxoLogo />
            <div className="flex flex-col justify-center -space-y-1">
              <span className="font-bold text-2xl tracking-tight leading-none text-luxo-charcoal">LUXO</span>
              <span className="font-medium text-lg tracking-wide leading-none text-luxo-charcoal">Floors</span>
            </div>
          </div>
          <div className="text-sm font-medium text-luxo-lava hidden sm:block">
            Flooring Estimator
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-8 sm:py-12">
        <Calculator />
      </main>

      {/* Simple Footer */}
      <footer className="w-full py-8 text-center text-luxo-steel text-xs border-t border-luxo-pistachio mt-auto">
        <p>&copy; {new Date().getFullYear()} Luxo Floors. All rights reserved.</p>
        <p className="mt-1">Estimates are indicative only.</p>
      </footer>
    </div>
  );
}