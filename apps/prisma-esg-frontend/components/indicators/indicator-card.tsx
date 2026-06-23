import { Indicator } from '@/types';
import { Card, CardContent } from '@/components/common/card';
import {
  getStatusColor,
  getStatusLabel,
  getPillarColor,
  getPillarLabel,
  formatPercentage,
} from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

interface IndicatorCardProps {
  indicator: Indicator;
  onClick?: () => void;
}

export function IndicatorCard({ indicator, onClick }: IndicatorCardProps) {
  const statusColor = getStatusColor(indicator.status);
  const pillarColor = getPillarColor(indicator.pillar);

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-lg transition-shadow"
    >
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {getPillarLabel(indicator.pillar)}
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-1">
                {indicator.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{indicator.code}</p>
            </div>
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: pillarColor }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Value</span>
              <span className="text-lg font-semibold text-gray-900">
                {indicator.value !== undefined ? `${indicator.value} ${indicator.unit || ''}` : 'N/A'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completeness</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatPercentage(indicator.completeness)}
              </span>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${Math.min(indicator.completeness, 100)}%`,
                backgroundColor: statusColor,
              }}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: statusColor }}
            >
              <TrendingUp size={14} />
              {getStatusLabel(indicator.status)}
            </span>
            {indicator.period && (
              <span className="text-sm text-gray-500">{indicator.period}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
