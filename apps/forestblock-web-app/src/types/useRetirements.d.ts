import { Project } from "./project";

export interface Quote {
  uuid: string;
  created_at: string;
  updated_at: string;
  credential_id: number;
  asset_price_source_id: string;
  quantity_tonnes: number;
  cost_usdc: number;
  consumed: number;
}

export interface Order {
  created_at: string;
  updated_at: string;
  status: string;
}

interface RetireeProfile {
  handle: string;
  createdAt: number;
  updatedAt: number;
  address: string;
  username: string;
  description: string;
  profileImgUrl: string;
  nonce: number;
}

interface Token {
  id: string;
  address: string;
  tokenId: number;
  name: string;
  isExAnte: boolean;
  symbol: string;
}

interface CreditId {
  vintage: number;
  projectId: string;
  creditId: string;
}

export interface OrderQuote {
  uuid: string;
  created_at: string;
  updated_at: string;
  credential_id: number;
  asset_price_source_id: string;
  quantity_tonnes: number;
  cost_usdc: number;
  consumed: number;
}

export interface Order {
  created_at: string;
  updated_at: string;
  status: string;
  quote: OrderQuote;
  completed_at: string | null;
  transaction_hash: string | null;
  retirement_message: string;
  beneficiary_name: string;
  beneficiary_address: string;
}

export interface QuoteRef {
  quoteId: string;
}

export interface Retirement {
  _id: MongoId;
  project: Project;
  payment: MongoId | string;
  quote: QuoteRef;
  order: Order;
  walletAddress: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PDFParams {
  beneficiaryName: string;
  retirementMessage: string;
  createdAt: string;
  quantityTonnes: number;
  retirementId: string;
  projectName: string;
  projectMethodologyType: string;
  projectMethodology: string;
  projectType: string;
  projectUrl: string;
}
