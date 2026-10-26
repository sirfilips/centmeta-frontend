export const CATEGORY_INFO: Record<
  string,
  { icon: string; dotColor: string; bgColor: string }
> = {
  Creature: {
    icon: "ms-creature",
    dotColor: "text-emerald-500",
    bgColor: "bg-emerald-500",
  },
  Istantanei: {
    icon: "ms-instant",
    dotColor: "text-blue-500",
    bgColor: "bg-blue-500",
  },
  Stregonerie: {
    icon: "ms-sorcery",
    dotColor: "text-red-500",
    bgColor: "bg-red-500",
  },
  Artefatti: {
    icon: "ms-artifact",
    dotColor: "text-slate-400",
    bgColor: "bg-slate-400",
  },
  Incantesimi: {
    icon: "ms-enchantment",
    dotColor: "text-purple-500",
    bgColor: "bg-purple-500",
  },
  Planeswalker: {
    icon: "ms-planeswalker",
    dotColor: "text-pink-500",
    bgColor: "bg-pink-500",
  },
  Terre: {
    icon: "ms-land",
    dotColor: "text-yellow-600",
    bgColor: "bg-yellow-600",
  },
};

export const COLOR_FILTERS: {
  label: string;
  val: string;
  icon: string | null;
}[] = [
  { label: "Tutti", val: "Tutti", icon: null },
  { label: "White", val: "W", icon: "ms ms-w ms-cost shadow-sm" },
  { label: "Blue", val: "U", icon: "ms ms-u ms-cost shadow-sm" },
  { label: "Black", val: "B", icon: "ms ms-b ms-cost shadow-sm" },
  { label: "Red", val: "R", icon: "ms ms-r ms-cost shadow-sm" },
  { label: "Green", val: "G", icon: "ms ms-g ms-cost shadow-sm" },
  { label: "Multi", val: "M", icon: "ms ms-multicolor ms-cost shadow-sm" },
  { label: "Colorless", val: "C", icon: "ms ms-c ms-cost shadow-sm" },
];

export function matchesColorIdentity(
  colorsArray: string[],
  activeColors: string[],
): boolean {
  if (!activeColors || activeColors.length === 0) return true;

  const colors = colorsArray || [];
  const isC = colors.length === 0;
  const isM = colors.length > 1;
  const baseColors = activeColors.filter((a) => a !== "C" && a !== "M");

  if (baseColors.length === 0) {
    return (
      (activeColors.includes("C") && isC) || (activeColors.includes("M") && isM)
    );
  }

  const hasAllSelected = baseColors.every((col) => colors.includes(col));
  const hasNoExtraColors = colors.every((col) => baseColors.includes(col));

  let isMatch = hasAllSelected && hasNoExtraColors;
  if (activeColors.includes("M") && isM && hasAllSelected) {
    isMatch = true;
  }
  if (activeColors.includes("C") && isC) {
    isMatch = true;
  }
  return isMatch;
}
