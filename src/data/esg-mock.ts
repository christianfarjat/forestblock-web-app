/**
 * ESG Mock Data — DEMO ONLY
 * For demonstration purposes. Real data comes from API/backend.
 */

export const pillarMeta = {
  environmental: { label: 'Environmental', icon: 'leaf', color: 'primary', abbr: 'E' },
  social: { label: 'Social', icon: 'people', color: 'secondary', abbr: 'S' },
  governance: { label: 'Governance', icon: 'shield', color: 'accent', abbr: 'G' },
} as const;

export const statusMeta = {
  on_track: { label: 'On Track', color: 'success', textColor: 'text' },
  attention: { label: 'Attention', color: 'warning', textColor: 'text' },
  at_risk: { label: 'At Risk', color: 'danger', textColor: 'text' },
} as const;

export const evidenceMeta = {
  verified: { label: 'Verified', color: 'success' },
  partial: { label: 'Partial', color: 'warning' },
  missing: { label: 'Missing', color: 'danger' },
} as const;

export const frameworkMeta = {
  ESRS: 'EU Sustainability Reporting Standard',
  GRI: 'Global Reporting Initiative 2021',
  SASB: 'Sustainability Accounting Standards Board',
  'GHG Protocol': 'Greenhouse Gas Protocol',
  CDP: 'Carbon Disclosure Project',
} as const;

export const esgOverviewData = {
  organization: 'ForestBlock Demo Org',
  reportingPeriod: '2024',
  lastUpdated: '2026-06-19',

  // ESG KPI Summary
  kpis: {
    environmental: {
      value: 1240,
      unit: 'tCO2e',
      label: 'Total Emissions',
      trend: -12,
      trendDirection: 'down',
      status: 'on_track',
      target: 1500,
    },
    social: {
      value: 94,
      unit: '%',
      label: 'Community Satisfaction',
      trend: 8,
      trendDirection: 'up',
      status: 'on_track',
      target: 90,
    },
    governance: {
      value: 87,
      unit: '%',
      label: 'Audit Readiness',
      trend: 5,
      trendDirection: 'up',
      status: 'on_track',
      target: 95,
    },
  },

  // Pillar detail cards
  pillars: [
    {
      type: 'environmental',
      totalIndicators: 24,
      completeness: 92,
      status: 'on_track',
      highlights: [
        { label: 'Scope 1', value: '340 tCO2e', trend: -8 },
        { label: 'Scope 2', value: '520 tCO2e', trend: -15 },
        { label: 'Scope 3', value: '380 tCO2e', trend: -10 },
      ],
    },
    {
      type: 'social',
      totalIndicators: 18,
      completeness: 85,
      status: 'attention',
      highlights: [
        { label: 'Employee Diversity', value: '42%', trend: 3 },
        { label: 'Training Hours', value: '240h', trend: 12 },
        { label: 'Health & Safety', value: '98%', trend: 0 },
      ],
    },
    {
      type: 'governance',
      totalIndicators: 12,
      completeness: 88,
      status: 'on_track',
      highlights: [
        { label: 'Board Independence', value: '75%', trend: 0 },
        { label: 'Policy Compliance', value: '100%', trend: 0 },
        { label: 'Risk Assessment', value: '94%', trend: 5 },
      ],
    },
  ],

  // Trend data (mock time series)
  trendChartData: [
    { month: 'Jan', environmental: 1320, social: 86, governance: 80 },
    { month: 'Feb', environmental: 1310, social: 87, governance: 82 },
    { month: 'Mar', environmental: 1290, social: 88, governance: 84 },
    { month: 'Apr', environmental: 1270, social: 90, governance: 85 },
    { month: 'May', environmental: 1255, social: 92, governance: 86 },
    { month: 'Jun', environmental: 1240, social: 94, governance: 87 },
  ],

  // Emissions breakdown (Scope 1/2/3)
  emissionsData: [
    { scope: 'Scope 1', emissions: 340, percentage: 27, color: 'primary' },
    { scope: 'Scope 2', emissions: 520, percentage: 42, color: 'secondary' },
    { scope: 'Scope 3', emissions: 380, percentage: 31, color: 'accent' },
  ],

  // Framework coverage
  frameworks: [
    { name: 'ESRS', disclosure: 'Double Materiality', coverage: 85, status: 'on_track' },
    { name: 'GRI', disclosure: 'GRI 305 (Emissions)', coverage: 92, status: 'on_track' },
    { name: 'SASB', disclosure: 'GHG Emissions', coverage: 78, status: 'attention' },
    { name: 'GHG Protocol', disclosure: 'Scope 1, 2, 3', coverage: 88, status: 'on_track' },
    { name: 'CDP', disclosure: 'Climate Change', coverage: 72, status: 'attention' },
  ],

  // Upcoming deadlines
  deadlines: [
    { framework: 'ESRS', dueDate: '2026-07-31', daysLeft: 42, status: 'on_track' },
    { framework: 'CDP Climate', dueDate: '2026-08-15', daysLeft: 57, status: 'on_track' },
    { framework: 'GRI Report', dueDate: '2026-09-30', daysLeft: 103, status: 'on_track' },
  ],

  // Indicators summary
  indicators: [
    {
      id: 'ind_001',
      pillar: 'environmental',
      category: 'Emissions',
      name: 'GHG Emissions (tCO2e)',
      value: 1240,
      unit: 'tCO2e',
      target: 1500,
      status: 'on_track',
      evidence: 'verified',
      frameworks: ['ESRS', 'GRI', 'GHG Protocol'],
    },
    {
      id: 'ind_002',
      pillar: 'environmental',
      category: 'Energy',
      name: 'Renewable Energy Percentage',
      value: 65,
      unit: '%',
      target: 75,
      status: 'attention',
      evidence: 'partial',
      frameworks: ['ESRS', 'GRI'],
    },
    {
      id: 'ind_003',
      pillar: 'environmental',
      category: 'Water',
      name: 'Water Consumption',
      value: 2400,
      unit: 'm³',
      target: 2000,
      status: 'at_risk',
      evidence: 'partial',
      frameworks: ['ESRS'],
    },
    {
      id: 'ind_004',
      pillar: 'social',
      category: 'Labor',
      name: 'Employee Satisfaction Score',
      value: 4.2,
      unit: '/5',
      target: 4.5,
      status: 'attention',
      evidence: 'verified',
      frameworks: ['GRI', 'SASB'],
    },
    {
      id: 'ind_005',
      pillar: 'governance',
      category: 'Ethics',
      name: 'Policy Compliance Rate',
      value: 100,
      unit: '%',
      target: 100,
      status: 'on_track',
      evidence: 'verified',
      frameworks: ['ESRS', 'GRI'],
    },
  ],
};

// Environmental pillar detail data
export const environmentalDetailData = {
  pillarLabel: 'Environmental',
  description: 'Track and report on environmental performance across emissions, energy, water, waste and biodiversity.',

  // KPI widgets
  kpis: {
    scope1: {
      value: 340,
      unit: 'tCO2e',
      label: 'Scope 1 Emissions',
      trend: -8,
      trendDirection: 'down',
      status: 'on_track',
      methodology: 'Fuels, facilities & vehicles (direct combustion)',
    },
    scope2: {
      value: 520,
      unit: 'tCO2e',
      label: 'Scope 2 Emissions',
      trend: -15,
      trendDirection: 'down',
      status: 'on_track',
      methodology: 'Purchased electricity & heating',
    },
    scope3: {
      value: 380,
      unit: 'tCO2e',
      label: 'Scope 3 Emissions',
      trend: -10,
      trendDirection: 'down',
      status: 'on_track',
      methodology: 'Upstream & downstream supply chain',
    },
    renewable: {
      value: 65,
      unit: '%',
      label: 'Renewable Energy',
      trend: 8,
      trendDirection: 'up',
      status: 'attention',
      methodology: 'From total energy consumption',
    },
    water: {
      value: 2400,
      unit: 'm³',
      label: 'Water Consumption',
      trend: 5,
      trendDirection: 'up',
      status: 'at_risk',
      methodology: 'Municipal + groundwater supply',
    },
    waste: {
      value: 180,
      unit: 'tonnes',
      label: 'Waste Generated',
      trend: -12,
      trendDirection: 'down',
      status: 'on_track',
      methodology: 'Total waste across all facilities',
    },
  },

  // Trend data for charts
  emissionsTrend: [
    { month: 'Jan', scope1: 360, scope2: 560, scope3: 410 },
    { month: 'Feb', scope1: 355, scope2: 550, scope3: 405 },
    { month: 'Mar', scope1: 350, scope2: 540, scope3: 400 },
    { month: 'Apr', scope1: 345, scope2: 530, scope3: 390 },
    { month: 'May', scope1: 342, scope2: 525, scope3: 385 },
    { month: 'Jun', scope1: 340, scope2: 520, scope3: 380 },
  ],

  energyTrend: [
    { month: 'Jan', renewable: 58, nonRenewable: 42 },
    { month: 'Feb', renewable: 60, nonRenewable: 40 },
    { month: 'Mar', renewable: 61, nonRenewable: 39 },
    { month: 'Apr', renewable: 63, nonRenewable: 37 },
    { month: 'May', renewable: 64, nonRenewable: 36 },
    { month: 'Jun', renewable: 65, nonRenewable: 35 },
  ],

  // Indicators by category
  indicators: [
    {
      id: 'env_001',
      category: 'Emissions',
      name: 'Scope 1 Emissions (Direct)',
      value: 340,
      unit: 'tCO2e',
      target: 350,
      status: 'on_track',
      evidence: 'verified',
      completeness: 100,
      frameworks: ['ESRS', 'GRI 305-1', 'GHG Protocol'],
      lastUpdated: '2026-06-15',
    },
    {
      id: 'env_002',
      category: 'Emissions',
      name: 'Scope 2 Emissions (Electricity)',
      value: 520,
      unit: 'tCO2e',
      target: 550,
      status: 'on_track',
      evidence: 'verified',
      completeness: 100,
      frameworks: ['ESRS', 'GRI 305-2', 'GHG Protocol'],
      lastUpdated: '2026-06-10',
    },
    {
      id: 'env_003',
      category: 'Emissions',
      name: 'Scope 3 Emissions (Supply Chain)',
      value: 380,
      unit: 'tCO2e',
      target: 400,
      status: 'on_track',
      evidence: 'partial',
      completeness: 75,
      frameworks: ['ESRS', 'GRI 305-3', 'GHG Protocol', 'CDP'],
      lastUpdated: '2026-05-30',
    },
    {
      id: 'env_004',
      category: 'Energy',
      name: 'Total Energy Consumption',
      value: 8900,
      unit: 'MWh',
      target: 8800,
      status: 'attention',
      evidence: 'verified',
      completeness: 100,
      frameworks: ['ESRS', 'GRI 302-1', 'SASB'],
      lastUpdated: '2026-06-12',
    },
    {
      id: 'env_005',
      category: 'Energy',
      name: 'Renewable Energy Percentage',
      value: 65,
      unit: '%',
      target: 75,
      status: 'attention',
      evidence: 'partial',
      completeness: 90,
      frameworks: ['ESRS', 'GRI 302-1'],
      lastUpdated: '2026-06-05',
    },
    {
      id: 'env_006',
      category: 'Water',
      name: 'Water Withdrawal',
      value: 2400,
      unit: 'm³',
      target: 2000,
      status: 'at_risk',
      evidence: 'partial',
      completeness: 60,
      frameworks: ['ESRS', 'GRI 303-3', 'SASB'],
      lastUpdated: '2026-05-20',
    },
    {
      id: 'env_007',
      category: 'Water',
      name: 'Water Recycled',
      value: 320,
      unit: 'm³',
      target: 500,
      status: 'attention',
      evidence: 'missing',
      completeness: 20,
      frameworks: ['ESRS', 'GRI 303-4'],
      lastUpdated: '2026-04-10',
    },
    {
      id: 'env_008',
      category: 'Waste',
      name: 'Total Waste Generated',
      value: 180,
      unit: 'tonnes',
      target: 150,
      status: 'on_track',
      evidence: 'verified',
      completeness: 100,
      frameworks: ['ESRS', 'GRI 306-3', 'SASB'],
      lastUpdated: '2026-06-14',
    },
    {
      id: 'env_009',
      category: 'Waste',
      name: 'Waste Recycled',
      value: 45,
      unit: '%',
      target: 60,
      status: 'attention',
      evidence: 'partial',
      completeness: 85,
      frameworks: ['ESRS', 'GRI 306-4'],
      lastUpdated: '2026-06-01',
    },
    {
      id: 'env_010',
      category: 'Biodiversity',
      name: 'Protected Land Area',
      value: 2400,
      unit: 'hectares',
      target: 2500,
      status: 'on_track',
      evidence: 'verified',
      completeness: 95,
      frameworks: ['ESRS E4-6', 'GRI 304-3'],
      lastUpdated: '2026-06-18',
    },
  ],
};
