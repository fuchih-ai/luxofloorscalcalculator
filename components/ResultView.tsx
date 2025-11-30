import React from "react";
import { CalculationResult } from "../types";
import { Button } from "./ui/Button";
import { CheckCircle2, ArrowRight, Phone, Calendar } from "lucide-react";

interface ResultViewProps {
  result: CalculationResult;
  onRestart: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onRestart }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-luxo-pistachio text-luxo-teal mb-6">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-luxo-charcoal">Your Estimate is Ready</h2>
        <p className="mt-3 text-luxo-lava max-w-md mx-auto font-light">
          Based on the details provided, here is a preliminary range for your project.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-luxo-charcoal/5 border border-luxo-pistachio overflow-hidden mb-8">
        <div className="p-8 border-b border-luxo-pistachio bg-luxo-glass">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-luxo-lava uppercase tracking-wider">Estimated Area</p>
                <p className="text-3xl font-bold text-luxo-charcoal">~{result.roundedArea} m²</p>
              </div>
              <div className="md:text-right">
                <p className="text-sm font-medium text-luxo-lava uppercase tracking-wider">Estimated Cost</p>
                <p className="text-3xl font-bold text-luxo-teal">
                  ${result.totalMin.toLocaleString()} – ${result.totalMax.toLocaleString()}
                </p>
              </div>
           </div>
        </div>
        
        <div className="p-8">
          <h4 className="font-semibold text-luxo-charcoal mb-4">What this includes:</h4>
          <ul className="space-y-3">
            {[
              "Premium flooring materials",
              "Professional installation",
              "Floor levelling (as estimated)",
              "Old floor removal & disposal",
              "Edge finishing (Scotia/Skirting)",
              "Site cleanup & skip bin"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-luxo-charcoal/80">
                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-luxo-teal shrink-0" />
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          {result.breakdown && (
            <div className="mt-8 pt-8 border-t border-luxo-pistachio">
              <h4 className="font-semibold text-luxo-charcoal mb-2">Rough cost breakdown</h4>
              <p className="text-sm text-luxo-lava mb-6 font-light">
                These numbers are approximate, but they show where most of your budget goes.
              </p>
              <div className="bg-luxo-pistachio/40 rounded-xl p-5 space-y-3">
                <div className="flex justify-between text-sm">
                   <span className="text-luxo-lava">Flooring materials</span>
                   <span className="font-medium text-luxo-charcoal">${result.breakdown.materialCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-luxo-lava">Installation</span>
                   <span className="font-medium text-luxo-charcoal">${result.breakdown.installMin.toLocaleString()} – ${result.breakdown.installMax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-luxo-lava">Floor levelling</span>
                   <span className="font-medium text-luxo-charcoal">${result.breakdown.levellingMin.toLocaleString()} – ${result.breakdown.levellingMax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-luxo-lava">Removing old floors</span>
                   <span className="font-medium text-luxo-charcoal">${result.breakdown.removalMin.toLocaleString()} – ${result.breakdown.removalMax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-luxo-lava">Edge finishing (scotia / skirting)</span>
                   <span className="font-medium text-luxo-charcoal">${result.breakdown.edgeMin.toLocaleString()} – ${result.breakdown.edgeMax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-luxo-lava">Stairs (if any)</span>
                   <span className="font-medium text-luxo-charcoal">${result.breakdown.stairsTotalMin.toLocaleString()} – ${result.breakdown.stairsTotalMax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-luxo-lava">Skip bin (if needed)</span>
                   <span className="font-medium text-luxo-charcoal">${result.breakdown.skipBinMin.toLocaleString()} – ${result.breakdown.skipBinMax.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-orange-50 rounded-xl border border-orange-100">
            <h5 className="text-orange-800 font-semibold text-sm mb-1">Important Note</h5>
            <p className="text-orange-700 text-xs leading-relaxed">
               This estimate is based on typical Australian installation rates. A quick site check confirms the exact final price.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="brand" size="lg" className="w-full sm:w-auto shadow-lg shadow-luxo-teal/20 group">
          <Calendar className="w-4 h-4 mr-2" />
          Book Free Site Check
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
        <Button variant="outline" size="lg" className="w-full sm:w-auto">
          <Phone className="w-4 h-4 mr-2" />
          Have LUXO Floors call me
        </Button>
      </div>
      
      <div className="mt-12 text-center">
        <button onClick={onRestart} className="text-sm text-luxo-steel hover:text-luxo-charcoal transition-colors">
          Start Over
        </button>
      </div>
    </div>
  );
};