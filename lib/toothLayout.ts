import { ToothMeta, ToothType } from "./types";

// ---- Universal numbering (1-32) metadata -----------------------------
const MOLARS = [1, 2, 3, 14, 15, 16, 17, 18, 19, 30, 31, 32];
const PREMOLARS = [4, 5, 12, 13, 20, 21, 28, 29];
const CANINES = [6, 11, 22, 27];

const LABELS: Record<number, string> = {
  1: "Upper Right Third Molar",
  2: "Upper Right Second Molar",
  3: "Upper Right First Molar",
  4: "Upper Right Second Premolar",
  5: "Upper Right First Premolar",
  6: "Upper Right Canine",
  7: "Upper Right Lateral Incisor",
  8: "Upper Right Central Incisor",
  9: "Upper Left Central Incisor",
  10: "Upper Left Lateral Incisor",
  11: "Upper Left Canine",
  12: "Upper Left First Premolar",
  13: "Upper Left Second Premolar",
  14: "Upper Left First Molar",
  15: "Upper Left Second Molar",
  16: "Upper Left Third Molar",
  17: "Lower Left Third Molar",
  18: "Lower Left Second Molar",
  19: "Lower Left First Molar",
  20: "Lower Left Second Premolar",
  21: "Lower Left First Premolar",
  22: "Lower Left Canine",
  23: "Lower Left Lateral Incisor",
  24: "Lower Left Central Incisor",
  25: "Lower Right Central Incisor",
  26: "Lower Right Lateral Incisor",
  27: "Lower Right Canine",
  28: "Lower Right First Premolar",
  29: "Lower Right Second Premolar",
  30: "Lower Right First Molar",
  31: "Lower Right Second Molar",
  32: "Lower Right Third Molar",
};

function typeOf(n: number): ToothType {
  if (MOLARS.includes(n)) return "molar";
  if (PREMOLARS.includes(n)) return "premolar";
  if (CANINES.includes(n)) return "canine";
  return "incisor";
}

export const TOOTH_META: ToothMeta[] = Array.from({ length: 32 }, (_, i) => {
  const number = i + 1;
  return {
    number,
    type: typeOf(number),
    arch: number <= 16 ? "upper" : "lower",
    label: LABELS[number],
  };
});

// ---- Geometry ----------------------------------------------------------

export interface ToothLayout {
  meta: ToothMeta;
  cx: number;
  cy: number;
  rotation: number;
  w: number;
  h: number;
}

const CX = 300;
const RX = 225;
const RY = 108;
const UPPER_CY = 186;
const LOWER_CY = 430;
const ANGLE_START = 340; // degrees, rightmost tooth of an arch (index 0)
const ANGLE_END = 200; // degrees, leftmost tooth of an arch (index 15)

const SIZE_BY_TYPE: Record<ToothType, { w: number; h: number }> = {
  molar: { w: 44, h: 38 },
  premolar: { w: 34, h: 36 },
  canine: { w: 28, h: 40 },
  incisor: { w: 24, h: 36 },
};

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function archIndex(number: number): number {
  // Upper arch: tooth 1 -> index 0 (rightmost), tooth 16 -> index 15 (leftmost)
  if (number <= 16) return number - 1;
  // Lower arch: mirrored so it lines up under the upper arch (tooth 17 sits
  // under tooth 16, tooth 32 sits under tooth 1).
  return 32 - number;
}

export function computeLayout(): ToothLayout[] {
  return TOOTH_META.map((meta) => {
    const idx = archIndex(meta.number);
    const t = idx / 15;
    const angle = ANGLE_START + t * (ANGLE_END - ANGLE_START);
    const rad = toRad(angle);
    const cx = CX + RX * Math.cos(rad);

    let cy: number;
    if (meta.arch === "upper") {
      cy = UPPER_CY - RY * Math.sin(rad);
    } else {
      cy = LOWER_CY + RY * Math.sin(rad);
    }

    // Fan the tooth outward slightly so it "points" away from the bite line.
    const rotation =
      meta.arch === "upper" ? angle - 270 : -(angle - 270);

    const { w, h } = SIZE_BY_TYPE[meta.type];
    return { meta, cx, cy, rotation, w, h };
  });
}

// ---- Path builders -------------------------------------------------------

/** Rounded rectangle path, centered at (cx, cy), in local (unrotated) space. */
export function roundedRectPath(
  cx: number,
  cy: number,
  w: number,
  h: number,
  r: number
): string {
  const x = cx - w / 2;
  const y = cy - h / 2;
  const rr = Math.min(r, w / 2, h / 2);
  return [
    `M ${x + rr},${y}`,
    `H ${x + w - rr}`,
    `A ${rr},${rr} 0 0 1 ${x + w},${y + rr}`,
    `V ${y + h - rr}`,
    `A ${rr},${rr} 0 0 1 ${x + w - rr},${y + h}`,
    `H ${x + rr}`,
    `A ${rr},${rr} 0 0 1 ${x},${y + h - rr}`,
    `V ${y + rr}`,
    `A ${rr},${rr} 0 0 1 ${x + rr},${y}`,
    "Z",
  ].join(" ");
}

export function ellipsePath(cx: number, cy: number, rx: number, ry: number): string {
  return [
    `M ${cx - rx},${cy}`,
    `A ${rx},${ry} 0 1 0 ${cx + rx},${cy}`,
    `A ${rx},${ry} 0 1 0 ${cx - rx},${cy}`,
    "Z",
  ].join(" ");
}
