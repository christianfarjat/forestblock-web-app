// ESG Domain Types

export type IndicatorStatus = 'on_track' | 'attention' | 'at_risk';
export type EvidenceState = 'verified' | 'partial' | 'missing';
export type Pillar = 'environmental' | 'social' | 'governance';
export type FrameworkId = 'ESRS' | 'GRI' | 'SASB' | 'GHG Protocol' | 'CDP';

export interface Indicator {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  target?: number;
  status: IndicatorStatus;
  evidence: EvidenceState;
  frameworks?: string[];
}

export interface KPI {
  label: string;
  value: number | string;
  unit?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: number;
  };
  target?: number;
  status?: IndicatorStatus;
  methodology?: string;
}

export interface Document {
  id: string;
  name: string;
  indicator: string;
  pillar: Pillar;
  type: string;
  version: string;
  source: string;
  validation: EvidenceState;
  uploadedBy: string;
  lastUpdated: string;
}

export interface Disclosure {
  id: string;
  topic: string;
  datapoint: string;
  pillar: Pillar;
  indicator: string;
  coverage: EvidenceState;
  completeness: number;
}

export interface Report {
  id: string;
  framework: FrameworkId;
  name: string;
  period: string;
  status: 'in_progress' | 'review' | 'published';
  coverage: number;
  pillars: Pillar[];
  deadline: string;
  daysLeft: number;
}

export interface TrendData {
  [key: string]: string | number;
}

export interface ChartLine {
  key: string;
  name: string;
  color: string;
}

export interface ChartBar {
  key: string;
  name: string;
  color: string;
}
