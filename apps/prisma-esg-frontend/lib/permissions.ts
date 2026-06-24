import { MembershipRole } from '@/types';

export type Permission =
  | 'org:read'
  | 'org:manage'
  | 'org:members'
  | 'indicator:read'
  | 'indicator:write'
  | 'evidence:read'
  | 'evidence:write'
  | 'disclosure:read'
  | 'disclosure:write'
  | 'report:read'
  | 'report:write'
  | 'report:publish'
  | 'audit:read';

const ROLE_PERMISSIONS: Record<MembershipRole, Permission[]> = {
  owner: [
    'org:read',
    'org:manage',
    'org:members',
    'indicator:read',
    'indicator:write',
    'evidence:read',
    'evidence:write',
    'disclosure:read',
    'disclosure:write',
    'report:read',
    'report:write',
    'report:publish',
    'audit:read',
  ],
  admin: [
    'org:read',
    'org:members',
    'indicator:read',
    'indicator:write',
    'evidence:read',
    'evidence:write',
    'disclosure:read',
    'disclosure:write',
    'report:read',
    'report:write',
    'report:publish',
    'audit:read',
  ],
  editor: [
    'org:read',
    'indicator:read',
    'indicator:write',
    'evidence:read',
    'evidence:write',
    'disclosure:read',
    'disclosure:write',
    'report:read',
    'report:write',
    'audit:read',
  ],
  viewer: ['org:read', 'indicator:read', 'evidence:read', 'disclosure:read', 'report:read', 'audit:read'],
  auditor: ['org:read', 'indicator:read', 'evidence:read', 'disclosure:read', 'report:read', 'audit:read'],
};

export function hasPermission(role: MembershipRole | null, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canEditIndicators(role: MembershipRole | null): boolean {
  return hasPermission(role, 'indicator:write');
}

export function canUploadEvidence(role: MembershipRole | null): boolean {
  return hasPermission(role, 'evidence:write');
}

export function canPublishReport(role: MembershipRole | null): boolean {
  return hasPermission(role, 'report:publish');
}

export function canManageMembers(role: MembershipRole | null): boolean {
  return hasPermission(role, 'org:members');
}

export function canManageOrganization(role: MembershipRole | null): boolean {
  return hasPermission(role, 'org:manage');
}
