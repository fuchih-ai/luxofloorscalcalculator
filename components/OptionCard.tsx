import React from "react";
import { Check } from "lucide-react";

interface OptionCardProps {
  title: string;
  subtitle: string;
  detail: string;
  active: boolean;
  onClick: () => void;
  priceHint?: string;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  title,
  subtitle,
  detail,
  active,
  onClick,
  priceHint
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex w-full flex-col text-left p-6 rounded-2xl border transition-all duration-300 hover:shadow-md ${
        active
          ? "border-luxo-teal bg-luxo-pistachio/50 ring-1 ring-luxo-teal"
          : "border-luxo-pistachio bg-white hover:border-luxo-teal/50"
      }`}
    >
      <div className="flex w-full items-start justify-between">
        <div className="flex flex-col gap-1">
          <h3 className={`text-lg font-semibold ${active ? "text-luxo-charcoal" : "text-luxo-charcoal"}`}>
            {title}
          </h3>
          {priceHint && <span className="text-xs font-medium text-luxo-teal">{priceHint}</span>}
        </div>
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
            active
              ? "border-luxo-teal bg-luxo-teal text-white"
              : "border-luxo-steel bg-white group-hover:border-luxo-teal"
          }`}
        >
          {active && <Check size={14} strokeWidth={3} />}
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-luxo-lava">{subtitle}</p>
      <p className="mt-2 text-sm text-luxo-lava/80 leading-relaxed font-light">{detail}</p>
    </button>
  );
};