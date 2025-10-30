import { Match, RetireParams } from "@/types/marketplace";

export type ListingDetailProps = {
  label: string;
  value: string | number | JSX.Element;
};

export interface ListingProps {
  handleRetire: (params: RetireParams) => void;
  matches: Match[];
  selectedVintage: string | undefined;
  displayPrice: string | undefined;
  priceParam: string | null;
  isPricesLoading: boolean;
}
