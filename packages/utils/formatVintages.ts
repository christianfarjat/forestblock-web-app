export function formatVintages(
  vintages: string[] | string | undefined
): string {
  return Array.isArray(vintages) ? vintages.join(" - ") : vintages || "Año";
}
