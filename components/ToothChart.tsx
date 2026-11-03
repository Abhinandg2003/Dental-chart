"use client";

import { useMemo } from "react";
import { useDentalChart } from "@/hooks/useDentalChart";
import { Procedure, ToothRecord } from "@/lib/types";
import MouthSvg from "./SvgTooth";

interface ToothChartProps {
  records: Record<number, ToothRecord>;
  selected: number | null;
  onSelect: (toothNumber: number) => void;
}

const FILL_BY_PROCEDURE: Record<Exclude<Procedure, "none">, string> = {
  "root-canal": "#FDE047", // yellow-300
  remove: "#EF4444", // red-500
};

// Highlight (gloss) opacity per procedure. "none" isn't listed here — we
// simply don't emit a rule for it, letting the artwork's own baked-in
// opacity="0.4" apply.
const HIGHLIGHT_OPACITY_BY_PROCEDURE: Record<Exclude<Procedure, "none">, number> = {
  "root-canal": 0.2,
  remove: 0.1,
};

const SELECTED_STROKE = "#EAB308"; // yellow-500
const SELECTED_STROKE_WIDTH = 8;

// #teeth1 .. #teeth32, used to give every clickable tooth a pointer cursor
// without touching the underlying artwork file.
const ALL_TOOTH_SELECTORS = Array.from(
  { length: 32 },
  (_, i) => `#teeth${i + 1}`
).join(", ");

export default function ToothChart({
  records,
  selected,
  onSelect,
}: ToothChartProps) {
  const { handleClick } = useDentalChart({ records, selected, onSelect });

  const css = useMemo(() => {
    const rules: string[] = [
      `${ALL_TOOTH_SELECTORS} { cursor: pointer; transition: fill 150ms ease; }`,
    ];

    for (const [toothNumber, record] of Object.entries(records)) {
      if (record.procedure === "none") continue;

      const color = FILL_BY_PROCEDURE[record.procedure];
      rules.push(`#teeth${toothNumber} { fill: ${color}; }`);

      const highlightOpacity = HIGHLIGHT_OPACITY_BY_PROCEDURE[record.procedure];
      rules.push(
        `#teeth${toothNumber}highlight { opacity: ${highlightOpacity}; }`
      );
    }

    if (selected != null) {
      rules.push(
        `#teeth${selected} { stroke: ${SELECTED_STROKE}; stroke-width: ${SELECTED_STROKE_WIDTH}px; stroke-linejoin: round; }`
      );
    }

    return rules.join("\n");
  }, [records, selected]);

  return (
    <div className="w-full px-[50px] ">
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style>{css}</style>
      <MouthSvg
        className="w-full h-auto select-none"
        onClick={handleClick}
        role="img"
        aria-label="Dental chart"
      />
    </div>
  );
}