import { Listing } from "@/types/marketplace";

export interface DetailsCardProps {
  listing: Listing | null;
  tonnesToRetire?: number;
  setTonnesToRetire?: (tonnes: number) => void;
  totalCost?: number;
}
