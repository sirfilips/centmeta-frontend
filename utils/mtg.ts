export const CATEGORY_INFO: Record<string, { icon: string; dotColor: string }> =
  {
    Creature: { icon: "ms-creature", dotColor: "text-emerald-500" },
    Istantanei: { icon: "ms-instant", dotColor: "text-blue-500" },
    Stregonerie: { icon: "ms-sorcery", dotColor: "text-red-500" },
    Artefatti: { icon: "ms-artifact", dotColor: "text-slate-400" },
    Incantesimi: { icon: "ms-enchantment", dotColor: "text-purple-500" },
    Planeswalker: { icon: "ms-planeswalker", dotColor: "text-pink-500" },
    Terre: { icon: "ms-land", dotColor: "text-yellow-600" },
  };

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
