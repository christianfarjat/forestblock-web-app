import { create } from 'zustand';
import { User, Organization, Membership } from '@/types';

interface AuthState {
  user: User | null;
  idToken: string | null;
  organizations: Membership[];
  currentOrganization: Organization | null;
  currentRole: string | null;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setIdToken: (token: string | null) => void;
  setOrganizations: (orgs: Membership[]) => void;
  setCurrentOrganization: (org: Organization | null) => void;
  setCurrentRole: (role: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  selectOrganization: (org: Organization, role: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  idToken: null,
  organizations: [],
  currentOrganization: null,
  currentRole: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setIdToken: (token) => set({ idToken: token }),
  setOrganizations: (organizations) => set({ organizations }),
  setCurrentOrganization: (currentOrganization) => set({ currentOrganization }),
  setCurrentRole: (currentRole) => set({ currentRole }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  logout: () => set({
    user: null,
    idToken: null,
    organizations: [],
    currentOrganization: null,
    currentRole: null,
  }),

  selectOrganization: (org, role) => set({
    currentOrganization: org,
    currentRole: role,
  }),
}));
