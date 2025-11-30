import React from "react";
import { Check } from "lucide-react";

interface Option<T> {
  value: T;
  label: string;
}

interface SelectionGroupProps<T extends string | number | boolean> {
  options: Option<T>[];
  selectedValue: T | T[];
  onChange: (value: T) => void;
  multi?: boolean;
}

export function SelectionGroup<T extends string | number | boolean>({
  options,
  selectedValue,
  onChange,
  multi = false,
}: SelectionGroupProps<T>) {
  const isSelected = (val: T) => {
    if (multi && Array.isArray(selectedValue)) {
      return selectedValue.includes(val);
    }
    return selectedValue === val;
  };

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {options.map((opt) => {
        const active = isSelected(opt.value);
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`
              relative inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200
              ${
                active
                  ? "bg-luxo-teal text-white shadow-md ring-2 ring-luxo-teal ring-offset-2 ring-offset-luxo-glass"
                  : "bg-white text-luxo-lava border border-luxo-pistachio hover:border-luxo-teal hover:text-luxo-charcoal hover:bg-luxo-pistachio/30"
              }
            `}
          >
            {active && <Check size={14} className="text-white" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}