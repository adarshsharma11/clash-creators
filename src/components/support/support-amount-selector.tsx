"use client";

import { SUPPORT_PRESETS } from "@/lib/support-amount";
import { SupportAmountOption } from "./support-amount-option";

interface SupportAmountSelectorProps {
  selectedAmount: number | null;
  onSelect: (amount: number) => void;
}

export function SupportAmountSelector({
  selectedAmount,
  onSelect,
}: SupportAmountSelectorProps) {
  return (
    <section>
      <h3 className="mb-4 text-lg font-bold tracking-tight">Choose Support</h3>
      <div
        role="radiogroup"
        aria-label="Support point amounts"
        className="grid grid-cols-3 gap-3"
      >
        {SUPPORT_PRESETS.map((amount, index) => (
          <SupportAmountOption
            key={amount}
            amount={amount}
            selected={selectedAmount === amount}
            onSelect={onSelect}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
