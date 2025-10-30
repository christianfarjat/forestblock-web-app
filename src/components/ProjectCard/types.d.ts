export interface OverlayContentProps {
    vintages: string;
    country?: string;
    category?: string;
    name?: string;
    price?: string;
    onPurchase: () => void;
    sdgs: number;
  }