import { Listing } from "@/types/marketplace";
import { Project } from "@/types/project";
import { PaymentDetails } from "@/types/retirement";

export interface PaymentDetailsSectionProps {
  listing: Listing | null;
  paymentDetails: PaymentDetails;
  paymentStatus: string;
  amountReceived: number;
  methodologyName: string;
  project?: Project | null;
  index?: string | number | null;
}

export interface PaymentCheckoutDetailsProps {
  paymentDetails: PaymentDetails | null;
  paymentStatus: string;
  amountReceived: number;
}

export interface ProjectInfoProps {
  listing?: Listing | null;
  methodologyName: string;
  project?: Project | null;
  index?: string | number | null;
}

export interface DepositAddressProps {
  paymentDetails: PaymentDetails;
  currency: {
    logoSrc: string;
    name: string;
    fullName: string;
  };
  network: {
    logoSrc: string;
    name: string;
    fullName: string;
  };
}

export interface DepositDetailsProps {
  address: string;
  qrPayload: string;
}

export interface SelectableItemProps {
  title: string;
  logoSrc: string;
  label: string;
  description: string;
  isLast?: boolean;
}
