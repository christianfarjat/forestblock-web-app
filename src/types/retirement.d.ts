export interface PaymentDetails {
  message: string;
  beneficiary: string;
  paymentData: {
    message: string;
    beneficiary: string;
    tonnesToRetire: number;
    paymentId: string;
    status: string;
    address: string;
    amount: number;
    network: string;
    orderStatus: string;
  };

  order: {
    status: string;
  };
  qrPayload: string;
}

export interface OrderDetails {
  order: {
    created_at: string;
    updated_at: string;
    status: string;
    consumption_metadata: Record<string, unknown>;
    registry_specific_data: Record<string, unknown>;
    quote: { uuid: string };
    completed_at: string | null;
    transaction_hash: string | null;
    retirement_message: string;
    beneficiary_name: string;
    beneficiary_address: string;
    view_retirement_url: string;
    polygonscan_url: string;
  };
  status: string;
  quote: QuoteDetails;
}

export interface QuoteDetails {
  quoteId?: string;
  uuid: string;
  created_at: string;
  updated_at: string;
  credential_id: number;
  asset_price_source_id: string;
  quantity_tonnes: number;
  cost_usdc: number;
  consumed: number;
}

export interface LoadingStates {
  paymentDetails: boolean;
  quoteDetails: boolean;
  orderDetails: boolean;
}

export interface PollingResponse {
  status: string;
  beneficiary_name?: string;
  retirement_message?: string;
  view_retirement_url?: string;
  polygonscan_url?: string;
  quote?: Partial<QuoteDetails>;
}
