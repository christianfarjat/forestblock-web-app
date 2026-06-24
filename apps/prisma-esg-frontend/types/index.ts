export type UUID = string & { readonly __brand: 'UUID' };

export type Pillar = 'environmental' | 'social' | 'governance';

export type IndicatorStatus = 'not_started' | 'on_track' | 'attention' | 'at_risk';

export type EvidenceState = 'uploaded' | 'verified' | 'rejected';

export type ReportStatus = 'draft' | 'in_review' | 'published';

export type MembershipRole = 'owner' | 'admin' | 'editor' | 'viewer' | 'auditor';

export interface User {
  id: UUID;
  firebase_uid: string;
  email: string;
  display_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: UUID;
  name: string;
  slug: string;
  domain?: string;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  id: UUID;
  user_id: UUID;
  organization_id: UUID;
  role: MembershipRole;
  created_at: string;
  updated_at: string;
  organization?: Organization;
}

export interface Framework {
  id: UUID;
  code: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Indicator {
  id: UUID;
  organization_id: UUID;
  pillar: Pillar;
  code: string;
  name: string;
  unit?: string;
  value?: number;
  period?: string;
  status: IndicatorStatus;
  completeness: number;
  created_at: string;
  updated_at: string;
}

export interface Evidence {
  id: UUID;
  organization_id: UUID;
  indicator_id?: UUID;
  filename: string;
  gcs_path: string;
  content_type?: string;
  size_bytes?: number;
  state: EvidenceState;
  uploaded_by?: UUID;
  created_at: string;
  updated_at: string;
}

export interface EvidenceDownload {
  filename: string;
  signed_url: string;
}

export interface Disclosure {
  id: UUID;
  organization_id: UUID;
  framework_id: UUID;
  indicator_id?: UUID;
  requirement_ref: string;
  status: 'covered' | 'partial' | 'gap';
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: UUID;
  organization_id: UUID;
  title: string;
  period?: string;
  status: ReportStatus;
  gcs_path?: string;
  created_by?: UUID;
  created_at: string;
  updated_at: string;
}

export interface FrameworkCoverage {
  code: string;
  name: string;
  total: number;
  covered: number;
  coverage_pct: number;
}

export interface AuditLogEntry {
  id: UUID;
  organization_id: UUID;
  actor_user_id?: UUID;
  action: string;
  entity_type: string;
  entity_id?: UUID;
  payload?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
