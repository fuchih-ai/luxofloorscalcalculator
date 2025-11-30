import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Answers, ProductType } from "../types";
import { LUXO_CONFIG } from "../constants";
import { calculateEstimate } from "../utils/calculation";
import { Button } from "./ui/Button";
import { OptionCard } from "./ui/OptionCard";
import { SelectionGroup } from "./ui/SelectionGroup";
import { ResultView } from "./ResultView";

const TOTAL_STEPS = 10;

export const Calculator: React.FC = () => {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<ReturnType<typeof calculateEstimate> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [answers, setAnswers] = useState<Answers>({
    product: "HybridPlus",
    bedroomsCount: 3,
    bedroomSize: "medium",
    livingCountRaw: 2,
    livingSizeRaw: "medium",
    includeKitchen: true,
    kitchenSizeRaw: "medium",
    includeHallways: true,
    stairsBand: "none",
    floorEvenness: "mostly_even",
    currentFlooring: [],
    finishType: "scotia",
    name: "",
    suburb: "",
    mobile: "",
    email: "",
  });

  const validateCurrentStep = () => {
    if (step === TOTAL_STEPS - 1) {
      const newErrors: Record<string, string> = {};
      if (!answers.name.trim()) newErrors.name = "Please enter your full name";
      if (!answers.mobile.trim()) newErrors.mobile = "Please enter your mobile number";
      if (!answers.suburb.trim()) newErrors.suburb = "Suburb is required";
      if (!answers.email.trim()) newErrors.email = "Email address is required";
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (step === TOTAL_STEPS - 1) {
      const calc = calculateEstimate(answers, LUXO_CONFIG);
      setResult(calc);
      setStep(TOTAL_STEPS);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    setStep((s) => Math.max(0, s - 1));
  };

  const update = (patch: Partial<Answers>) => {
    setAnswers((prev) => ({ ...prev, ...patch }));
    // Clear error if field is modified
    const key = Object.keys(patch)[0];
    if (key && errors[key]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const toggleFlooring = (type: any) => {
    setAnswers((prev) => {
      const arr = prev.currentFlooring;
      if (arr.includes(type)) {
        return { ...prev, currentFlooring: arr.filter((t) => t !== type) };
      }
      return { ...prev, currentFlooring: [...arr, type] };
    });
  };

  // Progress Calculation
  const progress = ((step + 1) / (TOTAL_STEPS + 1)) * 100;

  if (step === TOTAL_STEPS && result) {
    return <ResultView result={result} onRestart={() => { setStep(0); setResult(null); setAnswers(prev => ({...prev, name: "", mobile: "", suburb: "", email: ""})); }} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-medium text-luxo-lava mb-2 uppercase tracking-widest">
            <span>Step {step + 1} of {TOTAL_STEPS}</span>
            <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-1.5 w-full bg-luxo-pistachio rounded-full overflow-hidden">
          <div 
            className="h-full bg-luxo-teal transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px] animate-in fade-in slide-in-from-bottom-2 duration-500">
        {step === 0 && (
          <>
            <h2 className="text-3xl font-semibold tracking-tight text-luxo-charcoal mb-3">Which LUXO floor fits you?</h2>
            <p className="text-luxo-lava mb-8 text-lg font-light">
              Each floor type has its own material cost and installation difficulty. This helps us calculate a more accurate estimate.
            </p>
            <div className="grid gap-4">
              <OptionCard
                title="8H Hybrid (8mm)"
                subtitle="Best for young families, first homes or investment properties."
                detail="Our best-value option — tough, stylish and budget-friendly without cutting corners."
                active={answers.product === "8H"}
                onClick={() => update({ product: "8H" })}
                priceHint="$"
              />
              <OptionCard
                title="Hybrid Plus (10mm)"
                subtitle="Best for homes with pets, active kids and high-traffic areas."
                detail="Our most popular choice — up to 5× more scratch-resistant than standard flooring. Great for busy homes and everyday wear."
                active={answers.product === "HybridPlus"}
                onClick={() => update({ product: "HybridPlus" })}
                priceHint="$$"
              />
              <OptionCard
                title="CloudStep Acoustic"
                subtitle="Best for upstairs, apartments and home offices."
                detail="Our quietest floor — up to 50% more sound-absorbent than regular flooring. Perfect for echo-prone homes and anyone who prefers a softer, quieter feel."
                active={answers.product === "CloudStep"}
                onClick={() => update({ product: "CloudStep" })}
                priceHint="$$$"
              />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-3xl font-semibold tracking-tight text-luxo-charcoal mb-3">Let’s start with your bedrooms</h2>
            <p className="text-luxo-lava mb-8 text-lg font-light">
              Bedrooms are usually the easiest areas to estimate. Just choose the option that feels closest — near enough is good enough.
            </p>
            
            <p className="text-luxo-charcoal font-medium mb-4">How many bedrooms are you flooring?</p>
            <SelectionGroup
              selectedValue={answers.bedroomsCount}
              onChange={(v) => update({ bedroomsCount: Number(v) })}
              options={[
                { value: 0, label: "0" },
                { value: 1, label: "1" },
                { value: 2, label: "2" },
                { value: 3, label: "3" },
                { value: 4, label: "4+" },
              ]}
            />

            {answers.bedroomsCount > 0 && (
              <div className="mt-12 animate-in fade-in slide-in-from-bottom-2">
                <p className="text-luxo-charcoal font-medium mb-2">Roughly what size are they?</p>
                <p className="text-sm text-luxo-lava mb-4">Just pick what feels closest — it doesn’t have to be exact.</p>
                <SelectionGroup
                  selectedValue={answers.bedroomSize}
                  onChange={(v) => update({ bedroomSize: v as any })}
                  options={[
                    { value: "small", label: "Small — fits a single bed with tight space" },
                    { value: "medium", label: "Medium — fits a queen bed comfortably" },
                    { value: "large", label: "Large — feels spacious or master-like" },
                  ]}
                />
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-3xl font-semibold tracking-tight text-luxo-charcoal mb-3">How many living spaces do you have?</h2>
            <p className="text-luxo-lava mb-8 text-lg font-light">
              Living areas often make up the largest part of the total cost. A rough idea helps us size it correctly.
            </p>
            
            <SelectionGroup
              selectedValue={answers.livingCountRaw}
              onChange={(v) => update({ livingCountRaw: v as any })}
              options={[
                { value: 1, label: "One living space — one lounge or TV area" },
                { value: 2, label: "Two living spaces — open-plan living + dining or lounge + family room" },
                { value: 3, label: "Three or more — rumpus, theatre or extra activity rooms" },
                { value: "not_sure", label: "Not sure — help me estimate" },
              ]}
            />

            <div className="mt-12">
               <p className="text-luxo-charcoal font-medium mb-2">And how big does your main living area feel?</p>
               <SelectionGroup
                  selectedValue={answers.livingSizeRaw}
                  onChange={(v) => update({ livingSizeRaw: v as any })}
                  options={[
                    { value: "small", label: "Small — sofa + TV only" },
                    { value: "medium", label: "Medium — sofa + TV + space to walk around" },
                    { value: "large", label: "Large — sofa + TV + dining table in one big space" },
                    { value: "not_sure", label: "Not sure — recommend for me" },
                  ]}
                />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-3xl font-semibold tracking-tight text-luxo-charcoal mb-3">Include the kitchen?</h2>
             <p className="text-luxo-lava mb-8 text-lg font-light">
               Kitchens usually take a bit more labour due to tight edges and cabinets. Including this helps us give a more realistic estimate.
             </p>
             
             <p className="text-luxo-charcoal font-medium mb-4">Do you want the new floor in the kitchen as well?</p>
             <SelectionGroup
                selectedValue={answers.includeKitchen}
                onChange={(v) => update({ includeKitchen: v as boolean })}
                options={[
                  { value: true, label: "Yes, include the kitchen" },
                  { value: false, label: "Not this time" },
                ]}
              />

              {answers.includeKitchen && (
                 <div className="mt-12 animate-in fade-in slide-in-from-bottom-2">
                  <p className="text-luxo-charcoal font-medium mb-2">How big is your kitchen?</p>
                   <SelectionGroup
                      selectedValue={answers.kitchenSizeRaw}
                      onChange={(v) => update({ kitchenSizeRaw: v as any })}
                      options={[
                        { value: "small", label: "Small — one person cooking at a time" },
                        { value: "medium", label: "Medium — two people can cook without bumping" },
                        { value: "large", label: "Large — open-plan kitchen, usually with an island" },
                        { value: "not_sure", label: "Not sure — recommend for me" },
                      ]}
                    />
                 </div>
              )}
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-3xl font-semibold tracking-tight text-luxo-charcoal mb-3">Hallways & walkways</h2>
            <p className="text-luxo-lava mb-8 text-lg font-light">
              Hallways add small square metres, but can change the finishing cost. Choose what applies and we’ll factor it in.
            </p>
             <p className="text-luxo-charcoal font-medium mb-4">Include hallways and walk-through areas?</p>
             <SelectionGroup
                selectedValue={answers.includeHallways}
                onChange={(v) => update({ includeHallways: v as boolean })}
                options={[
                  { value: true, label: "Yes, include them" },
                  { value: false, label: "No, leave them out" },
                ]}
              />
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="text-3xl font-semibold tracking-tight text-luxo-charcoal mb-3">Do you have internal stairs?</h2>
            <p className="text-luxo-lava mb-8 text-lg font-light">
              Stairs involve specialised cutting and edging, so knowing the number helps us estimate the labour correctly.
            </p>
            <p className="text-luxo-charcoal font-medium mb-4">Will your stairs need new flooring?</p>
            <div className="flex flex-col gap-3">
             <OptionCard
                title="No stairs"
                subtitle="Single level home"
                detail=""
                active={answers.stairsBand === "none"}
                onClick={() => update({ stairsBand: "none" })}
             />
             <OptionCard
                title="About 12–14 steps"
                subtitle="Standard Flight"
                detail="Typical single story jump."
                active={answers.stairsBand === "12_14"}
                onClick={() => update({ stairsBand: "12_14" })}
             />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button 
                  onClick={() => update({ stairsBand: "15_17" })}
                  className={`p-4 rounded-xl border text-left transition-all ${answers.stairsBand === "15_17" ? "bg-luxo-teal text-white border-luxo-teal" : "bg-white border-luxo-pistachio text-luxo-charcoal hover:bg-luxo-pistachio/50"}`}>
                  <div className="font-semibold">About 15–17 steps</div>
                </button>
                <button 
                  onClick={() => update({ stairsBand: "18_20" })}
                  className={`p-4 rounded-xl border text-left transition-all ${answers.stairsBand === "18_20" ? "bg-luxo-teal text-white border-luxo-teal" : "bg-white border-luxo-pistachio text-luxo-charcoal hover:bg-luxo-pistachio/50"}`}>
                  <div className="font-semibold">About 18–20 steps</div>
                </button>
             </div>
             <button 
                  onClick={() => update({ stairsBand: "20_plus" })}
                  className={`p-4 rounded-xl border text-left transition-all ${answers.stairsBand === "20_plus" ? "bg-luxo-teal text-white border-luxo-teal" : "bg-white border-luxo-pistachio text-luxo-charcoal hover:bg-luxo-pistachio/50"}`}>
                  <div className="font-semibold">More than 20 steps</div>
                </button>
            </div>
          </>
        )}

        {step === 6 && (
          <>
             <h2 className="text-3xl font-semibold tracking-tight text-luxo-charcoal mb-3">How even does your floor feel?</h2>
             <p className="text-luxo-lava mb-8 text-lg font-light">
               Don’t worry — most homes aren’t perfectly level. This just helps us predict whether minor or moderate levelling might be needed.
             </p>
             <SelectionGroup
                selectedValue={answers.floorEvenness}
                onChange={(v) => update({ floorEvenness: v as any })}
                options={[
                  { value: "mostly_even", label: "Mostly even — feels flat" },
                  { value: "little_uneven", label: "A little uneven — some dips or joins" },
                  { value: "very_uneven", label: "Very uneven — clear highs and lows" },
                  { value: "not_sure", label: "Not sure — assume normal" },
                ]}
              />
          </>
        )}

        {step === 7 && (
          <>
             <h2 className="text-3xl font-semibold tracking-tight text-luxo-charcoal mb-3">What’s on your floors now?</h2>
             <p className="text-luxo-lava mb-4 text-lg font-light">
               Different old floors take different effort to remove. This helps us avoid under- or over-estimating removal costs.
             </p>
             <p className="text-sm text-luxo-lava mb-4">Select all that apply.</p>
             <SelectionGroup
                selectedValue={answers.currentFlooring}
                onChange={toggleFlooring}
                multi
                options={[
                  { value: "carpet", label: "Carpet" },
                  { value: "tiles", label: "Tiles" },
                  { value: "floorboards", label: "Floorboards (laminate / vinyl / hybrid / timber)" },
                  { value: "concrete", label: "Concrete slab" },
                  { value: "not_sure", label: "Not Sure" },
                ]}
              />
          </>
        )}

        {step === 8 && (
          <>
            <h2 className="text-3xl font-semibold tracking-tight text-luxo-charcoal mb-3">How should we finish the edges?</h2>
            <p className="text-luxo-lava mb-8 text-lg font-light">
              Edge finishing can slightly change the final labour cost. Choose whichever you’re leaning towards — it won’t lock you in.
            </p>
            <div className="grid gap-4">
              <OptionCard
                title="Scotia"
                subtitle="Neat & Budget Friendly"
                detail="Scotia — neat and budget-friendly. A small concave beading that sits against your existing skirting boards. No painting required."
                active={answers.finishType === "scotia"}
                onClick={() => update({ finishType: "scotia" })}
              />
               <OptionCard
                title="Skirting Replacement"
                subtitle="Premium Clean Look"
                detail="Skirting — removed and refitted by a carpenter for a premium look. Provides the most seamless finish."
                active={answers.finishType === "skirting"}
                onClick={() => update({ finishType: "skirting" })}
              />
               <OptionCard
                title="Not Sure"
                subtitle="Decide Later"
                detail="I’m not sure yet — show me a safe range."
                active={answers.finishType === "not_sure"}
                onClick={() => update({ finishType: "not_sure" })}
              />
            </div>
          </>
        )}

        {step === 9 && (
           <>
            <h2 className="text-3xl font-semibold tracking-tight text-luxo-charcoal mb-3">Where should we send your estimate?</h2>
            <p className="text-luxo-lava mb-8 text-lg font-light">
              We’ll send your full breakdown instantly. No spam — just your estimate.
            </p>
            <div className="grid gap-5">
              <div>
                <label className="block text-sm font-medium text-luxo-charcoal mb-1">
                  Name <span className="text-luxo-teal">*</span>
                </label>
                <input 
                  type="text" 
                  value={answers.name}
                  onChange={(e) => update({ name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent outline-none transition-all bg-luxo-charcoal text-white placeholder:text-zinc-400 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-zinc-800 focus:ring-luxo-teal'}`}
                  placeholder="e.g. Jane Doe"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1 font-medium">❌ {errors.name}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 <div>
                    <label className="block text-sm font-medium text-luxo-charcoal mb-1">
                      Suburb & postcode <span className="text-luxo-teal">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={answers.suburb}
                      onChange={(e) => update({ suburb: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent outline-none transition-all bg-luxo-charcoal text-white placeholder:text-zinc-400 ${errors.suburb ? 'border-red-500 focus:ring-red-500' : 'border-zinc-800 focus:ring-luxo-teal'}`}
                      placeholder="e.g. Richmond"
                    />
                    {errors.suburb && <p className="text-red-600 text-sm mt-1 font-medium">❌ {errors.suburb}</p>}
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-luxo-charcoal mb-1">
                      Mobile <span className="text-luxo-teal">*</span>
                    </label>
                    <input 
                      type="tel" 
                      value={answers.mobile}
                      onChange={(e) => update({ mobile: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent outline-none transition-all bg-luxo-charcoal text-white placeholder:text-zinc-400 ${errors.mobile ? 'border-red-500 focus:ring-red-500' : 'border-zinc-800 focus:ring-luxo-teal'}`}
                      placeholder="0400 000 000"
                    />
                    {errors.mobile && <p className="text-red-600 text-sm mt-1 font-medium">❌ {errors.mobile}</p>}
                 </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-luxo-charcoal mb-1">
                  Email (optional)
                </label>
                <input 
                  type="email" 
                  value={answers.email}
                  onChange={(e) => update({ email: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent outline-none transition-all bg-luxo-charcoal text-white placeholder:text-zinc-400 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-zinc-800 focus:ring-luxo-teal'}`}
                  placeholder="jane@example.com"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1 font-medium">❌ {errors.email}</p>}
              </div>
              <p className="text-xs text-luxo-lava mt-2">
                 We only use your details to send your estimate and help with your flooring project — no spam.
              </p>
            </div>
           </>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-luxo-pistachio md:relative md:bg-transparent md:border-t-0 md:p-0 mt-12 z-50">
         <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <Button 
              variant="ghost" 
              onClick={handleBack} 
              disabled={step === 0}
              className="px-2 sm:px-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            
            <Button 
              onClick={handleNext}
              variant="brand"
              className="shadow-lg shadow-luxo-teal/20 min-w-[140px]"
            >
              {step === TOTAL_STEPS - 1 ? "Get Estimate" : "Next"}
              {step !== TOTAL_STEPS - 1 && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
         </div>
      </div>
      {/* Spacer for fixed footer on mobile */}
      <div className="h-24 md:h-0" />
    </div>
  );
};