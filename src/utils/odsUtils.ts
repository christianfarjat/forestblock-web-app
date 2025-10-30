export const odsImageExtensions: Record<number, string> = {
  1: "png",
  2: "png",
  3: "jpg",
  4: "png",
  5: "jpg",
  6: "png",
  7: "png",
  8: "png",
  9: "png",
  10: "png",
  11: "png",
  12: "png",
  13: "png",
  14: "png",
  15: "png",
  16: "jpg",
  17: "png",
};

export const getOdsImage = (goalNumber: number): string => {
  const extension = odsImageExtensions[goalNumber];
  if (!extension) {
    throw new Error(`No extension found for goal ${goalNumber}`);
  }
  return `/images/ods/${goalNumber}.${extension}`;
};
