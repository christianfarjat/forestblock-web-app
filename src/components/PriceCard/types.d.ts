import { Listing } from "@/types/marketplace";

export interface PriceCardProps {
  listing: Listing | null;
  tonnesToRetire: number;
  setTonnesToRetire: (value: number) => void;
  totalCost: number;
  disabled?: boolean;
}
