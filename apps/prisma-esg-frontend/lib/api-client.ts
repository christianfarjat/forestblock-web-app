import axios, { AxiosInstance } from 'axios';
import type {
  User,
  Organization,
  Membership,
  Framework,
  Indicator,
  Evidence,
  EvidenceDownload,
  Report,
  FrameworkCoverage,
} from '@/types';

class APIClient {
  private client: AxiosInstance;
  private idToken: string | null = null;
  private organizationId: string | null = null;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      if (this.idToken) {
        config.headers.Authorization = `Bearer ${this.idToken}`;
      }
      if (this.organizationId) {
        config.headers['X-Organization-Id'] = this.organizationId;
      }
      return config;
    });
  }

  setContext(idToken: string, organizationId: string) {
    this.idToken = idToken;
    this.organizationId = organizationId;
  }

  clearContext() {
    this.idToken = null;
    this.organizationId = null;
  }

  async getMe(): Promise<User> {
    const { data } = await this.client.get<User>('/auth/me');
    return data;
  }

  async getMyOrganizations(): Promise<Membership[]> {
    const { data } = await this.client.get<Membership[]>('/auth/me/organizations');
    return data;
  }

  async createOrganization(name: string, slug: string, domain?: string): Promise<Organization> {
    const { data } = await this.client.post<Organization>('/organizations', {
      name,
      slug,
      domain,
    });
    return data;
  }

  async getCurrentOrganization(): Promise<Organization> {
    const { data } = await this.client.get<Organization>('/organizations/current');
    return data;
  }

  async listIndicators(pillar?: string): Promise<Indicator[]> {
    const { data } = await this.client.get<Indicator[]>('/indicators', {
      params: pillar ? { pillar } : {},
    });
    return data;
  }

  async getIndicator(id: string): Promise<Indicator> {
    const { data } = await this.client.get<Indicator>(`/indicators/${id}`);
    return data;
  }

  async createIndicator(indicator: {
    pillar: string;
    code: string;
    name: string;
    unit?: string;
    value?: number;
    period?: string;
    status?: string;
    completeness?: number;
  }): Promise<Indicator> {
    const { data } = await this.client.post<Indicator>('/indicators', indicator);
    return data;
  }

  async updateIndicator(
    id: string,
    updates: Partial<{
      pillar: string;
      code: string;
      name: string;
      unit: string;
      value: number;
      period: string;
      status: string;
      completeness: number;
    }>
  ): Promise<Indicator> {
    const { data } = await this.client.patch<Indicator>(`/indicators/${id}`, updates);
    return data;
  }

  async deleteIndicator(id: string): Promise<void> {
    await this.client.delete(`/indicators/${id}`);
  }

  async listEvidence(indicatorId?: string): Promise<Evidence[]> {
    const { data } = await this.client.get<Evidence[]>('/evidence', {
      params: indicatorId ? { indicator_id: indicatorId } : {},
    });
    return data;
  }

  async uploadEvidence(
    file: File,
    indicatorId?: string
  ): Promise<Evidence> {
    const formData = new FormData();
    formData.append('file', file);
    if (indicatorId) {
      formData.append('indicator_id', indicatorId);
    }

    const { data } = await this.client.post<Evidence>('/evidence', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }

  async downloadEvidence(id: string): Promise<EvidenceDownload> {
    const { data } = await this.client.get<EvidenceDownload>(`/evidence/${id}/download`);
    return data;
  }

  async listFrameworks(): Promise<Framework[]> {
    const { data } = await this.client.get<Framework[]>('/frameworks');
    return data;
  }

  async getFrameworkCoverage(): Promise<FrameworkCoverage[]> {
    const { data } = await this.client.get<FrameworkCoverage[]>('/frameworks/coverage');
    return data;
  }

  async listReports(): Promise<Report[]> {
    const { data } = await this.client.get<Report[]>('/reports');
    return data;
  }

  async getReport(id: string): Promise<Report> {
    const { data } = await this.client.get<Report>(`/reports/${id}`);
    return data;
  }

  async createReport(report: {
    title: string;
    period?: string;
  }): Promise<Report> {
    const { data } = await this.client.post<Report>('/reports', report);
    return data;
  }

  async publishReport(id: string): Promise<Report> {
    const { data } = await this.client.post<Report>(`/reports/${id}/publish`, {});
    return data;
  }
}

export const apiClient = new APIClient();
export default APIClient;
