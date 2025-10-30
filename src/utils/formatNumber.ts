export const formatNumber = (value: number): string => {
  const [integerPart, decimalPart] = value.toFixed(2).split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formattedInteger},${decimalPart}`;
};
