import { Indicator } from '@/types';
import { Card, CardContent } from '@/components/common/card';
import {
  getPillarColor,
  getPillarLabel,
  calculateCompleteness,
  formatPercentage,
} from '@/lib/utils';
import { Leaf } from 'lucide-react';

interface PillarOverviewProps {
  indicators: Indicator[];
  pillar: 'environmental' | 'social' | 'governance';
}

export function PillarOverview({ indicators, pillar }: PillarOverviewProps) {
  const pillarIndicators = indicators.filter(ind => ind.pillar === pillar);
  const completeness = calculateCompleteness(pillarIndicators);
  const color = getPillarColor(pillar);

  const statusCounts = {
    on_track: pillarIndicators.filter(i => i.status === 'on_track').length,
    attention: pillarIndicators.filter(i => i.status === 'attention').length,
    at_risk: pillarIndicators.filter(i => i.status === 'at_risk').length,
    not_started: pillarIndicators.filter(i => i.status === 'not_started').length,
  };

  return (
    <Card variant="outline">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf size={24} style={{ color }} />
              <h3 className="text-lg font-semibold text-gray-900">
                {getPillarLabel(pillar)}
              </h3>
            </div>
            <span className="text-2xl font-bold" style={{ color }}>
              {formatPercentage(completeness)}
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full"
              style={{
                width: `${Math.min(completeness, 100)}%`,
                backgroundColor: color,
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Indicators</p>
              <p className="text-lg font-semibold text-gray-900">
                {pillarIndicators.length}
              </p>
            </div>
            <div>
              <p className="text-gray-600">On Track</p>
              <p className="text-lg font-semibold text-green-600">
                {statusCounts.on_track}
              </p>
            </div>
            <div>
              <p className="text-gray-600">At Risk</p>
              <p className="text-lg font-semibold text-red-600">
                {statusCounts.at_risk}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Attention</p>
              <p className="text-lg font-semibold text-amber-600">
                {statusCounts.attention}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
