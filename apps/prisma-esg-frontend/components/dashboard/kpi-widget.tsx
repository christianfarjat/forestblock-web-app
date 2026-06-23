import { Card, CardContent } from '@/components/common/card';
import { LucideIcon } from 'lucide-react';

interface KPIWidgetProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  subtitle?: string;
}

export function KPIWidget({ title, value, icon: Icon, color = '#3b82f6', subtitle }: KPIWidgetProps) {
  return (
    <Card variant="outline">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <Icon size={24} style={{ color }} />
        </div>
      </CardContent>
    </Card>
  );
}
