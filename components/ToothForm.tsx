"use client";

import { TOOTH_META } from "@/lib/toothLayout";
import { Procedure, ToothRecord } from "@/lib/types";

interface ToothFormProps {
  toothNumber: number;
  record: ToothRecord;
  onChange: (record: ToothRecord) => void;
}

const OPTIONS: { value: Procedure; label: string; hint: string }[] = [
  { value: "none", label: "No treatment", hint: "Ivory" },
  { value: "root-canal", label: "Root canal", hint: "Yellow" },
  { value: "remove", label: "Remove", hint: "Red" },
];

const SWATCH: Record<Procedure, string> = {
  none: "bg-[#FAF6EC] border-stone-300",
  "root-canal": "bg-yellow-300 border-yellow-500",
  remove: "bg-red-500 border-red-600",
};

export default function ToothForm({
  toothNumber,
  record,
  onChange,
}: ToothFormProps) {
  const meta = TOOTH_META[toothNumber - 1];

  return (
    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-teal-600">
            Tooth #{meta.number} &middot; {meta.type}
          </p>
          <h3 className="text-lg font-semibold text-stone-800">
            {meta.label}
          </h3>
        </div>
        <span
          className={`h-6 w-6 shrink-0 rounded-full border-2 ${SWATCH[record.procedure]}`}
          aria-hidden
        />
      </div>

      <fieldset className="mb-4">
        <legend className="text-sm font-medium text-stone-600 mb-2">
          Treatment
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {OPTIONS.map((opt) => {
            const active = record.procedure === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ ...record, procedure: opt.value })}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-teal-600 bg-teal-50 text-teal-700"
                    : "border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="block">
        <span className="text-sm font-medium text-stone-600">Notes</span>
        <textarea
          value={record.notes}
          onChange={(e) => onChange({ ...record, notes: e.target.value })}
          placeholder="e.g. distal caries, sensitivity on cold..."
          rows={3}
          className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </label>
    </div>
  );
}
