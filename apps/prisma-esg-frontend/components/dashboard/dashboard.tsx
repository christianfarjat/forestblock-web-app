'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useIndicators } from '@/hooks/use-indicators';
import { apiClient } from '@/lib/api-client';
import { Layout } from '@/components/common/layout';
import { Card, CardContent, CardHeader } from '@/components/common/card';
import { KPIWidget } from '@/components/dashboard/kpi-widget';
import { PillarOverview } from '@/components/dashboard/pillar-overview';
import { IndicatorCard } from '@/components/indicators/indicator-card';
import { Alert } from '@/components/common/alert';
import { Button } from '@/components/common/button';
import { Modal } from '@/components/common/modal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FrameworkCoverage } from '@/types';
import {
  calculatePillarStats,
  calculateCompleteness,
} from '@/lib/utils';
import {
  TrendingUp,
  BarChart3,
  Plus,
} from 'lucide-react';
import { Input, Select } from '@/components/common/input';
import { canEditIndicators } from '@/lib/permissions';

export function Dashboard() {
  const { currentOrganization, currentRole } = useAuth();
  const { indicators, isLoading, error, createIndicator } = useIndicators();
  const [frameworks, setFrameworks] = useState<FrameworkCoverage[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    if (currentRole) {
      apiClient.setContext(
        localStorage.getItem('firebase-token') || '',
        currentOrganization?.id || ''
      );
      loadFrameworks();
    }
  }, [currentRole, currentOrganization]);

  const loadFrameworks = async () => {
    try {
      const data = await apiClient.getFrameworkCoverage();
      setFrameworks(data);
    } catch (err) {
      console.error('Failed to load frameworks:', err);
    }
  };

  const handleCreateIndicator = async (formData: FormData) => {
    try {
      setCreateError(null);
      await createIndicator({
        pillar: formData.get('pillar') as string,
        code: formData.get('code') as string,
        name: formData.get('name') as string,
        unit: formData.get('unit') as string || undefined,
        value: formData.get('value') ? parseFloat(formData.get('value') as string) : undefined,
        period: formData.get('period') as string || undefined,
        status: 'not_started',
        completeness: 0,
      });
      setShowCreateModal(false);
    } catch (err) {
      setCreateError('Failed to create indicator');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert type="error" message={error} />
      </Layout>
    );
  }

  const pillarStats = calculatePillarStats(indicators);
  const overallCompleteness = calculateCompleteness(indicators);
  const chartData = [
    {
      name: 'Environmental',
      on_track: pillarStats.environmental.onTrack,
      at_risk: pillarStats.environmental.total - pillarStats.environmental.onTrack,
    },
    {
      name: 'Social',
      on_track: pillarStats.social.onTrack,
      at_risk: pillarStats.social.total - pillarStats.social.onTrack,
    },
    {
      name: 'Governance',
      on_track: pillarStats.governance.onTrack,
      at_risk: pillarStats.governance.total - pillarStats.governance.onTrack,
    },
  ];

  const frameworkChartData = frameworks.map(f => ({
    name: f.code,
    coverage: f.coverage_pct,
  }));

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#9ca3af'];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              ESG Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              {currentOrganization?.name}
            </p>
          </div>
          {canEditIndicators(currentRole as 'owner' | 'admin' | 'editor' | 'viewer' | 'auditor' | null) && (
            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              New Indicator
            </Button>
          )}
        </div>

        {/* KPI Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KPIWidget
            title="Overall Completeness"
            value={`${Math.round(overallCompleteness)}%`}
            icon={TrendingUp}
            color="#3b82f6"
          />
          <KPIWidget
            title="Total Indicators"
            value={indicators.length}
            icon={BarChart3}
            color="#10b981"
          />
          <KPIWidget
            title="On Track"
            value={indicators.filter(i => i.status === 'on_track').length}
            icon={TrendingUp}
            color="#10b981"
          />
          <KPIWidget
            title="At Risk"
            value={indicators.filter(i => i.status === 'at_risk').length}
            icon={TrendingUp}
            color="#ef4444"
          />
        </div>

        {/* Pillar Overview */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">ESG Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PillarOverview indicators={indicators} pillar="environmental" />
            <PillarOverview indicators={indicators} pillar="social" />
            <PillarOverview indicators={indicators} pillar="governance" />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Indicator Status Distribution */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                Indicator Status Distribution
              </h3>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="on_track" fill="#10b981" name="On Track" />
                  <Bar dataKey="at_risk" fill="#ef4444" name="At Risk" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Framework Coverage */}
          {frameworkChartData.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  Framework Coverage
                </h3>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={frameworks}
                      dataKey="coverage_pct"
                      nameKey="code"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.code}: ${Math.round(entry.coverage_pct)}%`}
                    >
                      {frameworks.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Indicators List */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Indicators</h2>
          {indicators.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-600 mb-4">No indicators yet</p>
                {canEditIndicators(currentRole as 'owner' | 'admin' | 'editor' | 'viewer' | 'auditor' | null) && (
                  <Button onClick={() => setShowCreateModal(true)}>
                    Create First Indicator
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {indicators.map(indicator => (
                <IndicatorCard key={indicator.id} indicator={indicator} />
              ))}
            </div>
          )}
        </div>

        {/* Create Indicator Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Indicator"
          maxWidth="md"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateIndicator(new FormData(e.currentTarget));
            }}
            className="space-y-4"
          >
            {createError && (
              <Alert type="error" message={createError} />
            )}

            <Select
              label="Pillar"
              name="pillar"
              required
              options={[
                { value: 'environmental', label: 'Environmental' },
                { value: 'social', label: 'Social' },
                { value: 'governance', label: 'Governance' },
              ]}
            />

            <Input
              label="Code"
              name="code"
              placeholder="e.g., GHG-S1"
              required
            />

            <Input
              label="Name"
              name="name"
              placeholder="e.g., Scope 1 emissions"
              required
            />

            <Input
              label="Unit"
              name="unit"
              placeholder="e.g., tCO2e"
            />

            <Input
              label="Value"
              name="value"
              type="number"
              step="0.01"
              placeholder="0.00"
            />

            <Input
              label="Period"
              name="period"
              placeholder="e.g., 2025"
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCreateModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Create Indicator
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
