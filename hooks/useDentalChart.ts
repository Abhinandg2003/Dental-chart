import { useCallback } from "react";
import { ToothRecord } from "@/lib/types";

interface UseDentalChartArgs {
  records: Record<number, ToothRecord>;
  selected: number | null;
  onSelect: (toothNumber: number | null) => void; // now accepts null
}

// Matches "teeth1".."teeth32" exactly — NOT "teeth1shadow", "teeth1highlight",
// "teeth1hole", "teeth1hole1", "teeth1hole2", etc. Those must never select a
// tooth, per the artwork's id convention.
const TOOTH_ID_RE = /^teeth(\d+)$/;

/**
 * Wires up click-to-select behaviour for the dental chart SVG using event
 * delegation on the root <svg>, so it works regardless of how the artwork
 * itself is structured internally.
 */
export function useDentalChart({ onSelect }: UseDentalChartArgs) {
  const handleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const target = e.target as SVGElement;

      let match = TOOTH_ID_RE.exec(target.id || "");

      // Fallback: some artwork exports duplicate an id via data-name when the
      // literal id had to be suffixed (e.g. "teeth17-2" / data-name="teeth17").
      if (!match) {
        const dataName = target.getAttribute("data-name");
        if (dataName) match = TOOTH_ID_RE.exec(dataName);
      }

      if (match) {
        onSelect(Number(match[1]));
      } else {
        onSelect(null); // clicked outside any tooth → unselect
      }
      // Any other target (shadow/highlight/hole paths, gum shapes, etc.)
      // intentionally does nothing.
    },
    [onSelect]
  );

  return { handleClick };
}
